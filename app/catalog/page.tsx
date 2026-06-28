import type { Metadata } from "next";

import { CatalogPage } from "@/components/CatalogPage";
import { getCatalogProducts, getCatalogSource } from "@/lib/products-service";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Каталог — ШАРОДУВЫ",
  description:
    "Полный каталог гелиевых шаров, композиций и наборов в Жуковском и Раменском районе.",
};

export default async function CatalogRoutePage() {
  let initialProducts = await getCatalogProducts().catch(() => []);

  return (
    <CatalogPage
      initialProducts={initialProducts}
      initialSource={getCatalogSource()}
    />
  );
}
