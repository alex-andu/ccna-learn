import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { EspPacket, IkeStages, SplitTunnel, VpnTypes } from '../../diagrams/t5_5';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.5" title="VPN-uri IPsec — imaginea de ansamblu" />
      <Summary>
        <p>Un <G id="vpn" /> creează un „tunel” securizat peste o rețea nesigură (Internetul). Obiectivul 5.5 cere să <b>descrii</b> două scenarii: <b><G id="site-to-site-vpn" /></b> (două rețele legate prin gateway-uri, permanent și transparent pentru gazde) și <b><G id="remote-access-vpn" /></b> (un utilizator se conectează la rețeaua companiei cu un client software). Tehnologia de bază este <G id="ipsec" />: criptare, integritate, autentificare și protecție anti-replay pentru pachetele IP.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 5.5 este <i>Describe IPsec remote access and site-to-site VPNs</i> — tip <b>Describe</b>: contează concepte, componente și fluxul negocierii; configurarea este opțională la CCNA, dar o vedem ca ilustrare.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Ce problemă rezolvă un VPN și ce tipuri există?', 'De ce VPN și cele două scenarii'],
          ['Din ce e făcut IPsec?', 'Componentele IPsec: IKE, ESP, AH, SA'],
          ['Cum se ridică un tunel pas cu pas?', 'IKE faza 1 și faza 2'],
          ['Cum arată pachetul protejat?', 'Tunnel vs transport, ESP vs AH, NAT-T'],
          ['Cum diferă remote access de site-to-site?', 'Remote access: Secure Client, TLS, split tunnel'],
          ['Cum se configurează și se verifică?', 'Exemplu de configurare și verificare'],
        ]} />
        <Analogy>Imaginează-ți că trimiți un document între două birouri printr-un curier public. Fără VPN, curierul vede plicul și îl poate citi sau schimba. Cu VPN, pui documentul într-un <b>seif sigilat</b> (criptare + sigiliu de integritate) și îl închizi într-o <b>cutie cu adresa gateway-urilor</b> (încapsulare). Curierul vede doar cutia. La capăt, un portar autorizat o deschide și predă documentul.</Analogy>
      </Detailed>
      <Traps items={[
        <>IPsec nu e „un protocol”, ci o <b>suită</b>: IKE (negociere/chei) + ESP/AH (protecția datelor).</>,
        <>VPN-ul nu face rețeaua „sigură”: protejează traficul <b>în tranzit</b> între capete; nu oprește malware-ul de pe laptop.</>,
        <>Site-to-site nu are nevoie de software pe gazde; remote access da (sau browser, pentru variantele clientless).</>,
      ]} />
      <InlineQuiz ids={['5.5-001', '5.5-002']} />
    </section>
  );
}

/* ======================================================================
   1. De ce VPN și tipuri
   ====================================================================== */
export function TypesSection() {
  return (
    <section id="types" className="section">
      <SectionHead id="types" code="5.5" title="De ce avem nevoie de VPN și cele două scenarii" />
      <Summary>
        <p>Fără VPN, o companie ar trebui să închirieze linii private (leased line, MPLS) între sedii, scump. Un VPN folosește <b>Internetul public ieftin</b> și adaugă securitatea prin criptare. <b>Site-to-site</b> leagă rețele întregi; <b>remote access</b> leagă un utilizator.</p>
      </Summary>
      <Detailed title="1. Comparația">
        <Figure caption="Interactiv: alege tipul de VPN și vezi ce se întâmplă cu și fără tunel.">
          <VpnTypes />
        </Figure>
        <Table head={['', 'Site-to-site', 'Remote access']} hlCol={0} rows={[
          ['Cine sunt capetele', 'Două gateway-uri (router/firewall)', 'Un utilizator (client) și un gateway'],
          ['Software pe gazde', 'Nu — transparent', 'Da (Secure Client) sau browser (clientless)'],
          ['Durata', 'De obicei permanent', 'La cerere, pe durata sesiunii'],
          ['Tehnologii uzuale', 'IPsec (uneori GRE/VTI/DMVPN)', 'SSL/TLS (Secure Client) sau IPsec IKEv2'],
          ['Autentificare', 'PSK sau certificate între gateway-uri', 'Utilizator + parolă/MFA, certificate; prin AAA/RADIUS'],
          ['Exemplu', 'Filiala ↔ sediul central', 'Angajatul de acasă ↔ rețeaua companiei'],
        ]} />
      </Detailed>
      <Detailed title="2. Ce obții cu un VPN (obiective de securitate)">
        <ul>
          <li><b>Confidențialitate</b> — datele sunt criptate (ex. AES).</li>
          <li><b>Integritate</b> — o sumă de control criptografică (HMAC) detectează modificările.</li>
          <li><b>Autentificarea originii</b> — capetele se verifică reciproc (PSK sau certificate).</li>
          <li><b>Protecție anti-replay</b> — pachete reluate de un atacator sunt respinse (numere de secvență).</li>
        </ul>
        <p>Acestea sunt aceleași obiective CIA din 5.1, aplicate transportului de date.</p>
      </Detailed>
      <Traps items={[
        <>„VPN” nu înseamnă obligatoriu IPsec: și SSL/TLS este folosit mult (mai ales remote access).</>,
        <>Site-to-site conectează <b>rețele</b>, nu utilizatori individuali.</>,
        <>Un VPN nu ascunde că ai conexiune; ascunde conținutul și adresele interne.</>,
      ]} />
      <InlineQuiz ids={['5.5-003', '5.5-004', '5.5-005']} />
    </section>
  );
}

