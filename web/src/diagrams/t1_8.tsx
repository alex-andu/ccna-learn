import { useMemo, useState, type ReactNode } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';

/* Diagrame și unelte interactive pentru 1.8 — Configure and verify IPv6 addressing and prefix.
   Culori DOAR prin variabile CSS, ca să meargă în ambele teme. */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
const Wire = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-2)" strokeWidth={2} />
);

/* =====================================================================
   Funcții IPv6 (parsare, expandare, comprimare RFC 5952)
   ===================================================================== */

/** Transformă un text IPv6 în 8 hextete (numere 0–65535) sau null dacă e invalid. */
export function parseV6(input: string): number[] | null {
  const s = input.trim().toLowerCase();
  if (!s || !/^[0-9a-f:]+$/.test(s)) return null;
  const parts = s.split('::');
  if (parts.length > 2) return null;
  const side = (x: string) => (x === '' ? [] : x.split(':'));
  const head = side(parts[0]);
  const tail = parts.length === 2 ? side(parts[1]) : [];
  const all = [...head, ...tail];
  if (all.some((h) => !/^[0-9a-f]{1,4}$/.test(h))) return null;
  const toN = (h: string) => parseInt(h, 16);
  if (parts.length === 1) return head.length === 8 ? head.map(toN) : null;
  const fill = 8 - all.length;
  if (fill < 1) return null;
  return [...head.map(toN), ...Array<number>(fill).fill(0), ...tail.map(toN)];
}

/** Cea mai lungă secvență de hextete 0 (prima, la egalitate). */
function longestZeroRun(h: number[]): { start: number; len: number } {
  let start = -1, len = 0;
  for (let i = 0; i < 8;) {
    if (h[i] === 0) {
      let j = i;
      while (j < 8 && h[j] === 0) j++;
      if (j - i > len) { len = j - i; start = i; }
      i = j;
    } else i++;
  }
  return { start, len };
}

/** Forma canonică RFC 5952: litere mici, fără zerouri de început, `::` pe cea mai lungă secvență (≥ 2 hextete). */
export function compressV6(h: number[]): string {
  const hx = h.map((x) => x.toString(16));
  const { start, len } = longestZeroRun(h);
  if (len < 2) return hx.join(':');
  return hx.slice(0, start).join(':') + '::' + hx.slice(start + len).join(':');
}

/** Forma completă: 8 hextete × 4 cifre. */
export const fullV6 = (h: number[]) => h.map((x) => x.toString(16).padStart(4, '0')).join(':');

function whyInvalid(raw: string): string {
  const s = raw.trim();
  if (!s) return 'Nu ai scris nimic.';
  if (/[^0-9a-fA-F:]/.test(s)) return 'Conține caractere care nu sunt hexazecimale. Sunt permise doar 0–9, a–f și „:”.';
  if (s.split('::').length > 2) return '`::` apare de mai multe ori. Destinatarul n-ar ști câte hextete de zero ascunde fiecare — adresa ar fi ambiguă.';
  const groups = s.split(/::?/).filter(Boolean);
  if (groups.some((g) => g.length > 4)) return 'Un hextet are mai mult de 4 cifre hexa (maximum 16 biți = 4 cifre).';
  if (/:::/.test(s) || /^:[^:]/.test(s) || /[^:]:$/.test(s)) return 'Un „:” simplu la început/sfârșit sau „:::” nu sunt permise.';
  return 'Numărul de hextete nu dă 128 de biți: trebuie exact 8 hextete, sau mai puține plus `::` (care înlocuiește cel puțin un hextet).';
}

/** Motivele pentru care o formă validă și echivalentă nu este canonică (RFC 5952). */
function nonCanonicalReasons(raw: string, h: number[]): string[] {
  const s = raw.trim();
  const r: string[] = [];
  const groups = s.replace('::', ':X:').split(':').filter((g) => g !== '');
  if (groups.some((g) => g !== 'X' && g.length > 1 && g.startsWith('0'))) r.push('au rămas zerouri de început într-un hextet (RFC 5952 §4.1: trebuie eliminate).');
  const { start, len } = longestZeroRun(h);
  const has = s.includes('::');
  if (len >= 2 && !has) r.push('există o secvență de hextete 0 care trebuia înlocuită cu `::` (§4.2.1: `::` se folosește la capacitate maximă).');
  if (has) {
    const before = s.split('::')[0];
    const idx = before === '' ? 0 : before.split(':').length;
    const after = s.split('::')[1];
    const covered = 8 - (before === '' ? 0 : before.split(':').length) - (after === '' ? 0 : after.split(':').length);
    if (covered === 1) r.push('`::` înlocuiește un singur hextet 0 — RFC 5952 §4.2.2 interzice asta în forma canonică (scrie `0`).');
    else if (len >= 2 && (idx !== start || covered !== len)) r.push(`\`::\` nu acoperă cea mai lungă secvență de zerouri${len >= 2 ? ' (sau, la egalitate, pe prima)' : ''} — §4.2.3.`);
    if (len >= 2 && covered < len && idx === start) r.push('`::` nu acoperă toate zerourile consecutive din secvență.');
  }
  return [...new Set(r)];
}

/* =====================================================================
   1) Antetul IPv6 vs IPv4 — interactiv (click pe câmp)
   ===================================================================== */
