
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserCheck, QrCode, LogIn, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const Attendees: React.FC = () => {
  const { invitees, checkIn, stats } = useStore();
  const [query, setQuery] = useState('');

  const searchResults = query.trim() 
    ? invitees.filter(inv => 
        inv.name.toLowerCase().includes(query.toLowerCase()) || 
        inv.phone.includes(query)
      )
    : [];

  return (
    <div className="p-6 space-y-8">
      <header>
        <h2 className="text-2xl font-serif font-bold text-gray-800">Live Guest Check-in</h2>
        <p className="text-gray-500">Fast arrival management for the wedding reception</p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-gray-800">{stats.confirmedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50">
          <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Arrived</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-pink-600">{stats.arrivedCount}</p>
            <p className="text-sm text-gray-400">/ {stats.confirmedCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Guests Checked In</p>
          <p className="text-2xl font-bold text-gray-800">
            {invitees.filter(i => i.arrived).reduce((sum, i) => sum + i.familyCount, 0)}
          </p>
        </div>
        <div className="bg-pink-600 p-6 rounded-2xl shadow-lg shadow-pink-200 flex flex-col justify-center items-center text-white cursor-pointer hover:bg-pink-700 transition-colors">
          <QrCode size={32} />
          <p className="text-xs font-bold mt-2 uppercase tracking-widest">Scan QR Code</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <input 
            type="text"
            placeholder="Search by name or phone to check-in..."
            className="w-full pl-14 pr-6 py-5 bg-white shadow-xl border-2 border-transparent focus:border-pink-500/20 rounded-3xl text-xl outline-none transition-all placeholder:text-gray-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="space-y-3">
          {searchResults.map((guest) => (
            <motion.div
              layout
              key={guest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-5 rounded-2xl border flex items-center justify-between transition-all
                ${guest.arrived ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:border-pink-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  ${guest.arrived ? 'bg-green-200 text-green-700' : 'bg-pink-100 text-pink-700'}`}>
                  {guest.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{guest.name}</h4>
                  <p className="text-sm text-gray-500">{guest.familyCount} People • {guest.tag}</p>
                </div>
              </div>

              {guest.arrived ? (
                <div className="flex items-center gap-2 text-green-600 font-bold bg-white px-4 py-2 rounded-xl shadow-sm">
                  <CheckCircle2 size={20} />
                  <span>Arrived</span>
                </div>
              ) : (
                <button
                  onClick={() => checkIn(guest.id)}
                  className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-700 transition-all shadow-md shadow-pink-100"
                >
                  <LogIn size={20} />
                  <span>Check In</span>
                </button>
              )}
            </motion.div>
          ))}
          
          {query && searchResults.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No guests found for "{query}"
            </div>
          )}
        </div>
      </div>

      {/* Recent Arrival List */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserCheck className="text-pink-500" size={20} />
          Recent Arrivals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitees.filter(i => i.arrived).slice(0, 6).map(guest => (
            <div key={guest.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                {guest.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{guest.name}</p>
                <p className="text-xs text-gray-400">{new Date(guest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded">
                +{guest.familyCount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendees;
