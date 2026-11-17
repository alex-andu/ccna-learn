import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AaaFlow, Dot1xRoles, MethodListDemo, ProtocolCompare } from '../../diagrams/t5_8';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.8" title="AAA — imaginea de ansamblu" />
      <Summary>
        <p><G id="aaa" /> este cadrul prin care o rețea răspunde la trei întrebări despre fiecare acces: <b><G id="authentication" /></b> — <i>cine ești?</i>; <b><G id="authorization" /></b> — <i>ce ai voie să faci?</i>; <b><G id="accounting" /></b> — <i>ce ai făcut?</i>. Obiectivul 5.8 este de tip <b>Compare</b>: trebuie să deosebești cele trei funcții, să compari soluțiile (bază locală vs server, <G id="radius" /> vs <G id="tacacs-plus" />) și să recunoști rolul 802.1X.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial este <i>Compare authentication, authorization, and accounting concepts</i>, fără sub-puncte. În 2.8 ai întâlnit AAA ca metodă de administrare a echipamentelor; aici îl privim ca <b>model conceptual</b>, cu comparații și configurare de bază.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Ce face fiecare dintre cele trei A?', 'Cele trei funcții'],
          ['Cum arată un login complet pas cu pas?', 'Fluxul interactiv'],
          ['Local sau server central?', 'Unde trăiește AAA'],
          ['RADIUS sau TACACS+?', 'Comparația protocoalelor'],
          ['Ce se întâmplă când serverul cade?', 'Liste de metode și fallback'],
          ['Cum autentific porturile și Wi-Fi-ul?', '802.1X'],
        ]} />
        <Analogy>La intrarea într-un birou: <b>recepția</b> îți verifică buletinul (autentificare), <b>ecusonul</b> îți spune la ce etaje poți urca și ce uși se deschid (autorizare), iar <b>registrul de intrări</b> notează cine a intrat, când și cât a stat (accounting). Un sistem AAA face același lucru pentru rețea, într-un loc central.</Analogy>
      </Detailed>
      <Traps items={[
        <>Cele trei funcții sunt <b>distincte</b>: o parolă corectă (autentificare) nu spune nimic despre drepturi (autorizare).</>,
        <>AAA nu este un protocol, ci un <b>cadru</b>; protocoalele care îl implementează sunt RADIUS și TACACS+.</>,
        <>„Availability” nu face parte din AAA (este din triada CIA).</>,
      ]} />
      <InlineQuiz ids={['5.8-001', '5.8-002', '5.8-003', '5.8-004']} />
    </section>
  );
}

/* ======================================================================
   1. Cele trei funcții + flux
   ====================================================================== */
