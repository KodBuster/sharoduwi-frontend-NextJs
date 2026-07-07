# 🎈 ШАРОДУВЫ — Staff Alert (PWA Web Push)

Сигнализатор новых заказов для сотрудников на **чистом Web Push + VAPID**.
Без OneSignal, Firebase, Supabase и любых сторонних сервисов. Всё бесплатно.

- Страница **`/staff-alert`** — праздничная, в стиле воздушных шаров 🎈.
- Кнопка **«🔊 Подписаться на сигналы»** — каждый из 4 сотрудников жмёт 1 раз.
- При заказе сервер шлёт push **сразу на все 4 устройства**.
- Push: «🚨 Новый заказ в ШАРОДУВЫ!» + вибро + `requireInteraction`.
- Клик по уведомлению → открывается страница и играет **очень громкий loop-сигнал** (3 варианта, volume = 1).
- Кнопка **«🧪 Симулировать новый заказ»** для теста.

---

## 📁 Файлы

| Файл | Назначение |
|------|-----------|
| `app/staff-alert/page.tsx` | Страница подписки + громкий сигнал (Web Audio) |
| `public/sw.js` | Service Worker: приём push + клик по уведомлению |
| `app/api/subscribe/route.ts` | Сохраняет подписку сотрудника |
| `app/api/send-alert/route.ts` | Рассылает push на все устройства |
| `lib/webpush.ts` | Настройка VAPID (сервер) |
| `lib/subscriptions.ts` | Хранилище подписок (JSON-файл) |
| `app/layout.tsx` | PWA-манифест и мета-теги |
| `public/manifest.json` | Манифест для «Добавить на главный экран» |

> В твой существующий сайт достаточно перенести: `app/staff-alert/`, `app/api/subscribe/`, `app/api/send-alert/`, `public/sw.js`, `public/manifest.json`, `lib/webpush.ts`, `lib/subscriptions.ts`, добавить иконки и мета из `app/layout.tsx`.

---

## 1️⃣ Как сгенерировать VAPID-ключи

```bash
npm install
npm run vapid        # (то же: node scripts/generate-vapid.mjs)
```

Скрипт выведет 3 строки. Создай файл **`.env.local`** и вставь их:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=Bxxxx...    # публичный — уходит на клиент
VAPID_PRIVATE_KEY=xxxxx...               # приватный — ТОЛЬКО сервер, секрет!
VAPID_SUBJECT=mailto:admin@sharoduwi.ru
```

> ⚠️ `VAPID_PRIVATE_KEY` никогда не попадает в браузер — он используется только на сервере в `/api/send-alert`. На клиент Next.js отдаёт лишь ключ с префиксом `NEXT_PUBLIC_`. Отдельно ничего «подключать» не нужно.

Иконки уже сгенерированы (`public/icons/*.png`). Перегенерировать/заменить логотипом:
```bash
node scripts/generate-icons.mjs
```

Запуск:
```bash
npm run dev      # http://localhost:3000/staff-alert
```

> 🔒 Web Push работает **только по HTTPS** (или на `localhost`). На проде сайт должен быть на `https://`.

---

## 2️⃣ Как вызвать `send-alert` при создании заказа

В **любом месте**, где у тебя оформляется заказ (обработчик формы, вебхук оплаты,
серверный экшен и т.п.), добавь один `fetch`:

```ts
// Внутри твоей логики оформления заказа (на СЕРВЕРЕ):
await fetch(`${process.env.SITE_URL}/api/send-alert`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "🚨 Новый заказ в ШАРОДУВЫ!",
    body: `Заказ №${order.id} на сумму ${order.total} ₽ 🎈`,
    orderId: String(order.id),
  }),
});
```

Пример — Route Handler оформления заказа:

```ts
// app/api/order/route.ts
export async function POST(req: Request) {
  const order = await createOrder(await req.json()); // твоя логика

  // 🔔 Сигналим сотрудникам (не блокируем ответ клиенту при ошибке).
  fetch(`${process.env.SITE_URL}/api/send-alert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "🚨 Новый заказ в ШАРОДУВЫ!",
      body: `Новый заказ №${order.id} 🎈`,
      orderId: String(order.id),
    }),
  }).catch(() => {});

  return Response.json({ ok: true, orderId: order.id });
}
```

Добавь в `.env.local`: `SITE_URL=https://sharoduwi.ru`
(на сервере можно звать и напрямую функцию из `lib`, минуя HTTP — см. ниже).

**Совсем без HTTP** (вызов на сервере в том же приложении) — импортни логику рассылки:
```ts
import { webpush } from "@/lib/webpush";
import { getSubscriptions } from "@/lib/subscriptions";
// ...и повтори тело send-alert, либо вынеси его в отдельную функцию.
```

---

## 3️⃣ Как сотрудникам подписаться (пошагово)

Сделать **1 раз на каждом из 4 телефонов**:

### 🤖 Android (Chrome)
1. Открыть `https://sharoduwi.ru/staff-alert` в **Chrome**.
2. Нажать **«🔊 Подписаться на сигналы»** → **Разрешить** уведомления.
3. Меню Chrome (⋮) → **«Добавить на главный экран»** / «Установить приложение».
4. Открыть приложение с главного экрана. Готово.
5. Проверить кнопкой **«🧪 Симулировать новый заказ»**.

### 🍎 iPhone (Safari, iOS 16.4+)
1. Открыть `https://sharoduwi.ru/staff-alert` в **Safari** (именно Safari!).
2. Сначала **«Поделиться» (􀈂) → «На экран Домой»** — добавить на главный экран.
3. Запустить приложение **с иконки на главном экране** (не из Safari!).
4. Внутри приложения нажать **«🔊 Подписаться на сигналы»** → разрешить.
5. Проверить кнопкой **«🧪 Симулировать новый заказ»**.

> 📌 На iPhone push работает **только** когда страница запущена как установленное
> PWA (с главного экрана), не из вкладки Safari. Поэтому порядок для iOS:
> **сначала на главный экран, потом подписка**.

При клике по уведомлению приложение откроется и **сразу заиграет громкий
повторяющийся сигнал** — остановить кнопкой «🛑 Остановить сигнал».

---

## ⚙️ Про хостинг и хранилище подписок

Подписки хранятся в `data/subscriptions.json` (нам нужно всего 4 устройства).

- **VPS / свой сервер / Docker с диском** — работает как есть.
- **Vercel / Netlify (serverless)** — файловая система эфемерная, подписки будут
  теряться. Замени 3 функции в `lib/subscriptions.ts` на любой персистентный
  слой (Upstash Redis, Postgres, Vercel KV) — остальной код не меняется.

---

## 🔊 Про звук

Сигнал генерируется через **Web Audio API** (не нужны mp3-файлы): 3 варианта —
«сирена скорой», «резкий писк», «пожарная нарастающая». Выбирается случайно,
играет в цикле на максимальной громкости (`volume = 1`) + вибрация.

> Браузеры разрешают автозвук только после жеста пользователя. Клик по
> уведомлению считается жестом, поэтому сигнал стартует автоматически.
