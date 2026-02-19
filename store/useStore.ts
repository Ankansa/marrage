
import { create } from 'zustand';
import { Invitee, RSVPStatus, Tag, FoodPreference, UserRole, WeddingSettings, DashboardStats } from '../types';
interface AppState {
  isAuthenticated: boolean;
  user: { username: string; role: UserRole } | null;
  invitees: Invitee[];
  settings: WeddingSettings;
  stats: DashboardStats;
  
  // Actions
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  initializeData: () => void;
  addInvitee: (invitee: Omit<Invitee, 'id' | 'createdAt' | 'arrived'>) => void;
  updateInvitee: (id: string, updates: Partial<Invitee>) => void;
  deleteInvitee: (id: string) => void;
  updateSettings: (settings: Partial<WeddingSettings>) => void;
  checkIn: (id: string) => void;
  recalculateStats: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  invitees: [],
  settings: {
    brideName: 'Samapika',
    groomName: 'Ankan',
    date: '2026-05-05',
    time: '18:00',
    venue: 'Sarkar Bari Hamirhati, West Bengal',
    venueMapUrl: 'https://maps.app.goo.gl/KXdbKTfrzvCwh3cNA',
    // Use public folder for local images or external URLs for hosted images
    contacts: [
      { name: 'Rini', phone: '+91 8145110379', role: 'Groom\'s Sister', photo: 'public\\IMG20240601183843.jpg' },
      { name: 'Riya', phone: '+91 7076990491', role: 'Groom\'s Sister', photo: 'public\\IMG20240601183835.jpg' }
    ],
    galleryImages: [
      'https://picsum.photos/seed/wedding1/800/600',
      'https://picsum.photos/seed/wedding2/800/600',
      'https://picsum.photos/seed/wedding3/800/600'
    ],
    slug: 'ankan-samapika',
    isActive: true
  },
  stats: {
    totalInvitees: 0,
    confirmedCount: 0,
    declinedCount: 0,
    arrivedCount: 0,
    totalGuestsExpected: 0
  },

  login: (username, role) => set({ isAuthenticated: true, user: { username, role } }),
  logout: () => set({ isAuthenticated: false, user: null }),
  
  initializeData: () => {
    // Generating some mock data
    const mockInvitees: Invitee[] = [
      { id: '1', name: 'Sourav Ganguly', phone: '9830000001', familyCount: 4, rsvpStatus: RSVPStatus.CONFIRMED, foodPreference: FoodPreference.NON_VEG, tag: Tag.VIP, arrived: true, createdAt: new Date().toISOString() },
      { id: '2', name: 'Amrita Chatterjee', phone: '9830000002', familyCount: 2, rsvpStatus: RSVPStatus.PENDING, foodPreference: FoodPreference.VEG, tag: Tag.BRIDE, arrived: false, createdAt: new Date().toISOString() },
      { id: '3', name: 'Bimal Das', phone: '9830000003', familyCount: 1, rsvpStatus: RSVPStatus.DECLINED, foodPreference: FoodPreference.NON_VEG, tag: Tag.GROOM, arrived: false, createdAt: new Date().toISOString() },
      { id: '4', name: 'Nandini Roy', phone: '9830000004', familyCount: 3, rsvpStatus: RSVPStatus.CONFIRMED, foodPreference: FoodPreference.VEG, tag: Tag.BRIDE, arrived: false, createdAt: new Date().toISOString() },
    ];
    set({ invitees: mockInvitees });
    get().recalculateStats();
  },

  addInvitee: (data) => {
    const newInvitee: Invitee = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      arrived: false,
      createdAt: new Date().toISOString()
    };
    set(state => ({ invitees: [newInvitee, ...state.invitees] }));
    get().recalculateStats();
  },

  updateInvitee: (id, updates) => {
    set(state => ({
      invitees: state.invitees.map(inv => inv.id === id ? { ...inv, ...updates } : inv)
    }));
    get().recalculateStats();
  },

  deleteInvitee: (id) => {
    set(state => ({
      invitees: state.invitees.filter(inv => inv.id !== id)
    }));
    get().recalculateStats();
  },

  updateSettings: (newSettings) => set(state => ({
    settings: { ...state.settings, ...newSettings }
  })),

  checkIn: (id) => {
    set(state => ({
      invitees: state.invitees.map(inv => inv.id === id ? { ...inv, arrived: true, rsvpStatus: RSVPStatus.CONFIRMED } : inv)
    }));
    get().recalculateStats();
  },

  recalculateStats: () => {
    const { invitees } = get();
    const stats: DashboardStats = {
      totalInvitees: invitees.length,
      confirmedCount: invitees.filter(i => i.rsvpStatus === RSVPStatus.CONFIRMED).length,
      declinedCount: invitees.filter(i => i.rsvpStatus === RSVPStatus.DECLINED).length,
      arrivedCount: invitees.filter(i => i.arrived).length,
      totalGuestsExpected: invitees
        .filter(i => i.rsvpStatus === RSVPStatus.CONFIRMED)
        .reduce((sum, i) => sum + i.familyCount, 0)
    };
    set({ stats });
  }
}));
