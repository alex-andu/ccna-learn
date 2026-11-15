import { useMemo, useState } from 'react';

const C = { text: 'var(--text)', muted: 'var(--muted)', line: 'var(--border-strong)', acc: 'var(--accent)', ok: 'var(--ok)', bad: 'var(--bad)', warn: 'var(--warn)', info: 'var(--info)', vio: 'var(--violet)', surf: 'var(--surface-2)', surf3: 'var(--surface-3)' };
const font = { fontFamily: 'Inter Variable, sans-serif' };

/* ---------------------------------------------------------------
   1) Unda RF — frecvență vs lungime de undă (interactiv)
---------------------------------------------------------------- */
export function RFWave() {
  const [f, setF] = useState<2.4 | 5 | 6>(2.4);
  const [amp, setAmp] = useState(1);
  const W = 720, H = 240, x0 = 40, x1 = 690, mid = 120;
  const spanCm = 30; // fereastra afișată: 30 cm de „spațiu”
  const lambdaCm = 30 / f; // c/f în cm (c = 3e10 cm/s; f în GHz)
  const pxPerCm = (x1 - x0) / spanCm;
  const path = useMemo(() => {
    let d = '';
    for (let x = x0; x <= x1; x += 2) {
      const cm = (x - x0) / pxPerCm;
      const y = mid - Math.sin((2 * Math.PI * cm) / lambdaCm) * 70 * amp;
      d += (x === x0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    return d;
  }, [f, amp]);
  const lamPx = lambdaCm * pxPerCm;
  const peakX = x0 + lamPx / 4;
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Undă RF la ${f} GHz, lungime de undă ${lambdaCm.toFixed(1)} cm`}>
        <line x1={x0} x2={x1} y1={mid} y2={mid} stroke={C.line} strokeDasharray="4 4" />
        <path d={path} fill="none" stroke={C.acc} strokeWidth={3} strokeLinecap="round" />
        {/* lungimea de undă */}
        <line x1={peakX} x2={peakX + lamPx} y1={mid - 70 * amp - 18} y2={mid - 70 * amp - 18} stroke={C.vio} strokeWidth={2} markerStart="url(#arrL)" markerEnd="url(#arrR)" />
        <text x={peakX + lamPx / 2} y={mid - 70 * amp - 26} textAnchor="middle" style={{ ...font, fill: C.vio, fontSize: 14, fontWeight: 600 }}>λ ≈ {lambdaCm.toFixed(1)} cm</text>
        {/* amplitudine */}
        <line x1={x0 + 6} x2={x0 + 6} y1={mid} y2={mid - 70 * amp} stroke={C.warn} strokeWidth={2} markerEnd="url(#arrU)" />
        <text x={x0 + 2} y={mid + 18} style={{ ...font, fill: C.warn, fontSize: 12 }}>↑ amplitudine</text>
        {/* scara */}
        {[0, 5, 10, 15, 20, 25, 30].map((cm) => (
          <g key={cm}>
            <line x1={x0 + cm * pxPerCm} x2={x0 + cm * pxPerCm} y1={H - 30} y2={H - 24} stroke={C.line} />
            <text x={x0 + cm * pxPerCm} y={H - 10} textAnchor="middle" style={{ ...font, fill: C.muted, fontSize: 11 }}>{cm} cm</text>
          </g>
        ))}
        <defs>
          <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={C.vio} /></marker>
          <marker id="arrL" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 0L0 5L10 10z" fill={C.vio} /></marker>
          <marker id="arrU" viewBox="0 0 10 10" refX="5" refY="1" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 10L5 0L10 10z" fill={C.warn} /></marker>
        </defs>
      </svg>
      <div className="controls">
        <div className="segmented" role="group" aria-label="Frecvență">
          {([2.4, 5, 6] as const).map((v) => <button key={v} className={f === v ? 'on' : ''} onClick={() => setF(v)}>{v} GHz</button>)}
        </div>
        <label className="small muted row" style={{ gap: 8 }}>putere
          <input type="range" min={0.3} max={1} step={0.05} value={amp} onChange={(e) => setAmp(+e.target.value)} style={{ accentColor: 'var(--accent)' }} />
        </label>
        <span className="small muted">În 30 cm intră {f} cicluri. Frecvență mai mare → undă mai scurtă → atenuare mai mare.</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   2) Canalele din 2.4 GHz — interactiv (overlap)
---------------------------------------------------------------- */
const PRESETS: Record<string, number[]> = { '1 / 6 / 11': [1, 6, 11], '1 / 5 / 9 / 13 (UE, doar OFDM)': [1, 5, 9, 13], '1 / 3 / 6 / 9 / 11 (greșit)': [1, 3, 6, 9, 11] };
export function Channels24() {
  const [sel, setSel] = useState<number[]>([1, 6, 11]);
  const W = 760, H = 280, base = 200;
  const fx = (mhz: number) => 40 + ((mhz - 2400) / (2495 - 2400)) * (W - 80);
  const toggle = (n: number) => setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n].sort((a, b) => a - b)));
  const overlaps = new Set<number>();
  for (const a of sel) for (const b of sel) if (a !== b && Math.abs(a - b) < 5) { overlaps.add(a); overlaps.add(b); }
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Canalele Wi-Fi din banda 2.4 GHz">
        <rect x={fx(2400)} y={30} width={fx(2483.5) - fx(2400)} height={base - 30} fill="var(--accent-soft)" opacity={0.35} rx={6} />
        <text x={fx(2400) + 6} y={46} style={{ ...font, fill: C.muted, fontSize: 11 }}>banda ISM 2.400–2.4835 GHz</text>
        {Array.from({ length: 13 }, (_, i) => i + 1).map((n) => {
          const c = 2412 + (n - 1) * 5; const x0 = fx(c - 11), x1 = fx(c + 11), xc = fx(c);
          const on = sel.includes(n); const bad = overlaps.has(n);
          const col = !on ? C.line : bad ? C.bad : C.ok;
          return (
            <g key={n} style={{ cursor: 'pointer' }} onClick={() => toggle(n)}>
              <path d={`M${x0} ${base} Q ${xc} ${base - 2 * (on ? 130 : 95)} ${x1} ${base}`} fill={on ? (bad ? 'var(--bad-soft)' : 'var(--ok-soft)') : 'none'} stroke={col} strokeWidth={on ? 2.5 : 1.2} opacity={on ? 1 : 0.7} />
              <rect x={xc - 13} y={base + 8} width={26} height={22} rx={6} fill={on ? (bad ? C.bad : C.ok) : C.surf3} />
              <text x={xc} y={base + 23} textAnchor="middle" style={{ ...font, fill: on ? '#04241a' : C.text, fontSize: 12, fontWeight: 700 }}>{n}</text>
              <text x={xc} y={base + 46} textAnchor="middle" style={{ ...font, fill: C.muted, fontSize: 9 }}>{c}</text>
            </g>
          );
        })}
        <line x1={40} x2={W - 40} y1={base} y2={base} stroke={C.line} />
        <text x={W - 40} y={H - 4} textAnchor="end" style={{ ...font, fill: C.muted, fontSize: 10 }}>frecvența centrală (MHz) · lățime ≈22 MHz (DSSS) / 20 MHz (OFDM)</text>
      </svg>
      <div className="controls">
        {Object.entries(PRESETS).map(([k, v]) => <button key={k} className="btn sm" onClick={() => setSel(v)}>{k}</button>)}
        <button className="btn sm ghost" onClick={() => setSel([])}>golește</button>
        <span className="small" style={{ color: overlaps.size ? 'var(--bad)' : 'var(--ok)' }}>
          {sel.length === 0 ? 'Atinge canalele ca să le selectezi.' : overlaps.size ? `Suprapunere: ${[...overlaps].join(', ')} → interferență ACI` : `Fără suprapunere: ${sel.join(', ')}`}
        </span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   3) Canalele din 5 GHz + channel bonding
---------------------------------------------------------------- */
const CH5 = [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 149, 153, 157, 161, 165];
const band5 = (ch: number) => (ch <= 48 ? 'U-NII-1' : ch <= 64 ? 'U-NII-2A' : ch <= 144 ? 'U-NII-2C' : 'U-NII-3');
export function Channels5() {
  const [w, setW] = useState<20 | 40 | 80 | 160>(20);
  const W = 780, cw = 28, gap = 2, y = 70;
  let x = 20; const pos: Record<number, number> = {};
  CH5.forEach((ch, i) => { if (i > 0 && (ch === 100 || ch === 149)) x += 16; pos[ch] = x; x += cw + gap; });
  const groups: number[][] = [];
  const size = w / 20;
  const blocks = [[36, 64], [100, 144], [149, 161]];
  for (const [a, b] of blocks) { const list = CH5.filter((c) => c >= a && c <= b); for (let i = 0; i + size <= list.length; i += size) groups.push(list.slice(i, i + size)); }
  return (
    <>
      <svg viewBox={`0 0 ${W} 200`} role="img" aria-label="Canalele Wi-Fi din banda 5 GHz">
        {CH5.map((ch) => {
          const dfs = ch >= 52 && ch <= 144; const usOnly = ch === 144 || ch >= 149;
          return (
            <g key={ch}>
              <rect x={pos[ch]} y={y} width={cw} height={44} rx={5} fill={dfs ? 'var(--warn-soft)' : 'var(--accent-soft)'} stroke={usOnly ? C.info : 'none'} strokeDasharray={usOnly ? '3 2' : undefined} />
              <text x={pos[ch] + cw / 2} y={y + 27} textAnchor="middle" style={{ ...font, fill: C.text, fontSize: 10.5, fontWeight: 600 }}>{ch}</text>
            </g>
          );
        })}
        {groups.map((g, i) => {
          const a = pos[g[0]], b = pos[g[g.length - 1]] + cw;
          return <rect key={i} x={a} y={y + 52} width={b - a} height={10} rx={5} fill={C.acc} opacity={0.75} />;
        })}
        {['U-NII-1', 'U-NII-2A', 'U-NII-2C', 'U-NII-3'].map((b) => {
          const list = CH5.filter((c) => band5(c) === b); const a = pos[list[0]], e = pos[list[list.length - 1]] + cw;
          return <g key={b}><line x1={a} x2={e} y1={y - 12} y2={y - 12} stroke={C.line} /><text x={(a + e) / 2} y={y - 20} textAnchor="middle" style={{ ...font, fill: C.muted, fontSize: 11 }}>{b}</text></g>;
        })}
        <text x={20} y={175} style={{ ...font, fill: C.muted, fontSize: 11 }}>
          <tspan fill="var(--accent)">■</tspan> fără DFS   <tspan fill="var(--warn)">■</tspan> cu DFS (radar)   <tspan fill="var(--info)">┆</tspan> doar SUA (144, 149–165) · bara = un canal de {w} MHz ({groups.length} canale)
        </text>
      </svg>
      <div className="controls">
        <div className="segmented" role="group" aria-label="Lățime canal">
          {([20, 40, 80, 160] as const).map((v) => <button key={v} className={w === v ? 'on' : ''} onClick={() => setW(v)}>{v} MHz</button>)}
        </div>
        <span className="small muted">Cu cât canalul e mai lat, cu atât rămân mai puține canale independente pentru AP-urile vecine.</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   4) Comportamentele RF
---------------------------------------------------------------- */
export function RFBehaviors() {
  const panels = [
    { t: 'Absorption', d: 'apa, oamenii, betonul „înghit” energia', draw: (
      <g><rect x={95} y={20} width={28} height={80} rx={4} fill="var(--info-soft)" stroke={C.info} />
        <path d="M10 60 H95" stroke={C.acc} strokeWidth={4} /><path d="M123 60 H180" stroke={C.acc} strokeWidth={1.5} strokeDasharray="4 4" /></g>) },
    { t: 'Reflection', d: 'metalul și sticla tratată îl întorc', draw: (
      <g><rect x={150} y={15} width={10} height={90} fill="var(--muted)" />
        <path d="M15 95 L150 50 L20 15" fill="none" stroke={C.acc} strokeWidth={3} markerEnd="url(#rb)" /></g>) },
    { t: 'Refraction', d: 'își schimbă direcția la trecerea prin alt mediu', draw: (
      <g><rect x={80} y={10} width={50} height={100} fill="var(--accent-soft)" />
        <path d="M10 100 L80 60 L130 45 L185 15" fill="none" stroke={C.acc} strokeWidth={3} markerEnd="url(#rb)" /></g>) },
    { t: 'Diffraction', d: 'se curbează în jurul obstacolului → umbră RF', draw: (
      <g><rect x={85} y={45} width={24} height={65} rx={3} fill="var(--muted)" />
        <path d="M10 40 H85 Q 120 40 150 90" fill="none" stroke={C.acc} strokeWidth={3} markerEnd="url(#rb)" />
        <text x={122} y={106} style={{ ...font, fill: C.muted, fontSize: 9 }}>umbră</text></g>) },
    { t: 'Scattering', d: 'suprafețe neregulate îl împrăștie în toate direcțiile', draw: (
      <g>{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={100 + (i % 2) * 8} cy={35 + i * 12} r={4} fill="var(--muted)" />)}
        <path d="M10 60 H95" stroke={C.acc} strokeWidth={3} />
        {[-50, -25, 0, 25, 50].map((a) => <path key={a} d={`M105 60 L ${105 + 70 * Math.cos((a * Math.PI) / 180)} ${60 + 50 * Math.sin((a * Math.PI) / 180)}`} stroke={C.acc} strokeWidth={1.5} markerEnd="url(#rb)" />)}</g>) },
  ];
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
      {panels.map((p) => (
        <div key={p.t} className="card" style={{ padding: 12 }}>
          <svg viewBox="0 0 200 120" role="img" aria-label={p.t}>
            <defs><marker id="rb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill={C.acc} /></marker></defs>
            {p.draw}
          </svg>
          <b style={{ fontSize: '0.9rem' }}>{p.t}</b>
          <div className="small muted">{p.d}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   5) Scala RSSI
---------------------------------------------------------------- */
export function RssiScale() {
  const stops = [
    { v: -30, l: 'excelent (lângă AP)', c: C.ok }, { v: -50, l: 'foarte bun', c: C.ok }, { v: -67, l: 'minim voce/video', c: C.acc },
    { v: -70, l: 'minim date', c: C.warn }, { v: -80, l: 'slab', c: C.bad }, { v: -90, l: 'inutilizabil', c: C.bad },
  ];
  const x = (v: number) => 30 + ((-30 - v) / 65) * 700;
  return (
    <svg viewBox="0 0 760 120" role="img" aria-label="Scala valorilor RSSI">
      <defs><linearGradient id="rs" x1="0" x2="1"><stop offset="0" stopColor="var(--ok)" /><stop offset="0.55" stopColor="var(--warn)" /><stop offset="1" stopColor="var(--bad)" /></linearGradient></defs>
      <rect x={30} y={40} width={700} height={14} rx={7} fill="url(#rs)" opacity={0.85} />
      {stops.map((s, i) => (
        <g key={s.v}>
          <line x1={x(s.v)} x2={x(s.v)} y1={34} y2={60} stroke={C.text} strokeWidth={s.v === -67 ? 2.5 : 1} />
          <text x={x(s.v)} y={26} textAnchor="middle" style={{ ...font, fill: C.text, fontSize: 12, fontWeight: 700 }}>{s.v} dBm</text>
          <text x={x(s.v)} y={i % 2 ? 92 : 78} textAnchor="middle" style={{ ...font, fill: C.muted, fontSize: 11 }}>{s.l}</text>
        </g>
      ))}
    </svg>
  );
}
