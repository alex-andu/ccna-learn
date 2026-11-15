import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { AbbrevTrainer, AllocationHierarchy, HextetAnatomy, Ipv6HeaderDiagram, PrefixVisualizer, RaFlags, SlaacFlow, SubnetLister } from '../../diagrams/t1_8';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.8" title="IPv6 — imaginea de ansamblu" />
      <Summary>
        <p><G id="ipv6" /> înlocuiește adresele de 32 de biți cu adrese de <b>128 de biți</b>, scrise ca 8 grupuri hexazecimale (<G id="hextet" />-uri). Obiectivul 1.8 cere să știi să <b>configurezi și să verifici</b> adrese și prefixe IPv6 pe un router și să înțelegi cum își iau adresa hostii.
          Nu există mască în format zecimal: lungimea prefixului (<code>/64</code>) spune ce parte a adresei identifică rețeaua.</p>
      </Summary>

      <Detailed>
        <p>Pentru un începător, IPv6 pare „IPv4 cu numere mai lungi”. În realitate, câteva lucruri funcționează diferit, și tocmai ele sunt testate la examen. Ordinea din această lecție urmărește exact întrebările pe care ți le pui când întâlnești IPv6 prima dată:</p>
        <Table head={['Secțiune', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['De ce IPv6', 'Ce problemă rezolvă și cum a apărut?'],
          ['Antetul', 'Prin ce diferă un pachet IPv6 de unul IPv4?'],
          ['Notația', 'Cum citesc și cum scurtez o adresă de 128 de biți?'],
          ['Prefixul', 'Unde se termină rețeaua și unde începe hostul, dacă nu mai există mască?'],
          ['Alocare și subnetting', 'Câte rețele am, cum le numerotez, de ce toate sunt /64?'],
          ['Cum își iau hostii adresa', 'Static, SLAAC sau DHCPv6 — și ce rol are routerul?'],
          ['Configurare și verificare', 'Ce comenzi dau pe un router Cisco și ce văd în rezultat?'],
        ]} />
        <Callout kind="info" title="Ce cere examenul la 1.8 și ce rămâne la 1.9">
          Obiectivul oficial este <b>„Configure and verify IPv6 addressing and prefix”</b>, fără sub-puncte. Aici înveți notația, prefixul, subnetarea, configurarea și verificarea. <b>Tipurile de adrese</b> (global, unique local, link-local, anycast, multicast) și <b>Modified EUI-64</b> sunt obiectivul <b>1.9</b>; aici le atingi doar cât este necesar ca să înțelegi o configurare. Când vezi cuvântul <i>link-local</i> sau <code>eui-64</code> într-un exemplu, ține minte: detaliile vin la 1.9.
        </Callout>
        <Analogy>Gândește-te la IPv4 ca la un număr de telefon cu 10 cifre într-o țară mică: s-au terminat numerele libere. IPv6 este ca trecerea la un sistem de numere atât de lung încât fiecare obiect din lume ar putea avea un număr al lui, fără să mai fie nevoie de „interioare” și centrale (adică de NAT).</Analogy>
      </Detailed>

      <Traps items={[
        <>IPv6 nu are <b>broadcast</b> și nici mască în format zecimal (255.255.…). Orice răspuns cu „IPv6 broadcast” sau „mască de subrețea IPv6” este greșit.</>,
        <>Adresa IPv6 se scrie în <b>hexazecimal</b>; literele A–F pot fi mari sau mici (aceeași adresă).</>,
      ]} />
      <InlineQuiz ids={['1.8-001', '1.8-002']} />
    </section>
  );
}

/* ======================================================================
   1. De ce IPv6
   ====================================================================== */
