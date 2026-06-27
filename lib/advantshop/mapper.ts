import type { Product, ProductTag } from "@/lib/data";
import { getCollectionName } from "@/lib/data";
import type { CollectionSlug } from "@/lib/products";
import { inferProductTags, parseTagsFromPropertyValue } from "@/lib/products";
import { resolveProductImageUrl } from "./images";
import type {
  AdvantShopCatalogProduct,
  AdvantShopPhoto,
  AdvantShopProperty,
} from "./types";

function pickImage(
  product: Pick<AdvantShopCatalogProduct, "photoMiddle" | "photoSmall" | "photos">
): string | undefined {
  if (product.photoMiddle) return product.photoMiddle;
  if (product.photoSmall) return product.photoSmall;

  const photos = product.photos ?? [];
  const main = photos.find((photo) => photo.main) ?? photos[0];

  return (
    main?.middleSrc ??
    main?.bigSrc ??
    main?.smallSrc ??
    undefined
  );
}

function pickArtNo(
  item: Pick<AdvantShopCatalogProduct, "artNo" | "offers">
): string | undefined {
  return (
    item.artNo ??
    item.offers?.find((offer) => offer.isMain)?.artNo ??
    item.offers?.[0]?.artNo ??
    undefined
  );
}

function mapBadge(
  product: Pick<AdvantShopCatalogProduct, "newProduct" | "bestseller" | "sales">
): Product["tag"] {
  if (product.newProduct) return "new";
  if (product.bestseller || product.sales) return "hit";
  return undefined;
}

function resolveProductTags(
  item: AdvantShopCatalogProduct,
  properties: AdvantShopProperty[] = []
): ProductTag[] {
  const fromProperties = new Set<ProductTag>();

  for (const property of properties) {
    const name = (property.propertyName ?? property.name ?? "").toLowerCase();
    const value = property.propertyValue ?? property.value ?? "";

    if (name.includes("тег") || name.includes("метк")) {
      for (const tag of parseTagsFromPropertyValue(value)) {
        fromProperties.add(tag);
      }
    }
  }

  if (fromProperties.size) {
    return [...fromProperties];
  }

  return inferProductTags(item.name, item.briefDescription);
}

export function mapCatalogProduct(
  item: AdvantShopCatalogProduct,
  collectionSlug: CollectionSlug,
  properties: AdvantShopProperty[] = []
): Product {
  const price = Math.round(item.priceWithDiscount ?? item.price);
  const hasDiscount =
    item.priceWithDiscount != null && item.price > item.priceWithDiscount;
  const old = hasDiscount ? Math.round(item.price) : undefined;
  const rawImage = pickImage(item);

  return {
    id: item.productId,
    name: item.name,
    collectionSlug,
    collection: getCollectionName(collectionSlug),
    tags: resolveProductTags(item, properties),
    price,
    old,
    colors: ["pink"],
    tag: mapBadge(item),
    img: rawImage ? resolveProductImageUrl(rawImage) : undefined,
    artNo: pickArtNo(item),
    urlPath: item.urlPath,
  };
}

export function collectImages(photos?: AdvantShopPhoto[] | null): string[] {
  if (!photos?.length) return [];

  return photos
    .map((photo) => photo.bigSrc ?? photo.middleSrc ?? photo.smallSrc)
    .filter((src): src is string => Boolean(src));
}
