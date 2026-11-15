import { useMemo, useState, type ReactNode } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';

/* Diagrame originale pentru 1.2 — topologii de rețea. Culori DOAR prin variabile CSS. */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...font, fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);

/* ---------- simboluri noi (nu există în wlan.tsx) ---------- */
export function ServerIcon({ x, y, label, color = 'var(--text-2)' }: { x: number; y: number; label?: string; color?: string }) {
  return (
    <g>
      <rect x={x - 11} y={y - 15} width={22} height={30} rx={3} fill="var(--surface-3)" stroke={color} strokeWidth={1.3} />
      <path d={`M${x - 7} ${y - 8} h14 M${x - 7} ${y - 2} h14 M${x - 7} ${y + 4} h14`} stroke={color} strokeWidth={1.1} />
      <circle cx={x + 5} cy={y + 10} r={1.6} fill="var(--accent)" />
      {label && <T x={x} y={y + 30} size={10.5} color="var(--text-2)">{label}</T>}
    </g>
  );
}
export function CloudShape({ x, y, w = 150, h = 70, label, sub, color = 'var(--info)' }: { x: number; y: number; w?: number; h?: number; label?: string; sub?: string; color?: string }) {
  const rx = w / 2, ry = h / 2;
  const d = `M${x - rx * 0.78} ${y + ry * 0.55} H${x + rx * 0.78}
    A ${rx * 0.3} ${ry * 0.5} 0 0 0 ${x + rx * 0.72} ${y - ry * 0.12}
    A ${rx * 0.42} ${ry * 0.62} 0 0 0 ${x + rx * 0.05} ${y - ry * 0.5}
    A ${rx * 0.38} ${ry * 0.55} 0 0 0 ${x - rx * 0.55} ${y - ry * 0.15}
    A ${rx * 0.3} ${ry * 0.45} 0 0 0 ${x - rx * 0.78} ${y + ry * 0.55} Z`;
  return (
    <g>
      <path d={d} fill="var(--surface-3)" stroke={color} strokeWidth={1.6} />
      {label && <T x={x} y={y + (sub ? 6 : 12)} weight={650} color={color}>{label}</T>}
      {sub && <T x={x} y={y + 21} size={10} color="var(--muted)">{sub}</T>}
    </g>
  );
}
const Link = ({ x1, y1, x2, y2, color = 'var(--text-2)', w = 1.8, dash, cls }: { x1: number; y1: number; x2: number; y2: number; color?: string; w?: number; dash?: string; cls?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeDasharray={dash} className={cls} strokeLinecap="round" />
);
const Seg = <K extends string>({ value, onChange, items, label }: { value: K; onChange: (k: K) => void; items: [K, string][]; label: string }) => (
  <div className="segmented" role="group" aria-label={label} style={{ marginBottom: 10, flexWrap: 'wrap' }}>
    {items.map(([k, l]) => <button key={k} type="button" className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{l}</button>)}
  </div>
);
const Note = ({ title, children }: { title: ReactNode; children?: ReactNode }) => (
  <div className="callout tip" style={{ marginTop: 8, minHeight: 56 }}><div><b>{title}</b>{children && <div className="small">{children}</div>}</div></div>
);

/* ======================================================================
   1. Forme de bază: star, extended star, full mesh, partial mesh
   ====================================================================== */
export function TopologyShapes() {
  const [v, setV] = useState<'star' | 'ext' | 'full' | 'partial'>('star');
  const [n, setN] = useState(5);
  const cx = 360, cy = 150;
  const ring = (k: number, r: number, off = -Math.PI / 2) => Array.from({ length: k }, (_, i) => ({ x: cx + r * Math.cos(off + (2 * Math.PI * i) / k), y: cy + r * Math.sin(off + (2 * Math.PI * i) / k) * 0.82 }));
  const full = ring(n, 120);
  const partialPts = ring(5, 120);
  const partialEdges: [number, number][] = [[0, 1], [0, 4], [0, 2], [1, 2], [2, 3], [3, 4]];
  return (
    <>
      <Seg label="Formă topologie" value={v} onChange={setV} items={[['star', 'Star'], ['ext', 'Extended star'], ['full', 'Full mesh'], ['partial', 'Partial mesh']]} />
      <svg viewBox="0 0 720 300" width="100%" role="img" aria-label="Forme de topologie">
        {v === 'star' && (<>
          {ring(6, 115).map((p, i) => <g key={i}><Link x1={cx} y1={cy} x2={p.x} y2={p.y} /><ClientIcon x={p.x} y={p.y} kind={i % 3 === 2 ? 'phone' : 'pc'} /></g>)}
          <SwitchIcon x={cx} y={cy} label="switch" />
        </>)}
        {v === 'ext' && (<>
          {[{ x: 160, y: 200 }, { x: 360, y: 220 }, { x: 560, y: 200 }].map((s, i) => (
            <g key={i}>
              <Link x1={cx} y1={60} x2={s.x} y2={s.y} w={2.6} color="var(--info)" />
              {[-50, 0, 50].map((dx) => <g key={dx}><Link x1={s.x} y1={s.y} x2={s.x + dx} y2={s.y + 60} /><ClientIcon x={s.x + dx} y={s.y + 62} kind="pc" /></g>)}
              <SwitchIcon x={s.x} y={s.y} />
            </g>
          ))}
          <SwitchIcon x={cx} y={60} />
          <T x={cx + 44} y={64} anchor="start" size={11} color="var(--muted)">switch central</T>
        </>)}
        {v === 'full' && (<>
          {full.flatMap((a, i) => full.slice(i + 1).map((b, j) => <Link key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} color="var(--accent)" w={1.4} />))}
          {full.map((p, i) => <RouterIcon key={i} x={p.x} y={p.y} />)}
          {full.map((p, i) => <T key={'l' + i} x={p.x} y={p.y + 4} size={10.5} weight={700} color="var(--violet)">{`S${i + 1}`}</T>)}
        </>)}
        {v === 'partial' && (<>
          {partialEdges.map(([a, b], i) => <Link key={i} x1={partialPts[a].x} y1={partialPts[a].y} x2={partialPts[b].x} y2={partialPts[b].y} color="var(--accent)" w={1.6} />)}
          {partialPts.map((p, i) => <RouterIcon key={i} x={p.x} y={p.y} />)}
          {partialPts.map((p, i) => <T key={'l' + i} x={p.x} y={p.y + 4} size={10.5} weight={700} color="var(--violet)">{i === 0 ? 'HQ' : i === 2 ? 'DC' : `F${i}`}</T>)}
        </>)}
        <T x={360} y={292} size={11.5} color="var(--muted)">
          {v === 'star' ? 'Star: fiecare dispozitiv are cablul lui până la switch. Un cablu rupt afectează un singur dispozitiv; switch-ul central = punct unic de defectare.'
            : v === 'ext' ? 'Extended star: mai multe stele legate la un switch central — exact forma unui campus (access → distribution).'
              : v === 'full' ? `Full mesh cu ${n} noduri: n(n−1)/2 = ${n}·${n - 1}/2 = ${(n * (n - 1)) / 2} legături.`
                : 'Partial mesh: doar site-urile importante (HQ, DC) au legături multiple; filialele F1–F4 au una sau două. 6 legături în loc de 10.'}
        </T>
      </svg>
      {v === 'full' && (
        <div className="controls">
          <label className="small" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>Noduri: <b>{n}</b>
            <input type="range" min={3} max={8} value={n} onChange={(e) => setN(+e.target.value)} aria-label="Număr de noduri" /></label>
          <span className="small muted">3 → 3 legături · 5 → 10 · 8 → 28: costul crește cu pătratul numărului de noduri.</span>
        </div>
      )}
    </>
  );
}

