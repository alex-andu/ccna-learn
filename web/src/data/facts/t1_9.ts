import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.9 Describe IPv6 address types
export const FACTS: Fact[] = [
  { topicId: '1.9', id: 'f-1.9-01', front: 'Cele trei tipuri de adrese IPv6', back: 'Unicast · Anycast · Multicast', detail: 'Nu există broadcast; rolul lui este preluat de multicast.' },
  { topicId: '1.9', id: 'f-1.9-02', front: 'Prefixul adreselor globale (GUA)', back: '2000::/3 (prima cifră hexa: 2 sau 3)', detail: '2001:db8::/32 = documentație.' },
  { topicId: '1.9', id: 'f-1.9-03', front: 'Prefixul ULA', back: 'fc00::/7 (în practică fd00::/8)', detail: 'Structură: fd + Global ID 40 b + Subnet ID 16 b + IID 64 b (RFC 4193).' },
  { topicId: '1.9', id: 'f-1.9-04', front: 'Prefixul link-local', back: 'fe80::/10 (în practică fe80::/64)', detail: 'Nu este rutată. Există pe orice interfață IPv6. Gateway-ul hostilor este link-local-ul routerului.' },
  { topicId: '1.9', id: 'f-1.9-05', front: 'Ce înlocuiește ULA în IPv6?', back: 'Rolul adreselor private RFC 1918 (fără NAT)', detail: 'fec0::/10 (site-local) este depreciat.' },
  { topicId: '1.9', id: 'f-1.9-06', front: 'Loopback și adresa nespecificată', back: '::1/128 și ::/128', detail: 'Loopback este o singură adresă (nu un /8). :: = sursă la DAD.' },
  { topicId: '1.9', id: 'f-1.9-07', front: 'Anycast — cum funcționează?', back: 'Aceeași adresă pe mai multe noduri; pachetul ajunge la cel mai apropiat', detail: 'Arată ca o adresă unicast; pe Cisco: ipv6 address …/64 anycast.' },
  { topicId: '1.9', id: 'f-1.9-08', front: 'Prefixul multicast', back: 'ff00::/8', detail: 'Format: ff + 4 biți flag-uri + 4 biți scope + 112 biți group ID.' },
  { topicId: '1.9', id: 'f-1.9-09', front: 'Scope multicast', back: '1 interfață · 2 link-local · 5 site · 8 organizație · e global', detail: 'A patra cifră din ff0X::.' },
  { topicId: '1.9', id: 'f-1.9-10', front: 'ff02::1 și ff02::2', back: 'All-nodes și all-routers (link-local)', detail: 'ff02::2 apare doar după ipv6 unicast-routing.' },
  { topicId: '1.9', id: 'f-1.9-11', front: 'Multicast pentru protocoale de rutare', back: 'OSPF ff02::5/6 · RIPng ff02::9 · EIGRP ff02::a', detail: 'DHCPv6: ff02::1:2.' },
  { topicId: '1.9', id: 'f-1.9-12', front: 'Grupul solicited-node', back: 'ff02::1:ff + ultimii 24 de biți ai adresei (prefix ff02::1:ff00:0/104)', detail: 'Ex.: 2001:db8:acad:1::1 și fe80::1 → ff02::1:ff00:1.' },
  { topicId: '1.9', id: 'f-1.9-13', front: 'De ce solicited-node?', back: 'NS (echivalentul ARP) ajunge aproape doar la nodul căutat', detail: 'MAC multicast 33:33:ff:XX:XX:XX; filtrare în hardware.' },
  { topicId: '1.9', id: 'f-1.9-14', front: 'Modified EUI-64 — pașii', back: '1) împarte MAC-ul · 2) inserează FFFE la mijloc · 3) inversează bitul 7 al primului octet', detail: '00:11:22:33:44:55 → 0211:22ff:fe33:4455.' },
  { topicId: '1.9', id: 'f-1.9-15', front: 'Flip-ul bitului 7 — a doua cifră a primului octet', back: '0↔2, 1↔3, 4↔6, 5↔7, 8↔A, 9↔B, C↔E, D↔F', detail: 'Inversare (XOR 0x02), nu setare la 1: 02:… devine 00….' },
  { topicId: '1.9', id: 'f-1.9-16', front: 'Unde apare „ff:fe” într-un IID?', back: 'În hextetele 6–7 (xxff:fexx)', detail: 'Semn de IID derivat prin EUI-64.' },
  { topicId: '1.9', id: 'f-1.9-17', front: 'ipv6 address … eui-64 — ce scrii?', back: 'Doar prefixul: ipv6 address 2001:db8:acad:2::/64 eui-64', detail: 'IOS calculează Interface ID din MAC.' },
  { topicId: '1.9', id: 'f-1.9-18', front: 'Hosturile moderne și EUI-64', back: 'Folosesc IID aleatoriu/stabil (RFC 7217) și adrese temporare (RFC 8981)', detail: 'Din motive de confidențialitate; routerele Cisco folosesc EUI-64 pentru link-local.' },
  { topicId: '1.9', id: 'f-1.9-19', front: 'Aceeași fe80::1 pe mai multe interfețe?', back: 'Da — link-local contează doar pe propria legătură', detail: 'O adresă globală trebuie să fie unică.' },
  { topicId: '1.9', id: 'f-1.9-20', front: 'ARP în IPv6?', back: 'Nu — NDP: NS/NA trimise la solicited-node', detail: 'Cererile de DHCPv6 merg la ff02::1:2 (nu broadcast).' },
];
