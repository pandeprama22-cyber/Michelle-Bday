'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StarfieldCanvas from '@/app/components/effects/StarfieldCanvas';
import { siteContent } from '@/config/content';
import { HeartIcon, HeartOutlineIcon, SparkleIcon, FlowerIcon, ChevronDownIcon } from '@/app/components/ui/Icons';
import { playSparkleChime } from '@/app/components/ui/soundEffects';

interface HeroTitleProps {
  isVisible: boolean;
}

interface TimePassed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function HeroTitle({ isVisible }: HeroTitleProps) {
  const title = siteContent.heroTitle;
  const words = title.split(' ');

  const [timePassed, setTimePassed] = useState<TimePassed>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date(siteContent.anniversaryDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, now - startDate);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimePassed({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20 px-6"
      style={{
        background: 'linear-gradient(180deg, var(--color-navy-deep) 0%, #20020a 35%, var(--color-maroon-deep) 100%)',
      }}
    >
      {/* Soft Starfield overlay on upper gradient */}
      <div className="absolute inset-0" style={{ maskImage: 'linear-gradient(to bottom, white 0%, transparent 75%)' }}>
        <StarfieldCanvas isVisible={isVisible} parallaxEnabled={false} starCount={160} showNebula={false} />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-16 left-[10%] w-7 h-7 text-pink-neon/70"
          animate={{ y: [0, -16, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HeartOutlineIcon />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-[12%] w-5 h-5 text-[#dcb38a]/70"
          animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
        >
          <SparkleIcon />
        </motion.div>
        <motion.div
          className="absolute top-24 right-[12%] w-6 h-6 text-pink-soft/70"
          animate={{ y: [0, -15, 0], rotate: [0, -12, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
        >
          <HeartIcon />
        </motion.div>
        <motion.div
          className="absolute bottom-24 right-[15%] w-5 h-5 text-[#f2a6c4]/70"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
        >
          <FlowerIcon />
        </motion.div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Glowing Badge Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onClick={() => playSparkleChime()}
          className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-[#dcb38a]/40 shadow-[0_0_25px_rgba(220,179,138,0.25)] backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <SparkleIcon className="w-3.5 h-3.5 text-pink-neon" />
          <span className="text-xs sm:text-sm tracking-widest uppercase font-semibold text-[#dcb38a]">
            {siteContent.anniversaryTag}
          </span>
          <SparkleIcon className="w-3.5 h-3.5 text-pink-neon" />
        </motion.div>

        {/* Grand Hero Script Title (Staggered words) */}
        <h1
          className="text-hero-grand leading-[1.15] mb-6 text-cream drop-shadow-[0_4px_30px_rgba(255,46,136,0.35)]"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.3em]"
              initial={{ opacity: 0, y: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.18,
                ease: [0.65, 0, 0.35, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle with Gold Accent */}
        <motion.p
          className="text-lg sm:text-2xl italic tracking-wide text-[#dcb38a] max-w-2xl px-4 leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-serif)' }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {siteContent.heroSubtitle}
        </motion.p>

        {/* Realtime Love Journey Timer Card */}
        <motion.div
          className="mb-8 p-4 sm:p-5 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col items-center gap-2 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-pink-soft font-semibold">
            <HeartIcon className="w-3.5 h-3.5 text-pink-neon animate-pulse" />
            <span>Telah Berjalan Bersamamu</span>
            <HeartIcon className="w-3.5 h-3.5 text-pink-neon animate-pulse" />
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full mt-1">
            {[
              { label: 'Hari', value: timePassed.days },
              { label: 'Jam', value: timePassed.hours },
              { label: 'Menit', value: timePassed.minutes },
              { label: 'Detik', value: timePassed.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 text-cream"
              >
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wider">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-cream/70 uppercase tracking-wider mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Decorative Golden Divider */}
        <motion.div
          className="flex items-center justify-center gap-3 my-6 w-full max-w-md"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.9 }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#dcb38a]" />
          <span className="text-xl text-[#dcb38a]">❦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#dcb38a]" />
        </motion.div>

        {/* Scroll down prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center text-xs tracking-widest uppercase text-cream/70 gap-2 cursor-pointer hover:text-white transition-colors"
          onClick={() => {
            document.getElementById('scene-letter')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>Buka Surat Cintamu</span>
          <ChevronDownIcon className="w-4 h-4 animate-bounce" />
        </motion.div>
      </div>
    </div>
  );
}
