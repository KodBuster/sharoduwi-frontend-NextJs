import nodemailer from "nodemailer";

import type { CartItem } from "@/lib/cart";
import type { CheckoutFormData } from "@/lib/checkout";
import { SITE_NAME, SITE_PHONE, SITE_URL } from "@/lib/seo/site";

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

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: process.env.SMTP_PASS!.trim(),
    },
  });
}

function formatMoney(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function buildOrderEmailText(input: {
  orderId: string;
  advantshopOrderNumber?: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}): string {
  const itemLines = input.items.map(
    (item) =>
      `• ${item.name} × ${item.quantity} — ${formatMoney(item.price * item.quantity)}`
  );

  return [
    `Здравствуйте, ${input.customer.name.trim()}!`,
    "",
    `Спасибо за заказ в ${SITE_NAME}.`,
    "",
    `Номер заказа: ${input.orderId}`,
    input.advantshopOrderNumber
      ? `Номер в магазине: ${input.advantshopOrderNumber}`
      : "",
    "",
    "Состав заказа:",
    ...itemLines,
    "",
    `Сумма товаров: ${formatMoney(input.subtotal)}`,
    input.deliveryFee > 0
      ? `Доставка: ${formatMoney(input.deliveryFee)}`
      : "Доставка: точную стоимость уточним при звонке",
    `Итого: ${formatMoney(input.total)}`,
    "",
    `Телефон: ${input.customer.phone}`,
    input.customer.city?.trim()
      ? `Населённый пункт: ${input.customer.city.trim()}`
      : "",
    input.customer.address?.trim() ? `Адрес: ${input.customer.address.trim()}` : "",
    input.customer.comment?.trim()
      ? `Комментарий: ${input.customer.comment.trim()}`
      : "",
    "",
    "Мы свяжемся с вами в ближайшее время для подтверждения и уточнения доставки.",
    "",
    `Телефон магазина: ${SITE_PHONE}`,
    SITE_URL,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendOrderConfirmationEmail(input: {
  orderId: string;
  advantshopOrderNumber?: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}): Promise<void> {
  const to = input.customer.email?.trim();
  if (!to) return;

  if (!isOrderEmailConfigured()) {
    console.warn(
      "Order confirmation email skipped: configure SMTP_HOST, SMTP_USER and SMTP_PASS"
    );
    return;
  }

  const from =
    process.env.ORDER_EMAIL_FROM?.trim() || process.env.SMTP_USER!.trim();
  const replyTo = process.env.ORDER_EMAIL_REPLY_TO?.trim() || from;
  const subject = `Заказ ${input.orderId} принят — ${SITE_NAME}`;
  const text = buildOrderEmailText(input);

  const transport = createTransport();
  await transport.sendMail({
    from: `"${SITE_NAME}" <${from}>`,
    to,
    replyTo,
    bcc: process.env.ORDER_NOTIFY_EMAIL?.trim() || undefined,
    subject,
    text,
  });
}
