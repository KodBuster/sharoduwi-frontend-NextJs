/* eslint-disable no-restricted-globals */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

function notifyOpenStaffAlertClients() {
  return self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clientList) => {
      clientList.forEach((client) => {
        if (client.url.includes("/staff-alert")) {
          client.postMessage({ type: "PLAY_ALARM" });
        }
      });
    });
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const title = data.title || "🚨 Новый заказ в ШАРОДУВЫ!";
  const options = {
    body: data.body || "Скорее оформляем заказ 🎈",
    icon: "/icons/staff-alert/icon-192.png",
    badge: "/icons/staff-alert/badge-72.png",
    vibrate: [400, 200, 400, 200, 400, 200, 600],
    requireInteraction: true,
    renotify: true,
    tag: "sharoduwy-order",
    silent: false,
    data: {
      orderId: data.orderId || String(Date.now()),
      url: "/staff-alert?alarm=1&order=" + (data.orderId || ""),
    },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      notifyOpenStaffAlertClients(),
    ])
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl =
    (event.notification.data && event.notification.data.url) ||
    "/staff-alert?alarm=1";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/staff-alert") && "focus" in client) {
            client.postMessage({ type: "PLAY_ALARM" });
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
