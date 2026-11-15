import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.5" title="Exemple de configurare și interpretare" />
      <Summary>
        <p>Obiectivul 2.5 cere <b>interpretare</b>. Mai jos: activarea Rapid PVST+, citirea lui <code>show spanning-tree</code> pe root și pe un switch non-root (roluri, stări, costuri), alegerea root-ului, PortFast cu BPDU Guard, Root Guard / Loop Guard, recuperarea din err-disabled și un scenariu de depanare.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, reconstruite după formatele documentate, cu adrese MAC și nume fictive; nu au fost capturate de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente. Formatul, mesajele de log, valorile implicite (inclusiv modul STP implicit) și opțiunile diferă între platforme și versiuni; verifică cu <code>?</code> și <code>show spanning-tree summary</code>.
      </Callout>

      <Detailed title="Exemplul 1 — Activarea Rapid PVST+ și verificarea modului">
        <CodeBlock title="SW1, SW2, SW3 (pe toate)" kind="config" code={`SW1(config)# spanning-tree mode rapid-pvst
SW1(config)# end
SW1# show spanning-tree summary
Switch is in rapid-pvst mode
Root bridge for: VLAN0010
Extended system ID           is enabled
Portfast Default             is disabled
PortFast BPDU Guard Default  is disabled
Portfast BPDU Filter Default is disabled
Loopguard Default            is disabled
EtherChannel misconfig guard is enabled
UplinkFast                   is disabled
BackboneFast                 is disabled
Configured Pathcost method used is short

Name                   Blocking Listening Learning Forwarding STP Active
---------------------- -------- --------- -------- ---------- ----------
VLAN0010                     0         0        0          3          3`} explain={[
          ['spanning-tree mode rapid-pvst', 'Comută instanțele STP la RSTP per VLAN. Se face pe toate switch-urile (modurile pot coexista, dar pierzi beneficiile).'],
          ['Switch is in rapid-pvst mode', 'Confirmarea modului — prima verificare pe care o faci.'],
          ['Root bridge for: VLAN0010', 'Acest switch este root pentru VLAN 10.'],
          ['Extended system ID is enabled', 'Prioritatea afișată = prioritate + numărul VLAN-ului.'],
          ['Pathcost method … short', 'Costurile sunt cele „short” (1 Gbps = 4).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Interpretarea unui output: root bridge și switch non-root">
        <p>Topologie: triunghi SW1–SW2–SW3, toate linkurile 1 Gbps, VLAN 10. SW1 are prioritatea 24576 (root).</p>
        <CodeBlock title="SW1 — root (ilustrativ)" kind="session" code={`SW1# show spanning-tree vlan 10

VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586
             Address     0000.0000.00A1
             This bridge is the root
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    24586  (priority 24576 sys-id-ext 10)
             Address     0000.0000.00A1
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  300 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/1               Desg FWD 4         128.1    P2p
Gi0/2               Desg FWD 4         128.2    P2p`} explain={[
          ['Root ID Priority 24586', '24576 + 10 (VLAN). Valoarea afișată include extended system ID.'],
          ['This bridge is the root', 'Mesaj cheie: Root ID = Bridge ID; nu apare „Cost” și „Port” la Root ID.'],
          ['Bridge ID … (priority 24576 sys-id-ext 10)', 'Detaliază: prioritate configurată + VLAN.'],
          ['Role Desg FWD', 'Pe root toate porturile sunt Designated și Forwarding.'],
          ['Cost 4 · Prio.Nbr 128.1', 'Costul portului (1 Gbps = 4); prioritatea portului 128, număr port 1.'],
          ['Type P2p', 'Link punct-la-punct (full duplex): eligibil pentru handshake rapid.'],
        ]} />
        <CodeBlock title="SW3 — non-root (ilustrativ)" kind="session" code={`SW3# show spanning-tree vlan 10

VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586
             Address     0000.0000.00A1
             Cost        4
             Port        1 (GigabitEthernet0/1)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     0000.0000.00C3
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  300 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/1               Root FWD 4         128.1    P2p
Gi0/2               Altn BLK 4         128.2    P2p
Fa0/5               Desg FWD 19        128.5    P2p Edge`} explain={[
          ['Root ID … Cost 4, Port 1 (Gi0/1)', 'Costul total de la SW3 la root este 4 (un salt de 1 Gbps) și ieșirea spre root este Gi0/1 ⇒ acesta este Root Port.'],
          ['Bridge ID 32778', 'SW3 are prioritatea implicită 32768 + VLAN 10; MAC mai mare decât al root-ului.'],
          ['Gi0/1 Root FWD', 'Root Port în Forwarding.'],
          ['Gi0/2 Altn BLK', 'Alternate: calea de rezervă spre root (prin SW2); Discarding (afișat BLK).'],
          ['Fa0/5 Desg FWD 19 … Edge', 'Port spre PC (100 Mbps ⇒ cost 19), Designated, tip Edge (PortFast).'],
        ]} />
        <Table head={['Întrebare de examen', 'Cum răspunzi din output']} hlCol={0} rows={[
          ['Cine este root?', 'Switch-ul cu „This bridge is the root”, sau cel al cărui Address apare la Root ID.'],
          ['Care este root port-ul?', 'Interfața cu Role = Root; sau portul indicat în „Port” de la Root ID.'],
          ['De ce Gi0/2 este blocat?', 'Role Altn: vecinul de pe acel segment are cale mai bună spre root; este calea de rezervă.'],
          ['Cât costă calea spre root?', 'Valoarea „Cost” de la Root ID.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Alegerea root-ului: priority, primary, secondary">
        <CodeBlock title="SW1 (distribuție A) și SW2 (distribuție B)" kind="config" code={`SW1(config)# spanning-tree vlan 10,20 root primary
SW2(config)# spanning-tree vlan 10,20 root secondary

! Alternativ, explicit (multipli de 4096):
SW1(config)# spanning-tree vlan 10 priority 4096
SW2(config)# spanning-tree vlan 10 priority 8192
SW1# show spanning-tree vlan 10 | include Priority`} explain={[
          ['root primary', 'Macro: setează prioritatea suficient de jos pentru a deveni root (de obicei 24576, sau mai mică dacă e nevoie).'],
          ['root secondary', 'Macro: prioritate intermediară (de obicei 28672), pentru preluare dacă primary cade.'],
          ['priority 4096', 'Explicit; valoarea trebuie să fie multiplu de 4096.'],
          ['show … | include Priority', 'Afișează Root ID și Bridge ID: Root ID Priority trebuie să fie 4106 pe VLAN 10.'],
        ]} />
        <CodeBlock title="Costuri (ilustrativ)" kind="config" code={`SW3(config)# interface gi0/1
SW3(config-if)# spanning-tree vlan 10 cost 2
SW3(config-if)# spanning-tree vlan 10 port-priority 64
SW3(config-if)# exit
SW3(config)# spanning-tree pathcost method long`} explain={[
          ['spanning-tree vlan 10 cost 2', 'Modifici costul portului pentru VLAN 10 (influențează alegerea root port-ului).'],
          ['port-priority 64', 'Prioritatea portului (implicit 128, multipli de 16): decide la egalitate de cost și BID.'],
          ['pathcost method long', 'Folosește costurile pe 32 de biți (1 Gbps = 20 000).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — PortFast și BPDU Guard">
        <CodeBlock title="SW3 — port spre PC" kind="config" code={`SW3(config)# interface fa0/5
SW3(config-if)# switchport mode access
SW3(config-if)# switchport access vlan 10
SW3(config-if)# spanning-tree portfast
SW3(config-if)# spanning-tree bpduguard enable
SW3(config-if)# end

! Variantă globală, pentru toate porturile access:
SW3(config)# spanning-tree portfast default
SW3(config)# spanning-tree portfast bpduguard default`} explain={[
          ['spanning-tree portfast', 'Portul trece direct în Forwarding (edge port).'],
          ['spanning-tree bpduguard enable', 'Dacă portul primește un BPDU ⇒ err-disabled.'],
          ['portfast default', 'Global: PortFast pe toate porturile access.'],
          ['portfast bpduguard default', 'Global: BPDU Guard pe toate porturile cu PortFast.'],
        ]} />
        <CodeBlock title="Un switch neautorizat conectat la Fa0/5 (ilustrativ)" kind="session" code={`%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port Fa0/5 with BPDU Guard enabled. Disabling port.
%PM-4-ERR_DISABLE: bpduguard error detected on Fa0/5, putting Fa0/5 in err-disable state

SW3# show interfaces status err-disabled
Port      Name               Status       Reason               Err-disabled Vlans
Fa0/5                        err-disabled bpduguard

! Recuperare după ce ai scos switch-ul neautorizat:
SW3(config)# interface fa0/5
SW3(config-if)# shutdown
SW3(config-if)# no shutdown

! Recuperare automată (opțional):
SW3(config)# errdisable recovery cause bpduguard
SW3(config)# errdisable recovery interval 300`} explain={[
          ['%SPANTREE-2-BLOCK_BPDUGUARD', 'Mesajul care explică DE CE portul a fost oprit.'],
          ['err-disabled bpduguard', 'Starea și motivul în show interfaces status err-disabled.'],
          ['shutdown / no shutdown', 'Recuperare manuală. Dacă BPDU-ul încă vine, portul reintră în err-disabled.'],
          ['errdisable recovery cause bpduguard', 'Recuperare automată după interval (secunde).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — Root Guard, Loop Guard și BPDU Filter">
        <CodeBlock title="Protecții" kind="config" code={`! Root Guard: port spre un switch "client" care nu are voie să devină root
SW1(config)# interface gi0/10
SW1(config-if)# spanning-tree guard root

! Loop Guard: pe porturile root/alternate (global sau pe interfață)
SW3(config)# spanning-tree loopguard default
SW3(config)# interface gi0/2
SW3(config-if)# spanning-tree guard loop

! BPDU Filter: pe interfață (periculos) sau global (mai sigur)
SW3(config-if)# spanning-tree bpdufilter enable
SW3(config)# spanning-tree portfast bpdufilter default`} explain={[
          ['spanning-tree guard root', 'Dacă pe port sosește un BPDU superior ⇒ root-inconsistent (blocat) până dispare.'],
          ['spanning-tree loopguard default', 'Activează Loop Guard pe toate porturile punct-la-punct eligibile.'],
          ['spanning-tree guard loop', 'Pe o singură interfață.'],
          ['bpdufilter enable (interfață)', 'Portul nu mai trimite/primește BPDU: STP efectiv oprit pe port.'],
          ['portfast bpdufilter default', 'Global: se aplică porturilor PortFast; la apariția unui BPDU portul revine la STP normal.'],
        ]} />
        <CodeBlock title="Root Guard declanșat (ilustrativ)" kind="session" code={`%SPANTREE-2-ROOTGUARD_BLOCK: Root guard blocking port GigabitEthernet0/10 on VLAN0010.
SW1# show spanning-tree inconsistentports
Name                 Interface              Inconsistency
-------------------- ---------------------- ------------------
VLAN0010             GigabitEthernet0/10    Root Inconsistent

Number of inconsistent ports (segments) in the system : 1

%SPANTREE-2-ROOTGUARD_UNBLOCK: Root guard unblocking port GigabitEthernet0/10 on VLAN0010.`} explain={[
          ['ROOTGUARD_BLOCK', 'Un BPDU superior a sosit pe Gi0/10 ⇒ portul este pus în root-inconsistent.'],
          ['show spanning-tree inconsistentports', 'Listează porturile blocate de Root Guard / Loop Guard.'],
          ['ROOTGUARD_UNBLOCK', 'Mesaj la revenire automată, după ce BPDU-urile superioare încetează.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 6 — Depanare: root-ul nu este cel dorit">
        <p>Simptom: un switch de acces vechi (SW-ACC) a devenit root pentru VLAN 10, iar traficul trece prin el. Pași:</p>
        <Table head={['Pas', 'Comandă', 'Ce urmărești']} hlCol={0} rows={[
          ['1', <code>show spanning-tree vlan 10</code>, 'Pe orice switch: Root ID Address ⇒ cine este root (MAC) și portul spre el.'],
          ['2', <code>show spanning-tree vlan 10 root</code>, 'Rezumat: Root ID, cost, port.'],
          ['3', <code>show spanning-tree summary</code>, 'Modul (PVST+ / rapid-pvst), „Root bridge for”.'],
          ['4', 'Compară Bridge ID-urile (prioritate + MAC)', 'Toate au 32778 ⇒ MAC-ul mai mic câștigă; switch-ul vechi are MAC mic.'],
          ['5', <code>spanning-tree vlan 10 root primary</code>, 'Pe switch-ul de distribuție dorit; verifică din nou Root ID.'],
          ['6', <code>spanning-tree guard root</code>, 'Pe porturile spre acces, ca să nu se repete (dacă accesul nu trebuie să fie root).'],
        ]} />
      </Detailed>
    </section>
  );
}
