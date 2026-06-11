'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Contact Info Management
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/lib/firestore'
import { AdminPageHeader, FormField, TextInput, TextArea, GoldButton, useToast, SectionCard } from '@/components/admin'

export default function ContactAdminPage() {
  const [form, setForm] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    googleMapsEmbed: '',
    appleMapsLink: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { show, ToastContainer } = useToast()

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setForm({
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        address: data.address || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        tiktok: data.tiktok || '',
        googleMapsEmbed: data.googleMapsEmbed || '',
        appleMapsLink: data.appleMapsLink || '',
      })
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    try {
      await updateSiteSettings(form)
      show('Contact info saved successfully')
    } catch {
      show('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gold font-montserrat text-sm tracking-widest animate-pulse">Loading...</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Contact INFO"
        subtitle="Update all contact details across the website"
        action={<GoldButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</GoldButton>}
      />

      <SectionCard title="Primary Contact">
        <div className="space-y-4">
          <FormField label="Phone Number">
            <TextInput value={form.phone} onChange={(v) => set('phone', v)} placeholder="+20 102 326 5002" />
          </FormField>
          <FormField label="Email Address">
            <TextInput type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="info@physioslim.com" />
          </FormField>
          <FormField label="WhatsApp Link" hint="Format: https://wa.me/201XXXXXXXXX">
            <TextInput value={form.whatsapp} onChange={(v) => set('whatsapp', v)} placeholder="https://wa.me/201023265002" />
          </FormField>
          <FormField label="Physical Address">
            <TextInput value={form.address} onChange={(v) => set('address', v)} placeholder="Fayoum, Egypt" />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Social Media Links">
        <div className="space-y-4">
          {[
            { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/physioslim' },
            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/physioslim' },
            { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@physioslim' },
          ].map(({ key, label, placeholder }) => (
            <FormField key={key} label={label}>
              <TextInput value={form[key as keyof typeof form]} onChange={(v) => set(key as keyof typeof form, v)} placeholder={placeholder} />
            </FormField>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Google Maps">
        <div className="space-y-4">
          <FormField label="Google Maps Embed URL" hint='Go to Google Maps → Share → Embed a map → copy the "src" value'>
            <TextArea
              value={form.googleMapsEmbed}
              onChange={(v) => set('googleMapsEmbed', v)}
              rows={3}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </FormField>

          {form.googleMapsEmbed && (
            <div className="border border-[var(--border)] overflow-hidden h-48">
              <iframe src={form.googleMapsEmbed} className="w-full h-full border-none grayscale" title="Map Preview" />
            </div>
          )}

          <FormField label="Apple Maps Link">
            <TextInput value={form.appleMapsLink} onChange={(v) => set('appleMapsLink', v)} placeholder="https://maps.apple.com/..." />
          </FormField>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <GoldButton onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Saving...' : 'Save Contact Info'}
        </GoldButton>
      </div>

      <ToastContainer />
    </div>
  )
}
