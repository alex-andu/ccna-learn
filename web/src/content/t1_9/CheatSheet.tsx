import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.9. */
export function CheatSheet19() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Hartă de prefixe</h3>
          <Table head={['Tip', 'Prefix', 'Scope']} rows={[
            ['GUA', '2000::/3', 'global'], ['ULA', 'fc00::/7 (fd00::/8)', 'organizație'], ['Link-local', 'fe80::/10', 'legătură'],
            ['Multicast', 'ff00::/8', 'variabil'], ['Loopback', '::1/128', 'nod'], ['Nespecificată', '::/128', '—'],
            ['Documentație', '2001:db8::/32', '—'], ['Site-local (depreciat)', 'fec0::/10', '—'],
          ]} />
          <p className="small">Fără <b>broadcast</b>. Anycast = adresă unicast marcată <code>anycast</code>.</p>
        </div>
        <div className="card"><h3>Unicast</h3>
          <ul className="small">
            <li><b>GUA:</b> prefix global (48) + Subnet ID (16) + IID (64). Începe cu 2 sau 3.</li>
            <li><b>ULA:</b> fd + Global ID 40 b aleatoriu + Subnet 16 + IID 64. Nu pe Internet; nu pentru NAT.</li>
            <li><b>Link-local:</b> automată, pe fiecare interfață; nu e rutată; gateway-ul hostilor; <code>fe80::1%12</code>.</li>
            <li>Aceeași link-local pe mai multe interfețe: permis. GUA: trebuie unică.</li>
          </ul>
        </div>
        <div className="card"><h3>Anycast</h3>
          <ul className="small">
            <li>Aceeași adresă pe mai multe noduri; ajunge la <b>cel mai apropiat</b>.</li>
            <li>Din spațiul unicast; <code>ipv6 address …/64 anycast</code>.</li>
            <li>Subnet-Router anycast: prefix + IID zero.</li>
            <li>Exemple: DNS rădăcină, CDN.</li>
          </ul>
        </div>
        <div className="card"><h3>Multicast</h3>
          <Table head={['Adresă', 'Grup']} rows={[
            ['ff02::1', 'toate nodurile'], ['ff02::2', 'toate routerele'], ['ff02::5 / ::6', 'OSPF / DR OSPF'],
            ['ff02::9', 'RIPng'], ['ff02::a', 'EIGRP'], ['ff02::1:2', 'DHCPv6'], ['ff02::1:ffXX:XXXX', 'solicited-node'],
          ]} />
          <p className="small">Format: ff + flag-uri(4) + <b>scope(4)</b> + group ID(112). Scope: 1 interfață · 2 link · 5 site · 8 org · e global.</p>
        </div>
        <div className="card"><h3>Solicited-node</h3>
          <ul className="small">
            <li><code>ff02::1:ff</code> + <b>ultimii 24 de biți</b> ai adresei (prefix <code>ff02::1:ff00:0/104</code>).</li>
            <li>2001:db8:acad:1::1 și fe80::1 → <code>ff02::1:ff00:1</code>.</li>
            <li>NS (≈ ARP request) merge aici; MAC multicast <code>33:33:ff:XX:XX:XX</code>.</li>
          </ul>
        </div>
        <div className="card"><h3>Modified EUI-64</h3>
          <ol className="small">
            <li>Împarte MAC-ul (24 | 24).</li>
            <li>Inserează <b>FFFE</b> la mijloc.</li>
            <li><b>Inversează bitul 7</b> al primului octet (XOR 0x02).</li>
          </ol>
          <p className="small">2-a cifră: 0↔2, 1↔3, 4↔6, 5↔7, 8↔A, 9↔B, C↔E, D↔F. 00:11:22:33:44:55 → <code>0211:22ff:fe33:4455</code>. 02:… → 00….</p>
        </div>
        <div className="card"><h3>IOS</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>ipv6 address 2001:db8:1::/64 eui-64</li>
            <li>ipv6 address fe80::1 link-local</li>
            <li>ipv6 address 2001:db8:1:1::fffe/64 anycast</li>
            <li>show ipv6 interface g0/0</li><li>show ipv6 interface brief</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>FFFE <b>la mijloc</b>; bitul 7 se <b>inversează</b>.</li>
            <li>fe80::/10 e intervalul; reale: fe80::/64. fec0::/10 depreciat.</li>
            <li>ff02::1 ≠ ff02::2. Scope = a 4-a cifră.</li>
            <li>Loopback = <code>::1</code>, o singură adresă.</li>
            <li>Gateway = link-local a routerului, din RA.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
