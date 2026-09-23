'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient, getImageUrl } from '@/lib/api';
import { Media } from '@/types';
import { Upload, Search, Trash2, Copy, Check, Loader2 } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
      await apiClient.post('/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchMedia();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to upload media file');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await apiClient.delete(`/admin/media/${id}`);
      fetchMedia();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Centralized Media Library</h1>
          <p className="text-xs text-slate-500">Upload, organize, and copy image links for design posts and pages.</p>
        </div>

        <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shadow-md">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>Upload Image</span>
          <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((m) => (
            <div key={m.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <Image src={getImageUrl(m.url)} alt={m.original_name} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                <span className="text-[10px] truncate block">{m.original_name}</span>
                <div className="flex justify-between">
                  <button onClick={() => copyUrl(m.id, m.url)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded">
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 bg-rose-600 hover:bg-rose-500 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
