import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.6. */
export function CheatSheet16() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Octet și măști</h3>
          <Table head={['Biți /', '1', '2', '3', '4', '5', '6', '7', '8']} rows={[
            ['Mască', '128', '192', '224', '240', '248', '252', '254', '255'],
            ['Bloc', '128', '64', '32', '16', '8', '4', '2', '1'],
          ]} />
          <p className="small">Valori poziții: 128 64 32 16 8 4 2 1. /25–/32 în octetul 4 = /17–/24 în octetul 3 = /9–/16 în octetul 2.</p>
        </div>
        <div className="card"><h3>Formule</h3>
          <ul className="small">
            <li>h = 32 − prefix · adrese = 2^h · <b>gazde = 2^h − 2</b></li>
            <li>subrețele = 2^s (s = biți împrumutați; subnet zero inclus)</li>
            <li>Rețea = IP AND mască · Broadcast = rețeaua următoare − 1</li>
            <li>Wildcard = 255 − octet mască (/26 → 0.0.0.63)</li>
            <li>N gazde → cel mai mic h cu 2^h − 2 ≥ N: 2→/30 · 6→/29 · 14→/28 · 30→/27 · 62→/26 · 126→/25 · 254→/24 · 510→/23 · 1022→/22</li>
          </ul>
        </div>
        <div className="card"><h3>Magic number</h3>
          <ol className="small">
            <li>Octetul interesant: masca ≠ 255 și ≠ 0.</li>
            <li>Bloc = 256 − mască în acel octet.</li>
            <li>Rețea = cel mai mare multiplu de bloc ≤ octetul IP; stânga copiat, dreapta 0.</li>
            <li>Broadcast = rețea + bloc − 1; dreapta 255.</li>
            <li>Gazde: rețea + 1 … broadcast − 1.</li>
          </ol>
          <p className="small mono">10.1.1.100/27 → .96 · .97–.126 · .127<br />172.16.77.200/19 → 172.16.64.0 – 172.16.95.255</p>
        </div>
        <div className="card"><h3>Clase (istoric) și cazuri limită</h3>
          <Table head={['Clasă', '1. octet', 'Mască']} rows={[
            ['A', '1–126', '/8'], ['B', '128–191', '/16'], ['C', '192–223', '/24'], ['D', '224–239', 'multicast'], ['E', '240–255', 'rezervat'],
          ]} />
          <p className="small">/30 = 4 adrese, 2 gazde · /31 = 2 gazde, p2p (RFC 3021) · /32 = loopback, rută de gazdă.</p>
        </div>
        <div className="card"><h3>VLSM</h3>
          <ul className="small">
            <li>Sortează descrescător → cel mai mic bloc → prima adresă liberă multiplu de bloc.</li>
            <li>192.168.10.0/24 pentru 60/28/12/2: <span className="mono">.0/26 · .64/27 · .96/28 · .112/30</span>, liber de la .116.</li>
            <li>Sumarizare: biții comuni; 172.16.0–3.0/24 → 172.16.0.0/22.</li>
          </ul>
        </div>
        <div className="card"><h3>Adrese speciale</h3>
          <ul className="small">
            <li>127.0.0.0/8 loopback · 169.254.0.0/16 APIPA (DHCP eșuat)</li>
            <li>255.255.255.255 broadcast limitat · 224.0.0.0/4 multicast · 240.0.0.0/4 rezervat</li>
            <li>0.0.0.0/8 „această rețea” ≠ 0.0.0.0/0 rută implicită</li>
            <li>Privat RFC 1918: 10/8 · 172.16/12 · 192.168/16 · 100.64/10 = CGNAT (nu RFC 1918)</li>
            <li>Documentație: 192.0.2.0/24 · 198.51.100.0/24 · 203.0.113.0/24</li>
          </ul>
        </div>
        <div className="card"><h3>IOS</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>interface g0/0</li><li>ip address 192.168.10.1 255.255.255.192</li><li>ip address … secondary</li><li>no shutdown</li>
            <li>show ip interface brief</li><li>show ip interface g0/0</li><li>show running-config interface g0/0</li><li>show ip route connected (C + L)</li><li>ping 192.168.10.114</li>
          </ul>
        </div>
        <div className="card"><h3>Stări și erori</h3>
          <ul className="small">
            <li>up/up OK · admin down/down = <code>shutdown</code> · down/down = L1 · up/down = L2</li>
            <li>„% … overlaps with Gx/x” = aceeași subrețea pe două interfețe</li>
            <li>„Bad mask /27 for address …” = adresă de rețea/broadcast sau mască invalidă</li>
            <li><code>ip address</code> fără <code>secondary</code> înlocuiește adresa primară</li>
            <li>Gateway-ul gazdei = în aceeași subrețea</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
