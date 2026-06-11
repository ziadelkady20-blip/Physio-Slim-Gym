'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Gallery Management
// ═══════════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { getGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } from '@/lib/firestore'
import { uploadFile, validateImageFile } from '@/lib/storage'
import { AdminPageHeader, GoldButton, ConfirmModal, useToast, EmptyState } from '@/components/admin'
import type { GalleryImage } from '@/types'

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState<{ id: string; caption: string } | null>(null)
  const { show, ToastContainer } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await getGallery()
      setImages(data)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback(async (files: File[]) => {
    const valid = files.filter((f) => !validateImageFile(f))
    if (valid.length === 0) { show('No valid images selected', 'error'); return }

    setUploading(true)
    let order = images.length

    for (const file of valid) {
      const key = file.name
      try {
        const url = await uploadFile(file, 'gallery', ({ progress }) => {
          setUploadProgress((p) => ({ ...p, [key]: progress }))
        })
        await addGalleryImage({
          url,
          caption: file.name.replace(/\.[^.]+$/, ''),
          category: 'general',
          order: order++,
          createdAt: new Date().toISOString(),
        })
      } catch {
        show(`Failed to upload ${file.name}`, 'error')
      } finally {
        setUploadProgress((p) => { const n = { ...p }; delete n[key]; return n })
      }
    }

    show(`${valid.length} image(s) uploaded`)
    setUploading(false)
    await load()
  }, [images.length])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteGalleryImage(deleteId)
      show('Image deleted')
      await load()
    } catch {
      show('Failed to delete', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  async function handleSaveCaption() {
    if (!editCaption) return
    try {
      await updateGalleryImage(editCaption.id, { caption: editCaption.caption })
      show('Caption saved')
      setEditCaption(null)
      await load()
    } catch {
      show('Failed to save caption', 'error')
    }
  }

  async function handleReorder(id: string, direction: 'up' | 'down') {
    const idx = images.findIndex((i) => i.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === images.length - 1) return

    const swap = direction === 'up' ? idx - 1 : idx + 1
    const newImages = [...images]
    ;[newImages[idx], newImages[swap]] = [newImages[swap], newImages[idx]]

    try {
      await Promise.all([
        updateGalleryImage(newImages[idx].id, { order: idx }),
        updateGalleryImage(newImages[swap].id, { order: swap }),
      ])
      setImages(newImages)
    } catch {
      show('Failed to reorder', 'error')
    }
  }

  const uploadingKeys = Object.keys(uploadProgress)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery MANAGEMENT"
        subtitle={`${images.length} images — drag and drop to upload`}
      />

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-gold bg-[rgba(212,175,55,0.05)]' : 'border-[var(--border)] hover:border-gold hover:bg-[rgba(212,175,55,0.02)]'
        }`}
      >
        <input {...getInputProps()} />
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="mx-auto mb-4">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p className="font-montserrat font-bold text-[13px] tracking-[1px] uppercase text-gray-300">
          {isDragActive ? 'Drop images here...' : 'Drag & drop images, or click to browse'}
        </p>
        <p className="text-[11px] text-gray-500 mt-2">JPEG, PNG, WebP — up to 10MB each</p>
      </div>

      {/* Upload Progress */}
      {uploadingKeys.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <p className="font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-gold">Uploading {uploadingKeys.length} file(s)...</p>
          {uploadingKeys.map((key) => (
            <div key={key}>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span className="truncate max-w-[200px]">{key}</span>
                <span>{uploadProgress[key]}%</span>
              </div>
              <div className="h-1 bg-[var(--border)]">
                <div className="h-full bg-gold transition-all" style={{ width: `${uploadProgress[key]}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square skeleton" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <EmptyState title="No Images" message="Upload your first image to the gallery" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div key={img.id} className="group relative border border-[var(--border)] hover:border-gold transition-all overflow-hidden">
              <div className="aspect-square relative">
                <Image src={img.url} alt={img.caption} fill className="object-cover" />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-[rgba(5,5,5,0.85)] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                <button
                  onClick={() => setEditCaption({ id: img.id, caption: img.caption })}
                  className="w-full text-[10px] font-montserrat font-bold tracking-[1px] uppercase border border-[var(--border)] text-gray-300 hover:border-gold hover:text-gold py-1.5 transition-all"
                >
                  Edit Caption
                </button>
                <div className="flex gap-1.5 w-full">
                  <button
                    onClick={() => handleReorder(img.id, 'up')}
                    disabled={idx === 0}
                    className="flex-1 text-[14px] border border-[var(--border)] text-gray-300 hover:border-gold py-1 transition-all disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleReorder(img.id, 'down')}
                    disabled={idx === images.length - 1}
                    className="flex-1 text-[14px] border border-[var(--border)] text-gray-300 hover:border-gold py-1 transition-all disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
                <button
                  onClick={() => setDeleteId(img.id)}
                  className="w-full text-[10px] font-montserrat font-bold tracking-[1px] uppercase border border-red-500/30 text-red-400 hover:bg-red-500/10 py-1.5 transition-all"
                >
                  Delete
                </button>
              </div>

              {/* Caption */}
              <div className="px-2 py-1.5 border-t border-[var(--border)] bg-[var(--surface)]">
                <p className="text-[11px] text-gray-400 truncate">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Caption Modal */}
      {editCaption && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-50 flex items-center justify-center px-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 w-full max-w-sm">
            <h3 className="font-montserrat font-bold text-[13px] tracking-[2px] uppercase text-gold mb-4">Edit Caption</h3>
            <input
              type="text"
              value={editCaption.caption}
              onChange={(e) => setEditCaption({ ...editCaption, caption: e.target.value })}
              className="form-input mb-4"
              placeholder="Image caption"
              autoFocus
            />
            <div className="flex gap-3">
              <GoldButton onClick={handleSaveCaption}>Save</GoldButton>
              <GoldButton variant="outline" onClick={() => setEditCaption(null)}>Cancel</GoldButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Image"
        message="This will permanently remove the image from the gallery."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <ToastContainer />
    </div>
  )
}
