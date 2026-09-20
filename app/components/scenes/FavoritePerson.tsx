'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { siteContent } from '@/config/content';
import { Volume2Icon, VolumeXIcon, FlowerIcon, HeartIcon } from '@/app/components/ui/Icons';

interface FavoritePersonProps {
  isVisible: boolean;
}

export default function FavoritePerson({ isVisible }: FavoritePersonProps) {
  const media = siteContent.favoritePersonMedia;
  const isVideo = 'poster' in media;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center py-24 px-4 sm:px-8 overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #42060e 0%, var(--color-maroon-deep) 60%, #120104 100%)',
      }}
    >
      {/* Background Soft Bokeh Aura */}
      <div className="absolute inset-0 pointer-events-none opacity-35">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-pink-neon/20 blur-[130px]" />
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Film Frame Media Showcase (Left) */}
          <motion.div
            className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(255,46,136,0.3)] border-2 border-white/10 group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          >
            {isVideo && 'poster' in media ? (
              <>
                <video
                  ref={videoRef}
                  src={media.src}
                  poster={media.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={toggleMute}
                  className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all shadow-lg active:scale-95"
                >
                  {isMuted ? <VolumeXIcon className="w-5 h-5" /> : <Volume2Icon className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={media.src}
                  alt={`Foto favorit ${siteContent.partnerName}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 450px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            )}

            {/* Film Sprocket Holes Effect Top & Bottom */}
            <div className="absolute top-0 inset-x-0 h-4 bg-black/40 flex justify-between px-3 items-center pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2.5 h-2 rounded-[1px] bg-white/20" />
              ))}
            </div>
            <div className="absolute bottom-0 inset-x-0 h-4 bg-black/40 flex justify-between px-3 items-center pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2.5 h-2 rounded-[1px] bg-white/20" />
              ))}
            </div>

            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Emotional Quote & Typography (Right) */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
          >
            <span className="text-xs uppercase tracking-widest text-[#dcb38a] font-semibold mb-3 flex items-center gap-2">
              <FlowerIcon className="w-3.5 h-3.5 text-[#f2a6c4]" /> My Favorite Human in the Universe
            </span>

            <h3
              className="text-3xl sm:text-4xl md:text-5xl leading-tight text-cream drop-shadow-md mb-6"
              style={{ fontFamily: 'var(--font-script)' }}
            >
              {siteContent.favoritePersonCaption}
            </h3>

            <p
              className="text-base sm:text-lg text-cream/80 italic font-normal leading-relaxed max-w-lg mb-8"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {siteContent.favoritePersonSubtext}
            </p>

            {/* Glowing Heartbeat Indicator */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <motion.div
                className="w-9 h-9 text-pink-neon select-none"
                animate={{ scale: [1, 1.25, 1, 1.15, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <HeartIcon className="w-full h-full" />
              </motion.div>
              <div className="text-left">
                <p className="text-sm font-semibold text-pink-soft">Detak Jantungku Berbisik</p>
                <p className="text-xs text-cream/60">Hanya untukmu, kemarin, hari ini, dan selamanya.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
