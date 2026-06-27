"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { cluster } from "@/lib/balloons";

export function PromoSection() {
  const { openContact } = useApp();
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (artRef.current) {
      artRef.current.innerHTML = cluster(["pink", "sun", "mint", "sky"], 84);
    }
  }, []);

  return (
    <section className="promo-sec" id="promo">
      <div className="wrap">
        <div className="promo-card reveal">
          <div className="promo-info">
            <span className="promo-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                <path d="M2 7h20v5H2zM12 22V7M12 7H8.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h3.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
              </svg>
              Акция для новых клиентов
            </span>
            <h2>
              Первый заказ — со скидкой <b>−10%</b>
            </h2>
            <p className="promo-text">
              Заказываете у нас впервые? Назовите промокод при оформлении — и получите скидку на любую композицию. Поможем выбрать и привезём точно к празднику.
            </p>
            <div className="promo-actions">
              <span className="promo-code">
                ПЕРВЫЙ10 <small>промокод</small>
              </span>
              <button className="btn btn-primary" id="promoContact" type="button" onClick={openContact}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Заказать со скидкой
              </button>
            </div>
            <div className="promo-trust">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Работаем с 2005 года
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                5000+ выполненных заказов
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Доставка по Москве и Московской области
              </span>
            </div>
          </div>
          <div className="promo-art" id="promoArt" ref={artRef} />
        </div>
      </div>
    </section>
  );
}
