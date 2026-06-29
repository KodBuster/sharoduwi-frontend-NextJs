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

/** Формат при активном редактировании — пустое поле показывает «+7 (». */
export function formatRuPhoneEditing(nationalDigits: string): string {
  const d = nationalDigits.replace(/\D/g, "").slice(0, 10);
  if (!d.length) return "+7 (";
  return formatRuPhoneDisplay(d);
}

/** Сколько национальных цифр (без кода +7) находится до позиции курсора. */
export function countNationalDigitsBefore(formatted: string, cursor: number): number {
  const prefix = formatted.slice(0, cursor);
  const all = prefix.replace(/\D/g, "");
  if (!all.length) return 0;
  if (all.startsWith("7") || all.startsWith("8")) {
    return Math.max(0, all.length - 1);
  }
  return all.length;
}

/** Позиция курсора после N-й национальной цифры (0 = перед первой цифрой кода). */
export function nationalDigitIndexToCursor(formatted: string, nationalIndex: number): number {
  let count = 0;
  let inNational = false;
  let lastNationalDigitEnd = formatted.length;

  for (let i = 0; i < formatted.length; i++) {
    const ch = formatted[i];
    if (ch === "(") {
      inNational = true;
      continue;
    }
    if (!inNational || !/\d/.test(ch)) continue;

    if (count === nationalIndex) return i;
    count++;
    lastNationalDigitEnd = i + 1;
  }

  if (nationalIndex >= count) {
    const paren = formatted.indexOf("(");
    if (count === 0 && paren >= 0) return paren + 1;
    return lastNationalDigitEnd;
  }

  const paren = formatted.indexOf("(");
  return paren >= 0 ? paren + 1 : formatted.length;
}

export function isCompleteRuPhone(value: string): boolean {
  return phoneDigitsOnly(value).length === 10;
}

export function applyPhoneMaskInput(rawValue: string): string {
  return formatRuPhoneDisplay(phoneDigitsOnly(rawValue));
}

export function phoneMaskOnFocus(current: string): string {
  return formatRuPhoneEditing(phoneDigitsOnly(current));
}

export function phoneMaskOnBlur(current: string): string {
  const digits = phoneDigitsOnly(current);
  if (!digits.length) return "";
  return formatRuPhoneDisplay(digits);
}

export function deleteNationalDigits(
  digits: string,
  startIndex: number,
  endIndex: number
): string {
  return digits.slice(0, startIndex) + digits.slice(endIndex);
}