/* ======================================================================
   2. Two-tier vs three-tier vs spine-leaf — aceeași „clădire”, cale + hop count
   ====================================================================== */
type NodeT = { id: string; x: number; y: number; kind: 'sw' | 'host'; label: string };
type ArchT = { nodes: NodeT[]; edges: [string, string][]; blocked: string[]; layers: [string, number][] };
const HX = [60, 151, 242, 333, 424, 515, 606, 697];
const AX = [105.5, 287.5, 469.5, 651.5];
const HOSTS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ek = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

function buildArch(kind: 'two' | 'three' | 'spine', spines: number): ArchT {
  const leafName = kind === 'spine' ? 'Leaf' : 'ASW';
  const nodes: NodeT[] = [
    ...HOSTS.map((h, i) => ({ id: h, x: HX[i], y: 382, kind: 'host' as const, label: kind === 'spine' ? `Srv ${h}` : `PC ${h}` })),
    ...AX.map((x, i) => ({ id: `a${i + 1}`, x, y: 300, kind: 'sw' as const, label: `${leafName}${i + 1}` })),
  ];
  const edges: [string, string][] = HOSTS.map((h, i) => [h, `a${Math.floor(i / 2) + 1}`]);
  const blocked: string[] = [];
  let layers: [string, number][] = [];
  if (kind === 'two') {
    nodes.push({ id: 'cd1', x: 250, y: 110, kind: 'sw', label: 'Core/Distr 1' }, { id: 'cd2', x: 510, y: 110, kind: 'sw', label: 'Core/Distr 2' });
    for (let i = 1; i <= 4; i++) { edges.push([`a${i}`, 'cd1'], [`a${i}`, 'cd2']); blocked.push(ek(`a${i}`, 'cd2')); }
    edges.push(['cd1', 'cd2']);
    layers = [['Core +', 100], ['Distribution', 114], ['Access', 304]];
  } else if (kind === 'three') {
    const D = [{ id: 'd1', x: 140 }, { id: 'd2', x: 253 }, { id: 'd3', x: 504 }, { id: 'd4', x: 617 }];
    D.forEach((d, i) => nodes.push({ id: d.id, x: d.x, y: 195, kind: 'sw', label: `DSW${i + 1}` }));
    nodes.push({ id: 'c1', x: 270, y: 70, kind: 'sw', label: 'CSW1' }, { id: 'c2', x: 490, y: 70, kind: 'sw', label: 'CSW2' });
    edges.push(['a1', 'd1'], ['a1', 'd2'], ['a2', 'd1'], ['a2', 'd2'], ['a3', 'd3'], ['a3', 'd4'], ['a4', 'd3'], ['a4', 'd4'], ['d1', 'd2'], ['d3', 'd4']);
    D.forEach((d) => edges.push([d.id, 'c1'], [d.id, 'c2']));
    edges.push(['c1', 'c2']);
    blocked.push(ek('a1', 'd2'), ek('a2', 'd2'), ek('a3', 'd4'), ek('a4', 'd4'));
    layers = [['Core', 74], ['Distribution', 199], ['Access', 304]];
  } else {
    const xs = spines === 2 ? [250, 510] : [150, 303, 457, 610];
    xs.forEach((x, i) => nodes.push({ id: `s${i + 1}`, x, y: 110, kind: 'sw', label: `Spine${i + 1}` }));
    for (let i = 1; i <= 4; i++) xs.forEach((_, j) => edges.push([`a${i}`, `s${j + 1}`]));
    layers = [['Spine', 114], ['Leaf', 304]];
  }
  return { nodes, edges, blocked, layers };
}

function analyze(edges: [string, string][], src: string, dst: string) {
  const adj = new Map<string, string[]>();
  for (const [a, b] of edges) { (adj.get(a) ?? adj.set(a, []).get(a)!).push(b); (adj.get(b) ?? adj.set(b, []).get(b)!).push(a); }
  const bfs = (s: string) => {
    const d = new Map<string, number>([[s, 0]]); const c = new Map<string, number>([[s, 1]]); const q = [s];
    while (q.length) {
      const u = q.shift()!;
      for (const v of adj.get(u) ?? []) {
        if (!d.has(v)) { d.set(v, d.get(u)! + 1); c.set(v, 0); q.push(v); }
        if (d.get(v) === d.get(u)! + 1) c.set(v, c.get(v)! + c.get(u)!);
      }
    }
    return { d, c };
  };
  const S = bfs(src), D = bfs(dst);
  const L = S.d.get(dst) ?? Infinity;
  const on = new Set<string>();
  for (const [a, b] of edges) {
    const sa = S.d.get(a), sb = S.d.get(b), ta = D.d.get(a), tb = D.d.get(b);
    if (sa !== undefined && tb !== undefined && sa + 1 + tb === L) on.add(ek(a, b));
    if (sb !== undefined && ta !== undefined && sb + 1 + ta === L) on.add(ek(a, b));
  }
  return { switches: L - 1, paths: S.c.get(dst) ?? 0, on };
}

