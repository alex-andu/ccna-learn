import { useEffect, useState, type ReactNode } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';

/* Diagrame originale pentru 1.5 Compare TCP to UDP. Culori DOAR prin var(--...). */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);

export function ServerIcon({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) {
  return (
    <g>
      <rect x={x - 14} y={y - 20} width={28} height={40} rx={3} fill="var(--surface-3)" stroke="var(--text-2)" strokeWidth={1.4} />
      <path d={`M${x - 9} ${y - 11} h18 M${x - 9} ${y - 4} h18 M${x - 9} ${y + 3} h18`} stroke="var(--text-2)" strokeWidth={1.3} />
      <circle cx={x + 6} cy={y + 12} r={2} fill="var(--accent)" />
      {label && <T x={x} y={y + 36} weight={650}>{label}</T>}
      {sub && <T x={x} y={y + 50} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}

function Controls({ step, max, setStep, play, setPlay }: { step: number; max: number; setStep: (n: number) => void; play?: boolean; setPlay?: (b: boolean) => void }) {
  return (
    <div className="controls">
      <button className="btn sm" onClick={() => { setPlay?.(false); setStep(Math.max(0, step - 1)); }} disabled={step === 0}>← Înapoi</button>
      <button className="btn sm primary" onClick={() => { setPlay?.(false); setStep(Math.min(max, step + 1)); }} disabled={step >= max}>Pasul următor →</button>
      {setPlay && <button className="btn sm" onClick={() => { setStep(0); setPlay(true); }} disabled={play}>▶ Redă</button>}
      <button className="btn sm ghost" onClick={() => { setPlay?.(false); setStep(0); }}>Reset</button>
      <span className="small muted">Pas {step}/{max}</span>
    </div>
  );
}

function useAutoplay(play: boolean, setPlay: (b: boolean) => void, setStep: (f: (s: number) => number) => void, max: number, ms = 1500) {
  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setStep((s) => { if (s >= max) { setPlay(false); return s; } return s + 1; }), ms);
    return () => clearInterval(t);
  }, [play, max, ms, setPlay, setStep]);
}

