import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.2 (program de securitate: conștientizare, instruire, acces fizic). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Piramida documentelor de securitate */
const DOCS = [
  { k: 'policy', label: 'Policy', def: 'Declarație de nivel înalt, aprobată de conducere: CE se cere și DE CE. Obligatorie.', ex: '„Accesul la rețea se face doar cu autentificare puternică.”', who: 'Conducere / comitet de securitate', c: 'var(--accent)' },
  { k: 'standard', label: 'Standard', def: 'Cerințe obligatorii, măsurabile, care implementează politica.', ex: '„Parolele au minimum 12 caractere; SSH versiunea 2.”', who: 'Echipa de securitate', c: 'var(--info)' },
  { k: 'procedure', label: 'Procedure', def: 'Pașii concreți, în ordine, pentru a îndeplini o sarcină conform standardului.', ex: '„Cum se predă un echipament nou: pașii de hardening.”', who: 'Echipele operaționale', c: 'var(--ok)' },
  { k: 'guideline', label: 'Guideline', def: 'Recomandări și bune practici; nu sunt obligatorii.', ex: '„Se recomandă un manager de parole.”', who: 'Echipa de securitate / experți', c: 'var(--warn)' },
];

export function PolicyPyramid() {
  const [k, setK] = useState('policy');
  const d = DOCS.find((x) => x.k === k) ?? DOCS[0];
  return (
    <div>
      <Seg value={k} set={setK} label="Document" items={DOCS.map((x) => [x.k, x.label] as [string, string])} />
      <svg viewBox="0 0 720 200" role="img" aria-label="Ierarhia documentelor: policy, standard, procedure, guideline">
        {DOCS.map((x, i) => {
          const w = 260 + i * 120;
          const xx = 360 - w / 2;
          const on = x.k === k;
          return (
            <g key={x.k} onClick={() => setK(x.k)} style={{ cursor: 'pointer' }}>
              <rect x={xx} y={8 + i * 46} width={w} height={40} rx={8} fill="var(--surface-3)" stroke={x.c} strokeWidth={on ? 3 : 1.3} opacity={on ? 1 : 0.7} />
              <T x={360} y={33 + i * 46} size={13} weight={700} color={x.c}>{x.label}</T>
            </g>
          );
        })}
      </svg>
      <div style={note(d.c)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b style={{ color: d.c }}>{d.label}:</b> {d.def}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}><b>Exemplu:</b> {d.ex}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Scris de obicei de: {d.who}. De sus în jos: mai general → mai concret.</div>
      </div>
    </div>
  );
}

/* 2) Conștientizare vs instruire vs educație */
const LEARN = [
  { k: 'aw', label: 'Awareness', q: 'CE să recunosc?', aud: 'Toți utilizatorii', goal: 'Schimbarea comportamentului prin informare scurtă și repetată', ex: 'Postere, e-mailuri, buletine, simulări de phishing, bannere de login', freq: 'Continuu, scurt' },
  { k: 'tr', label: 'Training', q: 'CUM fac?', aud: 'Pe roluri (administratori, dezvoltatori, personal HR)', goal: 'Competențe practice pentru o sarcină', ex: 'Curs de hardening pentru adminii de rețea, instruire pentru răspuns la incidente', freq: 'Periodic, la angajare și la schimbarea rolului' },
  { k: 'ed', label: 'Education', q: 'DE CE funcționează?', aud: 'Specialiști în securitate', goal: 'Înțelegere profundă și capacitate de proiectare', ex: 'Studii universitare, certificări avansate, cercetare', freq: 'Pe termen lung' },
];

export function LearningLevels() {
  const [k, setK] = useState('aw');
  const d = LEARN.find((x) => x.k === k) ?? LEARN[0];
  return (
    <div>
      <Seg value={k} set={setK} label="Nivel" items={LEARN.map((x) => [x.k, x.label] as [string, string])} />
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{d.label} — „{d.q}”</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}><b>Public:</b> {d.aud}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}><b>Scop:</b> {d.goal}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}><b>Exemple:</b> {d.ex}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Frecvență: {d.freq}.</div>
      </div>
    </div>
  );
}

/* 3) Spot the phish */
const FLAGS = [
  { k: 'sender', label: 'Expeditor: suport@firma-it.example.net', bad: true, why: 'Domeniul nu este cel al companiei (firma.example); nu te baza doar pe numele afișat.' },
  { k: 'urgent', label: 'Subiect: URGENT — contul tău va fi blocat în 1 oră!', bad: true, why: 'Urgența și amenințarea sunt trucuri clasice de presiune.' },
  { k: 'greet', label: 'Salut: „Stimate utilizator,”', bad: true, why: 'Un mesaj intern real ar folosi de obicei numele tău.' },
  { k: 'link', label: 'Link afișat: portal.firma.example → duce la http://login-firma.example.top/…', bad: true, why: 'Textul linkului diferă de destinație; verifică adresa reală înainte să dai click.' },
  { k: 'sig', label: 'Semnătură: Echipa IT, interior 214', bad: false, why: 'Detaliu normal; nu e un indiciu, dar poate fi copiat de un atacator.' },
  { k: 'attach', label: 'Atașament: factura_2024.exe', bad: true, why: 'Un fișier executabil trimis ca „factură” este o capcană clasică.' },
];

