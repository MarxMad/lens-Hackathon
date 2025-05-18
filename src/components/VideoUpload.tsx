"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Web3Storage } from 'web3.storage';
import { useAccount } from 'wagmi';

interface VideoUploadProps {
  onUploadComplete: (videoData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
  }) => void;
}

export const VideoUpload = ({ onUploadComplete }: VideoUploadProps) => {
  const { address } = useAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile || !title || !description) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Subir video a IPFS
      const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN || '' });
      
      const videoCid = await client.put([selectedFile], {
        onRootCidReady: (cid) => {
          console.log('Uploading video to IPFS:', cid);
        },
        onStoredChunk: (bytes) => {
          setUploadProgress((bytes / selectedFile.size) * 100);
        }
      });

      const videoUrl = `https://${videoCid}.ipfs.w3s.link/${selectedFile.name}`;

      // 2. Crear thumbnail (en una implementación real, generaríamos un thumbnail)
      const thumbnailUrl = previewUrl || '';

      // 3. Publicar en Lens
      const response = await fetch('https://api.lens.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer F8V9lH-O6-zt3n_Ofkt0yzvWY6D7Sjk20x'
        },
        body: JSON.stringify({
          query: `
            mutation CreatePost {
              createPostTypedData(request: {
                profileId: "${address}"
                contentURI: "${videoUrl}"
                collectModule: {
                  freeCollectModule: {
                    followerOnly: false
                  }
                }
                referenceModule: {
                  followerOnlyReferenceModule: false
                }
              }) {
                id
                expiresAt
                typedData {
                  types {
                    PostWithSig {
                      name
                      type
                    }
                  }
                  domain {
                    name
                    chainId
                    version
                    verifyingContract
                  }
                  value {
                    nonce
                    deadline
                    profileId
                    contentURI
                    collectModule
                    collectModuleInitData
                    referenceModule
                    referenceModuleInitData
                  }
                }
              }
            }
          `
        })
      });

      const data = await response.json();
      
      if (data.data?.createPostTypedData) {
        onUploadComplete({
          title,
          description,
          videoUrl,
          thumbnailUrl
        });
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Subir Video Educativo</h2>

      <div className="space-y-6">
        {/* Título y Descripción */}
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del video"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del video"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 h-24"
          />
        </div>

        {/* Área de Drop */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <div className="space-y-4">
              <video
                src={previewUrl}
                className="w-full max-h-64 rounded-lg"
                controls
              />
              <p className="text-gray-400">Haz clic o arrastra otro video para reemplazar</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gray-400">
                {isDragActive
                  ? "Suelta el video aquí"
                  : "Arrastra un video o haz clic para seleccionar"}
              </p>
              <p className="text-sm text-gray-500">
                Formatos soportados: MP4, MOV, AVI (máx. 100MB)
              </p>
            </div>
          )}
        </div>

        {/* Barra de Progreso */}
        {isUploading && (
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Botón de Subida */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !title || !description || isUploading}
          className={`w-full py-3 rounded-xl font-bold transition-colors ${
            !selectedFile || !title || !description || isUploading
              ? 'bg-gray-500/50 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isUploading ? 'Subiendo...' : 'Subir Video'}
        </button>
      </div>
    </motion.div>
  );
}; 