"use client";

import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

// Configuración de Lens Chain
const lensChain = {
  id: 232,
  name: "Lens Chain",
  network: "lens",
  nativeCurrency: {
    name: "GHO",
    symbol: "GHO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.lens.xyz"],
    },
    public: {
      http: ["https://rpc.lens.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Lens Explorer",
      url: "https://explorer.lens.xyz",
    },
  },
};

const config = createConfig(
  getDefaultConfig({
    // Configuración específica para Lens Chain
    chains: [lensChain],
    transports: {
      [lensChain.id]: http(
        `https://rpc.lens.xyz`
      ),
    },

    // API Keys requeridas
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    // Información de la App
    appName: "StudentLens",
    appDescription: "Plataforma de videos educativos con recompensas en la blockchain",
    appUrl: "https://studentlens.vercel.app",
    appIcon: "https://studentlens.vercel.app/logo.png",
  })
);

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 