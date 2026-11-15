import { useState } from 'react';
import { ClientIcon, SwitchIcon } from './wlan';
import { Line, Seg, T, VCOL } from './l2kit';

/* Diagrame originale pentru 2.2 (trunk, 802.1Q, native VLAN). Culori doar prin var(--…). */

/* 1) De ce trunk: un cablu per VLAN vs un singur trunk */
export function TrunkWhy() {
  const [m, setM] = useState<'many' | 'trunk'>('trunk');
  return (
    <div>
      <Seg value={m} set={setM} label="Interconectare" items={[['many', 'Un cablu per VLAN'], ['trunk', 'Un singur trunk 802.1Q']]} />
      <svg viewBox="0 0 720 250" role="img" aria-label="Interconectarea a două switch-uri: un cablu per VLAN față de un trunk">
        <SwitchIcon x={150} y={110} label="" /><T x={150} y={84} weight={700}>SW1</T>
        <SwitchIcon x={570} y={110} label="" /><T x={570} y={84} weight={700}>SW2</T>
        {m === 'many' ? (
          <g>
            <Line x1={182} y1={100} x2={538} y2={100} c={VCOL[10]} w={3} />
            <Line x1={182} y1={110} x2={538} y2={110} c={VCOL[20]} w={3} />
            <Line x1={182} y1={120} x2={538} y2={120} c={VCOL[30]} w={3} />
            <T x={360} y={90} size={10.5} m color={VCOL[10]}>cablu 1 · VLAN 10</T>
            <T x={360} y={136} size={10.5} m color={VCOL[30]}>cablu 3 · VLAN 30</T>
            <T x={360} y={170} size={11.5} color="var(--text-2)">3 VLAN-uri = 3 cabluri + 3 porturi pe fiecare switch.</T>
            <T x={360} y={190} size={11} color="var(--muted)">La 20 de VLAN-uri ai nevoie de 20 de cabluri: nu scalează.</T>
          </g>
        ) : (
          <g>
            <Line x1={182} y1={110} x2={538} y2={110} c="var(--warn)" w={5} />
            <T x={360} y={96} size={11} weight={700} color="var(--warn)">Trunk 802.1Q · Gi0/1 ⟷ Gi0/1</T>
            {[{ v: 10, x: 250 }, { v: 20, x: 360 }, { v: 30, x: 470 }].map((f) => (
              <g key={f.v}>
                <rect x={f.x - 38} y={122} width={76} height={24} rx={5} fill="var(--code-bg)" stroke={VCOL[f.v]} strokeWidth={1.8} />
                <T x={f.x} y={138} size={10.5} m color={VCOL[f.v]}>{`tag VID ${f.v}`}</T>
              </g>
            ))}
            <T x={360} y={176} size={11.5} color="var(--text-2)">Un singur cablu poartă toate VLAN-urile; fiecare cadru primește un tag de 4 octeți cu VLAN ID-ul lui.</T>
            <T x={360} y={196} size={11} color="var(--muted)">La capătul celălalt tag-ul este scos și cadrul ajunge în VLAN-ul corect.</T>
          </g>
        )}
        <ClientIcon x={80} y={190} kind="pc" label="VLAN 10" /><ClientIcon x={640} y={190} kind="pc" label="VLAN 10" />
      </svg>
    </div>
  );
}

