import { useMemo, useState, type ReactNode } from 'react';
import { expand6, compress6 } from '../lib/subnet';
import { RouterIcon, SwitchIcon, ClientIcon } from './wlan';

/* ======================================================================
   Diagrame și unelte interactive pentru 1.9 — IPv6 address types.
   Culori DOAR prin var(--...) ca să meargă în ambele teme.
   ====================================================================== */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace" };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
const soft = (c: string, pct = 14) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

/* ---------------------------------------------------------------
   Utilitare IPv6
---------------------------------------------------------------- */
export type Parsed6 = { full: string; nib: string; plen?: number; zone?: string };

/** Acceptă forme comprimate, litere mari/mici, /prefix, %zonă și IPv4 la final (::ffff:192.0.2.1). */
export function parse6(raw: string): Parsed6 | null {
  let s = raw.trim().toLowerCase();
  if (!s) return null;
  let plen: number | undefined; let zone: string | undefined;
  const sl = s.indexOf('/');
  if (sl >= 0) { const p = s.slice(sl + 1); s = s.slice(0, sl); if (!/^\d{1,3}$/.test(p) || +p > 128) return null; plen = +p; }
  const pc = s.indexOf('%');
  if (pc >= 0) { zone = s.slice(pc + 1); s = s.slice(0, pc); if (!zone) return null; }
  const m = s.match(/^(.*:)(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const o = [m[2], m[3], m[4], m[5]].map(Number);
    if (o.some((x) => x > 255)) return null;
    s = m[1] + ((o[0] << 8) | o[1]).toString(16) + ':' + ((o[2] << 8) | o[3]).toString(16);
  }
  const full = expand6(s);
  if (!full) return null;
  return { full, nib: full.replace(/:/g, ''), plen, zone };
}

/** Formatează nibble-urile [a, b) ale unei adrese, cu „:” la granițele de hextet. */
export function fmtNib(nib: string, a: number, b: number) {
  let out = '';
  for (let i = a; i < b; i++) { if (i !== a && i % 4 === 0) out += ':'; out += nib[i]; }
  return out;
}
const nibToFull = (nib: string) => nib.match(/.{4}/g)!.join(':');
export const short6 = (nib: string) => compress6(nibToFull(nib));

/** MAC în orice format uzual → 12 cifre hex, sau null. */
export function parseMac(s: string) {
  const t = s.trim();
  if (!/^[0-9a-fA-F.:\- ]+$/.test(t)) return null;
  const h = t.toLowerCase().replace(/[^0-9a-f]/g, '');
  return h.length === 12 ? h : null;
}
/** Modified EUI-64: 48 biți MAC → 64 biți Interface ID (16 cifre hex). */
export function eui64(mac12: string) {
  const b0 = (parseInt(mac12.slice(0, 2), 16) ^ 0x02).toString(16).padStart(2, '0');
  return b0 + mac12.slice(2, 6) + 'fffe' + mac12.slice(6);
}
export const solicitedNode = (nib: string) => short6('ff0200000000000000000001ff' + nib.slice(26));
export const mcastMac = (nib: string) => '33:33:' + nib.slice(24).match(/.{2}/g)!.join(':');

/* ---------------------------------------------------------------
   Afișaj pe segmente (HTML, se rupe frumos pe mobil)
---------------------------------------------------------------- */
export type Seg = { hex: string; label: string; color: string; bits?: string };
export function SegBar({ segs }: { segs: Seg[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' }}>
      {segs.map((s, i) => (
        <div key={i} style={{ border: `1px solid ${s.color}`, background: soft(s.color), borderRadius: 10, padding: '6px 10px', minWidth: 0, maxWidth: '100%' }}>
          <div className="mono" style={{ color: s.color, fontWeight: 650, fontSize: '0.95rem', wordBreak: 'break-all' }}>{s.hex}</div>
          <div className="tiny muted">{s.label}{s.bits ? ` · ${s.bits}` : ''}</div>
        </div>
      ))}
    </div>
  );
}

const Presets = ({ items, onPick }: { items: [string, string][]; onPick: (v: string) => void }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
    {items.map(([label, v]) => <button key={label} type="button" className="btn sm" onClick={() => onPick(v)}>{label}</button>)}
  </div>
);

/* ---------------------------------------------------------------
   1) Clasificator de adrese IPv6 (interactiv)
---------------------------------------------------------------- */
const SCOPES: Record<string, string> = {
  '1': 'interface-local (nu iese din interfață — loopback de multicast)',
  '2': 'link-local (rămâne pe segmentul local; routerele nu îl trimit mai departe)',
  '3': 'realm-local (RFC 7346 — rar)',
  '4': 'admin-local (cel mai mic domeniu configurat administrativ)',
  '5': 'site-local (în interiorul unui site/organizații locale)',
  '8': 'organization-local (mai multe site-uri ale aceleiași organizații)',
  'e': 'global (Internet)',
};
const WELL_KNOWN: Record<string, string> = {
  'ff01::1': 'All Nodes (interface-local)', 'ff01::2': 'All Routers (interface-local)',
  'ff02::1': 'All Nodes — toate nodurile IPv6 de pe link (înlocuitorul broadcastului)',
  'ff02::2': 'All Routers — toate routerele de pe link (destinația pentru Router Solicitation)',
  'ff02::5': 'All OSPF routers (OSPFv3)', 'ff02::6': 'OSPF DR/BDR (OSPFv3)', 'ff02::9': 'All RIPng routers',
  'ff02::a': 'All EIGRP routers (EIGRP for IPv6)', 'ff02::d': 'All PIM routers', 'ff02::16': 'All MLDv2-capable routers',
  'ff02::fb': 'mDNSv6 (multicast DNS)', 'ff02::1:2': 'All DHCPv6 relay agents and servers', 'ff02::1:3': 'LLMNR',
  'ff05::2': 'All Routers (site-local)', 'ff05::1:3': 'All DHCPv6 servers (site-local)',
};

type Info = { name: string; color: string; range: string; scope: string; routable: string; text: ReactNode; segs: Seg[]; notes: ReactNode[] };

export function classify(p: Parsed6): Info {
  const { nib } = p;
  const h0 = parseInt(nib.slice(0, 4), 16);
  const notes: ReactNode[] = [];
  const zero = (a: number, b: number) => /^0*$/.test(nib.slice(a, b));
  const iid: Seg = { hex: fmtNib(nib, 16, 32), label: 'Interface ID', color: 'var(--violet)', bits: '64 biți' };
  // detectează un Interface ID de tip EUI-64 (ff:fe în mijloc)
  const eui = nib.slice(22, 26) === 'fffe';
  const euiNote = () => {
    if (!eui) return;
    const b0 = (parseInt(nib.slice(16, 18), 16) ^ 2).toString(16).padStart(2, '0');
    const mac = (b0 + nib.slice(18, 22) + nib.slice(26, 32)).match(/.{2}/g)!.join(':');
    notes.push(<>Interface ID-ul conține <code>ff:fe</code> în mijloc → aproape sigur e generat prin <b>Modified EUI-64</b>. MAC-ul original era <code>{mac}</code> (vezi 1.9.d).</>);
  };

  if (zero(0, 32)) return { name: 'Unspecified (adresa nespecificată)', color: 'var(--muted)', range: '::/128', scope: '—', routable: 'nu — nu se configurează niciodată pe o interfață',
    text: <>Toți cei 128 de biți sunt 0. Înseamnă „încă nu am o adresă”. O vezi ca <b>adresă sursă</b> în mesajele trimise înainte ca nodul să aibă o adresă validă (de exemplu Neighbor Solicitation pentru DAD) și ca „ruta implicită” <code>::/0</code> (cu prefix /0).</>,
    segs: [{ hex: '::', label: '128 de biți de 0', color: 'var(--muted)' }], notes };
  if (zero(0, 31) && nib[31] === '1') return { name: 'Loopback', color: 'var(--muted)', range: '::1/128', scope: 'nodul însuși', routable: 'nu — nu părăsește niciodată nodul',
    text: <>Echivalentul lui <code>127.0.0.1</code> din IPv4, dar e <b>o singură adresă</b> (nu un /8 întreg). <code>ping ::1</code> testează stiva IPv6 a calculatorului propriu.</>,
    segs: [{ hex: '0000:0000:0000:0000:0000:0000:0000:0001', label: '127 biți de 0 + un bit 1', color: 'var(--muted)' }], notes };
  if (zero(0, 20) && nib.slice(20, 24) === 'ffff') {
    const v4 = [24, 26, 28, 30].map((i) => parseInt(nib.slice(i, i + 2), 16)).join('.');
    return { name: 'IPv4-mapped IPv6', color: 'var(--info)', range: '::ffff:0:0/96', scope: 'intern, în stiva de pe host', routable: 'nu se trimite pe fir',
      text: <>O adresă IPv4 „îmbrăcată” în IPv6: <code>::ffff:{v4}</code>. O folosesc aplicațiile dual-stack care deschid un singur socket IPv6 și primesc prin el și conexiuni IPv4. Nu e o adresă pe care o configurezi pe router.</>,
      segs: [{ hex: '0000:0000:0000:0000:0000', label: '80 biți de 0', color: 'var(--muted)' }, { hex: 'ffff', label: '16 biți de 1', color: 'var(--info)' }, { hex: v4, label: 'adresa IPv4', color: 'var(--accent)', bits: '32 biți' }], notes };
  }
  if (nib.slice(0, 2) === 'ff') {
    const flags = parseInt(nib[2], 16); const sc = nib[3];
    const fb = flags.toString(2).padStart(4, '0');
    const name = short6(nib);
    const isSol = nib.slice(0, 26) === 'ff0200000000000000000001ff';
    if (WELL_KNOWN[name]) notes.push(<>Grup bine-cunoscut: <b>{WELL_KNOWN[name]}</b>.</>);
    if (isSol) notes.push(<>Este un grup <b>solicited-node</b>: <code>ff02::1:ff</code> + ultimii 24 de biți ai unei adrese unicast (<code>…{nib.slice(26, 28)}:{nib.slice(28)}</code>). Toate adresele care se termină în <code>{nib.slice(26, 28)}:{nib.slice(28)}</code> intră în acest grup.</>);
    notes.push(<>Flags = <code>{fb}</code> (0 R P T): {flags & 1 ? <><b>T=1</b> — grup temporar (transient), alocat dinamic</> : <><b>T=0</b> — grup permanent, alocat de IANA</>}{flags & 2 ? <>, <b>P=1</b> — adresă derivată dintr-un prefix unicast (RFC 3306)</> : null}{flags & 4 ? <>, <b>R=1</b> — conține adresa unui Rendezvous Point (RFC 3956)</> : null}.</>);
    notes.push(<>MAC-ul Ethernet de destinație: <code>{mcastMac(nib)}</code> (<code>33:33</code> + ultimii 32 de biți ai grupului).</>);
    return { name: isSol ? 'Multicast — solicited-node' : 'Multicast', color: 'var(--warn)', range: isSol ? 'ff02::1:ff00:0/104' : 'ff00::/8', scope: SCOPES[sc] ?? (sc === '0' || sc === 'f' ? 'rezervat' : 'nealocat'),
      routable: sc === '1' || sc === '2' ? 'nu — rămâne pe link (sau pe interfață)' : sc === 'e' ? 'da, cu rutare multicast (PIM)' : 'doar în interiorul domeniului indicat de scope',
      text: <>Adresă de <b>grup</b>: pachetul ajunge la toate interfețele care s-au „abonat” la grup. Nu poate fi niciodată adresă sursă. Primul octet <code>ff</code>, apoi 4 biți de flags și 4 biți de scope.</>,
      segs: isSol ? [{ hex: 'ff02:0000:0000:0000:0000:0001:ff', label: 'prefix solicited-node', color: 'var(--warn)', bits: '/104' }, { hex: fmtNib(nib, 26, 32), label: 'ultimii 24 biți ai adresei unicast', color: 'var(--violet)', bits: '24 biți' }]
        : [{ hex: 'ff', label: 'multicast', color: 'var(--warn)', bits: '8 biți' }, { hex: nib[2], label: `flags ${fb}`, color: 'var(--info)', bits: '4 biți' }, { hex: sc, label: `scope ${sc}`, color: 'var(--accent)', bits: '4 biți' }, { hex: fmtNib(nib, 4, 32), label: 'Group ID', color: 'var(--violet)', bits: '112 biți' }], notes };
  }
  if ((h0 & 0xffc0) === 0xfe80) {
    if (!zero(3, 16)) notes.push(<>Biții 11–64 nu sunt 0. Adresa e tot în blocul <code>fe80::/10</code>, dar în practică toate adresele link-local au forma <code>fe80::/64</code> + Interface ID.</>);
    if (p.zone) notes.push(<><code>%{p.zone}</code> este <b>zone index</b>-ul: spune pe ce interfață se află link-ul (pe Windows un număr, pe Linux numele interfeței).</>);
    euiNote();
    return { name: 'Link-local unicast', color: 'var(--ok)', range: 'fe80::/10', scope: 'link-local (un singur segment)', routable: 'nu — routerele nu o trimit niciodată pe alt link',
      text: <>Existentă <b>automat</b> pe orice interfață cu IPv6 activ. Folosită pentru NDP (găsirea vecinilor și a routerelor), ca <b>default gateway</b> anunțat hosturilor și ca next-hop în protocoalele de rutare. Trebuie să fie unică doar pe link-ul ei.</>,
      segs: [{ hex: 'fe80:0000:0000:0000', label: 'prefix fe80::/10 + 54 biți de 0', color: 'var(--ok)', bits: '64 biți' }, iid], notes };
  }
  if ((h0 & 0xffc0) === 0xfec0) return { name: 'Site-local (DEPRECIAT)', color: 'var(--bad)', range: 'fec0::/10', scope: '„site” — definit vag', routable: 'nu se mai folosește',
    text: <>Fostul spațiu „privat” din IPv6, <b>depreciat în 2004</b> (RFC 3879): nimeni nu putea defini clar ce e un „site”, iar la fuziunea a două firme adresele se suprapuneau. Înlocuit de ULA (<code>fc00::/7</code>). Implementările noi îl tratează ca pe un bloc oarecare.</>,
    segs: [{ hex: fmtNib(nib, 0, 16), label: 'prefix fec0::/10 + subnet', color: 'var(--bad)' }, iid], notes };
  if ((h0 & 0xfe00) === 0xfc00) {
    const L = nib[1] === 'd';
    euiNote();
    if (!L) notes.push(<>Prefixul <code>fc00::/8</code> (bitul L = 0) e rezervat pentru o eventuală alocare centrală care <b>nu a fost definită</b>. În practică toate ULA-urile încep cu <code>fd</code>.</>);
    else notes.push(<>Prefixul site-ului (/48): <code>{short6(nib.slice(0, 12).padEnd(32, '0'))}/48</code> · subnet ID <code>{nib.slice(12, 16)}</code>.</>);
    return { name: 'Unique Local Address (ULA)', color: 'var(--info)', range: 'fc00::/7 (în practică fd00::/8)', scope: 'global ca formă, dar folosită doar intern', routable: 'da, în interiorul organizației; NU pe Internet',
      text: <>Echivalentul aproximativ al adreselor private RFC 1918. Definită de <b>RFC 4193</b>: <code>fd</code> + <b>Global ID de 40 de biți aleatoriu</b> + Subnet ID de 16 biți + Interface ID. Aleatorul face ca două firme care fuzionează să aibă aproape sigur prefixe diferite.</>,
      segs: [{ hex: nib.slice(0, 2), label: L ? 'fd = fc00::/7 + L=1' : 'fc (L=0, nedefinit)', color: 'var(--info)', bits: '8 biți' }, { hex: fmtNib(nib, 2, 12), label: 'Global ID aleatoriu', color: 'var(--accent)', bits: '40 biți' }, { hex: fmtNib(nib, 12, 16), label: 'Subnet ID', color: 'var(--warn)', bits: '16 biți' }, iid], notes };
  }
  if ((h0 & 0xe000) === 0x2000) {
    euiNote();
    if (zero(16, 32)) notes.push(<>Interface ID-ul este numai zerouri → aceasta este adresa <b>Subnet-Router anycast</b> a subrețelei <code>{short6(nib.slice(0, 16).padEnd(32, '0'))}/64</code> (1.9.b).</>);
    const doc = nib.slice(0, 8) === '20010db8' || nib.slice(0, 5) === '3fff0';
    const special = nib.slice(0, 4) === '2002' ? '6to4 (2002::/16) — mecanism de tranziție vechi, conținut extra' : nib.slice(0, 8) === '20010000' ? 'Teredo (2001::/32) — tunel IPv6 prin NAT IPv4, conținut extra' : null;
    if (special) notes.push(<>Bloc special: {special}.</>);
    if (doc) notes.push(<>Atenție: <b>bloc de documentație</b> ({nib.startsWith('20010db8') ? '2001:db8::/32, RFC 3849' : '3fff::/20, RFC 9637'}). E o adresă GUA ca formă, dar rezervată pentru exemple din cărți, laburi și documentație — nu este rutată pe Internet.</>);
    return { name: doc ? 'Global unicast — documentație' : 'Global Unicast Address (GUA)', color: 'var(--accent)', range: doc ? (nib.startsWith('20010db8') ? '2001:db8::/32' : '3fff::/20') : '2000::/3', scope: 'global', routable: doc ? 'nu (rezervat pentru exemple)' : 'da — rutabilă pe Internet',
      text: <>Echivalentul adreselor publice IPv4. Primii 3 biți sunt <code>001</code>, deci primul hextet e între <code>2000</code> și <code>3fff</code>. Structura tipică: <b>global routing prefix</b> (de obicei 48 de biți, primit de la ISP) + <b>subnet ID</b> (16 biți, ales de tine) + <b>interface ID</b> (64 de biți).</>,
      segs: [{ hex: fmtNib(nib, 0, 12), label: 'Global routing prefix', color: 'var(--accent)', bits: '48 biți (tipic)' }, { hex: fmtNib(nib, 12, 16), label: 'Subnet ID', color: 'var(--warn)', bits: '16 biți' }, iid], notes };
  }
  if (nib.slice(0, 24) === '0064ff9b0000000000000000') return { name: 'NAT64 well-known prefix', color: 'var(--info)', range: '64:ff9b::/96', scope: 'global (la translator)', routable: 'spre un translator NAT64',
    text: <>Conținut extra peste CCNA: un host doar-IPv6 ajunge la un server doar-IPv4 printr-un translator NAT64; ultimii 32 de biți sunt adresa IPv4.</>, segs: [{ hex: '64:ff9b::', label: 'prefix NAT64 /96', color: 'var(--info)' }, { hex: [24, 26, 28, 30].map((i) => parseInt(nib.slice(i, i + 2), 16)).join('.'), label: 'IPv4', color: 'var(--accent)' }], notes };
  return { name: 'Rezervat de IETF / nealocat', color: 'var(--muted)', range: '—', scope: '—', routable: 'nu',
    text: <>Adresa e validă sintactic, dar cade într-un bloc pe care IANA nu l-a alocat (de exemplu tot ce începe cu <code>4000</code>–<code>fbff</code>, în afară de ULA). Dacă o vezi la examen, aproape sigur e un distractor.</>,
    segs: [{ hex: nibToFull(nib), label: 'bloc nealocat', color: 'var(--muted)' }], notes };
}

const CLASS_PRESETS: [string, string][] = [
  ['GUA', '2001:db8:acad:12::1/64'], ['GUA reală', '2a02:2f0e:1c3:4f00::10'], ['ULA', 'fd3a:91c4:7e02:10::25'], ['link-local', 'fe80::211:22ff:fe33:4455%12'],
  ['FF02::1', 'ff02::1'], ['solicited-node', 'ff02::1:ff33:4455'], ['FF05::1:3', 'ff05::1:3'], ['loopback', '::1'], ['unspecified', '::'],
  ['IPv4-mapped', '::ffff:192.0.2.10'], ['site-local', 'fec0::1'], ['subnet-router', '2001:db8:acad:1::'],
];
export function AddressClassifier() {
  const [v, setV] = useState('2001:db8:acad:12::1/64');
  const p = useMemo(() => parse6(v), [v]);
  const info = p ? classify(p) : null;
  return (
    <div>
      <label className="field">Scrie orice adresă IPv6 (formă completă sau comprimată, cu /prefix sau %zonă)
        <input className="input mono" value={v} onChange={(e) => setV(e.target.value)} spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-label="Adresă IPv6" />
      </label>
      <Presets items={CLASS_PRESETS} onPick={setV} />
      {!p && <div className="callout warn" style={{ marginTop: 12 }}><div><b>Adresă invalidă.</b> Verifică: maximum 8 hextete, fiecare cu 1–4 cifre hex (0–9, a–f), iar <code>::</code> apare <b>cel mult o dată</b>.</div></div>}
      {p && info && (
        <div style={{ marginTop: 14, border: `1px solid ${info.color}`, borderRadius: 14, padding: 14, background: soft(info.color, 7) }}>
          <div className="row between" style={{ flexWrap: 'wrap', gap: 8 }}>
            <b style={{ color: info.color, fontSize: '1.05rem' }}>{info.name}</b>
            <span className="badge">{info.range}</span>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>Formă completă: <span className="mono" style={{ wordBreak: 'break-all' }}>{p.full}</span> · comprimată: <span className="mono">{compress6(p.full)}</span>{p.plen != null ? <> · prefix /{p.plen}</> : null}</div>
          <SegBar segs={info.segs} />
          <div className="grid c2" style={{ gap: 8, margin: '6px 0 10px' }}>
            <div className="small"><b>Scope:</b> {info.scope}</div>
            <div className="small"><b>Rutabilă?</b> {info.routable}</div>
          </div>
          <p className="small" style={{ margin: '6px 0' }}>{info.text}</p>
          {info.notes.length > 0 && <ul className="small" style={{ margin: '6px 0 0' }}>{info.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   2) Unicast / multicast / anycast / broadcast — cine primește
---------------------------------------------------------------- */
type Cast = 'unicast' | 'multicast' | 'anycast' | 'broadcast';
const CAST_TXT: Record<Cast, ReactNode> = {
  unicast: <><b>Unicast (one-to-one):</b> o singură interfață anume primește pachetul. Majoritatea traficului (web, SSH, e-mail).</>,
  multicast: <><b>Multicast (one-to-many):</b> primesc doar membrii grupului (aici H1, H3, H4). Ceilalți nici nu procesează pachetul.</>,
  anycast: <><b>Anycast (one-to-nearest):</b> H2 și H4 au <i>aceeași</i> adresă; rutarea livrează pachetul unuia singur — celui mai apropiat (H2).</>,
  broadcast: <><b>Broadcast (one-to-all) — doar IPv4!</b> Toți primesc și procesează, chiar dacă nu îi privește. IPv6 a eliminat complet broadcastul.</>,
};
export function CastModes() {
  const [m, setM] = useState<Cast>('unicast');
  const hosts = [{ id: 'H1', y: 40 }, { id: 'H2', y: 90 }, { id: 'H3', y: 140 }, { id: 'H4', y: 190 }, { id: 'H5', y: 240 }];
  const recv: Record<Cast, string[]> = { unicast: ['H3'], multicast: ['H1', 'H3', 'H4'], anycast: ['H2'], broadcast: ['H1', 'H2', 'H3', 'H4', 'H5'] };
  const color = m === 'broadcast' ? 'var(--bad)' : m === 'multicast' ? 'var(--warn)' : m === 'anycast' ? 'var(--info)' : 'var(--accent)';
  return (
    <>
      <div className="segmented" role="group" aria-label="Tip de livrare" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        {(['unicast', 'multicast', 'anycast', 'broadcast'] as const).map((k) => <button key={k} className={m === k ? 'on' : ''} onClick={() => setM(k)}>{k}{k === 'broadcast' ? ' (IPv4)' : ''}</button>)}
      </div>
      <svg viewBox="0 0 720 280" role="img" aria-label={`Livrare ${m}`} width="100%">
        <ClientIcon x={70} y={140} kind="pc" label="sursa" />
        <line x1={92} y1={140} x2={300} y2={140} stroke={color} strokeWidth={2.4} />
        <SwitchIcon x={330} y={140} label="rețea" />
        {hosts.map((h) => {
          const on = recv[m].includes(h.id);
          const d = `M362 140 C 440 140, 470 ${h.y}, 560 ${h.y}`;
          return (
            <g key={h.id + m}>
              <path d={d} fill="none" stroke={on ? color : 'var(--border-strong)'} strokeWidth={on ? 2.4 : 1.4} strokeDasharray={on ? undefined : '4 5'} />
              {on && <circle r={5} fill={color}><animateMotion dur="1.6s" repeatCount="indefinite" path={d} /></circle>}
              <ClientIcon x={590} y={h.y} kind="pc" />
              <T x={622} y={h.y + 4} anchor="start" weight={650} color={on ? color : 'var(--muted)'}>{h.id}</T>
              {m === 'anycast' && (h.id === 'H2' || h.id === 'H4') && <T x={652} y={h.y + 4} anchor="start" size={10} color="var(--info)" m>…::53</T>}
              {m === 'multicast' && ['H1', 'H3', 'H4'].includes(h.id) && <T x={652} y={h.y + 4} anchor="start" size={10} color="var(--warn)">membru</T>}
            </g>
          );
        })}
        <circle r={5} fill={color}><animateMotion dur="1.6s" repeatCount="indefinite" path="M92 140 L300 140" /></circle>
        <T x={60} y={270} anchor="start" size={11} color="var(--muted)">{m === 'anycast' ? 'H2 e la un hop distanță, H4 la trei → rutarea alege H2.' : m === 'broadcast' ? 'IPv6 nu are broadcast: folosește FF02::1 (all-nodes) sau grupuri mai mici.' : ' '}</T>
      </svg>
      <p className="small" style={{ margin: '8px 0 0' }}>{CAST_TXT[m]}</p>
    </>
  );
}

/* ---------------------------------------------------------------
   3) Structura GUA — colorare interactivă
---------------------------------------------------------------- */
export function GuaStructure() {
  const [v, setV] = useState('2001:db8:acad:12:a4c3:9f0e:1d2b:7e55');
  const [gp, setGp] = useState<32 | 48 | 56>(48);
  const p = parse6(v);
  const ok = p && (parseInt(p.nib.slice(0, 4), 16) & 0xe000) === 0x2000;
  const gN = gp / 4; const sBits = 64 - gp;
  return (
    <div>
      <label className="field">Adresă GUA
        <input className="input mono" value={v} onChange={(e) => setV(e.target.value)} spellCheck={false} autoCapitalize="off" aria-label="Adresă GUA" />
      </label>
      <div className="controls" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 10 }}>
        <span className="small muted">Prefix primit de la ISP:</span>
        <div className="segmented" role="group" aria-label="Lungimea prefixului global">
          {([32, 48, 56] as const).map((k) => <button key={k} className={gp === k ? 'on' : ''} onClick={() => setGp(k)}>/{k}</button>)}
        </div>
      </div>
      {!ok && <p className="small" style={{ color: 'var(--bad)' }}>Introdu o adresă GUA validă (primul hextet între 2000 și 3fff).</p>}
      {ok && p && (
        <>
          <div className="mono" style={{ fontSize: '1.05rem', margin: '14px 0 6px', wordBreak: 'break-all', lineHeight: 1.8 }}>
            {p.nib.split('').map((c, i) => (
              <span key={i}>{i > 0 && i % 4 === 0 && <span className="muted">:</span>}
                <span style={{ color: i < gN ? 'var(--accent)' : i < 16 ? 'var(--warn)' : 'var(--violet)', fontWeight: 650, background: i < gN ? soft('var(--accent)') : i < 16 ? soft('var(--warn)') : soft('var(--violet)'), padding: '1px 1px', borderRadius: 3 }}>{c}</span>
              </span>
            ))}
          </div>
          <SegBar segs={[
            { hex: `${short6(p.nib.slice(0, gN).padEnd(32, '0'))}/${gp}`, label: 'Global routing prefix (de la ISP/RIR)', color: 'var(--accent)', bits: `${gp} biți` },
            { hex: fmtNib(p.nib, gN, 16), label: 'Subnet ID (alegi tu)', color: 'var(--warn)', bits: `${sBits} biți` },
            { hex: fmtNib(p.nib, 16, 32), label: 'Interface ID (hostul)', color: 'var(--violet)', bits: '64 biți' },
          ]} />
          <ul className="small" style={{ margin: 0 }}>
            <li>Subrețeaua acestui host: <code>{short6(p.nib.slice(0, 16).padEnd(32, '0'))}/64</code>.</li>
            <li>Cu un /{gp} poți face <b>2<sup>{sBits}</sup> = {(2 ** sBits).toLocaleString('ro-RO')}</b> subrețele /64. Subnet ID-ul curent: <code>{p.nib.slice(gN, 16)}</code> hex = {parseInt(p.nib.slice(gN, 16), 16).toLocaleString('ro-RO')} zecimal.</li>
            <li>Fiecare /64 are 2<sup>64</sup> ≈ 1,8 × 10<sup>19</sup> Interface ID-uri — mai mult decât pătratul întregului spațiu IPv4.</li>
          </ul>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   4) Generator ULA (RFC 4193)
---------------------------------------------------------------- */
export function UlaBuilder() {
  const [gid, setGid] = useState('3a91c47e02');
  const [sub, setSub] = useState('0010');
  const gen = () => {
    const a = new Uint8Array(5);
    try { crypto.getRandomValues(a); } catch { for (let i = 0; i < 5; i++) a[i] = Math.floor(Math.random() * 256); }
    setGid([...a].map((x) => x.toString(16).padStart(2, '0')).join(''));
  };
  const subOk = /^[0-9a-f]{1,4}$/i.test(sub);
  const s4 = subOk ? sub.toLowerCase().padStart(4, '0') : '0000';
  const site = short6(('fd' + gid).padEnd(32, '0'));
  const lan = short6(('fd' + gid + s4).padEnd(32, '0'));
  return (
    <div>
      <SegBar segs={[
        { hex: 'fd', label: 'fc00::/7 + bitul L = 1', color: 'var(--info)', bits: '8 biți' },
        { hex: fmtNib('fd' + gid, 2, 12), label: 'Global ID pseudo-aleatoriu', color: 'var(--accent)', bits: '40 biți' },
        { hex: s4, label: 'Subnet ID', color: 'var(--warn)', bits: '16 biți' },
        { hex: 'xxxx:xxxx:xxxx:xxxx', label: 'Interface ID', color: 'var(--violet)', bits: '64 biți' },
      ]} />
      <div className="controls" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <button type="button" className="btn sm primary" onClick={gen}>Generează alt Global ID</button>
        <label className="small muted row" style={{ gap: 6 }}>Subnet ID (hex)
          <input className="input mono" style={{ width: 90, padding: '5px 8px' }} value={sub} maxLength={4} onChange={(e) => setSub(e.target.value)} aria-label="Subnet ID" />
        </label>
      </div>
      <ul className="small" style={{ marginTop: 10, marginBottom: 0 }}>
        <li>Prefixul site-ului: <code>{site}/48</code> — îl scrii o dată în documentația rețelei și nu-l mai schimbi.</li>
        <li>Subrețeaua LAN: <code>{lan}/64</code>{!subOk && <span style={{ color: 'var(--bad)' }}> (Subnet ID invalid — 1–4 cifre hex)</span>}.</li>
        <li>Probabilitatea ca două organizații să genereze același Global ID: 1 din 2<sup>40</sup> ≈ 1,1 × 10<sup>12</sup>.</li>
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------
   5) Link-local: rămâne pe link (static)
---------------------------------------------------------------- */
export function LinkLocalScope() {
  return (
    <svg viewBox="0 0 720 270" role="img" aria-label="Adresele link-local nu trec de router" width="100%">
      <rect x={20} y={30} width={300} height={200} rx={14} fill={soft('var(--ok)', 6)} stroke="var(--ok)" strokeDasharray="5 5" />
      <rect x={400} y={30} width={300} height={200} rx={14} fill={soft('var(--info)', 6)} stroke="var(--info)" strokeDasharray="5 5" />
      <T x={170} y={50} size={11} color="var(--ok)" weight={650}>link A (G0/0)</T>
      <T x={550} y={50} size={11} color="var(--info)" weight={650}>link B (G0/1)</T>
      <RouterIcon x={360} y={130} label="R1" />
      <T x={300} y={110} anchor="end" size={10.5} m color="var(--ok)">G0/0 fe80::1</T>
      <T x={420} y={110} anchor="start" size={10.5} m color="var(--info)">G0/1 fe80::1</T>
      <line x1={110} y1={130} x2={330} y2={130} stroke="var(--text-2)" strokeWidth={2} />
      <line x1={390} y1={130} x2={610} y2={130} stroke="var(--text-2)" strokeWidth={2} />
      <ClientIcon x={86} y={130} kind="pc" />
      <T x={86} y={166} size={10.5} m>PC-A</T>
      <T x={86} y={182} size={9.5} m color="var(--muted)">fe80::a8c:2aff:fe11:1</T>
      <T x={86} y={198} size={9.5} color="var(--muted)">gateway: fe80::1%eth0</T>
      <ClientIcon x={634} y={130} kind="pc" />
      <T x={634} y={166} size={10.5} m>PC-B</T>
      <T x={634} y={182} size={9.5} m color="var(--muted)">fe80::5c1:9dff:fe20:2</T>
      <path d="M120 100 C 200 80, 280 80, 335 104" fill="none" stroke="var(--ok)" strokeWidth={2} markerEnd="url(#llArr)" />
      <T x={210} y={78} size={10.5} color="var(--ok)">dst fe80::1 → OK (același link)</T>
      <path d="M120 160 C 220 190, 300 190, 345 156" fill="none" stroke="var(--bad)" strokeWidth={2} strokeDasharray="5 4" />
      <T x={360} y={196} size={16} weight={800} color="var(--bad)">✕</T>
      <T x={215} y={214} size={10.5} color="var(--bad)">dst fe80::5c1:… (alt link) → aruncat</T>
      <defs><marker id="llArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ok)" /></marker></defs>
      <T x={360} y={258} size={11} color="var(--muted)">Același fe80::1 pe ambele interfețe e perfect legal: o adresă link-local trebuie să fie unică doar pe link-ul ei.</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   6) Anycast — cel mai apropiat server răspunde
---------------------------------------------------------------- */
export function AnycastMap() {
  const [c, setC] = useState(0);
  const [down, setDown] = useState<number | null>(null);
  const S = [{ x: 120, n: 'S1 București' }, { x: 360, n: 'S2 Frankfurt' }, { x: 600, n: 'S3 New York' }];
  const C = [{ x: 120, n: 'client Cluj' }, { x: 360, n: 'client Paris' }, { x: 600, n: 'client Toronto' }];
  const cost = [[12, 30, 95], [35, 10, 70], [100, 75, 15]];
  const up = [0, 1, 2].filter((j) => j !== down);
  const best = up.reduce((b, j) => (cost[c][j] < cost[c][b] ? j : b), up[0]);
  return (
    <>
      <svg viewBox="0 0 720 300" role="img" aria-label="Anycast: același prefix anunțat din trei locații" width="100%">
        {S.map((s, j) => {
          const isDown = j === down;
          return (
            <g key={j} opacity={isDown ? 0.35 : 1}>
              <rect x={s.x - 60} y={22} width={120} height={46} rx={10} fill={j === best ? soft('var(--info)', 18) : 'var(--surface-3)'} stroke={j === best ? 'var(--info)' : 'var(--border-strong)'} strokeWidth={1.6} />
              <T x={s.x} y={41} weight={650} size={11.5}>{s.n}</T>
              <T x={s.x} y={58} size={10} m color="var(--info)">2001:db8:53::53</T>
              {isDown && <T x={s.x} y={86} size={11} color="var(--bad)" weight={700}>căzut — ruta retrasă</T>}
            </g>
          );
        })}
        {S.map((s, j) => {
          const on = j === best; const isDown = j === down;
          if (isDown) return null;
          const x1 = C[c].x, y1 = 230, x2 = s.x, y2 = 70;
          const d = `M${x1} ${y1} C ${x1} 160, ${x2} 140, ${x2} ${y2}`;
          return (
            <g key={'p' + j + c + String(down)}>
              <path d={d} fill="none" stroke={on ? 'var(--info)' : 'var(--border-strong)'} strokeWidth={on ? 2.6 : 1.3} strokeDasharray={on ? undefined : '4 5'} />
              {on && <circle r={5} fill="var(--info)"><animateMotion dur="1.8s" repeatCount="indefinite" path={d} /></circle>}
              <T x={(x1 + x2) / 2 + (x2 >= x1 ? 8 : -8)} y={150 + j * 4} size={10.5} color={on ? 'var(--info)' : 'var(--muted)'} anchor={x2 >= x1 ? 'start' : 'end'}>metrică {cost[c][j]}</T>
            </g>
          );
        })}
        {C.map((k, i) => (
          <g key={i} onClick={() => setC(i)} style={{ cursor: 'pointer' }}>
            <ClientIcon x={k.x} y={240} kind="laptop" />
            <T x={k.x} y={278} size={11} weight={i === c ? 700 : 500} color={i === c ? 'var(--accent)' : 'var(--text-2)'}>{k.n}</T>
          </g>
        ))}
      </svg>
      <div className="controls">
        <div className="segmented" role="group" aria-label="Clientul">
          {C.map((k, i) => <button key={i} className={c === i ? 'on' : ''} onClick={() => setC(i)}>{k.n.replace('client ', '')}</button>)}
        </div>
        <div className="segmented" role="group" aria-label="Server căzut">
          <button className={down === null ? 'on' : ''} onClick={() => setDown(null)}>toate active</button>
          {S.map((s, j) => <button key={j} className={down === j ? 'on' : ''} onClick={() => setDown(j)}>{s.n.split(' ')[0]} căzut</button>)}
        </div>
      </div>
      <p className="small" style={{ margin: '8px 0 0' }}>Toate cele trei servere au <b>aceeași adresă</b>. Clientul nu știe și nu alege: routerele trimit pachetul spre ruta cu metrica cea mai mică → <b>{S[best].n}</b>. Dacă un server cade și ruta lui e retrasă, traficul ajunge automat la următorul cel mai apropiat.</p>
    </>
  );
}

/* ---------------------------------------------------------------
   7) Decodor de adrese multicast
---------------------------------------------------------------- */
const MC_PRESETS: [string, string][] = [['FF02::1', 'ff02::1'], ['FF02::2', 'ff02::2'], ['FF02::5', 'ff02::5'], ['FF02::A', 'ff02::a'], ['FF02::1:2', 'ff02::1:2'], ['FF05::1:3', 'ff05::1:3'], ['FF0E::101', 'ff0e::101'], ['FF02::1:FF33:4455', 'ff02::1:ff33:4455'], ['FF15::ABCD', 'ff15::abcd'], ['FF3E::8000:1', 'ff3e::8000:1']];
export function MulticastDecoder() {
  const [v, setV] = useState('ff02::1');
  const p = parse6(v);
  const isMc = p && p.nib.slice(0, 2) === 'ff';
  const flags = isMc ? parseInt(p.nib[2], 16) : 0; const sc = isMc ? p.nib[3] : '';
  const fb = flags.toString(2).padStart(4, '0');
  const name = isMc ? short6(p.nib) : '';
  const isSol = isMc && p.nib.slice(0, 26) === 'ff0200000000000000000001ff';
  const Bit = ({ b, n, d }: { b: string; n: string; d: string }) => (
    <div style={{ flex: '1 1 120px', border: `1px solid ${b === '1' ? 'var(--info)' : 'var(--border)'}`, borderRadius: 10, padding: '6px 8px', background: b === '1' ? soft('var(--info)') : 'transparent' }}>
      <div className="mono" style={{ fontWeight: 700, color: b === '1' ? 'var(--info)' : 'var(--muted)' }}>{n} = {b}</div><div className="tiny muted">{d}</div>
    </div>
  );
  return (
    <div>
      <label className="field">Adresă multicast
        <input className="input mono" value={v} onChange={(e) => setV(e.target.value)} spellCheck={false} autoCapitalize="off" aria-label="Adresă multicast" />
      </label>
      <Presets items={MC_PRESETS} onPick={setV} />
      {!isMc && <p className="small" style={{ color: 'var(--bad)' }}>{p ? 'Nu e multicast: o adresă multicast începe întotdeauna cu ff (ff00::/8).' : 'Adresă invalidă.'}</p>}
      {isMc && p && (
        <>
          <SegBar segs={[
            { hex: 'ff', label: 'identificator multicast', color: 'var(--warn)', bits: '8 biți' },
            { hex: p.nib[2], label: `flags = ${fb}`, color: 'var(--info)', bits: '4 biți' },
            { hex: sc, label: 'scope', color: 'var(--accent)', bits: '4 biți' },
            { hex: fmtNib(p.nib, 4, 32), label: 'Group ID', color: 'var(--violet)', bits: '112 biți' },
          ]} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Bit b={fb[0]} n="0" d="rezervat, mereu 0" />
            <Bit b={fb[1]} n="R" d="Rendezvous Point încorporat (RFC 3956)" />
            <Bit b={fb[2]} n="P" d="bazată pe un prefix unicast (RFC 3306)" />
            <Bit b={fb[3]} n="T" d={fb[3] === '1' ? 'transient — grup temporar' : 'well-known — alocat permanent de IANA'} />
          </div>
          <ul className="small" style={{ marginTop: 10, marginBottom: 0 }}>
            <li><b>Scope {sc}:</b> {SCOPES[sc] ?? (sc === '0' || sc === 'f' ? 'rezervat' : 'nealocat')}.</li>
            <li><b>Grupul:</b> {WELL_KNOWN[name] ?? (isSol ? <>solicited-node pentru adresele care se termină în <code>{p.nib.slice(26, 28)}:{p.nib.slice(28)}</code></> : fb[3] === '1' ? 'grup creat dinamic de o aplicație' : 'grup permanent (caută-l în registrul IANA)')}.</li>
            <li><b>MAC de destinație:</b> <code>{mcastMac(p.nib)}</code> — switch-ul și placa de rețea îl recunosc ca multicast (bitul I/G al primului octet, 0x33, este 1).</li>
          </ul>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   8) Calculator solicited-node
---------------------------------------------------------------- */
const SN_PRESETS: [string, string][] = [['2001:db8:acad:1::1', '2001:db8:acad:1::1'], ['fe80::1', 'fe80::1'], ['…:fe33:4455', '2001:db8:acad:1:211:22ff:fe33:4455'], ['2001:db8::abcd:1234:5678', '2001:db8::abcd:1234:5678'], ['fd3a:91c4:7e02:10::25', 'fd3a:91c4:7e02:10::25']];
export function SolicitedNodeCalc() {
  const [v, setV] = useState('2001:db8:acad:1:211:22ff:fe33:4455');
  const p = parse6(v);
  const bad = p && (p.nib.slice(0, 2) === 'ff' || /^0+$/.test(p.nib));
  return (
    <div>
      <label className="field">Adresă unicast (sau anycast)
        <input className="input mono" value={v} onChange={(e) => setV(e.target.value)} spellCheck={false} autoCapitalize="off" aria-label="Adresă unicast" />
      </label>
      <Presets items={SN_PRESETS} onPick={setV} />
      {!p && <p className="small" style={{ color: 'var(--bad)' }}>Adresă invalidă.</p>}
      {bad && <p className="small" style={{ color: 'var(--bad)' }}>Grupurile solicited-node se calculează doar pentru adrese unicast/anycast (nu pentru multicast sau ::).</p>}
      {p && !bad && (
        <ol className="small" style={{ marginTop: 12, paddingLeft: 20 }}>
          <li>Scrie adresa completă și găsește <b>ultimii 24 de biți = ultimele 6 cifre hex</b>:
            <div className="mono" style={{ fontSize: '0.98rem', margin: '6px 0', wordBreak: 'break-all' }}>
              <span className="muted">{fmtNib(p.nib, 0, 26)}</span><span style={{ color: 'var(--violet)', fontWeight: 700, background: soft('var(--violet)'), borderRadius: 4, padding: '0 2px' }}>{fmtNib(p.nib, 26, 32).replace(/^:/, '')}</span>
            </div>
          </li>
          <li>Pune-i după prefixul fix <code>ff02::1:ff</code> (<code>ff02:0:0:0:0:1:ff00::/104</code>):
            <div className="mono" style={{ fontSize: '0.98rem', margin: '6px 0', wordBreak: 'break-all' }}>
              <span style={{ color: 'var(--warn)', fontWeight: 650 }}>ff02:0000:0000:0000:0000:0001:ff</span><span style={{ color: 'var(--violet)', fontWeight: 700 }}>{p.nib.slice(26, 28)}:{p.nib.slice(28)}</span>
            </div>
          </li>
          <li>Comprimă: <b className="mono" style={{ color: 'var(--accent)', fontSize: '1.02rem' }}>{solicitedNode(p.nib)}</b></li>
          <li>MAC-ul Ethernet al grupului: <code>33:33</code> + ultimii 32 de biți → <b className="mono">{mcastMac(('ff0200000000000000000001ff' + p.nib.slice(26)))}</b></li>
        </ol>
      )}
      <p className="small muted" style={{ marginBottom: 0 }}>Observă: <code>2001:db8:acad:1::1</code> și <code>fe80::1</code> au același grup (<code>ff02::1:ff00:1</code>) — de aceea un router cu ambele adrese arată un singur grup pentru ele în <code>show ipv6 interface</code>.</p>
    </div>
  );
}

/* ---------------------------------------------------------------
   9) ARP broadcast vs NS la solicited-node
---------------------------------------------------------------- */
export function ArpVsNs() {
  const [v6, setV6] = useState(true);
  const hosts = [{ n: 'H1', y: 50 }, { n: 'H2', y: 105 }, { n: 'Țintă', y: 160 }, { n: 'H4', y: 215 }];
  return (
    <>
      <div className="segmented" role="group" aria-label="Protocol" style={{ marginBottom: 12 }}>
        <button className={!v6 ? 'on' : ''} onClick={() => setV6(false)}>IPv4: ARP Request</button>
        <button className={v6 ? 'on' : ''} onClick={() => setV6(true)}>IPv6: Neighbor Solicitation</button>
      </div>
      <svg viewBox="0 0 720 270" role="img" aria-label={v6 ? 'NS trimis la grupul solicited-node' : 'ARP trimis ca broadcast'} width="100%">
        <ClientIcon x={60} y={132} kind="pc" label="emițător" />
        <rect x={110} y={96} width={190} height={74} rx={10} fill="var(--code-bg)" stroke="var(--border-strong)" />
        <T x={120} y={116} anchor="start" size={10.5} m color={v6 ? 'var(--warn)' : 'var(--bad)'}>dst MAC {v6 ? '33:33:ff:33:44:55' : 'ff:ff:ff:ff:ff:ff'}</T>
        <T x={120} y={134} anchor="start" size={10.5} m color="var(--text-2)">{v6 ? 'dst IP ff02::1:ff33:4455' : 'ARP: who has 10.0.0.30?'}</T>
        <T x={120} y={152} anchor="start" size={10.5} m color="var(--text-2)">{v6 ? 'ICMPv6 NS: target …:fe33:4455' : '(cadru broadcast)'}</T>
        <SwitchIcon x={360} y={132} />
        <line x1={300} y1={132} x2={328} y2={132} stroke="var(--text-2)" strokeWidth={2} />
        {hosts.map((h) => {
          const tgt = h.n === 'Țintă';
          const status = tgt ? 'răspunde (NA / ARP Reply)' : v6 ? 'placa de rețea îl filtrează în hardware' : 'CPU-ul îl procesează, apoi îl aruncă';
          const col = tgt ? 'var(--ok)' : v6 ? 'var(--muted)' : 'var(--bad)';
          return (
            <g key={h.n + String(v6)}>
              <path d={`M392 132 C 450 132, 470 ${h.y}, 520 ${h.y}`} fill="none" stroke={v6 && !tgt ? 'var(--border-strong)' : col} strokeWidth={1.8} strokeDasharray={v6 && !tgt ? '3 5' : undefined} />
              <ClientIcon x={545} y={h.y} kind="pc" />
              <T x={572} y={h.y - 2} anchor="start" weight={650} size={11.5} color={tgt ? 'var(--ok)' : 'var(--text)'}>{h.n}</T>
              <T x={572} y={h.y + 13} anchor="start" size={9.5} color={col}>{status}</T>
            </g>
          );
        })}
        <T x={20} y={258} anchor="start" size={11} color="var(--muted)">{v6 ? 'Doar ținta s-a abonat la ff02::1:ff33:4455 → doar placa ei acceptă cadrul 33:33:ff:33:44:55.' : 'Broadcastul întrerupe fiecare host din VLAN, chiar dacă nu e el ținta.'}</T>
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------
   10) Convertor Modified EUI-64 pas cu pas
---------------------------------------------------------------- */
const EUI_PRESETS: [string, string][] = [['00:11:22:33:44:55', '00:11:22:33:44:55'], ['0017.a4d2.27fc', '0017.a4d2.27fc'], ['AC-DE-48-00-11-22', 'AC-DE-48-00-11-22'], ['70:b3:d5:12:34:56', '70:b3:d5:12:34:56'], ['02:50:56:ab:cd:ef (local)', '02:50:56:ab:cd:ef'], ['c400.02f4.0000', 'c400.02f4.0000']];
const Nb = ({ c, col, bold = true }: { c: string; col: string; bold?: boolean }) => <span style={{ color: col, fontWeight: bold ? 700 : 500 }}>{c}</span>;
export function Eui64Converter() {
  const [mac, setMac] = useState('00:11:22:33:44:55');
  const [pfx, setPfx] = useState('2001:db8:acad:1::/64');
  const [step, setStep] = useState(0);
  const h = parseMac(mac);
  const pp = parse6(pfx);
  const MAX = 6;
  if (!h) return (
    <div>
      <label className="field">Adresa MAC<input className="input mono" value={mac} onChange={(e) => setMac(e.target.value)} aria-label="MAC" /></label>
      <p className="small" style={{ color: 'var(--bad)' }}>MAC invalid — 12 cifre hex, în orice format (00:11:22:33:44:55, 0011.2233.4455, 00-11-…).</p>
      <Presets items={EUI_PRESETS} onPick={(x) => { setMac(x); setStep(0); }} />
    </div>
  );
  const b0 = parseInt(h.slice(0, 2), 16); const nb0 = b0 ^ 2;
  const bin = b0.toString(2).padStart(8, '0'); const nbin = nb0.toString(2).padStart(8, '0');
  const iid = eui64(h);
  const iidFull = iid.match(/.{4}/g)!.join(':');
  const iidShort = iid.match(/.{4}/g)!.map((x) => x.replace(/^0+(?=.)/, '')).join(':');
  const pfx64 = pp ? pp.nib.slice(0, 16) : null;
  const full = pfx64 ? short6(pfx64 + iid) : null;
  const lla = short6('fe80000000000000' + iid);
  const mac6 = h.match(/.{2}/g)!;
  const C = { oui: 'var(--info)', nic: 'var(--violet)', f: 'var(--warn)', flip: 'var(--bad)' };
  const rows: { t: string; body: ReactNode }[] = [
    { t: 'MAC-ul de 48 de biți', body: <><div className="mono" style={{ fontSize: '1.05rem' }}><Nb c={mac6.slice(0, 3).join(':')} col={C.oui} />:<Nb c={mac6.slice(3).join(':')} col={C.nic} /></div><div className="tiny muted">primii 24 de biți = <b>OUI</b> (producătorul) · ultimii 24 = numărul plăcii</div></> },
    { t: 'Împarte-l în două jumătăți de câte 24 de biți', body: <div className="mono" style={{ fontSize: '1.05rem' }}><Nb c={h.slice(0, 6)} col={C.oui} /> <span className="muted">|</span> <Nb c={h.slice(6)} col={C.nic} /></div> },
    { t: 'Inserează FFFE la mijloc (24 + 16 + 24 = 64 de biți)', body: <div className="mono" style={{ fontSize: '1.05rem' }}><Nb c={h.slice(0, 6)} col={C.oui} /><Nb c="fffe" col={C.f} /><Nb c={h.slice(6)} col={C.nic} /></div> },
    { t: 'Scrie primul octet în binar și găsește al 7-lea bit (U/L)', body: <><div className="mono" style={{ fontSize: '1.05rem' }}>{h.slice(0, 2)} = {bin.split('').map((c, i) => <span key={i} style={i === 6 ? { color: C.flip, fontWeight: 800, textDecoration: 'underline' } : { color: 'var(--text-2)' }}>{c}{i === 3 ? ' ' : ''}</span>)}</div><div className="tiny muted">bitul 7 (valoarea 0x02) = <b>U/L</b>: {bin[6] === '0' ? '0 = MAC universal (unic, dat de producător)' : '1 = MAC administrat local (setat manual sau aleator)'}</div></> },
    { t: 'Inversează (flip) bitul 7', body: <><div className="mono" style={{ fontSize: '1.05rem' }}>{bin.split('').map((c, i) => <span key={i} style={i === 6 ? { color: C.flip, fontWeight: 800 } : { color: 'var(--muted)' }}>{c}{i === 3 ? ' ' : ''}</span>)} → {nbin.split('').map((c, i) => <span key={i} style={i === 6 ? { color: 'var(--ok)', fontWeight: 800, textDecoration: 'underline' } : { color: 'var(--text-2)' }}>{c}{i === 3 ? ' ' : ''}</span>)} = <Nb c={nb0.toString(16).padStart(2, '0')} col="var(--ok)" /></div><div className="tiny muted">{h[1]} → {nb0.toString(16).padStart(2, '0')[1]}: a doua cifră hex se schimbă cu ±2 ({bin[6] === '0' ? '+2' : '−2, pentru că bitul era deja 1'}). Este o <b>inversare</b>, nu „setare la 1”.</div></> },
    { t: 'Grupează în hextete → Interface ID', body: <><div className="mono" style={{ fontSize: '1.05rem', wordBreak: 'break-all' }}><Nb c={iidFull.slice(0, 2)} col="var(--ok)" /><Nb c={iidFull.slice(2, 7)} col={C.oui} /><Nb c={iidFull.slice(7, 9)} col={C.f} /><Nb c=":" col="var(--muted)" bold={false} /><Nb c={iidFull.slice(10, 12)} col={C.f} /><Nb c={iidFull.slice(12)} col={C.nic} /></div><div className="tiny muted">fără zerourile din față: <span className="mono">{iidShort}</span></div></> },
    { t: 'Lipește-l după prefixul /64', body: <><div className="mono" style={{ fontSize: '1.02rem', wordBreak: 'break-all' }}>{full ? <><span style={{ color: 'var(--accent)', fontWeight: 650 }}>{full.split(':').length && short6(pfx64!.padEnd(32, '0')).replace(/::$/, '')}</span> + {iidShort} = <b style={{ color: 'var(--accent)' }}>{full}</b></> : <span style={{ color: 'var(--bad)' }}>prefix invalid</span>}</div>
      <ul className="tiny" style={{ margin: '6px 0 0', paddingLeft: 18 }}>
        <li>Link-local generată automat: <b className="mono">{lla}</b></li>
        <li>Grup solicited-node (comun ambelor adrese): <b className="mono">{solicitedNode(('0'.repeat(16) + iid))}</b></li>
        {pp && pp.plen != null && pp.plen !== 64 && <li style={{ color: 'var(--warn)' }}>Prefixul tău e /{pp.plen}. EUI-64 (și SLAAC) presupun un /64; pentru un prefix mai lung, biții prefixului au prioritate față de Interface ID.</li>}
      </ul></> },
  ];
  return (
    <div>
      <div className="grid c2" style={{ gap: 10 }}>
        <label className="field">Adresa MAC<input className="input mono" value={mac} onChange={(e) => { setMac(e.target.value); }} spellCheck={false} aria-label="MAC" /></label>
        <label className="field">Prefix (/64)<input className="input mono" value={pfx} onChange={(e) => setPfx(e.target.value)} spellCheck={false} aria-label="Prefix IPv6" /></label>
      </div>
      <Presets items={EUI_PRESETS} onPick={(x) => { setMac(x); setStep(0); }} />
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.slice(0, step + 1).map((r, i) => (
          <div key={i} className="fade-up" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', border: '1px solid var(--border)', borderRadius: 12, padding: '8px 12px', background: i === step ? soft('var(--accent)', 7) : 'transparent' }}>
            <span className="badge accent" style={{ flex: 'none', marginTop: 2 }}>{i + 1}</span>
            <div style={{ minWidth: 0 }}><div className="small" style={{ fontWeight: 650, marginBottom: 4 }}>{r.t}</div>{r.body}</div>
          </div>
        ))}
      </div>
      <div className="controls" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <button type="button" className="btn sm" disabled={step === 0} onClick={() => setStep(step - 1)}>← Înapoi</button>
        <button type="button" className="btn sm primary" disabled={step === MAX} onClick={() => setStep(step + 1)}>Pasul următor →</button>
        <button type="button" className="btn sm ghost" onClick={() => setStep(step === MAX ? 0 : MAX)}>{step === MAX ? 'Ia-o de la capăt' : 'Arată tot'}</button>
        <span className="small muted">pasul {step + 1} / {MAX + 1}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   11) Topologii laborator
---------------------------------------------------------------- */
export function LabGuidedTopology() {
  return (
    <svg viewBox="0 0 720 270" role="img" aria-label="Topologie lab ghidat 1.9" width="100%">
      <RouterIcon x={360} y={60} label="R1 (2911)" sub="ipv6 unicast-routing" />
      <line x1={334} y1={70} x2={200} y2={140} stroke="var(--text-2)" strokeWidth={2} />
      <line x1={386} y1={70} x2={560} y2={160} stroke="var(--text-2)" strokeWidth={2} />
      <T x={250} y={96} size={10.5} m color="var(--accent)" anchor="end">G0/0 · 2001:db8:acad:1::/64 eui-64</T>
      <T x={470} y={96} size={10.5} m color="var(--info)" anchor="start">G0/1 · 2001:db8:acad:2::1/64</T>
      <SwitchIcon x={180} y={152} label="S1 (2960)" />
      <line x1={160} y1={164} x2={100} y2={216} stroke="var(--text-2)" strokeWidth={2} />
      <line x1={200} y1={164} x2={260} y2={216} stroke="var(--text-2)" strokeWidth={2} />
      <ClientIcon x={90} y={228} kind="pc" label="PC1 (Automatic)" />
      <ClientIcon x={270} y={228} kind="pc" label="PC2 (Automatic)" />
      <ClientIcon x={570} y={178} kind="pc" label="PC3 (static ::10)" />
      <T x={360} y={264} size={11} color="var(--muted)">LAN 1: SLAAC + EUI-64 · LAN 2: adrese statice · link-local fe80::1 pe ambele interfețe ale R1 (pasul 7)</T>
    </svg>
  );
}
export function LabSoloTopology() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Topologie lab solo 1.9" width="100%">
      <RouterIcon x={360} y={60} label="R1" sub="MAC G0/0 0011.2233.4455 · G0/1 00e0.f7a1.0b2c" />
      <line x1={330} y1={68} x2={160} y2={160} stroke="var(--text-2)" strokeWidth={2} />
      <line x1={390} y1={68} x2={560} y2={160} stroke="var(--text-2)" strokeWidth={2} />
      <T x={220} y={104} size={10.5} m color="var(--accent)" anchor="end">G0/0 · 2001:db8:cafe:a::/64</T>
      <T x={500} y={104} size={10.5} m color="var(--info)" anchor="start">G0/1 · 2001:db8:cafe:b::/64</T>
      <ClientIcon x={150} y={176} kind="pc" label="PC-A · MAC 0a1b.2c3d.4e5f" />
      <ClientIcon x={570} y={176} kind="pc" label="PC-B · MAC 6c3b.e59a.01ff" />
      <T x={360} y={244} size={11} color="var(--muted)">Toate Interface ID-urile se obțin prin EUI-64 · PC-urile pe „Automatic” (SLAAC)</T>
    </svg>
  );
}
