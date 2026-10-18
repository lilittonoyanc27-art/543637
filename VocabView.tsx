import React, { useState } from 'react';
import { 
  Volume2, 
  Play, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Gamepad2, 
  BookOpen, 
  RotateCcw,
  Trophy
} from 'lucide-react';
import type { VocabItem } from './types.ts';
import { formatTime } from './quizRules.ts';

interface Props {
  vocabList: VocabItem[];
  onSeekToVideo: (timestamp: number) => void;
}

export const VocabView: React.FC<Props> = ({ vocabList, onSeekToVideo }) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'game'>('cards');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Matching game state
  const [selectedSpanish, setSelectedSpanish] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongAttempt, setWrongAttempt] = useState<boolean>(false);
  const [gameScore, setGameScore] = useState<number>(0);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRevealAll = () => {
    const all: Record<string, boolean> = {};
    vocabList.forEach(item => {
      all[item.id] = true;
    });
    setRevealedIds(all);
  };

  const handleHideAll = () => {
    setRevealedIds({});
  };

  const handlePronounce = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Matching game logic
  const handleSelectSpanishGame = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedSpanish(id);
    setWrongAttempt(false);
  };

  const handleSelectArmenianGame = (id: string) => {
    if (!selectedSpanish || matchedIds.includes(id)) return;
    if (selectedSpanish === id) {
      // Match found!
      setMatchedIds(prev => [...prev, id]);
      setSelectedSpanish(null);
      setGameScore(prev => prev + 1);
    } else {
      // Wrong match
      setWrongAttempt(true);
      setTimeout(() => {
        setWrongAttempt(false);
        setSelectedSpanish(null);
      }, 700);
    }
  };

  const handleResetGame = () => {
    setMatchedIds([]);
    setSelectedSpanish(null);
    setWrongAttempt(false);
    setGameScore(0);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* View Switcher: Vocabulary Cards vs Match Game */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-900/50 border border-emerald-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'cards'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Словарь и фразы ({vocabList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'game'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Мини-игра: Пары</span>
          </button>
        </div>

        {activeTab === 'cards' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRevealAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Показать армянский</span>
            </button>
            <button
              type="button"
              onClick={handleHideAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-800/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-600/30 flex items-center gap-1 transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Скрыть перевод</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Cards list */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vocabList.map((item) => {
            const isRevealed = !!revealedIds[item.id];

            return (
              <div
                key={item.id}
                onClick={() => toggleReveal(item.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isRevealed
                    ? 'bg-emerald-900/80 border-amber-400/70 shadow-lg'
                    : 'bg-emerald-950/70 border-emerald-600/30 hover:border-emerald-400/60 hover:bg-emerald-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-300 border border-emerald-600/40">
                      {item.category === 'football' ? '⚽ Футбол' : item.category === 'interview' ? '🎙️ Интервью' : '💬 Выражение'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handlePronounce(e, item.spanish)}
                        className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
                        title="Озвучить"
                        aria-label={`Озвучить ${item.spanish}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeekToVideo(item.timestamp);
                        }}
                        className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 flex items-center gap-1 transition-colors border border-emerald-600/40"
                        title="Послушать в видео"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{formatTime(item.timestamp)}</span>
                      </button>
                    </div>
                  </div>

                  {/* Spanish Word Heading - Larger font */}
                  <h3 className="text-2xl font-black text-white tracking-wide">
                    {item.spanish}
                  </h3>

                  {/* Spanish meaning definition - Larger font */}
                  <p className="text-sm text-emerald-200/90 mt-2 leading-relaxed">
                    <span className="font-bold text-emerald-400">Значение:</span> {item.meaningEs}
                  </p>
                </div>

                {/* Armenian Translation Box - Larger font */}
                <div className="mt-4 pt-3.5 border-t border-emerald-800/80">
                  {isRevealed ? (
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 px-2 py-0.5 rounded text-xs font-armenian font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mt-0.5">
                        Հայերեն
                      </span>
                      <div className="flex flex-col gap-1">
                        <div className="text-xl font-armenian font-bold text-amber-300">
                          {item.armenian}
                        </div>
                        <div className="text-sm text-emerald-200/90 mt-1">
                          Пример: <em className="text-emerald-100 font-medium">«{item.exampleEs}»</em>
                        </div>
                        <div className="text-sm font-armenian font-medium text-amber-200 mt-0.5">
                          {item.exampleHy}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-sm text-amber-400 font-semibold py-1">
                      <span>Нажмите для армянского перевода (Հայերեն)</span>
                      <Eye className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Matching Mini-Game */}
      {activeTab === 'game' && (
        <div className="p-6 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Соедини пары: Испанский ⚽ Армянский</span>
              </h3>
              <p className="text-xs text-emerald-300 mt-0.5">
                Кликните сначала на испанское слово, затем на соответствующий армянский перевод!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold">
                Счёт: {matchedIds.length} / {vocabList.length}
              </span>
              <button
                type="button"
                onClick={handleResetGame}
                className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 transition-colors"
                title="Начать заново"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {matchedIds.length === vocabList.length ? (
            <div className="p-8 text-center rounded-2xl bg-emerald-900/80 border border-amber-400/60 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-3xl font-extrabold shadow-lg">
                🏆
              </div>
              <h4 className="text-2xl font-bold text-amber-300">
                ¡Golazo! Հիանալի է:
              </h4>
              <p className="text-sm text-emerald-200 max-w-md">
                Вы успешно соединили все футбольные выражения из интервью Криштиану Роналду!
              </p>
              <button
                type="button"
                onClick={handleResetGame}
                className="mt-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow"
              >
                Сыграть ещё раз / Խաղալ կրկին
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1: Spanish terms */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-1">
                  Испанский (Español)
                </span>
                {vocabList.map((item) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isSelected = selectedSpanish === item.id;

                  return (
                    <button
                      key={`es-${item.id}`}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleSelectSpanishGame(item.id)}
                      className={`p-3.5 rounded-xl text-left font-bold text-sm transition-all border ${
                        isMatched
                          ? 'opacity-40 bg-emerald-950/40 border-emerald-800 line-through text-emerald-500 cursor-default'
                          : isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                          : 'bg-emerald-900/60 hover:bg-emerald-900 border-emerald-700/50 text-white'
                      }`}
                    >
                      ⚽ {item.spanish}
                    </button>
                  );
                })}
              </div>

              {/* Column 2: Armenian translations (scrambled order for game) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider px-1">
                  Армянский (Հայերեն)
                </span>
                {[...vocabList]
                  .sort((a, b) => a.armenian.localeCompare(b.armenian))
                  .map((item) => {
                    const isMatched = matchedIds.includes(item.id);

                    return (
                      <button
                        key={`hy-${item.id}`}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleSelectArmenianGame(item.id)}
                        className={`p-3.5 rounded-xl text-left font-armenian font-semibold text-sm transition-all border ${
                          isMatched
                            ? 'opacity-40 bg-emerald-950/40 border-emerald-800 line-through text-emerald-500 cursor-default'
                            : wrongAttempt && selectedSpanish
                            ? 'bg-red-950/40 border-red-500/50 text-red-200'
                            : 'bg-emerald-900/60 hover:bg-amber-400/20 hover:border-amber-400/60 border-emerald-700/50 text-amber-200'
                        }`}
                      >
                        🇦🇲 {item.armenian}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
