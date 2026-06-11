'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Main Site (Client Component)
// Preserves original luxury black/gold design
// ═══════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/firestore'
import type {
  SiteSettings, HeroSettings, MembershipPlan, Facility,
  GalleryImage, Testimonial, Trainer, AboutSettings, Offer
} from '@/types'

// Default fallback data (used when Firebase returns null)
const DEFAULT_HERO = {
  title: 'PHYSIO SLIM',
  subtitle: 'HEALTH CLUB',
  description: 'Transform Your Body. Build Your Strength. Unlock Your Potential.',
  badge: 'Premium Fitness • Fayoum, Egypt',
  primaryButtonText: 'Join Now',
  primaryButtonLink: '#memberships',
  secondaryButtonText: 'WhatsApp Us',
  secondaryButtonLink: 'https://wa.me/201023265002',
  backgroundImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
  videoEnabled: false,
  videoUrl: '',
}

const DEFAULT_SETTINGS = {
  gymName: 'Physio Slim Health Club',
  whatsapp: 'https://wa.me/201023265002',
  phone: '+20 102 326 5002',
  email: 'info@physioslim.com',
  address: 'Fayoum, Egypt',
  facebook: '#',
  instagram: '#',
  tiktok: '#',
  googleMapsEmbed: '',
  copyright: '© 2024 Physio Slim Health Club',
}

interface Props {
  settings: SiteSettings | null
  hero: HeroSettings | null
  memberships: MembershipPlan[]
  facilities: Facility[]
  gallery: GalleryImage[]
  testimonials: Testimonial[]
  trainers: Trainer[]
  about: AboutSettings | null
  offers: Offer[]
}

