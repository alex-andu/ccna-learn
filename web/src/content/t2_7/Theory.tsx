import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { WlanToVlan, Wiring, WlcPorts } from '../../diagrams/t2_7';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.7" title="Conexiunile fizice ale componentelor WLAN — imaginea de ansamblu" />
      <Summary>
        <p>Un AP se leagă la switch printr-un singur cablu Ethernet care aduce <b>date și alimentare PoE</b>: port <b>access</b> pentru un AP în modul Local, port <b>trunk</b> pentru unul FlexConnect cu local switching. Un WLC are porturi cu roluri diferite: <b><G id="wlc-ds-port">distribution system ports</G></b> (date, de obicei <b>trunk</b>, grupabile într-un <b><G id="lag">LAG</G></b>), <b><G id="wlc-service-port">service port</G></b> (management OOB, port <b>access</b>), <b>redundancy port</b> și <b>console</b>. Interfețele logice ale WLC-ului (<b>management</b>, <b>dynamic</b>, <b>virtual</b>) mapează WLAN-urile pe VLAN-uri.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 2.7 este <i>Describe physical infrastructure connections of WLAN components (AP, WLC, access/trunk ports, and LAG)</i>. Fără sub-puncte oficiale; predăm: conectarea AP-urilor, apoi porturile și interfețele WLC-ului, apoi trunk-ul și LAG-ul dintre WLC și switch.</p>
        <Table head={['Temă', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['Conectarea AP-urilor', 'Ce tip de port, ce VLAN, cum e alimentat și cât de departe poate fi?']  ,
          ['Porturile și interfețele WLC', 'Ce face fiecare port și fiecare interfață logică a controller-ului?'],
          ['Trunk și LAG', 'Cum ajung VLAN-urile clienților la WLC și cum folosesc mai multe porturi ca unul singur?'],
        ]} />
        <h3>De ce contează „doar cablarea”</h3>
        <p>Majoritatea problemelor de wireless „care nu merge” sunt de fapt probleme ale rețelei cablate: portul switch-ului în VLAN-ul greșit, VLAN-ul clienților nepermis pe trunk-ul spre WLC, PoE insuficient, port de service conectat la trunk. Un administrator wireless trebuie să știe ce <b>tip de port</b> și ce <b>VLAN-uri</b> pune pe fiecare legătură. Aceasta leagă 2.7 de 2.1 (VLAN), 2.2 (trunk) și 2.4 (agregare).</p>
      </Detailed>
      <Traps items={[
        <>Un AP lightweight în modul Local: port <b>access</b>; FlexConnect cu local switching: <b>trunk</b>.</>,
        <>Service port = OOB, port <b>access</b>; distribution system ports = date, <b>trunk</b>.</>,
      ]} />
      <InlineQuiz ids={['2.7-001', '2.7-003']} />
    </section>
  );
}

/* ======================================================================
   AP
   ====================================================================== */
