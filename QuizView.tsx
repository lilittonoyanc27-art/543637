import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Play, 
  HelpCircle, 
  ArrowRight, 
  Languages, 
  Eye, 
  EyeOff, 
  Award,
  Sparkles,
  BookCheck,
  ChevronRight
} from 'lucide-react';
import type { QuizQuestion, ScoreSummary } from './types.ts';
import { calculateScoreSummary, evaluateAnswer, formatTime } from './quizRules.ts';

interface Props {
  questions: QuizQuestion[];
  onSeekToVideo: (timestamp: number) => void;
  onGoToVideoTab: () => void;
}

export const QuizView: React.FC<Props> = ({ 
  questions, 
  onSeekToVideo,
  onGoToVideoTab
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Translation reveal states for current question & choices
  const [showQuestionHy, setShowQuestionHy] = useState<boolean>(false);
  const [revealedOptionsHy, setRevealedOptionsHy] = useState<Record<string, boolean>>({});

  const currentQ = questions[currentIndex];
  const selectedOptionId = userAnswers[currentQ?.id];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId
    }));
    setIsAnswerSubmitted(true);
  };

  const toggleOptionHy = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();
    setRevealedOptionsHy(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswerSubmitted(!!userAnswers[questions[currentIndex + 1]?.id]);
      setShowQuestionHy(false);
      setRevealedOptionsHy({});
    } else {
      // Finish quiz
      setIsQuizFinished(true);
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // gracefully ignore if canvas not supported
      }
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsAnswerSubmitted(false);
    setIsQuizFinished(false);
    setShowQuestionHy(false);
    setRevealedOptionsHy({});
  };

  // Calculate scores
  const correctCount = questions.filter(q => evaluateAnswer(q, userAnswers[q.id])).length;
  const summary: ScoreSummary = calculateScoreSummary(correctCount, questions.length);

  // If quiz is finished, show Results Dashboard
  if (isQuizFinished) {
    return (
      <div className="w-full flex flex-col gap-6 max-w-3xl mx-auto">
        {/* Results Header Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-900/90 to-emerald-950/90 border-2 border-amber-400/60 shadow-2xl text-center relative overflow-hidden backdrop-blur-md">
          {/* Subtle decorative stadium spotlight glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl mb-4 text-4xl">
            🏆
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Итоги викторины / Վիկտորինայի արդյունքներ
          </h2>

          <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-sm">
            {summary.rankTitleRu} • <span className="font-armenian">{summary.rankTitleHy}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg mx-auto">
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600/40">
              <span className="text-xs text-emerald-400 block font-medium">Правильно</span>
              <span className="text-2xl font-black text-emerald-300">{summary.correct}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600/40">
              <span className="text-xs text-rose-400 block font-medium">Ошибок</span>
              <span className="text-2xl font-black text-rose-300">{summary.total - summary.correct}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-amber-400/40">
              <span className="text-xs text-amber-400 block font-medium">Результат</span>
              <span className="text-2xl font-black text-amber-300">{summary.percentage}%</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Пройти ещё раз / Կրկնել</span>
            </button>

            <button
              type="button"
              onClick={onGoToVideoTab}
              className="px-6 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-2 border border-emerald-600/40 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Вернуться к видео</span>
            </button>
          </div>
        </div>

        {/* Detailed Breakdown of Mistaken and Correct Answers */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-emerald-200 flex items-center gap-2 px-1">
            <BookCheck className="w-5 h-5 text-amber-400" />
            <span>Разбор всех вопросов ({questions.length})</span>
          </h3>

          <div className="flex flex-col gap-3">
            {questions.map((q, idx) => {
              const userOptId = userAnswers[q.id];
              const isCorrect = evaluateAnswer(q, userOptId);
              const userOpt = q.options.find(o => o.id === userOptId);
              const correctOpt = q.options.find(o => o.id === q.correctOptionId);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500/30'
                      : 'bg-red-950/40 border-red-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        {q.typeLabelRu}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSeekToVideo(q.sourceTimestamp)}
                      className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 flex items-center gap-1 transition-colors"
                      title="Посмотреть этот момент в видео"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{formatTime(q.sourceTimestamp)}</span>
                    </button>
                  </div>

                  {/* Question Spanish & Armenian */}
                  <div className="mt-2 text-sm font-semibold text-white">
                    {q.questionEs}
                  </div>
                  <div className="text-xs font-armenian text-amber-300/90 mt-0.5">
                    {q.questionHy}
                  </div>

                  {/* Chosen answer & Correct answer */}
                  <div className="mt-3 pt-2.5 border-t border-emerald-800/60 text-xs flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Ваш ответ:</span>
                      <span className={isCorrect ? 'text-emerald-300 font-bold' : 'text-red-300 font-bold line-through'}>
                        {userOpt ? `${userOpt.textEs} (${userOpt.textHy})` : 'Нет ответа'}
                      </span>
                    </div>

                    {!isCorrect && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-400">Правильно:</span>
                        <span className="text-emerald-300 font-bold">
                          {correctOpt?.textEs} (<span className="font-armenian">{correctOpt?.textHy}</span>)
                        </span>
                      </div>
                    )}

                    <div className="mt-1 text-emerald-300/80 bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-700/40">
                      <div><strong className="text-emerald-400">Пояснение:</strong> {q.explanationEs}</div>
                      <div className="font-armenian text-amber-200/90 mt-1">{q.explanationHy}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Playing Screen
  return (
    <div className="w-full flex flex-col gap-5 max-w-3xl mx-auto">
      {/* Progress & Header */}
      <div className="p-4 rounded-2xl bg-emerald-900/50 border border-emerald-500/20 backdrop-blur-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
              Вопрос {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-xs font-medium text-emerald-300">
              {currentQ.typeLabelRu} • <span className="font-armenian">{currentQ.typeLabelHy}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSeekToVideo(currentQ.sourceTimestamp)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-800 hover:bg-emerald-700 text-emerald-200 flex items-center gap-1.5 transition-colors border border-emerald-600/40"
              title="Открыть момент в интервью"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Таймкод: {formatTime(currentQ.sourceTimestamp)}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-700/50">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 rounded-3xl bg-emerald-950/80 border-2 border-emerald-500/30 shadow-xl flex flex-col gap-5 backdrop-blur-md">
        {/* Question Header & Spanish Text */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Нажмите на испанский текст для армянского перевода</span>
            </span>

            <button
              type="button"
              onClick={() => setShowQuestionHy(!showQuestionHy)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-emerald-600/40 flex items-center gap-1.5 transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showQuestionHy ? 'Скрыть Հայերեն' : 'Показать Հայերեն'}</span>
            </button>
          </div>

          {/* Clickable Question Text - Larger font */}
          <div
            onClick={() => setShowQuestionHy(!showQuestionHy)}
            className="text-xl sm:text-2xl font-bold text-white cursor-pointer hover:text-amber-200 transition-colors p-2 -m-2 rounded-xl leading-snug"
            title="Нажмите, чтобы увидеть армянский перевод вопроса"
          >
            {currentQ.questionEs}
          </div>

          {/* Armenian Question Translation - Larger font */}
          {showQuestionHy && (
            <div className="mt-3.5 p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded text-xs font-bold font-armenian bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                Հայերեն
              </span>
              <p className="text-base sm:text-lg font-armenian font-bold text-amber-200 leading-relaxed">
                {currentQ.questionHy}
              </p>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.id === currentQ.correctOptionId;
            const isOptHyRevealed = !!revealedOptionsHy[option.id];

            let buttonStyles = 'bg-emerald-900/60 hover:bg-emerald-900 border-emerald-700/50 text-white';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                buttonStyles = 'bg-emerald-600/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-400/50';
              } else if (isSelected && !isCorrect) {
                buttonStyles = 'bg-red-800/80 border-red-400 text-red-100 font-bold';
              } else {
                buttonStyles = 'opacity-50 bg-emerald-950/40 border-emerald-800 text-slate-300';
              }
            } else if (isSelected) {
              buttonStyles = 'bg-amber-400 text-slate-950 border-amber-300 font-bold';
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col gap-2.5 ${buttonStyles}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-950/60 text-white border border-emerald-600/60 flex items-center justify-center text-xs font-bold shrink-0">
                      {option.id.toUpperCase()}
                    </span>
                    <span className="text-base sm:text-lg font-bold leading-snug">
                      {option.textEs}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Translate single option button */}
                    <button
                      type="button"
                      onClick={(e) => toggleOptionHy(e, option.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-800 text-amber-300 border border-emerald-700/50 transition-colors shrink-0"
                      title="Показать армянский перевод этого варианта"
                      aria-label="Армянский перевод варианта"
                    >
                      <Languages className="w-3.5 h-3.5 inline mr-1" />
                      <span>Հայերեն</span>
                    </button>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle className="w-6 h-6 text-emerald-300 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 text-red-300 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Option Armenian Translation - Larger font */}
                {isOptHyRevealed && (
                  <div className="pt-2.5 border-t border-emerald-800/60 flex items-start gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider shrink-0 mt-0.5">
                      Հայերեն:
                    </span>
                    <span className="text-sm sm:text-base font-armenian font-bold text-amber-200 leading-relaxed">
                      {option.textHy}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback & Explanation after selection */}
        {isAnswerSubmitted && (
          <div className="p-5 rounded-2xl bg-emerald-900/90 border border-emerald-500/40 flex flex-col gap-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {evaluateAnswer(currentQ, selectedOptionId) ? (
                  <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>Правильно! ¡Excelente! (Ճիշտ է)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-300 font-extrabold text-base sm:text-lg">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span>Неверно! (Սխալ է)</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onSeekToVideo(currentQ.sourceTimestamp)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-amber-300 flex items-center gap-1.5 transition-colors border border-emerald-600/40"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Проверить в видео</span>
              </button>
            </div>

            <div className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              <strong className="text-emerald-400">Пояснение:</strong> {currentQ.explanationEs}
            </div>

            <div className="text-sm sm:text-base font-armenian font-semibold text-amber-200 leading-relaxed pt-2.5 border-t border-emerald-800/60">
              <strong className="text-amber-400">Բացատրություն:</strong> {currentQ.explanationHy}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="mt-2 w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span>{currentIndex < questions.length - 1 ? 'Следующий вопрос / Հաջորդ հարցը' : 'Показать результаты / Արդյունքներ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
