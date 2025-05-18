"use client";

import { motion } from "framer-motion";

export const Loader = ({ text = "Cargando..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex space-x-2 mb-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ y: 0, opacity: 0.7 }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-white text-lg font-medium opacity-80">{text}</span>
    </div>
  );
}; 