export function ApConn() {
  return (
    <section id="ap" className="section">
      <SectionHead id="ap" code="2.7" title="Conectarea AP-urilor la switch" />
      <Summary>
        <p>Un AP lightweight se conectează printr-un cablu UTP (sau fibră, la unele modele) la un port de switch. Alimentarea uzuală este <b><G id="poe">PoE</G></b> (802.3af/at/bt, în funcție de AP). Modul <b>Local</b> cere port <b>access</b> în VLAN-ul de management al AP-urilor; <b>FlexConnect</b> cu local switching cere port <b>trunk</b> cu VLAN-urile clienților; un AP <b>autonom</b> care servește mai multe SSID/VLAN-uri tot cere trunk.</p>
      </Summary>
      <Detailed title="1. Cabluri, distanță, alimentare">
        <ul>
          <li><b>Cablu:</b> UTP categoria 5e/6 (sau superioară) pentru legături de 1 Gbps; AP-urile moderne cu Wi-Fi 6/6E pot avea porturi multigigabit (2,5/5 Gbps) ⇒ cablu și switch potrivite (1.3).</li>
          <li><b>Distanță:</b> 100 m pe cupru Ethernet (1.3). Peste 100 m se folosește fibră sau un switch intermediar.</li>
          <li><b>Alimentare:</b> prin <b>PoE</b> de la switch (sau injector midspan, 1.1.h). Dacă bugetul de putere al switch-ului este depășit, unele AP-uri pornesc cu funcții reduse sau nu pornesc deloc.</li>
          <li><b>Redundanță:</b> unele AP-uri au două porturi (de exemplu pentru LAG sau PoE redundant); în rețelele mari se conectează fiecare AP la un singur switch de acces.</li>
        </ul>
        <h3>2. Tipul de port în funcție de mod</h3>
        <Table head={['AP', 'Port de switch', 'VLAN-uri', 'Motiv']} hlCol={0} rows={[
          [<b>Lightweight, mod Local</b>, 'access', 'un singur VLAN: management AP (de exemplu 100)', 'datele clienților sunt încapsulate în CAPWAP, deci portul vede doar trafic al AP-ului'],
          [<b>Lightweight, FlexConnect</b>, 'trunk', 'VLAN mgmt AP (de obicei nativ) + VLAN-urile clienților cu local switching', 'AP-ul comută local și marchează 802.1Q'],
          [<b>Autonomous</b>, 'trunk (dacă SSID-uri în VLAN-uri diferite) sau access (un VLAN)', 'VLAN-urile SSID-urilor', 'AP-ul mapează SSID → VLAN direct'],
          [<b>Bridge / Mesh (RAP)</b>, 'trunk sau access (în funcție de design)', 'după design', 'AP-ul rădăcină leagă rețeaua cablată de mesh'],
        ]} />
        <Callout kind="exam" title="Cum răspunzi la „ce port pentru AP-ul X?”">
          Întrebi: <b>unde se termină VLAN-ul clientului?</b> Dacă în WLC (tunel CAPWAP, mod Local) ⇒ access. Dacă pe AP (FlexConnect local switching sau autonomous cu mai multe VLAN) ⇒ trunk.
        </Callout>
        <h3>3. Ce trebuie să existe pe VLAN-ul AP-ului</h3>
        <ul>
          <li><b>DHCP</b> (și opțional option 43 / DNS) ca AP-ul să-și obțină IP și să găsească WLC-ul (2.6);</li>
          <li><b>Rută</b> către adresa WLC-ului (dacă e în altă subrețea) și <b>UDP 5246/5247</b> permise;</li>
          <li>Portul în stare <b>PortFast</b> (edge) ca AP-ul să nu aștepte STP la pornire.</li>
        </ul>
        <Analogy>AP-ul este ca un colet trimis printr-un curier: în modul Local, toate coletele (clienții) ajung la depozitul central (WLC) într-o singură cutie sigilată (CAPWAP), deci camionul (portul) are nevoie de o singură rută (access VLAN). La FlexConnect, AP-ul livrează local, fiecare colet la o stradă diferită (VLAN), deci camionul trebuie să circule pe mai multe străzi (trunk).</Analogy>
      </Detailed>
      <Traps items={[
        <>AP Local pe port <b>trunk</b> funcționează, dar nu este necesar; AP FlexConnect pe port <b>access</b> pierde VLAN-urile clienților.</>,
        <>Distanța maximă pe cupru este <b>100 m</b>; PoE se alimentează de la switch (sau midspan).</>,
        <>Fără DHCP/rută/UDP 5246-5247, AP-ul nu se alătură WLC-ului.</>,
      ]} />
      <InlineQuiz ids={['2.7-005', '2.7-007', '2.7-009']} />
    </section>
  );
}

/* ======================================================================
   WLC porturi și interfețe
   ====================================================================== */
