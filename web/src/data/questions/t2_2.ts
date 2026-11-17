import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.2 Configure and verify interswitch connectivity
// (a. Trunk ports · b. 802.1Q · c. Native VLAN). Fiecare variantă are explicație (why).
const T = '2.2';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_2: Question[] = [
  // ======================= 2.2 imaginea de ansamblu =======================
  single({ id: '2.2-001' }, '2.2', 1, 'Ce este un trunk între două switch-uri?', [
    ['O legătură care transportă cadre din mai multe VLAN-uri, etichetate 802.1Q', true, 'Trunk-ul permite ca mai multe VLAN-uri să circule pe același cablu, fiecare cadru având un tag cu VID-ul lui.'],
    ['O legătură care transportă un singur VLAN, fără tag', false, 'Aceasta descrie un port access; trunk-ul transportă mai multe VLAN-uri.'],
    ['O legătură redundantă folosită doar la defectarea alteia', false, 'Redundanța este rolul STP/EtherChannel; trunk-ul ține de transportul VLAN-urilor.'],
    ['O legătură între un switch și un router care nu poartă VLAN-uri', false, 'Legăturile cu mai multe VLAN-uri (inclusiv spre router în ROAS) sunt tocmai trunk-uri.'],
  ], 'Trunk = mai multe VLAN-uri pe același cablu, cu tag 802.1Q.'),
  single({ id: '2.2-002' }, '2.2', 1, 'Care este avantajul unui trunk față de „un cablu per VLAN” între două switch-uri?', [
    ['Un singur cablu și un singur port pe switch pentru toate VLAN-urile', true, 'Numărul de cabluri nu mai crește cu numărul de VLAN-uri.'],
    ['VLAN-urile devin routabile fără router', false, 'Trunk-ul nu rutează; între VLAN-uri e nevoie tot de dispozitiv L3.'],
    ['Viteza legăturii se dublează', false, 'Banda nu crește; ea este partajată între VLAN-uri.'],
    ['Elimină nevoia de a crea VLAN-urile pe al doilea switch', false, 'VLAN-urile trebuie să existe pe fiecare switch.'],
  ], 'Scalare: un singur cablu poartă toate VLAN-urile.'),
  single({ id: '2.2-003' }, '2.2', 1, 'Care dintre următoarele este standardul deschis pentru etichetarea VLAN-urilor pe un trunk?', [
    ['IEEE 802.1Q', true, 'Standard IEEE, folosit practic peste tot.'],
    ['ISL', false, 'ISL este proprietar Cisco și învechit.'],
    ['IEEE 802.3ad', false, '802.3ad este LACP (agregare de linkuri), nu etichetare VLAN.'],
    ['IEEE 802.1X', false, '802.1X este autentificare pe port, nu etichetare VLAN.'],
  ], '802.1Q = standardul; ISL = vechiul proprietar Cisco.'),
  multi({ id: '2.2-004' }, '2.2', 2, 'Pentru ca un VLAN să circule corect printr-un trunk între SW1 și SW2, ce trebuie să fie adevărat? (alege trei)', [
    ['VLAN-ul există pe ambele switch-uri', true, 'Un VLAN inexistent nu transportă trafic, chiar dacă e permis pe trunk.'],
    ['VLAN-ul este permis pe trunk (allowed list)', true, 'Cadrele unui VLAN care nu e în lista permisă nu trec.'],
    ['Native VLAN este același la ambele capete', true, 'Altfel apar scurgeri între VLAN-uri și mesaje CDP.'],
    ['Ambele porturi trebuie să fie în VLAN 1 ca access', false, 'Porturile trunk nu sunt access; sunt trunk operațional.'],
    ['Adresele IP ale switch-urilor trebuie să fie în același VLAN', false, 'Conectivitatea L2 prin trunk nu cere adrese IP pe switch-uri.'],
  ], 'VLAN existent + permis + native consecvent.'),
  single({ id: '2.2-005' }, '2.2', 2, 'Care comandă arată porturile trunk, native VLAN-ul și VLAN-urile permise?', [
    ['show interfaces trunk', true, 'Listează modul, encapsularea, starea, native VLAN-ul și cele trei liste de VLAN-uri.'],
    ['show vlan brief', false, 'Listează VLAN-urile și porturile access; trunk-urile nu apar.'],
    ['show mac address-table', false, 'Arată adrese MAC învățate, nu configurația trunk.'],
    ['show ip interface brief', false, 'Arată adrese IP și stări L3, nu parametri trunk.'],
  ], 'show interfaces trunk.'),
  single({ id: '2.2-006' }, '2.2', 3, 'VLAN 40 este în lista allowed a trunk-ului, dar nu a fost creat pe SW2. Ce se întâmplă cu traficul VLAN 40 spre SW2?', [
    ['Nu este transportat util: VLAN-ul nu apare în „allowed and active” pe SW2', true, 'Un VLAN trebuie să existe pe switch pentru ca traficul lui să fie comutat.'],
    ['Trece normal, trunk-ul creează VLAN-ul automat', false, 'Trunk-ul nu creează VLAN-uri (fără VTP).'],
    ['Se mută în native VLAN', false, 'Cadrele nu se mută în native VLAN din acest motiv.'],
    ['Trunk-ul trece în shutdown', false, 'Portul rămâne activ; doar acel VLAN nu funcționează.'],
  ], 'Permis ≠ activ: VLAN-ul trebuie creat.'),

  // ======================= 2.2.a Trunk ports =======================
  single({ id: '2.2-007' }, '2.2.a', 1, 'Care comandă face ca interfața curentă să fie trunk, indiferent de vecin?', [
    ['switchport mode trunk', true, 'Forțează portul în trunk.'],
    ['switchport mode access', false, 'Aceasta forțează un port access.'],
    ['switchport trunk native vlan 1', false, 'Setează VLAN-ul nativ, nu modul portului.'],
    ['switchport mode dynamic auto', false, 'Portul așteaptă ca vecinul să ceară trunk; nu îl forțează.'],
  ], 'switchport mode trunk.'),
  single({ id: '2.2-008' }, '2.2.a', 2, 'Pe un switch 2960 modern comanda „switchport trunk encapsulation dot1q” este respinsă. De ce?', [
    ['Platforma suportă doar 802.1Q, deci nu mai există de ales între ISL și 802.1Q', true, 'Comanda există doar pe platformele care suportă și ISL.'],
    ['Portul nu poate fi trunk pe 2960', false, '2960 suportă trunk 802.1Q.'],
    ['Comanda se dă doar în modul de configurare globală', false, 'Se dă în interfață, dar e disponibilă doar acolo unde există ISL.'],
    ['Trebuie întâi activat DTP', false, 'DTP nu are legătură cu disponibilitatea comenzii.'],
  ], 'Fără ISL pe platformă ⇒ fără comanda encapsulation.'),
  single({ id: '2.2-009' }, '2.2.a', 2, 'Un trunk permite VLAN-urile 10, 20, 30. Rulezi „switchport trunk allowed vlan 30”. Care este rezultatul?', [
    ['Doar VLAN 30 mai trece; 10 și 20 sunt tăiate', true, 'Lista simplă înlocuiește lista existentă.'],
    ['Lista devine 10, 20, 30 (se adaugă 30)', false, 'Pentru adăugare trebuie cuvântul add.'],
    ['Comanda este respinsă, 30 fiind deja permis', false, 'Comanda este acceptată și înlocuiește lista.'],
    ['VLAN 30 este mutat în native VLAN', false, 'Allowed list nu schimbă native VLAN.'],
  ], 'allowed vlan N = înlocuire; add/remove = modificare.'),
  single({ id: '2.2-010' }, '2.2.a', 2, 'Cum adaugi VLAN 40 la lista permisă existentă, fără să o pierzi?', [
    ['switchport trunk allowed vlan add 40', true, 'add păstrează lista și adaugă VLAN 40.'],
    ['switchport trunk allowed vlan 40', false, 'Înlocuiește lista cu doar 40.'],
    ['switchport trunk vlan 40', false, 'Sintaxă invalidă.'],
    ['switchport trunk allowed vlan except 40', false, 'except permite toate în afară de 40; efectul este opus.'],
  ], 'add păstrează lista.'),
  { id: '2.2-011', topicId: T, sub: '2.2.a', type: 'match', difficulty: 2,
    stem: 'Potrivește perechea de moduri DTP cu rezultatul negocierii.',
    leftLabel: 'SW1 + SW2', rightLabel: 'Rezultat',
    pairs: [
      { left: 'dynamic auto + dynamic auto', right: 'access', why: 'Niciunul nu cere trunk; legătura rămâne access.' },
      { left: 'dynamic auto + dynamic desirable', right: 'trunk', why: 'Desirable cere activ, auto acceptă.' },
      { left: 'trunk + dynamic auto', right: 'trunk', why: 'Trunk trimite cereri DTP, auto acceptă.' },
      { left: 'trunk + access', right: 'mismatch', why: 'Un capăt forțează trunk, celălalt access: nepotrivire.' },
    ],
    distractors: [{ text: 'port-channel', why: 'Agregarea de linkuri nu rezultă din DTP.' }],
    explanation: 'Cel puțin un capăt activ (trunk/desirable) pentru trunk.' },
  single({ id: '2.2-012' }, '2.2.a', 2, 'Două switch-uri Catalyst noi, cu configurația implicită (dynamic auto), sunt conectate printr-un cablu. Ce tip de legătură se formează?', [
    ['Access (nu se formează trunk)', true, 'auto + auto: niciunul nu inițiază negocierea.'],
    ['Trunk 802.1Q', false, 'Ar fi nevoie ca cel puțin un capăt să fie trunk sau desirable.'],
    ['Trunk ISL', false, 'ISL nu e folosit și nu rezultă din auto.'],
    ['Port-channel', false, 'EtherChannel nu se formează automat în acest fel.'],
  ], 'auto + auto = access.'),
  single({ id: '2.2-013' }, '2.2.a', 2, 'SW1 are „switchport mode trunk”, iar SW2 „switchport mode access” pe porturile conectate. Cum se numește situația?', [
    ['Mismatch de moduri: conectivitate limitată sau nefuncțională', true, 'Un capăt etichetează cadrele, celălalt le așteaptă netaggate.'],
    ['Trunk funcțional cu native VLAN 1', false, 'Capătul access nu înțelege tag-urile.'],
    ['Negociere reușită prin DTP', false, 'Access nu negociază și nu devine trunk.'],
    ['EtherChannel parțial', false, 'Nu este agregare de linkuri.'],
  ], 'trunk + access = mismatch.'),
  multi({ id: '2.2-014' }, '2.2.a', 2, 'Care combinații de moduri formează un trunk? (alege trei)', [
    ['dynamic desirable + dynamic auto', true, 'Desirable cere activ, auto acceptă.'],
    ['trunk + dynamic desirable', true, 'Trunk și desirable cer amândouă trunk.'],
    ['trunk + dynamic auto', true, 'Trunk trimite cereri; auto acceptă.'],
    ['dynamic auto + dynamic auto', false, 'Niciun capăt activ: rezultă access.'],
    ['access + dynamic desirable', false, 'Access nu acceptă trunk; rezultă access.'],
  ], 'Trebuie un capăt activ și celălalt nu-access.'),
  single({ id: '2.2-015' }, '2.2.a', 2, 'Care este configurația recomandată pentru un port spre un PC, din punct de vedere al securității DTP?', [
    ['switchport mode access', true, 'Un port access explicit nu poate fi convins să devină trunk (switch spoofing).'],
    ['switchport mode dynamic auto', false, 'Un atacator ar putea cere trunk și primi toate VLAN-urile.'],
    ['switchport mode dynamic desirable', false, 'Portul ar iniția chiar el negocierea de trunk.'],
    ['switchport mode trunk', false, 'Un PC nu are nevoie de trunk; ar expune toate VLAN-urile.'],
  ], 'Utilizatori: access explicit.'),
  single({ id: '2.2-016' }, '2.2.a', 3, 'SW1 are „switchport mode trunk” + „switchport nonegotiate”. SW2 are „switchport mode dynamic auto”. Care este rezultatul probabil?', [
    ['Nu se formează trunk: SW2 așteaptă DTP, iar SW1 nu îl mai trimite', true, 'nonegotiate oprește cadrele DTP, iar auto nu inițiază singur.'],
    ['Trunk, pentru că SW1 e trunk forțat', false, 'Trunk forțat fără DTP nu convinge un port dynamic auto.'],
    ['Port-channel', false, 'Nu are legătură cu DTP.'],
    ['Mismatch de VTP', false, 'VTP nu intervine în această negociere.'],
  ], 'nonegotiate + auto la vecin = fără trunk.'),

  // ======================= 2.2.b 802.1Q =======================
  single({ id: '2.2-017' }, '2.2.b', 1, 'Câți octeți adaugă tag-ul 802.1Q unui cadru Ethernet?', [
    ['4 octeți', true, 'TPID 2 octeți + TCI 2 octeți.'],
    ['2 octeți', false, 'Atât are doar TPID; TCI mai adaugă 2.'],
    ['8 octeți', false, 'Este prea mult; ISL adaugă 30 octeți în total, 802.1Q doar 4.'],
    ['6 octeți', false, 'Este lungimea unei adrese MAC, nu a tag-ului.'],
  ], 'Tag 802.1Q = 4 octeți.'),
  single({ id: '2.2-018' }, '2.2.b', 2, 'Unde se inserează tag-ul 802.1Q în cadru?', [
    ['Imediat după adresa MAC sursă', true, 'Înaintea EtherType-ului real.'],
    ['La sfârșitul cadrului, după FCS', false, 'Tag-ul nu este în coadă.'],
    ['Înaintea adresei MAC destinație', false, 'Antetul începe cu MAC destinație; tag-ul vine după sursă.'],
    ['În interiorul payload-ului IP', false, 'Este un câmp de nivel 2, nu de nivel 3.'],
  ], 'După Src MAC.'),
  single({ id: '2.2-019' }, '2.2.b', 2, 'Câți biți are câmpul VLAN ID (VID) din tag-ul 802.1Q?', [
    ['12 biți', true, '4096 valori; 4094 utilizabile (1–4094).'],
    ['8 biți', false, 'Ar permite doar 256 de valori.'],
    ['16 biți', false, '16 biți are TPID.'],
    ['3 biți', false, '3 biți are PCP.'],
  ], 'VID = 12 biți.'),
  { id: '2.2-020', topicId: T, sub: '2.2.b', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare câmp al tag-ului 802.1Q cu dimensiunea lui.',
    leftLabel: 'Câmp', rightLabel: 'Dimensiune',
    pairs: [
      { left: 'TPID', right: '16 biți (0x8100)', why: 'Anunță prezența tag-ului.' },
      { left: 'PCP', right: '3 biți', why: 'Prioritate CoS 0–7.' },
      { left: 'DEI', right: '1 bit', why: 'Marchează cadre eligibile la aruncare.' },
      { left: 'VID', right: '12 biți', why: 'VLAN ID 1–4094.' },
    ],
    distractors: [{ text: '32 biți', why: 'Este dimensiunea totală a tag-ului (TPID + TCI), nu a unui câmp.' }],
    explanation: '16 + 3 + 1 + 12 = 32 biți = 4 octeți.' },
  single({ id: '2.2-021' }, '2.2.b', 2, 'Ce valoare are TPID-ul unui tag 802.1Q?', [
    ['0x8100', true, 'Valoarea standard care ocupă locul EtherType-ului.'],
    ['0x0800', false, 'Este EtherType-ul pentru IPv4.'],
    ['0x0806', false, 'Este EtherType-ul pentru ARP.'],
    ['0x86DD', false, 'Este EtherType-ul pentru IPv6.'],
  ], 'TPID = 0x8100.'),
  single({ id: '2.2-022' }, '2.2.b', 2, 'Care este dimensiunea maximă a unui cadru Ethernet cu tag 802.1Q?', [
    ['1522 octeți', true, '1518 + 4 octeți de tag.'],
    ['1518 octeți', false, 'Este maximul fără tag.'],
    ['1500 octeți', false, 'Este MTU-ul (payload-ul), nu dimensiunea cadrului.'],
    ['9000 octeți', false, 'Jumbo frames sunt altceva și nu sunt specifice tag-ului.'],
  ], 'Cu tag: 1522 octeți.'),
  multi({ id: '2.2-023' }, '2.2.b', 2, 'Care afirmații despre 802.1Q sunt adevărate? (alege trei)', [
    ['Standard IEEE deschis', true, 'Spre deosebire de ISL, nu este limitat la Cisco.'],
    ['Cadrele din native VLAN circulă fără tag', true, 'Singurul VLAN fără tag pe un trunk 802.1Q.'],
    ['Switch-ul recalculează FCS-ul când adaugă sau scoate tag-ul', true, 'Conținutul cadrului se schimbă, deci CRC-ul se recalculează.'],
    ['Tag-ul este vizibil pentru PC-urile conectate pe porturi access', false, 'Switch-ul scoate tag-ul la ieșirea pe port access.'],
    ['Tag-ul are 8 octeți', false, 'Are 4 octeți.'],
  ], 'Standard, native fără tag, FCS recalculat.'),
  single({ id: '2.2-024' }, '2.2.b', 2, 'Care este diferența esențială dintre ISL și 802.1Q?', [
    ['ISL este proprietar Cisco și încapsulează cadrul; 802.1Q este standard IEEE și inserează un tag', true, 'ISL adaugă antet de 26 B și FCS de 4 B; 802.1Q inserează 4 B în cadru.'],
    ['ISL este standard IEEE, 802.1Q este proprietar', false, 'Invers.'],
    ['ISL transportă un singur VLAN', false, 'Ambele transportă mai multe VLAN-uri.'],
    ['802.1Q nu suportă prioritate (QoS)', false, 'PCP din tag oferă prioritate.'],
  ], 'ISL = proprietar, învechit; 802.1Q = standard.'),
  { id: '2.2-025', topicId: T, sub: '2.2.b', type: 'order', difficulty: 2,
    stem: 'Ordonează ce se întâmplă cu un cadru de la PC1 (VLAN 10, SW1) spre PC3 (VLAN 10, SW2) printr-un trunk.',
    items: [
      { text: 'PC1 trimite cadrul fără tag pe portul access al SW1', why: 'PC-ul nu știe de VLAN-uri.' },
      { text: 'SW1 asociază cadrul VLAN-ului 10 (după portul de intrare)', why: 'VLAN-ul vine din configurația portului.' },
      { text: 'SW1 inserează tag-ul 802.1Q cu VID 10 și trimite pe trunk', why: 'VLAN 10 nu e native, deci pleacă cu tag.' },
      { text: 'SW2 citește VID 10, scoate tag-ul și îl trimite pe portul access din VLAN 10', why: 'La ieșirea pe port access tag-ul dispare.' },
      { text: 'PC3 primește cadrul fără tag', why: 'Hostul nu vede tag-ul.' },
    ],
    explanation: 'Tag adăugat la ieșirea pe trunk, scos la ieșirea pe access.' },
  single({ id: '2.2-026' }, '2.2.b', 2, 'La ce folosește câmpul PCP din tag-ul 802.1Q?', [
    ['Poartă prioritatea CoS (0–7) a cadrului, pentru QoS', true, 'Vocea folosește de regulă prioritatea 5.'],
    ['Identifică VLAN-ul', false, 'VLAN-ul este în VID.'],
    ['Conține adresa MAC destinație', false, 'MAC-ul destinație este în antet, nu în tag.'],
    ['Marchează protocolul din payload', false, 'Aceasta este rolul EtherType-ului.'],
  ], 'PCP = prioritate/CoS.'),

  // ======================= 2.2.c Native VLAN =======================
  single({ id: '2.2-027' }, '2.2.c', 1, 'Care este native VLAN implicit pe un trunk Cisco și cum circulă cadrele lui?', [
    ['VLAN 1, fără tag', true, 'Cadrele native VLAN circulă netaggate pe un trunk 802.1Q.'],
    ['VLAN 99, cu tag', false, '99 este o valoare uzuală aleasă de administratori, nu cea implicită.'],
    ['VLAN 0, fără tag', false, 'VLAN 0 este rezervat.'],
    ['Nu există native VLAN implicit', false, 'Fiecare trunk are un native VLAN, implicit 1.'],
  ], 'Native implicit = 1, fără tag.'),
  single({ id: '2.2-028' }, '2.2.c', 2, 'Un cadru fără tag sosește pe un port trunk. Cărui VLAN îi este atribuit?', [
    ['Native VLAN-ului portului trunk', true, 'Regula: cadrele netaggate primite pe trunk aparțin native VLAN-ului.'],
    ['VLAN 1 întotdeauna', false, 'Doar dacă native VLAN-ul este 1.'],
    ['Este aruncat', false, 'Nu este aruncat; este atribuit native VLAN-ului.'],
    ['VLAN-ului cu cel mai mic ID din lista allowed', false, 'Nu există o astfel de regulă.'],
  ], 'Netaggat pe trunk ⇒ native VLAN.'),
  single({ id: '2.2-029' }, '2.2.c', 2, 'Ce mesaj de log apare când cele două capete ale unui trunk au native VLAN diferite?', [
    ['%CDP-4-NATIVE_VLAN_MISMATCH', true, 'CDP detectează diferența și o raportează.'],
    ['%LINK-3-UPDOWN: interface down', false, 'Link-ul rămâne up; nepotrivirea e logică, nu fizică.'],
    ['%SYS-5-CONFIG_I', false, 'Anunță doar că s-a modificat configurația.'],
    ['%DTP-5-TRUNKPORTON', false, 'Anunță formarea unui trunk prin DTP, nu o nepotrivire de native.'],
  ], 'NATIVE_VLAN_MISMATCH.'),
  single({ id: '2.2-030' }, '2.2.c', 2, 'SW1 are native VLAN 1, SW2 are native VLAN 99 pe același trunk. Care este efectul principal?', [
    ['Cadrele netaggate ale unui VLAN ajung în alt VLAN, amestecând rețele', true, 'Un cadru netaggat din VLAN 1 este considerat VLAN 99 pe SW2.'],
    ['Trunk-ul se închide', false, 'Link-ul rămâne up.'],
    ['Toate VLAN-urile sunt șterse', false, 'Nepotrivirea nu șterge VLAN-uri.'],
    ['Nu se întâmplă nimic: native VLAN nu contează', false, 'Contează și produce scurgeri între VLAN-uri.'],
  ], 'Mismatch ⇒ scurgere între VLAN-uri.'),
  multi({ id: '2.2-031' }, '2.2.c', 3, 'Care măsuri reduc riscul de VLAN hopping? (alege trei)', [
    ['Folosești un native VLAN dedicat, fără hosturi (de exemplu 999)', true, 'Un atacator nu mai poate fi în native VLAN.'],
    ['Setezi explicit mode access pe porturile utilizatorilor', true, 'Previi switch spoofing prin DTP.'],
    ['Pui nonegotiate pe trunk-uri și shutdown pe porturile nefolosite', true, 'Elimini negocierea și porturile libere.'],
    ['Lași native VLAN 1 și pui utilizatorii în el', false, 'Este exact configurația care permite double tagging.'],
    ['Activezi dynamic desirable pe toate porturile', false, 'Ar facilita switch spoofing.'],
  ], 'Native neutilizat, access explicit, nonegotiate/shutdown.'),
  single({ id: '2.2-032' }, '2.2.c', 3, 'Cum funcționează un atac VLAN hopping prin double tagging?', [
    ['Atacatorul din native VLAN trimite două tag-uri; primul switch scoate tag-ul exterior (native), iar al doilea livrează cadrul în VLAN-ul din tag-ul interior', true, 'Switch-ul scoate doar tag-ul nativ, iar cel interior rămâne.'],
    ['Atacatorul negociază un trunk prin DTP', false, 'Aceasta este switch spoofing.'],
    ['Atacatorul modifică adresa MAC a switch-ului', false, 'Aceasta ține de MAC spoofing.'],
    ['Atacatorul șterge VLAN-ul victimei', false, 'Un utilizator nu poate șterge VLAN-uri fără acces administrativ.'],
  ], 'Double tagging cere atacatorul în native VLAN.'),
  { id: '2.2-033', topicId: T, sub: '2.2.c', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii pentru a configura corect un trunk pe un switch care suportă și ISL.',
    items: [
      { text: 'Creezi VLAN-urile necesare (și VLAN-ul native dedicat)', why: 'Fără VLAN-uri create, traficul lor nu trece.' },
      { text: 'switchport trunk encapsulation dot1q', why: 'Trebuie dat înainte de mode trunk pe platformele cu ISL.' },
      { text: 'switchport mode trunk', why: 'Transformă portul în trunk.' },
      { text: 'switchport trunk native vlan 999 și allowed vlan', why: 'Reglezi native VLAN și VLAN-urile permise.' },
      { text: 'show interfaces trunk', why: 'Verifici rezultatul pe ambele capete.' },
    ],
    explanation: 'VLAN-uri → encapsulation → mode trunk → native/allowed → verificare.' },
  single({ id: '2.2-034' }, '2.2.c', 3, 'Trunk-ul spre un router are native VLAN 99. Ce comandă pe subinterfața VLAN-ului 99 este corectă?', [
    ['encapsulation dot1Q 99 native', true, 'Cuvântul native spune routerului că acele cadre circulă fără tag.'],
    ['encapsulation dot1Q 99', false, 'Fără native, routerul așteaptă tag pentru VLAN 99, dar switch-ul îl trimite netaggat.'],
    ['switchport trunk native vlan 99', false, 'Este comandă de switch, nu de router.'],
    ['encapsulation isl 99', false, 'ISL nu e folosit și nu implementează native VLAN în același mod.'],
  ], 'ROAS: encapsulation dot1Q N native.'),
  single({ id: '2.2-035' }, '2.2.c', 2, 'În show interfaces trunk, pe SW1 apare „Native vlan 1” pentru Gi0/1, iar pe SW2 „Native vlan 99” pentru Gi0/1. Ce faci?', [
    ['Aliniezi native VLAN-ul pe ambele capete, de exemplu switchport trunk native vlan 99', true, 'Valorile trebuie să fie identice.'],
    ['Nimic: sunt diferite intenționat', false, 'Nepotrivirea este eroare.'],
    ['Ștergi VLAN 1', false, 'VLAN 1 nu poate fi șters.'],
    ['Pui portul în shutdown definitiv', false, 'Nu rezolvă problema; pierzi legătura.'],
  ], 'Aliniază native VLAN la ambele capete.'),

  // ======================= CLI și scenarii =======================
  { id: '2.2-036', topicId: T, sub: '2.2.a', type: 'cli', difficulty: 1,
    stem: 'Transformă interfața curentă în trunk.',
    prompt: 'SW1(config-if)#', canonical: 'switchport mode trunk', answers: ['switchport mode trunk', 'sw mo tr'], hint: 'switchport mode ...',
    wrong: [
      { text: 'switchport trunk', why: 'Lipsește cuvântul mode.' },
      { text: 'mode trunk', why: 'Comanda trebuie să înceapă cu switchport.' },
      { text: 'switchport mode dynamic auto', why: 'Nu forțează trunk; așteaptă cererea vecinului.' },
    ],
    explanation: 'switchport mode trunk.' },
  { id: '2.2-037', topicId: T, sub: '2.2.c', type: 'cli', difficulty: 2,
    stem: 'Setează native VLAN-ul trunk-ului curent la 99.',
    prompt: 'SW1(config-if)#', canonical: 'switchport trunk native vlan 99', answers: ['switchport trunk native vlan 99'], hint: 'switchport trunk ...',
    wrong: [
      { text: 'switchport native vlan 99', why: 'Lipsește cuvântul trunk.' },
      { text: 'switchport access vlan 99', why: 'Setează VLAN-ul access, nu cel nativ al trunk-ului.' },
      { text: 'native vlan 99', why: 'Comanda trebuie să înceapă cu switchport trunk.' },
    ],
    explanation: 'switchport trunk native vlan N.' },
  { id: '2.2-038', topicId: T, sub: '2.2.a', type: 'cli', difficulty: 2,
    stem: 'Adaugă VLAN 30 la lista VLAN-urilor permise pe trunk, fără să pierzi lista existentă.',
    prompt: 'SW1(config-if)#', canonical: 'switchport trunk allowed vlan add 30', answers: ['switchport trunk allowed vlan add 30'], hint: 'switchport trunk allowed vlan ...',
    wrong: [
      { text: 'switchport trunk allowed vlan 30', why: 'Înlocuiește lista cu doar VLAN 30.' },
      { text: 'switchport trunk allowed add 30', why: 'Lipsește cuvântul vlan.' },
      { text: 'switchport trunk vlan add 30', why: 'Lipsește cuvântul allowed.' },
    ],
    explanation: 'allowed vlan add N.' },
  { id: '2.2-039', topicId: T, sub: '2.2.a', type: 'cli', difficulty: 1,
    stem: 'Afișează porturile trunk, native VLAN-ul și VLAN-urile permise.',
    prompt: 'SW1#', canonical: 'show interfaces trunk', answers: ['show interfaces trunk', 'sh int trunk', 'show int trunk'], hint: 'show interfaces ...',
    wrong: [
      { text: 'show trunk', why: 'Nu este comandă validă pe IOS clasic.' },
      { text: 'show vlan brief', why: 'Listează porturile access, nu trunk-urile.' },
      { text: 'show interface switchport', why: 'Fără numele portului comanda nu e completă; oricum nu e rezumatul trunk.' },
    ],
    explanation: 'show interfaces trunk.' },
  single({ id: '2.2-040' }, '2.2.a', 3, 'Hosturile din VLAN 20 de pe SW1 și SW2 nu comunică. show interfaces trunk arată pe Gi0/1: „Vlans allowed on trunk: 10,30”. Ce faci?', [
    ['switchport trunk allowed vlan add 20, pe ambele capete dacă e nevoie', true, 'VLAN 20 lipsește din lista permisă; add îl introduce fără să piardă 10 și 30.'],
    ['switchport trunk allowed vlan 20', false, 'Ar înlocui lista și ar tăia 10 și 30.'],
    ['switchport nonegotiate', false, 'DTP nu e cauza; VLAN-ul lipsește din listă.'],
    ['Schimbi native VLAN-ul la 20', false, 'Native VLAN nu rezolvă lipsa VLAN-ului din allowed list.'],
  ], 'Cauză: VLAN 20 lipsește din allowed list; remediere: add 20.'),
];
