import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AaaCompare, BandView, MethodPicker, ThreeA } from '../../diagrams/t2_8';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.8" title="Accesul de management la echipamente — imaginea de ansamblu" />
      <Summary>
        <p>Un echipament de rețea se administrează prin: <b><G id="console-port">console</G></b> (local, <i>out-of-band</i>), <b><G id="telnet">Telnet</G></b> (TCP 23, în clar), <b><G id="ssh">SSH</G></b> (TCP 22, criptat), <b><G id="http">HTTP</G></b> (TCP 80, în clar) și <b><G id="https">HTTPS</G></b> (TCP 443, criptat). Autentificarea se poate face local sau centralizat prin <b><G id="aaa">AAA</G></b> cu <b><G id="radius">RADIUS</G></b> sau <b><G id="tacacs-plus">TACACS+</G></b>. Unele echipamente se gestionează din <b>cloud</b> (<G id="cloud-managed">Meraki</G>). Regula de securitate: <b>folosește metode criptate (SSH, HTTPS)</b> și autentificare centralizată.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 2.8 este <i>Describe network device management access (Telnet, SSH, HTTP, HTTPS, console, TACACS+/RADIUS, and cloud managed)</i>. Fără sub-puncte oficiale. Predăm: metodele de acces (și in-band vs out-of-band), autentificarea centralizată (AAA, RADIUS, TACACS+) și gestionarea din cloud.</p>
        <Table head={['Temă', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['Metode de acces', 'Cum intru pe un echipament și care metode sunt sigure?'],
          ['In-band vs out-of-band', 'Cum mai ajung la echipament când rețeaua de producție e căzută?'],
          ['AAA, RADIUS, TACACS+', 'Cum gestionez utilizatorii și drepturile pentru sute de echipamente fără conturi locale?'],
          ['Cloud managed', 'Cum administrez sucursale prin dashboard, fără acces direct la fiecare echipament?'],
        ]} />
        <h3>De ce contează</h3>
        <p>Accesul de administrare este cea mai privilegiată „ușă” într-o rețea: cine ajunge la CLI-ul unui router îi poate schimba rutele, ACL-urile și parolele. De aceea se aplică trei principii: (1) <b>canal criptat</b> (să nu se vadă parolele în rețea), (2) <b>identitate individuală</b> (fiecare administrator are cont propriu, nu parola comună „cisco”), (3) <b>drepturi minime</b> și <b>audit</b> (cine ce a făcut). Aceleași principii explică de ce SSH a înlocuit Telnet, HTTPS pe HTTP și AAA pe conturile locale.</p>
      </Detailed>
      <Traps items={[
        <>Telnet și HTTP sunt în <b>clar</b>; SSH și HTTPS sunt <b>criptate</b>.</>,
        <>Console = acces <b>local</b>, nu prin rețea; nu are nevoie de IP.</>,
        <>RADIUS ≠ TACACS+: porturi, transport și criptare diferite.</>,
      ]} />
      <InlineQuiz ids={['2.8-001', '2.8-003']} />
    </section>
  );
}

/* ======================================================================
   Metode de acces
   ====================================================================== */
