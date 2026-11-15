import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import {
  Consolidation, DockerFlow, HypervisorTypes, K8sCluster, L3vpnDiagram, NfvDiagram,
  VirtTimeline, VmVsContainer, VrfRouter, VSwitchDiagram,
} from '../../diagrams/t1_12';

/* ======================================================================
   0. Introducere — de ce virtualizăm și ce anume virtualizăm
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.12" title="Virtualizarea — imaginea de ansamblu" />
      <Summary>
        <p><b>Virtualizarea</b> înseamnă să „păcălești” software-ul că are o resursă doar a lui, deși o împarte cu alții. Topicul 1.12 îți cere trei variante: <b>virtualizarea serverelor</b> (mai multe <G id="vm">VM</G>-uri pe un singur server fizic, cu ajutorul unui <G id="hypervisor" />),
          <b> containerele</b> (mai multe aplicații izolate care împart același kernel) și <b><G id="vrf">VRF</G>-urile</b> (mai multe tabele de rutare independente pe un singur router).
          Ideea comună: un echipament fizic, mai multe „copii” logice, izolate între ele.</p>
      </Summary>

      <Detailed>
        <p>Obiectivul oficial 1.12 este o singură linie: <i>Explain virtualization fundamentals (server virtualization, containers, and VRFs)</i>. Verbul este „Explain” — la examen nu configurezi un hypervisor, dar trebuie să știi să <b>deosebești</b> tehnologiile, să recunoști cine rulează unde și să înțelegi ce legătură au toate acestea cu rețeaua (placa de rețea virtuală, switch-ul virtual, trunk-ul spre serverul fizic, VRF-ul de pe router).</p>
        <Table head={['Secțiune', 'Ce virtualizează', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['1.12 · server', 'hardware-ul unui calculator (CPU, RAM, disc, plăci de rețea)', 'Cum rulează zece servere „independente” pe o singură mașină și cum ajung ele în rețea?'],
          ['1.12 · containere', 'sistemul de operare (kernelul e partajat)', 'De ce pornește o aplicație în secunde, iar o VM în minute, și ce face Kubernetes?'],
          ['1.12 · VRF', 'planul de rutare de nivel 3 al unui router', 'Cum folosesc doi clienți aceeași rețea 192.168.1.0/24 pe același router fără conflict?'],
          ['1.12 · comparație', 'VM · container · VRF · VLAN', 'Ce tehnologie aleg pentru ce problemă și cum nu le încurc la examen?'],
        ]} />
        <Callout kind="info" title="De ce 1.12 apare într-un curs de networking">
          Pare un subiect „de sysadmin”, dar rețeaua modernă e construită în jurul lui: aproape orice server dintr-un data center sau din cloud este o VM sau un container; legătura lor cu rețeaua trece printr-un <b>switch virtual</b> și un <b>trunk 802.1Q</b> spre switch-ul fizic; iar funcțiile de rețea însele (routere, firewall-uri, controllere wireless) rulează tot mai des ca VM-uri (NFV). Iar VRF-ul este „virtualizarea” propriu-zisă a unui router.
        </Callout>

        <h3>Problema: un server, o aplicație</h3>
        <p>La începutul anilor 2000, regula era simplă: <b>o aplicație importantă = un server fizic</b>. Motivele erau bune — dacă două aplicații se strică reciproc, nu vrei să cazi cu ambele; fiecare aplicație cerea o versiune anume de sistem de operare; și nimeni nu voia ca o actualizare a unei aplicații să o dărâme pe alta. Efectul secundar a fost costisitor: sute de servere care lucrau <b>puțin</b> (un server de e-mail sau de fișiere folosește doar o fracțiune din procesor), dar consumau rack, curent, aer condiționat, cabluri și porturi de switch fiecare.</p>
        <Figure caption="Interactiv: comută între „înainte” (o aplicație pe server, resurse irosite) și „după” (patru VM-uri pe un singur host, aceeași izolare logică).">
          <Consolidation />
        </Figure>
        <p>Virtualizarea rezolvă exact asta: <b>consolidarea</b>. Un singur server puternic găzduiește mai multe mașini virtuale; fiecare VM are propriul sistem de operare, propriile aplicații, propria adresă IP și MAC, deci fiecare „crede” că e un calculator separat. Se adaugă beneficii care nu existau cu servere fizice:</p>
        <ul>
          <li><b>Utilizare mai bună</b> a hardware-ului și mai puține servere de cumpărat, alimentat și răcit.</li>
          <li><b>Provizionare rapidă</b>: o VM nouă se clonează dintr-un șablon în minute, nu se comandă un server și se așteaptă livrarea.</li>
          <li><b>Snapshot-uri</b>: salvezi starea unei VM înainte de o actualizare și revii dacă ceva nu merge.</li>
          <li><b>Mutarea unei VM pe alt server</b> (chiar și pornită, prin <G id="live-migration" />) pentru mentenanță sau echilibrare.</li>
          <li><b>Izolare</b>: o VM blocată nu trage după ea restul VM-urilor de pe același host.</li>
          <li>Baza <b>cloud-ului</b>: o instanță EC2, Azure VM sau Compute Engine este o VM pe care o închiriezi (<G id="iaas" />).</li>
        </ul>
        <Analogy>Gândește-te la un bloc de apartamente față de o casă. Înainte, fiecare familie (aplicație) avea casa ei, cu fundație, acoperiș și racorduri proprii — scump, iar jumătate din camere stăteau goale. Virtualizarea construiește un bloc: aceeași parcelă (serverul fizic), dar fiecare familie are apartament cu ușă și cheie proprii (VM), iar administratorul blocului (hypervisorul) împarte apa, curentul și căldura. Containerele sunt mai degrabă camere într-un cămin: fiecare are cheie, dar bucătăria și instalațiile (kernelul) sunt comune. VRF-ul este ca un bloc cu mai multe scări, fiecare cu propria listă de interfon: aceeași clădire, liste complet separate.</Analogy>

        <h3>Trei tehnologii, trei lucruri virtualizate</h3>
        <Table head={['Tehnologie', 'Ce se împarte între „copii”', 'Ce are fiecare „copie” în plus, doar al ei', 'Unde trăiește']} rows={[
          [<b><G id="vm">Mașină virtuală</G></b>, 'hardware-ul fizic (via hypervisor)', 'propriul sistem de operare complet (guest OS), propriul kernel', 'server, cloud, laptop'],
          [<b><G id="container">Container</G></b>, 'kernelul sistemului gazdă', 'procese izolate, propriile biblioteci, propria stivă de rețea', 'server, cloud, uneori echipament de rețea'],
          [<b><G id="vrf">VRF</G></b>, 'echipamentul fizic (routerul) și sistemul lui de operare', 'propria tabelă de rutare, propriile interfețe, propriul proces de rutare', 'router / switch de nivel 3'],
        ]} />
        <Figure caption="Cronologia pe scurt: de la mainframe-urile anilor ’60 la Docker și Kubernetes. Virtualizarea nu e o invenție recentă — x86 a ajuns la ea abia după 1999.">
          <VirtTimeline />
        </Figure>
        <Callout kind="tip" title="Ordinea de predare">
          Cisco listează cele trei teme într-o singură propoziție, fără sub-puncte a/b/c. Le parcurgem în ordinea din obiectiv: server → containere → VRF, apoi le comparăm. Codul oficial rămâne 1.12 peste tot.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: cum „păcălește” un hypervisor un sistem de operare">
        <p>Un sistem de operare normal presupune că el e singurul stăpân al procesorului: execută instrucțiuni privilegiate (acces la memorie fizică, la dispozitive, la tabelele de pagini). Dacă două sisteme de operare ar face asta simultan, s-ar strica reciproc. Hypervisorul trebuie deci să stea <b>deasupra</b> lor și să intercepteze operațiile privilegiate.</p>
        <ol>
          <li>Procesoarele moderne au extensii de virtualizare hardware (<G id="hw-virt" />: Intel VT-x, AMD-V) — un mod de execuție suplimentar, mai privilegiat decât kernelul guest-ului.</li>
          <li>Guest OS-ul rulează „aproape normal”; când încearcă o operație sensibilă (de exemplu să acceseze o placă de rețea), procesorul oprește execuția și predă controlul hypervisorului.</li>
          <li>Hypervisorul emulează sau mediază operația: dacă guest-ul „trimite” un cadru prin placa lui de rețea, hypervisorul îl preia și îl pasează <b>switch-ului virtual</b>.</li>
          <li>Memoria RAM e împărțită în zone separate; CPU-ul e planificat pe felii de timp între vCPU-uri, ca procesele într-un sistem de operare obișnuit.</li>
        </ol>
        <p>Fără extensiile hardware, virtualizarea pe x86 era posibilă doar cu trucuri software costisitoare. De aceea, în BIOS/UEFI, opțiunea „Virtualization Technology” trebuie să fie activată ca VirtualBox sau GNS3 VM să pornească VM-uri pe 64 de biți — o cauză clasică a erorilor la începători.</p>
      </DeepDive>

      <Traps items={[
        <><b>Virtualizare ≠ emulare</b>: la virtualizare, instrucțiunile guest-ului rulează direct pe procesorul real; emulatorul le traduce pe fiecare. Din acest motiv VM-urile sunt rapide.</>,
        <>Cele trei teme nu sunt interschimbabile: <b>VM</b> virtualizează hardware-ul, <b>containerul</b> virtualizează sistemul de operare, <b>VRF-ul</b> virtualizează rutarea de nivel 3.</>,
        <>O VM <b>nu</b> este un fișier „pornit”: este un set de resurse alocate (vCPU, RAM, vNIC) plus un fișier de disc virtual. Când e oprită, ocupă doar disc.</>,
      ]} />
      <InlineQuiz ids={['1.12-001', '1.12-002', '1.12-003', '1.12-004']} />
    </section>
  );
}

/* ======================================================================
   1. Virtualizarea serverelor
   ====================================================================== */
