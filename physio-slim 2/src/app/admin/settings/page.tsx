'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Site Settings
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/lib/firestore'
import {
  AdminPageHeader, FormField, TextInput, TextArea,
  GoldButton, useToast, SectionCard
} from '@/components/admin'
import type { SiteSettings, BusinessHours } from '@/types'

const DEFAULT_HOURS: BusinessHours[] = [
  { day: 'Monday', open: '06:00', close: '22:00', closed: false },
  { day: 'Tuesday', open: '06:00', close: '22:00', closed: false },
  { day: 'Wednesday', open: '06:00', close: '22:00', closed: false },
  { day: 'Thursday', open: '06:00', close: '22:00', closed: false },
  { day: 'Friday', open: '08:00', close: '22:00', closed: false },
  { day: 'Saturday', open: '08:00', close: '20:00', closed: false },
  { day: 'Sunday', open: '08:00', close: '18:00', closed: false },
]

const DEFAULT: SiteSettings = {
  gymName: 'Physio Slim Health Club',
  tagline: 'Transform Your Body. Build Your Strength.',
  primaryColor: '#D4AF37',
  secondaryColor: '#C9A227',
  phone: '+20 102 326 5002',
  whatsapp: 'https://wa.me/201023265002',
  email: 'info@physioslim.com',
  address: 'Fayoum, Egypt',
  facebook: '',
  instagram: '',
  tiktok: '',
  googleMapsEmbed: '',
  appleMapsLink: '',
  businessHours: DEFAULT_HOURS,
  footerTagline: "Fayoum's premier fitness destination.",
  copyright: `© ${new Date().getFullYear()} Physio Slim Health Club. All rights reserved.`,
}

export default function SettingsAdminPage() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { show, ToastContainer } = useToast()

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setForm({ ...DEFAULT, ...data, businessHours: data.businessHours || DEFAULT_HOURS })
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: keyof SiteSettings, v: any) => setForm((f) => ({ ...f, [k]: v }))

  function setHours(idx: number, field: keyof BusinessHours, val: string | boolean) {
    const hours = [...form.businessHours]
    hours[idx] = { ...hours[idx], [field]: val }
    set('businessHours', hours)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSiteSettings(form)
      show('Settings saved successfully')
    } catch {
      show('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gold font-montserrat text-sm tracking-widest animate-pulse">Loading...</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Website SETTINGS"
        subtitle="Global configuration for Physio Slim"
        action={<GoldButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save All'}</GoldButton>}
      />

      {/* Branding */}
      <SectionCard title="Branding">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Gym Name">
              <TextInput value={form.gymName} onChange={(v) => set('gymName', v)} />
            </FormField>
            <FormField label="Tagline">
              <TextInput value={form.tagline} onChange={(v) => set('tagline', v)} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Primary Color">
              <div className="flex gap-2">
                <input type="color" value={form.primaryColor} onChange={(e) => set('primaryColor', e.target.value)}
                  className="w-12 h-10 border border-[var(--border)] bg-transparent cursor-pointer" />
                <TextInput value={form.primaryColor} onChange={(v) => set('primaryColor', v)} />
              </div>
            </FormField>
            <FormField label="Secondary Color">
              <div className="flex gap-2">
                <input type="color" value={form.secondaryColor} onChange={(e) => set('secondaryColor', e.target.value)}
                  className="w-12 h-10 border border-[var(--border)] bg-transparent cursor-pointer" />
                <TextInput value={form.secondaryColor} onChange={(v) => set('secondaryColor', v)} />
              </div>
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* Contact Info */}
      <SectionCard title="Contact Information">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone Number">
              <TextInput value={form.phone} onChange={(v) => set('phone', v)} />
            </FormField>
            <FormField label="Email Address">
              <TextInput type="email" value={form.email} onChange={(v) => set('email', v)} />
            </FormField>
          </div>
          <FormField label="WhatsApp Link">
            <TextInput value={form.whatsapp} onChange={(v) => set('whatsapp', v)} placeholder="https://wa.me/..." />
          </FormField>
          <FormField label="Physical Address">
            <TextInput value={form.address} onChange={(v) => set('address', v)} />
          </FormField>
        </div>
      </SectionCard>

      {/* Social Media */}
      <SectionCard title="Social Media">
        <div className="space-y-4">
          <FormField label="Facebook URL">
            <TextInput value={form.facebook} onChange={(v) => set('facebook', v)} placeholder="https://facebook.com/..." />
          </FormField>
          <FormField label="Instagram URL">
            <TextInput value={form.instagram} onChange={(v) => set('instagram', v)} placeholder="https://instagram.com/..." />
          </FormField>
          <FormField label="TikTok URL">
            <TextInput value={form.tiktok} onChange={(v) => set('tiktok', v)} placeholder="https://tiktok.com/..." />
          </FormField>
        </div>
      </SectionCard>

      {/* Maps */}
      <SectionCard title="Map Integration">
        <div className="space-y-4">
          <FormField label="Google Maps Embed URL" hint="From Google Maps → Share → Embed a map → copy the src URL">
            <TextArea value={form.googleMapsEmbed} onChange={(v) => set('googleMapsEmbed', v)} rows={2} placeholder="https://www.google.com/maps/embed?..." />
          </FormField>
          <FormField label="Apple Maps Link">
            <TextInput value={form.appleMapsLink} onChange={(v) => set('appleMapsLink', v)} placeholder="https://maps.apple.com/..." />
          </FormField>
        </div>
      </SectionCard>

      {/* Business Hours */}
      <SectionCard title="Business Hours">
        <div className="space-y-3">
          {form.businessHours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-4">
              <div className="w-24 font-montserrat font-semibold text-[12px] text-gray-300">{h.day}</div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`relative w-9 h-5 transition-colors ${h.closed ? 'bg-gray-700' : 'bg-gold'}`}
                  onClick={() => setHours(i, 'closed', !h.closed)}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${h.closed ? 'translate-x-0.5' : 'translate-x-4'}`} />
                </div>
                <span className="text-[11px] text-gray-400">{h.closed ? 'Closed' : 'Open'}</span>
              </label>
              {!h.closed && (
                <>
                  <input
                    type="time"
                    value={h.open}
                    onChange={(e) => setHours(i, 'open', e.target.value)}
                    className="form-input w-32 text-[13px]"
                  />
                  <span className="text-gray-500">—</span>
                  <input
                    type="time"
                    value={h.close}
                    onChange={(e) => setHours(i, 'close', e.target.value)}
                    className="form-input w-32 text-[13px]"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Footer */}
      <SectionCard title="Footer Content">
        <div className="space-y-4">
          <FormField label="Footer Tagline">
            <TextInput value={form.footerTagline} onChange={(v) => set('footerTagline', v)} />
          </FormField>
          <FormField label="Copyright Text">
            <TextInput value={form.copyright} onChange={(v) => set('copyright', v)} />
          </FormField>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <GoldButton onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Saving...' : 'Save All Settings'}
        </GoldButton>
      </div>

      <ToastContainer />
    </div>
  )
}
