import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { Handshake4Way, SecurityTimeline } from '../../diagrams/wlan';
import { EnterpriseFlow, PskVsSae, SecurityModePicker, WirelessAttacks } from '../../diagrams/t5_9';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.9" title="Securitatea wireless — imaginea de ansamblu" />
      <Summary>
        <p>Într-o rețea Wi-Fi, semnalul este „în aer”: oricine din rază poate asculta sau încerca să se asocieze. De aceea standardele <G id="wpa" />, <G id="wpa2" /> și <G id="wpa3" /> adaugă <b>autentificare</b> (cine are voie), <b>criptare</b> (ce nu se vede) și <b>integritate</b> (ce nu se modifică). Obiectivul 5.9 este de tip <b>Describe</b>: compari cele trei generații, modurile <b>Personal</b> și <b>Enterprise</b> și recunoști atacurile și apărările.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial este <i>Describe wireless security protocols (WPA, WPA2, and WPA3)</i>. În 1.11 ai văzut o primă imagine (cronologie, 4-way handshake); aici adâncim: ce algoritmi folosește fiecare, cum diferă autentificarea Personal de Enterprise, ce rezolvă WPA3 și ce amenințări rămân.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['De ce are Wi-Fi nevoie de securitate proprie și cum a evoluat?', 'De ce și istoricul'],
          ['Ce diferențe sunt între WPA, WPA2 și WPA3?', 'Familia WPA'],
          ['Cum funcționează parola comună și de ce e vulnerabilă?', 'Personal: PSK vs SAE'],
          ['Cum funcționează autentificarea individuală?', 'Enterprise: 802.1X/EAP'],
          ['Ce atacuri există și cum ne apărăm?', 'Atacuri și bune practici'],
          ['Cum se aleg modurile pe controller?', 'Exemple de configurare (recunoaștere)'],
        ]} />
        <Analogy>Gândește-te la un <b>birou cu uși de sticlă</b>: oricine trece pe hol vede înăuntru (mediul radio). Criptarea este <b>sticla opacă</b>; autentificarea este <b>portarul</b> care decide cine intră; integritatea este <b>sigiliul</b> de pe documente. WEP era o ușă din carton, WPA o ușă veche întărită, WPA2 o ușă solidă, iar WPA3 adaugă o încuietoare care nu se poate forța cu încercări repetate în liniște.</Analogy>
      </Detailed>
      <Traps items={[
        <>„Securitate Wi-Fi” înseamnă <b>trei lucruri</b> — autentificare, criptare, integritate — nu doar „parolă”.</>,
        <>Un SSID ascuns sau o listă de MAC-uri <b>nu sunt securitate</b>.</>,
        <>WPA, WPA2, WPA3 sunt <b>generații</b>; fiecare are mod Personal și mod Enterprise.</>,
      ]} />
      <InlineQuiz ids={['5.9-001', '5.9-002', '5.9-008']} />
    </section>
  );
}

/* ======================================================================
   1. De ce și istoric
   ====================================================================== */
