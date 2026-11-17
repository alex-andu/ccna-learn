import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology43, LabSoloTopology43 } from '../../diagrams/t4_3';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't43g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.3-G" title="Lab ghidat — server DHCP pe router și DNS pe un server" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi R1 ca server DHCP, observi DORA în Simulation Mode, apoi folosești un server DNS (în PT, serverul web) ca PC-urile să acceseze un site după nume. <br /><b>Timp estimat:</b> 50–70 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router 2911, 1 × switch 2960, 2 × PC, 1 × server) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: R1 (DHCP), SW1, PC1 și PC2 (clienți DHCP), serverul web cu IP static.">
        <LabGuidedTopology43 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4', 'Observații']} rows={[
        ['R1', 'Gi0/0', '192.168.1.1/24', 'server DHCP'],
        ['Server', 'NIC', '192.168.1.10/24 · gw 192.168.1.1', 'IP static; servicii DNS și HTTP active'],
        ['PC1, PC2', 'NIC', 'DHCP', 'clienți'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer oferă pe Server serviciile <i>DHCP</i>, <i>DNS</i> și <i>HTTP</i> (tab-ul Services). Formatul comenzilor <code>show ip dhcp …</code> poate diferi. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Același scenariu merge în GNS3/CML cu un Linux în loc de Server.
      </Callout>

      <Detailed title="Partea 1 — DHCP pe router">
        <Step labKey={L} n={1} title="Adresare statică și pool">
          <p>Configurează Gi0/0 pe R1 și setează pe Server adresa statică. Apoi creează pool-ul DHCP pentru 192.168.1.0/24, excluzând .1–.10 și oferind gateway-ul 192.168.1.1 și DNS 192.168.1.10.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10
R1(config)# ip dhcp pool LAN
R1(dhcp-config)# network 192.168.1.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.1.1
R1(dhcp-config)# dns-server 192.168.1.10`} explain={[
              ['ip dhcp excluded-address …', 'Protejează adresele statice (R1, Server).'],
              ['dns-server 192.168.1.10', 'PC-urile vor primi ca DNS serverul din laborator.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="PC-urile cer adresă">
          <p>Pe PC1: Desktop → IP Configuration → <b>DHCP</b>. Ce adresă, gateway și DNS primește? Verifică pe R1 cu <code>show ip dhcp binding</code>. Repetă pe PC2.</p>
          <Reveal label="Răspuns">
            <p>Prima adresă disponibilă după cele excluse (192.168.1.11 pentru PC1, .12 pentru PC2), gateway 192.168.1.1, DNS 192.168.1.10. Binding-urile apar pe R1, legate de MAC-ul fiecărui PC.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Urmărește DORA">
          <p>Treci în <b>Simulation Mode</b>, filtrează pe protocolul DHCP, pune PC2 pe „DHCP” și rulează pas cu pas. Notează pentru fiecare mesaj: cine îl trimite, sursa și destinația IP, și dacă e broadcast.</p>
          <Reveal label="Răspuns">
            <p>Discover și Request pleacă de la PC, cu sursa 0.0.0.0 și destinația 255.255.255.255 (UDP 67). Offer și Ack vin de la R1 (192.168.1.1) către client (UDP 68). În PT unele detalii (de exemplu dacă Offer e unicast sau broadcast) pot diferi.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — DNS">
        <Step labKey={L} n={4} title="Înregistrare DNS pe server">
          <p>Pe Server: Services → <b>DNS</b>: pornește serviciul și adaugă o înregistrare <i>A</i>: <code>www.exemplu.local</code> → 192.168.1.10. Pornește și serviciul <b>HTTP</b>.</p>
        </Step>
        <Step labKey={L} n={5} title="Test după nume">
          <p>Din PC1: <code>ping 192.168.1.10</code>, apoi <code>ping www.exemplu.local</code> și deschide <code>http://www.exemplu.local</code> în Web Browser. Ce se întâmplă?</p>
          <Reveal label="Răspuns">
            <p>Ambele merg: PC1 a primit DNS-ul prin DHCP, a întrebat serverul și a primit adresa 192.168.1.10. Poți vedea interogarea în Simulation Mode (UDP 53).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Defecțiune controlată">
          <p>Pe R1: <code>no dns-server 192.168.1.10</code> în pool, apoi pe PC1 reînnoiește (DHCP off/on). Încearcă din nou <code>ping 192.168.1.10</code> și <code>ping www.exemplu.local</code>. Explică diferența.</p>
          <Reveal label="Răspuns">
            <p>Ping la adresă merge (conectivitatea IP e bună), ping la nume eșuează („could not find host”): PC1 nu mai are un server DNS. DHCP livrează configurația; DNS rezolvă numele — două servicii separate.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce sunt Discover și Request broadcast? (2) Ce adresă ar primi un PC dacă R1 ar fi oprit? (3) Ce rol are lease-ul?</p>
          <Reveal label="Indicii">
            <p>(1) Clientul nu are adresă și nu știe serverul. (2) O adresă 169.254.x.x (APIPA). (3) Limitează cât timp ține clientul adresa; permite recuperarea adreselor neutilizate.</p>
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
  const L = 't43s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.3-S" title="Lab solo — pool DHCP cu un defect de diagnosticat" />
      <Summary>
        <p><b>Scenariu:</b> R1 trebuie să împartă adrese din 192.168.20.0/24 (.1–.10 excluse) cu gateway .1 și DNS 8.8.8.8, iar PC3 are IP static 192.168.20.5. Un coleg a configurat pool-ul, dar PC1 și PC2 primesc adrese 169.254.x.x. Găsește defectul cu <code>show</code>.
          <br /><b>Timp estimat:</b> 35–45 min · <b>Unealtă:</b> Packet Tracer (1 router, 1 switch, 3 PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: R1 server DHCP, două PC-uri cu DHCP și un PC cu IP static.">
        <LabSoloTopology43 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '192.168.20.1/24'],
        ['PC1, PC2', 'NIC', 'DHCP'],
        ['PC3', 'NIC', '192.168.20.5/24 (static)'],
      ]} />
      <Callout kind="info" title="Cerințe">
        Pool OFFICE: 192.168.20.0/24, gateway 192.168.20.1, DNS 8.8.8.8, lease 3 zile, adrese .1–.10 excluse. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Pool corect">
          <p>Configurează interfața și pool-ul conform cerințelor.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip address 192.168.20.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# ip dhcp excluded-address 192.168.20.1 192.168.20.10
