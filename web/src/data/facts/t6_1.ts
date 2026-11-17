import type { Fact } from '../flashcards';

// Fapte esențiale pentru 6.1 — impactul automatizării asupra managementului rețelei
export const FACTS: Fact[] = [
  { topicId: '6.1', id: 'f-6.1-01', front: 'Cele patru dureri ale managementului manual', back: 'Scară · greșeli umane · inconsistență (drift) · lipsă de vizibilitate', detail: 'Repetiția manuală garantează statistic greșeli la scară mare.' },
  { topicId: '6.1', id: 'f-6.1-02', front: 'Ce este configuration drift?', back: 'Diferența dintre configurația dorită și cea reală, apărută în timp', detail: 'Cauză tipică: modificări manuale „de urgență” netrecute în sursa de adevăr.' },
  { topicId: '6.1', id: 'f-6.1-03', front: 'Prin ce plan intră automatizarea?', back: 'Prin management plane (SSH, NETCONF, RESTCONF, API REST, SNMP)', detail: 'Ea schimbă apoi comportamentul control plane-ului și data plane-ului.' },
  { topicId: '6.1', id: 'f-6.1-04', front: 'Cele trei planuri', back: 'Management (administrare) · Control (construiește tabelele) · Data (mută pachetele)', detail: 'Exemple: SSH/SNMP · OSPF/STP/ARP · forwarding/ACL/NAT/QoS.' },
  { topicId: '6.1', id: 'f-6.1-05', front: 'Fluxul unei automatizări', back: 'Intent → șablon+variabile → validare → aplicare → verificare → remediere/rollback', detail: 'Bucla se repetă la fiecare intenție nouă sau drift detectat.' },
  { topicId: '6.1', id: 'f-6.1-06', front: 'Ce este o sursă de adevăr?', back: 'Locul unic unde e definită starea dorită (inventar, variabile, politici), de obicei în Git', detail: 'Rețeaua urmează sursa de adevăr, nu invers.' },
  { topicId: '6.1', id: 'f-6.1-07', front: 'Șablon + variabile', back: 'Configurație cu „găuri” completate din variabile per echipament/grup', detail: 'Ex.: ntp server {{ ntp_server }}; 200 de configurații dintr-un șablon.' },
  { topicId: '6.1', id: 'f-6.1-08', front: 'Ce înseamnă idempotent?', back: 'Aplicat de mai multe ori dă același rezultat ca o singură dată', detail: 'Declarativ: „VLAN 20 să existe”. În HTTP: GET/PUT/DELETE da, POST nu.' },
  { topicId: '6.1', id: 'f-6.1-09', front: 'Principalul beneficiu la examen', back: 'Consecvență și reducerea erorilor umane (apoi viteză, conformitate, vizibilitate)', detail: 'Nu „elimină ingineri”: schimbă rolul.' },
  { topicId: '6.1', id: 'f-6.1-10', front: 'Riscul-cheie al automatizării', back: 'O greșeală se propagă rapid pe multe echipamente (blast radius)', detail: 'Mitigare: validare, lot-pilot, verificare după, rollback.' },
  { topicId: '6.1', id: 'f-6.1-11', front: 'Ce este IaC?', back: 'Infrastructure as Code: infrastructura descrisă în fișiere versionate, revizuite și executate', detail: 'Ex.: YAML (Ansible), HCL (Terraform).' },
  { topicId: '6.1', id: 'f-6.1-12', front: 'Ce este ZTP?', back: 'Zero-Touch Provisioning: echipamentul nou se autoconfigurează la prima pornire', detail: 'De obicei prin DHCP + server de configurare.' },
  { topicId: '6.1', id: 'f-6.1-13', front: 'Telemetrie vs show manual', back: 'Telemetria: echipamentul trimite singur date structurate, continuu; show: ceri tu o dată', detail: 'Baza pentru verificare automată și analiză AI/ML.' },
  { topicId: '6.1', id: 'f-6.1-14', front: 'Ce este closed-loop automation?', back: 'Măsori → compari cu intenția → reacționezi (automat sau cu aprobare)', detail: 'Se introduce treptat, cu om în buclă la început.' },
  { topicId: '6.1', id: 'f-6.1-15', front: 'Ce transport folosesc scripturile', back: 'SSH+CLI (text) · NETCONF/RESTCONF (date structurate) · API REST · SNMP (mai ales citire)', detail: 'Datele structurate sunt mai fiabile decât parsarea textului.' },
  { topicId: '6.1', id: 'f-6.1-16', front: 'Cont pentru automatizare', back: 'Utilizator dedicat, privilegii limitate, credențiale în seif sau variabile de mediu, rotite', detail: 'Niciodată credențiale în cod sau în Git.' },
  { topicId: '6.1', id: 'f-6.1-17', front: 'Cum se schimbă rolul inginerului', back: 'Din „operator de CLI” în proiectant/validator/supervizor al sistemelor de automatizare', detail: 'Cunoașterea protocoalelor rămâne fundament.' },
  { topicId: '6.1', id: 'f-6.1-18', front: 'De ce lot-pilot?', back: 'Aplici întâi pe puține echipamente și verifici înainte să extinzi', detail: 'Limitează raza de impact a unei greșeli din șablon.' },
];
