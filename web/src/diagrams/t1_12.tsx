import { useState, type ReactNode } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';

/* Diagrame originale pentru 1.12 — virtualizare (VM, containere, VRF).
   Culori DOAR prin variabile CSS, ca să meargă în ambele teme. */

const font = { fontFamily: 'Inter Variable, sans-serif' };
const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; mono?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.mono ? { fontFamily: 'JetBrains Mono Variable, monospace' } : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);
/** Un „strat” dintr-o stivă (hardware, hypervisor, OS…) */
const Layer = ({ x, y, w, h = 30, label, sub, color = 'var(--text-2)', fill = 'var(--surface-3)', dim = false }: { x: number; y: number; w: number; h?: number; label: ReactNode; sub?: ReactNode; color?: string; fill?: string; dim?: boolean }) => (
  <g opacity={dim ? 0.25 : 1} style={{ transition: 'opacity .35s' }}>
    <rect x={x} y={y} width={w} height={h} rx={7} fill={fill} stroke={color} strokeWidth={1.4} />
    <T x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} size={11.5} weight={650} color={color === 'var(--text-2)' ? 'var(--text)' : color}>{label}</T>
    {sub && <T x={x + w / 2} y={y + h / 2 + 12} size={9.5} color="var(--muted)">{sub}</T>}
  </g>
);
export function ServerIcon({ x, y, label, sub, color = 'var(--text-2)' }: { x: number; y: number; label?: string; sub?: string; color?: string }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x - 26} y={y - 22 + i * 15} width={52} height={13} rx={3} fill="var(--surface-3)" stroke={color} strokeWidth={1.3} />
          <circle cx={x + 18} cy={y - 15.5 + i * 15} r={2} fill="var(--accent)" />
          <path d={`M${x - 20} ${y - 15.5 + i * 15} h20`} stroke={color} strokeWidth={1.2} />
        </g>
      ))}
      {label && <T x={x} y={y + 38} weight={650} size={11.5}>{label}</T>}
      {sub && <T x={x} y={y + 51} size={10} color="var(--muted)">{sub}</T>}
    </g>
  );
}
function Seg<K extends string>({ value, set, opts, label }: { value: K; set: (k: K) => void; opts: [K, string][]; label: string }) {
  return (
    <div className="segmented" role="group" aria-label={label} style={{ marginBottom: 12, flexWrap: 'wrap' }}>
      {opts.map(([k, l]) => <button key={k} type="button" className={value === k ? 'on' : ''} onClick={() => set(k)}>{l}</button>)}
    </div>
  );
}

