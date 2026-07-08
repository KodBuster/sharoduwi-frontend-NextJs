export type AlarmSoundId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type AlarmSoundGroupId = "alarm" | "celebration" | "powerful";

export const ALARM_SOUND_STORAGE_KEY = "staff-alert-sound";

export interface AlarmSoundDefinition {
  id: AlarmSoundId;
  name: string;
  description: string;
  emoji: string;
  group: AlarmSoundGroupId;
}

export const ALARM_SOUND_GROUPS: ReadonlyArray<{
  id: AlarmSoundGroupId;
  title: string;
  emoji: string;
}> = [
  { id: "alarm", title: "Тревога", emoji: "🚨" },
  { id: "celebration", title: "Праздник", emoji: "🎉" },
  { id: "powerful", title: "Мощные", emoji: "💥" },
];

export const ALARM_SOUNDS: ReadonlyArray<AlarmSoundDefinition> = [
  {
    id: 0,
    name: "Сирена скорой",
    description: "Чередующиеся громкие тоны",
    emoji: "🚑",
    group: "alarm",
  },
  {
    id: 1,
    name: "Пожарная",
    description: "Нарастающая сирена",
    emoji: "🔥",
    group: "alarm",
  },
  {
    id: 2,
    name: "Красная тревога",
    description: "Резкий военный сигнал",
    emoji: "🆘",
    group: "alarm",
  },
  {
    id: 3,
    name: "Скорый заказ",
    description: "Три быстрых удара — срочно!",
    emoji: "⚡",
    group: "alarm",
  },
  {
    id: 4,
    name: "Шаровой звон",
    description: "Колокольчик и лёгкий «поп»",
    emoji: "🎈",
    group: "celebration",
  },
  {
    id: 5,
    name: "Фанфар",
    description: "Праздничное «та-да!»",
    emoji: "🎺",
    group: "celebration",
  },
  {
    id: 6,
    name: "Кассовый",
    description: "Звон кассы — новый заказ",
    emoji: "💰",
    group: "celebration",
  },
  {
    id: 7,
    name: "Бас",
    description: "Низкий удар + свип",
    emoji: "🔊",
    group: "powerful",
  },
  {
    id: 8,
    name: "Неон",
    description: "Электронный cyber-пульс",
    emoji: "⚡",
    group: "powerful",
  },
  {
    id: 9,
    name: "Сирена доставки",
    description: "Двухтональная курьерская",
    emoji: "🚚",
    group: "powerful",
  },
];

export function isAlarmSoundId(value: number): value is AlarmSoundId {
  return Number.isInteger(value) && value >= 0 && value <= 9;
}

export function getAlarmById(id: AlarmSoundId): AlarmSoundDefinition {
  return ALARM_SOUNDS[id];
}

export function getSoundsByGroup(group: AlarmSoundGroupId): AlarmSoundDefinition[] {
  return ALARM_SOUNDS.filter((sound) => sound.group === group);
}

export function readStoredAlarmSound(): AlarmSoundId {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(ALARM_SOUND_STORAGE_KEY);
  const parsed = raw === null ? 0 : Number(raw);
  return isAlarmSoundId(parsed) ? parsed : 0;
}

export function storeAlarmSound(id: AlarmSoundId): void {
  window.localStorage.setItem(ALARM_SOUND_STORAGE_KEY, String(id));
}

export function isWindowsDesktop(): boolean {
  if (typeof window === "undefined") return false;
  return /Windows/i.test(window.navigator.userAgent);
}

export function supportsStaffPush(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

type BeepFn = (
  freq: number,
  durationMs: number,
  type?: OscillatorType,
  delayMs?: number,
  volume?: number
) => void;

function createBeep(ctx: AudioContext): BeepFn {
  return (freq, durationMs, type = "square", delayMs = 0, volume = 1) => {
    const startAt = ctx.currentTime + delayMs / 1000;
    const endAt = startAt + durationMs / 1000;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    subOsc.type = type;
    osc.frequency.value = freq;
    subOsc.frequency.value = freq * 0.5;

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), startAt + 0.015);
    gain.gain.setValueAtTime(volume, endAt - 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startAt);
    subOsc.start(startAt);
    osc.stop(endAt);
    subOsc.stop(endAt);
  };
}

