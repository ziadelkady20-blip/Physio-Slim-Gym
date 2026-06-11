'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Analytics
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getLeads } from '@/lib/firestore'
import { AdminPageHeader } from '@/components/admin'

interface DayData {
  date: string
  websiteVisits: number
  whatsappClicks: number
  membershipClicks: number
  contactFormSubmissions: number
  galleryViews: number
}

function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-4">
      <div className="w-36 text-[11px] text-gray-400 font-montserrat font-semibold truncate">{label}</div>
      <div className="flex-1 h-1.5 bg-[var(--border)]">
        <div className="h-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="w-10 text-right text-[12px] font-montserrat font-bold" style={{ color }}>{value}</div>
    </div>
  )
}

export default function AnalyticsAdminPage() {
  const [days, setDays] = useState<DayData[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDocs(query(collection(db, 'analytics'), orderBy('date', 'desc'), limit(30))),
      getLeads(),
    ]).then(([snap, l]) => {
      setDays(snap.docs.map((d) => ({ date: d.id, ...d.data() } as DayData)).reverse())
      setLeads(l)
    }).finally(() => setLoading(false))
  }, [])

  const totals = days.reduce(
    (acc, d) => ({
      visits: acc.visits + (d.websiteVisits || 0),
      whatsapp: acc.whatsapp + (d.whatsappClicks || 0),
      membership: acc.membership + (d.membershipClicks || 0),
      leads: acc.leads + (d.contactFormSubmissions || 0),
      gallery: acc.gallery + (d.galleryViews || 0),
    }),
    { visits: 0, whatsapp: 0, membership: 0, leads: 0, gallery: 0 }
  )

  const maxDay = days.reduce((max, d) => Math.max(max, d.websiteVisits || 0), 0)

  // Lead conversion stats
  const leadsByStatus = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const cards = [
    { label: 'Website Visits', value: totals.visits, color: '#D4AF37' },
    { label: 'WhatsApp Clicks', value: totals.whatsapp, color: '#25d366' },
    { label: 'Membership Clicks', value: totals.membership, color: '#3b82f6' },
    { label: 'Form Submissions', value: totals.leads, color: '#a855f7' },
    { label: 'Gallery Views', value: totals.gallery, color: '#f97316' },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Analytics DASHBOARD"
        subtitle="30-day overview"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-[var(--surface)] border border-[var(--border)] p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: c.color }} />
            <div className="font-montserrat font-black text-3xl" style={{ color: c.color }}>{loading ? '—' : c.value}</div>
            <div className="text-[10px] tracking-[1.5px] uppercase font-montserrat font-bold text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Traffic Chart (simple bars) */}
      <div className="bg-[var(--surface)] border border-[var(--border)]">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">Daily Website Visits (30 days)</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="h-32 skeleton" />
          ) : days.length === 0 ? (
            <div className="text-center text-gray-400 text-[13px] py-10">No data yet. Visits are tracked automatically.</div>
          ) : (
            <div className="flex items-end gap-1 h-32">
              {days.map((d) => {
                const h = maxDay > 0 ? Math.max(4, Math.round(((d.websiteVisits || 0) / maxDay) * 128)) : 4
                return (
                  <div key={d.date} className="flex-1 group relative" style={{ height: `${h}px` }}>
                    <div
                      className="w-full h-full bg-[rgba(212,175,55,0.3)] hover:bg-gold transition-colors"
                      title={`${d.date}: ${d.websiteVisits || 0} visits`}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[var(--card)] border border-[var(--border)] px-2 py-1 text-[9px] font-montserrat whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {d.date.slice(5)}: {d.websiteVisits || 0}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)]">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">Engagement Breakdown</h2>
          </div>
          <div className="p-6 space-y-4">
            {cards.map((c) => (
              <MetricBar key={c.label} label={c.label} value={c.value} max={totals.visits || 1} color={c.color} />
            ))}
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)]">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">Lead Status Distribution</h2>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(leadsByStatus).length === 0 ? (
              <div className="text-center text-gray-400 text-[13px] py-6">No leads yet</div>
            ) : (
              Object.entries(leadsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-[12px] font-montserrat font-semibold capitalize text-gray-300">{status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-[var(--border)]">
                      <div
                        className="h-full bg-gold"
                        style={{ width: `${Math.round((count / leads.length) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-montserrat font-bold text-gold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            )}
            {leads.length > 0 && (
              <div className="border-t border-[var(--border)] pt-3 flex justify-between text-[12px]">
                <span className="text-gray-400">Total leads</span>
                <span className="font-montserrat font-bold text-gold">{leads.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
