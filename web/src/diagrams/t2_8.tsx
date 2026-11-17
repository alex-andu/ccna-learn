import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 2.8 (acces de management la echipamente). Culori doar prin var(--…). */

/* 1) Metode de acces: ce port, criptat?, in-band/OOB */
type M = 'console' | 'telnet' | 'ssh' | 'http' | 'https';
const METH: Record<M, { name: string; port: string; enc: boolean; path: string; use: string; col: string }> = {
  console: { name: 'Console', port: 'cablu serial/USB (nu TCP/IP)', enc: false, path: 'OUT-OF-BAND, local', use: 'Configurare inițială, recuperare; funcționează fără rețea și fără IP. Securizat prin acces fizic + parole.', col: 'var(--ok)' },
  telnet: { name: 'Telnet', port: 'TCP 23', enc: false, path: 'IN-BAND', use: 'CLI la distanță; tot traficul (inclusiv parolele) circulă în clar ⇒ nu se mai folosește în producție.', col: 'var(--bad)' },
  ssh: { name: 'SSH', port: 'TCP 22', enc: true, path: 'IN-BAND', use: 'CLI la distanță criptat; autentificare cu utilizator+parolă sau chei. Alegerea standard (versiunea 2).', col: 'var(--ok)' },
  http: { name: 'HTTP', port: 'TCP 80', enc: false, path: 'IN-BAND', use: 'GUI web în clar; credențialele pot fi interceptate ⇒ evitat sau dezactivat.', col: 'var(--bad)' },
  https: { name: 'HTTPS', port: 'TCP 443', enc: true, path: 'IN-BAND', use: 'GUI web criptat cu TLS; cu certificat. Alegerea standard pentru administrarea grafică.', col: 'var(--ok)' },
};
export function MethodPicker() {
  const [m, setM] = useState<M>('ssh');
  const d = METH[m];
  return (
    <div>
      <Seg value={m} set={setM} label="Metodă de acces" items={(Object.keys(METH) as M[]).map((k) => [k, METH[k].name] as [M, string])} />
      <svg viewBox="0 0 720 190" role="img" aria-label="Detalii despre metoda de acces aleasă">
        <ClientIcon x={80} y={60} kind="pc" label="Administrator" />
        <Line x1={120} y1={60} x2={560} y2={60} c={d.col} w={3} dash={d.enc ? undefined : '8 5'} />
        <RouterIcon x={610} y={60} label="Echipament" />
        <T x={340} y={50} size={11} weight={700} color={d.col}>{d.name}</T>
        <T x={340} y={78} size={10} m color="var(--muted)">{d.port}</T>
        <rect x={40} y={110} width={640} height={66} rx={8} fill="var(--surface-2)" stroke="var(--border)" />
        <T x={54} y={130} anchor="start" size={11} weight={700} color={d.col}>{`${d.enc ? '🔒 criptat' : (m === 'console' ? 'conexiune locală' : '⚠ în clar')} · ${d.path}`}</T>
        <T x={54} y={148} anchor="start" size={10.5} color="var(--text-2)">{d.use.length > 112 ? d.use.slice(0, d.use.lastIndexOf(' ', 112)) : d.use}</T>
        <T x={54} y={164} anchor="start" size={10.5} color="var(--text-2)">{d.use.length > 112 ? d.use.slice(d.use.lastIndexOf(' ', 112) + 1) : ''}</T>
      </svg>
    </div>
  );
}

