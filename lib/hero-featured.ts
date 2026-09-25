import type { Product } from "@/lib/data";

export const HERO_FEATURED_NAME = "Товар а797";
export const HERO_FEATURED_SUBTITLE = "фонтан для праздника";
export const HERO_FEATURED_ART_NO = "а797";

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

/** Только точное совпадение артикула (иначе а97 ловится внутри а797). */
function matchesArtNo(artNo: string, targetKeys: string[]): boolean {
  const candidateKeys = artMatchKeys(artNo);
  return targetKeys.some((key) => candidateKeys.includes(key));
}

/** Артикул в названии как отдельный токен: «№797а», «а797». */
function matchesName(name: string, targetKeys: string[]): boolean {
  const tokens = ` ${normalize(name).replace(/[^a-z0-9]+/g, " ")} `;
  return targetKeys.some((key) => tokens.includes(` ${key} `));
}

export function findHeroFeaturedProduct(products: Product[]): Product | undefined {
  if (!products.length) return undefined;

  const targetKeys = artMatchKeys(HERO_FEATURED_ART_NO);

  const byArtNo = products.find(
    (product) => product.artNo && matchesArtNo(product.artNo, targetKeys)
  );
  if (byArtNo) return byArtNo;

  return products.find((product) => matchesName(product.name, targetKeys));
}
