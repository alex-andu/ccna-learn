import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { FtpChannels, TftpExchange, UpgradeFlow } from '../../diagrams/t4_9';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.9" title="TFTP și FTP — imaginea de ansamblu" />
      <Summary>
        <p><G id="tftp" /> și <G id="ftp" /> sunt protocoalele clasice de <b>transfer de fișiere</b> în rețelele Cisco: le folosești ca să salvezi și să restaurezi configurații (<G id="running-config" />, <G id="startup-config" />) și ca să încarci o nouă imagine <G id="ios-image" /> în <G id="flash-memory" />. TFTP este simplu (UDP 69, fără autentificare), FTP este mai bogat (TCP 20/21, cu utilizator și parolă). Obiectivul 4.9 este de tip <b>Describe</b>: contează ce poate face fiecare și când îl alegi.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.9: <i>Describe the capabilities and functions of TFTP/FTP in the network</i>. Nu se cere configurare de server, dar comenzile <code>copy</code> și verificarea imaginii apar frecvent în exemple și în practică.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['La ce îmi trebuie transferul de fișiere?', 'De ce transferăm fișiere'],
          ['Cum merge TFTP și de ce e „simplu”?', 'TFTP'],
          ['Ce aduce în plus FTP?', 'FTP: control și date'],
          ['Cum arată comenzile și un upgrade de IOS?', 'Comenzi pe IOS'],
        ]} />
        <Analogy>TFTP este un curier care lasă pachetul la ușă fără să ceară buletinul: rapid de implementat, fără verificări, bun într-o clădire închisă. FTP este un curier care cere legitimația la portar și lucrează cu două uși: una pentru discuții (comenzi) și una pentru pachete (date).</Analogy>
      </Detailed>
      <Traps items={[
        <>Nici TFTP, nici FTP clasic nu criptează: nu le folosi în afara unei rețele de management de încredere. Alternative securizate: SFTP/SCP (peste SSH), FTPS.</>,
        <>TFTP nu are autentificare: orice client care ajunge la server poate citi sau scrie fișierele din directorul lui.</>,
        <>SFTP nu este „FTP securizat” în sens literal: este un protocol diferit, peste SSH (TCP 22).</>,
      ]} />
      <InlineQuiz ids={['4.9-001', '4.9-002']} />
    </section>
  );
}

/* ======================================================================
   1. De ce transferăm fișiere
   ====================================================================== */
