'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteContent } from '@/config/content';
import { HeartIcon, MessageIcon, RefreshIcon, SparkleIcon } from '@/app/components/ui/Icons';
import { playCelebrationSound, playSparkleChime } from '@/app/components/ui/soundEffects';

interface OutroProps {
  isVisible: boolean;
  onReplay: () => void;
}

export default function Outro({ isVisible: _isVisible, onReplay }: OutroProps) {
  const [wished, setWished] = useState(false);
  const [loveClicks, setLoveClicks] = useState(0);

  const whatsappUrl = siteContent.whatsappNumber
    ? `https://wa.me/${siteContent.whatsappNumber}?text=${encodeURIComponent(
        siteContent.replyMessage || 'Sayang, makasih banyak yaa atas hadiah indahnya... Aku suka banget! 🥰💕'
      )}`
    : null;

  const handleMakeWish = () => {
    setWished(true);
    playCelebrationSound();
  };

  const handleSendLove = () => {
    setLoveClicks((prev) => prev + 1);
    playSparkleChime();
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-between py-20 px-6 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--color-navy-deep) 0%, #18000c 50%, #06060d 100%)',
      }}
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full bg-pink-neon/20 blur-[140px]" />
      </div>

      <div className="w-full pt-4" />

      {/* Main Closing Card */}
      <div className="max-w-2xl mx-auto flex flex-col items-center relative z-10">
        {/* Floating Heart Letter Emblem */}
        <motion.div
          className="w-16 h-16 mb-4 text-pink-neon select-none cursor-pointer"
          animate={{ scale: [1, 1.15, 1], y: [0, -10, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          onClick={handleSendLove}
          whileTap={{ scale: 1.3 }}
        >
          <HeartIcon className="w-full h-full drop-shadow-[0_0_20px_rgba(255,46,136,0.6)]" />
        </motion.div>

        {/* Love Tap Counter */}
        {loveClicks > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-4 px-3 py-1 rounded-full bg-pink-neon/20 border border-pink-neon/40 text-xs font-mono text-pink-soft"
          >
            +{loveClicks} Pelukan &amp; Cinta Terkirim 💕
          </motion.div>
        )}

        {/* GRAND CLOSING TITLE (Changed from "Untuk Selamanya Bersamamu" to "Just to be with you, forever") */}
        <motion.h2
          className="text-section-grand text-cream mb-6 drop-shadow-[0_0_25px_rgba(255,46,136,0.4)]"
          style={{ fontFamily: 'var(--font-script)' }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Just to be with you, forever
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg leading-relaxed text-cream/90 mb-8 px-4 italic font-normal"
          style={{ fontFamily: 'var(--font-serif)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          &ldquo;{siteContent.closingMessage}&rdquo;
        </motion.p>

        {/* Interactive Birthday Wish / Celebration Card */}
        <motion.div
          className="w-full max-w-md p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl mb-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <span className="text-xs uppercase tracking-widest text-[#dcb38a] font-semibold block mb-2">
            Harapan Ulang Tahun 🎂
          </span>

          <AnimatePresence mode="wait">
            {!wished ? (
              <motion.div
                key="make-wish"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <p className="text-xs sm:text-sm text-cream/80 font-serif italic">
                  Tutup matamu sejenak, buat satu harapan indah di hari spesialmu ini, lalu sentuh tombol di bawah:
                </p>
                <button
                  onClick={handleMakeWish}
                  className="mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-neon to-[#ff5d9e] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,46,136,0.6)] hover:scale-105 active:scale-95 transition-all"
                >
                  <SparkleIcon className="w-4 h-4" />
                  <span>Tiup Lilin &amp; Buat Harapan ✨</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="wished"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2 py-2"
              >
                <div className="text-3xl animate-bounce">🎉✨💖🎂</div>
                <p className="text-base font-semibold text-pink-soft font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                  Semoga semua impian &amp; harapan indahmu terwujud!
                </p>
                <p className="text-xs text-cream/70">
                  Aku akan selalu ada di sini untuk mendukung dan menemani setiap langkahmu.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons: WhatsApp & Replay */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:shadow-[0_0_35px_rgba(37,211,102,0.7)] hover:scale-105 active:scale-95 transition-all"
            >
              <MessageIcon className="w-5 h-5" />
              <span>Kirim Balasan ke WhatsApp</span>
            </a>
          )}

          <button
            onClick={onReplay}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 font-semibold text-base flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 transition-all shadow-lg"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>Putar Ulang Cerita</span>
          </button>
        </motion.div>
      </div>

      {/* Elegant Footer Credits */}
      <footer className="w-full mt-16 pt-8 border-t border-white/10 flex flex-col items-center gap-1.5 text-xs text-cream/50 font-light relative z-10">
        <p>
          Dibuat dengan segenap cinta untuk <span className="text-pink-soft font-medium">{siteContent.partnerName}</span> &bull; {new Date().getFullYear()}
        </p>
        <p className="italic font-serif text-[11px] text-[#dcb38a]">
          &ldquo;You will always be my favorite adventure and my happiest home.&rdquo;
        </p>
      </footer>
    </div>
  );
}
