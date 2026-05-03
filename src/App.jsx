import React, { useMemo, useState } from 'react';
import { BookOpen, Brain, GitBranch, Layers3, Lightbulb, Target, Workflow, Zap } from 'lucide-react';
import chapters from './data/chapters.json';

const modes = [
  { id: 'Vocabulary', icon: BookOpen, note: 'Get familiar with the words before definitions.' },
  { id: 'Definition', icon: Target, note: 'Compress every term into one clear sentence.' },
  { id: 'Intuition', icon: Brain, note: 'Feel what the term does inside a decision loop.' },
  { id: 'Connections', icon: GitBranch, note: 'Link vocabulary into reusable concepts.' },
  { id: 'Analogy', icon: Lightbulb, note: 'Map concepts to trading, products, habits, and agents.' },
  { id: 'Practice Lab', icon: Zap, note: 'Use active recall, mini-prompts, and mastery checks.' }
];

function App() {
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]);
  const [activeMode, setActiveMode] = useState('Vocabulary');
  const [query, setQuery] = useState('');
  const [practicePrompt, setPracticePrompt] = useState(selectedChapter.exercises[0]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return chapters.filter(chapter =>
      chapter.title.toLowerCase().includes(q) ||
      chapter.vocabulary.some(v => v.term.toLowerCase().includes(q))
    );
  }, [query]);

  function chooseChapter(chapter) {
    setSelectedChapter(chapter);
    setPracticePrompt(chapter.exercises[0]);
  }

  function randomPrompt() {
    const pool = selectedChapter.exercises;
    setPracticePrompt(pool[Math.floor(Math.random() * pool.length)]);
  }

  const masteryQuestion = selectedChapter.masteryQuestion;

  return (
    <main>
      <header className="nav"><div className="logo"><span>π</span> RL Mastery Lab</div><a href="#lab">Practice now</a></header>
      <section className="hero">
        <div className="eyebrow"><Workflow size={14}/> Sutton & Barto, all chapters • Krish learning style</div>
        <h1>Vocabulary-first RL learning exercises, from Chapter 1 to frontiers.</h1>
        <p>Move through the exact progression you prefer: <b>Vocabulary</b> → <b>Definition</b> → <b>Intuition</b> → <b>Connections</b> → <b>Analogy</b> → practical use-case drills.</p>
        <div className="heroGrid">
          {['17 chapters','140+ vocabulary hooks','85+ practice prompts','Trading • Product • Habits • Agents'].map(item => <div className="metric" key={item}>{item}</div>)}
        </div>
      </section>

      <section className="pipeline" aria-label="Learning progression">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return <button className={activeMode === mode.id ? 'step active' : 'step'} onClick={() => setActiveMode(mode.id)} key={mode.id}>
            <span className="stepNum">0{index + 1}</span><Icon size={18}/><strong>{mode.id}</strong><small>{mode.note}</small>
          </button>
        })}
      </section>

      <section id="lab" className="appShell">
        <aside className="chapters">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search chapter or vocabulary…" />
          <div className="chapterList">
            {filtered.map(chapter => <button key={chapter.number} onClick={() => chooseChapter(chapter)} className={selectedChapter.number === chapter.number ? 'chapter active' : 'chapter'}>
              <span>CH {chapter.number}</span><strong>{chapter.title}</strong><small>{chapter.vocabulary.slice(0,3).map(v => v.term).join(' • ')}</small>
            </button>)}
          </div>
        </aside>

        <section className="workspace">
          <div className="chapterHero"><div><span className="pill">Chapter {selectedChapter.number}</span><h2>{selectedChapter.title}</h2><p>{selectedChapter.tagline}</p></div><Layers3 size={48}/></div>

          <div className="panel">
            <div className="panelTitle"><span>{activeMode}</span><small>{selectedChapter.vocabulary.length} vocabulary items</small></div>
            {activeMode === 'Vocabulary' && <div className="cards">{selectedChapter.vocabulary.map(v => <article className="vocab" key={v.term}><h3>{v.term}</h3><p>{v.definition}</p></article>)}</div>}
            {activeMode === 'Definition' && <div className="stack">{selectedChapter.vocabulary.map(v => <div className="line" key={v.term}><b>{v.term}</b><span>{v.definition}</span></div>)}</div>}
            {activeMode === 'Intuition' && <div className="cards">{selectedChapter.vocabulary.map(v => <article className="vocab" key={v.term}><h3>{v.term}</h3><p>{v.intuition}</p></article>)}</div>}
            {activeMode === 'Connections' && <div className="stack">{selectedChapter.connections.map(c => <div className="connection" key={c}>{c}</div>)}<div className="mastery"><b>Mastery Map</b><p>{masteryQuestion}</p></div></div>}
            {activeMode === 'Analogy' && <div className="cards">{selectedChapter.analogies.map(a => <article className="vocab analogy" key={a}><h3>Use-case analogy</h3><p>{a}</p></article>)}</div>}
            {activeMode === 'Practice Lab' && <div className="practice"><span className="pill">{practicePrompt.type}</span><h3>{practicePrompt.prompt}</h3><button onClick={randomPrompt}>Give me another drill</button><textarea placeholder="Write your answer here. Force recall before checking notes." /></div>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
