import { unstable_cache } from "next/cache";

import { fetchAdvantShopProducts } from "@/lib/advantshop/catalog";
import {
  CATALOG_REVALIDATE_SECONDS,
  isAdvantShopConfigured,
} from "@/lib/advantshop/config";
import { PRODUCTS, type Product, type ProductTag } from "@/lib/data";
import {
  resolveCollectionSlug,
  type CollectionSlug,
  type TagFilter,
} from "@/lib/products";

const getCachedAdvantShopCatalog = unstable_cache(
  async (collectionKey: string, sort: string) => {
    const collection =
      collectionKey === "all" ? undefined : (collectionKey as CollectionSlug);
    return fetchAdvantShopProducts({ collection, sort });
  },
  ["advantshop-catalog"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["catalog"] }
);

function sortStaticProducts(products: Product[], sort: string): Product[] {
  const list = [...products];

  if (sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === "new") {
    list.sort((a, b) => Number(b.tag === "new") - Number(a.tag === "new"));
  }

  return list;
}

export async function getCatalogProducts(options?: {
  collection?: CollectionSlug;
  sort?: string;
}): Promise<Product[]> {
  const sort = options?.sort ?? "default";

  if (isAdvantShopConfigured()) {
    try {
      return await getCachedAdvantShopCatalog(
        options?.collection ?? "all",
        sort
      );
    } catch (error) {
      console.error("AdvantShop catalog unavailable:", error);
    }
  }

  let products = [...PRODUCTS];

  if (options?.collection) {
    products = products.filter(
      (product) => product.collectionSlug === options.collection
    );
  }

  return sortStaticProducts(products, sort);
}

export function getCatalogSource(): "advantshop" | "static" {
  return isAdvantShopConfigured() ? "advantshop" : "static";
}

export function getProductById(
  products: Product[],
  id: number
): Product | undefined {
  return products.find((product) => product.id === id);
}

export function filterProductsByTag(
  products: Product[],
  tag: TagFilter
): Product[] {
  if (tag === "Все") return products;
  return products.filter((product) => product.tags.includes(tag as ProductTag));
}

export function filterProductsByCollection(
  products: Product[],
  collectionSlug: CollectionSlug | null
): Product[] {
  if (!collectionSlug) return products;
  return products.filter(
    (product) => product.collectionSlug === collectionSlug
  );
}

export { resolveCollectionSlug };
