import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 4.6. */
export function CheatSheet46() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Router ca client</h3>
          <ul className="small">
            <li><code>interface g0/0</code> → <code>ip address dhcp</code> → <code>no shutdown</code></li>
            <li>Primește IP, mască, gateway (rută implicită cu AD mare), DNS, lease</li>
            <li><code>show ip interface brief</code> → Method = DHCP</li>
          </ul>
        </div>
        <div className="card"><h3>Relay</h3>
          <ul className="small">
            <li><code>ip helper-address &lt;server&gt;</code> pe interfața <b>dinspre clienți</b></li>
            <li>Broadcast → unicast către server</li>
            <li><code>giaddr</code> = IP-ul interfeței relay; selectează pool-ul și destinația răspunsului</li>
            <li>UDP 67 (server) / 68 (client)</li>
          </ul>
        </div>
        <div className="card"><h3>Serverul trebuie să aibă</h3>
          <Table head={['Cerință', 'Detaliu']} rows={[
            ['Pool', 'Conține giaddr (subrețeaua clienților)'],
            ['Rută', 'Spre subrețeaua din giaddr'],
            ['Excluderi', 'Pe server (ip dhcp excluded-address)'],
          ]} />
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li><code>show ip interface &lt;if&gt;</code> → „Helper address is …”</li>
            <li><code>show ip dhcp binding</code> (server)</li>
            <li><code>show ip dhcp pool</code> · <code>show ip dhcp conflict</code></li>
            <li>PC pe 169.254.x.x ⇒ cererea nu ajunge / răspunsul nu revine</li>
          </ul>
        </div>
        <div className="card"><h3>Altele</h3>
          <ul className="small">
            <li>helper forwardează și alte UDP (DNS, TFTP, NetBIOS…): <code>no ip forward-protocol udp 137</code></li>
            <li>Mai multe helper-address pe aceeași interfață = copii la mai multe servere</li>
            <li>IPv6: <code>ipv6 dhcp relay destination</code></li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>Helper pe interfața spre server = nu merge</li>
            <li>Pool pentru altă subrețea decât giaddr</li>
            <li>Server fără rută înapoi</li>
            <li>Relay nu atribuie adrese</li>
            <li>Fără <code>no shutdown</code> clientul nu cere nimic</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
