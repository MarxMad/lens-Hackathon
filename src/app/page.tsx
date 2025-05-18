"use client";

import React, { useEffect, useState, useRef } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { LensProfile } from "@/components/LensProfile";
import { VideoUpload } from "@/components/VideoUpload";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EngagementSystem } from '@/components/EngagementSystem';
import { VideoFeed } from '@/components/VideoFeed';
import { FloatingNav } from '@/components/FloatingNav';
import { Loader } from "@/components/Loader";
import { useState as useStateVideo, useRef as useRefVideo } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number;
}

const TypewriterText = ({ text, delay = 0 }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, mounted]);

  if (!mounted) return null;

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="inline-flex items-center"
    >
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ 
            opacity: [1, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block w-[2px] h-6 bg-gradient-to-b from-blue-400 to-purple-400 ml-1 rounded-full"
        />
      )}
    </motion.span>
  );
};

const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.1], [0, 20]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
    >
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

const SectionDivider = () => (
  <div className="relative py-16">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-white/10"></div>
    </div>
    <div className="relative flex justify-center">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 bg-gradient-to-b from-blue-900/10 to-blue-950/10"
      >
        <svg
          className="w-8 h-8 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </div>
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/10 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                StudentLens
              </motion.span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <NavLink href="#features">Características</NavLink>
              <NavLink href="#videos">Videos</NavLink>
              <NavLink href="#benefits">Beneficios</NavLink>
              <NavLink href="#how-it-works">Cómo Funciona</NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      <motion.span
        className="text-gray-300 hover:text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
    </Link>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
}

const FloatingElement = ({ children, delay = 0 }: FloatingElementProps) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ 
      y: [0, -10, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

interface GlowingBorderProps {
  children: React.ReactNode;
}

const GlowingBorder = ({ children }: GlowingBorderProps) => (
  <motion.div
    className="relative p-[1px] rounded-xl overflow-hidden"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <div className="relative bg-gray-900 rounded-xl p-6">
      {children}
    </div>
  </motion.div>
);

interface TextGradientProps {
  children: React.ReactNode;
}

const TextGradient = ({ children }: TextGradientProps) => (
  <motion.span
    className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    {children}
  </motion.span>
);

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
}

const ParallaxSection = ({ children, speed = 0.5 }: ParallaxSectionProps) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);

  return (
    <motion.div style={{ y }} className="relative">
      {children}
    </motion.div>
  );
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection = ({ children, delay = 0 }: AnimatedSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
};

interface HoverCardProps {
  children: React.ReactNode;
  delay?: number;
}

