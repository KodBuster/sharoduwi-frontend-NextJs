"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "@/lib/data";
import type { CollectionSlug, TagFilter } from "@/lib/products";

type Cart = Record<number, number>;
type Fav = Record<number, boolean>;
type CatalogSource = "advantshop" | "static";

interface AppContextValue {
  cart: Cart;
  fav: Fav;
  favOnly: boolean;
  activeTag: TagFilter;
  activeCollection: CollectionSlug | null;
  searchQuery: string;
  cartOpen: boolean;
  mobOpen: boolean;
  fabOpen: boolean;
  toastName: string;
  toastVisible: boolean;
  cartCount: number;
  favCount: number;
  products: Product[];
  catalogSource: CatalogSource;
  catalogLoading: boolean;
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: TagFilter) => void;
  setActiveCollection: (slug: CollectionSlug | null) => void;
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
  getProduct: (id: number) => Product | undefined;
  burstRef: React.MutableRefObject<((x: number, y: number, count?: number) => void) | null>;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
  /** Загружать только товары выбранной коллекции (страница категории) */
  catalogCollection?: CollectionSlug;
}

export function AppProvider({ children, catalogCollection }: AppProviderProps) {
  const [cart, setCart] = useState<Cart>({});
  const [fav, setFav] = useState<Fav>({});
  const [favOnly, setFavOnly] = useState(false);
  const [activeTag, setActiveTag] = useState<TagFilter>("Все");
  const [activeCollection, setActiveCollection] = useState<CollectionSlug | null>(
    catalogCollection ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [fabOpen, setFabOpenState] = useState(false);
  const [toastName, setToastName] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [catalogSource, setCatalogSource] = useState<CatalogSource>("static");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstRef = useRef<((x: number, y: number, count?: number) => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);

    const catalogUrl = catalogCollection
      ? `/api/catalog?collection=${encodeURIComponent(catalogCollection)}`
      : "/api/catalog";

    fetch(catalogUrl)
      .then((response) => response.json())
      .then((data: { products?: Product[]; source?: CatalogSource }) => {
        if (cancelled) return;
        if (Array.isArray(data.products)) {
          setProducts(data.products.length ? data.products : PRODUCTS.filter(
            (product) => !catalogCollection || product.collectionSlug === catalogCollection
          ));
          setCatalogSource(data.source === "advantshop" ? "advantshop" : "static");
        }
      })
      .catch((error) => {
        console.error("Catalog fetch failed:", error);
        if (!cancelled) {
          setProducts(
            catalogCollection
              ? PRODUCTS.filter((product) => product.collectionSlug === catalogCollection)
              : PRODUCTS
          );
        }
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [catalogCollection]);

  const getProduct = useCallback(
    (id: number) => products.find((product) => product.id === id),
    [products]
  );

  const cartCount = useMemo(
    () => Object.values(cart).reduce((s, q) => s + q, 0),
    [cart]
  );
  const favCount = useMemo(() => Object.keys(fav).length, [fav]);

  const showToast = useCallback(
    (id: number) => {
      const p = getProduct(id);
      if (!p) return;
      setToastName(`«${p.name}»`);
      setToastVisible(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastVisible(false), 2800);
    },
    [getProduct]
  );

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

  const handleSetActiveTag = useCallback((tag: TagFilter) => {
    setActiveTag(tag);
  }, []);

  const handleSetActiveCollection = useCallback((slug: CollectionSlug | null) => {
    setActiveCollection(slug);
    if (slug) setActiveTag("Все");
  }, []);

  const handleSetFavOnly = useCallback((v: boolean) => {
    setFavOnly(v);
    if (v) {
      setActiveTag("Все");
      setActiveCollection(null);
    }
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      cart,
      fav,
      favOnly,
      activeTag,
      activeCollection,
      searchQuery,
      cartOpen,
      mobOpen,
      fabOpen,
      toastName,
      toastVisible,
      cartCount,
      favCount,
      products,
      catalogSource,
      catalogLoading,
      setSearchQuery,
      setActiveTag: handleSetActiveTag,
      setActiveCollection: handleSetActiveCollection,
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
      getProduct,
      burstRef,
    }),
    [
      cart,
      fav,
      favOnly,
      activeTag,
      activeCollection,
      searchQuery,
      cartOpen,
      mobOpen,
      fabOpen,
      toastName,
      toastVisible,
      cartCount,
      favCount,
      products,
      catalogSource,
      catalogLoading,
      handleSetActiveTag,
      handleSetActiveCollection,
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
      getProduct,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
