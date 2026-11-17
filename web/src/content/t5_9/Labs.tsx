import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology59, LabSoloTopology59 } from '../../diagrams/t5_9';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't59g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.9-G" title="Lab ghidat — comparăm modurile de securitate Wi-Fi" />
      <Summary>
        <p><b>Obiectiv:</b> pe un router wireless din Packet Tracer treci prin modurile de securitate (deschis, WEP, WPA2-PSK, WPA2-Enterprise) și observi ce condiții cere fiecare ca un laptop să se conecteze; apoi documentezi diferențele. <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router wireless de tip home/SOHO, 2 × laptop cu placă wireless) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: un router wireless și două laptopuri.">
        <LabGuidedTopology59 />
      </Figure>
      <Table head={['Element', 'Setare']} rows={[
        ['Router wireless', 'SSID „CCNA-LAB”; DHCP activ pe rețeaua 192.168.0.0/24'],
        ['Laptop-1', 'placă wireless (de exemplu WPC300N), DHCP'],
        ['Laptop-2', 'placă wireless, DHCP'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer">
        Router-ul wireless din PT oferă, în funcție de versiune, moduri precum WEP, WPA-PSK, WPA2-PSK și WPA2-Enterprise (cu server RADIUS); WPA3/SAE, OWE și PMF <b>nu</b> sunt emulate. Pașii exacți din meniuri diferă între versiuni; folosește ce este disponibil. Securitatea Wi-Fi nu se emulează în GNS3/CML (nu au radio). Nimic nu a fost testat de autorul lecției în PT.
      </Callout>

      <Detailed title="Partea 1 — Rețea deschisă">
        <Step labKey={L} n={1} title="Conectează un laptop fără securitate">
          <p>Setează pe router securitatea la „Disabled” (Wireless → Wireless Security). Conectează Laptop-1 la SSID. Ce ai nevoie? Ce ar putea vedea un atacator din raza semnalului?</p>
          <Reveal label="Răspuns">
            <p>Doar SSID-ul. Nu există autentificare și nici criptare: oricine se asociază și oricine ascultă vede traficul în clar. Este situația pe care WPA2/WPA3 și OWE o rezolvă.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — WEP vs WPA2-PSK">
        <Step labKey={L} n={2} title="WEP (doar demonstrativ)">
          <p>Activează WEP cu o cheie de 10 cifre hex. Conectează Laptop-1 cu aceeași cheie. Funcționează? Ce spune teoria despre WEP?</p>
          <Reveal label="Răspuns">
            <p>Se conectează, dar WEP este spart (RC4, IV de 24 de biți): în realitate, cheia se recuperează în minute. Se folosește aici doar ca să vezi cum arată, nu se mai recomandă niciodată.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="WPA2-PSK cu AES">
          <p>Setează WPA2 Personal, criptare AES, parolă de cel puțin 8 caractere. Conectează Laptop-1 cu parola corectă, apoi Laptop-2 cu o parolă greșită. Ce se întâmplă? Ce parametri trebuie să fie identici pe client și AP?</p>
          <Reveal label="Răspuns">
            <p>Laptop-1 se asociază și primește IP; Laptop-2 nu se poate autentifica (4-way handshake-ul eșuează la M2: MIC-ul nu se potrivește). Identice: SSID, tipul de securitate (WPA2-Personal), cifrul (AES/CCMP) și parola.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Nepotrivire de tip de securitate">
          <p>Lasă routerul pe WPA2-PSK, dar setează pe Laptop-2 WPA (TKIP) cu aceeași parolă. Se conectează? De ce?</p>
          <Reveal label="Răspuns">
            <p>Nu: clientul și AP-ul trebuie să negocieze o combinație comună (aceeași generație și cifru). O parolă corectă nu ajută dacă politica de securitate diferă.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Enterprise (dacă versiunea PT o permite)">
        <Step labKey={L} n={5} title="WPA2-Enterprise cu RADIUS">
          <p>Dacă ai un server RADIUS în topologie (Services → AAA), setează WPA2-Enterprise pe router cu adresa serverului și secretul partajat, creează un utilizator și conectează un laptop cu acel utilizator. Ce s-a schimbat față de PSK?</p>
          <Reveal label="Răspuns">
            <p>Nu mai există o parolă comună: fiecare utilizator are credențiale proprii, validate de serverul RADIUS (rolurile: supplicant = laptop, authenticator = AP/router, server = RADIUS). Dacă ștergi utilizatorul de pe server, doar el pierde accesul.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Tabel recapitulativ">
          <p>Completează în caiet un tabel cu patru coloane (Open, WEP, WPA2-Personal, WPA2-Enterprise) și rândurile: autentificare, cifru, ce ai nevoie la client, cine poate fi revocat individual, verdict.</p>
          <Reveal label="Răspuns de verificare">
            <p>Open: fără/fără/SSID/nu/nesigur. WEP: cheie statică/RC4/cheie/nu/spart. WPA2-Personal: PSK/AES-CCMP/parolă/nu (parola e comună)/acceptabil cu parolă lungă. WPA2-Enterprise: 802.1X EAP/AES-CCMP/credențiale sau certificat/da/recomandat în companii.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't59s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.9-S" title="Lab solo — nu se conectează clientul" />
      <Summary>
        <p><b>Scenariu:</b> AP-ul „CORP” folosește WPA2-Personal cu AES și parola <code>Fraza-Lunga-2026</code>. Primești patru laptopuri cu configurații diferite; trebuie să spui, <b>fără să încerci în PT</b>, care se conectează și care nu, și de ce. Apoi verifici în Packet Tracer ce poți. <br /><b>Timp estimat:</b> 25–35 min · <b>Unealtă:</b> analiză, apoi PT · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: AP-ul legitim, două laptopuri și un AP necunoscut în apropiere.">
        <LabSoloTopology59 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: fiecare laptop primește un verdict motivat (conectat / nu / conectat la altă rețea) și o recomandare. Securitatea Wi-Fi nu se emulează în GNS3/CML; Packet Tracer nu emulează WPA3.
      </Callout>
      <Detailed title="Partea 1 — Cele patru laptopuri">
        <Step labKey={L} n={1} title="Analizează">
          <Table head={['Laptop', 'SSID', 'Securitate', 'Parolă', 'Verdict?']} rows={[
            ['A', 'CORP', 'WPA2-Personal, AES', 'Fraza-Lunga-2026', '?'],
            ['B', 'CORP', 'WPA2-Personal, AES', 'fraza-lunga-2026', '?'],
            ['C', 'CORP', 'WPA (TKIP)', 'Fraza-Lunga-2026', '?'],
            ['D', 'CORP', 'WPA3-Personal (SAE)', 'Fraza-Lunga-2026', '? (AP-ul este doar WPA2)']
          ]} />
          <Reveal label="Soluție">
            <ol>
              <li><b>A</b>: se conectează — SSID, securitate, cifru și parolă coincid.</li>
              <li><b>B</b>: nu se conectează — parolele sunt sensibile la litere mari/mici; MIC-ul din 4-way handshake nu se potrivește.</li>
              <li><b>C</b>: nu se conectează — politica clientului (WPA/TKIP) nu corespunde AP-ului (WPA2/AES). Chiar dacă s-ar conecta printr-un „mixed mode”, TKIP este depreciat și slăbește rețeaua.</li>
              <li><b>D</b>: nu se conectează în mod WPA3-only — AP-ul nu oferă SAE. Soluții: migrare AP la WPA3, sau transition mode (WPA2 + WPA3 pe același SSID), sau client în WPA2.</li>
            </ol>
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — AP-ul necunoscut">
        <Step labKey={L} n={2} title="Evil twin sau rogue?">
          <p>Un AP cu SSID „CORP” apare pe alt canal, fără să fi fost instalat de tine, iar un laptop se conectează la el fără parolă (rețea deschisă). Ce poate fi? Ce arată că e problemă? Cum te aperi?</p>
          <Reveal label="Răspuns">
            <p>Este un <b>evil twin</b> (același SSID, controlat de altcineva) sau, dacă este conectat la LAN-ul tău, un <b>rogue AP</b>. Indiciu: rețeaua legitimă cere parolă, aceasta nu; BSSID/MAC diferit. Apărare: WPA2/WPA3-Enterprise cu validarea certificatului serverului, WIPS/detecție rogue pe WLC, 802.1X sau port security pe porturile de acces, educația utilizatorilor („nu te conecta la rețele cu același nume fără parolă”).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Recomandare">
          <p>Scrie în 5 rânduri ce ai schimba pe AP ca să îmbunătățești securitatea (cifru, mod, parolă, PMF, separare oaspeți).</p>
          <Reveal label="Exemplu de răspuns">
            <p>(1) Doar AES, fără TKIP. (2) WPA3-Personal sau transition mode temporar, apoi doar WPA3. (3) PMF „Optional” acum, „Required” la WPA3. (4) Parolă lungă și unică, rotită. (5) SSID separat pentru oaspeți/IoT, pe VLAN separat. Pentru mai mulți utilizatori: trecerea la Enterprise.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
