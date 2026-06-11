'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin Layout
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getNotifications, markNotificationRead } from '@/lib/firestore'
import type { Notification } from '@/types'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/hero', label: 'Hero', icon: 'image' },
  { href: '/admin/memberships', label: 'Memberships', icon: 'credit-card' },
  { href: '/admin/gallery', label: 'Gallery', icon: 'camera' },
  { href: '/admin/facilities', label: 'Facilities', icon: 'building' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'message-square' },
  { href: '/admin/trainers', label: 'Trainers', icon: 'users' },
  { href: '/admin/offers', label: 'Offers', icon: 'tag' },
  { href: '/admin/leads', label: 'Leads', icon: 'inbox' },
  { href: '/admin/media', label: 'Media Library', icon: 'folder' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'bar-chart' },
  { href: '/admin/contact', label: 'Contact Info', icon: 'phone' },
  { href: '/admin/seo', label: 'SEO', icon: 'search' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
  { href: '/admin/users', label: 'Users', icon: 'user-check', superAdminOnly: true },
]

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    image: <><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
    'credit-card': <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
    camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>,
    building: <><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></>,
    'message-square': <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    tag: <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></>,
    inbox: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    folder: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
    'bar-chart': <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.09h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    'user-check': <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    'log-out': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || null}
    </svg>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, adminUser, role, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      getNotifications().then(setNotifications).catch(() => {})
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-gold font-montserrat font-bold text-sm tracking-widest uppercase animate-pulse">
          Loading...
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-dark flex">
      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[var(--surface)] border-r border-[var(--border)] flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <svg viewBox="0 0 44 44" fill="none" className="w-8 h-8 flex-shrink-0">
            <path d="M22 3L40 11V26C40 35 32 41 22 44C12 41 4 35 4 26V11Z" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
            <rect x="13" y="20" width="18" height="4" rx="1.5" fill="#D4AF37"/>
          </svg>
          {sidebarOpen && (
            <div className="font-montserrat font-black text-[13px] leading-tight">
              PHYSIO SLIM
              <span className="text-gold block text-[9px] tracking-[2px] font-semibold">ADMIN</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            if (item.superAdminOnly && role !== 'super_admin') return null
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 mb-0.5 transition-all text-[13px] font-montserrat font-semibold rounded-none ${
                  active
                    ? 'bg-[rgba(212,175,55,0.1)] border-l-2 border-gold text-gold'
                    : 'text-gray-400 hover:text-gold hover:bg-[rgba(212,175,55,0.05)]'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="flex-shrink-0"><NavIcon name={item.icon} /></span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={() => signOut().then(() => router.push('/admin/login'))}
            className={`flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full text-[13px] font-montserrat font-semibold`}
          >
            <NavIcon name="log-out" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Topbar */}
        <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gold transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative text-gray-400 hover:text-gold transition-colors"
              >
                <NavIcon name="bell" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-montserrat">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-8 w-72 bg-[var(--card)] border border-[var(--border)] shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-[var(--border)] font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-[13px] text-gray-400 text-center">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id)
                            setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))
                          }}
                          className={`px-4 py-3 border-b border-[var(--border)] cursor-pointer hover:bg-[rgba(212,175,55,0.05)] ${!n.read ? 'border-l-2 border-l-gold' : ''}`}
                        >
                          <div className="font-montserrat font-semibold text-[12px] text-white">{n.title}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[rgba(212,175,55,0.15)] border border-[var(--border)] flex items-center justify-center font-montserrat font-black text-[13px] text-gold">
                {adminUser?.displayName?.[0] || adminUser?.email?.[0] || 'A'}
              </div>
              <div className="text-[12px]">
                <div className="font-montserrat font-semibold text-white">{adminUser?.displayName || 'Admin'}</div>
                <div className="text-gold text-[10px] tracking-[1px] uppercase font-montserrat">{role}</div>
              </div>
            </div>

            {/* View Site */}
            <Link
              href="/site"
              target="_blank"
              className="text-[11px] font-montserrat font-bold tracking-[1.5px] uppercase text-gray-400 hover:text-gold transition-colors border border-[var(--border)] hover:border-gold px-3 py-1.5"
            >
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
