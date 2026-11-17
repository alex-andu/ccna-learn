import { useState, type CSSProperties } from 'react';
import { APIcon, ClientIcon, RouterIcon, SwitchIcon } from './wlan';
import { Box, Line, Seg, T } from './l2kit';

/* Diagrame originale pentru 5.10 (WLAN în GUI cu WPA2-PSK). Culori doar prin var(--…). */

const note = (c: string): CSSProperties => ({ border: '1px solid ' + c, borderRadius: 8, padding: '10px 14px', background: 'var(--surface-2)', marginTop: 8 });
const mono: CSSProperties = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };
const inp: CSSProperties = { background: 'var(--surface-3)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: 13 };
const lbl: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12, color: 'var(--text-2)', minWidth: 150 };

/* Validarea parolei WPA2-PSK */
export function checkPsk(fmt: 'ascii' | 'hex', v: string): string | null {
  if (fmt === 'ascii') {
    if (v.length < 8) return 'Prea scurtă: minimum 8 caractere ASCII.';
    if (v.length > 63) return 'Prea lungă: maximum 63 de caractere ASCII.';
    if (!/^[\x20-\x7e]+$/.test(v)) return 'Conține caractere non-ASCII (diacritice, emoji): nu sunt acceptate la PSK ASCII.';
    return null;
  }
  if (!/^[0-9a-fA-F]+$/.test(v)) return 'Format HEX: doar cifre 0–9 și litere a–f.';
  if (v.length !== 64) return 'HEX cere exact 64 de cifre (acum ' + v.length + ').';
  return null;
}

