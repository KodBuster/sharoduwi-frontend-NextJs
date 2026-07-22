/**
 * Regenerates lib/delivery-pricing-data.ts from Sharoduwi_Price_delivery.xlsx
 *
 * Usage:
 *   node scripts/generate-delivery-pricing-data.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import ExcelJS from "exceljs";

const XLSX_PATH =
  process.env.DELIVERY_XLSX_PATH ||
  "C:/Users/Дмитрий/Desktop/Секреты/Sharoduwi_Price_delivery.xlsx";
const OUT_PATH = "lib/delivery-pricing-data.ts";

/** При дублях одного имени — оставить строку с этой стоимостью доставки. */
const PREFERRED_DELIVERY_BY_NAME = {
  Загорново: 600,
  Малышево: 900,
  Сельцо: 900,
};

function norm(s) {
  return String(s)
    .replace(/[\u2010-\u2015\u2212\u00AD]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function parseSettlementNames(src) {
  const start = src.indexOf("export const SETTLEMENT_NAMES");
  if (start < 0) throw new Error("SETTLEMENT_NAMES not found");
  const open = src.indexOf("[", start);
  const close = src.indexOf("] as const", open);
  if (close < 0) throw new Error("SETTLEMENT_NAMES end not found");
  const block = src.slice(open, close + 1);
  return [...block.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(XLSX_PATH);
const ws = wb.worksheets[0];

/** @type {{ name: string, minOrder: number, delivery: number }[]} */
const excelRows = [];
ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
  if (rowNumber === 1) return;
  const name = String(row.getCell(1).value ?? "").trim();
  const minOrder = Number(row.getCell(2).value);
  const delivery = Number(row.getCell(3).value);
  if (!name || !Number.isFinite(minOrder) || !Number.isFinite(delivery)) return;
  excelRows.push({ name, minOrder, delivery });
});

const settlementNames = parseSettlementNames(
  readFileSync("lib/cities/settlements-data.ts", "utf8")
);
const settlementSet = new Set(settlementNames);
const byNorm = new Map(settlementNames.map((n) => [norm(n), n]));

const pricing = new Map();
const unmatched = [];
let mirnyyIndex = 0;

for (const row of excelRows) {
  let siteName;

  // Два разных «Мирный»: посёлок (Раменский) и пгт (Люберцы)
  if (norm(row.name) === "мирный") {
    mirnyyIndex += 1;
    siteName = mirnyyIndex === 1 ? "Мирный" : "пгт Мирный";
  } else {
    siteName = byNorm.get(norm(row.name));
  }

  if (!siteName || !settlementSet.has(siteName)) {
    unmatched.push(row.name);
    continue;
  }

  const preferred = PREFERRED_DELIVERY_BY_NAME[siteName];

  if (pricing.has(siteName)) {
    if (preferred != null && row.delivery === preferred) {
      pricing.set(siteName, {
        minOrder: row.minOrder,
        delivery: row.delivery,
      });
    }
    continue;
  }

  if (preferred != null && row.delivery !== preferred) {
    continue;
  }

  pricing.set(siteName, {
    minOrder: row.minOrder,
    delivery: row.delivery,
  });
}

const missing = settlementNames.filter((n) => !pricing.has(n));

const entries = [...pricing.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "ru")
);

const body = entries
  .map(
    ([name, v]) =>
      `  ${JSON.stringify(name)}: { minOrder: ${v.minOrder}, delivery: ${v.delivery} },`
  )
  .join("\n");

const file = `/**
 * Тарифы доставки по населённым пунктам.
 * Сгенерировано из Sharoduwi_Price_delivery.xlsx — не править вручную.
 * Перегенерация: node scripts/generate-delivery-pricing-data.mjs
 */

export type DeliveryPricingTariff = {
  /** Минимальная сумма заказа, ₽ */
  minOrder: number;
  /** Стоимость доставки, ₽ */
  delivery: number;
};

export const DELIVERY_PRICING_BY_NAME: Record<string, DeliveryPricingTariff> = {
${body}
};
`;

writeFileSync(OUT_PATH, file, "utf8");

console.log(
  JSON.stringify(
    {
      excelRows: excelRows.length,
      written: pricing.size,
      mirnyy: pricing.get("Мирный"),
      pgtMirnyy: pricing.get("пгт Мирный"),
      zagornovo: pricing.get("Загорново"),
      malyshevo: pricing.get("Малышево"),
      seltso: pricing.get("Сельцо"),
      unmatched: [...new Set(unmatched)],
      missingOnSite: missing,
    },
    null,
    2
  )
);
