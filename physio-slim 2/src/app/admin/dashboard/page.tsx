'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin Dashboard
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAnalyticsSummary, getLeads, getNotifications } from '@/lib/firestore'
import type { AnalyticsSummary, Lead, Notification } from '@/types'
import { useAuth } from '@/lib/auth-context'

function StatCard({ label, value, icon, color, href }: {
  label: string; value: number | string; icon: string; color: string; href?: string
}) {
  const inner = (
    <div className={`bg-[var(--surface)] border border-[var(--border)] p-6 relative overflow-hidden group hover:border-gold transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,175,55,0.1)]`}>
      <div className="absolute top-0 left-0 w-1 h-full" style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] tracking-[2px] uppercase font-montserrat font-bold text-gray-500 mb-2">{label}</p>
          <p className="font-montserrat font-black text-3xl text-white">{value}</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center border border-[var(--border)] group-hover:border-gold transition-colors" style={{ background: `${color}15` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round">
            {icon === 'eye' && <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
            {icon === 'message' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>}
            {icon === 'users' && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
            {icon === 'whatsapp' && <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>}
            {icon === 'camera' && <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>}
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none"
        style={{ background: `radial-gradient(circle at bottom right, ${color}10, transparent)` }} />
    </div>
  )
  return href ? <Link href={href} className="block">{inner}</Link> : inner
}

const quickActions = [
  { label: 'Add Membership Plan', href: '/admin/memberships', icon: 'credit-card' },
  { label: 'Upload Gallery', href: '/admin/gallery', icon: 'camera' },
  { label: 'View Leads', href: '/admin/leads', icon: 'inbox' },
  { label: 'Edit Hero', href: '/admin/hero', icon: 'image' },
  { label: 'Manage Offers', href: '/admin/offers', icon: 'tag' },
  { label: 'SEO Settings', href: '/admin/seo', icon: 'search' },
]

const statusColors: Record<string, string> = {
  new: '#D4AF37',
  contacted: '#3b82f6',
  converted: '#22c55e',
  closed: '#6b7280',
}

export default function AdminDashboard() {
  const { adminUser } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAnalyticsSummary(),
      getLeads(),
      getNotifications(),
    ]).then(([a, l, n]) => {
      setAnalytics(a)
      setLeads(l.slice(0, 5))
      setNotifications(n.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat font-black text-2xl">
            {greeting}, <span className="text-gold">{adminUser?.displayName?.split(' ')[0] || 'Admin'}</span>
          </h1>
          <p className="text-gray-400 text-[13px] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/site"
          target="_blank"
          className="inline-flex items-center gap-2 border border-[var(--border)] hover:border-gold text-gray-400 hover:text-gold transition-all px-4 py-2 font-montserrat font-bold text-[11px] tracking-[1.5px] uppercase"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View Live Site
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Total Visits" value={analytics?.totalVisits ?? '—'} icon="eye" color="#D4AF37" />
        <StatCard label="WhatsApp Clicks" value={analytics?.totalWhatsapp ?? '—'} icon="whatsapp" color="#25d366" href="/admin/analytics" />
        <StatCard label="Membership Clicks" value={analytics?.totalMembership ?? '—'} icon="users" color="#3b82f6" href="/admin/analytics" />
        <StatCard label="Total Leads" value={analytics?.totalLeads ?? '—'} icon="message" color="#a855f7" href="/admin/leads" />
        <StatCard label="Gallery Views" value={analytics?.totalGalleryViews ?? '—'} icon="camera" color="#f97316" href="/admin/gallery" />
      </div>

      {/* Two-Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-montserrat font-bold text-[12px] tracking-[2px] uppercase text-gold">Recent Leads</h2>
            <Link href="/admin/leads" className="text-[11px] text-gray-400 hover:text-gold font-montserrat transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 skeleton rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 skeleton w-1/3" />
                    <div className="h-2.5 skeleton w-2/3" />
                  </div>
                </div>
              ))
            ) : leads.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-[13px]">No leads yet</div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[rgba(212,175,55,0.03)] transition-colors">
                  <div className="w-8 h-8 flex-shrink-0 bg-[rgba(212,175,55,0.1)] border border-[var(--border)] flex items-center justify-center font-montserrat font-black text-[12px] text-gold">
                    {lead.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-semibold text-[13px] truncate">{lead.name}</div>
                    <div className="text-[11px] text-gray-400 truncate">{lead.phone || lead.email || 'No contact info'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[10px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5"
                      style={{ color: statusColors[lead.status], border: `1px solid ${statusColors[lead.status]}30`, background: `${statusColors[lead.status]}10` }}
                    >
                      {lead.status}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--surface)] border border-[var(--border)]">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-montserrat font-bold text-[12px] tracking-[2px] uppercase text-gold">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-4 py-3 border border-[var(--border)] hover:border-gold hover:bg-[rgba(212,175,55,0.05)] transition-all group"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.75" strokeLinecap="round">
                  {action.icon === 'credit-card' && <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>}
                  {action.icon === 'camera' && <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>}
                  {action.icon === 'inbox' && <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>}
                  {action.icon === 'image' && <><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>}
                  {action.icon === 'tag' && <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></>}
                  {action.icon === 'search' && <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>}
                </svg>
                <span className="font-montserrat font-semibold text-[12px] text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)]">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-montserrat font-bold text-[12px] tracking-[2px] uppercase text-gold">Recent Activity</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {notifications.map((n) => (
              <div key={n.id} className={`px-6 py-3.5 flex items-start gap-4 ${!n.read ? 'border-l-2 border-l-gold' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-montserrat font-semibold text-[12px]">{n.title}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{n.message}</div>
                </div>
                <span className="text-[10px] text-gray-500 flex-shrink-0">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
