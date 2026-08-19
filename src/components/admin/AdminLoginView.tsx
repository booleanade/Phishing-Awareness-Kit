import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle, CheckCircle2, Mail, KeyRound, Loader2, ShieldAlert } from 'lucide-react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { signInAdminWithPassword, isSupabaseReady } from '../../lib/supabase';

interface AdminLoginViewProps {
  onAdminAuthenticated: (user: User) => void;
  onNavigateHome: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onAdminAuthenticated,
  onNavigateHome
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAdminEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your administrator email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseReady()) {
        throw new Error('Supabase environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) must be configured in Vercel. Please ensure they are added and your build is redeployed.');
      }

      const sbUser = await signInAdminWithPassword(email, password);

      setSuccess('Administrator access verified.');

      const adminUser: User = {
        id: sbUser.id,
        name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || 'Administrator',
        email: sbUser.email || email.trim().toLowerCase(),
        role: 'admin',
        department: 'ICT',
        status: 'active',
        avatarUrl: sbUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        createdAt: sbUser.created_at || new Date().toISOString()
      };

      StorageService.setCurrentUser(adminUser.id);
      setTimeout(() => {
        onAdminAuthenticated(adminUser);
      }, 400);
    } catch (err: any) {
      console.error('Admin login error:', err);
      // Clean friendly message for Supabase auth errors
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid admin email or password. Please verify your credentials in Supabase.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Your email is not confirmed in Supabase. Please confirm it in Supabase Auth or disable "Confirm email" in Supabase settings.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-8">
        
        {/* Portal Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/80 text-[11px] font-semibold text-blue-300 mb-2.5">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            <span>Restricted Administrator Route (/admin)</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Security Administration Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in with your Supabase administrator email & password
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Email & Password Admin Form */}
        <form onSubmit={handleAdminEmailPasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Admin Email</span>
              <Mail className="w-3.5 h-3.5 text-slate-500" />
            </label>
            <input
              id="admin_email_input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
              autoComplete="email"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Admin Password</span>
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            </label>
            <input
              id="admin_password_input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <button
            id="admin_login_submit_btn"
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-white transition font-medium cursor-pointer"
          >
            &larr; Return to Employee Training Portal
          </button>
        </div>

      </div>
    </div>
  );
};
