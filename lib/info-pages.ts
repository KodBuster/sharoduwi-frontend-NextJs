import type { CollectionSlug } from "@/lib/products";

import { SITE_PHONE, SITE_PHONE_RAW } from "@/lib/seo/site";

export const FEATURED_COLLECTION_SLUGS: CollectionSlug[] = [
  "shary-pod-potolok-1",
  "set-s-tsifroi",
  "dlya-novorozhdennykh",
  "1-godik-1",
  "nabory-sharov-bazovye",
];

export type DeliveryAreaConfig = {
  slug: string;
  path: string;
  cityLabel: string;
  /** Населённый пункт для таблицы тарифов (одна строка из прайса) */
  pricingSettlementName: string;
  /** Фраза для заголовка «Стоимость доставки в …» */
  pricingTitlePlace: string;
  /** Фраза после «доставки в …» в блоке «Как заказать» */
  deliveryInLabel: string;
  title: string;
  metaDescription: string;
  lead: string;
  zones: string[];
  pickupNote: string;
  mapUrl: string;
  mapLabel: string;
};

export type DeliveryHighlight = {
  title: string;
  text: string;
};

export type DeliveryPriceRow = {
  location: string;
  condition: string;
  price: string;
};

export type DeliveryAreaDetails = {
  highlights: DeliveryHighlight[];
  pricingTitle: string;
  pricingIntro?: string;
  pricingRows: DeliveryPriceRow[];
  pricingFooterNote?: string;
  pricingOtherNote: string;
  nightSurcharge: { title: string; text: string };
  greetingService: { title: string; text: string };
  pickupTitle: string;
  pickupText: string;
  managersNote: string;
  paymentTitle: string;
  paymentIndividuals: string[];
  paymentOrganizationsTitle: string;
  paymentOrganizations: string[];
};

/** @deprecated Use DeliveryAreaDetails */
export type DeliveryZhukovskyDetails = DeliveryAreaDetails;

export const DELIVERY_MANAGER_PHONE = SITE_PHONE;
export const DELIVERY_MANAGER_PHONE_HREF = `tel:${SITE_PHONE_RAW}`;
export const DELIVERY_MANAGER_MAX =
  "https://max.ru/u/f9LHodD0cOJ0iFHpDtxRvHxZb55wWIT4L1UpmBingh61XxPU-GdBpm5h-ls";
export const DELIVERY_MANAGER_TELEGRAM = "https://t.me/+79267086374";

export const DELIVERY_ZHUKOVSKY: DeliveryAreaConfig = {
  slug: "zhukovsky",
  path: "/delivery/zhukovsky",
  cityLabel: "Жуковский",
  pricingSettlementName: "Жуковский",
  pricingTitlePlace: "Жуковском",
  deliveryInLabel: "Жуковском",
  title: "Доставка гелиевых и воздушных шаров по Жуковскому",
  metaDescription:
    "Доставка гелиевых и воздушных шаров по Жуковскому — 24/7 до двери, от 500 ₽ при заказе от 1500 ₽. Предоплата 100%, самовывоз с ул. Чкалова и из ТЦ «Фермер».",
  lead:
    "Собираем композиции вручную, надуваем гелием и привозим шары в удобное для вас время — домой, в офис, ресторан или детский сад в Жуковском.",
  zones: [
    "Весь город Жуковский",
    "Жилые кварталы и новостройки",
    "Офисы, кафе и банкетные залы",
    "Детские сады и школы",
  ],
  pickupNote:
    "Можно забрать заказ самостоятельно: ул. Чкалова, 6 (цокольный этаж) или ул. Мясищева, 28/1, ТЦ «Фермер».",
  mapUrl: "https://yandex.ru/maps/org/sharoduvy/1855601489/",
  mapLabel: "ШАРОДУВЫ на Яндекс.Картах — ул. Чкалова",
};

