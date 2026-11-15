import { useState } from 'react';
import { APIcon, ClientIcon, SwitchIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 2.7 (conexiuni fizice WLAN: AP, WLC, access/trunk, LAG). Culori doar prin var(--…). */

/* 1) Panoul unui WLC: porturi clicabile */
type P = 'console' | 'service' | 'redundancy' | 'ds';
const PORTS: Record<P, { name: string; role: string; sw: string }> = {
  console: { name: 'Console port', role: 'Acces CLI local, cablu console (RJ-45 sau USB); configurare inițială și recuperare.', sw: 'Nu se leagă la switch (conexiune directă cu un PC/terminal).' },
  service: { name: 'Service port', role: 'Management out-of-band (OOB): acces la WLC chiar dacă porturile de date sau rețeaua de producție au probleme; interfață separată.', sw: 'Port de switch în modul ACCESS, într-un VLAN de management OOB (nu trunk).' },
  redundancy: { name: 'Redundancy port (RP)', role: 'Leagă două WLC-uri într-o pereche de înaltă disponibilitate (HA SSO) pentru sincronizare de stare și configurație.', sw: 'Cablu direct între cele două WLC-uri (sau prin rețea dedicată), nu spre rețeaua de producție.' },
  ds: { name: 'Distribution system ports (data)', role: 'Poartă traficul de date: tunelurile CAPWAP de la AP-uri și traficul clienților, plus managementul în-band.', sw: 'Port de switch în modul TRUNK 802.1Q (VLAN management + VLAN-urile clienților); pot forma un LAG.' },
};
export function WlcPorts() {
  const [p, setP] = useState<P>('ds');
  const d = PORTS[p];
  const box = (k: P, x: number, w: number, label: string, sub: string) => (
    <g key={k} style={{ cursor: 'pointer' }} onClick={() => setP(k)} role="button" tabIndex={0} aria-label={PORTS[k].name} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setP(k); }}>
      <rect x={x} y={40} width={w} height={46} rx={6} fill={p === k ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={p === k ? 'var(--accent)' : 'var(--border)'} strokeWidth={p === k ? 2.6 : 1.4} />
      <T x={x + w / 2} y={60} size={11} weight={700}>{label}</T>
      <T x={x + w / 2} y={76} size={9.5} color="var(--muted)">{sub}</T>
    </g>
  );
  return (
    <svg viewBox="0 0 720 220" role="img" aria-label="Panoul unui WLC cu porturile principale">
      <rect x={20} y={20} width={680} height={86} rx={10} fill="var(--code-bg)" stroke="var(--border)" />
      {box('console', 36, 110, 'Console', 'RJ-45/USB')}
      {box('service', 160, 130, 'Service port', 'OOB mgmt')}
      {box('redundancy', 304, 130, 'Redundancy port', 'HA pair')}
      {box('ds', 448, 236, 'Distribution system ports 1…N', 'date · trunk · LAG')}
      <rect x={20} y={126} width={680} height={84} rx={9} fill="var(--surface-3)" stroke="var(--accent)" />
      <T x={34} y={148} anchor="start" size={12} weight={700} color="var(--accent)">{d.name}</T>
      <T x={34} y={168} anchor="start" size={10.5} color="var(--text-2)">{d.role.length > 118 ? d.role.slice(0, d.role.lastIndexOf(' ', 118)) : d.role}</T>
      {d.role.length > 118 && <T x={34} y={184} anchor="start" size={10.5} color="var(--text-2)">{d.role.slice(d.role.lastIndexOf(' ', 118) + 1)}</T>}
      <T x={34} y={202} anchor="start" size={10.5}>{`Switch: ${d.sw.length > 105 ? d.sw.slice(0, d.sw.lastIndexOf(' ', 105)) + '…' : d.sw}`}</T>
    </svg>
  );
}

