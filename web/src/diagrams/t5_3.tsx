import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.3 (control de acces local la dispozitiv). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const mono: CSSProperties = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace', fontSize: 12.5, background: 'var(--code-bg)', padding: '8px 10px', borderRadius: 6, whiteSpace: 'pre', overflowX: 'auto', color: 'var(--text)' };

/* 1) Straturile accesului la un router/switch */
export function AccessLayers() {
  const rows: { n: string; k: string; v: string; c: string }[] = [
    { n: 'Console', k: 'line console 0', v: 'Acces fizic prin cablu; trebuie protejat cu login + parolă și exec-timeout.', c: 'var(--warn)' },
    { n: 'VTY', k: 'line vty 0 4 / 0 15', v: 'Acces la distanță (Telnet/SSH); protejat cu login local sau AAA, transport input ssh.', c: 'var(--info)' },
    { n: 'AUX', k: 'line aux 0', v: 'Port auxiliar (modem) pe unele routere; se dezactivează dacă nu e folosit.', c: 'var(--muted)' },
    { n: 'Privileged EXEC', k: 'enable secret …', v: 'Ușa spre modul privilegiat (nivel 15): configurare completă. Se protejează cu secret, nu password.', c: 'var(--bad)' },
  ];
  return (
    <svg viewBox="0 0 720 270" role="img" aria-label="Căile de acces la un echipament Cisco: console, VTY, AUX și parola de privilegiat">
      <RouterIcon x={110} y={135} label="Echipament" />
      {rows.map((r, i) => {
        const y = 12 + i * 62;
        return (
          <g key={r.n}>
            <Line x1={140} y1={135} x2={250} y2={y + 25} c={r.c} w={1.6} />
            <rect x={250} y={y} width={455} height={50} rx={8} fill="var(--surface-3)" stroke={r.c} strokeWidth={1.5} />
            <T x={262} y={y + 18} size={12} weight={700} anchor="start" color={r.c}>{r.n}</T>
            <T x={380} y={y + 18} size={10.5} anchor="start" m color="var(--text-2)">{r.k}</T>
            <T x={262} y={y + 38} size={10.5} anchor="start" color="var(--text-2)">{r.v}</T>
          </g>
        );
      })}
    </svg>
  );
}

/* 2) Simulator de login pe linie */
type Cfg = 'none' | 'pw' | 'local' | 'nologin';
export function LoginSimulator() {
  const [line, setLine] = useState<'con' | 'vty'>('vty');
  const [cfg, setCfg] = useState<Cfg>('pw');
  const conf: Record<Cfg, string> = {
    none: '! nicio comandă pe linie (valori implicite)',
    pw: ' password Cisco!2024\n login',
    local: ' login local\n! + username admin secret …',
    nologin: ' password Cisco!2024\n no login',
  };
  const head = line === 'con' ? 'line console 0' : 'line vty 0 4';
  let res: { t: string; c: string; d: string };
  if (cfg === 'none') {
    res = line === 'con'
      ? { t: 'ACCES DIRECT', c: 'var(--bad)', d: 'Consola nu cere implicit autentificare: oricine are cablul intră în modul EXEC.' }
      : { t: 'REFUZ', c: 'var(--ok)', d: 'VTY cere implicit login, dar nu există parolă: „Password required, but none set” și conexiunea se închide (nici administratorul nu intră).' };
  } else if (cfg === 'pw') {
    res = { t: 'CERE PAROLA LINIEI', c: 'var(--warn)', d: 'Se cere o singură parolă, comună tuturor celor care folosesc linia. Nu există nume de utilizator, deci nu se știe cine a intrat.' };
  } else if (cfg === 'local') {
    res = { t: 'CERE UTILIZATOR + PAROLĂ', c: 'var(--ok)', d: 'Se verifică baza locală (username … secret …). Fiecare administrator are cont propriu: apar nume în loguri și se poate retrage un cont.' };
  } else {
    res = { t: 'ACCES FĂRĂ PAROLĂ', c: 'var(--bad)', d: '„no login” dezactivează verificarea: parola configurată nu mai este cerută. Capcană frecventă.' };
  }
  return (
    <div>
      <Seg value={line} set={setLine} label="Linia" items={[['con', 'Console'], ['vty', 'VTY']]} />
      <Seg value={cfg} set={setCfg} label="Configurația" items={[['none', 'Nimic'], ['pw', 'password + login'], ['local', 'login local'], ['nologin', 'password + no login']]} />
      <div style={mono}>{head + '\n' + conf[cfg]}</div>
      <div style={note(res.c)}>
        <div style={{ fontSize: 14, fontWeight: 700, color: res.c }}>{res.t}</div>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 4 }}>{res.d}</div>
      </div>
    </div>
  );
}

