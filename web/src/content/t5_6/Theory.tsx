import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AclPlacement, AclProcessor, InOutDirection, WildcardTrainer } from '../../diagrams/t5_6';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.6" title="ACL — imaginea de ansamblu" />
      <Summary>
        <p>Un <G id="acl" /> este o listă ordonată de reguli <b>permit</b> / <b>deny</b> pe care routerul o aplică fiecărui pachet care trece printr-o interfață. Este cel mai simplu instrument de control al traficului din Cisco IOS: „cine are voie să vorbească cu cine, și pe ce serviciu”. Obiectivul 5.6 este de tip <b>Configure and verify</b>: trebuie să scrii ACL-uri (standard, extended, named), să le aplici corect și să le verifici.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial este <i>Configure and verify access control lists</i> și nu are sub-puncte. În practică, examenul cere patru lucruri: (1) să <b>citești</b> un ACL și să spui ce trafic permite; (2) să calculezi <b>wildcard mask</b>-uri; (3) să știi <b>unde și în ce direcție</b> se aplică; (4) să <b>depanezi</b> ACL-uri defecte (ordine, deny implicit, wildcard greșit).</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Ce problemă rezolvă un ACL și cum procesează routerul pachetele?', 'Cum funcționează un ACL'],
          ['Cum scriu „toate adresele din acest interval”?', 'Wildcard mask'],
          ['Care e diferența dintre standard, extended și named?', 'Tipuri de ACL și sintaxa lor'],
          ['Pe ce interfață și în ce direcție îl pun?', 'Plasare, direcție, VTY'],
          ['De ce nu merge ACL-ul meu?', 'Depanare și verificare'],
          ['Comenzi exacte, cu output', 'Exemple de configurare și verificare'],
        ]} />
        <Analogy>Gândește-te la un <b>portar de clădire cu o listă de invitați</b>. Fiecare vizitator (pachet) este comparat cu lista, rând cu rând, de sus în jos. La primul rând care se potrivește, portarul face ce scrie acolo (lasă să intre sau refuză) și nu mai citește restul. Dacă numele nu apare nicăieri, regula nescrisă de la capătul listei spune: <b>„refuz”</b>. Exact așa se comportă și un ACL — inclusiv regula nescrisă, numită <G id="implicit-deny" />.</Analogy>
        <Callout kind="info" title="Ce NU este un ACL">
          Un ACL nu este un firewall stateful: nu ține minte conexiuni, nu inspectează aplicația și nu cunoaște utilizatori. Judecă fiecare pachet izolat, după câmpurile de antet L3/L4. Este însă rapid, ieftin și prezent pe orice router/switch L3 Cisco, deci este baza securității de acces la CCNA.
        </Callout>
      </Detailed>
      <Traps items={[
        <>ACL-ul creat <b>nu filtrează nimic</b> până nu este aplicat pe o interfață (ip access-group) sau pe linii VTY (access-class).</>,
        <>Un ACL cu doar linii <b>deny</b> blochează <b>tot</b>: ultimul rând invizibil este un deny.</>,
        <>Nu confunda <b>wildcard mask</b> cu masca de subrețea: sunt inversul una alteia.</>,
      ]} />
      <InlineQuiz ids={['5.6-001', '5.6-002', '5.6-003']} />
    </section>
  );
}

/* ======================================================================
   1. Cum funcționează un ACL
   ====================================================================== */
