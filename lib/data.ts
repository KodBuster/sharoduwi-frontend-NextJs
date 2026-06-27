export const COLORS = {
  pink: "#FF2D95",
  sky: "#36B7F0",
  sun: "#FFC93C",
  mint: "#2FD3A5",
  coral: "#FF7A59",
  lav: "#A98BF5",
  red: "#FF3B5B",
  white: "#FFFFFF",
} as const;

export type ColorKey = keyof typeof COLORS;

export const CATEGORIES = [
  "Все",
  "Цифры",
  "Композиции",
  "Латексные",
  "Детям",
  "Романтика",
  "Выписка",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Product {
  id: number;
  name: string;
  cat: Exclude<Category, "Все">;
  price: number;
  old?: number;
  colors: ColorKey[];
  tag?: "hit" | "new";
  img?: string;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: "Фольгированная цифра «Гелий»", cat: "Цифры", price: 590, colors: ["pink"], tag: "hit" },
  { id: 2, name: "Набор «С Днём Рождения»", cat: "Композиции", price: 2490, old: 2900, colors: ["pink", "sun", "sky"], tag: "hit" },
  { id: 3, name: "Облако из 15 шаров", cat: "Латексные", price: 1890, old: 2300, colors: ["pink", "sky", "mint", "lav"] },
  { id: 4, name: "Композиция «Единорог»", cat: "Детям", price: 2990, colors: ["lav", "pink", "mint"], tag: "new" },
  { id: 5, name: "Сердца «Я люблю тебя»", cat: "Романтика", price: 1690, colors: ["pink", "red"] },
  { id: 6, name: "Набор «Выписка: Мальчик»", cat: "Выписка", price: 2290, colors: ["sky", "white", "mint"] },
  { id: 7, name: "Набор «Выписка: Девочка»", cat: "Выписка", price: 2290, colors: ["pink", "white", "lav"] },
  { id: 8, name: "Цифра + россыпь звёзд", cat: "Цифры", price: 1290, colors: ["sun", "pink"] },
  { id: 9, name: "Букет «Радуга»", cat: "Композиции", price: 2190, colors: ["pink", "sun", "mint", "sky", "lav"], tag: "hit" },
  { id: 10, name: "Шары с конфетти (5 шт)", cat: "Латексные", price: 990, colors: ["pink", "sun", "mint"] },
  { id: 11, name: "Композиция «Космос»", cat: "Детям", price: 3290, colors: ["lav", "sky", "pink"], tag: "new" },
  { id: 12, name: "Гигант-сердце 90 см", cat: "Романтика", price: 1490, colors: ["pink"] },
];

export interface Collection {
  name: string;
  sub: string;
  colors: ColorKey[];
  img?: string;
  bg?: string;
}

export const COLLECTIONS: Collection[] = [
  { name: "Наборы шаров базовые", sub: "на каждый праздник", colors: ["pink", "sun", "sky"] },
  { name: "Базовый Премиум", sub: "ярче и богаче", colors: ["pink", "lav", "sky"] },
  { name: "Премиум шары", sub: "вау-эффект", colors: ["sky", "white", "lav"] },
  { name: "Шары под потолок", sub: "облако под потолком", colors: ["pink", "lav", "pink", "sky"] },
  { name: "Облака из 5 шаров без грузов", sub: "лёгкий набор", colors: ["pink", "lav", "sky", "mint"] },
  { name: "Фонтаны из 7 шаров", sub: "пышный фонтан", colors: ["sun", "mint", "lav", "pink"] },
  { name: "Фонтаны из шаров", sub: "классический фонтан", colors: ["lav", "pink", "mint"] },
  { name: "Для девочек", sub: "нежно и мило", colors: ["pink", "lav", "white"] },
  { name: "Для мальчиков", sub: "ярко и смело", colors: ["sky", "mint", "white"] },
  { name: "Для неё", sub: "с любовью", colors: ["pink", "red", "lav"] },
  { name: "Для него", sub: "стильно", colors: ["sun", "lav", "sky"] },
  { name: "Шары Гигант", sub: "огромные шары", colors: ["pink", "sky"] },
  { name: "Шары Гигант с надписями", sub: "ваш текст на шаре", colors: ["pink", "lav"] },
  { name: "Шары на девичник", sub: "для подружек", colors: ["pink", "sun", "mint"] },
  { name: "Сет с цифрой", sub: "возраст в шарах", colors: ["mint", "lav", "pink"] },
  { name: "1 годик", sub: "первый праздник", colors: ["sky", "pink", "sun"] },
  { name: "Коробки с шарами", sub: "сюрприз в коробке", colors: ["lav", "pink", "sun"] },
  { name: "Для новорождённых", sub: "с появлением малыша", colors: ["sky", "white", "mint"] },
  { name: "Для влюблённых", sub: "сердца", colors: ["red", "pink"] },
  { name: "Пиротехника", sub: "финальный залп", colors: ["coral", "sun", "red"] },
];