type Fld = { id: string; name: string; row: number; from: number; to: number; rows?: number; status: 'kept' | 'renamed' | 'removed' | 'new' | 'variable'; bits: string; text: string; eq: string };
const V6: Fld[] = [
  { id: 'ver', name: 'Version', row: 0, from: 0, to: 4, status: 'kept', bits: '4 biți', text: 'Valoarea 6 (binar 0110). Primul lucru pe care îl citește un echipament ca să știe cum să interpreteze restul antetului.', eq: 'IPv4: Version (valoarea 4).' },
  { id: 'tc', name: 'Traffic Class', row: 0, from: 4, to: 12, status: 'renamed', bits: '8 biți', text: 'Marcaj de calitate a serviciului (QoS): primii 6 biți = DSCP, ultimii 2 = ECN. Permite routerelor să trateze prioritar vocea sau video.', eq: 'IPv4: Type of Service / DSCP + ECN — același rol (topic 4.7).' },
  { id: 'fl', name: 'Flow Label', row: 0, from: 12, to: 32, status: 'new', bits: '20 biți', text: 'Câmp NOU. Sursa poate eticheta pachetele care aparțin aceluiași „flux” (de exemplu o convorbire), ca routerele să le trateze la fel fără să se uite în antetul TCP/UDP.', eq: 'IPv4: nu există echivalent.' },
  { id: 'pl', name: 'Payload Length', row: 1, from: 0, to: 16, status: 'renamed', bits: '16 biți', text: 'Lungimea datelor DE DUPĂ antetul de bază de 40 de octeți, în octeți (inclusiv eventualele extension headers). Antetul fix nu se mai numără, pentru că are mereu 40 de octeți.', eq: 'IPv4: Total Length (care include și antetul).' },
  { id: 'nh', name: 'Next Header', row: 1, from: 16, to: 24, status: 'renamed', bits: '8 biți', text: 'Spune ce urmează după antet: un protocol de nivel 4 (6 = TCP, 17 = UDP, 58 = ICMPv6) sau un extension header (de exemplu 44 = Fragment). Așa se formează „lanțul” de antete.', eq: 'IPv4: Protocol (aceleași valori pentru TCP/UDP).' },
  { id: 'hl', name: 'Hop Limit', row: 1, from: 24, to: 32, status: 'renamed', bits: '8 biți', text: 'Fiecare router scade valoarea cu 1; la 0 pachetul este aruncat și se trimite un mesaj ICMPv6 Time Exceeded. Previne buclele infinite. Mesajele NDP folosesc mereu 255.', eq: 'IPv4: TTL — redenumit după ce face de fapt (numără hop-uri, nu secunde).' },
  { id: 'src', name: 'Source Address', row: 2, rows: 4, from: 0, to: 32, status: 'kept', bits: '128 biți', text: 'Adresa IPv6 a expeditorului — de patru ori mai lungă decât în IPv4 (de aceea ocupă 4 rânduri de 32 de biți).', eq: 'IPv4: Source Address (32 de biți).' },
  { id: 'dst', name: 'Destination Address', row: 6, rows: 4, from: 0, to: 32, status: 'kept', bits: '128 biți', text: 'Adresa IPv6 a destinatarului (unicast, multicast sau anycast — în IPv6 nu există broadcast).', eq: 'IPv4: Destination Address (32 de biți).' },
];
const V4: Fld[] = [
  { id: 'ver', name: 'Ver', row: 0, from: 0, to: 4, status: 'kept', bits: '4 biți', text: 'Valoarea 4.', eq: 'IPv6: Version (6).' },
  { id: 'ihl', name: 'IHL', row: 0, from: 4, to: 8, status: 'removed', bits: '4 biți', text: 'Internet Header Length: lungimea antetului în cuvinte de 32 de biți (5 = 20 de octeți, maximum 15 = 60 de octeți). Necesar pentru că antetul IPv4 are lungime variabilă (din cauza opțiunilor).', eq: 'IPv6: ELIMINAT — antetul are mereu 40 de octeți.' },
  { id: 'tos', name: 'ToS (DSCP/ECN)', row: 0, from: 8, to: 16, status: 'renamed', bits: '8 biți', text: 'Marcaj QoS.', eq: 'IPv6: Traffic Class.' },
  { id: 'tl', name: 'Total Length', row: 0, from: 16, to: 32, status: 'renamed', bits: '16 biți', text: 'Lungimea întregului pachet (antet + date).', eq: 'IPv6: Payload Length (fără antetul de bază).' },
  { id: 'id', name: 'Identification', row: 1, from: 0, to: 16, status: 'removed', bits: '16 biți', text: 'Identifică fragmentele aceluiași pachet original.', eq: 'IPv6: mutat în Fragment extension header (folosit doar de sursă).' },
  { id: 'fg', name: 'Flags', row: 1, from: 16, to: 19, status: 'removed', bits: '3 biți', text: 'DF (Don’t Fragment), MF (More Fragments).', eq: 'IPv6: mutat în Fragment extension header. Routerele IPv6 nu fragmentează niciodată.' },
  { id: 'fo', name: 'Fragment Offset', row: 1, from: 19, to: 32, status: 'removed', bits: '13 biți', text: 'Poziția fragmentului în pachetul original.', eq: 'IPv6: mutat în Fragment extension header.' },
  { id: 'ttl', name: 'TTL', row: 2, from: 0, to: 8, status: 'renamed', bits: '8 biți', text: 'Time To Live — în practică un contor de hop-uri.', eq: 'IPv6: Hop Limit.' },
  { id: 'pr', name: 'Protocol', row: 2, from: 8, to: 16, status: 'renamed', bits: '8 biți', text: 'Protocolul din interior: 1 ICMP, 6 TCP, 17 UDP.', eq: 'IPv6: Next Header.' },
  { id: 'cs', name: 'Header Checksum', row: 2, from: 16, to: 32, status: 'removed', bits: '16 biți', text: 'Suma de control a antetului — fiecare router trebuie să o recalculeze la fiecare hop, pentru că TTL-ul se schimbă.', eq: 'IPv6: ELIMINAT — erorile sunt prinse de FCS-ul de nivel 2 și de checksum-ul TCP/UDP/ICMPv6 (obligatoriu în IPv6).' },
  { id: 'src', name: 'Source Address (32 biți)', row: 3, from: 0, to: 32, status: 'kept', bits: '32 biți', text: 'Adresa sursă.', eq: 'IPv6: Source Address (128 de biți).' },
  { id: 'dst', name: 'Destination Address (32 biți)', row: 4, from: 0, to: 32, status: 'kept', bits: '32 biți', text: 'Adresa destinație.', eq: 'IPv6: Destination Address (128 de biți).' },
  { id: 'opt', name: 'Options + Padding (variabil, 0–40 octeți)', row: 5, from: 0, to: 32, status: 'removed', bits: '0–320 biți', text: 'Opțiuni rar folosite, care fac antetul variabil și lent de procesat în hardware.', eq: 'IPv6: înlocuite de extension headers, înlănțuite prin Next Header.' },
];
const ST_COLOR: Record<Fld['status'], string> = { kept: 'var(--accent)', renamed: 'var(--info)', removed: 'var(--bad)', new: 'var(--violet)', variable: 'var(--muted)' };
const ST_LABEL: Record<Fld['status'], string> = { kept: 'păstrat', renamed: 'redenumit / ajustat', removed: 'eliminat / mutat', new: 'nou în IPv6', variable: 'variabil' };

