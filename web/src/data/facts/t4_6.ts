import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.6 DHCP client și relay
export const FACTS: Fact[] = [
  { topicId: '4.6', id: 'f-4.6-01', front: 'Cum își ia un router adresa prin DHCP?', back: 'interface → ip address dhcp → no shutdown', detail: 'Verifici cu show ip interface brief: Method = DHCP.' },
  { topicId: '4.6', id: 'f-4.6-02', front: 'De ce e nevoie de relay DHCP?', back: 'Broadcast-ul clientului nu trece de router, iar serverul e în altă subrețea', detail: 'Relay-ul îl transformă în unicast către server.' },
  { topicId: '4.6', id: 'f-4.6-03', front: 'Comanda de relay DHCP', back: 'ip helper-address <adresa serverului>', detail: 'Se configurează pe interfața dinspre clienți.' },
  { topicId: '4.6', id: 'f-4.6-04', front: 'Pe ce interfață se pune ip helper-address?', back: 'Pe interfața pe care sosesc broadcast-urile clienților (dinspre clienți)', detail: 'Nu pe cea dinspre server.' },
  { topicId: '4.6', id: 'f-4.6-05', front: 'Ce este giaddr?', back: 'Adresa interfeței relay dinspre client, scrisă în mesajul DHCP', detail: 'Alege pool-ul și arată unde se întoarce răspunsul.' },
  { topicId: '4.6', id: 'f-4.6-06', front: 'Porturile DHCP', back: 'UDP 67 (server) și UDP 68 (client)', detail: 'Relay-ul vorbește cu serverul pe 67.' },
  { topicId: '4.6', id: 'f-4.6-07', front: 'Ce primește un router client DHCP?', back: 'IP + mască, gateway (rută implicită cu AD mare), DNS, durata lease-ului', detail: 'Rută implicită doar dacă serverul trimite gateway.' },
  { topicId: '4.6', id: 'f-4.6-08', front: 'Ce are nevoie serverul DHCP pentru un LAN relayat?', back: 'Un pool care conține giaddr și o rută înapoi spre acea subrețea', detail: 'Excluderile se configurează pe server.' },
  { topicId: '4.6', id: 'f-4.6-09', front: 'PC pe 169.254.x.x în spatele unui relay', back: 'Cererea nu ajunge la server sau răspunsul nu revine', detail: 'Verifică helper-address, rute, pool, ACL pe UDP 67/68.' },
  { topicId: '4.6', id: 'f-4.6-10', front: 'Relay-ul atribuie adrese?', back: 'Nu: doar retransmite cererile și răspunsurile', detail: 'Adresele vin din pool-ul serverului.' },
  { topicId: '4.6', id: 'f-4.6-11', front: 'Ce altceva forwardează ip helper-address?', back: 'Implicit și alte broadcast-uri UDP (TFTP, DNS, Time, NetBIOS, TACACS)', detail: 'Se restrânge cu no ip forward-protocol udp <port>.' },
  { topicId: '4.6', id: 'f-4.6-12', front: 'Verificarea relay-ului pe interfață', back: 'show ip interface <if> → „Helper address is …”', detail: 'Pe server: show ip dhcp binding.' },
  { topicId: '4.6', id: 'f-4.6-13', front: 'Echivalentul relay pentru IPv6', back: 'ipv6 dhcp relay destination <adresă>', detail: 'Pe interfața dinspre clienți.' },
  { topicId: '4.6', id: 'f-4.6-14', front: 'Mai multe servere DHCP', back: 'Poți pune mai multe ip helper-address pe aceeași interfață', detail: 'Cererea se trimite la toate.' },
  { topicId: '4.6', id: 'f-4.6-15', front: 'DHCP option 82', back: 'Relay agent information: circuit-id/remote-id adăugate de relay sau switch', detail: 'Se leagă de DHCP snooping (5.7).' },
];
