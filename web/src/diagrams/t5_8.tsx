import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.8 (AAA, RADIUS/TACACS+, 802.1X). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

/* 1) Fluxul AAA la un login de administrare */
type Proto = 'tacacs' | 'radius';
function steps(p: Proto) {
  return p === 'tacacs'
    ? [
        { k: 'A', who: 'Admin → NAS', t: 'Administratorul deschide o sesiune SSH către router (NAS = Network Access Server) și introduce utilizator + parolă.', d: 'user: ana · parola', from: 0, to: 1, c: 'var(--accent)' },
        { k: 'B', who: 'NAS → server', t: 'TACACS+ AUTHENTICATION: routerul trimite serverului (TCP 49) cererea de autentificare. Serverul verifică în baza lui (sau în Active Directory).', d: 'AUTHEN START/CONTINUE', from: 1, to: 2, c: 'var(--info)' },
        { k: 'C', who: 'server → NAS', t: 'Serverul răspunde PASS (sau FAIL). Autentificarea s-a încheiat — separat de autorizare.', d: 'AUTHEN REPLY: PASS', from: 2, to: 1, c: 'var(--ok)' },
        { k: 'D', who: 'NAS ⇄ server', t: 'TACACS+ AUTHORIZATION (mesaj distinct): routerul întreabă ce are voie ana: nivel de privilegiu, shell. Pe parcursul sesiunii, fiecare comandă poate fi autorizată separat.', d: 'AUTHOR REQUEST / RESPONSE: priv-lvl=15', from: 1, to: 2, c: 'var(--violet)' },
        { k: 'E', who: 'NAS → server', t: 'TACACS+ ACCOUNTING: la începutul sesiunii (START) și la final (STOP) routerul înregistrează utilizatorul, ora și, dacă s-a configurat, fiecare comandă introdusă.', d: 'ACCT START … STOP', from: 1, to: 2, c: 'var(--warn)' },
      ]
    : [
        { k: 'A', who: 'Admin → NAS', t: 'Administratorul deschide o sesiune SSH către router (NAS) și introduce utilizator + parolă.', d: 'user: ana · parola', from: 0, to: 1, c: 'var(--accent)' },
        { k: 'B', who: 'NAS → server', t: 'RADIUS Access-Request (UDP 1812): conține utilizatorul și parola (doar câmpul de parolă este ascuns cu secretul partajat).', d: 'Access-Request (user, parola*)', from: 1, to: 2, c: 'var(--info)' },
        { k: 'C', who: 'server → NAS', t: 'Access-Accept: într-un singur mesaj vine și decizia de autentificare, și atributele de autorizare (de exemplu nivel de privilegiu, VLAN). RADIUS combină autentificarea cu autorizarea.', d: 'Access-Accept + atribute', from: 2, to: 1, c: 'var(--ok)' },
        { k: 'D', who: 'NAS', t: 'Routerul aplică atributele primite (nivel de privilegiu etc.). Nu există, în mod normal, o autorizare separată pe comandă ca la TACACS+.', d: 'aplică atributele', from: 1, to: 1, c: 'var(--violet)' },
        { k: 'E', who: 'NAS → server', t: 'RADIUS Accounting (UDP 1813): Accounting-Request Start la început și Stop la sfârșit, cu durata și contoare de trafic.', d: 'Accounting-Request START … STOP', from: 1, to: 2, c: 'var(--warn)' },
      ];
}

