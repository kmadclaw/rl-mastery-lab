import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../src/data/chapters.json', import.meta.url), 'utf8'));
const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');

test('covers the full Sutton RL chapter arc with learning-style fields', () => {
  assert.equal(data.length, 17);
  for (const chapter of data) {
    assert.ok(chapter.title);
    assert.ok(chapter.masteryQuestion);
    assert.ok(chapter.vocabulary.length >= 6, `${chapter.title} needs vocabulary`);
    assert.ok(chapter.exercises.length >= 4, `${chapter.title} needs exercises`);
    for (const vocab of chapter.vocabulary) {
      assert.ok(vocab.term && vocab.definition && vocab.intuition && vocab.useCase);
    }
  }
});

test('app implements Krish learning progression and core interactions', () => {
  for (const phrase of ['Vocabulary', 'Definition', 'Intuition', 'Connections', 'Analogy', 'Practice Lab', 'Mastery Map']) {
    assert.match(app, new RegExp(phrase));
  }
  for (const token of ['selectedChapter', 'activeMode', 'practicePrompt', 'masteryQuestion']) {
    assert.match(app, new RegExp(token));
  }
});

test('mobile UX exposes a guided study bar and sequential learning actions', () => {
  for (const token of ['mobileStudyBar', 'mobileChapterSelect', 'mobileModes', 'studyActions', 'advanceLearning', 'retreatLearning']) {
    assert.match(app, new RegExp(token));
  }
});

test('chapter 1 has non-repetitive section-specific learning content', () => {
  const chapter = data.find(item => item.number === 1);
  assert.equal(chapter.tagline, 'Master the core RL loop before formulas: who acts, what changes, what feedback means, and why long-term return matters.');
  assert.ok(chapter.vocabulary.length >= 14);
  for (const vocab of chapter.vocabulary) {
    assert.ok(vocab.memoryHook, `${vocab.term} needs a vocabulary memory hook`);
    assert.ok(vocab.intuition.length > 90, `${vocab.term} needs richer intuition`);
    assert.ok(vocab.tradingExample, `${vocab.term} needs a trading example`);
    assert.ok(vocab.agentExample, `${vocab.term} needs an agentic AI example`);
    assert.doesNotMatch(vocab.intuition, /^Ask: when/i);
    assert.doesNotMatch(vocab.useCase, /^Map .* to a concrete loop/i);
  }
  assert.ok(chapter.connections.some(item => item.includes('Reward is not the same as Return')));
  assert.ok(chapter.analogies.some(item => item.includes('Fitness')));
  assert.match(app, /memoryHook/);
  assert.match(app, /tradingExample/);
  assert.match(app, /agentExample/);
});
