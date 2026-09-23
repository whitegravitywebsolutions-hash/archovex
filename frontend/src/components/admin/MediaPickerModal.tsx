'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient, getImageUrl } from '@/lib/api';
import { Media } from '@/types';
import { Upload, Search, X, Check, Loader2, Trash2, Image as ImageIcon } from 'lucide-react';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  allowMultiple?: boolean;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  allowMultiple = true,
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

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
    if (isOpen) {
      fetchMedia();
      setSelectedUrls([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await apiClient.post('/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success && res.data.data?.url) {
        const newUrl = getImageUrl(res.data.data.url);
        fetchMedia();
        if (allowMultiple) {
          setSelectedUrls((prev) => [...prev, newUrl]);
        } else {
          onSelect([newUrl]);
          onClose();
        }
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to upload media file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (e: React.MouseEvent, mediaId: number, rawUrl: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this media asset from the library?')) return;
    try {
      await apiClient.delete(`/admin/media/${mediaId}`);
      const fullUrl = getImageUrl(rawUrl);
      setSelectedUrls((prev) => prev.filter((u) => u !== fullUrl));
      fetchMedia();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete media asset');
    }
  };

  const toggleSelect = (rawUrl: string) => {
    const url = getImageUrl(rawUrl);
    if (!allowMultiple) {
      onSelect([url]);
      onClose();
      return;
    }

    if (selectedUrls.includes(url)) {
      setSelectedUrls(selectedUrls.filter((u) => u !== url));
    } else {
      setSelectedUrls([...selectedUrls, url]);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      onClose();
    }
  };

  const filtered = mediaList.filter((m) =>
    (m.original_name || m.filename || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in text-xs font-sans">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-xl shadow-sm">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Select Asset from Media Library</h3>
              <p className="text-[11px] text-slate-500">Upload a new file, pick existing assets, or delete unwanted media.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search + Direct Upload */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <label className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>Upload New Asset</span>
            <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
          </label>
        </div>

        {/* Grid Body */}
        <div className="p-6 overflow-y-auto flex-grow max-h-[50vh]">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
              <span>Loading Media Assets...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
              <p>No media assets found in library.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((m) => {
                const fullUrl = getImageUrl(m.url);
                const isSelected = selectedUrls.includes(fullUrl);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleSelect(m.url)}
                    className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/30 scale-[0.98]'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <Image src={fullUrl} alt={m.original_name} fill className="object-cover" unoptimized />
                    
                    {/* Selection Checkmark */}
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-900/40 text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>

                    {/* Delete Icon on Hover */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteMedia(e, m.id, m.url)}
                      className="absolute top-2 left-2 p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      title="Delete Asset from Library"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 p-2 text-white text-[10px] truncate">
                      {m.original_name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            {selectedUrls.length} asset(s) selected
          </span>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={selectedUrls.length === 0}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl uppercase tracking-wider shadow-md transition-all"
            >
              Insert Selected Asset(s)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
