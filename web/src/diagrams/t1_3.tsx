import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { RouterIcon, SwitchIcon, ClientIcon } from './wlan';

/* Diagrame originale pentru 1.3 — cabluri și interfețe. Culori DOAR prin var(--...). */
const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: 'JetBrains Mono Variable, monospace' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
function Seg<K extends string>({ value, onChange, items, label }: { value: K; onChange: (k: K) => void; items: [K, string][]; label: string }) {
  return (
    <div className="segmented" role="group" aria-label={label} style={{ marginBottom: 12, flexWrap: 'wrap' }}>
      {items.map(([k, l]) => <button key={k} type="button" className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{l}</button>)}
    </div>
  );
}
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* icoană hub (nu există în wlan.tsx) */
export function HubIcon({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <rect x={x - 30} y={y - 12} width={60} height={24} rx={5} fill="var(--surface-3)" stroke="var(--warn)" strokeWidth={1.6} />
      <path d={`M${x - 18} ${y} h36 M${x - 10} ${y - 6} v12 M${x} ${y - 6} v12 M${x + 10} ${y - 6} v12`} stroke="var(--warn)" strokeWidth={1.4} />
      {label && <T x={x} y={y + 28} weight={650}>{label}</T>}
    </g>
  );
}

/* =====================================================================
   1) Magistrală coaxială vs stea — ce problemă a rezolvat 10BASE-T
   ===================================================================== */
export function BusVsStar() {
  const [v, setV] = useState<'bus' | 'star'>('bus');
  const [fault, setFault] = useState(false);
  const xs = [110, 230, 350, 470, 590];
  const bad = (i: number) => fault && (v === 'bus' || i === 1);
  return (
    <>
      <Seg label="Topologie" value={v} onChange={(k) => { setV(k); }} items={[['bus', '10BASE5 / 10BASE2 — magistrală coaxială'], ['star', '10BASE-T — stea (hub)']]} />
      <svg viewBox="0 0 700 270" role="img" aria-label="Magistrală coaxială comparată cu topologia stea">
        {v === 'bus' ? (
          <g>
            <line x1={50} y1={180} x2={fault ? 285 : 650} y2={180} stroke="var(--text-2)" strokeWidth={5} />
            {fault && <line x1={298} y1={180} x2={650} y2={180} stroke="var(--text-2)" strokeWidth={5} />}
            <rect x={40} y={170} width={12} height={20} rx={2} fill="var(--violet)" /><rect x={648} y={170} width={12} height={20} rx={2} fill="var(--violet)" />
            <T x={46} y={210} size={10} color="var(--muted)">50 Ω</T><T x={654} y={210} size={10} color="var(--muted)">50 Ω</T>
            {xs.map((x, i) => (
              <g key={x}>
                <line x1={x} y1={180} x2={x} y2={118} stroke={bad(i) ? 'var(--bad)' : 'var(--text-2)'} strokeWidth={2} />
                <circle cx={x} cy={180} r={5} fill="var(--surface-3)" stroke="var(--text-2)" />
                <ClientIcon x={x} y={100} kind="pc" />
                <T x={x} y={70} size={11} weight={650} color={bad(i) ? 'var(--bad)' : 'var(--ok)'}>{bad(i) ? '✗ PC' + (i + 1) : 'PC' + (i + 1)}</T>
              </g>
            ))}
            {fault && <><path d="M284 168 l8 12 l-8 12 M299 168 l-8 12 l8 12" stroke="var(--bad)" strokeWidth={2.5} fill="none" /><T x={291} y={235} size={11} color="var(--bad)" weight={650}>cablu întrerupt / terminator lipsă → reflexii → TOT segmentul cade</T></>}
            {!fault && <T x={350} y={235} size={11} color="var(--muted)">un singur cablu comun: toate stațiile în același domeniu de coliziune, half-duplex, CSMA/CD</T>}
          </g>
        ) : (
          <g>
            <HubIcon x={350} y={170} label="hub" />
            {xs.map((x, i) => (
              <g key={x}>
                <line x1={x} y1={118} x2={350} y2={158} stroke={bad(i) ? 'var(--bad)' : 'var(--text-2)'} strokeWidth={2} strokeDasharray={bad(i) ? '6 6' : undefined} />
                <ClientIcon x={x} y={100} kind="pc" />
                <T x={x} y={70} size={11} weight={650} color={bad(i) ? 'var(--bad)' : 'var(--ok)'}>{bad(i) ? '✗ PC' + (i + 1) : 'PC' + (i + 1)}</T>
              </g>
            ))}
            <T x={350} y={235} size={11} color={fault ? 'var(--warn)' : 'var(--muted)'} weight={fault ? 650 : 500}>
              {fault ? 'cablul lui PC2 e defect → doar PC2 pierde legătura; restul lucrează normal' : 'fiecare PC are cablul lui (UTP) până la hub — dar hub-ul e tot un mediu partajat'}
            </T>
          </g>
        )}
        <T x={350} y={262} size={10} color="var(--muted)">{v === 'bus' ? 'conectare: vampire tap (10BASE5) sau T-BNC direct în placă (10BASE2)' : 'cablu torsadat ieftin (Cat3) + RJ-45 · max 100 m de la hub'}</T>
      </svg>
      <div className="controls">
        <button type="button" className={`btn sm ${fault ? 'primary' : ''}`} onClick={() => setFault(!fault)}>{fault ? 'repară cablul' : 'simulează o defecțiune de cablu'}</button>
        <span className="small muted">Compară efectul aceleiași defecțiuni în cele două topologii.</span>
      </div>
    </>
  );
}

/* =====================================================================
   2) Cronologia Ethernet — ce problemă a rezolvat fiecare pas (interactiv)
   ===================================================================== */
type Era = { y: string; n: string; std: string; problem: string; solution: string; limit: string; media: 'coax' | 'cu' | 'fo' | 'mix' };
const ERAS: Era[] = [
  { y: '1983', n: '10BASE5', std: '802.3', media: 'coax', problem: 'Fiecare producător avea propria rețea locală, incompatibilă cu celelalte.', solution: 'Primul Ethernet standardizat IEEE: 10 Mb/s pe coaxial gros (thicknet), segmente de 500 m, până la 100 de stații.', limit: 'Cablu rigid de ≈1 cm, „vampire taps” doar la puncte marcate (la 2.5 m), o singură defecțiune oprea tot segmentul.' },
  { y: '1985', n: '10BASE2', std: '802.3a', media: 'coax', problem: 'Thicknet era scump și greu de instalat.', solution: 'Coaxial subțire (thinnet, RG-58), conectori BNC în T direct pe placa de rețea, segmente de 185 m, max 30 de stații.', limit: 'Tot magistrală: un T scos sau un terminator lipsă oprea toată rețeaua, iar defectul era greu de găsit.' },
  { y: '1990', n: '10BASE-T', std: '802.3i', media: 'cu', problem: 'Magistrala coaxială: un singur defect cădea toată rețeaua.', solution: 'Topologie stea: fiecare PC are cablul lui torsadat (Cat3, ca la telefonie) până la un hub; max 100 m; RJ-45.', limit: 'Hub-ul repetă totul pe toate porturile: tot un singur domeniu de coliziune, half-duplex, 10 Mb/s partajați.' },
  { y: '1995', n: '100BASE-TX', std: '802.3u', media: 'cu', problem: 'Serverele și aplicațiile aveau nevoie de mai mult de 10 Mb/s.', solution: 'Fast Ethernet: 100 Mb/s pe Cat5 (2 perechi), plus autonegocierea, ca porturile noi să lucreze și cu plăcile vechi de 10 Mb/s. Tot atunci: 100BASE-FX pe fibră multimod.', limit: 'Cat5 devine minimul; cu switch-uri apare full-duplex-ul și dispar coliziunile.' },
  { y: '1998', n: '1000BASE-SX / LX', std: '802.3z', media: 'fo', problem: 'Coloanele (backbone) dintre switch-uri deveniseră gâtuiri la 100 Mb/s.', solution: 'Gigabit pe fibră, reutilizând optica Fibre Channel: SX (850 nm, multimod, 220–550 m) și LX (1310 nm, monomod, 5 km).', limit: 'Fibra și modulele optice erau scumpe pentru fiecare birou.' },
  { y: '1999', n: '1000BASE-T', std: '802.3ab', media: 'cu', problem: 'Gigabit până la birou, fără recablare.', solution: '1 Gb/s pe Cat5 existent (Cat5e recomandat), 100 m: toate cele 4 perechi, în ambele sensuri simultan (anularea ecoului), modulație PAM-5.', limit: 'Autonegocierea devine obligatorie; electronica PHY mai complexă.' },
  { y: '2002', n: '10GBASE-SR / LR / ER', std: '802.3ae', media: 'fo', problem: 'Centrele de date și coloanele de campus aveau nevoie de mai mult de 1 Gb/s.', solution: '10 Gb/s doar pe fibră: SR (850 nm MMF, 300 m OM3 / 400 m OM4), LR (1310 nm SMF, 10 km), ER (1550 nm SMF, 40 km).', limit: 'Doar full-duplex: CSMA/CD dispare definitiv de la 10G în sus.' },
  { y: '2006', n: '10GBASE-T', std: '802.3an', media: 'cu', problem: '10G pe fibră era scump pentru servere din același rând de rack-uri.', solution: '10 Gb/s pe cupru: Cat6A la 100 m (Cat6 doar ≈55 m).', limit: 'Consum și latență mai mari decât optica; sensibil la alien crosstalk.' },
  { y: '2010', n: '40G / 100G', std: '802.3ba', media: 'fo', problem: 'Agregarea traficului în centrele de date (spine–leaf) depășea 10G.', solution: 'Mai multe benzi în paralel: 40GBASE-SR4 (4 × 10G pe 8 fibre MPO), 40/100GBASE-LR4 (4 lungimi de undă pe o pereche SMF, 10 km). Module QSFP.', limit: 'Cablare paralelă (MPO) mai complicată; ulterior 100G pe 4 × 25G (802.3bm, 2015).' },
  { y: '2016', n: '2.5/5GBASE-T · 25G · 25/40GBASE-T', std: '802.3bz · by · bq', media: 'mix', problem: 'AP-urile Wi-Fi 5 Wave 2 depășeau 1 Gb/s, dar recablarea la Cat6A era scumpă; serverele voiau mai mult de 10G.', solution: '802.3bz: 2.5/5 Gb/s pe Cat5e/Cat6 existent (100 m). 802.3by: 25G (SFP28). 802.3bq: 25/40GBASE-T pe Cat8, 30 m, în rack.', limit: 'Cat8 doar 30 m; multigigabit cere porturi „mGig” compatibile la ambele capete.' },
];
export function EthernetTimeline() {
  const [i, setI] = useState(2);
  const W = 760, x0 = 40, x1 = W - 40;
  const px = (k: number) => x0 + (k * (x1 - x0)) / (ERAS.length - 1);
  const col = (m: Era['media']) => (m === 'coax' ? 'var(--violet)' : m === 'cu' ? 'var(--warn)' : m === 'fo' ? 'var(--info)' : 'var(--accent)');
  const e = ERAS[i];
  return (
    <>
      <svg viewBox={`0 0 ${W} 150`} role="img" aria-label="Cronologia standardelor Ethernet">
        <line x1={x0} y1={70} x2={x1} y2={70} stroke="var(--border)" strokeWidth={3} />
        {ERAS.map((era, k) => (
          <g key={era.n} style={{ cursor: 'pointer' }} onClick={() => setI(k)} role="button" aria-label={`${era.y} ${era.n}`}>
            <rect x={px(k) - 34} y={k % 2 ? 80 : 6} width={68} height={56} fill="transparent" />
            <circle cx={px(k)} cy={70} r={k === i ? 11 : 7} fill={k === i ? col(era.media) : 'var(--surface-3)'} stroke={col(era.media)} strokeWidth={2.5} />
            <T x={px(k)} y={k % 2 ? 104 : 44} size={12} weight={700} color={k === i ? col(era.media) : 'var(--text)'}>{era.y}</T>
            <T x={px(k)} y={k % 2 ? 120 : 28} size={9.5} color="var(--muted)">{era.n.split(' ')[0]}</T>
          </g>
        ))}
        <g>
          {([['coaxial', 'var(--violet)'], ['cupru torsadat', 'var(--warn)'], ['fibră', 'var(--info)'], ['mixt', 'var(--accent)']] as const).map(([l, c], k) => (
            <g key={l}><circle cx={x0 + 8 + k * 130} cy={142} r={5} fill={c} /><T x={x0 + 18 + k * 130} y={146} size={10} anchor="start" color="var(--muted)">{l}</T></g>
          ))}
        </g>
      </svg>
      <div className="card" style={{ marginTop: 10, borderLeft: `4px solid ${col(e.media)}` }}>
        <div className="row between" style={{ marginBottom: 6 }}>
          <b style={{ fontSize: '1.05rem' }}>{e.n}</b>
          <span className="badge">{e.y} · IEEE {e.std}</span>
        </div>
        <p className="small" style={{ margin: '4px 0' }}><b style={{ color: 'var(--bad)' }}>Problema: </b>{e.problem}</p>
        <p className="small" style={{ margin: '4px 0' }}><b style={{ color: 'var(--ok)' }}>Soluția: </b>{e.solution}</p>
        <p className="small" style={{ margin: '4px 0' }}><b style={{ color: 'var(--warn)' }}>Limita / ce a urmat: </b>{e.limit}</p>
      </div>
      <div className="controls">
        <button type="button" className="btn sm" disabled={i === 0} onClick={() => setI(i - 1)}>← anterior</button>
        <button type="button" className="btn sm" disabled={i === ERAS.length - 1} onClick={() => setI(i + 1)}>următor →</button>
        <span className="small muted">Atinge un punct de pe axă sau folosește butoanele.</span>
      </div>
    </>
  );
}

