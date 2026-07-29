import { unstable_cache } from "next/cache";

export const YANDEX_TRUST_ORG_ID = "1855601489";
export const YANDEX_TRUST_MAP_URL =
  "https://yandex.ru/maps/org/sharoduvy/1855601489/";

/** Обновление рейтинга с Яндекс.Карт — раз в 6 часов. */
export const TRUST_BADGE_REVALIDATE_SECONDS = 6 * 60 * 60;

export type YandexTrustBadgeData = {
  name: string;
  rating: string;
  ratingValue: number;
  reviewsLabel: string;
  ratingsLabel: string;
  mapUrl: string;
  fetchedAt: string;
};

export const YANDEX_TRUST_BADGE_FALLBACK: YandexTrustBadgeData = {
  name: "Шародувы",
  rating: "5,0",
  ratingValue: 5,
  reviewsLabel: "279 отзывов",
  ratingsLabel: "333 оценки",
  mapUrl: YANDEX_TRUST_MAP_URL,
  fetchedAt: "",
};

function formatRating(value: number): string {
  return value.toFixed(1).replace(".", ",");
}

function pluralRu(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} ${few}`;
  }
  return `${count} ${many}`;
}

export function parseYandexTrustBadgeHtml(
  html: string
): Omit<YandexTrustBadgeData, "mapUrl" | "fetchedAt"> | null {
  const ratingValueMatch = html.match(
    /itemProp="ratingValue"\s+content="([^"]+)"/
  );
  const reviewCountMatch = html.match(
    /itemProp="reviewCount"\s+content="(\d+)"/
  );
  const ratingCountMatch = html.match(
    /itemProp="ratingCount"\s+content="(\d+)"/
  );

  if (!ratingValueMatch || !reviewCountMatch || !ratingCountMatch) {
    return null;
  }

  const ratingValue = Number.parseFloat(ratingValueMatch[1]);
  const reviewCount = Number.parseInt(reviewCountMatch[1], 10);
  const ratingCount = Number.parseInt(ratingCountMatch[1], 10);

  if (
    !Number.isFinite(ratingValue) ||
    !Number.isFinite(reviewCount) ||
    !Number.isFinite(ratingCount)
  ) {
    return null;
  }

  return {
    name: "Шародувы",
    rating: formatRating(ratingValue),
    ratingValue,
    reviewsLabel: pluralRu(reviewCount, "отзыв", "отзыва", "отзывов"),
    ratingsLabel: pluralRu(ratingCount, "оценка", "оценки", "оценок"),
  };
}

async function fetchYandexTrustBadgeDataUncached(): Promise<YandexTrustBadgeData> {
  try {
    const response = await fetch(
      `https://yandex.ru/maps/org/sharoduvy/${YANDEX_TRUST_ORG_ID}/`,
      {
        headers: {
          Accept: "text/html",
          "User-Agent":
            "Mozilla/5.0 (compatible; SharoduwiBot/1.0; +https://sharoduwi.ru)",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Yandex trust badge HTTP ${response.status}`);
    }

    const html = await response.text();
    const parsed = parseYandexTrustBadgeHtml(html);
    if (!parsed) {
      throw new Error("Yandex trust badge parse failed");
    }

    return {
      ...parsed,
      mapUrl: YANDEX_TRUST_MAP_URL,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return {
      ...YANDEX_TRUST_BADGE_FALLBACK,
      fetchedAt: new Date().toISOString(),
    };
  }
}

export const getYandexTrustBadgeData = unstable_cache(
  fetchYandexTrustBadgeDataUncached,
  ["yandex-trust-badge"],
  {
    revalidate: TRUST_BADGE_REVALIDATE_SECONDS,
    tags: ["yandex-trust-badge"],
  }
);
