import React from 'react';
import {
  ShieldCheck,
  BookOpen,
  MailWarning,
  GraduationCap,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Eye,
  Check,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { User, UserProgress } from '../../types';
import { StorageService } from '../../services/storage';

interface StaffDashboardProps {
  currentUser: User;
  onNavigate: (view: string) => void;
  onOpenReport: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  onNavigate,
  onOpenReport
}) => {
  const [progress, setProgress] = React.useState<UserProgress>(() => StorageService.getUserProgress(currentUser.id));
  const lessons = StorageService.getLessons();
  const simulations = StorageService.getSimulations();
  const passingScore = StorageService.getPassingScore();

  // Calculate overall training completion percentage
  const totalSteps = 5; // Pre-test (1), Lessons (1), Simulations (1), Quiz (1), Post-test (1)
  let completedSteps = 0;
  if (progress.preTestCompleted) completedSteps++;
  if (progress.completedLessonIds.length >= lessons.length) completedSteps++;
  if (progress.completedSimulationIds.length >= 4) completedSteps++;
  if (progress.quizCompleted && (progress.quizPassed || (progress.quizPercentage || 0) >= passingScore)) completedSteps++;
  if (progress.postTestCompleted) completedSteps++;

  const overallProgressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const handleResetProgress = () => {
    StorageService.resetUserData(currentUser.id);
    const updated = StorageService.getUserProgress(currentUser.id);
    setProgress(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  Staff Training Portal
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-slate-500 font-medium">{currentUser.department} Department</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Track your cybersecurity awareness milestones, practice spotting suspicious emails in your safe inbox, and earn your official certificate.
              </p>
            </div>

            {/* Quick Action Navigation Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="staff_btn_continue_training"
                onClick={() => onNavigate('lessons')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition flex items-center space-x-2 shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Go to Lessons</span>
              </button>

              <button
                id="staff_btn_start_simulation"
                onClick={() => onNavigate('simulations')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 transition flex items-center space-x-2"
              >
                <MailWarning className="w-4 h-4 text-blue-600" />
                <span>Practice Inbox</span>
              </button>

              <button
                id="staff_btn_take_quiz"
                onClick={() => onNavigate('quiz')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 transition flex items-center space-x-2"
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Knowledge Quiz</span>
              </button>

              <button
                id="staff_btn_report_phishing"
                onClick={onOpenReport}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs sm:text-sm border border-rose-200 transition flex items-center space-x-2"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Report Suspicious Email</span>
              </button>

              {progress.trainingCompleted && (
                <button
                  id="staff_btn_view_certificate"
                  onClick={() => onNavigate('certificate')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-xs"
                >
                  <Award className="w-4 h-4" />
                  <span>My Certificate</span>
                </button>
              )}

              <button
                id="staff_btn_reset_demo"
                onClick={handleResetProgress}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 transition flex items-center space-x-1"
                title="Reset progress to test again"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Key Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Overall Training Status */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Overall Progress</div>
            <div className="text-2xl font-extrabold text-slate-900">{overallProgressPercentage}%</div>
            <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {completedSteps} of {totalSteps} milestones completed
            </div>
          </div>

          {/* Card 2: Baseline Score */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Baseline Assessment</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {progress.preTestCompleted ? `${progress.preTestPercentage}%` : 'Not Started'}
            </div>
            <div className={`text-xs mt-2 font-medium ${progress.preTestCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>
              {progress.preTestCompleted
                ? `${progress.preTestScore}/10 initial check score`
                : 'Takes 3 minutes to complete'}
            </div>
          </div>

          {/* Card 3: Phishing Spot Rate */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Simulation Accuracy</div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {progress.phishingRecognitionRate || 85}%
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {progress.completedSimulationIds.length} safe practice emails evaluated
            </div>
          </div>

          {/* Card 4: Certification Status */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Certification Status</div>
            <div className="text-2xl font-extrabold text-blue-600">
              {progress.trainingCompleted ? 'Certified Safe' : 'In Progress'}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {progress.trainingCompleted ? 'Valid for 12 months' : 'Complete quiz to unlock'}
            </div>
          </div>

        </div>

        {/* Practice Email Spotlight + Lessons Summary & Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Practice Email Spotlight */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden h-full shadow-xs">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <MailWarning className="w-4 h-4 text-blue-600" />
                  <span>Interactive Practice Email: Quick Spot Challenge</span>
                </h3>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">
                  Safe Sandbox
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-5 space-y-3">
                  <div className="grid grid-cols-6 gap-2 text-xs sm:text-sm">
                    <span className="text-slate-500 col-span-2 sm:col-span-1 font-medium">From:</span>
                    <span className="text-slate-800 col-span-4 sm:col-span-5 font-mono text-xs">
                      IT Helpdesk &lt;support@micros0ft-office365-login.net&gt;
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-2 text-xs sm:text-sm">
                    <span className="text-slate-500 col-span-2 sm:col-span-1 font-medium">Subject:</span>
                    <span className="text-rose-600 font-bold col-span-4 sm:col-span-5">
                      [URGENT] Verify your corporate password within 2 hours
                    </span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                    Hello team member, <br /><br />
                    We detected unusual activity in your account. If you do not re-authenticate immediately by clicking the button below, your corporate email access will be locked permanently.
                  </div>
                  <div
                    onClick={() => onNavigate('simulations')}
                    className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition font-semibold text-xs sm:text-sm"
                  >
                    Click Here to Confirm Account (Safe Simulation Test)
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate('simulations')}
                    className="flex-1 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Report as Phishing</span>
                  </button>
                  <button
                    onClick={() => onNavigate('simulations')}
                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>Open in Full Practice Inbox</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Progress & Helpful Tip */}
          <div className="flex flex-col gap-6">
            
            {/* Lessons Completion Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Lesson Progress</h3>
                <span className="text-xs font-bold text-blue-600">{progress.completedLessonIds.length}/{lessons.length} Completed</span>
              </div>
              <div className="space-y-2.5">
                {lessons.map((lesson, idx) => {
                  const isDone = progress.completedLessonIds.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => onNavigate('lessons')}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className={`text-xs sm:text-sm flex-1 truncate font-medium ${isDone ? 'text-slate-900' : 'text-slate-600'}`}>
                        {lesson.title}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {isDone ? 'Done' : 'Start'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Safe Tip */}
            <div className="flex-1 bg-blue-50/60 border border-blue-100 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-slate-900 font-bold text-sm mb-1">Safe Habit Reminder</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                Always hover your mouse cursor over any link before clicking to preview its actual destination URL.
              </p>
            </div>

          </div>

        </div>

        {/* Sequential Training Steps */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Training Steps</h3>
              <p className="text-xs text-slate-500">Complete each step to finish your training and earn your certificate.</p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Passing threshold: {passingScore}%
            </span>
          </div>

          <div className="space-y-3">
            
            {/* Step 1: Baseline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 bg-white hover:bg-slate-50/50 transition gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  progress.preTestCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {progress.preTestCompleted ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Step 1: Baseline Check (Pre-Test)</h4>
                  <p className="text-xs text-slate-500">10 diagnostic questions to see where you can learn the most.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                {progress.preTestCompleted && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Score: {progress.preTestPercentage}%
                  </span>
                )}
                <button
                  onClick={() => onNavigate('pre_test')}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                >
                  {progress.preTestCompleted ? 'Review Answers' : 'Start (3 min)'}
                </button>
              </div>
            </div>

            {/* Step 2: 5 Lessons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 bg-white hover:bg-slate-50/50 transition gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  progress.completedLessonIds.length >= lessons.length
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {progress.completedLessonIds.length >= lessons.length ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Step 2: Interactive Lessons</h4>
                  <p className="text-xs text-slate-500">5 bite-sized visual lessons on spotting email tricks and indicators.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <span className="text-xs font-semibold text-slate-600">
                  {progress.completedLessonIds.length}/{lessons.length} Completed
                </span>
                <button
                  onClick={() => onNavigate('lessons')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition shadow-xs"
                >
                  View Lessons
                </button>
              </div>
            </div>

            {/* Step 3: Simulations */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 bg-white hover:bg-slate-50/50 transition gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  progress.completedSimulationIds.length >= 4
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {progress.completedSimulationIds.length >= 4 ? <CheckCircle2 className="w-5 h-5" /> : '3'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Step 3: Safe Email Practice (Inbox Simulator)</h4>
                  <p className="text-xs text-slate-500">Practice classifying realistic emails with immediate learning tips.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <span className="text-xs font-semibold text-slate-600">
                  {progress.completedSimulationIds.length}/{simulations.length} Reviewed
                </span>
                <button
                  onClick={() => onNavigate('simulations')}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                >
                  Open Inbox
                </button>
              </div>
            </div>

            {/* Step 4: Knowledge Quiz */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 bg-white hover:bg-slate-50/50 transition gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  progress.quizCompleted && (progress.quizPassed || (progress.quizPercentage || 0) >= passingScore)
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {progress.quizCompleted && (progress.quizPassed || (progress.quizPercentage || 0) >= passingScore) ? <CheckCircle2 className="w-5 h-5" /> : '4'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Step 4: Final Knowledge Quiz</h4>
                  <p className="text-xs text-slate-500">10 scenario questions. Pass with {passingScore}% or higher.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                {progress.quizCompleted && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    (progress.quizPercentage || 0) >= passingScore
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    {progress.quizPercentage}% ({(progress.quizPercentage || 0) >= passingScore ? 'Passed' : 'Try Again'})
                  </span>
                )}
                <button
                  onClick={() => onNavigate('quiz')}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                >
                  {progress.quizCompleted ? 'Retake Quiz' : 'Take Quiz'}
                </button>
              </div>
            </div>

            {/* Step 5: Post-Test */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 bg-white hover:bg-slate-50/50 transition gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  progress.postTestCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {progress.postTestCompleted ? <CheckCircle2 className="w-5 h-5" /> : '5'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Step 5: Post-Test & Certification</h4>
                  <p className="text-xs text-slate-500">See how much you improved and download your completion certificate.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                {progress.postTestCompleted && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Score: {progress.postTestPercentage}%
                  </span>
                )}
                <button
                  onClick={() => onNavigate('post_test')}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                >
                  {progress.postTestCompleted ? 'View Certificate' : 'Take Post-Test'}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
