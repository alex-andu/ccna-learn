import { useMemo, useState, type ReactNode } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { intToIp, ipToInt, maskOf, toBin } from '../lib/subnet';

/* Diagrame originale pentru 1.10 — Verify IP parameters for Client OS.
   Culori DOAR prin variabile CSS, ca să meargă în ambele teme. */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
const Wire = ({ x1, y1, x2, y2, color = 'var(--text-2)', w = 2, dash }: { x1: number; y1: number; x2: number; y2: number; color?: string; w?: number; dash?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" />
);
export function ServerIcon({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) {
  return (
    <g>
      <rect x={x - 14} y={y - 20} width={28} height={40} rx={3} fill="var(--surface-3)" stroke="var(--ok)" strokeWidth={1.6} />
      <path d={`M${x - 8} ${y - 10} h16 M${x - 8} ${y - 2} h16 M${x - 8} ${y + 6} h16`} stroke="var(--ok)" strokeWidth={1.3} />
      {label && <T x={x} y={y + 36} weight={650}>{label}</T>}
      {sub && <T x={x} y={y + 50} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}

/* ---------------------------------------------------------------
   1) Cei 4 parametri ai unui host — interactiv (click pe parametru)
---------------------------------------------------------------- */
type ParamKey = 'ip' | 'mask' | 'gw' | 'dns';
const PARAMS: { k: ParamKey; label: string; value: string; color: string; text: string }[] = [
  { k: 'ip', label: 'IPv4 Address', value: '192.168.1.23', color: 'var(--accent)', text: 'Identitatea hostului la nivelul 3. Fără ea, nimeni nu-i poate trimite pachete. Trebuie să fie unică în rețea.' },
  { k: 'mask', label: 'Subnet Mask', value: '255.255.255.0 (/24)', color: 'var(--info)', text: 'Trasează granița „vecinătății”: cine e în aceeași rețea cu mine (îi trimit direct) și cine e în altă rețea (trimit prin gateway).' },
  { k: 'gw', label: 'Default Gateway', value: '192.168.1.1', color: 'var(--violet)', text: 'Ușa de ieșire: adresa routerului din rețeaua locală căruia îi dau tot ce e destinat altor rețele. Trebuie să fie în ACEEAȘI rețea cu hostul.' },
  { k: 'dns', label: 'DNS Server', value: '192.168.1.1', color: 'var(--warn)', text: 'Cartea de telefon: traduce nume (www.cisco.com) în adrese IP. Fără DNS, merge ping 8.8.8.8, dar nu merge niciun site după nume.' },
];
export function HostParams() {
  const [k, setK] = useState<ParamKey>('ip');
  const p = PARAMS.find((x) => x.k === k)!;
  const on = (key: ParamKey) => k === key;
  return (
    <>
      <svg viewBox="0 0 720 300" role="img" aria-label="Parametrii IP ai unui host și la ce folosește fiecare">
        {/* LAN local */}
        <rect x={20} y={40} width={400} height={230} rx={16} fill={on('mask') ? 'var(--info)' : 'var(--surface-3)'} fillOpacity={on('mask') ? 0.1 : 0.35} stroke={on('mask') ? 'var(--info)' : 'var(--border)'} strokeDasharray="6 5" strokeWidth={1.5} />
        <T x={36} y={62} anchor="start" size={11.5} color={on('mask') ? 'var(--info)' : 'var(--muted)'} weight={600}>rețeaua locală 192.168.1.0/24 (definită de mască)</T>
        {/* host card */}
        <rect x={40} y={86} width={210} height={164} rx={12} fill="var(--surface)" stroke="var(--border)" />
        <ClientIcon x={145} y={110} kind="laptop" />
        <T x={145} y={140} weight={650}>LAPTOP-01</T>
        {PARAMS.map((x, i) => (
          <g key={x.k} style={{ cursor: 'pointer' }} onClick={() => setK(x.k)}>
            <rect x={50} y={150 + i * 24} width={190} height={21} rx={6} fill={on(x.k) ? x.color : 'transparent'} fillOpacity={0.16} stroke={on(x.k) ? x.color : 'transparent'} />
            <T x={58} y={165 + i * 24} anchor="start" size={10.5} color="var(--muted)">{x.label}</T>
            <T x={234} y={165 + i * 24} anchor="end" size={10.5} m color={on(x.k) ? x.color : 'var(--text)'} weight={600}>{x.value.split(' ')[0]}</T>
          </g>
        ))}
        {/* vecin */}
        <ClientIcon x={340} y={130} kind="pc" label="PC vecin .50" />
        <Wire x1={252} y1={130} x2={320} y2={130} color={on('ip') || on('mask') ? 'var(--accent)' : 'var(--text-2)'} />
        <T x={286} y={122} size={9.5} color="var(--muted)">direct</T>
        {/* router */}
        <RouterIcon x={340} y={220} label="" />
        <T x={340} y={250} size={10.5} weight={650} color={on('gw') ? 'var(--violet)' : 'var(--text)'}>R1 · 192.168.1.1</T>
        <Wire x1={252} y1={200} x2={310} y2={216} color={on('gw') ? 'var(--violet)' : 'var(--text-2)'} w={on('gw') ? 3 : 2} />
        {/* internet */}
        <Wire x1={370} y1={220} x2={520} y2={220} color={on('gw') ? 'var(--violet)' : 'var(--text-2)'} w={on('gw') ? 3 : 2} />
        <ellipse cx={590} cy={220} rx={72} ry={34} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={590} y={216} weight={650}>alte rețele</T>
        <T x={590} y={232} size={10.5} color="var(--muted)">Internet · 8.8.8.8</T>
        {/* dns */}
        <rect x={510} y={70} width={160} height={70} rx={12} fill={on('dns') ? 'var(--warn)' : 'var(--surface-3)'} fillOpacity={on('dns') ? 0.14 : 0.5} stroke={on('dns') ? 'var(--warn)' : 'var(--border)'} />
        <T x={590} y={94} weight={650} color={on('dns') ? 'var(--warn)' : 'var(--text)'}>DNS</T>
        <T x={590} y={112} size={10.5} m color="var(--text-2)">www.cisco.com → ?</T>
        <T x={590} y={128} size={10.5} m color="var(--text-2)">→ 203.0.113.10</T>
        {on('dns') && <path d="M252 230 C 420 300, 470 160, 508 120" fill="none" stroke="var(--warn)" strokeWidth={2} strokeDasharray="5 4" />}
        <T x={360} y={292} size={11} color="var(--muted)">Click pe un parametru (sau pe butoanele de mai jos) ca să vezi ce rol are.</T>
      </svg>
      <div className="controls">
        <div className="tabs" role="group" aria-label="Parametru">
          {PARAMS.map((x) => <button key={x.k} className={k === x.k ? 'on' : ''} onClick={() => setK(x.k)}>{x.label}</button>)}
        </div>
      </div>
      <p className="small" style={{ margin: '10px 0 0' }}><b style={{ color: p.color }}>{p.label}</b> — {p.text}</p>
    </>
  );
}

/* ---------------------------------------------------------------
   2) Decizia local vs. remote — AND între IP și mască (interactiv)
---------------------------------------------------------------- */
const HOSTS = [
  { ip: '192.168.1.23', gw: '192.168.1.1', label: 'Host A — 192.168.1.23, GW 192.168.1.1' },
  { ip: '192.168.1.130', gw: '192.168.1.1', label: 'Host B — 192.168.1.130, GW 192.168.1.1' },
];
const DESTS = ['192.168.1.50', '192.168.1.200', '192.168.2.10', '8.8.8.8', '10.0.0.5'];

export function LocalRemote() {
  const [h, setH] = useState(0);
  const [prefix, setPrefix] = useState(24);
  const [dest, setDest] = useState('192.168.1.50');
  const host = HOSTS[h];
  const r = useMemo(() => {
    const a = ipToInt(host.ip)!; const d = ipToInt(dest); const g = ipToInt(host.gw)!;
    const m = maskOf(prefix);
    if (d == null) return null;
    const hn = (a & m) >>> 0, dn = (d & m) >>> 0, gn = (g & m) >>> 0;
    return { a, d, g, m, hn, dn, local: hn === dn, gwOk: hn === gn };
  }, [host, dest, prefix]);
  const bits = (n: number) => toBin(n);
  const colorBits = (s: string) => {
    let seen = 0;
    return s.split('').map((c, i) => {
      if (c === '.') return <span key={i} style={{ color: 'var(--muted)' }}>.</span>;
      const isNet = seen++ < prefix;
      return <span key={i} style={{ color: isNet ? 'var(--info)' : 'var(--muted)', fontWeight: isNet ? 650 : 400 }}>{c}</span>;
    });
  };
  const local = r?.local;
  const pathColor = local ? 'var(--accent)' : 'var(--violet)';
  return (
    <>
      <div className="controls" style={{ marginTop: 0, marginBottom: 12 }}>
        <select className="input" style={{ maxWidth: 330 }} value={h} onChange={(e) => setH(+e.target.value)} aria-label="Hostul sursă">
          {HOSTS.map((x, i) => <option key={x.ip} value={i}>{x.label}</option>)}
        </select>
        <label className="small muted row" style={{ gap: 6 }}>masca hostului
          <select className="input" value={prefix} onChange={(e) => setPrefix(+e.target.value)} aria-label="Prefixul hostului">
            {[16, 23, 24, 25, 26].map((p) => <option key={p} value={p}>/{p} = {intToIp(maskOf(p))}</option>)}
          </select>
        </label>
        <label className="small muted row" style={{ gap: 6 }}>destinație
          <input className="input mono" style={{ width: 150 }} value={dest} onChange={(e) => setDest(e.target.value)} aria-label="Adresa destinație" />
        </label>
        <div className="tabs" role="group" aria-label="Destinații rapide">
          {DESTS.map((d) => <button key={d} className={dest === d ? 'on' : ''} onClick={() => setDest(d)}>{d}</button>)}
        </div>
      </div>
      {!r ? <p className="small" style={{ color: 'var(--bad)' }}>Adresă destinație invalidă — scrie patru octeți 0–255.</p> : (
        <>
          <div className="table-wrap"><table className="t mono" style={{ fontSize: '0.78rem' }}>
            <thead><tr><th>Ce</th><th>Zecimal</th><th>Binar (biții de rețea colorați)</th></tr></thead>
            <tbody>
              <tr><td>IP host</td><td>{host.ip}</td><td>{colorBits(bits(r.a))}</td></tr>
              <tr><td>Mască /{prefix}</td><td>{intToIp(r.m)}</td><td>{colorBits(bits(r.m))}</td></tr>
              <tr><td><b>Rețeaua mea</b> (IP AND mască)</td><td><b>{intToIp(r.hn)}</b></td><td>{colorBits(bits(r.hn))}</td></tr>
              <tr><td>IP destinație</td><td>{dest}</td><td>{colorBits(bits(r.d))}</td></tr>
              <tr><td><b>Rețeaua destinației</b> (dest AND <i>masca mea</i>)</td><td><b>{intToIp(r.dn)}</b></td><td>{colorBits(bits(r.dn))}</td></tr>
            </tbody>
          </table></div>
          <svg viewBox="0 0 720 210" role="img" aria-label={local ? 'Destinație locală: ARP direct pentru destinație' : 'Destinație remote: ARP pentru gateway'}>
            <rect x={14} y={20} width={430} height={170} rx={14} fill="var(--info)" fillOpacity={0.06} stroke="var(--info)" strokeOpacity={0.5} strokeDasharray="6 5" />
            <T x={28} y={40} anchor="start" size={11} color="var(--info)" weight={600}>„rețeaua mea” după calculul hostului: {intToIp(r.hn)}/{prefix}</T>
            <ClientIcon x={70} y={100} kind="laptop" label={host.ip} />
            <SwitchIcon x={230} y={100} />
            <Wire x1={88} y1={100} x2={198} y2={100} color={pathColor} w={3} />
            {local ? (
              <>
                <ClientIcon x={380} y={100} kind="pc" label={dest} />
                <Wire x1={262} y1={100} x2={362} y2={100} color={pathColor} w={3} />
                <RouterIcon x={540} y={100} label="R1" sub={host.gw} />
                <Wire x1={262} y1={108} x2={510} y2={108} color="var(--border)" w={1.5} dash="3 4" />
              </>
            ) : (
              <>
                <RouterIcon x={380} y={100} label="R1 (gateway)" sub={host.gw} />
                <Wire x1={262} y1={100} x2={350} y2={100} color={pathColor} w={3} />
                <Wire x1={410} y1={100} x2={560} y2={100} color={pathColor} w={3} />
                <ellipse cx={625} cy={100} rx={68} ry={30} fill="var(--surface-3)" stroke="var(--border)" />
                <T x={625} y={97} weight={650} size={11.5}>altă rețea</T>
                <T x={625} y={113} size={10.5} m color="var(--text-2)">{dest}</T>
              </>
            )}
            <rect x={14} y={150} width={692} height={44} rx={10} fill={pathColor} fillOpacity={0.1} stroke={pathColor} strokeOpacity={0.6} />
            <T x={28} y={168} anchor="start" size={11.5} weight={650} color={pathColor}>{local ? 'LOCAL → ARP „cine are ' + dest + '?” — cadrul pleacă direct la MAC-ul destinației' : 'REMOTE → ARP „cine are ' + host.gw + '?” — cadrul pleacă la MAC-ul gateway-ului'}</T>
            <T x={28} y={185} anchor="start" size={10.5} m color="var(--text-2)">{'cadru: dst MAC = ' + (local ? 'MAC(' + dest + ')' : 'MAC(' + host.gw + ')') + ' · pachet: dst IP = ' + dest + ' (IP-ul NU se schimbă)'}</T>
          </svg>
          {!r.gwOk && (
            <p className="small" style={{ color: 'var(--bad)', margin: '8px 0 0' }}>
              <b>Atenție:</b> cu masca /{prefix}, gateway-ul {host.gw} NU este în rețeaua hostului ({intToIp(r.hn)}/{prefix}). Hostul nu-și poate atinge „ușa de ieșire” — tot ce e remote eșuează. Asta e o capcană clasică de examen.
            </p>
          )}
          {prefix !== 24 && r.gwOk && (
            <p className="small muted" style={{ margin: '8px 0 0' }}>Rețeaua reală este 192.168.1.0/24. Cu o mască greșită (/{prefix}), hostul poate clasifica greșit destinațiile: unele „remote” par locale (mască prea scurtă) sau invers (mască prea lungă).</p>
          )}
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------------
   3) Decodor mască hex (macOS ifconfig: netmask 0xffffff00)
---------------------------------------------------------------- */
const HEXES = ['0xffffff00', '0xffffff80', '0xffffffc0', '0xfffffff0', '0xfffffe00', '0xffff0000', '0xff000000'];
export function HexMask() {
  const [hx, setHx] = useState('0xffffff00');
  const clean = hx.trim().toLowerCase().replace(/^0x/, '');
  const valid = /^[0-9a-f]{8}$/.test(clean);
  const n = valid ? parseInt(clean, 16) >>> 0 : 0;
  const bin = n.toString(2).padStart(32, '0');
  const contiguous = valid && /^1*0*$/.test(bin);
  const prefix = bin.indexOf('0') === -1 ? 32 : bin.indexOf('0');
  const pairs = valid ? [0, 2, 4, 6].map((i) => clean.slice(i, i + 2)) : [];
  return (
    <>
      <div className="controls" style={{ marginTop: 0, marginBottom: 12 }}>
        <label className="small muted row" style={{ gap: 6 }}>netmask
          <input className="input mono" style={{ width: 140 }} value={hx} onChange={(e) => setHx(e.target.value)} aria-label="Mască hexazecimală" />
        </label>
        <div className="tabs" role="group" aria-label="Exemple">
          {HEXES.map((h) => <button key={h} className={hx === h ? 'on' : ''} onClick={() => setHx(h)}>{h}</button>)}
        </div>
      </div>
      {!valid ? <p className="small" style={{ color: 'var(--bad)' }}>Scrie 8 cifre hexazecimale (0–9, a–f), opțional cu prefixul 0x.</p> : (
        <svg viewBox="0 0 720 200" role="img" aria-label={`Masca ${hx} = ${intToIp(n)} = /${prefix}`}>
          {pairs.map((p, i) => {
            const x = 30 + i * 172;
            const oct = parseInt(p, 16);
            return (
              <g key={i}>
                <rect x={x} y={16} width={150} height={128} rx={12} fill="var(--surface-3)" fillOpacity={0.5} stroke="var(--border)" />
                <T x={x + 75} y={40} size={18} m weight={700} color="var(--accent)">{p}</T>
                <T x={x + 40} y={66} size={12} m color="var(--text-2)">{p[0]}={parseInt(p[0], 16).toString(2).padStart(4, '0')}</T>
                <T x={x + 110} y={66} size={12} m color="var(--text-2)">{p[1]}={parseInt(p[1], 16).toString(2).padStart(4, '0')}</T>
                <T x={x + 75} y={94} size={13} m color="var(--info)">{oct.toString(2).padStart(8, '0')}</T>
                <T x={x + 75} y={128} size={20} weight={700}>{oct}</T>
                {i < 3 && <T x={x + 161} y={128} size={20} weight={700} color="var(--muted)">.</T>}
              </g>
            );
          })}
          <T x={360} y={176} size={14} weight={650} color={contiguous ? 'var(--ok)' : 'var(--bad)'}>
            {contiguous ? `${hx.startsWith('0x') ? hx : '0x' + clean} = ${intToIp(n)} = /${prefix}` : 'Mască invalidă: biții de 1 trebuie să fie continui, de la stânga'}
          </T>
          <T x={360} y={194} size={10.5} color="var(--muted)">Fiecare cifră hex = 4 biți · fiecare pereche hex = un octet · f = 1111, e = 1110, c = 1100, 8 = 1000, 0 = 0000</T>
        </svg>
      )}
    </>
  );
}

/* ---------------------------------------------------------------
   4) DHCP reușit vs. eșuat → APIPA (toggle)
---------------------------------------------------------------- */
export function DhcpVsApipa() {
  const [ok, setOk] = useState(true);
  const msgs = ok
    ? [{ t: 'DHCPDISCOVER (broadcast)', dir: 1 }, { t: 'DHCPOFFER 192.168.1.23', dir: -1 }, { t: 'DHCPREQUEST', dir: 1 }, { t: 'DHCPACK (IP, mască, GW, DNS, lease)', dir: -1 }]
    : [{ t: 'DHCPDISCOVER', dir: 1 }, { t: 'DHCPDISCOVER (retransmis)', dir: 1 }, { t: 'DHCPDISCOVER (retransmis)', dir: 1 }, { t: '… niciun răspuns', dir: 0 }];
  return (
    <>
      <div className="segmented" role="group" aria-label="Scenariu DHCP" style={{ marginBottom: 12 }}>
        <button className={ok ? 'on' : ''} onClick={() => setOk(true)}>Serverul DHCP răspunde</button>
        <button className={!ok ? 'on' : ''} onClick={() => setOk(false)}>Serverul DHCP lipsește</button>
      </div>
      <svg viewBox="0 0 720 280" role="img" aria-label={ok ? 'DHCP reușit: DORA' : 'DHCP eșuat: client cu APIPA 169.254'}>
        <ClientIcon x={110} y={40} kind="laptop" label="client" />
        {ok ? <ServerIcon x={610} y={44} label="DHCP server" /> : (
          <g><rect x={582} y={24} width={56} height={40} rx={6} fill="none" stroke="var(--bad)" strokeDasharray="5 4" /><T x={610} y={49} size={20} color="var(--bad)" weight={700}>✕</T><T x={610} y={82} weight={650} color="var(--bad)">nimeni</T></g>
        )}
        <Wire x1={110} y1={78} x2={110} y2={220} color="var(--border)" dash="4 4" />
        <Wire x1={610} y1={98} x2={610} y2={220} color="var(--border)" dash="4 4" />
        <defs>
          <marker id="dA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)" /></marker>
          <marker id="dB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ok)" /></marker>
          <marker id="dC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--bad)" /></marker>
        </defs>
        {msgs.map((m, i) => {
          const y = 104 + i * 30;
          if (m.dir === 0) return <T key={i} x={360} y={y + 4} color="var(--bad)" weight={600}>{m.t}</T>;
          const right = m.dir === 1;
          const col = ok ? (right ? 'var(--accent)' : 'var(--ok)') : 'var(--bad)';
          return (
            <g key={i}>
              <line x1={right ? 114 : 606} x2={right ? (ok ? 604 : 520) : 116} y1={y} y2={y} stroke={col} strokeWidth={2} markerEnd={`url(#${ok ? (right ? 'dA' : 'dB') : 'dC'})`} strokeDasharray={ok ? undefined : '6 4'} />
              <T x={360} y={y - 6} size={11} color="var(--text-2)">{m.t}</T>
            </g>
          );
        })}
        <rect x={20} y={226} width={680} height={46} rx={10} fill={ok ? 'var(--ok)' : 'var(--bad)'} fillOpacity={0.1} stroke={ok ? 'var(--ok)' : 'var(--bad)'} strokeOpacity={0.6} />
        <T x={36} y={245} anchor="start" size={12} weight={650} color={ok ? 'var(--ok)' : 'var(--bad)'}>{ok ? 'Rezultat: 192.168.1.23 / 255.255.255.0 · GW 192.168.1.1 · DNS 192.168.1.1 · lease 24 h' : 'Rezultat: 169.254.37.112 / 255.255.0.0 · fără gateway · fără DNS (APIPA)'}</T>
        <T x={36} y={263} anchor="start" size={10.5} color="var(--text-2)">{ok ? 'Clientul poate comunica local și cu alte rețele.' : 'Clientul vorbește doar cu alți vecini APIPA de pe același segment. Continuă să încerce DHCP în fundal.'}</T>
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------
   5) Scara de ping — unde se rupe? (interactiv)
---------------------------------------------------------------- */
const LADDER = [
  { cmd: 'ping 127.0.0.1', what: 'stiva TCP/IP locală', fail: 'Stiva TCP/IP a sistemului de operare are o problemă (rar). Reinstalează/resetează stiva (pe Windows: netsh int ip reset).' },
  { cmd: 'ping <IP-ul meu>', what: 'propria interfață', fail: 'Interfața nu are adresa pe care crezi că o are, e dezactivată sau driverul are probleme. Verifică ipconfig / ip a.' },
  { cmd: 'ping <gateway>', what: 'LAN-ul + gateway-ul', fail: 'Problemă locală: cablu/Wi-Fi, VLAN greșit pe portul switch-ului, gateway greșit sau mască greșită, firewall pe router. Verifică arp -a: apare MAC-ul gateway-ului?' },
  { cmd: 'ping 8.8.8.8 (IP remote)', what: 'rutarea dincolo de gateway', fail: 'Gateway-ul răspunde, dar nu se ajunge mai departe: lipsă rută pe router, NAT, ISP sau un firewall. Folosește tracert / traceroute ca să vezi unde se oprește.' },
  { cmd: 'ping www.cisco.com', what: 'DNS', fail: 'IP-urile merg, numele nu → problemă DNS: server DNS lipsă/greșit, cache vechi. Verifică ipconfig /all (DNS Servers), nslookup, ipconfig /flushdns.' },
];
export function PingLadder() {
  const [fail, setFail] = useState<number | null>(null);
  return (
    <>
      <svg viewBox="0 0 720 270" role="img" aria-label="Scara de ping: de la loopback la nume DNS">
        {LADDER.map((s, i) => {
          const y = 18 + i * 50;
          const st = fail == null ? 'idle' : i < fail ? 'ok' : i === fail ? 'bad' : 'skip';
          const col = st === 'ok' ? 'var(--ok)' : st === 'bad' ? 'var(--bad)' : st === 'skip' ? 'var(--muted)' : 'var(--accent)';
          return (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => setFail(fail === i ? null : i)}>
              <rect x={20 + i * 40} y={y} width={440} height={40} rx={10} fill={col} fillOpacity={st === 'skip' ? 0.04 : 0.12} stroke={col} strokeOpacity={0.7} />
              <T x={36 + i * 40} y={y + 25} anchor="start" size={12.5} m weight={650} color={col}>{i + 1}. {s.cmd}</T>
              <T x={448 + i * 40} y={y + 25} anchor="end" size={11} color="var(--text-2)">{s.what}</T>
              <T x={478 + i * 40} y={y + 26} anchor="start" size={15} weight={700} color={col}>{st === 'ok' ? '✓' : st === 'bad' ? '✕' : st === 'skip' ? '·' : '?'}</T>
            </g>
          );
        })}
      </svg>
      <p className="small" style={{ margin: '10px 0 0' }}>
        {fail == null ? <>Click pe treapta la care <b>primul ping eșuează</b>. Toate treptele de dedesubt au reușit.</> : <><b style={{ color: 'var(--bad)' }}>Eșec la pasul {fail + 1}:</b> {LADDER[fail].fail}</>}
      </p>
    </>
  );
}

/* ---------------------------------------------------------------
   6) Topologii laborator
---------------------------------------------------------------- */
function LabBase({ pcs, note }: { pcs: { x: number; label: string; sub?: string; bad?: boolean }[]; note: string }) {
  return (
    <svg viewBox="0 0 720 300" role="img" aria-label="Topologie laborator: LAN 192.168.10.0/24 — R1 — R2 — LAN 192.168.20.0/24 cu server DNS">
      <rect x={10} y={10} width={330} height={250} rx={14} fill="var(--accent)" fillOpacity={0.05} stroke="var(--accent)" strokeOpacity={0.35} strokeDasharray="6 5" />
      <T x={24} y={30} anchor="start" size={11} color="var(--accent)" weight={600}>LAN A · 192.168.10.0/24</T>
      <rect x={470} y={10} width={240} height={250} rx={14} fill="var(--ok)" fillOpacity={0.05} stroke="var(--ok)" strokeOpacity={0.35} strokeDasharray="6 5" />
      <T x={696} y={30} anchor="end" size={11} color="var(--ok)" weight={600}>LAN B · 192.168.20.0/24</T>
      <RouterIcon x={270} y={70} label="R1" sub="G0/0 .1 · DHCP pool" />
      <RouterIcon x={540} y={70} label="R2" sub="G0/0 .1" />
      <line x1={300} y1={70} x2={510} y2={70} stroke="var(--text-2)" strokeWidth={2} />
      <T x={405} y={60} size={10.5} color="var(--muted)">10.0.0.0/30</T>
      <T x={330} y={88} size={10} color="var(--muted)" anchor="start">G0/1 .1</T>
      <T x={480} y={88} size={10} color="var(--muted)" anchor="end">G0/1 .2</T>
      <SwitchIcon x={170} y={150} label="SW1" />
      <line x1={250} y1={82} x2={190} y2={138} stroke="var(--text-2)" strokeWidth={2} />
      {pcs.map((p, i) => (
        <g key={i}>
          <line x1={170} y1={162} x2={p.x} y2={200} stroke={p.bad ? 'var(--bad)' : 'var(--text-2)'} strokeWidth={1.6} />
          <ClientIcon x={p.x} y={214} kind="pc" />
          <T x={p.x} y={240} size={10.5} weight={650} color={p.bad ? 'var(--bad)' : 'var(--text)'}>{p.label}</T>
          {p.sub && <T x={p.x} y={253} size={9.5} color="var(--muted)">{p.sub}</T>}
        </g>
      ))}
      <SwitchIcon x={590} y={150} label="SW2" />
      <line x1={548} y1={84} x2={584} y2={138} stroke="var(--text-2)" strokeWidth={2} />
      <line x1={590} y1={162} x2={590} y2={196} stroke="var(--text-2)" strokeWidth={1.6} />
      <ServerIcon x={590} y={214} label="SRV1" sub="192.168.20.10 · DNS + HTTP" />
      <T x={360} y={290} size={11} color="var(--muted)">{note}</T>
    </svg>
  );
}
export function LabGuidedTopology() {
  return <LabBase pcs={[{ x: 50, label: 'PC1', sub: 'DHCP' }, { x: 140, label: 'PC2', sub: 'DHCP' }, { x: 230, label: 'PC3', sub: 'static .50' }]}
    note="DHCP pe R1: 192.168.10.11–254 · GW 192.168.10.1 · DNS 192.168.20.10 (SRV1) · www.ccna.lab → 192.168.20.10" />;
}
export function LabTicketsTopology() {
  return <LabBase pcs={[{ x: 36, label: 'PC-A', bad: true }, { x: 96, label: 'PC-B', bad: true }, { x: 156, label: 'PC-C', bad: true }, { x: 216, label: 'PC-D', bad: true }, { x: 282, label: 'PC-E', bad: true }]}
    note="Cinci tichete: fiecare PC are o singură problemă. Rețeaua (R1, R2, SRV1) este corectă." />;
}
