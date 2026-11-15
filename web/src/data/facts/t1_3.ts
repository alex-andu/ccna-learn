import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.3 (cifre și perechi care trebuie știute pe de rost)
export const FACTS: Fact[] = [
  { topicId: '1.3', id: 'f-1.3-01', front: 'Distanța maximă pe cupru torsadat (10BASE-T … 10GBASE-T)', back: '100 m', detail: '90 m cablu fix + 10 m patch cord-uri (TIA-568)' },
  { topicId: '1.3', id: 'f-1.3-02', front: 'Ce înseamnă 1000BASE-T', back: '1000 Mb/s · baseband · twisted pair', detail: 'IEEE 802.3ab (1999), 4 perechi, Cat5e' },
  { topicId: '1.3', id: 'f-1.3-03', front: 'Câte perechi folosesc 100BASE-TX și 1000BASE-T?', back: '2 perechi / 4 perechi', detail: '1000BASE-T: toate perechile, bidirecțional, PAM-5 + anularea ecoului' },
  { topicId: '1.3', id: 'f-1.3-04', front: 'Categoria pentru 10GBASE-T la 100 m', back: 'Cat6A', detail: 'Pe Cat6 doar ≈55 m. Cat8 → 25/40GBASE-T la 30 m' },
  { topicId: '1.3', id: 'f-1.3-05', front: 'Ordinea T568B (pinii 1–8)', back: 'albO, O, albV, Al, albAl, V, albM, M', detail: 'T568A: verde și portocaliu inversate' },
  { topicId: '1.3', id: 'f-1.3-06', front: 'Pinii de emisie/recepție la un port MDI (10/100)', back: 'TX 1-2 · RX 3-6', detail: 'MDI-X (switch, hub): invers' },
  { topicId: '1.3', id: 'f-1.3-07', front: 'Straight-through vs crossover (regula clasică)', back: 'diferite → straight · la fel → crossover', detail: 'PC–SW, R–SW = straight; SW–SW, PC–PC, R–PC, SW–hub = crossover' },
  { topicId: '1.3', id: 'f-1.3-08', front: 'Cablul și setările de consolă Cisco', back: 'rollover · 9600 baud, 8N1, fără flow control', detail: 'Rollover: 1↔8, 2↔7, 3↔6, 4↔5' },
  { topicId: '1.3', id: 'f-1.3-09', front: 'Comanda Auto-MDIX', back: 'mdix auto (modul interfață)', detail: 'Pe unele platforme cere speed/duplex auto' },
  { topicId: '1.3', id: 'f-1.3-10', front: 'Diametrul miezului SMF vs MMF', back: '≈9 µm vs 50 / 62.5 µm (înveliș 125 µm la ambele)', detail: 'Miez mai mic = distanță mai mare' },
  { topicId: '1.3', id: 'f-1.3-11', front: 'Surse și lungimi de undă MMF vs SMF', back: 'LED/VCSEL 850 nm vs laser 1310/1550 nm', detail: '' },
  { topicId: '1.3', id: 'f-1.3-12', front: 'Ce limitează distanța pe multimod', back: 'dispersia modală', detail: 'Modurile parcurg trasee diferite → impulsul se lățește' },
  { topicId: '1.3', id: 'f-1.3-13', front: '10GBASE-SR pe OM1 / OM2 / OM3 / OM4', back: '33 m / 82 m / 300 m / 400 m', detail: '850 nm, IEEE 802.3ae' },
  { topicId: '1.3', id: 'f-1.3-14', front: '1000BASE-SX / 1000BASE-LX', back: '850 nm MMF, 550 m (OM2) / 1310 nm SMF, 5 km', detail: 'IEEE 802.3z (1998)' },
  { topicId: '1.3', id: 'f-1.3-15', front: '10GBASE-LR / 10GBASE-ER', back: '1310 nm, 10 km / 1550 nm, 40 km (monomod)', detail: '' },
  { topicId: '1.3', id: 'f-1.3-16', front: 'Culoarea mantalei fibrei', back: 'galben = SMF · portocaliu = OM1/OM2 · aqua = OM3/OM4 · lime = OM5', detail: 'TIA-598' },
  { topicId: '1.3', id: 'f-1.3-17', front: 'SFP / SFP+ / QSFP+ / QSFP28', back: '1G / 10G / 40G / 100G', detail: 'Conector tipic pe SFP/SFP+: LC duplex' },
  { topicId: '1.3', id: 'f-1.3-18', front: 'Conectori de fibră: LC, SC, ST, MPO', back: 'LC mic cu clemă · SC pătrat push-pull · ST baionetă · MPO multi-fibră', detail: '' },
  { topicId: '1.3', id: 'f-1.3-19', front: 'Fibre TX/RX inversate', back: 'down/down — inversezi fibrele la un capăt', detail: 'BiDi: o singură fibră, 2 lungimi de undă (1310/1490 nm)' },
  { topicId: '1.3', id: 'f-1.3-20', front: 'Hub / switch / router — domenii', back: 'hub: 1 col, 1 bcast · switch: 1 col per port, 1 bcast · router: separă ambele', detail: '' },
  { topicId: '1.3', id: 'f-1.3-21', front: 'Condiția pentru full-duplex', back: 'legătură punct-la-punct (fără hub)', detail: 'CSMA/CD dezactivat; 10G+ = doar full-duplex' },
  { topicId: '1.3', id: 'f-1.3-22', front: 'Pașii CSMA/CD', back: 'ascultă → transmite → detectează coliziunea → jam → backoff aleatoriu → reîncearcă', detail: 'Abandon după 16 încercări' },
  { topicId: '1.3', id: 'f-1.3-23', front: 'Ce capăt dă ceasul pe o legătură serială', back: 'DCE (clock rate)', detail: 'Încapsulare implicită Cisco: HDLC; standard: PPP' },
];
