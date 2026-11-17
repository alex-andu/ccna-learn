import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology55, LabSoloTopology55 } from '../../diagrams/t5_5';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't55g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.5-G" title="Lab ghidat — VPN IPsec site-to-site între R1 și R3" />
      <Summary>
        <p><b>Obiectiv:</b> construiești un tunel IPsec între două routere, peste un „ISP” care nu cunoaște LAN-urile private; verifici faza 1 și faza 2 și dovedești că traficul este criptat (simulation mode). <br /><b>Timp estimat:</b> 60–80 min · <b>Unealtă:</b> Cisco Packet Tracer (3 × router 1941 cu licență securityk9, 2 × PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC1 — R1 — R2 (ISP) — R3 — PC3.">
        <LabGuidedTopology55 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['PC1', 'NIC', '192.168.1.10/24, gw 192.168.1.1'],
        ['R1', 'Gi0/0 · Gi0/1', '192.168.1.1/24 · 198.51.100.1/30'],
        ['R2 (ISP)', 'Gi0/0 · Gi0/1', '198.51.100.2/30 · 203.0.113.1/30'],
        ['R3', 'Gi0/0 · Gi0/1', '192.168.3.1/24 · 203.0.113.2/30'],
        ['PC3', 'NIC', '192.168.3.10/24, gw 192.168.3.1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer suportă IPsec site-to-site IKEv1 cu crypto map pe routere ISR (de obicei cu <code>license boot module c1900 technology-package securityk9</code> și reload); poate accepta doar algoritmi mai vechi (de exemplu <code>hash sha</code>, <code>group 2</code>, <code>encryption aes 256</code>/<code>3des</code>). Folosește ce acceptă versiunea ta. Comenzile <b>nu au fost testate</b> de autorul lecției în PT. Același lab merge în GNS3/CML cu IOSv sau CSR1000v. Remote access cu client nu se emulează în PT.
      </Callout>

      <Detailed title="Partea 0 — Conectivitate fără VPN">
        <Step labKey={L} n={1} title="Adresare și rutare">
          <p>Configurează adresele din tabel. Pe R1 și R3: rută default către ISP (<code>ip route 0.0.0.0 0.0.0.0 198.51.100.2</code> pe R1, <code>… 203.0.113.1</code> pe R3). Pe R2 <b>nu</b> pune rute spre LAN-urile private. Testează: ping R1 → 203.0.113.2 (WAN R3). Merge PC1 → PC3?</p>
          <Reveal label="Răspuns">
            <p>Ping între adresele WAN merge; PC1 → PC3 <b>nu</b> merge: R2 nu are rută spre 192.168.3.0/24 (adrese private, nerutabile în Internet). Acesta este motivul pentru care avem nevoie de VPN: tunelul va transporta pachetele private ca payload între adresele publice.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Licență (dacă PT o cere)">
          <CodeBlock title="R1, R3" kind="config" code={`Rx(config)# license boot module c1900 technology-package securityk9
Rx(config)# end
Rx# write memory
Rx# reload`} explain={[
            ['license boot module c1900 technology-package securityk9', 'Activează pachetul de securitate (comenzile crypto) pe un ISR 1941 din PT.'],
            ['reload', 'Licența se aplică după repornire.']]
          } />
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Configurarea tunelului">
        <Step labKey={L} n={3} title="Faza 1: politica IKE și PSK">
          <CodeBlock title="R1 (R3 la fel, cu peer 198.51.100.1)" kind="config" code={`R1(config)# crypto isakmp policy 10
R1(config-isakmp)# encryption aes 256
R1(config-isakmp)# authentication pre-share
R1(config-isakmp)# group 2
R1(config-isakmp)# hash sha
R1(config-isakmp)# lifetime 86400
R1(config-isakmp)# exit
R1(config)# crypto isakmp key V3ryS3cretKey address 203.0.113.2`} explain={[
            ['crypto isakmp policy 10', 'Propunerea IKE; trebuie compatibilă cu a lui R3.'],
            ['authentication pre-share', 'Autentificare cu cheie partajată.'],
            ['crypto isakmp key … address 203.0.113.2', 'PSK pentru peer; pe R3 adresa este 198.51.100.1.'],
          ]} />
          <p>Care parametri trebuie să fie identici pe R3? Ce se întâmplă dacă PSK-ul diferă?</p>
          <Reveal label="Răspuns">
            <p>Algoritmul de criptare, hash, metoda de autentificare, grupul DH și PSK-ul (pentru acel peer). Dacă PSK-ul diferă, faza 1 eșuează la autentificare (MM_KEY_EXCH / nu apare ISAKMP SA).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Faza 2: transform set, ACL, crypto map">
          <CodeBlock title="R1" kind="config" code={`R1(config)# crypto ipsec transform-set TS esp-aes 256 esp-sha-hmac
R1(config)# ip access-list extended VPN-TRAFFIC
R1(config-ext-nacl)# permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255
R1(config-ext-nacl)# exit
R1(config)# crypto map CMAP 10 ipsec-isakmp
R1(config-crypto-map)# set peer 203.0.113.2
R1(config-crypto-map)# set transform-set TS
R1(config-crypto-map)# match address VPN-TRAFFIC
R1(config-crypto-map)# exit
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# crypto map CMAP`} explain={[
            ['transform-set TS esp-aes 256 esp-sha-hmac', 'ESP cu AES-256 și HMAC-SHA (compatibil cu PT; pe echipamente moderne preferă SHA-256).'],
            ['permit ip 192.168.1.0 … 192.168.3.0 …', 'Traficul de interes.'],
            ['crypto map CMAP (pe Gi0/1)', 'Activează protecția pe interfața WAN.'],
          ]} />
          <p>Configurează R3 oglindit (peer 198.51.100.1, ACL inversat). Ce se întâmplă dacă uiți să aplici <code>crypto map</code> pe interfață?</p>
          <Reveal label="Răspuns">
            <p>Nu se criptează nimic: pachetele pleacă în clar (sau se pierd, dacă sunt private). Aplicarea pe interfață activează funcția.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Verificare și dovadă">
        <Step labKey={L} n={5} title="Ridică tunelul și verifică">
          <p>De pe PC1 dă ping către PC3 (primul pachet se poate pierde). Apoi pe R1: <code>show crypto isakmp sa</code> și <code>show crypto ipsec sa</code>. Ce stare vezi? Ce contoare cresc?</p>
          <Reveal label="Răspuns">
            <p>ISAKMP SA în <code>QM_IDLE</code>/<code>ACTIVE</code>; în IPsec SA cresc <code>#pkts encaps</code> și <code>#pkts decaps</code>. Primul ping se poate pierde deoarece tunelul se ridică după primul pachet de interes.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Dovada criptării (simulation mode)">
          <p>În Simulation Mode, urmărește un pachet ICMP de la PC1 spre PC3 și deschide-l la R2 (ISP). Ce adrese vede R2? Se văd 192.168.x.x?</p>
          <Reveal label="Răspuns">
            <p>La R2 pachetul are adrese publice (198.51.100.1 → 203.0.113.2) și protocol ESP; adresele private sunt în interiorul payload-ului criptat. De aceea ISP-ul nu are nevoie (și nu poate) să cunoască LAN-urile private.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce ACL-ul trebuie oglindit? (2) Ce rol au faza 1 și faza 2? (3) Ce s-ar întâmpla cu un hello OSPF prin acest tunel, de ce, și cum se rezolvă?</p>
          <Reveal label="Indicii">
            <p>(1) Fiecare capăt trebuie să accepte aceleași „identități proxy” (sursă/destinație protejate). (2) Faza 1 = canal sigur de negociere (IKE SA); faza 2 = chei pentru date (IPsec SA). (3) Multicast-ul OSPF nu trece prin IPsec cu crypto map; soluția: GRE peste IPsec sau VTI.</p>
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
  const L = 't55s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.5-S" title="Lab solo — tunelul nu se ridică" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a configurat VPN-ul R1 ↔ R3, dar PC1 nu ajunge la PC3. <code>show crypto isakmp sa</code> pe R1 este gol, iar <code>show crypto map</code> arată crypto map-ul. Găsește defectele (sunt cel puțin două) și corectează-le. <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Packet Tracer (3 routere, 2 PC) · <b>Nivel:</b> intermediar–avansat</p>
      </Summary>
      <Figure caption="Topologie solo: același model R1 — R2 (ISP) — R3.">
        <LabSoloTopology55 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: PC1 ↔ PC3 funcționează, <code>show crypto isakmp sa</code> arată o SA activă, iar contoarele IPsec cresc. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Configurațiile primite (extras)">
        <Step labKey={L} n={1} title="R1 și R3">
          <CodeBlock title="R1 (extras)" kind="config" code={`crypto isakmp policy 10
 encryption aes 256
 authentication pre-share
 group 2
 hash sha
crypto isakmp key V3ryS3cretKey address 203.0.113.2
crypto ipsec transform-set TS esp-aes 256 esp-sha-hmac
ip access-list extended VPN-TRAFFIC
 permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255
crypto map CMAP 10 ipsec-isakmp
 set peer 203.0.113.2
 set transform-set TS
 match address VPN-TRAFFIC
interface GigabitEthernet0/1
 ip address 198.51.100.1 255.255.255.252`} explain={[
            ['interface Gi0/1', 'Nu are linia „crypto map CMAP”.'],
          ]} />
          <CodeBlock title="R3 (extras)" kind="config" code={`crypto isakmp policy 10
 encryption aes 256
 authentication pre-share
 group 5
 hash sha
crypto isakmp key V3ryS3cretKey address 198.51.100.1
crypto ipsec transform-set TS esp-aes 256 esp-sha-hmac
ip access-list extended VPN-TRAFFIC
 permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255
crypto map CMAP 10 ipsec-isakmp
 set peer 198.51.100.1
 set transform-set TS
 match address VPN-TRAFFIC
interface GigabitEthernet0/1
 ip address 203.0.113.2 255.255.255.252
 crypto map CMAP`} explain={[
            ['group 5 vs group 2', 'Grupuri DH diferite pe cele două capete.'],
            ['ACL pe R3', 'Nu este oglindit (sursa și destinația sunt la fel ca pe R1).'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>R1: <code>crypto map CMAP</code> neaplicat pe Gi0/1</b> — R1 nu pornește IKE; <code>show crypto isakmp sa</code> gol.</li>
              <li><b>Grup DH diferit</b> (R1 group 2, R3 group 5) — faza 1 nu poate conveni asupra parametrilor.</li>
              <li><b>ACL neoglindit pe R3</b> — faza 2 respinge identitățile proxy diferite; ACL-ul R3 trebuie să aibă 192.168.3.0 → 192.168.1.0.</li>
              <li>(Verifică și) rută de întoarcere/default către ISP pe ambele capete.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <Reveal label="Soluție">
            <CodeBlock title="R1 / R3" kind="config" code={`R1(config)# interface gigabitEthernet 0/1
R1(config-if)# crypto map CMAP
R1(config-if)# exit
R1(config)# crypto isakmp policy 10
R1(config-isakmp)# group 2
R3(config)# crypto isakmp policy 10
R3(config-isakmp)# group 2
R3(config)# ip access-list extended VPN-TRAFFIC
R3(config-ext-nacl)# no permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255
R3(config-ext-nacl)# permit ip 192.168.3.0 0.0.0.255 192.168.1.0 0.0.0.255`} explain={[
              ['crypto map CMAP (pe R1 Gi0/1)', 'Activează VPN-ul pe R1.'],
              ['group 2 pe ambele', 'Politici IKE compatibile.'],
              ['ACL R3 inversat', 'Traficul de interes este oglindit.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Fă <code>clear crypto sa</code> pe ambele routere, apoi ping PC1 → PC3. Ce arată <code>show crypto ipsec sa</code>? Ce ai observat în privința primului pachet?</p>
          <Reveal label="Răspuns">
            <p>SA activă și contoare crescătoare pe ambele direcții. Primul pachet poate fi pierdut: tunelul se ridică după primul pachet de interes.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
