import { useState, type CSSProperties } from 'react';
import { RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 4.4 (SNMP). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Operațiile SNMP între manager (NMS) și agent */
type Op = 'get' | 'set' | 'trap' | 'inform';
const OPS: Record<Op, { name: string; c: string; dir: 'm2a' | 'a2m'; port: string; ack: boolean; d: string; v: string }> = {
  get: { name: 'Get / GetNext / GetBulk', c: 'var(--accent)', dir: 'm2a', port: 'UDP 161', ack: true, d: 'Managerul (NMS) întreabă agentul: „care e valoarea obiectului X?”. Agentul răspunde cu un mesaj Response. Se numește polling: managerul inițiază. GetNext parcurge arborele MIB, iar GetBulk (de la v2c) aduce mai multe valori deodată.', v: 'v1: Get, GetNext · v2c/v3: + GetBulk' },
  set: { name: 'Set', c: 'var(--warn)', dir: 'm2a', port: 'UDP 161', ack: true, d: 'Managerul modifică o valoare pe agent (de exemplu starea administrativă a unei interfețe). Necesită acces read-write (community RW sau utilizator v3 cu drept de scriere) — de aceea este riscant.', v: 'toate versiunile' },
  trap: { name: 'Trap', c: 'var(--bad)', dir: 'a2m', port: 'UDP 162', ack: false, d: 'Agentul inițiază: trimite o notificare nesolicitată („interfața Gi0/1 a căzut!”). Trap-ul NU este confirmat: dacă se pierde, agentul nu știe.', v: 'toate versiunile' },
  inform: { name: 'Inform', c: 'var(--ok)', dir: 'a2m', port: 'UDP 162', ack: true, d: 'Ca trap-ul, dar confirmat: managerul răspunde cu un acknowledgement, iar agentul retransmite dacă nu primește confirmarea. Mai fiabil, dar consumă mai multe resurse.', v: 'v2c și v3 (nu există în v1)' },
};
export function SnmpOps() {
  const [op, setOp] = useState<Op>('get');
  const o = OPS[op];
  const m2a = o.dir === 'm2a';
  return (
    <div>
      <Seg value={op} set={setOp} label="Operația SNMP" items={[['get', 'Get'], ['set', 'Set'], ['trap', 'Trap'], ['inform', 'Inform']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Manager SNMP (NMS) și agent SNMP pe un router; săgețile arată sensul mesajelor pentru operația aleasă">
        <Box x={30} y={80} w={170} h={64} label="NMS (manager)" sub="ascultă UDP 162" c="var(--accent)" />
        <RouterIcon x={560} y={112} label="Router (agent)" sub="agent UDP 161 · MIB" />
        <Line x1={m2a ? 200 : 530} y1={100} x2={m2a ? 530 : 200} y2={100} c={o.c} w={3} flow />
        {o.ack && <Line x1={m2a ? 530 : 200} y1={124} x2={m2a ? 200 : 530} y2={124} c={o.c} w={2} dash="6 5" />}
        <T x={365} y={90} size={11} weight={650} color={o.c}>{m2a ? o.name + ' (manager → agent) · ' + o.port : o.name + ' (agent → manager) · ' + o.port}</T>
        <T x={365} y={142} size={11} weight={650} color={o.c}>{m2a ? 'Response (agent → manager)' : o.ack ? 'confirmare (manager → agent)' : 'fără confirmare'}</T>
        <T x={365} y={200} size={11} color="var(--muted)">{m2a ? 'Managerul inițiază (polling)' : 'Agentul inițiază (notificare)'}</T>
      </svg>
      <div style={note(o.c)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>{o.name}.</b> {o.d}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{o.v} · port: {o.port}</div>
      </div>
    </div>
  );
}

/* 2) Arborele MIB și OID */
export function MibTree() {
  return (
    <svg viewBox="0 0 740 330" role="img" aria-label="Arborele MIB: iso.org.dod.internet cu ramurile mgmt (mib-2) și private (enterprises, Cisco 9); exemple de OID-uri sysName și ifInOctets">
      <T x={370} y={20} size={13} weight={700}>Arborele MIB și OID-urile</T>
      <Box x={290} y={34} w={160} h={34} label="iso (1)" c="var(--border)" />
      <Box x={290} y={84} w={160} h={34} label="org (3) · dod (6)" c="var(--border)" />
      <Box x={290} y={134} w={160} h={34} label="internet (1)" sub="1.3.6.1" c="var(--accent)" />
      <Line x1={370} y1={68} x2={370} y2={84} w={1.5} /><Line x1={370} y1={118} x2={370} y2={134} w={1.5} />
      <Box x={120} y={196} w={170} h={36} label="mgmt (2) → mib-2 (1)" sub="1.3.6.1.2.1" c="var(--info)" />
      <Box x={450} y={196} w={190} h={36} label="private (4) → enterprises (1)" sub="1.3.6.1.4.1" c="var(--violet)" />
      <Line x1={340} y1={168} x2={205} y2={196} w={1.5} /><Line x1={400} y1={168} x2={545} y2={196} w={1.5} />
      <Box x={20} y={262} w={170} h={36} label="system (1)" sub="sysName .5.0" c="var(--info)" />
      <Box x={210} y={262} w={170} h={36} label="interfaces (2)" sub="ifInOctets" c="var(--info)" />
      <Box x={460} y={262} w={150} h={36} label="cisco (9)" sub="1.3.6.1.4.1.9" c="var(--violet)" />
      <Line x1={170} y1={232} x2={105} y2={262} w={1.5} /><Line x1={240} y1={232} x2={295} y2={262} w={1.5} /><Line x1={545} y1={232} x2={535} y2={262} w={1.5} />
      <T x={700} y={262} size={10.5} anchor="end" color="var(--muted)">sysName.0 = 1.3.6.1.2.1.1.5.0</T>
      <T x={700} y={280} size={10.5} anchor="end" color="var(--muted)">ifInOctets = 1.3.6.1.2.1.2.2.1.10</T>
      <T x={700} y={298} size={10.5} anchor="end" color="var(--muted)">MIB-uri standard (mib-2) vs MIB-uri de producător (enterprises)</T>
    </svg>
  );
}

/* 3) Nivelurile de securitate SNMPv3 */
export function SnmpSecurityLevels() {
  const rows: [string, string, string, string, string][] = [
    ['v1', 'community', 'nu', 'nu', 'text clar'],
    ['v2c', 'community', 'nu', 'nu', 'text clar'],
    ['v3 noAuthNoPriv', 'utilizator', 'nu', 'nu', 'doar identificare'],
    ['v3 authNoPriv', 'utilizator', 'da (MD5/SHA)', 'nu', 'integritate + autentificare'],
    ['v3 authPriv', 'utilizator', 'da', 'da (DES/AES)', 'autentificare + criptare'],
  ];
  return (
    <div className="table-wrap">
      <table className="t">
        <thead><tr><th>Model / nivel</th><th>Identitate</th><th>Autentificare</th><th>Criptare</th><th>Protecție</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={i === 0 ? 'hl' : undefined}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

/* 4) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 220" role="img" aria-label={solo ? 'Topologie lab solo SNMP: NMS, switch, router cu SNMPv3' : 'Topologie lab ghidat SNMP: NMS, switch, router cu SNMPv2c'}>
      <Box x={30} y={78} w={170} h={64} label="NMS (PC)" sub="10.0.0.9" c="var(--accent)" />
      <SwitchIcon x={330} y={110} label="SW1" />
      <RouterIcon x={560} y={110} label="R1 (agent)" sub={solo ? 'SNMPv3 · 10.0.0.1' : 'SNMPv2c · 10.0.0.1'} />
      <Line x1={200} y1={110} x2={308} y2={110} /><Line x1={352} y1={110} x2={530} y2={110} />
      <T x={380} y={200} size={10.5} color="var(--muted)">LAN 10.0.0.0/24 · traps către 10.0.0.9 · agentul răspunde pe UDP 161</T>
    </svg>
  );
}
export const LabGuidedTopology44 = () => <Topo solo={false} />;
export const LabSoloTopology44 = () => <Topo solo />;
