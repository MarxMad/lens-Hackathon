"use client";

import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { LensProfile } from "@/components/LensProfile";
import { VideoUpload } from "@/components/VideoUpload";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </main>
    );
  }

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
            <VideoUpload />
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Bienvenido a StudentLens</h2>
            <p className="text-xl text-gray-600 mb-8">
              La plataforma donde los estudiantes comparten conocimiento y ganan recompensas
            </p>
            <div className="max-w-md mx-auto">
              <p className="text-lg text-gray-700 mb-4">
                Conecta tu wallet para empezar a:
              </p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Compartir videos educativos</li>
                <li>• Ganar recompensas por tu contenido</li>
                <li>• Conectar con otros estudiantes</li>
                <li>• Construir tu reputación en la web3</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
