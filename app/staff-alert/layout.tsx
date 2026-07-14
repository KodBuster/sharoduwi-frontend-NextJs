import type { Metadata, Viewport } from "next";

import "./staff-alert.css";

export const metadata: Metadata = {
  title: "ШАРОДУВЫ — Сигнал заказов",
  description: "PWA-сигнализатор новых заказов для сотрудников ШАРОДУВЫ",
  manifest: "/manifest-staff-alert.json",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ШАРОДУВЫ",
  },
  icons: {
    icon: [
      { url: "/icons/staff-alert/favicon.ico", sizes: "any" },
      { url: "/icons/staff-alert/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/staff-alert/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/staff-alert/favicon.ico",
    apple: "/icons/staff-alert/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
  width: "device-width",
  initialScale: 1,
};

export default function StaffAlertLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
