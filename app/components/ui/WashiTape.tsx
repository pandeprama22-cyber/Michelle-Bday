'use client';

interface WashiTapeProps {
  className?: string;
  color?: string;
  rotation?: number;
}

export default function WashiTape({ className = '', color, rotation = -15 }: WashiTapeProps) {
  return (
    <div
      className={`absolute w-16 h-5 sm:w-20 sm:h-6 opacity-70 ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        background: color
          ? `repeating-linear-gradient(45deg, ${color}99, ${color}99 3px, ${color}55 3px, ${color}55 6px)`
          : undefined,
      }}
    >
      {!color && <div className="w-full h-full washi-tape rounded-sm" />}
    </div>
  );
}
