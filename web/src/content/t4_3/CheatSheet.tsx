import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 4.3. */
export function CheatSheet43() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>DHCP — DORA</h3>
          <Table head={['Mesaj', 'De la', 'Tip']} rows={[
            ['Discover', 'client', 'broadcast, src 0.0.0.0'],
            ['Offer', 'server', 'oferă IP + parametri'],
            ['Request', 'client', 'broadcast'],
            ['Ack', 'server', 'confirmă lease-ul'],
          ]} />
          <p className="small">UDP 67 server · UDP 68 client</p>
        </div>
        <div className="card"><h3>Lease</h3>
          <ul className="small">
            <li>50% = renew (unicast la server)</li>
            <li>87,5% = rebind (broadcast)</li>
            <li>100% = expiră → DORA din nou</li>
            <li>IOS: implicit 1 zi (<code>lease</code>)</li>
            <li>169.254.0.0/16 = fără răspuns DHCP</li>
          </ul>
        </div>
        <div className="card"><h3>Parametri DHCP</h3>
          <ul className="small">
            <li>IP + mască · gateway (opț. 3) · DNS (opț. 6) · domeniu (opț. 15) · lease</li>
            <li>Opț. 43: AP-uri Cisco → adresa WLC</li>
            <li>Relay: <code>ip helper-address</code> (4.6)</li>
          </ul>
        </div>
        <div className="card"><h3>DNS</h3>
          <ul className="small">
            <li>Nume → IP · UDP 53 (TCP 53: zone transfer/răspunsuri mari)</li>
            <li>Ierarhie: root → TLD → autoritativ</li>
            <li>Client → recursiv (recursiv); recursiv → ierarhie (iterativ)</li>
            <li>TTL = cât ține cache-ul</li>
          </ul>
        </div>
        <div className="card"><h3>Înregistrări DNS</h3>
          <Table head={['Tip', 'Face']} rows={[
            ['A', 'nume → IPv4'], ['AAAA', 'nume → IPv6'], ['CNAME', 'alias'], ['MX', 'e-mail'], ['NS', 'servere autoritative'], ['PTR', 'IP → nume'], ['SOA', 'autoritatea zonei'],
          ]} />
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small">
            <li><code>ip dhcp excluded-address a b</code> (global)</li>
            <li><code>ip dhcp pool N</code> → <code>network</code>, <code>default-router</code>, <code>dns-server</code>, <code>lease</code></li>
            <li><code>show ip dhcp binding | pool | conflict</code></li>
            <li><code>ip name-server</code> · <code>no ip domain-lookup</code> · <code>ip host</code></li>
            <li>Client: <code>ipconfig /all /release /renew</code>, <code>nslookup</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
