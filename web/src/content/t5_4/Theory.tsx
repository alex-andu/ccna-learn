import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { BiometricTradeoff, CertValidation, MfaScenarios, StrengthCalc } from '../../diagrams/t5_4';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.4" title="Politici de parole și alternative — imaginea de ansamblu" />
      <Summary>
        <p>Parola e încă cea mai folosită formă de autentificare și cea mai atacată. Obiectivul 5.4 cere să descrii <b>elementele unei politici de parole</b> (management, complexitate) și <b>alternativele</b> care o completează sau o înlocuiesc: <b>autentificarea multifactor (MFA)</b>, <b>certificatele digitale</b> și <b>biometria</b>. Nu sunt comenzi grele aici, ci concepte pe care le recunoști în scenarii.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 5.4 este <i>Describe security password policy elements, such as management, complexity, and password alternatives (multifactor authentication, certificates, and biometrics)</i> — tip <b>Describe</b>. Cum 5.3 a arătat <i>cum se configurează</i> parole locale, 5.4 arată <i>cum trebuie să fie</i> acele parole și <i>ce se face când parola nu mai ajunge</i>.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Ce reguli are o politică de parole bună?', 'Politica de parole: management și complexitate'],
          ['Cum sunt atacate parolele și de ce contează lungimea?', 'Atacuri și entropie'],
          ['Ce e MFA și ce factori există?', 'Autentificare multifactor'],
          ['Cum dovedesc certificatele o identitate?', 'Certificate digitale și PKI'],
          ['Cum funcționează biometria și ce limite are?', 'Biometrie'],
        ]} />
        <Analogy>O parolă e ca o cheie de apartament: dacă o copiezi sau o pierzi, oricine intră. MFA e ca o cheie + un cod de alarmă: furtul unei singure părți nu ajunge. Certificatul e ca un act de identitate emis de o autoritate de încredere. Biometria e ca recunoașterea după față, dar nu poți „schimba” fața dacă e copiată.</Analogy>
      </Detailed>
      <Traps items={[
        <>Examenul pune accent pe vocabular: <b>management</b> (rotire, reutilizare, stocare), <b>complexitate</b> (lungime, tipuri de caractere), <b>MFA</b> (≥ 2 factori de tipuri diferite), <b>certificate</b> (PKI), <b>biometrie</b> (cine ești).</>,
        <>MFA înseamnă factori de <b>categorii diferite</b>: parolă + PIN nu e MFA.</>,
        <>Politica descrie ce se cere; mecanismele (SSH, AAA, hash-uri) o implementează.</>,
      ]} />
      <InlineQuiz ids={['5.4-001', '5.4-002']} />
    </section>
  );
}

/* ======================================================================
   1. Politica de parole
   ====================================================================== */
