"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  likes: number;
  views: number;
  timestamp: string;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  reward: string;
}

interface LensProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  picture: {
    original: {
      url: string;
    };
  };
  stats: {
    totalFollowers: number;
    totalFollowing: number;
    totalPosts: number;
  };
}

export const LensProfile = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'videos' | 'milestones' | 'stats'>('videos');
  const [studentBalance, setStudentBalance] = useState("0.00");
  const [profiles, setProfiles] = useState<LensProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<LensProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.lens.dev', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LENS_API_KEY}`,
          },
          body: JSON.stringify({
            query: `
              query Profiles($address: EthereumAddress!) {
                profiles(request: { ownedBy: [$address] }) {
                  items {
                    id
                    name
                    handle
                    bio
                    picture {
                      original {
                        url
                      }
                    }
                    stats {
                      totalFollowers
                      totalFollowing
                      totalPosts
                    }
                  }
                }
              }
            `,
            variables: {
              address: address,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const fetchedProfiles = data.data.profiles.items;
        setProfiles(fetchedProfiles);
        
        if (fetchedProfiles.length > 0) {
          setSelectedProfile(fetchedProfiles[0]);
        }
      } catch (err) {
        console.error('Error completo:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los perfiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [address]);

  const handleCreateProfile = async () => {
    if (!newProfileName) return;

    try {
      const response = await fetch('https://api.lens.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer F8V9lH-O6-zt3n_Ofkt0yzvWY6D7Sjk20x'
        },
        body: JSON.stringify({
          query: `
            mutation CreateProfile {
              createProfile(request: {
                handle: "${newProfileName.toLowerCase().replace(/\s+/g, '')}"
                profilePictureUri: null
                followNFTURI: null
                followModule: null
              }) {
                ... on RelayerResult {
                  txHash
                }
                ... on RelayError {
                  reason
                }
              }
            }
          `
        })
      });

      const data = await response.json();
      if (data.data?.createProfile?.txHash) {
        // Recargar perfiles después de crear uno nuevo
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  // Datos de ejemplo para videos
  const videos: Video[] = [
    {
      id: "1",
      title: "Introducción a Web3",
      thumbnail: "🎥",
      likes: 12,
      views: 245,
      timestamp: "2 días atrás"
    },
    {
      id: "2",
      title: "Smart Contracts Básicos",
      thumbnail: "📝",
      likes: 8,
      views: 189,
      timestamp: "5 días atrás"
    }
  ];

  // Datos de ejemplo para milestones
  const milestones: Milestone[] = [
    {
      id: 1,
      title: "Primer Video",
      description: "Sube tu primer video educativo",
      completed: true,
      reward: "10 $STUDENT"
    },
    {
      id: 2,
      title: "5 Videos",
      description: "Sube 5 videos educativos",
      completed: false,
      reward: "50 $STUDENT"
    },
    {
      id: 3,
      title: "25 Likes",
      description: "Consigue 25 likes en total",
      completed: false,
      reward: "25 $STUDENT"
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-700/50 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">Error: {error}</p>
          <p className="text-gray-400 mt-2 text-sm">Por favor, verifica que:</p>
          <ul className="text-gray-400 text-sm list-disc list-inside mt-1">
            <li>Tu API key de Lens está correctamente configurada</li>
            <li>Tu wallet está conectada</li>
            <li>Tienes una conexión estable a internet</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Conecta tu Wallet</h3>
          <p className="text-gray-400">Conecta tu wallet para ver tus perfiles de Lens</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">No tienes perfiles de Lens</h3>
          <p className="text-gray-400 mb-4">Crea tu primer perfil para empezar a compartir contenido</p>
          <button
            onClick={handleCreateProfile}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            Crear Perfil
          </button>
        </div>
      </div>
    );
  }

  const profileName = selectedProfile?.name || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Usuario Anónimo");
  const profileHandle = selectedProfile?.handle || (address ? `${address.slice(0, 6)}...${address.slice(-4)}.lens` : "usuario.lens");
  const followers = selectedProfile?.stats?.totalFollowers || 0;
  const following = selectedProfile?.stats?.totalFollowing || 0;

  return (
    <div className="p-6">
      {/* Selector de perfiles */}
      {profiles.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Seleccionar Perfil
          </label>
          <select
            value={selectedProfile?.id}
            onChange={(e) => {
              const profile = profiles.find(p => p.id === e.target.value);
              if (profile) setSelectedProfile(profile);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                @{profile.handle}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Información del perfil */}
      {selectedProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-4">
            <img
              src={selectedProfile.picture?.original?.url || 'https://picsum.photos/200/200'}
              alt={selectedProfile.name}
              className="w-20 h-20 rounded-full border-2 border-white/20"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedProfile.name}</h2>
              <p className="text-gray-400">@{selectedProfile.handle}</p>
            </div>
          </div>

          <p className="text-gray-300">{selectedProfile.bio}</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{selectedProfile.stats.totalPosts}</div>
              <div className="text-gray-400">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{selectedProfile.stats.totalFollowers}</div>
              <div className="text-gray-400">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{selectedProfile.stats.totalFollowing}</div>
              <div className="text-gray-400">Siguiendo</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}; 