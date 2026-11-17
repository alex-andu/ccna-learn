import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 6.5 (API-uri REST: HTTP, CRUD, autentificare, codificarea datelor). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const mono: CSSProperties = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
const inp: CSSProperties = { background: 'var(--surface-3)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: 13 };
const lbl: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12, color: 'var(--text-2)' };

/* ---------------------------------------------------------------
   1) Sandbox REST: un API simulat pentru interfețe (CRUD)
   --------------------------------------------------------------- */
type Item = { id: number; name: string; ip: string; enabled: boolean };
type Resp = { status: number; text: string; headers: Record<string, string>; body: string };
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Authz = 'admin' | 'readonly' | 'bad' | 'none';
const BASE = '/api/v1/interfaces';
const SEED: Item[] = [
  { id: 1, name: 'GigabitEthernet1', ip: '10.0.0.1', enabled: true },
  { id: 2, name: 'GigabitEthernet2', ip: '10.0.1.1', enabled: false },
];
const TEXT: Record<number, string> = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 415: 'Unsupported Media Type' };
const MEAN: Record<number, string> = {
  200: 'Succes: cererea a fost executată și răspunsul conține datele.',
  201: 'Succes: resursa a fost creată (răspuns tipic la POST); antetul Location indică adresa ei.',
  204: 'Succes fără corp: tipic la DELETE.',
  400: 'Cerere greșită (client): corpul este malformat sau lipsesc câmpuri obligatorii.',
  401: 'Neautentificat: lipsesc sau sunt invalide credențialele/tokenul. (Problemă de autentificare.)',
  403: 'Interzis: ești autentificat, dar nu ai permisiunea pentru această acțiune. (Problemă de autorizare.)',
  404: 'Negăsit: resursa sau calea nu există.',
  405: 'Metoda nu este permisă pe acest URI (vezi antetul Allow).',
  409: 'Conflict cu starea curentă (de exemplu o resursă cu același nume există deja).',
  415: 'Tip de conținut neacceptat: lipsește sau este greșit antetul Content-Type.',
};

function handle(items: Item[], nextId: number, m: Method, path: string, authz: Authz, ctype: boolean, body: string): { r: Resp; items: Item[]; nextId: number } {
  const r = (status: number, bodyObj?: unknown, headers: Record<string, string> = {}): Resp => ({ status, text: TEXT[status], headers, body: bodyObj === undefined ? '' : JSON.stringify(bodyObj, null, 2) });
  const same = { r: undefined as unknown as Resp, items, nextId };
  const out = (resp: Resp, it = items, nid = nextId) => ({ ...same, r: resp, items: it, nextId: nid });

  if (path !== BASE && !path.startsWith(BASE + '/')) return out(r(404, { error: 'resursa nu există' }));
  if (authz === 'none') return out(r(401, { error: 'autentificare necesară' }, { 'WWW-Authenticate': 'Bearer' }));
  if (authz === 'bad') return out(r(401, { error: 'token invalid sau expirat' }, { 'WWW-Authenticate': 'Bearer' }));
  if (m !== 'GET' && authz === 'readonly') return out(r(403, { error: 'tokenul are doar drept de citire' }));

  const rest = path.slice(BASE.length + 1);
  const hasId = rest.length > 0;
  const id = Number(rest);

  const parse = (): { ok: true; obj: Record<string, unknown> } | { ok: false; resp: Resp } => {
    if (!ctype) return { ok: false, resp: r(415, { error: 'Content-Type: application/json este obligatoriu' }) };
    try {
      const v = JSON.parse(body);
      if (v === null || typeof v !== 'object' || Array.isArray(v)) return { ok: false, resp: r(400, { error: 'corpul trebuie să fie un obiect JSON' }) };
      return { ok: true, obj: v as Record<string, unknown> };
    } catch {
      return { ok: false, resp: r(400, { error: 'JSON invalid (verifică ghilimelele, virgulele de la sfârșit, true/false)' }) };
    }
  };

  if (!hasId) {
    if (m === 'GET') return out(r(200, items));
    if (m === 'POST') {
      const p = parse();
      if (!p.ok) return out(p.resp);
      const name = p.obj.name, ip = p.obj.ip;
      if (typeof name !== 'string' || !name || typeof ip !== 'string' || !ip) return out(r(400, { error: 'câmpurile name și ip sunt obligatorii' }));
      if (items.some((x) => x.name === name)) return out(r(409, { error: 'există deja o interfață cu acest nume' }));
      const created: Item = { id: nextId, name, ip, enabled: p.obj.enabled === true };
      return out(r(201, created, { Location: BASE + '/' + created.id }), [...items, created], nextId + 1);
    }
    return out(r(405, { error: 'metodă nepermisă pe colecție' }, { Allow: 'GET, POST' }));
  }

  if (!Number.isInteger(id)) return out(r(404, { error: 'identificator invalid' }));
  const cur = items.find((x) => x.id === id);
  if (m === 'POST') return out(r(405, { error: 'metodă nepermisă pe o resursă individuală' }, { Allow: 'GET, PUT, PATCH, DELETE' }));
  if (!cur) return out(r(404, { error: 'interfața ' + id + ' nu există' }));
  if (m === 'GET') return out(r(200, cur));
  if (m === 'DELETE') return out(r(204), items.filter((x) => x.id !== id));
  const p = parse();
  if (!p.ok) return out(p.resp);
  if (m === 'PUT') {
    const name = p.obj.name, ip = p.obj.ip;
    if (typeof name !== 'string' || !name || typeof ip !== 'string' || !ip) return out(r(400, { error: 'PUT cere reprezentarea completă: name și ip sunt obligatorii' }));
    const repl: Item = { id, name, ip, enabled: p.obj.enabled === true };
    return out(r(200, repl), items.map((x) => (x.id === id ? repl : x)));
  }
  // PATCH
  const patched: Item = { ...cur };
  if (typeof p.obj.name === 'string' && p.obj.name) patched.name = p.obj.name;
  if (typeof p.obj.ip === 'string' && p.obj.ip) patched.ip = p.obj.ip;
  if (typeof p.obj.enabled === 'boolean') patched.enabled = p.obj.enabled;
  return out(r(200, patched), items.map((x) => (x.id === id ? patched : x)));
}

