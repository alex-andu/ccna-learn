import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.8 Configure and verify IPv6 addressing and prefix
export const FACTS: Fact[] = [
  { topicId: '1.8', id: 'f-1.8-01', front: 'Câți biți are o adresă IPv6?', back: '128 de biți = 8 hextete × 16 biți (4 cifre hexa)', detail: '≈3,4 × 10³⁸ adrese. IPv4: 32 de biți.' },
  { topicId: '1.8', id: 'f-1.8-02', front: 'Regulile de scurtare a unei adrese IPv6', back: '1) elimini zerourile de la începutul hextetelor · 2) „::” o singură dată pentru secvența de zero cea mai lungă', detail: 'La egalitate se scurtează prima secvență; un singur hextet 0 nu se scurtează cu „::”.' },
  { topicId: '1.8', id: 'f-1.8-03', front: 'Scurtează 2001:0db8:0000:0000:0000:ff00:0042:8329', back: '2001:db8::ff00:42:8329', detail: 'Capcană: 0100 → 100 (nu 1).' },
  { topicId: '1.8', id: 'f-1.8-04', front: 'Câte „::” are voie să aibă o adresă?', back: 'Cel mult unul', detail: 'Două „::” sunt ambigue → adresă invalidă.' },
  { topicId: '1.8', id: 'f-1.8-05', front: 'Dimensiunea antetului de bază IPv6', back: '40 de octeți, fixă', detail: 'IPv4: 20–60 de octeți.' },
  { topicId: '1.8', id: 'f-1.8-06', front: 'TTL / Protocol / ToS în IPv6', back: 'Hop Limit / Next Header / Traffic Class', detail: 'Header Checksum, IHL și câmpurile de fragmentare au dispărut din antetul de bază.' },
  { topicId: '1.8', id: 'f-1.8-07', front: 'Cine fragmentează pachetele IPv6?', back: 'Doar hostul-sursă; routerele nu fragmentează', detail: 'MTU minim al unei legături: 1280 de octeți. Routerul răspunde cu ICMPv6 „Packet Too Big”.' },
  { topicId: '1.8', id: 'f-1.8-08', front: 'Ce înlocuiește masca de subrețea în IPv6?', back: 'Lungimea prefixului (ex. /64)', detail: 'Nu există mască zecimală și nici broadcast.' },
  { topicId: '1.8', id: 'f-1.8-09', front: 'Structura unei adrese globale tipice', back: '48 biți prefix global + 16 biți Subnet ID + 64 biți Interface ID', detail: 'Din /48 rezultă 2¹⁶ = 65.536 de subrețele /64.' },
  { topicId: '1.8', id: 'f-1.8-10', front: 'De ce LAN-urile sunt /64?', back: 'SLAAC cere un Interface ID de 64 de biți (prefix + IID = 128)', detail: 'Pentru legături punct-la-punct se recomandă /127 (RFC 6164).' },
  { topicId: '1.8', id: 'f-1.8-11', front: 'Alocare tipică de prefixe', back: 'IANA → RIR → ISP/LIR → /48 (business) sau /56 (rezidențial) → /64 pe LAN', detail: 'RIPE-690. Unicast global se alocă din 2000::/3.' },
  { topicId: '1.8', id: 'f-1.8-12', front: 'Cum numeri subrețelele într-un /48?', back: 'În hexazecimal în hextetul 4: 0, 1, … 9, a, b, … f, 10, …', detail: 'Subnet ID „10” = 16 zecimal; zecimal 10 = „a”.' },
  { topicId: '1.8', id: 'f-1.8-13', front: 'Câte /64 într-un /56?', back: '256', detail: '64 − 56 = 8 biți → 2⁸. Într-un /48: 65.536.' },
  { topicId: '1.8', id: 'f-1.8-14', front: 'NDP — cele 5 mesaje ICMPv6', back: 'RS 133 · RA 134 · NS 135 · NA 136 · Redirect 137', detail: 'NDP înlocuiește ARP (NS/NA) și descoperirea de routere (RS/RA).' },
  { topicId: '1.8', id: 'f-1.8-15', front: 'Ce este SLAAC?', back: 'Hostul își face singur adresa: prefix din RA (flag A) + Interface ID propriu', detail: 'Verifică unicitatea cu DAD. Routerul nu ține evidența adreselor.' },
  { topicId: '1.8', id: 'f-1.8-16', front: 'Flag-urile RA: A, O, M', back: 'A = SLAAC · O = alte opțiuni (DNS) din DHCPv6 · M = adresa din DHCPv6', detail: 'Gateway-ul implicit vine întotdeauna din RA, nu din DHCPv6.' },
  { topicId: '1.8', id: 'f-1.8-17', front: 'Ce face „ipv6 unicast-routing”?', back: 'Activează rutarea IPv6 și trimiterea RA-urilor', detail: 'Fără ea: hostii SLAAC nu primesc prefix/gateway; routerul nu forwardează IPv6.' },
  { topicId: '1.8', id: 'f-1.8-18', front: 'Adresare statică IPv6 pe interfață', back: 'ipv6 address 2001:db8:acad:1::1/64', detail: 'Cu link-local manual: ipv6 address fe80::1 link-local' },
  { topicId: '1.8', id: 'f-1.8-19', front: '„eui-64” în ipv6 address — ce scrii?', back: 'Doar prefixul: ipv6 address 2001:db8:acad:2::/64 eui-64', detail: 'IOS completează Interface ID din MAC. Algoritmul: obiectivul 1.9.d.' },
  { topicId: '1.8', id: 'f-1.8-20', front: 'Comenzi de verificare IPv6', back: 'show ipv6 interface brief · show ipv6 interface · show ipv6 route · show ipv6 neighbors · ping', detail: 'În show ipv6 route: C = rețea /64, L = adresa routerului /128.' },
  { topicId: '1.8', id: 'f-1.8-21', front: 'Gateway-ul implicit al unui host IPv6', back: 'Adresa link-local a routerului, din RA', detail: 'De aceea se setează adesea fe80::1 pe interfețele routerului.' },
  { topicId: '1.8', id: 'f-1.8-22', front: 'Cum funcționează DAD?', back: 'NS cu sursa „::” și ținta = adresa de verificat', detail: 'Dacă primește NA, adresa este duplicat.' },
];
