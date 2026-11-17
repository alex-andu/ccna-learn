import { useState, type CSSProperties } from 'react';
import { APIcon, ClientIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.9 (securitate wireless: WPA, WPA2, WPA3). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Selector de moduri de securitate */
type Mode = 'open' | 'wep' | 'wpa' | 'wpa2p' | 'wpa2e' | 'wpa3p' | 'wpa3e' | 'owe';
const MODES: Record<Mode, { name: string; auth: string; enc: string; pmf: string; verdict: string; vc: string; score: number; why: string }> = {
  open: { name: 'Open', auth: 'nicio autentificare', enc: 'nicio criptare', pmf: 'nu', verdict: 'nesigur', vc: 'var(--bad)', score: 0, why: 'Oricine se asociază și oricine ascultă vede traficul în clar. Un portal captiv (web auth) cere date la nivel L3, dar nu criptează cadrele Wi-Fi.' },
  wep: { name: 'WEP', auth: 'cheie statică (open/shared key)', enc: 'RC4, cheie 40/104 biți + IV 24 biți', pmf: 'nu', verdict: 'spart — nu se folosește', vc: 'var(--bad)', score: 0, why: 'IV-ul scurt se repetă, iar cheia se poate recupera în minute din traficul capturat. Istoric: 1997.' },
  wpa: { name: 'WPA (TKIP)', auth: 'PSK sau 802.1X', enc: 'TKIP (RC4 cu chei pe pachet) + MIC „Michael”', pmf: 'nu', verdict: 'depreciat', vc: 'var(--warn)', score: 1, why: 'Soluție de tranziție (2003) pentru hardware vechi: repară cel mai grav defect WEP, dar rămâne pe RC4. Nu mai este recomandat; TKIP este depreciat în standard.' },
  wpa2p: { name: 'WPA2-Personal (PSK)', auth: 'PSK (parolă comună)', enc: 'AES-CCMP (128 biți)', pmf: 'opțional', verdict: 'acceptabil, cu parolă puternică', vc: 'var(--info)', score: 2, why: 'Criptare solidă, dar handshake-ul capturat permite atac de dicționar OFFLINE asupra parolei. Fără forward secrecy: o parolă aflată mai târziu poate decripta trafic capturat.' },
  wpa2e: { name: 'WPA2-Enterprise', auth: '802.1X / EAP (RADIUS)', enc: 'AES-CCMP (128 biți)', pmf: 'opțional', verdict: 'bun (companii)', vc: 'var(--ok)', score: 3, why: 'Fiecare utilizator are credențiale proprii și cheie unică de sesiune; revocarea unui utilizator nu afectează ceilalți. Cere server RADIUS.' },
  wpa3p: { name: 'WPA3-Personal (SAE)', auth: 'SAE (Dragonfly), parolă comună', enc: 'AES-CCMP (128 biți)', pmf: 'obligatoriu', verdict: 'recomandat (acasă/SOHO)', vc: 'var(--ok)', score: 3, why: 'Schimbul de chei SAE rezistă la atacul de dicționar offline și oferă forward secrecy; PMF este obligatoriu.' },
  wpa3e: { name: 'WPA3-Enterprise', auth: '802.1X / EAP (RADIUS)', enc: 'AES-CCMP; mod opțional 192 biți: GCMP-256', pmf: 'obligatoriu', verdict: 'cel mai puternic', vc: 'var(--ok)', score: 4, why: 'Același model 802.1X, cu PMF obligatoriu și un mod opțional de 192 biți (suită CNSA) pentru medii cu cerințe înalte.' },
  owe: { name: 'OWE (Enhanced Open)', auth: 'nicio autentificare', enc: 'criptare individuală prin schimb Diffie-Hellman', pmf: 'obligatoriu', verdict: 'rețele deschise, dar criptate', vc: 'var(--info)', score: 2, why: 'Pentru rețele „fără parolă” (cafenele): traficul fiecărui client este criptat, deci un ascultător pasiv nu mai vede conținutul. Nu autentifică AP-ul (protecția la evil twin este limitată).' },
};

export function SecurityModePicker() {
  const [m, setM] = useState<Mode>('wpa2p');
  const d = MODES[m];
  return (
    <div>
      <Seg value={m} set={setM} label="Mod de securitate" items={(Object.keys(MODES) as Mode[]).map((k) => [k, MODES[k].name] as [Mode, string])} />
      <svg viewBox="0 0 720 170" role="img" aria-label="Proprietățile modului de securitate Wi-Fi ales">
        <ClientIcon x={70} y={85} label="Client" kind="laptop" />
        <APIcon x={640} y={85} label="AP" />
        <Line x1={100} y1={85} x2={610} y2={85} c={d.vc} w={d.score === 0 ? 2 : 4} dash={d.score === 0 ? '6 5' : undefined} flow={d.score > 0} />
        <T x={360} y={68} size={12} weight={700} color={d.vc}>{d.name}</T>
        <T x={360} y={106} size={11} color="var(--text-2)">autentificare: {d.auth}</T>
        <T x={360} y={124} size={11} color="var(--text-2)">criptare: {d.enc}</T>
        <T x={360} y={142} size={11} color="var(--text-2)">PMF (802.11w): {d.pmf}</T>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={282 + i * 32} y={152} width={28} height={8} rx={3} fill={i < d.score + (d.score === 0 ? 0 : 0) ? d.vc : 'var(--surface-3)'} stroke="var(--border)" />)}
      </svg>
      <div style={note(d.vc)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>{d.verdict}.</b> {d.why}</div>
      </div>
    </div>
  );
}

