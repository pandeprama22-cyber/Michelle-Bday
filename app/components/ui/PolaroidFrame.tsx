'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { MemoryPhoto } from '@/config/content';
import { SparkleIcon } from '@/app/components/ui/Icons';

interface PolaroidFrameProps {
  photo: MemoryPhoto;
  index: number;
  className?: string;
  onClick?: () => void;
}

export default function PolaroidFrame({ photo, index, className = '', onClick }: PolaroidFrameProps) {
  const rotation = photo.rotation ?? ((index % 2 === 0 ? 1 : -1) * (3 + (index % 5)));

  return (
    <motion.div
      onClick={onClick}
      className={`polaroid-realistic cursor-pointer select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      initial={{ opacity: 0, y: 50, rotate: rotation * 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.65, 0, 0.35, 1],
      }}
      whileHover={{
        rotate: 0,
        scale: 1.08,
        zIndex: 35,
      }}
      whileTap={{
        rotate: 0,
        scale: 1.03,
      }}
    >
      {/* Large Polaroid Frame */}
      <div className="bg-[#fcfaf7] p-3 sm:p-4 pb-10 sm:pb-12 rounded-[4px] shadow-2xl border border-[#ede6dc] flex flex-col group relative">
        {/* Hover hint icon */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/60 rounded-full p-1 text-white">
          <SparkleIcon className="w-3 h-3 text-pink-soft" />
        </div>

        {/* Photo Area */}
        <div className="relative w-full aspect-[4/4.2] overflow-hidden rounded-[2px] bg-neutral-900 shadow-inner">
          <Image
            src={photo.src}
            alt={photo.caption}
            fill
            sizes="(max-width: 640px) 180px, 260px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Subtle Date badge on photo corner */}
          {photo.date && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono text-white/90 bg-black/50 backdrop-blur-xs">
              {photo.date}
            </span>
          )}
        </div>

        {/* Handwritten Caption */}
        <p
          className="text-center mt-3 text-gray-800 tracking-wide font-normal leading-tight select-none px-1"
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
          }}
        >
          {photo.caption}
        </p>
      </div>
    </motion.div>
  );
}