export function PolicySection() {
  return (
    <section id="policy" className="section">
      <SectionHead id="policy" code="5.4" title="Politica de parole: management și complexitate" />
      <Summary>
        <p>O <G id="password-policy" /> stabilește cum sunt create, folosite, stocate și schimbate parolele. Două categorii: <b>complexitate</b> (<G id="password-complexity" /> — lungime, tipuri de caractere, evitarea cuvintelor uzuale) și <b>management</b> (unicitate, rotire, reutilizare, blocare, stocare, resetare, unelte precum <G id="password-manager" />).</p>
      </Summary>
      <Detailed title="1. Complexitate">
        <ul>
          <li><b>Lungime</b> — cel mai important factor. Mai lung = exponențial mai greu de ghicit (vezi calculatorul mai jos).</li>
          <li><b>Mix de caractere</b> — litere mari, mici, cifre, simboluri: extinde alfabetul, deci entropia pe caracter.</li>
          <li><b>Imprevizibilitate</b> — fără cuvinte din dicționar, nume, date, secvențe (<code>12345</code>, <code>qwerty</code>), fără informații personale ușor de aflat.</li>
          <li><b>Fără parole implicite sau comune</b> — <code>admin</code>, <code>cisco</code>, <code>password</code> sunt primele încercate.</li>
          <li><b>Passphrase</b> — o frază lungă (de exemplu mai multe cuvinte aleatoare) e ușor de ținut minte și greu de ghicit.</li>
        </ul>
      </Detailed>
      <Detailed title="2. Management">
        <Table head={['Element', 'Ce cere', 'De ce']} hlCol={0} rows={[
          ['Unicitate', 'O parolă diferită pe fiecare serviciu', 'O scurgere la un site nu deschide celelalte (credential stuffing)'],
          ['Rotire', 'Schimbare periodică (clasic) sau la suspiciune de compromitere (recomandările moderne)', 'Limitează fereastra de folosire a unei parole furate'],
          ['Istoric / reutilizare', 'Nu poți reveni la ultimele N parole', 'Previne „rotirea” aparentă cu aceeași parolă'],
          ['Blocare cont', 'Blocare/întârziere după mai multe încercări eșuate', 'Frânează ghicirea online (pe IOS: login block-for, 5.3)'],
          ['Stocare', 'Doar hash cu salt, algoritm lent; niciodată în clar', 'O scurgere de baze de date nu expune parolele direct'],
          ['Resetare', 'Proces verificat, fără întrebări cu răspunsuri ușor de aflat', 'Resetarea e o cale alternativă de atac'],
          ['Parole implicite', 'Schimbate la instalare', 'Sunt publice și încercate primele'],
          ['Partajare', 'Fără parole comune între persoane', 'Altfel nu se știe cine a făcut ce (audit)'],
          ['Manager de parole', 'Recomandat', 'Parole lungi, unice, fără memorare'],
        ]} />
      </Detailed>
      <Detailed title="3. Ce spun ghidurile moderne vs. răspunsul „de manual”">
        <p>Examenul și cursurile clasice descriu: <b>lungime minimă, mix de caractere, schimbare periodică, fără reutilizare</b>. Ghidurile moderne (de exemplu NIST SP 800-63B) nuanțează: pun accent pe <b>lungime</b>, recomandă <b>verificarea parolelor față de liste cu parole comune sau compromise</b>, descurajează regulile de compoziție rigide și <b>rotirea forțată periodică fără motiv</b> (care duce la parole mai slabe, de tip „Parola1!”, „Parola2!”), și cer schimbarea la suspiciune de compromitere. La examen, dacă ți se cer elementele unei politici clasice, răspunde cu cele clasice; dacă o întrebare vorbește despre cele mai bune practici actuale, accentul cade pe lungime, unicitate și MFA.</p>
      </Detailed>
      <Callout kind="exam" title="Cuvinte cheie de examen">
        „<b>Complexity</b>” (lungime + tipuri de caractere), „<b>password management</b>” (rotire, reutilizare, stocare), „<b>password manager</b>”, „<b>default credentials</b>”, „<b>account lockout</b>”, „<b>MFA</b>”.
      </Callout>
      <Traps items={[
        <>Complexitatea nu înlocuiește lungimea: <code>P@ssw0rd!</code> e complexă ca formă dar este un model foarte cunoscut.</>,
        <>O politică prea rigidă produce parole notate pe hârtie sau variații predictibile.</>,
        <>Blocarea contului poate fi folosită pentru DoS (blochezi un utilizator legitim încercând parole greșite): de aceea se folosește și întârzierea.</>,
      ]} />
      <InlineQuiz ids={['5.4-003', '5.4-004', '5.4-005']} />
    </section>
  );
}

/* ======================================================================
   2. Atacuri și entropie
   ====================================================================== */