/* ======================================================================
   2. Componentele IPsec
   ====================================================================== */
export function ComponentsSection() {
  return (
    <section id="components" className="section">
      <SectionHead id="components" code="5.5" title="Componentele IPsec: IKE, ESP, AH, SA" />
      <Summary>
        <p>IPsec se compune din: <b><G id="ike" /></b> (negociază politici și chei; UDP 500, UDP 4500 cu NAT-T), <b><G id="esp" /></b> (criptare + integritate; protocol IP 50), <b><G id="ah" /></b> (doar integritate/autentificare; protocol IP 51) și <b><G id="security-association" /></b> (SA — acordul unidirecțional cu parametrii și cheile folosite).</p>
      </Summary>
      <Detailed title="1. Părțile suitei">
        <Table head={['Componentă', 'Rol', 'Transport / protocol']} hlCol={0} rows={[
          ['IKE (Internet Key Exchange)', 'Autentifică capetele, negociază algoritmii, derivă chei (Diffie-Hellman)', 'UDP 500; UDP 4500 când e NAT-T'],
          ['ESP (Encapsulating Security Payload)', 'Criptează și autentifică datele; oferă anti-replay', 'Protocol IP 50 (sau în UDP 4500 cu NAT-T)'],
          ['AH (Authentication Header)', 'Autentifică pachetul (inclusiv antetul IP); nu criptează', 'Protocol IP 51'],
          ['SA (Security Association)', 'Ce algoritmi, ce chei, ce durată; unidirecțională (câte una pe sens)', 'Identificată de SPI (Security Parameter Index)'],
        ]} />
      </Detailed>
      <Detailed title="2. Algoritmii negociați">
        <p>Capetele trebuie să se pună de acord pe un set de parametri, de obicei numit „politică” sau „propunere”:</p>
        <Table head={['Funcție', 'Exemple', 'Notă']} hlCol={0} rows={[
          ['Criptare', 'AES (128/192/256), AES-GCM; 3DES și DES sunt vechi/slabe', 'Preferă AES'],
          ['Integritate (hash/HMAC)', 'SHA-2 (SHA-256 …); SHA-1/MD5 sunt vechi', 'HMAC cu cheia derivată'],
          ['Schimb de chei', 'Diffie-Hellman: grupuri 14+ (MODP) sau ECDH (19, 20)', 'Grupurile mici (1, 2, 5) sunt considerate slabe'],
          ['Autentificare', 'PSK (cheie partajată) sau certificate (RSA/ECDSA)', 'Certificatele scalează mai bine'],
          ['Durată (lifetime)', 'Ore pentru IKE SA, mai scurt pentru IPsec SA', 'După expirare se refac cheile (rekey)'],
        ]} />
        <Callout kind="exam" title="De ținut minte">
          Cele două capete trebuie să aibă <b>politici compatibile</b>: aceiași algoritmi, grup DH, metodă de autentificare. Dacă nu, negocierea eșuează. Valorile exacte „la modă” se schimbă în timp; la CCNA contează înțelegerea rolului fiecărei funcții.
        </Callout>
      </Detailed>
      <Detailed title="3. Diffie-Hellman în câteva cuvinte">
        <p>Diffie-Hellman permite celor două capete să <b>obțină aceeași cheie secretă comună</b> comunicând pe un canal public, fără să o trimită vreodată. Un observator care vede schimbul nu poate calcula cheia. În IPsec, cheia rezultată servește la protejarea negocierii și la derivarea cheilor pentru date. Cu DH efemer se obține <b>perfect forward secrecy</b>: compromiterea unei chei viitoare nu dezvăluie traficul trecut.</p>
      </Detailed>
      <DeepDive title="SA și SPI">
        <p>O <b>SA</b> descrie un singur sens al traficului: pentru comunicare bidirecțională, există două SA IPsec (R1→R3 și R3→R1), fiecare cu propriul <b>SPI</b> (un număr de 32 de biți din antetul ESP/AH care ajută receptorul să găsească SA-ul potrivit). IKE SA (faza 1) este separată și protejează negocierea.</p>
      </DeepDive>
      <Traps items={[
        <>ESP = protocol IP <b>50</b>, AH = <b>51</b> (nu porturi TCP/UDP). Pe firewall trebuie permise protocolul 50, plus UDP 500 și UDP 4500.</>,
        <>AH nu criptează; ESP poate cripta <b>și</b> autentifica.</>,
        <>PSK = aceeași cheie pe ambele capete; certificate = fiecare capăt are cheia lui privată.</>,
      ]} />
      <InlineQuiz ids={['5.5-006', '5.5-007', '5.5-008', '5.5-009']} />
    </section>
  );
}