export function Server() {
  return (
    <section id="server" className="section">
      <SectionHead id="server" code="1.12 · server" title="Virtualizarea serverelor — hypervisor, VM, vNIC, virtual switch" />
      <Summary>
        <p>Un <b><G id="hypervisor" /></b> împarte un server fizic (<b>host</b>) în mai multe <b><G id="vm">VM</G></b>-uri (<b>guest</b>). <b><G id="type1-hypervisor">Type 1</G></b> rulează direct pe hardware (VMware ESXi, Hyper-V, Xen, KVM) și e folosit în data center; <b><G id="type2-hypervisor">Type 2</G></b> rulează ca aplicație peste un sistem de operare (VirtualBox, VMware Workstation) și e folosit pe laptop.
          În rețea, fiecare VM are o placă virtuală (<G id="vnic" />) legată la un <b><G id="vswitch" /></b> din hypervisor, iar acesta e legat de switch-ul fizic printr-un <G id="trunk">trunk</G>.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Termenii: host, guest, hypervisor, VM">
        <ul>
          <li><b><G id="host-os">Host</G></b> — mașina fizică (sau sistemul de operare instalat pe ea) care oferă resursele.</li>
          <li><b><G id="guest-os">Guest</G></b> — fiecare VM găzduită și sistemul ei de operare.</li>
          <li><b><G id="hypervisor" /></b> (sau VMM, <i>Virtual Machine Monitor</i>) — software-ul care creează VM-urile, le alocă resurse și le izolează.</li>
          <li><b><G id="vm" /></b> — „calculatorul” virtual: vCPU-uri, RAM, unul sau mai multe discuri virtuale (de obicei fișiere precum <code>.vmdk</code>, <code>.vhdx</code>, <code>.vdi</code>, <code>.qcow2</code>) și una sau mai multe plăci de rețea virtuale.</li>
        </ul>
        <p>Pentru că VM-ul este, în esență, un fișier de configurare plus fișiere de disc, el se poate <b>copia</b>, <b>clona</b>, <b>salva cu snapshot</b> și <b>muta</b> pe alt host — lucruri imposibile cu un server fizic.</p>

        <h3>2. Type 1 și Type 2</h3>
        <Figure caption="Interactiv: compară cele două stive. Observă că la Type 2 apare un strat în plus (sistemul de operare gazdă) între hardware și hypervisor.">
          <HypervisorTypes />
        </Figure>
        <Table head={['', 'Type 1 (bare-metal / native)', 'Type 2 (hosted)']} hlCol={0} rows={[
          [<b>Unde rulează</b>, 'direct pe hardware — el este „sistemul de operare” al serverului', 'ca aplicație pe Windows, macOS sau Linux'],
          [<b>Exemple</b>, 'VMware ESXi, Microsoft Hyper-V, Xen, KVM', 'Oracle VirtualBox, VMware Workstation / Fusion, Parallels'],
          [<b>Performanță</b>, 'overhead mic, aproape de nativ', 'overhead mai mare (un strat în plus)'],
          [<b>Utilizare tipică</b>, 'data center, cloud, producție', 'laburi, teste, dezvoltare, desktop'],
          [<b>Administrare</b>, 'de la distanță (vCenter, Hyper-V Manager, interfață web)', 'direct din aplicație, pe aceeași mașină'],
        ]} />
        <Callout kind="exam" title="Cazuri care încurcă la examen">
          <b>Hyper-V</b> este Type 1, deși îl activezi dintr-un Windows: după activare, Windows-ul tău devine o „partiție” rulând <i>peste</i> hypervisor. <b>KVM</b> e un modul al kernelului Linux care transformă întregul sistem într-un hypervisor — clasificarea lui e uneori discutată, dar în materialele Cisco/de examen e tratat de regulă ca Type 1. Dacă examenul îți dă „VirtualBox sau VMware Workstation”, răspunsul este Type 2; dacă îți dă „ESXi”, Type 1.
        </Callout>
        <Analogy>Type 1 e ca un hotel construit special pentru găzduire: clădirea întreagă servește camerele. Type 2 e ca și cum ai închiria camere în propria ta locuință: locuința (sistemul gazdă) are propriile funcții, iar oaspeții primesc doar o parte din ea.</Analogy>

        <h3>3. Cum ajunge o VM în rețea: vNIC și virtual switch</h3>
        <p>Aici topicul se leagă direct de CCNA. O VM nu are o placă de rețea fizică. Hypervisorul îi dă una sau mai multe <b><G id="vnic">vNIC</G></b>-uri — plăci virtuale, fiecare cu <b>propria adresă MAC</b> (de obicei dintr-un prefix rezervat furnizorului: VMware 00:50:56, VirtualBox 08:00:27). Pentru rețea, vNIC-ul se comportă exact ca o placă reală: trimite cadre Ethernet, are IP, face ARP.</p>
        <p>Aceste vNIC-uri se conectează la un <b><G id="vswitch">virtual switch</G></b> (vSwitch) creat în software de hypervisor — VMware vSwitch/vDS, Hyper-V Virtual Switch, Linux bridge sau <G id="ovs" />. El funcționează ca un switch Ethernet: învață MAC-uri și comută cadrele, iar multe implementări suportă <G id="vlan">VLAN</G>-uri. Un grup de porturi (<i>port group</i>) primește un număr de VLAN, iar toate VM-urile atașate lui sunt în acel VLAN.</p>
        <Figure caption="Interactiv: alege un flux. VM1→VM2 (același VLAN) nu părăsește hostul; VM1→VM3 (VLAN-uri diferite) are nevoie de un dispozitiv de nivel 3, deci iese pe trunk; VM4→afară iese pe uplink.">
          <VSwitchDiagram />
        </Figure>
        <p>Pașii pe care îi parcurge un cadru:</p>
        <ol>
          <li>Aplicația din VM1 trimite date; guest OS-ul construiește pachetul și cadrul Ethernet și le predă vNIC-ului.</li>
          <li>vSwitch-ul primește cadrul pe portul lui VM1, învață MAC-ul sursă și caută MAC-ul destinație în tabela lui.</li>
          <li>Dacă destinația e <b>pe același host și în același VLAN</b> (VM2), vSwitch-ul o livrează direct; cadrul <b>nu ajunge niciodată pe cablu</b>, deci nici switch-ul fizic nu-l vede.</li>
          <li>Dacă destinația e în <b>alt VLAN</b> (VM3), nu se poate comuta la nivel 2: cadrul pleacă pe uplink către switch-ul fizic, ajunge la un router sau switch de nivel 3 (SVI-ul VLAN-ului), este rutat și revine pe același cablu, în celălalt VLAN. Se numește uneori „hairpin”.</li>
          <li>Dacă destinația e în afara hostului, cadrul iese pe uplink; switch-ul fizic nu face diferența între un host cu 30 de VM-uri și un server fizic cu 30 de adrese MAC.</li>
        </ol>
        <h4>Legătura cu switch-ul fizic: trunk, uplink-uri, teaming</h4>
        <p>Placa(ile) fizică(e) a(le) serverului — <b>uplink-urile</b> — se conectează la un port al switch-ului din vârful rack-ului (ToR). Pentru că pe un singur cablu trebuie să circule mai multe VLAN-uri, portul switch-ului este de regulă configurat ca <b><G id="trunk" /> 802.1Q</b>, cu lista VLAN-urilor permise. Pentru redundanță și lățime de bandă, hostul are adesea două sau mai multe uplink-uri grupate (<G id="nic-teaming" />); în funcție de modul de teaming ales, switch-ul poate avea nevoie de un <G id="etherchannel" /> sau nu.</p>
        <Callout kind="warn" title="Cea mai frecventă eroare de rețea cu VM-uri">
          VM-ul „nu are rețea” deoarece <b>VLAN-ul nu este permis pe trunk</b> (sau nu există pe switch), ori port group-ul are alt VLAN decât ar trebui. Ping spre gateway pică, deși VM-ul arată „conectat”. Verifici de la ambele capete: VLAN-ul port group-ului și <code>show interfaces trunk</code> pe switch.
        </Callout>
        <Callout kind="info" title="vSwitch ≠ switch fizic în toate privințele">
          Un vSwitch este un program, nu un ASIC. De obicei <b>nu rulează <G id="stp">STP</G></b>: evită buclele prin reguli simple (de exemplu nu retransmite cadre primite de pe un uplink către alt uplink). Nu e nevoie să-l „configurezi” port cu port ca pe un switch Cisco — politicile (VLAN, teaming, securitate) se aplică pe port group.
        </Callout>

        <h3>4. Mutarea VM-urilor și efectul asupra rețelei</h3>
        <p><G id="live-migration" /> (VMware o numește vMotion) mută o VM <b>pornită</b> de pe un host pe altul fără întrerupere vizibilă: se copiază memoria și starea CPU, apoi VM-ul „apare” pe noul host. Pentru rețea înseamnă un lucru important: VM-ul își păstrează <b>IP-ul și MAC-ul</b>, deci VLAN-ul lui trebuie să existe și să fie permis pe trunk-urile <b>ambelor</b> hosturi. Switch-ul fizic își actualizează tabela MAC când vede cadre ale VM-ului pe noul port. De aici vine dorința de rețele de nivel 2 extinse în data center (și apariția soluțiilor ca <G id="vxlan" />, discutate la nivel superior).</p>

        <h3>5. NFV — funcțiile de rețea ca VM-uri</h3>
        <p>Dacă un server poate rula orice aplicație ca VM, poate rula și un <b>router</b>, un <b>firewall</b>, un <b>controller wireless</b> sau un <b>load balancer</b>. Asta se numește <G id="nfv" /> (<i>Network Functions Virtualization</i>): în loc de un aparat dedicat pentru fiecare funcție, rulezi funcții virtuale (<G id="vnf">VNF</G>-uri) pe servere standard. Exemple Cisco: Catalyst 8000V (router), ASAv / FTDv (firewall), Catalyst 9800-CL (controller wireless virtual — vezi 1.11). Avantaj: provizionare în minute și scalare elastică; cost: depinzi de performanța hostului și a switch-ului virtual.</p>
        <Figure caption="Interactiv: patru aparate dedicate față de patru funcții virtuale pe un server standard.">
          <NfvDiagram />
        </Figure>
        <Callout kind="tip" title="Nu confunda NFV cu SDN">
          <b>NFV</b> = <i>unde</i> rulează funcția de rețea (software pe server, în loc de aparat). <b>SDN</b> = <i>cum</i> se controlează rețeaua (planul de control separat și programabil). Se completează, dar sunt idei diferite; SDN apare la domeniul 6.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: ce vezi din rețea și ce nu">
        <p><b>Din switch-ul fizic</b> vezi doar trunk-ul și adresele MAC ale VM-urilor care au trafic la exterior — ca și cum ar fi zeci de calculatoare pe același port. De aceea <b>port security</b> cu limită de 1–2 adrese pe un port de server virtualizat produce deconectări (<code>err-disabled</code>).</p>
        <p><b>Din VM</b> nu vezi hardware real: placa se numește „vmxnet3”, „E1000” sau „virtio”, iar viteza raportată (de exemplu 10 Gbps) este o proprietate a software-ului, nu a cablului.</p>
        <p><b>Broadcast și multicast</b> dintr-un VLAN ajung la toate vNIC-urile din port group-ul respectiv, ca într-un domeniu de broadcast obișnuit. Un host cu foarte multe VM-uri într-un VLAN mare concentrează deci zgomot — un argument pentru VLAN-uri mici și rutare cât mai aproape de host.</p>
        <p><b>Cloud public</b>: acolo vSwitch-ul e ascuns de furnizor; vezi doar „VPC”, „subnet” și „security group”. Conceptele (vNIC, adresare, izolare) sunt aceleași.</p>
      </DeepDive>

      <Traps items={[
        <>Type 1 = <b>bare-metal</b> (ESXi, Hyper-V, Xen, KVM); Type 2 = <b>hosted</b> (VirtualBox, VMware Workstation). „Type 1” nu înseamnă „mai nou”, ci „mai aproape de hardware”.</>,
        <>VM-urile din <b>același VLAN, pe același host</b> comunică prin vSwitch fără ca traficul să iasă pe cablu; din <b>VLAN-uri diferite</b> au nevoie de un dispozitiv de nivel 3.</>,
        <>Portul switch-ului fizic spre un host de virtualizare este de obicei un <b>trunk</b>, nu un port de acces.</>,
        <>Fiecare vNIC are propria adresă <b>MAC</b>; o VM mutată cu live migration își păstrează IP-ul și MAC-ul.</>,
        <>Un vSwitch nu este un hypervisor și nu înlocuiește switch-ul fizic: el conectează doar VM-urile dintr-un host între ele și la uplink.</>,
      ]} />
      <InlineQuiz ids={['1.12-006', '1.12-011', '1.12-012', '1.12-013']} />
    </section>
  );
}