export function HowSection() {
  return (
    <section id="how" className="section">
      <SectionHead id="how" code="5.6" title="De ce există ACL și cum procesează routerul pachetele" />
      <Summary>
        <p>Un router, implicit, <b>transmite tot</b> ce poate ruta. Dar rețelele au nevoie de politici: oaspeții nu au voie în serverul de HR, Telnet-ul trebuie interzis, doar un PC de administrare poate intra prin SSH. ACL-ul este mecanismul care transformă aceste politici în reguli. Pachetul este comparat cu liniile (<G id="ace" />) de sus în jos; <b>prima potrivire decide</b>; dacă nu se potrivește nimic, se aplică deny-ul implicit.</p>
      </Summary>
      <Detailed title="1. Ce se potrivește, concret">
        <p>Fiecare linie descrie un tipar de pachet și o acțiune. Un ACL <b>standard</b> compară doar <b>adresa sursă</b>. Un ACL <b>extended</b> compară, în ordine: <b>protocolul</b> (ip, tcp, udp, icmp…), adresa sursă, eventual portul sursă, adresa destinație, eventual portul destinație și, pentru TCP, anumite flag-uri.</p>
        <Table head={['Câmp din pachet', 'Standard', 'Extended']} hlCol={0} rows={[
          ['Adresa IP sursă', 'da', 'da'],
          ['Adresa IP destinație', 'nu', 'da'],
          ['Protocol (TCP/UDP/ICMP/…)', 'nu', 'da'],
          ['Porturi TCP/UDP sursă și destinație', 'nu', 'da'],
          ['Flag TCP „established” (ACK/RST)', 'nu', 'da'],
        ]} />
      </Detailed>
      <Detailed title="2. Procesarea pas cu pas — interactiv">
        <p>În figura de mai jos ACL-ul <code>SRV-IN</code> protejează un server. Alege un pachet și urmărește unde se oprește evaluarea. Apoi adaugă la final un <code>permit ip any any</code> și vezi cum se schimbă pachetele care înainte erau aruncate de deny-ul implicit.</p>
        <Figure caption="Interactiv: primul rând care se potrivește decide; liniile de după nu mai sunt citite; deny-ul implicit este ultima plasă.">
          <AclProcessor />
        </Figure>
        <ol>
          <li>Pachetul ajunge pe interfața unde este aplicat ACL-ul.</li>
          <li>Routerul citește <b>linia 10</b>: se potrivește? Dacă da, execută <code>permit</code> sau <code>deny</code> și <b>se oprește</b>.</li>
          <li>Dacă nu, trece la linia următoare (20, 30…).</li>
          <li>Dacă a ajuns la capăt fără nicio potrivire, aplică regula invizibilă <code>deny ip any any</code>.</li>
        </ol>
        <Callout kind="exam" title="Consecințele regulii „prima potrivire decide”">
          (1) <b>Specific înainte de general</b>: o linie <code>permit ip any any</code> pusă prea sus anulează orice deny de sub ea. (2) <b>Cel puțin un permit</b> trebuie să existe într-un ACL util. (3) Un ACL se citește <b>mereu de la capăt la capăt</b>, ca un algoritm, nu ca o listă de preferințe.
        </Callout>
      </Detailed>
      <Detailed title="3. Direcția: in și out">
        <p>Un ACL se aplică pe o <b>interfață</b> și într-o <b>direcție</b>, judecată din punctul de vedere al routerului. Pe aceeași interfață poți avea un ACL pentru pachetele care intră și altul pentru cele care ies (dar cel mult unul pe direcție și pe protocol).</p>
        <Figure caption="Interactiv: comută între inbound și outbound; observă unde se află ACL-ul față de decizia de rutare.">
          <InOutDirection />
        </Figure>
        <ul>
          <li><G id="acl-direction" /> <b>inbound</b>: filtrarea are loc <b>înainte</b> de căutarea în tabela de rutare; pachetele refuzate nu mai consumă resurse de rutare. Este alegerea obișnuită.</li>
          <li><b>outbound</b>: filtrarea are loc <b>după</b> rutare, chiar înainte de ieșire. Util când vrei o politică unică pentru tot ce iese printr-o interfață, indiferent pe unde a intrat.</li>
          <li>ACL-urile outbound <b>nu filtrează traficul generat chiar de router</b> (de exemplu un ping inițiat din consola routerului).</li>
        </ul>
      </Detailed>
      <DeepDive title="Ce altceva folosește ACL-uri (în afara filtrării pe interfață)">
        <p>Același mecanism „listă de potriviri” este refolosit de mai multe funcții IOS, de aceea învățarea lui plătește din plin:</p>
        <ul>
          <li><b>VTY</b> (<G id="access-class" />): care gazde au voie să intre prin SSH/Telnet — vezi 4.8 și 5.3.</li>
          <li><b>NAT</b> (4.1): un ACL standard sau extended selectează <i>ce adrese interne</i> se traduc.</li>
          <li><b>QoS</b> (4.7): un ACL clasifică traficul care primește o anumită prioritate.</li>
          <li><b>Rutare</b>: filtre de rute (prefix-list/route-map) folosesc concepte asemănătoare, dar nu fac parte din CCNA.</li>
        </ul>
        <p>În aceste folosiri, semnificația lui <code>permit</code> și <code>deny</code> se schimbă: <code>permit</code> înseamnă „selectează pentru funcția respectivă”, nu neapărat „lasă să treacă”.</p>
      </DeepDive>
      <Traps items={[
        <>Ordinea liniilor este <b>criticul</b> ACL-ului: o linie generală pusă prea sus „ascunde” liniile de sub ea.</>,
        <>ACL-ul outbound <b>nu</b> filtrează pachetele generate de router însuși.</>,
        <>Direcția „in” înseamnă „pachetul intră pe <i>acea interfață</i>”, nu „vine din Internet”.</>,
      ]} />
      <InlineQuiz ids={['5.6-004', '5.6-019', '5.6-020', '5.6-023']} />
    </section>
  );
}

