'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import WashiTape from '@/app/components/ui/WashiTape';
import { siteContent } from '@/config/content';
import { HeartIcon, SparkleIcon, CoupleDoodleIcon } from '@/app/components/ui/Icons';

interface LoveLetterProps {
  isVisible: boolean;
}

// Typewriter hook for opening lines
function useTypewriter(text: string, isActive: boolean, speed = 25) {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isActive || isDone) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, isActive, speed, isDone]);

  return { displayText, isDone };
}

export default function LoveLetter({ isVisible }: LoveLetterProps) {
  const [startTypewriter, setStartTypewriter] = useState(false);
  const paragraphs = siteContent.loveLetterParagraphs;
  const { displayText: firstPara, isDone: typewriterDone } = useTypewriter(
    paragraphs[0] || '',
    startTypewriter
  );

  // Latch "has been visible" permanently the moment the scene is first
  // seen. Previously this used a setTimeout(400ms) delay, which meant a
  // fast scroll-past could unmount the intersection state before the
  // timer fired and the typewriter would never start. Firing setState
  // immediately (no timer) removes that race condition entirely.
  useEffect(() => {
    if (isVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time latch synced from the IntersectionObserver-driven `isVisible` prop; setState is idempotent once already true, so this cannot cascade.
      setStartTypewriter(true);
    }
  }, [isVisible]);

  return (
    <div
      className="relative w-full min-h-screen py-24 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #520812 0%, var(--color-maroon-deep) 55%, #180104 100%)',
      }}
    >
      {/* Background ambient lighting and bokeh particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-pink-neon/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#ff7ba9]/15 blur-[120px]" />
      </div>

      {/* Ambient floating hearts & sparkles, matching Hero/Envelope scenes so this
          section doesn't feel static compared to the rest of the page */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '10%', left: '6%', size: 'w-5 h-5', delay: 0, dur: 5, icon: 'heart' },
          { top: '18%', right: '8%', size: 'w-4 h-4', delay: 1.4, dur: 4.4, icon: 'sparkle' },
          { bottom: '14%', left: '10%', size: 'w-4 h-4', delay: 0.8, dur: 4.8, icon: 'sparkle' },
          { bottom: '8%', right: '12%', size: 'w-6 h-6', delay: 2.1, dur: 5.4, icon: 'heart' },
          { top: '52%', left: '3%', size: 'w-3.5 h-3.5', delay: 1.8, dur: 4, icon: 'sparkle' },
          { top: '46%', right: '4%', size: 'w-3.5 h-3.5', delay: 0.4, dur: 4.6, icon: 'heart' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${item.size} text-pink-neon/50`}
            style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
            animate={{ y: [0, -14, 0], opacity: [0.25, 0.65, 0.25], rotate: [0, 8, 0] }}
            transition={{ duration: item.dur, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
          >
            {item.icon === 'heart' ? <HeartIcon className="w-full h-full" /> : <SparkleIcon className="w-full h-full" />}
          </motion.div>
        ))}
      </div>

      {/* Decorative Section Header */}
      <motion.div
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-xs tracking-widest uppercase text-[#dcb38a] font-semibold">
          Dari Lubuk Hati Terdalam
        </span>
        <h2
          className="text-section-grand text-cream mt-2 drop-shadow-md"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Surat Cinta Untuk {siteContent.nickname}
        </h2>
        <div className="h-px w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#dcb38a] to-transparent" />
      </motion.div>

      {/* GRAND STATIONERY BOOK-PAGE CARD (680px Desktop / 90% Mobile) */}
      <motion.div
        className="relative w-full max-w-[680px] paper-texture-lined rounded-2xl p-7 sm:p-14 text-gray-900 z-10"
        style={{
          transform: 'rotate(-0.8deg)',
        }}
        initial={{ opacity: 0, y: 60, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Vintage Stamp / Wax Seal in Corner */}
        <motion.div
          className="absolute top-5 right-6 select-none opacity-80"
          initial={{ opacity: 0, scale: 0.4, rotate: 35 }}
          animate={startTypewriter ? { opacity: 0.8, scale: 1, rotate: 6 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <motion.div
            className="w-14 h-16 border-2 border-dashed border-red-800/40 rounded p-1 flex flex-col items-center justify-center bg-amber-50/40"
            animate={{ rotate: [6, 2, 6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <span className="text-xs text-red-900/60 font-serif font-bold tracking-tighter">LOVE</span>
            <HeartIcon className="w-4 h-4 text-red-800/70" />
            <span className="text-[9px] text-red-900/60 font-mono">09.09</span>
          </motion.div>
        </motion.div>

        {/* Salutation */}
        <motion.div
          className="mb-8 border-b border-amber-900/15 pb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={startTypewriter ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p
            className="text-3xl sm:text-4xl text-[#3b0309] font-medium"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Sayangku, {siteContent.partnerName}...
          </p>
          <span className="text-xs text-amber-800/60 font-serif italic tracking-wider block mt-1">
            Ditulis khusus untuk hari ulang tahunmu
          </span>
        </motion.div>

        {/* Letter Body Paragraphs */}
        <div className="space-y-6 text-base sm:text-lg leading-[32px] sm:leading-[32px] text-[#2c1d1a] font-normal"
             style={{ fontFamily: 'var(--font-serif)' }}>
          {/* Paragraph 1: Typewriter Effect */}
          <p className="min-h-[4rem]">
            {firstPara}
            {!typewriterDone && startTypewriter && (
              <span className="inline-block w-0.5 h-5 bg-[#5a0914] ml-1 animate-pulse align-middle" />
            )}
          </p>

          {/* Remaining Paragraphs: revealed one after another once the
              typewriter finishes, like the letter is being written line by
              line — driven by state/time instead of scroll position, so it
              always animates visibly even when the whole card already fits
              on screen (previously all paragraphs entered together within
              ~0.6s of each other and the effect read as "flat"). */}
          {paragraphs.slice(1).map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={typewriterDone ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.25 + i * 0.45,
                ease: [0.65, 0, 0.35, 1],
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Signature & Closing */}
        <motion.div
          className="mt-14 pt-6 border-t border-amber-900/15 text-right"
          initial={{ opacity: 0, y: 20 }}
          animate={typewriterDone ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            delay: 0.25 + Math.max(paragraphs.length - 1, 0) * 0.45 + 0.4,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          <p className="text-sm sm:text-base italic text-amber-900/70" style={{ fontFamily: 'var(--font-serif)' }}>
            {siteContent.loveLetterSignature}
          </p>
          <motion.p
            className="text-3xl sm:text-5xl text-[#5a0914] mt-2 font-semibold"
            style={{ fontFamily: 'var(--font-script)' }}
            initial={{ opacity: 0, x: 16 }}
            animate={typewriterDone ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.25 + Math.max(paragraphs.length - 1, 0) * 0.45 + 0.75,
            }}
          >
            {siteContent.senderName}
          </motion.p>
        </motion.div>

        {/* Cute couple doodle, like a little sketch left in the margin —
            appears last, after the signature, as a small charming coda */}
        <motion.div
          className="flex justify-center mt-4 text-[#5a0914]/50"
          initial={{ opacity: 0, y: 12 }}
          animate={typewriterDone ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.25 + Math.max(paragraphs.length - 1, 0) * 0.45 + 1.05,
          }}
        >
          <CoupleDoodleIcon className="w-20 h-12" />
        </motion.div>

        {/* Tucked Polaroid Memory Photo with Washi Tape */}
        <motion.div
          className="absolute -bottom-8 -right-3 sm:-right-8 w-28 h-36 sm:w-36 sm:h-44 z-20"
          initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
          animate={
            typewriterDone
              ? { opacity: 1, scale: 1, rotate: [15, 4, 8, 7] }
              : {}
          }
          transition={{
            delay: 0.25 + Math.max(paragraphs.length - 1, 0) * 0.45 + 0.9,
            duration: 0.9,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          whileHover={{ rotate: 0, scale: 1.15, zIndex: 30 }}
        >
          <div className="bg-white p-2 pb-7 rounded shadow-2xl h-full border border-gray-100 flex flex-col">
            <div className="relative w-full flex-1 overflow-hidden rounded-sm bg-gray-100">
              <Image
                src={siteContent.loveLetterPhotoSrc}
                alt="Kenangan bersama"
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-[10px] text-center text-gray-600 mt-1 font-script flex items-center justify-center gap-1" style={{ fontFamily: 'var(--font-script)' }}>
              Forever &amp; always <HeartIcon className="w-2.5 h-2.5 text-pink-neon inline-block" />
            </p>
          </div>
          {/* Washi tape over the corner */}
          <WashiTape className="-top-3 -left-3" rotation={-25} />
        </motion.div>
      </motion.div>
    </div>
  );
}
