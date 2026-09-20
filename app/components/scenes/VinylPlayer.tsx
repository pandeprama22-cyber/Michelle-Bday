'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { siteContent } from '@/config/content';
import { MusicNoteIcon, PlayIcon, PauseIcon, SparkleIcon, HeartIcon } from '@/app/components/ui/Icons';
import { playSparkleChime } from '@/app/components/ui/soundEffects';

interface VinylPlayerProps {
  isVisible: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  seekProgress?: number; // 0 to 1
  onSeek?: (ratio: number) => void;
  durationFormatted?: string;
  currentTimeFormatted?: string;
}

export default function VinylPlayer({
  isVisible: _isVisible,
  isPlaying,
  onTogglePlay,
  seekProgress = 0,
  onSeek,
  durationFormatted = '03:45',
  currentTimeFormatted = '00:00',
}: VinylPlayerProps) {
  const { song } = siteContent;

  const handleToggle = () => {
    playSparkleChime();
    onTogglePlay();
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--color-maroon-deep) 0%, #150008 50%, var(--color-navy-deep) 100%)',
      }}
    >
      {/* Background ambient lighting and vinyl shelf aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-pink-neon/20 blur-[150px]" />
      </div>

      <div className="max-w-4xl w-full mx-auto flex flex-col items-center relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#dcb38a]/40 text-[#dcb38a] text-xs uppercase tracking-widest font-semibold backdrop-blur-md mb-2">
            <SparkleIcon className="w-3.5 h-3.5 text-pink-neon" />
            <span>Analog Love Sound &bull; Daniel Caesar</span>
            <SparkleIcon className="w-3.5 h-3.5 text-pink-neon" />
          </div>

          <h2
            className="text-section-grand text-cream mt-2 drop-shadow-md"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Lagu Spesial Kisah Kita
          </h2>
          <div className="h-px w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#dcb38a] to-transparent" />
        </motion.div>

        {/* GRAND TURNTABLE AREA: 320px Desktop / 260px Mobile */}
        <div className="relative flex flex-col items-center justify-center my-4">
          <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] flex items-center justify-center">
            
            {/* Ambient turntable glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-50 transition-opacity duration-700"
              style={{
                background: isPlaying
                  ? 'radial-gradient(circle, rgba(255,46,136,0.6) 0%, rgba(220,179,138,0.3) 50%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, transparent 70%)',
              }}
            />

            {/* Tonearm (Jarum Turntable) — pivots on play/pause */}
            <div
              className="absolute -top-10 -right-2 sm:-top-12 sm:right-2 z-30 pointer-events-none origin-top-right transition-transform duration-700 ease-in-out"
              style={{
                transform: isPlaying ? 'rotate(26deg)' : 'rotate(0deg)',
              }}
            >
              <svg width="95" height="155" viewBox="0 0 95 155" fill="none">
                {/* Pivot base mount */}
                <circle cx="80" cy="18" r="14" fill="#2d2d38" stroke="#888" strokeWidth="2.5" />
                <circle cx="80" cy="18" r="7" fill="#dcb38a" />
                {/* Arm shaft metallic */}
                <path d="M80 18 L45 90 L38 140" stroke="#d5d5dd" strokeWidth="4" strokeLinecap="round" />
                {/* Stylus head cartridge */}
                <rect x="28" y="136" width="20" height="16" rx="3" fill="#ff2e88" />
                <circle cx="38" cy="144" r="3" fill="#ffffff" />
              </svg>
            </div>

            {/* GRAND VINYL RECORD */}
            <div
              onClick={handleToggle}
              className={`relative w-full h-full rounded-full cursor-pointer select-none vinyl-grooves-dense active:scale-95 transition-transform ${
                isPlaying ? 'animate-[spin-vinyl_5.5s_linear_infinite]' : ''
              }`}
            >
              {/* Concentric sheen rings */}
              <div className="absolute inset-4 rounded-full border border-white/10 opacity-70" />
              <div className="absolute inset-10 rounded-full border border-white/5 opacity-60" />
              <div className="absolute inset-16 rounded-full border border-white/5 opacity-40" />
              <div className="absolute inset-22 rounded-full border border-white/5 opacity-30" />

              {/* Center Label (35% Diameter) */}
              <div className="absolute inset-[30%] rounded-full bg-[#1e020d] border-4 border-[#3d0317] flex items-center justify-center overflow-hidden shadow-inner">
                {song.coverSrc ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={song.coverSrc}
                      alt="Vinyl Cover"
                      fill
                      sizes="120px"
                      className="object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                  </div>
                ) : (
                  <MusicNoteIcon className="w-8 h-8 text-[#dcb38a]" />
                )}
                {/* Center spindle hole */}
                <div className="absolute w-5 h-5 rounded-full bg-black border-2 border-[#dcb38a] z-20 shadow-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Animated Audio Equalizer Bars (Displays when playing) */}
        <div className="flex items-end justify-center gap-1.5 h-10 mt-4 select-none">
          {[16, 28, 12, 32, 22, 36, 18, 30, 24, 14, 34, 20, 26, 16].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full bg-gradient-to-t from-pink-neon via-pink-soft to-[#dcb38a] transition-all duration-300 ${
                isPlaying ? 'eq-bar' : 'opacity-30 h-2'
              }`}
              style={{
                animationDuration: `${0.6 + (i % 5) * 0.15}s`,
                animationDelay: `${i * 0.08}s`,
                height: isPlaying ? undefined : '6px',
              }}
            />
          ))}
        </div>

        {/* Song Info & Dedication Note Card */}
        <motion.div
          className="w-full max-w-lg mt-6 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2">
            <HeartIcon className="w-4 h-4 text-pink-neon" />
            <h3
              className="text-2xl sm:text-3xl font-bold tracking-wide text-white drop-shadow"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {song.title}
            </h3>
            <HeartIcon className="w-4 h-4 text-pink-neon" />
          </div>
          <p className="text-base text-pink-soft font-medium mt-1">
            {song.artist} &bull; <span className="text-cream/60 text-sm">{song.album}</span>
          </p>

          {/* Dedication Note */}
          <div className="mt-5 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <p className="text-xs uppercase tracking-widest text-[#dcb38a] font-semibold mb-2">
              Catatan Dari Hatiku
            </p>
            <p
              className="text-sm sm:text-base italic text-cream leading-relaxed font-serif"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              &ldquo;{song.reason}&rdquo;
            </p>
          </div>

          {/* Progress Slider */}
          <div className="mt-6 flex flex-col gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={seekProgress}
              onChange={(e) => onSeek && onSeek(parseFloat(e.target.value))}
              className="w-full progress-track cursor-pointer accent-pink-neon"
            />
            <div className="flex justify-between text-xs text-cream/70 font-mono px-1">
              <span>{currentTimeFormatted}</span>
              <span>{durationFormatted}</span>
            </div>
          </div>

          {/* Big Play / Pause Button */}
          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={handleToggle}
              className="px-8 py-3.5 rounded-full bg-pink-neon hover:brightness-110 active:scale-95 text-white font-semibold text-sm sm:text-base flex items-center gap-3 shadow-[0_0_30px_rgba(255,46,136,0.6)] transition-all"
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-4 h-4" />
                  <span>Jeda Musik</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  <span>Putar Musik</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
