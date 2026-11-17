import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { DaiDemo, DhcpSnoopingDemo, PortSecSim } from '../../diagrams/t5_7';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.7" title="Securitatea Layer 2 — imaginea de ansamblu" />
      <Summary>
        <p>Majoritatea protocoalelor dintr-un LAN — învățarea adreselor MAC, <G id="arp" />, <G id="dhcp" /> — au fost proiectate într-o epocă în care toate gazdele erau presupuse oneste. Un atacator conectat la un port de switch poate exploata exact această încredere. Obiectivul 5.7 cere să <b>configurezi și să verifici</b> trei apărări: <b><G id="port-security" /></b>, <b><G id="dhcp-snooping" /></b> și <b><G id="dai" /></b>.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial este <i>Configure and verify Layer 2 security features (DHCP snooping, dynamic ARP inspection, and port security)</i>; are tip <b>Configure and verify</b>, deci trebuie să știi comenzile, valorile implicite și simptomele. Îl predăm în ordinea: port security → DHCP snooping → DAI, pentru că ultima o folosește pe cea dinainte.</p>
        <Table head={['Atac / problemă', 'Ce se întâmplă', 'Apărare']} hlCol={0} rows={[
          ['Dispozitiv neautorizat într-un port liber', 'oricine se conectează și primește acces', 'port security'],
          ['MAC flooding', 'tabela MAC se umple, switch-ul inundă ca un hub', 'port security (limită de MAC)'],
          ['Server DHCP fals', 'clienții primesc gateway/DNS false', 'DHCP snooping'],
          ['DHCP starvation', 'pool-ul serverului legitim e epuizat', 'port security + rate limit snooping'],
          ['ARP spoofing / poisoning', 'cache-uri ARP otrăvite → man-in-the-middle', 'DAI (cu binding table)'],
        ]} />
        <Analogy>Imaginează-ți un hotel unde fiecare cameră are un <b>limitator</b> de oaspeți înregistrați (port security), un recepționer care <b>nu acceptă „oferte de cazare” de la oricine</b>, ci doar de la biroul oficial (DHCP snooping), și un portar care verifică <b>fiecare mesaj „camera 12 este a domnului X”</b> față de registrul real (DAI). Fără ele, oricine poate pretinde orice.</Analogy>
        <Callout kind="info" title="Se aplică pe porturile de acces">
          Aceste funcții se configurează pe <b>switch-uri de acces</b>, spre stațiile utilizatorilor. Uplinkurile spre alte switch-uri/routere/servere sunt de obicei „trusted” (la DHCP snooping/DAI) și nu au port security. Pentru autentificarea utilizatorilor care se conectează la port există 802.1X (vezi 5.8), un strat complementar.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Cele trei funcții se <b>completează</b>: niciuna nu le înlocuiește pe celelalte.</>,
        <>Port security <b>nu criptează</b> și nu autentifică utilizatorul; limitează doar adresele MAC.</>,
        <>DAI fără DHCP snooping (sau fără ARP ACL) ar arunca ARP-urile legitime, pentru că nu are binding table.</>,
      ]} />
      <InlineQuiz ids={['5.7-001', '5.7-002', '5.7-003', '5.7-004']} />
    </section>
  );
}

/* ======================================================================
   1. Port security
   ====================================================================== */
