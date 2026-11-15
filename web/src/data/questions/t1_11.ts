import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.11 Describe wireless principles.
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
const T = '1.11';

export const Q_1_11: Question[] = [
  // ======================= 1.11.a — canale =======================
  {
    id: '1.11-001', topicId: T, sub: '1.11.a', type: 'single', difficulty: 1,
    stem: 'Care set de canale din banda de 2.4 GHz nu se suprapune și este recomandat pentru AP-uri vecine (planul clasic folosit la CCNA)?',
    options: [
      { id: 'a', text: '1, 6, 11', correct: true, why: 'Canalele sunt la 5 MHz unul de altul, iar un canal ocupă ≈22 MHz. Între 1, 6 și 11 sunt 25 MHz, deci nu se suprapun. Este setul standard în America de Nord și cel cerut la examen.' },
      { id: 'b', text: '1, 5, 9', correct: false, why: 'Sunt la 20 MHz unul de altul. Cu canale DSSS de 22 MHz se suprapun ușor la margini. Varianta 1/5/9/13 apare doar în unele planuri europene cu OFDM pur, nu ca răspuns CCNA.' },
      { id: 'c', text: '2, 7, 12', correct: false, why: 'Distanța e tot de 25 MHz, deci teoretic nu se suprapun, dar canalul 12 nu este permis în SUA. Ar rămâne și canalul 1 nefolosit. Nu este planul standard.' },
      { id: 'd', text: '1, 3, 5', correct: false, why: 'Sunt la doar 10 MHz unul de altul — se suprapun puternic și produc interferență de la canale adiacente (ACI), cel mai rău scenariu.' },
    ],
    explanation: 'În 2.4 GHz canalele centrale sunt la 5 MHz unul de altul (ch1 = 2412 MHz, ch6 = 2437, ch11 = 2462), dar un semnal ocupă ≈20–22 MHz. Doar canalele aflate la cel puțin 5 numere distanță nu se suprapun: 1, 6, 11.',
  },
  {
    id: '1.11-002', topicId: T, sub: '1.11.a', type: 'single', difficulty: 2,
    stem: 'De ce este banda de 5 GHz preferată în birourile dense, comparativ cu 2.4 GHz?',
    options: [
      { id: 'a', text: 'Are mult mai multe canale care nu se suprapun', correct: true, why: 'În 5 GHz există ≈19–25 de canale de 20 MHz care nu se suprapun (în funcție de țară), față de doar 3 în 2.4 GHz. Mai multe AP-uri pot funcționa unul lângă altul fără interferență pe același canal (CCI).' },
      { id: 'b', text: 'Semnalul trece mai bine prin pereți', correct: false, why: 'Invers: frecvența mai mare înseamnă o lungime de undă mai mică și o atenuare mai mare prin obstacole. 2.4 GHz penetrează mai bine.' },
      { id: 'c', text: 'Are o rază de acoperire mai mare', correct: false, why: 'La aceeași putere, 5 GHz are o rază mai mică (pierderi în spațiu liber și absorbție mai mari). În rețelele dense acest lucru e chiar un avantaj: celule mai mici, mai multe AP-uri.' },
      { id: 'd', text: 'Este singura bandă compatibilă cu 802.11b', correct: false, why: '802.11b funcționează exclusiv în 2.4 GHz. 5 GHz este folosit de 802.11a/n/ac/ax/be.' },
    ],
    explanation: 'Avantajul principal al benzii de 5 GHz este numărul mare de canale care nu se suprapun. Plus: interferențe mai puține (fără microunde sau Bluetooth) și canale late (40/80/160 MHz).',
  },
  {
    id: '1.11-003', topicId: T, sub: '1.11.a', type: 'single', difficulty: 2,
    stem: 'Două AP-uri apropiate folosesc canalele 1 și 3 în 2.4 GHz. Ce tip de interferență apare?',
    options: [
      { id: 'a', text: '[[aci|ACI]] — interferență de la un canal adiacent care se suprapune', correct: true, why: 'Canalele 1 și 3 se suprapun parțial. AP-urile nu pot decoda semnalul vecinului, așa că nu „își așteaptă rândul” (CSMA/CA nu ajută). Semnalul vecinului e perceput ca zgomot: erori, retransmisii.' },
      { id: 'b', text: '[[cci|CCI]] — interferență pe același canal', correct: false, why: 'CCI apare când ambele AP-uri sunt pe exact același canal (de exemplu 1 și 1). Acolo dispozitivele se aud și împart timpul de emisie — capacitate mai mică, dar fără coruperea cadrelor.' },
      { id: 'c', text: 'Nicio interferență, deoarece canalele sunt diferite', correct: false, why: 'Diferite nu înseamnă că nu se suprapun. Canalele din 2.4 GHz sunt la 5 MHz unul de altul, dar ocupă ≈22 MHz — 1 și 3 se suprapun pe o porțiune mare.' },
      { id: 'd', text: 'Multipath', correct: false, why: 'Multipath înseamnă că același semnal ajunge la receptor pe mai multe trasee (reflexii). Nu are legătură cu alegerea canalelor.' },
    ],
    explanation: 'ACI (canale care se suprapun) este mai dăunătoare decât CCI (același canal). De aceea planul 1/6/11 este preferat unuia „creativ” de tipul 1/3/6/9/11.',
  },
  {
    id: '1.11-004', topicId: T, sub: '1.11.a', type: 'single', difficulty: 2,
    stem: 'Un AP din 5 GHz este configurat cu un canal de 80 MHz. Câte canale de 20 MHz ocupă?',
    options: [
      { id: 'a', text: '4', correct: true, why: 'Prin [[channel-bonding|channel bonding]], 80 MHz = 4 × 20 MHz adiacente (de exemplu 36+40+44+48).' },
      { id: 'b', text: '2', correct: false, why: 'Două canale de 20 MHz formează un canal de 40 MHz, introdus de 802.11n.' },
      { id: 'c', text: '8', correct: false, why: 'Opt canale de 20 MHz formează un canal de 160 MHz (802.11ac/ax).' },
      { id: 'd', text: '1, pentru că lățimea nu schimbă numărul de canale', correct: false, why: 'Lățimea contează: un canal mai lat consumă mai multe canale de bază și reduce numărul de canale independente pentru AP-urile vecine.' },
    ],
    explanation: '20 → 40 → 80 → 160 → 320 MHz: fiecare dublare unește de două ori mai multe canale de 20 MHz. Viteza crește aproximativ proporțional, dar rămân mai puține canale pentru reutilizare.',
  },
  {
    id: '1.11-005', topicId: T, sub: '1.11.a', type: 'single', difficulty: 3,
    stem: 'Un AP din 5 GHz își schimbă singur canalul de pe 100 pe 36, iar clienții se deconectează pentru scurt timp. Care este cea mai probabilă cauză?',
    options: [
      { id: 'a', text: '[[dfs|DFS]] a detectat un semnal radar pe canalul 100', correct: true, why: 'Canalele 52–144 sunt partajate cu radare (meteo, militare). Regulile DFS obligă AP-ul să elibereze imediat canalul când detectează un radar și să mute clienții.' },
      { id: 'b', text: 'Canalul 100 nu există în 5 GHz', correct: false, why: 'Canalul 100 există (5500 MHz, sub-banda U-NII-2C) și este folosit legal în UE și SUA, cu DFS.' },
      { id: 'c', text: 'Clienții 802.11b au forțat AP-ul să schimbe banda', correct: false, why: 'Clienții 802.11b funcționează doar în 2.4 GHz și nu pot influența canalul unui radio de 5 GHz.' },
      { id: 'd', text: 'SSID-ul a fost ascuns', correct: false, why: 'Ascunderea SSID-ului oprește doar includerea numelui în beacons. Nu schimbă canalul.' },
    ],
    explanation: 'DFS (Dynamic Frequency Selection) este obligatoriu pe canalele de 5 GHz partajate cu radare. Pentru clienți sensibili (voce), mulți administratori preferă canalele non-DFS (36–48, și 149–165 în SUA).',
  },
  {
    id: '1.11-006', topicId: T, sub: '1.11.a', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre planificarea canalelor în 2.4 GHz sunt corecte?',
    options: [
      { id: 'a', text: 'AP-urile vecine trebuie să folosească canale care nu se suprapun, de exemplu 1, 6 și 11', correct: true, why: 'Așa se evită ACI și se minimizează CCI. Planul se repetă în „fagure”: niciun AP nu are un vecin pe același canal.' },
      { id: 'b', text: 'Canalele de 40 MHz nu sunt recomandate în 2.4 GHz', correct: true, why: 'Un canal de 40 MHz ocupă aproape toată banda (≈83.5 MHz). Ar rămâne practic un singur canal de 40 MHz curat — imposibil de planificat pentru mai multe AP-uri.' },
      { id: 'c', text: 'Toate AP-urile ar trebui puse pe canalul 6 ca să roamingul fie mai rapid', correct: false, why: 'Roamingul nu cere același canal — clientul scanează toate canalele. Același canal peste tot creează CCI masiv: toți împart același timp de emisie.' },
      { id: 'd', text: 'Canalul 14 este disponibil în toată lumea pentru 802.11n', correct: false, why: 'Canalul 14 (2484 MHz) a fost permis doar în Japonia și doar pentru 802.11b (DSSS). În UE sunt permise canalele 1–13, iar în SUA 1–11.' },
    ],
    explanation: 'Planificarea în 2.4 GHz se rezumă la: 3 canale (1/6/11), lățime de 20 MHz, puterea ajustată ca celulele să se suprapună doar cât e nevoie pentru roaming (≈10–20%).',
  },

  // ======================= 1.11.b — SSID =======================
  {
    id: '1.11-007', topicId: T, sub: '1.11.b', type: 'single', difficulty: 1,
    stem: 'Care este lungimea maximă a unui [[ssid|SSID]]?',
    options: [
      { id: 'a', text: '32 de octeți (caractere)', correct: true, why: 'Standardul 802.11 definește SSID-ul ca un câmp de 0–32 de octeți. Pentru text ASCII simplu, înseamnă 32 de caractere.' },
      { id: 'b', text: '16 caractere', correct: false, why: 'Limita reală e dublă. 16 caractere e o limită întâlnită la alte câmpuri, nu la SSID.' },
      { id: 'c', text: '63 de caractere', correct: false, why: '63 este lungimea maximă a unei parole (passphrase) WPA2-PSK în format ASCII (8–63 de caractere), nu a SSID-ului.' },
      { id: 'd', text: '255 de caractere', correct: false, why: '255 este limita la alte câmpuri (de exemplu un nume DNS complet). SSID-ul e mult mai scurt.' },
    ],
    explanation: 'SSID: maximum 32 de octeți, diferențiază literele mari de cele mici („Lab” ≠ „lab”). Capcană frecventă: confuzia cu passphrase-ul PSK (8–63 de caractere).',
  },
  {
    id: '1.11-008', topicId: T, sub: '1.11.b', type: 'single', difficulty: 1,
    stem: 'Ce identifică [[bssid|BSSID]]-ul într-o rețea wireless?',
    options: [
      { id: 'a', text: 'Celula unui radio de AP pentru un anumit SSID, prin adresa MAC a acelui radio', correct: true, why: 'BSSID este un MAC de 48 de biți derivat din radioul AP-ului. Fiecare combinație radio + SSID are propriul BSSID, deci identifică unic un BSS.' },
      { id: 'b', text: 'Numele rețelei afișat utilizatorilor', correct: false, why: 'Acela este SSID-ul (text, cel mult 32 de octeți). BSSID-ul este o adresă MAC, nu un nume.' },
      { id: 'c', text: 'VLAN-ul pe care este mapat SSID-ul', correct: false, why: 'Maparea SSID → VLAN e o configurație pe AP/WLC, separată de identificatorii 802.11.' },
      { id: 'd', text: 'Adresa IP de management a AP-ului', correct: false, why: 'IP-ul de management este o adresă de nivel 3. BSSID-ul este o adresă MAC de nivel 2.' },
    ],
    explanation: 'SSID = numele (mai multe AP-uri pot avea același SSID). BSSID = „buletinul” unei celule anume. Cu `netsh wlan show interfaces` vezi la ce BSSID ești conectat.',
  },
  {
    id: '1.11-009', topicId: T, sub: '1.11.b', type: 'single', difficulty: 2,
    stem: 'Un administrator dezactivează „SSID broadcast” (ascunde SSID-ul) ca să securizeze rețeaua. Ce afirmație este corectă?',
    options: [
      { id: 'a', text: 'Nu este o măsură de securitate reală: SSID-ul circulă în continuare în clar, în probe requests/responses și în association requests', correct: true, why: 'AP-ul doar nu mai pune numele în beacons. Orice client legitim care se conectează trimite SSID-ul necriptat, iar un atacator cu un sniffer îl vede în câteva secunde.' },
      { id: 'b', text: 'Criptează traficul rețelei', correct: false, why: 'Criptarea vine din WPA2/WPA3 (AES-CCMP/GCMP). Ascunderea SSID-ului nu are nicio legătură cu criptarea.' },
      { id: 'c', text: 'Împiedică complet conectarea dispozitivelor neautorizate', correct: false, why: 'Autorizarea vine din autentificare (PSK/SAE/802.1X). Un SSID ascuns, odată aflat, poate fi introdus manual de oricine.' },
      { id: 'd', text: 'Elimină beacon frames din rețea', correct: false, why: 'AP-ul trimite în continuare beacons (are nevoie de ele pentru sincronizare și anunțarea capabilităților), doar cu câmpul SSID gol.' },
    ],
    explanation: 'Securitatea reală vine din autentificare și criptare (WPA2/WPA3). Ascunderea SSID-ului poate chiar face clienții mai „vorbăreți”: aceștia își caută activ rețeaua oriunde s-ar afla.',
  },
  {
    id: '1.11-010', topicId: T, sub: '1.11.b', type: 'single', difficulty: 1,
    stem: 'O companie are 12 AP-uri care difuzează același SSID „CORP”, iar laptopurile trec de la un AP la altul fără să se reconecteze manual. Cum se numește acest tip de topologie?',
    options: [
      { id: 'a', text: '[[ess|ESS]] (Extended Service Set)', correct: true, why: 'Mai multe BSS-uri cu același SSID, legate prin rețeaua cablată (DS), formează un ESS — o singură rețea logică în care clientul face roaming.' },
      { id: 'b', text: '[[bss|BSS]] (Basic Service Set)', correct: false, why: 'Un BSS este un singur AP cu clienții lui. 12 AP-uri înseamnă 12 BSS-uri, unite într-un ESS.' },
      { id: 'c', text: '[[ibss|IBSS]] (ad hoc)', correct: false, why: 'IBSS înseamnă clienți care comunică direct, fără niciun AP.' },
      { id: 'd', text: 'Mesh', correct: false, why: 'Într-o rețea mesh, AP-urile se leagă între ele prin radio (backhaul wireless). Aici nu se spune nimic despre legături radio între AP-uri; un ESS clasic folosește cablu.' },
    ],
    explanation: 'BSS = 1 AP; ESS = mai multe AP-uri cu același SSID, pe aceeași rețea cablată; IBSS = fără AP. Pentru roaming, celulele vecine trebuie să se suprapună puțin și să folosească canale diferite.',
  },
  {
    id: '1.11-011', topicId: T, sub: '1.11.b', type: 'single', difficulty: 2,
    stem: 'Un AP dual-band (2.4 + 5 GHz) difuzează trei SSID-uri: „Corp”, „Guest” și „IoT” pe ambele radiouri. Câte [[bssid|BSSID]]-uri anunță AP-ul?',
    options: [
      { id: 'a', text: '6', correct: true, why: 'Fiecare combinație radio + SSID are propriul BSSID: 2 radiouri × 3 SSID-uri = 6 adrese MAC virtuale.' },
      { id: 'b', text: '3', correct: false, why: '3 ar fi corect doar pentru un singur radio. Radioul de 5 GHz are BSSID-uri proprii, diferite de cele de pe 2.4 GHz.' },
      { id: 'c', text: '2', correct: false, why: '2 ar însemna câte un BSSID per radio, adică un singur SSID per radio. Cu MBSSID, fiecare SSID primește un MAC separat.' },
      { id: 'd', text: '1', correct: false, why: 'Un singur BSSID ar face imposibilă distingerea celulelor și a SSID-urilor la nivelul 2.' },
    ],
    explanation: 'Cu MBSSID, un radio poate avea mai multe BSSID-uri. Fiecare SSID trimite propriile beacons, așa că prea multe SSID-uri consumă timp de emisie — recomandarea uzuală este maximum 3–4 pe radio.',
  },
  {
    id: '1.11-012', topicId: T, sub: '1.11.b', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare termen cu descrierea lui.',
    leftLabel: 'Descriere', rightLabel: 'Termen',
    pairs: [
      { left: 'Numele text al rețelei, maximum 32 de octeți', right: 'SSID', why: 'SSID = Service Set Identifier, numele pe care îl alege utilizatorul.' },
      { left: 'Adresa MAC care identifică unic o celulă (radio + SSID)', right: 'BSSID', why: 'BSSID derivă din MAC-ul radioului AP-ului.' },
      { left: 'Un AP împreună cu clienții asociați lui', right: 'BSS', why: 'BSS = unitatea de bază a unei rețele Wi-Fi cu infrastructură.' },
      { left: 'Mai multe AP-uri cu același SSID, legate prin rețeaua cablată', right: 'ESS', why: 'ESS permite roamingul între celule.' },
      { left: 'Clienți care comunică direct între ei, fără AP', right: 'IBSS', why: 'IBSS = Independent BSS, adică rețeaua ad hoc.' },
    ],
    distractors: [{ text: 'BSA', why: 'BSA (Basic Service Area) este aria fizică acoperită de un BSS — „celula” ca suprafață, nu un set de dispozitive. Nu corespunde niciunei descrieri.' }],
    explanation: 'Acești termeni sunt fundația întregului capitol wireless; apar în aproape orice întrebare despre arhitecturi (2.6) și configurare (2.9).',
  },
  {
    id: '1.11-013', topicId: T, sub: '1.11.b', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii prin care un client se conectează la un WLAN WPA2-Personal (cu scanare activă).',
    items: [
      { text: 'Probe request (clientul întreabă ce rețele există)', why: 'Scanarea activă: clientul trimite probe requests pe fiecare canal.' },
      { text: 'Probe response (AP-ul răspunde cu SSID-ul și capabilitățile)', why: 'Răspunsul conține aceleași informații ca un beacon: rate, securitate, canal.' },
      { text: '802.11 Authentication (Open System)', why: 'O „autentificare” formală 802.11, fără verificarea parolei. Securitatea reală vine mai târziu.' },
      { text: 'Association request / response', why: 'Clientul cere să intre în BSS; AP-ul îi alocă un AID (Association ID).' },
      { text: '4-way handshake (derivarea cheilor din PSK)', why: 'Abia acum se verifică faptul că ambele părți au aceeași cheie și se calculează PTK/GTK.' },
      { text: 'DHCP (clientul primește adresă IP)', why: 'Traficul de date, inclusiv DHCP, e permis doar după handshake, criptat cu cheile noi.' },
    ],
    explanation: 'Ordinea de reținut: descoperire (probe/beacon) → autentificare 802.11 → asociere → securitate (4-way handshake, eventual precedat de 802.1X/EAP) → IP (DHCP).',
  },

  // ======================= 1.11.c — RF =======================
  {
    id: '1.11-014', topicId: T, sub: '1.11.c', type: 'single', difficulty: 2,
    stem: 'Care este aproximativ lungimea de undă a unui semnal de 2.4 GHz?',
    options: [
      { id: 'a', text: '12.5 cm', correct: true, why: 'λ = c / f = 300.000.000 m/s ÷ 2.400.000.000 Hz ≈ 0.125 m = 12.5 cm.' },
      { id: 'b', text: '6 cm', correct: false, why: 'Aceasta corespunde benzii de 5 GHz (300.000.000 ÷ 5.000.000.000 = 0.06 m).' },
      { id: 'c', text: '1.25 m', correct: false, why: 'Ar corespunde unei frecvențe de ≈240 MHz, de zece ori mai mică — calculul a omis un zero.' },
      { id: 'd', text: '2.4 m', correct: false, why: 'Confundă frecvența cu lungimea de undă. Valorile nu se citesc direct una din alta, ci prin λ = c/f.' },
    ],
    explanation: 'Frecvența și lungimea de undă sunt invers proporționale. Lungimea de undă mai mică (5/6 GHz) se atenuează mai repede la distanță și prin obstacole.',
  },
  {
    id: '1.11-015', topicId: T, sub: '1.11.c', type: 'single', difficulty: 1,
    stem: 'Câți miliwați înseamnă o putere de 20 [[dbm|dBm]]?',
    options: [
      { id: 'a', text: '100 mW', correct: true, why: '0 dBm = 1 mW; +10 dB = ×10 → 10 dBm = 10 mW; încă +10 dB → 20 dBm = 100 mW.' },
      { id: 'b', text: '20 mW', correct: false, why: 'Scara dBm este logaritmică, nu liniară — 20 dBm nu înseamnă 20 mW. 20 mW ar fi ≈13 dBm.' },
      { id: 'c', text: '200 mW', correct: false, why: '200 mW ≈ 23 dBm (100 mW dublat = +3 dB).' },
      { id: 'd', text: '1 W', correct: false, why: '1 W = 1000 mW = 30 dBm.' },
    ],
    explanation: 'Regulile 3 și 10: +3 dB ≈ ×2, −3 dB ≈ ÷2, +10 dB = ×10, −10 dB = ÷10. Cu ele calculezi rapid orice conversie dBm ↔ mW fără calculator.',
  },
  {
    id: '1.11-016', topicId: T, sub: '1.11.c', type: 'single', difficulty: 2,
    stem: 'Un AP își crește puterea de emisie de la 25 mW la 50 mW. Cu cât a crescut puterea în dB?',
    options: [
      { id: 'a', text: '+3 dB', correct: true, why: 'Dublarea puterii înseamnă +3 dB (10 × log10(2) ≈ 3.01).' },
      { id: 'b', text: '+25 dB', correct: false, why: 'Confundă diferența liniară (25 mW) cu decibelii. Decibelii exprimă rapoarte, nu diferențe.' },
      { id: 'c', text: '+10 dB', correct: false, why: '+10 dB ar însemna ×10, adică 250 mW.' },
      { id: 'd', text: '+6 dB', correct: false, why: '+6 dB ≈ ×4, adică 100 mW.' },
    ],
    explanation: 'Decibelii măsoară rapoarte: dublarea înseamnă +3 dB, înjumătățirea −3 dB, indiferent de valorile absolute (de la 1 la 2 mW e tot +3 dB).',
  },
  {
    id: '1.11-017', topicId: T, sub: '1.11.c', type: 'single', difficulty: 2,
    stem: 'Un client măsoară un semnal de −62 dBm, iar zgomotul de fond este −90 dBm. Care este [[snr|SNR]]-ul?',
    options: [
      { id: 'a', text: '28 dB', correct: true, why: 'SNR = semnal − zgomot = (−62) − (−90) = 28 dB. O valoare bună: suficientă pentru date și, la limită, pentru voce (≈25 dB+).' },
      { id: 'b', text: '−152 dB', correct: false, why: 'Rezultă din adunarea valorilor ((−62) + (−90)). SNR-ul este o diferență, nu o sumă.' },
      { id: 'c', text: '−28 dB', correct: false, why: 'Inversează ordinea (zgomot − semnal). Un SNR negativ ar însemna că zgomotul e mai puternic decât semnalul.' },
      { id: 'd', text: '1.45', correct: false, why: 'Rezultă din împărțirea valorilor dBm (90/62). Pe scara logaritmică, raportul devine o diferență.' },
    ],
    explanation: 'SNR-ul arată calitatea reală a legăturii: un semnal de −62 dBm este bun, dar dacă zgomotul ar fi −70 dBm, SNR-ul ar fi doar 8 dB, iar conexiunea ar fi foarte slabă.',
  },
  {
    id: '1.11-018', topicId: T, sub: '1.11.c', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare fenomen RF cu descrierea lui.',
    leftLabel: 'Ce se întâmplă cu semnalul', rightLabel: 'Fenomen',
    pairs: [
      { left: 'Este „înghițit” de apă, corpuri umane, pereți groși și transformat în căldură', right: 'Absorption', why: 'Absorbția (absorption) reduce amplitudinea semnalului, fără să îi schimbe direcția. Apa este un absorbant puternic la 2.4 GHz.' },
      { left: 'Ricoșează din metal sau sticlă tratată și se întoarce', right: 'Reflection', why: 'Reflexia (reflection) produce multipath: copii ale semnalului ajung la receptor cu întârziere.' },
      { left: 'Își schimbă direcția când trece printr-un mediu de densitate diferită (aer → sticlă)', right: 'Refraction', why: 'Refracția (refraction) curbează semnalul, la fel ca lumina în apă.' },
      { left: 'Se curbează în jurul unui obstacol mare, lăsând în spate o „umbră RF”', right: 'Diffraction', why: 'Difracția (diffraction) explică de ce ai semnal slab, dar nu zero, în spatele unui stâlp.' },
      { left: 'Se împrăștie în multe direcții la contactul cu suprafețe neregulate sau particule', right: 'Scattering', why: 'Împrăștierea (scattering) apare din cauza prafului, frunzișului, gardurilor de sârmă.' },
    ],
    explanation: 'Acestea sunt cele 5 comportamente clasice ale RF. Pentru examen, reține: metalul reflectă, apa absoarbe, iar frecvențele mai mari sunt afectate mai mult.',
  },
  {
    id: '1.11-019', topicId: T, sub: '1.11.c', type: 'single', difficulty: 2,
    stem: 'Ce metodă de acces la mediu folosesc rețelele 802.11?',
    options: [
      { id: 'a', text: '[[csma-ca|CSMA/CA]]', correct: true, why: 'Dispozitivele Wi-Fi nu pot detecta coliziunile în timp ce transmit, așa că încearcă să le evite: ascultă, așteaptă un backoff aleatoriu, transmit și așteaptă ACK.' },
      { id: 'b', text: '[[csma-cd|CSMA/CD]]', correct: false, why: 'CSMA/CD (detecția coliziunilor) este metoda Ethernetului half-duplex. Un radio care transmite nu poate asculta simultan pe același canal ca să detecteze coliziunea.' },
      { id: 'c', text: 'Token passing', correct: false, why: 'Token passing era folosit de Token Ring/FDDI, nu de Wi-Fi.' },
      { id: 'd', text: 'Full-duplex fără coliziuni, ca pe un switch', correct: false, why: 'Wi-Fi este half-duplex pe un canal: un singur dispozitiv transmite la un moment dat, iar mediul (aerul) este partajat.' },
    ],
    explanation: 'CA = Collision Avoidance (evitare); CD = Collision Detection (detecție). Wi-Fi folosește CA, plus ACK pentru fiecare cadru unicast și, opțional, RTS/CTS.',
  },
  {
    id: '1.11-020', topicId: T, sub: '1.11.c', type: 'single', difficulty: 2,
    stem: 'Care standard funcționează EXCLUSIV în banda de 5 GHz și a introdus [[mu-mimo|MU-MIMO]] pe downlink?',
    options: [
      { id: 'a', text: '[[80211ac|802.11ac]] (Wi-Fi 5)', correct: true, why: '802.11ac este definit doar pentru 5 GHz. Wave 2 a adus MU-MIMO pe downlink (până la 4 clienți simultan).' },
      { id: 'b', text: '[[80211n|802.11n]] (Wi-Fi 4)', correct: false, why: '802.11n funcționează în ambele benzi (2.4 și 5 GHz) și are doar SU-MIMO.' },
      { id: 'c', text: '[[80211ax|802.11ax]] (Wi-Fi 6)', correct: false, why: '802.11ax funcționează în 2.4 și 5 GHz (și 6 GHz ca Wi-Fi 6E). A extins MU-MIMO și la uplink.' },
      { id: 'd', text: '[[80211g|802.11g]]', correct: false, why: '802.11g funcționează doar în 2.4 GHz, la maximum 54 Mbps, fără MIMO.' },
    ],
    explanation: 'Capcană clasică: „802.11ac în 2.4 GHz” nu există. Routerele „AC1200” deservesc 2.4 GHz prin 802.11n și 5 GHz prin 802.11ac.',
  },
  {
    id: '1.11-021', topicId: T, sub: '1.11.c', type: 'multi', difficulty: 1,
    stem: 'Care DOUĂ standarde funcționează doar în banda de 2.4 GHz?',
    options: [
      { id: 'a', text: '[[80211b|802.11b]]', correct: true, why: '802.11b: 2.4 GHz, DSSS, maximum 11 Mbps.' },
      { id: 'b', text: '[[80211g|802.11g]]', correct: true, why: '802.11g: 2.4 GHz, OFDM, maximum 54 Mbps.' },
      { id: 'c', text: '[[80211a|802.11a]]', correct: false, why: '802.11a funcționează în 5 GHz (aceeași viteză ca 802.11g, 54 Mbps, dar altă bandă).' },
      { id: 'd', text: '[[80211n|802.11n]]', correct: false, why: '802.11n funcționează în ambele benzi, deci nu „doar” 2.4 GHz.' },
      { id: 'e', text: '[[80211ac|802.11ac]]', correct: false, why: '802.11ac funcționează doar în 5 GHz.' },
    ],
    explanation: 'Tabelul de reținut: b/g = 2.4 GHz; a/ac = 5 GHz; n/ax = ambele (ax și 6 GHz ca 6E); be = 2.4/5/6 GHz.',
  },
  {
    id: '1.11-022', topicId: T, sub: '1.11.c', type: 'match', difficulty: 1,
    stem: 'Potrivește fiecare standard IEEE cu numele lui de generație Wi-Fi.',
    leftLabel: 'Standard IEEE', rightLabel: 'Generație Wi-Fi',
    pairs: [
      { left: '802.11n', right: 'Wi-Fi 4', why: '802.11n (2009) a fost redenumit Wi-Fi 4 de Wi-Fi Alliance în 2018.' },
      { left: '802.11ac', right: 'Wi-Fi 5', why: '802.11ac (2013), doar 5 GHz.' },
      { left: '802.11ax', right: 'Wi-Fi 6', why: '802.11ax în 2.4/5 GHz este Wi-Fi 6; în 6 GHz este certificat ca Wi-Fi 6E.' },
      { left: '802.11be', right: 'Wi-Fi 7', why: '802.11be, certificat din 2024, cu canale de 320 MHz și MLO.' },
    ],
    distractors: [{ text: 'Wi-Fi 3', why: 'Wi-Fi Alliance nu a anunțat oficial numele Wi-Fi 1–3. Unele surse le atribuie neoficial lui 802.11b/a/g, dar nu există denumirea oficială „Wi-Fi 3”.' }],
    explanation: 'Numele generaționale oficiale sunt Wi-Fi 4, 5, 6, 6E și 7. La examen poți primi oricare denumire, așa că e bine să le știi pe ambele.',
  },
  {
    id: '1.11-023', topicId: T, sub: '1.11.c', type: 'single', difficulty: 2,
    stem: 'Ce tehnologie [[80211ax|Wi-Fi 6]] permite AP-ului să deservească mai mulți clienți simultan, împărțind un canal în „resource units”?',
    options: [
      { id: 'a', text: '[[ofdma|OFDMA]]', correct: true, why: 'OFDMA alocă grupuri de sub-purtătoare (RU) unor clienți diferiți în aceeași transmisie. Este o îmbunătățire majoră pentru eficiență în mediile dense.' },
      { id: 'b', text: '[[dsss|DSSS]]', correct: false, why: 'DSSS este tehnica veche a 802.11b: răspândește un singur flux pe 22 MHz. Nu împarte canalul între clienți.' },
      { id: 'c', text: '[[channel-bonding|Channel bonding]]', correct: false, why: 'Channel bonding face canalul mai lat pentru un singur client, nu îl împarte între mai mulți.' },
      { id: 'd', text: '[[rts-cts|RTS/CTS]]', correct: false, why: 'RTS/CTS rezervă mediul pentru un singur transmițător; e opusul transmisiei simultane către mai mulți.' },
    ],
    explanation: 'OFDM (Wi-Fi 4/5): un client ocupă tot canalul în transmisia lui. OFDMA (Wi-Fi 6/7): canalul se împarte între mai mulți clienți — ca un autobuz în loc de taxiuri.',
  },
  {
    id: '1.11-024', topicId: T, sub: '1.11.c', type: 'single', difficulty: 3,
    stem: 'Un client de voce pe Wi-Fi are întreruperi. Care valoare [[rssi|RSSI]] este considerată, în mod obișnuit, pragul minim recomandat pentru voce/video?',
    options: [
      { id: 'a', text: '−67 dBm', correct: true, why: 'Recomandarea uzuală în proiectarea Wi-Fi (inclusiv în ghidurile Cisco) este minimum −67 dBm pentru voce/video, cu un SNR ≥ 25 dB.' },
      { id: 'b', text: '−30 dBm', correct: false, why: '−30 dBm este un semnal extrem de puternic, practic lângă AP. Nu e un prag minim, ci aproape maximul măsurabil.' },
      { id: 'c', text: '−85 dBm', correct: false, why: '−85 dBm este foarte slab: datele merg poate la rate mici, dar vocea va avea pierderi.' },
      { id: 'd', text: '+67 dBm', correct: false, why: 'Semnalele recepționate au aproape întotdeauna valori negative în dBm (sub 1 mW). +67 dBm ar însemna ≈5 kW.' },
    ],
    explanation: 'Cu cât valoarea RSSI e mai apropiată de 0, cu atât semnalul e mai bun. Orientativ: −30 excelent, −67 minim pentru voce, −70 minim pentru date, −80 slab, sub −90 inutilizabil.',
  },
  {
    id: '1.11-025', topicId: T, sub: '1.11.c', type: 'multi', difficulty: 3,
    stem: 'Care DOUĂ motive explică de ce, la aceeași putere de emisie, celula de 5 GHz este mai mică decât cea de 2.4 GHz?',
    options: [
      { id: 'a', text: 'Pierderea în spațiu liber este mai mare la frecvențe mai mari', correct: true, why: 'FSPL crește cu frecvența (la aceeași distanță, 5 GHz pierde ≈6–7 dB în plus față de 2.4 GHz).' },
      { id: 'b', text: 'Obstacolele (pereți, oameni) atenuează mai mult frecvențele mai mari', correct: true, why: 'Lungimea de undă mai scurtă (≈6 cm) este absorbită și reflectată mai mult de materialele de construcție.' },
      { id: 'c', text: 'Banda de 5 GHz are mai multe canale', correct: false, why: 'Numărul de canale nu influențează raza unei celule; influențează câte celule poți pune una lângă alta fără interferență.' },
      { id: 'd', text: 'Canalele de 5 GHz trebuie să folosească DFS', correct: false, why: 'DFS influențează disponibilitatea canalului (cedarea lui în fața radarelor), nu raza. În plus, nu toate canalele de 5 GHz sunt DFS.' },
    ],
    explanation: 'Frecvență mai mare → lungime de undă mai mică → pierderi mai mari (la distanță și prin obstacole). Compromisul: 2.4 GHz are rază mare, dar puține canale și multă interferență; 5/6 GHz are celule mici, multe canale și capacitate mare.',
  },
  {
    id: '1.11-026', topicId: T, sub: '1.11.c', type: 'single', difficulty: 3,
    stem: 'Un AP emite cu 17 dBm și pierde 3 dB pe cablu, iar antena are un câștig de 6 dBi. Cât este [[eirp|EIRP]]-ul?',
    options: [
      { id: 'a', text: '20 dBm', correct: true, why: 'EIRP = 17 − 3 + 6 = 20 dBm (100 mW). Pierderile se scad, câștigul antenei se adună.' },
      { id: 'b', text: '26 dBm', correct: false, why: 'Rezultatul adună și pierderea de pe cablu (17 + 3 + 6). Pierderea trebuie scăzută.' },
      { id: 'c', text: '14 dBm', correct: false, why: 'Rezultatul scade și câștigul antenei (17 − 3 − 6). Câștigul antenei crește puterea radiată în direcția principală.' },
      { id: 'd', text: '102 mW × 6', correct: false, why: 'Amestecă unități liniare cu logaritmice. În dB, operațiile sunt adunări și scăderi.' },
    ],
    explanation: 'EIRP = putere TX (dBm) − pierderi (dB) + câștig antenă (dBi). Reglementatorul (ANCOM/ETSI în România) limitează EIRP-ul, nu doar puterea transmițătorului.',
  },
  {
    id: '1.11-027', topicId: T, sub: '1.11.c', type: 'single', difficulty: 2,
    stem: 'Ce înseamnă notația MIMO „3×3:2” în fișa tehnică a unui AP?',
    options: [
      { id: 'a', text: '3 antene de emisie, 3 de recepție și 2 fluxuri spațiale', correct: true, why: 'Formatul este T×R:S — transmițătoare × receptoare : spatial streams. Antenele suplimentare (3 > 2) îmbunătățesc recepția și beamforming-ul.' },
      { id: 'b', text: '3 benzi, 3 SSID-uri, 2 VLAN-uri', correct: false, why: 'Notația MIMO descrie lanțurile radio și fluxurile, nu configurația logică a rețelei.' },
      { id: 'c', text: '3 clienți simultani pe 3 canale, prin 2 radiouri', correct: false, why: 'Numărul de clienți MU-MIMO este o altă specificație, iar numărul de radiouri nu apare în această notație.' },
      { id: 'd', text: 'Viteza maximă de 3 × 3 × 2 = 18 Gbps', correct: false, why: 'Notația nu exprimă viteza. Viteza depinde de standard, lățimea canalului, modulație și numărul de fluxuri.' },
    ],
    explanation: 'Numărul de fluxuri spațiale este limitat de partea mai slabă: un AP 4×4:4 cu un telefon 2×2:2 va folosi doar 2 fluxuri.',
  },

  // ======================= 1.11.d — criptare =======================
  {
    id: '1.11-028', topicId: T, sub: '1.11.d', type: 'single', difficulty: 1,
    stem: 'Ce cifru și protocol de criptare sunt obligatorii în [[wpa2|WPA2]]?',
    options: [
      { id: 'a', text: '[[aes|AES]]-[[ccmp|CCMP]]', correct: true, why: 'WPA2 se bazează pe 802.11i, iar 802.11i impune AES în modul CCMP (128 de biți) pentru confidențialitate și integritate.' },
      { id: 'b', text: '[[rc4|RC4]]-[[tkip|TKIP]]', correct: false, why: 'TKIP (bazat pe RC4) aparține WPA (prima versiune). Unele AP-uri îl permit în modul mixt WPA/WPA2, dar nu este cerința WPA2 și este depreciat.' },
      { id: 'c', text: '[[gcmp|GCMP]]-256', correct: false, why: 'GCMP-256 apare în modul WPA3-Enterprise de 192 de biți, nu în WPA2.' },
      { id: 'd', text: '[[wep|WEP]] cu chei de 104 biți', correct: false, why: 'WEP este mecanismul original, spart. WPA2 l-a înlocuit tocmai pentru că WEP nu mai era sigur.' },
    ],
    explanation: 'Perechile de reținut: WEP → RC4 · WPA → TKIP (RC4) · WPA2 → AES-CCMP · WPA3 → AES-CCMP/GCMP + SAE + PMF.',
  },
  {
    id: '1.11-029', topicId: T, sub: '1.11.d', type: 'single', difficulty: 2,
    stem: 'Ce mecanism înlocuiește WPA3-Personal pentru autentificarea pe bază de parolă, ca să prevină atacurile de dicționar offline?',
    options: [
      { id: 'a', text: '[[sae|SAE]] (Simultaneous Authentication of Equals)', correct: true, why: 'SAE (schimbul Dragonfly) dovedește că ambele părți cunosc parola fără să expună ceva ce poate fi spart offline. Fiecare încercare de parolă cere o interacțiune live cu AP-ul.' },
      { id: 'b', text: '[[tkip|TKIP]]', correct: false, why: 'TKIP este un protocol de criptare vechi (WPA), nu o metodă de autentificare. Nu se mai folosește.' },
      { id: 'c', text: '[[dot1x|802.1X]] cu RADIUS', correct: false, why: '802.1X este pentru modul Enterprise (credențiale per utilizator), nu pentru modul Personal cu o parolă comună.' },
      { id: 'd', text: 'Ascunderea SSID-ului', correct: false, why: 'Ascunderea SSID-ului nu este autentificare și nici o măsură de securitate.' },
    ],
    explanation: 'Cu WPA2-PSK, un atacator care capturează 4-way handshake-ul poate încerca milioane de parole offline. Cu WPA3-SAE nu poate — și obține și forward secrecy.',
  },
  {
    id: '1.11-030', topicId: T, sub: '1.11.d', type: 'multi', difficulty: 2,
    stem: 'Care TREI caracteristici aparțin [[wpa3|WPA3]]?',
    options: [
      { id: 'a', text: 'SAE în modul Personal', correct: true, why: 'SAE înlocuiește autentificarea PSK clasică.' },
      { id: 'b', text: 'Protected Management Frames (802.11w) obligatoriu', correct: true, why: 'În WPA3, PMF este obligatoriu și blochează cadrele false de deautentificare.' },
      { id: 'c', text: 'Mod opțional de 192 de biți (GCMP-256) pentru Enterprise', correct: true, why: 'WPA3-Enterprise 192-bit (suita CNSA) folosește GCMP-256 și algoritmi mai puternici pentru medii sensibile.' },
      { id: 'd', text: 'Criptare TKIP pentru compatibilitate', correct: false, why: 'TKIP este interzis în WPA3. Compatibilitatea cu clienții vechi se face prin „WPA3 Transition Mode” (SAE + WPA2-PSK cu AES), nu prin TKIP.' },
      { id: 'e', text: 'Chei WEP statice partajate', correct: false, why: 'WEP este complet nesigur și nu face parte din nicio versiune WPA.' },
    ],
    explanation: 'WPA3 = SAE (Personal) + PMF obligatoriu + 192-bit (Enterprise, opțional). Pentru rețelele deschise există separat OWE (Enhanced Open).',
  },
  {
    id: '1.11-031', topicId: T, sub: '1.11.d', type: 'single', difficulty: 1,
    stem: 'Care mecanism de securitate wireless este considerat spart, în principal din cauza vectorului de inițializare (IV) de doar 24 de biți?',
    options: [
      { id: 'a', text: '[[wep|WEP]]', correct: true, why: 'IV-ul de 24 de biți se repetă rapid (≈16.7 milioane de valori), iar slăbiciunile RC4 permit recuperarea cheii în câteva minute.' },
      { id: 'b', text: '[[wpa2|WPA2]]', correct: false, why: 'WPA2 folosește AES-CCMP cu un nonce de 48 de biți (packet number), nu un IV de 24 de biți. Punctul său slab este parola PSK slabă, nu cifrul.' },
      { id: 'c', text: '[[wpa3|WPA3]]', correct: false, why: 'WPA3 este standardul actual, cu SAE și PMF.' },
      { id: 'd', text: '[[aes|AES]]', correct: false, why: 'AES este un cifru modern, considerat sigur; nu a fost „spart”.' },
    ],
    explanation: 'Evoluția a pornit de la slăbiciunile WEP: WPA (TKIP) a fost un „plasture” pe hardware vechi, WPA2 a adus AES, iar WPA3 a adus SAE și PMF.',
  },
  {
    id: '1.11-032', topicId: T, sub: '1.11.d', type: 'order', difficulty: 3,
    stem: 'Ordonează mesajele din [[4way|4-way handshake]].',
    items: [
      { text: 'AP → client: ANonce', why: 'Mesajul 1: AP-ul trimite un număr aleatoriu. Clientul are acum tot ce îi trebuie (PMK, ANonce, SNonce, MAC-uri) ca să calculeze PTK-ul.' },
      { text: 'Client → AP: SNonce + MIC', why: 'Mesajul 2: AP-ul primește SNonce-ul, calculează și el PTK-ul și verifică MIC-ul. Un MIC valid dovedește că clientul are același PMK (parola corectă).' },
      { text: 'AP → client: GTK (criptat) + MIC', why: 'Mesajul 3: AP-ul confirmă că și el are PTK-ul și trimite cheia de grup pentru broadcast/multicast.' },
      { text: 'Client → AP: confirmare (ACK)', why: 'Mesajul 4: clientul confirmă instalarea cheilor. Din acest moment traficul este criptat.' },
    ],
    explanation: 'PMK-ul (din parolă sau din 802.1X) nu circulă niciodată prin aer. Se schimbă doar nonce-uri și MIC-uri, din care fiecare parte calculează PTK-ul.',
  },
  {
    id: '1.11-033', topicId: T, sub: '1.11.d', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare mecanism de securitate cu metoda lui de criptare.',
    leftLabel: 'Mecanism', rightLabel: 'Criptare',
    pairs: [
      { left: 'WEP', right: 'RC4 (cheie statică + IV 24 biți)', why: 'WEP = RC4 cu IV scurt → spart.' },
      { left: 'WPA', right: 'TKIP (RC4 cu chei per pachet)', why: 'WPA a reutilizat hardware-ul WEP, dar a schimbat cheile per pachet.' },
      { left: 'WPA2', right: 'AES-CCMP (128 biți)', why: 'WPA2 = 802.11i = AES-CCMP obligatoriu.' },
      { left: 'WPA3-Enterprise (mod 192 biți)', right: 'GCMP-256', why: 'Modul de 192 de biți folosește AES-GCMP-256 și suita CNSA.' },
    ],
    distractors: [{ text: 'SHA-256', why: 'SHA-256 este o funcție hash (folosită la derivarea cheilor și în semnături), nu un algoritm de criptare a datelor.' }],
    explanation: 'Această potrivire apare frecvent la examen. Reține evoluția: RC4 → TKIP → AES-CCMP → GCMP.',
  },
  {
    id: '1.11-034', topicId: T, sub: '1.11.d', type: 'single', difficulty: 2,
    stem: 'Într-o rețea [[wpa2|WPA2]]-Personal, din ce se derivă [[pmk|PMK]]-ul?',
    options: [
      { id: 'a', text: 'Din passphrase și SSID (PBKDF2)', correct: true, why: 'PMK = PBKDF2(HMAC-SHA1, passphrase, SSID, 4096 iterații, 256 biți). De aceea, schimbarea SSID-ului schimbă și PMK-ul, chiar cu aceeași parolă.' },
      { id: 'b', text: 'De la serverul RADIUS, după autentificarea EAP', correct: false, why: 'Așa funcționează modul Enterprise (802.1X): PMK-ul vine din sesiunea EAP și este unic per utilizator.' },
      { id: 'c', text: 'Din adresa MAC a AP-ului', correct: false, why: 'MAC-urile intră în calculul PTK-ului (cheia de sesiune), nu al PMK-ului.' },
      { id: 'd', text: 'Este generat aleatoriu de AP la fiecare conectare', correct: false, why: 'Ceea ce se generează aleatoriu la fiecare conectare sunt nonce-urile (ANonce/SNonce), deci și PTK-ul. PMK-ul în modul PSK este fix pentru aceeași pereche parolă + SSID.' },
    ],
    explanation: 'În modul PSK, toți clienții au același PMK, ceea ce înseamnă că oricine știe parola poate, în anumite condiții, decripta traficul altuia (WPA2). De aceea companiile folosesc 802.1X, iar WPA3 a adus SAE.',
  },
  {
    id: '1.11-035', topicId: T, sub: '1.11.d', type: 'single', difficulty: 2,
    stem: 'O companie vrea ca fiecare angajat să se autentifice pe Wi-Fi cu propriul cont, centralizat. Ce mod de securitate trebuie folosit?',
    options: [
      { id: 'a', text: 'WPA2/WPA3-Enterprise ([[dot1x|802.1X]] + [[eap|EAP]] + [[radius|RADIUS]])', correct: true, why: 'Modul Enterprise verifică fiecare utilizator pe un server RADIUS (de exemplu Cisco ISE, legat de Active Directory). Contul unui angajat care pleacă se dezactivează fără a schimba parola tuturor.' },
      { id: 'b', text: 'WPA2-Personal cu o parolă lungă', correct: false, why: 'Personal înseamnă o singură parolă comună (PSK). Nu există identitate per utilizator, iar revocarea accesului înseamnă schimbarea parolei pe toate dispozitivele.' },
      { id: 'c', text: 'Rețea deschisă cu filtrare MAC', correct: false, why: 'Filtrarea MAC nu e autentificare reală (MAC-ul se poate falsifica ușor) și nu oferă criptare.' },
      { id: 'd', text: 'WEP cu chei diferite per departament', correct: false, why: 'WEP este spart și nu oferă identitate per utilizator.' },
    ],
    explanation: 'Personal (PSK/SAE) = o parolă comună, pentru casă sau birouri mici. Enterprise (802.1X) = identitate per utilizator, pentru companii.',
  },

  // ======================= CLI / verificare =======================
  {
    id: '1.11-036', topicId: T, sub: '1.11.b', type: 'cli', difficulty: 2,
    stem: 'Pe Windows, ce comandă afișează pentru conexiunea wireless curentă SSID-ul, BSSID-ul, tipul radio, canalul și semnalul?',
    prompt: 'C:\\>', canonical: 'netsh wlan show interfaces',
    answers: ['netsh wlan show interfaces', 'netsh wlan show interface', 'netsh wlan sh int', 'netsh wlan show int'],
    hint: 'începe cu netsh wlan …',
    wrong: [
      { text: 'ipconfig /all', why: 'Arată adresare IP, MAC, DHCP, DNS — nu SSID-ul, canalul sau semnalul radio.' },
      { text: 'netsh wlan show networks', why: 'Listează rețelele vizibile din jur (cu `mode=bssid` și BSSID/canal/semnal pentru fiecare), nu detaliile conexiunii tale curente.' },
      { text: 'netsh wlan show profiles', why: 'Arată profilurile Wi-Fi salvate pe calculator, nu starea conexiunii active.' },
    ],
    explanation: '`netsh wlan show interfaces` este comanda de bază pentru diagnoza clientului pe Windows (legată și de topicul 1.10 — Verify IP parameters for Client OS).',
  },
  {
    id: '1.11-037', topicId: T, sub: '1.11.a', type: 'cli', difficulty: 2,
    stem: 'Pe un Linux cu NetworkManager, ce comandă listează rețelele Wi-Fi vizibile, cu SSID, canal, semnal și securitate?',
    prompt: 'user@linux:~$', canonical: 'nmcli dev wifi list',
    answers: ['nmcli dev wifi list', 'nmcli device wifi list', 'nmcli d wifi list', 'nmcli dev wifi', 'nmcli device wifi', 'nmcli d wifi'],
    hint: 'utilitarul NetworkManager în linie de comandă',
    wrong: [
      { text: 'ifconfig', why: 'Afișează interfețele și adresele IP (și e învechit, înlocuit de `ip addr`). Nu scanează rețele wireless.' },
      { text: 'ip addr', why: 'Arată adresele IP ale interfețelor, nu rețelele Wi-Fi din jur.' },
      { text: 'iwconfig', why: 'Instrument vechi (wireless-tools) care arată parametrii interfeței wireless, dar nu listează rețelele din jur. Pentru scanare se folosesc `nmcli dev wifi list` sau `iw dev wlan0 scan`.' },
    ],
    explanation: 'Pe Linux: `nmcli dev wifi list` (scanare), `iw dev wlan0 link` (conexiunea curentă: SSID, BSSID, frecvență, semnal), `ip addr` (adresare IP).',
  },
  {
    id: '1.11-038', topicId: T, sub: '1.11.a', type: 'cli', difficulty: 3,
    stem: 'Pe un AP Cisco autonom (IOS), ești în modul de configurare al radioului de 2.4 GHz (`interface Dot11Radio0`). Ce comandă setează canalul 6?',
    prompt: 'AP(config-if)#', canonical: 'channel 6',
    answers: ['channel 6', 'channel 2437'],
    hint: 'un singur cuvânt-cheie urmat de număr',
    wrong: [
      { text: 'wifi channel 6', why: 'Nu există cuvântul-cheie `wifi` în IOS-ul AP-urilor autonome. Comanda este doar `channel`.' },
      { text: 'frequency 2.4', why: 'Banda este dată de interfața radio (Dot11Radio0 = 2.4 GHz), nu de o comandă `frequency`.' },
      { text: 'ssid 6', why: '`ssid` asociază un SSID radioului; ar crea sau atașa un SSID numit „6”, nu ar seta canalul.' },
    ],
    explanation: 'Pe AP-urile autonome, `channel` acceptă fie numărul canalului, fie frecvența în MHz (6 ≡ 2437). Opțiunea `channel least-congested` alege automat canalul cel mai puțin aglomerat.',
  },
  {
    id: '1.11-039', topicId: T, sub: '1.11.b', type: 'cli', difficulty: 3,
    stem: 'Pe un WLC Catalyst 9800, ce comandă din privileged EXEC afișează un rezumat al tuturor WLAN-urilor (ID, profil, SSID, stare, securitate)?',
    prompt: 'WLC#', canonical: 'show wlan summary',
    answers: ['show wlan summary', 'sh wlan summary', 'sh wlan sum', 'show wlan sum'],
    wrong: [
      { text: 'show ssid', why: 'Nu există această comandă pe 9800. Pe IOS-XE, WLAN-urile se verifică cu `show wlan …`.' },
      { text: 'show wireless client summary', why: 'Afișează clienții asociați (MAC, AP, WLAN, stare), nu lista de WLAN-uri.' },
      { text: 'show ap summary', why: 'Listează AP-urile înregistrate (nume, model, IP, stare), nu WLAN-urile.' },
    ],
    explanation: 'Pe 9800: `show wlan summary` (WLAN-uri), `show wlan id 1` (detalii), `show ap summary` (AP-uri), `show wireless client summary` (clienți).',
  },
  {
    id: '1.11-040', topicId: T, sub: '1.11.d', type: 'single', difficulty: 3,
    stem: 'De ce un client 802.11n conectat la un WLAN configurat doar cu [[tkip|TKIP]] nu depășește 54 Mbps?',
    options: [
      { id: 'a', text: 'Standardul 802.11n nu permite ratele HT (High Throughput) cu TKIP sau WEP', correct: true, why: '802.11n a interzis ratele HT cu cifrurile vechi. Cu TKIP/WEP, clientul cade pe ratele 802.11a/g (maximum 54 Mbps). Încă un motiv să folosești AES.' },
      { id: 'b', text: 'TKIP funcționează doar în 5 GHz', correct: false, why: 'TKIP nu depinde de bandă; a fost folosit atât în 2.4, cât și în 5 GHz.' },
      { id: 'c', text: 'TKIP limitează numărul de clienți la 54', correct: false, why: 'TKIP nu limitează numărul de clienți; 54 este o rată în Mbps.' },
      { id: 'd', text: 'AP-ul trece automat pe 802.11b', correct: false, why: '802.11b ar limita la 11 Mbps, nu la 54. Limita de 54 Mbps corespunde ratelor OFDM a/g.' },
    ],
    explanation: 'Simptom real întâlnit în practică: o rețea „lentă” după activarea modului mixt WPA/WPA2 cu TKIP. Soluția: WPA2/WPA3 doar cu AES.',
  },
];
