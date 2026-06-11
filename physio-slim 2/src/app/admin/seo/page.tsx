'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: SEO Management
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getSEOSettings, updateSEOSettings } from '@/lib/firestore'
import {
  AdminPageHeader, FormField, TextInput, TextArea,
  ImageUpload, GoldButton, useToast, SectionCard
} from '@/components/admin'
import type { SEOSettings } from '@/types'

const DEFAULT: SEOSettings = {
  metaTitle: 'Physio Slim Health Club | Premium Fitness in Fayoum',
  metaDescription: 'Physio Slim Health Club – Premium fitness experience in Fayoum, Egypt. Professional coaches, advanced equipment, and flexible membership plans.',
  keywords: 'gym, fitness, fayoum, health club, physio slim, swimming pool, personal training',
  ogImage: '',
  ogTitle: 'Physio Slim Health Club',
  ogDescription: 'Transform Your Body. Build Your Strength. Unlock Your Potential.',
  twitterCard: 'summary_large_image',
}

export default function SEOAdminPage() {
  const [form, setForm] = useState<SEOSettings>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { show, ToastContainer } = useToast()

  useEffect(() => {
    getSEOSettings().then((data) => {
      if (data) setForm({ ...DEFAULT, ...data })
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: keyof SEOSettings, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    try {
      await updateSEOSettings(form)
      show('SEO settings saved')
    } catch {
      show('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const titleLen = form.metaTitle.length
  const descLen = form.metaDescription.length

  if (loading) return <div className="text-gold font-montserrat text-sm tracking-widest animate-pulse">Loading...</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="SEO MANAGEMENT"
        subtitle="Optimize your website for search engines"
        action={<GoldButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</GoldButton>}
      />

      {/* Google Preview */}
      <SectionCard title="Google Search Preview">
        <div className="bg-white p-4 border border-gray-200 rounded max-w-[600px]">
          <div className="text-[20px] text-blue-700 hover:underline cursor-pointer leading-snug">{form.metaTitle || 'Page Title'}</div>
          <div className="text-[13px] text-green-700">physioslim.com</div>
          <div className="text-[14px] text-gray-600 mt-1 leading-relaxed">{form.metaDescription || 'Page description...'}</div>
        </div>
      </SectionCard>

      {/* Meta Tags */}
      <SectionCard title="Meta Tags">
        <div className="space-y-4">
          <FormField label="Meta Title" hint={`${titleLen}/60 characters — recommended under 60`}>
            <TextInput value={form.metaTitle} onChange={(v) => set('metaTitle', v)} />
            <div className="mt-1 h-1 bg-[var(--border)]">
              <div className={`h-full transition-all ${titleLen > 60 ? 'bg-red-500' : 'bg-gold'}`} style={{ width: `${Math.min((titleLen / 60) * 100, 100)}%` }} />
            </div>
          </FormField>

          <FormField label="Meta Description" hint={`${descLen}/160 characters — recommended under 160`}>
            <TextArea value={form.metaDescription} onChange={(v) => set('metaDescription', v)} rows={3} />
            <div className="mt-1 h-1 bg-[var(--border)]">
              <div className={`h-full transition-all ${descLen > 160 ? 'bg-red-500' : 'bg-gold'}`} style={{ width: `${Math.min((descLen / 160) * 100, 100)}%` }} />
            </div>
          </FormField>

          <FormField label="Keywords" hint="Comma-separated keywords">
            <TextInput value={form.keywords} onChange={(v) => set('keywords', v)} placeholder="gym, fitness, fayoum..." />
          </FormField>
        </div>
      </SectionCard>

      {/* Open Graph */}
      <SectionCard title="Open Graph (Facebook / LinkedIn)">
        <div className="space-y-4">
          <FormField label="OG Title">
            <TextInput value={form.ogTitle} onChange={(v) => set('ogTitle', v)} />
          </FormField>
          <FormField label="OG Description">
            <TextArea value={form.ogDescription} onChange={(v) => set('ogDescription', v)} rows={2} />
          </FormField>
          <FormField label="OG Image" hint="Recommended size: 1200×630px">
            <ImageUpload value={form.ogImage} onChange={(url) => set('ogImage', url)} folder="seo" label="Upload OG Image" />
          </FormField>
        </div>
      </SectionCard>

      {/* Twitter Card */}
      <SectionCard title="Twitter Cards">
        <FormField label="Card Type">
          <select value={form.twitterCard} onChange={(e) => set('twitterCard', e.target.value as any)} className="form-input">
            <option value="summary">Summary (small image)</option>
            <option value="summary_large_image">Summary Large Image</option>
          </select>
        </FormField>
      </SectionCard>

      <div className="flex justify-end">
        <GoldButton onClick={handleSave} disabled={saving} size="lg">{saving ? 'Saving...' : 'Save SEO Settings'}</GoldButton>
      </div>

      <ToastContainer />
    </div>
  )
}
