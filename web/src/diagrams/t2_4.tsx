import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 2.4 (EtherChannel / LACP). Culori doar prin var(--…). */

/* 1) De ce EtherChannel: STP blochează linkul redundant; EtherChannel le folosește pe amândouă */
export function WhyBundle() {
  const [b, setB] = useState<'stp' | 'bundle'>('stp');
  return (
    <div>
      <Seg value={b} set={setB} label="Cu sau fără EtherChannel" items={[['stp', '2 linkuri separate (STP)'], ['bundle', 'EtherChannel (Po1)']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Comparație: linkuri paralele blocate de STP versus EtherChannel">
        <SwitchIcon x={140} y={100} label="" /><T x={140} y={152} weight={700}>SW1</T>
        <SwitchIcon x={580} y={100} label="" /><T x={580} y={152} weight={700}>SW2</T>
        {b === 'stp' ? (
          <g>
            <Line x1={172} y1={86} x2={548} y2={86} c="var(--ok)" w={3} flow />
            <Line x1={172} y1={114} x2={548} y2={114} c="var(--bad)" w={3} dash="8 6" />
            <T x={360} y={76} size={11} color="var(--ok)" weight={700}>Gi0/1 — forwarding (1 Gbps folosit)</T>
            <T x={360} y={134} size={11} color="var(--bad)" weight={700}>Gi0/2 — blocat de STP (1 Gbps irosit)</T>
            <T x={360} y={190} size={11} color="var(--muted)">STP vede două căi între aceleași switch-uri = buclă ⇒ blochează una. Capacitate utilă: 1 Gbps.</T>
          </g>
        ) : (
          <g>
            <rect x={200} y={62} width={320} height={76} rx={38} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} />
            <Line x1={172} y1={86} x2={548} y2={86} c="var(--ok)" w={3} flow />
            <Line x1={172} y1={114} x2={548} y2={114} c="var(--ok)" w={3} flow />
            <T x={360} y={103} size={12} weight={700} color="var(--accent)">Port-channel 1 (un singur link logic)</T>
            <T x={360} y={190} size={11} color="var(--muted)">STP vede UN link logic ⇒ nu blochează. Capacitate: ≈2 Gbps (agregat), cu repartizare pe flux; dacă un membru cade, restul continuă.</T>
          </g>
        )}
      </svg>
    </div>
  );
}

/* 2) Matricea de moduri: ce se întâmplă pentru fiecare pereche */
type Mode = 'active' | 'passive' | 'desirable' | 'auto' | 'on';
const PROTO: Record<Mode, string> = { active: 'LACP', passive: 'LACP', desirable: 'PAgP', auto: 'PAgP', on: 'static' };
function outcome(a: Mode, b: Mode): { ok: boolean; why: string } {
  if (a === 'on' && b === 'on') return { ok: true, why: 'Static: ambele capete forțează canalul, fără negociere. Funcționează, dar fără protecție la configurări greșite.' };
  if (a === 'on' || b === 'on') return { ok: false, why: '„on” nu trimite și nu înțelege pachete LACP/PAgP; celălalt capăt așteaptă negociere ⇒ canalul nu se formează (și un capăt „on” poate crea probleme/bucle).' };
  if (PROTO[a] !== PROTO[b]) return { ok: false, why: 'Protocoale diferite: LACP (active/passive) nu vorbește cu PAgP (desirable/auto). Nu se formează.' };
  if (PROTO[a] === 'LACP') return a === 'passive' && b === 'passive'
    ? { ok: false, why: 'passive + passive: niciunul nu inițiază negocierea ⇒ nu se formează.' }
    : { ok: true, why: 'Cel puțin un capăt este active ⇒ trimite LACPDU și celălalt răspunde ⇒ canal LACP.' };
  return a === 'auto' && b === 'auto'
    ? { ok: false, why: 'auto + auto: niciunul nu inițiază ⇒ nu se formează.' }
    : { ok: true, why: 'Cel puțin un capăt este desirable ⇒ inițiază și celălalt răspunde ⇒ canal PAgP.' };
}
export function ModeMatrix() {
  const modes: Mode[] = ['active', 'passive', 'desirable', 'auto', 'on'];
  const [a, setA] = useState<Mode>('active');
  const [b, setB] = useState<Mode>('passive');
  const r = outcome(a, b);
  const col = (m: Mode) => (m === 'active' || m === 'passive' ? 'var(--accent)' : m === 'desirable' || m === 'auto' ? 'var(--violet)' : 'var(--warn)');
  return (
    <div>
      <div className="small" style={{ marginBottom: 6 }}>SW1 — channel-group mode:</div>
      <Seg value={a} set={setA} label="Mod SW1" items={modes.map((m) => [m, m] as [Mode, string])} />
      <div className="small" style={{ marginBottom: 6 }}>SW2 — channel-group mode:</div>
      <Seg value={b} set={setB} label="Mod SW2" items={modes.map((m) => [m, m] as [Mode, string])} />
      <svg viewBox="0 0 720 170" role="img" aria-label="Rezultatul negocierii EtherChannel pentru perechea de moduri aleasă">
        <SwitchIcon x={110} y={70} label="" /><T x={110} y={122} weight={700}>SW1</T><T x={110} y={140} m size={11} color={col(a)}>{`${a} (${PROTO[a]})`}</T>
        <SwitchIcon x={610} y={70} label="" /><T x={610} y={122} weight={700}>SW2</T><T x={610} y={140} m size={11} color={col(b)}>{`${b} (${PROTO[b]})`}</T>
        <Line x1={142} y1={58} x2={578} y2={58} c={r.ok ? 'var(--ok)' : 'var(--bad)'} w={3} flow={r.ok} dash={r.ok ? undefined : '8 6'} />
        <Line x1={142} y1={82} x2={578} y2={82} c={r.ok ? 'var(--ok)' : 'var(--bad)'} w={3} flow={r.ok} dash={r.ok ? undefined : '8 6'} />
        <T x={360} y={44} weight={700} size={13} color={r.ok ? 'var(--ok)' : 'var(--bad)'}>{r.ok ? 'Canalul se formează' : 'Canalul NU se formează'}</T>
        <T x={360} y={112} size={10.5} color="var(--text-2)">{r.why.length > 100 ? r.why.slice(0, r.why.lastIndexOf(' ', 100)) : r.why}</T>
        {r.why.length > 100 && <T x={360} y={128} size={10.5} color="var(--text-2)">{r.why.slice(r.why.lastIndexOf(' ', 100) + 1)}</T>}
      </svg>
    </div>
  );
}

/* 3) Repartizarea pe linkuri: hash pe flux (nu pe pachet, nu perfect uniform) */
type Flow = { s: string; d: string; sm: number; dm: number; si: number; di: number };
const FLOWS: Flow[] = [
  { s: 'PC1', d: 'SRV', sm: 1, dm: 9, si: 11, di: 50 },
  { s: 'PC2', d: 'SRV', sm: 2, dm: 9, si: 12, di: 50 },
  { s: 'PC3', d: 'SRV', sm: 3, dm: 9, si: 13, di: 50 },
  { s: 'PC4', d: 'SRV', sm: 4, dm: 9, si: 14, di: 50 },
  { s: 'PC5', d: 'SRV', sm: 5, dm: 9, si: 15, di: 50 },
  { s: 'PC6', d: 'SRV', sm: 6, dm: 9, si: 16, di: 50 },
];
export function LoadBalance() {
  const [m, setM] = useState<'dst-mac' | 'src-mac' | 'src-dst-mac' | 'src-dst-ip'>('src-dst-ip');
  const [n, setN] = useState<2 | 4>(2);
  const hash = (f: Flow) => (m === 'dst-mac' ? f.dm : m === 'src-mac' ? f.sm : m === 'src-dst-mac' ? f.sm ^ f.dm : f.si ^ f.di) % n;
  const per = Array.from({ length: n }, (_, i) => FLOWS.filter((f) => hash(f) === i));
  return (
    <div>
      <Seg value={m} set={setM} label="Metoda de load-balance" items={[['dst-mac', 'dst-mac'], ['src-mac', 'src-mac'], ['src-dst-mac', 'src-dst-mac'], ['src-dst-ip', 'src-dst-ip']]} />
      <Seg value={String(n) as '2' | '4'} set={(k) => setN(Number(k) as 2 | 4)} label="Număr de linkuri" items={[['2', '2 linkuri'], ['4', '4 linkuri']]} />
      <svg viewBox="0 0 720 250" role="img" aria-label="Repartizarea fluxurilor de la 6 PC-uri către un server pe linkurile unui EtherChannel">
        <T x={360} y={20} weight={700} size={12}>6 fluxuri PC1…PC6 → același server (SRV). Hash „{m}” pe {n} linkuri</T>
        {per.map((fl, i) => {
          const y = 48 + i * (n === 2 ? 70 : 42);
          const w = 18 + fl.length * 60;
          return (
            <g key={i}>
              <T x={50} y={y + 16} size={11} m anchor="start">{`Gi0/${i + 1}`}</T>
              <rect x={110} y={y} width={Math.max(w, 6)} height={24} rx={5} fill={fl.length ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={fl.length > 3 ? 'var(--warn)' : 'var(--accent)'} strokeWidth={1.6} />
              <T x={118} y={y + 16} size={11} anchor="start">{fl.length ? fl.map((f) => f.s).join(' · ') : '— gol —'}</T>
              <T x={110 + Math.max(w, 6) + 10} y={y + 16} size={10.5} anchor="start" color="var(--muted)">{`${fl.length} flux(uri)`}</T>
            </g>
          );
        })}
        <T x={360} y={232} size={10.5} color="var(--muted)">Ilustrativ: valorile de hash sunt simplificate (XOR pe ultimii biți). Același flux ⇒ mereu același link; cu dst-mac și un singur server, TOT traficul urcă pe un link.</T>
      </svg>
    </div>
  );
}

/* 4) Topologii laborator */
export function LabGuidedTopology24() {
  return (
    <svg viewBox="0 0 720 270" role="img" aria-label="Topologie lab ghidat 2.4: două switch-uri cu două linkuri paralele și un router L3">
      <SwitchIcon x={170} y={100} label="" /><T x={170} y={60} weight={700}>SW1</T>
      <SwitchIcon x={550} y={100} label="" /><T x={550} y={60} weight={700}>SW2</T>
      <Line x1={202} y1={90} x2={518} y2={90} /><Line x1={202} y1={112} x2={518} y2={112} />
      <T x={360} y={82} size={10} m color="var(--muted)">Gi0/1 ⟷ Gi0/1</T><T x={360} y={128} size={10} m color="var(--muted)">Gi0/2 ⟷ Gi0/2</T>
      <rect x={250} y={74} width={220} height={52} rx={26} fill="none" stroke="var(--accent)" strokeDasharray="5 4" /><T x={360} y={150} size={11} weight={700} color="var(--accent)">Port-channel 1</T>
      <Line x1={170} y1={132} x2={170} y2={190} /><ClientIcon x={170} y={204} kind="pc" label="PC1 · VLAN 10" />
      <Line x1={550} y1={132} x2={550} y2={190} /><ClientIcon x={550} y={204} kind="pc" label="PC2 · VLAN 10" />
      <T x={360} y={256} size={11} color="var(--muted)">Partea L3 (opțional): Po2 dintre două switch-uri multilayer, 10.0.0.0/30</T>
    </svg>
  );
}
export function LabSoloTopology24() {
  return (
    <svg viewBox="0 0 720 250" role="img" aria-label="Topologie lab solo 2.4: trei switch-uri, două EtherChannel-uri">
      <SwitchIcon x={120} y={100} label="" /><T x={120} y={60} weight={700}>SW-A</T>
      <SwitchIcon x={360} y={100} label="" /><T x={360} y={60} weight={700}>SW-B</T>
      <SwitchIcon x={600} y={100} label="" /><T x={600} y={60} weight={700}>SW-C</T>
      <Line x1={152} y1={90} x2={328} y2={90} /><Line x1={152} y1={112} x2={328} y2={112} />
      <Line x1={392} y1={90} x2={568} y2={90} /><Line x1={392} y1={112} x2={568} y2={112} />
      <T x={240} y={80} size={9.5} m color="var(--muted)">Po1 · LACP</T><T x={480} y={80} size={9.5} m color="var(--muted)">Po2 · PAgP</T>
      <RouterIcon x={360} y={196} label="" /><Line x1={360} y1={132} x2={360} y2={176} /><T x={360} y={236} size={11} color="var(--muted)">R1 doar ca țintă de ping (opțional)</T>
    </svg>
  );
}
