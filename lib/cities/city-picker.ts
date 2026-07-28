import type { CitySlug } from "@/lib/cities/types";
import { stripCityPrefix } from "@/lib/cities/paths";

const RETURN_KEY = "city-picker-return";

/** Запомнить раздел, с которого открыли выбор места доставки. */
export function rememberCityPickerReturnPath(pathname: string) {
  const rest = stripCityPrefix(pathname);
  if (rest === "/cities") return;
  try {
    sessionStorage.setItem(RETURN_KEY, rest);
  } catch {
    /* ignore */
  }
}

/** Раздел для возврата после выбора НП на /cities. */
export function readCityPickerReturnPath(): string {
  try {
    const stored = sessionStorage.getItem(RETURN_KEY);
    if (stored && stored !== "/cities") {
      return stored.startsWith("/") ? stored : `/${stored}`;
    }
  } catch {
    /* ignore */
  }
  return "/";
}

export function buildCitySwitchHref(slug: CitySlug, restPath: string): string {
  const normalized = restPath.startsWith("/") ? restPath : `/${restPath}`;
  const effective = normalized === "/cities" ? readCityPickerReturnPath() : normalized;
  if (effective === "/") return `/${slug}/`;
  return `/${slug}${effective}`;
}
