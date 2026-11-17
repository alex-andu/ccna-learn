import { useState, type ReactNode } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';

/* Diagrame originale pentru 1.4 — Identify interface and cable issues.
   Culori DOAR prin var(--...), ca să meargă în ambele teme. */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
const Wrap = ({ children }: { children: ReactNode }) => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>{children}</div>;
const preStyle: React.CSSProperties = {
  margin: 0, padding: '12px 14px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)',
  fontSize: 12.5, lineHeight: 1.6, overflowX: 'auto', color: 'var(--text-2)', ...mono,
};
const panel: React.CSSProperties = { marginTop: 12, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2)' };

/* =====================================================================
   1) Decodorul stărilor de interfață
   ===================================================================== */
type St = {
  id: string; label: string; l1: boolean | 'admin' | 'err'; l2: boolean; tone: string;
  out: string[]; brief: string; status: string; meaning: ReactNode; causes: ReactNode[]; fix: ReactNode[];
};
const STATES: St[] = [
  {
    id: 'upup', label: 'up / up', l1: true, l2: true, tone: 'var(--ok)',
    out: ['GigabitEthernet0/1 is up, line protocol is up (connected)'], brief: 'up            up', status: 'connected',
    meaning: <>Nivelul 1 (semnal pe fir) și nivelul 2 (protocolul de legătură) funcționează. Starea normală. <b>Atenție:</b> up/up NU garantează că totul e în regulă — un duplex mismatch sau un cablu care produce CRC-uri arată tot up/up.</>,
    causes: ['Totul în regulă la L1/L2.', 'Sau o problemă „ascunsă”: duplex mismatch, erori CRC, congestie — se văd doar în contoare.'],
    fix: [<>Dacă utilizatorii se plâng, treci la contoare: <code>show interfaces</code> (CRC, collisions, late collision, output drops).</>, 'Dacă și contoarele sunt curate, problema e mai sus: IP, VLAN, gateway, routing.'],
  },
  {
    id: 'updown', label: 'up / down', l1: true, l2: false, tone: 'var(--warn)',
    out: ['Serial0/1/0 is up, line protocol is down'], brief: 'up            down', status: 'notconnect / monitoring',
    meaning: <>Semnalul fizic există (L1 ✓), dar protocolul de nivel 2 nu se înțelege cu capătul celălalt (L2 ✗). Clasic pe legăturile <b>seriale</b> între routere; pe Ethernet e rar.</>,
    causes: [<>Serial: <b>encapsulare diferită</b> la capete (HDLC vs PPP).</>, <>Serial: lipsește <code>clock rate</code> pe capătul DCE sau keepalive-urile nu se primesc.</>, 'PPP: autentificarea (PAP/CHAP) eșuează.', <>Ethernet: rar — de exemplu un port destinație SPAN apare „up, line protocol is down (monitoring)”, ceea ce e normal.</>],
    fix: [<>Compară configurația ambelor capete: <code>show interfaces serial0/1/0</code> (linia „Encapsulation”), <code>show controllers serial0/1/0</code> (DCE/DTE, clock).</>, <>Pune aceeași encapsulare pe ambele capete (<code>encapsulation ppp</code> sau <code>hdlc</code>).</>],
  },
  {
    id: 'downdown', label: 'down / down', l1: false, l2: false, tone: 'var(--bad)',
    out: ['GigabitEthernet0/2 is down, line protocol is down (notconnect)'], brief: 'down          down', status: 'notconnect',
    meaning: <>Nu există semnal valid pe fir (L1 ✗), deci nici L2 nu poate funcționa. Interfața ta e pornită, dar „nu vede” pe nimeni la celălalt capăt.</>,
    causes: ['Cablul nu e conectat sau e întrerupt (fir rupt, conector stricat).', <>Cablu de tip greșit fără <b>Auto-MDIX</b> (straight-through în loc de crossover sau invers), sau rollover pus într-un port Ethernet.</>, <>Capătul celălalt e oprit (<code>shutdown</code>), stins sau err-disabled.</>, <><b>Speed mismatch</b>: ambele capete fixate pe viteze diferite.</>, 'Fibră: TX/RX inversate, conectori murdari, SFP de alt tip (SX vs LX) sau fibră SMF/MMF nepotrivită.'],
    fix: ['Verifică LED-ul portului și cablul (înlocuiește-l cu unul testat).', <>Verifică celălalt capăt: <code>show interfaces status</code> acolo.</>, <>Verifică viteza: <code>speed auto</code> pe ambele capete sau aceeași valoare.</>],
  },
  {
    id: 'admin', label: 'administratively down', l1: 'admin', l2: false, tone: 'var(--muted)',
    out: ['GigabitEthernet0/3 is administratively down, line protocol is down (disabled)'], brief: 'administratively down down', status: 'disabled',
    meaning: <>Cineva a dat comanda <code>shutdown</code> pe interfață. Cuvântul „administratively” = <b>tu (sau un coleg) ai făcut-o</b>, nu o eroare.</>,
    causes: [<>Comanda <code>shutdown</code> în configurație (bună practică pe porturile nefolosite).</>, 'Interfețele de router sunt oprite implicit până dai no shutdown.'],
    fix: [<><code>interface g0/3</code> → <code>no shutdown</code>.</>, 'Capătul celălalt va trece din down/down în up/up.'],
  },
  {
    id: 'errdis', label: 'err-disabled', l1: 'err', l2: false, tone: 'var(--bad)',
    out: ['GigabitEthernet0/4 is down, line protocol is down (err-disabled)'], brief: 'down          down', status: 'err-disabled',
    meaning: <><b>Switch-ul</b> a oprit singur portul pentru că a detectat o condiție periculoasă. E diferit de administratively down: nu tu ai dat shutdown, ci mecanismul de protecție.</>,
    causes: ['Port security: un MAC neautorizat (acțiunea implicită = shutdown) — topicul 5.7.', 'BPDU Guard: a sosit un BPDU pe un port PortFast — topicul 2.5.', 'UDLD: legătură unidirecțională (fibră cu un singur fir funcțional).', 'EtherChannel configurat greșit, link-flap (portul cade și revine des), DHCP snooping rate-limit etc.'],
    fix: [<>Află cauza: <code>show interfaces status err-disabled</code>, <code>show logging</code> (mesajul <code>%PM-4-ERR_DISABLE</code>).</>, <>Elimină cauza, apoi <code>shutdown</code> + <code>no shutdown</code> pe port.</>, <>Opțional: <code>errdisable recovery cause …</code> pentru reactivare automată după un interval.</>],
  },
];

function Lamp({ x, label, on, kind }: { x: number; label: string; on: boolean | 'admin' | 'err'; kind: string }) {
  const col = on === true ? 'var(--ok)' : on === 'admin' ? 'var(--muted)' : 'var(--bad)';
  const txt = on === true ? 'UP' : on === 'admin' ? 'OPRIT (shutdown)' : on === 'err' ? 'OPRIT de switch' : 'DOWN';
  return (
    <g>
      <rect x={x} y={14} width={200} height={70} rx={12} fill="var(--surface-3)" stroke="var(--border)" />
      <circle cx={x + 30} cy={49} r={14} fill={col} fillOpacity={0.25} stroke={col} strokeWidth={2} />
      <circle cx={x + 30} cy={49} r={6} fill={col} />
      <T x={x + 54} y={42} anchor="start" size={11} color="var(--muted)">{kind}</T>
      <T x={x + 54} y={62} anchor="start" size={14} weight={700} color={col}>{label}: {txt}</T>
    </g>
  );
}