export function Why() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="1.8" title="De ce există IPv6 și ce schimbă" />
      <Summary>
        <p>IPv4 a rămas fără adrese libere: rezerva IANA s-a golit pe 3 februarie 2011, iar RIPE NCC (Europa, inclusiv România) a făcut ultima alocare din rezerva liberă pe 25 noiembrie 2019. NAT a amânat problema, dar nu a rezolvat-o.
          IPv6 oferă 2¹²⁸ ≈ 3,4 × 10³⁸ adrese, un antet mai simplu și configurare automată a hostilor.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Din istoria proiectului">
        <p>Problema epuizării era previzibilă încă din anii ’90 (cum ai văzut la 1.7). În ianuarie 1995, <b>RFC 1752</b> a recomandat adoptarea unui protocol numit în acel moment „IPng” (IP Next Generation), cu adrese de 128 de biți, ca bază pentru viitorul IP. Prima specificație a apărut în decembrie 1995 (RFC 1883), a fost înlocuită de RFC 2460 (1998), iar versiunea actuală este <b>RFC 8200</b> (STD 86, iulie 2017).</p>
        <Table head={['An', 'Eveniment']} rows={[
          ['1995', 'RFC 1752 alege direcția IPng; RFC 1883 — prima specificație IPv6'],
          ['1998', 'RFC 2460 înlocuiește RFC 1883'],
          ['2011', 'IANA își epuizează rezerva de adrese IPv4'],
          ['2017', 'RFC 8200 — IPv6 devine Internet Standard (STD 86)'],
          ['2019', 'RIPE NCC — ultima alocare IPv4 din rezerva liberă'],
        ]} />
        <h3>2. Ce aduce IPv6</h3>
        <ul>
          <li><b>Spațiu uriaș:</b> 128 de biți. Un singur LAN (/64) are 2⁶⁴ ≈ 1,8 × 10¹⁹ de adrese posibile — mai multe decât întreg Internetul IPv4 „la pătrat”.</li>
          <li><b>Conectivitate end-to-end restabilită:</b> fiecare dispozitiv poate avea o adresă globală; nu mai e nevoie de NAT. Protecția vine de la un firewall, nu de la traducerea adreselor.</li>
          <li><b>Antet simplificat:</b> dimensiune fixă (40 de octeți), fără checksum de antet, fără fragmentare în routere — procesare mai rapidă.</li>
          <li><b>Configurare automată:</b> un host își poate construi singur adresa (SLAAC) și își găsește gateway-ul din mesaje trimise de router.</li>
          <li><b>Ierarhie de adresare:</b> prefixe construite pentru agregare, deci tabele de rutare mai mici.</li>
        </ul>
        <Callout kind="tip" title="Cum coexistă cu IPv4">
          Tranziția durează decenii. Cea mai răspândită metodă este <G id="dual-stack" />: aceeași interfață are simultan o adresă IPv4 și una IPv6, iar hostul folosește ce este disponibil. Pe un router Cisco, comenzile IPv4 și IPv6 de pe aceeași interfață coexistă fără conflict.
        </Callout>
      </Detailed>

      <Traps items={[
        <>IPv4 = 32 de biți (≈4,3 miliarde). IPv6 = <b>128 de biți</b>.</>,
        <>NAT <b>nu</b> a rezolvat epuizarea; a amânat-o. IPv6 este soluția de fond.</>,
        <>IPv6 și IPv4 <b>nu sunt compatibile direct</b>: un host doar-IPv6 nu vorbește cu unul doar-IPv4 fără un mecanism de traducere sau dual stack.</>,
      ]} />
      <InlineQuiz ids={['1.8-003', '1.8-004', '1.8-005']} />
    </section>
  );
}

/* ======================================================================
   2. Antetul IPv6
   ====================================================================== */
