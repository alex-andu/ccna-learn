import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.8. */
export function CheatSheet18() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Notație</h3>
          <ul className="small">
            <li>128 de biți = <b>8 hextete</b> × 4 cifre hexa (16 biți). 1 cifră hexa = 4 biți.</li>
            <li><b>Regula 1:</b> elimini zerourile de la <i>începutul</i> hextetului (0100 → 100, nu 1).</li>
            <li><b>Regula 2:</b> „::” <b>o singură dată</b>, pe cea mai lungă secvență de 0 (la egalitate: prima). Nu pentru un singur hextet 0.</li>
            <li>Extindere: 8 − hextete prezente = câte hextete ascunde „::”.</li>
            <li>Cu port: <code>[2001:db8::1]:80</code>. Majuscule = minuscule.</li>
          </ul>
        </div>
        <div className="card"><h3>Antet IPv6 (40 octeți)</h3>
          <Table head={['IPv4', 'IPv6']} rows={[
            ['TTL', 'Hop Limit'], ['Protocol', 'Next Header (58 = ICMPv6)'], ['ToS/DSCP', 'Traffic Class'],
            ['Total Length', 'Payload Length'], ['—', 'Flow Label (20 b)'], ['Header Checksum, IHL, Options', 'eliminate'],
            ['Fragmentare în routere', 'doar sursa fragmentează; MTU min. 1280'],
          ]} />
        </div>
        <div className="card"><h3>Structura adresei</h3>
          <Table head={['Parte', 'Biți', 'Exemplu']} rows={[
            ['Prefix global', '48', '2001:db8:acad'], ['Subnet ID', '16', '0001'], ['Interface ID', '64', '…::1'],
          ]} />
          <p className="small">/48 → <b>65.536</b> × /64 · /56 → <b>256</b> × /64 · /64 pe orice LAN (SLAAC). Legături P2P: /127. Unicast global din 2000::/3.</p>
        </div>
        <div className="card"><h3>Subnetting IPv6</h3>
          <ul className="small">
            <li>Numeri în <b>hexazecimal</b> în Subnet ID: …9, <b>a</b>, b, …, f, <b>10</b> (=16 zecimal).</li>
            <li>Rețeaua = păstrezi primii n biți, zero în rest. <code>::</code> poate ascunde Subnet ID.</li>
            <li>Alocare: IANA → RIR → ISP (/32…/29) → site (/48 business, /56 acasă) → /64.</li>
            <li>Nu există broadcast și nici adresă „de rețea” pierdută.</li>
          </ul>
        </div>
        <div className="card"><h3>NDP (ICMPv6)</h3>
          <Table head={['Mesaj', 'Tip']} rows={[
            ['RS', '133'], ['RA', '134'], ['NS', '135'], ['NA', '136'], ['Redirect', '137'],
          ]} />
          <p className="small">NS/NA înlocuiesc ARP. DAD: NS cu sursa <code>::</code>.</p>
        </div>
        <div className="card"><h3>Cum își ia hostul adresa</h3>
          <Table head={['Metodă', 'RA', 'Adresă din']} rows={[
            ['SLAAC', 'A=1', 'prefix RA + IID propriu'], ['SLAAC + DHCPv6 stateless', 'A=1, O=1', 'SLAAC; DNS din DHCPv6'], ['DHCPv6 stateful', 'M=1', 'server DHCPv6'],
          ]} />
          <p className="small"><b>Gateway = adresa link-local a routerului, din RA.</b> DHCPv6 nu dă gateway. Client DHCPv6 → <code>FF02::1:2</code>.</p>
        </div>
        <div className="card"><h3>IOS — configurare</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>ipv6 unicast-routing</li>
            <li>ipv6 address 2001:db8:acad:1::1/64</li>
            <li>ipv6 address fe80::1 link-local</li>
            <li>ipv6 address 2001:db8:acad:2::/64 eui-64</li>
            <li>ipv6 address autoconfig default</li>
            <li>ipv6 enable</li>
            <li>ipv6 route 2001:db8:acad:2::/64 2001:db8:acad:ff::2</li>
          </ul>
        </div>
        <div className="card"><h3>IOS — verificare și capcane</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>show ipv6 interface brief</li><li>show ipv6 interface g0/0</li><li>show ipv6 route</li><li>show ipv6 neighbors</li><li>ping 2001:db8:acad:1::10</li>
          </ul>
          <ul className="small">
            <li>Lipsește <code>ipv6 unicast-routing</code> → fără RA, SLAAC nu merge.</li>
            <li><code>eui-64</code>: scrii <b>prefixul</b>, nu adresa completă.</li>
            <li>show ipv6 route: C = /64, L = /128; link-local nu apar.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
