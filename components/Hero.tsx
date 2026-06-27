"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { HERO_MINI } from "@/lib/data";
import { COLORS } from "@/lib/data";
import { balloonSVG } from "@/lib/balloons";

export function Hero() {
  const { addToCart, openContact } = useApp();
  const miniRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = miniRef.current;
    if (!el) return;
    HERO_MINI.forEach((m) => {
      const d = document.createElement("div");
      d.className = "mb";
      d.style.left = m.x + "%";
      d.style.top = m.y + "%";
      d.style.setProperty("--w", m.w + "px");
      d.style.setProperty("--d", m.d + "s");
      d.style.setProperty("--dur", m.dur + "s");
      d.style.setProperty("--rot", m.rot + "deg");
      d.innerHTML = balloonSVG(COLORS[m.c], m.w);
      el.appendChild(d);
    });
  }, []);

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="reveal" data-d="1">
              <span className="hero-float">
                Праздник, который <span className="hl" id="rising-word">взлетает</span> вместе с настроением
              </span>
            </h1>
            <p className="lead reveal" data-d="2">
              Фольгированные цифры, яркие композиции и облака шаров. Надуваем гелием при вас и привозим точно к торжеству.
            </p>
            <div className="hero-cta reveal" data-d="3">
              <button className="btn btn-primary" id="heroContact" type="button" onClick={openContact}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Связаться с нами
              </button>
              <a href="#shop" className="btn btn-ghost">
                Смотреть каталог
              </a>
            </div>
            <div className="hero-stats reveal" data-d="4">
              <div className="st">
                <b data-count="20" data-suffix="+">
                  0
                </b>
                <span>лет дарим праздник</span>
              </div>
              <div className="st">
                <b data-count="2">0</b>
                <span>магазина в городе</span>
              </div>
              <div className="st">
                <b data-count="5000" data-suffix="+">
                  0
                </b>
                <span>счастливых семей</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-stage">
              <div className="mini-balloons" id="heroMini" ref={miniRef} />
              <div className="hero-badge">
                <span className="ribbon-knot" />
                <h3>Облако из 15 шаров</h3>
                <p>хит для дня рождения</p>
                <div className="price">
                  1 890 ₽ <s>2 300 ₽</s>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  style={{ width: "100%", justifyContent: "center", marginTop: 18, padding: 13 }}
                  onClick={(e) => addToCart(3, e.clientX, e.clientY)}
                >
                  В корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
