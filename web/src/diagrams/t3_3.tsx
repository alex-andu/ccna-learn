import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 3.3 (rute statice IPv4/IPv6). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const mono: CSSProperties = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace', fontSize: 12.5, color: 'var(--text)', whiteSpace: 'pre-wrap', margin: 0 };

/* 1) Cele trei forme ale unei rute statice */
type Form = 'nh' | 'exit' | 'full';
const FORMS: Record<Form, { name: string; cfg: string; show: string; steps: string[]; verdict: string; c: string }> = {
  nh: {
    name: 'Doar next hop (recursivă)',
    cfg: 'ip route 10.2.0.0 255.255.0.0 10.1.1.2',
    show: 'S    10.2.0.0/16 [1/0] via 10.1.1.2',
    steps: [
      '1. Pachetul pentru 10.2.5.9 se potrivește cu 10.2.0.0/16 → next hop 10.1.1.2.',
      '2. Căutare recursivă: 10.1.1.2 se află în ruta connected 10.1.1.0/24 → interfață de ieșire Gi0/1.',
      '3. Un singur ARP, pentru 10.1.1.2 (next hop-ul), apoi se reutilizează din cache.',
    ],
    verdict: 'Forma recomandată pe Ethernet: simplă, un ARP, funcționează fără proxy ARP.',
    c: 'var(--ok)',
  },
  exit: {
    name: 'Doar interfață de ieșire (directly attached)',
    cfg: 'ip route 10.2.0.0 255.255.0.0 g0/1',
    show: 'S    10.2.0.0/16 is directly connected, GigabitEthernet0/1',
    steps: [
      '1. Pachetul pentru 10.2.5.9 se potrivește cu 10.2.0.0/16 → „directly connected” pe Gi0/1.',
      '2. Routerul tratează destinația ca fiind chiar pe segmentul Gi0/1 și trimite ARP pentru 10.2.5.9 (nu pentru R2).',
      '3. Merge doar dacă R2 răspunde în locul destinației (proxy ARP). Un ARP nou pentru fiecare destinație din 10.2.0.0/16.',
    ],
    verdict: 'Pe Ethernet e fragilă: depinde de proxy ARP și umple cache-ul ARP. Se folosește natural pe legături punct-la-punct seriale.',
    c: 'var(--warn)',
  },
  full: {
    name: 'Complet specificată (interfață + next hop)',
    cfg: 'ip route 10.2.0.0 255.255.0.0 g0/1 10.1.1.2',
    show: 'S    10.2.0.0/16 [1/0] via 10.1.1.2, GigabitEthernet0/1',
    steps: [
      '1. Pachetul pentru 10.2.5.9 se potrivește cu 10.2.0.0/16 → next hop 10.1.1.2 pe Gi0/1 (ambele scrise de tine).',
      '2. Nu mai e nevoie de căutare recursivă: interfața e cunoscută din rută.',
      '3. Un singur ARP, pentru 10.1.1.2. Obligatorie pentru IPv6 cu next hop link-local.',
    ],
    verdict: 'Cea mai explicită: elimină ambiguitatea (de exemplu când next hop-ul e accesibil pe mai multe interfețe) și e cerută pentru next hop link-local IPv6.',
    c: 'var(--info)',
  },
};
export function StaticForms() {
  const [f, setF] = useState<Form>('nh');
  const d = FORMS[f];
  return (
    <div>
      <Seg value={f} set={setF} label="Forma rutei" items={(['nh', 'exit', 'full'] as Form[]).map((k) => [k, FORMS[k].name.split(' (')[0]] as [Form, string])} />
      <svg viewBox="0 0 720 150" role="img" aria-label="R1 și R2 pe un segment Ethernet 10.1.1.0/24, rețeaua 10.2.0.0/16 în spatele lui R2">
        <RouterIcon x={130} y={60} label="R1" />
        <RouterIcon x={400} y={60} label="R2" />
        <Line x1={160} y1={60} x2={370} y2={60} c={d.c} w={4} flow />
        <T x={265} y={46} size={10.5} m color="var(--muted)">10.1.1.0/24</T>
        <T x={265} y={82} size={10.5} m color="var(--muted)">Gi0/1 .1 ↔ .2</T>
        <Line x1={430} y1={60} x2={560} y2={60} c="var(--border)" w={2} />
        <rect x={560} y={32} width={140} height={56} rx={10} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={630} y={56} size={12} weight={700}>10.2.0.0/16</T>
        <T x={630} y={74} size={10.5} color="var(--text-2)">rețea la distanță</T>
        <T x={360} y={132} size={10.5} color="var(--muted)">Pe R1 vrem să ajungem în 10.2.0.0/16; R2 este next hop-ul (10.1.1.2).</T>
      </svg>
      <div style={note(d.c)}>
        <div style={{ fontWeight: 700, color: d.c }}>{d.name}</div>
        <pre style={mono}>{'R1(config)# ' + d.cfg + '\nR1# show ip route\n' + d.show}</pre>
        <ul style={{ margin: '8px 0 0 18px', padding: 0, fontSize: 13.5, color: 'var(--text-2)' }}>
          {d.steps.map((s) => (<li key={s}>{s}</li>))}
        </ul>
        <div style={{ fontSize: 13.5, marginTop: 6, color: d.c, fontWeight: 700 }}>{d.verdict}</div>
      </div>
    </div>
  );
}

