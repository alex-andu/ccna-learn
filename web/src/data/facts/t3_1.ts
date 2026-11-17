import type { Fact } from '../flashcards';

// Fapte esențiale pentru 3.1 Componentele tabelei de rutare
export const FACTS: Fact[] = [
  { topicId: '3.1', id: 'f-3.1-01', front: 'Ce înseamnă [110/2] într-o rută?', back: '[AD / metrică]: AD 110 (OSPF), metrică 2', detail: 'Primul număr = încrederea în sursă; al doilea = costul căii.' },
  { topicId: '3.1', id: 'f-3.1-02', front: 'Ce înseamnă codul C în show ip route?', back: 'Rețea conectată direct unei interfețe up/up cu IP', detail: 'AD 0.' },
  { topicId: '3.1', id: 'f-3.1-03', front: 'Ce înseamnă codul L?', back: 'Rută locală /32: adresa interfeței routerului însuși', detail: 'Pachetele cu acea destinație se livrează local.' },
  { topicId: '3.1', id: 'f-3.1-04', front: 'Coduri frecvente de rută', back: 'C connected · L local · S static · S* implicită · O OSPF · D EIGRP · R RIP · B BGP', detail: 'IA = OSPF inter-area; E1/E2 = OSPF external; EX = EIGRP external.' },
  { topicId: '3.1', id: 'f-3.1-05', front: 'AD connected / static', back: '0 / 1', detail: 'Cele mai de încredere surse.' },
  { topicId: '3.1', id: 'f-3.1-06', front: 'AD OSPF / RIP / EIGRP intern', back: '110 / 120 / 90', detail: 'Mai mic = mai de încredere.' },
  { topicId: '3.1', id: 'f-3.1-07', front: 'AD eBGP / iBGP', back: '20 / 200', detail: 'eBGP între AS-uri diferite; iBGP în același AS.' },
  { topicId: '3.1', id: 'f-3.1-08', front: 'AD EIGRP extern', back: '170', detail: 'Rute redistribuite în EIGRP (cod D EX).' },
  { topicId: '3.1', id: 'f-3.1-09', front: 'AD 255 înseamnă…', back: 'Sursă necunoscută/nefolosibilă: ruta nu intră în tabelă', detail: 'Cea mai puțin de încredere valoare.' },
  { topicId: '3.1', id: 'f-3.1-10', front: 'Ce decide AD?', back: 'Între rute către același prefix din surse diferite', detail: 'Mai mic câștigă.' },
  { topicId: '3.1', id: 'f-3.1-11', front: 'Ce decide metrica?', back: 'Între rute către același prefix din același protocol', detail: 'Mai mică = mai bună; egale ⇒ ECMP.' },
  { topicId: '3.1', id: 'f-3.1-12', front: 'Metrica OSPF', back: 'Cost = 100 Mbps ÷ bandă (implicit); FE/GE/10G = 1', detail: 'Costul unui drum = suma costurilor interfețelor de ieșire.' },
  { topicId: '3.1', id: 'f-3.1-13', front: 'Metrica RIP', back: 'Număr de hop-uri; maxim 15, 16 = inaccesibil', detail: 'Nu ține cont de viteza legăturilor.' },
  { topicId: '3.1', id: 'f-3.1-14', front: 'Next hop', back: 'Adresa IP a următorului router de pe drum (după „via”)', detail: 'ARP se face pentru next hop; IP-ul destinației rămâne neschimbat.' },
  { topicId: '3.1', id: 'f-3.1-15', front: 'Rutele connected au next hop?', back: 'Nu — destinația e pe aceeași rețea', detail: 'Se afișează „is directly connected” și interfața.' },
  { topicId: '3.1', id: 'f-3.1-16', front: 'Căutarea recursivă', back: 'Destinația → rută cu next hop IP → next hop → rută connected → interfață de ieșire', detail: 'Dacă a doua căutare eșuează, ruta nu se folosește.' },
  { topicId: '3.1', id: 'f-3.1-17', front: 'Ruta implicită IPv4 / IPv6', back: '0.0.0.0/0 / ::/0', detail: 'Cod S* dacă e statică.' },
  { topicId: '3.1', id: 'f-3.1-18', front: '„Gateway of last resort is not set”', back: 'Nu există rută implicită', detail: 'Pachetele fără rută specifică se aruncă; ping pe router arată U.' },
  { topicId: '3.1', id: 'f-3.1-19', front: 'Ce este linia „is variably subnetted”?', back: 'Antet de grupare (rețea clasică, nr. de subrețele și de măști); nu e o rută', detail: 'Ex.: 10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks.' },
  { topicId: '3.1', id: 'f-3.1-20', front: 'Care comandă arată ruta folosită pentru o adresă?', back: 'show ip route <adresă>', detail: 'Arată sursa, AD, metrica, next hop și interfața.' },
];
