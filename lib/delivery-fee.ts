import { DELIVERY_PRICING_BY_NAME, type DeliveryPricingTariff } from "@/lib/delivery-pricing-data";

export function getDeliveryTariff(
  settlementName?: string | null
): DeliveryPricingTariff | null {
  const name = settlementName?.trim();
  if (!name) return null;
  return DELIVERY_PRICING_BY_NAME[name] ?? null;
}

/** Стоимость доставки в населённый пункт, ₽. */
export function getDeliveryFee(settlementName?: string | null): number {
  return getDeliveryTariff(settlementName)?.delivery ?? 0;
}

export function deliveryToLabel(settlementName: string): string {
  return `доставка в ${settlementName}`;
}

export function withDeliveryToLabel(settlementName: string): string {
  return `с доставкой в ${settlementName}`;
}
