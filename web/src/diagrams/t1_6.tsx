import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { calc, intToIp, ipToInt, toBin } from '../lib/subnet';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';

/* Diagrame și widget-uri interactive pentru 1.6 — IPv4 addressing & subnetting.
   Toate calculele trec prin lib/subnet.ts (aceeași logică ca pagina /subnetting).
   Culori DOAR prin variabile CSS, ca să meargă în ambele teme. */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
const Wire = ({ x1, y1, x2, y2, label, dx = 6, dy = -7, anchor = 'start' }: { x1: number; y1: number; x2: number; y2: number; label?: string; dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end' }) => (
  <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-2)" strokeWidth={2} />{label && <T x={(x1 + x2) / 2 + dx} y={(y1 + y2) / 2 + dy} size={10} anchor={anchor} color="var(--muted)">{label}</T>}</g>
);

const NET = 'var(--accent)';
const HOST = 'var(--warn)';
const PALETTE = ['var(--accent)', 'var(--info)', 'var(--violet)', 'var(--warn)', 'var(--ok)', 'var(--text-2)', 'var(--bad)', 'var(--muted)'];

const box: CSSProperties = { border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface-3)' };

/* ---------------------------------------------------------------
   1) Un octet: 8 biți ↔ zecimal (interactiv, cu provocare)
---------------------------------------------------------------- */
const W8 = [128, 64, 32, 16, 8, 4, 2, 1];
const MASK_VALUES = [0, 128, 192, 224, 240, 248, 252, 254, 255];

