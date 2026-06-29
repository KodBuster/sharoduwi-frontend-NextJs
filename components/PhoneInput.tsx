"use client";

import { useRef, type InputHTMLAttributes } from "react";
import {
  countNationalDigitsBefore,
  deleteNationalDigits,
  formatRuPhoneEditing,
  nationalDigitIndexToCursor,
  phoneDigitsOnly,
  phoneMaskOnBlur,
  phoneMaskOnFocus,
} from "@/lib/phone-mask";

type PhoneInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

export function PhoneInput({ value, onChange, onFocus, onBlur, onKeyDown, ...rest }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const applyDigits = (nationalDigits: string, cursorNationalIndex?: number) => {
    const formatted = formatRuPhoneEditing(nationalDigits);
    onChange(formatted);

    if (cursorNationalIndex !== undefined && inputRef.current) {
      const cursor = nationalDigitIndexToCursor(formatted, cursorNationalIndex);
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(cursor, cursor);
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const digits = phoneDigitsOnly(value);

    if (e.key === "Backspace") {
      e.preventDefault();

      if (start !== end) {
        const from = countNationalDigitsBefore(value, start);
        const to = countNationalDigitsBefore(value, end);
        applyDigits(deleteNationalDigits(digits, from, to), from);
      } else {
        const before = countNationalDigitsBefore(value, start);
        if (before > 0) {
          applyDigits(deleteNationalDigits(digits, before - 1, before), before - 1);
        } else {
          onChange("+7 (");
          requestAnimationFrame(() => inputRef.current?.setSelectionRange(4, 4));
        }
      }

      onKeyDown?.(e);
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();

      if (start !== end) {
        const from = countNationalDigitsBefore(value, start);
        const to = countNationalDigitsBefore(value, end);
        applyDigits(deleteNationalDigits(digits, from, to), from);
      } else {
        const before = countNationalDigitsBefore(value, start);
        if (before < digits.length) {
          applyDigits(deleteNationalDigits(digits, before, before + 1), before);
        }
      }

      onKeyDown?.(e);
      return;
    }

    onKeyDown?.(e);
  };

  return (
    <input
      {...rest}
      ref={inputRef}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={value}
      placeholder="+7 (999) 123-45-67"
      onChange={(e) => {
        const input = e.target;
        const prevDigits = phoneDigitsOnly(value);
        const newDigits = phoneDigitsOnly(input.value);
        const formatted = formatRuPhoneEditing(newDigits);
        const start = input.selectionStart ?? formatted.length;
        const digitsBefore = countNationalDigitsBefore(input.value, start);

        onChange(formatted);

        requestAnimationFrame(() => {
          if (!inputRef.current) return;
          let cursorIndex = digitsBefore;
          if (newDigits.length > prevDigits.length) {
            cursorIndex = digitsBefore + (newDigits.length - prevDigits.length);
          }
          const pos = nationalDigitIndexToCursor(formatted, Math.min(cursorIndex, newDigits.length));
          inputRef.current.setSelectionRange(pos, pos);
        });
      }}
      onFocus={(e) => {
        onChange(phoneMaskOnFocus(value));
        requestAnimationFrame(() => {
          const digits = phoneDigitsOnly(value);
          const formatted = phoneMaskOnFocus(value);
          const pos = nationalDigitIndexToCursor(formatted, digits.length);
          inputRef.current?.setSelectionRange(pos, pos);
        });
        onFocus?.(e);
      }}
      onBlur={(e) => {
        onChange(phoneMaskOnBlur(value));
        onBlur?.(e);
      }}
      onKeyDown={handleKeyDown}
    />
  );
}
