
export enum RSVPStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  DECLINED = 'Declined'
}

export enum Tag {
  BRIDE = 'Bride side',
  GROOM = 'Groom side',
  VIP = 'VIP'
}

export enum FoodPreference {
  VEG = 'Veg',
  NON_VEG = 'Non-Veg'
}

export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager'
}

export interface Invitee {
  id: string;
  name: string;
  phone: string;
  familyCount: number;
  rsvpStatus: RSVPStatus;
  foodPreference: FoodPreference;
  tag: Tag;
  message?: string;
  arrived: boolean;
  createdAt: string;
}

export interface GallerySection {
  eventTitle: string;
  images: string[];
}

export interface MenuItem {
  category: string;
  items: string[];
}

export interface FamilyMember {
  name: string;
  relation: string;
  side: 'Bride' | 'Groom';
  photo?: string;
}

export interface WeddingSettings {
  brideName: string;
  groomName: string;
  date: string;
  time: string;
  venue: string;
  venueMapUrl?: string;
  venueEmbedHtml?: string;
  contacts: { name: string; phone: string; role: string; photo?: string }[];
  galleryImages: string[];
  eventGalleries: GallerySection[];
  foodMenu: MenuItem[];
  familyMembers: FamilyMember[];
  addresses: {
    bride: string;
    groom: string;
    marriageVenue: string;
    receptionVenue: string;
    brideMapUrl?: string;
    groomMapUrl?: string;
    marriageVenueMapUrl?: string;
    receptionVenueMapUrl?: string;
  };
  slug: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalInvitees: number;
  confirmedCount: number;
  declinedCount: number;
  arrivedCount: number;
  totalGuestsExpected: number;
}