export function ArchCompare() {
  const [kind, setKind] = useState<'two' | 'three' | 'spine'>('two');
  const [spines, setSpines] = useState(2);
  const [stp, setStp] = useState(false);
  const [src, setSrc] = useState('A');
  const [dst, setDst] = useState('H');
  const [pickDst, setPickDst] = useState(false);
  const arch = useMemo(() => buildArch(kind, spines), [kind, spines]);
  const useStp = stp && kind !== 'spine';
  const live = useMemo(() => arch.edges.filter(([a, b]) => !(useStp && arch.blocked.includes(ek(a, b)))), [arch, useStp]);
  const res = useMemo(() => analyze(live, src, dst), [live, src, dst]);
  const pos = new Map(arch.nodes.map((n) => [n.id, n]));
  const click = (h: string) => {
    if (!pickDst) { setSrc(h); if (h === dst) setDst(h === 'A' ? 'H' : 'A'); setPickDst(true); }
    else { if (h !== src) setDst(h); setPickDst(false); }
  };
  const msg = src === dst ? '' : kind === 'spine'
    ? (res.switches === 1 ? 'Ambele servere sunt pe același leaf: traficul nu urcă la spine.' : `Leaf → spine → leaf: ${res.switches} switch-uri, oricare ar fi perechea de leaf-uri. Căi de cost egal = numărul de spine-uri, toate active (ECMP, legături L3).`)
    : kind === 'three'
      ? (res.switches >= 5 ? 'Blocuri diferite: traficul urcă access → distribution → core și coboară înapoi — cel mai lung drum.' : res.switches === 3 ? 'Același bloc de distribuție: access → distribution → access.' : 'Același switch de access: traficul nu urcă deloc.')
      : (res.switches === 1 ? 'Același switch de access: traficul nu urcă deloc.' : 'Orice access → core/distribution → orice access: 3 switch-uri. Simplu, dar fiecare bloc nou trebuie legat de perechea centrală.');
  return (
    <>
      <Seg label="Arhitectură" value={kind} onChange={(k) => { setKind(k); }} items={[['two', 'Two-tier (collapsed core)'], ['three', 'Three-tier'], ['spine', 'Spine-leaf']]} />
      <div className="row" style={{ gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
        {kind === 'spine'
          ? <Seg label="Număr de spine-uri" value={String(spines) as '2' | '4'} onChange={(k) => setSpines(+k)} items={[['2', '2 spine'], ['4', '4 spine']]} />
          : <label className="check small"><input type="checkbox" checked={stp} onChange={(e) => setStp(e.target.checked)} />L2 clasic cu STP (legăturile redundante spre access blocate)</label>}
      </div>
      <svg viewBox="0 0 760 438" width="100%" role="img" aria-label="Comparație arhitecturi: cale și număr de switch-uri între două dispozitive">
        {arch.layers.map(([l, y]) => <T key={l} x={6} y={y} anchor="start" size={10.5} color="var(--muted)" weight={650}>{l}</T>)}
        {arch.edges.map(([a, b]) => {
          const A = pos.get(a)!, B = pos.get(b)!; const k = ek(a, b);
          const blk = useStp && arch.blocked.includes(k); const hot = res.on.has(k) && src !== dst;
          return (
            <g key={k}>
              <Link x1={A.x} y1={A.y} x2={B.x} y2={B.y} color={blk ? 'var(--bad)' : hot ? 'var(--accent)' : 'var(--border-strong)'} w={hot ? 3.4 : 1.6} dash={blk ? '4 5' : undefined} cls={hot ? 'flow' : undefined} />
              {blk && <T x={A.x + (B.x - A.x) * 0.3} y={A.y + (B.y - A.y) * 0.3 + 4} size={9.5} weight={700} color="var(--bad)">BLK</T>}
            </g>
          );
        })}
        {arch.nodes.filter((n) => n.kind === 'sw').map((n) => <SwitchIcon key={n.id} x={n.x} y={n.y} label={n.label} />)}
        {arch.nodes.filter((n) => n.kind === 'host').map((n) => {
          const sel = n.id === src || n.id === dst;
          return (
            <g key={n.id} role="button" tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => click(n.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); click(n.id); } }} aria-label={`Alege ${n.label}`}>
              <circle cx={n.x} cy={n.y + 4} r={24} fill={sel ? 'var(--accent-soft)' : 'transparent'} stroke={sel ? 'var(--accent)' : 'transparent'} strokeWidth={1.5} />
              {kind === 'spine' ? <ServerIcon x={n.x} y={n.y} label={n.label} color={sel ? 'var(--accent)' : undefined} /> : <ClientIcon x={n.x} y={n.y} kind="pc" label={n.label} />}
              {n.id === src && <T x={n.x} y={n.y + 44} size={10} weight={700} color="var(--accent)">SURSĂ</T>}
              {n.id === dst && <T x={n.x} y={n.y + 44} size={10} weight={700} color="var(--warn)">DEST.</T>}
            </g>
          );
        })}
      </svg>
      <div className="controls">
        <button type="button" className="btn sm" onClick={() => { setSrc('A'); setDst('B'); setPickDst(false); }}>A → B</button>
        <button type="button" className="btn sm" onClick={() => { setSrc('A'); setDst('C'); setPickDst(false); }}>A → C</button>
        <button type="button" className="btn sm" onClick={() => { setSrc('A'); setDst('H'); setPickDst(false); }}>A → H</button>
        <button type="button" className="btn sm" onClick={() => { setSrc('C'); setDst('F'); setPickDst(false); }}>C → F</button>
        <span className="small muted">{pickDst ? 'Acum alege destinația (click pe alt dispozitiv).' : 'Sau click pe un dispozitiv pentru a alege sursa.'}</span>
      </div>
      <Note title={`${src} → ${dst}: ${res.switches} switch-uri traversate · ${res.paths} ${res.paths === 1 ? 'cale activă' : 'căi active de cost egal'}`}>
        {msg}{useStp && ' Cu STP, legăturile marcate BLK nu transportă trafic: jumătate din uplink-urile access stau degeaba, iar numărul de căi active scade.'}
      </Note>
    </>
  );
}

/* ======================================================================
   3. North-south vs east-west
   ====================================================================== */
