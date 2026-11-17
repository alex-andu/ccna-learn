import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 6.3 (arhitectură SDN: plane, underlay/overlay/fabric, API northbound/southbound). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* ---------------------------------------------------------------
   1) Separarea planurilor: control distribuit vs controller (6.3.a)
   --------------------------------------------------------------- */
type Arch = 'trad' | 'sdn';
export function PlaneSeparation() {
  const [arch, setArch] = useState<Arch>('trad');
  const [fail, setFail] = useState(false);
  const xs = [70, 280, 490];
  const dev = (x: number, k: string) => (
    <g key={k}>
      <rect x={x - 62} y={186} width={124} height={76} rx={10} fill="var(--surface-3)" stroke={fail && k === 'R2' ? 'var(--bad)' : 'var(--border)'} strokeWidth={1.6} />
      <T x={x} y={203} size={11} weight={700}>{k}</T>
      <rect x={x - 54} y={210} width={108} height={20} rx={4} fill="var(--accent-soft)" stroke="var(--violet)" strokeWidth={1.2} opacity={arch === 'trad' ? 1 : 0.25} strokeDasharray={arch === 'trad' ? undefined : '4 3'} />
      <T x={x} y={224} size={10} color={arch === 'trad' ? 'var(--text)' : 'var(--muted)'}>{arch === 'trad' ? 'control plane (local)' : 'control plane (mutat)'}</T>
      <rect x={x - 54} y={236} width={108} height={20} rx={4} fill="var(--accent-soft)" stroke="var(--ok)" strokeWidth={1.2} />
      <T x={x} y={250} size={10}>data plane (local)</T>
    </g>
  );
  return (
    <div>
      <Seg value={arch} set={setArch} label="Arhitectura" items={[['trad', 'Tradițional (control distribuit)'], ['sdn', 'SDN (control centralizat)']]} />
      <svg viewBox="0 0 560 280" width="100%" role="img" aria-label="Separarea planului de control de planul de date">
        {arch === 'sdn' && (
          <g>
            <rect x={160} y={14} width={240} height={64} rx={10} fill="var(--accent-soft)" stroke="var(--violet)" strokeWidth={2.4} />
            <T x={280} y={38} weight={700} size={13}>Controller SDN</T>
            <T x={280} y={56} size={11} color="var(--muted)">control plane centralizat · imaginea întregii rețele</T>
            {xs.map((x) => <Line key={x} x1={280} y1={78} x2={x} y2={186} c="var(--accent)" w={1.8} flow />)}
            <T x={150} y={134} size={10} color="var(--accent)" weight={700}>southbound (reguli de forwarding)</T>
          </g>
        )}
        {arch === 'trad' && (
          <g>
            <Line x1={132} y1={218} x2={218} y2={218} c="var(--violet)" w={2} flow />
            <Line x1={342} y1={218} x2={428} y2={218} c="var(--violet)" w={2} flow />
            <T x={175} y={170} size={10} color="var(--violet)">OSPF/STP/ARP</T>
            <T x={385} y={170} size={10} color="var(--violet)">OSPF/STP/ARP</T>
            <T x={280} y={110} size={12} color="var(--muted)">fiecare echipament decide singur, schimbând mesaje de protocol cu vecinii</T>
          </g>
        )}
        {xs.map((x, i) => dev(x, ['R1', 'R2', 'R3'][i]))}
        {fail && <T x={280} y={276} size={11} color="var(--bad)" weight={700}>R2 pierde legătura cu R3</T>}
      </svg>
      <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center', margin: '6px 0' }}>
        <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} /> Simulează o defecțiune de legătură
      </label>
      <div style={note(arch === 'trad' ? 'var(--violet)' : 'var(--accent)')}>
        {arch === 'trad' && !fail && <p style={{ margin: 0, fontSize: 13 }}><b>Tradițional:</b> fiecare echipament are propriul control plane și propriul data plane (în același „cutie”). Tabelele de rutare se construiesc local prin protocoale.</p>}
        {arch === 'trad' && fail && <p style={{ margin: 0, fontSize: 13 }}><b>Tradițional:</b> echipamentele vecine detectează căderea (timere, Hello), își retrimit informația (LSA/BPDU) și <b>fiecare recalculează</b> singur noua cale. Convergența este distribuită.</p>}
        {arch === 'sdn' && !fail && <p style={{ margin: 0, fontSize: 13 }}><b>SDN:</b> deciziile (control plane) se iau într-un controller; echipamentele păstrează doar <b>data plane</b> și primesc reguli de forwarding prin API southbound (de exemplu OpenFlow). Aplicațiile cer servicii controller-ului prin API northbound.</p>}
        {arch === 'sdn' && fail && <p style={{ margin: 0, fontSize: 13 }}><b>SDN:</b> controller-ul află de defecțiune, recalculează calea pentru întreaga rețea și <b>programează din nou</b> echipamentele. Avantaj: decizie globală, optimă. Risc: dependență de controller și de conexiunea cu el.</p>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   2) Underlay + overlay: drumul unui pachet printr-un fabric cu VXLAN
   --------------------------------------------------------------- */
type Hop = 'a' | 'e1' | 'core' | 'e2' | 'b';
const HOPS: Record<Hop, { name: string; layers: { t: string; c: string; sub: string }[]; txt: string }> = {
  a: { name: 'Host A', layers: [
    { t: 'Ethernet', c: 'var(--text-2)', sub: 'A → Edge 1' },
    { t: 'IP', c: 'var(--accent)', sub: '10.1.1.10 → 10.1.2.20' },
    { t: 'Date', c: 'var(--muted)', sub: 'payload' },
  ], txt: 'Host A trimite un pachet obișnuit către Host B (10.1.2.20). Nu știe nimic despre fabric, tunele sau underlay.' },
  e1: { name: 'Edge 1', layers: [
    { t: 'Ethernet (outer)', c: 'var(--text-2)', sub: 'Edge 1 → next hop underlay' },
    { t: 'IP outer', c: 'var(--info)', sub: '172.16.0.1 → 172.16.0.2 (RLOC)' },
    { t: 'UDP 4789', c: 'var(--info)', sub: 'port VXLAN' },
    { t: 'VXLAN', c: 'var(--violet)', sub: 'VNI (segment) · grup/SGT' },
    { t: 'Ethernet (inner)', c: 'var(--text-2)', sub: 'cadrul original' },
    { t: 'IP inner', c: 'var(--accent)', sub: '10.1.1.10 → 10.1.2.20' },
    { t: 'Date', c: 'var(--muted)', sub: 'payload' },
  ], txt: 'Edge 1 (VTEP) întreabă planul de control (în SD-Access: LISP) unde se află destinația, apoi încapsulează pachetul original într-un pachet nou, adresat către Edge 2 (adresa RLOC din underlay).' },
  core: { name: 'Underlay', layers: [
    { t: 'Ethernet (outer)', c: 'var(--text-2)', sub: 'se rescrie la fiecare hop' },
    { t: 'IP outer', c: 'var(--info)', sub: '172.16.0.1 → 172.16.0.2' },
    { t: 'UDP + VXLAN + pachetul original', c: 'var(--muted)', sub: 'conținut opac pentru underlay' },
  ], txt: 'Routerele din underlay se uită DOAR la IP-ul exterior: rutează între adrese RLOC cu un IGP obișnuit. Nu cunosc adresele 10.1.x.x ale gazdelor, VLAN-urile sau politicile.' },
  e2: { name: 'Edge 2', layers: [
    { t: 'Ethernet (outer)', c: 'var(--text-2)', sub: '→ Edge 2' },
    { t: 'IP outer + UDP + VXLAN', c: 'var(--info)', sub: 'se elimină la decapsulare' },
    { t: 'Pachetul original', c: 'var(--accent)', sub: 'rămâne neschimbat' },
  ], txt: 'Edge 2 recunoaște UDP 4789, citește VNI/grupul (aplică politica de grup), elimină antetele exterioare (decapsulare) și livrează pachetul original gazdei B.' },
  b: { name: 'Host B', layers: [
    { t: 'Ethernet', c: 'var(--text-2)', sub: 'Edge 2 → B' },
    { t: 'IP', c: 'var(--accent)', sub: '10.1.1.10 → 10.1.2.20' },
    { t: 'Date', c: 'var(--muted)', sub: 'payload' },
  ], txt: 'Host B primește exact ce a trimis A. Din punctul de vedere al gazdelor, rețeaua este un singur segment logic: asta este overlay-ul.' },
};
export function UnderlayOverlay() {
  const [h, setH] = useState<Hop>('e1');
  const hop = HOPS[h];
  const pos: Record<Hop, number> = { a: 50, e1: 150, core: 280, e2: 410, b: 510 };
  return (
    <div>
      <Seg value={h} set={setH} label="Alege punctul din drum" items={[['a', 'Host A'], ['e1', 'Edge 1'], ['core', 'Underlay'], ['e2', 'Edge 2'], ['b', 'Host B']]} />
      <svg viewBox="0 0 560 150" width="100%" role="img" aria-label="Drumul unui pachet printr-un fabric cu underlay și overlay">
        <rect x={120} y={24} width={320} height={86} rx={12} fill="none" stroke="var(--info)" strokeWidth={1.6} strokeDasharray="6 4" />
        <T x={280} y={20} size={10} color="var(--info)" weight={700}>fabric = underlay + overlay</T>
        <path d="M 150 62 C 210 20, 350 20, 410 62" fill="none" stroke="var(--violet)" strokeWidth={3} strokeDasharray="2 6" strokeLinecap="round" />
        <T x={280} y={42} size={10} color="var(--violet)">overlay (tunel VXLAN)</T>
        <Line x1={150} y1={92} x2={280} y2={92} c="var(--text-2)" w={2} />
        <Line x1={280} y1={92} x2={410} y2={92} c="var(--text-2)" w={2} />
        <T x={215} y={106} size={9} color="var(--muted)">underlay IP</T><T x={345} y={106} size={9} color="var(--muted)">underlay IP</T>
        <ClientIcon x={50} y={80} label="Host A" kind="pc" />
        <SwitchIcon x={150} y={80} label="Edge 1" />
        <RouterIcon x={280} y={80} label="Core" />
        <SwitchIcon x={410} y={80} label="Edge 2" />
        <ClientIcon x={510} y={80} label="Host B" kind="pc" />
        <Line x1={74} y1={80} x2={128} y2={80} c="var(--accent)" w={1.8} />
        <Line x1={432} y1={80} x2={486} y2={80} c="var(--accent)" w={1.8} />
        <circle cx={pos[h]} cy={134} r={6} fill="var(--accent)" />
        <T x={pos[h]} y={147} size={9} color="var(--accent)" weight={700}>{hop.name}</T>
      </svg>
      <div style={{ ...note('var(--accent)'), marginTop: 6 }}>
        <p style={{ margin: 0, fontSize: 13 }}>{hop.txt}</p>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {hop.layers.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '4px 10px', border: '1px solid ' + l.c, borderRadius: 6, background: 'var(--surface-3)', fontSize: 12 }}>
              <b style={{ color: l.c }}>{l.t}</b><span style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' }}>{l.sub}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--muted)' }}>Adresele sunt exemple. În SD-Access, VXLAN este extins cu informație de grup (SGT) pentru politici.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   3) Rolurile unui fabric SD-Access
   --------------------------------------------------------------- */
