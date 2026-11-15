import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, PhoneIcon, Seg, T, VCOL } from './l2kit';

/* Diagrame originale pentru 2.1 (VLAN-uri, access ports, default VLAN, inter-VLAN). */

/* 1) Domenii de broadcast: fără VLAN vs cu VLAN. Click pe un PC = el trimite un broadcast. */
export function VlanBroadcast() {
  const [on, setOn] = useState(true);
  const [src, setSrc] = useState(0);
  const pcs = [
    { n: 'PC1', port: 'Fa0/1', v: 10 }, { n: 'PC2', port: 'Fa0/2', v: 10 }, { n: 'PC3', port: 'Fa0/3', v: 20 },
    { n: 'PC4', port: 'Fa0/4', v: 20 }, { n: 'PC5', port: 'Fa0/5', v: 10 }, { n: 'PC6', port: 'Fa0/6', v: 20 },
  ];
  const xs = [70, 190, 310, 430, 550, 660];
  const gets = (i: number) => i !== src && (!on || pcs[i].v === pcs[src].v);
  const n = pcs.filter((_, i) => gets(i)).length;
  return (
    <div>
      <Seg value={on ? 'v' : 'n'} set={(k) => setOn(k === 'v')} label="Mod" items={[['n', 'Fără VLAN-uri (VLAN 1 peste tot)'], ['v', 'Cu VLAN 10 și VLAN 20']]} />
      <svg viewBox="0 0 720 270" role="img" aria-label="Broadcast într-un switch cu și fără VLAN-uri">
        <SwitchIcon x={360} y={44} label="" />
        <T x={360} y={18} weight={700}>SW1</T>
        {pcs.map((p, i) => {
          const col = on ? VCOL[p.v] : VCOL[1];
          const rx = gets(i);
          const isSrc = i === src;
          return (
            <g key={p.n} style={{ cursor: 'pointer' }} onClick={() => setSrc(i)} role="button" tabIndex={0} aria-label={`${p.n} trimite broadcast`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSrc(i); }}>
              <Line x1={360 + (xs[i] - 360) * 0.08} y1={56} x2={xs[i]} y2={150} c={isSrc ? 'var(--warn)' : rx ? col : 'var(--border)'} w={rx || isSrc ? 3 : 1.5} dash={rx || isSrc ? undefined : '4 4'} />
              <T x={(360 + xs[i]) / 2 + (xs[i] < 360 ? -16 : 16)} y={104} size={9.5} m color="var(--muted)">{p.port}</T>
              <rect x={xs[i] - 36} y={146} width={72} height={64} rx={9} fill="var(--surface-3)" stroke={isSrc ? 'var(--warn)' : rx ? col : 'var(--border)'} strokeWidth={isSrc || rx ? 2.2 : 1.2} />
              <ClientIcon x={xs[i]} y={170} kind="pc" />
              <T x={xs[i]} y={200} weight={650} size={11}>{p.n}</T>
              <T x={xs[i]} y={226} size={10.5} m color={col}>{on ? `VLAN ${p.v}` : 'VLAN 1'}</T>
              <T x={xs[i]} y={240} size={10} color={isSrc ? 'var(--warn)' : rx ? 'var(--ok)' : 'var(--muted)'}>{isSrc ? 'trimite' : rx ? 'primește' : 'nu primește'}</T>
            </g>
          );
        })}
        <T x={360} y={262} size={11} color="var(--muted)">{`Click pe un PC: ${pcs[src].n} trimite un broadcast → îl primesc ${n} din 5 stații`}</T>
      </svg>
    </div>
  );
}