export function PortSecSection() {
  return (
    <section id="portsec" className="section">
      <SectionHead id="portsec" code="5.7" title="Port security — limitarea adreselor MAC pe port" />
      <Summary>
        <p>Port security spune switch-ului: „pe acest port au voie doar anumite adrese MAC, cel mult N”. Când apare o adresă în plus, switch-ul reacționează după <G id="violation-mode" />: <b>protect</b> (aruncă tăcut), <b>restrict</b> (aruncă + loghează) sau <b>shutdown</b> (închide portul, <G id="err-disabled" />). Implicit, după activare: <b>maximum 1 adresă</b> și mod <b>shutdown</b>.</p>
      </Summary>
      <Detailed title="1. De ce și cum funcționează">
        <p>Un switch învață adrese MAC din cadrele primite și le pune în tabela MAC (vezi 1.13). Fără protecție, orice dispozitiv conectat la un port liber este acceptat, iar un atacator poate trimite mii de cadre cu adrese sursă inventate ca să umple tabela (<G id="mac-flooding" />). Port security adaugă o politică pe port: <b>câte</b> adrese și <b>care</b>.</p>
        <ol>
          <li>Activezi funcția pe un port <b>static</b> (<code>switchport mode access</code>; nu „dynamic”).</li>
          <li>Switch-ul stabilește lista de <G id="secure-mac-address" />: statice (configurate), dinamice (învățate) sau <G id="sticky-mac" /> (învățate și scrise în running-config).</li>
          <li>Pentru fiecare cadru cu MAC sursă nou: dacă lista nu e plină, MAC-ul se adaugă; dacă e plină → <b>violare</b>.</li>
          <li>Violare și mai ales: o adresă sigură apărută pe <i>alt</i> port al aceluiași VLAN este tot violare.</li>
        </ol>
        <Table head={['Parametru', 'Implicit', 'Comandă']} hlCol={0} rows={[
          ['Activare', 'dezactivat', 'switchport port-security'],
          ['Adrese maxime', '1', 'switchport port-security maximum N'],
          ['Mod de violare', 'shutdown', 'switchport port-security violation protect|restrict|shutdown'],
          ['Adresă statică', '—', 'switchport port-security mac-address <MAC>'],
          ['Învățare sticky', 'dezactivat', 'switchport port-security mac-address sticky'],
          ['Aging (expirare)', 'dezactivat (0)', 'switchport port-security aging time <min> · aging type absolute|inactivity'],
        ]} />
      </Detailed>
      <Detailed title="2. Simulator interactiv">
        <p>Alege maximul, modul de violare și tipul de învățare, apoi „conectează” dispozitive pe portul Fa0/1. Primul dispozitiv devine adresă sigură; când depășești limita, vezi reacția fiecărui mod.</p>
        <Figure caption="Interactiv: implicit (max 1, shutdown) al doilea dispozitiv închide portul; cu restrict/protect portul rămâne UP, dar cadrele ilegale sunt aruncate.">
          <PortSecSim />
        </Figure>
      </Detailed>
      <Detailed title="3. Cele trei moduri de violare">
        <Table head={['Mod', 'Cadrele ilegale', 'Syslog/SNMP', 'Contor violări', 'Portul']} hlCol={0} rows={[
          ['protect', 'aruncate', 'nu', 'nu crește', 'rămâne UP'],
          ['restrict', 'aruncate', 'da', 'crește', 'rămâne UP'],
          ['shutdown (implicit)', 'portul se închide', 'da', 'crește', 'err-disabled (DOWN)'],
        ]} />
        <p>Un port în <b>err-disabled</b> nu transmite nimic și se recuperează manual (<code>shutdown</code> apoi <code>no shutdown</code>, după ce elimini cauza) sau automat cu <G id="errdisable-recovery" /> (<code>errdisable recovery cause psecure-violation</code>; intervalul implicit este 300 s, iar recuperarea automată este dezactivată implicit). Starea se vede în <code>show interfaces status err-disabled</code> și <code>show port-security interface …</code>.</p>
      </Detailed>
      <Detailed title="4. Cum alegi valoarea maximă">
        <ul>
          <li>Un PC singur → maximum 1 (implicit).</li>
          <li>PC în spatele unui telefon IP → de obicei maximum 2 (telefonul și PC-ul), eventual 3 în funcție de configurația VLAN voce.</li>
          <li>Port spre un mini-switch sau hub → numărul de dispozitive așteptate; de regulă e o idee proastă la un port de acces.</li>
          <li>Politică strictă („doar acest laptop”) → adresă <b>statică</b> sau sticky cu maximum 1.</li>
        </ul>
        <Callout kind="exam" title="Sticky nu înseamnă salvat">
          Adresele sticky stau în <b>running-config</b>. Dacă nu rulezi <code>copy running-config startup-config</code>, la repornire switch-ul le învață din nou (de la primul dispozitiv conectat). Atenție la inversul: un laptop mutat pe alt port cu sticky va provoca violare dacă adresa lui este deja „lipită” de portul vechi.
        </Callout>
      </Detailed>
      <DeepDive title="Ce nu face port security">
        <p>Port security se uită la adresa MAC sursă a cadrelor; un atacator poate <b>falsifica</b> (spoof) o adresă MAC autorizată dacă o cunoaște, așa că nu este autentificare puternică. Pentru autentificarea reală a dispozitivelor/utilizatorilor se folosește <G id="dot1x" /> (5.8). Nu limitează nici traficul pe port, doar adresele sursă; nu criptează și nu apără împotriva atacurilor ARP/DHCP — de aceea urmează celelalte două funcții.</p>
      </DeepDive>
      <Traps items={[
        <>Port security cere port <b>static</b> (<code>switchport mode access</code>); pe un port „dynamic” comanda este respinsă.</>,
        <>Implicit: <b>1 MAC</b> + <b>shutdown</b>. Un telefon + PC cu maximum 1 = port închis.</>,
        <>Doar <b>shutdown</b> pune portul în err-disabled; <b>protect</b> și <b>restrict</b> îl lasă UP.</>,
        <>Sticky trăiește în running-config: salvează configurația.</>,
      ]} />
      <InlineQuiz ids={['5.7-009', '5.7-010', '5.7-011', '5.7-012', '5.7-014']} />
    </section>
  );
}