export function BinaryOctet() {
  const [bits, setBits] = useState<number[]>([1, 0, 1, 0, 1, 1, 0, 0]); // 172
  const [dec, setDec] = useState('');
  const [target, setTarget] = useState<number | null>(null);
  const value = bits.reduce((a, b, i) => a + b * W8[i], 0);
  const parts = W8.filter((_, i) => bits[i]);
  const setFrom = (n: number) => setBits(W8.map((w) => (n & w ? 1 : 0)));
  const onDec = (s: string) => {
    setDec(s);
    if (/^\d{1,3}$/.test(s) && +s <= 255) setFrom(+s);
  };
  const maskIdx = MASK_VALUES.indexOf(value);
  const solved = target != null && value === target;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gap: 6 }}>
        {bits.map((b, i) => (
          <button key={i} type="button" onClick={() => { setBits(bits.map((x, k) => (k === i ? 1 - x : x))); setDec(''); }}
            aria-pressed={!!b} aria-label={`bitul de valoare ${W8[i]}: ${b}`}
            style={{ ...box, cursor: 'pointer', padding: '6px 0', textAlign: 'center', color: 'var(--text)', font: 'inherit',
              background: b ? 'var(--accent-soft)' : 'var(--surface-3)', borderColor: b ? 'var(--accent)' : 'var(--border)' }}>
            <div className="tiny muted">2<sup>{7 - i}</sup></div>
            <div className="small" style={{ fontWeight: 650, color: b ? 'var(--accent)' : 'var(--text-2)' }}>{W8[i]}</div>
            <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 700, lineHeight: 1.2, color: b ? 'var(--accent)' : 'var(--muted)' }}>{b}</div>
          </button>
        ))}
      </div>
      <div className="row" style={{ marginTop: 12, flexWrap: 'wrap', gap: 10, alignItems: 'baseline' }}>
        <span className="mono" style={{ fontSize: '1.05rem' }}>{bits.join('')}<sub>2</sub></span>
        <span className="muted">=</span>
        <span className="mono small">{parts.length ? parts.join(' + ') : '0'}</span>
        <span className="muted">=</span>
        <b className="mono" style={{ fontSize: '1.3rem', color: 'var(--accent)' }}>{value}</b>
      </div>
      <p className="small" style={{ margin: '6px 0 0', color: maskIdx >= 0 ? 'var(--ok)' : 'var(--muted)' }}>
        {maskIdx >= 0
          ? <>✓ {value} este o valoare validă de mască (biții 1 sunt toți la stânga): {maskIdx} biți de rețea în acest octet.</>
          : <>{value} nu poate fi octet de mască: biții 1 nu sunt toți grupați la stânga.</>}
      </p>
      <div className="controls">
        <label className="small muted row" style={{ gap: 6 }}>zecimal →
          <input className="input mono" style={{ width: 80, padding: '4px 8px' }} inputMode="numeric" placeholder="0–255" value={dec} onChange={(e) => onDec(e.target.value)} />
        </label>
        <button type="button" className="btn sm" onClick={() => { setFrom(0); setDec(''); }}>toți 0</button>
        <button type="button" className="btn sm" onClick={() => { setFrom(255); setDec(''); }}>toți 1</button>
        <button type="button" className="btn sm primary" onClick={() => { setTarget(1 + Math.floor(Math.random() * 254)); setFrom(0); setDec(''); }}>Provocare</button>
        {target != null && (
          <span className="small" style={{ color: solved ? 'var(--ok)' : 'var(--text-2)', fontWeight: 600 }}>
            {solved ? `Corect! ${target} = ${bits.join('')}` : `Aprinde biții pentru ${target} (acum: ${value})`}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   2) Adresa în zecimal cu puncte ↔ 32 de biți (static)
---------------------------------------------------------------- */
export function DottedDecimal() {
  const oct = [192, 168, 10, 77];
  return (
    <svg viewBox="0 0 720 190" role="img" aria-label="192.168.10.77 scris în binar: patru octeți de câte 8 biți">
      <T x={360} y={26} size={22} weight={700} m>192 . 168 . 10 . 77</T>
      {oct.map((o, i) => {
        const x = 20 + i * 172;
        return (
          <g key={i}>
            <line x1={x + 80} y1={36} x2={x + 80} y2={60} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#ddArr)" />
            <rect x={x} y={66} width={160} height={40} rx={8} fill="var(--surface-3)" stroke="var(--accent)" strokeOpacity={0.6} />
            <T x={x + 80} y={92} size={17} weight={650} m color="var(--accent)">{o.toString(2).padStart(8, '0')}</T>
            <T x={x + 80} y={126} size={11} color="var(--muted)">octetul {i + 1} = {o}</T>
          </g>
        );
      })}
      <path d="M20 142 v8 h680 v-8" fill="none" stroke="var(--text-2)" strokeWidth={1.4} />
      <T x={360} y={172} size={12} color="var(--text-2)">32 de biți = 4 octeți × 8 biți · fiecare octet: 0–255 · total 2³² ≈ 4,29 miliarde de adrese</T>
      <defs><marker id="ddArr" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L5 10L10 0z" fill="var(--border)" /></marker></defs>
    </svg>
  );
}

/* ---------------------------------------------------------------
   3) Antetul IPv4 (RFC 791) — clic pe un câmp
---------------------------------------------------------------- */
type HField = { name: string; bits: number; row: number; start: number; desc: string; key?: boolean };
const HEADER: HField[] = [
  { name: 'Version', bits: 4, row: 0, start: 0, desc: 'Versiunea protocolului: mereu 4 pentru IPv4 (IPv6 are alt antet, cu valoarea 6).' },
  { name: 'IHL', bits: 4, row: 0, start: 4, desc: 'Internet Header Length — lungimea antetului în cuvinte de 32 de biți. Minimum 5 (= 20 de octeți), maximum 15 (= 60 de octeți, cu opțiuni).' },
  { name: 'DSCP', bits: 6, row: 0, start: 8, desc: 'Marcaj de calitate a serviciului (QoS): spune routerelor cât de prioritar e pachetul (de exemplu voce). Detaliat în 4.7.' },
  { name: 'ECN', bits: 2, row: 0, start: 14, desc: 'Explicit Congestion Notification — semnalizează congestia fără să arunce pachete.' },
  { name: 'Total Length', bits: 16, row: 0, start: 16, desc: 'Lungimea totală a pachetului (antet + date), în octeți. Maximum 65.535.' },
  { name: 'Identification', bits: 16, row: 1, start: 0, desc: 'Număr comun tuturor fragmentelor aceluiași pachet original, ca destinația să le poată reasambla.' },
  { name: 'Flags', bits: 3, row: 1, start: 16, desc: 'Biți de control al fragmentării. DF (Don’t Fragment) = nu fragmenta; MF (More Fragments) = mai urmează fragmente.' },
  { name: 'Fragment Offset', bits: 13, row: 1, start: 19, desc: 'Poziția fragmentului în pachetul original (în unități de 8 octeți).' },
  { name: 'TTL', bits: 8, row: 2, start: 0, desc: 'Time To Live — fiecare router scade valoarea cu 1; la 0 pachetul este aruncat (oprește buclele). traceroute se bazează pe el.', key: true },
  { name: 'Protocol', bits: 8, row: 2, start: 8, desc: 'Ce transportă pachetul: 1 = ICMP, 6 = TCP, 17 = UDP, 89 = OSPF.' },
  { name: 'Header Checksum', bits: 16, row: 2, start: 16, desc: 'Sumă de control doar pentru antet. Se recalculează la fiecare router, pentru că TTL-ul se schimbă.' },
  { name: 'Source Address', bits: 32, row: 3, start: 0, desc: 'Adresa IPv4 a expeditorului (32 de biți). Rămâne aceeași de la un capăt la altul (dacă nu intervine NAT — topicul 1.7).', key: true },
  { name: 'Destination Address', bits: 32, row: 4, start: 0, desc: 'Adresa IPv4 a destinatarului. Routerele decid drumul pachetului DOAR pe baza ei, comparând-o cu tabela de rutare.', key: true },
  { name: 'Options (rar folosite) + padding', bits: 32, row: 5, start: 0, desc: 'Câmp opțional, de lungime variabilă. Aproape niciodată folosit astăzi; dacă există, IHL > 5.' },
];
export function Ipv4Header() {
  const [sel, setSel] = useState('Destination Address');
  const W = 720, x0 = 20, cw = (W - 40) / 32, rh = 40, y0 = 34;
  const f = HEADER.find((h) => h.name === sel)!;
  return (
    <>
      <svg viewBox={`0 0 ${W} ${y0 + 6 * rh + 30}`} role="img" aria-label="Antetul IPv4: câmpurile și lungimea lor în biți">
        {[0, 4, 8, 16, 24, 31].map((b) => <T key={b} x={x0 + b * cw + cw / 2} y={22} size={10} color="var(--muted)" m>{b}</T>)}
        {HEADER.map((h) => {
          const x = x0 + h.start * cw, y = y0 + h.row * rh, w = h.bits * cw, on = h.name === sel;
          return (
            <g key={h.name} onClick={() => setSel(h.name)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label={h.name}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(h.name); } }}>
              <rect x={x + 1} y={y + 1} width={w - 2} height={rh - 2} rx={5}
                fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={on ? 'var(--accent)' : h.key ? 'var(--info)' : 'var(--border)'} strokeWidth={on ? 2 : 1.2}
                strokeDasharray={h.row === 5 ? '5 4' : undefined} />
              <T x={x + w / 2} y={y + rh / 2 + (w > 60 ? -1 : 4)} size={w < 60 ? 10 : 12} weight={on ? 700 : 550} color={on ? 'var(--accent)' : 'var(--text)'}>{h.name}</T>
              {w > 60 && <T x={x + w / 2} y={y + rh / 2 + 13} size={9.5} color="var(--muted)">{h.bits} biți</T>}
            </g>
          );
        })}
        <T x={W / 2} y={y0 + 6 * rh + 22} size={11} color="var(--muted)">fiecare rând = 32 de biți · antet minim 5 rânduri = 20 de octeți · maximum 60 de octeți</T>
      </svg>
      <div className="controls">
        <span className="small"><b style={{ color: 'var(--accent)' }}>{f.name}</b> ({f.bits} biți): {f.desc}</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   4) Clasele istorice A–E (primul octet)
