import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Invitees from "./pages/Invitees";
import Attendees from "./pages/Attendees";
import LivePreview from "./pages/LivePreview";
import PublicInvite from "./pages/PublicInvite";
import Login from "./pages/Login";
import { useStore } from "./store/useStore";
import { AnimatePresence, motion } from "framer-motion";
import background6 from "./src/background6.jpg";
import sanai from "./src/sanai.mp3";

/* ─────────────────────────────────────────────── */
/*                SPLASH SCREEN                   */
/* ─────────────────────────────────────────────── */

const InviteSplash: React.FC<{
  onStart: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}> = ({ onStart, audioRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTapPrompt, setShowTapPrompt] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.muted = true;

    audio.play().catch(() => {
      console.log("Muted autoplay blocked (normal)");
    });
  }, [audioRef]);

  const unlockAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.muted = false;
      await audio.play();
      setIsPlaying(true);
      setShowTapPrompt(false);
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setShowTapPrompt(true);
      }
    }
  };

  const handleStart = async () => {
    await unlockAudio();
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${background6}')`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Welcome!
        </h1>

        <p className="text-xl md:text-2xl text-gray-100 mb-8">
          I am inviting you
          <br />
          To something very special
        </p>

        {showTapPrompt && (
          <p className="mb-6 text-yellow-300 animate-pulse">
            Tap to play traditional sanai music ♫
          </p>
        )}

        <button
          onClick={handleStart}
          className="px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95"
        >
          Let's Go →
        </button>

        {isPlaying && (
          <p className="mt-6 text-white/90">🎶 Sanai playing...</p>
        )}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────── */
/*                   MAIN APP                     */
/* ─────────────────────────────────────────────── */

const App: React.FC = () => {
  const { isAuthenticated, initializeData } = useStore();
  const location = useLocation();

  const [showInvite, setShowInvite] = useState(false);
  const isPublicRoute = location.pathname.startsWith("/invite/");

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  /* ─────────────── ADMIN / PRIVATE ROUTES ─────────────── */

  if (!isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#fff5f7] flex">
        {isAuthenticated && <Sidebar />}

        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            isAuthenticated ? "md:ml-64" : ""
          }`}
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              {/* ROOT → Always Public Invite */}
              <Route
                path="/"
                element={<Navigate to="/invite/default" replace />}
              />

              {/* LOGIN */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/design" replace />
                  ) : (
                    <Login />
                  )
                }
              />

              {/* DASHBOARD */}
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* INVITEES */}
              <Route
                path="/invitees"
                element={
                  isAuthenticated ? (
                    <Invitees />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* CHECK-IN */}
              <Route
                path="/check-in"
                element={
                  isAuthenticated ? (
                    <Attendees />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* DESIGN / LIVE PREVIEW */}
              <Route
                path="/design"
                element={
                  isAuthenticated ? (
                    <LivePreview />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* CATCH ALL */}
              <Route
                path="*"
                element={<Navigate to="/invite/default" replace />}
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  /* ─────────────── PUBLIC INVITE FLOW ─────────────── */

  return (
    <>
      {/* Persistent Audio */}
      <audio ref={audioRef} loop src={sanai} preload="auto" />

      <AnimatePresence mode="wait">
        {!showInvite && (
          <InviteSplash
            onStart={() => setShowInvite(true)}
            audioRef={audioRef}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route
                path="/invite/:slug"
                element={<PublicInvite audioRef={audioRef} />}
              />

              <Route
                path="*"
                element={<Navigate to="/invite/default" replace />}
              />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;