export function WlcSec() {
  return (
    <section id="wlc" className="section">
      <SectionHead id="wlc" code="2.7" title="Porturile și interfețele unui WLC" />
      <Summary>
        <p>Un WLC are <b>porturi fizice</b> (<b>distribution system</b>, <b>service port</b>, <b>redundancy port</b>, <b>console</b>) și <b>interfețe logice</b> (<b>management</b>, <b>redundancy management</b>, <b>virtual</b>, <b>service-port</b> și <b>dynamic</b>). Interfețele dinamice fac legătura dintre un WLAN (SSID) și un VLAN/subrețea.</p>
      </Summary>
      <Detailed title="1. Porturile fizice">
        <Figure caption="Click pe un port: rolul lui și tipul de port de switch la care se leagă.">
          <WlcPorts />
        </Figure>
        <Table head={['Port', 'Rol', 'Port de switch']} hlCol={0} rows={[
          [<b>Distribution system port</b>, 'Date: tuneluri CAPWAP de la AP-uri, trafic client, management in-band', 'trunk 802.1Q (opțional LAG)'],
          [<b>Service port</b>, 'Management out-of-band (OOB): acces separat de rețeaua de date', 'access, într-un VLAN OOB'],
          [<b>Redundancy port</b>, 'Legătură între două WLC-uri într-o pereche HA (sincronizare)', 'cablu direct / rețea dedicată'],
          [<b>Console port</b>, 'Acces CLI local, configurare inițială', 'nu se leagă la switch'],
        ]} />
        <p>Numărul și tipul porturilor de date (RJ-45, SFP/SFP+) depind de model. Unele modele mai noi (de exemplu Catalyst 9800) denumesc diferit porturile (de exemplu <i>GigabitEthernet0</i> pentru management out-of-band) și suportă și instanțe virtuale; principiul rămâne: <b>un port pentru management OOB, porturi de date în trunk</b>.</p>
        <h3>2. Interfețele logice</h3>
        <Table head={['Interfață', 'Rol']} hlCol={0} rows={[
          [<b>Management</b>, 'Adresa IP principală a WLC-ului: management in-band (GUI/SSH), comunicația cu AP-urile (terminarea CAPWAP), cu serverele RADIUS etc.'],
          [<b>Redundancy management</b>, 'Adresă pentru WLC-ul în perechea HA (pentru acces la unitatea standby).'],
          [<b>Virtual</b>, <>Adresă logică unică într-un grup de mobilitate (de exemplu <code>192.0.2.1</code>): folosită ca țintă pentru DHCP relay, web authentication și roaming, ca să pară același controller clienților.</>],
          [<b>Service port</b>, 'Interfața asociată service port-ului fizic (management OOB, adresă într-o subrețea separată).'],
          [<b>Dynamic</b>, 'Una (sau mai multe) per VLAN de clienți: mapează un WLAN pe un VLAN și o subrețea; are propria adresă IP (și DHCP server/relay).'],
        ]} />
        <Callout kind="info" title="AP-manager (istoric)">
          În versiuni mai vechi de AireOS exista o interfață separată „AP-manager” pentru terminarea tunelurilor AP; în versiunile recente această funcție este preluată de interfața <b>management</b>. Pe examen apare mai ales ideea de bază: AP-urile comunică cu <b>adresa de management</b> a WLC-ului.
        </Callout>
        <h3>3. De la SSID la VLAN</h3>
        <Figure caption="Alege un WLAN și urmărește-l: SSID → interfață dinamică → VLAN → trunk spre switch.">
          <WlanToVlan />
        </Figure>
        <p>Un WLAN este asociat (la creare, 2.9) cu o <b>interfață</b> (sau un grup de interfețe). Interfața dinamică are un VLAN ID și o adresă IP; când un client se asociază la SSID, WLC-ul scoate cadrul din tunelul CAPWAP și îl trimite, marcat cu acel VLAN, pe portul de date spre switch. De aceea trunk-ul dintre WLC și switch trebuie să permită toate aceste VLAN-uri.</p>
      </Detailed>
      <Traps items={[
        <><b>Service port</b> ≠ port de date: nu face trunk și nu transportă traficul clienților.</>,
        <><b>Dynamic interface</b> = legătura WLAN ↔ VLAN; <b>management interface</b> = adresa principală a WLC-ului.</>,
        <>Interfața <b>virtual</b> (de exemplu 192.0.2.1) nu este rutată în rețea; servește DHCP relay și web auth.</>,
        <>Fără VLAN permis pe trunk, clientul se asociază dar nu primește IP.</>,
      ]} />
      <InlineQuiz ids={['2.7-011', '2.7-013', '2.7-015', '2.7-017']} />
    </section>
  );
}

/* ======================================================================
   Trunk + LAG
   ====================================================================== */
