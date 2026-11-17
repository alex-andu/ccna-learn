import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.3" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 2.3 este de tip <b>Configure and verify</b>. Mai jos: verificarea CDP, citirea lui <code>show cdp neighbors [detail]</code>, activarea LLDP, controlul pe interfețe, timerele și depanarea unui vecin care lipsește.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, reconstruite după formatele documentate, cu nume, modele și adrese fictive; nu au fost capturate de pe echipamente reale. Comenzile din acest topic <b>nu au fost testate</b> de autorul lecției pe echipamente. Formatul coloanelor, codurile de capabilitate și valorile implicite ale timerelor diferă între platforme și versiuni; verifică cu <code>?</code>, <code>show cdp</code> și <code>show lldp</code> pe echipamentul tău. Suportul LLDP în Packet Tracer poate lipsi sau diferi.
      </Callout>

      <Detailed title="Exemplul 1 — Starea CDP și vecinii (SW1)">
        <p>Scenariu: SW1 are R1 pe Fa0/24 și SW2 pe Gi0/1.</p>
        <CodeBlock title="SW1 — show cdp / show cdp neighbors (ilustrativ)" kind="session" code={`SW1# show cdp
Global CDP information:
        Sending CDP packets every 60 seconds
        Sending a holdtime value of 180 seconds
        Sending CDPv2 advertisements is  enabled

SW1# show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone,
                  D - Remote, C - CVTA, M - Two-port Mac Relay

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
R1               Fas 0/24          150        R B         ISR4331   Gig 0/0
SW2              Gig 0/1           171          S I       WS-C2960  Gig 0/1`} explain={[
          ['Sending CDP packets every 60 seconds', 'Timerul de anunț (implicit 60 s).'],
          ['holdtime value of 180 seconds', 'Cât timp păstrează vecinii informația noastră (implicit 180 s).'],
          ['Device ID', 'Hostname-ul vecinului.'],
          ['Local Intrfce', 'Portul TĂU (de pe SW1): Fas 0/24 și Gig 0/1.'],
          ['Holdtme', 'Secunde rămase până expiră intrarea dacă nu mai vine un anunț (scade de la holdtime).'],
          ['Capability', 'R = router, B = bridge sursă (în exemplu), S = switch, I = IGMP.'],
          ['Platform', 'Modelul vecinului.'],
          ['Port ID', 'Portul VECINULUI (de pe R1: Gig 0/0; de pe SW2: Gig 0/1).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — show cdp neighbors detail: IP și versiune IOS">
        <CodeBlock title="SW1 — show cdp neighbors detail (extras, ilustrativ)" kind="session" code={`SW1# show cdp neighbors detail
-------------------------
Device ID: R1
Entry address(es):
  IP address: 192.168.1.1
Platform: cisco ISR4331,  Capabilities: Router
Interface: FastEthernet0/24,  Port ID (outgoing port): GigabitEthernet0/0
Holdtime : 150 sec

Version :
Cisco IOS Software [...], Version 15.x(...)

advertisement version: 2
Native VLAN: 1
Duplex: full
Management address(es):
  IP address: 192.168.1.1`} explain={[
          ['Device ID: R1', 'Vecinul descris.'],
          ['IP address: 192.168.1.1', 'Adresa cu care îl poți accesa (SSH): baza lui „CDP walking”.'],
          ['Interface / Port ID (outgoing port)', 'Interface = portul tău; Port ID = portul vecinului.'],
          ['Version', 'Versiunea de software a vecinului.'],
          ['Native VLAN / Duplex', 'Compară cu portul tău: diferențe indică nepotriviri (native VLAN, duplex).'],
        ]} />
        <p>Variante: <code>show cdp entry R1</code> (doar R1), <code>show cdp interface</code> (porturile cu CDP activ), <code>show cdp traffic</code> (contoare).</p>
      </Detailed>

      <Detailed title="Exemplul 3 — Control CDP: global, pe interfață, timere">
        <CodeBlock title="SW1 — configurare CDP" kind="config" code={`SW1(config)# cdp timer 30
SW1(config)# cdp holdtime 120
SW1(config)# interface fa0/10
SW1(config-if)# no cdp enable
SW1(config-if)# exit
SW1(config)# no cdp run
SW1(config)# cdp run`} explain={[
          ['cdp timer 30', 'Anunț la 30 s în loc de 60 s (rețea mai reactivă, mai mult trafic de control).'],
          ['cdp holdtime 120', 'Vecinii păstrează informația 120 s.'],
          ['interface fa0/10 / no cdp enable', 'Oprește CDP doar pe acest port (de exemplu spre utilizatori).'],
          ['no cdp run', 'Oprește CDP pe tot echipamentul (pe toate interfețele).'],
          ['cdp run', 'Îl repornește (starea implicită).'],
        ]} />
        <CodeBlock title="Verificare după oprire (ilustrativ)" kind="session" code={`SW1# show cdp
% CDP is not enabled

SW1# show cdp interface fa0/10
% CDP is not enabled`} explain={[
          ['% CDP is not enabled', 'Mesaj tipic când CDP e oprit global; pe un port oprit nu apar timerele lui.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — LLDP">
        <CodeBlock title="SW1 — pornire LLDP" kind="config" code={`SW1(config)# lldp run
SW1(config)# lldp timer 30
SW1(config)# lldp holdtime 120
SW1(config)# interface gi0/1
SW1(config-if)# lldp transmit
SW1(config-if)# lldp receive
SW1(config-if)# interface fa0/10
SW1(config-if)# no lldp transmit
SW1(config-if)# no lldp receive`} explain={[
          ['lldp run', 'Pornește LLDP global (implicit oprit pe IOS).'],
          ['lldp timer 30 / lldp holdtime 120', 'Valorile uzuale; le setezi explicit dacă vrei să le vezi în configurație.'],
          ['lldp transmit / lldp receive (Gi0/1)', 'Ambele direcții active pe uplink (de obicei implicit după lldp run; le scrii pentru claritate).'],
          ['no lldp transmit / no lldp receive (Fa0/10)', 'Port spre utilizator: nu anunța și nu asculta.'],
        ]} />
        <CodeBlock title="SW1 — show lldp (ilustrativ)" kind="session" code={`SW1# show lldp
Global LLDP Information:
    Status: ACTIVE
    LLDP advertisements are sent every 30 seconds
    LLDP hold time advertised is 120 seconds

SW1# show lldp neighbors
Capability codes:
    (R) Router, (B) Bridge, (T) Telephone, (C) DOCSIS Cable Device
    (W) WLAN Access Point, (P) Repeater, (S) Station, (O) Other

Device ID           Local Intf     Hold-time  Capability      Port ID
SW2                 Gi0/1          110        B               Gi0/1

Total entries displayed: 1`} explain={[
          ['Status: ACTIVE', 'LLDP este pornit global.'],
          ['advertisements every 30 s / hold time 120 s', 'Timerele curente.'],
          ['Local Intf', 'Portul tău (Gi0/1).'],
          ['Hold-time 110', 'Secunde rămase din hold time (scade între anunțuri).'],
          ['Capability B', 'Bridge (switch).'],
          ['Port ID', 'Portul vecinului.'],
        ]} />
        <CodeBlock title="SW1 — show lldp neighbors detail (extras, ilustrativ)" kind="session" code={`SW1# show lldp neighbors detail
------------------------------------------------
Local Intf: Gi0/1
Chassis id: 0011.2233.4455
Port id: Gi0/1
Port Description: uplink spre SW1
System Name: SW2

System Description:
Cisco IOS Software [...]
Time remaining: 110 seconds
System Capabilities: B
Enabled Capabilities: B
Management Addresses:
    IP: 192.168.1.12`} explain={[
          ['Chassis id / Port id', 'TLV-urile obligatorii: identifică echipamentul și portul vecinului.'],
          ['Port Description / System Name / System Description', 'TLV-uri opționale: descrierea portului, hostname, model și versiune.'],
          ['System Capabilities / Enabled Capabilities', 'Ce poate face și ce roluri sunt active.'],
          ['Management Addresses', 'IP-ul de management al vecinului.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — Mesaje generate de CDP (diagnostic)">
        <CodeBlock title="Loguri (ilustrative)" kind="session" code={`%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (1), with SW2 GigabitEthernet0/1 (99).
%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on FastEthernet0/24 (not half duplex), with R1 GigabitEthernet0/0 (half duplex).`} explain={[
          ['NATIVE_VLAN_MISMATCH', 'CDP a observat native VLAN-uri diferite pe cele două capete ale trunk-ului (2.2.c).'],
          ['DUPLEX_MISMATCH', 'CDP a observat setări de duplex diferite (1.4); remediază alinierea duplex/speed.'],
        ]} />
        <p>Asta arată de ce CDP este util și dincolo de „cine e vecinul”: compară parametrii celor două capete și te avertizează. Dacă CDP e oprit, nu primești aceste avertismente.</p>
      </Detailed>

      <Detailed title="Exemplul 6 — Vecinul lipsește: scenarii">
        <Table head={['Simptom', 'Cauză probabilă', 'Verificare / remediere']} hlCol={0} rows={[
          ['Nu apare niciun vecin CDP', 'Link jos sau CDP oprit global (no cdp run).', <><code>show interfaces status</code>, <code>show cdp</code>; <code>cdp run</code>.</>],
          ['Vecinul apare în LLDP, dar nu în CDP', 'Echipament non-Cisco (nu rulează CDP) sau CDP oprit pe interfață.', <><code>show lldp neighbors</code>; <code>show cdp interface</code>.</>],
          ['Nicio intrare LLDP deși link-ul e up', 'LLDP e dezactivat implicit.', <><code>lldp run</code> pe ambele capete.</>],
          ['Vecinul apare într-o direcție, dar nu în cealaltă', 'Pe un capăt lldp transmit sau lldp receive e oprit.', <><code>show lldp interface</code>; activezi ambele.</>],
          ['Un vecin dispare după câteva minute', 'Anunțurile nu mai ajung: cablu defect, port err-disabled sau echipament oprit.', <><code>show interfaces</code>, <code>show cdp traffic</code>.</>],
          ['Telefonul nu primește VLAN-ul de voce', 'CDP/LLDP oprit pe portul telefonului.', <><code>show cdp neighbors</code> arată telefonul? Dacă nu: <code>cdp enable</code> / <code>lldp transmit</code>.</>],
        ]} />
      </Detailed>
    </section>
  );
}