/* ======================================================================
   3. Negocierea (IKE) pas cu pas
   ====================================================================== */
export function FlowSection() {
  return (
    <section id="flow" className="section">
      <SectionHead id="flow" code="5.5" title="Cum se ridică un tunel site-to-site, pas cu pas" />
      <Summary>
        <p>Un tunel nu există până nu apare <b>trafic de interes</b>. Atunci R1 pornește <b>IKE faza 1</b> (canal sigur de management, ISAKMP/IKE SA), apoi <b>faza 2</b> (IPsec SA pentru date). Urmează transferul protejat și, periodic, <b>rekey</b>.</p>
      </Summary>
      <Detailed title="1. Etapele">
        <Figure caption="Interactiv: parcurge cele cinci etape ale unui VPN site-to-site.">
          <IkeStages />
        </Figure>
      </Detailed>
      <Detailed title="2. IKEv1 vs IKEv2">
        <Table head={['', 'IKEv1', 'IKEv2']} hlCol={0} rows={[
          ['Faza 1', 'Main Mode (6 mesaje) sau Aggressive Mode (3 mesaje)', 'IKE_SA_INIT + IKE_AUTH (4 mesaje în total, creează și primul child SA)'],
          ['Faza 2', 'Quick Mode (3 mesaje)', 'CREATE_CHILD_SA pentru SA-uri suplimentare/rekey'],
          ['Autentificare', 'PSK, certificate (nu EAP clasic)', 'PSK, certificate, EAP (potrivit remote access)'],
          ['NAT-T, DPD', 'Suport adăugat ulterior', 'Integrate nativ'],
          ['Starea', 'Încă întâlnit pe echipamente vechi', 'Recomandat în deployment-uri noi'],
        ]} />
        <p>Terminologie pe care o vei auzi: <b>faza 1</b> = IKE SA/ISAKMP SA; <b>faza 2</b> = IPsec SA (child SA în IKEv2). Examenul CCNA folosește mai ales termenii din IKEv1 (faza 1 / faza 2).</p>
      </Detailed>
      <Detailed title="3. Ce înseamnă „trafic de interes”">
        <p>Pe un router clasic cu <b>crypto map</b>, o listă de acces (ACL) definește ce trafic trebuie protejat: de exemplu <code>permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255</code>. Pachetele care se potrivesc declanșează tunelul și sunt criptate; restul trec normal. Cele două capete trebuie să aibă ACL-uri <b>oglindite</b> (ce e sursă la R1 e destinație la R3).</p>
        <Callout kind="warn" title="Ordinea NAT și VPN">
          Dacă routerul face și NAT, traficul VPN trebuie <b>exceptat</b> din NAT (să nu fie tradus); altfel nu se mai potrivește cu ACL-ul „de interes”. Aceeași idee apare la 4.1 (ordinea operațiilor).
        </Callout>
      </Detailed>
      <Traps items={[
        <>Prima ping poate pierde pachete: tunelul se ridică <b>după</b> primul pachet de interes.</>,
        <>Dacă faza 1 se termină cu succes și faza 2 nu, de obicei greșește propunerea IPsec sau ACL-ul „de interes” nu e oglindit.</>,
        <>Un tunel „sus” pe un singur sens (doar encaps, fără decaps) indică de obicei o problemă la celălalt capăt sau firewall care blochează ESP.</>,
      ]} />
      <InlineQuiz ids={['5.5-010', '5.5-011', '5.5-012']} />
    </section>
  );
}