export function Ipv6HeaderDiagram() {
  const [v, setV] = useState<6 | 4>(6);
  const [sel, setSel] = useState<string>('hl');
  const fields = v === 6 ? V6 : V4;
  const rowsN = v === 6 ? 10 : 6;
  const x0 = 30, W = 600, rh = 30, y0 = 40, bit = W / 32;
  const cur = fields.find((f) => f.id === sel) ?? fields[0];
  return (
    <>
      <div className="controls" style={{ marginTop: 0, marginBottom: 10 }}>
        <div className="segmented" role="group" aria-label="Versiune antet">
          <button className={v === 6 ? 'on' : ''} onClick={() => { setV(6); setSel('hl'); }}>Antet IPv6 (40 octeți)</button>
          <button className={v === 4 ? 'on' : ''} onClick={() => { setV(4); setSel('cs'); }}>Antet IPv4 (20–60 octeți)</button>
        </div>
        <span className="small muted">Click pe un câmp pentru detalii.</span>
      </div>
      <svg viewBox={`0 0 660 ${y0 + rowsN * rh + 40}`} role="img" aria-label={`Antetul IPv${v}`}>
        {[0, 8, 16, 24, 31].map((b) => <T key={b} x={x0 + b * bit + (b === 31 ? bit : 0)} y={y0 - 10} size={10} color="var(--muted)">{b}</T>)}
        <T x={x0 + W / 2} y={y0 - 24} size={10.5} color="var(--muted)">← 32 de biți pe rând (4 octeți) →</T>
        {fields.map((f) => {
          const x = x0 + f.from * bit, y = y0 + f.row * rh, w = (f.to - f.from) * bit, h = (f.rows ?? 1) * rh;
          const c = ST_COLOR[f.status]; const on = f.id === cur.id;
          return (
            <g key={f.id} style={{ cursor: 'pointer' }} onClick={() => setSel(f.id)} role="button" aria-label={f.name}>
              <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx={4} fill={c} fillOpacity={on ? 0.32 : 0.12} stroke={c} strokeWidth={on ? 2.4 : 1.2} strokeDasharray={f.id === 'opt' ? '5 4' : undefined} />
              <T x={x + w / 2} y={y + h / 2 + 4} size={w < 70 ? 9.5 : 11.5} weight={on ? 700 : 550}>{f.name}</T>
            </g>
          );
        })}
        <g>
          {(['kept', 'renamed', 'removed', 'new'] as const).filter((s) => v === 6 ? s !== 'removed' : s !== 'new').map((s, i) => (
            <g key={s}><rect x={x0 + i * 150} y={y0 + rowsN * rh + 16} width={12} height={12} rx={3} fill={ST_COLOR[s]} fillOpacity={0.5} />
              <T x={x0 + i * 150 + 18} y={y0 + rowsN * rh + 26} size={11} anchor="start" color="var(--text-2)">{ST_LABEL[s]}</T></g>
          ))}
        </g>
      </svg>
      <div className="card" style={{ marginTop: 10, padding: 14 }}>
        <div className="row" style={{ marginBottom: 6 }}><b>{cur.name}</b><span className="badge">{cur.bits}</span><span className="badge" style={{ color: ST_COLOR[cur.status] }}>{ST_LABEL[cur.status]}</span></div>
        <p className="small" style={{ margin: '4px 0' }}>{cur.text}</p>
        <p className="small muted" style={{ margin: 0 }}><b>Corespondent:</b> {cur.eq}</p>
      </div>
    </>
  );
}

/* =====================================================================
   2) 128 de biți: hextete, cifre hexa, biți (click pe hextet)
   ===================================================================== */
export function HextetAnatomy() {
  const h = useMemo(() => parseV6('2001:db8:acad:1::1')!, []);
  const [sel, setSel] = useState(1);
  const x0 = 12, hw = 86, gap = 10;
  const bits = h[sel].toString(2).padStart(16, '0');
  const digits = h[sel].toString(16).padStart(4, '0');
  return (
    <>
      <svg viewBox="0 0 790 230" role="img" aria-label="Structura unei adrese IPv6: 8 hextete, fiecare cu 4 cifre hexa și 16 biți">
        <T x={395} y={18} size={11} color="var(--muted)">2001:0db8:acad:0001:0000:0000:0000:0001 = 8 hextete × 16 biți = 128 de biți</T>
        {h.map((v, i) => {
          const x = x0 + i * (hw + gap); const on = i === sel;
          return (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => setSel(i)}>
              <rect x={x} y={34} width={hw} height={40} rx={7} fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={on ? 'var(--accent)' : 'var(--border)'} strokeWidth={on ? 2 : 1} />
              <T x={x + hw / 2} y={60} size={16} m weight={650} color={on ? 'var(--accent)' : 'var(--text)'}>{v.toString(16).padStart(4, '0')}</T>
              <T x={x + hw / 2} y={90} size={10} color="var(--muted)">hextet {i + 1}</T>
              <T x={x + hw / 2} y={103} size={9.5} color="var(--muted)">biții {i * 16}–{i * 16 + 15}</T>
              {i < 7 && <T x={x + hw + gap / 2} y={60} size={16} m color="var(--muted)">:</T>}
            </g>
          );
        })}
        {/* zoom pe hextetul ales */}
        <path d={`M${x0 + sel * (hw + gap)} 108 L60 132 M${x0 + sel * (hw + gap) + hw} 108 L730 132`} stroke="var(--accent)" strokeOpacity={0.5} fill="none" />
        {digits.split('').map((d, k) => (
          <g key={k}>
            <rect x={60 + k * 170} y={134} width={160} height={30} rx={6} fill="var(--surface-3)" stroke="var(--info)" />
            <T x={60 + k * 170 + 80} y={154} size={14} m weight={650} color="var(--info)">{d.toUpperCase()} = {parseInt(d, 16)} (zecimal)</T>
            {bits.slice(k * 4, k * 4 + 4).split('').map((b, j) => (
              <g key={j}>
                <rect x={60 + k * 170 + j * 40} y={172} width={38} height={28} rx={4} fill={b === '1' ? 'var(--accent-soft)' : 'transparent'} stroke="var(--border-strong)" />
                <T x={60 + k * 170 + j * 40 + 19} y={191} size={13} m color={b === '1' ? 'var(--accent)' : 'var(--muted)'}>{b}</T>
              </g>
            ))}
          </g>
        ))}
        <T x={395} y={222} size={11} color="var(--muted)">1 cifră hexa = 4 biți (un „nibble”) · 4 cifre = 16 biți = 1 hextet · ponderile unui nibble: 8 4 2 1</T>
      </svg>
      <div className="controls"><span className="small muted">Atinge un hextet ca să vezi cum se descompune în cifre hexa și biți.</span></div>
    </>
  );
}

/* =====================================================================
   3) Antrenor: comprimare / expandare (interactiv)
   ===================================================================== */
const rnd = (n: number) => Math.floor(Math.random() * n);
function randomHextet(): number {
  const p = Math.random();
  if (p < 0.42) return 0;
  if (p < 0.56) return 1 + rnd(15);              // 000a
  if (p < 0.66) return (1 + rnd(15)) << 4;       // 00a0
  if (p < 0.74) return (1 + rnd(15)) << 8;       // 0a00 / 0100
  if (p < 0.84) return 16 + rnd(240);            // 00ab
  return 0x1000 + rnd(0xf000);                   // abcd
}
function randomAddr(): number[] {
  const t = rnd(5);
  const h = Array.from({ length: 8 }, randomHextet);
  if (t === 0 || t === 1) { h[0] = 0x2001; h[1] = 0x0db8; }
  else if (t === 2) { h[0] = 0xfe80; h[1] = 0; h[2] = 0; h[3] = 0; }
  else if (t === 3) { h[0] = 0x2a02; h[1] = 0x2f00 + rnd(0xff); }
  else { h[0] = 0xfd00 + rnd(0xff); }
  if (!h.slice(1).includes(0)) h[2 + rnd(5)] = 0;
  return h;
}