export function WhySection() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="5.9" title="De ce Wi-Fi are nevoie de securitate și cum a evoluat" />
      <Summary>
        <p>Primul standard, <G id="wep" /> (1997), s-a dovedit spart; <b>WPA</b> (2003) a fost o reparație rapidă pe același hardware; <b>WPA2</b> (2004) a adus AES; <b>WPA3</b> (2018) închide găurile rămase. Fiecare generație răspunde la o slăbiciune concretă a celei dinainte.</p>
      </Summary>
      <Detailed title="1. Cele trei obiective">
        <Table head={['Obiectiv', 'Întrebare', 'Mecanism Wi-Fi']} hlCol={0} rows={[
          ['Autentificare', 'Cine are voie să se conecteze?', 'PSK/SAE (parolă comună) sau 802.1X/EAP (individual)'],
          ['Confidențialitate (criptare)', 'Cine poate citi datele?', 'TKIP (RC4), AES-CCMP, GCMP'],
          ['Integritate', 'Cine poate modifica datele?', 'MIC (Michael la TKIP; CBC-MAC în CCMP; GCM în GCMP)'],
        ]} />
      </Detailed>
      <Detailed title="2. Povestea în patru acte">
        <Figure caption="Cronologie: de la WEP (spart) la WPA3 (recomandat).">
          <SecurityTimeline />
        </Figure>
        <ul>
          <li><b>WEP (1997)</b>: RC4 cu cheie statică (40/104 biți) și un IV de doar 24 de biți. IV-ul se repetă repede, deci cheia se poate recupera din trafic capturat în câteva minute. <b>Nu se mai folosește.</b></li>
          <li><b>WPA (2003)</b>: soluție de tranziție, rulează pe hardware vechi, folosește <b>TKIP</b> (RC4 cu chei diferite pe fiecare pachet) și un MIC. Mai bun decât WEP, dar tot pe RC4: <b>depreciat</b>.</li>
          <li><b>WPA2 (2004, 802.11i)</b>: <b>AES-CCMP</b>, cifru de bloc modern, cu confidențialitate și integritate. A fost standardul de facto aproape două decenii.</li>
          <li><b>WPA3 (2018)</b>: SAE pentru Personal, PMF obligatoriu, mod de 192 de biți pentru Enterprise, OWE pentru rețele deschise.</li>
        </ul>
        <Callout kind="exam" title="Ce reții pentru examen">
          WEP = RC4, spart · WPA = TKIP · WPA2 = AES-CCMP · WPA3 = SAE (Personal) + PMF obligatoriu. Wi-Fi Alliance a cerut WPA3 pentru dispozitivele noi certificate începând cu 2020.
        </Callout>
      </Detailed>
      <Traps items={[
        <>WPA nu înseamnă AES: AES aparține WPA2 (și WPA3). WPA folosește TKIP.</>,
        <>TKIP + AES în „mixed mode” permite clienților vechi să tragă securitatea în jos.</>,
      ]} />
      <InlineQuiz ids={['5.9-003', '5.9-004', '5.9-005', '5.9-007', '5.9-037']} />
    </section>
  );
}

/* ======================================================================
   2. Familia WPA
   ====================================================================== */
export function FamilySection() {
  return (
    <section id="family" className="section">
      <SectionHead id="family" code="5.9" title="WPA, WPA2, WPA3 — comparația și moduri de securitate" />
      <Summary>
        <p>Cele trei generații se compară pe patru axe: <b>criptare</b> (TKIP, <G id="ccmp" />, <G id="gcmp" />), <b>autentificare Personal</b> (<G id="psk" /> sau <G id="sae" />), <b>autentificare Enterprise</b> (802.1X) și <b>protecția cadrelor de management</b> (<G id="pmf" />).</p>
      </Summary>
      <Detailed title="1. Tabelul de examen">
        <Table head={['', 'WPA', 'WPA2', 'WPA3']} hlCol={0} rows={[
          ['An', '2003', '2004', '2018'],
          ['Criptare', 'TKIP (RC4)', 'AES-CCMP (128 biți)', 'AES-CCMP; mod 192-bit: GCMP-256'],
          ['Personal', 'PSK', 'PSK', 'SAE (Dragonfly)'],
          ['Enterprise', '802.1X/EAP', '802.1X/EAP', '802.1X/EAP; mod opțional 192 de biți'],
          ['PMF (802.11w)', 'nu', 'opțional', 'obligatoriu'],
          ['Rețele deschise', '—', '—', 'OWE (Enhanced Open)'],
          ['Verdict', 'depreciat', 'acceptabil', 'recomandat'],
        ]} />
      </Detailed>
      <Detailed title="2. Explorează modurile — interactiv">
        <Figure caption="Interactiv: alege un mod și vezi autentificarea, criptarea, PMF și verdictul.">
          <SecurityModePicker />
        </Figure>
      </Detailed>
      <Detailed title="3. Cele trei cifruri">
        <Table head={['Cifru', 'Bază', 'Folosit de', 'Notă']} hlCol={0} rows={[
          ['TKIP', 'RC4 cu cheie pe pachet + MIC „Michael”', 'WPA', 'depreciat; evită-l'],
          ['CCMP', 'AES (modul counter + CBC-MAC)', 'WPA2, WPA3', 'confidențialitate + integritate'],
          ['GCMP', 'AES (modul Galois/Counter)', 'WPA3-Enterprise 192-bit (GCMP-256)', 'mai eficient, chei de 256 de biți'],
        ]} />
        <p>Toate sunt cifruri pe <b>cadre de date</b>. Cadrele de management (asociere, deconectare) sunt neprotejate în mod clasic; <G id="pmf" /> (802.11w) le semnează/criptează, de aceea e important pentru WPA3.</p>
      </Detailed>
      <DeepDive title="Cum se leagă cheile: PMK, PTK, GTK, MIC">
        <p>Din parolă (Personal) sau din autentificarea 802.1X (Enterprise) rezultă cheia-master <G id="pmk" />. Un <b>4-way handshake</b> amestecă PMK-ul cu două numere aleatorii (<G id="nonce" />, câte unul de la AP și client) și cu adresele MAC pentru a produce <G id="ptk" /> — cheia de trafic unică a fiecărui client. AP-ul livrează apoi, criptat, GTK (cheia pentru broadcast/multicast). Fiecare mesaj conține un <G id="mic" /> care dovedește că ambele părți au aceeași cheie.</p>
        <Figure caption="4-way handshake pas cu pas (diagramă din 1.11, reutilizată).">
          <Handshake4Way />
        </Figure>
      </DeepDive>
      <Traps items={[
        <>WPA2 = AES-CCMP; „WPA2 cu TKIP” este o configurație mixtă slăbită.</>,
        <>WPA3-Personal folosește <b>SAE</b>, nu PSK.</>,
        <>PMF este <b>opțional</b> la WPA2, <b>obligatoriu</b> la WPA3.</>,
      ]} />
      <InlineQuiz ids={['5.9-006', '5.9-014', '5.9-015', '5.9-017', '5.9-018', '5.9-031']} />
    </section>
  );
}