---------------------------------------------------------------- */
export function ClassfulBar() {
  const W = 720, x0 = 20, w = W - 40, sx = (v: number) => x0 + (v / 256) * w;
  const cls = [
    { c: 'A', from: 0, to: 128, bits: '0xxxxxxx', mask: '/8 (255.0.0.0)', color: 'var(--accent)' },
    { c: 'B', from: 128, to: 192, bits: '10xxxxxx', mask: '/16', color: 'var(--info)' },
    { c: 'C', from: 192, to: 224, bits: '110xxxxx', mask: '/24', color: 'var(--violet)' },
    { c: 'D', from: 224, to: 240, bits: '1110', mask: 'multicast', color: 'var(--warn)' },
    { c: 'E', from: 240, to: 256, bits: '1111', mask: 'rezervat', color: 'var(--bad)' },
  ];
  return (
    <svg viewBox={`0 0 ${W} 200`} role="img" aria-label="Spațiul IPv4 împărțit în clase după primul octet">
      <T x={x0} y={20} size={11} anchor="start" color="var(--muted)">primul octet al adresei →</T>
      {cls.map((k) => (
        <g key={k.c}>
          <rect x={sx(k.from) + 1} y={34} width={sx(k.to) - sx(k.from) - 2} height={56} rx={6} fill={k.color} fillOpacity={0.16} stroke={k.color} strokeWidth={1.5} />
          <T x={(sx(k.from) + sx(k.to)) / 2} y={60} size={18} weight={700} color={k.color}>{k.c}</T>
          <T x={(sx(k.from) + sx(k.to)) / 2} y={79} size={k.to - k.from < 30 ? 9 : 11} m color="var(--text-2)">{k.bits}</T>
          <T x={(sx(k.from) + sx(k.to)) / 2} y={112} size={k.to - k.from < 30 ? 9.5 : 11} color="var(--text-2)">{k.mask}</T>
          <T x={sx(k.from) + 3} y={136} size={10} anchor="start" m color="var(--muted)">{k.from}</T>
        </g>
      ))}
      <T x={sx(256) - 2} y={152} size={10} anchor="end" m color="var(--muted)">…255</T>
      {/* 0 și 127 */}
      <line x1={sx(0.5)} y1={30} x2={sx(0.5)} y2={94} stroke="var(--bad)" strokeWidth={2} />
      <line x1={sx(127.5)} y1={30} x2={sx(127.5)} y2={94} stroke="var(--bad)" strokeWidth={2} />
      <T x={sx(127.5) - 4} y={152} size={10.5} anchor="end" color="var(--bad)">127 = loopback (rezervat)</T>
      <T x={sx(0) + 4} y={152} size={10.5} anchor="start" color="var(--bad)">0 = „această rețea”</T>
      <T x={W / 2} y={184} size={11.5} color="var(--text-2)">Clasa A ocupă jumătate din tot spațiul, B un sfert, C o optime — de aceea alocarea „pe clase” a risipit atât de mult.</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   5) Biți de rețea vs biți de gazdă — tastezi IP/prefix (interactiv)
---------------------------------------------------------------- */
function BitsRow({ label, value, bits, prefix, mode }: { label: ReactNode; value: string; bits: string; prefix: number; mode: 'ip' | 'mask' | 'net' | 'bc' }) {
  const groups = bits.split('.');
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="small" style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <span className="muted" style={{ minWidth: 92 }}>{label}</span><b className="mono">{value}</b>
      </div>
      <div className="mono" style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 8px', fontSize: 14, letterSpacing: '0.02em' }}>
        {groups.map((g, gi) => (
          <span key={gi}>
            {g.split('').map((ch, bi) => {
              const idx = gi * 8 + bi; const isNet = idx < prefix;
              const hostHl = !isNet && (mode === 'net' || mode === 'bc');
              return <span key={bi} style={{ color: isNet ? NET : HOST, fontWeight: hostHl ? 800 : 600, background: hostHl ? 'var(--surface-3)' : undefined,
                borderBottom: idx === prefix - 1 ? '2px solid var(--accent)' : undefined }}>{ch}</span>;
            })}
          </span>
        ))}
      </div>
    </div>
  );
}
export function AddressBits({ ip: ip0 = '192.168.10.77', prefix: p0 = 26 }: { ip?: string; prefix?: number }) {
  const [ip, setIp] = useState(ip0);
  const [p, setP] = useState(p0);
  const r = calc(ip, p);
  const n = 32 - p;
  return (
    <div>
      <div className="grid c2" style={{ gap: 12, marginBottom: 14 }}>
        <label className="field">Adresă IPv4<input className="input mono" value={ip} onChange={(e) => setIp(e.target.value)} inputMode="decimal" /></label>
        <label className="field">Prefix: /{p} {r && <span className="mono muted">({r.mask})</span>}
          <input type="range" min={0} max={32} value={p} onChange={(e) => setP(+e.target.value)} style={{ accentColor: 'var(--accent)' }} />
        </label>
      </div>
      {!r ? <p className="small" style={{ color: 'var(--bad)' }}>Adresă invalidă — patru numere între 0 și 255, separate prin puncte.</p> : (
        <>
          <div className="small" style={{ marginBottom: 10 }}>
            <span style={{ color: NET, fontWeight: 700 }}>■ {p} biți de rețea</span>{'  '}
            <span style={{ color: HOST, fontWeight: 700, marginLeft: 12 }}>■ {n} biți de gazdă</span>
          </div>
          <BitsRow label="Adresa IP" value={r.ip} bits={r.ipBin} prefix={p} mode="ip" />
          <BitsRow label="Masca" value={`${r.mask}  (/${p})`} bits={r.maskBin} prefix={p} mode="mask" />
          <BitsRow label="Rețea (AND)" value={r.network} bits={r.netBin} prefix={p} mode="net" />
          {p < 31 && <BitsRow label="Broadcast" value={r.broadcast} bits={toBin(ipToInt(r.broadcast)!)} prefix={p} mode="bc" />}
          <div className="table-wrap" style={{ marginTop: 6 }}><table className="t">
            <tbody>
              <tr><td>Adresa de rețea</td><td className="hl mono">{r.network}/{p}</td><td className="small muted">toți biții de gazdă = 0</td></tr>
              <tr><td>Prima gazdă</td><td className="hl mono">{r.first}</td><td className="small muted">{p >= 31 ? (p === 31 ? '/31: ambele adrese sunt gazde (RFC 3021)' : '/32: o singură adresă') : 'rețea + 1'}</td></tr>
              <tr><td>Ultima gazdă</td><td className="hl mono">{r.last}</td><td className="small muted">{p >= 31 ? '' : 'broadcast − 1'}</td></tr>
              <tr><td>Broadcast</td><td className="hl mono">{p >= 31 ? '—' : r.broadcast}</td><td className="small muted">toți biții de gazdă = 1</td></tr>
              <tr><td>Gazde utilizabile</td><td className="hl mono">{r.hosts.toLocaleString('ro-RO')}</td><td className="small muted">{p < 31 ? `2^${n} − 2 = ${(2 ** n).toLocaleString('ro-RO')} − 2` : p === 31 ? '2^1 = 2, fără rețea/broadcast' : '2^0 = 1'}</td></tr>
              <tr><td>Wildcard</td><td className="hl mono">{r.wildcard}</td><td className="small muted">inversul măștii (ACL, OSPF)</td></tr>
            </tbody>
          </table></div>
          <p className="tiny muted" style={{ marginTop: 8 }}>Aceeași logică ca în <Link to="/subnetting">calculatorul și drill-ul de subnetting</Link>. Rețeaua = IP AND mască, bit cu bit: unde masca are 1 se copiază bitul din IP, unde are 0 rezultatul e 0.</p>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   6) Metoda „magic number” — axa octetului interesant (interactiv)
---------------------------------------------------------------- */
export function MagicNumber({ ip: ip0 = '172.16.77.200', prefix: p0 = 19 }: { ip?: string; prefix?: number }) {
  const [ip, setIp] = useState(ip0);
  const [p, setP] = useState(p0);
  const r = calc(ip, p);
  const W = 720, x0 = 24, w = W - 48, sx = (v: number) => x0 + (v / 256) * w;
  if (!r) {
    return (
      <div>
        <label className="field">Adresă IPv4<input className="input mono" value={ip} onChange={(e) => setIp(e.target.value)} /></label>
        <p className="small" style={{ color: 'var(--bad)' }}>Adresă invalidă.</p>
      </div>
    );
  }
  const oi = r.interestingOctet; // 1-based sau null
  const block = r.block;
  const octs = r.ip.split('.').map(Number);
  const v = oi ? octs[oi - 1] : 0;
  const netV = oi ? Math.floor(v / block!) * block! : 0;
  const nBlocks = block ? 256 / block : 0;
  const labelEvery = block ? Math.max(1, Math.ceil(nBlocks / 8)) : 1;
  const maskOct = block ? 256 - block : 0;
  return (
    <div>
      <div className="grid c2" style={{ gap: 12, marginBottom: 12 }}>
        <label className="field">Adresă IPv4<input className="input mono" value={ip} onChange={(e) => setIp(e.target.value)} inputMode="decimal" /></label>
        <label className="field">Prefix: /{p} <span className="mono muted">({r.mask})</span>
          <input type="range" min={1} max={32} value={p} onChange={(e) => setP(+e.target.value)} style={{ accentColor: 'var(--accent)' }} />
        </label>
      </div>
      {oi && block ? (
        <>
          <div className="small muted" style={{ marginBottom: 4 }}>Axa octetului {oi} (cel „interesant”), împărțită în blocuri de {block}:</div>
          <svg viewBox={`0 0 ${W} 132`} role="img" aria-label={`Axa octetului ${oi}: blocuri de ${block}; valoarea ${v} cade în blocul ${netV}–${netV + block - 1}`}>
            <rect x={x0} y={40} width={w} height={26} rx={4} fill="var(--surface-3)" stroke="var(--border)" />
            <rect x={sx(netV)} y={40} width={Math.max(3, sx(netV + block) - sx(netV))} height={26} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} />
            {Array.from({ length: nBlocks + 1 }, (_, k) => k * block).map((m, k) => (
              <g key={m}>
                <line x1={sx(m)} y1={k % labelEvery === 0 ? 34 : 38} x2={sx(m)} y2={70} stroke="var(--text-2)" strokeWidth={k % labelEvery === 0 ? 1.4 : 0.6} />
                {k % labelEvery === 0 && m < 256 && <T x={sx(m)} y={86} size={10.5} m color={m === netV ? 'var(--accent)' : 'var(--muted)'} weight={m === netV ? 700 : 500}>{m}</T>}
              </g>
            ))}
            <T x={sx(256)} y={86} size={10.5} m color="var(--muted)">256</T>
            <path d={`M${sx(v + 0.5)} 30 l-6 -9 h12 z`} fill="var(--warn)" />
            <T x={sx(v + 0.5)} y={18} size={12} weight={700} color="var(--warn)" m>{v}</T>
            <T x={W / 2} y={118} size={12} color="var(--text-2)">{v} cade în blocul [{netV} … {netV + block - 1}] → rețeaua are {netV} în octetul {oi}, broadcast-ul {netV + block - 1}</T>
          </svg>
          <ol className="small" style={{ marginTop: 8 }}>
            <li>Masca /{p} = <b className="mono">{r.mask}</b>. Octetul interesant (nici 255, nici 0) este al <b>{oi}</b>-lea, cu valoarea <b>{maskOct}</b>.</li>
            <li>Magic number (dimensiunea blocului) = 256 − {maskOct} = <b>{block}</b>. Rețelele încep la 0, {block}, {2 * block}{nBlocks > 3 ? `, ${3 * block}…` : ''}</li>
            <li>Valoarea IP-ului în octetul {oi} este <b>{v}</b>. Cel mai mare multiplu de {block} ≤ {v} este <b>{netV}</b>.</li>
            <li>Rețea: octeții din stânga se copiază, octetul {oi} devine {netV}, cei din dreapta devin 0 → <b className="mono">{r.network}</b>.</li>
            <li>Broadcast: octetul {oi} devine {netV} + {block} − 1 = {netV + block - 1}, cei din dreapta 255 → <b className="mono">{r.broadcast}</b>.</li>
            <li>Gazde: <b className="mono">{r.first}</b> – <b className="mono">{r.last}</b> ({r.hosts.toLocaleString('ro-RO')} utilizabile).</li>
          </ol>
        </>
      ) : (
        <p className="small">Prefixul /{p} cade pe granița de octet: nu există octet „interesant”. Octeții cu 255 în mască se copiază, cei cu 0 devin 0 (rețea) sau 255 (broadcast): rețea <b className="mono">{r.network}</b>, broadcast <b className="mono">{r.broadcast}</b>.</p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   7) FLSM — împarte un /24 în N subrețele egale (interactiv)
---------------------------------------------------------------- */
export function FlsmSplitter() {
  const [n, setN] = useState(4);
  const s = Math.log2(n), prefix = 24 + s, size = 256 / n, hosts = size - 2;
  const W = 720, x0 = 20, w = W - 40;
  const base = ipToInt('192.168.1.0')!;
  return (
    <div>
      <div className="segmented" role="group" aria-label="Număr de subrețele" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        {[2, 4, 8, 16, 32, 64].map((k) => <button key={k} className={n === k ? 'on' : ''} onClick={() => setN(k)}>{k}</button>)}
      </div>
      <svg viewBox={`0 0 ${W} 96`} role="img" aria-label={`192.168.1.0/24 împărțit în ${n} subrețele /${prefix}`}>
        {Array.from({ length: n }, (_, i) => (
          <g key={i}>
            <rect x={x0 + (i * w) / n} y={14} width={w / n} height={40} fill={PALETTE[i % 4]} fillOpacity={0.18} stroke={PALETTE[i % 4]} strokeWidth={1} />
            {w / n > 34 && <T x={x0 + (i * w) / n + w / n / 2} y={39} size={w / n > 60 ? 12 : 10} m weight={650}>.{i * size}</T>}
          </g>
        ))}
        <T x={x0} y={74} size={10.5} anchor="start" m color="var(--muted)">192.168.1.0</T>
        <T x={x0 + w} y={74} size={10.5} anchor="end" m color="var(--muted)">192.168.1.255</T>
        <T x={W / 2} y={90} size={11.5} color="var(--text-2)">{s} biți împrumutați → {n} subrețele /{prefix} · bloc {size} · {hosts} gazde fiecare</T>
      </svg>
      <div className="table-wrap" style={{ marginTop: 8 }}><table className="t">
        <thead><tr><th>#</th><th>Rețea</th><th>Prima gazdă</th><th>Ultima gazdă</th><th>Broadcast</th></tr></thead>
        <tbody>
          {Array.from({ length: Math.min(n, 6) }, (_, i) => {
            const r = calc(intToIp(base + i * size), prefix)!;
            return <tr key={i}><td>{i + 1}</td><td className="mono">{r.network}/{prefix}</td><td className="mono">{r.first}</td><td className="mono">{r.last}</td><td className="mono">{r.broadcast}</td></tr>;
          })}
          {n > 6 && <tr><td colSpan={5} className="muted small">… încă {n - 6} subrețele, din {size} în {size}, ultima: <span className="mono">192.168.1.{256 - size}/{prefix}</span></td></tr>}
        </tbody>
      </table></div>
    </div>
  );
}

/* ---------------------------------------------------------------
   8) VLSM — alocator vizual de blocuri (interactiv, pas cu pas)
---------------------------------------------------------------- */
type Need = { name: string; hosts: number };
type Alloc = { need: Need; prefix: number; start: number; size: number; gapBefore: number } | { need: Need; prefix: number; fail: true };

function prefixFor(hosts: number, use31: boolean) {
  if (hosts <= 1) return 32;
  if (hosts === 2 && use31) return 31;
  let h = 2;
  while (2 ** h - 2 < hosts && h < 32) h++;
  return 32 - h;
}
export function allocateVlsm(baseIp: string, basePrefix: number, needs: Need[], largestFirst: boolean, use31 = false) {
  const base = ipToInt(baseIp);
  if (base == null) return null;
  const total = 2 ** (32 - basePrefix);
  const start0 = base - (base % total);
  const list = largestFirst ? [...needs].sort((a, b) => b.hosts - a.hosts) : needs;
  let ptr = start0; const out: Alloc[] = [];
  for (const need of list) {
    const prefix = prefixFor(need.hosts, use31);
    const size = 2 ** (32 - prefix);
    const start = Math.ceil((ptr - start0) / size) * size + start0;
    if (prefix < basePrefix || start + size > start0 + total) { out.push({ need, prefix, fail: true }); continue; }
    out.push({ need, prefix, start, size, gapBefore: start - ptr });
    ptr = start + size;
  }
  return { start0, total, out, end: ptr };
}

const DEFAULT_NEEDS: Need[] = [{ name: 'WAN R1–R2', hosts: 2 }, { name: 'LAN-C', hosts: 12 }, { name: 'LAN-A', hosts: 60 }, { name: 'LAN-B', hosts: 28 }];

export function VlsmAllocator() {
  const [base, setBase] = useState('192.168.10.0/24');
  const [needs, setNeeds] = useState<Need[]>(DEFAULT_NEEDS);
  const [largest, setLargest] = useState(true);
  const [use31, setUse31] = useState(false);
  const [step, setStep] = useState<number | null>(null); // null = toate
  const [bIp, bPx] = base.split('/');
  const bp = Number(bPx);
  const valid = ipToInt(bIp ?? '') != null && Number.isInteger(bp) && bp >= 8 && bp <= 30;
  const res = useMemo(() => (valid ? allocateVlsm(bIp, bp, needs.filter((x) => x.hosts > 0), largest, use31) : null), [bIp, bp, needs, largest, use31, valid]);
  const W = 720, x0 = 16, w = W - 32;
  const shown = res ? (step == null ? res.out : res.out.slice(0, step)) : [];
  const sx = (a: number) => x0 + ((a - (res?.start0 ?? 0)) / (res?.total ?? 1)) * w;
  const short = (a: number) => { const s = intToIp(a).split('.'); return bp >= 24 ? '.' + s[3] : `.${s[2]}.${s[3]}`; };
  const ok = shown.filter((a): a is Extract<Alloc, { start: number }> => !('fail' in a));
  const gaps = ok.reduce((g, a) => g + a.gapBefore, 0);
  const used = ok.reduce((g, a) => g + a.size, 0);
  const cur = step != null && step > 0 ? res?.out[step - 1] : undefined;
  const upd = (i: number, k: keyof Need, v: string) => setNeeds(needs.map((x, j) => (j === i ? { ...x, [k]: k === 'hosts' ? Math.max(0, Math.min(1_000_000, parseInt(v || '0', 10) || 0)) : v } : x)));
  return (
    <div>
      <div className="grid c2" style={{ gap: 12 }}>
        <label className="field">Blocul de împărțit (rețea/prefix)<input className="input mono" value={base} onChange={(e) => { setBase(e.target.value); setStep(null); }} /></label>
        <div className="field">Ordinea de alocare
          <div className="segmented" role="group" aria-label="Ordinea de alocare">
            <button className={largest ? 'on' : ''} onClick={() => { setLargest(true); setStep(null); }}>cele mai mari primele</button>
            <button className={!largest ? 'on' : ''} onClick={() => { setLargest(false); setStep(null); }}>în ordinea din listă</button>
          </div>
        </div>
      </div>
      <div style={{ margin: '12px 0' }}>
        {needs.map((nd, i) => (
          <div key={i} className="row" style={{ gap: 8, marginBottom: 6, flexWrap: 'nowrap' }}>
            <input className="input" style={{ flex: '1 1 0', minWidth: 0, padding: '5px 8px' }} value={nd.name} aria-label="nume subrețea" onChange={(e) => upd(i, 'name', e.target.value)} />
            <input className="input mono" style={{ width: 84, padding: '5px 8px' }} inputMode="numeric" value={nd.hosts} aria-label="gazde necesare" onChange={(e) => { upd(i, 'hosts', e.target.value); setStep(null); }} />
            <span className="tiny muted" style={{ width: 40 }}>gazde</span>
            <button type="button" className="btn sm" aria-label="șterge" onClick={() => { setNeeds(needs.filter((_, j) => j !== i)); setStep(null); }} disabled={needs.length <= 1}>×</button>
          </div>
        ))}
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn sm" disabled={needs.length >= 8} onClick={() => { setNeeds([...needs, { name: `NET-${needs.length + 1}`, hosts: 10 }]); setStep(null); }}>+ subrețea</button>
          <button type="button" className="btn sm" onClick={() => { setNeeds(DEFAULT_NEEDS); setBase('192.168.10.0/24'); setStep(null); setUse31(false); setLargest(true); }}>exemplul din lecție</button>
          <label className="check small"><input type="checkbox" checked={use31} onChange={(e) => { setUse31(e.target.checked); setStep(null); }} />/31 pentru legăturile de 2 gazde</label>
        </div>
      </div>
      {!res ? <p className="small" style={{ color: 'var(--bad)' }}>Introdu un bloc valid, de exemplu 192.168.10.0/24 (prefix între /8 și /30).</p> : (
        <>
          <svg viewBox={`0 0 ${W} 110`} role="img" aria-label="Harta blocului de adrese cu subrețelele alocate">
            <defs>
              <pattern id="vlsmGap" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="var(--surface-3)" /><line x1="0" y1="0" x2="0" y2="8" stroke="var(--bad)" strokeWidth="3" strokeOpacity="0.55" />
              </pattern>
            </defs>
            <rect x={x0} y={18} width={w} height={46} rx={6} fill="var(--surface-3)" stroke="var(--border)" />
            {ok.map((a, i) => {
              const idx = res.out.indexOf(a);
              const color = PALETTE[idx % PALETTE.length];
              const gx = sx(a.start - a.gapBefore), x = sx(a.start), ww = Math.max(2, sx(a.start + a.size) - x);
              return (
                <g key={i}>
                  {a.gapBefore > 0 && <rect x={gx} y={18} width={x - gx} height={46} fill="url(#vlsmGap)" />}
                  <rect x={x} y={18} width={ww} height={46} fill={color} fillOpacity={cur === a ? 0.38 : 0.2} stroke={color} strokeWidth={cur === a ? 2.5 : 1.2} />
                  {ww > 46 && <T x={x + ww / 2} y={38} size={ww > 90 ? 11.5 : 9.5} weight={650}>{a.need.name}</T>}
                  {ww > 30 && <T x={x + ww / 2} y={54} size={10} m color="var(--text-2)">/{a.prefix}</T>}
                  <line x1={x} y1={64} x2={x} y2={72} stroke="var(--text-2)" />
                  {(ww > 22 || i === 0) && <T x={x + 2} y={84} size={10} m anchor="start" color="var(--muted)">{short(a.start)}</T>}
                </g>
              );
            })}
            <T x={x0 + w} y={84} size={10} m anchor="end" color="var(--muted)">{short(res.start0 + res.total - 1)}</T>
            <T x={x0} y={104} size={11} anchor="start" color="var(--text-2)">
              {`folosit ${used} · găuri ${gaps} · liber ${res.total - used - gaps} din ${res.total} adrese`}
            </T>
          </svg>
          {cur && (
            <div className="callout tip" style={{ marginTop: 6 }}><div className="small">
              {'fail' in cur
                ? <><b>Pasul {step}: {cur.need.name}</b> ({cur.need.hosts} gazde) are nevoie de /{cur.prefix}, dar nu mai încape în bloc.</>
                : <><b>Pasul {step}: {cur.need.name}</b> — {cur.need.hosts} gazde → cel mai mic h cu 2^h − 2 ≥ {cur.need.hosts}: {cur.prefix === 31 ? '/31 (legătură punct-la-punct, RFC 3021)' : <>h = {32 - cur.prefix} (2^{32 - cur.prefix} − 2 = {2 ** (32 - cur.prefix) - 2})</>} → <b>/{cur.prefix}</b>, bloc {cur.size}.
                  Prima adresă liberă multiplu de {cur.size} este <b className="mono">{intToIp(cur.start)}</b>{cur.gapBefore > 0 ? <> — rămâne o <b style={{ color: 'var(--bad)' }}>gaură de {cur.gapBefore} adrese</b> (blocul trebuie să înceapă la un multiplu al mărimii lui).</> : '.'}</>}
            </div></div>
          )}
          <div className="controls">
            <button type="button" className="btn sm" onClick={() => setStep(0)}>⟲ de la zero</button>
            <button type="button" className="btn sm primary" disabled={step != null && step >= res.out.length} onClick={() => setStep((s) => (s == null ? 1 : s + 1))}>Pasul următor →</button>
            <button type="button" className="btn sm" onClick={() => setStep(null)}>arată tot</button>
            <span className="small muted">{step == null ? 'toate alocările' : `pasul ${step} din ${res.out.length}`}</span>
          </div>
          <div className="table-wrap" style={{ marginTop: 10 }}><table className="t">
            <thead><tr><th>Subrețea</th><th>Nevoie</th><th>Prefix</th><th>Rețea</th><th>Gazde</th><th>Broadcast</th><th>Utilizabile</th></tr></thead>
            <tbody>
              {shown.map((a, i) => {
                if ('fail' in a) return <tr key={i}><td>{a.need.name}</td><td>{a.need.hosts}</td><td>/{a.prefix}</td><td colSpan={4} style={{ color: 'var(--bad)' }}>nu încape — blocul e prea mic</td></tr>;
                const r = calc(intToIp(a.start), a.prefix)!;
                return (
                  <tr key={i}><td><span style={{ color: PALETTE[res.out.indexOf(a) % PALETTE.length], fontWeight: 700 }}>■</span> {a.need.name}</td><td>{a.need.hosts}</td><td className="mono">/{a.prefix}</td>
                    <td className="mono hl">{r.network}</td><td className="mono" style={{ whiteSpace: 'nowrap' }}>{r.first} – {r.last}</td><td className="mono">{a.prefix >= 31 ? '—' : r.broadcast}</td><td>{r.hosts}</td></tr>
                );
              })}
            </tbody>
          </table></div>
          {!largest && gaps > 0 && <p className="small" style={{ color: 'var(--bad)' }}>Vezi găurile hașurate: alocând în altă ordine decât descrescător, blocurile mari sar peste spațiu ca să ajungă la un multiplu al mărimii lor.</p>}
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   9) Sumarizare — biții comuni (static)
---------------------------------------------------------------- */
export function SummaryBits() {
  const rows = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 720 200" role="img" aria-label="172.16.0.0 până la 172.16.3.0: primii 22 de biți sunt comuni, deci sumarizarea este 172.16.0.0/22">
      {rows.map((r, i) => {
        const b = r.toString(2).padStart(8, '0');
        const y = 34 + i * 30;
        return (
          <g key={r}>
            <T x={20} y={y} size={13} anchor="start" m>172.16.{r}.0/24</T>
            <T x={190} y={y} size={13} anchor="start" m color="var(--accent)">10101100.00010000.</T>
            <T x={364} y={y} size={13} anchor="start" m color="var(--accent)">{b.slice(0, 6)}</T>
            <T x={414} y={y} size={13} anchor="start" m color="var(--warn)" weight={750}>{b.slice(6)}</T>
            <T x={432} y={y} size={13} anchor="start" m color="var(--muted)">.00000000</T>
          </g>
        );
      })}
      <line x1={411} y1={14} x2={411} y2={132} stroke="var(--bad)" strokeWidth={2} strokeDasharray="4 3" />
      <T x={300} y={156} size={12} color="var(--accent)" weight={650}>← 22 de biți identici →</T>
      <T x={470} y={156} size={12} anchor="start" color="var(--warn)" weight={650}>biții care diferă</T>
      <T x={360} y={186} size={13} weight={700}>Sumarizare: 172.16.0.0/22 (255.255.252.0) — un singur rând în tabela de rutare în loc de patru</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   10) Rute C și L create de o interfață (static)
---------------------------------------------------------------- */
export function ConnectedRoutes() {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-label="O interfață configurată creează o rută C pentru subrețea și o rută L /32 pentru adresa proprie">
      <rect x={40} y={60} width={300} height={110} rx={14} fill="var(--accent)" fillOpacity={0.08} stroke="var(--accent)" strokeDasharray="6 5" />
      <T x={190} y={84} size={12} weight={650} color="var(--accent)">C 192.168.10.0/26 — toată subrețeaua</T>
      <RouterIcon x={190} y={130} label="" />
      <circle cx={232} cy={130} r={7} fill="var(--warn)" />
      <T x={190} y={164} size={11} color="var(--text-2)">G0/0 = 192.168.10.1/26</T>
      <line x1={239} y1={130} x2={380} y2={130} stroke="var(--warn)" strokeWidth={1.4} strokeDasharray="3 3" />
      <rect x={380} y={40} width={310} height={150} rx={12} fill="var(--code-bg)" stroke="var(--border)" />
      <T x={396} y={66} size={12} anchor="start" m color="var(--text-2)">R1# show ip route connected</T>
      <T x={396} y={98} size={12} anchor="start" m color="var(--accent)">C  192.168.10.0/26 … G0/0</T>
      <T x={396} y={122} size={12} anchor="start" m color="var(--warn)">L  192.168.10.1/32 … G0/0</T>
      <T x={396} y={152} size={10.5} anchor="start" color="var(--muted)">C = „rețeaua e în spatele acestei interfețe”</T>
      <T x={396} y={170} size={10.5} anchor="start" color="var(--muted)">L = „adresa asta sunt chiar eu” (/32)</T>
      <T x={360} y={212} size={11} color="var(--muted)">Ambele rute apar automat doar când interfața are adresă ȘI este up/up.</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   11) Topologii laborator
---------------------------------------------------------------- */
export function Lab16GuidedTopology() {
  return (
    <svg viewBox="0 0 720 330" role="img" aria-label="Topologia labului ghidat: R1 cu LAN-A și LAN-B, R2 cu LAN-C, legătură WAN /30 între routere">
      <RouterIcon x={250} y={150} label="R1" sub="ISR 2911" />
      <RouterIcon x={560} y={150} label="R2" sub="ISR 2911" />
      <Wire x1={280} y1={150} x2={530} y2={150} label="WAN 192.168.10.112/30" dx={0} dy={-10} anchor="middle" />
      <T x={300} y={170} size={10} anchor="start" m color="var(--muted)">G0/2 .113</T>
      <T x={512} y={170} size={10} anchor="end" m color="var(--muted)">G0/1 .114</T>
      {/* LAN-A */}
      <Wire x1={232} y1={140} x2={120} y2={72} />
      <T x={188} y={96} size={10} anchor="start" m color="var(--muted)">G0/0 .1</T>
      <SwitchIcon x={110} y={60} label="" />
      <T x={110} y={30} size={11} weight={650} color="var(--accent)">LAN-A 192.168.10.0/26</T>
      <ClientIcon x={40} y={120} kind="pc" label="PC-A1 .10" /><ClientIcon x={110} y={120} kind="pc" label="PC-A2 .11" />
      <Wire x1={96} y1={72} x2={44} y2={106} /><Wire x1={110} y1={72} x2={110} y2={106} />
      {/* LAN-B */}
      <Wire x1={232} y1={160} x2={120} y2={236} />
      <T x={188} y={214} size={10} anchor="start" m color="var(--muted)">G0/1 .65</T>
      <SwitchIcon x={110} y={248} label="" />
      <T x={110} y={322} size={11} weight={650} color="var(--info)">LAN-B 192.168.10.64/27</T>
      <ClientIcon x={60} y={292} kind="pc" label="" /><T x={60} y={312} size={10} color="var(--text-2)">PC-B1 .70</T>
      <Wire x1={104} y1={260} x2={66} y2={280} />
      {/* LAN-C */}
      <Wire x1={580} y1={160} x2={620} y2={236} />
      <T x={612} y={204} size={10} anchor="start" m color="var(--muted)">G0/0 .97</T>
      <SwitchIcon x={630} y={248} label="" />
      <T x={630} y={322} size={11} weight={650} color="var(--violet)">LAN-C 192.168.10.96/28</T>
      <ClientIcon x={680} y={292} kind="pc" label="" /><T x={680} y={312} size={10} color="var(--text-2)">PC-C1 .100</T>
      <Wire x1={640} y1={260} x2={676} y2={280} />
      <T x={110} y={46} size={10} color="var(--muted)">SW-A (2960)</T>
      <T x={110} y={276} size={10} color="var(--muted)">SW-B</T>
      <T x={630} y={276} size={10} color="var(--muted)">SW-C</T>
    </svg>
  );
}
export function Lab16SoloTopology() {
  return (
    <svg viewBox="0 0 720 300" role="img" aria-label="Topologia labului solo: HQ cu două LAN-uri, Branch cu un LAN, o legătură WAN și câte un loopback pe fiecare router">
      <RouterIcon x={260} y={140} label="HQ" sub="Lo0 = ?/32" />
      <RouterIcon x={540} y={140} label="BRANCH" sub="Lo0 = ?/32" />
      <Wire x1={290} y1={140} x2={510} y2={140} label="WAN (2 gazde)" dx={0} dy={-10} anchor="middle" />
      <Wire x1={240} y1={130} x2={130} y2={70} /><SwitchIcon x={110} y={60} label="" />
      <T x={110} y={30} size={11} weight={650} color="var(--accent)">SALES — 200 gazde</T>
      <ClientIcon x={60} y={118} kind="pc" label="PC-S" /><Wire x1={100} y1={72} x2={64} y2={104} />
      <Wire x1={240} y1={150} x2={130} y2={220} /><SwitchIcon x={110} y={230} label="" />
      <T x={110} y={292} size={11} weight={650} color="var(--info)">ENG — 100 gazde</T>
      <ClientIcon x={60} y={262} kind="pc" label="" /><Wire x1={100} y1={242} x2={66} y2={252} />
      <Wire x1={560} y1={150} x2={620} y2={220} /><SwitchIcon x={630} y={230} label="" />
      <T x={630} y={292} size={11} weight={650} color="var(--violet)">BR-LAN — 50 gazde</T>
      <ClientIcon x={685} y={262} kind="pc" label="" /><Wire x1={640} y1={242} x2={680} y2={252} />
      <T x={400} y={40} size={12} weight={650}>Bloc alocat: 172.20.0.0/22</T>
      <T x={400} y={58} size={11} color="var(--muted)">tu proiectezi planul VLSM</T>
    </svg>
  );
}
