import { useState } from 'react';
import { ClientIcon, SwitchIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 2.5 (Rapid PVST+). Culori doar prin var(--…). */

/* 1) Alegerea root bridge și a rolurilor, pe un triunghi de 3 switch-uri (toate linkurile 1 Gbps, cost 4) */
type Sw = 'SW1' | 'SW2' | 'SW3';
const MAC: Record<Sw, string> = { SW1: '0000.0000.00A1', SW2: '0000.0000.00B2', SW3: '0000.0000.00C3' };
const PRIOS = ['4096', '24576', '32768'] as const;
export function RootElection() {
  const [pr, setPr] = useState<Record<Sw, string>>({ SW1: '32778', SW2: '32778', SW3: '32778' });
  // prioritate afișată = prioritate configurată + VLAN (10) -> aici folosim VLAN 10 ⇒ +10
  const base: Record<Sw, number> = { SW1: Number(pr.SW1) - 10, SW2: Number(pr.SW2) - 10, SW3: Number(pr.SW3) - 10 };
  const sws: Sw[] = ['SW1', 'SW2', 'SW3'];
  const bid = (s: Sw) => `${pr[s]}|${MAC[s]}`;
  const root = [...sws].sort((a, b) => Number(pr[a]) - Number(pr[b]) || MAC[a].localeCompare(MAC[b]))[0];
  const others = sws.filter((s) => s !== root);
  const [x, y] = [others[0], others[1]];
  // linkul dintre cei doi non-root: designated pe cel cu BID mai mic, alternate pe celălalt
  const lowBid = [x, y].sort((a, b) => Number(pr[a]) - Number(pr[b]) || MAC[a].localeCompare(MAC[b]))[0];
  const alt = lowBid === x ? y : x;
  const pos: Record<Sw, [number, number]> = { SW1: [360, 60], SW2: [130, 190], SW3: [590, 190] };
  const setP = (s: Sw, v: string) => setPr({ ...pr, [s]: String(Number(v) + 10) });
  const cur = (s: Sw) => String(base[s]);
  const mid = (a: Sw, b: Sw): [number, number] => [(pos[a][0] + pos[b][0]) / 2, (pos[a][1] + pos[b][1]) / 2];
  const edges: [Sw, Sw][] = [['SW1', 'SW2'], ['SW1', 'SW3'], ['SW2', 'SW3']];
  return (
    <div>
      {sws.map((s) => (
        <div key={s} className="small" style={{ marginBottom: 2 }}>
          {s} — priority:
          <Seg value={cur(s) as typeof PRIOS[number]} set={(v) => setP(s, v)} label={`Prioritate ${s}`} items={PRIOS.map((p) => [p, p] as [typeof PRIOS[number], string])} />
        </div>
      ))}
      <svg viewBox="0 0 720 270" role="img" aria-label="Alegerea root bridge și a rolurilor pe un triunghi de trei switch-uri">
        {edges.map(([a, b]) => {
          const isAltLink = !(a === root || b === root);
          const [ax, ay] = pos[a]; const [bx, by] = pos[b];
          const blocked = isAltLink;
          return <Line key={a + b} x1={ax} y1={ay} x2={bx} y2={by} c={blocked ? 'var(--warn)' : 'var(--ok)'} w={3} dash={blocked ? '8 6' : undefined} />;
        })}
        {edges.map(([a, b]) => {
          const [mx, my] = mid(a, b);
          const isAltLink = !(a === root || b === root);
          return <T key={'c' + a + b} x={mx} y={my - 6} size={10} m color="var(--muted)">{isAltLink ? 'cost 4 · link neutilizat' : 'cost 4'}</T>;
        })}
        {sws.map((s) => {
          const [px, py] = pos[s];
          return (
            <g key={s}>
              <rect x={px - 78} y={py - 34} width={156} height={68} rx={10} fill={s === root ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={s === root ? 'var(--accent)' : 'var(--border)'} strokeWidth={s === root ? 2.6 : 1.4} />
              <T x={px} y={py - 14} weight={700} size={12}>{s}{s === root ? ' · ROOT BRIDGE' : ''}</T>
              <T x={px} y={py + 2} size={9.5} m color="var(--muted)">{bid(s)}</T>
              <T x={px} y={py + 20} size={10} color={s === root ? 'var(--accent)' : s === alt ? 'var(--warn)' : 'var(--ok)'}>
                {s === root ? 'toate porturile: Designated' : s === alt ? 'Root + ALTERNATE (spre vecin)' : 'Root + Designated (spre vecin)'}
              </T>
            </g>
          );
        })}
        <T x={360} y={262} size={10.5} color="var(--muted)">Cel mai mic Bridge ID (prioritate, apoi MAC) = root. Prioritate afișată 32778 = 32768 + VLAN 10 (extended system ID). Costuri: 1 Gbps = 4 (short method).</T>
      </svg>
    </div>
  );
}

/* 2) Stările STP clasic vs RSTP */
const MAP: { stp: string; rstp: string; fwd: boolean; learn: boolean; t: string }[] = [
  { stp: 'Disabled', rstp: 'Discarding', fwd: false, learn: false, t: 'Port administrativ oprit (shutdown) sau fără link. În RSTP e raportat ca „Discarding”.' },
  { stp: 'Blocking', rstp: 'Discarding', fwd: false, learn: false, t: 'Primește BPDU, nu trimite cadre de date, nu învață MAC. Max-age 20 s la STP clasic.' },
  { stp: 'Listening', rstp: 'Discarding', fwd: false, learn: false, t: 'Participă la alegeri (BPDU), încă nu învață MAC. 15 s (forward delay).' },
  { stp: 'Learning', rstp: 'Learning', fwd: false, learn: true, t: 'Învață adrese MAC, încă nu trimite date. 15 s la STP clasic; în RSTP scurt sau sărit prin handshake.' },
  { stp: 'Forwarding', rstp: 'Forwarding', fwd: true, learn: true, t: 'Trimite date și învață MAC: starea normală a unui port activ.' },
];
export function StateMap() {
  const [i, setI] = useState(1);
  const m = MAP[i];
  return (
    <div>
      <Seg value={String(i)} set={(k) => setI(Number(k))} label="Stare STP" items={MAP.map((s, k) => [String(k), s.stp] as [string, string])} />
      <svg viewBox="0 0 720 200" role="img" aria-label="Maparea stărilor 802.1D la stările 802.1w">
        <T x={150} y={24} weight={700}>STP clasic (802.1D)</T><T x={570} y={24} weight={700}>RSTP (802.1w)</T>
        {MAP.map((s, k) => (
          <g key={k}>
            <rect x={60} y={36 + k * 28} width={180} height={22} rx={5} fill={k === i ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={k === i ? 'var(--accent)' : 'var(--border)'} />
            <T x={150} y={52 + k * 28} size={11} weight={k === i ? 700 : 500}>{s.stp}</T>
            <rect x={480} y={36 + k * 28} width={180} height={22} rx={5} fill={s.rstp === m.rstp && k === i ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={s.rstp === m.rstp && k === i ? 'var(--accent)' : 'var(--border)'} />
            <T x={570} y={52 + k * 28} size={11} weight={k === i ? 700 : 500}>{s.rstp}</T>
            {k === i && <Line x1={240} y1={47 + k * 28} x2={480} y2={47 + k * 28} c="var(--accent)" w={2} />}
          </g>
        ))}
        <T x={360} y={190} size={10.5} color="var(--text-2)">{`Trimite date: ${m.fwd ? 'DA' : 'nu'} · Învață MAC: ${m.learn ? 'DA' : 'nu'} — ${m.t.length > 78 ? m.t.slice(0, m.t.lastIndexOf(' ', 78)) + '…' : m.t}`}</T>
      </svg>
    </div>
  );
}

/* 3) Handshake proposal/agreement */
const HS = [
  { t: '1. Link nou între SW-A (root) și SW-B', d: 'Portul lui SW-A devine Designated în Discarding. SW-B are porturi de nivel 2 deja active.' },
  { t: '2. Proposal', d: 'SW-A trimite un BPDU RSTP cu flagul Proposal: „eu sunt calea mai bună spre root, pot trece în forwarding?”' },
  { t: '3. SW-B sincronizează', d: 'SW-B pune temporar în Discarding toate porturile non-edge (sync), ca să nu creeze o buclă; porturile edge (PortFast) nu se blochează.' },
  { t: '4. Agreement', d: 'SW-B răspunde cu BPDU cu flagul Agreement și își marchează portul ca Root Port.' },
  { t: '5. Forwarding', d: 'SW-A trece imediat portul în Forwarding (fără 2 × 15 s). SW-B repetă handshake-ul spre switch-urile din aval.' },
];
export function Handshake() {
  const [s, setS] = useState(0);
  return (
    <div>
      <Seg value={String(s)} set={(k) => setS(Number(k))} label="Pas handshake" items={HS.map((_, i) => [String(i), `Pas ${i + 1}`] as [string, string])} />
      <svg viewBox="0 0 720 200" role="img" aria-label="Handshake proposal/agreement în RSTP">
        <SwitchIcon x={140} y={80} label="" /><T x={140} y={52} weight={700}>SW-A (root)</T>
        <SwitchIcon x={580} y={80} label="" /><T x={580} y={52} weight={700}>SW-B</T>
        <Line x1={172} y1={80} x2={548} y2={80} c={s === 4 ? 'var(--ok)' : 'var(--warn)'} w={3} dash={s === 4 ? undefined : '8 6'} flow={s === 4} />
        {s === 1 && <T x={360} y={70} weight={700} color="var(--accent)">Proposal ➜</T>}
        {s === 3 && <T x={360} y={70} weight={700} color="var(--ok)">⟵ Agreement</T>}
        {s === 2 && <T x={580} y={122} size={11} color="var(--warn)">sync: porturile non-edge ⇒ Discarding</T>}
        <T x={150} y={110} size={10.5} m color="var(--muted)">{s === 4 ? 'Designated · Forwarding' : 'Designated · Discarding'}</T>
        <T x={580} y={140} size={10.5} m color="var(--muted)">{s >= 3 ? 'Root Port' : 'port în așteptare'}</T>
        <rect x={40} y={150} width={640} height={40} rx={8} fill="var(--surface-2)" stroke="var(--border)" />
        <T x={52} y={168} anchor="start" size={11} weight={700}>{HS[s].t}</T>
        <T x={52} y={184} anchor="start" size={10} color="var(--text-2)">{HS[s].d.length > 118 ? HS[s].d.slice(0, HS[s].d.lastIndexOf(' ', 118)) + '…' : HS[s].d}</T>
      </svg>
    </div>
  );
}

/* 4) Protecții: ce face fiecare când primește un BPDU / pierde BPDU-uri */
type G = 'portfast' | 'bpduguard' | 'bpdufilter' | 'rootguard' | 'loopguard';
const GUARD: Record<G, { name: string; where: string; trigger: string; result: string; col: string }> = {
  portfast: { name: 'PortFast', where: 'port edge (host, server, telefon)', trigger: 'link up', result: 'Port direct în Forwarding (fără handshake). Dacă primește BPDU, pierde starea edge și devine port STP normal.', col: 'var(--ok)' },
  bpduguard: { name: 'BPDU Guard', where: 'port edge cu PortFast', trigger: 'primește ORICE BPDU', result: 'Portul intră în err-disabled (shutdown logic) până îl repornești manual sau prin errdisable recovery.', col: 'var(--bad)' },
  bpdufilter: { name: 'BPDU Filter', where: 'port edge (folosit cu grijă)', trigger: 'de interfață: nu trimite/primește BPDU; global: doar la pornire', result: 'Pe interfață: filtrează BPDU ⇒ STP dezactivat pe port (risc de buclă). Global (cu portfast default): dacă apare BPDU, portul revine la STP normal.', col: 'var(--warn)' },
  rootguard: { name: 'Root Guard', where: 'porturi spre switch-uri care NU trebuie să devină root', trigger: 'primește BPDU superior (mai bun)', result: 'Portul intră în root-inconsistent (blocat); revine singur când BPDU-urile superioare încetează.', col: 'var(--violet)' },
  loopguard: { name: 'Loop Guard', where: 'Root și Alternate porturi (linkuri punct-la-punct)', trigger: 'nu mai primește BPDU', result: 'Portul intră în loop-inconsistent (blocat) în loc să devină Designated și să creeze o buclă; revine când BPDU-urile reapar.', col: 'var(--info)' },
};
export function Guards() {
  const [g, setG] = useState<G>('bpduguard');
  const d = GUARD[g];
  return (
    <div>
      <Seg value={g} set={setG} label="Mecanism de protecție" items={(Object.keys(GUARD) as G[]).map((k) => [k, GUARD[k].name] as [G, string])} />
      <svg viewBox="0 0 720 210" role="img" aria-label="Ce face fiecare mecanism de protecție STP">
        <SwitchIcon x={150} y={70} label="" /><T x={150} y={38} weight={700}>Switch</T>
        <ClientIcon x={600} y={70} kind="pc" label={g === 'rootguard' || g === 'loopguard' ? 'Switch vecin' : 'Host / switch neautorizat'} />
        <Line x1={182} y1={70} x2={568} y2={70} c={d.col} w={3} />
        <rect x={50} y={116} width={620} height={84} rx={9} fill="var(--surface-2)" stroke={d.col} strokeWidth={1.6} />
        <T x={64} y={136} anchor="start" size={12} weight={700} color={d.col}>{d.name}</T>
        <T x={64} y={154} anchor="start" size={10.5} color="var(--text-2)">{`Unde: ${d.where}`}</T>
        <T x={64} y={170} anchor="start" size={10.5} color="var(--text-2)">{`Declanșator: ${d.trigger}`}</T>
        <T x={64} y={186} anchor="start" size={10.5}>{d.result.length > 112 ? d.result.slice(0, d.result.lastIndexOf(' ', 112)) : d.result}</T>
      </svg>
    </div>
  );
}

/* 5) Topologii laborator */
export function LabGuidedTopology25() {
  return (
    <svg viewBox="0 0 720 280" role="img" aria-label="Topologie lab ghidat 2.5: trei switch-uri în triunghi, host pe SW3">
      <SwitchIcon x={360} y={70} label="" /><T x={360} y={36} weight={700}>SW1</T>
      <SwitchIcon x={140} y={190} label="" /><T x={140} y={156} weight={700}>SW2</T>
      <SwitchIcon x={580} y={190} label="" /><T x={580} y={156} weight={700}>SW3</T>
      <Line x1={332} y1={86} x2={168} y2={174} /><Line x1={388} y1={86} x2={552} y2={174} /><Line x1={172} y1={190} x2={548} y2={190} />
      <T x={230} y={118} size={9.5} m color="var(--muted)">Gi0/1 ⟷ Gi0/1</T><T x={490} y={118} size={9.5} m color="var(--muted)">Gi0/2 ⟷ Gi0/1</T><T x={360} y={182} size={9.5} m color="var(--muted)">Gi0/2 ⟷ Gi0/2</T>
      <Line x1={580} y1={206} x2={580} y2={244} /><ClientIcon x={580} y={254} kind="pc" label="PC1 · Fa0/5" />
      <T x={140} y={248} size={10.5} color="var(--muted)">VLAN 10, 20 (trunk între toate)</T>
    </svg>
  );
}
export function LabSoloTopology25() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Topologie lab solo 2.5: patru switch-uri, root dorit pe SW-A, host pe SW-D">
      <SwitchIcon x={140} y={70} label="" /><T x={140} y={36} weight={700}>SW-A</T>
      <SwitchIcon x={580} y={70} label="" /><T x={580} y={36} weight={700}>SW-B</T>
      <SwitchIcon x={140} y={190} label="" /><T x={140} y={156} weight={700}>SW-C</T>
      <SwitchIcon x={580} y={190} label="" /><T x={580} y={156} weight={700}>SW-D</T>
      <Line x1={172} y1={70} x2={548} y2={70} /><Line x1={140} y1={102} x2={140} y2={158} /><Line x1={580} y1={102} x2={580} y2={158} /><Line x1={172} y1={190} x2={548} y2={190} />
      <ClientIcon x={680} y={210} kind="pc" label="PC · Fa0/5" /><Line x1={612} y1={190} x2={660} y2={204} />
      <T x={360} y={246} size={10.5} color="var(--muted)">Inel de 4 switch-uri: root primary SW-A, secondary SW-B; PortFast + BPDU Guard pe portul PC</T>
    </svg>
  );
}