R1(config)# ip dhcp pool OFFICE
R1(dhcp-config)# network 192.168.20.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.20.1
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# lease 3`} explain={[
              ['excluded-address .1–.10', 'Protejează gateway-ul și PC3 (.5).'],
              ['network 192.168.20.0 255.255.255.0', 'Trebuie să corespundă subrețelei interfeței.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={2} title="Defectul">
          <p>PC1 și PC2 au 169.254.x.x. Folosind <code>show ip dhcp pool</code>, <code>show ip dhcp server statistics</code>, <code>show ip interface brief</code> și <code>show running-config | section dhcp</code>, găsește cauza (indiciu: ce valori numără contoarele?) și repar-o.</p>
          <Reveal label="Cauza și remedierea">
            <p>Pool-ul conține <code>network 192.168.2.0 255.255.255.0</code> (lipsește un 0). Subrețeaua pool-ului nu corespunde interfeței 192.168.20.0/24, deci serverul nu are adrese de oferit pe acea interfață: contorul „DHCPDISCOVER” crește, dar „DHCPOFFER” rămâne 0. Remediere: <code>network 192.168.20.0 255.255.255.0</code> în pool; apoi reînnoiește pe PC-uri. Alte cauze posibile: interfața <code>shutdown</code>, excluse pe tot intervalul.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Test final">
          <p>Verifică adresele noi pe PC1/PC2 (nu 169.254.x.x), că PC3 nu apare în <code>show ip dhcp binding</code> și că nimeni nu primește adresa .5.</p>
          <Reveal label="Răspuns">
            <p>PC1 și PC2 primesc adrese de la .11 în sus. PC3 nu apare în binding (nu folosește DHCP). Adresa .5 nu poate fi oferită pentru că este exclusă.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
