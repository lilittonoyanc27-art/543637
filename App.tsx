import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  BookOpen, 
  Trophy, 
  HelpCircle, 
  Sparkles, 
  Languages, 
  ExternalLink, 
  Tv, 
  Flame,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { YouTubePlayer, YouTubePlayerHandle } from './YouTubePlayer.tsx';
import { SubtitlesView } from './SubtitlesView.tsx';
import { VocabView } from './VocabView.tsx';
import { QuizView } from './QuizView.tsx';
import { SUBTITLES_DATA } from './subtitlesData.ts';
import { VOCAB_DATA } from './vocabData.ts';
import { QUIZ_QUESTIONS } from './quizData.ts';
import { findCurrentSubtitle } from './quizRules.ts';
import type { SubtitleItem } from './types.ts';

const YOUTUBE_VIDEO_ID = '6SR7tu8xl2c';

export default function App() {
  const [activeTab, setActiveTab] = useState<'video' | 'vocab' | 'quiz' | 'about'>('video');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeSubtitle, setActiveSubtitle] = useState<SubtitleItem | null>(null);

  const playerRef = useRef<YouTubePlayerHandle>(null);

  // Sync active subtitle whenever currentTime updates
  useEffect(() => {
    const sub = findCurrentSubtitle(SUBTITLES_DATA, currentTime);
    setActiveSubtitle(sub);
  }, [currentTime]);

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    playerRef.current?.seekTo(seconds);
  };

  const handleSeekAndSwitchToVideo = (seconds: number) => {
    setActiveTab('video');
    setTimeout(() => {
      handleSeek(seconds);
    }, 150);
  };

  return (
    <div className="min-h-screen football-pitch-bg text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header / Stadium Banner */}
      <header className="sticky top-0 z-50 bg-emerald-950/90 border-b border-emerald-500/30 backdrop-blur-md shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Match Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-400/20 border border-yellow-200">
              7
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-1.5">
                  <span>CR7: Español & Fútbol</span>
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-armenian bg-amber-400 text-slate-950 shadow-sm">
                  Հայերեն թարգմանություն
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 font-medium">
                Испанский по видео с Роналду • <span className="font-armenian">Իսպաներեն ուսուցում</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-emerald-900/70 p-1.5 rounded-2xl border border-emerald-700/50">
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'video'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Видео & Субтитры</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vocab')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'vocab'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Словарь (11+)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'quiz'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Викторина (12)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'about'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">О видео</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Tab 1: Video and Interactive Subtitles */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: YouTube Player & Controls */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="p-4 sm:p-5 rounded-3xl bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h2 className="text-sm sm:text-base font-bold text-white">
                      Эксклюзивное интервью: Криштиану Роналду
                    </h2>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <YouTubePlayer
                  ref={playerRef}
                  videoId={YOUTUBE_VIDEO_ID}
                  currentTime={currentTime}
                  onTimeUpdate={setCurrentTime}
                  activeSubtitle={activeSubtitle}
                />
              </div>

              {/* Quick Learning Guide Card */}
              <div className="p-4 rounded-2xl bg-emerald-900/50 border border-emerald-500/20 backdrop-blur-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <div className="font-bold text-white">Готовы проверить знания?</div>
                    <div className="text-emerald-300/80">
                      После просмотра пройдите футбольную викторину из 12 заданий.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shrink-0 shadow transition-all active:scale-95"
                >
                  В викторину →
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Subtitles List */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Languages className="w-4 h-4 text-amber-400" />
                  <span>Субтитры и перевод (Հայերեն)</span>
                </h3>
                <span className="text-xs text-emerald-300 font-mono">
                  33 реплики
                </span>
              </div>

              <SubtitlesView
                subtitles={SUBTITLES_DATA}
                currentTime={currentTime}
                activeSubtitle={activeSubtitle}
                onSeek={handleSeek}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Vocabulary */}
        {activeTab === 'vocab' && (
          <div className="flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <span>⚽ Футбольный словарь интервью</span>
                  </h2>
                  <p className="text-sm text-emerald-300/80 mt-1">
                    Ключевые футбольные фразы Криштиану с испанским значением, переводом на армянский и озвучкой.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className="px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border border-emerald-600/40"
                >
                  <Tv className="w-4 h-4" />
                  <span>Смотреть в видео</span>
                </button>
              </div>
            </div>

            <VocabView
              vocabList={VOCAB_DATA}
              onSeekToVideo={handleSeekAndSwitchToVideo}
            />
          </div>
        )}

        {/* Tab 3: Interactive Quiz */}
        {activeTab === 'quiz' && (
          <div className="flex flex-col gap-4">
            <QuizView
              questions={QUIZ_QUESTIONS}
              onSeekToVideo={handleSeekAndSwitchToVideo}
              onGoToVideoTab={() => setActiveTab('video')}
            />
          </div>
        )}

        {/* Tab 4: About & Cultural Context */}
        {activeTab === 'about' && (
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md shadow-xl flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
                  ⚽
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    О видео и контексте интервью
                  </h2>
                  <p className="text-xs text-emerald-300 font-medium">
                    Cristiano Ronaldo: 23 años de profesión y victoria de Portugal
                  </p>
                </div>
              </div>

              <div className="prose prose-invert text-sm leading-relaxed text-emerald-100/90 flex flex-col gap-3">
                <p>
                  В этом видео Криштиану Роналду отвечает на вопросы журналиста после победного матча сборной Португалии, где команда забила <strong>5 голов</strong> и обеспечила себе выход из группы.
                </p>

                <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/50">
                  <h4 className="text-sm font-bold text-amber-300 mb-2">
                    🇦🇲 Իսպաներենի ուսուցման նպատակները (Цели изучения):
                  </h4>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-emerald-200 space-y-1.5 font-armenian">
                    <li>Իմացեք ֆուտբոլային հատուկ եզրույթներ (el duelo, el partidazo, pasar en el grupo, marcar goles):</li>
                    <li>Հասկացեք հարցազրույցի կենդանի իսպաներենը և արտահայտությունները (la vida es así, no pasa nada, estar preparado):</li>
                    <li>Յուրաքանչյուր իսպաներեն նախադասության համար կա մանրակրկիտ հայերեն թարգմանություն:</li>
                  </ul>
                </div>

                <h4 className="text-base font-bold text-white mt-2">
                  Ключевые темы интервью:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                    <span className="font-bold text-amber-300 block mb-1">Роналду против Месси:</span>
                    Журналист спрашивает о потенциальной встрече звезд, но Роналду подчеркивает, что главное сейчас — победа команды сегодня.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                    <span className="font-bold text-amber-300 block mb-1">Тактика и 5 голов:</span>
                    Португалия играла с высокой линией («líneas arriba»), была грамотно расставлена и победила убедительно.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                    <span className="font-bold text-amber-300 block mb-1">След. матч: Колумбия:</span>
                    Криштиану отмечает: «Sabemos que vamos a tener un partido duro contra Colombia».
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                    <span className="font-bold text-amber-300 block mb-1">23 года в профессии:</span>
                    Мудрый ответ на критику прессы: «cuando va bien Cristiano bien, cuando va mal es un retirado, ya está viejo».
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow transition-all active:scale-95"
                >
                  Смотреть интервью с субтитрами →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Football Pitch Footer */}
      <footer className="mt-8 border-t border-emerald-800/80 bg-emerald-950/95 py-5 text-center text-xs text-emerald-400/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>⚽ Интерактивный курс испанского языка</span>
            <span>•</span>
            <span className="font-armenian">Իսպաներեն լեզվի ուսուցում հայերեն թարգմանությամբ</span>
          </div>

          <div className="flex items-center gap-3 text-emerald-300">
            <span>YouTube: 6SR7tu8xl2c</span>
            <span>•</span>
            <span>CR7 Interview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
