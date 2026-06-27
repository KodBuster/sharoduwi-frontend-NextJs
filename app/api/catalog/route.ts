import { NextResponse } from "next/server";

import { CATALOG_REVALIDATE_SECONDS } from "@/lib/advantshop/config";
import { resolveCollectionSlug } from "@/lib/products";
import { getCatalogProducts, getCatalogSource } from "@/lib/products-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionParam = searchParams.get("collection");
  const sort = searchParams.get("sort") ?? "default";
  const collection = resolveCollectionSlug(collectionParam);

  try {
    const products = await getCatalogProducts({ collection, sort });

    return NextResponse.json(
      {
        products,
        source: getCatalogSource(),
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600`,
        },
      }
    );
  } catch (error) {
    console.error("Catalog API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось загрузить каталог";
    const friendlyMessage =
      message === "terminated" || message.includes("fetch failed")
        ? "AdvantShop не ответил вовремя. Попробуйте обновить страницу."
        : message;
    return NextResponse.json(
      { products: [], source: getCatalogSource(), error: friendlyMessage },
      { status: 502 }
    );
  }
}
