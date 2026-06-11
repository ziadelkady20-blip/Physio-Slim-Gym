'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Leads / Contact Submissions
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getLeads, updateLead, deleteLead } from '@/lib/firestore'
import { AdminPageHeader, GoldButton, ConfirmModal, useToast } from '@/components/admin'
import type { Lead } from '@/types'

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'closed'] as const
const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  new: { bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.4)', text: '#D4AF37' },
  contacted: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.4)', text: '#3b82f6' },
  converted: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.4)', text: '#22c55e' },
  closed: { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.4)', text: '#6b7280' },
}

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filtered, setFiltered] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Lead | null>(null)
  const { show, ToastContainer } = useToast()

  useEffect(() => { load() }, [])

  useEffect(() => {
    let data = leads
    if (statusFilter !== 'all') data = data.filter((l) => l.status === statusFilter)
    if (search) data = data.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search) || l.email?.includes(search))
    setFiltered(data)
  }, [leads, search, statusFilter])

  async function load() {
    try {
      const data = await getLeads()
      setLeads(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: string, status: Lead['status']) {
    try {
      await updateLead(id, { status })
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l))
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null)
      show(`Status updated to ${status}`)
    } catch {
      show('Failed to update status', 'error')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteLead(deleteId)
      setLeads((prev) => prev.filter((l) => l.id !== deleteId))
      if (selected?.id === deleteId) setSelected(null)
      show('Lead deleted')
    } catch {
      show('Failed to delete', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Leads MANAGEMENT"
        subtitle={`${leads.length} total submissions`}
      />

      {/* Status Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
            className={`p-4 border text-left transition-all hover:-translate-y-0.5 ${statusFilter === s ? 'border-gold' : 'border-[var(--border)] hover:border-[rgba(212,175,55,0.4)]'} bg-[var(--surface)]`}
          >
            <div className="font-montserrat font-black text-2xl" style={{ color: statusColors[s].text }}>{counts[s] || 0}</div>
            <div className="text-[10px] tracking-[2px] uppercase font-montserrat font-bold text-gray-500 mt-1 capitalize">{s}</div>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads..."
          className="form-input flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input min-w-[140px]"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table + Detail */}
      <div className={`grid gap-6 ${selected ? 'lg:grid-cols-3' : ''}`}>
        {/* Table */}
        <div className={`bg-[var(--surface)] border border-[var(--border)] ${selected ? 'lg:col-span-2' : ''}`}>
          <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
            <span className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">
              {filtered.length} Results
            </span>
            {search && (
              <button onClick={() => setSearch('')} className="text-[11px] text-gray-400 hover:text-gold">Clear ✕</button>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400 text-[13px]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-[13px]">No leads found</div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filtered.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-[rgba(212,175,55,0.03)] ${selected?.id === lead.id ? 'bg-[rgba(212,175,55,0.05)] border-l-2 border-l-gold' : ''}`}
                >
                  <div className="w-8 h-8 flex-shrink-0 bg-[rgba(212,175,55,0.1)] border border-[var(--border)] flex items-center justify-center font-montserrat font-black text-[12px] text-gold">
                    {lead.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-semibold text-[13px] truncate">{lead.name}</div>
                    <div className="text-[11px] text-gray-400">{lead.phone || lead.email || '—'}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span
                      className="text-[10px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 block mb-1"
                      style={{
                        color: statusColors[lead.status].text,
                        border: `1px solid ${statusColors[lead.status].border}`,
                        background: statusColors[lead.status].bg,
                      }}
                    >
                      {lead.status}
                    </span>
                    <div className="text-[10px] text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="bg-[var(--surface)] border border-[var(--border)] h-fit">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <span className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">Lead Details</span>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-[16px]">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="form-label">Name</div>
                <div className="text-[14px]">{selected.name}</div>
              </div>
              {selected.phone && (
                <div>
                  <div className="form-label">Phone</div>
                  <a href={`tel:${selected.phone}`} className="text-[14px] text-gold">{selected.phone}</a>
                </div>
              )}
              {selected.email && (
                <div>
                  <div className="form-label">Email</div>
                  <a href={`mailto:${selected.email}`} className="text-[14px] text-gold">{selected.email}</a>
                </div>
              )}
              {selected.plan && (
                <div>
                  <div className="form-label">Plan Inquiry</div>
                  <div className="text-[14px]">{selected.plan}</div>
                </div>
              )}
              <div>
                <div className="form-label">Message</div>
                <div className="text-[13px] text-gray-300 leading-relaxed bg-[rgba(212,175,55,0.03)] border border-[var(--border)] p-3">
                  {selected.message}
                </div>
              </div>
              <div>
                <div className="form-label">Source</div>
                <div className="text-[13px] text-gray-400">{selected.source}</div>
              </div>
              <div>
                <div className="form-label">Date</div>
                <div className="text-[13px] text-gray-400">{new Date(selected.createdAt).toLocaleString()}</div>
              </div>

              {/* Status Change */}
              <div className="border-t border-[var(--border)] pt-4">
                <div className="form-label mb-3">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      className={`px-3 py-1.5 text-[10px] font-montserrat font-bold tracking-[1px] uppercase transition-all ${
                        selected.status === s
                          ? 'border-gold bg-[rgba(212,175,55,0.1)] text-gold border'
                          : 'border border-[var(--border)] text-gray-400 hover:border-[rgba(212,175,55,0.4)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    className="flex-1 text-center text-[10px] font-montserrat font-bold tracking-[1px] uppercase py-2.5 border border-[#25d366]/40 text-[#25d366] hover:bg-[rgba(37,211,102,0.1)] transition-all"
                  >
                    WhatsApp
                  </a>
                )}
                <button
                  onClick={() => setDeleteId(selected.id)}
                  className="flex-1 text-[10px] font-montserrat font-bold tracking-[1px] uppercase py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Lead"
        message="This will permanently remove this lead. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <ToastContainer />
    </div>
  )
}
