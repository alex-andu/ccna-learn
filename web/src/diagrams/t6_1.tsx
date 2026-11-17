import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 6.1 (impactul automatizării asupra managementului rețelei). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const mono: CSSProperties = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const lbl: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12, color: 'var(--text-2)', minWidth: 190 };

/* ---------------------------------------------------------------
   1) Calculator manual vs automatizat (ipoteze ilustrative)
   --------------------------------------------------------------- */
export function AutomationCalc() {
  const [n, setN] = useState(40);
  const [mMin, setMMin] = useState(6);
  const [err, setErr] = useState(3);
  const [setup, setSetup] = useState(120);
  const [runSec, setRunSec] = useState(20);

  const manualH = (n * mMin) / 60;
  const manualErr = (n * err) / 100;
  const autoMin = setup + (n * runSec) / 60;
  const autoH = autoMin / 60;
  // Punctul de echilibru: setup + n*run/60 = n*m  ->  n = setup / (m - run/60)
  const perDevAuto = runSec / 60;
  const breakEven = mMin > perDevAuto ? Math.ceil(setup / (mMin - perDevAuto)) : Infinity;
  const maxH = Math.max(manualH, autoH, 0.1);
  const W = 560;
  const bar = (h: number) => Math.max(4, (h / maxH) * (W - 190));

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 10 }}>
        <label style={lbl}>Nr. echipamente: <b style={{ color: 'var(--text)' }}>{n}</b>
          <input type="range" min={2} max={500} value={n} onChange={(e) => setN(+e.target.value)} aria-label="Număr de echipamente" />
        </label>
        <label style={lbl}>Minute/echipament, manual: <b style={{ color: 'var(--text)' }}>{mMin}</b>
          <input type="range" min={1} max={30} value={mMin} onChange={(e) => setMMin(+e.target.value)} aria-label="Minute pe echipament manual" />
        </label>
        <label style={lbl}>Rată de greșeli manuale: <b style={{ color: 'var(--text)' }}>{err}%</b>
          <input type="range" min={0} max={10} value={err} onChange={(e) => setErr(+e.target.value)} aria-label="Rata de greșeli manuale" />
        </label>
        <label style={lbl}>Efort inițial automatizare: <b style={{ color: 'var(--text)' }}>{setup} min</b>
          <input type="range" min={10} max={480} step={10} value={setup} onChange={(e) => setSetup(+e.target.value)} aria-label="Efort inițial pentru automatizare" />
        </label>
        <label style={lbl}>Secunde/echipament, automat: <b style={{ color: 'var(--text)' }}>{runSec}</b>
          <input type="range" min={2} max={120} value={runSec} onChange={(e) => setRunSec(+e.target.value)} aria-label="Secunde pe echipament automat" />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} 150`} width="100%" role="img" aria-label="Comparație timp manual și automat">
        <T x={10} y={30} anchor="start" size={12} weight={700}>Manual</T>
        <rect x={150} y={14} width={bar(manualH)} height={26} rx={5} fill="var(--warn)" opacity={0.85} />
        <T x={156 + bar(manualH)} y={32} anchor="start" size={12} m>{manualH.toFixed(1)} h</T>
        <T x={10} y={84} anchor="start" size={12} weight={700}>Automatizat</T>
        <rect x={150} y={68} width={bar(autoH)} height={26} rx={5} fill="var(--ok)" opacity={0.85} />
        <T x={156 + bar(autoH)} y={86} anchor="start" size={12} m>{autoH.toFixed(1)} h</T>
        <T x={10} y={132} anchor="start" size={11} color="var(--muted)">Timpul include scrierea șablonului/scriptului o singură dată.</T>
      </svg>
      <div style={note('var(--border)')}>
        <p style={{ margin: 0, fontSize: 13 }}>
          Greșeli manuale așteptate: <b style={{ ...mono }}>{manualErr.toFixed(1)}</b> echipamente configurate diferit. Automatizarea are aceeași greșeală <b>pe toate</b> echipamentele dacă șablonul e greșit — de aceea contează validarea. {Number.isFinite(breakEven)
            ? <>Automatizarea se amortizează de la ≈ <b style={{ ...mono }}>{breakEven}</b> echipamente pentru o singură modificare (și mult mai repede dacă modificarea se repetă).</>
            : <>La parametrii aleși, automatizarea nu e mai rapidă pe echipament decât lucrul manual.</>}
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>Valorile sunt ipoteze ilustrative alese de tine, nu măsurători.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   2) Cele trei planuri și unde acționează automatizarea
   --------------------------------------------------------------- */
type Plane = 'mgmt' | 'ctrl' | 'data';
const PLANES: Record<Plane, { name: string; what: string; ex: string; auto: string; c: string; y: number }> = {
  mgmt: { name: 'Management plane', y: 20, c: 'var(--accent)', what: 'Cum configurezi și monitorizezi echipamentul.', ex: 'SSH, console, SNMP, syslog, NTP, NETCONF, RESTCONF, API REST', auto: 'Aici „intră” automatizarea: un script sau un controller deschide sesiuni (SSH/NETCONF/REST) și trimite configurația sau citește starea.' },
  ctrl: { name: 'Control plane', y: 100, c: 'var(--violet)', what: 'Construiește tabelele după care se decide forwarding-ul.', ex: 'OSPF, EIGRP, BGP, STP, ARP, CDP/LLDP', auto: 'Automatizarea nu înlocuiește protocoalele: ea le configurează și le verifică (vecini, rute, stări).' },
  data: { name: 'Data plane', y: 180, c: 'var(--ok)', what: 'Mută efectiv cadrele și pachetele, la viteza liniei.', ex: 'Forwarding, ACL, NAT, QoS, încapsulare', auto: 'Se modifică indirect: schimbi o ACL sau o politică QoS prin management plane, iar data plane o aplică.' },
};
export function PlanesMap() {
  const [sel, setSel] = useState<Plane>('mgmt');
  const p = PLANES[sel];
  return (
    <div>
      <svg viewBox="0 0 560 260" width="100%" role="img" aria-label="Cele trei planuri ale unui echipament de rețea">
        {(Object.keys(PLANES) as Plane[]).map((k) => {
          const q = PLANES[k];
          const on = sel === k;
          return (
            <g key={k} onClick={() => setSel(k)} style={{ cursor: 'pointer' }}>
              <rect x={20} y={q.y} width={340} height={64} rx={10} fill="var(--surface-3)" stroke={q.c} strokeWidth={on ? 3 : 1.4} />
              <T x={190} y={q.y + 28} weight={700} size={14} color={q.c}>{q.name}</T>
              <T x={190} y={q.y + 48} size={11} color="var(--muted)">{k === 'mgmt' ? 'configurare · monitorizare' : k === 'ctrl' ? 'decide unde merge traficul' : 'execută forwarding-ul'}</T>
            </g>
          );
        })}
        <Line x1={190} y1={84} x2={190} y2={100} c="var(--muted)" w={1.5} dash="4 3" />
        <Line x1={190} y1={164} x2={190} y2={180} c="var(--muted)" w={1.5} dash="4 3" />
        <g>
          <rect x={400} y={20} width={140} height={64} rx={10} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.6} />
          <T x={470} y={46} weight={700}>Script / controller</T>
          <T x={470} y={64} size={11} color="var(--muted)">automatizare</T>
        </g>
        <Line x1={360} y1={52} x2={400} y2={52} c="var(--accent)" w={2.4} flow />
        <T x={470} y={116} size={11} color="var(--muted)">intră prin</T>
        <T x={470} y={132} size={11} color="var(--accent)" weight={700}>management plane</T>
      </svg>
      <Seg value={sel} set={setSel} label="Alege planul" items={[['mgmt', 'Management'], ['ctrl', 'Control'], ['data', 'Data']]} />
      <div style={note(p.c)}>
        <p style={{ margin: 0 }}><b style={{ color: p.c }}>{p.name}</b> — {p.what}</p>
        <p style={{ margin: '6px 0 0', fontSize: 13 }}><b>Exemple:</b> {p.ex}</p>
        <p style={{ margin: '6px 0 0', fontSize: 13 }}><b>Automatizarea:</b> {p.auto}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   3) Bucla de automatizare (intent → render → validare → deploy → verificare → remediere)
   --------------------------------------------------------------- */
const STAGES: { t: string; d: string }[] = [
  { t: 'Intent / sursa de adevăr', d: 'Descrii starea dorită într-un loc unic: inventar (ce echipamente), variabile (VLAN-uri, servere NTP/syslog) și politici. Ex.: un fișier YAML sau CSV păstrat în Git.' },
  { t: 'Randare din șablon', d: 'Un șablon (template) combinat cu variabilele produce configurația fiecărui echipament. Ce e comun stă în șablon; ce e specific (hostname, IP) vine din variabile.' },
  { t: 'Validare înainte', d: 'Verifici sintaxa, valorile (IP-uri valide, VLAN-uri 1–4094) și, dacă se poate, compari cu starea curentă („diff”): vezi exact ce se va schimba, înainte să se schimbe.' },
  { t: 'Aplicare (deploy)', d: 'Trimiți configurația prin SSH, NETCONF sau API, de obicei pe un grup mic întâi (canary), apoi pe restul. Un instrument idempotent aplică doar ce lipsește.' },
  { t: 'Verificare după', d: 'Rulezi verificări automate: show/API/telemetrie — vecini OSPF sus? VLAN-ul există? Serverul NTP e sincronizat? Rezultatul e comparat cu intenția.' },
  { t: 'Remediere / rollback', d: 'Dacă verificarea eșuează, oprești extinderea și revii la configurația anterioară (rollback) sau corectezi automat deriva. Dacă totul e în regulă, rețeaua e în starea dorită.' },
];
export function AutomationLoop() {
  const [i, setI] = useState(0);
  const [inject, setInject] = useState(false);
  const failed = inject && i >= 4;
  const W = 560;
  const bx = (k: number) => 14 + k * 90;
  return (
    <div>
      <svg viewBox={`0 0 ${W} 120`} width="100%" role="img" aria-label="Etapele buclei de automatizare">
        {STAGES.map((_s, k) => {
          const on = k === i;
          const done = k < i;
          const bad = failed && k === 4;
          return (
            <g key={k} onClick={() => setI(k)} style={{ cursor: 'pointer' }}>
              <rect x={bx(k)} y={20} width={80} height={56} rx={8} fill="var(--surface-3)" stroke={bad ? 'var(--bad)' : on ? 'var(--accent)' : done ? 'var(--ok)' : 'var(--border)'} strokeWidth={on ? 3 : 1.4} />
              <T x={bx(k) + 40} y={40} size={10} color="var(--muted)" weight={700}>{k + 1}</T>
              <T x={bx(k) + 40} y={58} size={10} weight={650}>{['Intent', 'Randare', 'Validare', 'Deploy', 'Verificare', 'Remediere'][k]}</T>
              {k < 5 && <Line x1={bx(k) + 80} y1={48} x2={bx(k + 1)} y2={48} c={done ? 'var(--ok)' : 'var(--muted)'} w={1.6} />}
            </g>
          );
        })}
        <path d={`M ${bx(5) + 40} 76 Q ${bx(5) + 40} 108 ${bx(0) + 40} 108 Q ${bx(0) + 40} 108 ${bx(0) + 40} 76`} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeDasharray="5 4" />
        <T x={W / 2} y={104} size={10} color="var(--accent)" weight={650}>bucla se repetă: intenția nouă sau deriva detectată reiau ciclul</T>
      </svg>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>← Înapoi</button>
        <button type="button" className="btn sm" onClick={() => setI(Math.min(5, i + 1))} disabled={i === 5}>Înainte →</button>
        <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={inject} onChange={(e) => setInject(e.target.checked)} /> Simulează o eroare în șablon (se vede la Verificare)
        </label>
      </div>
      <div style={note(failed ? 'var(--bad)' : 'var(--accent)')}>
        <p style={{ margin: 0 }}><b>{i + 1}. {STAGES[i].t}</b></p>
        <p style={{ margin: '6px 0 0', fontSize: 13 }}>{STAGES[i].d}</p>
        {failed && <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--bad)' }}>Verificarea a găsit o abatere: aceeași greșeală din șablon a ajuns pe toate echipamentele din lot. Fiindcă ai început cu un lot mic și ai verificat, oprești extinderea și faci rollback în loc să afli de la utilizatori.</p>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Topologii de laborator
   --------------------------------------------------------------- */
export function LabGuidedTopology61() {
  return (
    <svg viewBox="0 0 560 230" width="100%" role="img" aria-label="Topologie lab 6.1 ghidat: stație de management și patru switch-uri">
      <ClientIcon x={80} y={115} label="Admin PC" kind="pc" />
      <T x={80} y={160} size={10} color="var(--muted)" m>192.168.99.10</T>
      <SwitchIcon x={230} y={115} label="SW0 (acces)" />
      <Line x1={110} y1={115} x2={200} y2={115} c="var(--accent)" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <SwitchIcon x={430} y={30 + k * 56} label={`SW${k + 1}`} />
          <Line x1={260} y1={115} x2={400} y2={30 + k * 56} c="var(--text-2)" />
          <T x={490} y={35 + k * 56} anchor="start" size={10} color="var(--muted)" m>{`192.168.99.${k + 1}`}</T>
        </g>
      ))}
      <T x={280} y={218} size={11} color="var(--muted)">VLAN 99 de management · aceeași configurație trebuie să ajungă pe toate</T>
    </svg>
  );
}
export function LabSoloTopology61() {
  return (
    <svg viewBox="0 0 560 220" width="100%" role="img" aria-label="Topologie lab 6.1 solo: stație de management, router și patru echipamente">
      <ClientIcon x={70} y={110} label="Admin PC" kind="pc" />
      <RouterIcon x={230} y={110} label="R0" sub="gateway mgmt" />
      <Line x1={100} y1={110} x2={200} y2={110} c="var(--accent)" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <SwitchIcon x={420} y={40 + k * 70} label={`SW${k + 1}`} />
          <Line x1={260} y1={110} x2={390} y2={40 + k * 70} c="var(--text-2)" />
        </g>
      ))}
      <Box x={280} y={4} w={140} h={26} label="Inventar + șablon" c="var(--warn)" />
      <T x={280} y={210} size={11} color="var(--muted)">Una dintre cele trei configurații a „derivat” față de standard</T>
    </svg>
  );
}