/* 2) Cadrul 802.1Q: câmpuri clicabile */
type Fld = { k: string; w: number; label: string; sub: string; bytes: string; d: string; c: string };
const FIELDS: Fld[] = [
  { k: 'dst', w: 90, label: 'Dst MAC', sub: '', bytes: '6 B', c: 'var(--text-2)', d: 'Adresa MAC destinație. Neschimbată de tag.' },
  { k: 'src', w: 90, label: 'Src MAC', sub: '', bytes: '6 B', c: 'var(--text-2)', d: 'Adresa MAC sursă. Tag-ul se inserează imediat DUPĂ ea.' },
  { k: 'tpid', w: 62, label: 'TPID', sub: '0x8100', bytes: '2 B', c: 'var(--warn)', d: 'Tag Protocol Identifier: valoarea 0x8100 care ocupă locul EtherType-ului și anunță „urmează un tag 802.1Q”.' },
  { k: 'pcp', w: 54, label: 'PCP', sub: '3 biți', bytes: '3 b', c: 'var(--violet)', d: 'Priority Code Point (CoS): prioritate 0–7 pentru QoS. Vocea folosește de regulă 5.' },
  { k: 'dei', w: 34, label: 'DEI', sub: '1 bit', bytes: '1 b', c: 'var(--info)', d: 'Drop Eligible Indicator: marchează cadre care pot fi aruncate primele la congestie.' },
  { k: 'vid', w: 78, label: 'VID', sub: '12 biți', bytes: '12 b', c: 'var(--accent)', d: 'VLAN ID: 1–4094 utilizabile (0 = doar prioritate, 4095 rezervat). Cu 12 biți: 4096 combinații.' },
  { k: 'et', w: 62, label: 'EtherType', sub: '0x0800', bytes: '2 B', c: 'var(--text-2)', d: 'Tipul real al datelor (aici IPv4 = 0x0800), mutat după tag.' },
  { k: 'pay', w: 130, label: 'Payload', sub: '46–1500 B', bytes: '', c: 'var(--text-2)', d: 'Datele (pachetul IP). Cu tag, cadrul total poate ajunge la 1522 B.' },
  { k: 'fcs', w: 58, label: 'FCS', sub: 'recalculat', bytes: '4 B', c: 'var(--text-2)', d: 'CRC-32; switch-ul îl recalculează după ce adaugă sau scoate tag-ul.' },
];
export function Dot1qFrame() {
  const [sel, setSel] = useState('tpid');
  const [tag, setTag] = useState(true);
  const list = FIELDS.filter((f) => tag || !['tpid', 'pcp', 'dei', 'vid'].includes(f.k));
  const total = list.reduce((a, f) => a + f.w, 0);
  const cur = FIELDS.find((f) => f.k === sel) ?? FIELDS[2];
  let x = 360 - total / 2;
  return (
    <div>
      <Seg value={tag ? 't' : 'u'} set={(k) => setTag(k === 't')} label="Cadru" items={[['u', 'Ethernet II (fără tag)'], ['t', 'Cu tag 802.1Q (+4 octeți)']]} />
      <svg viewBox="0 0 720 200" role="img" aria-label="Structura cadrului Ethernet cu tag 802.1Q">
        {list.map((f) => {
          const x0 = x; x += f.w;
          const on = f.k === sel;
          return (
            <g key={f.k} style={{ cursor: 'pointer' }} onClick={() => setSel(f.k)} role="button" tabIndex={0} aria-label={`Câmp ${f.label}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSel(f.k); }}>
              <rect x={x0} y={50} width={f.w} height={50} rx={4} fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={f.c} strokeWidth={on ? 2.6 : 1.4} />
              <T x={x0 + f.w / 2} y={72} size={10.5} weight={700} color={f.c}>{f.label}</T>
              <T x={x0 + f.w / 2} y={88} size={9.5} m color="var(--muted)">{f.sub}</T>
              <T x={x0 + f.w / 2} y={116} size={9.5} m color="var(--muted)">{f.bytes}</T>
            </g>
          );
        })}
        {tag && <T x={360} y={30} size={11} weight={700} color="var(--warn)">tag 802.1Q = TPID (2 B) + TCI (PCP 3 b · DEI 1 b · VID 12 b) = 4 octeți</T>}
        {!tag && <T x={360} y={30} size={11} weight={700} color="var(--text-2)">Cadru Ethernet II obișnuit: 64–1518 octeți</T>}
        <rect x={60} y={134} width={600} height={52} rx={8} fill="var(--code-bg)" stroke="var(--border)" />
        <T x={76} y={156} anchor="start" size={11.5} weight={700} color={cur.c}>{cur.label}</T>
        <T x={76} y={174} anchor="start" size={11} color="var(--text-2)">{cur.d}</T>
      </svg>
    </div>
  );
}

/* 3) Native VLAN: potrivire / nepotrivire */
export function NativeVlanSim() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const ok = a === b;
  const opts: [string, string][] = [['1', '1 (default)'], ['99', '99'], ['999', '999']];
  return (
    <div>
      <div className="small" style={{ marginBottom: 6 }}>Native VLAN pe SW1:</div>
      <Seg value={String(a)} set={(k) => setA(Number(k))} label="Native SW1" items={opts} />
      <div className="small" style={{ marginBottom: 6 }}>Native VLAN pe SW2:</div>
      <Seg value={String(b)} set={(k) => setB(Number(k))} label="Native SW2" items={opts} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Simulare nepotrivire native VLAN pe un trunk">
        <SwitchIcon x={130} y={80} label="" /><T x={130} y={52} weight={700}>SW1</T>
        <SwitchIcon x={590} y={80} label="" /><T x={590} y={52} weight={700}>SW2</T>
        <Line x1={162} y1={80} x2={558} y2={80} c={ok ? 'var(--ok)' : 'var(--bad)'} w={4} />
        <T x={360} y={68} size={11} m color={ok ? 'var(--ok)' : 'var(--bad)'}>{`native ${a}  ⟷  native ${b}`}</T>
        <T x={130} y={112} size={10.5} m color="var(--muted)">{`native VLAN ${a}`}</T>
        <T x={590} y={112} size={10.5} m color="var(--muted)">{`native VLAN ${b}`}</T>
        <rect x={60} y={132} width={600} height={80} rx={9} fill="var(--code-bg)" stroke={ok ? 'var(--ok)' : 'var(--bad)'} strokeWidth={1.6} />
        {ok ? (
          <g>
            <T x={78} y={156} anchor="start" size={11.5} weight={700} color="var(--ok)">Native VLAN potrivit</T>
            <T x={78} y={176} anchor="start" size={11} color="var(--text-2)">{`Cadrele din VLAN ${a} circulă fără tag pe trunk și sunt livrate în VLAN ${b} — același VLAN la ambele capete.`}</T>
            <T x={78} y={194} anchor="start" size={11} color="var(--muted)">{a === 1 ? 'Funcționează, dar VLAN 1 ca nativ este alegerea implicită slabă din punct de vedere al securității.' : 'Bună practică: VLAN nativ dedicat, nefolosit de utilizatori.'}</T>
          </g>
        ) : (
          <g>
            <T x={78} y={156} anchor="start" size={11.5} weight={700} color="var(--bad)">Native VLAN nepotrivit</T>
            <T x={78} y={174} anchor="start" size={11} color="var(--text-2)">{`Cadrele netaggate din VLAN ${a} (SW1) ajung în VLAN ${b} pe SW2: două VLAN-uri se „amestecă”.`}</T>
            <T x={78} y={192} anchor="start" size={10.5} m color="var(--warn)">%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered</T>
            <T x={78} y={207} anchor="start" size={10} color="var(--muted)">(mesaj ilustrativ; poate apărea și o avertizare STP privind PVID)</T>
          </g>
        )}
      </svg>
    </div>
  );
}

/* 4) DTP: matricea de moduri */
const MODES = ['dynamic auto', 'dynamic desirable', 'trunk', 'access'] as const;
const DTP: Record<string, string[]> = {
  'dynamic auto': ['access', 'trunk', 'trunk', 'access'],
  'dynamic desirable': ['trunk', 'trunk', 'trunk', 'access'],
  trunk: ['trunk', 'trunk', 'trunk', 'mismatch'],
  access: ['access', 'access', 'mismatch', 'access'],
};
export function DtpMatrix() {
  const [l, setL] = useState(0);
  const [r, setR] = useState(0);
  const res = DTP[MODES[l]][r];
  const col = res === 'trunk' ? 'var(--warn)' : res === 'access' ? 'var(--accent)' : 'var(--bad)';
  return (
    <div>
      <div className="small" style={{ marginBottom: 6 }}>Modul pe SW1:</div>
      <Seg value={String(l)} set={(k) => setL(Number(k))} label="Mod SW1" items={MODES.map((m, i): [string, string] => [String(i), m])} />
      <div className="small" style={{ marginBottom: 6 }}>Modul pe SW2:</div>
      <Seg value={String(r)} set={(k) => setR(Number(k))} label="Mod SW2" items={MODES.map((m, i): [string, string] => [String(i), m])} />
      <svg viewBox="0 0 720 150" role="img" aria-label="Rezultatul negocierii DTP">
        <SwitchIcon x={110} y={60} label="" /><T x={110} y={32} weight={700}>SW1</T><T x={110} y={94} size={10} m color="var(--muted)">{MODES[l]}</T>
        <SwitchIcon x={610} y={60} label="" /><T x={610} y={32} weight={700}>SW2</T><T x={610} y={94} size={10} m color="var(--muted)">{MODES[r]}</T>
        <Line x1={142} y1={60} x2={578} y2={60} c={col} w={res === 'trunk' ? 5 : 3} dash={res === 'mismatch' ? '6 5' : undefined} />
        <T x={360} y={48} size={12.5} weight={700} color={col}>{res === 'mismatch' ? 'mismatch — conectivitate limitată / nefuncțional' : `rezultat: ${res}`}</T>
        <T x={360} y={130} size={11} color="var(--muted)">{l === 0 && r === 0 ? 'Capcană clasică: auto + auto ⇒ access, NU trunk (niciunul nu inițiază).' : 'Pe Catalyst moderne modul implicit este dynamic auto. DTP se oprește cu switchport nonegotiate.'}</T>
      </svg>
    </div>
  );
}

/* 5) VLAN hopping prin double tagging */
export function DoubleTag() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Atac VLAN hopping prin double tagging">
      <SwitchIcon x={150} y={110} label="" /><T x={150} y={84} weight={700}>SW1</T>
      <SwitchIcon x={570} y={110} label="" /><T x={570} y={84} weight={700}>SW2</T>
      <Line x1={182} y1={110} x2={538} y2={110} c="var(--warn)" w={4} />
      <T x={360} y={98} size={10.5} m color="var(--warn)">trunk · native VLAN 1</T>
      <ClientIcon x={60} y={110} kind="laptop" label="Atacator (VLAN 1)" />
      <ClientIcon x={660} y={110} kind="pc" label="Victimă (VLAN 20)" />
      <Line x1={80} y1={110} x2={118} y2={110} />
      <Line x1={602} y1={110} x2={632} y2={110} />
      <rect x={30} y={160} width={200} height={34} rx={6} fill="var(--code-bg)" stroke="var(--bad)" />
      <T x={130} y={174} size={10} m color="var(--bad)">[tag 1][tag 20][date]</T>
      <T x={130} y={188} size={9.5} color="var(--muted)">atacatorul trimite două tag-uri</T>
      <rect x={260} y={160} width={200} height={34} rx={6} fill="var(--code-bg)" stroke="var(--warn)" />
      <T x={360} y={174} size={10} m color="var(--warn)">[tag 20][date]</T>
      <T x={360} y={188} size={9.5} color="var(--muted)">SW1 scoate tag 1 (nativ) — fără tag nou</T>
      <rect x={490} y={160} width={200} height={34} rx={6} fill="var(--code-bg)" stroke="var(--ok)" />
      <T x={590} y={174} size={10} m color="var(--ok)">[date] → VLAN 20</T>
      <T x={590} y={188} size={9.5} color="var(--muted)">SW2 vede tag 20 și livrează în VLAN 20</T>
      <T x={360} y={228} size={11} color="var(--muted)">Atacul merge într-un singur sens; se previne cu un native VLAN neutilizat și porturi access setate explicit.</T>
    </svg>
  );
}

/* 6) Topologii laborator */
export function LabGuidedTopology22() {
  return (
    <svg viewBox="0 0 720 270" role="img" aria-label="Topologie lab ghidat 2.2: două switch-uri cu trunk">
      <SwitchIcon x={190} y={70} label="" /><T x={190} y={44} weight={700}>SW1 (2960)</T>
      <SwitchIcon x={530} y={70} label="" /><T x={530} y={44} weight={700}>SW2 (2960)</T>
      <Line x1={222} y1={70} x2={498} y2={70} c="var(--warn)" w={4} />
      <T x={360} y={60} size={10.5} m color="var(--warn)">Gi0/1 ⟷ Gi0/1 · trunk</T>
      <Line x1={170} y1={82} x2={90} y2={160} c={VCOL[10]} /><Line x1={210} y1={82} x2={290} y2={160} c={VCOL[20]} />
      <Line x1={510} y1={82} x2={430} y2={160} c={VCOL[10]} /><Line x1={550} y1={82} x2={630} y2={160} c={VCOL[20]} />
      {[{ x: 90, n: 'PC1', ip: '10.10.10.11', v: 10, p: 'Fa0/1' }, { x: 290, n: 'PC2', ip: '10.10.20.11', v: 20, p: 'Fa0/2' }, { x: 430, n: 'PC3', ip: '10.10.10.12', v: 10, p: 'Fa0/1' }, { x: 630, n: 'PC4', ip: '10.10.20.12', v: 20, p: 'Fa0/2' }].map((p) => (
        <g key={p.n}><ClientIcon x={p.x} y={176} kind="pc" /><T x={p.x} y={202} weight={650} size={11}>{`${p.n} · ${p.p}`}</T><T x={p.x} y={216} size={9.5} m color={VCOL[p.v]}>{`${p.ip} · V${p.v}`}</T></g>
      ))}
      <T x={360} y={256} size={11} color="var(--muted)">VLAN 10 = 10.10.10.0/24 · VLAN 20 = 10.10.20.0/24 · VLAN 99 = native (nu are hosturi)</T>
    </svg>
  );
}
export function LabSoloTopology22() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Topologie lab solo 2.2: lanț de trei switch-uri cu trunk-uri">
      {[{ x: 120, n: 'SW-A' }, { x: 360, n: 'SW-B' }, { x: 600, n: 'SW-C' }].map((s) => (<g key={s.n}><SwitchIcon x={s.x} y={70} label="" /><T x={s.x} y={44} weight={700}>{s.n}</T></g>))}
      <Line x1={152} y1={70} x2={328} y2={70} c="var(--warn)" w={3} /><Line x1={392} y1={70} x2={568} y2={70} c="var(--warn)" w={3} />
      <T x={240} y={60} size={10} m color="var(--warn)">Gi0/1 ⟷ Gi0/1</T><T x={480} y={60} size={10} m color="var(--warn)">Gi0/2 ⟷ Gi0/1</T>
      <Line x1={110} y1={82} x2={70} y2={150} c={VCOL[10]} /><Line x1={130} y1={82} x2={170} y2={150} c={VCOL[20]} />
      <Line x1={360} y1={82} x2={360} y2={150} c={VCOL[30]} />
      <Line x1={590} y1={82} x2={550} y2={150} c={VCOL[10]} /><Line x1={610} y1={82} x2={650} y2={150} c={VCOL[30]} />
      {[{ x: 70, n: 'H1', v: 10 }, { x: 170, n: 'H2', v: 20 }, { x: 360, n: 'H3', v: 30 }, { x: 550, n: 'H4', v: 10 }, { x: 650, n: 'H5', v: 30 }].map((p) => (
        <g key={p.n}><ClientIcon x={p.x} y={166} kind="pc" /><T x={p.x} y={192} weight={650} size={11}>{p.n}</T><T x={p.x} y={206} size={9.5} m color={VCOL[p.v]}>{`VLAN ${p.v}`}</T></g>
      ))}
      <T x={360} y={244} size={11} color="var(--muted)">VLAN 10/20/30 = 10.20.10.0/24 · 10.20.20.0/24 · 10.20.30.0/24 · native 999 pe toate trunk-urile</T>
    </svg>
  );
}
