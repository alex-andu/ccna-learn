import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { FhrpFailoverDemo, GlbpBalancing, HsrpElection, HsrpStates, HsrpTracking, VirtualGatewayArp } from '../../diagrams/t3_5';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="3.5" title="First hop redundancy protocols — imaginea de ansamblu" />
      <Summary>
        <p>Un <b><G id="fhrp" /></b> face ca <G id="default-gateway" />-ul unei subrețele să nu mai fie un singur punct de defecțiune: două sau mai multe routere (sau switch-uri L3) prezintă gazdelor o <b>adresă IP virtuală</b> și un <b>MAC virtual</b>. Dacă routerul care forwardează cade, altul preia, iar gazdele nu observă nimic. Cele trei protocoale de cunoscut sunt <G id="hsrp" /> (Cisco), <G id="vrrp" /> (standard) și <G id="glbp" /> (Cisco).</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 3.5 este <i>Describe the purpose, functions, and concepts of first hop redundancy protocols</i>. Spre deosebire de 3.3 și 3.4, aici nu configurezi ceva complex: ești evaluat pe <b>înțelegere</b> (scop, funcții, concepte) și pe diferențele dintre cele trei protocoale. Pentru HSRP vei vedea totuși și configurarea de bază, pentru că ajută la înțelegere.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['De ce există FHRP? Ce problemă rezolvă?', 'De ce avem nevoie de FHRP'],
          ['Cum arată un grup: adresă virtuală, MAC virtual, roluri, Hello', 'Conceptele FHRP'],
          ['Cum diferă HSRP, VRRP și GLBP?', 'HSRP, VRRP și GLBP'],
          ['Cum se alege Active, ce face preempt, ce face tracking?', 'HSRP în detaliu'],
        ]} />
        <Callout kind="info" title="Ordinea de predare">
          Obiectivul 3.5 nu are sub-puncte oficiale. Lecția este împărțită în patru secțiuni logice, apoi configurarea (HSRP) și laburile.
        </Callout>
        <Analogy>Gândește-te la o casă de marcat cu un singur casier: dacă pleacă, coada se oprește. Cu FHRP ai două casiere în spatele aceluiași ghișeu: clienții merg mereu la „ghișeul 1”, iar în spate unul servește și celălalt îl urmărește. Dacă primul pleacă, al doilea se mută în același loc, iar clienții nu schimbă nimic.</Analogy>
      </Detailed>
      <Traps items={[
        <>FHRP nu înlocuiește un protocol de rutare: nu alege căi spre destinații, ci doar <b>cine este gateway-ul</b> pentru gazde.</>,
        <>FHRP nu este configurat pe gazde; gazdele nu știu că există. Ele folosesc doar adresa virtuală.</>,
        <>FHRP nu rezolvă căderea întregii subrețele sau a switch-ului de acces; protejează doar primul salt (gateway-ul).</>,
      ]} />
      <InlineQuiz ids={['3.5-001', '3.5-005']} />
    </section>
  );
}

/* ======================================================================
   1. De ce avem nevoie de FHRP
   ====================================================================== */
