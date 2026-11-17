import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.2 Configure and verify interswitch connectivity
export const FACTS: Fact[] = [
  { topicId: '2.2', id: 'f-2.2-01', front: 'Ce este un trunk?', back: 'O legătură între switch-uri care transportă mai multe VLAN-uri, cu cadrele etichetate 802.1Q', detail: 'Evită un cablu per VLAN. Nu apare în show vlan brief; se verifică cu show interfaces trunk.' },
  { topicId: '2.2', id: 'f-2.2-02', front: 'Câți octeți are tag-ul 802.1Q și unde se inserează?', back: '4 octeți, imediat după adresa MAC sursă', detail: 'TPID 2 octeți (0x8100) + TCI 2 octeți.' },
  { topicId: '2.2', id: 'f-2.2-03', front: 'Structura TCI din tag-ul 802.1Q', back: 'PCP 3 biți + DEI 1 bit + VID 12 biți', detail: 'PCP = prioritate/CoS 0–7; VID = VLAN ID.' },
  { topicId: '2.2', id: 'f-2.2-04', front: 'Valoarea TPID pentru 802.1Q', back: '0x8100', detail: 'Ocupă locul EtherType-ului și anunță un tag VLAN.' },
  { topicId: '2.2', id: 'f-2.2-05', front: 'Câte VLAN-uri se pot folosi cu 12 biți de VID?', back: '4094 (1–4094); 0 și 4095 sunt rezervate', detail: 'Normal range 1–1005, extended 1006–4094.' },
  { topicId: '2.2', id: 'f-2.2-06', front: 'Dimensiunea maximă a unui cadru Ethernet cu tag 802.1Q', back: '1522 octeți (1518 fără tag)', detail: 'FCS-ul se recalculează când se adaugă sau se scoate tag-ul.' },
  { topicId: '2.2', id: 'f-2.2-07', front: '802.1Q versus ISL', back: '802.1Q = standard IEEE, tag de 4 B; ISL = proprietar Cisco, antet 26 B + FCS 4 B, învechit', detail: 'Pe switch-urile doar-802.1Q (de exemplu 2960) nu există comanda switchport trunk encapsulation.' },
  { topicId: '2.2', id: 'f-2.2-08', front: 'Comanda care face un port trunk', back: 'switchport mode trunk', detail: 'Pe platforme cu ISL, întâi switchport trunk encapsulation dot1q.' },
  { topicId: '2.2', id: 'f-2.2-09', front: 'Ce face switchport trunk allowed vlan 30 (fără add)?', back: 'Înlocuiește TOATĂ lista VLAN-urilor permise cu doar 30', detail: 'Pentru a adăuga: allowed vlan add 30; pentru a scoate: remove.' },
  { topicId: '2.2', id: 'f-2.2-10', front: 'Comanda care arată trunk-urile, modul, native VLAN și listele de VLAN-uri', back: 'show interfaces trunk', detail: 'Are trei liste: allowed, allowed and active, forwarding and not pruned.' },
  { topicId: '2.2', id: 'f-2.2-11', front: 'Ce rezultă din dynamic auto + dynamic auto?', back: 'Access, nu trunk', detail: 'Niciunul nu cere trunk. Cel puțin un capăt trebuie să fie trunk sau desirable.' },
  { topicId: '2.2', id: 'f-2.2-12', front: 'Ce rezultă din trunk + access?', back: 'Mismatch: conectivitate limitată / nefuncțională', detail: 'Aliniază modurile (mode trunk pe ambele).' },
  { topicId: '2.2', id: 'f-2.2-13', front: 'Cum oprești DTP pe un port?', back: 'switchport nonegotiate', detail: 'Folosit pe trunk-uri setate explicit; pe porturile utilizatorilor se folosește mode access.' },
  { topicId: '2.2', id: 'f-2.2-14', front: 'Care este native VLAN implicit și cum circulă?', back: 'VLAN 1; cadrele lui circulă fără tag pe trunk', detail: 'Cadrele netaggate primite pe trunk sunt atribuite native VLAN-ului.' },
  { topicId: '2.2', id: 'f-2.2-15', front: 'Cum schimbi native VLAN-ul?', back: 'switchport trunk native vlan N (pe ambele capete)', detail: 'La ROAS: encapsulation dot1Q N native pe subinterfață.' },
  { topicId: '2.2', id: 'f-2.2-16', front: 'Ce mesaj apare la native VLAN nepotrivit?', back: '%CDP-4-NATIVE_VLAN_MISMATCH', detail: 'Efect: scurgere de trafic între VLAN-uri. Potrivește valorile.' },
  { topicId: '2.2', id: 'f-2.2-17', front: 'Ce este VLAN hopping?', back: 'Atac prin care atacatorul ajunge într-un VLAN la care nu are acces: switch spoofing (DTP) sau double tagging', detail: 'Mitigare: access explicit, nonegotiate, native VLAN neutilizat, shutdown pe porturile libere.' },
  { topicId: '2.2', id: 'f-2.2-18', front: 'De ce un VLAN permis pe trunk poate să nu treacă?', back: 'Pentru că VLAN-ul nu există (nu a fost creat) pe switch, sau STP îl blochează', detail: 'Vezi a doua și a treia listă din show interfaces trunk.' },
  { topicId: '2.2', id: 'f-2.2-19', front: 'Ce face PCP din tag-ul 802.1Q?', back: 'Poartă prioritatea CoS (0–7); vocea folosește de regulă 5', detail: 'Folosit pentru QoS pe legături tagate.' },
];
