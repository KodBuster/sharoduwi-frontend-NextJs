"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { useCity } from "@/context/CityContext";
import { CityLink } from "@/components/CityLink";
import { HERO_MINI } from "@/lib/data";
import { COLORS } from "@/lib/data";
import { getCityHeroStats } from "@/lib/cities";
import { balloonSVG } from "@/lib/balloons";

const HERO_BANNER_SRC = "/images/1-sentyabrya-hero.png";
const HERO_BANNER_HREF = "/categories/1-sentyabrya-2";
const HERO_BANNER_ALT = "Коллекция 1 сентября — шары к школе и линейке";

export function Hero() {
  const { openContact } = useApp();
  const { city } = useCity();
  const miniRef = useRef<HTMLDivElement>(null);
  const heroLead = city?.seo.heroLead ??
    "Гелиевые и воздушные шары: фольгированные цифры, эксклюзивные яркие композиции, любимые герои, необычные формы. Привозим точно ко времени. Фото или видео перед доставкой.";
  const heroStats = getCityHeroStats(city);

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
                Ваш праздник <span className="hl" id="rising-word">начинается</span> здесь
              </span>
            </h1>
            <p className="lead reveal" data-d="2">
              {heroLead}
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
                {heroStats.middle.type === "count" ? (
                  <b
                    data-count={heroStats.middle.value}
                    {...(heroStats.middle.suffix
                      ? { "data-suffix": heroStats.middle.suffix }
                      : {})}
                  >
                    0
                  </b>
                ) : (
                  <b>{heroStats.middle.value}</b>
                )}
                <span>{heroStats.middle.label}</span>
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
              <CityLink
                href={HERO_BANNER_HREF}
                className="hero-badge hero-badge--banner"
                aria-label={HERO_BANNER_ALT}
              >
                <span className="ribbon-knot" />
                <div className="hero-badge-photo">
                  <img
                    src={HERO_BANNER_SRC}
                    alt={HERO_BANNER_ALT}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </CityLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
