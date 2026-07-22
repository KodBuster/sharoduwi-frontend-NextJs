"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import {
  scrollToSiteSectionAfterMenuClose,
} from "@/components/SiteSectionLink";
import { useCity } from "@/context/CityContext";

export const HOW_SECTION_ID = "how";
export const HOW_SECTION_HREF = "/#how";

export function scrollToHowSection(behavior: ScrollBehavior = "smooth") {
  document.getElementById(HOW_SECTION_ID)?.scrollIntoView({
    behavior,
    block: "start",
  });
}

interface HowToOrderLinkProps {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function HowToOrderLink({ children, className, onNavigate }: HowToOrderLinkProps) {
  const pathname = usePathname();
  const { href: cityHref, isHome } = useCity();
  const homeHref = cityHref("/");

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isHome || pathname === "/" || pathname === homeHref) {
      e.preventDefault();
      scrollToSiteSectionAfterMenuClose(HOW_SECTION_ID, onNavigate);
      return;
    }

    onNavigate?.();
  };

  return (
    <Link href={HOW_SECTION_HREF} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