/* =====================================================================
   3) Torsadarea anulează zgomotul (semnal diferențial)
   ===================================================================== */
const BITS = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0];
export function TwistNoise() {
  const [tw, setTw] = useState<'par' | 'tw'>('tw');
  const N = 300, X0 = 150, X1 = 700;
  const sig = (t: number) => (BITS[Math.min(BITS.length - 1, Math.floor(t * BITS.length))] ? 1 : -1);
  const noise = (t: number) => 1.6 * Math.exp(-((t - 0.45) ** 2) / 0.0012) + 0.9 * Math.exp(-((t - 0.78) ** 2) / 0.0006);
  const kA = tw === 'tw' ? 0.7 : 1.0, kB = tw === 'tw' ? 0.7 : 0.3;
  const path = (f: (t: number) => number, y0: number, amp: number) =>
    Array.from({ length: N + 1 }, (_, k) => { const t = k / N; return `${k ? 'L' : 'M'}${(X0 + t * (X1 - X0)).toFixed(1)} ${(y0 - f(t) * amp).toFixed(1)}`; }).join(' ');
  const rows = [
    { y: 50, label: 'fir + (TX+)', f: (t: number) => sig(t) + kA * noise(t), c: 'var(--warn)' },
    { y: 125, label: 'fir − (TX−)', f: (t: number) => -sig(t) + kB * noise(t), c: 'var(--info)' },
    { y: 215, label: 'receptor: (+) − (−)', f: (t: number) => (2 * sig(t) + (kA - kB) * noise(t)) / 2, c: 'var(--accent)' },
  ];
  return (
    <>
      <Seg label="Tip fire" value={tw} onChange={setTw} items={[['par', 'fire paralele (netorsadate)'], ['tw', 'pereche torsadată']]} />
      <svg viewBox="0 0 720 260" role="img" aria-label="Zgomotul indus pe o pereche de fire și anularea lui">
        <g>
          <rect x={12} y={70} width={70} height={46} rx={8} fill="var(--surface-3)" stroke="var(--bad)" />
          <T x={47} y={90} size={11} weight={650} color="var(--bad)">sursă EMI</T>
          <T x={47} y={106} size={9.5} color="var(--muted)">motor, lift</T>
          <path d="M86 93 q8 -10 16 0 t16 0 t16 0" stroke="var(--bad)" fill="none" strokeWidth={1.6} />
        </g>
        {rows.map((r) => (
          <g key={r.label}>
            <line x1={X0} x2={X1} y1={r.y} y2={r.y} stroke="var(--border)" strokeDasharray="3 4" />
            <path d={path(r.f, r.y, 18)} fill="none" stroke={r.c} strokeWidth={2} />
            <T x={X0 - 6} y={r.y - 22} size={10.5} anchor="start" color="var(--muted)">{r.label}</T>
          </g>
        ))}
        <line x1={X0} x2={X1} y1={170} y2={170} stroke="var(--border)" />
        <T x={425} y={252} size={11} weight={650} color={tw === 'tw' ? 'var(--ok)' : 'var(--bad)'}>
          {tw === 'tw' ? 'Zgomotul afectează ambele fire la fel → la scădere se anulează: semnal curat' : 'Firul mai apropiat de sursă primește mai mult zgomot → diferența rămâne în semnal: erori de bit (CRC)'}
        </T>
      </svg>
    </>
  );
}

/* =====================================================================
   4) RJ-45 — T568A / T568B cu pini colorați (interactiv)
   ===================================================================== */
