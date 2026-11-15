import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology24, LabSoloTopology24 } from '../../diagrams/t2_4';

/* ======================================================================
   LAB GHIDAT — EtherChannel LACP L2 + L3
   ====================================================================== */
export function GuidedLab() {
  const L = 't24g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.4-G" title="Lab ghidat — EtherChannel LACP (L2 trunk și L3)" />
      <Summary>
        <p><b>Obiectiv:</b> vezi întâi că STP blochează un link dintre două cablate paralel, apoi creezi un <G id="etherchannel" /> cu <G id="lacp" /> și constați că ambele linkuri sunt folosite; verifici cu <code>show etherchannel summary</code>, provoci și repari o nepotrivire, apoi (opțional) faci varianta L3.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (2 × Switch 2960 pentru partea L2; 2 × Switch 3560/3650 pentru partea L3, 2 PC-uri); merge în GNS3/CML cu imagini de switch L2/L3 · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologia: SW1 și SW2 legate cu două cabluri paralele (Gi0/1, Gi0/2); câte un PC în VLAN 10 pe fiecare.">
        <LabGuidedTopology24 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă / VLAN', 'Conectat la']} rows={[
        ['SW1', 'Gi0/1, Gi0/2', 'Po1 (trunk)', 'SW2 Gi0/1, Gi0/2'],
        ['SW1', 'Fa0/3', 'access VLAN 10', 'PC1'],
        ['SW2', 'Fa0/3', 'access VLAN 10', 'PC2'],
        ['PC1', 'FastEthernet0', '192.168.10.1 /24', 'SW1 Fa0/3'],
        ['PC2', 'FastEthernet0', '192.168.10.2 /24', 'SW2 Fa0/3'],
        ['SW-D1 ⟷ SW-D2 (L3)', 'Gi1/0/1-2 → Po2', '10.0.0.1 / 10.0.0.2 /30', 'între ele'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer suportă EtherChannel (LACP, PAgP, on) pe switch-urile 2960 și 3560, dar <b>formatul output-urilor</b>, disponibilitatea unor comenzi (<code>show lacp neighbor</code>) și a opțiunilor de load-balance diferă de IOS real; adaptează după ce vezi. Pentru L3 ai nevoie de switch multilayer (3560/3650). Comenzile nu au fost testate de autorul lecției pe versiunea ta.
      </Callout>

      <Detailed title="Partea 1 — linkuri paralele fără EtherChannel (STP)">
        <Step labKey={L} n={1} title="Cablaj și VLAN">
          <p>Conectează Gi0/1–Gi0/1 și Gi0/2–Gi0/2 între SW1 și SW2. Creează VLAN 10 pe ambele, pune Fa0/3 în VLAN 10 și configurează PC-urile.</p>
          <CodeBlock title="SW1 (SW2 la fel)" kind="config" code={`SW1(config)# vlan 10
SW1(config-vlan)# exit
SW1(config)# interface fa0/3
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# exit
SW1(config)# interface range gi0/1 - 2
SW1(config-if-range)# switchport mode trunk`} explain={[
            ['switchport mode trunk', 'Pe ambele linkuri. Dacă switch-ul cere, adaugă înainte switchport trunk encapsulation dot1q.'],
          ]} />
        </Step>
        <Step labKey={L} n={2} title="Observă blocajul STP">
          <CodeBlock title="SW2" kind="session" code={`SW2# show spanning-tree vlan 1`} explain={[
            ['interpretare', 'Un port Gi0/1 sau Gi0/2 apare în stare blocată (BLK / Altn). Un cablu este doar rezervă.']
          ]} />
          <Reveal label="Întrebare: câtă bandă folosești între SW1 și SW2?"><p>Doar cea a unui link (1 Gbps / 100 Mbps în PT): celălalt este blocat de STP. De aici motivația EtherChannel.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — EtherChannel LACP L2">
        <Step labKey={L} n={3} title="Pregătește membrii și creează canalul">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# interface range gi0/1 - 2
SW1(config-if-range)# shutdown
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# exit
SW1(config)# interface port-channel 1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan 10
SW1(config-if)# exit
SW1(config)# interface range gi0/1 - 2
SW1(config-if-range)# no shutdown`} explain={[
            ['channel-group 1 mode active', 'LACP activ pe ambii membri.'],
            ['shutdown / no shutdown', 'Evită stări intermediare în timpul configurării.'],
          ]} />
        </Step>
        <Step labKey={L} n={4} title="Configurează SW2 (passive)">
          <CodeBlock title="SW2" kind="config" code={`SW2(config)# interface range gi0/1 - 2
SW2(config-if-range)# channel-group 1 mode passive
SW2(config-if-range)# exit
SW2(config)# interface port-channel 1
SW2(config-if)# switchport mode trunk
SW2(config-if)# switchport trunk allowed vlan 10`} explain={[
            ['mode passive', 'SW2 acceptă negocierea lansată de SW1 (active).'],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="Verifică">
          <CodeBlock title="SW1 și SW2" kind="session" code={`SW1# show etherchannel summary
SW1# show etherchannel port-channel
SW1# show interfaces trunk
SW1# show spanning-tree vlan 10`} explain={[
            ['summary', 'Așteptat: Po1(SU), protocol LACP, Gi0/1(P) Gi0/2(P).'],
            ['spanning-tree', 'Po1 apare ca singur port în forwarding; niciun membru blocat.'],
            ['ping', 'PC1 → PC2 (192.168.10.2) trebuie să funcționeze.'],
          ]} />
          <Reveal label="Dacă vezi Po1(SD) sau (I)/(s)"><p>Verifică modurile (nu passive + passive), că porturile au același mod trunk/VLAN și viteza/duplexul; după corecție, shutdown/no shutdown pe Po1.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Test de redundanță">
          <p>Pornește un <code>ping -t</code> de la PC1 la PC2. Apoi pe SW1 dă <code>shutdown</code> pe Gi0/1 și urmărește: cât se pierde? Ce arată acum <code>show etherchannel summary</code>?</p>
          <Reveal label="Răspuns"><p>Ping-ul continuă (cel mult 1–2 pachete pierdute); Po1 rămâne (SU) cu un singur membru (P), iar Gi0/1 apare (D). Fără reconvergență STP. Repornește portul cu <code>no shutdown</code>.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — defecte provocate">
        <Step labKey={L} n={7} title="Moduri incompatibile">
          <p>Schimbă SW2 la <code>mode passive</code> și SW1 tot la <code>passive</code> (<code>no channel-group</code> apoi din nou, fiecare cu passive). Ce se întâmplă? Apoi încearcă <code>active</code> pe SW1 și <code>desirable</code> pe SW2.</p>
          <Reveal label="Soluție"><p>Passive + passive: nu se formează (membrii (I) sau (s)). Active + desirable: LACP ≠ PAgP, nu se formează (în unele versiuni switch-ul refuză mixarea). Revino la active/passive.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Nepotrivire de configurare pe un membru">
          <p>Pe SW1, pune doar Gi0/2 în <code>switchport access vlan 10</code> / <code>switchport mode access</code>, direct pe port. Observă <code>show etherchannel summary</code> și mesajele din consolă.</p>
          <Reveal label="Soluție"><p>Membrul nepotrivit este suspendat sau exclus ((s) / (I)); se corectează aplicând configurația pe <code>interface port-channel 1</code> și readucând portul la mod trunk.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 4 (opțional) — EtherChannel L3">
        <Step labKey={L} n={9} title="Canal rutat între două switch-uri multilayer">
          <CodeBlock title="SW-D1 (SW-D2 cu 10.0.0.2)" kind="config" code={`SW-D1(config)# ip routing
SW-D1(config)# interface range gi1/0/1 - 2
SW-D1(config-if-range)# no switchport
SW-D1(config-if-range)# channel-group 2 mode active
SW-D1(config-if-range)# exit
SW-D1(config)# interface port-channel 2
SW-D1(config-if)# no switchport
SW-D1(config-if)# ip address 10.0.0.1 255.255.255.252`} explain={[
            ['no switchport', 'Pe membri și pe Po: port rutat. IP doar pe Po.'],
          ]} />
          <Reveal label="Verificare"><p><code>show etherchannel summary</code> ⇒ <code>Po2(RU)</code> cu membrii (P); <code>ping 10.0.0.2</code> reușește. În Packet Tracer, numele porturilor (Gi0/1, Gi0/2) diferă de cele de mai sus.</p></Reveal>
        </Step>
        <Step labKey={L} n={10} title="Load balancing">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# port-channel load-balance src-dst-ip
SW1(config)# end
SW1# show etherchannel load-balance`} explain={[
            ['load-balance', 'Setare globală; afișează metoda activă.'],
          ]} />
        </Step>
      </Detailed>
      <Callout kind="tip" title="GNS3 / CML">
        Imaginile vIOS-L2 / IOSvL2 suportă EtherChannel LACP și PAgP; <code>show lacp neighbor</code> este disponibil. Perfect pentru partea 3.
      </Callout>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't24s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.4-S" title="Lab solo — două EtherChannel-uri (LACP și PAgP) cu trunk" />
      <Summary>
        <p><b>Cerință:</b> SW-A ⟷ SW-B cu <b>LACP</b> (Po1, 2 linkuri) și SW-B ⟷ SW-C cu <b>PAgP</b> (Po2, 2 linkuri). Ambele trunk, VLAN-uri 10, 20, native 99. Rezolvi singur, apoi verifici cu soluția.
          <br /><b>Timp estimat:</b> 30–45 min · <b>Unealtă:</b> Packet Tracer sau GNS3/CML · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: trei switch-uri, două canale diferite.">
        <LabSoloTopology24 />
      </Figure>
      <Detailed title="Cerințe">
        <ol>
          <li>Creează VLAN 10, 20 și 99 pe toate switch-urile.</li>
          <li>SW-A ⟷ SW-B (Gi0/1–2): <b>LACP</b>, SW-A active, SW-B passive, trunk, native 99, allowed 10,20,99.</li>
          <li>SW-B ⟷ SW-C (Gi0/3–4): <b>PAgP</b>, SW-B desirable, SW-C auto, aceeași politică de trunk.</li>
          <li>Setează <code>load-balance src-dst-ip</code> pe SW-B.</li>
          <li>Verifică: ambele canale (SU) cu (P); un host din VLAN 10 de pe SW-A comunică cu unul de pe SW-C.</li>
          <li>Provoacă și repară: schimbă SW-C la <code>auto</code> și SW-B la <code>auto</code>; apoi la <code>on</code> pe un singur capăt. Notează simptomele.</li>
        </ol>
        <Step labKey={L} n={1} title="Configurează și verifică">
          <Reveal label="Soluție completă (ilustrativ)">
            <CodeBlock title="SW-A / SW-B / SW-C" kind="config" code={`! SW-A
interface range gi0/1 - 2
 channel-group 1 mode active
interface port-channel 1
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99

! SW-B
interface range gi0/1 - 2
 channel-group 1 mode passive
interface range gi0/3 - 4
 channel-group 2 mode desirable
interface range port-channel 1 - 2
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
port-channel load-balance src-dst-ip

! SW-C
interface range gi0/3 - 4
 channel-group 2 mode auto
interface port-channel 2
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99`} explain={[
              ['LACP între A și B', 'active ⟷ passive.'],
              ['PAgP între B și C', 'desirable ⟷ auto.'],
              ['interface range port-channel 1 - 2', 'Aplică aceeași politică de trunk ambelor canale (unde platforma permite range pe Po).'],
            ]} />
          </Reveal>
          <Reveal label="Ce observi la defecte"><p>auto + auto: Po2 nu se formează, membrii (I). on pe un capăt, desirable pe celălalt: nu se formează; capătul „on” poate genera mesaje de loop/MAC flapping. Corectezi modurile și faci shutdown/no shutdown pe Po2.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
