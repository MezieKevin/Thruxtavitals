"use client";

import { useState } from "react";
import { OrderModal } from "./OrderModal";

type ProductOrderActionsProps = {
  productSlug: string;
  productName: string;
};

export function ProductOrderActions({
  productSlug,
  productName,
}: ProductOrderActionsProps) {
  const [open, setOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setModalKey((k) => k + 1);
          setOpen(true);
        }}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#c9fa49] px-8 py-4 text-base font-semibold text-black transition hover:brightness-95 sm:w-auto"
      >
        Order now — pay on delivery
      </button>
      <OrderModal
        key={modalKey}
        productSlug={productSlug}
        productName={productName}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
