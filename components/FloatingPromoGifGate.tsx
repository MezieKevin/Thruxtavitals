"use client";

import { usePathname } from "next/navigation";
import { DismissiblePromoGif } from "@/components/DismissiblePromoGif";

/**
 * Corner promo — hidden on routes that already show a large inline GIF
 * so we never stack two copies on one screen.
 */
export function FloatingPromoGifGate() {
  const path = usePathname();

  const hideFloating =
    path === "/" ||
    path === "/shop" ||
    path.startsWith("/order/testosterone-booster-plus");

  if (hideFloating) return null;

  return <DismissiblePromoGif variant="floating" />;
}
