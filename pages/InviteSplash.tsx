// InviteSplash.tsx
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import background6 from '../src/background6.jpg';
import sanai from '../src/sanai.mp3';

interface Props {
  onStart: () => void;
}

const InviteSplash: React.FC<Props> = ({ onStart }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTapPrompt, setShowTapPrompt] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.muted = true;           // allowed almost always

    audio.play()
      .then(() => console.log("Muted background started (pre-unlock)"))
      .catch(e => console.log("Muted start blocked (expected on first load)", e));
  }, []);

  const unlockAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      audio.muted = false;                // unmute first
      const playPromise = audio.play();   // re-call play() after unmute

      await playPromise;                  // wait for it
      setIsPlaying(true);
      setShowTapPrompt(false);
      console.log("Audio unlocked + playing with sound!");
      return true;
    } catch (err: any) {
      console.warn("Unlock failed:", err.name, err.message);
      if (err.name === 'NotAllowedError') {
        setShowTapPrompt(true);
      }
      return false;
    }
  };

  const handleStartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent bubbling if needed

    const success = await unlockAudio();

    // Move forward anyway — user can tap later if blocked
    onStart();

    // If failed, the prompt will show on the next page (or keep it here)
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-cover bg-center bg-no-repeat touch-none"
      style={{
        backgroundImage: `url('${background6}')`,
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <audio
        ref={audioRef}
        loop
        src={sanai}
        preload="auto"
      />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-6">
          Welcome!
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 drop-shadow-md mb-8">
          You're invited to something special
        </p>

        {showTapPrompt && (
          <div className="mb-8 animate-pulse">
            <p className="text-yellow-300 text-lg font-medium">
              Tap anywhere to play traditional sanai music ♫
            </p>
          </div>
        )}

        <button
          onClick={handleStartClick}
          className="px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl font-semibold rounded-full shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 border-2 border-white/30 active:scale-95"
        >
          Let's Go →
        </button>

        {isPlaying && (
          <p className="mt-8 text-white/90 text-base">
            🎶 Sanai playing...
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default InviteSplash;