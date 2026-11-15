import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 2.9 (interfața grafică a WLC pentru WLAN). Culori doar prin var(--…). */

type Tab = 'general' | 'security' | 'qos' | 'advanced';
type Field = { label: string; value: string; info: string };
const GUI: Record<Tab, Field[]> = {
  general: [
    { label: 'Profile Name', value: 'CORP-WLAN', info: 'Numele intern al profilului WLAN (pentru administratori). Nu este ce văd clienții.' },
    { label: 'SSID', value: 'CORP', info: 'Numele rețelei pe care îl văd clienții (beacons). Poate fi diferit de Profile Name.' },
    { label: 'Status', value: 'Enabled', info: 'Pornește/oprește WLAN-ul. Se creează cu Disabled și se activează după ce ai terminat configurarea.' },
    { label: 'Radio Policy', value: 'All', info: 'Pe ce benzi se anunță SSID-ul: All, 802.11a only (5 GHz), 802.11g only (2,4 GHz)…' },
    { label: 'Interface/Interface Group', value: 'employee', info: 'Interfața dinamică (VLAN + subrețea) în care sunt puși clienții acestui SSID (2.7).' },
    { label: 'Broadcast SSID', value: 'Enabled', info: 'Dacă SSID-ul apare în beacons. Disabled = „hidden SSID”: securitate prin obscuritate, nu protecție reală.' },
  ],
  security: [
    { label: 'Layer 2 Security', value: 'WPA+WPA2', info: 'Metoda de securitate la nivel 2: None (open), WPA+WPA2, 802.1X, WEP (învechit)…' },
    { label: 'WPA2 Encryption', value: 'AES', info: 'AES = CCMP, recomandat. TKIP este moștenit și nu se mai recomandă.' },
    { label: 'Auth Key Mgmt', value: '802.1X', info: '802.1X = Enterprise (RADIUS, EAP). PSK = Personal (parolă comună). SAE = WPA3-Personal. FT = roaming rapid.' },
    { label: 'PSK / passphrase', value: '— (doar la PSK)', info: 'La WPA2-Personal: parolă de 8–63 caractere ASCII (sau 64 hex), identică pe client și WLAN.' },
    { label: 'Protected Management Frame', value: 'Optional', info: 'PMF (802.11w) protejează cadrele de management. La WPA3 devine obligatoriu (Required).' },
    { label: 'Layer 3 Security', value: 'None', info: 'None sau Web Policy (portal captiv: Authentication, Passthrough etc.), tipic pentru oaspeți.' },
    { label: 'AAA Servers', value: 'RADIUS 192.168.1.50', info: 'Serverul RADIUS pentru 802.1X (UDP 1812/1813). Se definește în Security → AAA → RADIUS.' },
  ],
  qos: [
    { label: 'Quality of Service (QoS)', value: 'Silver (best effort)', info: 'Profil: Platinum = voce, Gold = video, Silver = best effort (implicit), Bronze = background. Setează plafonul de prioritate pentru WLAN.' },
    { label: 'WMM Policy', value: 'Allowed', info: 'Wi-Fi Multimedia: Disabled / Allowed (și clienți WMM, și non-WMM) / Required (doar clienți WMM).' },
    { label: 'Call Admission Control', value: 'Disabled', info: 'Limitează apelurile de voce/video ca să nu depășească capacitatea (opțional).' },
  ],
  advanced: [
    { label: 'Allow AAA Override', value: 'Disabled', info: 'Dacă RADIUS poate suprascrie per utilizator VLAN-ul, QoS-ul sau ACL-ul setate pe WLAN.' },
    { label: 'Session Timeout', value: '1800 s', info: 'După acest timp clientul se reautentifică (valoare uzuală 1800 s la 802.1X).' },
    { label: 'Client Exclusion', value: 'Enabled · 60 s', info: 'Clientul care eșuează de mai multe ori la autentificare/asociere este exclus temporar.' },
    { label: 'Maximum Allowed Clients', value: '0 (nelimitat)', info: 'Plafon de clienți pe WLAN (util pentru oaspeți).' },
    { label: 'DHCP Addr. Assignment Required', value: 'Disabled', info: 'Dacă este Enabled, clienții cu IP static nu pot trece: trebuie să obțină IP prin DHCP.' },
    { label: 'DTIM Period', value: '1', info: 'La câte beacon-uri se anunță traficul multicast/broadcast pentru clienții în economie de energie.' },
    { label: 'Client Band Select / Load Balancing', value: 'Disabled', info: 'Îndeamnă clienții dual-band spre 5 GHz și echilibrează clienții între AP-uri.' },
    { label: 'FlexConnect Local Switching', value: 'Disabled', info: 'La AP-uri FlexConnect: comută traficul local (2.6/2.7).' },
  ],
};
const TABS: [Tab, string][] = [['general', 'General'], ['security', 'Security'], ['qos', 'QoS'], ['advanced', 'Advanced']];