export function AttacksSection() {
  return (
    <section id="attacks" className="section">
      <SectionHead id="attacks" code="5.4" title="Cum se atacă parolele și de ce contează lungimea" />
      <Summary>
        <p>Atacurile pot fi <b>online</b> (încerci parole direct pe serviciu, frânat prin blocare) sau <b>offline</b> (ai un hash furat și încerci miliarde de variante, fără limită). Apărarea: parole <b>lungi și aleatoare</b>, hash-uri <b>lente cu salt</b>, blocare/întârziere și <b>MFA</b>.</p>
      </Summary>
      <Detailed title="1. Tipuri de atac (recapitulare 5.1)">
        <Table head={['Atac', 'Cum funcționează', 'Ce îl oprește']} hlCol={0} rows={[
          ['Brute force', 'Încearcă toate combinațiile', 'Lungime mare, blocare, hash lent'],
          ['Dictionary', 'Încearcă cuvinte și parole uzuale, cu variații', 'Parole neuzuale, verificare față de liste cu parole slabe'],
          ['Password spraying', 'O parolă comună încercată pe multe conturi', 'Detecție, MFA, politici anti-parole comune'],
          ['Credential stuffing', 'Credențiale scurse de la alt site, încercate aici', 'Unicitate, MFA'],
          ['Rainbow table', 'Tabele precalculate de hash-uri pentru parole uzuale', 'Salt unic per parolă'],
          ['Phishing / keylogger', 'Obține parola de la utilizator, ocolind ghicitul', 'Awareness (5.2), MFA, chei FIDO2'],
        ]} />
      </Detailed>
      <Detailed title="2. Hash, salt și de ce stocarea contează">
        <p>Un sistem corect nu păstrează parola, ci un <b>hash</b>: o valoare unidirecțională. La login se calculează hash-ul parolei introduse și se compară. Un <G id="password-salt" /> este o valoare aleatoare unică adăugată înainte de hash: două persoane cu aceeași parolă ajung la hash-uri diferite, iar tabelele precalculate (rainbow tables) devin inutile. Algoritmii <b>lenți</b> (PBKDF2, bcrypt, scrypt, Argon2) cresc costul fiecărei încercări. Pe Cisco, <code>enable secret</code> / <code>username … secret</code> se bazează pe aceste idei (tip 5/8/9, 5.3); parolele de tip 7 sunt doar ofuscate.</p>
      </Detailed>
      <Detailed title="3. Calculatorul de entropie">
        <Figure caption="Interactiv: modifică lungimea, tipurile de caractere sau numărul de cuvinte și vezi cum se schimbă timpul mediu de ghicire în trei scenarii (ipoteze ilustrative).">
          <StrengthCalc />
        </Figure>
        <p>Observații: (1) <b>fiecare caracter în plus</b> înmulțește spațiul de căutare cu mărimea alfabetului; (2) lungimea bate varietatea: 14 litere mici pot depăși 8 caractere cu simboluri; (3) un hash rapid face atacul offline foarte rapid, iar blocarea face atacul online lent — de aceea parola trebuie să reziste în scenariul <i>offline</i>; (4) parolele alese de oameni sunt mult mai slabe decât cele „aleatoare” din calculator.</p>
      </Detailed>
      <DeepDive title="Entropia pe scurt">
        <p>Entropia în biți măsoară câte alegeri egal probabile are atacatorul: <code>biți = lungime × log₂(mărimea alfabetului)</code>. Fiecare bit în plus <b>dublează</b> munca. 40 de biți = ~10¹² posibilități (rapid la un hash rapid); 80 de biți = ~10²⁴ (impracticabil cu tehnologia curentă pentru ghicire exhaustivă). Formula merge doar pentru alegeri <b>aleatoare</b>; o parolă tip „Iarna2024!” are în realitate foarte puțini biți, fiindcă urmează un tipar.</p>
      </DeepDive>
      <Traps items={[
        <>„Parolă complexă” ≠ „parolă bună”: o parolă scurtă și complexă pierde în fața uneia lungi.</>,
        <>Salt-ul nu face parola mai greu de ghicit dintr-o singură încercare; protejează împotriva precalculării și a identificării parolelor identice.</>,
        <>Un hash rapid (MD5, SHA-1 simple) nu este potrivit pentru parole.</>,
      ]} />
      <InlineQuiz ids={['5.4-006', '5.4-007', '5.4-008']} />
    </section>
  );
}

