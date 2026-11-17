import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 2.2 Configure and verify interswitch connectivity (trunk ports, 802.1Q, native VLAN).
// `trunk` și `vlan` există deja (alte topicuri) și sunt doar referite.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'dot1q', abbr: '802.1Q', full: 'IEEE 802.1Q VLAN tagging', ro: 'standardul care adaugă un tag de 4 octeți cu VLAN ID în cadrele Ethernet',
    what: 'Standardul IEEE care permite ca mai multe VLAN-uri să circule pe aceeași legătură. Fiecare cadru primește un tag de 4 octeți care spune cărui VLAN îi aparține.',
    how: 'Tag-ul se inserează după adresa MAC sursă: TPID 0x8100 (2 octeți) și TCI (2 octeți) = PCP 3 biți + DEI 1 bit + VID 12 biți. Switch-ul adaugă tag-ul când cadrul iese pe un trunk și îl scoate când iese pe un port access; FCS-ul se recalculează. Cadrul poate ajunge la 1522 octeți. VLAN-ul nativ circulă fără tag.',
    where: 'Pe toate trunk-urile moderne, pe subinterfețele routerului (encapsulation dot1Q), la telefoane IP (voce) și la servere cu NIC-uri VLAN-aware. Alternativa veche Cisco: ISL (învechit).',
    std: 'IEEE 802.1Q', layer: 'L2', aliases: ['dot1q', 'VLAN tagging', 'IEEE 802.1Q'], topics: ['2.2', '2.1'],
  },
  {
    id: 'tpid', abbr: 'TPID', full: 'Tag Protocol Identifier', ro: 'câmpul de 16 biți (0x8100) care anunță un tag 802.1Q',
    what: 'Primul câmp al tag-ului 802.1Q, cu valoarea 0x8100. Ocupă locul unde într-un cadru Ethernet II ar fi EtherType-ul și spune receptorului că urmează un tag VLAN.',
    how: 'Receptorul citește cei doi octeți după adresa MAC sursă; dacă sunt 0x8100, interpretează următorii 2 octeți ca TCI (PCP, DEI, VID), iar EtherType-ul real vine după tag.',
    where: 'În analiza cadrelor tagate (Wireshark, Simulation mode din Packet Tracer) și în întrebări despre structura tag-ului.',
    std: 'IEEE 802.1Q', layer: 'L2', topics: ['2.2'],
  },
  {
    id: 'pcp', abbr: 'PCP', full: 'Priority Code Point (CoS, IEEE 802.1p)', ro: 'cei 3 biți de prioritate din tag-ul 802.1Q',
    what: 'Câmp de 3 biți din tag-ul 802.1Q care poartă prioritatea cadrului (0–7), numită și CoS (Class of Service). Permite ca traficul sensibil la întârziere, precum vocea, să fie tratat înaintea celui obișnuit.',
    how: 'Dispozitivul care etichetează cadrul setează valoarea (telefoanele IP marchează de regulă vocea cu 5); switch-urile o folosesc ca să aleagă coada de ieșire. Valoarea există doar pe legăturile tagate (trunk, port cu voice VLAN).',
    where: 'La voice VLAN și la QoS pe switch-uri. Se mapează ulterior la alte marcaje de QoS la trecerea prin router.',
    std: 'IEEE 802.1p / 802.1Q', layer: 'L2', aliases: ['CoS', 'Class of Service', '802.1p'], topics: ['2.2', '2.1'],
  },
  {
    id: 'native-vlan', abbr: 'native VLAN', full: 'Native VLAN (802.1Q untagged VLAN)', ro: 'VLAN-ul ale cărui cadre circulă fără tag pe un trunk',
    what: 'VLAN-ul asociat cadrelor netaggate de pe un trunk 802.1Q. Implicit este VLAN 1. Cadrele lui pleacă pe trunk fără tag, iar cadrele netaggate primite pe trunk sunt atribuite lui.',
    how: 'Se setează cu switchport trunk native vlan N. Trebuie să fie identic la ambele capete: altfel traficul unui VLAN apare în altul și CDP afișează %CDP-4-NATIVE_VLAN_MISMATCH. Pe router: encapsulation dot1Q N native. Bună practică: VLAN neutilizat (de exemplu 999), fără hosturi, ca să reduci riscul de VLAN hopping.',
    where: 'Pe toate trunk-urile. Verificare: show interfaces trunk (coloana Native vlan) și show interfaces <port> switchport. Nu se confundă cu default VLAN (1) sau VLAN-ul de management.',
    std: 'IEEE 802.1Q', layer: 'L2', aliases: ['untagged VLAN', 'PVID', 'native vlan mismatch'], topics: ['2.2', '2.1'],
  },
  {
    id: 'dtp', abbr: 'DTP', full: 'Dynamic Trunking Protocol', ro: 'protocol Cisco prin care două porturi negociază dacă devin trunk',
    what: 'Protocol proprietar Cisco care permite celor două capete ale unei legături să decidă automat dacă formează un trunk sau rămân access.',
    how: 'Fiecare port trimite cadre DTP în funcție de modul configurat: trunk și dynamic desirable cer activ trunk; dynamic auto doar acceptă; access nu negociază. Rezultate: auto + auto = access; cel puțin un capăt activ (trunk/desirable) față de auto/desirable/trunk = trunk; trunk + access = mismatch. switchport nonegotiate oprește DTP.',
    where: 'Pe switch-urile Catalyst (implicit dynamic auto pe majoritatea celor moderne; verifică cu show interfaces switchport). Din motive de securitate (switch spoofing), pe porturile utilizatorilor se setează access, iar pe trunk-uri mode trunk + nonegotiate.',
    layer: 'L2', aliases: ['Dynamic Trunking Protocol', 'dynamic auto', 'dynamic desirable', 'nonegotiate'], topics: ['2.2'],
  },
  {
    id: 'isl', abbr: 'ISL', full: 'Inter-Switch Link', ro: 'protocolul Cisco proprietar (învechit) de încapsulare pe trunk',
    what: 'Predecesorul Cisco al lui 802.1Q: un mod de a transporta mai multe VLAN-uri pe un trunk, doar între echipamente Cisco.',
    how: 'Încapsulează întregul cadru original într-un antet de 26 de octeți și adaugă 4 octeți de FCS la coadă, în loc să insereze un tag în cadru. Nu a fost standard IEEE.',
    where: 'Învechit; absent pe majoritatea switch-urilor noi (de aceea comanda switchport trunk encapsulation lipsește pe ele). Apare în examen ca „varianta proprietară” opusă lui 802.1Q.',
    layer: 'L2', aliases: ['Inter-Switch Link'], topics: ['2.2'],
  },
  {
    id: 'allowed-vlan-list', abbr: 'allowed VLAN list', full: 'Trunk allowed VLAN list', ro: 'lista VLAN-urilor care au voie să treacă pe un trunk',
    what: 'Lista configurată pe un port trunk cu switchport trunk allowed vlan, care limitează ce VLAN-uri circulă pe legătura respectivă. Implicit sunt permise toate (1–4094).',
    how: 'Cadrele unui VLAN care nu e în listă sunt ignorate pe acel trunk. Comanda cu o listă simplă înlocuiește lista existentă; add și remove o modifică, iar all, none și except sunt variante. Un VLAN permis dar inexistent pe switch nu transportă trafic.',
    where: 'Pe trunk-uri pentru izolare și reducerea domeniului de broadcast. Verificare: show interfaces trunk (primele două liste de VLAN-uri). Eroarea clasică: allowed vlan 30 în loc de allowed vlan add 30.',
    layer: 'L2', aliases: ['switchport trunk allowed vlan', 'allowed VLANs'], topics: ['2.2'],
  },
  {
    id: 'vlan-hopping', abbr: 'VLAN hopping', full: 'VLAN hopping (switch spoofing, double tagging)', ro: 'atac prin care un utilizator ajunge în VLAN-uri la care nu ar trebui să aibă acces',
    what: 'Familie de atacuri de nivel 2 în care traficul atacatorului ajunge într-un VLAN diferit de cel în care este portul lui.',
    how: 'Switch spoofing: atacatorul negociază prin DTP un trunk și primește toate VLAN-urile. Double tagging: atacatorul din native VLAN trimite un cadru cu două tag-uri; primul switch scoate tag-ul exterior (native), iar al doilea livrează cadrul în VLAN-ul din tag-ul interior; atacul e unidirecțional.',
    where: 'Se previne cu mode access explicit pe porturile utilizatorilor, nonegotiate pe trunk-uri, native VLAN neutilizat (de exemplu 999), porturi nefolosite în shutdown și allowed list restrânsă.',
    layer: 'L2', aliases: ['switch spoofing', 'double tagging'], topics: ['2.2'],
  },
];