/* ======================================================================
   2. Containere
   ====================================================================== */
export function Containers() {
  return (
    <section id="containers" className="section">
      <SectionHead id="containers" code="1.12 · containere" title="Containere — Docker, imagini, Kubernetes" />
      <Summary>
        <p>Un <b><G id="container" /></b> împachetează o aplicație împreună cu bibliotecile ei, dar <b>fără un sistem de operare propriu</b>: toate containerele unui host folosesc același <b>kernel</b>. Rezultat: dimensiuni de MB în loc de GB, pornire în secunde, densitate mare — cu prețul unei izolări mai slabe decât la VM.
          <G id="docker" /> a popularizat formatul; <G id="kubernetes" /> le <b>orchestrează</b> pe un cluster de servere.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. De ce containere dacă avem VM-uri?">
        <p>O VM include un sistem de operare complet. Pentru o aplicație mică (un serviciu web de 30 MB) asta înseamnă să porți după tine gigaocteți de OS, minute de pornire și memorie RAM rezervată doar pentru kernelul guest-ului. În plus, dezvoltatorii aveau o problemă veche: „la mine merge”, dar pe serverul de producție lipsește o bibliotecă sau are altă versiune. Containerul rezolvă ambele: <b>împachetezi aplicația cu tot ce-i trebuie</b> și o rulezi identic oriunde există un motor de containere, <b>împărțind</b> kernelul gazdei în loc să porți unul propriu.</p>
        <Figure caption="Interactiv: stiva unei VM, stiva unui container și cele două una lângă alta. Observă unde dispare „guest OS”.">
          <VmVsContainer />
        </Figure>
        <Table head={['Criteriu', 'Mașină virtuală', 'Container']} hlCol={0} rows={[
          [<b>Ce include</b>, 'aplicație + biblioteci + sistem de operare complet (propriul kernel)', 'aplicație + biblioteci; folosește kernelul gazdei'],
          [<b>Dimensiune tipică</b>, 'gigaocteți', 'megaocteți (zeci/sute)'],
          [<b>Pornire</b>, 'de ordinul minutelor', 'secunde sau mai puțin'],
          [<b>Izolare</b>, 'puternică — kernel separat, hardware virtual', 'mai slabă — kernel comun; un defect de kernel afectează toate containerele'],
          [<b>Densitate pe host</b>, 'zeci', 'sute'],
          [<b>Sisteme de operare diferite</b>, 'da — Windows și Linux pe același host', 'nu — toate folosesc kernelul gazdei (container Linux → kernel Linux)'],
          [<b>Rulează peste</b>, 'hypervisor', 'container engine (Docker, containerd) peste kernel'],
        ]} />

        <h3>2. Cum izolează kernelul containerele</h3>
        <p>Containerul nu e un obiect „magic”, ci un <b>proces Linux obișnuit</b> cu restricții, obținute prin două mecanisme ale kernelului:</p>
        <ul>
          <li><b><G id="linux-namespaces">Namespaces</G></b> — controlează <i>ce vede</i> procesul: doar propriile procese (PID), propria stivă de rețea (interfețe, adrese IP, tabelă de rutare, porturi), propriul sistem de fișiere, propriul hostname.</li>
          <li><b><G id="cgroups">cgroups</G></b> — controlează <i>cât poate folosi</i>: limite de CPU, memorie, I/O.</li>
        </ul>
        <p>De aici decurge și o limită: un container Linux are nevoie de un kernel Linux. Pe Windows și macOS, Docker Desktop pornește în spate o <b>mică VM Linux</b> care găzduiește containerele — virtualizarea și containerele se combină des. În cloud, containerele rulează de obicei <i>în interiorul</i> unor VM-uri.</p>

        <h3>3. Imagine, registry, container (Docker)</h3>
        <p><b>Imaginea</b> (<G id="container-image">image</G>) este un șablon <b>read-only</b>, construit dintr-un fișier de instrucțiuni (<code>Dockerfile</code>) în <b>straturi</b>: un strat de bază (de exemplu o distribuție minimă), peste el bibliotecile, peste ele aplicația. Straturile comune se refolosesc între imagini, deci economisesc spațiu și timp de descărcare. Imaginile se păstrează într-un <b>registry</b> (Docker Hub sau unul privat). <b>Containerul</b> este o <i>instanță în execuție</i> a unei imagini — poți porni zece containere din aceeași imagine.</p>
        <Figure caption="De la Dockerfile la imagine (straturi), la registry, la mai multe containere pornite din aceeași imagine.">
          <DockerFlow />
        </Figure>
        <Table head={['Termen', 'Ce este', 'Analogie']} rows={[
          [<b>Dockerfile</b>, 'rețeta text pentru construirea imaginii', 'rețeta unui tort'],
          [<b>Image</b>, 'șablon read-only, pe straturi', 'tortul gata făcut, ambalat'],
          [<b>Registry</b>, 'depozit de imagini (pull / push)', 'raftul din magazin'],
          [<b>Container</b>, 'instanță în execuție a unei imagini', 'o felie servită la masă'],
          [<b>Docker</b>, 'unelte pentru build, distribuție și rulare', 'bucătăria cu tot echipamentul'],
        ]} />
        <p>Formatul imaginilor și al runtime-ului este standardizat (<G id="oci" />), deci o imagine construită cu Docker rulează și cu alte motoare compatibile (containerd, Podman). <b>Docker nu este un hypervisor</b> — nu creează hardware virtual, ci pornește procese izolate pe kernelul existent.</p>

        <h3>4. Containerele și rețeaua</h3>
        <p>Fiecare container primește propria stivă de rețea (prin namespace): o interfață virtuală (<code>veth</code>) legată de un <b>bridge</b> software creat de Docker (în mod implicit <code>docker0</code>, de regulă în rețeaua 172.17.0.0/16). Containerele de pe același host se văd prin acest bridge, iar către exterior ies prin <b><G id="nat">NAT</G></b> cu adresa hostului — exact ca laptopul tău în spatele routerului de acasă. Ca un serviciu din container să fie accesibil din rețea, se face <b>port mapping</b> (<G id="port-forwarding" />): <code>docker run -p 8080:80 nginx</code> înseamnă „traficul spre portul 8080 al hostului ajunge la portul 80 al containerului”.</p>
        <p>Observă paralelele cu ce știi deja: vNIC ↔ veth, vSwitch ↔ bridge, NAT-ul VirtualBox ↔ NAT-ul Docker. Același tipar — „un switch software + NAT” — apare peste tot în virtualizare.</p>

        <h3>5. Orchestrare: Kubernetes</h3>
        <p>Rulezi un container pe laptop cu Docker. Dar o aplicație reală are zeci de containere pe zeci de servere: ce se întâmplă dacă un server cade? cum scalezi de la 3 la 30 de copii? cum se găsesc serviciile între ele? <b><G id="kubernetes" /></b> (K8s), creat de Google și predat comunității (CNCF), rezolvă acest lucru: tu declari <b>starea dorită</b> („vreau 5 replici ale aplicației web”), iar Kubernetes o compară continuu cu realitatea și o corectează (<i>self-healing</i>, <i>scaling</i>, <i>service discovery</i>, load balancing).</p>
        <Figure caption="Interactiv: un cluster Kubernetes — control plane, noduri, pod-uri. Încearcă să „oprești” un nod și urmărește cum sunt replanificate pod-urile.">
          <K8sCluster />
        </Figure>
        <ul>
          <li><b>Nod (node)</b> — un server (fizic sau VM) care rulează containere.</li>
          <li><b><G id="pod" /></b> — cea mai mică unitate planificată: unul sau mai multe containere care rulează împreună și împart <b>o singură adresă IP</b>.</li>
          <li><b>Control plane</b> — „creierul” clusterului: primește starea dorită, decide pe ce nod rulează fiecare pod și corectează diferențele.</li>
          <li><b>Docker vs. Kubernetes</b>: Docker construiește și rulează containere; Kubernetes <i>coordonează</i> containere pe mai multe mașini. Nu se exclud — Kubernetes folosește un runtime de containere compatibil OCI.</li>
        </ul>
        <p>Aplicațiile gândite pentru containere sunt adesea <G id="microservices">microservicii</G>: bucăți mici, independente, comunicând prin rețea — ceea ce crește traficul <i>est-vest</i> din data center, un motiv pentru arhitecturile <G id="spine-leaf" />.</p>
        <Callout kind="info" title="Și pe echipamentele Cisco?">
          Unele platforme Cisco (de exemplu switch-uri Catalyst 9000 cu IOS XE) pot rula aplicații în containere, folosite pentru automatizare și monitorizare — „Guest Shell” și „App Hosting”. Pentru CCNA e suficient să știi că ideea de container nu e doar pentru servere.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: ce NU oferă un container">
        <p>Pentru că toate containerele împart kernelul, o vulnerabilitate de kernel poate permite unui container compromis să „evadeze” spre host și spre celelalte containere. Din acest motiv, mediile cu cerințe stricte (multi-tenant, furnizori de cloud) rulează containerele <b>în interiorul VM-urilor</b>: VM-ul oferă izolarea tare, containerul oferă viteza și ambalajul. De aceea „container sau VM?” nu e o dilemă: sunt, adesea, straturi succesive.</p>
        <p>Un container este în principiu <b>efemer</b>: datele scrise în stratul lui se pierd când este șters. Datele care trebuie păstrate se pun pe un <i>volum</i> montat din host sau din stocare externă. Un pod din Kubernetes poate fi mutat pe alt nod și primește de obicei <b>altă adresă IP</b> — de aceea serviciile sunt găsite printr-un nume stabil, nu printr-un IP.</p>
      </DeepDive>

      <Traps items={[
        <><b>Containerele partajează kernelul gazdei</b>; fiecare VM are propriul sistem de operare. Aceasta este întrebarea-clasic de examen.</>,
        <>Un container este o instanță a unei <b>imagini</b>; imaginea este read-only și nu „rulează”.</>,
        <><b>Docker</b> = platformă de containere; <b>Kubernetes</b> = orchestrator. Niciunul dintre ei nu este un hypervisor.</>,
        <>Containerele sunt mai puțin izolate decât VM-urile — dar mai ușoare și mai rapide.</>,
        <>Un container Linux nu rulează „nativ” pe Windows sau macOS: Docker Desktop folosește în spate o VM Linux.</>,
      ]} />
      <InlineQuiz ids={['1.12-021', '1.12-022', '1.12-024', '1.12-025']} />
    </section>
  );
}

