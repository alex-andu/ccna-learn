import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.1 (o pagină A4, două coloane la print). */
export function CheatSheet11() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Componente și nivel OSI</h3>
          <Table head={['Componentă', 'Nivel', 'Decide după']} rows={[
            ['Hub (istoric)', 'L1', 'nimic — repetă biții'], ['Switch L2 / AP', 'L2', 'MAC destinație'],
            ['Router / switch L3', 'L3', 'IP destinație (longest prefix)'], ['Firewall stateful', 'L3–L4', '5-tuple + starea conexiunii'],
            ['NGFW / IPS', 'L3–L7', '+ aplicație, user, semnături, URL'], ['Endpoint / server', 'L1–L7', 'rulează aplicații'],
          ]} />
        </div>
        <div className="card"><h3>Switch vs router</h3>
          <ul className="small">
            <li>Switch: <b>learn</b> (MAC sursă) → <b>forward/filter</b> (MAC dest.) → <b>flood</b> (necunoscut, broadcast).</li>
            <li>Aging implicit 300 s. Fiecare port = domeniu de coliziune; VLAN = domeniu de broadcast.</li>
            <li>Router: fiecare interfață = domeniu de broadcast; nu propagă broadcast-uri.</li>
            <li>Router: longest prefix → AD → metrică; TTL − 1; cadru L2 nou.</li>
            <li><b>IP-urile rămân, MAC-urile se schimbă</b> la fiecare hop (fără NAT).</li>
            <li>Switch L3: <code>ip routing</code>, SVI (<code>interface vlan X</code>), routed port (<code>no switchport</code>).</li>
            <li>CEF = FIB + adjacency table; TCAM = căutare cu mască în hardware.</li>
          </ul>
        </div>
        <div className="card"><h3>Securitate</h3>
          <ul className="small">
            <li>Packet filter (ACL, stateless) → stateful (tabelă de stare) → NGFW (AVC, IPS, malware, URL, identitate, TLS).</li>
            <li>Zone: inside / DMZ (servere publice) / outside.</li>
            <li><b>IDS</b>: copie (SPAN/TAP), doar alertă · <b>IPS</b>: inline, blochează.</li>
            <li>Semnături (atacuri cunoscute) vs anomalii (zero-day, mai multe false pozitive).</li>
            <li>Talos = threat intelligence Cisco. NGFW Cisco = Secure Firewall (FTD).</li>
          </ul>
        </div>
        <div className="card"><h3>Wireless și controllere</h3>
          <ul className="small">
            <li>AP = bridge L2 802.11 ↔ 802.3; autonom (singur, trunk) vs lightweight (are nevoie de WLC).</li>
            <li>WLC: config, RRM, roaming, auth. CAPWAP UDP 5246 control (DTLS) / 5247 date.</li>
            <li>Catalyst Center = fost DNA Center (2023): Design · Policy · Provision · Assurance.</li>
            <li>Catalyst Center NU transportă trafic de utilizator; REST northbound, NETCONF/CLI/SNMP southbound.</li>
          </ul>
        </div>
        <div className="card"><h3>PoE</h3>
          <Table head={['Std', 'Nume', 'PSE', 'PD', 'Perechi']} rows={[
            ['802.3af', 'PoE (Type 1)', '15.4 W', '12.95 W', '2'], ['802.3at', 'PoE+ (Type 2)', '30 W', '25.5 W', '2'],
            ['802.3bt', 'Type 3', '60 W', '51 W', '4'], ['802.3bt', 'Type 4', '90 W', '71.3 W', '4'],
            ['UPOE', 'Cisco', '60 W', '51 W', '4'], ['UPOE+', 'Cisco = bt T4', '90 W', '71.3 W', '4'],
          ]} />
          <p className="small">PSE = switch/injector · PD = AP/telefon/cameră. Detection (≈25 kΩ) → Classification → Power-up → CDP/LLDP → MPS. Max 100 m.</p>
        </div>
        <div className="card"><h3>Comenzi utile</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>show ip route · show ip cef · show ip interface brief</li>
            <li>show mac address-table [aging-time]</li>
            <li>show cdp neighbors [detail] · lldp run · show lldp neighbors</li>
            <li>show power inline [int detail]</li>
            <li>power inline auto | never | static max 30000 | police</li>
            <li>ip routing · interface vlan 10 · no switchport</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
