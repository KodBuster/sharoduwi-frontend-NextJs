import { NextResponse } from "next/server";

import {
  getAdvantShopImageFallbackUrl,
  isAllowedAdvantShopImageUrl,
} from "@/lib/advantshop/images";

async function fetchAdvantShopImage(src: string, headers: HeadersInit) {
  const response = await fetch(src, { headers, cache: "no-store" });
  if (response.ok) return response;

  const fallbackSrc = getAdvantShopImageFallbackUrl(src);
  if (!fallbackSrc || fallbackSrc === src) return response;

  return fetch(fallbackSrc, { headers, cache: "no-store" });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src")?.trim();

  if (!src || !isAllowedAdvantShopImageUrl(src)) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  const headers: HeadersInit = {
    Accept: "image/*",
  };

  const storeCookie = process.env.ADVANTSHOP_STORE_COOKIE?.trim();
  if (storeCookie) {
    headers.Cookie = storeCookie;
  }

  try {
    const response = await fetchAdvantShopImage(src, headers);

    const contentType = response.headers.get("content-type") ?? "";
    const buffer = await response.arrayBuffer();

    if (
      !response.ok ||
      !contentType.startsWith("image/") ||
      buffer.byteLength < 128
    ) {
      return NextResponse.json(
        {
          error:
            "Изображение недоступно. Откройте витрину AdvantShop для публичного доступа или задайте ADVANTSHOP_STORE_COOKIE.",
        },
        { status: 502 }
      );
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("AdvantShop image proxy error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить изображение" },
      { status: 502 }
    );
  }
}