/* ======================================================================
   3. MFA
   ====================================================================== */
export function MfaSection() {
  return (
    <section id="mfa" className="section">
      <SectionHead id="mfa" code="5.4" title="Autentificarea multifactor (MFA)" />
      <Summary>
        <p><G id="mfa" /> cere <b>cel puțin doi factori din categorii diferite</b>: ceva ce <b>știi</b> (parolă, PIN), ceva ce <b>ai</b> (telefon, token hardware, card, cheie FIDO2) și ceva ce <b>ești</b> (amprentă, față). Chiar dacă o parolă e furată, atacatorul are nevoie și de al doilea factor.</p>
      </Summary>
      <Detailed title="1. Factorii">
        <Table head={['Factor', 'Întrebare', 'Exemple', 'Slăbiciuni']} hlCol={0} rows={[
          ['Knowledge', 'Ce știi?', 'Parolă, PIN, răspuns la întrebare', 'Poate fi ghicit, furat prin phishing, reutilizat'],
          ['Possession', 'Ce ai?', 'Telefon cu aplicație, token hardware, smart card, cheie FIDO2', 'Se poate pierde sau fura; SMS poate fi interceptat sau redirecționat'],
          ['Inherence', 'Ce ești?', 'Amprentă, față, iris', 'Nu poate fi schimbat; poate fi imitat; confidențialitate'],
          ['(Contextuali)', 'Unde / când?', 'Locație, oră, dispozitiv cunoscut', 'Nu sunt factori propriu-ziși, sprijină decizia (autentificare adaptivă)'],
        ]} />
        <Callout kind="exam" title="MFA înseamnă categorii diferite">
          Parolă + întrebare secretă = <b>2 × knowledge</b>, deci NU e MFA, ci doar autentificare în doi pași din același factor. Parolă + cod pe telefon = knowledge + possession = MFA.
        </Callout>
      </Detailed>
      <Detailed title="2. Metode pentru al doilea factor">
        <ul>
          <li><G id="otp" /> (one-time password) — cod valabil o singură dată; <G id="totp" /> (time-based) se calculează din cheia partajată și timp (aplicații de autentificare), de obicei valabil ~30 s.</li>
          <li><b>Notificare push</b> — aprobi pe telefon; vulnerabilă la „push fatigue” (atacatorul trimite multe cereri până când utilizatorul acceptă).</li>
          <li><b>SMS</b> — mai ușor de interceptat (SIM swapping); mai slab decât aplicațiile sau cheile.</li>
          <li><G id="hardware-token" /> — dispozitiv fizic (cheie USB/NFC, card). Cheile FIDO2/WebAuthn sunt legate de domeniu și <b>rezistente la phishing</b>.</li>
          <li><G id="passkey" /> — credențiale bazate pe chei publice (FIDO2) stocate pe dispozitiv; elimină parola și sunt legate de site-ul real.</li>
        </ul>
      </Detailed>
      <Detailed title="3. Simulator: ce oprește MFA">
        <Figure caption="Interactiv: alege un scenariu de compromitere și compară autentificarea cu un singur factor și cu MFA.">
          <MfaScenarios />
        </Figure>
      </Detailed>
      <Detailed title="4. Unde se aplică MFA într-o rețea Cisco">
        <p>MFA nu se configurează cu <code>password</code> pe o linie VTY. Se obține prin <b>AAA centralizat</b> (5.8): routerul trimite autentificarea la un server (RADIUS/TACACS+, de exemplu Cisco ISE) care validează parola și apoi cere al doilea factor (aplicație, token). Se întâlnește frecvent la <b>VPN</b> (5.5), <b>acces administrativ</b>, portaluri web și <b>802.1X</b>. Pe un dispozitiv cu autentificare doar locală, nu există MFA nativ.</p>
      </Detailed>
      <Traps items={[
        <>2FA nu înseamnă automat „sigur”: SMS și push pot fi atacate; metodele legate de dispozitiv/domeniu (FIDO2) sunt cele mai solide.</>,
        <>Două parole nu fac MFA.</>,
        <>MFA nu înlocuiește parolele puternice; le completează.</>,
      ]} />
      <InlineQuiz ids={['5.4-009', '5.4-010', '5.4-011', '5.4-012']} />
    </section>
  );
}

