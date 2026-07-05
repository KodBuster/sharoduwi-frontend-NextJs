import { FAQ_ITEMS } from "@/lib/data";
import type { CityPublic } from "@/lib/cities/types";

/** FAQ для города: переопределения из конфига или общий список */
export function getCityFaqItems(city: CityPublic | null | undefined) {
  if (city?.faq?.length) return city.faq;
  return FAQ_ITEMS;
}

export type HeroMiddleStat =
  | { type: "count"; value: number; suffix?: string; label: string }
  | { type: "text"; value: string; label: string };

export function getCityHeroStats(city: CityPublic | null | undefined) {
  const middle: HeroMiddleStat = city?.hasStores
    ? { type: "count", value: 2, label: "магазина в городе" }
    : city
      ? { type: "text", value: "24/7", label: `доставка в ${city.namePrepositional}` }
      : { type: "count", value: 2, label: "магазина в Жуковском" };

  return {
    middle,
    areaLabel: city?.seo.areaLabel ?? "Жуковском и Раменском районе",
  };
}

function buildDeliveryPageTitle(city: CityPublic): string {
  const base = "Доставка гелиевых и воздушных шаров";
  if (city.slug === "lyubertsy") {
    return `${base} по Люберцам`;
  }
  if (city.hasStores) {
    return `${base} по ${city.nameInstrumental}`;
  }
  return `${base} в ${city.namePrepositional}`;
}

export function getDeliveryConfigForCity(city: CityPublic) {
  const detailsSlug = city.delivery.detailsSlug;
  return {
    slug: detailsSlug,
    path: `/${city.slug}/delivery`,
    cityLabel: city.name,
    deliveryInLabel: city.delivery.deliveryInLabel,
    title: buildDeliveryPageTitle(city),
    metaDescription: city.seo.homeDescription,
    lead: city.delivery.lead,
    zones: city.delivery.zones,
    pickupNote: city.hasStores
      ? "Можно забрать заказ самостоятельно: ул. Чкалова, 6 (цокольный этаж) или ул. Мясищева, 28/1, ТЦ «Фермер»."
      : "Самовывоз возможен в Жуковском: ул. Чкалова, 6 или ТЦ «Фермер» на ул. Мясищева — удобно, если забираете заказ по пути.",
    mapUrl:
      city.delivery.detailsSlug === "ramenskoe" || city.delivery.detailsSlug === "lyubertsy"
        ? "https://yandex.ru/maps/org/sharoduvy/1796536309/"
        : "https://yandex.ru/maps/org/sharoduvy/1855601489/",
    mapLabel:
      city.delivery.detailsSlug === "ramenskoe" || city.delivery.detailsSlug === "lyubertsy"
        ? "ШАРОДУВЫ на Яндекс.Картах — ТЦ «Фермер»"
        : "ШАРОДУВЫ на Яндекс.Картах — ул. Чкалова",
  };
}