/* ======================================================================
   2. Wildcard
   ====================================================================== */
export function WildcardSection() {
  return (
    <section id="wildcard" className="section">
      <SectionHead id="wildcard" code="5.6" title="Wildcard mask — cum spui „aceste adrese”" />
      <Summary>
        <p>Într-un ACL nu scrii o mască de subrețea, ci un <b><G id="wildcard-mask" /></b>. Regula e simplă și opusă măștii: un bit <b>0</b> în wildcard înseamnă „acest bit trebuie să fie egal cu cel din adresa de bază”, iar un bit <b>1</b> înseamnă „nu-mi pasă”. Wildcard-ul unei rețele este <b>255.255.255.255 minus masca</b>.</p>
      </Summary>
      <Detailed title="1. De ce wildcard și nu mască">
        <p>Masca de subrețea răspunde la „unde se termină partea de rețea?”. ACL-ul are nevoie de ceva mai flexibil: „care biți trebuie verificați și care pot fi orice?”. Wildcard-ul permite chiar tipare pe care o mască de subrețea nu le poate exprima (de exemplu doar adresele pare). Pentru examen însă, 95% din cazuri sunt wildcard-uri contigue, adică <i>inversul</i> unei măști.</p>
        <Figure caption="Interactiv: alege prefixul și o adresă de testat; vezi biții măștii, wildcard-ul rezultat și intervalul potrivit.">
          <WildcardTrainer />
        </Figure>
      </Detailed>
      <Detailed title="2. Tabela pe care s-o știi pe de rost">
        <Table head={['Prefix', 'Mască', 'Wildcard', 'Adrese potrivite']} hlCol={2} rows={[
          ['/8', '255.0.0.0', '0.255.255.255', '16 777 216'],
          ['/16', '255.255.0.0', '0.0.255.255', '65 536'],
          ['/24', '255.255.255.0', '0.0.0.255', '256'],
          ['/25', '255.255.255.128', '0.0.0.127', '128'],
          ['/26', '255.255.255.192', '0.0.0.63', '64'],
          ['/27', '255.255.255.224', '0.0.0.31', '32'],
          ['/28', '255.255.255.240', '0.0.0.15', '16'],
          ['/29', '255.255.255.248', '0.0.0.7', '8'],
          ['/30', '255.255.255.252', '0.0.0.3', '4'],
          ['/32 (host)', '255.255.255.255', '0.0.0.0', '1'],
        ]} />
        <p>Metoda rapidă: <b>wildcard = 255 − octetul măștii</b>, octet cu octet. Exemplu: <code>255.255.255.192</code> → <code>0.0.0.63</code>. Pentru blocuri care nu sunt la granița unui octet, calculează în octetul „interesant”: pentru <code>192.168.4.0 – 192.168.7.255</code> octetul 3 are 4 valori (4, 5, 6, 7) → wildcard 3 în acel octet, iar octetul 4 e liber → <code>0.0.3.255</code>.</p>
      </Detailed>
      <Detailed title="3. Prescurtări: host și any">
        <Table head={['Scrii', 'Echivalent', 'Sens']} hlCol={0} rows={[
          [<code key="a">host 10.1.1.5</code>, <code key="b">10.1.1.5 0.0.0.0</code>, 'o singură adresă (toți biții trebuie să fie egali)'],
          [<code key="c">any</code>, <code key="d">0.0.0.0 255.255.255.255</code>, 'orice adresă (niciun bit nu contează)'],
        ]} />
        <Callout kind="tip" title="Cum verifici rapid un wildcard">
          Ia adresa de bază și wildcard-ul. Intervalul este <b>de la adresa de bază până la (adresa de bază + wildcard)</b>, cu condiția ca adresa de bază să fie multiplu de (wildcard + 1). Exemplu: <code>172.16.32.0 0.0.15.255</code> → 172.16.32.0 … 172.16.47.255 (32 + 15 = 47).
        </Callout>
      </Detailed>
      <Traps items={[
        <>Nu scrie <code>255.255.255.0</code> în loc de <code>0.0.0.255</code>: IOS acceptă comanda, dar potrivește cu totul alte adrese.</>,
        <>Adresa de bază trebuie să fie <b>începutul blocului</b> (multiplu al dimensiunii); altfel o parte din biți „ignorați” fac adresa de bază să nu mai fie primul element al intervalului.</>,
        <><code>host</code> = 0.0.0.0 ca wildcard; <code>any</code> = 255.255.255.255. Nu le inversa.</>,
      ]} />
      <InlineQuiz ids={['5.6-009', '5.6-010', '5.6-013', '5.6-014']} />
    </section>
  );
}

