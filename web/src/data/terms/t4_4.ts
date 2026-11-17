import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 4.4 SNMP. `snmp` (1.5), `syslog`, `udp` sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'nms', abbr: 'NMS', full: 'Network Management System (SNMP manager)', ro: 'sistemul central de management al rețelei',
    what: 'Aplicația (manager SNMP) care interoghează agenții, colectează valori, afișează grafice și alarme și primește traps/informs.',
    how: 'Trimite Get/GetNext/GetBulk (și Set, dacă are drept de scriere) către UDP 161 al agentului și ascultă notificări pe UDP 162. Trebuie să cunoască versiunea, community-ul sau utilizatorul v3.',
    where: 'Zabbix, LibreNMS, PRTG, SolarWinds, Cisco Catalyst Center etc.; în laborator, un PC cu snmpwalk.',
    topics: ['4.4'],
  },
  {
    id: 'snmp-agent', abbr: 'SNMP agent', ro: 'procesul SNMP din dispozitivul gestionat',
    what: 'Componenta software din router, switch sau server care păstrează valorile MIB, răspunde la cererile managerului și trimite notificări.',
    how: 'Ascultă pe UDP 161; după autentificare (community sau utilizator v3), răspunde la Get/Set. Trimite trap/inform către destinațiile definite cu snmp-server host.',
    where: 'Pe orice echipament gestionat; se configurează cu snmp-server … pe IOS.',
    topics: ['4.4'],
  },
  {
    id: 'mib', abbr: 'MIB', full: 'Management Information Base', ro: 'baza de informații de management',
    what: 'Baza de date ierarhică (arbore) a obiectelor gestionabile ale unui dispozitiv; fiecare obiect are un OID.',
    how: 'Obiectele standard sunt sub mib-2 (1.3.6.1.2.1), iar cele ale producătorilor sub enterprises (1.3.6.1.4.1; Cisco = 9). Agentul expune valorile; managerul le cere după OID.',
    where: 'Comune pentru dispozitive de producători diferiți (sysName, ifInOctets), plus extensii proprii.',
    std: 'RFC 1213 (MIB-II)', topics: ['4.4'],
  },
  {
    id: 'oid', abbr: 'OID', full: 'Object Identifier', ro: 'identificatorul unui obiect din MIB',
    what: 'Șir de numere separate prin puncte care identifică în mod unic un obiect în arborele MIB.',
    how: 'De exemplu 1.3.6.1.2.1.1.5.0 = sysName (instanța scalară .0); 1.3.6.1.2.1.2.2.1.10 = ifInOctets (urmat de indexul interfeței).',
    where: 'La interogări manuale (snmpwalk, snmpget) și la configurarea alertelor în NMS.',
    topics: ['4.4'],
  },
  {
    id: 'community-string', abbr: 'Community string', ro: 'parola de acces SNMP v1/v2c',
    what: 'Șir de caractere (ro sau rw) folosit ca „parolă” de SNMPv1/v2c, trimis în text clar.',
    how: 'Se configurează cu snmp-server community <șir> ro|rw [ACL]. Un community RW permite Set. Valorile implicite „public”/„private” sunt notorii; pot fi limitate cu un ACL.',
    where: 'Fiecare interogare v1/v2c îl conține; cel mai frecvent punct slab al SNMP în rețele reale.',
    topics: ['4.4'],
  },
  {
    id: 'snmp-trap', abbr: 'SNMP trap', ro: 'notificare neconfirmată trimisă de agent',
    what: 'Mesaj trimis spontan de agent către manager (UDP 162) la apariția unui eveniment, de exemplu linkDown. Nu este confirmat.',
    how: 'Se activează cu snmp-server enable traps … și se trimit către snmp-server host. Fiind UDP fără confirmare, poate fi pierdut fără ca agentul să afle.',
    where: 'Alarmare rapidă pentru evenimente (link down, repornire, schimbare de configurare).',
    topics: ['4.4'],
  },
  {
    id: 'snmp-inform', abbr: 'SNMP inform', ro: 'notificare confirmată (v2c/v3)',
    what: 'Notificare ca un trap, dar confirmată de manager prin acknowledgement; dacă nu primește confirmarea, agentul retransmite.',
    how: 'Disponibil de la SNMPv2c. Pe IOS: snmp-server host … informs … Consumă mai multe resurse decât trap-ul.',
    where: 'Evenimente critice care nu trebuie pierdute.',
    topics: ['4.4'],
  },
  {
    id: 'snmpv3-levels', abbr: 'SNMPv3 security levels', ro: 'nivelurile de securitate SNMPv3',
    what: 'noAuthNoPriv (doar nume de utilizator), authNoPriv (autentificare cu hash MD5/SHA) și authPriv (autentificare + criptare, de exemplu AES).',
    how: 'Grupul SNMP definește nivelul minim (snmp-server group G v3 priv); utilizatorul primește algoritmi și parole (snmp-server user …). Nivelurile cerute de manager trebuie să corespundă.',
    where: 'Standardul de facto în rețele de producție; doar authPriv criptează.',
    std: 'RFC 3414 (USM)', topics: ['4.4'],
  },
];
