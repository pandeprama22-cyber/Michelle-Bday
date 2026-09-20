'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import StarfieldCanvas from '@/app/components/effects/StarfieldCanvas';
import { siteContent, type MemoryPhoto } from '@/config/content';
import { SparkleIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '@/app/components/ui/Icons';

interface GalaxyGalleryProps {
  isVisible: boolean;
}

// ------------------------------------------------------------------
// Internal data structures for the orbit rings (kept in refs, not
// React state, so the animation loop never triggers a re-render).
// ------------------------------------------------------------------
interface RingItem {
  photo: MemoryPhoto;
  flatIndex: number;
  baseAngle: number; // degrees, static position on the ring
  counterEl: HTMLDivElement | null;
}

interface RingData {
  radius: number;
  size: number;
  speedDegPerSec: number; // signed: + clockwise, - counter-clockwise
  angle: number; // current dynamic rotation of the whole ring
  wrapperEl: HTMLDivElement | null;
  items: RingItem[];
}

// Split the flat photo list into 3 rings (inner/mid/outer)
function buildRings(
  photos: MemoryPhoto[],
  radii: [number, number, number],
  sizes: [number, number, number],
  speeds: [number, number, number]
): RingData[] {
  const total = photos.length;
  const innerCount = Math.max(4, Math.round(total * 0.3));
  const midCount = Math.max(4, Math.round(total * 0.35));
  const outerCount = Math.max(4, total - innerCount - midCount);

  const slices = [
    photos.slice(0, innerCount),
    photos.slice(innerCount, innerCount + midCount),
    photos.slice(innerCount + midCount, innerCount + midCount + outerCount),
  ];

  return slices.map((slice, ringIdx) => {
    const items: RingItem[] = slice.map((photo, i) => {
      const flatIndex = photos.indexOf(photo);
      const baseAngle = (i / Math.max(slice.length, 1)) * 360 + ringIdx * 22; // offset rings so photos don't align radially
      return { photo, flatIndex, baseAngle, counterEl: null };
    });

    return {
      radius: radii[ringIdx],
      size: sizes[ringIdx],
      speedDegPerSec: speeds[ringIdx],
      angle: Math.random() * 360,
      wrapperEl: null,
      items,
    };
  });
}

// ------------------------------------------------------------------
// Shooting stars: occasional streaks across the galaxy background
// ------------------------------------------------------------------
function useShootingStars(isVisible: boolean) {
  const [stars, setStars] = useState<{ id: number; top: string; left: string }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      const id = idRef.current++;
      const top = `${5 + Math.random() * 40}%`;
      const left = `${40 + Math.random() * 55}%`;
      setStars((prev) => [...prev, { id, top, left }]);
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, 1300);
    }, 2600 + Math.random() * 2200);

    return () => clearInterval(interval);
  }, [isVisible]);

  return stars;
}

