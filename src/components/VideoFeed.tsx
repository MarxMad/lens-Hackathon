"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Loader } from "./Loader";

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  stats: {
    likes: number;
    dislikes: number;
    views: number;
    comments: number;
  };
  timestamp: string;
  userLiked?: boolean;
  userDisliked?: boolean;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  stats: {
    videos: number;
    likes: number;
    studentBalance: number;
  };
}

interface VideoFeedProps {
  videos: Video[];
}

export const VideoFeed = ({ videos }: VideoFeedProps) => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipe = useCallback((direction: number) => {
    if (direction > 0 && currentIndex > 0) {
      setDirection(1);
      setCurrentIndex(prev => prev - 1);
    } else if (direction < 0 && currentIndex < videos.length - 1) {
      setDirection(-1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, videos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchEnd - touchStart;
    if (Math.abs(diff) > 50) {
      // Swipe hacia arriba: siguiente video (abajo en la lista)
      if (diff < 0 && currentIndex < videos.length - 1) {
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
      }
      // Swipe hacia abajo: video anterior (arriba en la lista)
      else if (diff > 0 && currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  const handleLike = async (videoId: string) => {
    try {
      // Implement the logic to update the video's userLiked and userDisliked status
      // and the stats in the blockchain
      await controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
      });
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async (videoId: string) => {
    try {
      // Implement the logic to update the video's userDisliked status
      // and the stats in the blockchain
      await controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
      });
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  // Log de depuración para ver los videos que recibe el feed
  console.log('Videos en el feed:', videos);

  useEffect(() => {
    if (videos.length > 0) {
      setLoading(false);
    }
  }, [videos]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0 && currentIndex > 0) {
          setDirection(-1);
          setCurrentIndex(prev => prev - 1);
        } else if (e.deltaY < 0 && currentIndex < videos.length - 1) {
          setDirection(1);
          setCurrentIndex(prev => prev + 1);
        }
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex, videos.length]);

  // Navegación con flechas del teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowUp' && currentIndex < videos.length - 1) {
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-2xl font-bold text-white">Cargando videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen relative overflow-hidden bg-black"
    >
      <AnimatePresence initial={false} custom={direction}>
        {videos.map((video, index) => {
          if (index === currentIndex) {
            return (
              <motion.div
                key={video.id}
                custom={direction}
                initial={{ opacity: 0, y: direction > 0 ? 1000 : -1000 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction > 0 ? -1000 : 1000 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Video */}
                <div className="h-full w-full relative">
                  <video
                    src={video.videoUrl}
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  {/* Overlay de información */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={video.author.avatar}
                        alt={video.author.name}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div>
                        <h3 className="text-white font-bold">{video.author.name}</h3>
                        <p className="text-gray-300">@{video.author.handle}</p>
                      </div>
                    </div>
                    <p className="text-white mb-4">{video.description}</p>
                  </div>

                  {/* Botones de interacción */}
                  <div className="absolute right-6 bottom-32 flex flex-col items-center space-y-6">
                    <motion.button
                      onClick={() => handleLike(video.id)}
                      className="flex flex-col items-center"
                      animate={controls}
                    >
                      <div className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center mb-1 transition-colors ${
                        video.userLiked 
                          ? 'bg-red-500/80' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}>
                        <svg 
                          className={`w-6 h-6 ${video.userLiked ? 'text-white' : 'text-white'}`} 
                          fill={video.userLiked ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <span className="text-white text-sm">{video.stats.likes}</span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleDislike(video.id)}
                      className="flex flex-col items-center"
                      animate={controls}
                    >
                      <div className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center mb-1 transition-colors ${
                        video.userDisliked 
                          ? 'bg-blue-500/80' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}>
                        <svg 
                          className={`w-6 h-6 ${video.userDisliked ? 'text-white' : 'text-white'}`} 
                          fill={video.userDisliked ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 5m-7 9v6a2 2 0 002 2h.095c.913 0 1.756-.49 2.295-1.271l3.248-4.5A2 2 0 0017.248 9H19" />
                        </svg>
                      </div>
                      <span className="text-white text-sm">{video.stats.dislikes}</span>
                    </motion.button>

                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md flex items-center justify-center mb-1">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <span className="text-white text-sm">{video.stats.comments}</span>
                    </button>

                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md flex items-center justify-center mb-1">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </div>
                      <span className="text-white text-sm">Compartir</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          }
          return null;
        })}
      </AnimatePresence>

      {/* Indicador de swipe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-white/20 text-2xl font-bold">
          ↑ Desliza para navegar ↓
        </div>
      </div>
    </div>
  );
}; 