import { Callout, Detailed, Figure, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { OspfCostTable } from '../../diagrams/t3_4';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="3.4" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 3.4 este <b>Configure and verify</b>. Configurezi OSPF cu <code>router ospf</code>, <code>network … area 0</code> (cu <b>wildcard mask</b>), opțional <code>router-id</code>, <code>passive-interface</code> și <code>auto-cost reference-bandwidth</code>. Verifici cu <code>show ip protocols</code>, <code>show ip ospf neighbor</code>, <code>show ip ospf interface brief</code> și <code>show ip route ospf</code>, în această ordine.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, cu adrese de laborator; nu au fost capturate de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente. Ordinea coloanelor, formularea mesajelor și detaliile afișate variază între versiunile IOS/IOS XE și Packet Tracer.
      </Callout>

      <Detailed title="Scenariul — trei routere, un segment și un link punct-la-punct">
        <p>R1, R2 și R3 sunt conectate pe un segment Ethernet 10.0.0.0/24 prin SW1 (broadcast, cu DR și BDR). R1 și R2 mai au un link punct-la-punct direct, 10.0.12.0/30. PC3 este în LAN-ul 192.168.30.0/24, în spatele lui R3. Fiecare router are un loopback /32 pentru RID.</p>
        <Table head={['Router', 'Interfață', 'IP', 'Rol', 'RID (loopback)']} rows={[
          ['R1', 'Gi0/0', '10.0.0.1/24', 'segment comun', '1.1.1.1'],
          ['R1', 'Gi0/1', '10.0.12.1/30', 'link p2p cu R2', ''],
          ['R2', 'Gi0/0', '10.0.0.2/24', 'segment comun', '2.2.2.2'],
          ['R2', 'Gi0/1', '10.0.12.2/30', 'link p2p cu R1', ''],
          ['R3', 'Gi0/0', '10.0.0.3/24', 'segment comun', '3.3.3.3'],
          ['R3', 'Gi0/1', '192.168.30.1/24', 'LAN cu PC3 (pasiv)', ''],
        ]} />
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 1.1.1.1 0.0.0.0 area 0
R1(config-router)# network 10.0.0.0 0.0.0.255 area 0
R1(config-router)# network 10.0.12.0 0.0.0.3 area 0
R1(config-router)# auto-cost reference-bandwidth 10000
R1(config-router)# exit
R1(config)# interface g0/1
R1(config-if)# ip ospf network point-to-point
R1(config-if)# end
R1# copy running-config startup-config`} explain={[
          ['router ospf 1', 'Pornește procesul OSPF 1 (process ID local).'],
          ['router-id 1.1.1.1', 'RID manual; identic cu loopback-ul pentru claritate.'],
          ['network 1.1.1.1 0.0.0.0 area 0', 'Activează OSPF pe loopback și anunță /32-ul lui. Wildcard 0.0.0.0 = o singură adresă.'],
          ['network 10.0.0.0 0.0.0.255 area 0', 'Activează OSPF pe interfețele cu IP în 10.0.0.0/24 (Gi0/0), area 0.'],
          ['network 10.0.12.0 0.0.0.3 area 0', 'Activează OSPF pe Gi0/1 (10.0.12.0/30); wildcard 0.0.0.3 acoperă cele 4 adrese.'],
          ['auto-cost reference-bandwidth 10000', 'Referința 10 Gbps: costul Gi devine 10. Se setează identic pe toate routerele.'],
          ['ip ospf network point-to-point', 'Pe Gi0/1 (link dedicat cu R2) fără alegere DR; se setează și pe R2.'],
        ]} />
        <CodeBlock title="R2 și R3 (ilustrativ, pe scurt)" kind="config" code={`R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
R2(config-router)# network 2.2.2.2 0.0.0.0 area 0
R2(config-router)# network 10.0.0.0 0.0.0.255 area 0
R2(config-router)# network 10.0.12.0 0.0.0.3 area 0
R2(config-router)# auto-cost reference-bandwidth 10000
R2(config)# interface g0/1
R2(config-if)# ip ospf network point-to-point

R3(config)# router ospf 1
R3(config-router)# router-id 3.3.3.3
R3(config-router)# network 3.3.3.3 0.0.0.0 area 0
R3(config-router)# network 10.0.0.0 0.0.0.255 area 0
R3(config-router)# network 192.168.30.0 0.0.0.255 area 0
R3(config-router)# passive-interface g0/1
R3(config-router)# auto-cost reference-bandwidth 10000`} explain={[
          ['R2 … ip ospf network point-to-point', 'Capătul celălalt al linkului punct-la-punct: tipul trebuie să fie identic.'],
          ['R3 … passive-interface g0/1', 'Oprește Hello-urile spre LAN-ul cu PC3, dar 192.168.30.0/24 rămâne anunțată.'],
          ['auto-cost … 10000 (pe toți)', 'Costul consecvent: dacă un router are altă referință, costurile nu se potrivesc și calea aleasă e incoerentă.'],
        ]} />
        <Figure caption="Interactiv: costul OSPF = referință / lățime de bandă, minim 1. Schimbă referința și vezi cum se modifică costurile.">
          <OspfCostTable />
        </Figure>
      </Detailed>

      <Detailed title="Verificarea — în ordinea în care o faci">
        <p>Pornește cu procesul (RID, rețelele, pasivele), apoi vecinii, apoi interfețele, apoi rutele. Dacă o etapă nu e bună, nu merge să trecem la următoarea.</p>
        <CodeBlock title="Pasul 1: procesul OSPF (ilustrativ)" kind="session" code={`R1# show ip protocols
Routing Protocol is "ospf 1"
  Router ID 1.1.1.1
  Number of areas in this router is 1. 1 normal 0 stub 0 nssa
  Routing for Networks:
    1.1.1.1 0.0.0.0 area 0
    10.0.0.0 0.0.0.255 area 0
    10.0.12.0 0.0.0.3 area 0`} explain={[
          ['Router ID 1.1.1.1', 'RID-ul care rulează; dacă nu e cel așteptat, vezi 3.4.d.'],
          ['Routing for Networks', 'Rețelele activate de tine, cu wildcard și area. Dacă lipsește una, interfața nu intră în OSPF.'],
        ]} />
        <CodeBlock title="Pasul 2: vecinii (ilustrativ)" kind="session" code={`R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
3.3.3.3           1   FULL/DR         00:00:36    10.0.0.3        GigabitEthernet0/0
2.2.2.2           1   FULL/BDR        00:00:33    10.0.0.2        GigabitEthernet0/0
2.2.2.2           0   FULL/  -        00:00:38    10.0.12.2       GigabitEthernet0/1`} explain={[
          ['FULL/DR, FULL/BDR', 'Adiacențe complete pe segmentul broadcast: R1 e DROTHER pe Gi0/0 și vorbește cu DR și BDR.'],
          ['FULL/  -', 'Link punct-la-punct cu R2: fără rol DR/BDR.'],
        ]} />
        <CodeBlock title="Pasul 3: interfețele (ilustrativ)" kind="session" code={`R1# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State    Nbrs F/C
Lo0          1     0               1.1.1.1/32         1     LOOP     0/0
Gi0/0        1     0               10.0.0.1/24        10    DROTHER  2/2
Gi0/1        1     0               10.0.12.1/30       10    P2P      1/1`} explain={[
          ['Lo0 … LOOP', 'Loopback-ul: cost 1, fără vecini, dar rețeaua anunțată.'],
          ['Gi0/0 … DROTHER', 'Pe segmentul broadcast R1 nu e DR sau BDR.'],
          ['Gi0/0 … Cost 10', 'Referința 10000 / 1000 Mbps = 10.'],
          ['Gi0/1 … P2P 1/1', 'Un vecin, complet adiacent, pe link-ul punct-la-punct.'],
        ]} />
        <CodeBlock title="Pasul 4: rutele OSPF (ilustrativ)" kind="session" code={`R1# show ip route ospf
O     2.2.2.2/32 [110/11] via 10.0.12.2, GigabitEthernet0/1
O     3.3.3.3/32 [110/11] via 10.0.0.3, GigabitEthernet0/0
O     192.168.30.0/24 [110/20] via 10.0.0.3, GigabitEthernet0/0`} explain={[
          ['[110/20]', 'AD 110 (OSPF), metrica 20: costul Gi0/0 (10) + costul Gi0/1 pe R3 (10). Calea prin R2 ar costa 30.'],
          ['[110/11]', 'Loopback-ul lui R3 sau R2: costul de legătură (10) + costul loopback-ului (1).'],
          ['O', 'Cod OSPF intra-area (aceeași zonă).'],
        ]} />
        <Callout kind="info" title="Output ilustrativ">
          Calculele din exemplu (metrica = suma costurilor pe cale) sunt corecte pentru topologia de mai sus. Formatul afișării și codul exact al rutelor pot varia între versiuni.
        </Callout>
      </Detailed>

      <Detailed title="Erori tipice: simptom → cauză → verificare">
        <Table head={['Simptom', 'Cauză probabilă', 'Verifici cu']} rows={[
          ['Vecinul nu apare deloc', 'Interfața nu e în niciun network statement; area diferit; interfața e pasivă; subrețea diferită', 'show ip protocols, show ip ospf interface'],
          ['Vecinul e blocat în ExStart/Exchange', 'MTU diferit pe cele două capete', 'show interfaces pe ambele'],
          ['Vecinul e în 2-WAY pe Ethernet', 'Normal dacă ambii sunt DROTHER; problemă dacă unul e DR/BDR-candidat și nu se leagă', 'show ip ospf neighbor (rol)'],
          ['Wildcard greșit (ex. 255.255.255.0)', 'Interfața nu se potrivește sau se activează altceva', 'show ip protocols (Routing for Networks)'],
          ['Router-id nou, dar show arată vechiul', 'Procesul nu a fost resetat', 'clear ip ospf process, apoi show ip protocols'],
          ['Ruta lipsește din tabelă', 'Rețeaua nu e anunțată (lipsă network) sau altă rută cu AD mai mic', 'show ip route, show ip ospf database'],
          ['Costurile nu se înțeleg între routere', 'Referințe diferite de auto-cost', 'show ip ospf interface brief (coloana Cost)'],
        ]} />
        <Reveal label="De ce passive-interface nu oprește anunțarea rețelei?">
          <p>Pasivitatea oprește doar <b>Hello-urile</b> (și deci adiacențele) pe interfață, nu și anunțarea ei. Rețeaua unei interfețe pasive intră în OSPF și e propagată prin celelalte interfețe. Asta e exact ce vrei pentru un LAN cu PC-uri: rețeaua e cunoscută, dar nu trimiți Hello-uri inutile către PC-uri.</p>
        </Reveal>
      </Detailed>

      <Traps items={[
        <>Comanda <code>network</code> din OSPF folosește <b>wildcard mask</b>, nu mască de subrețea: <code>network 10.0.0.0 0.0.0.255 area 0</code>, nu <code>255.255.255.0</code>.</>,
        <>Process ID-ul (<code>router ospf 1</code>) nu trebuie să fie identic pe vecini; area ID-ul trebuie.</>,
        <>Un router-id schimbat cere <code>clear ip ospf process</code> sau reload; <code>show running-config</code> nu arată starea procesului.</>,
        <>Referința de cost trebuie să fie identică pe toate routerele; altfel costurile se contrazic.</>,
        <>Vecinul apare în <code>show ip ospf neighbor</code> ≠ ruta apare în <code>show ip route</code>: verifică și al doilea.</>,
      ]} />
    </section>
  );
}
