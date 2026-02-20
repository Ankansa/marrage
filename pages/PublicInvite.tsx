
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Heart, Calendar, Clock, MapPin, Phone, MessageSquare, Check, X, Music, Volume2, VolumeX, Globe, Star, UtensilsCrossed } from 'lucide-react';
import { useStore } from '../store/useStore';
import { RSVPStatus, FoodPreference } from '../types';

const PublicInvite: React.FC = () => {
  const { slug } = useParams();
  const { settings, addInvitee } = useStore();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [showRsvp, setShowRsvp] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    phone: '',
    familyCount: 1,
    foodPreference: FoodPreference.NON_VEG,
    message: ''
  });

  useEffect(() => {
    const weddingDate = new Date(`${settings.date}T${settings.time}`).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.date, settings.time]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play blocked"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const rituals = [
    {
      name: "Nandimukh",
      desc: "Pre-wedding ritual seeking blessings from ancestors for a new journey.",
      time: "11:00 AM",
      date: "May 3, 2026",
      place: "Sarkar Bari Hamirhati",
      icon: "🐚",
      color: "bg-red-50",
      accent: "border-red-200"
    },
    {
      name: "Gaye Holud",
      desc: "Purification and auspicious start with turmeric paste, music, and colorful celebrations.",
      time: "01:00 PM",
      date: "May 3, 2026",
      place: "Sarkar Bari Hamirhati",
      icon: "🌼",
      color: "bg-yellow-50",
      accent: "border-yellow-200"
    },
    {
      name: "Shubho Bibaho",
      desc: "The sacred union featuring Saat Paak and Sindoor Daan.",
      time: "07:00 PM",
      date: "May 3, 2026",
      place: "Suniti Ceremonial House",
      icon: "🔥",
      color: "bg-orange-50",
      accent: "border-orange-200"
    },
    {
      name: "Preeti Bhoj",
      desc: "Social gala welcoming the bride's family with legendary Bangali cuisine.",
      time: "09:00 PM",
      date: "May 5, 2026",
      place: "Sarkar Bari Hamirhati",
      icon: "🥘",
      color: "bg-amber-50",
      accent: "border-amber-200"
    }
  ];

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Generate petals
  const petals = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${8 + Math.random() * 7}s`,
    size: Math.random() > 0.5 ? '20px' : '12px',
    color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444' // Marigold or Rose
  }));

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fffaf0] relative overflow-x-hidden selection:bg-red-200">

      {/* Background Audio */}
      <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

      {/* Floating Petals */}
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50% 0 50% 50%',
            opacity: 0.6
          }}
        />
      ))}

      {/* Floating Music Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-[110] w-12 h-12 rounded-full crimson-gradient text-white flex items-center justify-center shadow-2xl border-2 border-white/40"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>

      {/* Floating Background Alponas */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <motion.img
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          src="https://cdn-icons-png.flaticon.com/512/10452/10452601.png"
          className="absolute -top-20 -left-20 w-96 h-96 grayscale opacity-20"
        />
        <motion.img
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          src="https://cdn-icons-png.flaticon.com/512/10452/10452601.png"
          className="absolute -bottom-20 -right-20 w-80 h-80 grayscale opacity-20"
        />
      </div>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <img
            src={settings.galleryImages[0]}
            className="w-full h-full object-cover"
            alt="Wedding Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <p className="font-bengali text-2xl text-yellow-400 mb-2 tracking-[0.4em] drop-shadow-md">শুভ বিবাহ</p>
            <div className="w-24 h-px bg-yellow-400 mx-auto mb-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-serif text-7xl md:text-9xl text-white font-bold leading-tight"
          >
            {settings.groomName} <br />
            <span className="font-script gold-text text-8xl md:text-[10rem] block my-6 drop-shadow-lg">&</span>
            {settings.brideName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 inline-block px-10 py-4 border-2 border-yellow-400/40 backdrop-blur-md rounded-full text-white tracking-[0.4em] font-medium text-sm"
          >
            {new Date(settings.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </motion.div>

          <div className="mt-16 flex justify-center gap-10 text-white">
            {Object.entries(timeLeft).map(([unit, value], i) => (
              <motion.div
                key={unit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (i * 0.1) }}
                className="flex flex-col items-center"
              >
                <span className="text-5xl font-serif mb-1 gold-text">{value}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-80">{unit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Explore the Traditions</span>
          <div className="w-px h-16 bg-gradient-to-b from-yellow-400 to-transparent" />
        </motion.div>
      </section>

      {/* Welcome Message */}
      <section className="py-10 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10 grayscale">
          <img src="https://cdn-icons-png.flaticon.com/512/10452/10452601.png" alt="" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div className="text-red-700 font-bengali text-4xl mb-4 tracking-widest">স্বাগতম</div>
          <h2 className="font-serif text-5xl md:text-6xl text-gray-800">You're Cordially Invited</h2>
          <p className="text-xl md:text-2xl text-gray-600 font-serif italic leading-relaxed max-w-2xl mx-auto">

            সানন্দ প্রজ্ঞাপনে জানাইতেছি যে, আমাদের গৃহে এক শুভমঙ্গলময় পরিণয়-উৎসব সমাগত।
            আমার পুত্র <b>অঙ্কন</b> -এর সহিত <b>স্বর্গীয় শ্রী রামদাস সরকার এবং কাকুলি সরকারের </b>স্নেহকন্যা <b>সমাপিকা</b>-র শুভ বিবাহ অনুষ্ঠান আগামী <b>৩রা মে, ২০২৬</b> তারিখ এবং আগামী <b>৫ই মে, ২০২৬</b> তারিখে প্রীতিভোজ অনুষ্ঠিত হইবে।

            উক্ত পুণ্যময় ও মঙ্গলঘন অনুষ্ঠানে আপনাকে ও আপনার সপরিবারে সস্নেহ সাদর উপস্থিত থাকার জন্য বিনীত নিমন্ত্রণ জানাইতেছি। আপনাদের শুভাশীষ ও সৌজন্যমণ্ডিত উপস্থিতি নবদম্পতির ভবিষ্যৎ জীবনপথকে করিবে শ্রীবৃদ্ধি, সৌভাগ্য ও কল্যাণময়।
          </p>
          <p className="text-xl md:text-2xl text-gray-600 font-serif italic leading-relaxed max-w-2xl mx-auto">
            It is with great pleasure that I announce an auspicious and joyous matrimonial celebration in our household.

            The sacred marriage ceremony of my son <b>Ankan</b>, with <b>Samapika</b>, beloved daughter of <b>Late Shri Ramdas Sarkar and Smt. Kakuli Sarkar</b>, shall be solemnized on <b>3rd May, 2026</b>. The Reception (Preetibhoj) shall be held on 5th May, 2026.

            On this holy and blissful occasion, I cordially and respectfully invite you and your esteemed family to grace the ceremony with your gracious presence. Your blessings and noble attendance shall greatly enrich the future journey of the newly wedded couple with prosperity, fortune, and happiness.</p>
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map(i => <Star key={i} size={16} className="text-yellow-500" fill="currentColor" />)}
          </div>
        </motion.div>
      </section>

      <section className="py-5 bg-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 alpona-bg pointer-events-none opacity-5" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <img src="https://cdn-icons-png.flaticon.com/512/10452/10452601.png" className="w-24 h-24 mx-auto mb-6 opacity-30 grayscale" alt="" />
            <h3 className="font-bengali text-7xl text-red-900 mb-6">পরিচিতি</h3>
            <div className="w-32 h-1 bg-red-900 mx-auto" />
            <p className="text-stone-500 font-serif italic text-2xl mt-8">Introducing our beloved families uniting for a new journey.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Groom Side */}
            <div className="space-y-16">
              <h4 className="font-serif text-4xl text-center text-amber-800 pb-6 border-b-2 border-amber-100 italic font-bold">Boro-Pokkho (Groom's Family)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                {settings.familyMembers.filter(m => m.side === 'Groom').map((member, i) => (
                  <motion.div whileHover={{ y: -12 }} key={i} className="flex flex-col items-center text-center">
                    <div className="w-36 h-36 rounded-full border-4 border-amber-300 p-1 mb-8 shadow-2xl bg-white overflow-hidden ring-8 ring-amber-50">
                      <img src={member.photo} className="w-full h-full object-cover rounded-full" alt={member.name} />
                    </div>
                    <h5 className="font-bold text-stone-900 text-xl leading-tight">{member.name}</h5>
                    <p className="text-[12px] text-amber-700 font-bold uppercase tracking-widest mt-3 px-3 py-1 bg-amber-50 rounded-full">{member.relation}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bride Side */}
            <div className="space-y-16">
              <h4 className="font-serif text-4xl text-center text-pink-800 pb-6 border-b-2 border-pink-100 italic font-bold">Kony-Pokkho (Bride's Family)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                {settings.familyMembers.filter(m => m.side === 'Bride').map((member, i) => (
                  <motion.div whileHover={{ y: -12 }} key={i} className="flex flex-col items-center text-center">
                    <div className="w-36 h-36 rounded-full border-4 border-pink-300 p-1 mb-8 shadow-2xl bg-white overflow-hidden ring-8 ring-pink-50">
                      <img src={member.photo} className="w-full h-full object-cover rounded-full" alt={member.name} />
                    </div>
                    <h5 className="font-bold text-stone-900 text-xl leading-tight">{member.name}</h5>
                    <p className="text-[12px] text-pink-700 font-bold uppercase tracking-widest mt-3 px-3 py-1 bg-pink-50 rounded-full">{member.relation}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rituals Timeline */}
      <section className="py-24 px-4 bg-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 alpona-bg pointer-events-none" />
        <h3 className="font-serif text-4xl text-center text-gray-800 mb-20">Rituals of Grace</h3>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rituals.map((ritual, idx) => (
            <motion.div
              key={ritual.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`ritual-card p-10 rounded-[3rem] ${ritual.color} border-2 ${ritual.accent} shadow-xl flex flex-col items-center text-center group`}
            >
              <div className="text-6xl mb-8 floating group-hover:scale-110 transition-transform">{ritual.icon}</div>
              <h4 className="font-serif text-2xl text-gray-900 mb-2 font-bold">{ritual.name}</h4>
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em]">{ritual.time}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{ritual.date}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{ritual.desc}</p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <MapPin size={12} className="text-red-400" />
                {ritual.place}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Venue */}
      <section className="py-40 bg-stone-900 text-white relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px]" />

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="inline-block p-5 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10">
              <MapPin size={40} className="text-yellow-500" />
            </div>
            <h3 className="font-serif text-5xl md:text-6xl">The Grand Venue</h3>
            <p className="text-2xl text-stone-400 font-serif italic leading-relaxed">
              {settings.venue} A place where our love story will unfold amidst the blessings of our loved ones.
            </p>
            <div className="flex items-center gap-4 text-stone-500">
              <Clock size={24} className="text-yellow-500" />
              <span className="text-xl font-medium tracking-wide">{settings.time} Onwards</span>
            </div>
            <div className="flex items-center gap-4 text-stone-500">
              <Calendar size={24} className="text-yellow-500" />
              <span className="text-xl font-medium tracking-wide">{settings.date}</span>
            </div>

            <div className="flex flex-wrap gap-6">
              <a
                href={settings.venueMapUrl}
                target="_blank"
                className="inline-flex items-center gap-4 crimson-gradient text-white px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-red-900/40"
              >
                Navigate to {settings.venue} <MapPin size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[550px] rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white/5 group"
          >
            {settings.venueEmbedHtml ? (
              <div className="w-full h-full relative flex flex-col">

                {/* Street View / Main Embed */}
                <div
                  className="w-full h-1/2 grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
                  dangerouslySetInnerHTML={{ __html: settings.venueEmbedHtml }}
                />

                {/* Additional Google Embed Below */}
                <div className="w-full h-1/2 border-t border-white/10">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!4v1771545808420!6m8!1m7!1sO5LAOe53Ad6dxnI4lIF0NQ!2m2!1d23.32824631436691!2d87.35279235053112!3f290.4325350577791!4f18.150127649554562!5f0.7820865974627469"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* 360 Badge */}
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-6 py-2 rounded-full flex items-center gap-3 border border-white/10 shadow-2xl">
                  <Globe size={18} className="text-yellow-400 animate-spin-slow" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                    360° Interactive Experience
                  </span>
                </div>

              </div>
            ) : (
              <img src="https://images.unsplash.com/photo-1544101496-5f71696e73c2?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Venue" />
            )}
          </motion.div>
        </div>
      </section>

      {/* Bhoj (Culinary) Section */}
      <section className="py-32 px-6 bg-white relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <UtensilsCrossed size={48} className="mx-auto text-red-700 opacity-20" />
          <h3 className="font-serif text-4xl text-gray-800">A Taste of Tradition</h3>
          <p className="text-gray-500 font-serif italic text-lg leading-relaxed">
            Experience a handpicked menu of authentic Bangali delicacies at the Preeti Bhoj, carefully prepared to celebrate our heritage.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Coming ..', 'On Pritivoj', '05-05-2026', 'Stay Tune..'].map(dish => (
              <div key={dish} className="p-4 rounded-2xl bg-orange-50 text-orange-800 font-bold text-xs uppercase tracking-widest border border-orange-100">
                {dish}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-40 px-4 relative z-10 bg-[#fffaf0]">
        <h3 className="font-serif text-5xl text-center text-gray-800 mb-20">Love in Every Pixel</h3>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto space-y-6">
          {settings.galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
            >
              <img src={img} className="w-full object-cover" alt="Gallery" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* RSVP Sections */}
      <div className="fixed bottom-8 inset-x-0 px-8 z-[100] md:hidden">
        <button
          onClick={() => setShowRsvp(true)}
          className="w-full crimson-gradient text-white py-6 rounded-3xl font-bold text-xl shadow-2xl shadow-red-900/40 active:scale-95 transition-transform border-t border-white/20"
        >
          I'll Be There!
        </button>
      </div>

      <section className="py-48 px-6 text-center relative z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 alpona-bg pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="font-serif text-6xl text-gray-900 mb-10">Join Us To Make Our Celebration Even More Special!</h2>
          <p className="text-gray-500 mb-16 max-w-xl mx-auto text-xl font-serif italic">
            Your presence will add an irreplaceable sparkle to our celebrations. Please confirm your arrival below.
          </p>
          <button
            onClick={() => setShowRsvp(true)}
            className="hidden md:inline-flex items-center gap-4 crimson-gradient text-white px-16 py-6 rounded-[3rem] font-bold text-2xl shadow-2xl shadow-red-900/30 hover:scale-110 transition-all border-t border-white/20"
          >
            Confirm Presence <Heart size={24} fill="currentColor" />
          </button>
        </motion.div>
      </section>

      {/* RSVP Modal */}
      <AnimatePresence>
        {showRsvp && (
          <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRsvp(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-white rounded-t-[4rem] md:rounded-[4rem] p-12 shadow-2xl overflow-hidden border-t-8 border-red-700"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/10452/10452601.png" className="absolute -top-10 -right-10 w-64 h-64 opacity-5 grayscale" />

              {submitted ? (
                <div className="text-center py-24 space-y-8">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto shadow-inner"
                  >
                    <Check size={64} />
                  </motion.div>
                  <h3 className="font-serif text-5xl text-gray-900">অশেষ ধন্যবাদ!</h3>
                  <p className="text-gray-500 text-xl font-serif italic">We are truly excited to celebrate our union with you.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-12">
                    <div>
                      <h3 className="font-serif text-4xl text-gray-900">Confirmation</h3>
                      <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">Join the celebration</p>
                    </div>
                    <button onClick={() => setShowRsvp(false)} className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all">
                      <X size={28} />
                    </button>
                  </div>
                  <form onSubmit={handleRsvp} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-2">Name of the Guest</label>
                        <input required className="w-full px-8 py-5 bg-stone-50 border-none rounded-3xl focus:ring-4 focus:ring-red-700/5 transition-all outline-none font-medium" placeholder="Full name" value={rsvpForm.name} onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-2">Contact Number</label>
                        <input required type="tel" className="w-full px-8 py-5 bg-stone-50 border-none rounded-3xl focus:ring-4 focus:ring-red-700/5 transition-all outline-none font-medium" placeholder="Phone" value={rsvpForm.phone} onChange={e => setRsvpForm({ ...rsvpForm, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-2">Total Attending</label>
                        <select className="w-full px-8 py-5 bg-stone-50 border-none rounded-3xl focus:ring-4 focus:ring-red-700/5 transition-all outline-none font-medium appearance-none" value={rsvpForm.familyCount} onChange={e => setRsvpForm({ ...rsvpForm, familyCount: parseInt(e.target.value) })}>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-2">Food Palette</label>
                        <div className="flex gap-4">
                          <button type="button" onClick={() => setRsvpForm({ ...rsvpForm, foodPreference: FoodPreference.VEG })} className={`flex-1 py-5 rounded-3xl font-bold transition-all border-2 ${rsvpForm.foodPreference === FoodPreference.VEG ? 'bg-green-600 border-green-600 text-white shadow-xl' : 'bg-stone-50 border-stone-100 text-stone-400'}`}>Veg</button>
                          <button type="button" onClick={() => setRsvpForm({ ...rsvpForm, foodPreference: FoodPreference.NON_VEG })} className={`flex-1 py-5 rounded-3xl font-bold transition-all border-2 ${rsvpForm.foodPreference === FoodPreference.NON_VEG ? 'bg-red-700 border-red-700 text-white shadow-xl' : 'bg-stone-50 border-stone-100 text-stone-400'}`}>Non-Veg</button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-2">Wishes for the Couple</label>
                      <textarea className="w-full px-8 py-5 bg-stone-50 border-none rounded-3xl focus:ring-4 focus:ring-red-700/5 transition-all outline-none h-32 resize-none font-medium" placeholder="Your warm wishes..." value={rsvpForm.message} onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full crimson-gradient text-white py-6 rounded-[2.5rem] font-bold text-2xl shadow-2xl shadow-red-900/30 border-t border-white/20 active:scale-95 transition-transform">Confirm Invitation</button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-20 text-center relative z-10 border-t border-red-50 bg-white">
        <div className="font-script text-3xl text-red-700 mb-4 tracking-widest">Ankan & Samapika</div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Designing Our Tomorrow • {new Date(settings.date).getFullYear()}</p>
      </footer>
    </div>
  );
};

export default PublicInvite;
