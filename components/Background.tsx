"use client";

import { useEffect, useRef } from "react";
import { COLORS } from "@/lib/data";
import { balloonSVG } from "@/lib/balloons";

export function Background() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const bgCols = ["pink", "sky", "sun", "mint", "lav", "coral"] as const;
    for (let i = 0; i < 8; i++) {
      const d = document.createElement("div");
      d.className = "drift";
      const w = 40 + Math.random() * 60;
      d.style.left = Math.random() * 100 + "%";
      d.style.animationDuration = 16 + Math.random() * 14 + "s";
      d.style.animationDelay = -Math.random() * 20 + "s";
      d.innerHTML = balloonSVG(COLORS[bgCols[i % bgCols.length]], w);
      bg.appendChild(d);
    }
  }, []);

  return (
    <>
      <div className="bg" />
      <div className="bg-grain" />
      <div className="bg-balloons" id="bgBalloons" ref={bgRef} />
    </>
  );
}
