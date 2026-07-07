"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Страница /staff-alert — PWA-сигнализатор для сотрудников ШАРОДУВЫ.
 *
 * Что делает:
 *  1. Регистрирует service worker (/sw.js).
 *  2. По кнопке подписывает устройство на Web Push (VAPID).
 *  3. Отправляет подписку на /api/subscribe.
 *  4. По клику из уведомления (?alarm=1) — включает ОЧЕНЬ громкий
 *     повторяющийся сигнал (3 варианта звука, volume = 1, loop).
 *  5. Даёт кнопку «Симулировать новый заказ» для теста.
 *
 * Звук генерируется через Web Audio API — не нужны mp3-файлы,
 * работает всегда и максимально громко.
 */

// Публичный VAPID-ключ прокидывается из окружения на клиент.
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

// Преобразование base64url-ключа VAPID в Uint8Array (требование PushManager).
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

type Status = "idle" | "loading" | "subscribed" | "error" | "unsupported";

export default function StaffAlertPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [alarmOn, setAlarmOn] = useState(false);

  // Web Audio для громкого сигнала.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Какой из 3 вариантов звука играет сейчас (выбираем случайно при старте).
  const variantRef = useRef<number>(0);

  /* ------------------------- ЗВУК (3 варианта) ------------------------- */

  // Один «гудок»: частота, длительность, тип волны.
  const beep = useCallback(
    (freq: number, durationMs: number, type: OscillatorType = "square") => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      // volume = 1 — максимальная громкость.
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(1, ctx.currentTime + durationMs / 1000 - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    },
    []
  );

  // Проигрывает один цикл выбранного варианта (циклы повторяются по таймеру).
  const playCycle = useCallback(() => {
    const v = variantRef.current;
    if (v === 0) {
      // Вариант 1 — «сирена скорой»: две чередующиеся ноты.
      beep(880, 350, "sawtooth");
      setTimeout(() => beep(660, 350, "sawtooth"), 380);
    } else if (v === 1) {
      // Вариант 2 — резкий прерывистый писк.
      beep(1200, 150, "square");
      setTimeout(() => beep(1200, 150, "square"), 220);
      setTimeout(() => beep(1200, 150, "square"), 440);
    } else {
      // Вариант 3 — тревожная «пожарная» нарастающая.
      beep(500, 200, "triangle");
      setTimeout(() => beep(750, 200, "triangle"), 220);
      setTimeout(() => beep(1000, 300, "triangle"), 440);
    }
    // Дополнительно трясём телефон, если поддерживается.
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 300]);
  }, [beep]);

  const startAlarm = useCallback(() => {
    // Создаём/возобновляем AudioContext (нужен пользовательский жест).
    if (!audioCtxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new Ctor();
    }
    audioCtxRef.current.resume();

    // Случайный вариант звука при каждом запуске.
    variantRef.current = Math.floor(Math.random() * 3);

    setAlarmOn(true);
    playCycle();
    // Повторяем сигнал по кругу (loop), пока не нажмут «Остановить».
    if (alarmTimerRef.current) clearInterval(alarmTimerRef.current);
    alarmTimerRef.current = setInterval(playCycle, 1300);
  }, [playCycle]);

  const stopAlarm = useCallback(() => {
    setAlarmOn(false);
    if (alarmTimerRef.current) {
      clearInterval(alarmTimerRef.current);
      alarmTimerRef.current = null;
    }
    if ("vibrate" in navigator) navigator.vibrate(0);
  }, []);

  /* ---------------------- SW + автозапуск alarm ---------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      setMessage("Ваш браузер не поддерживает push-уведомления 😔");
      return;
    }

    // Регистрируем service worker.
    navigator.serviceWorker.register("/sw.js").catch((e) => {
      setMessage("Не удалось зарегистрировать service worker: " + e.message);
    });

    // Если страницу открыли по клику из уведомления (?alarm=1) — включаем сигнал.
    const params = new URLSearchParams(window.location.search);
    if (params.get("alarm") === "1") {
      // Небольшая задержка, чтобы страница успела отрисоваться.
      setTimeout(() => startAlarm(), 150);
    }

    // Слушаем сообщение от service worker (когда вкладка уже была открыта).
    const onMsg = (event: MessageEvent) => {
      if (event.data?.type === "PLAY_ALARM") startAlarm();
    };
    navigator.serviceWorker.addEventListener("message", onMsg);

    return () => {
      navigator.serviceWorker.removeEventListener("message", onMsg);
      if (alarmTimerRef.current) clearInterval(alarmTimerRef.current);
    };
  }, [startAlarm]);

  /* --------------------------- ПОДПИСКА --------------------------- */

  const subscribe = useCallback(async () => {
    try {
      setStatus("loading");
      setMessage("");

      if (!VAPID_PUBLIC_KEY) {
        throw new Error(
          "Не задан NEXT_PUBLIC_VAPID_PUBLIC_KEY. Сгенерируйте ключи (см. README)."
        );
      }

      // Спрашиваем разрешение на уведомления.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Разрешение на уведомления не выдано.");
      }

      const reg = await navigator.serviceWorker.ready;

      // Создаём push-подписку.
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Отправляем подписку на сервер.
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Ошибка сервера");

      setStatus("subscribed");
      setMessage(`Готово! Устройств подписано: ${json.total}. Теперь добавьте страницу на главный экран 📲`);
    } catch (e) {
      setStatus("error");
      setMessage((e as Error).message);
    }
  }, []);

  /* --------------------- СИМУЛЯЦИЯ ЗАКАЗА --------------------- */

  const simulateOrder = useCallback(async () => {
    setMessage("Отправляю тестовый сигнал на все устройства…");
    try {
      const res = await fetch("/api/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "🚨 Новый заказ в ШАРОДУВЫ!",
          body: "Тестовый заказ — проверка сигнала 🎈",
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setMessage(`Сигнал отправлен! Доставлено устройств: ${json.sent} из ${json.total}.`);
      } else {
        setMessage(json.error || "Не удалось отправить сигнал.");
      }
    } catch (e) {
      setMessage("Ошибка отправки: " + (e as Error).message);
    }
  }, []);

  /* ------------------------------ UI ------------------------------ */

  return (
    <main style={styles.main}>
      <div style={styles.balloons} aria-hidden>
        🎈🎈🎈🎈🎈
      </div>

      <h1 style={styles.title}>🎈 ШАРОДУВЫ</h1>
      <p style={styles.subtitle}>Сигнал о новых заказах для сотрудников</p>

      {/* Большая кнопка подписки */}
      <button
        onClick={subscribe}
        disabled={status === "loading" || status === "subscribed"}
        style={{
          ...styles.bigButton,
          opacity: status === "subscribed" ? 0.7 : 1,
        }}
      >
        {status === "subscribed"
          ? "✅ Вы подписаны"
          : status === "loading"
          ? "⏳ Подписываю…"
          : "🔊 Подписаться на сигналы"}
      </button>

      {/* Кнопка теста */}
      <button onClick={simulateOrder} style={styles.testButton}>
        🧪 Симулировать новый заказ
      </button>

      {/* Управление сигналом */}
      {alarmOn ? (
        <button onClick={stopAlarm} style={styles.stopButton}>
          🛑 ОСТАНОВИТЬ СИГНАЛ
        </button>
      ) : (
        <button onClick={startAlarm} style={styles.playButton}>
          ▶️ Проверить звук сигнала
        </button>
      )}

      {message && <p style={styles.message}>{message}</p>}
      {status === "unsupported" && (
        <p style={styles.hint}>
          Откройте эту страницу в Chrome (Android) или Safari (iPhone, iOS 16.4+).
        </p>
      )}

      <div style={styles.steps}>
        <strong>Как подписаться (1 раз на каждом телефоне):</strong>
        <ol style={styles.ol}>
          <li>Открыть эту страницу в браузере телефона.</li>
          <li>Нажать «🔊 Подписаться на сигналы» и разрешить уведомления.</li>
          <li>Добавить страницу на главный экран (см. инструкцию ниже).</li>
        </ol>
      </div>
    </main>
  );
}

