import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.1. */
export function CheatSheet51() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>CIA</h3>
          <Table head={['Literă', 'Sens']} rows={[
            ['C', 'Confidentiality — doar cei autorizați citesc'],
            ['I', 'Integrity — datele nu sunt alterate'],
            ['A', 'Availability — serviciul funcționează'],
          ]} />
        </div>
        <div className="card"><h3>Vocabular</h3>
          <ul className="small">
            <li><b>Asset</b> — ce protejăm</li>
            <li><b>Vulnerability</b> — slăbiciune</li>
            <li><b>Threat</b> — cine/ce poate face rău</li>
            <li><b>Exploit</b> — metoda care folosește slăbiciunea</li>
            <li><b>Risk</b> — probabilitate × impact</li>
            <li><b>Mitigation</b> — reduce riscul</li>
          </ul>
        </div>
        <div className="card"><h3>Atacuri</h3>
          <ul className="small">
            <li>Virus (necesită acțiune) · Worm (singur) · Trojan · Ransomware</li>
            <li>Phishing · spear · whaling · vishing · smishing</li>
            <li>DoS/DDoS (botnet) · reflecție · amplificare</li>
            <li>MITM · reconnaissance · spoofing</li>
            <li>Parole: brute force, dictionary, spraying, stuffing</li>
          </ul>
        </div>
        <div className="card"><h3>Mitigare</h3>
          <ul className="small">
            <li>Defense in depth (mai multe straturi)</li>
            <li>Least privilege · segmentare · patch</li>
            <li>Criptare · MFA · AAA · log-uri · backup</li>
            <li>Preventive / detective / corective</li>
          </ul>
        </div>
        <div className="card"><h3>Hardening IOS</h3>
          <ul className="small">
            <li><code>no ip http server</code></li>
            <li><code>transport input ssh</code></li>
            <li><code>shutdown</code> pe porturi libere</li>
            <li><code>no cdp enable</code> pe porturi spre utilizatori</li>
            <li><code>logging host</code> · <code>exec-timeout</code></li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>Threat ≠ vulnerability ≠ exploit</li>
            <li>Zero-day = fără patch încă</li>
            <li>DoS lovește disponibilitatea</li>
            <li>Firewall-ul nu oprește phishing-ul</li>
            <li>Backup offline contra ransomware</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
