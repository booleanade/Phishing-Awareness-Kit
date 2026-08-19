import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { User, QuizQuestion, QuizAttempt } from '../../types';
import { StorageService } from '../../services/storage';

interface QuizViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ currentUser, onNavigate }) => {
  const questions = StorageService.getQuestionsForAssessment('quiz');
  const passingScore = StorageService.getPassingScore();
  const lessons = StorageService.getLessons();

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

  const handleSubmitQuiz = () => {
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
    const passed = percentage >= passingScore;

    const record = StorageService.recordQuizAttempt({
      userId: currentUser.id,
      assessmentType: 'quiz',
      score,
      totalQuestions,
      percentage,
      passed,
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

  // Find lessons to recommend based on incorrect answers
  const recommendedLessonIds = isSubmitted && attemptResult
    ? Array.from(new Set(
        attemptResult.answers
          .filter(a => !a.isCorrect)
          .map(a => {
            const q = questions.find(item => item.id === a.questionId);
            return q?.relatedLessonId;
          })
          .filter(Boolean) as string[]
      ))
    : [];

  const recommendedLessons = lessons.filter(l => recommendedLessonIds.includes(l.id));

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#0d101d,#050608)] py-8 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-[#0a0c14] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                Phase 4: Knowledge Mastery
              </span>
              <span className="text-xs text-slate-500 font-mono">10 Questions &bull; Passing: {passingScore}%</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-white tracking-tight mt-1">
              Phishing Awareness Knowledge Quiz
            </h1>
            <p className="text-xs text-slate-400">
              Test your understanding of phishing vectors, verification protocols, and incident containment.
            </p>
          </div>

          <button
            onClick={() => onNavigate('staff_dashboard')}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/80 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* If Submitted: Show Results & Recommendations */}
        {isSubmitted && attemptResult ? (
          <div className="space-y-6">
            
            {/* Score Banner */}
            <div className={`border rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl ${
              attemptResult.passed
                ? 'bg-[#0a0c14] border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                : 'bg-[#0a0c14] border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
            }`}>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 ${
                attemptResult.passed
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
              }`}>
                {attemptResult.passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>

              <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                {attemptResult.passed ? 'Quiz Passed Successfully!' : 'Quiz Needs Retake'}
              </h2>

              <div className="max-w-md mx-auto bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-around">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Score</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{attemptResult.score} / {attemptResult.totalQuestions}</p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Percentage</p>
                  <p className={`text-2xl font-bold mt-0.5 ${attemptResult.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {attemptResult.percentage}%
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Status</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 font-mono ${
                    attemptResult.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {attemptResult.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>

              {/* Recommended Lessons Box if user missed questions */}
              {recommendedLessons.length > 0 && (
                <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl p-4 max-w-xl mx-auto text-left space-y-2">
                  <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center space-x-1.5 font-mono">
                    <Lightbulb className="w-4 h-4 text-blue-400" />
                    <span>Recommended Lesson Review:</span>
                  </h4>
                  <div className="space-y-1.5">
                    {recommendedLessons.map(l => (
                      <button
                        key={l.id}
                        onClick={() => onNavigate('lessons')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 text-xs text-slate-200 border border-slate-800 transition"
                      >
                        <span className="font-semibold">{l.title}</span>
                        <span className="text-blue-400 text-[11px] font-mono">Review Module &rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {attemptResult.passed ? (
                  <button
                    onClick={() => onNavigate('post_test')}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center space-x-2"
                  >
                    <span>Proceed to Final Post-Test</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleRetake}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Knowledge Quiz</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigate('staff_dashboard')}
                  className="px-4 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700/80 transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Quiz Questions Detailed Breakdown</h3>
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

            {/* Stepper Navigation */}
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
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Score Quiz</span>
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
