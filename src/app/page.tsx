"use client";

import React, { useEffect, useState } from "react";
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

interface TypewriterTextProps {
  text: string;
  delay?: number;
}

const TypewriterText = ({ text, delay = 0 }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

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
        className="text-gray-400 mb-2"
      >
        Scroll para explorar
      </motion.div>
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

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const [activeSection, setActiveSection] = useState<string>('');

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

  const handleVideoUpload = (videoData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
  }) => {
    console.log('Video subido:', videoData);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-900/10 to-blue-950/10">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white relative overflow-hidden">
      <ScrollProgress />
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
      
      <div className="relative z-10">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        {
                          title: "Contenido Descentralizado",
                          description: "Videos educativos almacenados en la blockchain para garantizar su permanencia y accesibilidad.",
                          icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        },
                        {
                          title: "Tokens de Recompensa",
                          description: "Gana tokens por ver, crear y compartir contenido educativo de calidad.",
                          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        },
                        {
                          title: "Comunidad Activa",
                          description: "Conecta con otros estudiantes y creadores de contenido educativo.",
                          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        }
                      ].map((feature, index) => (
                        <HoverCard key={index} delay={index * 0.2}>
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <GlowingBorder>
                              <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                whileHover={{ rotate: 360 }}
                                transition={{ 
                                  duration: 0.5,
                                  delay: index * 0.2 + 0.2 
                                }}
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
                              <p className="text-gray-400">{feature.description}</p>
                            </GlowingBorder>
                          </div>
                        </HoverCard>
                      ))}
                    </div>
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
                        {[1, 2, 3].map((_, index) => (
                          <HoverCard key={index} delay={index * 0.2}>
                            <motion.div
                              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
                            >
                              <motion.div 
                                className="aspect-video bg-gray-800"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                              />
                              <div className="p-4">
                                <motion.h3 
                                  className="text-lg font-semibold mb-2"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <TextGradient>Video Destacado {index + 1}</TextGradient>
                                </motion.h3>
                                <p className="text-gray-400 text-sm">Conecta tu wallet para ver más videos</p>
                              </div>
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
                        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        Cómo Funciona
                      </motion.h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          {
                            step: "1",
                            title: "Conecta tu Wallet",
                            description: "Conecta tu wallet para acceder a todas las funcionalidades."
                          },
                          {
                            step: "2",
                            title: "Explora Contenido",
                            description: "Navega por los videos educativos y encuentra lo que necesitas."
                          },
                          {
                            step: "3",
                            title: "Gana Recompensas",
                            description: "Gana tokens por tu participación y contribución."
                          }
                        ].map((step, index) => (
                          <HoverCard key={index} delay={index * 0.2}>
                            <motion.div
                              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative"
                            >
                              <GlowingBorder>
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  whileInView={{ scale: 1, rotate: 0 }}
                                  whileHover={{ rotate: 360 }}
                                  transition={{ 
                                    duration: 0.5,
                                    delay: index * 0.2 + 0.2 
                                  }}
                                  className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                                >
                                  {step.step}
                                </motion.div>
                                <motion.h3 
                                  className="text-xl font-semibold mb-2 mt-4"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <TextGradient>{step.title}</TextGradient>
                                </motion.h3>
                                <p className="text-gray-400">{step.description}</p>
                              </GlowingBorder>
                            </motion.div>
                          </HoverCard>
                        ))}
                      </div>
                    </motion.div>
                  </section>
                </AnimatedSection>
              </ParallaxSection>
            </div>
          </>
        ) : (
          // Contenido principal cuando está conectado
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                StudentLens
              </h1>
              <p className="text-gray-400 mt-2">
                Bienvenido, {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </motion.div>

            <div className="container mx-auto px-4">
              <VideoFeed />
            </div>
          </>
        )}

        <FloatingNav />
      </div>
    </main>
  );
}
