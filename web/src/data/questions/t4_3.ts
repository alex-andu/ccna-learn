import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.3 Explain the role of DHCP and DNS within the network.
// Obiectivul oficial nu are sub-puncte; `sub` = '4.3'. Fiecare variantă are explicație (why).
const T = '4.3';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_3: Question[] = [
  // ======================= Roluri =======================
  single({ id: '4.3-001' }, 1, 'Care este rolul principal al DHCP într-o rețea?', [
    ['Atribuie automat adrese IP și alți parametri de rețea clienților', true, 'DHCP livrează adresă, mască, gateway, DNS și alte opțiuni.'],
    ['Traduce nume în adrese IP', false, 'Aceasta este funcția DNS.'],
    ['Sincronizează ceasurile', false, 'Aceasta este funcția NTP.'],
    ['Traduce adrese private în publice', false, 'Aceasta este funcția NAT.'],
  ], 'DHCP = configurare IP automată.'),
  single({ id: '4.3-002' }, 1, 'Care este rolul principal al DNS?', [
    ['Traduce nume de domeniu în adrese IP (și invers)', true, 'Oamenii folosesc nume, pachetele circulă pe baza adreselor.'],
    ['Atribuie adrese IP dinamic', false, 'Aceasta este funcția DHCP.'],
    ['Criptează conexiunile web', false, 'Criptarea ține de TLS/IPsec.'],
    ['Filtrează traficul în funcție de port', false, 'Aceasta este funcția unui ACL/firewall.'],
  ], 'DNS = nume ↔ adrese.'),
  single({ id: '4.3-003' }, 1, 'Ce reprezintă acronimul DORA în DHCP?', [
    ['Discover, Offer, Request, Acknowledge', true, 'Cele patru mesaje ale obținerii unui lease.'],
    ['Deny, Offer, Release, Accept', false, 'Nu sunt mesajele DHCP.'],
    ['Detect, Obtain, Renew, Assign', false, 'Nu este secvența DORA.'],
    ['Discover, Open, Reply, Assign', false, 'Nu sunt mesajele DHCP.'],
  ], 'DORA = Discover, Offer, Request, Acknowledge.'),
  single({ id: '4.3-004' }, 1, 'De ce mesajul DHCP Discover este trimis ca broadcast?', [
    ['Clientul nu are încă adresă IP și nu știe unde este serverul', true, 'Sursa e 0.0.0.0, destinația 255.255.255.255.'],
    ['Pentru că serverul DHCP este mereu în aceeași VLAN', false, 'Serverul poate fi și în altă subrețea (cu relay); motivul broadcast-ului e lipsa adresei clientului.'],
    ['Pentru că broadcast-ul e criptat', false, 'Broadcast-ul nu criptează.'],
    ['Pentru că DHCP folosește TCP', false, 'DHCP folosește UDP.'],
  ], 'Clientul nu are IP și nu știe serverul.'),
  single({ id: '4.3-005' }, 1, 'Ce porturi UDP folosesc serverul și clientul DHCP?', [
    ['Server 67, client 68', true, 'Serverul ascultă pe 67; clientul pe 68.'],
    ['Server 68, client 67', false, 'Inversate.'],
    ['Server 53, client 53', false, '53 este DNS.'],
    ['Server 123, client 123', false, '123 este NTP.'],
  ], 'UDP 67/68.'),
  single({ id: '4.3-006' }, 2, 'La ce moment al lease-ului încearcă un client DHCP să-l reînnoiască (renew), de obicei?', [
    ['La 50% din durata lease-ului, cu un Request unicast către serverul inițial', true, 'T1 = 50%.'],
    ['La 100%, când expiră', false, 'La 100% lease-ul a expirat deja; reînnoirea începe mai devreme.'],
    ['La 25% din durata lease-ului', false, 'Nu este o valoare standard.'],
    ['La fiecare repornire a serverului', false, 'Nu depinde de repornirea serverului.'],
  ], 'T1 = 50% (renew), T2 = 87,5% (rebind).'),
  single({ id: '4.3-007' }, 2, 'Ce înseamnă rebind în DHCP?', [
    ['La 87,5% din lease, clientul trimite Request prin broadcast către orice server', true, 'T2: serverul inițial nu a răspuns la renew.'],
    ['Clientul renunță la adresă', false, 'Aceasta este release.'],
    ['Serverul refuză clientul', false, 'Aceasta este NAK.'],
    ['Clientul alege alt server din oferte', false, 'Alegerea ofertelor se face în Request, la obținerea inițială.'],
  ], 'Rebind = broadcast la T2.'),
  single({ id: '4.3-008' }, 2, 'Un PC are adresa 169.254.12.7. Ce indică?', [
    ['Nu a primit răspuns de la un server DHCP și și-a atribuit singur o adresă link-local (APIPA)', true, 'Adresa 169.254.0.0/16 e atribuită automat în lipsa DHCP.'],
    ['Serverul DHCP i-a dat o adresă validă', false, 'Serverul nu oferă adrese din acel interval.'],
    ['PC-ul folosește NAT', false, 'NAT nu are legătură.'],
    ['Adresa este de broadcast', false, 'Nu este broadcast.'],
  ], '169.254.x.x = fără DHCP.'),
  single({ id: '4.3-009' }, 1, 'Ce se întâmplă mai întâi când un utilizator tastează www.exemplu.ro într-un browser?', [
    ['Numele este rezolvat în adresă IP prin DNS (cache, apoi server)', true, 'Fără adresa IP, conexiunea nu poate începe.'],
    ['Se trimite direct un pachet către numele de domeniu', false, 'Pachetele folosesc adrese IP.'],
    ['Browserul cere o adresă prin DHCP', false, 'DHCP ia parametri pentru gazdă, nu rezolvă numele sitului.'],
    ['Routerul traduce numele cu NAT', false, 'NAT nu rezolvă nume.'],
  ], 'DNS apare înainte de conexiunea efectivă.'),
  single({ id: '4.3-010' }, 1, 'Ce protocol de transport și port folosește de obicei o interogare DNS?', [
    ['UDP 53', true, 'Interogările obișnuite sunt UDP; TCP 53 pentru răspunsuri mari și zone transfer.'],
    ['TCP 80', false, '80 este HTTP.'],
    ['UDP 67', false, '67 este serverul DHCP.'],
    ['UDP 161', false, '161 este SNMP.'],
  ], 'DNS: UDP 53 (TCP 53 la nevoie).'),
  single({ id: '4.3-011' }, 2, 'Ping către 8.8.8.8 reușește, dar ping către www.exemplu.ro eșuează cu „could not find host”. Ce este cel mai probabil defect?', [
    ['Serverul DNS configurat este greșit sau inaccesibil', true, 'Conectivitatea IP merge; numele nu se rezolvă.'],
    ['Gateway-ul implicit lipsește', false, 'Fără gateway, nici ping către 8.8.8.8 nu ar reuși.'],
    ['Masca de subrețea este greșită', false, 'Ar afecta și accesul la adrese.'],
    ['Lease-ul DHCP a expirat', false, 'Dacă ar fi expirat, nu ai mai avea adresă.'],
  ], 'IP merge, numele nu ⇒ DNS.'),
  single({ id: '4.3-012' }, 2, 'Ce tip de înregistrare DNS mapează un nume la o adresă IPv4?', [
    ['A', true, 'A = address (IPv4).'],
    ['AAAA', false, 'AAAA mapează la IPv6.'],
    ['MX', false, 'MX indică serverul de e-mail.'],
    ['PTR', false, 'PTR mapează adresa la nume (invers).'],
  ], 'A = IPv4; AAAA = IPv6.'),
  single({ id: '4.3-013' }, 2, 'Ce comandă IOS oprește încercarea routerului de a rezolva prin DNS cuvintele tastate greșit?', [
    ['no ip domain-lookup', true, 'Opreste căutarea DNS pentru ceea ce IOS crede că este un nume de gazdă.'],
    ['no ip name-server', false, 'Șterge serverul DNS, dar comportamentul de „lookup” rămâne activ.'],
    ['ip domain-lookup', false, 'Activează (este implicită).'],
    ['no ip host', false, 'Șterge o înregistrare statică, nu oprește căutarea.'],
  ], 'no ip domain-lookup.'),
  order({ id: '4.3-014' }, 1, 'Ordonează mesajele DHCP pentru obținerea inițială a unei adrese.', [
    { text: 'DHCPDISCOVER (client, broadcast)', why: 'Clientul caută un server.' },
    { text: 'DHCPOFFER (server)', why: 'Serverul propune o adresă și parametri.' },
    { text: 'DHCPREQUEST (client, broadcast)', why: 'Clientul alege și cere oferta.' },
    { text: 'DHCPACK (server)', why: 'Serverul confirmă lease-ul.' },
  ], 'D → O → R → A.'),
  multi({ id: '4.3-015' }, 2, 'Care dintre acestea poate livra DHCP unui client? (alege toate variantele corecte)', [
    ['Adresă IP și mască', true, 'Parametrii de bază.'],
    ['Default gateway', true, 'Opțiunea 3.'],
    ['Serverul DNS', true, 'Opțiunea 6.'],
    ['Durata lease-ului', true, 'Perioada pentru care adresa e închiriată.'],
    ['Parola enable a routerului', false, 'DHCP nu livrează parole de echipament.'],
  ], 'DHCP: IP, mască, gateway, DNS, lease, opțiuni.'),
  single({ id: '4.3-016' }, 2, 'Ce rol are lista de adrese excluse (ip dhcp excluded-address)?', [
    ['Împiedică serverul să ofere acele adrese (gateway, servere cu IP static)', true, 'Evită conflicte cu dispozitivele statice.'],
    ['Interzice anumitor clienți să primească adrese', false, 'Excluderea se referă la adrese, nu la clienți.'],
    ['Schimbă durata lease-ului', false, 'Lease-ul se setează cu lease.'],
    ['Face pool-ul mai mare', false, 'Reduce adresele disponibile.'],
  ], 'Excluderile se declară global.'),
  match({ id: '4.3-017' }, 2, 'Potrivește tipul de înregistrare DNS cu rolul lui.', [
    { left: 'A', right: 'Nume → adresă IPv4', why: 'Cea mai frecventă înregistrare.' },
    { left: 'AAAA', right: 'Nume → adresă IPv6', why: 'Echivalentul lui A pentru IPv6.' },
    { left: 'CNAME', right: 'Alias către alt nume', why: 'Nu indică o adresă direct.' },
    { left: 'MX', right: 'Serverul de e-mail al domeniului', why: 'Include o prioritate.' },
    { left: 'PTR', right: 'Adresă → nume (rezolvare inversă)', why: 'În zona in-addr.arpa.' },
  ], [
    { text: 'Servere DHCP', why: 'Nu este un tip de înregistrare DNS.' },
  ], 'Fiecare tip are un rol diferit.'),
  single({ id: '4.3-018' }, 2, 'Ce diferență există între o interogare recursivă și una iterativă în DNS?', [
    ['Cea recursivă cere răspunsul final; cea iterativă primește doar indicația următorului server', true, 'Clientul cere recursiv; serverul recursiv întreabă iterativ ierarhia.'],
    ['Recursivă folosește TCP; iterativă folosește UDP', false, 'Transportul nu face distincția.'],
    ['Iterativă e folosită doar de clienți', false, 'Invers: clienții cer recursiv.'],
    ['Nu există nicio diferență', false, 'Diferența este fundamentală.'],
  ], 'Recursiv = „adu răspunsul”; iterativ = „spune cine știe”.'),
  single({ id: '4.3-019' }, 2, 'Ce este TTL într-un răspuns DNS?', [
    ['Durata (în secunde) cât poate fi reținut răspunsul în cache', true, 'După TTL, interogarea se repetă.'],
    ['Numărul de routere traversate', false, 'Acesta este TTL din antetul IP, un alt concept.'],
    ['Durata lease-ului DHCP', false, 'Lease-ul este un concept DHCP.'],
    ['Portul serverului', false, 'Nu are legătură.'],
  ], 'TTL DNS = durata cache-ului.'),

  // ======================= Configurare și verificare =======================
  single({ id: '4.3-020' }, 1, 'Ce comandă afișează lease-urile active pe un router care e server DHCP?', [
    ['show ip dhcp binding', true, 'Arată adresă IP, MAC, expirare.'],
    ['show dhcp lease', false, 'Aceasta arată informații despre clientul DHCP al interfeței, nu lease-urile oferite.'],
    ['show ip dhcp relay', false, 'Nu există această comandă standard.'],
    ['show ip route dhcp', false, 'Nu arată lease-uri.'],
  ], 'show ip dhcp binding.'),
  single({ id: '4.3-021' }, 2, 'Care este rolul comenzii default-router într-un pool DHCP?', [
    ['Setează gateway-ul livrat clienților', true, 'Opțiunea 3.'],
    ['Setează gateway-ul routerului însuși', false, 'Routerul își stabilește gateway-ul cu ip route.'],
    ['Definește serverul DNS', false, 'DNS se setează cu dns-server.'],
    ['Setează durata lease-ului', false, 'Lease-ul se setează cu lease.'],
  ], 'default-router = gateway pentru clienți.'),
  cli({ id: '4.3-022' }, 2, 'Ești în R1(config)#. Exclude adresele 192.168.1.1–192.168.1.10 din oferte.', 'R1(config)#', 'ip dhcp excluded-address 192.168.1.1 192.168.1.10', ['ip dhcp excluded-address 192.168.1.1 192.168.1.10'], [
    { text: 'ip dhcp exclude 192.168.1.1 192.168.1.10', why: 'Cuvântul cheie este excluded-address.' },
    { text: 'excluded-address 192.168.1.1 192.168.1.10', why: 'În modul pool nu există această comandă; se dă în configurare globală cu prefixul ip dhcp.' },
    { text: 'ip dhcp excluded-address 192.168.1.1-192.168.1.10', why: 'Intervalul se scrie cu două adrese separate prin spațiu.' },
  ], 'ip dhcp excluded-address <de la> <la>.', 'ip dhcp …'),
  cli({ id: '4.3-023' }, 1, 'Ești în R1(config)#. Creează pool-ul DHCP numit LAN.', 'R1(config)#', 'ip dhcp pool LAN', ['ip dhcp pool LAN'], [
    { text: 'dhcp pool LAN', why: 'Comanda începe cu ip.' },
    { text: 'ip pool LAN', why: 'Lipsește cuvântul dhcp.' },
    { text: 'ip dhcp LAN', why: 'Lipsește cuvântul cheie pool.' },
  ], 'ip dhcp pool <nume>.', 'ip dhcp …'),
  cli({ id: '4.3-024' }, 2, 'Ești în R1(dhcp-config)#. Definește rețeaua 192.168.1.0/24 a pool-ului.', 'R1(dhcp-config)#', 'network 192.168.1.0 255.255.255.0', ['network 192.168.1.0 255.255.255.0', 'network 192.168.1.0 /24'], [
    { text: 'network 192.168.1.0 0.0.0.255', why: 'Aici se folosește masca de subrețea, nu wildcard.' },
    { text: 'ip network 192.168.1.0 255.255.255.0', why: 'În modul dhcp-config comanda este doar network.' },
    { text: 'subnet 192.168.1.0 255.255.255.0', why: 'Nu este comanda IOS.' },
  ], 'network <rețea> <mască>.', 'network …'),
  cli({ id: '4.3-025' }, 2, 'Ești în R1(dhcp-config)#. Setează gateway-ul livrat clienților la 192.168.1.1.', 'R1(dhcp-config)#', 'default-router 192.168.1.1', ['default-router 192.168.1.1'], [
    { text: 'gateway 192.168.1.1', why: 'Nu este comanda IOS; se folosește default-router.' },
    { text: 'default-gateway 192.168.1.1', why: 'Este sintaxa de la alte sisteme; la IOS pool-ul folosește default-router.' },
    { text: 'ip default-router 192.168.1.1', why: 'În modul pool nu se folosește prefixul ip.' },
  ], 'default-router <ip>.', 'default-router …'),
  cli({ id: '4.3-026' }, 2, 'Ești în R1(dhcp-config)#. Setează serverul DNS livrat clienților la 8.8.8.8.', 'R1(dhcp-config)#', 'dns-server 8.8.8.8', ['dns-server 8.8.8.8'], [
    { text: 'ip name-server 8.8.8.8', why: 'Aceasta setează DNS-ul routerului, nu al clienților.' },
    { text: 'dns 8.8.8.8', why: 'Nu este comanda IOS.' },
    { text: 'name-server 8.8.8.8', why: 'În pool se folosește dns-server.' },
  ], 'dns-server <ip> în pool.', 'dns-server …'),
  cli({ id: '4.3-027' }, 2, 'Ești în R1(config)#. Configurează routerul să folosească serverul DNS 8.8.8.8 pentru propriile interogări.', 'R1(config)#', 'ip name-server 8.8.8.8', ['ip name-server 8.8.8.8'], [
    { text: 'dns-server 8.8.8.8', why: 'Aceasta este comanda din pool-ul DHCP, nu cea de client DNS a routerului.' },
    { text: 'ip dns 8.8.8.8', why: 'Nu este sintaxa IOS.' },
    { text: 'ip domain-name 8.8.8.8', why: 'domain-name setează un sufix, nu un server.' },
  ], 'ip name-server <ip>.', 'ip name-server …'),
  cli({ id: '4.3-028' }, 1, 'Ești în R1(config)#. Oprește căutările DNS provocate de comenzi tastate greșit.', 'R1(config)#', 'no ip domain-lookup', ['no ip domain-lookup'], [
    { text: 'no ip name-server', why: 'Șterge serverul DNS; lookup-ul rămâne activ.' },
    { text: 'ip domain-lookup off', why: 'Nu există astfel de sintaxă.' },
    { text: 'no ip dns', why: 'Nu este comandă IOS validă.' },
  ], 'no ip domain-lookup.', 'no ip …'),
  single({ id: '4.3-029' }, 2, 'PC1 primește adresă din 192.168.1.0/24, dar nu ajunge la Internet. ipconfig /all arată gateway 0.0.0.0. Ce lipsește din pool-ul DHCP?', [
    ['default-router', true, 'Fără el, clientul primește adresa dar nu are gateway.'],
    ['dns-server', false, 'DNS lipsă afectează numele, nu gateway-ul.'],
    ['lease', false, 'Lease-ul are valoare implicită.'],
    ['domain-name', false, 'Sufixul nu influențează gateway-ul.'],
  ], 'Fără default-router, clientul nu are gateway.'),
  single({ id: '4.3-030' }, 3, 'show ip dhcp server statistics arată DHCPDISCOVER 15 și DHCPOFFER 0. Ce înseamnă?', [
    ['Serverul primește cereri, dar nu are adrese de oferit pe acea interfață (pool nepotrivit sau epuizat)', true, 'Cererile ajung; oferta nu se produce.'],
    ['Cererile nu ajung deloc la server', false, 'DISCOVER este numărat, deci cererile ajung.'],
    ['Clienții au adrese statice', false, 'Atunci nu ar mai trimite Discover.'],
    ['Serverul oferă adrese dar clienții le refuză', false, 'Atunci OFFER nu ar fi 0.'],
  ], 'DISCOVER fără OFFER = problemă de pool.'),
  single({ id: '4.3-031' }, 2, 'Un client are IP, gateway și DNS corecte, dar adresa lui coincide cu cea a unui server cu IP static. Ce nu s-a configurat?', [
    ['Excluderea adresei statice din pool', true, 'Serverul DHCP a dat o adresă folosită deja.'],
    ['Lease-ul clientului', false, 'Lease-ul nu protejează adrese statice.'],
    ['Opțiunea 43', false, 'Nu are legătură.'],
    ['Domain-name', false, 'Sufixul nu are legătură.'],
  ], 'Adresele statice se exclud din pool.'),
  single({ id: '4.3-032' }, 2, 'Ce comandă Windows eliberează lease-ul curent?', [
    ['ipconfig /release', true, 'Renunță la adresa curentă.'],
    ['ipconfig /renew', false, 'Cere o adresă (reînnoire).'],
    ['ipconfig /flushdns', false, 'Golește cache-ul DNS.'],
    ['ipconfig /displaydns', false, 'Afișează cache-ul DNS.'],
  ], '/release, apoi /renew.'),
  single({ id: '4.3-033' }, 2, 'Ce comandă Windows golește cache-ul DNS local?', [
    ['ipconfig /flushdns', true, 'Șterge înregistrările din cache.'],
    ['ipconfig /release', false, 'Eliberează lease-ul DHCP.'],
    ['arp -d *', false, 'Șterge cache-ul ARP.'],
    ['netsh reset', false, 'Nu este comanda corectă pentru DNS.'],
  ], '/flushdns.'),
  single({ id: '4.3-034' }, 3, 'Un client trimite cereri DHCP într-un VLAN fără server și fără relay. Ce se întâmplă?', [
    ['Primește 169.254.x.x (APIPA), pentru că broadcast-ul DHCP nu trece de router', true, 'Fără server în subrețea sau relay, nu primește răspuns.'],
    ['Primește o adresă din alt VLAN', false, 'Broadcast-ul nu traversează VLAN-uri/routere.'],
    ['Primește adresa 0.0.0.0 permanent', false, 'Clientul își atribuie link-local, nu rămâne la 0.0.0.0.'],
    ['Serverul DNS îi dă o adresă', false, 'DNS nu atribuie adrese.'],
  ], 'Relay-ul (4.6) rezolvă acest caz.'),
  single({ id: '4.3-035' }, 2, 'Care este diferența dintre un server DNS recursiv și unul autoritativ?', [
    ['Cel recursiv rezolvă pentru clienți interogând ierarhia; cel autoritativ deține zona și dă răspunsul final', true, 'Roluri complementare.'],
    ['Cel autoritativ rezolvă pentru clienți; cel recursiv deține zona', false, 'Invers.'],
    ['Sunt același lucru', false, 'Sunt roluri diferite.'],
    ['Autoritativ folosește TCP, recursiv UDP', false, 'Transportul nu este criteriul.'],
  ], 'Recursiv = lucrează pentru client; autoritativ = deține zona.'),
  single({ id: '4.3-036' }, 1, 'Cum află un client DHCP, în mod obișnuit, adresa serverului DNS?', [
    ['O primește de la serverul DHCP împreună cu adresa IP', true, 'DNS este opțiunea 6.'],
    ['O descoperă prin ARP', false, 'ARP rezolvă MAC-uri, nu servere DNS.'],
    ['O primește de la NTP', false, 'NTP nu livrează DNS.'],
    ['O deduce din masca de subrețea', false, 'Nu este posibil.'],
  ], 'DNS vine prin DHCP.'),
  single({ id: '4.3-037' }, 2, 'Ce înregistrare DNS indică serverul de e-mail al unui domeniu?', [
    ['MX', true, 'Mail Exchanger, cu prioritate.'],
    ['NS', false, 'NS indică serverele DNS autoritative.'],
    ['A', false, 'A dă o adresă IPv4.'],
    ['SOA', false, 'SOA descrie autoritatea zonei.'],
  ], 'MX = e-mail.'),
  single({ id: '4.3-038' }, 2, 'Când folosește DNS TCP în loc de UDP?', [
    ['La răspunsuri mari și la transferul zonelor între servere', true, 'TCP 53 acoperă aceste cazuri.'],
    ['Niciodată', false, 'DNS folosește și TCP.'],
    ['La orice interogare A', false, 'Interogările obișnuite sunt UDP.'],
    ['Doar când serverul e în aceeași rețea', false, 'Nu este criteriul.'],
  ], 'UDP 53 implicit; TCP 53 la nevoie.'),
  single({ id: '4.3-039' }, 3, 'Un laptop se mută din rețeaua A în rețeaua B și își păstrează vechea adresă din A. Ce face DHCP la reconectare?', [
    ['Clientul cere (Request) vechea adresă; serverul din B trimite NAK iar clientul reia DORA', true, 'Adresa nu mai e validă în noua subrețea.'],
    ['Serverul din B acceptă adresa din A', false, 'Nu aparține subrețelei lui.'],
    ['Clientul rămâne fără rețea până la repornire', false, 'NAK declanșează reluarea DORA.'],
    ['Clientul folosește APIPA imediat', false, 'APIPA apare doar dacă nu răspunde niciun server.'],
  ], 'NAK → DORA de la capăt.'),
  single({ id: '4.3-040' }, 3, 'Ce se întâmplă dacă un al doilea server DHCP neautorizat (rogue) apare în VLAN?', [
    ['Poate oferi clienților adrese/gateway/DNS greșite, deviind sau interceptând traficul', true, 'Clienții acceptă prima ofertă; de aceea există măsuri precum DHCP snooping (5.7).'],
    ['Nu are efect, clienții ignoră ofertele multiple', false, 'Clienții aleg una dintre oferte.'],
    ['Routerul închide automat portul', false, 'Fără snooping nu există această protecție.'],
    ['NAT blochează oferta', false, 'NAT nu are legătură.'],
  ], 'Rogue DHCP = risc; mitigare: DHCP snooping.'),
];
