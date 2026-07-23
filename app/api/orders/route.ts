import { NextResponse } from "next/server";

import { submitAdvantShopOrder } from "@/lib/advantshop/orders";
import { isAdvantShopConfigured } from "@/lib/advantshop/config";
import type { CartItem } from "@/lib/cart";
import {
  getDeliveryFee,
  validateCheckoutForm,
  type CheckoutFormData,
} from "@/lib/checkout";
import { sendOrderConfirmationEmail } from "@/lib/order-email";
import { sendStaffAlert } from "@/lib/staff-alert/send";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CreateOrderRequest = {
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal?: number;
  citySlug?: string;
};

export async function POST(request: Request) {
  let body: CreateOrderRequest;

  try {
    body = (await request.json()) as CreateOrderRequest;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!body.customer || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }

  const customer: CheckoutFormData = {
    name: body.customer.name?.trim() ?? "",
    phone: body.customer.phone?.trim() ?? "",
    email: body.customer.email?.trim() ?? "",
    city: body.customer.city?.trim() ?? "",
    address: body.customer.address?.trim() ?? "",
    comment: body.customer.comment?.trim() ?? "",
  };

  const validationError = validateCheckoutForm(customer);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!isAdvantShopConfigured()) {
    return NextResponse.json(
      { error: "Интеграция с AdvantShop не настроена" },
      { status: 503 }
    );
  }

  const subtotal =
    typeof body.subtotal === "number"
      ? body.subtotal
      : body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = getDeliveryFee(customer.city);
  const total = subtotal + deliveryFee;

  try {
    const advantshop = await submitAdvantShopOrder({
      customer,
      items: body.items,
      deliveryFee,
      citySlug: body.citySlug?.trim() || undefined,
    });

    const orderNumber = advantshop.advantshopOrderNumber!;

    let emailSent = false;
    if (customer.email) {
      try {
        emailSent = await sendOrderConfirmationEmail({
          orderNumber,
          customer,
          items: body.items,
          subtotal,
          deliveryFee,
          total,
          citySlug: body.citySlug?.trim() || undefined,
        });
        if (!emailSent) {
          console.warn(
            `Order ${orderNumber}: confirmation email not sent (SMTP not configured on server)`
          );
        }
      } catch (emailError) {
        console.error("Order confirmation email error:", emailError);
      }
    }

    void sendStaffAlert({
      title: "🚨 Новый заказ в ШАРОДУВЫ!",
      body: `Заказ №${orderNumber} на сумму ${total} ₽`,
      orderId: String(orderNumber),
    }).catch((alertError) => {
      console.error("Staff alert error:", alertError);
    });

    return NextResponse.json({
      id: orderNumber,
      advantshopOrderId: advantshop.advantshopOrderId,
      deliveryFee,
      total,
      emailSent,
    });
  } catch (error) {
    console.error("Order error:", error);
    const message =
      error instanceof Error ? error.message : "Не удалось оформить заказ";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
