import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.9 Describe IPv6 address types.
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
// Sub-puncte oficiale: 1.9.a unicast (global, unique local, link local) · 1.9.b anycast · 1.9.c multicast · 1.9.d Modified EUI 64.
const T = '1.9';

export const Q_1_9: Question[] = [
  // ======================= Harta tipurilor =======================
  {
    id: '1.9-001', topicId: T, sub: '1.9', type: 'single', difficulty: 1,
    stem: 'Care dintre următoarele NU este un tip de adresă în IPv6?',
    options: [
      { id: 'a', text: 'Broadcast', correct: true, why: 'IPv6 nu are broadcast; funcțiile lui sunt preluate de multicast (de exemplu ff02::1 pentru toate nodurile).' },
      { id: 'b', text: 'Unicast', correct: false, why: 'Există: adresă către o singură interfață (global, ULA, link-local).' },
      { id: 'c', text: 'Anycast', correct: false, why: 'Există: o adresă partajată de mai multe noduri, livrată celui mai apropiat.' },
      { id: 'd', text: 'Multicast', correct: false, why: 'Există: adrese din ff00::/8, către un grup de noduri.' },
    ],
    explanation: 'Cele trei tipuri sunt unicast, anycast și multicast. Orice răspuns cu „IPv6 broadcast” este greșit.',
  },
  {
    id: '1.9-002', topicId: T, sub: '1.9', type: 'single', difficulty: 1,
    stem: 'Câte adrese IPv6 poate avea simultan o interfață?',
    options: [
      { id: 'a', text: 'Mai multe: cel puțin o link-local, plus adrese globale/ULA și grupuri multicast', correct: true, why: 'Adresa link-local este obligatorie, iar interfața poate avea și mai multe adrese unicast, plus apartenența la grupuri multicast.' },
      { id: 'b', text: 'Exact una', correct: false, why: 'Spre deosebire de obiceiul din IPv4, o interfață IPv6 are în mod normal mai multe adrese în același timp.' },
      { id: 'c', text: 'Maximum două: una IPv4 și una IPv6', correct: false, why: 'Nu există o astfel de limită.' },
      { id: 'd', text: 'Doar adrese globale', correct: false, why: 'Adresa link-local există mereu, chiar și fără adresă globală.' },
    ],
    explanation: 'O interfață IPv6 are de regulă: link-local + GUA (și/sau ULA) + all-nodes + solicited-node (+ all-routers pe routere).',
  },

  // ======================= 1.9.a — GUA și speciale =======================
  {
    id: '1.9-003', topicId: T, sub: '1.9.a', type: 'single', difficulty: 1,
    stem: 'Care dintre următoarele este o adresă unicast globală (GUA)?',
    options: [
      { id: 'a', text: '2a02:2f0a:1::1', correct: true, why: 'Începe cu 2, deci face parte din 2000::/3, blocul din care se alocă adrese unicast globale.' },
      { id: 'b', text: 'fd12:3456:789a::1', correct: false, why: 'Începe cu fd: este o adresă ULA (fc00::/7).' },
      { id: 'c', text: 'fe80::1', correct: false, why: 'Este link-local (fe80::/10), valabilă doar pe legătură.' },
      { id: 'd', text: 'ff02::1', correct: false, why: 'Începe cu ff: este multicast (toate nodurile pe legătură).' },
    ],
    explanation: 'GUA = 2000::/3 (prima cifră hexa 2 sau 3). Atenție: 2001:db8::/32 este rezervat documentației, deci nu se rutează în Internet.',
  },
  {
    id: '1.9-004', topicId: T, sub: '1.9.a', type: 'single', difficulty: 1,
    stem: 'Care este adresa de loopback IPv6?',
    options: [
      { id: 'a', text: '::1', correct: true, why: 'Este adresa ::1/128, echivalentul lui 127.0.0.1, dar o singură adresă (nu un bloc /8).' },
      { id: 'b', text: '::', correct: false, why: 'Este adresa nespecificată (toți biții 0), nu loopback.' },
      { id: 'c', text: '::127', correct: false, why: 'Nu este adresa de loopback; cifrele 127 din IPv4 nu se transferă în IPv6.' },
      { id: 'd', text: 'fe80::1', correct: false, why: 'Este o adresă link-local, folosită pe o legătură reală, nu loopback.' },
    ],
    explanation: 'Loopback = ::1/128. ping ::1 testează stiva IPv6 locală, la fel ca ping 127.0.0.1 în IPv4.',
  },
  {
    id: '1.9-005', topicId: T, sub: '1.9.a', type: 'single', difficulty: 2,
    stem: 'Pentru ce se folosește adresa :: (nespecificată)?',
    options: [
      { id: 'a', text: 'Ca adresă sursă în mesaje trimise înainte ca nodul să aibă o adresă, de exemplu la DAD', correct: true, why: 'Un nod care încă nu are adresă validă folosește :: ca sursă (de exemplu într-un Neighbor Solicitation de verificare a duplicatelor).' },
      { id: 'b', text: 'Ca rută implicită configurată pe interfață', correct: false, why: 'Ruta implicită este ::/0, o rută, nu o adresă de interfață.' },
      { id: 'c', text: 'Ca adresă de loopback', correct: false, why: 'Loopback este ::1.' },
      { id: 'd', text: 'Ca adresă de broadcast', correct: false, why: 'IPv6 nu are broadcast.' },
    ],
    explanation: ':: nu se configurează pe interfețe; apare ca sursă temporară. Nu o confunda cu ::/0 (ruta implicită) sau ::1 (loopback).',
  },

  // ======================= 1.9.a — ULA =======================
  {
    id: '1.9-006', topicId: T, sub: '1.9.a', type: 'single', difficulty: 1,
    stem: 'Ce prefix au adresele Unique Local (ULA)?',
    options: [
      { id: 'a', text: 'fc00::/7 (în practică fd00::/8)', correct: true, why: 'Primii 7 biți sunt 1111110; cu bitul L = 1, adresele reale încep cu fd.' },
      { id: 'b', text: 'fe80::/10', correct: false, why: 'Este prefixul link-local.' },
      { id: 'c', text: 'fec0::/10', correct: false, why: 'Este prefixul site-local, depreciat; nu mai este folosit.' },
      { id: 'd', text: '2000::/3', correct: false, why: 'Este spațiul unicast global.' },
    ],
    explanation: 'ULA = fc00::/7 (RFC 4193). Distractorii obișnuiți: fec0::/10 (site-local, depreciat) și fe80::/10 (link-local).',
  },
  {
    id: '1.9-007', topicId: T, sub: '1.9.a', type: 'single', difficulty: 1,
    stem: 'Cu ce din IPv4 se aseamănă cel mai mult adresele ULA?',
    options: [
      { id: 'a', text: 'Adresele private RFC 1918 (nerutate pe Internet)', correct: true, why: 'Ambele sunt pentru uz intern și nu sunt rutate pe Internet. Diferența: ULA nu sunt gândite pentru NAT.' },
      { id: 'b', text: 'Adresele APIPA 169.254.0.0/16', correct: false, why: 'APIPA seamănă cu link-local din IPv6, nu cu ULA.' },
      { id: 'c', text: 'Adresele publice', correct: false, why: 'ULA nu sunt rutate global, deci nu seamănă cu adresele publice.' },
      { id: 'd', text: 'Adresele de multicast 224.0.0.0/4', correct: false, why: 'Multicast este alt tip de adrese, cu rol diferit.' },
    ],
    explanation: 'ULA = „RFC 1918 pentru IPv6”, dar un host IPv6 are de regulă și o adresă globală, deci NAT nu este necesar.',
  },
  {
    id: '1.9-008', topicId: T, sub: '1.9.a', type: 'single', difficulty: 2,
    stem: 'De ce este Global ID-ul de 40 de biți dintr-o adresă ULA generat pseudo-aleatoriu?',
    options: [
      { id: 'a', text: 'Ca să fie improbabil ca două organizații să aleagă același prefix, de exemplu la o fuziune sau printr-un VPN', correct: true, why: 'Spre deosebire de RFC 1918, unde multe organizații aleg 10.0.0.0/24 sau 192.168.1.0/24, un Global ID aleatoriu reduce drastic riscul suprapunerilor.' },
      { id: 'b', text: 'Pentru a-l ascunde de ISP', correct: false, why: 'Aleatorietatea nu are rol de confidențialitate față de ISP; ULA nici nu ajunge pe Internet.' },
      { id: 'c', text: 'Pentru că standardul interzice adresele alese manual', correct: false, why: 'Standardul recomandă generarea aleatorie, dar scopul este evitarea coliziunilor, nu o interdicție.' },
      { id: 'd', text: 'Pentru că astfel adresele devin rutabile global', correct: false, why: 'ULA nu sunt rutabile global, indiferent de Global ID.' },
    ],
    explanation: 'Structura: fd + Global ID 40 de biți + Subnet ID 16 biți + Interface ID 64 de biți.',
  },

  // ======================= 1.9.a — link-local =======================
  {
    id: '1.9-009', topicId: T, sub: '1.9.a', type: 'single', difficulty: 1,
    stem: 'Care este blocul de adrese link-local IPv6?',
    options: [
      { id: 'a', text: 'fe80::/10', correct: true, why: 'Intervalul rezervat este fe80–febf; în practică adresele reale sunt fe80::/64.' },
      { id: 'b', text: 'fc00::/7', correct: false, why: 'Este blocul ULA.' },
      { id: 'c', text: 'ff02::/16', correct: false, why: 'Este un bloc multicast cu scope link-local, nu adrese unicast link-local.' },
      { id: 'd', text: '169.254.0.0/16', correct: false, why: 'Este link-local din IPv4 (APIPA), nu din IPv6.' },
    ],
    explanation: 'Link-local IPv6 = fe80::/10 (efectiv fe80::/64).',
  },
  {
    id: '1.9-010', topicId: T, sub: '1.9.a', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre adresele link-local IPv6 sunt corecte?',
    options: [
      { id: 'a', text: 'Nu sunt transmise mai departe de routere', correct: true, why: 'Sunt valabile doar pe legătura locală; un pachet cu sursă sau destinație fe80:: nu trece de router.' },
      { id: 'b', text: 'Apar automat pe orice interfață pe care este activat IPv6', correct: true, why: 'Se generează automat (de regulă din MAC sau aleatoriu), fără configurare și fără server.' },
      { id: 'c', text: 'Trebuie să fie unice în întreaga rețea', correct: false, why: 'Trebuie să fie unice doar pe propria legătură; aceeași fe80::1 poate exista pe interfețe diferite.' },
      { id: 'd', text: 'Încep cu fd', correct: false, why: 'Prefixul fd aparține adreselor ULA.' },
    ],
    explanation: 'Link-local: automată, valabilă doar pe legătură, folosită de NDP și ca gateway implicit al hostilor.',
  },
  {
    id: '1.9-011', topicId: T, sub: '1.9.a', type: 'single', difficulty: 2,
    stem: 'Ce adresă folosește de obicei un host IPv6 ca gateway implicit?',
    options: [
      { id: 'a', text: 'Adresa link-local a routerului, aflată din Router Advertisement', correct: true, why: 'RA-ul vine de la adresa link-local a routerului; hostul o păstrează ca next-hop implicit. De aceea se setează adesea fe80::1.' },
      { id: 'b', text: 'Adresa de broadcast a rețelei', correct: false, why: 'IPv6 nu are adresă de broadcast.' },
      { id: 'c', text: 'Adresa nespecificată ::', correct: false, why: ':: nu poate fi gateway; este folosită doar ca sursă temporară.' },
      { id: 'd', text: 'Adresa de loopback ::1', correct: false, why: 'Loopback este adresa hostului însuși.' },
    ],
    explanation: 'Gateway-ul implicit = link-local a routerului (din RA). DHCPv6 nu furnizează gateway.',
  },
  {
    id: '1.9-012', topicId: T, sub: '1.9.a', type: 'single', difficulty: 2,
    stem: 'Este permis să configurezi aceeași adresă fe80::1 pe două interfețe diferite ale aceluiași router?',
    options: [
      { id: 'a', text: 'Da — o adresă link-local trebuie să fie unică doar pe propria legătură', correct: true, why: 'Fiecare interfață este pe altă legătură; routerul știe interfața din care a primit un pachet. Aceeași fe80::1 este chiar o practică folosită.' },
      { id: 'b', text: 'Nu — orice adresă IPv6 trebuie să fie unică pe router', correct: false, why: 'Regula de unicitate la nivel de router se aplică adreselor globale, nu celor link-local.' },
      { id: 'c', text: 'Nu — fe80::1 este rezervată de IANA', correct: false, why: 'fe80::1 nu este rezervată; este o valoare liberă din blocul link-local.' },
      { id: 'd', text: 'Doar dacă interfețele sunt în același VLAN', correct: false, why: 'Aceeași adresă link-local în același VLAN ar fi duplicat; permis este pe legături diferite.' },
    ],
    explanation: 'De aceea hostii folosesc zona %interfață (de exemplu fe80::1%12): aceeași adresă poate exista pe mai multe legături.',
  },

  // ======================= 1.9.b — anycast =======================
  {
    id: '1.9-013', topicId: T, sub: '1.9.b', type: 'single', difficulty: 1,
    stem: 'Cum este livrat un pachet trimis la o adresă anycast?',
    options: [
      { id: 'a', text: 'La cel mai apropiat dispozitiv care are acea adresă (după metrica de rutare)', correct: true, why: 'Aceeași adresă este configurată pe mai multe noduri; rutarea alege destinația cea mai apropiată.' },
      { id: 'b', text: 'La toate dispozitivele care au acea adresă', correct: false, why: 'Aceasta este multicast (către toți membrii grupului).' },
      { id: 'c', text: 'La un singur dispozitiv unic în rețea', correct: false, why: 'Aceasta este unicast, unde adresa este unică.' },
      { id: 'd', text: 'La toți hostii din subrețea', correct: false, why: 'Așa funcționa broadcast-ul din IPv4, care nu există în IPv6.' },
    ],
    explanation: 'Unicast = unul; anycast = unul, cel mai apropiat; multicast = toți din grup.',
  },
  {
    id: '1.9-014', topicId: T, sub: '1.9.b', type: 'single', difficulty: 2,
    stem: 'Cum se deosebește o adresă anycast de una unicast?',
    options: [
      { id: 'a', text: 'Nu are un prefix propriu: este o adresă unicast marcată în configurare cu cuvântul-cheie anycast', correct: true, why: 'Pe Cisco: ipv6 address …/64 anycast. Sintactic, adresa arată ca orice adresă unicast.' },
      { id: 'b', text: 'Începe întotdeauna cu ff', correct: false, why: 'Prefixul ff00::/8 este multicast.' },
      { id: 'c', text: 'Are 64 de biți în loc de 128', correct: false, why: 'Toate adresele IPv6 au 128 de biți.' },
      { id: 'd', text: 'Începe întotdeauna cu fe80', correct: false, why: 'Prefixul fe80::/10 este link-local.' },
    ],
    explanation: 'Anycast este luată din spațiul unicast; configurația (nu forma adresei) o face anycast.',
  },
  {
    id: '1.9-015', topicId: T, sub: '1.9.b', type: 'single', difficulty: 2,
    stem: 'Care este un exemplu tipic de utilizare a anycast?',
    options: [
      { id: 'a', text: 'Servere DNS rădăcină sau CDN-uri: aceeași adresă anunțată din mai multe locații, clientul ajungând la cea mai apropiată', correct: true, why: 'Reduce latența și oferă redundanță: dacă un nod cade, traficul este preluat de următorul cel mai apropiat.' },
      { id: 'b', text: 'Trimiterea unui flux video către toți abonații unui grup', correct: false, why: 'Aceasta este multicast.' },
      { id: 'c', text: 'Verificarea unicității unei adrese', correct: false, why: 'Aceasta este DAD, cu mesaje NS.' },
      { id: 'd', text: 'Testul stivei locale', correct: false, why: 'Aceasta se face cu loopback (::1).' },
    ],
    explanation: 'La CCNA contează conceptul „unul către cel mai apropiat” și faptul că adresa este din spațiul unicast.',
  },

  // ======================= 1.9.c — multicast =======================
  {
    id: '1.9-016', topicId: T, sub: '1.9.c', type: 'single', difficulty: 1,
    stem: 'Ce prefix au adresele multicast IPv6?',
    options: [
      { id: 'a', text: 'ff00::/8', correct: true, why: 'Primul octet este ff (toți biții 1); urmează flag-urile, scope-ul și group ID-ul.' },
      { id: 'b', text: 'fe00::/8', correct: false, why: 'fe80::/10 este link-local; fe00::/8 nu este multicast.' },
      { id: 'c', text: '2000::/3', correct: false, why: 'Este spațiul unicast global.' },
      { id: 'd', text: 'fc00::/7', correct: false, why: 'Este spațiul ULA.' },
    ],
    explanation: 'Multicast = ff00::/8.',
  },
  {
    id: '1.9-017', topicId: T, sub: '1.9.c', type: 'single', difficulty: 1,
    stem: 'Ce reprezintă adresa ff02::1?',
    options: [
      { id: 'a', text: 'Toate nodurile de pe legătura locală (all-nodes)', correct: true, why: 'ff02 = multicast cu scope link-local; ::1 = grupul „toate nodurile”. Este înlocuitorul broadcast-ului.' },
      { id: 'b', text: 'Toate routerele de pe legătură', correct: false, why: 'Toate routerele este ff02::2.' },
      { id: 'c', text: 'Toate routerele OSPF', correct: false, why: 'OSPF folosește ff02::5 (și ff02::6 pentru DR).' },
      { id: 'd', text: 'Un server DHCPv6', correct: false, why: 'Serverele și relay-urile DHCPv6 sunt la ff02::1:2.' },
    ],
    explanation: 'ff02::1 = toate nodurile, ff02::2 = toate routerele; cifra a patra (2) indică scope-ul link-local.',
  },
  {
    id: '1.9-018', topicId: T, sub: '1.9.c', type: 'single', difficulty: 2,
    stem: 'Un host trimite un Router Solicitation (RS). La ce adresă destinație ajunge mesajul?',
    options: [
      { id: 'a', text: 'ff02::2 (toate routerele)', correct: true, why: 'Hostul vrea să afle imediat prefixul, iar routerele ascultă grupul all-routers.' },
      { id: 'b', text: 'ff02::1 (toate nodurile)', correct: false, why: 'ff02::1 este folosit de RA-urile neîntrebate, nu de RS.' },
      { id: 'c', text: 'ff02::5 (OSPF)', correct: false, why: 'Este grupul protocolului OSPF.' },
      { id: 'd', text: '255.255.255.255', correct: false, why: 'Este broadcast-ul IPv4; nu există în IPv6.' },
    ],
    explanation: 'RS → ff02::2. RA neîntrebat → ff02::1. NS → solicited-node.',
  },
  {
    id: '1.9-019', topicId: T, sub: '1.9.c', type: 'single', difficulty: 2,
    stem: 'Ce adresă multicast folosesc routerele OSPFv3?',
    options: [
      { id: 'a', text: 'ff02::5 (și ff02::6 pentru DR/BDR)', correct: true, why: 'Echivalent cu 224.0.0.5 și 224.0.0.6 din OSPFv2.' },
      { id: 'b', text: 'ff02::9', correct: false, why: 'Este grupul RIPng, alt protocol de rutare, nu OSPF.' },
      { id: 'c', text: 'ff02::a', correct: false, why: 'Este EIGRP pentru IPv6.' },
      { id: 'd', text: 'ff02::1:2', correct: false, why: 'Este grupul serverelor și relay-urilor DHCPv6.' },
    ],
    explanation: 'OSPF ff02::5/6 · RIPng ff02::9 · EIGRP ff02::a · DHCPv6 ff02::1:2.',
  },
  {
    id: '1.9-020', topicId: T, sub: '1.9.c', type: 'single', difficulty: 2,
    stem: 'Ce scope are adresa multicast ff05::2?',
    options: [
      { id: 'a', text: 'Site-local (a patra cifră = 5)', correct: true, why: 'Cifra de scope: 1 interfață, 2 legătură, 5 site, 8 organizație, e global. ff05::2 = toate routerele din site.' },
      { id: 'b', text: 'Link-local', correct: false, why: 'Link-local ar fi ff02::.' },
      { id: 'c', text: 'Global', correct: false, why: 'Global ar fi ff0e::.' },
      { id: 'd', text: 'Interface-local', correct: false, why: 'Interface-local ar fi ff01::.' },
    ],
    explanation: 'Scope-ul se citește în a patra cifră hexa a adresei multicast.',
  },

  // ======================= 1.9.c — solicited-node =======================
  {
    id: '1.9-021', topicId: T, sub: '1.9.c', type: 'single', difficulty: 2,
    stem: 'Care este grupul solicited-node pentru adresa 2001:db8:acad:1::1?',
    options: [
      { id: 'a', text: 'ff02::1:ff00:1', correct: true, why: 'Ultimii 24 de biți ai adresei sunt 00:0001 → ff02::1:ff + 00:0001 = ff02::1:ff00:1.' },
      { id: 'b', text: 'ff02::1', correct: false, why: 'Este grupul „toate nodurile”, nu solicited-node.' },
      { id: 'c', text: 'ff02::1:ff01:0', correct: false, why: 'Nu se potrivesc ultimii 24 de biți ai adresei (00:0001).' },
      { id: 'd', text: 'ff02::2:ff00:1', correct: false, why: 'Prefixul corect este ff02::1:ff…; „2” nu este parte din grup.' },
    ],
    explanation: 'Solicited-node = ff02::1:ff + ultimii 24 de biți (6 cifre hexa) ai adresei.',
  },
  {
    id: '1.9-022', topicId: T, sub: '1.9.c', type: 'single', difficulty: 2,
    stem: 'Câți biți din adresa unicast se copiază în adresa solicited-node multicast?',
    options: [
      { id: 'a', text: 'Ultimii 24 de biți', correct: true, why: 'Prefixul ff02::1:ff00:0/104 are 104 biți; restul de 24 vine din adresa unicast.' },
      { id: 'b', text: 'Primii 64 de biți', correct: false, why: 'Prefixul de rețea nu este folosit; contează sfârșitul adresei.' },
      { id: 'c', text: 'Ultimii 64 de biți', correct: false, why: 'Interface ID-ul întreg nu este copiat; doar ultimii 24 de biți.' },
      { id: 'd', text: 'Toți cei 128 de biți', correct: false, why: 'Ar rezulta o adresă la fel de lungă ca adresa originală, nu un grup de 2²⁴ grupuri.' },
    ],
    explanation: '104 + 24 = 128. Sunt 2²⁴ grupuri posibile, deci în practică un grup are puțini membri.',
  },
  {
    id: '1.9-023', topicId: T, sub: '1.9.c', type: 'single', difficulty: 2,
    stem: 'De ce este mai eficient solicited-node multicast decât ARP-ul cu broadcast din IPv4?',
    options: [
      { id: 'a', text: 'Neighbor Solicitation ajunge, în practică, doar la nodul căutat; ceilalți îl filtrează în hardware', correct: true, why: 'Placa de rețea mapează grupul pe un MAC multicast 33:33:ff:XX:XX:XX și ignoră ce nu o privește; broadcast-ul ARP întrerupe toate nodurile.' },
      { id: 'b', text: 'Pentru că folosește TCP', correct: false, why: 'NDP rulează peste ICMPv6, nu TCP.' },
      { id: 'c', text: 'Pentru că este criptat', correct: false, why: 'NDP nu este criptat implicit.' },
      { id: 'd', text: 'Pentru că ocolește routerul', correct: false, why: 'Rezolvarea adresei MAC se face oricum doar pe legătura locală.' },
    ],
    explanation: 'ARP deranjează toate hosturile din segment; NS către solicited-node deranjează aproape doar țintei.',
  },
  {
    id: '1.9-024', topicId: T, sub: '1.9.c', type: 'single', difficulty: 3,
    stem: 'Care este grupul solicited-node pentru adresa fe80::211:22ff:fe33:4455?',
    options: [
      { id: 'a', text: 'ff02::1:ff33:4455', correct: true, why: 'Ultimii 24 de biți ai adresei sunt 33:4455 → ff02::1:ff33:4455.' },
      { id: 'b', text: 'ff02::1:ff11:22ff', correct: false, why: 'Aceasta ar proveni din altă parte a adresei; contează doar sfârșitul (ultimii 6 cifre hexa).' },
      { id: 'c', text: 'ff02::1:ff00:1', correct: false, why: 'Ar corespunde unei adrese care se termină în 00:0001 (de exemplu fe80::1).' },
      { id: 'd', text: 'ff02::2', correct: false, why: 'Este grupul all-routers.' },
    ],
    explanation: 'Aceeași regulă: ff02::1:ff + ultimele 6 cifre hexa. Aici 33:4455.',
  },

  // ======================= 1.9.d — Modified EUI-64 =======================
  {
    id: '1.9-025', topicId: T, sub: '1.9.d', type: 'single', difficulty: 2,
    stem: 'Care este Interface ID-ul EUI-64 pentru MAC-ul 00:11:22:33:44:55?',
    options: [
      { id: 'a', text: '0211:22ff:fe33:4455', correct: true, why: 'FFFE se inserează la mijloc; primul octet 00 devine 02 (bitul 7 se inversează).' },
      { id: 'b', text: '0011:22ff:fe33:4455', correct: false, why: 'Lipsește inversarea bitului 7: primul octet ar trebui să fie 02.' },
      { id: 'c', text: '0211:22ff:ff33:4455', correct: false, why: 'Se inserează FFFE, nu FFFF.' },
      { id: 'd', text: 'fffe:0011:2233:4455', correct: false, why: 'FFFE se inserează la mijloc (după al 3-lea octet), nu la început.' },
    ],
    explanation: '00:11:22 | FF:FE | 33:44:55, apoi 00 → 02 (flip bit 7).',
  },
  {
    id: '1.9-026', topicId: T, sub: '1.9.d', type: 'single', difficulty: 2,
    stem: 'Care este Interface ID-ul EUI-64 pentru MAC-ul AC:DE:48:00:11:22?',
    options: [
      { id: 'a', text: 'aede:48ff:fe00:1122', correct: true, why: 'Primul octet AC = 1010 1100; inversezi bitul 0x02 (0 → 1) și obții 1010 1110 = AE.' },
      { id: 'b', text: 'acde:48ff:fe00:1122', correct: false, why: 'Lipsește inversarea bitului 7: AC ar trebui să devină AE.' },
      { id: 'c', text: 'cede:48ff:fe00:1122', correct: false, why: 'Bitul inversat are valoarea 0x02 (a doua cifră hexa C ↔ E), nu 0x04; AC devine AE, nu CE.' },
      { id: 'd', text: 'abde:48ff:fe00:1122', correct: false, why: 'Calculul AB este greșit; inversarea bitului 0x02 din AC dă AE.' },
    ],
    explanation: 'Regula rapidă: a doua cifră a primului octet: C ↔ E. Deci AC → AE.',
  },
  {
    id: '1.9-027', topicId: T, sub: '1.9.d', type: 'single', difficulty: 3,
    stem: 'Care este Interface ID-ul EUI-64 pentru MAC-ul 02:50:56:AB:CD:EF?',
    options: [
      { id: 'a', text: '0050:56ff:feab:cdef', correct: true, why: 'Primul octet 02 are deja bitul 7 setat; inversarea îl face 0 → 00. Este o inversare, nu o setare la 1.' },
      { id: 'b', text: '0250:56ff:feab:cdef', correct: false, why: 'Ar însemna că bitul nu a fost inversat deloc.' },
      { id: 'c', text: '0450:56ff:feab:cdef', correct: false, why: 'Nu corespunde nici unei operații pe bitul 0x02.' },
      { id: 'd', text: '0150:56ff:feab:cdef', correct: false, why: 'Schimbă bitul 0x01 (individual/group), nu 0x02 (universal/local).' },
    ],
    explanation: 'Capcană clasică: flip (XOR), nu „setează pe 1”. 02 ↔ 00.',
  },
  {
    id: '1.9-028', topicId: T, sub: '1.9.d', type: 'single', difficulty: 1,
    stem: 'Unde se inserează valoarea FFFE într-o adresă MAC de 48 de biți pentru a obține EUI-64?',
    options: [
      { id: 'a', text: 'La mijloc, între primii 3 octeți (OUI) și ultimii 3', correct: true, why: 'MAC-ul se împarte în două jumătăți de 24 de biți, iar FFFE (16 biți) se pune între ele, rezultând 64 de biți.' },
      { id: 'b', text: 'La începutul MAC-ului', correct: false, why: 'Ar muta OUI-ul și ar strica formatul.' },
      { id: 'c', text: 'La sfârșitul MAC-ului', correct: false, why: 'Formatul cere FFFE între OUI și restul.' },
      { id: 'd', text: 'Nicăieri, adresa MAC se folosește direct', correct: false, why: '48 de biți nu umplu Interface ID-ul de 64 de biți; FFFE completează cei 16 biți lipsă.' },
    ],
    explanation: '24 + 16 + 24 = 64 de biți.',
  },
  {
    id: '1.9-029', topicId: T, sub: '1.9.d', type: 'single', difficulty: 3,
    stem: 'Un Interface ID este 0211:22ff:fe33:4455. Care a fost adresa MAC originală?',
    options: [
      { id: 'a', text: '00:11:22:33:44:55', correct: true, why: 'Scoți ff:fe din mijloc și inversezi din nou bitul 7: 02 → 00.' },
      { id: 'b', text: '02:11:22:33:44:55', correct: false, why: 'Ai scos FFFE, dar ai uitat să inversezi din nou bitul 7.' },
      { id: 'c', text: '00:11:22:ff:fe:33', correct: false, why: 'FFFE nu a fost scos și ordinea octeților nu este cea corectă.' },
      { id: 'd', text: '11:22:33:44:55:00', correct: false, why: 'Octeții au fost deplasați; ordinea trebuie păstrată.' },
    ],
    explanation: 'Inversul: scoate ff:fe, inversează bitul 7. Semn de EUI-64: ff:fe în hextetele 6–7.',
  },
  {
    id: '1.9-030', topicId: T, sub: '1.9.d', type: 'single', difficulty: 2,
    stem: 'De ce folosesc sistemele moderne (Windows, macOS, Android) rar EUI-64 pentru Interface ID?',
    options: [
      { id: 'a', text: 'Un Interface ID derivat din MAC este constant între rețele și permite urmărirea dispozitivului; se folosesc identificatori aleatori sau temporari', correct: true, why: 'RFC 7217 (IID stabil, dar diferit per rețea) și RFC 8981 (adrese temporare) reduc posibilitatea corelării activității unui dispozitiv.' },
      { id: 'b', text: 'Pentru că EUI-64 nu funcționează cu SLAAC', correct: false, why: 'Funcționează perfect cu SLAAC; routerele Cisco îl folosesc.' },
      { id: 'c', text: 'Pentru că adresele MAC s-au epuizat', correct: false, why: 'Epuizarea MAC-urilor nu este motivul; motivul este confidențialitatea.' },
      { id: 'd', text: 'Pentru că EUI-64 cere un server DHCPv6', correct: false, why: 'EUI-64 nu implică niciun server.' },
    ],
    explanation: 'Routerele Cisco folosesc totuși EUI-64 pentru adresa link-local automată și pentru comanda eui-64.',
  },

  // ======================= Configurare =======================
  {
    id: '1.9-031', topicId: T, sub: '1.9', type: 'single', difficulty: 2,
    stem: 'În „show ipv6 interface g0/0” vezi, la „Joined group address(es)”, FF02::1, FF02::2 și FF02::1:FF00:1. Ce reprezintă FF02::1:FF00:1?',
    options: [
      { id: 'a', text: 'Grupul solicited-node pentru adresele care se termină în 00:0001', correct: true, why: 'Este ff02::1:ff + ultimii 24 de biți (00:0001), grup la care interfața aderă automat pentru fiecare adresă unicast.' },
      { id: 'b', text: 'Grupul all-routers', correct: false, why: 'All-routers este FF02::2.' },
      { id: 'c', text: 'Grupul DHCPv6', correct: false, why: 'DHCPv6 folosește FF02::1:2, nu FF02::1:FF00:1.' },
      { id: 'd', text: 'Adresa link-local a interfeței', correct: false, why: 'Link-local începe cu fe80, nu cu ff02.' },
    ],
    explanation: 'FF02::1 = all-nodes, FF02::2 = all-routers (după ipv6 unicast-routing), FF02::1:FFxx:xxxx = solicited-node.',
  },
  {
    id: '1.9-032', topicId: T, sub: '1.9', type: 'single', difficulty: 2,
    stem: 'În ipconfig apare „Temporary IPv6 Address”. Ce este?',
    options: [
      { id: 'a', text: 'O adresă generată aleatoriu (privacy, RFC 8981), folosită pentru conexiuni ieșite', correct: true, why: 'Se schimbă periodic și ascunde Interface ID-ul stabil al dispozitivului.' },
      { id: 'b', text: 'Adresa link-local', correct: false, why: 'Link-local apare separat, ca „Link-local IPv6 Address”.' },
      { id: 'c', text: 'O adresă DHCPv6 cu lease scurt', correct: false, why: 'Adresa temporară este generată de host, nu primită de la DHCPv6.' },
      { id: 'd', text: 'O adresă anycast', correct: false, why: 'Anycast este o proprietate a configurației, nu o adresă „temporară”.' },
    ],
    explanation: 'Un host are de obicei o adresă globală stabilă și una sau mai multe temporare.',
  },

  // ======================= Recapitulare =======================
  {
    id: '1.9-033', topicId: T, sub: '1.9.a', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare adresă cu tipul ei.',
    leftLabel: 'Adresă', rightLabel: 'Tip',
    pairs: [
      { left: 'fe80::1', right: 'Link-local', why: 'Începe cu fe80, valabilă doar pe legătura locală.' },
      { left: 'fd12:3456:789a::1', right: 'ULA', why: 'Începe cu fd, din fc00::/7.' },
      { left: '2a02:2f0a:1::1', right: 'Unicast global', why: 'Începe cu 2 → 2000::/3.' },
      { left: 'ff02::1', right: 'Multicast (all-nodes)', why: 'Începe cu ff; scope 2 = link-local.' },
      { left: '::1', right: 'Loopback', why: 'Adresa „eu însumi”, o singură adresă.' },
    ],
    distractors: [{ text: 'Broadcast', why: 'IPv6 nu are broadcast; răspunsul nu corespunde niciunei adrese.' }],
    explanation: 'Recunoaște tipul după primii biți: 2/3 = GUA, fc/fd = ULA, fe80 = link-local, ff = multicast.',
  },
  {
    id: '1.9-034', topicId: T, sub: '1.9.d', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii prin care se construiește un Interface ID Modified EUI-64 dintr-un MAC.',
    items: [
      { text: 'Pornești de la MAC-ul de 48 de biți', why: 'Exemplu: 00:11:22:33:44:55.' },
      { text: 'Împarți MAC-ul în două jumătăți de câte 24 de biți', why: '001122 și 334455.' },
      { text: 'Inserezi FFFE între cele două jumătăți', why: 'Rezultă 64 de biți: 0011:22FF:FE33:4455.' },
      { text: 'Inversezi bitul 7 din primul octet', why: '00 → 02: Interface ID = 0211:22ff:fe33:4455.' },
      { text: 'Lipești prefixul (de exemplu fe80:: sau 2001:db8:acad:1::)', why: 'Prefix + Interface ID = adresa completă.' },
    ],
    explanation: 'Împarte → FFFE la mijloc → inversează bitul 7 → adaugă prefixul.',
  },
  {
    id: '1.9-035', topicId: T, sub: '1.9.b', type: 'cli', difficulty: 3,
    stem: 'Pe o interfață vrei să configurezi adresa 2001:db8:1:1:ffff:ffff:ffff:fffe/64 ca adresă anycast. Ce comandă dai?',
    prompt: 'R1(config-if)#', canonical: 'ipv6 address 2001:db8:1:1:ffff:ffff:ffff:fffe/64 anycast',
    answers: ['ipv6 address 2001:db8:1:1:ffff:ffff:ffff:fffe/64 anycast', 'ipv6 address 2001:DB8:1:1:FFFF:FFFF:FFFF:FFFE/64 anycast'],
    hint: 'ipv6 address adresă/prefix + cuvânt-cheie',
    wrong: [
      { text: 'ipv6 address 2001:db8:1:1:ffff:ffff:ffff:fffe/64', why: 'Fără cuvântul-cheie anycast, adresa este configurată ca unicast obișnuită.' },
      { text: 'ipv6 anycast 2001:db8:1:1:ffff:ffff:ffff:fffe/64', why: 'Nu este sintaxa IOS; anycast este un cuvânt-cheie al comenzii ipv6 address.' },
      { text: 'ipv6 address 2001:db8:1:1:ffff:ffff:ffff:fffe/64 eui-64', why: 'eui-64 cere IOS să calculeze Interface ID din MAC; nu face adresa anycast.' },
    ],
    explanation: 'Exemplul urmează documentația Cisco pentru cuvântul-cheie anycast. Aceeași adresă se configurează și pe celelalte noduri anycast.',
  },
  {
    id: '1.9-036', topicId: T, sub: '1.9', type: 'cli', difficulty: 2,
    stem: 'Ce comandă afișează adresele unei interfețe și grupurile multicast la care a aderat (Joined group address(es))?',
    prompt: 'R1#', canonical: 'show ipv6 interface g0/0',
    answers: ['show ipv6 interface g0/0', 'show ipv6 interface gigabitethernet0/0', 'show ipv6 interface gigabitethernet 0/0', 'show ipv6 int g0/0', 'sh ipv6 int g0/0', 'sh ipv6 interface g0/0'],
    hint: 'show ipv6 interface + numele interfeței',
    wrong: [
      { text: 'show ipv6 interface brief', why: 'Arată doar starea și adresele, nu și grupurile multicast.' },
      { text: 'show ipv6 route', why: 'Afișează tabela de rutare, nu grupurile de pe interfață.' },
      { text: 'show ip interface g0/0', why: 'Arată informații IPv4, nu IPv6.' },
    ],
    explanation: 'show ipv6 interface g0/0 listează adresa link-local, adresele globale, grupurile (FF02::1, FF02::2, solicited-node) și parametri ND.',
  },
  {
    id: '1.9-037', topicId: T, sub: '1.9.c', type: 'single', difficulty: 2,
    stem: 'Ce adresă multicast folosește un client DHCPv6 pentru a căuta un server?',
    options: [
      { id: 'a', text: 'ff02::1:2 (toate serverele și relay-urile DHCPv6)', correct: true, why: 'Înlocuiește broadcast-ul DHCP Discover din IPv4.' },
      { id: 'b', text: 'ff02::1', correct: false, why: 'Toate nodurile — ar deranja toate hosturile, nu doar serverele DHCPv6.' },
      { id: 'c', text: 'ff02::2', correct: false, why: 'Toate routerele — nu este grupul serverelor DHCPv6.' },
      { id: 'd', text: '255.255.255.255', correct: false, why: 'Broadcast IPv4; nu există în IPv6.' },
    ],
    explanation: 'ff02::1:2 = All_DHCP_Relay_Agents_and_Servers.',
  },
  {
    id: '1.9-038', topicId: T, sub: '1.9.c', type: 'multi', difficulty: 3,
    stem: 'Care DOUĂ afirmații despre adresele multicast IPv6 sunt corecte?',
    options: [
      { id: 'a', text: 'Preiau rolul broadcast-ului din IPv4', correct: true, why: 'Funcții precum „toți de pe legătură” (ff02::1) sau descoperirea vecinilor sunt realizate prin multicast.' },
      { id: 'b', text: 'Scope-ul adresei este dat de a patra cifră hexa (de exemplu 2 = link-local)', correct: true, why: 'Formatul ff + flag-uri (4 biți) + scope (4 biți) + group ID. ff02:: este link-local, ff05:: site, ff0e:: global.' },
      { id: 'c', text: 'Pot fi folosite ca adresă sursă într-un pachet', correct: false, why: 'O adresă multicast identifică destinatari; nu se folosește ca sursă.' },
      { id: 'd', text: 'ff02::1 ajunge la toate nodurile din Internet', correct: false, why: 'ff02 are scope link-local: ajunge doar pe legătura locală.' },
    ],
    explanation: 'Multicast = ff00::/8: grupuri, scope în a patra cifră, rol de înlocuitor al broadcast-ului.',
  },
  {
    id: '1.9-039', topicId: T, sub: '1.9.c', type: 'match', difficulty: 2,
    stem: 'Potrivește adresa multicast cu protocolul sau grupul ei.',
    leftLabel: 'Adresă', rightLabel: 'Grup / protocol',
    pairs: [
      { left: 'ff02::5', right: 'OSPFv3 (toate routerele OSPF)', why: 'Echivalentul lui 224.0.0.5.' },
      { left: 'ff02::9', right: 'RIPng', why: 'Echivalentul lui 224.0.0.9.' },
      { left: 'ff02::a', right: 'EIGRP pentru IPv6', why: 'Echivalentul lui 224.0.0.10.' },
      { left: 'ff02::1:2', right: 'Servere și relay-uri DHCPv6', why: 'Folosit de client la Solicit.' },
    ],
    distractors: [{ text: 'Toate nodurile de pe legătură (all-nodes)', why: 'Corespunde adresei ff02::1, care nu se află între cele patru adrese date.' }],
    explanation: 'Reține: OSPF 5/6, RIPng 9, EIGRP a, DHCPv6 1:2, all-nodes 1, all-routers 2.',
  },
  {
    id: '1.9-040', topicId: T, sub: '1.9.a', type: 'single', difficulty: 2,
    stem: 'Într-o întrebare apare adresa fec0::1. Ce este?',
    options: [
      { id: 'a', text: 'O adresă site-local din fec0::/10, depreciată, înlocuită de ULA', correct: true, why: 'Site-local a fost declarată depreciată în 2004; implementările noi o tratează ca pe o adresă globală. Rolul ei este preluat de ULA.' },
      { id: 'b', text: 'O adresă link-local', correct: false, why: 'Link-local începe cu fe80, nu cu fec0.' },
      { id: 'c', text: 'O adresă ULA', correct: false, why: 'ULA începe cu fc sau fd, nu cu fec0.' },
      { id: 'd', text: 'O adresă multicast', correct: false, why: 'Multicast începe cu ff.' },
    ],
    explanation: 'fec0::/10 = site-local, depreciat; folosit ca distractor la examen.',
  },
];
