import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.7" title="Exemple: porturile switch-ului pentru AP, WLC și LAG" />
      <Summary>
        <p>Obiectivul 2.7 este de tip <b>Describe</b>. Exemplele arată partea de infrastructură cablată pe care o descrii: portul AP-ului (access / trunk), trunk-ul spre WLC, service port-ul, LAG-ul static și verificările lor.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Output-urile sunt <b>exemple ilustrative</b>, cu nume, VLAN-uri și adrese fictive; comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente. Comenzile de pe WLC (AireOS) diferă de cele de pe Catalyst 9800 (IOS XE) și variază cu versiunea; verifică documentația modelului tău.
      </Callout>

      <Detailed title="Exemplul 1 — Plan de VLAN-uri și porturi">
        <Table head={['Element', 'VLAN / port', 'Rol']} hlCol={0} rows={[
          ['VLAN 100', 'management (WLC + AP-uri)', 'adresa de management a WLC-ului; subrețeaua AP-urilor'],
          ['VLAN 10', 'CORP', 'interfață dinamică „employee” pe WLC'],
          ['VLAN 20', 'VOICE', 'interfață dinamică „voice”'],
          ['VLAN 30', 'GUEST', 'interfață dinamică „guest”'],
          ['VLAN 99', 'OOB', 'service port-ul WLC-ului'],
          ['Gi1/0/1–4', 'LAG spre WLC (trunk)', 'port-channel 1, mode on'],
          ['Gi1/0/10', 'AP Local (access VLAN 100)', 'LAP1'],
          ['Gi1/0/11', 'AP FlexConnect (trunk)', 'LAP2'],
          ['Gi1/0/20', 'service port (access VLAN 99)', 'management OOB'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Porturile AP-urilor (Local vs FlexConnect)">
        <CodeBlock title="SW-D (ilustrativ)" kind="config" code={`SW-D(config)# interface gi1/0/10
SW-D(config-if)# description LAP1 - Local
SW-D(config-if)# switchport mode access
SW-D(config-if)# switchport access vlan 100
SW-D(config-if)# spanning-tree portfast
SW-D(config-if)# power inline auto

SW-D(config)# interface gi1/0/11
SW-D(config-if)# description LAP2 - FlexConnect
SW-D(config-if)# switchport mode trunk
SW-D(config-if)# switchport trunk native vlan 100
SW-D(config-if)# switchport trunk allowed vlan 100,10,20,30
SW-D(config-if)# spanning-tree portfast trunk
SW-D(config-if)# power inline auto`} explain={[
          ['switchport mode access / access vlan 100', 'AP Local: un singur VLAN, cel de management al AP-urilor.'],
          ['spanning-tree portfast', 'AP-ul pornește repede și găsește WLC-ul fără să aștepte STP.'],
          ['power inline auto', 'PoE negociat automat (implicit pe majoritatea platformelor).'],
          ['switchport mode trunk / native vlan 100', 'AP FlexConnect: VLAN-ul de management al AP-ului este nativ (untagged); VLAN-urile clienților sunt etichetate.'],
          ['allowed vlan 100,10,20,30', 'Doar VLAN-urile necesare pentru WLAN-urile cu local switching.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`SW-D# show power inline gi1/0/10
Interface Admin  Oper       Power   Device              Class Max
                            (Watts)
--------- ------ ---------- ------- ------------------- ----- ----
Gi1/0/10  auto   on         15.4    Cisco AP            3     30.0

SW-D# show interfaces trunk | include Gi1/0/11
Gi1/0/11    on           802.1q         trunking      100`} explain={[
          ['Oper on, Power 15.4', 'AP-ul este alimentat (PoE) — puterea consumată în acel moment.'],
          ['Class 3', 'Clasa PoE a dispozitivului (detalii la 1.1.h).'],
          ['trunking · native 100', 'Portul AP-ului FlexConnect este trunk cu native VLAN 100.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Trunk spre WLC (fără LAG) și service port">
        <CodeBlock title="SW-D (ilustrativ)" kind="config" code={`! Port de date al WLC-ului: trunk
SW-D(config)# interface gi1/0/1
SW-D(config-if)# description WLC data port 1
SW-D(config-if)# switchport mode trunk
SW-D(config-if)# switchport trunk native vlan 100
SW-D(config-if)# switchport trunk allowed vlan 100,10,20,30
SW-D(config-if)# spanning-tree portfast trunk

! Service port-ul: ACCESS, VLAN OOB
SW-D(config)# interface gi1/0/20
SW-D(config-if)# description WLC service port (OOB)
SW-D(config-if)# switchport mode access
SW-D(config-if)# switchport access vlan 99`} explain={[
          ['switchport mode trunk', 'Portul de date poartă VLAN-urile WLC-ului (802.1Q).'],
          ['native vlan 100', 'Dacă interfața de management a WLC-ului este untagged, VLAN-ul nativ trebuie să fie cel de management (nepotrivirea rupe accesul).'],
          ['allowed vlan …', 'Management + toate VLAN-urile interfețelor dinamice.'],
          ['service port: access vlan 99', 'Service port-ul este OOB, într-un VLAN separat; nu trunk.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — LAG static între switch și WLC (AireOS)">
        <CodeBlock title="SW-D (ilustrativ)" kind="config" code={`SW-D(config)# interface range gigabitEthernet 1/0/1 - 4
SW-D(config-if-range)# channel-group 1 mode on
SW-D(config-if-range)# exit
SW-D(config)# interface port-channel 1
SW-D(config-if)# switchport mode trunk
SW-D(config-if)# switchport trunk native vlan 100
SW-D(config-if)# switchport trunk allowed vlan 100,10,20,30
SW-D(config-if)# end

SW-D# show etherchannel summary
Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------------------
1      Po1(SU)         -         Gi1/0/1(P) Gi1/0/2(P) Gi1/0/3(P) Gi1/0/4(P)`} explain={[
          ['channel-group 1 mode on', 'Static: fără LACP/PAgP, pentru că WLC-ul AireOS nu negociază.'],
          ['interface port-channel 1 / trunk', 'Trunk-ul se aplică pe port-channel (2.4).'],
          ['Protocol: - , (P) la toți', 'Canal static (fără protocol) cu patru membri bundled.'],
        ]} />
        <CodeBlock title="Pe WLC (AireOS, ilustrativ)" kind="session" code={`(Cisco Controller) > config lag enable
Enabling LAG will map your current interface setting to LAG interface,
All dynamic AP Manager interfaces and Untagged interfaces will be deleted
All WLANs will be disabled temporarily
Are you sure you want to continue? (y/n) y
Save and reboot the system for the LAG mode to take effect

(Cisco Controller) > save config
(Cisco Controller) > reset system`} explain={[
          ['config lag enable', 'Activează LAG-ul (în GUI: Controller → General → LAG Mode on next reboot). Modifică maparea interfețelor.'],
          ['save config / reset system', 'LAG-ul se aplică după repornirea WLC-ului; ai nevoie de acces (service port / console) pentru a recupera dacă ceva nu merge.'],
        ]} />
        <Callout kind="info" title="Cum arată în GUI">
          AireOS: <b>CONTROLLER → General → LAG Mode on next reboot: Enabled</b>, apoi salvare și reboot. Verifici cu <b>CONTROLLER → Ports</b> (starea porturilor). Pe Catalyst 9800 meniurile sunt altele (de exemplu <b>Configuration → Interface → Logical</b> pentru port-channel).
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 5 — Depanare: clientul se asociază, dar nu primește IP">
        <Table head={['Pas', 'Verificare', 'Cauză probabilă']} hlCol={0} rows={[
          ['1', 'WLAN → interfața mapată (VLAN?)', 'WLAN pe interfața greșită'],
          ['2', 'show interfaces trunk (switch): VLAN permis spre WLC?', 'VLAN-ul clienților lipsește din allowed vlan sau din baza VLAN a switch-ului'],
          ['3', 'Interfața dinamică pe WLC: VLAN ID corect, DHCP server/relay setat?', 'Fără DHCP relay către serverul DHCP'],
          ['4', 'show ip dhcp binding / pool', 'Pool epuizat sau fără pool pentru subrețea'],
          ['5', 'AP FlexConnect: VLAN permis pe portul AP-ului?', 'Local switching fără VLAN pe trunk-ul AP-ului'],
        ]} />
      </Detailed>
    </section>
  );
}
