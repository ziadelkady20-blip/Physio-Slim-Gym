'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Hero Management
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getHeroSettings, updateHeroSettings } from '@/lib/firestore'
import {
  AdminPageHeader, FormField, TextInput, TextArea,
  ImageUpload, Toggle, GoldButton, useToast, SectionCard
} from '@/components/admin'
import type { HeroSettings } from '@/types'

const defaults: HeroSettings = {
  title: 'PHYSIO SLIM',
  subtitle: 'HEALTH CLUB',
  description: 'Transform Your Body. Build Your Strength. Unlock Your Potential.',
  badge: 'Premium Fitness • Fayoum, Egypt',
  primaryButtonText: 'Join Now',
  primaryButtonLink: '#memberships',
  secondaryButtonText: 'WhatsApp Us',
  secondaryButtonLink: 'https://wa.me/201023265002',
  backgroundImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
  videoUrl: '',
  videoEnabled: false,
}

export default function HeroAdminPage() {
  const [form, setForm] = useState<HeroSettings>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { show, ToastContainer } = useToast()

  useEffect(() => {
    getHeroSettings().then((data) => {
      if (data) setForm({ ...defaults, ...data })
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: keyof HeroSettings, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    try {
      await updateHeroSettings(form)
      show('Hero section updated successfully')
    } catch {
      show('Failed to save changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gold font-montserrat text-sm tracking-widest animate-pulse">Loading...</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Hero MANAGEMENT"
        subtitle="Control the main hero section of your website"
        action={
          <GoldButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </GoldButton>
        }
      />

      {/* Content */}
      <SectionCard title="Hero Content">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Main Title">
              <TextInput value={form.title} onChange={(v) => set('title', v)} placeholder="PHYSIO SLIM" />
            </FormField>
            <FormField label="Subtitle">
              <TextInput value={form.subtitle} onChange={(v) => set('subtitle', v)} placeholder="HEALTH CLUB" />
            </FormField>
          </div>
          <FormField label="Badge Text">
            <TextInput value={form.badge} onChange={(v) => set('badge', v)} placeholder="Premium Fitness • Fayoum, Egypt" />
          </FormField>
          <FormField label="Description">
            <TextArea value={form.description} onChange={(v) => set('description', v)} rows={3} />
          </FormField>
        </div>
      </SectionCard>

      {/* Buttons */}
      <SectionCard title="Call-to-Action Buttons">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Primary Button Text">
              <TextInput value={form.primaryButtonText} onChange={(v) => set('primaryButtonText', v)} />
            </FormField>
            <FormField label="Primary Button Link">
              <TextInput value={form.primaryButtonLink} onChange={(v) => set('primaryButtonLink', v)} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Secondary Button Text">
              <TextInput value={form.secondaryButtonText} onChange={(v) => set('secondaryButtonText', v)} />
            </FormField>
            <FormField label="Secondary Button Link">
              <TextInput value={form.secondaryButtonLink} onChange={(v) => set('secondaryButtonLink', v)} />
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* Background */}
      <SectionCard title="Background Media">
        <div className="space-y-5">
          <FormField label="Background Image" hint="Used when video is disabled">
            <ImageUpload
              value={form.backgroundImage}
              onChange={(url) => set('backgroundImage', url)}
              folder="hero"
              label="Upload Background"
            />
          </FormField>

          <div className="border-t border-[var(--border)] pt-5">
            <Toggle
              checked={form.videoEnabled}
              onChange={(v) => set('videoEnabled', v)}
              label="Enable Background Video"
            />
          </div>

          {form.videoEnabled && (
            <FormField label="Video URL (MP4)" hint="Paste direct URL or upload to Firebase Storage">
              <TextInput
                value={form.videoUrl}
                onChange={(v) => set('videoUrl', v)}
                placeholder="https://your-storage.com/hero-video.mp4"
              />
            </FormField>
          )}
        </div>
      </SectionCard>

      {/* Preview */}
      <SectionCard title="Live Preview">
        <div
          className="relative h-40 overflow-hidden border border-[var(--border)]"
          style={{ background: `linear-gradient(rgba(5,5,5,0.7), rgba(5,5,5,0.7)), url('${form.backgroundImage}') center/cover` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="text-[9px] tracking-[3px] text-gold font-montserrat font-bold uppercase mb-2">{form.badge}</div>
            <div className="font-montserrat font-black text-xl uppercase">
              {form.title} <span className="text-gold">{form.subtitle}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1.5 max-w-xs">{form.description}</div>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <GoldButton onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Saving...' : 'Save All Changes'}
        </GoldButton>
      </div>

      <ToastContainer />
    </div>
  )
}
