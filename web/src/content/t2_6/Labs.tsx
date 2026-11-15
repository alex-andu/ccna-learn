import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step, P } from '../../components/LabStep';
import { LabGuidedTopology26, LabSoloTopology26 } from '../../diagrams/t2_6';

/* ======================================================================
   LAB GHIDAT — AP lightweight care se alătură unui WLC
   ====================================================================== */
export function GuidedLab() {
  const L = 't26g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.6-G" title="Lab ghidat — un AP lightweight se alătură unui WLC (CAPWAP)" />
      <Summary>
        <p><b>Obiectiv:</b> construiești o mică rețea cu un WLC, un switch, un server DHCP și un <G id="lightweight-ap" />; observi cum AP-ul își ia IP, găsește <G id="wlc" /> și se alătură; apoi schimbi modul AP-ului și constați efectul. În Packet Tracer laboratorul este simplificat; partea reală (CAPWAP, DTLS) nu se vede, dar fluxul logic da.
          <br /><b>Timp estimat:</b> 40–60 min · <b>Unealtă:</b> Cisco Packet Tracer (WLC-PT, LAP-PT, switch 2960, server DHCP, laptop wireless) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: WLC și server DHCP legate la SW1; LAP1 pe SW1; laptop wireless în raza lui LAP1.">
        <LabGuidedTopology26 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Observații']} rows={[
        ['WLC', 'Management', '192.168.100.10 /24', 'VLAN 100 (trunk spre SW1)'],
        ['Server DHCP', 'Fa0', '192.168.100.2 /24', 'Pool pentru AP-uri: 192.168.100.20–.100'],
        ['SW1', 'VLAN 100', '192.168.100.3 /24', 'Gi0/1 WLC (trunk), Fa0/2 LAP1 (access VLAN 100), Fa0/3 server'],
        ['LAP1', 'Ethernet', 'DHCP', 'Primește IP din pool'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer include <b>WLC-PT</b> și <b>LAP-PT</b>, cu o interfață web simplificată; nu simulează DTLS, RRM sau toate modurile AP (de exemplu Monitor/Sniffer). Disponibilitatea exactă a funcțiilor (FlexConnect, option 43) depinde de versiunea PT, deci unii pași sunt „de observat”, nu „de rulat”. Pentru FlexConnect, Monitor, Sniffer ai nevoie de un WLC real sau virtual (de exemplu CML/Catalyst 9800-CL). Comenzile nu au fost testate de autorul lecției în versiunea ta.
      </Callout>

      <Detailed title="Partea 1 — pregătirea rețelei">
        <Step labKey={L} n={1} title="Cablaj și VLAN">
          <p>Conectează WLC-ul la SW1 Gi0/1, serverul DHCP la Fa0/3, LAP1 la Fa0/2. Creează VLAN 100 și pune porturile în el (access), apoi adresează SVI-ul.</p>
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# vlan 100
SW1(config-vlan)# exit
SW1(config)# interface range fa0/2 - 3
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 100
SW1(config-if-range)# exit
SW1(config)# interface gi0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 100
SW1(config)# interface vlan 100
SW1(config-if)# ip address 192.168.100.3 255.255.255.0
SW1(config-if)# no shutdown`} explain={[
            ['access VLAN 100', 'În laboratorul simplificat WLC-ul este într-un singur VLAN; în rețele reale portul WLC este trunk (2.7).'],
          ]} />
        </Step>
        <Step labKey={L} n={2} title="Server DHCP">
          <p>Pe server: <P>Services → DHCP</P>, pool „LAP”, gateway 192.168.100.3, start 192.168.100.20, mască 255.255.255.0; dacă PT permite, completează câmpul „WLC Address” (corespunde option 43) cu 192.168.100.10.</p>
        </Step>
        <Step labKey={L} n={3} title="IP-ul WLC-ului">
          <p>În interfața WLC-ului (<P>Config → Interface</P> sau GUI) setează adresa de management 192.168.100.10/24, gateway 192.168.100.3.</p>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — AP-ul se alătură">
        <Step labKey={L} n={4} title="Pornește AP-ul și observă">
          <p>Alimentează LAP1 (PoE sau adaptor). Urmărește: primește IP? Apare în lista WLC-ului?</p>
          <Reveal label="Ce ar trebui să vezi"><p>LAP1 primește o adresă din 192.168.100.20+ și apare în lista de AP-uri a WLC-ului după câteva zeci de secunde. Corespunde pașilor 1–6 din diagrama de join.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Răspunde: în ce pas poate eșua?">
          <Reveal label="Întrebare"><p>Dacă scoți gateway-ul din pool sau pui AP-ul în alt VLAN, ce observi? La ce pas din procesul de join eșuează?</p></Reveal>
          <Reveal label="Răspuns"><p>Fără IP/gateway AP-ul nu ajunge la WLC (pasul 1–2); în alt VLAN nu primește IP (pasul 1). Rezolvarea: VLAN-ul și DHCP-ul corecte.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Crează un WLAN și conectează un client">
          <p>Pe WLC creează un WLAN „LAB” (securitate: WPA2-PSK, parola de laborator) și conectează laptopul wireless la SSID. (Pașii exacți sunt tema 2.9.)</p>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — moduri (dacă platforma le suportă)">
        <Step labKey={L} n={7} title="Schimbă modul AP">
          <p>Pe un WLC real sau virtual, mută LAP1 din Local în Monitor: <code>config ap mode monitor LAP1</code> (AireOS) sau din GUI, la AP → General → AP Mode. Verifică dacă laptopul mai poate folosi SSID-ul.</p>
          <Reveal label="Răspuns"><p>Nu: în Monitor AP-ul nu servește clienți. Revino la Local și clientul se reasociază.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="FlexConnect — de gândit">
          <Reveal label="Întrebare"><p>De ce un AP FlexConnect cere port trunk, iar unul Local port access? Ce se întâmplă cu clienții dacă WLC-ul cade în fiecare mod?</p></Reveal>
          <Reveal label="Răspuns"><p>FlexConnect termină local VLAN-urile clienților (local switching) ⇒ trunk cu acele VLAN-uri. Local trimite totul în CAPWAP printr-un singur VLAN ⇒ access. La căderea WLC-ului, Flex continuă să servească clienții (standalone), Local nu.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — alegerea arhitecturii
   ====================================================================== */