export function StatusDecoder() {
  const [id, setId] = useState('upup');
  const s = STATES.find((x) => x.id === id)!;
  return (
    <>
      <Wrap>
        {STATES.map((x) => (
          <button key={x.id} type="button" className={`btn sm ${x.id === id ? 'primary' : ''}`} onClick={() => setId(x.id)}>{x.label}</button>
        ))}
      </Wrap>
      <svg viewBox="0 0 460 98" role="img" aria-label="Starea nivelului 1 și a nivelului 2" style={{ marginTop: 12, maxWidth: 520 }}>
        <Lamp x={6} kind="primul cuvânt = nivelul 1 (fizic)" label="L1" on={s.l1} />
        <Lamp x={250} kind="al doilea = nivelul 2 (line protocol)" label="L2" on={s.l2} />
      </svg>
      <pre style={{ ...preStyle, marginTop: 10 }}>
        <span style={{ color: 'var(--muted)' }}>! show interfaces</span>{'\n'}
        <span style={{ color: s.tone, fontWeight: 650 }}>{s.out[0]}</span>{'\n'}
        <span style={{ color: 'var(--muted)' }}>! show ip interface brief → Status / Protocol:</span> {s.brief}{'\n'}
        <span style={{ color: 'var(--muted)' }}>! show interfaces status → Status:</span> {s.status}
      </pre>
      <div style={panel}>
        <p style={{ marginTop: 0 }}>{s.meaning}</p>
        <div className="grid c2">
          <div><b>Cauze tipice</b><ul className="small" style={{ marginBottom: 0 }}>{s.causes.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
          <div><b>Ce faci</b><ul className="small" style={{ marginBottom: 0 }}>{s.fix.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
        </div>
      </div>
    </>
  );
}

/* =====================================================================
   2) show interfaces adnotat — click pe fiecare contor
   ===================================================================== */
type Scn = 'healthy' | 'half' | 'full' | 'cable' | 'cong' | 'storm';
type V = {
  duplex: string; bw: number; rel: string; tx: number; rx: number; outdrops: number; nobuf: number; bcast: number;
  runts: number; giants: number; inerr: number; crc: number; frame: number; overrun: number; ignored: number;
  underruns: number; outerr: number; coll: number; resets: number; late: number; deferred: number; babbles: number; lostc: number;
};
const Z = { outdrops: 0, nobuf: 0, runts: 0, giants: 0, inerr: 0, crc: 0, frame: 0, overrun: 0, ignored: 0, underruns: 0, outerr: 0, coll: 0, resets: 0, late: 0, deferred: 0, babbles: 0, lostc: 0 };
const SCN: Record<Scn, { label: string; v: V; diag: ReactNode }> = {
  healthy: { label: 'Port sănătos', v: { ...Z, duplex: 'Full-duplex, 1000Mb/s', bw: 1000000, rel: '255/255', tx: 1, rx: 1, bcast: 10233 },
    diag: <>Toate contoarele de erori sunt 0, reliability 255/255, full-duplex la 1 Gb/s. Așa arată un port bun. Dacă utilizatorul are totuși probleme, caută mai sus (IP, VLAN, gateway).</> },
  half: { label: 'Duplex mismatch — partea HALF', v: { ...Z, duplex: 'Half-duplex, 100Mb/s', bw: 100000, rel: '248/255', tx: 3, rx: 2, bcast: 10233, inerr: 312, crc: 288, frame: 24, coll: 6721, resets: 3, late: 1984, deferred: 412 },
    diag: <><b>Half-duplex la 100 Mb/s</b> pe un port care ar trebui să fie full, plus <b>collisions</b> și mai ales <b>late collision</b> → semnătura părții half dintr-un duplex mismatch. Portul a căzut pe half prin parallel detection (celălalt capăt e fixat 100/full).</> },
  full: { label: 'Duplex mismatch — partea FULL', v: { ...Z, duplex: 'Full-duplex, 100Mb/s', bw: 100000, rel: '240/255', tx: 2, rx: 3, bcast: 9877, runts: 1520, inerr: 2897, crc: 1377 },
    diag: <>Full-duplex, <b>zero coliziuni</b> (un port full nu le numără niciodată), dar <b>runts + CRC</b> care cresc → primești fragmentele cadrelor pe care partea half le abandonează. Exact cealaltă jumătate a mismatch-ului.</> },
  cable: { label: 'Cablu deteriorat / EMI', v: { ...Z, duplex: 'Full-duplex, 1000Mb/s', bw: 1000000, rel: '231/255', tx: 1, rx: 4, bcast: 10233, inerr: 6925, crc: 5821, frame: 1104, resets: 14 },
    diag: <><b>CRC + frame mari, zero coliziuni, full-duplex</b> → biții se corup pe fir: cablu deteriorat sau prea lung, conector prost sertizat, interferențe (EMI), NIC/port defect. Interface resets = link-ul a mai „căzut” (flap). Cisco numește tiparul „excessive noise”.</> },
  cong: { label: 'Congestie la ieșire', v: { ...Z, duplex: 'Full-duplex, 100Mb/s', bw: 100000, rel: '255/255', tx: 251, rx: 12, bcast: 10233, outdrops: 48211 },
    diag: <><b>Total output drops</b> mare, txload aproape 255/255, zero erori → nu e cablul, e <b>congestie</b>: mai mult trafic vrea să iasă decât încape (de exemplu un uplink de 100 Mb/s alimentat de porturi de 1 Gb/s). Soluții: link mai rapid, EtherChannel, QoS.</> },
  storm: { label: 'Furtună de broadcast', v: { ...Z, duplex: 'Full-duplex, 1000Mb/s', bw: 1000000, rel: '255/255', tx: 250, rx: 255, bcast: 98123456, nobuf: 1290, ignored: 3412, overrun: 220, inerr: 4922 },
    diag: <>Broadcast-uri cu zecile de milioane, <b>ignored / no buffer / overrun</b> în creștere, rxload 255/255 → interfața e inundată. Cauza tipică: o buclă de nivel 2 (STP oprit sau ocolit) — vezi topicul 2.5. Tot nu e o problemă de cablu.</> },
};

type K = 'status' | 'bw' | 'rel' | 'load' | 'duplex' | 'clear' | 'outdrops' | 'nobuf' | 'bcast' | 'runts' | 'giants' | 'inerr' | 'crc' | 'frame' | 'overrun' | 'ignored' | 'underruns' | 'outerr' | 'coll' | 'resets' | 'late' | 'deferred' | 'babbles' | 'lostc';
const ERR_KEYS: K[] = ['outdrops', 'nobuf', 'runts', 'giants', 'inerr', 'crc', 'frame', 'overrun', 'ignored', 'underruns', 'outerr', 'coll', 'resets', 'late', 'deferred', 'babbles', 'lostc'];
const BUCKET = {
  stare: { t: 'stare / configurare', c: 'var(--info)' }, fizic: { t: 'erori fizice (cablu, zgomot)', c: 'var(--bad)' },
  duplex: { t: 'coliziuni / duplex', c: 'var(--warn)' }, cong: { t: 'congestie / resurse — NU cablu', c: 'var(--violet)' }, info: { t: 'informativ', c: 'var(--muted)' },
} as const;
type Info = { name: string; bucket: keyof typeof BUCKET; def: ReactNode; cause: ReactNode };
const INFO: Record<K, Info> = {
  status: { name: 'is up, line protocol is up', bucket: 'stare', def: 'Primul cuvânt = starea nivelului 1 (semnal fizic); „line protocol” = starea nivelului 2. Între paranteze, pe switch-uri: connected / notconnect / disabled / err-disabled.', cause: 'up/up e necesar, dar nu suficient: contoarele de mai jos pot ascunde probleme.' },
  bw: { name: 'BW (bandwidth)', bucket: 'info', def: 'Lățimea de bandă folosită de IOS în calcule (de exemplu metrica OSPF/EIGRP). Pe Ethernet reflectă viteza negociată, nu traficul măsurat.', cause: 'Un BW de 100000 Kbit/sec pe un port gigabit îți spune că legătura a negociat doar 100 Mb/s — merită investigat (cablu cu o pereche defectă? capăt fixat pe 100?).' },
  rel: { name: 'reliability x/255', bucket: 'info', def: 'Fiabilitatea interfeței ca fracție din 255, mediată exponențial pe 5 minute. 255/255 = 100% fără erori.', cause: 'Sub 255 = cadre cu erori în ultimele minute. Un indicator rapid, dar cauza o afli din contoarele de erori.' },
  load: { name: 'txload / rxload', bucket: 'info', def: 'Încărcarea la transmisie / recepție, ca fracție din 255 față de BW (medie pe 5 minute).', cause: 'Aproape de 255/255 = link saturat → așteaptă-te la output drops (congestie).' },
  duplex: { name: 'duplex, viteză', bucket: 'stare', def: 'Duplexul și viteza ACTUALE ale interfeței (negociate sau fixate manual).', cause: 'Half-duplex pe un port de switch modern legat de un singur dispozitiv aproape mereu înseamnă o problemă: celălalt capăt e fixat (hard-coded) și acest capăt a căzut pe half prin parallel detection.' },
  clear: { name: 'Last clearing of counters', bucket: 'info', def: 'Cât timp a trecut de la ultimul clear counters (sau „never”).', cause: 'Contoarele sunt cumulative. 300 de CRC-uri în 3 ani nu înseamnă nimic; 300 în 3 minute înseamnă mult. Dă clear counters și urmărește dacă cresc.' },
  outdrops: { name: 'Total output drops', bucket: 'cong', def: 'Pachete aruncate pentru că coada de ieșire era plină (Cisco: frecvent la trecerea de la o interfață rapidă la una lentă).', cause: 'Congestie, nu cablu. Nu confunda cu output errors.' },
  nobuf: { name: 'no buffer', bucket: 'cong', def: 'Pachete primite aruncate pentru că nu exista spațiu în bufferele de sistem.', cause: 'Furtună de broadcast, rafale de trafic. Compară cu „ignored”.' },
  bcast: { name: 'broadcasts', bucket: 'info', def: 'Câte cadre broadcast (și, în paranteză, multicast) au fost primite.', cause: 'Cifre uriașe care cresc foarte repede + ignored/no buffer = suspectează o buclă de nivel 2.' },
  runts: { name: 'runts', bucket: 'duplex', def: 'Cadre primite mai mici de 64 de octeți (minimul IEEE 802.3), cu CRC greșit.', cause: 'Fragmente de cadre întrerupte de coliziuni. Pe un link full-duplex: celălalt capăt e half (duplex mismatch). Mai rar: NIC/port defect, cablu.' },
  giants: { name: 'giants', bucket: 'fizic', def: 'Cadre primite mai mari de 1518 octeți (fără jumbo), cu FCS greșit în definiția switch-urilor Cisco.', cause: 'NIC defect care trimite cadre prea lungi (jabber) sau nepotrivire de MTU: un capăt trimite jumbo frames, celălalt nu le acceptă.' },
  inerr: { name: 'input errors', bucket: 'fizic', def: 'Totalul erorilor la recepție: runts, giants, no buffer, CRC, frame, overrun, ignored. Un cadru poate declanșa mai multe erori, deci sub-contoarele nu se adună obligatoriu exact la total.', cause: 'Arată „că e ceva”. Cauza o afli din sub-contorul care crește.' },
  crc: { name: 'CRC', bucket: 'fizic', def: 'Checksum-ul calculat de receptor nu se potrivește cu cel din câmpul FCS al cadrului → cadru corupt, aruncat.', cause: 'Fără coliziuni: cablu deteriorat/prea lung, conector, EMI, Cat3 la 100BASE-TX, NIC/port defect. Cu runts pe un port full: duplex mismatch (aceasta e partea full).' },
  frame: { name: 'frame', bucket: 'fizic', def: 'Cadre cu CRC greșit ȘI un număr de biți care nu e multiplu de 8 (nu se termină la granița unui octet).', cause: 'Coliziuni, cablu/defect fizic, duplex mismatch.' },
  overrun: { name: 'overrun', bucket: 'cong', def: 'Receptorul nu a putut preda datele unui buffer hardware: rata de intrare a depășit capacitatea lui.', cause: 'Rafale peste puterea de procesare a echipamentului. Nu e cablul.' },
  ignored: { name: 'ignored', bucket: 'cong', def: 'Cadre primite aruncate pentru că interfața a rămas fără buffere interne.', cause: 'Furtuni de broadcast, rafale de zgomot.' },
  underruns: { name: 'underruns', bucket: 'cong', def: 'Transmițătorul a rulat mai repede decât a putut furniza switch-ul/routerul datele.', cause: 'Rafale, probleme interne de capacitate. Rar la CCNA.' },
  outerr: { name: 'output errors', bucket: 'fizic', def: 'Totalul erorilor care au împiedicat transmisia finală a cadrelor pe această interfață.', cause: 'Probleme la transmisie (inclusiv unele legate de coliziuni). NU sunt același lucru cu output drops.' },
  coll: { name: 'collisions', bucket: 'duplex', def: 'De câte ori o coliziune a apărut înainte ca un cadru să fie transmis cu succes. Normale pe half-duplex; Cisco: nu trebuie să apară pe interfețe full-duplex.', cause: 'Half-duplex cu trafic mare (hub, segment partajat) sau duplex mismatch. Excesiv peste ≈0,1% din pachetele trimise.' },
  resets: { name: 'interface resets', bucket: 'fizic', def: 'De câte ori interfața a fost resetată complet (de exemplu când cadrele din coadă nu pot fi trimise câteva secunde, la pierderea semnalului sau la shutdown/no shutdown).', cause: 'Link instabil (flap): conector slăbit, cablu defect, transceiver. Verifică log-ul pentru %LINK-3-UPDOWN repetat.' },
  late: { name: 'late collision', bucket: 'duplex', def: 'Coliziune detectată după 512 bit-times (primii 64 de octeți ai cadrului) — 51,2 µs la 10 Mb/s.', cause: 'Duplex mismatch (aceasta e partea half) sau cablu/segment prea lung (peste 100 m, prea multe hub-uri). Nu ar trebui să apară niciodată într-o rețea corectă.' },
  deferred: { name: 'deferred', bucket: 'duplex', def: 'Cadre transmise după ce interfața a așteptat pentru că mediul era ocupat (carrier sense).', cause: 'Normal pe half-duplex. Pe un link care ar trebui să fie full, este încă un indiciu că portul rulează half.' },
  babbles: { name: 'babbles', bucket: 'fizic', def: 'Timer-ul de „jabber” al transmițătorului a expirat (s-a transmis prea mult continuu).', cause: 'NIC/transceiver defect. Rar.' },
  lostc: { name: 'lost carrier', bucket: 'fizic', def: 'De câte ori semnalul (carrier) s-a pierdut în timpul transmisiei.', cause: 'Cablu/conector intermitent, capăt celălalt care se resetează.' },
};

const LINES: string[] = [
  'SW1# show interfaces GigabitEthernet0/1',
  'GigabitEthernet0/1 {status}',
  '  Hardware is Gigabit Ethernet, address is 0cd0.f8a4.1b01 (bia 0cd0.f8a4.1b01)',
  '  MTU 1500 bytes, {bw}, DLY 10 usec,',
  '     {rel}, {load}',
  '  Encapsulation ARPA, loopback not set',
  '  Keepalive set (10 sec)',
  '  {duplex}, media type is 10/100/1000BaseTX',
  '  input flow-control is off, output flow-control is unsupported',
  '  Last input 00:00:01, output 00:00:00, output hang never',
  '  {clear}',
  '  Input queue: 0/75/0/0 (size/max/drops/flushes); {outdrops}',
  '  Queueing strategy: fifo',
  '  Output queue: 0/40 (size/max)',
  '  5 minute input rate 412000 bits/sec, 61 packets/sec',
  '  5 minute output rate 655000 bits/sec, 83 packets/sec',
  '     1843920 packets input, 512339871 bytes, {nobuf}',
  '     {bcast}',
  '     {runts}, {giants}, 0 throttles',
  '     {inerr}, {crc}, {frame}, {overrun}, {ignored}',
  '     0 watchdog, 8120 multicast, 0 pause input',
  '     0 input packets with dribble condition detected',
  '     2210345 packets output, 1903345110 bytes, {underruns}',
  '     {outerr}, {coll}, {resets}',
  '     0 unknown protocol drops',
  '     {babbles}, {late}, {deferred}',
  '     {lostc}, 0 no carrier, 0 pause output',
  '     0 output buffer failures, 0 output buffers swapped out',
];
function tokenText(k: K, v: V): string {
  switch (k) {
    case 'status': return 'is up, line protocol is up (connected)';
    case 'bw': return `BW ${v.bw} Kbit/sec`;
    case 'rel': return `reliability ${v.rel}`;
    case 'load': return `txload ${v.tx}/255, rxload ${v.rx}/255`;
    case 'duplex': return v.duplex;
    case 'clear': return 'Last clearing of "show interface" counters 00:12:40';
    case 'outdrops': return `Total output drops: ${v.outdrops}`;
    case 'nobuf': return `${v.nobuf} no buffer`;
    case 'bcast': return `Received ${v.bcast} broadcasts (8120 multicasts)`;
    case 'inerr': return `${v.inerr} input errors`;
    case 'outerr': return `${v.outerr} output errors`;
    case 'coll': return `${v.coll} collisions`;
    case 'resets': return `${v.resets} interface resets`;
    case 'late': return `${v.late} late collision`;
    case 'lostc': return `${v.lostc} lost carrier`;
    default: return `${v[k as keyof V]} ${k === 'crc' ? 'CRC' : INFO[k].name}`;
  }
}
const isBad = (k: K, v: V) => (ERR_KEYS.includes(k) && Number(v[k as keyof V]) > 0)
  || (k === 'duplex' && v.duplex.startsWith('Half')) || (k === 'rel' && v.rel !== '255/255') || (k === 'load' && v.tx > 200)
  || (k === 'bw' && v.bw < 1000000) || (k === 'bcast' && v.bcast > 1e6);

export function ShowInterfacesExplorer() {
  const [scn, setScn] = useState<Scn>('half');
  const [sel, setSel] = useState<K>('late');
  const v = SCN[scn].v;
  const info = INFO[sel];
  const b = BUCKET[info.bucket];
  return (
    <>
      <Wrap>
        <span className="small muted">Scenariu:</span>
        {(Object.keys(SCN) as Scn[]).map((k) => (
          <button key={k} type="button" className={`btn sm ${k === scn ? 'primary' : ''}`} onClick={() => setScn(k)}>{SCN[k].label}</button>
        ))}
      </Wrap>
      <pre style={{ ...preStyle, marginTop: 12 }} aria-label="Output show interfaces, cu contoare care se pot selecta">
        {LINES.map((line, i) => (
          <div key={i}>
            {line.split(/(\{\w+\})/).map((part, j) => {
              const m = part.match(/^\{(\w+)\}$/);
              if (!m) return <span key={j} style={i === 0 ? { color: 'var(--accent)' } : undefined}>{part}</span>;
              const k = m[1] as K; const bad = isBad(k, v); const on = sel === k;
              return (
                <span key={j} role="button" tabIndex={0} onClick={() => setSel(k)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(k); } }}
                  style={{ cursor: 'pointer', borderRadius: 4, padding: '0 2px', textDecoration: 'underline dotted', textUnderlineOffset: 3,
                    color: bad ? 'var(--bad)' : 'var(--text)', fontWeight: bad ? 700 : 500,
                    background: on ? 'var(--accent-soft)' : 'transparent', outline: on ? '1px solid var(--accent)' : 'none' }}>
                  {tokenText(k, v)}
                </span>
              );
            })}
          </div>
        ))}
      </pre>
      <div style={panel}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <b className="mono">{info.name}</b>
          <span className="badge" style={{ color: b.c, borderColor: b.c }}>{b.t}</span>
          <span className="small muted">valoare în scenariul curent: <b className="mono" style={{ color: isBad(sel, v) ? 'var(--bad)' : 'var(--text)' }}>{tokenText(sel, v)}</b></span>
        </div>
        <p className="small" style={{ margin: '4px 0' }}><b>Ce înseamnă (definiția Cisco):</b> {info.def}</p>
        <p className="small" style={{ margin: '4px 0 0' }}><b>Cauza probabilă când crește:</b> {info.cause}</p>
      </div>
      <div style={{ ...panel, borderColor: 'var(--accent-line)', background: 'var(--accent-soft)' }}>
        <b>Diagnostic pentru „{SCN[scn].label}”:</b> <span className="small">{SCN[scn].diag}</span>
      </div>
    </>
  );
}