/* 2) Ruta de întoarcere: ping dus-întors */
type YN = 'y' | 'n';
export function ReturnRoute() {
  const [a, setA] = useState<YN>('y');
  const [b, setB] = useState<YN>('n');
  const fwd = a === 'y';
  const back = a === 'y' && b === 'y';
  const reachedPc2 = a === 'y';
  const res = !fwd
    ? { c: 'var(--bad)', t: 'Destination host unreachable (de la R1)', d: 'R1 nu are nicio rută potrivită pentru 192.168.20.10 → aruncă pachetul și trimite ICMP unreachable către PC1. Pachetul nici nu pleacă spre R2.' }
    : back
      ? { c: 'var(--ok)', t: 'Ping reușit', d: 'Ambele sensuri au rută: cererea ajunge la PC2, iar răspunsul se întoarce pe baza rutei din R2 către 192.168.10.0/24.' }
      : { c: 'var(--warn)', t: 'Request timed out (timeout, fără mesaj de eroare)', d: 'Cererea ajunge la PC2, care răspunde. Dar R2 nu are rută către 192.168.10.0/24 și aruncă răspunsul; ICMP unreachable pleacă spre PC2, nu spre PC1. PC1 vede doar timeout.' };
  return (
    <div>
      <Seg value={a} set={setA} label="R1 are ruta spre 192.168.20.0/24" items={[['y', 'da'], ['n', 'nu']]} />
      <Seg value={b} set={setB} label="R2 are ruta spre 192.168.10.0/24" items={[['y', 'da'], ['n', 'nu']]} />
      <svg viewBox="0 0 720 150" role="img" aria-label="PC1, R1, R2, PC2 și drumul cererii și al răspunsului ping în funcție de rutele configurate">
        <ClientIcon x={50} y={60} kind="pc" label="PC1" />
        <RouterIcon x={230} y={60} label="R1" />
        <RouterIcon x={490} y={60} label="R2" />
        <ClientIcon x={670} y={60} kind="pc" label="PC2" />
        <Line x1={75} y1={60} x2={200} y2={60} c={fwd ? 'var(--accent)' : 'var(--bad)'} w={3} flow={fwd} />
        <Line x1={260} y1={60} x2={460} y2={60} c={fwd ? 'var(--accent)' : 'var(--border)'} w={fwd ? 3 : 2} flow={fwd} />
        <Line x1={520} y1={60} x2={645} y2={60} c={reachedPc2 ? 'var(--accent)' : 'var(--border)'} w={reachedPc2 ? 3 : 2} flow={reachedPc2} />
        <Line x1={645} y1={86} x2={520} y2={86} c={reachedPc2 ? (b === 'y' ? 'var(--ok)' : 'var(--bad)') : 'var(--border)'} w={reachedPc2 ? 3 : 1.5} dash={b === 'y' ? undefined : '5 4'} flow={reachedPc2 && b === 'y'} />
        <Line x1={460} y1={86} x2={260} y2={86} c={back ? 'var(--ok)' : 'var(--border)'} w={back ? 3 : 1.5} flow={back} />
        <Line x1={200} y1={86} x2={75} y2={86} c={back ? 'var(--ok)' : 'var(--border)'} w={back ? 3 : 1.5} flow={back} />
        <T x={360} y={44} size={10.5} weight={700} color="var(--accent)">cerere (echo request)</T>
        <T x={360} y={106} size={10.5} weight={700} color={back ? 'var(--ok)' : 'var(--muted)'}>răspuns (echo reply)</T>
        <T x={140} y={132} size={10.5} m color="var(--muted)">192.168.10.0/24</T>
        <T x={580} y={132} size={10.5} m color="var(--muted)">192.168.20.0/24</T>
        {fwd && !back && <T x={490} y={134} size={11} weight={700} color="var(--bad)">✖ R2 aruncă răspunsul</T>}
      </svg>
      <div style={note(res.c)}>
        <div style={{ fontWeight: 700, color: res.c }}>{res.t}</div>
        <div style={{ fontSize: 13.5, marginTop: 4, color: 'var(--text-2)' }}>{res.d}</div>
      </div>
    </div>
  );
}

