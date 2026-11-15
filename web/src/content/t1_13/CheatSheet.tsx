import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.13. */
export function CheatSheet113() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Algoritmul switch-ului</h3>
          <ol className="small">
            <li><b>Learn</b>: MAC <u>sursă</u> + port de intrare → tabelă (reset timer).</li>
            <li><b>Lookup</b>: MAC <u>destinație</u>, în același VLAN.</li>
            <li><b>Decide</b>: forward · filter · flood.</li>
          </ol>
          <Table head={['Destinație', 'Decizie']} rows={[
            ['known unicast, alt port', 'forward (1 port)'],
            ['known unicast, același port', 'filter (drop)'],
            ['unknown unicast', 'flood'],
            ['broadcast ffff.ffff.ffff', 'flood'],
            ['multicast', 'flood (IGMP snooping: doar abonații)'],
          ]} />
        </div>
        <div className="card"><h3>Aging și intrări</h3>
          <ul className="small">
            <li>Aging implicit: <b>300 s</b>; se resetează de cadrele <b>primite</b> de la acel MAC.</li>
            <li>Același MAC pe alt port ⇒ <b>MAC move</b>; repetat ⇒ <b>flapping</b> (buclă).</li>
            <li>Intrare = (VLAN, MAC, port, tip). Tipuri: DYNAMIC (expiră) · STATIC (nu expiră).</li>
            <li>Broadcast/multicast nu se învață (nu pot fi sursă).</li>
            <li>Mai multe MAC-uri pe un port ⇒ alt switch / hub / AP în spate.</li>
          </ul>
        </div>
        <div className="card"><h3>Cadrul Ethernet II</h3>
          <ul className="small">
            <li>Dst MAC 6 · Src MAC 6 · [802.1Q 4] · EtherType 2 · Payload 46–1500 · FCS 4.</li>
            <li>Cadru: <b>64–1518 B</b> (1522 cu tag). Preamble 7 B + SFD 1 B nu se numără.</li>
            <li>EtherType: 0x0800 IPv4 · 0x0806 ARP · 0x86DD IPv6 · 0x8100 802.1Q.</li>
            <li>FCS = CRC-32: detectează, nu corectează; Ethernet nu retransmite.</li>
          </ul>
        </div>
        <div className="card"><h3>Adrese MAC</h3>
          <ul className="small">
            <li>48 biți = <b>OUI</b> 24 (producător) + 24 (interfață).</li>
            <li><b>I/G</b> = ultimul bit al primului octet: 1 = multicast/broadcast.</li>
            <li><b>U/L</b> = penultimul: 1 = administrată local.</li>
            <li>A doua cifră hex impară ⇒ I/G = 1; 2/6/A/E ⇒ locală.</li>
            <li>01-00-5E multicast IPv4 · 33-33 multicast IPv6 · FF-…-FF broadcast.</li>
            <li>Notații: 0011.2233.4455 (Cisco) · 00-11-22-33-44-55 · 00:11:22:33:44:55.</li>
          </ul>
        </div>
        <div className="card"><h3>Metode de comutare</h3>
          <Table head={['Metodă', 'Începe după', 'FCS înainte?']} rows={[
            ['store-and-forward', 'tot cadrul', 'da'],
            ['cut-through', '6 B (MAC dst)', 'nu'],
            ['fragment-free', '64 B', 'nu'],
          ]} />
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small">
            <li><code>show mac address-table [dynamic | address &lt;mac&gt; | interface &lt;if&gt; | vlan &lt;id&gt; | count | aging-time]</code></li>
            <li><code>clear mac address-table dynamic</code> (statice rămân)</li>
            <li><code>mac address-table aging-time 600</code></li>
            <li><code>mac address-table static &lt;mac&gt; vlan &lt;id&gt; interface &lt;if&gt;</code></li>
            <li>IOS vechi: <code>show mac-address-table</code> (cu liniuță).</li>
          </ul>
        </div>
        <div className="card"><h3>Domenii</h3>
          <ul className="small">
            <li>Fiecare port de switch = un domeniu de <b>coliziune</b> (full-duplex ⇒ fără coliziuni).</li>
            <li>Tot VLAN-ul = un domeniu de <b>broadcast</b>; switch-ul nu îl separă.</li>
            <li>Router: aruncă fără rută · Switch: flood fără intrare MAC.</li>
            <li>Flooding + buclă, fără TTL ⇒ broadcast storm ⇒ STP.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