/* 2) PSK vs SAE */
export function PskVsSae() {
  const [mode, setMode] = useState<'psk' | 'sae'>('psk');
  const [weak, setWeak] = useState(true);
  const psk = mode === 'psk';
  const outcome = psk
    ? (weak ? { t: 'Parola este găsită în ore/minute: atacatorul testează milioane de parole pe secundă, offline, pe un handshake capturat.', c: 'var(--bad)' } : { t: 'O parolă lungă și aleatorie rezistă practic la dicționar, dar handshake-ul rămâne capturabil; siguranța depinde 100% de parolă.', c: 'var(--warn)' })
    : { t: 'Fiecare ghicire cere o interacțiune ACTIVĂ cu AP-ul (online): atacatorul nu poate testa parole offline pe un handshake capturat, iar AP-ul poate limita încercările.', c: 'var(--ok)' };
  return (
    <div>
      <Seg value={mode} set={setMode} label="Metoda Personal" items={[['psk', 'WPA2-Personal (PSK)'], ['sae', 'WPA3-Personal (SAE)']]} />
      <Seg value={weak ? 'weak' : 'strong'} set={(k) => setWeak(k === 'weak')} label="Parola" items={[['weak', 'Parolă slabă („parola123”)'], ['strong', 'Parolă lungă, aleatorie']]} />
      <svg viewBox="0 0 720 220" role="img" aria-label="Atac de dicționar offline asupra PSK versus SAE">
        <ClientIcon x={80} y={80} label="Client legitim" kind="laptop" />
        <APIcon x={330} y={80} label="AP" />
        <Box x={560} y={50} w={150} h={60} label="Atacator" sub={psk ? 'capturează handshake-ul' : 'nu poate testa offline'} c={psk ? 'var(--bad)' : 'var(--ok)'} />
        <Line x1={106} y1={80} x2={304} y2={80} c="var(--ok)" w={3} flow />
        <T x={205} y={66} size={10.5} color="var(--ok)">{psk ? '4-way handshake' : 'SAE (Dragonfly) + 4-way'}</T>
        <Line x1={560} y1={92} x2={356} y2={92} c={psk ? 'var(--bad)' : 'var(--border)'} w={psk ? 2.5 : 1.5} dash="5 4" />
        <T x={455} y={118} size={10.5} color={psk ? 'var(--bad)' : 'var(--muted)'}>{psk ? 'ascultă pasiv' : 'ascultă: nu ajută'}</T>
        <rect x={180} y={140} width={360} height={46} rx={8} fill="var(--surface-3)" stroke={outcome.c} strokeWidth={2.4} />
        <T x={360} y={160} size={11.5} weight={700} color={outcome.c}>{psk ? 'dicționar offline: miliarde de încercări' : 'ghicire online: o încercare = o interacțiune cu AP-ul'}</T>
        <T x={360} y={178} size={10.5} color="var(--text-2)">{psk ? 'fără forward secrecy: parola aflată mai târziu poate decripta tot ce s-a capturat' : 'forward secrecy: parola aflată mai târziu nu decriptează trafic vechi'}</T>
      </svg>
      <div style={note(outcome.c)}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{outcome.t}</div></div>
    </div>
  );
}