/* ======================================================================
   3. Tipuri: standard, extended, named
   ====================================================================== */
export function TypesSection() {
  return (
    <section id="types" className="section">
      <SectionHead id="types" code="5.6" title="Standard, extended și named — sintaxă și diferențe" />
      <Summary>
        <p>Există două „puteri” de potrivire — <G id="standard-acl" /> (doar sursa) și <G id="extended-acl" /> (protocol, sursă, destinație, porturi) — și două „moduri de scriere” — <b>numerotat</b> (o singură linie per comandă) și <G id="named-acl" /> (submod cu numere de secvență, ușor de editat). Alegerea numărului sau a cuvântului cheie (<code>standard</code> / <code>extended</code>) stabilește puterea.</p>
      </Summary>
      <Detailed title="1. Comparația">
        <Table head={['', 'Standard', 'Extended', 'Named']} hlCol={0} rows={[
          ['Potrivește', 'doar sursa', 'protocol, sursă, destinație, porturi, flag-uri', 'standard sau extended (după cuvântul-cheie)'],
          ['Numere', '1–99, 1300–1999', '100–199, 2000–2699', 'nume (ex. WEB-IN)'],
          ['Plasare tipică', 'lângă destinație', 'lângă sursă', 'ca tipul pe care îl reprezintă'],
          ['Editare', 'ștergi și refaci (clasic) sau intri în submod', 'la fel', 'inserezi/ștergi prin număr de secvență'],
          ['Exemplu', <code key="s">access-list 10 permit 192.168.1.0 0.0.0.255</code>, <code key="e">access-list 110 permit tcp any host 10.1.1.80 eq 80</code>, <code key="n">ip access-list extended WEB-IN</code>],
        ]} />
      </Detailed>
      <Detailed title="2. Anatomia unei linii extended">
        <Table head={['Câmp', 'Valori', 'Exemplu']} hlCol={0} rows={[
          ['acțiune', 'permit | deny', 'permit'],
          ['protocol', 'ip | tcp | udp | icmp | eigrp | ospf | număr', 'tcp'],
          ['sursă', 'any | host a.b.c.d | rețea wildcard', '192.168.10.0 0.0.0.255'],
          ['port sursă (opțional)', 'eq | neq | gt | lt | range + port/nume', '(de obicei lipsește)'],
          ['destinație', 'any | host a.b.c.d | rețea wildcard', 'host 10.1.1.80'],
          ['port destinație (opțional)', 'eq 80 · eq www · eq 443 · range 20 21', 'eq 80'],
          ['opțiuni', 'established · log · echo / echo-reply (ICMP)', 'log'],
        ]} />
        <p>Exemplu complet: <code>permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.80 eq 80</code> = „permite <b>TCP</b> din rețeaua 192.168.10.0/24 către <b>serverul</b> 10.1.1.80, pe <b>portul 80</b>”. Operatorii de port sunt <code>eq</code> (egal), <code>neq</code> (diferit), <code>gt</code> (mai mare), <code>lt</code> (mai mic) și <code>range</code> (interval). Pentru protocoalele ICMP se pot specifica tipuri: <code>echo</code>, <code>echo-reply</code>, <code>unreachable</code>, <code>time-exceeded</code>.</p>
        <Callout kind="exam" title="Portul destinație, nu portul sursă">
          Un client alege un port sursă efemer (de exemplu 51234) și se conectează la portul <b>destinație</b> al serviciului (80, 443, 22). De aceea, pentru a permite „accesul la web”, scrii <code>eq 80</code> după <b>destinație</b>. Dacă îl scrii după sursă, regula nu mai potrivește traficul real.
        </Callout>
      </Detailed>
      <Detailed title="3. ACL named: editare cu numere de secvență">
        <p>Într-un ACL named fiecare linie are un număr de secvență (<G id="acl-sequence-number" />): implicit 10, 20, 30… Asta îți permite să <b>inserezi</b> o linie între două existente (de exemplu <code>15 permit …</code>) sau să <b>ștergi</b> una (<code>no 20</code>) fără să refaci ACL-ul. O linie introdusă <b>fără</b> număr se adaugă la <b>sfârșit</b>. Același submod funcționează și pentru ACL-urile numerotate: <code>ip access-list extended 110</code>.</p>
        <p>Pentru documentare folosești <G id="acl-remark" /> (<code>remark …</code>), iar pentru depanare cuvântul-cheie <G id="acl-log" /> la finalul liniei (mesaj syslog la potrivire; atenție la încărcarea CPU).</p>
      </Detailed>
      <Detailed title="4. Traficul de întoarcere și cuvântul „established”">
        <p>ACL-urile sunt <b>stateless</b>: răspunsul unui server este un pachet nou, judecat separat. Dacă aplici un ACL inbound pe interfața dinspre exterior, trebuie să permiți explicit răspunsurile. Pentru TCP poți folosi <G id="established-keyword" />: <code>permit tcp any any established</code> lasă să treacă segmentele cu ACK sau RST, adică pe cele care <i>nu</i> încep o conexiune nouă. Este o aproximare: nu verifică dacă a existat într-adevăr o conexiune. Pentru UDP și ICMP nu există un echivalent, deci permiți explicit (<code>echo-reply</code>, DNS).</p>
      </Detailed>
      <DeepDive title="ACL IPv6">
        <p><G id="ipv6-acl" />-urile sunt <b>întotdeauna named</b> și folosesc prefixe, nu wildcard: <code>ipv6 access-list V6-IN</code>, <code>permit tcp any host 2001:db8:10::80 eq 80</code>; se aplică cu <code>ipv6 traffic-filter V6-IN in</code> (pe VTY: <code>ipv6 access-class</code>). La finalul lor există, pe lângă deny-ul implicit, două permit-uri implicite pentru Neighbor Discovery (<code>nd-na</code>, <code>nd-ns</code>), fără de care IPv6 nu și-ar putea rezolva vecinii. Dacă scrii tu un <code>deny ipv6 any any</code> explicit, trebuie să permiți ND manual înaintea lui.</p>
      </DeepDive>
      <Traps items={[
        <><code>access-list 10 permit … 255.255.255.0</code>: masca nu e wildcard — rezultat greșit, fără eroare.</>,
        <>O linie adăugată fără secvență intră <b>la sfârșit</b>; dacă înaintea ei există deja un <code>deny ip any any</code> explicit, nu va fi citită niciodată.</>,
        <>Portul se scrie după <b>destinație</b> când vrei să potrivești serviciul (80, 443, 22), nu după sursă.</>,
        <><code>established</code> nu face din ACL un firewall stateful: pachetele cu ACK pot fi forjate.</>,
      ]} />
      <InlineQuiz ids={['5.6-005', '5.6-006', '5.6-007', '5.6-022', '5.6-024']} />
    </section>
  );
}