const HoverCard = ({ children, delay = 0 }: HoverCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {children}
    </motion.div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const partnersLogos = [
  { src: "/lens-logo.png", alt: "Lens" },
  { src: "https://seeklogo.com/images/P/polygon-matic-logo-86D6D3D0C5-seeklogo.com.png", alt: "Polygon" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/44/UNAM_logo.svg", alt: "UNAM" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Logo_ITESM.svg", alt: "ITESM" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Ethereum-icon-purple.svg", alt: "Ethereum" },
];

// Imagen de preview de ejemplo para los videos destacados
const videoPreviews = [
  {
    thumbnail: "/video-thumb-1.jpg", // reemplaza por tu imagen real
    preview: "/video-preview-1.gif", // reemplaza por tu gif real
    title: "Video Destacado 1",
    description: "Conecta tu wallet para ver más videos",
    category: "Blockchain"
  },
  {
    thumbnail: "/video-thumb-2.jpg",
    preview: "/video-preview-2.gif",
    title: "Video Destacado 2",
    description: "Conecta tu wallet para ver más videos",
    category: "Educación"
  },
  {
    thumbnail: "/video-thumb-3.jpg",
    preview: "/video-preview-3.gif",
    title: "Video Destacado 3",
    description: "Conecta tu wallet para ver más videos",
    category: "IA"
  }
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [initialLoading, setInitialLoading] = useState(true);
  // Estado global de videos para el feed tipo TikTok
  const [feedVideos, setFeedVideos] = useState<any[]>([ // tipo any para ejemplo, puedes tipar mejor
    {
      id: "1",
      title: "Introducción a Web3",
      description: "Aprende los conceptos básicos de Web3 y blockchain",
      videoUrl: "https://example.com/video1",
      thumbnailUrl: "https://via.placeholder.com/320x180?text=Video+1",
      author: {
        name: "Juan Pérez",
        handle: "juan.lens",
        avatar: "https://picsum.photos/100/100"
      },
      stats: {
        likes: 45,
        dislikes: 2,
        views: 234,
        comments: 12
      },
      timestamp: "2 horas atrás"
    },
    {
      id: "2",
      title: "Smart Contracts 101",
      description: "Todo lo que necesitas saber sobre smart contracts",
      videoUrl: "https://example.com/video2",
      thumbnailUrl: "https://via.placeholder.com/320x180?text=Video+2",
      author: {
        name: "María García",
        handle: "maria.lens",
        avatar: "https://picsum.photos/100/100"
      },
      stats: {
        likes: 32,
        dislikes: 1,
        views: 189,
        comments: 8
      },
      timestamp: "5 horas atrás"
    }
  ]);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setActiveSection(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setInitialLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  // Cargar videos de localStorage al montar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('studentlens_videos') || '[]');
    if (stored.length > 0) {
      const normalized = stored.map(video => ({
        id: video.id || Date.now().toString() + Math.random(),
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        author: video.author || {
          name: address ? address : "Invitado",
          handle: address ? address : "anon.lens",
          avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=" + (address || "anon")
        },
        stats: video.stats || {
          likes: 0,
          dislikes: 0,
          views: 0,
          comments: 0
        },
        timestamp: video.timestamp || "Ahora"
      }));
      setFeedVideos(prev => ([...normalized, ...prev]));
    }
  }, [address]);

  // Cuando se sube un video, agregarlo al principio del feed y normalizarlo
  const handleVideoUpload = (videoData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
  }) => {
    const newVideo = {
      id: Date.now().toString() + Math.random(),
      title: videoData.title,
      description: videoData.description,
      videoUrl: videoData.videoUrl,
      thumbnailUrl: videoData.thumbnailUrl,
      author: {
        name: address ? address : "Invitado",
        handle: address ? address : "anon.lens",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=" + (address || "anon")
      },
      stats: {
        likes: 0,
        dislikes: 0,
        views: 0,
        comments: 0
      },
      timestamp: "Ahora"
    };
    setFeedVideos(prev => [newVideo, ...prev]);
    const stored = JSON.parse(localStorage.getItem('studentlens_videos') || '[]');
    localStorage.setItem('studentlens_videos', JSON.stringify([newVideo, ...stored]));
  };

  React.useEffect(() => {
    if (isConnected) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isConnected]);

  if (initialLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950 to-black text-white">
        <Loader text="Cargando StudentLens..." />
      </main>
    );
  }

  return (
    <main className={isConnected ? "h-screen w-screen bg-black text-white overflow-hidden" : "min-h-screen bg-gradient-to-b from-blue-950 to-black text-white relative overflow-hidden"}>
      {!isConnected && <ScrollProgress />}
      {!isConnected && (
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      )}

      <div className={isConnected ? "relative z-10 h-screen w-screen flex flex-col" : "relative z-10"}>
        {!isConnected ? (
          <>
            <Navbar />
            <div className="min-h-screen">
              {/* Hero Section con Parallax */}
              <ParallaxSection speed={0.2}>
                <div className="min-h-screen flex flex-col items-center justify-center px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl"
                  >
                    <motion.h1 
                      className="text-5xl md:text-6xl font-bold mb-6"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, type: "spring" }}
                    >
                      <TextGradient>
                        <TypewriterText text="StudentLens" />
                      </TextGradient>
                    </motion.h1>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="relative w-64 h-64 mx-auto mb-8"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                      <img
                        src="/lens-logo.png"
                        alt="StudentLens Logo"
                        className="relative w-full h-full object-contain"
                      />
                    </motion.div>
                    <motion.p 
                      className="text-xl md:text-2xl text-gray-300 mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      La plataforma descentralizada de videos educativos
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="flex flex-col items-center space-y-4"
                    >
                      <FloatingElement>
                        <motion.p 
                          className="text-gray-400 mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          Conecta tu wallet para comenzar a explorar
                        </motion.p>
                      </FloatingElement>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <GlowingBorder>
                          <ConnectKitButton />
                        </GlowingBorder>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <ScrollIndicator />
                </div>
              </ParallaxSection>

              {/* Características con AnimatedSection */}
              <AnimatedSection>
                <section id="features" className="py-20 px-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto"
                  >
                    <motion.h2 
                      className="text-4xl font-bold text-center mb-12"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <TextGradient>Características</TextGradient>
                    </motion.h2>
                    <ExpandableFeatures />
                  </motion.div>
                </section>
              </AnimatedSection>

              <SectionDivider />

              {/* Videos con Parallax */}
              <ParallaxSection speed={0.3}>
                <AnimatedSection>
                  <section id="videos" className="py-20 px-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="max-w-6xl mx-auto"
                    >
                      <motion.h2 
                        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        Videos Destacados
                      </motion.h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videoPreviews.map((video, index) => (
                          <HoverCard key={index} delay={index * 0.2}>
                            <motion.div
                              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 flex flex-col"
                            >
                              <PreviewVideoCard video={video} />
                            </motion.div>
                          </HoverCard>
                        ))}
                      </div>
                    </motion.div>
                  </section>
                </AnimatedSection>
              </ParallaxSection>

              <SectionDivider />

              {/* Beneficios con HoverCard */}
              <AnimatedSection>
                <section id="benefits" className="py-20 px-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto"
                  >
                    <motion.h2 
                      className="text-4xl font-bold text-center mb-12"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <TextGradient>Beneficios</TextGradient>
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        {
                          title: "Aprende y Gana",
                          description: "Gana tokens mientras aprendes y compartes conocimiento.",
                          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        },
                        {
                          title: "Contenido Verificado",
                          description: "Todo el contenido está verificado por la comunidad y la blockchain.",
                          icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        }
                      ].map((benefit, index) => (
                        <HoverCard key={index} delay={index * 0.2}>
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <GlowingBorder>
                              <motion.div
                                initial={{ rotate: -180, opacity: 0 }}
                                whileInView={{ rotate: 0, opacity: 1 }}
                                whileHover={{ rotate: 360 }}
                                transition={{ 
                                  duration: 0.5,
                                  delay: index * 0.2 + 0.2 
                                }}
                              >
                                <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                                </svg>
                              </motion.div>
                              <motion.h3 
                                className="text-xl font-semibold mb-2"
                                whileHover={{ scale: 1.05 }}
                              >
                                <TextGradient>{benefit.title}</TextGradient>
                              </motion.h3>
                              <p className="text-gray-400">{benefit.description}</p>
                            </GlowingBorder>
                          </div>
                        </HoverCard>
                      ))}
                    </div>
                  </motion.div>
                </section>
              </AnimatedSection>

              <SectionDivider />

              {/* Cómo Funciona con Parallax y HoverCard */}
              <ParallaxSection speed={0.4}>
                <AnimatedSection>
                  <section id="how-it-works" className="py-20 px-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="max-w-6xl mx-auto"
                    >
                      <motion.h2 
                        className="text-4xl font-bold text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TextGradient>¿Cómo funciona?</TextGradient>
                      </motion.h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                          {
                            step: "1",
                            title: "Conecta tu Wallet",
                            description: "🔗 Accede con tu wallet y desbloquea todo el contenido.",
                            icon: (
                              <svg className="w-16 h-16 mx-auto text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2zm-5 4h.01" />
                              </svg>
                            )
                          },
                          {
                            step: "2",
                            title: "Explora Contenido",
                            description: "🎥 Descubre videos educativos de calidad, creados por la comunidad.",
                            icon: (
                              <svg className="w-16 h-16 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-11z" />
                              </svg>
                            )
                          },
                          {
                            step: "3",
                            title: "Gana Recompensas",
                            description: "🏆 Participa, aprende y recibe tokens por tu actividad.",
                            icon: (
                              <svg className="w-16 h-16 mx-auto text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )
                          }
                        ].map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: index * 0.2 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 group"
                          >
                            <div className="mb-4">
                              {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-center">
                              <TextGradient>{step.title}</TextGradient>
                            </h3>
                            <p className="text-lg text-gray-300 text-center mb-2">
                              {step.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </section>
                </AnimatedSection>
              </ParallaxSection>

              {/* Demo Interactiva */}
              <AnimatedSection>
                <section id="demo" className="py-20 px-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                  >
                    <motion.h2
                      className="text-4xl font-bold mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <TextGradient>Demo Interactiva</TextGradient>
                    </motion.h2>
                    <div className="flex flex-col items-center justify-center">
                      {/* Placeholder para video o carrusel */}
                      <div className="relative w-full max-w-2xl aspect-video bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center mb-6 overflow-hidden">
                        <span className="text-gray-400 text-lg">Aquí irá tu video demo o carrusel de imágenes</span>
                        {/* Ejemplo de botón de reproducción si luego quieres un video */}
                        <button className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-blue-400 opacity-60 hover:opacity-100 transition" fill="currentColor" viewBox="0 0 24 24">
                            <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-400 mb-2">Próximamente podrás ver una demo interactiva de StudentLens.</p>
                    </div>
                  </motion.div>
                </section>
              </AnimatedSection>

              <SectionDivider />

              {/* Partners / Sponsors */}
              <AnimatedSection>
                <section id="partners" className="py-20 px-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto text-center"
                  >
                    <motion.h2
                      className="text-4xl font-bold mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <TextGradient>Partners & Sponsors</TextGradient>
                    </motion.h2>
                    <div className="overflow-x-hidden w-full py-2">
                      <motion.div
                        className="flex items-center gap-12 w-max"
                        animate={{ x: [0, -((partnersLogos.length) * 180)] }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 18,
                          ease: "linear"
                        }}
                        style={{ willChange: 'transform' }}
                      >
                        {[...partnersLogos, ...partnersLogos].map((logo, idx) => (
                          <img
                            key={idx}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-16 w-auto grayscale hover:grayscale-0 transition rounded-lg bg-white/10 p-2 shadow-md"
                            style={{ minWidth: 160 }}
                          />
                        ))}
                      </motion.div>
                    </div>
                    <p className="text-gray-400 mt-6">¿Te gustaría ser partner o sponsor? <a href="mailto:contacto@studentlens.xyz" className="text-blue-400 underline hover:text-pink-400">Contáctanos</a></p>
                  </motion.div>
                </section>
              </AnimatedSection>
            </div>
          </>
        ) : (
          // Contenido principal cuando está conectado (feed tipo TikTok)
          <>
            <div className="h-screen w-screen">
              <VideoFeed videos={feedVideos} />
            </div>
          </>
        )}
        <FloatingNav />
      </div>
    </main>
  );
}

