import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';

/* Diagrame originale pentru 1.7 Describe private IPv4 addressing.
   Culori DOAR prin variabile CSS (merg în ambele teme). */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
const Wire = ({ x1, y1, x2, y2, dash, color }: { x1: number; y1: number; x2: number; y2: number; dash?: boolean; color?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color ?? 'var(--text-2)'} strokeWidth={2} strokeDasharray={dash ? '5 5' : undefined} />
);
const Cloud = ({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) => (
  <g>
    <path d={`M${x - 50} ${y + 18} a 22 22 0 0 1 4 -40 a 28 28 0 0 1 50 -10 a 24 24 0 0 1 44 16 a 18 18 0 0 1 2 34 z`} fill="var(--surface-3)" stroke="var(--border-strong)" strokeWidth={1.5} />
    {label && <T x={x + 2} y={y + 2} weight={650}>{label}</T>}
    {sub && <T x={x + 2} y={y + 36} size={10.5} color="var(--muted)">{sub}</T>}
  </g>
);
export const ServerIcon = ({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) => (
  <g>
    <rect x={x - 14} y={y - 20} width={28} height={40} rx={3} fill="var(--surface-3)" stroke="var(--ok)" strokeWidth={1.5} />
    <path d={`M${x - 9} ${y - 10} h18 M${x - 9} ${y - 2} h18 M${x - 9} ${y + 6} h18`} stroke="var(--ok)" strokeWidth={1.3} />
    {label && <T x={x} y={y + 36} weight={650}>{label}</T>}
    {sub && <T x={x} y={y + 50} size={10.5} color="var(--muted)">{sub}</T>}
  </g>
);

/* ---------------------------------------------------------------
   Cronologia epuizării IPv4 (interactivă)
---------------------------------------------------------------- */
const EVENTS: { d: string; y: string; n: string; c: string; t: string }[] = [
  { d: 'sept. 1981', y: '1981', n: 'RFC 791', c: 'var(--info)', t: 'IPv4 este standardizat cu adrese de 32 de biți → 2³² = 4.294.967.296 de adrese. Pe atunci Internetul avea câteva sute de calculatoare, așa că spațiul părea inepuizabil. Adresele se dădeau pe clase (A = /8, B = /16, C = /24) — o risipă uriașă (vezi 1.6).' },
  { d: 'sept. 1993', y: '1993', n: 'CIDR', c: 'var(--ok)', t: 'RFC 1518/1519 renunță la clase: un prefix poate avea orice lungime (/19, /22…). Organizațiile primesc exact cât le trebuie, iar ISP-urile pot agrega rute. Prima „frână” importantă a epuizării.' },
  { d: '1994', y: '1994', n: 'RFC 1597 + NAT', c: 'var(--ok)', t: 'RFC 1597 (martie 1994) rezervă pentru prima dată blocuri pentru rețele private; RFC 1631 (mai 1994) descrie NAT-ul. Ideea: rețelele interne nu au nevoie de adrese unice global — doar marginea care iese pe Internet.' },
  { d: 'feb. 1996', y: '1996', n: 'RFC 1918', c: 'var(--accent)', t: 'RFC 1918 (BCP 5) înlocuiește RFC 1597 și fixează cele trei blocuri private folosite și astăzi: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Împreună cu NAT/PAT, a permis ca miliarde de dispozitive să stea în spatele unui număr mic de adrese publice.' },
  { d: 'dec. 1998', y: '1998', n: 'IPv6', c: 'var(--violet)', t: 'RFC 2460 specifică IPv6, cu adrese de 128 de biți — soluția pe termen lung (actualizată în 2017 ca standard Internet complet, RFC 8200). Adopția a fost lentă, tocmai pentru că NAT „rezolva” problema pe moment. Detalii în 1.8 și 1.9.' },
  { d: '3 feb. 2011', y: '2011', n: 'IANA: 0', c: 'var(--bad)', t: 'Pe 31 ianuarie 2011 IANA a alocat două /8 către APNIC, ceea ce a declanșat politica globală de distribuire a ultimelor cinci /8 — câte unul pentru fiecare RIR. Pe 3 februarie 2011 s-a anunțat oficial: rezerva liberă centrală de IPv4 este epuizată.' },
  { d: 'apr. 2011', y: '2011', n: 'APNIC', c: 'var(--warn)', t: 'APNIC (Asia-Pacific, regiunea cu cea mai rapidă creștere) ajunge primul la ultimul său /8 și trece la raționalizare: fiecare membru mai poate primi doar un bloc mic.' },
  { d: 'apr. 2012', y: '2012', n: 'RFC 6598', c: 'var(--accent)', t: 'Se rezervă 100.64.0.0/10 („Shared Address Space”) pentru CGNAT: ISP-urile pot pune abonații în spatele unui NAT propriu fără să intre în conflict cu rețelele RFC 1918 ale clienților.' },
  { d: 'sept. 2012', y: '2012', n: 'RIPE NCC', c: 'var(--warn)', t: 'RIPE NCC (Europa, inclusiv România) începe să aloce din ultimul său /8: fiecare LIR mai poate primi doar un /22 (1.024 de adrese), o singură dată.' },
  { d: 'iun. 2014', y: '2014', n: 'LACNIC', c: 'var(--warn)', t: 'LACNIC (America Latină și Caraibe) intră în faza finală de epuizare. AFRINIC a urmat, în faze, începând din 2017.' },
  { d: 'sept. 2015', y: '2015', n: 'ARIN', c: 'var(--warn)', t: 'ARIN (America de Nord) își epuizează rezerva liberă; de atunci, solicitanții intră pe o listă de așteptare pentru adrese recuperate sau cumpără adrese pe piața de transferuri.' },
  { d: '25 nov. 2019', y: '2019', n: 'RIPE: final', c: 'var(--bad)', t: '„Today, at 15:35 (UTC+1) on 25 November 2019, we made our final /22 IPv4 allocation…” Din acest moment RIPE NCC are doar o listă de așteptare pentru adrese recuperate, accesibilă numai LIR-urilor care nu au primit niciodată IPv4, și doar câte un /24 (256 de adrese).' },
];
export function ExhaustionTimeline() {
  const [sel, setSel] = useState(5);
  const x0 = 40, step = 680 / (EVENTS.length - 1);
  return (
    <>
      <svg viewBox="0 0 760 190" role="img" aria-label="Cronologia epuizării adreselor IPv4">
        <line x1={x0} x2={x0 + 680} y1={95} y2={95} stroke="var(--border-strong)" strokeWidth={2} />
        <rect x={x0 + step * 4.6} y={84} width={step * 6.8} height={22} rx={11} fill="var(--bad-soft)" />
        <T x={x0 + step * 8} y={78} size={10.5} color="var(--bad)" weight={650}>epuizarea, regiune cu regiune</T>
        {EVENTS.map((e, i) => {
          const x = x0 + i * step; const up = i % 2 === 0; const on = i === sel;
          return (
            <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label={`${e.d} ${e.n}`}
              onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setSel(i); } }}>
              <rect x={x - 28} y={up ? 22 : 104} width={56} height={64} fill="transparent" />
              <line x1={x} x2={x} y1={up ? 60 : 104} y2={up ? 86 : 130} stroke={e.c} strokeWidth={on ? 2.4 : 1.2} />
              <circle cx={x} cy={95} r={on ? 9 : 6} fill={e.c} stroke="var(--surface)" strokeWidth={2} style={{ transition: 'r .2s' }} />
              <T x={x} y={up ? 40 : 146} size={11} color="var(--muted)">{e.y}</T>
              <T x={x} y={up ? 55 : 161} size={on ? 12 : 11} weight={on ? 750 : 600} color={on ? e.c : 'var(--text-2)'}>{e.n}</T>
            </g>
          );
        })}
        <T x={380} y={185} size={10.5} color="var(--muted)">Click pe un eveniment pentru detalii (axa nu este la scară: evenimentele sunt egal distanțate).</T>
      </svg>
      <div className="callout info" style={{ marginTop: 8, minHeight: 76 }}>
        <div><b>{EVENTS[sel].d} — {EVENTS[sel].n}</b><div className="small">{EVENTS[sel].t}</div></div>
      </div>
      <div className="controls">
        <button className="btn sm" onClick={() => setSel(Math.max(0, sel - 1))} disabled={sel === 0}>← Anterior</button>
        <button className="btn sm primary" onClick={() => setSel(Math.min(EVENTS.length - 1, sel + 1))} disabled={sel === EVENTS.length - 1}>Următor →</button>
        <span className="small muted">{sel + 1}/{EVENTS.length}</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   Harta celor 256 de blocuri /8 (interactivă)
---------------------------------------------------------------- */
type Cat = { k: string; label: string; color: string };
const CATS: Record<string, Cat> = {
  pub: { k: 'pub', label: 'public (alocat prin IANA → RIR-uri)', color: 'var(--surface-3)' },
  priv: { k: 'priv', label: 'privat RFC 1918 (integral sau parțial)', color: 'var(--accent)' },
  spec: { k: 'spec', label: 'conține blocuri speciale (CGNAT, APIPA, documentație…)', color: 'var(--warn)' },
  loop: { k: 'loop', label: '0/8 „this network” și 127/8 loopback', color: 'var(--violet)' },
  mc: { k: 'mc', label: 'multicast 224–239 (fostă clasa D)', color: 'var(--info)' },
  res: { k: 'res', label: 'rezervat 240–255 (fostă clasa E)', color: 'var(--bad)' },
};
const NOTE: Record<number, string> = {
  0: '0.0.0.0/8 — „this network” (RFC 791). 0.0.0.0 e adresa sursă a unui client DHCP care încă nu are IP. Nu confunda cu 0.0.0.0/0 = ruta implicită.',
  10: '10.0.0.0/8 — întregul /8 este privat (RFC 1918): 16.777.216 adrese. Preferat în rețelele mari (enterprise, data center).',
  100: '100.0.0.0/8 — doar sfertul 100.64.0.0/10 (100.64.0.0 – 100.127.255.255) este Shared Address Space pentru CGNAT (RFC 6598). Restul (100.0–100.63, 100.128–100.255) e public.',
  127: '127.0.0.0/8 — loopback: „eu însumi”. 127.0.0.1 nu părăsește niciodată hostul. Un /8 întreg pentru o singură funcție — moștenire a epocii classful.',
  169: '169.0.0.0/8 — doar 169.254.0.0/16 este link-local (APIPA, RFC 3927). Restul este public.',
  172: '172.0.0.0/8 — doar 172.16.0.0/12 (172.16.x.x – 172.31.x.x) este privat. 172.0–172.15 și 172.32–172.255 sunt PUBLICE.',
  192: '192.0.0.0/8 — conține 192.168.0.0/16 (privat), 192.0.2.0/24 (TEST-NET-1, documentație) și 192.0.0.0/24 (IETF). Restul e public.',
  198: '198.0.0.0/8 — conține 198.18.0.0/15 (benchmarking, RFC 2544) și 198.51.100.0/24 (TEST-NET-2). Restul e public.',
  203: '203.0.0.0/8 — conține 203.0.113.0/24 (TEST-NET-3, documentație). Restul e public.',
};
const catOf = (n: number): Cat => {
  if (n === 10 || n === 172 || n === 192) return CATS.priv;
  if (n === 100 || n === 169 || n === 198 || n === 203) return CATS.spec;
  if (n === 0 || n === 127) return CATS.loop;
  if (n >= 224 && n <= 239) return CATS.mc;
  if (n >= 240) return CATS.res;
  return CATS.pub;
};
export function AddressGrid() {
  const [sel, setSel] = useState<number | null>(172);
  const cw = 40, ch = 22, ox = 24, oy = 16;
  const info = (n: number) => NOTE[n] ?? (n >= 224 && n <= 239 ? `${n}.0.0.0/8 — parte din 224.0.0.0/4, multicast (un pachet → un grup de receptori, ex. 224.0.0.5 = OSPF). Nu se alocă hostilor.`
    : n >= 240 ? (n === 255 ? '255.0.0.0/8 — parte din 240.0.0.0/4 (rezervat). Conține 255.255.255.255 = limited broadcast, care nu trece niciodată de un router.' : `${n}.0.0.0/8 — parte din 240.0.0.0/4, rezervat „pentru utilizare viitoare” (fosta clasa E). Neutilizabil în practică: multe sisteme îl refuză.`)
      : `${n}.0.0.0/8 — spațiu public obișnuit: alocat de IANA unui RIR (sau, istoric, direct unei organizații), apoi ISP-urilor și clienților.`);
  return (
    <>
      <svg viewBox="0 0 690 400" role="img" aria-label="Harta celor 256 de blocuri /8 ale IPv4">
        {Array.from({ length: 256 }, (_, n) => {
          const c = catOf(n); const x = ox + (n % 16) * cw; const y = oy + Math.floor(n / 16) * ch; const on = sel === n;
          const full = c.k === 'pub' ? 0 : n === 10 || c.k === 'mc' || c.k === 'res' || c.k === 'loop' ? 0.55 : 0.28;
          return (
            <g key={n} onClick={() => setSel(n)} style={{ cursor: 'pointer' }}>
              <rect x={x} y={y} width={cw - 3} height={ch - 3} rx={3} fill={c.color} fillOpacity={c.k === 'pub' ? 1 : full}
                stroke={on ? 'var(--text)' : 'var(--border)'} strokeWidth={on ? 2 : 0.6} />
              <T x={x + (cw - 3) / 2} y={y + 14} size={9.5} color={on ? 'var(--text)' : 'var(--text-2)'} weight={on ? 700 : 500} m>{n}</T>
            </g>
          );
        })}
        <T x={345} y={378} size={10.5} color="var(--muted)">Fiecare pătrat = un /8 (16.777.216 adrese). Rândul = 16 blocuri consecutive.</T>
      </svg>
      <div className="row" style={{ flexWrap: 'wrap', gap: '6px 14px', margin: '6px 0 8px' }}>
        {Object.values(CATS).map((c) => (
          <span key={c.k} className="small" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: c.color, opacity: c.k === 'pub' ? 1 : 0.7, border: '1px solid var(--border)' }} />{c.label}
          </span>
        ))}
      </div>
      <div className="callout tip" style={{ minHeight: 60 }}>
        <div>{sel === null ? 'Click pe un pătrat (= primul octet).' : <><b>{sel}.x.x.x</b><div className="small">{info(sel)}</div></>}</div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   172.16.0.0/12 — de ce doar 172.16–172.31 (slider + binar)
---------------------------------------------------------------- */
const bin8 = (n: number) => n.toString(2).padStart(8, '0');
export function Block172() {
  const [o2, setO2] = useState(32);
  const priv = o2 >= 16 && o2 <= 31;
  const b = bin8(o2);
  const W = 680, x0 = 40, cell = W / 256;
  return (
    <>
      <svg viewBox="0 0 760 210" role="img" aria-label="Al doilea octet în 172.x.x.x și blocul /12">
        <T x={x0} y={22} anchor="start" weight={650}>Al doilea octet al adresei 172.<tspan style={{ fill: 'var(--accent)' }}>x</tspan>.0.0 (0 → 255)</T>
        {Array.from({ length: 256 }, (_, i) => (
          <rect key={i} x={x0 + i * cell} y={34} width={cell} height={26} fill={i >= 16 && i <= 31 ? 'var(--accent)' : 'var(--surface-3)'} fillOpacity={i >= 16 && i <= 31 ? 0.7 : 1} />
        ))}
        <rect x={x0} y={34} width={W} height={26} fill="none" stroke="var(--border-strong)" />
        <line x1={x0 + o2 * cell + cell / 2} x2={x0 + o2 * cell + cell / 2} y1={28} y2={66} stroke={priv ? 'var(--ok)' : 'var(--bad)'} strokeWidth={2.5} />
        <T x={x0 + 16 * cell} y={80} size={10.5} anchor="start" color="var(--accent)" weight={650}>16 … 31 = privat</T>
        <T x={x0} y={80} size={10.5} anchor="start" color="var(--muted)">0</T>
        <T x={x0 + W} y={80} size={10.5} anchor="end" color="var(--muted)">255</T>
        <T x={x0 + 140} y={80} size={10.5} anchor="start" color="var(--muted)">32 … 255 = public</T>

        <T x={x0} y={112} anchor="start" size={12} color="var(--muted)">Prefixul /12 = primii 12 biți sunt ficși:</T>
        <T x={x0} y={140} anchor="start" size={15} m color="var(--text-2)">172.16.0.0 = 10101100.<tspan style={{ fill: 'var(--accent)', fontWeight: 700 }}>0001</tspan>0000.00000000.00000000</T>
        <T x={x0} y={170} anchor="start" size={15} m color="var(--text)">172.{String(o2).padEnd(3, ' ')}.0.0 = 10101100.<tspan style={{ fill: priv ? 'var(--ok)' : 'var(--bad)', fontWeight: 700 }}>{b.slice(0, 4)}</tspan>{b.slice(4)}.00000000.00000000</T>
        <T x={x0} y={198} anchor="start" size={12} color={priv ? 'var(--ok)' : 'var(--bad)'} weight={650}>
          {priv ? `Primii 4 biți ai octetului 2 sunt 0001 → 172.${o2}.x.x este în 172.16.0.0/12 → PRIVAT` : `Primii 4 biți ai octetului 2 sunt ${b.slice(0, 4)} ≠ 0001 → 172.${o2}.x.x este în afara blocului → PUBLIC`}
        </T>
      </svg>
      <div className="controls">
        <label className="small" htmlFor="o172">Octetul 2:</label>
        <input id="o172" type="range" min={0} max={255} value={o2} onChange={(e) => setO2(Number(e.target.value))} style={{ flex: '1 1 180px', accentColor: 'var(--accent)' }} />
        <span className="badge mono">172.{o2}.0.0</span>
        {[15, 16, 24, 31, 32].map((v) => <button key={v} className="btn sm" onClick={() => setO2(v)}>{v}</button>)}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   Verificator: „Este adresa aceasta privată?”
---------------------------------------------------------------- */
type Verdict = { cat: string; block?: string; prefix?: number; rfc?: string; tone: 'ok' | 'warn' | 'info' | 'bad' | 'accent'; text: string; hint?: string };
export function classifyIPv4(s: string): Verdict | { error: string } {
  const parts = s.trim().split('.');
  if (parts.length !== 4 || parts.some((p) => !/^\d{1,3}$/.test(p))) return { error: 'Scrie o adresă IPv4 în formatul a.b.c.d (patru numere separate prin punct).' };
  const o = parts.map(Number);
  if (o.some((n) => n > 255)) return { error: `Adresă invalidă: un octet poate avea cel mult 255 (8 biți). Ai scris ${o.find((n) => n > 255)}.` };
  const [a, b, c] = o;
  if (a === 10) return { cat: 'Privată (RFC 1918)', block: '10.0.0.0/8', prefix: 8, rfc: 'RFC 1918', tone: 'accent', text: 'Blocul privat cel mai mare (16.777.216 adrese). Rutat liber în interiorul organizației, filtrat pe Internet — iese doar prin NAT/PAT.' };
  if (a === 172 && b >= 16 && b <= 31) return { cat: 'Privată (RFC 1918)', block: '172.16.0.0/12', prefix: 12, rfc: 'RFC 1918', tone: 'accent', text: 'Intervalul 172.16.0.0 – 172.31.255.255 (1.048.576 adrese). Al doilea octet între 16 și 31.' };
  if (a === 192 && b === 168) return { cat: 'Privată (RFC 1918)', block: '192.168.0.0/16', prefix: 16, rfc: 'RFC 1918', tone: 'accent', text: 'Blocul tipic al rețelelor de acasă/SOHO (65.536 adrese). Routerele de acasă folosesc frecvent 192.168.0.0/24 sau 192.168.1.0/24.' };
  if (a === 100 && b >= 64 && b <= 127) return { cat: 'Shared Address Space (CGNAT) — NU e RFC 1918', block: '100.64.0.0/10', prefix: 10, rfc: 'RFC 6598', tone: 'warn', text: 'Folosită de ISP între CGN și routerele abonaților. Nu e rutabilă pe Internet, dar nici „privată” în sensul RFC 1918. Dacă routerul tău are pe WAN o astfel de adresă, ești în spatele CGNAT.' };
  if (a === 127) return { cat: 'Loopback — NU e RFC 1918', block: '127.0.0.0/8', prefix: 8, rfc: 'RFC 1122', tone: 'info', text: 'Adresa „mea însămi”: pachetul nu părăsește hostul. `ping 127.0.0.1` testează doar stiva TCP/IP locală.' };
  if (a === 169 && b === 254) return { cat: 'Link-local / APIPA — NU e RFC 1918', block: '169.254.0.0/16', prefix: 16, rfc: 'RFC 3927', tone: 'warn', text: 'Adresa pe care și-o dă singur un client când nu primește răspuns de la DHCP. Funcționează doar pe segmentul local, fără gateway. Reflex de troubleshooting: 169.254 = DHCP a eșuat.' };
  if (a === 0) return { cat: '„This network” — specială', block: '0.0.0.0/8', prefix: 8, rfc: 'RFC 791', tone: 'info', text: 'Nu se configurează pe hosti. 0.0.0.0 apare ca sursă în DHCP Discover. Nu confunda cu 0.0.0.0/0 (ruta implicită).' };
  if (a === 192 && b === 0 && c === 2) return { cat: 'Documentație (TEST-NET-1) — NU e RFC 1918', block: '192.0.2.0/24', prefix: 24, rfc: 'RFC 5737', tone: 'info', text: 'Rezervată pentru exemple în cărți și documentație. Nu apare pe Internet.' };
  if (a === 198 && b === 51 && c === 100) return { cat: 'Documentație (TEST-NET-2) — NU e RFC 1918', block: '198.51.100.0/24', prefix: 24, rfc: 'RFC 5737', tone: 'info', text: 'Rezervată pentru exemple. În această aplicație o folosim ca „server din Internet” în laburi.' };
  if (a === 203 && b === 0 && c === 113) return { cat: 'Documentație (TEST-NET-3) — NU e RFC 1918', block: '203.0.113.0/24', prefix: 24, rfc: 'RFC 5737', tone: 'info', text: 'Rezervată pentru exemple. În această aplicație o folosim ca „IP public” al routerului de acasă.' };
  if (a === 192 && b === 0 && c === 0) return { cat: 'IETF Protocol Assignments — specială', block: '192.0.0.0/24', prefix: 24, rfc: 'RFC 6890', tone: 'info', text: 'Rezervată pentru protocoale IETF. Nu e RFC 1918 și nu se folosește în LAN-uri.' };
  if (a === 198 && (b === 18 || b === 19)) return { cat: 'Benchmarking — specială', block: '198.18.0.0/15', prefix: 15, rfc: 'RFC 2544', tone: 'info', text: 'Rezervată pentru testarea performanței echipamentelor în laborator. Nu e RFC 1918.' };
  if (a >= 224 && a <= 239) return { cat: 'Multicast — specială', block: '224.0.0.0/4', prefix: 4, rfc: 'RFC 5771', tone: 'info', text: 'Adresează un grup de receptori (ex. 224.0.0.5 = toate routerele OSPF). Nu se configurează ca adresă de host.' };
  if (o.every((n) => n === 255)) return { cat: 'Limited broadcast — specială', block: '255.255.255.255/32', prefix: 32, rfc: 'RFC 919', tone: 'info', text: 'Broadcast pe segmentul local; nu trece niciodată de un router.' };
  if (a >= 240) return { cat: 'Rezervată (fosta clasa E)', block: '240.0.0.0/4', prefix: 4, rfc: 'RFC 1112', tone: 'bad', text: 'Rezervată „pentru utilizare viitoare”. Nu o poți folosi practic.' };
  let hint: string | undefined;
  if (a === 172) hint = `Capcană! Doar 172.16.x.x – 172.31.x.x sunt private. ${a}.${b}.x.x are al doilea octet ${b < 16 ? 'sub 16' : 'peste 31'} → e publică.`;
  else if (a === 192 && b !== 168) hint = 'Capcană! Doar 192.168.x.x este privat; 192.169, 192.167 etc. sunt publice.';
  else if (a === 169) hint = 'Doar 169.254.x.x este link-local (APIPA). Restul lui 169.x este public.';
  else if (a === 100) hint = 'Doar 100.64.0.0 – 100.127.255.255 este rezervat pentru CGNAT. Restul lui 100.x este public.';
  else if (a === 11 || a === 9) hint = 'Doar 10.x.x.x este privat; 9.x și 11.x sunt publice.';
  return { cat: 'Publică', tone: 'ok', text: 'Adresă unică la nivel global, rutabilă pe Internet (dacă prefixul ei este anunțat de cineva). Nu poți s-o folosești „după bunul plac” în LAN-ul tău — aparține altcuiva.', hint };
}
const PRESETS = ['10.20.30.40', '172.15.0.1', '172.16.0.1', '172.31.255.254', '172.32.0.1', '192.168.1.1', '192.169.1.1', '100.64.0.5', '169.254.10.20', '127.0.0.1', '8.8.8.8', '203.0.113.7', '224.0.0.5', '192.168.256.1'];
export function PrivateChecker() {
  const [v, setV] = useState('172.32.0.1');
  const r = useMemo(() => classifyIPv4(v), [v]);
  const toneVar = (t: Verdict['tone']) => (t === 'accent' ? 'var(--accent)' : `var(--${t})`);
  const bits = 'error' in r ? null : v.trim().split('.').map((x) => bin8(Number(x))).join('');
  return (
    <div>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <label htmlFor="ipchk" className="small"><b>Adresă IPv4:</b></label>
        <input id="ipchk" className="input mono" value={v} onChange={(e) => setV(e.target.value)} inputMode="decimal" autoComplete="off" spellCheck={false} style={{ maxWidth: 220 }} />
      </div>
      <div className="row" style={{ gap: 6, flexWrap: 'wrap', margin: '10px 0' }}>
        {PRESETS.map((p) => <button key={p} className="btn sm mono" onClick={() => setV(p)} style={p === v ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}>{p}</button>)}
      </div>
      {'error' in r ? (
        <div className="callout warn"><div>{r.error}</div></div>
      ) : (
        <div className="card" style={{ borderColor: toneVar(r.tone), padding: 14 }}>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <b style={{ color: toneVar(r.tone), fontSize: '1.05rem' }}>{r.cat}</b>
            {r.block && <span className="badge mono">{r.block}</span>}
            {r.rfc && <span className="badge">{r.rfc}</span>}
          </div>
          <p className="small" style={{ margin: '8px 0' }}>{r.text}</p>
          {r.hint && <p className="small" style={{ margin: '8px 0', color: 'var(--warn)' }}><b>{r.hint}</b></p>}
          {bits && (
            <div className="mono small" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {[0, 1, 2, 3].map((i) => (
                <span key={i}>
                  {bits.slice(i * 8, i * 8 + 8).split('').map((ch, j) => {
                    const k = i * 8 + j; const inP = r.prefix !== undefined && k < r.prefix;
                    return <span key={j} style={inP ? { color: toneVar(r.tone), fontWeight: 700 } : { color: 'var(--muted)' }}>{ch}</span>;
                  })}{i < 3 ? '.' : ''}
                </span>
              ))}
              {r.prefix !== undefined && <div className="muted" style={{ marginTop: 4 }}>biții colorați = cei {r.prefix} biți ai prefixului {r.block}, identici pentru orice adresă din bloc</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   De ce nu se rutează adresele private pe Internet
---------------------------------------------------------------- */
export function RoutingAmbiguity() {
  return (
    <svg viewBox="0 0 760 250" role="img" aria-label="Două organizații cu aceeași rețea privată: routerul din Internet nu știe unde să trimită">
      <defs><marker id="raA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--bad)" /></marker></defs>
      <Cloud x={380} y={70} label="Internet" sub="" />
      <RouterIcon x={380} y={150} label="Router ISP" sub="tabela: 10.1.1.0/24 → ?" />
      <Wire x1={380} y1={98} x2={380} y2={136} />
      <rect x={30} y={120} width={190} height={80} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" strokeDasharray="5 4" />
      <T x={125} y={146} weight={700}>Firma A</T><T x={125} y={166} m size={12} color="var(--accent)">10.1.1.0/24</T><T x={125} y={186} size={10.5} color="var(--muted)">server 10.1.1.5</T>
      <rect x={540} y={120} width={190} height={80} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" strokeDasharray="5 4" />
      <T x={635} y={146} weight={700}>Firma B</T><T x={635} y={166} m size={12} color="var(--accent)">10.1.1.0/24</T><T x={635} y={186} size={10.5} color="var(--muted)">server 10.1.1.5</T>
      <Wire x1={220} y1={160} x2={350} y2={152} dash /><Wire x1={410} y1={152} x2={540} y2={160} dash />
      <path d="M300 60 q 30 -10 52 0" fill="none" stroke="var(--bad)" strokeWidth={2} markerEnd="url(#raA)" />
      <rect x={130} y={36} width={170} height={36} rx={8} fill="var(--surface)" stroke="var(--bad)" />
      <T x={215} y={52} size={11} m>dst 10.1.1.5</T><T x={215} y={66} size={10} color="var(--bad)">la care dintre ele?</T>
      <T x={380} y={236} size={11} color="var(--muted)">Aceleași adrese private există în milioane de rețele → nu pot fi unice în tabela globală → ISP-urile nu le rutează și le filtrează.</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   Animație: un pachet traversează routerul NAT (PAT) — pas cu pas
---------------------------------------------------------------- */
type Pt = { x: number; y: number };
const POS: Record<string, Pt> = {
  pcA: { x: 165, y: 52 }, pcB: { x: 165, y: 262 }, rtr: { x: 330, y: 70 }, net: { x: 515, y: 70 }, srv: { x: 640, y: 70 }, isp: { x: 515, y: 230 },
};
type NStep = { at: keyof typeof POS; src: string; dst: string; ch?: 'src' | 'dst'; title: string; desc: string; rows: number; drop?: boolean; ok?: boolean };
const PAT_STEPS: NStep[] = [
  { at: 'pcA', src: '192.168.1.10:49152', dst: '198.51.100.10:80', rows: 0, title: '1. PC-A trimite cererea', desc: 'PC-A deschide o pagină web pe serverul 198.51.100.10. Sursa este adresa lui privată (inside local) și un port efemer ales de sistemul de operare (49152). Destinația nu e în rețeaua lui, deci trimite cadrul la default gateway — routerul.' },
  { at: 'rtr', src: '203.0.113.2:49152', dst: '198.51.100.10:80', ch: 'src', rows: 1, title: '2. Routerul traduce sursa (inside → outside)', desc: 'Pachetul intră pe interfața „ip nat inside” și iese pe „ip nat outside”. Sursa se potrivește cu ACL-ul NAT, deci routerul înlocuiește 192.168.1.10 cu adresa lui publică 203.0.113.2 (inside global), păstrează portul dacă e liber, recalculează checksum-urile și notează traducerea în tabelă.' },
  { at: 'net', src: '203.0.113.2:49152', dst: '198.51.100.10:80', rows: 1, title: '3. Pachetul traversează Internetul', desc: 'Toate adresele din antet sunt acum publice și unice. Fiecare router din Internet decide doar după destinație (198.51.100.10), pentru care există rută în tabela globală. Nimeni de pe drum nu vede adresa privată.' },
  { at: 'srv', src: '198.51.100.10:80', dst: '203.0.113.2:49152', rows: 1, title: '4. Serverul răspunde adresei publice', desc: 'Serverul vede cererea venind de la 203.0.113.2:49152 și răspunde acolo. El nu știe nimic despre 192.168.1.10 — din perspectiva lui, clientul este routerul de acasă.' },
  { at: 'rtr', src: '198.51.100.10:80', dst: '192.168.1.10:49152', ch: 'dst', rows: 1, title: '5. Routerul traduce înapoi destinația (outside → inside)', desc: 'Răspunsul intră pe interfața outside cu destinația 203.0.113.2:49152. Routerul caută această pereche în tabela NAT, găsește 192.168.1.10:49152 și rescrie destinația. Fără intrarea din tabelă, pachetul ar fi pentru routerul însuși (și ar fi aruncat).' },
  { at: 'pcA', src: '198.51.100.10:80', dst: '192.168.1.10:49152', rows: 1, ok: true, title: '6. PC-A primește răspunsul', desc: 'PC-A primește un răspuns de la exact adresa și portul pe care le-a contactat. Pentru el, NAT-ul a fost complet transparent.' },
  { at: 'pcB', src: '192.168.1.11:49152', dst: '198.51.100.10:80', rows: 1, title: '7. PC-B deschide și el o conexiune', desc: 'PC-B, alt host din același LAN, contactează același server — întâmplător cu același port sursă 49152.' },
  { at: 'rtr', src: '203.0.113.2:1024', dst: '198.51.100.10:80', ch: 'src', rows: 2, ok: true, title: '8. PAT: aceeași adresă publică, alt port', desc: 'Perechea 203.0.113.2:49152 este deja folosită de PC-A, așa că routerul alege alt port (aici 1024). Răspunsurile vor fi deosebite după port. Așa poate o singură adresă publică să ascundă zeci de mii de conversații simultane — asta înseamnă „overload”.' },
];
const NONAT_STEPS: NStep[] = [
  { at: 'pcA', src: '192.168.1.10', dst: '198.51.100.10', rows: 0, title: '1. PC-A trimite un ping', desc: 'Sursa este adresa privată 192.168.1.10. Routerul de acasă NU are NAT configurat.' },
  { at: 'rtr', src: '192.168.1.10', dst: '198.51.100.10', rows: 0, title: '2. Routerul doar rutează', desc: 'Fără NAT, routerul trimite pachetul neschimbat pe ruta implicită spre ISP. Sursa privată pleacă „în lume”. (În realitate, multe ISP-uri îl aruncă chiar aici, la intrare, ca bogon.)' },
  { at: 'srv', src: '198.51.100.10', dst: '192.168.1.10', rows: 0, title: '3. Serverul răspunde la 192.168.1.10', desc: 'În lab, ISP-ul livrează cererea (destinația e publică). Serverul răspunde la sursa pe care a văzut-o: 192.168.1.10 — o adresă privată.' },
  { at: 'isp', src: '198.51.100.10', dst: '192.168.1.10', rows: 0, drop: true, title: '4. Routerul ISP aruncă răspunsul', desc: 'Routerul ISP-ului nu are rută spre 192.168.1.0/24 — și nici n-ar putea avea una corectă: mii de clienți folosesc aceeași rețea. Pachetul este aruncat, iar PC-A vede „Request timed out”. Exact asta vei observa în labul ghidat.' },
];
export function NatStepper() {
  const [mode, setMode] = useState<'pat' | 'none'>('pat');
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const steps = mode === 'pat' ? PAT_STEPS : NONAT_STEPS;
  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setStep((s) => { if (s >= steps.length) { setPlay(false); return s; } return s + 1; }), 2200);
    return () => clearInterval(t);
  }, [play, steps.length]);
  const cur = step > 0 ? steps[step - 1] : null;
  const p = cur ? POS[cur.at] : POS.pcA;
  const rows = [
    ['tcp', '203.0.113.2:49152', '192.168.1.10:49152', '198.51.100.10:80', '198.51.100.10:80'],
    ['tcp', '203.0.113.2:1024', '192.168.1.11:49152', '198.51.100.10:80', '198.51.100.10:80'],
  ];
  const boxW = 176, boxH = 42;
  return (
    <>
      <div className="segmented" role="group" aria-label="Mod" style={{ marginBottom: 10 }}>
        <button className={mode === 'pat' ? 'on' : ''} onClick={() => { setMode('pat'); setStep(0); setPlay(false); }}>Cu PAT (overload)</button>
        <button className={mode === 'none' ? 'on' : ''} onClick={() => { setMode('none'); setStep(0); setPlay(false); }}>Fără NAT</button>
      </div>
      <svg viewBox="0 0 760 330" role="img" aria-label="Pachet care traversează un router NAT">
        <rect x={10} y={96} width={300} height={150} rx={14} fill="var(--accent-soft)" stroke="var(--accent)" strokeOpacity={0.4} strokeDasharray="5 5" />
        <T x={24} y={238} anchor="start" size={10.5} color="var(--accent)" weight={650}>INSIDE — LAN privat 192.168.1.0/24</T>
        <rect x={360} y={96} width={390} height={150} rx={14} fill="var(--surface-2)" stroke="var(--border-strong)" strokeDasharray="5 5" />
        <T x={736} y={238} anchor="end" size={10.5} color="var(--muted)" weight={650}>OUTSIDE — adrese publice</T>
        <ClientIcon x={60} y={130} kind="pc" label="PC-A .10" />
        <ClientIcon x={60} y={195} kind="pc" label="PC-B .11" />
        <SwitchIcon x={170} y={165} />
        <Wire x1={76} y1={126} x2={140} y2={160} /><Wire x1={76} y1={192} x2={140} y2={170} /><Wire x1={202} y1={165} x2={302} y2={165} />
        <RouterIcon x={334} y={165} label="R-HOME" sub="" />
        <T x={292} y={155} anchor="end" size={9.5} color="var(--accent)">G0/0 inside · .1</T>
        <T x={372} y={155} anchor="start" size={9.5} color="var(--muted)">G0/1 outside · 203.0.113.2</T>
        <Wire x1={364} y1={165} x2={470} y2={165} />
        <Cloud x={520} y={170} label="ISP / Internet" />
        <Wire x1={570} y1={165} x2={660} y2={165} />
        <ServerIcon x={690} y={165} label="WEB" sub="198.51.100.10" />
        {mode === 'pat' && step >= 2 && <g className="fade-up"><rect x={262} y={196} width={146} height={20} rx={6} fill="var(--warn-soft)" /><T x={335} y={210} size={10} color="var(--warn)" weight={650}>tabela NAT: {Math.max(...steps.slice(0, step).map((s) => s.rows))} intrări</T></g>}
        {cur && (
          <g style={{ transform: `translate(${p.x - boxW / 2}px, ${p.y - boxH / 2}px)`, transition: 'transform .7s ease' }}>
            <rect width={boxW} height={boxH} rx={8} fill="var(--surface)" stroke={cur.drop ? 'var(--bad)' : cur.ok ? 'var(--ok)' : 'var(--accent)'} strokeWidth={1.8} />
            <text x={8} y={17} style={{ ...mono, fontSize: 11, fill: cur.ch === 'src' ? 'var(--warn)' : 'var(--text)', fontWeight: cur.ch === 'src' ? 700 : 500 }}>src {cur.src}</text>
            <text x={8} y={34} style={{ ...mono, fontSize: 11, fill: cur.ch === 'dst' ? 'var(--warn)' : 'var(--text)', fontWeight: cur.ch === 'dst' ? 700 : 500 }}>dst {cur.dst}</text>
            {cur.drop && <g><line x1={-6} y1={-6} x2={boxW + 6} y2={boxH + 6} stroke="var(--bad)" strokeWidth={3} /><line x1={boxW + 6} y1={-6} x2={-6} y2={boxH + 6} stroke="var(--bad)" strokeWidth={3} /></g>}
          </g>
        )}
        {cur?.drop && <T x={515} y={290} size={11.5} color="var(--bad)" weight={700}>R-ISP: „no route to 192.168.1.10” → drop</T>}
        <T x={380} y={322} size={10.5} color="var(--muted)">Galben = câmpul rescris de NAT la acest pas.</T>
      </svg>
      <div className={`callout ${cur?.drop ? 'warn' : 'tip'}`} style={{ marginTop: 8, minHeight: 70 }}>
        <div><b>{cur ? cur.title : mode === 'pat' ? 'Apasă „Pasul următor” sau „Redă” ca să urmărești pachetul.' : 'Ce se întâmplă dacă routerul de acasă nu face NAT?'}</b>{cur && <div className="small">{cur.desc}</div>}</div>
      </div>
      <div className="controls">
        <button className="btn sm" onClick={() => { setPlay(false); setStep(Math.max(0, step - 1)); }} disabled={step === 0}>← Înapoi</button>
        <button className="btn sm primary" onClick={() => { setPlay(false); setStep(Math.min(steps.length, step + 1)); }} disabled={step >= steps.length}>Pasul următor →</button>
        <button className="btn sm" onClick={() => { setStep(0); setPlay(true); }}>▶ Redă</button>
        <span className="small muted">Pas {step}/{steps.length}</span>
      </div>
      {mode === 'pat' && (
        <div className="table-wrap" style={{ marginTop: 10 }}>
          <table className="t mono" style={{ fontSize: '0.8rem' }}>
            <thead><tr><th>Pro</th><th>Inside global</th><th>Inside local</th><th>Outside local</th><th>Outside global</th></tr></thead>
            <tbody>
              {rows.map((r, i) => {
                const vis = cur ? i < cur.rows || (step > 0 && i < Math.max(...steps.slice(0, step).map((s) => s.rows))) : false;
                return <tr key={i} style={{ opacity: vis ? 1 : 0.18, transition: 'opacity .4s' }}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>;
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------------------
   CGNAT / NAT444
---------------------------------------------------------------- */
export function CgnatDiagram() {
  return (
    <svg viewBox="0 0 760 260" role="img" aria-label="CGNAT: două traduceri NAT succesive">
      <ClientIcon x={50} y={80} kind="pc" label="PC 192.168.1.10" />
      <ClientIcon x={50} y={160} kind="phone" label="telefon .11" />
      <Wire x1={66} y1={80} x2={170} y2={115} /><Wire x1={60} y1={160} x2={170} y2={125} />
      <RouterIcon x={200} y={120} label="CPE (router acasă)" sub="WAN 100.64.23.17" />
      <Wire x1={230} y1={120} x2={400} y2={120} />
      <RouterIcon x={430} y={120} label="CGN la ISP" sub="pool public 203.0.113.50" />
      <Wire x1={460} y1={120} x2={560} y2={120} />
      <Cloud x={630} y={124} label="Internet" />
      <rect x={160} y={30} width={80} height={24} rx={7} fill="var(--warn-soft)" /><T x={200} y={46} size={11} weight={700} color="var(--warn)">NAT #1</T>
      <rect x={390} y={30} width={80} height={24} rx={7} fill="var(--warn-soft)" /><T x={430} y={46} size={11} weight={700} color="var(--warn)">NAT #2</T>
      <rect x={18} y={196} width={180} height={34} rx={8} fill="var(--accent-soft)" /><T x={108} y={212} size={11} weight={650} color="var(--accent)">privat RFC 1918</T><T x={108} y={225} size={10} color="var(--muted)">LAN-ul tău, ales de tine</T>
      <rect x={206} y={196} width={220} height={34} rx={8} fill="var(--warn-soft)" /><T x={316} y={212} size={11} weight={650} color="var(--warn)">100.64.0.0/10 (RFC 6598)</T><T x={316} y={225} size={10} color="var(--muted)">între CPE și CGN, ales de ISP</T>
      <rect x={434} y={196} width={300} height={34} rx={8} fill="var(--surface-3)" /><T x={584} y={212} size={11} weight={650}>public</T><T x={584} y={225} size={10} color="var(--muted)">împărțit de mulți abonați (cu porturi diferite)</T>
      <T x={380} y={252} size={10.5} color="var(--muted)">NAT444 = trei domenii de adrese IPv4 · port forwarding pe CPE nu mai ajută: conexiunile din Internet se opresc la CGN.</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   Topologii laborator
---------------------------------------------------------------- */
export function LabGuidedTopology() {
  return (
    <svg viewBox="0 0 760 250" role="img" aria-label="Topologie lab ghidat 1.7">
      <rect x={10} y={30} width={300} height={190} rx={14} fill="var(--accent-soft)" stroke="var(--accent)" strokeOpacity={0.4} strokeDasharray="5 5" />
      <T x={24} y={212} anchor="start" size={10.5} color="var(--accent)" weight={650}>LAN privat 192.168.1.0/24</T>
      <ClientIcon x={55} y={70} kind="pc" label="PC0 .10" />
      <ClientIcon x={55} y={160} kind="pc" label="PC1 .11" />
      <SwitchIcon x={165} y={115} label="SW1" />
      <Wire x1={71} y1={68} x2={135} y2={110} /><Wire x1={71} y1={158} x2={135} y2={120} /><Wire x1={197} y1={115} x2={282} y2={115} />
      <RouterIcon x={312} y={115} label="R-HOME" sub="G0/0 192.168.1.1" />
      <T x={312} y={176} size={10.5} color="var(--muted)">G0/1 203.0.113.2/30</T>
      <Wire x1={342} y1={115} x2={470} y2={115} />
      <T x={406} y={106} size={10} color="var(--muted)">203.0.113.0/30</T>
      <RouterIcon x={500} y={115} label="R-ISP" sub="G0/0 203.0.113.1" />
      <T x={500} y={176} size={10.5} color="var(--muted)">G0/1 198.51.100.1/24</T>
      <Wire x1={530} y1={115} x2={660} y2={115} />
      <ServerIcon x={690} y={115} label="WEB" sub="198.51.100.10" />
      <T x={380} y={242} size={11} color="var(--muted)">Adrese „publice” = blocuri de documentație (RFC 5737). R-ISP NU are rută spre 192.168.1.0/24.</T>
    </svg>
  );
}
export function LabSoloTopology() {
  return (
    <svg viewBox="0 0 760 300" role="img" aria-label="Topologie lab solo 1.7">
      <rect x={10} y={14} width={250} height={120} rx={14} fill="var(--accent-soft)" stroke="var(--accent)" strokeOpacity={0.4} strokeDasharray="5 5" />
      <T x={22} y={128} anchor="start" size={10.5} color="var(--accent)" weight={650}>Casa A · 192.168.1.0/24</T>
      <rect x={10} y={166} width={250} height={120} rx={14} fill="var(--accent-soft)" stroke="var(--accent)" strokeOpacity={0.4} strokeDasharray="5 5" />
      <T x={22} y={280} anchor="start" size={10.5} color="var(--accent)" weight={650}>Casa B · 192.168.1.0/24 (aceeași!)</T>
      <ClientIcon x={50} y={60} kind="pc" label="PC-A .10" />
      <ClientIcon x={50} y={212} kind="pc" label="PC-B .10" />
      <Wire x1={66} y1={60} x2={180} y2={70} /><Wire x1={66} y1={212} x2={180} y2={222} />
      <RouterIcon x={210} y={72} label="R-A" sub="" /><RouterIcon x={210} y={224} label="R-B" sub="" />
      <T x={210} y={100} size={10} color="var(--muted)">G0/1 203.0.113.2/30</T>
      <T x={210} y={252} size={10} color="var(--muted)">G0/1 203.0.113.6/30</T>
      <Wire x1={240} y1={72} x2={400} y2={140} /><Wire x1={240} y1={224} x2={400} y2={156} />
      <RouterIcon x={430} y={148} label="R-ISP" sub="G0/0 .1 · G0/2 .5 · G0/1 198.51.100.1" />
      <Wire x1={460} y1={148} x2={640} y2={148} />
      <ServerIcon x={680} y={148} label="WEB" sub="198.51.100.10" />
      <T x={500} y={292} size={11} color="var(--muted)">Două LAN-uri identice în spatele aceluiași ISP — doar NAT le face să funcționeze ambele.</T>
    </svg>
  );
}
