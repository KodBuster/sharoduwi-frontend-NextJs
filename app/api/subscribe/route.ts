import { NextRequest, NextResponse } from "next/server";
import type { PushSubscription } from "web-push";

import { addSubscription } from "@/lib/subscriptions";
import { isStaffAlertAuthenticated } from "@/lib/staff-alert/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!(await isStaffAlertAuthenticated(request))) {
    return NextResponse.json(
      { ok: false, error: "Требуется авторизация" },
      { status: 401 }
    );
  }

  try {
    const sub = (await request.json()) as PushSubscription;

    if (!sub?.endpoint) {
      return NextResponse.json(
        { ok: false, error: "Некорректная подписка" },
        { status: 400 }
      );
    }

    const total = await addSubscription(sub);
    return NextResponse.json({ ok: true, total });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Ошибка сервера" },
      { status: 500 }
    );
  }
}