/* =====================================================================
   3) Fereastra de 512 biți — coliziune normală vs late collision
   ===================================================================== */
export function LateCollisionSlider() {
  const [at, setAt] = useState(40);
  const [rate, setRate] = useState<10 | 100>(10);
  const W = 760, x0 = 40, x1 = 720, len = 1518;
  const fx = (b: number) => x0 + (b / len) * (x1 - x0);
  const late = at > 64;
  const bits = at * 8;
  const us = bits / rate;
  return (
    <>
      <svg viewBox={`0 0 ${W} 190`} role="img" aria-label="Momentul coliziunii față de primii 64 de octeți ai cadrului">
        <T x={x0} y={24} anchor="start" size={12} color="var(--muted)">un cadru Ethernet de 1518 octeți, transmis de la stânga la dreapta</T>
        <rect x={x0} y={40} width={x1 - x0} height={46} rx={6} fill="var(--surface-3)" stroke="var(--border)" />
        <rect x={x0} y={40} width={fx(64) - x0} height={46} rx={6} fill="var(--ok-soft)" stroke="var(--ok)" />
        <rect x={fx(64)} y={40} width={fx(at) - fx(64) > 0 ? fx(at) - fx(64) : 0} height={46} fill="var(--bad-soft)" />
        <rect x={x0} y={40} width={Math.max(2, fx(Math.min(at, 64)) - x0)} height={46} rx={6} fill="var(--ok)" fillOpacity={0.35} />
        <line x1={fx(64)} x2={fx(64)} y1={32} y2={96} stroke="var(--ok)" strokeWidth={2} strokeDasharray="4 3" />
        <T x={fx(64) + 6} y={110} anchor="start" size={11} color="var(--ok)">64 octeți = 512 biți (slot time)</T>
        <line x1={fx(at)} x2={fx(at)} y1={30} y2={96} stroke={late ? 'var(--bad)' : 'var(--warn)'} strokeWidth={3} />
        <path d={`M${fx(at) - 9} 22 l9 10 l9 -10 z`} fill={late ? 'var(--bad)' : 'var(--warn)'} />
        <T x={Math.min(Math.max(fx(at), 120), 640)} y={136} size={13} weight={700} color={late ? 'var(--bad)' : 'var(--warn)'}>
          {late ? 'LATE COLLISION' : 'coliziune normală (în fereastră)'} — după {at} octeți = {bits} biți ≈ {us < 10 ? us.toFixed(2) : us.toFixed(1)} µs la {rate} Mb/s
        </T>
        <T x={W / 2} y={166} size={11.5} color="var(--text-2)">
          {late ? 'Prea târziu: emițătorul a trecut de fereastră. NIC-ul de regulă nu mai retransmite → pierderea o repară TCP, încet.'
            : 'În fereastră: CSMA/CD trimite jam, așteaptă backoff aleatoriu și retransmite automat. Contor: collisions.'}
        </T>
        <T x={x0} y={186} anchor="start" size={10} color="var(--muted)">0</T>
        <T x={x1} y={186} anchor="end" size={10} color="var(--muted)">1518 octeți</T>
      </svg>
      <div className="controls">
        <label className="small" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 260px' }}>
          momentul coliziunii
          <input type="range" min={1} max={1518} value={at} onChange={(e) => setAt(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--accent)' }} />
        </label>
        <div className="segmented" role="group" aria-label="Viteza">
          {([10, 100] as const).map((r) => <button key={r} type="button" className={rate === r ? 'on' : ''} onClick={() => setRate(r)}>{r} Mb/s</button>)}
        </div>
        <button type="button" className="btn sm" onClick={() => setAt(30)}>devreme</button>
        <button type="button" className="btn sm" onClick={() => setAt(700)}>târziu</button>
      </div>
    </>
  );
}

/* =====================================================================
   4) Mecanismul duplex mismatch, pas cu pas
   ===================================================================== */
const MM_STEPS: { t: string; d: ReactNode }[] = [
  { t: '1. PC (half) începe să transmită', d: <>PC-ul e pe <b>half-duplex</b>: a ascultat, firul părea liber, așa că trimite un cadru lung spre switch.</> },
  { t: '2. Switch-ul (full) transmite și el', d: <>Switch-ul e pe <b>full-duplex</b>: nu ascultă înainte să vorbească (nu are de ce — în full-duplex nu există coliziuni). Trimite imediat un cadru spre PC, pe perechea lui de fire.</> },
  { t: '3. PC-ul crede că e coliziune', d: <>Un dispozitiv half consideră că orice semnal primit <i>în timp ce transmite</i> înseamnă coliziune. Se oprește, trimite jam și va retransmite mai târziu. Dacă se întâmplă după primii 64 de octeți → <b>late collision</b>. Contoare pe PC: <b>collisions</b>, <b>late collision</b>.</> },
  { t: '4. Switch-ul primește un fragment', d: <>Cadrul PC-ului s-a oprit brusc la jumătate. Switch-ul primește o bucată de cadru cu FCS greșit: <b>CRC</b>; dacă bucata are sub 64 de octeți → <b>runt</b>. Coliziuni pe switch: <b>0</b> (un port full nu numără coliziuni).</> },
  { t: '5. Rezultatul', d: <>Ping-ul merge (pachetele mici trec de multe ori), dar orice transfer mare se „împiedică” la fiecare cadru: retransmisii, TCP încetinește. Link-ul rămâne <b>up/up</b>, de aceea problema e greu de observat fără contoare sau fără mesajul CDP.</> },
];
export function MismatchMechanism() {
  const [s, setS] = useState(0);
  const pcTx = s >= 0; const swTx = s >= 1; const abort = s >= 2;
  const fragEnd = abort ? 400 : 560;
  return (
    <>
      <svg viewBox="0 0 760 230" role="img" aria-label="Mecanismul duplex mismatch">
        <ClientIcon x={70} y={112} kind="pc" label="PC — half (auto → a-half)" />
        <SwitchIcon x={690} y={112} label="SW1 — full (fix 100/full)" />
        <T x={380} y={40} size={11} color="var(--muted)">perechea PC → SW (TX al PC-ului)</T>
        <line x1={110} x2={650} y1={66} y2={66} stroke="var(--border-strong)" strokeWidth={6} strokeLinecap="round" />
        <T x={380} y={192} size={11} color="var(--muted)">perechea SW → PC (TX al switch-ului)</T>
        <line x1={110} x2={650} y1={160} y2={160} stroke="var(--border-strong)" strokeWidth={6} strokeLinecap="round" />
        {pcTx && <rect x={abort ? 330 : 140} y={56} width={abort ? fragEnd - 330 : 420} height={20} rx={5} fill={abort ? 'var(--bad-soft)' : 'var(--info-soft)'} stroke={abort ? 'var(--bad)' : 'var(--info)'} style={{ transition: 'all .4s' }} />}
        {pcTx && <T x={abort ? 365 : 350} y={70} size={11} weight={650} color={abort ? 'var(--bad)' : 'var(--info)'}>{abort ? 'fragment → CRC / runt' : 'cadru de la PC →'}</T>}
        {swTx && <rect x={s >= 2 ? 160 : 330} y={150} width={300} height={20} rx={5} fill="var(--ok-soft)" stroke="var(--ok)" style={{ transition: 'all .4s' }} />}
        {swTx && <T x={s >= 2 ? 310 : 480} y={164} size={11} weight={650} color="var(--ok)">← cadru de la switch</T>}
        {abort && <>
          <path d="M150 90 l10 -14 l6 10 l10 -16" stroke="var(--warn)" strokeWidth={3} fill="none" />
          <T x={190} y={104} anchor="start" size={12} weight={700} color="var(--warn)">„coliziune!” → jam, oprire (late collision)</T>
        </>}
        {s >= 3 && <T x={640} y={104} anchor="end" size={12} weight={700} color="var(--bad)">FCS greșit: CRC ↑ · runts ↑ · collisions = 0</T>}
        {s >= 4 && <T x={380} y={222} size={12.5} weight={700} color="var(--text)">up/up · ping OK · transferurile mari — foarte lente</T>}
      </svg>
      <div style={panel}><b>{MM_STEPS[s].t}</b><div className="small" style={{ marginTop: 4 }}>{MM_STEPS[s].d}</div></div>
      <div className="controls">
        <button type="button" className="btn sm" disabled={s === 0} onClick={() => setS(s - 1)}>← Înapoi</button>
        <button type="button" className="btn sm primary" disabled={s === MM_STEPS.length - 1} onClick={() => setS(s + 1)}>Pasul următor →</button>
        <button type="button" className="btn sm ghost" onClick={() => setS(0)}>reia</button>
        <span className="small muted">pas {s + 1} / {MM_STEPS.length}</span>
      </div>
    </>
  );
}

/* =====================================================================
   5) Simulator de negociere: configurezi cele două capete, vezi rezultatul
   ===================================================================== */
type Cfg = 'auto' | '1000/full' | '100/full' | '100/half' | '10/full' | '10/half';
const CFGS: Cfg[] = ['auto', '1000/full', '100/full', '100/half', '10/full', '10/half'];
type Side = { speed: number; duplex: 'full' | 'half'; auto: boolean };
type Res = { kind: 'ok' | 'okhalf' | 'mismatch' | 'down'; a?: Side; b?: Side; note: ReactNode };
const parse = (c: Cfg) => (c === 'auto' ? null : { speed: Number(c.split('/')[0]), duplex: c.split('/')[1] as 'full' | 'half' });
function negotiate(ca: Cfg, cb: Cfg): Res {
  const a = parse(ca), b = parse(cb);
  if (!a && !b) return { kind: 'ok', a: { speed: 1000, duplex: 'full', auto: true }, b: { speed: 1000, duplex: 'full', auto: true }, note: <>Ambele negociază (FLP) și aleg cea mai bună valoare comună: <b>1000 Mb/s full-duplex</b>. Recomandarea Cisco.</> };
  if (!a || !b) {
    const fixed = (a ?? b)!; const autoLeft = !a;
    let autoSide: Side; let note: ReactNode; let kind: Res['kind'];
    if (fixed.speed === 1000) {
      autoSide = { speed: 1000, duplex: 'full', auto: true }; kind = 'ok';
      note = <>La 1000BASE-T negocierea face parte din standard, iar Cisco nu suportă half-duplex la 1 Gb/s. Partea „fixă” anunță doar 1000/full, iar partea auto ajunge tot pe <b>1000/full</b>. Funcționează (dar e mai curat să lași auto pe ambele).</>;
    } else {
      autoSide = { speed: fixed.speed, duplex: 'half', auto: true };
      kind = fixed.duplex === 'full' ? 'mismatch' : 'okhalf';
      note = fixed.duplex === 'full'
        ? <>Partea fixă nu mai trimite impulsuri de negociere. Partea auto recunoaște viteza din semnal (<b>parallel detection</b> → {fixed.speed}), dar <b>nu poate afla duplexul</b> și presupune <b>half</b>. Rezultat: <b>duplex mismatch</b> — capcana clasică de examen.</>
        : <>Partea auto detectează {fixed.speed} Mb/s și presupune half — din întâmplare exact ce are și partea fixă. Link-ul funcționează, dar <b>half-duplex</b>: coliziunile (nu cele târzii) sunt normale aici.</>;
    }
    const fixedSide: Side = { ...fixed, auto: false };
    return autoLeft ? { kind, a: autoSide, b: fixedSide, note } : { kind, a: fixedSide, b: autoSide, note };
  }
  if (a.speed !== b.speed) return { kind: 'down', note: <>Viteze fixate diferit ({a.speed} vs {b.speed} Mb/s): codările semnalului diferă, capetele nu se înțeleg deloc → <b>speed mismatch</b>, link <b>down/down (notconnect)</b> pe ambele părți.</> };
  if (a.duplex !== b.duplex) return { kind: 'mismatch', a: { ...a, auto: false }, b: { ...b, auto: false }, note: <>Aceeași viteză, duplex diferit (fixat manual) → <b>duplex mismatch</b>. Link-ul se ridică (up/up), dar performanța e slabă.</> };
  return { kind: a.duplex === 'full' ? 'ok' : 'okhalf', a: { ...a, auto: false }, b: { ...b, auto: false }, note: a.duplex === 'full' ? <>Ambele capete fixate identic: funcționează. Dezavantaj: dacă cineva schimbă un singur capăt, apare mismatch.</> : <>Ambele fixate pe half: funcționează, dar half-duplex (coliziuni normale, performanță mai mică). Nu are sens pe un link switch-uit.</> };
}
const fmt = (s: Side) => `${s.auto ? 'a-' : ''}${s.duplex}  ${s.auto ? 'a-' : ''}${s.speed}`;
const symptoms = (s: Side, r: Res): string[] => {
  if (r.kind === 'down') return ['down/down (notconnect)', 'niciun trafic'];
  if (r.kind === 'mismatch') return s.duplex === 'half' ? ['up/up', 'collisions ↑', 'late collision ↑', 'deferred ↑'] : ['up/up', 'CRC / FCS ↑', 'runts ↑', 'collisions = 0'];
  if (r.kind === 'okhalf') return ['up/up', 'half-duplex', 'coliziuni normale posibile'];
  return ['up/up', 'contoare curate'];
};
export function DuplexNegotiationLab() {
  const [ca, setCa] = useState<Cfg>('100/full');
  const [cb, setCb] = useState<Cfg>('auto');
  const r = negotiate(ca, cb);
  const col = r.kind === 'ok' ? 'var(--ok)' : r.kind === 'okhalf' ? 'var(--info)' : r.kind === 'mismatch' ? 'var(--warn)' : 'var(--bad)';
  const verdict = r.kind === 'ok' ? 'FUNCȚIONEAZĂ CORECT' : r.kind === 'okhalf' ? 'FUNCȚIONEAZĂ (half-duplex)' : r.kind === 'mismatch' ? 'DUPLEX MISMATCH' : 'LINK DOWN — SPEED MISMATCH';
  const sideBox = (x: number, s: Side | undefined, anchor: 'start' | 'end') => (
    <g>
      <T x={x} y={150} anchor={anchor} size={12} m color="var(--text)">{s ? fmt(s) : 'auto?  auto?'}</T>
      {(s ? symptoms(s, r) : symptoms({ speed: 0, duplex: 'full', auto: false }, r)).map((t, i) => (
        <T key={i} x={x} y={172 + i * 17} anchor={anchor} size={11.5} color={/↑/.test(t) || /down/.test(t) ? 'var(--bad)' : 'var(--text-2)'}>{t}</T>
      ))}
    </g>
  );
  const sel = (v: Cfg, set: (c: Cfg) => void, label: string) => (
    <label className="small" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{label}
      <select value={v} onChange={(e) => set(e.target.value as Cfg)} style={{ font: 'inherit', padding: '5px 8px', borderRadius: 8, background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-strong)' }}>
        {CFGS.map((c) => <option key={c} value={c}>{c === 'auto' ? 'speed auto / duplex auto' : `speed ${c.split('/')[0]} / duplex ${c.split('/')[1]}`}</option>)}
      </select>
    </label>
  );
  return (
    <>
      <div className="controls" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        {sel(ca, setCa, 'SW1 Gi0/1:')}
        {sel(cb, setCb, 'Capătul B:')}
      </div>
      <svg viewBox="0 0 760 250" role="img" aria-label="Rezultatul negocierii speed/duplex">
        <SwitchIcon x={110} y={70} label="SW1 Gi0/1" />
        <ClientIcon x={650} y={70} kind="pc" label="capătul B" />
        <line x1={150} x2={620} y1={70} y2={70} stroke={col} strokeWidth={4} strokeDasharray={r.kind === 'down' ? '8 8' : undefined} />
        {r.kind === 'down' && <path d="M370 55 l20 30 M390 55 l-20 30" stroke="var(--bad)" strokeWidth={4} />}
        <rect x={250} y={88} width={260} height={28} rx={14} fill="var(--surface-3)" stroke={col} />
        <T x={380} y={107} size={12.5} weight={750} color={col}>{verdict}</T>
        <T x={40} y={132} anchor="start" size={10.5} color="var(--muted)">show interfaces status (Duplex / Speed) și simptome:</T>
        {sideBox(40, r.a, 'start')}
        {sideBox(720, r.b, 'end')}
        {r.kind === 'mismatch' && <T x={380} y={240} size={11} m color="var(--warn)">%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on …</T>}
      </svg>
      <div style={panel} className="small">{r.note}</div>
      <div className="controls">
        <span className="small muted">Încearcă:</span>
        <button type="button" className="btn sm" onClick={() => { setCa('auto'); setCb('auto'); }}>auto ↔ auto</button>
        <button type="button" className="btn sm" onClick={() => { setCa('100/full'); setCb('auto'); }}>100/full ↔ auto</button>
        <button type="button" className="btn sm" onClick={() => { setCa('100/full'); setCb('100/half'); }}>100/full ↔ 100/half</button>
        <button type="button" className="btn sm" onClick={() => { setCa('100/full'); setCb('10/full'); }}>100 ↔ 10</button>
        <button type="button" className="btn sm" onClick={() => { setCa('1000/full'); setCb('auto'); }}>1000/full ↔ auto</button>
      </div>
    </>
  );
}

/* =====================================================================
   6) Defecte de cablu — patru tablouri
   ===================================================================== */
export function CableFaults() {
  const box = (x: number, title: string, sub: string, children: ReactNode) => (
    <g>
      <rect x={x} y={8} width={176} height={214} rx={12} fill="var(--surface-2)" stroke="var(--border)" />
      <T x={x + 88} y={32} size={12.5} weight={700}>{title}</T>
      {children}
      <T x={x + 88} y={208} size={10.5} color="var(--muted)">{sub}</T>
    </g>
  );
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label="Patru tipuri de defecte de cablu">
      {box(6, 'Cablu prea lung', 'CRC · late collisions · link instabil', <>
        <rect x={20} y={70} width={28} height={22} rx={4} fill="var(--surface-3)" stroke="var(--info)" />
        <rect x={134} y={70} width={28} height={22} rx={4} fill="var(--surface-3)" stroke="var(--info)" />
        <path d="M48 81 C 70 40, 90 125, 112 70 S 130 90, 134 81" fill="none" stroke="var(--text-2)" strokeWidth={2.5} />
        <line x1={20} x2={162} y1={120} y2={120} stroke="var(--bad)" strokeWidth={1.5} />
        <T x={94} y={140} size={13} weight={700} color="var(--bad)">130 m</T>
        <T x={94} y={160} size={10.5} color="var(--text-2)">limita UTP: 100 m</T>
        <T x={94} y={176} size={10.5} color="var(--text-2)">(90 m fix + 10 m patch)</T>
      </>)}
      {box(196, 'Sertizare proastă', 'CRC · frame · viteză mai mică', <>
        <rect x={238} y={52} width={92} height={60} rx={6} fill="var(--surface-3)" stroke="var(--text-2)" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={246 + i * 10.5} x2={246 + i * 10.5} y1={58} y2={i === 5 ? 80 : 104} stroke={i === 5 ? 'var(--bad)' : 'var(--accent)'} strokeWidth={2.5} />)}
        <path d="M250 112 C 255 135, 270 128, 268 150 M280 112 C 290 140, 300 125, 296 150 M310 112 C 312 130, 320 140, 316 150" stroke="var(--warn)" strokeWidth={2} fill="none" />
        <T x={284} y={170} size={10.5} color="var(--text-2)">perechi desfăcute prea mult,</T>
        <T x={284} y={185} size={10.5} color="var(--text-2)">un fir care nu atinge pinul</T>
      </>)}
      {box(386, 'Interferențe (EMI)', 'CRC fără coliziuni', <>
        <line x1={400} x2={548} y1={130} y2={130} stroke="var(--text-2)" strokeWidth={3} />
        <rect x={440} y={58} width={64} height={34} rx={6} fill="var(--warn-soft)" stroke="var(--warn)" />
        <T x={472} y={80} size={11} weight={650} color="var(--warn)">motor / 230 V</T>
        {[0, 1, 2].map((i) => <path key={i} d={`M${452 + i * 14} 98 q 6 8 0 16 q -6 8 0 16`} fill="none" stroke="var(--warn)" strokeWidth={1.6} />)}
        <T x={474} y={160} size={10.5} color="var(--text-2)">UTP lângă cabluri de forță,</T>
        <T x={474} y={175} size={10.5} color="var(--text-2)">motoare, balasturi → STP/fibră</T>
      </>)}
      {box(576, 'Cablu greșit', 'down/down (fără Auto-MDIX)', <>
        <T x={620} y={60} size={10.5} color="var(--muted)">SW1</T><T x={710} y={60} size={10.5} color="var(--muted)">SW2</T>
        <T x={604} y={84} anchor="start" size={10.5} m>TX</T><T x={604} y={118} anchor="start" size={10.5} m>RX</T>
        <T x={728} y={84} anchor="end" size={10.5} m>TX</T><T x={728} y={118} anchor="end" size={10.5} m>RX</T>
        <line x1={626} x2={704} y1={80} y2={80} stroke="var(--bad)" strokeWidth={2.5} />
        <line x1={626} x2={704} y1={114} y2={114} stroke="var(--bad)" strokeWidth={2.5} />
        <T x={665} y={144} size={10.5} color="var(--text-2)">straight-through între</T>
        <T x={665} y={159} size={10.5} color="var(--text-2)">două switch-uri: TX→TX</T>
        <T x={665} y={176} size={10.5} color="var(--text-2)">→ trebuie crossover</T>
      </>)}
    </svg>
  );
}

