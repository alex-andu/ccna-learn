import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.5 Compare TCP to UDP.
// 1.5 nu are sub-obiective cu litere → sub = '1.5'; secțiunea logică e în `tags`.
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
const T = '1.5';

export const Q_1_5: Question[] = [
  // ======================= intro: modele, încapsulare =======================
  {
    id: '1.5-001', topicId: T, sub: T, tags: ['intro'], type: 'single', difficulty: 1,
    stem: 'Cum se numește [[pdu|PDU]]-ul la nivelul Transport atunci când se folosește [[tcp|TCP]]?',
    options: [
      { id: 'a', text: 'Segment', correct: true, why: 'Header TCP + date = segment. Este termenul folosit de Cisco pentru PDU-ul L4 (strict, la UDP se spune datagramă).' },
      { id: 'b', text: 'Pachet', correct: false, why: 'Pachetul este PDU-ul nivelului 3 (Network): header IP + segment.' },
      { id: 'c', text: 'Cadru (frame)', correct: false, why: 'Cadrul este PDU-ul nivelului 2 (Data Link): header Ethernet + pachet + FCS.' },
      { id: 'd', text: 'Bit', correct: false, why: 'Biții sunt „PDU-ul” nivelului 1 (Physical) — semnalul de pe mediu.' },
    ],
    explanation: 'Ordinea de la sus în jos: date → segment (L4) → pachet (L3) → cadru (L2) → biți (L1). Mnemonic în engleză: „Some People Fear Birthdays” (Segment, Packet, Frame, Bits).',
  },
  {
    id: '1.5-002', topicId: T, sub: T, tags: ['intro'], type: 'order', difficulty: 1,
    stem: 'Ordonează etapele [[encapsulation|încapsulării]] la un PC care trimite o cerere web.',
    items: [
      { text: 'Aplicația (browserul) generează datele', why: 'Totul pornește de la nivelul Application.' },
      { text: 'Se adaugă header-ul TCP → segment', why: 'Transportul adaugă porturile, seq/ack, flags, window.' },
      { text: 'Se adaugă header-ul IP → pachet', why: 'Nivelul Network adaugă adresele IP sursă/destinație.' },
      { text: 'Se adaugă header-ul și trailer-ul Ethernet → cadru', why: 'Data Link adaugă MAC-urile și FCS-ul la final.' },
      { text: 'Placa de rețea transmite biții pe mediu', why: 'Physical transformă cadrul în semnal electric, optic sau radio.' },
    ],
    explanation: 'Încapsularea merge de sus în jos (L7 → L1); decapsularea, la receptor, de jos în sus. Fiecare nivel tratează tot ce vine de deasupra drept „date”.',
  },
  {
    id: '1.5-003', topicId: T, sub: T, tags: ['intro'], type: 'single', difficulty: 1,
    stem: 'La ce nivel al modelului [[osi|OSI]] funcționează [[tcp|TCP]] și [[udp|UDP]]?',
    options: [
      { id: 'a', text: 'Nivelul 4 — Transport', correct: true, why: 'TCP și UDP sunt protocoalele de transport: comunicație proces-la-proces, identificată prin porturi.' },
      { id: 'b', text: 'Nivelul 3 — Network', correct: false, why: 'La L3 lucrează IP (și ICMP): adresare logică și rutare între rețele, nu între aplicații.' },
      { id: 'c', text: 'Nivelul 5 — Session', correct: false, why: 'Session gestionează dialogul dintre aplicații, dar TCP/UDP nu sunt protocoale de sesiune. În TCP/IP, L5–L7 sunt unite în Application.' },
      { id: 'd', text: 'Nivelul 2 — Data Link', correct: false, why: 'La L2 lucrează Ethernet și 802.11 (adrese MAC, cadre).' },
    ],
    explanation: 'Atât în OSI, cât și în TCP/IP, nivelul Transport este „al patrulea de jos”. De aceea un firewall care filtrează pe porturi e numit „L4”.',
  },
  {
    id: '1.5-004', topicId: T, sub: T, tags: ['intro'], type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare nivel cu numele PDU-ului său.',
    leftLabel: 'Nivel', rightLabel: 'PDU',
    pairs: [
      { left: 'L4 Transport (TCP)', right: 'Segment', why: 'Header TCP + date.' },
      { left: 'L4 Transport (UDP)', right: 'Datagramă', why: 'Header UDP (8 B) + date; mesaje independente, fără conexiune.' },
      { left: 'L3 Network', right: 'Pachet', why: 'Header IP + segment/datagramă.' },
      { left: 'L2 Data Link', right: 'Cadru', why: 'Header Ethernet + pachet + trailer FCS.' },
      { left: 'L1 Physical', right: 'Biți', why: 'Semnalul transmis pe mediu.' },
    ],
    distractors: [{ text: 'Socket', why: 'Un socket nu este un PDU, ci un capăt de comunicație: IP + protocol + port (de ex. 192.168.1.10:51000/TCP).' }],
    explanation: 'Numele PDU-ului îți spune la ce nivel discuți. Întrebările de examen folosesc des „segment” pentru L4, indiferent dacă e TCP sau UDP.',
  },
  {
    id: '1.5-005', topicId: T, sub: T, tags: ['intro'], type: 'single', difficulty: 3,
    stem: 'Un router primește un pachet IPv4 cu valoarea **17** în câmpul Protocol. Ce conține pachetul?',
    options: [
      { id: 'a', text: 'O datagramă [[udp|UDP]]', correct: true, why: 'Câmpul Protocol din header-ul IPv4 indică ce urmează: 17 = UDP, 6 = TCP, 1 = ICMP.' },
      { id: 'b', text: 'Un segment [[tcp|TCP]]', correct: false, why: 'TCP are numărul de protocol 6.' },
      { id: 'c', text: 'Un mesaj [[icmp|ICMP]]', correct: false, why: 'ICMP are numărul de protocol 1.' },
      { id: 'd', text: 'Trafic pe portul 17', correct: false, why: 'Câmpul Protocol (L3) nu este un port. Portul e în header-ul L4, după header-ul IP.' },
    ],
    explanation: 'Decapsularea folosește câmpuri „next header”: EtherType (0x0800 = IPv4) la L2, Protocol (6/17) la L3, portul destinație la L4. Așa știe fiecare nivel cui să predea datele.',
  },

  // ======================= porturi și socket-uri =======================
  {
    id: '1.5-006', topicId: T, sub: T, tags: ['ports'], type: 'single', difficulty: 1,
    stem: 'Care este intervalul porturilor [[well-known-port|well-known]] (system ports), conform IANA?',
    options: [
      { id: 'a', text: '0–1023', correct: true, why: 'Porturile de sistem, alocate serviciilor standard: 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS etc.' },
      { id: 'b', text: '1024–49151', correct: false, why: 'Acesta este intervalul registered (user ports), alocat de IANA aplicațiilor la cerere (de ex. 3389 RDP, 1812 RADIUS).' },
      { id: 'c', text: '49152–65535', correct: false, why: 'Acesta este intervalul dynamic/private/ephemeral — nu se alocă niciodată unor servicii.' },
      { id: 'd', text: '0–65535', correct: false, why: 'Acesta e tot spațiul de porturi (16 biți), nu doar cele well-known.' },
    ],
    explanation: 'RFC 6335: 0–1023 well-known/system · 1024–49151 registered/user · 49152–65535 dynamic/ephemeral.',
  },
  {
    id: '1.5-007', topicId: T, sub: T, tags: ['ports'], type: 'single', difficulty: 2,
    stem: 'Ce interval recomandă IANA pentru porturile [[ephemeral-port|efemere]] (dinamice), folosite ca port sursă de clienți?',
    options: [
      { id: 'a', text: '49152–65535', correct: true, why: 'Intervalul dynamic/private din RFC 6335. Windows (Vista și ulterior) îl folosește implicit.' },
      { id: 'b', text: '32768–60999', correct: false, why: 'Acesta este intervalul implicit al kernelului Linux — o alegere a sistemului de operare, nu recomandarea IANA. La examen se așteaptă de obicei valoarea IANA.' },
      { id: 'c', text: '1024–5000', correct: false, why: 'Interval folosit de Windows XP și mai vechi. Depășit.' },
      { id: 'd', text: '0–1023', correct: false, why: 'Acestea sunt porturile well-known, folosite de servere, nu porturi temporare de client.' },
    ],
    explanation: 'Intervalul exact depinde de sistemul de operare, dar răspunsul „standard” este cel IANA: 49152–65535. Esențial: clientul folosește un port sursă mare și temporar; serverul ascultă pe un port mic și fix.',
  },
  {
    id: '1.5-008', topicId: T, sub: T, tags: ['ports'], type: 'single', difficulty: 2,
    stem: 'Un utilizator deschide două tab-uri spre același site (203.0.113.10, HTTPS). Cum deosebește serverul cele două conexiuni [[tcp|TCP]]?',
    options: [
      { id: 'a', text: 'Prin portul sursă al clientului, care este diferit pentru fiecare conexiune', correct: true, why: 'IP sursă, IP destinație, protocol și port destinație (443) sunt identice. Doar portul sursă efemer diferă (de ex. 51000 și 51001), deci [[five-tuple|5-tuple]]-ul e diferit.' },
      { id: 'b', text: 'Prin adresa MAC a clientului', correct: false, why: 'MAC-ul clientului nici nu ajunge la server dacă sunt routere pe drum (se rescrie la fiecare hop). Și ar fi oricum aceeași pentru ambele tab-uri.' },
      { id: 'c', text: 'Prin portul destinație, care diferă pentru fiecare tab', correct: false, why: 'Portul destinație este portul serviciului (443) — același pentru ambele tab-uri.' },
      { id: 'd', text: 'Nu le poate deosebi; browserul folosește o singură conexiune pentru toate tab-urile', correct: false, why: 'Browserele deschid de regulă conexiuni separate (pot reutiliza unele, dar nu sunt obligate). Serverul le deosebește fără probleme prin portul sursă.' },
    ],
    explanation: 'O conexiune TCP este identificată de 5-tuple: protocol, IP sursă, port sursă, IP destinație, port destinație. Asta face posibilă [[multiplexing|multiplexarea]].',
  },
  {
    id: '1.5-009', topicId: T, sub: T, tags: ['ports'], type: 'single', difficulty: 1,
    stem: 'Ce este un [[socket|socket]]?',
    options: [
      { id: 'a', text: 'Combinația dintre adresa IP, protocolul de transport și portul unui capăt de comunicație', correct: true, why: 'De exemplu 192.168.1.10:51000/TCP. Două socket-uri (client + server) definesc o conexiune.' },
      { id: 'b', text: 'Portul fizic RJ-45 al plăcii de rețea', correct: false, why: 'Termenul se folosește colocvial pentru „mufă”, dar în rețelistică socket-ul este o noțiune logică de nivel 4, nu un conector.' },
      { id: 'c', text: 'Adresa MAC plus adresa IP', correct: false, why: 'Combinația MAC–IP este ce rezolvă ARP (1.10). Socket-ul nu conține MAC-ul, ci portul.' },
      { id: 'd', text: 'Un alt nume pentru segmentul TCP', correct: false, why: 'Segmentul este PDU-ul (datele în tranzit); socket-ul este capătul de comunicație care le trimite/primește.' },
    ],
    explanation: 'Socket = IP + protocol + port. `netstat -an` listează socket-urile locale și pe cele de la distanță pentru fiecare conexiune.',
  },
  {
    id: '1.5-010', topicId: T, sub: T, tags: ['ports', 'udp'], type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ funcții le oferă [[udp|UDP]]?',
    options: [
      { id: 'a', text: 'Multiplexarea aplicațiilor prin numere de port', correct: true, why: 'Header-ul UDP are Source Port și Destination Port — exact ca TCP. Este singura funcție de transport comună ambelor.' },
      { id: 'b', text: 'Detectarea erorilor prin checksum', correct: true, why: 'UDP are un câmp Checksum (opțional în IPv4, obligatoriu în IPv6). Detectează coruperea, dar nu recuperează datele.' },
      { id: 'c', text: 'Retransmiterea datagramelor pierdute', correct: false, why: 'UDP nu are confirmări, deci nici retransmisii. Dacă e nevoie, le face aplicația (de ex. TFTP).' },
      { id: 'd', text: 'Livrarea în ordine pe baza numerelor de secvență', correct: false, why: 'UDP nu are câmp de secvență. Datagramele pot ajunge în altă ordine.' },
      { id: 'e', text: 'Flow control prin windowing', correct: false, why: 'Windowing-ul este o funcție TCP (câmpul Window). UDP nu limitează emițătorul în niciun fel.' },
    ],
    explanation: 'UDP = porturi + checksum (+ lungime). Tot restul (conexiune, ACK, secvență, retransmisie, window) aparține TCP.',
  },
  {
    id: '1.5-011', topicId: T, sub: T, tags: ['ports'], type: 'single', difficulty: 2,
    stem: 'PC-ul 192.168.1.10 trimite o cerere HTTP de pe portul 51515 către serverul 10.0.0.80:80. Ce porturi are **răspunsul** serverului?',
    options: [
      { id: 'a', text: 'Port sursă 80, port destinație 51515', correct: true, why: 'Răspunsul inversează socket-urile: pleacă de la serviciu (80) și se întoarce la portul efemer al clientului (51515).' },
      { id: 'b', text: 'Port sursă 51515, port destinație 80', correct: false, why: 'Acestea sunt porturile cererii, de la client spre server.' },
      { id: 'c', text: 'Port sursă 80, port destinație 80', correct: false, why: 'Clientul nu ascultă pe portul 80; răspunsul trebuie să ajungă la socket-ul care a deschis conexiunea (51515).' },
      { id: 'd', text: 'Port sursă un nou port efemer al serverului, port destinație 51515', correct: false, why: 'Serverul răspunde din același socket pe care a primit conexiunea (10.0.0.80:80); altfel 5-tuple-ul nu s-ar potrivi și clientul ar respinge segmentul.' },
    ],
    explanation: 'În răspuns se inversează IP-urile ȘI porturile. Asta contează mult la ACL-uri (5.6): traficul de întoarcere are portul well-known ca SURSĂ.',
  },

  // ======================= TCP: header, handshake, închidere =======================
  {
    id: '1.5-012', topicId: T, sub: T, tags: ['tcp-conn'], type: 'order', difficulty: 1,
    stem: 'Ordonează segmentele [[three-way-handshake|3-way handshake]]-ului TCP.',
    items: [
      { text: 'Client → Server: SYN', why: 'Clientul cere conexiunea și își trimite ISN-ul.' },
      { text: 'Server → Client: SYN + ACK', why: 'Serverul confirmă SYN-ul clientului și își trimite propriul ISN.' },
      { text: 'Client → Server: ACK', why: 'Clientul confirmă SYN-ul serverului; conexiunea e ESTABLISHED.' },
    ],
    explanation: 'SYN → SYN-ACK → ACK. Abia după aceste trei segmente pot curge datele (deși al treilea segment poate deja purta date).',
  },
  {
    id: '1.5-013', topicId: T, sub: T, tags: ['tcp-conn'], type: 'single', difficulty: 2,
    stem: 'Un client trimite SYN cu **seq=100**. Ce valoare are câmpul Acknowledgment Number în SYN-ACK-ul serverului?',
    options: [
      { id: 'a', text: '101', correct: true, why: 'SYN consumă un număr de secvență, deși nu poartă date. Serverul confirmă „aștept octetul 101”.' },
      { id: 'b', text: '100', correct: false, why: 'Ack-ul nu repetă numărul primit, ci indică următorul număr așteptat.' },
      { id: 'c', text: '0', correct: false, why: '0 ar însemna că serverul nu confirmă nimic. În SYN-ACK flag-ul ACK e setat, deci câmpul e valid și trebuie să fie 101.' },
      { id: 'd', text: 'Un număr aleatoriu ales de server', correct: false, why: 'Aleatoriu este ISN-ul serverului (câmpul Sequence Number al SYN-ACK-ului), nu ack-ul.' },
    ],
    explanation: 'Regula: ack = seq + lungimea datelor; SYN și FIN contează fiecare ca 1. Deci SYN seq=100 → ack=101; apoi clientul trimite primul octet de date cu seq=101.',
  },
  {
    id: '1.5-014', topicId: T, sub: T, tags: ['tcp-conn'], type: 'single', difficulty: 1,
    stem: 'Ce flag TCP folosește o aplicație pentru a închide **grațios** conexiunea, după ce a terminat de trimis datele?',
    options: [
      { id: 'a', text: '[[fin|FIN]]', correct: true, why: 'FIN = „nu mai am date de trimis”. Cealaltă parte confirmă și, când termină și ea, își trimite propriul FIN.' },
      { id: 'b', text: '[[rst|RST]]', correct: false, why: 'RST închide BRUSC (abortiv) conexiunea, fără să mai livreze datele rămase — nu e o închidere grațioasă.' },
      { id: 'c', text: 'PSH', correct: false, why: 'PSH cere receptorului să predea imediat datele aplicației; nu are legătură cu închiderea.' },
      { id: 'd', text: '[[syn|SYN]]', correct: false, why: 'SYN deschide conexiunea (sincronizează numerele de secvență).' },
    ],
    explanation: 'Deschidere: SYN. Închidere normală: FIN (FIN → ACK → FIN → ACK). Închidere bruscă sau refuz: RST.',
  },
  {
    id: '1.5-015', topicId: T, sub: T, tags: ['tcp-conn'], type: 'single', difficulty: 1,
    stem: 'Care este dimensiunea **minimă** a header-ului [[tcp|TCP]]?',
    options: [
      { id: 'a', text: '20 de octeți', correct: true, why: 'Fără opțiuni, header-ul TCP are 5 cuvinte de 32 de biți = 20 B. Cu opțiuni poate ajunge la 60 B.' },
      { id: 'b', text: '8 octeți', correct: false, why: '8 B este dimensiunea (fixă) a header-ului UDP.' },
      { id: 'c', text: '60 de octeți', correct: false, why: '60 B este MAXIMUL (Data Offset = 15 × 4 B), atins doar cu 40 B de opțiuni.' },
      { id: 'd', text: '40 de octeți', correct: false, why: '40 B este dimensiunea maximă a opțiunilor sau suma IP (20) + TCP (20) — nu header-ul TCP minim.' },
    ],
    explanation: 'TCP: 20–60 B (câmpul Data Offset spune exact cât). UDP: întotdeauna 8 B. Diferența explică parțial de ce UDP e mai „ușor”.',
  },
  {
    id: '1.5-016', topicId: T, sub: T, tags: ['tcp-conn', 'reliability'], type: 'single', difficulty: 2,
    stem: 'Ce câmp din header-ul TCP folosește receptorul ca să-i spună emițătorului câte date mai poate primi ([[flow-control|flow control]])?',
    options: [
      { id: 'a', text: 'Window', correct: true, why: 'Câmpul Window (16 biți) anunță receive window — câți octeți mai încap în buffer-ul receptorului.' },
      { id: 'b', text: 'Sequence Number', correct: false, why: 'Sequence Number numerotează octeții trimiși; nu spune nimic despre spațiul liber al receptorului.' },
      { id: 'c', text: 'Urgent Pointer', correct: false, why: 'Indică date urgente (cu flag-ul URG); practic nefolosit.' },
      { id: 'd', text: 'Data Offset', correct: false, why: 'Data Offset dă lungimea header-ului (în cuvinte de 32 de biți).' },
    ],
    explanation: '[[windowing|Windowing]] = flow control: emițătorul nu are voie să aibă neconfirmați mai mulți octeți decât valoarea Window anunțată.',
  },
  {
    id: '1.5-017', topicId: T, sub: T, tags: ['tcp-conn'], type: 'single', difficulty: 2,
    stem: 'Un PC trimite un SYN către portul TCP 8080 al unui server pe care nu rulează nicio aplicație pe acel port (și nu există firewall). Ce răspunde serverul?',
    options: [
      { id: 'a', text: 'Un segment cu flag-ul [[rst|RST]] (conexiune refuzată)', correct: true, why: 'Stiva TCP a serverului nu are niciun socket în LISTEN pe 8080, așa că resetează încercarea. Clientul afișează „connection refused”.' },
      { id: 'b', text: 'SYN-ACK, apoi închide conexiunea după 2 minute', correct: false, why: 'SYN-ACK se trimite doar dacă o aplicație ascultă pe acel port.' },
      { id: 'c', text: 'Nimic — TCP ignoră pachetul în tăcere', correct: false, why: 'Tăcerea (timeout) e comportamentul tipic al unui FIREWALL care aruncă pachetul. Stiva TCP însăși răspunde cu RST.' },
      { id: 'd', text: 'O datagramă UDP de eroare', correct: false, why: 'TCP nu răspunde prin UDP. (Pentru un port UDP închis, hostul trimite de obicei ICMP Port Unreachable.)' },
    ],
    explanation: 'Port TCP deschis → SYN-ACK; închis → RST; filtrat de firewall → niciun răspuns (sau ICMP). Așa funcționează și scanerele de porturi.',
  },
  {
    id: '1.5-018', topicId: T, sub: T, tags: ['tcp-conn'], type: 'single', difficulty: 3,
    stem: 'Care parte a unei conexiuni TCP intră în starea [[time-wait|TIME-WAIT]]?',
    options: [
      { id: 'a', text: 'Partea care a trimis primul FIN (închiderea activă)', correct: true, why: 'După ce confirmă FIN-ul celeilalte părți, cel care a inițiat închiderea așteaptă 2 × MSL, ca ACK-ul final să poată fi retransmis dacă se pierde și ca segmentele întârziate să dispară.' },
      { id: 'b', text: 'Întotdeauna serverul', correct: false, why: 'Nu contează rolul (client/server), ci cine închide primul. Pe servere web care închid ele conexiunile apar multe TIME-WAIT, dar regula e „cine închide primul”.' },
      { id: 'c', text: 'Partea care a primit primul FIN', correct: false, why: 'Aceasta trece prin CLOSE-WAIT și LAST-ACK, apoi direct în CLOSED.' },
      { id: 'd', text: 'Ambele părți, simultan', correct: false, why: 'Doar într-o închidere simultană (rară) ar trece ambele prin TIME-WAIT. În cazul normal, una singură.' },
    ],
    explanation: 'Stări la închidere: activ = FIN-WAIT-1 → FIN-WAIT-2 → TIME-WAIT → CLOSED; pasiv = CLOSE-WAIT → LAST-ACK → CLOSED.',
  },
  {
    id: '1.5-019', topicId: T, sub: T, tags: ['tcp-conn'], type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare flag TCP cu rolul lui.',
    leftLabel: 'Rol', rightLabel: 'Flag',
    pairs: [
      { left: 'Deschide conexiunea și sincronizează numerele de secvență', right: 'SYN', why: 'Prezent în primele două segmente ale handshake-ului.' },
      { left: 'Câmpul Acknowledgment Number este valid', right: 'ACK', why: 'Setat în toate segmentele de după primul SYN.' },
      { left: 'Emițătorul nu mai are date de trimis (închidere grațioasă)', right: 'FIN', why: 'Închide o direcție a conexiunii.' },
      { left: 'Închide imediat / refuză conexiunea', right: 'RST', why: 'Abortiv, fără TIME-WAIT.' },
      { left: 'Predă imediat datele aplicației, fără buffering', right: 'PSH', why: 'Folosit de obicei la ultimul segment al unui mesaj.' },
    ],
    distractors: [{ text: 'TTL', why: 'TTL (Time To Live) este un câmp din header-ul IP (L3), nu un flag TCP. Scade cu 1 la fiecare router.' }],
    explanation: 'Flag-urile TCP (8 biți): CWR, ECE, URG, ACK, PSH, RST, SYN, FIN. Pentru CCNA contează în special SYN, ACK, FIN și RST.',
  },
  {
    id: '1.5-043', topicId: T, sub: T, tags: ['tcp-conn'], type: 'order', difficulty: 2,
    stem: 'Ordonează segmentele unei închideri TCP normale, inițiată de client.',
    items: [
      { text: 'Client → Server: FIN', why: 'Clientul a terminat de trimis (FIN-WAIT-1).' },
      { text: 'Server → Client: ACK', why: 'Serverul confirmă FIN-ul (CLOSE-WAIT); clientul trece în FIN-WAIT-2.' },
      { text: 'Server → Client: FIN', why: 'Și serverul a terminat (LAST-ACK).' },
      { text: 'Client → Server: ACK', why: 'Clientul confirmă și intră în TIME-WAIT; serverul trece în CLOSED.' },
    ],
    explanation: 'Închiderea „în 4 pași” vine din faptul că fiecare direcție se închide separat. Pașii 2 și 3 se pot combina într-un singur FIN+ACK (închidere în 3 segmente).',
  },

  // ======================= fiabilitate: seq/ack, retransmisie, window, congestion =======================
  {
    id: '1.5-020', topicId: T, sub: T, tags: ['reliability'], type: 'single', difficulty: 2,
    stem: 'Un emițător trimite un segment cu **seq=1001** care conține **500 de octeți** de date. Ce ack trimite receptorul dacă l-a primit corect?',
    options: [
      { id: 'a', text: '1501', correct: true, why: 'Octeții au numerele 1001–1500; următorul așteptat este 1501 (= 1001 + 500).' },
      { id: 'b', text: '1500', correct: false, why: '1500 este ultimul octet primit. Ack-ul TCP indică URMĂTORUL octet așteptat, nu ultimul primit.' },
      { id: 'c', text: '1002', correct: false, why: '+1 se aplică doar pentru SYN/FIN (care nu au date). Aici trebuie adunată lungimea datelor.' },
      { id: 'd', text: '501', correct: false, why: 'Ack-ul nu e lungimea datelor, ci o poziție în fluxul de octeți (seq + len).' },
    ],
    explanation: 'Formula de reținut: **ack = seq + len**. Exemplu complet în diagrama interactivă din secțiunea despre fiabilitate.',
  },
  {
    id: '1.5-021', topicId: T, sub: T, tags: ['reliability'], type: 'single', difficulty: 1,
    stem: 'Ce semnifică valoarea din câmpul [[ack-number|Acknowledgment Number]] al unui segment TCP?',
    options: [
      { id: 'a', text: 'Numărul următorului octet pe care receptorul se așteaptă să-l primească', correct: true, why: 'Este o confirmare cumulativă: tot ce e înainte de această valoare a ajuns.' },
      { id: 'b', text: 'Numărul de segmente primite până acum', correct: false, why: 'TCP numără octeți, nu segmente.' },
      { id: 'c', text: 'Numărul ultimului octet primit', correct: false, why: 'Capcană clasică: ultimul octet primit este ack − 1.' },
      { id: 'd', text: 'Numărul de octeți pe care receptorul îi mai poate primi', correct: false, why: 'Aceasta este semnificația câmpului Window.' },
    ],
    explanation: 'ACK = „următorul octet așteptat”. Datorită caracterului cumulativ, un singur ACK poate confirma mai multe segmente.',
  },
  {
    id: '1.5-022', topicId: T, sub: T, tags: ['reliability'], type: 'single', difficulty: 2,
    stem: 'Un emițător TCP primește **trei ACK-uri duplicate** cu aceeași valoare. Ce face?',
    options: [
      { id: 'a', text: 'Retransmite imediat segmentul care începe la acea valoare ([[fast-retransmit|fast retransmit]])', correct: true, why: 'Trei duplicate ACK-uri arată că un segment anume lipsește, dar cele de după au ajuns. Retransmisia se face fără să aștepte RTO-ul.' },
      { id: 'b', text: 'Închide conexiunea cu RST', correct: false, why: 'O pierdere izolată este normală în rețele; TCP o recuperează, nu abandonează conexiunea.' },
      { id: 'c', text: 'Retransmite toate segmentele trimise de la începutul conexiunii', correct: false, why: 'ACK-ul cumulativ arată exact ce a ajuns; se retransmite doar ce lipsește.' },
      { id: 'd', text: 'Nimic — așteaptă ca receptorul să ceară explicit retransmisia', correct: false, why: 'Duplicate ACK-urile SUNT „cererea” receptorului. TCP nu are un mesaj separat de tip NACK.' },
    ],
    explanation: 'Două mecanisme de retransmisie: expirarea [[rto|RTO]] (pierderi grave, cwnd revine la minim) și fast retransmit la 3 dup ACK-uri (pierdere izolată, cwnd se înjumătățește).',
  },
  {
    id: '1.5-023', topicId: T, sub: T, tags: ['reliability'], type: 'single', difficulty: 2,
    stem: 'Receptorul anunță **Window = 0**. Ce face emițătorul?',
    options: [
      { id: 'a', text: 'Oprește trimiterea de date și verifică periodic (window probe) până când fereastra se redeschide', correct: true, why: 'Buffer-ul receptorului e plin. Emițătorul așteaptă un segment cu Window > 0; între timp trimite rar mici „sonde” ca să nu rămână blocat dacă actualizarea se pierde.' },
      { id: 'b', text: 'Închide conexiunea', correct: false, why: 'Window = 0 e o stare temporară normală (aplicația receptoare e lentă), nu o eroare.' },
      { id: 'c', text: 'Trimite mai repede ca să golească buffer-ul', correct: false, why: 'Exact pe dos: mai multe date ar fi aruncate. Flow control-ul există ca să protejeze receptorul.' },
      { id: 'd', text: 'Trece pe UDP', correct: false, why: 'O conexiune TCP nu își poate schimba protocolul de transport.' },
    ],
    explanation: 'Window = flow control: receptorul dictează ritmul. Window mare → multe date în zbor (eficient); Window mic → emițătorul încetinește; 0 → stop.',
  },
  {
    id: '1.5-024', topicId: T, sub: T, tags: ['reliability'], type: 'single', difficulty: 3,
    stem: 'Care este diferența dintre [[flow-control|flow control]] și [[congestion-control|congestion control]] în TCP?',
    options: [
      { id: 'a', text: 'Flow control protejează receptorul (prin câmpul Window); congestion control protejează rețeaua (prin cwnd, ținut intern de emițător)', correct: true, why: 'Emițătorul poate avea în zbor cel mult minimul dintre fereastra anunțată de receptor (rwnd) și fereastra de congestie (cwnd).' },
      { id: 'b', text: 'Sunt două nume pentru același mecanism', correct: false, why: 'Au scopuri diferite: un receptor rapid pe o rețea congestionată are nevoie de congestion control, iar un receptor lent pe o rețea liberă, de flow control.' },
      { id: 'c', text: 'Flow control este făcut de routere, congestion control de host-uri', correct: false, why: 'Ambele sunt făcute de host-urile TCP. Routerele doar aruncă pachete când cozile se umplu (și eventual marchează ECN).' },
      { id: 'd', text: 'Congestion control se negociază în 3-way handshake, flow control nu', correct: false, why: 'cwnd nu se negociază și nici nu apare în header; e o estimare internă a emițătorului. Window (rwnd) apare în fiecare segment.' },
    ],
    explanation: 'Fereastra efectivă = min(rwnd, cwnd). rwnd vine de la receptor, în header; cwnd crește prin slow start și congestion avoidance și scade la pierderi.',
  },
  {
    id: '1.5-025', topicId: T, sub: T, tags: ['reliability'], type: 'single', difficulty: 2,
    stem: 'Pe o rețea Ethernet cu [[mtu|MTU]] 1500, ce valoare tipică de [[mss|MSS]] anunță un host IPv4 în SYN?',
    options: [
      { id: 'a', text: '1460 de octeți', correct: true, why: '1500 (MTU) − 20 (header IPv4) − 20 (header TCP) = 1460 de octeți de date.' },
      { id: 'b', text: '1500 de octeți', correct: false, why: '1500 este MTU-ul — tot pachetul IP, cu header-e. MSS-ul numără doar datele TCP.' },
      { id: 'c', text: '1518 octeți', correct: false, why: '1518 B este dimensiunea maximă a cadrului Ethernet (cu header-ul L2 și FCS), fără tag 802.1Q.' },
      { id: 'd', text: '536 de octeți', correct: false, why: '536 este valoarea IMPLICITĂ folosită când partenerul nu anunță niciun MSS (576 − 40). Pe Ethernet se anunță 1460.' },
    ],
    explanation: 'MTU = cel mai mare pachet L3; MSS = cele mai multe date dintr-un segment L4. Pe tuneluri cu overhead (PPPoE, GRE, IPsec) MSS trebuie micșorat (de ex. `ip tcp adjust-mss`).',
  },
  {
    id: '1.5-026', topicId: T, sub: T, tags: ['reliability'], type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre [[windowing|windowing]]-ul TCP sunt corecte?',
    options: [
      { id: 'a', text: 'Permite trimiterea mai multor segmente înainte de a primi o confirmare', correct: true, why: 'Fără fereastră, emițătorul ar aștepta un ACK după fiecare segment (un RTT per segment) — foarte lent pe distanțe mari.' },
      { id: 'b', text: 'Fereastra se poate mări când nu apar pierderi și micșora când apar pierderi sau receptorul e încărcat', correct: true, why: 'Este o fereastră dinamică (sliding window): se adaptează la receptor și la rețea.' },
      { id: 'c', text: 'Mărimea ferestrei se stabilește o singură dată, în handshake, și rămâne fixă', correct: false, why: 'Fiecare segment poartă o valoare Window actualizată. Doar factorul Window Scale se negociază o singură dată, în SYN.' },
      { id: 'd', text: 'Fereastra se măsoară în număr de segmente', correct: false, why: 'Câmpul Window e exprimat în OCTEȚI. (În diagramele didactice se desenează adesea în segmente pentru simplitate.)' },
      { id: 'e', text: 'Windowing-ul criptează datele în tranzit', correct: false, why: 'TCP nu criptează nimic. Confidențialitatea vine de la TLS, SSH, IPsec.' },
    ],
    explanation: 'Sliding window = eficiență (date în zbor) + flow control (receptorul impune limita). Fereastra „glisează” pe măsură ce sosesc ACK-uri.',
  },
  {
    id: '1.5-027', topicId: T, sub: T, tags: ['reliability'], type: 'single', difficulty: 3,
    stem: 'În faza de [[slow-start|slow start]], cum evoluează fereastra de congestie (cwnd) a unui emițător TCP?',
    options: [
      { id: 'a', text: 'Crește aproximativ exponențial — se dublează la fiecare RTT — până la pragul ssthresh sau până la o pierdere', correct: true, why: 'Fiecare ACK primit adaugă un MSS la cwnd, deci la fiecare tur complet (RTT) fereastra se dublează. Numele „slow” se referă la faptul că pornește de la o valoare mică.' },
      { id: 'b', text: 'Crește liniar, cu un MSS la fiecare RTT', correct: false, why: 'Aceasta este faza de congestion avoidance, de după ssthresh.' },
      { id: 'c', text: 'Rămâne constantă la valoarea anunțată de receptor', correct: false, why: 'Valoarea anunțată de receptor este rwnd (flow control); cwnd evoluează independent.' },
      { id: 'd', text: 'Scade la jumătate la fiecare RTT', correct: false, why: 'Înjumătățirea are loc doar ca reacție la o pierdere (de ex. 3 duplicate ACK-uri).' },
    ],
    explanation: 'Ciclul clasic (TCP Reno): slow start (×2/RTT) → congestion avoidance (+1 MSS/RTT) → pierdere: 3 dup ACK → cwnd ÷ 2; timeout → cwnd = minim și slow start din nou.',
  },
  {
    id: '1.5-028', topicId: T, sub: T, tags: ['reliability'], type: 'single', difficulty: 3,
    stem: 'Un client trimite segmente de 1000 B cu seq=2461, 3461, 4461 și 5461. Serverul răspunde cu ack=3461, apoi încă trei ACK-uri cu **ack=3461**. Ce segment retransmite clientul?',
    options: [
      { id: 'a', text: 'Segmentul cu seq=3461', correct: true, why: 'Serverul a primit 2461 (de aceea ack=3461), dar nu și 3461. Segmentele 4461 și 5461 au ajuns (fiecare a generat un duplicate ACK). Lipsește exact segmentul care începe la 3461.' },
      { id: 'b', text: 'Segmentul cu seq=2461', correct: false, why: 'Acesta a fost confirmat: un ack=3461 înseamnă că tot ce e înainte de 3461 (deci și 2461–3460) a ajuns.' },
      { id: 'c', text: 'Toate cele patru segmente', correct: false, why: 'TCP retransmite doar ce lipsește. Segmentele de după gaură sunt păstrate în buffer-ul receptorului.' },
      { id: 'd', text: 'Segmentul cu seq=5461', correct: false, why: 'Duplicate ACK-urile indică un octet lipsă (3461), nu ultimul segment trimis.' },
    ],
    explanation: 'Citește un ack ca „aștept octetul X”. Dacă același X se repetă, segmentul care începe la X s-a pierdut. După retransmisie, serverul confirmă cumulativ: ack=6461.',
  },

  // ======================= UDP =======================
  {
    id: '1.5-029', topicId: T, sub: T, tags: ['udp'], type: 'single', difficulty: 1,
    stem: 'Câți octeți are header-ul [[udp|UDP]]?',
    options: [
      { id: 'a', text: '8', correct: true, why: 'Patru câmpuri de câte 16 biți: Source Port, Destination Port, Length, Checksum = 8 B, întotdeauna.' },
      { id: 'b', text: '20', correct: false, why: '20 B este minimul header-ului TCP (și header-ul IPv4 fără opțiuni).' },
      { id: 'c', text: '4', correct: false, why: '4 B ar ajunge doar pentru cele două porturi. UDP mai are Length și Checksum.' },
      { id: 'd', text: 'Variabil, între 8 și 60', correct: false, why: 'Header-ul UDP este fix; doar TCP are opțiuni și lungime variabilă (20–60 B).' },
    ],
    explanation: 'Overhead mic: 8 B (UDP) față de 20+ B (TCP). Pentru pachete mici de voce (de exemplu 20–160 B de date) diferența contează.',
  },
  {
    id: '1.5-030', topicId: T, sub: T, tags: ['udp'], type: 'single', difficulty: 2,
    stem: 'De ce transportă [[voip|VoIP]] vocea (prin [[rtp|RTP]]) peste UDP și nu peste TCP?',
    options: [
      { id: 'a', text: 'Un pachet de voce retransmis ar ajunge prea târziu ca să mai fie util; e preferabilă o mică pierdere decât întârzierea', correct: true, why: 'Vocea e în timp real: un fragment de 20 ms sosit după jumătate de secundă nu mai poate fi redat. Retransmisia TCP ar produce întârziere și jitter, iar flow/congestion control-ul ar frâna fluxul.' },
      { id: 'b', text: 'Pentru că UDP criptează vocea', correct: false, why: 'UDP nu criptează. Pentru voce criptată se folosește SRTP.' },
      { id: 'c', text: 'Pentru că UDP garantează livrarea fiecărui pachet', correct: false, why: 'Opusul: UDP nu garantează nimic (best effort).' },
      { id: 'd', text: 'Pentru că TCP nu poate transporta date binare', correct: false, why: 'TCP transportă orice flux de octeți, inclusiv binar (fișiere, video la cerere).' },
    ],
    explanation: 'Aplicațiile în timp real preferă **timeliness** în locul **reliability**. Video-ul la cerere (YouTube, Netflix) folosește totuși TCP sau QUIC, pentru că are buffer.',
  },
  {
    id: '1.5-031', topicId: T, sub: T, tags: ['udp', 'compare'], type: 'single', difficulty: 2,
    stem: 'Un administrator salvează configurația routerului cu `copy running-config tftp:`. Ce protocol de transport și ce port destinație folosește cererea?',
    options: [
      { id: 'a', text: 'UDP 69', correct: true, why: '[[tftp|TFTP]] rulează peste UDP, portul 69. Fiabilitatea e asigurată de TFTP însuși (fiecare bloc de 512 B trebuie confirmat).' },
      { id: 'b', text: 'TCP 69', correct: false, why: 'Portul e corect, dar TFTP nu folosește TCP.' },
      { id: 'c', text: 'TCP 21', correct: false, why: 'TCP 21 este canalul de control [[ftp|FTP]] (`copy running-config ftp:`), alt protocol, cu utilizator și parolă.' },
      { id: 'd', text: 'UDP 20', correct: false, why: '20 este portul de date FTP (activ), pe TCP.' },
    ],
    explanation: 'Perechea clasică de capcană: **TFTP = UDP 69** (simplu, fără autentificare) vs **FTP = TCP 20/21** (cu autentificare). Detaliat în 4.9.',
  },
  {
    id: '1.5-032', topicId: T, sub: T, tags: ['udp'], type: 'single', difficulty: 2,
    stem: 'De ce folosește [[dhcp|DHCP]] UDP (porturile 67/68) și nu TCP?',
    options: [
      { id: 'a', text: 'Clientul nu are încă adresă IP și trebuie să trimită broadcast; TCP are nevoie de o conexiune unu-la-unu cu un destinatar cunoscut', correct: true, why: 'DHCP Discover pleacă de la 0.0.0.0 spre 255.255.255.255. TCP nu poate face handshake cu „toată lumea”; UDP poate trimite broadcast și multicast.' },
      { id: 'b', text: 'Pentru că DHCP are nevoie de criptare', correct: false, why: 'Nici UDP, nici DHCP nu criptează.' },
      { id: 'c', text: 'Pentru că UDP are un header mai mare, potrivit pentru opțiunile DHCP', correct: false, why: 'Header-ul UDP este mai MIC (8 B). Opțiunile DHCP sunt în datele aplicației.' },
      { id: 'd', text: 'Pentru că serverele DHCP nu suportă TCP', correct: false, why: 'Nu e o limită a serverelor, ci a modelului de comunicație: broadcast-ul exclude TCP.' },
    ],
    explanation: 'TCP = unicast, unu-la-unu. Orice protocol care trimite broadcast sau multicast (DHCP, multe protocoale de descoperire, streaming multicast) folosește UDP.',
  },
  {
    id: '1.5-033', topicId: T, sub: T, tags: ['udp', 'compare'], type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ câmpuri există în header-ul TCP, dar NU în header-ul UDP?',
    options: [
      { id: 'a', text: 'Sequence Number', correct: true, why: 'Numerotarea octeților servește ordonării și retransmisiei — funcții pe care UDP nu le are.' },
      { id: 'b', text: 'Window', correct: true, why: 'Window este baza flow control-ului TCP. UDP nu are flow control.' },
      { id: 'c', text: 'Source Port', correct: false, why: 'Ambele protocoale au Source Port și Destination Port (multiplexare).' },
      { id: 'd', text: 'Checksum', correct: false, why: 'Ambele au Checksum. La UDP e opțional în IPv4, dar câmpul există.' },
      { id: 'e', text: 'Destination Port', correct: false, why: 'Prezent în ambele header-e, pe aceeași poziție (biții 16–31 ai primului rând).' },
    ],
    explanation: 'UDP: Source Port, Destination Port, Length, Checksum. TCP adaugă Sequence, Acknowledgment, Data Offset, Flags, Window, Urgent Pointer, Options.',
  },
  {
    id: '1.5-034', topicId: T, sub: T, tags: ['udp'], type: 'single', difficulty: 3,
    stem: 'Care afirmație despre [[checksum|checksum]]-ul UDP este corectă?',
    options: [
      { id: 'a', text: 'Detectează coruperea datagramei, dar UDP nu o recuperează: datagrama coruptă este aruncată', correct: true, why: 'Detecție da, corecție/retransmisie nu. Dacă aplicația are nevoie de date complete, trebuie să ceară din nou (de exemplu clientul DNS repetă interogarea după un timeout).' },
      { id: 'b', text: 'UDP nu are niciun mecanism de verificare a erorilor', correct: false, why: 'Afirmație frecventă, dar falsă: header-ul UDP are un câmp Checksum de 16 biți.' },
      { id: 'c', text: 'Checksum-ul UDP este obligatoriu atât în IPv4, cât și în IPv6', correct: false, why: 'În IPv4 este opțional (valoarea 0 = necalculat); în IPv6 devine obligatoriu.' },
      { id: 'd', text: 'Checksum-ul UDP declanșează retransmiterea automată a datagramei', correct: false, why: 'UDP nu are confirmări și nici retransmisii.' },
    ],
    explanation: 'UDP oferă **error detection**, nu **error recovery**. TCP le oferă pe amândouă: checksum + ACK/retransmisie.',
  },

  // ======================= comparație & porturi =======================
  {
    id: '1.5-035', topicId: T, sub: T, tags: ['compare'], type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare protocol cu transportul și portul lui (serverul).',
    leftLabel: 'Protocol', rightLabel: 'Transport / port',
    pairs: [
      { left: 'HTTPS', right: 'TCP 443', why: 'HTTP peste TLS. (HTTP/3 folosește și UDP 443, dar răspunsul CCNA este TCP 443.)' },
      { left: 'SSH', right: 'TCP 22', why: 'Acces CLI criptat; pe același port rulează și SCP/SFTP.' },
      { left: 'TFTP', right: 'UDP 69', why: 'Transfer simplu de fișiere, fără autentificare.' },
      { left: 'SNMP (interogări către agent)', right: 'UDP 161', why: 'Trap-urile ajung la manager pe UDP 162.' },
      { left: 'Syslog', right: 'UDP 514', why: 'Mesajele de log sunt trimise fără confirmare.' },
      { left: 'NTP', right: 'UDP 123', why: 'Sincronizarea ceasului.' },
    ],
    distractors: [
      { text: 'TCP 69', why: 'Portul 69 aparține TFTP, care folosește UDP, nu TCP.' },
      { text: 'UDP 22', why: 'SSH folosește TCP 22 — are nevoie de un flux fiabil pentru sesiunea criptată.' },
    ],
    explanation: 'Învață porturile împreună cu transportul. Regula orientativă: protocoalele de management „mici” și periodice (SNMP, Syslog, NTP, TFTP, DHCP) sunt pe UDP; sesiunile interactive și transferurile complete (SSH, HTTP/S, FTP, SMTP) sunt pe TCP.',
  },
  {
    id: '1.5-036', topicId: T, sub: T, tags: ['compare'], type: 'multi', difficulty: 2,
    stem: 'Care TREI protocoale folosesc, în mod normal, [[udp|UDP]]?',
    options: [
      { id: 'a', text: '[[dhcp|DHCP]]', correct: true, why: 'UDP 67 (server) / 68 (client) — bazat pe broadcast.' },
      { id: 'b', text: '[[tftp|TFTP]]', correct: true, why: 'UDP 69.' },
      { id: 'c', text: '[[snmp|SNMP]]', correct: true, why: 'UDP 161 (agent) și 162 (traps).' },
      { id: 'd', text: '[[ssh|SSH]]', correct: false, why: 'TCP 22.' },
      { id: 'e', text: '[[smtp|SMTP]]', correct: false, why: 'TCP 25 — un e-mail trebuie livrat complet.' },
      { id: 'f', text: '[[http|HTTP]]', correct: false, why: 'TCP 80 (HTTP/1.1 și HTTP/2). Doar HTTP/3 folosește UDP, prin QUIC — peste nivelul CCNA.' },
    ],
    explanation: 'UDP: DHCP, DNS (interogări), TFTP, SNMP, Syslog, NTP, RTP (voce/video), CAPWAP, RADIUS. TCP: HTTP/S, SSH, Telnet, FTP, SMTP, POP3, IMAP, BGP, TACACS+.',
  },
  {
    id: '1.5-037', topicId: T, sub: T, tags: ['compare'], type: 'single', difficulty: 3,
    stem: '[[dns|DNS]] folosește în mod normal UDP 53. În ce situații folosește **TCP 53**?',
    options: [
      { id: 'a', text: 'La transferurile de zonă între servere și când răspunsul e prea mare pentru UDP (răspuns trunchiat)', correct: true, why: 'Un transfer de zonă (AXFR) copiază o bază de date întreagă — are nevoie de fiabilitate. Dacă un răspuns nu încape în UDP, serverul setează flag-ul TC (truncated), iar clientul repetă interogarea pe TCP.' },
      { id: 'b', text: 'Niciodată; DNS folosește doar UDP', correct: false, why: 'Capcană de examen: DNS folosește AMBELE, UDP și TCP, pe portul 53.' },
      { id: 'c', text: 'Pentru toate interogările de tip AAAA (IPv6)', correct: false, why: 'Tipul înregistrării nu determină transportul. Interogările AAAA merg normal pe UDP.' },
      { id: 'd', text: 'Doar când clientul e în altă rețea decât serverul', correct: false, why: 'Rutarea nu are legătură cu alegerea protocolului de transport.' },
    ],
    explanation: 'DNS = UDP 53 pentru interogări obișnuite (rapide, fără handshake) + TCP 53 pentru transferuri de zonă și răspunsuri mari.',
  },
  {
    id: '1.5-038', topicId: T, sub: T, tags: ['compare'], type: 'single', difficulty: 1,
    stem: 'O întrebare descrie un protocol de transport ca fiind „connectionless, best effort, fără sequencing și fără acknowledgments”. Despre care este vorba?',
    options: [
      { id: 'a', text: '[[udp|UDP]]', correct: true, why: 'Toate cele patru caracteristici descriu UDP: nu deschide conexiune, nu garantează livrarea, nu numerotează, nu confirmă.' },
      { id: 'b', text: '[[tcp|TCP]]', correct: false, why: 'TCP este exact opusul: connection-oriented, reliable, cu sequencing și acknowledgments.' },
      { id: 'c', text: 'IP', correct: false, why: 'IP este și el connectionless și best effort, dar este protocol de nivel 3 (Network), nu de transport.' },
      { id: 'd', text: '[[quic|QUIC]]', correct: false, why: 'QUIC rulează peste UDP, dar adaugă el însuși conexiune, numerotare, confirmări și retransmisii.' },
    ],
    explanation: 'Cuvinte-cheie: „windowing”, „sequencing”, „acknowledgment”, „three-way handshake”, „reliable” → TCP. „Connectionless”, „best effort”, „low overhead”, „no recovery” → UDP.',
  },
  {
    id: '1.5-039', topicId: T, sub: T, tags: ['compare', 'config'], type: 'cli', difficulty: 2,
    stem: 'Pe Windows, ce comandă afișează **toate** conexiunile TCP și porturile ascultate (inclusiv UDP), cu adrese și porturi în format **numeric**?',
    prompt: 'C:\\>', canonical: 'netstat -an',
    answers: ['netstat -an', 'netstat -na', 'netstat -a -n', 'netstat -n -a', 'netstat -ano', 'netstat -nao', 'netstat -aon'],
    hint: 'netstat + două opțiuni: „all” și „numeric”',
    wrong: [
      { text: 'netstat', why: 'Fără opțiuni arată doar conexiunile active (nu și porturile în LISTENING) și încearcă să rezolve numele — lent.' },
      { text: 'ipconfig /all', why: 'Afișează configurația IP a interfețelor (1.10), nu conexiunile TCP/UDP.' },
      { text: 'netstat -r', why: 'Afișează tabela de rutare a host-ului, nu conexiunile.' },
      { text: 'tracert', why: 'Urmărește traseul (hop-urile) până la o destinație; nu are legătură cu socket-urile locale.' },
    ],
    explanation: '`-a` = toate (inclusiv LISTENING și UDP), `-n` = numeric, `-o` = PID-ul procesului. Pe Linux echivalentul modern este `ss -tan` (TCP) / `ss -uan` (UDP).',
  },
  {
    id: '1.5-040', topicId: T, sub: T, tags: ['compare', 'config'], type: 'cli', difficulty: 3,
    stem: 'Pe Linux, cu utilitarul modern `ss`, ce comandă listează **toate socket-urile TCP** (inclusiv cele în LISTEN), **numeric**?',
    prompt: 'user@linux:~$', canonical: 'ss -tan',
    answers: ['ss -tan', 'ss -tna', 'ss -ant', 'ss -atn', 'ss -nta', 'ss -nat', 'ss -t -a -n', 'ss -tanp', 'ss -tpan'],
    hint: 't = TCP, a = all, n = numeric',
    wrong: [
      { text: 'ss -uan', why: '`-u` selectează socket-urile UDP, nu TCP.' },
      { text: 'ss -tln', why: '`-l` arată DOAR socket-urile în LISTEN, nu și conexiunile stabilite.' },
      { text: 'ip addr', why: 'Arată adresele IP ale interfețelor, nu socket-urile.' },
    ],
    explanation: '`ss` (iproute2) înlocuiește `netstat` pe Linux. Combinații utile: `ss -tan` (toate TCP), `ss -tulpn` (ce ascultă, TCP + UDP, cu procesul), `ss -tan state time-wait`.',
  },
  {
    id: '1.5-041', topicId: T, sub: T, tags: ['compare', 'config'], type: 'cli', difficulty: 3,
    stem: 'Pe un router Cisco IOS ești conectat prin Telnet. Ce comandă afișează pe scurt conexiunile TCP ale routerului (adresă locală, adresă străină, stare)?',
    prompt: 'R1#', canonical: 'show tcp brief',
    answers: ['show tcp brief', 'sh tcp brief', 'sh tcp br', 'show tcp br', 'show tcp brief all', 'sh tcp brief all'],
    hint: 'show + protocolul + o opțiune pentru format scurt',
    wrong: [
      { text: 'show ip interface brief', why: 'Arată starea și adresele IP ale interfețelor, nu conexiunile TCP.' },
      { text: 'show sessions', why: 'Arată sesiunile Telnet/SSH deschise DE PE router spre alte echipamente, nu toate conexiunile TCP ale routerului.' },
      { text: 'netstat -an', why: 'Comandă de sistem de operare (Windows/Linux), nu există în IOS.' },
    ],
    explanation: '`show tcp brief` listează TCB-urile (Transmission Control Blocks) cu socket-ul local, cel străin și starea (ESTAB, LISTEN…). `show control-plane host open-ports` arată porturile pe care ascultă routerul.',
  },

  // ======================= QUIC (extra) =======================
  {
    id: '1.5-042', topicId: T, sub: T, tags: ['quic'], type: 'single', difficulty: 2,
    stem: 'Peste ce protocol de transport rulează [[quic|QUIC]] (folosit de [[http3|HTTP/3]])?',
    options: [
      { id: 'a', text: 'UDP, de obicei pe portul 443', correct: true, why: 'QUIC folosește UDP ca „ambalaj” (trece prin NAT și firewall-uri) și implementează singur fiabilitatea, ordinea pe fluxuri, congestion control-ul și criptarea TLS 1.3.' },
      { id: 'b', text: 'TCP 443', correct: false, why: 'TCP 443 este HTTPS clasic (HTTP/1.1 și HTTP/2). QUIC a fost creat tocmai ca să evite limitările TCP (de exemplu head-of-line blocking).' },
      { id: 'c', text: 'Direct peste IP, cu un număr de protocol propriu', correct: false, why: 'Un protocol nou direct peste IP ar fi blocat de multe firewall-uri și NAT-uri. De aceea QUIC a ales UDP.' },
      { id: 'd', text: 'SCTP', correct: false, why: 'SCTP este alt protocol de transport (folosit în telecom), nu baza QUIC.' },
    ],
    explanation: 'Conținut extra peste CCNA v1.1: la examen HTTPS = TCP 443. În practică, browserele moderne folosesc și UDP 443 (QUIC), iar dacă UDP e blocat revin la TCP.',
  },
];
