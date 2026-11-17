import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 2.3 Configure and verify Layer 2 discovery protocols.
// `cdp`, `lldp` și `lldp-med` există deja (1.1) și sunt doar referite.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'l2-discovery', abbr: 'L2 discovery protocol', full: 'Layer 2 discovery protocol (CDP, LLDP)', ro: 'protocol prin care echipamentele își anunță vecinii direct conectați',
    what: 'Un protocol de nivel 2 prin care fiecare echipament anunță periodic, pe fiecare port, cine este (nume, model, port, capabilități, adresă de management) și își construiește o tabelă cu vecinii pe care îi aude.',
    how: 'Echipamentul trimite cadre către o adresă multicast rezervată de nivel 2, pe care vecinul le procesează și nu le retransmite. Informația se păstrează în tabela de vecini până expiră hold time-ul; fiecare anunț nou o reîmprospătează. Nu necesită adrese IP și nu depășește un salt. Cele două protocoale cerute la CCNA sunt CDP (Cisco, activ implicit) și LLDP (IEEE 802.1AB, oprit implicit pe IOS).',
    where: 'Documentare și depanare a topologiei (show cdp neighbors / show lldp neighbors), detectarea nepotrivirilor (native VLAN, duplex), telefoane IP (VLAN de voce, PoE) și instrumente de monitorizare. Se limitează pe porturile spre utilizatori sau rețele externe, din motive de securitate.',
    layer: 'L2', aliases: ['neighbor discovery protocol', 'descoperire de vecini'], topics: ['2.3'],
  },
  {
    id: 'tlv', abbr: 'TLV', full: 'Type-Length-Value', ro: 'format de informație: tip, lungime, valoare',
    what: 'Un mod de a împacheta o informație dintr-un mesaj: un câmp Type (ce fel de informație este), un câmp Length (cât de lungă este) și Value (conținutul).',
    how: 'LLDP construiește fiecare anunț ca o succesiune de TLV-uri. Obligatorii sunt Chassis ID, Port ID și TTL (la început) și End of LLDPDU (la sfârșit); între ele pot apărea opționale precum Port Description, System Name, System Description, System Capabilities și Management Address. Receptorul sare peste TLV-urile necunoscute folosind lungimea, deci formatul se poate extinde (de exemplu LLDP-MED).',
    where: 'În LLDP (și în CDP, care folosește un format similar) și în alte protocoale extensibile. În show lldp neighbors detail vezi conținutul TLV-urilor primite.',
    layer: 'L2', aliases: ['Type-Length-Value'], topics: ['2.3'],
  },
];
