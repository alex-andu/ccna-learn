import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Line, PhoneIcon, Seg, T } from './l2kit';

/* Diagrame originale pentru 2.3 (CDP și LLDP). Culori doar prin var(--…). */

type Dev = 'R1' | 'SW1' | 'SW2' | 'IP-PHONE';
type Row = { id: string; local: string; hold: number; cap: string; plat: string; port: string };

const CDP: Record<Dev, Row[]> = {
  R1: [{ id: 'SW1', local: 'Gig 0/0', hold: 162, cap: 'S I', plat: 'WS-C2960', port: 'Fas 0/24' }],
  SW1: [
    { id: 'R1', local: 'Fas 0/24', hold: 150, cap: 'R B', plat: 'ISR4331', port: 'Gig 0/0' },
    { id: 'SW2', local: 'Gig 0/1', hold: 171, cap: 'S I', plat: 'WS-C2960', port: 'Gig 0/1' },
  ],
  SW2: [
    { id: 'SW1', local: 'Gig 0/1', hold: 158, cap: 'S I', plat: 'WS-C2960', port: 'Gig 0/1' },
    { id: 'IP-PHONE', local: 'Fas 0/5', hold: 134, cap: 'H P', plat: 'IP Phone', port: 'Port 1' },
  ],
  'IP-PHONE': [{ id: 'SW2', local: 'Port 1', hold: 160, cap: 'S I', plat: 'WS-C2960', port: 'Fas 0/5' }],
};

