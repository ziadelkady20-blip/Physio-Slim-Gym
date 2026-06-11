'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Trainers Management
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '@/lib/firestore'
import {
  AdminPageHeader, GoldButton, FormField, TextInput, TextArea,
  ImageUpload, Toggle, ConfirmModal, useToast, EmptyState, SectionCard
} from '@/components/admin'
import type { Trainer } from '@/types'

const EMPTY: Omit<Trainer, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  position: '',
  specialization: '',
  bio: '',
  experience: '',
  image: '',
  instagram: '',
  facebook: '',
  order: 0,
  active: true,
}

export default function TrainersAdminPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [form, setForm] = useState({ ...EMPTY })
  const [editing, setEditing] = useState<Trainer | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { show, ToastContainer } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try { setTrainers(await getTrainers()) } finally { setLoading(false) }
  }

  function openCreate() {
    setForm({ ...EMPTY, order: trainers.length })
    setEditing(null)
    setCreating(true)
  }

  function openEdit(t: Trainer) {
    setForm({ name: t.name, position: t.position, specialization: t.specialization, bio: t.bio, experience: t.experience, image: t.image, instagram: t.instagram || '', facebook: t.facebook || '', order: t.order, active: t.active !== false })
    setEditing(t)
    setCreating(false)
  }

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.name) { show('Name is required', 'error'); return }
    setSaving(true)
    try {
      if (editing) {
        await updateTrainer(editing.id, form)
        show('Trainer updated')
      } else {
        await createTrainer({ ...form, createdAt: '', updatedAt: '' })
        show('Trainer created')
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
      await deleteTrainer(deleteId)
      show('Trainer deleted')
      await load()
    } catch { show('Failed to delete', 'error') }
    finally { setDeleteId(null) }
  }

  const showForm = creating || editing !== null

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Trainers MANAGEMENT"
        subtitle="Manage your coaching team"
        action={!showForm ? <GoldButton onClick={openCreate}>+ Add Trainer</GoldButton> : undefined}
      />

      {showForm && (
        <SectionCard title={editing ? 'Edit Trainer' : 'Add New Trainer'}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name">
                <TextInput value={form.name} onChange={(v) => set('name', v)} />
              </FormField>
              <FormField label="Position / Title">
                <TextInput value={form.position} onChange={(v) => set('position', v)} placeholder="Head Coach, Swim Instructor..." />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Specialization">
                <TextInput value={form.specialization} onChange={(v) => set('specialization', v)} placeholder="Weight Loss, Strength, Swimming..." />
              </FormField>
              <FormField label="Experience">
                <TextInput value={form.experience} onChange={(v) => set('experience', v)} placeholder="5+ Years" />
              </FormField>
            </div>

            <FormField label="Bio">
              <TextArea value={form.bio} onChange={(v) => set('bio', v)} rows={3} />
            </FormField>

            <FormField label="Profile Image">
              <ImageUpload value={form.image} onChange={(url) => set('image', url)} folder="trainers" />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Instagram URL">
                <TextInput value={form.instagram} onChange={(v) => set('instagram', v)} placeholder="https://instagram.com/..." />
              </FormField>
              <FormField label="Facebook URL">
                <TextInput value={form.facebook} onChange={(v) => set('facebook', v)} placeholder="https://facebook.com/..." />
              </FormField>
            </div>

            <Toggle checked={form.active} onChange={(v) => set('active', v)} label="Active (visible on site)" />

            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <GoldButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</GoldButton>
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
                <div key={i} className="bg-[var(--surface)] border border-[var(--border)] p-5 space-y-3">
                  <div className="w-16 h-16 rounded-full skeleton" />
                  <div className="h-4 skeleton w-1/2" />
                  <div className="h-3 skeleton w-3/4" />
                </div>
              ))}
            </div>
          ) : trainers.length === 0 ? (
            <EmptyState title="No Trainers" message="Add your first trainer profile" action={<GoldButton onClick={openCreate}>Add Trainer</GoldButton>} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainers.map((t) => (
                <div key={t.id} className="bg-[var(--surface)] border border-[var(--border)] p-5 hover:border-[rgba(212,175,55,0.4)] transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 relative flex-shrink-0 border border-[var(--border)] overflow-hidden">
                      {t.image
                        ? <Image src={t.image} alt={t.name} fill className="object-cover" />
                        : <div className="w-full h-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center font-montserrat font-black text-gold text-xl">{t.name[0]}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-montserrat font-bold text-[14px] truncate">{t.name}</div>
                      <div className="text-[11px] text-gold tracking-[1px]">{t.position}</div>
                      <div className="text-[11px] text-gray-400">{t.specialization}</div>
                    </div>
                    {!t.active && (
                      <span className="text-[9px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 border border-gray-600 text-gray-500">
                        HIDDEN
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-400 leading-relaxed mb-4 line-clamp-2">{t.bio}</p>
                  <div className="flex gap-2">
                    <GoldButton variant="outline" size="sm" onClick={() => openEdit(t)}>Edit</GoldButton>
                    <GoldButton variant="danger" size="sm" onClick={() => setDeleteId(t.id)}>Delete</GoldButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Trainer"
        message="Remove this trainer from the website?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      <ToastContainer />
    </div>
  )
}
