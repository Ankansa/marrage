
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Heart, Calendar, Clock, MapPin, Phone, MessageSquare, Check, X, Camera } from 'lucide-react';
import { useStore } from '../store/useStore';
import { RSVPStatus, FoodPreference } from '../types';

const PublicInvite: React.FC = () => {
  const { slug } = useParams();
  const { settings, addInvitee } = useStore();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [showRsvp, setShowRsvp] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    phone: '',
    familyCount: 1,
    foodPreference: FoodPreference.NON_VEG,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
  const weddingDate = new Date(`${settings.date}T${settings.time}`).getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const isPast = distance < 0;
    const absDistance = Math.abs(distance);

    setTimeLeft({
      days: Math.floor(absDistance / (1000 * 60 * 60 * 24)) * (isPast ? -1 : 1),
      hours:
        Math.floor(
          (absDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ) * (isPast ? -1 : 1),
      mins:
        Math.floor((absDistance % (1000 * 60 * 60)) / (1000 * 60)) *
        (isPast ? -1 : 1),
      secs:
        Math.floor((absDistance % (1000 * 60)) / 1000) *
        (isPast ? -1 : 1),
    });
  }, 1000);

  return () => clearInterval(timer);
}, [settings.date, settings.time]);


  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    addInvitee({
      ...rsvpForm,
      tag: 'Guest side' as any,
      rsvpStatus: RSVPStatus.CONFIRMED
    });
    setSubmitted(true);
    setTimeout(() => {
      setShowRsvp(false);
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#fff5f7] relative overflow-x-hidden">
      {/* Background Slideshow (Mock) */}
      <div className="fixed inset-0 z-0">
        <img src={settings.galleryImages[0]} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-pink-900/40 backdrop-blur-[1px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col items-center">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-screen flex flex-col items-center justify-center text-center px-6 text-white"
        >
          <div className="w-16 h-16 mb-6 flex items-center justify-center text-pink-300">
            <Heart size={48} fill="currentColor" className="animate-pulse" />
          </div>
          <p className="font-serif italic text-xl mb-4 opacity-90">Together with their families</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-8">
            {settings.groomName} <br/> 
            <span className="font-script text-pink-300 text-7xl inline-block my-4">&</span> <br/> 
            {settings.brideName}
          </h1>
          <p className="uppercase tracking-[0.3em] font-medium text-sm border-y border-white/20 py-4 w-full max-w-[300px]">
            Save The Date • {new Date(settings.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="mt-12 flex gap-4 text-xs font-bold uppercase tracking-widest">
            {['days', 'hours', 'mins', 'secs'].map(unit => (
              <div key={unit} className="flex flex-col items-center">
                <span className="text-3xl font-serif mb-1">{timeLeft[unit as keyof typeof timeLeft]}</span>
                <span className="opacity-60">{unit}</span>
              </div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 animate-bounce"
          >
            <div className="w-px h-12 bg-white/40 mx-auto" />
            <span className="text-[10px] tracking-widest uppercase mt-4 block">Scroll Down</span>
          </motion.div>
        </motion.div>

        {/* Details Section */}
        <section className="w-full bg-white px-8 py-20 rounded-t-[60px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] space-y-20">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-3xl text-pink-800">Wedding Celebration</h2>
            <p className="text-gray-500 leading-relaxed italic">
              "Love is patient, love is kind. It does not envy, it does not boast, it is not proud."
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">When</h4>
                <p className="text-gray-500">{new Date(settings.date).toDateString()}</p>
                <p className="text-gray-500">{settings.time} onwards</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Where</h4>
                <p className="text-gray-500 leading-relaxed">{settings.venue}</p>
                <a href={settings.venueMapUrl} className="text-pink-600 font-bold text-sm underline mt-2 inline-block">View on Maps</a>
              </div>
            </div>
          </div>

          {/* Contacts Panel */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-pink-800 text-center">Contact For Any Queries</h3>
            <div className="grid grid-cols-1 gap-4">
              {settings.contacts.map((contact, idx) => (
                <div key={idx} className="glass p-4 rounded-2xl flex items-center justify-between border-pink-100">
                  <div className="flex items-center gap-3">
                    <img src={contact.photo} className="w-12 h-12 rounded-full object-cover border-2 border-pink-200" alt="" />
                    <div>
                      <p className="font-bold text-gray-800">{contact.name}</p>
                      <p className="text-xs text-gray-400">{contact.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.phone}`} className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors">
                      <Phone size={18} />
                    </a>
                    <a href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`} className="p-2 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 transition-colors">
                      <MessageSquare size={18} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-10">
            <button 
              onClick={() => setShowRsvp(true)}
              className="bg-pink-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-pink-200 hover:scale-105 active:scale-95 transition-all"
            >
              Confirm Your Presence
            </button>
          </div>

          <div className="flex justify-center pt-20 pb-10 grayscale opacity-40">
            <Heart size={24} className="mx-2" />
            <Heart size={24} className="mx-2" />
            <Heart size={24} className="mx-2" />
          </div>
        </section>
      </div>

      {/* RSVP Modal */}
      <AnimatePresence>
        {showRsvp && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRsvp(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] md:rounded-[40px] p-8 shadow-2xl"
            >
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                    <Check size={40} />
                  </div>
                  <h3 className="text-2xl font-serif text-gray-800">Thank You!</h3>
                  <p className="text-gray-500">We have recorded your RSVP. See you there!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-2xl text-pink-800">RSVP</h3>
                    <button onClick={() => setShowRsvp(false)} className="text-gray-400">
                      <X size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleRsvp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                      <input 
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20"
                        placeholder="Your Name"
                        value={rsvpForm.name}
                        onChange={e => setRsvpForm({...rsvpForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                      <input 
                        required
                        type="tel"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20"
                        placeholder="Phone Number"
                        value={rsvpForm.phone}
                        onChange={e => setRsvpForm({...rsvpForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Guest Count</label>
                        <input 
                          type="number"
                          min="1"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20"
                          value={rsvpForm.familyCount}
                          onChange={e => setRsvpForm({...rsvpForm, familyCount: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Food Choice</label>
                        <select 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20"
                          value={rsvpForm.foodPreference}
                          onChange={e => setRsvpForm({...rsvpForm, foodPreference: e.target.value as FoodPreference})}
                        >
                          <option value={FoodPreference.VEG}>Veg</option>
                          <option value={FoodPreference.NON_VEG}>Non-Veg</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Message (Optional)</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20 h-24 resize-none"
                        placeholder="Write a message for the couple..."
                        value={rsvpForm.message}
                        onChange={e => setRsvpForm({...rsvpForm, message: e.target.value})}
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 mt-4"
                    >
                      Confirm RSVP
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicInvite;
