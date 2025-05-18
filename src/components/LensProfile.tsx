"use client";

import React from "react";
import { useAccount } from "wagmi";
import { useProfile } from "@lens-protocol/react";

export function LensProfile() {
  const { address } = useAccount();
  const { data: profile, loading } = useProfile({
    address: address as string,
  });

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4">
        {profile.picture?.original?.url && (
          <img
            src={profile.picture.original.url}
            alt={profile.name || "Profile"}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold">{profile.name}</h3>
          <p className="text-gray-600">@{profile.handle}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Seguidores</p>
          <p className="text-lg font-semibold">{profile.stats.totalFollowers}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Siguiendo</p>
          <p className="text-lg font-semibold">{profile.stats.totalFollowing}</p>
        </div>
      </div>
    </div>
  );
} 