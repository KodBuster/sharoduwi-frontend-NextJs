import type { Product } from "@/lib/data";

export const HERO_FEATURED_NAME = "Товар а588";
export const HERO_FEATURED_SUBTITLE = "фонтан для праздника";
export const HERO_FEATURED_ART_NO = "а588";

function normalize(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase().replace(/а/g, "a");
}

export function findHeroFeaturedProduct(products: Product[]): Product | undefined {
  if (!products.length) return undefined;

  const targetArt = normalize(HERO_FEATURED_ART_NO);

  const byArtNo = products.find(
    (product) => product.artNo && normalize(product.artNo).includes(targetArt)
  );
  if (byArtNo) return byArtNo;

  const byName = products.find((product) => {
    const name = normalize(product.name);
    const art = product.artNo ? normalize(product.artNo) : "";
    return name.includes(targetArt) || art.includes(targetArt);
  });
  return byName;
}
