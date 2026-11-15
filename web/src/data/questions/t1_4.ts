import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.4 Identify interface and cable issues (collisions, errors, mismatch duplex, and/or speed).
// Fiecare variantă are explicație. Output-urile din enunțuri sunt ilustrative (construite pentru învățare).
const T = '1.4';
const S = '1.4';

export const Q_1_4: Question[] = [
  // ======================= stările interfeței =======================
  {
    id: '1.4-001', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['states'],
    stem: '`show interfaces g0/3` afișează: `GigabitEthernet0/3 is administratively down, line protocol is down`. Care este cauza?',
    options: [
      { id: 'a', text: 'Pe interfață a fost configurată comanda `shutdown`', correct: true, why: 'Cuvântul „administratively” înseamnă că administratorul a oprit interfața. Se repară cu `no shutdown`.' },
      { id: 'b', text: 'Cablul este deconectat', correct: false, why: 'Un cablu deconectat produce `down, line protocol is down` (notconnect) — fără cuvântul „administratively”.' },
      { id: 'c', text: 'Switch-ul a detectat o încălcare port security', correct: false, why: 'Atunci portul ar fi [[err-disabled]]: `down, line protocol is down (err-disabled)`. Nu e același lucru cu shutdown manual.' },
      { id: 'd', text: 'Există un duplex mismatch cu capătul celălalt', correct: false, why: 'Un [[duplex-mismatch|duplex mismatch]] lasă legătura up/up; se vede doar în contoare (collisions, CRC) și în mesajele CDP.' },
    ],
    explanation: 'Citește starea ca o pereche: primul cuvânt = nivelul 1, al doilea = nivelul 2. „administratively down” = oprit cu `shutdown` (tu ai făcut-o). Pe `show interfaces status` aceeași stare apare ca „disabled”.',
  },
  {
    id: '1.4-002', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['states'],
    stem: 'Un PC nou nu are rețea. Pe switch: `FastEthernet0/7 is down, line protocol is down (notconnect)`. Ce verifici ÎNTÂI?',
    options: [
      { id: 'a', text: 'Cablul fizic: este conectat la ambele capete și este întreg?', correct: true, why: 'down/down = nu există semnal valid pe fir (nivelul 1). Primele suspecte: cablul lipsă/defect, placa de rețea a PC-ului oprită, tipul de cablu.' },
      { id: 'b', text: 'Adresa IP și gateway-ul PC-ului', correct: false, why: 'Problemele de IP sunt de nivel 3. Cu L1 down nici nu ajungi să testezi IP-ul — mergi de jos în sus.' },
      { id: 'c', text: 'Encapsularea HDLC vs PPP', correct: false, why: 'Encapsularea contează pe legături seriale și produce up/down, nu down/down pe un port Ethernet de acces.' },
      { id: 'd', text: 'Dacă portul are prea multe output drops', correct: false, why: 'Output drops înseamnă congestie pe un link care funcționează. Pe un port down nu circulă nimic.' },
    ],
    explanation: 'Troubleshooting de jos în sus (OSI): întâi nivelul 1 (cablu, semnal, viteză), apoi 2, apoi 3. „notconnect” = switch-ul nu vede un partener activ pe fir.',
  },
  {
    id: '1.4-003', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['states'],
    stem: 'Între două routere, pe legătura serială: `Serial0/1/0 is up, line protocol is down`. R1 are `encapsulation ppp`, R2 a rămas cu setarea implicită. Ce se întâmplă?',
    options: [
      { id: 'a', text: 'Nepotrivire de encapsulare (PPP vs HDLC) — nivelul 1 funcționează, nivelul 2 nu', correct: true, why: 'Pe routerele Cisco, encapsularea implicită pe serial este [[hdlc|HDLC]]. Un capăt cu [[ppp|PPP]] și celălalt cu HDLC nu se înțeleg la nivelul 2 → up/down.' },
      { id: 'b', text: 'Cablul serial este deconectat', correct: false, why: 'Fără cablu, nivelul 1 ar fi și el down → down/down.' },
      { id: 'c', text: 'R2 are interfața oprită cu shutdown', correct: false, why: 'Atunci R2 ar arăta administratively down, iar R1 down/down (nu ar mai primi semnal).' },
      { id: 'd', text: 'Este un duplex mismatch', correct: false, why: 'Duplex mismatch este o problemă Ethernet și lasă legătura up/up.' },
    ],
    explanation: 'up/down = „cablul e bun, dar nu vorbim aceeași limbă la nivelul 2”. Clasic pe serial: encapsulare diferită, lipsă `clock rate` pe DCE, keepalive-uri care nu ajung, autentificare PPP eșuată.',
  },
  {
    id: '1.4-004', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['states', 'err-disabled'],
    stem: 'Un port de acces apare ca `err-disabled` după o încălcare de port security. Ai eliminat dispozitivul neautorizat. Cum reactivezi portul manual?',
    options: [
      { id: 'a', text: '`shutdown` urmat de `no shutdown` pe interfață', correct: true, why: 'Un port [[err-disabled]] rămâne oprit până când este „resetat” administrativ: întâi shutdown, apoi no shutdown (după ce ai eliminat cauza).' },
      { id: 'b', text: 'Doar `no shutdown`', correct: false, why: 'Pe multe platforme portul nu e în shutdown administrativ, deci `no shutdown` singur nu schimbă nimic; procedura documentată este shutdown + no shutdown.' },
      { id: 'c', text: '`clear counters` pe interfață', correct: false, why: '`clear counters` doar resetează contoarele statistice; nu schimbă starea portului.' },
      { id: 'd', text: 'Repornirea PC-ului conectat', correct: false, why: 'Portul a fost oprit de switch; PC-ul nu are cum să-l reactiveze.' },
    ],
    explanation: 'err-disabled = switch-ul s-a protejat singur. Pași: află cauza (`show interfaces status err-disabled`, log-ul `%PM-4-ERR_DISABLE`), elimin-o, apoi `shutdown` / `no shutdown` — sau configurează `errdisable recovery cause …` pentru reactivare automată.',
  },
  {
    id: '1.4-005', topicId: T, sub: S, type: 'match', difficulty: 2, tags: ['states'],
    stem: 'Potrivește starea interfeței cu cauza cea mai probabilă.',
    leftLabel: 'Stare afișată', rightLabel: 'Cauză',
    pairs: [
      { left: 'up / up (dar transferurile sunt foarte lente)', right: 'Duplex mismatch', why: 'Duplex mismatch nu oprește legătura: e up/up, ping-ul merge, performanța e slabă.' },
      { left: 'down / down (notconnect)', right: 'Cablu deconectat sau defect', why: 'Lipsa semnalului fizic oprește nivelul 1, deci și nivelul 2.' },
      { left: 'administratively down / down', right: 'Comanda shutdown', why: '„administratively” = oprit manual de administrator.' },
      { left: 'up / down pe serial', right: 'Encapsulare diferită (HDLC vs PPP)', why: 'Nivelul 1 e bun, dar protocolul de nivel 2 nu se potrivește.' },
      { left: 'down / down (err-disabled)', right: 'Încălcare port security', why: 'Switch-ul a oprit portul automat, ca protecție.' },
    ],
    distractors: [{ text: 'Coada de ieșire plină (output drops)', why: 'Congestia nu schimbă starea interfeței: portul rămâne up/up, doar pierde pachete la ieșire.' }],
    explanation: 'Stările sunt prima informație în troubleshooting. Doar contoarele pot dezvălui problemele „ascunse” sub un up/up (duplex mismatch, CRC, congestie).',
  },
  {
    id: '1.4-006', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['states'],
    stem: 'În `show interfaces status`, coloana Status arată `disabled` pentru portul Gi0/5. Ce înseamnă?',
    options: [
      { id: 'a', text: 'Portul este oprit administrativ (`shutdown`)', correct: true, why: 'Pe switch-uri Catalyst, „disabled” în `show interfaces status` este echivalentul lui „administratively down” din `show interfaces`.' },
      { id: 'b', text: 'Portul este err-disabled', correct: false, why: 'Pentru err-disabled, coloana Status afișează chiar „err-disabled”.' },
      { id: 'c', text: 'Nu este conectat niciun cablu', correct: false, why: 'Lipsa cablului apare ca „notconnect”.' },
      { id: 'd', text: 'VLAN-ul portului a fost șters', correct: false, why: 'Un VLAN inexistent face portul „inactive” pe Catalyst, nu „disabled”.' },
    ],
    explanation: 'Corespondențe utile: connected = up/up · notconnect = down/down · disabled = administratively down · err-disabled = oprit de switch.',
  },
  {
    id: '1.4-007', topicId: T, sub: S, type: 'multi', difficulty: 2, tags: ['states', 'speed'],
    stem: 'Care DOUĂ probleme lasă o interfață Ethernet în starea **down/down** pe ambele capete?',
    options: [
      { id: 'a', text: 'Viteze fixate diferit la cele două capete (`speed 100` vs `speed 1000`)', correct: true, why: 'Un [[speed-mismatch|speed mismatch]] împiedică formarea legăturii fizice: notconnect pe ambele capete.' },
      { id: 'b', text: 'Cablul este rupt', correct: true, why: 'Fără continuitate electrică nu există semnal → down/down.' },
      { id: 'c', text: 'Un capăt full-duplex, celălalt half-duplex, la aceeași viteză', correct: false, why: 'Duplex mismatch: legătura e up/up, cu erori în contoare. Exact capcana de examen.' },
      { id: 'd', text: 'Output drops mari din cauza congestiei', correct: false, why: 'Congestia apare pe o legătură care funcționează (up/up).' },
      { id: 'e', text: 'Un capăt a fost oprit cu `shutdown`', correct: false, why: 'Aproape: capătul celălalt vede down/down, dar capătul cu shutdown arată „administratively down”, nu down/down. Enunțul cere down/down pe ambele capete.' },
    ],
    explanation: 'Regula de reținut: viteza diferită → link DOWN; duplexul diferit → link UP, dar „bolnav”.',
  },
  {
    id: '1.4-008', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['states'],
    stem: 'În linia `GigabitEthernet0/1 is up, line protocol is down`, ce descrie partea „line protocol”?',
    options: [
      { id: 'a', text: 'Starea nivelului 2 (data link)', correct: true, why: 'Primul cuvânt (is up/down) = nivelul 1 fizic; „line protocol” = nivelul 2: keepalive-uri, encapsulare, protocolul de legătură.' },
      { id: 'b', text: 'Starea nivelului 1 (fizic)', correct: false, why: 'Nivelul 1 este primul cuvânt: „GigabitEthernet0/1 is up”.' },
      { id: 'c', text: 'Starea protocolului IP de pe interfață', correct: false, why: 'Starea IP o vezi în `show ip interface` (de exemplu dacă are adresă). Line protocol este nivelul 2.' },
      { id: 'd', text: 'Dacă rulează un protocol de routing pe interfață', correct: false, why: 'Protocoalele de routing nu apar în această linie; se verifică cu `show ip protocols` sau `show ip ospf interface`.' },
    ],
    explanation: 'Ordinea este mereu „nivel 1 / nivel 2”. De aceea up/down înseamnă „cablul e bun, protocolul de legătură nu”.',
  },

  // ======================= contoarele =======================
  {
    id: '1.4-009', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['counters'],
    stem: 'Cum definește Cisco contorul **runts** din `show interfaces`?',
    options: [
      { id: 'a', text: 'Cadre primite mai mici de 64 de octeți, cu CRC greșit', correct: true, why: '64 de octeți este minimul IEEE 802.3. Un [[runt]] este de obicei un fragment de cadru întrerupt de o coliziune.' },
      { id: 'b', text: 'Cadre primite mai mari de 1518 octeți', correct: false, why: 'Acelea sunt [[giant|giants]].' },
      { id: 'c', text: 'Cadre transmise după ce interfața a așteptat mediul liber', correct: false, why: 'Acelea sunt cadrele „deferred”, normale pe half-duplex.' },
      { id: 'd', text: 'Pachete aruncate pentru că coada de ieșire era plină', correct: false, why: 'Acelea sunt [[output-drops|output drops]] — congestie.' },
    ],
    explanation: 'Runts < 64 B · giants > 1518 B (fără jumbo). Minimul de 64 de octeți vine din fereastra de coliziune de 512 biți ([[slot-time|slot time]]).',
  },
  {
    id: '1.4-010', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['counters'],
    stem: 'Pe un port de switch apar **giants** în creștere. Serverul conectat a fost configurat recent cu MTU 9000. Care este explicația cea mai probabilă?',
    options: [
      { id: 'a', text: 'Serverul trimite jumbo frames, iar portul switch-ului acceptă doar cadre de până la 1518 octeți', correct: true, why: 'Un cadru mai mare decât maximul acceptat de interfață este numărat ca giant și aruncat. Ambele capete trebuie să aibă același [[mtu|MTU]].' },
      { id: 'b', text: 'Cablul este prea lung', correct: false, why: 'Un cablu prea lung produce CRC și late collisions, nu cadre mai mari.' },
      { id: 'c', text: 'Este un duplex mismatch', correct: false, why: 'Duplex mismatch produce fragmente (runts, CRC) și coliziuni, nu cadre supradimensionate.' },
      { id: 'd', text: 'Portul este err-disabled', correct: false, why: 'Un port err-disabled nu primește cadre deloc, deci nu ar număra giants.' },
    ],
    explanation: 'Giants: > 1518 octeți (14 antet + 1500 date + 4 FCS). Cauze tipice: nepotrivire de MTU/jumbo frames sau o placă de rețea defectă care trimite cadre prea lungi.',
  },
  {
    id: '1.4-011', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['counters', 'cable'],
    stem: 'Output: `Full-duplex, 1000Mb/s` · `6925 input errors, 5821 CRC, 1104 frame, 0 overrun, 0 ignored` · `0 collisions` · `0 late collision`. Care este cea mai probabilă cauză?',
    options: [
      { id: 'a', text: 'O problemă fizică: cablu deteriorat, conector prost sertizat sau interferențe electromagnetice', correct: true, why: 'CRC mari fără coliziuni pe un port full-duplex = biții se corup pe fir. Cisco numește tiparul „excessive noise”. Se verifică/înlocuiește cablul, traseul ([[emi|EMI]]), portul.' },
      { id: 'b', text: 'Duplex mismatch, iar acesta este capătul half-duplex', correct: false, why: 'Portul este full-duplex, iar capătul half al unui mismatch ar avea collisions și late collisions, nu zero.' },
      { id: 'c', text: 'Congestie pe interfață', correct: false, why: 'Congestia se vede ca output drops (sau ignored/overrun la recepție), nu ca CRC. Cadrele congestionate nu sunt corupte.' },
      { id: 'd', text: 'Interfața este oprită administrativ', correct: false, why: 'O interfață oprită nu primește cadre, deci nu acumulează erori noi.' },
    ],
    explanation: 'Separă cauzele în trei grupe: fizic (CRC, frame — fără coliziuni), duplex (collisions/late pe un capăt, CRC/runts pe celălalt), congestie (drops, ignored, overrun).',
  },
  {
    id: '1.4-012', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['counters'],
    stem: 'Output: `400 input errors, 288 CRC, 24 frame, 0 overrun, 0 ignored` și `0 runts, 0 giants`. De ce suma sub-contoarelor (312) nu este egală cu 400?',
    options: [
      { id: 'a', text: 'Input errors este un total care include și alte cauze, iar un cadru poate declanșa mai multe erori — Cisco precizează că sub-contoarele nu se adună obligatoriu la total', correct: true, why: '[[input-errors|Input errors]] este agregat (runts, giants, no buffer, CRC, frame, overrun, ignored și altele). Nu te baza pe aritmetică; uită-te ce sub-contor crește.' },
      { id: 'b', text: 'Este o eroare de afișare a IOS-ului', correct: false, why: 'Nu e o eroare: comportamentul este documentat de Cisco.' },
      { id: 'c', text: 'Diferența de 88 reprezintă coliziunile', correct: false, why: 'Coliziunile sunt un contor de transmisie (output), nu fac parte din input errors.' },
      { id: 'd', text: 'Diferența reprezintă pachetele broadcast', correct: false, why: 'Broadcast-urile nu sunt erori; sunt numărate separat („Received … broadcasts”).' },
    ],
    explanation: 'La examen: „input errors” = total; cauza o dau sub-contoarele (CRC → fizic; runts → coliziuni/duplex; ignored/overrun → resurse).',
  },
  {
    id: '1.4-013', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['counters'],
    stem: 'Uplink-ul de 100 Mb/s al unui switch de acces (cu 24 de porturi de 1 Gb/s) arată `txload 251/255` și `Total output drops: 48211`, fără nicio eroare CRC. Ce indică?',
    options: [
      { id: 'a', text: 'Congestie: coada de ieșire se umple pentru că traficul care vrea să iasă depășește capacitatea legăturii', correct: true, why: '[[output-drops|Output drops]] = coada de ieșire plină. Cisco: tipic la trecerea de la o interfață rapidă la una lentă. Remedii: legătură mai rapidă, EtherChannel, QoS.' },
      { id: 'b', text: 'Cablul uplink-ului este defect', correct: false, why: 'Un cablu defect ar produce CRC/frame errors. Aici erorile sunt zero.' },
      { id: 'c', text: 'Duplex mismatch', correct: false, why: 'Lipsesc semnăturile duplex mismatch: collisions/late collisions sau CRC/runts.' },
      { id: 'd', text: 'Speed mismatch', correct: false, why: 'Un speed mismatch (viteze fixate diferit) ar ține legătura down. „Viteze diferite” între porturile de intrare și ieșire nu e același lucru cu speed mismatch pe o legătură.' },
    ],
    explanation: 'Output drops ≠ output errors. Drops = congestie (nu e vina cablului); errors = transmisia a eșuat.',
  },
  {
    id: '1.4-014', topicId: T, sub: S, type: 'match', difficulty: 2, tags: ['counters'],
    stem: 'Potrivește contorul din `show interfaces` cu definiția lui.',
    leftLabel: 'Definiție', rightLabel: 'Contor',
    pairs: [
      { left: 'Cadru mai mic de 64 de octeți, cu CRC greșit', right: 'runts', why: 'Minimul Ethernet e 64 de octeți; fragmentele sub acest prag sunt runts.' },
      { left: 'Cadru mai mare de 1518 octeți (fără jumbo)', right: 'giants', why: '1518 = 14 antet + 1500 date + 4 FCS.' },
      { left: 'Checksum-ul calculat nu se potrivește cu FCS-ul primit', right: 'CRC', why: 'Cadrul a fost corupt pe drum și este aruncat.' },
      { left: 'Coliziune detectată după primii 512 biți ai cadrului', right: 'late collision', why: 'După slot time: duplex mismatch (partea half) sau cablu prea lung.' },
      { left: 'Pachete aruncate pentru că coada de ieșire era plină', right: 'output drops', why: 'Congestie, nu defect fizic.' },
    ],
    distractors: [
      { text: 'deferred', why: '„deferred” = cadre transmise după ce interfața a așteptat mediul liber (half-duplex). Nu descrie niciuna dintre definiții.' },
      { text: 'interface resets', why: 'Numără resetările complete ale interfeței (de exemplu la pierderea semnalului), nu un tip de cadru.' },
    ],
    explanation: 'Aceste cinci contoare acoperă aproape toate întrebările 1.4 despre „errors”. Reține și pragurile 64 / 1518 / 512 biți.',
  },
  {
    id: '1.4-015', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['counters', 'collisions'],
    stem: 'Ce este o **late collision**?',
    options: [
      { id: 'a', text: 'O coliziune detectată după ce s-au transmis primii 64 de octeți (512 bit-times) ai cadrului', correct: true, why: 'Într-o rețea corectă, orice coliziune ajunge la emițător în primii 512 biți ([[slot-time|slot time]]). O coliziune mai târzie înseamnă că regulile sunt încălcate: duplex mismatch sau segment prea lung.' },
      { id: 'b', text: 'O coliziune care apare după 16 încercări de retransmisie', correct: false, why: 'După 16 coliziuni consecutive, cadrul e aruncat („excessive collisions”). Nu asta înseamnă late collision.' },
      { id: 'c', text: 'O coliziune care apare noaptea, când traficul de backup este mare', correct: false, why: '„Late” se referă la momentul din interiorul cadrului, nu la ora din zi.' },
      { id: 'd', text: 'Orice coliziune pe un port full-duplex', correct: false, why: 'Pe un port full-duplex nu se numără coliziuni deloc. Late collisions apar pe partea half-duplex.' },
    ],
    explanation: 'Late collision = după 512 biți (51,2 µs la 10 Mb/s). Cauze: duplex mismatch (partea half) sau cablu peste 100 m / prea multe hub-uri.',
  },
  {
    id: '1.4-016', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['counters'],
    stem: 'Pe un switch, toate porturile din VLAN 10 arată brusc `Received 98123456 broadcasts`, `rxload 255/255`, plus **ignored** și **no buffer** în creștere rapidă. Ce suspectezi?',
    options: [
      { id: 'a', text: 'O furtună de broadcast, cel mai probabil o buclă de nivel 2', correct: true, why: 'Contoarele [[ignored]] și no buffer cresc când interfața rămâne fără buffere — tipic la broadcast storm. Broadcast-urile uriașe pe toate porturile unui VLAN indică o buclă (STP oprit sau ocolit — topicul 2.5).' },
      { id: 'b', text: 'Un cablu deteriorat pe un singur port', correct: false, why: 'Un cablu defect afectează un singur port și produce CRC, nu broadcast-uri pe tot VLAN-ul.' },
      { id: 'c', text: 'Un duplex mismatch pe uplink', correct: false, why: 'Mismatch-ul produce coliziuni/CRC pe o legătură, nu milioane de broadcast-uri pe toate porturile.' },
      { id: 'd', text: 'Giants din cauza jumbo frames', correct: false, why: 'Giants nu au legătură cu broadcast-urile sau cu lipsa bufferelor.' },
    ],
    explanation: 'Ignored, no buffer, overrun și output drops sunt contoare de resurse/congestie: indică „prea mult trafic”, nu un fir defect.',
  },
  {
    id: '1.4-017', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['counters', 'cable'],
    stem: 'Log-ul unui switch arată repetat `%LINK-3-UPDOWN: Interface GigabitEthernet0/8, changed state to down` urmat de `…changed state to up`, iar `show interfaces` raportează `27 interface resets`. Care este cauza probabilă?',
    options: [
      { id: 'a', text: 'Un link instabil (flap): conector slăbit, cablu deteriorat sau transceiver defect', correct: true, why: 'Căderi și reveniri repetate ale nivelului 1 + [[interface-resets|interface resets]] = semnal care se pierde intermitent. Verifică fizic cablul și conectorii.' },
      { id: 'b', text: 'Interfața a fost configurată cu shutdown', correct: false, why: 'Shutdown ar lăsa interfața administratively down permanent, fără reveniri automate la up.' },
      { id: 'c', text: 'Congestie la ieșire', correct: false, why: 'Congestia nu face legătura să cadă; produce output drops.' },
      { id: 'd', text: 'Encapsulare greșită', correct: false, why: 'Encapsularea e o problemă de nivel 2 pe serial și dă up/down stabil, nu flap-uri pe Ethernet.' },
    ],
    explanation: 'Un link care „flapează” des poate fi pus chiar în err-disabled de switch (cauza link-flap). Prima acțiune: înlocuiește cablul/patch cord-ul și verifică conectorii.',
  },
  {
    id: '1.4-018', topicId: T, sub: S, type: 'multi', difficulty: 2, tags: ['counters', 'cable'],
    stem: 'Care DOUĂ contoare indică, în primul rând, o problemă la nivelul fizic (cablu, conector, zgomot)?',
    options: [
      { id: 'a', text: 'CRC', correct: true, why: 'Checksum greșit = biți corupți pe fir. Fără coliziuni, aproape sigur cablu/EMI/port.' },
      { id: 'b', text: 'frame', correct: true, why: 'Frame errors = CRC greșit plus un număr de biți care nu e multiplu de 8 — tot un cadru deteriorat fizic (sau de coliziuni).' },
      { id: 'c', text: 'Total output drops', correct: false, why: 'Coada de ieșire plină = congestie, nu cablu.' },
      { id: 'd', text: 'broadcasts', correct: false, why: 'Broadcast-urile sunt trafic normal; nu sunt erori.' },
      { id: 'e', text: 'deferred', correct: false, why: 'Deferred = interfața half-duplex a așteptat mediul liber. E normal în half-duplex.' },
    ],
    explanation: 'Grupa „fizic”: CRC, frame, input errors (ca total), giants de la NIC defect, interface resets/lost carrier la link instabil.',
  },
  {
    id: '1.4-019', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['counters'],
    stem: 'Ce înseamnă `reliability 255/255` în `show interfaces`?',
    options: [
      { id: 'a', text: 'Interfața nu a avut erori în ultima perioadă (100% fiabilă, medie pe 5 minute)', correct: true, why: 'Reliability este o fracție din 255, mediată exponențial pe 5 minute. 255/255 = fără erori recente.' },
      { id: 'b', text: 'Interfața este încărcată 100%', correct: false, why: 'Încărcarea o arată txload/rxload, nu reliability.' },
      { id: 'c', text: 'Interfața a pierdut 255 de pachete', correct: false, why: 'Valoarea este o fracție (x/255), nu un număr de pachete.' },
      { id: 'd', text: 'Legătura are 255 de minute fără căderi', correct: false, why: 'Nu e un timp de funcționare. „Last clearing” și „Last input/output” dau informații de timp.' },
    ],
    explanation: 'Un reliability sub 255 este un semnal rapid că există erori; detaliile le afli din contoarele de mai jos în output.',
  },
  {
    id: '1.4-020', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['counters'],
    stem: 'Contoarele unei interfețe arată `1250 CRC`, iar „Last clearing of counters” este `never`. Switch-ul funcționează de 3 ani. Care este cel mai bun pas următor?',
    options: [
      { id: 'a', text: '`clear counters` pe interfață, apoi verifici din nou peste un timp dacă CRC-urile cresc', correct: true, why: 'Contoarele sunt cumulative. 1250 de erori în 3 ani pot fi istorie veche. Doar o creștere activă confirmă o problemă actuală.' },
      { id: 'b', text: 'Înlocuiești imediat switch-ul', correct: false, why: 'Nu ai dovada unei probleme actuale; nici măcar nu știi dacă erorile mai cresc.' },
      { id: 'c', text: 'Fixezi viteza și duplexul la 100/full pe port', correct: false, why: 'Hard-codarea unui singur capăt poate crea chiar un duplex mismatch. Și nu e justificată de date.' },
      { id: 'd', text: 'Oprești interfața cu shutdown', correct: false, why: 'Ar întrerupe utilizatorul fără motiv dovedit.' },
    ],
    explanation: 'Regula: contorul contează doar raportat la timp. `clear counters` + reverificare = vezi dacă problema e activă.',
  },

  // ======================= coliziuni =======================
  {
    id: '1.4-021', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['collisions'],
    stem: 'Un port de switch configurat `duplex full` raportează `3480 collisions`. Ce concluzie tragi?',
    options: [
      { id: 'a', text: 'E ceva greșit: un port full-duplex nu ar trebui să numere coliziuni — verifică duplexul la ambele capete', correct: true, why: 'Cisco: coliziunile sunt normale pe half-duplex și nu trebuie să apară pe full-duplex. Contorul indică faptul că portul a rulat (și) half sau o configurare greșită — în practică, un duplex mismatch.' },
      { id: 'b', text: 'E normal pe orice port cu trafic mare', correct: false, why: 'Pe full-duplex există perechi separate de transmisie și recepție; nu există coliziuni indiferent de trafic.' },
      { id: 'c', text: 'Cablul este prea scurt', correct: false, why: 'Nu există o problemă de „cablu prea scurt” care să producă coliziuni.' },
      { id: 'd', text: 'Coliziunile vin de la broadcast-uri', correct: false, why: 'Broadcast-urile nu provoacă coliziuni pe un link full-duplex switch-uit.' },
    ],
    explanation: 'Coliziuni = semn de half-duplex. Pe un link care ar trebui să fie full → investighează duplexul (mesaje CDP, `show interfaces status`).',
  },
  {
    id: '1.4-022', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['collisions'],
    stem: 'Patru PC-uri vechi sunt conectate la un [[hub]]. Pe placa de rețea a unui PC vezi un număr mic de coliziuni (sub 0,1% din cadre). Ce înseamnă?',
    options: [
      { id: 'a', text: 'Este normal: un hub creează un singur domeniu de coliziune, iar dispozitivele rulează half-duplex cu CSMA/CD', correct: true, why: 'Pe mediu partajat, coliziunile sunt parte din funcționare. [[csma-cd|CSMA/CD]] le detectează și retransmite automat. Cisco consideră excesive coliziunile peste ≈0,1%.' },
      { id: 'b', text: 'Este un duplex mismatch', correct: false, why: 'Pe un hub toate dispozitivele trebuie să fie half-duplex; coliziunile normale nu indică mismatch.' },
      { id: 'c', text: 'Cablul este defect', correct: false, why: 'Un număr mic de coliziuni normale nu indică defect. Late collisions sau CRC fără coliziuni ar fi alte semnale.' },
      { id: 'd', text: 'Hub-ul trebuie configurat cu duplex full', correct: false, why: 'Un hub este un dispozitiv de nivel 1; nu poate funcționa full-duplex și nu se configurează.' },
    ],
    explanation: 'Coliziunile normale = half-duplex + mediu partajat (vezi topicul 1.3). Late collisions, însă, nu sunt niciodată normale.',
  },
  {
    id: '1.4-023', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['collisions', 'cable'],
    stem: 'Un segment vechi half-duplex cu hub-uri în cascadă arată **late collisions**. Duplexul este corect configurat peste tot (half). Care este cauza cea mai probabilă?',
    options: [
      { id: 'a', text: 'Segmentul este prea lung (cabluri peste limită sau prea multe hub-uri), deci coliziunile ajung la emițător după slot time', correct: true, why: 'Diametrul rețelei e limitat ca un semnal să facă dus-întors în 512 biți. Cablu peste 100 m sau prea multe repetoare → coliziunile sunt detectate prea târziu.' },
      { id: 'b', text: 'Un capăt este full-duplex', correct: false, why: 'Enunțul precizează că duplexul este half peste tot. Fără mismatch, rămâne cauza „distanță”.' },
      { id: 'c', text: 'Congestie pe uplink', correct: false, why: 'Congestia nu produce late collisions; produce output drops.' },
      { id: 'd', text: 'MTU prea mic', correct: false, why: 'MTU-ul nu influențează momentul la care o coliziune ajunge la emițător.' },
    ],
    explanation: 'Late collisions au două cauze clasice: duplex mismatch (cea mai frecventă azi) și segment/cablu prea lung (cazul clasic de pe vremea hub-urilor).',
  },
  {
    id: '1.4-024', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['collisions'],
    stem: 'Pe Ethernet half-duplex, ce se întâmplă cu un cadru care suferă **16 coliziuni consecutive**?',
    options: [
      { id: 'a', text: 'Este aruncat de placa de rețea (excessive collisions)', correct: true, why: 'CSMA/CD renunță după 16 încercări; cadrul este aruncat și numărat ca Excess-Col. Recuperarea, dacă există, vine de la protocoalele superioare (TCP).' },
      { id: 'b', text: 'Este trimis forțat, fără verificarea mediului', correct: false, why: 'Ethernet nu are un mod „forțat”; ar provoca încă o coliziune.' },
      { id: 'c', text: 'Interfața trece automat în full-duplex', correct: false, why: 'Duplexul nu se schimbă din cauza coliziunilor.' },
      { id: 'd', text: 'Portul devine err-disabled', correct: false, why: 'Coliziunile excesive nu sunt o cauză obișnuită de err-disabled.' },
    ],
    explanation: 'Contoarele de switch: Single-Col, Multi-Col (trimise după una / mai multe coliziuni), Excess-Col (aruncate după 16), Late-Col.',
  },
  {
    id: '1.4-025', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['collisions'],
    stem: 'De ce are un cadru Ethernet o dimensiune minimă de 64 de octeți?',
    options: [
      { id: 'a', text: 'Pentru ca emițătorul să încă transmită când vestea unei coliziuni de la capătul cel mai îndepărtat ajunge înapoi la el', correct: true, why: '64 de octeți = 512 biți = [[slot-time|slot time]]. Dacă un cadru s-ar termina mai devreme, emițătorul n-ar mai afla că s-a lovit și n-ar retransmite.' },
      { id: 'b', text: 'Pentru că antetul IP are 64 de octeți', correct: false, why: 'Antetul IPv4 minim are 20 de octeți. Minimul de 64 este o regulă de nivel 2 / CSMA/CD.' },
      { id: 'c', text: 'Pentru a reduce numărul de broadcast-uri', correct: false, why: 'Dimensiunea minimă nu are legătură cu broadcast-urile.' },
      { id: 'd', text: 'Pentru că FCS-ul are 64 de octeți', correct: false, why: 'FCS-ul are 4 octeți (CRC-32).' },
    ],
    explanation: 'Cadrele prea scurte se completează cu padding. Un cadru primit sub 64 de octeți (cu CRC greșit) este un runt.',
  },

  // ======================= duplex și viteză =======================
  {
    id: '1.4-026', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['duplex'],
    stem: 'Portul unui switch este configurat `speed 100` și `duplex full`. PC-ul conectat are placa de rețea pe auto (10/100/1000). Ce vor folosi capetele?',
    options: [
      { id: 'a', text: 'Switch: 100/full · PC: 100/half → duplex mismatch', correct: true, why: 'Switch-ul hard-codat nu mai negociază. PC-ul detectează viteza prin [[parallel-detection|parallel detection]] (100), dar nu poate afla duplexul și presupune half.' },
      { id: 'b', text: 'Ambele: 100/full', correct: false, why: 'Ar fi adevărat doar dacă PC-ul ar fi și el fixat pe 100/full. Partea auto nu are de unde ști că celălalt capăt e full.' },
      { id: 'c', text: 'Ambele: 1000/full', correct: false, why: 'Switch-ul este fixat pe 100; nu se poate ajunge la 1000.' },
      { id: 'd', text: 'Legătura rămâne down', correct: false, why: 'Viteza se detectează corect (100), deci legătura se ridică. Doar duplexul e greșit.' },
    ],
    explanation: 'Capcana nr. 1 din 1.4: un capăt fix + un capăt auto = mismatch (la 10/100). Recomandarea Cisco: auto pe ambele sau aceleași valori fixe pe ambele.',
  },
  {
    id: '1.4-027', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['duplex'],
    stem: 'Output: `Half-duplex, 100Mb/s` · `0 runts` · `312 input errors, 288 CRC` · `6721 collisions` · `1984 late collision`. Utilizatorul se plânge de transferuri lente. Ce indică?',
    options: [
      { id: 'a', text: 'Acesta este capătul half-duplex al unui duplex mismatch', correct: true, why: 'Late collisions pe un port half legat punct-la-punct = celălalt capăt transmite fără să asculte (e full). Semnătura clasică a părții half.' },
      { id: 'b', text: 'Acesta este capătul full-duplex al unui duplex mismatch', correct: false, why: 'Portul e chiar half-duplex. Un port full nu numără coliziuni.' },
      { id: 'c', text: 'Congestie normală', correct: false, why: 'Congestia nu produce late collisions.' },
      { id: 'd', text: 'Speed mismatch', correct: false, why: 'Cu speed mismatch legătura ar fi down, deci n-ar exista trafic și contoare care cresc.' },
    ],
    explanation: 'De memorat: partea HALF → collisions + late collisions; partea FULL → CRC/FCS + runts, zero coliziuni.',
  },
  {
    id: '1.4-028', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['duplex'],
    stem: 'Într-un duplex mismatch, pe care capăt apar de obicei **runts și erori CRC/FCS**, fără coliziuni?',
    options: [
      { id: 'a', text: 'Pe capătul full-duplex', correct: true, why: 'Partea half își abandonează cadrele când „simte” trafic în timp ce emite. Capătul full primește fragmentele: sub 64 B = runts, oricum cu FCS greșit = CRC. Un port full nu numără coliziuni.' },
      { id: 'b', text: 'Pe capătul half-duplex', correct: false, why: 'Partea half este cea care numără collisions și late collisions. (În realitate poate avea și unele CRC-uri, dar semnătura de examen e late collisions.)' },
      { id: 'c', text: 'Pe ambele capete în mod egal', correct: false, why: 'Capetele au semnături diferite — tocmai asta te ajută să afli care capăt e greșit configurat.' },
      { id: 'd', text: 'Pe niciun capăt; mismatch-ul nu produce erori', correct: false, why: 'Produce, iar aceste erori sunt cauza încetinirii.' },
    ],
    explanation: 'Mecanismul: full transmite oricând → half crede că e coliziune, se oprește (late collision) → full primește fragmente (runts, CRC).',
  },
  {
    id: '1.4-029', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['duplex'],
    stem: 'Care afirmație descrie corect simptomele unui **duplex mismatch**?',
    options: [
      { id: 'a', text: 'Legătura este up/up, ping-ul de obicei merge, dar transferurile sunt foarte lente și apar erori în contoare', correct: true, why: 'Pachetele mici trec de cele mai multe ori; transferurile mari se lovesc de coliziuni și fragmente. De aceea mismatch-ul e „insidios”.' },
      { id: 'b', text: 'Legătura este down/down pe ambele capete', correct: false, why: 'Asta e speed mismatch (sau cablu defect).' },
      { id: 'c', text: 'Portul devine imediat administratively down', correct: false, why: 'Starea „administratively down” apare doar după shutdown.' },
      { id: 'd', text: 'Legătura funcționează perfect, doar LED-ul are altă culoare', correct: false, why: 'Mismatch-ul afectează puternic performanța, nu doar indicatorii.' },
    ],
    explanation: 'Cine se bazează doar pe `show ip interface brief` (up/up) și pe ping nu observă mismatch-ul. Ai nevoie de `show interfaces` (duplex + contoare) sau de mesajul CDP.',
  },
  {
    id: '1.4-030', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['duplex', 'commands'],
    stem: 'În `show interfaces status`, portul Gi0/3 arată `Duplex: a-half` și `Speed: a-100`. Ce înseamnă prefixul „a-”?',
    options: [
      { id: 'a', text: 'Valoarea a fost obținută automat (autonegociere / detecție), nu configurată manual', correct: true, why: '„a-” = auto. Fără prefix (`full`, `100`) = hard-codat. Aici portul e pe auto și a ajuns la half/100 — tipic când celălalt capăt e fixat 100/full.' },
      { id: 'b', text: 'Portul este în modul access', correct: false, why: 'Modul access/trunk apare în coloana Vlan (număr VLAN sau „trunk”), nu ca prefix al duplexului.' },
      { id: 'c', text: 'Valoarea este „alternativă”, folosită doar la eroare', correct: false, why: 'Nu există un astfel de concept; „a-” = auto.' },
      { id: 'd', text: 'Portul este administratively down', correct: false, why: 'Starea administrativă apare în coloana Status („disabled”).' },
    ],
    explanation: '`a-half a-100` pe un port de switch legat la un singur dispozitiv aproape sigur înseamnă: celălalt capăt e hard-codat, iar acest capăt a presupus half. Suspectează mismatch.',
  },
  {
    id: '1.4-031', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['speed'],
    stem: 'SW1 Gi0/1 are `speed 100`, iar SW2 Gi0/1 are `speed 1000`. Cablul este testat și bun. Ce stare vei vedea?',
    options: [
      { id: 'a', text: 'down/down (notconnect) pe ambele switch-uri', correct: true, why: 'La [[speed-mismatch|speed mismatch]], semnalele sunt codate diferit și capetele nu se înțeleg deloc la nivelul 1.' },
      { id: 'b', text: 'up/up cu late collisions', correct: false, why: 'Asta e semnătura unui duplex mismatch (la aceeași viteză).' },
      { id: 'c', text: 'up/up la 100 Mb/s pe ambele', correct: false, why: 'Ambele capete sunt fixate; niciunul nu se adaptează la celălalt.' },
      { id: 'd', text: 'err-disabled pe ambele', correct: false, why: 'Speed mismatch nu este o cauză de err-disabled; legătura pur și simplu nu se ridică.' },
    ],
    explanation: 'Speed mismatch → down. Duplex mismatch → up, dar lent. Dacă o parte ar fi pe auto, ar detecta viteza celeilalte (parallel detection) și legătura s-ar ridica.',
  },
  {
    id: '1.4-032', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['duplex', 'commands'],
    stem: 'Pe consola unui switch apare `%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on FastEthernet0/24 (not full duplex), with SW2 FastEthernet0/24 (full duplex).` Ce face CDP în această situație?',
    options: [
      { id: 'a', text: 'Doar detectează și raportează nepotrivirea; corectarea trebuie făcută de administrator', correct: true, why: '[[cdp|CDP]] schimbă informații între vecini (inclusiv duplexul) și semnalează diferența, dar nu modifică configurația. Cisco precizează explicit că mesajul nu rezolvă problema.' },
      { id: 'b', text: 'Corectează automat duplexul pe ambele capete', correct: false, why: 'CDP este un protocol de descoperire, nu de configurare.' },
      { id: 'c', text: 'Pune portul în err-disabled', correct: false, why: 'Mesajul este de nivel 4 (warning); portul rămâne up/up.' },
      { id: 'd', text: 'Înseamnă că legătura este down', correct: false, why: 'Mesajul apare tocmai pentru că legătura e activă și CDP poate comunica cu vecinul.' },
    ],
    explanation: 'CDP vede problema pentru că ambele capete sunt echipamente Cisco. Cu un PC sau un echipament non-Cisco nu primești acest ajutor — trebuie să citești contoarele.',
  },
  {
    id: '1.4-033', topicId: T, sub: S, type: 'multi', difficulty: 1, tags: ['duplex'],
    stem: 'Care DOUĂ practici recomandă Cisco pentru a evita problemele de viteză/duplex pe o legătură?',
    options: [
      { id: 'a', text: 'Autonegociere (`speed auto`, `duplex auto`) pe ambele capete', correct: true, why: 'Ambele capete negociază și aleg cea mai bună combinație comună, full-duplex. Este varianta recomandată pentru echipamentele moderne.' },
      { id: 'b', text: 'Aceleași valori fixe (de exemplu 100/full) pe ambele capete', correct: true, why: 'Dacă ai motive să hard-codezi, fă-o identic la ambele capete; altfel apare mismatch.' },
      { id: 'c', text: 'Un capăt fix 100/full, celălalt pe auto', correct: false, why: 'Exact combinația care produce duplex mismatch: partea auto ajunge pe 100/half.' },
      { id: 'd', text: 'Half-duplex pe toate porturile, ca să fie compatibile', correct: false, why: 'Half-duplex înseamnă coliziuni și performanță redusă; pe link-uri switch-uite nu are sens.' },
    ],
    explanation: 'Regula de aur: „auto–auto” sau „fix–fix identic”. Niciodată „fix–auto”.',
  },
  {
    id: '1.4-034', topicId: T, sub: S, type: 'order', difficulty: 2, tags: ['flow'],
    stem: 'Ordonează pașii logici pentru a depana o legătură Ethernet despre care utilizatorii spun că „merge greu”.',
    items: [
      { text: 'Verifici starea: `show ip interface brief` / `show interfaces status` (up/up? connected?)', why: 'Întâi confirmi că legătura e activă și nu e shutdown/err-disabled.' },
      { text: 'Compari viteza și duplexul la ambele capete (`a-half`? `full`?)', why: 'Un capăt half pe o legătură punct-la-punct = suspect de mismatch.' },
      { text: 'Citești contoarele cu `show interfaces` (CRC, runts, collisions, late collision, drops)', why: 'Contoarele îți spun în ce grupă e problema: fizic, duplex sau congestie.' },
      { text: '`clear counters` și verifici dacă erorile cresc', why: 'Confirmi că problema e activă, nu istorie veche.' },
      { text: 'Aplici remedierea (duplex/viteză, cablu, port) și reverifici contoarele', why: 'Fără reverificare nu știi dacă ai rezolvat cauza.' },
    ],
    explanation: 'De jos în sus și din date: stare → configurare speed/duplex → contoare → confirmare că cresc → corecție → verificare.',
  },
  {
    id: '1.4-035', topicId: T, sub: S, type: 'cli', difficulty: 1, tags: ['commands'],
    stem: 'Ești în modul de configurare al interfeței. Ce comandă fixează duplexul pe full?',
    prompt: 'SW1(config-if)#', canonical: 'duplex full',
    answers: ['duplex full', 'dup full', 'duplex f', 'duplex ful'],
    hint: 'cuvântul cheie este chiar numele proprietății',
    wrong: [
      { text: 'full-duplex', why: 'Sintaxa IOS este `duplex full`. `full-duplex` apare doar în output-ul `show interfaces`.' },
      { text: 'speed full', why: '`speed` acceptă valori de viteză (10, 100, 1000, auto), nu duplexul.' },
      { text: 'duplex auto', why: 'Asta repune autonegocierea duplexului, nu îl fixează pe full.' },
    ],
    explanation: 'Perechea de comenzi: `speed 10|100|1000|auto` și `duplex half|full|auto`. Pe porturi de 1 Gb/s, Cisco nu permite half-duplex.',
  },
  {
    id: '1.4-036', topicId: T, sub: S, type: 'cli', difficulty: 1, tags: ['commands'],
    stem: 'Ce comandă afișează pe un switch Catalyst, într-un singur tabel, toate porturile cu Status (connected/notconnect/disabled/err-disabled), VLAN, Duplex și Speed?',
    prompt: 'SW1#', canonical: 'show interfaces status',
    answers: ['show interfaces status', 'show interface status', 'sh int status', 'sh int stat', 'show int status', 'sh interfaces status'],
    hint: 'show interfaces …',
    wrong: [
      { text: 'show ip interface brief', why: 'Arată adresă IP, Status și Protocol, dar nu VLAN, duplex sau viteză.' },
      { text: 'show interfaces', why: 'Afișează totul, detaliat, pentru fiecare interfață — util pentru contoare, dar nu un tabel compact.' },
      { text: 'show vlan brief', why: 'Arată VLAN-urile și porturile lor, fără duplex/viteză/stare.' },
    ],
    explanation: '`show interfaces status` e cea mai rapidă privire de ansamblu pe un switch: „a-” la duplex/speed = negociat automat.',
  },
  {
    id: '1.4-037', topicId: T, sub: S, type: 'cli', difficulty: 2, tags: ['commands'],
    stem: 'Vrei să resetezi la zero contoarele (CRC, collisions etc.) ale interfeței GigabitEthernet0/1, ca să vezi dacă erorile mai cresc. Ce comandă dai în modul privileged EXEC?',
    prompt: 'SW1#', canonical: 'clear counters gigabitethernet0/1',
    answers: ['clear counters gigabitethernet0/1', 'clear counters gigabitethernet 0/1', 'clear counters gi0/1', 'clear counters g0/1', 'clear counters gi 0/1', 'clear counters g 0/1', 'clear counters', 'clear counters gig0/1'],
    hint: 'clear …',
    wrong: [
      { text: 'clear interface gigabitethernet0/1', why: '`clear interface` resetează hardware-ul interfeței (o „repornește”), nu e comanda pentru contoare și poate întrerupe traficul.' },
      { text: 'no counters', why: 'Nu există această comandă.' },
      { text: 'reload', why: 'Repornește tot echipamentul — total disproporționat.' },
    ],
    explanation: '`clear counters` (fără argument = toate interfețele; IOS cere confirmare) sau `clear counters <interfață>`. Apoi „Last clearing of counters” arată de cât timp numeri.',
  },
  {
    id: '1.4-038', topicId: T, sub: S, type: 'cli', difficulty: 3, tags: ['commands', 'err-disabled'],
    stem: 'Ce comandă listează doar porturile aflate în starea err-disabled (cu motivul, în coloana Reason)?',
    prompt: 'SW1#', canonical: 'show interfaces status err-disabled',
    answers: ['show interfaces status err-disabled', 'show interface status err-disabled', 'sh int status err-disabled', 'sh int stat err-disabled', 'show int status err-disabled', 'sh int status err'],
    hint: 'adaugi un filtru la comanda care afișează tabelul de porturi',
    wrong: [
      { text: 'show errdisable recovery', why: 'Arată ce cauze au recuperare automată activată și timer-ul — utilă, dar nu listează porturile err-disabled cu motivul.' },
      { text: 'show interfaces err-disabled', why: 'Sintaxa corectă trece prin `status`: `show interfaces status err-disabled`.' },
      { text: 'show ip interface brief', why: 'Arată down/down fără să explice că e err-disabled și de ce.' },
    ],
    explanation: 'Flux err-disabled: `show interfaces status err-disabled` (ce port, ce cauză) → repari → `shutdown` / `no shutdown`. Automat: `errdisable recovery cause <cauză>` + `errdisable recovery interval <sec>`.',
  },

  // ======================= cabluri =======================
  {
    id: '1.4-039', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['cable'],
    stem: 'Un tehnician a tras un cablu UTP Cat6 de 130 m între două switch-uri. Link-ul se ridică uneori, cade des și arată CRC-uri. Care e problema principală?',
    options: [
      { id: 'a', text: 'Lungimea depășește limita de 100 m pentru Ethernet pe cupru', correct: true, why: 'Pentru 10BASE-T … 1000BASE-T (și 10GBASE-T pe Cat6A), limita este 100 m. Peste ea semnalul se atenuează, apar erori și link-ul devine instabil. Soluții: fibră sau un switch intermediar.' },
      { id: 'b', text: 'Cat6 nu suportă Gigabit Ethernet', correct: false, why: 'Cat6 suportă fără probleme 1000BASE-T (chiar și Cat5e îl suportă).' },
      { id: 'c', text: 'Trebuie folosit un cablu rollover', correct: false, why: 'Rollover este pentru consolă, nu pentru legături Ethernet de date.' },
      { id: 'd', text: 'Este un duplex mismatch', correct: false, why: 'Nimic din enunț nu indică duplex diferit; simptomele (CRC, flap-uri) și lungimea indică problema fizică.' },
    ],
    explanation: 'Simptomele unui cablu prea lung: CRC, link flaps, uneori late collisions (pe half-duplex), uneori negociere la o viteză mai mică.',
  },
  {
    id: '1.4-040', topicId: T, sub: S, type: 'match', difficulty: 2, tags: ['cable'],
    stem: 'Potrivește problema fizică cu simptomul ei cel mai tipic.',
    leftLabel: 'Problemă', rightLabel: 'Simptom tipic',
    pairs: [
      { left: 'Cablu UTP pozat lângă motoare și cabluri de forță', right: 'CRC în creștere, zero coliziuni', why: 'EMI corupe biții pe fir; full-duplex fără coliziuni → „excessive noise”.' },
      { left: 'Cablu straight-through între două switch-uri vechi, fără Auto-MDIX', right: 'down/down (notconnect)', why: 'TX ajunge pe TX; nimeni nu aude pe nimeni → nu există link.' },
      { left: 'Conector RJ45 slăbit / sertizat prost', right: 'Link flaps și interface resets', why: 'Contactul intermitent face legătura să cadă și să revină.' },
      { left: 'Fibră: TX și RX inversate la un capăt', right: 'Fără link pe fibră (down/down)', why: 'Lumina emisă nu ajunge la receptorul celuilalt capăt.' },
    ],
    distractors: [{ text: 'Output drops mari', why: 'Output drops = congestie. Niciuna dintre problemele fizice listate nu produce, în primul rând, cozi pline.' }],
    explanation: 'Gândește în simptome: fără link (cablu greșit/rupt, speed mismatch, fibră inversată), link instabil (conector, lungime), erori CRC (EMI, cablu deteriorat).',
  },
  {
    id: '1.4-041', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['cable'],
    stem: 'Un port de 100BASE-TX dintr-o clădire veche are multe erori CRC. Inspectând, descoperi că legătura folosește cablu **Cat3**. Ce concluzie tragi?',
    options: [
      { id: 'a', text: 'Cat3 nu este potrivit pentru 100BASE-TX; zgomotul și atenuarea produc erori — înlocuiești cu Cat5e sau mai bun', correct: true, why: 'Cisco listează explicit „Cat3 folosit pentru 100BASE-TX” printre cauzele de zgomot excesiv (CRC mari, coliziuni puține). Cat3 era gândit pentru 10BASE-T și telefonie.' },
      { id: 'b', text: 'Este normal; Cat3 e făcut pentru 100 Mb/s', correct: false, why: 'Cat3 este specificat pentru frecvențe joase (≈16 MHz), suficiente pentru 10BASE-T, nu pentru 100BASE-TX.' },
      { id: 'c', text: 'Trebuie activat half-duplex', correct: false, why: 'Duplexul nu repară calitatea slabă a cablului; erorile CRC rămân.' },
      { id: 'd', text: 'Trebuie mărit MTU-ul', correct: false, why: 'MTU-ul nu are nicio legătură cu calitatea semnalului pe cablu.' },
    ],
    explanation: 'Categoria cablului trebuie să corespundă vitezei (vezi tabelul de categorii din 1.3). Un cablu sub-dimensionat dă CRC, nu coliziuni.',
  },
  {
    id: '1.4-042', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['err-disabled', 'commands'],
    stem: 'Vrei ca porturile puse în err-disabled de port security să se reactiveze singure după 5 minute. Ce configurezi?',
    options: [
      { id: 'a', text: '`errdisable recovery cause psecure-violation` și `errdisable recovery interval 300`', correct: true, why: 'Prima comandă activează recuperarea automată pentru cauza „psecure-violation”, a doua stabilește timer-ul (în secunde; 300 este și valoarea implicită). Atenție: dacă problema persistă, portul cade din nou.' },
      { id: 'b', text: '`no shutdown` cu un timer de 300', correct: false, why: '`no shutdown` nu are opțiune de timer.' },
      { id: 'c', text: '`clear counters` la fiecare 5 minute', correct: false, why: 'Contoarele nu influențează starea err-disabled.' },
      { id: 'd', text: '`switchport port-security violation shutdown`', correct: false, why: 'Aceasta este chiar acțiunea care pune portul în err-disabled (implicită), nu recuperarea.' },
    ],
    explanation: 'Recuperarea automată e comodă, dar nu repară cauza. Cisco: „problema reapare până când cauza este găsită”. Detalii de port security în 5.7.',
  },
  {
    id: '1.4-043', topicId: T, sub: S, type: 'order', difficulty: 2, tags: ['err-disabled'],
    stem: 'Un port a intrat în err-disabled. Ordonează pașii corecți de recuperare manuală.',
    items: [
      { text: 'Identifici portul și cauza (`show interfaces status err-disabled`, log-ul `%PM-4-ERR_DISABLE`)', why: 'Fără cauză, orice reactivare e o loterie: portul poate cădea imediat din nou.' },
      { text: 'Elimini cauza (dispozitivul neautorizat, bucla, configurația EtherChannel greșită…)', why: 'Cisco: problema reapare până când cauza este rezolvată.' },
      { text: '`shutdown` pe interfață', why: 'Primul pas al „resetării” administrative a portului.' },
      { text: '`no shutdown` pe interfață', why: 'Portul pornește din nou și renegociază legătura.' },
      { text: 'Verifici: `show interfaces status` arată `connected`, iar utilizatorul are conectivitate', why: 'Confirmi că reparația a funcționat și că portul nu recade.' },
    ],
    explanation: 'Alternativa automată: `errdisable recovery cause <cauză>` + `errdisable recovery interval <secunde>` — dar nici ea nu înlocuiește pasul 2.',
  },
];