export function PurposeSection() {
  return (
    <section id="purpose" className="section">
      <SectionHead id="purpose" code="3.5" title="De ce avem nevoie de FHRP" />
      <Summary>
        <p>Gazdele (PC-uri, servere, telefoane) au configurat <b>un singur</b> default gateway, de obicei static sau prin DHCP. Dacă acel router cade, gazdele nu mai pot ieși din subrețea, chiar dacă există un al doilea router perfect funcțional. FHRP rezolvă asta în rețea, nu pe gazde.</p>
      </Summary>
      <Detailed title="1. Problema">
        <p>Când o gazdă vrea să trimită un pachet în afara subrețelei, îl trimite către default gateway: face <G id="arp" /> pentru adresa lui, învață MAC-ul și trimite cadrul acolo. Gazda nu rulează un protocol de rutare și, de obicei, nu detectează fiabil că gateway-ul a căzut. În campusuri se montează două routere sau două switch-uri L3 (de exemplu perechea de <G id="distribution-layer" />) tocmai pentru redundanță, dar fără un mecanism care să le facă să arate ca un singur gateway, redundanța hardware nu ajută gazdele.</p>
        <Figure caption="Interactiv: alternează între fără FHRP și cu FHRP, apoi „prăbușește” R1.">
          <FhrpFailoverDemo />
        </Figure>
        <h3>De ce nu merge „configurez două gateway-uri pe gazdă”?</h3>
        <ul>
          <li>Gazdele folosesc, în practică, un singur gateway la un moment dat și nu au o detecție de cădere pe care să te poți baza.</li>
          <li>Ar trebui să atingi fiecare gazdă (sute sau mii), iar DHCP nu poate oferi un gateway „mai inteligent”.</li>
          <li>Reconfigurarea manuală după o cădere durează mult mai mult decât o preluare automată.</li>
        </ul>
        <p>Soluția FHRP este să mute inteligența în rețea: gazda are mereu <b>aceeași adresă de gateway</b>, iar routerele din spate decid cine o deservește.</p>
      </Detailed>
      <Detailed title="2. Ce face un FHRP, pe scurt">
        <Table head={['Funcție', 'Ce înseamnă']} rows={[
          ['Gateway virtual', 'Un grup de routere partajează o adresă IP virtuală și un MAC virtual.'],
          ['Alegerea unui router activ', 'Un singur router (Active/Master) forwardează și răspunde la ARP; celelalte așteaptă.'],
          ['Detecția căderii', 'Mesaje Hello periodice; când dispar, rolul se mută.'],
          ['Failover transparent', 'Adresa și MAC-ul virtuale se mută cu rolul; gazdele nu se reconfigurează.'],
        ]} />
        <Callout kind="exam" title="Cuvinte cheie de examen">
          Scop: eliminarea default gateway-ului ca punct unic de defecțiune. Funcții: alegere, Hello, failover. Concepte: adresă IP virtuală, MAC virtual, Active/Standby, prioritate, preempt.
        </Callout>
      </Detailed>
      <DeepDive title="Cum rămân corecte tabelele după failover">
        <p>Gazda are în cache-ul ARP asocierea adresă virtuală → MAC virtual. După failover, noul Active folosește același MAC virtual, deci cache-ul gazdei rămâne valid și nu e nevoie de un ARP nou. Switch-urile, în schimb, trebuie să afle că MAC-ul virtual este acum accesibil pe alt port: noul Active trimite mesaje (de exemplu <G id="gratuitous-arp" />) care fac switch-urile să-și actualizeze tabela MAC. Fără această actualizare, cadrele ar continua spre portul vechi, până la expirarea intrării (aging).</p>
      </DeepDive>
      <Traps items={[
        <>Redundanța fizică (două routere) nu înseamnă redundanță de gateway: fără FHRP, gazdele sunt legate de adresa unuia singur.</>,
        <>Gazdele trebuie să folosească <b>adresa virtuală</b> ca gateway, nu adresa reală a unui router. Dacă pui adresa reală, failover-ul nu le ajută.</>,
        <>Failover-ul nu este instantaneu: durează cât timpul de detecție (la HSRP, implicit aproximativ hold time de 10 s).</>,
      ]} />
      <InlineQuiz ids={['3.5-002', '3.5-003', '3.5-004']} />
    </section>
  );
}

/* ======================================================================
   2. Conceptele FHRP
   ====================================================================== */
