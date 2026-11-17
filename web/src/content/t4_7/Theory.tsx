import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { DscpCalc, PolicerShaper, QosPipeline, QueueingDemo } from '../../diagrams/t4_7';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.7" title="QoS și PHB — imaginea de ansamblu" />
      <Summary>
        <p><G id="qos" /> (Quality of Service) este setul de mecanisme prin care o rețea tratează <b>diferit</b> tipuri diferite de trafic atunci când resursele (banda, cozile) nu ajung pentru toți. Obiectivul 4.7 cere să <b>explici</b> comportamentul per-hop (<G id="phb" />) pentru: clasificare, marcare, cozi, evitarea congestiei, policing și shaping. Nu e un obiectiv de configurare — contează conceptele și valorile cheie (EF = 46, AF41 = 34 …).</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.7: <i>Explain the forwarding per-hop behavior (PHB) for QoS such as classification, marking, queuing, congestion, policing, and shaping</i> — tip <b>Explain</b>. Conceptul de bază: nu poți face banda mai mare cu QoS, dar poți hotărî <b>cine suferă primul</b> când ea se termină.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['De ce nu ajunge „mai multă bandă”?', 'De ce avem nevoie de QoS'],
          ['Cum recunosc și etichetez traficul?', 'Clasificare și marcare (CoS, IPP, DSCP)'],
          ['Ce se întâmplă când coada se umple?', 'Cozi și evitarea congestiei'],
          ['Care e diferența dintre policing și shaping?', 'Policing vs shaping'],
        ]} />
        <Analogy>Un drum cu o bandă dublă pentru ambulanțe. Când drumul e liber, toți merg la fel. Când se formează coadă, ambulanțele (voce) trec pe banda lor, mașinile obișnuite așteaptă, iar camioanele de marfă (bulk) merg în spate. QoS nu lărgește drumul: stabilește <i>reguli de trecere</i> pentru momentele aglomerate.</Analogy>
      </Detailed>
      <Traps items={[
        <>QoS nu creează bandă: ajută doar când există congestie. Pe o legătură liberă, toate clasele trec la fel.</>,
        <>PHB (Per-Hop Behavior) este comportamentul <b>local</b> al fiecărui router față de o clasă marcată; nu e o garanție de la un capăt la altul decât dacă toate routerele din drum sunt configurate la fel.</>,
        <>Marcarea (ex. DSCP 46) nu face nimic singură: trebuie ca o politică să <b>acționeze</b> asupra marcajului (coadă, bandă, drop).</>,
      ]} />
      <InlineQuiz ids={['4.7-001', '4.7-002']} />
    </section>
  );
}

/* ======================================================================
   1. De ce QoS
   ====================================================================== */
