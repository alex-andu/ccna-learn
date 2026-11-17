import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.1 (concepte de securitate). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Lanțul risc: asset – vulnerabilitate – amenințare – exploit – impact; mitigarea rupe lanțul */
type Scenario = { k: string; label: string; asset: string; vuln: string; threat: string; exploit: string; impact: string; mit: string };
const SCEN: Scenario[] = [
  { k: 'patch', label: 'Server nepatch-uit', asset: 'Server web cu date clienți', vuln: 'Versiune software cu o eroare cunoscută (CVE) neaplicat patch', threat: 'Atacator extern care scanează Internetul', exploit: 'Cod/instrument care folosește eroarea pentru a rula comenzi', impact: 'Date furate, server preluat (confidențialitate, integritate)', mit: 'Patch management, segmentare, IPS, backup-uri' },
  { k: 'pass', label: 'Parolă slabă', asset: 'Switch de acces (administrare)', vuln: 'Parolă scurtă/implicită, fără blocare după încercări', threat: 'Persoană care încearcă parole (brute force / dictionary)', exploit: 'Scriptul de ghicit parole pe SSH/Telnet', impact: 'Configurație modificată, rețea oprită (integritate, disponibilitate)', mit: 'Politică de parole, MFA, login block-for, SSH, AAA' },
  { k: 'phish', label: 'Utilizator păcălit', asset: 'Contul de e-mail al unui angajat', vuln: 'Utilizator neinstruit, fără MFA', threat: 'Atacator care trimite e-mailuri de phishing', exploit: 'Pagină falsă de autentificare care colectează credențiale', impact: 'Cont compromis, mișcare laterală în rețea', mit: 'Instruire și simulări, filtrare e-mail, MFA' },
  { k: 'ddos', label: 'Serviciu expus', asset: 'Portal public de comandă online', vuln: 'Capacitate limitată, fără protecție anti-flood', threat: 'Rețea de dispozitive infectate (botnet)', exploit: 'Trafic masiv către portal (DDoS)', impact: 'Serviciu indisponibil (disponibilitate)', mit: 'Filtrare la furnizor, scrubbing, rate limiting, redundanță' },
];

