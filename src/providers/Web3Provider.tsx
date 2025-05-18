"use client";

import { LensConfig, development } from "@lens-protocol/react";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig(
  getDefaultConfig({
    appName: "StudentLens",
    chains,
    publicClient,
    // Temporalmente removemos walletConnectProjectId
  })
);

const lensConfig: LensConfig = {
  environment: development,
  storage: {
    getItem: (key) => {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(key);
    },
    setItem: (key, value) => {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, value);
    },
    removeItem: (key) => {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
    },
  },
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
} 