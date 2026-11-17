import { useState, type CSSProperties } from 'react';
import { ClientIcon, RouterIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.5 (VPN IPsec: site-to-site și remote access). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });

function Cloud({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={95} ry={34} fill="var(--surface-3)" stroke="var(--border)" strokeWidth={1.5} />
      <T x={x} y={y + 4} size={12} weight={700} color="var(--text-2)">{label}</T>
    </g>
  );
}

/* 1) Tipuri de VPN */
export function VpnTypes() {
  const [t, setT] = useState<'s2s' | 'ra'>('s2s');
  const [vpn, setVpn] = useState(true);
  const c = vpn ? 'var(--ok)' : 'var(--bad)';
  return (
    <div>
      <Seg value={t} set={setT} label="Tip de VPN" items={[['s2s', 'Site-to-site'], ['ra', 'Remote access']]} />
      <Seg value={vpn ? 'on' : 'off'} set={(k) => setVpn(k === 'on')} label="VPN" items={[['on', 'VPN pornit'], ['off', 'Fără VPN']]} />
      <svg viewBox="0 0 720 240" role="img" aria-label={t === 's2s' ? 'VPN site-to-site între două routere peste Internet' : 'VPN remote access între un laptop și routerul sediului central peste Internet'}>
        {t === 's2s' ? (
          <g>
            <Box x={10} y={95} w={120} h={50} label="LAN filială" sub="192.168.1.0/24" />
            <RouterIcon x={190} y={120} label="R1" sub="198.51.100.1" />
            <Cloud x={360} y={120} label="Internet" />
            <RouterIcon x={530} y={120} label="R3" sub="203.0.113.2" />
            <Box x={590} y={95} w={120} h={50} label="LAN sediu" sub="192.168.3.0/24" />
            <Line x1={130} y1={120} x2={164} y2={120} /><Line x1={216} y1={120} x2={265} y2={120} />
            <Line x1={455} y1={120} x2={504} y2={120} /><Line x1={556} y1={120} x2={590} y2={120} />
            <rect x={206} y={104} width={330} height={32} rx={16} fill="none" stroke={c} strokeWidth={vpn ? 3 : 1.5} strokeDasharray={vpn ? undefined : '5 5'} />
            <T x={360} y={178} size={11.5} weight={700} color={c}>{vpn ? 'Tunel IPsec R1 ↔ R3: pachetele LAN-LAN sunt criptate' : 'Pachetele trec în clar prin Internet: pot fi citite și modificate'}</T>
            <T x={360} y={200} size={10.5} color="var(--muted)">Gazdele din LAN nu știu de VPN: gateway-urile îl fac transparent.</T>
          </g>
        ) : (
          <g>
            <ClientIcon x={80} y={120} label="Laptop" />
            <Cloud x={290} y={120} label="Internet" />
            <RouterIcon x={500} y={120} label="Gateway VPN" sub="firewall/router" />
            <Box x={590} y={95} w={120} h={50} label="Rețea corporativă" sub="10.0.0.0/16" />
            <Line x1={105} y1={120} x2={195} y2={120} /><Line x1={385} y1={120} x2={474} y2={120} /><Line x1={526} y1={120} x2={590} y2={120} />
            <rect x={110} y={104} width={400} height={32} rx={16} fill="none" stroke={c} strokeWidth={vpn ? 3 : 1.5} strokeDasharray={vpn ? undefined : '5 5'} />
            <T x={310} y={178} size={11.5} weight={700} color={c}>{vpn ? 'Client VPN (Secure Client) ↔ gateway: tunel TLS sau IPsec' : 'Fără VPN: utilizatorul nu poate folosi resursele interne în siguranță'}</T>
            <T x={360} y={200} size={10.5} color="var(--muted)">Clientul software creează tunelul; primește o adresă internă (pool) de la gateway.</T>
          </g>
        )}
      </svg>
      <div style={note(c)}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {t === 's2s'
            ? 'Site-to-site: legătură permanentă între două rețele; capetele sunt gateway-uri (routere, firewall-uri). Cel mai des IPsec (cu GRE sau VTI când trebuie rutare dinamică).'
            : 'Remote access: utilizator individual, conectare la cerere, cu client software (IPsec sau SSL/TLS) sau, la unele gateway-uri, clientless prin browser. Autentificare cu utilizator + parolă/MFA sau certificate.'}
        </div>
      </div>
    </div>
  );
}

