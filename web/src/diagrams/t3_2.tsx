import { useState } from 'react';
import { ClientIcon, RouterIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 3.2 (cum decide routerul transmiterea). Culori doar prin var(--…). */

/* 1) Fluxul deciziei */
export function DecisionFlow() {
  const Step = ({ y, n, title, sub, c }: { y: number; n: string; title: string; sub: string; c: string }) => (
    <g>
      <rect x={160} y={y} width={400} height={56} rx={10} fill="var(--surface-3)" stroke={c} strokeWidth={1.8} />
      <circle cx={190} cy={y + 28} r={13} fill={c} />
      <T x={190} y={y + 33} size={13} weight={700} color="var(--surface-3)">{n}</T>
      <T x={360} y={y + 24} weight={700} size={12.5}>{title}</T>
      <T x={360} y={y + 42} size={10.5} color="var(--text-2)">{sub}</T>
    </g>
  );
  return (
    <svg viewBox="0 0 720 470" role="img" aria-label="Fluxul deciziei de transmitere: potrivirea cea mai lungă, apoi AD, apoi metrica, apoi transmiterea">
      <T x={360} y={18} size={11} weight={700} color="var(--muted)">PACHET IP ajunge pe o interfață</T>
      <Line x1={360} y1={26} x2={360} y2={44} c="var(--accent)" w={2.5} flow />
      <Step y={46} n="1" title="Care rute se potrivesc cu destinația?" sub="compară primii n biți (n = lungimea prefixului) din fiecare rută" c="var(--accent)" />
      <Line x1={360} y1={102} x2={360} y2={122} c="var(--accent)" w={2.5} flow />
      <Step y={124} n="2" title="Longest prefix match" sub="câștigă ruta cu masca cea mai lungă (3.2.a)" c="var(--accent)" />
      <Line x1={360} y1={180} x2={360} y2={200} c="var(--info)" w={2.5} flow />
      <Step y={202} n="3" title="Același prefix din surse diferite? → AD mai mic" sub="decis înainte, la instalarea în tabelă (3.2.b)" c="var(--info)" />
      <Line x1={360} y1={258} x2={360} y2={278} c="var(--violet)" w={2.5} flow />
      <Step y={280} n="4" title="Același prefix, același protocol? → metrică mai mică" sub="metrici egale ⇒ ECMP: traficul se împarte (3.2.c)" c="var(--violet)" />
      <Line x1={360} y1={336} x2={360} y2={356} c="var(--ok)" w={2.5} flow />
      <Step y={358} n="5" title="Next hop + interfață de ieșire → ARP → trimite" sub="TTL − 1; antet L2 rescris; IP-urile rămân" c="var(--ok)" />
      <Line x1={560} y1={80} x2={640} y2={80} c="var(--bad)" w={1.5} dash="5 4" />
      <T x={645} y={74} anchor="start" size={10.5} color="var(--bad)" weight={700}>niciuna?</T>
      <T x={645} y={89} anchor="start" size={10.5} color="var(--bad)">drop + ICMP unreachable</T>
      <T x={360} y={440} size={10.5} color="var(--muted)">Notă: pașii 3–4 se petrec la construirea tabelei (rutele pierzătoare nu intră în ea); la fiecare pachet se aplică efectiv doar 1–2 și 5.</T>
    </svg>
  );
}

/* 2) Explorator longest prefix match */
interface R { code: string; pre: string; len: number; via: string; ad: number; metric: number }
const ROUTES: R[] = [
  { code: 'S*', pre: '0.0.0.0', len: 0, via: '203.0.113.1', ad: 1, metric: 0 },
  { code: 'O', pre: '10.0.0.0', len: 8, via: '10.9.9.1', ad: 110, metric: 20 },
  { code: 'S', pre: '10.1.0.0', len: 16, via: '10.9.9.2', ad: 1, metric: 0 },
  { code: 'O', pre: '10.1.1.0', len: 24, via: '10.9.9.3', ad: 110, metric: 2 },
  { code: 'S', pre: '10.1.1.64', len: 26, via: '10.9.9.4', ad: 1, metric: 0 },
  { code: 'S', pre: '10.1.1.77', len: 32, via: '10.9.9.5', ad: 1, metric: 0 },
];
const toNum = (ip: string) => ip.split('.').reduce((a, o) => ((a << 8) | Number(o)) >>> 0, 0) >>> 0;
const matches = (dst: string, r: R) => r.len === 0 || (toNum(dst) >>> (32 - r.len)) === (toNum(r.pre) >>> (32 - r.len));
const DESTS = ['10.1.1.77', '10.1.1.70', '10.1.1.10', '10.1.5.5', '10.200.0.1', '8.8.8.8'];
export function LpmExplorer() {
  const [d, setD] = useState('10.1.1.77');
  const hits = ROUTES.map((r) => matches(d, r));
  let win = -1;
  hits.forEach((h, i) => { if (h && (win < 0 || ROUTES[i].len > ROUTES[win].len)) win = i; });
  const w = ROUTES[win];
  return (
    <div>
      <Seg value={d} set={setD} label="Adresa de destinație" items={DESTS.map((x) => [x, x] as [string, string])} />
      <svg viewBox="0 0 720 262" role="img" aria-label="Rutele care se potrivesc cu destinația aleasă și ruta câștigătoare, cea cu prefixul cel mai lung">
        <T x={14} y={16} anchor="start" size={10.5} weight={700} color="var(--muted)">cod   prefix           [AD/metric]   next hop</T>
        <T x={560} y={16} anchor="start" size={10.5} weight={700} color="var(--muted)">potrivire</T>
        {ROUTES.map((r, i) => {
          const y = 26 + i * 34;
          const isW = i === win;
          const hit = hits[i];
          return (
            <g key={r.pre + r.len}>
              <rect x={8} y={y} width={704} height={30} rx={6} fill={isW ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={isW ? 'var(--accent)' : 'var(--border)'} strokeWidth={isW ? 2.2 : 1} opacity={hit ? 1 : 0.45} />
              <T x={16} y={y + 20} anchor="start" size={11.5} m weight={isW ? 700 : 500} color={isW ? 'var(--accent)' : 'var(--text-2)'}>{`${r.code.padEnd(3)} ${`${r.pre}/${r.len}`.padEnd(16)} [${r.ad}/${r.metric}]`.padEnd(46) + `via ${r.via}`}</T>
              <T x={560} y={y + 20} anchor="start" size={11} weight={700} color={hit ? (isW ? 'var(--accent)' : 'var(--ok)') : 'var(--muted)'}>{hit ? (isW ? `✔ CÂȘTIGĂ (/${r.len})` : `se potrivește (/${r.len})`) : 'nu se potrivește'}</T>
            </g>
          );
        })}
        <text x={14} y={248} style={{ fontSize: 12, fill: 'var(--text)', fontFamily: 'Inter Variable, sans-serif' }}>
          {`Destinația ${d} → ${w.code} ${w.pre}/${w.len} via ${w.via}. AD-ul (${w.ad}) nu a contat: toate rutele sunt din prefixe diferite.`}
        </text>
      </svg>
    </div>
  );
}

/* 3) Cursa surselor către același prefix */
interface Src { k: string; label: string; ad: number; metric: number; code: string; path: string }
const SOURCES: Src[] = [
  { k: 'static', label: 'Static (AD 1)', ad: 1, metric: 0, code: 'S', path: 'via 10.0.12.2' },
  { k: 'eigrp', label: 'EIGRP (AD 90)', ad: 90, metric: 3072, code: 'D', path: 'via 10.0.13.2' },
  { k: 'ospf', label: 'OSPF (AD 110)', ad: 110, metric: 3, code: 'O', path: 'via 10.0.13.2' },
  { k: 'rip', label: 'RIP (AD 120)', ad: 120, metric: 2, code: 'R', path: 'via 10.0.12.2' },
  { k: 'float', label: 'Static flotantă (AD 130)', ad: 130, metric: 0, code: 'S', path: 'via 10.0.12.2' },
];
export function SourceRace() {
  const [on, setOn] = useState<Record<string, boolean>>({ static: false, eigrp: false, ospf: true, rip: true, float: true });
  const live = SOURCES.filter((s) => on[s.k]);
  const win = live.length ? live.reduce((a, b) => (b.ad < a.ad ? b : a)) : null;
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 8px' }}>Toate sursele oferă <b>același prefix</b>: 192.168.3.0/24. Bifează ce există pe router și vezi ce intră în tabelă.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        {SOURCES.map((s) => (
          <label key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8, background: on[s.k] ? 'var(--accent-soft)' : 'var(--surface-2)', cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={on[s.k]} onChange={() => setOn({ ...on, [s.k]: !on[s.k] })} /> {s.label}
          </label>
        ))}
      </div>
      <svg viewBox="0 0 720 260" role="img" aria-label="Sursele de rute către același prefix și cea care câștigă după AD">
        {SOURCES.map((s, i) => {
          const y = 8 + i * 38;
          const live1 = on[s.k];
          const isW = win && win.k === s.k;
          return (
            <g key={s.k} opacity={live1 ? 1 : 0.35}>
              <rect x={8} y={y} width={500} height={32} rx={6} fill={isW ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={isW ? 'var(--accent)' : 'var(--border)'} strokeWidth={isW ? 2.2 : 1} />
              <T x={16} y={y + 21} anchor="start" size={11.5} m weight={isW ? 700 : 500} color={isW ? 'var(--accent)' : 'var(--text-2)'}>{`${s.code.padEnd(2)} 192.168.3.0/24 [${s.ad}/${s.metric}] ${s.path}`}</T>
              <T x={520} y={y + 21} anchor="start" size={11} weight={700} color={isW ? 'var(--accent)' : live1 ? 'var(--muted)' : 'var(--border)'}>{isW ? '✔ în tabelă' : live1 ? 'în rezervă (rămâne în baza sursei)' : 'inexistentă'}</T>
            </g>
          );
        })}
        <text x={14} y={218} style={{ fontSize: 12.5, fill: 'var(--text)', fontFamily: 'Inter Variable, sans-serif' }}>
          {win ? `Câștigă ${win.label.split(' (')[0]} — cel mai mic AD (${win.ad}) dintre sursele existente.` : 'Nicio sursă: nu există rută pentru 192.168.3.0/24.'}
        </text>
        <text x={14} y={238} style={{ fontSize: 11.5, fill: 'var(--muted)', fontFamily: 'Inter Variable, sans-serif' }}>
          Metricile (ultima cifră) nu au fost comparate între surse diferite; ruta pierzătoare revine automat dacă cea câștigătoare dispare.
        </text>
      </svg>
    </div>
  );
}

