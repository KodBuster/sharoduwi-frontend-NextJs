import {
  getYandexTrustBadgeData,
  TRUST_BADGE_REVALIDATE_SECONDS,
} from "@/lib/yandex-trust-badge";

export async function GET() {
  const data = await getYandexTrustBadgeData();

  return Response.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${TRUST_BADGE_REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
    },
  });
}
