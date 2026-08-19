import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Send,
  CheckCircle2,
  MailWarning
} from 'lucide-react';
import { User, Simulation, PhishingReport } from '../../types';
import { StorageService } from '../../services/storage';

interface ReportPhishingViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
  prefillSimulation?: Simulation | null;
}

export const ReportPhishingView: React.FC<ReportPhishingViewProps> = ({
  currentUser,
  onNavigate,
  prefillSimulation
}) => {
  const [subject, setSubject] = useState(prefillSimulation?.subject || '');
  const [senderAddress, setSenderAddress] = useState(prefillSimulation?.senderEmail || '');
  const [suspiciousDetails, setSuspiciousDetails] = useState(
    prefillSimulation ? `Reported from practice scenario: ${prefillSimulation.title}. Observed signs: ${prefillSimulation.warningSigns.join(', ')}` : ''
  );
  const [urgencyLevel, setUrgencyLevel] = useState<PhishingReport['urgencyLevel']>('High');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !senderAddress.trim()) {
      setFormError('Please fill out both the email subject and suspicious sender address.');
      return;
    }
    setFormError(null);

    const report = StorageService.addReport({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      department: currentUser.department,
      subject: subject.trim(),
      senderAddress: senderAddress.trim(),
      suspiciousDetails: suspiciousDetails.trim() || 'Staff reported suspicious email indicators.',
      urgencyLevel: urgencyLevel,
      simulationId: prefillSimulation?.id,
      isSimulatedCampaign: !!prefillSimulation,
      status: prefillSimulation ? 'Simulated Test' : 'Pending Review'
    });

    setSubmittedReportId(report.id);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setSubject('');
    setSenderAddress('');
    setSuspiciousDetails('');
    setIsSubmitted(false);
    setSubmittedReportId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Incident Reporting Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Think You Found a Suspicious Email?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Reporting suspicious emails protects you and your coworkers. Follow the 4-step framework before submitting your report.
          </p>
        </div>

        {/* 4 Pillars Guide (STOP, CHECK, VERIFY, REPORT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 font-extrabold text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">STOP</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Don’t click links, don’t open attachments, and don’t reply. Pause and assess calmly.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-extrabold text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">CHECK</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect the sender address domain, hover to preview links, and look for artificial urgency.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">VERIFY</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm through a trusted secondary channel (known phone or chat). Never reply directly.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-sm">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900">REPORT</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your report using the secure form below to notify your IT and security team.
            </p>
          </div>

        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Suspicious Email Report Submitted!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Incident Ref: <code className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">{submittedReportId}</code>. Your report has been logged and is visible in the Admin Security Operations Center.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('staff_dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={handleResetForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Suspicious Email Submission Form</h3>
                  <p className="text-xs text-slate-500">Reporter: {currentUser.name} ({currentUser.email} &bull; {currentUser.department})</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Safe Educational Mode
                </span>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {prefillSimulation && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center space-x-2">
                  <MailWarning className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Reporting practice scenario: <strong className="text-slate-900">{prefillSimulation.title}</strong></span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Suspicious Sender Address / Domain *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    placeholder="e.g. support@it-security-portal-auth.test"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency Rating
                  </label>
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="Low">Low — Generic spam</option>
                    <option value="Medium">Medium — Suspicious attachment or link</option>
                    <option value="High">High — Credential harvester / Urgency</option>
                    <option value="Critical">Critical — Executive wire transfer / BEC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. ACTION REQUIRED: Password Expires in 2 Hours"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observed Indicators & Suspicious Details
                </label>
                <textarea
                  rows={4}
                  value={suspiciousDetails}
                  onChange={(e) => setSuspiciousDetails(e.target.value)}
                  placeholder="Describe why you believe this is phishing (e.g. mismatched domain, double extension .exe, forced urgency, request to bypass standard approval)..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 leading-relaxed transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('staff_dashboard')}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  id="btn_submit_phishing_report"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm transition flex items-center space-x-2 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Phishing Report</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
