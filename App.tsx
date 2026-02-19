
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Invitees from './pages/Invitees';
import Attendees from './pages/Attendees';
import LivePreview from './pages/LivePreview';
import PublicInvite from './pages/PublicInvite';
import Login from './pages/Login';
import { useStore } from './store/useStore';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const { isAuthenticated, initializeData } = useStore();
  const location = useLocation();

  useEffect(() => {
    // Initial data load for demo/mock purposes
    initializeData();
  }, [initializeData]);

  const isPublicRoute = location.pathname.startsWith('/invite/');

  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/invite/:slug" element={<PublicInvite />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff5f7] flex">
      {isAuthenticated && <Sidebar />}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${isAuthenticated ? 'md:ml-64' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/invitees" 
              element={isAuthenticated ? <Invitees /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/check-in" 
              element={isAuthenticated ? <Attendees /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/design" 
              element={isAuthenticated ? <LivePreview /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