export function AbbrevTrainer() {
  const [mode, setMode] = useState<'compress' | 'expand'>('compress');
  const [addr, setAddr] = useState<number[]>(() => parseV6('2001:0db8:0000:0000:0001:0000:0000:0001')!);
  const [upper, setUpper] = useState(false);
  const [val, setVal] = useState('');
  const [res, setRes] = useState<null | { ok: boolean; title: string; notes: string[] }>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const canon = compressV6(addr), full = fullV6(addr);
  const shown = mode === 'compress' ? (upper ? full.toUpperCase() : full) : canon;

  const next = () => { setAddr(randomAddr()); setUpper(Math.random() < 0.4); setVal(''); setRes(null); };
  const check = () => {
    if (res) return;
    const user = val.trim();
    const parsed = parseV6(user);
    let r: { ok: boolean; title: string; notes: string[] };
    if (!parsed) r = { ok: false, title: 'Adresă invalidă', notes: [whyInvalid(user)] };
    else if (fullV6(parsed) !== full) r = { ok: false, title: 'Validă, dar este ALTĂ adresă', notes: [`Ai scris o adresă care se expandează la ${fullV6(parsed)}, dar originalul este ${full}. Numără hextetele: \`::\` trebuie să înlocuiască exact câte hextete de zero lipsesc până la 8.`] };
    else if (mode === 'compress') {
      const reasons = user.toLowerCase() === canon ? [] : nonCanonicalReasons(user, addr);
      if (reasons.length === 0) r = { ok: true, title: 'Corect — forma canonică', notes: user !== user.toLowerCase() ? ['Notă: RFC 5952 recomandă litere mici. Cisco IOS afișează cu majuscule — e aceeași adresă.'] : [] };
      else r = { ok: false, title: 'Echivalentă, dar nu este forma cea mai scurtă (RFC 5952)', notes: reasons };
    } else {
      const okFull = user.toLowerCase() === full;
      r = okFull ? { ok: true, title: 'Corect — forma completă', notes: [] } : { ok: false, title: 'Echivalentă, dar nu complet expandată', notes: ['Forma completă are 8 hextete, fiecare cu exact 4 cifre (zerouri de început adăugate), fără `::`.'] };
    }
    setRes(r);
    setScore((s) => ({ ok: s.ok + (r.ok ? 1 : 0), total: s.total + 1 }));
  };
  const run = longestZeroRun(addr);
  return (
    <div>
      <div className="row between" style={{ marginBottom: 12 }}>
        <div className="segmented" role="group" aria-label="Mod antrenor">
          <button className={mode === 'compress' ? 'on' : ''} onClick={() => { setMode('compress'); setVal(''); setRes(null); }}>Comprimă</button>
          <button className={mode === 'expand' ? 'on' : ''} onClick={() => { setMode('expand'); setVal(''); setRes(null); }}>Expandează</button>
        </div>
        <span className="badge accent">Scor: {score.ok} / {score.total}</span>
      </div>
      <p className="small muted" style={{ margin: '0 0 6px' }}>{mode === 'compress' ? 'Scrie forma comprimată canonică (cea mai scurtă, RFC 5952):' : 'Scrie forma completă (8 hextete × 4 cifre):'}</p>
      <div className="mono" style={{ fontSize: '1.05rem', padding: '10px 12px', borderRadius: 10, background: 'var(--code-bg)', border: '1px solid var(--border)', wordBreak: 'break-all', color: 'var(--accent)' }}>{shown}</div>
      <div className="row" style={{ marginTop: 10 }}>
        <input className="input mono" style={{ flex: '1 1 260px', minWidth: 0 }} value={val} placeholder={mode === 'compress' ? 'ex. 2001:db8::1' : 'ex. 2001:0db8:0000:…'} spellCheck={false} autoCapitalize="off" autoCorrect="off"
          onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { if (res) next(); else check(); } }} aria-label="Răspunsul tău" />
        <button className="btn primary" onClick={check} disabled={!!res || !val.trim()}>Verifică</button>
        <button className="btn" onClick={() => setRes({ ok: false, title: 'Răspunsul', notes: [] })} disabled={!!res}>Arată</button>
        <button className="btn" onClick={next}>Altă adresă →</button>
      </div>
      {res && (
        <div className="card" style={{ marginTop: 12, padding: 14, borderColor: res.ok ? 'var(--ok)' : res.title === 'Răspunsul' ? 'var(--border)' : 'var(--bad)' }}>
          <b style={{ color: res.ok ? 'var(--ok)' : res.title === 'Răspunsul' ? 'var(--text)' : 'var(--bad)' }}>{res.ok ? '✓ ' : res.title === 'Răspunsul' ? '' : '✗ '}{res.title}</b>
          {res.notes.length > 0 && <ul className="small" style={{ margin: '6px 0' }}>{res.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>}
          <div className="small" style={{ marginTop: 8 }}>
            <div>Completă: <code>{full}</code></div>
            <div>Canonică: <code>{canon}</code></div>
            <div className="muted" style={{ marginTop: 4 }}>
              {run.len >= 2 ? `Cea mai lungă secvență de zerouri: hextetele ${run.start + 1}–${run.start + run.len} (${run.len} hextete) → devin „::”.` : run.len === 1 ? 'Există un singur hextet 0 izolat → se scrie „0”, nu „::”.' : 'Nu există hextete 0 → nu se folosește „::”.'}
              {' '}Fiecare hextet își pierde zerourile de ÎNCEPUT (niciodată pe cele de la sfârșit).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   4) Vizualizator prefix (biți / hextete) — slider pentru lungimea prefixului
   ===================================================================== */
const fmtPow = (n: number) => (n <= 40 ? (2 ** n).toLocaleString('ro-RO') : `2^${n} ≈ ${(2 ** n).toExponential(2).replace('e+', '×10^')}`);
export function maskV6(h: number[], len: number): number[] {
  return h.map((v, i) => {
    const b = Math.max(0, Math.min(16, len - 16 * i));
    const m = b === 0 ? 0 : (0xffff << (16 - b)) & 0xffff;
    return v & m;
  });
}

export function PrefixVisualizer() {
  const [txt, setTxt] = useState('2001:db8:acad:12:abcd::5');
  const [len, setLen] = useState(64);
  const [sel, setSel] = useState(3);
  const parsed = parseV6(txt);
  const h = parsed ?? [0x2001, 0xdb8, 0xacad, 0x12, 0xabcd, 0, 0, 5];
  const net = maskV6(h, len);
  const nib = h.flatMap((v) => v.toString(16).padStart(4, '0').split(''));
  const x0 = 13, nw = 22, gap = 10;
  const nx = (k: number) => x0 + k * nw + Math.floor(k / 4) * gap;
  const boundaryX = (bitsN: number) => { const k = Math.floor(bitsN / 4); if (bitsN >= 128) return nx(31) + nw; return nx(k) + ((bitsN % 4) / 4) * nw - (bitsN % 4 === 0 && k % 4 === 0 && k > 0 ? gap / 2 : 0); };
  const bits = h[sel].toString(2).padStart(16, '0');
  const iidBits = 128 - len;
  return (
    <>
      <div className="row" style={{ marginBottom: 10 }}>
        <input className="input mono" style={{ flex: '1 1 240px', minWidth: 0 }} value={txt} onChange={(e) => setTxt(e.target.value)} spellCheck={false} aria-label="Adresă IPv6" />
        <span className="mono">/{len}</span>
      </div>
      {!parsed && <p className="small" style={{ color: 'var(--bad)' }}>Adresa nu e validă — afișez exemplul implicit.</p>}
      <svg viewBox="0 0 800 250" role="img" aria-label={`Adresa împărțită în prefix de ${len} biți și restul de ${iidBits} biți`}>
        {nib.map((d, k) => {
          const x = nx(k), s = 4 * k, e = s + 4;
          const pre = e <= len ? 4 : s >= len ? 0 : len - s;
          return (
            <g key={k} style={{ cursor: 'pointer' }} onClick={() => setSel(Math.floor(k / 4))}>
              <rect x={x} y={40} width={nw - 2} height={34} rx={4} fill="var(--surface-3)" stroke={Math.floor(k / 4) === sel ? 'var(--text-2)' : 'var(--border)'} />
              {pre > 0 && <rect x={x} y={40} width={((nw - 2) * pre) / 4} height={34} rx={4} fill="var(--accent)" fillOpacity={0.28} />}
              <T x={x + (nw - 2) / 2} y={62} size={13} m weight={600} color={pre === 4 ? 'var(--accent)' : 'var(--text-2)'}>{d}</T>
            </g>
          );
        })}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <T key={i} x={nx(i * 4) + 2 * nw - 1} y={30} size={9.5} color="var(--muted)">{i * 16}–{i * 16 + 15}</T>)}
        {/* granița prefixului */}
        <line x1={boundaryX(len)} x2={boundaryX(len)} y1={24} y2={92} stroke="var(--accent)" strokeWidth={2.5} />
        <T x={boundaryX(len)} y={104} size={11} weight={700} color="var(--accent)">/{len}</T>
        {len > 0 && <><path d={`M${x0} 116 v6 H${boundaryX(len)} v-6`} fill="none" stroke="var(--accent)" />
          <T x={(x0 + boundaryX(len)) / 2} y={138} size={11} color="var(--accent)">prefix: {len} biți</T></>}
        {len < 128 && <><path d={`M${boundaryX(len)} 116 v6 H${nx(31) + nw - 2} v-6`} fill="none" stroke="var(--muted)" />
          <T x={(boundaryX(len) + nx(31) + nw) / 2} y={138} size={11} color="var(--muted)">{len === 64 ? 'Interface ID' : 'restul'}: {iidBits} biți</T></>}
        {/* structura de referință a unui GUA tipic */}
        <path d={`M${x0} 160 v6 H${nx(12) - gap / 2} v-6`} fill="none" stroke="var(--violet)" />
        <T x={(x0 + nx(12)) / 2} y={182} size={10.5} color="var(--violet)">Global Routing Prefix (/48, de la ISP)</T>
        <path d={`M${nx(12)} 160 v6 H${nx(16) - gap / 2} v-6`} fill="none" stroke="var(--info)" />
        <T x={(nx(12) + nx(16)) / 2} y={182} size={10.5} color="var(--info)">Subnet ID (16 biți)</T>
        <path d={`M${nx(16)} 160 v6 H${nx(31) + nw - 2} v-6`} fill="none" stroke="var(--text-2)" />
        <T x={(nx(16) + nx(31) + nw) / 2} y={182} size={10.5} color="var(--text-2)">Interface ID (64 biți)</T>
        <T x={400} y={204} size={10} color="var(--muted)">↑ structura tipică a unui GUA dintr-un site /48 cu LAN-uri /64 (referință fixă)</T>
        {/* biții hextetului selectat */}
        {bits.split('').map((b, j) => {
          const bi = sel * 16 + j; const inP = bi < len;
          return (
            <g key={j}>
              <rect x={150 + j * 31} y={216} width={29} height={24} rx={4} fill={inP ? 'var(--accent-soft)' : 'transparent'} stroke={inP ? 'var(--accent)' : 'var(--border-strong)'} />
              <T x={150 + j * 31 + 14.5} y={233} size={12} m color={inP ? 'var(--accent)' : 'var(--muted)'}>{b}</T>
            </g>
          );
        })}
        <T x={144} y={233} size={11} anchor="end" color="var(--text-2)">hextet {sel + 1} ({h[sel].toString(16).padStart(4, '0')}):</T>
      </svg>
      <div className="controls">
        <input type="range" min={0} max={128} value={len} onChange={(e) => setLen(Number(e.target.value))} style={{ flex: '1 1 200px' }} aria-label="Lungimea prefixului" />
        <div className="segmented" role="group" aria-label="Prefixe uzuale">
          {[32, 48, 56, 60, 64, 127, 128].map((p) => <button key={p} className={len === p ? 'on' : ''} onClick={() => setLen(p)}>/{p}</button>)}
        </div>
      </div>
      <div className="grid c2" style={{ marginTop: 10 }}>
        <div className="card" style={{ padding: 12 }}>
          <div className="small muted">Prefixul (rețeaua)</div>
          <div className="mono" style={{ color: 'var(--accent)', wordBreak: 'break-all' }}>{compressV6(net)}/{len}</div>
          <div className="small muted" style={{ marginTop: 6 }}>Biții de după /{len} se pun pe 0. {len % 4 !== 0 ? 'Atenție: prefixul nu e pe o graniță de nibble — o cifră hexa e „tăiată” în două.' : 'Prefix pe graniță de nibble (multiplu de 4) → ușor de citit în hexa.'}</div>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <div className="small muted">Câte încap</div>
          <div className="small">Adrese în prefix: <b>{fmtPow(iidBits)}</b></div>
          {len <= 64 && <div className="small">Subrețele /64 în prefix: <b>{fmtPow(64 - len)}</b></div>}
          {len > 64 && len < 127 && <div className="small" style={{ color: 'var(--warn)' }}>Mai lung de /64: SLAAC nu mai funcționează pe un astfel de LAN.</div>}
          {len === 127 && <div className="small">/127 = 2 adrese → recomandat pe legături router–router (RFC 6164).</div>}
          {len === 128 && <div className="small">/128 = o singură adresă (rută „L” de tip host în <code>show ipv6 route</code>).</div>}
        </div>
      </div>
    </>
  );
}