type Wire = { c: 'or' | 'gr' | 'bl' | 'br'; s: boolean };
const WCOL: Record<Wire['c'], string> = { or: 'var(--warn)', gr: 'var(--ok)', bl: 'var(--info)', br: 'color-mix(in srgb, var(--warn) 55%, var(--muted))' };
const WNAME: Record<Wire['c'], string> = { or: 'portocaliu', gr: 'verde', bl: 'albastru', br: 'maro' };
const T568: Record<'A' | 'B', Wire[]> = {
  B: [{ c: 'or', s: true }, { c: 'or', s: false }, { c: 'gr', s: true }, { c: 'bl', s: false }, { c: 'bl', s: true }, { c: 'gr', s: false }, { c: 'br', s: true }, { c: 'br', s: false }],
  A: [{ c: 'gr', s: true }, { c: 'gr', s: false }, { c: 'or', s: true }, { c: 'bl', s: false }, { c: 'bl', s: true }, { c: 'or', s: false }, { c: 'br', s: true }, { c: 'br', s: false }],
};
const FN100 = ['TX+', 'TX−', 'RX+', '—', '—', 'RX−', '—', '—'];
const FN1000 = ['BI_DA+', 'BI_DA−', 'BI_DB+', 'BI_DC+', 'BI_DC−', 'BI_DB−', 'BI_DD+', 'BI_DD−'];
const wname = (w: Wire) => (w.s ? 'alb-' : '') + WNAME[w.c];
function useStripes() {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '');
  const defs = (
    <defs>
      {(Object.keys(WCOL) as Wire['c'][]).map((c) => (
        <pattern key={c} id={`${raw}-${c}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="var(--surface-3)" />
          <rect width="3.5" height="8" fill={WCOL[c]} />
        </pattern>
      ))}
    </defs>
  );
  const fill = (w: Wire) => (w.s ? `url(#${raw}-${w.c})` : WCOL[w.c]);
  return { defs, fill };
}
export function RJ45Pinout() {
  const [std, setStd] = useState<'A' | 'B'>('B');
  const { defs, fill } = useStripes();
  const wires = T568[std];
  const X = 200, PW = 30;
  return (
    <>
      <Seg label="Standard de terminare" value={std} onChange={setStd} items={[['B', 'T568B (cel mai folosit)'], ['A', 'T568A']]} />
      <svg viewBox="0 0 720 300" role="img" aria-label={`Pinout RJ-45 ${std === 'A' ? 'T568A' : 'T568B'}`}>
        {defs}
        {/* corpul conectorului, văzut cu clema în jos și contactele spre tine */}
        <rect x={X - 20} y={20} width={8 * PW + 40} height={150} rx={10} fill="var(--surface)" stroke="var(--border)" strokeWidth={2} />
        <rect x={X + 70} y={170} width={100} height={22} rx={4} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={X + 120} y={186} size={9.5} color="var(--muted)">clema (în spate, jos)</T>
        {wires.map((w, k) => {
          const x = X + k * PW + 4;
          const swapped = (k === 0 || k === 1 || k === 2 || k === 5);
          return (
            <g key={k}>
              <rect x={x} y={34} width={PW - 8} height={10} rx={2} fill="var(--muted)" opacity={0.65} />
              <rect x={x} y={48} width={PW - 8} height={112} rx={4} fill={fill(w)} stroke={swapped ? 'var(--text)' : 'var(--border)'} strokeWidth={swapped ? 1.4 : 1} />
              <T x={x + (PW - 8) / 2} y={30} size={11} weight={700}>{k + 1}</T>
              <text x={x + (PW - 8) / 2 + 4} y={210} transform={`rotate(-60 ${x + (PW - 8) / 2 + 4} 210)`} textAnchor="end" style={{ ...font, fill: 'var(--text-2)', fontSize: 10.5 }}>{wname(w)}</text>
            </g>
          );
        })}
        {/* legenda perechilor */}
        <g>
          <T x={500} y={44} size={12} weight={700} anchor="start">Perechile ({std === 'B' ? 'T568B' : 'T568A'})</T>
          {[
            ['1-2', wires[0].c], ['3-6', wires[2].c], ['4-5', 'bl'], ['7-8', 'br'],
          ].map(([pins, c], k) => (
            <g key={pins}>
              <rect x={500} y={58 + k * 26} width={18} height={14} rx={3} fill={WCOL[c as Wire['c']]} />
              <T x={526} y={70 + k * 26} size={11} anchor="start" m>{`pinii ${pins}`}</T>
              <T x={600} y={70 + k * 26} size={11} anchor="start" color="var(--muted)">{WNAME[c as Wire['c']]}</T>
            </g>
          ))}
          <T x={500} y={182} size={10.5} anchor="start" color="var(--accent)" weight={650}>A ↔ B: se schimbă doar</T>
          <T x={500} y={197} size={10.5} anchor="start" color="var(--accent)" weight={650}>portocaliul cu verdele</T>
          <T x={500} y={212} size={10} anchor="start" color="var(--muted)">(pinii 1, 2, 3, 6 — conturați)</T>
        </g>
        <T x={360} y={292} size={10.5} color="var(--muted)">Vedere frontală a mufei: contactele spre tine, clema în jos → pinul 1 e în stânga. Firele dungate (alb-x) sunt desenate hașurat.</T>
      </svg>
      <div className="table-wrap" style={{ marginTop: 8 }}><table className="t">
        <thead><tr><th>Pin</th><th>Culoare ({std === 'B' ? 'T568B' : 'T568A'})</th><th>10/100 Mb/s — port MDI (PC)</th><th>1000BASE-T</th></tr></thead>
        <tbody>{wires.map((w, k) => (
          <tr key={k}><td className="hl">{k + 1}</td><td><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, marginRight: 6, verticalAlign: -1, background: w.s ? `repeating-linear-gradient(45deg, ${WCOL[w.c]} 0 3px, var(--surface-3) 3px 6px)` : WCOL[w.c] }} />{wname(w)}</td>
            <td><code>{FN100[k]}</code></td><td><code>{FN1000[k]}</code></td></tr>
        ))}</tbody>
      </table></div>
    </>
  );
}

/* =====================================================================
   5) Cablu straight-through / crossover / rollover — firele capăt la capăt
   ===================================================================== */
type CableKind = 'straight' | 'cross' | 'cross1g' | 'roll';
const MAPS: Record<CableKind, number[]> = {
  straight: [1, 2, 3, 4, 5, 6, 7, 8],
  cross: [3, 6, 1, 4, 5, 2, 7, 8],
  cross1g: [3, 6, 1, 7, 8, 2, 4, 5],
  roll: [8, 7, 6, 5, 4, 3, 2, 1],
};
const CABLE_TXT: Record<CableKind, { title: string; ends: string; use: string }> = {
  straight: { title: 'Straight-through (drept)', ends: 'T568B ↔ T568B (sau A ↔ A)', use: 'Dispozitive diferite: PC/router/AP/server (MDI) ↔ switch/hub (MDI-X). TX-ul PC-ului (1,2) ajunge pe pinii 1,2, unde switch-ul recepționează.' },
  cross: { title: 'Crossover 10/100 (încrucișat)', ends: 'T568A ↔ T568B', use: 'Dispozitive de același tip: switch–switch, hub–hub, switch–hub, PC–PC, router–router, PC–router. Pinii 1,2 (TX) ajung pe 3,6 (RX) la celălalt capăt.' },
  cross1g: { title: 'Crossover complet (gigabit)', ends: 'toate cele 4 perechi încrucișate', use: 'La 1000BASE-T toate perechile transportă date, așa că un crossover „complet” încrucișează și 4-5 ↔ 7-8. În practică, gigabit-ul are aproape întotdeauna Auto-MDIX.' },
  roll: { title: 'Rollover (consolă)', ends: 'ordinea inversată complet: 1↔8 … 8↔1', use: 'Doar pentru consolă: portul serial (DB-9, RS-232) sau USB al PC-ului ↔ portul CONSOLE (RJ-45) al switch-ului/routerului. Nu transportă Ethernet. Terminal: 9600 8N1, fără flow control.' },
};
export function CableWiring() {
  const [k, setK] = useState<CableKind>('straight');
  const { defs, fill } = useStripes();
  const left = T568.B;
  const yp = (p: number) => 40 + (p - 1) * 28;
  const info = CABLE_TXT[k];
  const showTxRx = k !== 'roll';
  return (
    <>
      <Seg label="Tip de cablu" value={k} onChange={setK} items={[['straight', 'Straight-through'], ['cross', 'Crossover 10/100'], ['cross1g', 'Crossover gigabit'], ['roll', 'Rollover (consolă)']]} />
      <svg viewBox="0 0 720 290" role="img" aria-label={`Schema firelor pentru cablul ${info.title}`}>
        {defs}
        <rect x={150} y={22} width={60} height={236} rx={8} fill="var(--surface)" stroke="var(--border)" strokeWidth={2} />
        <rect x={510} y={22} width={60} height={236} rx={8} fill="var(--surface)" stroke="var(--border)" strokeWidth={2} />
        <T x={180} y={276} size={11} weight={650}>capătul 1</T>
        <T x={540} y={276} size={11} weight={650}>capătul 2</T>
        {left.map((w, i) => {
          const p = i + 1, q = MAPS[k][i];
          const changed = p !== q;
          return (
            <g key={p}>
              <path d={`M210 ${yp(p)} C 330 ${yp(p)}, 390 ${yp(q)}, 510 ${yp(q)}`} fill="none" stroke={WCOL[w.c]} strokeWidth={changed ? 4 : 3} strokeDasharray={w.s ? '7 4' : undefined} opacity={changed ? 1 : 0.75} />
              <rect x={166} y={yp(p) - 9} width={28} height={18} rx={3} fill={fill(w)} stroke="var(--border)" />
              <T x={180} y={yp(p) + 4} size={10.5} weight={700} color="var(--text)">{p}</T>
              <rect x={526} y={yp(q) - 9} width={28} height={18} rx={3} fill={fill(w)} stroke="var(--border)" />
              <T x={540} y={yp(q) + 4} size={10.5} weight={700} color="var(--text)">{q}</T>
              {showTxRx && (k === 'cross1g' ? FN1000[i] : FN100[i]) !== '—' && (
                <T x={140} y={yp(p) + 4} size={9.5} anchor="end" color="var(--muted)" m>{k === 'cross1g' ? FN1000[i] : FN100[i]}</T>
              )}
            </g>
          );
        })}
        {showTxRx && k !== 'cross1g' && [1, 2, 3, 6].map((p) => {
          const rightFn = k === 'straight' ? (p <= 2 ? 'RX' : 'TX') : (p <= 2 ? 'TX' : 'RX');
          return <T key={p} x={580} y={yp(p) + 4} size={9.5} anchor="start" color="var(--muted)" m>{`${rightFn}${p === 1 || p === 3 ? '+' : '−'}`}</T>;
        })}
        {k === 'roll' && <><T x={80} y={150} size={11} color="var(--muted)">PC</T><T x={80} y={166} size={10} color="var(--muted)">(prin adaptor DB-9)</T><T x={640} y={150} size={11} color="var(--muted)">port CONSOLE</T></>}
        {showTxRx && k !== 'cross1g' && <>
          <T x={70} y={16} size={10.5} color="var(--muted)">port MDI (PC)</T>
          <T x={640} y={16} size={10.5} color="var(--muted)">{k === 'straight' ? 'port MDI-X (switch)' : 'port MDI (alt PC)'}</T>
        </>}
      </svg>
      <div className="card" style={{ marginTop: 8 }}>
        <b>{info.title}</b> <span className="badge" style={{ marginLeft: 6 }}>{info.ends}</span>
        <p className="small" style={{ margin: '6px 0 0' }}>{info.use}</p>
      </div>
    </>
  );
}

/* =====================================================================
   6) „Ce cablu de cupru folosesc?” — alegere între două dispozitive
   ===================================================================== */
type Dev = 'pc' | 'server' | 'router' | 'firewall' | 'ap' | 'switch' | 'hub';
const DEVS: Record<Dev, { name: string; mdix: boolean }> = {
  pc: { name: 'PC / laptop', mdix: false }, server: { name: 'Server', mdix: false }, router: { name: 'Router', mdix: false },
  firewall: { name: 'Firewall', mdix: false }, ap: { name: 'Access point', mdix: false }, switch: { name: 'Switch', mdix: true }, hub: { name: 'Hub', mdix: true },
};
export function CableChooser() {
  const [a, setA] = useState<Dev>('pc');
  const [b, setB] = useState<Dev>('switch');
  const [console_, setConsole] = useState(false);
  const [auto, setAuto] = useState(false);
  const same = DEVS[a].mdix === DEVS[b].mdix;
  const cable = console_ ? 'Rollover (cablu de consolă)' : same ? 'Crossover' : 'Straight-through';
  const color = console_ ? 'var(--violet)' : same ? 'var(--warn)' : 'var(--ok)';
  const why = console_
    ? 'Accesul la CLI prin portul CONSOLE nu e Ethernet: e o legătură serială. Se folosește cablul rollover (sau un cablu USB de consolă), iar terminalul se setează la 9600 baud, 8 biți, fără paritate, 1 bit de stop.'
    : same
      ? `${DEVS[a].name} și ${DEVS[b].name} sunt porturi de același tip (${DEVS[a].mdix ? 'MDI-X' : 'MDI'}): amândouă transmit pe aceiași pini, deci perechea de emisie trebuie încrucișată spre recepția celuilalt.`
      : `${DEVS[a].mdix ? DEVS[a].name : DEVS[b].name} are port MDI-X (recepționează pe 1,2), iar ${DEVS[a].mdix ? DEVS[b].name : DEVS[a].name} are port MDI (transmite pe 1,2): emisia ajunge direct în recepție.`;
  const sel = (v: Dev, on: (d: Dev) => void, label: string) => (
    <label className="small" style={{ display: 'inline-flex', flexDirection: 'column', gap: 4, minWidth: 140 }}>
      <span className="muted">{label}</span>
      <select value={v} onChange={(e) => on(e.target.value as Dev)} disabled={console_}
        style={{ font: 'inherit', padding: '7px 10px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)' }}>
        {(Object.keys(DEVS) as Dev[]).map((d) => <option key={d} value={d}>{DEVS[d].name} ({DEVS[d].mdix ? 'MDI-X' : 'MDI'})</option>)}
      </select>
    </label>
  );
  return (
    <>
      <div className="row" style={{ gap: 14, alignItems: 'flex-end' }}>
        {sel(a, setA, 'Dispozitivul A')}
        <span style={{ fontSize: 20, color: 'var(--muted)' }}>↔</span>
        {sel(b, setB, 'Dispozitivul B')}
      </div>
      <div className="row" style={{ marginTop: 10, gap: 18 }}>
        <label className="check"><input type="checkbox" checked={console_} onChange={(e) => setConsole(e.target.checked)} />acces de consolă (PC → port CONSOLE)</label>
        <label className="check"><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} disabled={console_} />porturile au Auto-MDIX activ</label>
      </div>
      <svg viewBox="0 0 720 120" role="img" aria-label="Rezultatul alegerii cablului" style={{ marginTop: 10 }}>
        <rect x={40} y={30} width={150} height={56} rx={10} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={115} y={56} weight={650}>{console_ ? 'PC (COM / USB)' : DEVS[a].name}</T>
        <T x={115} y={74} size={10.5} color="var(--muted)" m>{console_ ? 'RS-232' : DEVS[a].mdix ? 'MDI-X · RX 1,2 · TX 3,6' : 'MDI · TX 1,2 · RX 3,6'}</T>
        <rect x={530} y={30} width={150} height={56} rx={10} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={605} y={56} weight={650}>{console_ ? 'Router / switch' : DEVS[b].name}</T>
        <T x={605} y={74} size={10.5} color="var(--muted)" m>{console_ ? 'CONSOLE (RJ-45)' : DEVS[b].mdix ? 'MDI-X · RX 1,2 · TX 3,6' : 'MDI · TX 1,2 · RX 3,6'}</T>
        {!console_ && same && <path d="M190 48 C 300 48, 420 70, 530 70 M190 70 C 300 70, 420 48, 530 48" stroke={color} strokeWidth={3} fill="none" />}
        {!console_ && !same && <path d="M190 48 H530 M190 70 H530" stroke={color} strokeWidth={3} fill="none" />}
        {console_ && <path d="M190 58 H530" stroke={color} strokeWidth={4} strokeDasharray="10 5" fill="none" />}
        <rect x={262} y={2} width={196} height={22} rx={11} fill="var(--surface)" stroke={color} />
        <T x={360} y={17} size={12} weight={700} color={color}>{cable}</T>
        {!console_ && auto && <T x={360} y={110} size={11} color="var(--accent)" weight={650}>cu Auto-MDIX: funcționează și cu straight-through, și cu crossover</T>}
      </svg>
      <p className="small" style={{ margin: '4px 0 0' }}>{why}</p>
      {!console_ && auto && <p className="small muted" style={{ margin: '4px 0 0' }}>Auto-MDIX detectează situația și inversează intern perechile. La examen, dacă enunțul nu pomenește Auto-MDIX, răspunsul este cel „clasic”: <b>{same ? 'crossover' : 'straight-through'}</b>.</p>}
    </>
  );
}

/* =====================================================================
   7) Alege mediul după distanță / mediu / viteză
   ===================================================================== */
export function MediaChooser() {
  const [pos, setPos] = useState(40); // 0..100 → 1 m .. 80 km (logaritmic)
  const [speed, setSpeed] = useState<'1g' | '10g'>('1g');
  const [emi, setEmi] = useState(false);
  const [bld, setBld] = useState(false);
  const d = Math.round(10 ** ((pos / 100) * Math.log10(80000)));
  const fmt = d >= 1000 ? `${(d / 1000).toFixed(d >= 10000 ? 0 : 1)} km` : `${d} m`;
  let medium: string, std: string, why: string, c: string;
  const fiberReason = emi ? 'interferențe electromagnetice puternice' : 'legătură între clădiri (izolare electrică, fără bucle de masă, fără risc de trăsnet pe cupru)';
  if (d <= 100 && !emi && !bld) {
    c = 'var(--warn)'; medium = speed === '1g' ? 'Cupru UTP Cat5e / Cat6' : 'Cupru UTP Cat6A';
    std = speed === '1g' ? '1000BASE-T (RJ-45)' : '10GBASE-T (sau DAC SFP+ dacă e în același rack)';
    why = 'Sub 100 m, în clădire, fără zgomot: cuprul e cel mai ieftin și mai simplu (și poate duce PoE).';
  } else if (d <= (speed === '1g' ? 550 : 400)) {
    c = 'var(--info)'; medium = speed === '1g' ? 'Fibră multimod (MMF) OM2 sau mai bună' : d > 300 ? 'Fibră multimod OM4' : 'Fibră multimod OM3 / OM4';
    std = speed === '1g' ? '1000BASE-SX · 850 nm · SFP + LC' : '10GBASE-SR · 850 nm · SFP+ + LC';
    why = d <= 100 ? `Distanța ar permite cuprul, dar ${fiberReason} → fibră. Multimodul e cea mai ieftină optică.` : 'Peste 100 m cuprul nu mai e o opțiune; la sute de metri, multimodul cu optică VCSEL de 850 nm e suficient și ieftin.';
  } else if (d <= 10000) {
    c = 'var(--accent)'; medium = 'Fibră monomod (SMF) OS1 / OS2';
    std = speed === '1g' ? '1000BASE-LX (5 km) / LX10 (10 km) · 1310 nm' : '10GBASE-LR · 1310 nm · 10 km';
    why = 'Peste limita multimodului: dispersia modală ar „lăți” impulsurile. Monomodul cu laser de 1310 nm merge kilometri.';
  } else if (d <= 40000) {
    c = 'var(--violet)'; medium = 'Fibră monomod (SMF) OS2';
    std = speed === '1g' ? 'module 1G de distanță lungă (ex. „EX”, „ZX”) · 1550 nm — nestandardizate IEEE' : '10GBASE-ER · 1550 nm · 40 km';
    why = 'La zeci de km se folosește 1550 nm, unde atenuarea fibrei e cea mai mică.';
  } else {
    c = 'var(--bad)'; medium = 'Fibră monomod + optică de foarte lungă distanță';
    std = speed === '1g' ? '1000BASE-ZX (≈70 km, 1550 nm) — nestandardizat IEEE' : '10GBASE-ZR (≈80 km) — nestandardizat IEEE; mai departe: DWDM / operator';
    why = 'Peste ≈40 km se ies din standardele IEEE uzuale: module proprietare sau serviciul unui operator.';
  }
  return (
    <>
      <div className="row" style={{ gap: 16 }}>
        <label className="small" style={{ flex: '1 1 260px' }}>
          <span className="muted">Distanța legăturii: </span><b>{fmt}</b>
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} aria-label="Distanța" />
        </label>
        <div className="segmented" role="group" aria-label="Viteza">
          <button type="button" className={speed === '1g' ? 'on' : ''} onClick={() => setSpeed('1g')}>1 Gb/s</button>
          <button type="button" className={speed === '10g' ? 'on' : ''} onClick={() => setSpeed('10g')}>10 Gb/s</button>
        </div>
      </div>
      <div className="row" style={{ marginTop: 8, gap: 18 }}>
        <label className="check"><input type="checkbox" checked={emi} onChange={(e) => setEmi(e.target.checked)} />zgomot electromagnetic puternic (hală, motoare)</label>
        <label className="check"><input type="checkbox" checked={bld} onChange={(e) => setBld(e.target.checked)} />legătură între două clădiri</label>
      </div>
      <div className="row" style={{ marginTop: 6, gap: 6 }}>
        {[['5 m', 15], ['90 m', 41], ['300 m', 52], ['2 km', 69], ['25 km', 90]].map(([l, p]) => <button key={l} type="button" className="btn sm ghost" onClick={() => setPos(p as number)}>{l}</button>)}
      </div>
      <div className="card" style={{ marginTop: 10, borderLeft: `4px solid ${c}` }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: c }}>{medium}</div>
        <div className="small mono" style={{ margin: '4px 0' }}>{std}</div>
        <div className="small">{why}</div>
      </div>
    </>
  );
}

