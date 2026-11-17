import { useState } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T, mono } from './l2kit';

/* Diagrame originale pentru 4.9 (TFTP / FTP). Culori doar prin var(--…). */

const note = (c: string) => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8, fontSize: 13.5, color: 'var(--text-2)' } as const);

/* 1) Schimbul TFTP: cerere + blocuri cu ACK */
const TF: { dir: 1 | -1; label: string; title: string; desc: string }[] = [
  { dir: 1, label: 'RRQ „ios.bin” (UDP → 69)', title: 'Cererea de citire', desc: 'Routerul (client) trimite un Read Request (RRQ) către serverul TFTP, la UDP 69, cu numele fișierului și modul de transfer (de obicei „octet”). Nu există autentificare: dacă serverul are fișierul în directorul lui, îl poate oferi oricui.' },
  { dir: -1, label: 'DATA #1 (512 B, de la alt port)', title: 'Primul bloc', desc: 'Serverul răspunde de pe un alt port UDP (ales de el) cu blocul 1 al fișierului, de regulă 512 octeți. De acum perechea de porturi rămâne fixă pentru restul transferului (portul 69 doar „preia” cererile noi).' },
  { dir: 1, label: 'ACK #1', title: 'Confirmare', desc: 'Clientul confirmă blocul 1 (ACK #1). TFTP este „lock-step”: serverul nu trimite blocul 2 până nu primește ACK-ul pentru 1. Simplu, dar lent pe legături cu latență mare, pentru că fiecare bloc așteaptă o confirmare.' },
  { dir: -1, label: 'DATA #2 … DATA #N', title: 'Blocurile următoare', desc: 'Se repetă DATA → ACK pentru fiecare bloc. Dacă un pachet se pierde, expiră un timer și blocul se retrimite (TFTP face retransmisia la nivel de aplicație, peste UDP, fără fereastră glisantă).' },
  { dir: -1, label: 'DATA #N (< 512 B)', title: 'Ultimul bloc', desc: 'Transferul se încheie când un bloc are mai puțin de 512 octeți (sau 0 octeți, dacă fișierul e multiplu exact de 512). Clientul trimite ultimul ACK. Pe router vezi !!!!! și „bytes copied” la copy tftp: flash:.' },
];
export function TftpExchange() {
  const [n, setN] = useState(0);
  const s = TF[n];
  return (
    <div>
      <Seg value={String(n)} set={(k) => setN(Number(k))} label="Pas" items={TF.map((x, i) => [String(i), i + 1 + '. ' + x.title] as [string, string])} />
      <svg viewBox="0 0 760 190" role="img" aria-label="Schimbul TFTP între un router client și un server: cerere RRQ, blocuri DATA și confirmări ACK">
        <RouterIcon x={100} y={90} label="Router (client)" />
        <Box x={560} y={60} w={160} h={60} label="Server TFTP" sub="UDP 69" c="var(--info)" />
        <Line x1={130} y1={90} x2={560} y2={90} c="var(--text-2)" w={1.6} />
        <polygon points={s.dir === 1 ? '540,90 528,84 528,96' : '150,90 162,84 162,96'} fill="var(--accent)" />
        <rect x={190} y={52} width={340} height={28} rx={6} fill="var(--surface-3)" stroke="var(--accent)" strokeWidth={1.6} />
        <text x={360} y={71} textAnchor="middle" style={{ ...mono, fontSize: 11.5, fill: 'var(--accent)', fontWeight: 650 }}>{s.label}</text>
        <T x={360} y={150} size={10.5} color="var(--muted)">UDP, fără conexiune și fără autentificare · lock-step: un bloc, un ACK</T>
      </svg>
      <div style={note('var(--accent)')}><b>{s.title}.</b> {s.desc}</div>
    </div>
  );
}

