"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CitySearchField } from "@/components/CitySearchField";
import { useCity } from "@/context/CityContext";
import {
  filterCitiesByQuery,
  getPrimaryCities,
  getSecondaryCities,
  stripCityPrefix,
  type CityPublic,
  type CitySlug,
} from "@/lib/cities";

export function CitySwitcher({
  compact = false,
  inHeader = false,
}: {
  compact?: boolean;
  /** В шапке сайта — компактная кнопка и полноширинная панель на мобильных */
  inHeader?: boolean;
}) {
  const { city, persistCity } = useCity();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const restPath = stripCityPrefix(pathname);
  const primaryCities = getPrimaryCities();
  const secondaryCities = getSecondaryCities();

  const isSearching = query.trim().length > 0;
  const filteredPrimary = useMemo(
    () => filterCitiesByQuery(primaryCities, query),
    [primaryCities, query]
  );
  const filteredSecondary = useMemo(
    () => filterCitiesByQuery(secondaryCities, query),
    [secondaryCities, query]
  );
  const searchResults = useMemo(
    () => (isSearching ? [...filteredPrimary, ...filteredSecondary] : []),
    [isSearching, filteredPrimary, filteredSecondary]
  );

  const switchTo = useCallback(
    (target: CityPublic) => {
      persistCity(target.slug);
      setOpen(false);
      setQuery("");
    },
    [persistCity]
  );

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (open && rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!inHeader) return;
    const bodyClass = "city-picker-open";
    if (open) document.body.classList.add(bodyClass);
    else document.body.classList.remove(bodyClass);
    return () => document.body.classList.remove(bodyClass);
  }, [open, inHeader]);

  useEffect(() => {
    if (!open || !inHeader) return;
    const vv = window.visualViewport;
    if (!vv) return;

    const syncPanelHeight = () => {
      const root = rootRef.current;
      const panel = root?.querySelector<HTMLElement>(".city-switcher-panel");
      if (!panel) return;
      const top = root!.getBoundingClientRect().top;
      const maxH = Math.max(180, vv.height - top - 12);
      panel.style.maxHeight = `${maxH}px`;
    };

    syncPanelHeight();
    vv.addEventListener("resize", syncPanelHeight);
    vv.addEventListener("scroll", syncPanelHeight);
    window.addEventListener("resize", syncPanelHeight);
    return () => {
      vv.removeEventListener("resize", syncPanelHeight);
      vv.removeEventListener("scroll", syncPanelHeight);
      window.removeEventListener("resize", syncPanelHeight);
      const panel = rootRef.current?.querySelector<HTMLElement>(".city-switcher-panel");
      if (panel) panel.style.maxHeight = "";
    };
  }, [open, inHeader]);

  const label = city?.name ?? "Куда доставить?";

  return (
    <div
      className={`city-switcher${compact ? " city-switcher--compact" : ""}${inHeader ? " city-switcher--header" : ""}${open ? " city-switcher--open" : ""}`}
      ref={rootRef}
    >
      <button
        type="button"
        className="city-switcher-btn"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={city ? `Место доставки: ${city.name}. Открыть список` : "Куда доставить? Открыть список"}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 10c0 6-9 11-9 11s-9-5-9-11a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="city-switcher-btn-text">{label}</span>
        <svg className="city-switcher-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="city-switcher-panel" role="listbox" aria-label="Место доставки">
          <CitySearchField
            id="city-switcher-search"
            compact
            autoFocus
            value={query}
            onChange={setQuery}
            placeholder="Поиск населённого пункта…"
            label="Поиск населённого пункта"
          />

          {isSearching ? (
            <div className="city-switcher-list">
              <div className="city-switcher-section">
                <span className="city-switcher-label">
                  {searchResults.length > 0
                    ? `Найдено: ${searchResults.length}`
                    : "Ничего не найдено"}
                </span>
                {searchResults.map((item) => (
                  <CitySwitcherItem
                    key={item.slug}
                    item={item}
                    active={city?.slug === item.slug}
                    targetHref={buildCitySwitchHref(item.slug, restPath)}
                    onSelect={() => switchTo(item)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="city-switcher-list">
              <div className="city-switcher-section">
                <span className="city-switcher-label">Города</span>
                {primaryCities.map((item) => (
                  <CitySwitcherItem
                    key={item.slug}
                    item={item}
                    active={city?.slug === item.slug}
                    targetHref={buildCitySwitchHref(item.slug, restPath)}
                    onSelect={() => switchTo(item)}
                  />
                ))}
              </div>
              <div className="city-switcher-section">
                <span className="city-switcher-label">Сёла, Посёлки и Деревни</span>
                {secondaryCities.map((item) => (
                  <CitySwitcherItem
                    key={item.slug}
                    item={item}
                    active={city?.slug === item.slug}
                    targetHref={buildCitySwitchHref(item.slug, restPath)}
                    onSelect={() => switchTo(item)}
                  />
                ))}
              </div>
            </div>
          )}

          <Link
            href="/cities"
            className="city-switcher-all"
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
          >
            Все пункты доставки →
          </Link>
        </div>
      )}
    </div>
  );
}

function buildCitySwitchHref(slug: CitySlug, restPath: string) {
  const normalized = restPath.startsWith("/") ? restPath : `/${restPath}`;
  if (normalized === "/") return `/${slug}/`;
  return `/${slug}${normalized}`;
}

function CitySwitcherItem({
  item,
  active,
  targetHref,
  onSelect,
}: {
  item: CityPublic;
  active: boolean;
  targetHref: string;
  onSelect: () => void;
}) {
  return (
    <Link
      href={targetHref}
      className={`city-switcher-item${active ? " active" : ""}`}
      role="option"
      aria-selected={active}
      onClick={onSelect}
    >
      {item.name}
      {item.hasStores && <span className="city-switcher-badge">магазины</span>}
    </Link>
  );
}