export function TrafficFlows() {
  const [v, setV] = useState<'ns' | 'ew'>('ns');
  const srv = [140, 260, 380, 500, 620];
  return (
    <>
      <Seg label="Tip de trafic" value={v} onChange={setV} items={[['ns', 'North-south'], ['ew', 'East-west']]} />
      <svg viewBox="0 0 720 270" width="100%" role="img" aria-label="Trafic north-south și east-west">
        <defs><marker id="tfA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)" /></marker></defs>
        <CloudShape x={380} y={40} w={170} h={56} label="Internet / utilizatori" />
        <Link x1={380} y1={70} x2={380} y2={112} />
        <SwitchIcon x={380} y={124} />
        <T x={420} y={128} anchor="start" size={10.5} color="var(--muted)">core / border</T>
        {srv.map((x) => <Link key={x} x1={380} y1={136} x2={x} y2={196} color="var(--border-strong)" />)}
        {srv.map((x, i) => <ServerIcon key={x} x={x} y={212} label={['web', 'app', 'auth', 'db', 'storage'][i]} />)}
        {v === 'ns' && <path d="M300 60 C 280 120, 160 150, 146 192" fill="none" stroke="var(--accent)" strokeWidth={2.6} className="flow" markerEnd="url(#tfA)" />}
        {v === 'ew' && <>
          <path d="M152 236 q 54 28 102 0" fill="none" stroke="var(--accent)" strokeWidth={2.4} className="flow" markerEnd="url(#tfA)" />
          <path d="M272 236 q 54 28 102 0" fill="none" stroke="var(--accent)" strokeWidth={2.4} className="flow" markerEnd="url(#tfA)" />
          <path d="M392 236 q 54 28 102 0" fill="none" stroke="var(--accent)" strokeWidth={2.4} className="flow" markerEnd="url(#tfA)" />
          <path d="M512 236 q 54 28 102 0" fill="none" stroke="var(--accent)" strokeWidth={2.4} className="flow" markerEnd="url(#tfA)" />
        </>}
      </svg>
      <Note title={v === 'ns' ? 'North-south: client ↔ datacenter' : 'East-west: server ↔ server'}>
        {v === 'ns' ? 'O cerere vine din Internet, coboară prin straturi până la serverul web și urcă înapoi. Designul three-tier clasic a fost construit pentru acest tipar.'
          : 'Serverul web cere date de la app, app de la auth și db, db replică pe storage. O singură cerere de utilizator produce mult trafic lateral — azi majoritatea traficului dintr-un datacenter.'}
      </Note>
    </>
  );
}

/* ======================================================================
   4. Calculator de oversubscription
   ====================================================================== */
export function OversubCalc() {
  const [ports, setPorts] = useState(48);
  const [pSpeed, setPSpeed] = useState(1);
  const [ups, setUps] = useState(2);
  const [uSpeed, setUSpeed] = useState(10);
  const down = ports * pSpeed, up = ups * uSpeed;
  const ratio = down / up;
  const fmt = (r: number) => (Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/\.?0+$/, ''));
  const preset = (a: number, b: number, c: number, d: number) => { setPorts(a); setPSpeed(b); setUps(c); setUSpeed(d); };
  const maxW = 560; const scale = maxW / Math.max(down, up);
  const sel = (val: number, set: (n: number) => void, opts: number[], unit: string, aria: string) => (
    <select className="input" style={{ width: 'auto', padding: '4px 8px' }} value={val} onChange={(e) => set(+e.target.value)} aria-label={aria}>
      {opts.map((o) => <option key={o} value={o}>{o}{unit}</option>)}
    </select>
  );
  return (
    <>
      <div className="row" style={{ gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
        <span className="small">Porturi spre dispozitive:</span>{sel(ports, setPorts, [24, 48], '', 'Număr porturi')}
        <span className="small">×</span>{sel(pSpeed, setPSpeed, [1, 10, 25], ' Gbps', 'Viteză port')}
        <span className="small" style={{ marginLeft: 8 }}>Uplink-uri:</span>{sel(ups, setUps, [1, 2, 4, 6, 8], '', 'Număr uplink-uri')}
        <span className="small">×</span>{sel(uSpeed, setUSpeed, [10, 40, 100], ' Gbps', 'Viteză uplink')}
      </div>
      <svg viewBox="0 0 720 150" width="100%" role="img" aria-label="Raport de oversubscription">
        <T x={10} y={36} anchor="start" size={11} color="var(--muted)" weight={650}>în jos</T>
        <rect x={130} y={20} width={down * scale} height={26} rx={6} fill="var(--info-soft)" stroke="var(--info)" />
        <T x={138} y={38} anchor="start" size={12} weight={650}>{ports} × {pSpeed}G = {down} Gbps</T>
        <T x={10} y={84} anchor="start" size={11} color="var(--muted)" weight={650}>în sus</T>
        <rect x={130} y={68} width={up * scale} height={26} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" />
        <T x={138} y={86} anchor="start" size={12} weight={650}>{ups} × {uSpeed}G = {up} Gbps</T>
        <T x={360} y={130} size={15} weight={700} color={ratio <= 1 ? 'var(--ok)' : ratio <= 3 ? 'var(--accent)' : ratio <= 20 ? 'var(--warn)' : 'var(--bad)'}>
          Oversubscription = {down} : {up} = {fmt(ratio)} : 1{ratio <= 1 ? ' (non-blocking)' : ''}
        </T>
      </svg>
      <div className="controls">
        <button type="button" className="btn sm" onClick={() => preset(48, 1, 2, 10)}>Access campus: 48×1G / 2×10G</button>
        <button type="button" className="btn sm" onClick={() => preset(48, 25, 8, 100)}>Leaf: 48×25G / 8×100G</button>
        <button type="button" className="btn sm" onClick={() => preset(48, 25, 4, 100)}>Același leaf cu doar 4 spine</button>
        <button type="button" className="btn sm" onClick={() => preset(24, 10, 6, 40)}>24×10G / 6×40G</button>
      </div>
    </>
  );
}

/* ======================================================================
   5. Topologii WAN
   ====================================================================== */
export function WanTopologies() {
  const [v, setV] = useState<'p2p' | 'hub' | 'full' | 'partial'>('hub');
  const [n, setN] = useState(5);
  const [showFlow, setShowFlow] = useState(true);
  const cx = 360, cy = 150;
  const pts = (k: number) => Array.from({ length: k }, (_, i) => ({ x: cx + 220 * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / k), y: cy + 110 * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / k) }));
  const sites = pts(n);
  const spokes = pts(n - 1);
  const links = v === 'p2p' ? 1 : v === 'hub' ? n - 1 : v === 'full' ? (n * (n - 1)) / 2 : null;
  const partial: [number, number][] = [[0, 1], [0, 2], [1, 2], ...sites.slice(3).map((_, i) => [0, i + 3] as [number, number]), ...(n > 4 ? [[1, 3] as [number, number]] : [])];
  return (
    <>
      <Seg label="Topologie WAN" value={v} onChange={setV} items={[['p2p', 'Point-to-point'], ['hub', 'Hub-and-spoke'], ['full', 'Full mesh'], ['partial', 'Partial mesh']]} />
      <svg viewBox="0 0 720 300" width="100%" role="img" aria-label="Topologii WAN">
        <defs><marker id="wanA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--warn)" /></marker></defs>
        {v === 'p2p' && (<>
          <Link x1={170} y1={150} x2={550} y2={150} w={3} color="var(--accent)" />
          <T x={360} y={138} size={11} color="var(--muted)">linie închiriată / Metro Ethernet E-Line</T>
          <RouterIcon x={140} y={150} label="Sediu" /><RouterIcon x={580} y={150} label="Datacenter" />
        </>)}
        {v === 'hub' && (<>
          {spokes.map((p, i) => <Link key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} color="var(--accent)" w={2} />)}
          {showFlow && n > 2 && <path d={`M${spokes[0].x + 4} ${spokes[0].y + 16} Q ${(spokes[0].x + cx) / 2 + 24} ${(spokes[0].y + cy) / 2 + 4}, ${cx + 8} ${cy + 16} Q ${(spokes[1].x + cx) / 2 + 10} ${(spokes[1].y + cy) / 2 + 26}, ${spokes[1].x - 6} ${spokes[1].y + 16}`} fill="none" stroke="var(--warn)" strokeWidth={2.4} className="flow" markerEnd="url(#wanA)" />}
          <RouterIcon x={cx} y={cy} label="HUB (sediu)" />
          {spokes.map((p, i) => <RouterIcon key={i} x={p.x} y={p.y} label={`Filiala ${i + 1}`} />)}
        </>)}
        {v === 'full' && (<>
          {sites.flatMap((a, i) => sites.slice(i + 1).map((b, j) => <Link key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} color="var(--accent)" w={1.5} />))}
          {sites.map((p, i) => <RouterIcon key={i} x={p.x} y={p.y} label={i === 0 ? 'Sediu' : `Filiala ${i}`} />)}
        </>)}
        {v === 'partial' && (<>
          {partial.map(([a, b], i) => <Link key={i} x1={sites[a].x} y1={sites[a].y} x2={sites[b].x} y2={sites[b].y} color="var(--accent)" w={1.8} />)}
          {sites.map((p, i) => <RouterIcon key={i} x={p.x} y={p.y} label={i === 0 ? 'Sediu' : i === 1 ? 'DC' : i === 2 ? 'DC backup' : `Filiala ${i - 2}`} />)}
        </>)}
      </svg>
      <div className="controls">
        {v !== 'p2p' && <label className="small" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>Site-uri: <b>{n}</b>
          <input type="range" min={3} max={8} value={n} onChange={(e) => setN(+e.target.value)} aria-label="Număr de site-uri" /></label>}
        {v === 'hub' && <label className="check small"><input type="checkbox" checked={showFlow} onChange={(e) => setShowFlow(e.target.checked)} />arată traficul filială → filială</label>}
        <span className="small muted">{links !== null ? `Legături necesare: ${links}` : `Legături: ${partial.length} (alese de proiectant)`}</span>
      </div>
      <Note title={v === 'p2p' ? 'Point-to-point: două site-uri, o legătură dedicată' : v === 'hub' ? 'Hub-and-spoke: n − 1 legături' : v === 'full' ? 'Full mesh: n(n − 1)/2 legături' : 'Partial mesh: compromisul'}>
        {v === 'p2p' ? 'Simplu și privat. Dar pentru fiecare pereche nouă de site-uri trebuie un circuit nou — costul crește rapid.'
          : v === 'hub' ? 'Puține legături și politici centralizate în hub. Traficul între filiale trece prin hub (latență în plus), iar hub-ul este punct unic de defectare și posibilă gâtuire.'
            : v === 'full' ? 'Fiecare site vorbește direct cu fiecare: cale optimă și redundanță maximă, dar costul și complexitatea cresc cu pătratul numărului de site-uri.'
              : 'Site-urile critice (sediu, datacentere) sunt legate între ele redundant; filialele obișnuite au o singură legătură spre sediu.'}
      </Note>
    </>
  );
}

