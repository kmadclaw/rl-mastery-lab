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
