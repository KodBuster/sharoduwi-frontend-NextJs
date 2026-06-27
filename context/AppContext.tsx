"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/data";

type Cart = Record<number, number>;
type Fav = Record<number, boolean>;

interface AppContextValue {
  cart: Cart;
  fav: Fav;
  favOnly: boolean;
  activeCat: Category;
  searchQuery: string;
  cartOpen: boolean;
  mobOpen: boolean;
  fabOpen: boolean;
  toastName: string;
  toastVisible: boolean;
  cartCount: number;
  favCount: number;
  setSearchQuery: (q: string) => void;
  setActiveCat: (cat: Category) => void;
  setFavOnly: (v: boolean) => void;
  toggleFav: (id: number) => void;
  addToCart: (id: number, x?: number, y?: number) => void;
  incrementCart: (id: number) => void;
  decrementCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  openCart: () => void;
  closeCart: () => void;
  openMob: () => void;
  closeMob: () => void;
  openContact: () => void;
  closeContact: () => void;
  setFabOpen: (open: boolean) => void;
  closeAll: () => void;
  getCartQty: (id: number) => number;
  isFav: (id: number) => boolean;
  burstRef: React.MutableRefObject<((x: number, y: number, count?: number) => void) | null>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [fav, setFav] = useState<Fav>({});
  const [favOnly, setFavOnly] = useState(false);
  const [activeCat, setActiveCat] = useState<Category>("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [fabOpen, setFabOpenState] = useState(false);
  const [toastName, setToastName] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstRef = useRef<((x: number, y: number, count?: number) => void) | null>(null);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((s, q) => s + q, 0),
    [cart]
  );
  const favCount = useMemo(() => Object.keys(fav).length, [fav]);

  const showToast = useCallback((id: number) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    setToastName(`«${p.name}»`);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2800);
  }, []);

  const addToCart = useCallback(
    (id: number, x?: number, y?: number) => {
      setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      showToast(id);
      if (x != null && y != null) burstRef.current?.(x, y, 40);
    },
    [showToast]
  );

  const incrementCart = useCallback((id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const decrementCart = useCallback((id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      next[id] = (next[id] || 0) - 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toggleFav = useCallback((id: number) => {
    setFav((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openMob = useCallback(() => setMobOpen(true), []);
  const closeMob = useCallback(() => setMobOpen(false), []);
  const openContact = useCallback(() => setFabOpenState(true), []);
  const closeContact = useCallback(() => setFabOpenState(false), []);
  const setFabOpen = useCallback((open: boolean) => setFabOpenState(open), []);

  const closeAll = useCallback(() => {
    setCartOpen(false);
    setFabOpenState(false);
    setMobOpen(false);
  }, []);

  const getCartQty = useCallback((id: number) => cart[id] || 0, [cart]);
  const isFav = useCallback((id: number) => !!fav[id], [fav]);

  const handleSetFavOnly = useCallback((v: boolean) => {
    setFavOnly(v);
    if (v) setActiveCat("Все");
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      cart,
      fav,
      favOnly,
      activeCat,
      searchQuery,
      cartOpen,
      mobOpen,
      fabOpen,
      toastName,
      toastVisible,
      cartCount,
      favCount,
      setSearchQuery,
      setActiveCat,
      setFavOnly: handleSetFavOnly,
      toggleFav,
      addToCart,
      incrementCart,
      decrementCart,
      removeFromCart,
      openCart,
      closeCart,
      openMob,
      closeMob,
      openContact,
      closeContact,
      setFabOpen,
      closeAll,
      getCartQty,
      isFav,
      burstRef,
    }),
    [
      cart,
      fav,
      favOnly,
      activeCat,
      searchQuery,
      cartOpen,
      mobOpen,
      fabOpen,
      toastName,
      toastVisible,
      cartCount,
      favCount,
      handleSetFavOnly,
      toggleFav,
      addToCart,
      incrementCart,
      decrementCart,
      removeFromCart,
      openCart,
      closeCart,
      openMob,
      closeMob,
      openContact,
      closeContact,
      setFabOpen,
      closeAll,
      getCartQty,
      isFav,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { CATEGORIES };