export function ConceptsSection() {
  return (
    <section id="concepts" className="section">
      <SectionHead id="concepts" code="3.5" title="Conceptele FHRP: adresă virtuală, MAC virtual, roluri" />
      <Summary>
        <p>Toate FHRP-urile au aceleași componente: un grup de routere, o <G id="virtual-ip" />, o <G id="virtual-mac" />, un router care forwardează (Active/Master), unul sau mai multe de rezervă, mesaje Hello și o regulă de alegere pe bază de <b>prioritate</b>.</p>
      </Summary>
      <Detailed title="1. Cum arată un grup (exemplu HSRP)">
        <p>R1 are pe interfața LAN adresa reală 192.168.10.1, R2 are 192.168.10.2, iar adresa virtuală este 192.168.10.254. PC-urile au ca gateway 192.168.10.254. Când un PC face ARP pentru .254, răspunde doar <G id="active-router" />, cu MAC-ul virtual al grupului. <G id="standby-router" /> primește cererea, dar tace.</p>
        <Figure caption="ARP către adresa virtuală: doar routerul Active răspunde, cu MAC-ul virtual.">
          <VirtualGatewayArp />
        </Figure>
        <Table head={['Concept', 'Rol', 'Exemplu']} rows={[
          ['Adresa virtuală', 'Default gateway-ul gazdelor', '192.168.10.254'],
          ['MAC-ul virtual', 'Răspuns la ARP; se mută cu rolul Active', '0000.0C07.AC01 (HSRPv1, grup 1)'],
          ['Active (HSRP) / Master (VRRP)', 'Forwardează și răspunde la ARP', 'R1'],
          ['Standby (HSRP) / Backup (VRRP)', 'Așteaptă și preia dacă Active cade', 'R2'],
          ['Hello', 'Semnalul de viață între routere', 'La 3 s (HSRP implicit)'],
          ['Prioritate', 'Decide cine e Active', '100 implicit, 110 pe R1'],
        ]} />
      </Detailed>
      <Detailed title="2. Cum se desfășoară un failover, pas cu pas">
        <ol>
          <li>R1 este Active și trimite Hello-uri; R2 este Standby și le ascultă.</li>
          <li>R1 cade (alimentare, cablu, interfață). Hello-urile se opresc.</li>
          <li>R2 nu mai aude Hello; după ce expiră <b>hold timer</b>-ul (<G id="hsrp-hello-hold" />, implicit 10 s), declară Active picat.</li>
          <li>R2 devine Active: preia adresa și MAC-ul virtuale și răspunde la ARP pentru ele.</li>
          <li>Switch-urile își actualizează tabela MAC pentru MAC-ul virtual; gazdele continuă să trimită la aceeași adresă, fără modificări.</li>
        </ol>
        <p>Când R1 revine, are două variante: rămâne Standby (implicit la HSRP) sau își ia rolul înapoi dacă are prioritate mai mare <b>și</b> preempt este activ.</p>
      </Detailed>
      <Detailed title="3. Prioritate, preempt, tracking">
        <ul>
          <li><b><G id="hsrp-priority" /></b>: valoare 0–255, implicit 100; cea mai mare câștigă; la egalitate, adresa IP cea mai mare de pe interfață.</li>
          <li><b><G id="fhrp-preempt" /></b>: permite unui router cu prioritate mai mare să ia rolul. La HSRP e dezactivat implicit, la VRRP e activat.</li>
          <li><b><G id="hsrp-tracking" /></b>: scade prioritatea când o interfață urmărită (uplink) cade, ca rolul să se mute pe routerul care mai are cale spre exterior.</li>
        </ul>
        <Callout kind="warn" title="Capcana clasică">
          Cele două routere trebuie configurate pe aceeași interfață logică (aceeași subrețea), cu același număr de grup, aceeași adresă virtuală și aceeași versiune. O diferență la oricare din ele poate lăsa ambele routere Active.
        </Callout>
      </Detailed>
      <DeepDive title="FHRP și stratul 2: unde se leagă STP și SVI-urile">
        <p>În campus, gateway-urile sunt de obicei <G id="svi" />-uri pe <G id="l3-switch" />-uri de distribution. HSRP rulează pe SVI-ul fiecărui VLAN. Bună practică: pentru fiecare VLAN, switch-ul care este Active HSRP este și <G id="stp" /> root bridge, ca traficul de la gazde să nu parcurgă un salt L2 în plus până la gateway. Distribuirea încărcării se face alternând rolurile între VLAN-uri: switch A este Active/root pentru VLAN 10, switch B pentru VLAN 20.</p>
      </DeepDive>
      <Traps items={[
        <>Adresa virtuală trebuie să fie în subrețeaua gazdelor și <b>neutilizată</b> de alt dispozitiv.</>,
        <>Doar Active răspunde la ARP pentru adresa virtuală; dacă vezi răspunsuri de la ambele routere, ai un dublu Active (greșeală de configurare).</>,
        <>Priority mai mare nu înseamnă automat Active: fără preempt, rolul deja deținut nu se pierde.</>,
      ]} />
      <InlineQuiz ids={['3.5-006', '3.5-007', '3.5-008', '3.5-009', '3.5-010']} />
    </section>
  );
}

/* ======================================================================
   3. HSRP, VRRP, GLBP
   ====================================================================== */
