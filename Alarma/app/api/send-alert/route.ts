import { NextRequest, NextResponse } from "next/server";
import { webpush } from "@/lib/webpush";
import { getSubscriptions, removeSubscription } from "@/lib/subscriptions";

// Нужен Node.js-рантайм: и файловое хранилище, и web-push работают только тут.
export const runtime = "nodejs";

/**
 * POST /api/send-alert
 * Рассылает push-уведомление СРАЗУ на все подписанные устройства (все 4 сотрудника).
 *
 * Вызывается:
 *  - автоматически при оформлении заказа (см. инструкцию в README);
 *  - вручную с кнопки «Симулировать новый заказ» на странице /staff-alert.
 *
 * Тело запроса (всё опционально):
 *  { "title": "...", "body": "...", "orderId": "123" }
 */
export async function POST(req: NextRequest) {
  // Тело может быть пустым — тогда используем значения по умолчанию.
  let payloadInput: { title?: string; body?: string; orderId?: string } = {};
  try {
    payloadInput = await req.json();
  } catch {
    /* пустое тело — это нормально */
  }

  const subscriptions = await getSubscriptions();

  if (subscriptions.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Нет ни одной подписки. Сотрудники ещё не подписались." },
      { status: 200 }
    );
  }

  // Данные, которые получит service worker (public/sw.js).
  const notification = JSON.stringify({
    title: payloadInput.title || "🚨 Новый заказ в ШАРОДУВЫ!",
    body: payloadInput.body || "Скорее оформляем — клиент ждёт свои шары 🎈",
    orderId: payloadInput.orderId || String(Date.now()),
  });

  // Отправляем всем параллельно.
  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(sub, notification, {
        // TTL — сколько секунд push-сервис хранит сообщение, если телефон офлайн.
        TTL: 60,
        urgency: "high",
      })
    )
  );

  // Чистим «мёртвые» подписки (404/410 — устройство отписалось или токен протух).
  let sent = 0;
  let removed = 0;
  await Promise.all(
    results.map(async (res, i) => {
      if (res.status === "fulfilled") {
        sent++;
      } else {
        const statusCode = (res.reason as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await removeSubscription(subscriptions[i].endpoint);
          removed++;
        }
      }
    })
  );

  return NextResponse.json({ ok: true, sent, removed, total: subscriptions.length });
}