/* =====================================================================
   8) Fibra: SMF vs MMF — traseele luminii și dispersia modală (animat)
   ===================================================================== */
type FMode = 'smf' | 'step' | 'graded';
const FX0 = 170, FX1 = 640, FY = 120;
function rays(m: FMode) {
  // fiecare rază: viteza de avans pe axa x (relativă) + funcția y(x)
  const A = m === 'smf' ? 0 : 30;
  if (m === 'smf') return [{ vx: 1, y: () => FY }];
  if (m === 'step') {
    const tri = (x: number, P: number) => { const u = ((x - FX0) / P) % 1; return 4 * Math.abs(u - 0.5) - 1; };
    const ray = (P: number) => { const tan = (4 * A) / P; return { vx: 1 / Math.sqrt(1 + tan * tan), y: (x: number) => FY + A * tri(x + P / 4, P) }; };
    return [{ vx: 1, y: () => FY }, ray(235), ray(117.5)];
  }
  const sin = (amp: number, P: number, vx: number) => ({ vx, y: (x: number) => FY + amp * Math.sin((2 * Math.PI * (x - FX0)) / P) });
  return [{ vx: 1, y: () => FY }, sin(A * 0.6, 235, 0.985), sin(A * 0.95, 156.7, 0.972)];
}
export function FiberModes() {
  const [m, setM] = useState<FMode>('step');
  const [t, setT] = useState<number | null>(null);
  const raf = useRef<number | undefined>(undefined);
  const R = rays(m);
  const V = 240; // px/s pe axa razei
  const L = FX1 - FX0;
  const arr = R.map((r) => L / (V * r.vx));
  const tEnd = Math.max(...arr) + 0.4;
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);
  const fire = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (reduceMotion()) { setT(tEnd); return; }
    const t0 = performance.now();
    const step = (now: number) => { const s = (now - t0) / 1000; setT(Math.min(s, tEnd)); if (s < tEnd) raf.current = requestAnimationFrame(step); };
    raf.current = requestAnimationFrame(step);
  };
  const change = (k: FMode) => { if (raf.current) cancelAnimationFrame(raf.current); setT(null); setM(k); };
  const core = m === 'smf' ? 4 : 32;
  const coreCol = 'var(--info)';
  const tl = (s: number) => 470 + (s / 3.2) * 230; // axa de timp a receptorului
  return (
    <>
      <Seg label="Tip de fibră" value={m} onChange={change} items={[['smf', 'Single-mode (SMF)'], ['step', 'Multimode step-index'], ['graded', 'Multimode graded-index (OM2–OM5)']]} />
      <svg viewBox="0 0 720 300" role="img" aria-label="Propagarea luminii prin fibră monomod și multimod">
        {/* secțiune transversală */}
        <circle cx={70} cy={FY} r={50} fill="var(--surface-3)" stroke="var(--border)" />
        <circle cx={70} cy={FY} r={m === 'smf' ? 3.6 : 20} fill={coreCol} opacity={0.55} />
        <T x={70} y={FY + 68} size={10.5} color="var(--muted)">{m === 'smf' ? 'miez ≈9 µm / înveliș 125 µm' : 'miez 50 (62.5) µm / 125 µm'}</T>
        <T x={70} y={FY - 60} size={10.5} weight={650}>secțiune</T>
        {/* fibra longitudinal */}
        <rect x={FX0} y={FY - 52} width={L} height={104} rx={8} fill="var(--surface-3)" stroke="var(--border)" />
        <rect x={FX0} y={FY - core} width={L} height={core * 2} fill={coreCol} opacity={m === 'graded' ? 0.18 : 0.28} />
        {m === 'graded' && <rect x={FX0} y={FY - core / 2} width={L} height={core} fill={coreCol} opacity={0.2} />}
        <T x={FX0 + 6} y={FY - 58} size={10} anchor="start" color="var(--muted)">înveliș (cladding)</T>
        <T x={FX1 - 6} y={FY - 58} size={10} anchor="end" color="var(--info)">miez (core)</T>
        {/* sursa și receptorul */}
        <rect x={FX0 - 30} y={FY - 16} width={26} height={32} rx={4} fill="var(--surface)" stroke="var(--warn)" />
        <T x={FX0 - 17} y={FY + 36} size={10} color="var(--warn)">{m === 'smf' ? 'laser' : 'VCSEL'}</T>
        <rect x={FX1 + 4} y={FY - 16} width={26} height={32} rx={4} fill="var(--surface)" stroke="var(--ok)" />
        <T x={FX1 + 17} y={FY + 36} size={10} color="var(--ok)">Rx</T>
        {/* traseele */}
        {R.map((r, k) => (
          <path key={k} d={Array.from({ length: 160 }, (_, i) => { const x = FX0 + (i / 159) * L; return `${i ? 'L' : 'M'}${x.toFixed(1)} ${r.y(x).toFixed(1)}`; }).join(' ')}
            fill="none" stroke="var(--warn)" strokeWidth={1.2} opacity={0.45} />
        ))}
        {/* impulsurile */}
        {t !== null && R.map((r, k) => {
          const x = Math.min(FX1, FX0 + V * r.vx * t);
          return <circle key={k} cx={x} cy={r.y(x)} r={6} fill="var(--warn)" stroke="var(--surface)" strokeWidth={1.5} />;
        })}
        {/* axa de timp la recepție */}
        <T x={360} y={212} size={11} weight={650}>Impulsul la intrare</T>
        <T x={585} y={212} size={11} weight={650}>Impulsul la ieșire (Rx)</T>
        <line x1={250} x2={460} y1={262} y2={262} stroke="var(--border)" />
        <rect x={340} y={232} width={18} height={30} fill="var(--warn)" opacity={0.8} />
        <line x1={470} x2={705} y1={262} y2={262} stroke="var(--border)" />
        {R.map((_, k) => {
          const arrived = t !== null && t >= arr[k];
          return arrived ? <rect key={k} x={tl(arr[k] - 1.6)} y={232} width={10} height={30} fill="var(--ok)" opacity={0.85} /> : null;
        })}
        {t !== null && t >= tEnd - 0.01 && R.length > 1 && (
          <g>
            <line x1={tl(arr[0] - 1.6)} x2={tl(Math.max(...arr) - 1.6) + 10} y1={276} y2={276} stroke="var(--bad)" strokeWidth={2} />
            <T x={(tl(arr[0] - 1.6) + tl(Math.max(...arr) - 1.6) + 10) / 2} y={292} size={10.5} color="var(--bad)" weight={650}>{m === 'step' ? 'impuls lățit puternic' : 'lățire mică'}</T>
          </g>
        )}
        {t !== null && t >= tEnd - 0.01 && R.length === 1 && <T x={585} y={290} size={10.5} color="var(--ok)" weight={650}>impuls la fel de „ascuțit”</T>}
        <T x={250} y={290} size={9.5} anchor="start" color="var(--muted)">timp →</T>
      </svg>
      <div className="controls">
        <button type="button" className="btn sm primary" onClick={fire}>trimite un impuls de lumină</button>
        <span className="small muted">
          {m === 'smf' ? 'Un singur mod: toată lumina ajunge în același timp → kilometri.' : m === 'step' ? 'Razele care ricoșează parcurg drum mai lung și ajung mai târziu (dispersie modală, exagerată aici ca să se vadă).' : 'Indicele de refracție scade spre margine: razele „lungi” merg prin sticlă mai rapidă → ajung aproape odată.'}
        </span>
      </div>
    </>
  );
}

