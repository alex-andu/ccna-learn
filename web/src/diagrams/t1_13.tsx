import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ClientIcon, SwitchIcon } from './wlan';

/* Diagrame originale pentru 1.13 Describe switching concepts.
   Culori DOAR prin variabile CSS, ca să meargă în ambele teme. */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const mono = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? mono : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
const Line = ({ x1, y1, x2, y2, c = 'var(--text-2)', w = 2, flow = false, dash }: { x1: number; y1: number; x2: number; y2: number; c?: string; w?: number; flow?: boolean; dash?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} className={flow ? 'flow' : undefined} strokeDasharray={dash} style={{ transition: 'stroke .3s' }} />
);
function HubIcon({ x, y, label = 'HUB' }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <rect x={x - 26} y={y - 11} width={52} height={22} rx={4} fill="var(--surface-3)" stroke="var(--warn)" strokeWidth={1.5} />
      <T x={x} y={y + 4} size={10} weight={700} color="var(--warn)">{label}</T>
    </g>
  );
}
function BridgeIcon({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 30} y={y - 12} width={60} height={24} rx={5} fill="var(--surface-3)" stroke="var(--violet)" strokeWidth={1.6} />
      <T x={x} y={y + 4} size={10} weight={700} color="var(--violet)">BRIDGE</T>
    </g>
  );
}
const Seg = <K extends string>({ value, set, items, label }: { value: K; set: (k: K) => void; items: [K, string][]; label: string }) => (
  <div className="segmented" role="group" aria-label={label} style={{ marginBottom: 12, flexWrap: 'wrap' }}>
    {items.map(([k, l]) => <button key={k} type="button" className={value === k ? 'on' : ''} onClick={() => set(k)}>{l}</button>)}
  </div>
);

/* ---------------------------------------------------------------
   1) Istoric: hub → bridge → switch (domenii de coliziune)
---------------------------------------------------------------- */
export function CollisionHistory() {
  const [v, setV] = useState<'hub' | 'bridge' | 'switch'>('hub');
  const info = {
    hub: { cd: 1, bd: 1, dup: 'half-duplex, CSMA/CD', t: 'Hub-ul (nivel 1) repetă fiecare bit pe toate porturile. Toți împart aceeași lățime de bandă; doi care transmit simultan = coliziune.' },
    bridge: { cd: 2, bd: 1, dup: 'half-duplex pe fiecare segment', t: 'Bridge-ul (nivel 2) învață MAC-urile și trimite cadrul pe celălalt segment doar dacă destinația e acolo. Coliziunile rămân în segmentul lor.' },
    switch: { cd: 4, bd: 1, dup: 'full-duplex pe fiecare port', t: 'Switch-ul = bridge cu multe porturi, în hardware. Fiecare port e propriul domeniu de coliziune; cu full-duplex coliziunile dispar complet.' },
  }[v];
  return (
    <>
      <Seg label="Generație" value={v} set={setV} items={[['hub', '1. Hub (anii ’80–’90)'], ['bridge', '2. Bridge'], ['switch', '3. Switch (din 1990)']]} />
      <svg viewBox="0 0 720 270" role="img" aria-label={`Domenii de coliziune: ${v}`}>
        <rect x={20} y={14} width={680} height={214} rx={18} fill="none" stroke="var(--violet)" strokeDasharray="7 5" strokeOpacity={0.7} />
        <T x={36} y={34} anchor="start" size={11} color="var(--violet)" weight={650}>1 domeniu de broadcast</T>
        {v === 'hub' && (
          <g>
            <ellipse cx={360} cy={128} rx={300} ry={88} fill="var(--bad)" fillOpacity={0.07} stroke="var(--bad)" strokeDasharray="5 5" />
            <HubIcon x={360} y={128} />
            {[150, 270, 450, 570].map((x, i) => <g key={x}><Line x1={x} y1={i % 2 ? 182 : 82} x2={360} y2={128} /><ClientIcon x={x} y={i % 2 ? 190 : 76} kind="pc" /></g>)}
            <T x={360} y={58} size={11} color="var(--bad)" weight={650}>1 domeniu de coliziune (toți împart același „fir”)</T>
          </g>
        )}
        {v === 'bridge' && (
          <g>
            <ellipse cx={190} cy={128} rx={150} ry={84} fill="var(--bad)" fillOpacity={0.07} stroke="var(--bad)" strokeDasharray="5 5" />
            <ellipse cx={530} cy={128} rx={150} ry={84} fill="var(--bad)" fillOpacity={0.07} stroke="var(--bad)" strokeDasharray="5 5" />
            <HubIcon x={190} y={128} /><HubIcon x={530} y={128} />
            <Line x1={216} y1={128} x2={330} y2={128} /><Line x1={390} y1={128} x2={504} y2={128} />
            <BridgeIcon x={360} y={128} />
            <Line x1={110} y1={86} x2={180} y2={120} /><ClientIcon x={100} y={78} kind="pc" />
            <Line x1={120} y1={176} x2={180} y2={136} /><ClientIcon x={110} y={186} kind="pc" />
            <Line x1={610} y1={86} x2={540} y2={120} /><ClientIcon x={620} y={78} kind="pc" />
            <Line x1={600} y1={176} x2={540} y2={136} /><ClientIcon x={610} y={186} kind="pc" />
            <T x={190} y={60} size={11} color="var(--bad)" weight={650}>domeniu de coliziune 1</T>
            <T x={530} y={60} size={11} color="var(--bad)" weight={650}>domeniu de coliziune 2</T>
          </g>
        )}
        {v === 'switch' && (
          <g>
            <SwitchIcon x={360} y={80} />
            {[130, 280, 440, 590].map((x) => (
              <g key={x}>
                <ellipse cx={(x + 360) / 2 + (x < 360 ? -10 : 10)} cy={150} rx={62} ry={58} fill="var(--bad)" fillOpacity={0.06} stroke="var(--bad)" strokeDasharray="5 5" />
                <Line x1={360 + (x - 360) * 0.08} y1={92} x2={x} y2={176} />
                <ClientIcon x={x} y={186} kind="pc" />
              </g>
            ))}
            <T x={360} y={44} size={11} color="var(--bad)" weight={650}>4 domenii de coliziune (câte unul per port)</T>
          </g>
        )}
        <T x={360} y={252} size={12} color="var(--text-2)">
          {`Domenii de coliziune: ${info.cd} · domenii de broadcast: ${info.bd} · ${info.dup}`}
        </T>
      </svg>
      <div className="callout tip" style={{ marginTop: 8 }}><div className="small">{info.t}</div></div>
    </>
  );
}

