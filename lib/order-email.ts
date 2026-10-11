import fs from "node:fs";

import nodemailer from "nodemailer";

import type { CartItem } from "@/lib/cart";
import type { CheckoutFormData } from "@/lib/checkout";
import {
  buildOrderConfirmationEmail,
  ORDER_EMAIL_LOGO_CID,
  ORDER_EMAIL_LOGO_PATH,
} from "@/lib/order-email-template";
import { SITE_NAME } from "@/lib/seo/site";

export function isOrderEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
}

function createTransport() {
  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || 465);
  const secure =
    process.env.SMTP_SECURE?.trim() === "true" ||
    (process.env.SMTP_SECURE?.trim() !== "false" && port === 465);

  if (port === 25) {
    console.warn(
      "SMTP_PORT=25 is often blocked on cloud hosts; use 465 (SSL) or 587 (STARTTLS) for Yandex/Mail.ru"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: process.env.SMTP_PASS!.trim(),
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
    tls: {
      minVersion: "TLSv1.2",
    },
  });
}

function orderEmailLogoAttachment():
  | { filename: string; path: string; cid: string }
  | undefined {
  if (!fs.existsSync(ORDER_EMAIL_LOGO_PATH)) {
    console.warn(`Order email logo not found: ${ORDER_EMAIL_LOGO_PATH}`);
    return undefined;
  }

  return {
    filename: "logo_mail.png",
    path: ORDER_EMAIL_LOGO_PATH,
    cid: ORDER_EMAIL_LOGO_CID,
  };
}

function getNotifyEmails(): string[] {
  return (process.env.ORDER_NOTIFY_EMAIL || "")
    .split(/[,;]/)
    .map((email) => email.trim())
    .filter(Boolean);
}

async function sendMailMessage(options: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const from =
    process.env.ORDER_EMAIL_FROM?.trim() || process.env.SMTP_USER!.trim();
  const replyTo = options.replyTo || process.env.ORDER_EMAIL_REPLY_TO?.trim() || from;
  const logo = orderEmailLogoAttachment();
  const transport = createTransport();

  await transport.sendMail({
    from: `"${SITE_NAME}" <${from}>`,
    to: options.to,
    replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: logo ? [logo] : undefined,
  });
}

/** Письмо покупателю (если указан email). */
export async function sendOrderConfirmationEmail(input: {
  orderNumber: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  citySlug?: string;
}): Promise<boolean> {
  const to = input.customer.email?.trim();
  if (!to) return false;

  if (!isOrderEmailConfigured()) {
    console.warn(
      "Order confirmation email skipped: set SMTP_HOST, SMTP_USER and SMTP_PASS in server environment (Amvera → Переменные окружения)"
    );
    return false;
  }

  const orderNumber = input.orderNumber.trim();
  const subject = `Заказ ${orderNumber} принят — ${SITE_NAME}`;
  const { html, text } = buildOrderConfirmationEmail(input);

  await sendMailMessage({ to, subject, html, text });
  return true;
}

/**
 * Уведомление менеджерам/админам (ORDER_NOTIFY_EMAIL).
 * Уходит всегда при заказе, даже если клиент не указал email.
 */
export async function sendOrderManagerNotifyEmail(input: {
  orderNumber: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  citySlug?: string;
}): Promise<boolean> {
  const notifyTo = getNotifyEmails();
  if (!notifyTo.length) {
    console.warn(
      "Manager order notify skipped: set ORDER_NOTIFY_EMAIL in server environment"
    );
    return false;
  }

  if (!isOrderEmailConfigured()) {
    console.warn(
      "Manager order notify skipped: set SMTP_HOST, SMTP_USER and SMTP_PASS"
    );
    return false;
  }

  const orderNumber = input.orderNumber.trim();
  const subject = `Новый заказ ${orderNumber} — ${SITE_NAME}`;
  const { html, text } = buildOrderConfirmationEmail(input);
  const replyTo = input.customer.email?.trim() || undefined;

  await sendMailMessage({ to: notifyTo, subject, html, text, replyTo });
  return true;
}
