import { useEffect, useState, type ReactNode } from 'react';

const font = { fontFamily: 'Inter Variable, sans-serif' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...font, fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);

/* simboluri */
export function APIcon({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) {
  return (
    <g>
      <rect x={x - 26} y={y - 12} width={52} height={24} rx={12} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={1.6} />
      <circle cx={x} cy={y} r={3.5} fill="var(--accent)" />
      <path d={`M${x - 9} ${y - 16} a 13 13 0 0 1 18 0 M${x - 15} ${y - 22} a 21 21 0 0 1 30 0`} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round" />
      {label && <T x={x} y={y + 28} weight={650}>{label}</T>}
      {sub && <T x={x} y={y + 42} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}
export function ClientIcon({ x, y, label, kind = 'laptop' }: { x: number; y: number; label?: string; kind?: 'laptop' | 'phone' | 'pc' }) {
  return (
    <g>
      {kind === 'phone' ? <rect x={x - 7} y={y - 12} width={14} height={24} rx={3} fill="var(--surface-3)" stroke="var(--text-2)" strokeWidth={1.3} />
        : kind === 'pc' ? <><rect x={x - 14} y={y - 12} width={28} height={18} rx={2} fill="var(--surface-3)" stroke="var(--text-2)" strokeWidth={1.3} /><path d={`M${x - 6} ${y + 11} h12 M${x} ${y + 6} v5`} stroke="var(--text-2)" strokeWidth={1.3} /></>
          : <><rect x={x - 13} y={y - 10} width={26} height={16} rx={2} fill="var(--surface-3)" stroke="var(--text-2)" strokeWidth={1.3} /><path d={`M${x - 17} ${y + 9} h34`} stroke="var(--text-2)" strokeWidth={2} strokeLinecap="round" /></>}
      {label && <T x={x} y={y + 26} size={10.5} color="var(--text-2)">{label}</T>}
    </g>
  );
}
export function SwitchIcon({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <rect x={x - 32} y={y - 12} width={64} height={24} rx={5} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.6} />
      <path d={`M${x - 16} ${y - 4} h28 l-5 -4 M${x + 16} ${y + 4} h-28 l5 4`} stroke="var(--info)" strokeWidth={1.5} fill="none" />
      {label && <T x={x} y={y + 28} weight={650}>{label}</T>}
    </g>
  );
}
export function RouterIcon({ x, y, label, sub }: { x: number; y: number; label?: string; sub?: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={30} ry={14} fill="var(--surface-3)" stroke="var(--violet)" strokeWidth={1.6} />
      <path d={`M${x - 14} ${y} h28 M${x} ${y - 7} v14`} stroke="var(--violet)" strokeWidth={1.5} />
      {label && <T x={x} y={y + 30} weight={650}>{label}</T>}
      {sub && <T x={x} y={y + 44} size={10.5} color="var(--muted)">{sub}</T>}
    </g>
  );
}
const Cell = ({ x, y, r, color = 'var(--accent)' }: { x: number; y: number; r: number; color?: string }) => (
  <circle cx={x} cy={y} r={r} fill={color} fillOpacity={0.07} stroke={color} strokeOpacity={0.45} strokeDasharray="5 5" />
);
const Air = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="3 4" opacity={0.8} />
);
const Wire = ({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) => (
  <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-2)" strokeWidth={2} />{label && <T x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 7} size={10} anchor="start" color="var(--muted)">{label}</T>}</g>
);

/* ---------------------------------------------------------------
   Topologii: BSS / ESS / IBSS
---------------------------------------------------------------- */
export function WlanTopologies() {
  const [v, setV] = useState<'bss' | 'ess' | 'ibss'>('bss');
  return (
    <>
      <div className="segmented" role="group" aria-label="Topologie" style={{ marginBottom: 12 }}>
        {(['bss', 'ess', 'ibss'] as const).map((k) => <button key={k} className={v === k ? 'on' : ''} onClick={() => setV(k)}>{k.toUpperCase()}</button>)}
      </div>
      {v === 'bss' && (
        <svg viewBox="0 0 720 300" role="img" aria-label="BSS: un AP cu clienții lui">
          <Cell x={360} y={170} r={120} />
          <SwitchIcon x={360} y={30} label="" />
          <T x={430} y={34} size={11} anchor="start" color="var(--muted)">switch (DS) — VLAN 10</T>
          <Wire x1={360} y1={42} x2={360} y2={138} label="Ethernet / PoE" />
          <APIcon x={360} y={152} label="AP1" sub="SSID „CORP” · BSSID 00:3a:7d:11:22:30" />
          <ClientIcon x={250} y={170} label="laptop" /><ClientIcon x={470} y={175} kind="phone" label="telefon" /><ClientIcon x={300} y={250} label="laptop" /><ClientIcon x={430} y={248} kind="phone" label="telefon" />
          <Air x1={340} y1={158} x2={262} y2={168} /><Air x1={380} y1={158} x2={463} y2={172} /><Air x1={350} y1={164} x2={302} y2={236} /><Air x1={372} y1={164} x2={428} y2={232} />
          <T x={150} y={290} size={11} anchor="start" color="var(--muted)">BSS = AP + clienții asociați. Aria acoperită = BSA („celula”). Tot traficul trece prin AP.</T>
        </svg>
      )}
      {v === 'ess' && (
        <svg viewBox="0 0 720 300" role="img" aria-label="ESS: mai multe AP-uri cu același SSID">
          <Cell x={190} y={190} r={105} /><Cell x={360} y={190} r={105} color="var(--info)" /><Cell x={530} y={190} r={105} color="var(--violet)" />
          <SwitchIcon x={360} y={30} />
          <T x={430} y={34} size={11} anchor="start" color="var(--muted)">DS: switch-ul unește celulele</T>
          <Wire x1={340} y1={42} x2={200} y2={168} /><Wire x1={360} y1={42} x2={360} y2={168} /><Wire x1={380} y1={42} x2={520} y2={168} />
          <APIcon x={190} y={180} label="AP1 · ch 1" sub="BSSID …:30" />
          <APIcon x={360} y={180} label="AP2 · ch 6" sub="BSSID …:50" />
          <APIcon x={530} y={180} label="AP3 · ch 11" sub="BSSID …:70" />
          <ClientIcon x={275} y={250} label="roaming →" />
          <path d="M250 268 q 25 14 60 0" fill="none" stroke="var(--warn)" strokeWidth={1.6} markerEnd="url(#essA)" />
          <defs><marker id="essA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--warn)" /></marker></defs>
          <T x={360} y={294} size={11} color="var(--muted)">Același SSID „CORP” pe toate AP-urile · canale diferite · suprapunere ≈10–20% pentru roaming</T>
        </svg>
      )}
      {v === 'ibss' && (
        <svg viewBox="0 0 720 300" role="img" aria-label="IBSS: rețea ad hoc fără AP">
          <Cell x={360} y={150} r={115} color="var(--warn)" />
          <ClientIcon x={270} y={110} label="laptop A" /><ClientIcon x={450} y={110} label="laptop B" /><ClientIcon x={360} y={215} kind="phone" label="telefon C" />
          <Air x1={286} y1={110} x2={434} y2={110} /><Air x1={276} y1={124} x2={352} y2={202} /><Air x1={444} y1={124} x2={368} y2={202} />
          <T x={360} y={290} size={11} color="var(--muted)">IBSS (ad hoc): fără AP, fără legătură cu rețeaua cablată. Rar folosit în rețelele enterprise.</T>
        </svg>
      )}
    </>
  );
}

/* ---------------------------------------------------------------
   Un AP, mai multe SSID-uri → VLAN-uri (trunk 802.1Q)
---------------------------------------------------------------- */
export function SsidVlanMap() {
  const rows = [
    { ssid: 'CORP', vlan: 10, sec: 'WPA2/3-Enterprise', c: 'var(--accent)' },
    { ssid: 'GUEST', vlan: 30, sec: 'WPA2-PSK + portal', c: 'var(--warn)' },
    { ssid: 'IOT', vlan: 40, sec: 'WPA2-PSK (iPSK)', c: 'var(--violet)' },
  ];
  return (
    <svg viewBox="0 0 720 230" role="img" aria-label="Mapare SSID la VLAN">
      <APIcon x={110} y={110} label="AP" sub="1 radio · 3 BSSID-uri" />
      {rows.map((r, i) => (
        <g key={r.ssid}>
          <path d={`M140 110 C 200 110, 200 ${50 + i * 60}, 250 ${50 + i * 60}`} fill="none" stroke={r.c} strokeWidth={2} />
          <rect x={250} y={34 + i * 60} width={150} height={32} rx={9} fill="var(--surface-3)" stroke={r.c} />
          <T x={262} y={55 + i * 60} anchor="start" weight={650}>SSID {r.ssid}</T>
          <T x={410} y={55 + i * 60} anchor="start" size={11} color="var(--muted)">{r.sec}</T>
          <path d={`M400 ${50 + i * 60} C 520 ${50 + i * 60}, 520 110, 580 110`} fill="none" stroke={r.c} strokeWidth={2} strokeDasharray="5 4" />
          <T x={540} y={46 + i * 60 + (i === 0 ? 0 : i === 2 ? 22 : 10)} size={11} color={r.c} weight={650}>VLAN {r.vlan}</T>
        </g>
      ))}
      <SwitchIcon x={620} y={110} label="switch" />
      <T x={620} y={155} size={10.5} color="var(--muted)">port trunk 802.1Q</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   Evoluția securității wireless
---------------------------------------------------------------- */
export function SecurityTimeline() {
  const items = [
    { y: '1997', n: 'WEP', c: 'RC4 · IV 24 biți', s: 'spart', col: 'var(--bad)' },
    { y: '2003', n: 'WPA', c: 'TKIP (RC4)', s: 'depreciat', col: 'var(--warn)' },
    { y: '2004', n: 'WPA2', c: 'AES-CCMP · 802.11i', s: 'acceptabil', col: 'var(--info)' },
    { y: '2018', n: 'WPA3', c: 'SAE · PMF · GCMP-256', s: 'recomandat', col: 'var(--ok)' },
  ];
  return (
    <svg viewBox="0 0 720 170" role="img" aria-label="Evoluția securității Wi-Fi">
      <line x1={60} x2={660} y1={70} y2={70} stroke="var(--border-strong)" strokeWidth={2} />
      {items.map((it, i) => {
        const x = 90 + i * 180;
        return (
          <g key={it.n}>
            <circle cx={x} cy={70} r={9} fill={it.col} />
            <T x={x} y={44} size={12} color="var(--muted)">{it.y}</T>
            <T x={x} y={104} size={16} weight={700} color={it.col}>{it.n}</T>
            <T x={x} y={124} size={11.5} color="var(--text-2)">{it.c}</T>
            <T x={x} y={142} size={10.5} color="var(--muted)">{it.s}</T>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------------------------------------------------------
   4-way handshake — animație pas cu pas
---------------------------------------------------------------- */
const HS = [
  { dir: 'r', label: 'M1: ANonce', desc: 'AP-ul trimite un număr aleatoriu (ANonce). Clientul are acum: PMK + ANonce + SNonce-ul propriu + cele două MAC-uri, deci poate calcula PTK-ul.' },
  { dir: 'l', label: 'M2: SNonce + MIC', desc: 'Clientul trimite SNonce-ul, semnat cu un MIC calculat din PTK. AP-ul calculează și el PTK-ul și verifică MIC-ul. Dacă parola e greșită, MIC-ul nu se potrivește și conexiunea eșuează aici.' },
  { dir: 'r', label: 'M3: GTK (criptat) + MIC', desc: 'AP-ul dovedește că are același PTK și trimite, criptat, cheia de grup (GTK) pentru broadcast/multicast.' },
  { dir: 'l', label: 'M4: ACK', desc: 'Clientul confirmă. Ambele părți instalează cheile; de acum traficul este criptat cu AES-CCMP (sau GCMP).' },
];
export function Handshake4Way() {
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setStep((s) => { if (s >= HS.length) { setPlay(false); return s; } return s + 1; }), 1600);
    return () => clearInterval(t);
  }, [play]);
  const xA = 140, xC = 580;
  return (
    <>
      <svg viewBox="0 0 720 330" role="img" aria-label="4-way handshake">
        <defs>
          <marker id="hsR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)" /></marker>
        </defs>
        <APIcon x={xA} y={36} />
        <ClientIcon x={xC} y={36} />
        <T x={xA} y={78} weight={650}>Authenticator (AP)</T>
        <T x={xC} y={78} weight={650}>Supplicant (client)</T>
        <line x1={xA} x2={xA} y1={88} y2={310} stroke="var(--border-strong)" strokeDasharray="4 4" />
        <line x1={xC} x2={xC} y1={88} y2={310} stroke="var(--border-strong)" strokeDasharray="4 4" />
        <T x={xA} y={104} size={10.5} color="var(--muted)">are PMK</T>
        <T x={xC} y={104} size={10.5} color="var(--muted)">are PMK (din parolă+SSID)</T>
        {HS.map((h, i) => {
          const y = 140 + i * 44; const on = i < step;
          const [a, b] = h.dir === 'r' ? [xA + 6, xC - 6] : [xC - 6, xA + 6];
          return (
            <g key={i} opacity={on ? 1 : 0.15} style={{ transition: 'opacity .4s' }}>
              <line x1={a} x2={b} y1={y} y2={y} stroke="var(--accent)" strokeWidth={2.4} markerEnd="url(#hsR)" className={on && i === step - 1 ? 'flow' : undefined} />
              <rect x={290} y={y - 25} width={140} height={20} rx={6} fill="var(--surface)" />
              <T x={360} y={y - 11} size={12} weight={650}>{h.label}</T>
            </g>
          );
        })}
        {step >= 4 && <g className="fade-up"><rect x={xA - 40} y={300} width={xC - xA + 80} height={26} rx={8} fill="var(--ok-soft)" /><T x={360} y={318} size={12} weight={650} color="var(--ok)">PTK + GTK instalate → trafic criptat</T></g>}
        {step >= 1 && step < 4 && <T x={xC + 6} y={150} size={10} anchor="start" color="var(--violet)">calc. PTK</T>}
        {step >= 2 && step < 4 && <T x={xA - 6} y={194} size={10} anchor="end" color="var(--violet)">calc. PTK, verif. MIC</T>}
      </svg>
      <div className="callout tip" style={{ marginTop: 8, minHeight: 64 }}>
        <div><b>{step === 0 ? 'Apasă „Pasul următor” sau „Redă”.' : HS[step - 1].label}</b>{step > 0 && <div className="small">{HS[step - 1].desc}</div>}</div>
      </div>
      <div className="controls">
        <button className="btn sm" onClick={() => { setPlay(false); setStep(Math.max(0, step - 1)); }} disabled={step === 0}>← Înapoi</button>
        <button className="btn sm primary" onClick={() => { setPlay(false); setStep(Math.min(HS.length, step + 1)); }} disabled={step >= HS.length}>Pasul următor →</button>
        <button className="btn sm" onClick={() => { setStep(0); setPlay(true); }}>▶ Redă</button>
        <span className="small muted">Pas {step}/{HS.length}</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   CSMA/CA — cronologie pas cu pas
---------------------------------------------------------------- */
const CS = [
  { k: 'listen', t: '1. Carrier sense', d: 'Clientul ascultă canalul. Dacă altcineva transmite, așteaptă (și respectă NAV-ul anunțat de cadrele altora).' },
  { k: 'difs', t: '2. DIFS', d: 'Canalul e liber, dar clientul mai așteaptă un interval fix (DIFS) ca să lase prioritate cadrelor de control.' },
  { k: 'backoff', t: '3. Random backoff', d: 'Alege un număr aleatoriu de sloturi (din contention window) și numără invers doar cât timp canalul rămâne liber. Așa, doi clienți care așteaptă nu pornesc exact în același moment.' },
  { k: 'data', t: '4. DATA', d: 'Transmite cadrul. Nu poate detecta o coliziune în timp ce emite (de aceea CA, nu CD).' },
  { k: 'sifs', t: '5. SIFS', d: 'Receptorul așteaptă un interval scurt (SIFS), mai scurt decât DIFS, ca ACK-ul să aibă prioritate.' },
  { k: 'ack', t: '6. ACK', d: 'Receptorul confirmă. Fără ACK, emițătorul presupune o coliziune sau o eroare și retransmite cu un backoff mai mare.' },
];
export function CsmaCa() {
  const [step, setStep] = useState(0);
  const seg = [
    { k: 'busy', w: 120, l: 'mediu ocupat', c: 'var(--surface-3)', row: 0 },
    { k: 'difs', w: 70, l: 'DIFS', c: 'var(--info-soft)', row: 0 },
    { k: 'backoff', w: 110, l: 'backoff', c: 'var(--warn-soft)', row: 0 },
    { k: 'data', w: 190, l: 'DATA', c: 'var(--accent-soft)', row: 0 },
    { k: 'sifs', w: 40, l: 'SIFS', c: 'var(--info-soft)', row: 1 },
    { k: 'ack', w: 80, l: 'ACK', c: 'var(--ok-soft)', row: 1 },
  ];
  let x = 110; const placed = seg.map((s) => { const r = { ...s, x }; x += s.w; return r; });
  const activeKey = step === 0 ? null : CS[step - 1].k;
  const visible = (k: string) => { const idx = ['busy', 'listen', 'difs', 'backoff', 'data', 'sifs', 'ack'].indexOf(k); const cur = activeKey ? ['busy', 'listen', 'difs', 'backoff', 'data', 'sifs', 'ack'].indexOf(activeKey) : 0; return k === 'busy' || idx <= cur; };
  return (
    <>
      <svg viewBox="0 0 760 150" role="img" aria-label="CSMA/CA cronologie">
        <T x={14} y={52} anchor="start" weight={650}>Emițător</T>
        <T x={14} y={112} anchor="start" weight={650}>Receptor</T>
        <line x1={110} x2={740} y1={70} y2={70} stroke="var(--border)" /><line x1={110} x2={740} y1={130} y2={130} stroke="var(--border)" />
        {placed.map((s) => (
          <g key={s.k} opacity={visible(s.k) ? 1 : 0.12} style={{ transition: 'opacity .35s' }}>
            <rect x={s.x} y={s.row ? 92 : 32} width={s.w - 3} height={34} rx={6} fill={s.c} stroke={activeKey === s.k || (activeKey === 'listen' && s.k === 'busy') ? 'var(--accent)' : 'var(--border)'} strokeWidth={activeKey === s.k ? 2 : 1} />
            <T x={s.x + s.w / 2} y={s.row ? 113 : 53} size={11.5} weight={600}>{s.l}</T>
          </g>
        ))}
      </svg>
      <div className="callout tip" style={{ minHeight: 64 }}><div><b>{step === 0 ? 'Parcurge pașii CSMA/CA' : CS[step - 1].t}</b>{step > 0 && <div className="small">{CS[step - 1].d}</div>}</div></div>
      <div className="controls">
        <button className="btn sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Înapoi</button>
        <button className="btn sm primary" onClick={() => setStep(Math.min(CS.length, step + 1))} disabled={step >= CS.length}>Pasul următor →</button>
        <span className="small muted">Pas {step}/{CS.length}</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   Topologii laborator
---------------------------------------------------------------- */
export function LabGuidedTopology() {
  return (
    <svg viewBox="0 0 720 250" role="img" aria-label="Topologie lab ghidat">
      <Cell x={360} y={120} r={105} />
      <RouterIcon x={360} y={110} label="WRT300N" sub="LAN 192.168.0.1 · SSID CCNA-LAB · ch 6" />
      <ClientIcon x={120} y={110} kind="pc" label="PC0 (cablu)" />
      <Wire x1={140} y1={110} x2={328} y2={110} label="Ethernet 1" />
      <ClientIcon x={540} y={70} label="Laptop0 (WPC300N)" />
      <ClientIcon x={540} y={170} kind="phone" label="Smartphone0" />
      <Air x1={392} y1={104} x2={524} y2={72} /><Air x1={392} y1={116} x2={530} y2={166} />
      <T x={360} y={244} size={11} color="var(--muted)">DHCP de pe WRT300N: 192.168.0.100 – 192.168.0.149 · WPA2-Personal (AES)</T>
    </svg>
  );
}
export function LabSoloTopology() {
  return (
    <svg viewBox="0 0 720 280" role="img" aria-label="Topologie lab solo">
      <Cell x={200} y={190} r={90} /><Cell x={520} y={190} r={90} color="var(--info)" />
      <RouterIcon x={360} y={30} label="" />
      <T x={400} y={34} size={11} anchor="start" color="var(--muted)">R-GW: WRT300N (doar DHCP/gateway, wireless OFF)</T>
      <Wire x1={360} y1={44} x2={360} y2={86} />
      <SwitchIcon x={360} y={100} label="" />
      <T x={400} y={104} size={11} anchor="start" color="var(--muted)">SW1 (2960)</T>
      <Wire x1={334} y1={110} x2={214} y2={168} /><Wire x1={386} y1={110} x2={506} y2={168} />
      <APIcon x={200} y={180} label="AP-A" sub="canal 1" />
      <APIcon x={520} y={180} label="AP-B" sub="canal 11" />
      <ClientIcon x={120} y={235} label="Laptop-A1" /><ClientIcon x={260} y={240} kind="phone" label="Phone-A2" />
      <ClientIcon x={460} y={240} label="Laptop-B1" /><ClientIcon x={600} y={235} kind="phone" label="Phone-B2" />
      <T x={360} y={275} size={11} color="var(--muted)">ESS: același SSID „BIROU” pe ambele AP-uri · WPA2-PSK AES</T>
    </svg>
  );
}
