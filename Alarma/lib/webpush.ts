import webpush from "web-push";

/**
 * Единая точка настройки библиотеки web-push.
 * Ключи VAPID берём из переменных окружения (см. .env.example).
 * Никаких сторонних сервисов — только чистый Web Push протокол.
 */

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
// Контакт администратора (email или URL сайта) — требование VAPID.
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@sharoduwi.ru";

if (PUBLIC_KEY && PRIVATE_KEY) {
  webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);
}

export { webpush, PUBLIC_KEY as VAPID_PUBLIC_KEY };
