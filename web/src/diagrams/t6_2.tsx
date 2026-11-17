import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 6.2 (rețele tradiționale vs rețele bazate pe controller). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const lbl: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12, color: 'var(--text-2)', minWidth: 190 };

/* ---------------------------------------------------------------
   1) Aplicarea unei politici: device cu device vs prin controller
   --------------------------------------------------------------- */
type Mode = 'trad' | 'ctrl';
export function ChangePushDemo() {
  const [mode, setMode] = useState<Mode>('trad');
  const [n, setN] = useState(12);
  const [offline, setOffline] = useState(true);
  const [applied, setApplied] = useState(false);

  const offIdx = offline ? Math.min(n - 1, 4) : -1; // un echipament inaccesibil
  const status = (i: number): 'ok' | 'fail' | 'pending' | 'idle' => {
    if (!applied) return 'idle';
    if (i === offIdx) return mode === 'trad' ? 'fail' : 'pending';
    return 'ok';
  };
  const col = { ok: 'var(--ok)', fail: 'var(--bad)', pending: 'var(--warn)', idle: 'var(--border)' } as const;
  const cols = 12;
  const rows = Math.ceil(n / cols);

  return (
    <div>
      <Seg value={mode} set={(m) => { setMode(m); setApplied(false); }} label="Modelul de management" items={[['trad', 'Tradițional (device cu device)'], ['ctrl', 'Bazat pe controller']]} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 8, alignItems: 'flex-end' }}>
        <label style={lbl}>Echipamente: <b style={{ color: 'var(--text)' }}>{n}</b>
          <input type="range" min={4} max={48} value={n} onChange={(e) => { setN(+e.target.value); setApplied(false); }} aria-label="Număr de echipamente" />
        </label>
        <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={offline} onChange={(e) => { setOffline(e.target.checked); setApplied(false); }} /> Un echipament este inaccesibil (în reload)
        </label>
        <button type="button" className="btn sm primary" onClick={() => setApplied(true)}>Aplică politica (VLAN nou + ACL)</button>
        <button type="button" className="btn sm ghost" onClick={() => setApplied(false)}>Resetează</button>
      </div>
      <svg viewBox={`0 0 560 ${60 + rows * 34}`} width="100%" role="img" aria-label="Starea echipamentelor după aplicarea politicii">
        {Array.from({ length: n }).map((_, i) => {
          const s = status(i);
          return (
            <g key={i}>
              <rect x={14 + (i % cols) * 44} y={50 + Math.floor(i / cols) * 34} width={38} height={26} rx={5} fill="var(--surface-3)" stroke={col[s]} strokeWidth={s === 'idle' ? 1.2 : 2.4} />
              <T x={33 + (i % cols) * 44} y={67 + Math.floor(i / cols) * 34} size={10} m color={s === 'idle' ? 'var(--muted)' : 'var(--text)'}>{i + 1}</T>
            </g>
          );
        })}
        <T x={14} y={20} anchor="start" size={12} weight={700}>{mode === 'trad' ? 'Inginerul → SSH → echipament, de ' + n + ' ori' : 'Inginerul → 1 intenție → controller → toate echipamentele'}</T>
        <T x={14} y={38} anchor="start" size={11} color="var(--muted)">verde = aplicat · roșu = nereușit/neobservat · galben = în așteptare (reîncercat de controller)</T>
      </svg>
      <div style={note(applied ? (mode === 'trad' ? 'var(--warn)' : 'var(--ok)') : 'var(--border)')}>
        {!applied && <p style={{ margin: 0, fontSize: 13 }}>Apasă „Aplică politica” ca să compari ce se întâmplă în fiecare model.</p>}
        {applied && mode === 'trad' && (
          <p style={{ margin: 0, fontSize: 13 }}><b>Tradițional:</b> {n} sesiuni SSH, {n} serii de comenzi, {n} verificări manuale. {offline ? <>Echipamentul {offIdx + 1} era inaccesibil: rămâne <b style={{ color: 'var(--bad)' }}>neconfigurat</b>, iar dacă nimeni nu observă, apare un <b>drift</b> (rețeaua nu mai e uniformă).</> : 'Dacă ai omis unul sau ai greșit o linie, nu știi până nu verifici fiecare echipament.'}</p>
        )}
        {applied && mode === 'ctrl' && (
          <p style={{ margin: 0, fontSize: 13 }}><b>Controller:</b> 1 intenție, 1 cerere către controller. Controller-ul o traduce și o trimite fiecărui echipament (southbound), apoi arată conformitatea. {offline ? <>Echipamentul {offIdx + 1} este marcat <b style={{ color: 'var(--warn)' }}>în așteptare</b> și reîncercat când revine; vezi imediat care echipamente nu respectă politica.</> : 'Raportul arată că toate echipamentele respectă politica.'}</p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   2) Arhitectura: control distribuit vs controller central
   --------------------------------------------------------------- */
export function ArchitectureCompare() {
  const [down, setDown] = useState(false);
  const dev = (x: number, y: number, k: string, showCp: boolean) => (
    <g key={k}>
      <rect x={x} y={y} width={78} height={64} rx={8} fill="var(--surface-3)" stroke="var(--border)" strokeWidth={1.4} />
      <T x={x + 39} y={y + 14} size={10} weight={700}>{k}</T>
      <rect x={x + 6} y={y + 20} width={66} height={16} rx={3} fill="var(--accent-soft)" stroke="var(--violet)" strokeWidth={1} opacity={showCp ? 1 : 0.4} />
      <T x={x + 39} y={y + 32} size={9} color="var(--text)">control</T>
      <rect x={x + 6} y={y + 40} width={66} height={16} rx={3} fill="var(--accent-soft)" stroke="var(--ok)" strokeWidth={1} />
      <T x={x + 39} y={y + 52} size={9} color="var(--text)">data</T>
    </g>
  );
  return (
    <div>
      <svg viewBox="0 0 580 300" width="100%" role="img" aria-label="Rețea tradițională și rețea bazată pe controller">
        {/* Stânga: tradițional */}
        <T x={140} y={18} weight={700} size={13}>Tradițional</T>
        <T x={140} y={34} size={10} color="var(--muted)">control plane distribuit, config pe fiecare</T>
        {['SW1', 'SW2', 'R1'].map((k, i) => dev(14 + i * 90, 160, k, true))}
        {[0, 1, 2].map((i) => <Line key={i} x1={53 + i * 90} y1={160} x2={140} y2={92} c="var(--text-2)" w={1.4} dash="5 3" />)}
        <ClientIcon x={140} y={78} label="Admin" kind="pc" />
        <T x={140} y={250} size={10} color="var(--muted)">CLI/SNMP către fiecare echipament</T>
        <Line x1={282} y1={20} x2={282} y2={280} c="var(--border)" w={1} dash="3 3" />
        {/* Dreapta: controller */}
        <T x={430} y={18} weight={700} size={13}>Bazat pe controller</T>
        <T x={430} y={34} size={10} color="var(--muted)">un punct central de management și politică</T>
        <Box x={365} y={50} w={130} h={34} label="Controller" sub="ex. Catalyst Center" c={down ? 'var(--bad)' : 'var(--accent)'} fill={down ? 'var(--surface-2)' : 'var(--accent-soft)'} />
        <Box x={510} y={46} w={64} h={26} label="Apps" sub="REST" c="var(--info)" />
        <Line x1={495} y1={62} x2={510} y2={62} c="var(--info)" w={2} />
        {['SW1', 'SW2', 'R1'].map((k, i) => dev(300 + i * 90, 160, k, false))}
        {[0, 1, 2].map((i) => <Line key={i} x1={339 + i * 90} y1={160} x2={430} y2={84} c={down ? 'var(--border)' : 'var(--accent)'} w={1.6} dash={down ? '4 4' : undefined} flow={!down} />)}
        <T x={528} y={110} size={9} color="var(--info)">northbound</T>
        <T x={350} y={134} size={9} color="var(--accent)">southbound</T>
        {down && <T x={430} y={106} size={10} color="var(--bad)" weight={700}>controller indisponibil</T>}
        <T x={430} y={250} size={10} color="var(--muted)">{down ? 'forwarding continuă; fără provisioning/assurance central' : 'API-uri northbound/southbound'}</T>
      </svg>
      <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center', margin: '6px 0' }}>
        <input type="checkbox" checked={down} onChange={(e) => setDown(e.target.checked)} /> Simulează: controller-ul nu este disponibil
      </label>
      <div style={note(down ? 'var(--warn)' : 'var(--border)')}>
        <p style={{ margin: 0, fontSize: 13 }}>{down
          ? <>La un controller de management/orchestrare (de tipul Catalyst Center), echipamentele își păstrează configurația și <b>continuă să trimită traficul</b>. Pierzi temporar: modificările centralizate, vizibilitatea și automatizările. De aceea controller-ele se instalează redundant, iar rețeaua nu depinde de ele pentru forwarding. (Arhitecturile cu control plane complet centralizat, 6.3, au considerații diferite.)</>
          : <>În modelul tradițional fiecare echipament rulează propriul control plane și își ține propria configurație. În modelul cu controller ai un punct central de unde proiectezi, aplici politici și monitorizezi; echipamentele își păstrează data plane-ul.</>}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   3) Fluxul de lucru într-un controller (Design → Policy → Provision → Assurance)
   --------------------------------------------------------------- */
const FLOW: { t: string; d: string; ex: string }[] = [
  { t: 'Design', d: 'Descrii rețeaua: ierarhia site-urilor (campus, clădire, etaj), resursele comune (servere NTP/DNS/syslog, profile de rețea), parametrii implicit.', ex: 'Exemplu: „toate clădirile folosesc NTP 10.0.0.5 și syslog 10.0.0.6”.' },
  { t: 'Policy', d: 'Definești politici la nivel de intenție: cine are voie cu cine, ce trafic are prioritate, ce segmente există — independent de IP-uri și porturi.', ex: 'Exemplu: „Angajații pot accesa serverele ERP; vizitatorii doar Internetul”.' },
  { t: 'Provision', d: 'Controller-ul traduce designul și politica în configurații pentru fiecare echipament și le aplică (inclusiv echipamente noi, cu Plug and Play/ZTP).', ex: 'Exemplu: un switch nou primește automat configurația și imaginea software potrivite.' },
  { t: 'Assurance', d: 'Controller-ul colectează telemetrie și evaluează sănătatea: clienți, aplicații, echipamente; detectează abateri și sugerează remedieri (analiză ML, 6.4).', ex: 'Exemplu: „doi clienți Wi-Fi au probleme de autentificare la AP-ul din etajul 3”.' },
];
export function ControllerWorkflow() {
  const [i, setI] = useState(0);
  return (
    <div>
      <svg viewBox="0 0 560 100" width="100%" role="img" aria-label="Etapele de lucru într-un controller">
        {FLOW.map((s, k) => (
          <g key={k} onClick={() => setI(k)} style={{ cursor: 'pointer' }}>
            <rect x={14 + k * 138} y={22} width={124} height={50} rx={8} fill="var(--surface-3)" stroke={k === i ? 'var(--accent)' : 'var(--border)'} strokeWidth={k === i ? 3 : 1.4} />
            <T x={76 + k * 138} y={44} size={10} color="var(--muted)" weight={700}>{k + 1}</T>
            <T x={76 + k * 138} y={62} size={13} weight={700}>{s.t}</T>
            {k < 3 && <Line x1={138 + k * 138} y1={47} x2={152 + k * 138} y2={47} c="var(--muted)" w={1.6} />}
          </g>
        ))}
        <path d="M 490 72 Q 490 94 76 94 Q 76 94 76 72" fill="none" stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="5 4" />
        <T x={280} y={90} size={10} color="var(--accent)">Assurance alimentează din nou Design/Policy (bucla de îmbunătățire)</T>
      </svg>
      <div style={note('var(--accent)')}>
        <p style={{ margin: 0 }}><b>{i + 1}. {FLOW[i].t}</b></p>
        <p style={{ margin: '6px 0 0', fontSize: 13 }}>{FLOW[i].d}</p>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted)' }}>{FLOW[i].ex}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Topologii de laborator
   --------------------------------------------------------------- */
export function LabGuidedTopology62() {
  return (
    <svg viewBox="0 0 560 220" width="100%" role="img" aria-label="Topologie lab 6.2 ghidat: stație admin, router și trei switch-uri">
      <ClientIcon x={60} y={110} label="Admin PC" kind="pc" />
      <RouterIcon x={200} y={110} label="R1" sub="gateway" />
      <Line x1={90} y1={110} x2={170} y2={110} c="var(--accent)" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <SwitchIcon x={400} y={40 + k * 70} label={`SW${k + 1}`} />
          <Line x1={230} y1={110} x2={370} y2={40 + k * 70} c="var(--text-2)" />
        </g>
      ))}
      <T x={300} y={212} size={11} color="var(--muted)">aceeași politică (VLAN + NTP + syslog) pe cele trei switch-uri</T>
    </svg>
  );
}
export function LabSoloTopology62() {
  return (
    <svg viewBox="0 0 560 210" width="100%" role="img" aria-label="Topologie lab 6.2 solo: stație admin, controller conceptual și echipamente">
      <ClientIcon x={60} y={105} label="Admin" kind="pc" />
      <Box x={130} y={82} w={110} h={46} label="„Controller”" sub="script + inventar" c="var(--accent)" fill="var(--accent-soft)" />
      <Line x1={90} y1={105} x2={130} y2={105} c="var(--accent)" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <SwitchIcon x={400} y={36 + k * 66} label={`SW${k + 1}`} />
          <Line x1={240} y1={105} x2={370} y2={36 + k * 66} c="var(--accent)" w={1.6} dash="5 3" />
        </g>
      ))}
      <T x={300} y={200} size={11} color="var(--muted)">southbound simulat: SSH din script către fiecare switch</T>
    </svg>
  );
}