/* 2) Port access cu telefon IP: două VLAN-uri pe același cablu */
export function VoicePort() {
  return (
    <svg viewBox="0 0 720 250" role="img" aria-label="Port de acces cu VLAN de date și VLAN de voce pe același cablu">
      <SwitchIcon x={110} y={90} label="" />
      <T x={110} y={60} weight={700}>SW1</T>
      <T x={110} y={125} size={10.5} m color="var(--muted)">Fa0/3</T>
      <Line x1={142} y1={90} x2={318} y2={90} c="var(--text-2)" w={3} />
      <PhoneIcon x={350} y={90} label="Telefon IP" />
      <Line x1={382} y1={90} x2={558} y2={90} c="var(--text-2)" w={3} />
      <ClientIcon x={590} y={90} kind="pc" label="PC" />
      <T x={230} y={72} size={10.5} color="var(--warn)" weight={650}>VLAN 20 (voce) cu tag 802.1Q</T>
      <T x={230} y={110} size={10.5} color="var(--accent)" weight={650}>VLAN 10 (date) fără tag</T>
      <T x={470} y={72} size={10.5} color="var(--accent)" weight={650}>VLAN 10 fără tag</T>
      <T x={470} y={110} size={10.5} color="var(--muted)">(PC-ul nu știe de VLAN-uri)</T>
      <rect x={60} y={150} width={600} height={80} rx={9} fill="var(--code-bg)" stroke="var(--border)" />
      <T x={78} y={172} anchor="start" size={11} m color="var(--text-2)">interface FastEthernet0/3</T>
      <T x={78} y={190} anchor="start" size={11} m color="var(--text)">{' switchport mode access'}</T>
      <T x={78} y={207} anchor="start" size={11} m color="var(--accent)">{' switchport access vlan 10'}</T>
      <T x={78} y={224} anchor="start" size={11} m color="var(--warn)">{' switchport voice vlan 20'}</T>
      <T x={650} y={190} anchor="end" size={10.5} color="var(--muted)">Telefonul află VLAN-ul de voce prin CDP / LLDP-MED</T>
    </svg>
  );
}

/* 3) Cele trei metode de inter-VLAN routing */
export function InterVlanMethods() {
  const [m, setM] = useState<'legacy' | 'roas' | 'svi'>('roas');
  return (
    <div>
      <Seg value={m} set={setM} label="Metoda" items={[['legacy', 'Un port de router per VLAN (vechi)'], ['roas', 'Router-on-a-stick'], ['svi', 'Switch L3 + SVI']]} />
      <svg viewBox="0 0 720 290" role="img" aria-label="Metode de inter-VLAN routing">
        {m === 'legacy' && (
          <g>
            <RouterIcon x={360} y={50} label="" /><T x={360} y={24} weight={700}>R1</T>
            <SwitchIcon x={360} y={170} label="" /><T x={360} y={204} weight={700}>SW1</T>
            <Line x1={332} y1={58} x2={332} y2={158} c={VCOL[10]} w={3} /><Line x1={388} y1={58} x2={388} y2={158} c={VCOL[20]} w={3} />
            <T x={322} y={110} anchor="end" size={10.5} m color={VCOL[10]}>Gi0/0 · 192.168.10.1 · VLAN 10</T>
            <T x={398} y={110} anchor="start" size={10.5} m color={VCOL[20]}>Gi0/1 · 192.168.20.1 · VLAN 20</T>
            <T x={360} y={250} size={11} color="var(--muted)">2 VLAN-uri = 2 porturi pe router + 2 porturi pe switch + 2 cabluri. Nu scalează (10 VLAN-uri = 10 cabluri).</T>
          </g>
        )}
        {m === 'roas' && (
          <g>
            <RouterIcon x={360} y={50} label="" /><T x={360} y={24} weight={700}>R1</T>
            <SwitchIcon x={360} y={170} label="" /><T x={360} y={204} weight={700}>SW1</T>
            <Line x1={360} y1={64} x2={360} y2={158} c="var(--warn)" w={4} />
            <T x={372} y={96} anchor="start" size={10.5} m color="var(--warn)">Gi0/0 fizic: fără IP · trunk 802.1Q</T>
            <T x={372} y={112} anchor="start" size={10.5} m color={VCOL[10]}>Gi0/0.10 · encapsulation dot1Q 10 · 192.168.10.1</T>
            <T x={372} y={128} anchor="start" size={10.5} m color={VCOL[20]}>Gi0/0.20 · encapsulation dot1Q 20 · 192.168.20.1</T>
            <ClientIcon x={190} y={236} kind="pc" label="VLAN 10" /><ClientIcon x={530} y={236} kind="pc" label="VLAN 20" />
            <Line x1={332} y1={176} x2={200} y2={226} c={VCOL[10]} /><Line x1={388} y1={176} x2={520} y2={226} c={VCOL[20]} />
            <T x={360} y={282} size={11} color="var(--muted)">Un singur cablu poartă ambele VLAN-uri etichetate; routerul „se întoarce” pe același link (de unde „on a stick”).</T>
          </g>
        )}
        {m === 'svi' && (
          <g>
            <rect x={230} y={30} width={260} height={110} rx={10} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.8} />
            <T x={360} y={52} weight={700}>Switch multilayer (L3)</T>
            <Box x={248} y={64} w={104} h={34} label="SVI VLAN 10" sub="192.168.10.1" c={VCOL[10]} />
            <Box x={368} y={64} w={104} h={34} label="SVI VLAN 20" sub="192.168.20.1" c={VCOL[20]} />
            <T x={360} y={122} size={10.5} m color="var(--info)">ip routing · rutare în hardware, fără cablu extern</T>
            <Line x1={300} y1={140} x2={190} y2={216} c={VCOL[10]} /><Line x1={420} y1={140} x2={530} y2={216} c={VCOL[20]} />
            <ClientIcon x={190} y={232} kind="pc" label="PC · VLAN 10 · GW .10.1" /><ClientIcon x={530} y={232} kind="pc" label="PC · VLAN 20 · GW .20.1" />
            <T x={360} y={282} size={11} color="var(--muted)">Cea mai folosită soluție în rețele de campus: rapidă, fără „stick” care să devină gât de sticlă.</T>
          </g>
        )}
      </svg>
    </div>
  );
}

