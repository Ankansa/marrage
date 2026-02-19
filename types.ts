
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