/* =====================================================================
   7) Flowchart de troubleshooting — click pe noduri sau Da/Nu
   ===================================================================== */
type Node = { id: string; q: string; yes: string; no: string; leafOn: 'yes' | 'no' };
type Leaf = { id: string; t: string; d: ReactNode; tone: string };
const FLOW: Node[] = [
  { id: 'q1', q: 'administratively down / disabled?', yes: 'l1', no: 'q2', leafOn: 'yes' },
  { id: 'q2', q: 'err-disabled?', yes: 'l2', no: 'q3', leafOn: 'yes' },
  { id: 'q3', q: 'down / down (notconnect)?', yes: 'l3', no: 'q4', leafOn: 'yes' },
  { id: 'q4', q: 'up / down?', yes: 'l4', no: 'q5', leafOn: 'yes' },
  { id: 'q5', q: 'up/up — cresc contoarele de erori?', yes: 'q6', no: 'l5', leafOn: 'no' },
  { id: 'q6', q: 'collisions / late pe port full sau duplex diferit?', yes: 'l6', no: 'q7', leafOn: 'yes' },
  { id: 'q7', q: 'CRC / frame fără coliziuni?', yes: 'l7', no: 'q8', leafOn: 'yes' },
  { id: 'q8', q: 'output drops / ignored / overrun?', yes: 'l8', no: 'l9', leafOn: 'yes' },
];
const LEAVES: Record<string, Leaf> = {
  l1: { id: 'l1', t: 'no shutdown', tone: 'var(--muted)', d: <>Interfața a fost oprită manual. <code>interface …</code> → <code>no shutdown</code>.</> },
  l2: { id: 'l2', t: 'cauza → shut / no shut', tone: 'var(--bad)', d: <><code>show interfaces status err-disabled</code> + <code>show logging</code> → repari cauza (port security, BPDU Guard…) → <code>shutdown</code> / <code>no shutdown</code>.</> },
  l3: { id: 'l3', t: 'verifică nivelul 1', tone: 'var(--bad)', d: <>Cablu conectat și întreg? tip corect (straight/crossover/fibră)? sub 100 m? capătul celălalt pornit și nu e shutdown? aceeași viteză (speed mismatch)? SFP potrivit?</> },
  l4: { id: 'l4', t: 'verifică nivelul 2', tone: 'var(--warn)', d: <>Serial: aceeași encapsulare (HDLC/PPP), <code>clock rate</code> pe DCE, keepalive, autentificare PPP.</> },
  l5: { id: 'l5', t: 'urcă la L3+', tone: 'var(--ok)', d: <>L1/L2 sunt curate. Verifică IP/mască/gateway (1.6, 1.10), VLAN-ul portului (2.1), routing (3.x).</> },
  l6: { id: 'l6', t: 'duplex mismatch', tone: 'var(--warn)', d: <>Pune <code>speed auto</code> + <code>duplex auto</code> pe ambele capete (sau aceleași valori fixe pe ambele). Confirmă cu <code>show interfaces status</code> și <code>show cdp neighbors detail</code>.</> },
  l7: { id: 'l7', t: 'cablu / EMI / port', tone: 'var(--bad)', d: <>Înlocuiește patch cord-ul, verifică lungimea și traseul (EMI), mută pe alt port, testează cu TDR. Apoi <code>clear counters</code> și urmărește.</> },
  l8: { id: 'l8', t: 'congestie / buclă', tone: 'var(--violet)', d: <>Nu e cablul: capacitate insuficientă (link mai rapid, EtherChannel, QoS) sau o furtună de broadcast (verifică STP).</> },
  l9: { id: 'l9', t: 'monitorizează', tone: 'var(--info)', d: <>Contoare vechi, care nu mai cresc. <code>clear counters</code> și reverifică peste câteva minute / ore.</> },
};
export function TroubleshootFlow() {
  const [cur, setCur] = useState<string>('q1');
  const [path, setPath] = useState<string[]>(['q1']);
  const go = (to: string) => { setCur(to); setPath((p) => [...p, to]); };
  const reset = () => { setCur('q1'); setPath(['q1']); };
  const node = FLOW.find((n) => n.id === cur);
  const leaf = LEAVES[cur];
  const rowH = 62, top = 58;
  return (
    <>
      <svg viewBox={`0 0 760 ${top + FLOW.length * rowH + 30}`} role="img" aria-label="Flowchart de troubleshooting pentru interfețe">
        <defs><marker id="fa14" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--muted)" /></marker></defs>
        <rect x={110} y={8} width={300} height={34} rx={17} fill="var(--accent-soft)" stroke="var(--accent)" />
        <T x={260} y={30} size={12.5} weight={650}>show ip interface brief / show interfaces status</T>
        {FLOW.map((n, i) => {
          const y = top + i * rowH; const on = path.includes(n.id); const lf = LEAVES[n.leafOn === 'yes' ? n.yes : n.no];
          const leafOn = path.includes(lf.id);
          return (
            <g key={n.id}>
              <line x1={260} x2={260} y1={y - 16} y2={y} stroke="var(--muted)" markerEnd="url(#fa14)" />
              {i > 0 && <T x={268} y={y - 4} anchor="start" size={10} color="var(--muted)">{FLOW[i - 1].leafOn === 'yes' ? 'nu' : 'da'}</T>}
              <g style={{ cursor: 'pointer' }} onClick={() => go(n.id)}>
                <rect x={60} y={y} width={400} height={36} rx={8} fill={cur === n.id ? 'var(--accent-soft)' : 'var(--surface-2)'} stroke={on ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth={on ? 2 : 1} />
                <T x={260} y={y + 23} size={13} weight={600}>{n.q}</T>
              </g>
              <line x1={460} x2={520} y1={y + 18} y2={y + 18} stroke="var(--muted)" markerEnd="url(#fa14)" />
              <T x={490} y={y + 12} size={10} color="var(--muted)">{n.leafOn === 'yes' ? 'da' : 'nu'}</T>
              <g style={{ cursor: 'pointer' }} onClick={() => go(lf.id)}>
                <rect x={522} y={y + 2} width={228} height={32} rx={16} fill={leafOn ? 'var(--surface-3)' : 'transparent'} stroke={lf.tone} strokeWidth={leafOn ? 2.2 : 1.2} />
                <T x={636} y={y + 23} size={12.5} weight={650} color={lf.tone}>{lf.t}</T>
              </g>
            </g>
          );
        })}
        <T x={260} y={top + FLOW.length * rowH + 4} size={10.5} color="var(--muted)">ultimul „nu” → monitorizează</T>
      </svg>
      <div style={panel}>
        {node ? (
          <>
            <b>{node.q}</b>
            <div className="controls">
              <button type="button" className="btn sm primary" onClick={() => go(node.yes)}>Da</button>
              <button type="button" className="btn sm" onClick={() => go(node.no)}>Nu</button>
              <button type="button" className="btn sm ghost" onClick={reset}>de la început</button>
            </div>
          </>
        ) : leaf ? (
          <>
            <b style={{ color: leaf.tone }}>{leaf.t}</b>
            <div className="small" style={{ marginTop: 4 }}>{leaf.d}</div>
            <div className="controls"><button type="button" className="btn sm" onClick={reset}>alt caz — de la început</button></div>
          </>
        ) : null}
      </div>
    </>
  );
}