/* 1) Formular WLAN + client */
type ClientSec = 'wpa2' | 'wpa-tkip' | 'wpa3';
export function WlanFormBuilder() {
  const [profile, setProfile] = useState('CORP-LAB');
  const [ssid, setSsid] = useState('CORP');
  const [enabled, setEnabled] = useState(true);
  const [iface, setIface] = useState('employee');
  const [l2, setL2] = useState<'none' | 'wpa'>('wpa');
  const [wpa2, setWpa2] = useState(true);
  const [aes, setAes] = useState(true);
  const [tkip, setTkip] = useState(false);
  const [akm, setAkm] = useState<'psk' | '8021x'>('psk');
  const [fmt, setFmt] = useState<'ascii' | 'hex'>('ascii');
  const [pw, setPw] = useState('Fraza-Lunga-2026');
  const [cSec, setCSec] = useState<ClientSec>('wpa2');
  const [cPw, setCPw] = useState('Fraza-Lunga-2026');

  const pskErr = akm === 'psk' ? checkPsk(fmt, pw) : null;
  const ssidErr = ssid.length < 1 || ssid.length > 32 ? 'SSID: 1–32 de caractere.' : null;
  const warns: string[] = [];
  if (tkip) warns.push('TKIP este depreciat: dacă îl lași activ, un client vechi poate trage securitatea în jos („mixed mode”).');
  if (iface === 'management') warns.push('Interfața „management” nu e recomandată pentru clienți: separă traficul de utilizatori de cel de administrare.');
  if (l2 === 'wpa' && wpa2 && akm === 'psk' && pw.length > 0 && pw.length < 14 && !pskErr) warns.push('Parola e validă, dar scurtă: pentru PSK alege 14+ caractere (risc de dicționar offline).');

  // Rezultatul testului clientului
  let verdict: { ok: boolean; t: string };
  if (!enabled) verdict = { ok: false, t: 'WLAN-ul este Disabled: SSID-ul nu este difuzat, clientul nu îl vede.' };
  else if (ssidErr) verdict = { ok: false, t: ssidErr };
  else if (l2 === 'none') verdict = { ok: true, t: 'Rețea deschisă: clientul se conectează fără parolă — fără autentificare și fără criptare!' };
  else if (!wpa2 && cSec === 'wpa2') verdict = { ok: false, t: 'Politica WPA2 nu este activată pe WLAN: clientul WPA2 nu găsește o combinație comună.' };
  else if (cSec === 'wpa3') verdict = { ok: false, t: 'Clientul cere WPA3 (SAE), iar WLAN-ul oferă doar WPA2-PSK: nu există AKM comun. Soluție: WPA3/transition mode pe WLAN sau client în WPA2.' };
  else if (cSec === 'wpa-tkip') verdict = { ok: false, t: 'Clientul folosește WPA (TKIP), iar WLAN-ul are doar WPA2: generație diferită. (Activarea WPA/TKIP ar „repara”, dar slăbește rețeaua.)' };
  else if (!aes) verdict = { ok: false, t: 'Clientul WPA2 folosește AES (CCMP), dar cifrul AES nu este activat pe WLAN.' };
  else if (akm !== 'psk') verdict = { ok: false, t: 'WLAN-ul folosește 802.1X (AKM), nu PSK: clientul Personal nu poate cere parolă. Alege PSK sau configurează EAP pe client.' };
  else if (pskErr) verdict = { ok: false, t: 'Parola din WLAN este invalidă (' + pskErr + ').' };
  else if (cPw !== pw) verdict = { ok: false, t: 'Parole diferite (se țin cont de litere mari/mici): 4-way handshake eșuează la mesajul 2 (MIC nepotrivit). Clientul vede „nu se poate conecta”.' };
  else verdict = { ok: true, t: 'Conectat: aceeași securitate (WPA2-PSK/AES), aceeași parolă. Clientul primește IP din VLAN-ul interfeței „' + iface + '”.' };

  const cli = [
    `(Cisco Controller) > config wlan create 1 ${profile || '<profil>'} ${ssid || '<ssid>'}`,
    `(Cisco Controller) > config wlan interface 1 ${iface}`,
    ...(l2 === 'wpa'
      ? [
          '(Cisco Controller) > config wlan security wpa enable 1',
          `(Cisco Controller) > config wlan security wpa wpa2 ${wpa2 ? 'enable' : 'disable'} 1`,
          `(Cisco Controller) > config wlan security wpa wpa2 ciphers aes ${aes ? 'enable' : 'disable'} 1`,
          `(Cisco Controller) > config wlan security wpa wpa2 ciphers tkip ${tkip ? 'enable' : 'disable'} 1`,
          ...(akm === 'psk'
            ? ['(Cisco Controller) > config wlan security wpa akm 802.1x disable 1', '(Cisco Controller) > config wlan security wpa akm psk enable 1', `(Cisco Controller) > config wlan security wpa akm psk set-key ${fmt} ${pw || '<parola>'} 1`]
            : ['(Cisco Controller) > config wlan security wpa akm psk disable 1', '(Cisco Controller) > config wlan security wpa akm 802.1x enable 1']),
        ]
      : ['(Cisco Controller) > config wlan security wpa disable 1']),
    `(Cisco Controller) > config wlan ${enabled ? 'enable' : 'disable'} 1`,
  ];

  return (
    <div>
      <div style={{ ...note('var(--border)'), marginTop: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>WLANs → Create New / Edit (ilustrativ, stil AireOS)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <label style={lbl}>Profile Name<input style={inp} value={profile} onChange={(e) => setProfile(e.target.value)} aria-label="Profile Name" /></label>
          <label style={lbl}>SSID<input style={inp} value={ssid} onChange={(e) => setSsid(e.target.value)} aria-label="SSID" /></label>
          <label style={lbl}>Status<select style={inp} value={enabled ? 'on' : 'off'} onChange={(e) => setEnabled(e.target.value === 'on')} aria-label="Status"><option value="on">Enabled</option><option value="off">Disabled</option></select></label>
          <label style={lbl}>Interface/Interface Group<select style={inp} value={iface} onChange={(e) => setIface(e.target.value)} aria-label="Interface"><option value="employee">employee (VLAN 10)</option><option value="guest">guest (VLAN 30)</option><option value="management">management</option></select></label>
          <label style={lbl}>Layer 2 Security<select style={inp} value={l2} onChange={(e) => setL2(e.target.value as 'none' | 'wpa')} aria-label="Layer 2 Security"><option value="wpa">WPA + WPA2</option><option value="none">None</option></select></label>
        </div>
        {l2 === 'wpa' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 10, alignItems: 'flex-end' }}>
            <label style={{ fontSize: 13 }}><input type="checkbox" checked={wpa2} onChange={(e) => setWpa2(e.target.checked)} /> WPA2 Policy</label>
            <label style={{ fontSize: 13 }}><input type="checkbox" checked={aes} onChange={(e) => setAes(e.target.checked)} /> WPA2 Encryption: AES</label>
            <label style={{ fontSize: 13 }}><input type="checkbox" checked={tkip} onChange={(e) => setTkip(e.target.checked)} /> TKIP</label>
            <label style={lbl}>Auth Key Mgmt<select style={inp} value={akm} onChange={(e) => setAkm(e.target.value as 'psk' | '8021x')} aria-label="Auth Key Mgmt"><option value="psk">PSK</option><option value="8021x">802.1X</option></select></label>
            {akm === 'psk' && (
              <>
                <label style={lbl}>PSK Format<select style={inp} value={fmt} onChange={(e) => setFmt(e.target.value as 'ascii' | 'hex')} aria-label="PSK Format"><option value="ascii">ASCII</option><option value="hex">HEX</option></select></label>
                <label style={lbl}>Parola (PSK)<input style={{ ...inp, ...mono }} value={pw} onChange={(e) => setPw(e.target.value)} aria-label="Parola PSK" /></label>
              </>
            )}
          </div>
        )}
        {pskErr && l2 === 'wpa' && <div style={{ color: 'var(--bad)', fontSize: 12.5, marginTop: 6 }}>⚠ {pskErr}</div>}
        {ssidErr && <div style={{ color: 'var(--bad)', fontSize: 12.5, marginTop: 6 }}>⚠ {ssidErr}</div>}
      </div>

      <div style={note('var(--info)')}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Clientul care încearcă să se conecteze</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <label style={lbl}>Securitate configurată pe client<select style={inp} value={cSec} onChange={(e) => setCSec(e.target.value as ClientSec)} aria-label="Securitatea clientului"><option value="wpa2">WPA2-Personal (AES)</option><option value="wpa-tkip">WPA (TKIP)</option><option value="wpa3">WPA3-Personal (SAE)</option></select></label>
          <label style={lbl}>Parola introdusă<input style={{ ...inp, ...mono }} value={cPw} onChange={(e) => setCPw(e.target.value)} aria-label="Parola clientului" /></label>
        </div>
      </div>

      <div style={note(verdict.ok ? 'var(--ok)' : 'var(--bad)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b style={{ color: verdict.ok ? 'var(--ok)' : 'var(--bad)' }}>{verdict.ok ? '✓ Rezultat' : '✗ Rezultat'}:</b> {verdict.t}</div>
        {warns.map((w) => <div key={w} style={{ fontSize: 12.5, color: 'var(--warn)', marginTop: 6 }}>• {w}</div>)}
      </div>

      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: 'pointer', fontSize: 13 }}>Echivalentul în CLI AireOS (generat, ilustrativ)</summary>
        <pre style={{ ...mono, fontSize: 12, background: 'var(--code-bg)', padding: 10, borderRadius: 8, overflowX: 'auto', margin: '6px 0 0' }}>{cli.join('\n')}</pre>
      </details>
    </div>
  );
}

