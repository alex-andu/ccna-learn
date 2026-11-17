import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.4 SNMP
export const FACTS: Fact[] = [
  { topicId: '4.4', id: 'f-4.4-01', front: 'Funcția SNMP', back: 'Monitorizare și management centralizat al dispozitivelor', detail: 'Manager (NMS) ↔ agent, cu date organizate într-un MIB.' },
  { topicId: '4.4', id: 'f-4.4-02', front: 'Porturile SNMP', back: 'UDP 161 (agent, cereri) · UDP 162 (traps/informs spre manager)', detail: 'Nu inversa porturile.' },
  { topicId: '4.4', id: 'f-4.4-03', front: 'Componentele SNMP', back: 'Manager (NMS) · Agent · MIB · OID', detail: 'MIB = schema; OID = identificatorul unui obiect.' },
  { topicId: '4.4', id: 'f-4.4-04', front: 'Operații inițiate de manager', back: 'Get · GetNext · GetBulk (v2c+) · Set', detail: 'Toate cu răspuns Response.' },
  { topicId: '4.4', id: 'f-4.4-05', front: 'Trap vs Inform', back: 'Trap: neconfirmat · Inform: confirmat (v2c+)', detail: 'Informul se retransmite până la confirmare.' },
  { topicId: '4.4', id: 'f-4.4-06', front: 'Cum se autentifică v1/v2c?', back: 'Cu community string în text clar', detail: 'Valorile implicite public/private sunt cunoscute.' },
  { topicId: '4.4', id: 'f-4.4-07', front: 'Singura versiune care criptează', back: 'SNMPv3 în modul authPriv', detail: 'authNoPriv autentifică dar nu criptează.' },
  { topicId: '4.4', id: 'f-4.4-08', front: 'Nivelurile SNMPv3', back: 'noAuthNoPriv · authNoPriv · authPriv', detail: 'Grupul impune nivelul minim.' },
  { topicId: '4.4', id: 'f-4.4-09', front: 'Prefixuri OID importante', back: 'Internet 1.3.6.1 · mib-2 1.3.6.1.2.1 · enterprises 1.3.6.1.4.1 · Cisco 1.3.6.1.4.1.9', detail: 'Standard sub mib-2; proprietar sub enterprises.' },
  { topicId: '4.4', id: 'f-4.4-10', front: 'OID-ul lui sysName', back: '1.3.6.1.2.1.1.5.0', detail: 'sysDescr = 1.3.6.1.2.1.1.1.0.' },
  { topicId: '4.4', id: 'f-4.4-11', front: 'Configurare SNMPv2c de bază', back: 'snmp-server community STR ro [ACL] · snmp-server host <ip> version 2c STR · snmp-server enable traps …', detail: 'Fără enable traps nu se generează notificări.' },
  { topicId: '4.4', id: 'f-4.4-12', front: 'Configurare SNMPv3 de bază', back: 'snmp-server group G v3 priv · snmp-server user U G v3 auth sha P1 priv aes 128 P2', detail: 'Nivelurile NMS ↔ grup trebuie să coincidă.' },
  { topicId: '4.4', id: 'f-4.4-13', front: 'Comenzi de verificare SNMP', back: 'show snmp · show snmp community · show snmp host · show snmp group · show snmp user', detail: '„Unknown community name” crescut = community greșit.' },
  { topicId: '4.4', id: 'f-4.4-14', front: 'Polling vs notificări', back: 'Polling: managerul întreabă periodic · Trap/Inform: agentul anunță evenimentul', detail: 'În practică se folosesc ambele.' },
  { topicId: '4.4', id: 'f-4.4-15', front: 'Risc principal în v1/v2c', back: 'Community string în text clar; RW permite modificarea configurației', detail: 'Mitigare: ACL, community-uri nestandard, SNMPv3.' },
  { topicId: '4.4', id: 'f-4.4-16', front: 'Ce aduce SNMPv2c față de v1?', back: 'GetBulk, Inform, contoare pe 64 de biți', detail: 'Securitatea rămâne cea din v1 (community).' },
];
