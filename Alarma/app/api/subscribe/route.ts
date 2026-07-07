import { NextRequest, NextResponse } from "next/server";
import { addSubscription } from "@/lib/subscriptions";
import type { PushSubscription } from "web-push";

// Работаем в Node.js-рантайме (нужен доступ к файловой системе).
export const runtime = "nodejs";

/**
 * POST /api/subscribe
 * Сюда сотрудник отправляет свою push-подписку после нажатия кнопки
 * «Подписаться на сигналы». Сохраняем её в общее хранилище.
 */
export async function POST(req: NextRequest) {
  try {
    const sub = (await req.json()) as PushSubscription;

    if (!sub || !sub.endpoint) {
      return NextResponse.json(
        { ok: false, error: "Некорректная подписка" },
        { status: 400 }
      );
    }

    const total = await addSubscription(sub);
    return NextResponse.json({ ok: true, total });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