export function WhySection() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="4.7" title="De ce avem nevoie de QoS" />
      <Summary>
        <p>Rețelele moderne transportă pe aceleași legături voce, video, aplicații de business și descărcări mari. Fiecare tip are cerințe diferite de <b>întârziere</b> (delay), <b>variația întârzierii</b> (<G id="jitter" />) și <b>pierderi</b> (loss). Când o legătură se congestionează, fără QoS un fișier mare poate încetini o convorbire telefonică până devine neinteligibilă.</p>
      </Summary>
      <Detailed title="1. Cele patru probleme">
        <Table head={['Caracteristică', 'Ce este', 'Cine suferă cel mai tare']} hlCol={0} rows={[
          ['Bandă (bandwidth)', 'Cât se poate transmite pe secundă', 'Transferuri mari; video HD'],
          ['Întârziere (delay/latency)', 'Timpul de la sursă la destinație', 'Voce, jocuri, sesiuni interactive'],
          ['Jitter', 'Variația întârzierii între pachete', 'Voce și video (sunet „ciobit”)'],
          ['Pierderi (loss)', 'Pachete aruncate (cozi pline, erori)', 'Voce/video în timp real; TCP încetinește']
        ]} />
        <p>Ghidurile de proiectare Cisco larg citate pentru voce cer, aproximativ, o întârziere într-un sens sub ≈150 ms, un jitter sub ≈30 ms și pierderi sub ≈1% — consideră-le repere de proiectare, nu constante de memorat pentru examen. Un transfer de fișiere, în schimb, suportă întârzieri și retransmiteri fără probleme.</p>
        <Table head={['Tip de trafic', 'Sensibil la', 'Tratament tipic']} hlCol={0} rows={[
          ['Voce (VoIP, RTP)', 'delay, jitter, loss', 'Coadă prioritară (LLQ), DSCP EF'],
          ['Video interactiv', 'jitter, loss, bandă', 'Bandă garantată, AF4x'],
          ['Semnalizare / aplicații critice', 'loss, delay mic', 'Bandă garantată, AF3x/CS3'],
          ['Date tranzacționale', 'loss mic', 'Bandă garantată, AF2x'],
          ['Bulk / best effort', 'aproape nimic', 'Ce rămâne; primele sacrificate'],
        ]} />
      </Detailed>
      <Detailed title="2. Cele trei modele de QoS">
        <ul>
          <li><b>Best effort</b>: fără QoS; toate pachetele la fel. Implicit pe Internet.</li>
          <li><b>IntServ</b>: rezervare de resurse pe tot drumul, per flux (RSVP). Precis, dar nu scalează bine.</li>
          <li><b><G id="diffserv" /></b>: pachetele sunt marcate în clase, iar fiecare router aplică un PHB pe clasă. Scalabil; este modelul uzual și cel din obiectivul 4.7.</li>
        </ul>
      </Detailed>
      <Callout kind="exam" title="Cuvinte cheie de examen">
        „Voce sensibilă la delay/jitter”, „DiffServ”, „PHB”, „congestie”, „trust boundary”, „LLQ pentru voce”, „policing vs shaping”.
      </Callout>
      <Traps items={[
        <>Mai multă bandă nu elimină nevoia de QoS: rafalele pot congestiona oricând.</>,
        <>Jitter ≠ delay: delay e cât durează, jitter e cât variază.</>,
      ]} />
      <InlineQuiz ids={['4.7-003', '4.7-004', '4.7-005']} />
    </section>
  );
}

/* ======================================================================
   2. Clasificare și marcare
   ====================================================================== */
