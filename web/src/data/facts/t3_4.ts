import type { Fact } from '../flashcards';

// Fapte esențiale pentru 3.4 OSPFv2 single-area
export const FACTS: Fact[] = [
  { topicId: '3.4', id: 'f-3.4-01', front: 'Ce protocol IP folosește OSPFv2?', back: 'Protocolul IP 89 (direct peste IP, fără TCP sau UDP)', detail: 'Din acest motiv nu apar porturi în capturi OSPF.' },
  { topicId: '3.4', id: 'f-3.4-02', front: 'Ce tip de algoritm folosește OSPF?', back: 'Link-state, cu calcul SPF (Dijkstra)', detail: 'Fiecare router construiește singur harta și calculează rutele.' },
  { topicId: '3.4', id: 'f-3.4-03', front: 'Adresele multicast OSPF', back: '224.0.0.5 (AllSPFRouters) · 224.0.0.6 (AllDRouters)', detail: 'Hello-urile merg la 224.0.0.5; LSU-urile către DR/BDR merg la 224.0.0.6.' },
  { topicId: '3.4', id: 'f-3.4-04', front: 'Timerele implicite Hello și Dead pe Ethernet și point-to-point', back: 'Hello 10 s · Dead 40 s (4 × Hello)', detail: 'Trebuie să fie identice la ambii vecini.' },
  { topicId: '3.4', id: 'f-3.4-05', front: 'Timerele implicite pe NBMA și point-to-multipoint', back: 'Hello 30 s · Dead 120 s', detail: 'Diferă de Ethernet; o confuzie frecventă la diagnostic.' },
  { topicId: '3.4', id: 'f-3.4-06', front: 'Formula costului OSPF', back: 'cost = lățimea de bandă de referință (100 Mbps) / lățimea interfeței (Mbps), minim 1', detail: 'Rotunjire în jos. FastEthernet, GigabitEthernet și 10G au cost 1 implicit.' },
  { topicId: '3.4', id: 'f-3.4-07', front: 'Comanda pentru a schimba referința costului', back: 'auto-cost reference-bandwidth <Mbps> (în router ospf)', detail: 'Se aplică pe toate routerele, pentru costuri consecvente.' },
  { topicId: '3.4', id: 'f-3.4-08', front: 'Stările unui vecin OSPF, în ordine', back: 'Down → Init → 2-WAY → ExStart → Exchange → Loading → Full', detail: 'Pe Ethernet, 2-WAY este și momentul în care se alege DR/BDR.' },
  { topicId: '3.4', id: 'f-3.4-09', front: 'Ce înseamnă starea 2-WAY între doi DROTHER-i?', back: 'Normal: nu formează adiacență completă', detail: 'Adiacențe complete se formează doar cu DR și BDR pe segmentul broadcast.' },
  { topicId: '3.4', id: 'f-3.4-10', front: 'Ce cauză blochează un vecin în ExStart sau Exchange?', back: 'MTU diferit pe cele două interfețe', detail: 'Verifică show interfaces și ip mtu pe ambele capete.' },
  { topicId: '3.4', id: 'f-3.4-11', front: 'Ce trebuie să se potrivească pentru o adiacență?', back: 'Area ID · subnet și mască · Hello/Dead · autentificare · flag-ul stub · MTU', detail: 'Process ID și costul pot diferi; RID-ul trebuie să fie unic.' },
  { topicId: '3.4', id: 'f-3.4-12', front: 'Ce tip de mască folosește comanda network din OSPF?', back: 'Wildcard mask (inversul măștii)', detail: 'network 10.0.0.0 0.0.0.255 area 0. Masca 255.255.255.0 ar fi greșită aici.' },
  { topicId: '3.4', id: 'f-3.4-13', front: 'Wildcard mask pentru 10.0.0.0/30', back: '0.0.0.3', detail: 'Inversul lui 255.255.255.252.' },
  { topicId: '3.4', id: 'f-3.4-14', front: 'Ce face passive-interface pe o interfață?', back: 'Oprește Hello-urile pe interfață, dar rețeaua ei rămâne anunțată', detail: 'Util spre LAN-urile cu PC-uri.' },
  { topicId: '3.4', id: 'f-3.4-15', front: 'Prioritatea OSPF implicită și ce înseamnă 0', back: 'Implicit 1 · 0 = nu candidează niciodată la DR sau BDR', detail: 'Interval valid: 0–255.' },
  { topicId: '3.4', id: 'f-3.4-16', front: 'Criteriul de alegere a DR și BDR', back: 'Cea mai mare prioritate, apoi cel mai mare Router ID', detail: 'BDR este al doilea candidat; priority 0 exclude routerul.' },
  { topicId: '3.4', id: 'f-3.4-17', front: 'Este alegerea DR preemptivă?', back: 'Nu: DR-ul ales rămâne până la reset al procesului sau flap al interfeței', detail: 'Setarea unei priorități mai mari nu schimbă DR-ul imediat.' },
  { topicId: '3.4', id: 'f-3.4-18', front: 'Ce face un DROTHER cu DR și cu BDR?', back: 'Formează adiacență completă (Full) și schimbă LSA-urile', detail: 'Cu ceilalți DROTHER-i rămâne în 2-WAY.' },
  { topicId: '3.4', id: 'f-3.4-19', front: 'Ordinea de alegere a Router ID-ului OSPF', back: 'router-id manual → cel mai mare IP pe loopback up/up → cel mai mare IP pe interfață fizică up/up', detail: 'Schimbarea RID-ului cere clear ip ospf process (sau reload).' },
  { topicId: '3.4', id: 'f-3.4-20', front: 'Ce comandă verifică vecinii OSPF?', back: 'show ip ospf neighbor', detail: 'Arată starea (FULL/DR, 2WAY/DROTHER etc.) și interfața pe care e vecinul.' },
];
