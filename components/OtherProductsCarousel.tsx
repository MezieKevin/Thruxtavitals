"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductShopCard } from "@/components/ProductShopCard";
import type { Product } from "@/lib/products";

export type CrossSellItem = { product: Product; key: string };

/**
 * Horizontal cross-sell: 1 card width on mobile, 3 on tablet (md), 4 on desktop (lg).
 * Gap is gap-3 (0.75rem) — flex-basis matches (n − 1) gaps for n visible columns.
 */
export function OtherProductsCarousel({ items }: { items: CrossSellItem[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [items, updateArrows]);

  const scrollPage = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const itemBasisClass =
    "flex-[0_0_100%] md:flex-[0_0_calc((100%-1.5rem)/3)] lg:flex-[0_0_calc((100%-2.25rem)/4)]";

  return (
    <div className="relative mt-4 sm:mt-5">
      <button
        type="button"
        onClick={() => scrollPage(-1)}
        disabled={!canScrollLeft}
        className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white text-lg font-medium text-black shadow-md transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:left-1"
        aria-label="Scroll products left"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollPage(1)}
        disabled={!canScrollRight}
        className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white text-lg font-medium text-black shadow-md transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:right-1"
        aria-label="Scroll products right"
      >
        ›
      </button>

      <ul
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-11 scroll-pr-11 px-11 pb-5 pt-0.5 sm:scroll-pl-12 sm:scroll-pr-12 sm:px-12 sm:pb-6 md:scroll-pl-14 md:scroll-pr-14 md:px-14 md:pb-7 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20"
        aria-label="More products"
      >
        {items.map(({ product: p, key }) => (
          <ProductShopCard
            key={key}
            product={p}
            variant="carousel"
            listClassName={itemBasisClass}
          />
        ))}
      </ul>
    </div>
  );
}
