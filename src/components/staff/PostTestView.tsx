import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, QuizQuestion, QuizAttempt, UserProgress } from '../../types';
import { StorageService } from '../../services/storage';

interface PostTestViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const PostTestView: React.FC<PostTestViewProps> = ({ currentUser, onNavigate }) => {
  const questions = StorageService.getQuestionsForAssessment('post_test');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'a' | 'b' | 'c' | 'd'>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);

  const question = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const preTestProgress = StorageService.getUserProgress(currentUser.id);
  const preTestPct = preTestProgress.preTestPercentage ?? 50;

  const handleSelectOption = (optId: 'a' | 'b' | 'c' | 'd') => {
    if (isSubmitted) return;
    setAnswers({
      ...answers,
      [question.id]: optId
    });
  };

  const handleSubmitPostTest = () => {
    let score = 0;
    const answerDetails = questions.map(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionId: q.id,
        selectedAnswer: selected || ('a' as const),
        isCorrect
      };
    });

    const percentage = Math.round((score / totalQuestions) * 100);

    const record = StorageService.recordQuizAttempt({
      userId: currentUser.id,
      assessmentType: 'post_test',
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 70,
      answers: answerDetails
    });

    setAttemptResult(record);
    setIsSubmitted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setAttemptResult(null);
    setCurrentIdx(0);
  };

  const postTestPct = attemptResult ? attemptResult.percentage : 0;
  const improvement = postTestPct - preTestPct;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#0d101d,#050608)] py-8 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Phase 5: Post-Test Awareness Measurement
              </span>
              <span className="text-xs text-slate-500 font-mono">10 Final Assessment Questions</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-white tracking-tight mt-1">
              Phishing Resilience Post-Test
            </h1>
            <p className="text-xs text-slate-400">
              Evaluates knowledge gains after completing lessons and simulations to compute your awareness improvement delta.
            </p>
          </div>

          <button
            onClick={() => onNavigate('staff_dashboard')}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/80 transition"
          >
            Dashboard
          </button>
        </div>

        {/* Results & Comparison Card */}
        {isSubmitted && attemptResult ? (
          <div className="space-y-6">
            
            {/* Impact Metric Hero Card */}
            <div className="bg-[#0a0c14] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  Post-Test Evaluation Complete!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Here is your quantified cybersecurity awareness growth:
                </p>
              </div>

              {/* Pre vs Post vs Improvement Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Pre-Test Baseline</p>
                  <p className="text-2xl font-bold text-slate-300 mt-1 font-mono">{preTestPct}%</p>
                  <p className="text-[11px] text-slate-500">Initial Diagnostic</p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Post-Test Score</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1 font-mono">{postTestPct}%</p>
                  <p className="text-[11px] text-slate-500 font-mono">{attemptResult.score}/10 Correct</p>
                </div>

                <div className="bg-slate-950/80 border border-emerald-500/40 p-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Improvement</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1 flex items-center justify-center space-x-1 font-mono">
                    <TrendingUp className="w-6 h-6" />
                    <span>{improvement >= 0 ? `+${improvement}%` : `${improvement}%`}</span>
                  </p>
                  <p className="text-[11px] text-emerald-400/70 font-medium">Percentage Points</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="btn_claim_certificate"
                  onClick={() => onNavigate('certificate')}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center space-x-2"
                >
                  <Award className="w-5 h-5" />
                  <span>Claim Your Official Certificate</span>
                </button>

                <button
                  onClick={handleRetake}
                  className="px-4 py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700/80 transition flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Post-Test</span>
                </button>
              </div>
            </div>

            {/* Questions Detailed Breakdown */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Post-Test Detailed Question Review</h3>
              {questions.map((q, idx) => {
                const userChoice = answers[q.id];
                const isCorrect = userChoice === q.correctAnswer;
                return (
                  <div key={q.id} className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-white flex items-start space-x-2">
                        <span className="text-slate-500 font-mono">#{idx + 1}.</span>
                        <span>{q.question}</span>
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2 font-mono ${
                        isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map(opt => {
                        const isSelected = userChoice === opt.id;
                        const isRightAnswer = q.correctAnswer === opt.id;
                        let optionStyle = 'bg-slate-950 border-slate-800 text-slate-400';
                        if (isRightAnswer) {
                          optionStyle = 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 font-medium';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'bg-red-950/30 border-red-500/40 text-red-300';
                        }
                        return (
                          <div key={opt.id} className={`p-2.5 rounded-xl border flex items-start space-x-2 ${optionStyle}`}>
                            <span className="font-mono uppercase font-bold text-[11px] mt-0.5">({opt.id})</span>
                            <span className="flex-1">{opt.text}</span>
                            {isRightAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-400">
                      <strong className="text-blue-400">Security Concept: </strong>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* Active Stepper */
          <div className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Stepper Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Question {currentIdx + 1} of {totalQuestions}</span>
                <span>{answeredCount} of {totalQuestions} Answered</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300 ease-out"
                  style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="py-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest font-mono">Question #{currentIdx + 1}</span>
              <h2 className="text-lg sm:text-xl font-light text-white mt-1 leading-snug tracking-tight">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map(opt => {
                const isSelected = answers[question.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-4 rounded-2xl text-left border transition flex items-start space-x-3 text-sm ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-950/60 hover:bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  currentIdx === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-700 bg-slate-950'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitPostTest}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Compute Improvement</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
