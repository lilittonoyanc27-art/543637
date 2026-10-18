import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Volume2, VolumeX, Sparkles, Languages, Eye, EyeOff } from 'lucide-react';
import type { SubtitleItem } from './types.ts';
import { formatTime } from './quizRules.ts';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YouTubePlayerHandle {
  seekTo: (seconds: number) => void;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
}

interface Props {
  videoId: string;
  currentTime: number;
  onTimeUpdate: (seconds: number) => void;
  activeSubtitle: SubtitleItem | null;
  onSelectSubtitle?: (sub: SubtitleItem) => void;
}

export const YouTubePlayer = forwardRef<YouTubePlayerHandle, Props>(({
  videoId,
  currentTime,
  onTimeUpdate,
  activeSubtitle,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showArmenianBanner, setShowArmenianBanner] = useState<boolean>(true);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  const handleToggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      if (typeof playerRef.current.unMute === 'function') {
        playerRef.current.unMute();
      }
      setIsMuted(false);
    } else {
      if (typeof playerRef.current.mute === 'function') {
        playerRef.current.mute();
      }
      setIsMuted(true);
    }
  };

  // Expose imperative handle for seeking & sound
  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(seconds, true);
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      }
    },
    play: () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }
    },
    pause: () => {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
    },
    toggleMute: () => {
      handleToggleMute();
    }
  }));

  // Initialize YouTube Iframe API
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      const elementId = `yt-player-${videoId}`;
      const el = document.getElementById(elementId);
      if (!el) return;

      playerRef.current = new window.YT.Player(elementId, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            if (isMounted) setIsPlayerReady(true);
          },
          onStateChange: (event: any) => {
            if (!isMounted) return;
            // 1: PLAYING, 2: PAUSED, 0: ENDED
            if (event.data === 1) {
              setIsPlaying(true);
              startTracking();
            } else {
              setIsPlaying(false);
              stopTracking();
              // Capture position on pause
              if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                onTimeUpdate(playerRef.current.getCurrentTime());
              }
            }
          }
        }
      });
    };

    const startTracking = () => {
      stopTracking();
      timerRef.current = window.setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const t = playerRef.current.getCurrentTime();
          onTimeUpdate(t);
        }
      }, 250);
    };

    const stopTracking = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        if (isMounted) initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      isMounted = false;
      stopTracking();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup issues
        }
        playerRef.current = null;
      }
    };
  }, [videoId, onTimeUpdate]);

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
  };

  const handleSeekRelative = (delta: number) => {
    if (!playerRef.current) return;
    const cur = playerRef.current.getCurrentTime?.() || 0;
    const target = Math.max(0, cur + delta);
    playerRef.current.seekTo?.(target, true);
    onTimeUpdate(target);
  };

  const handleChangeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      playerRef.current.setPlaybackRate(rate);
    }
  };

  const pronounceText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Video Container with stadium style border and glow */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/40 bg-black group">
        <div id={`yt-player-${videoId}`} className="w-full h-full" />

        {/* Fallback overlay before player initializes */}
        {!isPlayerReady && (
          <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center gap-3 text-emerald-200">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Загрузка видео с Криштиану Рոնալդու...</p>
          </div>
        )}
      </div>

      {/* Floating Subtitle Banner synced to current speech */}
      {activeSubtitle && (
        <div className="w-full mt-3 p-4 rounded-xl bg-emerald-950/90 border border-emerald-400/40 shadow-lg backdrop-blur-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                activeSubtitle.speaker === 'cristiano' 
                  ? 'bg-amber-400 text-slate-900 border border-amber-300 font-bold' 
                  : 'bg-emerald-700 text-white'
              }`}>
                {activeSubtitle.speaker === 'cristiano' ? '⚽ CR7 (Ռոնալդու)' : '🎙️ Репортер (Լրագրող)'}
              </span>
              <span className="text-xs font-mono text-emerald-300/80">
                {formatTime(activeSubtitle.start)} - {formatTime(activeSubtitle.end)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => pronounceText(activeSubtitle.spanish)}
                title="Լսել արտասանությունը (Իսպաներեն)"
                className="p-1.5 text-xs rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 flex items-center gap-1 transition-colors"
                aria-label="Озвучить испанскую фразу"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Озвучить</span>
              </button>

              <button
                type="button"
                onClick={() => setShowArmenianBanner(!showArmenianBanner)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 transition-colors"
                aria-label="Переключить армянский перевод"
              >
                {showArmenianBanner ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Скрыть перевод</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Հայերեն թարգմանություն</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Spanish Subtitle text - Larger font */}
          <div 
            onClick={() => setShowArmenianBanner(!showArmenianBanner)}
            className="text-lg sm:text-2xl font-bold text-white tracking-wide cursor-pointer hover:text-emerald-300 transition-colors leading-relaxed"
            title="Нажмите, чтобы увидеть/скрыть армянский перевод"
          >
            «{activeSubtitle.spanish}»
          </div>

          {/* Armenian Translation Box - Larger font */}
          {showArmenianBanner && (
            <div className="mt-3 pt-3 border-t border-emerald-800/80">
              <div className="flex items-start gap-2.5">
                <span className="inline-block px-2.5 py-1 rounded text-xs font-armenian font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mt-0.5 shrink-0">
                  Հայերեն
                </span>
                <p className="text-base sm:text-xl text-amber-200 font-armenian font-bold leading-relaxed">
                  {activeSubtitle.armenian}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Speed & Control Bar */}
      <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/20 text-xs sm:text-sm text-emerald-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            aria-label={isPlaying ? "Пауза" : "Воспроизведение"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Пауза' : 'Смотреть'}</span>
          </button>

          {/* MUTE / UNMUTE BUTTON */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 border ${
              isMuted
                ? 'bg-rose-500 hover:bg-rose-400 text-white border-rose-400 animate-pulse'
                : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border-emerald-600/50'
            }`}
            aria-label={isMuted ? "Включить звук" : "Отключить звук"}
            title={isMuted ? "Включить звук видео" : "Отключить звук видео"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'Вкл. звук' : 'Без звука'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSeekRelative(-5)}
            className="p-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 flex items-center gap-1 transition-colors"
            title="Назад на 5 секунд"
            aria-label="Назад 5 сек"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[11px] font-mono">-5s</span>
          </button>

          <button
            type="button"
            onClick={() => handleSeekRelative(5)}
            className="p-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 flex items-center gap-1 transition-colors"
            title="Вперед на 5 секунд"
            aria-label="Вперед 5 сек"
          >
            <FastForward className="w-4 h-4" />
            <span className="text-[11px] font-mono">+5s</span>
          </button>

          <span className="ml-2 font-mono text-xs text-emerald-300">
            {formatTime(currentTime)} / 1:56
          </span>
        </div>

        {/* Speed Controls for Language Learners */}
        <div className="flex items-center gap-1 bg-emerald-950/60 p-1 rounded-lg border border-emerald-700/50">
          <span className="text-[11px] text-emerald-400 px-1 font-medium">Скорость:</span>
          {[0.75, 1, 1.25].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleChangeRate(rate)}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                playbackRate === rate
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-emerald-200 hover:bg-emerald-800/50'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

YouTubePlayer.displayName = 'YouTubePlayer';
