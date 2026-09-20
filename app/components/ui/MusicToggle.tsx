'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MusicToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
  visible: boolean;
}

export default function MusicToggle({ isPlaying, onToggle, visible }: MusicToggleProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center
                     bg-white/10 backdrop-blur-md border border-white/20
                     hover:bg-white/20 active:scale-95 transition-all duration-300
                     shadow-lg"
          style={{
            boxShadow: isPlaying
              ? '0 0 20px rgba(255, 46, 136, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)'
              : '0 4px 15px rgba(0, 0, 0, 0.3)',
          }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {/* Mini vinyl record icon */}
          <div className="relative w-7 h-7">
            <div
              className={`w-full h-full rounded-full bg-gray-900 border-2 border-gray-700
                          flex items-center justify-center
                          ${isPlaying ? 'animate-[spin-vinyl_3s_linear_infinite]' : ''}`}
            >
              {/* Center hole */}
              <div className="w-2 h-2 rounded-full bg-pink-neon" />
              {/* Grooves */}
              <div className="absolute inset-1 rounded-full border border-gray-600/30" />
              <div className="absolute inset-2 rounded-full border border-gray-600/20" />
            </div>
            {/* Play/Pause indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-1 opacity-80" />
              </div>
            )}
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