/* ======================================================================
   3. Personal: PSK vs SAE
   ====================================================================== */
export function PersonalSection() {
  return (
    <section id="personal" className="section">
      <SectionHead id="personal" code="5.9" title="Modul Personal: PSK, SAE și atacul de dicționar" />
      <Summary>
        <p>În <G id="wpa-personal" /> toți clienții folosesc aceeași parolă. La WPA2 aceasta este <b>PSK</b>: din parolă și SSID se derivă PMK-ul, iar 4-way handshake-ul poate fi capturat de un atacator și atacat <b>offline</b>. La WPA3 este <b>SAE</b>: nu mai există un handshake de atacat offline, iar cheile au <G id="forward-secrecy" />.</p>
      </Summary>
      <Detailed title="1. PSK: simplu, dar cu o slăbiciune">
        <ol>
          <li>Alegi o parolă (8–63 de caractere ASCII sau 64 de cifre hex).</li>
          <li>Clientul și AP-ul derivă PMK-ul din parolă și SSID (funcție lentă, PBKDF2 cu 4096 de iterații, dar ieftină pentru un atacator cu GPU).</li>
          <li>4-way handshake-ul produce cheile de sesiune.</li>
        </ol>
        <p>Un atacator care ascultă și capturează handshake-ul (îl poate provoca deconectând un client) poate testa parole <b>acasă, offline</b>, cu viteza hardware-ului lui: este un <G id="offline-dictionary-attack" />. O parolă slabă cade rapid; una lungă și aleatorie rezistă. În plus, nu există forward secrecy: cine află parola mai târziu poate decripta traficul capturat înainte.</p>
      </Detailed>
      <Detailed title="2. SAE: schimbul de chei care rezistă">
        <p>SAE (Simultaneous Authentication of Equals, bazat pe protocolul <i>Dragonfly</i>) face ca fiecare ghicire de parolă să necesite o <b>interacțiune activă</b> cu AP-ul. Atacatorul nu poate testa offline un handshake capturat, iar AP-ul poate limita încercările. Cheile de sesiune sunt independente de parolă după stabilire, deci apare forward secrecy.</p>
        <Figure caption="Interactiv: același atacator, aceeași parolă — PSK vs SAE.">
          <PskVsSae />
        </Figure>
        <Callout kind="info" title="Migrarea">
          <G id="wpa3-transition-mode" /> permite aceluiași SSID să primească clienți WPA3 (SAE) și WPA2 (PSK), dar protecția este cea a clientului cel mai slab; se folosește temporar. Clienții vechi care nu suportă WPA3 rămân pe WPA2.
        </Callout>
      </Detailed>
      <Detailed title="3. Bune practici Personal">
        <ul>
          <li>Parolă <b>lungă</b> (fraze de 14+ caractere) și <b>unică</b>, nu cuvânt din dicționar.</li>
          <li>Doar <b>AES</b> (fără TKIP).</li>
          <li>Pentru oaspeți: SSID separat, VLAN separat, parolă rotită periodic.</li>
          <li>Pentru mai mulți utilizatori cu cerințe de revocare: treci la Enterprise.</li>
        </ul>
      </Detailed>
      <Traps items={[
        <>Parola Personal este <b>comună</b>: dacă pleacă un angajat, trebuie schimbată pe toate dispozitivele.</>,
        <>WPA2-PSK cu parolă scurtă: <b>dicționar offline</b>; WPA3 elimină riscul.</>,
        <>Forward secrecy este caracteristică <b>WPA3</b>, nu WPA2.</>,
      ]} />
      <InlineQuiz ids={['5.9-010', '5.9-011', '5.9-012', '5.9-013', '5.9-024', '5.9-028']} />
    </section>
  );
}