/* 3) Tipurile de parole Cisco */
const PW = [
  { t: '0', name: 'Clear text', rev: 'Da — vizibilă direct', ex: 'enable password Cisco123', how: 'Parola apare întocmai în show running-config.', c: 'var(--bad)' },
  { t: '5', name: 'MD5 (hash cu salt)', rev: 'Nu e reversibilă, dar algoritmul este considerat slab', ex: 'enable secret 5 $1$mERr$…', how: 'Comanda secret (implicit pe multe versiuni clasice). Hash cu salt, ghicit mai ușor pe hardware modern.', c: 'var(--warn)' },
  { t: '7', name: 'Cifru Cisco (Vigenère)', rev: 'Da — reversibilă cu instrumente publice', ex: 'password 7 0822455D0A16', how: 'Rezultatul lui service password-encryption. Ofuscare, nu protecție reală.', c: 'var(--bad)' },
  { t: '8', name: 'PBKDF2 cu SHA-256', rev: 'Nu — hash lent', ex: 'enable algorithm-type sha256 secret …', how: 'Disponibil pe versiuni recente; mult mai rezistent la ghicire decât MD5.', c: 'var(--ok)' },
  { t: '9', name: 'scrypt', rev: 'Nu — hash lent, cu cerințe de memorie', ex: 'username admin algorithm-type scrypt secret …', how: 'Disponibil pe versiuni recente; recomandat când e suportat.', c: 'var(--ok)' },
];

export function PasswordTypes() {
  const [t, setT] = useState('5');
  const p = PW.find((x) => x.t === t) ?? PW[1];
  return (
    <div>
      <Seg value={t} set={setT} label="Tip de parolă" items={PW.map((x) => [x.t, 'Tip ' + x.t] as [string, string])} />
      <div style={note(p.c)}>
        <div style={{ fontSize: 14, fontWeight: 700, color: p.c }}>Tip {p.t} — {p.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}><b>Reversibil?</b> {p.rev}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}><b>Cum apare:</b> {p.how}</div>
        <div style={{ ...mono, marginTop: 8 }}>{p.ex}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Disponibilitatea algoritmilor 8/9 și sintaxa depind de versiunea IOS/IOS XE; Packet Tracer poate să nu le accepte. Verifică în show running-config.</div>
      </div>
    </div>
  );
}

/* 4) enable secret vs enable password */
export function EnablePrecedence() {
  const [pw, setPw] = useState(true);
  const [sec, setSec] = useState(true);
  const msg = sec ? 'Se cere enable secret. enable password este ignorată complet.' : pw ? 'Se cere enable password (în clar sau tip 7).' : 'Nu se cere nicio parolă la enable pe linia console; pe VTY, enable fără parolă este refuzat.';
  const c = sec ? 'var(--ok)' : pw ? 'var(--warn)' : 'var(--bad)';
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }} role="group" aria-label="Parole configurate">
        <div className="segmented" role="group" aria-label="enable password">
          <button type="button" className={pw ? 'on' : ''} onClick={() => setPw(!pw)}>enable password: {pw ? 'setată' : 'nu'}</button>
        </div>
        <div className="segmented" role="group" aria-label="enable secret">
          <button type="button" className={sec ? 'on' : ''} onClick={() => setSec(!sec)}>enable secret: {sec ? 'setat' : 'nu'}</button>
        </div>
      </div>
      <svg viewBox="0 0 720 120" role="img" aria-label="Precedența dintre enable secret și enable password">
        <Box x={20} y={40} w={150} h={44} label="User EXEC (>)" c="var(--muted)" />
        <Line x1={170} y1={62} x2={260} y2={62} />
        <T x={215} y={52} size={10.5} color="var(--text-2)" m>enable</T>
        <Box x={260} y={30} w={200} h={64} label={sec ? 'cere secret' : pw ? 'cere password' : 'nicio parolă'} sub={sec ? 'secret > password' : 'fără secret'} c={c} />
        <Line x1={460} y1={62} x2={550} y2={62} />
        <Box x={550} y={40} w={150} h={44} label="Privileged EXEC (#)" c="var(--accent)" />
      </svg>
      <div style={note(c)}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{msg}</div></div>
    </div>
  );
}