export function Header() {
  return (
    <section id="header" className="section">
      <SectionHead id="header" code="1.8" title="Antetul IPv6 — mai simplu decât IPv4" />
      <Summary>
        <p>Antetul de bază IPv6 are <b>dimensiune fixă de 40 de octeți</b> și 8 câmpuri. Față de IPv4 dispar checksum-ul antetului, lungimea antetului, câmpurile de fragmentare și opțiunile (mutate în <i>extension headers</i>). TTL devine <b>Hop Limit</b>, iar Protocol devine <b>Next Header</b>.</p>
      </Summary>

      <Detailed title="Explicația detaliată — câmp cu câmp">
        <Figure caption="Interactiv: compară antetul IPv4 cu cel IPv6 și apasă pe un câmp ca să vezi ce face și cum se numește în cealaltă versiune.">
          <Ipv6HeaderDiagram />
        </Figure>
        <Table head={['IPv4', 'IPv6', 'Observație']} rows={[
          ['Version (4)', 'Version (6)', '4 biți'],
          ['ToS / DSCP + ECN', 'Traffic Class', '8 biți, același rol: calitatea serviciului (QoS)'],
          ['—', 'Flow Label', '20 de biți, câmp nou: marchează pachetele aceluiași flux'],
          ['Total Length', 'Payload Length', 'IPv6 numără doar ce urmează după cei 40 de octeți ai antetului de bază'],
          ['Protocol', 'Next Header', 'aceleași valori (6 = TCP, 17 = UDP) + tipuri de extension headers; 58 = ICMPv6'],
          ['TTL', 'Hop Limit', 'redenumit după ce face de fapt: scade cu 1 la fiecare router'],
          ['Header Checksum', 'eliminat', 'Ethernet (FCS) și TCP/UDP verifică deja erorile; routerele nu mai recalculează nimic la fiecare hop'],
          ['IHL, Options', 'eliminate → extension headers', 'dimensiune fixă = procesare mai rapidă în hardware'],
          ['Identification, Flags, Fragment Offset', 'eliminate → Fragment extension header', 'fragmentează doar hostul-sursă, nu routerele'],
          ['Source / Destination (32 b)', 'Source / Destination (128 b)', 'de 4 ori mai lungi'],
        ]} />
        <p>Verificare aritmetică: 4 + 8 + 20 + 16 + 8 + 8 = 64 de biți = 8 octeți, plus 2 × 16 octeți de adrese = <b>40 de octeți</b>. Antetul IPv4 are minimum 20 de octeți (și până la 60 cu opțiuni).</p>

        <h3>Ce s-a întâmplat cu fragmentarea?</h3>
        <p>În IPv4, un router care primea un pachet prea mare pentru următoarea legătură îl putea sparge în bucăți. În IPv6, <b>doar sursa fragmentează</b>, iar fiecare legătură trebuie să accepte cel puțin <b>1280 de octeți</b> (MTU minim). Un router care nu poate trimite un pachet prea mare îl aruncă și răspunde sursei cu un mesaj ICMPv6 „Packet Too Big”, ca hostul să micșoreze pachetele (<G id="mtu" />). Rezultatul: routerele muncesc mai puțin.</p>

        <h3>De ce checksum-ul a dispărut fără pierderi</h3>
        <p>Erorile de transmisie sunt deja prinse la nivelul 2 (FCS la Ethernet) și la nivelul 4 (checksum TCP/UDP). Recalcularea checksum-ului IPv4 la fiecare router (pentru că TTL se schimbă) era muncă în plus. În IPv6, checksum-ul UDP este <b>obligatoriu</b>, iar checksum-ul ICMPv6 include un „pseudo-antet” cu adresele.</p>
      </Detailed>

      <DeepDive title="Deep dive: extension headers">
        <p>Informațiile opționale nu mai stau în antetul de bază, ci în antete suplimentare înlănțuite prin câmpul <b>Next Header</b>: fiecare spune ce urmează după el (alt extension header sau protocolul de nivel 4). RFC 8200 definește, printre altele, <i>Hop-by-Hop Options</i>, <i>Routing</i>, <i>Fragment</i> și <i>Destination Options</i>; AH și ESP (IPsec) sunt specificate separat. Ordinea recomandată: IPv6 → Hop-by-Hop → Destination Options → Routing → Fragment → AH → ESP → Destination Options → protocol de nivel 4. Routerele intermediare procesează de regulă doar antetul de bază și, eventual, Hop-by-Hop, ceea ce menține viteza mare.</p>
      </DeepDive>

      <Traps items={[
        <>Antetul IPv6 are <b>40 de octeți fixi</b>; IPv4 are 20 până la 60.</>,
        <>IPv6 <b>nu</b> are Header Checksum, IHL sau câmpuri de fragmentare în antetul de bază.</>,
        <>TTL → <b>Hop Limit</b>; Protocol → <b>Next Header</b>; ToS → <b>Traffic Class</b>.</>,
        <>Routerele <b>nu fragmentează</b> pachete IPv6 în tranzit.</>,
      ]} />
      <InlineQuiz ids={['1.8-006', '1.8-007', '1.8-008']} />
    </section>
  );
}

/* ======================================================================
   3. Notația și abrevierea
   ====================================================================== */