/* ======================================================================
   3. VRF
   ====================================================================== */
export function Vrf() {
  return (
    <section id="vrf" className="section">
      <SectionHead id="vrf" code="1.12 · VRF" title="VRF — mai multe routere virtuale într-un singur router" />
      <Summary>
        <p><b><G id="vrf" /></b> (<i>Virtual Routing and Forwarding</i>) creează pe un singur router (sau switch de nivel 3) <b>mai multe tabele de rutare independente</b>. Fiecare interfață aparține unui singur VRF, iar un pachet primit într-un VRF este căutat <b>doar</b> în tabela acelui VRF. Rezultat: izolare de nivel 3 fără hardware în plus, și posibilitatea ca doi clienți să folosească <b>aceleași adrese IP</b> pe același echipament.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Problema pe care o rezolvă">
        <p>Un router obișnuit are <b>o singură</b> tabelă de rutare (<G id="routing-table" />) — cea „globală”. Orice interfață și orice rută trăiesc în același spațiu: dacă ai 10.0.0.0/24 pe o interfață, nu poți avea alt 10.0.0.0/24 pe alta (IOS refuză: <i>overlaps with…</i>). Dar există situații în care vrei exact asta:</p>
        <ul>
          <li>un <b>furnizor de servicii</b> care deservește mulți clienți, iar fiecare folosește rețele private (adesea aceleași, vezi <G id="rfc1918" />, de pildă 192.168.1.0/24 sau 10.0.0.0/8);</li>
          <li>un <b>data center multi-tenant</b> sau un cloud privat în care fiecare departament sau chiriaș își are rețeaua izolată;</li>
          <li>o <b>companie care a achiziționat alta</b>, ambele având aceeași adresare, și vrea să le conecteze temporar fără renumerotare;</li>
          <li>separarea <b>traficului de oaspeți</b> de cel corporativ pe aceleași routere, sau a <b>managementului</b> de trafic.</li>
        </ul>
        <p>Soluția veche: un router fizic pentru fiecare client — scump. Soluția VRF: <b>un router, mai multe tabele</b>.</p>
        <Analogy>Un hotel mare cu mai multe firme chiriașe. Fiecare firmă are propriul interfon și propria listă de numere interne („101 = recepție”). Două firme pot avea fiecare un „101”, fără conflict, pentru că listele sunt separate. Clădirea (routerul) este una singură; listele (VRF-urile) nu se amestecă, iar un apel dintr-o firmă nu poate ajunge în alta decât dacă îl permiți explicit.</Analogy>

        <h3>2. Ce înseamnă „o tabelă separată”</h3>
        <p>Fiecare VRF are propriile:</p>
        <ul>
          <li><b>tabelă de rutare</b> (RIB) și <b>tabelă de forwarding</b> (FIB / <G id="cef" />);</li>
          <li><b>interfețe</b> — fiecare interfață (fizică, <G id="subinterface">subinterfață</G> sau <G id="svi">SVI</G>) aparține <b>exact unui</b> VRF sau tabelei globale;</li>
          <li>instanțe de protocol de rutare și rute statice (de exemplu un proces OSPF pentru VRF-ul RED și altul pentru BLUE);</li>
          <li>tabelă ARP.</li>
        </ul>
        <Figure caption="Interactiv: un router cu două VRF-uri (RED, BLUE) și o tabelă globală. Alege tabela și observă ce interfețe îi aparțin și ce vezi în show ip route. RED și BLUE au aceleași prefixe, fără conflict.">
          <VrfRouter />
        </Figure>
        <p><b>Cum se procesează un pachet:</b></p>
        <ol>
          <li>Pachetul intră pe o interfață. Routerul vede cărui VRF îi aparține <i>interfața</i> (nu adresa din pachet!).</li>
          <li>Caută adresa destinație <b>doar</b> în tabela acelui VRF (cel mai lung prefix potrivit, ca de obicei).</li>
          <li>Ruta găsită îl scoate pe o interfață <b>din același VRF</b>; pachetul nu poate „sări” în alt VRF dacă nu ai configurat explicit un scurs de rute (<i>route leaking</i>).</li>
          <li>Dacă nu există nicio rută în tabela VRF-ului, pachetul se aruncă — chiar dacă tabela globală sau alt VRF are o rută potrivită.</li>
        </ol>

        <h3>3. VRF-Lite și MPLS L3VPN</h3>
        <p><b><G id="vrf-lite" /></b> înseamnă VRF-uri <i>fără MPLS</i>. Dacă traficul mai multor VRF-uri trebuie dus între două routere, ai nevoie de câte o legătură logică pentru fiecare VRF: de obicei o <b>subinterfață 802.1Q per VRF</b> pe un trunk (un VLAN pentru RED, altul pentru BLUE) și un protocol de rutare per VRF pe fiecare legătură. Funcționează excelent pentru câteva VRF-uri (campus, mediu mic), dar nu scalează la sute de clienți — fiecare VRF înseamnă configurare în plus pe <i>fiecare</i> router din drum.</p>
        <p><b><G id="mpls-l3vpn">MPLS L3VPN</G></b> este varianta folosită de furnizorii de servicii (RFC 4364). Routerele de la marginea rețelei operatorului (<G id="pe-router">PE</G>) au VRF-uri pentru clienți; routerele clientului (<G id="ce-router">CE</G>) se conectează la ele; routerele din miezul rețelei (P) <b>nu cunosc rutele clienților</b> — transportă doar pachete etichetate MPLS. Între PE-uri, rutele clienților circulă prin <G id="mp-bgp" />. Doi termeni care apar la examen ca definiții:</p>
        <Table head={['Termen', 'Rol', 'Ce reții']} rows={[
          [<b><G id="rd" /> — Route Distinguisher</b>, 'se adaugă în fața prefixului IPv4 ca să facă rutele clienților <b>unice</b> în BGP', 'rezolvă problema adreselor suprapuse (două rețele 10.1.0.0/16 devin „65000:1:10.1.0.0” și „65000:2:10.1.0.0”)'],
          [<b><G id="rt" /> — Route Target</b>, 'etichetă (extended community) care spune ce VRF-uri <b>importă</b> și <b>exportă</b> o rută', 'controlează cine vede ruta cui'],
          [<b>PE · CE · P</b>, 'Provider Edge (are VRF-uri) · Customer Edge · Provider (miezul, fără rute de client)', 'PE = „unde sunt VRF-urile”'],
        ]} />
        <Figure caption="Doi clienți (roșu și albastru) cu aceleași prefixe 10.1.0.0/16 și 10.2.0.0/16, transportați peste aceeași rețea MPLS a operatorului. RD îi diferențiază în BGP, RT decide cine importă ce.">
          <L3vpnDiagram />
        </Figure>
        <Callout kind="exam" title="Nivelul cerut la CCNA">
          Pentru CCNA e vorba de <b>concept</b>: ce este un VRF, ce problemă rezolvă (tabele separate, adrese suprapuse) și diferența față de VLAN. Nu vei configura MPLS L3VPN; RD/RT apar cel mult ca definiții. Configurarea VRF-Lite (partea de mai jos și din „Exemple de configurare”) e pentru înțelegere, nu pentru examen.
        </Callout>

        <h3>4. VRF față de VLAN — cea mai frecventă confuzie</h3>
        <Table head={['', 'VLAN', 'VRF']} hlCol={0} rows={[
          [<b>Nivel</b>, 'nivel 2 — împarte un switch în domenii de broadcast separate', 'nivel 3 — împarte un router în tabele de rutare separate'],
          [<b>Ce izolează</b>, 'cadrele Ethernet / broadcast-ul', 'rutele și pachetele IP'],
          [<b>Adrese IP suprapuse</b>, 'se pot suprapune doar dacă VLAN-urile nu ajung pe același dispozitiv de nivel 3', 'da — două VRF-uri pe același router pot folosi aceeași rețea'],
          [<b>Etichetă pe cablu</b>, '802.1Q tag (VLAN ID)', 'nicio etichetă — se leagă de interfață; între routere se folosesc de obicei VLAN-uri/subinterfețe ca transport'],
          [<b>Se combină?</b>, 'da — un VRF conține adesea mai multe VLAN-uri (SVI-uri) și invers', ''],
        ]} />
        <Analogy>VLAN = pereți între birouri (separă oamenii în același etaj). VRF = fiecare birou are propriul său registru de adrese (agendă telefonică) — oamenii pot purta chiar aceleași nume, fiindcă agendele nu se amestecă.</Analogy>
      </Detailed>

      <Detailed title="5. Comportamentul în CLI — ce trebuie să știi">
        <p>Concepte-cheie, ilustrate în „Exemple de configurare”:</p>
        <ul>
          <li>VRF-ul se <b>creează</b> global (<code>ip vrf NUME</code> sau, în sintaxa nouă multiprotocol, <code>vrf definition NUME</code>).</li>
          <li>O interfață se <b>atașează</b> cu <code>ip vrf forwarding NUME</code> (sintaxa veche) sau <code>vrf forwarding NUME</code> (sintaxa nouă).</li>
          <li><b>Atașarea șterge adresa IP</b> a interfeței (IOS afișează un mesaj de tip „address removed due to enabling VRF”); trebuie să reintroduci <code>ip address</code> <i>după</i> comanda de VRF.</li>
          <li>Comenzile de verificare fără cuvântul <code>vrf</code> se uită <b>doar în tabela globală</b>. De aceea după mutarea interfețelor în VRF, un simplu <code>show ip route</code> poate părea gol și <code>ping</code> eșuează — trebuie <code>show ip route vrf NUME</code> și <code>ping vrf NUME …</code>.</li>
          <li>Rutarea se pornește <b>per VRF</b>: <code>ip route vrf NUME …</code> pentru rute statice, <code>router ospf 1 vrf NUME</code> pentru OSPF.</li>
        </ul>
        <Callout kind="warn" title="Packet Tracer">
          Nu am putut verifica ce versiuni de Packet Tracer acceptă comenzile VRF (o discuție veche indica lipsa suportului). Laburile din acest topic pentru VRF sunt scrise pentru <b>GNS3 / EVE-NG / CML</b> cu imagini IOSv, CSR1000v sau Catalyst 8000V. Dacă PT-ul tău acceptă <code>vrf definition</code>, comenzile sunt aceleași.
        </Callout>
        <p><b>Un caz special: VRF de management.</b> Multe switch-uri Catalyst moderne au un port de management out-of-band (Gi0/0) plasat într-un VRF dedicat (frecvent numit <code>Mgmt-vrf</code>), ca traficul de administrare (SSH, SNMP, syslog) să nu se amestece cu rutarea de date. Detaliul practic: aceeași comandă <code>ping</code> nu mai funcționează „simplu” pe acel port, fiindcă adresa e într-un VRF — vezi <G id="mgmt-vrf" />.</p>
      </Detailed>

      <DeepDive title="Deep dive: scurgerea de rute și limitele izolării">
        <p>Izolarea dintre VRF-uri este una de <b>rutare</b>, nu de securitate absolută. Nu e un firewall: dacă configurezi import/export de rute (RT) sau o rută statică ce indică o interfață din alt VRF, traficul poate trece intenționat dintr-un VRF în altul (<i>route leaking</i>) — de exemplu ca toate VRF-urile să acceseze un serviciu comun (DNS, internet). Fără o configurare explicită, nu există cale.</p>
        <p>Toate VRF-urile rulează pe <b>același</b> sistem de operare și același procesor al routerului: o greșeală sau o suprasolicitare într-un VRF (de exemplu un flood) poate afecta resursele comune. Izolarea fizică rămâne singura garanție totală.</p>
        <p>Același mecanism apare în cloud și în SD-WAN sub alte nume: „segmentare”, „VPN de serviciu”, „VPC/route table”. Dacă înțelegi VRF-ul, recunoști idea.</p>
      </DeepDive>

      <Traps items={[
        <><b>VRF ≠ VLAN</b>: VLAN separă nivelul 2 (domenii de broadcast); VRF separă nivelul 3 (tabele de rutare). Adresele IP suprapuse sunt posibile doar cu VRF.</>,
        <>Atașarea unei interfețe la un VRF <b>șterge adresa IP</b> — o reintroduci după <code>vrf forwarding</code>.</>,
        <><code>ping</code> și <code>show ip route</code> fără <code>vrf</code> privesc <b>tabela globală</b>; o interfață dintr-un VRF „dispare” din ele.</>,
        <>Interfața aparține <b>unui singur VRF</b>; nu există „interfață în două VRF-uri”.</>,
        <>VRF-Lite = VRF fără MPLS; MPLS L3VPN = VRF + MPLS + MP-BGP (RD, RT) în rețeaua unui operator. CCNA: doar conceptual.</>,
      ]} />
      <InlineQuiz ids={['1.12-030', '1.12-031', '1.12-033', '1.12-034']} />
    </section>
  );
}

