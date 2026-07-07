import { NextRequest, NextResponse } from "next/server";

import {
  STAFF_ALERT_COOKIE,
  createStaffAlertSessionToken,
  getStaffAlertSessionCookieOptions,
  verifyStaffAlertPassword,
} from "@/lib/staff-alert/auth";
import { isStaffAlertPasswordConfigured } from "@/lib/staff-alert/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isStaffAlertPasswordConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Пароль не настроен на сервере (STAFF_ALERT_PASSWORD)." },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  if (!verifyStaffAlertPassword(password)) {
    return NextResponse.json({ ok: false, error: "Неверный пароль" }, { status: 401 });
  }

  const sessionToken = await createStaffAlertSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    STAFF_ALERT_COOKIE,
    sessionToken,
    getStaffAlertSessionCookieOptions()
  );
  return response;
}
