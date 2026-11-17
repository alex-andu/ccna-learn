import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T, mono } from './l2kit';

/* Diagrame originale pentru 4.8 (SSH). Culori doar prin var(--…). */

const note = (c: string) => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8, fontSize: 13.5, color: 'var(--text-2)' } as const);

/* 1) Stabilirea unei sesiuni SSH, pas cu pas */
const STEPS: { dir: 1 | -1 | 0; label: string; title: string; desc: string }[] = [
  { dir: 1, label: 'TCP 22: SYN / SYN-ACK / ACK', title: 'Conexiune TCP', desc: 'Clientul deschide o conexiune TCP către portul 22 al serverului (routerul). Până aici nu există criptare; dacă un ACL pe linia VTY sau pe o interfață blochează TCP 22, totul se oprește aici („Connection refused / timed out”).' },
  { dir: 0, label: 'SSH-2.0-… ↔ SSH-2.0-…', title: 'Versiunea', desc: 'Cele două părți își anunță versiunea de SSH. Cu ip ssh version 2 routerul acceptă doar SSHv2; un client care cere doar v1 este refuzat. SSHv1 are slăbiciuni cunoscute și nu se mai folosește.' },
  { dir: 0, label: 'Negociere algoritmi + schimb de chei', title: 'Chei de sesiune', desc: 'Părțile aleg algoritmii (schimb de chei, criptare, integritate) și derivă, printr-un schimb de chei Diffie-Hellman, aceleași chei de sesiune simetrice fără să le trimită pe fir. De acum tot traficul va fi criptat. Echipamentele vechi pot oferi doar algoritmi pe care un client modern îi refuză („no matching … found”).' },
  { dir: -1, label: 'Cheia publică RSA a serverului (host key)', title: 'Autentificarea serverului', desc: 'Serverul se identifică cu cheia sa publică RSA (generată cu crypto key generate rsa). Clientul îi verifică amprenta: la prima conectare i-o arată utilizatorului, apoi o reține. Dacă amprenta se schimbă mai târziu, clientul avertizează (posibil atac man-in-the-middle sau cheie regenerată).' },
  { dir: 1, label: 'Utilizator + parolă (criptat)', title: 'Autentificarea utilizatorului', desc: 'Utilizatorul se autentifică, în interiorul canalului criptat: pe router, prin login local (username … secret …) sau AAA (TACACS+/RADIUS). Parola nu se vede pe fir, spre deosebire de Telnet.' },
  { dir: 0, label: 'Sesiune CLI criptată', title: 'Sesiunea', desc: 'Se deschide linia VTY, iar utilizatorul lucrează în CLI ca la consolă. Se aplică exec-timeout, access-class și nivelul de privilegiu al utilizatorului. Verifici cu show ssh și show ip ssh.' },
];
export function SshFlow() {
  const [n, setN] = useState(0);
  const s = STEPS[n];
  const enc = n >= 2;
  return (
    <div>
      <Seg value={String(n)} set={(k) => setN(Number(k))} label="Pas" items={STEPS.map((x, i) => [String(i), i + 1 + '. ' + x.title] as [string, string])} />
      <svg viewBox="0 0 760 210" role="img" aria-label="Stabilirea unei sesiuni SSH între un client și un router, pas cu pas">
        <ClientIcon x={90} y={95} label="Client" kind="pc" />
        <RouterIcon x={650} y={95} label="Router (SSH server)" sub="TCP 22" />
        <Line x1={125} y1={95} x2={618} y2={95} c={enc ? 'var(--ok)' : 'var(--text-2)'} w={enc ? 5 : 2} />
        {enc && <T x={380} y={118} size={10.5} weight={700} color="var(--ok)">🔒 canal criptat</T>}
        <rect x={190} y={52} width={380} height={28} rx={6} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={1.6} />
        <text x={380} y={71} textAnchor="middle" style={{ ...mono, fontSize: 11.5, fill: 'var(--accent)', fontWeight: 650 }}>{(s.dir === 1 ? '→ ' : s.dir === -1 ? '← ' : '↔ ') + s.label}</text>
        <T x={380} y={185} size={10.5} color="var(--muted)">Pasul {n + 1} din {STEPS.length}</T>
      </svg>
      <div style={note('var(--accent)')}><b>{s.title}.</b> {s.desc}</div>
    </div>
  );
}

