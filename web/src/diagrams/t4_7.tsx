import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, PhoneIcon, Seg, T, mono } from './l2kit';

/* Diagrame originale pentru 4.7 (QoS / PHB). Culori doar prin var(--…). */

const note = (c: string) => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8, fontSize: 13.5, color: 'var(--text-2)' } as const);

/* 1) Calculator DSCP: clasă + probabilitate de drop → valoare */
type Cls = { k: string; label: string; base: number; af: boolean };
const CLASSES: Cls[] = [
  { k: 'ef', label: 'EF', base: 46, af: false },
  { k: 'af4', label: 'AF4x', base: 4, af: true },
  { k: 'af3', label: 'AF3x', base: 3, af: true },
  { k: 'af2', label: 'AF2x', base: 2, af: true },
  { k: 'af1', label: 'AF1x', base: 1, af: true },
  { k: 'cs6', label: 'CS6', base: 48, af: false },
  { k: 'df', label: 'DF (CS0)', base: 0, af: false },
];
const USE: Record<string, string> = {
  ef: 'Voce (bearer) — coadă prioritară, în LLQ',
  af4: 'Video interactiv / streaming',
  af3: 'Semnalizare / date critice pentru business (la Cisco, semnalizarea mai veche folosește CS3)',
  af2: 'Date tranzacționale',
  af1: 'Date în bloc (bulk)',
  cs6: 'Control de rețea (protocoale de rutare)',
  df: 'Best effort: tot restul traficului',
};
export function DscpCalc() {
  const [k, setK] = useState('ef');
  const [d, setD] = useState(1);
  const c = CLASSES.find((x) => x.k === k)!;
  const dscp = c.af ? 8 * c.base + 2 * d : c.base;
  const bin = dscp.toString(2).padStart(6, '0');
  const tos = dscp * 4;
  const name = c.af ? 'AF' + c.base + d : c.label;
  const bits = (bin + '00').split('');
  return (
    <div>
      <Seg value={k} set={setK} label="Clasa PHB" items={CLASSES.map((x) => [x.k, x.label] as [string, string])} />
      {c.af && <Seg value={String(d)} set={(v) => setD(Number(v))} label="Probabilitate de drop (y din AFxy)" items={[['1', '1 · mică'], ['2', '2 · medie'], ['3', '3 · mare']]} />}
      <svg viewBox="0 0 720 150" role="img" aria-label="Octetul ToS: primii 6 biți sunt DSCP, ultimii 2 sunt ECN; valoarea calculată pentru clasa aleasă">
        <T x={360} y={18} size={12} weight={700}>Octetul ToS / Traffic Class (8 biți)</T>
        {bits.map((b, i) => {
          const inDscp = i < 6;
          const inIpp = i < 3;
          return (
            <g key={i}>
              <rect x={80 + i * 70} y={32} width={62} height={42} rx={6} fill="var(--surface-3)" stroke={inDscp ? (inIpp ? 'var(--accent)' : 'var(--violet)') : 'var(--muted)'} strokeWidth={inIpp ? 2.2 : 1.4} />
              <text x={111 + i * 70} y={60} textAnchor="middle" style={{ ...mono, fontSize: 18, fill: inDscp ? 'var(--text)' : 'var(--muted)', fontWeight: 700 }}>{b}</text>
            </g>
          );
        })}
        <T x={80 + 3 * 35} y={94} size={11} weight={700} color="var(--accent)">IP Precedence (primii 3 biți)</T>
        <T x={80 + 3 * 70} y={112} size={11} weight={700} color="var(--violet)">DSCP (primii 6 biți)</T>
        <T x={80 + 7 * 70} y={94} size={11} color="var(--muted)">ECN (2 biți)</T>
        <T x={360} y={140} size={11} color="var(--muted)">Nu confunda: DSCP = 6 biți (0–63); octetul întreg = DSCP × 4 (+ ECN)</T>
      </svg>
      <div style={note('var(--accent)')}>
        <b>{name}</b> = DSCP <b>{dscp}</b> (binar <code>{bin}</code>) · octet ToS = {tos} (0x{tos.toString(16).toUpperCase()}) · IP Precedence = {parseInt(bin.slice(0, 3), 2)}.
        {c.af ? <> Formula: DSCP = 8 × clasă + 2 × drop = 8 × {c.base} + 2 × {d} = {dscp}.</> : null}
        <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--muted)' }}>Uz tipic: {USE[k]}.</div>
      </div>
    </div>
  );
}