/* =====================================================================
   9) Conectori de fibră + modul SFP (schematic)
   ===================================================================== */
export function FiberConnectors() {
  return (
    <svg viewBox="0 0 720 230" role="img" aria-label="Conectori de fibră LC, SC, ST, MPO și modul SFP">
      {/* LC duplex */}
      <g>
        <rect x={30} y={60} width={34} height={70} rx={5} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.6} />
        <rect x={70} y={60} width={34} height={70} rx={5} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.6} />
        <circle cx={47} cy={70} r={4} fill="var(--text)" /><circle cx={87} cy={70} r={4} fill="var(--text)" />
        <path d="M40 130 v18 h14 v-18 M80 130 v18 h14 v-18" stroke="var(--info)" fill="none" />
        <path d="M47 108 l-8 18 M87 108 l-8 18" stroke="var(--info)" strokeWidth={2} />
        <T x={67} y={176} weight={700}>LC duplex</T>
        <T x={67} y={192} size={10} color="var(--muted)">ferulă 1.25 mm · clemă</T>
        <T x={67} y={206} size={10} color="var(--muted)">SFP / SFP+ — cel mai comun</T>
      </g>
      {/* SC */}
      <g>
        <rect x={170} y={55} width={60} height={80} rx={4} fill="var(--surface-3)" stroke="var(--violet)" strokeWidth={1.6} />
        <circle cx={200} cy={68} r={5} fill="var(--text)" />
        <rect x={180} y={80} width={40} height={45} rx={3} fill="none" stroke="var(--violet)" />
        <T x={200} y={176} weight={700}>SC</T>
        <T x={200} y={192} size={10} color="var(--muted)">ferulă 2.5 mm · push-pull</T>
        <T x={200} y={206} size={10} color="var(--muted)">pătrat; GBIC, operatori</T>
      </g>
      {/* ST */}
      <g>
        <circle cx={330} cy={95} r={34} fill="var(--surface-3)" stroke="var(--warn)" strokeWidth={1.6} />
        <circle cx={330} cy={95} r={14} fill="none" stroke="var(--warn)" />
        <circle cx={330} cy={95} r={5} fill="var(--text)" />
        <path d="M296 95 h-10 M364 95 h10" stroke="var(--warn)" strokeWidth={3} />
        <T x={330} y={176} weight={700}>ST</T>
        <T x={330} y={192} size={10} color="var(--muted)">ferulă 2.5 mm · baionetă</T>
        <T x={330} y={206} size={10} color="var(--muted)">rotund; instalații vechi</T>
      </g>
      {/* MPO */}
      <g>
        <rect x={420} y={70} width={110} height={50} rx={5} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={1.6} />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={433 + i * 7.6} cy={95} r={2.6} fill="var(--text)" />)}
        <circle cx={426} cy={80} r={2} fill="var(--muted)" /><circle cx={524} cy={80} r={2} fill="var(--muted)" />
        <T x={475} y={176} weight={700}>MPO / MTP</T>
        <T x={475} y={192} size={10} color="var(--muted)">8–24 fibre într-o panglică</T>
        <T x={475} y={206} size={10} color="var(--muted)">40/100G SR4 (QSFP)</T>
      </g>
      {/* SFP */}
      <g>
        <rect x={580} y={60} width={110} height={60} rx={4} fill="var(--surface-3)" stroke="var(--text-2)" strokeWidth={1.6} />
        <rect x={596} y={74} width={30} height={32} rx={3} fill="var(--surface)" stroke="var(--info)" />
        <rect x={644} y={74} width={30} height={32} rx={3} fill="var(--surface)" stroke="var(--info)" />
        <T x={611} y={94} size={10.5} weight={700} color="var(--warn)">TX</T>
        <T x={659} y={94} size={10.5} weight={700} color="var(--ok)">RX</T>
        <path d="M580 120 h110" stroke="var(--violet)" strokeWidth={4} />
        <T x={635} y={135} size={9.5} color="var(--muted)">mâner (bail) colorat</T>
        <T x={635} y={176} weight={700}>modul SFP / SFP+</T>
        <T x={635} y={192} size={10} color="var(--muted)">2 porturi LC: TX + RX</T>
        <T x={635} y={206} size={10} color="var(--muted)">hot-swap în slotul switch-ului</T>
      </g>
      <T x={360} y={24} size={11} color="var(--muted)">Desene schematice (vedere frontală, fără scară)</T>
    </svg>
  );
}