const PRESETS: { l: string; m: Method; path: string; authz: Authz; ctype: boolean; body: string }[] = [
  { l: 'GET colecția', m: 'GET', path: BASE, authz: 'admin', ctype: true, body: '' },
  { l: 'GET o resursă', m: 'GET', path: BASE + '/1', authz: 'admin', ctype: true, body: '' },
  { l: 'POST creează', m: 'POST', path: BASE, authz: 'admin', ctype: true, body: '{\n  "name": "Loopback0",\n  "ip": "1.1.1.1",\n  "enabled": true\n}' },
  { l: 'PUT înlocuiește', m: 'PUT', path: BASE + '/2', authz: 'admin', ctype: true, body: '{\n  "name": "GigabitEthernet2",\n  "ip": "10.0.9.1"\n}' },
  { l: 'PATCH modifică', m: 'PATCH', path: BASE + '/2', authz: 'admin', ctype: true, body: '{\n  "enabled": true\n}' },
  { l: 'DELETE șterge', m: 'DELETE', path: BASE + '/2', authz: 'admin', ctype: true, body: '' },
  { l: 'Fără token → 401', m: 'GET', path: BASE, authz: 'none', ctype: true, body: '' },
  { l: 'Token read-only → 403', m: 'DELETE', path: BASE + '/1', authz: 'readonly', ctype: true, body: '' },
  { l: 'JSON invalid → 400', m: 'POST', path: BASE, authz: 'admin', ctype: true, body: '{\n  "name": "Loopback1",\n  "ip": "2.2.2.2",\n}' },
  { l: 'Fără Content-Type → 415', m: 'POST', path: BASE, authz: 'admin', ctype: false, body: '{ "name": "Loopback2", "ip": "3.3.3.3" }' },
  { l: 'Cale greșită → 404', m: 'GET', path: '/api/v1/interface', authz: 'admin', ctype: true, body: '' },
];

