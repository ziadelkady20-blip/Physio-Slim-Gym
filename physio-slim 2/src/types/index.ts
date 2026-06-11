// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Global TypeScript Types
// ═══════════════════════════════════════════════════

export type UserRole = 'super_admin' | 'admin' | 'manager'

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt: string
  lastLogin: string
  photoURL?: string
}

// ── SITE SETTINGS ──────────────────────────────────
export interface SiteSettings {
  gymName: string
  tagline: string
  primaryColor: string
  secondaryColor: string
  phone: string
  whatsapp: string
  email: string
  address: string
  facebook: string
  instagram: string
  tiktok: string
  googleMapsEmbed: string
  appleMapsLink: string
  businessHours: BusinessHours[]
  footerTagline: string
  copyright: string
  updatedAt?: string
}

export interface BusinessHours {
  day: string
  open: string
  close: string
  closed: boolean
}

// ── SEO ────────────────────────────────────────────
export interface SEOSettings {
  metaTitle: string
  metaDescription: string
  keywords: string
  ogImage: string
  ogTitle: string
  ogDescription: string
  twitterCard: 'summary' | 'summary_large_image'
  updatedAt?: string
}

// ── HERO ───────────────────────────────────────────
export interface HeroSettings {
  title: string
  subtitle: string
  description: string
  badge: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  backgroundImage: string
  videoUrl: string
  videoEnabled: boolean
  updatedAt?: string
}

// ── MEMBERSHIP ─────────────────────────────────────
export interface MembershipPlan {
  id: string
  name: string
  category: 'gym' | 'pool' | 'both' | 'ladies' | 'kids'
  price: number
  currency: string
  duration: string
  sessions: string
  description: string
  features: string[]
  featured: boolean
  whatsappLink: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

// ── GALLERY ────────────────────────────────────────
export interface GalleryImage {
  id: string
  url: string
  thumbnail?: string
  caption: string
  category: string
  order: number
  createdAt: string
}

// ── FACILITY ───────────────────────────────────────
export interface Facility {
  id: string
  title: string
  description: string
  icon: string
  image: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

// ── TESTIMONIAL ────────────────────────────────────
export interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  memberSince: string
  avatarUrl?: string
  initials: string
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

// ── TRAINER ────────────────────────────────────────
export interface Trainer {
  id: string
  name: string
  position: string
  specialization: string
  bio: string
  experience: string
  image: string
  instagram?: string
  facebook?: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

// ── ABOUT ──────────────────────────────────────────
export interface AboutSettings {
  title: string
  subtitle: string
  text: string
  mission: string
  vision: string
  image: string
  badgeNumber: string
  badgeLabel: string
  stats: AboutStat[]
  updatedAt?: string
}

export interface AboutStat {
  number: string
  label: string
}

// ── OFFER ──────────────────────────────────────────
export interface Offer {
  id: string
  title: string
  description: string
  discount: number
  originalPrice: number
  offerPrice: number
  currency: string
  expiresAt: string
  featured: boolean
  bannerImage?: string
  ctaText: string
  ctaLink: string
  active: boolean
  createdAt: string
  updatedAt: string
}

// ── LEAD / CONTACT ─────────────────────────────────
export interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  message: string
  plan?: string
  status: 'new' | 'contacted' | 'converted' | 'closed'
  source: string
  createdAt: string
  updatedAt: string
}

// ── MEDIA ──────────────────────────────────────────
export interface MediaItem {
  id: string
  name: string
  url: string
  size: number
  type: string
  folder: string
  createdAt: string
}

// ── ANALYTICS ──────────────────────────────────────
export interface AnalyticsData {
  websiteVisits: number
  whatsappClicks: number
  membershipClicks: number
  contactFormSubmissions: number
  galleryViews: number
  date: string
}

export interface AnalyticsSummary {
  totalVisits: number
  totalWhatsapp: number
  totalMembership: number
  totalLeads: number
  totalGalleryViews: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'lead' | 'click' | 'view' | 'submission'
  message: string
  timestamp: string
}

// ── NOTIFICATION ───────────────────────────────────
export interface Notification {
  id: string
  title: string
  message: string
  type: 'lead' | 'contact' | 'inquiry' | 'system'
  read: boolean
  createdAt: string
}