/* =====================================================================
   10) Polaritatea Tx/Rx pe fibra duplex + BiDi
   ===================================================================== */
export function TxRxPolarity() {
  const [v, setV] = useState<'ok' | 'swap' | 'bidi'>('ok');
  const sw = (x: number, label: string) => (
    <g>
      <rect x={x - 70} y={70} width={140} height={90} rx={10} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.5} />
      <T x={x} y={92} weight={650}>{label}</T>
      {v !== 'bidi' ? <>
        <rect x={x - 40} y={104} width={34} height={40} rx={3} fill="var(--surface)" stroke="var(--warn)" />
        <rect x={x + 6} y={104} width={34} height={40} rx={3} fill="var(--surface)" stroke="var(--ok)" />
        <T x={x - 23} y={129} size={11} weight={700} color="var(--warn)">TX</T>
        <T x={x + 23} y={129} size={11} weight={700} color="var(--ok)">RX</T>
      </> : <>
        <rect x={x - 17} y={104} width={34} height={40} rx={3} fill="var(--surface)" stroke="var(--accent)" />
        <T x={x} y={129} size={10} weight={700} color="var(--accent)">TX/RX</T>
      </>}
    </g>
  );
  const L = 160, R = 560;
  return (
    <>
      <Seg label="Scenariu" value={v} onChange={setV} items={[['ok', 'duplex corect (A → B)'], ['swap', 'fibre inversate'], ['bidi', 'BiDi — o singură fibră']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Polaritatea fibrelor TX și RX">
        {sw(L, 'SW1 (modul SFP)')}{sw(R, 'SW2 (modul SFP)')}
        {v === 'ok' && <>
          <path d={`M${L - 23} 144 C ${L - 23} 200, ${R + 23} 200, ${R + 23} 144`} stroke="var(--warn)" strokeWidth={3} fill="none" />
          <path d={`M${R - 23} 144 C ${R - 23} 185, ${L + 23} 185, ${L + 23} 144`} stroke="var(--info)" strokeWidth={3} fill="none" />
          <T x={360} y={50} weight={650} color="var(--ok)">TX-ul fiecărui capăt ajunge în RX-ul celuilalt → link up</T>
          <T x={360} y={222} size={10.5} color="var(--muted)">un patch cord duplex LC „A-la-B” încrucișează fibrele</T>
        </>}
        {v === 'swap' && <>
          <path d={`M${L - 23} 144 C ${L - 23} 200, ${R - 23} 200, ${R - 23} 144`} stroke="var(--bad)" strokeWidth={3} fill="none" />
          <path d={`M${L + 23} 144 C ${L + 23} 180, ${R + 23} 180, ${R + 23} 144`} stroke="var(--bad)" strokeWidth={3} fill="none" strokeDasharray="6 5" />
          <T x={360} y={50} weight={650} color="var(--bad)">TX ↔ TX și RX ↔ RX: nimeni nu primește lumină → down/down</T>
          <T x={360} y={222} size={10.5} color="var(--muted)">remediere: inversezi cele două fibre la un singur capăt (clip-ul duplex LC se poate desface)</T>
        </>}
        {v === 'bidi' && <>
          <line x1={L} y1={144} x2={L} y2={196} stroke="var(--accent)" strokeWidth={3} />
          <line x1={R} y1={144} x2={R} y2={196} stroke="var(--accent)" strokeWidth={3} />
          <line x1={L} y1={196} x2={R} y2={196} stroke="var(--accent)" strokeWidth={3} />
          <path d="M300 186 h60 l-8 -5 M360 186 l-8 5" stroke="var(--warn)" strokeWidth={2} fill="none" />
          <T x={330} y={180} size={10.5} color="var(--warn)" weight={650}>λ1 = 1310 nm →</T>
          <path d="M440 206 h-60 l8 -5 M380 206 l8 5" stroke="var(--violet)" strokeWidth={2} fill="none" />
          <T x={410} y={222} size={10.5} color="var(--violet)" weight={650}>← λ2 = 1490 nm</T>
          <T x={360} y={50} weight={650} color="var(--accent)">O singură fibră, două „culori” de lumină, câte una pe sens</T>
          <T x={360} y={66} size={10.5} color="var(--muted)">modulele se montează în pereche complementară (ex. 1000BASE-BX10-U ↔ BX10-D, 10 km)</T>
        </>}
      </svg>
    </>
  );
}

/* =====================================================================
   11) Domenii de coliziune și de broadcast (interactiv)
   ===================================================================== */
type DNode = { id: string; x: number; y: number; k: 'pc' | 'sw' | 'hub' | 'r'; l: string };
type DScene = { nodes: DNode[]; links: [string, string, number][]; bds: { x: number; y: number; w: number; h: number }[]; uni: string[]; bc: string[]; note: string; uniNote: string };
const CD_COL = ['var(--accent)', 'var(--info)', 'var(--violet)', 'var(--warn)', 'var(--ok)', 'var(--bad)', 'var(--text-2)'];
const SCENES: Record<'hub' | 'switch' | 'mixed' | 'router', DScene> = {
  hub: {
    nodes: [{ id: 'H', x: 360, y: 130, k: 'hub', l: 'hub' }, { id: 'P1', x: 150, y: 60, k: 'pc', l: 'PC1' }, { id: 'P2', x: 570, y: 60, k: 'pc', l: 'PC2' }, { id: 'P3', x: 150, y: 210, k: 'pc', l: 'PC3' }, { id: 'P4', x: 570, y: 210, k: 'pc', l: 'PC4' }],
    links: [['P1', 'H', 0], ['P2', 'H', 0], ['P3', 'H', 0], ['P4', 'H', 0]],
    bds: [{ x: 90, y: 18, w: 540, h: 236 }], uni: ['P1-H', 'P2-H', 'P3-H', 'P4-H'], bc: ['P1-H', 'P2-H', 'P3-H', 'P4-H'],
    note: 'Hub-ul (L1) repetă bit cu bit pe toate porturile: 4 dispozitive, 1 domeniu de coliziune, 1 de broadcast, half-duplex.',
    uniNote: 'Unicast PC1 → PC3: hub-ul îl trimite oricum la TOȚI. PC2 și PC4 îl primesc și îl aruncă (MAC-ul nu e al lor).',
  },
  switch: {
    nodes: [{ id: 'S', x: 360, y: 130, k: 'sw', l: 'switch' }, { id: 'P1', x: 150, y: 60, k: 'pc', l: 'PC1' }, { id: 'P2', x: 570, y: 60, k: 'pc', l: 'PC2' }, { id: 'P3', x: 150, y: 210, k: 'pc', l: 'PC3' }, { id: 'P4', x: 570, y: 210, k: 'pc', l: 'PC4' }],
    links: [['P1', 'S', 0], ['P2', 'S', 1], ['P3', 'S', 2], ['P4', 'S', 3]],
    bds: [{ x: 90, y: 18, w: 540, h: 236 }], uni: ['P1-S', 'P3-S'], bc: ['P1-S', 'P2-S', 'P3-S', 'P4-S'],
    note: 'Switch-ul (L2): fiecare port = un domeniu de coliziune separat (4), dar broadcast-ul trece peste tot: 1 domeniu de broadcast.',
    uniNote: 'Unicast PC1 → PC3: switch-ul știe pe ce port e MAC-ul lui PC3 (tabela MAC) și trimite cadrul doar acolo.',
  },
  mixed: {
    nodes: [{ id: 'S', x: 260, y: 130, k: 'sw', l: 'switch' }, { id: 'H', x: 520, y: 130, k: 'hub', l: 'hub' }, { id: 'P1', x: 110, y: 55, k: 'pc', l: 'PC1' }, { id: 'P2', x: 110, y: 215, k: 'pc', l: 'PC2' }, { id: 'P3', x: 260, y: 230, k: 'pc', l: 'PC3' }, { id: 'P4', x: 640, y: 55, k: 'pc', l: 'PC4' }, { id: 'P5', x: 640, y: 215, k: 'pc', l: 'PC5' }],
    links: [['P1', 'S', 0], ['P2', 'S', 1], ['P3', 'S', 2], ['S', 'H', 3], ['H', 'P4', 3], ['H', 'P5', 3]],
    bds: [{ x: 60, y: 14, w: 630, h: 244 }], uni: ['P1-S', 'S-H', 'H-P4', 'H-P5'], bc: ['P1-S', 'P2-S', 'P3-S', 'S-H', 'H-P4', 'H-P5'],
    note: 'Tot ce stă în spatele hub-ului (switch↔hub + PC4 + PC5) e UN singur domeniu de coliziune. Total: 4 domenii de coliziune, 1 de broadcast.',
    uniNote: 'Unicast PC1 → PC4: switch-ul îl trimite pe portul spre hub, iar hub-ul îl repetă și către PC5.',
  },
  router: {
    nodes: [{ id: 'R', x: 360, y: 46, k: 'r', l: 'router' }, { id: 'S1', x: 200, y: 140, k: 'sw', l: 'SW1' }, { id: 'S2', x: 520, y: 140, k: 'sw', l: 'SW2' }, { id: 'P1', x: 110, y: 225, k: 'pc', l: 'PC1' }, { id: 'P2', x: 270, y: 225, k: 'pc', l: 'PC2' }, { id: 'P3', x: 450, y: 225, k: 'pc', l: 'PC3' }, { id: 'P4', x: 610, y: 225, k: 'pc', l: 'PC4' }],
    links: [['R', 'S1', 0], ['R', 'S2', 1], ['S1', 'P1', 2], ['S1', 'P2', 3], ['S2', 'P3', 4], ['S2', 'P4', 5]],
    bds: [{ x: 60, y: 96, w: 280, h: 164 }, { x: 380, y: 96, w: 280, h: 164 }], uni: ['S1-P1', 'R-S1', 'R-S2', 'S2-P3'], bc: ['S1-P1', 'S1-P2', 'R-S1'],
    note: 'Routerul (L3) oprește broadcast-urile: fiecare interfață = un domeniu de broadcast. Total: 6 domenii de coliziune (6 legături), 2 de broadcast.',
    uniNote: 'Unicast PC1 → PC3 (altă rețea): cadrul merge la router (default gateway), care îl rutează spre SW2 și PC3.',
  },
};
export function DomainsDiagram() {
  const [sc, setSc] = useState<keyof typeof SCENES>('hub');
  const [send, setSend] = useState<'none' | 'uni' | 'bc'>('none');
  const S = SCENES[sc];
  const pos = Object.fromEntries(S.nodes.map((n) => [n.id, n]));
  const cdCount = new Set(S.links.map((l) => l[2])).size;
  const active = send === 'uni' ? S.uni : send === 'bc' ? S.bc : [];
  const isActive = (a: string, b: string) => active.includes(`${a}-${b}`) || active.includes(`${b}-${a}`);
  return (
    <>
      <Seg label="Scenariu" value={sc} onChange={(k) => { setSc(k); setSend('none'); }} items={[['hub', 'Hub'], ['switch', 'Switch'], ['mixed', 'Switch + hub'], ['router', 'Router + 2 switch-uri']]} />
      <svg viewBox="0 0 720 268" role="img" aria-label="Domenii de coliziune și de broadcast">
        {S.bds.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={18} fill="none" stroke="var(--muted)" strokeWidth={1.6} strokeDasharray="8 6" />)}
        {S.links.map(([a, b, cd]) => <line key={`h${a}${b}`} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke={CD_COL[cd]} strokeWidth={30} strokeLinecap="round" opacity={0.16} />)}
        {S.links.map(([a, b, cd]) => <line key={`l${a}${b}`} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke={isActive(a, b) ? 'var(--accent)' : CD_COL[cd]} strokeWidth={isActive(a, b) ? 4.5 : 2} strokeDasharray={isActive(a, b) ? '10 6' : undefined}>
          {isActive(a, b) && !reduceMotion() && <animate attributeName="stroke-dashoffset" from="32" to="0" dur="0.6s" repeatCount="indefinite" />}
        </line>)}
        {S.nodes.map((n) => n.k === 'pc' ? <ClientIcon key={n.id} x={n.x} y={n.y} kind="pc" label={n.l} />
          : n.k === 'sw' ? <SwitchIcon key={n.id} x={n.x} y={n.y} label={n.l} />
            : n.k === 'hub' ? <HubIcon key={n.id} x={n.x} y={n.y} label={n.l} />
              : <RouterIcon key={n.id} x={n.x} y={n.y} label="" />)}
        {sc === 'router' && <T x={410} y={36} size={11} anchor="start" weight={650}>router</T>}
      </svg>
      <div className="row" style={{ gap: 8, marginTop: 6 }}>
        <span className="badge accent">domenii de coliziune: {cdCount}</span>
        <span className="badge">domenii de broadcast: {S.bds.length}</span>
        <span className="small muted">zona colorată = domeniu de coliziune · dreptunghi punctat = domeniu de broadcast</span>
      </div>
      <p className="small" style={{ margin: '8px 0 4px' }}>{send === 'uni' ? S.uniNote : send === 'bc' ? 'Broadcast de la PC1 (de exemplu un ARP request): ajunge la toți cei din domeniul lui de broadcast, dar NU trece de router.' : S.note}</p>
      <div className="controls">
        <button type="button" className={`btn sm ${send === 'uni' ? 'primary' : ''}`} onClick={() => setSend(send === 'uni' ? 'none' : 'uni')}>trimite unicast</button>
        <button type="button" className={`btn sm ${send === 'bc' ? 'primary' : ''}`} onClick={() => setSend(send === 'bc' ? 'none' : 'bc')}>trimite broadcast</button>
      </div>
    </>
  );
}