export function RestSandbox() {
  const [items, setItems] = useState<Item[]>(SEED);
  const [nextId, setNextId] = useState(3);
  const [m, setM] = useState<Method>('GET');
  const [path, setPath] = useState(BASE);
  const [authz, setAuthz] = useState<Authz>('admin');
  const [ctype, setCtype] = useState(true);
  const [body, setBody] = useState('');
  const [last, setLast] = useState<{ req: string; resp: Resp } | null>(null);

  const reqText = () => {
    const lines = [`${m} ${path} HTTP/1.1`, 'Host: api.lab', 'Accept: application/json'];
    if (authz === 'admin') lines.push('Authorization: Bearer admin-token');
    if (authz === 'readonly') lines.push('Authorization: Bearer readonly-token');
    if (authz === 'bad') lines.push('Authorization: Bearer abc.expirat.123');
    if (ctype && (m === 'POST' || m === 'PUT' || m === 'PATCH')) lines.push('Content-Type: application/json');
    return lines.join('\n') + (body && (m === 'POST' || m === 'PUT' || m === 'PATCH') ? '\n\n' + body : '');
  };
  const send = () => {
    const res = handle(items, nextId, m, path, authz, ctype, body);
    setItems(res.items);
    setNextId(res.nextId);
    setLast({ req: reqText(), resp: res.r });
  };
  const load = (i: number) => {
    const p = PRESETS[i];
    setM(p.m); setPath(p.path); setAuthz(p.authz); setCtype(p.ctype); setBody(p.body);
  };
  const reset = () => { setItems(SEED); setNextId(3); setLast(null); };
  const cls = last ? (last.resp.status < 300 ? 'var(--ok)' : last.resp.status < 400 ? 'var(--info)' : last.resp.status < 500 ? 'var(--warn)' : 'var(--bad)') : 'var(--border)';
  const hasBody = m === 'POST' || m === 'PUT' || m === 'PATCH';

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {PRESETS.map((p, i) => <button key={p.l} type="button" className="btn sm ghost" onClick={() => load(i)}>{p.l}</button>)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end', marginBottom: 8 }}>
        <label style={lbl}>Metodă
          <select style={inp} value={m} onChange={(e) => setM(e.target.value as Method)} aria-label="Metoda HTTP">
            {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as Method[]).map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label style={{ ...lbl, flex: '1 1 220px' }}>URI
          <input style={{ ...inp, ...mono }} value={path} onChange={(e) => setPath(e.target.value)} aria-label="Calea URI" />
        </label>
        <label style={lbl}>Autentificare
          <select style={inp} value={authz} onChange={(e) => setAuthz(e.target.value as Authz)} aria-label="Autentificare">
            <option value="admin">Bearer admin-token</option>
            <option value="readonly">Bearer readonly-token</option>
            <option value="bad">Bearer token expirat</option>
            <option value="none">fără Authorization</option>
          </select>
        </label>
        <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={ctype} onChange={(e) => setCtype(e.target.checked)} /> Content-Type: application/json
        </label>
      </div>
      {hasBody && (
        <label style={lbl}>Corp (JSON)
          <textarea style={{ ...inp, ...mono, minHeight: 90 }} value={body} onChange={(e) => setBody(e.target.value)} aria-label="Corpul cererii" />
        </label>
      )}
      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <button type="button" className="btn sm primary" onClick={send}>Trimite cererea</button>
        <button type="button" className="btn sm ghost" onClick={reset}>Resetează datele serverului</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 8 }}>
        <div style={note('var(--border)')}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>CERERE (client → server)</div>
          <div style={mono}>{last ? last.req : reqText()}</div>
        </div>
        <div style={note(cls)}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>RĂSPUNS (server → client)</div>
          {last ? (
            <div style={mono}>
              <b style={{ color: cls }}>HTTP/1.1 {last.resp.status} {last.resp.text}</b>
              {Object.entries(last.resp.headers).map(([k, v]) => '\n' + k + ': ' + v).join('')}
              {last.resp.body ? '\nContent-Type: application/json\n\n' + last.resp.body : '\n(fără corp)'}
            </div>
          ) : <div style={{ fontSize: 13, color: 'var(--muted)' }}>Apasă „Trimite cererea”.</div>}
        </div>
      </div>
      {last && <div style={note(cls)}><p style={{ margin: 0, fontSize: 13 }}><b>{last.resp.status} {last.resp.text}</b> — {MEAN[last.resp.status]}</p></div>}
      <div style={note('var(--border)')}>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>STAREA SERVERULUI (resursele existente acum)</div>
        <div style={mono}>{items.length ? items.map((x) => `${x.id}  ${x.name}  ${x.ip}  enabled=${x.enabled}`).join('\n') : '(nicio interfață)'}</div>
      </div>
      <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>Serverul este simulat în pagină (nu se trimite nimic în rețea). Încearcă: același POST de două ori (→ 409), PUT fără „ip” (→ 400), PATCH vs PUT pe aceeași resursă, DELETE de două ori (→ 204 apoi 404).</p>
    </div>
  );
}

/* ---------------------------------------------------------------
   2) Mecanisme de autentificare
   --------------------------------------------------------------- */
