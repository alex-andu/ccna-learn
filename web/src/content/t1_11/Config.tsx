import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.11" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Topicul 1.11 este de tip <b>Describe</b>: la examen nu ți se cere să configurezi, ci să înțelegi. Totuși, conceptele se fixează cel mai bine văzându-le în configurații reale.
          Mai jos: același WLAN (SSID <code>CCNA-LAB</code>, WPA2-PSK cu AES, canalul 6) pe trei platforme Cisco, plus comenzile de verificare de pe client.</p>
      </Summary>
      <Callout kind="info" title="Ce vei folosi efectiv în laburi">
        Packet Tracer simulează routere wireless de tip „home” (WRT300N) și AP-uri generice configurate din GUI — exact ce faci în laburile de mai jos. GNS3, EVE-NG și CML <b>nu emulează radio</b>: poți rula un controller virtual (Catalyst 9800-CL), dar fără AP-uri și clienți reali. Sintaxa de mai jos urmează ghidurile de configurare Cisco. Versiunile de IOS/IOS-XE/AireOS pot avea mici diferențe, așa că verifică întotdeauna cu <code>?</code> pe echipament.
      </Callout>

      <Detailed title="Exemplul 1 — AP Cisco autonom (IOS clasic, de exemplu Aironet)">
        <p>Un AP <b>autonom</b> se configurează individual, din CLI, ca un switch. Se definește global un SSID cu securitatea lui, apoi SSID-ul se atașează unei interfețe radio (<code>Dot11Radio0</code> = 2.4 GHz, <code>Dot11Radio1</code> = 5 GHz).</p>
        <CodeBlock title="AP autonom — WPA2-PSK, canal 6" code={`AP> enable
AP# configure terminal
AP(config)# dot11 ssid CCNA-LAB
AP(config-ssid)# authentication open
AP(config-ssid)# authentication key-management wpa version 2
AP(config-ssid)# wpa-psk ascii 0 Cisco12345!
AP(config-ssid)# guest-mode
AP(config-ssid)# exit
AP(config)# interface Dot11Radio0
AP(config-if)# encryption mode ciphers aes-ccm
AP(config-if)# ssid CCNA-LAB
AP(config-if)# channel 6
AP(config-if)# no shutdown
AP(config-if)# end
AP# copy running-config startup-config`} kind="session" explain={[
          ['dot11 ssid CCNA-LAB', <>Creează SSID-ul (maximum 32 de caractere, sensibil la litere mari/mici) — vezi <G id="ssid" />.</>],
          ['authentication open', 'Autentificarea 802.11 „Open System” — pasul formal dinaintea asocierii. Securitatea reală vine din WPA2.'],
          ['authentication key-management wpa version 2', <>Gestionarea cheilor prin WPA2 (<G id="4way" />).</>],
          ['wpa-psk ascii 0 Cisco12345!', <>Parola comună (<G id="psk" />, 8–63 caractere). Din ea + SSID se derivă <G id="pmk" />-ul.</>],
          ['guest-mode', 'Include SSID-ul în beacons (broadcast). Fără această comandă, SSID-ul e „ascuns”.'],
          ['encryption mode ciphers aes-ccm', <>Criptarea <G id="aes" />-<G id="ccmp" /> — obligatorie pentru WPA2 și pentru ratele 802.11n/ac.</>],
          ['ssid CCNA-LAB', 'Atașează SSID-ul la radioul de 2.4 GHz.'],
          ['channel 6', <>Canalul 6 (2437 MHz) — unul dintre cele 3 care nu se suprapun în 2.4 GHz. Alternativă: <code>channel least-congested</code>.</>],
        ]} />
        <CodeBlock title="Verificare pe AP autonom" kind="session" code={`AP# show dot11 associations
802.11 Client Stations on Dot11Radio0:
SSID [CCNA-LAB] :
MAC Address    IP address      Device        Name    Parent  State
a4c3.f0e1.22b9 192.168.10.51   ccx-client    LAPTOP  self    Assoc
AP# show interfaces dot11Radio 0
Dot11Radio0 is up, line protocol is up
  Hardware is 802.11N 2.4GHz Radio, address is 0022.bd18.8780 (bia 0022.bd18.8780)`} explain={[
          ['show dot11 associations', 'Clienții asociați: MAC, IP, SSID, starea (Assoc = asociat).'],
          ['show interfaces dot11Radio 0', <>Starea radioului și MAC-ul lui — din el derivă <G id="bssid" />-urile.</>],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Cisco Catalyst 9800 WLC (IOS-XE)">
        <p>În rețelele enterprise, AP-urile sunt <b>lightweight</b>, iar configurația se face o singură dată pe <G id="wlc" />. Controller-ul o trimite apoi tuturor AP-urilor prin <G id="capwap" />. Pe 9800, un WLAN nou are implicit WPA2 + AES + 802.1X, așa că doar schimbăm AKM-ul pe PSK.</p>
        <CodeBlock title="9800 — WLAN WPA2-PSK" kind="session" code={`WLC# configure terminal
WLC(config)# wlan CCNA-LAB 1 CCNA-LAB
WLC(config-wlan)# no security wpa akm dot1x
WLC(config-wlan)# security wpa akm psk
WLC(config-wlan)# security wpa psk set-key ascii 0 Cisco12345!
WLC(config-wlan)# no shutdown
WLC(config-wlan)# end`} explain={[
          ['wlan CCNA-LAB 1 CCNA-LAB', 'Creează profilul WLAN: nume profil, WLAN ID (1), SSID difuzat.'],
          ['no security wpa akm dot1x', <>Dezactivează autentificarea Enterprise (<G id="dot1x" />), implicită pe 9800.</>],
          ['security wpa akm psk', <>Activează modul Personal (<G id="psk" />).</>],
          ['security wpa psk set-key ascii 0 …', 'Setează parola (0 = text clar în comandă; IOS-XE o va stoca criptat).'],
          ['no shutdown', 'Un WLAN nou este oprit implicit — trebuie activat.'],
        ]} />
        <CodeBlock title="9800 — canal manual pe un AP + verificări" kind="session" code={`WLC# ap name AP1 dot11 24ghz shutdown
WLC# ap name AP1 dot11 24ghz channel 6
WLC# no ap name AP1 dot11 24ghz shutdown
WLC# show wlan summary
Number of WLANs: 1
ID   Profile Name      SSID          Status  2.4GHz/5GHz Security
----------------------------------------------------------------
1    CCNA-LAB          CCNA-LAB      UP      [WPA2][PSK][AES]
WLC# show ap dot11 24ghz summary
WLC# show wireless client summary`} explain={[
          ['ap name AP1 dot11 24ghz channel 6', <>Fixează manual canalul radioului de 2.4 GHz al AP1. În practică, canalele le alege automat <G id="rrm" />.</>],
          ['show wlan summary', 'Lista WLAN-urilor: ID, profil, SSID, stare, securitate.'],
          ['show ap dot11 24ghz summary', 'Pentru fiecare AP: canal, putere, stare radio 2.4 GHz.'],
          ['show wireless client summary', 'Clienții conectați: MAC, AP, WLAN, stare, protocol (11n/11ac/11ax).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — WLC AireOS (2504/5520 — generația anterioară, încă frecventă în laburi)">
        <CodeBlock title="AireOS — WLAN WPA2-PSK" kind="session" code={`(Cisco Controller) >config wlan create 1 CCNA-LAB CCNA-LAB
(Cisco Controller) >config wlan security wpa enable 1
(Cisco Controller) >config wlan security wpa wpa2 enable 1
(Cisco Controller) >config wlan security wpa wpa2 ciphers aes enable 1
(Cisco Controller) >config wlan security wpa akm 802.1x disable 1
(Cisco Controller) >config wlan security wpa akm psk enable 1
(Cisco Controller) >config wlan security wpa akm psk set-key ascii Cisco12345! 1
(Cisco Controller) >config wlan enable 1
(Cisco Controller) >show wlan summary`} explain={[
          ['config wlan create 1 CCNA-LAB CCNA-LAB', 'WLAN ID, nume profil, SSID.'],
          ['… wpa2 ciphers aes enable 1', <>Criptarea AES-CCMP pentru WLAN 1.</>],
          ['… akm psk enable / set-key', 'Modul Personal cu parola dată.'],
          ['config wlan enable 1', 'Activează WLAN-ul (pe AireOS, un WLAN nou e dezactivat).'],
        ]} />
        <p className="small muted">În topicurile 2.9 și 5.10 vei face aceeași configurare din <b>GUI</b>-ul WLC-ului (WLANs → Create New → Security → Layer 2: WPA2 + PSK) — acolo se și testează la examen.</p>
      </Detailed>

      <Detailed title="Verificare pe client (legătură cu 1.10 — Client OS)">
        <CodeBlock title="Windows" kind="session" code={`C:\\> netsh wlan show interfaces
    Name                   : Wi-Fi
    State                  : connected
    SSID                   : CCNA-LAB
    BSSID                  : 00:22:bd:18:87:80
    Radio type             : 802.11n
    Authentication         : WPA2-Personal
    Cipher                 : CCMP
    Channel                : 6
    Receive rate (Mbps)    : 144.4
    Signal                 : 86%
C:\\> netsh wlan show networks mode=bssid`} explain={[
          ['netsh wlan show interfaces', 'Conexiunea curentă: SSID, BSSID, standard, autentificare, cifru, canal, rată, semnal.'],
          ['netsh wlan show networks mode=bssid', 'Toate rețelele din jur, cu BSSID, canal și semnal pentru fiecare — un mini site survey.'],
        ]} />
        <CodeBlock title="Linux" kind="session" code={`$ nmcli dev wifi list
IN-USE  BSSID              SSID      MODE   CHAN  RATE        SIGNAL  SECURITY
*       00:22:BD:18:87:80  CCNA-LAB  Infra  6     130 Mbit/s  82      WPA2
$ iw dev wlan0 link
Connected to 00:22:bd:18:87:80 (on wlan0)
        SSID: CCNA-LAB
        freq: 2437
        signal: -48 dBm`} explain={[
          ['nmcli dev wifi list', 'Scanează și listează rețelele (SSID, BSSID, canal, semnal, securitate).'],
          ['iw dev wlan0 link', <>Conexiunea curentă cu semnalul în dBm (<G id="rssi" />) și frecvența (2437 MHz = canalul 6).</>],
        ]} />
        <CodeBlock title="macOS" kind="session" code={`$ system_profiler SPAirPortDataType
      Current Network Information:
        CCNA-LAB:
          PHY Mode: 802.11ac
          Channel: 36 (5GHz, 80MHz)
          Security: WPA2 Personal
          Signal / Noise: -52 dBm / -94 dBm`} explain={[
          ['system_profiler SPAirPortDataType', <>Detalii Wi-Fi, inclusiv semnal/zgomot → <G id="snr" /> = −52 − (−94) = 42 dB. Rapid: Option + click pe iconița Wi-Fi.</>],
        ]} />
      </Detailed>
    </section>
  );
}