export function Notation() {
  return (
    <section id="notation" className="section">
      <SectionHead id="notation" code="1.8" title="Cum se scrie și cum se scurtează o adresă IPv6" />
      <Summary>
        <p>128 de biți = <b>8 hextete</b> de câte 16 biți (4 cifre hexa), separate prin <code>:</code>. Două reguli de scurtare: <b>(1)</b> poți elimina zerourile de la <i>începutul</i> fiecărui hextet; <b>(2)</b> poți înlocui <b>o singură</b> secvență de hextete 0000 consecutive cu <code>::</code>. Dacă ai de ales, scurtezi secvența cea mai lungă.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Anatomia unei adrese">
        <Figure caption="Interactiv: o adresă IPv6 împărțită în 8 hextete, fiecare cu 4 cifre hexa (16 biți). Apasă pe un hextet.">
          <HextetAnatomy />
        </Figure>
        <p>O cifră hexazecimală reprezintă 4 biți (un <i>nibble</i>), 4 cifre = 16 biți = un hextet, 32 de cifre = 128 de biți. Cifrele sunt 0–9 și A–F. Exemplu complet: <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code>.</p>

        <h3>2. Regula 1 — zerourile de la început</h3>
        <p>Într-un hextet, poți elimina <b>doar zerourile din față</b>: <code>0db8</code> → <code>db8</code>, <code>0042</code> → <code>42</code>, <code>0000</code> → <code>0</code>. Zerourile de la <i>sfârșit</i> sau din mijloc se păstrează: <code>0100</code> devine <code>100</code> (niciodată <code>1</code>), iar <code>00a0</code> devine <code>a0</code>.</p>

        <h3>3. Regula 2 — „::”</h3>
        <p><code>::</code> înseamnă „unul sau mai multe hextete de zero consecutive”. Se poate folosi <b>o singură dată</b> într-o adresă, altfel nu s-ar mai ști câți zero ascunde fiecare. Exemplu: <code>2001:db8:0:0:0:ff00:42:8329</code> → <code>2001:db8::ff00:42:8329</code>.</p>
        <Table head={['Adresă completă', 'Forma scurtă (RFC 5952)', 'Ce arată']} rows={[
          [<code>2001:0db8:0000:0000:0000:ff00:0042:8329</code>, <code>2001:db8::ff00:42:8329</code>, 'ambele reguli'],
          [<code>2001:0db8:0000:0001:0000:0000:0000:0001</code>, <code>2001:db8:0:1::1</code>, 'se scurtează secvența cea mai lungă (3 zerouri, nu 1)'],
          [<code>2001:0db8:0000:0000:0001:0000:0000:0001</code>, <code>2001:db8::1:0:0:1</code>, 'secvențe egale: se scurtează prima'],
          [<code>2001:0db8:0000:0001:0001:0001:0001:0001</code>, <code>2001:db8:0:1:1:1:1:1</code>, 'un singur hextet 0 nu se scurtează cu ::'],
          [<code>fe80:0000:0000:0000:0000:0000:0000:0001</code>, <code>fe80::1</code>, 'adresă cu zerouri în mijloc'],
          [<code>2001:0db8:aaaa:0000:0000:0000:0000:0000</code>, <code>2001:db8:aaaa::</code>, ':: poate fi și la capăt'],
          [<code>0000:0000:0000:0000:0000:0000:0000:0001</code>, <code>::1</code>, 'loopback'],
          [<code>0000:0000:0000:0000:0000:0000:0000:0000</code>, <code>::</code>, 'adresa nespecificată'],
        ]} />
        <Figure caption="Antrenor interactiv: scurtează sau extinde adrese și primești feedback imediat.">
          <AbbrevTrainer />
        </Figure>

        <h3>4. Cum extinzi o adresă scurtă</h3>
        <p>Numără hextetele prezente, apoi calculează cât ascunde <code>::</code>: 8 − prezente. Exemplu: <code>2001:db8:a::b:c</code> are 5 hextete prezente, deci <code>::</code> ascunde 3 hextete de zero: <code>2001:0db8:000a:0000:0000:0000:000b:000c</code>. Pentru <code>fe80::1</code>: 2 prezente, deci 6 hextete de zero.</p>

        <h3>5. Adrese invalide frecvente</h3>
        <ul>
          <li><code>2001::db8::1</code> — două <code>::</code>: ambiguu.</li>
          <li><code>2001:db8:12345::1</code> — un hextet cu 5 cifre.</li>
          <li><code>2001:db8:g::1</code> — „g” nu este cifră hexa.</li>
          <li><code>2001:db8:0:0:0:0:0:0:1</code> — 9 hextete.</li>
        </ul>
        <Callout kind="info" title="Majuscule sau minuscule?">
          RFC 5952 recomandă litere mici (<code>2001:db8::1</code>), dar echipamentele Cisco afișează de obicei litere mari (<code>2001:DB8::1</code>). Este aceeași adresă; examenul nu penalizează diferența. Când adresa apare cu port, se scrie între paranteze drepte: <code>[2001:db8::1]:80</code>.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: forma canonică RFC 5952">
        <p>RFC 4291 permite mai multe scrieri ale aceleiași adrese și cere ca implementările să le <i>accepte</i> pe toate. RFC 5952 recomandă, pentru <i>generare</i>, o singură formă canonică: zerourile din față se elimină întotdeauna, literele sunt mici, <code>::</code> se folosește la capacitate maximă (cea mai lungă secvență) și <b>niciodată</b> pentru un singur hextet de zero. Pentru examenul CCNA, reține regula practică: „scurtează cât poți, o singură dată, secvența cea mai lungă”.</p>
        <p>Există și o notație mixtă, utilă pentru adrese IPv6 ce conțin un IPv4 în ultimii 32 de biți, de exemplu <code>::ffff:192.0.2.1</code> (adresă „IPv4-mapped”). O vei întâlni rar la CCNA.</p>
      </DeepDive>

      <Traps items={[
        <><code>::</code> apare <b>o singură dată</b>. Două <code>::</code> = adresă invalidă.</>,
        <>Se elimină doar zerourile <b>din față</b>: <code>0100</code> → <code>100</code>, nu <code>1</code>; <code>2001:db8:100::10</code> este corect pentru <code>…0100:0000:…:0010</code>.</>,
        <>Un singur hextet <code>0</code> nu se mai scurtează cu <code>::</code> în forma canonică (<code>2001:db8:0:1:1:1:1:1</code>).</>,
        <>Când ai două secvențe de zerouri, scurtezi <b>cea mai lungă</b>; la egalitate, <b>prima</b>.</>,
      ]} />
      <InlineQuiz ids={['1.8-009', '1.8-010', '1.8-011', '1.8-012']} />
    </section>
  );
}

