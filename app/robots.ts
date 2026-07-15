import type { MetadataRoute } from "next";

import { getSiteHost, NON_INDEXABLE_ROOT_REGIONAL_PATHS } from "@/lib/seo/webmaster";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/delivery/moscow",
          "/delivery/balashikha",
          "/delivery/kotelniki",
          "/delivery/lytkarino",
        ],
        disallow: [
          "/checkout",
          "/*/checkout",
          "/staff-alert",
          "/api/",
          ...NON_INDEXABLE_ROOT_REGIONAL_PATHS,
        ],
      },
      {
        userAgent: "Yandex",
        allow: [
          "/",
          "/delivery/moscow",
          "/delivery/balashikha",
          "/delivery/kotelniki",
          "/delivery/lytkarino",
        ],
        disallow: [
          "/checkout",
          "/*/checkout",
          "/staff-alert",
          "/api/",
          ...NON_INDEXABLE_ROOT_REGIONAL_PATHS,
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: getSiteHost(),
  };
}
