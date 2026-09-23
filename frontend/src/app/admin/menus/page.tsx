'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { MenuItem, MegaMenuColumn, MegaMenuItem } from '@/types';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Save,
  ChevronDown,
  ChevronUp,
  Layers,
  Link as LinkIcon,
  Grid,
  PlusCircle,
  Loader2,
  MoveUp,
  MoveDown,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminMenusPage() {
  const [menuId, setMenuId] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

  // New Item Modals / Quick Add States
  const [newTopItem, setNewTopItem] = useState({
    label: '',
    url: '',
    type: 'link',
  });
  const [isAddingTopItem, setIsAddingTopItem] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/menus');
      if (res.data.success && res.data.data) {
        setMenuId(res.data.data.id);
        const rawItems = res.data.data.items || [];
        setMenuItems(rawItems);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* TOP MENU ITEMS HANDLERS                                                   */
  /* -------------------------------------------------------------------------- */
  const handleAddTopItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuId) return;
    setSaving(true);
    try {
      const res = await apiClient.post('/admin/menu-items', {
        menu_id: menuId,
        label: newTopItem.label,
        url: newTopItem.url || '#',
        type: newTopItem.type,
        sort_order: menuItems.length + 1,
        is_active: true,
        open_new_tab: false,
      });

      if (res.data.success) {
        setMessage(`Added top navigation item "${newTopItem.label}"`);
        setNewTopItem({ label: '', url: '', type: 'link' });
        setIsAddingTopItem(false);
        fetchMenu();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add top menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTopItem = async (item: MenuItem) => {
    setSaving(true);
    try {
      await apiClient.put(`/admin/menu-items/${item.id}`, {
        label: item.label,
        url: item.url,
        type: item.type,
        sort_order: item.sort_order,
        is_active: item.is_active,
        open_new_tab: item.open_new_tab,
      });
      setMessage(`Updated "${item.label}" successfully!`);
      setTimeout(() => setMessage(''), 3000);
      fetchMenu();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopItem = async (id: number, label: string) => {
    if (!confirm(`Are you sure you want to delete top menu item "${label}" and all its mega columns?`)) return;
    try {
      await apiClient.delete(`/admin/menu-items/${id}`);
      setMessage(`Deleted "${label}"`);
      fetchMenu();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const moveTopItem = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const updated = [...menuItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const reordered = updated.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setMenuItems(reordered);

    try {
      await apiClient.post('/admin/menu-items/reorder', {
        items: reordered.map((it) => ({ id: it.id, sort_order: it.sort_order })),
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* MEGA MENU COLUMNS HANDLERS                                                 */
  /* -------------------------------------------------------------------------- */
  const handleAddMegaColumn = async (menuItemId: number) => {
    const title = prompt('Enter Column Title (e.g. KITCHENS & DINING):', 'NEW COLUMN');
    if (!title) return;

    try {
      const res = await apiClient.post('/admin/mega-columns', {
        menu_item_id: menuItemId,
        title,
        sort_order: 1,
      });

      if (res.data.success) {
        setMessage(`Added mega column "${title}"`);
        fetchMenu();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add mega column');
    }
  };

  const handleUpdateMegaColumn = async (columnId: number, title: string) => {
    try {
      await apiClient.put(`/admin/mega-columns/${columnId}`, { title });
      setMessage(`Updated column heading "${title}"`);
      setTimeout(() => setMessage(''), 3000);
      fetchMenu();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update column');
    }
  };

  const handleDeleteMegaColumn = async (columnId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete mega column "${title}" and all its links?`)) return;
    try {
      await apiClient.delete(`/admin/mega-columns/${columnId}`);
      setMessage(`Deleted column "${title}"`);
      fetchMenu();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete column');
    }
  };

  /* -------------------------------------------------------------------------- */
  /* MEGA MENU ITEMS / SUB-LINKS HANDLERS                                      */
  /* -------------------------------------------------------------------------- */
  const handleAddMegaItem = async (columnId: number) => {
    const label = prompt('Enter Sub-link Label (e.g. L-Shaped Kitchens):', 'New Sub Link');
    if (!label) return;
    const url = prompt('Enter Sub-link Target URL (e.g. /designs/l-shaped-kitchens):', '/designs');

    try {
      const res = await apiClient.post('/admin/mega-items', {
        mega_menu_column_id: columnId,
        label,
        url: url || '#',
        sort_order: 1,
        is_active: true,
      });

      if (res.data.success) {
        setMessage(`Added sub-link "${label}"`);
        fetchMenu();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add sub-link');
    }
  };

  const handleUpdateMegaItem = async (item: MegaMenuItem) => {
    try {
      await apiClient.put(`/admin/mega-items/${item.id}`, {
        label: item.label,
        url: item.url,
        description: item.description,
        is_active: item.is_active,
        sort_order: item.sort_order,
      });
      setMessage(`Updated sub-link "${item.label}"`);
      setTimeout(() => setMessage(''), 3000);
      fetchMenu();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update sub-link');
    }
  };

  const handleDeleteMegaItem = async (itemId: number, label: string) => {
    if (!confirm(`Delete sub-link "${label}"?`)) return;
    try {
      await apiClient.delete(`/admin/mega-items/${itemId}`);
      setMessage(`Deleted sub-link "${label}"`);
      fetchMenu();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete sub-link');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-slate-800" />
        <span>Loading Header & Mega Menu Builder...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs max-w-5xl font-sans pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Header & Mega Menu Manager</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
              Live Navigation CMS
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Edit primary navigation titles, URLs, menu types, mega menu columns, and sub-link items with live public reflection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingTopItem(!isAddingTopItem)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Navigation Item
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* CREATE NEW TOP MENU ITEM MODAL / FORM */}
      {isAddingTopItem && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 animate-fade-in">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-blue-400">Add New Top Navigation Item</h3>
          <form onSubmit={handleAddTopItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Navigation Label *</label>
              <input
                type="text"
                required
                placeholder="e.g. Special Offers / Portfolio"
                value={newTopItem.label}
                onChange={(e) => setNewTopItem({ ...newTopItem, label: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Target URL / Path *</label>
              <input
                type="text"
                required
                placeholder="/offers or #"
                value={newTopItem.url}
                onChange={(e) => setNewTopItem({ ...newTopItem, url: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Navigation Type</label>
              <select
                value={newTopItem.type}
                onChange={(e) => setNewTopItem({ ...newTopItem, type: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs"
              >
                <option value="link">Direct Page Link</option>
                <option value="megamenu">Mega Menu Dropdown</option>
                <option value="city">City Locations Dropdown</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTopItem(false)}
                className="px-4 py-2 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Top Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TOP LEVEL NAVIGATION ITEMS STACK */}
      <div className="space-y-4">
        {menuItems.map((item, idx) => {
          const megaCols = item.megaColumns || (item as any).mega_columns || [];
          const isExpanded = expandedItemId === item.id;
          const isMegaMenu = item.type === 'megamenu' || megaCols.length > 0;

          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">
              {/* ITEM HEADER STRIP */}
              <div className="p-4 bg-slate-50/80 flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveTopItem(idx, 'up')}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-200"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === menuItems.length - 1}
                      onClick={() => moveTopItem(idx, 'down')}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-200"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Label</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = menuItems.map(it => it.id === item.id ? { ...it, label: e.target.value } : it);
                          setMenuItems(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">URL Path</label>
                      <input
                        type="text"
                        value={item.url || ''}
                        onChange={(e) => {
                          const updated = menuItems.map(it => it.id === item.id ? { ...it, url: e.target.value } : it);
                          setMenuItems(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Type</label>
                      <select
                        value={item.type}
                        onChange={(e) => {
                          const updated = menuItems.map(it => it.id === item.id ? { ...it, type: e.target.value as any } : it);
                          setMenuItems(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="link">Direct Link</option>
                        <option value="megamenu">Mega Menu Dropdown</option>
                        <option value="city">City Locations Dropdown</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => handleUpdateTopItem(item)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider text-[11px] flex items-center gap-1 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>

                  {isMegaMenu && (
                    <button
                      type="button"
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 border transition-all ${
                        isExpanded ? 'bg-blue-700 text-white border-blue-700' : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Mega Menu ({megaCols.length} Cols)</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteTopItem(item.id, item.label)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MEGA MENU BUILDER ACCORDION */}
              {isExpanded && isMegaMenu && (
                <div className="p-6 bg-slate-100/60 border-t border-slate-200 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-700" />
                        <span>Mega Menu Columns for "{item.label}"</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">Configure multi-column mega menu headings and sub-links.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddMegaColumn(item.id)}
                      className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl uppercase text-[11px] tracking-wider shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Column Heading
                    </button>
                  </div>

                  {megaCols.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
                      <Grid className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-bold text-slate-700 text-xs">No Mega Menu Columns created yet.</p>
                      <p className="text-[11px]">Click "+ Add Column Heading" to start building your mega menu dropdown.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {megaCols.map((col: MegaMenuColumn, colIdx: number) => {
                        const colItems = col.items || [];

                        return (
                          <div key={col.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                              {/* COLUMN HEADER */}
                              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                  Col #{colIdx + 1}
                                </span>

                                <div className="flex-grow">
                                  <input
                                    type="text"
                                    defaultValue={col.title || ''}
                                    onBlur={(e) => handleUpdateMegaColumn(col.id, e.target.value)}
                                    placeholder="Column Title (e.g. KITCHENS)"
                                    className="w-full p-1.5 bg-slate-50 border rounded-lg font-extrabold text-slate-900 text-xs uppercase"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteMegaColumn(col.id, col.title || 'Column')}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                                  title="Delete Column"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* SUB-LINKS LIST */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Sub-Links / Items ({colItems.length})
                                </span>

                                {colItems.map((subItem: MegaMenuItem) => (
                                  <div key={subItem.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <input
                                        type="text"
                                        value={subItem.label}
                                        onChange={(e) => {
                                          const updatedCols = megaCols.map((c: MegaMenuColumn) => {
                                            if (c.id !== col.id) return c;
                                            return {
                                              ...c,
                                              items: c.items.map((i: MegaMenuItem) => i.id === subItem.id ? { ...i, label: e.target.value } : i)
                                            };
                                          });
                                          setMenuItems(menuItems.map(it => it.id === item.id ? { ...it, megaColumns: updatedCols } : it));
                                        }}
                                        placeholder="Sub-link Title"
                                        className="w-full p-1.5 bg-white border rounded-md font-bold text-slate-900 text-xs"
                                      />

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteMegaItem(subItem.id, subItem.label)}
                                        className="p-1 text-rose-600 hover:bg-rose-100 rounded-md shrink-0"
                                        title="Delete Sub-link"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <input
                                        type="text"
                                        value={subItem.url || ''}
                                        onChange={(e) => {
                                          const updatedCols = megaCols.map((c: MegaMenuColumn) => {
                                            if (c.id !== col.id) return c;
                                            return {
                                              ...c,
                                              items: c.items.map((i: MegaMenuItem) => i.id === subItem.id ? { ...i, url: e.target.value } : i)
                                            };
                                          });
                                          setMenuItems(menuItems.map(it => it.id === item.id ? { ...it, megaColumns: updatedCols } : it));
                                        }}
                                        placeholder="Target URL (/designs/...)"
                                        className="w-full p-1.5 bg-white border rounded-md font-mono text-[10px]"
                                      />

                                      <input
                                        type="text"
                                        value={subItem.description || ''}
                                        onChange={(e) => {
                                          const updatedCols = megaCols.map((c: MegaMenuColumn) => {
                                            if (c.id !== col.id) return c;
                                            return {
                                              ...c,
                                              items: c.items.map((i: MegaMenuItem) => i.id === subItem.id ? { ...i, description: e.target.value } : i)
                                            };
                                          });
                                          setMenuItems(menuItems.map(it => it.id === item.id ? { ...it, megaColumns: updatedCols } : it));
                                        }}
                                        placeholder="Badge (e.g. HOT / NEW)"
                                        className="w-full p-1.5 bg-white border rounded-md text-[10px]"
                                      />
                                    </div>

                                    <div className="flex justify-end pt-1">
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateMegaItem(subItem)}
                                        className="px-2.5 py-1 bg-slate-900 text-white font-bold rounded-md text-[10px] uppercase flex items-center gap-1"
                                      >
                                        <Save className="w-3 h-3" /> Save Sub-link
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddMegaItem(col.id)}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 mt-3"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Sub-Link
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