/* ======================================================================
   6. Single / dual-homed, multihomed, dual-multihomed
   ====================================================================== */
export function WanHoming() {
  const [v, setV] = useState<'single' | 'dual' | 'multi' | 'dualmulti'>('single');
  const twoRouters = v === 'dual' || v === 'dualmulti';
  const twoIsp = v === 'multi' || v === 'dualmulti';
  const R = twoRouters ? [{ x: 170, y: 95 }, { x: 170, y: 205 }] : [{ x: 170, y: 150 }];
  const I = twoIsp ? [{ x: 540, y: 85, l: 'ISP 1' }, { x: 540, y: 215, l: 'ISP 2' }] : [{ x: 540, y: 150, l: 'ISP 1' }];
  const links: [number, number][] = v === 'single' ? [[0, 0]] : v === 'dual' ? [[0, 0], [1, 0]] : v === 'multi' ? [[0, 0], [0, 1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
  return (
    <>
      <Seg label="Conectare la ISP" value={v} onChange={setV} items={[['single', 'Single-homed'], ['dual', 'Dual-homed'], ['multi', 'Multihomed'], ['dualmulti', 'Dual-multihomed']]} />
      <svg viewBox="0 0 720 290" width="100%" role="img" aria-label="Variante de conectare la ISP">
        <rect x={40} y={40} width={210} height={220} rx={14} fill="none" stroke="var(--border-strong)" strokeDasharray="5 5" />
        <T x={60} y={60} anchor="start" size={11} color="var(--muted)" weight={650}>Site-ul tău</T>
        <SwitchIcon x={90} y={240} />
        {R.map((r, i) => <Link key={i} x1={100} y1={230} x2={r.x} y2={r.y + 12} color="var(--border-strong)" />)}
        {links.map(([r, s], i) => <Link key={i} x1={R[r].x + 30} y1={R[r].y + (twoIsp ? (s ? 6 : -6) : 0)} x2={I[s].x - 70} y2={I[s].y + (twoRouters ? (r ? 8 : -8) : 0)} color="var(--accent)" w={2.4} />)}
        {R.map((r, i) => <RouterIcon key={i} x={r.x} y={r.y} label={`R${i + 1}`} />)}
        {I.map((s) => <CloudShape key={s.l} x={s.x} y={s.y} w={150} h={62} label={s.l} />)}
      </svg>
      <Table2 rows={[
        ['Single-homed', '1 legătură · 1 ISP', 'nicio redundanță'],
        ['Dual-homed', '2 legături · același ISP', 'supraviețuiește căderii unei legături sau unui router'],
        ['Multihomed', '1 legătură la fiecare din 2 ISP', 'supraviețuiește căderii unui ISP întreg'],
        ['Dual-multihomed', '2 legături la fiecare din 2 ISP', 'redundanță maximă (și cost maxim)'],
      ]} hl={['single', 'dual', 'multi', 'dualmulti'].indexOf(v)} />
    </>
  );
}
function Table2({ rows, hl }: { rows: string[][]; hl: number }) {
  return (
    <div className="table-wrap"><table className="t"><thead><tr><th>Variantă</th><th>Legături</th><th>Protejează împotriva</th></tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} style={i === hl ? { background: 'var(--accent-soft)' } : undefined}>{r.map((c, j) => <td key={j}>{j === 0 ? <b>{c}</b> : c}</td>)}</tr>)}</tbody></table></div>
  );
}

