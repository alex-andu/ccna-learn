import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.1" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 1.1 este de tip <b>Explain</b>: la examen nu ți se cere să configurezi. Comenzile <code>show</code> de mai jos îți arată însă, pe echipamente reale, exact ce ai învățat în teorie:
          tabela de rutare a routerului, tabela MAC a switch-ului, vecinii descoperiți prin CDP/LLDP și bugetul PoE. Le vei folosi în fiecare lab din acest curs.</p>
      </Summary>
      <Callout kind="info" title="Despre output-uri">
        Output-urile de mai jos sunt <b>exemple ilustrative</b>, scrise după formatul Cisco IOS / IOS-XE; nu sunt copiate de pe un echipament anume și nu au fost testate pe hardware real.
        Coloanele și valorile exacte diferă între modele și versiuni (și în Packet Tracer). Pe echipament, folosește întotdeauna <code>?</code> ca să vezi opțiunile disponibile.
      </Callout>

      <Detailed title="Exemplul 1 — Routerul: tabela de rutare și CEF">
        <CodeBlock title="R1 — show ip route" kind="session" code={`R1# show ip route
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       * - candidate default
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 4 subnets, 3 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0
O        10.2.2.0/24 [110/2] via 10.1.12.2, 00:05:12, GigabitEthernet0/1
C        10.1.12.0/30 is directly connected, GigabitEthernet0/1
L        10.1.12.1/32 is directly connected, GigabitEthernet0/1
      203.0.113.0/24 is variably subnetted, 2 subnets, 2 masks
C        203.0.113.0/24 is directly connected, GigabitEthernet0/2
L        203.0.113.2/32 is directly connected, GigabitEthernet0/2`} explain={[
          ['Codes: …', 'Legenda: litera din fața fiecărei rute spune de unde a fost învățată.'],
          ['Gateway of last resort is …', <>Există o rută implicită: tot ce nu se potrivește altundeva merge la 203.0.113.1 (ISP-ul).</>],
          ['S* 0.0.0.0/0 [1/0] via 203.0.113.1', <>Rută <b>statică</b> implicită. <code>[1/0]</code> = distanța administrativă 1 / metrica 0.</>],
          ['C 10.1.1.0/24 … GigabitEthernet0/0', 'Rețea direct conectată: apare automat când interfața are IP și este up/up.'],
          ['L 10.1.1.1/32', 'Adresa proprie a interfeței (ruta „local”, /32). Pachetele spre ea sunt pentru router însuși.'],
          ['O 10.2.2.0/24 [110/2] via 10.1.12.2, 00:05:12', 'Rută învățată prin OSPF (AD 110, cost 2), next hop 10.1.12.2, de 5 minute și 12 secunde. OSPF se studiază în 3.4.'],
        ]} />
        <CodeBlock title="R1 — ruta folosită pentru o destinație anume și CEF" kind="session" code={`R1# show ip route 10.2.2.50
Routing entry for 10.2.2.0/24
  Known via "ospf 1", distance 110, metric 2, type intra area
  Last update from 10.1.12.2 on GigabitEthernet0/1, 00:05:40 ago
R1# show ip cef 10.2.2.50
10.2.2.0/24
  nexthop 10.1.12.2 GigabitEthernet0/1
R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     10.1.1.1        YES manual up                    up
GigabitEthernet0/1     10.1.12.1       YES manual up                    up
GigabitEthernet0/2     203.0.113.2     YES manual up                    up`} explain={[
          ['show ip route 10.2.2.50', 'Arată ce rută ar folosi routerul pentru această destinație — longest prefix match făcut pentru tine.'],
          ['show ip cef 10.2.2.50', <>Intrarea din <G id="fib" /> folosită efectiv de <G id="cef" /> în data plane: next hop și interfața de ieșire.</>],
          ['show ip interface brief', 'Rezumat al interfețelor: IP, stare (Status = L1, Protocol = L2). Prima comandă pe care o dai pe orice router.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Switch-ul L2: tabela MAC">
        <CodeBlock title="SW1 — show mac address-table" kind="session" code={`SW1# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
 All    0100.0ccc.cccc    STATIC      CPU
  10    0050.7966.6801    DYNAMIC     Gi1/0/1
  10    0050.7966.6802    DYNAMIC     Gi1/0/2
  20    00d0.ba12.3c45    DYNAMIC     Gi1/0/24
Total Mac Addresses for this criterion: 4
SW1# show mac address-table aging-time
Global Aging Time:  300
SW1# show mac address-table address 0050.7966.6802
  10    0050.7966.6802    DYNAMIC     Gi1/0/2`} explain={[
          ['show mac address-table', <>Tabela MAC (<G id="cam" />): pentru fiecare VLAN, ce MAC a fost văzut pe ce port.</>],
          ['STATIC … CPU', 'Adrese rezervate pentru protocoalele switch-ului însuși (de exemplu 0100.0ccc.cccc = CDP).'],
          ['DYNAMIC … Gi1/0/1', 'Învățată automat din MAC-ul sursă al unui cadru primit pe acel port.'],
          ['show mac address-table aging-time', 'Cât timp rămâne o intrare nefolosită: implicit 300 de secunde.'],
          ['show mac address-table address …', 'Găsește pe ce port este un anumit dispozitiv — foarte util când cauți fizic un PC.'],
        ]} />
        <CodeBlock title="SW1 — adresa de management (SVI) a unui switch L2" code={`SW1(config)# interface vlan 1
SW1(config-if)# ip address 192.168.1.2 255.255.255.0
SW1(config-if)# no shutdown
SW1(config-if)# exit
SW1(config)# ip default-gateway 192.168.1.1`} explain={[
          ['interface vlan 1', <>Interfața virtuală (<G id="svi" />) a VLAN-ului 1, folosită pentru administrare.</>],
          ['ip address 192.168.1.2 255.255.255.0', 'Adresa prin care te conectezi la switch (SSH, ping). Nu transformă switch-ul în router.'],
          ['ip default-gateway 192.168.1.1', 'Pe un switch L2 (fără ip routing), spune unde să trimită răspunsurile spre alte rețele.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Switch-ul L3: rutarea între VLAN-uri">
        <CodeBlock title="MLS1 — SVI-uri și routed port" code={`MLS1(config)# ip routing
MLS1(config)# interface vlan 10
MLS1(config-if)# ip address 10.0.10.1 255.255.255.0
MLS1(config-if)# no shutdown
MLS1(config-if)# interface vlan 20
MLS1(config-if)# ip address 10.0.20.1 255.255.255.0
MLS1(config-if)# no shutdown
MLS1(config-if)# interface GigabitEthernet1/0/48
MLS1(config-if)# no switchport
MLS1(config-if)# ip address 10.0.0.2 255.255.255.252
MLS1(config-if)# exit
MLS1(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1`} explain={[
          ['ip routing', 'Activează rutarea IPv4. Fără ea, switch-ul L3 se comportă ca unul L2 (SVI-urile servesc doar la management).'],
          ['interface vlan 10 + ip address', 'SVI-ul VLAN-ului 10: devine default gateway-ul calculatoarelor din VLAN 10.'],
          ['no switchport', <>Transformă portul fizic într-un <b>routed port</b> — se comportă ca o interfață de router, fără VLAN.</>],
          ['ip route 0.0.0.0 0.0.0.0 10.0.0.1', 'Rută implicită spre routerul de margine (rutele statice se studiază în 3.3).'],
        ]} />
        <CodeBlock title="MLS1 — verificare" kind="session" code={`MLS1# show ip route connected
C        10.0.0.0/30 is directly connected, GigabitEthernet1/0/48
C        10.0.10.0/24 is directly connected, Vlan10
C        10.0.20.0/24 is directly connected, Vlan20
MLS1# show interfaces GigabitEthernet1/0/48 switchport
Name: Gi1/0/48
Switchport: Disabled`} explain={[
          ['show ip route connected', 'Doar rețelele direct conectate: fiecare SVI și fiecare routed port este o rețea separată (un domeniu de broadcast separat).'],
          ['Switchport: Disabled', 'Confirmă că portul este routed (L3), nu un port de switch L2.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — Cine e conectat unde: CDP și LLDP">
        <p><G id="cdp" /> (proprietar Cisco, activ implicit) și <G id="lldp" /> (standard IEEE 802.1AB, de obicei dezactivat implicit pe Cisco) fac ca fiecare echipament să-și anunțe vecinilor direct conectați numele, modelul, portul și capabilitățile. Sunt cel mai rapid mod de a afla <b>ce tip de componentă</b> este la capătul unui cablu.</p>
        <CodeBlock title="MLS1 — show cdp neighbors" kind="session" code={`MLS1# show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone
Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
R1               Gig 1/0/48        151            R B S I  ISR4331   Gig 0/0/1
SW2              Gig 1/0/1         163             S I     WS-C2960X Gig 1/0/49
SEP00A1B2C3D4E5  Gig 1/0/5         143            H P M    IP Phone  Port 1
AP-ETAJ2         Gig 1/0/6         128            T B I    C9120AXI- Gig 0`} explain={[
          ['Device ID', 'Numele vecinului (hostname-ul lui). Telefoanele Cisco apar ca SEP + MAC.'],
          ['Local Intrfce', 'Portul TĂU pe care l-ai văzut.'],
          ['Holdtme', 'Câte secunde mai păstrezi informația dacă nu mai primești anunțuri (implicit 180 s; anunțurile vin la 60 s).'],
          ['Capability R / S / H P / T B', 'Ce fel de componentă este: R = router, S = switch, H P = host / telefon, T B = bridge (AP-ul).'],
          ['Platform / Port ID', 'Modelul vecinului și portul LUI la care ești legat — poți desena topologia fără să vezi cablurile.'],
        ]} />
        <CodeBlock title="MLS1 — LLDP și detalii" kind="session" code={`MLS1(config)# lldp run
MLS1(config)# end
MLS1# show lldp neighbors
Capability codes:
    (R) Router, (B) Bridge, (T) Telephone, (C) DOCSIS Cable Device
    (W) WLAN Access Point, (P) Repeater, (S) Station, (O) Other
Device ID           Local Intf     Hold-time  Capability      Port ID
R1                  Gi1/0/48       120        R               Gi0/0/1
AP-ETAJ2            Gi1/0/6        120        B,W             Gi0
MLS1# show cdp neighbors GigabitEthernet1/0/48 detail
Device ID: R1
  IP address: 10.0.0.1
Platform: cisco ISR4331/K9,  Capabilities: Router Switch IGMP
Interface: GigabitEthernet1/0/48,  Port ID (outgoing port): GigabitEthernet0/0/1
Version :
Cisco IOS XE Software, Version 17.09.04a`} explain={[
          ['lldp run', 'Activează LLDP global (pe multe echipamente Cisco este oprit implicit). Necesar pentru vecini non-Cisco.'],
          ['show lldp neighbors', 'Același rol ca CDP, dar standard — funcționează și cu echipamente de la alți producători. W = WLAN Access Point.'],
          ['show cdp neighbors … detail', 'Detalii: adresa IP a vecinului, versiunea software, platforma exactă. Util pentru a te conecta mai departe la el.'],
        ]} />
        <Callout kind="warn" title="Securitate">
          CDP/LLDP dezvăluie modelul și versiunea software oricui e conectat la port. Pe porturile spre Internet sau spre clienți necunoscuți se dezactivează (<code>no cdp enable</code> pe interfață). Configurarea completă CDP/LLDP este obiectivul 2.3.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 5 — PoE: buget, porturi, politici">
        <CodeBlock title="SW-ACC — show power inline" kind="session" code={`SW-ACC# show power inline
Module   Available     Used     Remaining
          (Watts)     (Watts)    (Watts)
------   ---------   --------   ---------
1           370.0      52.4       317.6
Interface Admin  Oper       Power   Device              Class Max
                            (Watts)
--------- ------ ---------- ------- ------------------- ----- ----
Gi1/0/1   auto   on         7.0     IP Phone 8845       2     30.0
Gi1/0/2   auto   on         15.4    IP Camera           3     30.0
Gi1/0/3   auto   on         30.0    C9120AXI-E          4     30.0
Gi1/0/4   auto   off        0.0     n/a                 n/a   30.0
Gi1/0/5   never  off        0.0     n/a                 n/a   30.0`} explain={[
          ['Available / Used / Remaining', 'Bugetul PoE al switch-ului: total, deja rezervat, rămas. Aici 370 W, din care 52.4 W folosiți.'],
          ['Admin auto · Oper on', 'PoE activ automat și portul chiar alimentează un PD.'],
          ['Power 7.0 · Class 2', 'Puterea rezervată pentru PD (clasa 2 → 7 W la PSE).'],
          ['Gi1/0/4 auto · off', 'PoE permis, dar nu e conectat niciun PD (sau e un PC fără semnătură PoE).'],
          ['Gi1/0/5 never · off', 'PoE dezactivat administrativ pe port.'],
          ['Max 30.0', 'Puterea maximă pe care o poate da acest port (switch PoE+).'],
        ]} />
        <CodeBlock title="SW-ACC — politici PoE pe porturi" code={`SW-ACC(config)# interface GigabitEthernet1/0/5
SW-ACC(config-if)# power inline never
SW-ACC(config-if)# interface GigabitEthernet1/0/3
SW-ACC(config-if)# power inline static max 30000
SW-ACC(config-if)# interface GigabitEthernet1/0/1
SW-ACC(config-if)# power inline auto max 15400
SW-ACC(config-if)# power inline police
SW-ACC(config-if)# end
SW-ACC# show power inline GigabitEthernet1/0/3 detail`} explain={[
          ['power inline never', 'Fără PoE pe acest port (de exemplu spre un PC sau un alt switch). Bun și ca „restart” pentru un AP: never, apoi auto.'],
          ['power inline static max 30000', 'Rezervă permanent 30 W (30000 mW) pentru AP-ul critic, chiar înainte să fie conectat — nu rămâne fără curent dacă bugetul se umple.'],
          ['power inline auto max 15400', 'Implicitul (auto), dar plafonat la 15.4 W: un PD care cere mai mult nu este alimentat.'],
          ['power inline police', 'Dacă PD-ul consumă mai mult decât i s-a alocat, portul este oprit (sau doar se jurnalizează, în funcție de opțiune).'],
          ['show power inline … detail', 'Detalii pe port: clasa detectată, puterea cerută prin CDP/LLDP, puterea alocată.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 6 — Firewall-ul: o privire (beyond CCNA)">
        <p>Configurarea firewall-urilor nu face parte din CCNA. Ca să vezi totuși cum arată „tabela de stare” din teorie, iată un exemplu de pe un Cisco ASA clasic (firewall stateful):</p>
        <CodeBlock title="ASA — conexiunile urmărite" kind="session" code={`ASA# show conn
2 in use, 118 most used
TCP outside  198.51.100.80:443 inside  192.168.1.10:51000, idle 0:00:04, bytes 48211, flags UIO
UDP outside  8.8.8.8:53 inside  192.168.1.10:58312, idle 0:00:01, bytes 112, flags -`} explain={[
          ['show conn', 'Tabela de stare: fiecare conexiune activă, cu adrese, porturi, protocol și cât timp a stat inactivă.'],
          ['flags UIO', 'Conexiune TCP stabilită (Up), cu date în ambele direcții (Inbound și Outbound).'],
          ['UDP … :53', 'Chiar și pentru UDP (fără conexiune), firewall-ul notează „sesiunea” ca să permită răspunsul DNS.'],
        ]} />
        <p className="small muted">Pe Cisco Secure Firewall (FTD/NGFW), politicile se definesc de obicei grafic (Firewall Management Center sau Device Manager), cu reguli pe aplicații, utilizatori și URL-uri.</p>
      </Detailed>
    </section>
  );
}
