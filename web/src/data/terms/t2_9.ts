import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 2.9 Interfața grafică WLAN. `psk`, `dot1x`, `wpa3`, `sae`, `pmf`, `radius`, `wlc` există deja și sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'wlan-profile', abbr: 'WLAN (profil pe WLC)', full: 'WLAN profile on a controller', ro: 'setul de setări care definește o rețea wireless pe WLC',
    what: 'Obiectul configurat pe WLC care definește o rețea wireless pentru clienți: profil, SSID, ID, interfață/VLAN, securitate, QoS și setări avansate.',
    how: 'Se creează în GUI cu WLANs → Create New (AireOS) și se configurează pe taburile General, Security, QoS, Advanced. Pe Catalyst 9800 aceleași setări sunt împărțite între WLAN profile (SSID, securitate) și Policy profile (VLAN, QoS, timeout), legate printr-un Policy tag. WLC-ul trimite configurația AP-urilor prin CAPWAP.',
    where: 'Orice rețea wireless controller-based: CORP, VOICE, GUEST.',
    layer: 'L2', aliases: ['WLAN', 'profile name', 'WLAN ID'], topics: ['2.9'],
  },
  {
    id: 'qos-profile', abbr: 'QoS profile (WLAN)', full: 'WLAN QoS profile (Platinum, Gold, Silver, Bronze)', ro: 'profilul de prioritate al unui WLAN',
    what: 'Setarea din tabul QoS al unui WLAN care definește prioritatea maximă a traficului: Platinum (voce), Gold (video), Silver (best effort, implicit), Bronze (background).',
    how: 'Profilul corespunde categoriilor WMM (AC_VO, AC_VI, AC_BE, AC_BK) și acționează ca plafon pentru prioritatea traficului de pe acel SSID; WLC-ul mapează prioritățile din aer la marcaje din rețeaua cablată și invers.',
    where: 'Platinum pe WLAN-ul de voce, Bronze pe WLAN-ul de oaspeți, Silver restul.',
    layer: 'L2', aliases: ['Platinum', 'Gold', 'Silver', 'Bronze'], topics: ['2.9'],
  },
  {
    id: 'wmm', abbr: 'WMM', full: 'Wi-Fi Multimedia', ro: 'mecanismul de QoS din aer (802.11e/EDCA)',
    what: 'Certificare/mecanism Wi-Fi care împarte traficul în patru categorii de acces (voce, video, best effort, background) cu priorități diferite la accesul pe canal.',
    how: 'Fiecare categorie are parametri de așteptare și de backoff diferiți (EDCA), deci traficul prioritar câștigă mai des accesul la mediu. Pe WLC: WMM Policy = Disabled / Allowed / Required (Required: doar clienți WMM).',
    where: 'WLAN-uri de voce și video; tabul QoS.',
    layer: 'L2', std: 'IEEE 802.11e', aliases: ['EDCA', 'AC_VO', 'AC_VI'], topics: ['2.9'],
  },
  {
    id: 'aaa-override', abbr: 'AAA Override', full: 'Allow AAA Override', ro: 'serverul RADIUS poate suprascrie setările WLAN-ului',
    what: 'Setare din tabul Advanced care permite serverului AAA/RADIUS să trimită, per utilizator, valori care suprascriu cele ale WLAN-ului: VLAN/interfață, profil QoS, ACL.',
    how: 'După autentificarea 802.1X, serverul RADIUS răspunde cu atribute (de exemplu VLAN ID); dacă AAA Override este Enabled, WLC-ul le aplică pe sesiunea clientului în locul valorilor din WLAN.',
    where: 'Un singur SSID, dar utilizatori în VLAN-uri diferite după rol (angajat, IT, contractor).',
    layer: 'L7', aliases: ['allow AAA override'], topics: ['2.9'],
  },
  {
    id: 'client-exclusion', abbr: 'Client exclusion', full: 'Client exclusion', ro: 'excluderea temporară a clienților cu eșecuri repetate',
    what: 'Funcție a WLC care exclude un client pentru o perioadă (de exemplu 60 s) după eșecuri repetate de asociere, autentificare sau DHCP.',
    how: 'WLC-ul numără eșecurile; la depășirea pragului clientul nu mai este acceptat până expiră timpul de excludere (sau administratorul îl scoate din listă). Reduce efectul atacurilor prin forță brută și al clienților defecți.',
    where: 'Tabul Advanced al WLAN-ului.',
    layer: 'L2', aliases: ['excludere client'], topics: ['2.9'],
  },
  {
    id: 'p2p-blocking', abbr: 'P2P blocking', full: 'Peer-to-peer blocking', ro: 'oprirea comunicării directe între clienții aceluiași WLAN',
    what: 'Setare care împiedică clienții asociați la același WLAN să comunice direct între ei, folosind fie Drop (aruncă traficul), fie Forward-UpStream (îl trimite spre rețeaua cablată pentru filtrare).',
    how: 'WLC-ul verifică traficul de la client la client și îl blochează sau îl trimite la gateway. Nu afectează accesul spre Internet sau servere.',
    where: 'WLAN-uri de oaspeți, pentru a reduce riscurile între dispozitivele necunoscute.',
    layer: 'L2', aliases: ['peer to peer blocking'], topics: ['2.9'],
  },
  {
    id: 'web-auth', abbr: 'Web authentication', full: 'Web authentication (captive portal, Layer 3 security)', ro: 'autentificare prin portal web, în WLAN-uri de oaspeți',
    what: 'Securitate de nivel 3: utilizatorul se asociază la un SSID de obicei deschis, dar traficul îi este redirecționat către o pagină web (autentificare, acceptare termeni) până îndeplinește condiția.',
    how: 'Se alege în tabul Security → Layer 3 → Web Policy (Authentication, Passthrough, Conditional/Splash Page Web Redirect). Folosește adresa interfeței virtuale pentru redirecționare. Nu criptează traficul din aer.',
    where: 'Rețele pentru oaspeți în hoteluri, birouri, aeroporturi.',
    layer: 'L7', aliases: ['captive portal', 'web policy', 'guest portal'], topics: ['2.9'],
  },
  {
    id: 'session-timeout', abbr: 'Session timeout', full: 'WLAN session timeout', ro: 'timpul după care clientul se reautentifică',
    what: 'Durata maximă a unei sesiuni de client pe un WLAN; la expirare clientul este reautentificat.',
    how: 'Se setează în tabul Advanced (de exemplu 1800 s). Permite reînnoirea cheilor și reverificarea identității; un timeout prea mic produce deconectări frecvente.',
    where: 'WLAN-uri 802.1X și de oaspeți.',
    layer: 'L2', aliases: ['timeout sesiune'], topics: ['2.9'],
  },
  {
    id: 'band-select', abbr: 'Client band select', full: 'Client Band Select (și load balancing)', ro: 'încurajarea clienților dual-band spre 5 GHz',
    what: 'Funcție care îndeamnă clienții dual-band să se conecteze pe banda de 5 GHz, mai puțin aglomerată, în loc de 2,4 GHz.',
    how: 'AP-ul întârzie sau suprimă răspunsurile la probe pe 2,4 GHz pentru clienții capabili de 5 GHz. Client Load Balancing este o funcție separată care repartizează clienții între AP-uri.',
    where: 'Zone cu multe dispozitive; tabul Advanced.',
    layer: 'L2', aliases: ['band select', 'client load balancing'], topics: ['2.9'],
  },
  {
    id: 'dtim', abbr: 'DTIM', full: 'Delivery Traffic Indication Message period', ro: 'intervalul la care se anunță traficul broadcast/multicast pentru clienții în economie de energie',
    what: 'Parametru care spune la câte beacon-uri AP-ul anunță că are trafic broadcast/multicast bufferat pentru clienții care dorm.',
    how: 'DTIM = 1 înseamnă la fiecare beacon (latență mică, consum mai mare); valori mai mari economisesc energie dar cresc latența. Se setează în tabul Advanced, per bandă.',
    where: 'Dispozitive pe baterie, WLAN-uri de voce.',
    layer: 'L2', aliases: ['DTIM period'], topics: ['2.9'],
  },
];