/* 2) Coada: FIFO vs LLQ (priorități) */
type Pk = 'V' | 'D' | 'B';
const ARR: Pk[] = ['D', 'B', 'V', 'D', 'B', 'V', 'D', 'V'];
const PCOL: Record<Pk, string> = { V: 'var(--ok)', D: 'var(--info)', B: 'var(--muted)' };
const PNAME: Record<Pk, string> = { V: 'voce', D: 'date', B: 'bulk' };
export function QueueingDemo() {
  const [m, setM] = useState<'fifo' | 'llq'>('fifo');
  const out: Pk[] = m === 'fifo' ? ARR : [...ARR.filter((p) => p === 'V'), ...ARR.filter((p) => p !== 'V')];
  const pk = (arr: Pk[], y: number, title: string) => (
    <g>
      <T x={20} y={y - 8} size={11} weight={700} anchor="start" color="var(--text-2)">{title}</T>
      {arr.map((p, i) => (
        <g key={i}>
          <rect x={20 + i * 82} y={y} width={72} height={30} rx={5} fill="var(--surface-3)" stroke={PCOL[p]} strokeWidth={2} />
          <T x={56 + i * 82} y={y + 20} size={11.5} weight={650} color={PCOL[p]}>{PNAME[p]}</T>
        </g>
      ))}
    </g>
  );
  return (
    <div>
      <Seg value={m} set={setM} label="Mecanism de coadă" items={[['fifo', 'FIFO (fără QoS)'], ['llq', 'LLQ: coadă prioritară pentru voce']]} />
      <svg viewBox="0 0 700 170" role="img" aria-label="Ordinea în care pachetele de voce, date și bulk ies dintr-o interfață congestionată, cu FIFO sau cu LLQ">
        {pk(ARR, 36, 'Pachete sosite (în ordinea sosirii)')}
        <T x={350} y={88} size={12} color="var(--muted)">↓ interfață congestionată ({m === 'fifo' ? 'o singură coadă' : 'coadă prioritară + cozi cu bandă garantată'}) ↓</T>
        {pk(out, 120, 'Ordinea de transmitere')}
      </svg>
      <div style={note(m === 'fifo' ? 'var(--warn)' : 'var(--ok)')}>
        {m === 'fifo'
          ? 'FIFO nu face deosebire: pachetele de voce așteaptă după pachetele de date mari. Rezultatul este întârziere variabilă (jitter) — exact ce nu suportă vocea.'
          : 'În LLQ, vocea se transmite imediat ce ajunge (strict priority), în limita unei benzi stabilite; restul traficului împarte banda rămasă după reguli (CBWFQ). Coada prioritară este limitată (policed), ca să nu înfometeze celelalte clase.'}
      </div>
    </div>
  );
}

/* 3) Policing vs shaping */
const SLOTS = [2, 3, 9, 10, 2, 1, 8, 2, 2, 1, 1, 1];
const RATE = 4;
export function PolicerShaper() {
  const [m, setM] = useState<'pol' | 'shp'>('pol');
  const out: number[] = [];
  const drop: number[] = [];
  let back = 0;
  if (m === 'pol') {
    SLOTS.forEach((v) => { out.push(Math.min(v, RATE)); drop.push(Math.max(v - RATE, 0)); });
  } else {
    SLOTS.forEach((v) => { const tot = back + v; const o = Math.min(tot, RATE); out.push(o); back = tot - o; drop.push(0); });
  }
  const base = 150, unit = 9;
  return (
    <div>
      <Seg value={m} set={setM} label="Mecanism" items={[['pol', 'Policing (aruncă excesul)'], ['shp', 'Shaping (întârzie excesul)']]} />
      <svg viewBox="0 0 700 190" role="img" aria-label="Trafic de intrare cu rafale, limitat la o rată; policing taie excesul, shaping îl amână">
        <line x1={30} y1={base} x2={680} y2={base} stroke="var(--border)" strokeWidth={1.5} />
        <line x1={30} y1={base - RATE * unit} x2={680} y2={base - RATE * unit} stroke="var(--warn)" strokeDasharray="5 4" strokeWidth={1.6} />
        <T x={686} y={base - RATE * unit + 4} size={10.5} color="var(--warn)" anchor="start">rata</T>
        {SLOTS.map((v, i) => (
          <g key={i}>
            <rect x={36 + i * 53} y={base - v * unit} width={20} height={v * unit} fill="var(--surface-3)" stroke="var(--muted)" strokeWidth={1} />
            <rect x={58 + i * 53} y={base - out[i] * unit} width={20} height={out[i] * unit} fill="var(--accent)" opacity={0.85} />
            {drop[i] > 0 && <rect x={58 + i * 53} y={base - (out[i] + drop[i]) * unit} width={20} height={drop[i] * unit} fill="none" stroke="var(--bad)" strokeWidth={1.5} strokeDasharray="3 3" />}
          </g>
        ))}
        <T x={36} y={22} size={11} anchor="start" color="var(--muted)">gri = trafic de intrare · albastru/accent = trafic transmis · contur roșu = aruncat</T>
        <T x={350} y={178} size={10.5} color="var(--muted)">12 intervale de timp (ilustrativ); rafalele depășesc rata</T>
      </svg>
      <div style={note(m === 'pol' ? 'var(--bad)' : 'var(--ok)')}>
        {m === 'pol'
          ? 'Policing: tot ce depășește rata este aruncat (sau re-marcat cu o clasă mai slabă). Nu există buffer → fără întârziere adăugată, dar pierderi (TCP va încetini). Se aplică la intrare sau ieșire, des la marginea ISP-ului.'
          : 'Shaping: excesul este pus într-un buffer și transmis mai târziu, când rata permite. Curba iese netezită, fără pierderi (până se umple bufferul), dar cu întârziere. Se aplică doar la ieșire, tipic la clientul care vrea să respecte contractul cu ISP-ul.'}
      </div>
    </div>
  );
}

