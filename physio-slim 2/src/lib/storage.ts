// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Firebase Storage Utilities
// ═══════════════════════════════════════════════════

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'
import { v4 as uuidv4 } from 'uuid'

export type UploadFolder =
  | 'hero'
  | 'gallery'
  | 'facilities'
  | 'trainers'
  | 'about'
  | 'media'
  | 'logos'
  | 'offers'
  | 'testimonials'
  | 'seo'

export interface UploadProgress {
  progress: number
  url?: string
  error?: string
}

/**
 * Upload a file to Firebase Storage with progress callback
 */
export function uploadFile(
  file: File,
  folder: UploadFolder,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${ext}`
    const storageRef = ref(storage, `${folder}/${fileName}`)

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    })

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress?.({ progress })
      },
      (error) => {
        onProgress?.({ progress: 0, error: error.message })
        reject(error)
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        onProgress?.({ progress: 100, url })
        resolve(url)
      }
    )
  })
}

/**
 * Delete a file from Firebase Storage by its URL
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

/**
 * Get file size formatted string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): string | null {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    return 'Invalid file type. Please upload JPEG, PNG, WebP, GIF, or SVG.'
  }
  if (file.size > 10 * 1024 * 1024) {
    return 'File too large. Maximum size is 10MB.'
  }
  return null
}