/* 3) Ruta implicită pe un router stub */
interface DR { code: string; pre: string; via: string }
const TBL: DR[] = [
  { code: 'C', pre: '192.168.1.0/24', via: 'directly connected, Gi0/0' },
  { code: 'S', pre: '10.20.0.0/16', via: 'via 10.0.0.2 (spre R2)' },
  { code: 'S*', pre: '0.0.0.0/0', via: 'via 203.0.113.1 (spre ISP)' },
];
const DD: [string, number, string][] = [
  ['192.168.1.20', 0, 'LAN-ul propriu: connected, livrat direct (ARP pentru destinație).'],
  ['10.20.4.4', 1, 'Rețea internă la distanță: ruta statică specifică (3.3.b).'],
  ['8.8.8.8', 2, 'Orice altceva (Internet): ruta implicită — gateway of last resort.'],
  ['172.20.0.9', 2, 'Adresă necunoscută, nu e nici în LAN, nici în 10.20/16: tot ruta implicită.'],
];
export function DefaultRouteStub() {
  const [d, setD] = useState('8.8.8.8');
  const row = DD.find((x) => x[0] === d) ?? DD[2];
  const w = row[1];
  return (
    <div>
      <Seg value={d} set={setD} label="Destinația pachetului" items={DD.map((x) => [x[0], x[0]] as [string, string])} />
      <svg viewBox="0 0 720 210" role="img" aria-label="Router de ramură cu LAN, o legătură către R2 și o legătură către ISP; tabela de rutare și ruta aleasă">
        <RouterIcon x={170} y={80} label="R1 (ramură)" />
        <ClientIcon x={50} y={80} kind="pc" label="LAN" />
        <Line x1={75} y1={80} x2={140} y2={80} c={w === 0 ? 'var(--ok)' : 'var(--border)'} w={w === 0 ? 4 : 2} />
        <RouterIcon x={380} y={34} label="R2" />
        <Line x1={196} y1={66} x2={354} y2={40} c={w === 1 ? 'var(--accent)' : 'var(--border)'} w={w === 1 ? 4 : 2} flow={w === 1} />
        <rect x={500} y={110} width={130} height={46} rx={23} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={565} y={138} size={12} weight={700}>Internet</T>
        <RouterIcon x={380} y={130} label="ISP" />
        <Line x1={196} y1={94} x2={354} y2={126} c={w === 2 ? 'var(--violet)' : 'var(--border)'} w={w === 2 ? 4 : 2} flow={w === 2} />
        <Line x1={406} y1={133} x2={500} y2={133} c={w === 2 ? 'var(--violet)' : 'var(--border)'} w={w === 2 ? 4 : 2} flow={w === 2} />
        {TBL.map((r, i) => (
          <g key={r.pre}>
            <rect x={14} y={158 + i * 16 - 12} width={4} height={14} fill={i === w ? 'var(--accent)' : 'transparent'} />
            <T x={24} y={158 + i * 16} anchor="start" size={11} m weight={i === w ? 700 : 500} color={i === w ? 'var(--accent)' : 'var(--text-2)'}>{`${r.code.padEnd(3)} ${r.pre.padEnd(16)} ${r.via}`}</T>
          </g>
        ))}
      </svg>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{row[2]}</div>
      </div>
    </div>
  );
}

