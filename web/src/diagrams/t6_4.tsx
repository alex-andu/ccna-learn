import { useMemo, useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Line, T } from './l2kit';

/* Diagrame originale pentru 6.4 (AI generativ/predictiv și ML în operațiunile de rețea). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const lbl: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12, color: 'var(--text-2)', minWidth: 220 };

/* ---------------------------------------------------------------
   1) Fluxul unui model ML: date → antrenare → model → inferență → acțiune
   --------------------------------------------------------------- */
const STEPS: { t: string; d: string; ex: string }[] = [
  { t: 'Date', d: 'Se adună exemple din rețea: contoare de interfețe, log-uri, scoruri ale clienților Wi-Fi, incidente trecute. Calitatea și varietatea datelor limitează tot ce urmează.', ex: 'Ex.: utilizarea fiecărei legături, din 5 în 5 minute, timp de luni de zile.' },
  { t: 'Pregătire', d: 'Datele se curăță (valori lipsă, duplicate), se normalizează și, dacă e cazul, se etichetează („normal”, „incident”).', ex: 'Ex.: elimini intervalele în care colectorul a căzut; marchezi incidentele cunoscute.' },
  { t: 'Antrenare', d: 'Un algoritm caută tipare în datele de antrenare și își ajustează parametrii interni până când descrie bine datele.', ex: 'Ex.: algoritmul „învață” cum arată traficul normal la ora 10:00 într-o zi lucrătoare.' },
  { t: 'Model', d: 'Rezultatul antrenării este un model: o funcție matematică ce primește date noi și întoarce o predicție sau o clasificare. Se evaluează pe date nevăzute.', ex: 'Ex.: modelul ajunge la o precizie acceptabilă pe o lună de date nefolosite la antrenare.' },
  { t: 'Inferență', d: 'Modelul este folosit pe date noi, în producție. Nu mai învață în acest pas; aplică ce a învățat.', ex: 'Ex.: pentru fiecare măsurătoare nouă, modelul spune „normal” sau „anormal”.' },
  { t: 'Acțiune și feedback', d: 'Rezultatul declanșează o alertă, o recomandare sau o remediere (de obicei cu aprobare umană). Feedback-ul inginerilor îmbunătățește modelul la reantrenări.', ex: 'Ex.: „AP-ul de la etajul 3 are o comportare neobișnuită” → un inginer confirmă; confirmarea se păstrează.' },
];
export function MlPipeline() {
  const [i, setI] = useState(0);
  return (
    <div>
      <svg viewBox="0 0 560 90" width="100%" role="img" aria-label="Etapele unui model de machine learning">
        {STEPS.map((s, k) => (
          <g key={k} onClick={() => setI(k)} style={{ cursor: 'pointer' }}>
            <rect x={6 + k * 92} y={16} width={84} height={52} rx={8} fill="var(--surface-3)" stroke={k === i ? 'var(--accent)' : 'var(--border)'} strokeWidth={k === i ? 3 : 1.4} />
            <T x={48 + k * 92} y={38} size={10} color="var(--muted)" weight={700}>{k + 1}</T>
            <T x={48 + k * 92} y={56} size={11} weight={700}>{s.t.length > 11 ? s.t.split(' ')[0] : s.t}</T>
            {k < 5 && <Line x1={90 + k * 92} y1={42} x2={98 + k * 92} y2={42} c="var(--muted)" w={1.6} />}
          </g>
        ))}
        <T x={280} y={84} size={10} color="var(--accent)">cu feedback, ciclul se repetă (reantrenare)</T>
      </svg>
      <div style={note('var(--accent)')}>
        <p style={{ margin: 0 }}><b>{i + 1}. {STEPS[i].t}</b></p>
        <p style={{ margin: '6px 0 0', fontSize: 13 }}>{STEPS[i].d}</p>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted)' }}>{STEPS[i].ex}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="btn sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>← Înapoi</button>
          <button type="button" className="btn sm" onClick={() => setI(Math.min(5, i + 1))} disabled={i === 5}>Înainte →</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   2) Detectarea anomaliilor față de un baseline (predictiv)
   --------------------------------------------------------------- */
