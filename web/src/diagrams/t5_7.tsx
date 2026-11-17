import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.7 (port security, DHCP snooping, DAI). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Simulator port security */
type Viol = 'shutdown' | 'restrict' | 'protect';
const DEVS: { id: string; label: string; mac: string }[] = [
  { id: 'A', label: 'PC-A (legitim)', mac: 'aaaa.0001' },
  { id: 'B', label: 'Laptop-B', mac: 'bbbb.0002' },
  { id: 'C', label: 'Atacator-C', mac: 'cccc.0003' },
  { id: 'D', label: 'Telefon-D', mac: 'dddd.0004' },
];

export function PortSecSim() {
  const [max, setMax] = useState(1);
  const [viol, setViol] = useState<Viol>('shutdown');
  const [sticky, setSticky] = useState(true);
  const [secure, setSecure] = useState<string[]>([]);
  const [up, setUp] = useState(true);
  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>(['Port security activat pe Fa0/1: nicio adresă învățată încă.']);
  const reset = (m = max) => { setSecure([]); setUp(true); setCount(0); setLog(['Configurație resetată (maximum ' + m + ').']); };
  const plug = (d: typeof DEVS[number]) => {
    if (!up) { setLog((l) => [`${d.label}: portul este err-disabled, nimic nu trece. Rulează shutdown / no shutdown.`, ...l].slice(0, 6)); return; }
    if (secure.includes(d.mac)) { setLog((l) => [`${d.label} (${d.mac}) este deja adresă sigură: trafic permis.`, ...l].slice(0, 6)); return; }
    if (secure.length < max) {
      setSecure([...secure, d.mac]);
      setLog((l) => [`${d.label} (${d.mac}) învățat ca adresă sigură${sticky ? ' (sticky, scris în running-config)' : ' (dinamic, nu se salvează)'} — ${secure.length + 1}/${max}.`, ...l].slice(0, 6));
      return;
    }
    if (viol === 'shutdown') {
      setUp(false); setCount(count + 1);
      setLog((l) => [`VIOLARE de la ${d.label} (${d.mac}): limita ${max} depășită → port err-disabled, syslog + contor ${count + 1}.`, ...l].slice(0, 6));
    } else if (viol === 'restrict') {
      setCount(count + 1);
      setLog((l) => [`VIOLARE de la ${d.label}: cadrele sunt aruncate, syslog + contor ${count + 1}; portul rămâne UP, cu trafic legitim în continuare.`, ...l].slice(0, 6));
    } else {
      setLog((l) => [`VIOLARE de la ${d.label}: cadrele sunt aruncate TĂCUT (fără log, fără contor); portul rămâne UP.`, ...l].slice(0, 6));
    }
  };
  const col = up ? 'var(--ok)' : 'var(--bad)';
  return (
    <div>
      <Seg value={String(max)} set={(k) => { setMax(Number(k)); reset(Number(k)); }} label="Maximum de adrese" items={[['1', 'maximum 1'], ['2', 'maximum 2'], ['3', 'maximum 3']]} />
      <Seg value={viol} set={(k) => { setViol(k); reset(); }} label="Mod de violare" items={[['shutdown', 'shutdown (implicit)'], ['restrict', 'restrict'], ['protect', 'protect']]} />
      <Seg value={sticky ? 'on' : 'off'} set={(k) => setSticky(k === 'on')} label="Învățare" items={[['on', 'sticky'], ['off', 'dinamic (nesalvat)']]} />
      <svg viewBox="0 0 720 150" role="img" aria-label="Un port de switch cu port security, adrese sigure învățate și stare">
        <SwitchIcon x={110} y={75} label="SW1" />
        <rect x={190} y={60} width={150} height={30} rx={8} fill="var(--surface-3)" stroke={col} strokeWidth={2.5} />
        <T x={265} y={80} size={12} weight={700} color={col}>Fa0/1 — {up ? 'UP (secure-up)' : 'err-disabled'}</T>
        <Line x1={136} y1={75} x2={190} y2={75} c={col} w={3} />
        <T x={540} y={30} size={11} color="var(--muted)">Adrese sigure ({secure.length}/{max})</T>
        {Array.from({ length: max }).map((_, i) => (
          <g key={i}>
            <rect x={380 + i * 110} y={44} width={100} height={30} rx={6} fill="var(--surface-3)" stroke={secure[i] ? 'var(--accent)' : 'var(--border)'} strokeWidth={1.6} strokeDasharray={secure[i] ? undefined : '4 3'} />
            <T x={430 + i * 110} y={63} size={11} m color={secure[i] ? 'var(--accent)' : 'var(--muted)'}>{secure[i] ?? '(liber)'}</T>
          </g>
        ))}
        <T x={430} y={110} size={11.5} color="var(--text-2)">Contor violări: <tspan style={{ fontWeight: 700 }}>{count}</tspan> · violation {viol}</T>
      </svg>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {DEVS.map((d) => <button key={d.id} type="button" className="btn sm" onClick={() => plug(d)}>Conectează {d.label}</button>)}
        {!up && <button type="button" className="btn sm" onClick={() => { setUp(true); setLog((l) => ['shutdown + no shutdown: portul revine UP; adresele sigure rămân (sticky) sau se reînvață.', ...l].slice(0, 6)); }}>shutdown / no shutdown</button>}
        <button type="button" className="btn sm" onClick={() => reset()}>Resetează</button>
      </div>
      <div style={note(col)}>
        {log.map((l, i) => <div key={i} style={{ fontSize: 13, color: i === 0 ? 'var(--text)' : 'var(--muted)', marginBottom: 2 }}>{l}</div>)}
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
        Mod de lucru: „conectează” = un dispozitiv cu acel MAC trimite cadre pe port (pe port pot fi mai multe prin hub/mini-switch/telefon). Aceeași adresă învățată pe alt port ar fi o altă violare (nu e simulată aici).
      </div>
    </div>
  );
}

