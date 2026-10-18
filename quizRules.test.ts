import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTime, findCurrentSubtitle, evaluateAnswer, calculateScoreSummary, getRankTitle } from './quizRules.ts';
import type { QuizQuestion, SubtitleItem } from './types.ts';

test('formatTime formats seconds into mm:ss properly', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(7), '0:07');
  assert.equal(formatTime(35), '0:35');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(111), '1:51');
  assert.equal(formatTime(-5), '0:00');
});

test('findCurrentSubtitle identifies the active subtitle', () => {
  const sampleSubs: SubtitleItem[] = [
    {
      id: 1,
      speaker: 'journalist',
      speakerNameEs: 'Periodista',
      speakerNameHy: 'Լրագրող',
      speakerNameRu: 'Журналист',
      start: 0,
      end: 7,
      spanish: 'Bueno, a todo el mundo le encantaría...',
      armenian: 'Դե, ողջ աշխարհը կցանկանար...',
    },
    {
      id: 2,
      speaker: 'cristiano',
      speakerNameEs: 'Cristiano Ronaldo',
      speakerNameHy: 'Կրիշտիանու Ռոնալդու',
      speakerNameRu: 'Криштиану Роналду',
      start: 7,
      end: 11,
      spanish: 'para cerrar la carrera...',
      armenian: 'որպեսզի փակվի կարիերան...',
    }
  ];

  assert.equal(findCurrentSubtitle(sampleSubs, 3)?.id, 1);
  assert.equal(findCurrentSubtitle(sampleSubs, 8.5)?.id, 2);
  assert.equal(findCurrentSubtitle(sampleSubs, 50), null);
});

test('evaluateAnswer checks option correctness', () => {
  const sampleQuestion: QuizQuestion = {
    id: 1,
    type: 'multiple_choice',
    typeLabelEs: 'Opción múltiple',
    typeLabelRu: 'Выбор ответа',
    typeLabelHy: 'Բազմակի ընտրություն',
    questionEs: '¿Con quién compara el periodista a Cristiano Ronaldo?',
    questionHy: 'Ո՞ւմ հետ է լրագրողը համեմատում Ռոնալդուին:',
    options: [
      { id: 'a', textEs: 'Kylian Mbappé', textHy: 'Կիլիան Մբապպե' },
      { id: 'b', textEs: 'Lionel Messi', textHy: 'Լիոնել Մեսսի' },
      { id: 'c', textEs: 'Neymar Jr', textHy: 'Նեյմար' }
    ],
    correctOptionId: 'b',
    explanationEs: 'El periodista menciona un duelo Cristiano vs Lionel Messi.',
    explanationHy: 'Լրագրողը նշում է Կրիշտիանուի և Լիոնել Մեսսիի մենամարտը:',
    sourceTimestamp: 0
  };

  assert.equal(evaluateAnswer(sampleQuestion, 'b'), true);
  assert.equal(evaluateAnswer(sampleQuestion, 'a'), false);
  assert.equal(evaluateAnswer(sampleQuestion, 'c'), false);
  assert.equal(evaluateAnswer(sampleQuestion, ''), false);
});

test('calculateScoreSummary returns correct statistics and ranks', () => {
  const perfect = calculateScoreSummary(10, 10);
  assert.equal(perfect.percentage, 100);
  assert.equal(perfect.passed, true);
  assert.match(perfect.rankTitleEs, /Balón de Oro/);

  const good = calculateScoreSummary(8, 10);
  assert.equal(good.percentage, 80);
  assert.equal(good.passed, true);

  const fail = calculateScoreSummary(3, 10);
  assert.equal(fail.percentage, 30);
  assert.equal(fail.passed, false);
});