/* =====================================================================
   5) Ierarhia de alocare IANA → RIR → ISP → site → LAN
   ===================================================================== */
const LEVELS = [
  { who: 'IANA', len: 3, ex: '2000::/3', note: 'Tot spațiul GUA alocat în prezent (prima cifră hexa 2 sau 3). IANA îl împarte celor 5 RIR-uri.' },
  { who: 'RIR (ex. RIPE NCC)', len: 12, ex: '2a00::/12', note: 'Registrul regional (Europa + Orientul Mijlociu). Alocă blocuri LIR-urilor (ISP-uri, operatori). De aceea multe adrese din România încep cu 2a0x.' },
  { who: 'ISP / LIR', len: 32, ex: '2001:db8::/32', note: 'Alocarea tipică a unui operator. Un /32 conține 65.536 de prefixe /48 (16 biți între /32 și /48).' },
  { who: 'Site (firmă)', len: 48, ex: '2001:db8:acad::/48', note: 'Recomandarea RIPE-690 pentru clienți business. Conține 65.536 de LAN-uri /64.' },
  { who: 'Abonat casnic', len: 56, ex: '2001:db8:acad:4500::/56', note: 'Recomandarea RIPE-690 pentru clienți rezidențiali: 256 de LAN-uri /64. Prefixe mai lungi de /56 sunt „puternic descurajate”.' },
  { who: 'LAN / VLAN', len: 64, ex: '2001:db8:acad:1::/64', note: 'Un segment (o subrețea, un VLAN). Mereu /64: restul de 64 de biți e Interface ID-ul, necesar pentru SLAAC.' },
  { who: 'Interfață', len: 128, ex: '2001:db8:acad:1::1/128', note: 'O singură adresă — cum apare ruta „L” (Local) a routerului în tabela de rutare.' },
];
export function AllocationHierarchy() {
  const [sel, setSel] = useState(3);
  const x0 = 170, W = 580, rh = 34;
  const L = LEVELS[sel];
  return (
    <>
      <svg viewBox={`0 0 770 ${LEVELS.length * rh + 46}`} role="img" aria-label="Ierarhia de alocare a prefixelor IPv6">
        {[0, 32, 48, 64, 128].map((b) => <g key={b}><line x1={x0 + (b / 128) * W} x2={x0 + (b / 128) * W} y1={22} y2={LEVELS.length * rh + 24} stroke="var(--border)" strokeDasharray="3 4" />
          <T x={x0 + (b / 128) * W} y={16} size={10} color="var(--muted)">{b === 0 ? 'bit 0' : `/${b}`}</T></g>)}
        {LEVELS.map((l, i) => {
          const y = 26 + i * rh; const on = i === sel; const w = (l.len / 128) * W;
          return (
            <g key={l.who} style={{ cursor: 'pointer' }} onClick={() => setSel(i)}>
              <rect x={4} y={y} width={762} height={rh - 4} rx={6} fill={on ? 'var(--accent-soft)' : 'transparent'} />
              <T x={12} y={y + 20} size={12} anchor="start" weight={on ? 700 : 550}>{l.who}</T>
              <rect x={x0} y={y + 6} width={W} height={rh - 16} rx={4} fill="var(--surface-3)" />
              <rect x={x0} y={y + 6} width={Math.max(w, 3)} height={rh - 16} rx={4} fill="var(--accent)" fillOpacity={on ? 0.75 : 0.4} />
              <T x={Math.min(x0 + w + 8, x0 + W - 4)} y={y + 20} size={11} m anchor={l.len > 100 ? 'end' : 'start'} color={l.len > 100 ? 'var(--accent-ink, var(--text))' : 'var(--text-2)'}>{l.ex}</T>
            </g>
          );
        })}
        <T x={x0 + W / 2} y={LEVELS.length * rh + 40} size={10.5} color="var(--muted)">bara colorată = biții FIXAȚI de nivelul respectiv (lungimea prefixului)</T>
      </svg>
      <div className="card" style={{ marginTop: 8, padding: 12 }}>
        <div className="row"><b>{L.who}</b><span className="badge">/{L.len}</span><code>{L.ex}</code></div>
        <p className="small" style={{ margin: '6px 0 0' }}>{L.note}</p>
      </div>
    </>
  );
}