/* =====================================================================
   12) CSMA/CD pas cu pas
   ===================================================================== */
const CSMA_STEPS = [
  { t: '1 · Carrier sense', d: 'A și C vor să transmită. Fiecare „ascultă” mai întâi cablul: nu e semnal (purtătoare) → mediul pare liber.' },
  { t: '2 · Transmit', d: 'Amândouă încep să transmită aproape simultan. Semnalele au nevoie de timp ca să parcurgă cablul, deci niciuna nu-l vede încă pe celălalt.' },
  { t: '3 · Collision detection', d: 'Semnalele se întâlnesc și se suprapun electric: coliziune. Fiecare stație detectează, cât încă transmite, că pe cablu e altceva decât trimite ea.' },
  { t: '4 · Jam signal', d: 'Stațiile opresc cadrul și trimit un semnal de „bruiaj” (jam, 32 de biți), ca toți de pe segment să știe sigur că a fost o coliziune.' },
  { t: '5 · Backoff aleatoriu', d: 'Fiecare așteaptă un număr aleatoriu de „slot times” (512 biți). A alege 1 slot, C alege 3. La fiecare coliziune nouă intervalul posibil se dublează (exponential backoff).' },
  { t: '6 · Retransmisie', d: 'A termină prima așteptarea, ascultă, mediul e liber și retransmite. Când C termină, aude transmisia lui A și amână (deferred). După 16 încercări eșuate, cadrul e abandonat.' },
];
export function CsmaCdSteps() {
  const [s, setS] = useState(0);
  const X = [110, 360, 610];
  const sig = (from: number, to: number, c: string) => <line x1={from} y1={120} x2={to} y2={120} stroke={c} strokeWidth={9} strokeLinecap="round" opacity={0.6} />;
  return (
    <>
      <svg viewBox="0 0 720 220" role="img" aria-label="CSMA/CD pas cu pas">
        <line x1={50} y1={120} x2={670} y2={120} stroke="var(--text-2)" strokeWidth={4} />
        {['A', 'B', 'C'].map((n, i) => (
          <g key={n}>
            <line x1={X[i]} y1={120} x2={X[i]} y2={78} stroke="var(--text-2)" strokeWidth={2} />
            <ClientIcon x={X[i]} y={62} kind="pc" />
            <T x={X[i]} y={30} weight={700}>{n}</T>
          </g>
        ))}
        {s === 0 && <><T x={X[0]} y={160} size={11} color="var(--info)">👂 liber?</T><T x={X[2]} y={160} size={11} color="var(--info)">👂 liber?</T></>}
        {s === 1 && <>{sig(X[0], 230, 'var(--warn)')}{sig(490, X[2], 'var(--violet)')}<T x={360} y={160} size={11} color="var(--muted)">semnalele se propagă unul spre celălalt</T></>}
        {s === 2 && <>{sig(X[0], 360, 'var(--warn)')}{sig(360, X[2], 'var(--violet)')}<path d="M345 100 l10 12 l-14 4 l18 6 l-8 10 l16 -4" stroke="var(--bad)" strokeWidth={2.5} fill="none" /><T x={360} y={160} size={12} weight={700} color="var(--bad)">COLIZIUNE</T></>}
        {s === 3 && <>{sig(60, 660, 'var(--bad)')}<T x={360} y={160} size={11} weight={650} color="var(--bad)">jam signal — toți află de coliziune</T></>}
        {s === 4 && <><T x={X[0]} y={160} size={11} color="var(--warn)">⏱ 1 slot</T><T x={X[2]} y={160} size={11} color="var(--violet)">⏱ 3 sloturi</T><T x={360} y={190} size={10.5} color="var(--muted)">slot time = 512 bit times (51.2 µs la 10 Mb/s)</T></>}
        {s === 5 && <>{sig(X[0], 660, 'var(--warn)')}{sig(60, X[0], 'var(--warn)')}<T x={X[0]} y={160} size={11} color="var(--ok)">✓ retransmite</T><T x={X[2]} y={160} size={11} color="var(--muted)">ocupat → amână</T></>}
      </svg>
      <div className="card" style={{ marginTop: 8 }}>
        <b>{CSMA_STEPS[s].t}</b>
        <p className="small" style={{ margin: '6px 0 0' }}>{CSMA_STEPS[s].d}</p>
      </div>
      <div className="controls">
        <button type="button" className="btn sm" disabled={s === 0} onClick={() => setS(s - 1)}>← înapoi</button>
        <button type="button" className="btn sm primary" disabled={s === CSMA_STEPS.length - 1} onClick={() => setS(s + 1)}>pasul următor →</button>
        <button type="button" className="btn sm ghost" onClick={() => setS(0)}>de la capăt</button>
        <span className="small muted">pas {s + 1} / {CSMA_STEPS.length}</span>
      </div>
    </>
  );
}

