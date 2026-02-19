
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, MapPin, Calendar, Clock, Image as ImageIcon, Plus, Trash2, Copy, Check, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';

const LivePreview: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}${window.location.pathname}#/invite/${formData.slug}`;

  const handleSave = () => {
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: '', phone: '', role: '', photo: 'https://picsum.photos/seed/new/100/100' }]
    });
  };

  const removeContact = (index: number) => {
    const updated = [...formData.contacts];
    updated.splice(index, 1);
    setFormData({ ...formData, contacts: updated });
  };

  const updateContact = (index: number, field: string, value: string) => {
    const updated = [...formData.contacts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, contacts: updated });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-6 p-4 md:p-6 overflow-hidden">
      {/* Settings Editor */}
      <div className="w-full lg:w-2/5 flex flex-col bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden">
        <header className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Wedding Design</h2>
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all shadow-lg
              ${isSaved ? 'bg-green-500 text-white' : 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200'}`}
          >
            <Save size={18} />
            <span>{isSaved ? 'Saved!' : 'Save Design'}</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* Main Details Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Main Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Groom Name</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                  value={formData.groomName}
                  onChange={e => setFormData({...formData, groomName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Bride Name</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                  value={formData.brideName}
                  onChange={e => setFormData({...formData, brideName: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Date
                </label>
                <input 
                  type="date"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                  <Clock size={12} /> Time
                </label>
                <input 
                  type="time"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                <MapPin size={12} /> Venue Address
              </label>
              <textarea 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none h-20 resize-none"
                value={formData.venue}
                onChange={e => setFormData({...formData, venue: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                <Globe size={12} /> Street View Embed (Iframe Code)
              </label>
              <textarea 
                placeholder="Paste <iframe> code from Google Maps here..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none h-24 font-mono text-xs resize-none"
                value={formData.venueEmbedHtml}
                onChange={e => setFormData({...formData, venueEmbedHtml: e.target.value})}
              />
            </div>
          </section>

          {/* Contact Persons Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Contact Persons</h3>
              <button 
                onClick={addContact}
                className="p-1 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {formData.contacts.map((contact, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                  <button 
                    onClick={() => removeContact(idx)}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      placeholder="Name"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                      value={contact.name}
                      onChange={e => updateContact(idx, 'name', e.target.value)}
                    />
                    <input 
                      placeholder="Phone"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                      value={contact.phone}
                      onChange={e => updateContact(idx, 'phone', e.target.value)}
                    />
                    <input 
                      placeholder="Role (e.g. Brother)"
                      className="w-full col-span-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                      value={contact.role}
                      onChange={e => updateContact(idx, 'role', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Preview Pane */}
      <div className="flex-1 bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col min-h-[500px]">
        <header className="p-4 bg-black/60 backdrop-blur-md text-white flex flex-col sm:flex-row items-center justify-between absolute top-0 inset-x-0 z-30 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs font-bold text-gray-400">Public Invitation Preview</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className={`text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 transition-all
                ${copied ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
            <a 
              href={publicUrl} 
              target="_blank" 
              className="text-xs font-bold bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 flex items-center gap-2 transition-colors"
            >
              <Eye size={14} /> Open Full
            </a>
          </div>
        </header>
        
        <div className="flex-1 bg-gray-800 pt-24 pb-10 px-4 flex justify-center items-start overflow-y-auto scrollbar-hide">
          <div className="w-full max-w-[360px] bg-white shadow-2xl rounded-[48px] border-[12px] border-gray-800 flex flex-col overflow-hidden h-[680px] shrink-0 sticky top-0 transform scale-[0.85] sm:scale-95 md:scale-100 origin-top transition-transform">
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="relative h-[420px] flex items-center justify-center text-center overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0">
                  <img 
                    src={formData.galleryImages[0] || 'https://picsum.photos/seed/placeholder/800/600'} 
                    className="w-full h-full object-cover blur-[1px]" 
                    alt="Wedding" 
                  />
                  <div className="absolute inset-0 bg-pink-900/40" />
                </div>
                <div className="relative z-10 px-6">
                  <p className="text-white font-serif italic text-base opacity-90">Wedding Invitation</p>
                  <h1 className="text-3xl font-serif font-bold text-white mt-4 drop-shadow-lg leading-tight">
                    {formData.groomName} <br/> 
                    <span className="text-pink-300 font-script text-5xl inline-block my-2">&</span> <br/> 
                    {formData.brideName}
                  </h1>
                </div>
              </div>
              <div className="p-8 space-y-6 bg-white -mt-10 relative z-20 rounded-t-[40px]">
                 <p className="text-center font-bold text-pink-700">Preview Mode</p>
                 <div className="h-40 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xs text-center p-4">
                    Map Preview Disabled in Editor.<br/>Save to view on public page.
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