export function WlanGuiMock() {
  const [tab, setTab] = useState<Tab>('general');
  const [i, setI] = useState(0);
  const fields = GUI[tab];
  const f = fields[Math.min(i, fields.length - 1)];
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--code-bg)' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--surface-3)', fontWeight: 700, fontSize: 13 }}>WLANs › Edit ‘CORP-WLAN’ (ilustrativ, stil AireOS)</div>
      <div role="tablist" aria-label="Taburile WLAN" style={{ display: 'flex', gap: 2, padding: '6px 8px 0', background: 'var(--surface-3)', flexWrap: 'wrap' }}>
        {TABS.map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setI(0); }}
            style={{ padding: '6px 14px', border: '1px solid var(--border)', borderBottom: tab === k ? '1px solid var(--code-bg)' : '1px solid var(--border)', borderRadius: '6px 6px 0 0', background: tab === k ? 'var(--code-bg)' : 'transparent', color: tab === k ? 'var(--accent)' : 'var(--text-2)', fontWeight: tab === k ? 700 : 500, cursor: 'pointer', fontSize: 13 }}>{l}</button>
        ))}
      </div>
      <div style={{ padding: 10 }}>
        {fields.map((x, k) => (
          <div key={x.label} role="button" tabIndex={0} aria-pressed={k === i} onClick={() => setI(k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setI(k); } }}
            style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '6px 10px', marginBottom: 3, borderRadius: 6, cursor: 'pointer', fontSize: 13, border: k === i ? '1px solid var(--accent)' : '1px solid transparent', background: k === i ? 'var(--accent-soft)' : 'transparent' }}>
            <span style={{ color: 'var(--text-2)' }}>{x.label}</span>
            <span style={{ fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace', fontSize: 12, color: 'var(--text)' }}>{x.value}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-3)', fontSize: 13 }}>
          <b style={{ color: 'var(--accent)' }}>{f.label}</b>: {f.info}
        </div>
      </div>
    </div>
  );
}

/* 1) Fluxul de creare: de la profil la clienți */
export function WlanFlow() {
  const box = (x: number, title: string, sub: string, c: string) => (
    <g>
      <rect x={x} y={34} width={120} height={56} rx={9} fill="var(--surface-3)" stroke={c} strokeWidth={2} />
      <T x={x + 60} y={58} weight={700} size={11.5}>{title}</T>
      <T x={x + 60} y={76} size={9.5} color="var(--muted)">{sub}</T>
    </g>
  );
  return (
    <svg viewBox="0 0 720 150" role="img" aria-label="Fluxul de creare a unui WLAN: profil, securitate, interfață, QoS">
      {box(14, 'Profile + SSID', 'General', 'var(--accent)')}
      <Line x1={134} y1={62} x2={154} y2={62} c="var(--accent)" w={2.5} />
      {box(154, 'Interfață / VLAN', 'General (2.7)', 'var(--info)')}
      <Line x1={274} y1={62} x2={294} y2={62} c="var(--accent)" w={2.5} />
      {box(294, 'Securitate', 'Layer 2 / 3 / AAA', 'var(--warn)')}
      <Line x1={414} y1={62} x2={434} y2={62} c="var(--accent)" w={2.5} />
      {box(434, 'QoS', 'Platinum…Bronze', 'var(--violet)')}
      <Line x1={554} y1={62} x2={574} y2={62} c="var(--accent)" w={2.5} />
      {box(574, 'Advanced + Enable', 'AAA override…', 'var(--ok)')}
      <T x={360} y={126} size={10.5} color="var(--muted)">Ordinea logică: creezi WLAN-ul dezactivat, setezi interfața, securitatea, QoS și avansatele, apoi îl activezi (Status: Enabled).</T>
    </svg>
  );
}

