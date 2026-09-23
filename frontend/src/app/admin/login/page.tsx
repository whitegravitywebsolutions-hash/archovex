'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/public/Logo';
import { apiClient } from '@/lib/api';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@archovex.com');
  const [password, setPassword] = useState('ChangeMe@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/admin/login', { email, password });
      if (res.data.success && res.data.data.token) {
        localStorage.setItem('archovex_admin_token', res.data.data.token);
        localStorage.setItem('archovex_admin_user', JSON.stringify(res.data.data.user));
        router.push('/admin/dashboard');
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <Logo className="justify-center mb-2" />
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">ADMIN PORTAL CMS</h1>
          <p className="text-xs text-slate-500">Sign in to manage website content, leads & designs.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SIGN IN TO DASHBOARD'}
          </button>
        </form>

        <div className="pt-4 border-t text-center space-y-1">
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full inline-block">
            DEVELOPMENT CREDENTIALS
          </span>
          <p className="text-[11px] text-slate-500 font-mono pt-1">
            admin@archovex.com / ChangeMe@123
          </p>
        </div>
      </div>
    </div>
  );
}
