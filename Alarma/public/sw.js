/* eslint-disable no-restricted-globals */
/**
 * Service Worker для ШАРОДУВЫ — Staff Alert.
 * Отвечает за приём push-уведомлений и клик по ним.
 * Это обычный JS-файл (НЕ модуль), лежит в /public и доступен по адресу /sw.js.
 */

// Сразу активируем новый SW, не дожидаясь закрытия вкладок.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

/**
 * Пришёл push от сервера (/api/send-alert).
 * Показываем громкое, «залипающее» уведомление с вибрацией.
 */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  const title = data.title || "🚨 Новый заказ в ШАРОДУВЫ!";
  const options = {
    body: data.body || "Скорее оформляем заказ 🎈",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    // Сильная вибрация (Android): узор «трясём телефон».
    vibrate: [400, 200, 400, 200, 400, 200, 600],
    // Уведомление НЕ исчезает само — сотрудник обязан на него отреагировать.
    requireInteraction: true,
    // Звук уведомления (Android) + не «схлопывать» одинаковые.
    renotify: true,
    tag: "sharoduwy-order",
    silent: false,
    // Передаём orderId дальше, чтобы открыть страницу с включённым alarm.
    data: {
      orderId: data.orderId || String(Date.now()),
      url: "/staff-alert?alarm=1&order=" + (data.orderId || ""),
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Сотрудник кликнул по уведомлению.
 * Открываем (или фокусируем) страницу /staff-alert с флагом ?alarm=1,
 * чтобы там сразу заиграл громкий повторяющийся сигнал.
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/staff-alert?alarm=1";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Если вкладка уже открыта — фокусируем её и просим включить alarm.
        for (const client of clientList) {
          if (client.url.includes("/staff-alert") && "focus" in client) {
            client.postMessage({ type: "PLAY_ALARM" });
            return client.focus();
          }
        }
        // Иначе открываем новую вкладку.
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
