import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.7" title="Exemple de configurare și verificare: port security, DHCP snooping, DAI" />
      <Summary>
        <p>Scenariul: un switch de acces <b>SW1</b> cu doi utilizatori pe Fa0/1 și Fa0/2, un port Fa0/3 liber (unde ar putea veni un atacator) și un uplink <b>Gi0/1</b> către router/serverul DHCP. Aplicăm, în ordinea corectă: trust + DHCP snooping → DAI → port security, apoi verificăm și recuperăm din err-disabled.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi reale; formatul și numele mesajelor diferă între platforme (Catalyst 2960/9200, IOSvL2, Packet Tracer). Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente reale. Packet Tracer suportă port security și, în versiunile recente, DHCP snooping; suportul pentru DAI poate lipsi — pentru DAI folosește CML/GNS3 cu IOSvL2 sau tratează partea respectivă ca exercițiu de citire a configurației.
      </Callout>

      <Detailed title="1. Scenariul">
        <Table head={['Port', 'Conectat la', 'Rol', 'Politică']} rows={[
          ['Fa0/1', 'PC1', 'acces VLAN 10', 'untrusted, port security (max 1, sticky)'],
          ['Fa0/2', 'PC2 (sau telefon + PC)', 'acces VLAN 10', 'untrusted, port security (max 2, restrict)'],
          ['Fa0/3', 'liber / atacator', 'acces VLAN 10', 'untrusted, port security (max 1) + shutdown'],
          ['Gi0/1', 'R1 (gateway + DHCP 192.168.10.1)', 'uplink', 'trusted (DHCP snooping și DAI), fără port security'],
        ]} />
      </Detailed>

      <Detailed title="2. DHCP snooping (primul)">
        <CodeBlock title="SW1 — DHCP snooping (ilustrativ)" kind="config" code={`SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# ip dhcp snooping trust
SW1(config-if)# exit
SW1(config)# interface range fastEthernet 0/1 - 3
SW1(config-if-range)# ip dhcp snooping limit rate 15
SW1(config-if-range)# end`} explain={[
          ['ip dhcp snooping', 'Activează funcția global.'],
          ['ip dhcp snooping vlan 10', 'Activează inspecția DHCP pe VLAN 10; toate porturile lui devin untrusted.'],
          ['ip dhcp snooping trust (pe Gi0/1)', 'Uplinkul spre serverul DHCP trebuie să poată trimite OFFER/ACK.'],
          ['ip dhcp snooping limit rate 15', 'Limită de 15 pachete DHCP/secundă pe porturile de acces; peste prag → err-disabled.'],
        ]} />
        <Callout kind="tip" title="Opțional: salvarea binding table">
          <code>ip dhcp snooping database flash:snoop.db</code> păstrează binding table peste reload, ca DAI să nu arunce ARP-urile clienților existenți până își reînnoiesc lease-ul.
        </Callout>
      </Detailed>

      <Detailed title="3. Dynamic ARP Inspection (al doilea)">
        <CodeBlock title="SW1 — DAI (ilustrativ)" kind="config" code={`SW1(config)# ip arp inspection vlan 10
SW1(config)# ip arp inspection validate src-mac dst-mac ip
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# ip arp inspection trust
SW1(config-if)# exit
SW1(config)# arp access-list STATIC-HOSTS
SW1(config-arp-nacl)# permit ip host 192.168.10.200 mac host eeee.eeee.0005
SW1(config-arp-nacl)# exit
SW1(config)# ip arp inspection filter STATIC-HOSTS vlan 10`} explain={[
          ['ip arp inspection vlan 10', 'Activează inspecția ARP pe VLAN 10; porturile sunt untrusted implicit.'],
          ['validate src-mac dst-mac ip', 'Verificări suplimentare de consistență pe pachetele ARP.'],
          ['ip arp inspection trust (pe Gi0/1)', 'Uplinkul nu este inspectat; altfel și-ar pierde ARP-urile legitime.'],
          ['arp access-list STATIC-HOSTS', 'ARP ACL cu perechea IP–MAC a unei imprimante cu IP static.'],
          ['ip arp inspection filter … vlan 10', 'Aplică ARP ACL pe VLAN; pentru gazdele statice acesta este „binding-ul” folosit.'],
        ]} />
      </Detailed>

      <Detailed title="4. Port security (al treilea)">
        <CodeBlock title="SW1 — port security (ilustrativ)" kind="config" code={`SW1(config)# interface fastEthernet 0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 1
SW1(config-if)# switchport port-security mac-address sticky
SW1(config-if)# switchport port-security violation shutdown
SW1(config-if)# exit
SW1(config)# interface fastEthernet 0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 2
SW1(config-if)# switchport port-security violation restrict
SW1(config-if)# exit
SW1(config)# errdisable recovery cause psecure-violation
SW1(config)# errdisable recovery interval 300`} explain={[
          ['switchport mode access', 'Obligatoriu: port security nu merge pe port „dynamic”.'],
          ['switchport port-security', 'Pornește funcția (implicit: max 1, violation shutdown).'],
          ['maximum 1 / mac-address sticky', 'O singură adresă, învățată automat și scrisă în running-config.'],
          ['maximum 2 + violation restrict', 'Fa0/2 acceptă două adrese și, la a treia, aruncă cadrele și loghează, fără a închide portul.'],
          ['errdisable recovery cause psecure-violation', 'Repune automat portul după interval (implicit dezactivat).'],
        ]} />
      </Detailed>

      <Detailed title="5. Verificare">
        <CodeBlock title="SW1 — port security (ilustrativ)" kind="session" code={`SW1# show port-security
Secure Port  MaxSecureAddr  CurrentAddr  SecurityViolation  Security Action
                (Count)       (Count)          (Count)
    Fa0/1              1            1                  0         Shutdown
    Fa0/2              2            1                  0         Restrict

SW1# show port-security interface fastEthernet 0/1
Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Shutdown
Maximum MAC Addresses      : 1
Total MAC Addresses        : 1
Sticky MAC Addresses       : 1
Last Source Address:Vlan   : aaaa.0001:10
Security Violation Count   : 0

SW1# show port-security address
Vlan    Mac Address       Type                    Ports
  10    aaaa.0001         SecureSticky            Fa0/1`} explain={[
          ['MaxSecureAddr / CurrentAddr', 'Limita configurată și câte adrese sigure sunt acum.'],
          ['Port Status: Secure-up', 'Portul funcționează; după o violare în modul shutdown ar fi Secure-shutdown (err-disabled).'],
          ['Sticky MAC Addresses', 'Numărul de adrese învățate sticky.'],
          ['SecureSticky', 'Tipul adresei din show port-security address.'],
        ]} />
        <CodeBlock title="SW1 — DHCP snooping și DAI (ilustrativ)" kind="session" code={`SW1# show ip dhcp snooping
Switch DHCP snooping is enabled
DHCP snooping is configured on following VLANs: 10
Interface                  Trusted    Allow option    Rate limit (pps)
GigabitEthernet0/1         yes        yes             unlimited
FastEthernet0/1            no         no              15

SW1# show ip dhcp snooping binding
MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface
AA:AA:00:00:00:01   192.168.10.20    86012       dhcp-snooping  10    FastEthernet0/1

SW1# show ip arp inspection vlan 10
Vlan   Configuration    Operation   ACL Match    Static ACL
  10   Enabled          Active      STATIC-HOSTS No
Vlan   Forwarded   Dropped   DHCP Drops   ACL Drops
  10         182         7            7           0`} explain={[
          ['Trusted yes (Gi0/1)', 'Uplinkul este de încredere pentru DHCP snooping.'],
          ['binding: AA:AA:00:00:00:01 · 192.168.10.20 · Fa0/1', 'Intrarea creată dintr-un DHCP ACK legitim.'],
          ['Dropped 7 / DHCP Drops 7', 'ARP-uri aruncate deoarece nu corespund binding-ului: dovada că DAI lucrează.'],
        ]} />
      </Detailed>

      <Detailed title="6. Simulăm o violare și recuperăm">
        <CodeBlock title="SW1 — la conectarea unui al doilea dispozitiv pe Fa0/1 (ilustrativ)" kind="session" code={`%PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/1, putting Fa0/1 in err-disable state
%PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address bbbb.0002 on port FastEthernet0/1.

SW1# show interfaces status err-disabled
Port      Name   Status        Reason          Err-disabled Vlans
Fa0/1            err-disabled  psecure-violation

SW1(config)# interface fastEthernet 0/1
SW1(config-if)# shutdown
SW1(config-if)# no shutdown`} explain={[
          ['%PM-4-ERR_DISABLE …', 'Portul a intrat în err-disabled din cauza port security.'],
          ['show interfaces status err-disabled', 'Listează porturile blocate și motivul.'],
          ['shutdown / no shutdown', 'Recuperarea manuală — după ce ai scos dispozitivul neautorizat.'],
        ]} />
        <Reveal label="De ce reintră portul în err-disabled dacă uit să scot atacatorul?">
          <p>Pentru că <code>no shutdown</code> doar redeschide portul. Dacă dispozitivul cu MAC-ul ilegal trimite din nou cadre, depășirea limitei se repetă imediat și portul revine în err-disabled. Recuperarea corectă = elimini cauza, apoi redeschizi portul.</p>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Fără <code>ip dhcp snooping trust</code> pe uplink, nimeni nu mai primește IP.</>,
        <>Fără <code>ip arp inspection trust</code> pe uplink, DAI aruncă ARP-urile gateway-ului.</>,
        <>Port security pe un port „dynamic” este respins: pune întâi <code>switchport mode access</code>.</>,
      ]} />
      <InlineQuiz ids={['5.7-036', '5.7-037', '5.7-038', '5.7-039', '5.7-040']} />
    </section>
  );
}
