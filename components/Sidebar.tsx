
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Palette, LogOut, Heart, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const Sidebar: React.FC = () => {
  const { logout, user } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/invitees', icon: Users, label: 'Invitees' },
    { to: '/check-in', icon: UserCheck, label: 'Attendees' },
    { to: '/design', icon: Palette, label: 'Live Preview' },
  ];

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-pink-600 text-white rounded-md md:hidden shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-2xl transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-pink-100 flex flex-col`}>
        
        <div className="p-6 flex flex-col items-center border-b border-pink-50">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 mb-3">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="font-serif text-xl font-bold text-gray-800 text-center">
            Ankan <span className="text-pink-500">&</span> Samapika
          </h1>
          <p className="text-xs text-pink-400 mt-1 uppercase tracking-widest font-semibold">Wedding Manager</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleLinkClick}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive 
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' 
                  : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-pink-50 bg-pink-50/50">
          <div className="flex items-center gap-3 px-4 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 text-xs font-bold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.username}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
