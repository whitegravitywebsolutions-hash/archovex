'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Copy,
  Check,
  Trash2,
  Crop,
  Save,
  Loader2,
  FileText,
  Calendar,
  HardDrive,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { getImageUrl, apiClient } from '@/lib/api';
import { Media } from '@/types';
import ImageCropperModal from './ImageCropperModal';

interface MediaDetailModalProps {
  isOpen: boolean;
  media: Media | null;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export default function MediaDetailModal({
  isOpen,
  media: initialMedia,
  onClose,
  onUpdateSuccess,
}: MediaDetailModalProps) {
  const [media, setMedia] = useState<Media | null>(initialMedia);
  const [altText, setAltText] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  useEffect(() => {
    setMedia(initialMedia);
    if (initialMedia) {
      setAltText(initialMedia.alt_text || '');
      setTitle(initialMedia.title || initialMedia.original_name || '');
      setCaption(initialMedia.caption || '');
    }
  }, [initialMedia]);

  if (!isOpen || !media) return null;

  const fullUrl = getImageUrl(media.url);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveMetadata = async () => {
    setSaving(true);
    try {
      const res = await apiClient.put(`/admin/media/${media.id}`, {
        alt_text: altText,
        title,
        caption,
      });

      if (res.data.success) {
        setMedia(res.data.data);
        onUpdateSuccess();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update media metadata');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedia = async () => {
    if (!confirm('Are you sure you want to permanently delete this media asset?')) return;
    try {
      await apiClient.delete(`/admin/media/${media.id}`);
      onUpdateSuccess();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete media asset');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-xs font-sans">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-extrabold text-slate-900">Attachment Details</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
              {media.mime_type || 'image'}
            </span>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area: Left Image Preview + Right Metadata Panel */}
        <div className="flex flex-col lg:flex-row overflow-y-auto flex-grow">
          {/* Left Panel: High Res Preview & Actions */}
          <div className="lg:w-7/12 p-6 bg-slate-900 text-white flex flex-col justify-between items-center relative">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/50 border border-slate-800 flex items-center justify-center shadow-xl my-auto">
              <Image src={fullUrl} alt={altText || media.original_name} fill className="object-contain" unoptimized />
            </div>

            {/* Action Bar under Preview */}
            <div className="w-full pt-4 flex items-center justify-between gap-3 border-t border-slate-800/80 mt-4">
              <button
                type="button"
                onClick={() => setIsCropperOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Crop className="w-4 h-4" />
                <span>Edit Image & Crop (WordPress Style)</span>
              </button>

              <a
                href={fullUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
                title="View Full Resolution Image"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Panel: Metadata & Settings Form */}
          <div className="lg:w-5/12 p-6 bg-white space-y-6 overflow-y-auto border-l border-slate-100">
            {/* File Info Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-slate-600 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 truncate max-w-[200px]" title={media.original_name}>
                  {media.original_name}
                </span>
                <span className="text-slate-400">{formatDate(media.created_at)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 font-medium">
                <div>Dimensions: <strong className="text-slate-800">{media.width && media.height ? `${media.width} × ${media.height} px` : 'Auto'}</strong></div>
                <div>File Size: <strong className="text-slate-800">{formatFileSize(media.file_size)}</strong></div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              {/* Alt Text */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Alternative Text (Alt Tag) <span className="text-blue-600 font-normal text-[10px]">(SEO & Accessibility)</span>
                </label>
                <input
                  type="text"
                  placeholder="Describe image purpose for Google SEO & screen readers..."
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Describe the purpose of the image. Leave empty if purely decorative.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Image Title</label>
                <input
                  type="text"
                  placeholder="Title displayed in media library..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Caption / Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Caption / Description</label>
                <textarea
                  rows={3}
                  placeholder="Optional caption or details about this asset..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>

              {/* File URL Copy Box */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">File URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={fullUrl}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-600 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center gap-1 font-bold text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Buttons inside Right Panel */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDeleteMedia}
                className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 p-2 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Permanently
              </button>

              <button
                type="button"
                onClick={handleSaveMetadata}
                disabled={saving}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Metadata</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        media={media}
        onClose={() => setIsCropperOpen(false)}
        onCropSuccess={(updated) => {
          setMedia(updated);
          onUpdateSuccess();
        }}
      />
    </div>
  );
}