/* ======================================================================
   4. Plasare, direcție, VTY
   ====================================================================== */
export function PlacementSection() {
  return (
    <section id="placement" className="section">
      <SectionHead id="placement" code="5.6" title="Unde și cum se aplică un ACL: plasare, interfețe, VTY" />
      <Summary>
        <p>Același ACL poate fi corect sau dăunător, în funcție de locul unde îl pui. Regula clasică: <b>extended lângă sursă</b> (oprești traficul interzis cât mai devreme), <b>standard lângă destinație</b> (fiind grosier, nu vrei să blochezi sursa spre alte destinații). Se aplică pe interfețe cu <G id="access-group" /> și pe liniile VTY cu <G id="access-class" />.</p>
      </Summary>
      <Detailed title="1. De ce regula de plasare">
        <Figure caption="Interactiv: alege tipul de ACL și locul în care îl aplici; compară efectele.">
          <AclPlacement />
        </Figure>
        <p>Un ACL extended poate descrie exact „PC1 → serverul FTP, port 21”. Dacă îl pui lângă destinație, pachetele interzise parcurg toată rețeaua doar ca să fie aruncate la capăt. Un ACL standard nu poate preciza destinația: pus lângă sursă, ar tăia accesul sursei către orice, nu doar către serverul protejat.</p>
      </Detailed>
      <Detailed title="2. Aplicarea pe interfață">
        <p>Procedura: (1) creezi ACL-ul; (2) intri pe interfața aleasă; (3) <code>ip access-group &lt;ACL&gt; in|out</code>. O interfață poate avea <b>cel mult un ACL IPv4 pe direcție</b> (și unul IPv6 pe direcție). Dacă ai nevoie de mai multe reguli, le combini în același ACL. Pentru a elimina ACL-ul de pe interfață folosești <code>no ip access-group …</code>; ștergerea completă a ACL-ului se face cu <code>no ip access-list …</code> / <code>no access-list …</code>.</p>
      </Detailed>
      <Detailed title="3. Protejarea accesului de management (VTY)">
        <p>ACL-ul de interfață filtrează traficul <i>care traversează</i> routerul. Accesul SSH către routerul însuși intră pe orice interfață, deci un ACL pe o singură interfață nu l-ar proteja. Soluția este un ACL standard (sau extended) aplicat <b>pe linia VTY</b>: <code>line vty 0 15</code> → <code>access-class MGMT in</code>. Astfel doar stațiile de administrare permise (de exemplu <code>10.0.0.0/24</code>) pot deschide sesiuni, indiferent pe ce interfață sosesc.</p>
        <Callout kind="warn" title="Nu te bloca singur">
          Înainte de a aplica un ACL pe VTY sau pe interfața prin care ești conectat, verifică de două ori că adresa ta este permisă. Cel mai sigur: testează întâi accesul prin consolă sau păstrează o a doua sesiune deschisă.
        </Callout>
      </Detailed>
      <Traps items={[
        <>VTY → <code>access-class</code>; interfață → <code>ip access-group</code>. Nu se amestecă.</>,
        <>Un singur ACL per interfață, per direcție, per protocol; nu poți „suprapune” două.</>,
        <>Standard lângă sursă blochează sursa spre <b>tot</b>; de aceea se pune lângă destinație.</>,
      ]} />
      <InlineQuiz ids={['5.6-016', '5.6-017', '5.6-018', '5.6-021']} />
    </section>
  );
}

