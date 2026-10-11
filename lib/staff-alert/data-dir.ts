import fs from "node:fs";
import path from "node:path";

/**
 * Amvera монтирует постоянное хранилище в /data (persistenceMount).
 * После пересборки /app затирается — подписки staff-alert должны жить в /data.
 */
export function getStaffAlertDataDir(): string {
  const fromEnv = process.env.STAFF_ALERT_DATA_DIR?.trim();
  if (fromEnv) return fromEnv;

  if (fs.existsSync("/data") && fs.statSync("/data").isDirectory()) {
    return path.join("/data", "staff-alert");
  }

  return path.join(process.cwd(), "data");
}