export const DELIVERY_RAMENSKOE: DeliveryAreaConfig = {
  slug: "ramenskoe",
  path: "/delivery/ramenskoe",
  cityLabel: "Раменское и по Раменскому району",
  pricingSettlementName: "Раменское",
  pricingTitlePlace: "Раменском",
  deliveryInLabel: "Раменское и по Раменскому району",
  title: "Доставка гелиевых и воздушных шаров в Раменское и Раменский район",
  metaDescription:
    "Доставка гелиевых и воздушных шаров в Раменское и по Раменскому району — 24/7 до двери, от 500 ₽. Тарифы по посёлкам и деревням, 50 ₽/км от Жуковского. Предоплата 100%.",
  lead:
    "Возим шары из Жуковского в Раменское и по всему Раменскому району. Согласуем состав, время и адрес — курьер приедет точно к празднику.",
  zones: [
    "г. Раменское",
    "Раменский городской округ",
    "Посёлки и дачные посёлки района",
    "Частные дома и коттеджи",
  ],
  pickupNote:
    "Самовывоз возможен в Жуковском: ул. Чкалова, 6 или ТЦ «Фермер» на ул. Мясищева — удобно, если забираете заказ по пути.",
  mapUrl: "https://yandex.ru/maps/org/sharoduvy/1796536309/",
  mapLabel: "ШАРОДУВЫ на Яндекс.Картах — ТЦ «Фермер»",
};

export const DELIVERY_LYUBERTSY: DeliveryAreaConfig = {
  slug: "lyubertsy",
  path: "/delivery/lyubertsy",
  cityLabel: "Люберцы и Люберецкий округ",
  pricingSettlementName: "Люберцы",
  pricingTitlePlace: "Люберцах",
  deliveryInLabel: "Люберцы и Люберецком округе",
  title: "Доставка гелиевых и воздушных шаров в Люберцы и Люберецкий округ",
  metaDescription:
    "Доставка гелиевых и воздушных шаров в Люберцы, Дзержинский, Томилино, Малаховку и по Люберецкому округу — от 500 ₽. Сборка в Жуковском, 50 ₽/км. Предоплата 100%.",
  lead:
    "Привозим шары из Жуковского в Люберцы и по всему Люберецкому округу — Томилино, Малаховку, Красково, Дзержинский и соседние посёлки. Согласуем состав и время заранее.",
  zones: [
    "г. Люберцы и г. Дзержинский",
    "п. Томилино, Малаховка, Красково",
    "Жилино, Октябрьский, Марусино",
    "Посёлки и деревни Люберецкого округа",
  ],
  pickupNote:
    "Самовывоз возможен в Жуковском: ул. Чкалова, 6 или ТЦ «Фермер» на ул. Мясищева — удобно, если забираете заказ по пути.",
  mapUrl: "https://yandex.ru/maps/org/sharoduvy/1796536309/",
  mapLabel: "ШАРОДУВЫ на Яндекс.Картах — ТЦ «Фермер»",
};

export const DELIVERY_MOSCOW: DeliveryAreaConfig = {
  slug: "moscow",
  path: "/delivery/moscow",
  cityLabel: "Москва",
  pricingSettlementName: "Жулебино",
  pricingTitlePlace: "Жулебино",
  deliveryInLabel: "Москве",
  title: "Доставка гелиевых и воздушных шаров в Москву",
  metaDescription:
    "Доставка гелиевых и воздушных шаров в Москву (ЮВАО и ВАО у Люберец) — 800 ₽. Сборка в Жуковском, курьер к празднику. Предоплата 100%.",
  lead:
    "Привозим шары из Жуковского в Москву — Жулебино, Некрасовку, Косино и соседние районы у Люберец. Согласуем состав и время заранее.",
  zones: ["Москва, ЮВАО и ВАО", "мкр. Жулебино", "мкр. Некрасовка", "мкр. Косино"],
  pickupNote:
    "Самовывоз возможен в Жуковском: ул. Чкалова, 6 или ТЦ «Фермер» на ул. Мясищева — удобно, если забираете заказ по пути.",
  mapUrl: "https://yandex.ru/maps/org/sharoduvy/1796536309/",
  mapLabel: "ШАРОДУВЫ на Яндекс.Картах — ТЦ «Фермер»",
};

export const DELIVERY_BALASHIKHA: DeliveryAreaConfig = {
  slug: "balashikha",
  path: "/delivery/balashikha",
  cityLabel: "городской округ Балашиха",
  pricingSettlementName: "Железнодорожный",
  pricingTitlePlace: "Железнодорожном",
  deliveryInLabel: "городском округе Балашиха",
  title: "Доставка гелиевых и воздушных шаров в городской округ Балашиха",
  metaDescription:
    "Доставка гелиевых и воздушных шаров в г.о. Балашиха — Железнодорожный, Новое Павлино, Кучино, Саввино, Никольско-Архангельский — 800 ₽. Сборка в Жуковском.",
  lead:
    "Возим шары из Жуковского в городской округ Балашиха — Железнодорожный, Новое Павлино, Кучино, Саввино и Никольско-Архангельский. Согласуем время заранее.",
  zones: [
    "Железнодорожный",
    "Новое Павлино",
    "Кучино",
    "Саввино",
    "Никольско-Архангельский",
  ],
  pickupNote:
    "Самовывоз возможен в Жуковском: ул. Чкалова, 6 или ТЦ «Фермер» на ул. Мясищева — удобно, если забираете заказ по пути.",
  mapUrl: "https://yandex.ru/maps/org/sharoduvy/1796536309/",
  mapLabel: "ШАРОДУВЫ на Яндекс.Картах — ТЦ «Фермер»",
};

