import { COLORS, type ColorKey } from "./data";

export function shade(hex: string, p: number): string {
  if (hex === "#FFFFFF") return "#F0E2EA";
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const f = p / 100;
  r = Math.round(Math.min(255, Math.max(0, r + r * f)));
  g = Math.round(Math.min(255, Math.max(0, g + g * f)));
  b = Math.round(Math.min(255, Math.max(0, b + b * f)));
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  );
}

export function hexa(hex: string, a: number): string {
  let h = hex;
  if (h === "#FFFFFF") h = "#FFE3F1";
  const n = parseInt(h.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

let svgIdCounter = 0;

export function balloonSVG(hex: string, w = 60, id?: string): string {
  const h = Math.round(w * 1.22);
  const gradId = id ?? `g${++svgIdCounter}`;
  const stroke = hex === "#FFFFFF" ? "#E8C9DA" : "rgba(150,0,80,.0)";
  return (
    `<svg width="${w}" height="${h}" viewBox="0 0 60 73" fill="none" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><radialGradient id="${gradId}" cx="34%" cy="28%" r="75%">` +
    `<stop offset="0%" stop-color="#ffffff" stop-opacity="${hex === "#FFFFFF" ? "1" : ".85"}"/>` +
    `<stop offset="22%" stop-color="${hex}"/>` +
    `<stop offset="100%" stop-color="${shade(hex, -22)}"/></radialGradient></defs>` +
    `<path d="M30 2C16 2 8 12 8 25c0 14 12 24 19 28 1 .6 1 1.6 0 2.3-1.3.9-2 1.7-2 2.7 0 1.7 2.2 3 5 3s5-1.3 5-3c0-1-.7-1.8-2-2.7-1-.7-1-1.7 0-2.3 7-4 19-14 19-28C52 12 44 2 30 2z" ` +
    `fill="url(#${gradId})" stroke="${stroke}" stroke-width="1"/>` +
    `<ellipse cx="22" cy="20" rx="6" ry="9" fill="#fff" opacity="${hex === "#FFFFFF" ? ".5" : ".45"}"/>` +
    `<path d="M30 64c0 4 1 7 0 12" stroke="${shade(hex, -18)}" stroke-width="1.4" stroke-linecap="round" opacity=".8" fill="none"/>` +
    `</svg>`
  );
}

export function cluster(colorKeys: ColorKey[], base = 88, prefix = "c"): string {
  const positions = [
    { x: 0, y: 6, s: 1 },
    { x: -42, y: 24, s: 0.82 },
    { x: 42, y: 22, s: 0.82 },
    { x: -20, y: 46, s: 0.7 },
    { x: 22, y: 48, s: 0.7 },
  ];
  let html = '<div style="position:relative;width:160px;height:150px">';
  for (let i = 0; i < colorKeys.length; i++) {
    const p = positions[i] ?? { x: i * 18 - 30, y: 30, s: 0.7 };
    const c = COLORS[colorKeys[i]] ?? COLORS.pink;
    html +=
      `<div style="position:absolute;left:50%;top:0;transform:translateX(-50%) translate(${p.x}px,${p.y}px) scale(${p.s});transform-origin:50% 0;filter:drop-shadow(0 8px 10px rgba(120,30,90,.2))">` +
      balloonSVG(c, base, `${prefix}-${i}`) +
      "</div>";
  }
  html += "</div>";
  return html;
}
