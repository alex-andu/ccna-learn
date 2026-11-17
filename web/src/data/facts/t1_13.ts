import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.13 Describe switching concepts
export const FACTS: Fact[] = [
  { topicId: '1.13', id: 'f-1.13-01', front: 'Din ce câmp învață switch-ul adresele MAC?', back: 'Din MAC-ul SURSĂ al fiecărui cadru primit', detail: 'Niciodată din destinație. Broadcast și multicast nu apar ca sursă, deci nu se învață.' },
  { topicId: '1.13', id: 'f-1.13-02', front: 'După ce câmp decide switch-ul pe unde trimite cadrul?', back: 'După MAC-ul DESTINAȚIE', detail: 'Ordinea e mereu: întâi learn (sursă), apoi decide (destinație).' },
  { topicId: '1.13', id: 'f-1.13-03', front: 'Aging time implicit pe Cisco', back: '300 de secunde (5 minute)', detail: 'Se schimbă cu mac address-table aging-time; se verifică cu show mac address-table aging-time.' },
  { topicId: '1.13', id: 'f-1.13-04', front: 'Ce face switch-ul cu un unknown unicast?', back: 'Îl inundă (flood) pe toate porturile VLAN-ului, mai puțin cel de intrare', detail: 'Un router ar arunca pachetul fără rută; switch-ul nu aruncă.' },
  { topicId: '1.13', id: 'f-1.13-05', front: 'Cele trei decizii ale switch-ului', back: 'Forward (known unicast), Filter (destinația e pe același port), Flood (unknown unicast / broadcast / multicast)', detail: 'Filter = drop, pentru că destinația a primit deja cadrul.' },
  { topicId: '1.13', id: 'f-1.13-06', front: 'Ce cadre sunt inundate mereu?', back: 'Broadcast (ffff.ffff.ffff) și unknown unicast; multicast fără IGMP snooping', detail: 'Inundarea rămâne în VLAN; trunk-urile o duc la alte switch-uri.' },
  { topicId: '1.13', id: 'f-1.13-07', front: 'Structura cadrului Ethernet II', back: 'Dst MAC 6 B · Src MAC 6 B · [802.1Q 4 B] · EtherType 2 B · Payload 46–1500 B · FCS 4 B', detail: 'Preamble 7 B + SFD 1 B sunt nivel 1 și nu intră în cadru.' },
  { topicId: '1.13', id: 'f-1.13-08', front: 'Dimensiunea minimă și maximă a cadrului', back: '64 B minim; 1518 B maxim (1522 B cu tag 802.1Q)', detail: 'Sub 64 B = runt. Payload-ul e între 46 și 1500 B.' },
  { topicId: '1.13', id: 'f-1.13-09', front: 'Ce este FCS?', back: 'CRC-32 de 4 octeți la finalul cadrului, pentru detectarea erorilor', detail: 'Cadrul cu FCS greșit e aruncat; Ethernet nu retransmite.' },
  { topicId: '1.13', id: 'f-1.13-10', front: 'Store-and-forward vs cut-through', back: 'Store-and-forward verifică FCS înainte de forward; cut-through începe după MAC-ul destinație și nu verifică FCS înainte', detail: 'Cut-through = latență minimă, dar propagă cadre corupte.' },
  { topicId: '1.13', id: 'f-1.13-11', front: 'Fragment-free', back: 'Așteaptă primii 64 B (filtrează runts), apoi trimite', detail: 'Metodă istorică, din epoca hub-urilor.' },
  { topicId: '1.13', id: 'f-1.13-12', front: 'Structura unei adrese MAC', back: '48 de biți = OUI (24 b, producătorul) + 24 b specifici interfeței', detail: 'Notații: 0011.2233.4455 (Cisco), 00-11-22-33-44-55 (Windows), 00:11:22:33:44:55 (Linux/macOS).' },
  { topicId: '1.13', id: 'f-1.13-13', front: 'Bitul I/G și bitul U/L', back: 'I/G = ultimul bit al primului octet (1 = multicast/broadcast); U/L = penultimul (1 = administrată local)', detail: 'A doua cifră hex impară ⇒ multicast/broadcast; 2, 6, A, E ⇒ unicast administrat local.' },
  { topicId: '1.13', id: 'f-1.13-14', front: 'Broadcast Ethernet', back: 'ffff.ffff.ffff', detail: 'Multicast IPv4 începe cu 0100.5e; multicast IPv6 cu 3333.' },
  { topicId: '1.13', id: 'f-1.13-15', front: 'Domenii de coliziune și broadcast pe un switch', back: 'Fiecare port = un domeniu de coliziune; tot VLAN-ul = un domeniu de broadcast', detail: 'Switch-ul nu separă domeniile de broadcast; VLAN-urile și routerul o fac.' },
  { topicId: '1.13', id: 'f-1.13-16', front: 'Intrări statice în tabela MAC', back: 'Nu expiră și nu sunt șterse de clear mac address-table dynamic', detail: 'mac address-table static <mac> vlan <id> interface <if>.' },
  { topicId: '1.13', id: 'f-1.13-17', front: 'Comenzi pentru tabela MAC', back: 'show mac address-table [dynamic | address | interface | vlan | count | aging-time]; clear mac address-table dynamic', detail: 'IOS vechi: show mac-address-table (cu liniuță).' },
  { topicId: '1.13', id: 'f-1.13-18', front: 'Ce este CAM?', back: 'Memoria hardware în care se află tabela MAC, căutată după conținut într-un singur ciclu', detail: 'TCAM e varianta ternară, folosită pentru ACL/QoS.' },
  { topicId: '1.13', id: 'f-1.13-19', front: 'Mai multe MAC-uri pe același port', back: 'Semn că în spatele portului e alt switch, un hub sau un AP', detail: 'Pe un uplink între switch-uri apar MAC-urile de pe celălalt switch.' },
  { topicId: '1.13', id: 'f-1.13-20', front: 'MAC flapping', back: 'Același MAC apare repetat pe două porturi — simptom de buclă L2', detail: 'Mesaj Catalyst: %SW_MATM-4-MACFLAP_NOTIF.' },
];
