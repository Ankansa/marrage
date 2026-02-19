
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock, User, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { login } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    login(username, UserRole.ADMIN);
  };

  return (
    <div className="min-h-screen royal-gradient flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center mb-10">
          <div className="w-20 h-20 bg-pink-600 rounded-3xl rotate-12 flex items-center justify-center text-white mx-auto shadow-xl shadow-pink-200 mb-6">
            <Heart size={40} fill="currentColor" className="-rotate-12" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-800">Wedding Login</h1>
          <p className="text-gray-500 mt-2">Enter credentials to manage the event</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
              <input 
                type="text"
                placeholder="Username"
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-pink-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all outline-none"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
              <input 
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-pink-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-pink-200 hover:bg-pink-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={20} />
          </button>
        </form>

        <p className="relative z-10 text-center text-gray-400 text-xs mt-8">
          Ankan ❤️ Samapika Management System
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
