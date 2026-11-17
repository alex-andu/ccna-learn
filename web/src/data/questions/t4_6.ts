import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.6 Configure and verify DHCP client and relay.
// Obiectivul oficial nu are sub-puncte; `sub` = '4.6'. Fiecare variantă are explicație (why).
const T = '4.6';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_6: Question[] = [
  // ======================= Scop și concepte =======================
  single({ id: '4.6-001' }, 1, 'Care este rolul unui relay DHCP (ip helper-address)?', [
    ['Retransmite cererile DHCP ale clienților, ca unicast, către un server aflat în altă subrețea', true, 'Relay-ul face legătura între domeniul de broadcast al clienților și serverul DHCP.'],
    ['Atribuie el însuși adrese clienților', false, 'Adresele vin de la serverul DHCP; relay-ul doar transportă mesajele.'],
    ['Criptează traficul DHCP', false, 'DHCP nu este criptat și relay-ul nu schimbă asta.'],
    ['Sincronizează ceasurile clienților', false, 'Aceasta este funcția NTP.'],
  ], 'Relay = mesager între client și un server din altă subrețea.'),
  single({ id: '4.6-002' }, 1, 'Ce porturi UDP folosește DHCP?', [
    ['67 (server) și 68 (client)', true, 'Serverul/relay-ul ascultă pe 67, clientul pe 68.'],
    ['53 și 123', false, '53 este DNS, 123 este NTP.'],
    ['161 și 162', false, 'Acestea sunt porturile SNMP.'],
    ['20 și 21', false, 'Acestea sunt porturile FTP.'],
  ], 'DHCP: UDP 67/68.'),
  single({ id: '4.6-003' }, 1, 'Cum configurezi o interfață a unui router ca să își ia adresa prin DHCP?', [
    ['ip address dhcp', true, 'Comanda de interfață care transformă interfața în client DHCP.'],
    ['ip helper-address dhcp', false, 'helper-address cere adresa serverului și nu face interfața client.'],
    ['ip dhcp client enable', false, 'Nu este sintaxa IOS clasică.'],
    ['dhcp client auto', false, 'Nu există această comandă IOS.'],
  ], 'ip address dhcp în modul de interfață.'),
  single({ id: '4.6-004' }, 1, 'În ce situație este tipic un router client DHCP?', [
    ['Interfața dinspre ISP primește o adresă dinamică de la furnizor', true, 'ISP-urile mici oferă adesea adresă prin DHCP la WAN.'],
    ['Routerul servește adrese pentru LAN-ul propriu', false, 'Acela este rolul de server, nu de client.'],
    ['Routerul transportă DHCP între două subrețele', false, 'Acela este rolul de relay.'],
    ['Routerul sincronizează ceasul', false, 'Nu are legătură cu DHCP.'],
  ], 'Client DHCP = interfața își primește adresa.'),
  single({ id: '4.6-005' }, 2, 'Ce primește, în mod obișnuit, un router care folosește ip address dhcp?', [
    ['Adresă, mască și (dacă serverul trimite gateway) o rută implicită', true, 'Opțiunile 1 și 3 duc la adresă/mască și rută implicită.'],
    ['Doar adresa, fără mască', false, 'Masca vine împreună cu adresa.'],
    ['O rută statică pentru fiecare rețea din Internet', false, 'Nu se trimit rute din Internet prin DHCP.'],
    ['Cheia de criptare SSH', false, 'DHCP nu distribuie chei.'],
  ], 'Adresă + mască + gateway (rută implicită) + DNS + lease.'),
  single({ id: '4.6-006' }, 1, 'De ce un server DHCP din altă subrețea nu primește Discover-ul clientului fără relay?', [
    ['Broadcast-ul nu este retransmis de router', true, 'Fiecare interfață de router este un domeniu de broadcast separat.'],
    ['Discover-ul este criptat', false, 'DHCP nu criptează.'],
    ['Discover-ul folosește TCP', false, 'DHCP folosește UDP.'],
    ['Serverele DHCP nu acceptă clienți noi', false, 'Un server acceptă clienți noi; problema este de transport.'],
  ], 'Routerul oprește broadcast-urile.'),
  single({ id: '4.6-007' }, 2, 'Pe ce interfață a routerului se configurează ip helper-address?', [
    ['Pe interfața dinspre clienți', true, 'Aici sosesc broadcast-urile care trebuie relayate.'],
    ['Pe interfața dinspre server', false, 'Pe acea interfață nu sosesc cererile clienților.'],
    ['Doar în modul de configurare globală', false, 'Este comandă de interfață.'],
    ['Pe toate interfețele, obligatoriu', false, 'Doar interfețele cu clienți au nevoie de ea.'],
  ], 'Comanda stă pe interfața clienților.'),
  single({ id: '4.6-008' }, 2, 'Ce reprezintă câmpul giaddr dintr-un mesaj DHCP relayat?', [
    ['Adresa interfeței relay pe care a sosit cererea clientului', true, 'Relay-ul o scrie ca serverul să știe subrețeaua clientului.'],
    ['Adresa MAC a serverului', false, 'MAC-ul clientului este în chaddr; giaddr este o adresă IP.'],
    ['Adresa IP oferită clientului', false, 'Aceea este yiaddr.'],
    ['Portul UDP al clientului', false, 'giaddr nu este un port.'],
  ], 'giaddr = adresa interfeței relay.'),
  single({ id: '4.6-009' }, 2, 'Ce tip de pachet trimite relay-ul către server după ce primește Discover-ul broadcast?', [
    ['Unicast către adresa din ip helper-address', true, 'Relay-ul transformă broadcast-ul în unicast.'],
    ['Broadcast pe interfața spre server', false, 'Scopul relay-ului este tocmai evitarea broadcast-ului.'],
    ['Multicast 224.0.0.5', false, 'Aceea este adresa OSPF.'],
    ['Nimic, îl ignoră', false, 'Fără relay ar ignora; cu relay îl retransmite.'],
  ], 'Broadcast → unicast spre server.'),
  single({ id: '4.6-010' }, 2, 'Către ce adresă trimite serverul răspunsul (Offer/Ack) într-un schimb relayat?', [
    ['Către giaddr (unicast), de unde relay-ul îl livrează clientului', true, 'Clientul nu are încă IP; serverul răspunde relay-ului.'],
    ['Către 255.255.255.255 direct', false, 'Broadcast-ul nu ar traversa routerul spre client.'],
    ['Către adresa 0.0.0.0', false, 'Aceea este sursa Discover-ului, nu o destinație utilă.'],
    ['Către adresa serverului DNS', false, 'DNS nu participă la schimbul DHCP.'],
  ], 'Răspuns unicast către giaddr.'),
  single({ id: '4.6-011' }, 2, 'Cum alege serverul pool-ul pentru o cerere relayată?', [
    ['Alege pool-ul care conține adresa din giaddr', true, 'giaddr arată subrețeaua clientului.'],
    ['Alege mereu primul pool configurat', false, 'Ar da clienților adrese din subrețea greșită.'],
    ['Alege pool-ul după adresa MAC a clientului', false, 'MAC-ul nu determină subrețeaua.'],
    ['Alege un pool la întâmplare', false, 'Selecția este deterministă, după giaddr.'],
  ], 'Pool-ul se alege după giaddr.'),
  single({ id: '4.6-012' }, 2, 'Un PC aflat în spatele unui relay are adresa 169.254.7.21. Ce indică cel mai probabil?', [
    ['Cererea DHCP nu ajunge la un server sau răspunsul nu revine (de exemplu relay lipsă/greșit)', true, '169.254.x.x este APIPA, autoalocată când nu răspunde niciun server.'],
    ['Serverul DHCP a oferit această adresă', false, 'APIPA nu vine de la un server.'],
    ['Lease-ul a fost prelungit', false, 'O prelungire păstrează adresa DHCP.'],
    ['PC-ul are adresă statică', false, 'APIPA este alocată automat, nu manual.'],
  ], 'APIPA = DHCP indisponibil.'),
  single({ id: '4.6-013' }, 2, 'Care este adresa sursă a unui Discover trimis de un client fără adresă?', [
    ['0.0.0.0', true, 'Clientul nu are încă adresă; folosește 0.0.0.0.'],
    ['255.255.255.255', false, 'Aceasta este destinația (broadcast), nu sursa.'],
    ['Adresa gateway-ului', false, 'Clientul nu o cunoaște încă.'],
    ['169.254.0.1', false, 'APIPA apare doar după eșecul DHCP.'],
  ], 'Sursă 0.0.0.0, destinație 255.255.255.255.'),
  single({ id: '4.6-014' }, 3, 'Ce efect secundar are ip helper-address în mod implicit?', [
    ['Retransmite și alte broadcast-uri UDP (de exemplu DNS, TFTP, NetBIOS)', true, 'Un set de servicii UDP este activat implicit.'],
    ['Dezactivează DHCP pe interfață', false, 'Din contră: activează relay-ul.'],
    ['Blochează tot traficul UDP', false, 'Nu blochează, ci retransmite.'],
    ['Activează NAT pe interfață', false, 'NAT este o funcție separată (4.1).'],
  ], 'helper forwardează și alte UDP.'),
  single({ id: '4.6-015' }, 3, 'Ce face no ip forward-protocol udp 137?', [
    ['Oprește retransmiterea broadcast-urilor NetBIOS name service prin helper', true, '137 este NetBIOS name service; comanda îl scoate din lista retransmisă.'],
    ['Dezactivează relay-ul DHCP', false, 'DHCP folosește 67/68, nu 137.'],
    ['Blochează portul 137 pe orice interfață', false, 'Nu este o ACL; doar elimină retransmiterea.'],
    ['Activează NetBIOS', false, 'Face invers.'],
  ], 'Se scot servicii nedorite din forward-protocol.'),
  single({ id: '4.6-016' }, 3, 'Poți configura mai multe adrese ip helper-address pe aceeași interfață?', [
    ['Da, cererea este trimisă către toate serverele', true, 'Util pentru redundanță.'],
    ['Nu, doar una', false, 'IOS acceptă mai multe.'],
    ['Da, dar doar una e activă', false, 'Toate primesc cererea.'],
    ['Doar dacă sunt în aceeași subrețea', false, 'Nu există această restricție.'],
  ], 'Mai multe helper-address = copii către fiecare.'),
  single({ id: '4.6-017' }, 3, 'Ce trebuie să aibă serverul DHCP pentru ca răspunsul să ajungă la un client din spatele unui relay?', [
    ['O rută spre subrețeaua din giaddr (sau un gateway implicit către relay)', true, 'Fără rută, răspunsul unicast către giaddr nu ajunge.'],
    ['Adresa MAC a clientului configurată manual', false, 'MAC-ul vine în mesaj.'],
    ['O adresă IP din subrețeaua clientului', false, 'Serverul poate fi în altă subrețea; are nevoie de rută.'],
    ['Un al doilea server DHCP', false, 'Nu este necesar.'],
  ], 'Server → ruta spre giaddr.'),
  single({ id: '4.6-018' }, 2, 'Unde se configurează ip dhcp excluded-address într-un scenariu cu relay?', [
    ['Pe serverul DHCP', true, 'Excluderile fac parte din configurarea serverului.'],
    ['Pe relay', false, 'Relay-ul nu gestionează adrese.'],
    ['Pe clienți', false, 'Clienții nu au această comandă.'],
    ['Pe switch', false, 'Switch-ul nu participă la alocare.'],
  ], 'Excluderile = pe server.'),
  single({ id: '4.6-019' }, 2, 'Ce arată coloana Method din show ip interface brief pentru o interfață configurată cu ip address dhcp?', [
    ['DHCP', true, 'Marchează sursa adresei.'],
    ['manual', false, 'Aceasta apare la adresele configurate static.'],
    ['NVRAM', false, 'Arată adrese încărcate din config la boot, nu cele din DHCP.'],
    ['unset', false, 'Interfața nu are adresă configurată.'],
  ], 'Method = DHCP.'),
  single({ id: '4.6-020' }, 2, 'Ce verificare pe server arată că relay-ul a funcționat și clientul a primit o adresă?', [
    ['show ip dhcp binding', true, 'Arată adresele alocate și MAC-urile clienților.'],
    ['show ip route static', false, 'Arată rute statice, nu leases.'],
    ['show ntp status', false, 'Este pentru NTP.'],
    ['show vlan brief', false, 'Arată VLAN-urile, nu leases.'],
  ], 'show ip dhcp binding pe server.'),
  single({ id: '4.6-021' }, 2, 'Cum verifici pe relay că ip helper-address este configurat pe o interfață?', [
    ['show ip interface <interfață> și cauți „Helper address”', true, 'Linia apare în ieșirea comenzii.'],
    ['show ip dhcp binding', false, 'Se folosește pe server, nu confirmă helper-ul.'],
    ['show vlan', false, 'Nu are legătură.'],
    ['show cdp neighbors', false, 'Arată vecini, nu helper-address.'],
  ], 'show ip interface arată Helper address.'),
  single({ id: '4.6-022' }, 2, 'Un switch de acces trebuie să primească adresa de management prin DHCP. Ce configurezi?', [
    ['ip address dhcp pe interfața VLAN de management (SVI)', true, 'SVI-ul poate fi client DHCP.'],
    ['ip helper-address pe SVI', false, 'Aceasta ar face SVI-ul relay, nu client.'],
    ['ip dhcp pool pe switch', false, 'Aceasta ar face switch-ul server.'],
    ['ip route 0.0.0.0 dhcp', false, 'Nu este o comandă IOS validă.'],
  ], 'SVI + ip address dhcp.'),
  single({ id: '4.6-023' }, 3, 'Care comandă este echivalentul relay pentru DHCPv6?', [
    ['ipv6 dhcp relay destination', true, 'Se configurează pe interfața dinspre clienți.'],
    ['ip helper-address ipv6', false, 'Nu este sintaxa IPv6.'],
    ['ipv6 dhcp pool', false, 'Aceasta creează un pool de server.'],
    ['ipv6 nd managed-config-flag', false, 'Aceasta setează un flag în RA, nu relay.'],
  ], 'DHCPv6 relay = ipv6 dhcp relay destination.'),
  single({ id: '4.6-024' }, 3, 'De ce trimite clientul Request tot ca broadcast, deși a primit deja o ofertă?', [
    ['Ca să anunțe toate serverele care a fost oferta aleasă, iar celelalte să își elibereze adresele oferite', true, 'Request-ul broadcast informează toți serverii.'],
    ['Pentru că nu are încă MAC', false, 'Clientul are MAC; problema este adresa IP.'],
    ['Pentru că unicast nu funcționează în DHCP', false, 'Reînnoirile ulterioare sunt unicast.'],
    ['Pentru a ocoli ACL-urile', false, 'Nu are legătură cu ACL.'],
  ], 'Request = broadcast, ca să-l vadă toate serverele.'),
  single({ id: '4.6-025' }, 3, 'Ce se întâmplă dacă relay-ul nu are rută spre adresa din ip helper-address?', [
    ['Cererea nu poate fi trimisă; clienții rămân fără adresă (APIPA)', true, 'Fără rută, unicast-ul spre server nu pleacă.'],
    ['Cererea merge prin broadcast', false, 'Relay-ul nu cade înapoi pe broadcast.'],
    ['Routerul devine server DHCP', false, 'Nu schimbă rolul.'],
    ['Serverul primește cererea oricum', false, 'Fără rută nu ajunge.'],
  ], 'Fără rută spre server relay-ul nu funcționează.'),
  single({ id: '4.6-026' }, 3, 'Pool-ul de pe server este pentru 192.168.1.0/24, dar giaddr este 192.168.10.1. Ce se întâmplă?', [
    ['Serverul nu are un pool potrivit și nu oferă adresă din pool-ul greșit', true, 'Selecția se face după giaddr.'],
    ['Serverul oferă totuși o adresă din 192.168.1.0/24', false, 'Adresa nu ar fi utilizabilă în subrețeaua clientului.'],
    ['Serverul își schimbă pool-ul automat', false, 'Nu se reconfigurează singur.'],
    ['Relay-ul traduce adresele', false, 'Relay-ul nu face NAT.'],
  ], 'Pool-ul trebuie să acopere giaddr.'),
  single({ id: '4.6-027' }, 2, 'Două VLAN-uri de clienți (10 și 20), un singur server central. Ce configurezi pe routerul/switch-ul L3?', [
    ['ip helper-address pe fiecare interfață/SVI de VLAN client', true, 'Fiecare subrețea are nevoie de relay propriu.'],
    ['ip helper-address o singură dată, global', false, 'Este comandă de interfață, nu globală.'],
    ['Un server DHCP pe fiecare VLAN, obligatoriu', false, 'Relay-ul tocmai evită asta.'],
    ['Nimic: VLAN-urile primesc adrese automat', false, 'Fără relay/server local, nu primesc.'],
  ], 'Relay pe fiecare SVI client.'),
  single({ id: '4.6-028' }, 3, 'Ruta implicită învățată de un router prin ip address dhcp apare în tabela de rutare ca…', [
    ['Rută implicită cu distanță administrativă mare, uzual 254 (verifică cu show ip route)', true, 'Este mai puțin preferată decât rutele statice manuale.'],
    ['O rută conectată (C)', false, 'Ruta conectată este pentru subrețeaua interfeței.'],
    ['O rută OSPF', false, 'Nu are legătură cu OSPF.'],
    ['Nu apare niciodată', false, 'Apare, dacă serverul trimite gateway.'],
  ], 'Rută implicită DHCP, AD mare.'),

  // ======================= Multi =======================
  multi({ id: '4.6-029' }, 2, 'Care afirmații despre relay-ul DHCP sunt adevărate? (alege toate variantele corecte)', [
    ['Se configurează pe interfața dinspre clienți', true, 'Acolo sosesc broadcast-urile.'],
    ['Transformă broadcast-ul clientului în unicast către server', true, 'Mecanismul de bază.'],
    ['Completează giaddr cu adresa interfeței clienților', true, 'Așa află serverul subrețeaua.'],
    ['Atribuie el adresele din pool', false, 'Adresele vin de la server.'],
  ], 'Relay = transport, nu alocare.'),
  multi({ id: '4.6-030' }, 3, 'Care sunt cauze posibile ale clienților pe 169.254.x.x în spatele unui relay? (alege toate variantele corecte)', [
    ['ip helper-address lipsește sau este pe interfața greșită', true, 'Discover-ul nu este retransmis.'],
    ['Serverul nu are un pool pentru subrețeaua din giaddr', true, 'Nu poate oferi adresă.'],
    ['Serverul nu are rută spre subrețeaua clienților', true, 'Răspunsul nu revine.'],
    ['Un ACL blochează UDP 67 între relay și server', true, 'Mesajele nu trec.'],
    ['Clientul are lease valid de la ieri', false, 'Cu un lease valid nu ar avea APIPA.'],
  ], 'Verifici helper, pool, rute, ACL.'),
  multi({ id: '4.6-031' }, 2, 'Ce informații poate primi un router client DHCP? (alege toate variantele corecte)', [
    ['Adresa IP și masca', true, 'Opțiunea de bază.'],
    ['Gateway-ul implicit', true, 'Opțiunea 3.'],
    ['Serverul DNS', true, 'Opțiunea 6.'],
    ['Durata lease-ului', true, 'Opțiunea 51.'],
    ['Parola de enable', false, 'DHCP nu distribuie credențiale.'],
  ], 'IP, mască, gateway, DNS, lease.'),

  // ======================= Match =======================
  match({ id: '4.6-032' }, 2, 'Potrivește comanda cu rolul ei.', [
    { left: 'ip address dhcp', right: 'Interfața devine client DHCP', why: 'Interfața cere adresă de la un server.' },
    { left: 'ip helper-address', right: 'Relay către un server DHCP', why: 'Retransmite broadcast-urile ca unicast.' },
    { left: 'ip dhcp excluded-address', right: 'Adrese rezervate pe server', why: 'Se configurează pe serverul DHCP.' },
    { left: 'show ip dhcp binding', right: 'Lista adreselor alocate (pe server)', why: 'Arată leases și MAC-urile.' },
  ], [
    { text: 'ntp server', why: 'Aceasta setează sursa de timp.' },
  ], 'Client, relay, excluderi, verificare.'),
  match({ id: '4.6-033' }, 2, 'Potrivește mesajul DHCP cu sensul său într-un schimb relayat.', [
    { left: 'Discover', right: 'Broadcast al clientului fără adresă', why: 'Sursă 0.0.0.0, destinație 255.255.255.255.' },
    { left: 'Offer', right: 'Unicast al serverului către giaddr', why: 'Oferta ajunge la relay.' },
    { left: 'Request', right: 'Broadcast al clientului care alege oferta', why: 'Informează toate serverele.' },
    { left: 'Ack', right: 'Confirmarea serverului, prin giaddr', why: 'Finalizează alocarea.' },
  ], [
    { text: 'NAK al clientului', why: 'NAK este trimis de server, nu de client.' },
  ], 'D-O-R-A.'),

  // ======================= Order =======================
  order({ id: '4.6-034' }, 2, 'Ordonează un schimb DHCP relayat.', [
    { text: 'Clientul trimite Discover broadcast', why: 'Primul pas.' },
    { text: 'Relay-ul îl trimite unicast serverului, cu giaddr', why: 'Broadcast → unicast.' },
    { text: 'Serverul alege pool-ul după giaddr și trimite Offer', why: 'Selecția pool-ului.' },
    { text: 'Relay-ul livrează Offer clientului', why: 'Ultima porțiune.' },
    { text: 'Clientul trimite Request; urmează Ack', why: 'Finalizare.' },
  ], 'Discover → relay → Offer → client → Request/Ack.'),
  order({ id: '4.6-035' }, 2, 'Ordonează pașii pentru a face un router client DHCP.', [
    { text: 'Intri în modul de configurare a interfeței', why: 'Totul se face pe interfață.' },
    { text: 'ip address dhcp', why: 'Cere adresă prin DHCP.' },
    { text: 'no shutdown', why: 'Interfața trebuie pornită pentru a trimite Discover.' },
    { text: 'show ip interface brief', why: 'Verifici Method = DHCP și adresa primită.' },
  ], 'Interfață → ip address dhcp → no shutdown → verificare.'),

  // ======================= CLI =======================
  cli({ id: '4.6-036' }, 1, 'Ești în R1(config-if)#. Fă ca interfața să primească adresa prin DHCP.', 'R1(config-if)#', 'ip address dhcp', ['ip address dhcp'], [
    { text: 'ip dhcp client', why: 'Nu este comanda de client.' },
    { text: 'ip helper-address dhcp', why: 'helper-address cere o adresă de server.' },
    { text: 'dhcp enable', why: 'Nu este sintaxă IOS.' },
  ], 'ip address dhcp.', 'ip address …'),
  cli({ id: '4.6-037' }, 2, 'Ești în R1(config-if)# pe interfața dinspre clienți. Relayează cererile DHCP către serverul 172.16.0.10.', 'R1(config-if)#', 'ip helper-address 172.16.0.10', ['ip helper-address 172.16.0.10'], [
    { text: 'ip dhcp relay 172.16.0.10', why: 'Nu este sintaxa IOS clasică.' },
    { text: 'ip helper 172.16.0.10', why: 'Numele corect este helper-address.' },
    { text: 'ip dhcp server 172.16.0.10', why: 'Nu configurează relay.' },
  ], 'ip helper-address <server>.', 'ip helper-address …'),
  cli({ id: '4.6-038' }, 2, 'Ești în SRV# (EXEC). Afișează adresele alocate clienților.', 'SRV#', 'show ip dhcp binding', ['show ip dhcp binding'], [
    { text: 'show dhcp lease', why: 'Arată lease-ul primit de un client, nu leases-urile alocate.' },
    { text: 'show ip dhcp pool', why: 'Arată pool-urile și utilizarea, nu leases-urile.' },
    { text: 'show ip interface brief', why: 'Arată interfețele, nu leases.' },
  ], 'show ip dhcp binding pe server.', 'show ip dhcp …'),
  cli({ id: '4.6-039' }, 3, 'Ești în R1(config)#. Oprește retransmiterea broadcast-urilor UDP 137 (NetBIOS) făcută de helper.', 'R1(config)#', 'no ip forward-protocol udp 137', ['no ip forward-protocol udp 137', 'no ip forward-protocol udp netbios-ns'], [
    { text: 'no ip helper-address 137', why: 'helper-address cere o adresă IP, nu un port.' },
    { text: 'ip forward-protocol udp 137', why: 'Aceasta adaugă portul, nu îl elimină.' },
    { text: 'no udp forward 137', why: 'Nu este sintaxă IOS.' },
  ], 'no ip forward-protocol udp <port>.', 'no ip forward-protocol …'),
  cli({ id: '4.6-040' }, 2, 'Ești în R1(config-if)# pe Gi0/2 (spre server). Elimină helper-ul greșit 172.16.0.10 de pe această interfață.', 'R1(config-if)#', 'no ip helper-address 172.16.0.10', ['no ip helper-address 172.16.0.10', 'no ip helper-address'], [
    { text: 'ip helper-address 172.16.0.10', why: 'Aceasta îl adaugă.' },
    { text: 'no helper-address', why: 'Comanda începe cu ip.' },
    { text: 'shutdown', why: 'Oprește interfața, nu elimină helper-ul.' },
  ], 'no ip helper-address.', 'no ip helper-address …'),
];
