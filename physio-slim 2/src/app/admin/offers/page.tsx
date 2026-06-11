'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Offers & Promotions
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getOffers, createOffer, updateOffer, deleteOffer } from '@/lib/firestore'
import {
  AdminPageHeader, GoldButton, FormField, TextInput, TextArea,
  ImageUpload, Toggle, ConfirmModal, useToast, EmptyState, SectionCard
} from '@/components/admin'
import type { Offer } from '@/types'

const EMPTY: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  discount: 0,
  originalPrice: 0,
  offerPrice: 0,
  currency: 'EGP',
  expiresAt: '',
  featured: false,
  bannerImage: '',
  ctaText: 'Get This Offer',
  ctaLink: '#contact',
  active: true,
}

function CountdownPreview({ expiresAt }: { expiresAt: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    if (!expiresAt) return
    function tick() {
      const diff = new Date(expiresAt).getTime() - Date.now()
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  if (!expiresAt) return null

  return (
    <div className="flex gap-3 mt-3">
      {[['d', time.d], ['h', time.h], ['m', time.m], ['s', time.s]].map(([unit, val]) => (
        <div key={unit as string} className="text-center bg-[var(--bg)] border border-[var(--border)] px-3 py-2">
          <div className="font-montserrat font-black text-xl text-gold">{String(val).padStart(2, '0')}</div>
          <div className="text-[9px] tracking-[2px] text-gray-500 uppercase font-montserrat">{unit}</div>
        </div>
      ))}
    </div>
  )
}

export default function OffersAdminPage() {
  const [items, setItems] = useState<Offer[]>([])
  const [form, setForm] = useState({ ...EMPTY })
  const [editing, setEditing] = useState<Offer | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { show, ToastContainer } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await getOffers()) } finally { setLoading(false) }
  }

  function openCreate() { setForm({ ...EMPTY }); setEditing(null); setCreating(true) }
  function openEdit(o: Offer) {
    setForm({
      title: o.title, description: o.description, discount: o.discount,
      originalPrice: o.originalPrice, offerPrice: o.offerPrice, currency: o.currency,
      expiresAt: o.expiresAt ? o.expiresAt.split('T')[0] : '',
      featured: o.featured, bannerImage: o.bannerImage || '',
      ctaText: o.ctaText, ctaLink: o.ctaLink, active: o.active !== false,
    })
    setEditing(o)
    setCreating(false)
  }

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.title) { show('Title is required', 'error'); return }
    setSaving(true)
    try {
      const data = {
        ...form,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : '',
      }
      if (editing) { await updateOffer(editing.id, data); show('Offer updated') }
      else { await createOffer({ ...data, createdAt: '', updatedAt: '' }); show('Offer created') }
      await load()
      setEditing(null)
      setCreating(false)
    } catch { show('Failed to save', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!deleteId) return
    try { await deleteOffer(deleteId); show('Offer deleted'); await load() }
    catch { show('Failed to delete', 'error') }
    finally { setDeleteId(null) }
  }

  const showForm = creating || editing !== null

  function isExpired(expiresAt: string) {
    return expiresAt && new Date(expiresAt) < new Date()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Offers & PROMOTIONS"
        subtitle="Create time-limited deals with countdown timers"
        action={!showForm ? <GoldButton onClick={openCreate}>+ Create Offer</GoldButton> : undefined}
      />

      {showForm && (
        <SectionCard title={editing ? 'Edit Offer' : 'Create Offer'}>
          <div className="space-y-5">
            <FormField label="Offer Title">
              <TextInput value={form.title} onChange={(v) => set('title', v)} placeholder="Summer Special" />
            </FormField>

            <FormField label="Description">
              <TextArea value={form.description} onChange={(v) => set('description', v)} rows={2} />
            </FormField>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField label="Discount %">
                <TextInput type="number" value={String(form.discount)} onChange={(v) => set('discount', Number(v))} />
              </FormField>
              <FormField label="Original Price">
                <TextInput type="number" value={String(form.originalPrice)} onChange={(v) => set('originalPrice', Number(v))} />
              </FormField>
              <FormField label="Offer Price">
                <TextInput type="number" value={String(form.offerPrice)} onChange={(v) => set('offerPrice', Number(v))} />
              </FormField>
              <FormField label="Currency">
                <TextInput value={form.currency} onChange={(v) => set('currency', v)} />
              </FormField>
            </div>

            <FormField label="Expiry Date" hint="Leave blank for no expiry">
              <TextInput type="date" value={form.expiresAt} onChange={(v) => set('expiresAt', v)} />
              {form.expiresAt && (
                <div>
                  <p className="text-[11px] text-gray-500 mt-2">Countdown preview:</p>
                  <CountdownPreview expiresAt={form.expiresAt} />
                </div>
              )}
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="CTA Button Text">
                <TextInput value={form.ctaText} onChange={(v) => set('ctaText', v)} />
              </FormField>
              <FormField label="CTA Button Link">
                <TextInput value={form.ctaLink} onChange={(v) => set('ctaLink', v)} />
              </FormField>
            </div>

            <FormField label="Banner Image (optional)">
              <ImageUpload value={form.bannerImage || ''} onChange={(url) => set('bannerImage', url)} folder="offers" />
            </FormField>

            <div className="flex items-center gap-8">
              <Toggle checked={form.featured} onChange={(v) => set('featured', v)} label="Featured Offer" />
              <Toggle checked={form.active} onChange={(v) => set('active', v)} label="Active" />
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <GoldButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</GoldButton>
              <GoldButton variant="outline" onClick={() => { setEditing(null); setCreating(false) }}>Cancel</GoldButton>
            </div>
          </div>
        </SectionCard>
      )}

      {!showForm && (
        loading ? (
          <div className="text-gray-400 text-[13px] p-8">Loading...</div>
        ) : items.length === 0 ? (
          <EmptyState title="No Offers" message="Create your first promotion to attract new members"
            action={<GoldButton onClick={openCreate}>Create Offer</GoldButton>} />
        ) : (
          <div className="space-y-4">
            {items.map((offer) => (
              <div
                key={offer.id}
                className={`bg-[var(--surface)] border flex gap-6 p-5 transition-all hover:border-[rgba(212,175,55,0.3)] ${
                  offer.featured ? 'border-gold' : 'border-[var(--border)]'
                } ${isExpired(offer.expiresAt) ? 'opacity-60' : ''}`}
              >
                {offer.bannerImage && (
                  <div className="w-32 h-24 relative flex-shrink-0 overflow-hidden border border-[var(--border)]">
                    <img src={offer.bannerImage} alt={offer.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2 flex-wrap">
                    <span className="font-montserrat font-bold text-[15px]">{offer.title}</span>
                    {offer.featured && (
                      <span className="text-[9px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 bg-[rgba(212,175,55,0.1)] border border-gold text-gold">FEATURED</span>
                    )}
                    {isExpired(offer.expiresAt) && (
                      <span className="text-[9px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 border border-red-500/30 text-red-400">EXPIRED</span>
                    )}
                    {!offer.active && (
                      <span className="text-[9px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 border border-gray-600 text-gray-500">INACTIVE</span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-400 mb-2">{offer.description}</p>
                  <div className="flex items-center gap-4 text-[12px]">
                    <span className="text-gold font-montserrat font-black text-[18px]">
                      {offer.currency} {offer.offerPrice}
                    </span>
                    {offer.originalPrice > 0 && (
                      <span className="text-gray-500 line-through">{offer.currency} {offer.originalPrice}</span>
                    )}
                    {offer.discount > 0 && (
                      <span className="text-green-400 font-montserrat font-bold">{offer.discount}% OFF</span>
                    )}
                  </div>
                  {offer.expiresAt && !isExpired(offer.expiresAt) && (
                    <div className="mt-2">
                      <span className="text-[10px] text-gray-500 uppercase tracking-[1px] font-montserrat">Expires: {new Date(offer.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <GoldButton variant="outline" size="sm" onClick={() => openEdit(offer)}>Edit</GoldButton>
                  <GoldButton variant="danger" size="sm" onClick={() => setDeleteId(offer.id)}>Delete</GoldButton>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Offer"
        message="Remove this promotion from the website?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      <ToastContainer />
    </div>
  )
}
