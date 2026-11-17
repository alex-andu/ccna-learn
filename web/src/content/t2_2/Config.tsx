import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.2" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 2.2 este de tip <b>Configure and verify</b>. Mai jos: un trunk între două switch-uri, citirea lui <code>show interfaces trunk</code>, controlul VLAN-urilor permise, schimbarea native VLAN-ului, DTP și depanarea celor mai frecvente defecte.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, reconstruite după formatele documentate, cu nume și adrese fictive; nu au fost capturate de pe echipamente reale. Comenzile din acest topic <b>nu au fost testate</b> de autorul lecției pe echipamente. Formatul exact, mesajele de log și comportamentul implicit al DTP diferă între platforme și versiuni; verifică cu <code>?</code> și cu <code>show interfaces … switchport</code> pe echipamentul tău.
      </Callout>

      <Detailed title="Exemplul 1 — Trunk între două switch-uri">
        <p>Scenariu: SW1 Gi0/1 ↔ SW2 Gi0/1; VLAN-urile 10 și 20 există pe ambele switch-uri; native VLAN 99 (neutilizat de hosturi).</p>
        <CodeBlock title="SW1 și SW2 (aceeași configurație pe Gi0/1)" kind="config" code={`SW1(config)# vlan 10
SW1(config-vlan)# vlan 20
SW1(config-vlan)# vlan 99
SW1(config-vlan)# name NATIVE
SW1(config-vlan)# exit
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# switchport trunk encapsulation dot1q
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,20,99
SW1(config-if)# switchport nonegotiate
SW1(config-if)# end`} explain={[
          ['vlan 10 / 20 / 99', 'VLAN-urile trebuie să existe pe fiecare switch; altfel traficul lor nu trece prin trunk.'],
          ['switchport trunk encapsulation dot1q', 'Necesar doar pe platformele care suportă și ISL (de exemplu 3560); pe 2960 comanda nu există. Se dă înainte de mode trunk.'],
          ['switchport mode trunk', 'Portul devine trunk indiferent de vecin (și trimite DTP, dacă nu e oprit).'],
          ['switchport trunk native vlan 99', 'VLAN-ul nativ; trebuie să fie 99 și pe SW2.'],
          ['switchport trunk allowed vlan 10,20,99', 'Lista permisă. Atenție: înlocuiește lista veche.'],
          ['switchport nonegotiate', 'Oprește DTP; potrivit când ambele capete sunt setate explicit trunk.'],
        ]} />
        <CodeBlock title="SW1 — show interfaces trunk (ilustrativ)" kind="session" code={`SW1# show interfaces trunk

Port        Mode         Encapsulation  Status        Native vlan
Gi0/1       on           802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/1       10,20,99

Port        Vlans allowed and active in management domain
Gi0/1       10,20,99

Port        Vlans in spanning tree forwarding state and not pruned
Gi0/1       10,20,99`} explain={[
          ['Mode: on', 'Trunk forțat (switchport mode trunk). Pentru porturile dinamice apar „desirable” sau „auto”, iar la Encapsulation poate apărea „n-802.1q” (negociat).'],
          ['Encapsulation 802.1q · Status trunking', 'Formatul de tag și starea: portul este trunk operațional.'],
          ['Native vlan 99', 'Trebuie să fie identic pe celălalt switch.'],
          ['Vlans allowed on trunk', 'Ce permite configurația (implicit 1–4094).'],
          ['… allowed and active in management domain', 'Dintre cele permise, cele care există pe switch. Dacă lipsește un VLAN, nu a fost creat aici.'],
          ['… forwarding state and not pruned', 'VLAN-urile care trec efectiv acum (STP în forwarding). Dacă lipsește unul, STP îl blochează pe acest trunk.'],
        ]} />
        <CodeBlock title="SW1 — show interfaces gi0/1 switchport (extras, ilustrativ)" kind="session" code={`SW1# show interfaces gi0/1 switchport
Name: Gi0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 99 (NATIVE)
Trunking VLANs Enabled: 10,20,99`} explain={[
          ['Administrative vs Operational Mode', 'Administrativ = ce ai configurat; operațional = ce face portul acum. Pentru DTP se pot deosebi.'],
          ['Negotiation of Trunking: Off', 'Efect al lui switchport nonegotiate.'],
          ['Trunking Native Mode VLAN: 99', 'Native VLAN-ul operațional.'],
          ['Trunking VLANs Enabled', 'Lista allowed.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Gestionarea listei de VLAN-uri permise">
        <CodeBlock title="SW1 — modificări corecte și greșite" kind="config" code={`SW1(config-if)# switchport trunk allowed vlan add 30
SW1(config-if)# switchport trunk allowed vlan remove 20
SW1(config-if)# switchport trunk allowed vlan 30`} explain={[
          ['allowed vlan add 30', 'Adaugă VLAN 30; lista devine 10,20,30,99.'],
          ['allowed vlan remove 20', 'Scoate VLAN 20; lista devine 10,30,99.'],
          ['allowed vlan 30', 'GREȘEALĂ frecventă: înlocuiește TOATĂ lista cu doar VLAN 30. VLAN-urile 10, 99 etc. nu mai trec.'],
        ]} />
        <p>Verificare după orice modificare: <code>show interfaces trunk</code> și un ping între două hosturi din VLAN-uri afectate. Restabilirea: <code>switchport trunk allowed vlan 10,20,30,99</code> sau <code>… allowed vlan all</code>.</p>
      </Detailed>

      <Detailed title="Exemplul 3 — DTP: ce rezultă din moduri">
        <Table head={['SW1', 'SW2', 'Rezultat']} hlCol={2} rows={[
          ['dynamic auto', 'dynamic auto', <b>access</b>],
          ['dynamic auto', 'dynamic desirable', 'trunk'],
          ['dynamic desirable', 'dynamic desirable', 'trunk'],
          ['trunk', 'dynamic auto', 'trunk'],
          ['trunk', 'dynamic desirable', 'trunk'],
          ['trunk', 'access', <b>mismatch</b>],
          ['access', 'dynamic desirable', 'access'],
        ]} />
        <CodeBlock title="Verificare DTP (ilustrativ)" kind="session" code={`SW1# show interfaces gi0/1 switchport | include Mode|Negotiation
Administrative Mode: dynamic auto
Operational Mode: static access
Negotiation of Trunking: On

SW1(config)# interface gi0/1
SW1(config-if)# switchport mode dynamic desirable`} explain={[
          ['Administrative Mode: dynamic auto / Operational Mode: static access', 'Portul e configurat dynamic auto, dar a rămas access, pentru că vecinul e și el auto (nimeni nu cere trunk).'],
          ['Negotiation of Trunking: On', 'DTP e activ pe port.'],
          ['switchport mode dynamic desirable', 'Un capăt activ face ca negocierea să producă trunk.'],
        ]} />
        <Callout kind="tip" title="Pe un port spre utilizator">
          <code>switchport mode access</code> + (opțional) <code>switchport nonegotiate</code> în loc să lași modul dinamic: un atacator care conectează un switch nu poate negocia un trunk.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 4 — Native VLAN mismatch: simptom și remediere">
        <CodeBlock title="Log pe SW1 (ilustrativ)" kind="session" code={`*Mar 1 00:12:44.321: %CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (1), with SW2 GigabitEthernet0/1 (99).`} explain={[
          ['%CDP-4-NATIVE_VLAN_MISMATCH', 'CDP a observat native VLAN diferit între cele două capete.'],
          ['GigabitEthernet0/1 (1), with SW2 GigabitEthernet0/1 (99)', 'Local native = 1, vecin = 99.'],
        ]} />
        <CodeBlock title="Diagnostic și remediere" kind="session" code={`SW1# show interfaces trunk | include Native|Gi0/1
SW2# show interfaces trunk | include Native|Gi0/1

SW1(config)# interface gi0/1
SW1(config-if)# switchport trunk native vlan 99`} explain={[
          ['show interfaces trunk (pe ambele)', 'Compari coloana „Native vlan” a lui Gi0/1.'],
          ['switchport trunk native vlan 99', 'Aliniază SW1 cu SW2. Fă schimbarea pe ambele capete în aceeași fereastră de mentenanță, pentru a limita perioada de nepotrivire.'],
        ]} />
        <CodeBlock title="Router-on-a-stick cu native ≠ 1" kind="config" code={`R1(config)# interface gigabitEthernet 0/0.99
R1(config-subif)# encapsulation dot1Q 99 native
R1(config-subif)# ip address 10.99.0.1 255.255.255.0`} explain={[
          ['encapsulation dot1Q 99 native', 'Subinterfața primește cadrele netaggate ale VLAN-ului nativ 99 și trimite cadrele lui fără tag.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — Defecte tipice la trunk">
        <Table head={['Simptom', 'Cauză probabilă', 'Verificare / remediere']} hlCol={0} rows={[
          ['Hosturile din același VLAN, pe switch-uri diferite, nu comunică', 'Trunk lipsă: ambele porturi în dynamic auto ⇒ access; sau un capăt access.', <><code>show interfaces trunk</code>; setezi <code>mode trunk</code> pe ambele.</>],
          ['Doar un VLAN nu trece', 'VLAN scos din allowed list sau neexistent pe un switch.', <>Compari listele din <code>show interfaces trunk</code>; <code>vlan N</code> / <code>allowed vlan add N</code>.</>],
          ['Mesaje %CDP-4-NATIVE_VLAN_MISMATCH', 'Native VLAN diferit.', <>Potrivești <code>switchport trunk native vlan</code>.</>],
          ['Trunk „cade” după ce adaugi un VLAN', 'Ai folosit allowed vlan N fără add.', <><code>switchport trunk allowed vlan add …</code> sau relistează toate.</>],
          ['Trunk + access: link neobișnuit', 'Mismatch de mod.', <>Aliniază modurile (<code>mode trunk</code> pe ambele).</>],
          ['Port trunk dispare din show vlan brief', 'Nu e eroare: trunk-urile nu apar acolo.', <><code>show interfaces trunk</code>.</>],
        ]} />
      </Detailed>
    </section>
  );
}
