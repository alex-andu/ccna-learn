import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.7 Conexiuni fizice WLAN
export const FACTS: Fact[] = [
  { topicId: '2.7', id: 'f-2.7-01', front: 'Port de switch pentru AP lightweight în modul Local', back: 'Access, în VLAN-ul de management al AP-urilor', detail: 'Datele clienților merg în CAPWAP.' },
  { topicId: '2.7', id: 'f-2.7-02', front: 'Port de switch pentru AP FlexConnect cu local switching', back: 'Trunk (VLAN mgmt nativ + VLAN-urile clienților)', detail: 'AP-ul etichetează 802.1Q local.' },
  { topicId: '2.7', id: 'f-2.7-03', front: 'Cum se alimentează un AP?', back: 'PoE (802.3af/at/bt) de la switch sau midspan', detail: 'Distanța maximă pe UTP: 100 m.' },
  { topicId: '2.7', id: 'f-2.7-04', front: 'Portul de date al WLC-ului: tip de port de switch', back: 'Trunk 802.1Q, opțional în LAG', detail: 'VLAN mgmt + VLAN-urile interfețelor dinamice.' },
  { topicId: '2.7', id: 'f-2.7-05', front: 'Service port: rol și port de switch', back: 'Management out-of-band; port access în VLAN OOB', detail: 'Nu trunk, nu face parte din LAG.' },
  { topicId: '2.7', id: 'f-2.7-06', front: 'Redundancy port', back: 'Leagă două WLC-uri într-o pereche HA', detail: 'Sincronizare de stare și configurație.' },
  { topicId: '2.7', id: 'f-2.7-07', front: 'Console port la WLC', back: 'Acces CLI local pentru configurare inițială/recuperare', detail: 'Nu se leagă la switch.' },
  { topicId: '2.7', id: 'f-2.7-08', front: 'Management interface la WLC', back: 'Adresa IP principală: mgmt in-band, terminarea CAPWAP', detail: 'Trebuie permisă pe trunk.' },
  { topicId: '2.7', id: 'f-2.7-09', front: 'Dynamic interface la WLC', back: 'Mapează un WLAN pe un VLAN și o subrețea', detail: 'O interfață pe VLAN de clienți.' },
  { topicId: '2.7', id: 'f-2.7-10', front: 'Virtual interface la WLC', back: 'Adresă logică (ex. 192.0.2.1) pentru DHCP relay, web auth, mobilitate', detail: 'Nu este rutată în rețea.' },
  { topicId: '2.7', id: 'f-2.7-11', front: 'Ce este LAG?', back: 'Mai multe linkuri tratate ca unul logic (echivalentul EtherChannel)', detail: 'IEEE 802.3ad / 802.1AX.' },
  { topicId: '2.7', id: 'f-2.7-12', front: 'LAG la WLC AireOS: mod de agregare', back: 'Static (on): fără LACP/PAgP', detail: 'Switch: channel-group N mode on.' },
  { topicId: '2.7', id: 'f-2.7-13', front: 'Ce cere activarea LAG pe WLC AireOS?', back: 'Repornirea controller-ului', detail: 'Și toate porturile spre același switch.' },
  { topicId: '2.7', id: 'f-2.7-14', front: 'Clientul se asociază dar nu primește IP: cauze', back: 'VLAN nepermis pe trunk, WLAN pe interfață greșită, DHCP lipsă', detail: 'Verifică trunk + interfața dinamică + DHCP.' },
  { topicId: '2.7', id: 'f-2.7-15', front: 'Native VLAN nepotrivit între WLC și switch: efect', back: 'Managementul untagged ajunge în alt VLAN ⇒ acces rupt', detail: 'Cf. 2.2.' },
  { topicId: '2.7', id: 'f-2.7-16', front: 'De ce PortFast pe portul AP-ului?', back: 'AP-ul pornește rapid și își găsește WLC-ul fără să aștepte STP', detail: 'Edge port.' },
  { topicId: '2.7', id: 'f-2.7-17', front: 'Ce VLAN-uri trebuie permise pe trunk-ul spre WLC?', back: 'Managementul + toate VLAN-urile interfețelor dinamice', detail: 'switchport trunk allowed vlan …' },
  { topicId: '2.7', id: 'f-2.7-18', front: 'Ce se întâmplă cu LAG-ul dacă porturile merg la switch-uri diferite?', back: 'Nu poate fi folosit; porturile se configurează independent', detail: 'LAG cere același switch (sau stivă).' },
];
