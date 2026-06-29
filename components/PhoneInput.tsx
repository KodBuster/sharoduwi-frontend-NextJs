"use client";

import type { InputHTMLAttributes } from "react";
import {
  applyPhoneMaskInput,
  phoneDigitsOnly,
  phoneMaskOnBlur,
  phoneMaskOnFocus,
} from "@/lib/phone-mask";

type PhoneInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

export function PhoneInput({ value, onChange, onFocus, onBlur, onKeyDown, ...rest }: PhoneInputProps) {
  return (
    <input
      {...rest}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={value}
      placeholder="+7 (999) 123-45-67"
      onChange={(e) => onChange(applyPhoneMaskInput(e.target.value))}
      onFocus={(e) => {
        onChange(phoneMaskOnFocus(value));
        onFocus?.(e);
      }}
      onBlur={(e) => {
        onChange(phoneMaskOnBlur(value));
        onBlur?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          const digits = phoneDigitsOnly(value);
          if (!digits.length && value.length <= 4) {
            e.preventDefault();
            onChange("+7 (");
          }
        }
        onKeyDown?.(e);
      }}
    />
  );
}
