'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

export interface SingleSelectOption {
  id: number | string | null;
  name: string;
  slug?: string;
  isTopLevel?: boolean;
  parentId?: number | string | null;
}

interface SearchableSingleSelectProps {
  label?: string;
  options: SingleSelectOption[];
  value: number | string | null;
  onChange: (val: number | string | null) => void;
  placeholder?: string;
  noneLabel?: string;
  required?: boolean;
}

export default function SearchableSingleSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Search pages...',
  noneLabel = '-- None (Top Level) --',
  required = false,
}: SearchableSingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find((o) => String(o.id) === String(value));

  const filteredOptions = options.filter((opt) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const nameMatch = opt.name.toLowerCase().includes(term);
    const slugMatch = opt.slug ? opt.slug.toLowerCase().includes(term) : false;
    return nameMatch || slugMatch;
  });

  const handleSelect = (selectedId: number | string | null) => {
    onChange(selectedId);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative space-y-1" ref={containerRef}>
      {label && (
        <label className="block font-bold text-slate-700 text-xs mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 bg-slate-50 border rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-all ${
          isOpen ? 'border-slate-900 bg-white ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="truncate flex items-center gap-2">
          {selectedOption ? (
            <span className="font-bold text-slate-900 text-xs truncate">
              {selectedOption.name} {selectedOption.slug ? `(/${selectedOption.slug})` : ''}
            </span>
          ) : (
            <span className="text-slate-500 font-medium text-xs">{noneLabel}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          {value !== null && value !== '' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(null);
              }}
              className="p-1 hover:text-slate-700 rounded-md"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-700' : ''}`} />
        </div>
      </div>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5 space-y-2 animate-in fade-in-50 zoom-in-95">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1 border-t border-slate-100 pt-1.5">
            {/* None / Clear Option */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors ${
                value === null || value === ''
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{noneLabel}</span>
              {(value === null || value === '') && <Check className="w-3.5 h-3.5" />}
            </button>

            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                No matching pages found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.id) === String(value);
                const isTop = opt.isTopLevel || opt.parentId === null || opt.parentId === undefined;
                return (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-bold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="truncate pr-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-bold">{opt.name}</span>
                        {isTop && (
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                              isSelected
                                ? 'bg-white/20 text-white border-white/30'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            Top Parent
                          </span>
                        )}
                      </div>
                      {opt.slug && (
                        <span className={`text-[10px] font-mono block ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          /{opt.slug}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
