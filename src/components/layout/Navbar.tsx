import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  MailWarning,
  GraduationCap,
  Award,
  BarChart3,
  AlertTriangle,
  LogOut,
  ChevronDown,
  UserCheck,
  Menu,
  X,
  Home,
  CheckCircle2
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleMobileNav = (view: string) => {
    setMobileMenuOpen(false);
    onNavigate(view);
  };

  const handleReportClick = () => {
    setMobileMenuOpen(false);
    if (onOpenReport) {
      onOpenReport();
    } else {
      onNavigate('report');
    }
  };

  const progress = currentUser ? StorageService.getUserProgress(currentUser.id) : null;

  return (
    <header id="main_navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Brand Logo & Title */}
          <div 
            id="brand_header_logo"
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group min-w-0 shrink" 
            onClick={() => {
              setMobileMenuOpen(false);
              if (!currentUser) onNavigate('landing');
              else if (currentUser.role === 'admin') onNavigate('admin_dashboard');
              else onNavigate('staff_dashboard');
            }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-xs transition group-hover:bg-blue-700">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-xs sm:text-base tracking-tight text-slate-900 whitespace-nowrap">
                  Phishing <span className="text-blue-600 font-semibold">Guide</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                  Employee Training
                </span>
              </div>
              <p className="hidden lg:block text-[11px] text-slate-500 font-normal truncate">Stop &bull; Check &bull; Verify &bull; Report</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentUser && currentUser.role === 'staff' && (
              <>
                <button
                  id="nav_btn_staff_dash"
                  onClick={() => onNavigate('staff_dashboard')}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold tracking-normal transition cursor-pointer ${
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
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 cursor-pointer ${
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
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 cursor-pointer ${
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
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 cursor-pointer ${
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
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer`}
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
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-normal transition flex items-center space-x-1.5 cursor-pointer ${
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

          {/* Action buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Friendly Report Phishing Button */}
            <button
              id="header_btn_report_phishing"
              onClick={handleReportClick}
              className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
              title="Report suspicious email"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="hidden sm:inline">Report Phishing</span>
              <span className="sm:hidden text-[11px]">Report</span>
            </button>

            {/* Desktop User Profile Avatar */}
            {currentUser ? (
              <div className="relative hidden md:block">
                <button
                  id="user_profile_button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold leading-none">Signed in</span>
                    <span className="text-xs font-semibold text-slate-800 capitalize mt-0.5 truncate max-w-[110px]">
                      {currentUser.name}
                    </span>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs overflow-hidden shrink-0">
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
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">Sign In with Google</span>
                <span className="sm:hidden text-[11px]">Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              id="btn_mobile_menu_toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center justify-center shrink-0"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile_navbar_drawer" 
          className="md:hidden border-t border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 px-4 py-4 space-y-3"
        >
          {/* User Status in Mobile Menu */}
          {currentUser ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-xs overflow-hidden shrink-0">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <p className="text-[11px] text-slate-400">Department: <strong className="text-slate-600">{currentUser.department}</strong></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
              <div className="text-xs">
                <p className="font-bold text-blue-900">Training Portal</p>
                <p className="text-blue-700 text-[11px]">Sign in to track modules & earn certificate</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-700 transition shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Navigation Links for Mobile */}
          <div className="space-y-1 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">Navigation</p>
            
            {/* General Home Link */}
            <button
              onClick={() => handleMobileNav('landing')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Overview &amp; Home</span>
            </button>

            {/* Staff Navigation Links */}
            {currentUser && currentUser.role === 'staff' && (
              <>
                <button
                  onClick={() => handleMobileNav('staff_dashboard')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentView === 'staff_dashboard'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>My Training Dashboard</span>
                </button>

                <button
                  onClick={() => handleMobileNav('lessons')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentView === 'lessons'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Interactive Lessons</span>
                </button>

                <button
                  onClick={() => handleMobileNav('simulations')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentView === 'simulations'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <MailWarning className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Email Simulation Practice</span>
                </button>

                <button
                  onClick={() => handleMobileNav('quiz')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentView === 'quiz'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Knowledge Quiz</span>
                </button>

                {progress?.trainingCompleted && (
                  <button
                    onClick={() => handleMobileNav('certificate')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100`}
                  >
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>My Completion Certificate</span>
                  </button>
                )}
              </>
            )}

            {/* Unauthenticated Quick Links */}
            {!currentUser && (
              <>
                <button
                  onClick={() => handleMobileNav('pre_test')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentView === 'pre_test'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Baseline Assessment (3 Mins)</span>
                </button>

                <button
                  onClick={() => handleMobileNav('lessons')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentView === 'lessons'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Interactive Lessons</span>
                </button>

                <button
                  onClick={() => handleMobileNav('simulations')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentView === 'simulations'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <MailWarning className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Email Simulation Drills</span>
                </button>
              </>
            )}

            {/* Admin Link */}
            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => handleMobileNav('admin_dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  currentView === 'admin_dashboard'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Admin Analytics Dashboard</span>
              </button>
            )}

            {/* Direct Report Button in Mobile Menu */}
            <button
              onClick={handleReportClick}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer mt-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Report Suspicious Phishing Email</span>
            </button>
          </div>

          {/* Mobile Sign Out Action */}
          {currentUser && (
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
