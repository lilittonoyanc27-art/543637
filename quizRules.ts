import type { QuizQuestion, ScoreSummary, SubtitleItem } from './types.ts';

/**
 * Format seconds into mm:ss display
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Find the subtitle active at the current playback time
 */
export function findCurrentSubtitle(
  subtitles: SubtitleItem[],
  currentTime: number
): SubtitleItem | null {
  if (!subtitles || subtitles.length === 0) return null;
  
  // Find item where start <= currentTime < end
  const found = subtitles.find(
    sub => currentTime >= sub.start && currentTime < sub.end
  );
  if (found) return found;

  // Fallback tolerance of 0.8s after previous segment
  const nearPast = subtitles.find(
    sub => currentTime >= sub.start && currentTime <= sub.end + 0.8
  );
  return nearPast || null;
}

/**
 * Check if the chosen option ID matches the correct one
 */
export function evaluateAnswer(question: QuizQuestion, selectedOptionId: string): boolean {
  if (!question || !selectedOptionId) return false;
  return question.correctOptionId === selectedOptionId;
}

/**
 * Determine performance rank based on percentage score
 */
export function getRankTitle(percentage: number): { es: string; hy: string; ru: string } {
  if (percentage >= 90) {
    return {
      es: '¡Balón de Oro! (Rendimiento estelar)',
      hy: '«Ոսկե գնդակ» (Բացառիկ արդյունք)',
      ru: '«Золотой мяч» (Превосходный результат)'
    };
  }
  if (percentage >= 70) {
    return {
      es: '¡Titular Indiscutible! (Gran nivel)',
      hy: 'Հիմնական կազմի խաղացող (Հիանալի մակարդակ)',
      ru: 'Игрок основы (Отличный уровень)'
    };
  }
  if (percentage >= 50) {
    return {
      es: 'Joven Promesa (Buen intento)',
      hy: 'Հեռանկարային տաղանդ (Լավ փորձ)',
      ru: 'Перспективный талант (Хорошая попытка)'
    };
  }
  return {
    es: 'En Entrenamiento (Sigue practicando)',
    hy: 'Մարզումների փուլում (Շարունակիր սովորել)',
    ru: 'На тренировке (Нужна ещё практика)'
  };
}

/**
 * Calculate full summary for quiz completion
 */
export function calculateScoreSummary(correctCount: number, totalQuestions: number): ScoreSummary {
  const safeTotal = totalQuestions > 0 ? totalQuestions : 1;
  const safeCorrect = Math.max(0, Math.min(correctCount, safeTotal));
  const percentage = Math.round((safeCorrect / safeTotal) * 100);
  const passed = percentage >= 60;
  const rank = getRankTitle(percentage);

  return {
    total: safeTotal,
    correct: safeCorrect,
    percentage,
    passed,
    rankTitleEs: rank.es,
    rankTitleHy: rank.hy,
    rankTitleRu: rank.ru,
  };
}
