import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.6" title="Exemple: pregătirea rețelei pentru AP-uri lightweight" />
      <Summary>
        <p>Obiectivul 2.6 este de tip <b>Describe</b>, deci nu există un set oficial de comenzi de memorat. Exemplele de mai jos arată cum arată în practică ce ai descris: portul de switch al AP-ului, DHCP cu <i>option 43</i> pentru descoperirea WLC-ului, citirea listei de AP-uri alăturate și schimbarea modului unui AP.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile și comenzile sunt <b>ilustrative</b>, reconstruite după formatele documentate, cu nume și adrese fictive; nu au fost capturate sau testate pe echipamente reale. Sintaxa WLC diferă între familii: <b>AireOS</b> (WLC 2504/3504/5520/8540, ghidată în GUI) și <b>IOS XE / Catalyst 9800</b>, care are altă CLI și alte meniuri. Verifică documentația versiunii tale. Packet Tracer are un WLC simplificat.
      </Callout>

      <Detailed title="Exemplul 1 — Portul de switch al unui AP (Local vs FlexConnect)">
        <CodeBlock title="SW1 (ilustrativ)" kind="config" code={`! AP în modul Local: un singur VLAN (managementul AP-urilor)
SW1(config)# interface gi1/0/5
SW1(config-if)# description LAP1 - Local mode
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 100
SW1(config-if)# spanning-tree portfast

! AP în modul FlexConnect: trunk, VLAN-urile clienților se termină local
SW1(config)# interface gi1/0/6
SW1(config-if)# description LAP2 - FlexConnect
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 100
SW1(config-if)# switchport trunk allowed vlan 100,10,20
SW1(config-if)# spanning-tree portfast trunk`} explain={[
          ['switchport mode access / vlan 100', 'Modul Local: AP-ul își folosește singur VLAN-ul de management; datele clienților pleacă încapsulate CAPWAP, deci nu se văd VLAN-urile clienților pe port.'],
          ['spanning-tree portfast', 'Portul spre AP este edge: AP-ul primește IP imediat și caută WLC-ul.'],
          ['switchport mode trunk … native vlan 100', 'FlexConnect cu local switching: clienții din VLAN 10 și 20 ies marcați 802.1Q; VLAN-ul nativ (untagged) este cel de management al AP-ului.'],
          ['allowed vlan 100,10,20', 'Doar VLAN-urile necesare (2.2).'],
          ['portfast trunk', 'Trunk spre un AP (nu spre alt switch) poate folosi PortFast pe platformele care o permit.'],
        ]} />
        <p>Alimentarea se face prin PoE (1.1.h): portul trebuie să ofere puterea cerută (de exemplu PoE+ pentru AP-uri 802.11ax cu multe fluxuri).</p>
      </Detailed>

      <Detailed title="Exemplul 2 — DHCP: IP pentru AP și option 43 (adresa WLC)">
        <CodeBlock title="Router/switch cu server DHCP (ilustrativ)" kind="config" code={`R1(config)# ip dhcp excluded-address 192.168.100.1 192.168.100.20
R1(config)# ip dhcp pool LAP-POOL
R1(dhcp-config)# network 192.168.100.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.100.1
R1(dhcp-config)# dns-server 192.168.100.1
R1(dhcp-config)# option 43 hex f104.c0a8.640a`} explain={[
          ['excluded-address', 'Rezervă adrese pentru gateway și WLC (WLC-ul are IP static, de exemplu 192.168.100.10).'],
          ['pool LAP-POOL', 'Subrețeaua în care AP-urile primesc IP (VLAN 100).'],
          ['default-router', 'AP-ul are nevoie de gateway dacă WLC-ul este în altă subrețea.'],
          ['option 43 hex f104.c0a8.640a', 'Sub-opțiunea Cisco: f1 = tipul (WLC), 04 = lungime (un IP de 4 octeți), c0a8.640a = 192.168.100.10 în hexazecimal. AP-ul află astfel unde este WLC-ul.'],
        ]} />
        <p>Alternative de descoperire: DNS (<code>CISCO-CAPWAP-CONTROLLER.<i>domeniu</i></code>), adrese memorate de AP dintr-o alăturare anterioară sau broadcast local, dacă WLC-ul este în același VLAN.</p>
      </Detailed>

      <Detailed title="Exemplul 3 — Verificare pe WLC: AP-urile alăturate">
        <CodeBlock title="WLC (AireOS, ilustrativ)" kind="session" code={`(Cisco Controller) > show ap summary

Number of APs.................................... 2

AP Name   Slots  AP Model     Ethernet MAC       Location  Country  IP Address       Clients  DSE Location
--------- ------ ------------ ------------------ --------- -------- ---------------- -------- -------------
LAP1      2      AIR-AP2802I  00:11:22:33:44:51  default   RO       192.168.100.21   3        [0 ,0 ,0 ]
LAP2      2      AIR-AP2802I  00:11:22:33:44:52  default   RO       192.168.100.22   0        [0 ,0 ,0 ]

(Cisco Controller) > show ap config general LAP1
(Cisco Controller) > config ap mode flexconnect LAP2`} explain={[
          ['show ap summary', 'Lista AP-urilor care au făcut join: nume, model, MAC Ethernet, IP-ul AP-ului și numărul de clienți.'],
          ['show ap config general LAP1', 'Detalii: modul AP, VLAN, IP, versiune software.'],
          ['config ap mode flexconnect LAP2', 'Schimbă modul AP-ului LAP2 în FlexConnect (în GUI: Wireless → Access Points → All APs → LAP2 → General → AP Mode). AP-ul se realătură.'],
        ]} />
        <Table head={['Loc în GUI (AireOS)', 'Ce vezi']} hlCol={0} rows={[
          ['Wireless → Access Points → All APs', 'Lista AP-urilor, modul, starea, numărul de clienți'],
          ['… → (nume AP) → General', 'AP Name, AP Mode (Local / FlexConnect / Monitor / Sniffer / Rogue Detector / SE-Connect / Bridge), Admin Status'],
          ['Monitor → Summary', 'Dashboard cu AP-uri, clienți, rogue'],
        ]} />
        <p>Pe Catalyst 9800 meniurile și comenzile sunt diferite (de exemplu <code>show ap summary</code> există și acolo, dar modul se setează prin <i>Site Tag</i> / <i>AP join profile</i>); folosește documentația modelului tău.</p>
      </Detailed>

      <Detailed title="Exemplul 4 — Depanare: AP-ul nu se alătură">
        <Table head={['Pas', 'Verificare', 'Ce cauți']} hlCol={0} rows={[
          ['1', 'LED/PoE pe switch: show power inline', 'AP-ul primește putere?'],
          ['2', 'Portul de switch: VLAN corect? up/up?', 'AP în VLAN-ul 100 (access) sau trunk cu VLAN-urile cerute'],
          ['3', 'show ip dhcp binding (pe serverul DHCP)', 'AP-ul a primit adresă?'],
          ['4', 'ping spre IP-ul WLC de pe un host din același VLAN', 'Există rută către WLC?'],
          ['5', 'ACL/firewall: UDP 5246, 5247 permise', 'Descoperirea/Join nu sunt blocate'],
          ['6', 'WLC: show ap summary / joined list', 'AP-ul apare? Limită de licență AP?'],
        ]} />
      </Detailed>
    </section>
  );
}
