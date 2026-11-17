import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 4.6 (DHCP client și relay). Culori doar prin var(--…). */

/* 1) Fluxul DORA prin relay, pas cu pas */
const STEPS: { seg: 'A' | 'B'; dir: 1 | -1; title: string; label: string; desc: string }[] = [
  { seg: 'A', dir: 1, title: 'Discover', label: 'Discover · broadcast', desc: 'PC-ul nu are adresă: trimite Discover ca broadcast (sursă 0.0.0.0, destinație 255.255.255.255, UDP 68 → 67). Routerul nu retransmite broadcast-uri, deci mesajul ar muri aici — dacă R1 nu are ip helper-address pe această interfață.' },
  { seg: 'B', dir: 1, title: 'Relay → server', label: 'unicast · giaddr = 192.168.10.1', desc: 'R1 (relay) preia broadcast-ul și îl retrimite ca unicast către adresa din ip helper-address. În câmpul giaddr al mesajului scrie adresa propriei interfețe dinspre client (192.168.10.1) — așa află serverul din ce subrețea vine cererea.' },
  { seg: 'B', dir: -1, title: 'Offer către giaddr', label: 'Offer · unicast către giaddr', desc: 'Serverul alege pool-ul care conține giaddr (192.168.10.0/24), rezervă o adresă și trimite Offer unicast către giaddr. Serverul are nevoie de o rută spre acea subrețea (aici o are, prin R1).' },
  { seg: 'A', dir: -1, title: 'Offer către client', label: 'Offer · către client', desc: 'R1 primește Offer și îl livrează clientului pe LAN (broadcast sau unicast către adresa fizică a clientului, în funcție de flag-ul de broadcast din Discover).' },
  { seg: 'A', dir: 1, title: 'Request', label: 'Request · broadcast → relay → server', desc: 'Clientul acceptă oferta cu un Request broadcast. R1 îl relayează la fel ca Discover-ul (unicast spre server, cu giaddr). Request-ul anunță și alți eventuali servere DHCP că oferta lor a fost refuzată.' },
  { seg: 'B', dir: -1, title: 'Ack', label: 'Ack · server → giaddr → client', desc: 'Serverul confirmă (Ack) cu adresa, masca, gateway-ul, DNS-ul și lease-ul. R1 îl duce la client, care își configurează interfața. De acum clientul are IP; reînnoirile ulterioare se fac, de regulă, direct în unicast către server.' },
];

export function RelayFlow() {
  const [n, setN] = useState(0);
  const s = STEPS[n];
  const ax = 330, bx = 600;
  const active = (seg: 'A' | 'B') => (s.seg === seg ? 'var(--accent)' : 'var(--border)');
  const x1 = s.seg === 'A' ? 110 : ax + 30;
  const x2 = s.seg === 'A' ? ax - 30 : bx - 40;
  const from = s.dir === 1 ? x1 : x2;
  const to = s.dir === 1 ? x2 : x1;
  const midx = (from + to) / 2;
  return (
    <div>
      <Seg value={String(n)} set={(k) => setN(Number(k))} label="Pasul din schimbul DHCP relayat" items={STEPS.map((st, i) => [String(i), i + 1 + '. ' + st.title] as [string, string])} />
      <svg viewBox="0 0 760 230" role="img" aria-label="Schimb DHCP între PC, routerul R1 cu ip helper-address și serverul DHCP, pas cu pas">
        <ClientIcon x={80} y={110} label="PC1" kind="pc" />
        <RouterIcon x={ax} y={110} label="R1 (relay)" sub="Gi0/1 192.168.10.1" />
        <Box x={bx} y={80} w={150} h={60} label="Server DHCP" sub="172.16.0.10" c="var(--info)" />
        <Line x1={110} y1={110} x2={ax - 30} y2={110} c={active('A')} w={s.seg === 'A' ? 3 : 1.4} />
        <Line x1={ax + 30} y1={110} x2={bx} y2={110} c={active('B')} w={s.seg === 'B' ? 3 : 1.4} />
        <polygon points={s.dir === 1 ? `${to},110 ${to - 11},104 ${to - 11},116` : `${to},110 ${to + 11},104 ${to + 11},116`} fill="var(--accent)" />
        <T x={midx} y={s.seg === 'A' ? 84 : 84} size={11} weight={700} color="var(--accent)">{s.label}</T>
        <T x={95} y={190} size={10.5} color="var(--muted)">LAN clienți 192.168.10.0/24</T>
        <T x={bx + 40} y={190} size={10.5} color="var(--muted)">LAN server 172.16.0.0/24</T>
      </svg>
      <div style={{ border: '1px solid var(--accent)', borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8, fontSize: 13.5, color: 'var(--text-2)' }}>
        <b>Pasul {n + 1} — {s.title}.</b> {s.desc}
      </div>
    </div>
  );
}

