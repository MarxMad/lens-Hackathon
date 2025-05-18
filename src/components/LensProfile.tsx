"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useProfile } from "@lens-protocol/react";

export function LensProfile() {
  const { address } = useAccount();
  const { data: profile, loading } = useProfile({
    forHandle: `${address}.lens`,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Crear Perfil de Lens</h3>
        <p className="text-gray-600 mb-4">
          Necesitas crear un perfil de Lens para empezar a compartir contenido
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Crear Perfil
        </button>
      </div>
    );
  }

  const handle = typeof profile.handle === 'string' ? profile.handle : profile.handle?.fullHandle || 'sin-handle';
  const followers = typeof profile.stats === 'object' ? profile.stats.followers || 0 : 0;
  const following = typeof profile.stats === 'object' ? profile.stats.following || 0 : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-2xl text-blue-600">
            {handle[0] || "?"}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold">@{handle}</h3>
          <p className="text-gray-600">Perfil de Lens</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Seguidores</p>
          <p className="text-lg font-semibold">{followers}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Siguiendo</p>
          <p className="text-lg font-semibold">{following}</p>
        </div>
      </div>
    </div>
  );
} 