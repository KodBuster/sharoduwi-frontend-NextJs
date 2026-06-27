"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { balloonSVG } from "@/lib/balloons";

export function FinalCTA() {
  const { openContact } = useApp();
  const balloonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = balloonsRef.current;
    if (!el) return;
    for (let j = 0; j < 6; j++) {
      const d2 = document.createElement("div");
      d2.style.position = "absolute";
      d2.style.left = Math.random() * 90 + "%";
      d2.style.top = Math.random() * 70 + "%";
      d2.style.opacity = "0.6";
      d2.innerHTML = balloonSVG("#FFFFFF", 30 + Math.random() * 40);
      d2.style.animation = `floatBig ${4 + Math.random() * 4}s ease-in-out infinite`;
      d2.style.animationDelay = -Math.random() * 4 + "s";
      el.appendChild(d2);
    }
  }, []);

  return (
    <section className="sec">
      <div className="wrap">
        <div className="cta-final reveal">
          <div className="cta-balloons" id="ctaBalloons" ref={balloonsRef} />
          <h2>Закажите праздник прямо сейчас</h2>
          <p>Напишите нам в удобный мессенджер — поможем выбрать, рассчитаем стоимость и привезём вовремя.</p>
          <div className="hero-cta">
            <button className="btn btn-white" id="ctaContact" type="button" onClick={openContact}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
