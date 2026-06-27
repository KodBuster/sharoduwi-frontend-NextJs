"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { COLORS, TAGS, getCollectionBySlug } from "@/lib/data";
import type { CollectionSlug } from "@/lib/products";
import { cluster, fmt, hexa } from "@/lib/balloons";

function CartControl({ id }: { id: number }) {
  const { getCartQty, addToCart, incrementCart, decrementCart } = useApp();
  const q = getCartQty(id);

  if (q > 0) {
    return (
      <div className="qty-stepper">
        <button className="qbtn" type="button" aria-label="Меньше" onClick={() => decrementCart(id)}>
          −
        </button>
        <span className="qv">{q}</span>
        <button className="qbtn" type="button" aria-label="Больше" onClick={() => incrementCart(id)}>
          +
        </button>
      </div>
    );
  }

  return (
    <button
      className="add-btn"
      type="button"
      aria-label="В корзину"
      onClick={(e) => addToCart(id, e.clientX, e.clientY)}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}

interface ShopProps {
  /** Фиксированная коллекция (страница категории) */
  pageCollection?: CollectionSlug;
  heading?: string;
  description?: string;
}

export function Shop({ pageCollection, heading, description }: ShopProps) {
  const {
    activeTag,
    setActiveTag,
    activeCollection,
    setActiveCollection,
    searchQuery,
    setSearchQuery,
    favOnly,
    toggleFav,
    isFav,
    products,
    catalogLoading,
  } = useApp();

  const collectionFilter = pageCollection ?? activeCollection;
  const activeCollectionName = collectionFilter
    ? getCollectionBySlug(collectionFilter)?.name
    : null;
  const isCategoryPage = Boolean(pageCollection);

  const list = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const okTag = activeTag === "Все" || p.tags.includes(activeTag);
      const okCollection =
        !collectionFilter || p.collectionSlug === collectionFilter;
      const okQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q));
      const okFav = !favOnly || isFav(p.id);
      return okTag && okCollection && okQ && okFav;
    });
  }, [activeTag, collectionFilter, searchQuery, favOnly, isFav, products]);

  return (
    <section className="sec" id="shop">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-tag">
            <span className="dot" /> {isCategoryPage ? "Коллекция" : "Каталог"}
          </div>
          <h2>{heading ?? "Наши шары и композиции"}</h2>
          {description && <p>{description}</p>}
        </div>
        {activeCollectionName && !isCategoryPage && (
          <div className="shop-collection-filter reveal">
            <span>Коллекция: {activeCollectionName}</span>
            <button
              type="button"
              className="chip active"
              onClick={() => setActiveCollection(null)}
            >
              Сбросить
            </button>
          </div>
        )}
        {isCategoryPage && (
          <div className="shop-collection-filter reveal">
            <Link href="/#shop" className="chip">
              ← Полный каталог
            </Link>
            <Link href="/#collections" className="chip">
              Все коллекции
            </Link>
          </div>
        )}
        <div className="shop-controls reveal">
          <div className="filters" id="filters">
            {TAGS.map((tag) => (
              <button
                key={tag}
                className={`chip${activeTag === tag ? " active" : ""}`}
                type="button"
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <input
              type="text"
              id="search"
              placeholder="Найти шарик…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="products" id="products">
          {catalogLoading ? (
            <div className="empty">Загружаем каталог…</div>
          ) : !list.length ? (
            <div className="empty">
              🎈{" "}
              {favOnly
                ? "В избранном пока пусто. Нажмите ♡ на товаре."
                : isCategoryPage
                  ? "В этой коллекции пока нет товаров."
                  : "Ничего не нашли. Попробуйте другой запрос."}
            </div>
          ) : (
            list.map((p, i) => {
              const tag =
                p.tag === "hit" ? (
                  <span className="tag hit">Хит</span>
                ) : p.tag === "new" ? (
                  <span className="tag new">Новинка</span>
                ) : null;
              const bgTint = p.img
                ? undefined
                : {
                    background: `linear-gradient(160deg,${hexa(COLORS[p.colors[0]], 0.16)},${hexa(COLORS[p.colors[p.colors.length - 1]], 0.1)})`,
                  };

              return (
                <div
                  key={p.id}
                  className="card"
                  data-pid={p.id}
                  style={{
                    animation: "ciIn .5s var(--ease) both",
                    animationDelay: i * 0.04 + "s",
                  }}
                >
                  <div className="card-vis" style={bgTint}>
                    {tag}
                    {p.img ? (
                      <img className="vis-photo" src={p.img} alt={p.name} loading="lazy" decoding="async" />
                    ) : (
                      <div className="vis-balloons" dangerouslySetInnerHTML={{ __html: cluster(p.colors, 70, `p-${p.id}`) }} />
                    )}
                    <button
                      className={`fav-heart${isFav(p.id) ? " on" : ""}`}
                      type="button"
                      aria-label="В избранное"
                      onClick={() => toggleFav(p.id)}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M20.8 5.2a5.5 5.5 0 00-7.8 0L12 6.2l-1-1a5.5 5.5 0 00-7.8 7.8L12 22l8.8-9a5.5 5.5 0 000-7.8z" />
                      </svg>
                    </button>
                  </div>
                  <div className="card-body">
                    <span className="card-cat">{p.collection}</span>
                    <h3>{p.name}</h3>
                    <div className="card-foot">
                      <div className="card-price">
                        {fmt(p.price)} ₽
                        {p.old && (
                          <>
                            {" "}
                            <small>
                              <s>{fmt(p.old)}</s>
                            </small>
                          </>
                        )}
                      </div>
                      <div className="card-cart">
                        <CartControl id={p.id} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
