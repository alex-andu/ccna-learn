import { useState, type CSSProperties } from 'react';
import { RouterIcon, SwitchIcon, ClientIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 4.2 (NTP). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Ierarhia de straturi (stratum) */
const LEVELS = [
  { s: 0, name: 'Sursă de timp de referință', ex: 'ceas atomic / GPS', d: 'Nu este un dispozitiv de rețea: este hardware-ul de timp. Nu răspunde direct în rețea.' },
  { s: 1, name: 'Server stratum 1', ex: 'server legat direct la stratum 0', d: 'Primește timpul direct de la sursa de referință; este cel mai precis server accesibil prin rețea.' },
  { s: 2, name: 'Stratum 2', ex: 'ntp.exemplu.ro · ntp server …', d: 'Se sincronizează de la un stratum 1. Un server din rețeaua ta poate fi stratum 2.' },
  { s: 3, name: 'Stratum 3', ex: 'R1 (ntp master 3 sau client)', d: 'Se sincronizează de la un stratum 2; este tipic pentru routerul de la marginea rețelei tale.' },
  { s: 4, name: 'Stratum 4', ex: 'R2, switch-uri', d: 'Clienții routerului R1 devin stratum 4: fiecare salt adaugă 1.' },
];
export function StratumTree() {
  const [sel, setSel] = useState(3);
  const cur = LEVELS[sel];
  return (
    <div>
      <Seg value={String(sel)} set={(k) => setSel(Number(k))} label="Alege stratul" items={LEVELS.map((l) => [String(l.s) as string, 'Stratum ' + l.s] as [string, string])} />
      <svg viewBox="0 0 720 270" role="img" aria-label="Ierarhia NTP: de la sursa de referință stratum 0, prin servere stratum 1, 2, 3 și 4; fiecare nivel primește timpul de la cel de deasupra">
        {LEVELS.map((l, i) => {
          const on = sel === l.s;
          const y = 12 + i * 50;
          return (
            <g key={l.s} onClick={() => setSel(l.s)} style={{ cursor: 'pointer' }}>
              <rect x={150 + i * 18} y={y} width={300 - i * 36 + 120} height={38} rx={8} fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={on ? 'var(--accent)' : 'var(--border)'} strokeWidth={on ? 2 : 1.2} />
              <T x={360} y={y + 24} size={12} weight={on ? 700 : 500}>{'Stratum ' + l.s + ' — ' + l.name}</T>
              {i > 0 && <Line x1={360} y1={y - 12} x2={360} y2={y} c="var(--text-2)" w={1.5} />}
            </g>
          );
        })}
        <T x={60} y={140} size={11} color="var(--muted)" weight={650}>↓ timpul curge</T>
        <T x={60} y={156} size={11} color="var(--muted)">în jos</T>
        <T x={660} y={256} size={11} color="var(--bad)" weight={650} anchor="end">Stratum 16 = nesincronizat</T>
      </svg>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          <b>Stratum {cur.s}</b> — {cur.name} (ex.: {cur.ex}). {cur.d}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Un stratum mai mic înseamnă mai aproape de sursa de referință, nu neapărat „mai bun” în orice situație. Valoarea maximă utilizabilă este 15; <b>16 = nesincronizat</b>.</div>
      </div>
    </div>
  );
}

/* 2) Schimbul de mesaje NTP, cu cele 4 marcaje de timp */
const STEPS = [
  { t: 'Clientul trimite cererea', d: 'Clientul notează ora lui locală la trimitere: T1 = 100,000 s (ceasul clientului).' },
  { t: 'Serverul primește cererea', d: 'Serverul notează ora lui la recepție: T2 = 110,050 s (ceasul serverului). Diferența mare arată că ceasurile nu coincid.' },
  { t: 'Serverul trimite răspunsul', d: 'Serverul notează ora la trimiterea răspunsului: T3 = 110,060 s, apoi pune T1, T2 și T3 în pachet.' },
  { t: 'Clientul primește răspunsul', d: 'Clientul notează ora la recepție: T4 = 100,110 s. Acum are toate cele patru valori și poate calcula.' },
  { t: 'Calculul', d: 'Offset = ((T2 − T1) + (T3 − T4)) / 2 = ((10,050) + (9,950)) / 2 = +10,000 s. Delay = (T4 − T1) − (T3 − T2) = 0,110 − 0,010 = 0,100 s. Clientul își corectează ceasul cu 10 s.' },
];
export function NtpExchange() {
  const [n, setN] = useState(0);
  const vis = (k: number) => n >= k;
  return (
    <div>
      <Seg value={String(n)} set={(k) => setN(Number(k))} label="Pasul" items={STEPS.map((_s, i) => [String(i), String(i + 1)] as [string, string])} />
      <svg viewBox="0 0 720 260" role="img" aria-label="Diagramă de secvență NTP între client și server, cu marcajele de timp T1 la T4">
        <T x={120} y={22} size={13} weight={700}>Client</T>
        <T x={600} y={22} size={13} weight={700}>Server NTP</T>
        <Line x1={120} y1={34} x2={120} y2={250} c="var(--border)" w={2} />
        <Line x1={600} y1={34} x2={600} y2={250} c="var(--border)" w={2} />
        {vis(0) && <><Line x1={120} y1={70} x2={600} y2={100} c="var(--accent)" w={2.5} /><T x={360} y={72} size={11} color="var(--accent)" weight={650}>cerere NTP (UDP 123)</T><T x={105} y={74} size={11} anchor="end" m>T1 = 100,000</T></>}
        {vis(1) && <T x={615} y={104} size={11} anchor="start" m>T2 = 110,050</T>}
        {vis(2) && <><Line x1={600} y1={120} x2={120} y2={170} c="var(--ok)" w={2.5} /><T x={360} y={132} size={11} color="var(--ok)" weight={650}>răspuns (T1, T2, T3)</T><T x={615} y={124} size={11} anchor="start" m>T3 = 110,060</T></>}
        {vis(3) && <T x={105} y={174} size={11} anchor="end" m>T4 = 100,110</T>}
        {vis(4) && <rect x={170} y={190} width={380} height={50} rx={8} fill="var(--surface-2)" stroke="var(--warn)" />}
        {vis(4) && <><T x={360} y={210} size={11.5} weight={700} color="var(--warn)">offset = +10,000 s · delay = 0,100 s</T><T x={360} y={228} size={10.5} color="var(--text-2)">ceasul clientului se ajustează cu +10 s</T></>}
      </svg>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>{STEPS[n].t}.</b> {STEPS[n].d}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Valorile sunt ilustrative. Clientul presupune că întârzierea e simetrică (tur = retur); de aici vine eroarea reziduală a NTP.</div>
      </div>
    </div>
  );
}

/* 3) Moduri NTP */
export function NtpModes() {
  return (
    <svg viewBox="0 0 740 280" role="img" aria-label="Cele patru moduri NTP: client/server, symmetric active (peer), broadcast și ntp master">
      <T x={370} y={20} size={13} weight={700}>Moduri NTP pe Cisco</T>
      <Box x={20} y={40} w={160} h={44} label="Server" sub="ntp master 3" c="var(--ok)" />
      <Box x={20} y={150} w={160} h={44} label="Client" sub="ntp server 10.0.0.1" c="var(--accent)" />
      <Line x1={100} y1={84} x2={100} y2={150} c="var(--ok)" w={2.5} flow />
      <T x={135} y={122} size={10.5} anchor="start" color="var(--text-2)">client/server</T>
      <Box x={230} y={40} w={150} h={44} label="Peer A" sub="ntp peer B" c="var(--info)" />
      <Box x={230} y={150} w={150} h={44} label="Peer B" sub="ntp peer A" c="var(--info)" />
      <Line x1={305} y1={84} x2={305} y2={150} c="var(--info)" w={2.5} />
      <T x={320} y={122} size={10.5} anchor="start" color="var(--text-2)">symmetric active</T>
      <Box x={430} y={40} w={150} h={44} label="Broadcaster" sub="ntp broadcast" c="var(--violet)" />
      <Box x={430} y={150} w={150} h={44} label="Client" sub="ntp broadcast client" c="var(--violet)" />
      <Line x1={505} y1={84} x2={505} y2={150} c="var(--violet)" w={2.5} dash="5 4" />
      <T x={520} y={122} size={10.5} anchor="start" color="var(--text-2)">broadcast</T>
      <rect x={20} y={215} width={700} height={50} rx={8} fill="var(--surface-2)" stroke="var(--border)" />
      <T x={370} y={236} size={11.5} color="var(--text-2)">La CCNA contează client/server (ntp server) și ntp master. Peer și broadcast: doar să le recunoști.</T>
      <T x={370} y={254} size={10.5} color="var(--muted)">Doar un router fără altă sursă de timp are sens ca ntp master în laborator.</T>
    </svg>
  );
}

/* 4) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label={solo ? 'Topologie lab solo NTP: R1 server, R2 client cu autentificare, SW1' : 'Topologie lab ghidat NTP: R1 server, R2 și R3 clienți'}>
      <RouterIcon x={380} y={60} label="R1" sub={solo ? 'ntp master 2 + auth' : 'ntp master 3 · 10.0.0.1'} />
      <SwitchIcon x={380} y={140} label="SW1" />
      <RouterIcon x={170} y={180} label="R2" sub={solo ? 'client · key 1' : 'client · 10.0.0.2'} />
      {!solo && <RouterIcon x={590} y={180} label="R3" sub="client · 10.0.0.3" />}
      {solo && <ClientIcon x={590} y={180} kind="pc" label="PC (log)" />}
      <Line x1={380} y1={82} x2={380} y2={120} /><Line x1={358} y1={148} x2={190} y2={172} /><Line x1={402} y1={148} x2={570} y2={172} />
      <T x={380} y={216} size={10.5} color="var(--muted)">{solo ? 'LAN 10.0.0.0/24 — cheia NTP 1 trebuie să coincidă pe ambele routere' : 'LAN 10.0.0.0/24 — R1 e sursa de timp a laboratorului'}</T>
    </svg>
  );
}
export const LabGuidedTopology42 = () => <Topo solo={false} />;
export const LabSoloTopology42 = () => <Topo solo />;