/* 2) FTP: canalul de control și cel de date, activ vs pasiv */
export function FtpChannels() {
  const [m, setM] = useState<'act' | 'pas'>('act');
  const act = m === 'act';
  return (
    <div>
      <Seg value={m} set={setM} label="Mod FTP" items={[['act', 'Activ'], ['pas', 'Pasiv']]} />
      <svg viewBox="0 0 760 230" role="img" aria-label="FTP: conexiune de control TCP 21 și conexiune de date, în mod activ (serverul deschide spre client) sau pasiv (clientul deschide spre server)">
        <ClientIcon x={100} y={110} label="Client FTP" kind="pc" />
        <Box x={560} y={80} w={160} h={60} label="Server FTP" sub="TCP 21 (control)" c="var(--info)" />
        <Line x1={130} y1={90} x2={560} y2={90} c="var(--accent)" w={2.5} />
        <T x={345} y={80} size={11} weight={700} color="var(--accent)">control: client → server, TCP 21 (comenzi, utilizator, parolă)</T>
        <Line x1={act ? 560 : 130} y1={act ? 130 : 130} x2={act ? 130 : 560} y2={130} c="var(--ok)" w={2.5} dash="6 4" />
        <polygon points={act ? '150,130 162,124 162,136' : '540,130 528,124 528,136'} fill="var(--ok)" />
        <T x={345} y={152} size={11} weight={700} color="var(--ok)">{act ? 'date (activ): server → client, de la TCP 20' : 'date (pasiv): client → server, port înalt anunțat de server'}</T>
        <T x={345} y={196} size={10.5} color="var(--muted)">{act ? 'Clientul trimite comanda PORT cu adresa lui; serverul inițiază datele — blocat adesea de firewall/NAT-ul clientului' : 'Serverul răspunde la PASV cu un port; clientul inițiază datele — trece mai ușor prin firewall/NAT'}</T>
      </svg>
      <div style={note('var(--ok)')}>
        {act
          ? 'Mod activ: pentru fiecare transfer de date, serverul se conectează înapoi la client (de la portul 20). Un firewall sau NAT în fața clientului respinge de obicei această conexiune „din afară”.'
          : 'Mod pasiv: clientul deschide ambele conexiuni către server, deci firewall-urile din partea clientului nu mai blochează datele. De aceea pasiv este frecvent implicit. Pe IOS: ip ftp passive.'}
      </div>
    </div>
  );
}

/* 3) Fluxul unui upgrade de IOS */
const UP: { cmd: string; why: string }[] = [
  { cmd: 'show flash: / dir flash:', why: 'Verifici spațiul liber și ce imagini există. Imaginea nouă trebuie să încapă (sau ștergi una veche cu delete).' },
  { cmd: 'ping <server tftp>', why: 'Confirmi conectivitatea către server înainte de a porni transferul.' },
  { cmd: 'copy tftp: flash:', why: 'Routerul cere adresa serverului și numele fișierului și copiază imaginea în flash. Exclamările (!) arată blocurile primite.' },
  { cmd: 'verify /md5 flash:<imagine>', why: 'Calculezi hash-ul MD5 al fișierului copiat și îl compari cu cel publicat de producător: doar așa știi că nu e corupt.' },
  { cmd: 'boot system flash:<imagine>', why: 'Spui routerului ce imagine să încarce la pornire (în unele platforme se alege automat prima imagine din flash).' },
  { cmd: 'copy running-config startup-config → reload', why: 'Salvezi configurația, repornești; apoi confirmi cu show version că rulează noua versiune.' },
];
export function UpgradeFlow() {
  const [i, setI] = useState(0);
  const s = UP[i];
  return (
    <div>
      <Seg value={String(i)} set={(k) => setI(Number(k))} label="Pas din upgrade" items={UP.map((_, k) => [String(k), String(k + 1)] as [string, string])} />
      <svg viewBox="0 0 760 90" role="img" aria-label="Pașii unui upgrade de IOS prin TFTP: verificare flash, ping, copiere, verificare MD5, boot system, reload">
        {UP.map((_, k) => (
          <g key={k}>
            <Box x={8 + k * 124} y={20} w={112} h={46} label={String(k + 1)} sub={['flash', 'ping', 'copy', 'md5', 'boot', 'reload'][k]} c={k === i ? 'var(--accent)' : k < i ? 'var(--ok)' : 'var(--border)'} />
            {k < UP.length - 1 && <Line x1={120 + k * 124} y1={43} x2={132 + k * 124} y2={43} c="var(--text-2)" w={1.6} />}
          </g>
        ))}
      </svg>
      <div style={note('var(--accent)')}>
        <code>{s.cmd}</code>
        <div style={{ marginTop: 6 }}>{s.why}</div>
      </div>
    </div>
  );
}

/* 4) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 780 220" role="img" aria-label={solo ? 'Topologie lab solo TFTP: R1, SW1, server TFTP; copierea eșuează' : 'Topologie lab ghidat TFTP/FTP: R1, SW1, server TFTP/FTP'}>
      <RouterIcon x={170} y={100} label="R1" sub="192.168.1.1" />
      <SwitchIcon x={380} y={100} label="SW1" />
      <Box x={560} y={72} w={190} h={56} label={solo ? 'Server TFTP' : 'Server TFTP / FTP'} sub={solo ? '192.168.2.10/24' : '192.168.1.10/24'} c="var(--info)" />
      <Line x1={200} y1={100} x2={358} y2={100} /><Line x1={402} y1={100} x2={560} y2={100} />
      <T x={390} y={190} size={10.5} color="var(--muted)">{solo ? 'copy running-config tftp: eșuează cu timeout: găsește de ce' : 'R1 salvează și restaurează configurația prin TFTP; apoi folosește FTP cu autentificare'}</T>
    </svg>
  );
}
export const LabGuidedTopology49 = () => <Topo solo={false} />;
export const LabSoloTopology49 = () => <Topo solo />;
