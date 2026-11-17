import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 4.5 syslog. `syslog` (1.5), `ntp`, `udp`, `snmp` sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'syslog-severity', abbr: 'Syslog severity', full: 'Syslog severity level (0–7)', ro: 'nivelul de gravitate al unui mesaj de log',
    what: 'Număr de la 0 la 7 care arată gravitatea unui mesaj: 0 emergencies, 1 alerts, 2 critical, 3 errors, 4 warnings, 5 notifications, 6 informational, 7 debugging.',
    how: 'Un nivel configurat (de exemplu logging trap warnings) trimite mesajele de la 0 până la acel nivel: nivelul ales și toate cele mai severe. Numărul mai mic este mai grav.',
    where: 'În eticheta mesajului (%LINK-3-UPDOWN) și în comenzile logging console/monitor/buffered/trap.',
    std: 'RFC 5424', topics: ['4.5'],
  },
  {
    id: 'syslog-facility', abbr: 'Syslog facility', ro: 'componenta sursă a unui mesaj de log',
    what: 'În mesajele Cisco (%LINK-3-UPDOWN) este componenta software care a generat mesajul (LINK, SYS, OSPF…). În antetul syslog este un număr 0–23 (local0–local7 = 16–23).',
    how: 'Cisco trimite implicit către server cu local7 (23); se schimbă cu logging facility. Prioritatea din antet = facility × 8 + severitate (de exemplu 23 × 8 + 3 = 187).',
    where: 'Serverele syslog folosesc facility-ul ca să separe sursele (routere, switch-uri, firewall-uri) în fișiere sau canale diferite.',
    std: 'RFC 5424', topics: ['4.5'],
  },
  {
    id: 'syslog-mnemonic', abbr: 'Mnemonic', full: 'Syslog message mnemonic', ro: 'codul de eveniment din etichetă',
    what: 'A treia parte a etichetei unui mesaj Cisco (%FACILITY-SEVERITY-MNEMONIC), care identifică tipul concret de eveniment.',
    how: 'De exemplu UPDOWN (schimbare de stare), CONFIG_I (configurație modificată), ADJCHG (schimbare de adiacență). Urmează descrierea în text.',
    where: 'La căutarea mesajelor în documentația Cisco sau în serverul de log.',
    topics: ['4.5'],
  },
  {
    id: 'logging-trap', abbr: 'logging trap', ro: 'nivelul mesajelor trimise către serverul syslog',
    what: 'Comanda IOS care stabilește nivelul maxim de severitate trimis către serverele configurate cu logging host.',
    how: 'logging trap warnings trimite 0–4. Nu are legătură cu SNMP trap, în ciuda numelui. Valoarea implicită obișnuită este informational; verifică cu show logging.',
    where: 'Reglarea volumului de mesaje de pe server.',
    topics: ['4.5'],
  },
  {
    id: 'logging-buffer', abbr: 'Logging buffer', full: 'logging buffered', ro: 'buffer de log în RAM',
    what: 'Zonă din RAM unde routerul reține ultimele mesaje de log, vizibile cu show logging.',
    how: 'logging buffered [mărime] [nivel]; când se umple, mesajele vechi sunt înlocuite. Se pierde la repornire.',
    where: 'Depanare locală când nu ai (încă) un server syslog.',
    topics: ['4.5'],
  },
  {
    id: 'terminal-monitor', abbr: 'terminal monitor', ro: 'afișarea logurilor în sesiunea VTY curentă',
    what: 'Comandă EXEC care face ca mesajele de log să apară în sesiunea Telnet/SSH curentă.',
    how: 'Sesiunile VTY nu primesc loguri implicit; terminal monitor le activează pentru acea sesiune (nivelul vine din logging monitor).',
    where: 'Depanare de la distanță, cu debug sau cu urmărirea evenimentelor.',
    topics: ['4.5'],
  },
];
