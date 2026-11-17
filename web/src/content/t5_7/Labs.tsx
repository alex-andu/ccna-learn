import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology57, LabSoloTopology57 } from '../../diagrams/t5_7';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't57g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.7-G" title="Lab ghidat — port security, DHCP snooping și DAI pe un switch de acces" />
      <Summary>
        <p><b>Obiectiv:</b> securizezi un switch de acces: limitezi MAC-urile pe porturi, blochezi un server DHCP fals și verifici protecția ARP. <br /><b>Timp estimat:</b> 60–80 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × switch 2960, 1 × router ca server DHCP, 2 × PC, 1 × server „rogue”) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC1, PC2 și un server DHCP fals pe SW1; R1 este serverul DHCP legitim.">
        <LabGuidedTopology57 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Configurare']} rows={[
        ['R1', 'Gi0/0', '192.168.10.1/24; pool DHCP 192.168.10.0/24 (excluse .1–.10), gateway .1'],
        ['SW1', 'Fa0/1, Fa0/2, Fa0/3', 'VLAN 10, mod access'],
        ['SW1', 'Gi0/1', 'uplink către R1 (VLAN 10, access)'],
        ['PC1, PC2', 'NIC', 'DHCP'],
        ['Rogue', 'NIC (Fa0/3)', 'server cu serviciul DHCP pornit: pool 10.66.6.0/24, gateway 10.66.6.1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Port security este disponibil pe switch-urile 2960 din PT. DHCP snooping este disponibil în versiunile recente de PT (verifică cu <code>ip dhcp ?</code>); suportul DAI poate lipsi, iar contoarele/mesajele log diferă de un echipament real. Dacă DAI nu există în versiunea ta, rulează Partea 4 în CML/GNS3 (IOSvL2) sau parcurge-o ca exercițiu de citire. Comenzile <b>nu au fost testate</b> de autorul lecției în PT.
      </Callout>

      <Detailed title="Partea 0 — Baza: DHCP legitim funcționează">
        <Step labKey={L} n={1} title="DHCP pe R1 și clienții">
          <CodeBlock title="R1" kind="config" code={`R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10
R1(config)# ip dhcp pool LAN10
R1(dhcp-config)# network 192.168.10.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.10.1`} explain={[
            ['ip dhcp excluded-address …', 'Adrese rezervate (gateway și ținte statice) care nu se dau clienților.'],
            ['network / default-router', 'Pool-ul și gateway-ul oferite clienților.'],
          ]} />
          <p>Pune PC1 și PC2 pe DHCP. Ce adrese primesc? Ce se întâmplă dacă pornești și serverul „rogue” înainte de snooping?</p>
          <Reveal label="Răspuns">
            <p>PC1 și PC2 primesc adrese 192.168.10.x. Fără snooping, un client poate primi o ofertă de la serverul fals (10.66.6.x, gateway 10.66.6.1): cine răspunde primul câștigă. Reînnoiește adresa (<code>ipconfig /renew</code>) de câteva ori pe un PC cu serverul fals pornit și observă.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Port security">
        <Step labKey={L} n={2} title="Max 1 + sticky + shutdown pe Fa0/1">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# interface fastEthernet 0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 1
SW1(config-if)# switchport port-security mac-address sticky
SW1(config-if)# switchport port-security violation shutdown`} explain={[
            ['switchport mode access', 'Necesar înainte de port security.'],
            ['mac-address sticky', 'Primul MAC învățat devine adresă sigură în running-config.'],
          ]} />
          <p>Trimite un ping de la PC1 (învățare). Rulează <code>show port-security interface fa0/1</code>. Apoi mută cablul de la PC1 pe alt PC (sau schimbă adresa MAC în PT) și observă portul.</p>
          <Reveal label="Răspuns">
            <p>După primul ping, „Sticky MAC Addresses: 1”. La conectarea unui alt dispozitiv, portul intră în err-disabled (Secure-shutdown), iar LED-ul devine roșu. Verifică cu <code>show interfaces status err-disabled</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Recuperare">
          <p>Scoate dispozitivul ilegal și repune portul în funcțiune. Ce comenzi? Ce s-ar fi întâmplat în modul <code>restrict</code>?</p>
          <Reveal label="Soluție">
            <CodeBlock title="SW1" kind="config" code={`SW1(config)# interface fastEthernet 0/1
SW1(config-if)# shutdown
SW1(config-if)# no shutdown`} explain={[
              ['shutdown / no shutdown', 'Scoate portul din err-disabled după ce cauza a fost eliminată.'],
            ]} />
            <p>În modul <code>restrict</code> portul ar fi rămas UP, cadrele ilegale ar fi fost aruncate, iar contorul de violări ar fi crescut; PC-ul legitim ar fi continuat să funcționeze.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — DHCP snooping">
        <Step labKey={L} n={4} title="Pornește snooping și marchează uplinkul">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# ip dhcp snooping trust