export function Methods() {
  return (
    <section id="methods" className="section">
      <SectionHead id="methods" code="2.8" title="Console, Telnet, SSH, HTTP, HTTPS" />
      <Summary>
        <p><b>Console</b>: cablu direct, fără rețea. <b>Telnet</b> (TCP 23) și <b>HTTP</b> (TCP 80) trimit tot în clar. <b>SSH</b> (TCP 22) și <b>HTTPS</b> (TCP 443) sunt criptate. Pe IOS, SSH cere <b>hostname, domain-name, chei RSA, un utilizator local (sau AAA)</b> și <code>transport input ssh</code> pe liniile <b>vty</b>. HTTPS se activează cu <code>ip http secure-server</code>, iar HTTP se dezactivează cu <code>no ip http server</code>.</p>
      </Summary>
      <Detailed title="1. Metodele, una câte una">
        <Figure caption="Interactiv: alege o metodă și vezi portul, dacă e criptată și când o folosești.">
          <MethodPicker />
        </Figure>
        <Table head={['Metodă', 'Port', 'Criptat', 'Tip', 'Observații']} hlCol={0} rows={[
          [<b>Console</b>, '— (serial/USB)', 'n/a (local)', 'out-of-band', 'prima configurare, recuperare; linia „con 0”'],
          [<b>Telnet</b>, 'TCP 23', 'nu', 'in-band', 'parolele circulă în clar; evită-l'],
          [<b>SSH</b>, 'TCP 22', 'da', 'in-band', 'CLI sigur; versiunea 2 recomandată'],
          [<b>HTTP</b>, 'TCP 80', 'nu', 'in-band', 'GUI în clar; evită-l'],
          [<b>HTTPS</b>, 'TCP 443', 'da (TLS)', 'in-band', 'GUI sigur; certificat'],
        ]} />
        <h3>2. Console</h3>
        <p>Cablul console (RJ-45 → serial/USB) leagă un PC direct la portul console al echipamentului; folosești un program de terminal (PuTTY, Tera Term) la 9600 baud, 8 date, fără paritate, 1 stop, fără control al fluxului (valori implicite uzuale Cisco). Nu depinde de rețea și nu are nevoie de IP, deci este calea de bază pentru configurare inițială și <b>recuperare</b> când rețeaua nu merge. Securitatea lui este <b>fizică</b>: parole pe linia <code>con 0</code> și acces restricționat în încăpere.</p>
        <h3>3. Telnet vs SSH</h3>
        <p>Ambele dau un CLI la distanță, pe linii virtuale (<G id="vty">vty</G>). <b>Telnet</b> (1969, RFC 854) trimite toate caracterele, inclusiv parola, <b>în clar</b>: oricine cu un analizor de pachete (Wireshark) pe traseu le vede. <b>SSH</b> (TCP 22) negociază un canal criptat și autentifică serverul prin chei, deci un atac „man in the middle” este mult mai greu. De aceea un echipament configurat corect folosește <code>transport input ssh</code>, nu <code>telnet</code>.</p>
        <Callout kind="exam" title="Ce cere SSH pe IOS (pentru că apare des)">
          (1) <b>hostname</b> diferit de cel implicit; (2) <b>ip domain-name</b>; (3) <code>crypto key generate rsa</code> (de preferat 2048 biți pentru SSHv2); (4) un utilizator local (<code>username … secret …</code>) sau AAA; (5) pe vty: <code>transport input ssh</code> și <code>login local</code>; (6) o interfață cu IP accesibil. Recomandat: <code>ip ssh version 2</code>.
        </Callout>
        <h3>4. HTTP vs HTTPS</h3>
        <p>Multe echipamente au o interfață web (de exemplu GUI-ul WLC-ului, 2.9, sau WebUI pe IOS XE). Cu <b>HTTP</b> credențialele și configurația circulă în clar. <b>HTTPS</b> adaugă TLS: cifrează și autentifică serverul prin certificat (de obicei autosemnat pe echipament, ceea ce produce avertismentul browserului). Bună practică: <code>ip http secure-server</code> activat și <code>no ip http server</code>.</p>
        <h3>5. In-band și out-of-band</h3>
        <Figure caption="Interactiv: management în aceeași rețea cu producția (in-band) sau într-o rețea separată (out-of-band).">
          <BandView />
        </Figure>
        <ul>
          <li><b>In-band:</b> accesul (SSH/HTTPS/SNMP) trece prin rețeaua de producție, către o adresă IP a echipamentului. Simplu, dar dacă producția cade, pierzi accesul.</li>
          <li><b>Out-of-band (OOB):</b> o cale separată: console (direct sau prin <i>console server</i>), un port de management dedicat (de exemplu service port-ul WLC, 2.7) sau o rețea de management fizic separată. Rămâne disponibilă când producția e defectă.</li>
        </ul>
        <Analogy>In-band e ca și cum ai suna la un serviciu de urgență folosind linia aflată în pană; out-of-band e telefonul separat, cu baterie proprie, pe care îl păstrezi tocmai pentru acest caz.</Analogy>
        <h3>6. Îmbunătățiri uzuale de securitate</h3>
        <ul>
          <li><code>enable secret</code> (hash) în loc de <code>enable password</code>; <code>service password-encryption</code> doar ascunde parolele din configurație (nu e criptare puternică).</li>
          <li><code>access-class</code> pe liniile vty: doar adresele de management pot deschide sesiuni.</li>
          <li><code>exec-timeout</code>, <code>login block-for …</code> (blocare la încercări repetate), banner legal.</li>
          <li>VLAN de management separat (2.1) și, unde se poate, rețea OOB.</li>
        </ul>
      </Detailed>
      <DeepDive title="Cum funcționează SSH, pe scurt">
        <p>La conectare, clientul și serverul negociază versiunea și algoritmii; serverul își dovedește identitatea cu o cheie publică (de aici cheile RSA generate pe echipament); se stabilește o cheie de sesiune simetrică prin schimb de chei; toată comunicația ulterioară este criptată cu ea. Abia apoi se trimite parola (în interiorul canalului criptat). La prima conectare clientul întreabă dacă are încredere în „amprenta” cheii serverului: dacă amprenta se schimbă ulterior, clientul avertizează (posibil atac sau echipament înlocuit).</p>
      </DeepDive>
      <Traps items={[
        <>Telnet <b>23</b>, SSH <b>22</b>, HTTP <b>80</b>, HTTPS <b>443</b>.</>,
        <>SSH cere: hostname, domain name, chei RSA, utilizator, <code>transport input ssh</code>.</>,
        <><code>service password-encryption</code> ≠ criptare sigură; <code>enable secret</code> este hash.</>,
        <>Console nu cere IP; OOB înseamnă independent de rețeaua de producție.</>,
      ]} />
      <InlineQuiz ids={['2.8-005', '2.8-007', '2.8-009', '2.8-011']} />
    </section>
  );
}