/* ======================================================================
   4. Moduri, ESP/AH, NAT-T
   ====================================================================== */
export function ModesSection() {
  return (
    <section id="modes" className="section">
      <SectionHead id="modes" code="5.5" title="Tunnel mode vs transport mode, ESP vs AH, NAT-T" />
      <Summary>
        <p>În <G id="ipsec-tunnel-mode" /> pachetul IP original este încapsulat integral într-un pachet nou (adresele gateway-urilor) — modul folosit la site-to-site. În <b>transport mode</b> se păstrează antetul original și se protejează doar datele. <b>ESP</b> criptează și autentifică; <b>AH</b> doar autentifică, deci nu merge cu NAT. <b>NAT-T</b> încapsulează ESP în UDP 4500.</p>
      </Summary>
      <Detailed title="1. Cum arată pachetul">
        <Figure caption="Interactiv: alege modul și protocolul și vezi ce este criptat și ce este autentificat.">
          <EspPacket />
        </Figure>
      </Detailed>
      <Detailed title="2. Când se folosește fiecare">
        <Table head={['Element', 'Folosit pentru', 'Observație']} hlCol={0} rows={[
          ['Tunnel mode', 'Gateway ↔ gateway (site-to-site), clienți VPN', 'Ascunde adresele interne; antet IP nou'],
          ['Transport mode', 'Gazdă ↔ gazdă; GRE peste IPsec', 'Antetul IP original rămâne vizibil'],
          ['ESP', 'Aproape toate implementările actuale', 'Criptare + integritate (+ anti-replay)'],
          ['AH', 'Rar; doar integritate', 'Incompatibil cu NAT (antetul IP e autentificat)'],
        ]} />
      </Detailed>
      <Detailed title="3. NAT-T (NAT Traversal)">
        <p>ESP este protocol IP 50, fără porturi, deci NAT-ul „port” (PAT) nu îl poate traduce corect. Soluția: la negociere, capetele detectează un NAT pe cale și încapsulează ESP în <b>UDP 4500</b>, care trece prin NAT ca orice trafic UDP. De aceea, la un VPN către un laptop aflat în spatele unui router de acasă, vezi UDP 500 și 4500, nu ESP „gol”.</p>
      </Detailed>
      <Traps items={[
        <>Tunnel ≠ „tunel VPN” în general: „tunnel mode” e un mod IPsec, alături de transport.</>,
        <>AH și NAT nu merg împreună; ESP cu NAT-T merge.</>,
        <>ESP nu criptează antetul IP exterior (nou) în tunnel mode: acesta trebuie să rămână vizibil ca pachetul să poată fi rutat de Internet.</>,
      ]} />
      <InlineQuiz ids={['5.5-013', '5.5-014', '5.5-015']} />
    </section>
  );
}

/* ======================================================================
   5. Remote access
   ====================================================================== */
