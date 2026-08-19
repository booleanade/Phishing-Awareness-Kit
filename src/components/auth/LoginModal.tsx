import React, { useState } from 'react';
import { X, Shield, AlertCircle, Building, Loader2 } from 'lucide-react';
import { User, Department } from '../../types';
import { signInWithGoogleSupabase, isSupabaseReady } from '../../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose
}) => {
  const [department, setDepartment] = useState<Department>('Operations');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseReady()) {
        throw new Error(
          'Supabase environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) were not detected in the current build. If you just configured them in Vercel, please trigger a Redeploy in Vercel Dashboard.'
        );
      }

      await signInWithGoogleSupabase(department);
      // Supabase redirects to Google OAuth flow
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setError(err.message || 'Failed to initiate Google Sign-In.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Training Portal Sign In</h3>
              <p className="text-xs text-slate-500">Phishing Awareness & Security Training</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Department Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Your Department</span>
              <Building className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <select
              id="select_department_auth"
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="Finance">Finance & Accounting</option>
              <option value="HR">Human Resources</option>
              <option value="ICT">Information & Communications Tech (ICT)</option>
              <option value="Administration">Corporate Administration</option>
              <option value="Operations">Operations & Logistics</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Your training curriculum and phishing simulation metrics will align with your department.
            </p>
          </div>

          {/* Google Sign-in Button */}
          <div className="pt-2">
            <button
              id="google_signin_button"
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition shadow-sm hover:shadow flex items-center justify-center space-x-3 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span className="text-slate-800 font-medium">
                {loading ? 'Redirecting to Google...' : 'Sign in with Google'}
              </span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400">
              Secured with Supabase Authentication
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
