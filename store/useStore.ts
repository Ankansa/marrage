
import { create } from 'zustand';
import { Invitee, RSVPStatus, Tag, FoodPreference, UserRole, WeddingSettings, DashboardStats } from '../types';
// import rini from '../assets/rini.jpg';
// import riya from '../assets/ankan.jpg';
// import '../src/IMG20240601183835.jpg as weddingPhoto1';
import rini_photo from '../src/rini.jpg';
import riya_photo from '../src/riya.jpg';
import kp_photo from '../src/kp.jpg';
import rinku_photo from '../src/rinku.jpg';
import sibu_photo from '../src/sibu.jpg';
import kakuli_photo from '../src/kakuli.jpg';
import nirmal_photo from '../src/nirmal.jpg';

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
    date: '2026-05-03',
    time: '18:00',
    venue: 'Sarkar Bari, Hamirhati',
    venueMapUrl: 'https://maps.app.goo.gl/KYw8JJg8U5sWYJEY8',
    venueEmbedHtml: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.0768994508494!2d87.35021742532297!3d23.32824631436691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f79727494f4f4f%3A0x288.67129715551334!2sSuniti%20Ceremonial%20House!5e0!3m2!1sen!2sin!4v1771541461325!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    contacts: [
      { name: 'Rahul', phone: '+91 9876543210', role: 'Groom\'s Brother', photo: 'https://i.pravatar.cc/150?u=rahul' },
      { name: 'Sneha', phone: '+91 9876543211', role: 'Bride\'s Sister', photo: 'https://i.pravatar.cc/150?u=sneha' }
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac",
      "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d"
    ],
    eventGalleries: [
      {
        eventTitle: 'Nandimukh',
        images: [
          'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800'
        ]
      },
      {
        eventTitle: 'Gaye Holud',
        images: [
          'https://images.unsplash.com/photo-1621146022934-52d37c356950?q=80&w=800',
          'https://images.unsplash.com/photo-1544101496-5f71696e73c2?q=80&w=800'
        ]
      },
      {
        eventTitle: 'Bibaho',
        images: [
          'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=800',
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800'
        ]
      }
    ],
    foodMenu: [
      { category: 'Starters', items: ['Gondhoraj Chicken Fry', 'Posto-er Bora', 'Paneer Finger', 'Darjeeling Coffee'] },
      { category: 'Bhoj (Main)', items: ['Basanti Pulao', 'Kochi Pathar Jhol', 'Katla Kalia', 'Chingri Malaikari', 'Dhokar Dalna'] },
      { category: 'Mishti (Dessert)', items: ['Nolen Gur-er Rosogolla', 'Mishti Doi', 'Baked Mihidana', 'Mishit Pan'] }
    ],
    familyMembers: [
      { name: 'Late Nirad Baran Sarkar', relation: 'Grandfather (Groom)', side: 'Groom', photo: 'https://eu.ui-avatars.com/api/?name=Nirad+Baran+Sarkar&size=250' },
      { name: 'Krishnapada Sarkar', relation: 'Father of Groom', side: 'Groom', photo: kp_photo },
      { name: 'Late Rinku Sarkar', relation: 'Mother of Groom', side: 'Groom', photo: rinku_photo },
      {
        name: 'Manisha Sarkar',
        relation: 'Sister of Groom',
        side: 'Groom',
        photo: riya_photo
      },
      {
        name: 'Moumita Sarkar',
        relation: 'Sister of Groom',
        side: 'Groom',
        photo: rini_photo
      },
      { name: 'Late Sitanshu Sekhar Sarkar', relation: 'Grandfather (Bride)', side: 'Bride', photo: 'https://eu.ui-avatars.com/api/?name=Sashank+Sekhar+Sarkar&size=250' },
      { name: 'Late Nirmal Sarkar', relation: 'Father of Bride', side: 'Bride', photo: nirmal_photo },
      { name: 'Kakuli Sarkar', relation: 'Mother of Bride', side: 'Bride', photo: kakuli_photo },
      {
        name: 'Shibdas Sarkar',
        relation: 'Brother of Bride',
        side: 'Bride',
        photo: sibu_photo
      }
    ],
    addresses: {
      bride: 'Roy Villa, Hamirhati, Sonamukhi, Bankura - 722207',
      groom: 'Mirchoba, Chhotonilpur, Bardhaman, West Bengal 713103',
      marriageVenue: 'Suniti Ceremonial House, Hamirhati',
      receptionVenue: 'Sarkar Bari Hamirhati, Bankura - 722207',
      brideMapUrl: 'https://maps.app.goo.gl/KYw8JJg8U5sWYJEY8',
      groomMapUrl: 'https://maps.app.goo.gl/KYw8JJg8U5sWYJEY8',
      marriageVenueMapUrl: 'https://maps.app.goo.gl/KYw8JJg8U5sWYJEY8',
      receptionVenueMapUrl: 'https://maps.app.goo.gl/KYw8JJg8U5sWYJEY8'
    },
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
    const mockInvitees: Invitee[] = [
      { id: '1', name: 'Sourav Ganguly', phone: '9830000001', familyCount: 4, rsvpStatus: RSVPStatus.CONFIRMED, foodPreference: FoodPreference.NON_VEG, tag: Tag.VIP, arrived: true, createdAt: new Date().toISOString() },
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
