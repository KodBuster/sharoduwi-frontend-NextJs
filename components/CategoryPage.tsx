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
import { getCollectionBySlug } from "@/lib/data";
import type { CollectionSlug } from "@/lib/products";

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

function CategoryContent({ slug }: { slug: CollectionSlug }) {
  const collection = getCollectionBySlug(slug)!;

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
            <Link href="/#collections">Коллекции</Link>
            <span aria-hidden="true">/</span>
            <span>{collection.name}</span>
          </nav>
        </div>
      </section>
      <Shop
        pageCollection={slug}
        heading={collection.name}
        description={collection.sub}
      />
      <Footer />
      <CartDrawer />
      <MobMenu />
      <Toast />
      <FabContacts />
    </>
  );
}

export function CategoryPage({ slug }: { slug: CollectionSlug }) {
  return (
    <AppProvider catalogCollection={slug}>
      <CategoryContent slug={slug} />
    </AppProvider>
  );
}
