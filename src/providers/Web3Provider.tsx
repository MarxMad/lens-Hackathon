"use client";

import { ConnectKitProvider } from 'connectkit';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig } from 'connectkit';

// Crear una instancia de QueryClient
const queryClient = new QueryClient();

// Configuración de WalletConnect
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Configuración de Wagmi con ConnectKit
const config = createConfig(
  getDefaultConfig({
    appName: 'StudentLens',
    walletConnectProjectId: projectId,
    chains: [mainnet, polygon],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
    },
  })
);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          mode="dark"
          options={{
            embedGoogleFonts: true,
            hideBalance: false,
            hideTooltips: false,
            hideNoWalletCTA: false,
            hideRecentBadge: false,
            disableSiweRedirect: true,
            walletConnectCTA: 'link'
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 