export function FunctionsSection() {
  return (
    <section id="functions" className="section">
      <SectionHead id="functions" code="5.8" title="Cele trei funcții, una câte una, și fluxul unui login" />
      <Summary>
        <p>Un utilizator se prezintă la un <G id="nas" /> (router, switch, WLC). NAS-ul întreabă un server AAA: <b>1)</b> autentificarea (e cine zice?), <b>2)</b> autorizarea (ce are voie?), <b>3)</b> contabilizarea (notez începutul și sfârșitul sesiunii și, opțional, comenzile).</p>
      </Summary>
      <Detailed title="1. Ce înseamnă fiecare funcție">
        <Table head={['Funcție', 'Întrebare', 'Exemple de verificare/decizie', 'Dacă lipsește']} hlCol={0} rows={[
          ['Authentication', 'Cine ești?', 'utilizator + parolă; certificat; MFA; 802.1X', 'oricine poate pretinde orice identitate'],
          ['Authorization', 'Ce ai voie?', 'nivel de privilegiu 0/1/15; lista de comenzi; VLAN/ACL atribuite', 'orice utilizator autentificat ar avea aceleași drepturi'],
          ['Accounting', 'Ce ai făcut?', 'START/STOP/interim: utilizator, durată, trafic, comenzi', 'fără audit, fără facturare, fără urmă la incidente'],
        ]} />
        <ul>
          <li><b>Autentificarea</b> poate folosi unul sau mai mulți factori (ceva ce știi, ai, ești — vezi 5.4).</li>
          <li><b>Autorizarea</b> pe echipamente este adesea nivelul de privilegiu (<code>privilege 15</code> = administrator) sau o listă de comenzi permise; în rețea poate atribui <b>VLAN</b>-ul sau un <b>ACL</b> utilizatorului.</li>
          <li><b>Accounting-ul</b> se folosește pentru audit („cine a șters ACL-ul?”), facturare (timp/volum) și răspuns la incidente.</li>
        </ul>
      </Detailed>
      <Detailed title="2. Fluxul pas cu pas — interactiv">
        <p>Alege protocolul și parcurge pașii. Observă diferența: TACACS+ trimite autentificarea, autorizarea și accounting-ul în conversații separate; RADIUS le combină pe primele două într-un singur răspuns.</p>
        <Figure caption="Interactiv: un login de administrare prin TACACS+ sau RADIUS, de la credențiale la accounting.">
          <AaaFlow />
        </Figure>
      </Detailed>
      <Detailed title="3. Autorizarea mai în detaliu">
        <p>Pe IOS, autorizarea poate acoperi: <b>exec</b> (dacă utilizatorul primește un shell și la ce privilegiu: <code>aaa authorization exec …</code>), <b>comenzi</b> (<code>aaa authorization commands 15 …</code> — fiecare comandă este verificată la server, <G id="command-authorization" />) și <b>rețea</b> (parametri de sesiune). Practic: aceeași parolă dă „operator, doar show” unui tehnician și „administrator” unui inginer, fără conturi locale diferite pe fiecare router.</p>
      </Detailed>
      <Detailed title="4. Accounting în practică">
        <p>Mesajele <b>START</b>, <b>STOP</b> și <b>interim</b> (periodic) ajung la server. Un jurnal tipic spune: utilizator <i>ana</i>, router <i>R1</i>, 10:02–10:41, comenzi: <code>configure terminal</code>, <code>no ip route …</code>. Valoarea lui este <b>forensic</b>: nu previne nimic, dar permite reconstituirea evenimentelor și responsabilizarea administratorilor.</p>
      </Detailed>
      <Traps items={[
        <>Autentificarea reușită <b>nu</b> garantează drepturi: fără autorizare, politica este cea implicită a echipamentului.</>,
        <>Accounting nu blochează nimic; doar <b>înregistrează</b>.</>,
        <>La RADIUS autentificarea și autorizarea vin <b>în același răspuns</b>; la TACACS+ sunt mesaje separate.</>,
      ]} />
      <InlineQuiz ids={['5.8-005', '5.8-006', '5.8-007', '5.8-008']} />
    </section>
  );
}

/* ======================================================================
   2. Local vs server + comparația protocoalelor
   ====================================================================== */
