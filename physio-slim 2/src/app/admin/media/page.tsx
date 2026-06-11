'use client'
// ═══════════════════════════════════════════════════
// PHYSIO SLIM — Admin: Media Library
// ═══════════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { getMedia, addMediaItem, deleteMediaItem } from '@/lib/firestore'
import { uploadFile, validateImageFile, formatFileSize } from '@/lib/storage'
import { AdminPageHeader, GoldButton, ConfirmModal, useToast } from '@/components/admin'
import type { MediaItem } from '@/types'

const FOLDERS = ['all', 'hero', 'gallery', 'trainers', 'facilities', 'general']

export default function MediaAdminPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [filtered, setFiltered] = useState<MediaItem[]>([])
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('all')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { show, ToastContainer } = useToast()

  useEffect(() => { load() }, [])

  useEffect(() => {
    let data = items
    if (folder !== 'all') data = data.filter((i) => i.folder === folder)
    if (search) data = data.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    setFiltered(data)
  }, [items, search, folder])

  async function load() {
    try { setItems(await getMedia()) } finally { setLoading(false) }
  }

  const onDrop = useCallback(async (files: File[]) => {
    const valid = files.filter((f) => !validateImageFile(f))
    if (!valid.length) { show('No valid images', 'error'); return }
    setUploading(true)
    for (const file of valid) {
      try {
        const url = await uploadFile(file, 'media')
        await addMediaItem({
          name: file.name,
          url,
          size: file.size,
          type: file.type,
          folder: folder === 'all' ? 'general' : folder,
          createdAt: new Date().toISOString(),
        })
      } catch {
        show(`Failed to upload ${file.name}`, 'error')
      }
    }
    show(`${valid.length} file(s) uploaded`)
    setUploading(false)
    await load()
  }, [folder])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true })

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteMediaItem(deleteId)
      setItems((prev) => prev.filter((i) => i.id !== deleteId))
      show('File deleted')
    } catch { show('Failed to delete', 'error') }
    finally { setDeleteId(null) }
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
    show('URL copied to clipboard')
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media LIBRARY"
        subtitle={`${items.length} files`}
      />

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-gold bg-[rgba(212,175,55,0.05)]' : 'border-[var(--border)] hover:border-gold hover:bg-[rgba(212,175,55,0.02)]'}`}
      >
        <input {...getInputProps()} />
        <p className="font-montserrat font-bold text-[13px] tracking-[1px] uppercase text-gray-300">
          {uploading ? 'Uploading...' : isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-[11px] text-gray-500 mt-1">JPEG, PNG, WebP — max 10MB</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files..."
          className="form-input flex-1 min-w-[200px]"
        />
        <div className="flex gap-1">
          {FOLDERS.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`px-3 py-2 font-montserrat font-bold text-[10px] tracking-[1px] uppercase transition-all ${
                folder === f ? 'bg-gold text-black' : 'border border-[var(--border)] text-gray-400 hover:border-gold hover:text-gold'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[var(--border)] text-gray-400 text-[13px]">
          {search ? 'No files match your search' : 'No files in this folder'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="group relative border border-[var(--border)] overflow-hidden hover:border-gold transition-all">
              <div className="aspect-square relative">
                <Image src={item.url} alt={item.name} fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-[rgba(5,5,5,0.85)] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  onClick={() => copyUrl(item)}
                  className={`w-full text-[9px] font-montserrat font-bold tracking-[1px] uppercase py-1.5 border transition-all ${copiedId === item.id ? 'border-gold bg-[rgba(212,175,55,0.2)] text-gold' : 'border-[var(--border)] text-gray-300 hover:border-gold hover:text-gold'}`}
                >
                  {copiedId === item.id ? '✓ Copied' : 'Copy URL'}
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="w-full text-[9px] font-montserrat font-bold tracking-[1px] uppercase py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Delete
                </button>
              </div>
              <div className="px-2 py-1 bg-[var(--surface)] border-t border-[var(--border)]">
                <p className="text-[10px] text-gray-400 truncate">{item.name}</p>
                <p className="text-[9px] text-gray-600">{formatFileSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete File"
        message="Permanently remove this file from storage?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      <ToastContainer />
    </div>
  )
}