function subKick(ctx: AudioContext, delayMs = 0, freq = 55, vol = 0.9): void {
  const start = ctx.currentTime + delayMs / 1000;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 2, start);
  osc.frequency.exponentialRampToValueAtTime(freq, start + 0.08);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(vol, start + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.32);
}

export function playAlarmCycle(
  ctx: AudioContext,
  variant: AlarmSoundId,
  beep?: BeepFn
): void {
  const tone = beep ?? createBeep(ctx);

  switch (variant) {
    case 0:
      tone(920, 380, "sawtooth");
      tone(680, 380, "sawtooth", 400);
      tone(920, 380, "sawtooth", 800);
      break;
    case 1:
      tone(520, 220, "triangle");
      tone(780, 220, "triangle", 240);
      tone(1040, 220, "triangle", 480);
      tone(1300, 320, "sawtooth", 720);
      break;
    case 2:
      [880, 660, 880, 660, 880].forEach((f, i) => tone(f, 140, "square", i * 160, 0.85));
      tone(440, 400, "sawtooth", 820, 0.7);
      break;
    case 3:
      subKick(ctx, 0, 60, 1);
      tone(1200, 120, "square", 80, 0.8);
      subKick(ctx, 280, 60, 0.9);
      tone(1200, 120, "square", 360, 0.8);
      subKick(ctx, 560, 60, 0.95);
      tone(1400, 200, "sawtooth", 640, 0.85);
      break;
    case 4:
      tone(1568, 180, "sine", 0, 0.55);
      tone(2093, 120, "triangle", 120, 0.35);
      tone(880, 80, "sine", 200, 0.4);
      tone(1760, 100, "sine", 320, 0.3);
      break;
    case 5:
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 160, "triangle", i * 130, 0.5));
      tone(1318, 350, "sine", 550, 0.6);
      break;
    case 6:
      tone(1800, 90, "sine", 0, 0.7);
      tone(2200, 90, "sine", 110, 0.65);
      tone(1800, 90, "sine", 220, 0.7);
      tone(2400, 140, "triangle", 330, 0.55);
      break;
    case 7: {
      const start = ctx.currentTime + 0.02;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, start);
      osc.frequency.exponentialRampToValueAtTime(32, start + 0.5);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(1, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.6);
      tone(1800, 150, "sawtooth", 480, 0.5);
      break;
    }
    case 8:
      [600, 900, 1200, 900, 600].forEach((f, i) => tone(f, 70, "square", i * 95, 0.45));
      tone(2000, 200, "sawtooth", 500, 0.55);
      break;
    case 9:
      for (let i = 0; i < 4; i++) {
        const base = i * 360;
        tone(740, 170, "sawtooth", base, 0.55);
        tone(980, 170, "sawtooth", base + 180, 0.55);
      }
      break;
  }

  if ("vibrate" in navigator) {
    navigator.vibrate([400, 120, 400, 120, 500]);
  }
}

export function getAlarmCycleInterval(variant: AlarmSoundId): number {
  const intervals: Record<AlarmSoundId, number> = {
    0: 1400,
    1: 1500,
    2: 1300,
    3: 1100,
    4: 1200,
    5: 1300,
    6: 1000,
    7: 1400,
    8: 1100,
    9: 1600,
  };
  return intervals[variant];
}

export function ensureAudioContext(
  current: AudioContext | null
): AudioContext {
  if (current) {
    void current.resume();
    return current;
  }

  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  const ctx = new Ctor();
  void ctx.resume();
  return ctx;
}