export function RiskChain() {
  const [k, setK] = useState('patch');
  const s = SCEN.find((x) => x.k === k) ?? SCEN[0];
  const cols: [string, string, string][] = [
    ['Asset', s.asset, 'var(--accent)'],
    ['Vulnerability', s.vuln, 'var(--warn)'],
    ['Threat', s.threat, 'var(--bad)'],
    ['Exploit', s.exploit, 'var(--bad)'],
    ['Impact', s.impact, 'var(--violet)'],
  ];
  return (
    <div>
      <Seg value={k} set={setK} label="Scenariu" items={SCEN.map((x) => [x.k, x.label] as [string, string])} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
        {cols.map(([t, d, c], i) => (
          <div key={t} style={{ border: '1.5px solid ' + c, borderRadius: 8, padding: '8px 10px', background: 'var(--surface-3)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: c }}>{i + 1}. {t}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 4 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={note('var(--ok)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b style={{ color: 'var(--ok)' }}>Mitigare:</b> {s.mit}. Mitigarea acționează pe lanț: reduce vulnerabilitatea, blochează exploitul sau limitează impactul.</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Risc = probabilitatea ca o amenințare să exploateze o vulnerabilitate × impactul asupra asset-ului. Fără vulnerabilitate sau fără amenințare, riscul scade.</div>
      </div>
    </div>
  );
}

/* 2) Catalogul de atacuri */
type Atk = { k: string; label: string; cia: ('C' | 'I' | 'A')[]; what: string; ex: string; mit: string };
const ATK: Atk[] = [
  { k: 'mal', label: 'Malware', cia: ['C', 'I', 'A'], what: 'Software rău intenționat: virus (se atașează de fișiere), worm (se răspândește singur prin rețea), trojan (pare legitim), ransomware (criptează datele și cere răscumpărare), spyware/keylogger (spionează).', ex: 'Un worm care se propagă prin SMB; un ransomware care criptează un server de fișiere.', mit: 'Antivirus/EDR, patch-uri, segmentare, backup-uri offline, filtrare e-mail/web.' },
  { k: 'soc', label: 'Social engineering', cia: ['C', 'I'], what: 'Manipularea oamenilor, nu a sistemelor: phishing (e-mail), spear phishing (țintit), whaling (conducere), vishing (voce), smishing (SMS), pretexting, tailgating (intri după altcineva).', ex: 'E-mail „parola ta expiră” cu un link spre o pagină falsă.', mit: 'Instruire și simulări de phishing, MFA, proceduri de verificare, control fizic al accesului.' },
  { k: 'dos', label: 'DoS / DDoS', cia: ['A'], what: 'Epuizează resursele (bandă, CPU, conexiuni) ca serviciul să nu mai răspundă. DDoS = din multe surse (botnet). Reflection/amplification: atacatorul falsifică sursa și folosește servere publice care răspund cu mult mai mult trafic spre victimă.', ex: 'SYN flood; amplificare prin DNS/NTP deschise.', mit: 'Filtrare anti-spoofing, rate limiting, servicii anti-DDoS ale furnizorului, redundanță.' },
  { k: 'mitm', label: 'Man-in-the-middle', cia: ['C', 'I'], what: 'Atacatorul se interpune în comunicație, citește și poate modifica traficul. Se obține prin ARP spoofing, un AP fals (evil twin) sau un DHCP/DNS fals.', ex: 'Un laptop care răspunde fals la ARP și devine „gateway”.', mit: 'Criptare end-to-end (TLS, SSH, VPN), DAI, DHCP snooping, certificate valide.' },
  { k: 'rec', label: 'Reconnaissance', cia: ['C'], what: 'Culegerea de informații înaintea unui atac: scanări de porturi, ping sweep, interogări DNS, citirea de bannere, căutări publice (OSINT).', ex: 'Un scan de porturi care descoperă Telnet deschis.', mit: 'Reducerea suprafeței de atac, ACL/firewall, bannere minime, monitorizare și IPS.' },
  { k: 'pwd', label: 'Atacuri la parole', cia: ['C', 'I'], what: 'Brute force (toate combinațiile), dictionary (parole uzuale), password spraying (o parolă pe multe conturi), credential stuffing (credențiale scurse reutilizate).', ex: 'Zeci de mii de încercări de autentificare SSH de la o singură adresă.', mit: 'Parole lungi, unice, MFA, blocare/întârziere după eșecuri, jurnalizare și alertare.' },
  { k: 'spoof', label: 'Spoofing', cia: ['I', 'C'], what: 'Falsificarea unei identități sau adrese: IP, MAC, ARP, DNS, e-mail. Dispozitivul țintă crede că vorbește cu cineva de încredere.', ex: 'Adresă IP sursă falsificată într-un atac de reflecție.', mit: 'Filtrare de intrare/ieșire, DAI, port security, autentificarea mesajelor (SPF/DKIM).' },
];

export function AttackCatalog() {
  const [k, setK] = useState('mal');
  const a = ATK.find((x) => x.k === k) ?? ATK[0];
  const ciaName: Record<string, string> = { C: 'Confidențialitate', I: 'Integritate', A: 'Disponibilitate' };
  return (
    <div>
      <Seg value={k} set={setK} label="Tip de atac" items={ATK.map((x) => [x.k, x.label] as [string, string])} />
      <div style={note('var(--bad)')}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bad)' }}>{a.label}</div>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 6 }}>{a.what}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}><b>Exemplu:</b> {a.ex}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}><b style={{ color: 'var(--ok)' }}>Mitigare:</b> {a.mit}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Afectează: {(['C', 'I', 'A'] as const).map((c) => <span key={c} style={{ marginRight: 10, fontWeight: a.cia.includes(c) ? 700 : 400, color: a.cia.includes(c) ? 'var(--warn)' : 'var(--muted)' }}>{a.cia.includes(c) ? '● ' : '○ '}{ciaName[c]}</span>)}</div>
      </div>
    </div>
  );
}

/* 3) Defense in depth */
const LAYERS: { n: string; d: string; ex: string }[] = [
  { n: 'Politici și oameni', d: 'Politici, instruire, proceduri', ex: 'Politica de parole, instruire anti-phishing' },
  { n: 'Fizic', d: 'Acces controlat la clădire/rack', ex: 'Badge, cameră, rack încuiat' },
  { n: 'Perimetru', d: 'Firewall, IPS, VPN', ex: 'NGFW, IPS, filtrare Internet' },
  { n: 'Rețea internă', d: 'Segmentare, ACL, securitate L2', ex: 'VLAN-uri, ACL, port security, DHCP snooping' },
  { n: 'Gazdă', d: 'Patch-uri, antivirus, hardening', ex: 'Actualizări, EDR, conturi minime' },
  { n: 'Aplicație și date', d: 'Autentificare, criptare, backup', ex: 'MFA, TLS, backup-uri' },
];

export function DefenseInDepth() {
  const [failed, setFailed] = useState<number | null>(null);
  const pick = (i: number) => setFailed((f) => (f === i ? null : i));
  return (
    <div>
      <svg viewBox="0 0 720 260" role="img" aria-label="Apărare în adâncime: șase straturi de protecție; dacă unul cedează, celelalte încă opresc atacul">
        {LAYERS.map((l, i) => {
          const w = 700 - i * 90;
          const x = 10 + i * 45;
          const y = 10 + i * 18;
          const h = 240 - i * 36;
          const bad = failed === i;
          return (
            <g key={l.n} onClick={() => pick(i)} style={{ cursor: 'pointer' }} role="button" aria-label={'Strat ' + l.n}>
              <rect x={x} y={y} width={w} height={h} rx={10} fill={bad ? 'var(--surface-2)' : 'var(--surface-3)'} fillOpacity={0.55} stroke={bad ? 'var(--bad)' : 'var(--accent)'} strokeWidth={bad ? 3 : 1.4} strokeDasharray={bad ? '6 4' : undefined} />
              <T x={x + 12} y={y + 15} size={11} weight={700} anchor="start" color={bad ? 'var(--bad)' : 'var(--accent)'}>{i + 1}. {l.n}{bad ? ' — CEDAT' : ''}</T>
            </g>
          );
        })}
        <T x={360} y={140} size={12} weight={700}>Date și servicii critice</T>
      </svg>
      <div style={note(failed === null ? 'var(--border)' : 'var(--warn)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {failed === null
            ? 'Apasă pe un strat ca să simulezi că a cedat. Ideea: niciun control nu e perfect, deci mai multe straturi independente.'
            : `Stratul „${LAYERS[failed].n}” a cedat (${LAYERS[failed].d}). Atacatorul trebuie să treacă și de celelalte ${LAYERS.length - 1} straturi: ${LAYERS.filter((_, j) => j !== failed).map((l) => l.n).join(', ')}.`}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Exemple pe strat: {LAYERS.map((l) => l.n + ' → ' + l.ex).join(' · ')}.</div>
      </div>
    </div>
  );
}

/* 4) Topologie lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label={solo ? 'Topologie lab solo hardening: PC, switch, router' : 'Topologie lab ghidat hardening: PC, switch, router'}>
      <ClientIcon x={110} y={105} label="PC1" />
      <SwitchIcon x={320} y={105} label="SW1" />
      <RouterIcon x={520} y={105} label="R1" sub="192.168.1.1" />
      <Box x={600} y={160} w={140} h={44} label="Server intern" sub="192.168.1.10" c="var(--accent)" />
      <Line x1={134} y1={105} x2={298} y2={105} /><Line x1={344} y1={105} x2={496} y2={105} />
      <T x={380} y={215} size={10.5} color="var(--muted)">{solo ? 'Audit: găsește slăbiciunile configurației și clasifică-le' : 'LAN 192.168.1.0/24 · hardening pas cu pas'}</T>
    </svg>
  );
}
export const LabGuidedTopology51 = () => <Topo solo={false} />;
export const LabSoloTopology51 = () => <Topo solo />;
