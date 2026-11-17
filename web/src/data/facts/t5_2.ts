import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.2 program de securitate
export const FACTS: Fact[] = [
  { topicId: '5.2', id: 'f-5.2-01', front: 'Cele 3 elemente ale programului de securitate din 5.2', back: 'User awareness, training, physical access control', detail: 'Nu includ firewall/ACL/criptare (controale tehnice).' },
  { topicId: '5.2', id: 'f-5.2-02', front: 'Awareness vs training vs education', back: 'Awareness: ce să recunosc (toți) · Training: cum fac (pe rol) · Education: de ce (specialiști)', detail: 'Awareness e scurt și continuu.' },
  { topicId: '5.2', id: 'f-5.2-03', front: 'Policy vs standard vs procedure vs guideline', back: 'Ce/de ce · cerințe măsurabile · pași · recomandare', detail: 'Doar guideline nu este obligatoriu.' },
  { topicId: '5.2', id: 'f-5.2-04', front: 'Scopul unei simulări de phishing', back: 'Învățarea utilizatorilor să recunoască și să raporteze', detail: 'Indicator-cheie: rata de raportare.' },
  { topicId: '5.2', id: 'f-5.2-05', front: 'Ce este un mantrap?', back: 'Vestibul cu două uși care previne tailgating-ul', detail: 'A doua ușă se deschide doar după ce prima s-a închis.' },
  { topicId: '5.2', id: 'f-5.2-06', front: 'Ce este tailgating?', back: 'Intrare fizică neautorizată lipit de o persoană autorizată', detail: 'Social engineering fizic.' },
  { topicId: '5.2', id: 'f-5.2-07', front: 'Camerele CCTV sunt controale…', back: 'Detective (și de descurajare)', detail: 'Ușa încuiată e preventivă.' },
  { topicId: '5.2', id: 'f-5.2-08', front: 'De ce contează accesul fizic?', back: 'Ocolește firewall-ul: console, porturi libere, recuperarea parolei, furt', detail: 'Control fizic + hardening de dispozitiv.' },
  { topicId: '5.2', id: 'f-5.2-09', front: 'Straturile controlului fizic', back: 'Perimetru → clădire → etaj → sală → rack', detail: 'Cu cât mai în interior, cu atât mai multe controale.' },
  { topicId: '5.2', id: 'f-5.2-10', front: 'Fazele răspunsului la incidente', back: 'Pregătire · detectare/analiză · izolare/eradicare · recuperare · lecții învățate', detail: 'Planul se exersează periodic.' },
  { topicId: '5.2', id: 'f-5.2-11', front: 'Separation of duties', back: 'Niciun individ nu controlează singur un proces critic', detail: 'Cine cere ≠ cine aprobă.' },
  { topicId: '5.2', id: 'f-5.2-12', front: 'Clasificarea datelor', back: 'Public · intern · confidențial · secret → nivel de protecție', detail: 'Categoriile exacte diferă între organizații.' },
  { topicId: '5.2', id: 'f-5.2-13', front: 'Comenzi IOS care leagă controlul fizic de echipament', back: 'line console 0 + login + exec-timeout · shutdown pe porturi libere · banner login', detail: 'logging host pentru urme.' },
  { topicId: '5.2', id: 'f-5.2-14', front: 'Ce șterge write erase?', back: 'Startup-config (configurația salvată)', detail: 'Se face la casarea echipamentului; media se tratează separat.' },
  { topicId: '5.2', id: 'f-5.2-15', front: 'Riscul lui no service password-recovery', back: 'Recuperarea parolei devine posibilă doar cu ștergerea configurației', detail: 'Verifică documentația platformei.' },
  { topicId: '5.2', id: 'f-5.2-16', front: 'Banner de login: ce conține', back: 'Avertisment că accesul e autorizat și monitorizat; fără detalii despre echipament', detail: 'Valoare legală și de descurajare.' },
];