/* ======================================================================
   4. Certificate
   ====================================================================== */
export function CertsSection() {
  return (
    <section id="certs" className="section">
      <SectionHead id="certs" code="5.4" title="Certificate digitale și PKI" />
      <Summary>
        <p>Un <G id="digital-certificate" /> leagă o <b>identitate</b> (un nume, un server, un utilizator, un dispozitiv) de o <b>cheie publică</b>, semnat de o <G id="certificate-authority" /> (CA) în care clientul are încredere. Sistemul întreg (CA, certificate, validare, revocare) se numește <G id="pki" />. Certificatele permit autentificarea fără parole transmise.</p>
      </Summary>
      <Detailed title="1. Cum funcționează în mare">
        <ol>
          <li>Entitatea își generează o <b>pereche de chei</b>: privată (secretă) și publică.</li>
          <li>Trimite o cerere (CSR) la un <b>CA</b>, care îi verifică identitatea.</li>
          <li>CA emite un <b>certificat X.509</b>: nume (subject), cheie publică, perioadă de valabilitate, emitent, semnătura CA.</li>
          <li>La conectare (de exemplu HTTPS), serverul prezintă certificatul; clientul îl <b>validează</b> și apoi folosește cheia publică pentru a stabili o sesiune criptată.</li>
        </ol>
        <p>Dovada posesiei cheii private se face prin semnarea unui mesaj de provocare; <b>cheia privată nu pleacă niciodată</b> de la proprietar.</p>
      </Detailed>
      <Detailed title="2. Validarea unui certificat">
        <Figure caption="Interactiv: alege o situație și vezi la ce pas eșuează validarea.">
          <CertValidation />
        </Figure>
      </Detailed>
      <Detailed title="3. Unde apar certificatele">
        <Table head={['Utilizare', 'Rol']} hlCol={0} rows={[
          ['HTTPS / TLS', 'Identificarea serverului și criptarea sesiunii (lacătul din browser)'],
          ['EAP-TLS (802.1X, Wi-Fi Enterprise)', 'Autentificare mutuală, cu certificate pe client și pe server (5.8, 5.9)'],
          ['VPN (IPsec / TLS)', 'Alternativă la cheia partajată (PSK) pentru autentificarea capetelor (5.5)'],
          ['SSH cu chei', 'Cheile publice autentifică utilizatorul (nu sunt certificate X.509, dar au aceeași idee asimetrică)'],
          ['Semnarea codului și a e-mailurilor', 'Integritate și proveniență'],
        ]} />
        <p><b>Revocarea</b> (<G id="certificate-revocation" />): un certificat poate fi anulat înainte de expirare (cheie compromisă). Clientul verifică o listă (CRL) sau întreabă un serviciu online (OCSP).</p>
      </Detailed>
      <DeepDive title="Certificat self-signed și CA intern">
        <p>Un certificat <b>self-signed</b> este semnat de propria cheie: nu are un CA terț, deci clienții nu au motiv să îl creadă decât dacă îl instalezi manual ca de încredere. Organizațiile folosesc și un <b>CA intern</b> (privat), a cărui certificat rădăcină este instalat pe dispozitivele proprii; browserele publice nu îl cunosc, de aceea apar avertismente când cineva din exterior îl folosește. Pe echipamentele Cisco, certificatele sunt folosite pentru HTTPS pe interfața de administrare, VPN și 802.1X (configurarea PKI pe IOS depășește CCNA).</p>
      </DeepDive>
      <Traps items={[
        <>Cheia <b>privată</b> nu se împarte niciodată; certificatul conține doar cheia <b>publică</b>.</>,
        <>Un certificat valid criptografic poate fi totuși de refuzat: expirat, nume greșit, revocat sau emitent necunoscut.</>,
        <>„Self-signed” nu înseamnă „invalid”, ci „neverificabil de terți”.</>,
      ]} />
      <InlineQuiz ids={['5.4-013', '5.4-014', '5.4-015']} />
    </section>
  );
}

