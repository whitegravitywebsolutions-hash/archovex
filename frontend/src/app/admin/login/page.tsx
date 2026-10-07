'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/public/Logo';
import { apiClient } from '@/lib/api';
import { Lock, Mail, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('archovex_admin_token');
      if (token) {
        router.replace('/admin/dashboard');
      }
    }
  }, [router]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0E7490] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#FAF8F3] rounded-3xl shadow-2xl p-8 space-y-6 border border-[#E4DCD0]">
        <div className="text-center space-y-2">
          <Logo className="justify-center mb-2" />
          <h1 className="text-xl font-black text-[#0C4A6E] uppercase tracking-wide">ADMIN PORTAL CMS</h1>
          <p className="text-xs text-slate-600">Sign in to manage website content, leads & designs.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#0C4A6E] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E4DCD0] rounded-xl text-xs font-bold text-[#0C4A6E] focus:ring-2 focus:ring-[#0891B2] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#0C4A6E] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-[#E4DCD0] rounded-xl text-xs font-bold text-[#0C4A6E] focus:ring-2 focus:ring-[#0891B2] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0C4A6E] transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#F97316]/25 transition-all flex items-center justify-center gap-2 border border-amber-300/40 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SIGN IN TO DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
}