export function MarkingSection() {
  return (
    <section id="marking" className="section">
      <SectionHead id="marking" code="4.7" title="Clasificare și marcare: CoS, IP Precedence, DSCP" />
      <Summary>
        <p><b>Clasificarea</b> înseamnă să recunoști ce fel de trafic este un pachet (după port, protocol, adresă, marcaj existent). <b>Marcarea</b> înseamnă să scrii rezultatul în pachet, ca routerele următoare să nu mai repete analiza. Marcajul stă în <b>802.1Q (CoS/PCP, 3 biți, nivel 2)</b> și în antetul IP (<b>IP Precedence</b> 3 biți sau <b>DSCP</b> 6 biți, nivel 3).</p>
      </Summary>
      <Detailed title="1. Unde se scrie marcajul">
        <Table head={['Câmp', 'Unde', 'Biți', 'Valori', 'Observație']} hlCol={0} rows={[
          [<G key="a" id="cos" />, 'Eticheta 802.1Q (L2)', '3', '0–7', 'Există doar pe trunk-uri; dispare când cadrul iese din L2. Voce = 5 (convenție)'],
          [<G key="b" id="ip-precedence" />, 'Octetul ToS (primii 3 biți)', '3', '0–7', 'Mecanism vechi, compatibil cu CS'],
          [<G key="c" id="dscp" />, 'Octetul ToS / Traffic Class (primii 6 biți)', '6', '0–63', 'Mecanismul modern DiffServ'],
        ]} />
        <p>Octetul ToS din antetul IPv4 (și Traffic Class din IPv6) are 8 biți: primii 6 sunt <b>DSCP</b>, ultimii 2 sunt <b>ECN</b> (notificare explicită de congestie). Primii 3 biți ai DSCP coincid cu vechiul IP Precedence — de aceea CS (Class Selector) a fost definit ca <code>8 × x</code>: păstrează compatibilitatea.</p>
        <p>Pe o legătură trunk, cadrul poartă CoS în eticheta 802.1Q; când intră pe un router care face rutare, eticheta dispare, iar marcajul care contează mai departe este DSCP. De aceea switch-urile mapează CoS ↔ DSCP la granița L2/L3 (de exemplu CoS 5 ↔ EF).</p>
      </Detailed>
      <Detailed title="2. Interactiv: calculează DSCP">
        <Figure caption="Alege clasa PHB și (la AF) probabilitatea de drop; vezi valoarea, biții și octetul ToS.">
          <DscpCalc />
        </Figure>
        <Table head={['PHB', 'DSCP', 'Binar', 'Uz tipic']} hlCol={0} rows={[
          ['EF', '46', '101110', 'Voce (bearer)'],
          ['AF41 / AF42 / AF43', '34 / 36 / 38', '100010 / 100100 / 100110', 'Video interactiv'],
          ['AF31', '26', '011010', 'Semnalizare / critic (uneori CS3 = 24)'],
          ['AF21', '18', '010010', 'Date tranzacționale'],
          ['AF11', '10', '001010', 'Date în bloc'],
          ['CS6', '48', '110000', 'Control de rețea'],
          ['DF / CS0', '0', '000000', 'Best effort'],
        ]} />
        <Callout kind="exam" title="Formule de memorat">
          AFxy: <b>DSCP = 8 × x + 2 × y</b> (x = clasa 1–4, y = probabilitatea de drop 1–3; y mai mare = drop mai probabil). CSx: <b>DSCP = 8 × x</b>. EF = 46 = <code>101110</code>. AF41 = 34. Octetul ToS = DSCP × 4.
        </Callout>
      </Detailed>
      <Detailed title="3. Trust boundary">
        <p>Marcajele primite de la dispozitive nesigure (PC-uri, aplicații) pot fi falsificate: oricine ar putea marca tot traficul lui cu EF și ar fura banda vocii. De aceea se definește o <b><G id="trust-boundary" /></b>: punctul din rețea până unde marcajele sunt <b>de încredere</b>. Practic, un telefon IP Cisco recunoscut de switch (de exemplu prin CDP) este „trusted”, iar un PC nu — switch-ul de acces <b>remarchează</b> sau resetează marcajele PC-ului. Dincolo de boundary, routerele aplică PHB-ul direct.</p>
      </Detailed>
      <DeepDive title="PHB: definiția exactă și cele patru familii">
        <p>Un <b>PHB</b> (Per-Hop Behavior) este comportamentul extern observabil al unui router pentru un agregat de trafic: ce bandă i se garantează, ce întârziere i se dă, ce șansă de drop are. Familii standard: <b>Default (DF/CS0)</b> — best effort; <b>CS</b> — compatibil cu IP Precedence; <b>AF</b> (RFC 2597) — 4 clase × 3 probabilități de drop, deci 12 valori; <b>EF</b> (RFC 3246) — latență mică, jitter mic, pierderi mici, folosit pentru voce. Cisco documentează și valori „recomandate” (RFC 4594), dar la examen contează EF = 46, AF = 8x + 2y, CS = 8x.</p>
      </DeepDive>
      <Traps items={[
        <>CoS (802.1Q) există doar pe cadre cu etichetă: nu trece de un router.</>,
        <>DSCP nu este un octet întreg: este doar primii 6 biți ai octetului ToS (ultimii 2 sunt ECN).</>,
        <>„AF43” nu e „cea mai bună”: y=3 înseamnă probabilitate de drop <b>mare</b> în aceeași clasă.</>,
        <>Marcajele primite de la un PC nu trebuie crezute: remarchează la trust boundary.</>,
      ]} />
      <InlineQuiz ids={['4.7-006', '4.7-007', '4.7-008', '4.7-009', '4.7-010']} />
    </section>
  );
}

/* ======================================================================
   3. Cozi și congestie
   ====================================================================== */
