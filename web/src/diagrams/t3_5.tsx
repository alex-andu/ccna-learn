import { useState, type CSSProperties } from 'react';
import { RouterIcon, SwitchIcon, ClientIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 3.5 (FHRP: HSRP, VRRP, GLBP). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Fără FHRP vs cu FHRP, când R1 cade */
type Mode = 'off' | 'on';
type Fail = 'ok' | 'down';
export function FhrpFailoverDemo() {
  const [mode, setMode] = useState<Mode>('off');
  const [fail, setFail] = useState<Fail>('ok');
  const down = fail === 'down';
  const viaR1 = !down;
  const works = mode === 'on' || viaR1;
  const gw = mode === 'on' ? '192.168.10.254 (virtual)' : '192.168.10.1 (R1)';
  const pathR1 = viaR1 ? (mode === 'on' ? 'var(--ok)' : 'var(--ok)') : 'var(--bad)';
  const pathR2 = mode === 'on' && down ? 'var(--ok)' : 'var(--border)';
  const txt = mode === 'off'
    ? (down
      ? 'PC-ul are configurat ca default gateway adresa reală a lui R1. R1 a căzut, iar PC-ul nu are altă cale: traficul spre exteriorul subrețelei se pierde, deși R2 funcționează perfect. Ajută doar o intervenție manuală (schimbi gateway-ul pe fiecare gazdă).'
      : 'Totul funcționează, dar R1 este un singur punct de defecțiune: R2 e conectat și gata, însă nicio gazdă nu știe să-l folosească.')
    : (down
      ? 'R1 (Active) a încetat să trimită Hello. După expirarea hold timer-ului, R2 (Standby) devine Active și preia adresa și MAC-ul virtuale. PC-ul continuă să trimită la 192.168.10.254, fără nicio reconfigurare și fără un ARP nou.'
      : 'PC-ul trimite spre adresa virtuală 192.168.10.254. R1 este Active și răspunde la ARP cu MAC-ul virtual; R2 este Standby: ascultă Hello-urile lui R1 și așteaptă.');
  return (
    <div>
      <Seg value={mode} set={setMode} label="Cu sau fără FHRP" items={[['off', 'Fără FHRP'], ['on', 'Cu FHRP (HSRP)']]} />
      <Seg value={fail} set={setFail} label="Starea lui R1" items={[['ok', 'R1 funcționează'], ['down', 'R1 a căzut']]} />
      <svg viewBox="0 0 720 260" role="img" aria-label="Un PC, un switch, două routere R1 și R2 și restul rețelei; traseul se schimbă în funcție de FHRP și de căderea lui R1">
        <ClientIcon x={70} y={130} kind="pc" label="PC" />
        <SwitchIcon x={210} y={130} label="SW" />
        <g opacity={down ? 0.35 : 1}><RouterIcon x={400} y={55} label="R1" sub={mode === 'on' ? 'Active · prio 110' : '192.168.10.1'} /></g>
        <RouterIcon x={400} y={200} label="R2" sub={mode === 'on' ? (down ? 'Active (preluat)' : 'Standby · prio 100') : '192.168.10.2'} />
        <rect x={560} y={100} width={130} height={60} rx={10} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={625} y={126} size={12} weight={650}>Restul rețelei</T>
        <T x={625} y={144} size={10.5} color="var(--muted)">Internet / WAN</T>
        <Line x1={94} y1={130} x2={188} y2={130} c={works ? 'var(--ok)' : 'var(--bad)'} w={3} />
        <Line x1={230} y1={122} x2={372} y2={62} c={pathR1} w={3} dash={down ? '6 5' : undefined} />
        <Line x1={230} y1={138} x2={372} y2={196} c={pathR2} w={mode === 'on' && down ? 3 : 1.5} />
        <Line x1={430} y1={58} x2={560} y2={115} c={viaR1 ? 'var(--ok)' : 'var(--border)'} w={viaR1 ? 3 : 1.5} dash={down ? '6 5' : undefined} />
        <Line x1={430} y1={198} x2={560} y2={145} c={pathR2} w={mode === 'on' && down ? 3 : 1.5} />
        {down && <T x={400} y={22} size={14} weight={700} color="var(--bad)">✗ R1 căzut</T>}
        <T x={70} y={188} size={10.5} m color="var(--muted)">{'gw ' + gw}</T>
        <T x={625} y={200} size={13} weight={700} color={works ? 'var(--ok)' : 'var(--bad)'}>{works ? '✓ trafic OK' : '✗ trafic pierdut'}</T>
      </svg>
      <div style={note(works ? 'var(--ok)' : 'var(--bad)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{txt}</div>
      </div>
    </div>
  );
}

/* 2) ARP către adresa virtuală: ce vede gazda */
export function VirtualGatewayArp() {
  return (
    <svg viewBox="0 0 740 300" role="img" aria-label="PC-ul trimite ARP pentru adresa virtuală 192.168.10.254; routerul Active răspunde cu MAC-ul virtual 0000.0C07.AC01; Standby tace">
      <ClientIcon x={80} y={140} kind="pc" label="PC" />
      <SwitchIcon x={250} y={140} label="SW" />
      <RouterIcon x={470} y={60} label="R1 · Active" sub="MAC real aaaa.0001" />
      <RouterIcon x={470} y={230} label="R2 · Standby" sub="MAC real aaaa.0002" />
      <Line x1={104} y1={140} x2={228} y2={140} />
      <Line x1={272} y1={132} x2={440} y2={68} />
      <Line x1={272} y1={148} x2={440} y2={224} />
      <Line x1={272} y1={140} x2={440} y2={140} c="var(--border)" w={1} dash="3 4" />
      <rect x={560} y={30} width={170} height={64} rx={8} fill="var(--surface-2)" stroke="var(--ok)" />
      <T x={645} y={52} size={11} weight={700} color="var(--ok)">Virtual IP + MAC</T>
      <T x={645} y={70} size={10.5} m color="var(--text-2)">192.168.10.254</T>
      <T x={645} y={86} size={10.5} m color="var(--text-2)">0000.0C07.AC01</T>
      <T x={330} y={20} size={11} color="var(--info)">1. ARP: „cine e 192.168.10.254?” (broadcast)</T>
      <T x={330} y={112} size={11} color="var(--ok)">2. ARP reply de la R1 (unicast, MAC virtual)</T>
      <T x={360} y={270} size={11} color="var(--muted)">R2 primește ARP-ul, dar nu răspunde: doar Active răspunde pentru adresa virtuală.</T>
      <T x={150} y={190} size={10.5} m color="var(--muted)">{'ARP cache PC:'}</T>
      <T x={150} y={206} size={10.5} m color="var(--muted)">{'.254 → 0000.0C07.AC01'}</T>
    </svg>
  );
}

/* 3) Stările HSRP */
type Hs = 'initial' | 'learn' | 'listen' | 'speak' | 'standby' | 'active';
const HORDER: Hs[] = ['initial', 'learn', 'listen', 'speak', 'standby', 'active'];
const HSTATE: Record<Hs, { name: string; txt: string; c: string }> = {
  initial: { name: 'Initial', txt: 'Starea de început: HSRP tocmai a fost configurat sau interfața tocmai a devenit activă. Routerul încă nu participă la alegere.', c: 'var(--muted)' },
  learn: { name: 'Learn', txt: 'Routerul nu cunoaște încă adresa virtuală (nu e configurată pe el) și așteaptă un Hello de la Active ca să o învețe.', c: 'var(--muted)' },
  listen: { name: 'Listen', txt: 'Routerul cunoaște adresa virtuală, dar nu e nici Active, nici Standby. Ascultă Hello-urile celorlalți și așteaptă dacă ei sunt aleși.', c: 'var(--info)' },
  speak: { name: 'Speak', txt: 'Routerul trimite Hello-uri și participă activ la alegerea Active și Standby. Rămâne aici până e ales sau până află că altul e mai potrivit.', c: 'var(--warn)' },
  standby: { name: 'Standby', txt: 'Candidatul de rezervă. Trimite Hello-uri și, dacă Active nu mai trimite Hello (hold timer expirat), preia rolul. Într-un grup există un singur Standby.', c: 'var(--violet)' },
  active: { name: 'Active', txt: 'Routerul care forwardează efectiv traficul gazdelor către adresa virtuală și răspunde la ARP pentru ea cu MAC-ul virtual. Într-un grup există un singur Active.', c: 'var(--ok)' },
};
export function HsrpStates() {
  const [s, setS] = useState<Hs>('active');
  const d = HSTATE[s];
  return (
    <div>
      <Seg value={s} set={setS} label="Starea HSRP" items={HORDER.map((k) => [k, HSTATE[k].name] as [Hs, string])} />
      <svg viewBox="0 0 740 90" role="img" aria-label="Lanțul de stări HSRP: Initial, Learn, Listen, Speak, Standby, Active">
        {HORDER.map((k, i) => {
          const x = 10 + i * 121;
          const act = k === s;
          return (
            <g key={k}>
              <rect x={x} y={18} width={104} height={44} rx={8} fill={act ? 'var(--surface-2)' : 'var(--surface-3)'} stroke={act ? HSTATE[k].c : 'var(--border)'} strokeWidth={act ? 2.5 : 1} />
              <T x={x + 52} y={45} size={12} weight={700} anchor="middle" color={act ? HSTATE[k].c : 'var(--text-2)'}>{HSTATE[k].name}</T>
              {i < HORDER.length - 1 && <Line x1={x + 104} y1={40} x2={x + 121} y2={40} c="var(--border)" w={2} />}
            </g>
          );
        })}
        <T x={370} y={82} size={10.5} color="var(--muted)">Doar Active și Standby apar în show standby brief ca roluri stabile; celelalte sunt stări de tranziție.</T>
      </svg>
      <div style={note(d.c)}>
        <div style={{ fontWeight: 700, color: d.c }}>{d.name}</div>
        <div style={{ fontSize: 13.5, marginTop: 6, color: 'var(--text-2)' }}>{d.txt}</div>
      </div>
    </div>
  );
}

/* 4) Alegerea Active: priority, IP și preempt */
type P1 = 90 | 100 | 110;
type Boot = 'together' | 'late';
type Pre = 'off' | 'on';
export function HsrpElection() {
  const [p1, setP1] = useState<P1>(110);
  const [boot, setBoot] = useState<Boot>('together');
  const [pre, setPre] = useState<Pre>('off');
  // R1 = 192.168.10.1, R2 = 192.168.10.2, prioritatea lui R2 e mereu 100.
  let winner: 'R1' | 'R2';
  let why: string;
  if (boot === 'together') {
    if (p1 > 100) { winner = 'R1'; why = 'Pornesc în același timp: câștigă prioritatea cea mai mare, R1 (' + p1 + ' > 100).'; }
    else if (p1 < 100) { winner = 'R2'; why = 'Pornesc în același timp: R2 are prioritatea mai mare (100 > ' + p1 + ').'; }
    else { winner = 'R2'; why = 'Priorități egale (100): câștigă adresa IP cea mai mare de pe interfață, adică R2 (192.168.10.2 > 192.168.10.1).'; }
  } else if (p1 > 100 && pre === 'on') {
    winner = 'R1'; why = 'R2 era deja Active, dar R1 are prioritate mai mare și preempt activ: R1 preia rolul Active imediat ce aude Hello-ul lui R2.';
  } else if (p1 > 100) {
    winner = 'R2'; why = 'R2 era deja Active. R1 are prioritate mai mare, dar fără preempt nu îi ia rolul: HSRP implicit nu preemptează. R1 devine Standby.';
  } else {
    winner = 'R2'; why = 'R2 era deja Active și R1 nu are prioritate mai mare; indiferent de preempt, R2 rămâne Active.';
  }
  const act = (r: 'R1' | 'R2') => (r === winner ? 'Active' : 'Standby');
  const col = (r: 'R1' | 'R2') => (r === winner ? 'var(--ok)' : 'var(--violet)');
  return (
    <div>
      <Seg value={String(p1) as '90' | '100' | '110'} set={(k) => setP1(Number(k) as P1)} label="Prioritatea lui R1" items={[['90', 'R1 priority 90'], ['100', 'R1 priority 100'], ['110', 'R1 priority 110']]} />
      <Seg value={boot} set={setBoot} label="Momentul pornirii" items={[['together', 'R1 și R2 pornesc împreună'], ['late', 'R1 pornește după ce R2 e Active']]} />
      <Seg value={pre} set={setPre} label="Preempt pe R1" items={[['off', 'standby 1 preempt: dezactivat (implicit)'], ['on', 'standby 1 preempt: activ']]} />
      <svg viewBox="0 0 720 150" role="img" aria-label="Rezultatul alegerii HSRP între R1 și R2, în funcție de prioritate, momentul pornirii și preempt">
        {(['R1', 'R2'] as const).map((r, i) => {
          const x = 60 + i * 340;
          return (
            <g key={r}>
              <rect x={x} y={14} width={260} height={96} rx={10} fill="var(--surface-3)" stroke={col(r)} strokeWidth={2.5} />
              <T x={x + 130} y={40} size={14} weight={700}>{r + (r === 'R1' ? ' · 192.168.10.1' : ' · 192.168.10.2')}</T>
              <T x={x + 130} y={64} size={12} m color="var(--text-2)">{'priority ' + (r === 'R1' ? p1 : 100)}</T>
              <T x={x + 130} y={94} size={16} weight={700} color={col(r)}>{act(r)}</T>
            </g>
          );
        })}
        <T x={360} y={136} size={11} color="var(--muted)">R2 are priority 100 (implicit) și preempt dezactivat</T>
      </svg>
      <div style={note(col(winner))}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{why}</div>
      </div>
    </div>
  );
}

/* 5) Tracking: scade prioritatea când pierzi uplinkul */
export function HsrpTracking() {
  const [up, setUp] = useState<'up' | 'down'>('up');
  const [pre, setPre] = useState<'off' | 'on'>('on');
  const r1 = up === 'up' ? 110 : 90;
  const takeover = up === 'down' && pre === 'on';
  const r1Active = !takeover;
  const txt = up === 'up'
    ? 'Uplinkul lui R1 funcționează: priority 110 (mai mare decât 100 al lui R2). R1 este Active.'
    : takeover
      ? 'Uplinkul lui R1 a căzut: standby 1 track scade prioritatea la 110 − 20 = 90, sub cea a lui R2 (100). Cu preempt activ pe R2, acesta preia rolul Active și gazdele ies prin calea sănătoasă.'
      : 'Uplinkul lui R1 a căzut și prioritatea lui a scăzut la 90, dar R2 nu are preempt: nu îi ia rolul. R1 rămâne Active, deși nu mai are cale spre exterior, iar traficul gazdelor se pierde.';
  return (
    <div>
      <Seg value={up} set={setUp} label="Uplinkul lui R1" items={[['up', 'Uplink R1 funcționează'], ['down', 'Uplink R1 a căzut']]} />
      <Seg value={pre} set={setPre} label="Preempt pe R2" items={[['on', 'R2: standby 1 preempt'], ['off', 'R2: fără preempt']]} />
      <svg viewBox="0 0 720 220" role="img" aria-label="Tracking HSRP: dacă uplinkul lui R1 cade, prioritatea lui scade cu 20; dacă R2 are preempt, preia rolul Active">
        <SwitchIcon x={110} y={110} label="SW" />
        <RouterIcon x={330} y={50} label="R1" sub={'priority ' + r1 + (r1Active ? ' · Active' : ' · Standby')} />
        <RouterIcon x={330} y={175} label="R2" sub={'priority 100' + (r1Active ? ' · Standby' : ' · Active')} />
        <rect x={560} y={85} width={130} height={50} rx={10} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={625} y={115} size={12} weight={650}>Exterior / WAN</T>
        <Line x1={132} y1={104} x2={300} y2={56} c={r1Active ? 'var(--ok)' : 'var(--border)'} w={r1Active ? 3 : 1.5} />
        <Line x1={132} y1={116} x2={300} y2={170} c={r1Active ? 'var(--border)' : 'var(--ok)'} w={r1Active ? 1.5 : 3} />
        <Line x1={360} y1={52} x2={560} y2={100} c={up === 'up' ? 'var(--ok)' : 'var(--bad)'} w={up === 'up' ? 2.5 : 2} dash={up === 'down' ? '6 5' : undefined} />
        <Line x1={360} y1={172} x2={560} y2={122} c="var(--ok)" w={2.5} />
        {up === 'down' && <T x={470} y={62} size={13} weight={700} color="var(--bad)">✗ uplink</T>}
        <T x={470} y={20} size={10.5} m color="var(--muted)">standby 1 track GigabitEthernet0/1 20</T>
      </svg>
      <div style={note(up === 'up' || takeover ? 'var(--ok)' : 'var(--bad)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{txt}</div>
      </div>
    </div>
  );
}

/* 6) GLBP: AVG răspunde cu MAC-uri virtuale diferite */
export function GlbpBalancing() {
  return (
    <svg viewBox="0 0 740 310" role="img" aria-label="GLBP: AVG răspunde la ARP-urile gazdelor cu MAC-uri virtuale diferite, deci gazdele sunt distribuite între routerele AVF">
      <ClientIcon x={60} y={60} kind="pc" label="PC1" />
      <ClientIcon x={60} y={150} kind="pc" label="PC2" />
      <ClientIcon x={60} y={240} kind="pc" label="PC3" />
      <SwitchIcon x={230} y={150} label="SW" />
      <RouterIcon x={470} y={50} label="R1 · AVG + AVF 1" sub="vMAC 0007.B400.0101" />
      <RouterIcon x={470} y={150} label="R2 · AVF 2" sub="vMAC 0007.B400.0102" />
      <RouterIcon x={470} y={250} label="R3 · AVF 3" sub="vMAC 0007.B400.0103" />
      <Line x1={84} y1={60} x2={208} y2={142} /><Line x1={84} y1={150} x2={208} y2={150} /><Line x1={84} y1={240} x2={208} y2={158} />
      <Line x1={252} y1={142} x2={440} y2={56} /><Line x1={252} y1={150} x2={440} y2={150} /><Line x1={252} y1={158} x2={440} y2={244} />
      <T x={620} y={28} size={11} weight={700} color="var(--ok)">PC1 → vMAC …0101</T>
      <T x={620} y={128} size={11} weight={700} color="var(--info)">PC2 → vMAC …0102</T>
      <T x={620} y={228} size={11} weight={700} color="var(--violet)">PC3 → vMAC …0103</T>
      <T x={620} y={290} size={10.5} color="var(--muted)">Adresă virtuală comună: 192.168.10.254</T>
      <T x={150} y={296} size={10.5} color="var(--muted)">Round-robin (implicit): fiecare ARP primește următorul MAC virtual.</T>
    </svg>
  );
}

/* 7) Topologie lab ghidat 3.5 */
export function LabGuidedTopology35() {
  return (
    <svg viewBox="0 0 760 290" role="img" aria-label="Topologie lab 3.5: PC1 și PC2 în LAN-ul 192.168.10.0/24 prin SW1, R1 și R2 ca gateway-uri HSRP, R3 ca destinație">
      <ClientIcon x={60} y={90} kind="pc" label="PC1" />
      <ClientIcon x={60} y={200} kind="pc" label="PC2" />
      <SwitchIcon x={220} y={145} label="SW1" />
      <RouterIcon x={420} y={55} label="R1" sub="Active (110)" />
      <RouterIcon x={420} y={235} label="R2" sub="Standby (100)" />
      <RouterIcon x={650} y={145} label="R3" sub="Lo0 203.0.113.1" />
      <Line x1={84} y1={90} x2={198} y2={140} /><Line x1={84} y1={200} x2={198} y2={152} />
      <Line x1={242} y1={138} x2={392} y2={62} /><Line x1={242} y1={152} x2={392} y2={228} />
      <Line x1={450} y1={62} x2={622} y2={138} /><Line x1={450} y1={228} x2={622} y2={152} />
      <T x={120} y={28} size={10} m color="var(--muted)">LAN 192.168.10.0/24 · VIP .254</T>
      <T x={330} y={80} size={10} m color="var(--muted)">R1 Gi0/0 .1</T>
      <T x={330} y={210} size={10} m color="var(--muted)">R2 Gi0/0 .2</T>
      <T x={560} y={80} size={10} m color="var(--muted)">10.0.1.0/30</T>
      <T x={560} y={222} size={10} m color="var(--muted)">10.0.2.0/30</T>
    </svg>
  );
}

/* 8) Topologie lab solo 3.5 */
export function LabSoloTopology35() {
  return (
    <svg viewBox="0 0 740 280" role="img" aria-label="Topologie lab solo 3.5: PC-A și PC-B în LAN-ul 172.16.5.0/24, A și B ca gateway-uri cu două grupuri HSRP, ISP ca destinație">
      <ClientIcon x={60} y={80} kind="pc" label="PC-A" />
      <ClientIcon x={60} y={200} kind="pc" label="PC-B" />
      <SwitchIcon x={210} y={140} label="SW" />
      <RouterIcon x={410} y={55} label="A" sub="Gi0/0 .1" />
      <RouterIcon x={410} y={230} label="B" sub="Gi0/0 .2" />
      <RouterIcon x={640} y={140} label="ISP" sub="Lo0 198.51.100.1" />
      <Line x1={84} y1={80} x2={188} y2={134} /><Line x1={84} y1={200} x2={188} y2={146} />
      <Line x1={232} y1={134} x2={382} y2={62} /><Line x1={232} y1={146} x2={382} y2={224} />
      <Line x1={440} y1={62} x2={612} y2={134} c="var(--ok)" /><Line x1={440} y1={224} x2={612} y2={146} c="var(--ok)" />
      <T x={110} y={30} size={10} m color="var(--muted)">LAN 172.16.5.0/24</T>
      <T x={540} y={80} size={10} m color="var(--ok)">10.9.1.0/30</T>
      <T x={540} y={218} size={10} m color="var(--ok)">10.9.2.0/30</T>
    </svg>
  );
}
