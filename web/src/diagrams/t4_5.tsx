import { useState, type CSSProperties } from 'react';
import { RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T, mono } from './l2kit';

/* Diagrame originale pentru 4.5 (syslog). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

const SEV: { n: number; name: string; desc: string; ex: string }[] = [
  { n: 0, name: 'emergencies', desc: 'Sistemul este inutilizabil', ex: 'repornire fatală, defecțiune hardware majoră' },
  { n: 1, name: 'alerts', desc: 'Acțiune imediată necesară', ex: 'temperatură critică' },
  { n: 2, name: 'critical', desc: 'Condiție critică', ex: 'defecțiune de alimentare / ventilator' },
  { n: 3, name: 'errors', desc: 'Condiție de eroare', ex: '%LINK-3-UPDOWN: interfața a căzut' },
  { n: 4, name: 'warnings', desc: 'Avertisment', ex: 'prag depășit, duplex nepotrivit' },
  { n: 5, name: 'notifications', desc: 'Eveniment normal, dar semnificativ', ex: '%LINEPROTO-5-UPDOWN, %SYS-5-CONFIG_I' },
  { n: 6, name: 'informational', desc: 'Mesaj informativ', ex: 'mesaje de acces ACL (log), evenimente DHCP' },
  { n: 7, name: 'debugging', desc: 'Mesaje de depanare', ex: 'ieșirea comenzilor debug …' },
];
const SEVC = ['var(--bad)', 'var(--bad)', 'var(--bad)', 'var(--warn)', 'var(--warn)', 'var(--accent)', 'var(--info)', 'var(--muted)'];

/* 1) Nivelurile de severitate cu filtrul „până la N” */
export function SeverityLevels() {
  const [lvl, setLvl] = useState(4);
  return (
    <div>
      <Seg value={String(lvl)} set={(k) => setLvl(Number(k))} label="Nivelul configurat" items={SEV.map((s) => [String(s.n), s.n + ' ' + s.name] as [string, string])} />
      <svg viewBox="0 0 720 300" role="img" aria-label="Cele opt niveluri de severitate syslog; nivelurile de la 0 până la cel configurat sunt trimise, restul sunt filtrate">
        {SEV.map((s) => {
          const on = s.n <= lvl;
          const y = 8 + s.n * 35;
          return (
            <g key={s.n} opacity={on ? 1 : 0.35}>
              <rect x={20} y={y} width={680} height={30} rx={6} fill={on ? 'var(--surface-3)' : 'var(--surface-2)'} stroke={SEVC[s.n]} strokeWidth={s.n === lvl ? 2.5 : 1.2} />
              <T x={40} y={y + 20} size={13} weight={700} color={SEVC[s.n]} anchor="start">{String(s.n)}</T>
              <T x={70} y={y + 20} size={12.5} weight={650} anchor="start">{s.name}</T>
              <T x={230} y={y + 20} size={11.5} anchor="start" color="var(--text-2)">{s.desc}</T>
              <T x={680} y={y + 20} size={10.5} anchor="end" color="var(--muted)">{on ? 'LOGAT' : 'filtrat'}</T>
            </g>
          );
        })}
      </svg>
      <div style={note(SEVC[lvl])}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          Cu nivelul <b>{lvl} ({SEV[lvl].name})</b> se loghează mesajele de la <b>0 până la {lvl}</b> — adică nivelul ales <b>și toate cele mai severe</b>. Număr mai mic = mai grav. Exemplu pentru acest nivel: {SEV[lvl].ex}.
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Mnemonic englezesc: „Every Awesome Cisco Engineer Will Need Ice-cream Daily” (Emergencies, Alerts, Critical, Errors, Warnings, Notifications, Informational, Debugging).</div>
      </div>
    </div>
  );
}

/* 2) Anatomia unui mesaj */
export function MessageAnatomy() {
  const parts: { t: string; c: string; l: string; d: string; x: number; w: number }[] = [
    { t: '*Mar  1 00:05:12.123:', c: 'var(--info)', l: 'timestamp', d: 'Dată și oră (service timestamps). Prefixul * = ceasul nu e setat/sincronizat.', x: 20, w: 190 },
    { t: '%LINK', c: 'var(--accent)', l: 'facility', d: 'Componenta care a generat mesajul (LINK, SYS, OSPF, SEC…).', x: 215, w: 70 },
    { t: '-3', c: 'var(--warn)', l: 'severitate', d: 'Nivelul 0–7 (aici 3 = errors).', x: 290, w: 40 },
    { t: '-UPDOWN:', c: 'var(--violet)', l: 'mnemonic', d: 'Tipul de eveniment din acea componentă.', x: 335, w: 90 },
    { t: 'Interface Gi0/1, changed state to down', c: 'var(--text-2)', l: 'descriere', d: 'Textul explicativ.', x: 430, w: 280 },
  ];
  return (
    <svg viewBox="0 0 730 170" role="img" aria-label="Anatomia unui mesaj syslog Cisco: timestamp, facility, severitate, mnemonic, descriere">
      <T x={365} y={20} size={12.5} weight={700}>Anatomia unui mesaj de log Cisco</T>
      {parts.map((p) => (
        <g key={p.l}>
          <rect x={p.x} y={36} width={p.w} height={30} rx={6} fill="var(--surface-3)" stroke={p.c} strokeWidth={1.6} />
          <text x={p.x + p.w / 2} y={56} textAnchor="middle" style={{ ...mono, fontSize: p.l === 'descriere' ? 10 : 10.5, fill: p.c, fontWeight: 650 }}>{p.t}</text>
          <Line x1={p.x + p.w / 2} y1={66} x2={p.x + p.w / 2} y2={86} c={p.c} w={1.5} />
          <T x={p.x + p.w / 2} y={102} size={11} weight={700} color={p.c}>{p.l}</T>
        </g>
      ))}
      <T x={365} y={134} size={11} color="var(--text-2)">Formatul general: timestamp: %FACILITY-SEVERITY-MNEMONIC: descriere</T>
      <T x={365} y={152} size={10.5} color="var(--muted)">Acest „facility” Cisco nu este același lucru cu facility-ul din antetul syslog (local0–local7), vezi secțiunea următoare.</T>
    </svg>
  );
}

