'use client';

import MatrixRainCanvas from '@/app/components/effects/MatrixRainCanvas';
import { siteContent } from '@/config/content';

interface IntroRainProps {
  onComplete: () => void;
  isVisible: boolean;
}

export default function IntroRain({ onComplete, isVisible }: IntroRainProps) {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <MatrixRainCanvas
        onComplete={onComplete}
        isVisible={isVisible}
        revealName={siteContent.partnerName}
      />
    </div>
  );
}
