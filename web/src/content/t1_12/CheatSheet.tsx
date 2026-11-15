import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.12. */
export function CheatSheet112() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Trei virtualizări</h3>
          <Table head={['', 'Virtualizează', 'Izolare']} rows={[
            ['VM', 'hardware (hypervisor)', 'puternică · kernel propriu'],
            ['Container', 'OS-ul (kernel comun)', 'medie · MB · secunde'],
            ['VRF', 'rutarea L3 a unui router', 'tabele separate · IP suprapuse'],
          ]} />
        </div>
        <div className="card"><h3>Hypervisor</h3>
          <ul className="small">
            <li><b>Type 1</b> (bare-metal): ESXi, Hyper-V, Xen, KVM — direct pe hardware, data center.</li>
            <li><b>Type 2</b> (hosted): VirtualBox, VMware Workstation/Fusion, Parallels — aplicație pe un OS.</li>
            <li>Host = fizic · guest = VM · VMM = hypervisor.</li>
            <li>Extensii CPU: Intel VT-x, AMD-V (activate în BIOS/UEFI).</li>
          </ul>
        </div>
        <div className="card"><h3>VM în rețea</h3>
          <ul className="small">
            <li>VM → <b>vNIC</b> (MAC propriu) → <b>vSwitch</b> → uplink(-uri) fizic(e) → switch ToR.</li>
            <li>Același host + același VLAN → comută în vSwitch, <b>nu iese pe cablu</b>.</li>
            <li>VLAN-uri diferite → are nevoie de L3 (iese pe trunk și revine).</li>
            <li>Portul switch-ului spre host = <b>trunk 802.1Q</b>; VLAN-urile port group-urilor trebuie permise.</li>
            <li>NIC teaming = redundanță / lățime de bandă; live migration păstrează IP + MAC.</li>
          </ul>
        </div>
        <div className="card"><h3>Containere</h3>
          <ul className="small">
            <li>Împart <b>kernelul gazdei</b> (namespaces = ce văd, cgroups = cât folosesc).</li>
            <li><b>Image</b> = șablon read-only pe straturi · <b>container</b> = instanță · <b>registry</b> = depozit.</li>
            <li><b>Docker</b> = rulează · <b>Kubernetes</b> = orchestrează (pod, nod, control plane).</li>
            <li>Rețea: veth → bridge docker0 (172.17.0.0/16) → NAT; <code>-p gazdă:container</code>.</li>
            <li>Nu sunt hypervisor. Windows/macOS: Docker Desktop folosește o VM Linux.</li>
          </ul>
        </div>
        <div className="card"><h3>VM vs container</h3>
          <Table head={['', 'VM', 'Container']} rows={[
            ['OS', 'complet, propriu', 'folosește kernelul gazdei'],
            ['Dimensiune', 'GB', 'MB'],
            ['Pornire', 'minute', 'secunde'],
            ['Izolare', 'mai bună', 'mai slabă'],
          ]} />
        </div>
        <div className="card"><h3>VRF — concept</h3>
          <ul className="small">
            <li>Mai multe <b>tabele de rutare</b> pe un router; fiecare interfață aparține unui singur VRF (sau tabelei globale).</li>
            <li>Adrese IP <b>suprapuse</b> permise între VRF-uri. VLAN separă L2, VRF separă L3.</li>
            <li><b>VRF-Lite</b> = fără MPLS (subinterfețe per VRF). <b>MPLS L3VPN</b> = operator: PE/CE/P, MP-BGP, <b>RD</b> (face prefixul unic), <b>RT</b> (import/export).</li>
            <li>Folosit: furnizori, multi-tenant, oaspeți vs corporativ, Mgmt-vrf.</li>
          </ul>
        </div>
        <div className="card"><h3>VRF — comenzi</h3>
          <ul className="small">
            <li><code>vrf definition X</code> (vechi: <code>ip vrf X</code>) · <code>address-family ipv4</code></li>
            <li><code>vrf forwarding X</code> pe interfață → <b>șterge IP-ul</b>; reintrodu <code>ip address</code></li>
            <li><code>ip route vrf X …</code> · <code>router ospf 1 vrf X</code></li>
            <li><code>show vrf</code> · <code>show ip route vrf X</code> · <code>ping vrf X ip</code> · <code>show ip arp vrf X</code></li>
            <li>Fără <code>vrf</code> → tabela globală (false negative).</li>
          </ul>
        </div>
        <div className="card"><h3>NFV și VirtualBox</h3>
          <ul className="small">
            <li><b>NFV</b>: funcții de rețea ca VM-uri (Catalyst 8000V, ASAv/FTDv, 9800-CL) pe servere x86.</li>
            <li>VirtualBox: <b>NAT</b> (implicit, doar ieșire) · <b>Bridged</b> (în LAN, MAC propriu) · <b>Host-only</b> (PC↔VM) · <b>Internal</b> (doar VM↔VM).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