export function PhishSpotter() {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (k: string) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const bad = FLAGS.filter((f) => f.bad);
  const hits = bad.filter((f) => sel.includes(f.k)).length;
  const falsePos = FLAGS.filter((f) => !f.bad && sel.includes(f.k)).length;
  return (
    <div>
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-3)', padding: 8 }}>
        {FLAGS.map((f) => {
          const on = sel.includes(f.k);
          return (
            <div key={f.k} role="checkbox" aria-checked={on} tabIndex={0} onClick={() => toggle(f.k)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(f.k); } }} style={{ cursor: 'pointer', padding: '7px 10px', margin: '4px 0', borderRadius: 6, border: '1.5px solid ' + (on ? (f.bad ? 'var(--ok)' : 'var(--warn)') : 'var(--border)'), background: on ? 'var(--accent-soft)' : 'var(--surface-2)', fontSize: 13, color: 'var(--text-2)' }}>
              {on ? '⚑ ' : '○ '}{f.label}
              {on && <div style={{ fontSize: 12, marginTop: 3, color: f.bad ? 'var(--ok)' : 'var(--warn)' }}>{f.bad ? 'Indiciu real: ' : 'Nu e un indiciu: '}{f.why}</div>}
            </div>
          );
        })}
      </div>
      <div style={note('var(--info)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>Marchează elementele suspecte. Găsite: <b>{hits}</b> din {bad.length} indicii reale{falsePos > 0 ? `; ${falsePos} marcaj(e) la elemente normale` : ''}.</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Regula de aur: nu da click pe linkuri sau atașamente neașteptate; verifică prin alt canal (telefon, portal intern) și raportează mesajul echipei de securitate.</div>
      </div>
    </div>
  );
}

/* 4) Zone de control fizic */
const ZONES = [
  { k: 'perimeter', label: 'Perimetru', ctl: 'Gard, poartă, iluminat, pază, camere exterioare', c: 'var(--muted)' },
  { k: 'building', label: 'Clădire', ctl: 'Recepție, badge, vizitatori înregistrați și însoțiți, mantrap (access control vestibule)', c: 'var(--info)' },
  { k: 'floor', label: 'Etaj / birou', ctl: 'Acces cu badge, politică clean desk, blocarea ecranului, camere', c: 'var(--accent)' },
  { k: 'room', label: 'Sala de servere / dulap de rețea', ctl: 'Ușă cu control dublu (badge + PIN/biometrie), jurnal de acces, CCTV, senzori de mediu', c: 'var(--warn)' },
  { k: 'rack', label: 'Rack / echipament', ctl: 'Rack încuiat, port console protejat, porturi libere în shutdown, inventar de echipamente', c: 'var(--bad)' },
];

export function PhysicalZones() {
  const [k, setK] = useState('room');
  const z = ZONES.find((x) => x.k === k) ?? ZONES[3];
  return (
    <div>
      <Seg value={k} set={setK} label="Zonă" items={ZONES.map((x) => [x.k, x.label] as [string, string])} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Zone concentrice de control fizic: perimetru, clădire, etaj, sala de servere, rack">
        {ZONES.map((x, i) => {
          const on = x.k === k;
          return (
            <g key={x.k} onClick={() => setK(x.k)} style={{ cursor: 'pointer' }}>
              <rect x={10 + i * 42} y={8 + i * 18} width={700 - i * 84} height={214 - i * 36} rx={12} fill="var(--surface-3)" fillOpacity={0.5} stroke={x.c} strokeWidth={on ? 3.2 : 1.3} />
              <T x={22 + i * 42} y={24 + i * 18} size={10.5} weight={700} anchor="start" color={x.c}>{x.label}</T>
            </g>
          );
        })}
        <T x={360} y={118} size={11} color="var(--muted)">Cu cât mai în interior, cu atât mai multe controale</T>
      </svg>
      <div style={note(z.c)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b style={{ color: z.c }}>{z.label}:</b> {z.ctl}.</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Controalele fizice sunt <b>preventive</b> (uși, lacăte), <b>detective</b> (camere, jurnale) și <b>de descurajare</b> (semne, pază). Fără ele, parolele și firewall-ul pot fi ocolite prin accesul direct la echipament.</div>
      </div>
    </div>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label={solo ? 'Topologie lab solo: PC, switch, router, server' : 'Topologie lab ghidat: PC, switch, router, server'}>
      <ClientIcon x={110} y={105} label="Admin PC" />
      <SwitchIcon x={320} y={105} label="SW1" />
      <RouterIcon x={520} y={105} label="R1" sub="192.168.1.1" />
      <Box x={600} y={160} w={140} h={44} label="Server syslog" sub="192.168.1.10" c="var(--accent)" />
      <Line x1={134} y1={105} x2={298} y2={105} /><Line x1={344} y1={105} x2={496} y2={105} />
      <T x={380} y={215} size={10.5} color="var(--muted)">{solo ? 'Un cablu console rămâne conectat la un port accesibil: ce risc apare?' : 'Accesul fizic (console) vs accesul de rețea (SSH)'}</T>
    </svg>
  );
}
export const LabGuidedTopology52 = () => <Topo solo={false} />;
export const LabSoloTopology52 = () => <Topo solo />;
