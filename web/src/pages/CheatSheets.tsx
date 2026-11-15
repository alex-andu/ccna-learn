import type { ComponentType } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheatSheet111 } from '../content/t1_11/CheatSheet';
import { findObjective } from '../data/curriculum';
import { Icon } from '../components/Icon';

const SHEETS: Record<string, ComponentType> = { '1.11': CheatSheet111 };

export function CheatSheets() {
  const { topicId } = useParams();
  if (!topicId) {
    return (
      <div className="page narrow">
        <h1>Cheat sheets</h1>
        <p className="muted">Fișe de recapitulare pe o pagină, optimizate pentru print (A4) sau „Save as PDF”.</p>
        <div className="stack">
          {Object.keys(SHEETS).map((id) => (
            <Link key={id} to={`/fise/${id}`} className="card row between" style={{ color: 'inherit' }}>
              <span><b className="mono" style={{ color: 'var(--accent)' }}>{id}</b> {findObjective(id)?.title}</span><Icon name="arrowR" />
            </Link>
          ))}
        </div>
      </div>
    );
  }
  const Sheet = SHEETS[topicId];
  return (
    <div className="page">
      <div className="row between no-print" style={{ marginBottom: 16 }}>
        <Link to="/fise" className="btn sm ghost"><Icon name="arrowL" />Toate fișele</Link>
        <button className="btn primary" onClick={() => window.print()}><Icon name="print" />Printează / PDF</button>
      </div>
      <h1>{topicId} {findObjective(topicId)?.title}</h1>
      <p className="muted small">CCNA 200-301 v1.1 · fișă de recapitulare</p>
      {Sheet ? <Sheet /> : <p className="muted">Fișa pentru acest topic nu există încă.</p>}
    </div>
  );
}