// Componente de características expandibles
const featuresData = [
  {
    title: "Contenido Descentralizado",
    description: "Videos educativos almacenados en la blockchain para garantizar su permanencia y accesibilidad.",
    icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
    more: "Gracias a la tecnología blockchain, los videos no pueden ser censurados ni eliminados por terceros. Esto asegura que el conocimiento esté siempre disponible para todos, en cualquier momento y lugar."
  },
  {
    title: "Tokens de Recompensa",
    description: "Gana tokens por ver, crear y compartir contenido educativo de calidad.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    more: "El sistema de recompensas motiva a los usuarios a participar activamente. Los tokens pueden usarse para acceder a contenido premium, participar en sorteos o incluso intercambiarse por otros activos digitales."
  },
  {
    title: "Comunidad Activa",
    description: "Conecta con otros estudiantes y creadores de contenido educativo.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    more: "StudentLens fomenta la colaboración y el aprendizaje social. Puedes seguir a tus creadores favoritos, comentar videos y participar en foros temáticos para resolver dudas y compartir ideas."
  }
];

function ExpandableFeatures() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuresData.map((feature, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            layout
            initial={{ borderRadius: 20 }}
            className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer shadow-lg transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => setOpenIndex(isOpen ? null : index)}
            whileHover={{ scale: 1.04 }}
          >
            <GlowingBorder>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
              >
                <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold mb-2"
                whileHover={{ scale: 1.05 }}
              >
                <TextGradient>{feature.title}</TextGradient>
              </motion.h3>
              <p className="text-gray-400 mb-2">{feature.description}</p>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className={`overflow-hidden text-gray-300 text-sm ${isOpen ? 'mt-2' : ''}`}
              >
                {isOpen && (
                  <div>
                    <div className="border-t border-white/10 my-2" />
                    <span>{feature.more}</span>
                  </div>
                )}
              </motion.div>
              <motion.div
                className={`mt-3 flex items-center justify-center transition-transform ${isOpen ? 'rotate-180' : ''}`}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </GlowingBorder>
          </motion.div>
        );
      })}
    </div>
  );
}

