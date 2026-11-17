import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.7 securitate L2
export const FACTS: Fact[] = [
  { topicId: '5.7', id: 'f-5.7-01', front: 'Cele trei funcții L2 din 5.7 și ce apără', back: 'Port security (MAC), DHCP snooping (DHCP fals), DAI (ARP fals)', detail: 'Ordinea de implementare: snooping înaintea DAI (DAI folosește binding table).' },
  { topicId: '5.7', id: 'f-5.7-02', front: 'Port security: valori implicite după activare', back: 'Maximum 1 adresă MAC · violation shutdown · fără sticky · fără aging', detail: 'Portul trebuie să fie static access (sau trunk), nu dynamic.' },
  { topicId: '5.7', id: 'f-5.7-03', front: 'Cele trei moduri de violare', back: 'protect (aruncă, fără notificare) · restrict (aruncă + log + contor) · shutdown (err-disabled)', detail: 'Doar shutdown închide portul.' },
  { topicId: '5.7', id: 'f-5.7-04', front: 'Cum reactivezi un port err-disabled din port security?', back: 'shutdown apoi no shutdown (sau errdisable recovery cause psecure-violation)', detail: 'Mai întâi elimini cauza (dispozitivul ilegal); recuperarea automată e dezactivată implicit.' },
  { topicId: '5.7', id: 'f-5.7-05', front: 'Sticky MAC', back: 'Adrese învățate dinamic și scrise în running-config', detail: 'switchport port-security mac-address sticky; salvează cu copy run start.' },
  { topicId: '5.7', id: 'f-5.7-06', front: 'Comenzi de port security', back: 'switchport mode access · switchport port-security · … maximum N · … violation … · … mac-address sticky', detail: 'Verificare: show port-security [interface …] · show port-security address.' },
  { topicId: '5.7', id: 'f-5.7-07', front: 'Ce apără port security?', back: 'Dispozitive neautorizate și MAC flooding (limită de adrese pe port)', detail: 'Nu criptează și nu autentifică utilizatorul (asta face 802.1X).' },
  { topicId: '5.7', id: 'f-5.7-08', front: 'DHCP snooping: starea implicită a porturilor', back: 'Toate untrusted după activare', detail: 'Marchezi trusted uplinkurile și portul serverului DHCP: ip dhcp snooping trust.' },
  { topicId: '5.7', id: 'f-5.7-09', front: 'Ce aruncă DHCP snooping pe un port untrusted?', back: 'Mesajele de server: OFFER, ACK, NAK', detail: 'Cererile clientului (DISCOVER, REQUEST) trec.' },
  { topicId: '5.7', id: 'f-5.7-10', front: 'Comenzi DHCP snooping', back: 'ip dhcp snooping · ip dhcp snooping vlan 10 · ip dhcp snooping trust · ip dhcp snooping limit rate 15', detail: 'Verificare: show ip dhcp snooping · show ip dhcp snooping binding.' },
  { topicId: '5.7', id: 'f-5.7-11', front: 'Binding table DHCP snooping', back: 'MAC, IP, lease, VLAN, port, tip dhcp-snooping', detail: 'Sursă pentru DAI și IP Source Guard; se poate salva în fișier.' },
  { topicId: '5.7', id: 'f-5.7-12', front: 'Cum funcționează DAI?', back: 'Compară perechea IP–MAC din ARP cu binding table; aruncă diferențele', detail: 'Porturile trusted nu sunt verificate; untrusted da.' },
  { topicId: '5.7', id: 'f-5.7-13', front: 'Comenzi DAI', back: 'ip arp inspection vlan 10 · ip arp inspection trust (pe uplink) · ip arp inspection validate src-mac dst-mac ip', detail: 'Verificare: show ip arp inspection [vlan 10] · show ip arp inspection interfaces.' },
  { topicId: '5.7', id: 'f-5.7-14', front: 'Host cu IP static și DAI', back: 'Nu are binding → ARP aruncat; soluție: ARP ACL sau port trusted', detail: 'ip arp inspection filter NUME vlan N.' },
  { topicId: '5.7', id: 'f-5.7-15', front: 'Greșeala clasică la DHCP snooping', back: 'Uplinkul sau portul serverului DHCP lăsat untrusted → nimeni nu mai primește adresă', detail: 'Marchezi trusted înainte de a activa snooping în producție.' },
  { topicId: '5.7', id: 'f-5.7-16', front: 'Greșeala clasică la DAI', back: 'Activat fără DHCP snooping/binding → ARP-ul legitim e aruncat', detail: 'Activează snooping, așteaptă să se populeze binding table, apoi DAI.' },
  { topicId: '5.7', id: 'f-5.7-17', front: 'DHCP starvation vs rogue DHCP', back: 'Starvation: epuizează pool-ul · Rogue: server fals care răspunde clienților', detail: 'Rogue → DHCP snooping; starvation → port security + rate limit.' },
  { topicId: '5.7', id: 'f-5.7-18', front: 'ARP spoofing: efect', back: 'Gazdele memorează asocierea falsă IP–MAC → MITM/DoS', detail: 'ARP nu are autentificare; DAI îl apără.' },
];
