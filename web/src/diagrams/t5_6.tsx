import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.6 (ACL). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const mono: CSSProperties = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };

/* ---------- utilitare IPv4 ---------- */
function parseIp(s: string): number[] | null {
  const p = s.trim().split('.');
  if (p.length !== 4) return null;
  const n = p.map((x) => (/^\d{1,3}$/.test(x) ? Number(x) : NaN));
  return n.some((x) => Number.isNaN(x) || x > 255) ? null : n;
}
const toNum = (o: number[]) => ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
const toStr = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

/* 1) Procesarea unui ACL: primul match câștigă + deny implicit */
type Rule = { seq: number; act: 'permit' | 'deny'; txt: string; match: (p: Pkt) => boolean };
type Pkt = { id: string; label: string; src: string; dst: string; proto: 'tcp' | 'udp' | 'icmp'; dport?: number };

const PKTS: Pkt[] = [
  { id: 'p1', label: 'PC staff → web (HTTP)', src: '192.168.10.15', dst: '10.1.1.80', proto: 'tcp', dport: 80 },
  { id: 'p2', label: 'Oaspete → web (HTTP)', src: '192.168.20.7', dst: '10.1.1.80', proto: 'tcp', dport: 80 },
  { id: 'p3', label: 'Oaspete → web (HTTPS)', src: '192.168.20.7', dst: '10.1.1.80', proto: 'tcp', dport: 443 },
  { id: 'p4', label: 'Oaspete → server (ping)', src: '192.168.20.7', dst: '10.1.1.80', proto: 'icmp' },
  { id: 'p5', label: 'PC staff → server FTP', src: '192.168.10.15', dst: '10.1.1.80', proto: 'tcp', dport: 21 },
  { id: 'p6', label: 'Oaspete → Internet DNS', src: '192.168.20.7', dst: '8.8.8.8', proto: 'udp', dport: 53 },
];
const inNet = (ip: string, net: string, wc: string) => {
  const a = parseIp(ip), n = parseIp(net), w = parseIp(wc);
  if (!a || !n || !w) return false;
  const wm = toNum(w);
  return ((toNum(a) & ~wm) >>> 0) === ((toNum(n) & ~wm) >>> 0);
};
const RULES: Rule[] = [
  { seq: 10, act: 'permit', txt: 'permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.80 eq 80', match: (p) => p.proto === 'tcp' && inNet(p.src, '192.168.10.0', '0.0.0.255') && p.dst === '10.1.1.80' && p.dport === 80 },
  { seq: 20, act: 'permit', txt: 'permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 80', match: (p) => p.proto === 'tcp' && inNet(p.src, '192.168.20.0', '0.0.0.255') && p.dst === '10.1.1.80' && p.dport === 80 },
  { seq: 30, act: 'deny', txt: 'deny icmp 192.168.20.0 0.0.0.255 any', match: (p) => p.proto === 'icmp' && inNet(p.src, '192.168.20.0', '0.0.0.255') },
  { seq: 40, act: 'permit', txt: 'permit udp any any eq 53', match: (p) => p.proto === 'udp' && p.dport === 53 },
];

