import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * Корневой layout. Здесь подключаем PWA-манифест и мета-теги,
 * чтобы страницу можно было «Добавить на главный экран».
 *
 * ⚠️ Про VAPID: приватный ключ (VAPID_PRIVATE_KEY) НИКОГДА не попадает на клиент —
 * он используется только на сервере в /api/send-alert. На клиент прокидывается
 * ТОЛЬКО публичный ключ через NEXT_PUBLIC_VAPID_PUBLIC_KEY (Next.js делает это
 * автоматически по префиксу NEXT_PUBLIC_). Отдельно ничего подключать не нужно.
 */

export const metadata: Metadata = {
  title: "ШАРОДУВЫ — Сигнал заказов",
  description: "PWA-сигнализатор новых заказов для сотрудников ШАРОДУВЫ 🎈",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ШАРОДУВЫ",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
