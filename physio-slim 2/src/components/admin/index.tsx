'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Shared Admin Components
// ═══════════════════════════════════════════════════

import { useState, useRef, useCallback, ReactNode } from 'react'
import { uploadFile, validateImageFile, type UploadFolder } from '@/lib/storage'

// ── PAGE HEADER ────────────────────────────────────
export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-montserrat font-black text-2xl">
          {title.split(' ').map((w, i) =>
            i === title.split(' ').length - 1
              ? <span key={i} className="text-gold"> {w}</span>
              : <span key={i}>{w} </span>
          )}
        </h1>
        {subtitle && <p className="text-gray-400 text-[13px] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ── GOLD BUTTON ────────────────────────────────────
export function GoldButton({
  children,
  onClick,
  type = 'button',
  disabled,
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClass = size === 'sm' ? 'px-4 py-2 text-[10px]' : size === 'lg' ? 'px-8 py-4 text-[13px]' : 'px-5 py-2.5 text-[11px]'
  const variantClass =
    variant === 'primary'
      ? 'bg-gradient-to-br from-gold to-gold-dark text-black hover:brightness-110'
      : variant === 'danger'
      ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
      : 'border border-[var(--border)] text-gray-300 hover:border-gold hover:text-gold'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClass} ${variantClass} font-montserrat font-bold tracking-[1.5px] uppercase clip-btn-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

// ── FORM FIELD ─────────────────────────────────────
export function FormField({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="form-label">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-500">{hint}</p>}
    </div>
  )
}

// ── TEXT INPUT ─────────────────────────────────────
export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="form-input"
    />
  )
}

// ── TEXTAREA ────────────────────────────────────────
export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="form-input resize-none"
    />
  )
}

// ── TOGGLE ─────────────────────────────────────────
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative w-11 h-6 transition-colors ${checked ? 'bg-gold' : 'bg-gray-700'}`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
      {label && <span className="text-[13px] text-gray-300 font-montserrat">{label}</span>}
    </label>
  )
}

// ── IMAGE UPLOAD ───────────────────────────────────
export function ImageUpload({
  value,
  onChange,
  folder,
  label = 'Upload Image',
}: {
  value: string
  onChange: (url: string) => void
  folder: UploadFolder
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      const err = validateImageFile(file)
      if (err) { setError(err); return }
      setError('')
      setUploading(true)
      try {
        const url = await uploadFile(file, folder, ({ progress }) => setProgress(progress))
        onChange(url)
      } catch (e: any) {
        setError(e.message || 'Upload failed')
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [folder, onChange]
  )

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative w-full max-w-xs aspect-video border border-[var(--border)] overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-[rgba(0,0,0,0.7)] text-white w-6 h-6 flex items-center justify-center text-[12px] hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <div className="flex gap-3 items-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border border-[var(--border)] hover:border-gold text-gray-300 hover:text-gold font-montserrat font-bold text-[11px] tracking-[1.5px] uppercase px-4 py-2.5 clip-btn-sm transition-all disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          {uploading ? `Uploading ${progress}%` : label}
        </button>

        {value && (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste URL"
            className="form-input flex-1 text-[12px]"
          />
        )}
      </div>

      {uploading && (
        <div className="w-full bg-[var(--border)] h-1">
          <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="text-red-400 text-[12px]">{error}</p>}
    </div>
  )
}

// ── CONFIRM MODAL ──────────────────────────────────
export function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title,
  message,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-50 flex items-center justify-center px-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 w-full max-w-sm">
        <h3 className="font-montserrat font-bold text-[14px] tracking-[1px] uppercase mb-2">{title}</h3>
        <p className="text-[13px] text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <GoldButton variant="danger" onClick={onConfirm}>Confirm</GoldButton>
          <GoldButton variant="outline" onClick={onCancel}>Cancel</GoldButton>
        </div>
      </div>
    </div>
  )
}

// ── TOAST ──────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'error' }[]>([])

  const show = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36)
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  const ToastContainer = () => (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 font-montserrat font-semibold text-[12px] tracking-wide shadow-xl border animate-[fadeInUp_0.3s_ease] ${
            t.type === 'success'
              ? 'bg-[var(--surface)] border-gold text-white'
              : 'bg-[var(--surface)] border-red-500 text-red-400'
          }`}
        >
          <span className={t.type === 'success' ? 'text-gold' : 'text-red-400'}>
            {t.type === 'success' ? '✓' : '✕'}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  )

  return { show, ToastContainer }
}

// ── EMPTY STATE ────────────────────────────────────
export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="py-20 text-center border border-dashed border-[var(--border)]">
      <div className="text-4xl mb-4 text-gray-600">⊘</div>
      <h3 className="font-montserrat font-bold text-[14px] tracking-[1px] uppercase mb-2">{title}</h3>
      <p className="text-gray-400 text-[13px] mb-6">{message}</p>
      {action}
    </div>
  )
}

// ── SECTION CARD ───────────────────────────────────
export function SectionCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <h2 className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">{title}</h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
