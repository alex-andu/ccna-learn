import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.4" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 2.4 este de tip <b>Configure and verify</b>. Mai jos: EtherChannel L2 cu LACP (trunk), citirea lui <code>show etherchannel summary</code>, varianta L3, PAgP și static pentru comparație, load balancing și un scenariu de depanare.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, reconstruite după formatele documentate, cu nume și adrese fictive; nu au fost capturate de pe echipamente reale. Comenzile din acest topic <b>nu au fost testate</b> de autorul lecției pe echipamente. Sintaxa, mesajele și opțiunile de load-balance diferă între platforme (Catalyst 2960/3560/9000) și în Packet Tracer; verifică cu <code>?</code> pe echipamentul tău.
      </Callout>

      <Detailed title="Exemplul 1 — EtherChannel L2 cu LACP, trunk între SW1 și SW2">
        <p>Scenariu: două linkuri Gi0/1 și Gi0/2 între SW1 și SW2; vrem un singur trunk logic, cu VLAN-urile 10 și 20 și native VLAN 99.</p>
        <CodeBlock title="SW1 (SW2 la fel, cu mod active sau passive)" kind="config" code={`SW1(config)# interface range gigabitEthernet 0/1 - 2
SW1(config-if-range)# shutdown
SW1(config-if-range)# channel-group 1 mode active
Creating a port-channel interface Port-channel 1
SW1(config-if-range)# exit
SW1(config)# interface port-channel 1
SW1(config-if)# switchport trunk encapsulation dot1q
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,20,99
SW1(config-if)# exit
SW1(config)# interface range gigabitEthernet 0/1 - 2
SW1(config-if-range)# no shutdown`} explain={[
          ['interface range … shutdown', 'Oprești temporar membrii ca să nu apară negocieri parțiale în timpul configurării.'],
          ['channel-group 1 mode active', 'Pune ambele porturi în canalul 1, cu LACP în mod activ. Dacă port-channel 1 nu există, este creat automat.'],
          ['interface port-channel 1', 'Interfața logică; ce configurezi aici se aplică membrilor.'],
          ['switchport trunk encapsulation dot1q', 'Necesar doar pe platformele care suportă și ISL (pe cele doar-dot1q comanda nu există).'],
          ['switchport mode trunk', 'Canalul este un trunk (2.2).'],
          ['native vlan 99 / allowed vlan 10,20,99', 'Parametrii de trunk se aplică tuturor membrilor; trebuie să fie identici și pe SW2.'],
          ['no shutdown', 'Repornești membrii; acum se negociază LACP.'],
        ]} />
        <CodeBlock title="SW2" kind="config" code={`SW2(config)# interface range gigabitEthernet 0/1 - 2
SW2(config-if-range)# channel-group 1 mode passive
SW2(config-if-range)# exit
SW2(config)# interface port-channel 1
SW2(config-if)# switchport trunk encapsulation dot1q
SW2(config-if)# switchport mode trunk
SW2(config-if)# switchport trunk native vlan 99
SW2(config-if)# switchport trunk allowed vlan 10,20,99`} explain={[
          ['mode passive', 'SW2 răspunde la LACPDU-urile lui SW1 (active). Canalul se formează pentru că unul dintre capete inițiază.'],
          ['restul', 'Aceeași configurație de trunk ca pe SW1.'],
        ]} />
        <CodeBlock title="Verificare pe SW1 (ilustrativ)" kind="session" code={`SW1# show etherchannel summary
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use      f - failed to allocate aggregator
        M - not in use, minimum links not met
        u - unsuitable for bundling
        w - waiting to be aggregated
        d - default port

Number of channel-groups in use: 1
Number of aggregators:           1

Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------------------
1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(P)`} explain={[
          ['Number of channel-groups in use: 1', 'Există un canal configurat.'],
          ['Po1(SU)', 'S = Layer 2, U = în uz: canalul funcționează ca port L2.'],
          ['Protocol: LACP', 'Canalul a fost negociat cu LACP (nu PAgP, nu static; la static ar apărea „-”).'],
          ['Gi0/1(P) Gi0/2(P)', 'Ambii membri sunt bundled (P) — exact ce vrem.'],
        ]} />
        <CodeBlock title="Alte verificări (ilustrativ)" kind="session" code={`SW1# show etherchannel port-channel
SW1# show lacp neighbor
Flags:  S - Device is requesting Slow LACPDUs
        F - Device is requesting Fast LACPDUs
        A - Device is in Active mode       P - Device is in Passive mode

Channel group 1 neighbors

Partner's information:

                  LACP port                        Admin  Oper   Port    Port
Port      Flags   Priority  Dev ID          Age    key    Key    Number  State
Gi0/1     SP      32768     0011.2233.4401  14s    0x0    0x1    0x102   0x3C
Gi0/2     SP      32768     0011.2233.4401  14s    0x0    0x1    0x103   0x3C
SW1# show interfaces trunk
SW1# show spanning-tree vlan 10`} explain={[
          ['show etherchannel port-channel', 'Detalii pe Po: membrii, protocol, număr de porturi active.'],
          ['show lacp neighbor', 'Partenerul: ID-ul lui (MAC), priorități, flaguri. „SP” = Slow LACPDU + Passive (SW2 e passive).'],
          ['show interfaces trunk', 'Trunk-ul apare ca Po1, nu ca Gi0/1 și Gi0/2.'],
          ['show spanning-tree vlan 10', 'STP vede Po1 ca un singur port; nu mai blochează un link „redundant”.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — EtherChannel de nivel 3 (port rutat)">
        <p>Scenariu: două switch-uri multilayer, SW-D1 și SW-D2, legate cu două linkuri; vrem un link rutat 10.0.0.0/30 fără VLAN-uri.</p>
        <CodeBlock title="SW-D1" kind="config" code={`SW-D1(config)# ip routing
SW-D1(config)# interface range gigabitEthernet 1/0/1 - 2
SW-D1(config-if-range)# no switchport
SW-D1(config-if-range)# channel-group 2 mode active
SW-D1(config-if-range)# exit
SW-D1(config)# interface port-channel 2
SW-D1(config-if)# no switchport
SW-D1(config-if)# ip address 10.0.0.1 255.255.255.252
SW-D1(config-if)# no shutdown`} explain={[
          ['ip routing', 'Activează rutarea pe switch-ul multilayer.'],
          ['no switchport (pe membri)', 'Porturile devin rutate, fără funcții de L2. Nu pui IP pe membri.'],
          ['channel-group 2 mode active', 'LACP, la fel ca la L2.'],
          ['interface port-channel 2 / no switchport', 'Po devine port rutat (dacă nu e deja, în funcție de platformă).'],
          ['ip address 10.0.0.1 /30', 'Adresa unică a legăturii punct-la-punct.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`SW-D1# show etherchannel summary
Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------------------
2      Po2(RU)         LACP      Gi1/0/1(P)  Gi1/0/2(P)

SW-D1# show ip interface brief | include Port-channel
Port-channel2      10.0.0.1        YES manual up                    up

SW-D1# ping 10.0.0.2
!!!!!`} explain={[
          ['Po2(RU)', 'R = Layer 3, U = în uz: canalul este un port rutat.'],
          ['show ip interface brief', 'IP-ul este pe Port-channel2, nu pe Gi1/0/1 sau Gi1/0/2.'],
          ['ping 10.0.0.2', 'Verificare de conectivitate cu celălalt capăt (configurat simetric, cu 10.0.0.2).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — PAgP și static, pentru comparație">
        <CodeBlock title="Variante de mod (același sistem de comenzi)" kind="config" code={`! PAgP (Cisco)
SW1(config-if-range)# channel-group 3 mode desirable
SW2(config-if-range)# channel-group 3 mode auto

! Static, fără negociere
SW1(config-if-range)# channel-group 4 mode on
SW2(config-if-range)# channel-group 4 mode on

! Alegerea explicită a protocolului (platforme care o suportă)
SW1(config-if-range)# channel-protocol lacp
SW1(config-if-range)# channel-group 1 mode active`} explain={[
          ['desirable / auto', 'PAgP: desirable inițiază, auto răspunde.'],
          ['mode on', 'Static: nu trimite pachete de negociere; ambele capete trebuie să spună on.'],
          ['channel-protocol lacp', 'Fixează protocolul pe port și respinge moduri incompatibile (un mod PAgP nu mai e acceptat).'],
        ]} />
        <p>Cu <code>channel-protocol lacp</code> setat, o comandă <code>channel-group … mode desirable</code> este refuzată; asta previne confuzia LACP/PAgP.</p>
      </Detailed>

      <Detailed title="Exemplul 4 — Load balancing">
        <CodeBlock title="SW1" kind="config" code={`SW1(config)# port-channel load-balance src-dst-ip
SW1(config)# end
SW1# show etherchannel load-balance
EtherChannel Load-Balancing Configuration:
        src-dst-ip

EtherChannel Load-Balancing Addresses Used Per-Protocol:
Non-IP: Source XOR Destination MAC address
  IPv4: Source XOR Destination IP address
  IPv6: Source XOR Destination IP address`} explain={[
          ['port-channel load-balance src-dst-ip', 'Setare GLOBALĂ: hash pe IP sursă XOR IP destinație.'],
          ['show etherchannel load-balance', 'Arată metoda activă și câmpurile folosite pentru fiecare tip de trafic (non-IP cade pe MAC).'],
        ]} />
        <Callout kind="info" title="Opțiunile diferă">
          Lista metodelor (<code>src-mac</code>, <code>dst-mac</code>, <code>src-dst-mac</code>, <code>src-ip</code>, <code>dst-ip</code>, <code>src-dst-ip</code>, uneori și porturi L4) și metoda implicită depind de platformă. Folosește <code>port-channel load-balance ?</code> ca să vezi ce oferă echipamentul tău.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 5 — Depanare: canalul nu se formează">
        <p>Simptom: după configurare, <code>show etherchannel summary</code> arată:</p>
        <CodeBlock title="SW1 (ilustrativ)" kind="session" code={`SW1# show etherchannel summary
Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------------------
1      Po1(SD)         LACP      Gi0/1(I)    Gi0/2(I)`} explain={[
          ['Po1(SD)', 'S = Layer 2, D = down: niciun membru nu este bundled.'],
          ['Gi0/1(I) Gi0/2(I)', 'I = stand-alone: porturile lucrează separat, negocierea nu a reușit.'],
        ]} />
        <Table head={['Verificare', 'Ce cauți']} hlCol={0} rows={[
          [<code>show running-config interface gi0/1</code>, 'Pe SW1: mode active; pe SW2: mode passive sau active? Dacă ambele sunt passive, canalul nu se formează.'],
          [<code>show lacp neighbor</code>, 'Dacă nu apare niciun partener, celălalt capăt nu trimite LACPDU (portul nu e în canal, sau e în mod „on”/PAgP).'],
          [<code>show interfaces gi0/1 switchport</code>, 'Mod (access/trunk), VLAN, native — identice pe ambii membri și pe ambele switch-uri.'],
          [<code>show interfaces status</code>, 'Viteză și duplex identice între membri.'],
          [<><code>show etherchannel summary</code> (SW2)</>, 'Același număr de membri? Protocol LACP și nu PAgP?'],
        ]} />
        <p><b>Remediere:</b> corectezi modul (de exemplu <code>channel-group 1 mode active</code> pe SW2), aliniezi parametrii pe porturi, apoi <code>shutdown</code> / <code>no shutdown</code> pe <code>port-channel 1</code>. Verifici din nou: <code>Po1(SU)</code> cu <code>(P)</code> la ambii membri.</p>
      </Detailed>
    </section>
  );
}
