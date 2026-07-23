"use client";

import { fmt } from "@/lib/balloons";
import {
  deliveryToLabel,
  getDeliveryFee,
  withDeliveryToLabel,
} from "@/lib/delivery-fee";

type DeliveryPriceMetaProps = {
  productPrice: number;
  settlementName?: string | null;
  className?: string;
};

/** Строки «доставка в …» и «с доставкой в …» под ценой товара. */
export function DeliveryPriceMeta({
  productPrice,
  settlementName,
  className,
}: DeliveryPriceMetaProps) {
  const name = settlementName?.trim();
  const fee = getDeliveryFee(name);
  if (!name || fee <= 0 || !Number.isFinite(productPrice) || productPrice <= 0) {
    return null;
  }

  return (
    <div className={`delivery-price-meta${className ? ` ${className}` : ""}`}>
      <div className="delivery-price-meta-row">
        <span className="delivery-price-meta-label">{deliveryToLabel(name)}</span>
        <span className="delivery-price-meta-value">{fmt(fee)} ₽</span>
      </div>
      <div className="delivery-price-meta-row delivery-price-meta-row--total">
        <span className="delivery-price-meta-label">{withDeliveryToLabel(name)}</span>
        <span className="delivery-price-meta-value">
          {fmt(productPrice + fee)} ₽
        </span>
      </div>
    </div>
  );
}

type OrderDeliverySummaryProps = {
  subtotal: number;
  settlementName?: string | null;
  className?: string;
};

/** Итоги заказа: товары / доставка / с доставкой. */
export function OrderDeliverySummary({
  subtotal,
  settlementName,
  className,
}: OrderDeliverySummaryProps) {
  const name = settlementName?.trim();
  const fee = getDeliveryFee(name);
  const hasDelivery = Boolean(name && fee > 0);

  return (
    <div className={`order-delivery-summary${className ? ` ${className}` : ""}`}>
      {hasDelivery ? (
        <>
          <div className="order-delivery-summary-row">
            <span>Товары</span>
            <b>{fmt(subtotal)} ₽</b>
          </div>
          <div className="order-delivery-summary-row">
            <span>{deliveryToLabel(name!)}</span>
            <b>{fmt(fee)} ₽</b>
          </div>
          <div className="order-delivery-summary-row order-delivery-summary-row--total">
            <span>{withDeliveryToLabel(name!)}</span>
            <b>{fmt(subtotal + fee)} ₽</b>
          </div>
        </>
      ) : (
        <div className="order-delivery-summary-row order-delivery-summary-row--total">
          <span>Итого</span>
          <b>{fmt(subtotal)} ₽</b>
        </div>
      )}
    </div>
  );
}
