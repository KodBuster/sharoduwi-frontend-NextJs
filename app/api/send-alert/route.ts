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

  return NextResponse.json({
    ok: result.ok,
    sent: result.sent,
    failed: result.failed,
    removed: result.removed,
    total: result.total,
    error: result.error,
    errors: result.errors,
  });
}
