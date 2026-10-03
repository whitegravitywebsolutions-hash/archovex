'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Crop,
  Check,
  Loader2,
  RefreshCw,
  Move,
  Maximize2,
} from 'lucide-react';
import { getImageUrl, apiClient } from '@/lib/api';
import { Media } from '@/types';

interface ImageCropperModalProps {
  isOpen: boolean;
  media: Media | null;
  onClose: () => void;
  onCropSuccess: (updatedMedia: Media) => void;
}

type HandleType = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e' | null;

export default function ImageCropperModal({
  isOpen,
  media,
  onClose,
  onCropSuccess,
}: ImageCropperModalProps) {
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Manual Crop Box Coordinates (percentage 0..100)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const [activeHandle, setActiveHandle] = useState<HandleType>(null);
  const [dragStart, setDragStart] = useState<{
    x: number;
    y: number;
    boxX: number;
    boxY: number;
    boxW: number;
    boxH: number;
  }>({
    x: 0,
    y: 0,
    boxX: 10,
    boxY: 10,
    boxW: 80,
    boxH: 80,
  });

  // Load image safely via API Base64 endpoint to bypass CORS canvas tainting
  useEffect(() => {
    if (!isOpen || !media) return;

    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
    setCropBox({ x: 10, y: 10, width: 80, height: 80 });
    setLoadingImage(true);
    setLoadError(false);

    const fullUrl = getImageUrl(media.url);

    const initImage = (src: string) => {
      const img = new window.Image();
      img.onload = () => {
        imageRef.current = img;
        setLoadingImage(false);
        drawCanvas();
      };
      img.onerror = () => {
        setLoadingImage(false);
        setLoadError(true);
      };
      img.src = src;
    };

    apiClient.get(`/admin/media/${media.id}/base64`)
      .then((res) => {
        if (res.data.success && res.data.data_url) {
          initImage(res.data.data_url);
        } else {
          initImage(fullUrl);
        }
      })
      .catch(() => {
        initImage(fullUrl);
      });
  }, [isOpen, media]);



  useEffect(() => {
    if (imageRef.current && !loadingImage) {
      drawCanvas();
    }
  }, [rotation, flipH, flipV, zoom, cropBox, loadingImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.width || !img.height) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxCanvasWidth = 650;
    const maxCanvasHeight = 420;

    const scale = Math.min(maxCanvasWidth / img.width, maxCanvasHeight / img.height, 1);
    const canvasWidth = Math.max(Math.round(img.width * scale), 200);
    const canvasHeight = Math.max(Math.round(img.height * scale), 150);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -zoom : zoom, flipV ? -zoom : zoom);

    ctx.drawImage(img, -canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight);
    ctx.restore();
  };

  // Dragging & Resizing manual crop box handlers
  const handleMouseDown = (e: React.MouseEvent, handle: HandleType) => {
    e.stopPropagation();
    setActiveHandle(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxW: cropBox.width,
      boxH: cropBox.height,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeHandle || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100;

    if (activeHandle === 'move') {
      const newX = Math.max(0, Math.min(100 - dragStart.boxW, dragStart.boxX + dx));
      const newY = Math.max(0, Math.min(100 - dragStart.boxH, dragStart.boxY + dy));
      setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
    } else if (activeHandle === 'se') {
      const newW = Math.max(5, Math.min(100 - dragStart.boxX, dragStart.boxW + dx));
      const newH = Math.max(5, Math.min(100 - dragStart.boxY, dragStart.boxH + dy));
      setCropBox((prev) => ({ ...prev, width: newW, height: newH }));
    } else if (activeHandle === 'sw') {
      const newW = Math.max(5, Math.min(dragStart.boxX + dragStart.boxW, dragStart.boxW - dx));
      const newX = dragStart.boxX + (dragStart.boxW - newW);
      const newH = Math.max(5, Math.min(100 - dragStart.boxY, dragStart.boxH + dy));
      setCropBox((prev) => ({ ...prev, x: newX, width: newW, height: newH }));
    } else if (activeHandle === 'ne') {
      const newW = Math.max(5, Math.min(100 - dragStart.boxX, dragStart.boxW + dx));
      const newH = Math.max(5, Math.min(dragStart.boxY + dragStart.boxH, dragStart.boxH - dy));
      const newY = dragStart.boxY + (dragStart.boxH - newH);
      setCropBox((prev) => ({ ...prev, y: newY, width: newW, height: newH }));
    } else if (activeHandle === 'nw') {
      const newW = Math.max(5, Math.min(dragStart.boxX + dragStart.boxW, dragStart.boxW - dx));
      const newX = dragStart.boxX + (dragStart.boxW - newW);
      const newH = Math.max(5, Math.min(dragStart.boxY + dragStart.boxH, dragStart.boxH - dy));
      const newY = dragStart.boxY + (dragStart.boxH - newH);
      setCropBox({ x: newX, y: newY, width: newW, height: newH });
    } else if (activeHandle === 'e') {
      const newW = Math.max(5, Math.min(100 - dragStart.boxX, dragStart.boxW + dx));
      setCropBox((prev) => ({ ...prev, width: newW }));
    } else if (activeHandle === 'w') {
      const newW = Math.max(5, Math.min(dragStart.boxX + dragStart.boxW, dragStart.boxW - dx));
      const newX = dragStart.boxX + (dragStart.boxW - newW);
      setCropBox((prev) => ({ ...prev, x: newX, width: newW }));
    } else if (activeHandle === 's') {
      const newH = Math.max(5, Math.min(100 - dragStart.boxY, dragStart.boxH + dy));
      setCropBox((prev) => ({ ...prev, height: newH }));
    } else if (activeHandle === 'n') {
      const newH = Math.max(5, Math.min(dragStart.boxY + dragStart.boxH, dragStart.boxH - dy));
      const newY = dragStart.boxY + (dragStart.boxH - newH);
      setCropBox((prev) => ({ ...prev, y: newY, height: newH }));
    }
  };

  const handleMouseUp = () => {
    setActiveHandle(null);
  };

  const handleSelectFullImage = () => {
    setCropBox({ x: 0, y: 0, width: 100, height: 100 });
  };

  const handleSaveCrop = async () => {
    if (!canvasRef.current || !media) return;

    setSaving(true);
    const canvas = canvasRef.current;

    const cropX = Math.round((cropBox.x / 100) * canvas.width);
    const cropY = Math.round((cropBox.y / 100) * canvas.height);
    const cropW = Math.max(Math.round((cropBox.width / 100) * canvas.width), 10);
    const cropH = Math.max(Math.round((cropBox.height / 100) * canvas.height), 10);

    const offscreen = document.createElement('canvas');
    offscreen.width = cropW;
    offscreen.height = cropH;

    const ctx = offscreen.getContext('2d');
    if (ctx) {
      ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    }

    try {
      const croppedDataUrl = offscreen.toDataURL('image/jpeg', 0.90);
      const res = await apiClient.post(`/admin/media/${media.id}/crop`, {
        image_data: croppedDataUrl,
        alt_text: media.alt_text,
        title: media.title,
      });

      if (res.data.success) {
        onCropSuccess(res.data.data);
        onClose();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to save cropped image.');
    } finally {
      setSaving(false);
    }
  };


  if (!isOpen || !media) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-xs font-sans select-none">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-sm">
              <Crop className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">Manual Drag & Drop Image Cropper</h3>
              <p className="text-[11px] text-slate-400">Drag box to move, or drag handles to resize crop selection freely.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-700">
          {/* Select Full Image Button */}
          <button
            type="button"
            onClick={handleSelectFullImage}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Full Image</span>
          </button>

          {/* Transform Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRotation((r) => r - 90)}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors"
              title="Rotate Left 90°"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setRotation((r) => r + 90)}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors"
              title="Rotate Right 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setFlipH((f) => !f)}
              className={`p-2 border rounded-xl transition-colors ${
                flipH ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setFlipV((f) => !f)}
              className={`p-2 border rounded-xl transition-colors ${
                flipV ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
              title="Flip Vertical"
            >
              <FlipVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom & Reset */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-20 accent-blue-600 cursor-pointer"
              />
              <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => {
                setRotation(0);
                setFlipH(false);
                setFlipV(false);
                setZoom(1);
                setCropBox({ x: 10, y: 10, width: 80, height: 80 });
              }}
              className="p-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-700 transition-colors"
              title="Reset Transforms"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Workspace Canvas Area */}
        <div
          className="p-6 bg-slate-900 flex items-center justify-center min-h-[380px] max-h-[500px] relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {loadingImage ? (
            <div className="flex items-center gap-2 text-slate-300 py-16 font-medium">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span>Loading image asset into canvas...</span>
            </div>
          ) : loadError ? (
            <div className="text-center py-16 text-rose-400 font-bold space-y-2">
              <p>Failed to load image into editor.</p>
              <p className="text-xs text-slate-400 font-normal">Check backend storage permissions or URL accessibility.</p>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="relative inline-block border-2 border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-black/50"
            >
              {/* Main HTML5 Canvas */}
              <canvas ref={canvasRef} className="block" />

              {/* Multi-Handle Manual Drag & Drop Crop Overlay */}
              <div
                onMouseDown={(e) => handleMouseDown(e, 'move')}
                style={{
                  left: `${cropBox.x}%`,
                  top: `${cropBox.y}%`,
                  width: `${cropBox.width}%`,
                  height: `${cropBox.height}%`,
                }}
                className="absolute border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] cursor-move"
              >
                {/* Drag Indicator Badge */}
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow pointer-events-none">
                  <Move className="w-3 h-3" /> Drag & Resize Selection
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div className="border-r border-b border-white"></div>
                  <div className="border-r border-b border-white"></div>
                  <div className="border-b border-white"></div>
                  <div className="border-r border-b border-white"></div>
                  <div className="border-r border-b border-white"></div>
                  <div className="border-b border-white"></div>
                  <div className="border-r border-white"></div>
                  <div className="border-r border-white"></div>
                  <div></div>
                </div>

                {/* 4 Corner Resize Handles */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'nw')}
                  className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform"
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'ne')}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform"
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'sw')}
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform"
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'se')}
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform"
                />

                {/* 4 Edge Resize Handles */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'n')}
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-blue-500 border border-white rounded cursor-ns-resize hover:scale-110 transition-transform"
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, 's')}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-blue-500 border border-white rounded cursor-ns-resize hover:scale-110 transition-transform"
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'w')}
                  className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-6 bg-blue-500 border border-white rounded cursor-ew-resize hover:scale-110 transition-transform"
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'e')}
                  className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-6 bg-blue-500 border border-white rounded cursor-ew-resize hover:scale-110 transition-transform"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium truncate max-w-md">
            File: <strong className="text-slate-900">{media.original_name}</strong>
          </span>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCrop}
              disabled={saving || loadingImage}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Crop & Save Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