export default function SiteClient({ settings, hero, memberships, facilities, gallery, testimonials, trainers, about, offers }: Props) {
  const h = { ...DEFAULT_HERO, ...hero }
  const s = { ...DEFAULT_SETTINGS, ...settings }

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('gym')
  const [lightbox, setLightbox] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 })
  const [loaded, setLoaded] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const scrollRef = useRef<number>(0)

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const pos = window.scrollY
      setScrolled(pos > 60)
      const bar = document.getElementById('scroll-bar')
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        bar.style.width = `${(pos / max) * 100}%`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(t)
  }, [])

  // Track visit
  useEffect(() => {
    trackEvent('websiteVisits').catch(() => {})
  }, [])

  // Membership categories from data
  const categories = Array.from(new Set(memberships.map((m) => m.category)))
  const activeMembers = memberships.filter((m) => m.active !== false && m.category === activeTab)

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'website' }),
      })
      setSubmitted(true)
      trackEvent('contactFormSubmissions').catch(() => {})
    } catch {
      alert('Error sending message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ── LOADER ── */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="fixed inset-0 bg-dark flex flex-col items-center justify-center z-[10000]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <svg viewBox="0 0 200 220" fill="none" className="w-40 h-40 animate-[loaderPulse_1.4s_ease-in-out_infinite]" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 8 L180 38 L180 120 C180 165 145 195 100 212 C55 195 20 165 20 120 L20 38 Z" fill="rgba(5,5,5,0.6)" stroke="#D4AF37" strokeWidth="2"/>
              <text x="100" y="127" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontWeight="900" fontSize="17" fill="#050505" letterSpacing="1">Physio – Slim</text>
              <text x="100" y="156" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontWeight="700" fontSize="10" fill="#D4AF37" letterSpacing="3">HEALTH CLUB</text>
            </svg>
            <p className="mt-4 text-[11px] tracking-[6px] text-gold font-montserrat font-bold uppercase animate-[fadeIn_1s_ease_0.4s_both]">
              Loading Excellence
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SCROLL BAR ── */}
      <div id="scroll-bar" />

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between transition-all duration-400 ${
        scrolled ? 'bg-[rgba(13,13,13,0.92)] backdrop-blur-xl border-b border-[var(--border)] py-3 px-10' : 'py-5 px-10'
      }`}>
        <a href="#hero" className="flex items-center gap-3 no-underline">
          <svg viewBox="0 0 44 44" fill="none" className="w-11 h-11">
            <path d="M22 3L40 11V26C40 35 32 41 22 44C12 41 4 35 4 26V11Z" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
            <rect x="13" y="20" width="18" height="4" rx="1.5" fill="#D4AF37"/>
            <rect x="11" y="16" width="6" height="12" rx="2" fill="#D4AF37"/>
            <rect x="27" y="16" width="6" height="12" rx="2" fill="#D4AF37"/>
          </svg>
          <div className="font-montserrat font-black text-[15px] leading-tight">
            {s.gymName.split(' ').slice(0, 2).join(' ')}
            <span className="text-gold block text-[10px] tracking-[3px] font-semibold">HEALTH CLUB</span>
          </div>
        </a>

        <ul className="hidden lg:flex gap-9 list-none">
          {['Home', 'Memberships', 'Facilities', 'Gallery', 'Reviews', 'Contact'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-gray-400 no-underline text-[13px] tracking-[1.5px] font-montserrat font-semibold uppercase transition-colors hover:text-gold relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href={s.whatsapp}
          target="_blank"
          onClick={() => trackEvent('whatsappClicks')}
          className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-black font-montserrat font-bold text-[12px] tracking-[2px] uppercase px-5 py-2.5 clip-btn-sm transition-all hover:brightness-110"
        >
          Join Now
        </a>

        <button
          className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(5,5,5,0.98)] backdrop-blur-xl z-[999] flex flex-col items-center justify-center gap-8"
          >
            <button className="absolute top-6 right-8 bg-transparent border-none cursor-pointer text-white" onClick={() => setMobileOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {['Home', 'Memberships', 'Facilities', 'Gallery', 'Reviews', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="font-montserrat font-bold text-2xl text-white no-underline tracking-[4px] uppercase hover:text-gold transition-colors"
              >
                {item}
              </a>
            ))}
            <a href={s.whatsapp} target="_blank" className="text-gold font-montserrat font-bold text-xl tracking-[3px]">
              Join Now ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════
          HERO SECTION
      ═══════════════════════════ */}
      <section id="home" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden bg-black">
        {h.videoEnabled && h.videoUrl ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-35">
            <source src={h.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 opacity-35 scale-105 animate-[heroZoom_20s_ease-in-out_infinite_alternate] bg-cover bg-center"
            style={{ backgroundImage: `url('${h.backgroundImage}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,5,5,0.55)] via-[rgba(5,5,5,0.3)] to-[rgba(5,5,5,0.9)]" />
        <div className="absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] animate-[glowPulse_4s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />

        <motion.div
          className="relative z-10 px-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {/* Shield Logo */}
          <div className="flex justify-center mb-6">
            <svg viewBox="0 0 200 220" fill="none" className="w-40 h-44" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 8 L180 38 L180 120 C180 165 145 195 100 212 C55 195 20 165 20 120 L20 38 Z" fill="rgba(5,5,5,0.6)" stroke="#D4AF37" strokeWidth="2"/>
              <path d="M100 18 L170 44 L170 120 C170 160 138 188 100 202 C62 188 30 160 30 120 L30 44 Z" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4"/>
              <ellipse cx="116" cy="42" rx="9" ry="9" fill="#D4AF37"/>
              <path d="M107 55 C107 55 95 70 95 85 L137 85 C137 70 125 55 125 55 Z" fill="#D4AF37"/>
              <path d="M15 95 L35 87 L165 87 L185 95 L165 103 L140 98 L100 102 L60 98 L35 103 Z" fill="#D4AF37"/>
              <path d="M30 105 L20 120 L30 135 L170 135 L180 120 L170 105 Z" fill="#D4AF37"/>
              <rect x="38" y="140" width="124" height="24" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
              <path d="M70 164 L100 185 L130 164" fill="#D4AF37"/>
              <text x="100" y="127" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontWeight="900" fontSize="17" fill="#050505" letterSpacing="1">Physio – Slim</text>
              <text x="100" y="156" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontWeight="700" fontSize="10" fill="#D4AF37" letterSpacing="3">HEALTH CLUB</text>
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 border border-[var(--border)] px-4 py-1.5 text-[11px] tracking-[4px] text-gold font-montserrat font-semibold uppercase mb-7 bg-[rgba(212,175,55,0.07)]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-[blink_1.5s_infinite]" />
            {h.badge}
          </div>

          <h1 className="font-montserrat font-black uppercase leading-[0.92] tracking-[-2px] mb-2" style={{ fontSize: 'clamp(48px, 9vw, 108px)' }}>
            {h.title}<span className="text-gold"> {h.subtitle}</span>
          </h1>

          <p className="font-montserrat text-gray-400 uppercase tracking-[5px] my-5" style={{ fontSize: 'clamp(12px, 2vw, 17px)' }}>
            Premium Fitness Experience In Fayoum
          </p>

          <p className="text-[15px] text-gray-400 mb-9 max-w-[480px] mx-auto leading-relaxed">
            {h.description}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href={h.primaryButtonLink}
              onClick={() => trackEvent('membershipClicks')}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-black font-montserrat font-bold text-[12px] tracking-[2.5px] uppercase px-9 py-4 clip-btn transition-all hover:brightness-110 hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              {h.primaryButtonText}
            </a>
            <a
              href={s.whatsapp}
              target="_blank"
              onClick={() => trackEvent('whatsappClicks')}
              className="inline-flex items-center gap-2 bg-transparent text-white border border-[rgba(255,255,255,0.3)] font-montserrat font-semibold text-[12px] tracking-[2.5px] uppercase px-9 py-4 clip-btn transition-all hover:bg-[rgba(255,255,255,0.07)] hover:-translate-y-0.5"
            >
              WhatsApp Us
            </a>
          </div>

          <div className="mt-7 flex items-center justify-center gap-3 text-sm text-gray-500 font-montserrat tracking-widest">
            <span>Transform</span>
            <span className="text-gold">·</span>
            <span>Build</span>
            <span className="text-gold">·</span>
            <span>Unlock</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-bounce">
          <div className="w-6 h-9 border border-[rgba(212,175,55,0.5)] rounded-xl flex justify-center pt-1.5">
            <span className="w-0.5 h-2 bg-gold rounded-sm animate-[scrollDot_1.5s_ease-in-out_infinite]" />
          </div>
          <span className="text-[9px] tracking-[4px] text-gold font-montserrat font-semibold">SCROLL</span>
        </div>
      </section>

      {/* ═══════════════════════════
          ABOUT SECTION
      ═══════════════════════════ */}
      <section id="about" className="section-base bg-[var(--surface)]">
        <div className="container mx-auto max-w-[1280px]">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="reveal left relative">
              <Image
                src={about?.image || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'}
                alt="About Physio Slim"
                width={600}
                height={750}
                className="w-full border border-[var(--border)] grayscale-[20%]"
                style={{ aspectRatio: '4/5', objectFit: 'cover' }}
              />
              <div className="absolute bottom-[-20px] right-[-20px] w-44 h-44 border-2 border-gold opacity-30" />
              <div className="absolute top-7 left-[-20px] bg-gradient-to-br from-gold to-gold-dark px-5 py-4 clip-btn-sm">
                <span className="font-montserrat font-black text-[28px] text-black block leading-none">
                  {about?.badgeNumber || '5+'}
                </span>
                <span className="font-montserrat font-semibold text-[10px] text-black tracking-[2px] uppercase">
                  {about?.badgeLabel || 'Years of Excellence'}
                </span>
              </div>
            </div>

            <div className="reveal right">
              <p className="section-label text-[11px] tracking-[5px] text-gold font-montserrat font-bold uppercase flex items-center gap-3 mb-4 before:content-[''] before:w-8 before:h-px before:bg-gold">
                About Us
              </p>
              <h2 className="font-montserrat font-black uppercase leading-none mb-5" style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}>
                {about?.title || 'ELITE'} <span className="text-gold">{about?.subtitle || 'FITNESS'}</span>
              </h2>
              <div className="w-14 h-0.5 bg-gradient-to-r from-gold to-transparent my-5" />
              <p className="text-[14.5px] text-gray-400 leading-[1.8] mb-6">
                {about?.text || 'Physio Slim Health Club is Fayoum\'s premier fitness destination. We combine professional coaching, state-of-the-art equipment, and a luxurious environment to help you achieve your fitness goals.'}
              </p>

              {about?.stats && (
                <div className="grid grid-cols-3 gap-6 mt-8">
                  {about.stats.map((stat, i) => (
                    <div key={i} className="text-center border-l border-[var(--border)] pl-4">
                      <div className="font-montserrat font-black text-3xl text-gold">{stat.number}</div>
                      <div className="text-[11px] tracking-[2px] text-gray-400 uppercase font-montserrat font-semibold mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          MEMBERSHIPS
      ═══════════════════════════ */}
      <section id="memberships" className="section-base bg-[var(--bg)]">
        <div className="container mx-auto max-w-[1280px]">
          <div className="text-center mb-14 reveal">
            <p className="section-label justify-center text-[11px] tracking-[5px] text-gold font-montserrat font-bold uppercase flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />Membership Plans<span className="w-8 h-px bg-gold" />
            </p>
            <h2 className="font-montserrat font-black uppercase" style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}>
              CHOOSE YOUR <span className="text-gold">PLAN</span>
            </h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto mt-5" />
          </div>

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex gap-0 mb-10 border-b border-[var(--border)] justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-8 py-3 font-montserrat font-bold text-[11px] tracking-[2px] uppercase transition-all border-b-2 -mb-px ${
                    activeTab === cat
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-400 hover:text-gold'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {(activeMembers.length > 0 ? activeMembers : memberships.slice(0, 4)).map((plan) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-[var(--surface)] border flex flex-col p-9 relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(212,175,55,0.12)] cursor-default ${
                  plan.featured ? 'border-gold bg-gradient-to-b from-[rgba(212,175,55,0.06)] to-[var(--surface)]' : 'border-[var(--border)] hover:border-gold'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-dark text-black font-montserrat font-bold text-[9px] tracking-[2px] px-3 py-1.5"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 12px 100%)' }}>
                    BEST VALUE
                  </div>
                )}

                <div className="text-[11px] tracking-[3px] text-gold font-montserrat font-bold uppercase mb-3">{plan.sessions}</div>
                <div className="font-montserrat font-black mb-1">
                  <span className="text-gold text-xl align-super">{plan.currency || 'EGP'}</span>
                  <span className="text-[52px] leading-none">{plan.price}</span>
                  <span className="text-gray-400 text-[13px] font-normal">/{plan.duration}</span>
                </div>
                <div className="font-montserrat font-bold text-lg mb-2">{plan.name}</div>
                <p className="text-[13px] text-gray-400 mb-3">{plan.description}</p>
                <div className="h-px bg-[var(--border)] my-4" />

                <ul className="flex-1">
                  {plan.features?.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[13px] text-gray-400 py-2 border-b border-[rgba(212,175,55,0.06)]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-2.5">
                  <a
                    href="#contact"
                    onClick={() => trackEvent('membershipClicks')}
                    className="block text-center bg-gradient-to-br from-gold to-gold-dark text-black font-montserrat font-bold text-[11px] tracking-[2px] uppercase py-3 clip-btn-sm hover:brightness-110 transition-all"
                  >
                    Subscribe Now
                  </a>
                  <a
                    href={plan.whatsappLink || s.whatsapp}
                    target="_blank"
                    onClick={() => trackEvent('whatsappClicks')}
                    className="flex items-center justify-center gap-2 text-[#25d366] border border-[#25d366] font-montserrat font-bold text-[11px] tracking-[2px] uppercase py-3 clip-btn-sm hover:bg-[rgba(37,211,102,0.1)] transition-all"
                  >
                    WhatsApp
                  </a>
                </div>

                <div className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at bottom right, rgba(212,175,55,0.08), transparent)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          FACILITIES
      ═══════════════════════════ */}
      <section id="facilities" className="section-base bg-[var(--surface)]">
        <div className="container mx-auto max-w-[1280px]">
          <div className="mb-14 reveal">
            <p className="flex items-center gap-3 text-[11px] tracking-[5px] text-gold font-montserrat font-bold uppercase mb-4 before:content-[''] before:w-8 before:h-px before:bg-gold">
              Our Facilities
            </p>
            <h2 className="font-montserrat font-black uppercase" style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}>
              WORLD-CLASS <span className="text-gold">SPACES</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-14">
            {(facilities.length > 0 ? facilities : [
              { id: '1', title: 'Main Gym Floor', description: 'Premium equipment for all fitness levels', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', icon: 'dumbbell' },
              { id: '2', title: 'Swimming Pool', description: 'Olympic-grade heated pool', image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80', icon: 'waves' },
              { id: '3', title: 'Cardio Zone', description: 'State-of-the-art cardio machines', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', icon: 'heart' },
            ] as any[]).map((facility) => (
              <div key={facility.id} className="relative aspect-[4/3] overflow-hidden cursor-pointer group">
                <Image
                  src={facility.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'}
                  alt={facility.title}
                  fill
                  className="object-cover grayscale-[40%] transition-all duration-500 group-hover:scale-[1.08] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.9)] via-[rgba(5,5,5,0.2)] to-transparent flex flex-col justify-end p-7 transition-all group-hover:from-[rgba(5,5,5,0.95)]">
                  <div className="w-10 h-10 bg-[rgba(212,175,55,0.15)] border border-[var(--border)] flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="font-montserrat font-black text-lg">{facility.title}</div>
                  <p className="text-[12.5px] text-gray-400 mt-1.5 max-h-0 overflow-hidden transition-all group-hover:max-h-16">
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          GALLERY
      ═══════════════════════════ */}
      <section id="gallery" className="section-base bg-[var(--bg)]" onClick={() => trackEvent('galleryViews')}>
        <div className="container mx-auto max-w-[1280px]">
          <div className="text-center mb-14 reveal">
            <p className="section-label justify-center flex items-center gap-3 text-[11px] tracking-[5px] text-gold font-montserrat font-bold uppercase mb-4">
              <span className="w-8 h-px bg-gold" />Gallery<span className="w-8 h-px bg-gold" />
            </p>
            <h2 className="font-montserrat font-black uppercase" style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}>
              OUR <span className="text-gold">CLUB</span>
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-14">
            {(gallery.length > 0 ? gallery.slice(0, 7) : [
              { id: '1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', caption: 'Main Floor' },
              { id: '2', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', caption: 'Training' },
              { id: '3', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800', caption: 'Cardio' },
              { id: '4', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', caption: 'Weights' },
              { id: '5', url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800', caption: 'Pool' },
            ] as any[]).map((img, i) => (
              <div
                key={img.id}
                className={`relative overflow-hidden cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '1' : '1' }}
                onClick={() => setLightbox({ open: true, idx: i })}
              >
                <Image
                  src={img.url}
                  alt={img.caption || `Gallery ${i + 1}`}
                  fill
                  className="object-cover grayscale-[20%] transition-transform duration-500 group-hover:scale-[1.07] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-[rgba(212,175,55,0.08)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border border-transparent group-hover:border-gold">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.95)] z-[8000] flex items-center justify-center"
            onClick={() => setLightbox({ ...lightbox, open: false })}
          >
            <button className="absolute top-6 right-8 text-white text-3xl w-11 h-11 border border-[var(--border)] hover:border-gold hover:text-gold transition-all">✕</button>
            <Image
              src={(gallery.length > 0 ? gallery[lightbox.idx]?.url : '') || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200'}
              alt="Gallery"
              width={1200}
              height={800}
              className="max-w-[90vw] max-h-[85vh] object-contain border border-[var(--border)]"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════
          STATS
      ═══════════════════════════ */}
      <section id="stats" className="py-0 bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] border-t border-b border-[var(--border)]">
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--border)]">
          {(about?.stats || [
            { number: '2000+', label: 'Active Members' },
            { number: '15+', label: 'Expert Coaches' },
            { number: '5+', label: 'Years of Excellence' },
            { number: '98%', label: 'Satisfaction Rate' },
          ]).map((stat, i) => (
            <div key={i} className="bg-[var(--bg)] py-14 px-10 text-center relative overflow-hidden border-r border-[var(--border)] last:border-r-0 reveal">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gold" />
              <div className="font-montserrat font-black text-[64px] leading-none text-gold">{stat.number}</div>
              <div className="font-montserrat font-semibold text-[11px] tracking-[4px] text-gray-400 uppercase mt-2.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════
          TESTIMONIALS
      ═══════════════════════════ */}
      <section id="reviews" className="section-base bg-[var(--bg)] overflow-hidden">
        <div className="text-center mb-14 reveal">
          <p className="flex items-center justify-center gap-3 text-[11px] tracking-[5px] text-gold font-montserrat font-bold uppercase mb-4">
            <span className="w-8 h-px bg-gold" />Member Reviews<span className="w-8 h-px bg-gold" />
          </p>
          <h2 className="font-montserrat font-black uppercase" style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}>
            SUCCESS <span className="text-gold">STORIES</span>
          </h2>
          <div className="w-14 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto mt-5" />
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 w-24 h-full z-10 pointer-events-none bg-gradient-to-r from-[var(--bg)] to-transparent" />
          <div className="absolute right-0 top-0 w-24 h-full z-10 pointer-events-none bg-gradient-to-l from-[var(--bg)] to-transparent" />
          <div className="flex gap-6 animate-[slide_28s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {[...(testimonials.length > 0 ? testimonials : [
              { id: '1', name: 'Ahmed Hassan', rating: 5, comment: 'Best gym in Fayoum by far. The equipment is premium and the coaches are incredibly professional.', memberSince: '2022', initials: 'AH' },
              { id: '2', name: 'Sara Mohamed', rating: 5, comment: 'I lost 15kg in 3 months with the help of the amazing team here. Highly recommend!', memberSince: '2023', initials: 'SM' },
              { id: '3', name: 'Omar Khalil', rating: 5, comment: 'The swimming pool and gym combination is unbeatable. Great value for money.', memberSince: '2021', initials: 'OK' },
            ] as any[]), ...(testimonials.length > 0 ? testimonials : [
              { id: '4', name: 'Nour Ali', rating: 5, comment: 'The ladies section is clean, private, and well-equipped. Feel safe and comfortable here.', memberSince: '2022', initials: 'NA' },
            ] as any[])].map((t, i) => (
              <div key={`${t.id}-${i}`} className="bg-[var(--surface)] border border-[var(--border)] p-8 w-[340px] flex-shrink-0 relative hover:border-[rgba(212,175,55,0.4)] transition-colors">
                <div className="absolute top-5 right-6 text-[72px] leading-none text-[rgba(212,175,55,0.08)] font-serif font-black select-none">"</div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-[14px] leading-relaxed text-gray-400 italic mb-5">{t.comment}</p>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full border-2 border-[var(--border)] bg-[var(--bg)] flex items-center justify-center font-montserrat font-black text-base text-gold">
                    {t.initials || t.name?.[0]}
                  </div>
                  <div>
                    <div className="font-montserrat font-bold text-[14px]">{t.name}</div>
                    <div className="text-[11px] text-gray-400">Member since {t.memberSince}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          CONTACT
      ═══════════════════════════ */}
      <section id="contact" className="section-base bg-[var(--surface)]">
        <div className="container mx-auto max-w-[1280px]">
          <div className="text-center mb-14 reveal">
            <p className="flex items-center justify-center gap-3 text-[11px] tracking-[5px] text-gold font-montserrat font-bold uppercase mb-4">
              <span className="w-8 h-px bg-gold" />Contact Us<span className="w-8 h-px bg-gold" />
            </p>
            <h2 className="font-montserrat font-black uppercase" style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}>
              GET IN <span className="text-gold">TOUCH</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div className="reveal left">
              {[
                { icon: 'phone', label: 'Phone', value: s.phone, link: `tel:${s.phone}` },
                { icon: 'mail', label: 'Email', value: s.email, link: `mailto:${s.email}` },
                { icon: 'map-pin', label: 'Location', value: s.address },
              ].map((item) => (
                <div key={item.icon} className="flex gap-4 items-start mb-7">
                  <div className="w-12 h-12 bg-[rgba(212,175,55,0.08)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                      {item.icon === 'phone' && <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6A16 16 0 0 0 15.4 16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 23 17.12v-.2z"/></>}
                      {item.icon === 'mail' && <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>}
                      {item.icon === 'map-pin' && <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>}
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[3px] text-gold font-montserrat font-bold uppercase mb-1.5">{item.label}</div>
                    {item.link
                      ? <a href={item.link} className="text-[14px] text-white hover:text-gold transition-colors">{item.value}</a>
                      : <div className="text-[14px]">{item.value}</div>
                    }
                  </div>
                </div>
              ))}

              <div className="flex gap-3.5 mt-9 flex-wrap">
                <a href={s.whatsapp} target="_blank" onClick={() => trackEvent('whatsappClicks')}
                  className="inline-flex items-center gap-2 bg-[#25d366] text-white font-montserrat font-bold text-[11px] tracking-[2px] uppercase px-5 py-3 clip-btn-sm hover:brightness-110 transition-all">
                  WhatsApp
                </a>
                {s.facebook && <a href={s.facebook} target="_blank" className="inline-flex items-center gap-2 border border-[var(--border)] text-gray-400 font-montserrat font-bold text-[11px] tracking-[2px] uppercase px-5 py-3 clip-btn-sm hover:border-gold hover:text-gold transition-all">Facebook</a>}
                {s.instagram && <a href={s.instagram} target="_blank" className="inline-flex items-center gap-2 border border-[var(--border)] text-gray-400 font-montserrat font-bold text-[11px] tracking-[2px] uppercase px-5 py-3 clip-btn-sm hover:border-gold hover:text-gold transition-all">Instagram</a>}
              </div>
            </div>

            {/* Contact Form / Map */}
            <div className="reveal right">
              {submitted ? (
                <div className="border border-gold bg-[rgba(212,175,55,0.05)] p-10 text-center">
                  <div className="text-gold text-5xl mb-4">✓</div>
                  <h3 className="font-montserrat font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We&apos;ll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input
                      className="form-input"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-input resize-none"
                      rows={5}
                      placeholder="Tell us about your fitness goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-br from-gold to-gold-dark text-black font-montserrat font-bold text-[12px] tracking-[2px] uppercase py-4 clip-btn hover:brightness-110 transition-all disabled:opacity-60"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}

              {s.googleMapsEmbed && (
                <div className="border border-[var(--border)] overflow-hidden relative h-64 mt-6">
                  <iframe src={s.googleMapsEmbed} className="w-full h-full border-none grayscale-[40%] invert hue-rotate-180" />
                  <div className="absolute top-4 left-4 bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] px-4 py-2 font-montserrat font-bold text-[11px] tracking-[2px] text-gold uppercase">
                    Find Us
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          FOOTER
      ═══════════════════════════ */}
      <footer className="bg-[var(--bg)] border-t border-[var(--border)] pt-16 pb-8 px-10">
        <div className="container mx-auto max-w-[1280px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <svg viewBox="0 0 44 44" fill="none" className="w-10 h-10">
                  <path d="M22 3L40 11V26C40 35 32 41 22 44C12 41 4 35 4 26V11Z" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
                  <rect x="13" y="20" width="18" height="4" rx="1.5" fill="#D4AF37"/>
                </svg>
                <div className="font-montserrat font-black text-[14px]">
                  PHYSIO SLIM<span className="text-gold block text-[9px] tracking-[3px]">HEALTH CLUB</span>
                </div>
              </div>
              <p className="text-[13.5px] text-gray-400 leading-relaxed max-w-[280px]">
                {s.footerTagline || "Fayoum's premier fitness destination. Transform your body, mind, and life."}
              </p>
              <div className="flex gap-3 mt-5">
                {[s.facebook, s.instagram, s.tiktok].filter(Boolean).map((link, i) => (
                  <a key={i} href={link} target="_blank" className="w-10 h-10 border border-[var(--border)] flex items-center justify-center hover:border-gold hover:bg-[rgba(212,175,55,0.1)] transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="1.5">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="font-montserrat font-black text-[12px] tracking-[3px] uppercase text-gold mb-5">Quick Links</div>
              <ul className="space-y-3">
                {['Home', 'Memberships', 'Facilities', 'Gallery', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-gray-400 text-[13px] hover:text-gold transition-colors flex items-center gap-2 group">
                      <span className="w-4 h-px bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-montserrat font-black text-[12px] tracking-[3px] uppercase text-gold mb-5">Services</div>
              <ul className="space-y-3">
                {['Personal Training', 'Group Classes', 'Swimming Pool', 'Ladies Section', 'Kids Program'].map((s) => (
                  <li key={s} className="text-gray-400 text-[13px]">{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-montserrat font-black text-[12px] tracking-[3px] uppercase text-gold mb-5">Contact</div>
              {[
                { icon: 'phone', text: s.phone },
                { icon: 'mail', text: s.email },
                { icon: 'map-pin', text: s.address },
              ].map((item) => (
                <div key={item.icon} className="flex gap-3 items-start mb-3.5 text-[13px] text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                    {item.icon === 'phone' && <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6A16 16 0 0 0 15.4 16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 23 17.12v-.2z"/>}
                    {item.icon === 'mail' && <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>}
                    {item.icon === 'map-pin' && <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>}
                  </svg>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-7 flex flex-wrap justify-between items-center gap-4">
            <p className="text-[12px] text-gray-600">
              {s.copyright || `© ${new Date().getFullYear()} Physio Slim Health Club. All rights reserved.`}
            </p>
            <p className="text-[12px] text-gray-600">
              Crafted with passion in <span className="text-gold">Fayoum, Egypt</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href={s.whatsapp}
        target="_blank"
        onClick={() => trackEvent('whatsappClicks')}
        className="fixed bottom-7 left-7 z-[500] w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform animate-[waBounce_2s_ease-in-out_infinite]"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  )
}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={trainer.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'} alt={trainer.name} fill
                    className="object-cover object-top grayscale-[20%] transition-all duration-500 group-hover:scale-[1.06] group-hover:grayscale-0" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.75)] via-transparent to-transparent" />
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-montserrat font-black text-xl leading-tight">{trainer.name}</div>
                      <div className="text-[11px] tracking-[2px] text-gold font-montserrat font-bold uppercase mt-1">{trainer.role || trainer.specialization}</div>
                    </div>
                    <div className="text-[12px] text-gray-400 font-montserrat font-bold">{trainer.experience}</div>
                  </div>
                  {trainer.bio && <p className="text-[13px] text-gray-400 leading-relaxed mb-4">{trainer.bio}</p>}
                  {trainer.certifications && trainer.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {trainer.certifications.slice(0, 3).map((cert: string) => (
                        <span key={cert} className="text-[10px] tracking-[0.5px] border border-[rgba(212,175,55,0.15)] text-gray-400 px-2 py-1 font-montserrat">{cert}</span>
                      ))}
                    </div>
                  )}
                  <a href={s.whatsapp} target="_blank" onClick={() => trackEvent('whatsappClicks')}
                    className="w-full flex items-center justify-center gap-2 border border-[rgba(212,175,55,0.2)] text-gold font-montserrat font-bold text-[11px] tracking-[2px] uppercase py-2.5 hover:border-gold hover:bg-[rgba(212,175,55,0.06)] transition-all">
                    Book Session <Icon name="arrow" size={12} stroke="currentColor" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformations */}
      <TransformationsSection whatsapp={s.whatsapp} />

      {/* ═══════════════════════════
          GALLERY
      ═══════════════════════════ */}
      <section id="gallery" className="section-base bg-[var(--bg)]" onClick={() => trackEvent('galleryViews')}>
        <div className="container mx-auto max-w-[1280px]">
          <div className="text-center mb-12 reveal">
            <div className="section-eyebrow justify-center mb-4">Gallery</div>
            <h2 className="font-montserrat font-black uppercase leading-none" style={{ fontSize: 'clamp(32px,5vw,58px)' }}>
              OUR <span className="text-gold">CLUB</span>
            </h2>
            <div className="gold-divider center mt-5" />
          </div>

          {galleryCats.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {galleryCats.map(cat => (
                <button key={cat} onClick={() => setGalleryFilter(cat)}
                  className={`px-5 py-2 font-montserrat font-bold text-[10px] tracking-[2px] uppercase border transition-all ${galleryFilter === cat ? 'border-gold text-gold bg-[rgba(212,175,55,0.08)]' : 'border-[rgba(212,175,55,0.12)] text-gray-400 hover:border-gold hover:text-gold'}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <AnimatePresence>
              {filteredGallery.slice(0, 8).map((img: any, i: number) => (
                <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative overflow-hidden cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                  style={{ aspectRatio: '1' }}
                  onClick={() => setLightbox({ open: true, idx: i })}>
                  <Image src={img.url} alt={img.caption || `Gallery ${i + 1}`} fill
                    className="object-cover grayscale-[15%] transition-all duration-500 group-hover:scale-[1.07] group-hover:grayscale-0" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-[rgba(5,5,5,0)] group-hover:bg-[rgba(5,5,5,0.38)] transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 border border-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[rgba(5,5,5,0.6)]">
                      <Icon name="zoom" size={20} stroke="#D4AF37" />
                    </div>
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[rgba(5,5,5,0.85)] to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                      <span className="font-montserrat font-bold text-[11px] tracking-[1px] uppercase">{img.caption}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.97)] z-[8000] flex items-center justify-center"
            onClick={() => setLightbox({ ...lightbox, open: false })}>
            <button className="absolute top-6 right-8 w-11 h-11 border border-[rgba(212,175,55,0.2)] hover:border-gold flex items-center justify-center transition-all">
              <Icon name="close" size={18} stroke="white" />
            </button>
            <button className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 border border-[rgba(212,175,55,0.2)] hover:border-gold flex items-center justify-center transition-all"
              onClick={e => { e.stopPropagation(); setLightbox(p => ({ ...p, idx: (p.idx - 1 + filteredGallery.length) % filteredGallery.length })) }}>
              <Icon name="chevLeft" size={18} stroke="white" />
            </button>
            <button className="absolute right-24 top-1/2 -translate-y-1/2 w-11 h-11 border border-[rgba(212,175,55,0.2)] hover:border-gold flex items-center justify-center transition-all"
              onClick={e => { e.stopPropagation(); setLightbox(p => ({ ...p, idx: (p.idx + 1) % filteredGallery.length })) }}>
              <Icon name="chevRight" size={18} stroke="white" />
            </button>
            <Image src={filteredGallery[lightbox.idx]?.url || ''} alt="Gallery" width={1200} height={800}
              className="max-w-[88vw] max-h-[88vh] object-contain border border-[rgba(212,175,55,0.15)]"
              onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════
          TESTIMONIALS
      ═══════════════════════════ */}
      <section id="reviews" className="section-base bg-[var(--surface)] overflow-hidden">
        <div className="text-center mb-16 reveal">
          <div className="section-eyebrow justify-center mb-4">Member Reviews</div>
          <h2 className="font-montserrat font-black uppercase leading-none" style={{ fontSize: 'clamp(32px,5vw,58px)' }}>
            SUCCESS <span className="text-gold">STORIES</span>
          </h2>
          <div className="gold-divider center mt-5" />
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 w-32 h-full z-10 pointer-events-none bg-gradient-to-r from-[var(--surface)] to-transparent" />
          <div className="absolute right-0 top-0 w-32 h-full z-10 pointer-events-none bg-gradient-to-l from-[var(--surface)] to-transparent" />
          <div className="flex gap-5 animate-[slide_32s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {[...(testimonials.length > 0 ? testimonials : [
              { id: '1', name: 'Ahmed Hassan', rating: 5, comment: 'Best gym in Fayoum by far. The equipment is premium and the coaches are incredibly professional. Transformed my physique in 4 months.', memberSince: '2022', initials: 'AH' },
              { id: '2', name: 'Sara Mohamed', rating: 5, comment: 'I lost 15kg in 3 months with the help of the amazing team here. The ladies section is private, clean, and well-equipped. Highly recommend!', memberSince: '2023', initials: 'SM' },
              { id: '3', name: 'Omar Khalil', rating: 5, comment: 'The swimming pool and gym combination is unbeatable. The personal training sessions changed everything for me. Great value.', memberSince: '2021', initials: 'OK' },
              { id: '4', name: 'Nour Ali', rating: 5, comment: 'The coaches actually care about your progress and push you to achieve more. Best investment in my health I have ever made.', memberSince: '2022', initials: 'NA' },
              { id: '5', name: 'Mohamed Tarek', rating: 5, comment: 'Outstanding facilities and staff. The nutrition coaching alongside my training program gave me results I never thought possible.', memberSince: '2023', initials: 'MT' },
            ] as any[]), ...(testimonials.length > 0 ? testimonials : [
              { id: '6', name: 'Layla Youssef', rating: 5, comment: 'Premium equipment, expert coaches, and a community that supports you every step. The best fitness club in Fayoum without question.', memberSince: '2022', initials: 'LY' },
            ] as any[])].map((t, i) => (
              <div key={`${t.id}-${i}`} className="bg-[var(--card)] border border-[rgba(212,175,55,0.08)] p-8 w-[360px] flex-shrink-0 relative hover:border-[rgba(212,175,55,0.25)] transition-all group hover:-translate-y-1">
                <div className="absolute top-5 right-6 font-serif font-black text-[80px] leading-none text-[rgba(212,175,55,0.06)] select-none">"</div>
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-[14px] leading-[1.8] text-gray-300 mb-6 italic">{t.comment}</p>
                <div className="flex items-center gap-4 pt-5 border-t border-[rgba(212,175,55,0.07)]">
                  <div className="w-11 h-11 border border-[rgba(212,175,55,0.2)] bg-gradient-to-br from-[rgba(212,175,55,0.15)] to-transparent flex items-center justify-center font-montserrat font-black text-[15px] text-gold flex-shrink-0">
                    {t.initials || t.name?.[0]}
                  </div>
                  <div>
                    <div className="font-montserrat font-bold text-[14px]">{t.name}</div>
                    <div className="text-[11px] text-gray-500 font-montserrat">Member since {t.memberSince}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculators */}
      <FitnessCalculators />

      {/* AI Features */}
      <AIFeaturesSection whatsapp={s.whatsapp} />

      {/* Member Portal */}
      <MemberPortalSection whatsapp={s.whatsapp} />

      {/* ═══════════════════════════
          CONTACT
      ═══════════════════════════ */}
      <section id="contact" className="section-base bg-[var(--bg)]">
        <div className="container mx-auto max-w-[1280px]">
          <div className="text-center mb-16 reveal">
            <div className="section-eyebrow justify-center mb-4">Contact Us</div>
            <h2 className="font-montserrat font-black uppercase leading-none" style={{ fontSize: 'clamp(32px,5vw,58px)' }}>
              GET IN <span className="text-gold">TOUCH</span>
            </h2>
            <div className="gold-divider center mt-5" />
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="reveal left space-y-5">
              {[
                { icon: 'phone', label: 'Phone', value: s.phone, link: `tel:${s.phone}` },
                { icon: 'mail', label: 'Email', value: s.email, link: `mailto:${s.email}` },
                { icon: 'pin', label: 'Location', value: s.address },
              ].map((item) => (
                <div key={item.icon} className="flex gap-5 items-center p-5 border border-[rgba(212,175,55,0.08)] hover:border-[rgba(212,175,55,0.25)] transition-colors">
                  <div className="w-12 h-12 bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.15)] flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={20} stroke="#D4AF37" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[3px] text-gold font-montserrat font-bold uppercase mb-1">{item.label}</div>
                    {item.link
                      ? <a href={item.link} className="text-[15px] text-white hover:text-gold transition-colors font-medium">{item.value}</a>
                      : <div className="text-[15px]">{item.value}</div>}
                  </div>
                </div>
              ))}
              <div className="flex gap-3 flex-wrap pt-2">
                <a href={s.whatsapp} target="_blank" onClick={() => trackEvent('whatsappClicks')}
                  className="inline-flex items-center gap-2 bg-[#25d366] text-white font-montserrat font-bold text-[11px] tracking-[2px] uppercase px-6 py-3 clip-btn-sm hover:brightness-110 transition-all">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
                  WhatsApp
                </a>
                {s.facebook !== '#' && <a href={s.facebook} target="_blank" className="inline-flex items-center gap-2 border border-[rgba(212,175,55,0.2)] text-gray-400 font-montserrat font-bold text-[11px] tracking-[2px] uppercase px-5 py-3 clip-btn-sm hover:border-gold hover:text-gold transition-all">Facebook</a>}
                {s.instagram !== '#' && <a href={s.instagram} target="_blank" className="inline-flex items-center gap-2 border border-[rgba(212,175,55,0.2)] text-gray-400 font-montserrat font-bold text-[11px] tracking-[2px] uppercase px-5 py-3 clip-btn-sm hover:border-gold hover:text-gold transition-all">Instagram</a>}
              </div>
              {s.googleMapsEmbed && (
                <div className="border border-[rgba(212,175,55,0.15)] overflow-hidden relative h-56 mt-2">
                  <iframe src={s.googleMapsEmbed} className="w-full h-full border-none grayscale-[50%] invert hue-rotate-180" />
                  <div className="absolute top-4 left-4 bg-[var(--glass)] backdrop-blur-xl border border-[rgba(212,175,55,0.2)] px-4 py-2 font-montserrat font-bold text-[10px] tracking-[2px] text-gold uppercase">Find Us</div>
                </div>
              )}
            </div>
            <div className="reveal right">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="border border-gold bg-[rgba(212,175,55,0.04)] p-14 text-center">
                  <div className="w-16 h-16 border-2 border-gold flex items-center justify-center mx-auto mb-6">
                    <Icon name="check" size={28} stroke="#D4AF37" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-montserrat font-black text-2xl mb-3">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5 bg-[var(--card)] border border-[rgba(212,175,55,0.1)] p-9">
                  <div className="text-[10px] tracking-[4px] text-gold font-montserrat font-bold uppercase mb-6">Send Us a Message</div>
                  <div><label className="form-label">Full Name</label><input className="form-input" placeholder="Your full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                  <div><label className="form-label">Phone Number</label><input className="form-input" placeholder="+20 1XX XXX XXXX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required /></div>
                  <div><label className="form-label">Message</label><textarea className="form-input resize-none" rows={4} placeholder="Tell us about your fitness goals..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required /></div>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-gradient-to-r from-gold to-gold-dark text-black font-montserrat font-black text-[12px] tracking-[2.5px] uppercase py-4 clip-btn hover:brightness-110 transition-all disabled:opacity-60">
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-[11px] text-gray-500 text-center">Or reach us directly on WhatsApp for instant response</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          FOOTER
      ═══════════════════════════ */}
      <footer className="bg-[var(--surface)] border-t border-[rgba(212,175,55,0.12)] pt-20 pb-8 px-8">
        <div className="container mx-auto max-w-[1280px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <svg viewBox="0 0 44 44" fill="none" className="w-10 h-10">
                  <path d="M22 3L40 11V26C40 35 32 41 22 44C12 41 4 35 4 26V11Z" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
                  <rect x="13" y="20" width="18" height="4" rx="1.5" fill="#D4AF37"/>
                </svg>
                <div className="font-montserrat font-black text-[14px]">PHYSIO SLIM<span className="text-gold block text-[9px] tracking-[3px] font-semibold">HEALTH CLUB</span></div>
              </div>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-5">
                {(s as any).footerTagline || "Fayoum's premier fitness destination. Transform your body, mind, and life with Egypt's finest coaching team."}
              </p>
              <div className="flex gap-2.5">
                {[s.facebook, s.instagram, s.tiktok].filter(l => l && l !== '#').map((link, i) => (
                  <a key={i} href={link} target="_blank" className="w-9 h-9 border border-[rgba(212,175,55,0.15)] flex items-center justify-center hover:border-gold hover:bg-[rgba(212,175,55,0.07)] transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5"><rect width="20" height="20" x="2" y="2" rx="5"/></svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="font-montserrat font-black text-[11px] tracking-[3px] uppercase text-gold mb-6">Quick Links</div>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-gray-500 text-[13px] hover:text-gold transition-colors flex items-center gap-2 group">
                      <span className="w-4 h-px bg-gold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />{link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-montserrat font-black text-[11px] tracking-[3px] uppercase text-gold mb-6">Services</div>
              <ul className="space-y-3">
                {['Personal Training', 'Group Classes', 'Swimming Pool', 'Ladies Section', 'Kids Program', 'Nutrition Coaching', 'Body Composition', 'Online Coaching'].map((sv) => (
                  <li key={sv} className="text-gray-500 text-[13px] hover:text-gold transition-colors cursor-default">{sv}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-montserrat font-black text-[11px] tracking-[3px] uppercase text-gold mb-6">Contact</div>
              <div className="space-y-4">
                {[{ icon: 'phone', text: s.phone }, { icon: 'mail', text: s.email }, { icon: 'pin', text: s.address }].map((item) => (
                  <div key={item.icon} className="flex gap-3 items-start text-[13px] text-gray-500">
                    <div className="mt-0.5 flex-shrink-0"><Icon name={item.icon} size={15} stroke="#D4AF37" /></div>
                    {item.text}
                  </div>
                ))}
                <div className="pt-3">
                  <div className="font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-gold mb-2">Hours</div>
                  <div className="text-[13px] text-gray-500">Mon – Fri: 6:00 AM – 11:00 PM</div>
                  <div className="text-[13px] text-gray-500">Sat – Sun: 8:00 AM – 10:00 PM</div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[rgba(212,175,55,0.08)] pt-7 flex flex-wrap justify-between items-center gap-4">
            <p className="text-[12px] text-gray-600">{s.copyright || `© ${new Date().getFullYear()} Physio Slim Health Club. All rights reserved.`}</p>
            <p className="text-[12px] text-gray-600">Crafted with passion in <span className="text-gold">Fayoum, Egypt</span></p>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a href={s.whatsapp} target="_blank" onClick={() => trackEvent('whatsappClicks')}
        className="fixed bottom-7 right-7 z-[500] w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center hover:scale-110 transition-transform animate-[waBounce_3s_ease-in-out_infinite] relative"
        aria-label="WhatsApp" style={{ boxShadow: '0 4px 24px rgba(37,211,102,0.4)' }}>
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute inset-0 rounded-full border-2 border-[#25d366] animate-[pulseRing_2s_ease-out_infinite]" />
      </a>
    </>
  )
}
