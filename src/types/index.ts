export type UserRole = "viewer" | "explorer" | "practitioner";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Mat {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  color: "grey" | "black";
  image: string;
  specs: { label: string; value: string }[];
}

export type VideoAccessLevel = "watch" | "free_premium" | "paid_premium";

export interface VideoItem {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: "Foundational" | "Intermediate" | "Advanced";
  category: string;
  thumbnail: string;
  description?: string;
  isPremium?: boolean;
  progress?: number; // 0-100, for Continue Watching
  // ── Populated only for videos loaded from the live API (see lib/catalogAdapters.ts).
  // Optional and additive so existing mock data (data/videos.ts) keeps working unchanged.
  accessLevel?: VideoAccessLevel;
  canWatch?: boolean;
  purchased?: boolean;
  priceCents?: number | null;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface Instructor {
  id: string;
  name: string;
  discipline: string;
  bio: string;
  portrait: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  cadence: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface Program {
  id: string;
  title: string;
  weeks: number;
  sessions: number;
  image: string;
  description: string;
}

export interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  spots: number;
  filled: number;
  image: string;
}
