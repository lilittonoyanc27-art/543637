import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Volume2, 
  Languages, 
  Search, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import type { SubtitleItem } from './types.ts';
import { formatTime } from './quizRules.ts';

interface Props {
  subtitles: SubtitleItem[];
  currentTime: number;
  activeSubtitle: SubtitleItem | null;
  onSeek: (seconds: number) => void;
}

export const SubtitlesView: React.FC<Props> = ({
  subtitles,
  currentTime,
  activeSubtitle,
  onSeek,
}) => {
  // Store which subtitle IDs have Armenian translation revealed
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSpeaker, setFilterSpeaker] = useState<'all' | 'cristiano' | 'journalist'>('all');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const activeItemRef = useRef<HTMLDivElement | null>(null);

  // Toggle individual subtitle translation
  const toggleTranslation = (id: number) => {
    setRevealedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Show all or hide all
  const handleShowAllTranslations = () => {
    const allRevealed: Record<number, boolean> = {};
    subtitles.forEach(s => {
      allRevealed[s.id] = true;
    });
    setRevealedIds(allRevealed);
  };

  const handleHideAllTranslations = () => {
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

  // Filter subtitles based on search and speaker
  const filteredSubtitles = subtitles.filter(item => {
    const matchesSpeaker = 
      filterSpeaker === 'all' || 
      (filterSpeaker === 'cristiano' && item.speaker === 'cristiano') ||
      (filterSpeaker === 'journalist' && item.speaker === 'journalist');

    if (!matchesSpeaker) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.spanish.toLowerCase().includes(q) ||
      item.armenian.toLowerCase().includes(q) ||
      (item.russian && item.russian.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Toolbar: Search, Filters, Bulk Reveal */}
      <div className="p-4 rounded-2xl bg-emerald-900/50 border border-emerald-500/20 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по фразам (español / հայերեն)..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-100 placeholder-emerald-500/60 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Speaker filter buttons */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-emerald-950/60 p-1 rounded-xl border border-emerald-700/40">
          <button
            type="button"
            onClick={() => setFilterSpeaker('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              filterSpeaker === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-emerald-300 hover:bg-emerald-800/40'
            }`}
          >
            Все (33)
          </button>
          <button
            type="button"
            onClick={() => setFilterSpeaker('cristiano')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors ${
              filterSpeaker === 'cristiano'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-emerald-300 hover:bg-emerald-800/40'
            }`}
          >
            <span>⚽ CR7</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterSpeaker('journalist')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors ${
              filterSpeaker === 'journalist'
                ? 'bg-emerald-400 text-slate-950 font-bold'
                : 'text-emerald-300 hover:bg-emerald-800/40'
            }`}
          >
            <span>🎙️ Репортер</span>
          </button>
        </div>

        {/* Font size selector & Global translation toggle buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font Size buttons */}
          <div className="flex items-center gap-1 bg-emerald-950/60 p-1 rounded-xl border border-emerald-700/40">
            <span className="text-[11px] text-emerald-400 font-medium px-1">Шрифт:</span>
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 text-xs rounded-lg font-bold transition-colors ${
                fontSize === 'normal'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-emerald-300 hover:bg-emerald-800/40'
              }`}
              title="Стандартный шрифт"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 text-xs rounded-lg font-bold transition-colors ${
                fontSize === 'large'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-emerald-300 hover:bg-emerald-800/40'
              }`}
              title="Крупный шрифт (по умолчанию)"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 text-xs rounded-lg font-bold transition-colors ${
                fontSize === 'xlarge'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-emerald-300 hover:bg-emerald-800/40'
              }`}
              title="Очень крупный шрифт"
            >
              A++
            </button>
          </div>

          <button
            type="button"
            onClick={handleShowAllTranslations}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 transition-colors"
            title="Открыть перевод для всех реплик"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Открыть все</span>
          </button>
          <button
            type="button"
            onClick={handleHideAllTranslations}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-800/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-600/30 flex items-center gap-1.5 transition-colors"
            title="Скрыть все переводы для тренировки"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Скрыть все</span>
          </button>
        </div>
      </div>

      {/* Helpful Hint banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-600/20 text-xs text-emerald-300/90">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Подсказка:</strong> Нажмите на любую испанскую реплику, чтобы увидеть перевод на армянский (Հայերեն) или на таймкод, чтобы включить этот момент в видео.
        </span>
      </div>

      {/* Subtitle Items List */}
      <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1">
        {filteredSubtitles.map((sub) => {
          const isActive = activeSubtitle?.id === sub.id;
          const isRevealed = !!revealedIds[sub.id];

          return (
            <div
              key={sub.id}
              ref={isActive ? activeItemRef : null}
              onClick={() => toggleTranslation(sub.id)}
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 select-none ${
                isActive
                  ? 'bg-emerald-900/90 border-amber-400 shadow-lg shadow-amber-400/10 ring-1 ring-amber-400/50'
                  : 'bg-emerald-950/70 border-emerald-600/30 hover:border-emerald-400/60 hover:bg-emerald-900/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {/* Timestamp seek button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(sub.start);
                    }}
                    className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-800/80 hover:bg-emerald-600 text-emerald-200 flex items-center gap-1 transition-colors border border-emerald-600/40"
                    title="Перейти к этому моменту в видео"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{formatTime(sub.start)}</span>
                  </button>

                  {/* Speaker badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      sub.speaker === 'cristiano'
                        ? 'bg-amber-400/90 text-slate-950'
                        : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {sub.speaker === 'cristiano' ? '⚽ CR7 (Ռոնալդու)' : '🎙️ Репортер (Լրագրող)'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Audio Pronunciation */}
                  <button
                    type="button"
                    onClick={(e) => handlePronounce(e, sub.spanish)}
                    className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/70 transition-colors"
                    title="Լսել իսպաներեն արտասանությունը"
                    aria-label={`Озвучить ${sub.spanish}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Toggle Armenian button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTranslation(sub.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      isRevealed
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-emerald-800/70 text-emerald-200 hover:bg-emerald-700'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{isRevealed ? 'Перевод ✓' : 'Հայերեն'}</span>
                  </button>
                </div>
              </div>

              {/* Spanish Text with dynamic enlarged font */}
              <div className={`${
                fontSize === 'xlarge'
                  ? 'text-xl sm:text-2xl font-bold'
                  : fontSize === 'large'
                  ? 'text-lg sm:text-xl font-bold'
                  : 'text-base sm:text-lg font-semibold'
              } text-slate-100 group leading-snug`}>
                <span className={isActive ? 'text-amber-200 font-extrabold' : 'text-slate-100'}>
                  {sub.spanish}
                </span>
              </div>

              {/* Armenian Translation Block (collapsible/expandable on click) */}
              {isRevealed && (
                <div className="mt-3 pt-3 border-t border-emerald-800/80 bg-emerald-950/60 -mx-4 -mb-4 p-4 rounded-b-xl animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <span className="shrink-0 px-2.5 py-0.5 rounded text-xs font-bold font-armenian bg-amber-500/20 text-amber-300 border border-amber-400/40 mt-0.5">
                      Հայերեն
                    </span>
                    <p className={`${
                      fontSize === 'xlarge'
                        ? 'text-lg sm:text-xl font-bold'
                        : fontSize === 'large'
                        ? 'text-base sm:text-lg font-bold'
                        : 'text-sm sm:text-base font-semibold'
                    } font-armenian text-amber-200 leading-relaxed`}>
                      {sub.armenian}
                    </p>
                  </div>

                  {/* Vocabulary breakdown pills */}
                  {sub.keywords && sub.keywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sub.keywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-sm bg-emerald-900/90 text-emerald-100 border border-emerald-700/60 shadow-xs"
                        >
                          <span className="font-bold text-emerald-300">{kw.es}</span>
                          <span className="text-emerald-500 font-bold">→</span>
                          <span className="font-armenian font-semibold text-amber-300">{kw.hy}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredSubtitles.length === 0 && (
          <div className="p-8 text-center text-emerald-300/70 bg-emerald-950/40 rounded-2xl border border-emerald-700/30">
            Ничего не найдено по вашему запросу.
          </div>
        )}
      </div>
    </div>
  );
};