/* 4) Starea implicită: toate porturile în VLAN 1; best practice */
export function DefaultVlanPorts() {
  const [fix, setFix] = useState(false);
  const ports = Array.from({ length: 12 }, (_, i) => i + 1);
  const vOf = (p: number) => (!fix ? 1 : p <= 4 ? 10 : p <= 8 ? 20 : 999);
  const col = (v: number) => (v === 1 ? 'var(--muted)' : v === 999 ? 'var(--bad)' : VCOL[v]);
  return (
    <div>
      <Seg value={fix ? 'f' : 'd'} set={(k) => setFix(k === 'f')} label="Stare" items={[['d', 'Din fabrică (default)'], ['f', 'După hardening']]} />
      <svg viewBox="0 0 720 190" role="img" aria-label="Porturile unui switch în VLAN 1 față de VLAN-uri dedicate">
        <rect x={30} y={30} width={660} height={70} rx={10} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.6} />
        {ports.map((p, i) => {
          const v = vOf(p);
          return (
            <g key={p}>
              <rect x={50 + i * 53} y={46} width={40} height={30} rx={4} fill="var(--code-bg)" stroke={col(v)} strokeWidth={2} />
              <T x={70 + i * 53} y={65} size={10} m>{`Fa0/${p}`}</T>
              <T x={70 + i * 53} y={92} size={9.5} m color={col(v)}>{String(v)}</T>
            </g>
          );
        })}
        <T x={360} y={20} weight={700}>SW1 — VLAN-ul fiecărui port</T>
        <T x={360} y={130} size={11.5} color="var(--text-2)">{fix ? 'Fa0/1–4 → VLAN 10 · Fa0/5–8 → VLAN 20 · Fa0/9–12 → VLAN 999 „parcare”, shutdown' : 'Toate porturile sunt în VLAN 1: un singur domeniu de broadcast, fără separare'}</T>
        <T x={360} y={152} size={11} color="var(--muted)">{fix ? 'VLAN 1 rămâne, dar nu mai transportă trafic de utilizatori.' : 'VLAN 1 nu poate fi șters sau redenumit; nu e „defect”, e doar punctul de plecare.'}</T>
      </svg>
    </div>
  );
}

