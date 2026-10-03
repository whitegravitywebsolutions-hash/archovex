'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient, getImageUrl } from '@/lib/api';
import { Media } from '@/types';
import { Upload, Search, Trash2, Copy, Check, Loader2, Edit3, Crop, Info } from 'lucide-react';
import MediaDetailModal from '@/components/admin/MediaDetailModal';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Selected media for WordPress-style Attachment Details Modal
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/media');
      if (res.data.success) {
        setMediaList(res.data.data.data || res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await apiClient.post('/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success && res.data.data) {
        setSelectedMedia(res.data.data);
        setIsDetailModalOpen(true);
      }
      fetchMedia();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to upload media file');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (e: React.MouseEvent, id: number, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getImageUrl(url));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await apiClient.delete(`/admin/media/${id}`);
      fetchMedia();
    } catch (err) {
      console.error(err);
    }
  };

  const openMediaDetail = (m: Media) => {
    setSelectedMedia(m);
    setIsDetailModalOpen(true);
  };

  const filtered = mediaList.filter((m) =>
    (m.original_name || m.filename || m.alt_text || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Centralized Media Library</h1>
          <p className="text-xs text-slate-500">
            Upload images, edit Alt tags, title, captions, crop visuals (WordPress style), and copy CDN links.
          </p>
        </div>

        <label className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-md transition-all">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>Upload New Asset</span>
          <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
        </label>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, alt text, filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Showing {filtered.length} asset(s)
        </span>
      </div>

      {/* Grid Display */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            <span>Loading Media Assets...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <p className="text-sm font-bold">No media assets found.</p>
            <p className="text-xs">Click "Upload New Asset" above to add images to your library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((m) => {
              const fullUrl = getImageUrl(m.url);
              return (
                <div
                  key={m.id}
                  onClick={() => openMediaDetail(m)}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-sm hover:shadow-md hover:border-blue-500 transition-all"
                >
                  <Image src={fullUrl} alt={m.alt_text || m.original_name} fill className="object-cover" unoptimized />

                  {/* Alt Tag Badge if present */}
                  {m.alt_text && (
                    <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow max-w-[80%] truncate">
                      ALT: {m.alt_text}
                    </span>
                  )}

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold truncate block max-w-[100px]" title={m.original_name}>
                        {m.original_name}
                      </span>
                      <span className="p-1 bg-blue-600 rounded-md text-[9px] font-bold uppercase flex items-center gap-0.5">
                        <Edit3 className="w-3 h-3" /> Edit
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={(e) => copyUrl(e, m.id, m.url)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        title="Copy Image URL"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, m.id)}
                        className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WordPress Style Media Detail Modal */}
      <MediaDetailModal
        isOpen={isDetailModalOpen}
        media={selectedMedia}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateSuccess={fetchMedia}
      />
    </div>
  );
}