export function AclProcessor() {
  const [pid, setPid] = useState('p1');
  const [tail, setTail] = useState(false);
  const p = PKTS.find((x) => x.id === pid)!;
  const hit = RULES.findIndex((r) => r.match(p));
  const implicit = hit < 0 && !tail;
  const tailHit = hit < 0 && tail;
  const verdict = hit >= 0 ? RULES[hit].act : tailHit ? 'permit' : 'deny';
  const vc = verdict === 'permit' ? 'var(--ok)' : 'var(--bad)';
  return (
    <div>
      <Seg value={pid} set={setPid} label="Pachetul testat" items={PKTS.map((x) => [x.id, x.label] as [string, string])} />
      <Seg value={tail ? 'on' : 'off'} set={(k) => setTail(k === 'on')} label="Ultima linie" items={[['off', 'Doar regulile (deny implicit)'], ['on', 'Adaugă „permit ip any any”']]} />
      <svg viewBox="0 0 720 300" role="img" aria-label="Procesarea unui ACL de sus în jos; prima linie care se potrivește decide, altfel deny implicit">
        <T x={20} y={20} anchor="start" size={11} color="var(--muted)">ip access-list extended SRV-IN</T>
        {RULES.map((r, i) => {
          const y = 32 + i * 40;
          const skipped = hit >= 0 && i > hit;
          const isHit = i === hit;
          const col = r.act === 'permit' ? 'var(--ok)' : 'var(--bad)';
          return (
            <g key={r.seq} opacity={skipped ? 0.35 : 1}>
              <rect x={14} y={y} width={560} height={32} rx={6} fill={isHit ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={isHit ? col : 'var(--border)'} strokeWidth={isHit ? 2.5 : 1.2} />
              <T x={26} y={y + 20} anchor="start" size={11} m color="var(--muted)">{r.seq}</T>
              <T x={62} y={y + 20} anchor="start" size={11.5} m color={col} weight={700}>{r.act}</T>
              <T x={130} y={y + 20} anchor="start" size={10.5} m color="var(--text)">{r.txt.replace(r.act + ' ', '')}</T>
              {isHit && <T x={566} y={y + 20} anchor="end" size={11} weight={700} color={col}>← prima potrivire</T>}
              {!isHit && hit < 0 && <T x={566} y={y + 20} anchor="end" size={10.5} color="var(--muted)">nu se potrivește</T>}
              {skipped && <T x={566} y={y + 20} anchor="end" size={10.5} color="var(--muted)">nu se mai citește</T>}
            </g>
          );
        })}
        {tail && (
          <g opacity={hit >= 0 ? 0.35 : 1}>
            <rect x={14} y={32 + RULES.length * 40} width={560} height={32} rx={6} fill={tailHit ? 'var(--accent-soft)' : 'var(--surface-3)'} stroke={tailHit ? 'var(--ok)' : 'var(--border)'} strokeWidth={tailHit ? 2.5 : 1.2} />
            <T x={26} y={32 + RULES.length * 40 + 20} anchor="start" size={11} m color="var(--muted)">50</T>
            <T x={62} y={32 + RULES.length * 40 + 20} anchor="start" size={11.5} m color="var(--ok)" weight={700}>permit</T>
            <T x={130} y={32 + RULES.length * 40 + 20} anchor="start" size={10.5} m>ip any any</T>
          </g>
        )}
        <g>
          <rect x={14} y={32 + (RULES.length + (tail ? 1 : 0)) * 40} width={560} height={32} rx={6} fill={implicit ? 'var(--accent-soft)' : 'transparent'} stroke={implicit ? 'var(--bad)' : 'var(--border)'} strokeWidth={implicit ? 2.5 : 1} strokeDasharray="5 4" />
          <T x={26} y={32 + (RULES.length + (tail ? 1 : 0)) * 40 + 20} anchor="start" size={11} m color="var(--muted)">(invizibil)</T>
          <T x={110} y={32 + (RULES.length + (tail ? 1 : 0)) * 40 + 20} anchor="start" size={11.5} m color="var(--bad)" weight={700}>deny ip any any</T>
          <T x={566} y={32 + (RULES.length + (tail ? 1 : 0)) * 40 + 20} anchor="end" size={10.5} weight={implicit ? 700 : 500} color={implicit ? 'var(--bad)' : 'var(--muted)'}>{implicit ? '← deny implicit' : 'deny implicit (la final)'}</T>
        </g>
        <rect x={596} y={60} width={110} height={90} rx={10} fill="var(--surface-3)" stroke={vc} strokeWidth={3} />
        <T x={651} y={96} size={14} weight={800} color={vc}>{verdict === 'permit' ? 'PERMIT' : 'DENY'}</T>
        <T x={651} y={118} size={10} color="var(--muted)">{hit >= 0 ? 'linia ' + RULES[hit].seq : tailHit ? 'linia 50' : 'deny implicit'}</T>
      </svg>
      <div style={note(vc)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          Pachet: <b>{p.label}</b> — <span style={mono}>{p.proto} {p.src} → {p.dst}{p.dport ? ':' + p.dport : ''}</span>. {hit >= 0 ? `Routerul citește de sus în jos și se oprește la linia ${RULES[hit].seq} (${RULES[hit].act}); liniile de după nu mai sunt evaluate.` : tailHit ? 'Niciuna dintre primele patru linii nu se potrivește; linia „permit ip any any” adăugată la final îl lasă să treacă.' : 'Niciuna dintre linii nu se potrivește: pachetul ajunge la „deny ip any any” invizibil de la finalul oricărui ACL și este aruncat.'}
        </div>
      </div>
    </div>
  );
}

/* 2) Wildcard trainer */
export function WildcardTrainer() {
  const [net, setNet] = useState('192.168.10.64');
  const [len, setLen] = useState(26);
  const [test, setTest] = useState('192.168.10.100');
  const n = parseIp(net);
  const mask = len === 0 ? 0 : (0xffffffff << (32 - len)) >>> 0;
  const wc = (~mask) >>> 0;
  const base = n ? (toNum(n) & mask) >>> 0 : null;
  const last = base !== null ? (base | wc) >>> 0 : null;
  const t = parseIp(test);
  const inRange = t && base !== null ? ((toNum(t) & mask) >>> 0) === base : null;
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
        <label style={{ fontSize: 13 }}>Adresă de rețea <input value={net} onChange={(e) => setNet(e.target.value)} style={{ ...mono, width: 150, marginLeft: 6 }} aria-label="Adresă de rețea" /></label>
        <label style={{ fontSize: 13 }}>Prefix /{len} <input type="range" min={8} max={32} value={len} onChange={(e) => setLen(Number(e.target.value))} aria-label="Lungime prefix" style={{ verticalAlign: 'middle', marginLeft: 6 }} /></label>
        <label style={{ fontSize: 13 }}>Adresă de testat <input value={test} onChange={(e) => setTest(e.target.value)} style={{ ...mono, width: 150, marginLeft: 6 }} aria-label="Adresă de testat" /></label>
      </div>
      <svg viewBox="0 0 720 170" role="img" aria-label="Masca de subrețea și wildcard mask, bit cu bit">
        {[0, 1, 2, 3].map((o) => {
          const ob = (mask >>> (24 - o * 8)) & 255;
          return [...Array(8)].map((_, b) => {
            const bit = (ob >> (7 - b)) & 1;
            const x = 20 + o * 172 + b * 19;
            return (
              <g key={o + '-' + b}>
                <rect x={x} y={20} width={17} height={22} rx={3} fill="var(--surface-3)" stroke={bit ? 'var(--accent)' : 'var(--ok)'} strokeWidth={1.4} />
                <T x={x + 8.5} y={36} size={11} m color={bit ? 'var(--accent)' : 'var(--ok)'}>{bit}</T>
                <rect x={x} y={96} width={17} height={22} rx={3} fill="var(--surface-3)" stroke={bit ? 'var(--muted)' : 'var(--ok)'} strokeWidth={1.4} />
                <T x={x + 8.5} y={112} size={11} m color={bit ? 'var(--muted)' : 'var(--ok)'}>{bit ? 0 : 1}</T>
              </g>
            );
          });
        })}
        <T x={20} y={14} anchor="start" size={10.5} color="var(--muted)">Masca de subrețea (1 = „trebuie să fie egal”)</T>
        <T x={20} y={90} anchor="start" size={10.5} color="var(--muted)">Wildcard (inversul: 0 = „trebuie să fie egal”, 1 = „nu contează”)</T>
        <T x={20} y={58} anchor="start" size={12} m>{toStr(mask)}</T>
        <T x={20} y={140} anchor="start" size={13} m color="var(--ok)" weight={700}>{toStr(wc)}</T>
        <T x={360} y={140} anchor="start" size={11} color="var(--muted)">{len === 32 ? 'echivalent „host”' : len === 0 ? 'echivalent „any”' : 'valoare pentru ACL'}</T>
      </svg>
      <div style={note(inRange === null ? 'var(--border)' : inRange ? 'var(--ok)' : 'var(--bad)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {base === null ? 'Introdu o adresă IPv4 validă (ex. 192.168.10.64).' : (
            <>
              Linia ACL: <span style={mono}>permit ip {toStr(base)} {toStr(wc)} any</span> — potrivește adresele <b style={mono}>{toStr(base)}</b> … <b style={mono}>{toStr(last!)}</b> ({(wc + 1).toLocaleString('ro-RO')} adrese).{' '}
              {n && toNum(n) !== base ? 'Notă: adresa introdusă nu era adresa de rețea; ACL-ul folosește partea fixă, adică ' + toStr(base) + '. ' : ''}
              {inRange === null ? 'Adresa de testat nu este validă.' : inRange ? `Adresa ${test} SE potrivește.` : `Adresa ${test} NU se potrivește.`}
            </>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Truc: wildcard = 255.255.255.255 − masca. Pentru /26: 255.255.255.192 → 0.0.0.63. Wildcard-ul poate fi și „discontinuu” (ex. 0.0.0.254 = doar adresele pare), dar la CCNA se folosesc aproape exclusiv wildcard-uri contigue.</div>
      </div>
    </div>
  );
}

/* 3) Plasarea ACL: standard aproape de destinație, extended aproape de sursă */
export function AclPlacement() {
  const [kind, setKind] = useState<'std' | 'ext'>('ext');
  const [place, setPlace] = useState<'src' | 'dst'>('src');
  const okPlace = (kind === 'ext' && place === 'src') || (kind === 'std' && place === 'dst');
  return (
    <div>
      <Seg value={kind} set={setKind} label="Tip de ACL" items={[['std', 'Standard (doar sursa)'], ['ext', 'Extended (sursă, destinație, port)']]} />
      <Seg value={place} set={setPlace} label="Unde îl aplic" items={[['src', 'Lângă sursă (R1 Gi0/0 in)'], ['dst', 'Lângă destinație (R3 Gi0/1 out)']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Plasarea unui ACL pe calea PC1 spre server, lângă sursă sau lângă destinație">
        <ClientIcon x={50} y={80} label="PC1 .10.5" kind="pc" />
        <ClientIcon x={50} y={170} label="PC2 .10.6" kind="pc" />
        <RouterIcon x={190} y={125} label="R1" />
        <RouterIcon x={360} y={125} label="R2" />
        <RouterIcon x={530} y={125} label="R3" />
        <Box x={620} y={30} w={90} h={40} label="Server web" sub="10.1.1.80" />
        <Box x={620} y={170} w={90} h={40} label="Server FTP" sub="10.1.1.90" />
        <Line x1={74} y1={86} x2={166} y2={118} /><Line x1={74} y1={166} x2={166} y2={132} />
        <Line x1={216} y1={125} x2={334} y2={125} /><Line x1={386} y1={125} x2={504} y2={125} />
        <Line x1={556} y1={118} x2={620} y2={52} /><Line x1={556} y1={132} x2={620} y2={190} />
        <g>
          <rect x={place === 'src' ? 108 : 560} y={place === 'src' ? 85 : 100} width={place === 'src' ? 70 : 62} height={22} rx={11} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} />
          <T x={place === 'src' ? 143 : 591} y={place === 'src' ? 100 : 115} size={10.5} weight={700} color="var(--accent)">ACL</T>
        </g>
        <T x={360} y={30} size={11.5} weight={700} color={okPlace ? 'var(--ok)' : 'var(--warn)'}>
          {kind === 'ext' ? (place === 'src' ? 'Extended lângă sursă: traficul nedorit este oprit imediat' : 'Extended lângă destinație: traficul inutil traversează toată rețeaua') : (place === 'dst' ? 'Standard lângă destinație: nu blochează restul serviciilor sursei' : 'Standard lângă sursă: blochează PC1 spre TOT')}
        </T>
      </svg>
      <div style={note(okPlace ? 'var(--ok)' : 'var(--warn)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {kind === 'ext' && place === 'src' && 'Extended ACL poate spune exact „PC1 nu are voie la FTP 10.1.1.90 pe portul 21”, deci îl pui cât mai aproape de sursă: pachetele interzise nu mai consumă bandă pe R1–R2–R3. Restul traficului lui PC1 (de exemplu HTTP către serverul web) trece normal.'}
          {kind === 'ext' && place === 'dst' && 'Funcționează logic, dar pachetele interzise parcurg R1, R2, R3 și sunt aruncate abia la final: bandă irosită. Regula practică: extended aproape de sursă.'}
          {kind === 'std' && place === 'dst' && 'Standard ACL vede doar adresa sursă. Dacă blochezi „PC1” aproape de destinație (R3, pe interfața spre serverul FTP), PC1 pierde accesul la FTP, dar poate folosi în continuare alte rețele care nu trec pe acea interfață. Regula practică: standard aproape de destinație.'}
          {kind === 'std' && place === 'src' && 'Standard aproape de sursă blochează tot traficul lui PC1 către ORICE destinație, nu doar FTP — probabil mai mult decât voiai. De aceea standard se pune lângă destinație.'}
        </div>
      </div>
    </div>
  );
}

/* 4) Direcția in / out */
export function InOutDirection() {
  const [dir, setDir] = useState<'in' | 'out'>('in');
  return (
    <div>
      <Seg value={dir} set={setDir} label="Direcția" items={[['in', 'ip access-group … in'], ['out', 'ip access-group … out']]} />
      <svg viewBox="0 0 720 190" role="img" aria-label="Direcția inbound și outbound pentru un ACL pe interfața unui router">
        <rect x={250} y={30} width={220} height={120} rx={12} fill="var(--surface-3)" stroke="var(--border)" strokeWidth={1.6} />
        <T x={360} y={52} size={12} weight={700}>Router</T>
        <rect x={262} y={64} width={70} height={30} rx={6} fill="var(--surface-2)" stroke="var(--accent)" strokeWidth={1.6} />
        <T x={297} y={83} size={10.5}>Gi0/0</T>
        <rect x={388} y={64} width={70} height={30} rx={6} fill="var(--surface-2)" stroke="var(--info)" strokeWidth={1.6} />
        <T x={423} y={83} size={10.5}>Gi0/1</T>
        <T x={360} y={118} size={11} color="var(--muted)">decizie de rutare (tabela de rutare)</T>
        <Line x1={60} y1={79} x2={262} y2={79} c="var(--accent)" w={3} flow />
        <Line x1={458} y1={79} x2={660} y2={79} c="var(--info)" w={3} flow />
        <T x={160} y={68} size={10.5} color="var(--accent)">intră pe Gi0/0</T>
        <T x={560} y={68} size={10.5} color="var(--info)">iese pe Gi0/1</T>
        {dir === 'in' ? (
          <g><rect x={226} y={60} width={34} height={38} rx={6} fill="var(--accent-soft)" stroke="var(--ok)" strokeWidth={2.5} /><T x={243} y={84} size={10} weight={700} color="var(--ok)">ACL</T><T x={243} y={116} size={10} color="var(--ok)">înainte de rutare</T></g>
        ) : (
          <g><rect x={460} y={60} width={34} height={38} rx={6} fill="var(--accent-soft)" stroke="var(--ok)" strokeWidth={2.5} /><T x={477} y={84} size={10} weight={700} color="var(--ok)">ACL</T><T x={477} y={116} size={10} color="var(--ok)">după rutare</T></g>
        )}
        <T x={360} y={176} size={11.5} color="var(--text-2)">Direcția se judecă din punctul de vedere al ROUTERULUI: „in” = pachetul intră pe interfață.</T>
      </svg>
      <div style={note('var(--info)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {dir === 'in' ? 'Inbound: pachetul este verificat imediat ce intră, înainte ca routerul să mai caute în tabela de rutare. Pachetele interzise nu consumă CPU pentru rutare. Este alegerea cea mai frecventă.' : 'Outbound: pachetul a fost deja rutat și este verificat chiar înainte să iasă. Atenție: ACL-ul outbound NU filtrează traficul generat de router însuși (de exemplu un ping inițiat din router).'}
        </div>
      </div>
    </div>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 270" role="img" aria-label={solo ? 'Topologie lab solo ACL: un router cu trei rețele' : 'Topologie lab ghidat ACL: un router cu rețeaua staff, rețeaua de oaspeți și rețeaua serverelor'}>
      <RouterIcon x={380} y={125} label="R1" sub="3 interfețe LAN" />
      <ClientIcon x={80} y={60} label="PC-Staff" kind="pc" />
      <ClientIcon x={80} y={190} label="PC-Guest" kind="pc" />
      <Box x={600} y={95} w={140} h={60} label="Server" sub="10.1.1.80 (HTTP, FTP)" />
      <Line x1={104} y1={64} x2={354} y2={118} /><Line x1={104} y1={186} x2={354} y2={132} /><Line x1={406} y1={125} x2={600} y2={125} />
      <T x={200} y={78} size={10} m color="var(--muted)">Gi0/0 · 192.168.10.1/24</T>
      <T x={200} y={176} size={10} m color="var(--muted)">Gi0/1 · 192.168.20.1/24</T>
      <T x={500} y={114} size={10} m color="var(--muted)">Gi0/2 · 10.1.1.1/24</T>
      <T x={380} y={236} size={11} color="var(--muted)">{solo ? 'ACL-urile primite au defecte: găsește-le și corectează-le' : 'Staff are acces complet la server; oaspeții doar la HTTP'}</T>
    </svg>
  );
}
export const LabGuidedTopology56 = () => <Topo solo={false} />;
export const LabSoloTopology56 = () => <Topo solo />;
