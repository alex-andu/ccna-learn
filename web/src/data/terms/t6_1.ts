import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 6.1 (impactul automatizării asupra managementului rețelei).
// `cli`, `ssh`, `snmp`, `control-plane`, `data-plane`, `sdn`, `catalyst-center` sunt doar referiți (definiți în alte topicuri).
export const TERMS: GlossaryEntry[] = [
  {
    id: 'network-automation', abbr: 'Network automation', ro: 'automatizarea rețelei',
    what: 'Folosirea software-ului (scripturi, șabloane, instrumente, controller-e) pentru a configura, verifica și întreține echipamentele de rețea în locul comenzilor tastate manual.',
    how: 'Descrii o dată starea dorită (inventar + variabile + șablon); un instrument o aplică pe toate echipamentele prin SSH, NETCONF sau API, apoi verifică rezultatul. Câștigi viteză și consecvență, dar greșelile din șablon se propagă și ele rapid.',
    where: 'Rețele cu zeci sau sute de echipamente, filiale, campus, data center. Topicul 6.1; instrumente la 6.6.',
    topics: ['6.1', '6.2'], aliases: ['automatizare', 'automation'],
  },
  {
    id: 'management-plane', abbr: 'Management plane', ro: 'planul de management',
    what: 'Partea unui echipament prin care îl administrezi și îl monitorizezi: SSH, console, SNMP, syslog, NTP, NETCONF, RESTCONF, API REST.',
    how: 'Nu mută traficul utilizatorilor (data plane) și nu calculează rute (control plane); doar oferă „ușa” prin care un om sau un program schimbă configurația și citește starea echipamentului.',
    where: 'Orice echipament; punctul prin care intră automatizarea. Topicurile 6.1 și 6.3.',
    topics: ['6.1', '6.3'], aliases: ['management plane', 'plan de management'],
  },
  {
    id: 'configuration-drift', abbr: 'Configuration drift', ro: 'deriva de configurație',
    what: 'Diferența care apare în timp între configurația dorită (standardul) și cea reală de pe echipamente.',
    how: 'Apare când cineva face o modificare manuală (de urgență sau din greșeală) fără să o treacă în sursa de adevăr. Se detectează comparând periodic starea reală cu intenția; instrumentele declarative pot să o și corecteze.',
    where: 'Rețele administrate manual sau amestec manual + automatizat. Topicurile 6.1 și 6.2.',
    topics: ['6.1', '6.2'], aliases: ['drift', 'deriva'],
  },
  {
    id: 'idempotent', abbr: 'Idempotent', ro: 'care dă același rezultat la repetare',
    what: 'O operație este idempotentă dacă aplicarea ei de mai multe ori produce același rezultat ca o singură aplicare.',
    how: '„Asigură-te că VLAN 20 există” este idempotent: dacă există deja, nu se mai schimbă nimic. „Adaugă încă o linie” nu este, pentru că repetarea o dublează. În HTTP, GET, PUT și DELETE sunt idempotente; POST nu.',
    where: 'Instrumente de automatizare (Ansible, Terraform) și verbe HTTP în API-uri REST. Topicurile 6.1, 6.5 și 6.6.',
    topics: ['6.1', '6.5'], aliases: ['idempotență', 'idempotency'],
  },
  {
    id: 'source-of-truth', abbr: 'Source of truth', ro: 'sursa de adevăr',
    what: 'Locul unic în care este definită starea dorită a rețelei: lista echipamentelor, IP-urile, VLAN-urile, serverele NTP/syslog, politicile.',
    how: 'De obicei fișiere text (YAML, JSON, CSV) păstrate în Git, sau o bază de date de inventar. Rețeaua trebuie să urmeze sursa de adevăr, nu invers; dacă sursa e greșită, automatizarea propagă greșeala.',
    where: 'Orice flux de automatizare serios. Topicul 6.1; instrumente la 6.6.',
    topics: ['6.1'], aliases: ['SoT', 'inventar'],
  },
  {
    id: 'infrastructure-as-code', abbr: 'IaC', full: 'Infrastructure as Code', ro: 'infrastructura ca cod',
    what: 'Practica de a descrie infrastructura (rețea, servere, cloud) în fișiere text care pot fi versionate, revizuite și executate.',
    how: 'Fișierele (YAML, HCL, JSON) sunt păstrate în Git; un instrument calculează diferența dintre starea descrisă și cea reală și o aplică. Beneficii: reproductibilitate, istoric al modificărilor, review înainte de aplicare.',
    where: 'Ansible, Terraform, pipeline-uri CI/CD pentru rețea și cloud. Topicurile 6.1 și 6.6.',
    topics: ['6.1'], aliases: ['IaC'],
  },
  {
    id: 'zero-touch-provisioning', abbr: 'ZTP', full: 'Zero-Touch Provisioning', ro: 'provizionare fără atingere',
    what: 'Mecanism prin care un echipament nou se configurează singur la prima pornire, fără conectare manuală prin console.',
    how: 'Echipamentul pornește fără configurație, obține o adresă IP (de obicei prin DHCP) și află de la un server unde să găsească scriptul, imaginea software și configurația care i se potrivesc, apoi le aplică.',
    where: 'Filiale, campus mare; Catalyst Center (Plug and Play), SD-WAN. Topicurile 6.1 și 6.2.',
    topics: ['6.1', '6.2'], aliases: ['ZTP', 'Plug and Play'],
  },
  {
    id: 'network-telemetry', abbr: 'Telemetry', ro: 'telemetria rețelei',
    what: 'Trimiterea continuă, automată, a datelor măsurate de pe echipamente (stări de interfețe, contoare, rute, evenimente) către un sistem care le stochează și le analizează.',
    how: 'Spre deosebire de un show manual, echipamentul trimite el însuși datele (în flux sau periodic), în format structurat. Datele permit tablouri de bord, alarme, baseline-uri și analiză AI/ML (6.4).',
    where: 'Monitorizare, assurance în controller-e, verificarea automatizărilor. Topicurile 6.1 și 6.4.',
    topics: ['6.1', '6.4'], aliases: ['telemetrie', 'streaming telemetry'],
  },
  {
    id: 'closed-loop-automation', abbr: 'Closed-loop automation', ro: 'automatizare cu buclă închisă',
    what: 'Automatizare în care sistemul măsoară rețeaua, compară cu intenția și reacționează singur (sau cu aprobare) la abateri.',
    how: 'Ciclul: intenție → aplicare → măsurare (telemetrie) → comparare → remediere. Trecerea la remediere automată se face de obicei treptat, cu aprobare umană până la încredere în sistem.',
    where: 'Controller-e cu assurance, platforme AIOps. Topicurile 6.1 și 6.4.',
    topics: ['6.1', '6.4'], aliases: ['closed loop', 'buclă închisă'],
  },
];