/* ======================================================================
   5. Biometrie
   ====================================================================== */
export function BiometricSection() {
  return (
    <section id="bio" className="section">
      <SectionHead id="bio" code="5.4" title="Biometria și alternative fără parolă" />
      <Summary>
        <p><G id="biometrics" /> identifică o persoană după trăsături fizice sau comportamentale: amprentă, față, iris, voce. Sistemul compară o mostră cu un șablon salvat și decide după un <b>prag</b>. Compromisul clasic: <G id="far-frr" /> — acceptarea falsă a intrușilor (FAR) vs. respingerea falsă a utilizatorilor reali (FRR).</p>
      </Summary>
      <Detailed title="1. Cum funcționează">
        <ol>
          <li><b>Înrolare</b>: se capturează trăsătura și se transformă într-un șablon (nu o fotografie brută).</li>
          <li><b>Autentificare</b>: o nouă mostră e comparată cu șablonul; rezultă un scor de similaritate.</li>
          <li><b>Decizie</b>: dacă scorul depășește pragul, accesul e permis.</li>
        </ol>
        <Figure caption="Interactiv: mută pragul și observă compromisul dintre FAR și FRR (curbe conceptuale).">
          <BiometricTradeoff />
        </Figure>
      </Detailed>
      <Detailed title="2. Avantaje și limite">
        <Table head={['Avantaje', 'Limite']} hlCol={0} rows={[
          ['Nu poate fi uitată sau pierdută ca o parolă', 'Nu poate fi schimbată dacă e compromisă (nu îți poți „reseta” amprenta)'],
          ['Comod și rapid', 'Erori (FAR/FRR); depinde de calitatea senzorului și de condiții'],
          ['Greu de partajat între persoane', 'Poate fi imitat (mulaje, fotografii) fără detecția „liveness”'],
          ['Combinat cu alt factor, crește securitatea', 'Probleme de confidențialitate și legale (date personale sensibile, GDPR)'],
        ]} />
        <p>De aceea biometria se folosește de obicei ca <b>factor suplimentar</b> sau pentru a debloca local o cheie (telefon, laptop), nu ca unic secret transmis pe rețea.</p>
      </Detailed>
      <Detailed title="3. Alternative la parola clasică">
        <ul>
          <li><b>Passkeys / FIDO2</b> — perechi de chei publice per site, deblocate local (PIN/biometrie); nu există parolă de furat și sunt rezistente la phishing.</li>
          <li><b>Smart card / certificate pe card</b> — certificat cu cheie privată în hardware.</li>
          <li><b>SSO (Single Sign-On)</b> — o autentificare puternică, reutilizată pentru mai multe aplicații (<G id="sso" />).</li>
          <li><b>Chei SSH</b> — autentificare prin cheie publică (4.8).</li>
        </ul>
      </Detailed>
      <Traps items={[
        <><b>FAR</b> = False Acceptance Rate (intrus acceptat); <b>FRR</b> = False Rejection Rate (utilizator real respins). Nu le inversa.</>,
        <>Un prag mai strict reduce FAR dar crește FRR.</>,
        <>Biometria nu e secretă (fața ta se vede); contează mai ales detecția de „liveness” și combinarea cu alt factor.</>,
      ]} />
      <InlineQuiz ids={['5.4-016', '5.4-017', '5.4-018']} />
    </section>
  );
}
