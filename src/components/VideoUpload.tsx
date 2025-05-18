"use client";

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
// import { create } from '@web3-storage/w3up-client';
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
  const [file, setFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    // Validar tipo
    if (!file.type.startsWith('video/')) {
      setError('Solo se permiten archivos de video.');
      setFile(null);
      return;
    }
    // Validar tamaño (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('El archivo no debe superar los 100MB.');
      setFile(null);
      return;
    }
    setFile(file);
  }, []);

  const handlePublish = async () => {
    // Logs de depuración SIEMPRE visibles
    console.log('PINATA KEY:', process.env.NEXT_PUBLIC_PINATA_API_KEY);
    console.log('PINATA SECRET:', process.env.NEXT_PUBLIC_PINATA_SECRET_KEY);
  
    if (!file || !title || !description || error) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Barra de progreso simulada mientras sube
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        setUploadProgress(Math.min(progress, 95));
        if (progress >= 95) {
          clearInterval(interval);
        }
      }, 200);
  
      // Subir a Pinata
      const formData = new FormData();
      formData.append('file', file);
  
      // Usa variables de entorno
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
  
      if (!apiKey || !secretKey) {
        setError('Las variables de entorno de Pinata no están definidas. Revisa tu .env.local y reinicia el servidor.');
        setIsUploading(false);
        return;
      }
  
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': secretKey
        },
        body: formData
      });
      clearInterval(interval);
      if (!res.ok) {
        setError('Error al subir a IPFS/Pinata.');
        setIsUploading(false);
        return;
      }
      const data = await res.json();
      console.log('Respuesta de Pinata:', data);
      const ipfsHash = data.IpfsHash;
      const videoUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      const thumbnailUrl = `https://via.placeholder.com/320x180?text=Video+Thumbnail`;
  
      // Guardar en localStorage
      const stored = JSON.parse(localStorage.getItem('studentlens_videos') || '[]');
      const newVideo = {
        id: Date.now().toString() + Math.random(),
        title,
        description,
        videoUrl,
        thumbnailUrl,
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
      localStorage.setItem('studentlens_videos', JSON.stringify([newVideo, ...stored]));
      console.log('Guardado en localStorage:', JSON.parse(localStorage.getItem('studentlens_videos')));
  
      onUploadComplete(newVideo);
      setUploadProgress(100);
      setShowToast(true);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2000);
  
      // Limpiar formulario
      setTitle('');
      setDescription('');
      setFile(null);
      setError(null);
    } catch (error) {
      setError('Ocurrió un error al subir el video a IPFS.');
      console.error('Error uploading video:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
              <p className="text-gray-400">Subiendo video... {Math.round(uploadProgress)}%</p>
            </div>
          ) : file ? (
            <div className="text-green-400">Archivo seleccionado: {file.name}</div>
          ) : isDragActive ? (
            <p className="text-blue-400">Suelta el video aquí...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-400">
                Arrastra y suelta un video aquí, o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500">
                Formatos soportados: MP4, MOV, AVI. Máx 100MB
              </p>
            </div>
          )}
        </div>
        {error && (
          <div className="text-red-400 text-sm mt-2">{error}</div>
        )}
        <button
          className={`w-full mt-4 py-3 rounded-lg font-bold text-lg transition-colors ${
            (!title || !description || !file || isUploading || error)
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          onClick={handlePublish}
          disabled={!title || !description || !file || isUploading || !!error}
        >
          {isUploading ? 'Publicando...' : 'Publicar'}
        </button>
        {showToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
            ¡Video publicado con éxito!
          </div>
        )}
      </div>
    </motion.div>
  );
}; 