"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { create } from '@web3-storage/w3up-client';
import { useAccount } from 'wagmi';

interface VideoUploadProps {
  onUploadComplete: (data: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
  }) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadComplete }) => {
  const { address } = useAccount();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Crear cliente de Web3.Storage
      const client = await create();
      
      // Subir archivo
      const cid = await client.uploadFile(file);
      const videoUrl = `https://${cid}.ipfs.w3s.link`;

      // Generar thumbnail (esto es un placeholder)
      const thumbnailUrl = `https://via.placeholder.com/320x180?text=Video+Thumbnail`;

      onUploadComplete({
        title,
        description,
        videoUrl,
        thumbnailUrl
      });

      setUploadProgress(100);
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setIsUploading(false);
    }
  }, [title, description, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Subir Video</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Título del video"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe tu video"
          />
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-gray-400">Subiendo video... {uploadProgress}%</p>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-400">Suelta el video aquí...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-400">
                Arrastra y suelta un video aquí, o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500">
                Formatos soportados: MP4, MOV, AVI
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 