/* 2) Profilurile QoS */
type Q = 'platinum' | 'gold' | 'silver' | 'bronze';
const QOS: Record<Q, { n: string; t: string; ac: string; ex: string; col: string; h: number }> = {
  platinum: { n: 'Platinum', t: 'Voce', ac: 'AC_VO', ex: 'telefoane IP wireless, VoIP', col: 'var(--bad)', h: 120 },
  gold: { n: 'Gold', t: 'Video', ac: 'AC_VI', ex: 'videoconferințe, streaming video', col: 'var(--warn)', h: 90 },
  silver: { n: 'Silver', t: 'Best effort (implicit)', ac: 'AC_BE', ex: 'navigare web, e-mail, date obișnuite', col: 'var(--ok)', h: 60 },
  bronze: { n: 'Bronze', t: 'Background', ac: 'AC_BK', ex: 'WLAN de oaspeți, descărcări, backup', col: 'var(--info)', h: 30 },
};
export function QosProfiles() {
  const [q, setQ] = useState<Q>('silver');
  const d = QOS[q];
  return (
    <div>
      <Seg value={q} set={setQ} label="Profil QoS" items={(Object.keys(QOS) as Q[]).map((k) => [k, QOS[k].n] as [Q, string])} />
      <svg viewBox="0 0 720 200" role="img" aria-label="Profilurile QoS ale WLC-ului și corespondența cu categoriile WMM">
        {(Object.keys(QOS) as Q[]).map((k, idx) => (
          <g key={k}>
            <rect x={50 + idx * 90} y={150 - QOS[k].h} width={70} height={QOS[k].h} rx={6} fill={k === q ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={QOS[k].col} strokeWidth={k === q ? 2.8 : 1.4} />
            <T x={85 + idx * 90} y={168} size={11} weight={700}>{QOS[k].n}</T>
          </g>
        ))}
        <T x={410} y={26} anchor="start" weight={700} size={13} color={d.col}>{`${d.n} = ${d.t}`}</T>
        <T x={410} y={50} anchor="start" size={11} color="var(--text-2)">{`Categoria WMM: ${d.ac}`}</T>
        <T x={410} y={72} anchor="start" size={11} color="var(--text-2)">{`Exemple: ${d.ex}`}</T>
        <T x={410} y={100} anchor="start" size={10.5} color="var(--muted)">Profilul se setează pe WLAN și limitează prioritatea</T>
        <T x={410} y={116} anchor="start" size={10.5} color="var(--muted)">maximă acordată traficului de pe acel SSID.</T>
        <T x={410} y={140} anchor="start" size={10.5} color="var(--muted)">Voce ⇒ Platinum; oaspeți ⇒ Bronze; restul ⇒ Silver.</T>
        <T x={360} y={192} size={10} color="var(--muted)">Înălțimea barelor = prioritatea relativă (Platinum cea mai mare).</T>
      </svg>
    </div>
  );
}

/* 3) Tipuri de securitate L2: ce cere fiecare */
type Sec = 'open' | 'psk' | 'ent' | 'wpa3';
const SEC: Record<Sec, { n: string; auth: string; need: string; note: string; col: string }> = {
  open: { n: 'Open', auth: 'fără autentificare', need: 'doar SSID', note: 'Fără criptare (fără OWE). Doar pentru oaspeți cu portal captiv (Layer 3).', col: 'var(--bad)' },
  psk: { n: 'WPA2-Personal (PSK)', auth: 'parolă comună (PSK)', need: 'Layer 2: WPA+WPA2, WPA2 Policy, AES, Auth Key Mgmt = PSK, passphrase', note: 'Simplu; toată lumea știe aceeași parolă. Potrivit pentru birouri mici/acasă.', col: 'var(--warn)' },
  ent: { n: 'WPA2-Enterprise (802.1X)', auth: 'utilizator/certificat, prin RADIUS', need: 'Layer 2: WPA+WPA2, AES, Auth Key Mgmt = 802.1X; AAA: server RADIUS', note: 'Identitate individuală, chei per sesiune, revocare ușoară. Standardul în companii.', col: 'var(--ok)' },
  wpa3: { n: 'WPA3 (SAE / Enterprise)', auth: 'SAE (Personal) sau 802.1X (Enterprise)', need: 'WPA3 Policy; Auth Key Mgmt = SAE (sau 802.1X-SHA256/192); PMF = Required', note: 'Mai rezistent la atacuri offline pe parolă; PMF obligatoriu.', col: 'var(--info)' },
};
export function SecurityPicker() {
  const [s, setS] = useState<Sec>('ent');
  const d = SEC[s];
  return (
    <div>
      <Seg value={s} set={setS} label="Securitate WLAN" items={(Object.keys(SEC) as Sec[]).map((k) => [k, SEC[k].n] as [Sec, string])} />
      <svg viewBox="0 0 720 190" role="img" aria-label="Cerințele de configurare pentru tipul de securitate ales">
        <ClientIcon x={70} y={50} kind="laptop" label="client" />
        <Line x1={100} y1={50} x2={310} y2={50} c={d.col} w={3} />
        <rect x={310} y={28} width={90} height={44} rx={8} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={1.8} /><T x={355} y={55} weight={700}>AP → WLC</T>
        {s === 'ent' || s === 'wpa3' ? (<g><Line x1={400} y1={50} x2={560} y2={50} c="var(--accent)" w={2} dash="5 4" /><rect x={560} y={28} width={120} height={44} rx={8} fill="var(--surface-3)" stroke="var(--ok)" strokeWidth={1.8} /><T x={620} y={55} weight={700}>RADIUS</T></g>) : null}
        <rect x={30} y={96} width={660} height={84} rx={8} fill="var(--code-bg)" stroke={d.col} strokeWidth={1.6} />
        <T x={44} y={116} anchor="start" size={12} weight={700} color={d.col}>{d.n}</T>
        <T x={44} y={134} anchor="start" size={10.5} color="var(--text-2)">{`Autentificare: ${d.auth}`}</T>
        <T x={44} y={152} anchor="start" size={10.5} color="var(--text-2)">{`Câmpuri în GUI: ${d.need.length > 108 ? d.need.slice(0, d.need.lastIndexOf(' ', 108)) + '…' : d.need}`}</T>
        <T x={44} y={170} anchor="start" size={10.5} color="var(--text)">{d.note.length > 112 ? d.note.slice(0, d.note.lastIndexOf(' ', 112)) + '…' : d.note}</T>
      </svg>
    </div>
  );
}

/* 4) Topologii laborator */
export function LabGuidedTopology29() {
  return (
    <svg viewBox="0 0 720 240" role="img" aria-label="Topologie lab 2.9: WLC, switch, AP, server RADIUS și clienți wireless">
      <rect x={290} y={14} width={140} height={44} rx={8} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} /><T x={360} y={42} weight={700}>WLC</T>
      <Line x1={360} y1={58} x2={360} y2={98} c="var(--info)" w={3} /><SwitchIcon x={360} y={110} label="SW1" />
      <Line x1={330} y1={116} x2={170} y2={160} /><ClientIcon x={150} y={166} kind="pc" label="AP + clienți" />
      <Line x1={390} y1={116} x2={550} y2={160} /><RouterIcon x={560} y={166} label="Server RADIUS" />
      <T x={440} y={80} anchor="start" size={10} m color="var(--muted)">VLAN 10 corp · VLAN 30 guest</T>
    </svg>
  );
}
export function LabSoloTopology29() {
  return (
    <svg viewBox="0 0 720 200" role="img" aria-label="Topologie lab solo 2.9: trei WLAN-uri cu cerințe diferite">
      <rect x={30} y={30} width={200} height={110} rx={10} fill="none" stroke="var(--border)" strokeDasharray="4 4" /><T x={130} y={56} weight={700}>CORP</T><T x={130} y={76} size={10.5} color="var(--muted)">802.1X · VLAN 10 · Silver</T>
      <rect x={260} y={30} width={200} height={110} rx={10} fill="none" stroke="var(--border)" strokeDasharray="4 4" /><T x={360} y={56} weight={700}>VOICE</T><T x={360} y={76} size={10.5} color="var(--muted)">WPA2-PSK · VLAN 20 · Platinum</T>
      <rect x={490} y={30} width={200} height={110} rx={10} fill="none" stroke="var(--border)" strokeDasharray="4 4" /><T x={590} y={56} weight={700}>GUEST</T><T x={590} y={76} size={10.5} color="var(--muted)">Web Auth · VLAN 30 · Bronze</T>
      <T x={360} y={176} size={11} color="var(--muted)">Cerință: configurează fiecare WLAN în GUI cu securitatea, interfața și QoS potrivite</T>
    </svg>
  );
}
