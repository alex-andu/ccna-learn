import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.5 syslog
export const FACTS: Fact[] = [
  { topicId: '4.5', id: 'f-4.5-01', front: 'Scopul syslog', back: 'Înregistrarea evenimentelor și trimiterea lor către un server central', detail: 'Transport obișnuit: UDP 514.' },
  { topicId: '4.5', id: 'f-4.5-02', front: 'Cele opt niveluri de severitate', back: '0 emergencies · 1 alerts · 2 critical · 3 errors · 4 warnings · 5 notifications · 6 informational · 7 debugging', detail: 'Mnemonic: Every Awesome Cisco Engineer Will Need Ice-cream Daily.' },
  { topicId: '4.5', id: 'f-4.5-03', front: 'Ce înseamnă „level N” într-o comandă logging?', back: 'Se loghează de la 0 până la N (nivelul ales și cele mai severe)', detail: 'Număr mai mic = mai grav.' },
  { topicId: '4.5', id: 'f-4.5-04', front: 'Formatul unui mesaj Cisco', back: 'timestamp: %FACILITY-SEVERITY-MNEMONIC: descriere', detail: 'Ex.: %LINK-3-UPDOWN: Interface Gi0/1, changed state to down.' },
  { topicId: '4.5', id: 'f-4.5-05', front: 'Mesaje frecvente', back: '%LINK-3-UPDOWN · %LINEPROTO-5-UPDOWN · %SYS-5-CONFIG_I · %OSPF-5-ADJCHG', detail: 'LINK = fizic (3); LINEPROTO = protocol de linie (5).' },
  { topicId: '4.5', id: 'f-4.5-06', front: 'Cele patru destinații de log', back: 'Consolă · VTY (monitor) · buffer RAM · server syslog', detail: 'Fiecare are propriul nivel.' },
  { topicId: '4.5', id: 'f-4.5-07', front: 'Comenzi pentru fiecare destinație', back: 'logging console · logging monitor (+terminal monitor) · logging buffered · logging host + logging trap', detail: 'Verificare: show logging.' },
  { topicId: '4.5', id: 'f-4.5-08', front: 'Nivelurile implicite obișnuite', back: 'Consolă/buffer: debugging (7) · logging trap: informational (6)', detail: 'Sursele diferă pe versiuni; verifică cu show logging.' },
  { topicId: '4.5', id: 'f-4.5-09', front: 'Facility Cisco vs facility syslog', back: 'Cisco: componenta din etichetă (LINK, SYS) · syslog: câmp 0–23 în antet (local0–local7)', detail: 'Cisco trimite implicit local7 (23).' },
  { topicId: '4.5', id: 'f-4.5-10', front: 'Formula prioritătii syslog', back: 'PRI = facility × 8 + severitate', detail: 'local7 (23) + errors (3) → 187.' },
  { topicId: '4.5', id: 'f-4.5-11', front: 'Timestamps în log', back: 'service timestamps log datetime msec', detail: '* înaintea orei = ceas nesetat; . = NTP nesincronizat.' },
  { topicId: '4.5', id: 'f-4.5-12', front: 'Ce se întâmplă cu bufferul de log la reload?', back: 'Se pierde (este în RAM)', detail: 'De aceea trimite logurile și la un server extern.' },
  { topicId: '4.5', id: 'f-4.5-13', front: 'Cum vezi logurile într-o sesiune SSH?', back: 'terminal monitor', detail: 'Nivelul vine din logging monitor.' },
  { topicId: '4.5', id: 'f-4.5-14', front: 'logging synchronous', back: 'Reafișează linia de comandă după un mesaj de log, în line con/vty', detail: 'Nu schimbă ce se loghează.' },
  { topicId: '4.5', id: 'f-4.5-15', front: 'De ce NTP + syslog?', back: 'Pentru timestamp-uri corelabile între dispozitive', detail: 'Fără ora corectă, incidentele nu se pot reconstitui.' },
  { topicId: '4.5', id: 'f-4.5-16', front: 'Syslog vs SNMP trap', back: 'Syslog: mesaje text cu severitate (UDP 514) · Trap: notificări structurate pe OID (UDP 162)', detail: 'Se completează reciproc.' },
];