/* 2) Telnet vs SSH pe fir */
export function TelnetVsSsh() {
  const [m, setM] = useState<'telnet' | 'ssh'>('telnet');
  const telnet = m === 'telnet';
  const lines = telnet
    ? ['User Access Verification', 'Username: admin', 'Password: cisco123', 'R1> enable', 'Password: enableSecret!']
    : ['SSH-2.0-Cisco-1.25', '…kexinit 8f3a91c4e0…', '…b71e0c5d29a4f863…', '…03d9e1a7c5b2480f…', '…e4c2a96f1d3b0587…'];
  return (
    <div>
      <Seg value={m} set={setM} label="Protocol" items={[['telnet', 'Telnet (TCP 23)'], ['ssh', 'SSH (TCP 22)']]} />
      <svg viewBox="0 0 700 190" role="img" aria-label="Ce vede un atacant într-o captură de trafic: Telnet în clar sau SSH criptat">
        <rect x={20} y={14} width={660} height={140} rx={8} fill="var(--code-bg)" stroke={telnet ? 'var(--bad)' : 'var(--ok)'} strokeWidth={2} />
        <T x={36} y={34} size={11} weight={700} anchor="start" color="var(--muted)">Captură pe fir (Wireshark, ilustrativ)</T>
        {lines.map((l, i) => (
          <text key={i} x={36} y={62 + i * 20} style={{ ...mono, fontSize: 12.5, fill: telnet && (i === 2 || i === 4) ? 'var(--bad)' : telnet ? 'var(--text)' : 'var(--ok)' }}>{l}</text>
        ))}
        <T x={350} y={176} size={11.5} weight={700} color={telnet ? 'var(--bad)' : 'var(--ok)'}>{telnet ? '✗ Utilizatorul și parolele sunt vizibile oricui interceptează pachetele' : '✓ Doar date criptate; parolele nu se pot citi pe fir'}</T>
      </svg>
      <div style={note(telnet ? 'var(--bad)' : 'var(--ok)')}>
        {telnet
          ? 'Telnet trimite tot în text clar, inclusiv parolele. Oricine are acces la un segment prin care trece traficul (un switch compromis, un tap, un hub, o captură) le poate citi.'
          : 'SSH criptează canalul și verifică identitatea serverului. Aceleași comenzi CLI, dar fără scurgeri de parole pe fir. Este varianta de acces la distanță cerută de bune practici.'}
      </div>
    </div>
  );
}

