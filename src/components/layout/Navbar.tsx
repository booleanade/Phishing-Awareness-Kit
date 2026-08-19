import React, { useState } from 'react';
import { Shield, BookOpen, MailWarning, GraduationCap, Award, BarChart3, AlertTriangle, LogOut, ChevronDown, UserCheck } from 'lucide-react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
  onLogout?: () => void;
  onUserChange?: (user: User) => void;
  onOpenReport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenLogin,
  onLogout,
  onOpenReport
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const progress = currentUser ? StorageService.getUserProgress(currentUser.id) : null;

  return (
    <header id="main_navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => {
              if (!currentUser) onNavigate('landing');
              else if (currentUser.role === 'admin') onNavigate('admin_dashboard');
              else onNavigate('staff_dashboard');
            }}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xs transition group-hover:bg-blue-700">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Phishing <span className="text-blue-600 font-semibold">Awareness Kit</span>
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  Employee Training
                </span>
              </div>
              <p className="text-[12px] text-slate-500 font-normal">Stop &bull; Check &bull; Verify &bull; Report</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentUser && currentUser.role === 'staff' && (
              <>
                <button
                  id="nav_btn_staff_dash"
                  onClick={() => onNavigate('staff_dashboard')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-normal transition ${
                    currentView === 'staff_dashboard'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  My Training
                </button>
                <button
                  id="nav_btn_lessons"
                  onClick={() => onNavigate('lessons')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 ${
                    currentView === 'lessons'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Lessons</span>
                </button>
                <button
                  id="nav_btn_simulations"
                  onClick={() => onNavigate('simulations')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 ${
                    currentView === 'simulations'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MailWarning className="w-3.5 h-3.5" />
                  <span>Email Practice</span>
                </button>
                <button
                  id="nav_btn_quiz"
                  onClick={() => onNavigate('quiz')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 ${
                    currentView === 'quiz'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Knowledge Quiz</span>
                </button>
                {progress?.trainingCompleted && (
                  <button
                    id="nav_btn_certificate"
                    onClick={() => onNavigate('certificate')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>My Certificate</span>
                  </button>
                )}
              </>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <>
                <button
                  id="nav_btn_admin_dash"
                  onClick={() => onNavigate('admin_dashboard')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 ${
                    currentView === 'admin_dashboard'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              </>
            )}
          </nav>

          {/* Action buttons & User Switcher */}
          <div className="flex items-center space-x-3">
            {/* Friendly Report Phishing Button */}
            <button
              id="header_btn_report_phishing"
              onClick={() => {
                if (onOpenReport) {
                  onOpenReport();
                } else {
                  onNavigate('report');
                }
              }}
              className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold px-3 sm:px-4 py-2 rounded-lg transition flex items-center space-x-2 cursor-pointer"
              title="Report suspicious email"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Report Suspicious Email</span>
              <span className="sm:hidden">Report</span>
            </button>

            {/* User Profile Avatar */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user_profile_button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-left transition cursor-pointer"
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold leading-none">Signed in as</span>
                    <span className="text-xs font-semibold text-slate-800 capitalize mt-0.5">
                      {currentUser.name} ({currentUser.department})
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Signed In Account</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center justify-between text-xs bg-white border border-slate-200 p-2 rounded-lg">
                        <span className="text-slate-600">Role: <strong className="text-slate-900 capitalize">{currentUser.role}</strong></span>
                        <span className="text-slate-600">Dept: <strong className="text-slate-900">{currentUser.department}</strong></span>
                      </div>
                    </div>

                    <div className="pt-2 px-2">
                      <button
                        id="dropdown_btn_logout"
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn_navbar_login"
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
