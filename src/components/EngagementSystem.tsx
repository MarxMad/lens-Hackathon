"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

interface Milestone {
  id: number;
  title: string;
  description: string;
  requirement: string;
  reward: number;
  completed: boolean;
  progress: number;
  total: number;
}

interface EngagementStats {
  totalVideos: number;
  totalLikes: number;
  totalViews: number;
  studentBalance: number;
}

export const EngagementSystem = () => {
  const { address } = useAccount();
  const [stats, setStats] = useState<EngagementStats>({
    totalVideos: 0,
    totalLikes: 0,
    totalViews: 0,
    studentBalance: 0
  });

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      title: "Primer Video",
      description: "Sube tu primer video educativo",
      requirement: "1 video",
      reward: 10,
      completed: false,
      progress: 0,
      total: 1
    },
    {
      id: 2,
      title: "5 Videos",
      description: "Sube 5 videos educativos",
      requirement: "5 videos",
      reward: 50,
      completed: false,
      progress: 0,
      total: 5
    },
    {
      id: 3,
      title: "25 Likes",
      description: "Consigue 25 likes en total",
      requirement: "25 likes",
      reward: 25,
      completed: false,
      progress: 0,
      total: 25
    },
    {
      id: 4,
      title: "100 Views",
      description: "Alcanza 100 visualizaciones en total",
      requirement: "100 views",
      reward: 30,
      completed: false,
      progress: 0,
      total: 100
    }
  ]);

  useEffect(() => {
    const fetchEngagementData = async () => {
      if (!address) return;

      try {
        // Aquí iría la lógica para obtener los datos de engagement del usuario
        // Por ahora usamos datos de ejemplo
        setStats({
          totalVideos: 3,
          totalLikes: 15,
          totalViews: 75,
          studentBalance: 25
        });

        // Actualizar progreso de milestones
        setMilestones(prev => prev.map(milestone => {
          let progress = 0;
          switch (milestone.id) {
            case 1:
            case 2:
              progress = Math.min(stats.totalVideos, milestone.total);
              break;
            case 3:
              progress = Math.min(stats.totalLikes, milestone.total);
              break;
            case 4:
              progress = Math.min(stats.totalViews, milestone.total);
              break;
          }
          return {
            ...milestone,
            progress,
            completed: progress >= milestone.total
          };
        }));
      } catch (error) {
        console.error('Error fetching engagement data:', error);
      }
    };

    fetchEngagementData();
  }, [address]);

  const handleClaimReward = async (milestoneId: number) => {
    try {
      // Aquí iría la lógica para reclamar la recompensa
      // Por ahora solo actualizamos el estado local
      setMilestones(prev => prev.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, completed: true }
          : milestone
      ));
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Sistema de Engagement</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{stats.studentBalance} $STUDENT</div>
          <div className="text-sm text-gray-400">Balance Total</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalVideos}</div>
          <div className="text-sm text-gray-400">Videos</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
          <div className="text-sm text-gray-400">Likes</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalViews}</div>
          <div className="text-sm text-gray-400">Views</div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Logros</h3>
        {milestones.map((milestone) => (
          <motion.div
            key={milestone.id}
            whileHover={{ scale: 1.02 }}
            className={`bg-white/5 rounded-xl p-4 border ${
              milestone.completed ? 'border-green-500/50' : 'border-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-semibold text-white">{milestone.title}</h4>
                <p className="text-gray-400 text-sm">{milestone.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-400">{milestone.reward} $STUDENT</div>
                <div className="text-sm text-gray-400">{milestone.requirement}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 rounded-full h-2 mt-3">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(milestone.progress / milestone.total) * 100}%` }}
              />
            </div>

            {/* Progress Text */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">
                {milestone.progress} / {milestone.total}
              </span>
              {milestone.completed && !milestone.claimed && (
                <button
                  onClick={() => handleClaimReward(milestone.id)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Reclamar Recompensa
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}; 