/* 2) Diagnosticator de simptome */
type Sym = 'novis' | 'wrongpw' | 'noip' | 'cantsee' | 'slow' | 'wrongnet';
const SYM: Record<Sym, { label: string; cause: string; where: string; fix: string }> = {
  novis: { label: 'Clientul nu vede SSID-ul', cause: 'WLAN-ul este Disabled; AP-ul nu este alăturat sau nu are WLAN-ul pe tag/radio activ; SSID-ul este ascuns; clientul e pe altă bandă.', where: 'WLANs → Status; Wireless → Access Points; (9800) Policy/Site tag.', fix: 'Enable pe WLAN, verifică AP-ul în „All APs” și că radio 2,4/5 GHz sunt active.' },
  wrongpw: { label: 'Clientul vede SSID-ul, dar „nu se poate conecta”/cere parola din nou', cause: 'Parolă diferită (litere mari/mici!), tip de securitate diferit (WPA vs WPA2, AES vs TKIP), WPA3-only vs WPA2 pe client.', where: 'Layer 2 Security: WPA2 Policy, AES, AKM = PSK; parola.', fix: 'Reintrodu parola identic; potrivește securitatea clientului cu WLAN-ul; verifică AES.' },
  noip: { label: 'Se conectează, dar primește 169.254.x.x (APIPA)', cause: 'Interfața/VLAN-ul WLAN-ului nu are DHCP funcțional: interfața dinamică fără server DHCP, VLAN nepermis pe trunk-ul switch-ului spre WLC/AP.', where: 'Controller → Interfaces (DHCP server); switch: trunk allowed vlan.', fix: 'Setează DHCP server pe interfață, permite VLAN-ul pe trunk, verifică pool-ul DHCP.' },
  cantsee: { label: 'Are IP, dar nu ajunge la resurse interne', cause: 'WLAN mapat pe interfața greșită (alt VLAN), lipsă rutare/gateway, ACL, politici AAA override.', where: 'WLANs → General → Interface; rutare inter-VLAN; ACL.', fix: 'Mapează WLAN-ul pe interfața corectă; verifică gateway-ul și rutarea.' },
  slow: { label: 'Se conectează, dar e lent / se deconectează', cause: 'Interferențe, semnal slab, profil QoS greșit, client lipsit de suport pentru bandă, TKIP activat (limitează viteza).', where: 'Monitor → clients (RSSI/SNR); QoS; cifruri.', fix: 'Verifică RSSI/SNR, elimină TKIP, ajustează canalele/puterea, folosește banda de 5 GHz.' },
  wrongnet: { label: 'Clientul se conectează la o rețea cu același nume, dar fără parolă', cause: 'Evil twin sau rogue AP; clientul s-a conectat automat la un SSID deschis salvat.', where: 'Monitor → Rogues; BSSID-ul clientului.', fix: 'Șterge rețeaua salvată, verifică BSSID-ul, activează detecția rogue, folosește WPA2/WPA3 cu validarea certificatului unde se poate.' },
};
export function SymptomDiagnoser() {
  const [s, setS] = useState<Sym>('wrongpw');
  const d = SYM[s];
  return (
    <div>
      <Seg value={s} set={setS} label="Simptom" items={(Object.keys(SYM) as Sym[]).map((k) => [k, SYM[k].label.split(',')[0].slice(0, 44)] as [Sym, string])} />
      <div style={note('var(--warn)')}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>Simptom:</b> {d.label}.</div></div>
      <div style={note('var(--bad)')}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>Cauze probabile:</b> {d.cause}</div></div>
      <div style={note('var(--info)')}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>Unde verifici:</b> {d.where}</div></div>
      <div style={note('var(--ok)')}><div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>Remediere:</b> {d.fix}</div></div>
    </div>
  );
}