/* 5) login block-for: simulare */
export function LoginBlockDemo() {
  const MAX = 3;
  const [fails, setFails] = useState(0);
  const [quiet, setQuiet] = useState(false);
  const fail = () => {
    if (quiet) return;
    const n = fails + 1;
    setFails(n);
    if (n >= MAX) setQuiet(true);
  };
  const reset = () => { setFails(0); setQuiet(false); };
  return (
    <div>
      <div style={mono}>{'login block-for 120 attempts 3 within 60\n! 3 eșecuri în 60 s → quiet mode 120 s'}</div>
      <div style={{ display: 'flex', gap: 8, margin: '10px 0', flexWrap: 'wrap' }}>
        <button type="button" className="btn" onClick={fail}>Încercare de login eșuată</button>
        <button type="button" className="btn" onClick={reset}>Reset (a trecut timpul)</button>
      </div>
      <svg viewBox="0 0 720 90" role="img" aria-label="Contorul de eșecuri și starea quiet mode">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={60 + i * 60} cy={40} r={20} fill={i < fails ? 'var(--bad)' : 'var(--surface-3)'} stroke="var(--border)" strokeWidth={1.5} />
        ))}
        <T x={150} y={78} size={10.5} color="var(--muted)">eșecuri (max 3 în 60 s)</T>
        <Box x={330} y={20} w={360} h={44} label={quiet ? 'QUIET MODE: logările sunt refuzate (120 s)' : 'Mod normal: logările sunt acceptate'} c={quiet ? 'var(--bad)' : 'var(--ok)'} />
      </svg>
      <div style={note(quiet ? 'var(--bad)' : 'var(--info)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {quiet ? 'Quiet mode: echipamentul refuză toate încercările de login pe VTY pe durata blocării (chiar și parola corectă), cu excepția adreselor permise printr-un ACL asociat cu login quiet-mode access-class. Atacul prin ghicire este încetinit drastic.' : `Eșecuri în fereastra curentă: ${fails} din ${MAX}. La al ${MAX}-lea, apare quiet mode.`}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Simulare didactică simplificată: nu măsoară timpul real, doar numărul de eșecuri.</div>
      </div>
    </div>
  );
}

/* 6) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label={solo ? 'Topologie lab solo: PC administrator, switch, router' : 'Topologie lab ghidat: PC administrator, switch, router'}>
      <ClientIcon x={110} y={105} label="Admin PC" />
      <SwitchIcon x={320} y={105} label="SW1" />
      <RouterIcon x={520} y={105} label="R1" sub="192.168.1.1" />
      <Box x={600} y={160} w={140} h={44} label="Server syslog" sub="192.168.1.10" c="var(--accent)" />
      <Line x1={134} y1={105} x2={298} y2={105} /><Line x1={344} y1={105} x2={496} y2={105} />
      <T x={380} y={215} size={10.5} color="var(--muted)">{solo ? 'Acces local: console, VTY, enable — găsește ce nu e protejat corect' : 'LAN 192.168.1.0/24 · acces local cu parole și utilizatori'}</T>
    </svg>
  );
}
export const LabGuidedTopology53 = () => <Topo solo={false} />;
export const LabSoloTopology53 = () => <Topo solo />;
