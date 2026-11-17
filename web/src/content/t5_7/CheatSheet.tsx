import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.7. */
export function CheatSheet57() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Atac → apărare</h3>
          <Table head={['Atac', 'Funcție']} rows={[
            ['MAC flooding / dispozitiv neautorizat', 'port security'],
            ['Server DHCP fals', 'DHCP snooping'],
            ['DHCP starvation', 'port security + rate limit'],
            ['ARP spoofing', 'DAI (+ binding table)'],
          ]} />
        </div>
        <div className="card"><h3>Port security — implicit</h3>
          <ul className="small">
            <li>Maximum <b>1</b> adresă · violation <b>shutdown</b></li>
            <li>Port <b>static</b> (access/trunk), nu dynamic</li>
            <li>protect: fără notificare · restrict: log + contor · shutdown: err-disabled</li>
            <li>Sticky → running-config (salvează!)</li>
            <li>Recuperare: <code>shutdown</code> / <code>no shutdown</code> sau errdisable recovery</li>
          </ul>
        </div>
        <div className="card"><h3>DHCP snooping</h3>
          <ul className="small">
            <li>Toate porturile <b>untrusted</b> implicit</li>
            <li>Untrusted: aruncă OFFER/ACK/NAK</li>
            <li>Trust: uplink, server DHCP, relay</li>
            <li>Creează <b>binding table</b> (MAC–IP–VLAN–port–lease)</li>
            <li><code>ip dhcp snooping limit rate N</code></li>
          </ul>
        </div>
        <div className="card"><h3>DAI</h3>
          <ul className="small">
            <li>Compară ARP (IP–MAC) cu binding table</li>
            <li>Untrusted: inspectat · Trusted: neinspectat</li>
            <li>IP static → ARP ACL sau trusted</li>
            <li><code>validate src-mac dst-mac ip</code></li>
            <li>Rată implicită pe untrusted (de obicei 15 pps)</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small">
            <li><code>switchport port-security [maximum N | violation … | mac-address sticky]</code></li>
            <li><code>ip dhcp snooping</code> · <code>… vlan 10</code> · <code>ip dhcp snooping trust</code></li>
            <li><code>ip arp inspection vlan 10</code> · <code>ip arp inspection trust</code></li>
          </ul>
        </div>
        <div className="card"><h3>Verificare și ordine</h3>
          <ul className="small">
            <li><code>show port-security [interface …]</code> · <code>… address</code></li>
            <li><code>show interfaces status err-disabled</code></li>
            <li><code>show ip dhcp snooping [binding]</code></li>
            <li><code>show ip arp inspection [vlan 10]</code></li>
            <li>Ordine: trust → snooping → binding → DAI → port security</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
