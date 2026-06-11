'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin Login Page
// ═══════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AdminLoginPage() {
  const { signIn, user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard')
    }
  }, [user, loading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <svg viewBox="0 0 44 44" fill="none" className="w-16 h-16 mx-auto mb-4">
            <path d="M22 3L40 11V26C40 35 32 41 22 44C12 41 4 35 4 26V11Z" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
            <rect x="13" y="20" width="18" height="4" rx="1.5" fill="#D4AF37"/>
            <rect x="11" y="16" width="6" height="12" rx="2" fill="#D4AF37"/>
            <rect x="27" y="16" width="6" height="12" rx="2" fill="#D4AF37"/>
          </svg>
          <h1 className="font-montserrat font-black text-2xl tracking-wide">ADMIN PORTAL</h1>
          <p className="text-[11px] tracking-[4px] text-gold font-montserrat font-semibold uppercase mt-1">
            Physio Slim Health Club
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-8">
          <h2 className="font-montserrat font-bold text-[13px] tracking-[3px] uppercase text-gold mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-5 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-[13px] font-montserrat">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="admin@physioslim.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-br from-gold to-gold-dark text-black font-montserrat font-bold text-[12px] tracking-[2px] uppercase py-4 clip-btn mt-2 hover:brightness-110 transition-all disabled:opacity-60"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
            <a href="#" className="text-[12px] text-gray-400 hover:text-gold transition-colors font-montserrat">
              Forgot password?
            </a>
          </div>
        </div>

        <p className="text-center text-gray-600 text-[11px] mt-6 font-montserrat">
          Restricted access. Authorized personnel only.
        </p>
      </div>
    </div>
  )
}