/* 2) Mapare: WLAN → interfață dinamică → VLAN → trunk → switch */
type W = 'emp' | 'guest' | 'voice';
const WL: Record<W, { ssid: string; iface: string; vlan: number; col: string; sub: string }> = {
  emp: { ssid: 'CORP', iface: 'employee', vlan: 10, col: 'var(--accent)', sub: '10.10.10.0/24' },
  guest: { ssid: 'GUEST', iface: 'guest', vlan: 30, col: 'var(--violet)', sub: '10.10.30.0/24' },
  voice: { ssid: 'VOICE', iface: 'voice', vlan: 20, col: 'var(--ok)', sub: '10.10.20.0/24' },
};
export function WlanToVlan() {
  const [w, setW] = useState<W>('emp');
  const d = WL[w];
  return (
    <div>
      <Seg value={w} set={setW} label="WLAN" items={[['emp', 'SSID CORP'], ['voice', 'SSID VOICE'], ['guest', 'SSID GUEST']]} />
      <svg viewBox="0 0 720 220" role="img" aria-label="Maparea unui SSID la o interfață dinamică, un VLAN și portul trunk al WLC-ului">
        <ClientIcon x={60} y={90} kind="laptop" label="client" />
        <T x={120} y={46} size={10.5} color="var(--muted)" anchor="start">WLAN</T>
        <rect x={110} y={56} width={110} height={44} rx={8} fill="var(--surface-3)" stroke={d.col} strokeWidth={2} /><T x={165} y={83} weight={700}>{`SSID ${d.ssid}`}</T>
        <Line x1={220} y1={78} x2={260} y2={78} c={d.col} w={2.5} />
        <T x={260} y={46} size={10.5} color="var(--muted)" anchor="start">Interfață dinamică</T>
        <rect x={250} y={56} width={130} height={44} rx={8} fill="var(--surface-3)" stroke={d.col} strokeWidth={2} /><T x={315} y={76} weight={700}>{d.iface}</T><T x={315} y={92} size={10} m color="var(--muted)">{`VLAN ${d.vlan}`}</T>
        <Line x1={380} y1={78} x2={420} y2={78} c={d.col} w={2.5} />
        <T x={420} y={46} size={10.5} color="var(--muted)" anchor="start">Port DS (trunk)</T>
        <rect x={410} y={56} width={130} height={44} rx={8} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={2} /><T x={475} y={76} weight={700}>trunk 802.1Q</T><T x={475} y={92} size={10} m color={d.col}>{`tag VLAN ${d.vlan}`}</T>
        <Line x1={540} y1={78} x2={580} y2={78} c={d.col} w={2.5} />
        <SwitchIcon x={625} y={78} label="Switch" />
        <rect x={40} y={130} width={640} height={72} rx={8} fill="var(--code-bg)" stroke="var(--border)" />
        <T x={54} y={152} anchor="start" size={11} weight={700}>{`Clientul din SSID ${d.ssid} primește adresă din ${d.sub} (VLAN ${d.vlan})`}</T>
        <T x={54} y={170} anchor="start" size={10.5} color="var(--text-2)">Dacă VLAN-ul {d.vlan} nu este permis pe trunk-ul dintre WLC și switch (sau nu există pe switch), clientul se asociază, dar nu primește IP.</T>
        <T x={54} y={188} anchor="start" size={10.5} color="var(--text-2)">În modul Local, AP-ul nu vede VLAN-ul clientului: tot traficul clienților merge în CAPWAP, iar WLC-ul îl pune pe VLAN.</T>
      </svg>
    </div>
  );
}

