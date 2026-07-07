export const STAFF_ALERT_COOKIE = "staff-alert-session";
export const SESSION_MARKER = "sharoduwi-staff-alert-v1";

export function getStaffAlertSigningSecret(): string {
  return (
    process.env.STAFF_ALERT_SESSION_SECRET ||
    process.env.STAFF_ALERT_PASSWORD ||
    ""
  ).trim();
}

export function isStaffAlertPasswordConfigured(): boolean {
  return Boolean(process.env.STAFF_ALERT_PASSWORD?.trim());
}