const N = 96; // 4 zile × 24 h
// pseudo-aleator determinist
function series() {
  let s = 12345;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff - 0.5; };
  const mean = (t: number) => 40 + 22 * Math.sin(((t % 24) - 6) / 24 * 2 * Math.PI);
  const sigma = 3;
  const truth = new Set([30, 58, 83]);
  const val: number[] = [];
  for (let t = 0; t < N; t++) {
    let v = mean(t) + rnd() * 2 * sigma * 2.2;
    if (t === 30) v += 30;      // vârf puternic (anomalie reală)
    if (t === 58) v -= 28;      // cădere de trafic (anomalie reală)
    if (t === 83) v += 12;      // abatere mică (anomalie reală, subtilă)
    val.push(Math.max(2, Math.min(98, v)));
  }
  return { mean, sigma, truth, val };
}
export function AnomalyDetector() {
  const { mean, sigma, truth, val } = useMemo(series, []);
  const [k, setK] = useState(3);
  const flagged = val.map((v, t) => Math.abs(v - mean(t)) > k * sigma);
  let caught = 0, falseAl = 0;
  flagged.forEach((f, t) => { if (f && truth.has(t)) caught++; if (f && !truth.has(t)) falseAl++; });
  const missed = truth.size - caught;
  const W = 560, H = 190, px = (t: number) => 30 + (t / (N - 1)) * (W - 50), py = (v: number) => H - 20 - (v / 100) * (H - 40);
  const upper = Array.from({ length: N }, (_, t) => `${px(t)},${py(Math.min(100, mean(t) + k * sigma))}`);
  const lower = Array.from({ length: N }, (_, t) => `${px(t)},${py(Math.max(0, mean(t) - k * sigma))}`).reverse();
  return (
    <div>
      <label style={lbl}>Sensibilitate: bandă = baseline ± <b style={{ color: 'var(--text)' }}>{k.toFixed(1)}</b>σ
        <input type="range" min={1} max={5} step={0.5} value={k} onChange={(e) => setK(+e.target.value)} aria-label="Lățimea benzii de normalitate în abateri standard" />
      </label>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Utilizarea unei legături în 4 zile, cu banda de normalitate și anomaliile marcate">
        <polygon points={[...upper, ...lower].join(' ')} fill="var(--accent-soft)" opacity={0.7} />
        <polyline points={val.map((v, t) => `${px(t)},${py(v)}`).join(' ')} fill="none" stroke="var(--text-2)" strokeWidth={1.4} />
        {val.map((v, t) => (flagged[t] || truth.has(t)) && (
          <g key={t}>
            <circle cx={px(t)} cy={py(v)} r={flagged[t] ? 5 : 4} fill={flagged[t] ? (truth.has(t) ? 'var(--ok)' : 'var(--warn)') : 'none'} stroke={truth.has(t) ? 'var(--bad)' : 'var(--warn)'} strokeWidth={2} />
          </g>
        ))}
        <T x={30} y={14} size={10} color="var(--muted)" anchor="start">utilizare legătură (%) · bandă = baseline ±kσ · verde = anomalie reală prinsă · galben = alarmă falsă · cerc roșu gol = anomalie ratată</T>
        {[0, 24, 48, 72].map((t) => <T key={t} x={px(t)} y={H - 4} size={9} color="var(--muted)">{'ziua ' + (t / 24 + 1)}</T>)}
      </svg>
      <div style={note(falseAl > 3 || missed > 0 ? 'var(--warn)' : 'var(--ok)')}>
        <p style={{ margin: 0, fontSize: 13 }}>
          Anomalii reale prinse: <b>{caught}</b> din {truth.size} · ratate: <b>{missed}</b> · alarme false: <b>{falseAl}</b>.
          {falseAl > 4 ? ' Bandă prea îngustă: multe alarme false (alert fatigue).' : missed > 0 ? ' Bandă prea largă: anomaliile subtile trec neobservate.' : ' Un compromis bun: anomaliile sunt prinse, fără alarme false multe.'}
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>Datele sunt sintetice, generate pentru demonstrație. Un sistem real învață baseline-ul automat din date istorice și îl adaptează sezonier.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   3) Predictiv sau generativ? (clasificare de scenarii)
   --------------------------------------------------------------- */
type Kind = 'pred' | 'gen';
const CARDS: { s: string; a: Kind; why: string }[] = [
  { s: 'Prezice care AP-uri vor depăși 80% utilizare luna viitoare, pe baza istoricului.', a: 'pred', why: 'Predicție/prognoză pe date istorice: AI predictiv (ML).' },
  { s: 'Scrie un draft de configurație OSPF pornind de la o descriere în limbaj natural.', a: 'gen', why: 'Produce conținut nou (text/cod) la cerere: AI generativ.' },
  { s: 'Detectează un client Wi-Fi care se comportă anormal față de baseline.', a: 'pred', why: 'Detectarea anomaliilor este o sarcină clasică de ML predictiv/analitic.' },
  { s: 'Rezumă 5000 de linii de syslog într-un paragraf cu cauzele probabile.', a: 'gen', why: 'Generează un text nou (rezumat) cu un model de limbaj.' },
  { s: 'Estimează probabilitatea ca un switch să se defecteze în 30 de zile, după erorile de interfață.', a: 'pred', why: 'Estimare de probabilitate din date istorice: predictiv.' },
  { s: 'Scrie un script Python care citește inventarul unui controller prin REST.', a: 'gen', why: 'Generează cod nou dintr-o descriere: AI generativ.' },
  { s: 'Răspunde în chat la „de ce nu se conectează clientul?” cu pași de depanare.', a: 'gen', why: 'Conversație care produce text nou: asistent generativ.' },
  { s: 'Clasifică traficul în categorii de aplicații (video, web, backup).', a: 'pred', why: 'Clasificare: atribuie etichete pe baza tiparelor învățate (ML predictiv).' },
];
export function PredVsGen() {
  const [ans, setAns] = useState<Record<number, Kind>>({});
  const score = Object.entries(ans).filter(([i, a]) => CARDS[+i].a === a).length;
  const done = Object.keys(ans).length;
  return (
    <div>
      <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-2)' }}>Pentru fiecare scenariu alege tipul de AI. Scor: <b>{score}</b>/{done} răspunsuri corecte (din {CARDS.length}).</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {CARDS.map((c, i) => {
          const a = ans[i];
          const ok = a !== undefined && a === c.a;
          return (
            <div key={i} style={{ border: '1px solid ' + (a === undefined ? 'var(--border)' : ok ? 'var(--ok)' : 'var(--bad)'), borderRadius: 8, padding: '8px 12px', background: 'var(--surface-2)' }}>
              <div style={{ fontSize: 13 }}>{c.s}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <button type="button" className={'btn sm' + (a === 'pred' ? ' primary' : '')} onClick={() => setAns({ ...ans, [i]: 'pred' })}>Predictiv / analitic</button>
                <button type="button" className={'btn sm' + (a === 'gen' ? ' primary' : '')} onClick={() => setAns({ ...ans, [i]: 'gen' })}>Generativ</button>
              </div>
              {a !== undefined && <div style={{ fontSize: 12, marginTop: 6, color: ok ? 'var(--ok)' : 'var(--bad)' }}>{ok ? '✓ ' : '✗ Corect: ' + (c.a === 'pred' ? 'predictiv. ' : 'generativ. ')}{c.why}</div>}
            </div>
          );
        })}
      </div>
      <button type="button" className="btn sm ghost" style={{ marginTop: 8 }} onClick={() => setAns({})}>Resetează</button>
    </div>
  );
}