/* ======================================================================
   2. DHCP snooping
   ====================================================================== */
export function SnoopingSection() {
  return (
    <section id="snooping" className="section">
      <SectionHead id="snooping" code="5.7" title="DHCP snooping — oprește serverele DHCP false" />
      <Summary>
        <p>DHCP snooping împarte porturile în <b><G id="trusted-port" /></b> (de încredere: spre serverul DHCP legitim și uplinkuri) și <b>untrusted</b> (spre utilizatori, implicit). Pe un port untrusted, switch-ul <b>aruncă mesajele DHCP „de server”</b> (OFFER, ACK, NAK), deci un <G id="rogue-dhcp-server" /> nu poate da configurații. Din tranzacțiile legitime construiește <G id="dhcp-snooping-binding" />, folosită de DAI.</p>
      </Summary>
      <Detailed title="1. Recapitulare DHCP și ce poate merge prost">
        <p>Un client nou trimite <b>DISCOVER</b> (broadcast), serverele răspund cu <b>OFFER</b>, clientul cere cu <b>REQUEST</b> și serverul confirmă cu <b>ACK</b> (DORA, vezi 4.3). DHCP nu autentifică serverele: clientul ia de obicei prima ofertă primită. Doi atacatori clasici:</p>
        <ul>
          <li><b>Server DHCP fals</b>: un atacator răspunde primul și dă clientului el însuși ca gateway sau DNS (<i>man-in-the-middle</i>) sau o rețea inutilizabilă (DoS).</li>
          <li><G id="dhcp-starvation" />: atacatorul trimite cereri cu zeci de MAC-uri false și golește pool-ul; clienții reali nu mai primesc adrese (adesea urmat de un server fals).</li>
        </ul>
      </Detailed>
      <Detailed title="2. Cum lucrează snooping-ul, pas cu pas">
        <ol>
          <li>Activezi <code>ip dhcp snooping</code> global și <code>ip dhcp snooping vlan 10</code> pe VLAN-urile dorite.</li>
          <li>Toate porturile din VLAN devin <b>untrusted</b>.</li>
          <li>Pe porturile untrusted: mesajele <b>OFFER, ACK, NAK</b> sunt <b>aruncate</b>; DISCOVER/REQUEST trec. Switch-ul verifică și că MAC-ul sursă al cadrului corespunde câmpului chaddr din DHCP (anti-spoof) și că DHCPRELEASE/DECLINE vin de pe portul corect.</li>
          <li>Porturile <b>trusted</b> (<code>ip dhcp snooping trust</code>) nu sunt filtrate: pe ele trec ofertele legitime.</li>
          <li>La fiecare ACK legitim, switch-ul adaugă o intrare în <b>binding table</b>: MAC, IP, lease, VLAN, port.</li>
          <li>Opțional, <code>ip dhcp snooping limit rate N</code> limitează pachetele DHCP/secundă pe port; depășirea duce de obicei la err-disabled.</li>
        </ol>
        <Figure caption="Interactiv: pornește/oprește snooping-ul și vezi ce se întâmplă cu oferta serverului fals; apoi simulează greșeala clasică (uplink netrusted).">
          <DhcpSnoopingDemo />
        </Figure>
      </Detailed>
      <Detailed title="3. Tabela de binding și persistența">
        <p>Tabela (<code>show ip dhcp snooping binding</code>) conține câte o intrare pentru fiecare client DHCP: MAC, IP, durata rămasă a lease-ului, tip (<code>dhcp-snooping</code>), VLAN și interfață. Este baza pentru DAI și IP Source Guard. Fiind în memorie, se pierde la repornire; <code>ip dhcp snooping database flash:snoop.db</code> permite salvarea ei într-un fișier, ca DAI să nu arunce ARP-urile clienților existenți după reload (până își reînnoiesc lease-ul).</p>
      </Detailed>
      <Detailed title="4. Opțiunea 82 și DHCP relay">
        <p>Când DHCP snooping este activ, switch-ul poate insera implicit <G id="dhcp-option-82" /> (informație despre port/switch) în cererile clientului. Dacă într-o topologie cu <G id="dhcp-relay" /> pachetele ajung la un alt switch cu snooping pe un port untrusted și conțin deja option 82, switch-ul le poate arunca. Soluțiile uzuale: <code>no ip dhcp snooping information option</code> (pe switch-ul care nu este cel de relay) sau marcarea portului ca trusted; comportamentul exact depinde de platformă și versiune.</p>
      </Detailed>
      <Traps items={[
        <>După activare, <b>toate</b> porturile sunt untrusted: dacă uiți trust pe uplink/serverul DHCP, <b>nimeni</b> nu mai primește adresă.</>,
        <>Snooping filtrează <b>răspunsurile serverului</b>, nu cererile clientului.</>,
        <>Binding table se pierde la reload dacă nu o salvezi într-un fișier.</>,
        <>Rate limit prea mic pe un port cu mulți clienți poate provoca err-disabled pe un port legitim.</>,
      ]} />
      <InlineQuiz ids={['5.7-018', '5.7-019', '5.7-020', '5.7-021', '5.7-022']} />
    </section>
  );
}