/* 4) Metrica: RIP vs OSPF pe aceeași topologie */
type M = 'rip' | 'ospf' | 'ecmp';
export function MetricPaths() {
  const [m, setM] = useState<M>('rip');
  const direct = m === 'rip' || m === 'ecmp';
  const viaR3 = m === 'ospf' || m === 'ecmp';
  const info: Record<M, { t: string; d: string }> = {
    rip: { t: 'RIP: 1 hop (direct) vs 2 hop-uri (prin R3)', d: 'RIP numără doar routerele. Legătura directă R1–R2 (10 Mbps) are 1 hop; drumul prin R3 are 2. Alege legătura lentă, pentru că are metrica mai mică.' },
    ospf: { t: 'OSPF: cost 10 (direct) vs cost 1 + 1 = 2 (prin R3)', d: 'OSPF cu referința implicită 100 Mbps: 10 Mbps = cost 10; fiecare FastEthernet = cost 1. Drumul prin R3 costă 2 și câștigă. Aceeași topologie, alt protocol, altă cale.' },
    ecmp: { t: 'OSPF cu ip ospf cost 2 pe legătura directă: 2 vs 2', d: 'Dacă setezi manual costul legăturii directe la 2, ambele căi costă 2: routerul instalează ambele rute (ECMP) și împarte traficul între ele.' },
  };
  return (
    <div>
      <Seg value={m} set={setM} label="Protocol / setare" items={[['rip', 'RIP (hop-uri)'], ['ospf', 'OSPF (cost implicit)'], ['ecmp', 'OSPF cu cost 2 pe link-ul direct']]} />
      <svg viewBox="0 0 720 240" role="img" aria-label="Două căi de la R1 la R2: una directă lentă și una prin R3 cu două legături rapide">
        <RouterIcon x={110} y={150} label="R1" />
        <RouterIcon x={610} y={150} label="R2" />
        <RouterIcon x={360} y={50} label="R3" />
        <Line x1={140} y1={150} x2={580} y2={150} c={direct ? 'var(--ok)' : 'var(--border)'} w={direct ? 4 : 2} flow={direct} />
        <T x={360} y={140} size={10.5} weight={700} color={direct ? 'var(--ok)' : 'var(--muted)'}>10 Mbps{m === 'rip' ? ' · 1 hop' : m === 'ospf' ? ' · cost 10' : ' · cost 2 (setat)'}</T>
        <Line x1={130} y1={128} x2={338} y2={64} c={viaR3 ? 'var(--ok)' : 'var(--border)'} w={viaR3 ? 4 : 2} flow={viaR3} />
        <Line x1={382} y1={64} x2={590} y2={128} c={viaR3 ? 'var(--ok)' : 'var(--border)'} w={viaR3 ? 4 : 2} flow={viaR3} />
        <T x={200} y={86} size={10.5} weight={700} color={viaR3 ? 'var(--ok)' : 'var(--muted)'}>100 Mbps{m === 'rip' ? '' : ' · cost 1'}</T>
        <T x={530} y={86} size={10.5} weight={700} color={viaR3 ? 'var(--ok)' : 'var(--muted)'}>100 Mbps{m === 'rip' ? '' : ' · cost 1'}</T>
        <T x={360} y={222} size={11} weight={700} color="var(--ok)">{m === 'ecmp' ? 'Ambele căi instalate (ECMP): [110/2] × 2' : m === 'rip' ? 'Alege: calea directă (lentă)' : 'Alege: calea prin R3 (rapidă)'}</T>
      </svg>
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)' }}>
        <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{info[m].t}</div>
        <div style={{ fontSize: 13.5, marginTop: 4, color: 'var(--text-2)' }}>{info[m].d}</div>
      </div>
    </div>
  );
}

