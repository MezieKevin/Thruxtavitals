import type { Product } from "@/lib/products";
import { PRODUCTS } from "@/lib/products";

/** Category ids from `SHOP_CATEGORIES` → which product slugs to show */
export function productsForCategory(categoryId: string): Product[] {
  switch (categoryId) {
    case "all":
      return PRODUCTS;
    case "heart":
      return PRODUCTS.filter((p) => p.slug === "coq10");
    case "vitality":
    case "mens-sexual":
      return PRODUCTS.filter((p) => p.slug === "testosterone-booster-plus");
    default:
      return PRODUCTS;
  }
}