export function QueuingSection() {
  return (
    <section id="queuing" className="section">
      <SectionHead id="queuing" code="4.7" title="Cozi (queuing) și evitarea congestiei" />
      <Summary>
        <p>Congestia apare când pachetele sosesc mai repede decât pot ieși pe o interfață: ele așteaptă într-o <b>coadă</b>. <b>Queuing</b> (managementul congestiei) hotărăște în ce ordine ies pachetele; <b>congestion avoidance</b> (<G id="wred" />) hotărăște ce pachete se aruncă înainte ca bufferul să fie plin. Pe Cisco, combinația uzuală este <b><G id="cbwfq" /> + <G id="llq" /></b>.</p>
      </Summary>
      <Detailed title="1. Mecanisme de coadă">
        <Table head={['Mecanism', 'Cum funcționează', 'Observație']} hlCol={0} rows={[
          ['FIFO', 'O singură coadă, primul venit primul servit', 'Implicit; nu face deosebiri'],
          ['Priority Queuing', 'Cozi cu priorități stricte', 'Clasele de jos pot „flămânzi”'],
          ['WFQ / CBWFQ', 'Cozi pe clase, cu bandă garantată proporțional', 'CBWFQ: clase definite de tine, bandă garantată per clasă'],
          ['LLQ', 'CBWFQ + o coadă prioritară strictă (voce)', 'Coada prioritară este limitată, ca să nu blocheze restul'],
        ]} />
        <Figure caption="Aceeași rafală de pachete: cu FIFO, vocea așteaptă; cu LLQ, vocea trece prima.">
          <QueueingDemo />
        </Figure>
      </Detailed>
      <Detailed title="2. Evitarea congestiei: tail drop, TCP și WRED">
        <p>Când o coadă se umple, varianta simplă este <b><G id="tail-drop" /></b>: pachetele noi sunt aruncate. Problema: toate sesiunile TCP pierd pachete aproape simultan, își reduc fereastra odată și apoi cresc din nou toate odată — oscilații numite <b><G id="tcp-global-sync" /></b>, cu legătura alternând între supraîncărcare și subutilizare.</p>
        <p><b>RED/WRED</b> (Weighted Random Early Detection) evită asta: începe să arunce pachete <b>aleatoriu și devreme</b>, înainte să se umple coada, cu probabilitate crescătoare, iar „weighted” înseamnă că aruncă mai întâi traficul cu prioritate mai mică (de exemplu AF43 înaintea AF41) — de aceea AF are trei valori de drop. TCP reacționează la pierderi, UDP/voce nu: de aceea vocea nu se pune niciodată în aceeași coadă cu traficul supus WRED.</p>
      </Detailed>
      <Traps items={[
        <>LLQ = CBWFQ + <b>o singură</b> coadă prioritară strictă; nu orice clasă poate fi „prioritară”.</>,
        <>Coada prioritară este limitată (policed) în timp ce există congestie; altfel ar bloca celelalte clase.</>,
        <>Tail drop afectează toate fluxurile TCP deodată (sincronizare globală); WRED o previne.</>,
        <>Queuing acționează <b>doar</b> când interfața e congestionată.</>,
      ]} />
      <InlineQuiz ids={['4.7-011', '4.7-012', '4.7-013', '4.7-014']} />
    </section>
  );
}

/* ======================================================================
   4. Policing vs shaping
   ====================================================================== */
export function PolicingSection() {
  return (
    <section id="policing" className="section">
      <SectionHead id="policing" code="4.7" title="Policing vs shaping" />
      <Summary>
        <p>Ambele limitează traficul la o <b>rată</b> (CIR). <b><G id="policing" /></b> aruncă (sau re-marchează) excesul imediat, fără buffer — fără întârziere, dar cu pierderi. <b><G id="shaping" /></b> pune excesul într-un buffer și îl transmite mai târziu — fără pierderi (în limita bufferului), dar cu întârziere. Shaping se aplică doar la <b>ieșire</b>.</p>
      </Summary>
      <Detailed title="1. Interactiv: aceeași rafală, două tratamente">
        <Figure caption="Comută între policing și shaping: observă traficul aruncat și traficul amânat.">
          <PolicerShaper />
        </Figure>
        <Table head={['Aspect', 'Policing', 'Shaping']} hlCol={0} rows={[
          ['Excesul', 'Aruncat sau re-marcat', 'Pus în buffer și amânat'],
          ['Întârziere', 'Nu adaugă', 'Adaugă (jitter posibil)'],
          ['Pierderi', 'Da (TCP încetinește)', 'Doar dacă se umple bufferul'],
          ['Direcție', 'Intrare sau ieșire', 'Doar ieșire'],
          ['Unde se folosește', 'Marginea ISP-ului, limitare pentru clienți', 'Clientul, înainte de legătura WAN, ca să respecte contractul'],
          ['Curba de trafic', 'Cu „tăieturi” (rafale tăiate)', 'Netezită'],
        ]} />
      </Detailed>
      <Detailed title="2. Cum se măsoară „rata”: token bucket">
        <p>Atât policing, cât și shaping se bazează de obicei pe un <b><G id="token-bucket" /></b>: un „vas” se umple cu jetoane cu o viteză egală cu rata permisă (CIR); fiecare pachet trimis consumă jetoane egale cu mărimea lui. Dacă există jetoane, pachetul trece (conform); dacă nu, e <b>excedent</b> — policerul îl aruncă sau îl re-marchează (de exemplu la o clasă cu drop mai mare), shaperul îl ține în buffer până se acumulează jetoane. Mărimea vasului (burst, Bc) determină câtă rafală se tolerează.</p>
        <Analogy>Un taxi-metru cu bonuri: ai bonuri cu care „plătești” fiecare pachet. Bonurile se refac constant. Dacă rămâi fără bonuri, fie ești refuzat la ușă (policing), fie aștepți la coadă până apar altele (shaping).</Analogy>
      </Detailed>
      <Callout kind="exam" title="Regula de aur">
        <b>Policing drops, shaping delays.</b> Policing: aruncă/re-marchează, fără întârziere. Shaping: bufferizează, adaugă întârziere. Shaping doar la ieșire.
      </Callout>
      <Traps items={[
        <>Nu confunda: policing poate și să <b>re-marcheze</b> excesul, nu doar să-l arunce.</>,
        <>Shaping nu elimină pierderile complet: un buffer plin aruncă și el.</>,
        <>Shaping nu se aplică la intrare — un router nu poate „încetini” ce a primit deja.</>,
      ]} />
      <InlineQuiz ids={['4.7-015', '4.7-016', '4.7-017', '4.7-018']} />
    </section>
  );
}

