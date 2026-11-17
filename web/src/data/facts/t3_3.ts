import type { Fact } from '../flashcards';

// Fapte esențiale pentru 3.3 Rute statice IPv4/IPv6
export const FACTS: Fact[] = [
  { topicId: '3.3', id: 'f-3.3-01', front: 'Sintaxa unei rute statice IPv4', back: 'ip route <rețea> <mască> <next-hop | interfață> [AD]', detail: 'Masca în format zecimal; AD opțional, implicit 1.' },
  { topicId: '3.3', id: 'f-3.3-02', front: 'Sintaxa unei rute statice IPv6', back: 'ipv6 route <prefix>/<lungime> <next-hop | interfață> [AD]', detail: 'Prefix/lungime, fără mască zecimală.' },
  { topicId: '3.3', id: 'f-3.3-03', front: 'AD implicit al unei rute statice', back: '1', detail: 'Connected are 0; statica bate orice protocol dinamic pentru același prefix.' },
  { topicId: '3.3', id: 'f-3.3-04', front: 'Ruta implicită IPv4', back: 'ip route 0.0.0.0 0.0.0.0 <next-hop>', detail: 'Apare ca S* și „Gateway of last resort”.' },
  { topicId: '3.3', id: 'f-3.3-05', front: 'Ruta implicită IPv6', back: 'ipv6 route ::/0 <next-hop>', detail: 'Prefix de lungime 0.' },
  { topicId: '3.3', id: 'f-3.3-06', front: 'Ce comandă trebuie pornită pentru rutare IPv6?', back: 'ipv6 unicast-routing', detail: 'Configurare globală; fără ea routerul nu retransmite IPv6.' },
  { topicId: '3.3', id: 'f-3.3-07', front: 'Masca unei rute de gazdă IPv4 / IPv6', back: '255.255.255.255 (/32) · /128', detail: 'Acoperă o singură adresă; cea mai specifică posibilă.' },
  { topicId: '3.3', id: 'f-3.3-08', front: 'Ce este o rută statică flotantă?', back: 'Rută statică de rezervă cu AD mărit peste cel al rutei principale', detail: 'Se instalează doar când ruta principală dispare.' },
  { topicId: '3.3', id: 'f-3.3-09', front: 'AD pentru o flotantă care acoperă OSPF', back: 'Mai mare de 110 (de exemplu 130)', detail: 'Cu un AD mai mic ar bate OSPF și nu ar mai fi rezervă.' },
  { topicId: '3.3', id: 'f-3.3-10', front: 'Unde se pune AD-ul în comanda ip route?', back: 'La sfârșit, după next hop', detail: 'ip route 10.2.0.0 255.255.0.0 10.9.9.2 130' },
  { topicId: '3.3', id: 'f-3.3-11', front: 'Cele trei forme ale unei rute statice', back: 'Next hop (recursivă) · doar interfață (directly attached) · interfață + next hop (fully specified)', detail: 'Pe Ethernet se preferă next hop sau fully specified.' },
  { topicId: '3.3', id: 'f-3.3-12', front: 'De ce e slabă o rută statică doar cu interfață pe Ethernet?', back: 'Routerul face ARP pentru fiecare destinație și depinde de proxy ARP', detail: 'Pe legături seriale punct-la-punct nu e problemă.' },
  { topicId: '3.3', id: 'f-3.3-13', front: 'Next hop IPv6 de tip link-local într-o rută statică', back: 'Cere și interfața de ieșire (fully specified)', detail: 'Aceeași fe80:: poate exista pe mai multe interfețe.' },
  { topicId: '3.3', id: 'f-3.3-14', front: 'Ping între LAN-uri: câte rute sunt necesare?', back: 'Rută dus și rută de întoarcere, pe fiecare router de pe cale', detail: 'Fiecare router rutează independent cererea și răspunsul.' },
  { topicId: '3.3', id: 'f-3.3-15', front: '„Destination host unreachable” vs „Request timed out”', back: 'Unreachable: un router n-are rută pe calea dus · Timeout: cererea a plecat, răspunsul nu s-a întors (de obicei rută de întoarcere lipsă)', detail: 'Diagnostic rapid pentru rute statice.' },
  { topicId: '3.3', id: 'f-3.3-16', front: 'Când nu se instalează o rută statică în tabelă?', back: 'Când next hop-ul nu e accesibil / interfața e down sau există aceeași destinație cu AD mai mic', detail: 'Ea rămâne totuși în running-config.' },
  { topicId: '3.3', id: 'f-3.3-17', front: 'Două rute statice către același prefix, același AD', back: 'Se instalează ambele (ECMP), nu principală/rezervă', detail: 'Pentru rezervă trebuie AD diferit.' },
  { topicId: '3.3', id: 'f-3.3-18', front: 'Codurile din show ip route pentru rute statice', back: 'S = statică · S* = rută implicită statică (candidate default)', detail: 'Ruta implicită apare și ca „Gateway of last resort”.' },
  { topicId: '3.3', id: 'f-3.3-19', front: 'Rezumarea a 192.168.0.0/24–192.168.3.0/24 într-o rută statică', back: '192.168.0.0 255.255.252.0 (/22)', detail: 'Doar dacă toate sunt în spatele aceluiași next hop.' },
  { topicId: '3.3', id: 'f-3.3-20', front: 'Ce comenzi verifică rutele statice?', back: 'show ip route [static] · show ipv6 route [static] · show ip route <adresă> · ping · traceroute', detail: 'show running-config | include ip route arată și rutele din rezervă.' },
];