/* 3) Lanțul de cerințe pentru SSH pe IOS */
const REQ: { cmd: string; why: string; fail: string }[] = [
  { cmd: 'hostname R1', why: 'Cheia RSA primește numele <hostname>.<domeniu>; hostname-ul implicit „Router” nu este acceptat la generarea cheii.', fail: 'Generarea cheii este refuzată sau cheia are un nume nepotrivit.' },
  { cmd: 'ip domain-name example.local', why: 'Cu hostname formează numele de domeniu complet (FQDN) al cheii RSA.', fail: '“Please define a domain-name first” — cheia nu se generează.' },
  { cmd: 'crypto key generate rsa modulus 2048', why: 'Creează perechea de chei RSA; activează serverul SSH. Pentru SSHv2 modulul trebuie să fie de cel puțin 768 biți; 2048 e practica uzuală.', fail: 'Fără cheie, show ip ssh arată „SSH Disabled” și conexiunile sunt refuzate.' },
  { cmd: 'ip ssh version 2', why: 'Forțează SSHv2 (mai sigur decât v1).', fail: 'Rămâne compatibil cu v1 pe unele platforme: posibilă degradare de securitate.' },
  { cmd: 'username admin privilege 15 secret ****', why: 'Utilizator local, cu parolă hash-uită (secret).', fail: 'Cu login local fără utilizatori, nimeni nu se poate autentifica.' },
  { cmd: 'line vty 0 15 / login local / transport input ssh', why: 'Liniile VTY primesc conexiuni doar SSH, autentificate cu baza locală.', fail: 'Fără login local: „Password required, but none set” sau acces cu parolă de linie; cu transport all: Telnet rămâne deschis.' },
];
export function SshChecklist() {
  const [i, setI] = useState(0);
  const r = REQ[i];
  return (
    <div>
      <Seg value={String(i)} set={(k) => setI(Number(k))} label="Pas de configurare" items={REQ.map((_, k) => [String(k), k + 1 + '. ' + (k === 0 ? 'hostname' : k === 1 ? 'domain' : k === 2 ? 'chei RSA' : k === 3 ? 'v2' : k === 4 ? 'utilizator' : 'VTY')] as [string, string])} />
      <svg viewBox="0 0 760 120" role="img" aria-label="Lanțul de pași pentru a activa SSH pe un router sau switch Cisco">
        {REQ.map((_, k) => (
          <g key={k}>
            <Box x={8 + k * 124} y={30} w={112} h={50} label={String(k + 1)} sub={k === 0 ? 'hostname' : k === 1 ? 'domain-name' : k === 2 ? 'rsa' : k === 3 ? 'version 2' : k === 4 ? 'username' : 'vty'} c={k === i ? 'var(--accent)' : k < i ? 'var(--ok)' : 'var(--border)'} />
            {k < REQ.length - 1 && <Line x1={120 + k * 124} y1={55} x2={132 + k * 124} y2={55} c="var(--text-2)" w={1.6} />}
          </g>
        ))}
        <T x={380} y={108} size={10.5} color="var(--muted)">Ordinea contează: cheia RSA nu se poate genera fără hostname și domeniu</T>
      </svg>
      <div style={note('var(--accent)')}>
        <code>{r.cmd}</code>
        <div style={{ marginTop: 6 }}><b>De ce:</b> {r.why}</div>
        <div style={{ marginTop: 4 }}><b>Dacă lipsește:</b> {r.fail}</div>
      </div>
    </div>
  );
}

/* 4) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 780 220" role="img" aria-label={solo ? 'Topologie lab solo SSH: PC admin, SW1, R1; SSH nu funcționează' : 'Topologie lab ghidat SSH: PC admin, SW1, R1 și SW2 de gestionat'}>
      <ClientIcon x={70} y={100} label="PC admin" kind="pc" />
      <SwitchIcon x={230} y={100} label="SW1" />
      <RouterIcon x={430} y={100} label="R1" sub="SSH server" />
      {!solo && <SwitchIcon x={650} y={100} label="SW2" />}
      <Line x1={100} y1={100} x2={208} y2={100} /><Line x1={252} y1={100} x2={400} y2={100} />
      {!solo && <Line x1={460} y1={100} x2={628} y2={100} />}
      <T x={100} y={140} size={10} color="var(--muted)" m>192.168.1.10</T>
      <T x={430} y={140} size={10} color="var(--muted)" m>192.168.1.1</T>
      {!solo && <T x={650} y={140} size={10} color="var(--muted)" m>192.168.2.2 (SVI)</T>}
      <T x={390} y={200} size={10.5} color="var(--muted)">{solo ? 'Telnet merge, dar „ssh -l admin 192.168.1.1” este refuzat: găsește de ce' : 'Activează SSH pe R1 și SW2, dezactivează Telnet și testează de pe PC-ul de administrare'}</T>
    </svg>
  );
}
export const LabGuidedTopology48 = () => <Topo solo={false} />;
export const LabSoloTopology48 = () => <Topo solo />;