type Role = 'cc' | 'ise' | 'cp' | 'edge' | 'border' | 'inter';
const ROLES: Record<Role, { n: string; d: string }> = {
  cc: { n: 'Catalyst Center', d: 'Controller de management și orchestrare: proiectezi fabric-ul, definești politicile, provizionezi nodurile și monitorizezi (assurance). Nu stă pe calea pachetelor de date.' },
  ise: { n: 'ISE', d: 'Identity Services Engine: autentifică utilizatorii/dispozitivele și atribuie grupul (SGT) folosit în politici. Cooperează cu Catalyst Center.' },
  cp: { n: 'Control plane node', d: 'Ține baza de date „cine unde se află” (în SD-Access, LISP map-server/map-resolver): potrivește identitatea gazdei (adresa) cu locația ei (edge-ul). Nodurile edge o interoghează.' },
  edge: { n: 'Fabric edge node', d: 'Punctul unde se conectează gazdele (acces). Încapsulează/decapsulează VXLAN, înregistrează gazdele la control plane node și aplică politica de grup.' },
  border: { n: 'Fabric border node', d: 'Conectează fabric-ul cu exteriorul (WAN, Internet, data center, alte fabric-uri) și face traducerea între lumea fabric și cea clasică.' },
  inter: { n: 'Intermediate node', d: 'Noduri din underlay care doar transportă IP între edge, border și control plane. Nu cunosc nimic despre overlay.' },
};
export function FabricRoles() {
  const [r, setR] = useState<Role>('edge');
  const box = (k: Role, x: number, y: number, w: number, h: number, label: string, c: string) => (
    <g key={k} onClick={() => setR(k)} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={r === k ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={r === k ? 'var(--accent)' : c} strokeWidth={r === k ? 3 : 1.5} />
      <T x={x + w / 2} y={y + h / 2 + 4} size={11} weight={700}>{label}</T>
    </g>
  );
  return (
    <div>
      <svg viewBox="0 0 560 250" width="100%" role="img" aria-label="Rolurile din fabric-ul SD-Access">
        {box('cc', 60, 10, 190, 34, 'Catalyst Center', 'var(--accent)')}
        {box('ise', 310, 10, 190, 34, 'ISE (identitate/politici)', 'var(--info)')}
        <Line x1={250} y1={27} x2={310} y2={27} c="var(--muted)" w={1.5} dash="4 3" />
        <rect x={20} y={64} width={520} height={176} rx={12} fill="none" stroke="var(--info)" strokeWidth={1.6} strokeDasharray="6 4" />
        <T x={60} y={80} size={10} color="var(--info)" weight={700} anchor="start">fabric</T>
        {box('cp', 215, 92, 130, 30, 'Control plane node', 'var(--violet)')}
        {box('border', 40, 140, 130, 30, 'Border node', 'var(--warn)')}
        {box('border', 390, 140, 130, 30, 'Border node', 'var(--warn)')}
        {box('inter', 215, 148, 130, 30, 'Intermediate', 'var(--muted)')}
        {box('edge', 90, 200, 130, 30, 'Edge node', 'var(--ok)')}
        {box('edge', 340, 200, 130, 30, 'Edge node', 'var(--ok)')}
        <Line x1={280} y1={122} x2={280} y2={148} c="var(--muted)" w={1.5} />
        <Line x1={215} y1={163} x2={170} y2={155} c="var(--muted)" w={1.5} /><Line x1={345} y1={163} x2={390} y2={155} c="var(--muted)" w={1.5} />
        <Line x1={250} y1={178} x2={170} y2={200} c="var(--muted)" w={1.5} /><Line x1={310} y1={178} x2={400} y2={200} c="var(--muted)" w={1.5} />
        <Line x1={155} y1={44} x2={280} y2={92} c="var(--accent)" w={1.2} dash="3 3" />
      </svg>
      <div style={note('var(--accent)')}>
        <p style={{ margin: 0 }}><b>{ROLES[r].n}</b></p>
        <p style={{ margin: '6px 0 0', fontSize: 13 }}>{ROLES[r].d}</p>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>Apasă pe un nod din schemă. Schema este simplificată: un fabric real are mai multe noduri și redundanță.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   4) API-uri northbound și southbound (6.3.b)
   --------------------------------------------------------------- */
type Proto = 'rest' | 'netconf' | 'restconf' | 'openflow' | 'cli' | 'snmp' | 'opflex';
const PROTOS: Record<Proto, { n: string; dir: 'NB' | 'SB'; d: string; meta: string }> = {
  rest: { n: 'REST API (HTTPS)', dir: 'NB', d: 'Interfața prin care aplicațiile și scripturile cer controller-ului inventar, politici, acțiuni. Cereri HTTP(S) cu metode (GET/POST/PUT/DELETE) și date de obicei JSON.', meta: 'HTTPS (TCP 443) · JSON/XML · 6.5' },
  netconf: { n: 'NETCONF', dir: 'SB', d: 'Protocol de management programatic pentru echipamente: mesaje XML descrise de modele YANG, peste SSH. Operații precum get-config și edit-config; suportă tranzacții.', meta: 'SSH (TCP 830) · XML · YANG' },
  restconf: { n: 'RESTCONF', dir: 'SB', d: 'Aceleași modele YANG ca NETCONF, dar accesate cu metode HTTP (GET/POST/PUT/PATCH/DELETE) și date JSON sau XML, într-un stil REST.', meta: 'HTTPS (TCP 443) · JSON/XML · YANG' },
  openflow: { n: 'OpenFlow', dir: 'SB', d: 'Protocol SDN „pur”: controller-ul programează direct tabelele de flux ale unui switch (potrivire pe câmpuri de antet → acțiune). Separă complet control plane de data plane.', meta: 'TCP 6653 · controller ↔ switch' },
  cli: { n: 'CLI prin SSH (și Telnet)', dir: 'SB', d: 'Cea mai veche interfață: controller-ul „tastează” comenzi și interpretează textul. Funcționează pe aproape orice echipament, dar output-ul nestructurat e fragil.', meta: 'SSH (TCP 22)' },
  snmp: { n: 'SNMP', dir: 'SB', d: 'Folosit de controller-e mai ales pentru inventar și monitorizare (citire), uneori și pentru configurări simple. Echipamente mai vechi.', meta: 'UDP 161/162 · MIB/OID' },
  opflex: { n: 'OpFlex', dir: 'SB', d: 'Protocol declarativ folosit în Cisco ACI între controller (APIC) și nodurile fabric: controller-ul transmite politica, iar echipamentele o implementează local.', meta: 'Cisco ACI · peste nivelul CCNA' },
};
export function ApiLayers() {
  const [p, setP] = useState<Proto>('rest');
  const chip = (k: Proto, x: number, y: number) => {
    const on = p === k;
    return (
      <g key={k} onClick={() => setP(k)} style={{ cursor: 'pointer' }}>
        <rect x={x} y={y} width={78} height={22} rx={11} fill={on ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={on ? 'var(--accent)' : PROTOS[k].dir === 'NB' ? 'var(--info)' : 'var(--ok)'} strokeWidth={on ? 2.6 : 1.3} />
        <T x={x + 39} y={y + 15} size={10} weight={650}>{k === 'rest' ? 'REST' : k === 'openflow' ? 'OpenFlow' : k === 'restconf' ? 'RESTCONF' : k === 'netconf' ? 'NETCONF' : k === 'cli' ? 'CLI/SSH' : k === 'snmp' ? 'SNMP' : 'OpFlex'}</T>
      </g>
    );
  };
  return (
    <div>
      <svg viewBox="0 0 560 270" width="100%" role="img" aria-label="Straturile aplicații, controller și echipamente, cu API-urile northbound și southbound">
        <Box x={80} y={10} w={400} h={34} label="Aplicații și automatizări" sub="Python · portal de tichete · orchestrator" c="var(--info)" />
        <Line x1={280} y1={44} x2={280} y2={72} c="var(--info)" w={2.2} flow />
        <T x={400} y={63} size={10} color="var(--info)" weight={700}>API NORTHBOUND ↑</T>
        {chip('rest', 241, 76)}
        <Box x={110} y={106} w={340} h={44} label="Controller SDN" sub="Catalyst Center · OpenDaylight · APIC" c="var(--accent)" fill="var(--accent-soft)" />
        <Line x1={280} y1={150} x2={280} y2={176} c="var(--ok)" w={2.2} flow />
        <T x={420} y={168} size={10} color="var(--ok)" weight={700}>API SOUTHBOUND ↓</T>
        {chip('netconf', 20, 178)}{chip('restconf', 104, 178)}{chip('openflow', 188, 178)}{chip('cli', 272, 178)}{chip('snmp', 356, 178)}{chip('opflex', 440, 178)}
        <Box x={60} y={222} w={120} h={34} label="Switch" c="var(--border)" />
        <Box x={220} y={222} w={120} h={34} label="Router" c="var(--border)" />
        <Box x={380} y={222} w={120} h={34} label="WLC / AP" c="var(--border)" />
        <Line x1={120} y1={206} x2={120} y2={222} c="var(--ok)" w={1.2} /><Line x1={280} y1={206} x2={280} y2={222} c="var(--ok)" w={1.2} /><Line x1={440} y1={206} x2={440} y2={222} c="var(--ok)" w={1.2} />
      </svg>
      <div style={note(PROTOS[p].dir === 'NB' ? 'var(--info)' : 'var(--ok)')}>
        <p style={{ margin: 0 }}><b>{PROTOS[p].n}</b> — <span style={{ color: PROTOS[p].dir === 'NB' ? 'var(--info)' : 'var(--ok)' }}>{PROTOS[p].dir === 'NB' ? 'northbound (spre aplicații)' : 'southbound (spre echipamente)'}</span></p>
        <p style={{ margin: '6px 0 0', fontSize: 13 }}>{PROTOS[p].d}</p>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)', fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' }}>{PROTOS[p].meta}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Topologii de laborator
   --------------------------------------------------------------- */
function Overlay({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 580 230" width="100%" role="img" aria-label={solo ? 'Topologie lab 6.3 solo: tunel GRE peste underlay' : 'Topologie lab 6.3 ghidat: tunel GRE peste underlay OSPF'}>
      <ClientIcon x={30} y={105} label="PC-A" kind="pc" />
      <T x={30} y={150} size={9} color="var(--muted)" m>192.168.1.10</T>
      <RouterIcon x={110} y={105} label="R1" sub="Lo0 1.1.1.1" />
      <RouterIcon x={230} y={105} label="R2" />
      <RouterIcon x={350} y={105} label="R3" />
      <RouterIcon x={470} y={105} label="R4" sub="Lo0 4.4.4.4" />
      <ClientIcon x={550} y={105} label="PC-B" kind="pc" />
      <T x={550} y={150} size={9} color="var(--muted)" m>192.168.2.10</T>
      <Line x1={44} y1={105} x2={84} y2={105} c="var(--accent)" />
      <Line x1={136} y1={105} x2={204} y2={105} c="var(--text-2)" />
      <Line x1={256} y1={105} x2={324} y2={105} c="var(--text-2)" />
      <Line x1={376} y1={105} x2={444} y2={105} c="var(--text-2)" />
      <Line x1={496} y1={105} x2={536} y2={105} c="var(--accent)" />
      <path d="M 110 78 C 170 20, 410 20, 470 78" fill="none" stroke="var(--violet)" strokeWidth={3} strokeDasharray="2 6" strokeLinecap="round" />
      <T x={290} y={34} size={11} color="var(--violet)" weight={700}>overlay: Tunnel0 (GRE) 10.255.0.0/30</T>
      <T x={290} y={186} size={11} color="var(--muted)">underlay: R1–R2–R3–R4 cu OSPF (10.0.12.0/30, 10.0.23.0/30, 10.0.34.0/30)</T>
      <T x={290} y={206} size={10} color="var(--muted)">{solo ? 'Una dintre configurații are mai multe defecte — găsește-le' : 'R2 și R3 nu cunosc 192.168.x.x: aceste rețele circulă doar prin tunel'}</T>
    </svg>
  );
}
export const LabGuidedTopology63 = () => <Overlay solo={false} />;
export const LabSoloTopology63 = () => <Overlay solo />;