/* ---------------------------------------------------------------
   2) Cadrul Ethernet — click pe câmp → descriere
---------------------------------------------------------------- */
type Field = { k: string; n: string; b: string; w: number; c: string; l1?: boolean; d: ReactNode };
const FIELDS: Field[] = [
  { k: 'pre', n: 'Preamble', b: '7 B', w: 78, c: 'var(--muted)', l1: true, d: <>7 octeți <code>10101010</code> repetați. Nu conțin date: sincronizează ceasul receptorului cu cel al emițătorului (îi spun „urmează un cadru”). Aparțin nivelului fizic, nu se numără în dimensiunea cadrului și nu sunt acoperiți de FCS.</> },
  { k: 'sfd', n: 'SFD', b: '1 B', w: 46, c: 'var(--muted)', l1: true, d: <><b>Start Frame Delimiter</b> = <code>10101011</code>. Ultimii doi biți „11” anunță: „de la bitul următor începe adresa destinație”.</> },
  { k: 'dst', n: 'Destination MAC', b: '6 B', w: 104, c: 'var(--accent)', d: <>Cui îi este destinat cadrul. Este <b>primul câmp</b> după SFD — de aceea un switch cut-through poate lua decizia după doar 6 octeți. Poate fi unicast, multicast sau broadcast (<code>ffff.ffff.ffff</code>). Switch-ul îl folosește ca să <b>decidă unde trimite</b> cadrul (forward / flood / filter).</> },
  { k: 'src', n: 'Source MAC', b: '6 B', w: 104, c: 'var(--ok)', d: <>Cine a trimis cadrul. Este <b>întotdeauna unicast</b> (bitul I/G = 0). Switch-ul îl folosește ca să <b>învețe</b>: „MAC-ul acesta se află în spatele portului pe care a intrat cadrul”.</> },
  { k: 'tag', n: '802.1Q', b: '4 B', w: 70, c: 'var(--violet)', d: <>Opțional — apare doar pe legăturile <b>trunk</b>. TPID <code>0x8100</code> (stă exact unde ar fi stat EtherType-ul) + 3 biți PCP (prioritate), 1 bit DEI, 12 biți VLAN ID. Cadrul maxim crește de la 1518 la 1522 de octeți. Detalii în topicul 2.2.</> },
  { k: 'type', n: 'EtherType', b: '2 B', w: 70, c: 'var(--info)', d: <>Spune <b>ce protocol</b> e în interior: <code>0x0800</code> IPv4, <code>0x86DD</code> IPv6, <code>0x0806</code> ARP. Valorile ≥ 1536 (<code>0x0600</code>) sunt EtherType (Ethernet II); valorile ≤ 1500 înseamnă „lungime” (formatul vechi IEEE 802.3 cu LLC).</> },
  { k: 'data', n: 'Payload (date)', b: '46–1500 B', w: 150, c: 'var(--text-2)', d: <>Pachetul de nivel 3 (de obicei IPv4/IPv6). Maximum <b>1500 de octeți</b> (MTU-ul Ethernet standard). Minimum 46: dacă datele sunt mai puține, se adaugă <b>padding</b> (zerouri) ca întregul cadru să aibă cel puțin 64 de octeți.</> },
  { k: 'fcs', n: 'FCS', b: '4 B', w: 60, c: 'var(--warn)', d: <><b>Frame Check Sequence</b> — un CRC-32 calculat de emițător peste adrese, tip, date și padding. Receptorul îl recalculează; dacă nu se potrivește, cadrul e corupt și e <b>aruncat</b> (contorul „CRC” din <code>show interfaces</code> crește). Ethernet nu retransmite — de asta se ocupă TCP, mai sus.</> },
];
export function EthernetFrame() {
  const [sel, setSel] = useState('dst');
  const [tag, setTag] = useState(false);
  const fields = FIELDS.filter((f) => tag || f.k !== 'tag');
  const total = fields.reduce((s, f) => s + f.w, 0);
  let x = (720 - total) / 2;
  const placed = fields.map((f) => { const r = { ...f, x }; x += f.w; return r; });
  const cur = FIELDS.find((f) => f.k === sel) ?? FIELDS[2];
  const first = placed.find((f) => f.k === 'dst')!; const last = placed[placed.length - 1];
  const pre = placed[0]; const sfd = placed[1];
  return (
    <>
      <svg viewBox="0 0 720 190" role="img" aria-label="Structura cadrului Ethernet">
        <path d={`M${pre.x + 2} 40 v-8 h${sfd.x + sfd.w - pre.x - 4} v8`} fill="none" stroke="var(--muted)" />
        <T x={(pre.x + sfd.x + sfd.w) / 2} y={24} size={10.5} color="var(--muted)">nivel 1 (nu intră în cadru)</T>
        <path d={`M${first.x + 2} 40 v-8 h${last.x + last.w - first.x - 4} v8`} fill="none" stroke="var(--accent)" />
        <T x={(first.x + last.x + last.w) / 2} y={24} size={11} color="var(--accent)" weight={650}>{`cadrul Ethernet: 64 – ${tag ? '1522' : '1518'} octeți`}</T>
        {placed.map((f) => {
          const on = f.k === sel;
          return (
            <g key={f.k} role="button" tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => setSel(f.k)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(f.k); } }}>
              <rect x={f.x + 1} y={46} width={f.w - 2} height={64} rx={7} fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={f.c} strokeWidth={on ? 2.6 : 1.3} strokeDasharray={f.l1 ? '4 3' : undefined} />
              <T x={f.x + f.w / 2} y={74} size={f.w < 60 ? 10 : 11} weight={650} color={f.c}>{f.n}</T>
              <T x={f.x + f.w / 2} y={94} size={10.5} color="var(--muted)">{f.b}</T>
            </g>
          );
        })}
        {(() => { const src = placed.find((f) => f.k === 'src')!; const ty = placed.find((f) => f.k === 'type')!; return (
          <g>
            <path d={`M${first.x + 2} 118 v8 h${ty.x + ty.w - first.x - 4} v-8`} fill="none" stroke="var(--info)" />
            <T x={(first.x + ty.x + ty.w) / 2} y={142} size={10.5} color="var(--info)">{`header: ${tag ? 18 : 14} octeți`}</T>
            <T x={src.x} y={170} size={10.5} color="var(--muted)" anchor="middle">click pe un câmp pentru detalii</T>
          </g>
        ); })()}
      </svg>
      <div className="callout tip" style={{ marginTop: 8, minHeight: 72 }}>
        <div><b>{cur.n} · {cur.b}</b><div className="small">{cur.d}</div></div>
      </div>
      <div className="controls">
        <label className="check"><input type="checkbox" checked={tag} onChange={(e) => setTag(e.target.checked)} />arată tag-ul 802.1Q (cadru pe trunk)</label>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   3) Decodor de adresă MAC: OUI, I/G, U/L