/* ======================================================================
   AAA, RADIUS, TACACS+
   ====================================================================== */
export function Aaa() {
  return (
    <section id="aaa" className="section">
      <SectionHead id="aaa" code="2.8" title="AAA: TACACS+ și RADIUS" />
      <Summary>
        <p><b>AAA</b> = <b>A</b>uthentication (cine ești), <b>A</b>uthorization (ce ai voie), <b>A</b>ccounting (ce ai făcut). Un echipament poate delega AAA unui server central: <b><G id="tacacs-plus">TACACS+</G></b> (TCP 49, Cisco, criptează tot conținutul, separă A-urile — ideal pentru administrarea echipamentelor) sau <b><G id="radius">RADIUS</G></b> (UDP 1812/1813, standard deschis, criptează doar parola — ideal pentru acces de utilizatori: 802.1X, VPN, WLAN).</p>
      </Summary>
      <Detailed title="1. Problema conturilor locale">
        <p>Cu conturi locale, fiecare echipament are propria listă de utilizatori și parole. La 200 de echipamente: schimbarea unei parole înseamnă 200 de modificări; când un administrator pleacă, trebuie scos de pe fiecare; nu există un jurnal central; nu poți da drepturi diferite (junior vs senior) coerent. AAA centralizat rezolvă: utilizatorii trăiesc <b>pe un server</b> (adesea legat de directorul companiei), iar echipamentele doar întreabă serverul.</p>
        <Figure caption="Cele trei componente AAA.">
          <ThreeA />
        </Figure>
        <h3>2. Fluxul unei autentificări</h3>
        <ol>
          <li>Administratorul se conectează prin SSH la echipament (numit <b>NAS</b>, <i>Network Access Server</i>, sau client AAA).</li>
          <li>Echipamentul trimite serverului AAA cererea cu utilizatorul și parola (într-un pachet RADIUS sau TACACS+).</li>
          <li>Serverul verifică identitatea și răspunde accept/reject, eventual cu atribute (nivel de privilegiu, comenzi permise).</li>
          <li>Echipamentul acordă sau refuză accesul; opțional trimite înregistrări de accounting.</li>
          <li><b>Fallback:</b> dacă serverul nu răspunde, echipamentul poate folosi contul local (<code>… group tacacs+ local</code>). Esențial ca să nu rămâi blocat în afara echipamentului.</li>
        </ol>
        <h3>3. TACACS+ vs RADIUS</h3>
        <Figure caption="Interactiv: compară cele două protocoale.">
          <AaaCompare />
        </Figure>
        <Table head={['', 'TACACS+', 'RADIUS']} hlCol={0} rows={[
          ['Transport / port', 'TCP 49', 'UDP 1812 (auth), 1813 (acct); istoric 1645/1646'],
          ['Origine', 'Cisco (descris informațional în RFC 8907)', 'Standard deschis (RFC 2865, 2866)'],
          ['Criptare', 'Tot corpul pachetului', 'Doar parola'],
          ['Separare AAA', 'Authentication, Authorization, Accounting separate', 'Authentication + Authorization împreună; Accounting separat'],
          ['Autorizare pe comandă', 'Da (de exemplu „acest utilizator poate rula show, nu configure”)', 'Limitată'],
          ['Utilizare tipică', 'Administrarea echipamentelor de rețea', 'Acces utilizator la rețea: 802.1X, VPN, WLAN enterprise'],
        ]} />
        <Callout kind="exam" title="Cum alegi">
          „Administratori de rețea, autorizare pe comandă, criptare totală” ⇒ <b>TACACS+</b>. „Utilizatori pe WLAN WPA2/WPA3-Enterprise (802.1X), VPN, standard multi-vendor” ⇒ <b>RADIUS</b>. Ambele pot rula în același server (de exemplu Cisco ISE).
        </Callout>
        <h3>4. Configurare pe scurt (IOS)</h3>
        <p>Pași: <code>aaa new-model</code>; definirea serverului (<code>tacacs server</code> sau <code>radius server</code> cu adresa și cheia partajată); listele de metode (<code>aaa authentication login default group tacacs+ local</code>); aplicarea pe vty/console. Exemplul detaliat este la <b>Exemple de configurare</b>.</p>
      </Detailed>
      <Traps items={[
        <><b>TACACS+: TCP 49</b>; <b>RADIUS: UDP 1812/1813</b>.</>,
        <>RADIUS criptează doar parola; TACACS+ criptează tot conținutul.</>,
        <>Pune <code>local</code> ca fallback în lista de metode ca să nu pierzi accesul când serverul cade.</>,
        <>WLAN-urile enterprise (802.1X) folosesc <b>RADIUS</b>, nu TACACS+.</>,
      ]} />
      <InlineQuiz ids={['2.8-013', '2.8-015', '2.8-017', '2.8-019']} />
    </section>
  );
}