export const COL_VISIBLE = 8;

export const HERO_MINI = [
  { c: "pink" as ColorKey, x: 8, y: 4, w: 78, d: 0, dur: 5.2, rot: -4 },
  { c: "sky" as ColorKey, x: 74, y: 2, w: 70, d: 0.4, dur: 5.8, rot: 5 },
  { c: "sun" as ColorKey, x: 2, y: 42, w: 62, d: 0.8, dur: 6.2, rot: -6 },
  { c: "mint" as ColorKey, x: 80, y: 46, w: 66, d: 0.2, dur: 5.5, rot: 4 },
  { c: "coral" as ColorKey, x: 18, y: 70, w: 54, d: 1.0, dur: 6.6, rot: -3 },
  { c: "lav" as ColorKey, x: 66, y: 72, w: 58, d: 0.6, dur: 6.0, rot: 6 },
  { c: "pink" as ColorKey, x: 42, y: -6, w: 50, d: 1.3, dur: 7.0, rot: -5 },
];

export const REVIEWS = [
  { initial: "М", color: "var(--pink)", name: "Мария", city: "Жуковский", text: "Заказывала композицию на годик дочке. Привезли вовремя, шары держались почти неделю! Спасибо за праздник 🎈" },
  { initial: "Е", color: "var(--sky)", name: "Екатерина", city: "Раменское", text: "Делали выписку из роддома — шарики «Мальчик» были просто бомба. Муж в восторге, фото получились сказочные." },
  { initial: "О", color: "var(--mint)", name: "Ольга", city: "Жуковский", text: "Беру у Шародувов уже третий год на все семейные праздники. Цены честные, ребята с душой. Рекомендую всем!" },
  { initial: "А", color: "var(--coral)", name: "Анна", city: "Раменское", text: "Заказывала фотозону на выпускной в саду — гости фотографировались весь вечер. Всё ярко, аккуратно, точно ко времени!" },
  { initial: "Д", color: "var(--sun)", name: "Дмитрий", city: "Жуковский", text: "Брал воздушную композицию жене на годовщину. Получилось эффектно, доставили день в день. Мужчины, рекомендую!" },
  { initial: "С", color: "var(--lav)", name: "Светлана", city: "Жуковский", text: "Шары на юбилей мамы превзошли ожидания. Яркие, долго не сдувались, собрали кучу комплиментов. Будем заказывать ещё." },
];

export const FAQ_ITEMS = [
  { q: "Доставляете в Раменское и район?", a: "Да. Возим по Жуковскому и Раменскому району и привозим точно ко времени торжества. Также удобный самовывоз из двух магазинов в Жуковском." },
  { q: "Как оформить заказ?", a: "Выбираете шары в каталоге и пишете нам в удобный мессенджер — MAX, Telegram или WhatsApp — либо звоните по телефону. Поможем выбрать, согласуем состав, время и доставку." },
  { q: "Сколько шары держат полёт?", a: "Зависит от типа. Латекс с Hi-Float в отопительный сезон летает до 2 недель, фольгированные — дольше всего. Честные сроки и условия гарантии собраны в разделе «Гарантия на полёт»." },
  { q: "Можно собрать композицию под мой повод и цвета?", a: "Конечно. Каждую композицию собираем вручную под ваш повод, тематику и цветовую гамму — от выписки и первого годика до девичника и романтики." },
  { q: "А заказать срочно, на сегодня?", a: "Часто это возможно — зависит от загрузки и наличия. Напишите или позвоните прямо сейчас, и мы подскажем ближайшее время, к которому успеем собрать и привезти." },
];