export function WhySection() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="4.9" title="De ce transferăm fișiere pe echipamentele de rețea" />
      <Summary>
        <p>Un router sau switch păstrează trei lucruri importante: <b>sistemul de operare</b> (imaginea IOS, în flash), <b>configurația</b> (running în RAM, startup în NVRAM) și, uneori, alte fișiere (licențe, certificate). Toate pot fi copiate la/de la un server din rețea, ca să faci backup, să restaurezi după o defecțiune, să replici configurația pe echipamente noi sau să faci upgrade de software.</p>
      </Summary>
      <Detailed title="1. Ce se transferă și de ce">
        <Table head={['Obiect', 'Unde stă', 'De ce îl copiezi']} hlCol={0} rows={[
          ['running-config', 'RAM (se pierde la reload)', 'Backup, comparare, replicare'],
          ['startup-config', 'NVRAM (persistent)', 'Backup/restaurare după reset'],
          ['Imaginea IOS (.bin)', 'Flash (flash:/bootflash:)', 'Upgrade/downgrade, backup al versiunii funcționale'],
          ['Alte fișiere', 'Flash/USB', 'Licențe, certificate, scripturi, fișiere de pe un echipament pe altul'],
        ]} />
        <p>Fără un server central ar trebui să te conectezi pe fiecare echipament și să copiezi manual configurația. Cu un server de backup (TFTP sau FTP) poți automatiza: un script apelează <code>copy running-config tftp:</code> pe toate echipamentele noaptea, iar după o defecțiune restaurezi rapid un echipament nou.</p>
      </Detailed>
      <Detailed title="2. Cum se compară cele două protocoale">
        <Table head={['Aspect', 'TFTP', 'FTP']} hlCol={0} rows={[
          ['Transport / port', 'UDP 69 (cerere); date pe un port efemer', 'TCP 21 (control) + TCP 20 (date, mod activ) sau port înalt (mod pasiv)'],
          ['Autentificare', 'Nu există', 'Utilizator și parolă (în clar)'],
          ['Criptare', 'Nu', 'Nu (FTPS/SFTP o adaugă)'],
          ['Complexitate', 'Foarte simplă (citire/scriere de fișiere)', 'Mai bogată (listare de directoare, ștergere, redenumire, mod binar/ASCII)'],
          ['Fiabilitate', 'Retransmisie la nivel de aplicație (UDP)', 'TCP: retransmisie și control al fluxului'],
          ['Uz tipic pe Cisco', 'Backup config, upgrade IOS în laborator/rețea de management', 'La fel, când e nevoie de autentificare sau fișiere mari'],
        ]} />
      </Detailed>
      <Callout kind="exam" title="Cuvinte cheie de examen">
        „TFTP: UDP 69, fără autentificare, simplu”, „FTP: TCP 20/21, autentificare”, „copy running-config tftp:”, „backup configurație”, „upgrade IOS”, „flash”.
      </Callout>
      <Traps items={[
        <>Nu confunda NVRAM (startup-config) cu flash (imaginea IOS): sunt memorii diferite, cu roluri diferite.</>,
        <>Un transfer către server nu cere ca echipamentul să aibă „aplicație” specială: IOS are clienții TFTP/FTP încorporați în comanda <code>copy</code>.</>,
      ]} />
      <InlineQuiz ids={['4.9-003', '4.9-004', '4.9-005']} />
    </section>
  );
}

/* ======================================================================
   2. TFTP
   ====================================================================== */
export function TftpSection() {
  return (
    <section id="tftp" className="section">
      <SectionHead id="tftp" code="4.9" title="TFTP: simplu, rapid de implementat, fără securitate" />
      <Summary>
        <p>TFTP (Trivial File Transfer Protocol) lucrează peste <b>UDP</b>. Clientul trimite o cerere la portul 69, iar fișierul este transferat în <b>blocuri de 512 octeți</b>, fiecare confirmat (ACK) înainte de următorul (<i>lock-step</i>). Nu există autentificare și nici listare de directoare: ceri un fișier după nume, sau îl trimiți.</p>
      </Summary>
      <Detailed title="1. Interactiv: un transfer TFTP">
        <Figure caption="Cerere → bloc → confirmare → ... → ultimul bloc (mai mic de 512 octeți).">
          <TftpExchange />
        </Figure>
      </Detailed>
      <Detailed title="2. Avantaje și limite">
        <ul>
          <li><b>Avantaje:</b> implementare minusculă (încape în bootloader și în firmware-uri simple), nu cere stare de conexiune, simplu de pornit pe un laptop pentru un transfer rapid.</li>
          <li><b>Limite:</b> fără autentificare și fără criptare; fără listare de directoare; fiecare bloc așteaptă ACK (lent pe legături cu latență mare); fiind pe UDP, fiabilitatea este simplă (timer + retransmisie); numărul de bloc fiind pe 16 biți, mărimea clasică a unui fișier este limitată la ≈32 MB (extensii precum <code>blksize</code> pot ridica limita — depinde de server și de client).</li>
          <li><b>Firewall/NAT:</b> serverul răspunde de pe un alt port decât 69, ceea ce cere ca firewall-ul să urmărească transferul (inspecție TFTP) sau să permită portul respectiv.</li>
        </ul>
      </Detailed>
      <Detailed title="3. Unde se folosește">
        <p>Backup și restaurare de configurații, încărcare de imagini IOS în laborator sau într-o rețea de management izolată, boot de rețea (PXE, telefoane IP, puncte de acces care își descarcă firmware-ul). Aproape niciodată pe Internet sau în rețele de utilizatori.</p>
      </Detailed>
      <Traps items={[
        <>TFTP nu folosește portul 69 pentru tot transferul: doar pentru prima cerere; datele merg pe porturi efemere.</>,
        <>Nu există „parolă TFTP”: restricția se face la nivel de rețea (ACL, VLAN de management) și de directorul serverului.</>,
        <>Un transfer TFTP eșuat adesea înseamnă drum de rețea sau firewall, nu „fișier corupt”.</>,
      ]} />
      <InlineQuiz ids={['4.9-006', '4.9-007', '4.9-008']} />
    </section>
  );
}

