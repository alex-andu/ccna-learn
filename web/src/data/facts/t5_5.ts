import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.5 VPN IPsec
export const FACTS: Fact[] = [
  { topicId: '5.5', id: 'f-5.5-01', front: 'Cele două scenarii VPN din 5.5', back: 'Site-to-site (gateway ↔ gateway) și remote access (client ↔ gateway)', detail: 'Site-to-site: transparent pentru gazde; remote access: client software.' },
  { topicId: '5.5', id: 'f-5.5-02', front: 'Obiectivele IPsec', back: 'Confidențialitate, integritate, autentificarea originii, anti-replay', detail: 'ESP le oferă (AH doar integritate/autentificare).' },
  { topicId: '5.5', id: 'f-5.5-03', front: 'Porturile IKE', back: 'UDP 500; UDP 4500 cu NAT-T', detail: 'ESP: protocol IP 50; AH: 51.' },
  { topicId: '5.5', id: 'f-5.5-04', front: 'ESP vs AH', back: 'ESP: criptare + integritate (IP 50) · AH: doar integritate, nu merge cu NAT (IP 51)', detail: 'În practică se folosește ESP.' },
  { topicId: '5.5', id: 'f-5.5-05', front: 'Ce este o SA?', back: 'Acord unidirecțional: algoritmi, chei, durată; identificată de SPI', detail: 'IKE SA (faza 1) și IPsec SA (faza 2, câte una pe sens).' },
  { topicId: '5.5', id: 'f-5.5-06', front: 'Faza 1 vs faza 2 (IKEv1)', back: 'Faza 1: IKE SA (Main 6 msg / Aggressive 3) · Faza 2: IPsec SA (Quick Mode, 3 msg)', detail: 'IKEv2: IKE_SA_INIT + IKE_AUTH.' },
  { topicId: '5.5', id: 'f-5.5-07', front: 'Ce declanșează tunelul?', back: 'Trafic care se potrivește cu ACL-ul de interes (crypto map)', detail: 'Primul pachet se poate pierde.' },
  { topicId: '5.5', id: 'f-5.5-08', front: 'Tunnel mode vs transport mode', back: 'Tunnel: antet IP nou, pachet original încapsulat · Transport: antet original păstrat', detail: 'Site-to-site folosește tunnel.' },
  { topicId: '5.5', id: 'f-5.5-09', front: 'De ce AH nu merge cu NAT?', back: 'Autentifică antetul IP, pe care NAT îl modifică', detail: 'ESP + NAT-T (UDP 4500) merge.' },
  { topicId: '5.5', id: 'f-5.5-10', front: 'Ce rezolvă NAT-T?', back: 'Încapsulează ESP în UDP 4500 pentru a trece prin PAT', detail: 'ESP are doar protocol, fără porturi.' },
  { topicId: '5.5', id: 'f-5.5-11', front: 'Diffie-Hellman', back: 'Acord de cheie secretă pe canal public, fără a o trimite', detail: 'Grupurile 14+ sau ECDH; grupurile mici sunt slabe.' },
  { topicId: '5.5', id: 'f-5.5-12', front: 'Autentificarea capetelor', back: 'PSK sau certificate', detail: 'Certificatele scalează mai bine.' },
  { topicId: '5.5', id: 'f-5.5-13', front: 'Porturile VPN SSL/TLS (Secure Client)', back: 'TCP 443 (TLS) și UDP 443 (DTLS)', detail: 'Trece ușor prin firewall-uri.' },
  { topicId: '5.5', id: 'f-5.5-14', front: 'Split tunnel vs full tunnel', back: 'Split: doar traficul corporativ prin tunel · Full: tot traficul prin tunel', detail: 'Full = control; split = performanță.' },
  { topicId: '5.5', id: 'f-5.5-15', front: 'GRE peste IPsec', back: 'GRE transportă multicast/rutare (fără criptare); IPsec adaugă criptarea', detail: 'GRE = protocol IP 47. DMVPN: doar recunoaștere.' },
  { topicId: '5.5', id: 'f-5.5-16', front: 'Verificare IPsec pe IOS', back: 'show crypto isakmp sa (QM_IDLE) · show crypto ipsec sa (encaps/decaps)', detail: 'show crypto map; debug crypto isakmp.' },
  { topicId: '5.5', id: 'f-5.5-17', front: 'encaps crește, decaps = 0', back: 'Peer-ul nu răspunde sau ESP/UDP 4500 este blocat pe cale', detail: 'Verifică și ACL-ul oglindit și rutele.' },
  { topicId: '5.5', id: 'f-5.5-18', front: 'Unde se face MFA la VPN remote access?', back: 'La autentificarea utilizatorului prin AAA/RADIUS/IdP', detail: 'Nu pe client singur, nu în transform set.' },
];
