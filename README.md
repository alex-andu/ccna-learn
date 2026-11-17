# CCNA Learn

Platformă personală de învățare pentru **Cisco CCNA 200-301 v1.1**, self-hosted pe **Raspberry Pi 4**, folosită din browser pe desktop și pe telefon.

> Structura de curs este exact blueprint-ul oficial Cisco v1.1 (6 domenii, 53 de obiective). Conținut complet momentan: **1.11 Describe wireless principles** (topic pilot). Restul topicurilor apar ca „în curând”.
> CCNA v1.1 se poate susține până pe **2 februarie 2027**; de pe 3 februarie 2027 intră v2.0 (update planificat).

## Ce conține

| Zonă | Detalii |
|---|---|
| **Curriculum** | arborele oficial v1.1 (verbatim), progres pe domeniu / topic / secțiune |
| **Lecții** | pe straturi: *Pe scurt* → *Explicație detaliată* → *Deep dive* opțional → *Capcane de examen* → mini-test; diagrame SVG interactive (unde RF, canale 2.4/5 GHz, BSS/ESS/IBSS, 4-way handshake, CSMA/CA), fotografii cu licență liberă |
| **Glosar** | fiecare acronim/protocol: *ce face · cum lucrează · unde se folosește*; apare ca tooltip (hover/tap) direct în text |
| **Configurare** | exemple CLI comentate linie cu linie (AP autonom IOS, Catalyst 9800, AireOS, clienți Windows/Linux/macOS) |
| **Laburi** | lab ghidat + lab solo pentru Packet Tracer, cu soluții ascunse |
| **Antrenament** | 3 moduri: **Simulare** (configurabilă: nr. întrebări, timp, fără întoarcere), **Antrenament** (Verifică / Arată răspunsul), **Fast track** (click → corect/greșit + explicații → următoarea) |
| **Întrebări** | single, multiple, drag & drop (potrivire + ordonare), completare comenzi CLI; explicație pentru **fiecare variantă** |
| **Repetare** | spaced repetition **FSRS** (ts-fsrs) pentru întrebările greșite și flashcards |
| **Unelte** | calculator + drill subnetting IPv4, calculator IPv6, flashcards, cheat sheets printabile, notițe & bookmark-uri |
| **Statistici** | streak, obiectiv zilnic, timp de studiu, acuratețe pe topic, istoric simulări, heatmap |

## Arhitectură

```
web/      Vite + React 19 + TypeScript (SPA, PWA)     → build static în web/dist
server/   Node.js + Fastify 5 + SQLite (better-sqlite3, WAL) → API /api/* + servește web/dist
data/     ccna.db (+ backups/)                         → creat automat
deploy/   systemd (serviciu + backup nocturn), Caddyfile
```

Un singur proces Node (~60–100 MB RAM) servește atât interfața, cât și API-ul. Fără Docker, fără server de baze de date.

## Rulare locală (dezvoltare)

```bash
npm install
```

```bash
npm run dev
```

Interfața: <http://localhost:5173> (proxy `/api` → `localhost:8080`).

## Instalare pe Raspberry Pi 4

Recomandat: Raspberry Pi OS Lite **64-bit**, boot de pe **SSD USB** (cardul SD se uzează la scrieri repetate).

1. Node.js LTS (22 sau 24) și unelte de build (pentru `better-sqlite3`, dacă nu există binar precompilat):

```bash
sudo apt update && sudo apt install -y git build-essential python3
```

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
```

2. Codul și build-ul (pe Pi durează ~1–2 minute; alternativ faci build pe PC și copiezi folderul cu `rsync`):

```bash
sudo mkdir -p /opt/ccna-learn && sudo chown pi:pi /opt/ccna-learn
```

```bash
git clone https://github.com/alex-andu/ccna-learn.git /opt/ccna-learn
```

```bash
cd /opt/ccna-learn && npm ci && npm run build
```

3. Serviciu systemd + backup nocturn (03:17, păstrează 14 copii în `data/backups/`). Dacă utilizatorul tău nu e `pi`, editează `User=` în fișierele din `deploy/`.

```bash
sudo cp deploy/ccna-learn.service deploy/ccna-learn-backup.service deploy/ccna-learn-backup.timer /etc/systemd/system/
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now ccna-learn ccna-learn-backup.timer
```

Platforma rulează acum pe `http://<ip-pi>:8080`.

4. (Opțional, recomandat pentru telefon) HTTPS local cu Caddy — necesar ca să poți „instala” aplicația (PWA) pe telefon:

```bash
sudo apt install -y caddy
```

```bash
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile && sudo systemctl reload caddy
```

Editează în `Caddyfile` numele/IP-ul Pi-ului. Certificatul rădăcină al CA-ului local se află în `/var/lib/caddy/.local/share/caddy/pki/authorities/local/root.crt` — copiază-l pe telefon/laptop și instalează-l ca „certificat de încredere”.

### Actualizare

```bash
cd /opt/ccna-learn && git pull && npm ci && npm run build && sudo systemctl restart ccna-learn
```

### Backup manual

* din interfață: **Setări → Exportă JSON** (și Import pentru restaurare);
* din terminal: `npm run backup -w server` (copie consistentă a bazei SQLite).

## Adăugarea de conținut (topicuri noi)

> **Rețeta veche în 5 pași a fost eliminată (depășită)**: ea trimitea termenii în `glossary.ts` și `AVAILABLE` la început. Arhitectura actuală folosește `data/terms/<tX_Y>.ts`, `data/facts/`, agregare automată, iar `AVAILABLE` se modifică doar cu aprobarea explicită a utilizatorului.
>
> Singura procedură autoritativă: [`docs/WORKFLOW.md`](docs/WORKFLOW.md).

## Surse și licențe

* Exam topics: Cisco CCNA 200-301 v1.1 (© 2024 Cisco Systems, Inc., Cisco Public). Proiect personal, neafiliat Cisco.
* Fotografii: Wikimedia Commons (atribuire în `web/public/img/wiki/attribution.json` și în pagina Setări).
* FSRS: [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) (MIT). Fonturi: Inter, JetBrains Mono (OFL).
* Cercetarea din spatele platformei: `reports/Curricula CCNA și resurse oficiale.md`.
