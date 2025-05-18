"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useDisconnect } from 'wagmi';
import { useModal } from 'connectkit';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { LensProfile } from './LensProfile';
import { VideoUpload } from './VideoUpload';
import { EngagementSystem } from './EngagementSystem';

export function FloatingNav() {
  const [activeModal, setActiveModal] = useState<'profile' | 'upload' | 'engagement' | null>(null);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setOpen } = useModal();
  const router = useRouter();

  const handleWalletClick = () => {
    if (!isConnected) {
      console.log('Abriendo modal de conexión...');
      setOpen(true);
    } else {
      setShowWalletMenu(!showWalletMenu);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowWalletMenu(false);
  };

  const handleHomeClick = () => {
    console.log('Botón de home clickeado');
    try {
      router.push('/');
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const renderModal = () => {
    if (typeof window === 'undefined') return null;

    return createPortal(
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 bg-gray-900/95"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-8 border-b border-white/10">
                  <h2 className="text-3xl font-bold text-white">
                    {activeModal === 'profile' && 'Perfil de Lens'}
                    {activeModal === 'upload' && 'Subir Video'}
                    {activeModal === 'engagement' && 'Sistema de Engagement'}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveModal(null)}
                    className="p-4 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                <div className="flex-1 overflow-y-auto p-10">
                  {activeModal === 'profile' && (
                    <LensProfile />
                  )}
                  {activeModal === 'upload' && (
                    <VideoUpload onUploadComplete={() => setActiveModal(null)} />
                  )}
                  {activeModal === 'engagement' && (
                    <EngagementSystem />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <div className="fixed left-1/2 bottom-8 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHomeClick}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWalletClick}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-white">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              )}
            </motion.button>

            <AnimatePresence>
              {showWalletMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10">
                      Wallet Conectada
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDisconnect}
                      className="w-full px-4 py-3 text-sm text-white hover:bg-red-500/20 transition-all duration-200 flex items-center space-x-2 group"
                    >
                      <svg 
                        className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                      </svg>
                      <span className="group-hover:text-red-300 transition-colors">Desconectar Wallet</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveModal('profile')}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveModal('engagement')}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveModal('upload')}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>
      </div>
      {renderModal()}
    </>
  );
} 