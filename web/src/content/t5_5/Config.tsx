import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.5" title="Exemplu de configurare și verificare: VPN IPsec site-to-site (IKEv1, crypto map)" />
      <Summary>
        <p>Obiectivul 5.5 este de tip <b>Describe</b>; configurarea de mai jos este <b>ilustrativă</b>, ca să vezi cum se leagă conceptele (politică IKE, cheie PSK, transform set, ACL de trafic, crypto map) de comenzi. Se verifică cu <code>show crypto isakmp sa</code> (faza 1) și <code>show crypto ipsec sa</code> (faza 2 și contoarele de pachete).</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi reale; adresele sunt din intervale de documentare. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente reale. Algoritmii disponibili (<code>sha256</code>, grupuri DH) diferă între versiuni IOS/IOS XE și Packet Tracer (care poate accepta doar combinații mai vechi, de exemplu <code>sha</code> și grupurile 1/2/5) și poate cere licența <code>securityk9</code>. Pe platforme noi, Cisco recomandă IKEv2 (configurat cu proposal/policy/profile) — nu este acoperit aici.
      </Callout>

      <Detailed title="1. Scenariul">
        <Table head={['Echipament', 'Interfață', 'IPv4', 'Rol']} rows={[
          ['R1', 'Gi0/0 (LAN)', '192.168.1.1/24', 'Gateway filială'],
          ['R1', 'Gi0/1 (WAN)', '198.51.100.1/30', 'Spre ISP'],
          ['R3', 'Gi0/0 (LAN)', '192.168.3.1/24', 'Gateway sediu'],
          ['R3', 'Gi0/1 (WAN)', '203.0.113.2/30', 'Spre ISP'],
          ['R2 (ISP)', 'ambele', '198.51.100.2 · 203.0.113.1', 'Doar rutare (nu știe de LAN-urile private)'],
        ]} />
        <p>Condiții înainte de IPsec: R1 și R3 au rută spre adresa WAN a celuilalt (de exemplu rută default către ISP) și <code>ping</code> între <code>198.51.100.1</code> și <code>203.0.113.2</code> funcționează.</p>
      </Detailed>

      <Detailed title="2. R1 — cele patru blocuri de configurare">
        <CodeBlock title="R1 — IPsec site-to-site (ilustrativ)" kind="config" code={`R1(config)# crypto isakmp policy 10
R1(config-isakmp)# encryption aes 256
R1(config-isakmp)# hash sha256
R1(config-isakmp)# authentication pre-share
R1(config-isakmp)# group 14
R1(config-isakmp)# lifetime 86400
R1(config-isakmp)# exit
R1(config)# crypto isakmp key V3ryS3cretKey address 203.0.113.2
R1(config)# crypto ipsec transform-set TS esp-aes 256 esp-sha256-hmac
R1(cfg-crypto-trans)# mode tunnel
R1(cfg-crypto-trans)# exit
R1(config)# ip access-list extended VPN-TRAFFIC
R1(config-ext-nacl)# permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255
R1(config-ext-nacl)# exit
R1(config)# crypto map CMAP 10 ipsec-isakmp
R1(config-crypto-map)# set peer 203.0.113.2
R1(config-crypto-map)# set transform-set TS
R1(config-crypto-map)# match address VPN-TRAFFIC
R1(config-crypto-map)# exit
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# crypto map CMAP`} explain={[
          ['crypto isakmp policy 10', 'Politica IKE faza 1; numărul stabilește prioritatea (cel mai mic se încearcă primul).'],
          ['encryption aes 256 / hash sha256', 'Algoritmii pentru protecția negocierii IKE.'],
          ['authentication pre-share', 'Capetele se autentifică cu o cheie partajată (PSK).'],
          ['group 14', 'Grupul Diffie-Hellman folosit la schimbul de chei.'],
          ['lifetime 86400', 'Durata IKE SA în secunde (24 h), după care se refac cheile.'],
          ['crypto isakmp key … address 203.0.113.2', 'PSK pentru peer-ul R3, identificat după adresa WAN.'],
          ['crypto ipsec transform-set TS esp-aes 256 esp-sha256-hmac', 'Protejarea datelor: ESP cu AES-256 și HMAC SHA-256 (faza 2).'],
          ['mode tunnel', 'Încapsulare completă a pachetului original (implicit pentru crypto map).'],
          ['ACL VPN-TRAFFIC (permit ip 192.168.1.0 … 192.168.3.0 …)', 'Traficul de interes: LAN filială → LAN sediu; doar acesta este protejat.'],
          ['crypto map CMAP 10 ipsec-isakmp', 'Leagă peer-ul, transform set-ul și ACL-ul într-o intrare numerotată.'],
          ['crypto map CMAP (pe Gi0/1)', 'Aplică crypto map-ul pe interfața de ieșire spre Internet; fără aceasta, nu se criptează nimic.'],
        ]} />
        <Callout kind="tip" title="R3 oglindește R1">
          Pe R3 politica IKE, PSK-ul și transform set-ul sunt <b>identice</b>; <code>set peer</code> arată către <code>198.51.100.1</code>, iar ACL-ul este <b>oglindit</b>: <code>permit ip 192.168.3.0 0.0.0.255 192.168.1.0 0.0.0.255</code>. Dacă oglindirea lipsește, faza 2 eșuează.
        </Callout>
        <Callout kind="info" title="NAT">
          Dacă R1/R3 fac și NAT/PAT pe Gi0/1, adaugă o regulă care <b>exceptează</b> traficul 192.168.1.0/24 → 192.168.3.0/24 din traducere (de exemplu un <code>deny</code> pe acel trafic în ACL-ul NAT), altfel pachetele sunt traduse înainte de a se potrivi cu ACL-ul VPN.
        </Callout>
      </Detailed>

      <Detailed title="3. Verificare">
        <CodeBlock title="R1 — după un ping PC1 → PC3 (ilustrativ)" kind="session" code={`R1# show crypto isakmp sa
IPv4 Crypto ISAKMP SA
dst             src             state          conn-id status
203.0.113.2     198.51.100.1    QM_IDLE           1001 ACTIVE

R1# show crypto ipsec sa
interface: GigabitEthernet0/1
    Crypto map tag: CMAP, local addr 198.51.100.1
   local  ident (addr/mask/prot/port): (192.168.1.0/255.255.255.0/0/0)
   remote ident (addr/mask/prot/port): (192.168.3.0/255.255.255.0/0/0)
   current_peer 203.0.113.2 port 500
    #pkts encaps: 25, #pkts encrypt: 25, #pkts digest: 25
    #pkts decaps: 25, #pkts decrypt: 25, #pkts verify: 25
    #send errors 0, #recv errors 0
     inbound esp sas:
      spi: 0x4A2F7D31(1244233009)
        transform: esp-256-aes esp-sha256-hmac ,
        in use settings ={Tunnel, }
     outbound esp sas:
      spi: 0x9C03B2E8(2617983720)
        transform: esp-256-aes esp-sha256-hmac ,
        in use settings ={Tunnel, }

R1# show crypto map`} explain={[
          ['state QM_IDLE / ACTIVE', 'Faza 1 s-a încheiat cu succes: ISAKMP SA activă (QM_IDLE = gata pentru Quick Mode).'],
          ['local ident / remote ident', 'Traficul protejat: LAN-urile din ACL-ul de interes.'],
          ['#pkts encaps / encrypt', 'Pachetele trimise criptate; crește când treci trafic prin tunel.'],
          ['#pkts decaps / decrypt', 'Pachetele primite și decriptate: dacă rămâne 0, celălalt capăt nu răspunde sau ESP e blocat.'],
          ['spi inbound / outbound', 'Două SA IPsec, câte una pe sens, cu SPI-uri diferite.'],
          ['in use settings ={Tunnel, }', 'Modul de lucru este tunnel mode.'],
        ]} />
        <Table head={['Comandă', 'Ce verifică']} hlCol={0} rows={[
          [<code key="a">show crypto isakmp sa</code>, 'Faza 1: starea (QM_IDLE = bine; MM_NO_STATE / MM_KEY_EXCH = blocat în Main Mode)'],
          [<code key="b">show crypto ipsec sa</code>, 'Faza 2: SA-uri, contoare encaps/decaps, erori'],
          [<code key="c">show crypto map</code>, 'Intrările crypto map și ACL-ul asociat'],
          [<code key="d">show crypto session</code>, 'Vedere sintetică a sesiunilor IKE/IPsec'],
          [<code key="e">debug crypto isakmp</code>, 'Mesajele negocierii (folosește cu grijă, produce mult text)'],
          [<code key="f">clear crypto sa</code>, 'Șterge SA-urile ca să forțezi o renegociere'],
        ]} />
      </Detailed>

      <Detailed title="4. Depanare: de ce nu se ridică tunelul">
        <Table head={['Simptom', 'Cauze frecvente']} hlCol={0} rows={[
          ['Nicio intrare în ISAKMP SA', 'Nu există trafic de interes; crypto map neaplicat pe interfață; peer greșit; fără rută/ping spre peer; UDP 500 blocat'],
          ['MM_NO_STATE / MM_KEY_EXCH', 'Politici IKE incompatibile (algoritm, hash, grup DH, autentificare); PSK diferit; adresă peer greșită'],
          ['QM_IDLE, dar fără IPsec SA', 'Transform set incompatibil; ACL-urile nu sunt oglindite; proxy identity diferit'],
          ['encaps crește, decaps = 0', 'Peer-ul nu răspunde; ESP/UDP 4500 blocat pe cale; ACL sau rută lipsă pe celălalt capăt; NAT în cale fără NAT-T'],
          ['Ping merge doar spre un sens', 'Rută de întoarcere lipsă; ACL-ul „de interes” nu include sensul respectiv'],
          ['Merge ping mic, dar nu transferuri mari', 'MTU/fragmentare: antetele ESP măresc pachetul; ajustează MSS/MTU'],
        ]} />
        <Reveal label="Metodă de lucru în 6 pași">
          <ol>
            <li>Ping între adresele WAN ale celor două capete.</li>
            <li>Generează trafic de interes (ping extins din LAN, cu sursa corectă).</li>
            <li><code>show crypto isakmp sa</code>: faza 1 sus?</li>
            <li><code>show crypto ipsec sa</code>: contoare crescătoare?</li>
            <li>Compară cele două configurații: politică, PSK, transform set, ACL oglindit, peer, crypto map pe interfață.</li>
            <li>Dacă tot nu e clar: <code>debug crypto isakmp</code> și citește motivul respingerii.</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Fără <code>crypto map CMAP</code> aplicat pe interfață nu se criptează nimic, chiar dacă restul este corect.</>,
        <>PSK-ul se potrivește după <b>adresa peer-ului</b>; adresa greșită = „no matching key”.</>,
        <>ACL-ul de interes nu e un firewall: <code>permit</code> înseamnă „criptează acest trafic”, nu „permite accesul”.</>,
        <>Output-urile sunt <b>ilustrative</b>; textele și contoarele reale diferă.</>,
      ]} />
      <InlineQuiz ids={['5.5-020']} />
    </section>
  );
}
