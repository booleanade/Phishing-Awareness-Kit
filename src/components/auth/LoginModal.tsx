import React, { useState } from 'react';
import { X, Shield, AlertCircle, CheckCircle2, Building, Mail, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';
import { User, Department } from '../../types';
import { ApiService } from '../../services/api';
import { auth, googleAuthProvider } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');
  const [department, setDepartment] = useState<Department>('Operations');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const googleUser = result.user;

      if (!googleUser.email) {
        throw new Error('Google account must have an associated email address.');
      }

      // Sync with Cloud SQL PostgreSQL / backend
      const { user } = await ApiService.syncAuthUser({
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL,
        department: department
      });

      setSuccess(`Signed in successfully as ${user.name}!`);
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 400);
    } catch (err: any) {
      console.log('Google Sign-In response code:', err.code);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User closed popup or clicked cancel - handled gracefully without intimidating error
        setInfoMessage('The sign-in window was closed. Click the button to try again or sign in with your email below.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups or use work email sign-in below.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase Console yet. Please use work email sign-in below.');
      } else {
        setError(err.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      setError('Please provide your name and work email address.');
      return;
    }

    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const syntheticUid = `email-${email.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const { user } = await ApiService.syncAuthUser({
        uid: syntheticUid,
        email: email.trim().toLowerCase(),
        displayName: name.trim(),
        department: department
      });

      setSuccess(`Welcome, ${user.name}!`);
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 400);
    } catch (err: any) {
      setError(err.message || 'Error creating session with work email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Shield className="w-5 h-5" />
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
        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Department Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Select Your Department</span>
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
          </div>

          {/* Google Sign-in */}
          <div className="pt-1">
            <button
              id="google_signin_button"
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition shadow-xs flex items-center justify-center space-x-3 disabled:opacity-50 cursor-pointer"
            >
              {loading && authMethod === 'google' ? (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{loading && authMethod === 'google' ? 'Connecting to Google...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Or with Work Email</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Email/Name fallback form */}
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Full Name</span>
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                id="input_auth_name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Work Email</span>
                <Mail className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                id="input_auth_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex.morgan@company.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            <button
              id="btn_email_signin"
              type="submit"
              disabled={loading || !name || !email}
              onClick={() => setAuthMethod('email')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <span>{loading && authMethod === 'email' ? 'Logging in...' : 'Continue with Work Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
