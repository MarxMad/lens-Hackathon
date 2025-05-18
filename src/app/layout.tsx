import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import { LensProviderWrapper } from "@/providers/LensProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudentLens - Comparte y Gana",
  description: "Plataforma de videos educativos con recompensas en la blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Web3Provider>
          <LensProviderWrapper>{children}</LensProviderWrapper>
        </Web3Provider>
      </body>
    </html>
  );
}
