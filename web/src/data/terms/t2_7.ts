import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 2.7 Conexiuni fizice WLAN. `poe`, `trunk`, `etherchannel`, `access-port` există deja și sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'lag', abbr: 'LAG', full: 'Link Aggregation Group', ro: 'grup de linkuri agregate într-un singur link logic', std: 'IEEE 802.3ad / 802.1AX',
    what: 'Termenul standard pentru mai multe linkuri fizice paralele tratate ca unul singur logic; la Cisco echipamentele de switching îl numesc EtherChannel.',
    how: 'Oferă bandă agregată și redundanță. La un WLC AireOS, LAG-ul este static: porturile de date devin un singur link logic, iar switch-ul se configurează cu channel-group N mode on (fără LACP/PAgP); activarea cere repornirea controller-ului, iar toate porturile trebuie să meargă la același switch.',
    where: 'Legătura dintre un WLC și switch-ul de distribuție, între switch-uri (EtherChannel, 2.4), spre servere.',
    layer: 'L2', aliases: ['link aggregation', 'LAG'], topics: ['2.7', '2.4'],
  },
  {
    id: 'wlc-ds-port', abbr: 'Distribution system port', full: 'WLC distribution system port (data port)', ro: 'portul de date al unui WLC',
    what: 'Portul (sau porturile) fizic al WLC-ului prin care trece traficul de date: tuneluri CAPWAP de la AP-uri, trafic de clienți și management in-band.',
    how: 'Se conectează la switch ca port trunk 802.1Q cu VLAN-ul de management și cu VLAN-urile interfețelor dinamice; mai multe porturi pot forma un LAG.',
    where: 'Legătura WLC ↔ switch de distribuție/core.',
    layer: 'L2', aliases: ['data port', 'DS port'], topics: ['2.7'],
  },
  {
    id: 'wlc-service-port', abbr: 'Service port', full: 'WLC service port', ro: 'portul de management out-of-band al WLC-ului',
    what: 'Port dedicat pentru administrarea WLC-ului în afara rețelei de date (OOB): acces la GUI/SSH și recuperare, chiar dacă porturile de date au probleme.',
    how: 'Are o interfață și o adresă IP proprii, într-o subrețea separată de management OOB. Se conectează la un port de switch în modul access, nu trunk, și nu face parte din LAG. Nu transportă traficul clienților.',
    where: 'Administrare de urgență, upgrade-uri, configurare inițială; separat de rețeaua de producție.',
    layer: 'L2', aliases: ['service-port', 'OOB port'], topics: ['2.7'],
  },
  {
    id: 'wlc-redundancy-port', abbr: 'Redundancy port', full: 'WLC redundancy port (RP)', ro: 'portul care leagă două WLC-uri într-o pereche HA',
    what: 'Port dedicat pentru sincronizarea stării și a configurației între un WLC activ și unul standby (HA SSO).',
    how: 'Se leagă direct sau printr-o rețea dedicată între cele două controllere; nu se conectează la rețeaua de producție a clienților.',
    where: 'Perechi de WLC-uri pentru disponibilitate ridicată.',
    layer: 'L2', aliases: ['RP'], topics: ['2.7'],
  },
  {
    id: 'wlc-management-interface', abbr: 'Management interface (WLC)', full: 'WLC management interface', ro: 'interfața logică principală a WLC-ului',
    what: 'Interfața logică cu adresa IP principală a WLC-ului: management in-band (GUI/SSH), comunicația cu AP-urile (terminarea CAPWAP) și cu serverele de autentificare.',
    how: 'Are VLAN ID și adresă IP; poate fi untagged (VLAN-ul nativ al trunk-ului) sau etichetată. Trebuie permisă pe trunk-ul spre switch.',
    where: 'Orice WLC; AP-urile își descoperă și se alătură la această adresă.',
    layer: 'L3', aliases: ['management interface'], topics: ['2.7'],
  },
  {
    id: 'wlc-dynamic-interface', abbr: 'Dynamic interface (WLC)', full: 'WLC dynamic interface', ro: 'interfața logică care mapează un WLAN pe un VLAN',
    what: 'Interfață logică a WLC-ului, creată per VLAN de clienți, cu propriul VLAN ID, adresă IP și setări DHCP; un WLAN este asociat unei interfețe dinamice.',
    how: 'Când un client se asociază la un SSID, WLC-ul scoate cadrul din tunelul CAPWAP și îl trimite pe trunk, etichetat cu VLAN-ul interfeței; clientul primește IP din acea subrețea (prin DHCP relay/server).',
    where: 'La fiecare WLAN: CORP → VLAN 10, VOICE → VLAN 20, GUEST → VLAN 30 etc.',
    layer: 'L3', aliases: ['dynamic interface'], topics: ['2.7', '2.9'],
  },
  {
    id: 'wlc-virtual-interface', abbr: 'Virtual interface (WLC)', full: 'WLC virtual interface', ro: 'adresă logică unică folosită pentru DHCP relay, web auth și mobilitate',
    what: 'Interfață logică a WLC-ului cu o adresă „fictivă” (de exemplu 192.0.2.1), identică pe toate controllerele dintr-un grup de mobilitate.',
    how: 'Este țintă pentru DHCP relay, autentificare web și roaming: clienții văd același „controller” indiferent de WLC-ul pe care se află. Adresa nu este rutată în rețeaua reală.',
    where: 'Configurare inițială a WLC-ului; mobilitate între controllere.',
    layer: 'L3', aliases: ['virtual interface'], topics: ['2.7'],
  },
];
