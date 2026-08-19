import React, { useState } from 'react';
import {
  Mail,
  MailWarning,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Paperclip,
  ExternalLink,
  Info,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Eye,
  Flag,
  ChevronRight
} from 'lucide-react';
import { User, Simulation, SimulationAttempt } from '../../types';
import { StorageService } from '../../services/storage';

interface SimulationsViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
  onReportSimulation: (sim: Simulation) => void;
}

export const SimulationsView: React.FC<SimulationsViewProps> = ({
  currentUser,
  onNavigate,
  onReportSimulation
}) => {
  const simulations = StorageService.getSimulations();
  const [activeSimId, setActiveSimId] = useState<string>(simulations[0]?.id || 'sim-1');
  const [showInspector, setShowInspector] = useState(false);
  const [attemptFeedback, setAttemptFeedback] = useState<{
    simId: string;
    selected: 'phishing' | 'legitimate';
    isCorrect: boolean;
  } | null>(null);

  const activeSim = simulations.find(s => s.id === activeSimId) || simulations[0];
  const userProgress = StorageService.getUserProgress(currentUser.id);
  const pastAttempts = StorageService.getSimulationAttempts().filter(a => a.userId === currentUser.id);

  const currentSimAttempt = activeSim ? pastAttempts.find(a => a.simulationId === activeSim.id) : undefined;

  const handleDecision = (choice: 'phishing' | 'legitimate') => {
    if (!activeSim) return;
    const isCorrect = (choice === 'phishing' && activeSim.isPhishing) || (choice === 'legitimate' && !activeSim.isPhishing);

    StorageService.recordSimulationAttempt({
      userId: currentUser.id,
      simulationId: activeSim.id,
      selectedAnswer: choice,
      isCorrect
    });

    setAttemptFeedback({
      simId: activeSim.id,
      selected: choice,
      isCorrect
    });
  };

  const handleNextSimulation = () => {
    setAttemptFeedback(null);
    setShowInspector(false);
    const currIndex = simulations.findIndex(s => s.id === activeSimId);
    if (currIndex < simulations.length - 1) {
      setActiveSimId(simulations[currIndex + 1].id);
    } else {
      onNavigate('quiz');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Phase 3: Interactive Sandbox
              </span>
              <span className="text-xs text-slate-400">
                Recognition Accuracy: <strong className="text-cyan-400 font-mono">{userProgress.phishingRecognitionRate}%</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Safe Phishing Simulation Lab
            </h1>
            <p className="text-xs text-slate-400">
              Analyze realistic email communications. Inspect sender domains, links, attachments, and classify each as Legitimate or Phishing.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('staff_dashboard')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center space-x-1.5"
            >
              <span>Take Knowledge Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Layout: Simulation Inbox Selector (4 cols) + Email Client Viewer (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Inbox List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulated Inboxes ({simulations.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {userProgress.completedSimulationIds.length}/{simulations.length} Tested
              </span>
            </div>

            <div className="space-y-2">
              {simulations.map((sim, idx) => {
                const isSelected = sim.id === activeSimId;
                const pastAttempt = pastAttempts.find(a => a.simulationId === sim.id);
                return (
                  <button
                    key={sim.id}
                    id={`sim_inbox_item_${sim.id}`}
                    onClick={() => {
                      setActiveSimId(sim.id);
                      setAttemptFeedback(null);
                      setShowInspector(false);
                    }}
                    className={`w-full p-3.5 rounded-xl text-left border transition flex flex-col space-y-2 ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold truncate max-w-[170px] text-white">
                        {sim.senderName}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          sim.difficulty === 'Beginner'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : sim.difficulty === 'Intermediate'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {sim.difficulty}
                        </span>
                        {pastAttempt && (
                          <span className={`w-2 h-2 rounded-full ${pastAttempt.isCorrect ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {sim.subject}
                    </p>

                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {sim.messageText}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Client Simulator (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Email Canvas Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Mail Client Header Bar */}
              <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                    <span className="text-xs text-slate-500 ml-2 font-mono">Corporate Webmail Client &bull; Scenario #{activeSim.id}</span>
                  </div>

                  {/* Red-flag / Inspector toggle */}
                  <button
                    onClick={() => setShowInspector(!showInspector)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                      showInspector
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showInspector ? 'Hide Red Flags' : 'Inspect Red Flags'}</span>
                  </button>
                </div>

                {/* Sender Headers */}
                <div className="space-y-1 text-xs pt-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-slate-400 font-semibold w-14">From:</span>
                    <strong className="text-white">{activeSim.senderName}</strong>
                    <code className="text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      &lt;{activeSim.senderEmail}&gt;
                    </code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-semibold w-14">To:</span>
                    <span className="text-slate-300 font-mono">{activeSim.recipientEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-semibold w-14">Date:</span>
                    <span className="text-slate-400">{activeSim.dateString}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-semibold w-14">Subject:</span>
                    <span className="font-bold text-white text-sm">{activeSim.subject}</span>
                  </div>
                </div>

                {/* Attachment Bar if applicable */}
                {activeSim.hasAttachment && (
                  <div className="mt-2 bg-slate-900 border border-amber-500/40 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-amber-400" />
                      <span className="font-mono text-amber-200 font-bold">{activeSim.attachmentName}</span>
                      <span className="text-slate-400">({activeSim.attachmentSize})</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      Suspicious Payload Risk
                    </span>
                  </div>
                )}
              </div>

              {/* Email Body Rendering */}
              <div className="p-6 sm:p-8 bg-white text-slate-900 min-h-[260px] overflow-x-auto">
                <div
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: activeSim.messageHtml }}
                />
              </div>

              {/* URL Hover / Destination Inspection Indicator */}
              {activeSim.displayUrl && (
                <div className="bg-slate-950 border-t border-slate-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-slate-400">Anchor Display:</span>
                    <code className="text-slate-300 truncate max-w-xs">{activeSim.displayUrl}</code>
                  </div>
                  <div className="flex items-center space-x-2 text-red-300 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                    <span className="font-bold">Actual Target:</span>
                    <code className="font-mono text-[11px] truncate max-w-xs">{activeSim.actualDestinationUrl}</code>
                  </div>
                </div>
              )}

              {/* Red-Flag Inspector Drawer */}
              {showInspector && (
                <div className="bg-slate-950/95 border-t border-cyan-500/30 p-5 space-y-3 animate-in fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
                    <Info className="w-4 h-4" />
                    <span>Cybersecurity Analyst Indicators:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeSim.warningSigns.map((sign, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Decision Footer */}
              <div className="bg-slate-900 border-t border-slate-800 p-5 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Your Evaluation:</h3>
                    <p className="text-xs text-slate-400">Is this message legitimate communication or a phishing attempt?</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      id="btn_sim_is_legit"
                      onClick={() => handleDecision('legitimate')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-md shadow-emerald-600/20"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>This is Legitimate</span>
                    </button>

                    <button
                      id="btn_sim_is_phishing"
                      onClick={() => handleDecision('phishing')}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-md shadow-red-600/20"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>This is Phishing</span>
                    </button>

                    <button
                      id="btn_sim_report_flag"
                      onClick={() => onReportSimulation(activeSim)}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-amber-500/30 transition flex items-center space-x-1.5"
                      title="File a formal incident report for this email"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>

                {/* Immediate Safe Educational Feedback Panel */}
                {attemptFeedback && (
                  <div className={`p-5 rounded-xl border space-y-3 animate-in fade-in ${
                    attemptFeedback.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/40 border-red-500/40 text-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {attemptFeedback.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <h4 className="text-sm font-bold text-white">
                          {attemptFeedback.isCorrect ? 'Correct Decision!' : 'Incorrect Decision!'}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900/80">
                        {activeSim.isPhishing ? '⚠️ Simulated Phishing Attempt' : '✅ Verified Authentic'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {activeSim.explanation}
                    </p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {activeSim.tacticsUsed.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-slate-900 px-2 py-0.5 rounded text-cyan-300 border border-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={handleNextSimulation}
                        className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
                      >
                        <span>Next Scenario</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