/* 4) Ruta flotantă: primară vs. rezervă */
export function FloatingFailover() {
  const [up, setUp] = useState<'up' | 'down'>('up');
  const ok = up === 'up';
  return (
    <div>
      <Seg value={up} set={setUp} label="Legătura principală R1–R2" items={[['up', 'funcționează'], ['down', 'căzută']]} />
      <svg viewBox="0 0 720 220" role="img" aria-label="R1 are o legătură principală prin R2 și o legătură de rezervă directă către R3; ruta flotantă preia traficul când legătura principală cade">
        <RouterIcon x={110} y={110} label="R1" />
        <RouterIcon x={360} y={36} label="R2" />
        <RouterIcon x={610} y={110} label="R3" sub="LAN 192.168.30.0/24" />
        <Line x1={134} y1={96} x2={336} y2={42} c={ok ? 'var(--ok)' : 'var(--bad)'} w={ok ? 4 : 2} dash={ok ? undefined : '5 4'} flow={ok} />
        <Line x1={384} y1={42} x2={586} y2={96} c={ok ? 'var(--ok)' : 'var(--border)'} w={ok ? 4 : 2} flow={ok} />
        <Line x1={140} y1={118} x2={580} y2={118} c={ok ? 'var(--border)' : 'var(--violet)'} w={ok ? 2 : 4} dash={ok ? '6 5' : undefined} flow={!ok} />
        <T x={225} y={60} size={10.5} weight={700} color={ok ? 'var(--ok)' : 'var(--bad)'}>{ok ? 'principală · AD 1' : '✖ interfață down'}</T>
        <T x={360} y={140} size={10.5} weight={700} color={ok ? 'var(--muted)' : 'var(--violet)'}>{ok ? 'rezervă (inactivă) · AD 5' : 'rezervă ACTIVĂ · AD 5'}</T>
        <T x={360} y={206} size={10.5} color="var(--muted)">Configurat pe R1 pentru 192.168.30.0/24: via 10.0.12.2 (AD 1) și via 10.0.13.2 (AD 5)</T>
      </svg>
      <div style={note(ok ? 'var(--ok)' : 'var(--violet)')}>
        <pre style={mono}>{ok
          ? 'R1# show ip route 192.168.30.0\nS    192.168.30.0/24 [1/0] via 10.0.12.2\n(ruta cu AD 5 este în configurație, dar NU în tabelă)'
          : 'R1# show ip route 192.168.30.0\nS    192.168.30.0/24 [5/0] via 10.0.13.2\n(ruta principală a dispărut: next hop-ul 10.0.12.2 nu mai e accesibil)'}</pre>
        <div style={{ fontSize: 13.5, marginTop: 6, color: 'var(--text-2)' }}>
          {ok
            ? 'Din două rute statice către același prefix, în tabelă intră doar cea cu AD mai mic. Cealaltă „plutește” sub ea.'
            : 'Fără ruta cu AD 1, singura rămasă (AD 5) se instalează automat. Când legătura revine, ruta principală revine și cea de rezervă dispare din nou din tabelă.'}
        </div>
        <div style={{ fontSize: 12.5, marginTop: 6, color: 'var(--warn)' }}>
          Atenție: ruta principală dispare doar dacă routerul detectează căderea (interfața devine down, deci next hop-ul nu mai e accesibil). Dacă se strică ceva mai departe pe cale, ruta statică rămâne instalată (detectarea automată, de exemplu cu IP SLA/track, depășește CCNA).
        </div>
      </div>
    </div>
  );
}

/* 5) IPv6: forme valide de next hop */
type V6 = 'gua' | 'lla' | 'llaif' | 'ifonly';
const V6D: Record<V6, { name: string; cmd: string; ok: boolean; out: string; d: string }> = {
  gua: {
    name: 'Next hop global (GUA)',
    cmd: 'ipv6 route 2001:db8:2::/64 2001:db8:12::2',
    ok: true,
    out: 'S   2001:db8:2::/64 [1/0]\n     via 2001:db8:12::2',
    d: 'Valid. Routerul face căutare recursivă pentru 2001:db8:12::2 (rețea connected) și află interfața de ieșire.',
  },
  lla: {
    name: 'Next hop link-local, fără interfață',
    cmd: 'ipv6 route 2001:db8:2::/64 fe80::2',
    ok: false,
    out: '% Interface has to be specified for a link-local nexthop',
    d: 'Respins. O adresă link-local (fe80::/10) nu e unică la nivelul routerului: aceeași fe80::2 poate exista pe fiecare interfață, deci interfața trebuie precizată (mesaj ilustrativ; textul exact variază după versiune).',
  },
  llaif: {
    name: 'Next hop link-local + interfață',
    cmd: 'ipv6 route 2001:db8:2::/64 g0/1 fe80::2',
    ok: true,
    out: 'S   2001:db8:2::/64 [1/0]\n     via FE80::2, GigabitEthernet0/1',
    d: 'Valid: ruta complet specificată. Interfața dezambiguizează adresa link-local; ruta rămâne bună chiar dacă adresele globale se schimbă.',
  },
  ifonly: {
    name: 'Doar interfață de ieșire',
    cmd: 'ipv6 route 2001:db8:2::/64 g0/1',
    ok: true,
    out: 'S   2001:db8:2::/64 [1/0]\n     via GigabitEthernet0/1, directly connected',
    d: 'Acceptată, dar pe Ethernet routerul trebuie să afle prin ND adresa MAC a fiecărei destinații din /64, deci depinde de vecin; nu e recomandată (același principiu ca la IPv4).',
  },
};
export function Ipv6NextHop() {
  const [v, setV] = useState<V6>('gua');
  const d = V6D[v];
  const c = v === 'lla' ? 'var(--bad)' : v === 'ifonly' ? 'var(--warn)' : 'var(--ok)';
  return (
    <div>
      <Seg value={v} set={setV} label="Next hop-ul rutei IPv6" items={(['gua', 'lla', 'llaif', 'ifonly'] as V6[]).map((k) => [k, V6D[k].name] as [V6, string])} />
      <div style={note(c)}>
        <div style={{ fontWeight: 700, color: c }}>{d.ok ? '✔ ' : '✖ '}{d.name}</div>
        <pre style={mono}>{'R1(config)# ' + d.cmd + '\n' + (d.ok ? 'R1# show ipv6 route static\n' : '') + d.out}</pre>
        <div style={{ fontSize: 13.5, marginTop: 6, color: 'var(--text-2)' }}>{d.d}</div>
      </div>
    </div>
  );
}

