import { useState } from 'react';
import { ClientIcon, RouterIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 3.1 (componentele tabelei de rutare). Culori doar prin var(--…). */

/* 1) Anatomia unei linii din `show ip route` — interactivă */
type F = 'code' | 'prefix' | 'mask' | 'ad' | 'metric' | 'nexthop' | 'age' | 'exit';
type Part = [F | null, string];
const FIELD: Record<F, { name: string; sub: string; text: string }> = {
  code: { name: 'Routing protocol code', sub: '3.1.a', text: 'Prima literă (sau două) spune CINE a pus ruta în tabelă: C = connected, L = local, S = static, O = OSPF, D = EIGRP, R = RIP, B = BGP. Un asterisc (S*) marchează o rută candidată pentru default.' },
  prefix: { name: 'Prefix', sub: '3.1.b', text: 'Adresa rețelei de destinație (partea de rețea; biții de gazdă sunt 0). Pachetul trebuie să aibă destinația în interiorul acestei rețele ca ruta să se potrivească.' },
  mask: { name: 'Network mask', sub: '3.1.c', text: 'Lungimea prefixului (/24 = 255.255.255.0). Spune câți biți din adresă contează la comparare. Cu cât e mai mare, cu atât ruta e mai specifică.' },
  ad: { name: 'Administrative distance', sub: '3.1.e', text: 'Primul număr din paranteza pătrată: „cât de mult ai încredere în sursa rutei”. Mai mic = mai de încredere (connected 0, static 1, OSPF 110…). Decide între rute către ACELAȘI prefix venite din surse diferite.' },
  metric: { name: 'Metric', sub: '3.1.f', text: 'Al doilea număr din paranteza pătrată: „cât costă calea” după regulile protocolului (OSPF = cost, RIP = număr de hop-uri). Decide între rute către același prefix din ACELAȘI protocol. Mai mic = mai bun.' },
  nexthop: { name: 'Next hop', sub: '3.1.d', text: 'După „via”: adresa IP a următorului router de pe drum. Routerul îi trimite pachetul; acela continuă mai departe. Rutele connected nu au next hop (ținta e chiar rețeaua atașată).' },
  age: { name: 'Vârsta rutei', sub: 'informativ', text: 'Cât timp a trecut de când ruta a fost învățată sau actualizată (hh:mm:ss). Rutele statice și cele connected nu o afișează. O vârstă mereu mică, care se resetează, poate indica o rută instabilă (flapping).' },
  exit: { name: 'Exit interface', sub: 'informativ', text: 'Interfața prin care iese pachetul spre next hop. Routerul o determină căutând recursiv next hop-ul în propria tabelă (la rutele statice cu next hop, interfața nu apare în linia rutei).' },
};
const SHORT: Record<F, string> = { code: 'Cod', prefix: 'Prefix', mask: 'Mask', ad: 'AD', metric: 'Metric', nexthop: 'Next hop', age: 'Vârstă', exit: 'Interfață' };
const SAMPLES: Record<string, { label: string; parts: Part[] }> = {
  ospf: { label: 'Rută OSPF', parts: [['code', 'O'], [null, '    '], ['prefix', '10.2.2.0'], ['mask', '/24'], [null, ' ['], ['ad', '110'], [null, '/'], ['metric', '2'], [null, '] via '], ['nexthop', '10.1.1.2'], [null, ', '], ['age', '00:12:34'], [null, ', '], ['exit', 'GigabitEthernet0/0']] },
  static: { label: 'Rută statică', parts: [['code', 'S'], [null, '     '], ['prefix', '192.168.3.0'], ['mask', '/24'], [null, ' ['], ['ad', '1'], [null, '/'], ['metric', '0'], [null, '] via '], ['nexthop', '10.0.12.2']] },
  default: { label: 'Rută implicită', parts: [['code', 'S*'], [null, '    '], ['prefix', '0.0.0.0'], ['mask', '/0'], [null, ' ['], ['ad', '1'], [null, '/'], ['metric', '0'], [null, '] via '], ['nexthop', '203.0.113.1']] },
  connected: { label: 'Rută connected', parts: [['code', 'C'], [null, '        '], ['prefix', '192.168.1.0'], ['mask', '/24'], [null, ' is directly connected, '], ['exit', 'GigabitEthernet0/0']] },
};
export function RouteAnatomy() {
  const [s, setS] = useState<string>('ospf');
  const [f, setF] = useState<F>('code');
  const sample = SAMPLES[s];
  const present = sample.parts.some(([k]) => k === f);
  const d = FIELD[f];
  return (
    <div>
      <Seg value={s} set={(k) => setS(k)} label="Tipul rutei" items={Object.entries(SAMPLES).map(([k, v]) => [k, v.label] as [string, string])} />
      <div style={{ overflowX: 'auto', background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 12px', marginBottom: 12 }}>
        <div style={{ fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace', fontSize: 13.5, whiteSpace: 'pre', color: 'var(--text-2)' }}>
          {sample.parts.map(([k, txt], i) => k ? (
            <button key={i} type="button" onClick={() => setF(k)} aria-pressed={f === k}
              style={{ font: 'inherit', color: f === k ? 'var(--accent)' : 'var(--text)', background: f === k ? 'var(--accent-soft)' : 'transparent', border: 0, borderBottom: '2px solid ' + (f === k ? 'var(--accent)' : 'var(--border)'), padding: '1px 2px', cursor: 'pointer', borderRadius: 3, whiteSpace: 'pre' }}>{txt}</button>
          ) : <span key={i}>{txt}</span>)}
        </div>
      </div>
      <Seg value={f} set={setF} label="Câmpul explicat" items={(Object.keys(FIELD) as F[]).map((k) => [k, SHORT[k]] as [F, string])} />
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)' }}>
        <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{d.name} <span style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 12 }}>· {d.sub}</span></div>
        <div style={{ fontSize: 13.5, marginTop: 4, color: 'var(--text-2)' }}>{d.text}</div>
        {!present && <div style={{ fontSize: 12.5, marginTop: 6, color: 'var(--warn)' }}>⚠ Linia aleasă ({sample.label.toLowerCase()}) nu are acest câmp — exact asta e informația utilă: o rută connected nu are next hop, AD sau metrică afișate.</div>}
      </div>
    </div>
  );
}

/* 2) De unde vin rutele și cum ajung în tabelă */
export function RouteSources() {
  return (
    <svg viewBox="0 0 720 330" role="img" aria-label="Sursele rutelor: interfețe, rute statice și protocoale de rutare, apoi selecția după AD, tabela de rutare și FIB">
      <T x={110} y={18} size={11} weight={700} color="var(--muted)">SURSE</T>
      <T x={365} y={18} size={11} weight={700} color="var(--muted)">DECIZIE</T>
      <T x={600} y={18} size={11} weight={700} color="var(--muted)">REZULTAT</T>
      {[
        { y: 30, t: 'Interfețe up/up cu IP', s: '→ C (rețeaua) + L (/32)', c: 'var(--ok)' },
        { y: 100, t: 'Administratorul', s: 'ip route … → S / S*', c: 'var(--info)' },
        { y: 170, t: 'OSPF · EIGRP · RIP · BGP', s: 'fiecare cu baza ei proprie', c: 'var(--violet)' },
      ].map((b) => (
        <g key={b.t}>
          <rect x={20} y={b.y} width={200} height={56} rx={8} fill="var(--surface-3)" stroke={b.c} strokeWidth={1.6} />
          <T x={120} y={b.y + 24} weight={700}>{b.t}</T>
          <T x={120} y={b.y + 42} size={10.5} color="var(--muted)" m>{b.s}</T>
          <Line x1={220} y1={b.y + 28} x2={285} y2={150} c={b.c} w={2} flow />
        </g>
      ))}
      <rect x={285} y={110} width={160} height={80} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.8} />
      <T x={365} y={136} weight={700} color="var(--accent)">Care rută rămâne?</T>
      <T x={365} y={155} size={10.5} color="var(--text-2)">același prefix, surse diferite:</T>
      <T x={365} y={171} size={10.5} weight={700}>AD mai mic câștigă</T>
      <Line x1={445} y1={150} x2={505} y2={150} c="var(--accent)" w={3} flow />
      <rect x={505} y={105} width={190} height={90} rx={10} fill="var(--surface-3)" stroke="var(--border)" strokeWidth={1.6} />
      <T x={600} y={130} weight={700}>Routing table (RIB)</T>
      <T x={600} y={148} size={10.5} color="var(--muted)" m>show ip route</T>
      <T x={600} y={168} size={10.5} color="var(--text-2)">o singură rută „best”</T>
      <T x={600} y={183} size={10.5} color="var(--text-2)">per prefix/mască</T>
      <Line x1={600} y1={195} x2={600} y2={238} c="var(--accent)" w={3} flow />
      <rect x={505} y={238} width={190} height={60} rx={10} fill="var(--surface-3)" stroke="var(--ok)" strokeWidth={1.6} />
      <T x={600} y={262} weight={700}>FIB / CEF</T>
      <T x={600} y={280} size={10.5} color="var(--muted)">copia rapidă folosită la transmitere</T>
      <T x={365} y={265} size={10.5} color="var(--muted)">Rutele „pierdute” rămân în baza</T>
      <T x={365} y={280} size={10.5} color="var(--muted)">protocolului lor, ca rezervă.</T>
    </svg>
  );
}

/* 3) Scara AD */
const ADS: { n: string; v: number; d: string }[] = [
  { n: 'Connected', v: 0, d: 'Rețeaua atașată direct unei interfețe. Cea mai de încredere sursă posibilă: routerul „vede” rețeaua cu propriile interfețe.' },
  { n: 'Static', v: 1, d: 'Ruta scrisă manual cu ip route. Implicit AD 1; o poți mări (floating static) ca să devină rezervă.' },
  { n: 'EIGRP summary', v: 5, d: 'Rută sumar generată de EIGRP pe același router.' },
  { n: 'eBGP', v: 20, d: 'BGP învățat de la un vecin din alt sistem autonom.' },
  { n: 'EIGRP internal', v: 90, d: 'Rute EIGRP din interiorul sistemului autonom.' },
  { n: 'OSPF', v: 110, d: 'Rute învățate prin OSPF (toate tipurile: intra-area, inter-area, external).' },
  { n: 'IS-IS', v: 115, d: 'Protocol link-state alternativ la OSPF; în afara scopului de examen, dar apare în tabel.' },
  { n: 'RIP', v: 120, d: 'Protocol distance-vector vechi, bazat pe numărul de hop-uri.' },
  { n: 'EIGRP external', v: 170, d: 'Rute EIGRP redistribuite din altă sursă.' },
  { n: 'iBGP', v: 200, d: 'BGP învățat de la un vecin din același sistem autonom.' },
  { n: 'Unknown / unusable', v: 255, d: 'Sursă necunoscută sau ruta nu are voie să fie folosită: nu intră niciodată în tabela de rutare.' },
];
export function AdLadder() {
  const [i, setI] = useState(5);
  const sel = ADS[i];
  return (
    <div>
      <svg viewBox="0 0 720 360" role="img" aria-label="Scara distanțelor administrative: mai mic înseamnă mai de încredere">
        <T x={20} y={16} anchor="start" size={10.5} color="var(--ok)" weight={700}>← mai de încredere (preferat)</T>
        <T x={700} y={16} anchor="end" size={10.5} color="var(--bad)" weight={700}>mai puțin de încredere →</T>
        {ADS.map((a, k) => {
          const y = 28 + k * 29;
          const on = k === i;
          return (
            <g key={a.n} tabIndex={0} role="button" aria-label={`${a.n}, AD ${a.v}`} aria-pressed={on} style={{ cursor: 'pointer', outline: 'none' }}
              onClick={() => setI(k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setI(k); } }}>
              <rect x={0} y={y - 4} width={720} height={26} rx={5} fill={on ? 'var(--accent-soft)' : 'transparent'} />
              <T x={12} y={y + 14} anchor="start" size={11.5} weight={on ? 700 : 500} color={on ? 'var(--accent)' : 'var(--text)'}>{a.n}</T>
              <rect x={170} y={y} width={Math.max(3, (a.v / 255) * 470)} height={18} rx={3} fill={on ? 'var(--accent)' : a.v === 255 ? 'var(--bad)' : 'var(--surface-3)'} stroke="var(--border)" />
              <T x={170 + Math.max(3, (a.v / 255) * 470) + 8} y={y + 14} anchor="start" size={11.5} m weight={700} color={on ? 'var(--accent)' : 'var(--text-2)'}>{a.v}</T>
            </g>
          );
        })}
      </svg>
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', fontSize: 13.5 }}>
        <b style={{ color: 'var(--accent)' }}>{sel.n} — AD {sel.v}.</b> <span style={{ color: 'var(--text-2)' }}>{sel.d}</span>
      </div>
    </div>
  );
}

