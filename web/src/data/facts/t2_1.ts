import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.1 Configure and verify VLANs (normal range) spanning multiple switches
export const FACTS: Fact[] = [
  { topicId: '2.1', id: 'f-2.1-01', front: 'Ce este un VLAN?', back: 'Un domeniu de broadcast separat, creat logic pe un switch; de regulă corespunde unei subrețele IP', detail: 'Stațiile din VLAN-uri diferite comunică doar printr-un dispozitiv de nivel 3.' },
  { topicId: '2.1', id: 'f-2.1-02', front: 'Intervalul VLAN „normal range”', back: '1–1005 (cu 1 și 1002–1005 speciale); extended range = 1006–4094', detail: '0 și 4095 sunt rezervate. Normal range se păstrează în vlan.dat.' },
  { topicId: '2.1', id: 'f-2.1-03', front: 'Comenzile minime pentru un port access într-un VLAN', back: 'switchport mode access + switchport access vlan N', detail: 'VLAN-ul trebuie să existe (vlan N); altfel portul poate fi inactive.' },
  { topicId: '2.1', id: 'f-2.1-04', front: 'Ce comandă listează VLAN-urile și porturile lor access?', back: 'show vlan brief', detail: 'Porturile trunk NU apar în această listă; pentru ele: show interfaces trunk.' },
  { topicId: '2.1', id: 'f-2.1-05', front: 'Ce se întâmplă cu porturile unui VLAN șters (no vlan N)?', back: 'Rămân atribuite VLAN-ului șters și devin inactive', detail: 'Nu sunt mutate în VLAN 1. Recrearea VLAN-ului le reactivează.' },
  { topicId: '2.1', id: 'f-2.1-06', front: 'Cum configurezi un voice VLAN?', back: 'Pe un port access: switchport voice vlan N', detail: 'Telefonul află VLAN-ul prin CDP/LLDP-MED, își etichetează vocea cu 802.1Q; PC-ul din spatele lui rămâne fără tag în VLAN-ul de date.' },
  { topicId: '2.1', id: 'f-2.1-07', front: 'Care trafic e cu tag pe un port access cu voice VLAN?', back: 'Doar vocea telefonului (802.1Q, VID = voice VLAN); datele PC-ului sunt fără tag', detail: 'Prioritatea clasică pentru voce: CoS 5.' },
  { topicId: '2.1', id: 'f-2.1-08', front: 'Ce este VLAN 1?', back: 'Default VLAN: toate porturile din fabrică; nu se șterge și nu se redenumește', detail: 'E și VLAN-ul nativ implicit al trunk-urilor.' },
  { topicId: '2.1', id: 'f-2.1-09', front: 'De ce să nu folosești VLAN 1 pentru utilizatori/management?', back: 'Domeniu de broadcast mare, management amestecat cu utilizatorii, trafic de control și VLAN nativ în același VLAN', detail: 'Hardening: VLAN-uri dedicate + VLAN de parcare și shutdown pe porturile libere.' },
  { topicId: '2.1', id: 'f-2.1-10', front: 'Cele trei metode de inter-VLAN routing', back: 'Un port de router per VLAN (învechit), router-on-a-stick, switch L3 cu SVI', detail: 'Campusul folosește SVI-uri; ROAS apare în filiale și la examen.' },
  { topicId: '2.1', id: 'f-2.1-11', front: 'Ce configurezi pe interfața fizică în router-on-a-stick?', back: 'Doar no shutdown, fără adresă IP', detail: 'IP-urile stau pe subinterfețe cu encapsulation dot1Q N.' },
  { topicId: '2.1', id: 'f-2.1-12', front: 'Comanda care leagă o subinterfață de un VLAN', back: 'encapsulation dot1Q <vlan-id>', detail: 'Se dă înainte de ip address; numărul din numele subinterfeței e doar convenție.' },
  { topicId: '2.1', id: 'f-2.1-13', front: 'Portul switch-ului spre router în ROAS trebuie să fie…', back: 'Trunk, cu VLAN-urile necesare permise', detail: 'Un port access ar transporta un singur VLAN.' },
  { topicId: '2.1', id: 'f-2.1-14', front: 'Ce comandă activează rutarea pe un switch L3?', back: 'ip routing (global)', detail: 'Fără ea, SVI-urile nu rutează între ele.' },
  { topicId: '2.1', id: 'f-2.1-15', front: 'Când e un SVI up/up?', back: 'Când VLAN-ul există și are cel puțin un port activ (autostate) și SVI-ul nu e în shutdown', detail: 'Un VLAN șters sau fără porturi active ⇒ SVI up/down.' },
  { topicId: '2.1', id: 'f-2.1-16', front: 'Ce face „no switchport” pe un switch L3?', back: 'Transformă portul într-un port routed (L3), cu IP direct pe port', detail: 'Portul nu mai aparține niciunui VLAN.' },
  { topicId: '2.1', id: 'f-2.1-17', front: 'Unde sunt stocate VLAN-urile din normal range?', back: 'În fișierul vlan.dat din flash, nu în startup-config', detail: 'Ștergerea startup-config nu șterge VLAN-urile; trebuie șters și vlan.dat.' },
  { topicId: '2.1', id: 'f-2.1-18', front: 'Ce gateway trebuie să aibă un host din VLAN 10 (192.168.10.0/24)?', back: 'O adresă din același VLAN/subrețea: IP-ul SVI-ului sau al subinterfeței din VLAN 10', detail: 'Un gateway din altă subrețea nu poate fi atins la nivel 2.' },
  { topicId: '2.1', id: 'f-2.1-19', front: 'Ce risc aduce VTP cu un revision number mare?', back: 'Un switch adăugat în rețea își poate impune baza de date și poate șterge VLAN-urile existente', detail: 'De aceea în laburi se folosește transparent/off.' },
];