/* 3) Pipeline: de la GUI la client */
const PIPE = [
  { k: '1', t: 'Pregătești interfața', d: 'Interfața dinamică „employee” (VLAN 10) cu IP, gateway și server DHCP. Fără ea, WLAN-ul nu are unde să-și pună clienții.' },
  { k: '2', t: 'Creezi WLAN-ul', d: 'WLANs → Create New: tip WLAN, Profile Name, SSID, ID; apoi Apply.' },
  { k: '3', t: 'General', d: 'Status (Enabled), Radio Policy (All sau doar 5 GHz), Interface/Interface Group (employee), Broadcast SSID.' },
  { k: '4', t: 'Security → Layer 2', d: 'Layer 2 Security: WPA+WPA2; WPA2 Policy + AES; Auth Key Mgmt: PSK; PSK Format ASCII; parola (8–63).' },
  { k: '5', t: 'Apply + verificare', d: 'Apply; verifici lista WLANs (Status Enabled, Security „[WPA2][Auth(PSK)]”). Pe CLI: show wlan 1.' },
  { k: '6', t: 'Conectezi clientul', d: 'Clientul alege SSID-ul, introduce parola; 4-way handshake; DHCP; apare în Monitor → Clients.' },
];
export function WlanPipeline() {
  const [i, setI] = useState(0);
  const s = PIPE[i];
  return (
    <div>
      <Seg value={String(i)} set={(k) => setI(Number(k))} label="Pas" items={PIPE.map((x, n) => [String(n), x.k + ' · ' + x.t] as [string, string])} />
      <svg viewBox="0 0 720 150" role="img" aria-label="Fluxul de la crearea WLAN-ului în GUI până la conectarea clientului">
        <ClientIcon x={80} y={70} label="Client" kind="laptop" />
        <APIcon x={250} y={70} label="AP" />
        <SwitchIcon x={410} y={70} label="Switch" />
        <RouterIcon x={560} y={70} label="WLC" />
        <Box x={620} y={30} w={90} h={40} label="GUI (HTTPS)" c={i < 5 ? 'var(--accent)' : 'var(--border)'} />
        <Line x1={106} y1={70} x2={224} y2={70} c={i === 5 ? 'var(--ok)' : 'var(--border)'} w={i === 5 ? 4 : 1.5} flow={i === 5} />
        <Line x1={276} y1={70} x2={384} y2={70} c="var(--border)" w={1.5} dash="4 4" /><Line x1={436} y1={70} x2={534} y2={70} c="var(--border)" w={1.5} dash="4 4" />
        <T x={360} y={130} size={11.5} weight={700} color="var(--accent)">{s.t}</T>
      </svg>
      <div style={note('var(--accent)')}>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}><b>{s.k}. {s.t}.</b> {s.d}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="btn sm" disabled={i === 0} onClick={() => setI(i - 1)}>← Înapoi</button>
          <button type="button" className="btn sm" disabled={i === PIPE.length - 1} onClick={() => setI(i + 1)}>Înainte →</button>
        </div>
      </div>
    </div>
  );
}