/* ======================================================================
   4. Prefixul
   ====================================================================== */
export function Prefix() {
  return (
    <section id="prefix" className="section">
      <SectionHead id="prefix" code="1.8" title="Prefixul și Interface ID — unde se termină rețeaua" />
      <Summary>
        <p>În IPv6 nu există mască de subrețea scrisă ca <code>255.255.255.0</code>. Se folosește doar <b>lungimea prefixului</b> (<G id="prefix-length" />), de exemplu <code>/64</code>: primii 64 de biți identifică rețeaua, ultimii 64 sunt <b>Interface ID</b> — identificatorul hostului în acea rețea.
          Pe LAN-uri se folosește aproape întotdeauna <b>/64</b>.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Notația adresă/prefix">
        <p>Se scrie ca la CIDR: <code>adresă/lungime</code>. Exemplu: <code>2001:db8:acad:1::1/64</code> înseamnă: adresa este <code>2001:db8:acad:1::1</code>, iar primii 64 de biți (<code>2001:db8:acad:1</code>) formează prefixul rețelei, adică <code>2001:db8:acad:1::/64</code>. Restul — <code>::1</code> — este Interface ID.</p>
        <Figure caption="Interactiv: mută slider-ul și vezi cum se împarte adresa în prefix și Interface ID. Pe LAN-uri cursorul stă pe 64.">
          <PrefixVisualizer />
        </Figure>
        <h3>2. Structura tipică a unei adrese globale</h3>
        <Table head={['Parte', 'Lungime tipică', 'Rol', 'Exemplu']} hlCol={0} rows={[
          [<G id="global-routing-prefix" />, '48 de biți (alocat de ISP)', 'identifică organizația / site-ul în Internet', <code>2001:db8:acad</code>],
          [<G id="subnet-id" />, '16 biți (alocați de tine)', 'identifică subrețeaua din site', <code>0001</code>],
          [<G id="interface-id" />, '64 de biți', 'identifică interfața în subrețea', <code>0000:0000:0000:0001</code>],
        ]} />
        <p>Aceste trei părți sunt cele 8 hextete: 3 de prefix global + 1 de subnet + 4 de Interface ID.</p>

        <h3>3. De ce /64 peste tot?</h3>
        <ul>
          <li><b>SLAAC cere /64:</b> hostul își construiește adresa lipind un Interface ID de 64 de biți la prefixul primit; suma trebuie să fie 128 (RFC 4862). Cu un prefix mai lung sau mai scurt, autoconfigurarea nu funcționează.</li>
          <li><b>Nu mai economisim adrese:</b> o subrețea /64 are 2⁶⁴ adrese; nu mai are sens să „tăiem” LAN-urile după numărul de hosti, cum făceam în IPv4 cu VLSM.</li>
          <li><b>Simplitate:</b> toate LAN-urile arată la fel, iar planul de numerotare se reduce la a alege cifrele din Subnet ID.</li>
        </ul>
        <Callout kind="tip" title="Legături punct-la-punct">
          Pentru legături între două routere, RFC 6164 recomandă prefixe <b>/127</b> (evită anumite atacuri asupra cache-ului de vecini și bucle de redirecționare). La CCNA, laburile folosesc de regulă tot /64 pe legături; /127 este o practică bună, bună de știut.
        </Callout>

        <h3>4. Cum afli rețeaua unei adrese</h3>
        <p>Păstrezi primii <i>n</i> biți și pui zero în rest. Cu /64 este simplu: păstrezi primele 4 hextete. Atenție la <code>::</code> — poate ascunde chiar hextetul de Subnet ID. Exemplu: <code>2001:db8:acad::aaaa:1234/64</code> → expandat: <code>2001:db8:acad:0000:0000:0000:aaaa:1234</code> → rețeaua este <code>2001:db8:acad:0::/64</code>, adică <code>2001:db8:acad::/64</code>.</p>
      </Detailed>

      <Traps items={[
        <>IPv6 folosește <b>prefix-length</b>, nu mască zecimală. Nu există „adresă de broadcast” și nu se pierd adrese pentru „rețea” și „broadcast”.</>,
        <>Interface ID = ultimii 64 de biți (la LAN-uri /64); prefixul = primii 64. Rețeaua se află păstrând prefixul și punând zero în rest.</>,
        <>Un prefix de <b>/64</b> este standard pentru LAN-uri; SLAAC nu funcționează cu alte lungimi.</>,
      ]} />
      <InlineQuiz ids={['1.8-017', '1.8-018', '1.8-019', '1.8-020']} />
    </section>
  );
}