type Auth = 'basic' | 'key' | 'bearer' | 'oauth';
const AUTHS: Record<Auth, { n: string; hdr: string; how: string; pro: string; con: string }> = {
  basic: {
    n: 'HTTP Basic',
    hdr: 'Authorization: Basic YWRtaW46UGFyb2xhMTIz',
    how: 'Clientul trimite „utilizator:parolă” codificat Base64 la fiecare cerere. Base64 este codificare, NU criptare: oricine vede antetul poate citi parola. De aceea se folosește doar peste HTTPS. Multe API-uri îl folosesc o singură dată, ca să obțină un token.',
    pro: 'Simplu, suportat peste tot.',
    con: 'Parola circulă la fiecare cerere (dacă nu e înlocuită de token); fără expirare ușoară.',
  },
  key: {
    n: 'API key',
    hdr: 'X-API-Key: 7f3a9c0e5b1d44ac',
    how: 'O cheie secretă statică, atribuită aplicației, se trimite într-un antet (uneori în URL — nerecomandat, apare în log-uri). Identifică aplicația, nu neapărat un utilizator.',
    pro: 'Foarte simplu; ușor de revocat și de limitat per aplicație.',
    con: 'Dacă se scurge, oricine o poate folosi până la revocare; fără expirare implicită.',
  },
  bearer: {
    n: 'Token (Bearer)',
    hdr: 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...',
    how: 'Clientul se autentifică o dată (de exemplu cu Basic) și primește un token temporar, pe care îl trimite apoi la fiecare cerere. „Bearer” = oricine deține tokenul are acces, deci tokenul trebuie protejat. Unele API-uri Cisco folosesc un antet propriu, de exemplu X-Auth-Token.',
    pro: 'Expiră, poate fi revocat, poate purta permisiuni; parola nu mai circulă la fiecare cerere.',
    con: 'Trebuie reînnoit; tokenul furat funcționează până expiră.',
  },
  oauth: {
    n: 'OAuth 2.0',
    hdr: 'Authorization: Bearer <access_token> (obținut printr-un flux OAuth)',
    how: 'Cadru de autorizare delegată: un server de autorizare emite un access token cu permisiuni limitate (scope) și durată scurtă, după ce utilizatorul sau aplicația este autentificată. Aplicația nu vede parola utilizatorului. Tokenul se trimite ca Bearer.',
    pro: 'Delegare sigură, scope-uri, durată scurtă, refresh tokens; standard larg.',
    con: 'Mai complex de implementat; mai multe părți implicate.',
  },
};
export function AuthMechanisms() {
  const [a, setA] = useState<Auth>('bearer');
  const d = AUTHS[a];
  return (
    <div>
      <Seg value={a} set={setA} label="Mecanism de autentificare" items={[['basic', 'Basic'], ['key', 'API key'], ['bearer', 'Token (Bearer)'], ['oauth', 'OAuth 2.0']]} />
      <svg viewBox="0 0 560 120" width="100%" role="img" aria-label="Clientul trimite o cerere autentificată către serverul API">
        <ClientIcon x={60} y={55} label="Client" kind="pc" />
        <Box x={400} y={30} w={140} h={50} label="Server API" sub="verifică credențialele" c="var(--accent)" />
        <Line x1={90} y1={55} x2={400} y2={55} c="var(--accent)" w={2.2} flow />
        <T x={245} y={44} size={10} color="var(--accent)" weight={700}>HTTPS + antet de autentificare</T>
        <T x={245} y={74} size={10} m color="var(--text)">{a === 'basic' ? 'Authorization: Basic …' : a === 'key' ? 'X-API-Key: …' : 'Authorization: Bearer …'}</T>
        <T x={280} y={110} size={10} color="var(--muted)">răspuns: 200 (ok) · 401 (autentificare lipsă/invalidă) · 403 (fără permisiune)</T>
      </svg>
      <div style={note('var(--accent)')}>
        <p style={{ margin: 0 }}><b>{d.n}</b></p>
        <div style={{ ...mono, margin: '6px 0', color: 'var(--accent)' }}>{d.hdr}</div>
        <p style={{ margin: '4px 0', fontSize: 13 }}>{d.how}</p>
        <p style={{ margin: '4px 0', fontSize: 13 }}><b style={{ color: 'var(--ok)' }}>Avantaje:</b> {d.pro}</p>
        <p style={{ margin: '4px 0 0', fontSize: 13 }}><b style={{ color: 'var(--warn)' }}>Dezavantaje:</b> {d.con}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   3) Același set de date în JSON, XML și YAML
   --------------------------------------------------------------- */
type Enc = 'json' | 'xml' | 'yaml';
const ENC: Record<Enc, { n: string; ct: string; code: string; txt: string }> = {
  json: {
    n: 'JSON', ct: 'application/json',
    code: '{\n  "interface": {\n    "name": "GigabitEthernet1",\n    "enabled": true,\n    "mtu": 1500,\n    "ipv4": [\n      { "ip": "10.1.1.1", "mask": "255.255.255.0" }\n    ],\n    "description": null\n  }\n}',
    txt: 'Obiecte { } cu perechi "cheie": valoare, liste [ ]. Cheile în ghilimele duble; true/false/null cu litere mici. Cel mai folosit format în API-uri REST moderne: compact și ușor de procesat de aplicații (detalii la 6.7).',
  },
  xml: {
    n: 'XML', ct: 'application/xml',
    code: '<interface>\n  <name>GigabitEthernet1</name>\n  <enabled>true</enabled>\n  <mtu>1500</mtu>\n  <ipv4>\n    <address>\n      <ip>10.1.1.1</ip>\n      <mask>255.255.255.0</mask>\n    </address>\n  </ipv4>\n  <description/>\n</interface>',
    txt: 'Date între etichete <tag>…</tag>, ierarhice. Mai „vorbăreț” decât JSON. Folosit de NETCONF (6.3) și de multe API-uri mai vechi.',
  },
  yaml: {
    n: 'YAML', ct: 'application/yaml',
    code: 'interface:\n  name: GigabitEthernet1\n  enabled: true\n  mtu: 1500\n  ipv4:\n    - ip: 10.1.1.1\n      mask: 255.255.255.0\n  description: null',
    txt: 'Structura se exprimă prin indentare (spații, nu taburi) și liniuțe pentru liste. Foarte lizibil pentru oameni; folosit în fișiere de configurare și playbook-uri Ansible (6.6), mai rar ca format de răspuns în API-uri.',
  },
};
export function EncodingCompare() {
  const [e, setE] = useState<Enc>('json');
  const d = ENC[e];
  return (
    <div>
      <Seg value={e} set={setE} label="Format de date" items={[['json', 'JSON'], ['xml', 'XML'], ['yaml', 'YAML']]} />
      <div style={note('var(--accent)')}>
        <div style={{ ...mono, marginBottom: 8 }}>{'Content-Type: ' + d.ct + '\nAccept: ' + d.ct}</div>
        <pre style={{ ...mono, margin: 0, background: 'var(--code-bg)', padding: 10, borderRadius: 6, overflowX: 'auto' }}>{d.code}</pre>
        <p style={{ margin: '8px 0 0', fontSize: 13 }}><b>{d.n}</b> — {d.txt}</p>
      </div>
      <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>Aceleași informații (nume interfață, stare, MTU, adresă IP) în trei codificări. Antetele Content-Type (ce trimiți) și Accept (ce vrei să primești) negociază formatul.</p>
    </div>
  );
}

/* ---------------------------------------------------------------
   Topologii de laborator
   --------------------------------------------------------------- */
export function LabGuidedTopology65() {
  return (
    <svg viewBox="0 0 560 170" width="100%" role="img" aria-label="Topologie lab 6.5 ghidat: calculator, Internet și un API public de test">
      <ClientIcon x={70} y={80} label="Calculatorul tău" kind="pc" />
      <T x={70} y={118} size={9} color="var(--muted)" m>curl · Postman · Python</T>
      <RouterIcon x={250} y={80} label="Internet" />
      <Box x={380} y={52} w={160} h={56} label="API de test (REST)" sub="jsonplaceholder.typicode.com" c="var(--accent)" fill="var(--accent-soft)" />
      <Line x1={100} y1={80} x2={220} y2={80} c="var(--accent)" w={2} flow />
      <Line x1={280} y1={80} x2={380} y2={80} c="var(--accent)" w={2} flow />
      <T x={280} y={150} size={11} color="var(--muted)">cerere HTTPS (GET/POST/PUT/PATCH/DELETE) → răspuns JSON + cod de stare</T>
    </svg>
  );
}
export function LabSoloTopology65() {
  return (
    <svg viewBox="0 0 560 170" width="100%" role="img" aria-label="Topologie lab 6.5 solo: client, controller cu API și un echipament">
      <ClientIcon x={60} y={80} label="Script / Postman" kind="pc" />
      <Box x={200} y={52} w={150} h={56} label="Controller" sub="REST northbound" c="var(--accent)" fill="var(--accent-soft)" />
      <RouterIcon x={470} y={80} label="Echipament" />
      <Line x1={90} y1={80} x2={200} y2={80} c="var(--info)" w={2} flow />
      <Line x1={350} y1={80} x2={440} y2={80} c="var(--ok)" w={2} flow />
      <T x={145} y={68} size={10} color="var(--info)" weight={700}>northbound</T>
      <T x={395} y={68} size={10} color="var(--ok)" weight={700}>southbound</T>
      <T x={280} y={150} size={11} color="var(--muted)">cinci cereri defecte de diagnosticat (metodă, antete, JSON, autentificare, URI)</T>
    </svg>
  );
}
