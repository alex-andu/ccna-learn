import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 2.6 Arhitecturi wireless Cisco și moduri AP.
// `autonomous-ap`, `lightweight-ap`, `wlc`, `capwap`, `rrm` există deja (1.11) și sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'split-mac', abbr: 'Split-MAC', full: 'Split-MAC architecture', ro: 'împărțirea funcțiilor MAC între AP și WLC',
    what: 'Arhitectura în care funcțiile subnivelului MAC 802.11 sunt împărțite: cele în timp real rămân pe AP, cele de management se mută pe WLC.',
    how: 'AP-ul face beacons, probe response, ACK, retransmisii și criptarea/decriptarea cadrelor; WLC-ul face autentificarea clienților, configurația WLAN, RRM, roaming și detectarea rogue. Cele două părți comunică prin tuneluri CAPWAP.',
    where: 'Orice rețea cu AP-uri lightweight și WLC (inclusiv embedded).',
    layer: 'L2', aliases: ['split MAC'], topics: ['2.6'],
  },
  {
    id: 'dtls', abbr: 'DTLS', full: 'Datagram Transport Layer Security', ro: 'TLS pentru datagrame UDP', std: 'RFC 6347 / 9147',
    what: 'Variantă a protocolului TLS care criptează și autentifică traficul transportat peste UDP.',
    how: 'CAPWAP folosește DTLS obligatoriu pe tunelul de control (UDP 5246) și opțional pe cel de date (UDP 5247). AP-ul și WLC-ul se autentifică reciproc prin certificate înainte de join.',
    where: 'CAPWAP, VPN-uri bazate pe UDP, WebRTC.',
    layer: 'L4', aliases: ['TLS peste UDP'], topics: ['2.6'],
  },
  {
    id: 'cloud-managed', abbr: 'Cloud-managed (Meraki)', full: 'Cloud-based wireless management (Cisco Meraki)', ro: 'management wireless din cloud',
    what: 'Arhitectură în care AP-urile (și adesea switch-urile) sunt gestionate dintr-un dashboard în cloud, fără controller local.',
    how: 'AP-ul se conectează prin Internet la cloud (zero-touch provisioning), își primește configurația și raportează starea. Traficul clienților rămâne în rețeaua locală; doar managementul merge în cloud. Necesită licență și acces Internet pentru administrare.',
    where: 'Sucursale, magazine și organizații mici fără personal IT local, sau multe locații cu politici identice.',
    layer: 'L7', aliases: ['Meraki', 'cloud-based', 'cloud-managed'], topics: ['2.6', '2.8'],
  },
  {
    id: 'ewc', abbr: 'EWC', full: 'Embedded Wireless Controller', ro: 'controller wireless integrat într-un AP sau switch',
    what: 'Funcție de WLC rulată pe un AP „principal” sau pe un switch Catalyst, pentru rețele mici fără controller dedicat.',
    how: 'AP-ul/switch-ul care găzduiește controller-ul gestionează celelalte AP-uri prin CAPWAP, cu capacitate mai mică decât un WLC dedicat.',
    where: 'Sucursale mici (zeci de AP) care vor funcții de controller, fără hardware separat.',
    layer: 'L2', aliases: ['embedded wireless controller', 'Mobility Express'], topics: ['2.6'],
  },
  {
    id: 'flexconnect', abbr: 'FlexConnect', full: 'FlexConnect (AP mode)', ro: 'mod AP cu local switching și autonomie la pierderea WLC',
    what: 'Mod al unui AP lightweight care poate comuta traficul clienților local, fără să-l tuneleze la WLC, și poate continua să funcționeze dacă pierde legătura cu WLC-ul.',
    how: 'Controlul rămâne la WLC prin CAPWAP, dar pentru WLAN-urile configurate cu local switching traficul iese direct pe portul AP-ului, marcat cu VLAN-ul clientului (port de switch de tip trunk). La căderea WLC-ului, AP-ul continuă în modul standalone.',
    where: 'Sucursale la distanță, WAN lent sau nesigur.',
    layer: 'L2', aliases: ['local switching', 'H-REAP'], topics: ['2.6', '2.7'],
  },
  {
    id: 'local-mode', abbr: 'Local mode', full: 'Local mode (AP)', ro: 'modul implicit al unui AP lightweight',
    what: 'Modul implicit: AP-ul servește clienți și tunelează tot traficul lor la WLC (central switching).',
    how: 'Datele clienților sunt încapsulate în CAPWAP (UDP 5247). Periodic, AP-ul scanează și alte canale pentru RRM. Portul de switch este de obicei access (VLAN-ul de management al AP-ului).',
    where: 'Campus, LAN rapid cu WLC accesibil.',
    layer: 'L2', aliases: ['central switching'], topics: ['2.6'],
  },
  {
    id: 'monitor-mode', abbr: 'Monitor mode', full: 'Monitor mode (AP)', ro: 'mod AP dedicat securității; nu servește clienți',
    what: 'Mod în care AP-ul doar ascultă mediul radio: detectare rogue, IDS/IPS wireless și localizare; nu transmite date către clienți.',
    how: 'Setat pe WLC; AP-ul raportează WLC-ului ce vede în aer. Nu trebuie confundat cu Sniffer, care trimite capturi unui analizor extern.',
    where: 'Securitate wireless și servicii de localizare.',
    layer: 'L1', aliases: ['monitor'], topics: ['2.6'],
  },
  {
    id: 'sniffer-mode', abbr: 'Sniffer mode', full: 'Sniffer mode (AP)', ro: 'mod AP care captează trafic 802.11 spre un analizor',
    what: 'Mod în care AP-ul captează cadre 802.11 pe un canal și le trimite unui PC cu un analizor (de exemplu Wireshark/OmniPeek); nu servește clienți.',
    how: 'WLC-ul indică canalul și adresa IP a analizorului; AP-ul încapsulează cadrele capturate și le trimite acolo.',
    where: 'Depanare avansată a problemelor wireless.',
    layer: 'L1', aliases: ['sniffer'], topics: ['2.6'],
  },
  {
    id: 'rogue-ap', abbr: 'Rogue AP', full: 'Rogue access point', ro: 'AP neautorizat conectat sau vizibil în rețea',
    what: 'Un AP care nu aparține administratorului dar se află în aer sau, mai grav, este conectat la rețeaua cablată, creând o breșă de securitate.',
    how: 'WLC-ul și AP-urile în modul Monitor sau Rogue Detector îl detectează comparând SSID/BSSID din aer cu MAC-urile observate în rețeaua cablată; poate fi clasificat (friendly, malicious) și, după politică, izolat.',
    where: 'Politici de securitate wireless; detecție prin IDS.',
    layer: 'L2', aliases: ['rogue'], topics: ['2.6'],
  },
  {
    id: 'dhcp-option-43', abbr: 'DHCP option 43', full: 'DHCP option 43 (vendor-specific information)', ro: 'opțiune DHCP care poate conține adresa WLC-ului',
    what: 'Opțiune DHCP specifică furnizorului; în rețele Cisco wireless, oferă AP-urilor lightweight adresa IP a controller-ului WLC.',
    how: 'Serverul DHCP trimite sub-opțiunea cu tipul f1, lungimea (4 × numărul de WLC) și adresele în hexazecimal, de exemplu f104.c0a8.640a pentru 192.168.100.10. AP-ul o folosește în pasul de descoperire a WLC-ului.',
    where: 'Pool-uri DHCP pentru VLAN-ul AP-urilor.',
    layer: 'L7', aliases: ['option 43'], topics: ['2.6'],
  },
];