/* 4) Căutarea recursivă a next hop-ului */
const RT: { code: string; pre: string; via: string }[] = [
  { code: 'S*', pre: '0.0.0.0/0', via: '[1/0] via 203.0.113.1' },
  { code: 'C', pre: '10.0.12.0/30', via: 'is directly connected, Gi0/1' },
  { code: 'L', pre: '10.0.12.1/32', via: 'is directly connected, Gi0/1' },
  { code: 'C', pre: '192.168.1.0/24', via: 'is directly connected, Gi0/0' },
  { code: 'S', pre: '192.168.3.0/24', via: '[1/0] via 10.0.12.2' },
];
export function RecursiveLookup() {
  const [st, setSt] = useState<1 | 2 | 3>(1);
  const hl = st === 1 ? 4 : 1;
  const notes: Record<number, { t: string; d: string }> = {
    1: { t: 'Pasul 1 — căutarea după destinație', d: 'Destinația 192.168.3.10 se potrivește cu 192.168.3.0/24 (și cu 0.0.0.0/0, dar /24 e mai specific). Ruta dă doar o ADRESĂ IP de next hop: 10.0.12.2. Nu spune încă pe ce interfață se iese.' },
    2: { t: 'Pasul 2 — căutarea next hop-ului', d: 'Routerul întreabă: „cum ajung la 10.0.12.2?” și caută din nou în tabelă. Se potrivește 10.0.12.0/30 (connected) pe Gi0/1. Acesta e motivul pentru care un next hop trebuie să fie accesibil printr-o rută connected sau alta rută validă.' },
    3: { t: 'Pasul 3 — transmiterea', d: 'Interfața de ieșire este Gi0/1. Routerul face ARP pentru 10.0.12.2 (nu pentru 192.168.3.10!), construiește cadrul cu MAC-ul lui și îl trimite. Adresa IP de destinație a pachetului rămâne 192.168.3.10.' },
  };
  return (
    <div>
      <Seg value={String(st)} set={(k) => setSt(Number(k) as 1 | 2 | 3)} label="Pasul căutării" items={[['1', '1. Destinația'], ['2', '2. Next hop-ul'], ['3', '3. Ieșirea']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Căutare recursivă: destinația dă un next hop, next hop-ul dă interfața de ieșire">
        <T x={20} y={18} anchor="start" size={11} weight={700} color="var(--muted)">show ip route (extras)</T>
        {RT.map((r, k) => (
          <g key={r.pre}>
            <rect x={14} y={28 + k * 32} width={430} height={28} rx={5} fill={k === hl ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={k === hl ? 'var(--accent)' : 'var(--border)'} strokeWidth={k === hl ? 2 : 1} />
            <T x={24} y={47 + k * 32} anchor="start" size={11.5} m weight={k === hl ? 700 : 500} color={k === hl ? 'var(--accent)' : 'var(--text-2)'}>{`${r.code.padEnd(2)} ${r.pre.padEnd(16)} ${r.via}`}</T>
          </g>
        ))}
        <ClientIcon x={520} y={70} kind="pc" label="dest. 192.168.3.10" />
        <RouterIcon x={520} y={150} label="next hop 10.0.12.2" />
        <Line x1={520} y1={92} x2={520} y2={128} c={st >= 2 ? 'var(--accent)' : 'var(--border)'} w={2} dash="6 5" />
        {st === 3 && <T x={640} y={150} anchor="start" size={11} m weight={700} color="var(--ok)">Gi0/1 ✓</T>}
        {st >= 2 && <T x={534} y={112} anchor="start" size={10} color="var(--accent)">2× căutare</T>}
      </svg>
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)' }}>
        <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{notes[st].t}</div>
        <div style={{ fontSize: 13.5, marginTop: 4, color: 'var(--text-2)' }}>{notes[st].d}</div>
      </div>
    </div>
  );
}

/* 5) Gateway of last resort — ce se întâmplă cu destinații diferite */
const DST: Record<string, { ip: string; hit: number; why: string }> = {
  lan: { ip: '192.168.1.55', hit: 3, why: 'se potrivește cu C 192.168.1.0/24: rețea atașată, livrare directă (ARP pe LAN).' },
  r3: { ip: '192.168.3.10', hit: 4, why: 'se potrivește cu S 192.168.3.0/24 (mai specifică decât ruta implicită): trimis la R2.' },
  net: { ip: '8.8.8.8', hit: 0, why: 'nicio rută specifică; ruta implicită 0.0.0.0/0 (gateway of last resort) îl trimite spre ISP.' },
  rnd: { ip: '172.16.5.5', hit: 0, why: 'adresă privată necunoscută: tot ruta implicită se potrivește. Routerul n-are de unde să știe că adresa nu există „acolo”; ISP-ul o va respinge.' },
};
export function DefaultRoutePicker() {
  const [k, setK] = useState<string>('net');
  const d = DST[k];
  return (
    <div>
      <Seg value={k} set={setK} label="Destinația pachetului" items={Object.entries(DST).map(([id, v]) => [id, v.ip] as [string, string])} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Ruta implicită prinde tot ce nu se potrivește cu rute mai specifice">
        <T x={20} y={18} anchor="start" size={11} weight={700} color="var(--muted)">tabela lui R1</T>
        {RT.map((r, i) => (
          <g key={r.pre}>
            <rect x={14} y={28 + i * 32} width={430} height={28} rx={5} fill={i === d.hit ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={i === d.hit ? 'var(--accent)' : 'var(--border)'} strokeWidth={i === d.hit ? 2 : 1} />
            <T x={24} y={47 + i * 32} anchor="start" size={11.5} m weight={i === d.hit ? 700 : 500} color={i === d.hit ? 'var(--accent)' : 'var(--text-2)'}>{`${r.code.padEnd(2)} ${r.pre.padEnd(16)} ${r.via}`}</T>
          </g>
        ))}
        <RouterIcon x={560} y={110} label="R1" />
        <T x={640} y={200} size={10.5} color="var(--muted)">gateway of last resort = 203.0.113.1</T>
      </svg>
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', fontSize: 13.5, color: 'var(--text-2)' }}>
        <b style={{ color: 'var(--accent)' }}>{d.ip}</b> {d.why}
      </div>
    </div>
  );
}

/* 6) Topologii laborator */
export function LabGuidedTopology31() {
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label="Topologie lab 3.1: PC1, R1, R2, R3 și PC3 în linie">
      <ClientIcon x={50} y={90} kind="pc" label="PC1 192.168.1.10" />
      <RouterIcon x={210} y={90} label="R1" />
      <RouterIcon x={400} y={90} label="R2" />
      <RouterIcon x={590} y={90} label="R3" />
      <ClientIcon x={710} y={90} kind="pc" label="PC3 192.168.3.10" />
      <Line x1={80} y1={90} x2={180} y2={90} /><Line x1={240} y1={90} x2={370} y2={90} /><Line x1={430} y1={90} x2={560} y2={90} /><Line x1={620} y1={90} x2={680} y2={90} />
      <T x={130} y={78} size={10} m color="var(--muted)">192.168.1.0/24</T>
      <T x={305} y={78} size={10} m color="var(--muted)">10.0.12.0/30</T>
      <T x={495} y={78} size={10} m color="var(--muted)">10.0.23.0/30</T>
      <T x={650} y={78} size={10} m color="var(--muted)">/24</T>
      <T x={210} y={140} size={10} m color="var(--muted)">Gi0/0 .1 · Gi0/1 .1</T>
      <T x={400} y={140} size={10} m color="var(--muted)">Gi0/0 .2 · Gi0/1 .1</T>
      <T x={590} y={140} size={10} m color="var(--muted)">Gi0/0 .2 · Gi0/1 .1 · Lo0 8.8.8.8</T>
      <T x={380} y={200} size={11} color="var(--muted)">R3 simulează „Internetul” cu loopback-ul 8.8.8.8/32</T>
    </svg>
  );
}
export function LabSoloTopology31() {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-label="Topologie lab solo 3.1: trei routere în triunghi cu o LAN pe fiecare">
      <RouterIcon x={360} y={50} label="RA" /><RouterIcon x={160} y={160} label="RB" /><RouterIcon x={560} y={160} label="RC" />
      <Line x1={338} y1={72} x2={182} y2={138} /><Line x1={382} y1={72} x2={538} y2={138} /><Line x1={190} y1={160} x2={530} y2={160} />
      <T x={230} y={96} size={10} m color="var(--muted)">10.1.1.0/30</T>
      <T x={500} y={96} size={10} m color="var(--muted)">10.1.2.0/30</T>
      <T x={360} y={178} size={10} m color="var(--muted)">10.1.3.0/30</T>
      <T x={470} y={44} anchor="start" size={10} m color="var(--muted)">LAN A 172.16.1.0/24</T>
      <T x={30} y={200} anchor="start" size={10} m color="var(--muted)">LAN B 172.16.2.0/24</T>
      <T x={600} y={200} anchor="start" size={10} m color="var(--muted)">LAN C 172.16.3.0/24</T>
    </svg>
  );
}