/* 1) Tabela de vecini: vezi doar vecinii DIRECȚI */
export function NeighborScope() {
  const [dev, setDev] = useState<Dev>('SW1');
  const [proto, setProto] = useState<'cdp' | 'lldp'>('cdp');
  const pos: Record<Dev, [number, number]> = { R1: [90, 70], SW1: [260, 70], SW2: [440, 70], 'IP-PHONE': [620, 70] };
  const rows = CDP[dev];
  const direct = new Set(rows.map((r) => r.id));
  const icon = (d: Dev) => {
    const [x, y] = pos[d];
    const on = d === dev;
    const nb = direct.has(d);
    return (
      <g key={d} style={{ cursor: 'pointer' }} onClick={() => setDev(d)} role="button" tabIndex={0} aria-label={`Vezi vecinii lui ${d}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDev(d); }}>
        <rect x={x - 46} y={y - 36} width={92} height={90} rx={10} fill={on ? 'var(--accent-soft)' : 'transparent'} stroke={on ? 'var(--accent)' : nb ? 'var(--ok)' : 'var(--border)'} strokeWidth={on ? 2.4 : nb ? 2 : 1} strokeDasharray={on || nb ? undefined : '4 4'} />
        {d === 'R1' ? <RouterIcon x={x} y={y} /> : d === 'IP-PHONE' ? <PhoneIcon x={x} y={y} /> : <SwitchIcon x={x} y={y} />}
        <T x={x} y={y + 38} weight={700} size={11.5}>{d}</T>
      </g>
    );
  };
  return (
    <div>
      <Seg value={proto} set={setProto} label="Protocol" items={[['cdp', 'CDP (show cdp neighbors)'], ['lldp', 'LLDP (show lldp neighbors)']]} />
      <svg viewBox="0 0 720 300" role="img" aria-label="Tabela de vecini CDP/LLDP: doar vecinii direcți">
        <Line x1={136} y1={70} x2={214} y2={70} /><Line x1={306} y1={70} x2={394} y2={70} /><Line x1={486} y1={70} x2={574} y2={70} />
        <T x={175} y={62} size={9.5} m color="var(--muted)">Fa0/24</T><T x={350} y={62} size={9.5} m color="var(--muted)">Gi0/1</T><T x={530} y={62} size={9.5} m color="var(--muted)">Fa0/5</T>
        {(['R1', 'SW1', 'SW2', 'IP-PHONE'] as Dev[]).map(icon)}
        <T x={360} y={142} size={11} color="var(--muted)">{`Click pe un dispozitiv: ${dev} vede (verde) doar vecinii conectați DIRECT. Cadrele de descoperire nu sunt retransmise mai departe.`}</T>
        <rect x={30} y={156} width={660} height={128} rx={9} fill="var(--code-bg)" stroke="var(--border)" />
        <T x={44} y={176} anchor="start" size={11} m color="var(--text-2)">{`${dev}# show ${proto} neighbors`}</T>
        <T x={44} y={194} anchor="start" size={10.5} m color="var(--muted)">{proto === 'cdp' ? 'Device ID    Local Intrfce  Holdtme  Capability  Platform    Port ID' : 'Device ID    Local Intf    Hold-time  Capability  Port ID'}</T>
        {rows.map((r, i) => (
          <T key={r.id} x={44} y={214 + i * 18} anchor="start" size={10.5} m>
            {proto === 'cdp'
              ? `${r.id.padEnd(12)} ${r.local.padEnd(14)} ${String(r.hold).padEnd(8)} ${r.cap.padEnd(11)} ${r.plat.padEnd(11)} ${r.port}`
              : `${r.id.padEnd(12)} ${r.local.replace('Fas', 'Fa').replace('Gig', 'Gi').padEnd(13)} ${String(Math.min(r.hold, 120)).padEnd(10)} ${r.cap.replace('R B', 'R,B').replace('S I', 'B').replace('H P', 'T').padEnd(11)} ${r.port.replace('Fas', 'Fa').replace('Gig', 'Gi')}`}
          </T>
        ))}
        <T x={44} y={274} anchor="start" size={10} color="var(--muted)">Output ilustrativ; coloanele și codurile de capabilitate diferă între CDP (R/S/H/P/I…) și LLDP (R/B/T/W/S…).</T>
      </svg>
    </div>
  );
}

/* 2) TLV-uri LLDP: clicabile */
type Tlv = { k: string; w: number; label: string; req: boolean; d: string };
const TLVS: Tlv[] = [
  { k: 'ch', w: 92, label: 'Chassis ID', req: true, d: 'Obligatoriu: identifică echipamentul (de regulă un MAC al sistemului sau altă valoare unică).' },
  { k: 'pi', w: 74, label: 'Port ID', req: true, d: 'Obligatoriu: identifică portul care trimite anunțul (de exemplu Gi0/1).' },
  { k: 'ttl', w: 52, label: 'TTL', req: true, d: 'Obligatoriu: cât timp (în secunde) să păstreze vecinul informația fără un anunț nou (hold time).' },
  { k: 'pd', w: 92, label: 'Port Descr.', req: false, d: 'Opțional: descrierea portului (dacă ai configurat description).' },
  { k: 'sn', w: 86, label: 'System Name', req: false, d: 'Opțional: hostname-ul echipamentului.' },
  { k: 'sd', w: 92, label: 'System Descr.', req: false, d: 'Opțional: model, versiune software, platformă.' },
  { k: 'sc', w: 90, label: 'System Cap.', req: false, d: 'Opțional: ce poate face echipamentul (router, bridge/switch, telefon, AP WLAN, repetor…) și ce roluri are activate.' },
  { k: 'ma', w: 86, label: 'Mgmt Addr.', req: false, d: 'Opțional: adresa de management (IP) pe care o poți folosi ca să ajungi la echipament.' },
  { k: 'end', w: 56, label: 'End', req: true, d: 'Obligatoriu: marchează sfârșitul unității LLDPDU.' },
];
export function LldpFrame() {
  const [sel, setSel] = useState('sc');
  const total = TLVS.reduce((a, t) => a + t.w, 0);
  const cur = TLVS.find((t) => t.k === sel) ?? TLVS[0];
  let x = 360 - total / 2;
  return (
    <svg viewBox="0 0 720 230" role="img" aria-label="Structura unui cadru LLDP: TLV-uri obligatorii și opționale">
      <T x={360} y={22} weight={700} size={12}>Cadru LLDP (EtherType 0x88CC) — o secvență de TLV-uri</T>
      <rect x={20} y={36} width={680} height={28} rx={5} fill="var(--code-bg)" stroke="var(--border)" />
      <T x={30} y={54} anchor="start" size={10.5} m color="var(--muted)">Dst MAC 01-80-C2-00-00-0E (multicast, link-local) · Src MAC · EtherType 0x88CC</T>
      {TLVS.map((t) => {
        const x0 = x; x += t.w;
        const on = t.k === sel;
        const c = t.req ? 'var(--warn)' : 'var(--info)';
        return (
          <g key={t.k} style={{ cursor: 'pointer' }} onClick={() => setSel(t.k)} role="button" tabIndex={0} aria-label={`TLV ${t.label}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSel(t.k); }}>
            <rect x={x0} y={84} width={t.w} height={46} rx={4} fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={c} strokeWidth={on ? 2.6 : 1.4} />
            <T x={x0 + t.w / 2} y={104} size={9.5} weight={700} color={c}>{t.label}</T>
            <T x={x0 + t.w / 2} y={120} size={9} color="var(--muted)">{t.req ? 'obligatoriu' : 'opțional'}</T>
          </g>
        );
      })}
      <rect x={60} y={150} width={600} height={62} rx={8} fill="var(--code-bg)" stroke="var(--border)" />
      <T x={76} y={172} anchor="start" size={11.5} weight={700} color={cur.req ? 'var(--warn)' : 'var(--info)'}>{cur.label}</T>
      <T x={76} y={192} anchor="start" size={10.5} color="var(--text-2)">{cur.d}</T>
    </svg>
  );
}

/* 3) Timere: anunț, hold time, dispariția vecinului */
export function DiscoveryTimers() {
  const [p, setP] = useState<'cdp' | 'lldp'>('cdp');
  const adv = p === 'cdp' ? 60 : 30;
  const hold = p === 'cdp' ? 180 : 120;
  const W = 600;
  const sx = (s: number) => 60 + (s / 240) * W;
  return (
    <div>
      <Seg value={p} set={setP} label="Protocol" items={[['cdp', 'CDP'], ['lldp', 'LLDP']]} />
      <svg viewBox="0 0 720 190" role="img" aria-label="Cronologia anunțurilor și a hold time">
        <Line x1={60} y1={90} x2={660} y2={90} c="var(--text-2)" w={2} />
        {Array.from({ length: Math.floor(240 / adv) + 1 }, (_, i) => i * adv).filter((s) => s <= 120).map((s) => (
          <g key={s}><circle cx={sx(s)} cy={90} r={5} fill="var(--accent)" /><T x={sx(s)} y={74} size={9.5} m color="var(--accent)">anunț</T><T x={sx(s)} y={112} size={9.5} m color="var(--muted)">{`${s}s`}</T></g>
        ))}
        <Line x1={sx(120)} y1={80} x2={sx(120)} y2={100} c="var(--bad)" w={2} />
        <T x={sx(120)} y={132} size={10.5} color="var(--bad)" weight={700}>vecinul dispare (nu mai trimite)</T>
        <Line x1={sx(120)} y1={142} x2={sx(120 + hold)} y2={142} c="var(--warn)" w={3} />
        <T x={(sx(120) + sx(Math.min(120 + hold, 240))) / 2} y={160} size={10.5} color="var(--warn)">{`hold time ${hold}s → intrarea expiră la ${120 + hold}s`}</T>
        <T x={360} y={26} weight={700}>{`${p === 'cdp' ? 'CDP' : 'LLDP'}: anunț la ${adv} s · hold ${hold} s`}</T>
        <T x={360} y={44} size={10.5} color="var(--muted)">{p === 'cdp' ? 'Implicit CDP: timer 60 s, holdtime 180 s.' : 'Implicit pe IOS: timer 30 s, holdtime 120 s (verifică cu show lldp).'}</T>
      </svg>
    </div>
  );
}

/* 4) Topologii laborator */
export function LabGuidedTopology23() {
  return (
    <svg viewBox="0 0 720 270" role="img" aria-label="Topologie lab ghidat 2.3: router, două switch-uri și telefon">
      <RouterIcon x={90} y={90} label="" /><T x={90} y={62} weight={700}>R1</T>
      <SwitchIcon x={290} y={90} label="" /><T x={290} y={62} weight={700}>SW1</T>
      <SwitchIcon x={490} y={90} label="" /><T x={490} y={62} weight={700}>SW2</T>
      <PhoneIcon x={650} y={90} label="Telefon" />
      <Line x1={120} y1={90} x2={258} y2={90} /><Line x1={322} y1={90} x2={458} y2={90} /><Line x1={522} y1={90} x2={628} y2={90} />
      <T x={190} y={80} size={9.5} m color="var(--muted)">Gi0/0 ⟷ Fa0/24</T><T x={390} y={80} size={9.5} m color="var(--muted)">Gi0/1 ⟷ Gi0/1</T><T x={576} y={80} size={9.5} m color="var(--muted)">Fa0/5</T>
      <Line x1={490} y1={102} x2={490} y2={170} /><ClientIcon x={490} y={182} kind="pc" label="PC1 · Fa0/2" />
      <T x={360} y={248} size={11} color="var(--muted)">Management: VLAN 1 sau VLAN 99 · 192.168.1.0/24 (R1 .1 · SW1 .11 · SW2 .12) — doar pentru a cunoaște IP-urile din show cdp neighbors detail</T>
    </svg>
  );
}
export function LabSoloTopology23() {
  return (
    <svg viewBox="0 0 720 250" role="img" aria-label="Topologie lab solo 2.3: trei dispozitive, un echipament non-Cisco simulat">
      <SwitchIcon x={140} y={90} label="" /><T x={140} y={62} weight={700}>SW-A</T>
      <SwitchIcon x={360} y={90} label="" /><T x={360} y={62} weight={700}>SW-B</T>
      <RouterIcon x={580} y={90} label="" /><T x={580} y={62} weight={700}>R-X</T>
      <Line x1={172} y1={90} x2={328} y2={90} /><Line x1={392} y1={90} x2={548} y2={90} />
      <T x={250} y={80} size={9.5} m color="var(--muted)">Gi0/1 ⟷ Gi0/1</T><T x={470} y={80} size={9.5} m color="var(--muted)">Gi0/2 ⟷ Gi0/0</T>
      <Line x1={360} y1={102} x2={360} y2={160} /><ClientIcon x={360} y={174} kind="pc" label="Server de monitorizare" />
      <T x={360} y={236} size={11} color="var(--muted)">Cerință: CDP oprit spre R-X (presupus rețea externă), LLDP activ pe SW-A ⟷ SW-B</T>
    </svg>
  );
}