/* ---------------------------------------------------------------
   Topologii de laborator
   --------------------------------------------------------------- */
export function LabGuidedTopology64() {
  return (
    <svg viewBox="0 0 560 200" width="100%" role="img" aria-label="Topologie lab 6.4 ghidat: router, switch și două PC-uri; configurația de verificat provine dintr-un asistent AI">
      <RouterIcon x={110} y={90} label="R1" sub="gateway" />
      <SwitchIcon x={260} y={90} label="SW1" />
      <ClientIcon x={400} y={50} label="PC1 (VLAN 10)" kind="pc" />
      <ClientIcon x={400} y={140} label="PC2 (VLAN 20)" kind="pc" />
      <Line x1={140} y1={90} x2={230} y2={90} c="var(--text-2)" />
      <Line x1={290} y1={90} x2={380} y2={52} c="var(--accent)" />
      <Line x1={290} y1={90} x2={380} y2={140} c="var(--ok)" />
      <T x={280} y={188} size={11} color="var(--muted)">configurația „generată de AI” se verifică și se testează aici înainte de orice folosire reală</T>
    </svg>
  );
}
export function LabSoloTopology64() {
  return (
    <svg viewBox="0 0 560 200" width="100%" role="img" aria-label="Topologie lab 6.4 solo: router cu două rețele și un server">
      <ClientIcon x={60} y={100} label="LAN 192.168.10.0/24" kind="pc" />
      <RouterIcon x={230} y={100} label="R1" sub="ACL de verificat" />
      <SwitchIcon x={390} y={100} label="SW-DMZ" />
      <ClientIcon x={510} y={60} label="Server web" kind="pc" />
      <ClientIcon x={510} y={145} label="Server DB" kind="pc" />
      <Line x1={90} y1={100} x2={200} y2={100} c="var(--accent)" />
      <Line x1={260} y1={100} x2={360} y2={100} c="var(--text-2)" />
      <Line x1={420} y1={100} x2={490} y2={62} c="var(--ok)" />
      <Line x1={420} y1={100} x2={490} y2={145} c="var(--bad)" />
      <T x={280} y={190} size={11} color="var(--muted)">cerință: LAN → web permis; LAN → DB interzis</T>
    </svg>
  );
}
