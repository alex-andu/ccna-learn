import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.4 (politici de parole, MFA, certificate, biometrie). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const chip = (on: boolean): CSSProperties => ({ padding: '4px 10px', borderRadius: 999, border: '1.5px solid ' + (on ? 'var(--accent)' : 'var(--border)'), background: on ? 'var(--accent-soft)' : 'var(--surface-3)', color: 'var(--text)', fontSize: 12.5, cursor: 'pointer' });

/* 1) Calculator de entropie / timp de ghicire */
function human(sec: number): string {
  if (!isFinite(sec) || sec > 1e30) return 'practic imposibil';
  if (sec < 1) return 'sub o secundă';
  const u: [number, string][] = [[31557600 * 1e9, 'miliarde de ani'], [31557600 * 1e6, 'milioane de ani'], [31557600 * 1e3, 'mii de ani'], [31557600, 'ani'], [86400, 'zile'], [3600, 'ore'], [60, 'minute'], [1, 'secunde']];
  for (const [d, n] of u) if (sec >= d) return Math.round(sec / d).toLocaleString('ro-RO') + ' ' + n;
  return 'sub o secundă';
}

export function StrengthCalc() {
  const [len, setLen] = useState(10);
  const [lo, setLo] = useState(true);
  const [up, setUp] = useState(true);
  const [dg, setDg] = useState(true);
  const [sy, setSy] = useState(false);
  const [words, setWords] = useState(0);
  const charset = (lo ? 26 : 0) + (up ? 26 : 0) + (dg ? 10 : 0) + (sy ? 33 : 0);
  const useWords = words > 0;
  const bits = useWords ? words * Math.log2(7776) : charset > 0 ? len * Math.log2(charset) : 0;
  const avg = Math.pow(2, Math.max(bits - 1, 0)); // încercări medii
  const sc: [string, number, string][] = [
    ['Online, cu blocare (≈10 încercări/s)', 10, 'var(--ok)'],
    ['Offline, hash lent (≈10 000/s)', 1e4, 'var(--warn)'],
    ['Offline, hash rapid (≈10 miliarde/s)', 1e10, 'var(--bad)'],
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontSize: 13, color: 'var(--text-2)' }}>Lungime: <b>{len}</b>
          <input type="range" min={4} max={24} value={len} onChange={(e) => setLen(Number(e.target.value))} disabled={useWords} style={{ marginLeft: 8, verticalAlign: 'middle' }} aria-label="Lungimea parolei" />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-2)' }}>Cuvinte aleatoare (passphrase): <b>{words}</b>
          <input type="range" min={0} max={8} value={words} onChange={(e) => setWords(Number(e.target.value))} style={{ marginLeft: 8, verticalAlign: 'middle' }} aria-label="Număr de cuvinte aleatoare" />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }} role="group" aria-label="Tipuri de caractere">
        <span role="checkbox" aria-checked={lo} tabIndex={0} style={chip(lo)} onClick={() => setLo(!lo)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setLo(!lo); } }}>a–z (26)</span>
        <span role="checkbox" aria-checked={up} tabIndex={0} style={chip(up)} onClick={() => setUp(!up)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setUp(!up); } }}>A–Z (26)</span>
        <span role="checkbox" aria-checked={dg} tabIndex={0} style={chip(dg)} onClick={() => setDg(!dg)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setDg(!dg); } }}>0–9 (10)</span>
        <span role="checkbox" aria-checked={sy} tabIndex={0} style={chip(sy)} onClick={() => setSy(!sy)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setSy(!sy); } }}>simboluri (≈33)</span>
      </div>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {useWords ? <>Passphrase din <b>{words}</b> cuvinte alese aleator dintr-o listă de 7 776 (stil Diceware): ≈ <b>{bits.toFixed(0)}</b> biți de entropie.</> : <>Parolă aleatoare de <b>{len}</b> caractere dintr-un alfabet de <b>{charset}</b>: ≈ <b>{bits.toFixed(0)}</b> biți de entropie.</>}
        </div>
        <div style={{ marginTop: 8 }}>
          {sc.map(([n, r, c]) => (
            <div key={n} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, padding: '3px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-2)' }}>{n}</span>
              <b style={{ color: c }}>{bits === 0 ? '—' : human(avg / r)}</b>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Timp mediu până la ghicire, pentru parole alese complet aleator. Ratele sunt ipoteze ilustrative, nu măsurători. Parolele alese de oameni („Parola2024!”) au mult mai puțină entropie, fiindcă atacatorii încearcă întâi modelele uzuale (dictionary + variații). Observă: lungimea crește entropia mai mult decât adăugarea unui tip de caracter.</div>
      </div>
    </div>
  );
}

