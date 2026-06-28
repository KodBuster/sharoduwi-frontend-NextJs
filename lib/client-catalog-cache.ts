import type { Product } from "@/lib/data";
import type { CollectionSlug } from "@/lib/products";

export type CatalogSource = "advantshop" | "static";

type CatalogCacheEntry = {
  products: Product[];
  source: CatalogSource;
  savedAt: number;
};

/** Совпадает с ADVANTSHOP_REVALIDATE_SECONDS (по умолчанию 300) */
export const CATALOG_CLIENT_CACHE_MS = 300_000;

const STORAGE_PREFIX = "sharoduwi-catalog:";

export function getClientCatalogCacheKey(collection?: CollectionSlug): string {
  return collection ?? "all";
}

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

export function readClientCatalogCache(
  key: string
): CatalogCacheEntry | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(storageKey(key));
    if (!raw) return null;

    const entry = JSON.parse(raw) as CatalogCacheEntry;
    if (
      !entry ||
      !Array.isArray(entry.products) ||
      typeof entry.savedAt !== "number"
    ) {
      return null;
    }

    if (Date.now() - entry.savedAt > CATALOG_CLIENT_CACHE_MS) {
      sessionStorage.removeItem(storageKey(key));
      return null;
    }

    return entry;
  } catch {
    return null;
  }
}

export function writeClientCatalogCache(
  key: string,
  products: Product[],
  source: CatalogSource
): void {
  if (typeof window === "undefined") return;

  try {
    const entry: CatalogCacheEntry = {
      products,
      source,
      savedAt: Date.now(),
    };
    sessionStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
    // sessionStorage может быть недоступен — игнорируем
  }
}