/* -------------------------- Стили (инлайн) -------------------------- */
const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "24px",
    gap: "16px",
    background: "linear-gradient(135deg, #ff6ec7 0%, #a855f7 45%, #ffd93d 100%)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    color: "#fff",
  },
  balloons: { fontSize: "40px", letterSpacing: "6px" },
  title: {
    fontSize: "44px",
    margin: 0,
    fontWeight: 900,
    textShadow: "0 3px 12px rgba(0,0,0,0.25)",
  },
  subtitle: { margin: 0, fontSize: "18px", opacity: 0.95 },
  bigButton: {
    marginTop: "8px",
    padding: "22px 28px",
    fontSize: "24px",
    fontWeight: 800,
    color: "#a21caf",
    background: "#fff",
    border: "none",
    borderRadius: "999px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    cursor: "pointer",
    width: "100%",
    maxWidth: "420px",
  },
  testButton: {
    padding: "16px 24px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#fff",
    background: "rgba(255,255,255,0.18)",
    border: "2px solid #fff",
    borderRadius: "999px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "420px",
  },
  playButton: {
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: 700,
    color: "#7c3aed",
    background: "#ffd93d",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "420px",
  },
  stopButton: {
    padding: "22px 24px",
    fontSize: "22px",
    fontWeight: 900,
    color: "#fff",
    background: "#dc2626",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "420px",
    animation: "none",
    boxShadow: "0 0 0 6px rgba(220,38,38,0.35)",
  },
  message: {
    maxWidth: "460px",
    fontSize: "16px",
    background: "rgba(0,0,0,0.22)",
    padding: "12px 16px",
    borderRadius: "14px",
  },
  hint: { fontSize: "14px", opacity: 0.9, maxWidth: "460px" },
  steps: {
    marginTop: "10px",
    maxWidth: "460px",
    textAlign: "left",
    background: "rgba(255,255,255,0.15)",
    padding: "16px 18px",
    borderRadius: "16px",
    fontSize: "15px",
  },
  ol: { margin: "8px 0 0", paddingLeft: "20px", lineHeight: 1.6 },
};
