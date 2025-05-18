"use client";

import React, { ReactNode, createContext, useContext } from "react";

interface LensProviderWrapperProps {
  children: ReactNode;
}

// Proveedor vacío, ya que solo se usará fetch manual
export function LensProviderWrapper({ children }: LensProviderWrapperProps) {
  return <>{children}</>;
}

// Contexto vacío para compatibilidad
const LensContext = createContext(null);
export const useLensClient = () => useContext(LensContext);

export const LensProvider = ({ children }: { children: React.ReactNode }) => (
  <LensContext.Provider value={null}>{children}</LensContext.Provider>
); 