/* 4) Unde acționează fiecare instrument */
export function QosPipeline() {
  const st: { x: number; t: string; s: string; c: string }[] = [
    { x: 20, t: 'Clasificare', s: 'ce fel de trafic e?', c: 'var(--info)' },
    { x: 150, t: 'Marcare', s: 'DSCP / CoS', c: 'var(--accent)' },
    { x: 280, t: 'Policing', s: 'aruncă excesul', c: 'var(--bad)' },
    { x: 410, t: 'Cozi + evitare', s: 'LLQ / CBWFQ / WRED', c: 'var(--violet)' },
    { x: 540, t: 'Shaping', s: 'netezește la ieșire', c: 'var(--warn)' },
  ];
  return (
    <svg viewBox="0 0 700 200" role="img" aria-label="Lanțul QoS: clasificare, marcare, policing, cozi și evitarea congestiei, shaping, apoi transmitere">
      <T x={350} y={20} size={12.5} weight={700}>Instrumentele QoS pe drumul unui pachet</T>
      {st.map((s, i) => (
        <g key={s.t}>
          <Box x={s.x} y={50} w={120} h={56} label={s.t} sub={s.s} c={s.c} />
          {i < st.length - 1 && <Line x1={s.x + 120} y1={78} x2={st[i + 1].x} y2={78} c="var(--text-2)" w={1.8} />}
        </g>
      ))}
      <rect x={20} y={122} width={260} height={26} rx={6} fill="none" stroke="var(--ok)" strokeWidth={1.4} strokeDasharray="4 4" />
      <T x={150} y={139} size={10.5} color="var(--ok)">ideal la marginea de încredere (trust boundary)</T>
      <rect x={410} y={122} width={250} height={26} rx={6} fill="none" stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="4 4" />
      <T x={535} y={139} size={10.5} color="var(--muted)">la ieșirea interfeței congestionate</T>
      <T x={350} y={178} size={10.5} color="var(--muted)">Clasificarea și marcarea se fac o dată, aproape de sursă; restul de routere doar aplică PHB-ul pe baza marcajului (per-hop).</T>
    </svg>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 780 230" role="img" aria-label={solo ? 'Topologie lab solo QoS: PC, telefon IP, switch, R1, WAN, R2' : 'Topologie lab ghidat QoS: PC, telefon IP, switch, R1 cu politică QoS, WAN, R2'}>
      <ClientIcon x={60} y={60} label="PC1" kind="pc" />
      <PhoneIcon x={60} y={160} label="Telefon IP" />
      <SwitchIcon x={200} y={110} label="SW1" />
      <RouterIcon x={380} y={110} label="R1" sub="service-policy out" />
      <RouterIcon x={640} y={110} label="R2" sub="server / Internet" />
      <Line x1={90} y1={60} x2={180} y2={102} /><Line x1={90} y1={160} x2={180} y2={118} /><Line x1={222} y1={110} x2={350} y2={110} />
      <Line x1={410} y1={110} x2={610} y2={110} c="var(--warn)" w={3} />
      <T x={510} y={96} size={10.5} color="var(--warn)">WAN lentă (ex. 2 Mb/s, ilustrativ)</T>
      <T x={390} y={210} size={10.5} color="var(--muted)">{solo ? 'Politica QoS există pe R1, dar vocea tot suferă: găsește de ce' : 'Marchează și prioritizează vocea la ieșirea spre WAN'}</T>
    </svg>
  );
}
export const LabGuidedTopology47 = () => <Topo solo={false} />;
export const LabSoloTopology47 = () => <Topo solo />;