SW1(config-if)# exit
SW1(config)# interface range fastEthernet 0/1 - 3
SW1(config-if-range)# ip dhcp snooping limit rate 15`} explain={[
            ['ip dhcp snooping vlan 10', 'Toate porturile VLAN-ului devin untrusted.'],
            ['ip dhcp snooping trust pe Gi0/1', 'OFFER-ul lui R1 trece prin uplink.'],
          ]} />
          <p>Reînnoiește adresa pe PC1 și PC2 (cu serverul fals pornit). Ce adrese primesc acum? Ce arată <code>show ip dhcp snooping binding</code>?</p>
          <Reveal label="Răspuns">
            <p>Doar adrese 192.168.10.x de la R1: ofertele serverului fals de pe Fa0/3 (untrusted) sunt aruncate. Binding table conține câte o intrare pentru PC1 și PC2 (MAC, IP, VLAN 10, port).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Greșeala clasică">
          <p>Elimină <code>ip dhcp snooping trust</code> de pe Gi0/1 și reînnoiește adresa pe PC1. Ce observi? De ce?</p>
          <Reveal label="Răspuns">
            <p>PC1 nu mai primește nicio adresă (sau cade pe 169.254.x.x/APIPA): oferta legitimă a lui R1 intră pe un port untrusted și este aruncată. Reaplică trust.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — DAI (dacă platforma o suportă)">
        <Step labKey={L} n={6} title="Activează DAI">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# ip arp inspection vlan 10
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# ip arp inspection trust`} explain={[
            ['ip arp inspection vlan 10', 'Verifică ARP-urile de pe porturile untrusted.'],
            ['ip arp inspection trust', 'Nu inspecta ARP-urile de pe uplink.'],
          ]} />
          <p>Verifică cu <code>show ip arp inspection vlan 10</code>. Un PC cu IP static (de exemplu 192.168.10.200) pe Fa0/3: poate pinga gateway-ul? Ce ai nevoie ca să funcționeze?</p>
          <Reveal label="Răspuns">
            <p>Nu poate: nu are intrare în binding table (nu a folosit DHCP), deci ARP-urile lui sunt aruncate. Soluții: ARP ACL cu IP–MAC al gazdei (<code>ip arp inspection filter</code>) sau portul marcat trusted (mai puțin sigur).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce se activează snooping înaintea DAI? (2) De ce uplinkul este trusted? (3) Ce nu poate opri port security?</p>
          <Reveal label="Indicii">
            <p>(1) DAI compară ARP cu binding table creat de snooping. (2) Pe uplink vin ARP-uri legitime de la gateway/alte switch-uri, iar ofertele serverului trebuie să treacă. (3) Un atacator care falsifică un MAC autorizat; atacurile ARP și DHCP — pentru acestea sunt DAI și snooping.</p>
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
  const L = 't57s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.7-S" title="Lab solo — securitatea L2 nu face ce trebuie" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a configurat SW1, dar: clienții nu mai primesc adrese IP, un laptop neautorizat pe Fa0/3 se conectează fără probleme, iar PC1 pe Fa0/1 este deconectat din când în când. Găsește defectele (cel puțin trei) și corectează-le. <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Packet Tracer (sau CML/GNS3) · <b>Nivel:</b> intermediar–avansat</p>
      </Summary>
      <Figure caption="Topologie solo: aceeași, cu un atacator pe Fa0/3.">
        <LabSoloTopology57 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: clienții primesc IP de la R1; doar un MAC pe Fa0/1 și Fa0/2 (maximum 1 și 2); Fa0/3 nu acceptă dispozitive neautorizate; DAI nu aruncă ARP-urile legitime. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Configurația primită (extras)">
        <Step labKey={L} n={1} title="Citește configurația">
          <CodeBlock title="SW1 (extras)" kind="config" code={`ip dhcp snooping
ip dhcp snooping vlan 10
ip arp inspection vlan 10
!
interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10
!
interface FastEthernet0/1
 switchport mode access
 switchport access vlan 10
 switchport port-security
 switchport port-security maximum 1
 switchport port-security violation protect
!
interface FastEthernet0/2
 switchport mode dynamic desirable
 switchport access vlan 10
 switchport port-security maximum 2
!
interface FastEthernet0/3
 switchport mode access
 switchport access vlan 10`} explain={[
            ['Gi0/1', 'Fără ip dhcp snooping trust și fără ip arp inspection trust.'],
            ['Fa0/1', 'Mod protect: violările sunt tăcute; PC1 „se deconectează” când un al doilea MAC apare.'],
            ['Fa0/2', 'Mod dynamic desirable și lipsește „switchport port-security”.'],
            ['Fa0/3', 'Nu are nicio protecție.'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>Gi0/1 nu este trusted</b> pentru DHCP snooping: ofertele lui R1 sunt aruncate → clienții nu primesc IP. Tot lipsește și <code>ip arp inspection trust</code> (DAI aruncă ARP-urile gateway-ului).</li>
              <li><b>Fa0/2</b>: portul este <code>dynamic desirable</code> (port security nu poate fi activat pe un port dinamic) și, în plus, linia <code>switchport port-security</code> lipsește: maximum 2 nu are efect.</li>
              <li><b>Fa0/3</b> nu are port security: un laptop neautorizat este acceptat; trebuie port security cu maximum 1 (eventual portul oprit dacă nu e folosit).</li>
              <li><b>Fa0/1</b>: modul <code>protect</code> aruncă tăcut cadrele ilegale; dacă un dispozitiv al doilea e prezent, utilizatorul observă pierderi fără nicio alertă — folosește <code>restrict</code> sau <code>shutdown</code> ca să vezi violările.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <Reveal label="Soluție">
            <CodeBlock title="SW1" kind="config" code={`SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# ip dhcp snooping trust
SW1(config-if)# ip arp inspection trust
SW1(config-if)# interface fastEthernet 0/1
SW1(config-if)# switchport port-security violation restrict
SW1(config-if)# interface fastEthernet 0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 2
SW1(config-if)# switchport port-security violation restrict
SW1(config-if)# interface fastEthernet 0/3
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 1
SW1(config-if)# switchport port-security violation shutdown`} explain={[
              ['trust pe Gi0/1', 'Ofertele DHCP și ARP-urile legitime trec prin uplink.'],
              ['restrict pe Fa0/1', 'Violările sunt aruncate și logate, fără a închide portul.'],
              ['mode access + switchport port-security pe Fa0/2', 'Cerința de bază înainte de maximum 2.'],
              ['port security pe Fa0/3', 'Un dispozitiv neautorizat nu mai este acceptat; shutdown face violarea evidentă.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Reînnoiește adresele pe PC1/PC2; conectează un laptop pe Fa0/3. Ce arată <code>show port-security</code> și <code>show ip dhcp snooping binding</code>?</p>
          <Reveal label="Răspuns">
            <p>PC1/PC2 primesc adrese de la R1 și apar în binding table. Fa0/3: primul dispozitiv devine singura adresă permisă (maximum 1); orice altul pune portul în err-disabled. Dacă un al doilea MAC apare pe Fa0/1/Fa0/2, <code>show port-security</code> arată contor de violări crescut.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
