import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.10. */
export function CheatSheet110() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Parametrii unui client</h3>
          <ul className="small">
            <li><b>IP + mască</b> → identitate și rețea locală. <b>Gateway</b> → ușa spre alte rețele (în <b>aceeași</b> rețea cu hostul). <b>DNS</b> → nume → IP.</li>
            <li>Local sau remote: <b>AND</b> cu <b>propria mască</b>, pentru ambele adrese. Egale = local (ARP pentru destinație); diferite = remote (ARP pentru <b>gateway</b>, IP destinație neschimbat).</li>
            <li>DHCP: Discover → Offer → Request → Ack. Static: fără lease.</li>
            <li><b>APIPA</b>: 169.254.0.0/16, mască /16, fără gateway/DNS → DHCP a eșuat.</li>
          </ul>
        </div>
        <div className="card"><h3>Echivalențe între sisteme</h3>
          <Table head={['', 'Windows', 'macOS', 'Linux']} rows={[
            ['IP + mască', 'ipconfig', 'ifconfig en0', 'ip a'],
            ['tot', 'ipconfig /all', 'networksetup -getinfo', 'nmcli dev show'],
            ['gateway', 'route print', 'route -n get default', 'ip route'],
            ['DNS', 'ipconfig /all', 'scutil --dns', 'resolvectl status'],
            ['ARP', 'arp -a', 'arp -a', 'ip neigh'],
            ['traseu', 'tracert', 'traceroute', 'traceroute'],
          ]} />
        </div>
        <div className="card"><h3>Formate care încurcă</h3>
          <Table head={['', 'Windows', 'macOS', 'Linux']} rows={[
            ['mască', '255.255.255.0', '0xffffff00', '/24'],
            ['MAC', '3C-A9-…', 'a4:83:…', '08:00:…'],
            ['gateway', 'Default Gateway', 'Router', 'default via'],
          ]} />
          <p className="small">Cisco IOS: MAC <code>3ca9.f412.3456</code>. Mască hex: <code>ffffff00</code> /24 · <code>fffffe00</code> /23 · <code>ffffffc0</code> /26.</p>
        </div>
        <div className="card"><h3>Windows — ipconfig</h3>
          <ul className="small">
            <li><code>ipconfig</code> → IP, mască, gateway (fără DNS, MAC, lease).</li>
            <li><code>/all</code> → MAC (Physical Address), DHCP, lease, DNS.</li>
            <li><code>/release</code> + <code>/renew</code> → refac DHCP. <code>/flushdns</code> → cache DNS. <code>/displaydns</code> → îl afișează.</li>
            <li>„Media disconnected” = cablu/Wi-Fi, nu IP.</li>
          </ul>
        </div>
        <div className="card"><h3>macOS</h3>
          <ul className="small">
            <li><code>ifconfig en0</code> (mască hex) · <code>ipconfig getifaddr en0</code> (doar IP).</li>
            <li><code>networksetup -getdnsservers</code> = doar DNS manual → <code>scutil --dns</code>.</li>
            <li>Gateway = „Router”. <code>ipconfig /all</code> nu există.</li>
            <li>Ping continuu (<code>-c 4</code> pentru 4).</li>
          </ul>
        </div>
        <div className="card"><h3>Linux</h3>
          <ul className="small">
            <li><code>ip a</code> (/prefix; „dynamic” = DHCP; valid_lft) · <code>ip route</code> (default via) · <code>ip neigh</code>.</li>
            <li><code>nameserver 127.0.0.53</code> = stub systemd-resolved; DNS reale: <code>resolvectl status</code>.</li>
            <li><code>ifconfig</code> = depreciat. Modificările cu <code>ip</code> se pierd la restart.</li>
          </ul>
        </div>
        <div className="card"><h3>Scara de ping</h3>
          <ol className="small">
            <li><code>127.0.0.1</code> → stiva TCP/IP (nu cablul!)</li>
            <li>IP propriu → interfața</li>
            <li>gateway → LAN</li>
            <li>IP remote (8.8.8.8) → rutare</li>
            <li>nume (www…) → DNS</li>
          </ol>
          <p className="small">TTL inițial: 64 Linux/macOS · 128 Windows · 255 Cisco.</p>
        </div>
        <div className="card"><h3>Simptome → cauză</h3>
          <ul className="small">
            <li>169.254.x.x → DHCP (server, pool, VLAN, ip helper-address).</li>
            <li>Ping IP da, nume nu → <b>DNS</b>.</li>
            <li>LAN da, restul nu → gateway greșit/în altă rețea.</li>
            <li>„Unreachable” de la <b>propriul IP</b> → ARP eșuat local.</li>
            <li>Mască prea scurtă → ARP direct pentru remote; prea lungă → vecini „remote”.</li>
            <li>Conexiuni intermitente → IP duplicat (static în pool-ul DHCP).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
