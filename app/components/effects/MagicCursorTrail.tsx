'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'heart' | 'sparkle' | 'circle';
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  'rgba(255, 46, 136, ',   // neon pink
  'rgba(255, 184, 205, ',  // soft pink
  'rgba(220, 179, 138, ',  // warm gold
  'rgba(255, 230, 200, ',  // cream sparkle
  'rgba(255, 120, 180, ',  // rose
];

export default function MagicCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    const particles: Particle[] = [];
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const addParticle = (x: number, y: number, isBurst = false, burstCount = 8) => {
      const count = isBurst ? burstCount : 1;
      const shapes: Array<'heart' | 'sparkle' | 'circle'> = ['sparkle', 'heart', 'circle'];

      for (let i = 0; i < count; i++) {
        const shape = isBurst 
          ? (Math.random() > 0.4 ? 'heart' : 'sparkle') 
          : shapes[Math.floor(Math.random() * shapes.length)];
        const colorPrefix = COLORS[Math.floor(Math.random() * COLORS.length)];
        const angle = isBurst ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * 2;
        const speed = isBurst ? 1.5 + Math.random() * 3.5 : 0.4 + Math.random() * 1.2;

        particles.push({
          x,
          y,
          size: shape === 'heart' ? 8 + Math.random() * 8 : 4 + Math.random() * 6,
          speedX: Math.cos(angle) * speed,
          speedY: isBurst ? Math.sin(angle) * speed - 1 : Math.sin(angle) * speed - 0.8,
          color: colorPrefix,
          alpha: 0.95,
          decay: isBurst ? 0.015 + Math.random() * 0.02 : 0.02 + Math.random() * 0.03,
          shape,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
        });
      }
    };

    const handlePointerMove = (e: MouseEvent | Touch) => {
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);

      if (dist > 8 || now - lastTime > 60) {
        addParticle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handlePointerMove(e.touches[0]);
    };

    const onClick = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY, true, 12);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        addParticle(e.touches[0].clientX, e.touches[0].clientY, true, 10);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    // Draw Helper for Heart Shape
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      c.save();
      c.translate(x, y);
      c.fillStyle = `${color}${alpha})`;
      c.shadowColor = `${color}0.8)`;
      c.shadowBlur = 8;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
      // bottom right curve
      c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    };

    // Draw Helper for Sparkle Shape
    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.fillStyle = `${color}${alpha})`;
      c.shadowColor = `${color}0.9)`;
      c.shadowBlur = 6;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.lineTo(size, 0);
        c.lineTo(size * 0.2, size * 0.2);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.shape === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
        } else if (p.shape === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.shadowColor = `${p.color}0.8)`;
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onTouchStart);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
