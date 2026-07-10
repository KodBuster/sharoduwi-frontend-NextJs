import type { AdvantShopCatalogProduct } from "./types";

type StockSource = Pick<AdvantShopCatalogProduct, "offers" | "amount" | "amountOffer">;

/** Остаток товара из ответа AdvantShop (amount, amountOffer или offer.amount). */
export function getAdvantShopProductAmount(item: StockSource): number | undefined {
  if (item.amount != null && Number.isFinite(item.amount)) {
    return item.amount;
  }

  if (item.amountOffer != null && Number.isFinite(item.amountOffer)) {
    return item.amountOffer;
  }

  const offers = item.offers ?? [];
  if (!offers.length) return undefined;

  const main = offers.find((offer) => offer.isMain) ?? offers[0];
  if (main?.amount != null && Number.isFinite(main.amount)) {
    return main.amount;
  }

  const amounts = offers
    .map((offer) => offer.amount)
    .filter((value): value is number => value != null && Number.isFinite(value));

  return amounts.length ? Math.max(...amounts) : undefined;
}

export function isAdvantShopProductInStock(item: StockSource): boolean {
  const amount = getAdvantShopProductAmount(item);
  return amount != null && amount > 0;
}
