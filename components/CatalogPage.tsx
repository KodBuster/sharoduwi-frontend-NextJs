"use client";

import { useCallback } from "react";
import Link from "next/link";
import { AppProvider, useApp } from "@/context/AppContext";
import {
  useCountUp,
  useEscapeKey,
  useHeaderScroll,
  useRisingLetters,
  useScrollProgressFallback,
  useScrollReveal,
} from "@/hooks/useSiteEffects";
import {
  useCardTilt,
  useConfettiCursor,
  useHeroParallax,
} from "@/hooks/useConfettiCursor";
import { Background } from "@/components/Background";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Shop } from "@/components/Shop";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { MobMenu } from "@/components/MobMenu";
import { Toast } from "@/components/Toast";
import { FabContacts } from "@/components/FabContacts";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ConfettiCursor } from "@/components/ConfettiCursor";

function SiteEffects() {
  const { closeAll, closeMob } = useApp();
  const onEscape = useCallback(() => {
    closeAll();
    closeMob();
  }, [closeAll, closeMob]);

  useScrollReveal();
  useHeaderScroll();
  useCountUp();
  useRisingLetters();
  useScrollProgressFallback();
  useConfettiCursor();
  useHeroParallax();
  useCardTilt();
  useEscapeKey(onEscape);

  return null;
}

function CatalogContent() {
  return (
    <>
      <SiteEffects />
      <ScrollProgress />
      <Background />
      <ConfettiCursor />
      <TopBar />
      <Header />
      <a id="top" />
      <section className="sec category-page">
        <div className="wrap">
          <nav className="category-breadcrumb reveal" aria-label="Навигация">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <span>Каталог</span>
          </nav>
        </div>
      </section>
      <Shop
        heading="Наши шары и композиции"
        description="Полный каталог гелиевых шаров, композиций и наборов — с фильтрами по типу и поиском."
      />
      <Footer />
      <CartDrawer />
      <MobMenu />
      <Toast />
      <FabContacts />
    </>
  );
}

export function CatalogPage() {
  return (
    <AppProvider>
      <CatalogContent />
    </AppProvider>
  );
}
