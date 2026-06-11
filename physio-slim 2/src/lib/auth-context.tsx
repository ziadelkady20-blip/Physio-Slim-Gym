'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Auth Context
// ═══════════════════════════════════════════════════

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { AdminUser, UserRole } from '@/types'

interface AuthContextValue {
  user: User | null
  adminUser: AdminUser | null
  role: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isAdmin: boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // Fetch admin data from Firestore
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (snap.exists()) {
          const data = snap.data() as AdminUser
          setAdminUser(data)
          setRole(data.role)
          // Update last login
          await setDoc(
            doc(db, 'users', firebaseUser.uid),
            { lastLogin: serverTimestamp() },
            { merge: true }
          )
        } else {
          // Auto-create super_admin for first user
          const newUser: Omit<AdminUser, 'uid'> = {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email || '',
            role: 'super_admin',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            photoURL: firebaseUser.photoURL || '',
          }
          await setDoc(doc(db, 'users', firebaseUser.uid), { uid: firebaseUser.uid, ...newUser })
          setAdminUser({ uid: firebaseUser.uid, ...newUser })
          setRole('super_admin')
        }
      } else {
        setAdminUser(null)
        setRole(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    // Check if user has admin access
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    if (snap.exists()) {
      const data = snap.data() as AdminUser
      if (!['super_admin', 'admin', 'manager'].includes(data.role)) {
        await firebaseSignOut(auth)
        throw new Error('Access denied. You do not have admin privileges.')
      }
    }
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        role,
        loading,
        signIn,
        signOut,
        resetPassword,
        isAdmin: role === 'admin' || role === 'super_admin',
        isSuperAdmin: role === 'super_admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
