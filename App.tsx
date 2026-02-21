import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Invitees from './pages/Invitees';
import Attendees from './pages/Attendees';
import LivePreview from './pages/LivePreview';
import PublicInvite from './pages/PublicInvite';
import Login from './pages/Login';
import { useStore } from './store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import background6 from './src/background6.jpg';
import sanai from './src/sanai.mp3';  // ← audio file import

// Splash Screen Component
const InviteSplash: React.FC<{ onStart: () => void; audioRef: React.RefObject<HTMLAudioElement> }> = ({ onStart, audioRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTapPrompt, setShowTapPrompt] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.muted = true;

    audio.play()
      .then(() => console.log("Muted sanai auto-started"))
      .catch(e => console.log("Muted autoplay blocked (normal)", e));
  }, [audioRef]);

  const unlockAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      audio.muted = false;
      await audio.play();
      setIsPlaying(true);
      setShowTapPrompt(false);
      console.log("Sanai unlocked + playing with sound!");
      return true;
    } catch (err: any) {
      console.warn("Unlock failed:", err.name, err.message);
      if (err.name === 'NotAllowedError') {
        setShowTapPrompt(true);
      }
      return false;
    }
  };

  const handleStart = async () => {
    await unlockAudio();
    onStart(); // proceed even if unlock fails (fallback prompt on next page)
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
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-6">
          Welcome!
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 drop-shadow-md mb-8">
          I am inviting you
          To something very special
        </p>

        {showTapPrompt && (
          <div className="mb-8 animate-pulse">
            <p className="text-yellow-300 text-lg font-medium">
              Tap anywhere to play traditional sanai music ♫
            </p>
          </div>
        )}

        <button
          onClick={handleStart}
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

// ────────────────────────────────────────────────
//   Main App
// ────────────────────────────────────────────────
const App: React.FC = () => {
  const { isAuthenticated, initializeData } = useStore();
  const location = useLocation();

  const [showInvite, setShowInvite] = useState(false);
  const isPublicRoute = location.pathname.startsWith('/invite/');

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  if (!isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#fff5f7] flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/invitees" element={isAuthenticated ? <Invitees /> : <Navigate to="/login" />} />
              <Route path="/check-in" element={isAuthenticated ? <Attendees /> : <Navigate to="/login" />} />
              <Route path="/design" element={isAuthenticated ? <LivePreview /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  // Public invite flow
  return (
    <>
      {/* Global persistent audio element */}
      <audio
        ref={audioRef}
        loop
        src={sanai}
        preload="auto"
      />

      <AnimatePresence mode="wait">
        {!showInvite && (
          <InviteSplash onStart={() => setShowInvite(true)} audioRef={audioRef} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Routes>
              <Route
                path="/invite/:slug"
                element={<PublicInvite audioRef={audioRef} />}  // ← pass ref to PublicInvite
              />
              <Route path="*" element={<Navigate to={location.pathname} replace />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;