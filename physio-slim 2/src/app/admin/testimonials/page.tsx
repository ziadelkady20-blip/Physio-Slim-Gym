'use client'
import { useEffect, useState } from 'react'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/firestore'
import { AdminPageHeader, GoldButton, FormField, TextInput, TextArea, Toggle, ConfirmModal, useToast, EmptyState, SectionCard } from '@/components/admin'
import type { Testimonial } from '@/types'

const EMPTY: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', rating: 5, comment: '', memberSince: '', avatarUrl: '', initials: '', active: true, order: 0
}

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [form, setForm] = useState({ ...EMPTY })
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { show, ToastContainer } = useToast()

  useEffect(() => { load() }, [])
  async function load() {
    try { setItems(await getTestimonials()) } finally { setLoading(false) }
  }

  function openCreate() { setForm({ ...EMPTY, order: items.length }); setEditing(null); setCreating(true) }
  function openEdit(t: Testimonial) {
    setForm({ name: t.name, rating: t.rating, comment: t.comment, memberSince: t.memberSince, avatarUrl: t.avatarUrl || '', initials: t.initials, active: t.active !== false, order: t.order })
    setEditing(t); setCreating(false)
  }
  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.name || !form.comment) { show('Name and comment are required', 'error'); return }
    setSaving(true)
    try {
      const data = { ...form, initials: form.initials || form.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() }
      if (editing) { await updateTestimonial(editing.id, data); show('Updated') }
      else { await createTestimonial({ ...data, createdAt: '', updatedAt: '' }); show('Created') }
      await load(); setEditing(null); setCreating(false)
    } catch { show('Failed to save', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!deleteId) return
    try { await deleteTestimonial(deleteId); show('Deleted'); await load() }
    catch { show('Failed to delete', 'error') }
    finally { setDeleteId(null) }
  }

  const showForm = creating || editing !== null

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Testimonials MANAGEMENT" subtitle="Manage member reviews"
        action={!showForm ? <GoldButton onClick={openCreate}>+ Add Review</GoldButton> : undefined} />

      {showForm && (
        <SectionCard title={editing ? 'Edit Review' : 'Add Review'}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Member Name"><TextInput value={form.name} onChange={(v) => set('name', v)} /></FormField>
              <FormField label="Member Since"><TextInput value={form.memberSince} onChange={(v) => set('memberSince', v)} placeholder="2023" /></FormField>
            </div>
            <FormField label="Rating (1–5)">
              <div className="flex gap-2">
                {[1,2,3,4,5].map((r) => (
                  <button key={r} type="button" onClick={() => set('rating', r)}
                    className={`w-10 h-10 border font-montserrat font-bold text-[16px] transition-all ${form.rating >= r ? 'border-gold bg-[rgba(212,175,55,0.1)] text-gold' : 'border-[var(--border)] text-gray-500'}`}>
                    ★
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Review Comment">
              <TextArea value={form.comment} onChange={(v) => set('comment', v)} rows={3} />
            </FormField>
            <FormField label="Initials (auto-generated if blank)">
              <TextInput value={form.initials} onChange={(v) => set('initials', v)} placeholder="AH" />
            </FormField>
            <Toggle checked={form.active} onChange={(v) => set('active', v)} label="Active" />
            <div className="flex gap-3 pt-3 border-t border-[var(--border)]">
              <GoldButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</GoldButton>
              <GoldButton variant="outline" onClick={() => { setEditing(null); setCreating(false) }}>Cancel</GoldButton>
            </div>
          </div>
        </SectionCard>
      )}

      {!showForm && (
        loading ? <div className="text-gray-400 text-[13px] p-8">Loading...</div> :
        items.length === 0 ? <EmptyState title="No Reviews" message="Add member reviews" action={<GoldButton onClick={openCreate}>Add Review</GoldButton>} /> :
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <div key={t.id} className="bg-[var(--surface)] border border-[var(--border)] p-5 hover:border-[rgba(212,175,55,0.3)] transition-all">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-gold text-[14px]">★</span>)}
              </div>
              <p className="text-[13px] text-gray-300 italic leading-relaxed mb-4 line-clamp-3">&ldquo;{t.comment}&rdquo;</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[rgba(212,175,55,0.1)] border border-[var(--border)] flex items-center justify-center font-montserrat font-black text-[12px] text-gold">
                  {t.initials}
                </div>
                <div>
                  <div className="font-montserrat font-bold text-[13px]">{t.name}</div>
                  <div className="text-[10px] text-gray-400">Since {t.memberSince}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <GoldButton variant="outline" size="sm" onClick={() => openEdit(t)}>Edit</GoldButton>
                <GoldButton variant="danger" size="sm" onClick={() => setDeleteId(t.id)}>Delete</GoldButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!deleteId} title="Delete Review" message="Remove this testimonial?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ToastContainer />
    </div>
  )
}
