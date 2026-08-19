import React from 'react';
import { Shield, Lock, CheckCircle2, Award, ShieldAlert, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="app_footer" className="bg-white border-t border-slate-200 text-slate-600 text-sm mt-auto">
      
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: System Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight">Phishing Awareness Kit</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering team members with practical skills to spot, avoid, and report phishing and social engineering attacks safely.
            </p>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Safe Educational Environment</span>
            </div>
          </div>

          {/* Col 2: Training Workflow */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Training Steps</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('pre_test')} className="hover:text-blue-600 transition flex items-center space-x-1.5 text-slate-600 cursor-pointer">
                  <span className="font-semibold text-slate-400">1.</span>
                  <span>Baseline Assessment (3 mins)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lessons')} className="hover:text-blue-600 transition flex items-center space-x-1.5 text-slate-600 cursor-pointer">
                  <span className="font-semibold text-slate-400">2.</span>
                  <span>Interactive Lessons</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulations')} className="hover:text-blue-600 transition flex items-center space-x-1.5 text-slate-600 cursor-pointer">
                  <span className="font-semibold text-slate-400">3.</span>
                  <span>Inbox Email Practice</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('quiz')} className="hover:text-blue-600 transition flex items-center space-x-1.5 text-slate-600 cursor-pointer">
                  <span className="font-semibold text-slate-400">4.</span>
                  <span>Final Knowledge Quiz</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('certificate')} className="hover:text-blue-600 transition flex items-center space-x-1.5 text-slate-600 cursor-pointer">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Completion Certificate</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Safe Habits */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">The 4 Golden Rules</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span><strong>STOP:</strong> Take a deep breath if an email feels urgent.</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span><strong>CHECK:</strong> Inspect sender address & link previews.</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span><strong>VERIFY:</strong> Contact the sender via known official channels.</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span><strong>REPORT:</strong> Use the Report button anytime you are unsure.</span>
              </li>
            </ul>
          </div>

          {/* Col 4: IT & Security */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Security & Oversight</h4>
            <p className="text-xs text-slate-500 mb-3">
              Cybersecurity resilience program for enterprise security and staff training verification.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('report')}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 border border-rose-200 transition cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Report Suspicious Email</span>
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; 2026 Phishing Awareness Kit &bull; Cybersecurity Awareness & Employee Training.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span className="flex items-center space-x-1 text-slate-600">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secure & Privacy Protected</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center space-x-1 text-slate-600">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Blameless Learning Culture</span>
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};
