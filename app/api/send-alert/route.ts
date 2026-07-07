import { NextRequest, NextResponse } from "next/server";

import { isStaffAlertAuthenticated } from "@/lib/staff-alert/auth";
import { sendStaffAlert } from "@/lib/staff-alert/send";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!(await isStaffAlertAuthenticated(request))) {
    return NextResponse.json(
      { ok: false, error: "Требуется авторизация" },
      { status: 401 }
    );
  }

  let payload: { title?: string; body?: string; orderId?: string } = {};
  try {
    payload = await request.json();
  } catch {
    /* пустое тело допустимо */
  }

  const result = await sendStaffAlert(payload);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 200 }
    );
  }

  return NextResponse.json({
    ok: true,
    sent: result.sent,
    removed: result.removed,
    total: result.total,
  });
}
