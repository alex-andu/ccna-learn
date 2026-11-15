import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.2 Describe characteristics of network topology architectures.
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
const T = '1.2';

export const Q_1_2: Question[] = [
  // ======================= 1.2 — introducere =======================
  {
    id: '1.2-001', topicId: T, sub: '1.2', type: 'single', difficulty: 1,
    stem: 'Prin ce diferă topologia **fizică** de topologia **logică** a unei rețele?',
    options: [
      { id: 'a', text: 'Cea fizică arată cablurile și porturile reale; cea logică arată cum circulă efectiv datele (subrețele, VLAN-uri, căi active)', correct: true, why: 'Exact: fizic poți avea un triunghi de switch-uri, iar logic [[stp|STP]] blochează o latură și traficul urmează un arbore. Cele două diagrame pot arăta foarte diferit.' },
      { id: 'b', text: 'Cea fizică e folosită doar în WAN, iar cea logică doar în LAN', correct: false, why: 'Ambele noțiuni se aplică oricărei rețele. Un WAN MPLS, de exemplu, are o topologie fizică (legăturile la PE-uri) și una logică (oricine-cu-oricine).' },
      { id: 'c', text: 'Sunt sinonime: ambele descriu cablarea', correct: false, why: 'Nu sunt sinonime. Topologia logică descrie fluxul datelor și adresarea, nu cablurile.' },
      { id: 'd', text: 'Cea logică arată doar adresele MAC ale echipamentelor', correct: false, why: 'Adresele MAC sunt un detaliu de nivel 2. Topologia logică include în principal subrețelele IP, VLAN-urile și căile de rutare/comutare active.' },
    ],
    explanation: 'Topologia fizică = „unde sunt cablurile”. Topologia logică = „pe unde merg pachetele”. La examen pot apărea ambele, iar `show cdp neighbors` te ajută să reconstruiești topologia fizică.',
  },
  {
    id: '1.2-002', topicId: T, sub: '1.2', type: 'single', difficulty: 2,
    stem: 'O companie vrea să lege **6 site-uri** într-un [[full-mesh|full mesh]] de legături punct-la-punct. Câte legături sunt necesare?',
    options: [
      { id: 'a', text: '15', correct: true, why: 'n(n−1)/2 = 6 × 5 / 2 = 15. Fiecare site are 5 legături, dar fiecare legătură e numărată o singură dată.' },
      { id: 'b', text: '30', correct: false, why: '30 = 6 × 5 — ai numărat fiecare legătură de două ori (o dată de la fiecare capăt). Trebuie împărțit la 2.' },
      { id: 'c', text: '5', correct: false, why: '5 = n − 1 este numărul de legături dintr-un [[hub-and-spoke|hub-and-spoke]] cu 6 site-uri, nu dintr-un full mesh.' },
      { id: 'd', text: '6', correct: false, why: '6 legături ar forma un inel (fiecare site legat de doi vecini), nu un full mesh.' },
    ],
    explanation: 'Formula de reținut: full mesh cu n noduri = n(n−1)/2 legături. 4 → 6, 5 → 10, 6 → 15, 10 → 45. Creșterea pătratică este motivul pentru care full mesh-ul se folosește doar între puține noduri.',
  },
  {
    id: '1.2-003', topicId: T, sub: '1.2', type: 'single', difficulty: 2,
    stem: 'Care este principalul avantaj al unui design de campus **ierarhic** (pe straturi) față de o rețea „plată” în care switch-urile sunt legate la întâmplare?',
    options: [
      { id: 'a', text: 'Scalează previzibil și limitează domeniile de defectare: fiecare strat are un rol clar, iar o problemă locală nu se propagă în toată rețeaua', correct: true, why: 'Modularitatea permite adăugarea de blocuri noi fără reproiectare, iar granița L2/L3 de la distribution oprește buclele și broadcast-urile ([[failure-domain|failure domain]] mic).' },
      { id: 'b', text: 'Elimină nevoia de redundanță', correct: false, why: 'Dimpotrivă: designul ierarhic prevede redundanță la fiecare strat (perechi de distribution/core, uplink-uri duble).' },
      { id: 'c', text: 'Permite folosirea unui singur switch pentru toată clădirea', correct: false, why: 'Un singur switch ar fi punct unic de defectare și n-ar avea porturi suficiente. Ierarhia presupune mai multe switch-uri organizate pe straturi.' },
      { id: 'd', text: 'Face inutilă rutarea IP', correct: false, why: 'Rutarea rămâne necesară între VLAN-uri și spre WAN/Internet; în designul ierarhic ea are loc de obicei la distribution și core.' },
    ],
    explanation: 'Cele trei argumente pentru ierarhie: scalabilitate (adaugi blocuri), predictibilitate (știi pe unde merge traficul) și izolarea defectelor. Toate se regăsesc în two-tier, three-tier și, în datacenter, în spine-leaf.',
  },
  {
    id: '1.2-004', topicId: T, sub: '1.2', type: 'cli', difficulty: 2,
    stem: 'Primești o rețea nedocumentată. Pe un switch Cisco, ce comandă îți arată echipamentele Cisco conectate direct (nume, interfața locală, platforma, portul de la celălalt capăt), ca să poți desena topologia?',
    prompt: 'ASW1#', canonical: 'show cdp neighbors',
    answers: ['show cdp neighbors', 'show cdp neighbor', 'sh cdp nei', 'sh cdp neighbors', 'show cdp nei', 'sh cdp neighbor', 'show cdp neighbors detail', 'sh cdp nei det'],
    hint: 'protocolul Cisco de descoperire a vecinilor',
    wrong: [
      { text: 'show ip route', why: 'Arată tabela de rutare (rețele IP și next-hop-uri), nu vecinii fizici direcți.' },
      { text: 'show mac address-table', why: 'Arată ce adrese MAC au fost învățate pe ce port, dar nu numele și platforma echipamentului vecin.' },
      { text: 'show interfaces status', why: 'Arată starea, viteza și VLAN-ul porturilor locale, fără informații despre cine e la celălalt capăt.' },
    ],
    explanation: '[[cdp|CDP]] (Cisco Discovery Protocol) rulează implicit pe echipamentele Cisco. `show cdp neighbors` dă tabelul rezumat, iar `show cdp neighbors detail` adaugă adresa IP și versiunea IOS. Echivalentul standard este [[lldp|LLDP]] (`show lldp neighbors`, după `lldp run`).',
  },

  // ======================= 1.2.b — three-tier =======================
  {
    id: '1.2-005', topicId: T, sub: '1.2.b', type: 'single', difficulty: 1,
    stem: 'Într-un design de campus ierarhic, la ce strat se conectează PC-urile, telefoanele IP și access point-urile?',
    options: [
      { id: 'a', text: '[[access-layer|Access]]', correct: true, why: 'Stratul de access este „marginea” rețelei: switch-uri cu multe porturi, de obicei cu PoE, la care se leagă dispozitivele finale.' },
      { id: 'b', text: '[[distribution-layer|Distribution]]', correct: false, why: 'Distribution agregă switch-urile de access; în mod normal nu are dispozitive finale conectate direct.' },
      { id: 'c', text: '[[core-layer|Core]]', correct: false, why: 'Core-ul leagă blocurile de distribuție între ele și trebuie să fie cât mai simplu și mai rapid — niciodată nu conectezi PC-uri aici.' },
      { id: 'd', text: 'Spine', correct: false, why: 'Spine este un strat al arhitecturii de datacenter spine-leaf, iar acolo dispozitivele finale (serverele) se leagă la leaf, nu la spine.' },
    ],
    explanation: 'Access = dispozitive finale (PoE, VLAN, port security). Distribution = agregare + granița L2/L3 + politici. Core = transport rapid între blocuri.',
  },
  {
    id: '1.2-006', topicId: T, sub: '1.2.b', type: 'single', difficulty: 2,
    stem: 'La ce strat se află **de obicei** granița dintre nivelul 2 și nivelul 3 (SVI-urile care sunt default gateway pentru VLAN-urile utilizatorilor)?',
    options: [
      { id: 'a', text: 'Distribution', correct: true, why: 'Switch-urile multilayer de distribution găzduiesc [[svi|SVI]]-urile, rulează [[fhrp|FHRP]] și rutează spre core. Sub ele, spre access, totul e nivel 2.' },
      { id: 'b', text: 'Access', correct: false, why: 'Există și designuri „routed access” (L3 până la access), dar acesta NU este cazul tipic descris la CCNA. Varianta clasică: access = L2.' },
      { id: 'c', text: 'Core', correct: false, why: 'Core-ul primește deja legături L3 de la distribution; dacă granița ar fi în core, domeniile L2 s-ar întinde peste toată clădirea — exact ce designul ierarhic încearcă să evite.' },
      { id: 'd', text: 'Pe routerul de Internet', correct: false, why: 'Routerul de margine leagă campusul de WAN/Internet; nu este gateway-ul VLAN-urilor interne într-un campus ierarhic.' },
    ],
    explanation: 'Distribution este „punctul de politică”: aici se termină VLAN-urile, se aplică ACL-urile și QoS-ul, se sumarizează rutele. Astfel, problemele L2 (bucle, furtuni de broadcast) rămân închise într-un bloc.',
  },
  {
    id: '1.2-007', topicId: T, sub: '1.2.b', type: 'single', difficulty: 2,
    stem: 'Ce **NU** ar trebui să facă stratul [[core-layer|core]] într-un campus three-tier?',
    options: [
      { id: 'a', text: 'Filtrare complexă cu ACL-uri și alte prelucrări costisitoare ale pachetelor', correct: true, why: 'Regula de aur: core-ul transportă cât mai repede și converge rapid. Politicile se aplică mai jos, la distribution, ca să nu încetinească întreaga rețea.' },
      { id: 'b', text: 'Să aibă legături redundante spre fiecare distribution', correct: false, why: 'Redundanța este obligatorie în core — o cădere aici ar afecta tot campusul.' },
      { id: 'c', text: 'Să comute/ruteze trafic la viteză mare', correct: false, why: 'Exact acesta este rolul core-ului.' },
      { id: 'd', text: 'Să lege între ele blocurile de distribuție', correct: false, why: 'Acesta este motivul existenței core-ului: fiecare bloc se leagă la core în loc să se lege de toate celelalte blocuri.' },
    ],
    explanation: 'Core = „autostradă”: rapid, redundant, simplu. Fără ACL-uri complexe, fără dispozitive finale, fără inspecție de trafic.',
  },
  {
    id: '1.2-008', topicId: T, sub: '1.2.b', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare funcție cu stratul campusului la care se realizează de obicei.',
    leftLabel: 'Funcție', rightLabel: 'Strat',
    pairs: [
      { left: 'Alimentarea telefoanelor IP prin PoE și port security', right: 'Access', why: 'Funcțiile „de margine”, aplicate per port utilizator, sunt la access.' },
      { left: 'SVI-uri ca default gateway, FHRP și ACL-uri între VLAN-uri', right: 'Distribution', why: 'Distribution este granița L2/L3 și punctul de politică.' },
      { left: 'Transport rapid între clădiri, fără politici complexe', right: 'Core', why: 'Core-ul leagă blocurile de distribuție și trebuie să fie simplu și rapid.' },
    ],
    distractors: [{ text: 'Leaf', why: 'Leaf este stratul de acces al arhitecturii de datacenter spine-leaf, nu un strat al campusului three-tier.' }],
    explanation: 'Rolurile straturilor sunt aceleași în two-tier și three-tier; diferența e doar că în two-tier distribution și core sunt aceleași switch-uri.',
  },
  {
    id: '1.2-009', topicId: T, sub: '1.2.b', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații descriu corect stratul de **distribution**?',
    options: [
      { id: 'a', text: 'Agregă uplink-urile de la mai multe switch-uri de access', correct: true, why: 'De aceea se mai numește și stratul de agregare (aggregation layer).' },
      { id: 'b', text: 'Aplică politici: ACL-uri, QoS, sumarizare de rute', correct: true, why: 'Distribution este „punctul de politică” — locul în care traficul dintre VLAN-uri și spre core este controlat.' },
      { id: 'c', text: 'Este locul unde se conectează direct serverele și PC-urile', correct: false, why: 'Dispozitivele finale se conectează la access (în campus) sau la leaf (în datacenter).' },
      { id: 'd', text: 'Există doar în designul three-tier', correct: false, why: 'Funcțiile de distribution există și în two-tier, doar că sunt contopite cu core-ul („collapsed core”).' },
    ],
    explanation: 'Distribution: agregare + granița L2/L3 + politici + redundanța gateway-ului (FHRP). De obicei o pereche de switch-uri multilayer per bloc.',
  },
  {
    id: '1.2-010', topicId: T, sub: '1.2.b', type: 'single', difficulty: 3,
    stem: 'Un campus two-tier crește de la un bloc de distribuție la **cinci** (cinci clădiri, fiecare cu perechea ei de distribution). De ce ar adăuga proiectantul acum un strat de core separat?',
    options: [
      { id: 'a', text: 'Fără core, blocurile trebuie legate între ele aproape în full mesh, iar numărul de legături crește cu pătratul numărului de blocuri; cu core, fiecare bloc nou are nevoie doar de legăturile spre core', correct: true, why: '5 blocuri în full mesh = 5·4/2 = 10 conexiuni bloc-la-bloc (fiecare cu mai multe cabluri, pentru redundanță). Cu core: 5 conexiuni, iar al 6-lea bloc adaugă doar 1, nu 5.' },
      { id: 'b', text: 'Pentru că switch-urile de access nu pot fi legate la distribution în two-tier', correct: false, why: 'În two-tier access-ul se leagă chiar la distribution/core-ul comun. Problema e legătura dintre blocuri, nu legătura access–distribution.' },
      { id: 'c', text: 'Pentru că two-tier nu suportă VLAN-uri', correct: false, why: 'VLAN-urile funcționează la fel în ambele designuri.' },
      { id: 'd', text: 'Pentru că STP nu funcționează cu mai mult de două switch-uri', correct: false, why: 'STP funcționează cu oricâte switch-uri. Motivul adăugării core-ului este scalarea legăturilor dintre blocuri, nu o limită STP.' },
    ],
    explanation: 'Regula practică: un singur bloc (o clădire) → two-tier e suficient. Mai multe blocuri sau clădiri (frecvent citat: de la ≈3 în sus) → un core separat simplifică cablarea, scalează liniar și izolează defectele.',
  },

  // ======================= 1.2.a — two-tier =======================
  {
    id: '1.2-011', topicId: T, sub: '1.2.a', type: 'single', difficulty: 1,
    stem: 'Ce alt nume are designul de campus **two-tier**?',
    options: [
      { id: 'a', text: '[[collapsed-core|Collapsed core]]', correct: true, why: 'Core-ul este „comprimat” în stratul de distribution: aceleași switch-uri fac ambele roluri.' },
      { id: 'b', text: 'Spine-leaf', correct: false, why: 'Spine-leaf are tot două straturi, dar este o arhitectură de datacenter cu reguli proprii (fiecare leaf la fiecare spine, L3 + ECMP). Nu este sinonim cu two-tier-ul de campus.' },
      { id: 'c', text: 'Hub-and-spoke', correct: false, why: 'Hub-and-spoke este o topologie WAN (filiale legate la un site central).' },
      { id: 'd', text: 'Extended core', correct: false, why: 'Nu este un termen de design Cisco. Termenul corect este collapsed core.' },
    ],
    explanation: 'Two-tier = access + core/distribution combinat = collapsed core. Three-tier = access + distribution + core separate.',
  },
  {
    id: '1.2-012', topicId: T, sub: '1.2.a', type: 'single', difficulty: 1,
    stem: 'Pentru ce tip de rețea este cel mai potrivit designul two-tier (collapsed core)?',
    options: [
      { id: 'a', text: 'O clădire sau un sediu mic/mediu, cu un singur bloc de distribuție', correct: true, why: 'Aici un core separat ar fi doar cost și complexitate în plus: o pereche de switch-uri centrale ajunge pentru agregare și transport.' },
      { id: 'b', text: 'Un datacenter cu mii de servere și trafic predominant east-west', correct: false, why: 'Pentru datacentere moderne se folosește spine-leaf, optimizat pentru trafic server ↔ server.' },
      { id: 'c', text: 'Un campus universitar cu 20 de clădiri', correct: false, why: 'Cu multe blocuri de distribuție, un core separat (three-tier) scalează mult mai bine.' },
      { id: 'd', text: 'Legătura dintre sediu și 50 de filiale', correct: false, why: 'Aceasta este o problemă de WAN (hub-and-spoke, MPLS, SD-WAN), nu de design de campus.' },
    ],
    explanation: 'Two-tier = mai puține echipamente, mai ieftin, mai simplu de administrat — ideal când întreaga rețea încape într-un bloc.',
  },
  {
    id: '1.2-013', topicId: T, sub: '1.2.a', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ sunt avantaje ale designului two-tier față de three-tier?',
    options: [
      { id: 'a', text: 'Cost mai mic — sunt necesare mai puține switch-uri', correct: true, why: 'Lipsește perechea de switch-uri de core (de obicei cele mai scumpe din rețea).' },
      { id: 'b', text: 'Administrare mai simplă', correct: true, why: 'Mai puține echipamente, mai puține legături, mai puține locuri de configurat și depanat.' },
      { id: 'c', text: 'Scalează mai bine la zeci de clădiri', correct: false, why: 'Invers: la multe blocuri legăturile dintre ele cresc pătratic. Three-tier scalează mai bine.' },
      { id: 'd', text: 'Elimină complet nevoia de STP', correct: false, why: 'Two-tier are tot legături redundante L2 între access și distribution, deci STP (sau EtherChannel/L3) rămâne necesar.' },
    ],
    explanation: 'Compromisul two-tier: simplu și ieftin, dar limitat la un bloc. Three-tier: mai scump, dar scalează liniar.',
  },
  {
    id: '1.2-014', topicId: T, sub: '1.2.a', type: 'single', difficulty: 2,
    stem: 'Într-un campus two-tier, fiecare switch de access are câte un uplink spre **fiecare** dintre cele două switch-uri core/distribution. Cum se numește această practică și de ce se folosește?',
    options: [
      { id: 'a', text: 'Dual-homing (uplink-uri redundante) — dacă un switch central sau un cablu cade, access-ul rămâne conectat prin celălalt', correct: true, why: 'Este forma de redundanță standard în campus. Cu L2 clasic, STP blochează unul dintre uplink-uri; cu EtherChannel multi-chassis sau uplink-uri L3, ambele pot fi active.' },
      { id: 'b', text: 'Full mesh între switch-urile de access', correct: false, why: 'Switch-urile de access nu se leagă între ele; fiecare se leagă doar „în sus”.' },
      { id: 'c', text: 'Oversubscription', correct: false, why: 'Oversubscription este raportul dintre lățimea de bandă a porturilor și a uplink-urilor — o măsură, nu o practică de cablare.' },
      { id: 'd', text: 'Daisy-chaining (legare în lanț)', correct: false, why: 'Daisy-chain înseamnă switch legat de switch, în serie — exact opusul unui design ierarhic redundant.' },
    ],
    explanation: 'Fiecare access cu două uplink-uri spre doi distribution diferiți = topologie fizică în stea dublă. Este un exemplu de partial mesh între straturi.',
  },

  // ======================= 1.2.c — spine-leaf =======================
  {
    id: '1.2-015', topicId: T, sub: '1.2.c', type: 'single', difficulty: 1,
    stem: 'Într-o arhitectură [[spine-leaf|spine-leaf]], la ce se conectează fiecare switch leaf?',
    options: [
      { id: 'a', text: 'La fiecare switch spine', correct: true, why: 'Regula de bază: fiecare leaf are câte un uplink spre fiecare spine. Între straturi există deci un full mesh.' },
      { id: 'b', text: 'La leaf-urile vecine și la un singur spine', correct: false, why: 'Leaf-urile nu se leagă între ele. Iar legătura la un singur spine ar distruge simetria (căile n-ar mai avea același cost).' },
      { id: 'c', text: 'Doar la un switch de core', correct: false, why: 'Spine-leaf nu are strat de core: spine-urile sunt „coloana vertebrală”.' },
      { id: 'd', text: 'La alte leaf-uri, într-un inel', correct: false, why: 'Un inel ar crea căi de lungimi diferite — exact ce spine-leaf vrea să evite.' },
    ],
    explanation: 'Leaf ↔ fiecare spine: da. Leaf ↔ leaf: nu. Spine ↔ spine: nu. Servere ↔ leaf: da. Servere ↔ spine: nu.',
  },
  {
    id: '1.2-016', topicId: T, sub: '1.2.c', type: 'single', difficulty: 1,
    stem: 'Unde se conectează serverele, storage-ul și firewall-urile într-un datacenter spine-leaf?',
    options: [
      { id: 'a', text: 'La switch-urile leaf', correct: true, why: 'Leaf-urile sunt stratul de acces al fabric-ului. Chiar și ieșirea spre WAN/Internet se face printr-un „border leaf”.' },
      { id: 'b', text: 'La switch-urile spine', correct: false, why: 'Spine-urile se leagă doar la leaf-uri. Dacă ai pune un server pe spine, traficul lui n-ar mai avea același număr de hopuri ca restul.' },
      { id: 'c', text: 'Direct între ele, fără switch', correct: false, why: 'Serverele se leagă la rețea prin switch-uri leaf.' },
      { id: 'd', text: 'La un strat de distribution separat', correct: false, why: 'Spine-leaf nu are strat de distribution — are doar două straturi.' },
    ],
    explanation: 'Tot ce nu e spine se conectează la un leaf: servere, storage, firewall-uri, load balancere, routere de margine (border leaf).',
  },
  {
    id: '1.2-017', topicId: T, sub: '1.2.c', type: 'single', difficulty: 2,
    stem: 'Într-un fabric spine-leaf cu 4 spine-uri și 20 de leaf-uri, câte switch-uri traversează traficul de la un server de pe Leaf3 la un server de pe Leaf17?',
    options: [
      { id: 'a', text: '3 (leaf → spine → leaf)', correct: true, why: 'Orice server de pe un leaf ajunge la orice server de pe alt leaf prin exact un spine. Numărul de switch-uri e mereu 3, oricare ar fi perechea de leaf-uri.' },
      { id: 'b', text: 'Depinde de distanța dintre Leaf3 și Leaf17', correct: false, why: 'Nu există „distanță” între leaf-uri — toate sunt la același nivel, la un spine distanță. Predictibilitatea este principalul avantaj.' },
      { id: 'c', text: '5 (leaf → spine → spine → spine → leaf)', correct: false, why: 'Spine-urile nu sunt legate între ele, deci traficul nu poate trece de la un spine la altul.' },
      { id: 'd', text: '2 (leaf → leaf)', correct: false, why: 'Leaf-urile nu au legături directe între ele.' },
    ],
    explanation: 'Hop count egal și latență previzibilă pentru orice pereche de servere — de aceea spine-leaf e ideal pentru traficul [[east-west|east-west]]. În plus, există 4 căi de cost egal (una prin fiecare spine).',
  },
  {
    id: '1.2-018', topicId: T, sub: '1.2.c', type: 'single', difficulty: 2,
    stem: 'De ce au înlocuit datacenterele designul three-tier clasic (access/aggregation/core) cu spine-leaf?',
    options: [
      { id: 'a', text: 'Traficul a devenit predominant east-west (server ↔ server), iar în three-tier acesta avea căi de lungimi diferite și legături blocate de STP', correct: true, why: 'Virtualizarea, microserviciile și replicarea storage-ului au mutat majoritatea traficului între servere. Spine-leaf cu L3 + ECMP oferă hopuri egale și folosește toate legăturile.' },
      { id: 'b', text: 'Spine-leaf folosește mai puține cabluri decât three-tier', correct: false, why: 'De fapt folosește multe cabluri (fiecare leaf la fiecare spine). Avantajul nu e economia de cabluri.' },
      { id: 'c', text: 'Three-tier nu suporta Ethernet de 10 Gbps', correct: false, why: 'Viteza legăturilor nu ține de arhitectură — three-tier poate folosi orice viteză. Problema era tiparul de trafic și STP-ul.' },
      { id: 'd', text: 'Pentru că serverele nu pot folosi VLAN-uri', correct: false, why: 'Serverele folosesc VLAN-uri (sau VXLAN) în ambele arhitecturi.' },
    ],
    explanation: 'Three-tier a fost gândit pentru trafic [[north-south|north-south]] (client ↔ server). Când traficul a devenit east-west, au contat: hopuri egale, toate legăturile active ([[ecmp|ECMP]]) și scalare orizontală (adaugi spine-uri sau leaf-uri).',
  },
  {
    id: '1.2-019', topicId: T, sub: '1.2.c', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre spine-leaf sunt corecte?',
    options: [
      { id: 'a', text: 'Leaf-urile nu sunt conectate direct între ele', correct: true, why: 'Orice trafic leaf ↔ leaf trece printr-un spine, ceea ce păstrează hop count-ul egal.' },
      { id: 'b', text: 'Legăturile leaf–spine sunt de obicei L3, iar ECMP permite folosirea tuturor simultan', correct: true, why: 'Fără STP pe legăturile fabric-ului, nicio legătură nu e blocată: un leaf cu 4 spine are 4 căi active.' },
      { id: 'c', text: 'Spine-urile sunt legate între ele în full mesh', correct: false, why: 'Spine-urile nu se leagă între ele. Full mesh există doar între straturi (fiecare leaf cu fiecare spine).' },
      { id: 'd', text: 'Este arhitectura recomandată pentru rețeaua de acces a unui campus de birouri', correct: false, why: 'Pentru campus se folosesc two-tier sau three-tier. Spine-leaf este arhitectura de datacenter.' },
    ],
    explanation: 'Mnemonic: „fiecare frunză atinge fiecare coloană; frunzele nu se ating între ele; coloanele nici atât”.',
  },
  {
    id: '1.2-020', topicId: T, sub: '1.2.c', type: 'single', difficulty: 2,
    stem: 'Un leaf are 48 de porturi de 10 Gbps spre servere și 6 uplink-uri de 40 Gbps spre spine-uri. Care este raportul de [[oversubscription|oversubscription]]?',
    options: [
      { id: 'a', text: '2 : 1', correct: true, why: '48 × 10 = 480 Gbps în jos; 6 × 40 = 240 Gbps în sus; 480 / 240 = 2 : 1.' },
      { id: 'b', text: '8 : 1', correct: false, why: '8 = 48 / 6 — ai împărțit numărul de porturi, fără să ții cont de viteze. Raportul se calculează pe lățimea de bandă.' },
      { id: 'c', text: '1 : 2', correct: false, why: 'Raportul se scrie „jos : sus”. 1 : 2 ar însemna că uplink-urile au de două ori mai multă capacitate decât porturile.' },
      { id: 'd', text: '4 : 1', correct: false, why: '4 : 1 ar fi cu doar 3 uplink-uri de 40 Gbps (120 Gbps).' },
    ],
    explanation: 'Oversubscription = (porturi × viteză) / (uplink-uri × viteză). 1 : 1 = non-blocking. În spine-leaf, raportul scade adăugând spine-uri (mai multe uplink-uri per leaf).',
  },
  {
    id: '1.2-021', topicId: T, sub: '1.2.c', type: 'single', difficulty: 2,
    stem: 'Leaf-urile dintr-un fabric spine-leaf au oversubscription prea mare. Ce soluție este specifică acestei arhitecturi?',
    options: [
      { id: 'a', text: 'Adaugi un spine nou și legi fiecare leaf la el', correct: true, why: 'Fiecare spine nou adaugă un uplink la fiecare leaf și încă o cale ECMP. Scalarea se face orizontal (scale-out), fără reproiectare.' },
      { id: 'b', text: 'Legi leaf-urile între ele direct', correct: false, why: 'Ar încălca regula de bază: hop count-ul n-ar mai fi egal, iar traficul ar putea crea bucle sau căi asimetrice.' },
      { id: 'c', text: 'Adaugi un strat de core deasupra spine-urilor', correct: false, why: 'Un al treilea strat ar transforma fabric-ul într-un design multi-tier și ar adăuga hopuri. Pentru capacitate, soluția standard este un spine în plus.' },
      { id: 'd', text: 'Activezi STP ca să echilibreze traficul', correct: false, why: 'STP blochează legăturile redundante — ar reduce capacitatea, nu ar crește-o.' },
    ],
    explanation: 'Spine-leaf scalează pe două axe: mai multe spine-uri = mai multă lățime de bandă între leaf-uri; mai multe leaf-uri = mai multe porturi pentru servere.',
  },
  {
    id: '1.2-022', topicId: T, sub: '1.2.c', type: 'single', difficulty: 1,
    stem: 'Ce înseamnă trafic **[[east-west|east-west]]** într-un datacenter?',
    options: [
      { id: 'a', text: 'Trafic între servere din același datacenter', correct: true, why: 'Pe diagrame serverele sunt desenate unul lângă altul, deci traficul dintre ele „merge lateral”: de exemplu serverul web care interoghează baza de date.' },
      { id: 'b', text: 'Trafic între utilizatori și datacenter (sau Internet)', correct: false, why: 'Acela este traficul north-south: intră și iese din datacenter, „vertical” pe diagramă.' },
      { id: 'c', text: 'Trafic între două datacentere din țări diferite', correct: false, why: 'Acela se numește de obicei trafic DCI (Data Center Interconnect) și trece prin WAN.' },
      { id: 'd', text: 'Trafic de management (SSH, SNMP)', correct: false, why: 'Managementul este o categorie de trafic după scop, nu după direcție.' },
    ],
    explanation: 'North-south = client ↔ server. East-west = server ↔ server. În datacenterele moderne domină east-west.',
  },
  {
    id: '1.2-023', topicId: T, sub: '1.2.c', type: 'single', difficulty: 2,
    stem: 'Ce permite [[ecmp|ECMP]] într-un fabric spine-leaf?',
    options: [
      { id: 'a', text: 'Folosirea simultană a mai multor căi de cost egal spre aceeași destinație, împărțind fluxurile între ele', correct: true, why: 'Tabela de rutare a unui leaf păstrează câte un next-hop prin fiecare spine pentru același prefix. Fluxurile se distribuie prin hash, deci toate legăturile transportă trafic.' },
      { id: 'b', text: 'Blocarea legăturilor redundante pentru a preveni buclele', correct: false, why: 'Acesta este STP — tocmai ce ECMP evită: la L3 nu există bucle de nivel 2 care să necesite blocarea porturilor.' },
      { id: 'c', text: 'Criptarea traficului dintre leaf și spine', correct: false, why: 'ECMP este un mecanism de rutare, nu de securitate.' },
      { id: 'd', text: 'Alocarea automată a adreselor IP pentru servere', correct: false, why: 'Aceea este funcția DHCP.' },
    ],
    explanation: 'ECMP + legături L3 = toate legăturile active, failover rapid (dacă un spine cade, se pierde doar 1/N din capacitate). Pe IOS, OSPF instalează implicit până la 4 căi egale.',
  },
  {
    id: '1.2-024', topicId: T, sub: '1.2.c', type: 'cli', difficulty: 2,
    stem: 'Pe un switch multilayer (3650) care joacă rolul de leaf, vrei ca portul `Gi1/0/23` spre spine să devină un port **routed** (L3), pe care să poți pune o adresă IP. Ce comandă dai în modul de configurare al interfeței?',
    prompt: 'LEAF1(config-if)#', canonical: 'no switchport',
    answers: ['no switchport', 'no sw', 'no switchp'],
    hint: 'negi faptul că portul este un port de switch',
    wrong: [
      { text: 'switchport mode routed', why: 'Nu există modul `routed` pentru `switchport mode` (modurile sunt access, trunk, dynamic). Portul devine routed prin negarea lui `switchport`.' },
      { text: 'ip routing', why: '`ip routing` se dă în modul global și activează rutarea pe întregul switch. Nu transformă un port anume în port L3.' },
      { text: 'interface vlan 1', why: 'Creează/intră într-un SVI (interfață virtuală de VLAN), nu face portul fizic routed.' },
    ],
    explanation: 'Pe switch-urile multilayer Cisco: `ip routing` (global) + `no switchport` (pe interfață) + `ip address …`. Așa se construiesc legăturile L3 leaf–spine și distribution–core. Configurarea detaliată ține de topicurile 1.6 și 3.x.',
  },
  {
    id: '1.2-025', topicId: T, sub: '1.2.c', type: 'cli', difficulty: 3,
    stem: 'Vrei să demonstrezi că, într-un campus L2 cu uplink-uri redundante, unele legături **nu** transportă trafic. Ce comandă îți arată rolul și starea fiecărui port (de ex. `Altn BLK`) din punctul de vedere al STP?',
    prompt: 'ASW1#', canonical: 'show spanning-tree',
    answers: ['show spanning-tree', 'sh spanning-tree', 'show span', 'sh span', 'show spanning-tree vlan 1', 'sh spanning-tree vlan 1', 'show spanning-tree brief', 'sh span vlan 1'],
    hint: 'numele protocolului care previne buclele L2',
    wrong: [
      { text: 'show cdp neighbors', why: 'CDP îți arată vecinii, inclusiv legăturile blocate — dar nu îți spune care port este blocat de STP.' },
      { text: 'show interfaces status', why: 'Un port blocat de STP apare tot `connected` aici; blocarea este logică, nu fizică.' },
      { text: 'show ip interface brief', why: 'Arată starea L1/L2 (up/up) și adresele IP, nu rolurile STP.' },
    ],
    explanation: 'Un port `Altn BLK` este o legătură fizic perfectă, dar nefolosită. Această „risipă” de bandă e unul dintre motivele pentru care datacenterele au trecut la spine-leaf cu L3 + ECMP. STP este detaliat în topicul 2.5.',
  },

  // ======================= 1.2.d — WAN =======================
  {
    id: '1.2-026', topicId: T, sub: '1.2.d', type: 'single', difficulty: 1,
    stem: 'Într-un WAN [[hub-and-spoke|hub-and-spoke]], cum ajunge traficul de la Filiala 1 la Filiala 2?',
    options: [
      { id: 'a', text: 'Prin hub (sediul central): Filiala 1 → hub → Filiala 2', correct: true, why: 'Spoke-urile au legătură doar cu hub-ul, așa că traficul dintre ele trece prin hub — latență în plus și încărcare pe hub.' },
      { id: 'b', text: 'Direct, pe o legătură Filiala 1 ↔ Filiala 2', correct: false, why: 'Într-un hub-and-spoke pur nu există legături spoke ↔ spoke. Asta ar fi un (partial) mesh.' },
      { id: 'c', text: 'Nu poate ajunge deloc', correct: false, why: 'Poate, dar indirect, prin hub. Filtrarea traficului dintre filiale ar fi o politică separată.' },
      { id: 'd', text: 'Prin Internet, fără să treacă prin hub', correct: false, why: 'Asta ar presupune un tunel spoke-to-spoke (ex. DMVPN faza 2/3) — o extensie, nu hub-and-spoke-ul clasic.' },
    ],
    explanation: 'Hub-and-spoke: n − 1 legături, politici centralizate, dar hub-ul este punct unic de defectare și gâtuire. De aceea hub-ul are adesea legături și routere duble.',
  },
  {
    id: '1.2-027', topicId: T, sub: '1.2.d', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare variantă de conectare la Internet cu descrierea ei.',
    leftLabel: 'Descriere', rightLabel: 'Variantă',
    pairs: [
      { left: 'O singură legătură la un singur ISP', right: 'Single-homed', why: 'Nicio redundanță: orice defect pe legătură, router sau ISP întrerupe conexiunea.' },
      { left: 'Două legături la același ISP', right: 'Dual-homed', why: 'Protejează la căderea unei legături/unui router, dar nu la căderea ISP-ului.' },
      { left: 'Câte o legătură la doi ISP diferiți', right: 'Multihomed', why: 'Supraviețuiește căderii unui ISP întreg.' },
      { left: 'Câte două legături la fiecare din doi ISP', right: 'Dual-multihomed', why: 'Redundanță maximă: legături, routere și ISP-uri duble.' },
    ],
    distractors: [{ text: 'Full mesh', why: 'Full mesh descrie legături între site-urile proprii (fiecare cu fiecare), nu modul de conectare la ISP.' }],
    explanation: '„Dual” = două legături; „multi” = mai mulți ISP. Combinația „dual-multi” = două legături la fiecare din mai mulți ISP.',
  },
  {
    id: '1.2-028', topicId: T, sub: '1.2.d', type: 'single', difficulty: 2,
    stem: 'O companie folosește serviciul [[mpls|MPLS]] L3VPN al unui operator. Ce vede routerul companiei (CE) din rețeaua MPLS?',
    options: [
      { id: 'a', text: 'Doar routerul PE la care este conectat, cu care schimbă rute IP (static, OSPF, EIGRP sau BGP)', correct: true, why: 'CE-ul trimite pachete IP normale; etichetele MPLS sunt adăugate și scoase de PE-uri. Interiorul rețelei providerului (routerele P) este invizibil pentru client.' },
      { id: 'b', text: 'Toate routerele P din interiorul rețelei operatorului', correct: false, why: 'Routerele P sunt interne operatorului; clientul nu are adiacențe cu ele.' },
      { id: 'c', text: 'Trebuie să eticheteze singur pachetele cu MPLS', correct: false, why: 'În L3VPN, etichetarea o face PE-ul. CE-ul nu are nevoie de MPLS.' },
      { id: 'd', text: 'Un singur cablu fizic până la fiecare filială', correct: false, why: 'Fiecare site are o singură legătură la PE-ul local; conectivitatea între toate site-urile o asigură operatorul.' },
    ],
    explanation: 'MPLS L3VPN: conectivitate oricine-cu-oricine, QoS posibil, rutare separată per client (VRF pe PE). Roluri: CE (client) – PE (marginea providerului) – P (interiorul providerului).',
  },
  {
    id: '1.2-029', topicId: T, sub: '1.2.d', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare serviciu [[metro-ethernet|Metro Ethernet]] cu topologia logică pe care o oferă.',
    leftLabel: 'Serviciu', rightLabel: 'Topologie',
    pairs: [
      { left: 'E-Line', right: 'Point-to-point', why: 'E-Line leagă exact două site-uri — echivalentul Ethernet al unei linii închiriate.' },
      { left: 'E-LAN', right: 'Full mesh (oricine cu oricine)', why: 'E-LAN pune toate site-urile în același domeniu Ethernet; fiecare poate vorbi direct cu fiecare.' },
      { left: 'E-Tree', right: 'Hub-and-spoke (rădăcină–frunze)', why: 'Frunzele comunică doar cu rădăcina, nu între ele.' },
    ],
    distractors: [{ text: 'Spine-leaf', why: 'Spine-leaf este o arhitectură de datacenter, nu un serviciu WAN oferit de un operator.' }],
    explanation: 'Serviciile Metro Ethernet sunt definite de MEF (Metro Ethernet Forum). Clientul primește un port Ethernet obișnuit (RJ45 sau fibră).',
  },
  {
    id: '1.2-030', topicId: T, sub: '1.2.d', type: 'single', difficulty: 2,
    stem: 'O firmă înlocuiește MPLS-ul cu **VPN-uri IPsec site-to-site peste Internet**. Care este principalul compromis?',
    options: [
      { id: 'a', text: 'Costul scade mult, dar Internetul nu oferă garanții de calitate (QoS, latență, pierderi)', correct: true, why: 'Accesul la Internet e ieftin și disponibil peste tot, iar [[ipsec|IPsec]] asigură confidențialitatea. Dar nimeni nu garantează calitatea drumului prin Internet — de aceea apare SD-WAN, care măsoară și alege calea.' },
      { id: 'b', text: 'Traficul circulă necriptat prin Internet', correct: false, why: 'Tocmai rolul IPsec este să cripteze și să autentifice traficul.' },
      { id: 'c', text: 'Filialele nu mai pot comunica cu sediul', correct: false, why: 'Pot: tunelurile VPN refac conectivitatea privată peste Internet.' },
      { id: 'd', text: 'Este nevoie de câte o linie închiriată pentru fiecare tunel', correct: false, why: 'Tunelurile VPN folosesc conexiunea de Internet existentă — nu e nevoie de circuite dedicate.' },
    ],
    explanation: 'WAN privat (MPLS, Metro E, leased line): calitate previzibilă, cost mare. Internet VPN: cost mic, acoperire mare, calitate „best effort”.',
  },
  {
    id: '1.2-031', topicId: T, sub: '1.2.d', type: 'single', difficulty: 1,
    stem: 'Ce descrie cel mai bine o [[leased-line|linie închiriată]] (leased line)?',
    options: [
      { id: 'a', text: 'Un circuit punct-la-punct dedicat între două site-uri, cu capacitate garantată, închiriat de la operator', correct: true, why: 'Istoric: circuite seriale T1/E1 cu HDLC sau PPP. Capacitatea nu e partajată cu alți clienți, dar costul e mare.' },
      { id: 'b', text: 'O conexiune de Internet partajată cu vecinii', correct: false, why: 'Aceasta descrie accesul broadband (cablu, GPON), nu o linie dedicată.' },
      { id: 'c', text: 'Un tunel VPN peste Internet', correct: false, why: 'Un VPN este virtual, peste o rețea publică. Linia închiriată este un circuit fizic/dedicat al operatorului.' },
      { id: 'd', text: 'O rețea în care toate site-urile sunt legate oricine-cu-oricine', correct: false, why: 'Aceasta este o topologie full mesh (sau serviciul MPLS/E-LAN), nu o singură linie.' },
    ],
    explanation: 'Leased line = point-to-point dedicat. Azi rolul ei e preluat în mare parte de Metro Ethernet E-Line, MPLS și VPN-uri peste Internet.',
  },
  {
    id: '1.2-032', topicId: T, sub: '1.2.d', type: 'order', difficulty: 2,
    stem: 'Pentru **6 site-uri**, ordonează topologiile WAN de la cele mai **puține** legături necesare la cele mai **multe**.',
    items: [
      { text: 'Hub-and-spoke (un hub + 5 spoke-uri)', why: 'n − 1 = 5 legături.' },
      { text: 'Partial mesh (hub-and-spoke + câteva legături directe între site-urile importante)', why: 'Peste 5 și sub 15 — de exemplu 7 sau 8, în funcție de proiect.' },
      { text: 'Full mesh', why: 'n(n−1)/2 = 15 legături.' },
    ],
    explanation: 'Cu cât mai multe legături, cu atât mai multă redundanță și căi mai directe — dar și cost și complexitate mai mari. Partial mesh este compromisul cel mai frecvent.',
  },

  // ======================= 1.2.e — SOHO =======================
  {
    id: '1.2-033', topicId: T, sub: '1.2.e', type: 'single', difficulty: 1,
    stem: 'Ce caracterizează rețeaua tipică [[soho|SOHO]]?',
    options: [
      { id: 'a', text: 'Un singur dispozitiv „all-in-one” care combină router, switch, access point, firewall și server DHCP', correct: true, why: 'Routerul wireless de acasă face toate aceste roluri. La examen: un singur echipament, multe funcții logice.' },
      { id: 'b', text: 'O pereche de switch-uri de core și mai multe switch-uri de distribution', correct: false, why: 'Aceasta este o arhitectură de campus, mult prea mare și scumpă pentru o locuință sau un birou mic.' },
      { id: 'c', text: 'Un fabric spine-leaf', correct: false, why: 'Spine-leaf este pentru datacentere cu sute/mii de servere.' },
      { id: 'd', text: 'Obligatoriu un WLC separat pentru access point', correct: false, why: 'Într-un SOHO AP-ul este integrat în router și se configurează direct, fără controller.' },
    ],
    explanation: 'SOHO = Small Office / Home Office. Câțiva până la câteva zeci de utilizatori, o conexiune la un ISP, un dispozitiv integrat (eventual plus un modem/ONT separat).',
  },
  {
    id: '1.2-034', topicId: T, sub: '1.2.e', type: 'multi', difficulty: 2,
    stem: 'Care TREI funcții sunt integrate de obicei într-un router wireless SOHO?',
    options: [
      { id: 'a', text: 'Server DHCP pentru LAN', correct: true, why: 'Routerul alocă adrese private (de ex. 192.168.1.x) tuturor dispozitivelor din casă.' },
      { id: 'b', text: 'NAT/PAT între LAN și WAN', correct: true, why: 'Toate dispozitivele ies în Internet cu adresa publică (sau CGNAT) a interfeței WAN — [[pat|PAT]].' },
      { id: 'c', text: 'Access point Wi-Fi', correct: true, why: 'Radiourile 2.4/5 GHz fac bridge între Wi-Fi și același LAN ca porturile cablate.' },
      { id: 'd', text: 'Wireless LAN Controller pentru sute de AP-uri', correct: false, why: 'Un [[wlc|WLC]] este specific rețelelor enterprise cu multe AP-uri lightweight.' },
      { id: 'e', text: 'Rutare BGP cu mai mulți ISP', correct: false, why: 'Un SOHO are de regulă o singură legătură, cu o rută implicită spre ISP. BGP este pentru site-uri multihomed mari.' },
    ],
    explanation: 'Lista completă tipică: router + NAT/PAT, firewall stateful, switch 4 porturi, AP Wi-Fi, DHCP, proxy DNS, uneori modem/ONT.',
  },
  {
    id: '1.2-035', topicId: T, sub: '1.2.e', type: 'single', difficulty: 2,
    stem: 'Pe routerul SOHO de acasă, interfața WAN are o adresă primită de la ISP, iar laptopurile au adrese 192.168.1.x. De ce pot laptopurile accesa Internetul, deși adresele lor nu sunt rutabile public?',
    options: [
      { id: 'a', text: 'Routerul face PAT: înlocuiește adresa privată sursă cu adresa interfeței WAN și ține evidența conexiunilor după port', correct: true, why: 'Adresele [[rfc1918|RFC 1918]] nu circulă în Internet. PAT (NAT overload) permite multor dispozitive să folosească o singură adresă publică — detaliat în 4.1.' },
      { id: 'b', text: 'ISP-ul rutează direct rețeaua 192.168.1.0/24 a fiecărui client', correct: false, why: 'Rețelele private se repetă la milioane de clienți; ISP-ul nu le poate ruta.' },
      { id: 'c', text: 'Access point-ul criptează adresele', correct: false, why: 'Criptarea Wi-Fi protejează doar traficul radio dintre laptop și AP; nu schimbă adresele IP.' },
      { id: 'd', text: 'Serverul DHCP al routerului dă adrese publice laptopurilor', correct: false, why: 'Serverul DHCP al routerului alocă adrese private în LAN. Adresa publică (dacă există) e doar pe interfața WAN.' },
    ],
    explanation: 'Rolul de router + NAT este esențial în SOHO: separă LAN-ul privat de WAN-ul public al ISP-ului.',
  },
  {
    id: '1.2-036', topicId: T, sub: '1.2.e', type: 'cli', difficulty: 2,
    stem: 'Pe un router Cisco folosit ca router SOHO, interfața WAN trebuie să primească adresa IP automat de la ISP. Ce comandă dai în modul de configurare al interfeței WAN?',
    prompt: 'R1(config-if)#', canonical: 'ip address dhcp',
    answers: ['ip address dhcp', 'ip add dhcp', 'ip addr dhcp'],
    hint: 'comanda de adresare IP, cu un cuvânt-cheie în loc de adresă și mască',
    wrong: [
      { text: 'ip dhcp pool WAN', why: 'Creează un pool pe care routerul îl folosește ca SERVER DHCP pentru alții. Aici routerul trebuie să fie CLIENT DHCP.' },
      { text: 'ip helper-address 0.0.0.0', why: '`ip helper-address` transformă routerul în releu DHCP pentru clienții din LAN, nu îi dă adresă interfeței.' },
      { text: 'dhcp client', why: 'Nu este o comandă validă de interfață în IOS.' },
    ],
    explanation: 'Cu `ip address dhcp`, routerul primește de la ISP adresa, masca și (de regulă) default gateway-ul, din care instalează automat o rută implicită. Configurarea completă a unui router SOHO (NAT, DHCP server) apare în 4.1 și 4.3.',
  },

  // ======================= 1.2.f — on-premises și cloud =======================
  {
    id: '1.2-037', topicId: T, sub: '1.2.f', type: 'single', difficulty: 1,
    stem: 'În ce model de servicii cloud administrezi **tu** sistemul de operare al serverelor?',
    options: [
      { id: 'a', text: '[[iaas|IaaS]]', correct: true, why: 'Providerul îți dă VM-uri, stocare și rețea virtuală; tu instalezi, configurezi și actualizezi OS-ul și tot ce e deasupra.' },
      { id: 'b', text: '[[paas|PaaS]]', correct: false, why: 'În PaaS providerul administrează și OS-ul, și runtime-ul; tu aduci doar codul și datele.' },
      { id: 'c', text: '[[saas|SaaS]]', correct: false, why: 'În SaaS folosești o aplicație finită; nu vezi nimic din infrastructură, cu atât mai puțin OS-ul.' },
      { id: 'd', text: 'Niciunul — în cloud OS-ul este întotdeauna al providerului', correct: false, why: 'Fals: în IaaS OS-ul îl alegi și îl administrezi tu.' },
    ],
    explanation: 'Regulă de reținut: IaaS = tu de la OS în sus; PaaS = tu doar aplicația și datele; SaaS = tu doar datele, utilizatorii și setările.',
  },
  {
    id: '1.2-038', topicId: T, sub: '1.2.f', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare scenariu cu modelul corespunzător.',
    leftLabel: 'Scenariu', rightLabel: 'Model',
    pairs: [
      { left: 'Închiriezi o VM Linux și îi instalezi singur serverul web', right: 'IaaS', why: 'Ai VM-ul „gol” — tu administrezi OS-ul și aplicațiile.' },
      { left: 'Încarci codul aplicației pe o platformă care se ocupă de OS și runtime', right: 'PaaS', why: 'Platforma (ex. Google App Engine, Azure App Service) rulează codul tău fără să vezi OS-ul.' },
      { left: 'Folosești e-mailul și documentele din Microsoft 365 în browser', right: 'SaaS', why: 'Aplicația completă e livrată ca serviciu.' },
      { left: 'Servere cumpărate de firmă, în camera serverelor din sediu', right: 'On-premises', why: 'Totul este deținut și administrat de organizație, în incinta ei.' },
    ],
    distractors: [{ text: 'Community cloud', why: 'Community cloud este un model de IMPLEMENTARE (cine folosește cloud-ul: o comunitate de organizații), nu un model de servicii. Nu corespunde niciunui scenariu.' }],
    explanation: 'Modele de servicii (NIST): IaaS, PaaS, SaaS. Modele de implementare: public, private, community, hybrid. Nu le amesteca.',
  },
  {
    id: '1.2-039', topicId: T, sub: '1.2.f', type: 'multi', difficulty: 2,
    stem: 'Care TREI sunt caracteristici esențiale ale cloud computing-ului conform [[nist-cloud|NIST SP 800-145]]?',
    options: [
      { id: 'a', text: 'On-demand self-service', correct: true, why: 'Clientul își creează singur resursele (din portal sau API), fără să ceară cuiva de la provider.' },
      { id: 'b', text: 'Rapid elasticity', correct: true, why: 'Resursele cresc sau scad rapid, uneori automat, după cerere.' },
      { id: 'c', text: 'Measured service', correct: true, why: 'Consumul este măsurat și facturat (plătești cât folosești).' },
      { id: 'd', text: 'Hardware dedicat fiecărui client', correct: false, why: 'Invers: NIST definește resource pooling — resursele fizice sunt partajate între clienți (multi-tenant).' },
      { id: 'e', text: 'Investiție inițială mare în echipamente (CapEx)', correct: false, why: 'Aceasta descrie on-premises. Cloud-ul mută costul spre OpEx (plată periodică).' },
    ],
    explanation: 'Cele 5 caracteristici NIST: on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service.',
  },
  {
    id: '1.2-040', topicId: T, sub: '1.2.f', type: 'single', difficulty: 2,
    stem: 'Care afirmație despre **[[private-cloud|private cloud]]** este corectă?',
    options: [
      { id: 'a', text: 'Este folosit exclusiv de o singură organizație, dar poate fi găzduit fie on-premises, fie de un terț', correct: true, why: '„Privat” se referă la cine îl folosește, nu la locație. Un cloud privat poate sta într-un datacenter închiriat.' },
      { id: 'b', text: 'Trebuie obligatoriu să fie în clădirea organizației', correct: false, why: 'Capcană frecventă: NIST spune explicit că un private cloud poate exista on-premises sau off-premises.' },
      { id: 'c', text: 'Este același lucru cu un datacenter tradițional, fără virtualizare', correct: false, why: 'Un cloud privat păstrează caracteristicile cloud-ului (self-service, elasticitate, măsurare), de obicei pe infrastructură virtualizată.' },
      { id: 'd', text: 'Resursele lui sunt partajate cu alți clienți ai providerului', correct: false, why: 'Asta descrie public cloud (multi-tenant).' },
    ],
    explanation: 'Public = oricine plătește. Private = o singură organizație. Community = un grup de organizații cu cerințe comune. Hybrid = două sau mai multe clouduri distincte legate între ele.',
  },
  {
    id: '1.2-041', topicId: T, sub: '1.2.f', type: 'single', difficulty: 1,
    stem: 'O companie ține datele clienților în cloud-ul privat on-prem, dar la vârfurile de trafic își extinde aplicația web în AWS. Ce model de implementare folosește?',
    options: [
      { id: 'a', text: '[[hybrid-cloud|Hybrid cloud]]', correct: true, why: 'Două clouduri distincte (privat + public) legate între ele, cu aplicații care se pot muta între ele („cloud bursting”).' },
      { id: 'b', text: 'Public cloud', correct: false, why: 'Doar o parte e în cloud-ul public; datele stau în cloud-ul privat.' },
      { id: 'c', text: 'Community cloud', correct: false, why: 'Community cloud înseamnă infrastructură partajată de mai multe organizații cu cerințe comune — nu e cazul aici.' },
      { id: 'd', text: 'SaaS', correct: false, why: 'SaaS este un model de servicii, nu de implementare.' },
    ],
    explanation: 'Hybrid = cel puțin două clouduri distincte, legate (de obicei privat + public).',
  },
  {
    id: '1.2-042', topicId: T, sub: '1.2.f', type: 'single', difficulty: 2,
    stem: 'Care este un avantaj tipic al soluției **on-premises** față de cloud-ul public?',
    options: [
      { id: 'a', text: 'Control total asupra hardware-ului, datelor și locației lor (util pentru conformitate, ex. GDPR, sau latență locală)', correct: true, why: 'Știi exact unde stau datele și cine are acces fizic. Prețul: tu plătești tot în avans și tu administrezi tot.' },
      { id: 'b', text: 'Nu necesită investiție inițială', correct: false, why: 'Invers: on-prem înseamnă CapEx mare (servere, licențe, spațiu, curent, răcire). Cloud-ul este OpEx.' },
      { id: 'c', text: 'Elasticitate instantanee la vârfuri de trafic', correct: false, why: 'Elasticitatea este un avantaj al cloud-ului. On-prem, capacitatea trebuie cumpărată din timp, pentru vârful estimat.' },
      { id: 'd', text: 'Providerul se ocupă de patch-uri și înlocuirea hardware-ului', correct: false, why: 'On-prem nu există provider: toate acestea sunt responsabilitatea echipei tale IT.' },
    ],
    explanation: 'On-prem: control, previzibilitate, CapEx, responsabilitate totală. Cloud: elasticitate, OpEx, viteză de lansare, dependență de provider și de conexiune.',
  },
  {
    id: '1.2-043', topicId: T, sub: '1.2.f', type: 'order', difficulty: 2,
    stem: 'Ordonează modelele de la **cea mai mare** responsabilitate a clientului la **cea mai mică**.',
    items: [
      { text: 'On-premises', why: 'Clientul administrează tot: clădire, hardware, virtualizare, OS, aplicații, date.' },
      { text: 'IaaS', why: 'Providerul preia clădirea, hardware-ul, virtualizarea și rețeaua fizică; clientul administrează OS-ul în sus.' },
      { text: 'PaaS', why: 'Providerul preia și OS-ul și runtime-ul; clientul are doar aplicația și datele.' },
      { text: 'SaaS', why: 'Providerul preia tot stack-ul; clientul răspunde doar de date, utilizatori și setări.' },
    ],
    explanation: 'Modelul de responsabilitate partajată: cu cât urci de la IaaS la SaaS, cu atât providerul administrează mai mult, iar tu ai mai puțin control.',
  },
];