export function ProtocolsSection() {
  return (
    <section id="protocols" className="section">
      <SectionHead id="protocols" code="3.5" title="HSRP, VRRP și GLBP — comparație" />
      <Summary>
        <p>Cele trei protocoale rezolvă aceeași problemă, dar diferă prin <b>proprietar vs. standard</b>, <b>nume de roluri</b>, <b>adrese și transport</b>, <b>preempt implicit</b> și <b>echilibrare</b>. GLBP este singurul care distribuie nativ gazdele între routere; HSRP și VRRP au un singur router activ per grup.</p>
      </Summary>
      <Detailed title="1. Tabelul de comparație">
        <Table head={['', 'HSRP', 'VRRP', 'GLBP']} hlCol={0} rows={[
          ['Standard', 'Cisco', 'IETF (RFC 5798)', 'Cisco'],
          ['Roluri', 'Active / Standby', 'Master / Backup', 'AVG / AVF'],
          ['Multicast', 'v1 224.0.0.2 · v2 224.0.0.102 (UDP 1985)', '224.0.0.18 (IP proto 112)', '224.0.0.102 (UDP 3222)'],
          ['MAC virtual', 'v1 0000.0C07.ACxx · v2 0000.0C9F.Fxxx', '0000.5E00.01xx', '0007.B400.xxyy'],
          ['Grupuri', 'v1 0–255 · v2 0–4095', '1–255', '0–1023'],
          ['Preempt implicit', 'Dezactivat', 'Activat', 'Dezactivat (AVG)'],
          ['Echilibrare', 'Per grup (mai multe grupuri)', 'Per grup', 'Nativă, per gazdă'],
        ]} />
        <Callout kind="info" title="Verifică valorile pe platforma ta">
          Tabelul reflectă documentația uzuală. Valorile pentru VRRP și GLBP (în special intervalele de grup) nu au fost verificate pe echipamente de autorul lecției; pentru examen reține în primul rând diferențele de standard, roluri, preempt și echilibrare.
        </Callout>
      </Detailed>
      <Detailed title="2. HSRP — Cisco, cel mai important pentru CCNA">
        <p><G id="hsrp" /> a fost primul FHRP și este cel cerut cu adâncime la CCNA. Rolurile sunt Active și Standby, cu restul routerelor în Listen. Versiunea 2 extinde numerele de grup (0–4095), adaugă suport IPv6 și folosește altă adresă multicast și alt MAC virtual; versiunile <b>nu interoperează</b>.</p>
      </Detailed>
      <Detailed title="3. VRRP — varianta standard">
        <p><G id="vrrp" /> face același lucru, dar este deschis, deci funcționează între producători. Termenii sunt Master (<G id="vrrp-master" />) și Backup. O particularitate: routerul care deține adresa virtuală ca adresă reală are prioritatea 255 și devine Master. Preempt este activ implicit, ceea ce îl deosebește de HSRP.</p>
      </Detailed>
      <Detailed title="4. GLBP — redundanță și echilibrare">
        <p>La HSRP și VRRP, cu un singur grup, un router lucrează și celălalt stă degeaba. <G id="glbp" /> folosește un <G id="glbp-avg" /> care răspunde la ARP-urile gazdelor cu MAC-uri virtuale <b>diferite</b>, aparținând mai multor <G id="glbp-avf" />. Astfel, gazdele diferite folosesc routere diferite, deși toate au aceeași adresă de gateway. Metoda implicită este round-robin; există și weighted și host-dependent.</p>
        <Figure caption="GLBP: același gateway virtual, MAC-uri virtuale diferite pentru gazde diferite.">
          <GlbpBalancing />
        </Figure>
      </Detailed>
      <Callout kind="exam" title="Cum alegi la examen">
        „Standard deschis” → VRRP. „Proprietar Cisco cu load balancing nativ” → GLBP. „Active/Standby, Cisco” → HSRP. „Preempt implicit” → VRRP (HSRP nu).
      </Callout>
      <Traps items={[
        <>HSRP și GLBP sunt Cisco; doar VRRP este standard IETF.</>,
        <>VRRP are preempt <b>activ</b> implicit; HSRP îl are <b>dezactivat</b>.</>,
        <>HSRPv1 și HSRPv2 nu interoperează.</>,
        <>HSRP nu echilibrează singur: pentru distribuție folosești mai multe grupuri cu Active diferiți; GLBP o face nativ.</>,
        <>VRRP folosește protocolul IP 112, nu UDP; HSRP folosește UDP 1985.</>,
      ]} />
      <InlineQuiz ids={['3.5-018', '3.5-019', '3.5-022', '3.5-024']} />
    </section>
  );
}

/* ======================================================================
   4. HSRP în detaliu
   ====================================================================== */