/* 5) Rescrierea antetelor la fiecare hop */
type Seg3 = 'a' | 'b' | 'c';
const HOPS: Record<Seg3, { name: string; smac: string; dmac: string; sip: string; dip: string; ttl: number }> = {
  a: { name: 'PC1 → R1', smac: 'PC1', dmac: 'R1 Gi0/0', sip: '192.168.1.10', dip: '192.168.3.10', ttl: 128 },
  b: { name: 'R1 → R2', smac: 'R1 Gi0/1', dmac: 'R2 Gi0/0', sip: '192.168.1.10', dip: '192.168.3.10', ttl: 127 },
  c: { name: 'R3 → PC3 (ultimul hop)', smac: 'R3 Gi0/1', dmac: 'PC3', sip: '192.168.1.10', dip: '192.168.3.10', ttl: 125 },
};
export function FrameRewrite() {
  const [s, setS] = useState<Seg3>('a');
  const order: Seg3[] = ['a', 'b', 'c'];
  const prev = order[order.indexOf(s) - 1];
  const h = HOPS[s];
  const p = prev ? HOPS[prev] : null;
  const f = (label: string, val: string, changed: boolean) => (
    <div style={{ flex: '1 1 130px', border: '1px solid ' + (changed ? 'var(--warn)' : 'var(--border)'), borderRadius: 8, padding: '8px 10px', background: changed ? 'var(--surface-3)' : 'var(--surface-2)' }}>
      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</div>
      <div style={{ fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: changed ? 'var(--warn)' : 'var(--text)' }}>{val}</div>
      {changed && <div style={{ fontSize: 10.5, color: 'var(--warn)' }}>rescris</div>}
    </div>
  );
  return (
    <div>
      <Seg value={s} set={setS} label="Segment" items={order.map((k) => [k, HOPS[k].name] as [Seg3, string])} />
      <svg viewBox="0 0 720 130" role="img" aria-label="Traseul pachetului PC1, R1, R2, R3, PC3 cu segmentul ales evidențiat">
        <ClientIcon x={40} y={50} kind="pc" label="PC1" />
        <RouterIcon x={190} y={50} label="R1" /><RouterIcon x={360} y={50} label="R2" /><RouterIcon x={530} y={50} label="R3" />
        <ClientIcon x={680} y={50} kind="pc" label="PC3" />
        <Line x1={65} y1={50} x2={160} y2={50} c={s === 'a' ? 'var(--accent)' : 'var(--border)'} w={s === 'a' ? 4 : 2} />
        <Line x1={220} y1={50} x2={330} y2={50} c={s === 'b' ? 'var(--accent)' : 'var(--border)'} w={s === 'b' ? 4 : 2} />
        <Line x1={390} y1={50} x2={500} y2={50} c={s === 'c' ? 'var(--accent)' : 'var(--border)'} w={s === 'c' ? 4 : 2} />
        <Line x1={560} y1={50} x2={655} y2={50} c={s === 'c' ? 'var(--accent)' : 'var(--border)'} w={s === 'c' ? 4 : 2} />
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {f('MAC sursă (L2)', h.smac, !!p && p.smac !== h.smac)}
        {f('MAC destinație (L2)', h.dmac, !!p && p.dmac !== h.dmac)}
        {f('IP sursă (L3)', h.sip, !!p && p.sip !== h.sip)}
        {f('IP destinație (L3)', h.dip, !!p && p.dip !== h.dip)}
        {f('TTL', String(h.ttl), !!p && p.ttl !== h.ttl)}
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 10 }}>
        {s === 'a' ? 'Pachetul pornește de pe PC1 spre default gateway (R1): MAC destinație = R1 Gi0/0. TTL inițial 128 (valoare tipică Windows; variază).' : s === 'b' ? 'R1 a decis (longest prefix match), a scăzut TTL și a rescris antetul Ethernet: MAC nou sursă (Gi0/1 al lui R1) și MAC al next hop-ului R2. IP-urile NU s-au schimbat.' : 'Ultimul segment: după trei routere (R1, R2, R3) TTL a scăzut de trei ori (128 → 125). La fiecare hop MAC-urile s-au rescris; R3 livrează direct către PC3, al cărui MAC îl află prin ARP. IP-urile sunt tot cele inițiale.'}
      </p>
    </div>
  );
}