/* ======================================================================
   7. Servicii WAN: MPLS, Metro Ethernet, Internet VPN
   ====================================================================== */
export function WanServices() {
  const [v, setV] = useState<'mpls' | 'metro' | 'vpn'>('mpls');
  return (
    <>
      <Seg label="Serviciu WAN" value={v} onChange={setV} items={[['mpls', 'MPLS L3VPN'], ['metro', 'Metro Ethernet'], ['vpn', 'Internet VPN']]} />
      <svg viewBox="0 0 720 272" width="100%" role="img" aria-label="Servicii WAN">
        {v === 'mpls' && (<>
          <rect x={200} y={40} width={320} height={180} rx={70} fill="var(--surface-2)" stroke="var(--violet)" strokeDasharray="6 5" />
          <T x={360} y={62} size={11} color="var(--violet)" weight={650}>rețeaua MPLS a providerului</T>
          <Link x1={110} y1={80} x2={240} y2={95} /><Link x1={110} y1={200} x2={240} y2={185} /><Link x1={480} y1={140} x2={610} y2={140} />
          <Link x1={260} y1={95} x2={360} y2={140} color="var(--violet)" /><Link x1={260} y1={185} x2={360} y2={140} color="var(--violet)" /><Link x1={360} y1={140} x2={460} y2={140} color="var(--violet)" />
          <RouterIcon x={80} y={80} label="CE" sub="Filiala 1" /><RouterIcon x={80} y={200} label="CE" sub="Filiala 2" /><RouterIcon x={640} y={140} label="CE" sub="Sediu" />
          <RouterIcon x={262} y={95} label="PE" /><RouterIcon x={262} y={185} label="PE" /><RouterIcon x={360} y={140} label="P" /><RouterIcon x={460} y={140} label="PE" />
          <T x={360} y={264} size={11} color="var(--muted)">CE ↔ PE: rutare IP normală (static/OSPF/EIGRP/BGP) · în interior: comutare după etichete · conectivitate oricine-cu-oricine</T>
        </>)}
        {v === 'metro' && (<>
          <rect x={200} y={40} width={320} height={180} rx={70} fill="var(--surface-2)" stroke="var(--info)" strokeDasharray="6 5" />
          <T x={360} y={62} size={11} color="var(--info)" weight={650}>rețeaua Ethernet a providerului (switch „virtual” gigant)</T>
          <SwitchIcon x={360} y={140} label="" />
          <Link x1={110} y1={80} x2={328} y2={134} color="var(--info)" /><Link x1={110} y1={200} x2={328} y2={146} color="var(--info)" /><Link x1={392} y1={140} x2={610} y2={140} color="var(--info)" />
          <RouterIcon x={80} y={80} label="R" sub="Clădirea B" /><RouterIcon x={80} y={200} label="R" sub="Clădirea C" /><RouterIcon x={640} y={140} label="R" sub="Sediu" />
          <T x={360} y={264} size={11} color="var(--muted)">Handoff Ethernet (RJ45/fibră) · E-Line = punct-la-punct · E-LAN = oricine-cu-oricine · E-Tree = rădăcină-frunze</T>
        </>)}
        {v === 'vpn' && (<>
          <CloudShape x={360} y={135} w={260} h={120} label="Internet" sub="public, fără garanții" />
          <path d="M120 90 C 260 40, 470 40, 600 130" fill="none" stroke="var(--accent)" strokeWidth={5} strokeOpacity={0.35} />
          <path d="M120 90 C 260 40, 470 40, 600 130" fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeDasharray="6 5" className="flow" />
          <T x={360} y={44} size={11} color="var(--accent)" weight={650}>tunel IPsec criptat (site-to-site)</T>
          <RouterIcon x={90} y={95} label="Filială" sub="DSL / fibră / 5G" /><RouterIcon x={630} y={140} label="Sediu" />
          <ClientIcon x={150} y={215} label="angajat acasă" />
          <path d="M170 205 C 300 230, 480 220, 600 150" fill="none" stroke="var(--warn)" strokeWidth={1.6} strokeDasharray="4 4" />
          <T x={420} y={236} size={11} color="var(--warn)">remote-access VPN (client IPsec/TLS)</T>
        </>)}
      </svg>
    </>
  );
}

/* ======================================================================
   8. SOHO — un dispozitiv, multe funcții
   ====================================================================== */