/* ======================================================================
   4. Comparație și legătura cu examenul
   ====================================================================== */
export function Compare() {
  return (
    <section id="compare" className="section">
      <SectionHead id="compare" code="1.12 · comparație" title="VM, container, VRF, VLAN — ce aleg și cum nu le încurc" />
      <Summary>
        <p>Patru cuvinte care sună asemănător și se încurcă la examen. Regula: întreabă-te <b>ce anume e „împărțit”</b> și <b>la ce nivel</b>. VM → hardware; container → kernel; VLAN → domeniul de broadcast (nivel 2); VRF → tabela de rutare (nivel 3).</p>
      </Summary>
      <Detailed>
        <Table head={['', 'VM', 'Container', 'VLAN', 'VRF']} hlCol={0} rows={[
          [<b>Ce virtualizează</b>, 'hardware-ul serverului', 'sistemul de operare (kernelul rămâne comun)', 'switch-ul (nivel 2)', 'routerul (nivel 3)'],
          [<b>Cine îl creează</b>, <G id="hypervisor" />, 'container engine (Docker, containerd)', 'switch-ul', 'routerul / switch-ul L3'],
          [<b>Izolare</b>, 'puternică', 'medie', 'broadcast separat', 'rute separate'],
          [<b>Adrese IP suprapuse?</b>, 'da, în rețele separate', 'da, în rețele separate de container', 'doar fără router comun', 'da'],
          [<b>Exemple</b>, 'ESXi, Hyper-V, VirtualBox', 'Docker, Kubernetes', 'VLAN 10, 20 pe un switch', 'VRF RED, BLUE; Mgmt-vrf'],
        ]} />
        <h3>Scenarii „ce aleg?”</h3>
        <Table head={['Situație', 'Răspuns', 'Motiv']} rows={[
          ['Rulezi pe același server un Windows Server și un Ubuntu, cu kernel propriu fiecare', 'VM-uri (hypervisor)', 'sisteme de operare diferite → kernel diferit'],
          ['Vrei 200 de instanțe identice ale unui serviciu web, pornite în secunde', 'containere (+ Kubernetes pentru orchestrare)', 'ușoare, rapide, aceeași imagine'],
          ['Doi clienți folosesc ambii 192.168.1.0/24 și trebuie conectați la același router', 'VRF', 'tabele de rutare separate; VLAN-urile nu rezolvă suprapunerea pe L3'],
          ['Vrei să separi vânzările de contabilitate în domenii de broadcast diferite pe același switch', 'VLAN', 'segmentare de nivel 2'],
          ['Vrei un firewall nou în 10 minute, fără să comanzi un aparat', 'NFV — firewall virtual (VM)', 'funcția de rețea ca software pe server'],
          ['Laptop cu Windows pe care vrei să testezi un Linux', 'hypervisor Type 2 (VirtualBox)', 'aplicație, nu server dedicat'],
        ]} />
        <Callout kind="exam" title="Formulări de examen">
          „Care tehnologie partajează kernelul sistemului gazdă?” → containere. „Care hypervisor rulează direct pe hardware?” → Type 1. „Ce permite aceeași adresare IP pe același router pentru clienți diferiți?” → VRF. „Care e deosebirea dintre Docker și Kubernetes?” → Docker rulează containere, Kubernetes le orchestrează pe un cluster. „Ce face un virtual switch?” → conectează vNIC-urile VM-urilor între ele și la uplink-urile fizice.
        </Callout>
        <p><b>Un fir roșu:</b> în toate cazurile obții <i>mai multe</i> instanțe logice peste <i>una singură</i> fizică. Diferă doar stratul la care faci împărțirea. Conectează cu restul domeniului 1: vNIC și vSwitch se explică prin cele din 1.1–1.5 (cadre, MAC, switch); trunk-ul prin 802.1Q (domeniul 2); VRF prin tabela de rutare (domeniul 3); NFV prin controllerul wireless virtual de la 1.11.</p>
      </Detailed>
      <Traps items={[
        <>„Virtualizare” este un termen-umbrelă: în fiecare întrebare verifică <b>ce</b> se virtualizează.</>,
        <>Un VRF nu este o VM de router: nu are propriul sistem de operare, ci doar propria tabelă de rutare.</>,
        <>Un container nu este „o VM mică”: nu are kernel propriu.</>,
      ]} />
      <InlineQuiz ids={['1.12-023', '1.12-032', '1.12-041']} />
    </section>
  );
}
