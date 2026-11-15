import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { findObjective } from '../data/curriculum';
import { TOPIC_MODULES, TOPIC_SECTIONS, topicProgress } from '../content/registry';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';
import { TopicQuestions } from '../components/TopicQuestions';
import { SectionHead } from '../components/SectionHead';
import { NotesPanel } from '../components/NotesPanel';
import { questionsForTopic } from '../data/questions';

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-80px 0px -60% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids.join()]);
  return active;
}

export function TopicPage() {
  const { topicId = '' } = useParams();
  const obj = findObjective(topicId);
  const loc = useLocation();
  const { progress, bookmarks, toggleBookmark } = useStore();
  const mod = TOPIC_MODULES[topicId];
  const sections = TOPIC_SECTIONS[topicId] ?? [];
  const active = useScrollSpy(sections.map((s) => s.id));

  useEffect(() => {
    if (!loc.hash) return;
    const t = setTimeout(() => document.getElementById(loc.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    return () => clearTimeout(t);
  }, [loc.hash, topicId]);

  if (!obj) return <div className="page"><h1>Topic inexistent</h1><Link to="/curriculum">Înapoi la curriculum</Link></div>;
  const crumbs = (
    <div className="crumbs"><Link to="/curriculum">Curriculum</Link><span>›</span><span>{obj.domain.id}.0 {obj.domain.title}</span><span>›</span><span>{obj.id}</span></div>
  );

  if (!mod) {
    return (
      <div className="page narrow">
        {crumbs}
        <div className="topic-hero">
          <div className="hero-code">{obj.id}</div>
          <h1 style={{ margin: '6px 0 4px' }}>{obj.title}</h1>
          <div className="muted">{obj.domain.ro} · pondere domeniu {obj.domain.weight}%</div>
          {obj.subs.length > 0 && <ul className="objective-list">{obj.subs.map((s) => <li key={s.id}><span className="mono">{s.id}</span>{s.title}</li>)}</ul>}
        </div>
        <div className="card center">
          <Icon name="lock" size={28} />
          <h3>Conținut în pregătire</h3>
          <p className="muted">Acest topic se adaugă iterativ, în ordinea curriculei. Între timp poți să-ți iei notițe aici.</p>
        </div>
        <h3>Notițele mele</h3>
        <NotesPanel topicId={topicId} />
      </div>
    );
  }

  const pct = Math.round(topicProgress(topicId, progress[topicId]) * 100);
  const nq = questionsForTopic(topicId).length;
  return (
    <div className="page">
      <div className="lesson-layout">
        <div style={{ minWidth: 0 }}>
          {crumbs}
          <div className="topic-hero">
            <div className="row between">
              <span className="hero-code">{obj.id} · {obj.domain.id}.0 {obj.domain.title}</span>
              <button className={`btn sm ${bookmarks.has(topicId) ? 'primary' : ''}`} onClick={() => toggleBookmark(topicId)}>
                <Icon name="bookmark" size={15} />{bookmarks.has(topicId) ? 'Salvat' : 'Bookmark'}
              </button>
            </div>
            <h1 style={{ margin: '8px 0 6px' }}>{obj.title}</h1>
            <div className="muted">{mod.subtitle}</div>
            <ul className="objective-list">{obj.subs.map((s) => <li key={s.id}><span className="mono">{s.id}</span>{s.title}</li>)}</ul>
            <div className="row" style={{ marginTop: 16, gap: 14 }}>
              <span className="badge">⏱ {mod.studyTime}</span>
              <span className="badge">{nq} întrebări</span>
              <span className="badge">{mod.labs} {mod.labs === 1 ? 'lab' : 'laburi'} Packet Tracer</span>
              <span className="badge accent">{pct}% parcurs</span>
            </div>
            <div className="progress" style={{ marginTop: 12 }}><span style={{ width: `${pct}%` }} /></div>
            <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>
              Treci cu mouse-ul peste (sau atinge) orice termen <span className="term" style={{ cursor: 'default' }}>subliniat punctat</span> ca să vezi <b>ce face, cum lucrează și unde se folosește</b>. Fiecare secțiune are: rezumat → explicație detaliată → deep dive opțional → capcane de examen → mini-test.
            </p>
          </div>

          <mod.Body />
          <section id="questions" className="section">
            <SectionHead id="questions" code={topicId} title="Întrebări — banca completă a topicului" />
            <p className="muted">Mod antrenament: răspunde, apoi <b>Verifică</b>, sau apasă <b>Arată răspunsul</b>. Fiecare variantă are explicație. Greșelile intră automat în Repetare (FSRS).</p>
            <TopicQuestions topicId={topicId} subs={obj.subs} />
          </section>
          <mod.Labs />
          <section id="notes" className="section">
            <div className="section-head"><span className="section-code">✎</span><h2>Notițele mele</h2><span className="spacer" />
              <Link className="btn sm" to={`/fise/${topicId}`}><Icon name="print" size={15} />Cheat sheet</Link></div>
            <NotesPanel topicId={topicId} />
          </section>
        </div>
        <aside className="toc no-print">
          <div className="tiny muted" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 10px' }}>Pe această pagină</div>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'on' : ''}
              onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); history.replaceState(null, '', `#${s.id}`); }}>
              {progress[topicId]?.has(s.id) ? '✓ ' : ''}{s.code ? <span className="mono" style={{ fontSize: '0.72rem', marginRight: 6 }}>{s.code}</span> : null}{s.label}
            </a>
          ))}
          <a href="#notes" onClick={(e) => { e.preventDefault(); document.getElementById('notes')?.scrollIntoView({ behavior: 'smooth' }); }}>Notițe</a>
        </aside>
      </div>
    </div>
  );
}
