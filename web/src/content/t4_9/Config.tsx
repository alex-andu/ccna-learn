import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.9" title="Exemple de comenzi și verificare (TFTP/FTP)" />
      <Summary>
        <p>Pe IOS nu configurezi un „server” TFTP/FTP, ci folosești clienții încorporați în <code>copy</code>. Exemplele: backup și restaurare de configurație prin TFTP, transfer cu FTP autentificat, upgrade de imagine IOS cu verificare MD5, apoi verificare cu <code>show flash:</code> și <code>show version</code>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; prompturile, numele de fișiere, dimensiunile și hash-urile sunt inventate și diferă între platforme și versiuni IOS/IOS XE/Packet Tracer.
      </Callout>

      <Detailed title="1. Backup și restaurare de configurație (TFTP)">
        <CodeBlock title="R1 — backup al configurației (ilustrativ)" kind="session" code={`R1# ping 192.168.1.10
R1# copy running-config tftp:
Address or name of remote host []? 192.168.1.10
Destination filename [r1-confg]? r1-backup.cfg
!!
1432 bytes copied in 0.760 secs (1884 bytes/sec)`} explain={[
          ['ping 192.168.1.10', 'Verifici conectivitatea către server înainte de transfer.'],
          ['copy running-config tftp:', 'Sursă: configurația activă; destinație: serverul TFTP.'],
          ['Address or name of remote host', 'Adresa serverului TFTP.'],
          ['Destination filename', 'Numele fișierului pe server (propunerea implicită vine din hostname).'],
          ['!!', 'Fiecare ! arată un bloc transferat cu succes.'],
        ]} />
        <CodeBlock title="R1 — restaurare (ilustrativ)" kind="session" code={`R1# copy tftp: startup-config
Address or name of remote host []? 192.168.1.10
Source filename []? r1-backup.cfg
Destination filename [startup-config]?
Accessing tftp://192.168.1.10/r1-backup.cfg...
Loading r1-backup.cfg from 192.168.1.10: !
[OK - 1432 bytes]
R1# reload`} explain={[
          ['copy tftp: startup-config', 'Înlocuiește startup-config cu fișierul de pe server.'],
          ['Source filename', 'Numele fișierului de pe server.'],
          ['[OK - 1432 bytes]', 'Fișierul a fost primit și scris.'],
          ['reload', 'La repornire, echipamentul folosește configurația restaurată (înlocuire completă).'],
        ]} />
        <Callout kind="tip" title="Dacă restaurezi direct în running-config">
          <code>copy tftp: running-config</code> îmbină liniile cu ce rulează deja (nu șterge liniile care lipsesc din fișier). Pentru o configurație identică cu backup-ul, folosește startup-config + reload.
        </Callout>
      </Detailed>

      <Detailed title="2. FTP cu autentificare">
        <CodeBlock title="R1 — FTP (ilustrativ)" kind="config" code={`R1(config)# ip ftp username backup
R1(config)# ip ftp password Str0ngFtpPass
R1(config)# ip ftp passive
R1(config)# end
R1# copy running-config ftp:
Address or name of remote host []? 192.168.1.10
Destination filename [r1-confg]? r1-ftp.cfg
Writing r1-ftp.cfg !
1432 bytes copied in 0.9 secs`} explain={[
          ['ip ftp username backup', 'Utilizatorul folosit de routerul client pentru autentificare la serverul FTP.'],
          ['ip ftp password …', 'Parola; se stochează în configurație (în clar, dacă nu e criptată cu service password-encryption).'],
          ['ip ftp passive', 'Folosește modul pasiv (clientul deschide conexiunea de date), util dacă există firewall/NAT.'],
          ['copy running-config ftp:', 'Transferul prin FTP; controlul pe TCP 21, datele pe o conexiune separată.'],
        ]} />
        <p>Variantă pe o singură linie: <code>copy running-config ftp://backup:Parola@192.168.1.10/r1.cfg</code>. Parola apare în URL și, posibil, în istoricul de comenzi sau în log-uri: evită-o în producție.</p>
      </Detailed>

      <Detailed title="3. Upgrade de imagine IOS">
        <CodeBlock title="R1 — upgrade (ilustrativ)" kind="session" code={`R1# dir flash:
Directory of flash:/
    1  -rw-    75551300  c2900-universalk9-mz.SPA.155-3.M4a.bin
64016384 bytes total (11200000 bytes free)
R1# copy tftp: flash:
Address or name of remote host []? 192.168.1.10
Source filename []? c2900-universalk9-mz.SPA.156-3.M6.bin
Destination filename [c2900-universalk9-mz.SPA.156-3.M6.bin]?
Loading c2900-universalk9-mz.SPA.156-3.M6.bin from 192.168.1.10: !!!!!!!!!!!!!!!!!!!!
[OK - 85000000 bytes]
R1# verify /md5 flash:c2900-universalk9-mz.SPA.156-3.M6.bin
..... Done!
verify /md5 (flash:c2900-universalk9-mz.SPA.156-3.M6.bin) = 0123456789abcdef0123456789abcdef
R1# configure terminal
R1(config)# boot system flash:c2900-universalk9-mz.SPA.156-3.M6.bin
R1(config)# end
R1# copy running-config startup-config
R1# reload`} explain={[
          ['dir flash:', 'Verifici spațiul liber și imaginile existente; imaginea nouă trebuie să încapă.'],
          ['copy tftp: flash:', 'Aduce imaginea nouă din server în flash.'],
          ['verify /md5 flash:…', 'Calculează MD5; îl compari cu valoarea publicată de producător.'],
          ['boot system flash:…', 'Indică imaginea de încărcat la următorul boot.'],
          ['copy running-config startup-config', 'Salvează setarea de boot.'],
          ['reload', 'Repornește; apoi confirmi cu show version.'],
        ]} />
        <Callout kind="warn" title="Spațiul liber">
          În exemplul de mai sus nu ar fi încăput o a doua imagine de ≈85 MB cu doar ≈11 MB liberi: ștergi mai întâi o imagine veche (<code>delete flash:…</code>) sau folosești un flash mai mare. Valorile sunt ilustrative.
        </Callout>
      </Detailed>

      <Detailed title="4. Verificare">
        <CodeBlock title="R1 — show version (fragment ilustrativ)" kind="session" code={`R1# show version
Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.6(3)M6
ROM: System Bootstrap
R1 uptime is 2 minutes
System image file is "flash:c2900-universalk9-mz.SPA.156-3.M6.bin"
Configuration register is 0x2102`} explain={[
          ['Version 15.6(3)M6', 'Versiunea de IOS care rulează acum.'],
          ['System image file is …', 'Fișierul din care a pornit routerul: confirmă că noul upgrade este activ.'],
          ['Configuration register is 0x2102', 'Registrul de configurare (valoarea 0x2102 este obișnuită; vezi documentația modelului).'],
        ]} />
        <Table head={['Comandă', 'Ce arată / face']} hlCol={0} rows={[
          [<code key="a">show flash:</code>, 'Fișierele din flash și spațiul liber'],
          [<code key="b">dir flash:</code>, 'La fel, cu dimensiuni'],
          [<code key="c">show version</code>, 'Versiunea IOS rulată și imaginea de boot'],
          [<code key="d">verify /md5 flash:&lt;fișier&gt;</code>, 'Hash MD5 pentru verificare'],
          [<code key="e">show running-config | include boot</code>, 'Setarea boot system din configurație'],
          [<code key="f">delete flash:&lt;fișier&gt;</code>, 'Șterge un fișier (eliberează spațiu)'],
        ]} />
        <Reveal label="Lista de verificare când „copy tftp: eșuează”">
          <ol>
            <li>Ping către server funcționează? Ruta/gateway-ul sunt corecte (server în altă subrețea → router cu gateway)?</li>
            <li>Serverul TFTP rulează și ascultă pe UDP 69? Directorul rădăcină conține fișierul, cu numele exact (inclusiv majuscule)?</li>
            <li>Un ACL sau firewall blochează UDP 69 sau porturile efemere de răspuns?</li>
            <li>Fișierul are permisiuni de citire pe server? Pentru scriere, serverul permite „create/overwrite”?</li>
            <li>Ai spațiu liber suficient în flash (<code>dir flash:</code>)?</li>
            <li>La FTP: utilizator/parolă corecte, mod pasiv dacă există NAT/firewall?</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <><code>copy tftp: running-config</code> îmbină, nu înlocuiește; pentru înlocuire completă folosește startup-config și <code>reload</code>.</>,
        <>Fișierul trebuie să existe pe server cu exact acel nume; unele servere TFTP cer ca fișierul să fie creat în prealabil pentru scriere.</>,
        <>Output-urile, hash-urile și dimensiunile sunt <b>ilustrative</b>.</>,
      ]} />
      <InlineQuiz ids={['4.9-020', '4.9-021']} />
    </section>
  );
}