/* ======================================================================
   4. Enterprise
   ====================================================================== */
export function EnterpriseSection() {
  return (
    <section id="enterprise" className="section">
      <SectionHead id="enterprise" code="5.9" title="Modul Enterprise: 802.1X și metodele EAP" />
      <Summary>
        <p>În <G id="wpa-enterprise" /> nu există o parolă comună: fiecare utilizator se autentifică individual prin <G id="dot1x" /> și <G id="eap" />, iar un server RADIUS decide. Rezultatul este o cheie unică pe sesiune, revocare individuală, politici pe grup (VLAN/ACL) și accounting — modelul pe care l-ai văzut la 5.8, aplicat Wi-Fi-ului.</p>
      </Summary>
      <Detailed title="1. Fluxul pas cu pas">
        <Figure caption="Interactiv: cei șase pași ai autentificării WPA2/WPA3-Enterprise.">
          <EnterpriseFlow />
        </Figure>
        <p>Rolurile sunt cele din 5.8: <b>supplicant</b> (clientul), <b>authenticator</b> (AP/WLC), <b>authentication server</b> (RADIUS, de exemplu ISE). Între client și AP circulă EAP prin cadre 802.11 (echivalentul EAPOL); între AP/WLC și server, prin RADIUS.</p>
      </Detailed>
      <Detailed title="2. Metodele EAP de recunoscut">
        <Table head={['Metodă', 'Cum se autentifică', 'Certificate', 'Verdict']} hlCol={0} rows={[
          [<G key="t" id="eap-tls" />, 'tunel TLS cu autentificare mutuală', 'server ȘI client', 'cea mai puternică; cere PKI complet'],
          [<G key="p" id="peap" />, 'tunel TLS (cert. server) + parolă/MSCHAPv2 înăuntru', 'doar server', 'răspândită; clientul TREBUIE să valideze certificatul serverului'],
          [<G key="f" id="eap-fast" />, 'tunel cu PAC (Cisco)', 'opțional', 'alternativă Cisco'],
          [<G key="l" id="leap" />, 'MS-CHAP simplu (Cisco, vechi)', 'nu', 'depășită, nesigură'],
        ]} />
        <Callout kind="exam" title="De ținut minte">
          EAP-TLS = certificate pe ambele părți (cea mai sigură) · PEAP = certificat doar pe server + parolă înăuntrul tunelului · LEAP = vechi, de evitat.
        </Callout>
      </Detailed>
      <Detailed title="3. WPA3-Enterprise și modul de 192 de biți">
        <p>WPA3-Enterprise păstrează modelul 802.1X, dar cere PMF și permite un mod opțional <G id="cnsa-192" />: algoritmi de nivel înalt (GCMP-256 pentru trafic, ECDH/ECDSA pe 384 de biți pentru chei și semnături, HMAC-SHA-384). Se folosește în medii cu cerințe stricte; cere clienți, AP-uri și PKI compatibile.</p>
      </Detailed>
      <Traps items={[
        <>PEAP fără validarea certificatului serverului este vulnerabil la <b>evil twin</b>: configurează clienții să verifice CA-ul și numele serverului.</>,
        <>Enterprise cere <b>server RADIUS</b>; fără el nu merge.</>,
        <>EAP este <b>cadrul</b> de autentificare; PEAP, EAP-TLS, EAP-FAST sunt <b>metode</b> EAP.</>,
      ]} />
      <InlineQuiz ids={['5.9-009', '5.9-019', '5.9-020', '5.9-021', '5.9-027', '5.9-033', '5.9-036']} />
    </section>
  );
}