export function TrunkLag() {
  return (
    <section id="trunklag" className="section">
      <SectionHead id="trunklag" code="2.7" title="Trunk și LAG între WLC și switch" />
      <Summary>
        <p>Portul (sau portchannel-ul) de date al WLC-ului se leagă la switch ca <b>trunk 802.1Q</b> cu VLAN-urile necesare. Cu <b><G id="lag">LAG</G></b> mai multe porturi ale WLC-ului funcționează ca un singur link logic. Pe WLC-urile AireOS, LAG-ul este <b>doar static</b> (<code>channel-group … mode on</code> pe switch, fără LACP/PAgP) și necesită repornirea controller-ului; toate porturile merg la același switch.</p>
      </Summary>
      <Detailed title="1. Trunk spre WLC">
        <CodeBlockNote />
        <ul>
          <li>VLAN-urile permise: VLAN-ul de management al WLC-ului și toate VLAN-urile interfețelor dinamice (clienți).</li>
          <li>VLAN-ul de management poate fi <b>nativ</b> (untagged) sau etichetat; trebuie să coincidă între configurația WLC-ului (interfața management: VLAN 0 = untagged / VLAN ID) și cea a trunk-ului — o nepotrivire a VLAN-ului nativ rupe comunicația (2.2).</li>
          <li>Se recomandă <code>switchport trunk allowed vlan …</code> explicit, nu toate VLAN-urile.</li>
        </ul>
        <h3>2. LAG (Link Aggregation Group)</h3>
        <p>LAG-ul este termenul standard pentru ceea ce Cisco numește EtherChannel (2.4): mai multe linkuri paralele devin un singur link logic, cu bandă agregată și redundanță. La WLC, LAG-ul grupează porturile de date, deci traficul AP-urilor și al clienților are mai multă capacitate și supraviețuiește căderii unui port.</p>
        <Figure caption="Interactiv: alege scenariul de cablare. În ultimul, WLC-ul are patru porturi într-un LAG către switch.">
          <Wiring />
        </Figure>
        <Table head={['Aspect', 'LAG pe WLC AireOS', 'Pe switch']} hlCol={0} rows={[
          ['Mod de agregare', 'static (nu LACP, nu PAgP)', <code>channel-group N mode on</code>],
          ['Aplicare', <>activare globală (<code>config lag enable</code> sau în GUI), apoi repornire WLC</>, 'port-channel configurat ca trunk 802.1Q'],
          ['Porturile', 'toate porturile de date participă', 'toate trebuie configurate în canal'],
          ['Vecin', 'toate porturile spre același switch', 'același switch (sau stivă)'],
          ['Altele', 'o singură interfață „AP-manager”/management pentru tot LAG-ul', 'VLAN-uri permise identice pe canal'],
        ]} />
        <Callout kind="warn" title="Ce este diferit față de 2.4">
          În 2.4 ai folosit LACP (<code>active</code>/<code>passive</code>). Pe un WLC AireOS acestea <b>nu funcționează</b>: switch-ul trebuie configurat cu <code>mode on</code>. Alte platforme (de exemplu Catalyst 9800, bazate pe IOS XE) pot oferi și negociere LACP; verifică documentația platformei tale. Pe examen: LAG la WLC = EtherChannel <b>static</b>, cu <i>on</i>.
        </Callout>
        <h3>3. Redundanță</h3>
        <p>Pentru disponibilitate, WLC-urile se pun în perechi HA (SSO) prin <b>redundancy port</b>, iar fiecare WLC se conectează la unul sau mai multe switch-uri de distribuție. Dacă porturile merg la <b>switch-uri diferite</b>, LAG-ul nu poate fi folosit (porturile se configurează independent, fiecare ca trunk) — compromis între redundanță de switch și simplitatea LAG-ului.</p>
      </Detailed>
      <DeepDive title="Ce se întâmplă dacă pui LACP pe switch și LAG static pe WLC">
        <p>Switch-ul trimite LACPDU și așteaptă răspuns; WLC-ul nu le înțelege și nu răspunde ⇒ membrii rămân stand-alone sau suspendați și canalul nu se formează (2.4). Simptome: WLC inaccesibil pe porturile de date după activarea LAG, AP-uri care nu mai fac join. Remediu: <code>channel-group … mode on</code> pe switch (și verifică <code>show etherchannel summary</code>: <code>Po1(SU)</code> cu membrii <code>(P)</code>).</p>
      </DeepDive>
      <Traps items={[
        <>LAG la WLC AireOS: <b>static</b> (<code>on</code>), fără LACP/PAgP; modificarea cere <b>repornirea</b> WLC-ului.</>,
        <>Porturile unui LAG trebuie să meargă la <b>același switch</b>.</>,
        <>VLAN-ul de management și VLAN-urile clienților trebuie <b>permise</b> pe trunk/port-channel.</>,
        <>Service port nu face parte din LAG și nu este trunk.</>,
      ]} />
      <InlineQuiz ids={['2.7-019', '2.7-021', '2.7-023', '2.7-025']} />
    </section>
  );
}

function CodeBlockNote() {
  return (
    <p>Un exemplu complet de configurare (portul spre WLC ca trunk și LAG-ul cu <code>mode on</code>) se găsește la <b>Exemple de configurare</b>, mai jos. Ideea de bază: tratezi portul WLC-ului ca pe orice trunk către un echipament de rețea (2.2), cu VLAN-urile cerute de interfețele WLC-ului.</p>
  );
}
