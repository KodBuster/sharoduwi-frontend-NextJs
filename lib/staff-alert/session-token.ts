import {
  SESSION_MARKER,
  getStaffAlertSigningSecret,
  isStaffAlertPasswordConfigured,
} from "@/lib/staff-alert/constants";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createStaffAlertSessionToken(): Promise<string> {
  const secret = getStaffAlertSigningSecret();
  if (!secret) return "";

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(SESSION_MARKER)
  );
  return bufferToHex(signature);
}

export async function isValidStaffAlertSession(
  token: string | undefined
): Promise<boolean> {
  if (!token || !isStaffAlertPasswordConfigured()) return false;
  const expected = await createStaffAlertSessionToken();
  if (!expected) return false;
  return token === expected;
}
