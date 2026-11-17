import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 4.6. `dhcp`, `dora`, `dhcp-relay`, `apipa`, `dhcp-renew-rebind`, `broadcast-domain` sunt doar referiți (1.x/4.3).
export const TERMS: GlossaryEntry[] = [
  {
    id: 'giaddr', abbr: 'giaddr', full: 'Gateway IP Address (câmp DHCP)', ro: 'adresa interfeței relay, înscrisă în mesajul DHCP',
    what: 'Câmp din antetul mesajelor DHCP completat de un relay: conține adresa IP a interfeței pe care relay-ul a primit cererea clientului.',
    how: 'Serverul caută pool-ul care conține giaddr (ca să știe din ce subrețea vine clientul) și trimite răspunsul unicast către giaddr; relay-ul îl livrează apoi clientului.',
    where: 'În orice schimb DHCP relayat; dacă nu există pool pentru giaddr sau serverul nu are rută spre el, clientul nu primește adresă.',
    std: 'RFC 2131 / RFC 1542', topics: ['4.6'],
  },
  {
    id: 'ip-helper-address', abbr: 'ip helper-address', ro: 'comanda IOS care activează relay-ul DHCP',
    what: 'Comandă de interfață care transformă broadcast-urile UDP primite pe acea interfață (DHCP, dar și alte servicii) în unicast către adresa indicată.',
    how: 'Se configurează pe interfața dinspre clienți. Pentru DHCP, routerul completează giaddr cu adresa propriei interfețe. Se pot adăuga mai multe adrese pe aceeași interfață.',
    where: 'Pe interfețele, subinterfețele sau SVI-urile fiecărei subrețele de clienți, când serverul DHCP este în altă subrețea.',
    topics: ['4.6'],
  },
  {
    id: 'dhcp-client', abbr: 'DHCP client (IOS)', ro: 'interfață de router/switch care își ia adresa prin DHCP',
    what: 'O interfață Cisco configurată cu ip address dhcp își obține adresa, masca, gateway-ul și DNS-ul de la un server DHCP, ca un PC.',
    how: 'Interfața trimite Discover, primește Offer, trimite Request și primește Ack; instalează adresa și, dacă serverul a trimis gateway, o rută implicită cu distanță administrativă mare. Reînnoiește lease-ul la jumătatea duratei.',
    where: 'Interfața dinspre ISP a unui router de birou mic, SVI-ul de management al unui switch, echipamente care se auto-configurează.',
    std: 'RFC 2131', topics: ['4.6'],
  },
  {
    id: 'ip-forward-protocol', abbr: 'ip forward-protocol udp', ro: 'controlul serviciilor UDP retransmise de helper',
    what: 'Comandă globală care stabilește ce porturi UDP sunt retransmise ca unicast când există ip helper-address.',
    how: 'Implicit sunt incluse câteva servicii (TFTP, DNS, Time, NetBIOS, TACACS, DHCP/BOOTP); cu no ip forward-protocol udp <port> scoți un serviciu, cu ip forward-protocol udp <port> adaugi altul.',
    where: 'Pe routere care au helper-address și nu trebuie să propage, de exemplu, broadcast-uri NetBIOS.',
    topics: ['4.6'],
  },
  {
    id: 'dhcp-option-82', abbr: 'DHCP option 82', full: 'Relay Agent Information option', ro: 'informații despre locul de unde vine cererea',
    what: 'Opțiune DHCP adăugată de un relay sau de un switch, care conține identificatori (circuit-id, remote-id) ai portului/VLAN-ului prin care a intrat cererea.',
    how: 'Relay-ul inserează opțiunea în cererea trimisă serverului; serverul o poate folosi pentru politici de alocare, apoi opțiunea este eliminată la livrarea răspunsului.',
    where: 'La rețele de acces unde serverul trebuie să știe de unde vine clientul; interacționează cu DHCP snooping (5.7).',
    std: 'RFC 3046', topics: ['4.6'],
  },
];
