'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PolaroidFrame from '@/app/components/ui/PolaroidFrame';
import WashiTape from '@/app/components/ui/WashiTape';
import { siteContent, type MemoryPhoto } from '@/config/content';
import { SparkleIcon, HeartIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '@/app/components/ui/Icons';
import { playSparkleChime } from '@/app/components/ui/soundEffects';

interface PolaroidGalleryProps {
  isVisible: boolean;
}

export default function PolaroidGallery({ isVisible: _isVisible }: PolaroidGalleryProps) {
  const photos = siteContent.galleryPhotos;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleOpenPhoto = (idx: number) => {
    playSparkleChime();
    setSelectedPhotoIndex(idx);
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div
      className="relative w-full min-h-screen py-24 px-4 sm:px-8 lg:px-16 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #4d0710 0%, var(--color-maroon-deep) 50%, #150104 100%)',
      }}
    >
      {/* Background ambient scrapbook textures and glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-pink-neon/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full bg-[#dcb38a]/10 blur-[140px]" />
      </div>

      {/* Grand Section Header */}
      <motion.div
        className="text-center mb-16 relative z-10 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-xs uppercase tracking-widest text-[#dcb38a] font-semibold">
          Scrapbook Kenangan
        </span>
        <h2
          className="text-section-grand text-cream mt-2 drop-shadow-md"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          {siteContent.galleryTitle}
        </h2>
        <p
          className="text-sm sm:text-base text-cream/80 mt-2 italic"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {siteContent.gallerySubtitle}
        </p>
        <div className="h-px w-36 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#dcb38a] to-transparent" />
      </motion.div>

      {/* SCATTERED POLAROID PHOTO LAYOUT — Spanning Full Screen Width */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        {photos.map((photo, i) => {
          const isStaggered = i % 2 === 1 ? 'sm:translate-y-6' : 'sm:-translate-y-3';
          const hasTape = i % 3 === 0;

          return (
            <div key={i} className={`relative ${isStaggered}`}>
              {hasTape && (
                <WashiTape
                  className="-top-3 left-6 z-20"
                  rotation={i % 2 === 0 ? -15 : 12}
                />
              )}
              <PolaroidFrame
                photo={photo}
                index={i}
                onClick={() => handleOpenPhoto(i)}
              />
            </div>
          );
        })}
      </div>

      {/* Decorative Bottom Banner */}
      <motion.div
        className="relative z-10 text-center mt-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs tracking-widest uppercase text-[#dcb38a]/70 font-semibold flex items-center gap-1.5">
          Dan masih ada ribuan momen indah menanti kita di masa depan
          <SparkleIcon className="w-3 h-3 text-[#dcb38a]" />
        </p>
      </motion.div>

      {/* Lightbox Modal for Zooming Photos */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.div
              className="relative max-w-md w-full bg-[#fcfaf7] p-4 sm:p-6 pb-12 rounded-lg shadow-2xl border border-white/20 text-gray-900"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-pink-neon text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-30"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              {/* Photo */}
              <div className="relative w-full aspect-[4/4.5] overflow-hidden rounded bg-black">
                <Image
                  src={photos[selectedPhotoIndex].src}
                  alt={photos[selectedPhotoIndex].caption}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                {photos[selectedPhotoIndex].date && (
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded text-xs font-mono text-white bg-black/60 backdrop-blur-sm">
                    {photos[selectedPhotoIndex].date}
                  </span>
                )}
              </div>

              {/* Caption */}
              <div className="mt-4 text-center">
                <p
                  className="text-2xl sm:text-3xl text-gray-900 font-normal leading-tight"
                  style={{ fontFamily: 'var(--font-script)' }}
                >
                  {photos[selectedPhotoIndex].caption}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-pink-neon text-xs font-semibold">
                  <HeartIcon className="w-3.5 h-3.5" />
                  <span>Memory #{selectedPhotoIndex + 1} of {photos.length}</span>
                </div>
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-200">
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-full bg-pink-neon hover:bg-pink-600 text-xs font-medium text-white flex items-center gap-1 transition-colors shadow-md"
                >
                  <span>Selanjutnya</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
