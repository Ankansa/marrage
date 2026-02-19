
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fixed missing Users import
import { Plus, Search, Filter, Download, MoreVertical, Edit2, Trash2, X, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { RSVPStatus, Tag, FoodPreference, Invitee } from '../types';

const Invitees: React.FC = () => {
  const { invitees, addInvitee, updateInvitee, deleteInvitee } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvitee, setEditingInvitee] = useState<Invitee | null>(null);

  const filteredInvitees = invitees.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.phone.includes(searchTerm);
    const matchesTag = tagFilter === 'All' || inv.tag === tagFilter;
    return matchesSearch && matchesTag;
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    familyCount: 1,
    tag: Tag.BRIDE,
    rsvpStatus: RSVPStatus.PENDING,
    foodPreference: FoodPreference.NON_VEG,
    message: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      familyCount: 1,
      tag: Tag.BRIDE,
      rsvpStatus: RSVPStatus.PENDING,
      foodPreference: FoodPreference.NON_VEG,
      message: ''
    });
    setEditingInvitee(null);
  };

  const handleEdit = (invitee: Invitee) => {
    setEditingInvitee(invitee);
    setFormData({
      name: invitee.name,
      phone: invitee.phone,
      familyCount: invitee.familyCount,
      tag: invitee.tag,
      rsvpStatus: invitee.rsvpStatus,
      foodPreference: invitee.foodPreference,
      message: invitee.message || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvitee) {
      updateInvitee(editingInvitee.id, formData);
    } else {
      addInvitee(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-800">Guest List Management</h2>
          <p className="text-gray-500">Manage your wedding invitees and RSVPs</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all"
          >
            <Plus size={18} />
            <span>Add Guest</span>
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-pink-50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select 
              className="bg-transparent focus:outline-none text-sm font-medium text-gray-700 py-2 cursor-pointer"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value={Tag.BRIDE}>Bride Side</option>
              <option value={Tag.GROOM}>Groom Side</option>
              <option value={Tag.VIP}>VIP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Guest Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">RSVP Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Dietary</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Check-in</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvitees.map((invitee) => (
                <tr key={invitee.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{invitee.name}</div>
                    <div className="text-xs text-gray-500">{invitee.phone} • {invitee.familyCount} People</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider
                      ${invitee.tag === Tag.VIP ? 'bg-amber-100 text-amber-700' : 
                        invitee.tag === Tag.BRIDE ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {invitee.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg
                      ${invitee.rsvpStatus === RSVPStatus.CONFIRMED ? 'bg-green-100 text-green-700' : 
                        invitee.rsvpStatus === RSVPStatus.DECLINED ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {invitee.rsvpStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-600">{invitee.foodPreference}</div>
                  </td>
                  <td className="px-6 py-4">
                    {invitee.arrived ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Arrived
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not arrived</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(invitee)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteInvitee(invitee.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInvitees.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p>No guests found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingInvitee ? 'Edit Guest' : 'Add New Guest'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Family Count</label>
                    <input 
                      required
                      type="number"
                      min="1"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                      value={formData.familyCount}
                      onChange={e => setFormData({...formData, familyCount: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tag/Side</label>
                    <select 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                      value={formData.tag}
                      onChange={e => setFormData({...formData, tag: e.target.value as Tag})}
                    >
                      <option value={Tag.BRIDE}>Bride Side</option>
                      <option value={Tag.GROOM}>Groom Side</option>
                      <option value={Tag.VIP}>VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Food Preference</label>
                    <select 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 outline-none"
                      value={formData.foodPreference}
                      onChange={e => setFormData({...formData, foodPreference: e.target.value as FoodPreference})}
                    >
                      <option value={FoodPreference.VEG}>Veg</option>
                      <option value={FoodPreference.NON_VEG}>Non-Veg</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">RSVP Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[RSVPStatus.PENDING, RSVPStatus.CONFIRMED, RSVPStatus.DECLINED].map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFormData({...formData, rsvpStatus: status})}
                          className={`py-2 text-xs font-bold rounded-xl transition-all border
                            ${formData.rsvpStatus === status 
                              ? 'bg-pink-600 border-pink-600 text-white shadow-md' 
                              : 'bg-white border-gray-200 text-gray-600'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all"
                  >
                    {editingInvitee ? 'Save Changes' : 'Add Guest'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Invitees;
