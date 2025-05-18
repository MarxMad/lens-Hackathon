"use client";

import React, { ReactNode } from "react";
import { BaseProvider, production } from '@lens-protocol/react';

interface LensProviderWrapperProps {
  children: ReactNode;
}

const lensConfig = {
  environment: production,
  storage: {
    getItem: (key: string) => (typeof window !== "undefined" ? window.localStorage.getItem(key) : null),
    setItem: (key: string, value: string) => (typeof window !== "undefined" ? window.localStorage.setItem(key, value) : undefined),
    removeItem: (key: string) => (typeof window !== "undefined" ? window.localStorage.removeItem(key) : undefined),
  },
  bindings: {
    storage: {
      getItem: (key: string) => (typeof window !== "undefined" ? window.localStorage.getItem(key) : null),
      setItem: (key: string, value: string) => (typeof window !== "undefined" ? window.localStorage.setItem(key, value) : undefined),
      removeItem: (key: string) => (typeof window !== "undefined" ? window.localStorage.removeItem(key) : undefined),
    },
    getSigner: async () => { throw new Error("getSigner no implementado"); },
    getProvider: () => { throw new Error("getProvider no implementado"); },
  },
};

export function LensProviderWrapper({ children }: LensProviderWrapperProps) {
  return (
    <BaseProvider config={lensConfig}>
      {children}
    </BaseProvider>
  );
} 