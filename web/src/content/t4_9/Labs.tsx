import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology49, LabSoloTopology49 } from '../../diagrams/t4_9';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't49g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.9-G" title="Lab ghidat — backup/restaurare prin TFTP și transfer FTP" />
      <Summary>
        <p><b>Obiectiv:</b> salvezi configurația unui router pe un server TFTP, o restaurezi, apoi folosești FTP cu autentificare și vezi diferența dintre cele două în comenzi și în pachetele capturate. <br /><b>Timp estimat:</b> 40–60 min · <b>Unealtă:</b> Cisco Packet Tracer (1 router, 1 switch, 1 Server cu serviciile TFTP și FTP) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: R1 – SW1 – Server TFTP/FTP.">
        <LabGuidedTopology49 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '192.168.1.1/24'],
        ['Server TFTP/FTP', 'NIC', '192.168.1.10/24, gateway 192.168.1.1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Obiectul Server din Packet Tracer are servicii TFTP și FTP (tab Services), cu fișiere vizibile în listă; poate lista și imaginile IOS ale routerelor. Formatul exact al întrebărilor din <code>copy</code> și al mesajelor poate diferi, iar upgrade-ul real de IOS nu se testează de obicei în PT. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta. Același lab merge în GNS3/CML cu IOSv și un server tftpd/vsftpd.
      </Callout>

      <Detailed title="Partea 0 — Pregătire">
        <Step labKey={L} n={1} title="Adresare și serviciu">
          <p>Configurează Gi0/0 pe R1 și adresa serverului (cu gateway); pornește serviciul TFTP pe server (Services → TFTP: On). Ping R1 → server.</p>
        </Step>
        <Step labKey={L} n={2} title="O configurație de salvat">
          <p>Pe R1 setează <code>hostname R1</code> și un banner, apoi <code>copy running-config startup-config</code>. De ce salvăm și în NVRAM înainte de backup?</p>
          <Reveal label="Răspuns">
            <p>Backup-ul din <code>running-config</code> conține configurația activă; dacă vrei și o copie coerentă a celei persistente, salvezi mai întâi în startup. Diferența dintre RAM și NVRAM este esențială: la reload, running-config nesalvată se pierde.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — TFTP">
        <Step labKey={L} n={3} title="Backup">
          <CodeBlock title="R1" kind="session" code={`R1# copy running-config tftp:
Address or name of remote host []? 192.168.1.10
Destination filename [R1-confg]? r1-backup.cfg`} explain={[
            ['copy running-config tftp:', 'Trimite configurația activă la server.'],
            ['r1-backup.cfg', 'Numele fișierului pe server.'],
          ]} />
          <p>Verifică pe server (Services → TFTP → lista de fișiere). Ce vezi? Ce protocol de transport s-a folosit?</p>
          <Reveal label="Răspuns">
            <p>Fișierul <code>r1-backup.cfg</code> apare în listă. Transport: UDP, cerere la portul 69 (poți confirma în Simulation Mode, filtrând TFTP).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Modifică și restaurează">
          <p>Schimbă hostname-ul în <code>TEST</code> și apoi restaurează cu <code>copy tftp: running-config</code>. Ce hostname are acum routerul? Ce s-ar fi întâmplat la <code>copy tftp: startup-config</code> + <code>reload</code>?</p>
          <Reveal label="Răspuns">
            <p>După îmbinarea în running-config, hostname-ul revine la <code>R1</code> (linia <code>hostname R1</code> din fișier se aplică). Cu startup-config + reload, configurația se înlocuiește integral cu cea din fișier. Diferența: running-config se <b>îmbină</b>, startup-config se <b>înlocuiește</b>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Observă pachetele">
          <p>În Simulation Mode, filtrează TFTP și rulează din nou un backup. Observă RRQ/WRQ, DATA și ACK. Câte blocuri vezi pentru un fișier mic? Ce port folosește serverul pentru date?</p>
          <Reveal label="Răspuns">
            <p>Pentru un fișier sub 512 octeți: un singur bloc DATA (mai mic de 512 B, deci ultimul), urmat de ACK. Serverul răspunde de pe un port efemer, nu de pe 69.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — FTP">
        <Step labKey={L} n={6} title="Serviciul FTP cu utilizator">
          <p>Pe server pornește serviciul FTP, creează utilizatorul <code>backup</code> cu parola și permisiuni de scriere. Pe R1:</p>
          <CodeBlock title="R1" kind="config" code={`R1(config)# ip ftp username backup
R1(config)# ip ftp password Str0ngFtpPass
R1(config)# end
R1# copy running-config ftp:`} explain={[
            ['ip ftp username/password', 'Credențialele clientului FTP al routerului.'],
            ['copy running-config ftp:', 'Transfer prin FTP, cu autentificare.'],
          ]} />
          <p>Ce se întâmplă dacă pui o parolă greșită? Ce diferență vezi față de TFTP?</p>
          <Reveal label="Răspuns">
            <p>Transferul este refuzat la autentificare (eroare de login). TFTP nu are autentificare deloc; FTP verifică utilizatorul și parola (trimise însă în text clar).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce nu folosim TFTP pe Internet? (2) Ce alternativă securizată propui pentru backup? (3) De ce are FTP două conexiuni?</p>
          <Reveal label="Indicii">
            <p>(1) Fără autentificare/criptare. (2) SCP/SFTP peste SSH. (3) Control separat de date; complică NAT/firewall.</p>
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
  const L = 't49s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.9-S" title="Lab solo — backup-ul prin TFTP eșuează" />
      <Summary>
        <p><b>Scenariu:</b> R1 trebuie să salveze configurația pe serverul TFTP 192.168.2.10, dar <code>copy running-config tftp:</code> expiră (timeout). Găsește defectul (sau defectele) cu <code>show</code> și <code>ping</code>.
          <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: R1, SW1, server TFTP.">
        <LabSoloTopology49 />
      </Figure>
      <Table head={['Dispozitiv', 'IPv4']} rows={[
        ['R1 Gi0/0', '192.168.1.1/24'],
        ['R1 Gi0/1 (spre server)', '192.168.2.1/24'],
        ['Server TFTP', '192.168.2.10/24, gateway 192.168.2.1'],
      ]} />
      <Callout kind="info" title="Cerințe">
        Backup al configurației prin TFTP, fișier <code>r1-backup.cfg</code>. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Configurare corectă">
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip address 192.168.2.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end
R1# ping 192.168.2.10
R1# copy running-config tftp:
Address or name of remote host []? 192.168.2.10
Destination filename [R1-confg]? r1-backup.cfg`} explain={[
              ['ping 192.168.2.10', 'Conectivitatea trebuie dovedită înainte de transfer.'],
              ['copy running-config tftp:', 'Sursă/destinație corecte; adresa corectă a serverului.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={2} title="Primul defect">
          <p>Ping-ul către 192.168.2.10 nu răspunde. <code>show ip interface brief</code> arată Gi0/1 „administratively down”. Ce faci?</p>
          <Reveal label="Cauza și remedierea">
            <p>Interfața dinspre server este oprită: <code>interface g0/1</code> → <code>no shutdown</code>. Fără link activ, niciun transfer nu poate începe.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Al doilea defect">
          <p>Interfața este up, ping-ul merge de pe R1, dar copy tot expiră. Serverul răspunde la ping. Ce verifici pe server?</p>
          <Reveal label="Cauza și remedierea">
            <p>Serviciul TFTP este oprit pe server (Services → TFTP: Off) sau adresa introdusă la „remote host” este greșită (de exemplu 192.168.1.10). Ping merge pentru că ICMP nu depinde de serviciul TFTP; transferul cere ca UDP 69 să fie deschis. Pornește serviciul și introdu adresa corectă.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Refă backup-ul. Cum confirmi că fișierul există pe server? Cum ai verifica ulterior integritatea unei <i>imagini IOS</i> copiate?</p>
          <Reveal label="Răspuns">
            <p>Fișierul <code>r1-backup.cfg</code> apare în lista serverului. Pentru imagini IOS: <code>verify /md5 flash:&lt;imagine&gt;</code> și comparație cu hash-ul publicat de Cisco.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