---------------------------------------------------------------- */
const MAC_EX: [string, string][] = [
  ['0000.0c12.3456', 'Cisco (OUI 00-00-0C)'],
  ['ffff.ffff.ffff', 'broadcast'],
  ['0100.5e00.00fb', 'multicast IPv4 (mDNS)'],
  ['3333.0000.0001', 'multicast IPv6'],
  ['0180.c200.0000', 'STP BPDU'],
  ['da7f.3c11.2a90', 'MAC „privat” de telefon'],
];
export function MacDecoder() {
  const [raw, setRaw] = useState('0000.0c12.3456');
  const hex = raw.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  const ok = hex.length === 12 && raw.replace(/[\s.:-]/g, '').length === 12;
  const o = ok ? hex.match(/../g)! : [];
  const b0 = ok ? parseInt(o[0], 16) : 0;
  const ig = b0 & 1; const ul = (b0 >> 1) & 1;
  const bcast = ok && hex === 'ffffffffffff';
  const kind = !ok ? '' : bcast ? 'broadcast (toate stațiile din VLAN)' : ig ? 'multicast (un grup de stații)' : 'unicast (o singură interfață)';
  const adm = !ok ? '' : ul ? 'administrată local (setată de software/OS, nu de producător)' : 'universală (BIA, „arsă” de producător — OUI valid)';
  const bits = b0.toString(2).padStart(8, '0').split('');
  return (
    <>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <input className="input mono" value={raw} onChange={(e) => setRaw(e.target.value)} aria-label="Adresă MAC"
          style={{ flex: '1 1 220px', minWidth: 0, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-strong)', background: 'var(--surface-2)', color: 'var(--text)', fontSize: '0.95rem' }} />
      </div>
      <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {MAC_EX.map(([m, l]) => <button key={m} type="button" className="btn sm" onClick={() => setRaw(m)} title={m}>{l}</button>)}
      </div>
      {!ok ? <div className="callout warn"><div className="small">Introdu 12 cifre hexazecimale (0–9, a–f), cu sau fără separatori: <code>0011.2233.4455</code>, <code>00-11-22-33-44-55</code>, <code>00:11:22:33:44:55</code>.</div></div> : (
        <>
          <svg viewBox="0 0 720 210" role="img" aria-label="Structura adresei MAC">
            {o.map((oc, i) => {
              const x = 60 + i * 102;
              return (
                <g key={i}>
                  <rect x={x} y={20} width={92} height={42} rx={8} fill="var(--surface-3)" stroke={i < 3 ? 'var(--accent)' : 'var(--info)'} strokeWidth={i === 0 ? 2.4 : 1.3} />
                  <T x={x + 46} y={47} size={17} weight={700} m color={i < 3 ? 'var(--accent)' : 'var(--info)'}>{oc.toUpperCase()}</T>
                </g>
              );
            })}
            <path d="M62 70 v8 h302 v-8" fill="none" stroke="var(--accent)" />
            <T x={213} y={94} size={11.5} weight={650} color="var(--accent)">OUI — 24 biți (producătorul)</T>
            <path d="M368 70 v8 h302 v-8" fill="none" stroke="var(--info)" />
            <T x={519} y={94} size={11.5} weight={650} color="var(--info)">24 biți — partea specifică interfeței</T>
            <T x={40} y={130} anchor="start" size={11} color="var(--muted)">primul octet în binar (b7 … b0):</T>
            {bits.map((bt, i) => {
              const x = 250 + i * 40; const isIG = i === 7; const isUL = i === 6;
              const c = isIG ? 'var(--warn)' : isUL ? 'var(--violet)' : 'var(--border-strong)';
              return (
                <g key={i}>
                  <rect x={x} y={112} width={34} height={30} rx={6} fill={isIG || isUL ? 'var(--surface-3)' : 'none'} stroke={c} strokeWidth={isIG || isUL ? 2 : 1} />
                  <T x={x + 17} y={132} size={14} weight={700} m color={isIG ? 'var(--warn)' : isUL ? 'var(--violet)' : 'var(--text-2)'}>{bt}</T>
                </g>
              );
            })}
            <T x={507} y={164} size={11} color="var(--violet)" weight={650}>U/L</T>
            <T x={547} y={164} size={11} color="var(--warn)" weight={650}>I/G</T>
            <T x={360} y={190} size={12} color="var(--text-2)">{`I/G = ${ig} → ${kind}  ·  U/L = ${ul} → ${ul ? 'locală' : 'universală'}`}</T>
          </svg>
          <ul className="small" style={{ marginTop: 6 }}>
            <li><b>Tip:</b> {kind}{bcast && ' — toți biții sunt 1, deci și I/G = 1'}.</li>
            <li><b>Administrare:</b> {adm}{ig === 1 && ' (pentru adrese de grup, bitul U/L contează mai puțin)'}.</li>
            <li><b>Aceeași adresă, 3 notații:</b> Cisco <code>{`${o[0]}${o[1]}.${o[2]}${o[3]}.${o[4]}${o[5]}`}</code> · Windows <code>{o.join('-').toUpperCase()}</code> · Linux/macOS <code>{o.join(':')}</code></li>
            <li className="muted">Truc: dacă a doua cifră hex e <b>impară</b> → multicast/broadcast. Dacă e 2, 6, A sau E → unicast administrat local.</li>
          </ul>
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------------
   4) SIMULATORUL — 5 PC-uri (2 în spatele unui hub), tabela MAC pas cu pas
---------------------------------------------------------------- */
type HostId = 'A' | 'B' | 'C' | 'D' | 'E';
type PortId = 'Fa0/1' | 'Fa0/2' | 'Fa0/3' | 'Fa0/4' | 'Fa0/5';
const PORTS: PortId[] = ['Fa0/1', 'Fa0/2', 'Fa0/3', 'Fa0/4', 'Fa0/5'];
const PORT_X: Record<PortId, number> = { 'Fa0/1': 140, 'Fa0/2': 250, 'Fa0/3': 360, 'Fa0/4': 480, 'Fa0/5': 610 };
const HOSTS: Record<HostId, { mac: string; ip: string }> = {
  A: { mac: '00aa.aaaa.aaaa', ip: '10.0.0.1' }, B: { mac: '00bb.bbbb.bbbb', ip: '10.0.0.2' }, C: { mac: '00cc.cccc.cccc', ip: '10.0.0.3' },
  D: { mac: '00dd.dddd.dddd', ip: '10.0.0.4' }, E: { mac: '00ee.eeee.eeee', ip: '10.0.0.5' },
};
const HIDS: HostId[] = ['A', 'B', 'C', 'D', 'E'];
const BCAST = 'ffff.ffff.ffff'; const MCAST = '0100.5e00.00fb';
type Dst = HostId | 'bcast' | 'mcast';
type Entry = { mac: string; host: HostId; port: PortId; seen: number; stat?: boolean; fresh?: 'new' | 'refresh' | 'move' };
type Result = {
  src: HostId; dst: Dst; ingress: PortId; learn: 'new' | 'refresh' | 'move' | 'static'; prevPort?: PortId;
  decision: 'flood' | 'forward' | 'filter'; egress: PortId[]; why: string; label: string; recv: { h: HostId; accept: boolean }[];
};
type SimState = { now: number; table: Entry[]; hp: Record<HostId, PortId>; res: Result | null; msg: string; idx: number };
type Step =
  | { kind: 'frame'; src: HostId; dst: Dst; label: string; note: string }
  | { kind: 'move'; note: string }
  | { kind: 'wait'; note: string };
const SCRIPT: Step[] = [
  { kind: 'frame', src: 'A', dst: 'B', label: 'A → B (unicast)', note: 'Tabela e goală. PC-A trimite primul cadru către PC-B (în realitate l-ar precede un ARP — vezi pasul 3).' },
  { kind: 'frame', src: 'B', dst: 'A', label: 'B → A (răspuns)', note: 'PC-B răspunde. Acum switch-ul îl învață și pe B.' },
  { kind: 'frame', src: 'C', dst: 'bcast', label: 'C → broadcast (ARP request)', note: 'PC-C întreabă „Cine are 10.0.0.4?” — un ARP request trimis la ffff.ffff.ffff.' },
  { kind: 'frame', src: 'D', dst: 'C', label: 'D → C (ARP reply)', note: 'PC-D răspunde direct (unicast) lui C. D stă în spatele unui hub pe Fa0/4.' },
  { kind: 'frame', src: 'E', dst: 'D', label: 'E → D (ambele în spatele hub-ului)', note: 'PC-E vorbește cu vecinul său de hub. Hub-ul repetă cadrul spre D și spre switch.' },
  { kind: 'frame', src: 'A', dst: 'B', label: 'A → B (din nou)', note: 'Același cadru ca la pasul 1 — dar acum switch-ul știe unde e B.' },
  { kind: 'frame', src: 'A', dst: 'mcast', label: 'A → multicast 0100.5e00.00fb', note: 'PC-A trimite un anunț mDNS (grupul IPv4 224.0.0.251). Grupurile 224.0.0.x sunt inundate chiar și cu IGMP snooping.' },
  { kind: 'move', note: 'Mutăm cablul lui PC-B din Fa0/2 în Fa0/5. Switch-ul nu „vede” mutarea: încă are B pe Fa0/2.' },
  { kind: 'frame', src: 'B', dst: 'A', label: 'B → A (de pe noul port)', note: 'PC-B trimite din nou. Cadrul intră pe Fa0/5 — switch-ul actualizează intrarea (MAC move).' },
  { kind: 'wait', note: 'Trece timpul de aging. A și B vorbesc des (intrările lor se reîmprospătează); C, D și E tac.' },
  { kind: 'frame', src: 'A', dst: 'C', label: 'A → C (după aging)', note: 'PC-A trimite către C, a cărui intrare tocmai a expirat.' },
  { kind: 'frame', src: 'C', dst: 'A', label: 'C → A (răspuns)', note: 'C răspunde și este învățat din nou.' },
];
const dstMac = (d: Dst) => (d === 'bcast' ? BCAST : d === 'mcast' ? MCAST : HOSTS[d].mac);
const dstName = (d: Dst) => (d === 'bcast' ? 'broadcast' : d === 'mcast' ? 'multicast' : `PC-${d}`);
const INIT_HP: Record<HostId, PortId> = { A: 'Fa0/1', B: 'Fa0/2', C: 'Fa0/3', D: 'Fa0/4', E: 'Fa0/4' };
const initState = (): SimState => ({ now: 0, table: [], hp: { ...INIT_HP }, res: null, msg: '', idx: 0 });

function expire(table: Entry[], now: number, aging: number) {
  return table.filter((e) => e.stat || now - e.seen < aging);
}
function sendFrame(s: SimState, src: HostId, dst: Dst, aging: number, label: string): SimState {
  const now = s.now + 5;
  let table: Entry[] = expire(s.table, now, aging).map((e) => ({ ...e, fresh: undefined }));
  const ingress = s.hp[src];
  const mac = HOSTS[src].mac;
  // 1) LEARN pe baza MAC-ului SURSĂ
  let learn: Result['learn'] = 'new'; let prevPort: PortId | undefined;
  const ex = table.find((e) => e.mac === mac);
  if (ex?.stat) learn = 'static';
  else if (ex) {
    const fresh: 'move' | 'refresh' = ex.port !== ingress ? 'move' : 'refresh';
    if (fresh === 'move') prevPort = ex.port;
    learn = fresh;
    table = table.map((e) => (e.mac === mac ? { ...e, port: ingress, seen: now, fresh } : e));
  } else table = [...table, { mac, host: src, port: ingress, seen: now, fresh: 'new' }];
  // 2) FORWARD / FLOOD / FILTER pe baza MAC-ului DESTINAȚIE
  const connected = PORTS.filter((p) => Object.values(s.hp).includes(p));
  let decision: Result['decision']; let egress: PortId[] = []; let why: string;
  if (dst === 'bcast' || dst === 'mcast') {
    decision = 'flood'; egress = connected.filter((p) => p !== ingress);
    why = dst === 'bcast' ? 'Destinația e broadcast (ffff.ffff.ffff) → FLOOD pe toate porturile din VLAN, mai puțin portul de intrare.'
      : 'Destinația e multicast (bitul I/G = 1). Fără informații IGMP snooping pentru acest grup → FLOOD ca un broadcast.';
  } else {
    const hit = table.find((e) => e.mac === HOSTS[dst].mac);
    if (!hit) { decision = 'flood'; egress = connected.filter((p) => p !== ingress); why = `${HOSTS[dst].mac} nu e în tabelă → unknown unicast → FLOOD pe toate porturile din VLAN, mai puțin ${ingress}.`; }
    else if (hit.port === ingress) { decision = 'filter'; why = `${HOSTS[dst].mac} e pe ${hit.port} — același port pe care a intrat cadrul → FILTER (aruncat; destinația l-a primit deja prin hub).`; }
    else { decision = 'forward'; egress = [hit.port]; why = `${HOSTS[dst].mac} e cunoscut pe ${hit.port} → FORWARD doar pe ${hit.port}.`; }
  }
  // cine primește fizic cadrul: gazdele de pe porturile de ieșire + vecinii de hub de pe portul de intrare
  const recvSet = HIDS.filter((h) => h !== src && (egress.includes(s.hp[h]) || s.hp[h] === ingress));
  const recv = recvSet.map((h) => ({ h, accept: dst === 'bcast' || dst === 'mcast' || dst === h }));
  return { ...s, now, table, res: { src, dst, ingress, learn, prevPort, decision, egress, why, label, recv }, msg: '' };
}

export function MacTableSim() {
  const [aging, setAging] = useState(300);
  const [live, setLive] = useState(false);
  const [speed, setSpeed] = useState(10);
  const [staticC, setStaticC] = useState(false);
  const [hist, setHist] = useState<SimState[]>([initState()]);
  const [fSrc, setFSrc] = useState<HostId>('A');
  const [fDst, setFDst] = useState<Dst>('C');
  const s = hist[hist.length - 1];

  const push = (n: SimState) => setHist((h) => [...h, n]);
  const applyStatic = (st: SimState, on: boolean): SimState => {
    const rest = st.table.filter((e) => e.mac !== HOSTS.C.mac);
    return { ...st, table: on ? [...rest, { mac: HOSTS.C.mac, host: 'C', port: 'Fa0/3', seen: st.now, stat: true, fresh: 'new' }] : rest };
  };

  // ceas în timp real (opțional): intrările dinamice expiră sub ochii tăi
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setHist((h) => {
      const cur = h[h.length - 1];
      const now = cur.now + speed;
      const table = expire(cur.table, now, aging);
      const gone = cur.table.length - table.length;
      return [...h.slice(0, -1), { ...cur, now, table, msg: gone ? `${gone} intrare(i) au expirat (aging ${aging} s).` : cur.msg }];
    }), 1000);
    return () => clearInterval(t);
  }, [live, speed, aging]);

  const next = () => {
    const st = SCRIPT[s.idx];
    if (!st) return;
    let n: SimState;
    if (st.kind === 'frame') n = sendFrame(s, st.src, st.dst, aging, st.label);
    else if (st.kind === 'move') n = { ...s, hp: { ...s.hp, B: 'Fa0/5' }, res: null, msg: 'Cablul lui PC-B este acum în Fa0/5. Tabela nu s-a schimbat — switch-ul învață doar din cadrele primite.', table: s.table.map((e) => ({ ...e, fresh: undefined })) };
    else {
      const now = s.now + aging;
      const kept = s.table.map((e) => (e.host === 'A' || e.host === 'B' ? { ...e, seen: now - 2, fresh: 'refresh' as const } : { ...e, fresh: undefined }));
      const table = expire(kept, now, aging);
      const gone = s.table.filter((e) => !table.some((t) => t.mac === e.mac)).map((e) => `PC-${e.host}`);
      n = { ...s, now, table, res: null, msg: `Au trecut ${aging} s. ${gone.length ? `Au expirat: ${gone.join(', ')}.` : 'Nicio intrare dinamică nu a expirat.'} A și B rămân (timerul lor a fost resetat de traficul recent).` };
    }
    push({ ...n, idx: s.idx + 1 });
  };
  const custom = () => {
    if (fDst === fSrc) return;
    push({ ...sendFrame(s, fSrc, fDst, aging, `${fSrc} → ${dstName(fDst)} (cadrul tău)`), idx: s.idx });
  };
  const reset = () => { setLive(false); setHist([applyStatic(initState(), staticC)]); };
  const clearDyn = () => push({ ...s, table: s.table.filter((e) => e.stat), res: null, msg: 'clear mac address-table dynamic — intrările dinamice au fost șterse; cele statice rămân.' });
  const toggleStatic = (on: boolean) => { setStaticC(on); push({ ...applyStatic(s, on), res: null, msg: on ? 'mac address-table static 00cc.cccc.cccc vlan 1 interface Fa0/3 — intrare STATIC, nu expiră niciodată.' : 'Intrarea statică pentru C a fost ștearsă.' }); };

  const r = s.res;
  const cur = SCRIPT[s.idx - 1];
  const hostPos = (h: HostId): [number, number] => {
    if (h === 'D') return [430, 252]; if (h === 'E') return [532, 252];
    return [PORT_X[s.hp[h]], 214];
  };
  const linkColor = (p: PortId) => {
    if (!r) return { c: 'var(--text-2)', flow: false };
    if (p === r.ingress) return { c: 'var(--accent)', flow: true };
    if (r.egress.includes(p)) return { c: r.decision === 'forward' ? 'var(--ok)' : 'var(--warn)', flow: true };
    return { c: 'var(--border-strong)', flow: false };
  };
  const hubLink = (h: 'D' | 'E') => {
    if (!r || s.hp[h] !== 'Fa0/4') return { c: 'var(--text-2)', flow: false };
    if (r.src === h) return { c: 'var(--accent)', flow: true };
    if (r.recv.some((x) => x.h === h)) return { c: r.ingress === 'Fa0/4' ? 'var(--muted)' : r.decision === 'forward' ? 'var(--ok)' : 'var(--warn)', flow: true };
    return { c: 'var(--border-strong)', flow: false };
  };
  const decColor = r ? (r.decision === 'forward' ? 'var(--ok)' : r.decision === 'flood' ? 'var(--warn)' : 'var(--bad)') : 'var(--muted)';
  const sorted = useMemo(() => [...s.table].sort((a, b) => a.mac.localeCompare(b.mac)), [s.table]);
  const occupied = new Set(Object.values(s.hp));

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 420px', minWidth: 0 }}>
          <svg viewBox="0 0 720 300" role="img" aria-label="Simulator: switch cu tabelă MAC">
            <rect x={90} y={26} width={570} height={64} rx={10} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.8} />
            <T x={108} y={50} anchor="start" weight={700} color="var(--info)">SW1</T>
            <T x={108} y={68} anchor="start" size={10.5} color="var(--muted)">VLAN 1</T>
            {r && (
              <g className="fade-up">
                <rect x={250} y={36} width={300} height={24} rx={7} fill="var(--surface)" stroke={decColor} />
                <T x={400} y={53} size={12} weight={700} color={decColor}>{r.decision.toUpperCase()}{r.decision === 'flood' && r.dst !== 'bcast' && r.dst !== 'mcast' ? ' (unknown unicast)' : ''}</T>
              </g>
            )}
            {PORTS.map((p) => {
              const x = PORT_X[p]; const lc = linkColor(p); const used = occupied.has(p);
              const filt = r?.decision === 'filter' && r.ingress === p;
              return (
                <g key={p}>
                  <rect x={x - 14} y={80} width={28} height={14} rx={3} fill={used ? 'var(--surface)' : 'var(--surface-2)'} stroke={r && (p === r.ingress || r.egress.includes(p)) ? lc.c : 'var(--border-strong)'} strokeWidth={1.4} />
                  <T x={x} y={110} size={10} color="var(--muted)" m>{p}</T>
                  {filt && <g><line x1={x - 9} y1={64} x2={x + 9} y2={78} stroke="var(--bad)" strokeWidth={3} /><line x1={x + 9} y1={64} x2={x - 9} y2={78} stroke="var(--bad)" strokeWidth={3} /></g>}
                  {used && p !== 'Fa0/4' && <Line x1={x} y1={116} x2={x} y2={196} c={lc.c} w={lc.flow ? 3 : 2} flow={lc.flow} />}
                  {used && p === 'Fa0/4' && <Line x1={x} y1={116} x2={x} y2={168} c={lc.c} w={lc.flow ? 3 : 2} flow={lc.flow} />}
                  {!used && <T x={x} y={140} size={10} color="var(--muted)">liber</T>}
                </g>
              );
            })}
            <HubIcon x={480} y={180} />
            {(['D', 'E'] as const).map((h) => { const hl = hubLink(h); const [hx, hy] = hostPos(h); return <Line key={h} x1={h === 'D' ? 466 : 494} y1={191} x2={hx} y2={hy - 16} c={hl.c} w={hl.flow ? 3 : 2} flow={hl.flow} />; })}
            {HIDS.map((h) => {
              const [x, y] = hostPos(h);
              const rc = r?.recv.find((v) => v.h === h);
              const isSrc = r?.src === h;
              return (
                <g key={h}>
                  <ClientIcon x={x} y={y} kind="pc" />
                  <T x={x} y={y + 26} size={11.5} weight={700} color={isSrc ? 'var(--accent)' : 'var(--text)'}>{`PC-${h}`}</T>
                  <T x={x} y={y + 40} size={9.5} m color="var(--muted)">{HOSTS[h].mac}</T>
                  {isSrc && <T x={x + 22} y={y - 14} size={10} anchor="start" weight={700} color="var(--accent)">TX</T>}
                  {rc && <T x={x + 22} y={y - 14} size={10} anchor="start" weight={700} color={rc.accept ? 'var(--ok)' : 'var(--muted)'}>{rc.accept ? '✓ primește' : '✗ ignoră'}</T>}
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <div className="row between" style={{ marginBottom: 6, gap: 8, flexWrap: 'wrap' }}>
            <b className="small">show mac address-table</b>
            <span className="badge info mono">t = {s.now} s</span>
          </div>
          <div className="table-wrap">
            <table className="t mono" style={{ fontSize: '0.8rem' }}>
              <thead><tr><th>Vlan</th><th>Mac Address</th><th>Type</th><th>Port</th><th>expiră</th></tr></thead>
              <tbody>
                {sorted.length === 0 && <tr><td colSpan={5} className="muted" style={{ textAlign: 'center' }}>(tabela e goală)</td></tr>}
                {sorted.map((e) => {
                  const hitDst = r && r.dst !== 'bcast' && r.dst !== 'mcast' && HOSTS[r.dst].mac === e.mac;
                  const bg = e.fresh === 'move' ? 'var(--warn-soft)' : e.fresh ? 'var(--accent-soft)' : hitDst ? 'var(--ok-soft)' : undefined;
                  return (
                    <tr key={e.mac} style={{ background: bg, transition: 'background .3s' }}>
                      <td>1</td><td>{e.mac}</td><td>{e.stat ? 'STATIC' : 'DYNAMIC'}</td><td>{e.port}</td>
                      <td>{e.stat ? '—' : `${Math.max(0, aging - (s.now - e.seen))} s`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="small muted" style={{ marginTop: 6 }}>
            <span style={{ background: 'var(--accent-soft)', padding: '0 5px', borderRadius: 4 }}>învățat / reîmprospătat</span>{' '}
            <span style={{ background: 'var(--ok-soft)', padding: '0 5px', borderRadius: 4 }}>găsit (destinație)</span>{' '}
            <span style={{ background: 'var(--warn-soft)', padding: '0 5px', borderRadius: 4 }}>MAC move</span>
          </div>
        </div>
      </div>

      <div className="callout tip" style={{ marginTop: 10, minHeight: 92 }}>
        <div style={{ minWidth: 0 }}>
          {!r && !s.msg && s.idx === 0 && <><b>Apasă „Cadrul următor”.</b><div className="small">Scenariul are {SCRIPT.length} pași: învățare, flooding, forwarding, filtering, multicast, MAC move și aging. Poți trimite oricând și propriile cadre (mai jos).</div></>}
          {cur && <div className="small muted">Pasul {s.idx}/{SCRIPT.length}: {cur.note}</div>}
          {r && (
            <>
              <b>{r.label}</b> <span className="small muted mono">· SRC {HOSTS[r.src].mac} → DST {dstMac(r.dst)} · intrare pe {r.ingress}</span>
              <div className="small" style={{ marginTop: 4 }}>
                <b>1. Learn (MAC sursă):</b>{' '}
                {r.learn === 'new' && <>{HOSTS[r.src].mac} nu era în tabelă → intrare nouă pe {r.ingress} (timer {aging} s).</>}
                {r.learn === 'refresh' && <>{HOSTS[r.src].mac} era deja pe {r.ingress} → doar se resetează timerul de aging.</>}
                {r.learn === 'move' && <>{HOSTS[r.src].mac} era pe {r.prevPort}, dar a intrat pe {r.ingress} → intrarea se mută (MAC move).</>}
                {r.learn === 'static' && <>{HOSTS[r.src].mac} are intrare STATIC → nu se învață și nu se mută nimic.</>}
              </div>
              <div className="small"><b>2. Decizie (MAC destinație):</b> {r.why}</div>
              {r.recv.length > 0 && <div className="small muted">Primesc fizic cadrul: {r.recv.map((x) => `PC-${x.h} (${x.accept ? 'îl procesează' : 'MAC-ul destinație nu e al lui → îl ignoră'})`).join(', ')}.</div>}
            </>
          )}
          {s.msg && <div className="small" style={{ marginTop: 4 }}>{s.msg}</div>}
        </div>
      </div>

      <div className="controls">
        <button className="btn sm" type="button" onClick={() => setHist((h) => (h.length > 1 ? h.slice(0, -1) : h))} disabled={hist.length <= 1}>← Înapoi</button>
        <button className="btn sm primary" type="button" onClick={next} disabled={s.idx >= SCRIPT.length}>Cadrul următor →</button>
        <button className="btn sm" type="button" onClick={reset}>↺ De la capăt</button>
        <button className="btn sm" type="button" onClick={clearDyn}>clear mac address-table dynamic</button>
        <span className="small muted">Pas {s.idx}/{SCRIPT.length}</span>
      </div>
      <div className="controls">
        <span className="small">Cadrul tău:</span>
        <select className="btn sm" value={fSrc} onChange={(e) => setFSrc(e.target.value as HostId)} aria-label="Sursă">
          {HIDS.map((h) => <option key={h} value={h}>de la PC-{h}</option>)}
        </select>
        <select className="btn sm" value={fDst} onChange={(e) => setFDst(e.target.value as Dst)} aria-label="Destinație">
          {HIDS.map((h) => <option key={h} value={h}>către PC-{h}</option>)}
          <option value="bcast">către broadcast</option>
          <option value="mcast">către multicast</option>
        </select>
        <button className="btn sm" type="button" onClick={custom} disabled={fDst === fSrc}>Trimite</button>
      </div>
      <div className="controls">
        <label className="small">Aging time:{' '}
          <select className="btn sm" value={aging} onChange={(e) => setAging(Number(e.target.value))}>
            <option value={300}>300 s (implicit Cisco)</option><option value={60}>60 s</option><option value={30}>30 s (demo)</option>
          </select>
        </label>
        <label className="check"><input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />ceas în timp real</label>
        {live && <select className="btn sm" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="Viteză ceas">
          <option value={1}>×1</option><option value={10}>×10</option><option value={30}>×30</option></select>}
        <label className="check"><input type="checkbox" checked={staticC} onChange={(e) => toggleStatic(e.target.checked)} />intrare statică pentru PC-C</label>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   5) Logica de decizie a switch-ului (flowchart)
---------------------------------------------------------------- */
export function ForwardingFlow() {
  const Box = ({ x, y, w, h = 40, c, children, q }: { x: number; y: number; w: number; h?: number; c: string; children: ReactNode; q?: boolean }) => (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={q ? 20 : 9} fill="var(--surface-3)" stroke={c} strokeWidth={1.6} />
      <T x={x} y={y + 4} size={11.5} weight={600} color={c === 'var(--border-strong)' ? 'var(--text)' : c}>{children}</T>
    </g>
  );
  const A = ({ d, c = 'var(--text-2)' }: { d: string; c?: string }) => <path d={d} fill="none" stroke={c} strokeWidth={1.6} markerEnd="url(#ffA)" />;
  return (
    <svg viewBox="0 0 720 420" role="img" aria-label="Decizia switch-ului: learn, apoi flood, forward sau filter">
      <defs><marker id="ffA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--text-2)" /></marker></defs>
      <Box x={300} y={30} w={330} c="var(--border-strong)">Cadru intră pe portul X (VLAN v), FCS corect</Box>
      <A d="M300 50 v22" />
      <Box x={300} y={96} w={420} c="var(--accent)">LEARN: (MAC sursă, port X, VLAN v) → tabelă · reset timer</Box>
      <A d="M300 116 v24" />
      <Box x={300} y={164} w={330} c="var(--info)" q>MAC destinație = broadcast sau multicast?</Box>
      <A d="M465 164 h70" /><T x={500} y={156} size={10.5} color="var(--muted)">da</T>
      <A d="M300 184 v26" /><T x={312} y={202} size={10.5} anchor="start" color="var(--muted)">nu</T>
      <Box x={300} y={234} w={330} c="var(--info)" q>MAC destinație e în tabelă (VLAN v)?</Box>
      <A d="M465 234 h40 v-48 h30" /><T x={482} y={226} size={10.5} color="var(--muted)">nu</T>
      <A d="M300 254 v26" /><T x={312} y={272} size={10.5} anchor="start" color="var(--muted)">da</T>
      <Box x={300} y={304} w={330} c="var(--info)" q>Portul din tabelă = portul X?</Box>
      <A d="M135 304 h-30 v52" /><T x={120} y={296} size={10.5} color="var(--muted)">da</T>
      <A d="M300 324 v32" /><T x={312} y={344} size={10.5} anchor="start" color="var(--muted)">nu</T>
      <Box x={620} y={172} w={160} h={60} c="var(--warn)">FLOOD</Box>
      <T x={620} y={214} size={10} color="var(--muted)">toate porturile din VLAN v</T>
      <T x={620} y={228} size={10} color="var(--muted)">mai puțin portul X</T>
      <Box x={105} y={378} w={150} c="var(--bad)">FILTER (drop)</Box>
      <Box x={300} y={378} w={230} c="var(--ok)">FORWARD pe acel port</Box>
      <T x={560} y={330} size={10.5} color="var(--muted)" anchor="middle">Ordinea e mereu: întâi învață</T>
      <T x={560} y={346} size={10.5} color="var(--muted)" anchor="middle">din sursă, apoi decide după</T>
      <T x={560} y={362} size={10.5} color="var(--muted)" anchor="middle">destinație.</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   6) Metode de switching: store-and-forward / cut-through / fragment-free
---------------------------------------------------------------- */
export function SwitchingMethods() {
  const [m, setM] = useState<'sf' | 'ct' | 'ff'>('sf');
  const [size, setSize] = useState(1518);
  const [rate, setRate] = useState(1e9);
  const read = m === 'ct' ? 6 : m === 'ff' ? 64 : size; // octeți citiți înainte de a începe forwardarea (de la MAC destinație)
  const us = (read * 8) / rate * 1e6;
  const fmt = us < 1 ? `${(us * 1000).toFixed(0)} ns` : `${us.toFixed(us < 10 ? 2 : 1)} µs`;
  const x0 = 40, W = 640;
  const px = (b: number) => x0 + (b / size) * W;
  const meta = {
    sf: { n: 'Store-and-forward', c: 'var(--ok)', t: 'Primește tot cadrul, verifică FCS-ul (CRC-32) și abia apoi îl trimite. Cadrele corupte sunt aruncate. Latența depinde de mărimea cadrului. Este metoda folosită de majoritatea switch-urilor Catalyst de campus și singura care permite conversia între viteze diferite (de ex. 1 Gbps → 10 Gbps) fără probleme.' },
    ct: { n: 'Cut-through', c: 'var(--warn)', t: 'Începe să trimită cadrul imediat ce a citit MAC-ul destinație (primii 6 octeți după SFD). Latență minimă și constantă, dar FCS-ul ajunge abia la final, când cadrul e deja pe drum — cadrele corupte sunt propagate (receptorul le va arunca). Folosit în data center-e cu cerințe de latență foarte mică.' },
    ff: { n: 'Fragment-free', c: 'var(--info)', t: 'Compromis istoric: așteaptă primii 64 de octeți (fereastra în care pot apărea coliziunile pe un segment half-duplex). Astfel filtrează runts — fragmentele de coliziune — dar nu și erorile de după octetul 64. Relevant mai ales în era hub-urilor; rar azi.' },
  }[m];
  const fields: [number, number, string, string][] = [[0, 6, 'DST', 'var(--accent)'], [6, 12, 'SRC', 'var(--ok)'], [12, 14, 'T', 'var(--info)'], [14, size - 4, 'payload', 'var(--surface-3)'], [size - 4, size, 'FCS', 'var(--warn)']];
  return (
    <>
      <Seg label="Metodă" value={m} set={setM} items={[['sf', 'Store-and-forward'], ['ct', 'Cut-through'], ['ff', 'Fragment-free']]} />
      <svg viewBox="0 0 720 170" role="img" aria-label={`${meta.n}: forwardarea începe după ${read} octeți`}>
        {fields.map(([a, b, l, c]) => (
          <g key={l}>
            <rect x={px(a)} y={50} width={Math.max(1.5, px(b) - px(a))} height={40} fill={l === 'payload' ? c : 'var(--surface-3)'} stroke={c} strokeWidth={1.2} />
            {px(b) - px(a) > 28 && <T x={(px(a) + px(b)) / 2} y={75} size={10.5} color={l === 'payload' ? 'var(--muted)' : c} weight={650}>{l}</T>}
          </g>
        ))}
        <rect x={x0} y={50} width={Math.max(2, px(read) - x0)} height={40} fill={meta.c} fillOpacity={0.22} />
        <line x1={px(read)} x2={px(read)} y1={30} y2={110} stroke={meta.c} strokeWidth={2.5} />
        <T x={Math.min(Math.max(px(read), 120), 600)} y={24} size={11.5} weight={700} color={meta.c}>{`începe forwardarea după ${read} B`}</T>
        <T x={x0} y={108} size={10} anchor="start" color="var(--muted)">0 B (după SFD)</T>
        <T x={x0 + W} y={108} size={10} anchor="end" color="var(--muted)">{`${size} B`}</T>
        {size > 120 && <><line x1={px(64)} x2={px(64)} y1={92} y2={100} stroke="var(--info)" /><T x={px(64) + 4} y={122} size={9.5} anchor="start" color="var(--info)">64 B</T></>}
        <T x={360} y={148} size={12.5} weight={650}>{`Latența proprie a switch-ului (doar citirea): ${fmt} la ${rate >= 1e10 ? '10 Gbps' : rate >= 1e9 ? '1 Gbps' : '100 Mbps'}`}</T>
        <T x={360} y={166} size={11} color="var(--muted)">{m === 'sf' ? 'verifică FCS: DA — cadrele corupte nu trec' : m === 'ff' ? 'verifică FCS: NU (elimină doar fragmentele < 64 B)' : 'verifică FCS: NU — erorile se propagă'}</T>
      </svg>
      <div className="controls">
        <label className="small">Mărime cadru: <b className="mono">{size} B</b>{' '}
          <input type="range" min={64} max={1518} step={2} value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label="Mărime cadru" /></label>
        <select className="btn sm" value={rate} onChange={(e) => setRate(Number(e.target.value))} aria-label="Viteză legătură">
          <option value={1e8}>100 Mbps</option><option value={1e9}>1 Gbps</option><option value={1e10}>10 Gbps</option>
        </select>
      </div>
      <div className="callout tip" style={{ marginTop: 8 }}><div><b>{meta.n}</b><div className="small">{meta.t}</div></div></div>
    </>
  );
}

/* ---------------------------------------------------------------
   7) Cele trei cazuri de flooding (comparație)
---------------------------------------------------------------- */
export function FloodCases() {
  const [v, setV] = useState<'uu' | 'bc' | 'mc' | 'snoop'>('uu');
  const hosts = [{ n: 'A', x: 120 }, { n: 'B', x: 280 }, { n: 'C', x: 440 }, { n: 'D', x: 600 }];
  const gets: Record<string, string[]> = { uu: ['B', 'C', 'D'], bc: ['B', 'C', 'D'], mc: ['B', 'C', 'D'], snoop: ['C'] };
  const acc: Record<string, string[]> = { uu: ['D'], bc: ['B', 'C', 'D'], mc: ['C'], snoop: ['C'] };
  const txt = {
    uu: { d: 'DST 00dd.dddd.dddd (necunoscut)', t: 'Unknown unicast: destinația nu e (încă) în tabelă. Switch-ul nu aruncă cadrul — îl trimite pe toate porturile VLAN-ului, mai puțin cel de intrare. Doar D îl acceptă; B și C îl ignoră. Când D răspunde, switch-ul îl învață și următoarele cadre merg doar spre D.' },
    bc: { d: 'DST ffff.ffff.ffff', t: 'Broadcast: e destinat tuturor (ARP request, DHCP Discover). Se inundă întotdeauna, oricât de plină ar fi tabela. Toți îl procesează. Granița lui = VLAN-ul (domeniul de broadcast); un router nu-l trece mai departe.' },
    mc: { d: 'DST 0100.5e01.0101 (grup 239.1.1.1)', t: 'Multicast fără IGMP snooping: switch-ul nu știe cine vrea grupul, deci îl tratează ca pe un broadcast. Doar C (abonat) îl procesează; restul îl primesc degeaba.' },
    snoop: { d: 'DST 0100.5e01.0101 + IGMP snooping', t: 'Cu IGMP snooping (activ implicit pe switch-urile Catalyst), switch-ul „ascultă” mesajele IGMP Join și trimite grupul doar pe porturile interesate (și spre router-ul multicast). Excepție: grupurile 224.0.0.x (link-local) sunt inundate oricum.' },
  }[v];
  return (
    <>
      <Seg label="Tip de cadru" value={v} set={setV} items={[['uu', 'Unknown unicast'], ['bc', 'Broadcast'], ['mc', 'Multicast'], ['snoop', 'Multicast + IGMP snooping']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Cazuri de flooding">
        <SwitchIcon x={360} y={50} label="" />
        <T x={360} y={24} size={11.5} weight={650} color="var(--text-2)" m>{txt.d}</T>
        {hosts.map((h) => {
          const src = h.n === 'A'; const g = gets[v].includes(h.n); const a = acc[v].includes(h.n);
          const c = src ? 'var(--accent)' : g ? 'var(--warn)' : 'var(--border-strong)';
          return (
            <g key={h.n}>
              <Line x1={360 + (h.x - 360) * 0.08} y1={62} x2={h.x} y2={150} c={c} w={src || g ? 3 : 2} flow={src || g} dash={!src && !g ? '4 4' : undefined} />
              <ClientIcon x={h.x} y={162} kind="pc" />
              <T x={h.x} y={190} weight={700}>{`PC-${h.n}`}</T>
              <T x={h.x} y={207} size={10.5} color={src ? 'var(--accent)' : a ? 'var(--ok)' : g ? 'var(--muted)' : 'var(--muted)'}>
                {src ? 'emițător' : a ? '✓ procesează' : g ? '✗ primește, ignoră' : 'nu primește nimic'}
              </T>
              {h.n === 'C' && (v === 'mc' || v === 'snoop') && <T x={h.x} y={222} size={9.5} color="var(--violet)">abonat la 239.1.1.1</T>}
            </g>
          );
        })}
      </svg>
      <div className="callout tip" style={{ marginTop: 8 }}><div className="small">{txt.t}</div></div>
    </>
  );
}

/* ---------------------------------------------------------------
   8) Două switch-uri: mai multe MAC-uri pe același port (uplink)
---------------------------------------------------------------- */
export function TwoSwitches({ lab = false }: { lab?: boolean }) {
  const rowsL = [['00aa.aaaa.aaaa', 'Fa0/1'], ['00bb.bbbb.bbbb', 'Fa0/2'], ['00cc.cccc.cccc', 'Gi0/1'], ['00dd.dddd.dddd', 'Gi0/1']];
  const rowsR = [['00aa.aaaa.aaaa', 'Gi0/1'], ['00bb.bbbb.bbbb', 'Gi0/1'], ['00cc.cccc.cccc', 'Fa0/1'], ['00dd.dddd.dddd', 'Fa0/2']];
  const Tab = ({ x, rows, title }: { x: number; rows: string[][]; title: string }) => (
    <g>
      <rect x={x} y={150} width={250} height={112} rx={9} fill="var(--code-bg)" stroke="var(--border)" />
      <T x={x + 12} y={170} anchor="start" size={11} weight={700} color="var(--text-2)">{title}</T>
      {rows.map(([mac, p], i) => (
        <g key={mac}>
          <T x={x + 12} y={192 + i * 18} anchor="start" size={11} m color={p.startsWith('Gi') ? 'var(--warn)' : 'var(--text)'}>{mac}</T>
          <T x={x + 238} y={192 + i * 18} anchor="end" size={11} m color={p.startsWith('Gi') ? 'var(--warn)' : 'var(--text)'}>{p}</T>
        </g>
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 720 275" role="img" aria-label="Două switch-uri legate: MAC-urile de pe celălalt switch apar pe portul de uplink">
      <SwitchIcon x={230} y={40} label="" /><SwitchIcon x={490} y={40} label="" />
      <T x={230} y={18} weight={700}>SW1</T><T x={490} y={18} weight={700}>SW2</T>
      <Line x1={262} y1={40} x2={458} y2={40} c="var(--warn)" w={3} />
      <T x={360} y={32} size={10.5} color="var(--warn)" m>Gi0/1 ⟷ Gi0/1</T>
      <Line x1={210} y1={52} x2={110} y2={100} /><Line x1={250} y1={52} x2={330} y2={100} />
      <Line x1={470} y1={52} x2={390} y2={100} /><Line x1={510} y1={52} x2={610} y2={100} />
      <ClientIcon x={100} y={110} kind="pc" label={lab ? 'PC0 · Fa0/1' : 'A · Fa0/1'} /><ClientIcon x={330} y={110} kind="pc" label={lab ? 'PC1 · Fa0/2' : 'B · Fa0/2'} />
      <ClientIcon x={390} y={110} kind="pc" label={lab ? 'PC4 · Fa0/1' : 'C · Fa0/1'} /><ClientIcon x={620} y={110} kind="pc" label={lab ? 'PC5 · Fa0/2' : 'D · Fa0/2'} />
      <Tab x={40} rows={rowsL} title="SW1 — tabela MAC" />
      <Tab x={430} rows={rowsR} title="SW2 — tabela MAC" />
      <T x={360} y={210} size={10.5} color="var(--warn)">mai multe MAC-uri</T>
      <T x={360} y={224} size={10.5} color="var(--warn)">pe același port =</T>
      <T x={360} y={238} size={10.5} color="var(--warn)">alt switch în spate</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   9) Topologii laborator
---------------------------------------------------------------- */
export function LabGuidedTopology113() {
  const pcs = [{ n: 'PC0', p: 'Fa0/1', ip: '.1', x: 90 }, { n: 'PC1', p: 'Fa0/2', ip: '.2', x: 210 }, { n: 'PC2', p: 'Fa0/3', ip: '.3', x: 330 }, { n: 'PC3', p: 'Fa0/4', ip: '.4', x: 450 }];
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Topologie lab ghidat 1.13">
      <SwitchIcon x={270} y={50} label="" />
      <T x={270} y={24} weight={700}>SW1 (2960)</T>
      {pcs.map((p) => (
        <g key={p.n}>
          <Line x1={270 + (p.x - 270) * 0.1} y1={62} x2={p.x} y2={150} />
          <T x={(270 + p.x) / 2 + (p.x < 270 ? -14 : 14)} y={110} size={10} m color="var(--muted)">{p.p}</T>
          <ClientIcon x={p.x} y={162} kind="pc" />
          <T x={p.x} y={190} weight={650}>{p.n}</T>
          <T x={p.x} y={205} size={10.5} m color="var(--muted)">{`192.168.1${p.ip}`}</T>
        </g>
      ))}
      <g opacity={0.85}>
        <Line x1={302} y1={50} x2={548} y2={50} c="var(--warn)" dash="6 4" />
        <T x={425} y={42} size={10} m color="var(--warn)">Gi0/1 ⟷ Gi0/1 (partea 2)</T>
        <SwitchIcon x={580} y={50} label="" />
        <T x={580} y={24} weight={700}>SW2 (2960)</T>
        <Line x1={566} y1={62} x2={560} y2={150} dash="6 4" /><Line x1={596} y1={62} x2={660} y2={150} dash="6 4" />
        <ClientIcon x={560} y={162} kind="pc" /><ClientIcon x={660} y={162} kind="pc" />
        <T x={560} y={190} weight={650}>PC4</T><T x={660} y={190} weight={650}>PC5</T>
        <T x={560} y={205} size={10.5} m color="var(--muted)">192.168.1.5</T><T x={660} y={205} size={10.5} m color="var(--muted)">.6</T>
      </g>
      <T x={360} y={248} size={11} color="var(--muted)">Toate în VLAN 1, rețeaua 192.168.1.0/24 · fără router (un singur domeniu de broadcast)</T>
    </svg>
  );
}
export function LabSoloTopology113() {
  return (
    <svg viewBox="0 0 720 270" role="img" aria-label="Topologie lab solo 1.13">
      {[{ x: 130, n: 'SW-A' }, { x: 360, n: 'SW-B' }, { x: 590, n: 'SW-C' }].map((s) => (
        <g key={s.n}><SwitchIcon x={s.x} y={50} label="" /><T x={s.x} y={24} weight={700}>{s.n}</T></g>
      ))}
      <Line x1={162} y1={50} x2={328} y2={50} c="var(--warn)" w={2.5} /><Line x1={392} y1={50} x2={558} y2={50} c="var(--warn)" w={2.5} />
      <T x={245} y={42} size={10} m color="var(--warn)">Gi0/1 – Gi0/1</T><T x={475} y={42} size={10} m color="var(--warn)">Gi0/2 – Gi0/1</T>
      <Line x1={120} y1={62} x2={70} y2={150} /><Line x1={140} y1={62} x2={190} y2={150} />
      <ClientIcon x={70} y={162} kind="pc" label="H1 · Fa0/1" /><ClientIcon x={190} y={162} kind="pc" label="H2 · Fa0/2" />
      <Line x1={360} y1={62} x2={360} y2={150} />
      <ClientIcon x={360} y={162} kind="pc" label="H3 · Fa0/1" />
      <Line x1={590} y1={62} x2={590} y2={120} />
      <HubIcon x={590} y={132} />
      <Line x1={576} y1={143} x2={530} y2={182} /><Line x1={604} y1={143} x2={650} y2={182} />
      <ClientIcon x={530} y={194} kind="pc" label="H4 (hub)" /><ClientIcon x={650} y={194} kind="pc" label="H5 (hub)" />
      <T x={612} y={108} size={10} m anchor="start" color="var(--muted)">Fa0/1</T>
      <T x={360} y={258} size={11} color="var(--muted)">192.168.50.0/24 · H1 .11 · H2 .12 · H3 .13 · H4 .14 · H5 .15 · toate în VLAN 1</T>
    </svg>
  );
}