export function AaaFlow() {
  const [p, setP] = useState<Proto>('tacacs');
  const [i, setI] = useState(0);
  const ST = steps(p);
  const s = ST[i];
  const X = [90, 360, 630];
  return (
    <div>
      <Seg value={p} set={(k) => { setP(k); setI(0); }} label="Protocol AAA" items={[['tacacs', 'TACACS+ (administrare)'], ['radius', 'RADIUS (acces la rețea)']]} />
      <Seg value={String(i)} set={(k) => setI(Number(k))} label="Pas" items={ST.map((x, n) => [String(n), x.k + ' · ' + x.who] as [string, string])} />
      <svg viewBox="0 0 720 210" role="img" aria-label="Fluxul AAA la un login: autentificare, autorizare, contabilizare, între administrator, router (NAS) și serverul AAA">
        <ClientIcon x={X[0]} y={85} label="Administrator" kind="laptop" />
        <RouterIcon x={X[1]} y={85} label="Router (NAS)" />
        <Box x={X[2] - 55} y={60} w={110} h={50} label="Server AAA" sub={p === 'tacacs' ? 'TCP 49' : 'UDP 1812/1813'} c="var(--accent)" />
        <Line x1={X[0] + 26} y1={85} x2={X[1] - 26} y2={85} c="var(--border)" w={1.5} dash="4 4" />
        <Line x1={X[1] + 26} y1={85} x2={X[2] - 55} y2={85} c="var(--border)" w={1.5} dash="4 4" />
        {s.from !== s.to && (
          <g>
            <Line x1={X[s.from] + (s.to > s.from ? 28 : -28)} y1={85} x2={X[s.to] + (s.to > s.from ? -28 : 28)} y2={85} c={s.c} w={4} flow />
            <T x={(X[s.from] + X[s.to]) / 2} y={70} size={11} weight={700} color={s.c}>{s.d}</T>
          </g>
        )}
        {s.from === s.to && <T x={X[1]} y={150} size={11} weight={700} color={s.c}>{s.d}</T>}
        <T x={360} y={185} size={11} color="var(--muted)">NAS = dispozitivul care primește utilizatorul (router, switch, WLC) și întreabă serverul.</T>
      </svg>
      <div style={note(s.c)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>{s.k}. {s.who}</b> — {s.t}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="btn sm" disabled={i === 0} onClick={() => setI(i - 1)}>← Înapoi</button>
          <button type="button" className="btn sm" disabled={i === ST.length - 1} onClick={() => setI(i + 1)}>Înainte →</button>
        </div>
      </div>
    </div>
  );
}

/* 2) RADIUS vs TACACS+: ce se criptează */
export function ProtocolCompare() {
  const [p, setP] = useState<Proto>('radius');
  const R = p === 'radius';
  return (
    <div>
      <Seg value={p} set={setP} label="Protocol" items={[['radius', 'RADIUS'], ['tacacs', 'TACACS+']]} />
      <svg viewBox="0 0 720 210" role="img" aria-label="Structura unui pachet RADIUS comparată cu un pachet TACACS+: partea criptată">
        <T x={20} y={22} anchor="start" size={12} weight={700}>{R ? 'Pachet RADIUS (UDP 1812 / 1813)' : 'Pachet TACACS+ (TCP 49)'}</T>
        {R ? (
          <g>
            <rect x={20} y={36} width={100} height={46} rx={5} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.6} /><T x={70} y={64} size={11} color="var(--info)">Antet (Code, ID)</T>
            <rect x={126} y={36} width={150} height={46} rx={5} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={1.6} /><T x={201} y={64} size={11} color="var(--info)">Authenticator</T>
            <rect x={282} y={36} width={130} height={46} rx={5} fill="var(--surface-3)" stroke="var(--bad)" strokeWidth={1.6} strokeDasharray="4 3" /><T x={347} y={64} size={11} color="var(--bad)">User-Name (clar)</T>
            <rect x={418} y={36} width={140} height={46} rx={5} fill="var(--accent-soft)" stroke="var(--ok)" strokeWidth={2.5} /><T x={488} y={64} size={11} weight={700} color="var(--ok)">User-Password (ascuns)</T>
            <rect x={564} y={36} width={136} height={46} rx={5} fill="var(--surface-3)" stroke="var(--bad)" strokeWidth={1.6} strokeDasharray="4 3" /><T x={632} y={64} size={11} color="var(--bad)">Alte atribute (clar)</T>
            <T x={20} y={112} anchor="start" size={12} color="var(--ok)" weight={700}>Se ascunde DOAR parola (cu secretul partajat).</T>
            <T x={20} y={132} anchor="start" size={11.5} color="var(--text-2)">Numele de utilizator, serviciul cerut, adresele și atributele rămân vizibile pentru cine ascultă drumul.</T>
          </g>
        ) : (
          <g>
            <rect x={20} y={36} width={170} height={46} rx={5} fill="var(--surface-3)" stroke="var(--bad)" strokeWidth={1.6} strokeDasharray="4 3" /><T x={105} y={64} size={11} color="var(--bad)">Antet TACACS+ (clar)</T>
            <rect x={196} y={36} width={504} height={46} rx={5} fill="var(--accent-soft)" stroke="var(--ok)" strokeWidth={2.5} /><T x={448} y={64} size={11.5} weight={700} color="var(--ok)">Corpul pachetului — criptat complet (utilizator, parolă, comenzi, atribute)</T>
            <T x={20} y={112} anchor="start" size={12} color="var(--ok)" weight={700}>Se criptează TOT corpul; doar antetul rămâne în clar.</T>
            <T x={20} y={132} anchor="start" size={11.5} color="var(--text-2)">Antetul conține un flag care poate dezactiva criptarea (nerecomandat, de folosit doar la depanare).</T>
          </g>
        )}
        <T x={20} y={170} anchor="start" size={11.5} color="var(--muted)">{R ? 'Standard deschis IETF (RFC 2865 autentificare/autorizare, RFC 2866 accounting). Combină autentificarea cu autorizarea; accounting separat.' : 'Originar Cisco, descris în RFC 8907. Separă complet autentificarea, autorizarea și contabilizarea; autorizare pe comandă.'}</T>
        <T x={20} y={194} anchor="start" size={11.5} color="var(--muted)">{R ? 'Utilizare tipică: acces la rețea (802.1X, VPN, Wi-Fi).' : 'Utilizare tipică: administrarea echipamentelor (SSH la routere/switch-uri, comenzi autorizate).'}</T>
      </svg>
      <div style={note(R ? 'var(--info)' : 'var(--violet)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {R ? 'RADIUS rulează peste UDP (1812 autentificare/autorizare, 1813 contabilizare; porturile vechi 1645/1646 pot apărea) — fără retransmitere garantată de transport; aplicația retrimite.' : 'TACACS+ rulează peste TCP 49, deci beneficiază de livrare fiabilă și permite autorizare detaliată pe comandă — de aceea e preferat pentru administrarea echipamentelor.'}
        </div>
      </div>
    </div>
  );
}

/* 3) Lista de metode și fallback */
export function MethodListDemo() {
  const [srv, setSrv] = useState<'ok' | 'reject' | 'down'>('ok');
  const [local, setLocal] = useState(true);
  const out = srv === 'ok'
    ? { r: 'ACCEPTAT', c: 'var(--ok)', t: 'Serverul TACACS+ a răspuns și a acceptat credențialele. Metoda „local” nu este consultată.' }
    : srv === 'reject'
      ? { r: 'REFUZAT', c: 'var(--bad)', t: 'Serverul a răspuns, dar a respins credențialele. Un răspuns FAIL este un răspuns definitiv: NU se trece la „local”. (Fallback doar la ERROR: server inaccesibil/timeout.)' }
      : local
        ? { r: 'ACCEPTAT (local)', c: 'var(--warn)', t: 'Serverul nu răspunde (timeout). Metoda următoare din listă, „local”, este încercată: utilizatorul din baza locală este acceptat. Așa te salvează un fallback.' }
        : { r: 'BLOCAT', c: 'var(--bad)', t: 'Serverul nu răspunde, iar în listă nu există „local”: nimeni nu se mai poate autentifica pe linia respectivă. Lockout până la reparare (consolă pe altă listă, sau recuperare).' };
  return (
    <div>
      <Seg value={srv} set={setSrv} label="Starea serverului" items={[['ok', 'Server activ, credențiale corecte'], ['reject', 'Server activ, parolă greșită'], ['down', 'Server inaccesibil']]} />
      <Seg value={local ? 'on' : 'off'} set={(k) => setLocal(k === 'on')} label="Lista de metode" items={[['on', 'group tacacs+ local'], ['off', 'group tacacs+ (fără local)']]} />
      <svg viewBox="0 0 720 150" role="img" aria-label="Lista de metode AAA: se încearcă serverul, apoi baza locală numai dacă serverul nu răspunde">
        <Box x={20} y={50} w={130} h={46} label="Utilizator" sub="ana" />
        <rect x={210} y={40} width={190} height={66} rx={8} fill="var(--surface-3)" stroke="var(--info)" strokeWidth={srv === 'down' ? 1.4 : 2.6} strokeDasharray={srv === 'down' ? '5 4' : undefined} />
        <T x={305} y={64} size={12} weight={700}>1. group tacacs+</T>
        <T x={305} y={86} size={10.5} color={srv === 'down' ? 'var(--bad)' : 'var(--ok)'}>{srv === 'down' ? 'timeout / ERROR' : srv === 'ok' ? 'răspuns: PASS' : 'răspuns: FAIL'}</T>
        <rect x={460} y={40} width={150} height={66} rx={8} fill="var(--surface-3)" stroke="var(--violet)" strokeWidth={srv === 'down' && local ? 2.6 : 1.2} strokeDasharray={srv === 'down' && local ? undefined : '5 4'} opacity={local ? 1 : 0.4} />
        <T x={535} y={64} size={12} weight={700}>2. local</T>
        <T x={535} y={86} size={10.5} color="var(--muted)">{local ? (srv === 'down' ? 'consultat' : 'neconsultat') : '(absent)'}</T>
        <Line x1={150} y1={73} x2={210} y2={73} c="var(--text-2)" /><Line x1={400} y1={73} x2={460} y2={73} c={srv === 'down' ? 'var(--warn)' : 'var(--border)'} dash={srv === 'down' ? undefined : '4 4'} />
        <rect x={624} y={50} width={86} height={46} rx={8} fill="var(--surface-3)" stroke={out.c} strokeWidth={2.6} />
        <T x={667} y={77} size={10.5} weight={800} color={out.c}>{out.r}</T>
      </svg>
      <div style={note(out.c)}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{out.t}</div></div>
    </div>
  );
}

/* 4) 802.1X: roluri și starea portului */
export function Dot1xRoles() {
  const [auth, setAuth] = useState(false);
  return (
    <div>
      <Seg value={auth ? 'on' : 'off'} set={(k) => setAuth(k === 'on')} label="Starea" items={[['off', 'Înainte de autentificare'], ['on', 'După autentificare reușită']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="802.1X: supplicant, authenticator și serverul de autentificare; porturi neautorizat/autorizat">
        <ClientIcon x={80} y={100} label="Supplicant" kind="laptop" />
        <SwitchIcon x={360} y={100} label="Authenticator" />
        <Box x={560} y={74} w={140} h={52} label="Authentication server" sub="RADIUS (ex. ISE)" c="var(--accent)" />
        <Line x1={106} y1={100} x2={334} y2={100} c={auth ? 'var(--ok)' : 'var(--warn)'} w={3} dash={auth ? undefined : '6 4'} flow={auth} />
        <Line x1={386} y1={100} x2={560} y2={100} c="var(--info)" w={3} />
        <T x={220} y={86} size={10.5} weight={700} color={auth ? 'var(--ok)' : 'var(--warn)'}>{auth ? 'trafic normal permis' : 'doar EAPOL (EAP over LAN)'}</T>
        <T x={472} y={86} size={10.5} weight={700} color="var(--info)">RADIUS (EAP în atribute)</T>
        <rect x={290} y={130} width={140} height={28} rx={14} fill="var(--surface-3)" stroke={auth ? 'var(--ok)' : 'var(--bad)'} strokeWidth={2.4} />
        <T x={360} y={148} size={11} weight={700} color={auth ? 'var(--ok)' : 'var(--bad)'}>port {auth ? 'AUTORIZAT' : 'NEAUTORIZAT'}</T>
        <T x={360} y={190} size={11.5} color="var(--text-2)">{auth ? 'Serverul a trimis Access-Accept (cu cheie/atribute, eventual VLAN); switch-ul deschide portul.' : 'Până la autentificare, portul trece doar EAPOL (și, de obicei, CDP/STP); restul traficului este blocat.'}</T>
        <T x={360} y={212} size={10.5} color="var(--muted)">802.1X autentifică înainte de a da acces; același cadru se folosește și în Wi-Fi Enterprise (AP/WLC ca authenticator).</T>
      </svg>
    </div>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 250" role="img" aria-label={solo ? 'Topologie lab solo AAA: router, server AAA și un PC de administrare' : 'Topologie lab ghidat AAA: PC de administrare, router R1 și server AAA'}>
      <ClientIcon x={80} y={120} label="PC-Admin" kind="pc" />
      <RouterIcon x={330} y={120} label="R1 (NAS)" sub="10.0.0.1" />
      <Box x={560} y={95} w={150} h={52} label="Server AAA" sub="10.0.0.20 (TACACS+/RADIUS)" />
      <Line x1={106} y1={120} x2={304} y2={120} /><Line x1={356} y1={120} x2={560} y2={120} />
      <T x={380} y={218} size={11} color="var(--muted)">{solo ? 'AAA configurat cu defecte: ai pierdut accesul sau serverul nu este folosit' : 'R1 autentifică, autorizează și contabilizează sesiunile de administrare prin serverul AAA'}</T>
    </svg>
  );
}
export const LabGuidedTopology58 = () => <Topo solo={false} />;
export const LabSoloTopology58 = () => <Topo solo />;