/* 4) Topologii lab */
function Topo({ solo }: { solo: boolean }) {
  return (
    <svg viewBox="0 0 760 250" role="img" aria-label={solo ? 'Topologie lab solo: WLC, AP, switch și două laptopuri' : 'Topologie lab ghidat: WLC, AP, switch, laptop și server DHCP'}>
      <RouterIcon x={90} y={120} label="WLC" sub="192.168.100.10" />
      <SwitchIcon x={260} y={120} label="SW1" />
      <APIcon x={430} y={60} label="LAP1" />
      <Box x={410} y={150} w={120} h={44} label="Router/DHCP" sub="10.10.10.1" />
      <ClientIcon x={640} y={60} label="Laptop-1" kind="laptop" />
      {solo && <ClientIcon x={640} y={170} label="Laptop-2" kind="laptop" />}
      <Line x1={116} y1={120} x2={234} y2={120} /><Line x1={286} y1={116} x2={404} y2={64} /><Line x1={286} y1={126} x2={410} y2={172} />
      <Line x1={456} y1={60} x2={614} y2={60} c="var(--info)" dash="5 4" />
      {solo && <Line x1={456} y1={64} x2={614} y2={166} c="var(--info)" dash="5 4" />}
      <T x={380} y={230} size={11} color="var(--muted)">{solo ? 'WLAN-ul configurat de un coleg nu primește clienți: află de ce' : 'WLAN CORP: WPA2-PSK, AES, interfață employee (VLAN 10)'}</T>
    </svg>
  );
}
export const LabGuidedTopology510 = () => <Topo solo={false} />;
export const LabSoloTopology510 = () => <Topo solo />;