/* ======================================================================
   5. Atacuri și bune practici
   ====================================================================== */
export function AttacksSection() {
  return (
    <section id="attacks" className="section">
      <SectionHead id="attacks" code="5.9" title="Atacuri asupra Wi-Fi și bune practici" />
      <Summary>
        <p>Amenințările tipice sunt: <G id="deauth-attack" />, <G id="evil-twin" />, <G id="rogue-ap" />, dicționarul offline și ascultarea pasivă. Fiecare are o apărare precisă — PMF, validarea certificatelor, WPA3, WIPS — iar măsurile „cosmetice” (SSID ascuns, filtrare MAC) nu le opresc.</p>
      </Summary>
      <Detailed title="1. Catalogul — interactiv">
        <Figure caption="Alege un atac și vezi ce face și cum îl oprești.">
          <WirelessAttacks />
        </Figure>
      </Detailed>
      <Detailed title="2. Ce NU este securitate">
        <ul>
          <li><b>SSID ascuns</b>: numele apare în cadrele de asociere și în răspunsurile clienților; se află ușor.</li>
          <li><b>Filtrare MAC</b>: MAC-urile se văd în aer și se pot falsifica.</li>
          <li><b>Portal captiv (web auth)</b>: controlează accesul la nivel L3 după asociere, dar nu criptează cadrele radio.</li>
          <li><b>Ascunderea parolei pe un afiș</b>: tot parolă comună rămâne.</li>
        </ul>
      </Detailed>
      <Detailed title="3. Ce alegi, în funcție de situație">
        <Table head={['Situație', 'Alegere recomandată']} hlCol={0} rows={[
          ['Companie, utilizatori multipli, audit', 'WPA2/WPA3-Enterprise (802.1X, RADIUS), PMF activ, validarea certificatului'],
          ['Acasă / SOHO, dispozitive moderne', 'WPA3-Personal (SAE) cu parolă lungă'],
          ['Acasă, dispozitive vechi', 'WPA2-Personal cu AES + parolă lungă; transition mode temporar'],
          ['Rețea publică „fără parolă”', 'OWE (Enhanced Open) în loc de rețea deschisă; portal captiv pentru termeni'],
          ['IoT vechi doar cu WPA2', 'SSID/VLAN separat, ACL restrictiv'],
          ['Mediu cu cerințe foarte înalte', 'WPA3-Enterprise 192-bit']
        ]} />
      </Detailed>
      <Traps items={[
        <>PMF oprește deauth-ul falsificat, dar <b>nu</b> oprește singur un evil twin.</>,
        <>OWE criptează, dar <b>nu autentifică AP-ul</b>.</>,
        <>Un singur AP rogue conectat în LAN anulează securitatea tuturor celorlalte: detecție rogue + 802.1X pe porturi.</>,
      ]} />
      <InlineQuiz ids={['5.9-016', '5.9-022', '5.9-023', '5.9-025', '5.9-026', '5.9-029', '5.9-030', '5.9-032']} />
    </section>
  );
}