/* ======================================================================
   3. FTP
   ====================================================================== */
export function FtpSection() {
  return (
    <section id="ftp" className="section">
      <SectionHead id="ftp" code="4.9" title="FTP: control, date și autentificare" />
      <Summary>
        <p>FTP (File Transfer Protocol) lucrează peste <b>TCP</b> și folosește <b>două conexiuni</b>: una de <b>control</b> (TCP 21) pentru comenzi și autentificare, și una de <b>date</b> pentru conținutul fișierelor. Oferă autentificare cu utilizator și parolă (trimise în clar), listare de directoare, redenumire, ștergere și moduri de transfer binar/ASCII. Fiabilitatea vine de la TCP.</p>
      </Summary>
      <Detailed title="1. Interactiv: mod activ vs pasiv">
        <Figure caption="Cine deschide conexiunea de date? Activ: serverul. Pasiv: clientul.">
          <FtpChannels />
        </Figure>
        <Table head={['Mod', 'Control', 'Date', 'Problemă tipică']} hlCol={0} rows={[
          ['Activ', 'Client → server, TCP 21', 'Server (port 20) → client', 'Firewall/NAT la client blochează conexiunea intrantă'],
          ['Pasiv', 'Client → server, TCP 21', 'Client → server, port înalt anunțat de server', 'Serverul trebuie să permită un interval de porturi înalte'],
        ]} />
      </Detailed>
      <Detailed title="2. Autentificare și securitate">
        <p>La conectare, clientul trimite utilizatorul și parola pe canalul de control, <b>în text clar</b>, ca la Telnet. Pe IOS, acestea se pot memora în configurație cu <code>ip ftp username</code> și <code>ip ftp password</code> (stocare în clar în running-config, dacă nu ai <code>service password-encryption</code>), sau le incluzi în URL: <code>copy running-config ftp://admin:parola@192.168.1.10/r1.cfg</code>.</p>
        <p>Variantele securizate: <b><G id="sftp" /></b> (un protocol diferit, peste SSH, TCP 22), <b><G id="scp" /></b> (copiere prin SSH; pe IOS se activează cu <code>ip scp server enable</code> și are nevoie de SSH și autorizare AAA) și <b>FTPS</b> (FTP peste TLS). La examen, rezistă tentației: „FTP securizat” nu e același lucru cu SFTP.</p>
      </Detailed>
      <DeepDive title="De ce FTP are două conexiuni">
        <p>Separarea comenzilor de date permite să trimiți comenzi (de exemplu <code>ABOR</code>, anulare) în timp ce se transferă un fișier mare, fără să amesteci comenzile cu conținutul. Dezavantajul este complexitatea pentru firewall-uri și NAT-uri, care trebuie să „înțeleagă” FTP ca să deschidă conexiunea de date (inspecție/ALG). SFTP evită problema: totul trece printr-o singură conexiune SSH.</p>
      </DeepDive>
      <Traps items={[
        <>FTP trimite utilizatorul și parola în clar, la fel ca Telnet.</>,
        <>FTP folosește TCP (21 și 20/porturi înalte), TFTP folosește UDP 69.</>,
        <>Modul pasiv nu este „mai sigur”, doar mai prietenos cu firewall-urile din partea clientului.</>,
      ]} />
      <InlineQuiz ids={['4.9-009', '4.9-010', '4.9-011', '4.9-012']} />
    </section>
  );
}

/* ======================================================================
   4. Comenzi pe IOS și upgrade
   ====================================================================== */
