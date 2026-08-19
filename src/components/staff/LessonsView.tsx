import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { User, Lesson } from '../../types';
import { StorageService } from '../../services/storage';

interface LessonsViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({ currentUser, onNavigate }) => {
  const lessons = StorageService.getLessons();
  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0]?.id || 'lesson-1');
  const [progress, setProgress] = useState(StorageService.getUserProgress(currentUser.id));

  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];
  const isLessonCompleted = currentLesson ? progress.completedLessonIds.includes(currentLesson.id) : false;

  const handleMarkComplete = () => {
    if (!currentLesson) return;
    const updated = StorageService.markLessonComplete(currentUser.id, currentLesson.id);
    setProgress(updated);
  };

  const handleNextLesson = () => {
    handleMarkComplete();
    const currentIndex = lessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
      setActiveLessonId(lessons[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All lessons finished, navigate to simulations
      onNavigate('simulations');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#0d101d,#050608)] py-8 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                Phase 2: Instructional Core
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {progress.completedLessonIds.length} of {lessons.length} Modules Completed
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-white tracking-tight mt-1">
              Cybersecurity Awareness Lessons
            </h1>
            <p className="text-xs text-slate-400">
              Master the anatomy of deception, social engineering tactics, and the STOP-CHECK-VERIFY-REPORT defense model.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('staff_dashboard')}
              className="px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/80 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('simulations')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center space-x-1.5"
            >
              <span>Practice Simulations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar Navigator + Lesson Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Lesson Selector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 font-mono">
              Modules Navigation
            </h3>

            <div className="space-y-2">
              {lessons.map((les, index) => {
                const isSelected = les.id === activeLessonId;
                const isDone = progress.completedLessonIds.includes(les.id);
                return (
                  <button
                    key={les.id}
                    id={`lesson_item_${les.id}`}
                    onClick={() => {
                      setActiveLessonId(les.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full p-4 rounded-2xl text-left border transition flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-[#0a0c14] border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                        : 'bg-[#0a0c14]/80 hover:bg-[#0a0c14] border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : isSelected
                        ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                        : 'bg-slate-950 text-slate-500'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate text-slate-200">{les.title}</span>
                        <span className="text-[10px] text-slate-500 flex items-center space-x-1 shrink-0 ml-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{les.estimatedMinutes}m</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {les.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Framework Reminder Card */}
            <div className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center space-x-1.5 font-mono">
                <Lightbulb className="w-4 h-4" />
                <span>Quick Defense Rule</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">STOP:</strong> Pause impulsivity.<br />
                <strong className="text-slate-200">CHECK:</strong> Inspect domain & links.<br />
                <strong className="text-slate-200">VERIFY:</strong> Out-of-band communication.<br />
                <strong className="text-slate-200">REPORT:</strong> Notify SecOps team.
              </p>
            </div>
          </div>

          {/* Right Column: Active Lesson Reader (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <article className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Lesson Title Banner */}
              <div className="border-b border-slate-800 pb-5">
                <div className="flex items-center space-x-2 text-[10px] text-blue-400 font-mono tracking-wider mb-1">
                  <span>MODULE {currentLesson.orderNumber} OF {lessons.length}</span>
                  <span>&bull;</span>
                  <span>EST. {currentLesson.estimatedMinutes} MINUTES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  {currentLesson.title}
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {currentLesson.description}
                </p>
              </div>

              {/* Lesson Sections */}
              <div className="space-y-6 text-slate-300">
                {currentLesson.sections.map((sec, idx) => (
                  <section key={idx} className="space-y-3">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {sec.heading}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {sec.content}
                    </p>

                    {sec.bulletPoints && (
                      <ul className="space-y-2 text-sm text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                        {sec.bulletPoints.map((bp, bIdx) => (
                          <li key={bIdx} className="flex items-start space-x-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {sec.callout && (
                      <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs leading-relaxed ${
                        sec.callout.type === 'danger'
                          ? 'bg-red-950/20 border-red-500/30 text-red-300'
                          : sec.callout.type === 'warning'
                          ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                          : sec.callout.type === 'tip'
                          ? 'bg-blue-950/20 border-blue-500/30 text-blue-300'
                          : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300'
                      }`}>
                        {sec.callout.type === 'danger' && <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                        {sec.callout.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                        {sec.callout.type === 'tip' && <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
                        {sec.callout.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
                        <div>
                          <strong className="block font-bold mb-0.5 text-slate-200">{sec.callout.title}</strong>
                          <span className="text-slate-400">{sec.callout.message}</span>
                        </div>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Key Takeaways Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center space-x-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Defensive Takeaways</span>
                </h4>
                <div className="space-y-2">
                  {currentLesson.keyTakeaways.map((kt, kIdx) => (
                    <div key={kIdx} className="flex items-start space-x-2 text-xs text-slate-400">
                      <span className="text-blue-400 font-bold font-mono">[{kIdx + 1}]</span>
                      <span>{kt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions: Mark Complete / Next Lesson */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  id="btn_mark_lesson_complete"
                  onClick={handleMarkComplete}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                    isLessonCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/80'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isLessonCompleted ? 'Marked as Completed' : 'Mark as Completed'}</span>
                </button>

                <button
                  id="btn_next_lesson"
                  onClick={handleNextLesson}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center space-x-2"
                >
                  <span>
                    {currentLesson.orderNumber === lessons.length
                      ? 'Finish & Go To Simulations'
                      : 'Next Module'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </article>
          </div>

        </div>

      </div>
    </div>
  );
};