/* 5) Topologii laborator */
function PcAt({ x, y, n, ip, c }: { x: number; y: number; n: string; ip: string; c: string }) {
  return (<g><ClientIcon x={x} y={y} kind="pc" /><T x={x} y={y + 24} weight={650} size={11}>{n}</T><T x={x} y={y + 38} size={9.5} m color={c}>{ip}</T></g>);
}
export function LabGuidedTopology21() {
  return (
    <svg viewBox="0 0 720 330" role="img" aria-label="Topologie lab ghidat 2.1: router-on-a-stick și două switch-uri">
      <RouterIcon x={360} y={36} label="" /><T x={360} y={14} weight={700}>R1 (2911)</T>
      <Line x1={340} y1={48} x2={190} y2={140} c="var(--warn)" w={3} />
      <T x={250} y={86} size={10} m anchor="end" color="var(--warn)">Gi0/0 ⟷ Fa0/24 (trunk)</T>
      <SwitchIcon x={190} y={152} label="" /><T x={190} y={190} weight={700}>SW1 (2960)</T>
      <SwitchIcon x={530} y={152} label="" /><T x={530} y={190} weight={700}>SW2 (2960)</T>
      <Line x1={222} y1={152} x2={498} y2={152} c="var(--warn)" w={3} />
      <T x={360} y={144} size={10} m color="var(--warn)">Gi0/1 ⟷ Gi0/1 (trunk)</T>
      <Line x1={170} y1={164} x2={90} y2={236} c={VCOL[10]} /><Line x1={210} y1={164} x2={290} y2={236} c={VCOL[20]} />
      <Line x1={510} y1={164} x2={430} y2={236} c={VCOL[10]} /><Line x1={550} y1={164} x2={630} y2={236} c={VCOL[20]} />
      <PcAt x={90} y={252} n="PC1 · Fa0/1" ip="192.168.10.11 · V10" c={VCOL[10]} /><PcAt x={290} y={252} n="PC2 · Fa0/2" ip="192.168.20.11 · V20" c={VCOL[20]} />
      <PcAt x={430} y={252} n="PC3 · Fa0/1" ip="192.168.10.12 · V10" c={VCOL[10]} /><PcAt x={630} y={252} n="PC4 · Fa0/2" ip="192.168.20.12 · V20" c={VCOL[20]} />
      <T x={360} y={322} size={11} color="var(--muted)">VLAN 10 = 192.168.10.0/24 (GW .1) · VLAN 20 = 192.168.20.0/24 (GW .1)</T>
    </svg>
  );
}
export function LabSoloTopology21() {
  return (
    <svg viewBox="0 0 720 330" role="img" aria-label="Topologie lab solo 2.1: switch L3 cu SVI, switch de acces, telefon IP">
      <SwitchIcon x={360} y={44} label="" /><T x={360} y={18} weight={700}>MLS1 (3560 — L3)</T>
      <Line x1={332} y1={50} x2={190} y2={140} c="var(--warn)" w={3} />
      <T x={236} y={86} size={10} m anchor="end" color="var(--warn)">Gi0/1 ⟷ Gi0/1 (trunk)</T>
      <SwitchIcon x={190} y={152} label="" /><T x={190} y={190} weight={700}>SW-A (2960)</T>
      <Line x1={388} y1={50} x2={540} y2={140} c={VCOL[30]} />
      <T x={470} y={86} size={10} m anchor="start" color={VCOL[30]}>Fa0/5 · acces V30</T>
      <PcAt x={540} y={156} n="H3" ip="172.16.30.13 · V30" c={VCOL[30]} />
      <Line x1={160} y1={164} x2={80} y2={236} c={VCOL[10]} /><Line x1={190} y1={164} x2={190} y2={236} c={VCOL[20]} />
      <PcAt x={80} y={252} n="H1 · Fa0/1" ip="172.16.10.11 · V10" c={VCOL[10]} /><PcAt x={190} y={252} n="H2 · Fa0/2" ip="172.16.20.12 · V20" c={VCOL[20]} />
      <Line x1={220} y1={164} x2={300} y2={228} c="var(--text-2)" />
      <PhoneIcon x={320} y={246} label="Telefon · Fa0/3" /><T x={320} y={282} size={9.5} m color={VCOL[40]}>voice V40</T>
      <Line x1={344} y1={246} x2={420} y2={246} c="var(--text-2)" />
      <PcAt x={450} y={252} n="H4 (după telefon)" ip="172.16.10.14 · V10" c={VCOL[10]} />
      <T x={360} y={322} size={11} color="var(--muted)">SVI-uri pe MLS1 · 172.16.10.0/24, .20.0/24, .30.0/24 (GW .1) · VLAN 40 doar pentru voce</T>
    </svg>
  );
}