/* 2) Pachet ESP: tunnel vs transport */
export function EspPacket() {
  const [mode, setMode] = useState<'tunnel' | 'transport'>('tunnel');
  const [proto, setProto] = useState<'esp' | 'ah'>('esp');
  type Blk = { l: string; w: number; c: string };
  const tunnel: Blk[] = proto === 'esp'
    ? [{ l: 'IP nou', w: 70, c: 'var(--info)' }, { l: 'ESP', w: 52, c: 'var(--violet)' }, { l: 'IP original', w: 80, c: 'var(--accent)' }, { l: 'TCP/UDP + date', w: 120, c: 'var(--accent)' }, { l: 'ESP trailer', w: 70, c: 'var(--violet)' }, { l: 'ESP auth', w: 66, c: 'var(--warn)' }]
    : [{ l: 'IP nou', w: 70, c: 'var(--info)' }, { l: 'AH', w: 52, c: 'var(--warn)' }, { l: 'IP original', w: 80, c: 'var(--accent)' }, { l: 'TCP/UDP + date', w: 120, c: 'var(--accent)' }];
  const transport: Blk[] = proto === 'esp'
    ? [{ l: 'IP original', w: 80, c: 'var(--accent)' }, { l: 'ESP', w: 52, c: 'var(--violet)' }, { l: 'TCP/UDP + date', w: 120, c: 'var(--accent)' }, { l: 'ESP trailer', w: 70, c: 'var(--violet)' }, { l: 'ESP auth', w: 66, c: 'var(--warn)' }]
    : [{ l: 'IP original', w: 80, c: 'var(--accent)' }, { l: 'AH', w: 52, c: 'var(--warn)' }, { l: 'TCP/UDP + date', w: 120, c: 'var(--accent)' }];
  const blocks = mode === 'tunnel' ? tunnel : transport;
  let x = 20;
  const placed = blocks.map((b) => { const r = { ...b, x }; x += b.w + 6; return r; });
  // zona criptată (ESP): de după antetul ESP până la trailer
  const encFrom = placed.findIndex((b) => b.l === 'IP original' && mode === 'tunnel') >= 0 ? placed.findIndex((b) => b.l === 'IP original' && mode === 'tunnel') : placed.findIndex((b) => b.l === 'TCP/UDP + date');
  const encTo = placed.findIndex((b) => b.l === 'ESP trailer');
  const total = x - 6;
  return (
    <div>
      <Seg value={mode} set={setMode} label="Mod" items={[['tunnel', 'Tunnel mode (site-to-site)'], ['transport', 'Transport mode (gazdă-gazdă)']]} />
      <Seg value={proto} set={setProto} label="Protocol" items={[['esp', 'ESP (proto 50)'], ['ah', 'AH (proto 51)']]} />
      <svg viewBox="0 0 720 150" role="img" aria-label="Structura unui pachet protejat cu IPsec în modul tunnel sau transport, cu ESP sau AH">
        {placed.map((b) => (
          <g key={b.l + b.x}>
            <rect x={b.x} y={50} width={b.w} height={40} rx={5} fill="var(--surface-3)" stroke={b.c} strokeWidth={1.6} />
            <T x={b.x + b.w / 2} y={74} size={10} weight={650} color={b.c}>{b.l}</T>
          </g>
        ))}
        {proto === 'esp' && encFrom >= 0 && encTo > encFrom && (
          <g>
            <line x1={placed[encFrom].x} y1={102} x2={placed[encTo].x + placed[encTo].w} y2={102} stroke="var(--ok)" strokeWidth={3} />
            <T x={(placed[encFrom].x + placed[encTo].x + placed[encTo].w) / 2} y={118} size={10.5} weight={700} color="var(--ok)">criptat (confidențialitate + integritate)</T>
          </g>
        )}
        <line x1={placed.length ? placed[1 < placed.length ? 1 : 0].x : 20} y1={38} x2={total + 4} y2={38} stroke="var(--warn)" strokeWidth={2} />
        <T x={Math.max(180, (total + 20) / 2)} y={30} size={10.5} weight={700} color="var(--warn)">{proto === 'esp' ? 'autentificat (ICV)' : 'autentificat, inclusiv antetul IP (câmpurile care nu se schimbă)'}</T>
      </svg>
      <div style={note('var(--info)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {mode === 'tunnel' ? 'Tunnel mode: pachetul IP original (inclusiv antetul lui) este încapsulat într-un pachet nou, cu adresele gateway-urilor. Ascunde adresele interne; folosit între routere/firewall-uri (site-to-site).' : 'Transport mode: se păstrează antetul IP original; se protejează doar datele (L4+). Folosit între două gazde care terminal tunelul (sau cu GRE/L2TP).'}
          {proto === 'ah' ? ' AH oferă doar integritate și autentificare (fără criptare) și include antetul IP în calculul de autentificare, deci NAT îl strică; de aceea, în practică, se folosește ESP.' : ''}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Dimensiunile blocurilor sunt didactice, nu proporționale cu octeții reali.</div>
      </div>
    </div>
  );
}

/* 3) Etapele unui VPN site-to-site */
const STAGES = [
  { k: '0', label: '0 Trafic de interes', t: 'Un pachet de la LAN-ul filialei spre LAN-ul sediului se potrivește cu ACL-ul „crypto”/politica VPN. Routerul R1 nu are încă un tunel, deci pornește negocierea.', a: 'R1 → (declanșează IKE)', m: '' },
  { k: '1', label: '1 IKE Phase 1', t: 'R1 și R3 negociază politica IKE (criptare, hash, DH, autentificare, durată), fac schimbul Diffie-Hellman și se autentifică (PSK sau certificate). Rezultat: un canal sigur de management — ISAKMP/IKE SA.', a: 'R1 ⇄ R3 · UDP 500 (sau 4500 cu NAT-T)', m: 'IKEv1: Main Mode (6 mesaje) sau Aggressive (3); IKEv2: IKE_SA_INIT + IKE_AUTH' },
  { k: '2', label: '2 IKE Phase 2', t: 'Prin canalul securizat, capetele negociază parametrii IPsec (ESP, algoritmi, ce trafic protejează, durată) și generează chei pentru date. Rezultat: IPsec SA (una pe sens).', a: 'R1 ⇄ R3 · în IKE SA', m: 'IKEv1: Quick Mode (3 mesaje); IKEv2: CREATE_CHILD_SA / în IKE_AUTH' },
  { k: '3', label: '3 Date protejate', t: 'Pachetele LAN–LAN sunt încapsulate în ESP (tunnel mode), criptate și autentificate; gateway-ul destinație le verifică, le decriptează și le livrează în LAN.', a: 'R1 → R3 · IP proto 50 (ESP) sau UDP 4500', m: '' },
  { k: '4', label: '4 Rekey / terminare', t: 'SA-urile au o durată (lifetime) sau un volum maxim; înainte de expirare se refac cheile. Dacă nu mai există trafic, tunelul poate expira și se reface la următorul pachet de interes.', a: 'R1 ⇄ R3', m: '' },
];

export function IkeStages() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  return (
    <div>
      <Seg value={s.k} set={(k) => setI(Number(k))} label="Etapa" items={STAGES.map((x) => [x.k, x.label] as [string, string])} />
      <svg viewBox="0 0 720 190" role="img" aria-label="Etapele unui VPN IPsec site-to-site: trafic de interes, IKE faza 1, faza 2, date, rekey">
        <RouterIcon x={120} y={80} label="R1" />
        <RouterIcon x={600} y={80} label="R3" />
        <Line x1={150} y1={80} x2={570} y2={80} c={i === 0 ? 'var(--border)' : 'var(--ok)'} w={i === 3 ? 4 : 2} dash={i === 0 ? '5 5' : undefined} flow={i === 3} />
        {(i === 1 || i === 2) && (
          <g>
            <T x={360} y={62} size={11} weight={700} color="var(--accent)">{i === 1 ? 'negociere IKE SA (DH + autentificare)' : 'negociere IPsec SA (în IKE SA)'}</T>
            <rect x={200} y={70} width={320} height={20} rx={10} fill="none" stroke="var(--accent)" strokeWidth={2} />
          </g>
        )}
        {i === 3 && <T x={360} y={62} size={11} weight={700} color="var(--ok)">ESP: date criptate</T>}
        {i === 0 && <T x={360} y={62} size={11} color="var(--muted)">niciun tunel încă</T>}
        <T x={360} y={140} size={11.5} color="var(--text-2)">{s.a}</T>
        {s.m && <T x={360} y={160} size={10.5} color="var(--muted)">{s.m}</T>}
      </svg>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{s.t}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="btn sm" disabled={i === 0} onClick={() => setI(i - 1)}>← Înapoi</button>
          <button type="button" className="btn sm" disabled={i === STAGES.length - 1} onClick={() => setI(i + 1)}>Înainte →</button>
        </div>
      </div>
    </div>
  );
}

/* 4) Split tunneling */
export function SplitTunnel() {
  const [split, setSplit] = useState(true);
  return (
    <div>
      <Seg value={split ? 'split' : 'full'} set={(k) => setSplit(k === 'split')} label="Mod tunel" items={[['split', 'Split tunnel'], ['full', 'Full tunnel']]} />
      <svg viewBox="0 0 720 230" role="img" aria-label="Split tunnel versus full tunnel pentru un client VPN">
        <ClientIcon x={80} y={115} label="Laptop VPN" />
        <Cloud x={330} y={115} label="Internet" />
        <RouterIcon x={560} y={60} label="Gateway VPN" />
        <Box x={540} y={150} w={160} h={40} label="Site extern" sub="video, SaaS public" c="var(--muted)" />
        <Box x={620} y={14} w={90} h={34} label="Rețea corp." c="var(--accent)" />
        <Line x1={105} y1={110} x2={235} y2={110} c="var(--ok)" w={3} />
        <Line x1={425} y1={100} x2={534} y2={64} c="var(--ok)" w={3} />
        <Line x1={586} y1={60} x2={620} y2={34} c="var(--ok)" w={3} />
        <T x={170} y={96} size={10} color="var(--ok)">trafic corporativ (tunel)</T>
        <Line x1={105} y1={125} x2={235} y2={135} c={split ? 'var(--info)' : 'var(--border)'} w={split ? 3 : 1.5} dash={split ? undefined : '5 5'} />
        <Line x1={425} y1={130} x2={540} y2={165} c={split ? 'var(--info)' : 'var(--border)'} w={split ? 3 : 1.5} dash={split ? undefined : '5 5'} />
        <T x={170} y={158} size={10} color={split ? 'var(--info)' : 'var(--muted)'}>{split ? 'trafic Internet direct' : 'nu direct'}</T>
        {!split && <Line x1={500} y1={90} x2={560} y2={150} c="var(--warn)" w={2.5} dash="4 3" />}
      </svg>
      <div style={note(split ? 'var(--info)' : 'var(--warn)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          {split ? 'Split tunnel: doar traficul către rețelele corporative intră în tunel; restul iese direct pe Internet. Economisește banda gateway-ului, dar traficul Internet al clientului nu trece prin firewall-ul companiei.' : 'Full tunnel: tot traficul clientului trece prin tunel și apoi iese prin infrastructura companiei, unde poate fi inspectat și filtrat. Consumă mai multă bandă și poate încetini accesul la Internet.'}
        </div>
      </div>
    </div>
  );
}

/* 5) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 250" role="img" aria-label={solo ? 'Topologie lab solo VPN: R1, R2 (ISP), R3 și două LAN-uri' : 'Topologie lab ghidat VPN: R1, R2 (ISP), R3 și două LAN-uri'}>
      <ClientIcon x={50} y={110} label="PC1" />
      <RouterIcon x={170} y={110} label="R1" sub="g0/1 198.51.100.1" />
      <RouterIcon x={380} y={110} label="R2 (ISP)" sub="doar rutare" />
      <RouterIcon x={590} y={110} label="R3" sub="g0/1 203.0.113.2" />
      <ClientIcon x={710} y={110} label="PC3" />
      <Line x1={74} y1={110} x2={144} y2={110} /><Line x1={196} y1={110} x2={354} y2={110} /><Line x1={406} y1={110} x2={564} y2={110} /><Line x1={616} y1={110} x2={686} y2={110} />
      <T x={110} y={150} size={10} color="var(--muted)" m>192.168.1.0/24</T>
      <T x={650} y={150} size={10} color="var(--muted)" m>192.168.3.0/24</T>
      <rect x={196} y={96} width={370} height={28} rx={14} fill="none" stroke="var(--ok)" strokeWidth={2.5} strokeDasharray="6 4" />
      <T x={380} y={192} size={10.5} color="var(--muted)">{solo ? 'Tunelul IPsec R1 ↔ R3 nu se ridică: găsește defectul' : 'Tunel IPsec R1 ↔ R3 peste „Internetul” simulat de R2'}</T>
    </svg>
  );
}
export const LabGuidedTopology55 = () => <Topo solo={false} />;
export const LabSoloTopology55 = () => <Topo solo />;
