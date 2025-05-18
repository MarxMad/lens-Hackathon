"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useLensClient } from "../providers/LensProvider";
import { graphql } from "@lens-protocol/client";
import { Loader } from "./Loader";

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

interface ProfileData {
  id: string;
  handle: { fullHandle: string };
  metadata: { bio: string };
}

export const LensProfile = () => {
  const { address } = useAccount();
  const lensClient = useLensClient();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    setLoading(true);

    async function fetchProfile() {
      try {
        const query = `
          query GetProfiles($ownedBy: [EvmAddress!]) {
            profiles(request: { where: { ownedBy: $ownedBy } }) {
              items {
                id
                handle {
                  fullHandle
                }
                metadata {
                  bio
                }
              }
            }
          }
        `;
        const response = await fetch("https://api-v2.lens.dev", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            query,
            variables: { ownedBy: [address] }
          })
        });
        const { data, errors } = await response.json();
        console.log("Lens API response:", data, errors);
        if (errors) {
          errors.forEach((e: any) => console.error("Lens API error:", e));
        }
        const profile = data?.profiles?.items?.[0] ?? null;
        setProfile(profile);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [address]);

  if (loading) return <Loader text="Cargando perfil de Lens..." />;
  if (!profile) return <div className="p-6">No se encontró perfil de Lens.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-gray-700 flex items-center justify-center text-3xl">
          {profile.handle.fullHandle[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{profile.handle.fullHandle}</h2>
        </div>
      </div>
      <p className="text-gray-300 mt-2">{profile.metadata.bio}</p>
    </div>
  );
}; 