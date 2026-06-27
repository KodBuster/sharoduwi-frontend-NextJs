import type { Metadata } from "next";
import { Unbounded, Onest } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ШАРОДУВЫ — гелиевые шары и композиции в Жуковском",
  description:
    "ШАРОДУВЫ — гелиевые шары, фольгированные цифры и праздничные композиции в Жуковском и Раменском районе. Делаем праздник с 2005 года.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`}>
      <body>{children}</body>
    </html>
  );
}
