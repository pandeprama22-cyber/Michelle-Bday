'use client';

import { useEffect, useRef } from 'react';

interface StarfieldCanvasProps {
  isVisible: boolean;
  parallaxEnabled?: boolean;
  starCount?: number;
  className?: string;
  showNebula?: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number; // 0=far (slow), 1=mid, 2=near (fast parallax)
  color: string;
}

export default function StarfieldCanvas({
  isVisible,
  parallaxEnabled = true,
  starCount = 380, // Dense starfield
  className = '',
  showNebula = true,
}: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);

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
      initStars();
    };

    const initStars = () => {
      const colors = ['#ffffff', '#ffffff', '#ffe4f0', '#ffb6d9', '#d4af8c'];
      starsRef.current = Array.from({ length: starCount }, () => {
        const rand = Math.random();
        // Majority small (1px), some medium (1.8px), rare bright stars (2.8px)
        const size = rand > 0.9 ? 2.8 : rand > 0.65 ? 1.8 : 0.9;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseOpacity: 0.35 + Math.random() * 0.65,
          twinkleSpeed: 0.8 + Math.random() * 2.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer: Math.floor(Math.random() * 3),
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / width - 0.5) * 2;
      mouseRef.current.y = (e.clientY / height - 0.5) * 2;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        mouseRef.current.x = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 25));
        mouseRef.current.y = Math.max(-1, Math.min(1, ((e.beta ?? 0) - 40) / 25));
      }
    };

    if (parallaxEnabled) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = timestamp / 1000;

      // Draw rich glowing Cosmic Nebula Clouds for deep-space atmosphere
      if (showNebula) {
        const g1 = ctx.createRadialGradient(
          width * 0.25 + mouseRef.current.x * 15,
          height * 0.3 + mouseRef.current.y * 15,
          20,
          width * 0.25,
          height * 0.3,
          Math.max(width, height) * 0.5
        );
        g1.addColorStop(0, 'rgba(180, 15, 80, 0.12)');
        g1.addColorStop(0.5, 'rgba(100, 5, 50, 0.06)');
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        const g2 = ctx.createRadialGradient(
          width * 0.75 - mouseRef.current.x * 20,
          height * 0.7 - mouseRef.current.y * 20,
          30,
          width * 0.75,
          height * 0.7,
          Math.max(width, height) * 0.55
        );
        g2.addColorStop(0, 'rgba(255, 46, 136, 0.1)');
        g2.addColorStop(0.6, 'rgba(60, 0, 40, 0.05)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
      }

      // Parallax offsets per layer
      const layerMultipliers = [6, 16, 28];

      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = Math.max(0.15, Math.min(1, star.baseOpacity * (0.6 + 0.4 * twinkle)));

        let px = 0;
        let py = 0;
        if (parallaxEnabled) {
          const m = layerMultipliers[star.layer];
          px = mouseRef.current.x * m;
          py = mouseRef.current.y * m;
        }

        const x = star.x + px;
        const y = star.y + py;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        // Extra outer glow for larger focal stars
        if (star.size > 2) {
          ctx.beginPath();
          ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 180, 220, 0.25)';
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [isVisible, parallaxEnabled, starCount, showNebula]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