/* 2) Unde pui ip helper-address: corect vs greșit */
export function HelperPlacement() {
  const [ok, setOk] = useState<'ok' | 'bad'>('ok');
  const good = ok === 'ok';
  const c = good ? 'var(--ok)' : 'var(--bad)';
  return (
    <div>
      <Seg value={ok} set={setOk} label="Variantă de configurare" items={[['ok', 'Pe interfața dinspre clienți'], ['bad', 'Pe interfața dinspre server']]} />
      <svg viewBox="0 0 760 220" role="img" aria-label="R1 cu două interfețe: ip helper-address pe interfața spre clienți (corect) sau pe cea spre server (greșit)">
        <ClientIcon x={80} y={105} label="PC1" kind="pc" />
        <SwitchIcon x={200} y={105} label="SW1" />
        <RouterIcon x={380} y={105} label="R1" />
        <Box x={590} y={75} w={150} h={60} label="Server DHCP" sub="172.16.0.10" c="var(--info)" />
        <Line x1={110} y1={105} x2={178} y2={105} /><Line x1={222} y1={105} x2={350} y2={105} /><Line x1={410} y1={105} x2={590} y2={105} />
        <T x={318} y={92} size={10.5} color="var(--muted)">Gi0/1</T>
        <T x={452} y={92} size={10.5} color="var(--muted)">Gi0/2</T>
        <rect x={good ? 255 : 395} y={128} width={good ? 150 : 150} height={32} rx={6} fill="var(--surface-3)" stroke={c} strokeWidth={2} />
        <text x={good ? 330 : 470} y={148} textAnchor="middle" style={{ fontSize: 10.5, fill: c, fontWeight: 650, fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' }}>ip helper-address 172.16.0.10</text>
        <T x={380} y={196} size={11.5} weight={700} color={c}>{good ? '✓ Discover-ul sosește pe Gi0/1 și este relayat' : '✗ Discover-ul sosește pe Gi0/1, unde nu e niciun helper: este ignorat'}</T>
      </svg>
      <div style={{ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8, fontSize: 13.5, color: 'var(--text-2)' }}>
        {good
          ? 'Comanda stă pe interfața pe care sosesc broadcast-urile clienților. R1 le vede, le transformă în unicast și completează giaddr cu adresa lui Gi0/1.'
          : 'Pe Gi0/2 comanda nu face nimic util: broadcast-ul clientului nu sosește acolo. Clientul rămâne fără adresă (Windows ajunge la 169.254.x.x, APIPA).'}
      </div>
    </div>
  );
}

/* 3) Topologii lab */
export function LabGuidedTopology46() {
  return (
    <svg viewBox="0 0 800 260" role="img" aria-label="Topologie lab ghidat 4.6: PC1 și PC2, SW1, R1 cu relay și DHCP client, ISP și server DHCP">
      <ClientIcon x={60} y={70} label="PC1" kind="pc" />
      <ClientIcon x={60} y={170} label="PC2" kind="pc" />
      <SwitchIcon x={180} y={120} label="SW1" />
      <RouterIcon x={340} y={120} label="R1" sub="relay + client" />
      <RouterIcon x={560} y={50} label="ISP" sub="Gi0/0 198.51.100.1" />
      <Box x={520} y={160} w={170} h={56} label="Server DHCP" sub="172.16.0.10/24" c="var(--info)" />
      <Line x1={90} y1={70} x2={160} y2={112} /><Line x1={90} y1={170} x2={160} y2={128} /><Line x1={202} y1={120} x2={310} y2={120} />
      <Line x1={368} y1={105} x2={532} y2={55} /><Line x1={368} y1={135} x2={520} y2={185} />
      <T x={250} y={105} size={10} color="var(--muted)">Gi0/1 · 192.168.10.1</T>
      <T x={455} y={65} size={10} color="var(--muted)">Gi0/0 · DHCP</T>
      <T x={450} y={178} size={10} color="var(--muted)">Gi0/2 · 172.16.0.1</T>
      <T x={400} y={245} size={10.5} color="var(--muted)">R1 primește adresă de la ISP (client) și relayează cererile LAN spre serverul DHCP</T>
    </svg>
  );
}
export function LabSoloTopology46() {
  return (
    <svg viewBox="0 0 800 220" role="img" aria-label="Topologie lab solo 4.6: PC1 și PC2, SW1, R1 și server DHCP; clienții nu primesc adresă">
      <ClientIcon x={60} y={60} label="PC1" kind="pc" />
      <ClientIcon x={60} y={150} label="PC2" kind="pc" />
      <SwitchIcon x={190} y={105} label="SW1" />
      <RouterIcon x={380} y={105} label="R1" />
      <Box x={580} y={77} w={170} h={56} label="Server DHCP" sub="172.16.0.10/24" c="var(--info)" />
      <Line x1={90} y1={60} x2={168} y2={98} /><Line x1={90} y1={150} x2={168} y2={112} /><Line x1={212} y1={105} x2={350} y2={105} /><Line x1={410} y1={105} x2={580} y2={105} />
      <T x={290} y={92} size={10} color="var(--muted)">Gi0/1 · 192.168.10.1</T>
      <T x={495} y={92} size={10} color="var(--muted)">Gi0/2 · 172.16.0.1</T>
      <T x={400} y={200} size={10.5} color="var(--muted)">PC-urile rămân pe 169.254.x.x — găsește de ce</T>
    </svg>
  );
}
