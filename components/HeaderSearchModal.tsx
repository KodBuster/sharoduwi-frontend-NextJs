"use client";

import { useEffect, useLayoutEffect, useMemo, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { CityLink } from "@/components/CityLink";
import { useFullCatalogSearch } from "@/hooks/useFullCatalogSearch";
import { fmt } from "@/lib/balloons";
import { productMatchesSearch } from "@/lib/products";
import { getProductSlug } from "@/lib/product-slug";
import type { Product } from "@/lib/data";

const PREVIEW_LIMIT = 8;
const PANEL_GAP = 8;
const VIEWPORT_PAD = 12;

interface HeaderSearchModalProps {
  query: string;
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onSelectProduct: () => void;
}

type PanelStyle = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

function ResultRow({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: () => void;
}) {
  const price =
    product.price != null && product.price > 0
      ? `${fmt(product.price)} ₽`
      : "уточняйте цену";

  return (
    <CityLink
      href={`/products/${getProductSlug(product)}`}
      className="head-search-result"
      onClick={onSelect}
    >
      <span className="head-search-result-thumb" aria-hidden="true">
        {product.img ? (
          <img src={product.img} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="head-search-result-thumb-fallback" />
        )}
      </span>
      <span className="head-search-result-body">
        <span className="head-search-result-name">{product.name}</span>
        <span className="head-search-result-meta">
          {product.artNo ? `арт. ${product.artNo}` : product.collection}
        </span>
      </span>
      <span className="head-search-result-price">{price}</span>
    </CityLink>
  );
}

function computePanelStyle(anchor: HTMLElement): PanelStyle {
  const rect = anchor.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const preferredWidth = Math.min(560, vw - VIEWPORT_PAD * 2);
  const width = Math.max(preferredWidth, Math.min(rect.width, vw - VIEWPORT_PAD * 2));
  let left = rect.right - width;
  left = Math.min(Math.max(VIEWPORT_PAD, left), vw - width - VIEWPORT_PAD);
  const top = Math.min(rect.bottom + PANEL_GAP, vh - 120);
  const maxHeight = Math.max(160, vh - top - VIEWPORT_PAD);

  return { top, left, width, maxHeight };
}

export function HeaderSearchModal({
  query,
  open,
  anchorRef,
  onClose,
  onSelectProduct,
}: HeaderSearchModalProps) {
  const trimmed = query.trim();
  const { products, loading } = useFullCatalogSearch(open && Boolean(trimmed));
  const [panelStyle, setPanelStyle] = useState<PanelStyle | null>(null);

  const matches = useMemo(() => {
    if (!trimmed) return [];
    return products.filter((product) => productMatchesSearch(product, trimmed));
  }, [products, trimmed]);

  const preview = matches.slice(0, PREVIEW_LIMIT);

  useLayoutEffect(() => {
    if (!open || !trimmed) {
      setPanelStyle(null);
      return;
    }

    const update = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      setPanelStyle(computePanelStyle(anchor));
    };

    update();
    const raf = window.requestAnimationFrame(update);
    const delayed = window.setTimeout(update, 80);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(delayed);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchorRef, open, trimmed]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !trimmed || typeof document === "undefined" || !panelStyle) {
    return null;
  }

  return createPortal(
    <div
      className="head-search-modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="head-search-modal"
        role="listbox"
        aria-label="Результаты поиска"
        style={{
          top: panelStyle.top,
          left: panelStyle.left,
          width: panelStyle.width,
          maxHeight: panelStyle.maxHeight,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="head-search-modal-list">
          {loading && !preview.length ? (
            <div className="head-search-modal-empty">Шары на подлёте...</div>
          ) : !preview.length ? (
            <div className="head-search-modal-empty">
              Ничего не нашли по запросу «{trimmed}»
            </div>
          ) : (
            preview.map((product) => (
              <ResultRow
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
