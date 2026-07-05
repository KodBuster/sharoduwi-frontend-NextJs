import { getAdvantShopBaseUrl, isAdvantShopConfigured } from "./config";

const ADVANTSHOP_IMAGE_HOSTS = [
  "advantme.ru",
  "on-advantshop.net",
  "advantshop.net",
];

export type AdvantShopImageSize = "middle" | "big";

function getConfiguredImageHosts(): string[] {
  const hosts = [...ADVANTSHOP_IMAGE_HOSTS];

  if (isAdvantShopConfigured()) {
    try {
      const { hostname } = new URL(getAdvantShopBaseUrl());
      if (!hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
        hosts.push(hostname);
      }
    } catch {
      // ignore invalid base URL here
    }
  }

  return hosts;
}

export function isAdvantShopImageUrl(src: string): boolean {
  if (!src.startsWith("http://") && !src.startsWith("https://")) {
    return false;
  }

  try {
    const { hostname } = new URL(src);
    return getConfiguredImageHosts().some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export function isAllowedAdvantShopImageUrl(src: string): boolean {
  if (!isAdvantShopImageUrl(src)) return false;

  if (src.includes("/pictures/")) return true;

  try {
    const base = getAdvantShopBaseUrl();
    return src.startsWith(`${base}/`);
  } catch {
    return false;
  }
}

/** Средний размер — для каталога и карточек. */
export function preferMiddleAdvantShopImageUrl(src: string): string {
  if (!src.includes("/pictures/")) return src;
  return src
    .replace("/pictures/product/big/", "/pictures/product/middle/")
    .replace("/pictures/product/small/", "/pictures/product/middle/")
    .replace(/_big\.(png|jpe?g|webp|gif)/gi, "_middle.$1")
    .replace(/_small\.(png|jpe?g|webp|gif)/gi, "_middle.$1");
}

/** Полный размер — для страницы товара. */
export function preferBigAdvantShopImageUrl(src: string): string {
  if (!src.includes("/pictures/")) return src;
  return src
    .replace("/pictures/product/middle/", "/pictures/product/big/")
    .replace("/pictures/product/small/", "/pictures/product/big/")
    .replace(/_middle\.(png|jpe?g|webp|gif)/gi, "_big.$1")
    .replace(/_small\.(png|jpe?g|webp|gif)/gi, "_big.$1");
}

function normalizeAdvantShopImageUrl(
  src: string,
  size: AdvantShopImageSize
): string {
  return size === "big"
    ? preferBigAdvantShopImageUrl(src)
    : preferMiddleAdvantShopImageUrl(src);
}

/** URL для fallback в прокси, если запрошенный размер недоступен. */
export function getAdvantShopImageFallbackUrl(src: string): string | null {
  const middle = preferMiddleAdvantShopImageUrl(src);
  const big = preferBigAdvantShopImageUrl(src);

  if (src === middle && big !== middle) return big;
  if (src === big && middle !== big) return middle;
  return null;
}

export function resolveAdvantShopImageUrl(
  src: string,
  size: AdvantShopImageSize = "middle"
): string {
  if (!src || src.startsWith("/")) return src;

  if (isAdvantShopConfigured() && isAdvantShopImageUrl(src)) {
    const normalized = normalizeAdvantShopImageUrl(src, size);
    return `/api/advantshop-image?src=${encodeURIComponent(normalized)}`;
  }

  return src;
}

export function resolveAdvantShopImageUrls(
  urls: string[],
  size: AdvantShopImageSize = "middle"
): string[] {
  return urls.map((url) => resolveAdvantShopImageUrl(url, size));
}

/** @deprecated Используйте resolveAdvantShopImageUrl(src, "middle") */
export function resolveProductImageUrl(src: string): string {
  return resolveAdvantShopImageUrl(src, "middle");
}

/** @deprecated Используйте resolveAdvantShopImageUrls(urls, "middle") */
export function resolveProductImages(urls: string[]): string[] {
  return resolveAdvantShopImageUrls(urls, "middle");
}