/* 3) WPA2/WPA3-Enterprise pas cu pas */
const ENT = [
  { k: '1', t: 'Asociere deschisă', d: 'Clientul se asociază cu AP-ul (Open System). Portul „controlat” al AP-ului este blocat: doar EAPOL trece.', f: 'client', to: 'ap', c: 'var(--accent)' },
  { k: '2', t: 'Identitate EAP', d: 'AP-ul (authenticator) cere identitatea (EAP Request-Identity); clientul (supplicant) răspunde cu un nume (de obicei anonim în exterior).', f: 'ap', to: 'client', c: 'var(--info)' },
  { k: '3', t: 'Către RADIUS', d: 'AP-ul/WLC împachetează EAP într-un RADIUS Access-Request către serverul de autentificare (de exemplu ISE).', f: 'ap', to: 'srv', c: 'var(--info)' },
  { k: '4', t: 'Tunel + autentificare', d: 'Serverul și clientul stabilesc metoda EAP: EAP-TLS (certificate pe ambele părți) sau PEAP (tunel TLS cu certificatul serverului, apoi parolă/MSCHAPv2 înăuntru). Clientul trebuie să valideze certificatul serverului.', f: 'client', to: 'srv', c: 'var(--violet)' },
  { k: '5', t: 'Access-Accept + cheie', d: 'Serverul răspunde Access-Accept și trimite AP-ului cheia-master a sesiunii (din care rezultă PMK). Opțional: atribute (VLAN, ACL).', f: 'srv', to: 'ap', c: 'var(--ok)' },
  { k: '6', t: '4-way handshake', d: 'Din PMK, AP-ul și clientul derivă PTK-ul prin 4-way handshake; traficul este criptat (AES-CCMP/GCMP). Cheia este unică pe utilizator și pe sesiune.', f: 'ap', to: 'client', c: 'var(--ok)' },
];
export function EnterpriseFlow() {
  const [i, setI] = useState(0);
  const s = ENT[i];
  const X: Record<string, number> = { client: 90, ap: 360, srv: 630 };
  return (
    <div>
      <Seg value={String(i)} set={(k) => setI(Number(k))} label="Pas" items={ENT.map((x, n) => [String(n), x.k + ' · ' + x.t] as [string, string])} />
      <svg viewBox="0 0 720 170" role="img" aria-label="Pașii autentificării WPA2/WPA3-Enterprise între client, AP și serverul RADIUS">
        <ClientIcon x={X.client} y={80} label="Supplicant" kind="laptop" />
        <APIcon x={X.ap} y={80} label="AP / WLC (authenticator)" />
        <Box x={X.srv - 62} y={55} w={124} h={50} label="Server RADIUS" sub="authentication server" c="var(--accent)" />
        <Line x1={X.client + 26} y1={80} x2={X.ap - 26} y2={80} c="var(--border)" w={1.5} dash="4 4" />
        <Line x1={X.ap + 26} y1={80} x2={X.srv - 62} y2={80} c="var(--border)" w={1.5} dash="4 4" />
        <Line x1={X[s.f] + (X[s.to] > X[s.f] ? 28 : -28)} y1={80} x2={X[s.to] + (X[s.to] > X[s.f] ? -28 : 28)} y2={80} c={s.c} w={4} flow />
        <T x={(X[s.f] + X[s.to]) / 2} y={64} size={11} weight={700} color={s.c}>{s.t}</T>
        <T x={225} y={145} size={10.5} color="var(--muted)">EAPOL / Wi-Fi</T>
        <T x={495} y={145} size={10.5} color="var(--muted)">RADIUS (UDP 1812)</T>
      </svg>
      <div style={note(s.c)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>{s.k}. {s.t}.</b> {s.d}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="btn sm" disabled={i === 0} onClick={() => setI(i - 1)}>← Înapoi</button>
          <button type="button" className="btn sm" disabled={i === ENT.length - 1} onClick={() => setI(i + 1)}>Înainte →</button>
        </div>
      </div>
    </div>
  );
}

/* 4) Atacuri și apărări */
type Atk = 'deauth' | 'evil' | 'rogue' | 'dict' | 'sniff';
const ATK: Record<Atk, { name: string; what: string; fix: string }> = {
  deauth: { name: 'Deauthentication', what: 'Atacatorul trimite cadre de management „deauth” falsificate (în numele AP-ului), ca să deconecteze clientul — pentru DoS sau ca să captureze noul handshake.', fix: 'PMF (802.11w): cadrele de management sunt protejate; obligatoriu la WPA3.' },
  evil: { name: 'Evil twin', what: 'Un AP al atacatorului copiază SSID-ul unei rețele legitime ca clienții să se conecteze la el și să-i poată intercepta traficul.', fix: 'WPA2/3-Enterprise cu validarea certificatului serverului; WIPS; educația utilizatorilor. OWE/PSK singure nu autentifică AP-ul.' },
  rogue: { name: 'Rogue AP', what: 'Un AP neautorizat conectat la rețeaua cablată (de un angajat sau atacator): ocolește politicile și deschide o ușă în LAN.', fix: 'Detecție rogue de către WLC/WIPS, port security / 802.1X pe porturile de acces, politici.' },
  dict: { name: 'Dicționar offline pe WPA2-PSK', what: 'Atacatorul capturează 4-way handshake-ul și testează parole offline, fără să mai interacționeze cu rețeaua.', fix: 'Parolă lungă și aleatorie; mai bine WPA3-Personal (SAE) sau Enterprise.' },
  sniff: { name: 'Ascultare pasivă', what: 'Oricine din raza semnalului poate captura cadrele (mediul este partajat). În rețele deschise, conținutul este vizibil.', fix: 'Criptare: WPA2/WPA3 sau OWE pentru rețele deschise.' },
};
export function WirelessAttacks() {
  const [a, setA] = useState<Atk>('deauth');
  const d = ATK[a];
  return (
    <div>
      <Seg value={a} set={setA} label="Atac" items={(Object.keys(ATK) as Atk[]).map((k) => [k, ATK[k].name] as [Atk, string])} />
      <div style={note('var(--bad)')}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>Ce face:</b> {d.what}</div></div>
      <div style={note('var(--ok)')}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>Apărare:</b> {d.fix}</div></div>
    </div>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 240" role="img" aria-label={solo ? 'Topologie lab solo wireless: AP, două laptopuri, un AP rogue' : 'Topologie lab ghidat wireless: router wireless și două laptopuri'}>
      <APIcon x={380} y={100} label={solo ? 'AP-Corp' : 'Router wireless'} />
      <ClientIcon x={140} y={60} label="Laptop-1" kind="laptop" />
      <ClientIcon x={140} y={170} label="Laptop-2" kind="laptop" />
      {solo && <APIcon x={620} y={170} label="AP necunoscut" />}
      <Line x1={166} y1={66} x2={354} y2={96} c="var(--info)" dash="5 4" /><Line x1={166} y1={164} x2={354} y2={108} c="var(--info)" dash="5 4" />
      <T x={380} y={216} size={11} color="var(--muted)">{solo ? 'Fiecare client are o configurație de securitate; unul nu se poate conecta' : 'Configurezi WPA2-Personal pe router și conectezi clienții'}</T>
    </svg>
  );
}
export const LabGuidedTopology59 = () => <Topo solo={false} />;
export const LabSoloTopology59 = () => <Topo solo />;
