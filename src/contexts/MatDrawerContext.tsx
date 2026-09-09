import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface MatDrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const MatDrawerContext = createContext<MatDrawerContextValue | undefined>(undefined);

export function MatDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);
  return <MatDrawerContext.Provider value={value}>{children}</MatDrawerContext.Provider>;
}

export function useMatDrawer() {
  const ctx = useContext(MatDrawerContext);
  if (!ctx) throw new Error("useMatDrawer must be used within MatDrawerProvider");
  return ctx;
}
