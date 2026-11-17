import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.7 Describe physical infrastructure connections of WLAN components.
// Obiectivul oficial nu are sub-puncte; `sub` este '2.7'. Fiecare variantă are explicație (why).
const T = '2.7';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_7: Question[] = [
  // ======================= AP =======================
  single({ id: '2.7-001' }, 1, 'Ce tip de port de switch folosești pentru un AP lightweight în modul Local?', [
    ['Access, în VLAN-ul de management al AP-urilor', true, 'Datele clienților sunt încapsulate în CAPWAP, deci portul vede un singur VLAN.'],
    ['Trunk cu toate VLAN-urile', false, 'Nu este necesar în modul Local.'],
    ['Port rutat (no switchport)', false, 'AP-ul nu este un echipament de nivel 3 pe port.'],
    ['Port în EtherChannel', false, 'Un AP standard are un singur link.'],
  ], 'Local ⇒ access.'),
  single({ id: '2.7-002' }, 2, 'Un AP FlexConnect cu local switching pe mai multe VLAN-uri. Ce port de switch?', [
    ['Trunk 802.1Q cu VLAN-urile necesare', true, 'AP-ul termină VLAN-urile clienților local.'],
    ['Access în VLAN 1', false, 'Ar pierde VLAN-urile clienților.'],
    ['Access în VLAN-ul de voce', false, 'Nu acoperă mai multe VLAN-uri.'],
    ['Port rutat', false, 'Nu transportă VLAN-uri.'],
  ], 'Flex ⇒ trunk.'),
  single({ id: '2.7-003' }, 1, 'Cum primește un AP lightweight alimentarea electrică în cele mai multe instalări?', [
    ['Prin PoE de la switch (sau injector)', true, 'Un singur cablu pentru date și putere.'],
    ['Printr-un cablu console', false, 'Console nu alimentează.'],
    ['Prin fibră optică', false, 'Fibra nu transportă putere electrică.'],
    ['Doar de la o baterie internă', false, 'AP-urile sunt alimentate permanent.'],
  ], 'PoE.'),
  single({ id: '2.7-004' }, 2, 'Distanța maximă a unui cablu UTP între switch și AP este de:', [
    ['100 m', true, 'Limita Ethernet pe cupru (1.3).'],
    ['10 m', false, 'Prea puțin.'],
    ['300 m', false, 'Depășește limita pe cupru.'],
    ['1 km', false, 'Posibil doar pe fibră.'],
  ], '100 m.'),
  single({ id: '2.7-005' }, 2, 'De ce se activează PortFast pe portul unui AP?', [
    ['Ca AP-ul să nu aștepte STP la pornire și să-și găsească rapid WLC-ul', true, 'Portul trece direct în Forwarding.'],
    ['Pentru a crește puterea PoE', false, 'Nu are legătură.'],
    ['Pentru a converti portul în trunk', false, 'PortFast nu schimbă modul.'],
    ['Pentru a dezactiva CAPWAP', false, 'Nu are legătură.'],
  ], 'Edge port.'),
  single({ id: '2.7-006' }, 2, 'Un AP este conectat la un port în VLAN-ul greșit. Care este efectul probabil?', [
    ['Nu primește IP/nu găsește WLC și nu se alătură', true, 'DHCP și ruta sunt pe VLAN-ul potrivit.'],
    ['Funcționează normal', false, 'VLAN-ul determină DHCP-ul primit.'],
    ['Devine automat FlexConnect', false, 'Modul nu se schimbă singur.'],
    ['Se oprește alimentarea PoE', false, 'PoE nu depinde de VLAN.'],
  ], 'VLAN greșit ⇒ fără join.'),
  single({ id: '2.7-007' }, 2, 'Un AP autonom are trei SSID-uri mapate pe VLAN-uri diferite. Portul de switch?', [
    ['Trunk', true, 'AP-ul mapează direct SSID → VLAN.'],
    ['Access', false, 'Ar trece un singur VLAN.'],
    ['Rutat', false, 'Nu transportă VLAN-uri.'],
    ['Nu contează', false, 'Contează: fără trunk, SSID-urile nu ajung în VLAN-urile lor.'],
  ], 'Autonomous multi-VLAN ⇒ trunk.'),
  single({ id: '2.7-008' }, 2, 'Ce afirmație este corectă despre un AP în modul Local pe un port trunk?', [
    ['Funcționează, dar trunk-ul nu este necesar; datele clienților merg oricum în CAPWAP', true, 'VLAN-urile clienților nu sunt vizibile pe port.'],
    ['Nu funcționează deloc', false, 'Trunk-ul poate funcționa, dar este redundant.'],
    ['Devine FlexConnect', false, 'Modul se alege pe WLC.'],
    ['Pierde PoE', false, 'Nu este legat.'],
  ], 'Local nu depinde de trunk.'),
  single({ id: '2.7-009' }, 3, 'Ce trebuie să existe pe VLAN-ul AP-urilor pentru ca un AP să se alăture unui WLC?', [
    ['DHCP (și rută spre WLC), cu UDP 5246/5247 permise', true, 'Pentru IP, descoperire și tuneluri CAPWAP.'],
    ['Un server DNS extern obligatoriu', false, 'DNS este una dintre variante, nu obligatoriu.'],
    ['Un server RADIUS', false, 'Nu este cerut pentru join.'],
    ['IPv6 obligatoriu', false, 'IPv4 este suficient.'],
  ], 'DHCP + rută + UDP.'),
  multi({ id: '2.7-010' }, 2, 'Care sunt condiții de infrastructură pentru un AP care se alătură? (alege trei)', [
    ['Alimentare PoE suficientă', true, 'Fără putere AP-ul nu pornește complet.'],
    ['Port în VLAN-ul corect', true, 'Determină DHCP-ul și accesul la WLC.'],
    ['UDP 5246/5247 permise către WLC', true, 'CAPWAP control și date.'],
    ['Port în EtherChannel LACP', false, 'Nu este cerut.'],
    ['IP static pe fiecare client', false, 'Nu are legătură.'],
  ], 'Putere, VLAN, UDP.'),

  // ======================= WLC porturi/interfețe =======================
  single({ id: '2.7-011' }, 1, 'Care port al unui WLC este folosit pentru management out-of-band?', [
    ['Service port', true, 'Management separat de rețeaua de date.'],
    ['Distribution system port', false, 'Este port de date.'],
    ['Redundancy port', false, 'Leagă două WLC-uri.'],
    ['Console port', false, 'Este acces CLI local, nu rețea OOB.'],
  ], 'Service port = OOB.'),
  single({ id: '2.7-012' }, 1, 'Ce face redundancy port-ul?', [
    ['Leagă două WLC-uri într-o pereche HA', true, 'Sincronizare de stare.'],
    ['Conectează AP-urile', false, 'AP-urile folosesc porturile de date.'],
    ['Oferă acces CLI', false, 'Console.'],
    ['Conectează clienții wireless', false, 'Clienții folosesc AP-urile.'],
  ], 'RP = HA.'),
  single({ id: '2.7-013' }, 2, 'Care port al WLC-ului transportă traficul AP-urilor și al clienților?', [
    ['Distribution system ports', true, 'Porturile de date.'],
    ['Service port', false, 'Management OOB.'],
    ['Console', false, 'CLI local.'],
    ['Redundancy port', false, 'Redundancy port este pentru perechea HA de WLC-uri, nu pentru management out-of-band.'],
  ], 'DS ports.'),
  single({ id: '2.7-014' }, 2, 'Cum se leagă service port-ul la switch?', [
    ['Port access într-un VLAN OOB', true, 'Nu trunk.'],
    ['Port trunk cu toate VLAN-urile', false, 'Service port nu etichetează VLAN-uri.'],
    ['În LAG cu porturile de date', false, 'Nu face parte din LAG.'],
    ['Direct la un AP', false, 'Nu are legătură cu AP-urile.'],
  ], 'Access.'),
  single({ id: '2.7-015' }, 2, 'Ce rol are o interfață dinamică (dynamic interface) a WLC-ului?', [
    ['Mapează un WLAN pe un VLAN și o subrețea', true, 'Clientul primește IP din acea subrețea.'],
    ['Este adresa de management principală', false, 'Aceea este interfața management.'],
    ['Este adresă de test, nerutată', false, 'Aceea este interfața virtuală.'],
    ['Este port fizic de redundanță', false, 'Nu este port.'],
  ], 'Dynamic = WLAN ↔ VLAN.'),
  single({ id: '2.7-016' }, 2, 'Ce reprezintă interfața virtual a WLC-ului (de exemplu 192.0.2.1)?', [
    ['O adresă logică folosită pentru DHCP relay, web auth și mobilitate', true, 'Aceeași pe controllerele dintr-un grup de mobilitate.'],
    ['Adresa AP-urilor', false, 'AP-urile au adrese proprii.'],
    ['Adresa serverului RADIUS', false, 'Nu este.'],
    ['Adresa gateway-ului clienților', false, 'Gateway-ul este în rețea.'],
  ], 'Virtual = logic.'),
  single({ id: '2.7-017' }, 2, 'Care interfață a WLC-ului este adresa principală pentru management in-band și comunicația cu AP-urile?', [
    ['Management interface', true, 'AP-urile își găsesc WLC-ul la această adresă.'],
    ['Virtual interface', false, 'Este logică, pentru servicii.'],
    ['Service-port interface', false, 'Este OOB.'],
    ['Dynamic interface', false, 'Este pentru clienți.'],
  ], 'Management.'),
  { id: '2.7-018', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește portul/interfața WLC cu rolul lui.',
    leftLabel: 'Element', rightLabel: 'Rol',
    pairs: [
      { left: 'Service port', right: 'Management out-of-band', why: 'Acces separat de rețeaua de date.' },
      { left: 'Distribution system port', right: 'Trafic de date (CAPWAP, clienți), trunk', why: 'Porturile de date.' },
      { left: 'Redundancy port', right: 'Legătura dintre WLC-uri HA', why: 'Redundancy port sincronizează starea și configurația între cele două WLC-uri.' },
      { left: 'Dynamic interface', right: 'Mapare WLAN ↔ VLAN', why: 'Câte una pe VLAN de clienți.' },
    ],
    distractors: [{ text: 'Conectează AP-urile prin radio', why: 'Nu este rolul unui port al WLC-ului.' }],
    explanation: 'Porturi fizice vs interfețe logice.' },
  single({ id: '2.7-019' }, 2, 'Un client se asociază la SSID-ul GUEST, dar nu primește IP. VLAN-ul 30 este mapat pe WLAN. Ce verifici primul?', [
    ['Dacă VLAN 30 este permis pe trunk-ul dintre WLC și switch și dacă DHCP-ul funcționează', true, 'Cadrele din VLAN 30 trebuie să treacă și să ajungă la DHCP.'],
    ['Dacă AP-ul este în modul Sniffer', false, 'Un AP Sniffer nu ar fi permis asocierea.'],
    ['Dacă WLC-ul are LAG', false, 'Nu este legat direct.'],
    ['Dacă clientul folosește IPv6', false, 'Nu este cauza probabilă.'],
  ], 'VLAN permis + DHCP.'),
  single({ id: '2.7-020' }, 3, 'Interfața de management a WLC-ului este untagged, iar switch-ul are trunk cu native VLAN 1. Ce se întâmplă?', [
    ['Managementul se rupe: cadrele untagged ajung în VLAN 1, nu în VLAN-ul de management', true, 'Native VLAN trebuie să coincidă.'],
    ['Nu se întâmplă nimic', false, 'Nepotrivirea are efect.'],
    ['AP-urile devin FlexConnect', false, 'Nu are legătură.'],
    ['WLC-ul se repornește', false, 'Nu este efectul.'],
  ], 'Native VLAN mismatch.'),

  // ======================= Trunk și LAG =======================
  single({ id: '2.7-021' }, 1, 'Ce este un LAG?', [
    ['Mai multe linkuri paralele tratate ca un singur link logic', true, 'Echivalentul EtherChannel.'],
    ['Un tip de AP', false, 'Nu este AP.'],
    ['Un protocol de rutare', false, 'Este agregare de linkuri.'],
    ['Un VLAN special', false, 'Nu este VLAN.'],
  ], 'LAG.'),
  single({ id: '2.7-022' }, 2, 'Cum se configurează switch-ul pentru LAG-ul unui WLC AireOS?', [
    ['channel-group N mode on', true, 'WLC-ul nu negociază; static.'],
    ['channel-group N mode active', false, 'LACP nu este suportat de AireOS.'],
    ['channel-group N mode desirable', false, 'PAgP nu este suportat.'],
    ['channel-group N mode passive', false, 'LACP nu este suportat.'],
  ], 'LAG la WLC = on.'),
  single({ id: '2.7-023' }, 2, 'Ce condiție impune LAG-ul WLC-ului față de porturile lui?', [
    ['Toate porturile LAG merg la același switch', true, 'Agregarea cere același echipament (sau stivă).'],
    ['Fiecare port merge la alt switch', false, 'LAG nu funcționează așa.'],
    ['Porturile trebuie să fie service port-uri', false, 'Service port nu intră în LAG.'],
    ['Pot fi doar două porturi', false, 'Nu există această limită.'],
  ], 'Același switch.'),
  single({ id: '2.7-024' }, 2, 'Ce se întâmplă după activarea LAG-ului pe un WLC AireOS?', [
    ['Trebuie repornit controller-ul pentru ca modificarea să se aplice', true, 'Aplicare la reboot.'],
    ['Se aplică instant, fără întrerupere', false, 'Cere reboot.'],
    ['Se dezactivează CAPWAP', false, 'CAPWAP rămâne.'],
    ['AP-urile se mută în modul Monitor', false, 'Nu are legătură.'],
  ], 'Reboot.'),
  single({ id: '2.7-025' }, 3, 'WLC-ul are două porturi de date, conectate la două switch-uri de distribuție diferite. Se poate folosi LAG?', [
    ['Nu: LAG cere același switch (sau stivă); porturile se configurează independent ca trunk-uri', true, 'Altfel nu se formează canalul.'],
    ['Da, cu LACP între switch-uri', false, 'AireOS nu folosește LACP.'],
    ['Da, cu PAgP', false, 'PAgP nu este suportat.'],
    ['Da, dar numai ca access', false, 'Datele clienților cer trunk.'],
  ], 'Același switch.'),
  { id: '2.7-026', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește dispozitivul/portul cu tipul de port de switch.',
    leftLabel: 'Conectat', rightLabel: 'Port de switch',
    pairs: [
      { left: 'AP lightweight Local', right: 'access', why: 'Un singur VLAN.' },
      { left: 'AP FlexConnect (local switching)', right: 'trunk', why: 'Mai multe VLAN-uri.' },
      { left: 'WLC data port', right: 'trunk', why: 'VLAN management + clienți.' },
      { left: 'WLC service port', right: 'access (VLAN OOB)', why: 'Management separat.' },
    ],
    distractors: [{ text: 'port rutat', why: 'Nu corespunde niciunuia dintre cazuri.' }],
    explanation: 'Access vs trunk.' },
  multi({ id: '2.7-027' }, 2, 'Care afirmații despre LAG-ul unui WLC AireOS sunt corecte? (alege trei)', [
    ['Este static (fără LACP/PAgP)', true, 'Switch-ul folosește mode on.'],
    ['Toate porturile merg la același switch', true, 'Condiție de agregare.'],
    ['Cere reboot pentru aplicare', true, 'Modificarea se aplică după repornire.'],
    ['Poate negocia LACP active/passive', false, 'AireOS nu negociază.'],
    ['Include și service port-ul', false, 'Service port nu face parte din LAG.'],
  ], 'Static, același switch, reboot.'),
  { id: '2.7-028', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Pe switch, pune porturile deja selectate (range) în canalul 1 în modul static, potrivit unui WLC AireOS.',
    prompt: 'SW-D(config-if-range)#', canonical: 'channel-group 1 mode on', answers: ['channel-group 1 mode on'], hint: 'channel-group …',
    wrong: [
      { text: 'channel-group 1 mode active', why: 'LACP nu este suportat de WLC-ul AireOS.' },
      { text: 'channel-group 1 mode desirable', why: 'PAgP nu este suportat.' },
      { text: 'channel-protocol lacp', why: 'Nu setează canalul și nu corespunde cerinței.' },
    ],
    explanation: 'mode on.' },
  { id: '2.7-029', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Configurează portul pentru un AP lightweight în modul Local ca access (modul portului).',
    prompt: 'SW-D(config-if)#', canonical: 'switchport mode access', answers: ['switchport mode access'], hint: 'switchport mode …',
    wrong: [
      { text: 'switchport mode trunk', why: 'Trunk este pentru FlexConnect.' },
      { text: 'switchport access vlan 100', why: 'Setează VLAN-ul, nu modul portului.' },
      { text: 'switchport nonegotiate', why: 'Dezactivează DTP, nu setează modul.' },
    ],
    explanation: 'switchport mode access.' },
  { id: '2.7-030', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Pe port-channel-ul spre WLC, permite doar VLAN-urile 10, 20, 30 și 100.',
    prompt: 'SW-D(config-if)#', canonical: 'switchport trunk allowed vlan 10,20,30,100', answers: ['switchport trunk allowed vlan 10,20,30,100'], hint: 'switchport trunk allowed …',
    wrong: [
      { text: 'switchport trunk allowed vlan add 10,20,30,100', why: 'Adaugă la lista existentă, nu o înlocuiește cu exact acestea.' },
      { text: 'switchport trunk native vlan 100', why: 'Setează VLAN-ul nativ, nu lista permisă.' },
      { text: 'switchport mode trunk', why: 'Setează modul trunk, nu VLAN-urile permise.' },
    ],
    explanation: 'allowed vlan înlocuiește lista.' },

  // ======================= Scenarii =======================
  single({ id: '2.7-031' }, 2, 'De ce nu transportă service port-ul traficul clienților?', [
    ['Este o interfață de management OOB; datele merg pe porturile de date', true, 'Separare între management și date.'],
    ['Este prea lent', false, 'Motivul este rolul, nu viteza.'],
    ['Este rezervat AP-urilor', false, 'Nu are legătură cu AP-urile.'],
    ['Este port de redundanță', false, 'Redundancy port este altceva.'],
  ], 'Rol OOB.'),
  single({ id: '2.7-032' }, 3, 'WLC-ul și AP-urile sunt în VLAN 100; clienții în VLAN 10. AP-urile sunt în modul Local. Ce VLAN-uri trebuie permise pe portul unui AP?', [
    ['Doar VLAN 100 (access)', true, 'Datele clienților merg în CAPWAP; WLC-ul pune traficul în VLAN 10.'],
    ['VLAN 10 și 100 (trunk)', false, 'Necesar doar la FlexConnect cu local switching.'],
    ['Toate VLAN-urile', false, 'Nu este necesar.'],
    ['Niciunul', false, 'AP-ul are nevoie de VLAN-ul de management.'],
  ], 'Local ⇒ doar mgmt.'),
  single({ id: '2.7-033' }, 2, 'Ce se întâmplă dacă lipsește VLAN 10 din baza VLAN a switch-ului de distribuție?', [
    ['Cadrele din VLAN 10 nu sunt comutate corect; clienții WLAN-ului nu primesc IP', true, 'VLAN-ul trebuie să existe și să fie permis pe trunk.'],
    ['Nu are efect', false, 'Are efect.'],
    ['Se creează automat pe toate switch-urile', false, 'Doar cu VTP; nu garantat.'],
    ['AP-urile se opresc', false, 'AP-urile sunt în alt VLAN.'],
  ], 'VLAN lipsă.'),
  single({ id: '2.7-034' }, 2, 'Care este avantajul unui LAG pe porturile WLC-ului?', [
    ['Bandă agregată și redundanță la căderea unui port', true, 'Același principiu ca EtherChannel.'],
    ['Eliminarea necesității trunk-ului', false, 'Trunk-ul rămâne.'],
    ['Creșterea numărului de VLAN-uri permise', false, 'Nu are legătură.'],
    ['Autentificarea AP-urilor', false, 'Nu este rol de LAG.'],
  ], 'Bandă și redundanță.'),
  single({ id: '2.7-035' }, 3, 'Porturile WLC-ului sunt în LAG, dar switch-ul are „channel-group 1 mode active”. Simptom probabil?', [
    ['Canalul nu se formează; WLC-ul devine inaccesibil pe porturile de date', true, 'WLC-ul nu răspunde la LACPDU.'],
    ['Funcționează perfect', false, 'LACP nu este suportat de AireOS.'],
    ['Se formează PAgP', false, 'active este LACP.'],
    ['Doar service port-ul se oprește', false, 'Service port nu este implicat.'],
  ], 'LACP vs static.'),
  single({ id: '2.7-036' }, 2, 'Ce reprezintă „AP-manager interface” în documentația mai veche AireOS?', [
    ['O interfață prin care AP-urile comunicau cu WLC-ul; în versiunile recente rolul e preluat de interfața management', true, 'Evoluție de design.'],
    ['Un port de redundanță', false, 'Nu este port.'],
    ['Un tip de AP', false, 'Nu este AP.'],
    ['Interfața pentru clienți', false, 'Aceea este dynamic interface.'],
  ], 'AP-manager (istoric).'),
  single({ id: '2.7-037' }, 2, 'De ce se recomandă „switchport trunk allowed vlan …” explicit spre WLC?', [
    ['Limitează trunk-ul doar la VLAN-urile necesare, reducând riscuri și trafic inutil', true, 'Bună practică.'],
    ['Pentru că altfel trunk-ul nu se formează', false, 'Se formează oricum.'],
    ['Pentru a activa PoE', false, 'Nu are legătură.'],
    ['Pentru a activa LAG', false, 'Nu are legătură.'],
  ], 'Bună practică.'),
  { id: '2.7-038', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează pașii pentru a pune un WLC AireOS în LAG cu un switch.',
    items: [
      { text: 'Configurezi pe switch port-channel în trunk și channel-group N mode on', why: 'Switch-ul pregătit pentru canal static.' },
      { text: 'Verifici că toate porturile WLC merg la același switch', why: 'Condiție de agregare.' },
      { text: 'Activezi LAG pe WLC (config lag enable / GUI)', why: 'Setarea se aplică la reboot.' },
      { text: 'Salvezi configurația și repornești WLC-ul', why: 'LAG intră în vigoare.' },
      { text: 'Verifici show etherchannel summary: Po(SU) cu toți membrii (P)', why: 'Po(SU) cu toți membrii (P) arată că EtherChannel-ul funcționează.' },
    ],
    explanation: 'Switch → verifică cabluri → LAG pe WLC → reboot → verificare.' },
  { id: '2.7-039', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează depanarea unui client care se asociază, dar nu primește IP.',
    items: [
      { text: 'Verifici ce interfață/VLAN este mapat WLAN-ului pe WLC', why: 'Punctul de plecare.' },
      { text: 'Verifici că VLAN-ul există pe switch și este permis pe trunk-ul spre WLC', why: 'Cadrele trebuie să treacă.' },
      { text: 'Verifici DHCP relay/server-ul interfeței dinamice', why: 'Fără el nu se dă IP.' },
      { text: 'Verifici poolul DHCP (adrese libere)', why: 'Un pool fără adrese libere nu mai poate da IP clienților.' },
      { text: 'La FlexConnect, verifici și VLAN-ul pe portul AP-ului', why: 'Local switching.' },
    ],
    explanation: 'WLAN → VLAN → trunk → DHCP → pool → Flex.' },
  multi({ id: '2.7-040' }, 3, 'Care afirmații despre porturile WLC sunt corecte? (alege trei)', [
    ['Portul de date este de obicei trunk 802.1Q', true, 'Poartă mai multe VLAN-uri.'],
    ['Service port-ul este access într-un VLAN de management OOB', true, 'Separat de date.'],
    ['Redundancy port-ul leagă WLC-urile într-o pereche HA', true, 'Sincronizare.'],
    ['Service port-ul poate face parte din LAG cu porturile de date', false, 'Nu face parte din LAG.'],
    ['Console port-ul se leagă la un port de switch în trunk', false, 'Console este pentru conexiune locală directă.'],
  ], 'Roluri separate.'),
];
