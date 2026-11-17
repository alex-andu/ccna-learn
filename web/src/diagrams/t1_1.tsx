import { useState, type ReactNode } from 'react';
import { APIcon, ClientIcon, RouterIcon, SwitchIcon } from './wlan';

/* Diagrame originale pentru 1.1 — Network components.
   Culori DOAR prin variabile CSS (merg în ambele teme). */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; mono?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'}
    style={{ ...(p.mono ? { fontFamily: 'JetBrains Mono Variable, monospace' } : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
const Wire = ({ x1, y1, x2, y2, on = false, color, dash }: { x1: number; y1: number; x2: number; y2: number; on?: boolean; color?: string; dash?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? (color ?? 'var(--accent)') : 'var(--text-2)'} strokeWidth={on ? 3.2 : 1.8} strokeDasharray={dash} opacity={on ? 1 : 0.75} strokeLinecap="round" />
);
const Arrow = ({ id, color }: { id: string; color: string }) => (
  <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={color} /></marker></defs>
);

/* ---------------------------------------------------------------
   Icoane suplimentare (cele de bază vin din wlan.tsx)
---------------------------------------------------------------- */
export function FirewallIcon({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) {
  return (
    <g>
      <rect x={x - 26} y={y - 16} width={52} height={32} rx={4} fill="var(--surface-3)" stroke="var(--warn)" strokeWidth={1.6} />
      <path d={`M${x - 26} ${y - 5} h52 M${x - 26} ${y + 6} h52 M${x - 10} ${y - 16} v11 M${x + 10} ${y - 16} v11 M${x} ${y - 5} v11 M${x - 18} ${y + 6} v10 M${x + 18} ${y + 6} v10`} stroke="var(--warn)" strokeWidth={1.2} />
      {label && <T x={x} y={y + 32} weight={650}>{label}</T>}
      {sub && <T x={x} y={y + 46} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}
export function ServerIcon({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x - 16} y={y - 20 + i * 13} width={32} height={11} rx={2} fill="var(--surface-3)" stroke="var(--ok)" strokeWidth={1.4} />
          <circle cx={x + 10} cy={y - 14.5 + i * 13} r={1.8} fill="var(--ok)" />
          <path d={`M${x - 11} ${y - 14.5 + i * 13} h12`} stroke="var(--ok)" strokeWidth={1.2} />
        </g>
      ))}
      {label && <T x={x} y={y + 34} weight={650}>{label}</T>}
      {sub && <T x={x} y={y + 48} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}
export function L3SwitchIcon({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) {
  return (
    <g>
      <rect x={x - 32} y={y - 14} width={64} height={28} rx={5} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={1.8} />
      <path d={`M${x - 20} ${y - 5} h16 l-4 -3 M${x - 4} ${y + 5} h-16 l4 3`} stroke="var(--info)" strokeWidth={1.4} fill="none" />
      <path d={`M${x + 6} ${y} h18 M${x + 15} ${y - 8} v16`} stroke="var(--violet)" strokeWidth={1.5} />
      {label && <T x={x} y={y + 30} weight={650}>{label}</T>}
      {sub && <T x={x} y={y + 44} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}
export function CloudIcon({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) {
  return (
    <g>
      <path d={`M${x - 30} ${y + 12} a14 14 0 0 1 4 -27 a18 18 0 0 1 33 -4 a14 14 0 0 1 23 16 a11 11 0 0 1 -4 15 z`} fill="var(--surface-3)" stroke="var(--muted)" strokeWidth={1.5} />
      {label && <T x={x} y={y + 32} weight={650}>{label}</T>}
      {sub && <T x={x} y={y + 46} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}
export function PhoneIcon({ x, y, label, sub, powered = true }: { x: number; y: number; label?: string; sub?: string; powered?: boolean }) {
  return (
    <g>
      <rect x={x - 18} y={y - 12} width={36} height={24} rx={4} fill="var(--surface-3)" stroke="var(--text-2)" strokeWidth={1.3} />
      <rect x={x - 4} y={y - 9} width={18} height={10} rx={1.5} fill={powered ? 'var(--accent-soft)' : 'var(--border)'} stroke={powered ? 'var(--accent)' : 'var(--muted)'} strokeWidth={1} />
      <path d={`M${x - 14} ${y - 10} q -6 10 0 20`} stroke="var(--text-2)" strokeWidth={3} fill="none" strokeLinecap="round" />
      {label && <T x={x} y={y + 28} size={11} weight={600}>{label}</T>}
      {sub && <T x={x} y={y + 41} size={10} color="var(--muted)">{sub}</T>}
    </g>
  );
}
export function HubIcon({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <rect x={x - 30} y={y - 11} width={60} height={22} rx={4} fill="var(--surface-3)" stroke="var(--muted)" strokeWidth={1.5} />
      <T x={x} y={y + 4} size={10.5} weight={700} color="var(--muted)">HUB</T>
      {label && <T x={x} y={y + 27} weight={650}>{label}</T>}
    </g>
  );
}
function ControllerIcon({ x, y, label, sub, color = 'var(--violet)' }: { x: number; y: number; label: string; sub?: string; color?: string }) {
  return (
    <g>
      <rect x={x - 44} y={y - 16} width={88} height={32} rx={8} fill="var(--surface-3)" stroke={color} strokeWidth={1.7} />
      <T x={x} y={y + 4} size={11} weight={700} color={color}>{label}</T>
      {sub && <T x={x} y={y + 32} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}

/* ---------------------------------------------------------------
   1) Modelul OSI pe scurt + până la ce nivel „înțelege” fiecare dispozitiv
---------------------------------------------------------------- */
const LAYERS = [
  { n: 7, name: 'Application', ro: 'aplicația', ex: 'HTTP, DNS, SSH — datele utilizatorului', pdu: 'date' },
  { n: 6, name: 'Presentation', ro: 'prezentarea', ex: 'codare, compresie, criptare (TLS)', pdu: 'date' },
  { n: 5, name: 'Session', ro: 'sesiunea', ex: 'deschide/închide dialogul dintre aplicații', pdu: 'date' },
  { n: 4, name: 'Transport', ro: 'transportul', ex: 'TCP/UDP, numere de port — ce aplicație', pdu: 'segment' },
  { n: 3, name: 'Network', ro: 'rețeaua', ex: 'adrese IP, rutare între rețele', pdu: 'pachet' },
  { n: 2, name: 'Data Link', ro: 'legătura de date', ex: 'adrese MAC, cadre Ethernet / 802.11', pdu: 'cadru' },
  { n: 1, name: 'Physical', ro: 'fizic', ex: 'biți pe cablu, lumină în fibră, unde radio', pdu: 'biți' },
];
const DEVS = [
  { name: 'Hub', hi: 1, c: 'var(--muted)' },
  { name: 'Switch L2', hi: 2, c: 'var(--info)' },
  { name: 'AP', hi: 2, c: 'var(--accent)' },
  { name: 'Router', hi: 3, c: 'var(--violet)' },
  { name: 'Switch L3', hi: 3, c: 'var(--accent)' },
  { name: 'Firewall', hi: 4, c: 'var(--warn)' },
  { name: 'NGFW / IPS', hi: 7, c: 'var(--bad)' },
  { name: 'PC / server', hi: 7, c: 'var(--ok)' },
];
export function OsiGlance() {
  const [sel, setSel] = useState<number | null>(null);
  const rowY = (n: number) => 22 + (7 - n) * 40;
  const L = sel ? LAYERS.find((l) => l.n === sel)! : null;
  return (
    <>
      <svg viewBox="0 0 760 350" width="100%" role="img" aria-label="Modelul OSI și nivelul la care lucrează fiecare dispozitiv">
        {LAYERS.map((l) => {
          const y = rowY(l.n); const on = sel === l.n;
          return (
            <g key={l.n} style={{ cursor: 'pointer' }} onClick={() => setSel(on ? null : l.n)}>
              <rect x={8} y={y} width={744} height={36} rx={8} fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={on ? 'var(--accent)' : 'var(--border)'} opacity={on ? 1 : 0.75} />
              <T x={24} y={y + 23} anchor="start" weight={750} color="var(--accent)" size={13}>L{l.n}</T>
              <T x={52} y={y + 16} anchor="start" weight={650} size={12}>{l.name}</T>
              <T x={52} y={y + 30} anchor="start" size={10} color="var(--muted)">{l.pdu}</T>
            </g>
          );
        })}
        {DEVS.map((d, i) => {
          const cx = 286 + i * 61; const yTop = rowY(d.hi) + 4; const yBot = rowY(1) + 32;
          const dim = sel !== null && sel > d.hi;
          return (
            <g key={d.name} opacity={dim ? 0.22 : 1} style={{ pointerEvents: 'none' }}>
              <rect x={cx - 15} y={yTop} width={30} height={yBot - yTop} rx={9} fill={d.c} fillOpacity={0.22} stroke={d.c} strokeWidth={1.6} />
              <T x={cx} y={yTop + 16} size={10} weight={700} color={d.c}>L{d.hi}</T>
              <T x={cx} y={318} size={10.5} weight={650}>{d.name}</T>
            </g>
          );
        })}
        <T x={380} y={342} size={10.5} color="var(--muted)">bara arată până la ce nivel „citește” dispozitivul ca să decidă ce face cu traficul</T>
      </svg>
      <div className="controls">
        <span className="small" style={{ color: L ? 'var(--accent)' : 'var(--muted)' }}>
          {L ? <><b>L{L.n} {L.name}</b> ({L.ro}): {L.ex}. PDU: <b>{L.pdu}</b>. {DEVS.filter((d) => d.hi >= L.n).map((d) => d.name).join(', ')} lucrează la acest nivel.</>
            : 'Atinge un nivel ca să vezi ce face și care dispozitive ajung până la el.'}
        </span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   2) Călătoria unui pachet: PC → switch → router → firewall → Internet → server
---------------------------------------------------------------- */
type Hop = {
  key: string; title: string; layer: string; role: string; decision: string;
  dmac: string; smac: string; sip: string; dip: string; ttl: number; note: string;
};
const HOPS: Hop[] = [
  { key: 'pc', title: 'PC-A (endpoint)', layer: 'L1–L7', role: 'Creează datele (browserul cere o pagină web) și le încapsulează: segment TCP → pachet IP → cadru Ethernet.',
    decision: 'Destinația 198.51.100.80 NU este în rețeaua mea 192.168.1.0/24 → trimit cadrul la default gateway (R1). Am aflat MAC-ul lui R1 prin ARP.',
    dmac: 'R1 Gi0/0 (00d0.9701.0001)', smac: 'PC-A (0050.7966.0001)', sip: '192.168.1.10', dip: '198.51.100.80', ttl: 128, note: 'MAC destinație = routerul, NU serverul: MAC-urile au sens doar în rețeaua locală.' },
  { key: 'sw', title: 'SW1 (switch L2)', layer: 'L2', role: 'Leagă dispozitivele din aceeași rețea locală. Citește doar antetul Ethernet.',
    decision: 'Caut MAC-ul destinație 00d0.9701.0001 în tabela MAC → e pe portul Gi0/24 → trimit cadrul DOAR acolo. Nu modific nimic.',
    dmac: 'R1 Gi0/0 (00d0.9701.0001)', smac: 'PC-A (0050.7966.0001)', sip: '192.168.1.10', dip: '198.51.100.80', ttl: 128, note: 'Switch-ul nu se uită la IP. Cadrul iese neschimbat.' },
  { key: 'r1', title: 'R1 (router)', layer: 'L3', role: 'Leagă rețele diferite. Desface cadrul, citește IP-ul destinație și caută în tabela de rutare.',
    decision: '198.51.100.80 nu e într-o rețea conectată → potrivire pe ruta implicită 0.0.0.0/0 via 10.0.0.2 (firewall). TTL − 1. Construiesc un cadru NOU cu MAC-urile legăturii următoare.',
    dmac: 'FW inside (0026.0b11.0001)', smac: 'R1 Gi0/1 (00d0.9701.0002)', sip: '192.168.1.10', dip: '198.51.100.80', ttl: 127, note: 'MAC-urile s-au schimbat complet; IP-urile au rămas aceleași.' },
  { key: 'fw', title: 'FW (NGFW)', layer: 'L3–L7', role: 'Aplică politica de securitate între zona internă (inside) și Internet (outside).',
    decision: 'Politica: inside → outside, aplicația „web (HTTPS)” = permis. Verific semnăturile IPS (curat). Creez o intrare în tabela de stare și fac NAT: 192.168.1.10 → 203.0.113.2.',
    dmac: 'ISP (0019.e7aa.0001)', smac: 'FW outside (0026.0b11.0002)', sip: '203.0.113.2 (după NAT)', dip: '198.51.100.80', ttl: 126, note: 'Răspunsul serverului va fi permis automat pentru că se potrivește cu intrarea din tabela de stare.' },
  { key: 'inet', title: 'Internet (routerele ISP-urilor)', layer: 'L3', role: 'Zeci de routere ale furnizorilor. Fiecare face același lucru ca R1: caută destinația și rescrie antetul L2.',
    decision: 'La fiecare hop: TTL − 1, MAC-uri noi. Rutele spre 198.51.100.0/24 sunt învățate prin BGP între furnizori.',
    dmac: '(se schimbă la fiecare hop)', smac: '(se schimbă la fiecare hop)', sip: '203.0.113.2', dip: '198.51.100.80', ttl: 118, note: 'Câte hop-uri? Vezi cu traceroute (topicul 1.10).' },
  { key: 'srv', title: 'Server web (server)', layer: 'L1–L7', role: 'Oferă serviciul. Desface toate antetele până la aplicație (portul TCP 443 → serverul web).',
    decision: 'IP-ul destinație e al meu, portul 443 e al serviciului HTTPS → predau datele aplicației și trimit răspunsul înapoi la 203.0.113.2.',
    dmac: 'Server (0c1a.2b3c.0080)', smac: 'router ISP final', sip: '203.0.113.2', dip: '198.51.100.80', ttl: 116, note: 'Pentru server, clientul este 203.0.113.2 — adresa publică după NAT.' },
];
export function PacketJourney() {
  const [i, setI] = useState(0);
  const h = HOPS[i];
  const X = [60, 180, 300, 420, 545, 680];
  const on = (k: number) => k < i;
  return (
    <>
      <svg viewBox="0 0 740 190" width="100%" role="img" aria-label="Drumul unui pachet de la PC la un server din Internet">
        <rect x={10} y={8} width={348} height={150} rx={12} fill="var(--accent-soft)" opacity={0.35} />
        <T x={20} y={24} anchor="start" size={10.5} color="var(--muted)">LAN 192.168.1.0/24 (inside)</T>
        <T x={730} y={24} anchor="end" size={10.5} color="var(--muted)">outside / Internet</T>
        {X.slice(0, -1).map((x, k) => <Wire key={k} x1={x + 30} y1={80} x2={X[k + 1] - 30} y2={80} on={on(k + 1) || k + 1 === i} />)}
        {[
          <ClientIcon key="pc" x={X[0]} y={80} kind="pc" />, <SwitchIcon key="sw" x={X[1]} y={80} />, <RouterIcon key="r" x={X[2]} y={80} />,
          <FirewallIcon key="fw" x={X[3]} y={80} />, <CloudIcon key="c" x={X[4]} y={80} />, <ServerIcon key="s" x={X[5]} y={84} />,
        ].map((icon, k) => (
          <g key={k} style={{ cursor: 'pointer' }} onClick={() => setI(k)}>
            <rect x={X[k] - 44} y={40} width={88} height={100} rx={10} fill={k === i ? 'var(--accent-soft)' : 'transparent'} stroke={k === i ? 'var(--accent)' : 'transparent'} />
            {icon}
            <T x={X[k]} y={126} size={10.5} weight={650}>{['PC-A', 'SW1', 'R1', 'FW', 'Internet', 'Web server'][k]}</T>
            <T x={X[k]} y={152} size={10} color="var(--muted)">{HOPS[k].layer}</T>
          </g>
        ))}
        <circle cx={X[i]} cy={52} r={7} fill="var(--accent)"><animate attributeName="r" values="6;9;6" dur="1.4s" repeatCount="indefinite" /></circle>
        <T x={370} y={182} size={10.5} color="var(--muted)">atinge un dispozitiv sau folosește butoanele</T>
      </svg>
      <div className="controls">
        <button className="btn sm" disabled={i === 0} onClick={() => setI(i - 1)}>← Înapoi</button>
        <button className="btn sm primary" disabled={i === HOPS.length - 1} onClick={() => setI(i + 1)}>Pasul următor →</button>
        <span className="badge accent">pas {i + 1} / {HOPS.length}</span>
      </div>
      <div style={{ marginTop: 12, padding: 14, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-3)' }}>
        <div className="row between"><b>{h.title}</b><span className="badge info">lucrează la {h.layer}</span></div>
        <p className="small" style={{ margin: '8px 0 4px' }}><b>Rol:</b> {h.role}</p>
        <p className="small" style={{ margin: '4px 0 10px' }}><b>Decizia:</b> {h.decision}</p>
        <div className="table-wrap"><table className="t">
          <thead><tr><th>Antet</th><th>Câmp</th><th>Valoare la ieșirea din {h.title.split(' ')[0]}</th></tr></thead>
          <tbody>
            <tr><td rowSpan={2}>L2 Ethernet</td><td>MAC destinație</td><td className="mono small">{h.dmac}</td></tr>
            <tr><td>MAC sursă</td><td className="mono small">{h.smac}</td></tr>
            <tr><td rowSpan={3}>L3 IP</td><td>IP sursă</td><td className="mono small">{h.sip}</td></tr>
            <tr><td>IP destinație</td><td className="mono small">{h.dip}</td></tr>
            <tr><td>TTL</td><td className="mono small">{h.ttl}</td></tr>
          </tbody>
        </table></div>
        <p className="small muted" style={{ margin: '8px 0 0' }}>{h.note}</p>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   3) Hub → bridge → switch: cine primește cadrul și câte domenii de coliziune
---------------------------------------------------------------- */
export function HubBridgeSwitch() {
  const [dev, setDev] = useState<'hub' | 'bridge' | 'switch'>('hub');
  const [bc, setBc] = useState(false);
  const hosts = [{ n: 'A', x: 110, y: 200 }, { n: 'B', x: 270, y: 200 }, { n: 'C', x: 470, y: 200 }, { n: 'D', x: 630, y: 200 }];
  // cine primește cadrul trimis de A (spre C sau broadcast)
  const gets = (n: string) => {
    if (n === 'A') return false;
    if (bc || dev === 'hub') return true;
    if (dev === 'bridge') return n === 'B' || n === 'C'; // B e pe același segment (hub) cu A
    return n === 'C';
  };
  const cd = dev === 'hub' ? 1 : dev === 'bridge' ? 2 : 4;
  return (
    <>
      <div className="row" style={{ marginBottom: 10 }}>
        <div className="segmented" role="group" aria-label="Dispozitiv">
          {(['hub', 'bridge', 'switch'] as const).map((k) => <button key={k} className={dev === k ? 'on' : ''} onClick={() => setDev(k)}>{k === 'hub' ? 'Hub (L1)' : k === 'bridge' ? 'Bridge (L2)' : 'Switch (L2)'}</button>)}
        </div>
        <div className="segmented" role="group" aria-label="Tip cadru">
          <button className={!bc ? 'on' : ''} onClick={() => setBc(false)}>A → C (unicast)</button>
          <button className={bc ? 'on' : ''} onClick={() => setBc(true)}>A → toți (broadcast)</button>
        </div>
      </div>
      <svg viewBox="0 0 740 280" width="100%" role="img" aria-label="Comparație hub, bridge, switch">
        <Arrow id="hbsA" color="var(--accent)" />
        {/* domenii de coliziune */}
        {dev === 'hub' && <rect x={40} y={40} width={660} height={200} rx={24} fill="var(--bad)" fillOpacity={0.06} stroke="var(--bad)" strokeDasharray="6 5" />}
        {dev === 'bridge' && <>
          <rect x={40} y={40} width={300} height={200} rx={24} fill="var(--bad)" fillOpacity={0.06} stroke="var(--bad)" strokeDasharray="6 5" />
          <rect x={400} y={40} width={300} height={200} rx={24} fill="var(--info)" fillOpacity={0.06} stroke="var(--info)" strokeDasharray="6 5" />
        </>}
        {dev === 'switch' && hosts.map((h) => <rect key={h.n} x={h.x - 50} y={110} width={100} height={128} rx={18} fill="var(--ok)" fillOpacity={0.06} stroke="var(--ok)" strokeDasharray="5 5" />)}
        {/* dispozitivele centrale */}
        {dev === 'hub' && <><HubIcon x={370} y={80} />{hosts.map((h) => <Wire key={h.n} x1={370} y1={92} x2={h.x} y2={186} on={h.n === 'A' || gets(h.n)} color={h.n === 'A' ? 'var(--accent)' : 'var(--bad)'} />)}</>}
        {dev === 'bridge' && <>
          <HubIcon x={190} y={110} /><HubIcon x={550} y={110} />
          <rect x={340} y={58} width={60} height={26} rx={5} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.6} />
          <T x={370} y={75} size={10.5} weight={700} color="var(--info)">BRIDGE</T>
          <Wire x1={220} y1={104} x2={340} y2={74} on /><Wire x1={400} y1={74} x2={520} y2={104} on={gets('C') || bc} />
          {hosts.map((h) => <Wire key={h.n} x1={h.x < 370 ? 190 : 550} y1={121} x2={h.x} y2={186} on={h.n === 'A' || gets(h.n)} color={h.n === 'A' ? 'var(--accent)' : h.n === 'B' && !bc ? 'var(--warn)' : 'var(--accent)'} />)}
        </>}
        {dev === 'switch' && <><SwitchIcon x={370} y={70} />{hosts.map((h) => <Wire key={h.n} x1={370} y1={82} x2={h.x} y2={186} on={h.n === 'A' || gets(h.n)} />)}</>}
        {hosts.map((h) => (
          <g key={h.n}>
            <ClientIcon x={h.x} y={200} kind="pc" />
            <T x={h.x} y={232} weight={700} color={h.n === 'A' ? 'var(--accent)' : gets(h.n) ? (bc || h.n === 'C' ? 'var(--ok)' : 'var(--warn)') : 'var(--muted)'}>
              {h.n}{h.n === 'A' ? ' (trimite)' : gets(h.n) ? (bc || h.n === 'C' ? ' ✓ primește' : ' primește (inutil)') : ' — liniște'}
            </T>
          </g>
        ))}
        <T x={370} y={268} size={11.5} weight={650} color="var(--text-2)">
          {`Domenii de coliziune: ${cd} · Domenii de broadcast: 1 · ${dev === 'hub' ? 'half-duplex, CSMA/CD' : dev === 'bridge' ? 'segmentele cu hub rămân half-duplex' : 'full-duplex pe fiecare port, fără coliziuni'}`}
        </T>
      </svg>
      <div className="controls"><span className="small muted">
        {dev === 'hub' && 'Hub-ul repetă semnalul electric pe toate porturile. Toți „aud” tot și doar unul poate vorbi o dată.'}
        {dev === 'bridge' && 'Bridge-ul a învățat că C e în partea dreaptă: cadrul trece. Un cadru A → B ar rămâne în stânga (filtrat). B tot primește A → C, pentru că stă pe același hub cu A.'}
        {dev === 'switch' && (bc ? 'Broadcast-ul ajunge la TOȚI — și la switch. Switch-ul nu separă domeniile de broadcast (doar routerul și VLAN-urile o fac).' : 'Switch-ul știe din tabela MAC că C e pe portul 3: cadrul merge doar acolo. Fiecare port = domeniu de coliziune separat (microsegmentare).')}
      </span></div>
    </>
  );
}

/* ---------------------------------------------------------------
   4) Tabela de rutare — longest prefix match (interactiv)
---------------------------------------------------------------- */
const ROUTES = [
  { code: 'S*', net: '0.0.0.0', len: 0, via: 'via 203.0.113.1', ad: '[1/0]', ifc: 'Gi0/2' },
  { code: 'O', net: '10.0.0.0', len: 8, via: 'via 10.255.0.2', ad: '[110/3]', ifc: 'Gi0/1' },
  { code: 'S', net: '10.1.0.0', len: 16, via: 'via 10.255.0.6', ad: '[1/0]', ifc: 'Gi0/3' },
  { code: 'C', net: '10.1.1.0', len: 24, via: 'directly connected', ad: '', ifc: 'Gi0/0' },
  { code: 'L', net: '10.1.1.1', len: 32, via: 'directly connected', ad: '', ifc: 'Gi0/0' },
];
const ip2n = (s: string) => {
  const p = s.trim().split('.');
  if (p.length !== 4 || p.some((x) => !/^\d{1,3}$/.test(x) || +x > 255)) return null;
  return p.reduce((a, x) => a * 256 + +x, 0);
};
const inNet = (ip: number, net: string, len: number) => {
  if (len === 0) return true;
  const n = ip2n(net)!; const block = 2 ** (32 - len);
  return Math.floor(ip / block) === Math.floor(n / block);
};
export function RouteLookup() {
  const [dst, setDst] = useState('10.1.7.7');
  const ip = ip2n(dst);
  const matches = ip === null ? [] : ROUTES.map((r, i) => (inNet(ip, r.net, r.len) ? i : -1)).filter((i) => i >= 0);
  const best = matches.length ? matches.reduce((a, b) => (ROUTES[b].len > ROUTES[a].len ? b : a)) : -1;
  return (
    <>
      <div className="controls" style={{ marginTop: 0, marginBottom: 10 }}>
        {['10.1.1.50', '10.1.7.7', '10.99.0.1', '8.8.8.8', '10.1.1.1'].map((d) => <button key={d} className={`btn sm ${dst === d ? 'primary' : ''}`} onClick={() => setDst(d)}>{d}</button>)}
        <input className="input mono" style={{ width: 150 }} value={dst} onChange={(e) => setDst(e.target.value)} aria-label="IP destinație" />
      </div>
      <div className="table-wrap"><table className="t">
        <thead><tr><th>Cod</th><th>Prefix</th><th>[AD/metric]</th><th>Next hop</th><th>Interfață</th><th>Se potrivește?</th></tr></thead>
        <tbody>{ROUTES.map((r, i) => {
          const m = matches.includes(i); const b = i === best;
          return (
            <tr key={i} style={{ background: b ? 'var(--accent-soft)' : undefined, opacity: m ? 1 : 0.55 }}>
              <td className="mono">{r.code}</td><td className="mono">{r.net}/{r.len}</td><td className="mono">{r.ad || '—'}</td>
              <td className="small">{r.via}</td><td className="mono">{r.ifc}</td>
              <td style={{ color: b ? 'var(--accent)' : m ? 'var(--ok)' : 'var(--muted)', fontWeight: b ? 700 : 500 }}>{b ? `✓ CÂȘTIGĂ (/${r.len})` : m ? 'da, dar mai puțin specific' : 'nu'}</td>
            </tr>
          );
        })}</tbody>
      </table></div>
      <p className="small" style={{ marginTop: 8, color: ip === null ? 'var(--bad)' : 'var(--text-2)' }}>
        {ip === null ? 'Scrie o adresă IPv4 validă (de exemplu 10.1.200.3).'
          : best === 4 ? 'Destinația este chiar adresa routerului (ruta L /32) → pachetul e pentru R1 însuși (de exemplu un ping la router), nu se mai trimite mai departe.'
          : best === 0 ? 'Nicio rută specifică nu se potrivește → se folosește ruta implicită (gateway of last resort). Fără ea, pachetul ar fi aruncat.'
          : `Se potrivesc ${matches.length} rute; câștigă cea cu prefixul cel mai lung (/${ROUTES[best].len}) → ieșire pe ${ROUTES[best].ifc}. Lungimea prefixului contează ÎNAINTEA distanței administrative.`}
      </p>
    </>
  );
}

/* ---------------------------------------------------------------
   5) Rutare între VLAN-uri: router-on-a-stick vs switch L3
---------------------------------------------------------------- */
export function InterVlanCompare() {
  const [v, setV] = useState<'ros' | 'l3'>('ros');
  return (
    <>
      <div className="segmented" role="group" aria-label="Variantă" style={{ marginBottom: 10 }}>
        <button className={v === 'ros' ? 'on' : ''} onClick={() => setV('ros')}>Router-on-a-stick (înainte)</button>
        <button className={v === 'l3' ? 'on' : ''} onClick={() => setV('l3')}>Switch L3 (azi)</button>
      </div>
      <svg viewBox="0 0 740 250" width="100%" role="img" aria-label="Rutare între VLAN-uri">
        <Arrow id="ivA" color="var(--warn)" />
        {v === 'ros' ? <>
          <RouterIcon x={370} y={40} label="" />
          <T x={410} y={36} anchor="start" size={11} color="var(--muted)">R1 — subinterfețe Gi0/0.10 și Gi0/0.20</T>
          <Wire x1={370} y1={54} x2={370} y2={118} on color="var(--warn)" />
          <T x={380} y={92} anchor="start" size={10.5} color="var(--warn)">un singur trunk: tot traficul dintre VLAN-uri urcă și coboară pe aici</T>
          <SwitchIcon x={370} y={130} />
          <T x={410} y={150} anchor="start" size={11} color="var(--muted)">switch L2</T>
        </> : <>
          <L3SwitchIcon x={370} y={120} />
          <T x={412} y={100} anchor="start" size={11} color="var(--muted)">switch L3: SVI VLAN 10 = 10.0.10.1 · SVI VLAN 20 = 10.0.20.1</T>
          <T x={412} y={150} anchor="start" size={10.5} color="var(--ok)">rutare în hardware (ASIC), la viteza porturilor</T>
        </>}
        <Wire x1={346} y1={v === 'ros' ? 142 : 134} x2={200} y2={194} /><Wire x1={394} y1={v === 'ros' ? 142 : 134} x2={540} y2={194} />
        <ClientIcon x={200} y={206} kind="pc" label="PC VLAN 10 · 10.0.10.5" />
        <ClientIcon x={540} y={206} kind="pc" label="PC VLAN 20 · 10.0.20.5" />
        <path d={v === 'ros' ? 'M215 186 Q 330 40 360 60 M380 60 Q 410 40 525 186' : 'M215 186 Q 300 130 350 128 M390 128 Q 440 130 525 186'} fill="none" stroke="var(--warn)" strokeWidth={1.8} strokeDasharray="5 4" markerEnd="url(#ivA)" />
      </svg>
      <div className="controls"><span className="small muted">
        {v === 'ros' ? 'Routerul face rutarea în software/CPU, printr-o singură legătură. Merge, dar devine gâtul sticlei când traficul dintre VLAN-uri crește.' : 'Același dispozitiv comută (L2) în interiorul VLAN-ului și rutează (L3) între VLAN-uri. Fără drum dus-întors până la un router.'}
      </span></div>
    </>
  );
}

/* ---------------------------------------------------------------
   6) Firewall stateful — tabela de stare (animație pas cu pas)
---------------------------------------------------------------- */
const FW_STEPS = [
  { dir: 'out', from: 'PC 192.168.1.10:51000', to: 'Server 198.51.100.80:443', flags: 'TCP SYN', verdict: 'PERMIS', ok: true,
    why: 'Politica permite inside → outside pentru HTTPS. Firewall-ul NOTEAZĂ conexiunea în tabela de stare.', table: ['192.168.1.10:51000 ↔ 198.51.100.80:443 · TCP · SYN_SENT'] },
  { dir: 'in', from: 'Server 198.51.100.80:443', to: 'PC 192.168.1.10:51000', flags: 'TCP SYN-ACK', verdict: 'PERMIS', ok: true,
    why: 'Nu există o regulă outside → inside, DAR pachetul se potrivește exact cu o conexiune din tabela de stare → este răspunsul așteptat.', table: ['192.168.1.10:51000 ↔ 198.51.100.80:443 · TCP · ESTABLISHED'] },
  { dir: 'in', from: 'Atacator 203.0.113.66:4444', to: 'PC 192.168.1.10:3389', flags: 'TCP SYN', verdict: 'BLOCAT', ok: false,
    why: 'Pachet nesolicitat din outside: nu se potrivește cu nicio intrare din tabelă și nicio regulă nu îl permite → aruncat (și jurnalizat).', table: ['192.168.1.10:51000 ↔ 198.51.100.80:443 · TCP · ESTABLISHED'] },
  { dir: 'out', from: 'PC 192.168.1.10:51000', to: 'Server 198.51.100.80:443', flags: 'TCP FIN', verdict: 'PERMIS', ok: true,
    why: 'Conexiunea se închide → intrarea este ștearsă (sau expiră după un timeout de inactivitate). Un pachet „de răspuns” venit după aceea ar fi blocat.', table: [] as string[] },
];
export function StatefulFirewall() {
  const [s, setS] = useState(0);
  const st = FW_STEPS[s];
  const out = st.dir === 'out';
  const col = st.ok ? 'var(--ok)' : 'var(--bad)';
  return (
    <>
      <svg viewBox="0 0 740 200" width="100%" role="img" aria-label="Firewall stateful: tabela de stare">
        <Arrow id="fwA" color={col} />
        <rect x={10} y={20} width={300} height={150} rx={14} fill="var(--ok)" fillOpacity={0.06} stroke="var(--ok)" strokeDasharray="5 5" />
        <rect x={430} y={20} width={300} height={150} rx={14} fill="var(--bad)" fillOpacity={0.05} stroke="var(--bad)" strokeDasharray="5 5" />
        <T x={24} y={40} anchor="start" size={11} weight={650} color="var(--ok)">INSIDE (încredere mare)</T>
        <T x={716} y={40} anchor="end" size={11} weight={650} color="var(--bad)">OUTSIDE (Internet)</T>
        <ClientIcon x={120} y={100} kind="pc" label="PC 192.168.1.10" />
        <FirewallIcon x={370} y={95} label="Firewall" sub="stateful" />
        <ServerIcon x={560} y={92} label="Server" sub="198.51.100.80" />
        <g opacity={s === 2 ? 1 : 0.35}><ClientIcon x={670} y={150} kind="laptop" /><T x={670} y={186} size={10} color="var(--bad)">atacator</T></g>
        <Wire x1={140} y1={100} x2={344} y2={95} /><Wire x1={396} y1={95} x2={540} y2={92} />
        {out
          ? <line x1={150} y1={70} x2={530} y2={66} stroke={col} strokeWidth={2.4} markerEnd="url(#fwA)" />
          : st.ok ? <line x1={530} y1={66} x2={150} y2={70} stroke={col} strokeWidth={2.4} markerEnd="url(#fwA)" />
            : <><line x1={650} y1={140} x2={404} y2={110} stroke={col} strokeWidth={2.4} markerEnd="url(#fwA)" /><T x={370} y={64} size={22} weight={800} color="var(--bad)">✕</T></>}
        <T x={370} y={194} size={11} weight={700} color={col}>{st.flags}: {st.verdict}</T>
      </svg>
      <div className="controls">
        <button className="btn sm" disabled={s === 0} onClick={() => setS(s - 1)}>← Înapoi</button>
        <button className="btn sm primary" disabled={s === FW_STEPS.length - 1} onClick={() => setS(s + 1)}>Pachetul următor →</button>
        <span className="badge accent">pachet {s + 1} / {FW_STEPS.length}</span>
      </div>
      <div style={{ marginTop: 12, padding: 14, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-3)' }}>
        <p className="small" style={{ margin: 0 }}><b>{st.from} → {st.to}</b> ({st.flags})</p>
        <p className="small" style={{ margin: '6px 0 10px', color: col }}><b>{st.verdict}:</b> <span style={{ color: 'var(--text-2)' }}>{st.why}</span></p>
        <div className="small"><b>Tabela de stare (state table):</b></div>
        <div className="mono small" style={{ marginTop: 4, padding: '8px 10px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {st.table.length ? st.table.map((r) => <div key={r}>{r}</div>) : <span className="muted">(goală)</span>}
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   7) IDS (copie, out-of-band) vs IPS (inline)
---------------------------------------------------------------- */
export function IdsVsIps() {
  const [v, setV] = useState<'ids' | 'ips'>('ids');
  return (
    <>
      <div className="segmented" role="group" aria-label="Mod" style={{ marginBottom: 10 }}>
        <button className={v === 'ids' ? 'on' : ''} onClick={() => setV('ids')}>IDS — primește o copie</button>
        <button className={v === 'ips' ? 'on' : ''} onClick={() => setV('ips')}>IPS — stă în calea traficului</button>
      </div>
      <svg viewBox="0 0 740 220" width="100%" role="img" aria-label="IDS versus IPS">
        <Arrow id="idsA" color="var(--warn)" />
        <CloudIcon x={70} y={80} label="Internet" />
        {v === 'ids' ? <>
          <Wire x1={104} y1={80} x2={330} y2={80} on color="var(--text-2)" />
          <SwitchIcon x={370} y={80} />
          <Wire x1={402} y1={80} x2={640} y2={80} on color="var(--text-2)" />
          <ServerIcon x={670} y={84} label="servere" />
          <line x1={370} y1={94} x2={370} y2={150} stroke="var(--warn)" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#idsA)" />
          <T x={380} y={128} anchor="start" size={10.5} color="var(--warn)">copie prin SPAN / TAP</T>
          <rect x={330} y={156} width={80} height={30} rx={7} fill="var(--surface-3)" stroke="var(--warn)" strokeWidth={1.6} />
          <T x={370} y={176} size={12} weight={700} color="var(--warn)">IDS</T>
          <T x={430} y={176} anchor="start" size={10.5} color="var(--muted)">vede atacul → alertă / jurnal; pachetul original a ajuns deja la destinație</T>
        </> : <>
          <Wire x1={104} y1={80} x2={330} y2={80} on color="var(--text-2)" />
          <rect x={330} y={64} width={80} height={32} rx={7} fill="var(--surface-3)" stroke="var(--bad)" strokeWidth={1.8} />
          <T x={370} y={85} size={12} weight={700} color="var(--bad)">IPS</T>
          <Wire x1={410} y1={80} x2={640} y2={80} on color="var(--text-2)" />
          <ServerIcon x={670} y={84} label="servere" />
          <T x={240} y={66} size={18} weight={800} color="var(--bad)">✕</T>
          <T x={240} y={110} size={10.5} color="var(--bad)">pachet malițios aruncat</T>
          <T x={370} y={150} size={10.5} color="var(--muted)">tot traficul trece PRIN el: poate bloca în timp real, dar adaugă latență;</T>
          <T x={370} y={166} size={10.5} color="var(--muted)">dacă cade, poate opri traficul (de aceea există fail-open / bypass)</T>
        </>}
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------
   8) Evoluția managementului wireless: autonom → WLC → Catalyst Center
---------------------------------------------------------------- */
export function WirelessMgmtEvolution() {
  const [v, setV] = useState<'auto' | 'wlc' | 'cc'>('auto');
  return (
    <>
      <div className="segmented" role="group" aria-label="Arhitectură" style={{ marginBottom: 10 }}>
        <button className={v === 'auto' ? 'on' : ''} onClick={() => setV('auto')}>AP autonome</button>
        <button className={v === 'wlc' ? 'on' : ''} onClick={() => setV('wlc')}>Lightweight + WLC</button>
        <button className={v === 'cc' ? 'on' : ''} onClick={() => setV('cc')}>Catalyst Center</button>
      </div>
      <svg viewBox="0 0 740 260" width="100%" role="img" aria-label="Evoluția gestionării rețelei wireless">
        <Arrow id="wmA" color="var(--violet)" />
        <SwitchIcon x={370} y={120} />
        {[150, 300, 440, 590].map((x) => <Wire key={x} x1={370} y1={132} x2={x} y2={188} />)}
        {[150, 300, 440, 590].map((x, k) => <APIcon key={x} x={x} y={200} label={`AP${k + 1}`} sub={v === 'auto' ? 'config proprie' : 'lightweight'} />)}
        {v === 'auto' && <>
          <ClientIcon x={80} y={50} kind="laptop" label="admin" />
          {[150, 300, 440, 590].map((x) => <path key={x} d={`M96 52 Q ${x} 70 ${x} 176`} fill="none" stroke="var(--warn)" strokeWidth={1.3} strokeDasharray="4 4" />)}
          <T x={470} y={40} size={11} color="var(--warn)">administratorul se conectează pe FIECARE AP, unul câte unul</T>
          <T x={470} y={56} size={10.5} color="var(--muted)">fără coordonare a canalelor/puterii, roaming lent, configurații diferite</T>
        </>}
        {v === 'wlc' && <>
          <ControllerIcon x={370} y={40} label="WLC" sub="config · RRM · roaming · autentificare" />
          <Wire x1={370} y1={56} x2={370} y2={106} on color="var(--violet)" />
          {[150, 300, 440, 590].map((x) => <path key={x} d={`M370 60 Q ${x} 90 ${x} 182`} fill="none" stroke="var(--violet)" strokeWidth={1.4} strokeDasharray="6 4" />)}
          <T x={600} y={110} size={10.5} color="var(--violet)">tuneluri CAPWAP</T>
          <T x={600} y={124} size={10} color="var(--muted)">UDP 5246 control · 5247 date</T>
        </>}
        {v === 'cc' && <>
          <ControllerIcon x={370} y={30} label="Catalyst Center" color="var(--accent)" />
          <ControllerIcon x={150} y={110} label="WLC" />
          <RouterIcon x={600} y={110} label="" />
          <line x1={330} y1={44} x2={180} y2={92} stroke="var(--accent)" strokeWidth={1.6} markerEnd="url(#wmA)" />
          <line x1={370} y1={46} x2={370} y2={104} stroke="var(--accent)" strokeWidth={1.6} markerEnd="url(#wmA)" />
          <line x1={410} y1={44} x2={580} y2={96} stroke="var(--accent)" strokeWidth={1.6} markerEnd="url(#wmA)" />
          <T x={560} y={30} anchor="start" size={10.5} color="var(--accent)">gestionează TOATĂ rețeaua:</T>
          <T x={560} y={44} anchor="start" size={10.5} color="var(--muted)">switch-uri, routere, WLC-uri, AP-uri</T>
          <T x={370} y={252} size={10.5} color="var(--muted)">Catalyst Center (fost DNA Center) NU stă în calea traficului utilizatorilor — doar automatizare, politici, assurance</T>
        </>}
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------
   9) Client-server vs peer-to-peer
---------------------------------------------------------------- */
export function ClientServerP2P() {
  const [v, setV] = useState<'cs' | 'p2p'>('cs');
  const pts = [{ x: 130, y: 70 }, { x: 610, y: 70 }, { x: 130, y: 200 }, { x: 610, y: 200 }];
  return (
    <>
      <div className="segmented" role="group" aria-label="Model" style={{ marginBottom: 10 }}>
        <button className={v === 'cs' ? 'on' : ''} onClick={() => setV('cs')}>Client-server</button>
        <button className={v === 'p2p' ? 'on' : ''} onClick={() => setV('p2p')}>Peer-to-peer</button>
      </div>
      <svg viewBox="0 0 740 250" width="100%" role="img" aria-label="Client-server versus peer-to-peer">
        {v === 'cs' ? <>
          <ServerIcon x={370} y={135} label="Server" sub="oferă serviciul (de exemplu web, fișiere)" />
          {pts.map((p, k) => <Wire key={k} x1={p.x + (p.x < 370 ? 18 : -18)} y1={p.y} x2={p.x < 370 ? 350 : 390} y2={130} on color="var(--ok)" />)}
        </> : <>
          {pts.map((a, i) => pts.slice(i + 1).map((b, j) => <Wire key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} on color="var(--info)" dash="6 4" />))}
          <T x={370} y={140} size={11} color="var(--muted)">fiecare nod este și client, și server</T>
        </>}
        {pts.map((p, k) => <ClientIcon key={k} x={p.x} y={p.y} kind={k % 2 ? 'laptop' : 'pc'} label={v === 'cs' ? 'client' : `peer ${k + 1}`} />)}
      </svg>
      <div className="controls"><span className="small muted">
        {v === 'cs' ? 'Serviciul e centralizat: ușor de securizat, salvat (backup) și administrat. Dacă serverul cade, serviciul cade pentru toți — de aceea serverele au redundanță.' : 'Fără server central (de exemplu partajarea de fișiere între două PC-uri, BitTorrent). Ieftin și simplu pentru câteva noduri, greu de administrat și securizat la scară.'}
      </span></div>
    </>
  );
}

/* ---------------------------------------------------------------
   10) PoE — detecție, clasificare, alimentare (pas cu pas)
---------------------------------------------------------------- */
const POE_STEPS = [
  { t: 'Idle', d: 'Portul e pregătit, dar tensiunea e zero. Un PC obișnuit conectat aici nu primește niciodată curent.' },
  { t: '1. Detection', d: 'PSE-ul aplică o tensiune mică (≈2.7–10.1 V) și caută rezistența de semnătură a PD-ului (≈25 kΩ). Fără semnătură → nu se alimentează.' },
  { t: '2. Classification', d: 'PSE-ul aplică ≈14.5–20.5 V și măsoară curentul de clasificare → află clasa PD-ului (0–8) și cât să rezerve din buget.' },
  { t: '3. Power-up', d: 'Dacă bugetul permite, PSE-ul aplică tensiunea de lucru (≈44–57 V la 802.3af; ≈50–57 V la PoE+ și peste). PD-ul pornește.' },
  { t: '4. Negociere L2 (opțional)', d: 'După pornire, PD-ul poate cere exact puterea de care are nevoie prin CDP (Cisco) sau LLDP-MED, în pași de 0.1 W. Telefonul află tot de aici și VLAN-ul de voce.' },
  { t: '5. Monitorizare (MPS)', d: 'PSE-ul verifică permanent că PD-ul e încă acolo (Maintain Power Signature). Dacă îl deconectezi, tensiunea dispare imediat.' },
];
export function PoeSequence() {
  const [s, setS] = useState(0);
  // grafic tensiune: segmente [x0, x1, V]
  const seg: [number, number, number][] = [[40, 140, 0], [140, 260, 8], [260, 380, 18], [380, 720, 50]];
  const vy = (v: number) => 170 - v * 2.4;
  const upto = [140, 260, 380, 520, 620, 720][s];
  return (
    <>
      <svg viewBox="0 0 760 230" width="100%" role="img" aria-label="Secvența PoE: detecție, clasificare, alimentare">
        <line x1={40} y1={170} x2={730} y2={170} stroke="var(--border)" /><line x1={40} y1={30} x2={40} y2={170} stroke="var(--border)" />
        <T x={44} y={26} anchor="start" size={10} color="var(--muted)">tensiune pe pereche (V)</T>
        {[0, 10, 20, 50].map((v) => <g key={v}><line x1={36} x2={730} y1={vy(v)} y2={vy(v)} stroke="var(--border)" strokeDasharray="2 5" opacity={0.6} /><T x={32} y={vy(v) + 4} anchor="end" size={9.5} color="var(--muted)">{v}</T></g>)}
        {seg.map(([a, b, v], k) => {
          const x1 = Math.min(b, upto); if (x1 <= a) return null;
          return <g key={k}><line x1={a} x2={x1} y1={vy(v)} y2={vy(v)} stroke="var(--accent)" strokeWidth={3} />{k > 0 && <line x1={a} x2={a} y1={vy(seg[k - 1][2])} y2={vy(v)} stroke="var(--accent)" strokeWidth={3} />}</g>;
        })}
        {[['Detection', 200], ['Classification', 320], ['Power on', 450], ['CDP / LLDP', 570], ['MPS', 670]].map(([t, x], k) => (
          <g key={t} opacity={s >= k + 1 ? 1 : 0.3}>
            <rect x={(x as number) - 52} y={186} width={104} height={24} rx={7} fill={s === k + 1 ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={s === k + 1 ? 'var(--accent)' : 'var(--border)'} />
            <T x={x as number} y={202} size={10.5} weight={650}>{t}</T>
          </g>
        ))}
        {s >= 4 && <T x={570} y={vy(50) - 10} size={10} color="var(--violet)">„am nevoie de 9.5 W” (TLV power)</T>}
        <T x={60} y={vy(0) - 8} anchor="start" size={10} color="var(--muted)">0 V</T>
      </svg>
      <div className="controls">
        <button className="btn sm" disabled={s === 0} onClick={() => setS(s - 1)}>← Înapoi</button>
        <button className="btn sm primary" disabled={s === POE_STEPS.length - 1} onClick={() => setS(s + 1)}>Pasul următor →</button>
        <span className="small"><b>{POE_STEPS[s].t}:</b> {POE_STEPS[s].d}</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   11) Calculator de buget PoE (interactiv)
---------------------------------------------------------------- */
const PD_TYPES = [
  { k: 'phone', name: 'Telefon IP', cls: 2, pse: 7.0, pd: 6.49, std: '802.3af' },
  { k: 'cam', name: 'Cameră IP fixă', cls: 3, pse: 15.4, pd: 12.95, std: '802.3af' },
  { k: 'ap', name: 'AP Wi-Fi 6', cls: 4, pse: 30, pd: 25.5, std: '802.3at (PoE+)' },
  { k: 'ptz', name: 'AP Wi-Fi 7 / cameră PTZ', cls: 6, pse: 60, pd: 51, std: '802.3bt Type 3' },
  { k: 'big', name: 'Corp LED / mini-PC / display', cls: 8, pse: 90, pd: 71.3, std: '802.3bt Type 4' },
];
export function PoeBudget() {
  const [budget, setBudget] = useState(370);
  const [ports, setPorts] = useState(24);
  const [n, setN] = useState<Record<string, number>>({ phone: 10, cam: 2, ap: 6, ptz: 0, big: 0 });
  const add = (k: string, d: number) => setN((s) => ({ ...s, [k]: Math.max(0, Math.min(48, (s[k] ?? 0) + d)) }));
  // porturile se alocă în ordinea listei; fiecare PD rezervă puterea maximă a clasei lui (la PSE)
  const list: { t: (typeof PD_TYPES)[number]; ok: boolean; noPort: boolean }[] = [];
  let used = 0;
  for (const t of PD_TYPES) for (let i = 0; i < (n[t.k] ?? 0); i++) {
    const noPort = list.length >= ports;
    const ok = !noPort && used + t.pse <= budget + 1e-9;
    if (ok) used += t.pse;
    list.push({ t, ok, noPort });
  }
  const denied = list.filter((x) => !x.ok && !x.noPort).length;
  const noPort = list.filter((x) => x.noPort).length;
  const pdSum = list.filter((x) => x.ok).reduce((a, x) => a + x.t.pd, 0);
  const pct = Math.min(100, (used / budget) * 100);
  const cols = ports === 48 ? 24 : 12;
  return (
    <>
      <div className="controls" style={{ marginTop: 0 }}>
        <span className="small"><b>Buget PoE al switch-ului:</b></span>
        {[124, 370, 740, 1440].map((b) => <button key={b} className={`btn sm ${budget === b ? 'primary' : ''}`} onClick={() => setBudget(b)}>{b} W</button>)}
        <span className="small"><b>Porturi:</b></span>
        {[24, 48].map((p) => <button key={p} className={`btn sm ${ports === p ? 'primary' : ''}`} onClick={() => setPorts(p)}>{p}</button>)}
      </div>
      <div className="table-wrap" style={{ marginTop: 10 }}><table className="t">
        <thead><tr><th>Dispozitiv (PD)</th><th>Clasă / standard</th><th>Rezervat la PSE</th><th>Garantat la PD</th><th>Bucăți</th></tr></thead>
        <tbody>{PD_TYPES.map((t) => (
          <tr key={t.k}>
            <td>{t.name}</td><td className="small">Class {t.cls} · {t.std}</td><td className="mono">{t.pse.toFixed(1)} W</td><td className="mono">{t.pd} W</td>
            <td><div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
              <button className="btn sm" aria-label={`scade ${t.name}`} onClick={() => add(t.k, -1)}>−</button>
              <b className="mono" style={{ minWidth: 22, textAlign: 'center' }}>{n[t.k] ?? 0}</b>
              <button className="btn sm" aria-label={`crește ${t.name}`} onClick={() => add(t.k, 1)}>+</button>
            </div></td>
          </tr>
        ))}</tbody>
      </table></div>
      <svg viewBox="0 0 760 64" width="100%" role="img" aria-label="Bugetul PoE folosit" style={{ marginTop: 10 }}>
        <rect x={0} y={8} width={760} height={26} rx={8} fill="var(--surface-3)" stroke="var(--border)" />
        <rect x={0} y={8} width={(760 * pct) / 100} height={26} rx={8} fill={denied ? 'var(--bad)' : pct > 85 ? 'var(--warn)' : 'var(--accent)'} opacity={0.85} />
        <T x={10} y={26} anchor="start" size={12} weight={700}>{used.toFixed(1)} W rezervați din {budget} W</T>
        <T x={750} y={26} anchor="end" size={12} weight={700}>{(budget - used).toFixed(1)} W rămași</T>
        <T x={0} y={56} anchor="start" size={10.5} color="var(--muted)">{`Putere care ajunge efectiv la PD-uri (minim garantat): ≈${pdSum.toFixed(1)} W — restul se pierde pe cablu (până la 100 m)`}</T>
      </svg>
      <svg viewBox={`0 0 760 ${ports === 48 ? 70 : 70}`} width="100%" role="img" aria-label="Porturile switch-ului">
        {Array.from({ length: ports }, (_, p) => {
          const x = 6 + (p % cols) * (748 / cols); const y = 4 + Math.floor(p / cols) * 32; const d = list[p];
          const fill = !d ? 'var(--surface-3)' : d.ok ? 'var(--ok)' : 'var(--bad)';
          return <g key={p}><rect x={x} y={y} width={748 / cols - 6} height={26} rx={4} fill={fill} fillOpacity={d ? 0.75 : 1} stroke="var(--border)" />
            <T x={x + (748 / cols - 6) / 2} y={y + 17} size={9.5} weight={650} color={d ? 'var(--text)' : 'var(--muted)'}>{d ? `C${d.t.cls}` : p + 1}</T></g>;
        })}
      </svg>
      <p className="small" style={{ marginTop: 6, color: denied || noPort ? 'var(--bad)' : 'var(--ok)' }}>
        {denied ? `${denied} dispozitiv(e) NU primesc curent: bugetul s-a terminat (portul rămâne „off”, în show power inline apare ca power-deny / fault). ` : 'Toate dispozitivele sunt alimentate. '}
        {noPort ? `${noPort} dispozitiv(e) nu au port liber.` : ''}
      </p>
    </>
  );
}

/* ---------------------------------------------------------------
   12) Topologii laborator
---------------------------------------------------------------- */
export function LabGuidedTopology11() {
  return (
    <svg viewBox="0 0 760 330" width="100%" role="img" aria-label="Topologie lab ghidat 1.1">
      <rect x={10} y={150} width={330} height={170} rx={14} fill="var(--accent-soft)" opacity={0.3} />
      <T x={20} y={168} anchor="start" size={10.5} color="var(--muted)">LAN-A 192.168.10.0/24 (MLS1, SVI VLAN 1)</T>
      <rect x={420} y={150} width={330} height={170} rx={14} fill="var(--info)" fillOpacity={0.07} />
      <T x={740} y={168} anchor="end" size={10.5} color="var(--muted)">LAN-B 192.168.20.0/24</T>
      <RouterIcon x={380} y={40} label="R1 (2911)" sub="G0/0 10.0.0.1/30 · G0/1 192.168.20.1/24" />
      <Wire x1={360} y1={52} x2={190} y2={196} /><T x={250} y={110} size={10} color="var(--muted)">G0/0 ↔ Gi0/1 (routed)</T>
      <Wire x1={400} y1={52} x2={580} y2={198} /><T x={520} y={110} size={10} color="var(--muted)">G0/1 ↔ Gi0/1</T>
      <L3SwitchIcon x={180} y={210} label="MLS1 (3560-24PS)" sub="Gi0/1 10.0.0.2/30 · VLAN1 192.168.10.1" />
      <SwitchIcon x={580} y={210} label="SW2 (2960)" />
      <Wire x1={160} y1={224} x2={70} y2={272} /><Wire x1={200} y1={224} x2={280} y2={270} />
      <ClientIcon x={60} y={284} kind="pc" label="PC-A · Fa0/1 · .10" />
      <PhoneIcon x={290} y={282} label="PHONE1 (7960)" sub="Fa0/2 · PoE" />
      <Wire x1={560} y1={222} x2={490} y2={270} /><Wire x1={600} y1={222} x2={670} y2={268} />
      <ClientIcon x={490} y={284} kind="pc" label="PC-B · Fa0/1 · .20" />
      <ServerIcon x={680} y={284} label="SRV1 · .10" />
    </svg>
  );
}
export function LabSoloTopology11() {
  return (
    <svg viewBox="0 0 760 340" width="100%" role="img" aria-label="Topologie lab solo 1.1">
      <ServerIcon x={660} y={40} label="WEB-INET" sub="203.0.113.10" />
      <RouterIcon x={380} y={40} label="R-EDGE (2911)" sub="G0/1 203.0.113.1/24" />
      <Wire x1={410} y1={40} x2={640} y2={40} />
      <Wire x1={380} y1={54} x2={380} y2={118} /><T x={390} y={92} anchor="start" size={10} color="var(--muted)">10.0.0.0/30 (routed)</T>
      <L3SwitchIcon x={380} y={132} label="MLS-DIST (3560-24PS)" sub="gateway 192.168.10.1" />
      <Wire x1={352} y1={146} x2={180} y2={220} /><Wire x1={408} y1={146} x2={580} y2={220} />
      <Wire x1={360} y1={146} x2={330} y2={234} /><Wire x1={400} y1={146} x2={440} y2={234} />
      <PhoneIcon x={320} y={250} label="PHONE-1" sub="PoE" /><PhoneIcon x={445} y={250} label="PHONE-2" sub="PoE" />
      <SwitchIcon x={170} y={232} label="SW-ACC1 (2960)" />
      <SwitchIcon x={590} y={232} label="SW-ACC2 (2960)" />
      <Wire x1={150} y1={244} x2={70} y2={290} /><Wire x1={190} y1={244} x2={220} y2={288} />
      <ClientIcon x={60} y={302} kind="pc" label="PC-1" /><PhoneIcon x={225} y={300} label="PHONE-3" sub="adaptor!" />
      <Wire x1={590} y1={244} x2={590} y2={288} />
      <ClientIcon x={590} y={302} kind="pc" label="PC-2" />
    </svg>
  );
}
