// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Firestore Service Layer
// ═══════════════════════════════════════════════════

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  SiteSettings,
  SEOSettings,
  HeroSettings,
  AboutSettings,
  MembershipPlan,
  GalleryImage,
  Facility,
  Testimonial,
  Trainer,
  Offer,
  Lead,
  MediaItem,
  Notification,
  AnalyticsSummary,
} from '@/types'

// ── HELPERS ────────────────────────────────────────
function toDate(ts: unknown): string {
  if (!ts) return new Date().toISOString()
  if (ts instanceof Timestamp) return ts.toDate().toISOString()
  if (typeof ts === 'string') return ts
  return new Date().toISOString()
}

function snapToArray<T>(snap: QuerySnapshot<DocumentData>): T[] {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T))
}

// ── SETTINGS ───────────────────────────────────────
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, 'settings', 'site'))
  return snap.exists() ? (snap.data() as SiteSettings) : null
}

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  await setDoc(doc(db, 'settings', 'site'), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

export function onSiteSettings(cb: (s: SiteSettings | null) => void) {
  return onSnapshot(doc(db, 'settings', 'site'), (snap) => {
    cb(snap.exists() ? (snap.data() as SiteSettings) : null)
  })
}

// ── SEO ────────────────────────────────────────────
export async function getSEOSettings(): Promise<SEOSettings | null> {
  const snap = await getDoc(doc(db, 'settings', 'seo'))
  return snap.exists() ? (snap.data() as SEOSettings) : null
}

export async function updateSEOSettings(data: Partial<SEOSettings>) {
  await setDoc(doc(db, 'settings', 'seo'), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

// ── HERO ───────────────────────────────────────────
export async function getHeroSettings(): Promise<HeroSettings | null> {
  const snap = await getDoc(doc(db, 'settings', 'hero'))
  return snap.exists() ? (snap.data() as HeroSettings) : null
}

export async function updateHeroSettings(data: Partial<HeroSettings>) {
  await setDoc(doc(db, 'settings', 'hero'), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

export function onHeroSettings(cb: (h: HeroSettings | null) => void) {
  return onSnapshot(doc(db, 'settings', 'hero'), (snap) => {
    cb(snap.exists() ? (snap.data() as HeroSettings) : null)
  })
}

// ── ABOUT ──────────────────────────────────────────
export async function getAboutSettings(): Promise<AboutSettings | null> {
  const snap = await getDoc(doc(db, 'settings', 'about'))
  return snap.exists() ? (snap.data() as AboutSettings) : null
}

export async function updateAboutSettings(data: Partial<AboutSettings>) {
  await setDoc(doc(db, 'settings', 'about'), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

// ── MEMBERSHIPS ────────────────────────────────────
export async function getMemberships(): Promise<MembershipPlan[]> {
  const snap = await getDocs(query(collection(db, 'memberships'), orderBy('order', 'asc')))
  return snapToArray<MembershipPlan>(snap)
}

export function onMemberships(cb: (plans: MembershipPlan[]) => void) {
  return onSnapshot(query(collection(db, 'memberships'), orderBy('order', 'asc')), (snap) => {
    cb(snapToArray<MembershipPlan>(snap))
  })
}

export async function createMembership(data: Omit<MembershipPlan, 'id'>) {
  return addDoc(collection(db, 'memberships'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateMembership(id: string, data: Partial<MembershipPlan>) {
  await updateDoc(doc(db, 'memberships', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteMembership(id: string) {
  await deleteDoc(doc(db, 'memberships', id))
}

// ── GALLERY ────────────────────────────────────────
export async function getGallery(): Promise<GalleryImage[]> {
  const snap = await getDocs(query(collection(db, 'gallery'), orderBy('order', 'asc')))
  return snapToArray<GalleryImage>(snap)
}

export function onGallery(cb: (imgs: GalleryImage[]) => void) {
  return onSnapshot(query(collection(db, 'gallery'), orderBy('order', 'asc')), (snap) => {
    cb(snapToArray<GalleryImage>(snap))
  })
}

export async function addGalleryImage(data: Omit<GalleryImage, 'id'>) {
  return addDoc(collection(db, 'gallery'), { ...data, createdAt: serverTimestamp() })
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>) {
  await updateDoc(doc(db, 'gallery', id), data)
}

export async function deleteGalleryImage(id: string) {
  await deleteDoc(doc(db, 'gallery', id))
}

// ── FACILITIES ─────────────────────────────────────
export async function getFacilities(): Promise<Facility[]> {
  const snap = await getDocs(query(collection(db, 'facilities'), orderBy('order', 'asc')))
  return snapToArray<Facility>(snap)
}

export function onFacilities(cb: (f: Facility[]) => void) {
  return onSnapshot(query(collection(db, 'facilities'), orderBy('order', 'asc')), (snap) => {
    cb(snapToArray<Facility>(snap))
  })
}

export async function createFacility(data: Omit<Facility, 'id'>) {
  return addDoc(collection(db, 'facilities'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateFacility(id: string, data: Partial<Facility>) {
  await updateDoc(doc(db, 'facilities', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteFacility(id: string) {
  await deleteDoc(doc(db, 'facilities', id))
}

// ── TESTIMONIALS ───────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  const snap = await getDocs(query(collection(db, 'testimonials'), orderBy('order', 'asc')))
  return snapToArray<Testimonial>(snap)
}

export function onTestimonials(cb: (t: Testimonial[]) => void) {
  return onSnapshot(query(collection(db, 'testimonials'), orderBy('order', 'asc')), (snap) => {
    cb(snapToArray<Testimonial>(snap))
  })
}

export async function createTestimonial(data: Omit<Testimonial, 'id'>) {
  return addDoc(collection(db, 'testimonials'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  await updateDoc(doc(db, 'testimonials', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteTestimonial(id: string) {
  await deleteDoc(doc(db, 'testimonials', id))
}

// ── TRAINERS ───────────────────────────────────────
export async function getTrainers(): Promise<Trainer[]> {
  const snap = await getDocs(query(collection(db, 'trainers'), orderBy('order', 'asc')))
  return snapToArray<Trainer>(snap)
}

export function onTrainers(cb: (t: Trainer[]) => void) {
  return onSnapshot(query(collection(db, 'trainers'), orderBy('order', 'asc')), (snap) => {
    cb(snapToArray<Trainer>(snap))
  })
}

export async function createTrainer(data: Omit<Trainer, 'id'>) {
  return addDoc(collection(db, 'trainers'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateTrainer(id: string, data: Partial<Trainer>) {
  await updateDoc(doc(db, 'trainers', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteTrainer(id: string) {
  await deleteDoc(doc(db, 'trainers', id))
}

// ── OFFERS ─────────────────────────────────────────
export async function getOffers(): Promise<Offer[]> {
  const snap = await getDocs(query(collection(db, 'offers'), orderBy('createdAt', 'desc')))
  return snapToArray<Offer>(snap)
}

export async function createOffer(data: Omit<Offer, 'id'>) {
  return addDoc(collection(db, 'offers'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateOffer(id: string, data: Partial<Offer>) {
  await updateDoc(doc(db, 'offers', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteOffer(id: string) {
  await deleteDoc(doc(db, 'offers', id))
}

// ── LEADS ──────────────────────────────────────────
export async function getLeads(): Promise<Lead[]> {
  const snap = await getDocs(query(collection(db, 'leads'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
    updatedAt: toDate(d.data().updatedAt),
  } as Lead))
}

export async function createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(db, 'leads'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateLead(id: string, data: Partial<Lead>) {
  await updateDoc(doc(db, 'leads', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteLead(id: string) {
  await deleteDoc(doc(db, 'leads', id))
}

// ── MEDIA ──────────────────────────────────────────
export async function getMedia(folder?: string): Promise<MediaItem[]> {
  const q = folder
    ? query(collection(db, 'media'), where('folder', '==', folder), orderBy('createdAt', 'desc'))
    : query(collection(db, 'media'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snapToArray<MediaItem>(snap)
}

export async function addMediaItem(data: Omit<MediaItem, 'id'>) {
  return addDoc(collection(db, 'media'), { ...data, createdAt: serverTimestamp() })
}

export async function deleteMediaItem(id: string) {
  await deleteDoc(doc(db, 'media', id))
}

// ── NOTIFICATIONS ──────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  const snap = await getDocs(query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(20)))
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  } as Notification))
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(db, 'notifications', id), { read: true })
}

export async function createNotification(data: Omit<Notification, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'notifications'), { ...data, read: false, createdAt: serverTimestamp() })
}

// ── ANALYTICS ─────────────────────────────────────
export async function trackEvent(event: string) {
  const today = new Date().toISOString().split('T')[0]
  const ref = doc(db, 'analytics', today)
  await setDoc(ref, { [event]: increment(1), date: today }, { merge: true })
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const snap = await getDocs(query(collection(db, 'analytics'), orderBy('date', 'desc'), limit(30)))
  const days = snap.docs.map((d) => d.data())

  return {
    totalVisits: days.reduce((sum, d) => sum + (d.websiteVisits || 0), 0),
    totalWhatsapp: days.reduce((sum, d) => sum + (d.whatsappClicks || 0), 0),
    totalMembership: days.reduce((sum, d) => sum + (d.membershipClicks || 0), 0),
    totalLeads: days.reduce((sum, d) => sum + (d.contactFormSubmissions || 0), 0),
    totalGalleryViews: days.reduce((sum, d) => sum + (d.galleryViews || 0), 0),
    recentActivity: [],
  }
}

// ── USERS ──────────────────────────────────────────
export async function getUserData(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export async function setUserRole(uid: string, role: string) {
  await setDoc(doc(db, 'users', uid), { role, updatedAt: serverTimestamp() }, { merge: true })
}

export async function getUsers() {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
  return snapToArray(snap)
}

// ── BACKUP ─────────────────────────────────────────
export async function exportAllData() {
  const collections = ['settings', 'memberships', 'gallery', 'facilities', 'trainers', 'testimonials', 'offers', 'leads']
  const result: Record<string, unknown[]> = {}

  for (const col of collections) {
    const snap = await getDocs(collection(db, col))
    result[col] = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }

  return result
}
