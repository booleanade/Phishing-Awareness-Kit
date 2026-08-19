import React from 'react';
import {
  Shield,
  ShieldCheck,
  Eye,
  Lock,
  MailWarning,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  HelpCircle,
  ChevronRight,
  AlertCircle,
  FileCheck,
  MousePointerClick,
  GraduationCap
} from 'lucide-react';
import { User } from '../../types';

interface LandingPageProps {
  currentUser: User | null;
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onNavigate,
  onOpenLogin
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center">
            
            {/* Friendly Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>PhishGuard Security Awareness &bull; Employee Training</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Spot the scams. Protect your team. <br className="hidden sm:inline" />
              <span className="text-blue-600">Think before you click.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A friendly, practical cybersecurity training kit designed for everyday employees. Learn how to recognize fake emails, protect organizational data, and safely report suspicious messages in under 15 minutes.
            </p>

            {/* Main Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                id="landing_btn_start_training"
                onClick={() => {
                  if (!currentUser) {
                    onOpenLogin();
                    return;
                  }
                  if (currentUser.role === 'admin') {
                    onNavigate('admin_dashboard');
                  } else {
                    onNavigate('staff_dashboard');
                  }
                }}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-sm transition hover:shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <span>{currentUser ? 'Go to My Training Portal' : 'Sign in with Google to Start'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Technical Jargon</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Realistic Simulation Drills</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Compliance Certificate</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4 Simple Steps of Training */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How Your Training Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            No complex technical jargon. Just clear, interactive, and actionable exercises you can complete at your own pace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Pre-Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a quick 10-question evaluation to see your current phishing awareness baseline.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
              <span>~3 minutes</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">5 Micro-Lessons</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn core attacker tactics: fake sender addresses, deceptive links, urgent deadlines, and mobile phishing.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
              <span>5 bite-sized topics</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Email Inbox Drills</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Practice identifying subtle red flags in realistic work simulated emails without any real risk.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-600">
              <span>Interactive practice</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Earn Certificate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pass the final knowledge quiz and post-test to receive your downloadable training completion certificate.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
              <span>Official verification</span>
            </div>
          </div>

        </div>
      </section>

      {/* Real-World Safety Rule Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Core Golden Rule</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                "When in doubt, use a separate, trusted channel to verify."
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                Legitimate companies and colleagues will never penalize you for taking 60 seconds to verify an unusual request, especially when it involves passwords, payroll details, banking wires, or clicking unknown attachments.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">✓</div>
                  <p className="text-xs sm:text-sm text-slate-700"><strong>Check Sender Domain:</strong> Hover over the email name to verify the actual underlying address.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">✓</div>
                  <p className="text-xs sm:text-sm text-slate-700"><strong>Inspect Links Before Clicking:</strong> Always preview the destination URL rather than trusting button labels.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">✓</div>
                  <p className="text-xs sm:text-sm text-slate-700"><strong>Report, Don't Ignore:</strong> Reporting a suspicious email protects all colleagues across the company.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 mb-4 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Immediate Threat Response</span>
              </div>
              <h3 className="text-lg font-bold">Received a Suspicious Email Right Now?</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Use our built-in 1-click Security Dispatcher to send the headers, sender address, and email content directly to SecOps for analysis.
              </p>
              <div className="mt-6">
                <button
                  id="landing_report_btn"
                  onClick={() => onNavigate('report')}
                  className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MailWarning className="w-4 h-4" />
                  <span>Submit Incident Report to SecOps</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
