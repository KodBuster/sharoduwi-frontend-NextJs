import type { Metadata } from "next";

import { CatalogPage } from "@/components/CatalogPage";

export const metadata: Metadata = {
  title: "Каталог — ШАРОДУВЫ",
  description:
    "Полный каталог гелиевых шаров, композиций и наборов в Жуковском и Раменском районе.",
};

export default function CatalogRoutePage() {
  return <CatalogPage />;
}
