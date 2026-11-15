import { useState, type ReactNode } from 'react';
import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { LabGuidedTopology, LabSoloTopology } from '../../diagrams/wlan';

const P = ({ children }: { children: ReactNode }) => <span className="pt-path">{children}</span>;

function Step({ n, title, children, labKey }: { n: number; title: string; children: ReactNode; labKey: string }) {
  const k = `lab:${labKey}:${n}`;
  const [done, setDone] = useState(() => { try { return localStorage.getItem(k) === '1'; } catch { return false; } });
  const toggle = (v: boolean) => { setDone(v); try { localStorage.setItem(k, v ? '1' : '0'); } catch { /* ignoră */ } };
  return (
    <div className={`lab-step ${done ? 'done' : ''}`}>
      <div className="sn">{done ? '✓' : n}</div>
      <div>
        <h4>{title}</h4>
        {children}
        <label className="check no-print" style={{ marginTop: 8 }}><input type="checkbox" checked={done} onChange={(e) => toggle(e.target.checked)} />pas realizat</label>
      </div>
    </div>
  );
}

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 'g1';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.11-G" title="Lab ghidat — primul WLAN securizat (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> construiești un WLAN cu SSID <code>CCNA-LAB</code>, pe canalul 6, cu securitate <b>WPA2-Personal (AES)</b>, și conectezi un laptop și un smartphone. Pe parcurs observi ce înseamnă concret SSID, canal, PSK și criptare.
          <br /><b>Timp estimat:</b> 25–35 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat.">
        <LabGuidedTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Note']} rows={[
        ['WRT300N (Wireless Router)', 'LAN', '192.168.0.1/24', 'DHCP activ: 192.168.0.100–149'],
        ['PC0', 'FastEthernet0', 'DHCP', 'cablu direct (straight-through) în portul Ethernet 1'],
        ['Laptop0', 'Wireless0 (WPC300N)', 'DHCP', 'placă wireless 2.4 GHz'],
        ['Smartphone0', 'Wireless0', 'DHCP', 'are radio wireless integrat'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer și ce nu">
        Packet Tracer modelează corect asocierea, SSID-ul, securitatea și adresarea. <b>Nu</b> modelează interferența dintre canale, puterea în dBm sau RSSI-ul real — pentru acestea folosește diagramele interactive din lecție și comenzile de pe un laptop real (<code>netsh wlan show interfaces</code>).
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Plasează dispozitivele">
          <p>Din bara de jos: <P>Network Devices → Wireless Devices → WRT300N</P>. Apoi <P>End Devices</P>: un <b>PC</b>, un <b>Laptop</b> și un <b>Smartphone</b>. Redenumește-le ca în topologie (click pe dispozitiv → tab <P>Config</P> → Display Name).</p>
        </Step>
        <Step labKey={L} n={2} title="Conectează PC0 prin cablu">
          <p><P>Connections</P> → <b>Copper Straight-Through</b> → PC0 <code>FastEthernet0</code> → WRT300N <code>Ethernet 1</code>. Pe PC0: <P>Desktop → IP Configuration → DHCP</P>. Trebuie să primească o adresă <code>192.168.0.10x</code>.</p>
          <Reveal label="Ce ar trebui să vezi?"><p>IP 192.168.0.100 (sau următoarea liberă), mască 255.255.255.0, gateway 192.168.0.1. Dacă apare 169.254.x.x (APIPA), legătura nu e încă activă — așteaptă câteva secunde sau verifică portul.</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Deschide interfața web a routerului">
          <p>Pe PC0: <P>Desktop → Web Browser</P> → <code>http://192.168.0.1</code> → utilizator <code>admin</code>, parolă <code>admin</code>. (Alternativ: click pe WRT300N → tab <P>GUI</P>.)</p>
          <Callout kind="warn">Schimbarea parolei implicite a interfeței de management este prima regulă de securitate în producție (<P>Administration → Management</P>). Vezi topicul 5.3.</Callout>
        </Step>
        <Step labKey={L} n={4} title="Configurează SSID-ul și canalul">
          <p><P>Wireless → Basic Wireless Settings</P>:</p>
          <ul>
            <li><b>Network Mode:</b> Mixed (permite b/g/n — observă că e o setare legată de standardele 802.11).</li>
            <li><b>Network Name (SSID):</b> <code>CCNA-LAB</code> — atenție, e sensibil la litere mari/mici.</li>
            <li><b>Standard Channel:</b> <code>6 - 2.437GHz</code> — unul dintre cele 3 canale care nu se suprapun.</li>
            <li><b>SSID Broadcast:</b> Enabled.</li>
          </ul>
          <p>Apasă <b>Save Settings</b>.</p>
          <Reveal label="Întrebare: de ce canalul 6 și nu 3?"><p>Canalele 1, 6 și 11 sunt singurele din 2.4 GHz care nu se suprapun. Dacă un vecin folosește 1 sau 11, canalul 6 nu interferează cu el; canalul 3 s-ar suprapune cu 1 și cu 6 (<G id="aci" />).</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Configurează securitatea WPA2-Personal">
          <p><P>Wireless → Wireless Security</P>:</p>
          <ul>
            <li><b>Security Mode:</b> <code>WPA2 Personal</code></li>
            <li><b>Encryption:</b> <code>AES</code> (nu TKIP)</li>
            <li><b>Passphrase:</b> <code>Cisco12345</code> (8–63 caractere)</li>
          </ul>
          <p>Apasă <b>Save Settings</b>.</p>
          <Reveal label="Întrebare: de ce AES și nu TKIP?"><p>WPA2 cere <G id="ccmp" /> (AES). <G id="tkip" /> e moștenit de la WPA, e depreciat și, în plus, limitează 802.11n la 54 Mbps.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Pregătește laptopul cu o placă wireless">
          <p>Click pe Laptop0 → tab <P>Physical</P> → apasă butonul de <b>power</b> (laptopul se oprește) → trage placa existentă <code>PT-LAPTOP-NM-1CFE</code> în lista de module → trage în slot <code>WPC300N</code> → pornește laptopul.</p>
          <Reveal label="De ce trebuie oprit laptopul?"><p>Packet Tracer nu permite schimbarea modulelor hardware cu dispozitivul pornit — la fel ca în realitate pentru majoritatea plăcilor interne.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Conectează laptopul la CCNA-LAB">
          <p><P>Desktop → PC Wireless → Connect</P> → apasă <b>Refresh</b> → selectează <code>CCNA-LAB</code> (vezi canalul și securitatea afișate) → <b>Connect</b> → Security: WPA2-Personal, Pre-shared Key: <code>Cisco12345</code> → <b>Connect</b>.</p>
          <p>Observă în topologie linia „radio” dintre laptop și router.</p>
          <Reveal label="Nu se conectează?"><ul>
            <li>SSID scris diferit (litere mari/mici)?</li>
            <li>Parolă greșită → în realitate, 4-way handshake-ul ar eșua la mesajul 2 (MIC invalid).</li>
            <li>Ai apăsat <b>Save Settings</b> pe router după fiecare pagină?</li>
          </ul></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Conectează smartphone-ul">
          <p>Click pe Smartphone0 → <P>Config → Wireless0</P>: SSID <code>CCNA-LAB</code>, Authentication <code>WPA2-PSK</code>, PSK Pass Phrase <code>Cisco12345</code>, Encryption <code>AES</code>. IP Configuration: <b>DHCP</b>.</p>
        </Step>
        <Step labKey={L} n={9} title="Verifică">
          <CodeBlock title="Laptop0 — Command Prompt" kind="session" code={`C:\\> ipconfig
Wireless0 Connection:(default port)
   IPv4 Address......................: 192.168.0.101
   Subnet Mask.......................: 255.255.255.0
   Default Gateway...................: 192.168.0.1
C:\\> ping 192.168.0.1
Reply from 192.168.0.1: bytes=32 time=18ms TTL=255
C:\\> ping 192.168.0.100
Reply from 192.168.0.100: bytes=32 time=21ms TTL=128`} explain={[
            ['ipconfig', 'Adresă primită prin DHCP de la router → asocierea + securitatea au reușit.'],
            ['ping 192.168.0.1', 'Gateway-ul (routerul) răspunde prin wireless.'],
            ['ping 192.168.0.100', 'Clientul wireless comunică cu PC0 de pe cablu → AP-ul face bridging 802.11 ↔ 802.3.'],
          ]} />
          <p>Pe router: <P>Status → Wireless</P> (SSID, canal, securitate) și <P>Status → Local Network → DHCP Client Table</P> (cele 3 dispozitive).</p>
        </Step>
        <Step labKey={L} n={10} title="Experimentează (înțelegere)">
          <ul>
            <li>Schimbă parola pe router (Save) și observă că laptopul pierde conexiunea → are nevoie de noua parolă.</li>
            <li>Dezactivează <b>SSID Broadcast</b> → rețeaua dispare din lista PC Wireless, dar poți adăuga manual profilul. Concluzie: ascunderea SSID-ului nu oprește un client care știe numele.</li>
            <li>Comută în <b>Simulation mode</b>, filtrează ICMP și urmărește pachetul de ping de la laptop la PC0.</li>
          </ul>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă — rezumat configurație">
        <Table head={['Setare', 'Valoare', 'Unde']} rows={[
          ['SSID', 'CCNA-LAB', 'Wireless → Basic Wireless Settings'],
          ['Network Mode', 'Mixed', 'Wireless → Basic Wireless Settings'],
          ['Channel', '6 (2.437 GHz)', 'Wireless → Basic Wireless Settings'],
          ['SSID Broadcast', 'Enabled', 'Wireless → Basic Wireless Settings'],
          ['Security', 'WPA2 Personal + AES', 'Wireless → Wireless Security'],
          ['Passphrase', 'Cisco12345', 'Wireless → Wireless Security'],
          ['Laptop0 NIC', 'WPC300N', 'Physical'],
          ['Clienți', 'WPA2-PSK, AES, DHCP', 'PC Wireless / Config → Wireless0'],
        ]} />
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.11-S" title="Lab solo — birou mic cu două AP-uri (ESS)" />
      <Summary>
        <p><b>Scenariu:</b> un birou cu două încăperi. Vrei o singură rețea wireless (aceeași experiență peste tot), securizată, fără interferențe între cele două AP-uri.
          De data asta primești <b>doar cerințele</b>. Rezolvă singur, apoi deschide soluția pentru verificare.</p>
      </Summary>
      <Figure caption="Topologia țintă (creează-o tu în Packet Tracer).">
        <LabSoloTopology />
      </Figure>
      <Detailed title="Cerințe">
        <ol>
          <li><b>R-GW</b> (WRT300N) este doar gateway și server DHCP pentru <code>192.168.0.0/24</code>. Radioul lui wireless trebuie <b>dezactivat</b> (să nu creeze a treia celulă).</li>
          <li>R-GW se conectează la un switch <b>SW1</b> (2960), iar la SW1 se conectează două <b>AccessPoint-PT</b>: <b>AP-A</b> și <b>AP-B</b>.</li>
          <li>Ambele AP-uri difuzează <b>același SSID</b>: <code>BIROU</code> (formează un ESS).</li>
          <li>AP-A și AP-B folosesc <b>canale de 2.4 GHz care nu se suprapun</b> și nu sunt alăturate în plan (alege tu care).</li>
          <li>Securitate: <b>WPA2-PSK</b> cu <b>AES</b>, parola <code>Birou#2026</code>.</li>
          <li>Doi clienți lângă AP-A (laptop + telefon) și doi lângă AP-B. Toți primesc IP prin DHCP de la R-GW.</li>
          <li>Verificare: un client de la AP-A face ping cu succes la un client de la AP-B și la gateway.</li>
          <li><b>Întrebări de răspuns în notițe:</b> (a) de ce nu ai pus ambele AP-uri pe canalul 6? (b) câte BSS-uri și câte ESS-uri există? (c) ce s-ar schimba dacă ai pune SSID-uri diferite?</li>
        </ol>
        <Callout kind="tip" title="Indicii (deschide doar dacă te blochezi)">
          <Reveal label="Indiciul 1 — unde se configurează AccessPoint-PT"><p>Click pe AP → <P>Config → Port 1</P>: acolo găsești SSID, canalul 2.4 GHz și Authentication.</p></Reveal>
          <Reveal label="Indiciul 2 — cum oprești wireless-ul pe WRT300N"><p>GUI → <P>Wireless → Basic Wireless Settings → Network Mode: Disabled</P>.</p></Reveal>
          <Reveal label="Indiciul 3 — ce port al WRT300N folosești spre switch"><p>Un port <b>Ethernet</b> (LAN), nu <b>Internet</b> (WAN) — DHCP-ul LAN deservește doar porturile Ethernet.</p></Reveal>
        </Callout>
      </Detailed>
      <Reveal label="Soluție completă (pas cu pas)">
        <ol>
          <li>Plasează WRT300N (R-GW), un switch 2960 (SW1), două <P>Wireless Devices → AccessPoint-PT</P>, 2 laptopuri (cu placa <code>WPC300N</code>, ca în labul ghidat) și 2 smartphone-uri.</li>
          <li>Cabluri straight-through: R-GW <code>Ethernet 1</code> → SW1 <code>Fa0/1</code>; SW1 <code>Fa0/2</code> → AP-A <code>Port 0</code>; SW1 <code>Fa0/3</code> → AP-B <code>Port 0</code>.</li>
          <li>R-GW (GUI): <P>Wireless → Basic Wireless Settings → Network Mode: Disabled</P> → Save. DHCP rămâne activ (implicit 192.168.0.100–149).</li>
          <li>AP-A: <P>Config → Port 1</P> → SSID <code>BIROU</code>, 2.4 GHz Channel <code>1</code>, Authentication <code>WPA2-PSK</code>, PSK Pass Phrase <code>Birou#2026</code>, Encryption Type <code>AES</code>.</li>
          <li>AP-B: identic, dar Channel <code>11</code>.</li>
          <li>Clienții: <P>Config → Wireless0</P> → SSID <code>BIROU</code>, <code>WPA2-PSK</code>, parola, <code>AES</code>; IP Configuration → DHCP. Așază-i fizic aproape de AP-ul lor (în PT se asociază, de regulă, cu AP-ul cel mai apropiat/primul găsit).</li>
          <li>Verificare: <code>ipconfig</code> pe fiecare client (192.168.0.10x), apoi <code>ping 192.168.0.1</code> și ping între un client A și un client B.</li>
        </ol>
        <h4>Răspunsuri la întrebări</h4>
        <ul>
          <li><b>(a)</b> Pe același canal, AP-urile ar fi în <G id="cci" />: ar împărți timpul de emisie. 1 și 11 nu se suprapun. Combinațiile 1/6 sau 6/11 sunt, de asemenea, corecte; 1/11 lasă canalul 6 liber pentru un eventual al treilea AP între ele.</li>
          <li><b>(b)</b> 2 BSS-uri (câte unul per AP, fiecare cu propriul <G id="bssid" />) și 1 ESS (același SSID, aceeași rețea cablată).</li>
          <li><b>(c)</b> Cu SSID-uri diferite ar fi două rețele logice separate: clientul nu ar mai face roaming automat, ci s-ar reconecta manual la cealaltă rețea.</li>
        </ul>
        <Callout kind="exam" title="Legătură cu examenul">Acest scenariu acoperă 1.11.a (canale), 1.11.b (SSID/BSS/ESS) și 1.11.d (WPA2-PSK AES) și pregătește terenul pentru 2.6–2.7 (AP-uri legate la switch, mai multe SSID-uri → VLAN-uri).</Callout>
      </Reveal>
    </section>
  );
}