/* =====================================================================
   8) Topologiile laburilor
   ===================================================================== */
const Wire = ({ x1, y1, x2, y2, a, b, color = 'var(--text-2)', dash }: { x1: number; y1: number; x2: number; y2: number; a?: string; b?: string; color?: string; dash?: boolean }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} strokeDasharray={dash ? '6 5' : undefined} />
    {a && <T x={x1 + (x2 - x1) * 0.18} y={y1 + (y2 - y1) * 0.18 - 7} size={10} color="var(--muted)" m>{a}</T>}
    {b && <T x={x1 + (x2 - x1) * 0.82} y={y1 + (y2 - y1) * 0.82 - 7} size={10} color="var(--muted)" m>{b}</T>}
  </g>
);
export function LabGuidedTopology14() {
  return (
    <svg viewBox="0 0 760 200" role="img" aria-label="Topologia labului ghidat 1.4">
      <ClientIcon x={60} y={100} kind="pc" label="PC1 .11" />
      <SwitchIcon x={250} y={100} label="SW1 (2960)" />
      <SwitchIcon x={510} y={100} label="SW2 (2960)" />
      <ClientIcon x={700} y={100} kind="pc" label="PC2 .12" />
      <Wire x1={80} y1={100} x2={218} y2={100} a="Fa0" b="Fa0/1" />
      <Wire x1={282} y1={100} x2={478} y2={100} a="Fa0/24" b="Fa0/24" color="var(--accent)" />
      <T x={380} y={84} size={10.5} color="var(--accent)">link-ul pe care îl „stricăm”</T>
      <Wire x1={542} y1={100} x2={680} y2={100} a="Fa0/1" b="Fa0" />
      <T x={380} y={170} size={11} color="var(--muted)">192.168.1.0/24 · toate în VLAN 1 · cablu crossover între switch-uri (straight-through între PC și switch)</T>
    </svg>
  );
}
export function LabSoloTopology14() {
  return (
    <svg viewBox="0 0 760 300" role="img" aria-label="Topologia labului solo 1.4">
      <RouterIcon x={380} y={34} label="" />
      <T x={420} y={38} anchor="start" size={11} color="var(--muted)">R1 (2911) · G0/0 192.168.10.1/24</T>
      <SwitchIcon x={380} y={130} label="" />
      <T x={420} y={134} anchor="start" size={11} color="var(--muted)">SW-CORE (2960)</T>
      <Wire x1={380} y1={48} x2={380} y2={118} a="G0/0" b="Fa0/1" />
      <SwitchIcon x={150} y={210} label="SW-A" />
      <SwitchIcon x={610} y={210} label="SW-B" />
      <Wire x1={348} y1={140} x2={178} y2={200} a="Gi0/1" b="Gi0/1" />
      <Wire x1={412} y1={140} x2={582} y2={200} a="Fa0/2" b="Fa0/24" />
      <ClientIcon x={150} y={272} kind="pc" label="" />
      <T x={178} y={282} anchor="start" size={10.5} color="var(--text-2)">PC-A1 .11</T>
      <Wire x1={150} y1={222} x2={150} y2={258} b="" />
      <T x={140} y={244} anchor="end" size={10} m color="var(--muted)">Fa0/1</T>
      <ClientIcon x={560} y={272} kind="pc" label="" />
      <T x={520} y={282} anchor="end" size={10.5} color="var(--text-2)">PC-B1 .21</T>
      <ClientIcon x={680} y={272} label="" />
      <T x={706} y={282} anchor="start" size={10.5} color="var(--text-2)">PC-B2 .22</T>
      <Wire x1={596} y1={222} x2={566} y2={258} />
      <Wire x1={624} y1={222} x2={674} y2={258} />
      <T x={592} y={246} anchor="end" size={10} m color="var(--muted)">Fa0/1</T>
      <T x={652} y={246} anchor="start" size={10} m color="var(--muted)">Fa0/2</T>
    </svg>
  );
}
