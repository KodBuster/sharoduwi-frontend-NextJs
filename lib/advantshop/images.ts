import { getAdvantShopBaseUrl, isAdvantShopConfigured } from "./config";

const ADVANTSHOP_IMAGE_HOSTS = [
  "advantme.ru",
  "on-advantshop.net",
  "advantshop.net",
];

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

export function resolveProductImageUrl(src: string): string {
  if (!src || src.startsWith("/")) return src;

  if (isAdvantShopConfigured() && isAdvantShopImageUrl(src)) {
    return `/api/advantshop-image?src=${encodeURIComponent(src)}`;
  }

  return src;
}

export function resolveProductImages(urls: string[]): string[] {
  return urls.map(resolveProductImageUrl);
}
