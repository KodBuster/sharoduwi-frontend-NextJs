import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  CITY_COOKIE,
  cityPath,
  detectGeoCitySlug,
  DEFAULT_CITY_SLUG,
  getCityBySlug,
  isBlockedGeoCountry,
  isCitySlug,
  LEGACY_CITY_SLUGS,
  readCachedGeoCountry,
  resolveGeoLocation,
  setGeoCountryCookie,
} from "@/lib/cities";
import type { GeoLocationHint } from "@/lib/cities";
import {
  CITY_COOKIE_MAX_AGE,
  getLegacyPathRedirect,
  getRegionalRootConsolidationRedirect,
  isAppRootSegment,
} from "@/lib/cities/routing";
import {
  STAFF_ALERT_COOKIE,
  isStaffAlertPasswordConfigured,
} from "@/lib/staff-alert/constants";
import { isValidStaffAlertSession } from "@/lib/staff-alert/session-token";

const STATIC_FILE = /\.[a-z0-9]+$/i;

function redirectTo(request: NextRequest, pathname: string, status: 301 | 307 | 308) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, status);
}

function setCityCookie(response: NextResponse, slug: string) {
  response.cookies.set(CITY_COOKIE, slug, {
    path: "/",
    maxAge: CITY_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  response.headers.set("x-city-slug", slug);
}

function getStaffAlertAuthRedirect(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/staff-alert")) {
    return null;
  }

  if (pathname === "/staff-alert/login" || pathname.startsWith("/staff-alert/login/")) {
    return null;
  }

  return "check";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Статика без GeoIP — чтобы не дергать ip-api на каждый ассет.
  if (pathname.startsWith("/_next") || STATIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const cachedCountry = readCachedGeoCountry(request);
  let geo: GeoLocationHint | null = null;
  let country = cachedCountry;

  if (!country) {
    geo = await resolveGeoLocation(request);
    country = geo?.country?.trim() || null;
  }

  const finish = (response: NextResponse) => {
    if (country && !cachedCountry) {
      setGeoCountryCookie(response, country);
    }
    return response;
  };

  if (
    process.env.GEOIP_BLOCK_CN !== "false" &&
    isBlockedGeoCountry(country)
  ) {
    return finish(
      new NextResponse("Forbidden", {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      })
    );
  }

  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/sitemap/")
  ) {
    return finish(NextResponse.next());
  }

  if (pathname.startsWith("/api")) {
    return finish(NextResponse.next());
  }

  if (getStaffAlertAuthRedirect(request) === "check") {
    if (!isStaffAlertPasswordConfigured()) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/staff-alert/login";
      loginUrl.search = "";
      return finish(NextResponse.redirect(loginUrl));
    }

    const token = request.cookies.get(STAFF_ALERT_COOKIE)?.value;
    const authenticated = await isValidStaffAlertSession(token);
    if (!authenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/staff-alert/login";
      loginUrl.search = "";
      loginUrl.searchParams.set(
        "redirect",
        `${pathname}${request.nextUrl.search}`
      );
      return finish(NextResponse.redirect(loginUrl));
    }
    return finish(NextResponse.next());
  }

  const legacyTarget = getLegacyPathRedirect(pathname);
  if (legacyTarget) {
    return finish(redirectTo(request, legacyTarget, 301));
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && LEGACY_CITY_SLUGS[firstSegment]) {
    const canonical = LEGACY_CITY_SLUGS[firstSegment];
    const rest = segments.slice(1);
    const newPath = cityPath(canonical, rest.length ? `/${rest.join("/")}` : "/");
    return finish(redirectTo(request, newPath, 301));
  }

  if (
    firstSegment &&
    !isCitySlug(firstSegment) &&
    !isAppRootSegment(firstSegment)
  ) {
    return finish(redirectTo(request, "/", 307));
  }

  const cookieCity = request.cookies.get(CITY_COOKIE)?.value;
  const cookieSlug =
    cookieCity && isCitySlug(cookieCity) ? getCityBySlug(cookieCity)!.slug : null;

  let geoSlug: string | null = null;
  if (!firstSegment || !isCitySlug(firstSegment)) {
    if (!cookieSlug) {
      if (!geo) {
        geo = await resolveGeoLocation(request);
        if (!country && geo?.country) {
          country = geo.country.trim();
        }
      }
      geoSlug = await detectGeoCitySlug(request, geo);
    }
  }

  const preferredCitySlug = cookieSlug ?? geoSlug;

  const regionalRedirect = getRegionalRootConsolidationRedirect(pathname, preferredCitySlug);
  if (regionalRedirect) {
    const response = redirectTo(request, regionalRedirect, 301);
    const slugToPersist = preferredCitySlug ?? DEFAULT_CITY_SLUG;
    if (!cookieSlug) {
      setCityCookie(response, slugToPersist);
    }
    return finish(response);
  }

  if (firstSegment && isCitySlug(firstSegment)) {
    const response = NextResponse.next();
    setCityCookie(response, getCityBySlug(firstSegment)!.slug);
    return finish(response);
  }

  if (cookieSlug) {
    const response = NextResponse.next();
    response.headers.set("x-city-slug", cookieSlug);
    return finish(response);
  }

  if (geoSlug) {
    const response = NextResponse.next();
    setCityCookie(response, geoSlug);
    return finish(response);
  }

  return finish(NextResponse.next());
}

export const config = {
  matcher: [
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap/:path*",
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)",
  ],
};
