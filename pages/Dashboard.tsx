
import React, {useState} from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, CheckCircle, XCircle, UsersRound, TrendingUp, ExternalLink, Share2, Check, Copy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { stats, invitees, settings } = useStore();
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}${window.location.pathname}#/invite/${settings.slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const statCards = [
    { label: 'Total Invitees', value: stats.totalInvitees, icon: Users, color: 'bg-blue-500' },
    { label: 'Confirmed', value: stats.confirmedCount, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Declined', value: stats.declinedCount, icon: XCircle, color: 'bg-red-500' },
    { label: 'Arrived', value: stats.arrivedCount, icon: UsersRound, color: 'bg-pink-500' },
    { label: 'Total Guests', value: stats.totalGuestsExpected, icon: UserPlus, color: 'bg-amber-500' },
  ];

  const pieData = [
    { name: 'Confirmed', value: stats.confirmedCount, color: '#22c55e' },
    { name: 'Declined', value: stats.declinedCount, color: '#ef4444' },
    { name: 'Pending', value: stats.totalInvitees - (stats.confirmedCount + stats.declinedCount), color: '#94a3b8' },
  ];

  const barData = [
    { name: 'Bride Side', value: invitees.filter(i => i.tag === 'Bride side').length },
    { name: 'Groom Side', value: invitees.filter(i => i.tag === 'Groom side').length },
    { name: 'VIP', value: invitees.filter(i => i.tag === 'VIP').length },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-8"
    >
      <header>
        <h2 className="text-2xl font-serif font-bold text-gray-800">Wedding Dashboard</h2>
        <p className="text-gray-500">Real-time stats for Ankan & Samapika's wedding</p>
      </header>

      {/* Share Section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-500 p-1 rounded-3xl shadow-xl shadow-pink-200">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-[22px] flex flex-col md:flex-row items-center gap-6">
          <div className="bg-pink-100 p-4 rounded-2xl text-pink-600">
            <Share2 size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-800">Share Invitation with Guests</h3>
            <p className="text-sm text-gray-500 mb-2">Send this link to your family and friends via WhatsApp or SMS</p>
            <div className="flex items-center gap-2 bg-gray-50 p-2 pl-4 rounded-xl border border-gray-100">
              <code className="text-xs text-pink-600 font-mono flex-1 truncate">{publicUrl}</code>
              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm
                  ${copied ? 'bg-green-500 text-white' : 'bg-gray-800 text-white hover:bg-black'}`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <a 
                href={publicUrl} 
                target="_blank" 
                className="p-2 text-gray-400 hover:text-pink-600 transition-colors"
                title="Open Link"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-2xl border-l-4 border-l-pink-500 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl text-white ${stat.color} shadow-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RSVP Distribution */}
        <div className="glass p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">RSVP Distribution</h3>
            <TrendingUp size={20} className="text-pink-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tag Distribution */}
        <div className="glass p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Guest Categories</h3>
            <Users size={20} className="text-pink-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }} />
                <Bar dataKey="value" fill="#ec4899" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Mock */}
      <div className="glass p-8 rounded-3xl shadow-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Guest Sourav Ganguly checked in', time: '2 mins ago', type: 'checkin' },
            { action: 'New RSVP from Amrita Chatterjee (Confirmed)', time: '15 mins ago', type: 'rsvp' },
            { action: 'Guest Bimal Das marked as Declined', time: '1 hour ago', type: 'rsvp' },
            { action: 'Wedding settings updated by Admin', time: '3 hours ago', type: 'system' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 hover:bg-pink-50/50 rounded-xl transition-colors">
              <div className={`w-2 h-2 rounded-full ${item.type === 'checkin' ? 'bg-green-500' : item.type === 'rsvp' ? 'bg-pink-500' : 'bg-gray-400'}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium">{item.action}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
