import type { CollectionSlug } from "@/lib/products";

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
  title: string;
  metaDescription: string;
  lead: string;
  zones: string[];
  pickupNote: string;
  mapUrl: string;
  mapLabel: string;
};

export const DELIVERY_ZHUKOVSKY: DeliveryAreaConfig = {
  slug: "zhukovsky",
  path: "/delivery/zhukovsky",
  cityLabel: "Жуковский",
  title: "Доставка гелиевых шаров по Жуковскому",
  metaDescription:
    "Доставка гелиевых шаров и композиций по Жуковскому — привозим точно ко времени праздника. Самовывоз с ул. Чкалова и из ТЦ «Фермер».",
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
  cityLabel: "Раменское и район",
  title: "Доставка гелиевых шаров в Раменское и Раменский район",
  metaDescription:
    "Доставка гелиевых шаров в Раменское и по Раменскому району из Жуковского. Композиции, цифры и наборы — ко времени торжества.",
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