/* 3) Conexiunea fizică AP–switch–WLC, în funcție de mod și de LAG */
type View = 'local' | 'flex' | 'lag';
export function Wiring() {
  const [v, setV] = useState<View>('local');
  const lag = v === 'lag';
  return (
    <div>
      <Seg value={v} set={setV} label="Scenariu de cablare" items={[['local', 'AP în modul Local'], ['flex', 'AP FlexConnect'], ['lag', 'WLC cu LAG']]} />
      <svg viewBox="0 0 720 270" role="img" aria-label="Cablarea AP-ului și WLC-ului la switch, cu tipul de port">
        <SwitchIcon x={360} y={130} label="" /><T x={360} y={96} weight={700}>Switch</T>
        {/* AP */}
        <APIcon x={110} y={190} label={v === 'flex' ? 'AP (FlexConnect)' : 'AP (Local)'} />
        <Line x1={136} y1={178} x2={332} y2={140} c={v === 'flex' ? 'var(--info)' : 'var(--ok)'} w={3} />
        <T x={190} y={138} size={10.5} weight={700} color={v === 'flex' ? 'var(--info)' : 'var(--ok)'} anchor="start">{v === 'flex' ? 'TRUNK (VLAN mgmt nativ + VLAN clienți)' : 'ACCESS (VLAN de management AP)'}</T>
        <T x={190} y={152} size={9.5} color="var(--muted)" anchor="start">PoE de la switch</T>
        {/* WLC */}
        <rect x={510} y={60} width={160} height={110} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} /><T x={590} y={84} weight={700}>WLC</T>
        <T x={590} y={100} size={10} color="var(--muted)">distribution system ports</T>
        {lag ? (
          <g>
            <rect x={400} y={118} width={100} height={36} rx={18} fill="none" stroke="var(--accent)" strokeDasharray="5 4" />
            <Line x1={388} y1={122} x2={510} y2={110} c="var(--info)" w={3} flow /><Line x1={388} y1={130} x2={510} y2={126} c="var(--info)" w={3} flow />
            <Line x1={388} y1={138} x2={510} y2={142} c="var(--info)" w={3} flow /><Line x1={388} y1={146} x2={510} y2={158} c="var(--info)" w={3} flow />
            <T x={450} y={176} size={10.5} weight={700} color="var(--accent)">LAG: 4 porturi = 1 link logic</T>
            <T x={450} y={190} size={10} color="var(--muted)">trunk 802.1Q pe port-channel</T>
          </g>
        ) : (
          <g>
            <Line x1={388} y1={130} x2={510} y2={130} c="var(--info)" w={3} />
            <T x={450} y={122} size={10.5} weight={700} color="var(--info)">TRUNK 802.1Q</T>
            <T x={450} y={146} size={9.5} color="var(--muted)">VLAN mgmt + VLAN clienți</T>
          </g>
        )}
        {/* service port */}
        <Line x1={590} y1={170} x2={590} y2={214} c="var(--warn)" w={2} dash="5 4" />
        <rect x={540} y={214} width={100} height={30} rx={6} fill="var(--surface-3)" stroke="var(--warn)" /><T x={590} y={233} size={10.5}>Service port</T>
        <T x={660} y={229} size={9.5} anchor="start" color="var(--muted)">access OOB</T>
        <T x={360} y={262} size={10.5} color="var(--muted)">{lag ? 'LAG pe WLC AireOS: doar mod „on” pe switch (fără LACP/PAgP); după activare se repornește WLC-ul.' : v === 'flex' ? 'Flex cu local switching: VLAN-urile clienților sunt etichetate pe trunk-ul AP-ului.' : 'Local: un singur VLAN pe port (management AP); datele clienților merg în CAPWAP.'}</T>
      </svg>
    </div>
  );
}

/* 4) Topologii laborator */
export function LabGuidedTopology27() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Topologie lab 2.7: WLC cu trunk, AP pe port access, service port pe un VLAN separat">
      <rect x={290} y={20} width={150} height={46} rx={8} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} /><T x={365} y={48} weight={700}>WLC</T>
      <Line x1={365} y1={66} x2={365} y2={104} c="var(--info)" w={3} /><SwitchIcon x={365} y={118} label="SW1" />
      <T x={376} y={90} anchor="start" size={10} m color="var(--info)">Gi0/1 trunk (10,20,100)</T>
      <Line x1={335} y1={126} x2={170} y2={176} /><APIcon x={150} y={182} label="LAP1" /><T x={190} y={150} size={10} m color="var(--ok)" anchor="start">Fa0/2 access VLAN 100</T>
      <Line x1={395} y1={126} x2={560} y2={176} /><ClientIcon x={560} y={182} kind="pc" label="PC admin" /><T x={470} y={150} size={10} m color="var(--warn)" anchor="start">Fa0/3 access VLAN 99 (OOB)</T>
    </svg>
  );
}
export function LabSoloTopology27() {
  return (
    <svg viewBox="0 0 720 240" role="img" aria-label="Topologie lab solo 2.7: LAG de patru porturi între WLC și switch, AP FlexConnect">
      <rect x={30} y={30} width={150} height={100} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} /><T x={105} y={56} weight={700}>WLC</T><T x={105} y={74} size={10} color="var(--muted)">porturi 1–4 · LAG</T>
      <SwitchIcon x={360} y={80} label="SW-D" />
      <Line x1={180} y1={60} x2={328} y2={72} c="var(--info)" w={3} /><Line x1={180} y1={74} x2={328} y2={78} c="var(--info)" w={3} /><Line x1={180} y1={88} x2={328} y2={84} c="var(--info)" w={3} /><Line x1={180} y1={102} x2={328} y2={90} c="var(--info)" w={3} />
      <Line x1={392} y1={80} x2={580} y2={80} c="var(--info)" w={3} /><APIcon x={600} y={80} label="AP-Flex" />
      <T x={360} y={200} size={11} color="var(--muted)">Cerință: LAG pe WLC, trunk pe port-channel; port trunk pe AP FlexConnect cu VLAN 100 nativ</T>
    </svg>
  );
}
