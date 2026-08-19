import React from 'react';
import {
  Shield,
  Printer,
  ArrowLeft
} from 'lucide-react';
import { User, UserProgress } from '../../types';
import { StorageService } from '../../services/storage';

interface CertificateViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ currentUser, onNavigate }) => {
  const progress: UserProgress = currentUser ? StorageService.getUserProgress(currentUser.id) : {
    userId: '',
    preTestCompleted: false,
    preTestScore: 0,
    preTestPercentage: 0,
    completedLessonIds: [],
    completedSimulationIds: [],
    quizCompleted: false,
    quizScore: 0,
    quizPercentage: 0,
    quizPassed: false,
    postTestCompleted: false,
    postTestScore: 0,
    postTestPercentage: 0,
    phishingRecognitionRate: 0,
    improvementDelta: 0,
    trainingCompleted: false
  };
  const completionDate = progress.completionDate || new Date().toISOString().split('T')[0];
  const certId = `PAK-CERT-${(currentUser?.id || 'STAFF').substring(0, 6).toUpperCase()}-${new Date().getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 print:bg-white print:text-black print:p-0">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Screen Action Bar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs print:hidden">
          <button
            onClick={() => onNavigate('staff_dashboard')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center space-x-2 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Card Frame */}
        <div className="relative bg-white border-8 border-slate-100 rounded-3xl p-8 sm:p-14 shadow-lg overflow-hidden print:border-4 print:border-slate-800 print:bg-white print:shadow-none print:p-8">
          
          {/* Decorative Border Inset */}
          <div className="border-2 border-amber-600/30 rounded-2xl p-6 sm:p-10 relative z-10 text-center space-y-6">
            
            {/* Seal & Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center shadow-xs">
                <Shield className="w-8 h-8 text-amber-700" />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-bold font-sans">
                CYBERSECURITY AWARENESS PROGRAM &bull; VERIFIED CREDENTIAL
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-2 font-serif tracking-tight">
                Certificate of Cybersecurity Awareness
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Official Certification of Competency in Phishing Defense & Threat Reporting
              </p>
            </div>

            <div className="py-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">This is proudly awarded to</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mt-2 tracking-tight font-serif text-blue-900">
                {currentUser?.name || 'Staff Member'}
              </h2>
              <p className="text-sm font-medium text-slate-600 mt-3">
                Department: {currentUser?.department || 'General Staff'} &bull; {currentUser?.email || 'user@organization.com'}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              For successfully completing the interactive training curriculum on social engineering, malicious link inspection, sender analysis, and simulated email threat reporting.
            </p>

            {/* Performance Statistics Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs text-slate-500 font-semibold">Knowledge Quiz</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {progress.quizPercentage ?? 85}%
                </p>
              </div>
              <div className="border-x border-slate-200">
                <p className="text-xs text-slate-500 font-semibold">Post-Assessment</p>
                <p className="text-base font-bold text-emerald-700 mt-0.5">
                  {progress.postTestPercentage ?? 90}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Improvement</p>
                <p className="text-base font-bold text-blue-700 mt-0.5">
                  +{progress.improvementDelta ?? 40}%
                </p>
              </div>
            </div>

            {/* Signatures & Issue Metadata */}
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-left text-xs">
              <div className="space-y-1">
                <p className="text-slate-500 uppercase text-[10px] tracking-wider font-semibold">Date Issued</p>
                <p className="font-semibold text-slate-900 font-mono">{completionDate}</p>
                <p className="text-slate-500 text-[10px]">Certificate ID: {certId}</p>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="h-9 flex items-end justify-center sm:justify-end">
                  <span className="font-serif italic text-base text-slate-800 font-bold">
                    Information Security Office
                  </span>
                </div>
                <div className="w-48 h-px bg-slate-300 mx-auto sm:ml-auto" />
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Security & Compliance Division</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
