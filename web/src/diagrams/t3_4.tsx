import { useState, type CSSProperties } from 'react';
import { RouterIcon, SwitchIcon, ClientIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 3.4 (OSPFv2 single-area). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const mono: CSSProperties = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace', fontSize: 12.5, color: 'var(--text)', whiteSpace: 'pre-wrap', margin: 0 };

/* 1) Stările unui vecin OSPF */
type St = 'down' | 'init' | 'twoway' | 'exstart' | 'exchange' | 'loading' | 'full';
const ORDER: St[] = ['down', 'init', 'twoway', 'exstart', 'exchange', 'loading', 'full'];
const STATES: Record<St, { name: string; sh: string; txt: string; c: string }> = {
  down: { name: 'Down', sh: '(vecinul lipsește din listă)', txt: 'Nu s-a primit niciun Hello recent de la vecin, sau dead interval-ul a expirat. Vecinul e considerat picat.', c: 'var(--bad)' },
  init: { name: 'Init', sh: 'INIT/ -', txt: 'Am primit un Hello de la vecin, dar vecinul nu și-a văzut încă propriul RID în pachetele noastre.', c: 'var(--warn)' },
  twoway: { name: '2-WAY', sh: '2WAY/DROTHER', txt: 'Vecinul ne-a listat în Hello: comunicarea e bidirecțională. Pe Ethernet aici se alege DR/BDR. Între doi DROTHER-i relația rămâne în 2-WAY, și asta e normal.', c: 'var(--info)' },
  exstart: { name: 'ExStart', sh: 'EXSTART/DR', txt: 'Începe schimbul de DBD. Se stabilesc master și slave (routerul cu RID mai mare devine master). Dacă rămâi blocat aici, verifică MTU-ul.', c: 'var(--warn)' },
  exchange: { name: 'Exchange', sh: 'EXCHANGE/DR', txt: 'Fiecare router trimite DBD-uri cu rezumatul LSDB-ului: ce LSA-uri are, fără conținutul complet. Pe baza lor se știe ce lipsește.', c: 'var(--violet)' },
  loading: { name: 'Loading', sh: 'LOADING/BDR', txt: 'Routerul cere cu LSR LSA-urile pe care nu le are și primește conținutul lor în LSU. Fiecare LSU e confirmat cu LSAck.', c: 'var(--violet)' },
  full: { name: 'Full', sh: 'FULL/BDR', txt: 'LSDB-urile sunt sincronizate. Adiacența e completă, iar rutele se calculează din baza de date comună (SPF).', c: 'var(--ok)' },
};
export function OspfStates() {
  const [s, setS] = useState<St>('twoway');
  const d = STATES[s];
  return (
    <div>
      <Seg value={s} set={setS} label="Starea vecinului" items={ORDER.map((k) => [k, STATES[k].name] as [St, string])} />
      <svg viewBox="0 0 740 110" role="img" aria-label="Lanțul de stări OSPF: Down, Init, 2-WAY, ExStart, Exchange, Loading, Full; starea selectată este evidențiată">
        {ORDER.map((k, i) => {
          const x = 10 + i * 104;
          const act = k === s;
          return (
            <g key={k}>
              <rect x={x} y={20} width={92} height={44} rx={8} fill={act ? 'var(--surface-2)' : 'var(--surface-3)'} stroke={act ? STATES[k].c : 'var(--border)'} strokeWidth={act ? 2.5 : 1} />
              <T x={x + 46} y={47} size={12} weight={700} anchor="middle" color={act ? STATES[k].c : 'var(--text-2)'}>{STATES[k].name}</T>
              {i < ORDER.length - 1 && <Line x1={x + 92} y1={42} x2={x + 104} y2={42} c="var(--border)" w={2} />}
            </g>
          );
        })}
        <T x={370} y={92} size={11} m anchor="middle" color="var(--muted)">{'show ip ospf neighbor → ' + d.sh}</T>
      </svg>
      <div style={note(d.c)}>
        <div style={{ fontWeight: 700, color: d.c }}>{d.name}</div>
        <div style={{ fontSize: 13.5, marginTop: 6, color: 'var(--text-2)' }}>{d.txt}</div>
        <pre style={{ ...mono, marginTop: 8 }}>{'R1# show ip ospf neighbor\n' + d.sh}</pre>
      </div>
    </div>
  );
}

/* 2) Pachetele unei adiacențe: secvența între doi vecini */
export function OspfPacketFlow() {
  const msgs: { y: number; label: string; c: string; dir: 'r' | 'l' | 'b' }[] = [
    { y: 88, label: 'Hello (1) · 224.0.0.5 · RID, timere, prioritate', c: 'var(--info)', dir: 'b' },
    { y: 128, label: 'DBD (2) · master/slave, rezumat LSDB (ExStart / Exchange)', c: 'var(--violet)', dir: 'b' },
    { y: 168, label: 'LSR (3) · cere LSA-urile lipsă (Loading)', c: 'var(--warn)', dir: 'r' },
    { y: 208, label: 'LSU (4) · trimite LSA-urile cerute', c: 'var(--ok)', dir: 'l' },
    { y: 248, label: 'LSAck (5) · confirmă primirea', c: 'var(--muted)', dir: 'r' },
  ];
  return (
    <svg viewBox="0 0 720 290" role="img" aria-label="Secvența pachetelor OSPF între R1 și R2: Hello, DBD, LSR, LSU, LSAck">
      <RouterIcon x={130} y={40} label="R1" sub="RID 1.1.1.1" />
      <RouterIcon x={590} y={40} label="R2" sub="RID 2.2.2.2" />
      <Line x1={130} y1={70} x2={130} y2={280} c="var(--border)" w={1} dash="4 4" />
      <Line x1={590} y1={70} x2={590} y2={280} c="var(--border)" w={1} dash="4 4" />
      {msgs.map((m) => {
        const from = m.dir === 'l' ? 590 : 130;
        const to = m.dir === 'l' ? 130 : 590;
        return (
          <g key={m.y}>
            <Line x1={from} y1={m.y} x2={to} y2={m.y} c={m.c} w={2.5} flow={m.dir === 'b'} />
            <T x={360} y={m.y - 8} size={11} anchor="middle" color={m.c}>{m.label}</T>
          </g>
        );
      })}
      <T x={360} y={284} size={10.5} anchor="middle" color="var(--muted)">Săgețile pornesc de la expeditor; „b” = ambele sensuri, în funcție de rol (master/slave).</T>
    </svg>
  );
}

/* 3) Alegerea DR/BDR pe un segment broadcast */
type Sc = 'def' | 'zero' | 'pri' | 'reset';
type Role = 'DR' | 'BDR' | 'DROTHER';
const SC: Record<Sc, { name: string; prio: Record<'R1' | 'R2' | 'R3' | 'R4', number>; roles: Record<'R1' | 'R2' | 'R3' | 'R4', Role>; txt: string; c: string }> = {
  def: {
    name: 'Implicit (toate prioritățile 1)', prio: { R1: 1, R2: 1, R3: 1, R4: 1 },
    roles: { R1: 'DROTHER', R2: 'DROTHER', R3: 'BDR', R4: 'DR' },
    txt: 'Prioritățile sunt egale, deci câștigă RID-ul cel mai mare: R4 (4.4.4.4) devine DR, iar R3 (3.3.3.3) BDR.',
    c: 'var(--ok)',
  },
  zero: {
    name: 'R4 are priority 0', prio: { R1: 1, R2: 1, R3: 1, R4: 0 },
    roles: { R1: 'DROTHER', R2: 'BDR', R3: 'DR', R4: 'DROTHER' },
    txt: 'R4 nu candidează deloc. Dintre R1, R2, R3 (prioritate 1), cel mai mare RID este R3: DR. R2 devine BDR. R4 rămâne DROTHER, dar tot formează adiacență cu DR și BDR.',
    c: 'var(--info)',
  },
  pri: {
    name: 'R1 primește priority 255, fără reset', prio: { R1: 255, R2: 1, R3: 1, R4: 1 },
    roles: { R1: 'DROTHER', R2: 'DROTHER', R3: 'BDR', R4: 'DR' },
    txt: 'Pe o rețea deja funcțională, R1 are acum prioritatea cea mai mare, dar DR-ul rămâne R4. Alegerea nu e preemptivă: R1 nu îi ia rolul.',
    c: 'var(--warn)',
  },
  reset: {
    name: 'După clear ip ospf process', prio: { R1: 255, R2: 1, R3: 1, R4: 1 },
    roles: { R1: 'DR', R2: 'DROTHER', R3: 'DROTHER', R4: 'BDR' },
    txt: 'După reset, se face o nouă alegere: R1 are prioritatea 255 și devine DR. Dintre cei cu prioritate 1, R4 are RID-ul cel mai mare și devine BDR. Resetul întrerupe adiacențele pentru scurt timp.',
    c: 'var(--ok)',
  },
};
const ROLE_C: Record<Role, string> = { DR: 'var(--ok)', BDR: 'var(--info)', DROTHER: 'var(--muted)' };
const POS: Record<'R1' | 'R2' | 'R3' | 'R4', { x: number; y: number }> = {
  R1: { x: 120, y: 60 }, R2: { x: 600, y: 60 }, R3: { x: 120, y: 200 }, R4: { x: 600, y: 200 },
};
const RID: Record<'R1' | 'R2' | 'R3' | 'R4', string> = { R1: '1.1.1.1', R2: '2.2.2.2', R3: '3.3.3.3', R4: '4.4.4.4' };
export function OspfDrElection() {
  const [s, setS] = useState<Sc>('def');
  const d = SC[s];
  const ids: ('R1' | 'R2' | 'R3' | 'R4')[] = ['R1', 'R2', 'R3', 'R4'];
  return (
    <div>
      <Seg value={s} set={setS} label="Scenariul" items={(['def', 'zero', 'pri', 'reset'] as Sc[]).map((k) => [k, SC[k].name.split(' (')[0].split(',')[0]] as [Sc, string])} />
      <svg viewBox="0 0 720 270" role="img" aria-label="Patru routere pe un segment Ethernet cu un switch; rolurile DR, BDR și DROTHER depind de scenariul ales">
        <SwitchIcon x={360} y={130} label="Segment" />
        {ids.map((r) => {
          const p = POS[r];
          const role = d.roles[r];
          return (
            <g key={r}>
              <Line x1={p.x} y1={p.y} x2={360} y2={130} c={role === 'DR' ? 'var(--ok)' : role === 'BDR' ? 'var(--info)' : 'var(--border)'} w={role === 'DROTHER' ? 1.5 : 3} />
              <RouterIcon x={p.x} y={p.y} label={r} sub={'RID ' + RID[r] + ' · pri ' + d.prio[r]} />
              <T x={p.x} y={p.y + (p.y < 130 ? 52 : 58)} size={13} weight={700} anchor="middle" color={ROLE_C[role]}>{role}</T>
            </g>
          );
        })}
      </svg>
      <div style={note(d.c)}>
        <div style={{ fontWeight: 700, color: d.c }}>{d.name}</div>
        <div style={{ fontSize: 13.5, marginTop: 6, color: 'var(--text-2)' }}>{d.txt}</div>
        <div style={{ fontSize: 12.5, marginTop: 6, color: 'var(--muted)' }}>Liniile groase = legătura cu DR și BDR, pe care se formează adiacențe complete. DROTHER-ii nu formează adiacențe complete între ei.</div>
      </div>
    </div>
  );
}

/* 4) Broadcast vs point-to-point */
export function OspfNetworkTypes() {
  const [t, setT] = useState<'bc' | 'p2p'>('bc');
  const isBc = t === 'bc';
  return (
    <div>
      <Seg value={t} set={setT} label="Tipul de rețea" items={[['bc', 'Broadcast (Ethernet)'], ['p2p', 'Point-to-point']]} />
      <svg viewBox="0 0 720 260" role="img" aria-label={isBc ? 'Trei routere pe un segment Ethernet cu DR și BDR' : 'Două routere legate direct, fără DR sau BDR'}>
        {isBc ? (
          <>
            <SwitchIcon x={360} y={120} label="Segment" />
            <RouterIcon x={140} y={60} label="R1" sub="DROTHER" />
            <RouterIcon x={580} y={60} label="R2" sub="DR" />
            <RouterIcon x={360} y={210} label="R3" sub="BDR" />
            <Line x1={140} y1={60} x2={360} y2={120} c="var(--border)" w={2} />
            <Line x1={580} y1={60} x2={360} y2={120} c="var(--ok)" w={3} />
            <Line x1={360} y1={210} x2={360} y2={120} c="var(--info)" w={3} />
            <T x={600} y={160} size={11} color="var(--text-2)" anchor="start">Hello → 224.0.0.5</T>
            <T x={600} y={178} size={11} color="var(--text-2)" anchor="start">DR/BDR alese</T>
            <T x={600} y={196} size={11} color="var(--text-2)" anchor="start">R1 ↔ R3: doar 2-WAY</T>
            <T x={600} y={232} size={11} color="var(--muted)" anchor="start">Timere: 10 s / 40 s</T>
          </>
        ) : (
          <>
            <RouterIcon x={200} y={120} label="R1" sub="fără DR" />
            <RouterIcon x={520} y={120} label="R2" sub="fără BDR" />
            <Line x1={200} y1={120} x2={520} y2={120} c="var(--ok)" w={3} />
            <T x={360} y={100} size={11} color="var(--text-2)" anchor="middle">Un singur vecin, o singură adiacență</T>
            <T x={360} y={160} size={11} color="var(--text-2)" anchor="middle">Hello → 224.0.0.5 · fără alegere DR/BDR</T>
            <T x={360} y={232} size={11} color="var(--muted)" anchor="middle">Timere implicite: 10 s / 40 s · Serial HDLC/PPP implicit</T>
          </>
        )}
      </svg>
      <div style={note(isBc ? 'var(--info)' : 'var(--ok)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {isBc
            ? 'Pe broadcast, fiecare DROTHER formează adiacență completă doar cu DR și BDR. Cu n routere ar fi n(n−1)/2 adiacențe; DR-ul reduce numărul lor.'
            : 'Pe point-to-point nu există DR sau BDR: sunt doar două routere, deci alegerea n-ar aduce nimic. Ambele capete trebuie să aibă același tip de rețea.'}
        </div>
      </div>
    </div>
  );
}

/* 5) Costul OSPF: referință / lățime de bandă, minim 1 */
const LINKS: [string, number][] = [
  ['Serial (implicit 1,544 Mbps)', 1.544],
  ['FastEthernet (100 Mbps)', 100],
  ['GigabitEthernet (1000 Mbps)', 1000],
  ['TenGigabitEthernet (10000 Mbps)', 10000],
];
export function OspfCostTable() {
  const [ref, setRef] = useState<'100' | '1000' | '10000'>('100');
  const r = Number(ref);
  const cell: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid var(--border)', textAlign: 'left', fontSize: 13.5 };
  return (
    <div>
      <Seg value={ref} set={setRef} label="Referința (auto-cost reference-bandwidth, Mbps)" items={[['100', '100 (implicit)'], ['1000', '1000'], ['10000', '10000']]} />
      <div style={{ ...note('var(--info)'), padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cell}>Interfață</th>
              <th style={cell}>Lățime (Mbps)</th>
              <th style={cell}>Cost = ref / bw (min 1)</th>
            </tr>
          </thead>
          <tbody>
            {LINKS.map(([name, bw]) => (
              <tr key={name}>
                <td style={cell}>{name}</td>
                <td style={cell}>{bw}</td>
                <td style={{ ...cell, fontWeight: 700, color: 'var(--accent)' }}>{Math.max(1, Math.floor(r / bw))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>
        Cu referința implicită de 100 Mbps, FastEthernet, GigabitEthernet și 10G au toate costul 1, deci OSPF nu deosebește calea rapidă de cea lentă. Setează referința la 1000 sau 10000 pe toate routerele pentru o alegere corectă. Serialul cu 1,544 Mbps are costul 64 cu referința implicită.
      </div>
    </div>
  );
}

/* 6) Topologie laborator ghidat 3.4 */
export function LabGuidedTopology34() {
  return (
    <svg viewBox="0 0 760 280" role="img" aria-label="Topologie lab 3.4: R1, R2 și R3 pe un segment comun 10.0.0.0/24 prin SW1, un link punct-la-punct R1–R2 și PC3 în spatele lui R3">
      <SwitchIcon x={280} y={150} label="SW1" />
      <RouterIcon x={120} y={150} label="R1" />
      <RouterIcon x={440} y={50} label="R2" />
      <RouterIcon x={440} y={240} label="R3" />
      <ClientIcon x={680} y={240} kind="pc" label="PC3" />
      <Line x1={142} y1={150} x2={258} y2={150} />
      <Line x1={300} y1={140} x2={420} y2={66} />
      <Line x1={300} y1={160} x2={420} y2={226} />
      <Line x1={142} y1={140} x2={420} y2={62} c="var(--violet)" dash="6 5" />
      <Line x1={462} y1={240} x2={650} y2={240} />
      <T x={200} y={130} size={10} m color="var(--muted)">Gi0/0 · 10.0.0.0/24</T>
      <T x={300} y={40} size={10} m color="var(--violet)">Gi0/1 ↔ Gi0/1 · 10.0.12.0/30 (p2p)</T>
      <T x={560} y={150} size={10} m color="var(--muted)">Gi0/0 · 10.0.0.0/24</T>
      <T x={560} y={218} size={10} m color="var(--muted)">Gi0/1 → LAN 192.168.30.0/24</T>
      <T x={440} y={20} size={10} m color="var(--muted)">Lo0 2.2.2.2</T>
    </svg>
  );
}

/* 7) Topologie lab solo 3.4 */
export function LabSoloTopology34() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Topologie lab solo 3.4: segment 172.16.0.0/24 cu A, B și C; D legat de A (p2p) și de C (backup)">
      <SwitchIcon x={200} y={130} label="SW" />
      <RouterIcon x={200} y={40} label="B" />
      <RouterIcon x={200} y={220} label="C" />
      <RouterIcon x={380} y={130} label="A" />
      <RouterIcon x={600} y={130} label="D" />
      <ClientIcon x={380} y={230} kind="pc" label="LAN A" />
      <ClientIcon x={680} y={70} kind="pc" label="LAN D" />
      <Line x1={200} y1={58} x2={200} y2={112} />
      <Line x1={200} y1={202} x2={200} y2={148} />
      <Line x1={228} y1={130} x2={356} y2={130} />
      <Line x1={404} y1={130} x2={576} y2={130} c="var(--ok)" w={3} />
      <Line x1={226} y1={210} x2={576} y2={150} c="var(--warn)" w={2} dash="6 5" />
      <Line x1={620} y1={130} x2={680} y2={80} />
      <Line x1={380} y1={160} x2={380} y2={206} />
      <T x={290} y={122} size={10} m color="var(--muted)">172.16.0.0/24</T>
      <T x={490} y={120} size={10} m color="var(--ok)">Gi0/2 ↔ Gi0/0 · 10.0.4.0/30</T>
      <T x={410} y={190} size={10} m color="var(--muted)">Gi0/1 · 192.168.50.0/24</T>
      <T x={470} y={176} size={10} m color="var(--warn)">backup Gi0/1 ↔ Gi0/1 · 10.0.5.0/30</T>
      <T x={640} y={60} size={10} m color="var(--muted)">Gi0/2 · 192.168.60.0/24</T>
    </svg>
  );
}
