"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { useCity } from "@/context/CityContext";

export function scrollToSiteSection(sectionId: string, behavior: ScrollBehavior = "smooth") {
  document.getElementById(sectionId)?.scrollIntoView({ behavior, block: "start" });
}

/**
 * После закрытия бургер-меню body снимается с position:fixed и scroll
 * возвращается. Прокрутку к якорю нужно делать после этого cleanup.
 */
export function scrollToSiteSectionAfterMenuClose(
  sectionId: string,
  onNavigate?: () => void
) {
  onNavigate?.();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToSiteSection(sectionId);
    });
  });
}

interface SiteSectionLinkProps {
  sectionId: string;
  href?: string;
  /** Прокрутка к блоку на текущей странице (футер: доставка, контакты) */
  scrollOnAnyPage?: boolean;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function SiteSectionLink({
  sectionId,
  href,
  scrollOnAnyPage = false,
  children,
  className,
  onNavigate,
}: SiteSectionLinkProps) {
  const pathname = usePathname();
  const { href: cityHref, isHome } = useCity();
  const homeHref = cityHref("/");
  const target = href ?? (scrollOnAnyPage ? `#${sectionId}` : `${homeHref}#${sectionId}`);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (scrollOnAnyPage && document.getElementById(sectionId)) {
      e.preventDefault();
      scrollToSiteSectionAfterMenuClose(sectionId, onNavigate);
      return;
    }

    if (isHome || pathname === homeHref) {
      e.preventDefault();
      scrollToSiteSectionAfterMenuClose(sectionId, onNavigate);
      return;
    }

    onNavigate?.();
  };

  return (
    <Link href={target} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
