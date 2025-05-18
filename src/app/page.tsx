"use client";

import React from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { LensProfile } from "@/components/LensProfile";

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600">StudentLens</h1>
          <ConnectKitButton />
        </header>

        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LensProfile />
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Sube tu Primer Video</h2>
              <p className="text-gray-600">Comparte tu conocimiento con la comunidad</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Bienvenido a StudentLens</h2>
            <p className="text-xl text-gray-600 mb-8">
              La plataforma donde los estudiantes comparten conocimiento y ganan recompensas
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