/* =====================================================================
   6) Generator de subrețele /64 dintr-un /48 sau /56
   ===================================================================== */
export function SubnetLister() {
  const [site, setSite] = useState<48 | 56>(48);
  const [n, setN] = useState(0);
  const max = site === 48 ? 65535 : 255;
  const cur = Math.min(Math.max(0, n), max);
  const base = site === 48 ? [0x2001, 0xdb8, 0xacad] : [0x2001, 0xdb8, 0xacad];
  const sid = (k: number) => (site === 48 ? k : 0x4500 | k);
  const rows = Array.from({ length: 8 }, (_, i) => cur + i).filter((k) => k <= max);
  const bitsN = site === 48 ? 16 : 8;
  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <div className="segmented" role="group" aria-label="Prefixul site-ului">
          <button className={site === 48 ? 'on' : ''} onClick={() => { setSite(48); setN(0); }}>Firmă: 2001:db8:acad::/48</button>
          <button className={site === 56 ? 'on' : ''} onClick={() => { setSite(56); setN(0); }}>Casă: 2001:db8:acad:4500::/56</button>
        </div>
      </div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="small">Subrețeaua nr. (zecimal):</span>
        <button className="btn sm" onClick={() => setN(Math.max(0, cur - 1))} aria-label="minus">−</button>
        <input className="input mono" type="number" min={0} max={max} value={cur} onChange={(e) => setN(Number(e.target.value) || 0)} style={{ width: 110 }} aria-label="Numărul subrețelei" />
        <button className="btn sm" onClick={() => setN(Math.min(max, cur + 1))} aria-label="plus">+</button>
        <span className="small muted">Subnet ID = {bitsN} biți → {(max + 1).toLocaleString('ro-RO')} subrețele /64 (0 … {max.toLocaleString('ro-RO')})</span>
      </div>
      <div className="small" style={{ marginBottom: 8 }}>
        {cur} (zecimal) = <b className="mono" style={{ color: 'var(--accent)' }}>{cur.toString(16)}</b> (hexa) = <span className="mono">{cur.toString(2).padStart(bitsN, '0').replace(/(.{4})(?=.)/g, '$1 ')}</span> (binar)
      </div>
      <div className="table-wrap"><table className="t">
        <thead><tr><th>Nr. (zecimal)</th><th>Hextetul 4 (Subnet ID)</th><th>Prefixul LAN</th></tr></thead>
        <tbody>{rows.map((k) => (
          <tr key={k}><td>{k}</td><td className="hl"><code>{sid(k).toString(16).padStart(4, '0')}</code></td><td><code>{compressV6([...base, sid(k), 0, 0, 0, 0])}/64</code></td></tr>
        ))}</tbody>
      </table></div>
      <p className="small muted" style={{ marginTop: 8 }}>Încearcă 9 → 10 → 15 → 16: după <code>:9:</code> vine <code>:a:</code>, iar <code>:10:</code> (hexa) este de fapt subrețeaua nr. 16.</p>
    </div>
  );
}

/* =====================================================================
   7) SLAAC + DAD + NDP pas cu pas (animație cu butoane)
   ===================================================================== */