export const DELIVERY_KOTELNIKI: DeliveryAreaConfig = {
  slug: "kotelniki",
  path: "/delivery/kotelniki",
  cityLabel: "Котельники",
  pricingSettlementName: "Котельники",
  pricingTitlePlace: "Котельниках",
  deliveryInLabel: "Котельниках",
  title: "Доставка гелиевых и воздушных шаров в Котельники",
  metaDescription:
    "Доставка гелиевых и воздушных шаров в Котельники — 800 ₽. Сборка в Жуковском, курьер к празднику. Предоплата 100%.",
  lead:
    "Привозим шары из Жуковского в Котельники — новостройки, жилые кварталы и частный сектор. Согласуем состав и время заранее.",
  zones: ["г. Котельники", "Новостройки и жилые кварталы", "Частный сектор"],
  pickupNote:
    "Самовывоз возможен в Жуковском: ул. Чкалова, 6 или ТЦ «Фермер» на ул. Мясищева — удобно, если забираете заказ по пути.",
  mapUrl: "https://yandex.ru/maps/org/sharoduvy/1796536309/",
  mapLabel: "ШАРОДУВЫ на Яндекс.Картах — ТЦ «Фермер»",
};

export const DELIVERY_LYTKARINO: DeliveryAreaConfig = {
  slug: "lytkarino",
  path: "/delivery/lytkarino",
  cityLabel: "Лыткарино",
  pricingSettlementName: "Лыткарино",
  pricingTitlePlace: "Лыткарино",
  deliveryInLabel: "Лыткарино",
  title: "Доставка гелиевых и воздушных шаров в Лыткарино",
  metaDescription:
    "Доставка гелиевых и воздушных шаров в Лыткарино — 800 ₽. Сборка в Жуковском, курьер к празднику. Предоплата 100%.",
  lead:
    "Привозим шары из Жуковского в Лыткарино — жилые кварталы и частный сектор. Согласуем состав и время заранее.",
  zones: ["г. Лыткарино", "Жилые кварталы", "Частные дома и коттеджи"],
  pickupNote:
    "Самовывоз возможен в Жуковском: ул. Чкалова, 6 или ТЦ «Фермер» на ул. Мясищева — удобно, если забираете заказ по пути.",
  mapUrl: "https://yandex.ru/maps/org/sharoduvy/1796536309/",
  mapLabel: "ШАРОДУВЫ на Яндекс.Картах — ТЦ «Фермер»",
};

export const ABOUT_STATS = [
  { value: "20+", label: "лет на рынке" },
  { value: "2", label: "магазина в Жуковском" },
  { value: "5000+", label: "счастливых семей" },
] as const;

export const ABOUT_STORES = [
  {
    name: "ул. Чкалова, 6",
    address: "г. Жуковский, ул. Чкалова, д. 6, цокольный этаж",
    mapUrl: "https://yandex.ru/maps/org/sharoduvy/1855601489/",
  },
  {
    name: "ТЦ «Фермер»",
    address: "г. Жуковский, ул. Мясищева, д. 28/1, ТЦ «Фермер»",
    mapUrl: "https://yandex.ru/maps/org/sharoduvy/1796536309/",
  },
] as const;

export const ABOUT_VALUES = [
  {
    title: "С 2005 года",
    text: "Тысячи букетов и композиций для семей Жуковского и Раменского района — от выписки и первого годика до юбилеев.",
  },
  {
    title: "Качественный гелий",
    text: "Используем проверенный гелий и обработку Hi-Float — шары летают дольше. Честные сроки и гарантия на полёт.",
  },
  {
    title: "Ручная сборка",
    text: "Каждую композицию собираем под ваш повод, цвета и бюджет — не с конвейера.",
  },
  {
    title: "Два шоурума",
    text: "Удобный самовывоз на ул. Чкалова и в ТЦ «Фермер» — можно посмотреть ассортимент вживую.",
  },
] as const;