/* ---------------------------------------------------------------
   OSI ↔ TCP/IP — click pe un nivel
---------------------------------------------------------------- */
const LAYERS = [
  { n: 7, name: 'Application', pdu: 'date', role: 'Interfața cu aplicațiile: definește protocoalele pe care le „vorbesc” programele (browser, client de e-mail, SSH).', ex: 'HTTP, HTTPS, DNS, DHCP, SSH, FTP, SMTP, SNMP', dev: 'servere, PC-uri, firewall-uri NGFW (inspecție la nivel de aplicație)' },
  { n: 6, name: 'Presentation', pdu: 'date', role: 'Formatul datelor: codare (ASCII, UTF-8), compresie, criptare. În TCP/IP este inclus în Application.', ex: 'TLS (parțial), JPEG, MPEG, ASCII', dev: '—' },
  { n: 5, name: 'Session', pdu: 'date', role: 'Deschide, menține și închide „dialogul” dintre aplicații. În TCP/IP este inclus în Application.', ex: 'NetBIOS, RPC (rar întâlnit la CCNA)', dev: '—' },
  { n: 4, name: 'Transport', pdu: 'segment (TCP) / datagramă (UDP)', role: 'Comunicație proces-la-proces: porturi (multiplexare), segmentare și, în TCP, fiabilitate (ACK, retransmisie), ordine și flow control. Subiectul topicului 1.5.', ex: 'TCP, UDP (și QUIC, construit peste UDP)', dev: 'endpoint-uri; firewall-urile stateful și NAT/PAT „citesc” porturile' },
  { n: 3, name: 'Network', pdu: 'pachet', role: 'Adresare logică (IP) și rutare între rețele, de la sursă la destinația finală, peste mai multe hop-uri.', ex: 'IPv4, IPv6, ICMP, OSPF', dev: 'routere, switch-uri L3' },
  { n: 2, name: 'Data Link', pdu: 'cadru (frame)', role: 'Livrare pe același segment de rețea (hop-to-hop), cu adrese MAC; detectează erorile cu FCS.', ex: 'Ethernet (802.3), 802.11, PPP', dev: 'switch-uri L2, AP-uri, plăci de rețea' },
  { n: 1, name: 'Physical', pdu: 'biți', role: 'Semnalul propriu-zis: tensiuni pe cupru, lumină în fibră, unde radio; conectori, pini, viteze.', ex: 'UTP, fibră, RJ-45, 1000BASE-T', dev: 'cabluri, hub-uri, repetoare, transceivere' },
];
export function OsiStack() {
  const [sel, setSel] = useState(4);
  const L = LAYERS.find((l) => l.n === sel)!;
  const y = (n: number) => 22 + (7 - n) * 46;
  const tcpip = [
    { name: 'Application', from: 7, to: 5 }, { name: 'Transport', from: 4, to: 4 }, { name: 'Network (Internet)', from: 3, to: 3 },
    { name: 'Data Link', from: 2, to: 2 }, { name: 'Physical', from: 1, to: 1 },
  ];
  const on = (a: number, b: number) => sel <= a && sel >= b;
  return (
    <>
      <svg viewBox="0 0 720 360" role="img" aria-label="Modelul OSI comparat cu modelul TCP/IP">
        <T x={160} y={14} size={11} weight={650} color="var(--muted)">OSI (7 niveluri)</T>
        <T x={560} y={14} size={11} weight={650} color="var(--muted)">TCP/IP (5 niveluri, ca în materialele CCNA)</T>
        {LAYERS.map((l) => (
          <g key={l.n} onClick={() => setSel(l.n)} style={{ cursor: 'pointer' }}>
            <rect x={30} y={y(l.n)} width={260} height={40} rx={8} fill={sel === l.n ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={sel === l.n ? 'var(--accent)' : 'var(--border)'} strokeWidth={sel === l.n ? 2 : 1} />
            <T x={52} y={y(l.n) + 25} anchor="start" weight={700} color={l.n === 4 ? 'var(--accent)' : 'var(--text-2)'}>{`L${l.n}`}</T>
            <T x={84} y={y(l.n) + 25} anchor="start" weight={600}>{l.name}</T>
          </g>
        ))}
        {tcpip.map((t) => (
          <g key={t.name} onClick={() => setSel(t.to === 5 ? 7 : t.from)} style={{ cursor: 'pointer' }}>
            <rect x={430} y={y(t.from)} width={260} height={(t.from - t.to + 1) * 46 - 6} rx={8} fill={on(t.from, t.to) ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={on(t.from, t.to) ? 'var(--accent)' : 'var(--border)'} strokeWidth={on(t.from, t.to) ? 2 : 1} />
            <T x={560} y={y(t.from) + ((t.from - t.to + 1) * 46 - 6) / 2 + 5} weight={600}>{t.name}</T>
          </g>
        ))}
        {LAYERS.filter((l) => l.n <= 4 || l.n === 6).map((l) => (
          <T key={l.n} x={360} y={l.n === 6 ? y(6) + 25 : y(l.n) + 25} size={10.5} color={sel === l.n || (l.n === 6 && sel >= 5) ? 'var(--accent)' : 'var(--muted)'} weight={600}>
            {l.n === 6 ? 'date' : l.n === 4 ? 'segment' : l.pdu}
          </T>
        ))}
        <T x={360} y={352} size={10.5} color="var(--muted)">Coloana din mijloc: numele PDU-ului. În RFC 1122, Data Link + Physical formează un singur nivel „Link” (modelul cu 4 niveluri).</T>
      </svg>
      <div className="callout tip" style={{ marginTop: 8 }}>
        <div><b>L{L.n} — {L.name}</b> · PDU: <b>{L.pdu}</b>
          <div className="small">{L.role}</div>
          <div className="small"><b>Exemple:</b> {L.ex}</div>
          <div className="small"><b>Dispozitive tipice:</b> {L.dev}</div></div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   Încapsulare pas cu pas (TCP sau UDP)
---------------------------------------------------------------- */
export function Encapsulation() {
  const [step, setStep] = useState(0);
  const [proto, setProto] = useState<'tcp' | 'udp'>('tcp');
  const [play, setPlay] = useState(false);
  useAutoplay(play, setPlay, setStep, 4, 1400);
  const l4 = proto === 'tcp' ? 20 : 8;
  const data = 1500 - 20 - l4; // ca pachetul IP să aibă exact 1500 B (MTU Ethernet)
  const rows = [
    { lvl: 'L7 Application', name: 'date', size: data },
    { lvl: `L4 Transport`, name: proto === 'tcp' ? 'segment TCP' : 'datagramă UDP', size: data + l4 },
    { lvl: 'L3 Network', name: 'pachet IPv4', size: data + l4 + 20 },
    { lvl: 'L2 Data Link', name: 'cadru Ethernet', size: data + l4 + 20 + 18 },
    { lvl: 'L1 Physical', name: 'biți pe fir', size: data + l4 + 20 + 18 },
  ];
  const DX = 410, DW = 220, HW = 74;
  const desc = [
    `Aplicația (de exemplu browserul) are ${data} de octeți de trimis. Îi predă nivelului Transport împreună cu portul destinație (de exemplu 80).`,
    proto === 'tcp' ? `TCP adaugă un header de minimum 20 B: porturi, sequence/ack number, flags, window, checksum. Rezultatul se numește segment.` : 'UDP adaugă un header fix de doar 8 B: porturi, length, checksum. Rezultatul se numește datagramă (Cisco spune adesea tot „segment”).',
    'IP adaugă un header de 20 B (fără opțiuni) cu adresele IP sursă și destinație și TTL-ul. Câmpul Protocol spune ce urmează: 6 = TCP, 17 = UDP. Pachetul are exact 1500 B = MTU-ul Ethernet.',
    'Ethernet adaugă header-ul (14 B: MAC destinație, MAC sursă, EtherType 0x0800 = IPv4) și trailer-ul FCS (4 B) pentru detectarea erorilor. Cadrul are 1518 B.',
    'Placa de rețea transformă cadrul în semnal (biți), precedat de preambul + SFD (8 B). La receptor, fiecare nivel scoate header-ul „lui” și predă restul nivelului de deasupra: decapsulare.',
  ];
  return (
    <>
      <div className="segmented" role="group" aria-label="Protocol de transport" style={{ marginBottom: 12 }}>
        <button className={proto === 'tcp' ? 'on' : ''} onClick={() => setProto('tcp')}>TCP</button>
        <button className={proto === 'udp' ? 'on' : ''} onClick={() => setProto('udp')}>UDP</button>
      </div>
      <svg viewBox="0 0 720 290" role="img" aria-label="Încapsularea datelor de la nivelul aplicație la biți">
        {rows.map((r, i) => {
          const yy = 16 + i * 54; const vis = i <= step;
          return (
            <g key={i} opacity={vis ? 1 : 0.1} style={{ transition: 'opacity .35s' }} className={vis && i === step ? 'fade-up' : undefined}>
              <T x={8} y={yy + 24} anchor="start" size={11.5} weight={650} color={i === step ? 'var(--accent)' : 'var(--text-2)'}>{r.lvl}</T>
              {i < 4 ? (
                <>
                  {i >= 3 && <><rect x={DX - 3 * HW} y={yy} width={HW - 3} height={36} rx={5} fill="var(--info-soft)" stroke="var(--info)" /><T x={DX - 2.5 * HW} y={yy + 16} size={10.5} weight={650}>Eth hdr</T><T x={DX - 2.5 * HW} y={yy + 30} size={10} color="var(--muted)">14 B</T></>}
                  {i >= 2 && <><rect x={DX - 2 * HW} y={yy} width={HW - 3} height={36} rx={5} fill="var(--violet)" fillOpacity={0.14} stroke="var(--violet)" /><T x={DX - 1.5 * HW} y={yy + 16} size={10.5} weight={650}>IP hdr</T><T x={DX - 1.5 * HW} y={yy + 30} size={10} color="var(--muted)">20 B</T></>}
                  {i >= 1 && <><rect x={DX - HW} y={yy} width={HW - 3} height={36} rx={5} fill="var(--accent-soft)" stroke="var(--accent)" /><T x={DX - 0.5 * HW} y={yy + 16} size={10.5} weight={650}>{proto.toUpperCase()} hdr</T><T x={DX - 0.5 * HW} y={yy + 30} size={10} color="var(--muted)">{l4} B</T></>}
                  <rect x={DX} y={yy} width={DW} height={36} rx={5} fill="var(--surface-3)" stroke="var(--border-strong)" />
                  <T x={DX + DW / 2} y={yy + 16} size={11} weight={650}>Date aplicație</T><T x={DX + DW / 2} y={yy + 30} size={10} color="var(--muted)">{data} B</T>
                  {i >= 3 && <><rect x={DX + DW + 3} y={yy} width={50} height={36} rx={5} fill="var(--info-soft)" stroke="var(--info)" /><T x={DX + DW + 28} y={yy + 16} size={10.5} weight={650}>FCS</T><T x={DX + DW + 28} y={yy + 30} size={10} color="var(--muted)">4 B</T></>}
                </>
              ) : (
                <T x={DX - 3 * HW} y={yy + 24} anchor="start" size={13} m color="var(--accent)">1010101…10101011 0110100010010011101001011101…</T>
              )}
              <T x={712} y={yy + 50} anchor="end" size={10.5} color="var(--muted)">{i < 4 ? `${r.name}: ${r.size} B` : r.name}</T>
            </g>
          );
        })}
      </svg>
      <div className="callout tip" style={{ marginTop: 8, minHeight: 64 }}>
        <div><b>{rows[step].lvl} — {rows[step].name}</b><div className="small">{desc[step]}</div></div>
      </div>
      <Controls step={step} max={4} setStep={setStep} play={play} setPlay={setPlay} />
    </>
  );
}

/* ---------------------------------------------------------------
   Porturi și socket-uri — click pe o conexiune
---------------------------------------------------------------- */
const CONNS = [
  { app: 'Browser — tab 1', proto: 'TCP', sport: 51000, dip: '203.0.113.10', dport: 443, svc: 'HTTPS', y: 60 },
  { app: 'Browser — tab 2', proto: 'TCP', sport: 51001, dip: '203.0.113.10', dport: 443, svc: 'HTTPS', y: 110 },
  { app: 'nslookup', proto: 'UDP', sport: 50555, dip: '192.168.1.1', dport: 53, svc: 'DNS', y: 170 },
  { app: 'PuTTY', proto: 'TCP', sport: 51002, dip: '10.0.0.1', dport: 22, svc: 'SSH', y: 230 },
];
export function PortsSockets() {
  const [sel, setSel] = useState(0);
  const c = CONNS[sel];
  const srvY: Record<string, number> = { '203.0.113.10': 85, '192.168.1.1': 175, '10.0.0.1': 245 };
  return (
    <>
      <svg viewBox="0 0 720 290" role="img" aria-label="Un PC cu mai multe conexiuni, fiecare identificată de porturi">
        <rect x={10} y={30} width={230} height={230} rx={12} fill="var(--surface-2)" stroke="var(--border)" />
        <T x={125} y={22} weight={650}>PC 192.168.1.10</T>
        {CONNS.map((k, i) => (
          <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
            <rect x={22} y={k.y - 16} width={136} height={32} rx={7} fill={sel === i ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={sel === i ? 'var(--accent)' : 'var(--border)'} />
            <T x={90} y={k.y + 4} size={11.5} weight={600}>{k.app}</T>
            <rect x={162} y={k.y - 12} width={70} height={24} rx={5} fill="var(--code-bg)" stroke={sel === i ? 'var(--accent)' : 'var(--border)'} />
            <T x={197} y={k.y + 4} size={11} m color={k.proto === 'UDP' ? 'var(--warn)' : 'var(--accent)'}>{`:${k.sport}`}</T>
            <line x1={234} y1={k.y} x2={520} y2={srvY[k.dip]} stroke={sel === i ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth={sel === i ? 2.4 : 1.4} className={sel === i ? 'flow' : undefined} />
            <rect x={300 + i * 14} y={(k.y + srvY[k.dip]) / 2 - 22 + (i === 1 ? 10 : 0)} width={40} height={16} rx={4} fill="var(--surface)" />
            <T x={320 + i * 14} y={(k.y + srvY[k.dip]) / 2 - 10 + (i === 1 ? 10 : 0)} size={10} weight={650} color={k.proto === 'UDP' ? 'var(--warn)' : 'var(--accent)'}>{k.proto}</T>
          </g>
        ))}
        <ServerIcon x={560} y={80} />
        <T x={590} y={70} anchor="start" size={11} weight={650}>Web 203.0.113.10</T><T x={590} y={86} anchor="start" size={10.5} m color="var(--muted)">TCP :443 (LISTEN)</T>
        <ServerIcon x={560} y={175} />
        <T x={590} y={170} anchor="start" size={11} weight={650}>DNS 192.168.1.1</T><T x={590} y={186} anchor="start" size={10.5} m color="var(--muted)">UDP :53</T>
        <RouterIcon x={560} y={250} />
        <T x={596} y={246} anchor="start" size={11} weight={650}>R1 10.0.0.1</T><T x={596} y={262} anchor="start" size={10.5} m color="var(--muted)">TCP :22 (SSH)</T>
        <T x={125} y={282} size={10.5} color="var(--muted)">porturi sursă efemere (alese de OS)</T>
        <T x={600} y={284} size={10.5} color="var(--muted)">porturi destinație well-known</T>
      </svg>
      <div className="table-wrap"><table className="t">
        <thead><tr><th>Protocol</th><th>IP sursă</th><th>Port sursă</th><th>IP destinație</th><th>Port destinație</th></tr></thead>
        <tbody><tr><td className="hl">{c.proto}</td><td>192.168.1.10</td><td className="hl">{c.sport}</td><td>{c.dip}</td><td>{c.dport} ({c.svc})</td></tr></tbody>
      </table></div>
      <p className="small muted" style={{ marginTop: 6 }}>Cele 5 valori de mai sus (5-tuple) identifică unic conexiunea. Socket client = <code>192.168.1.10:{c.sport}</code>, socket server = <code>{c.dip}:{c.dport}</code>. Compară tab 1 cu tab 2: diferă <b>doar portul sursă</b> — de aceea serverul nu le încurcă.</p>
    </>
  );
}

/* ---------------------------------------------------------------
   Header TCP / UDP — click pe câmp
---------------------------------------------------------------- */
type Field = { r: number; b: number; n: number; label: string; name: string; desc: string; dashed?: boolean };
const TCP_F: Field[] = [
  { r: 0, b: 0, n: 16, label: 'Source Port', name: 'Source Port (16 biți)', desc: 'Portul aplicației care trimite. La client este de obicei un port efemer (de exemplu 51000), ales de sistemul de operare.' },
  { r: 0, b: 16, n: 16, label: 'Destination Port', name: 'Destination Port (16 biți)', desc: 'Portul aplicației destinație — pentru o cerere spre server, portul well-known al serviciului (80 HTTP, 443 HTTPS, 22 SSH…). 16 biți → 0–65535.' },
  { r: 1, b: 0, n: 32, label: 'Sequence Number', name: 'Sequence Number (32 biți)', desc: 'Numărul primului octet de date din acest segment. În SYN conține ISN-ul (Initial Sequence Number, ales aleatoriu); primul octet de date va fi ISN+1.' },
  { r: 2, b: 0, n: 32, label: 'Acknowledgment Number', name: 'Acknowledgment Number (32 biți)', desc: 'Valid doar când flag-ul ACK e setat. Înseamnă „următorul octet pe care îl aștept de la tine” — confirmă cumulativ tot ce era înainte.' },
  { r: 3, b: 0, n: 4, label: 'Offset', name: 'Data Offset (4 biți)', desc: 'Lungimea header-ului în cuvinte de 32 de biți (4 octeți). Minimum 5 → 20 B, maximum 15 → 60 B. Spune unde încep datele.' },
  { r: 3, b: 4, n: 4, label: 'Rsv', name: 'Reserved (4 biți)', desc: 'Rezervat pentru utilizări viitoare; trebuie să fie 0.' },
  { r: 3, b: 8, n: 8, label: 'Flags', name: 'Control bits / Flags (8 × 1 bit)', desc: 'CWR, ECE (ECN — semnalizarea congestiei), URG, ACK (câmpul Acknowledgment e valid), PSH (predă imediat aplicației), RST (resetează brusc conexiunea), SYN (sincronizează numerele de secvență — deschidere), FIN (nu mai am date — închidere).' },
  { r: 3, b: 16, n: 16, label: 'Window', name: 'Window (16 biți)', desc: 'Câți octeți mai poate primi receptorul (receive window) — baza flow control-ului. Maximum 65.535 B; cu opțiunea Window Scale (RFC 7323) poate ajunge la ≈1 GiB.' },
  { r: 4, b: 0, n: 16, label: 'Checksum', name: 'Checksum (16 biți)', desc: 'Obligatoriu în TCP. Acoperă header-ul, datele și un pseudo-header cu adresele IP. Detectează coruperea; segmentul corupt e aruncat și apoi retransmis (pentru că nu primește ACK).' },
  { r: 4, b: 16, n: 16, label: 'Urgent Pointer', name: 'Urgent Pointer (16 biți)', desc: 'Folosit doar cu flag-ul URG (aproape niciodată în practică).' },
  { r: 5, b: 0, n: 32, label: 'Options (0–40 B) — de ex. MSS, Window Scale, SACK, Timestamps', name: 'Options (0–40 octeți)', desc: 'Opționale, de lungime variabilă. Cea mai importantă: MSS (doar în SYN) — „nu-mi trimite mai mult de X octeți de date într-un segment”. Header-ul total: 20–60 B.', dashed: true },
  { r: 6, b: 0, n: 32, label: 'Date (payload) — de la aplicație', name: 'Date', desc: 'Datele aplicației (de exemplu o bucată dintr-o pagină web). Pot lipsi: SYN, ACK-urile simple și FIN nu au date.', dashed: true },
];
const UDP_F: Field[] = [
  { r: 0, b: 0, n: 16, label: 'Source Port', name: 'Source Port (16 biți)', desc: 'Portul expeditorului. Opțional în teorie (0 = nefolosit), dar aproape întotdeauna completat ca să poată veni un răspuns.' },
  { r: 0, b: 16, n: 16, label: 'Destination Port', name: 'Destination Port (16 biți)', desc: 'Portul aplicației destinație: 53 DNS, 67/68 DHCP, 69 TFTP, 123 NTP, 161 SNMP, 514 Syslog…' },
  { r: 1, b: 0, n: 16, label: 'Length', name: 'Length (16 biți)', desc: 'Lungimea totală a datagramei (header + date), în octeți. Minimum 8 (doar header-ul).' },
  { r: 1, b: 16, n: 16, label: 'Checksum', name: 'Checksum (16 biți)', desc: 'Detectează erorile (UDP ARE checksum!). În IPv4 este opțional (0 = necalculat); în IPv6 este obligatoriu. Nu există recuperare: o datagramă coruptă e pur și simplu aruncată.' },
  { r: 2, b: 0, n: 32, label: 'Date (payload) — de la aplicație', name: 'Date', desc: 'Datele aplicației, de exemplu o întrebare DNS sau un pachet de voce RTP.', dashed: true },
];
export function SegmentHeader({ initial = 'tcp' }: { initial?: 'tcp' | 'udp' }) {
  const [proto, setProto] = useState<'tcp' | 'udp'>(initial);
  const [sel, setSel] = useState(0);
  const F = proto === 'tcp' ? TCP_F : UDP_F;
  const f = F[Math.min(sel, F.length - 1)];
  const X0 = 70, W = 560, BW = W / 32, RH = 40, Y0 = 34;
  const rowsHdr = proto === 'tcp' ? 5 : 2;
  const H = Y0 + (F[F.length - 1].r + 1) * RH + 20;
  return (
    <>
      <div className="segmented" role="group" aria-label="Header" style={{ marginBottom: 12 }}>
        <button className={proto === 'tcp' ? 'on' : ''} onClick={() => { setProto('tcp'); setSel(0); }}>Header TCP (20–60 B)</button>
        <button className={proto === 'udp' ? 'on' : ''} onClick={() => { setProto('udp'); setSel(0); }}>Header UDP (8 B)</button>
      </div>
      <svg viewBox={`0 0 720 ${H}`} role="img" aria-label={`Structura header-ului ${proto.toUpperCase()}`}>
        {[0, 8, 16, 24, 31].map((b) => <T key={b} x={X0 + b * BW + (b === 31 ? BW / 2 : 0)} y={22} size={10} color="var(--muted)" m>{b}</T>)}
        <T x={X0 + W / 2} y={10} size={10} color="var(--muted)">biți (un rând = 32 de biți = 4 octeți)</T>
        {F.map((fl, i) => {
          const x = X0 + fl.b * BW, y = Y0 + fl.r * RH, w = fl.n * BW;
          const on = i === sel;
          return (
            <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              <rect x={x + 1} y={y + 1} width={w - 2} height={RH - 2} rx={4} fill={on ? 'var(--accent-soft)' : fl.dashed ? 'var(--surface-2)' : 'var(--surface-3)'} stroke={on ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth={on ? 2 : 1} strokeDasharray={fl.dashed ? '5 4' : undefined} />
              <T x={x + w / 2} y={y + RH / 2 + 4} size={fl.n <= 4 ? 10.5 : 12} weight={600} color={on ? 'var(--accent)' : 'var(--text)'}>{fl.label}</T>
            </g>
          );
        })}
        <path d={`M${X0 + W + 10} ${Y0 + 2} h8 v${rowsHdr * RH - 4} h-8`} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
        <T x={X0 + W + 24} y={Y0 + (rowsHdr * RH) / 2 + 4} anchor="start" size={11} weight={700} color="var(--accent)">{proto === 'tcp' ? '20 B' : '8 B'}</T>
        {proto === 'tcp' && <T x={X0 + W + 24} y={Y0 + 5 * RH + 24} anchor="start" size={10.5} color="var(--muted)">+0–40 B</T>}
      </svg>
      <div className="callout tip" style={{ marginTop: 8, minHeight: 64 }}>
        <div><b>{f.name}</b><div className="small">{f.desc}</div></div>
      </div>
      <p className="small muted" style={{ marginTop: 4 }}>Atinge un câmp pentru explicație.</p>
    </>
  );
}

/* ---------------------------------------------------------------
   Diagrama „scară” TCP: deschidere, transfer, pierdere, închidere
---------------------------------------------------------------- */
type LStep = { dir?: 'cs' | 'sc'; label?: string; lost?: boolean; note?: string; cs: string; ss: string; t: string; d: string; hl?: boolean };
const SCEN: Record<'open' | 'data' | 'loss' | 'close', { title: string; start: [string, string]; steps: LStep[] }> = {
  open: {
    title: '3-way handshake', start: ['CLOSED', 'LISTEN'],
    steps: [
      { dir: 'cs', label: 'SYN  seq=1000', cs: 'SYN-SENT', ss: 'SYN-RECEIVED', t: '1. SYN', d: 'Clientul cere conexiunea: flag-ul SYN setat și propriul număr inițial de secvență (ISN = 1000; în realitate e un număr aleatoriu pe 32 de biți). Nu conține date. Tot aici își anunță MSS-ul (de exemplu 1460) și window-ul.' },
      { dir: 'sc', label: 'SYN+ACK  seq=5000 ack=1001', cs: 'ESTABLISHED', ss: 'SYN-RECEIVED', t: '2. SYN-ACK', d: 'Serverul face două lucruri într-un singur segment: confirmă SYN-ul clientului (ack = 1000 + 1 = 1001 — SYN „consumă” un număr de secvență) și își trimite propriul SYN cu ISN = 5000.' },
      { dir: 'cs', label: 'ACK  seq=1001 ack=5001', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '3. ACK', d: 'Clientul confirmă SYN-ul serverului: ack = 5000 + 1 = 5001. Conexiunea e deschisă în ambele direcții (full-duplex). Din acest moment se pot trimite date; adesea, acest ACK poartă deja prima cerere (de exemplu HTTP GET).', hl: true },
    ],
  },
  data: {
    title: 'Transfer de date (seq/ack)', start: ['ESTABLISHED', 'ESTABLISHED'],
    steps: [
      { dir: 'cs', label: 'seq=1001 len=1460', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '1. Primul segment cu date', d: 'Clientul trimite 1460 de octeți (un MSS pe Ethernet). Octeții sunt numerotați 1001 … 2460.' },
      { dir: 'sc', label: 'ACK  ack=2461', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '2. ACK = următorul octet așteptat', d: 'Serverul confirmă: „am primit tot până la 2460, aștept 2461”. Regula: ack = seq + len (1001 + 1460 = 2461).', hl: true },
      { dir: 'cs', label: 'seq=2461 len=1000', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '3. Al doilea segment', d: 'Clientul nu așteaptă confirmarea pentru fiecare segment: cât îi permite window-ul, trimite mai departe.' },
      { dir: 'cs', label: 'seq=3461 len=1000', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '4. Al treilea segment, imediat după', d: 'seq = 2461 + 1000 = 3461. Două segmente sunt acum „în zbor” (trimise, dar neconfirmate).' },
      { dir: 'sc', label: 'ACK  ack=4461', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '5. ACK cumulativ', d: 'Un singur ACK (4461 = 3461 + 1000) confirmă ambele segmente. ACK-ul TCP este cumulativ: „tot ce e înainte de 4461 a ajuns”.', hl: true },
      { dir: 'sc', label: 'seq=5001 len=500  ack=4461', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '6. Serverul trimite și el date', d: 'TCP este full-duplex: fiecare direcție are propria numerotare. Serverul trimite 500 B, începând de la 5001 (ISN-ul lui + 1), și confirmă în același segment (ack=4461) — piggybacking.' },
      { dir: 'cs', label: 'ACK  seq=4461 ack=5501', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '7. Clientul confirmă', d: 'ack = 5001 + 500 = 5501. Observă că seq-ul clientului nu a crescut: un ACK fără date nu consumă numere de secvență.' },
    ],
  },
  loss: {
    title: 'Pierdere + fast retransmit', start: ['ESTABLISHED', 'ESTABLISHED'],
    steps: [
      { dir: 'cs', label: 'seq=4461 len=1000', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '1. Segment livrat', d: 'Continuăm de unde am rămas: clientul trimite octeții 4461–5460.' },
      { dir: 'sc', label: 'ACK  ack=5461', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '2. Confirmat', d: 'Serverul așteaptă acum octetul 5461.' },
      { dir: 'cs', label: 'seq=5461 len=1000', lost: true, cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '3. Segment pierdut!', d: 'Un switch congestionat aruncă segmentul. Clientul nu știe încă — a pornit timer-ul de retransmisie (RTO) și continuă să trimită cât îi permite window-ul.', hl: true },
      { dir: 'cs', label: 'seq=6461 len=1000', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '4. Segmentul următor ajunge', d: 'Serverul primește octeții 6461–7460, dar îi lipsește 5461–6460. Îi păstrează în buffer (out-of-order)…' },
      { dir: 'sc', label: 'ACK  ack=5461  (dup #1)', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '5. Duplicate ACK #1', d: '…și repetă ultimul ACK: „încă aștept 5461”. Un ACK identic cu cel anterior se numește duplicate ACK.' },
      { dir: 'cs', label: 'seq=7461 len=1000', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '6. Încă un segment', d: 'Ajunge și acesta în buffer-ul serverului.' },
      { dir: 'sc', label: 'ACK  ack=5461  (dup #2)', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '7. Duplicate ACK #2', d: 'Serverul insistă: lipsește 5461.' },
      { dir: 'cs', label: 'seq=8461 len=1000', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '8. Încă un segment', d: 'Al treilea segment de după gaură.' },
      { dir: 'sc', label: 'ACK  ack=5461  (dup #3)', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '9. Duplicate ACK #3', d: 'Trei duplicate ACK-uri sunt un semn clar că un singur segment s-a pierdut, nu că rețeaua e blocată.' },
      { dir: 'cs', label: 'seq=5461 len=1000  (retransmis)', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '10. Fast retransmit', d: 'Clientul retransmite imediat segmentul lipsă, fără să aștepte expirarea RTO-ului. Totodată își reduce fereastra de congestie (congestion control).', hl: true },
      { dir: 'sc', label: 'ACK  ack=9461', cs: 'ESTABLISHED', ss: 'ESTABLISHED', t: '11. Gaura s-a umplut', d: 'Serverul are acum tot, de la 5461 la 9460 (inclusiv segmentele din buffer), și confirmă cumulativ: ack = 9461. Aplicația primește datele în ordine, fără să afle vreodată de pierdere.' },
    ],
  },
  close: {
    title: 'Închidere (FIN)', start: ['ESTABLISHED', 'ESTABLISHED'],
    steps: [
      { dir: 'cs', label: 'FIN+ACK  seq=9461 ack=5501', cs: 'FIN-WAIT-1', ss: 'CLOSE-WAIT', t: '1. FIN de la client', d: 'Clientul a terminat de trimis: setează FIN. Este o închidere „pe jumătate” — clientul încă poate primi date.' },
      { dir: 'sc', label: 'ACK  ack=9462', cs: 'FIN-WAIT-2', ss: 'CLOSE-WAIT', t: '2. ACK pentru FIN', d: 'Serverul confirmă FIN-ul (ack = 9461 + 1 — FIN consumă și el un număr de secvență, ca SYN). Serverul mai poate trimite ce i-a rămas.', hl: true },
      { dir: 'sc', label: 'FIN+ACK  seq=5501 ack=9462', cs: 'TIME-WAIT', ss: 'LAST-ACK', t: '3. FIN de la server', d: 'Când și aplicația serverului a terminat, serverul își trimite propriul FIN. (Pașii 2 și 3 pot fi combinați într-un singur FIN+ACK → închidere în 3 segmente.)' },
      { dir: 'cs', label: 'ACK  ack=5502', cs: 'TIME-WAIT', ss: 'CLOSED', t: '4. ACK final', d: 'Clientul confirmă FIN-ul serverului. Serverul închide conexiunea (CLOSED).' },
      { note: 'așteaptă 2 × MSL', cs: 'CLOSED', ss: 'CLOSED', t: '5. TIME-WAIT', d: 'Cel care a închis primul (clientul) mai așteaptă 2 × MSL (în specificație MSL = 2 minute; sistemele reale folosesc valori mai mici) ca segmentele întârziate să dispară din rețea. De aceea vezi multe conexiuni TIME_WAIT în netstat.' },
    ],
  },
};
export function TcpLadder({ initial = 'open' }: { initial?: keyof typeof SCEN }) {
  const [sc, setSc] = useState<keyof typeof SCEN>(initial);
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const S = SCEN[sc];
  useAutoplay(play, setPlay, setStep, S.steps.length, 1700);
  const xC = 130, xS = 590, Y0 = 118, DY = 34;
  const H = Y0 + S.steps.length * DY + 24;
  const cur = step === 0 ? null : S.steps[step - 1];
  const [cs, ss] = cur ? [cur.cs, cur.ss] : S.start;
  const stColor = (s: string) => s === 'ESTABLISHED' ? 'var(--ok)' : s === 'CLOSED' ? 'var(--muted)' : s === 'LISTEN' ? 'var(--info)' : 'var(--warn)';
  return (
    <>
      <div className="segmented" role="group" aria-label="Scenariu" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        {(Object.keys(SCEN) as (keyof typeof SCEN)[]).map((k) => <button key={k} className={sc === k ? 'on' : ''} onClick={() => { setSc(k); setStep(0); setPlay(false); }}>{SCEN[k].title}</button>)}
      </div>
      <svg viewBox={`0 0 720 ${H}`} role="img" aria-label={`Diagramă TCP: ${S.title}`}>
        <defs>
          <marker id="t15arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)" /></marker>
          <marker id="t15arrHl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--violet)" /></marker>
        </defs>
        <ClientIcon x={xC} y={24} kind="pc" />
        <ServerIcon x={xS} y={26} />
        <T x={xC} y={62} weight={650}>Client</T><T x={xC} y={76} size={10.5} m color="var(--muted)">192.168.1.10:51000</T>
        <T x={xS} y={62} weight={650}>Server</T><T x={xS} y={76} size={10.5} m color="var(--muted)">203.0.113.10:80</T>
        {[[xC, cs], [xS, ss]].map(([x, s]) => (
          <g key={x as number}>
            <rect x={(x as number) - 58} y={84} width={116} height={20} rx={10} fill="var(--surface-3)" stroke={stColor(s as string)} />
            <T x={x as number} y={98} size={10.5} weight={700} m color={stColor(s as string)}>{s}</T>
          </g>
        ))}
        <line x1={xC} x2={xC} y1={108} y2={H - 8} stroke="var(--border-strong)" strokeDasharray="4 4" />
        <line x1={xS} x2={xS} y1={108} y2={H - 8} stroke="var(--border-strong)" strokeDasharray="4 4" />
        {S.steps.map((s, i) => {
          const y1 = Y0 + i * DY, y2 = y1 + DY - 8;
          const vis = i < step, now = i === step - 1;
          if (s.note) return vis ? <g key={i} className="fade-up"><rect x={xC + 8} y={y1 + 2} width={150} height={20} rx={6} fill="var(--warn-soft)" /><T x={xC + 83} y={y1 + 16} size={10.5} weight={650} color="var(--warn)">⏱ {s.note}</T></g> : null;
          const [a, b] = s.dir === 'cs' ? [xC + 4, xS - 6] : [xS - 4, xC + 6];
          const bx = s.lost ? a + (b - a) * 0.58 : b;
          const by = s.lost ? y1 + (y2 - y1) * 0.58 : y2;
          const col = s.hl ? 'var(--violet)' : 'var(--accent)';
          return (
            <g key={i} opacity={vis ? 1 : 0.1} style={{ transition: 'opacity .35s' }}>
              <line x1={a} y1={y1} x2={bx} y2={by} stroke={s.lost ? 'var(--bad)' : col} strokeWidth={now ? 2.6 : 1.8} markerEnd={s.lost ? undefined : s.hl ? 'url(#t15arrHl)' : 'url(#t15arr)'} className={now && !s.lost ? 'flow' : undefined} />
              {s.lost && <path d={`M${bx - 7} ${by - 7} l14 14 M${bx + 7} ${by - 7} l-14 14`} stroke="var(--bad)" strokeWidth={2.6} />}
              {vis && <>
                <rect x={360 - s.label!.length * 3.6 - 6} y={(y1 + y2) / 2 - 15} width={s.label!.length * 7.2 + 12} height={16} rx={4} fill="var(--surface)" />
                <T x={360} y={(y1 + y2) / 2 - 3} size={11.5} weight={650} m color={s.lost ? 'var(--bad)' : now ? col : 'var(--text)'}>{s.label}</T>
              </>}
            </g>
          );
        })}
      </svg>
      <div className="callout tip" style={{ marginTop: 8, minHeight: 72 }}>
        <div><b>{cur ? cur.t : `${S.title}: apasă „Pasul următor” și încearcă să ghicești seq/ack înainte să apară.`}</b>{cur && <div className="small">{cur.d}</div>}</div>
      </div>
      <Controls step={step} max={S.steps.length} setStep={setStep} play={play} setPlay={setPlay} />
    </>
  );
}

/* ---------------------------------------------------------------
   Sliding window — animație
---------------------------------------------------------------- */
export function SlidingWindow() {
  const N = 12;
  const [w, setW] = useState(4);
  const [st8, setSt8] = useState({ base: 0, next: 0 }); // base = primul neconfirmat, next = următorul de trimis
  const { base, next } = st8;
  const [auto, setAuto] = useState(false);
  const canSend = next < N && next < base + w;
  const canAck = base < next;
  const send = () => setSt8((s) => (s.next < N && s.next < s.base + w ? { ...s, next: s.next + 1 } : s));
  const ack = () => setSt8((s) => (s.base < s.next ? { ...s, base: s.base + 1 } : s));
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setSt8((s) => {
      if (s.next < N && s.next < s.base + w) return { ...s, next: s.next + 1 }; // trimite cât permite fereastra
      if (s.base < s.next) return { ...s, base: s.base + 1 };                 // apoi vine un ACK
      return s;
    }), 700);
    return () => clearInterval(t);
  }, [auto, w]);
  useEffect(() => { if (base >= N) setAuto(false); }, [base]);
  const reset = () => { setSt8({ base: 0, next: 0 }); setAuto(false); };
  const X0 = 30, BW = 50, G = 5;
  const st = (i: number) => (i < base ? 'acked' : i < next ? 'flight' : i < base + w ? 'usable' : 'wait');
  const fill = { acked: 'var(--ok-soft)', flight: 'var(--warn-soft)', usable: 'var(--accent-soft)', wait: 'var(--surface-3)' };
  const stroke = { acked: 'var(--ok)', flight: 'var(--warn)', usable: 'var(--accent)', wait: 'var(--border)' };
  const inflight = next - base;
  return (
    <>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <span className="small muted">Window (receptorul anunță):</span>
        <div className="segmented" role="group" aria-label="Mărimea ferestrei">
          {[0, 1, 2, 4, 6].map((k) => <button key={k} className={w === k ? 'on' : ''} onClick={() => setW(k)}>{k === 0 ? '0 (plin)' : `${k} × 1000 B`}</button>)}
        </div>
      </div>
      <svg viewBox="0 0 720 200" role="img" aria-label="Fereastra glisantă TCP">
        <T x={X0} y={18} anchor="start" size={11} weight={650} color="var(--muted)">Segmentele emițătorului (câte 1000 B fiecare):</T>
        {w > 0 && base < N && <rect x={X0 + base * (BW + G) - 5} y={30} width={Math.min(w, N - base) * (BW + G) + 5} height={66} rx={10} fill="none" stroke="var(--accent)" strokeWidth={2.4} style={{ transition: 'x .4s' }} />}
        {w > 0 && base < N && <T x={X0 + base * (BW + G) + (Math.min(w, N - base) * (BW + G)) / 2} y={112} size={11} weight={700} color="var(--accent)">fereastra = {w * 1000} B</T>}
        {Array.from({ length: N }, (_, i) => (
          <g key={i}>
            <rect x={X0 + i * (BW + G)} y={38} width={BW} height={50} rx={6} fill={fill[st(i)]} stroke={stroke[st(i)]} />
            <T x={X0 + i * (BW + G) + BW / 2} y={60} size={11.5} weight={650}>{`S${i + 1}`}</T>
            <T x={X0 + i * (BW + G) + BW / 2} y={78} size={9.5} m color="var(--muted)">{1 + i * 1000}</T>
          </g>
        ))}
        {[['acked', 'trimis și confirmat'], ['flight', 'trimis, neconfirmat („în zbor”)'], ['usable', 'poate fi trimis acum'], ['wait', 'în afara ferestrei — așteaptă']].map(([k, l], i) => (
          <g key={k}><rect x={X0 + (i % 2) * 340} y={130 + Math.floor(i / 2) * 24} width={16} height={16} rx={4} fill={fill[k as keyof typeof fill]} stroke={stroke[k as keyof typeof stroke]} />
            <T x={X0 + 24 + (i % 2) * 340} y={143 + Math.floor(i / 2) * 24} anchor="start" size={11} color="var(--text-2)">{l}</T></g>
        ))}
        <T x={X0} y={192} anchor="start" size={11} color="var(--muted)">{`În zbor: ${inflight} segmente (${inflight * 1000} B) · Confirmate: ${base}/${N} · ${base >= N ? 'Transfer complet ✓' : w === 0 ? 'Window = 0 → emițătorul s-a oprit (trimite doar „window probes”)' : canSend ? 'Poți trimite' : 'Fereastra e plină → aștept ACK'}`}</T>
      </svg>
      <div className="controls">
        <button className="btn sm primary" onClick={send} disabled={!canSend || auto}>Trimite segment →</button>
        <button className="btn sm" onClick={ack} disabled={!canAck || auto}>← Sosește ACK</button>
        <button className="btn sm" onClick={() => setAuto(!auto)} disabled={base >= N || w === 0}>{auto ? '⏸ Pauză' : '▶ Auto'}</button>
        <button className="btn sm ghost" onClick={reset}>Reset</button>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   Congestion window (cwnd) — evoluție tipică (TCP Reno, didactic)
---------------------------------------------------------------- */
const CW = [1, 2, 4, 8, 16, 17, 18, 19, 20, 10, 11, 12, 13, 1, 2, 4, 6, 7, 8, 9];
export function CwndChart() {
  const X0 = 60, X1 = 700, Y0 = 250, Y1 = 30, maxY = 22;
  const px = (i: number) => X0 + (i * (X1 - X0)) / (CW.length - 1);
  const py = (v: number) => Y0 - (v * (Y0 - Y1)) / maxY;
  const ss = [[0, 8, 16], [9, 12, 10], [13, 19, 6]];
  return (
    <svg viewBox="0 0 720 300" role="img" aria-label="Evoluția ferestrei de congestie: slow start, congestion avoidance, reacția la pierderi">
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="var(--border-strong)" />
      <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 10} stroke="var(--border-strong)" />
      {[0, 5, 10, 15, 20].map((v) => <g key={v}><line x1={X0 - 4} x2={X1} y1={py(v)} y2={py(v)} stroke="var(--border)" strokeDasharray={v ? '2 4' : undefined} /><T x={X0 - 8} y={py(v) + 4} anchor="end" size={10} color="var(--muted)">{v}</T></g>)}
      {CW.map((_, i) => i % 2 === 0 && <T key={i} x={px(i)} y={Y0 + 16} size={10} color="var(--muted)">{i}</T>)}
      <T x={(X0 + X1) / 2} y={Y0 + 34} size={11} color="var(--muted)">timp (RTT-uri)</T>
      <T x={16} y={20} anchor="start" size={11} color="var(--muted)">cwnd (în MSS)</T>
      {ss.map(([a, b, v], i) => <g key={i}><line x1={px(a)} x2={px(b)} y1={py(v)} y2={py(v)} stroke="var(--warn)" strokeDasharray="6 4" strokeWidth={1.4} /><T x={px(b) + 4} y={py(v) - 4} anchor="start" size={10} color="var(--warn)">{`ssthresh=${v}`}</T></g>)}
      <polyline points={CW.map((v, i) => `${px(i)},${py(v)}`).join(' ')} fill="none" stroke="var(--accent)" strokeWidth={2.6} strokeLinejoin="round" />
      {CW.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r={3.5} fill="var(--accent)" />)}
      <T x={px(1.6)} y={py(12)} size={11} weight={650} color="var(--accent)">slow start</T>
      <T x={px(1.6)} y={py(12) + 14} size={10} color="var(--muted)">×2 la fiecare RTT</T>
      <T x={px(6.5)} y={py(21.4)} size={11} weight={650} color="var(--info)">congestion avoidance (+1 MSS / RTT)</T>
      <T x={px(9)} y={py(7.6)} size={10.5} weight={650} color="var(--violet)">3 dup ACKs → cwnd ÷ 2</T>
      <T x={px(13.2)} y={py(15.2)} size={10.5} weight={650} color="var(--bad)">timeout → cwnd = 1</T>
      <line x1={px(12.6)} y1={py(14.4)} x2={px(13)} y2={py(2)} stroke="var(--bad)" strokeWidth={1} strokeDasharray="3 3" />
    </svg>
  );
}

/* ---------------------------------------------------------------
   TCP vs UDP — câte RTT până la primul răspuns
---------------------------------------------------------------- */
export function TcpVsUdpTimeline() {
  const panel = (ox: number, title: string, msgs: { d: 'r' | 'l'; l: string; c: string }[], foot: string) => {
    const a = ox + 50, b = ox + 300;
    return (
      <g>
        <rect x={ox + 4} y={6} width={342} height={288} rx={12} fill="var(--surface-2)" stroke="var(--border)" />
        <T x={ox + 175} y={28} weight={700}>{title}</T>
        <T x={a} y={50} size={11} weight={650}>Client</T><T x={b} y={50} size={11} weight={650}>Server</T>
        <line x1={a} x2={a} y1={58} y2={262} stroke="var(--border-strong)" strokeDasharray="4 4" />
        <line x1={b} x2={b} y1={58} y2={262} stroke="var(--border-strong)" strokeDasharray="4 4" />
        {msgs.map((m, i) => {
          const y1 = 70 + i * 46, y2 = y1 + 36;
          const [x1, x2] = m.d === 'r' ? [a + 3, b - 5] : [b - 3, a + 5];
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={m.c} strokeWidth={2} markerEnd="url(#t15tv)" />
              <rect x={ox + 175 - m.l.length * 3.3 - 4} y={(y1 + y2) / 2 - 14} width={m.l.length * 6.6 + 8} height={15} rx={4} fill="var(--surface-2)" />
              <T x={ox + 175} y={(y1 + y2) / 2 - 3} size={11} weight={650} m color={m.c}>{m.l}</T>
            </g>
          );
        })}
        <T x={ox + 175} y={282} size={11} weight={650} color="var(--text-2)">{foot}</T>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 720 300" role="img" aria-label="Comparație: TCP are nevoie de handshake înainte de date, UDP trimite imediat">
      <defs><marker id="t15tv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--text-2)" /></marker></defs>
      {panel(0, 'TCP (de ex. HTTP)', [
        { d: 'r', l: 'SYN', c: 'var(--warn)' }, { d: 'l', l: 'SYN+ACK', c: 'var(--warn)' },
        { d: 'r', l: 'ACK + GET /', c: 'var(--accent)' }, { d: 'l', l: '200 OK (date)', c: 'var(--accent)' },
      ], 'primul răspuns după 2 RTT')}
      {panel(370, 'UDP (de ex. DNS)', [
        { d: 'r', l: 'Query: A www…?', c: 'var(--accent)' }, { d: 'l', l: 'Response: 203.0.113.10', c: 'var(--accent)' },
      ], 'primul răspuns după 1 RTT')}
    </svg>
  );
}

/* ---------------------------------------------------------------
   Topologii laborator
---------------------------------------------------------------- */
const Wire = ({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) => (
  <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-2)" strokeWidth={2} />{label && <T x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} size={10} color="var(--muted)">{label}</T>}</g>
);
export function LabGuidedTopology() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Topologia labului ghidat: două PC-uri, un server și un router pe același switch">
      <SwitchIcon x={360} y={120} />
      <T x={360} y={98} weight={650}>SW1 (2960)</T>
      <ClientIcon x={110} y={60} kind="pc" label="PC0 · 192.168.1.10" />
      <ClientIcon x={110} y={190} kind="pc" label="PC1 · 192.168.1.11" />
      <ServerIcon x={610} y={60} label="Server0" sub="192.168.1.100 · HTTP DNS TFTP FTP" />
      <RouterIcon x={610} y={200} label="R1" sub="G0/0 · 192.168.1.1" />
      <Wire x1={130} y1={60} x2={328} y2={114} label="Fa0/1" />
      <Wire x1={130} y1={190} x2={328} y2={126} label="Fa0/2" />
      <Wire x1={392} y1={114} x2={594} y2={64} label="Fa0/3" />
      <Wire x1={392} y1={126} x2={580} y2={198} label="Fa0/4" />
      <T x={360} y={252} size={11} color="var(--muted)">o singură rețea 192.168.1.0/24 · DNS: www.ccna.lab → 192.168.1.100</T>
    </svg>
  );
}
export function LabSoloTopology() {
  return (
    <svg viewBox="0 0 720 250" role="img" aria-label="Topologia labului solo: două rețele legate de un router">
      <ClientIcon x={70} y={70} kind="pc" label="PC-A · .10" />
      <ClientIcon x={70} y={180} label="Laptop-A · .11" />
      <SwitchIcon x={220} y={125} />
      <T x={220} y={103} weight={650}>SW-A</T>
      <RouterIcon x={360} y={125} label="R1" sub="G0/0 .1 · G0/1 .1" />
      <SwitchIcon x={500} y={125} />
      <T x={500} y={103} weight={650}>SW-B</T>
      <ServerIcon x={650} y={110} label="SRV" sub="192.168.20.100" />
      <Wire x1={90} y1={70} x2={190} y2={120} /><Wire x1={90} y1={180} x2={190} y2={130} />
      <Wire x1={252} y1={125} x2={330} y2={125} label="G0/0" /><Wire x1={390} y1={125} x2={468} y2={125} label="G0/1" />
      <Wire x1={532} y1={125} x2={636} y2={112} />
      <T x={150} y={240} size={11} color="var(--muted)">LAN A: 192.168.10.0/24</T>
      <T x={570} y={240} size={11} color="var(--muted)">LAN B: 192.168.20.0/24</T>
    </svg>
  );
}
