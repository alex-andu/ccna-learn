import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.10 Verify IP parameters for Client OS (Windows, Mac OS, Linux).
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
// Obiectivul oficial 1.10 nu are sub-puncte, deci `sub` = '1.10'.
const T = '1.10';

export const Q_1_10: Question[] = [
  // ======================= Parametri și decizia local/remote =======================
  {
    id: '1.10-001', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'Care sunt cei patru parametri IP de bază de care are nevoie un host ca să comunice normal?',
    options: [
      { id: 'a', text: 'Adresa IP, masca de rețea, default gateway-ul și serverul DNS', correct: true, why: 'IP-ul și masca stabilesc identitatea și rețeaua locală; gateway-ul duce spre alte rețele; DNS-ul traduce numele în adrese.' },
      { id: 'b', text: 'Adresa IP, adresa MAC, VLAN-ul și portul switch-ului', correct: false, why: 'MAC-ul se află automat, iar VLAN-ul și portul sunt setări ale infrastructurii, nu parametri configurați pe client.' },
      { id: 'c', text: 'Adresa IP, masca, serverul DHCP și serverul NTP', correct: false, why: 'DHCP este doar sursa valorilor, iar NTP nu este necesar pentru comunicarea IP de bază.' },
      { id: 'd', text: 'Adresa IP, TTL, MTU și gateway-ul', correct: false, why: 'TTL și MTU sunt proprietăți ale pachetelor/legăturii, nu parametri de configurare IP ai clientului.' },
    ],
    explanation: 'IP + mască + default gateway + DNS. Fără mască și gateway, hostul nu poate decide unde trimite pachetele; fără DNS, nu rezolvă nume.',
  },
  {
    id: '1.10-002', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Cum decide un host dacă destinația este în aceeași rețea cu el sau în alta?',
    options: [
      { id: 'a', text: 'Face AND între propriul IP și propria mască și între IP-ul destinației și tot propria mască, apoi compară rezultatele', correct: true, why: 'Hostul nu cunoaște masca destinației, așa că folosește masca lui pentru ambele calcule. Rezultate egale = destinație locală.' },
      { id: 'b', text: 'Folosește masca destinației, comunicată prin ARP', correct: false, why: 'ARP nu transportă mască; hostul nu poate afla masca altui host.' },
      { id: 'c', text: 'Trimite întâi pachetul la gateway, care decide', correct: false, why: 'Pentru destinații locale pachetul nu trece deloc prin gateway; decizia o ia hostul.' },
      { id: 'd', text: 'Compară doar primul octet al celor două adrese', correct: false, why: 'Compararea pe clase nu se mai folosește; contează masca configurată.' },
    ],
    explanation: 'Egale → destinație locală (ARP pentru ea). Diferite → remote (ARP pentru gateway).',
  },
  {
    id: '1.10-003', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Un PC trimite un pachet către un server din altă rețea. Pentru ce adresă face ARP și ce adresă IP destinație rămâne în pachet?',
    options: [
      { id: 'a', text: 'ARP pentru MAC-ul gateway-ului; IP-ul destinație rămâne cel al serverului', correct: true, why: 'Cadrul pleacă spre MAC-ul gateway-ului, dar IP-ul destinație final rămâne neschimbat: MAC = hop cu hop, IP = capăt la capăt.' },
      { id: 'b', text: 'ARP pentru MAC-ul serverului; IP-ul destinație rămâne cel al serverului', correct: false, why: 'MAC-ul serverului nu poate fi aflat prin ARP dintr-o altă rețea; ARP funcționează doar pe segmentul local.' },
      { id: 'c', text: 'ARP pentru MAC-ul gateway-ului; IP-ul destinație devine IP-ul gateway-ului', correct: false, why: 'IP-ul destinație nu se schimbă; doar MAC-ul destinație din cadru este cel al gateway-ului.' },
      { id: 'd', text: 'Nu se face ARP, se folosește DNS', correct: false, why: 'DNS rezolvă nume în IP; ARP rezolvă IP în MAC. Sunt funcții diferite.' },
    ],
    explanation: 'Remote → ARP pentru gateway; IP-ul destinație din pachet rămâne final.',
  },
  {
    id: '1.10-004', topicId: T, sub: '1.10', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii prin care un client obține configurația IP de la un server DHCP.',
    items: [
      { text: 'DHCPDISCOVER (broadcast de la client)', why: 'Clientul nu are încă adresă și caută un server prin broadcast.' },
      { text: 'DHCPOFFER (oferta serverului)', why: 'Serverul propune o adresă și parametri (mască, gateway, DNS, lease).' },
      { text: 'DHCPREQUEST (clientul cere oferta)', why: 'Clientul acceptă o ofertă și o cere formal.' },
      { text: 'DHCPACK (confirmarea)', why: 'Serverul confirmă; abia acum clientul folosește adresa. Lease-ul începe să curgă.' },
    ],
    explanation: 'Pe scurt „DORA”: Discover, Offer, Request, Acknowledge. Detaliile DHCP sunt la 4.6.',
  },
  {
    id: '1.10-005', topicId: T, sub: '1.10', type: 'single', difficulty: 3,
    stem: 'Un host are IP 192.168.1.130, mască 255.255.255.128 și gateway 192.168.1.1. Ce simptom apare?',
    options: [
      { id: 'a', text: 'Comunică cu vecinii din 192.168.1.128/25, dar nu poate ieși din rețeaua locală: gateway-ul este în altă rețea', correct: true, why: 'Rețeaua hostului este 192.168.1.128/25; gateway-ul .1 este în 192.168.1.0/25, deci hostul nu îl poate contacta direct.' },
      { id: 'b', text: 'Nu poate comunica cu absolut nimeni', correct: false, why: 'Vecinii din aceeași rețea /25 sunt locali și funcționează fără gateway.' },
      { id: 'c', text: 'Totul funcționează normal', correct: false, why: 'Gateway-ul trebuie să fie în aceeași rețea cu hostul; aici nu este.' },
      { id: 'd', text: 'Primește automat 169.254.x.x', correct: false, why: 'Adresa este statică; APIPA apare doar când DHCP eșuează.' },
    ],
    explanation: 'AND: 130 AND 128 = 128 → rețeaua .128/25; gateway-ul .1 este în .0/25. Soluție: gateway corect (de exemplu .129) sau masca corectă.',
  },
  {
    id: '1.10-006', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'Un PC pe DHCP arată adresa 169.254.37.112, masca 255.255.0.0 și niciun default gateway. Ce înseamnă?',
    options: [
      { id: 'a', text: 'DHCP nu a răspuns și hostul și-a atribuit singur o adresă APIPA', correct: true, why: 'APIPA = 169.254.0.0/16, mască /16, fără gateway și fără DNS. Problema este pe drumul spre serverul DHCP.' },
      { id: 'b', text: 'Adresa a fost configurată static corect', correct: false, why: '169.254.x.x nu este o adresă statică validă pentru o rețea de producție.' },
      { id: 'c', text: 'Hostul este în spatele CGNAT', correct: false, why: 'CGNAT folosește 100.64.0.0/10, nu 169.254.0.0/16.' },
      { id: 'd', text: 'Hostul are o adresă publică', correct: false, why: '169.254.0.0/16 este link-local, nu publică.' },
    ],
    explanation: 'Dacă un singur PC are 169.254, verifică cablu/port/VLAN; dacă toate, serverul DHCP, pool-ul sau ip helper-address.',
  },

  // ======================= Windows =======================
  {
    id: '1.10-007', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'Pe Windows, ce comandă afișează serverele DNS, adresa MAC, serverul DHCP și lease-ul?',
    options: [
      { id: 'a', text: 'ipconfig /all', correct: true, why: '/all adaugă la output Physical Address (MAC), DHCP Enabled, Lease Obtained/Expires, DHCP Server și DNS Servers.' },
      { id: 'b', text: 'ipconfig', correct: false, why: 'Fără parametri arată doar IP, mască și gateway; nu arată DNS, MAC sau lease.' },
      { id: 'c', text: 'ipconfig /displaydns', correct: false, why: 'Afișează conținutul cache-ului DNS, nu configurația plăcii de rețea.' },
      { id: 'd', text: 'ifconfig -a', correct: false, why: 'ifconfig este comanda de pe macOS/Linux; pe Windows nu există.' },
    ],
    explanation: 'Capcană clasică: ipconfig simplu nu arată DNS-ul. Folosește ipconfig /all.',
  },
  {
    id: '1.10-008', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Ce face comanda ipconfig /flushdns?',
    options: [
      { id: 'a', text: 'Golește cache-ul DNS local', correct: true, why: 'Șterge intrările DNS memorate, astfel că următoarele rezolvări se fac din nou la serverul DNS.' },
      { id: 'b', text: 'Șterge serverele DNS configurate pe placă', correct: false, why: 'Nu modifică configurația; golește doar cache-ul.' },
      { id: 'c', text: 'Reînnoiește adresa IP de la DHCP', correct: false, why: 'Reînnoirea se face cu ipconfig /release și /renew.' },
      { id: 'd', text: 'Golește cache-ul ARP', correct: false, why: 'Cache-ul ARP se vede cu arp -a și se golește cu arp -d (sau netsh).' },
    ],
    explanation: '/flushdns = cache DNS. Utilă după schimbarea unei înregistrări DNS sau a fișierului hosts.',
  },
  {
    id: '1.10-009', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'În „route print”, ce reprezintă linia „0.0.0.0  0.0.0.0  192.168.1.1  192.168.1.23”?',
    options: [
      { id: 'a', text: 'Ruta implicită: orice destinație este trimisă la gateway-ul 192.168.1.1', correct: true, why: '0.0.0.0/0 este ruta care se potrivește cu orice adresă (cu cel mai scurt prefix); este reprezentarea default gateway-ului.' },
      { id: 'b', text: 'Ruta către rețeaua locală', correct: false, why: 'Rețeaua locală apare ca 192.168.1.0 255.255.255.0 „On-link”.' },
      { id: 'c', text: 'Ruta de loopback', correct: false, why: 'Loopback este 127.0.0.0 255.0.0.0.' },
      { id: 'd', text: 'Adresa DHCP', correct: false, why: 'Tabela de rutare nu arată serverul DHCP.' },
    ],
    explanation: 'Default gateway-ul din ipconfig apare în tabelă ca ruta 0.0.0.0/0. Se alege ruta cu cel mai lung prefix care se potrivește.',
  },
  {
    id: '1.10-010', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Ce arată comanda arp -a pe Windows?',
    options: [
      { id: 'a', text: 'Cache-ul ARP: asocieri IP ↔ MAC ale hosturilor din rețeaua locală (inclusiv gateway-ul)', correct: true, why: 'ARP funcționează doar în segmentul local, deci cache-ul conține vecini locali, nu hosturi remote.' },
      { id: 'b', text: 'Toate hosturile din Internet cu care a comunicat PC-ul', correct: false, why: 'Pentru destinații remote se face ARP doar pentru gateway; hostul remote nu apare în cache.' },
      { id: 'c', text: 'Tabela de rutare', correct: false, why: 'Tabela de rutare se vede cu route print.' },
      { id: 'd', text: 'Serverele DNS configurate', correct: false, why: 'DNS-urile se văd cu ipconfig /all.' },
    ],
    explanation: 'arp -a = vecini locali. Pentru o destinație remote vezi MAC-ul gateway-ului, nu al destinației.',
  },
  {
    id: '1.10-011', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'După ce ai reparat serverul DHCP, un PC Windows încă are 169.254.x.x. Cum forțezi obținerea unei configurații noi?',
    options: [
      { id: 'a', text: 'ipconfig /release urmat de ipconfig /renew', correct: true, why: '/release renunță la adresa curentă; /renew pornește din nou procesul DHCP (DISCOVER dacă nu are adresă).' },
      { id: 'b', text: 'ipconfig /flushdns', correct: false, why: 'Golește cache-ul DNS; nu are efect asupra adresei IP.' },
      { id: 'c', text: 'arp -d *', correct: false, why: 'Șterge intrările din cache-ul ARP; nu cere o adresă nouă.' },
      { id: 'd', text: 'tracert 8.8.8.8', correct: false, why: 'Traseul testează drumul spre o destinație, nu reînnoiește configurația.' },
    ],
    explanation: '/release + /renew refac configurația DHCP. Nu le rula pe o sesiune remote (RDP) spre același PC: conexiunea se rupe.',
  },
  {
    id: '1.10-012', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'În ipconfig apare „Media State: Media disconnected” pentru adaptorul Ethernet. Ce înseamnă?',
    options: [
      { id: 'a', text: 'Cablul nu este conectat (sau Wi-Fi-ul nu este asociat): problemă de nivel 1/2, nu de configurare IP', correct: true, why: 'Nu există legătură fizică, deci nu se poate obține sau folosi nicio adresă pe acel adaptor.' },
      { id: 'b', text: 'Serverul DHCP este oprit', correct: false, why: 'Într-un asemenea caz ai vedea 169.254.x.x pe un adaptor cu legătură, nu „Media disconnected”.' },
      { id: 'c', text: 'Masca este greșită', correct: false, why: 'Mesajul nu are legătură cu masca; adaptorul nici nu are legătură.' },
      { id: 'd', text: 'DNS-ul este greșit', correct: false, why: 'DNS-ul nu afectează starea legăturii fizice.' },
    ],
    explanation: 'Începe depanarea de jos în sus: cablu/port → adresă → mască/gateway → DNS.',
  },
  {
    id: '1.10-013', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Cum apare adresa MAC în ipconfig /all pe Windows?',
    options: [
      { id: 'a', text: 'Pe linia „Physical Address”, scrisă cu cratime, ca 3C-A9-F4-12-34-56', correct: true, why: 'Windows folosește cratime; macOS și Linux folosesc două puncte, iar Cisco IOS folosește puncte (3ca9.f412.3456).' },
      { id: 'b', text: 'Pe linia „MAC Address”, scrisă cu două puncte', correct: false, why: 'Pe Windows linia se numește „Physical Address” și folosește cratime.' },
      { id: 'c', text: 'Nu apare deloc', correct: false, why: 'Apare în ipconfig /all (nu și în ipconfig simplu).' },
      { id: 'd', text: 'Pe linia „Hardware Address”, scrisă cu puncte', correct: false, why: 'Formatul cu puncte (3ca9.f412.3456) este cel din Cisco IOS.' },
    ],
    explanation: 'Windows: Physical Address, cu cratime. Atenție la formate: cratime (Windows), două puncte (macOS/Linux), puncte (Cisco).',
  },
  {
    id: '1.10-014', topicId: T, sub: '1.10', type: 'cli', difficulty: 1,
    stem: 'Ce comandă dai pe Windows ca să vezi configurația completă a fiecărui adaptor (MAC, DHCP, lease, DNS)?',
    prompt: 'C:\\>', canonical: 'ipconfig /all',
    answers: ['ipconfig /all', 'ipconfig/all'],
    hint: 'ipconfig cu parametrul care arată „tot”',
    wrong: [
      { text: 'ipconfig', why: 'Arată doar IP, mască și gateway; nu arată DNS, MAC sau lease.' },
      { text: 'ifconfig -a', why: 'Comandă de macOS/Linux; nu există pe Windows.' },
      { text: 'ip addr', why: 'Comandă de Linux (iproute2); nu există pe Windows.' },
    ],
    explanation: 'ipconfig /all este comanda cea mai importantă de diagnoză pe Windows.',
  },

  // ======================= macOS =======================
  {
    id: '1.10-015', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Pe macOS, ifconfig en0 afișează „netmask 0xffffff00”. Ce prefix reprezintă?',
    options: [
      { id: 'a', text: '/24 (255.255.255.0)', correct: true, why: 'ffffff00 are 24 de biți de 1, adică /24.' },
      { id: 'b', text: '/16 (255.255.0.0)', correct: false, why: '/16 ar fi 0xffff0000.' },
      { id: 'c', text: '/26 (255.255.255.192)', correct: false, why: '/26 ar fi 0xffffffc0.' },
      { id: 'd', text: '/32 (255.255.255.255)', correct: false, why: '/32 ar fi 0xffffffff.' },
    ],
    explanation: 'macOS afișează masca din ifconfig în hexazecimal: ff = 255, c0 = 192, fe = 254, 00 = 0.',
  },
  {
    id: '1.10-016', topicId: T, sub: '1.10', type: 'single', difficulty: 3,
    stem: 'Masca „0xfffffe00” din ifconfig-ul de pe macOS corespunde cărui prefix?',
    options: [
      { id: 'a', text: '/23 (255.255.254.0)', correct: true, why: 'fe = 11111110 (7 biți de 1) → 8 + 8 + 7 = 23 de biți de 1.' },
      { id: 'b', text: '/22 (255.255.252.0)', correct: false, why: '/22 ar fi 0xfffffc00.' },
      { id: 'c', text: '/24 (255.255.255.0)', correct: false, why: '/24 ar fi 0xffffff00.' },
      { id: 'd', text: '/25 (255.255.255.128)', correct: false, why: '/25 ar fi 0xffffff80.' },
    ],
    explanation: 'Convertește octetul care nu este ff/00: fe = 254 → 7 biți de 1 → al treilea octet adaugă 7: 16 + 7 = /23.',
  },
  {
    id: '1.10-017', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Care comandă macOS afișează default gateway-ul sistemului?',
    options: [
      { id: 'a', text: 'route -n get default (sau netstat -rn)', correct: true, why: 'Arată ruta implicită, inclusiv „gateway:”. Echivalentul lui „ip route” de pe Linux și „route print” de pe Windows.' },
      { id: 'b', text: 'ipconfig /all', correct: false, why: 'Pe macOS ipconfig are altă sintaxă (de exemplu ipconfig getifaddr en0); /all nu există.' },
      { id: 'c', text: 'ip route', correct: false, why: 'Comandă de Linux (iproute2); nu există pe macOS.' },
      { id: 'd', text: 'tracert', correct: false, why: 'tracert este comanda de traseu de pe Windows.' },
    ],
    explanation: 'macOS: route -n get default / netstat -rn / networksetup -getinfo "Wi-Fi" (câmpul Router).',
  },
  {
    id: '1.10-018', topicId: T, sub: '1.10', type: 'single', difficulty: 3,
    stem: 'Ce afișează networksetup -getdnsservers Wi-Fi pe macOS?',
    options: [
      { id: 'a', text: 'Doar serverele DNS setate manual; pentru cele primite prin DHCP se folosește scutil --dns', correct: true, why: 'Dacă nu ai setat DNS manual, comanda spune „There aren’t any DNS Servers set…”, deși sistemul folosește DNS-uri de la DHCP.' },
      { id: 'b', text: 'Toate serverele DNS folosite, inclusiv cele de la DHCP', correct: false, why: 'Cele de la DHCP nu apar aici; trebuie scutil --dns.' },
      { id: 'c', text: 'Adresa gateway-ului', correct: false, why: 'Gateway-ul (Router) se vede cu networksetup -getinfo sau route -n get default.' },
      { id: 'd', text: 'Cache-ul DNS', correct: false, why: 'Cache-ul DNS nu se afișează cu această comandă.' },
    ],
    explanation: 'Capcană: networksetup -getdnsservers = doar manuale. scutil --dns = configurația efectivă de rezolvare.',
  },
  {
    id: '1.10-019', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'Cum numește macOS (în setările de rețea) default gateway-ul?',
    options: [
      { id: 'a', text: 'Router', correct: true, why: 'În System Settings → Network → TCP/IP și în networksetup -getinfo, gateway-ul apare ca „Router”.' },
      { id: 'b', text: 'Default Gateway', correct: false, why: 'Aceasta este denumirea din Windows (ipconfig).' },
      { id: 'c', text: 'Gateway of last resort', correct: false, why: 'Este expresia din tabela de rutare Cisco IOS.' },
      { id: 'd', text: 'default via', correct: false, why: 'Aceasta este formularea din ip route pe Linux.' },
    ],
    explanation: 'Același parametru, nume diferite: Default Gateway (Windows), Router (macOS), default via (Linux).',
  },
  {
    id: '1.10-020', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Ce comandă macOS arată serverele DNS efectiv folosite, inclusiv cele primite prin DHCP?',
    options: [
      { id: 'a', text: 'scutil --dns', correct: true, why: 'Afișează configurația de rezolvare DNS a sistemului, cu toate serverele active.' },
      { id: 'b', text: 'ipconfig /all', correct: false, why: 'Nu există pe macOS.' },
      { id: 'c', text: 'arp -a', correct: false, why: 'Arată cache-ul ARP, nu serverele DNS.' },
      { id: 'd', text: 'traceroute', correct: false, why: 'Testează drumul spre o destinație.' },
    ],
    explanation: 'scutil --dns pe macOS; resolvectl status pe Linux; ipconfig /all pe Windows.',
  },
  {
    id: '1.10-021', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Ce afișează comanda ipconfig getifaddr en0 pe macOS?',
    options: [
      { id: 'a', text: 'Adresa IPv4 a interfeței en0', correct: true, why: 'Este varianta scurtă pentru a obține doar adresa IP; en0 este de regulă interfața Wi-Fi (sau Ethernet) principală.' },
      { id: 'b', text: 'Toată configurația plăcii, ca ipconfig /all pe Windows', correct: false, why: 'ipconfig /all nu există pe macOS; getifaddr dă doar IP-ul.' },
      { id: 'c', text: 'Adresa MAC', correct: false, why: 'MAC-ul se vede în ifconfig (câmpul ether).' },
      { id: 'd', text: 'Serverele DNS', correct: false, why: 'DNS-urile se văd cu scutil --dns.' },
    ],
    explanation: 'Pe macOS ipconfig există, dar cu altă sintaxă (getifaddr, getpacket, set).',
  },

  // ======================= Linux =======================
  {
    id: '1.10-022', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'Care este comanda modernă recomandată pe Linux în locul lui ifconfig?',
    options: [
      { id: 'a', text: 'ip addr (sau ip a)', correct: true, why: 'Face parte din pachetul iproute2, care a înlocuit net-tools; arată IP, prefix, MAC și starea interfeței.' },
      { id: 'b', text: 'ipconfig /all', correct: false, why: 'Comandă de Windows.' },
      { id: 'c', text: 'route print', correct: false, why: 'Comandă de Windows pentru tabela de rutare.' },
      { id: 'd', text: 'arp -a', correct: false, why: 'Arată cache-ul ARP; nu afișează adresele interfețelor.' },
    ],
    explanation: 'ifconfig (net-tools) este depreciat pe Linux; ip addr/ip route/ip neigh sunt comenzile moderne.',
  },
  {
    id: '1.10-023', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'Cum afișează „ip a” pe Linux masca unei adrese IPv4?',
    options: [
      { id: 'a', text: 'Ca prefix după slash, de exemplu 192.168.1.50/24', correct: true, why: 'Linux folosește notația CIDR (/prefix).' },
      { id: 'b', text: 'În zecimal cu puncte, ca 255.255.255.0', correct: false, why: 'Aceasta este notația din Windows (ipconfig).' },
      { id: 'c', text: 'În hexazecimal, ca 0xffffff00', correct: false, why: 'Aceasta este notația din ifconfig pe macOS.' },
      { id: 'd', text: 'Nu o afișează', correct: false, why: 'Prefixul face parte din fiecare adresă afișată.' },
    ],
    explanation: 'Windows: zecimal; macOS (ifconfig): hex; Linux (ip a): /prefix.',
  },
  {
    id: '1.10-024', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'Pe Linux, unde vezi default gateway-ul?',
    options: [
      { id: 'a', text: 'În linia „default via …” din ip route', correct: true, why: 'Linia default via 192.168.1.1 dev eth0 indică ruta implicită prin gateway.' },
      { id: 'b', text: 'În ip neigh', correct: false, why: 'ip neigh arată cache-ul de vecini (ARP/ND), nu ruta implicită.' },
      { id: 'c', text: 'În /etc/hosts', correct: false, why: 'Fișierul hosts asociază nume cu adrese; nu conține gateway-ul.' },
      { id: 'd', text: 'În ip link', correct: false, why: 'ip link arată interfețele (stare, MAC), nu rutele.' },
    ],
    explanation: 'ip route → „default via <gateway> dev <interfață>”.',
  },
  {
    id: '1.10-025', topicId: T, sub: '1.10', type: 'single', difficulty: 3,
    stem: 'În /etc/resolv.conf pe un Linux modern apare „nameserver 127.0.0.53”. Ce înseamnă?',
    options: [
      { id: 'a', text: 'Este stub-ul DNS local al lui systemd-resolved, care redirecționează către serverele DNS reale; nu este un DNS greșit', correct: true, why: 'Serverele reale se văd cu resolvectl status.' },
      { id: 'b', text: 'Hostul folosește DNS-ul Google', correct: false, why: 'DNS-ul Google este 8.8.8.8; 127.0.0.53 este o adresă de loopback.' },
      { id: 'c', text: 'DNS-ul este greșit și trebuie corectat', correct: false, why: 'Este comportamentul normal al sistemelor cu systemd-resolved.' },
      { id: 'd', text: 'Hostul nu are DNS', correct: false, why: 'Are DNS: stub-ul local transmite cererile către serverele configurate.' },
    ],
    explanation: 'Adresa din 127.0.0.0/8 indică resolver local; ca să afli serverele reale folosește resolvectl status.',
  },
  {
    id: '1.10-026', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'În output-ul „ip a” apare cuvântul „dynamic” lângă o adresă IPv4. Ce înseamnă?',
    options: [
      { id: 'a', text: 'Adresa a fost primită prin DHCP; valid_lft arată timpul rămas din lease', correct: true, why: 'O adresă statică nu are „dynamic” și apare cu valid_lft forever.' },
      { id: 'b', text: 'Adresa se schimbă la fiecare pachet', correct: false, why: 'Nu se schimbă pe parcursul lease-ului; „dynamic” indică doar sursa DHCP.' },
      { id: 'c', text: 'Adresa este duplicată în rețea', correct: false, why: 'Duplicatele nu sunt marcate astfel.' },
      { id: 'd', text: 'Interfața este oprită', correct: false, why: 'Starea interfeței apare în flag-uri (UP/DOWN), nu prin „dynamic”.' },
    ],
    explanation: 'dynamic + valid_lft cu valoare finită = adresă DHCP. Pe Windows echivalentul este „DHCP Enabled: Yes” + Lease Obtained/Expires.',
  },
  {
    id: '1.10-027', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Care este comanda Linux modernă echivalentă cu arp -a?',
    options: [
      { id: 'a', text: 'ip neigh', correct: true, why: 'Afișează tabela de vecini (ARP pentru IPv4, ND pentru IPv6), cu stări precum REACHABLE sau STALE.' },
      { id: 'b', text: 'ip route', correct: false, why: 'Arată tabela de rutare, nu cache-ul ARP.' },
      { id: 'c', text: 'ip link', correct: false, why: 'Arată interfețele, nu vecinii.' },
      { id: 'd', text: 'resolvectl status', correct: false, why: 'Arată configurația DNS.' },
    ],
    explanation: 'arp -a (Windows/macOS) ↔ ip neigh (Linux).',
  },
  {
    id: '1.10-028', topicId: T, sub: '1.10', type: 'cli', difficulty: 2,
    stem: 'Ce comandă Linux afișează tabela de rutare (inclusiv linia „default via …”)?',
    prompt: '$', canonical: 'ip route',
    answers: ['ip route', 'ip r', 'ip route show', 'ip -4 route', 'ip -4 r'],
    hint: 'ip + cuvântul pentru rute',
    wrong: [
      { text: 'route print', why: 'Comandă de Windows.' },
      { text: 'ip addr', why: 'Afișează adresele interfețelor, nu rutele.' },
      { text: 'ip neigh', why: 'Afișează cache-ul de vecini (ARP/ND).' },
    ],
    explanation: 'Linux: ip route. Windows: route print. macOS: netstat -rn sau route -n get default.',
  },
  {
    id: '1.10-029', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Ce comandă Linux (systemd-resolved) afișează serverele DNS folosite pe fiecare interfață?',
    options: [
      { id: 'a', text: 'resolvectl status', correct: true, why: 'Afișează pentru fiecare legătură serverele DNS și domeniile de căutare; este echivalentul lui „DNS Servers” din ipconfig /all.' },
      { id: 'b', text: 'ip neigh', correct: false, why: 'Afișează vecinii ARP/ND.' },
      { id: 'c', text: 'ip route', correct: false, why: 'Afișează rutele, nu DNS.' },
      { id: 'd', text: 'arp -a', correct: false, why: 'Afișează cache-ul ARP.' },
    ],
    explanation: 'Alternative: nmcli device show (include IP4.DNS) sau cat /etc/resolv.conf (atenție la stub-ul 127.0.0.53).',
  },

  // ======================= Comparație și depanare =======================
  {
    id: '1.10-030', topicId: T, sub: '1.10', type: 'single', difficulty: 1,
    stem: 'Care comandă de afișare a traseului se folosește pe Windows?',
    options: [
      { id: 'a', text: 'tracert', correct: true, why: 'Pe Windows comanda este tracert și folosește mesaje ICMP.' },
      { id: 'b', text: 'traceroute', correct: false, why: 'Aceasta este comanda din macOS, Linux și Cisco IOS (implicit cu UDP).' },
      { id: 'c', text: 'tracepath', correct: false, why: 'Există pe Linux; nu pe Windows.' },
      { id: 'd', text: 'pathping', correct: false, why: 'Există pe Windows, dar combină ping și tracert și nu este comanda clasică de afișare a traseului cerută aici.' },
    ],
    explanation: 'tracert = Windows. traceroute = macOS/Linux/Cisco.',
  },
  {
    id: '1.10-031', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'Pe care dintre sisteme afișează ifconfig masca de rețea în format hexazecimal?',
    options: [
      { id: 'a', text: 'macOS', correct: true, why: 'ifconfig de pe macOS arată netmask 0xffffff00; networksetup o arată în zecimal.' },
      { id: 'b', text: 'Windows', correct: false, why: 'Windows nu are ifconfig; ipconfig afișează masca în zecimal.' },
      { id: 'c', text: 'Linux', correct: false, why: 'ip a folosește /prefix; ifconfig (depreciat) arată masca în zecimal.' },
      { id: 'd', text: 'Cisco IOS', correct: false, why: 'IOS arată masca în zecimal (în configurație) sau /prefix (în show).' },
    ],
    explanation: 'Mască: zecimal (Windows), hex în ifconfig (macOS), /prefix (Linux).',
  },
  {
    id: '1.10-032', topicId: T, sub: '1.10', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare cerință cu comanda Windows corespunzătoare.',
    leftLabel: 'Cerință', rightLabel: 'Comandă Windows',
    pairs: [
      { left: 'IP, mască și gateway rapid', right: 'ipconfig', why: 'Output scurt pentru fiecare adaptor.' },
      { left: 'MAC, DHCP, lease și DNS', right: 'ipconfig /all', why: '/all adaugă detaliile complete.' },
      { left: 'Tabela de rutare a PC-ului', right: 'route print', why: 'Afișează ruta implicită și rutele on-link.' },
      { left: 'Cache-ul ARP', right: 'arp -a', why: 'Asocieri IP ↔ MAC pentru vecinii locali.' },
      { left: 'Golirea cache-ului DNS', right: 'ipconfig /flushdns', why: 'Șterge intrările DNS memorate.' },
    ],
    distractors: [{ text: 'ifconfig -a', why: 'Comandă de macOS/Linux; nu există pe Windows.' }],
    explanation: 'Învață comenzile Windows ca punct de plecare, apoi echivalentele din macOS și Linux.',
  },
  {
    id: '1.10-033', topicId: T, sub: '1.10', type: 'single', difficulty: 3,
    stem: 'Un ping spre un server răspunde cu TTL=125. Ce se poate deduce, în general?',
    options: [
      { id: 'a', text: 'Probabil răspunde un sistem Windows (TTL inițial 128) aflat la 3 hopuri', correct: true, why: '128 − 3 = 125. Valori inițiale uzuale: 64 (Linux/macOS), 128 (Windows), 255 (Cisco IOS).' },
      { id: 'b', text: 'Un sistem Linux aflat la 61 de hopuri', correct: false, why: '64 − 125 ar fi negativ; TTL inițial 64 nu poate da 125 la receptor.' },
      { id: 'c', text: 'Un router Cisco aflat la 130 de hopuri', correct: false, why: 'TTL inițial 255 − 125 = 130 hopuri este nerealist; Internetul are rar peste 30 de hopuri.' },
      { id: 'd', text: 'Nu se poate deduce nimic, TTL este aleatoriu', correct: false, why: 'TTL începe de la o valoare implicită a sistemului; poate da un indiciu, deși valoarea poate fi modificată.' },
    ],
    explanation: 'TTL inițial: 64 (Linux/macOS), 128 (Windows), 255 (echipamente Cisco). Este doar un indiciu.',
  },
  {
    id: '1.10-034', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'ping 8.8.8.8 reușește, dar ping www.cisco.com spune „could not find host”. Ce este cel mai probabil defect?',
    options: [
      { id: 'a', text: 'DNS: serverul DNS lipsește, este greșit sau inaccesibil', correct: true, why: 'Conectivitatea IP este bună (ping pe IP reușește); doar rezolvarea numelor eșuează.' },
      { id: 'b', text: 'Default gateway greșit', correct: false, why: 'Cu un gateway greșit nu ar reuși nici ping către 8.8.8.8.' },
      { id: 'c', text: 'Masca greșită', correct: false, why: 'O mască greșită ar afecta și traficul pe IP, nu doar numele.' },
      { id: 'd', text: 'Cablul este deconectat', correct: false, why: 'Cu cablul deconectat nu ar reuși niciun ping.' },
    ],
    explanation: 'Ping pe IP da, pe nume nu → DNS. Verifică DNS Servers în ipconfig /all, apoi nslookup, apoi /flushdns și fișierul hosts.',
  },
  {
    id: '1.10-035', topicId: T, sub: '1.10', type: 'single', difficulty: 2,
    stem: 'ping 127.0.0.1 reușește pe un PC. Ce dovedește?',
    options: [
      { id: 'a', text: 'Doar că stiva TCP/IP locală funcționează', correct: true, why: 'Traficul către loopback nu iese pe cablu; nu testează placa de rețea, cablul sau gateway-ul.' },
      { id: 'b', text: 'Că placa de rețea și cablul funcționează', correct: false, why: 'Pachetele către 127.0.0.1 nu ajung la placa de rețea.' },
      { id: 'c', text: 'Că gateway-ul răspunde', correct: false, why: 'Gateway-ul se testează cu ping la adresa lui.' },
      { id: 'd', text: 'Că DNS-ul funcționează', correct: false, why: 'DNS-ul se testează cu un ping către un nume sau cu nslookup.' },
    ],
    explanation: 'Scara de ping: 127.0.0.1 → IP propriu → gateway → IP remote → nume. Prima treaptă care eșuează arată stratul cu problema.',
  },
  {
    id: '1.10-036', topicId: T, sub: '1.10', type: 'single', difficulty: 3,
    stem: 'Un ping returnează „Reply from 192.168.1.23: Destination host unreachable”, iar 192.168.1.23 este adresa chiar a PC-ului care dă ping. Ce a eșuat?',
    options: [
      { id: 'a', text: 'ARP: hostul nu a primit răspuns pentru destinația locală (sau pentru gateway)', correct: true, why: 'Mesajul vine de la propriul IP, deci nu a ajuns pachetul în rețea: rezolvarea adresei MAC a eșuat local.' },
      { id: 'b', text: 'Un router îndepărtat nu are rută', correct: false, why: 'Un router îndepărtat ar răspunde cu propria lui adresă, nu cu a PC-ului.' },
      { id: 'c', text: 'DNS nu a rezolvat numele', correct: false, why: 'Eroarea DNS este „could not find host”, nu „Destination host unreachable”.' },
      { id: 'd', text: 'Serverul de destinație a refuzat conexiunea', correct: false, why: 'Un refuz ar apărea la nivelul aplicației/TCP, nu ca mesaj ICMP de la propriul IP.' },
    ],
    explanation: '„Unreachable” de la propriul IP = ARP eșuat local. „Unreachable” de la un router = el nu are rută spre destinație.',
  },
  {
    id: '1.10-037', topicId: T, sub: '1.10', type: 'single', difficulty: 3,
    stem: 'Un host are 172.16.5.10/16, dar rețeaua reală este 172.16.5.0/24, iar destinația 172.16.9.20 se află după router. Ce face hostul?',
    options: [
      { id: 'a', text: 'Consideră destinația locală (aceeași rețea /16) și face ARP direct pentru ea; fără proxy ARP primește „Destination host unreachable”', correct: true, why: 'Cu masca /16 ambele adrese sunt în 172.16.0.0/16, deci hostul nu folosește gateway-ul. Nimeni nu răspunde la ARP pentru 172.16.9.20 pe segment.' },
      { id: 'b', text: 'Trimite pachetul la gateway, apoi destinația răspunde', correct: false, why: 'Hostul decide „local” și ocolește gateway-ul.' },
      { id: 'c', text: 'Primește automat masca corectă de la router', correct: false, why: 'Masca este configurată pe host; routerul nu o corectează.' },
      { id: 'd', text: 'Funcționează normal, fiindcă IP-urile sunt în aceeași clasă B', correct: false, why: 'Clasele nu mai contează; contează masca configurată.' },
    ],
    explanation: 'Mască prea scurtă: hostul face ARP direct pentru destinații remote. Simptom: unele rețele remote nu merg, altele da.',
  },
  {
    id: '1.10-038', topicId: T, sub: '1.10', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ semne într-un output ipconfig /all indică faptul că DHCP a eșuat?',
    options: [
      { id: 'a', text: 'O adresă „Autoconfiguration IPv4 Address” din 169.254.x.x', correct: true, why: 'Este semnătura APIPA: clientul și-a atribuit singur o adresă link-local după ce DHCP nu a răspuns.' },
      { id: 'b', text: 'Masca 255.255.0.0 și Default Gateway gol', correct: true, why: 'APIPA folosește mereu /16 și nu are gateway.' },
      { id: 'c', text: 'Lease Obtained și Lease Expires cu date valide', correct: false, why: 'Un lease valid arată că DHCP a funcționat.' },
      { id: 'd', text: 'DNS Servers: 8.8.8.8', correct: false, why: 'Un server DNS configurat nu indică un eșec DHCP; poate fi dat de DHCP sau static.' },
    ],
    explanation: 'APIPA: 169.254.0.0/16, fără gateway și fără DNS util. „DHCP Enabled: Yes” arată că clientul este corect, iar problema e pe drumul spre server.',
  },
  {
    id: '1.10-039', topicId: T, sub: '1.10', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre default gateway sunt corecte?',
    options: [
      { id: 'a', text: 'Trebuie să fie în aceeași rețea cu hostul', correct: true, why: 'Hostul îl contactează direct (ARP) pentru a-i trimite pachetele spre alte rețele.' },
      { id: 'b', text: 'Hostul îi trimite pachetele destinate altor rețele', correct: true, why: 'Pentru destinații remote cadrul pleacă spre MAC-ul gateway-ului, iar IP-ul destinație rămâne neschimbat.' },
      { id: 'c', text: 'Hostul îi trimite și traficul destinat vecinilor din aceeași rețea', correct: false, why: 'Traficul local se livrează direct, fără gateway.' },
      { id: 'd', text: 'Traduce numele în adrese IP', correct: false, why: 'Aceasta este funcția serverului DNS.' },
    ],
    explanation: 'Gateway = „ușa” spre alte rețele; trebuie să fie în rețeaua hostului.',
  },
  {
    id: '1.10-040', topicId: T, sub: '1.10', type: 'order', difficulty: 2,
    stem: 'Ordonează „scara de ping” pentru a depana un client care nu ajunge la un server.',
    items: [
      { text: 'ping 127.0.0.1 (loopback)', why: 'Verifică stiva TCP/IP locală; dacă eșuează, problema e în sistemul de operare.' },
      { text: 'ping la propria adresă IP', why: 'Verifică faptul că adresa este configurată pe interfață.' },
      { text: 'ping la default gateway', why: 'Verifică legătura locală și faptul că gateway-ul este accesibil.' },
      { text: 'ping la o adresă IP remote (de exemplu 8.8.8.8)', why: 'Verifică rutarea și conectivitatea dincolo de gateway.' },
      { text: 'ping la un nume (www.cisco.com)', why: 'Ultima treaptă: verifică și rezolvarea numelor prin DNS.' },
    ],
    explanation: 'Prima treaptă care eșuează îți arată stratul cu problema: stivă, interfață, rețea locală, rutare sau DNS.',
  },
];