type SStep = { t: string; dir: 'r' | 'l' | 'none'; msg?: string; src?: string; dst?: string; body: string; lla?: string; gua?: string; gw?: string };
const SLAAC: SStep[] = [
  { t: 'PC1 pornește și își creează adresa link-local', dir: 'none', body: 'Înainte de orice, PC1 combină prefixul fe80::/64 cu un Interface ID de 64 de biți (aleator sau EUI-64 din MAC). Adresa e încă „tentative”: nu o folosește până nu verifică că e unică.', lla: 'fe80::250:79ff:fe66:6801 (tentative)' },
  { t: 'DAD pentru link-local: Neighbor Solicitation', dir: 'r', msg: 'NS (ICMPv6 135)', src: ':: (nespecificată)', dst: 'ff02::1:ff66:6801 (solicited-node)', body: 'PC1 întreabă „folosește cineva adresa asta?”. Sursa este :: pentru că încă nu are voie să folosească adresa testată. Destinația e grupul multicast solicited-node al adresei (ultimii 24 de biți) — detaliat în 1.9.', lla: 'fe80::250:79ff:fe66:6801 (tentative)' },
  { t: 'Nimeni nu răspunde → adresa e unică', dir: 'none', body: 'Dacă ar fi venit un Neighbor Advertisement, adresa ar fi fost duplicată și PC1 n-ar fi folosit-o. Tăcerea înseamnă că adresa devine „preferred”. Acum PC1 poate comunica pe link-ul local.', lla: 'fe80::250:79ff:fe66:6801' },
  { t: 'Router Solicitation', dir: 'r', msg: 'RS (ICMPv6 133)', src: 'fe80::250:79ff:fe66:6801', dst: 'ff02::2 (all-routers)', body: 'PC1 nu vrea să aștepte următorul RA periodic, așa că cere imediat: „routere de pe acest link, trimiteți-mi informațiile”. Doar routerele (cu ipv6 unicast-routing) sunt în grupul ff02::2.', lla: 'fe80::250:79ff:fe66:6801' },
  { t: 'Router Advertisement', dir: 'l', msg: 'RA (ICMPv6 134)', src: 'fe80::1 (LLA-ul lui R1)', dst: 'ff02::1 (all-nodes)', body: 'R1 anunță: prefixul 2001:db8:acad:1::/64 cu flag-ul A=1 (folosiți-l pentru SLAAC), M=0, O=0, Router Lifetime 1800 s (sunt default gateway). Sursa RA-ului — adresa link-local a routerului — devine gateway-ul.', lla: 'fe80::250:79ff:fe66:6801' },
  { t: 'PC1 își construiește adresa globală (GUA)', dir: 'none', body: 'Prefixul din RA (64 de biți) + propriul Interface ID (64 de biți) = 128 de biți. Adresa e din nou „tentative” până trece de DAD.', lla: 'fe80::250:79ff:fe66:6801', gua: '2001:db8:acad:1:250:79ff:fe66:6801 (tentative)', gw: 'fe80::1' },
  { t: 'DAD pentru GUA', dir: 'r', msg: 'NS (ICMPv6 135)', src: '::', dst: 'ff02::1:ff66:6801', body: 'Aceeași verificare ca la pasul 2, de data asta pentru adresa globală. Fără răspuns → adresa devine utilizabilă.', lla: 'fe80::250:79ff:fe66:6801', gua: '2001:db8:acad:1:250:79ff:fe66:6801 (tentative)', gw: 'fe80::1' },
  { t: 'Gata: PC1 are adresă, prefix și gateway — fără niciun server', dir: 'none', body: 'Asta e SLAAC (Stateless Address Autoconfiguration): routerul nu ține evidența adreselor (de aici „stateless”). DNS-ul poate veni din RA (opțiunea RDNSS) sau dintr-un server DHCPv6 „stateless” (flag O=1).', lla: 'fe80::250:79ff:fe66:6801', gua: '2001:db8:acad:1:250:79ff:fe66:6801', gw: 'fe80::1' },
  { t: 'Bonus: rezolvarea adresei MAC a gateway-ului (în loc de ARP)', dir: 'r', msg: 'NS (ICMPv6 135)', src: '2001:db8:acad:1:250:79ff:fe66:6801', dst: 'ff02::1:ff00:1 (solicited-node pentru fe80::1)', body: 'Ca să trimită un pachet spre alt LAN, PC1 are nevoie de MAC-ul lui fe80::1. Întreabă cu un NS trimis la grupul solicited-node al gateway-ului (nu broadcast ca ARP).', lla: 'fe80::250:79ff:fe66:6801', gua: '2001:db8:acad:1:250:79ff:fe66:6801', gw: 'fe80::1' },
  { t: 'Neighbor Advertisement', dir: 'l', msg: 'NA (ICMPv6 136)', src: 'fe80::1', dst: '2001:db8:acad:1:250:79ff:fe66:6801', body: 'R1 răspunde cu MAC-ul lui. PC1 îl salvează în neighbor cache (echivalentul tabelei ARP; pe router: show ipv6 neighbors).', lla: 'fe80::250:79ff:fe66:6801', gua: '2001:db8:acad:1:250:79ff:fe66:6801', gw: 'fe80::1 → MAC învățat' },
];
export function SlaacFlow() {
  const [i, setI] = useState(0);
  const s = SLAAC[i];
  const ay = 96;
  return (
    <>
      <svg viewBox="0 0 720 200" role="img" aria-label={`Pasul ${i + 1}: ${s.t}`}>
        <defs><marker id="t18arr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" /></marker></defs>
        <ClientIcon x={90} y={90} kind="pc" label="PC1" />
        <T x={90} y={140} size={10} color="var(--muted)">MAC 0050.7966.6801</T>
        <SwitchIcon x={360} y={150} label="" />
        <RouterIcon x={630} y={90} label="R1 G0/0" sub="fe80::1 · 2001:db8:acad:1::1/64" />
        <line x1={110} y1={100} x2={330} y2={146} stroke="var(--border-strong)" strokeWidth={2} />
        <line x1={390} y1={146} x2={602} y2={100} stroke="var(--border-strong)" strokeWidth={2} />
        {s.dir !== 'none' && (
          <g key={i} className="fade-up">
            <line x1={s.dir === 'r' ? 130 : 590} x2={s.dir === 'r' ? 590 : 130} y1={ay} y2={ay} stroke="var(--accent)" strokeWidth={2.5} markerEnd="url(#t18arr)" />
            <rect x={265} y={ay - 32} width={190} height={24} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" />
            <T x={360} y={ay - 16} size={12} weight={700} color="var(--accent)">{s.msg}</T>
          </g>
        )}
        {s.dir === 'none' && <T x={360} y={ay - 6} size={12} color="var(--muted)">(fără mesaj pe fir — proces intern pe PC1)</T>}
        <T x={360} y={24} size={12.5} weight={700}>{i + 1}. {s.t}</T>
      </svg>
      <div className="grid c2" style={{ marginTop: 8 }}>
        <div className="card" style={{ padding: 12 }}>
          {s.msg && <div className="small" style={{ marginBottom: 6 }}><b>{s.msg}</b><br />sursă: <code>{s.src}</code><br />destinație: <code>{s.dst}</code></div>}
          <p className="small" style={{ margin: 0 }}>{s.body}</p>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <div className="small muted" style={{ marginBottom: 4 }}>Starea lui PC1</div>
          <div className="small">Link-local: <code>{s.lla ?? '—'}</code></div>
          <div className="small">IPv6 (GUA): <code>{s.gua ?? '—'}</code></div>
          <div className="small">Default gateway: <code>{s.gw ?? '—'}</code></div>
        </div>
      </div>
      <div className="controls">
        <button className="btn sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>← Înapoi</button>
        <button className="btn sm primary" onClick={() => setI(Math.min(SLAAC.length - 1, i + 1))} disabled={i === SLAAC.length - 1}>Pasul următor →</button>
        <button className="btn sm ghost" onClick={() => setI(0)}>De la capăt</button>
        <span className="small muted">Pasul {i + 1} / {SLAAC.length}</span>
      </div>
    </>
  );
}

