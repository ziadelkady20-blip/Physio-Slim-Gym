'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Facilities Management
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getFacilities, createFacility, updateFacility, deleteFacility } from '@/lib/firestore'
import {
  AdminPageHeader, GoldButton, FormField, TextInput, TextArea,
  ImageUpload, Toggle, ConfirmModal, useToast, EmptyState, SectionCard
} from '@/components/admin'
import type { Facility } from '@/types'

const ICON_OPTIONS = [
  'dumbbell', 'waves', 'heart', 'zap', 'shield', 'star', 'award',
  'users', 'activity', 'target', 'layers', 'sun', 'wind', 'droplet'
]

const EMPTY: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', description: '', icon: 'dumbbell', image: '', order: 0, active: true
}

export default function FacilitiesAdminPage() {
  const [items, setItems] = useState<Facility[]>([])
  const [form, setForm] = useState({ ...EMPTY })
  const [editing, setEditing] = useState<Facility | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { show, ToastContainer } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await getFacilities()) } finally { setLoading(false) }
  }

  function openCreate() {
    setForm({ ...EMPTY, order: items.length })
    setEditing(null)
    setCreating(true)
  }

  function openEdit(f: Facility) {
    setForm({
      title: f.title, description: f.description, icon: f.icon,
      image: f.image, order: f.order, active: f.active !== false
    })
    setEditing(f)
    setCreating(false)
  }

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.title) { show('Title is required', 'error'); return }
    setSaving(true)
    try {
      if (editing) {
        await updateFacility(editing.id, form)
        show('Facility updated')
      } else {
        await createFacility({ ...form, createdAt: '', updatedAt: '' })
        show('Facility created')
      }
      await load()
      setEditing(null)
      setCreating(false)
    } catch { show('Failed to save', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteFacility(deleteId)
      show('Facility deleted')
      await load()
    } catch { show('Failed to delete', 'error') }
    finally { setDeleteId(null) }
  }

  const showForm = creating || editing !== null

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Facilities MANAGEMENT"
        subtitle="Showcase your world-class spaces"
        action={!showForm ? <GoldButton onClick={openCreate}>+ Add Facility</GoldButton> : undefined}
      />

      {showForm && (
        <SectionCard title={editing ? 'Edit Facility' : 'Add Facility'}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Title">
                <TextInput value={form.title} onChange={(v) => set('title', v)} placeholder="Main Gym Floor" />
              </FormField>
              <FormField label="Display Order">
                <TextInput type="number" value={String(form.order)} onChange={(v) => set('order', Number(v))} />
              </FormField>
            </div>

            <FormField label="Description">
              <TextArea value={form.description} onChange={(v) => set('description', v)} rows={3}
                placeholder="Describe this facility..." />
            </FormField>

            <FormField label="Icon Name" hint="Choose an icon to represent this facility">
              <div className="flex flex-wrap gap-2 mt-1">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => set('icon', icon)}
                    className={`px-3 py-1.5 text-[10px] font-montserrat font-bold tracking-[1px] uppercase transition-all ${
                      form.icon === icon
                        ? 'bg-gold text-black border border-gold'
                        : 'border border-[var(--border)] text-gray-400 hover:border-gold hover:text-gold'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="Facility Image">
              <ImageUpload value={form.image} onChange={(url) => set('image', url)} folder="facilities" />
            </FormField>

            <Toggle checked={form.active} onChange={(v) => set('active', v)} label="Active (visible on site)" />

            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <GoldButton onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </GoldButton>
              <GoldButton variant="outline" onClick={() => { setEditing(null); setCreating(false) }}>Cancel</GoldButton>
            </div>
          </div>
        </SectionCard>
      )}

      {!showForm && (
        <>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                  <div className="aspect-video skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 skeleton w-1/2" />
                    <div className="h-3 skeleton w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No Facilities"
              message="Add your first facility to showcase your spaces"
              action={<GoldButton onClick={openCreate}>Add Facility</GoldButton>}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((facility) => (
                <div
                  key={facility.id}
                  className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden hover:border-[rgba(212,175,55,0.4)] transition-all"
                >
                  {facility.image ? (
                    <div className="relative aspect-video">
                      <Image src={facility.image} alt={facility.title} fill className="object-cover grayscale-[20%]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.6)] to-transparent" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-[rgba(212,175,55,0.05)] border-b border-[var(--border)] flex items-center justify-center">
                      <span className="text-gold font-montserrat font-bold text-[11px] tracking-[2px] uppercase opacity-40">No Image</span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-montserrat font-bold text-[14px]">{facility.title}</div>
                        <div className="text-[10px] text-gold tracking-[1.5px] uppercase font-montserrat font-semibold mt-0.5">
                          Icon: {facility.icon}
                        </div>
                      </div>
                      {!facility.active && (
                        <span className="text-[9px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 border border-gray-600 text-gray-500 flex-shrink-0">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-400 leading-relaxed mb-4 line-clamp-2">{facility.description}</p>
                    <div className="flex gap-2">
                      <GoldButton variant="outline" size="sm" onClick={() => openEdit(facility)}>Edit</GoldButton>
                      <GoldButton variant="danger" size="sm" onClick={() => setDeleteId(facility.id)}>Delete</GoldButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Facility"
        message="Remove this facility from the website?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      <ToastContainer />
    </div>
  )
}
