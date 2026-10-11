import { promises as fs } from "fs";
import path from "path";

import { getStaffAlertDataDir } from "@/lib/staff-alert/data-dir";

export type LastStaffAlert = {
  orderId: string;
  title: string;
  body: string;
  at: string;
};

function lastAlertFile(): string {
  return path.join(getStaffAlertDataDir(), "last-staff-alert.json");
}

export async function recordLastStaffAlert(
  alert: Omit<LastStaffAlert, "at"> & { at?: string }
): Promise<LastStaffAlert> {
  const payload: LastStaffAlert = {
    orderId: alert.orderId,
    title: alert.title,
    body: alert.body,
    at: alert.at || new Date().toISOString(),
  };

  const dir = getStaffAlertDataDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(lastAlertFile(), JSON.stringify(payload, null, 2), "utf-8");
  return payload;
}

export async function getLastStaffAlert(): Promise<LastStaffAlert | null> {
  try {
    const raw = await fs.readFile(lastAlertFile(), "utf-8");
    const parsed = JSON.parse(raw) as LastStaffAlert;
    if (!parsed?.orderId || !parsed?.at) return null;
    return parsed;
  } catch {
    return null;
  }
}