/* ======================================================================
   3. DAI
   ====================================================================== */
export function DaiSection() {
  return (
    <section id="dai" className="section">
      <SectionHead id="dai" code="5.7" title="Dynamic ARP Inspection (DAI) — oprește ARP spoofing" />
      <Summary>
        <p><G id="arp" /> leagă o adresă IP de o adresă MAC, dar nu are nicio autentificare. În <G id="arp-spoofing" />, atacatorul anunță „IP-ul gateway-ului este la MAC-ul meu” și interceptează traficul. DAI verifică fiecare ARP primit pe un port <b>untrusted</b> față de <b>binding table</b> DHCP snooping: dacă perechea IP–MAC nu corespunde, mesajul este aruncat și logat.</p>
      </Summary>
      <Detailed title="1. Cum funcționează atacul">
        <ol>
          <li>PC-A vrea să vorbească cu gateway-ul 192.168.10.1; trimite ARP „cine are 192.168.10.1?”.</li>
          <li>Atacatorul răspunde mai repede (sau trimite periodic un gratuitous ARP) cu „192.168.10.1 este la MAC-ul meu”.</li>
          <li>PC-A își memorează asocierea falsă; trimite tot traficul către atacator, care îl poate citi și retransmite (man-in-the-middle) sau arunca (DoS).</li>
        </ol>
        <Callout kind="info" title="Atacul din interior, fără exploit">
          Atacatorul nu sparge nimic: folosește un comportament normal al ARP. De aceea apărarea trebuie să fie în switch, unde se văd toate mesajele.
        </Callout>
      </Detailed>
      <Detailed title="2. Ce face DAI, pas cu pas">
        <ol>
          <li>Activezi <code>ip arp inspection vlan 10</code>. Toate porturile VLAN-ului sunt <b>untrusted</b> pentru DAI (ca la snooping, dar independent: trust-ul DAI se setă separat cu <code>ip arp inspection trust</code>).</li>
          <li>Pentru fiecare pachet ARP primit pe un port untrusted, switch-ul caută în binding table intrarea cu IP-ul din ARP.</li>
          <li>Dacă MAC-ul (și portul) corespund → ARP-ul trece. Altfel → <b>aruncat</b> și logat (<code>%SW_DAI-4-DHCP_SNOOPING_DENY</code>).</li>
          <li>Pe porturile <b>trusted</b> (uplinkuri, spre routere) ARP-ul trece fără verificare.</li>
        </ol>
        <Figure caption="Interactiv: alege scenariul și pornește/oprește DAI; urmărește comparația cu binding table.">
          <DaiDemo />
        </Figure>
      </Detailed>
      <Detailed title="3. Hosturi cu IP static și validări opționale">
        <p>Un host cu IP static nu apare în binding table, deci DAI îi aruncă ARP-urile. Soluții: o <b>ARP ACL</b> (<code>arp access-list STATIC</code> → <code>permit ip host 192.168.10.200 mac host eeee.eeee.0005</code>) aplicată cu <code>ip arp inspection filter STATIC vlan 10</code>, sau marcarea portului ca trusted (mai puțin sigur). Comanda <code>ip arp inspection validate src-mac dst-mac ip</code> adaugă verificări pe consistența MAC-urilor din antetul Ethernet și din corpul ARP și pe adresele IP invalide (0.0.0.0, 255.255.255.255, multicast).</p>
        <p>DAI are și o <b>limită de rată</b> pe porturile untrusted (documentat de obicei ca 15 pachete ARP pe secundă); depășirea pune portul în err-disabled. Pe porturile trusted limita nu se aplică. Pe unele platforme o poți modifica cu <code>ip arp inspection limit rate N</code>.</p>
      </Detailed>
      <DeepDive title="IP Source Guard (recunoaștere)">
        <p>Dacă DAI verifică <i>ARP</i>, <G id="ip-source-guard" /> verifică <i>pachetele IP</i> ale unei gazde: pe un port cu <code>ip verify source</code>, doar pachetele cu adresa IP sursă din binding table sunt acceptate. Nu este cerut explicit de 5.7, dar vezi cum cele trei funcții folosesc același binding table: DHCP snooping îl construiește; DAI și IP Source Guard îl consumă.</p>
      </DeepDive>
      <Traps items={[
        <>DAI fără DHCP snooping (sau ARP ACL) aruncă ARP-urile legitime: începe cu snooping.</>,
        <>Uplinkurile spre alte switch-uri și spre routere trebuie <b>trusted</b> pentru DAI, altfel își pierd ARP-ul.</>,
        <>Un host cu IP static „dispare” după DAI: are nevoie de ARP ACL.</>,
        <>Trust-ul DHCP snooping și trust-ul DAI sunt <b>comenzi separate</b>.</>,
      ]} />
      <InlineQuiz ids={['5.7-023', '5.7-024', '5.7-025', '5.7-027']} />
    </section>
  );
}

