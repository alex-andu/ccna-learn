import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 2.4 EtherChannel. `etherchannel` și `stp` există deja (1.x) și sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'port-channel', abbr: 'Port-channel', full: 'Port-channel (interfață EtherChannel logică)', ro: 'interfața logică a unui EtherChannel',
    what: 'Interfața virtuală care reprezintă un grup de linkuri fizice agregate (EtherChannel). Din punctul de vedere al configurării și al STP, ea este un singur port.',
    how: 'Se creează automat la prima comandă channel-group N sau explicit cu interface port-channel N. Setările de switchport (trunk, VLAN-uri permise, native VLAN) sau de nivel 3 (no switchport + ip address) se aplică pe ea și se propagă la porturile membre. Numărul este local echipamentului.',
    where: 'Trunk-uri între switch-uri de acces și distribuție, legături spre servere sau controlere wireless (LAG), legături rutate între switch-uri multilayer.',
    layer: 'L2', aliases: ['Po', 'interface port-channel'], topics: ['2.4'],
  },
  {
    id: 'lacp', abbr: 'LACP', full: 'Link Aggregation Control Protocol', ro: 'protocolul standard care negociază un EtherChannel', std: 'IEEE 802.3ad / 802.1AX',
    what: 'Protocolul standard (independent de producător) prin care două echipamente negociază și mențin un grup de linkuri agregate (LAG).',
    how: 'Fiecare capăt trimite LACPDU periodic (implicit la 30 s; 1 s în modul fast) cu prioritatea sistemului, prioritatea și cheia portului. Moduri: active (inițiază) și passive (doar răspunde); canalul se formează dacă cel puțin un capăt este active. Un bundle are până la 16 membri, din care 8 activi și restul standby (alegerea după prioritatea sistemului, apoi a portului; valoarea mai mică câștigă, implicit 32768).',
    where: 'Alegerea implicită pentru EtherChannel între switch-uri, inclusiv multi-vendor; se configurează cu channel-group N mode active|passive; se verifică cu show etherchannel summary și show lacp neighbor.',
    layer: 'L2', aliases: ['802.3ad', '802.1AX', 'LACPDU'], topics: ['2.4'],
  },
  {
    id: 'pagp', abbr: 'PAgP', full: 'Port Aggregation Protocol', ro: 'protocolul Cisco proprietar pentru EtherChannel',
    what: 'Protocol proprietar Cisco care negociază formarea unui EtherChannel, anterior LACP; funcționează doar între echipamente Cisco.',
    how: 'Moduri: desirable (inițiază) și auto (răspunde, nu inițiază). Se formează dacă cel puțin un capăt este desirable. Nu este compatibil cu LACP. Maximum 8 porturi într-un canal.',
    where: 'Medii exclusiv Cisco mai vechi; apare la examen în tabelul de compatibilitate. Verificare: show pagp neighbor.',
    layer: 'L2', aliases: ['desirable', 'auto'], topics: ['2.4'],
  },
  {
    id: 'etherchannel-load-balancing', abbr: 'EtherChannel load balancing', full: 'EtherChannel load balancing (hash pe flux)', ro: 'repartizarea traficului pe membrii unui canal',
    what: 'Mecanismul prin care un switch alege pe care membru al EtherChannel trimite fiecare cadru, folosind un hash al unor câmpuri din antet.',
    how: 'Câmpurile (MAC sursă/destinație, IP sursă/destinație, uneori porturi L4) se combină într-un hash; rezultatul selectează membrul. Același flux dă mereu același link, deci ordinea cadrelor se păstrează. Metoda se setează global (port-channel load-balance …) și se verifică cu show etherchannel load-balance; opțiunile și implicitul depind de platformă.',
    where: 'Ajustezi metoda când traficul este dezechilibrat (de exemplu tot traficul are același MAC, deoarece trece printr-un router).',
    layer: 'L2', aliases: ['load balancing', 'hash'], topics: ['2.4'],
  },
  {
    id: 'routed-port', abbr: 'Routed port', full: 'Routed port (no switchport)', ro: 'port de switch transformat în port de nivel 3',
    what: 'Un port al unui switch multilayer configurat cu no switchport, care se comportă ca interfața unui router: nu are VLAN, poate avea adresă IP.',
    how: 'După no switchport, portul (sau interfața port-channel) primește ip address. Nu rulează STP pe acel link și nu aparține niciunui VLAN. Poate fi membru într-un EtherChannel de nivel 3.',
    where: 'Legături punct-la-punct între switch-uri de distribuție/core în designuri rutate, EtherChannel L3.',
    layer: 'L3', aliases: ['no switchport', 'L3 port'], topics: ['2.4'],
  },
];