export function HsrpSection() {
  return (
    <section id="hsrp" className="section">
      <SectionHead id="hsrp" code="3.5" title="HSRP în detaliu: stări, alegere, preempt, tracking" />
      <Summary>
        <p>Într-un grup HSRP trec routerele prin stări (Initial … Active), apoi ajung la un Active și un Standby. Alegerea se face după <b>prioritate</b>, apoi după <b>adresa IP</b> cea mai mare. <b>Preempt</b> și <b>tracking</b> decid dacă și când rolul se mută la schimbări.</p>
      </Summary>
      <Detailed title="1. Stările HSRP">
        <p>Un router trece printr-un lanț de stări. Doar ultimele două sunt roluri stabile cu funcții: Standby (în așteptare) și Active (forwardează). Restul routerelor din grup rămân în Listen.</p>
        <Figure caption="Interactiv: alege o stare și vezi ce înseamnă.">
          <HsrpStates />
        </Figure>
      </Detailed>
      <Detailed title="2. Alegerea Active: prioritate, IP și preempt">
        <p>Regula are trei straturi. 1) Cea mai mare prioritate câștigă. 2) La egalitate, cea mai mare adresă IP de pe interfață. 3) Dacă un Active există deja, un router nou nu îl înlocuiește decât cu preempt activ <i>și</i> prioritate mai mare. Încearcă combinațiile.</p>
        <Figure caption="Interactiv: modifică prioritatea lui R1, momentul pornirii și preempt-ul.">
          <HsrpElection />
        </Figure>
      </Detailed>
      <Detailed title="3. Tracking: ce se întâmplă când pierzi uplinkul">
        <p>Un router poate fi Active spre LAN, dar să-și fi pierdut legătura spre exterior. Fără tracking ar rămâne Active și ar „înghiți” traficul gazdelor. Cu <code>standby 1 track GigabitEthernet0/1 20</code>, când Gi0/1 cade prioritatea scade cu 20. Pentru ca rolul să se mute, celălalt router trebuie să aibă <b>preempt</b>.</p>
        <Figure caption="Interactiv: pica uplinkul lui R1 și schimbă preempt-ul pe R2.">
          <HsrpTracking />
        </Figure>
      </Detailed>
      <Detailed title="4. Distribuirea încărcării cu HSRP">
        <p>Un grup are un singur Active, deci cu un grup un router lucrează și celălalt așteaptă. Soluția: două grupuri (de obicei câte unul pe VLAN), cu priorități inversate. R1 este Active pentru grupul 1 și Standby pentru grupul 2; R2 invers. Jumătate din gazde folosesc ca gateway adresa virtuală a grupului 1, cealaltă jumătate pe cea a grupului 2. Dacă un router cade, celălalt devine Active pentru ambele grupuri.</p>
        <Table head={['', 'Grup 1 (VIP .254)', 'Grup 2 (VIP .253)']} rows={[
          ['R1', 'priority 110 · Active', 'priority 100 · Standby'],
          ['R2', 'priority 100 · Standby', 'priority 110 · Active'],
          ['Gazde', 'gateway .254', 'gateway .253'],
        ]} />
      </Detailed>
      <DeepDive title="IPv6 și FHRP">
        <p>Pentru IPv6, gazdele își află gateway-ul din mesaje Router Advertisement, deci rolul FHRP este un pic diferit, dar problema rămâne: gateway-ul trebuie să rămână disponibil. HSRP versiunea 2 acceptă IPv6, iar VRRP versiunea 3 acoperă atât IPv4, cât și IPv6. Detaliile depășesc cerința CCNA; reține că FHRP nu este doar pentru IPv4.</p>
      </DeepDive>
      <Traps items={[
        <>Tracking fără preempt pe routerul Standby <b>nu mută</b> rolul: prioritatea scade, dar Active rămâne Active.</>,
        <>Preempt se activează pe routerul care <b>trebuie să preia</b> rolul (și de obicei pe cel care vrea să-l recapete după revenire).</>,
        <>Doi routere „Active” în același grup indică un dezacord de configurare (versiune, grup, adresă virtuală) sau Hello-uri care nu ajung între routere.</>,
        <>Grupul în hexazecimal formează MAC-ul: grupul 10 la HSRPv1 este 0000.0C07.AC<b>0A</b>, nu AC10.</>,
      ]} />
      <InlineQuiz ids={['3.5-012', '3.5-013', '3.5-014', '3.5-029', '3.5-030']} />
    </section>
  );
}
