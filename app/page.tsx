'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import SceneWrapper from '@/app/components/ui/SceneWrapper';
import MusicToggle from '@/app/components/ui/MusicToggle';

// Effects
import MagicCursorTrail from '@/app/components/effects/MagicCursorTrail';
import FloatingPetalsCanvas from '@/app/components/effects/FloatingPetalsCanvas';

// Scenes
import IntroRain from '@/app/components/scenes/IntroRain';
import StarfieldEnvelope from '@/app/components/scenes/StarfieldEnvelope';
import HeroTitle from '@/app/components/scenes/HeroTitle';
import LoveLetter from '@/app/components/scenes/LoveLetter';
import PolaroidGallery from '@/app/components/scenes/PolaroidGallery';
import FavoritePerson from '@/app/components/scenes/FavoritePerson';
import VinylPlayer from '@/app/components/scenes/VinylPlayer';
import GalaxyGallery from '@/app/components/scenes/GalaxyGallery';
import Outro from '@/app/components/scenes/Outro';

import { siteContent } from '@/config/content';

export default function Home() {
  const [introCompleted, setIntroCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioSeek, setAudioSeek] = useState(0);

  const soundRef = useRef<Howl | null>(null);
  const seekIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Howler sound
  useEffect(() => {
    const sound = new Howl({
      src: [siteContent.song.src],
      html5: true, // stream audio for better performance on mobile
      loop: true,
      volume: 0.8,
      preload: true,
      onload: () => {
        setAudioDuration(sound.duration());
      },
      onloaderror: (_id, err) => {
        console.warn('Audio file error:', err);
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
    });

    soundRef.current = sound;

    return () => {
      sound.unload();
      if (seekIntervalRef.current) clearInterval(seekIntervalRef.current);
    };
  }, []);

  // Update seek timer when playing
  useEffect(() => {
    if (isPlaying) {
      seekIntervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const seekVal = soundRef.current.seek();
          if (typeof seekVal === 'number') {
            setAudioSeek(seekVal);
          }
        }
      }, 500);
    } else {
      if (seekIntervalRef.current) {
        clearInterval(seekIntervalRef.current);
      }
    }
    return () => {
      if (seekIntervalRef.current) clearInterval(seekIntervalRef.current);
    };
  }, [isPlaying]);

  // Handle Envelope Open -> Trigger Audio Playback
  const handleEnvelopeOpen = useCallback(() => {
    setHasInteractedAudio(true);
    if (soundRef.current) {
      if (!soundRef.current.playing()) {
        soundRef.current.volume(0.8);
        soundRef.current.play();
      }
    }
  }, []);

  // Toggle Audio manually
  const toggleAudio = useCallback(() => {
    setHasInteractedAudio(true);
    if (!soundRef.current) return;

    if (soundRef.current.playing()) {
      soundRef.current.pause();
    } else {
      soundRef.current.volume(0.8);
      soundRef.current.play();
    }
  }, []);

  // Seek handler from vinyl slider
  const handleSeek = useCallback((ratio: number) => {
    if (!soundRef.current) return;
    const dur = soundRef.current.duration() || 180;
    const target = ratio * dur;
    soundRef.current.seek(target);
    setAudioSeek(target);
  }, []);

  // Format MM:SS helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60) || 0;
    const s = Math.floor(secs % 60) || 0;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Replay from top
  const handleReplay = useCallback(() => {
    setIntroCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-navy-deep text-cream overflow-x-hidden">
      {/* Interactive Global Magical Sparkles & Cursor Trail */}
      <MagicCursorTrail />

      {/* Floating Gentle Petals & Golden Stardust Background */}
      <FloatingPetalsCanvas />

      {/* Floating Audio Controller (shows up after envelope or intro) */}
      <MusicToggle
        isPlaying={isPlaying}
        onToggle={toggleAudio}
        visible={hasInteractedAudio || introCompleted}
      />

      {/* SCENE 1: Intro Rain */}
      {!introCompleted ? (
        <SceneWrapper id="scene-intro" className="z-50 fixed inset-0">
          {(isVisible) => (
            <IntroRain
              isVisible={isVisible}
              onComplete={() => {
                setIntroCompleted(true);
              }}
            />
          )}
        </SceneWrapper>
      ) : (
        <>
          {/* SCENE 2: Starfield + Envelope */}
          <SceneWrapper id="scene-envelope">
            {(isVisible) => (
              <StarfieldEnvelope
                isVisible={isVisible}
                onEnvelopeOpen={handleEnvelopeOpen}
              />
            )}
          </SceneWrapper>

          {/* SCENE 3: Hero Title with Realtime Love Counter */}
          <SceneWrapper id="scene-hero">
            {(isVisible) => <HeroTitle isVisible={isVisible} />}
          </SceneWrapper>

          {/* SCENE 4: Love Letter */}
          <SceneWrapper id="scene-letter">
            {(isVisible) => <LoveLetter isVisible={isVisible} />}
          </SceneWrapper>

          {/* SCENE 5: Polaroid Gallery with Lightbox Zoom */}
          <SceneWrapper id="scene-gallery">
            {(isVisible) => <PolaroidGallery isVisible={isVisible} />}
          </SceneWrapper>

          {/* SCENE 6: Favorite Person */}
          <SceneWrapper id="scene-favorite">
            {(isVisible) => <FavoritePerson isVisible={isVisible} />}
          </SceneWrapper>

          {/* SCENE 7: Vinyl Player (Best Part by Daniel Caesar ft. H.E.R.) */}
          <SceneWrapper id="scene-vinyl">
            {(isVisible) => (
              <VinylPlayer
                isVisible={isVisible}
                isPlaying={isPlaying}
                onTogglePlay={toggleAudio}
                seekProgress={audioDuration > 0 ? audioSeek / audioDuration : 0}
                onSeek={handleSeek}
                currentTimeFormatted={formatTime(audioSeek)}
                durationFormatted={formatTime(audioDuration || 240)}
              />
            )}
          </SceneWrapper>

          {/* SCENE 8: Galaksi Kenangan (rotating multi-ring photo galaxy) */}
          <SceneWrapper id="scene-galaxy">
            {(isVisible) => <GalaxyGallery isVisible={isVisible} />}
          </SceneWrapper>

          {/* SCENE 10: Outro ("Just to be with you, forever") */}
          <SceneWrapper id="scene-outro">
            {(isVisible) => <Outro isVisible={isVisible} onReplay={handleReplay} />}
          </SceneWrapper>
        </>
      )}
    </main>
  );
}
