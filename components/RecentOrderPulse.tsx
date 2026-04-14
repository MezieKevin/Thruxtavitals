"use client";

import { useEffect, useRef, useState } from "react";
import { pickRandomNigerianFullName } from "@/lib/nigerianNames";
import { PRODUCTS } from "@/lib/products";

type RecentOrderPulseProps = {
  className?: string;
};

function buildOrderLine(): string {
  const name = pickRandomNigerianFullName();
  const secs = 8 + Math.floor(Math.random() * 92);
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]!;
  return `${name} made an order for ${product.name} ${secs} seconds ago.`;
}

/** Next refresh delay (ms): random between bounds so updates feel organic. */
function nextRefreshMs(): number {
  return 4500 + Math.floor(Math.random() * 18500);
}

/**
 * Live-style social proof: new random line on an irregular timer, with motion
 * and glow so it catches the eye without blocking content.
 */
export function RecentOrderPulse({ className = "" }: RecentOrderPulseProps) {
  const [line, setLine] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const schedule = () => {
      if (cancelled) return;
      timeoutRef.current = window.setTimeout(() => {
        if (cancelled) return;
        setLine(buildOrderLine());
        setTick((t) => t + 1);
        schedule();
      }, nextRefreshMs());
    };

    setLine(buildOrderLine());
    setTick((t) => t + 1);
    schedule();

    return () => {
      cancelled = true;
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`recent-order-attention rounded-xl border-2 border-black bg-gradient-to-r from-[#c9fa49]/35 via-[#c9fa49]/15 to-white px-3 py-2.5 sm:px-4 sm:py-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span className="relative mt-0.5 flex h-3 w-3 shrink-0 self-center">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9fa49] opacity-60"
            aria-hidden
          />
          <span
            className="relative inline-flex h-3 w-3 rounded-full border-2 border-black bg-[#c9fa49]"
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/70">
            Just ordered
          </p>
          <p
            key={tick}
            className="recent-order-line-enter mt-0.5 text-sm font-semibold leading-snug text-black sm:text-[0.95rem]"
          >
            {line ?? "\u00a0"}
          </p>
        </div>
      </div>
    </div>
  );
}
