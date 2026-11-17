import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.7. */
export function CheatSheet17() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>RFC 1918 — blocurile private</h3>
          <Table head={['Bloc', 'Interval', 'Mască', 'Adrese']} rows={[
            ['10.0.0.0/8', '10.0.0.0 – 10.255.255.255', '255.0.0.0', '16.777.216'],
            ['172.16.0.0/12', '172.16.0.0 – 172.31.255.255', '255.240.0.0', '1.048.576'],
            ['192.168.0.0/16', '192.168.0.0 – 192.168.255.255', '255.255.0.0', '65.536'],
          ]} />
          <p className="small">Wildcard (ACL): 0.255.255.255 · <b>0.15.255.255</b> · 0.0.255.255. Capcană: 172.15.x.x și 172.32.x.x sunt <b>publice</b>.</p>
        </div>
        <div className="card"><h3>Nu sunt RFC 1918</h3>
          <Table head={['Bloc', 'Rol']} rows={[
            ['100.64.0.0/10', 'CGNAT (RFC 6598): 100.64.0.0 – 100.127.255.255'],
            ['169.254.0.0/16', 'APIPA / link-local (RFC 3927): DHCP a eșuat'],
            ['127.0.0.0/8', 'Loopback: „eu însumi”'],
            ['192.0.2.0/24 · 198.51.100.0/24 · 203.0.113.0/24', 'Documentație (RFC 5737)'],
            ['224.0.0.0/4 · 240.0.0.0/4', 'Multicast · rezervat (clasa E)'],
          ]} />
        </div>
        <div className="card"><h3>Istoria epuizării</h3>
          <ul className="small">
            <li>IPv4 = 32 de biți → 2³² ≈ <b>4,3 miliarde</b> de adrese.</li>
            <li>IANA epuizat: <b>3 februarie 2011</b>. RIPE NCC, ultimul /22: <b>25 noiembrie 2019</b>.</li>
            <li>CIDR (1993) → NAT RFC 1631 (1994) → RFC 1918 (1996) → IPv6 RFC 2460 (1998) → RFC 6598 (2012).</li>
            <li>Doar <b>IPv6</b> rezolvă problema de fond; NAT și CIDR amână.</li>
          </ul>
        </div>
        <div className="card"><h3>NAT / PAT</h3>
          <Table head={['Tip', 'Raport', 'Note']} rows={[
            ['Static', '1:1 fix', 'acces din exterior (server)'],
            ['Dinamic', '1:1 din pool', 'rar astăzi'],
            ['PAT (overload)', 'N:1 cu port', 'routerul de acasă; ICMP → Identifier'],
          ]} />
          <p className="small">NAT <b>nu e firewall</b> și <b>nu creează adrese</b>. Rupe end-to-end; ține stare (tabelă).</p>
        </div>
        <div className="card"><h3>Terminologie Cisco</h3>
          <Table head={['Termen', 'Sens', 'Exemplu']} rows={[
            ['Inside local', 'adresa privată a hostului', '192.168.1.10'],
            ['Inside global', 'adresa publică sub care apare', '203.0.113.2'],
            ['Outside global', 'adresa reală a hostului din Internet', '198.51.100.10'],
            ['Outside local', 'adresa lui, văzută din LAN', '198.51.100.10 (de regulă)'],
          ]} />
        </div>
        <div className="card"><h3>CGNAT</h3>
          <ul className="small">
            <li>ISP-ul face un al doilea NAT (NAT444); abonatul primește pe WAN o adresă din <b>100.64.0.0/10</b>.</li>
            <li>Bloc separat ca să nu se suprapună cu LAN-ul abonatului (10/8 ar putea fi deja în casă).</li>
            <li>Consecință: fără server acasă accesibil din exterior, posibil „NAT strict” la jocuri.</li>
            <li>Test: adresa WAN ≠ adresa de pe „what is my IP” → încă un NAT în drum.</li>
          </ul>
        </div>
        <div className="card"><h3>IOS (preview 4.1)</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>access-list 1 permit 192.168.1.0 0.0.0.255</li>
            <li>interface g0/0 → ip nat inside</li>
            <li>interface g0/1 → ip nat outside</li>
            <li>ip nat inside source list 1 interface g0/1 overload</li>
            <li>show ip nat translations</li><li>show ip nat statistics</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>172.16–<b>31</b> privat; 172.32 și 172.15 publice.</li>
            <li>192.<b>168</b> privat; 192.169 public. 192.168.256.1 = invalid.</li>
            <li>Masca nu schimbă caracterul privat (10.5.5.5/30 e privată).</li>
            <li>169.254.x.x și 100.64/10 <b>nu</b> sunt RFC 1918.</li>
            <li>Inside local = privată; inside global = publică.</li>
            <li>ULA (fc00::/7) = echivalentul IPv6 „intern”, fără NAT obligatoriu.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
