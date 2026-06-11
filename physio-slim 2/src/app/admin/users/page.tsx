'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: User & Role Management
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { getUsers, setUserRole } from '@/lib/firestore'
import { useAuth } from '@/lib/auth-context'
import { AdminPageHeader, GoldButton, useToast } from '@/components/admin'
import type { UserRole } from '@/types'

const ROLES: UserRole[] = ['super_admin', 'admin', 'manager']

const roleColors: Record<UserRole, string> = {
  super_admin: '#D4AF37',
  admin: '#3b82f6',
  manager: '#a855f7',
}

const roleDescriptions: Record<UserRole, string> = {
  super_admin: 'Full access including user management and system settings',
  admin: 'Full content management access',
  manager: 'Limited access — view and manage leads only',
}

export default function UsersAdminPage() {
  const { role: currentRole, adminUser } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState<string | null>(null)
  const { show, ToastContainer } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try { setUsers(await getUsers()) } finally { setLoading(false) }
  }

  async function handleRoleChange(uid: string, role: UserRole) {
    if (uid === adminUser?.uid) { show('Cannot change your own role', 'error'); return }
    setChanging(uid)
    try {
      await setUserRole(uid, role)
      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role } : u))
      show(`Role updated to ${role}`)
    } catch {
      show('Failed to update role', 'error')
    } finally {
      setChanging(null)
    }
  }

  if (currentRole !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="font-montserrat font-bold text-[16px] tracking-[1px] uppercase mb-2">Access Restricted</h2>
        <p className="text-gray-400 text-[13px]">Only Super Admins can manage users and roles.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User MANAGEMENT"
        subtitle="Manage admin access and role permissions"
      />

      {/* Role Descriptions */}
      <div className="grid md:grid-cols-3 gap-4">
        {ROLES.map((r) => (
          <div key={r} className="bg-[var(--surface)] border border-[var(--border)] p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: roleColors[r] }} />
            <div className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase mb-1.5" style={{ color: roleColors[r] }}>
              {r.replace('_', ' ')}
            </div>
            <p className="text-[12px] text-gray-400">{roleDescriptions[r]}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)]">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">
            Admin Users ({users.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-[13px]">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-[13px]">No admin users found</div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {users.map((user) => (
              <div key={user.uid} className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                {/* Avatar */}
                <div className="w-10 h-10 flex-shrink-0 bg-[rgba(212,175,55,0.1)] border border-[var(--border)] flex items-center justify-center font-montserrat font-black text-[14px] text-gold">
                  {(user.displayName || user.email || '?')[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-montserrat font-semibold text-[13px] truncate">{user.displayName || 'No name'}</span>
                    {user.uid === adminUser?.uid && (
                      <span className="text-[9px] font-montserrat font-bold tracking-[1px] uppercase px-2 py-0.5 bg-[rgba(212,175,55,0.1)] border border-gold text-gold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                  {user.lastLogin && (
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      Last login: {new Date(user.lastLogin?.toDate?.() || user.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Current Role Badge */}
                <div
                  className="text-[10px] font-montserrat font-bold tracking-[1.5px] uppercase px-3 py-1 border flex-shrink-0"
                  style={{ color: roleColors[user.role as UserRole] || '#6b7280', borderColor: `${roleColors[user.role as UserRole] || '#6b7280'}30`, background: `${roleColors[user.role as UserRole] || '#6b7280'}10` }}
                >
                  {(user.role || 'unknown').replace('_', ' ')}
                </div>

                {/* Role Selector */}
                {user.uid !== adminUser?.uid && (
                  <div className="flex-shrink-0">
                    <select
                      value={user.role || 'manager'}
                      onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                      disabled={changing === user.uid}
                      className="form-input text-[12px] py-1.5 pr-8 min-w-[120px]"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Note */}
      <div className="bg-[rgba(212,175,55,0.04)] border border-[rgba(212,175,55,0.15)] p-5">
        <div className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold mb-2">Inviting New Admins</div>
        <p className="text-[12px] text-gray-400 leading-relaxed">
          To add a new admin, create their account in <strong className="text-gray-300">Firebase Authentication</strong> and they will automatically appear here on first login. Then assign their role from this page.
        </p>
      </div>

      <ToastContainer />
    </div>
  )
}
