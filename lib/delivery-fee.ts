import { DELIVERY_PRICING_BY_NAME, type DeliveryPricingTariff } from "@/lib/delivery-pricing-data";

/** Доплата за доставку с 00:00 до 7:00, ₽. */
export const NIGHT_DELIVERY_SURCHARGE = 500;

export const NIGHT_DELIVERY_LABEL = "Ночная доставка (00:00–7:00)";

export function getDeliveryTariff(
  settlementName?: string | null
): DeliveryPricingTariff | null {
  const name = settlementName?.trim();
  if (!name) return null;
  return DELIVERY_PRICING_BY_NAME[name] ?? null;
}

/** Базовая стоимость доставки в населённый пункт, ₽. */
export function getDeliveryFee(settlementName?: string | null): number {
  return getDeliveryTariff(settlementName)?.delivery ?? 0;
}

/** Доставка с учётом ночной доплаты. */
export function getOrderDeliveryFee(
  settlementName?: string | null,
  nightDelivery = false
): number {
  return getDeliveryFee(settlementName) + (nightDelivery ? NIGHT_DELIVERY_SURCHARGE : 0);
}

export function deliveryToLabel(settlementName: string): string {
  return `доставка в ${settlementName}`;
}

export function withDeliveryToLabel(settlementName: string): string {
  return `с доставкой в ${settlementName}`;
}