/* 2) In-band vs out-of-band */
export function BandView() {
  const [v, setV] = useState<'in' | 'oob'>('in');
  return (
    <div>
      <Seg value={v} set={setV} label="Tip de management" items={[['in', 'In-band'], ['oob', 'Out-of-band']]} />
      <svg viewBox="0 0 720 240" role="img" aria-label="Management in-band versus out-of-band">
        <ClientIcon x={80} y={110} kind="pc" label="Admin" />
        <SwitchIcon x={300} y={70} label="Switch producție" />
        <RouterIcon x={540} y={70} label="Router" />
        <Line x1={332} y1={70} x2={508} y2={70} c="var(--text-2)" />
        <T x={420} y={60} size={10} color="var(--muted)">trafic de producție</T>
        {v === 'in' ? (
          <g>
            <Line x1={110} y1={104} x2={270} y2={76} c="var(--info)" w={3} flow />
            <Line x1={110} y1={116} x2={510} y2={80} c="var(--info)" w={3} dash="6 5" />
            <T x={360} y={190} size={11} weight={700} color="var(--info)">Acces prin aceeași rețea ca traficul de producție (SSH/HTTPS spre IP-ul de management)</T>
            <T x={360} y={208} size={10.5} color="var(--muted)">Dacă rețeaua cade sau interfața e misconfigurată, pierzi accesul.</T>
          </g>
        ) : (
          <g>
            <rect x={40} y={150} width={640} height={32} rx={8} fill="var(--accent-soft)" stroke="var(--accent)" strokeDasharray="4 4" />
            <T x={360} y={171} size={10.5} color="var(--accent)" weight={700}>rețea de management separată (OOB) / console server / service port</T>
            <Line x1={80} y1={134} x2={80} y2={150} c="var(--accent)" w={2} />
            <Line x1={300} y1={86} x2={300} y2={150} c="var(--accent)" w={2} dash="5 4" />
            <Line x1={540} y1={90} x2={540} y2={150} c="var(--accent)" w={2} dash="5 4" />
            <T x={360} y={208} size={11} weight={700} color="var(--accent)">Acces independent de rețeaua de producție (console, port de management dedicat)</T>
            <T x={360} y={226} size={10.5} color="var(--muted)">Funcționează chiar și când producția e căzută.</T>
          </g>
        )}
      </svg>
    </div>
  );
}

