import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 6.2 (rețele tradiționale vs bazate pe controller).
// `sdn`, `catalyst-center`, `control-plane`, `data-plane`, `wlc`, `snmp`, `cloud-managed`, `nms` sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'controller-based-networking', abbr: 'Controller-based networking', ro: 'rețea administrată de un controller',
    what: 'Model de rețea în care un controller software central proiectează, configurează și monitorizează echipamentele, în loc ca fiecare echipament să fie administrat separat.',
    how: 'Controller-ul are imaginea întregii rețele, primește intenții sau politici (prin GUI sau API northbound) și le aplică echipamentelor prin API-uri/protocoale southbound. Echipamentele continuă să transmită traficul (data plane).',
    where: 'Catalyst Center (campus), Catalyst SD-WAN, Meraki, WLC pentru AP-uri, ACI în data center. Topicurile 6.2 și 6.3.',
    topics: ['6.2', '6.3'], aliases: ['controller-based', 'rețea cu controller'],
  },
  {
    id: 'intent-based-networking', abbr: 'IBN', full: 'Intent-Based Networking', ro: 'rețea bazată pe intenție',
    what: 'Abordare în care descrii intenția de afaceri („angajații acced la ERP, vizitatorii doar la Internet”), iar sistemul o traduce în configurații, o aplică și verifică continuu că este respectată.',
    how: 'Trei funcții: translation (intenția devine politici), activation (aplicarea automată pe echipamente) și assurance (măsurare continuă și corecție). Este automatizarea cu buclă închisă (6.1) integrată într-un controller.',
    where: 'Controller-e precum Catalyst Center. Topicurile 6.2 și 6.3.',
    topics: ['6.2', '6.1'], aliases: ['IBN', 'intent-based'],
  },
  {
    id: 'single-pane-of-glass', abbr: 'Single pane of glass', ro: 'un singur panou de administrare',
    what: 'Vedere unificată (de obicei o interfață web) din care vezi și administrezi întreaga rețea, în loc să te conectezi la fiecare echipament.',
    how: 'Controller-ul colectează inventarul, starea și telemetria de pe toate echipamentele și le prezintă într-un tablou de bord; din același loc aplici politici și deschizi detalii pe echipament.',
    where: 'Catalyst Center, Meraki Dashboard, WLC GUI. Topicul 6.2.',
    topics: ['6.2'], aliases: ['single pane', 'panou unic'],
  },
  {
    id: 'network-assurance', abbr: 'Assurance', ro: 'asigurarea/monitorizarea calității rețelei',
    what: 'Funcția unui controller care măsoară continuu sănătatea rețelei (echipamente, clienți, aplicații), detectează problemele și sugerează remedieri.',
    how: 'Primește telemetrie de pe echipamente, o compară cu baseline-uri și cu intenția, folosește analiză (inclusiv ML) ca să găsească cauze probabile și poate declanșa acțiuni corective.',
    where: 'Assurance din Catalyst Center; platforme AIOps. Topicurile 6.2 și 6.4.',
    topics: ['6.2', '6.4'], aliases: ['assurance'],
  },
  {
    id: 'distributed-control-plane', abbr: 'Control plane distribuit', ro: 'planul de control distribuit',
    what: 'Situația clasică în care fiecare router/switch rulează propriul control plane (OSPF, STP, ARP) și ia singur deciziile de forwarding.',
    how: 'Echipamentele schimbă mesaje de protocol între ele (de exemplu OSPF Hello și LSA) și își construiesc independent tabelele. Nu există un creier central: avantaj de autonomie, dezavantaj de administrare per echipament.',
    where: 'Rețele tradiționale. Contrast cu controller-ul central din 6.2 și 6.3.',
    topics: ['6.2', '6.3'], aliases: ['control distribuit'],
  },
  {
    id: 'plug-and-play', abbr: 'PnP', full: 'Plug and Play (provizionare)', ro: 'integrare automată a echipamentelor noi',
    what: 'Funcție a controller-ului care permite unui echipament nou să fie descoperit, adoptat și configurat automat (formă de ZTP).',
    how: 'Echipamentul pornește fără configurație, obține IP (de obicei prin DHCP) și află adresa controller-ului; acesta îi atribuie site-ul, configurația și imaginea software potrivite.',
    where: 'Catalyst Center; filiale și campusuri noi. Topicul 6.2; ZTP general la 6.1.',
    topics: ['6.2', '6.1'], aliases: ['PnP'],
  },
];