export function ProtocolsSection() {
  return (
    <section id="protocols" className="section">
      <SectionHead id="protocols" code="5.8" title="Unde trăiește AAA: local sau server — RADIUS vs TACACS+" />
      <Summary>
        <p>Cu <b>baza locală</b> (<code>username … secret …</code>) fiecare echipament își ține conturile: simplu, dar nescalabil. Cu un <b>server AAA</b> (de exemplu <G id="cisco-ise" />) toate echipamentele întreabă un loc central, prin <b>RADIUS</b> sau <b>TACACS+</b>. Cele două diferă prin transport, criptare și separarea funcțiilor.</p>
      </Summary>
      <Detailed title="1. De ce un server central">
        <ul>
          <li>Un angajat nou/plecat se adaugă/elimină <b>o singură dată</b>.</li>
          <li>Politici consistente (parole, MFA, roluri) pe toate echipamentele.</li>
          <li>Jurnale centralizate (accounting) pentru audit.</li>
          <li>Integrare cu directoare (Active Directory/LDAP) și MFA.</li>
        </ul>
        <p>Prețul: dependența de rețea și de server. De aceea se păstrează un <b>cont local de rezervă</b> (<G id="aaa-fallback" />), ca să nu pierzi accesul când serverul nu răspunde.</p>
      </Detailed>
      <Detailed title="2. RADIUS vs TACACS+ — tabelul de examen">
        <Table head={['', 'RADIUS', 'TACACS+']} hlCol={0} rows={[
          ['Origine / standard', 'IETF, deschis (RFC 2865/2866)', 'Cisco; RFC 8907'],
          ['Transport', 'UDP 1812 (auth/authz), 1813 (acct); vechi 1645/1646', 'TCP 49'],
          ['Criptare', 'doar câmpul de parolă', 'tot corpul pachetului (antetul în clar)'],
          ['Separarea AAA', 'autentificarea + autorizarea combinate; accounting separat', 'AuthN, AuthZ și Acct complet separate'],
          ['Autorizare pe comandă', 'nu în mod obișnuit', 'da'],
          ['Utilizare tipică', 'acces la rețea: 802.1X, Wi-Fi, VPN', 'administrarea echipamentelor'],
        ]} />
        <Figure caption="Interactiv: ce parte a pachetului este criptată la fiecare protocol.">
          <ProtocolCompare />
        </Figure>
        <Callout kind="exam" title="Cum alegi">
          Dacă ți se cere <b>control fin al comenzilor</b> pe routere/switch-uri → <b>TACACS+</b> (autorizare pe comandă, criptare completă, TCP). Dacă ți se cere <b>acces la rețea</b> pentru utilizatori și dispozitive (Wi-Fi Enterprise, 802.1X, VPN), mai ales în medii multi-vendor → <b>RADIUS</b>. În multe companii coexistă: ISE vorbește ambele.
        </Callout>
      </Detailed>
      <DeepDive title="Secretul partajat și atributele">
        <p>NAS-ul și serverul împart un <G id="shared-secret" /> (<code>key</code>). La RADIUS el ascunde parola și autentifică răspunsurile; la TACACS+ criptează tot corpul. Dacă secretele diferă, serverul pare „mut”: cererile nu pot fi validate. RADIUS transportă și <b>atribute</b> (nivel de privilegiu, VLAN, ACL descărcabil, timeout de sesiune): așa „autorizează” fără un mesaj separat.</p>
      </DeepDive>
      <Traps items={[
        <>TACACS+ = <b>TCP 49</b>, RADIUS = <b>UDP</b> 1812/1813. Nu le inversa.</>,
        <>RADIUS ascunde doar <b>parola</b>; TACACS+ criptează <b>tot corpul</b>.</>,
        <>„TACACS+” nu este „TACACS” sau „XTACACS” (protocoale vechi, fără legătură cu cel modern).</>,
      ]} />
      <InlineQuiz ids={['5.8-009', '5.8-010', '5.8-013', '5.8-014', '5.8-015', '5.8-016', '5.8-017']} />
    </section>
  );
}

/* ======================================================================
   3. Liste de metode
   ====================================================================== */
export function MethodsSection() {
  return (
    <section id="methods" className="section">
      <SectionHead id="methods" code="5.8" title="Liste de metode, fallback și lockout" />
      <Summary>
        <p>Pe IOS, fiecare funcție AAA folosește o <G id="aaa-method-list" />: o listă ordonată de surse, de exemplu <code>group tacacs+ local</code>. Regula-cheie: <b>metoda următoare se încearcă doar dacă precedenta nu răspunde</b> (server inaccesibil), <b>nu</b> dacă răspunde cu refuz.</p>
      </Summary>
      <Detailed title="1. Cum se citește o listă">
        <Table head={['Linie', 'Sens']} hlCol={0} rows={[
          [<code key="a">aaa authentication login default group tacacs+ local</code>, 'login: întâi serverele TACACS+, apoi baza locală'],
          [<code key="b">aaa authorization exec default group tacacs+ local</code>, 'dă shell/privilegiu după răspunsul serverului, altfel local'],
          [<code key="c">aaa accounting exec default start-stop group tacacs+</code>, 'trimite START și STOP la server'],
          [<code key="d">aaa authentication login CONSOLE local</code>, 'listă cu nume: doar local (aplicată pe consolă)'],
        ]} />
        <p>Lista <b>default</b> se aplică automat liniilor; o listă cu nume se aplică explicit sub linie (<code>login authentication CONSOLE</code>).</p>
      </Detailed>
      <Detailed title="2. Fallback — interactiv">
        <Figure caption="Interactiv: schimbă starea serverului și lista de metode; observă când se consultă „local”.">
          <MethodListDemo />
        </Figure>
        <Callout kind="warn" title="Evită lockout-ul">
          Înainte de a trece o linie pe un server AAA: (1) creează un utilizator local (<code>username … secret …</code>); (2) include <code>local</code> în listă; (3) păstrează consola pe o listă separată doar locală; (4) testează dintr-o <b>a doua sesiune</b> deschisă, înainte să închizi prima.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Server care <b>respinge</b> parola = refuz definitiv; <code>local</code> nu este consultat.</>,
        <>Fără <code>local</code> în listă, un server căzut blochează accesul pe toate liniile care folosesc lista.</>,
        <>Fără <code>aaa new-model</code>, comenzile de liste de metode nu au efect.</>,
      ]} />
      <InlineQuiz ids={['5.8-011', '5.8-012', '5.8-021', '5.8-022', '5.8-023', '5.8-024', '5.8-025']} />
    </section>
  );
}

