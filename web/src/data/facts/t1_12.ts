import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.12 Explain virtualization fundamentals (server virtualization, containers, and VRFs)
export const FACTS: Fact[] = [
  { topicId: '1.12', id: 'f-1.12-01', front: 'Virtualizarea serverelor — ideea', back: 'Mai multe VM-uri izolate pe un singur server fizic', detail: 'Consolidare, provizionare rapidă, snapshot-uri, live migration.' },
  { topicId: '1.12', id: 'f-1.12-02', front: 'Hypervisor Type 1', back: 'Bare-metal: rulează direct pe hardware (ESXi, Hyper-V, Xen, KVM)', detail: 'Folosit în data center și cloud.' },
  { topicId: '1.12', id: 'f-1.12-03', front: 'Hypervisor Type 2', back: 'Hosted: aplicație pe un OS (VirtualBox, VMware Workstation, Parallels)', detail: 'Folosit pentru laburi pe laptop, ex. GNS3 VM.' },
  { topicId: '1.12', id: 'f-1.12-04', front: 'Host / guest', back: 'Host = serverul fizic (sau OS-ul gazdă); guest = VM-ul și OS-ul ei', detail: 'Hypervisor = VMM.' },
  { topicId: '1.12', id: 'f-1.12-05', front: 'vNIC', back: 'Placă de rețea virtuală a unei VM, cu MAC propriu', detail: 'Se leagă la un virtual switch.' },
  { topicId: '1.12', id: 'f-1.12-06', front: 'Virtual switch (vSwitch)', back: 'Switch software în hypervisor: învață MAC-uri, suportă VLAN-uri', detail: 'De regulă nu rulează STP; politici pe port group.' },
  { topicId: '1.12', id: 'f-1.12-07', front: 'Același host, același VLAN', back: 'Cadrul comută în vSwitch și nu iese pe cablu', detail: 'Pentru alt VLAN e nevoie de un dispozitiv L3.' },
  { topicId: '1.12', id: 'f-1.12-08', front: 'Portul switch-ului spre un host de virtualizare', back: 'Trunk 802.1Q cu VLAN-urile VM-urilor permise', detail: 'Un VLAN nepermis = VM-uri fără rețea.' },
  { topicId: '1.12', id: 'f-1.12-09', front: 'NIC teaming', back: 'Mai multe uplink-uri grupate: redundanță și, uneori, mai multă lățime de bandă', detail: 'Modul de teaming trebuie potrivit cu switch-ul (ex. EtherChannel).' },
  { topicId: '1.12', id: 'f-1.12-10', front: 'Live migration', back: 'Mută o VM pornită între hosturi, păstrând IP și MAC', detail: 'VLAN-ul trebuie existent pe trunk-urile ambelor hosturi.' },
  { topicId: '1.12', id: 'f-1.12-11', front: 'NFV', back: 'Funcții de rețea ca VM-uri pe servere standard (VNF)', detail: 'Ex.: Catalyst 8000V, ASAv/FTDv, Catalyst 9800-CL. Diferit de SDN.' },
  { topicId: '1.12', id: 'f-1.12-12', front: 'Container', back: 'Aplicație împachetată care împarte kernelul gazdei', detail: 'Izolare prin namespaces și cgroups; MB și secunde.' },
  { topicId: '1.12', id: 'f-1.12-13', front: 'VM vs container', back: 'VM: OS complet, GB, minute, izolare mare · Container: kernel comun, MB, secunde, izolare mai slabă', detail: 'Container Linux are nevoie de kernel Linux.' },
  { topicId: '1.12', id: 'f-1.12-14', front: 'Imagine vs container', back: 'Imagine = șablon read-only pe straturi; container = instanță în execuție', detail: 'Dockerfile → image → registry → container.' },
  { topicId: '1.12', id: 'f-1.12-15', front: 'Docker vs Kubernetes', back: 'Docker construiește și rulează containere; Kubernetes le orchestrează pe un cluster', detail: 'Niciunul nu e hypervisor. Pod = unitatea K8s.' },
  { topicId: '1.12', id: 'f-1.12-16', front: 'Rețeaua unui container Docker', back: 'veth → bridge docker0 (de obicei 172.17.0.0/16) → NAT; -p gazdă:container', detail: 'Ca un vSwitch plus NAT.' },
  { topicId: '1.12', id: 'f-1.12-17', front: 'VRF', back: 'Mai multe tabele de rutare independente pe un singur router', detail: 'Interfața aparține unui singur VRF; IP-uri suprapuse permise.' },
  { topicId: '1.12', id: 'f-1.12-18', front: 'VRF vs VLAN', back: 'VLAN separă nivelul 2; VRF separă nivelul 3', detail: 'Pot fi combinate.' },
  { topicId: '1.12', id: 'f-1.12-19', front: 'vrf forwarding', back: 'Atașează interfața la VRF și șterge adresa IP — reintrodu ip address', detail: 'Sintaxa veche: ip vrf forwarding.' },
  { topicId: '1.12', id: 'f-1.12-20', front: 'Verificare VRF', back: 'show vrf · show ip route vrf X · ping vrf X ip', detail: 'Fără vrf = tabela globală (fals negativ).' },
  { topicId: '1.12', id: 'f-1.12-21', front: 'VRF-Lite vs MPLS L3VPN', back: 'VRF-Lite: fără MPLS, subinterfețe per VRF · L3VPN: PE/CE/P, MP-BGP, RD, RT', detail: 'La CCNA doar conceptual. RD = unicitate; RT = import/export.' },
];
