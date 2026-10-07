'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { 
  Users, 
  UserPlus, 
  Key, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Loader2, 
  Lock, 
  Mail, 
  User as UserIcon 
} from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  created_at?: string;
}

export default function AdminUsersManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Add User Form State
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
    password: '',
    confirm_password: '',
  });

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirm_password: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/users');
      if (res.data.success && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Add User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addUserForm.password !== addUserForm.confirm_password) {
      alert('Passwords do not match. Please recheck.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const res = await apiClient.post('/admin/users', {
        name: addUserForm.name,
        email: addUserForm.email,
        role: addUserForm.role,
        password: addUserForm.password,
      });

      if (res.data.success) {
        setMessage(`New admin user "${addUserForm.name}" created successfully!`);
        setIsAddModalOpen(false);
        setAddUserForm({ name: '', email: '', role: 'ADMIN', password: '', confirm_password: '' });
        fetchUsers();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create admin user.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (passwordForm.password !== passwordForm.confirm_password) {
      alert('New Passwords do not match. Please recheck.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const res = await apiClient.post(`/admin/users/${selectedUser.id}/change-password`, {
        password: passwordForm.password,
      });

      if (res.data.success) {
        setMessage(`Password updated successfully for ${selectedUser.name}!`);
        setIsPasswordModalOpen(false);
        setPasswordForm({ password: '', confirm_password: '' });
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`Are you sure you want to delete admin user "${user.name}" (${user.email})?`)) {
      return;
    }

    try {
      const res = await apiClient.delete(`/admin/users/${user.id}`);
      if (res.data.success) {
        setMessage(`Admin user "${user.name}" deleted successfully.`);
        fetchUsers();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6 text-xs max-w-6xl mx-auto font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#F97316]" />
            <span>Admin Users & Access Control</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create new administrator accounts, manage login credentials, and change user passwords.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-black rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-md transition-all border border-amber-300/40"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Admin User</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
            Active Admin Accounts ({users.length})
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#0C4A6E]" />
            <span>Loading admin users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Login Email</th>
                  <th className="py-3 px-4">Role Permission</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0C4A6E] text-white flex items-center justify-center font-black text-xs shadow-xs">
                        {usr.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{usr.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600 font-mono text-[11px]">
                      {usr.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full inline-block">
                        {usr.role || 'ADMIN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {usr.created_at ? new Date(usr.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(usr);
                            setIsPasswordModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-[#0C4A6E] hover:bg-[#075985] text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs"
                          title="Change User Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Change Password</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usr)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW ADMIN USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#F97316]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Add New Login User
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={addUserForm.name}
                    onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                    placeholder="e.g. Sujeet Kumar"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address (Login ID) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={addUserForm.email}
                    onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                    placeholder="admin@archovex.com"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Permission</label>
                <select
                  value={addUserForm.role}
                  onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                  className="w-full p-2.5 border rounded-xl font-bold text-slate-800"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                  <option value="ADMIN">ADMIN (CMS Access)</option>
                  <option value="EDITOR">EDITOR (Content Only)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={addUserForm.password}
                    onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={addUserForm.confirm_password}
                    onChange={(e) => setAddUserForm({ ...addUserForm, confirm_password: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 border text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-black rounded-xl uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE PASSWORD */}
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#0C4A6E]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Change Password
                </h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border rounded-xl space-y-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target User</span>
              <p className="font-bold text-slate-900 text-xs">{selectedUser.name} ({selectedUser.email})</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2.5 border text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#0C4A6E] hover:bg-[#075985] text-white font-black rounded-xl uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
