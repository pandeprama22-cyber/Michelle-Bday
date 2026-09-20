'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import StarfieldCanvas from '@/app/components/effects/StarfieldCanvas';
import { siteContent } from '@/config/content';
import { HeartIcon, MailIcon, TapIcon, ChevronDownIcon } from '@/app/components/ui/Icons';

interface StarfieldEnvelopeProps {
  isVisible: boolean;
  onEnvelopeOpen: () => void;
}

export default function StarfieldEnvelope({ isVisible, onEnvelopeOpen }: StarfieldEnvelopeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);

  const handleOpen = useCallback(() => {
    if (isOpened) return;
    setIsOpened(true);
    onEnvelopeOpen();

    setTimeout(() => setShowPhoto(true), 750);

    setTimeout(() => {
      document.getElementById('scene-hero')?.scrollIntoView({ behavior: 'smooth' });
    }, 2800);
  }, [isOpened, onEnvelopeOpen]);

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-12 px-4"
      style={{ background: 'var(--color-navy-deep)' }}
    >
      <StarfieldCanvas isVisible={isVisible} parallaxEnabled={true} starCount={380} showNebula={true} />

      {/* Floating ambient hearts around the envelope area */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '18%', left: '15%', delay: 0, size: 'w-6 h-6' },
          { top: '25%', right: '18%', delay: 1.2, size: 'w-5 h-5' },
          { bottom: '22%', left: '20%', delay: 0.8, size: 'w-7 h-7' },
          { bottom: '20%', right: '16%', delay: 2.1, size: 'w-6 h-6' },
          { top: '40%', left: '8%', delay: 1.7, size: 'w-4 h-4' },
          { top: '45%', right: '10%', delay: 2.8, size: 'w-6 h-6' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${item.size} select-none opacity-60 text-pink-soft`}
            style={{ top: item.top, left: item.left, right: item.right }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, 8, -8, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4 + idx * 0.5,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            <HeartIcon className="w-full h-full" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            <motion.div
              key="envelope"
              className="flex flex-col items-center cursor-pointer select-none group"
              onClick={handleOpen}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
              transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            >
              {/* Grand Instruction Header */}
              <motion.div
                className="text-center mb-8"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-pink-neon/15 border border-pink-neon/40 text-pink-soft text-xs sm:text-sm uppercase tracking-widest font-semibold backdrop-blur-sm shadow-[0_0_20px_rgba(255,46,136,0.3)]">
                  <MailIcon className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1.5" />
                  Surat Rahasia Untukmu
                </span>
                <p
                  className="text-lg sm:text-2xl mt-3 tracking-wide text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Sentuh Amplop untuk Membuka
                </p>
              </motion.div>

              {/* GRAND ENVELOPE (380x280px Desktop / 290x210px Mobile) */}
              <motion.div
                className="relative w-[290px] h-[210px] sm:w-[380px] sm:h-[280px]"
                animate={{ scale: [1, 1.035, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Thick Multi-layer Glow Behind Envelope */}
                <div
                  className="absolute inset-0 -z-10 rounded-2xl blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,46,136,0.7) 0%, rgba(180,10,80,0.3) 50%, transparent 80%)',
                  }}
                />

                {/* Envelope SVG Frame */}
                <svg
                  viewBox="0 0 380 280"
                  className="w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Envelope Base Body */}
                  <rect
                    x="10"
                    y="50"
                    width="360"
                    height="220"
                    rx="16"
                    fill="#260413"
                    stroke="#ff2e88"
                    strokeWidth="2.5"
                  />
                  {/* Inner lining gradient */}
                  <rect
                    x="20"
                    y="60"
                    width="340"
                    height="200"
                    rx="10"
                    fill="url(#envelope-inner-grad)"
                  />

                  {/* Envelope Flap Triangles */}
                  <polygon
                    points="10,50 190,175 370,50"
                    fill="#3d0720"
                    stroke="#ff2e88"
                    strokeWidth="2"
                    opacity="0.95"
                  />
                  <polygon
                    points="10,270 190,150 370,270"
                    fill="#2a0515"
                    stroke="#ff2e8840"
                    strokeWidth="1.5"
                  />

                  {/* Golden Ribbon Line */}
                  <line x1="30" y1="50" x2="350" y2="50" stroke="#dcb38a" strokeWidth="2.5" strokeDasharray="6 4" />

                  {/* Wax Seal Heart Button (Center) */}
                  <g transform="translate(190, 160)" className="cursor-pointer">
                    <circle r="32" fill="#ff2e88" filter="drop-shadow(0 0 15px rgba(255,46,136,0.8))" />
                    <circle r="26" fill="#cc0e62" />
                    <text
                      textAnchor="middle"
                      dy="10"
                      fill="#ffffff"
                      fontSize="28"
                      fontWeight="bold"
                    >
                      ♥
                    </text>
                  </g>

                  <defs>
                    <linearGradient id="envelope-inner-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a0826" />
                      <stop offset="100%" stopColor="#1a020d" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Pulsing Touch Ring Around Heart Seal */}
                <div className="absolute top-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-20 h-20 rounded-full border-2 border-pink-neon/80 animate-ping opacity-75" />
                </div>
              </motion.div>

              {/* Tap Hand Indicator */}
              <motion.div
                className="mt-6 flex items-center gap-2 text-pink-soft text-sm sm:text-base font-medium"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <TapIcon className="w-6 h-6" />
                <span>Klik untuk membuka hadiahmu</span>
              </motion.div>
            </motion.div>
          ) : (
            /* OPENED ENVELOPE: Photo Reveal */
            <motion.div
              key="opened"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.6, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            >
              {showPhoto && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                  className="relative flex flex-col items-center"
                >
                  {/* Large Revealed Photo Card */}
                  <div className="bg-white p-4 pb-14 rounded-2xl shadow-[0_0_60px_rgba(255,46,136,0.45),0_30px_80px_rgba(0,0,0,0.8)] max-w-sm sm:max-w-md w-full">
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto overflow-hidden rounded-xl bg-gray-900 shadow-inner">
                      <Image
                        src={siteContent.envelopePhotoSrc}
                        alt={`Hadiah untuk ${siteContent.partnerName}`}
                        fill
                        sizes="(max-width: 640px) 256px, 320px"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <p
                      className="text-center mt-4 text-gray-800 text-lg sm:text-xl"
                      style={{ fontFamily: 'var(--font-script)' }}
                    >
                      Spesial untukmu, {siteContent.nickname} tersayang <HeartIcon className="w-4 h-4 inline-block text-pink-neon -mt-1" />
                    </p>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8 text-sm sm:text-base text-pink-soft/80 flex items-center gap-2"
                  >
                    <span>Scroll ke bawah untuk melanjutkan</span>
                    <ChevronDownIcon className="w-4 h-4 animate-bounce" />
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