/* =====================================================================
   8) Metodele de atribuire — selector flag-uri RA
   ===================================================================== */
export function RaFlags() {
  const [a, setA] = useState(true);
  const [o, setO] = useState(false);
  const [m, setM] = useState(false);
  const method = m ? 'Stateful DHCPv6' : o && a ? 'SLAAC + stateless DHCPv6' : a ? 'SLAAC (doar RA)' : o ? 'Doar „other config” din DHCPv6 — fără adresă globală automată' : 'Nicio adresă globală automată (doar link-local)';
  const addr = m ? 'de la serverul DHCPv6 (care ține evidența — „stateful”)' + (a ? '; cu A=1 hostul își poate face ȘI o adresă SLAAC' : '') : a ? 'construită de host: prefix din RA + Interface ID propriu' : '— (doar link-local fe80::)';
  const dns = m || o ? 'de la serverul DHCPv6' : a ? 'din RA (opțiunea RDNSS), dacă routerul o trimite' : '—';
  const Tog = ({ on, set, label, sub }: { on: boolean; set: (v: boolean) => void; label: string; sub: string }) => (
    <label className="check" style={{ marginRight: 14 }}><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /><b>{label}</b>&nbsp;<span className="small muted">{sub}</span></label>
  );
  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <Tog on={a} set={setA} label="A" sub="(Autonomous, în Prefix Information)" />
        <Tog on={o} set={setO} label="O" sub="(Other config)" />
        <Tog on={m} set={setM} label="M" sub="(Managed address config)" />
      </div>
      <div className="table-wrap"><table className="t"><tbody>
        <tr><td>Metoda rezultată</td><td className="hl"><b>{method}</b></td></tr>
        <tr><td>Adresa globală</td><td>{addr}</td></tr>
        <tr><td>DNS și alte opțiuni</td><td>{dns}</td></tr>
        <tr><td>Default gateway</td><td><b>întotdeauna din RA</b> (adresa link-local sursă a RA-ului) — DHCPv6 nu are opțiune de gateway</td></tr>
      </tbody></table></div>
    </div>
  );
}

/* =====================================================================
   Topologii laborator
   ===================================================================== */
export function LabGuidedTopologyV6() {
  return (
    <svg viewBox="0 0 760 270" role="img" aria-label="Topologie lab ghidat IPv6: două routere, două LAN-uri">
      <RouterIcon x={250} y={60} label="R1" sub="G0/0 :1::1 · G0/1 :ff::1" />
      <RouterIcon x={510} y={60} label="R2" sub="G0/0 :2::1 · G0/1 :ff::2" />
      <Wire x1={280} y1={60} x2={480} y2={60} />
      <T x={380} y={50} size={10.5} color="var(--muted)">G0/1 — 2001:db8:acad:ff::/64 — G0/1</T>
      <SwitchIcon x={250} y={160} label="" /><T x={290} y={150} size={10.5} anchor="start" color="var(--muted)">SW1</T>
      <SwitchIcon x={510} y={160} label="" /><T x={550} y={150} size={10.5} anchor="start" color="var(--muted)">SW2</T>
      <Wire x1={250} y1={74} x2={250} y2={148} /><Wire x1={510} y1={74} x2={510} y2={148} />
      <T x={256} y={118} size={10} anchor="start" color="var(--muted)">G0/0 · LAN 1</T><T x={516} y={118} size={10} anchor="start" color="var(--muted)">G0/0 · LAN 2</T>
      <ClientIcon x={150} y={225} kind="pc" label="PC1 (SLAAC)" /><ClientIcon x={340} y={225} kind="pc" label="PC2 (SLAAC)" />
      <ClientIcon x={420} y={225} kind="pc" label="PC3 (SLAAC)" /><ClientIcon x={610} y={225} kind="pc" label="PC4 (static ::10)" />
      <Wire x1={225} y1={168} x2={162} y2={210} /><Wire x1={275} y1={168} x2={330} y2={210} />
      <Wire x1={485} y1={168} x2={430} y2={210} /><Wire x1={535} y1={168} x2={600} y2={210} />
      <T x={250} y={266} size={10.5} color="var(--accent)">LAN 1: 2001:db8:acad:1::/64</T>
      <T x={510} y={266} size={10.5} color="var(--accent)">LAN 2: 2001:db8:acad:2::/64</T>
    </svg>
  );
}
export function LabSoloTopologyV6() {
  return (
    <svg viewBox="0 0 760 280" role="img" aria-label="Topologie lab solo IPv6: HQ cu două LAN-uri și BRANCH cu un LAN">
      <RouterIcon x={260} y={60} label="HQ" sub="G0/0 · G0/1 · G0/2" />
      <RouterIcon x={560} y={60} label="BRANCH" sub="G0/0 · G0/2" />
      <Wire x1={290} y1={60} x2={530} y2={60} />
      <T x={410} y={50} size={10.5} color="var(--warn)">G0/2 — WAN: ? /64 — G0/2</T>
      <SwitchIcon x={140} y={160} label="" /><SwitchIcon x={380} y={160} label="" /><SwitchIcon x={560} y={160} label="" />
      <Wire x1={240} y1={72} x2={150} y2={148} /><Wire x1={280} y1={72} x2={370} y2={148} /><Wire x1={560} y1={74} x2={560} y2={148} />
      <T x={150} y={112} size={10} anchor="end" color="var(--muted)">G0/0</T><T x={340} y={112} size={10} anchor="start" color="var(--muted)">G0/1</T><T x={566} y={112} size={10} anchor="start" color="var(--muted)">G0/0</T>
      <ClientIcon x={90} y={225} kind="pc" label="PC-A1" /><ClientIcon x={190} y={225} kind="pc" label="PC-A2" />
      <ClientIcon x={330} y={225} kind="pc" label="PC-B1" /><ClientIcon x={430} y={225} kind="pc" label="SRV (static)" />
      <ClientIcon x={560} y={225} kind="pc" label="PC-C1" />
      <Wire x1={120} y1={168} x2={95} y2={210} /><Wire x1={160} y1={168} x2={185} y2={210} />
      <Wire x1={360} y1={168} x2={335} y2={210} /><Wire x1={400} y1={168} x2={425} y2={210} /><Wire x1={560} y1={172} x2={560} y2={210} />
      <T x={140} y={268} size={10.5} color="var(--warn)">LAN-A (VLAN 10): ? /64</T>
      <T x={380} y={268} size={10.5} color="var(--warn)">LAN-B (VLAN 20): ? /64</T>
      <T x={600} y={268} size={10.5} color="var(--warn)">LAN-C (VLAN 30): ? /64</T>
      <T x={700} y={130} size={10.5} anchor="end" color="var(--muted)">site: 2001:db8:c0de::/48</T>
    </svg>
  );
}