/* 6) Topologii laborator */
export function LabGuidedTopology33() {
  return (
    <svg viewBox="0 0 760 270" role="img" aria-label="Topologie lab 3.3: PC1, R1, R2, R3 în triunghi și PC3">
      <ClientIcon x={50} y={170} kind="pc" label="PC1" />
      <RouterIcon x={220} y={170} label="R1" />
      <RouterIcon x={400} y={50} label="R2" />
      <RouterIcon x={580} y={170} label="R3" />
      <ClientIcon x={710} y={170} kind="pc" label="PC3" />
      <Line x1={80} y1={170} x2={190} y2={170} /><Line x1={246} y1={150} x2={374} y2={66} /><Line x1={426} y1={66} x2={554} y2={150} /><Line x1={250} y1={170} x2={550} y2={170} c="var(--violet)" dash="6 5" /><Line x1={610} y1={170} x2={680} y2={170} />
      <T x={130} y={158} size={10} m color="var(--muted)">192.168.10.0/24</T>
      <T x={290} y={96} size={10} m color="var(--muted)">10.0.12.0/30</T>
      <T x={510} y={96} size={10} m color="var(--muted)">10.0.23.0/30</T>
      <T x={400} y={188} size={10} m color="var(--violet)">10.0.13.0/30 (rezervă)</T>
      <T x={645} y={158} size={10} m color="var(--muted)">192.168.30.0/24</T>
      <T x={220} y={222} size={10} m color="var(--muted)">Gi0/0 LAN · Gi0/1 → R2 · Gi0/2 → R3</T>
      <T x={400} y={20} size={10} m color="var(--muted)">Gi0/0 → R1 · Gi0/1 → R3</T>
      <T x={580} y={222} size={10} m color="var(--muted)">Gi0/0 → R2 · Gi0/1 LAN · Gi0/2 → R1</T>
    </svg>
  );
}
export function LabSoloTopology33() {
  return (
    <svg viewBox="0 0 720 240" role="img" aria-label="Topologie lab solo 3.3: R1 în centru, conectat la trei vecini N1, N2, N3 și la un LAN">
      <RouterIcon x={360} y={120} label="R1" />
      <RouterIcon x={120} y={50} label="N1" /><RouterIcon x={600} y={50} label="N2" /><RouterIcon x={360} y={210} label="N3" />
      <ClientIcon x={120} y={170} kind="pc" label="LAN R1" />
      <Line x1={142} y1={64} x2={336} y2={106} /><Line x1={578} y1={64} x2={384} y2={106} /><Line x1={360} y1={142} x2={360} y2={188} /><Line x1={148} y1={170} x2={336} y2={128} />
      <T x={210} y={70} size={10} m color="var(--muted)">10.0.1.0/30</T>
      <T x={510} y={70} size={10} m color="var(--muted)">10.0.2.0/30</T>
      <T x={425} y={170} size={10} m color="var(--muted)">10.0.3.0/30</T>
      <T x={215} y={160} size={10} m color="var(--muted)">192.168.5.0/24</T>
    </svg>
  );
}
