"use client";

import { useApp } from "@/context/AppContext";

export function Toast() {
  const { toastName, toastVisible, openCart } = useApp();

  return (
    <div className={`toast${toastVisible ? " show" : ""}`} id="toast" role="status" aria-live="polite">
      <span className="toast-ic">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <div className="toast-txt">
        <b id="toastName">{toastName}</b>
        <span>добавлен в корзину</span>
      </div>
      <button className="toast-go" id="toastGo" type="button" onClick={openCart}>
        Корзина
      </button>
    </div>
  );
}
