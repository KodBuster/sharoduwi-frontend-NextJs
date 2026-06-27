import type { CollectionSlug } from "@/lib/products";

function readEnv(name: string): string | undefined {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;

  const value = raw.replace(/^["']|["']$/g, "");
  return value || undefined;
}

function assertAdvantShopBaseUrl(base: string): string {
  try {
    const parsed = new URL(base);
    if (
      parsed.hostname.endsWith("advantme.ru") &&
      (!parsed.pathname || parsed.pathname === "/")
    ) {
      throw new Error(
        "ADVANTSHOP_BASE_URL must include the shop path, e.g. https://s4.advantme.ru/437293-slug"
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("ADVANTSHOP_BASE_URL")) {
      throw error;
    }
  }

  return base.replace(/\/$/, "");
}

export function isAdvantShopConfigured(): boolean {
  return Boolean(readEnv("ADVANTSHOP_BASE_URL") && readEnv("ADVANTSHOP_CATEGORY_MAP"));
}

export function getAdvantShopBaseUrl(): string {
  const base = readEnv("ADVANTSHOP_BASE_URL");
  if (!base) {
    throw new Error("ADVANTSHOP_BASE_URL is not configured");
  }
  return assertAdvantShopBaseUrl(base);
}

export function getAdvantShopServerApiKey(): string {
  const key =
    readEnv("ADVANTSHOP_SERVER_API_KEY") ?? readEnv("ADVANTSHOP_API_KEY");
  if (!key) {
    throw new Error("ADVANTSHOP_SERVER_API_KEY is not configured");
  }
  return key;
}

export function getAdvantShopClientApiKey(): string {
  const key = getAdvantShopClientApiKeyOptional();
  if (!key) {
    throw new Error(
      "ADVANTSHOP_CLIENT_API_KEY is not configured. Generate it in AdvantShop admin: Settings → API → «API с авторизацией»."
    );
  }
  return key;
}

function getAdvantShopClientApiKeyOptional(): string | undefined {
  return readEnv("ADVANTSHOP_CLIENT_API_KEY") ?? readEnv("ADVANTSHOP_API_KEY");
}

function parseCategoryUrlMap(raw: string): Partial<Record<CollectionSlug, string>> {
  if (raw.startsWith("{")) {
    try {
      return JSON.parse(raw) as Partial<Record<CollectionSlug, string>>;
    } catch {
      return {};
    }
  }

  const map: Partial<Record<CollectionSlug, string>> = {};
  for (const part of raw.split(",")) {
    const [slug, url] = part.split(":").map((segment) => segment.trim());
    if (slug && url) {
      map[slug as CollectionSlug] = url;
    }
  }
  return map;
}

/** Map collection slugs to AdvantShop category URL paths */
export function getCategoryUrlMap(): Partial<Record<CollectionSlug, string>> {
  const raw = readEnv("ADVANTSHOP_CATEGORY_MAP");
  if (!raw) return {};
  return parseCategoryUrlMap(raw);
}

export const CATALOG_REVALIDATE_SECONDS = Number(
  process.env.ADVANTSHOP_REVALIDATE_SECONDS ?? 300
);