/* 2) MFA: scenarii de compromitere */
export function MfaScenarios() {
  const [k, setK] = useState('phish');
  const S: Record<string, { label: string; one: string; mfa: string; oneOk: boolean; mfaOk: boolean; note: string }> = {
    phish: { label: 'Parola furată (phishing)', one: 'Atacatorul se autentifică cu parola.', mfa: 'Mai cere un al doilea factor pe care atacatorul nu îl are.', oneOk: true, mfaOk: false, note: 'MFA oprește cele mai frecvente atacuri bazate pe parole. (Phishing avansat în timp real poate încerca să capteze și un cod OTP; metodele rezistente la phishing, precum cheile FIDO2, sunt mai sigure.)' },
    stuff: { label: 'Credential stuffing', one: 'Parola reutilizată dintr-o scurgere funcționează.', mfa: 'Parola singură nu mai ajunge.', oneOk: true, mfaOk: false, note: 'Reutilizarea parolelor devine mult mai puțin periculoasă cu MFA.' },
    phone: { label: 'Telefon pierdut', one: 'Nu are efect: autentificarea e doar parola.', mfa: 'Telefonul singur nu ajunge fără parolă (și, de obicei, ecranul e blocat).', oneOk: false, mfaOk: false, note: 'Fiecare factor singur nu ajunge; atacatorul trebuie să obțină ambii.' },
    both: { label: 'Parola ȘI telefonul compromise', one: 'Atacatorul intră cu parola.', mfa: 'Atacatorul poate trece și de al doilea factor.', oneOk: true, mfaOk: true, note: 'MFA reduce riscul, nu îl elimină: factorii trebuie protejați (blocare ecran, PIN, chei hardware).' },
  };
  const s = S[k];
  const res = (ok: boolean) => (ok ? 'ACCES OBȚINUT' : 'ACCES REFUZAT');
  return (
    <div>
      <Seg value={k} set={setK} label="Scenariu" items={Object.entries(S).map(([x, v]) => [x, v.label] as [string, string])} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
        <div style={{ border: '1.5px solid ' + (s.oneOk ? 'var(--bad)' : 'var(--ok)'), borderRadius: 8, padding: '8px 10px', background: 'var(--surface-3)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>Doar parolă (1 factor)</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{s.one}</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: s.oneOk ? 'var(--bad)' : 'var(--ok)' }}>{res(s.oneOk)}</div>
        </div>
        <div style={{ border: '1.5px solid ' + (s.mfaOk ? 'var(--bad)' : 'var(--ok)'), borderRadius: 8, padding: '8px 10px', background: 'var(--surface-3)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>Parolă + al doilea factor (MFA)</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{s.mfa}</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: s.mfaOk ? 'var(--bad)' : 'var(--ok)' }}>{res(s.mfaOk)}</div>
        </div>
      </div>
      <div style={note('var(--info)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{s.note}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Cei trei factori clasici: ceva ce <b>știi</b> (parolă, PIN), ceva ce <b>ai</b> (telefon, token, cheie, card) și ceva ce <b>ești</b> (biometrie). Două parole nu înseamnă MFA: ambele sunt „ceva ce știi”.</div>
      </div>
    </div>
  );
}

/* 3) Validarea unui certificat */
export function CertValidation() {
  const [issue, setIssue] = useState('ok');
  const R: Record<string, { label: string; ok: boolean; step: number; msg: string }> = {
    ok: { label: 'Totul în regulă', ok: true, step: 5, msg: 'Lanțul ajunge la o autoritate de încredere, datele sunt valide, numele se potrivește, certificatul nu e revocat: conexiunea este acceptată.' },
    expired: { label: 'Certificat expirat', ok: false, step: 2, msg: 'Perioada de valabilitate (notBefore/notAfter) a trecut: validarea eșuează chiar dacă semnătura e corectă.' },
    untrusted: { label: 'CA necunoscut', ok: false, step: 1, msg: 'Lanțul nu duce la un CA din magazinul de încredere (certificat self-signed sau CA intern neinstalat): avertisment sau refuz.' },
    name: { label: 'Nume nepotrivit', ok: false, step: 3, msg: 'Numele din certificat (SAN/CN) nu se potrivește cu adresa accesată: poate fi un atacator care prezintă certificatul altcuiva.' },
    revoked: { label: 'Certificat revocat', ok: false, step: 4, msg: 'CA a revocat certificatul (de exemplu cheie compromisă); verificarea CRL/OCSP îl respinge.' },
  };
  const r = R[issue];
  const steps = ['1. Lanț spre un CA de încredere', '2. Perioada de valabilitate', '3. Numele se potrivește', '4. Nu e revocat (CRL/OCSP)', '5. Cheia publică e acceptată'];
  return (
    <div>
      <Seg value={issue} set={setIssue} label="Situația certificatului" items={Object.entries(R).map(([x, v]) => [x, v.label] as [string, string])} />
      <svg viewBox="0 0 720 150" role="img" aria-label="Lanțul de încredere: CA rădăcină, CA intermediar, certificatul serverului">
        <Box x={20} y={50} w={150} h={46} label="Root CA" sub="în magazinul de încredere" c="var(--accent)" />
        <Line x1={170} y1={73} x2={250} y2={73} />
        <T x={210} y={64} size={10} color="var(--muted)">semnează</T>
        <Box x={250} y={50} w={160} h={46} label="CA intermediar" sub="emis de Root CA" c="var(--info)" />
        <Line x1={410} y1={73} x2={490} y2={73} />
        <T x={450} y={64} size={10} color="var(--muted)">semnează</T>
        <Box x={490} y={50} w={210} h={46} label="Certificat server" sub="www.exemplu.ro" c={r.ok ? 'var(--ok)' : 'var(--bad)'} />
        <T x={360} y={130} size={11} color="var(--text-2)">Clientul verifică semnăturile de jos în sus până la un CA în care are încredere</T>
      </svg>
      <div style={{ display: 'grid', gap: 4, marginTop: 6 }}>
        {steps.map((s, i) => {
          const failed = !r.ok && i + 1 === r.step;
          const passed = r.ok || i + 1 < r.step;
          return <div key={s} style={{ fontSize: 13, color: failed ? 'var(--bad)' : passed ? 'var(--ok)' : 'var(--muted)', fontWeight: failed ? 700 : 400 }}>{failed ? '✗ ' : passed ? '✓ ' : '○ '}{s}</div>;
        })}
      </div>
      <div style={note(r.ok ? 'var(--ok)' : 'var(--bad)')}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{r.msg}</div></div>
    </div>
  );
}

/* 4) Biometrie: FAR / FRR */
export function BiometricTradeoff() {
  const [th, setTh] = useState(50);
  // curbe conceptuale (logistice) — ilustrative, nu date reale
  const far = (t: number) => 100 / (1 + Math.exp((t - 35) / 9));
  const frr = (t: number) => 100 / (1 + Math.exp(-(t - 65) / 9));
  const pts = (f: (t: number) => number) => Array.from({ length: 101 }, (_, i) => `${40 + i * 6.4},${20 + (100 - f(i)) * 1.5}`).join(' ');
  return (
    <div>
      <label style={{ fontSize: 13, color: 'var(--text-2)' }}>Prag de potrivire (strictețe): <b>{th}</b>
        <input type="range" min={0} max={100} value={th} onChange={(e) => setTh(Number(e.target.value))} style={{ marginLeft: 8, verticalAlign: 'middle' }} aria-label="Pragul de potrivire biometrică" />
      </label>
      <svg viewBox="0 0 720 190" role="img" aria-label="Curbele conceptuale FAR și FRR în funcție de pragul de potrivire; se intersectează în punctul de eroare egală">
        <line x1={40} y1={170} x2={690} y2={170} stroke="var(--border)" />
        <line x1={40} y1={20} x2={40} y2={170} stroke="var(--border)" />
        <polyline points={pts(far)} fill="none" stroke="var(--bad)" strokeWidth={2.2} />
        <polyline points={pts(frr)} fill="none" stroke="var(--info)" strokeWidth={2.2} />
        <line x1={40 + th * 6.4} y1={20} x2={40 + th * 6.4} y2={170} stroke="var(--accent)" strokeWidth={2} strokeDasharray="5 4" />
        <T x={600} y={34} size={11} weight={700} anchor="end" color="var(--bad)">FAR (acceptă intruși)</T>
        <T x={120} y={34} size={11} weight={700} anchor="start" color="var(--info)">FRR (respinge utilizatori reali)</T>
        <T x={365} y={186} size={10.5} color="var(--muted)">prag mai larg ← → prag mai strict</T>
      </svg>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>La acest prag: <b style={{ color: 'var(--bad)' }}>FAR ≈ {far(th).toFixed(1)}%</b> (impostori acceptați) și <b style={{ color: 'var(--info)' }}>FRR ≈ {frr(th).toFixed(1)}%</b> (utilizatori legitimi respinși). Un prag strict scade FAR dar crește FRR; punctul în care se întâlnesc este <b>CER/EER</b> (rata de eroare egală), folosit pentru a compara sisteme.</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Curbe conceptuale, nu date de la un produs real. Biometria nu poate fi „schimbată” ca o parolă dacă e compromisă și ridică probleme de confidențialitate.</div>
      </div>
    </div>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label={solo ? 'Topologie lab solo: PC administrator, switch, router' : 'Topologie lab ghidat: PC administrator, switch, router'}>
      <ClientIcon x={110} y={105} label="Admin PC" />
      <SwitchIcon x={320} y={105} label="SW1" />
      <RouterIcon x={520} y={105} label="R1" sub="192.168.1.1" />
      <Box x={600} y={160} w={140} h={44} label="Server syslog" sub="192.168.1.10" c="var(--accent)" />
      <Line x1={134} y1={105} x2={298} y2={105} /><Line x1={344} y1={105} x2={496} y2={105} />
      <T x={380} y={215} size={10.5} color="var(--muted)">{solo ? 'Politică de parole: de la cerințe la comenzi IOS' : 'LAN 192.168.1.0/24 · politica de parole aplicată pe R1'}</T>
    </svg>
  );
}
export const LabGuidedTopology54 = () => <Topo solo={false} />;
export const LabSoloTopology54 = () => <Topo solo />;