/* ======================================================================
   5. Depanare și verificare
   ====================================================================== */
export function TroubleSection() {
  return (
    <section id="trouble" className="section">
      <SectionHead id="trouble" code="5.6" title="Verificare și depanare: de ce nu merge ACL-ul" />
      <Summary>
        <p>Majoritatea defectelor de ACL sunt de câteva tipuri: <b>ordine greșită</b>, <b>permit lipsă</b> (deny implicit), <b>wildcard greșit</b>, <b>direcție/interfață greșită</b> sau <b>ACL neaplicat</b>. Instrumentele sunt trei: <code>show access-lists</code> (contoare), <code>show ip interface</code> (ce ACL e aplicat unde) și testul real cu <code>ping</code> / <code>telnet</code> la un port.</p>
      </Summary>
      <Detailed title="1. Lista de verificare">
        <Table head={['Simptom', 'Cauză probabilă', 'Cum verifici']} hlCol={0} rows={[
          ['Tot traficul e blocat după aplicare', 'doar linii deny sau lipsește permit-ul final', 'show access-lists: toate contoarele pe deny; ultimul rând are 0 matches'],
          ['Un deny nu are efect', 'un permit mai general e mai sus', 'contorul deny-ului rămâne 0, al permit-ului crește'],
          ['ACL-ul nu schimbă nimic', 'neaplicat sau aplicat pe interfața/direcția greșită', 'show ip interface <if>: „Inbound/Outbound access list is …”'],
          ['Merge doar o parte din trafic', 'wildcard prea îngust sau prea larg', 'verifică intervalul calculat; contoarele'],
          ['Merge dus, nu și întors', 'răspunsurile (stateless) nu sunt permise', 'permite echo-reply/established/DNS explicit'],
          ['Pierzi accesul SSH la router', 'ACL pe VTY/interfață nu te include', 'consolă; show running-config | section line vty'],
        ]} />
      </Detailed>
      <Detailed title="2. Contoarele spun adevărul">
        <p>Fiecare linie arată în <code>show access-lists</code> un contor „<code>(N matches)</code>”. După ce trimiți trafic de test, liniile care ar fi trebuit să se potrivească trebuie să-și crească contorul. O linie cu 0 matches, deși ar trebui să prindă trafic, e primul indiciu de ordine sau wildcard greșit. <code>clear access-list counters</code> resetează contoarele între teste.</p>
      </Detailed>
      <Detailed title="3. Metoda sistematică">
        <ol>
          <li><b>Reproduce</b> problema cu un test concret (de exemplu PC-Guest → server, port 443).</li>
          <li>Identifică <b>pe ce interfață și în ce direcție</b> trece traficul (inbound pe interfața sursei? outbound pe cea a destinației?).</li>
          <li>Citește ACL-ul de sus în jos <b>ca un router</b>, pentru exact acel pachet: sursă, destinație, protocol, port.</li>
          <li>Verifică contoarele după test; ajustează ordinea sau wildcard-ul; testează din nou.</li>
        </ol>
      </Detailed>
      <Traps items={[
        <>Un ACL poate fi <b>perfect scris</b> și totuși nefolosit: verifică întâi că e aplicat unde crezi.</>,
        <>Un ACL <b>inexistent</b> referit de <code>access-group</code> nu blochează nimic (permite tot) — nu-l confunda cu unul existent, care are deny implicit.</>,
        <>Când blochezi ICMP complet, dispar și <code>ping</code>, și <code>traceroute</code>, și PMTUD: permite selectiv tipurile necesare.</>,
      ]} />
      <InlineQuiz ids={['5.6-025', '5.6-026', '5.6-027']} />
    </section>
  );
}