/* ======================================================================
   5. Alocare și subnetting
   ====================================================================== */
export function Subnetting() {
  return (
    <section id="subnetting" className="section">
      <SectionHead id="subnetting" code="1.8" title="Alocarea prefixelor și subnetting-ul în IPv6" />
      <Summary>
        <p>Prefixele se alocă ierarhic: <b>IANA → RIR → ISP/LIR → organizație (/48 sau /56) → /64 pe fiecare LAN</b>. Din 16 biți de Subnet ID (dintr-un /48) rezultă <b>65.536</b> de subrețele /64. Subnetting-ul IPv6 este mult mai simplu decât în IPv4: <b>numeri în hexazecimal</b> în hextetul de Subnet ID.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Ierarhia de alocare">
        <Figure caption="Lanțul de alocare, de la registrele regionale până la un LAN. Apasă pe un nivel.">
          <AllocationHierarchy />
        </Figure>
        <p>IANA alocă din blocul <code>2000::/3</code> — singurul din care distribuie în prezent adrese unicast globale. Recomandarea RIPE NCC (RIPE-690) este ca un client de tip business să primească un <b>/48</b>, iar un client rezidențial un <b>/56</b>; prefixele mai lungi de /56 sunt descurajate. Rezultatul: orice organizație își poate crea câte subrețele are nevoie.</p>
        <Table head={['Prefix primit', 'Biți liberi pentru subrețele (până la /64)', 'Număr de /64']} rows={[
          ['/48', '16', '65.536'],
          ['/56', '8', '256'],
          ['/60', '4', '16'],
          ['/64', '0', '1 (o singură rețea)'],
        ]} />

        <h3>2. Subnetting pas cu pas</h3>
        <p>Site-ul tău primește <code>2001:db8:acad::/48</code>. Primele trei hextete sunt fixe. Al patrulea este Subnet ID — acolo „numeri” subrețelele:</p>
        <ul>
          <li><code>2001:db8:acad:0::/64</code> (prima subrețea)</li>
          <li><code>2001:db8:acad:1::/64</code>, <code>2001:db8:acad:2::/64</code>, …, <code>2001:db8:acad:9::/64</code></li>
          <li>după <code>9</code> urmează <code>a</code> (zecimal 10): <code>2001:db8:acad:a::/64</code>, <code>…:b::</code>, … <code>…:f::</code></li>
          <li>apoi <code>…:10::/64</code> (zecimal 16), … până la <code>2001:db8:acad:ffff::/64</code> (a 65.536-a).</li>
        </ul>
        <Figure caption="Interactiv: alege prefixul site-ului și derulează prin subrețelele /64 — observă că numărătoarea este în hexazecimal.">
          <SubnetLister />
        </Figure>
        <Callout kind="exam" title="Capcana hexazecimală">
          Subnet ID <code>10</code> înseamnă 16 în zecimal, nu 10. Subrețeaua cu numărul zecimal 10 este <code>:a:</code>. De aceea mulți administratori „codifică” VLAN-ul ca hexazecimal: VLAN 10 → <code>2001:db8:acad:10::/64</code>. Nu este matematică, ci o convenție de lizibilitate.
        </Callout>

        <h3>3. Exemple rezolvate</h3>
        <Table head={['Cerință', 'Rezolvare']} rows={[
          [<>Din <code>2001:db8:acad::/48</code>, subrețeaua cu numărul 12 (zecimal)</>, <><code>12</code> zecimal = <code>c</code> hexa → <code>2001:db8:acad:c::/64</code></>],
          [<>Din <code>2001:db8:acad:4500::/56</code>, câte /64 pot crea?</>, <>64 − 56 = 8 biți → 2⁸ = <b>256</b> (de la <code>:4500:</code> la <code>:45ff:</code>)</>],
          [<>Câte /56 încap într-un /48?</>, <>2^(56−48) = <b>256</b></>],
          [<>Care este subrețeaua lui <code>2001:db8:acad:12:abcd::5/64</code>?</>, <><code>2001:db8:acad:12::/64</code></>],
          [<>Câte /48 încap într-un /32?</>, <>2^(48−32) = <b>65.536</b></>],
        ]} />
      </Detailed>

      <DeepDive title="Deep dive: prefixe care nu cad pe limita unei cifre hexa">
        <p>Dacă prefixul nu este multiplu de 4, o cifră hexa este „tăiată”. Exemplu: <code>2001:db8:acad:4::/62</code>. Un /62 fixează primii 62 de biți, deci în hextetul 4 (biții 49–64) ultimii 2 biți variază. Hextetul poate lua valorile <code>4, 5, 6, 7</code> (în binar, ultimii doi biți: 00, 01, 10, 11), deci prefixul acoperă patru subrețele /64: <code>:4::</code>, <code>:5::</code>, <code>:6::</code> și <code>:7::</code>. Prefixele pe limită de nibble (/48, /52, /56, /60, /64) sunt cele mai ușor de citit, motiv pentru care sunt preferate.</p>
      </DeepDive>

      <Traps items={[
        <>Subnet ID se numără în <b>hexazecimal</b>: după <code>9</code> vine <code>a</code>, nu <code>10</code>.</>,
        <>Dintr-un /48 ies <b>65.536</b> de /64; dintr-un /56, <b>256</b>.</>,
        <><code>::</code> poate ascunde chiar Subnet ID-ul: expandează adresa înainte să afli rețeaua.</>,
        <>Un LAN este <b>/64</b>, nu /48 și nu /120 — cu excepția legăturilor punct-la-punct (/127).</>,
      ]} />
      <InlineQuiz ids={['1.8-021', '1.8-022', '1.8-023', '1.8-024']} />
    </section>
  );
}

