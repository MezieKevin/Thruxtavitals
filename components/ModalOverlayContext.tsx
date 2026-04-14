"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ModalOverlayContextValue = {
  openCount: number;
  pushModal: () => void;
  popModal: () => void;
};

const ModalOverlayContext = createContext<ModalOverlayContextValue | null>(
  null,
);

export function ModalOverlayProvider({ children }: { children: ReactNode }) {
  const [openCount, setOpenCount] = useState(0);

  const pushModal = useCallback(() => {
    setOpenCount((c) => c + 1);
  }, []);

  const popModal = useCallback(() => {
    setOpenCount((c) => Math.max(0, c - 1));
  }, []);

  const value = useMemo(
    () => ({ openCount, pushModal, popModal }),
    [openCount, pushModal, popModal],
  );

  return (
    <ModalOverlayContext.Provider value={value}>
      {children}
    </ModalOverlayContext.Provider>
  );
}

export function useModalOverlayOptional() {
  return useContext(ModalOverlayContext);
}

/** Register a blocking overlay (e.g. dialog) so chrome like the floating CTA can hide. */
export function useRegisterModalOpen(isOpen: boolean) {
  const ctx = useContext(ModalOverlayContext);
  const push = ctx?.pushModal;
  const pop = ctx?.popModal;

  useEffect(() => {
    if (!isOpen || !push || !pop) return;
    push();
    return () => pop();
  }, [isOpen, push, pop]);
}
