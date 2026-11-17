import { useState, type CSSProperties } from 'react';
import { RouterIcon, SwitchIcon, ClientIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 4.3 (DHCP și DNS). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) DORA */
const DORA = [
  { n: 'Discover', c: 'var(--accent)', from: 'c', src: '0.0.0.0 : 68', dst: '255.255.255.255 : 67', mac: 'dst MAC ffff.ffff.ffff (broadcast)', d: 'Clientul nu are IP și nu știe cine e serverul, deci strigă în rețea: „Există un server DHCP?”. Sursa 0.0.0.0 (nu are adresă), destinația broadcast. Clientul își trece MAC-ul în câmpul chaddr.' },
  { n: 'Offer', c: 'var(--ok)', from: 's', src: 'IP server : 67', dst: 'IP oferit (unicast) sau 255.255.255.255 : 68', mac: 'oferă 192.168.1.50/24, gw, DNS, lease', d: 'Serverul rezervă temporar o adresă liberă din pool și o oferă cu parametrii: mască, gateway, DNS, durata lease. Dacă sunt mai multe servere, clientul primește mai multe oferte.' },
  { n: 'Request', c: 'var(--warn)', from: 'c', src: '0.0.0.0 : 68', dst: '255.255.255.255 : 67', mac: 'cere 192.168.1.50 de la serverul ales', d: 'Clientul alege o ofertă și o cere formal. Mesajul e tot broadcast, pentru ca celelalte servere să afle că oferta lor nu a fost aleasă și să-și elibereze rezervarea.' },
  { n: 'Acknowledge', c: 'var(--violet)', from: 's', src: 'IP server : 67', dst: 'IP oferit sau broadcast : 68', mac: 'confirmă lease-ul', d: 'Serverul confirmă și înregistrează lease-ul. Abia acum clientul configurează adresa pe interfață (de obicei verificând întâi, cu ARP, că nu e deja folosită).' },
];
export function DhcpDora() {
  const [n, setN] = useState(0);
  const m = DORA[n];
  const fromClient = m.from === 'c';
  return (
    <div>
      <Seg value={String(n)} set={(k) => setN(Number(k))} label="Mesajul DHCP" items={DORA.map((x, i) => [String(i), x.n] as [string, string])} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Schimbul de mesaje DHCP Discover, Offer, Request, Acknowledge între client și server">
        <ClientIcon x={80} y={110} kind="pc" label="Client" />
        <SwitchIcon x={360} y={110} label="SW" />
        <Box x={560} y={85} w={140} h={50} label="Server DHCP" sub="UDP 67" c="var(--ok)" />
        <Line x1={104} y1={110} x2={338} y2={110} c={m.c} w={fromClient ? 3 : 1.5} flow={fromClient} />
        <Line x1={382} y1={110} x2={560} y2={110} c={m.c} w={fromClient ? 3 : 1.5} flow={fromClient} />
        {!fromClient && <><Line x1={560} y1={118} x2={382} y2={118} c={m.c} w={3} flow /><Line x1={338} y1={118} x2={104} y2={118} c={m.c} w={3} flow /></>}
        <T x={360} y={58} size={13} weight={700} color={m.c}>{m.n}</T>
        <T x={360} y={178} size={11} m color="var(--text-2)">{'src ' + m.src}</T>
        <T x={360} y={196} size={11} m color="var(--text-2)">{'dst ' + m.dst}</T>
        <T x={360} y={216} size={10.5} color="var(--muted)">{m.mac}</T>
      </svg>
      <div style={note(m.c)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>{n + 1}. {m.n}.</b> {m.d}</div>
      </div>
    </div>
  );
}

/* 2) Cronologia unui lease */
export function LeaseTimeline() {
  return (
    <svg viewBox="0 0 740 190" role="img" aria-label="Cronologia unui lease DHCP: la 50% clientul încearcă reînnoirea (renew) la serverul inițial, la 87,5% încearcă rebind la orice server, la 100% lease-ul expiră">
      <T x={370} y={20} size={13} weight={700}>Cronologia unui lease (exemplu: lease de 8 zile)</T>
      <Line x1={40} y1={90} x2={700} y2={90} c="var(--border)" w={6} />
      <Line x1={40} y1={90} x2={370} y2={90} c="var(--ok)" w={6} />
      <Line x1={370} y1={90} x2={618} y2={90} c="var(--warn)" w={6} />
      <Line x1={618} y1={90} x2={700} y2={90} c="var(--bad)" w={6} />
      {[40, 370, 618, 700].map((x) => <circle key={x} cx={x} cy={90} r={7} fill="var(--surface-3)" stroke="var(--text-2)" strokeWidth={2} />)}
      <T x={40} y={120} size={11.5} weight={700}>0%</T><T x={40} y={138} size={10.5} color="var(--muted)">Ack primit</T>
      <T x={370} y={120} size={11.5} weight={700}>T1 = 50%</T><T x={370} y={138} size={10.5} color="var(--muted)">RENEW — unicast spre server</T>
      <T x={618} y={120} size={11.5} weight={700}>T2 = 87,5%</T><T x={618} y={138} size={10.5} color="var(--muted)">REBIND — broadcast, orice server</T>
      <T x={700} y={120} size={11.5} weight={700}>100%</T><T x={700} y={138} size={10.5} color="var(--muted)">expiră</T>
      <T x={205} y={72} size={11} color="var(--ok)" weight={650}>folosește adresa</T>
      <T x={494} y={72} size={11} color="var(--warn)" weight={650}>încearcă să reînnoiască</T>
      <T x={659} y={72} size={10.5} color="var(--bad)" weight={650}>ultima șansă</T>
      <T x={370} y={174} size={10.5} color="var(--muted)">Reînnoirea reușită repornește ceasul; la expirare, clientul renunță la adresă și reia procesul DORA.</T>
    </svg>
  );
}

/* 3) Rezoluția DNS */
const DNS = [
  { t: '1. Aplicația cere un nume', d: 'Browserul vrea www.exemplu.ro. Resolver-ul local (stub) verifică întâi cache-ul și fișierul hosts; dacă nu găsește nimic, întreabă serverul DNS configurat (primit de obicei prin DHCP), cu o interogare UDP 53.' },
  { t: '2. Serverul recursiv întreabă rădăcina', d: 'Serverul DNS recursiv (al ISP-ului sau al firmei) nu are răspunsul în cache. Întreabă un server rădăcină (root), care nu știe adresa, dar îl trimite către serverele TLD pentru .ro.' },
  { t: '3. Serverul TLD', d: 'Serverul pentru .ro nu știe adresa lui www.exemplu.ro, dar știe care sunt serverele autoritative pentru exemplu.ro și le indică.' },
  { t: '4. Serverul autoritativ', d: 'Serverul autoritativ pentru exemplu.ro deține zona și răspunde cu înregistrarea A: www.exemplu.ro = 203.0.113.50 (cu un TTL, de exemplu 3600 s).' },
  { t: '5. Răspunsul ajunge la client', d: 'Serverul recursiv pune răspunsul în cache pentru TTL secunde și îl trimite clientului. Clientul îl stochează și el în cache, apoi browserul deschide conexiunea către 203.0.113.50. Următoarea cerere pentru același nume e rezolvată din cache.' },
];
export function DnsResolution() {
  const [n, setN] = useState(0);
  return (
    <div>
      <Seg value={String(n)} set={(k) => setN(Number(k))} label="Pasul rezoluției" items={DNS.map((_x, i) => [String(i), String(i + 1)] as [string, string])} />
      <svg viewBox="0 0 720 270" role="img" aria-label="Rezoluția DNS: clientul, serverul recursiv, serverul rădăcină, serverul TLD și serverul autoritativ">
        <ClientIcon x={60} y={135} kind="pc" label="Client" />
        <Box x={180} y={110} w={130} h={50} label="DNS recursiv" sub="cache" c="var(--accent)" />
        <g opacity={n >= 1 ? 1 : 0.35}><Box x={420} y={20} w={130} h={44} label="Root" sub="." c="var(--info)" /></g>
        <g opacity={n >= 2 ? 1 : 0.35}><Box x={420} y={110} w={130} h={44} label="TLD" sub=".ro" c="var(--violet)" /></g>
        <g opacity={n >= 3 ? 1 : 0.35}><Box x={420} y={200} w={130} h={44} label="Autoritativ" sub="exemplu.ro" c="var(--ok)" /></g>
        <Line x1={84} y1={135} x2={180} y2={135} c="var(--accent)" w={n === 0 || n === 4 ? 3 : 1.5} />
        <Line x1={310} y1={125} x2={420} y2={45} c="var(--info)" w={n === 1 ? 3 : 1.5} dash={n < 1 ? '4 4' : undefined} />
        <Line x1={310} y1={135} x2={420} y2={132} c="var(--violet)" w={n === 2 ? 3 : 1.5} dash={n < 2 ? '4 4' : undefined} />
        <Line x1={310} y1={145} x2={420} y2={220} c="var(--ok)" w={n === 3 ? 3 : 1.5} dash={n < 3 ? '4 4' : undefined} />
        {n === 4 && <T x={620} y={135} size={12} weight={700} color="var(--ok)" anchor="middle">A 203.0.113.50</T>}
        <T x={620} y={155} size={10.5} color="var(--muted)" anchor="middle">{n === 4 ? 'răspuns + TTL' : ''}</T>
        <T x={640} y={60} size={10.5} color="var(--muted)" anchor="middle">„întreabă .ro”</T>
        <T x={640} y={118} size={10.5} color="var(--muted)" anchor="middle">„întreabă exemplu.ro”</T>
        <T x={640} y={220} size={10.5} color="var(--muted)" anchor="middle">„iată înregistrarea”</T>
      </svg>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>{DNS[n].t}.</b> {DNS[n].d}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Simplificat: în practică, serverul recursiv are în cache adresele serverelor rădăcină și adesea ale TLD-urilor, deci sare peste pașii 2–3 pentru nume populare.</div>
      </div>
    </div>
  );
}

/* 4) Tipuri de înregistrări DNS */
export function DnsRecords() {
  const rows: [string, string, string][] = [
    ['A', 'nume → IPv4', 'www.exemplu.ro → 203.0.113.50'],
    ['AAAA', 'nume → IPv6', 'www.exemplu.ro → 2001:db8::50'],
    ['CNAME', 'alias → alt nume', 'web.exemplu.ro → www.exemplu.ro'],
    ['MX', 'serverul de e-mail al domeniului', 'exemplu.ro → mail.exemplu.ro (prioritate 10)'],
    ['NS', 'serverele autoritative ale zonei', 'exemplu.ro → ns1.exemplu.ro'],
    ['PTR', 'IP → nume (rezolvare inversă)', '50.113.0.203.in-addr.arpa → www.exemplu.ro'],
    ['SOA', 'începutul autorității zonei (serial, timere)', 'parametrii zonei exemplu.ro'],
  ];
  return (
    <div className="table-wrap">
      <table className="t">
        <thead><tr><th>Tip</th><th>Face</th><th>Exemplu</th></tr></thead>
        <tbody>{rows.map(([a, b, c]) => <tr key={a}><td><code>{a}</code></td><td>{b}</td><td>{c}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label={solo ? 'Topologie lab solo: router DHCP cu două PC-uri' : 'Topologie lab ghidat: R1 ca server DHCP și DNS, SW1, PC1, PC2 și server web'}>
      <RouterIcon x={380} y={50} label="R1" sub={solo ? 'DHCP pool OFFICE' : 'DHCP + DNS · 192.168.1.1'} />
      <SwitchIcon x={380} y={130} label="SW1" />
      <ClientIcon x={170} y={185} kind="pc" label="PC1 (DHCP)" />
      <ClientIcon x={380} y={195} kind="pc" label="PC2 (DHCP)" />
      <Box x={540} y={160} w={170} h={46} label={solo ? 'PC3 (static)' : 'Server web'} sub={solo ? '192.168.20.5' : '192.168.1.10 (static)'} c="var(--info)" />
      <Line x1={380} y1={72} x2={380} y2={110} /><Line x1={360} y1={140} x2={190} y2={178} /><Line x1={380} y1={150} x2={380} y2={176} /><Line x1={402} y1={140} x2={540} y2={178} />
      <T x={380} y={224} size={10.5} color="var(--muted)">{solo ? 'LAN 192.168.20.0/24 · R1 = .1 · excluse .1–.10' : 'LAN 192.168.1.0/24 · adrese .1–.10 excluse din pool'}</T>
    </svg>
  );
}
export const LabGuidedTopology43 = () => <Topo solo={false} />;
export const LabSoloTopology43 = () => <Topo solo />;
