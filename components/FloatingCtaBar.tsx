"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useModalOverlayOptional } from "@/components/ModalOverlayContext";

const FOOTER_GAP_PX = 8;
const DEFAULT_BOTTOM_PX = 12;

export function FloatingCtaBar() {
  const overlay = useModalOverlayOptional();
  const pathname = usePathname();
  const isProductDetail =
    pathname.startsWith("/order/") && pathname !== "/order";

  const [bottomPx, setBottomPx] = useState(DEFAULT_BOTTOM_PX);

  const updateBottom = useCallback(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) {
      setBottomPx(DEFAULT_BOTTOM_PX);
      return;
    }
    const rect = footer.getBoundingClientRect();
    const vh = window.innerHeight;
    // Place the bar's bottom edge just above the footer top (viewport coordinates).
    const neededFromViewportBottom = vh - rect.top + FOOTER_GAP_PX;
    setBottomPx(Math.max(DEFAULT_BOTTOM_PX, neededFromViewportBottom));
  }, []);

  useEffect(() => {
    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateBottom);
    };

    scheduleUpdate();

    const onScroll = () => scheduleUpdate();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const ro = new ResizeObserver(() => scheduleUpdate());
    const footer = document.getElementById("site-footer");
    if (footer) ro.observe(footer);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleUpdate);
      ro.disconnect();
    };
  }, [pathname, updateBottom]);

  if (overlay && overlay.openCount > 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-3 pt-2 sm:px-4"
      style={{
        bottom: `calc(${bottomPx}px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col gap-2 rounded-2xl border-2 border-black bg-[#c9fa49] px-4 py-3 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-3">
        <div className="flex min-w-0 flex-col gap-1 text-center sm:text-left">
          <p className="text-sm font-semibold leading-snug text-black sm:text-base">
            Heart, energy, men's vitality — delivered. Pay when you receive it.
          </p>
          <p className="text-xs font-semibold text-red-600 sm:text-sm">
            <Link
              href="/shop"
              className="underline decoration-red-600 underline-offset-2 hover:text-red-700"
            >
              Tap here
            </Link>{" "}
            for 20% off — shop now
          </p>
        </div>
        {isProductDetail ? (
          <a
            href="#order-product"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-black/90"
          >
            Buy now
          </a>
        ) : (
          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-black/90"
          >
            Buy now
          </Link>
        )}
      </div>
    </div>
  );
}