/* 3) RADIUS vs TACACS+ */
type A = 'tacacs' | 'radius';
const AAA: Record<A, { name: string; proto: string; port: string; enc: string; sep: string; std: string; use: string }> = {
  tacacs: { name: 'TACACS+', proto: 'TCP', port: '49', enc: 'Criptează tot conținutul pachetului (corpul)', sep: 'Separă autentificare, autorizare și contabilizare (AAA)', std: 'Cisco proprietar (acum descris informațional în RFC 8907)', use: 'Administrarea echipamentelor: autorizare pe comandă (cine poate rula ce).' },
  radius: { name: 'RADIUS', proto: 'UDP', port: '1812 (autentificare) · 1813 (contabilizare); istoric 1645/1646', enc: 'Criptează doar parola din pachet', sep: 'Combină autentificarea și autorizarea; contabilizare separată', std: 'Standard deschis (RFC 2865/2866)', use: 'Acces utilizatori la rețea: 802.1X, VPN, WLAN enterprise.' },
};
export function AaaCompare() {
  const [a, setA] = useState<A>('tacacs');
  const d = AAA[a];
  return (
    <div>
      <Seg value={a} set={setA} label="Protocol AAA" items={[['tacacs', 'TACACS+'], ['radius', 'RADIUS']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Autentificare administrator prin server AAA">
        <ClientIcon x={70} y={60} kind="pc" label="Admin" />
        <RouterIcon x={330} y={60} label="Echipament (NAS)" />
        <rect x={540} y={36} width={140} height={48} rx={8} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={2} /><T x={610} y={64} weight={700}>Server AAA</T>
        <Line x1={105} y1={60} x2={296} y2={60} /><T x={200} y={50} size={10} color="var(--muted)">1 · SSH login</T>
        <Line x1={364} y1={60} x2={540} y2={60} c="var(--accent)" w={2.5} /><T x={452} y={50} size={10} color="var(--accent)">{`2 · ${d.name} ${d.proto}/${d.port.split(' ')[0]}`}</T>
        <T x={452} y={76} size={9.5} color="var(--muted)">3 · accept / reject (+ atribute)</T>
        <rect x={40} y={110} width={640} height={110} rx={8} fill="var(--surface-2)" stroke="var(--border)" />
        <T x={54} y={130} anchor="start" size={11.5} weight={700}>{d.name}</T>
        <T x={54} y={148} anchor="start" size={10.5} color="var(--text-2)">{`Transport: ${d.proto} · port ${d.port}`}</T>
        <T x={54} y={164} anchor="start" size={10.5} color="var(--text-2)">{`Criptare: ${d.enc}`}</T>
        <T x={54} y={180} anchor="start" size={10.5} color="var(--text-2)">{`AAA: ${d.sep}`}</T>
        <T x={54} y={196} anchor="start" size={10.5} color="var(--text-2)">{`Standard: ${d.std}`}</T>
        <T x={54} y={212} anchor="start" size={10.5} color="var(--accent)">{`Utilizare tipică: ${d.use}`}</T>
      </svg>
    </div>
  );
}

/* 4) Cele trei A din AAA */
const AAA3 = [
  { k: 'Authentication', ro: 'Cine ești?', d: 'Verifică identitatea: utilizator + parolă, certificat, token. Exemplu: serverul spune „admin1 este admin1”.' },
  { k: 'Authorization', ro: 'Ce ai voie să faci?', d: 'Stabilește drepturile după autentificare: nivel de privilegiu, comenzi permise (TACACS+ poate autoriza fiecare comandă).' },
  { k: 'Accounting', ro: 'Ce ai făcut?', d: 'Înregistrează sesiuni și comenzi (cine, când, ce): audit și conformitate.' },
];
export function ThreeA() {
  const [i, setI] = useState(0);
  const a = AAA3[i];
  return (
    <div>
      <Seg value={String(i)} set={(k) => setI(Number(k))} label="Componentă AAA" items={AAA3.map((x, k) => [String(k), x.k] as [string, string])} />
      <svg viewBox="0 0 720 120" role="img" aria-label="Componentele AAA">
        {AAA3.map((x, k) => (
          <g key={x.k}>
            <rect x={40 + k * 220} y={14} width={200} height={42} rx={8} fill={k === i ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={k === i ? 'var(--accent)' : 'var(--border)'} strokeWidth={k === i ? 2.4 : 1.4} />
            <T x={140 + k * 220} y={40} weight={700} size={12}>{`${k + 1}. ${x.k}`}</T>
          </g>
        ))}
        <T x={360} y={82} size={12} weight={700} color="var(--accent)">{a.ro}</T>
        <T x={360} y={102} size={10.5} color="var(--text-2)">{a.d.length > 120 ? a.d.slice(0, a.d.lastIndexOf(' ', 120)) + '…' : a.d}</T>
      </svg>
    </div>
  );
}

/* 5) Topologii laborator */
export function LabGuidedTopology28() {
  return (
    <svg viewBox="0 0 720 240" role="img" aria-label="Topologie lab 2.8: PC admin, router/switch și server AAA">
      <ClientIcon x={90} y={90} kind="pc" label="PC admin 192.168.1.10" />
      <SwitchIcon x={300} y={90} label="SW1 · 192.168.1.2" />
      <RouterIcon x={520} y={90} label="R1 · 192.168.1.1" />
      <Line x1={118} y1={90} x2={268} y2={90} /><Line x1={332} y1={90} x2={490} y2={90} />
      <ClientIcon x={300} y={190} kind="pc" label="Server AAA 192.168.1.50" /><Line x1={300} y1={102} x2={300} y2={172} />
      <T x={620} y={96} anchor="start" size={10} m color="var(--muted)">console</T>
    </svg>
  );
}
export function LabSoloTopology28() {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-label="Topologie lab solo 2.8: acces securizat la un router">
      <ClientIcon x={120} y={90} kind="pc" label="Admin (SSH)" /><Line x1={150} y1={90} x2={330} y2={90} />
      <RouterIcon x={360} y={90} label="R-Edge" /><Line x1={390} y1={90} x2={580} y2={90} />
      <ClientIcon x={610} y={90} kind="pc" label="Server TACACS+" />
      <T x={360} y={190} size={11} color="var(--muted)">Cerință: doar SSH v2 pe vty, HTTPS fără HTTP, AAA cu fallback local</T>
    </svg>
  );
}
