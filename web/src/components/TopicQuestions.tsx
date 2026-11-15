import { useMemo, useState } from 'react';
import { questionsForTopic } from '../data/questions';
import { QuestionCard } from './QuestionCard';
import { api } from '../lib/api';
import { recordQuestionResult } from '../lib/srs';
import { useStore } from '../lib/store';
import { Link } from 'react-router-dom';

/** Toate întrebările unui topic, în modul antrenament, cu filtru pe sub-topic. */
export function TopicQuestions({ topicId, subs }: { topicId: string; subs: { id: string; title: string }[] }) {
  const all = questionsForTopic(topicId);
  const [sub, setSub] = useState<string>('all');
  const list = useMemo(() => (sub === 'all' ? all : all.filter((q) => q.sub === sub)), [sub, all]);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const { bumpStats } = useStore();
  const q = list[Math.min(i, list.length - 1)];
  return (
    <div>
      <div className="row" style={{ marginBottom: 14 }}>
        <div className="tabs" role="tablist">
          <button className={sub === 'all' ? 'on' : ''} onClick={() => { setSub('all'); setI(0); }}>Toate ({all.length})</button>
          {subs.map((s) => (
            <button key={s.id} className={sub === s.id ? 'on' : ''} onClick={() => { setSub(s.id); setI(0); }}>
              {s.id} ({all.filter((x) => x.sub === s.id).length})
            </button>
          ))}
        </div>
        <span className="spacer" />
        <Link className="btn sm" to={`/antrenament?topic=${topicId}`}>Deschide în Antrenament →</Link>
      </div>
      <div className="dots-nav" style={{ marginBottom: 14 }}>
        {list.map((x, k) => (
          <button key={x.id} className={`${k === i ? 'cur' : ''} ${results[x.id] === true ? 'ok' : results[x.id] === false ? 'bad' : ''}`} onClick={() => setI(k)} aria-label={`Întrebarea ${k + 1}`}>{k + 1}</button>
        ))}
      </div>
      {q && (
        <QuestionCard key={q.id + sub} q={q} mode="train" index={i} total={list.length}
          onGraded={(ok, a, onlyReveal) => {
            setResults((r) => ({ ...r, [q.id]: ok }));
            api.attempt({ questionId: q.id, topicId, mode: 'train', correct: ok, answer: onlyReveal ? { revealed: true } : a }).then(bumpStats).catch(() => {});
            recordQuestionResult(q.id, ok).catch(() => {});
          }}
          onNext={i < list.length - 1 ? () => setI(i + 1) : undefined} />
      )}
      <div className="row muted small" style={{ marginTop: 10 }}>
        Răspunse: {Object.keys(results).length} · corecte: {Object.values(results).filter(Boolean).length}
      </div>
    </div>
  );
}
