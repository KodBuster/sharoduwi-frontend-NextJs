"use client";

import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { PRODUCTS, COLORS } from "@/lib/data";
import { balloonSVG, fmt } from "@/lib/balloons";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    closeCart,
    closeAll,
    openContact,
    incrementCart,
    decrementCart,
    removeFromCart,
  } = useApp();

  const { total, rows } = useMemo(() => {
    let total = 0;
    const rows = Object.keys(cart).map((idStr) => {
      const id = parseInt(idStr, 10);
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return null;
      const qty = cart[id];
      total += p.price * qty;
      return { p, qty, id };
    }).filter(Boolean) as { p: (typeof PRODUCTS)[0]; qty: number; id: number }[];
    return { total, rows };
  }, [cart]);

  const onCheckout = () => {
    closeCart();
    setTimeout(openContact, 250);
  };

  return (
    <>
      <div
        className={`overlay${cartOpen ? " open" : ""}`}
        id="overlay"
        onClick={closeAll}
      />
      <aside className={`drawer${cartOpen ? " open" : ""}`} id="cartDrawer">
        <div className="drawer-head">
          <h3>Корзина</h3>
          <button className="close-btn" id="closeCart" aria-label="Закрыть" type="button" onClick={closeCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="cart-items" id="cartItems">
          {!rows.length ? (
            <div className="cart-empty">
              <div className="e-bln">🎈</div>
              <b>Пока пусто</b>
              Добавьте шарики из каталога
            </div>
          ) : (
            rows.map(({ p, qty, id }) => (
              <div className="ci" key={id}>
                <div className="ci-vis" dangerouslySetInnerHTML={{ __html: balloonSVG(COLORS[p.colors[0]], 40, `cart-${id}`) }} />
                <div className="ci-info">
                  <h4>{p.name}</h4>
                  <div className="ci-price">{fmt(p.price)} ₽</div>
                  <div className="ci-qty">
                    <button className="qbtn" type="button" onClick={() => decrementCart(id)}>
                      −
                    </button>
                    <span>{qty}</span>
                    <button className="qbtn" type="button" onClick={() => incrementCart(id)}>
                      +
                    </button>
                  </div>
                </div>
                <button className="ci-del" type="button" aria-label="Удалить" onClick={() => removeFromCart(id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        {rows.length > 0 && (
          <div className="drawer-foot" id="cartFoot">
            <div className="cart-total">
              <span>Итого:</span>
              <b id="cartTotal">{fmt(total)} ₽</b>
            </div>
            <button className="btn btn-primary" id="checkout" type="button" onClick={onCheckout}>
              Оформить заказ
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
