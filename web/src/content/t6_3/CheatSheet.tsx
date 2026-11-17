import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 6.3. */
export function CheatSheet63() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Planurile (6.3.a)</h3>
          <Table head={['Plan', 'Rol']} rows={[
            ['Data', 'mută pachetele (rămâne pe echipament)'],
            ['Control', 'decide unde merge traficul (SDN: în controller)'],
            ['Management', 'administrare: SSH, SNMP, NETCONF, API'],
          ]} />
          <p className="small">SDN: logică centralizată, execuție distribuită.</p>
        </div>
        <div className="card"><h3>Underlay / overlay / fabric</h3>
          <ul className="small">
            <li><b>Underlay</b>: transport IP rutat (IS-IS/OSPF), stabil</li>
            <li><b>Overlay</b>: rețea virtuală prin tuneluri (VXLAN, GRE)</li>
            <li><b>Fabric</b> = underlay + overlay, administrat central</li>
            <li>Underlay-ul nu cunoaște adresele gazdelor</li>
          </ul>
        </div>
        <div className="card"><h3>SD-Access</h3>
          <Table head={['Plan', 'Tehnologie']} rows={[
            ['Control', 'LISP'],
            ['Data', 'VXLAN'],
            ['Politică', 'SGT (TrustSec)'],
            ['Orchestrare', 'Catalyst Center + ISE'],
          ]} />
          <p className="small">Noduri: edge · border · control plane · intermediate.</p>
        </div>
        <div className="card"><h3>VXLAN</h3>
          <ul className="small">
            <li>MAC în UDP, port destinație <b>4789</b></li>
            <li>VNI pe 24 de biți (≈16 M) vs VLAN 12 biți (4094)</li>
            <li>VTEP = capăt de tunel (încapsulează/decapsulează)</li>
            <li>Adaugă overhead → verifică MTU</li>
          </ul>
        </div>
        <div className="card"><h3>API-uri (6.3.b)</h3>
          <Table head={['Direcție', 'Către', 'Exemple']} rows={[
            ['Northbound', 'aplicații', 'REST (HTTPS+JSON)'],
            ['Southbound', 'echipamente', 'NETCONF, RESTCONF, OpenFlow, SSH, SNMP, OpFlex'],
          ]} />
          <p className="small">Northbound = în sus · Southbound = în jos.</p>
        </div>
        <div className="card"><h3>NETCONF / RESTCONF / YANG</h3>
          <ul className="small">
            <li><b>NETCONF</b>: SSH, TCP 830, XML</li>
            <li><b>RESTCONF</b>: HTTPS, JSON/XML, metode HTTP</li>
            <li><b>YANG</b>: model de date (schema), nu protocol</li>
            <li><b>OpenFlow</b>: TCP 6653, tabele de flux</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
