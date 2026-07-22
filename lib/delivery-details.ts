import { DELIVERY_PRICING_BY_NAME } from "@/lib/delivery-pricing-data";
import type { DeliveryAreaDetails, DeliveryPriceRow } from "@/lib/info-pages";

const DELIVERY_STANDARD_HIGHLIGHTS = [
  {
    title: "Приём заказов",
    text: "Заказы обрабатываются с 10:00 до 20:00.",
  },
  {
    title: "Доставка 24/7",
    text: "До двери квартиры или частного дома — круглосуточно, ежедневно.",
  },
  {
    title: "Предоплата",
    text: "Доставка осуществляется после предоплаты 100%.",
  },
  {
    title: "Точно ко времени",
    text: "Привозим в согласованное время или во временном диапазоне — уточняется с менеджером.",
  },
] as const;

const DELIVERY_STANDARD_EXTRAS = {
  nightSurcharge: {
    title: "Ночная доставка",
    text: "С 00:00 до 7:00 стоимость доставки увеличивается на 500 ₽.",
  },
  greetingService: {
    title: "Поздравление от курьера",
    text: "Курьер может зачитать поздравление от вашего имени — 1 000 ₽.",
  },
  pickupTitle: "Самовывоз",
  pickupText:
    "Вы всегда можете забрать заказ сами в одном из наших магазинов — укажите это при оформлении.",
  managersNote: "Способы и цены на доставку всегда можно обсудить с нашими менеджерами.",
  paymentTitle: "Способы оплаты",
  paymentIndividuals: [
    "Наличными или банковской картой в одном из магазинов «ШАРОДУВЫ»",
    "Переводом на банковскую карту Сбер",
    "Банковской картой при заказе в интернет-магазине «ШАРОДУВЫ»",
  ],
  paymentOrganizationsTitle: "Для организаций",
  paymentOrganizations: [
    "Выставляем счёт на оплату",
    "Оплата банковским переводом на расчётный счёт",
    "Закрывающие документы передаём вместе с заказом",
  ],
} as const;

function formatRub(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function buildPricingRow(
  settlementName: string,
  minOrder: number,
  delivery: number
): DeliveryPriceRow {
  return {
    location: settlementName,
    condition: `заказ от ${formatRub(minOrder)}`,
    price: formatRub(delivery),
  };
}

export type DeliveryDetailsOptions = {
  /** Фраза для заголовка «Стоимость доставки в …» */
  titlePlace?: string;
};

/** Таблица тарифов только для одного населённого пункта. */
export function getDeliveryDetailsForSettlement(
  settlementName: string,
  options: DeliveryDetailsOptions = {}
): DeliveryAreaDetails | undefined {
  const tariff = DELIVERY_PRICING_BY_NAME[settlementName];
  if (!tariff) return undefined;

  const titlePlace = options.titlePlace ?? settlementName;

  return {
    highlights: [...DELIVERY_STANDARD_HIGHLIGHTS],
    pricingTitle: `Стоимость доставки в ${titlePlace}`,
    pricingRows: [buildPricingRow(settlementName, tariff.minOrder, tariff.delivery)],
    pricingOtherNote: `Стоимость доставки по конкретному адресу в населённом пункте «${settlementName}» уточняйте у менеджеров.`,
    nightSurcharge: { ...DELIVERY_STANDARD_EXTRAS.nightSurcharge },
    greetingService: { ...DELIVERY_STANDARD_EXTRAS.greetingService },
    pickupTitle: DELIVERY_STANDARD_EXTRAS.pickupTitle,
    pickupText: DELIVERY_STANDARD_EXTRAS.pickupText,
    managersNote: DELIVERY_STANDARD_EXTRAS.managersNote,
    paymentTitle: DELIVERY_STANDARD_EXTRAS.paymentTitle,
    paymentIndividuals: [...DELIVERY_STANDARD_EXTRAS.paymentIndividuals],
    paymentOrganizationsTitle: DELIVERY_STANDARD_EXTRAS.paymentOrganizationsTitle,
    paymentOrganizations: [...DELIVERY_STANDARD_EXTRAS.paymentOrganizations],
  };
}
