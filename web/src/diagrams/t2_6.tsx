import { useState } from 'react';
import { APIcon, ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 2.6 (arhitecturi wireless Cisco și moduri AP). Culori doar prin var(--…). */

/* 1) Cele patru arhitecturi */
type Arch = 'auto' | 'lwap' | 'cloud' | 'ewc';
const ARCH: Record<Arch, { title: string; mgmt: string; data: string; pro: string; con: string }> = {
  auto: { title: 'Autonomous AP', mgmt: 'Fiecare AP se configurează individual (CLI/GUI), fără controller.', data: 'Clienții → AP → port de switch (access sau trunk) → rețea. Fără tunel.', pro: 'Simplu pentru 1–3 AP; fără controller de cumpărat.', con: 'Nu scalează: configurare, canale și putere manuale; roaming și politici nesincronizate.' },
  lwap: { title: 'Lightweight AP + WLC (split-MAC)', mgmt: 'WLC-ul centralizează configurația, RRM, securitatea, roaming-ul.', data: 'AP ⟷ WLC prin tuneluri CAPWAP (UDP 5246 control, 5247 date). În mod Local, traficul clienților urcă prin tunel la WLC.', pro: 'Gestiune centralizată la zeci/mii de AP; RRM, roaming rapid, politici uniforme.', con: 'Cost WLC; traficul trece prin WLC (în Local); WLC = punct critic (se face redundanță).' },
  cloud: { title: 'Cloud-based (de exemplu Cisco Meraki)', mgmt: 'Dashboard în cloud; AP-urile se conectează la cloud prin Internet.', data: 'Traficul clienților rămâne local (switch-at local); doar managementul merge în cloud.', pro: 'Zero-touch; fără controller local; potrivit pentru sucursale/IMM.', con: 'Depinde de licență și de acces Internet pentru management (rețeaua rulează chiar dacă pierzi cloud-ul, dar nu mai poți configura).' },
  ewc: { title: 'Embedded (WLC integrat: EWC / Mobility Express)', mgmt: 'Un AP (sau un switch Catalyst 9K) rulează funcția de controller pentru un număr mic de AP-uri.', data: 'Ca la lightweight: CAPWAP între AP-uri și controller-ul integrat.', pro: 'Fără hardware dedicat; sucursale mici (zeci de AP).', con: 'Scalare limitată; platforma de controller e legată de modelul AP/switch.' },
};
export function Architectures() {
  const [a, setA] = useState<Arch>('lwap');
  const d = ARCH[a];
  return (
    <div>
      <Seg value={a} set={setA} label="Arhitectura" items={[['auto', 'Autonomous'], ['lwap', 'Lightweight + WLC'], ['cloud', 'Cloud'], ['ewc', 'Embedded']]} />
      <svg viewBox="0 0 720 270" role="img" aria-label="Topologia arhitecturii wireless alese">
        {a === 'auto' && (
          <g>
            <APIcon x={150} y={80} label="AP autonom 1" /><APIcon x={360} y={80} label="AP autonom 2" /><APIcon x={570} y={80} label="AP autonom 3" />
            <Line x1={150} y1={110} x2={360} y2={160} /><Line x1={360} y1={110} x2={360} y2={160} /><Line x1={570} y1={110} x2={360} y2={160} />
            <SwitchIcon x={360} y={170} label="Switch" />
            <T x={360} y={236} size={11} color="var(--warn)">3 configurații separate, de întreținut manual</T>
          </g>
        )}
        {a === 'lwap' && (
          <g>
            <rect x={280} y={14} width={160} height={46} rx={8} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} /><T x={360} y={42} weight={700}>WLC</T>
            <Line x1={360} y1={60} x2={360} y2={110} /><SwitchIcon x={360} y={120} label="Switch" />
            <APIcon x={150} y={190} label="LAP 1" /><APIcon x={360} y={190} label="LAP 2" /><APIcon x={570} y={190} label="LAP 3" />
            <Line x1={332} y1={128} x2={170} y2={170} /><Line x1={360} y1={132} x2={360} y2={168} /><Line x1={388} y1={128} x2={550} y2={170} />
            <Line x1={150} y1={178} x2={340} y2={64} c="var(--accent)" w={2} dash="5 4" flow /><Line x1={570} y1={178} x2={380} y2={64} c="var(--accent)" w={2} dash="5 4" flow />
            <T x={560} y={44} size={10.5} color="var(--accent)" anchor="start">tuneluri CAPWAP (linii întrerupte)</T>
          </g>
        )}
        {a === 'cloud' && (
          <g>
            <ellipse cx={360} cy={40} rx={120} ry={26} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={2} /><T x={360} y={44} weight={700}>Cloud (dashboard)</T>
            <Line x1={360} y1={66} x2={360} y2={110} c="var(--info)" w={2} dash="5 4" flow />
            <RouterIcon x={360} y={122} label="Router / Internet" />
            <SwitchIcon x={360} y={190} label="" /><Line x1={360} y1={136} x2={360} y2={178} />
            <APIcon x={150} y={210} label="AP 1" /><APIcon x={570} y={210} label="AP 2" />
            <Line x1={332} y1={194} x2={170} y2={194} /><Line x1={388} y1={194} x2={550} y2={194} />
            <T x={600} y={74} size={10.5} color="var(--info)" anchor="start">management ⟶ cloud</T>
            <T x={360} y={256} size={11} color="var(--muted)">Datele clienților rămân local; doar managementul merge în cloud</T>
          </g>
        )}
        {a === 'ewc' && (
          <g>
            <rect x={270} y={14} width={180} height={50} rx={8} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} /><T x={360} y={36} weight={700}>AP-controller</T><T x={360} y={52} size={10} color="var(--muted)">funcție WLC integrată</T>
            <Line x1={360} y1={64} x2={360} y2={110} /><SwitchIcon x={360} y={120} label="Switch" />
            <APIcon x={170} y={200} label="AP" /><APIcon x={360} y={200} label="AP" /><APIcon x={550} y={200} label="AP" />
            <Line x1={332} y1={128} x2={190} y2={180} /><Line x1={360} y1={132} x2={360} y2={178} /><Line x1={388} y1={128} x2={530} y2={180} />
            <ClientIcon x={660} y={150} kind="phone" label="client" />
          </g>
        )}
      </svg>
      <div style={{ marginTop: 6, padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-3)' }}>
        <div><b>{d.title}</b></div>
        <div className="small"><b>Management:</b> {d.mgmt}</div>
        <div className="small"><b>Date:</b> {d.data}</div>
        <div className="small"><b>Plusuri:</b> {d.pro}</div>
        <div className="small"><b>Minusuri:</b> {d.con}</div>
      </div>
    </div>
  );
}

