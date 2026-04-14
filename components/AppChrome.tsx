"use client";

import type { ReactNode } from "react";
import { FloatingCtaBar } from "@/components/FloatingCtaBar";
import { FloatingPromoGifGate } from "@/components/FloatingPromoGifGate";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ModalOverlayProvider } from "@/components/ModalOverlayContext";

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <ModalOverlayProvider>
      {children}
      <FloatingPromoGifGate />
      <FloatingWhatsApp />
      <FloatingCtaBar />
    </ModalOverlayProvider>
  );
}
