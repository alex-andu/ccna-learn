import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 2.8 Acces de management. `console-port`, `telnet`, `ssh`, `http`, `https`, `radius`, `cloud-managed` există deja și sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'aaa', abbr: 'AAA', full: 'Authentication, Authorization, Accounting', ro: 'autentificare, autorizare, contabilizare',
    what: 'Cadru de securitate cu trei funcții: Authentication (cine ești), Authorization (ce ai voie să faci) și Accounting (ce ai făcut).',
    how: 'Pe IOS se activează cu aaa new-model; echipamentul (NAS) trimite cererile unui server AAA prin RADIUS sau TACACS+ și aplică răspunsul. Listele de metode (de exemplu group tacacs+ local) definesc ordinea surselor, cu fallback local în caz de server indisponibil.',
    where: 'Acces de administrare la echipamente, 802.1X pe LAN/WLAN, VPN-uri.',
    layer: 'L7', aliases: ['authentication authorization accounting'], topics: ['2.8'],
  },
  {
    id: 'tacacs-plus', abbr: 'TACACS+', full: 'Terminal Access Controller Access-Control System Plus', ro: 'protocol AAA Cisco pentru administrarea echipamentelor', std: 'RFC 8907 (informațional)',
    what: 'Protocol AAA (inițial proprietar Cisco) care rulează peste TCP 49 și separă autentificarea, autorizarea și contabilizarea.',
    how: 'Criptează tot corpul pachetului (nu doar parola) și permite autorizare pe comandă (cine poate rula ce). Echipamentul și serverul au o cheie partajată. Se configurează cu tacacs server … și aaa authentication login default group tacacs+ local.',
    where: 'Administrarea centralizată a routerelor și switch-urilor; serverele uzuale: Cisco ISE, ACS.',
    layer: 'L7', aliases: ['TACACS', 'TACACS plus'], topics: ['2.8'],
  },
  {
    id: 'vty', abbr: 'VTY', full: 'Virtual Teletype lines', ro: 'liniile virtuale pentru sesiuni la distanță',
    what: 'Liniile logice (de exemplu 0–15) pe care un echipament Cisco acceptă sesiuni CLI prin rețea (SSH sau Telnet).',
    how: 'Se configurează cu line vty 0 15: login local sau login authentication, transport input ssh, access-class pentru ACL, exec-timeout. Fiecare sesiune ocupă o linie; când liniile se termină, noile conexiuni sunt refuzate.',
    where: 'Securizarea accesului de management la routere și switch-uri.',
    layer: 'L7', aliases: ['vty lines', 'virtual terminal'], topics: ['2.8'],
  },
  {
    id: 'in-band-management', abbr: 'In-band management', full: 'In-band management', ro: 'management prin rețeaua de producție',
    what: 'Accesul de administrare care folosește aceeași rețea ca traficul de producție (SSH, HTTPS, SNMP către o adresă IP a echipamentului).',
    how: 'Este simplu și nu cere infrastructură separată, dar dacă rețeaua de producție cade sau interfața de management este greșit configurată, accesul se pierde.',
    where: 'Majoritatea sesiunilor de administrare curente.',
    layer: 'L3', aliases: ['in-band'], topics: ['2.8'],
  },
  {
    id: 'oob-management', abbr: 'Out-of-band management', full: 'Out-of-band (OOB) management', ro: 'management pe o cale separată de producție',
    what: 'Accesul de administrare care nu depinde de rețeaua de producție: console (direct sau prin console server), un port dedicat de management (de exemplu service port) sau o rețea de management separată.',
    how: 'Rămâne disponibil când producția este căzută sau interfețele sunt misconfigurate; de aceea se folosește pentru recuperare și configurare inițială. Se securizează fizic și logic, ca orice cale de administrare.',
    where: 'Console server în datacenter, service port la WLC, rețele de management dedicate.',
    layer: 'L1', aliases: ['OOB'], topics: ['2.8', '2.7'],
  },
];