export function IosSection() {
  return (
    <section id="ios" className="section">
      <SectionHead id="ios" code="4.9" title="Comenzile copy pe IOS și un upgrade de imagine" />
      <Summary>
        <p>Pe IOS, tot transferul se face cu <code>copy &lt;sursă&gt; &lt;destinație&gt;</code>, unde sursa/destinația pot fi <code>running-config</code>, <code>startup-config</code>, <code>flash:</code>, <code>tftp:</code>, <code>ftp:</code> (și <code>scp:</code>). Un upgrade de IOS înseamnă: verifici spațiul în flash, copiezi imaginea de pe server, <b>verifici hash-ul</b>, o indici ca imagine de boot și repornești.</p>
      </Summary>
      <Detailed title="1. Direcții și efecte">
        <Table head={['Comandă', 'Efect']} hlCol={0} rows={[
          [<code key="a">copy running-config tftp:</code>, 'Backup: trimite configurația activă la server'],
          [<code key="b">copy startup-config tftp:</code>, 'Backup al configurației salvate'],
          [<code key="c">copy tftp: running-config</code>, 'Restaurare — se COMBINĂ (merge) cu configurația activă, nu o înlocuiește'],
          [<code key="d">copy tftp: startup-config</code>, 'Înlocuiește startup-config (efect după reload)'],
          [<code key="e">copy flash: tftp:</code>, 'Trimite imaginea IOS la server (backup)'],
          [<code key="f">copy tftp: flash:</code>, 'Aduce o imagine nouă în flash (upgrade)'],
          [<code key="g">copy running-config startup-config</code>, 'Salvează configurația în NVRAM'],
          [<code key="h">copy ftp://user:parola@ip/fișier flash:</code>, 'La fel, prin FTP, cu autentificare în URL'],
        ]} />
        <Callout kind="warn" title="Restaurarea în running-config este o îmbinare">
          <code>copy tftp: running-config</code> aplică liniile din fișier peste configurația existentă (ca și cum le-ai tasta). Liniile care există deja și nu sunt în fișier rămân. Pentru o înlocuire curată, copiezi în <code>startup-config</code> și faci <code>reload</code>.
        </Callout>
      </Detailed>
      <Detailed title="2. Upgrade de IOS: pas cu pas">
        <Figure caption="Alege un pas: ce comandă rulezi și de ce.">
          <UpgradeFlow />
        </Figure>
        <p>Verificarea hash-ului (<code>verify /md5 flash:&lt;imagine&gt;</code>) compară rezultatul cu valoarea publicată de Cisco pentru acea imagine. Dacă diferă, imaginea s-a corupt la transfer și <b>nu</b> trebuie folosită: un router care nu pornește din cauza unei imagini stricate necesită recuperare din ROMMON, ceea ce poate cere acces fizic.</p>
      </Detailed>
      <DeepDive title="Sistemul de fișiere și comenzile de verificare">
        <p>Flash-ul se comportă ca un disc: <code>dir flash:</code> listează fișierele, <code>delete flash:&lt;fișier&gt;</code> șterge, iar <code>show flash:</code> arată și spațiul liber. <code>show version</code> arată versiunea de IOS care rulează, uptime-ul, fișierul-imagine de pe care a pornit routerul și registrul de configurare. <code>show boot</code> / <code>show running-config | include boot</code> arată ce imagine este setată pentru următorul boot. Pe unele platforme noi (IOS XE, modul install) procesul de upgrade diferă și folosește comenzi dedicate.</p>
      </DeepDive>
      <Traps items={[
        <><code>copy tftp: running-config</code> nu înlocuiește, ci îmbină: unele linii vechi rămân.</>,
        <>Nu copia o imagine mai mare decât spațiul liber din flash: transferul eșuează sau umple flash-ul.</>,
        <>Ai uitat <code>copy running-config startup-config</code> înainte de reload: pierzi configurația nesalvată.</>,
        <>Nu sări peste verificarea MD5: un transfer UDP/TCP „reușit” nu garantează un fișier identic cu originalul.</>,
      ]} />
      <InlineQuiz ids={['4.9-013', '4.9-014', '4.9-015', '4.9-016']} />
    </section>
  );
}
