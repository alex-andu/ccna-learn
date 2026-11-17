import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 4.1 NAT. `nat`, `pat`, `static-nat`, `dynamic-nat`, `cgnat`, `port-forwarding`, `inside-local`, `inside-global`, `outside-local`, `outside-global` (1.7) sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'nat-pool', abbr: 'NAT pool', full: 'NAT address pool', ro: 'grup de adrese publice pentru NAT dinamic',
    what: 'Interval de adrese publice (inside global) din care routerul alocă adrese gazdelor traduse la NAT dinamic.',
    how: 'Se definește cu ip nat pool <nume> <start> <end> netmask <mască> (sau prefix-length). Capetele sunt incluse. Prima gazdă care trimite trafic primește prima adresă liberă; intrarea expiră după inactivitate.',
    where: 'Folosit cu un ACL și ip nat inside source list N pool NUME. Fără overload, pool-ul se poate epuiza.',
    topics: ['4.1'],
  },
  {
    id: 'nat-overload', abbr: 'overload', full: 'NAT overload', ro: 'cuvânt-cheie care activează PAT',
    what: 'Cuvântul-cheie din ip nat inside source … overload care transformă NAT-ul dinamic în PAT: mai multe gazde partajează aceeași adresă publică.',
    how: 'Routerul păstrează în tabelă perechi adresă:port. Porturile globale deosebesc conexiunile, deci o singură adresă poate susține zeci de mii de conexiuni.',
    where: 'La aproape orice acces la Internet dintr-o rețea privată; pe interfață (…interface g0/1 overload) sau cu pool (…pool POOL1 overload).',
    topics: ['4.1'],
  },
  {
    id: 'nat-translation-table', abbr: 'NAT translation table', ro: 'tabela de traduceri NAT',
    what: 'Tabela din routerul NAT care reține, pentru fiecare conexiune sau mapare, legătura dintre adresele (și porturile) locale și cele globale.',
    how: 'Intrările statice sunt permanente; cele dinamice se creează la primul pachet și expiră după un timeout (implicit 24 de ore pentru o traducere simplă). La întoarcere, routerul caută destinația pachetului în tabelă.',
    where: 'Se citește cu show ip nat translations; se curăță cu clear ip nat translation *.',
    topics: ['4.1'],
  },
  {
    id: 'inside-source-nat', abbr: 'Inside source NAT', ro: 'NAT pe adresa sursă a gazdelor din interior',
    what: 'Forma de NAT în care se traduce adresa sursă a pachetelor care vin din rețeaua interioară spre exterior (cea cerută de obiectivul 4.1).',
    how: 'Se configurează cu comenzi ip nat inside source (static, list+pool, list+interface+overload), împreună cu ip nat inside / ip nat outside pe interfețe.',
    where: 'Acces la Internet din rețele private și publicarea serverelor interne.',
    topics: ['4.1'],
  },
];
