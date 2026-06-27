"use client";

import { useMemo } from "react";
import { useApp, CATEGORIES } from "@/context/AppContext";
import { PRODUCTS, COLORS } from "@/lib/data";
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

export function Shop() {
  const {
    activeCat,
    setActiveCat,
    searchQuery,
    setSearchQuery,
    favOnly,
    toggleFav,
    isFav,
  } = useApp();

  const list = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      const okCat = activeCat === "Все" || p.cat === activeCat;
      const okQ = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      const okFav = !favOnly || isFav(p.id);
      return okCat && okQ && okFav;
    });
  }, [activeCat, searchQuery, favOnly, isFav]);

  return (
    <section className="sec" id="shop">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-tag">
            <span className="dot" /> Каталог
          </div>
          <h2>Наши шары и композиции</h2>
        </div>
        <div className="shop-controls reveal">
          <div className="filters" id="filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`chip${activeCat === cat ? " active" : ""}`}
                type="button"
                onClick={() => setActiveCat(cat)}
              >
                {cat}
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
          {!list.length ? (
            <div className="empty">
              🎈{" "}
              {favOnly
                ? "В избранном пока пусто. Нажмите ♡ на товаре."
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
                    <span className="card-cat">{p.cat}</span>
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
