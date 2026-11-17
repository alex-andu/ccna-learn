import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.5. */
export function CheatSheet55() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Tipuri de VPN</h3>
          <Table head={['', 'Site-to-site', 'Remote access']} rows={[
            ['Capete', 'gateway ↔ gateway', 'client ↔ gateway'],
            ['Client', 'nu', 'da (Secure Client)'],
            ['Durată', 'permanent', 'la cerere'],
            ['Tehnologie', 'IPsec', 'TLS sau IPsec IKEv2'],
          ]} />
        </div>
        <div className="card"><h3>Obiective IPsec</h3>
          <ul className="small">
            <li>Confidențialitate (criptare)</li>
            <li>Integritate (HMAC)</li>
            <li>Autentificare (PSK / certificate)</li>
            <li>Anti-replay</li>
          </ul>
        </div>
        <div className="card"><h3>Componente</h3>
          <ul className="small">
            <li><b>IKE</b>: UDP 500 (NAT-T: UDP 4500)</li>
            <li><b>ESP</b>: protocol IP 50 — criptare + integritate</li>
            <li><b>AH</b>: protocol IP 51 — doar integritate, nu merge cu NAT</li>
            <li><b>SA</b>: unidirecțională, are SPI</li>
          </ul>
        </div>
        <div className="card"><h3>Faze (IKEv1)</h3>
          <ul className="small">
            <li>Trafic de interes → pornește IKE</li>
            <li><b>Faza 1</b>: IKE/ISAKMP SA (Main 6 msg / Aggressive 3) — DH + autentificare</li>
            <li><b>Faza 2</b>: IPsec SA (Quick Mode, 3 msg)</li>
            <li>Date prin ESP · rekey la expirare</li>
            <li>IKEv2: IKE_SA_INIT + IKE_AUTH</li>
          </ul>
        </div>
        <div className="card"><h3>Moduri</h3>
          <ul className="small">
            <li><b>Tunnel</b>: antet IP nou, pachet original încapsulat (site-to-site)</li>
            <li><b>Transport</b>: antet IP original păstrat</li>
            <li>GRE: multicast/rutare, fără criptare; GRE peste IPsec = ambele</li>
            <li>DMVPN, VTI: recunoaștere</li>
          </ul>
        </div>
        <div className="card"><h3>IOS (crypto map)</h3>
          <ul className="small">
            <li><code>crypto isakmp policy 10</code> + key</li>
            <li><code>crypto ipsec transform-set</code></li>
            <li>ACL de interes (oglindit)</li>
            <li><code>crypto map … / set peer / match address</code> + pe interfață</li>
            <li><code>show crypto isakmp sa</code> (QM_IDLE) · <code>show crypto ipsec sa</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
