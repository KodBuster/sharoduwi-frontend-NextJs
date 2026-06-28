import type { Metadata } from "next";

import { CheckoutPage } from "@/components/CheckoutPage";
import { getCatalogProducts, getCatalogSource } from "@/lib/products-service";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Оформить заказ — ШАРОДУВЫ",
  description:
    "Оформление заказа на гелиевые шары и композиции с доставкой по Жуковскому и Раменскому району.",
};

export default async function CheckoutRoutePage() {
  const initialProducts = await getCatalogProducts().catch(() => []);

  return (
    <CheckoutPage
      initialProducts={initialProducts}
      initialSource={getCatalogSource()}
    />
  );
}