/* 3) Destinațiile logurilor */
export function LogDestinations() {
  const rows: [string, string, string, string][] = [
    ['console', 'logging console [nivel]', 'consola fizică', 'implicit debugging (7)'],
    ['monitor', 'logging monitor [nivel] + terminal monitor', 'sesiuni VTY (Telnet/SSH)', 'implicit debugging; trebuie terminal monitor'],
    ['buffer', 'logging buffered [mărime] [nivel]', 'RAM-ul routerului (show logging)', 'se pierde la repornire'],
    ['server syslog', 'logging host <ip> + logging trap [nivel]', 'server extern (UDP 514)', 'de obicei informational (verifică show logging)'],
  ];
  return (
    <div className="table-wrap">
      <table className="t">
        <thead><tr><th>Destinație</th><th>Comenzi</th><th>Unde ajunge</th><th>Notă</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={i === 0 ? 'hl' : undefined}>{i === 1 ? <code>{c}</code> : c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

/* 4) Fluxul: un eveniment → filtre pe destinații */
export function LogFlow() {
  const [lvl, setLvl] = useState(3);
  const dests: { n: string; thr: number }[] = [
    { n: 'Console', thr: 7 }, { n: 'Buffer', thr: 7 }, { n: 'Monitor', thr: 7 }, { n: 'Syslog server', thr: 6 },
  ];
  return (
    <div>
      <Seg value={String(lvl)} set={(k) => setLvl(Number(k))} label="Severitatea evenimentului" items={[['3', 'errors (3)'], ['5', 'notifications (5)'], ['6', 'informational (6)'], ['7', 'debugging (7)']]} />
      <svg viewBox="0 0 720 220" role="img" aria-label="Un eveniment cu severitatea aleasă este comparat cu pragul fiecărei destinații: console, buffer, monitor și server syslog">
        <RouterIcon x={90} y={105} label="Router" sub={'eveniment nivel ' + lvl} />
        {dests.map((d, i) => {
          const ok = lvl <= d.thr;
          const y = 20 + i * 48;
          return (
            <g key={d.n}>
              <Line x1={120} y1={105} x2={420} y2={y + 18} c={ok ? 'var(--ok)' : 'var(--border)'} w={ok ? 2.5 : 1.2} dash={ok ? undefined : '4 4'} />
              <Box x={420} y={y} w={150} h={36} label={d.n} sub={'prag ' + d.thr} c={ok ? 'var(--ok)' : 'var(--border)'} />
              <T x={600} y={y + 22} size={11.5} weight={700} anchor="start" color={ok ? 'var(--ok)' : 'var(--muted)'}>{ok ? '✓ primit' : '✗ filtrat'}</T>
            </g>
          );
        })}
        <T x={360} y={212} size={10.5} color="var(--muted)">Praguri ilustrative: consola/buffer/monitor = debugging (7), server = informational (6). Valorile reale se verifică cu show logging.</T>
      </svg>
    </div>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 220" role="img" aria-label={solo ? 'Topologie lab solo syslog: router, switch, server syslog' : 'Topologie lab ghidat syslog: R1, SW1, server syslog'}>
      <RouterIcon x={170} y={100} label="R1" sub="10.0.0.1" />
      <SwitchIcon x={380} y={100} label="SW1" />
      <Box x={560} y={72} w={170} h={56} label="Server syslog" sub="10.0.0.50 · UDP 514" c="var(--accent)" />
      <Line x1={200} y1={100} x2={358} y2={100} /><Line x1={402} y1={100} x2={560} y2={100} />
      <T x={380} y={190} size={10.5} color="var(--muted)">{solo ? 'LAN 10.0.0.0/24 · R1 loghează doar warnings (4) și mai grave spre server' : 'LAN 10.0.0.0/24 · R1 trimite logurile spre 10.0.0.50'}</T>
    </svg>
  );
}
export const LabGuidedTopology45 = () => <Topo solo={false} />;
export const LabSoloTopology45 = () => <Topo solo />;