export function RemoteSection() {
  return (
    <section id="remote" className="section">
      <SectionHead id="remote" code="5.5" title="Remote access: client VPN, TLS vs IPsec, split tunnel" />
      <Summary>
        <p>La <G id="remote-access-vpn" /> un utilizator rulează un client (de exemplu <G id="secure-client" />, fostul AnyConnect) care se conectează la un gateway (firewall/router). Tunelul poate folosi <b>SSL/TLS</b> (de obicei TCP/UDP 443, trece prin aproape orice rețea) sau <b>IPsec IKEv2</b>. Clientul primește o adresă internă și politici de rutare (split vs full tunnel).</p>
      </Summary>
      <Detailed title="1. Cum decurge o conexiune">
        <ol>
          <li>Utilizatorul pornește clientul și alege gateway-ul.</li>
          <li>Gateway-ul se autentifică la client (<b>certificat de server</b>) — ca la HTTPS (5.4).</li>
          <li>Utilizatorul se autentifică: parolă + <b>MFA</b>, sau certificat de client; verificarea trece prin <b>AAA/RADIUS</b> (5.8).</li>
          <li>Se negociază criptarea; se creează tunelul.</li>
          <li>Gateway-ul atribuie clientului o <b>adresă internă</b> (dintr-un pool) și, opțional, DNS/rute.</li>
          <li>Traficul spre rețeaua companiei circulă prin tunel (în funcție de split/full).</li>
        </ol>
      </Detailed>
      <Detailed title="2. SSL/TLS VPN vs IPsec remote access">
        <Table head={['', 'SSL/TLS (Secure Client)', 'IPsec IKEv2']} hlCol={0} rows={[
          ['Porturi', 'TCP 443 (TLS) și UDP 443 (DTLS)', 'UDP 500 / 4500, ESP'],
          ['Trece prin firewall-uri', 'Foarte ușor (e „HTTPS”)', 'Uneori blocat (UDP 500/ESP)'],
          ['Client', 'Software (sau browser, în modul clientless)', 'Software sau client nativ al sistemului de operare'],
          ['Autentificare', 'Utilizator/parolă/MFA, certificate', 'Utilizator (EAP), certificate'],
          ['Folosire tipică', 'Angajați mobili, acces la aplicații', 'Integrare cu infrastructura IPsec existentă'],
        ]} />
        <p><b>Clientless SSL VPN</b>: acces prin browser la un portal (aplicații web, uneori transfer de fișiere) fără client instalat; limitat la ce expune portalul.</p>
      </Detailed>
      <Detailed title="3. Split tunnel vs full tunnel">
        <Figure caption="Interactiv: compară traficul clientului în cele două moduri.">
          <SplitTunnel />
        </Figure>
        <p>Alegerea este un compromis între <b>bandă și performanță</b> (split) și <b>control și vizibilitate de securitate</b> (full).</p>
      </Detailed>
      <Traps items={[
        <>La remote access, MFA se aplică la <b>autentificarea utilizatorului</b>, de obicei prin RADIUS/ISE, nu pe client singur.</>,
        <>Split tunnel înseamnă că traficul Internet al clientului nu mai trece prin protecțiile companiei.</>,
        <>SSL VPN este adesea numit „SSL” deși azi folosește TLS (SSL este depășit).</>,
      ]} />
      <InlineQuiz ids={['5.5-016', '5.5-017', '5.5-018']} />
    </section>
  );
}

/* ======================================================================
   6. GRE, VTI, DMVPN
   ====================================================================== */
export function RelatedSection() {
  return (
    <section id="related" className="section">
      <SectionHead id="related" code="5.5" title="Tehnologii înrudite: GRE, VTI, DMVPN (nivel de recunoaștere)" />
      <Summary>
        <p>IPsec singur (cu crypto map) protejează doar trafic <b>unicast IP</b> potrivit unui ACL; nu transportă multicast (deci nici hello-uri OSPF). <G id="gre" /> poate încapsula orice (inclusiv multicast), dar nu criptează. De aceea apar combinații: <b>GRE peste IPsec</b>, <b>VTI</b> (interfață de tunel IPsec) și <b>DMVPN</b> (hub-and-spoke dinamic).</p>
      </Summary>
      <Detailed title="1. Comparație">
        <Table head={['Tehnologie', 'Ce aduce', 'Limită']} hlCol={0} rows={[
          ['IPsec cu crypto map', 'Criptare pentru traficul din ACL', 'Fără multicast; fără protocoale de rutare prin tunel'],
          ['GRE (Generic Routing Encapsulation)', 'Încapsulează orice protocol, inclusiv multicast; permite OSPF/EIGRP prin tunel', 'Nu criptează, adaugă un antet'],
          ['GRE peste IPsec', 'GRE + criptare: rutare dinamică securizată', 'Overhead mai mare'],
          ['VTI (Virtual Tunnel Interface)', 'Tunel IPsec ca interfață rutabilă', 'Mai simplu decât crypto map'],
          ['DMVPN', 'Hub-and-spoke cu tuneluri spoke-spoke create la cerere (mGRE + NHRP + IPsec)', 'Concept avansat (CCNP); aici doar recunoaștere'],
        ]} />
        <Callout kind="info" title="Nivel CCNA">
          Pentru CCNA: știi că <b>GRE transportă multicast și protocoale de rutare, dar nu criptează</b>, iar IPsec criptează dar nu transportă multicast; combinația le oferă pe amândouă. DMVPN se recunoaște doar.
        </Callout>
      </Detailed>
      <Traps items={[
        <>GRE ≠ securitate: traficul GRE este în clar dacă nu e pus peste IPsec.</>,
        <>DMVPN nu este „un VPN nou” fundamental: este un mod de a organiza tuneluri mGRE/IPsec la scară.</>,
      ]} />
      <InlineQuiz ids={['5.5-019']} />
    </section>
  );
}
