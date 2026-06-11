'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Memberships
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getMemberships, createMembership, updateMembership, deleteMembership } from '@/lib/firestore'
import {
  AdminPageHeader, GoldButton, FormField, TextInput, TextArea,
  Toggle, ConfirmModal, useToast, EmptyState, SectionCard
} from '@/components/admin'
import type { MembershipPlan } from '@/types'

const EMPTY: Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  category: 'gym',
  price: 0,
  currency: 'EGP',
  duration: 'month',
  sessions: 'Unlimited',
  description: '',
  features: [''],
  featured: false,
  whatsappLink: '',
  order: 0,
  active: true,
}

const CATEGORIES = ['gym', 'pool', 'both', 'ladies', 'kids']

export default function MembershipsAdminPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [editing, setEditing] = useState<MembershipPlan | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { show, ToastContainer } = useToast()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await getMemberships()
      setPlans(data)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setForm({ ...EMPTY, order: plans.length })
    setEditing(null)
    setCreating(true)
  }

  function openEdit(plan: MembershipPlan) {
    setForm({
      name: plan.name,
      category: plan.category,
      price: plan.price,
      currency: plan.currency || 'EGP',
      duration: plan.duration,
      sessions: plan.sessions,
      description: plan.description,
      features: plan.features || [''],
      featured: plan.featured,
      whatsappLink: plan.whatsappLink || '',
      order: plan.order,
      active: plan.active !== false,
    })
    setEditing(plan)
    setCreating(false)
  }

  async function handleSave() {
    if (!form.name || form.price < 0) { show('Name and price are required', 'error'); return }
    setSaving(true)
    try {
      const data = { ...form, features: form.features.filter(Boolean) }
      if (editing) {
        await updateMembership(editing.id, data)
        show('Plan updated')
      } else {
        await createMembership({ ...data, createdAt: '', updatedAt: '' })
        show('Plan created')
      }
      await load()
      setEditing(null)
      setCreating(false)
    } catch {
      show('Failed to save plan', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteMembership(deleteId)
      show('Plan deleted')
      await load()
    } catch {
      show('Failed to delete', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  const setF = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const showForm = creating || editing !== null

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Membership PLANS"
        subtitle="Manage all membership pricing. No hardcoded values — all from Firebase."
        action={!showForm ? <GoldButton onClick={openCreate}>+ Add Plan</GoldButton> : undefined}
      />

      {/* FORM */}
      {showForm && (
        <SectionCard title={editing ? 'Edit Plan' : 'Create New Plan'}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Plan Name">
                <TextInput value={form.name} onChange={(v) => setF('name', v)} placeholder="e.g. Gold Membership" />
              </FormField>
              <FormField label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setF('category', e.target.value as any)}
                  className="form-input"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Price">
                <TextInput type="number" value={String(form.price)} onChange={(v) => setF('price', Number(v))} />
              </FormField>
              <FormField label="Currency">
                <TextInput value={form.currency} onChange={(v) => setF('currency', v)} placeholder="EGP" />
              </FormField>
              <FormField label="Duration">
                <TextInput value={form.duration} onChange={(v) => setF('duration', v)} placeholder="month / 3 months" />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Sessions Label">
                <TextInput value={form.sessions} onChange={(v) => setF('sessions', v)} placeholder="Unlimited / 12 Sessions" />
              </FormField>
              <FormField label="WhatsApp Link (optional)">
                <TextInput value={form.whatsappLink} onChange={(v) => setF('whatsappLink', v)} placeholder="https://wa.me/..." />
              </FormField>
            </div>

            <FormField label="Description">
              <TextArea value={form.description} onChange={(v) => setF('description', v)} rows={2} />
            </FormField>

            <FormField label="Features (one per line)">
              <div className="space-y-2">
                {form.features.map((feat, i) => (
                  <div key={i} className="flex gap-2">
                    <TextInput
                      value={feat}
                      onChange={(v) => {
                        const arr = [...form.features]
                        arr[i] = v
                        setF('features', arr)
                      }}
                      placeholder={`Feature ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => setF('features', form.features.filter((_, j) => j !== i))}
                      className="px-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-[14px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <GoldButton variant="outline" size="sm" onClick={() => setF('features', [...form.features, ''])}>
                  + Add Feature
                </GoldButton>
              </div>
            </FormField>

            <div className="flex items-center gap-8 pt-2">
              <Toggle checked={form.featured} onChange={(v) => setF('featured', v)} label="Featured (Best Value)" />
              <Toggle checked={form.active} onChange={(v) => setF('active', v)} label="Active (visible on site)" />
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <GoldButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Plan' : 'Create Plan'}</GoldButton>
              <GoldButton variant="outline" onClick={() => { setEditing(null); setCreating(false) }}>Cancel</GoldButton>
            </div>
          </div>
        </SectionCard>
      )}

      {/* PLANS TABLE */}
      {!showForm && (
        <div className="bg-[var(--surface)] border border-[var(--border)]">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">
              {plans.length} Plans
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400 font-montserrat text-[13px]">Loading...</div>
          ) : plans.length === 0 ? (
            <EmptyState
              title="No Plans Yet"
              message="Create your first membership plan to get started"
              action={<GoldButton onClick={openCreate}>Create First Plan</GoldButton>}
            />
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {plans.map((plan) => (
                <div key={plan.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(212,175,55,0.03)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-montserrat font-bold text-[14px]">{plan.name}</span>
                      {plan.featured && (
                        <span className="text-[9px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 bg-[rgba(212,175,55,0.1)] border border-gold text-gold">
                          FEATURED
                        </span>
                      )}
                      {!plan.active && (
                        <span className="text-[9px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 border border-gray-600 text-gray-500">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[12px] text-gold font-montserrat font-bold">{plan.currency} {plan.price}/{plan.duration}</span>
                      <span className="text-[11px] text-gray-500 capitalize">{plan.category}</span>
                      <span className="text-[11px] text-gray-500">{plan.sessions}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <GoldButton variant="outline" size="sm" onClick={() => openEdit(plan)}>Edit</GoldButton>
                    <GoldButton variant="danger" size="sm" onClick={() => setDeleteId(plan.id)}>Delete</GoldButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Plan"
        message="This will permanently remove the membership plan. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <ToastContainer />
    </div>
  )
}
