import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CURRICULUM, AVAILABLE, EXAM_VERSION } from '../data/curriculum';
import { useStore } from '../lib/store';
import { topicProgress } from '../content/registry';
import { Icon } from '../components/Icon';

export function Curriculum() {
  const { progress, bookmarks } = useStore();
  const [open, setOpen] = useState<Set<string>>(new Set(['1']));
  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  return (
    <div className="page narrow">
      <h1>Curriculum CCNA</h1>
      <p className="muted">Structura oficială <b>{EXAM_VERSION}</b> (exam topics Cisco, verbatim). Valabilă pentru examen până pe <b>2 februarie 2027</b>; de pe 3 februarie 2027 intră CCNA v2.0 — platforma va primi atunci update.</p>
      <div className="row" style={{ margin: '10px 0 18px' }}>
        <button className="btn sm" onClick={() => setOpen(new Set(CURRICULUM.map((d) => d.id)))}>Deschide tot</button>
        <button className="btn sm ghost" onClick={() => setOpen(new Set())}>Închide tot</button>
      </div>
      <div className="stack">
        {CURRICULUM.map((d) => (
          <div key={d.id} className="domain">
            <div className="domain-h" role="button" tabIndex={0} aria-expanded={open.has(d.id)} onClick={() => toggle(d.id)} onKeyDown={(e) => e.key === 'Enter' && toggle(d.id)}>
              <span className="num" style={{ background: `color-mix(in srgb, var(--d${d.id}) 15%, transparent)`, color: `var(--d${d.id})` }}>{d.id}.0</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 650 }}>{d.title}</div>
                <div className="small muted">{d.ro} · {d.objectives.length} obiective · pondere {d.weight}%</div>
              </div>
              <span className="spacer" />
              <Icon name="chevron" className={`chev ${open.has(d.id) ? 'open' : ''}`} />
            </div>
            {open.has(d.id) && (
              <div className="domain-b">
                {d.objectives.map((o) => {
                  const avail = AVAILABLE.has(o.id);
                  const pct = Math.round(topicProgress(o.id, progress[o.id]) * 100);
                  return (
                    <Link key={o.id} to={`/topic/${o.id}`} className={`obj ${avail ? 'avail' : 'locked'}`}>
                      <span className="mono">{o.id}</span>
                      <span>{o.title}</span>
                      <span className="row" style={{ gap: 6 }}>
                        {bookmarks.has(o.id) && <Icon name="bookmark" size={14} />}
                        {avail ? <span className="badge accent">{pct}%</span> : <span className="badge">în curând</span>}
                      </span>
                      {o.subs.length > 0 && <span className="subs">{o.subs.map((s) => <span key={s.id} className="badge" title={s.title}>{s.id.split('.').pop()}. {s.title}</span>)}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
