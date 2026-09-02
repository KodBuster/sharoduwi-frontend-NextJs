import type { Product } from "@/lib/data";

export const HERO_FEATURED_NAME = "Товар 754а";
export const HERO_FEATURED_SUBTITLE = "фонтан для праздника";
export const HERO_FEATURED_ART_NO = "754а";

function normalize(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase().replace(/а/g, "a");
}

/** «754а» и «а754» — один артикул в разных написаниях. */
function artMatchKeys(value: string): string[] {
  const n = normalize(value);
  const keys = new Set<string>([n]);
  const digitLetter = n.match(/^(\d+)([a-z]+)$/);
  if (digitLetter) keys.add(`${digitLetter[2]}${digitLetter[1]}`);
  const letterDigit = n.match(/^([a-z]+)(\d+)$/);
  if (letterDigit) keys.add(`${letterDigit[2]}${letterDigit[1]}`);
  return [...keys];
}

function matchesFeaturedArt(candidate: string, targetKeys: string[]): boolean {
  const candidateKeys = artMatchKeys(candidate);
  return targetKeys.some((key) =>
    candidateKeys.some((c) => c === key || c.includes(key) || key.includes(c))
  );
}

export function findHeroFeaturedProduct(products: Product[]): Product | undefined {
  if (!products.length) return undefined;

  const targetKeys = artMatchKeys(HERO_FEATURED_ART_NO);

  const byArtNo = products.find(
    (product) => product.artNo && matchesFeaturedArt(product.artNo, targetKeys)
  );
  if (byArtNo) return byArtNo;

  return products.find((product) => {
    if (matchesFeaturedArt(product.name, targetKeys)) return true;
    return product.artNo ? matchesFeaturedArt(product.artNo, targetKeys) : false;
  });
}