/* ======================================================================
   4. Împreună + depanare
   ====================================================================== */
export function TogetherSection() {
  return (
    <section id="together" className="section">
      <SectionHead id="together" code="5.7" title="Toate împreună: ordine de implementare și depanare" />
      <Summary>
        <p>Ordinea contează: <b>trust</b> pe uplinkuri → <b>DHCP snooping</b> → așteaptă <b>binding table</b> → <b>DAI</b> → <b>port security</b> pe porturile de acces. La depanare, pornești de la simptom și verifici funcția potrivită cu comanda ei <code>show</code>.</p>
      </Summary>
      <Detailed title="1. Planul de implementare">
        <Table head={['Pas', 'Ce faci', 'De ce în această ordine']} hlCol={0} rows={[
          ['1', 'Identifici uplinkurile și porturile serverelor/routerelor', 'trebuie marcate trusted înainte de activare'],
          ['2', 'ip dhcp snooping + vlan + trust pe uplink', 'începe construirea binding table, fără să rupi DHCP-ul'],
          ['3', 'Aștepți ca clienții să-și reînnoiască lease-ul (sau forțezi)', 'binding table trebuie să conțină clienții existenți'],
          ['4', 'ip arp inspection vlan + trust pe uplink (+ ARP ACL pentru IP static)', 'verifică ARP față de binding table complet'],
          ['5', 'port security pe porturile de acces (sticky, max N)', 'limită de MAC; independentă, dar completează restul'],
          ['6', 'errdisable recovery (opțional) și monitorizare syslog', 'reduce intervențiile manuale la violări']
        ]} />
      </Detailed>
      <Detailed title="2. Tabel de depanare">
        <Table head={['Simptom', 'Cauză probabilă', 'Verificare']} hlCol={0} rows={[
          ['Un port a intrat în err-disabled', 'violare port security / rate limit', 'show interfaces status err-disabled · show port-security interface …'],
          ['Niciun client nu primește adresă după snooping', 'uplink/server netrusted', 'show ip dhcp snooping · show ip dhcp snooping binding'],
          ['Clienții primesc adrese, dar DAI le blochează ARP-ul', 'binding table incompletă / uplink netrusted la DAI', 'show ip arp inspection vlan 10 · …statistics'],
          ['Imprimanta statică nu comunică', 'fără binding și fără ARP ACL', 'show ip arp inspection · arp access-list'],
          ['Port legitim mutat pe alt port cu sticky', 'MAC lipit de portul vechi', 'show port-security address'],
          ['Porturi se închid „aleator”', 'rate limit prea mic', 'show ip dhcp snooping · show ip arp inspection interfaces'],
        ]} />
      </Detailed>
      <Callout kind="exam" title="Ce întreabă de obicei examenul">
        (1) Valorile implicite ale port security (1 MAC, shutdown). (2) Diferența protect/restrict/shutdown. (3) Ce se aruncă pe un port untrusted de DHCP snooping. (4) De ce DAI depinde de binding table. (5) Care port se marchează trusted și cu ce comandă. (6) Ce funcție apără de ce atac.
      </Callout>
      <Traps items={[
        <>Nu activa DAI înainte ca binding table să se fi populat.</>,
        <>Nu pune port security pe uplinkuri între switch-uri (multe MAC-uri) fără să știi ce faci.</>,
        <>După o violare, nu uita să elimini <b>cauza</b> înainte de <code>no shutdown</code>; altfel portul reintră în err-disabled.</>,
      ]} />
      <InlineQuiz ids={['5.7-008', '5.7-015', '5.7-016', '5.7-026']} />
    </section>
  );
}
