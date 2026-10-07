'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

export interface MultiSelectOption {
  id: number;
  name: string;
  slug?: string;
}

interface SearchableMultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export default function SearchableMultiSelect({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = 'Search and select...',
  required = false,
  helpText,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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

  const filteredOptions = options.filter(
    (opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()) ||
      (opt.slug && opt.slug.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((item) => item !== id));
  };

  const selectAll = () => {
    const allFilteredIds = filteredOptions.map((o) => o.id);
    const combined = Array.from(new Set([...selectedIds, ...allFilteredIds]));
    onChange(combined);
  };

  const clearAll = () => {
    const filteredSet = new Set(filteredOptions.map((o) => o.id));
    onChange(selectedIds.filter((id) => !filteredSet.has(id)));
  };

  const selectedOptions = options.filter((o) => selectedIds.includes(o.id));

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 text-xs">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {selectedIds.length > 0 && (
          <span className="text-[11px] font-semibold text-slate-500">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Trigger & Selected Badges Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[42px] p-2 bg-slate-50 border rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-colors ${
          isOpen ? 'border-slate-900 bg-white ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
        } ${required && selectedIds.length === 0 ? 'border-amber-300 bg-amber-50/20' : ''}`}
      >
        <div className="flex flex-wrap gap-1.5 items-center max-h-24 overflow-y-auto pr-1">
          {selectedOptions.length === 0 ? (
            <span className="text-slate-400 font-medium text-xs px-1">{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white font-semibold text-[11px] rounded-lg shadow-sm"
              >
                {opt.name}
                <button
                  type="button"
                  onClick={(e) => removeOption(opt.id, e)}
                  className="hover:bg-slate-700 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3 text-slate-300 hover:text-white" />
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 shrink-0">
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {helpText && <p className="text-[10px] text-slate-500">{helpText}</p>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-72">
          {/* Search Input Box */}
          <div className="p-2 border-b bg-slate-50/80 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Filter by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Actions Bar */}
          <div className="px-3 py-1.5 border-b bg-slate-100/50 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">{filteredOptions.length} available</span>
            <div className="flex gap-2 font-bold">
              <button
                type="button"
                onClick={selectAll}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-slate-600 hover:text-slate-900 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-grow p-1.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 italic">No matching results</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                      isSelected ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{opt.name}</span>
                    </div>
                    {opt.slug && <span className="text-[10px] text-slate-400 font-mono">/{opt.slug}</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
