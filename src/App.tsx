/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Simulation, Department } from './types';
import { StorageService } from './services/storage';
import { supabase, isSupabaseConfigured, signOutSupabase } from './lib/supabase';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { PreTestView } from './components/staff/PreTestView';
import { LessonsView } from './components/staff/LessonsView';
import { SimulationsView } from './components/staff/SimulationsView';
import { QuizView } from './components/staff/QuizView';
import { PostTestView } from './components/staff/PostTestView';
import { ReportPhishingView } from './components/staff/ReportPhishingView';
import { CertificateView } from './components/staff/CertificateView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DeploymentPackageView } from './components/admin/DeploymentPackageView';
import { AdminLoginView } from './components/admin/AdminLoginView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [reportSimulationData, setReportSimulationData] = useState<Simulation | null>(null);

  // Check URL query / hash for separate admin route
  const checkIsAdminPath = () => {
    const search = window.location.search;
    const hash = window.location.hash;
    const path = window.location.pathname;
    return (
      search.includes('admin=true') ||
      search.includes('path=admin') ||
      hash.includes('admin') ||
      path === '/admin'
    );
  };

  const handleSupabaseUser = (sbUser: any) => {
    const storedDepartment = (localStorage.getItem('pak_selected_department') as Department) || 'Operations';
    const email = sbUser.email || '';
    const name = sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || email.split('@')[0];
    const avatarUrl = sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || '';
    const isAdmin = email.toLowerCase() === 'blessingadeya@gmail.com' || email.toLowerCase().includes('admin');
    const role: 'admin' | 'staff' = isAdmin ? 'admin' : 'staff';

    const user: User = {
      id: sbUser.id,
      name,
      email,
      department: storedDepartment,
      role,
      avatarUrl,
      status: 'active',
      createdAt: sbUser.created_at || new Date().toISOString()
    };

    StorageService.setCurrentUser(user.id);
    setCurrentUser(user);

    if (role === 'admin' || checkIsAdminPath()) {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView((prev) => (prev === 'landing' || prev === 'admin_login' ? 'staff_dashboard' : prev));
    }
  };

  useEffect(() => {
    // Storage initialization
    StorageService.init();

    // Check if initial URL is admin path
    if (checkIsAdminPath()) {
      setCurrentView('admin_login');
    }

    // Load active session from local storage fallback
    const savedUser = StorageService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      if (savedUser.role === 'admin' || checkIsAdminPath()) {
        setCurrentView('admin_dashboard');
      } else {
        setCurrentView('staff_dashboard');
      }
    }

    // Listen to Supabase Google OAuth Session
    let authSubscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          handleSupabaseUser(session.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          handleSupabaseUser(session.user);
        }
      });
      authSubscription = subscription;
    }

    // Listen to popstate / hash change
    const handleUrlChange = () => {
      if (checkIsAdminPath()) {
        const active = StorageService.getCurrentUser();
        if (active && active.role === 'admin') {
          setCurrentView('admin_dashboard');
        } else {
          setCurrentView('admin_login');
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      if (authSubscription) authSubscription.unsubscribe();
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user.id);
    if (user.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('staff_dashboard');
    }
  };

  const handleLogout = async () => {
    await signOutSupabase();
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentView('landing');
    if (window.location.hash || window.location.search) {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReportWithSimulation = (sim?: Simulation) => {
    setReportSimulationData(sim || null);
    setCurrentView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Navigation Bar */}
      {currentView !== 'admin_login' && (
        <Navbar
          currentUser={currentUser}
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onOpenReport={() => handleOpenReportWithSimulation()}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* Dedicated Admin Login Route */}
        {currentView === 'admin_login' && (
          <AdminLoginView
            onAdminAuthenticated={(adminUser) => {
              setCurrentUser(adminUser);
              StorageService.setCurrentUser(adminUser.id);
              setCurrentView('admin_dashboard');
            }}
            onNavigateHome={() => {
              window.history.pushState({}, '', window.location.pathname);
              setCurrentView('landing');
            }}
          />
        )}

        {/* Landing Page */}
        {(currentView === 'landing' || (!currentUser && currentView !== 'report' && currentView !== 'admin_login')) && (
          <LandingPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* Staff Views */}
        {currentView === 'staff_dashboard' && currentUser && (
          <StaffDashboard
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenReport={() => handleOpenReportWithSimulation()}
          />
        )}

        {currentView === 'pre_test' && currentUser && (
          <PreTestView
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'lessons' && currentUser && (
          <LessonsView
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'simulations' && currentUser && (
          <SimulationsView
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onReportSimulation={(sim) => handleOpenReportWithSimulation(sim)}
          />
        )}

        {currentView === 'quiz' && currentUser && (
          <QuizView
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'post_test' && currentUser && (
          <PostTestView
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'report' && (
          <ReportPhishingView
            currentUser={currentUser || {
              id: 'guest',
              name: 'Employee',
              email: 'staff@company.local',
              role: 'staff',
              department: 'Operations',
              status: 'active',
              createdAt: new Date().toISOString()
            }}
            onNavigate={handleNavigate}
            prefillSimulation={reportSimulationData}
          />
        )}

        {currentView === 'certificate' && currentUser && (
          <CertificateView
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {/* Admin Views */}
        {currentView === 'admin_dashboard' && currentUser && (
          <AdminDashboard
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'deployment' && currentUser && (
          <DeploymentPackageView
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'admin_login' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
