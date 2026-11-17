import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology46, LabSoloTopology46 } from '../../diagrams/t4_6';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't46g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.6-G" title="Lab ghidat — R1 client DHCP (ISP) și relay pentru LAN" />
      <Summary>
        <p><b>Obiectiv:</b> R1 primește adresă de la ISP (client DHCP) și relayează cererile PC-urilor din LAN către un server DHCP aflat în altă subrețea. <br /><b>Timp estimat:</b> 50–70 min · <b>Unealtă:</b> Cisco Packet Tracer (3 routere sau 2 routere + server, 1 switch, 2 PC-uri) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC1/PC2 – SW1 – R1; R1 spre ISP (client) și spre serverul DHCP (relay).">
        <LabGuidedTopology46 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0 (spre ISP)', 'DHCP (de la ISP)'],
        ['R1', 'Gi0/1 (spre clienți)', '192.168.10.1/24'],
        ['R1', 'Gi0/2 (spre server)', '172.16.0.1/24'],
        ['ISP', 'Gi0/0', '198.51.100.1/24 (server DHCP: pool 198.51.100.0/24)'],
        ['Server DHCP', 'NIC', '172.16.0.10/24, gateway 172.16.0.1'],
        ['PC1, PC2', 'NIC', 'DHCP (relayat)'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer acceptă <code>ip address dhcp</code>, <code>ip helper-address</code> și serviciul DHCP pe Server și pe routere. Unele comenzi de lease (<code>show dhcp lease</code>, <code>renew dhcp</code>) pot lipsi. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Același lab merge în GNS3/CML cu IOSv și un server dnsmasq/ISC.
      </Callout>

      <Detailed title="Partea 0 — Adresare de bază">
        <Step labKey={L} n={1} title="Interfețe statice">
          <p>Configurează Gi0/1 (192.168.10.1/24) și Gi0/2 (172.16.0.1/24) pe R1; serverul 172.16.0.10/24 cu gateway 172.16.0.1. PC1 și PC2 setate pe DHCP (încă nu vor primi nimic). Ping R1 ↔ server.</p>
        </Step>
        <Step labKey={L} n={2} title="Ce se întâmplă fără relay">
          <p>Activează DHCP pe server cu un pool pentru 192.168.10.0/24 (gateway 192.168.10.1, start 192.168.10.10) și pe PC1 cere adresă (DHCP). Ce adresă obține? De ce?</p>
          <Reveal label="Răspuns">
            <p>PC1 rămâne pe <code>169.254.x.x</code> (APIPA): Discover-ul este broadcast, iar R1 nu îl retransmite. Serverul nu l-a văzut niciodată.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Relay">
        <Step labKey={L} n={3} title="Configurează ip helper-address">
          <CodeBlock title="R1" kind="config" code={`R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip helper-address 172.16.0.10`} explain={[
            ['ip helper-address 172.16.0.10', 'Relay către serverul DHCP, pe interfața dinspre clienți.'],
          ]} />
          <p>Reînnoiește adresa pe PC1 (Desktop → IP Configuration → DHCP). Ce adresă primește? Verifică <code>show ip interface g0/1</code>.</p>
          <Reveal label="Răspuns">
            <p>PC1 primește o adresă din 192.168.10.0/24 (de exemplu 192.168.10.10), gateway 192.168.10.1. <code>show ip interface g0/1</code> arată „Helper address is 172.16.0.10”.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Al doilea client și binding-ul">
          <p>Cere DHCP și pe PC2. Ce adrese au PC1 și PC2? Uită-te pe server la lista de leases (în PT: Services → DHCP, sau pe un router IOS <code>show ip dhcp binding</code>).</p>
          <Reveal label="Răspuns">
            <p>Două adrese consecutive din pool (de exemplu .10 și .11), fiecare cu MAC-ul clientului. Dovada că cererile au trecut prin relay.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Greșeala clasică">
          <p>Mută comanda pe Gi0/2 (<code>no ip helper-address</code> pe Gi0/1, <code>ip helper-address 172.16.0.10</code> pe Gi0/2), eliberează adresa pe PC1 și cere din nou. Ce se întâmplă? Apoi repune configurația corectă.</p>
          <Reveal label="Răspuns">
            <p>PC1 revine la 169.254.x.x: broadcast-ul sosește pe Gi0/1, unde nu mai există relay. Comanda de pe Gi0/2 nu are efect asupra clienților din LAN. Repunerea pe Gi0/1 restabilește totul.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Routerul ca client">
        <Step labKey={L} n={6} title="ISP cu pool DHCP">
          <p>Pe routerul ISP: <code>ip dhcp pool WAN</code> cu rețeaua 198.51.100.0/24, default-router 198.51.100.1, și <code>ip dhcp excluded-address 198.51.100.1 198.51.100.9</code>. Gi0/0 al ISP: 198.51.100.1/24.</p>
        </Step>
        <Step labKey={L} n={7} title="R1 cere adresă">
          <CodeBlock title="R1" kind="config" code={`R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip address dhcp
R1(config-if)# no shutdown`} explain={[
            ['ip address dhcp', 'R1 este client DHCP al ISP-ului.'],
          ]} />
          <p>Ce adresă primește Gi0/0? Ce apare în <code>show ip route</code>?</p>
          <Reveal label="Răspuns">
            <p>O adresă din 198.51.100.10–254 (de exemplu .10), cu metoda DHCP în <code>show ip interface brief</code>, și o rută implicită spre 198.51.100.1 cu distanță administrativă mare (de obicei 254).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={8} title="Reflecție">
          <p>Răspunde în scris: (1) De ce nu primește R1 o adresă dacă uiți <code>no shutdown</code>? (2) Ce rol are giaddr? (3) De ce are ruta DHCP o distanță mare?</p>
          <Reveal label="Indicii">
            <p>(1) Interfața e down, nu trimite Discover. (2) Alege pool-ul și arată unde se întoarce răspunsul. (3) Să nu bată o rută statică manuală.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't46s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.6-S" title="Lab solo — clienții rămân pe 169.254.x.x" />
      <Summary>
        <p><b>Scenariu:</b> PC1 și PC2 din 192.168.10.0/24 ar trebui să primească adrese de la serverul 172.16.0.10 prin R1, dar rămân pe 169.254.x.x. Găsește defectul (sau defectele) cu <code>show</code>.
          <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer (1 router, 1 switch, 1 server, 2 PC-uri) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: PC-uri, SW1, R1, server DHCP.">
        <LabSoloTopology46 />
      </Figure>
      <Table head={['Dispozitiv', 'IPv4']} rows={[
        ['R1 Gi0/1', '192.168.10.1/24'],
        ['R1 Gi0/2', '172.16.0.1/24'],
        ['Server DHCP', '172.16.0.10/24, gateway 172.16.0.1'],
      ]} />
      <Callout kind="info" title="Cerințe">
        Pool pentru 192.168.10.0/24 pe server (gateway 192.168.10.1, start 192.168.10.10). Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Configurare corectă">
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# ip helper-address 172.16.0.10
R1(config-if)# no shutdown
R1(config)# interface gigabitEthernet 0/2
R1(config-if)# ip address 172.16.0.1 255.255.255.0
R1(config-if)# no shutdown`} explain={[
              ['ip helper-address 172.16.0.10', 'Pe interfața dinspre clienți, către serverul DHCP.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={2} title="Defectul">
          <p>Se introduce un defect: <code>ip helper-address 172.16.0.10</code> este pe <b>Gi0/2</b>, nu pe Gi0/1. Cu <code>show ip interface g0/1</code> și <code>show ip interface g0/2</code>, cum îl găsești? Care e remedierea?</p>
          <Reveal label="Cauza și remedierea">
            <p><code>show ip interface g0/1</code> nu arată „Helper address”, iar g0/2 îl arată. Broadcast-ul clientului sosește pe Gi0/1, unde nu există relay. Remediere: <code>no ip helper-address</code> pe Gi0/2 și <code>ip helper-address 172.16.0.10</code> pe Gi0/1.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Defectul al doilea">
          <p>După remediere, PC-urile tot nu primesc adrese. Pool-ul de pe server este pentru <code>192.168.1.0/24</code>. Ce observi? Ce modifici?</p>
          <Reveal label="Cauza și remedierea">
            <p>giaddr = 192.168.10.1 nu aparține niciunui pool (pool-ul e pentru 192.168.1.0/24), deci serverul nu poate oferi adresă. Remediere: pool pentru 192.168.10.0/24 (gateway 192.168.10.1). Verifică apoi cu <code>show ip dhcp binding</code> (sau lista de leases a serverului).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Cere DHCP pe ambele PC-uri. Ce adrese au? Ce comenzi demonstrează că relay-ul și serverul funcționează?</p>
          <Reveal label="Răspuns">
            <p>Adrese din 192.168.10.10+ cu gateway 192.168.10.1. <code>show ip interface g0/1</code> (Helper address), <code>show ip dhcp binding</code> pe server, ping între PC și gateway.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
