import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, AlertCircle, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { User } from '../../types';
import { ApiService } from '../../services/api';
import { auth, googleAuthProvider } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AdminLoginViewProps {
  onAdminAuthenticated: (user: User) => void;
  onNavigateHome: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onAdminAuthenticated,
  onNavigateHome
}) => {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const res = await ApiService.verifyAdminPasscode(passcode.trim());
      if (res.success) {
        setSuccess('Administrator access verified.');
        const adminUser: User = {
          id: 'admin-verified',
          name: 'Security Operations Lead',
          email: 'admin@security.local',
          role: 'admin',
          department: 'ICT',
          status: 'active',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString()
        };
        setTimeout(() => {
          onAdminAuthenticated(adminUser);
        }, 400);
      } else {
        setError('Invalid Administrator Passcode. Please check your security key.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setError(null);
    setInfoMessage(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const googleUser = result.user;
      
      const synced = await ApiService.syncAuthUser({
        uid: googleUser.uid,
        email: googleUser.email || '',
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL,
        department: 'ICT'
      });

      // Admin verification
      const isAuthorizedAdmin = synced.user.role === 'admin' || 
        googleUser.email?.toLowerCase() === 'blessingadeya@gmail.com' ||
        googleUser.email?.toLowerCase().includes('admin');

      if (isAuthorizedAdmin) {
        synced.user.role = 'admin';
        setSuccess(`Welcome Administrator, ${synced.user.name}!`);
        setTimeout(() => {
          onAdminAuthenticated(synced.user);
        }, 400);
      } else {
        setError(`Access Denied: Account (${googleUser.email}) does not possess Administrator privileges.`);
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setInfoMessage('The sign-in window was closed. Click the button to try again or enter the Admin Passcode below.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups or use the Admin Passcode below.');
      } else {
        setError(err.message || 'Google Administrator Sign-In failed.');
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
          <h2 className="text-xl font-bold text-white tracking-tight">
            Security Administration Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Management & Threat Oversight Access
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-blue-950/50 border border-blue-800/80 text-blue-300 text-xs flex items-start space-x-2.5">
            <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Google Admin Login Option */}
        <div className="space-y-4">
          <button
            id="admin_google_login_btn"
            type="button"
            disabled={loading}
            onClick={handleGoogleAdminLogin}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition flex items-center justify-center space-x-3 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
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
            <span>Sign in with Google Admin Account</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Or enter Security Key</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          <form onSubmit={handlePasscodeLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Admin Passcode / Security Key</span>
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              </label>
              <input
                id="admin_passcode_input"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter administrator passcode..."
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              id="admin_passcode_submit_btn"
              type="submit"
              disabled={loading || !passcode}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>Verify & Access Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-white transition font-medium cursor-pointer"
          >
            &larr; Return to Training Portal
          </button>
        </div>

      </div>
    </div>
  );
};
