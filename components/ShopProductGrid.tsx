"use client";

import { useMemo, useState } from "react";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { ProductShopCard } from "@/components/ProductShopCard";
import { productsForCategory } from "@/lib/shopFilters";

export function ShopProductGrid() {
  const [categoryId, setCategoryId] = useState("all");

  const filtered = useMemo(
    () => productsForCategory(categoryId),
    [categoryId],
  );

  return (
    <>
      <CategoryCarousel
        selectedCategoryId={categoryId}
        onCategorySelect={setCategoryId}
      />
      <ul
        className="mt-10 grid gap-8 sm:grid-cols-2"
        aria-live="polite"
        aria-label="Products in selected category"
      >
        {filtered.map((p) => (
          <ProductShopCard
            key={p.slug}
            product={p}
            anchorId={
              p.slug === "coq10"
                ? "heart"
                : p.slug === "testosterone-booster-plus"
                  ? "mens-sexual"
                  : undefined
            }
          />
        ))}
      </ul>
    </>
  );
}
