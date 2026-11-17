import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.8" title="Exemple de configurare și verificare (SSH)" />
      <Summary>
        <p>Configurația completă pentru SSH pe un router: hostname, domeniu, chei RSA, utilizator, VTY cu <code>login local</code> și <code>transport input ssh</code>, apoi restricționarea sursei. Verifici cu <code>show ip ssh</code>, <code>show ssh</code> și o conectare de test.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; textele (de exemplu mesajele la generarea cheilor), versiunea SSH și opțiunile disponibile variază între IOS, IOS XE și Packet Tracer.
      </Callout>

      <Detailed title="1. R1 — activarea SSH">
        <CodeBlock title="R1 — SSH (ilustrativ)" kind="config" code={`Router(config)# hostname R1
R1(config)# ip domain-name example.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2
R1(config)# username admin privilege 15 secret Str0ngPass!
R1(config)# enable secret En4bleSecret!
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255
R1(config)# line vty 0 15
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config-line)# access-class 10 in
R1(config-line)# exec-timeout 5 0
R1(config-line)# end`} explain={[
          ['hostname R1', 'Nume diferit de „Router”: obligatoriu pentru generarea cheii.'],
          ['ip domain-name example.local', 'Domeniul; cu hostname formează R1.example.local.'],
          ['crypto key generate rsa modulus 2048', 'Generează perechea de chei RSA (2048 biți); pornește serverul SSH.'],
          ['ip ssh version 2', 'Doar SSHv2.'],
          ['username admin privilege 15 secret …', 'Utilizator local cu privilegii maxime; parola este stocată cu hash.'],
          ['access-list 10 permit 192.168.1.0 0.0.0.255', 'ACL standard: doar LAN-ul de administrare.'],
          ['login local', 'VTY folosește baza de utilizatori locală.'],
          ['transport input ssh', 'Acceptă doar SSH; Telnet este respins.'],
          ['access-class 10 in', 'ACL-ul 10 se aplică pe conexiunile VTY primite (nu pe interfețe).'],
          ['exec-timeout 5 0', 'Închide sesiunea după 5 minute de inactivitate.'],
        ]} />
        <Callout kind="tip" title="Primul mesaj la generarea cheii">
          IOS răspunde cu un mesaj de tipul „The name for the keys will be: R1.example.local … Generating … [OK]” și, după pornire, un log <code>%SSH-5-ENABLED: SSH 2.0 has been enabled</code> (text ilustrativ). Dacă lipsește domeniul sau hostname-ul rămâne „Router”, comanda este refuzată cu un mesaj care cere definirea lor.
        </Callout>
      </Detailed>

      <Detailed title="2. SW2 — SSH pe un switch (cu SVI de management)">
        <CodeBlock title="SW2 — SSH (ilustrativ)" kind="config" code={`Switch(config)# hostname SW2
SW2(config)# ip domain-name example.local
SW2(config)# crypto key generate rsa modulus 2048
SW2(config)# ip ssh version 2
SW2(config)# username admin privilege 15 secret Str0ngPass!
SW2(config)# interface vlan 1
SW2(config-if)# ip address 192.168.2.2 255.255.255.0
SW2(config-if)# no shutdown
SW2(config-if)# exit
SW2(config)# ip default-gateway 192.168.2.1
SW2(config)# line vty 0 15
SW2(config-line)# login local
SW2(config-line)# transport input ssh`} explain={[
          ['interface vlan 1 + ip address', 'SVI-ul de management: adresa la care ne conectăm.'],
          ['ip default-gateway 192.168.2.1', 'Gateway pentru clienții din alte subrețele (switch L2).'],
          ['line vty 0 15 …', 'Același tipar ca pe router.'],
        ]} />
      </Detailed>

      <Detailed title="3. Verificare">
        <CodeBlock title="R1 — verificare (ilustrativ)" kind="session" code={`R1# show ip ssh
SSH Enabled - version 2.0
Authentication timeout: 120 secs; Authentication retries: 3
Minimum expected Diffie Hellman key size : 1024 bits

R1# show ssh
Connection Version Mode Encryption  Hmac         State              Username
0          2.0     IN   aes256-cbc  hmac-sha1    Session started    admin

R1# show crypto key mypubkey rsa
% Key pair was generated at: 10:15:21 UTC Nov 16 2026
Key name: R1.example.local
Key type: RSA KEYS
 Storage Device: not specified
 Usage: General Purpose Key
 Key is not exportable.`} explain={[
          ['SSH Enabled - version 2.0', 'Serverul SSH rulează, doar v2 (efectul lui ip ssh version 2).'],
          ['Authentication retries: 3', 'Numărul maxim de încercări de autentificare.'],
          ['show ssh', 'Sesiunile SSH active: versiune, criptare, utilizator.'],
          ['Key name: R1.example.local', 'Numele cheii: hostname.domeniu.'],
        ]} />
        <CodeBlock title="PC administrator — conectarea (ilustrativ)" kind="session" code={`C:\\> ssh admin@192.168.1.1
The authenticity of host '192.168.1.1' can't be established.
RSA key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no)? yes
admin@192.168.1.1's password:

R1#`} explain={[
          ['The authenticity of host … can\'t be established', 'Prima conectare: clientul nu cunoaște cheia serverului și cere confirmare.'],
          ['fingerprint', 'Amprenta cheii publice a routerului; se compară cu cea așteptată.'],
          ['password', 'Parola utilizatorului local, trimisă prin canalul criptat.'],
        ]} />
        <Table head={['Comandă', 'Ce arată / ce face']} hlCol={0} rows={[
          [<code key="a">show ip ssh</code>, 'Versiunea, timeout-uri, retries; „SSH Disabled” dacă nu există chei'],
          [<code key="b">show ssh</code>, 'Sesiunile SSH active'],
          [<code key="c">show users</code>, 'Utilizatorii conectați (console/vty)'],
          [<code key="d">show crypto key mypubkey rsa</code>, 'Cheile RSA generate'],
          [<code key="e">crypto key zeroize rsa</code>, 'Șterge cheile (dezactivează SSH)'],
          [<code key="f">show running-config | section line vty</code>, 'Configurația VTY'],
        ]} />
        <Reveal label="Lista de verificare când „SSH este refuzat”">
          <ol>
            <li>Ping către echipament funcționează? Adresa și gateway-ul sunt corecte (pe switch: SVI up/up și <code>ip default-gateway</code>)?</li>
            <li><code>show ip ssh</code>: „SSH Enabled”? Dacă nu, generează cheile (hostname ≠ Router, domain-name setat).</li>
            <li><code>show running-config | section line vty</code>: <code>transport input ssh</code> (sau include ssh), <code>login local</code>?</li>
            <li>Utilizatorul există (<code>username … secret …</code>) și parola e corectă?</li>
            <li><code>access-class</code> permite adresa ta sursă? ACL-ul nu blochează de pe alt LAN?</li>
            <li>Toate cele 5 linii VTY nu sunt ocupate (<code>show users</code>)?</li>
            <li>Un ACL pe o interfață din drum blochează TCP 22?</li>
            <li>Clientul și serverul au algoritmi comuni (mesaje „no matching … found”)?</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>După <code>crypto key generate rsa</code> verifică mereu <code>show ip ssh</code>: dacă scrie „Disabled”, SSH nu merge.</>,
        <><code>access-class</code> se aplică pe <code>line vty</code>, nu pe interfață.</>,
        <>Output-urile sunt <b>ilustrative</b>; textele și valorile reale diferă.</>,
      ]} />
      <InlineQuiz ids={['4.8-020', '4.8-021']} />
    </section>
  );
}
