import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 2.1 Configure and verify VLANs (normal range) spanning multiple switches.
// `vlan`, `trunk`, `svi`, `subinterface`, `l3-switch`, `cdp`, `lldp-med` există deja (alte topicuri) și sunt doar referite.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'access-port', abbr: 'access port', full: 'Access port (switchport mode access)', ro: 'port de switch care aparține unui singur VLAN și trimite cadre fără tag',
    what: 'Un port de switch destinat unui dispozitiv final (PC, imprimantă, server, telefon IP). Aparține unui singur VLAN de date și nu transportă etichete 802.1Q: stația din capătul cablului nu știe că există VLAN-uri.',
    how: 'Cadrul primit pe port, fără tag, este asociat VLAN-ului configurat pe port; switch-ul învață MAC-ul în tabela acelui VLAN și inundă broadcast-urile doar pe porturile aceluiași VLAN. Cadrul care pleacă spre alt port access din același VLAN iese tot fără tag; spre un trunk primește tag 802.1Q. Excepție controlată: dacă portul are și voice VLAN, telefonul trimite vocea cu tag. Comenzi: switchport mode access și switchport access vlan N.',
    where: 'Pe toate porturile spre utilizatori și servere. Verificare: show vlan brief (listează porturile access, nu trunk-urile) și show interfaces <port> switchport. Se setează explicit mode access ca să nu se negocieze trunk prin DTP.',
    std: 'IEEE 802.1Q', layer: 'L2', aliases: ['switchport access', 'static access'], topics: ['2.1', '2.2'],
  },
  {
    id: 'voice-vlan', abbr: 'voice VLAN', full: 'Voice VLAN (auxiliary VLAN)', ro: 'VLAN separat pentru traficul de voce al unui telefon IP, pe același port ca PC-ul',
    what: 'Un al doilea VLAN configurat pe un port access, destinat exclusiv traficului de voce al unui telefon IP. Permite ca telefonul și PC-ul din spatele lui să împartă un singur cablu, dar să stea în rețele logice diferite.',
    how: 'Switch-ul comunică telefonului numărul VLAN-ului de voce prin CDP sau LLDP-MED. Telefonul își etichetează cadrele de voce cu 802.1Q (VID = voice VLAN, de regulă cu prioritate CoS 5), iar traficul PC-ului trece prin telefon fără tag și rămâne în VLAN-ul de date al portului. Configurare: switchport voice vlan N, pe un port deja access.',
    where: 'Pe porturile de birou cu telefon IP (adesea alimentat prin PoE). Verificare: show interfaces <port> switchport (linia „Voice VLAN”). Separarea permite QoS pentru voce și izolare față de date.',
    std: 'IEEE 802.1Q', layer: 'L2', aliases: ['auxiliary VLAN', 'switchport voice vlan'], topics: ['2.1', '2.3'],
  },
  {
    id: 'default-vlan', abbr: 'default VLAN', full: 'Default VLAN (VLAN 1)', ro: 'VLAN 1 — VLAN-ul din fabrică în care sunt toate porturile',
    what: 'VLAN 1, numit „default”, există pe orice switch Cisco din fabrică. Toate porturile access sunt atribuite lui la pornire, iar un switch nou comută imediat. Nu poate fi șters și nu poate fi redenumit.',
    how: 'Fiind VLAN-ul implicit, este și VLAN-ul nativ implicit al trunk-urilor (cadrele lui circulă fără tag) și locul unde unele protocoale de control își trimit cadrele pe trunk. Nu poate fi șters nici VLAN-urile rezervate 1002–1005.',
    where: 'Bune practici: nu pune utilizatori și management în VLAN 1; creează VLAN-uri dedicate, mută porturile nefolosite într-un VLAN de „parcare” fără SVI și pune-le în shutdown. Verifică cu show vlan brief.',
    layer: 'L2', aliases: ['VLAN 1'], topics: ['2.1', '2.2'],
  },
  {
    id: 'inter-vlan-routing', abbr: 'inter-VLAN routing', full: 'Inter-VLAN routing', ro: 'rutarea traficului între VLAN-uri diferite',
    what: 'Procesul prin care un dispozitiv de nivel 3 transferă pachete între VLAN-uri, adică între subrețele IP diferite care sunt separate la nivel 2.',
    how: 'Hostul vede că destinația e în altă subrețea și trimite cadrul către default gateway (adresa IP a routerului/SVI-ului din VLAN-ul lui). Dispozitivul L3 scoate antetul L2, consultă tabela de rutare, alege interfața/VLAN-ul destinație și re-încapsulează pachetul. Trei metode: un port de router per VLAN (învechit), router-on-a-stick (subinterfețe 802.1Q pe un trunk) și switch L3 cu SVI (ip routing).',
    where: 'În orice rețea cu mai multe VLAN-uri: filiale mici (router-on-a-stick) și campus (switch L3 cu SVI). Depanare: gateway corect pe host, VLAN corect pe port, trunk care permite VLAN-ul, ip routing / subinterfețe.',
    layer: 'L3', aliases: ['InterVLAN', 'inter-VLAN'], topics: ['2.1'],
  },
  {
    id: 'router-on-a-stick', abbr: 'router-on-a-stick', full: 'Router-on-a-stick (ROAS)', ro: 'inter-VLAN routing printr-un singur trunk spre router, cu subinterfețe',
    what: 'Tehnică de inter-VLAN routing în care routerul are o singură interfață fizică legată printr-un trunk 802.1Q de switch, iar fiecare VLAN are o subinterfață logică cu IP-ul lui de gateway.',
    how: 'Pe interfața fizică (fără IP, no shutdown) creezi subinterfețe, de exemplu Gi0/0.10, cu encapsulation dot1Q 10 și ip address. Un cadru din VLAN 10 ajunge cu tag VID 10 pe subinterfața .10; routerul rutează către VLAN 20 și trimite pachetul înapoi pe același cablu cu tag VID 20. Cablul este traversat de două ori, de aceea banda lui devine limita.',
    where: 'Filiale mici, laburi și întrebări de examen. În campus se preferă switch-ul L3 cu SVI. Verificare: show ip interface brief, show ip route, show interfaces trunk (pe switch).',
    std: 'IEEE 802.1Q', layer: 'L3', aliases: ['ROAS', 'one-armed router'], topics: ['2.1', '2.2'],
  },
  {
    id: 'autostate', abbr: 'autostate', full: 'SVI autostate', ro: 'regula după care un SVI e up/up doar dacă VLAN-ul are cel puțin un port activ',
    what: 'Mecanism al switch-urilor L3 prin care starea operațională a unui SVI depinde de VLAN-ul asociat: interfața VLAN este „up” numai dacă VLAN-ul există și cel puțin un port din el este activ.',
    how: 'Switch-ul verifică dacă există cel puțin un port access în starea up în acel VLAN sau un trunk activ care permite VLAN-ul. Dacă VLAN-ul a fost șters sau toate porturile lui sunt down, SVI-ul devine up/down și rutarea prin el se oprește. Un SVI poate fi și în shutdown administrativ, caz în care autostate nu mai contează.',
    where: 'Explică de ce „interface vlan 30” rămâne down pe un switch nou: VLAN-ul 30 nu a fost creat sau nu are încă niciun port conectat. Verificare: show vlan brief și show ip interface brief.',
    layer: 'L3', topics: ['2.1'],
  },
  {
    id: 'vtp', abbr: 'VTP', full: 'VLAN Trunking Protocol', ro: 'protocol Cisco care propagă automat baza de date de VLAN-uri între switch-uri',
    what: 'Protocol proprietar Cisco care distribuie definițiile VLAN-urilor (ID și nume) prin trunk-uri, ca să nu fie nevoie să le creezi manual pe fiecare switch dintr-un domeniu VTP.',
    how: 'Modurile sunt server, client, transparent și off. Informația este versionată printr-un revision number: un switch cu revision number mai mare își impune baza de date celorlalte, de aceea un switch folosit adăugat în rețea poate șterge VLAN-urile întregii organizații. Transparent nu își modifică baza de date după anunțuri și le retransmite; off ignoră VTP.',
    where: 'Rețele cu multe switch-uri; în laburi și rețele mici se lucrează adesea cu transparent/off și VLAN-uri create manual. Nu este un punct de configurare cerut explicit de obiectivul 2.1, dar riscul revision number apare frecvent în depanare.',
    layer: 'L2', aliases: ['VLAN Trunking Protocol'], topics: ['2.1', '2.2'],
  },
];