/* 2) DHCP snooping */
export function DhcpSnoopingDemo() {
  const [snoop, setSnoop] = useState(true);
  const [trustUp, setTrustUp] = useState(true);
  const rogueDropped = snoop;
  const legitDropped = snoop && !trustUp;
  const clientIp = rogueDropped ? (legitDropped ? 'nimic (nicio ofertă)' : '192.168.10.50 (de la serverul legitim)') : '10.66.6.20 (de la serverul fals!)';
  return (
    <div>
      <Seg value={snoop ? 'on' : 'off'} set={(k) => setSnoop(k === 'on')} label="DHCP snooping" items={[['off', 'Fără DHCP snooping'], ['on', 'DHCP snooping pornit (VLAN 10)']]} />
      <Seg value={trustUp ? 'on' : 'off'} set={(k) => setTrustUp(k === 'on')} label="Portul spre serverul legitim" items={[['on', 'ip dhcp snooping trust pe Gi0/1'], ['off', 'Netrusted (greșeală de configurare)']]} />
      <svg viewBox="0 0 720 270" role="img" aria-label="DHCP snooping: oferta serverului legitim pe port trusted și oferta serverului fals pe port untrusted">
        <SwitchIcon x={360} y={120} label="SW1" />
        <RouterIcon x={110} y={60} label="DHCP legitim" sub="192.168.10.1" />
        <Box x={560} y={30} w={140} h={50} label="Server DHCP fals" sub="10.66.6.1" c="var(--bad)" />
        <ClientIcon x={110} y={200} label="Client nou" kind="pc" />
        <Line x1={136} y1={64} x2={334} y2={112} c={trustUp ? 'var(--ok)' : 'var(--warn)'} w={3} />
        <Line x1={560} y1={60} x2={386} y2={112} c="var(--bad)" w={3} />
        <Line x1={134} y1={196} x2={334} y2={130} c="var(--accent)" w={3} />
        <T x={235} y={74} size={10.5} weight={700} color={trustUp ? 'var(--ok)' : 'var(--warn)'}>Gi0/1 {snoop ? (trustUp ? 'TRUSTED' : 'untrusted') : '(fără snooping)'}</T>
        <T x={500} y={88} size={10.5} weight={700} color="var(--bad)">Fa0/3 {snoop ? 'untrusted' : '(fără snooping)'}</T>
        <T x={215} y={178} size={10.5} weight={700} color="var(--accent)">Fa0/1 {snoop ? 'untrusted' : ''}</T>
        {/* Oferta fals */}
        <g>
          <rect x={430} y={140} width={150} height={26} rx={13} fill="var(--surface-3)" stroke={rogueDropped ? 'var(--ok)' : 'var(--bad)'} strokeWidth={2} />
          <T x={505} y={157} size={10.5} weight={700} color={rogueDropped ? 'var(--ok)' : 'var(--bad)'}>OFFER fals: {rogueDropped ? 'ARUNCAT' : 'ACCEPTAT'}</T>
        </g>
        <g>
          <rect x={150} y={96} width={150} height={26} rx={13} fill="var(--surface-3)" stroke={legitDropped ? 'var(--bad)' : 'var(--ok)'} strokeWidth={2} />
          <T x={225} y={113} size={10.5} weight={700} color={legitDropped ? 'var(--bad)' : 'var(--ok)'}>OFFER legitim: {legitDropped ? 'ARUNCAT' : 'TRECE'}</T>
        </g>
        <T x={360} y={240} size={12} color="var(--text-2)">Client primește: <tspan style={{ fontWeight: 700 }}>{clientIp}</tspan></T>
        {snoop && !legitDropped && <T x={360} y={260} size={10.5} color="var(--muted)" m>binding: aaaa.0001 · 192.168.10.50 · VLAN 10 · Fa0/1 · lease 86400 s</T>}
      </svg>
      <div style={note(rogueDropped && !legitDropped ? 'var(--ok)' : 'var(--bad)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {!snoop && 'Fără snooping, switch-ul transmite orice mesaj DHCP pe orice port. Clientul ia prima ofertă primită: dacă e cea falsă, primește gateway și DNS ale atacatorului (man-in-the-middle) sau o rețea inexistentă (DoS).'}
          {snoop && trustUp && 'Cu snooping, doar porturile TRUSTED pot trimite mesaje „de server” (OFFER, ACK, NAK). Oferta de pe Fa0/3 (untrusted) este aruncată, iar switch-ul construiește tabela de binding (MAC, IP, VLAN, port, lease) din tranzacția legitimă.'}
          {snoop && !trustUp && 'Greșeală frecventă: după pornirea snooping-ului, portul spre serverul DHCP legitim (sau uplinkul spre el) rămâne untrusted. Switch-ul aruncă și oferta legitimă: nimeni nu mai primește adresă. Regula: trust pe uplinkuri și pe portul serverului.'}
        </div>
      </div>
    </div>
  );
}

/* 3) DAI */
type Sc = 'legit' | 'spoof' | 'static';
export function DaiDemo() {
  const [dai, setDai] = useState(true);
  const [sc, setSc] = useState<Sc>('spoof');
  const binding = [
    { ip: '192.168.10.20', mac: 'aaaa.0001', port: 'Fa0/1' },
    { ip: '192.168.10.30', mac: 'bbbb.0002', port: 'Fa0/2' },
  ];
  const pkt = sc === 'legit'
    ? { who: 'PC-A (Fa0/1)', says: '„192.168.10.20 este la aaaa.0001”', ip: '192.168.10.20', mac: 'aaaa.0001', port: 'Fa0/1' }
    : sc === 'spoof'
      ? { who: 'Atacator (Fa0/3)', says: '„192.168.10.30 este la cccc.0003”', ip: '192.168.10.30', mac: 'cccc.0003', port: 'Fa0/3' }
      : { who: 'Imprimantă IP statică (Fa0/4)', says: '„192.168.10.200 este la eeee.0005”', ip: '192.168.10.200', mac: 'eeee.0005', port: 'Fa0/4' };
  const b = binding.find((x) => x.ip === pkt.ip);
  const ok = !dai || (!!b && b.mac === pkt.mac && b.port === pkt.port);
  const reason = !dai ? '' : !b ? 'IP-ul nu apare în binding table (host cu IP static, fără ARP ACL)' : b.mac !== pkt.mac ? `IP-ul ${pkt.ip} este legat de ${b.mac}, nu de ${pkt.mac}` : b.port !== pkt.port ? 'portul nu corespunde bindingului' : 'IP, MAC și port se potrivesc cu bindingul';
  return (
    <div>
      <Seg value={dai ? 'on' : 'off'} set={(k) => setDai(k === 'on')} label="DAI" items={[['off', 'Fără DAI'], ['on', 'ip arp inspection vlan 10']]} />
      <Seg value={sc} set={setSc} label="Scenariu" items={[['legit', 'ARP legitim'], ['spoof', 'ARP spoofing'], ['static', 'Host cu IP static']]} />
      <svg viewBox="0 0 720 210" role="img" aria-label="Dynamic ARP Inspection: un mesaj ARP verificat față de tabela de binding">
        <ClientIcon x={80} y={110} label={pkt.who.split(' (')[0]} kind="pc" />
        <SwitchIcon x={340} y={110} label="SW1" />
        <rect x={470} y={46} width={230} height={92} rx={8} fill="var(--surface-3)" stroke="var(--border)" strokeWidth={1.4} />
        <T x={585} y={64} size={10.5} weight={700}>DHCP snooping binding table</T>
        {binding.map((r, i) => <T key={r.ip} x={480} y={86 + i * 22} anchor="start" size={10} m color={b && b.ip === r.ip ? 'var(--accent)' : 'var(--muted)'}>{r.ip} {r.mac} {r.port}</T>)}
        <Line x1={106} y1={110} x2={314} y2={110} c={ok ? 'var(--ok)' : 'var(--bad)'} w={3} flow={ok} />
        <T x={210} y={96} size={10.5} color="var(--text-2)">ARP: {pkt.says.length > 34 ? pkt.says.slice(0, 33) + '…' : pkt.says}</T>
        <rect x={150} y={128} width={120} height={26} rx={13} fill="var(--surface-3)" stroke={ok ? 'var(--ok)' : 'var(--bad)'} strokeWidth={2} />
        <T x={210} y={145} size={11} weight={700} color={ok ? 'var(--ok)' : 'var(--bad)'}>{ok ? 'LASAT SĂ TREACĂ' : 'ARUNCAT + log'}</T>
        <T x={360} y={196} size={11} color="var(--muted)">{dai ? 'Verificare: IP+MAC+port din ARP ↔ binding' : 'Switch-ul nu verifică nimic'}</T>
      </svg>
      <div style={note(ok ? (sc === 'spoof' ? 'var(--bad)' : 'var(--ok)') : 'var(--warn)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          <b>{pkt.who}</b> trimite un ARP care spune {pkt.says}. {dai ? (ok ? `DAI îl lasă să treacă (${reason}).` : `DAI îl aruncă: ${reason}.`) : (sc === 'spoof' ? 'Fără DAI, ceilalți vor memora greșit asocierea (ARP cache poisoned): traficul pentru 192.168.10.30 ajunge la atacator.' : 'Fără DAI, ARP-ul trece fără verificare.')}
          {dai && sc === 'static' && ' Soluție: ARP ACL cu perechea IP–MAC a imprimantei sau portul marcat trusted.'}
        </div>
      </div>
    </div>
  );
}

/* 4) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 270" role="img" aria-label={solo ? 'Topologie lab solo: switch cu client, atacator și router DHCP' : 'Topologie lab ghidat: switch cu doi clienți, un server DHCP fals și routerul DHCP legitim'}>
      <RouterIcon x={650} y={125} label="R1" sub="DHCP 192.168.10.1" />
      <SwitchIcon x={400} y={125} label="SW1" />
      <ClientIcon x={90} y={50} label="PC1" kind="pc" />
      <ClientIcon x={90} y={125} label="PC2" kind="pc" />
      <ClientIcon x={90} y={200} label={solo ? 'Atacator' : 'Rogue DHCP'} kind="pc" />
      <Line x1={114} y1={54} x2={374} y2={118} /><Line x1={114} y1={125} x2={374} y2={125} /><Line x1={114} y1={196} x2={374} y2={134} />
      <Line x1={426} y1={125} x2={624} y2={125} />
      <T x={230} y={78} size={10} m color="var(--muted)">Fa0/1</T><T x={230} y={118} size={10} m color="var(--muted)">Fa0/2</T><T x={230} y={186} size={10} m color="var(--muted)">Fa0/3</T>
      <T x={520} y={116} size={10} m color="var(--muted)">Gi0/1</T>
      <T x={380} y={250} size={11} color="var(--muted)">{solo ? 'Port security, snooping și DAI primite cu defecte: găsește-le' : 'VLAN 10 · 192.168.10.0/24 · R1 este serverul DHCP legitim'}</T>
    </svg>
  );
}
export const LabGuidedTopology57 = () => <Topo solo={false} />;
export const LabSoloTopology57 = () => <Topo solo />;
