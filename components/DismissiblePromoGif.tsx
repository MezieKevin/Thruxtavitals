"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "thruxta_promo_gif_dismissed_v1";

type DismissiblePromoGifProps = {
  variant: "floating" | "inline";
  className?: string;
};

export function DismissiblePromoGif({
  variant,
  className = "",
}: DismissiblePromoGifProps) {
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        setVisible(!sessionStorage.getItem(STORAGE_KEY));
      } catch {
        setVisible(true);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  if (visible === null || !visible) return null;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- animated GIF
    <img
      src="/gifs/hlWdPqh.gif"
      alt=""
      className={
        variant === "floating"
          ? "h-auto w-full max-h-[200px] object-cover sm:max-h-[220px]"
          : "h-auto w-full max-h-[280px] rounded-xl object-contain sm:max-h-[320px]"
      }
    />
  );

  const close = (
    <button
      type="button"
      onClick={dismiss}
      className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 text-lg font-medium text-white shadow-md transition hover:bg-black"
      aria-label="Close and hide this message"
    >
      ×
    </button>
  );

  if (variant === "floating") {
    return (
      <div
        className={`fixed bottom-28 right-3 z-[45] w-[min(220px,calc(100vw-1.5rem))] sm:bottom-32 sm:right-5 sm:w-[240px] ${className}`}
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-black shadow-2xl">
          {close}
          {img}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto max-w-lg overflow-hidden rounded-2xl border-2 border-black/15 bg-zinc-100 shadow-lg ${className}`}
    >
      {close}
      <div className="p-2">{img}</div>
    </div>
  );
}