/* ======================================================================
   5. Imaginea completă
   ====================================================================== */
export function PipelineSection() {
  return (
    <section id="pipeline" className="section">
      <SectionHead id="pipeline" code="4.7" title="Imaginea completă: ce se întâmplă cu un pachet" />
      <Summary>
        <p>Un pachet de voce este clasificat și marcat (EF) lângă sursă, trece de un posibil policer, intră în coada prioritară (LLQ) la ieșirea unei interfețe congestionate și, dacă interfața are un contract de viteză, trece printr-un shaper. Fiecare router din drum aplică PHB-ul pe baza marcajului: acesta este sensul „per-hop”.</p>
      </Summary>
      <Detailed title="1. Lanțul QoS">
        <Figure caption="Instrumentele QoS, în ordinea în care acționează asupra unui pachet.">
          <QosPipeline />
        </Figure>
        <ol>
          <li><b>Clasificare</b>: după ACL, protocol, port, marcaj existent, NBAR.</li>
          <li><b>Marcare</b>: se scrie DSCP/CoS; la trust boundary se acceptă sau se resetează.</li>
          <li><b>Policing</b> (opțional): limitează o clasă sau un client.</li>
          <li><b>Queuing + congestion avoidance</b>: LLQ pentru voce, CBWFQ pentru clase cu bandă garantată, WRED pentru TCP.</li>
          <li><b>Shaping</b> (opțional): netezește la rata contractată.</li>
        </ol>
      </Detailed>
      <Detailed title="2. Cum arată configurarea (MQC), doar ca orientare">
        <p>Pe IOS, QoS se configurează cu <b><G id="mqc" /></b> (Modular QoS CLI): <code>class-map</code> (ce trafic), <code>policy-map</code> (ce se face cu el) și <code>service-policy</code> (unde se aplică). Obiectivul 4.7 nu cere configurare, dar exemplul din Config te ajută să lipești conceptele de comenzi: <code>match dscp ef</code>, <code>priority percent 10</code>, <code>bandwidth percent 30</code>, <code>police …</code>, <code>shape average …</code>, <code>random-detect</code>.</p>
      </Detailed>
      <Traps items={[
        <>QoS este configurat <b>pe fiecare hop</b>: un router fără politică tratează pachetul ca best effort, oricât de bine marcat ar fi.</>,
        <>Marcajul se păstrează dincolo de router doar în DSCP (L3); CoS dispare când cadrul iese din L2.</>,
        <>VPN-urile/tunelurile pot ascunde marcajul original; se copiază sau se re-marchează la încapsulare.</>,
      ]} />
      <InlineQuiz ids={['4.7-019', '4.7-020']} />
    </section>
  );
}
