import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.3 Configure and verify Layer 2 discovery protocols (CDP and LLDP)
export const FACTS: Fact[] = [
  { topicId: '2.3', id: 'f-2.3-01', front: 'Ce face un protocol de descoperire L2?', back: 'Anunță vecinii direct conectați (nume, model, port, capabilități, IP) și construiește o tabelă de vecini', detail: 'Doar vecini direcți; funcționează la nivelul 2, fără IP.' },
  { topicId: '2.3', id: 'f-2.3-02', front: 'CDP: proprietar sau standard? Activ implicit?', back: 'Proprietar Cisco; activat implicit pe echipamentele Cisco', detail: 'Se oprește cu no cdp run (global) sau no cdp enable (interfață).' },
  { topicId: '2.3', id: 'f-2.3-03', front: 'LLDP: standard? Activ implicit pe IOS?', back: 'Standard IEEE 802.1AB; dezactivat implicit pe IOS (lldp run)', detail: 'Folosit în rețele multi-vendor.' },
  { topicId: '2.3', id: 'f-2.3-04', front: 'Timer și holdtime implicite CDP', back: '60 s anunț, 180 s holdtime', detail: 'Se schimbă cu cdp timer și cdp holdtime.' },
  { topicId: '2.3', id: 'f-2.3-05', front: 'Timer și hold time uzuale LLDP', back: '30 s anunț, 120 s hold time', detail: 'Verifică cu show lldp; se schimbă cu lldp timer / lldp holdtime.' },
  { topicId: '2.3', id: 'f-2.3-06', front: 'Cum vezi IP-ul și versiunea IOS ale unui vecin CDP?', back: 'show cdp neighbors detail (sau show cdp entry <nume>)', detail: 'show cdp neighbors (fără detail) nu arată IP-ul.' },
  { topicId: '2.3', id: 'f-2.3-07', front: 'În show cdp neighbors: Local Intrfce vs Port ID', back: 'Local Intrfce = portul TĂU; Port ID = portul VECINULUI', detail: 'Greșeala clasică este inversarea lor.' },
  { topicId: '2.3', id: 'f-2.3-08', front: 'Cum oprești CDP pe tot echipamentul și pe un port?', back: 'Global: no cdp run · Interfață: no cdp enable', detail: 'Pentru porturile spre utilizatori sau rețele externe.' },
  { topicId: '2.3', id: 'f-2.3-09', front: 'Comenzile LLDP pe interfață', back: 'lldp transmit și lldp receive (controlează separat direcția)', detail: 'Se opresc cu no lldp transmit / no lldp receive.' },
  { topicId: '2.3', id: 'f-2.3-10', front: 'Cum vezi vecinii LLDP?', back: 'show lldp neighbors [detail]', detail: 'Detail arată TLV-urile: chassis ID, port ID, system name/description, IP de management.' },
  { topicId: '2.3', id: 'f-2.3-11', front: 'Ce vede CDP/LLDP într-un lanț SW1–SW2–SW3 de pe SW1?', back: 'Doar SW2, vecinul direct', detail: 'Anunțurile nu sunt retransmise.' },
  { topicId: '2.3', id: 'f-2.3-12', front: 'EtherType și destinația cadrelor LLDP', back: 'EtherType 0x88CC; multicast 01-80-C2-00-00-0E', detail: 'Adresă link-local: nu e retransmisă de switch-uri.' },
  { topicId: '2.3', id: 'f-2.3-13', front: 'TLV-urile obligatorii în LLDP', back: 'Chassis ID, Port ID, TTL (plus End of LLDPDU)', detail: 'System Name, System Description, Capabilities, Management Address sunt opționale.' },
  { topicId: '2.3', id: 'f-2.3-14', front: 'Ce este LLDP-MED?', back: 'Extensie LLDP pentru telefoane/endpoint-uri: VLAN de voce, QoS, putere PoE', detail: 'Echivalentul funcțional al părții de telefon din CDP.' },
  { topicId: '2.3', id: 'f-2.3-15', front: 'De ce se dezactivează CDP/LLDP pe porturile spre utilizatori?', back: 'Anunțurile sunt în clar: dezvăluie model, versiune IOS, IP și native VLAN unui atacator', detail: 'Păstrează-le doar pe legăturile dintre echipamentele de infrastructură.' },
  { topicId: '2.3', id: 'f-2.3-16', front: 'Ce mesaje de avertizare produce CDP?', back: '%CDP-4-NATIVE_VLAN_MISMATCH și %CDP-4-DUPLEX_MISMATCH', detail: 'Compară native VLAN și duplex între capete.' },
  { topicId: '2.3', id: 'f-2.3-17', front: 'Un capăt rulează doar CDP, celălalt doar LLDP. Ce se vede?', back: 'Niciunul nu-l vede pe celălalt', detail: 'Același protocol trebuie să ruleze pe ambele capete.' },
  { topicId: '2.3', id: 'f-2.3-18', front: 'Ce înseamnă „CDP walking”?', back: 'Citești IP-ul vecinului din detail, te conectezi la el, repeți: descoperi topologia pas cu pas', detail: 'Fiecare echipament arată doar vecinii lui direcți.' },
];