const SOHO_F = [
  { k: 'modem', n: 'Modem / ONT', d: 'Convertește semnalul de pe linia operatorului (fibră GPON, cablu coaxial, DSL) în Ethernet. Uneori e o cutie separată, oferită de ISP.', c: 'var(--muted)' },
  { k: 'router', n: 'Router + NAT/PAT', d: 'Are o interfață WAN (spre ISP, adresă publică sau CGNAT) și una LAN (192.168.x.1). Rutează între ele și traduce adresele private în adresa publică (PAT — topicul 4.1).', c: 'var(--violet)' },
  { k: 'fw', n: 'Firewall stateful', d: 'Permite implicit doar răspunsurile la conexiunile pornite din interior; blochează conexiunile nesolicitate din Internet.', c: 'var(--bad)' },
  { k: 'switch', n: 'Switch 4 porturi', d: 'Porturile LAN marcate 1–4: un mic switch de nivel 2 la care legi PC-uri, console, NAS.', c: 'var(--info)' },
  { k: 'ap', n: 'Access point Wi-Fi', d: 'Unul sau mai multe radiouri (2.4/5/6 GHz) care fac bridge între Wi-Fi și același LAN ca porturile cablate.', c: 'var(--accent)' },
  { k: 'dhcp', n: 'DHCP + DNS', d: 'Server DHCP pentru LAN (adresă, mască, gateway, DNS) și proxy DNS care trimite întrebările la serverele ISP-ului.', c: 'var(--ok)' },
] as const;
export function SohoBox() {
  const [sel, setSel] = useState<(typeof SOHO_F)[number]['k']>('router');
  const cur = SOHO_F.find((f) => f.k === sel)!;
  return (
    <>
      <svg viewBox="0 0 720 300" width="100%" role="img" aria-label="Funcțiile unui router SOHO">
        <CloudShape x={70} y={150} w={120} h={60} label="ISP" />
        <Link x1={128} y1={150} x2={180} y2={150} w={2.6} color="var(--violet)" />
        <rect x={180} y={30} width={360} height={240} rx={18} fill="var(--surface-2)" stroke="var(--border-strong)" />
        <T x={360} y={52} size={12} weight={700}>„Wireless router” SOHO — un singur dispozitiv</T>
        {SOHO_F.map((f, i) => {
          const x = 200 + (i % 2) * 172, y = 68 + Math.floor(i / 2) * 66; const on = f.k === sel;
          return (
            <g key={f.k} role="button" tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => setSel(f.k)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(f.k); } }} aria-label={f.n}>
              <rect x={x} y={y} width={156} height={52} rx={10} fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={on ? 'var(--accent)' : f.c} strokeWidth={on ? 2.2 : 1.2} />
              <T x={x + 78} y={y + 31} size={12} weight={650} color={on ? 'var(--accent)' : 'var(--text)'}>{f.n}</T>
            </g>
          );
        })}
        <Link x1={540} y1={110} x2={600} y2={90} /><ClientIcon x={630} y={85} kind="pc" label="PC (cablu)" />
        <path d="M545 180 q 25 -10 40 5" fill="none" stroke="var(--accent)" strokeDasharray="3 4" strokeWidth={1.4} />
        <ClientIcon x={620} y={180} label="laptop" /><ClientIcon x={665} y={240} kind="phone" label="telefon" />
        <path d="M545 210 q 50 10 105 25" fill="none" stroke="var(--accent)" strokeDasharray="3 4" strokeWidth={1.4} />
      </svg>
      <Note title={cur.n}>{cur.d}</Note>
    </>
  );
}

/* ======================================================================
   9. Modelul de responsabilitate partajată: on-prem / IaaS / PaaS / SaaS
   ====================================================================== */
const STACK = ['Aplicații', 'Date', 'Runtime', 'Middleware', 'Sistem de operare', 'Virtualizare', 'Servere', 'Stocare', 'Rețea fizică', 'Clădire, curent, răcire'];
const MODELS = [
  { k: 'onprem', n: 'On-premises', you: 10, d: 'Tu cumperi, instalezi și administrezi absolut tot — de la clădire și curent până la aplicație. Control maxim, responsabilitate maximă, investiție inițială (CapEx).' },
  { k: 'iaas', n: 'IaaS', you: 5, d: 'Providerul îți dă VM-uri, stocare și rețea virtuală. Tu instalezi și patch-uiești sistemul de operare și tot ce e deasupra. Singurul model în care controlezi OS-ul. Ex.: AWS EC2, Azure VMs.' },
  { k: 'paas', n: 'PaaS', you: 2, d: 'Providerul administrează și OS-ul, și runtime-ul. Tu aduci codul aplicației și datele. Ex.: Azure App Service, Google App Engine.' },
  { k: 'saas', n: 'SaaS', you: 0, d: 'Folosești aplicația gata făcută. Tot stack-ul e al providerului; tu răspunzi doar de datele tale, de utilizatori și de setările contului. Ex.: Microsoft 365, Webex.' },
] as const;
export function CloudStack() {
  const [sel, setSel] = useState<(typeof MODELS)[number]['k']>('iaas');
  const cur = MODELS.find((m) => m.k === sel)!;
  const x0 = 170, cw = 136, rh = 23, y0 = 52;
  return (
    <>
      <Seg label="Model" value={sel} onChange={setSel} items={MODELS.map((m) => [m.k, m.n] as [typeof m.k, string])} />
      <svg viewBox="0 0 720 315" width="100%" role="img" aria-label="Cine administrează fiecare strat în on-prem, IaaS, PaaS, SaaS">
        {STACK.map((s, r) => <T key={s} x={x0 - 10} y={y0 + r * rh + 16} anchor="end" size={11} color="var(--text-2)">{s}</T>)}
        {MODELS.map((m, c) => {
          const x = x0 + c * cw; const on = m.k === sel;
          return (
            <g key={m.k} role="button" tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => setSel(m.k)} opacity={on ? 1 : 0.55}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(m.k); } }} aria-label={m.n}>
              <T x={x + cw / 2 - 4} y={y0 - 14} weight={700} color={on ? 'var(--accent)' : 'var(--text)'}>{m.n}</T>
              {STACK.map((s, r) => {
                const mine = r < m.you;
                return <rect key={s} x={x} y={y0 + r * rh} width={cw - 8} height={rh - 3} rx={4} fill={mine ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={mine ? 'var(--accent)' : 'var(--border)'} strokeWidth={on ? 1.6 : 1} />;
              })}
              {on && <rect x={x - 4} y={y0 - 30} width={cw} height={STACK.length * rh + 34} rx={8} fill="none" stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="4 4" />}
            </g>
          );
        })}
        <rect x={x0} y={298} width={14} height={10} rx={2} fill="var(--accent-soft)" stroke="var(--accent)" />
        <T x={x0 + 20} y={307} anchor="start" size={11} color="var(--text-2)">administrezi TU</T>
        <rect x={x0 + 150} y={298} width={14} height={10} rx={2} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={x0 + 170} y={307} anchor="start" size={11} color="var(--text-2)">administrează PROVIDERUL</T>
      </svg>
      <Note title={`${cur.n}: tu administrezi ${cur.you} din ${STACK.length} straturi`}>{cur.d}</Note>
    </>
  );
}

/* ======================================================================
   10. Cum ajungi la cloud: Internet, VPN, interconectare privată
   ====================================================================== */
