"use client";

import { useState } from "react";
import { COLLECTIONS, COL_VISIBLE, COLORS } from "@/lib/data";
import { cluster, hexa } from "@/lib/balloons";

export function Collections() {
  const [expanded, setExpanded] = useState(false);
  const hidden = Math.max(0, COLLECTIONS.length - COL_VISIBLE);

  const toggle = () => {
    if (!expanded) {
      setExpanded(true);
      requestAnimationFrame(() => {
        document.querySelectorAll(".col-card.is-extra").forEach((card) => card.classList.add("in"));
      });
    } else {
      setExpanded(false);
      document.getElementById("collections")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="sec" id="collections">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-tag">
            <span className="dot" /> Коллекции
          </div>
          <h2>Выберите повод</h2>
          <p>Готовые подборки под любое торжество — от первого дня рождения до выписки из роддома.</p>
        </div>
        <div className={`collections${expanded ? " expanded" : ""}`} id="collectionsGrid">
          {COLLECTIONS.map((c, idx) => {
            const grad =
              c.bg ||
              `linear-gradient(150deg,${hexa(COLORS[c.colors[0]], 0.3)},${hexa(COLORS[c.colors[c.colors.length - 1]], 0.16)})`;
            return (
              <a
                href="#shop"
                key={c.name}
                className={`col-card reveal${idx >= COL_VISIBLE ? " is-extra" : ""}`}
              >
                <div className="col-bg" style={{ background: grad }}>
                  {c.img && <img className="col-img" src={c.img} alt={c.name} loading="lazy" />}
                </div>
                {!c.img && (
                  <div className="col-balloons" style={{ display: "grid", placeItems: "center", paddingBottom: 30 }}
                    dangerouslySetInnerHTML={{ __html: cluster(c.colors, 72, `col-${idx}`) }}
                  />
                )}
                <div className="col-overlay" />
                <div className="col-info">
                  <h3>{c.name}</h3>
                  <span>
                    {c.sub}{" "}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
        {hidden > 0 && (
          <div className="more-wrap" id="moreWrap">
            <button className={`more-btn${expanded ? " open" : ""}`} id="moreCols" type="button" onClick={toggle}>
              <span id="moreLabel">{expanded ? "Свернуть" : `Показать ещё ${hidden}`}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
