'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

interface SceneWrapperProps {
  children: (isVisible: boolean) => ReactNode;
  id: string;
  className?: string;
  background?: string;
}

export default function SceneWrapper({ children, id, className = '', background }: SceneWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={{ background }}
    >
      {children(isVisible)}
    </section>
  );
}
