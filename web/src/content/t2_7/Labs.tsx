import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology27, LabSoloTopology27 } from '../../diagrams/t2_7';

/* ======================================================================
   LAB GHIDAT — porturile switch-ului pentru AP și WLC
   ====================================================================== */
export function GuidedLab() {
  const L = 't27g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.7-G" title="Lab ghidat — porturi access/trunk pentru AP și WLC, service port" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi un switch astfel încât un <G id="lightweight-ap" /> să primească IP (port access, VLAN 100), WLC-ul să ajungă pe un trunk cu VLAN-urile 10, 20, 100, iar service port-ul să fie pe un VLAN OOB separat; apoi verifici și provoci erori (VLAN nepermis, nativ greșit).
          <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Packet Tracer (WLC-PT, LAP-PT, switch 2960/3650, server DHCP) sau GNS3/CML cu un WLC virtual · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: WLC (trunk), LAP1 (access VLAN 100), PC admin pe service/OOB (access VLAN 99).">
        <LabGuidedTopology27 />
      </Figure>
      <Table head={['Legătură', 'Port switch', 'Mod', 'VLAN-uri']} rows={[
        ['WLC data', 'Gi0/1', 'trunk', '10, 20, 100 (nativ 100)'],
        ['LAP1', 'Fa0/2', 'access', '100'],
        ['PC admin (OOB)', 'Fa0/3', 'access', '99'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer are un WLC simplificat (nu are neapărat toate porturile și interfețele unui WLC real; nu are service port separat în toate versiunile) și nu emulează LAG pe WLC. Pentru LAG și service port complet folosește un WLC virtual (de exemplu Catalyst 9800-CL în CML/EVE-NG, dacă ai imagini). Comenzile nu au fost testate de autorul lecției.
      </Callout>

      <Detailed title="Partea 1 — VLAN-uri și porturi">
        <Step labKey={L} n={1} title="Creează VLAN-urile">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# vlan 10
SW1(config-vlan)# name CORP
SW1(config-vlan)# vlan 20
SW1(config-vlan)# name VOICE
SW1(config-vlan)# vlan 99
SW1(config-vlan)# name OOB
SW1(config-vlan)# vlan 100
SW1(config-vlan)# name MGMT
SW1(config-vlan)# exit`} explain={[
            ['vlan …', 'VLAN-urile pe care le va folosi WLC-ul (management 100, clienți 10/20) și VLAN-ul OOB 99.'],
          ]} />
        </Step>
        <Step labKey={L} n={2} title="Portul AP-ului (access)">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# interface fa0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 100
SW1(config-if)# spanning-tree portfast`} explain={[
            ['access 100', 'AP Local: doar VLAN-ul de management al AP-ului.'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Portul WLC-ului (trunk) și service/OOB">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# interface gi0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 100
SW1(config-if)# switchport trunk allowed vlan 10,20,100
SW1(config)# interface fa0/3
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 99`} explain={[
            ['trunk allowed 10,20,100', 'VLAN-urile interfețelor WLC-ului.'],
            ['fa0/3 access 99', 'Portul OOB: acces de administrare, separat de rețeaua de date.'],
          ]} />
          <Reveal label="Întrebare: de ce nu face trunk și service port-ul?"><p>Service port-ul este o interfață de management out-of-band, cu o singură adresă într-o subrețea; nu transportă VLAN-uri multiple și trebuie să funcționeze chiar dacă porturile de date au o problemă, deci stă într-un VLAN separat, ca port access.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — verificare">
        <Step labKey={L} n={4} title="Verifică portul trunk și AP-ul">
          <CodeBlock title="SW1" kind="session" code={`SW1# show interfaces trunk
SW1# show interfaces status
SW1# show vlan brief
SW1# show mac address-table interface fa0/2`} explain={[
            ['show interfaces trunk', 'Gi0/1 trunking, native 100, allowed 10,20,100 — și „VLANs in spanning tree forwarding”.'],
            ['show mac address-table interface fa0/2', 'MAC-ul AP-ului, în VLAN 100, după ce a pornit.'],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="AP-ul și WLC-ul">
          <p>Verifică ca LAP1 să primească IP (DHCP) și să apară în lista AP-urilor WLC-ului. Dacă nu: parcurge lista din tema 2.6.</p>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — erori provocate">
        <Step labKey={L} n={6} title="VLAN nepermis pe trunk">
          <p>Scoate VLAN 10 din <code>allowed vlan</code> pe Gi0/1 (<code>switchport trunk allowed vlan remove 10</code>). Conectează un client la un WLAN mapat pe VLAN 10. Ce observi?</p>
          <Reveal label="Răspuns"><p>Clientul se asociază la SSID, dar nu primește IP: cadrele din VLAN 10 nu trec prin trunk. Repune VLAN 10 cu <code>add 10</code>.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Native VLAN greșit">
          <p>Schimbă <code>native vlan</code> pe switch la 1 (WLC-ul păstrează managementul în VLAN 100 untagged). Ce se întâmplă cu accesul la WLC?</p>
          <Reveal label="Răspuns"><p>Se rupe: cadrele de management untagged ajung în VLAN 1 pe switch, nu în 100. În log apare un mesaj de native VLAN mismatch dacă CDP e activ (2.3). Remediază cu native 100 pe trunk.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Service port pe trunk">
          <Reveal label="Întrebare"><p>Ce probleme ar apărea dacă ai pune service port-ul pe un port trunk?</p></Reveal>
          <Reveal label="Răspuns"><p>Service port-ul nu etichetează trafic; cadrele lui ar intra în VLAN-ul nativ al trunk-ului și ar amesteca rețeaua OOB cu cea de date. Se păstrează ca access, într-un VLAN OOB.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — LAG
   ====================================================================== */
export function SoloLab() {
  const L = 't27s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.7-S" title="Lab solo — LAG static între WLC și switch, AP FlexConnect" />
      <Summary>
        <p><b>Cerință:</b> un WLC cu 4 porturi de date într-un <G id="lag" /> către SW-D; trunk pe port-channel (VLAN 10, 20, 30, 100; nativ 100); un AP FlexConnect pe port trunk (nativ 100, VLAN 10, 20 permise). Scrie configurația switch-ului, apoi compar-o cu soluția.
          <br /><b>Timp estimat:</b> 25–35 min · <b>Unealtă:</b> Packet Tracer (switch) + WLC virtual dacă ai · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="WLC cu LAG de 4 porturi spre SW-D; AP FlexConnect.">
        <LabSoloTopology27 />
      </Figure>
      <Detailed title="Cerințe și soluție">
        <ol>
          <li>Creează VLAN-urile 10, 20, 30, 100 pe SW-D.</li>
          <li>Pe Gi1/0/1–4: canal static spre WLC; port-channel trunk, nativ 100, allowed 10,20,30,100.</li>
          <li>Pe Gi1/0/11: trunk pentru AP-ul FlexConnect (nativ 100, allowed 100,10,20).</li>
          <li>Verifică <code>show etherchannel summary</code> și <code>show interfaces trunk</code>.</li>
          <li>Explică: de ce nu folosești <code>mode active</code>? Ce se întâmplă dacă un cablu al LAG merge la alt switch?</li>
        </ol>
        <Step labKey={L} n={1} title="Rezolvă și compară">
          <Reveal label="Soluție (ilustrativ)">
            <CodeBlock title="SW-D" kind="config" code={`interface range gi1/0/1 - 4
 channel-group 1 mode on
interface port-channel 1
 switchport mode trunk
 switchport trunk native vlan 100
 switchport trunk allowed vlan 10,20,30,100
interface gi1/0/11
 switchport mode trunk
 switchport trunk native vlan 100
 switchport trunk allowed vlan 100,10,20`} explain={[
              ['channel-group 1 mode on', 'Static, pentru că WLC-ul AireOS nu negociază LACP/PAgP.'],
              ['port-channel trunk', 'Politica de trunk se aplică pe port-channel.'],
              ['Gi1/0/11 trunk', 'AP-ul FlexConnect cu local switching.'],
            ]} />
          </Reveal>
          <Reveal label="Răspunsuri la întrebări"><p><b>Active:</b> WLC-ul AireOS nu înțelege LACPDU, canalul nu s-ar forma. <b>Alt switch:</b> LAG-ul cere toate porturile spre același switch (sau o stivă); cu switch-uri diferite se folosesc porturi independente, ca trunk-uri separate.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
