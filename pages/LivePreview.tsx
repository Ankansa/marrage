
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, MapPin, Calendar, Clock, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const LivePreview: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: '', phone: '', role: '', photo: '' }]
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
    <div className="h-[calc(100vh-2rem)] flex flex-col md:flex-row m-4 gap-6 overflow-hidden">
      {/* Settings Editor */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-pink-100">
        <header className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Wedding Design</h2>
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all shadow-lg
              ${isSaved ? 'bg-green-500 text-white' : 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200'}`}
          >
            {isSaved ? <Save size={18} /> : <Save size={18} />}
            <span>{isSaved ? 'Saved!' : 'Save Design'}</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Names Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Main Details</h3>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
                <MapPin size={12} /> Venue
              </label>
              <textarea 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none h-20 resize-none"
                value={formData.venue}
                onChange={e => setFormData({...formData, venue: e.target.value})}
              />
            </div>
          </section>

          {/* Contact Persons */}
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

          {/* Gallery Mock */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={16} /> Gallery Images
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {formData.galleryImages.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-xl bg-gray-100 overflow-hidden relative group">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-pink-300 hover:text-pink-300 transition-colors cursor-pointer">
                <Plus size={24} />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Preview Pane */}
      <div className="flex-1 bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col">
        <header className="p-4 bg-black/40 backdrop-blur-md text-white flex items-center justify-between absolute top-0 inset-x-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs font-bold text-gray-400">Public Link Preview</span>
          </div>
          <a 
            href={`#/invite/${formData.slug}`} 
            target="_blank" 
            className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 flex items-center gap-1 transition-colors"
          >
            <Eye size={12} /> Open Full
          </a>
        </header>
        
        <div className="flex-1 bg-[#fff5f7] overflow-y-auto scrollbar-hide">
          {/* Simulated Mobile Frame */}
          <div className="max-w-[400px] mx-auto min-h-full bg-white shadow-2xl scale-[0.9] origin-top transform border-x-8 border-gray-800 rounded-b-[40px]">
            {/* The actual Invitation content in mini form */}
            <div className="relative h-[450px] flex items-center justify-center text-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src={formData.galleryImages[0]} className="w-full h-full object-cover blur-[2px]" alt="" />
                <div className="absolute inset-0 bg-pink-900/40" />
              </div>
              <div className="relative z-10 px-6">
                <p className="text-white font-serif italic text-lg opacity-90">Wedding Invitation</p>
                <h1 className="text-4xl font-serif font-bold text-white mt-4 drop-shadow-lg">
                  {formData.groomName} <br/> <span className="text-pink-300 font-script">&</span> <br/> {formData.brideName}
                </h1>
                <div className="w-16 h-px bg-white/40 mx-auto my-6" />
                <p className="text-white font-medium uppercase tracking-[0.2em] text-xs">Dec 12, 2025</p>
              </div>
            </div>

            <div className="p-8 space-y-8 bg-white -mt-10 relative z-20 rounded-t-[40px]">
              <div className="text-center space-y-2">
                <h4 className="font-serif text-2xl text-pink-700">Save The Date</h4>
                <p className="text-gray-500 text-sm leading-relaxed px-4">
                  We request the honor of your presence as we embark on a journey of a lifetime.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Date</p>
                    <p className="font-bold text-gray-800">{new Date(formData.date).toDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Venue</p>
                    <p className="font-bold text-gray-800 text-sm">{formData.venue}</p>
                  </div>
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