// Componente para la card de video con preview y acciones rápidas
function PreviewVideoCard({ video }: { video: any }) {
  const [hovered, setHovered] = useStateVideo(false);
  const [liked, setLiked] = useStateVideo(false);
  const [saved, setSaved] = useStateVideo(false);
  const [copied, setCopied] = useStateVideo(false);
  const timeoutRef = useRefVideo<NodeJS.Timeout | null>(null);

  const handleLike = () => setLiked(l => !l);
  const handleSave = () => setSaved(s => !s);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/video/' + encodeURIComponent(video.title.replace(/\s+/g, '-').toLowerCase()));
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="relative aspect-video w-full group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? video.preview : video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover transition-all duration-300"
      />
      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <svg className="w-16 h-16 text-blue-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
          <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
        </svg>
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col">
        <span className="text-white font-semibold text-lg mb-1">{video.title}</span>
        <span className="text-xs text-blue-300 mb-2">{video.category}</span>
        <span className="text-gray-300 text-xs mb-2">{video.description}</span>
        <div className="flex space-x-3 mt-2">
          {/* Like */}
          <button
            className={`transition ${liked ? 'text-red-500' : 'text-white/70 hover:text-red-400'}`}
            title="Me gusta"
            onClick={handleLike}
          >
            {liked ? (
              <svg className="w-6 h-6" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
          {/* Guardar */}
          <button
            className={`transition ${saved ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-300'}`}
            title="Guardar"
            onClick={handleSave}
          >
            {saved ? (
              <svg className="w-6 h-6" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
              </svg>
            )}
          </button>
          {/* Compartir */}
          <button
            className={`transition ${copied ? 'text-blue-400' : 'text-white/70 hover:text-blue-300'}`}
            title="Compartir"
            onClick={handleShare}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 11-6 0 3 3 0 016 0zm6 8a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
            </svg>
          </button>
        </div>
        {copied && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fade-in-out">
            ¡Enlace copiado!
          </div>
        )}
      </div>
    </div>
  );
}