/* 6) Topologii laborator */
export function LabGuidedTopology32() {
  return (
    <svg viewBox="0 0 760 270" role="img" aria-label="Topologie lab 3.2: PC1, R1, R2, R3 în triunghi și PC3">
      <ClientIcon x={50} y={170} kind="pc" label="PC1 192.168.1.10" />
      <RouterIcon x={220} y={170} label="R1" />
      <RouterIcon x={400} y={50} label="R2" />
      <RouterIcon x={580} y={170} label="R3" />
      <ClientIcon x={710} y={170} kind="pc" label="PC3 192.168.3.10" />
      <Line x1={80} y1={170} x2={190} y2={170} /><Line x1={246} y1={150} x2={374} y2={66} /><Line x1={426} y1={66} x2={554} y2={150} /><Line x1={250} y1={170} x2={550} y2={170} /><Line x1={610} y1={170} x2={680} y2={170} />
      <T x={130} y={158} size={10} m color="var(--muted)">192.168.1.0/24</T>
      <T x={290} y={96} size={10} m color="var(--muted)">10.0.12.0/30</T>
      <T x={510} y={96} size={10} m color="var(--muted)">10.0.23.0/30</T>
      <T x={400} y={188} size={10} m color="var(--muted)">10.0.13.0/30 (Gi0/2 ↔ Gi0/2)</T>
      <T x={645} y={158} size={10} m color="var(--muted)">192.168.3.0/24</T>
      <T x={220} y={222} size={10} m color="var(--muted)">Gi0/0 .1 · Gi0/1 .1 · Gi0/2 .1</T>
      <T x={400} y={20} size={10} m color="var(--muted)">Gi0/0 .2 · Gi0/1 .1</T>
      <T x={580} y={222} size={10} m color="var(--muted)">Gi0/0 .2 · Gi0/1 .1 · Gi0/2 .2</T>
    </svg>
  );
}
export function LabSoloTopology32() {
  return (
    <svg viewBox="0 0 720 240" role="img" aria-label="Topologie lab solo 3.2: R1 în centru, conectat la trei vecini N1, N2, N3">
      <RouterIcon x={360} y={120} label="R1" />
      <RouterIcon x={120} y={50} label="N1" /><RouterIcon x={600} y={50} label="N2" /><RouterIcon x={360} y={210} label="N3" />
      <Line x1={142} y1={64} x2={336} y2={106} /><Line x1={578} y1={64} x2={384} y2={106} /><Line x1={360} y1={142} x2={360} y2={188} />
      <T x={210} y={70} size={10} m color="var(--muted)">10.0.1.0/30</T>
      <T x={510} y={70} size={10} m color="var(--muted)">10.0.2.0/30</T>
      <T x={425} y={170} size={10} m color="var(--muted)">10.0.3.0/30</T>
    </svg>
  );
}