/* ======================================================================
   4. 802.1X
   ====================================================================== */
export function Dot1xSection() {
  return (
    <section id="dot1x" className="section">
      <SectionHead id="dot1x" code="5.8" title="802.1X — AAA pentru porturi și Wi-Fi" />
      <Summary>
        <p><G id="dot1x" /> aplică autentificarea <b>înainte</b> ca un dispozitiv să primească acces la rețea. Are trei roluri: <b><G id="supplicant" /></b> (clientul), <b><G id="authenticator" /></b> (switch-ul sau AP/WLC care păzește portul) și <b><G id="authentication-server" /></b> (RADIUS, de exemplu ISE). Între client și authenticator circulă <G id="eapol" />; între authenticator și server — RADIUS.</p>
      </Summary>
      <Detailed title="1. Cum lucrează">
        <ol>
          <li>Dispozitivul se conectează la port; portul este <b>neautorizat</b>: trece doar EAPOL.</li>
          <li>Authenticator-ul cere identitatea (EAP Request-Identity); supplicant-ul o trimite.</li>
          <li>Authenticator-ul împachetează EAP în <b>RADIUS Access-Request</b> către server.</li>
          <li>Serverul și supplicant-ul schimbă mesajele metodei EAP (parolă, certificat…) prin authenticator.</li>
          <li>Serverul răspunde <b>Access-Accept</b> (opțional cu VLAN/ACL) sau <b>Access-Reject</b>.</li>
          <li>La accept, portul devine <b>autorizat</b>; accounting-ul poate înregistra sesiunea.</li>
        </ol>
        <Figure caption="Interactiv: comută între „înainte” și „după” autentificare.">
          <Dot1xRoles />
        </Figure>
      </Detailed>
      <Detailed title="2. Legătura cu restul obiectivelor">
        <ul>
          <li><b>Wi-Fi Enterprise</b> (WPA2/WPA3-Enterprise, 5.9): AP/WLC sunt authenticator-ul, iar autentificarea este tot 802.1X + RADIUS.</li>
          <li><b>Port security</b> (5.7) limitează adresele MAC; 802.1X autentifică <i>utilizatorul/dispozitivul</i>. Se completează.</li>
          <li><b>Dispozitive fără supplicant</b> (imprimante) pot fi autentificate după MAC (MAB) — doar de recunoscut.</li>
        </ul>
      </Detailed>
      <Traps items={[
        <>Supplicant = client; authenticator = switch/AP/WLC; server = RADIUS — nu inversa rolurile.</>,
        <>EAPOL este între client și authenticator; RADIUS între authenticator și server.</>,
        <>Un port 802.1X neautorizat trece <b>doar EAPOL</b> (de obicei și CDP/STP).</>,
      ]} />
      <InlineQuiz ids={['5.8-018', '5.8-019', '5.8-020', '5.8-026', '5.8-027', '5.8-028']} />
    </section>
  );
}
