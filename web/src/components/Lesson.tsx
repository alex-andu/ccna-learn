import { useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import { ATTRIBUTION, type Attr } from '../lib/attribution';

export function Summary({ children }: { children: ReactNode }) {
  return <div className="layer summary"><div className="layer-h"><span className="dot" />Pe scurt</div><div className="layer-b">{children}</div></div>;
}
export function Detailed({ children, title = 'Explicația detaliată' }: { children: ReactNode; title?: string }) {
  return <div className="layer"><div className="layer-h"><span className="dot" />{title}</div><div className="layer-b">{children}</div></div>;
}
export function DeepDive({ children, title = 'Deep dive (opțional)' }: { children: ReactNode; title?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="layer deep">
      <div className="layer-h" role="button" tabIndex={0} aria-expanded={open} onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open); } }}>
        <span className="dot" />{title}<span className="muted small" style={{ fontWeight: 500 }}>— peste nivelul CCNA, pentru înțelegere completă</span>
        <Icon name="chevron" className={`chev ${open ? 'open' : ''}`} />
      </div>
      {open && <div className="layer-b fade-up">{children}</div>}
    </div>
  );
}
export function Traps({ items }: { items: ReactNode[] }) {
  return (
    <div className="layer traps"><div className="layer-h"><span className="dot" />Capcane de examen</div>
      <div className="layer-b"><ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul></div></div>
  );
}

const CALLOUT_ICON = { info: 'info', tip: 'bulb', warn: 'alert', exam: 'flag' } as const;
export function Callout({ kind = 'info', title, children }: { kind?: keyof typeof CALLOUT_ICON; title?: string; children: ReactNode }) {
  return (
    <div className={`callout ${kind}`}>
      <Icon name={CALLOUT_ICON[kind]} className="ci" size={22} />
      <div>{title && <b style={{ display: 'block', marginBottom: 4 }}>{title}</b>}{children}</div>
    </div>
  );
}
export function Analogy({ children }: { children: ReactNode }) {
  return <div className="analogy"><b>Analogie: </b>{children}</div>;
}

export function Figure({ children, caption }: { children: ReactNode; caption?: ReactNode }) {
  return <figure className="figure">{children}{caption && <figcaption>{caption}</figcaption>}</figure>;
}

const ATTR: Record<string, Attr> = ATTRIBUTION;
export function Photo({ file, caption }: { file: string; caption: ReactNode }) {
  const a = ATTR[file];
  return (
    <figure className="photo">
      <img src={`/img/wiki/${file}`} alt={typeof caption === 'string' ? caption : a?.title ?? ''} loading="lazy" />
      <figcaption>{caption}
        {a && <span className="attr">Foto: {a.author} · <a href={a.licenseUrl} target="_blank" rel="noreferrer">{a.license}</a> · <a href={a.source} target="_blank" rel="noreferrer">Wikimedia Commons</a></span>}
      </figcaption>
    </figure>
  );
}

export function Reveal({ label, children, defaultOpen = false }: { label: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="reveal">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name={open ? 'eye' : 'lock'} />{label}<Icon name="chevron" className={`chev ${open ? 'open' : ''}`} />
      </button>
      {open && <div className="fade-up">{children}</div>}
    </div>
  );
}

export function Table({ head, rows, hlCol }: { head: ReactNode[]; rows: ReactNode[][]; hlCol?: number }) {
  return (
    <div className="table-wrap"><table className="t">
      <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j === hlCol ? 'hl' : undefined}>{c}</td>)}</tr>)}</tbody>
    </table></div>
  );
}
