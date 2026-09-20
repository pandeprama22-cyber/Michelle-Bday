'use client';

import { useEffect, useRef } from 'react';

interface HeartParticlesProps {
  isVisible: boolean;
  className?: string;
  count?: number;
  color?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  driftSpeed: number;
  phase: number;
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  const topY = y - size * 0.4;
  ctx.moveTo(x, y + size * 0.3);
  // Left curve
  ctx.bezierCurveTo(
    x - size * 0.5, y,
    x - size * 0.5, topY,
    x, topY + size * 0.15
  );
  // Right curve
  ctx.bezierCurveTo(
    x + size * 0.5, topY,
    x + size * 0.5, y,
    x, y + size * 0.3
  );
  ctx.closePath();
}

export default function HeartParticles({
  isVisible,
  className = '',
  count = 25,
  color = '#ff2e88',
}: HeartParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

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
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * height * 0.5, // Start below screen
        size: 4 + Math.random() * 8,
        speed: 0.3 + Math.random() * 0.8,
        opacity: 0.15 + Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 0.5,
        driftSpeed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    initParticles();
    window.addEventListener('resize', resize);

    // Parse color to RGB
    const parseColor = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgb = parseColor(color);

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = timestamp / 1000;

      particlesRef.current.forEach((p) => {
        // Move upward
        p.y -= p.speed;
        // Gentle horizontal drift
        p.x += Math.sin(time * p.driftSpeed + p.phase) * p.drift;

        // Reset when off top
        if (p.y < -p.size * 2) {
          p.y = height + p.size * 2;
          p.x = Math.random() * width;
        }

        // Draw heart
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity})`;
        drawHeart(ctx, p.x, p.y, p.size);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isVisible, count, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
