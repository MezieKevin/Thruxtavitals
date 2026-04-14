"use client";

import { useRef } from "react";
import { SHOP_CATEGORIES } from "@/lib/shopCategories";

type CategoryCarouselProps = {
  selectedCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
};

export function CategoryCarousel({
  selectedCategoryId,
  onCategorySelect,
}: CategoryCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollByDir = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByDir("left")}
        className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-lg text-black shadow-md transition hover:bg-black/5 sm:-left-2"
        aria-label="Scroll categories left"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollByDir("right")}
        className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-lg text-black shadow-md transition hover:bg-black/5 sm:-right-2"
        aria-label="Scroll categories right"
      >
        ›
      </button>

      <div
        ref={ref}
        role="tablist"
        aria-label="Product categories"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pl-12 pr-12 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:pl-14 sm:pr-14 [&::-webkit-scrollbar]:hidden"
      >
        {SHOP_CATEGORIES.map((c) => {
          const selected = selectedCategoryId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onCategorySelect(c.id)}
              className={`flex min-w-[220px] shrink-0 snap-start items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-md transition hover:shadow-lg ${
                selected
                  ? "border-[#c9fa49] ring-2 ring-[#c9fa49]/40"
                  : "border-black/10 hover:border-[#c9fa49]/60"
              }`}
            >
              <span className="text-3xl" aria-hidden>
                {c.emoji}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-black">{c.label}</p>
                <p className="text-sm text-black/50">{c.countLabel}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