export default function GalaxyGallery({ isVisible }: GalaxyGalleryProps) {
  const photos = siteContent.galaxyPhotos;
  const total = photos.length;

  const [windowDim, setWindowDim] = useState({ w: 1000, h: 800 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const onResize = () => setWindowDim({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ---- Responsive geometry (matches Addendum 1 minimum-size rules) ----
  const { radii, sizes, coreSize } = useMemo(() => {
    const isMobile = windowDim.w < 640;
    const minDim = Math.min(windowDim.w, windowDim.h);

    const radii: [number, number, number] = isMobile
      ? [windowDim.w * 0.24, windowDim.w * 0.37, windowDim.w * 0.47]
      : [minDim * 0.16, minDim * 0.255, minDim * 0.35];

    const sizes: [number, number, number] = isMobile ? [100, 78, 58] : [148, 114, 88];

    const coreSize = isMobile ? 118 : 156;

    return { radii, sizes, coreSize };
  }, [windowDim]);

  // Ring speeds: inner fast CW, mid slower CCW, outer slowest CW
  const speeds: [number, number, number] = [4.5, -2.6, 1.4];

  // Rebuilt only when the photo list or responsive geometry changes.
  // Each ring/item object is mutated imperatively (angle, wrapperEl,
  // counterEl) by the animation loop below — this is intentional and
  // avoids a re-render on every animation frame.
  const rings = useMemo(
    () => buildRings(photos, radii, sizes, speeds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [photos, radii, sizes]
  );

  const isDraggingRef = useRef(false);
  const lastPointerAngleRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const getAngleFromEvent = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDraggingRef.current = true;
      lastPointerAngleRef.current = getAngleFromEvent(e.clientX, e.clientY);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [getAngleFromEvent]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const currentAngle = getAngleFromEvent(e.clientX, e.clientY);
      let delta = currentAngle - lastPointerAngleRef.current;
      // handle wrap-around at +/-180
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      rings.forEach((ring) => {
        ring.angle += delta;
      });
      lastPointerAngleRef.current = currentAngle;
    },
    [getAngleFromEvent, rings]
  );

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // ---- Main animation loop: direct DOM transform updates (no re-render) ----
  useEffect(() => {
    if (!isVisible) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (!isDraggingRef.current) {
        rings.forEach((ring) => {
          ring.angle += ring.speedDegPerSec * dt;
        });
      }

      rings.forEach((ring) => {
        if (ring.wrapperEl) {
          ring.wrapperEl.style.transform = `rotate(${ring.angle}deg)`;
        }
        ring.items.forEach((item) => {
          if (item.counterEl) {
            item.counterEl.style.transform = `rotate(${-(item.baseAngle + ring.angle)}deg)`;
          }
        });
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, rings]);

  const shootingStars = useShootingStars(isVisible);

  const openLightbox = (flatIndex: number) => setSelectedIndex(flatIndex);
  const closeLightbox = () => setSelectedIndex(null);
  const goNext = useCallback(() => {
    setSelectedIndex((cur) => (cur === null ? null : (cur + 1) % total));
  }, [total]);
  const goPrev = useCallback(() => {
    setSelectedIndex((cur) => (cur === null ? null : (cur - 1 + total) % total));
  }, [total]);

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIndex, goNext, goPrev]);

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #150425 0%, var(--color-navy-deep) 70%)' }}
    >
      {/* Dense starfield base */}
      <StarfieldCanvas isVisible={isVisible} starCount={320} parallaxEnabled={true} showNebula={false} />

      {/* Drifting nebula clouds */}
      <div
        className="galaxy-nebula-a absolute top-[10%] left-[8%] w-[38rem] h-[38rem] rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(180,40,150,0.5) 0%, transparent 70%)' }}
      />
      <div
        className="galaxy-nebula-b absolute bottom-[8%] right-[10%] w-[34rem] h-[34rem] rounded-full blur-[120px] pointer-events-none opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(80,60,220,0.45) 0%, transparent 70%)' }}
      />

      {/* Shooting stars */}
      {shootingStars.map((s) => (
        <span
          key={s.id}
          className="galaxy-shooting-star"
          style={{ top: s.top, left: s.left, animation: 'shooting-star 1.2s ease-out forwards' }}
        />
      ))}

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-4 max-w-xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-xs uppercase tracking-widest text-pink-neon font-semibold">
          Klimaks: Alam Semesta Kita
        </span>
        <h2
          className="text-section-grand text-cream mt-1 drop-shadow-[0_0_25px_rgba(255,46,136,0.6)]"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          {siteContent.galaxyTitle}
        </h2>
        <p
          className="text-sm text-pink-soft/80 italic mt-1"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {siteContent.galaxySubtitle}
        </p>
      </motion.div>

      {/* GALAXY ORBIT CONTAINER — 90vw wide, 70vh tall, draggable */}
      <div
        ref={containerRef}
        className="relative z-10 w-[92vw] max-w-4xl h-[70vh] min-h-[520px] max-h-[760px] touch-none cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Core glowing photo — the sun of the galaxy */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden galaxy-core-photo border-4 border-[#ffe3f0] z-20 pointer-events-none"
          style={{ width: coreSize, height: coreSize }}
        >
          <Image
            src={siteContent.galaxyCorePhoto}
            alt={`${siteContent.partnerName} & ${siteContent.senderName}`}
            fill
            className="object-cover"
            sizes="160px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* Orbit rings — pointer-events-none on the wrapper so its
            invisible full-size box never blocks clicks on photos
            belonging to a different ring stacked behind it. */}
        {rings.map((ring, ringIdx) => (
          <div
            key={ringIdx}
            ref={(el) => {
              ring.wrapperEl = el;
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {ring.items.map((item) => (
              <div
                key={item.photo.id}
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{ transform: `rotate(${item.baseAngle}deg) translateX(${ring.radius}px)` }}
              >
                <div
                  ref={(el) => {
                    item.counterEl = el;
                  }}
                  className="absolute"
                  style={{ transform: `rotate(${-item.baseAngle}deg)` }}
                >
                  <button
                    type="button"
                    onClick={() => openLightbox(item.flatIndex)}
                    className="galaxy-orbit-frame pointer-events-auto relative -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden border-2 border-white/70 hover:scale-110 active:scale-95 transition-transform"
                    style={{ width: ring.size, height: ring.size }}
                    aria-label={item.photo.caption}
                  >
                    <Image
                      src={item.photo.src}
                      alt={item.photo.caption}
                      fill
                      sizes={`${ring.size}px`}
                      className="object-cover pointer-events-none"
                      loading="lazy"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Prompt */}
      <motion.p
        className="relative z-10 text-xs sm:text-sm text-pink-soft/80 mt-6 tracking-widest uppercase flex items-center gap-2 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        <span className="flex items-center gap-1.5"><SparkleIcon className="w-3.5 h-3.5 text-pink-neon" /> Seret untuk memutar galaksi &bull; Sentuh bintang untuk membuka kenangan</span>
      </motion.p>

      {/* ---------------- LIGHTBOX ---------------- */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative w-full max-w-md flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md"
                aria-label="Tutup"
              >
                <CloseIcon className="w-4 h-4" />
              </button>

              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,46,136,0.4)] border-2 border-white/20">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.caption}
                  fill
                  sizes="420px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-5 text-center px-2">
                <p
                  className="text-lg sm:text-xl text-cream leading-snug"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {selectedPhoto.caption}
                </p>
                {(selectedPhoto.date || selectedPhoto.location) && (
                  <p className="text-xs uppercase tracking-widest text-pink-soft/80 mt-2">
                    {[selectedPhoto.date, selectedPhoto.location].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6 mt-6">
                <button
                  onClick={goPrev}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md active:scale-90 transition-all"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="text-xs text-cream/60 font-mono">
                  {(selectedIndex ?? 0) + 1} / {total}
                </span>
                <button
                  onClick={goNext}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md active:scale-90 transition-all"
                  aria-label="Berikutnya"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