export function SoloLab() {
  const L = 't26s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.6-S" title="Lab solo — alege arhitectura și modurile AP pentru trei locații" />
      <Summary>
        <p><b>Cerință:</b> pentru fiecare locație din figură alege arhitectura (autonomous, lightweight + WLC, cloud-based, embedded) și modul AP, argumentat. Apoi fă o schiță a conexiunilor (porturi access/trunk, unde stă WLC-ul). Este un exercițiu de proiectare; nu necesită simulator.
          <br /><b>Timp estimat:</b> 25–35 min · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Trei locații cu cerințe diferite.">
        <LabSoloTopology26 />
      </Figure>
      <Detailed title="Cerințe și soluție">
        <ol>
          <li>Sediu central: 200 AP, roaming între clădiri, politici de securitate unitare.</li>
          <li>Sucursală: 8 AP, legătură WAN cu latență mare spre sediu, trebuie să funcționeze și dacă WAN cade.</li>
          <li>Magazin mic: 2 AP, fără personal IT, administrare de la distanță.</li>
          <li>Propune, pentru fiecare, arhitectura, modul AP și motivele.</li>
        </ol>
        <Step labKey={L} n={1} title="Propune și compară">
          <Reveal label="Soluție de referință">
            <Table head={['Locație', 'Arhitectură', 'Mod AP', 'Motiv']} hlCol={0} rows={[
              ['Sediu central', 'Lightweight + WLC (redundant)', 'Local', 'Scară mare, RRM, roaming, politici centralizate; LAN rapid ⇒ central switching'],
              ['Sucursală', 'Lightweight cu WLC la sediu', 'FlexConnect', 'WAN lent: local switching și autonomie la căderea WAN; alternativ controller embedded local'],
              ['Magazin mic', 'Cloud-based (Meraki)', '—', 'Fără IT local, zero-touch, management centralizat din cloud'],
            ]} />
          </Reveal>
          <Reveal label="De reflectat"><p>Ce se schimbă dacă magazinul are 40 de AP și acces Internet nesigur? Ce se întâmplă cu un AP Local la sucursală dacă WAN cade? Ce port de switch folosești pentru AP-urile FlexConnect?</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
