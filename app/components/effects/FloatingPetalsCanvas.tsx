'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'petal' | 'glimmer';
}

export default function FloatingPetalsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let petals: Petal[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const count = Math.min(28, Math.floor(window.innerWidth / 45));
      petals = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 7 + Math.random() * 9,
        speedX: -0.3 + Math.random() * 0.7,
        speedY: 0.5 + Math.random() * 0.9,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.15 + Math.random() * 0.35,
        type: Math.random() > 0.4 ? 'petal' : 'glimmer',
      }));
    };

    init();
    window.addEventListener('resize', init);

    const drawPetal = (c: CanvasRenderingContext2D, p: Petal) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.fillStyle = `rgba(255, 175, 200, ${p.opacity})`;
      c.shadowColor = 'rgba(255, 46, 136, 0.3)';
      c.shadowBlur = 4;
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size);
      c.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
      c.fill();
      c.restore();
    };

    const drawGlimmer = (c: CanvasRenderingContext2D, p: Petal) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.fillStyle = `rgba(220, 179, 138, ${p.opacity})`;
      c.shadowColor = 'rgba(220, 179, 138, 0.4)';
      c.shadowBlur = 6;
      c.beginPath();
      c.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of petals) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = canvas.width + 20;
        }

        if (p.type === 'petal') {
          drawPetal(ctx, p);
        } else {
          drawGlimmer(ctx, p);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ opacity: 0.7 }}
    />
  );
}