export function CloudConnect() {
  return (
    <svg viewBox="0 0 720 260" width="100%" role="img" aria-label="Variante de conectare a unei companii la cloud-ul public">
      <rect x={20} y={60} width={190} height={150} rx={14} fill="var(--surface-2)" stroke="var(--border-strong)" />
      <T x={115} y={82} size={11.5} weight={650}>Companie (on-prem)</T>
      <ServerIcon x={70} y={130} label="servere" /><RouterIcon x={150} y={135} label="router" />
      <CloudShape x={360} y={70} w={170} h={64} label="Internet" />
      <CloudShape x={360} y={200} w={190} h={64} label="WAN privat / colocare" color="var(--violet)" />
      <rect x={520} y={40} width={180} height={190} rx={14} fill="var(--surface-2)" stroke="var(--info)" />
      <T x={610} y={62} size={11.5} weight={650} color="var(--info)">Cloud public</T>
      <ServerIcon x={575} y={120} label="VM" /><ServerIcon x={645} y={120} label="SaaS" />
      <path d="M180 125 C 240 80, 270 75, 285 72" fill="none" stroke="var(--text-2)" strokeWidth={1.8} />
      <path d="M435 72 C 470 75, 500 90, 520 100" fill="none" stroke="var(--text-2)" strokeWidth={1.8} />
      <path d="M180 132 C 300 115, 440 110, 520 118" fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeDasharray="6 5" className="flow" />
      <T x={360} y={128} size={10.5} color="var(--accent)" weight={650}>VPN IPsec peste Internet</T>
      <path d="M180 145 C 240 190, 260 200, 266 200" fill="none" stroke="var(--violet)" strokeWidth={2.4} />
      <path d="M455 200 C 480 200, 500 190, 520 180" fill="none" stroke="var(--violet)" strokeWidth={2.4} />
      <T x={360} y={252} size={10.5} color="var(--muted)">Interconectare dedicată (ex. AWS Direct Connect, Azure ExpressRoute) sau prin MPLS: latență previzibilă, fără Internet</T>
    </svg>
  );
}

/* ======================================================================
   11. Topologii de laborator
   ====================================================================== */
export function LabCampusTopology({ withCore = false }: { withCore?: boolean }) {
  const A = [{ x: 140, l: 'ASW1' }, { x: 360, l: 'ASW2' }, { x: 580, l: 'ASW3' }];
  const yD = withCore ? 170 : 40, yA = withCore ? 270 : 150, yP = withCore ? 345 : 230;
  const D = [{ x: 250, l: 'DSW1' }, { x: 470, l: 'DSW2' }];
  return (
    <svg viewBox={`0 0 720 ${withCore ? 400 : 290}`} width="100%" role="img" aria-label={withCore ? 'Topologie lab: three-tier' : 'Topologie lab: two-tier'}>
      {withCore && (<>
        <Link x1={250} y1={yD} x2={270} y2={60} color="var(--violet)" w={2} /><Link x1={250} y1={yD} x2={450} y2={60} color="var(--violet)" w={2} />
        <Link x1={470} y1={yD} x2={270} y2={60} color="var(--violet)" w={2} /><Link x1={470} y1={yD} x2={450} y2={60} color="var(--violet)" w={2} />
        <Link x1={270} y1={60} x2={450} y2={60} w={2} />
        <Link x1={610} y1={135} x2={270} y2={60} color="var(--violet)" w={1.4} dash="5 4" /><Link x1={610} y1={135} x2={450} y2={60} color="var(--violet)" w={1.4} dash="5 4" />
        <SwitchIcon x={270} y={60} /><SwitchIcon x={450} y={60} />
        <T x={270} y={36} size={11} weight={650}>CSW1</T><T x={450} y={36} size={11} weight={650}>CSW2</T>
        <rect x={570} y={118} width={130} height={34} rx={8} fill="var(--surface-2)" stroke="var(--border-strong)" strokeDasharray="4 4" />
        <T x={635} y={139} size={10.5} color="var(--muted)">Bloc B (DSW3/4…)</T>
      </>)}
      {A.map((a) => D.map((d) => <Link key={a.l + d.l} x1={a.x} y1={yA} x2={d.x} y2={yD} color="var(--accent)" w={2} />))}
      <Link x1={250} y1={yD} x2={470} y2={yD} w={2.4} />
      <T x={360} y={yD - 8} size={10} color="var(--muted)">Fa0/24 ↔ Fa0/24</T>
      {D.map((d) => <SwitchIcon key={d.l} x={d.x} y={yD} />)}
      <T x={250} y={yD + 28} size={11} weight={650}>DSW1 (3560)</T><T x={470} y={yD + 28} size={11} weight={650}>DSW2 (3560)</T>
      {A.map((a, i) => (
        <g key={a.l}>
          <Link x1={a.x} y1={yA} x2={a.x - 40} y2={yP - 10} /><Link x1={a.x} y1={yA} x2={a.x + 40} y2={yP - 10} />
          <SwitchIcon x={a.x} y={yA} />
          <T x={a.x + 40} y={yA + 4} anchor="start" size={11} weight={650}>{a.l}</T>
          <ClientIcon x={a.x - 40} y={yP} kind="pc" label={`PC${i * 2 + 1}`} /><ClientIcon x={a.x + 40} y={yP} kind="pc" label={`PC${i * 2 + 2}`} />
        </g>
      ))}
      <T x={360} y={withCore ? 393 : 283} size={10.5} color="var(--muted)">fiecare ASW: Gi0/1 → DSW1 · Gi0/2 → DSW2 · pe DSW: Fa0/1–3 ← ASW1–3{withCore ? ' · fiecare DSW: Gi0/1 → CSW1 · Gi0/2 → CSW2' : ''}</T>
    </svg>
  );
}
export function LabSpineLeafTopology() {
  const S = [{ x: 250, l: 'SPINE1' }, { x: 470, l: 'SPINE2' }];
  const L = [100, 273, 447, 620];
  return (
    <svg viewBox="0 0 720 312" width="100%" role="img" aria-label="Topologie lab solo: spine-leaf cu 2 spine și 4 leaf">
      {L.map((x) => S.map((s) => <Link key={x + s.l} x1={x} y1={180} x2={s.x} y2={60} color="var(--accent)" w={2} />))}
      {S.map((s) => <g key={s.l}><SwitchIcon x={s.x} y={60} /><T x={s.x} y={36} size={11} weight={650}>{s.l} (3650)</T></g>)}
      {L.map((x, i) => (
        <g key={x}>
          <Link x1={x} y1={180} x2={x} y2={232} />
          <SwitchIcon x={x} y={180} />
          <T x={x} y={208} size={11} weight={650}>{`LEAF${i + 1}`}</T>
          <ServerIcon x={x} y={250} label={`SRV${i + 1} · 192.168.${i + 1}.10`} />
        </g>
      ))}
      <T x={360} y={304} size={10.5} color="var(--muted)">fiecare leaf: Gi1/0/23 → SPINE1 · Gi1/0/24 → SPINE2 · legături routed /30</T>
    </svg>
  );
}