/* ---------------------------------------------------------------
   Istoric: de la mainframe la Kubernetes
---------------------------------------------------------------- */
const HIST = [
  { y: '1967', t: 'IBM CP-40 / CP-67', d: 'mașini virtuale pe mainframe', c: 'var(--violet)' },
  { y: '1972', t: 'IBM VM/370', d: 'virtualizare comercială', c: 'var(--violet)' },
  { y: '1974', t: 'Popek & Goldberg', d: 'teoria hypervisorului (Type 1/2)', c: 'var(--violet)' },
  { y: '1999', t: 'VMware Workstation', d: 'virtualizare pe x86 (Type 2)', c: 'var(--info)' },
  { y: '2001', t: 'VMware ESX', d: 'bare-metal pe x86 (Type 1)', c: 'var(--info)' },
  { y: '2003', t: 'Xen', d: 'hypervisor open source', c: 'var(--info)' },
  { y: '2007', t: 'KVM în Linux', d: 'kernelul devine hypervisor', c: 'var(--info)' },
  { y: '2008', t: 'Hyper-V', d: 'în Windows Server 2008', c: 'var(--info)' },
  { y: '2013', t: 'Docker', d: 'containere pentru toată lumea', c: 'var(--accent)' },
  { y: '2014', t: 'Kubernetes', d: 'orchestrare (Google → CNCF)', c: 'var(--accent)' },
];
export function VirtTimeline() {
  const x0 = 40, x1 = 680; const step = (x1 - x0) / (HIST.length - 1);
  return (
    <svg viewBox="0 0 720 250" width="100%" role="img" aria-label="Cronologia virtualizării">
      <line x1={x0 - 10} x2={x1 + 10} y1={125} y2={125} stroke="var(--border)" strokeWidth={3} strokeLinecap="round" />
      {HIST.map((h, i) => {
        const x = x0 + i * step; const up = i % 2 === 0;
        return (
          <g key={h.y + h.t}>
            <circle cx={x} cy={125} r={7} fill="var(--surface)" stroke={h.c} strokeWidth={2.5} />
            <line x1={x} x2={x} y1={up ? 118 : 132} y2={up ? 92 : 158} stroke={h.c} strokeWidth={1.2} strokeDasharray="3 3" />
            <T x={x} y={up ? 84 : 176} size={13} weight={750} color={h.c}>{h.y}</T>
            <T x={x} y={up ? 66 : 192} size={10.5} weight={650}>{h.t}</T>
            <T x={x} y={up ? 52 : 206} size={9.5} color="var(--muted)">{h.d}</T>
          </g>
        );
      })}
      <T x={40} y={240} size={10.5} anchor="start" color="var(--violet)">● mainframe</T>
      <T x={140} y={240} size={10.5} anchor="start" color="var(--info)">● hypervisoare x86</T>
      <T x={280} y={240} size={10.5} anchor="start" color="var(--accent)">● containere</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   Consolidare: înainte / după virtualizare
---------------------------------------------------------------- */
export function Consolidation() {
  const [v, setV] = useState<'before' | 'after'>('before');
  const apps = ['Web', 'Mail', 'DB', 'Fișiere'];
  const util = [12, 8, 18, 6];
  return (
    <>
      <Seg value={v} set={setV} label="Înainte sau după virtualizare" opts={[['before', 'Înainte: 1 aplicație / server'], ['after', 'După: 4 VM-uri pe 1 host']]} />
      <svg viewBox="0 0 720 260" width="100%" role="img" aria-label="Consolidarea serverelor">
        {v === 'before' ? (
          <g className="fade-up">
            {apps.map((a, i) => {
              const x = 110 + i * 170;
              return (
                <g key={a}>
                  <ServerIcon x={x} y={70} label={`Server ${i + 1}`} sub={`aplicația ${a}`} />
                  <rect x={x - 40} y={150} width={80} height={14} rx={7} fill="var(--surface-3)" stroke="var(--border)" />
                  <rect x={x - 40} y={150} width={80 * util[i] / 100} height={14} rx={7} fill="var(--warn)" />
                  <T x={x} y={184} size={11} color="var(--warn)" weight={650}>CPU ≈ {util[i]}%</T>
                </g>
              );
            })}
            <T x={360} y={222} size={12} weight={650}>4 servere fizice · 4 × curent, răcire, spațiu în rack, licențe, cabluri</T>
            <T x={360} y={242} size={10.5} color="var(--muted)">Fiecare server stă majoritar degeaba (valori ilustrative)</T>
          </g>
        ) : (
          <g className="fade-up">
            <rect x={150} y={20} width={420} height={140} rx={14} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.4} />
            {apps.map((a, i) => (
              <Layer key={a} x={168 + i * 100} y={34} w={88} h={50} label={`VM ${a}`} sub="OS propriu" color="var(--accent)" fill="var(--surface)" />
            ))}
            <Layer x={168} y={92} w={388} label="Hypervisor (Type 1)" color="var(--violet)" />
            <Layer x={168} y={126} w={388} h={26} label="Un singur server fizic (CPU, RAM, disc, NIC)" />
            <rect x={240} y={178} width={240} height={14} rx={7} fill="var(--surface-3)" stroke="var(--border)" />
            <rect x={240} y={178} width={240 * 0.5} height={14} rx={7} fill="var(--ok)" />
            <T x={360} y={210} size={11} color="var(--ok)" weight={650}>CPU ≈ 45–60% — resursele sunt folosite efectiv</T>
            <T x={360} y={242} size={10.5} color="var(--muted)">VM-urile rămân izolate: dacă „Mail” se blochează, „DB” merge mai departe (valori ilustrative)</T>
          </g>
        )}
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------
   Hypervisor Type 1 vs Type 2
---------------------------------------------------------------- */
export function HypervisorTypes() {
  const [v, setV] = useState<'t1' | 't2'>('t1');
  const W = 520, X = 100;
  const vm = (i: number, y: number) => (
    <g key={i}>
      <rect x={X + 10 + i * 170} y={y} width={160} height={92} rx={10} fill="var(--surface)" stroke="var(--accent)" strokeWidth={1.4} />
      <T x={X + 90 + i * 170} y={y + 18} size={11} weight={700} color="var(--accent)">VM {i + 1}</T>
      <Layer x={X + 20 + i * 170} y={y + 26} w={140} h={24} label="Aplicație" />
      <Layer x={X + 20 + i * 170} y={y + 56} w={140} h={28} label={['Windows Server', 'Ubuntu Linux', 'Cisco IOS-XE (NFV)'][i]} sub="guest OS" />
    </g>
  );
  return (
    <>
      <Seg value={v} set={setV} label="Tipul de hypervisor" opts={[['t1', 'Type 1 — bare-metal'], ['t2', 'Type 2 — hosted']]} />
      <svg viewBox="0 0 720 300" width="100%" role="img" aria-label="Hypervisor Type 1 și Type 2">
        {v === 't1' ? (
          <g className="fade-up">
            {[0, 1, 2].map((i) => vm(i, 30))}
            <Layer x={X} y={134} w={W} h={40} label="Hypervisor Type 1 — ESXi · Hyper-V · Xen · KVM" sub="rulează direct pe hardware, este el însuși „sistemul de operare” al serverului" color="var(--violet)" />
            <Layer x={X} y={182} w={W} h={34} label="Hardware fizic (server)" sub="CPU cu VT-x / AMD-V · RAM · discuri · NIC-uri" />
            <T x={360} y={248} size={12} weight={650} color="var(--ok)">Overhead mic · performanță aproape nativă · data center, cloud</T>
            <T x={360} y={268} size={10.5} color="var(--muted)">Se administrează de la distanță (ex. vCenter, Hyper-V Manager) — serverul nu are desktop</T>
          </g>
        ) : (
          <g className="fade-up">
            {[0, 1].map((i) => vm(i, 10))}
            <rect x={X + 350} y={10} width={160} height={92} rx={10} fill="var(--surface)" stroke="var(--text-2)" strokeDasharray="4 4" />
            <T x={X + 430} y={44} size={11} weight={650}>Browser, Office…</T>
            <T x={X + 430} y={62} size={10} color="var(--muted)">aplicațiile tale obișnuite</T>
            <Layer x={X} y={110} w={340} h={32} label="Hypervisor Type 2 — VirtualBox · VMware Workstation" sub="o aplicație ca oricare alta" color="var(--violet)" />
            <Layer x={X} y={150} w={W} h={34} label="Host OS — Windows / macOS / Linux" sub="controlează hardware-ul; hypervisorul îi cere resurse" color="var(--info)" />
            <Layer x={X} y={192} w={W} h={30} label="Hardware fizic (laptop / PC)" />
            <T x={360} y={252} size={12} weight={650} color="var(--warn)">Un strat în plus → overhead mai mare · ideal pentru laburi, teste, desktop</T>
            <T x={360} y={272} size={10.5} color="var(--muted)">Exact ce folosești când rulezi GNS3 VM sau EVE-NG în VirtualBox / VMware Workstation</T>
          </g>
        )}
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------
   VM vs container — toggle între cele două stive
---------------------------------------------------------------- */
export function VmVsContainer() {
  const [v, setV] = useState<'vm' | 'ct' | 'both'>('vm');
  const apps = ['App A', 'App B', 'App C'];
  const vmStack = (x0: number, w: number) => {
    const bw = (w - 20) / 3;
    return (
      <g>
        <T x={x0 + w / 2} y={18} size={13} weight={750} color="var(--accent)">Mașini virtuale</T>
        {apps.map((a, i) => {
          const x = x0 + i * (bw + 10);
          return (
            <g key={a}>
              <rect x={x} y={28} width={bw} height={112} rx={9} fill="none" stroke="var(--accent)" strokeDasharray="4 3" />
              <Layer x={x + 6} y={34} w={bw - 12} h={26} label={a} color="var(--accent)" />
              <Layer x={x + 6} y={64} w={bw - 12} h={26} label="Bins / Libs" />
              <Layer x={x + 6} y={94} w={bw - 12} h={40} label="Guest OS" sub="kernel propriu · GB" color="var(--warn)" />
            </g>
          );
        })}
        <Layer x={x0} y={148} w={w} h={30} label="Hypervisor" color="var(--violet)" />
        <Layer x={x0} y={184} w={w} h={26} label="(Host OS, doar la Type 2)" dim={false} color="var(--muted)" />
        <Layer x={x0} y={216} w={w} h={28} label="Hardware" />
      </g>
    );
  };
  const ctStack = (x0: number, w: number) => {
    const bw = (w - 20) / 3;
    return (
      <g>
        <T x={x0 + w / 2} y={18} size={13} weight={750} color="var(--info)">Containere</T>
        {apps.map((a, i) => {
          const x = x0 + i * (bw + 10);
          return (
            <g key={a}>
              <rect x={x} y={58} width={bw} height={82} rx={9} fill="none" stroke="var(--info)" strokeDasharray="4 3" />
              <Layer x={x + 6} y={64} w={bw - 12} h={34} label={a} sub="proces izolat" color="var(--info)" />
              <Layer x={x + 6} y={104} w={bw - 12} h={30} label="Bins / Libs" sub="MB" />
            </g>
          );
        })}
        <Layer x={x0} y={148} w={w} h={30} label="Container engine (Docker / containerd)" color="var(--violet)" />
        <Layer x={x0} y={184} w={w} h={26} label="Host OS — UN SINGUR kernel, partajat" color="var(--warn)" />
        <Layer x={x0} y={216} w={w} h={28} label="Hardware (sau o VM)" />
      </g>
    );
  };
  return (
    <>
      <Seg value={v} set={setV} label="Comparație VM și container" opts={[['vm', 'Stiva VM'], ['ct', 'Stiva container'], ['both', 'Una lângă alta']]} />
      <svg viewBox="0 0 720 300" width="100%" role="img" aria-label="Stiva unei VM comparată cu stiva unui container">
        {v === 'vm' && <g className="fade-up">{vmStack(130, 460)}
          <T x={360} y={272} size={12} weight={650}>Virtualizezi <tspan fill="var(--accent)">hardware-ul</tspan>: fiecare VM are propriul sistem de operare complet.</T>
          <T x={360} y={290} size={10.5} color="var(--muted)">Pornire în zeci de secunde–minute · izolare puternică · poți amesteca Windows și Linux pe același host</T></g>}
        {v === 'ct' && <g className="fade-up">{ctStack(130, 460)}
          <T x={360} y={272} size={12} weight={650}>Virtualizezi <tspan fill="var(--info)">sistemul de operare</tspan>: containerele împart kernelul host-ului.</T>
          <T x={360} y={290} size={10.5} color="var(--muted)">Pornire în (sub)secunde · zeci–sute pe un host · un container Linux are nevoie de kernel Linux</T></g>}
        {v === 'both' && <g className="fade-up">{vmStack(20, 330)}{ctStack(370, 330)}
          <T x={360} y={280} size={11.5} weight={650}>Ce lipsește din dreapta? <tspan fill="var(--warn)">Guest OS-ul</tspan> — de aici diferența de mărime și viteză.</T></g>}
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------
   vSwitch: VM-uri, vNIC, port groups, uplink trunk spre ToR
---------------------------------------------------------------- */
type Flow = 'none' | 'same' | 'diff' | 'out';
const FLOWS: Record<Exclude<Flow, 'none'>, { t: string; d: string; c: string }> = {
  same: { t: 'VM1 → VM2 (același VLAN 10, același host)', d: 'vSwitch-ul învață MAC-urile vNIC-urilor ca un switch fizic și livrează cadrul direct în memorie. Traficul NU iese din server — switch-ul fizic nici nu îl vede.', c: 'var(--ok)' },
  diff: { t: 'VM1 (VLAN 10) → VM3 (VLAN 20)', d: 'VLAN-uri diferite = subrețele diferite → e nevoie de rutare. vSwitch-ul este de nivel 2: trimite cadrul etichetat 802.1Q (tag 10) pe uplink spre switch-ul ToR; switch-ul L3/routerul rutează în VLAN 20 și îl trimite înapoi pe același trunk, cu tag 20.', c: 'var(--warn)' },
  out: { t: 'VM4 → Internet / alt server', d: 'Cadrul pleacă pe unul din uplink-uri (NIC teaming: dacă vmnic0 pică, traficul trece pe vmnic1) cu tag-ul VLAN-ului său. Pentru rețea, VM-ul arată ca orice alt server: un MAC și un IP pe un port de switch.', c: 'var(--info)' },
};
export function VSwitchDiagram() {
  const [f, setF] = useState<Flow>('same');
  const vms = [
    { n: 'VM1', vlan: 10, mac: '00:50:56:aa:00:01', x: 120 },
    { n: 'VM2', vlan: 10, mac: '00:50:56:aa:00:02', x: 260 },
    { n: 'VM3', vlan: 20, mac: '00:50:56:aa:00:03', x: 400 },
    { n: 'VM4', vlan: 30, mac: '00:50:56:aa:00:04', x: 540 },
  ];
  const vc = (vl: number) => (vl === 10 ? 'var(--accent)' : vl === 20 ? 'var(--violet)' : 'var(--info)');
  const path: Record<Exclude<Flow, 'none'>, string> = {
    same: 'M120 112 L120 160 L260 160 L260 112',
    diff: 'M120 112 L120 160 L300 160 L300 238 L300 300 L330 300 M390 300 L420 300 L420 238 L420 160 L400 160 L400 112',
    out: 'M540 112 L540 160 L430 160 L430 238 L430 300 L360 300 L360 340',
  };
  return (
    <>
      <Seg value={f} set={setF} label="Alege un flux de trafic" opts={[['same', 'VM1 → VM2'], ['diff', 'VM1 → VM3'], ['out', 'VM4 → afară'], ['none', 'Fără flux']]} />
      <svg viewBox="0 0 720 380" width="100%" role="img" aria-label="Virtual switch într-un host de virtualizare">
        <rect x={40} y={10} width={640} height={250} rx={16} fill="none" stroke="var(--border)" strokeWidth={1.5} />
        <T x={56} y={30} anchor="start" size={11} weight={700} color="var(--muted)">HOST ESXi-01 (server fizic)</T>
        {vms.map((m) => (
          <g key={m.n}>
            <rect x={m.x - 55} y={40} width={110} height={56} rx={9} fill="var(--surface-3)" stroke={vc(m.vlan)} strokeWidth={1.5} />
            <T x={m.x} y={60} weight={700}>{m.n}</T>
            <T x={m.x} y={76} size={9.5} mono color="var(--muted)">{m.mac}</T>
            <T x={m.x} y={89} size={9.5} color={vc(m.vlan)} weight={650}>VLAN {m.vlan}</T>
            <rect x={m.x - 14} y={96} width={28} height={14} rx={3} fill="var(--surface)" stroke={vc(m.vlan)} />
            <T x={m.x} y={107} size={8.5} weight={650}>vNIC</T>
            <line x1={m.x} x2={m.x} y1={110} y2={150} stroke={vc(m.vlan)} strokeWidth={2} />
          </g>
        ))}
        <rect x={70} y={150} width={580} height={30} rx={8} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
        <T x={360} y={169} weight={700} color="var(--accent)">vSwitch0 — port groups: „Web” VLAN 10 · „DB” VLAN 20 · „Mgmt” VLAN 30</T>
        <T x={600} y={204} size={9.5} color="var(--muted)" anchor="end">învață MAC-uri · VLAN-uri · nu rulează STP (nu face bucle)</T>
        {[300, 420].map((x, i) => (
          <g key={x}>
            <line x1={x} x2={x} y1={180} y2={238} stroke="var(--text-2)" strokeWidth={2} />
            <rect x={x - 30} y={226} width={60} height={22} rx={5} fill="var(--surface-3)" stroke="var(--text-2)" />
            <T x={x} y={241} size={10} weight={650}>vmnic{i}</T>
            <line x1={x} x2={x} y1={248} y2={290} stroke="var(--text-2)" strokeWidth={3} />
          </g>
        ))}
        <T x={360} y={276} size={10} color="var(--muted)">2 uplink-uri fizice (NIC teaming) · trunk 802.1Q</T>
        <SwitchIcon x={360} y={300} />
        <T x={420} y={304} anchor="start" size={11} weight={650}>switch ToR (fizic, L3)</T>
        <T x={420} y={318} anchor="start" size={10} color="var(--muted)">porturi: switchport mode trunk · allowed vlan 10,20,30</T>
        <line x1={360} x2={360} y1={312} y2={352} stroke="var(--text-2)" strokeWidth={2} />
        <T x={360} y={368} size={10.5} color="var(--muted)">restul data center-ului (spine / Internet)</T>
        {f !== 'none' && <path key={f} d={path[f]} fill="none" stroke={FLOWS[f].c} strokeWidth={4} strokeLinejoin="round" opacity={0.85} className="flow" />}
      </svg>
      <div className="callout tip" style={{ marginTop: 8, minHeight: 64 }}>
        <div>{f === 'none' ? <b>Alege un flux ca să vezi pe unde circulă cadrul.</b> : <><b>{FLOWS[f].t}</b><div className="small">{FLOWS[f].d}</div></>}</div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   Docker: Dockerfile → imagine (straturi) → registry → containere
---------------------------------------------------------------- */
export function DockerFlow() {
  return (
    <svg viewBox="0 0 720 260" width="100%" role="img" aria-label="De la Dockerfile la containere">
      <defs><marker id="dkArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--text-2)" /></marker></defs>
      <rect x={20} y={40} width={130} height={120} rx={10} fill="var(--code-bg)" stroke="var(--border)" />
      <T x={85} y={30} weight={700}>Dockerfile</T>
      {['FROM python:3.12-slim', 'COPY app.py /app/', 'RUN pip install flask', 'CMD python /app/app.py'].map((l, i) => (
        <T key={l} x={28} y={64 + i * 24} anchor="start" size={8.6} mono color="var(--text-2)">{l}</T>
      ))}
      <line x1={152} x2={208} y1={100} y2={100} stroke="var(--text-2)" strokeWidth={1.6} markerEnd="url(#dkArr)" />
      <T x={180} y={92} size={9.5} mono color="var(--muted)">build</T>
      <T x={280} y={30} weight={700}>Imagine (read-only)</T>
      {[['CMD', 'var(--accent)'], ['strat: flask', 'var(--accent)'], ['strat: app.py', 'var(--accent)'], ['strat de bază: python:3.12-slim', 'var(--info)']].map(([l, c], i) => (
        <Layer key={l} x={212} y={40 + i * 30} w={136} h={26} label={l} color={c} />
      ))}
      <line x1={350} x2={420} y1={70} y2={70} stroke="var(--text-2)" strokeWidth={1.6} markerEnd="url(#dkArr)" />
      <T x={385} y={62} size={9.5} mono color="var(--muted)">push</T>
      <rect x={424} y={40} width={120} height={60} rx={10} fill="var(--surface-3)" stroke="var(--violet)" />
      <T x={484} y={64} weight={700} color="var(--violet)">Registry</T>
      <T x={484} y={82} size={9.5} color="var(--muted)">ex. Docker Hub</T>
      <path d="M484 100 L484 140 L560 140" fill="none" stroke="var(--text-2)" strokeWidth={1.6} markerEnd="url(#dkArr)" />
      <T x={500} y={130} size={9.5} mono color="var(--muted)" anchor="start">pull</T>
      <rect x={564} y={110} width={140} height={130} rx={10} fill="none" stroke="var(--border)" />
      <T x={634} y={128} size={10.5} weight={700}>orice host Docker</T>
      {[0, 1, 2].map((i) => (
        <Layer key={i} x={574} y={136 + i * 32} w={120} h={26} label={`container ${i + 1}`} color="var(--info)" />
      ))}
      <path d="M348 140 C 430 200, 500 200, 570 200" fill="none" stroke="var(--text-2)" strokeWidth={1.4} strokeDasharray="4 4" markerEnd="url(#dkArr)" />
      <T x={430} y={214} size={9.5} mono color="var(--muted)">docker run</T>
      <T x={20} y={200} anchor="start" size={10.5} weight={650}>Imaginea = „rețeta” înghețată (șablonul).</T>
      <T x={20} y={218} anchor="start" size={10.5} weight={650}>Containerul = instanța care rulează din ea.</T>
      <T x={20} y={240} anchor="start" size={10} color="var(--muted)">Fiecare container primește un strat subțire scriibil peste straturile imaginii.</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   Kubernetes: cluster + self-healing interactiv
---------------------------------------------------------------- */
export function K8sCluster() {
  const [down, setDown] = useState(false);
  const pods = down
    ? [['web-1', 'web-2', 'web-4'], [], ['web-3', 'db-1', 'web-5']]
    : [['web-1', 'web-2'], ['web-4', 'web-5'], ['web-3', 'db-1']];
  return (
    <>
      <svg viewBox="0 0 720 300" width="100%" role="img" aria-label="Cluster Kubernetes">
        <rect x={20} y={14} width={680} height={78} rx={12} fill="var(--accent-soft)" stroke="var(--accent)" />
        <T x={36} y={34} anchor="start" size={11} weight={700} color="var(--accent)">CONTROL PLANE</T>
        {['kube-apiserver', 'scheduler', 'controller-manager', 'etcd (starea dorită)'].map((c, i) => (
          <Layer key={c} x={36 + i * 166} y={44} w={154} h={34} label={c} color="var(--accent)" fill="var(--surface)" />
        ))}
        {[0, 1, 2].map((n) => {
          const x = 30 + n * 230; const isDown = down && n === 1;
          return (
            <g key={n} opacity={isDown ? 0.45 : 1} style={{ transition: 'opacity .4s' }}>
              <line x1={x + 100} x2={x + 100} y1={92} y2={120} stroke="var(--border)" strokeWidth={1.5} />
              <rect x={x} y={120} width={200} height={150} rx={12} fill="none" stroke={isDown ? 'var(--bad)' : 'var(--border)'} strokeWidth={1.5} strokeDasharray={isDown ? '6 4' : undefined} />
              <T x={x + 14} y={140} anchor="start" size={11} weight={700} color={isDown ? 'var(--bad)' : 'var(--text)'}>Node {n + 1}{isDown ? ' — CĂZUT' : ''}</T>
              <T x={x + 186} y={140} anchor="end" size={9.5} color="var(--muted)">kubelet · runtime</T>
              {pods[n].map((p, k) => (
                <g key={p} className="fade-up">
                  <rect x={x + 12 + (k % 2) * 92} y={152 + Math.floor(k / 2) * 52} width={84} height={44} rx={8} fill="var(--surface-3)" stroke={p.startsWith('db') ? 'var(--violet)' : 'var(--info)'} strokeWidth={1.4} />
                  <T x={x + 54 + (k % 2) * 92} y={172 + Math.floor(k / 2) * 52} size={10.5} weight={650}>pod {p}</T>
                  <T x={x + 54 + (k % 2) * 92} y={186 + Math.floor(k / 2) * 52} size={8.8} color="var(--muted)">1+ containere</T>
                </g>
              ))}
              {isDown && <T x={x + 100} y={215} size={22} weight={800} color="var(--bad)">✕</T>}
            </g>
          );
        })}
        <T x={360} y={292} size={10.5} color="var(--muted)">Starea dorită: „5 replici web + 1 db”. Kubernetes compară permanent starea reală cu cea dorită.</T>
      </svg>
      <div className="callout tip" style={{ marginTop: 8, minHeight: 56 }}>
        <div>{down
          ? <><b>Self-healing:</b> <span className="small">Node 2 nu mai răspunde. Controller-ul observă că rulează doar 3 din 5 replici web, iar scheduler-ul pornește web-4 și web-5 pe nodurile sănătoase. Nimeni nu a intervenit manual.</span></>
          : <span className="small">Apasă butonul ca să simulezi căderea unui nod și să vezi ce face orchestratorul.</span>}</div>
      </div>
      <div className="controls">
        <button type="button" className={`btn sm ${down ? '' : 'primary'}`} onClick={() => setDown(!down)}>{down ? '↺ Repornește Node 2' : '⚡ Simulează căderea Node 2'}</button>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   VRF — două (trei) tabele de rutare într-un singur router
---------------------------------------------------------------- */
type VrfKey = 'RED' | 'BLUE' | 'global';
const VRF_INFO: Record<VrfKey, { c: string; title: string; rows: [string, string, string][]; note: string }> = {
  RED: {
    c: 'var(--bad)', title: 'show ip route vrf RED',
    rows: [['C', '192.168.1.0/24', 'Gi0/1'], ['L', '192.168.1.1/32', 'Gi0/1'], ['C', '10.0.0.0/30', 'Gi0/3'], ['S', '172.16.0.0/16', 'via 10.0.0.2 (Gi0/3)']],
    note: 'Un pachet care intră pe Gi0/1 sau Gi0/3 este căutat DOAR în această tabelă. Rutele BLUE nu există pentru el.',
  },
  BLUE: {
    c: 'var(--info)', title: 'show ip route vrf BLUE',
    rows: [['C', '192.168.1.0/24', 'Gi0/2'], ['L', '192.168.1.1/32', 'Gi0/2'], ['C', '10.0.0.0/30', 'Gi0/4'], ['S', '172.16.0.0/16', 'via 10.0.0.2 (Gi0/4)']],
    note: 'Aceleași prefixe ca în RED (192.168.1.0/24, 10.0.0.0/30, 172.16.0.0/16) — fără conflict, pentru că sunt tabele separate.',
  },
  global: {
    c: 'var(--text-2)', title: 'show ip route (tabela globală)',
    rows: [['C', '198.51.100.0/30', 'Gi0/0'], ['L', '198.51.100.1/32', 'Gi0/0'], ['S*', '0.0.0.0/0', 'via 198.51.100.2']],
    note: 'Tabela implicită conține doar interfețele care NU sunt în niciun VRF (aici Gi0/0, managementul spre ISP). Comenzile fără cuvântul „vrf” se uită numai aici.',
  },
};
export function VrfRouter() {
  const [v, setV] = useState<VrfKey>('RED');
  const info = VRF_INFO[v];
  const ifs: { n: string; vrf: VrfKey; x: number; y: number; side: 'l' | 'r' | 'b'; peer: string; net: string }[] = [
    { n: 'Gi0/1', vrf: 'RED', x: 230, y: 90, side: 'l', peer: 'Client RED — sucursala', net: '192.168.1.0/24' },
    { n: 'Gi0/2', vrf: 'BLUE', x: 230, y: 200, side: 'l', peer: 'Client BLUE — sucursala', net: '192.168.1.0/24' },
    { n: 'Gi0/3', vrf: 'RED', x: 490, y: 90, side: 'r', peer: 'RED — sediu', net: '172.16.0.0/16' },
    { n: 'Gi0/4', vrf: 'BLUE', x: 490, y: 200, side: 'r', peer: 'BLUE — sediu', net: '172.16.0.0/16' },
    { n: 'Gi0/0', vrf: 'global', x: 360, y: 270, side: 'b', peer: 'ISP / management', net: '198.51.100.0/30' },
  ];
  const col = (k: VrfKey) => VRF_INFO[k].c;
  return (
    <>
      <div className="segmented" role="group" aria-label="Alege tabela de rutare" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        {(['RED', 'BLUE', 'global'] as VrfKey[]).map((k) => (
          <button key={k} type="button" className={v === k ? 'on' : ''} onClick={() => setV(k)} style={v === k ? { color: col(k) } : undefined}>
            {k === 'global' ? 'Tabela globală' : `VRF ${k}`}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 720 340" width="100%" role="img" aria-label="Un router cu două VRF-uri">
        <rect x={230} y={40} width={260} height={230} rx={18} fill="var(--surface)" stroke="var(--violet)" strokeWidth={2} />
        <T x={360} y={62} weight={750} color="var(--violet)">Router R1 (un singur echipament)</T>
        {(['RED', 'BLUE', 'global'] as VrfKey[]).map((k, i) => {
          const on = v === k;
          return (
            <g key={k} style={{ cursor: 'pointer', transition: 'opacity .3s' }} opacity={on ? 1 : 0.35} onClick={() => setV(k)}>
              <rect x={256} y={76 + i * 60} width={208} height={48} rx={10} fill={on ? 'var(--surface-3)' : 'var(--surface)'} stroke={col(k)} strokeWidth={on ? 2.4 : 1.2} />
              <T x={360} y={96 + i * 60} weight={700} color={col(k)}>{k === 'global' ? 'Tabela globală' : `VRF ${k}`}</T>
              <T x={360} y={112 + i * 60} size={9.5} color="var(--muted)">RIB + FIB (CEF) proprii{k !== 'global' ? ' · ARP propriu' : ''}</T>
            </g>
          );
        })}
        {ifs.map((f) => {
          const on = v === f.vrf;
          const c = col(f.vrf);
          const ex = f.side === 'l' ? 40 : f.side === 'r' ? 680 : 360;
          const ey = f.side === 'b' ? 320 : f.y;
          return (
            <g key={f.n} opacity={on ? 1 : 0.22} style={{ transition: 'opacity .3s', cursor: 'pointer' }} onClick={() => setV(f.vrf)}>
              <line x1={f.x} y1={f.y} x2={f.side === 'b' ? 360 : ex + (f.side === 'l' ? 120 : -120)} y2={ey - (f.side === 'b' ? 20 : 0)} stroke={c} strokeWidth={on ? 3 : 2} className={on ? 'flow' : undefined} />
              <rect x={f.x - 24} y={f.y - 10} width={48} height={20} rx={5} fill="var(--surface-3)" stroke={c} strokeWidth={1.5} />
              <T x={f.x} y={f.y + 4} size={10} weight={700}>{f.n}</T>
              {f.side !== 'b' ? (
                <>
                  <rect x={f.side === 'l' ? ex : ex - 120} y={f.y - 26} width={120} height={52} rx={9} fill="var(--surface-3)" stroke={c} />
                  <T x={f.side === 'l' ? ex + 60 : ex - 60} y={f.y - 6} size={10.5} weight={650}>{f.peer}</T>
                  <T x={f.side === 'l' ? ex + 60 : ex - 60} y={f.y + 12} size={10} mono color={c}>{f.net}</T>
                </>
              ) : (
                <T x={360} y={ey + 14} size={10.5}>{f.peer} · <tspan fill="var(--muted)">{f.net}</tspan></T>
              )}
            </g>
          );
        })}
      </svg>
      <div className="code" style={{ marginTop: 10 }}>
        <div className="code-h"><span className="dots"><i /><i /><i /></span><span>R1# {info.title}</span></div>
        <pre><code>{info.rows.map((r) => <div key={r[0] + r[1]}><span style={{ color: info.c, fontWeight: 700 }}>{r[0].padEnd(4)}</span>{r[1].padEnd(18)}{r[2].startsWith('via') ? r[2] : `is directly connected, ${r[2]}`}</div>)}</code></pre>
      </div>
      <div className="callout tip" style={{ marginTop: 8 }}><div className="small">{info.note}</div></div>
    </>
  );
}

/* ---------------------------------------------------------------
   MPLS L3VPN — concept (RD, RT, PE, P, CE)
---------------------------------------------------------------- */
export function L3vpnDiagram() {
  return (
    <svg viewBox="0 0 720 280" width="100%" role="img" aria-label="MPLS L3VPN cu două clienți">
      <rect x={170} y={40} width={380} height={190} rx={60} fill="var(--accent-soft)" stroke="var(--accent)" strokeDasharray="6 5" />
      <T x={360} y={62} size={11} weight={700} color="var(--accent)">Rețeaua MPLS a operatorului (ISP)</T>
      <path d="M240 112 C 300 70, 420 70, 480 112" fill="none" stroke="var(--violet)" strokeWidth={1.8} strokeDasharray="5 4" />
      <T x={360} y={86} size={10} color="var(--violet)" weight={650}>MP-BGP: rute VPNv4 = RD + prefix, cu RT atașat</T>
      <RouterIcon x={240} y={140} label="PE1" sub="VRF A · VRF B" />
      <RouterIcon x={360} y={180} label="P" sub="nu știe rute de client" />
      <RouterIcon x={480} y={140} label="PE2" sub="VRF A · VRF B" />
      <line x1={270} y1={146} x2={332} y2={174} stroke="var(--text-2)" strokeWidth={2} />
      <line x1={388} y1={174} x2={450} y2={146} stroke="var(--text-2)" strokeWidth={2} />
      {[
        { x: 70, y: 90, l: 'CE-A1', n: '10.1.0.0/16', c: 'var(--bad)', px: 212 },
        { x: 70, y: 200, l: 'CE-B1', n: '10.1.0.0/16', c: 'var(--info)', px: 212 },
        { x: 650, y: 90, l: 'CE-A2', n: '10.2.0.0/16', c: 'var(--bad)', px: 508 },
        { x: 650, y: 200, l: 'CE-B2', n: '10.2.0.0/16', c: 'var(--info)', px: 508 },
      ].map((c) => (
        <g key={c.l}>
          <line x1={c.x + (c.x < 360 ? 30 : -30)} y1={c.y} x2={c.px} y2={140} stroke={c.c} strokeWidth={2.4} />
          <ellipse cx={c.x} cy={c.y} rx={30} ry={14} fill="var(--surface-3)" stroke={c.c} strokeWidth={1.6} />
          <T x={c.x} y={c.y + 4} size={10.5} weight={700}>{c.l}</T>
          <T x={c.x} y={c.y + 30} size={10} mono color={c.c}>{c.n}</T>
        </g>
      ))}
      <T x={70} y={260} size={10.5} color="var(--bad)" weight={650}>Client A: RD 65000:1 · RT 65000:1</T>
      <T x={650} y={260} size={10.5} color="var(--info)" weight={650}>Client B: RD 65000:2 · RT 65000:2</T>
      <T x={360} y={260} size={10} color="var(--muted)">Ambii clienți folosesc aceleași prefixe — RD le face unice</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   NFV: aparate dedicate vs funcții virtuale pe x86
---------------------------------------------------------------- */
export function NfvDiagram() {
  const [v, setV] = useState<'hw' | 'nfv'>('hw');
  const fns = [['Router', 'ISR 4000', 'Catalyst 8000V'], ['Firewall', 'Firepower', 'FTDv / ASAv'], ['WLC', 'Catalyst 9800-80', 'Catalyst 9800-CL'], ['Load balancer', 'aparat LB', 'LB virtual']];
  return (
    <>
      <Seg value={v} set={setV} label="Clasic sau NFV" opts={[['hw', 'Clasic: câte un aparat'], ['nfv', 'NFV: software pe x86']]} />
      <svg viewBox="0 0 720 220" width="100%" role="img" aria-label="Network Functions Virtualization">
        {v === 'hw' ? (
          <g className="fade-up">
            {fns.map(([f, hw], i) => (
              <g key={f}>
                <rect x={40 + i * 165} y={40} width={145} height={90} rx={10} fill="var(--surface-3)" stroke="var(--text-2)" />
                <T x={112 + i * 165} y={74} weight={700}>{f}</T>
                <T x={112 + i * 165} y={94} size={10} color="var(--muted)">{hw}</T>
                <T x={112 + i * 165} y={112} size={9.5} color="var(--warn)">hardware dedicat</T>
              </g>
            ))}
            <T x={360} y={170} size={11.5} weight={650}>4 cutii · 4 contracte de suport · livrare în săptămâni · cabluri între ele</T>
          </g>
        ) : (
          <g className="fade-up">
            {fns.map(([f, , sw], i) => (
              <Layer key={f} x={60 + i * 152} y={30} w={140} h={50} label={`${f} (VNF)`} sub={sw} color="var(--accent)" />
            ))}
            <Layer x={60} y={90} w={596} label="Hypervisor / platformă de containere (NFVI)" color="var(--violet)" />
            <Layer x={60} y={126} w={596} label="Server x86 standard" />
            <T x={360} y={190} size={11.5} weight={650}>Pornești o funcție nouă în minute, pe hardware comun — sau direct în cloud</T>
          </g>
        )}
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------
   Topologii de laborator
---------------------------------------------------------------- */
export function VrfLabTopology() {
  return (
    <svg viewBox="0 0 720 280" width="100%" role="img" aria-label="Topologie lab ghidat VRF">
      <RouterIcon x={360} y={140} label="R1 (PE)" sub="VRF CUST-A · VRF CUST-B" />
      <RouterIcon x={110} y={60} label="CE-A" sub="Lo0 10.10.10.1/24" />
      <RouterIcon x={110} y={220} label="CE-B" sub="Lo0 10.10.10.1/24" />
      <line x1={140} y1={64} x2={332} y2={132} stroke="var(--bad)" strokeWidth={2.4} />
      <line x1={140} y1={216} x2={332} y2={148} stroke="var(--info)" strokeWidth={2.4} />
      <T x={250} y={82} size={10} mono color="var(--bad)">192.168.1.0/24</T>
      <T x={180} y={106} size={9.5} color="var(--muted)">Gi0/0 .2</T><T x={300} y={118} size={9.5} color="var(--muted)">Gi0/1 .1</T>
      <T x={250} y={206} size={10} mono color="var(--info)">192.168.1.0/24</T>
      <T x={180} y={180} size={9.5} color="var(--muted)">Gi0/0 .2</T><T x={300} y={166} size={9.5} color="var(--muted)">Gi0/2 .1</T>
      <rect x={470} y={80} width={220} height={120} rx={12} fill="var(--surface-3)" stroke="var(--border)" />
      <T x={580} y={104} weight={700}>Ideea labului</T>
      <T x={580} y={126} size={10.5}>doi clienți, adresare IDENTICĂ</T>
      <T x={580} y={146} size={10.5}>un singur router</T>
      <T x={580} y={166} size={10.5} color="var(--bad)">CUST-A</T>
      <T x={580} y={186} size={10.5} color="var(--info)">CUST-B</T>
      <T x={360} y={272} size={10.5} color="var(--muted)">GNS3 / EVE-NG / CML · imagini IOSv (sau CSR1000v / Catalyst 8000V)</T>
    </svg>
  );
}
export function VrfSoloTopology() {
  return (
    <svg viewBox="0 0 720 270" width="100%" role="img" aria-label="Topologie lab solo VRF-Lite">
      <RouterIcon x={220} y={120} label="R1 (sediul)" sub="Lo10 RED · Lo20 BLUE" />
      <RouterIcon x={500} y={120} label="R2 (sucursala)" sub="Lo10 RED · Lo20 BLUE" />
      <line x1={250} y1={116} x2={470} y2={116} stroke="var(--bad)" strokeWidth={2.4} />
      <line x1={250} y1={124} x2={470} y2={124} stroke="var(--info)" strokeWidth={2.4} />
      <T x={360} y={98} size={10.5} weight={650}>un singur cablu Gi0/0 ↔ Gi0/0 (trunk 802.1Q)</T>
      <T x={360} y={146} size={10} mono color="var(--bad)">Gi0/0.10 · VLAN 10 · VRF RED · 10.0.12.0/30</T>
      <T x={360} y={162} size={10} mono color="var(--info)">Gi0/0.20 · VLAN 20 · VRF BLUE · 10.0.12.0/30</T>
      <ClientIcon x={90} y={70} kind="pc" label="LAN RED 192.168.10.0/24" />
      <ClientIcon x={90} y={190} kind="pc" label="LAN BLUE 192.168.10.0/24" />
      <ClientIcon x={630} y={70} kind="pc" label="LAN RED 192.168.20.0/24" />
      <ClientIcon x={630} y={190} kind="pc" label="LAN BLUE 192.168.20.0/24" />
      <line x1={110} y1={76} x2={194} y2={112} stroke="var(--bad)" strokeWidth={1.6} strokeDasharray="4 3" />
      <line x1={110} y1={184} x2={194} y2={128} stroke="var(--info)" strokeWidth={1.6} strokeDasharray="4 3" />
      <line x1={610} y1={76} x2={526} y2={112} stroke="var(--bad)" strokeWidth={1.6} strokeDasharray="4 3" />
      <line x1={610} y1={184} x2={526} y2={128} stroke="var(--info)" strokeWidth={1.6} strokeDasharray="4 3" />
      <T x={360} y={250} size={10.5} color="var(--muted)">LAN-urile sunt simulate cu interfețe loopback (Lo10 = RED, Lo20 = BLUE) · OSPF separat per VRF</T>
    </svg>
  );
}

/* ---------------------------------------------------------------
   VirtualBox: modurile de rețea (lab opțional)
---------------------------------------------------------------- */
type VbMode = 'nat' | 'bridged' | 'hostonly' | 'internal';
const VB: Record<VbMode, { t: string; ip: string; d: string; lan: boolean; host: boolean; vm: boolean; inet: boolean }> = {
  nat: { t: 'NAT (implicit)', ip: 'VM: 10.0.2.15 · GW 10.0.2.2', d: 'VirtualBox face NAT/PAT ca un mini-router: VM-ul iese în Internet cu IP-ul PC-ului, dar nimeni din LAN (nici măcar host-ul, fără port forwarding) nu poate iniția o conexiune spre VM.', lan: false, host: false, vm: false, inet: true },
  bridged: { t: 'Bridged Adapter', ip: 'VM: IP din LAN-ul tău (ex. 192.168.1.57 prin DHCP)', d: 'Placa fizică a PC-ului devine „uplink-ul” unui vSwitch: VM-ul apare în LAN ca un calculator separat, cu MAC propriu (08:00:27:…). Routerul de acasă îi dă IP prin DHCP.', lan: true, host: true, vm: true, inet: true },
  hostonly: { t: 'Host-only Adapter', ip: 'host: 192.168.56.1 · VM-uri: 192.168.56.x', d: 'Un vSwitch privat între PC și VM-uri, fără uplink fizic. Ideal pentru laburi: PC-ul vorbește cu VM-urile (SSH, web), dar VM-urile nu ajung în LAN/Internet.', lan: false, host: true, vm: true, inet: false },
  internal: { t: 'Internal Network', ip: 'fără DHCP implicit — IP-uri statice', d: 'Un vSwitch izolat doar între VM-uri (nici host-ul nu are interfață în el). Echivalentul unui switch neconectat la nimic altceva.', lan: false, host: false, vm: true, inet: false },
};
export function VboxModes() {
  const [m, setM] = useState<VbMode>('nat');
  const i = VB[m];
  const ok = (b: boolean) => (b ? 'var(--ok)' : 'var(--bad)');
  return (
    <>
      <Seg value={m} set={setM} label="Modul de rețea VirtualBox" opts={[['nat', 'NAT'], ['bridged', 'Bridged'], ['hostonly', 'Host-only'], ['internal', 'Internal']]} />
      <svg viewBox="0 0 720 250" width="100%" role="img" aria-label="Modurile de rețea VirtualBox">
        <rect x={30} y={20} width={420} height={200} rx={14} fill="none" stroke="var(--border)" strokeWidth={1.5} />
        <T x={44} y={40} anchor="start" size={11} weight={700} color="var(--muted)">PC-ul tău (host) · VirtualBox</T>
        <rect x={60} y={56} width={110} height={44} rx={8} fill="var(--surface-3)" stroke="var(--accent)" /><T x={115} y={83} weight={700}>VM1</T>
        <rect x={190} y={56} width={110} height={44} rx={8} fill="var(--surface-3)" stroke="var(--accent)" /><T x={245} y={83} weight={700}>VM2</T>
        <rect x={60} y={130} width={240} height={28} rx={7} fill="var(--accent-soft)" stroke="var(--accent)" />
        <T x={180} y={149} size={11} weight={700} color="var(--accent)">{m === 'nat' ? 'NAT engine (per VM)' : m === 'bridged' ? 'bridge pe placa fizică' : m === 'hostonly' ? 'vSwitch host-only (vboxnet0)' : 'vSwitch „intnet”'}</T>
        <line x1={115} y1={100} x2={115} y2={130} stroke="var(--accent)" strokeWidth={2} /><line x1={245} y1={100} x2={245} y2={130} stroke="var(--accent)" strokeWidth={2} />
        <rect x={320} y={56} width={110} height={44} rx={8} fill="var(--surface-3)" stroke={ok(i.host)} /><T x={375} y={76} size={10.5} weight={700}>host OS</T>
        <T x={375} y={92} size={9.5} color={ok(i.host)}>{i.host ? 'vede VM-urile' : 'nu vede VM-urile*'}</T>
        {i.host && <line x1={300} y1={144} x2={375} y2={100} stroke="var(--ok)" strokeWidth={2} strokeDasharray="4 3" />}
        <rect x={120} y={176} width={140} height={28} rx={7} fill="var(--surface-3)" stroke="var(--text-2)" /><T x={190} y={195} size={10.5} weight={650}>NIC fizic (Wi-Fi/Eth)</T>
        {(m === 'nat' || m === 'bridged') && <line x1={180} y1={158} x2={180} y2={176} stroke="var(--text-2)" strokeWidth={2} />}
        {(m === 'nat' || m === 'bridged') && <line x1={260} y1={190} x2={520} y2={110} stroke="var(--text-2)" strokeWidth={2} />}
        <RouterIcon x={560} y={100} label="router acasă" sub="LAN 192.168.1.0/24" />
        <rect x={500} y={170} width={180} height={50} rx={9} fill="var(--surface-3)" stroke="var(--border)" />
        <T x={590} y={190} size={10.5} weight={650} color={ok(i.lan)}>LAN → VM: {i.lan ? 'da' : 'nu'}</T>
        <T x={590} y={208} size={10.5} weight={650} color={ok(i.inet)}>VM → Internet: {i.inet ? 'da' : 'nu'}</T>
        <T x={590} y={40} size={10} mono color="var(--muted)">{i.ip}</T>
        <T x={240} y={240} size={10.5} color={ok(i.vm)} weight={650}>VM1 ↔ VM2: {i.vm ? 'da' : m === 'nat' ? 'nu (fiecare VM are NAT separat)' : 'nu'}</T>
      </svg>
      <div className="callout tip" style={{ marginTop: 8, minHeight: 56 }}><div><b>{i.t}</b><div className="small">{i.d}{m === 'nat' && ' (*host-ul ajunge la VM doar prin port forwarding.) Varianta „NAT Network” pune mai multe VM-uri în spatele aceluiași NAT, ca să se vadă între ele.'}</div></div></div>
    </>
  );
}