/* 2) Split-MAC: cine face ce */
const SPLIT: { fn: string; side: 'ap' | 'wlc'; d: string }[] = [
  { fn: 'Beacons, probe response', side: 'ap', d: 'Funcții în timp real: AP-ul le face singur, local, ca să respecte temporizarea 802.11.' },
  { fn: 'ACK-uri, retransmisii, cadre RTS/CTS', side: 'ap', d: 'Necesită latență de microsecunde; nu se pot trimite prin rețea la WLC.' },
  { fn: 'Criptare/decriptare cadre (după chei date de WLC)', side: 'ap', d: 'AP-ul aplică cheile; WLC-ul le generează și le distribuie.' },
  { fn: 'Autentificare client, 802.1X/EAP, chei', side: 'wlc', d: 'WLC-ul vorbește cu serverul RADIUS și gestionează stările de client.' },
  { fn: 'Configurația WLAN, QoS, politici', side: 'wlc', d: 'Se definește o singură dată pe WLC și se împinge la toate AP-urile.' },
  { fn: 'RRM (canale, putere), roaming, rogue/IDS', side: 'wlc', d: 'WLC-ul are viziunea de ansamblu a tuturor AP-urilor.' },
];
export function SplitMac() {
  const [i, setI] = useState(0);
  const f = SPLIT[i];
  return (
    <div>
      <Seg value={String(i)} set={(k) => setI(Number(k))} label="Funcție" items={SPLIT.map((s, k) => [String(k), s.fn.split(',')[0].split('(')[0].trim()] as [string, string])} />
      <svg viewBox="0 0 720 150" role="img" aria-label="Împărțirea funcțiilor MAC între AP și WLC">
        <rect x={40} y={20} width={300} height={70} rx={10} fill={f.side === 'ap' ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={f.side === 'ap' ? 'var(--accent)' : 'var(--border)'} strokeWidth={f.side === 'ap' ? 2.6 : 1.4} />
        <T x={190} y={48} weight={700}>Lightweight AP</T><T x={190} y={68} size={10.5} color="var(--muted)">timp real (partea „jos” a MAC)</T>
        <rect x={380} y={20} width={300} height={70} rx={10} fill={f.side === 'wlc' ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={f.side === 'wlc' ? 'var(--accent)' : 'var(--border)'} strokeWidth={f.side === 'wlc' ? 2.6 : 1.4} />
        <T x={530} y={48} weight={700}>WLC</T><T x={530} y={68} size={10.5} color="var(--muted)">management (partea „sus” a MAC)</T>
        <Line x1={340} y1={55} x2={380} y2={55} c="var(--accent)" w={3} />
        <T x={360} y={112} size={11.5} weight={700}>{f.fn}</T>
        <T x={360} y={132} size={10.5} color="var(--text-2)">{f.d.length > 110 ? f.d.slice(0, f.d.lastIndexOf(' ', 110)) + '…' : f.d}</T>
      </svg>
    </div>
  );
}

/* 3) CAPWAP: procesul de join al unui AP */
const JOIN = [
  { t: '1. AP pornește și primește IP', d: 'Prin DHCP (de obicei VLAN-ul de management al AP-urilor). DHCP poate furniza și adresa WLC prin option 43.', x: 'DHCP Discover/Offer' },
  { t: '2. AP descoperă WLC', d: 'Variante: adrese salvate anterior, option 43 din DHCP, DNS (CISCO-CAPWAP-CONTROLLER.domeniu), broadcast local. Rezultă o listă de WLC-uri candidate.', x: 'Discovery Request' },
  { t: '3. WLC răspunde', d: 'Discovery Response către AP; AP-ul alege un WLC (după prioritate, încărcare).', x: 'Discovery Response' },
  { t: '4. DTLS + Join', d: 'Se stabilește tunelul de control criptat DTLS (UDP 5246); AP-ul trimite Join Request, WLC-ul răspunde cu Join Response.', x: 'Join Request / Response' },
  { t: '5. Imagine și configurație', d: 'Dacă versiunea software diferă, AP-ul descarcă imaginea de la WLC și repornește; apoi primește configurația (WLAN-uri, canale, putere).', x: 'Image Data / Config' },
  { t: '6. Run', d: 'AP-ul este în starea „Run”: anunță SSID-urile, servește clienții, trimite keepalive. Tunelul de date (UDP 5247) transportă traficul clienților în modul Local.', x: 'Run · Keepalive' },
];
export function CapwapJoin() {
  const [s, setS] = useState(0);
  const j = JOIN[s];
  return (
    <div>
      <Seg value={String(s)} set={(k) => setS(Number(k))} label="Pas de join" items={JOIN.map((_, i) => [String(i), `Pas ${i + 1}`] as [string, string])} />
      <svg viewBox="0 0 720 190" role="img" aria-label="Procesul prin care un AP lightweight se alătură unui WLC">
        <APIcon x={110} y={60} label="LAP" /><rect x={540} y={36} width={130} height={48} rx={8} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={1.8} /><T x={605} y={65} weight={700}>WLC</T>
        <Line x1={150} y1={60} x2={540} y2={60} c={s >= 3 ? 'var(--ok)' : 'var(--text-2)'} w={s >= 3 ? 3 : 2} dash={s >= 3 ? undefined : '6 5'} flow={s >= 5} />
        <T x={345} y={50} size={11} m color="var(--accent)">{j.x}</T>
        <rect x={30} y={110} width={660} height={68} rx={8} fill="var(--code-bg)" stroke="var(--border)" />
        <T x={44} y={130} anchor="start" size={12} weight={700}>{j.t}</T>
        <T x={44} y={148} anchor="start" size={10.5} color="var(--text-2)">{j.d.length > 120 ? j.d.slice(0, j.d.lastIndexOf(' ', 120)) : j.d}</T>
        {j.d.length > 120 && <T x={44} y={164} anchor="start" size={10.5} color="var(--text-2)">{j.d.slice(j.d.lastIndexOf(' ', 120) + 1)}</T>}
      </svg>
    </div>
  );
}

/* 4) Modurile AP */
type Mode = 'local' | 'flex' | 'monitor' | 'sniffer' | 'rogue' | 'se' | 'bridge';
const MODES: Record<Mode, { name: string; clients: string; data: string; use: string }> = {
  local: { name: 'Local', clients: 'DA, pe banda configurată', data: 'Tunel CAPWAP la WLC (central switching). Scanează periodic alte canale (RRM).', use: 'Modul implicit; AP-ul servește clienți și lucrează cu WLC-ul.' },
  flex: { name: 'FlexConnect', clients: 'DA', data: 'Local switching posibil: traficul iese direct pe portul AP-ului (trunk, VLAN-uri); control prin CAPWAP. Dacă pierde WLC-ul, continuă să servească clienții în standalone.', use: 'Sucursale la distanță, WAN lent sau nesigur.' },
  monitor: { name: 'Monitor', clients: 'NU', data: 'Doar ascultă (IDS/IPS wireless, detecție de rogue, localizare). Nu transmite date clienților.', use: 'Securitate: detectare AP-uri neautorizate și atacuri.' },
  sniffer: { name: 'Sniffer', clients: 'NU', data: 'Captează trafic 802.11 și îl trimite spre un analizor (Wireshark/OmniPeek).', use: 'Depanare avansată a stratului wireless.' },
  rogue: { name: 'Rogue Detector', clients: 'NU', data: 'Ascultă traficul cablat (ARP) ca să afle dacă un AP rogue e conectat la rețea.', use: 'Securitate: corelează MAC-urile rogue cu cele din rețeaua cablată.' },
  se: { name: 'SE-Connect', clients: 'NU', data: 'Analiză de spectru (interferențe non-802.11); trimite datele spre un instrument de spectru.', use: 'Depanarea interferențelor RF.' },
  bridge: { name: 'Bridge / Mesh', clients: 'DA (cu RAP/MAP)', data: 'AP-uri exterioare leagă rețele sau formează mesh prin radio (backhaul wireless).', use: 'Legături punct-la-punct, acoperire exterioară; (Flex+Bridge: variantă combinată).' },
};
export function ApModes() {
  const [m, setM] = useState<Mode>('local');
  const d = MODES[m];
  return (
    <div>
      <Seg value={m} set={setM} label="Modul AP" items={(Object.keys(MODES) as Mode[]).map((k) => [k, MODES[k].name] as [Mode, string])} />
      <svg viewBox="0 0 720 200" role="img" aria-label="Modul AP ales: servește clienți și calea datelor">
        <APIcon x={130} y={70} label={d.name} />
        <rect x={500} y={44} width={120} height={46} rx={8} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={1.8} /><T x={560} y={72} weight={700}>WLC</T>
        <Line x1={170} y1={70} x2={500} y2={70} c={m === 'flex' ? 'var(--info)' : 'var(--accent)'} w={2.5} dash="6 5" flow />
        <T x={335} y={60} size={10.5} m color="var(--accent)">CAPWAP</T>
        <ClientIcon x={130} y={150} kind="laptop" label={d.clients.startsWith('DA') ? 'clienți: DA' : 'clienți: NU'} />
        {d.clients.startsWith('DA') && <path d="M130 100 L130 130" stroke="var(--ok)" strokeWidth={2} strokeDasharray="3 4" />}
        <T x={260} y={120} anchor="start" size={11} weight={700} color="var(--text)">{`Clienți: ${d.clients}`}</T>
        <T x={260} y={140} anchor="start" size={10.5} color="var(--text-2)">{d.data.length > 100 ? d.data.slice(0, d.data.lastIndexOf(' ', 100)) : d.data}</T>
        <T x={260} y={158} anchor="start" size={10.5} color="var(--text-2)">{d.data.length > 100 ? d.data.slice(d.data.lastIndexOf(' ', 100) + 1) : ''}</T>
        <T x={260} y={184} anchor="start" size={10.5} color="var(--accent)">{`Utilizare: ${d.use.length > 90 ? d.use.slice(0, d.use.lastIndexOf(' ', 90)) + '…' : d.use}`}</T>
      </svg>
    </div>
  );
}

/* 5) Topologii laborator */
export function LabGuidedTopology26() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Topologie lab 2.6: WLC, switch, AP lightweight și client">
      <rect x={290} y={20} width={140} height={46} rx={8} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} /><T x={360} y={48} weight={700}>WLC</T>
      <Line x1={360} y1={66} x2={360} y2={104} /><SwitchIcon x={360} y={116} label="SW1" />
      <Line x1={332} y1={122} x2={170} y2={170} /><APIcon x={150} y={176} label="LAP1" />
      <Line x1={388} y1={122} x2={550} y2={170} /><ClientIcon x={550} y={176} kind="pc" label="Server DHCP" />
      <ClientIcon x={150} y={240} kind="laptop" />
      <T x={430} y={44} anchor="start" size={10} m color="var(--muted)">192.168.100.10 · VLAN 100</T>
      <T x={440} y={110} anchor="start" size={10} m color="var(--muted)">SW1: trunk spre WLC, access spre AP</T>
    </svg>
  );
}
export function LabSoloTopology26() {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-label="Topologie lab solo 2.6: planificare de arhitectură pentru trei locații">
      <rect x={30} y={20} width={200} height={160} rx={10} fill="none" stroke="var(--border)" strokeDasharray="4 4" /><T x={130} y={40} weight={700}>Sediu central</T><T x={130} y={60} size={10.5} color="var(--muted)">200 AP · WLC redundant</T>
      <rect x={260} y={20} width={200} height={160} rx={10} fill="none" stroke="var(--border)" strokeDasharray="4 4" /><T x={360} y={40} weight={700}>Sucursală (WAN lent)</T><T x={360} y={60} size={10.5} color="var(--muted)">8 AP · fără WLC local</T>
      <rect x={490} y={20} width={200} height={160} rx={10} fill="none" stroke="var(--border)" strokeDasharray="4 4" /><T x={590} y={40} weight={700}>Magazin mic</T><T x={590} y={60} size={10.5} color="var(--muted)">2 AP · fără IT local</T>
      <T x={360} y={206} size={11} color="var(--muted)">Alege arhitectura și modul AP potrivite pentru fiecare locație</T>
    </svg>
  );
}
