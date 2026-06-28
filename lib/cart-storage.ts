const CART_STORAGE_KEY = "sharoduwi-cart";

export type CartMap = Record<number, number>;

export function readStoredCart(): CartMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const cart: CartMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      const id = Number(key);
      const qty = Number(value);
      if (Number.isFinite(id) && Number.isFinite(qty) && qty > 0) {
        cart[id] = Math.floor(qty);
      }
    }
    return cart;
  } catch {
    return {};
  }
}

export function persistCart(cart: CartMap) {
  if (typeof window === "undefined") return;
  if (Object.keys(cart).length === 0) {
    localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}
