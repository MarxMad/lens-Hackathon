"use client";

import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

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
            // Configuración adicional para manejar errores
            walletConnectCTA: 'link',
            // Aumentar el tiempo de expiración
            walletConnectTimeout: 60000, // 60 segundos
            // Configuración de reintentos
            retryOnMount: true,
            retryCount: 3,
            // Configuración de caché
            cacheConnectors: true,
            // Configuración de persistencia
            persistConnectors: true,
            // Configuración de eventos
            events: {
              onConnect: (data: unknown) => {
                console.log('Wallet connected:', data);
              },
              onDisconnect: () => {
                console.log('Wallet disconnected');
              },
              onError: (error: unknown) => {
                console.error('Wallet error:', error);
              }
            }
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 