/* ======================================================================
   6. Cum își iau hostii adresa
   ====================================================================== */
export function HostConfig() {
  return (
    <section id="hosts" className="section">
      <SectionHead id="hosts" code="1.8" title="Cum își iau hostii adresa: static, SLAAC, DHCPv6" />
      <Summary>
        <p>Un host IPv6 poate primi adresa <b>manual</b> (static), prin <b>SLAAC</b> (își construiește singur adresa din prefixul anunțat de router) sau prin <b>DHCPv6</b>. Routerul își anunță prefixul prin mesaje <b>Router Advertisement (RA)</b>, iar <b>gateway-ul implicit</b> vine <b>întotdeauna</b> din RA, nu din DHCPv6.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Un nou protocol: NDP">
        <p>În IPv4, rezolvarea adresei MAC se face cu ARP și gateway-ul se configurează manual sau prin DHCP. În IPv6 aceste funcții sunt preluate de <G id="ndp" /> (Neighbor Discovery Protocol), care rulează peste <G id="icmpv6" />. Cele cinci mesaje NDP:</p>
        <Table head={['Mesaj', 'ICMPv6 tip', 'Rol']} rows={[
          ['Router Solicitation (RS)', '133', 'hostul întreabă „există vreun router?”'],
          ['Router Advertisement (RA)', '134', 'routerul anunță prefixul, flag-urile (M, O, A), durata de viață ca gateway'],
          ['Neighbor Solicitation (NS)', '135', 'echivalentul ARP request; și verificarea de duplicate (DAD)'],
          ['Neighbor Advertisement (NA)', '136', 'echivalentul ARP reply'],
          ['Redirect', '137', 'routerul spune hostului o cale mai bună'],
        ]} />

        <h3>2. SLAAC — Stateless Address Autoconfiguration</h3>
        <p>Cu <G id="slaac" />, hostul își construiește adresa fără server: ia prefixul din RA (cu bitul <b>A</b> activ) și adaugă un Interface ID generat local. Înainte de a folosi adresa, verifică prin <G id="dad" /> (Duplicate Address Detection) că nimeni altcineva nu o folosește. Routerul nu ține evidența adreselor — de aceea se numește „stateless”.</p>
        <Figure caption="Interactiv: pas cu pas, de la o interfață nou conectată la o adresă funcțională — RS, RA, DAD și rezolvarea MAC-ului gateway-ului.">
          <SlaacFlow />
        </Figure>
        <Callout kind="info" title="Despre Interface ID">
          Interface ID-ul poate fi derivat din adresa MAC (<b>Modified EUI-64</b>, cu bitul 7 inversat și <code>FFFE</code> inserat la mijloc) sau generat aleatoriu. Sistemele moderne (Windows, macOS, iOS, Android) folosesc implicit identificatori aleatori sau „temporari” (RFC 8981), din motive de confidențialitate; routerele Cisco folosesc EUI-64 pentru adresa link-local automată. Mecanismul EUI-64 îl detaliezi la <b>1.9.d</b>.
        </Callout>

        <h3>3. Trei metode de configurare a hostului</h3>
        <Figure caption="Interactiv: bifează flag-urile A, O și M din RA și vezi ce metodă rezultă.">
          <RaFlags />
        </Figure>
        <Table head={['Metodă', 'Flag-uri RA', 'Adresa vine de la', 'DNS / alte opțiuni', 'Stare pe server']} hlCol={0} rows={[
          ['SLAAC', 'A=1, M=0, O=0', 'prefix (RA) + Interface ID construit de host', 'din RA (opțiunea RDNSS), dacă routerul o trimite', 'nu există'],
          ['SLAAC + DHCPv6 stateless', 'A=1, O=1', 'SLAAC', 'DHCPv6', 'serverul nu ține lease-uri'],
          ['DHCPv6 stateful', 'M=1', 'serverul DHCPv6', 'DHCPv6', 'serverul ține evidența adreselor'],
        ]} />
        <p>Mesajul DHCPv6 al clientului este trimis la adresa multicast <code>FF02::1:2</code>. Detaliile DHCPv6 sunt la capitolul de servicii IP (obiectivul 4.x).</p>
        <Callout kind="exam" title="Regula de aur">
          <b>Gateway-ul implicit al unui host vine din RA</b> (adresa link-local a routerului), niciodată din DHCPv6. Dacă routerul nu trimite RA — de exemplu pentru că lipsește <code>ipv6 unicast-routing</code> — hostii SLAAC nu primesc nici prefix, nici gateway.
        </Callout>
      </Detailed>

      <Traps items={[
        <>Fără <code>ipv6 unicast-routing</code> pe router: nu se trimit RA, deci <b>SLAAC nu funcționează</b> și routerul nu rutează IPv6.</>,
        <>DHCPv6 <b>nu</b> oferă gateway implicit; acesta vine din RA.</>,
        <>RA: <b>A</b> = SLAAC, <b>O</b> = alte informații (DNS) din DHCPv6, <b>M</b> = adresa din DHCPv6.</>,
        <>NDP înlocuiește ARP (NS/NA) — IPv6 <b>nu</b> folosește ARP.</>,
      ]} />
      <InlineQuiz ids={['1.8-027', '1.8-028', '1.8-029', '1.8-030']} />
    </section>
  );
}
