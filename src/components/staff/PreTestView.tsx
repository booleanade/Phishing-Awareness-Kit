import React, { useState } from 'react';
import {
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import { User, QuizQuestion, QuizAttempt } from '../../types';
import { StorageService } from '../../services/storage';

interface PreTestViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const PreTestView: React.FC<PreTestViewProps> = ({ currentUser, onNavigate }) => {
  const questions = StorageService.getQuestionsForAssessment('pre_test');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'a' | 'b' | 'c' | 'd'>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);

  const question = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optId: 'a' | 'b' | 'c' | 'd') => {
    if (isSubmitted) return;
    setAnswers({
      ...answers,
      [question.id]: optId
    });
  };

  const handleSubmitTest = () => {
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
      assessmentType: 'pre_test',
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 70,
      answers: answerDetails
    });

    setAttemptResult(record);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setAttemptResult(null);
    setCurrentIdx(0);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#0d101d,#050608)] py-8 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                Phase 1: Baseline Assessment
              </span>
              <span className="text-xs text-slate-500 font-mono">10 Diagnostic Questions</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-white tracking-tight mt-1">
              Phishing Awareness Pre-Test
            </h1>
            <p className="text-xs text-slate-400">
              This assessment establishes your baseline security awareness before taking the instructional lessons.
            </p>
          </div>

          <button
            onClick={() => onNavigate('staff_dashboard')}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/80 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* If Submitted: Show Results & Explanations */}
        {isSubmitted && attemptResult ? (
          <div className="space-y-6">
            
            {/* Score Banner */}
            <div className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-2 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                Pre-Test Completed!
              </h2>
              <div className="max-w-md mx-auto bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-around">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Correct Answers</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{attemptResult.score} / {attemptResult.totalQuestions}</p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Baseline Score</p>
                  <p className="text-2xl font-bold text-blue-400 mt-0.5">{attemptResult.percentage}%</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Your pre-test baseline has been securely saved to the database. Review each question explanation below, then proceed to the awareness lessons.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('lessons')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Proceed to Awareness Lessons</span>
                </button>
                <button
                  onClick={handleRetake}
                  className="px-4 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700/80 transition flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Pre-Test</span>
                </button>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Pre-Test Diagnostic Review</h3>
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
                      <strong className="text-blue-400">Security Explanation: </strong>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* Active Question Stepper */
          <div className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Question {currentIdx + 1} of {totalQuestions}</span>
                <span>{answeredCount} of {totalQuestions} Answered</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-300 ease-out"
                  style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="py-2">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest font-mono">Question #{currentIdx + 1}</span>
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
                        ? 'bg-blue-950/40 border-blue-500 text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                        : 'bg-slate-950/60 hover:bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Stepper Navigation Buttons */}
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
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Baseline Pre-Test</span>
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