/* ======================================================================
   Cloud managed
   ====================================================================== */
export function CloudSec() {
  return (
    <section id="cloud" className="section">
      <SectionHead id="cloud" code="2.8" title="Echipamente gestionate din cloud" />
      <Summary>
        <p>La <b><G id="cloud-managed">cloud-managed</G></b> (de exemplu Cisco Meraki) administrezi echipamentele (AP, switch, firewall) dintr-un <b>dashboard web</b> în cloud, nu prin CLI pe fiecare. Echipamentul inițiază o conexiune <b>spre cloud</b> (nu se intră „din exterior”), își ia configurația și raportează starea. Traficul de date al utilizatorilor rămâne local; accesul de management trece prin HTTPS către dashboard.</p>
      </Summary>
      <Detailed title="Cum funcționează">
        <ul>
          <li><b>Provizionare zero-touch:</b> echipamentul nou pornește, primește IP (DHCP), contactează cloud-ul prin Internet, se identifică după serial/licență și își ia configurația asociată rețelei.</li>
          <li><b>Management:</b> dashboard-ul (browser, HTTPS) arată starea, modifică politici, ține jurnal, face upgrade-uri de software; accesul se securizează cu conturi, roluri și autentificare multi-factor.</li>
          <li><b>Planul de management ≠ planul de date:</b> dacă pierzi conexiunea la cloud, echipamentul continuă să funcționeze cu ultima configurație; nu mai poți schimba setări până se restabilește legătura.</li>
        </ul>
        <Table head={['', 'Management clasic (CLI)', 'Cloud-managed']} hlCol={0} rows={[
          ['Acces', 'SSH/console pe fiecare echipament', 'Dashboard web (HTTPS) pentru toate'],
          ['Configurare', 'Per echipament, scripturi', 'Șabloane și politici per rețea/sucursală'],
          ['Cerințe', 'Conectivitate L3 spre fiecare echipament', 'Echipamentul să poată ieși pe Internet spre cloud'],
          ['Cost/licență', 'De obicei fără abonament de management', 'Licență/abonament periodic'],
          ['Potrivire', 'Campus mare, politici complexe', 'Sucursale numeroase, IT redus'],
        ]} />
        <Callout kind="info" title="Alte forme de management centralizat">
          Pe lângă cloud, există controllere locale (de exemplu <b>Cisco Catalyst Center</b>, 1.1, WLC pentru wireless) care centralizează managementul fără a-l muta într-un cloud public. Obiectivul 2.8 pune în față ideea de <b>cloud-managed</b> ca alternativă la accesul direct pe fiecare echipament.
        </Callout>
        <h3>Securitate</h3>
        <p>Pentru că dashboard-ul controlează întreaga rețea, accesul la el se securizează cu parole puternice, MFA, roluri cu drepturi minime și jurnale de audit. Comunicația echipament–cloud este criptată; traficul utilizatorilor nu trece prin cloud.</p>
      </Detailed>
      <Traps items={[
        <>Cloud-managed: managementul trece prin cloud, <b>datele clienților nu</b>.</>,
        <>Echipamentul își <b>inițiază</b> conexiunea spre cloud; fără Internet, configurația existentă rămâne activă, dar nu mai poți schimba nimic.</>,
      ]} />
      <InlineQuiz ids={['2.8-021', '2.8-023']} />
    </section>
  );
}