/* =====================================================================
   13) Half vs full duplex (static)
   ===================================================================== */
export function DuplexCompare() {
  return (
    <svg viewBox="0 0 720 210" role="img" aria-label="Half-duplex comparat cu full-duplex">
      <T x={180} y={22} weight={700}>Half-duplex (hub, coaxial)</T>
      <ClientIcon x={60} y={95} kind="pc" label="A" /><ClientIcon x={300} y={95} kind="pc" label="B" />
      <line x1={80} y1={95} x2={280} y2={95} stroke="var(--text-2)" strokeWidth={3} />
      <path d="M110 80 h120 l-8 -5 M230 80 l-8 5" stroke="var(--ok)" strokeWidth={2.5} fill="none" />
      <path d="M250 112 h-120 l8 -5 M130 112 l8 5" stroke="var(--muted)" strokeWidth={2} fill="none" strokeDasharray="4 4" />
      <T x={180} y={140} size={10.5} color="var(--muted)">un singur sens la un moment dat;</T>
      <T x={180} y={155} size={10.5} color="var(--muted)">B așteaptă; dacă vorbesc amândoi → coliziune</T>
      <T x={180} y={185} size={11} weight={650} color="var(--warn)">CSMA/CD activ</T>
      <line x1={360} y1={20} x2={360} y2={195} stroke="var(--border)" />
      <T x={540} y={22} weight={700}>Full-duplex (port de switch, punct-la-punct)</T>
      <ClientIcon x={420} y={95} kind="pc" label="A" /><SwitchIcon x={650} y={95} label="" />
      <line x1={440} y1={86} x2={618} y2={86} stroke="var(--warn)" strokeWidth={3} />
      <line x1={440} y1={104} x2={618} y2={104} stroke="var(--info)" strokeWidth={3} />
      <path d="M480 76 h80 l-8 -5 M560 76 l-8 5" stroke="var(--warn)" strokeWidth={2.5} fill="none" />
      <path d="M580 114 h-80 l8 -5 M500 114 l8 5" stroke="var(--info)" strokeWidth={2.5} fill="none" />
      <T x={540} y={140} size={10.5} color="var(--muted)">căi separate de emisie și recepție:</T>
      <T x={540} y={155} size={10.5} color="var(--muted)">ambele sensuri simultan, fără coliziuni</T>
      <T x={540} y={185} size={11} weight={650} color="var(--ok)">CSMA/CD dezactivat · 1 Gb/s în fiecare sens</T>
    </svg>
  );
}

/* =====================================================================
   14) Topologii de laborator
   ===================================================================== */
const Link = ({ x1, y1, x2, y2, kind, label }: { x1: number; y1: number; x2: number; y2: number; kind: 'st' | 'cr' | 'con' | 'fo' | 'ser'; label?: string }) => {
  const c = kind === 'st' ? 'var(--text-2)' : kind === 'cr' ? 'var(--warn)' : kind === 'con' ? 'var(--info)' : kind === 'fo' ? 'var(--accent)' : 'var(--bad)';
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={kind === 'fo' ? 3 : 2.2} strokeDasharray={kind === 'cr' ? '9 5' : kind === 'con' ? '3 4' : undefined} />
      {label && <T x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} size={9.5} color="var(--muted)">{label}</T>}
    </g>
  );
};
const Legend = ({ y }: { y: number }) => (
  <g>
    {([['st', 'straight-through'], ['cr', 'crossover'], ['con', 'console'], ['fo', 'fibră']] as const).map(([k, l], i) => (
      <g key={k}><Link x1={40 + i * 170} y1={y} x2={80 + i * 170} y2={y} kind={k} /><T x={88 + i * 170} y={y + 4} size={10} anchor="start" color="var(--muted)">{l}</T></g>
    ))}
  </g>
);
export function LabCablingTopology() {
  return (
    <svg viewBox="0 0 760 340" role="img" aria-label="Topologia labului ghidat de cablare">
      <Link x1={210} y1={60} x2={210} y2={150} kind="st" label="Gi0/0 ↔ Fa0/1" />
      <Link x1={180} y1={52} x2={80} y2={52} kind="cr" label="Gi0/1" />
      <Link x1={210} y1={36} x2={330} y2={20} kind="con" />
      <Link x1={242} y1={162} x2={388} y2={162} kind="cr" label="Gi0/1 ↔ Gi0/1" />
      <Link x1={210} y1={174} x2={210} y2={240} kind="st" label="Fa0/2" />
      <Link x1={420} y1={174} x2={420} y2={240} kind="st" label="Fa0/1" />
      <RouterIcon x={210} y={50} label="" />
      <T x={250} y={80} size={11} anchor="start" weight={650}>R1 (ISR 1941)</T>
      <ClientIcon x={60} y={52} kind="pc" label="PC1" />
      <ClientIcon x={350} y={18} label="" /><T x={372} y={22} size={10.5} anchor="start" color="var(--muted)">Admin (RS-232 → Console)</T>
      <SwitchIcon x={210} y={162} label="" /><T x={150} y={200} size={11} anchor="end" weight={650}>SW1 (2960)</T>
      <SwitchIcon x={420} y={162} label="" /><T x={460} y={200} size={11} anchor="start" weight={650}>SW2 (2960)</T>
      <ClientIcon x={210} y={256} kind="pc" label="PC0" />
      <ClientIcon x={420} y={256} kind="pc" label="PC2" />
      {/* partea de fibră */}
      <rect x={530} y={110} width={215} height={175} rx={14} fill="none" stroke="var(--border)" strokeDasharray="5 5" />
      <T x={637} y={128} size={10.5} color="var(--muted)">partea a 2-a: fibra</T>
      <Link x1={580} y1={170} x2={700} y2={170} kind="fo" label="fibră (module 1FGE)" />
      <SwitchIcon x={580} y={170} label="" /><SwitchIcon x={700} y={170} label="" />
      <T x={580} y={205} size={10.5} weight={650}>SW-F1</T><T x={700} y={205} size={10.5} weight={650}>SW-F2</T>
      <Link x1={580} y1={182} x2={580} y2={238} kind="st" /><Link x1={700} y1={182} x2={700} y2={238} kind="st" />
      <ClientIcon x={580} y={254} kind="pc" label="PC-F1" /><ClientIcon x={700} y={254} kind="pc" label="PC-F2" />
      <Legend y={320} />
    </svg>
  );
}
export function LabSoloCablingTopology() {
  return (
    <svg viewBox="0 0 760 360" role="img" aria-label="Topologia labului solo — provocarea de cablare">
      <rect x={20} y={20} width={470} height={300} rx={14} fill="none" stroke="var(--border)" strokeDasharray="6 5" />
      <T x={36} y={40} size={11} anchor="start" color="var(--muted)">Clădirea A</T>
      <rect x={560} y={150} width={185} height={170} rx={14} fill="none" stroke="var(--border)" strokeDasharray="6 5" />
      <T x={576} y={170} size={11} anchor="start" color="var(--muted)">Clădirea B (600 m)</T>
      <g stroke="var(--muted)" strokeWidth={1.6} strokeDasharray="2 5">
        <line x1={250} y1={60} x2={130} y2={120} /><line x1={250} y1={60} x2={250} y2={140} /><line x1={250} y1={60} x2={110} y2={60} />
        <line x1={250} y1={150} x2={130} y2={210} /><line x1={250} y1={150} x2={400} y2={150} /><line x1={250} y1={150} x2={650} y2={210} />
        <line x1={130} y1={130} x2={60} y2={175} /><line x1={130} y1={130} x2={200} y2={175} />
        <line x1={130} y1={220} x2={80} y2={265} /><line x1={130} y1={220} x2={180} y2={265} /><line x1={130} y1={220} x2={300} y2={265} />
        <line x1={300} y1={265} x2={260} y2={300} /><line x1={300} y1={265} x2={340} y2={300} /><line x1={300} y1={265} x2={420} y2={300} />
        <line x1={650} y1={210} x2={610} y2={265} /><line x1={650} y1={210} x2={700} y2={265} />
      </g>
      <RouterIcon x={250} y={52} label="" /><T x={290} y={50} size={10.5} anchor="start" weight={650}>R-EDGE</T>
      <ClientIcon x={90} y={60} label="ADMIN" />
      <SwitchIcon x={130} y={124} label="" /><T x={130} y={108} size={10} weight={650}>SW-LAB</T>
      <ClientIcon x={60} y={182} kind="pc" label="PC-L1" /><ClientIcon x={200} y={182} kind="pc" label="PC-L2" />
      <SwitchIcon x={250} y={150} label="" /><T x={290} y={138} size={10.5} anchor="start" weight={650}>SW-CORE</T>
      <ClientIcon x={420} y={150} kind="pc" label="SRV1" />
      <SwitchIcon x={130} y={220} label="" /><T x={70} y={226} size={10} anchor="end" weight={650}>SW-ACC1</T>
      <ClientIcon x={80} y={272} kind="pc" label="PC-A1" /><ClientIcon x={180} y={272} kind="pc" label="PC-A2" />
      <HubIcon x={300} y={262} /><T x={345} y={256} size={10} anchor="start" weight={650}>HUB1</T>
      <ClientIcon x={260} y={312} kind="pc" label="" /><ClientIcon x={340} y={312} kind="pc" label="" /><ClientIcon x={420} y={312} kind="pc" label="" />
      <T x={340} y={346} size={10} color="var(--muted)">PC-H1 · PC-H2 · PC-H3</T>
      <SwitchIcon x={650} y={210} label="" /><T x={650} y={194} size={10} weight={650}>SW-B</T>
      <ClientIcon x={610} y={272} kind="pc" label="PC-B1" /><ClientIcon x={700} y={272} kind="pc" label="PC-B2" />
      <T x={600} y={60} size={11} color="var(--muted)">Liniile punctate gri = legături</T>
      <T x={600} y={76} size={11} color="var(--muted)">al căror cablu îl alegi TU</T>
    </svg>
  );
}
