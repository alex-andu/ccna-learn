import { useState, type CSSProperties } from 'react';
import { RouterIcon, SwitchIcon, ClientIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 4.1 (NAT). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Cele patru adrese NAT: cum arată pachetul în fiecare zonă */
type Dir = 'out' | 'back';
export function NatFourAddresses() {
  const [dir, setDir] = useState<Dir>('out');
  const out = dir === 'out';
  const left = out ? ['192.168.1.10', '198.51.100.5'] : ['198.51.100.5', '192.168.1.10'];
  const right = out ? ['203.0.113.10', '198.51.100.5'] : ['198.51.100.5', '203.0.113.10'];
  const lab = (a: string) => a;
  return (
    <div>
      <Seg value={dir} set={setDir} label="Sensul pachetului" items={[['out', 'Spre exterior (PC → server)'], ['back', 'Răspuns (server → PC)']]} />
      <svg viewBox="0 0 760 300" role="img" aria-label="Un PC din interior, routerul NAT și un server din exterior; sub fiecare zonă se arată adresa sursă și destinație a pachetului înainte și după traducere">
        <rect x={10} y={20} width={300} height={170} rx={12} fill="none" stroke="var(--ok)" strokeDasharray="6 5" />
        <T x={160} y={40} size={11} weight={700} color="var(--ok)">INSIDE (rețeaua ta)</T>
        <rect x={450} y={20} width={300} height={170} rx={12} fill="none" stroke="var(--info)" strokeDasharray="6 5" />
        <T x={600} y={40} size={11} weight={700} color="var(--info)">OUTSIDE (Internet)</T>
        <ClientIcon x={70} y={110} kind="pc" label="PC1" />
        <SwitchIcon x={170} y={110} label="SW" />
        <RouterIcon x={380} y={110} label="R-NAT" sub="ip nat inside / outside" />
        <Box x={560} y={85} w={140} h={50} label="Server" sub="198.51.100.5" c="var(--info)" />
        <Line x1={94} y1={110} x2={148} y2={110} />
        <Line x1={192} y1={110} x2={352} y2={110} c="var(--ok)" w={3} flow />
        <Line x1={410} y1={110} x2={560} y2={110} c="var(--info)" w={3} flow />
        <rect x={20} y={210} width={330} height={80} rx={8} fill="var(--surface-2)" stroke="var(--ok)" />
        <T x={185} y={228} size={11} weight={700} color="var(--ok)">Pachet în zona INSIDE</T>
        <T x={40} y={248} size={11} anchor="start" m color="var(--text-2)">{'sursă:   ' + lab(left[0])}</T>
        <T x={40} y={268} size={11} anchor="start" m color="var(--text-2)">{'destinație: ' + lab(left[1])}</T>
        <T x={300} y={248} size={10} anchor="end" color="var(--muted)">{out ? 'inside local' : 'outside global'}</T>
        <T x={300} y={268} size={10} anchor="end" color="var(--muted)">{out ? 'outside local*' : 'inside local'}</T>
        <rect x={410} y={210} width={340} height={80} rx={8} fill="var(--surface-2)" stroke="var(--info)" />
        <T x={580} y={228} size={11} weight={700} color="var(--info)">Pachet în zona OUTSIDE</T>
        <T x={430} y={248} size={11} anchor="start" m color="var(--text-2)">{'sursă:   ' + lab(right[0])}</T>
        <T x={430} y={268} size={11} anchor="start" m color="var(--text-2)">{'destinație: ' + lab(right[1])}</T>
        <T x={740} y={248} size={10} anchor="end" color="var(--muted)">{out ? 'inside global' : 'outside global'}</T>
        <T x={740} y={268} size={10} anchor="end" color="var(--muted)">{out ? 'outside global' : 'inside global'}</T>
      </svg>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {out
            ? 'R-NAT înlocuiește adresa SURSĂ: 192.168.1.10 (inside local) devine 203.0.113.10 (inside global). Destinația nu se schimbă: serverul are aceeași adresă și în interior, și în exterior (outside local = outside global, cazul obișnuit).'
            : 'La întoarcere, R-NAT caută în tabela de traduceri adresa DESTINAȚIE din pachet (203.0.113.10, inside global) și o înlocuiește cu 192.168.1.10 (inside local). Serverul nu a aflat niciodată adresa privată.'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>* „outside local” = cum vezi serverul din interior; fără NAT pe partea exterioară coincide cu outside global.</div>
      </div>
    </div>
  );
}

/* 2) PAT: tabela de traduceri cu porturi */
const HOSTS: { n: string; ip: string; sp: number; gp: number }[] = [
  { n: 'PC1', ip: '192.168.1.10', sp: 51000, gp: 1024 },
  { n: 'PC2', ip: '192.168.1.11', sp: 51000, gp: 1025 },
  { n: 'PC3', ip: '192.168.1.12', sp: 49200, gp: 1026 },
];
export function PatTable() {
  const [n, setN] = useState(1);
  const rows = HOSTS.slice(0, n);
  return (
    <div>
      <Seg value={String(n)} set={(k) => setN(Number(k))} label="Câte gazde trimit trafic" items={[['1', '1 gazdă'], ['2', '2 gazde'], ['3', '3 gazde']]} />
      <svg viewBox="0 0 760 250" role="img" aria-label="Mai multe PC-uri partajează aceeași adresă publică 203.0.113.1; routerul le deosebește prin portul sursă tradus">
        {HOSTS.map((h, i) => (
          <g key={h.n} opacity={i < n ? 1 : 0.25}>
            <ClientIcon x={60} y={45 + i * 80} kind="pc" label={h.n} />
            <T x={60} y={78 + i * 80 - 12} size={9.5} m color="var(--muted)">{h.ip}</T>
            <Line x1={84} y1={45 + i * 80} x2={330} y2={125} c={i < n ? 'var(--ok)' : 'var(--border)'} w={i < n ? 2.5 : 1} />
          </g>
        ))}
        <RouterIcon x={360} y={125} label="R-NAT" sub="PAT overload" />
        <Line x1={390} y1={125} x2={560} y2={125} c="var(--info)" w={3} flow />
        <Box x={560} y={95} w={170} h={60} label="Server 198.51.100.5" sub="portul 80" c="var(--info)" />
        <T x={475} y={112} size={10} m color="var(--accent)">203.0.113.1</T>
      </svg>
      <div className="table-wrap">
        <table className="t">
          <thead><tr><th>Proto</th><th>Inside global</th><th>Inside local</th><th>Outside local</th><th>Outside global</th></tr></thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.n}>
                <td><code>tcp</code></td>
                <td><code>203.0.113.1:{h.gp}</code></td>
                <td><code>{h.ip}:{h.sp}</code></td>
                <td><code>198.51.100.5:80</code></td>
                <td><code>198.51.100.5:80</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {n === 1 ? 'O singură gazdă: routerul alege un port sursă „global” liber (aici 1024) și îl notează în tabelă.' : 'Același IP public pentru toți. Ce îi deosebește este portul: răspunsul spre 203.0.113.1:' + HOSTS[1].gp + ' merge la PC2, iar spre :' + HOSTS[0].gp + ' la PC1. Observă că PC1 și PC2 folosesc același port local (51000) — nu e o problemă, pentru că perechea completă (IP + port) rămâne unică după traducere.'}
          {' '}Valorile sunt ilustrative: routerul alege porturile.
        </div>
      </div>
    </div>
  );
}

/* 3) Ordinea operațiilor: rutare vs NAT */
export function NatOrderOfOps() {
  return (
    <svg viewBox="0 0 760 270" role="img" aria-label="Ordinea operațiilor: de la inside la outside se face întâi rutarea, apoi NAT; de la outside la inside se face întâi NAT, apoi rutarea">
      <T x={380} y={22} size={13} weight={700}>Ce face routerul cu un pachet, în ordine</T>
      <T x={20} y={55} size={11.5} weight={700} color="var(--ok)" anchor="start">inside → outside</T>
      <Box x={20} y={65} w={150} h={46} label="1. Intră pe ip nat inside" c="var(--ok)" />
      <Box x={250} y={65} w={150} h={46} label="2. Rutare" sub="alege interfața de ieșire" c="var(--accent)" />
      <Box x={480} y={65} w={130} h={46} label="3. NAT" sub="schimbă SURSA" c="var(--warn)" />
      <Box x={650} y={65} w={100} h={46} label="4. Iese" c="var(--info)" />
      <Line x1={170} y1={88} x2={250} y2={88} /><Line x1={400} y1={88} x2={480} y2={88} /><Line x1={610} y1={88} x2={650} y2={88} />
      <T x={20} y={160} size={11.5} weight={700} color="var(--info)" anchor="start">outside → inside</T>
      <Box x={20} y={170} w={150} h={46} label="1. Intră pe ip nat outside" c="var(--info)" />
      <Box x={250} y={170} w={150} h={46} label="2. NAT" sub="schimbă DESTINAȚIA" c="var(--warn)" />
      <Box x={480} y={170} w={130} h={46} label="3. Rutare" sub="spre adresa privată" c="var(--accent)" />
      <Box x={650} y={170} w={100} h={46} label="4. Iese" c="var(--ok)" />
      <Line x1={170} y1={193} x2={250} y2={193} /><Line x1={400} y1={193} x2={480} y2={193} /><Line x1={610} y1={193} x2={650} y2={193} />
      <T x={380} y={250} size={11} color="var(--muted)">Consecință: spre exterior, ruta se alege cu adresa încă privată; spre interior, ruta se alege după ce adresa a revenit la cea privată.</T>
    </svg>
  );
}

/* 4) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 240" role="img" aria-label={solo ? 'Topologie lab solo: două LAN-uri în spatele unui router NAT' : 'Topologie lab ghidat: LAN privat, router NAT, ISP și server'}>
      <rect x={10} y={20} width={330} height={190} rx={12} fill="none" stroke="var(--ok)" strokeDasharray="6 5" />
      <T x={175} y={38} size={11} weight={700} color="var(--ok)">{solo ? 'INSIDE 192.168.20.0/24' : 'INSIDE 192.168.1.0/24'}</T>
      <ClientIcon x={60} y={95} kind="pc" label={solo ? 'PC-A' : 'PC1'} />
      <ClientIcon x={60} y={175} kind="pc" label={solo ? 'PC-B' : 'PC2'} />
      <SwitchIcon x={170} y={135} label="SW1" />
      <RouterIcon x={300} y={135} label="R1" sub="Gi0/0 inside" />
      <Line x1={84} y1={95} x2={150} y2={125} /><Line x1={84} y1={175} x2={150} y2={145} /><Line x1={192} y1={135} x2={272} y2={135} />
      <Line x1={330} y1={135} x2={430} y2={135} c="var(--warn)" w={3} />
      <T x={380} y={122} size={10} m color="var(--warn)">{solo ? '198.51.100.0/29' : '203.0.113.0/30'}</T>
      <RouterIcon x={460} y={135} label="ISP" sub="Gi0/0" />
      <Line x1={490} y1={135} x2={580} y2={135} c="var(--info)" w={3} />
      <Box x={580} y={110} w={150} h={50} label="Server" sub={solo ? '8.8.8.8 (Lo0 ISP)' : '198.51.100.5'} c="var(--info)" />
      <T x={380} y={215} size={10.5} color="var(--muted)">R1 Gi0/1 = outside · ISP simulează Internetul</T>
    </svg>
  );
}
export const LabGuidedTopology41 = () => <Topo solo={false} />;
export const LabSoloTopology41 = () => <Topo solo />;
