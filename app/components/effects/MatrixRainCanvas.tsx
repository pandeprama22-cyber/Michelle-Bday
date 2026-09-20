'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface MatrixRainCanvasProps {
  onComplete: () => void;
  isVisible: boolean;
  /** Recipient's name/nickname, dramatically coalesced out of the rain
   *  before the countdown — combines the "name forms out of the falling
   *  code" reveal with the existing countdown/explode sequence. */
  revealName?: string;
}

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ♥♡❤︎';
const PINK_HEAD = '#ffffff';
const PINK_GLOW = '#ff4d9d';
const PINK_BASE = '#ff2e88';

// High-resolution 7x9 bitmasks for crisp, dramatic numbers
const NUMBER_MASKS: Record<number, number[][]> = {
  3: [
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  2: [
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  1: [
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1],
  ],
};

interface RainColumn {
  x: number;
  y: number;
  speed: number;
  trailLength: number;
  chars: string[];
  lastUpdate: number;
  updateInterval: number;
}

export default function MatrixRainCanvas({ onComplete, isVisible, revealName }: MatrixRainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [showSkip, setShowSkip] = useState(false);
  const phaseRef = useRef<'rain' | 'name' | 'countdown' | 'explode' | 'done'>('rain');
  const countdownRef = useRef(3);
  const startTimeRef = useRef(0);
  const columnsRef = useRef<RainColumn[]>([]);
  const explodeStartRef = useRef(0);
  const nameCharsRef = useRef<{ final: string; display: string; lockAt: number }[]>([]);

  const skipIntro = useCallback(() => {
    phaseRef.current = 'done';
    cancelAnimationFrame(animationRef.current);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDenseColumns();
      setupNameDecode();
    };

    // DENSE RAIN: Column width ~16px -> 80-120 columns on desktop
    const fontSize = Math.max(14, Math.min(18, Math.floor(width / 75)));

    // "Decode" reveal for the recipient's name: each letter starts as a
    // random glyph and locks into place left-to-right over the name phase.
    // Rendered as normal crisp canvas text (not sampled from the sparse
    // rain-column grid), so it stays legible at any viewport width —
    // a coarse per-column pixel mask (like the countdown digits use) has
    // nowhere near enough columns to spell out a full name on a phone.
    const nameHoldDuration = revealName ? 2.2 : 0;
    const setupNameDecode = () => {
      if (!revealName) {
        nameCharsRef.current = [];
        return;
      }
      const len = revealName.length;
      nameCharsRef.current = revealName.split('').map((ch, i) => ({
        final: ch,
        display: ch === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)],
        // Stagger lock times across ~70% of the name-phase duration, in
        // reading order, so the name visibly assembles left to right.
        lockAt: 1.8 + (nameHoldDuration * 0.7 * (i + 1)) / len,
      }));
    };

    const initDenseColumns = () => {
      const colSpacing = fontSize + 2;
      const colCount = Math.ceil(width / colSpacing);
      const cols: RainColumn[] = [];

      for (let i = 0; i < colCount; i++) {
        const trailLength = Math.floor(14 + Math.random() * 16); // 14 to 30 characters
        cols.push({
          x: i * colSpacing,
          y: Math.random() * -height,
          speed: 3 + Math.random() * 5,
          trailLength,
          chars: Array.from({ length: trailLength }, () =>
            CHARS[Math.floor(Math.random() * CHARS.length)]
          ),
          lastUpdate: performance.now(),
          updateInterval: 50 + Math.random() * 90, // Varied flickers
        });
      }
      columnsRef.current = cols;
    };

    resize();
    window.addEventListener('resize', resize);

    startTimeRef.current = performance.now();
    phaseRef.current = 'rain';
    countdownRef.current = 3;

    // Check if point falls inside large highlighted countdown number
    const isInsideMask = (px: number, py: number): boolean => {
      const num = countdownRef.current;
      const mask = NUMBER_MASKS[num];
      if (!mask) return false;

      const maskCols = 7;
      const maskRows = 9;
      // Big size: 40-45% of viewport height
      const targetH = Math.min(height * 0.45, 420);
      const cellH = targetH / maskRows;
      const cellW = cellH * 0.85;

      const totalW = maskCols * cellW;
      const startX = (width - totalW) / 2;
      const startY = (height - targetH) / 2;

      const c = Math.floor((px - startX) / cellW);
      const r = Math.floor((py - startY) / cellH);

      if (c < 0 || c >= maskCols || r < 0 || r >= maskRows) return false;
      return mask[r][c] === 1;
    };

    const draw = (timestamp: number) => {
      if (phaseRef.current === 'done') return;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      // Dark fade trail background
      ctx.fillStyle = 'rgba(8, 8, 17, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // Phase transitions: Rain -> Name reveal -> Countdown
      if (elapsed > 1.8 && phaseRef.current === 'rain') {
        phaseRef.current = revealName ? 'name' : 'countdown';
      }
      if (phaseRef.current === 'name' && elapsed > 1.8 + nameHoldDuration) {
        phaseRef.current = 'countdown';
      }

      if (phaseRef.current === 'countdown') {
        const cElapsed = elapsed - 1.8 - nameHoldDuration;
        if (cElapsed < 1.1) countdownRef.current = 3;
        else if (cElapsed < 2.2) countdownRef.current = 2;
        else if (cElapsed < 3.3) countdownRef.current = 1;
        else {
          phaseRef.current = 'explode';
          explodeStartRef.current = timestamp;
        }
      }

      if (phaseRef.current === 'rain' || phaseRef.current === 'name' || phaseRef.current === 'countdown') {
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.textAlign = 'center';

        columnsRef.current.forEach((col) => {
          col.y += col.speed;

          // Reset column
          if (col.y - col.trailLength * fontSize > height) {
            col.y = -fontSize * (2 + Math.random() * 8);
            col.speed = 3 + Math.random() * 5;
          }

          // Random character mutation
          if (timestamp - col.lastUpdate > col.updateInterval) {
            const idx = Math.floor(Math.random() * col.chars.length);
            col.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
            col.lastUpdate = timestamp;
          }

          // Draw trail
          for (let j = 0; j < col.trailLength; j++) {
            const charY = col.y - j * fontSize;
            if (charY < -fontSize || charY > height + fontSize) continue;

            const inMask = phaseRef.current === 'countdown' && isInsideMask(col.x, charY);

            if (inMask) {
              // Highlighted number particles — bright, electric, solid white/pink glow
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ff2e88';
              ctx.shadowBlur = 14;
              ctx.fillText(col.chars[j], col.x, charY);
              ctx.fillStyle = PINK_BASE;
              ctx.fillText(col.chars[j], col.x, charY);
            } else {
              ctx.shadowBlur = 0;
              if (j === 0) {
                // Leading head character: glowing white/pink
                ctx.fillStyle = PINK_HEAD;
                ctx.shadowColor = PINK_GLOW;
                ctx.shadowBlur = 8;
              } else {
                // Trail: smooth fade
                const alpha = Math.max(0.08, 1 - j / col.trailLength);
                ctx.fillStyle = `rgba(255, 46, 136, ${alpha * 0.85})`;
                ctx.shadowBlur = 0;
              }
              ctx.fillText(col.chars[j], col.x, charY);
            }
          }
          ctx.shadowBlur = 0;
        });
      }

      // Name decode overlay: crisp, glowing, always-legible text drawn on
      // top of the rain — each letter cycles through random glyphs until
      // its lock time passes, then settles into place left to right.
      if (phaseRef.current === 'name' && nameCharsRef.current.length > 0) {
        const nameElapsed = elapsed;
        const chars = nameCharsRef.current;

        let nameFontSize = Math.min(height * 0.16, 92);
        ctx.font = `900 ${nameFontSize}px monospace`;
        const buildDisplay = () =>
          chars
            .map((c) => {
              if (nameElapsed >= c.lockAt || c.final === ' ') return c.final;
              if (Math.random() < 0.35) c.display = CHARS[Math.floor(Math.random() * CHARS.length)];
              return c.display;
            })
            .join('');

        const fullText = buildDisplay();
        let textWidth = ctx.measureText(fullText).width;
        const maxWidth = width * 0.86;
        if (textWidth > maxWidth) {
          nameFontSize *= maxWidth / textWidth;
          ctx.font = `900 ${nameFontSize}px monospace`;
          textWidth = ctx.measureText(fullText).width;
        }

        // Fade + rise in as the phase starts, settle, then hold.
        const phaseElapsed = nameElapsed - 1.8;
        const inProgress = Math.min(phaseElapsed / 0.5, 1);
        const yOffset = (1 - inProgress) * 24;
        const alpha = inProgress;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff2e88';
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(fullText, width / 2, height / 2 + yOffset);
        ctx.shadowBlur = 0;
        ctx.fillStyle = PINK_BASE;
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillText(fullText, width / 2, height / 2 + yOffset);
        ctx.restore();
      }

      // Explosion phase — particles blast outward from center
      if (phaseRef.current === 'explode') {
        const expElapsed = (timestamp - explodeStartRef.current) / 1000;
        const progress = Math.min(expElapsed / 0.7, 1);

        ctx.fillStyle = `rgba(8, 8, 17, ${0.1 + progress * 0.35})`;
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;

        ctx.font = `bold ${fontSize}px monospace`;

        columnsRef.current.forEach((col) => {
          const dx = col.x - centerX;
          const dy = col.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const pushX = (dx / dist) * progress * 700;
          const pushY = (dy / dist) * progress * 700;

          const alpha = Math.max(0, 1 - progress);
          ctx.fillStyle = `rgba(255, 46, 136, ${alpha})`;
          ctx.shadowColor = '#ff2e88';
          ctx.shadowBlur = 10 * (1 - progress);

          for (let j = 0; j < Math.min(6, col.chars.length); j++) {
            ctx.fillText(col.chars[j], col.x + pushX, col.y - j * fontSize + pushY);
          }
        });

        if (progress >= 1) {
          ctx.fillStyle = '#080811';
          ctx.fillRect(0, 0, width, height);
          phaseRef.current = 'done';
          setTimeout(onComplete, 250);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isVisible, onComplete, revealName]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#080811]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {showSkip && (
        <button
          onClick={skipIntro}
          className="absolute bottom-8 right-8 z-30 px-5 py-2.5 text-xs tracking-wider uppercase rounded-full
                     bg-white/10 text-white/80 backdrop-blur-md border border-white/20
                     hover:bg-white/25 hover:text-white transition-all duration-300 shadow-xl"
        >
          Lewati Intro →
        </button>
      )}
    </div>
  );
}
