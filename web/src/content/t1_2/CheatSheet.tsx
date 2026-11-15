import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.2 (o pagină A4, două coloane la print). */
export function CheatSheet12() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Straturile campusului</h3>
          <Table head={['Strat', 'Rol', 'Funcții']} rows={[
            ['Access', 'dispozitive finale', 'PoE, VLAN/port, port security, 802.1X, QoS marking'],
            ['Distribution', 'agregare', 'granița L2/L3, SVI + FHRP, ACL, QoS, sumarizare'],
            ['Core', 'transport între blocuri', 'L3 rapid, redundant, FĂRĂ politici/dispozitive finale'],
          ]} />
          <ul className="small">
            <li><b>Two-tier = collapsed core</b> (core + distribution în aceleași switch-uri): o clădire / un bloc.</li>
            <li><b>Three-tier</b>: multe blocuri → legăturile cresc liniar (fără core: ≈ pătratic).</li>
          </ul>
        </div>
        <div className="card"><h3>Spine-leaf (datacenter)</h3>
          <ul className="small">
            <li>Fiecare <b>leaf ↔ fiecare spine</b>. Leaf ↔ leaf: NU. Spine ↔ spine: NU.</li>
            <li>Servere, storage, firewall, border → <b>leaf</b>. Nimic pe spine.</li>
            <li>Orice leaf → alt leaf = <b>leaf → spine → leaf</b> (3 switch-uri, mereu).</li>
            <li>Legături <b>L3 + ECMP</b>: toate active, căi egale = nr. de spine-uri; fără STP pe fabric.</li>
            <li>+ bandă → adaugi <b>spine</b>; + porturi → adaugi <b>leaf</b>. Cabluri = spine × leaf.</li>
            <li>Optimizat pentru <b>east-west</b> (server ↔ server). North-south = client ↔ DC.</li>
            <li>Oversubscription = jos : sus. 48×1G / 2×10G = 2.4:1 · 48×25G / 8×100G = 1.5:1 · 1:1 = non-blocking.</li>
          </ul>
        </div>
        <div className="card"><h3>Topologii WAN</h3>
          <Table head={['Formă', 'Legături (n site-uri)', 'Notă']} rows={[
            ['Point-to-point', '1 (2 site-uri)', 'leased line, E-Line'],
            ['Hub-and-spoke', 'n − 1', 'spoke ↔ spoke prin hub; hub = SPOF'],
            ['Full mesh', 'n(n−1)/2', '5 → 10 · 6 → 15'],
            ['Partial mesh', 'între', 'compromis'],
          ]} />
          <ul className="small">
            <li>Single-homed: 1 legătură, 1 ISP · Dual-homed: 2 legături, același ISP · Multihomed: 2 ISP · Dual-multihomed: 2+2.</li>
          </ul>
        </div>
        <div className="card"><h3>Servicii WAN</h3>
          <ul className="small">
            <li><b>Leased line</b>: P2P dedicat, HDLC/PPP, E1 = 2.048 Mbps, T1 = 1.544 Mbps.</li>
            <li><b>MPLS L3VPN</b>: CE (client) ↔ PE (provider) ↔ P; any-to-any, QoS; clientul vede doar PE.</li>
            <li><b>Metro Ethernet</b>: handoff Ethernet; E-Line = P2P · E-LAN = any-to-any · E-Tree = hub-and-spoke.</li>
            <li><b>Internet VPN</b>: IPsec site-to-site / remote-access; ieftin, criptat, fără QoS garantat.</li>
            <li><b>SD-WAN</b>: controller + mai multe transporturi, alegere de cale per aplicație (concept).</li>
          </ul>
        </div>
        <div className="card"><h3>SOHO</h3>
          <ul className="small">
            <li>Un dispozitiv: <b>router + NAT/PAT + firewall + switch + AP + DHCP/DNS</b> (+ modem/ONT).</li>
            <li>WAN: adresă de la ISP (DHCP/PPPoE); LAN: 192.168.x.0/24 privat.</li>
            <li>Cisco: <code>ip address dhcp</code> pe WAN, <code>ip nat inside source list 1 interface … overload</code>.</li>
          </ul>
        </div>
        <div className="card"><h3>Cloud (NIST SP 800-145)</h3>
          <ul className="small">
            <li><b>5 caracteristici:</b> on-demand self-service · broad network access · resource pooling · rapid elasticity · measured service.</li>
            <li><b>IaaS</b>: tu de la OS în sus (EC2) · <b>PaaS</b>: tu doar app + date (App Engine) · <b>SaaS</b>: tu doar date/utilizatori (M365).</li>
            <li><b>Public</b> · <b>Private</b> (o organizație, on-prem SAU găzduit) · <b>Community</b> · <b>Hybrid</b> (≥ 2 clouduri legate).</li>
            <li>On-prem = CapEx, control total · Cloud = OpEx, elasticitate. Acces: Internet, VPN, interconectare dedicată.</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi utile (descoperire topologie)</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>show cdp neighbors [detail]</li><li>lldp run · show lldp neighbors</li><li>show spanning-tree (Altn BLK)</li>
            <li>ip routing · no switchport (port routed)</li><li>show ip route (ECMP = mai multe next-hop)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
