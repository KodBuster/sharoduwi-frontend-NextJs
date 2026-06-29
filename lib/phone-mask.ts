/** Национальная часть без кода страны — до 10 цифр. */
export function phoneDigitsOnly(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("8")) {
    return digits.slice(1, 11);
  }
  if (digits.startsWith("7")) {
    return digits.slice(1, 11);
  }

  return digits.slice(0, 10);
}

export function formatRuPhoneDisplay(nationalDigits: string): string {
  const d = nationalDigits.replace(/\D/g, "").slice(0, 10);
  if (!d.length) return "+7";

  let out = "+7";
  out += " (" + d.slice(0, Math.min(3, d.length));
  if (d.length < 3) return out;

  out += ")";
  if (d.length > 3) out += " " + d.slice(3, Math.min(6, d.length));
  if (d.length <= 6) return out;

  out += "-" + d.slice(6, Math.min(8, d.length));
  if (d.length <= 8) return out;

  return out + "-" + d.slice(8, 10);
}

export function isCompleteRuPhone(value: string): boolean {
  return phoneDigitsOnly(value).length === 10;
}

export function applyPhoneMaskInput(rawValue: string): string {
  return formatRuPhoneDisplay(phoneDigitsOnly(rawValue));
}

export function phoneMaskOnFocus(current: string): string {
  const digits = phoneDigitsOnly(current);
  if (!digits.length) return "+7 (";
  return formatRuPhoneDisplay(digits);
}

export function phoneMaskOnBlur(current: string): string {
  const digits = phoneDigitsOnly(current);
  if (!digits.length) return "";
  return formatRuPhoneDisplay(digits);
}
