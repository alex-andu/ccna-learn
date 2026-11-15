# Tech Stack for a Self-Hosted CCNA Learning App on Raspberry Pi 4 (as of Nov 2026)

> Research note: in this session, sqlite.org and developer.mozilla.org could not be fetched (blocked by the network allowlist). Findings on SQLite WAL internals, MDN backdrop-filter and WCAG come from secondary sources, or appear under Inferences/Gaps, marked as unverified.

## Q1. Raspberry Pi 4 constraints and backend/database choice (Node vs Python vs Go; SQLite vs PostgreSQL)

### Takeaway
I found no benchmark that tests Node.js, FastAPI and Go on a Pi 4. Generic data show all three idle well under 200 MB, which is trivial even on a 2 GB Pi. For a single-user app, the main criteria are one language (TypeScript) shared with the frontend and minimal SD/SSD writes. That points to Node.js 24/26 LTS with Fastify 5 (or Hono 4) plus SQLite (better-sqlite3 + Drizzle) in WAL mode, with root on a USB SSD.

### Cited Findings
- **Node.js release status (Nov 2026):**
  - v26 "Lithium" is the *Latest LTS* (v26.13.1, updated Nov 10, 2026). v24 "Krypton" (v24.22.3) and v22 "Jod" (v22.23.5) are also LTS. v20 and v25 are EOL. v27 is in alpha.
  - Node 27 moves to an annual release cycle, with a six-month Current phase before LTS.
  - LTS lines get about 30 months of critical fixes. Production apps should use only Active or Maintenance LTS.
  - Source: [nodejs.org previous releases](https://nodejs.org/en/about/previous-releases)
- **Memory figures, directional only (unnamed hardware, likely x86):**
  - Go net/http about 22 MB, Fastify about 85 MB, FastAPI about 140 MB.
  - Throughput: Go about 84.5k, Fastify about 48.2k, FastAPI about 14.3k req/s.
  - Source: [index.dev comparison](https://www.index.dev/skill-vs-skill/backend-go-vs-nodejs-vs-python-fastapi). The same page says elsewhere that Go and FastAPI use similar memory, so it is not fully consistent.
- Node.js held RAM between 75 MB and 120 MB at about 2,000 req/s in a Node vs Go test — [DEV: Node vs Go API showdown](https://dev.to/ocodista/node-vs-go-api-showdown-4njl). Its benchmark repo also measures RAM, threads and file descriptors — [ocodista/api-benchmark](https://github.com/ocodista/api-benchmark).
- A Raspberry Pi 3 benchmark plan exists for Express, FastAPI and Fiber, but the wiki page I saw had no memory results — [gochronicles wiki](https://github.com/gochronicles/benchmark-rest-frameworks/wiki/Raspberry-Pi-3---Benchmark-Instructions).
- Pi 4 single-core Geekbench 6.2 score is about 340, versus 764 for the Pi 5. So the Pi 4 is roughly half as fast per core, which matters for builds and cold starts — [fast.io Node on Pi guide](https://fast.io/resources/openclaw-raspberry-pi-nodejs-javascript-development-agent.md).
- **Fastify vs Hono:**
  - On Node 24, a Sep 2026 run measured Fastify 5.12.4 and Hono 4.13.7 within 1% of each other — [techplained](https://www.techplained.com/hono-vs-express-vs-fastify).
  - Fastify's own benchmark page (updated Aug 2026) shows Fastify at 88,171 req/s and Hono 4.13.1 at 82,683 req/s — [fastify.dev/benchmarks](https://www.fastify.dev/benchmarks/).
  - Fastify v5 requires Node 20 or newer, is Node-first, and has a larger plugin ecosystem. Hono is multi-runtime and much smaller (about 7.4 KB vs 132.9 KB) — [pkgpulse](https://www.pkgpulse.com/compare/hono-vs-fastify); [encore.dev](https://encore.dev/articles/nestjs-vs-fastify-vs-hono).
- **SQLite drivers:**
  - Built-in `node:sqlite` is *Stability 1.2 – Release candidate*. It was promoted to RC in v25.7.0 and v24.15.0, and is not yet marked stable — [Node.js sqlite docs](https://nodejs.org/download/release/v25.8.0/docs/api/sqlite.html); [flaviocopes](https://flaviocopes.com/node-sqlite).
  - better-sqlite3 12.0.0 dropped Node 18 and added Node 24 to its build matrix. It is described as very actively maintained — [newreleases better-sqlite3 12.0.0](https://newreleases.io/project/npm/better-sqlite3/release/12.0.0); [photostructure library comparison](https://photostructure.github.io/node-sqlite/documents/library-comparison.html).
  - Drizzle has no official `node:sqlite` driver in the results I found. Only a community adapter exists, needing Drizzle ORM 0.44.0 or later — [drizzle-orm-node-sqlite](https://github.com/FedorenkoCodes/drizzle-orm-node-sqlite).
- **Storage wear on the Pi:**
  - The Pi 4 EEPROM bootloader supports USB SSD boot, which Raspberry Pi Imager can configure. Tom's Hardware measured up to about 140 MB/s read and 208 MB/s write with an SSD — [Tom's Hardware](https://www.tomshardware.com/uk/news/boot-raspberry-pi-from-usb,39782.html).
  - log2ram moves logs into RAM and flushes them periodically. The trade-off is losing logs on power loss — [pimylifeup](https://pimylifeup.com/raspberry-pi-log2ram/); [dzombak](https://dzombak.com/blog/2024/04/Pi-Reliability-Reduce-writes-to-your-SD-card.html).
  - USB flash sticks wear just like SD cards. Do not disable filesystem journaling to save writes — [dzombak](https://dzombak.com/blog/2024/04/Pi-Reliability-Reduce-writes-to-your-SD-card.html).

### Inferences
- **Memory:** At 1–5 users, all three runtimes fit easily: under about 150 MB RSS on a 2 GB Pi. Raw req/s does not matter at this scale. The larger costs are maintaining two languages (Python or Go backend plus a TypeScript frontend) and Pi 4 CPU time for builds.
- **Language choice:** A TypeScript-everywhere stack lets the frontend and backend share code. That includes question and SRS types, Zod schemas and the subnet-drill generator. This is the strongest argument for Node. Go is the best choice only if a single static binary and minimal RAM are top priorities.
- **Fastify vs Hono:** Fastify 5 is the safer Node-only choice because of its mature plugins (static files, rate limits, schemas). Hono is fine and lighter if you prefer Web-standard APIs. Performance does not decide between them.
- **SQLite over PostgreSQL:** SQLite is the clear fit for one user and about 600 questions plus review logs. It has no daemon (Postgres would add roughly 50–150 MB RAM and more background writes), and the whole database is one file to back up. Use better-sqlite3 (synchronous, mature, prebuilt arm64 binaries) with Drizzle ORM. Consider `node:sqlite` once it is marked stable.
- **Recommended SQLite PRAGMAs:** `journal_mode=WAL`, `synchronous=NORMAL`, `foreign_keys=ON`, `busy_timeout=5000`. *Not verified against sqlite.org in this session.* From general knowledge: WAL lets readers and the writer run at the same time and reduces fsyncs. `synchronous=NORMAL` in WAL can lose only the last transactions on power loss, without corrupting the database.
- **Spaced repetition:** Use the FSRS algorithm via the `ts-fsrs` npm package, run on the server so all devices share the same schedule. *Unverified in this session; check versions and licence.*

### Gaps
- No Pi 4–specific RSS or startup benchmark for Node 24/26, FastAPI or Go was found. Measure locally with `wrk` and `/proc/<pid>/status`.
- I could not fetch sqlite.org's WAL page, so the WAL caveats above are unverified (checkpointing, the -wal/-shm files, WAL needing a local filesystem rather than NFS).

## Q2. Frontend: Vite + React + TS vs SvelteKit vs Astro; build location; serving assets

### Takeaway
Current stable versions: Vite 8.3.x (Rolldown-based), React 19.3, Tailwind CSS 4.x and Astro 6. The app is highly interactive (quizzes, drag-and-drop, SRS, dashboards) but also content-heavy. A Vite 8 + React 19 + TypeScript SPA with MDX via `@mdx-js/rollup`, built on the dev machine and served as static files, is the most maintainable option. Astro 6 with React islands is a strong alternative if lessons dominate.

### Cited Findings
- **Vite:**
  - Vite 8.0 went stable on March 12, 2026, built on the Rust bundler Rolldown — [vite.dev announcing Vite 8](https://vite.dev/blog/announcing-vite8); [heise](https://heise.de/-11210695).
  - Vite 8.1 shipped in June 2026 — [vite.dev Vite 8.1](https://vite.dev/blog/announcing-vite8-1).
  - The latest patch I saw was 8.3.4 (Oct 8, 2026) — [releasebot](https://releasebot.io/updates/vite/vite).
- **React:**
  - React 19.3 came out on Sep 9, 2026. ViewTransition and Fragment Refs became stable in it — [react.dev blog React 19.3](https://react.dev/blog/2026/09/09/react-19-3); [devx](https://www.devx.com/coding/19-3-view-transitions-fragment-refs/).
  - A patch 19.3.1 (Oct 14, 2026) is reported by a single source, so it is unconfirmed — [issoh.co.jp](https://www.issoh.co.jp/md/tech/4509).
  - There is no React 20 — [codercops](https://blog.codercops.com/blog/react-19-2-vs-react-20-explained).
- **Tailwind CSS:**
  - Tailwind v4 moved configuration into CSS (`@import "tailwindcss"` with `@theme`), replacing `tailwind.config.js` — [Laravel News](https://laravel-news.com/tailwind-css-v4-is-now-released); [tailwindcss.com v4.1](https://tailwindcss.com/blog/tailwindcss-v4-1).
  - A third-party aggregator lists v4.3.1 (2026-06-12) as the latest — [releases.sh](https://releases.sh/tailwind-css/tailwind-css.md).
- **Astro:**
  - Astro 6 brings a redesigned dev server, rendering performance gains, and built-in CSP, fonts and live content collections — [astro.build Astro 6 beta](https://astro.build/blog/astro-6-beta/); [astro.build Astro 6](https://astro.build/blog/astro-6).
  - Astro joined Cloudflare in January 2026, and Astro 6 has first-class Workers support — [Cloudflare blog](https://blog.cloudflare.com/astro-joins-cloudflare/).
  - Astro 6 requires Node 22 or newer — [InfoQ](https://www.infoq.com/news/2026/02/astro-v6-beta-cloudflare).
  - Astro supports Tailwind v4 natively through `@tailwindcss/vite`, and `@astrojs/tailwind` is deprecated — [newreleases @astrojs/tailwind 6.0.0](https://newreleases.io/project/github/withastro/astro/release/@astrojs%2Ftailwind@6.0.0).
- The Pi 4 has roughly half the single-core performance of a Pi 5 (Geekbench 340 vs 764) — [fast.io](https://fast.io/resources/openclaw-raspberry-pi-nodejs-javascript-development-agent.md).

### Inferences
- **Astro and Cloudflare:** Cloudflare's ownership of Astro adds a slight edge/cloud bias to its roadmap. It is not a blocker for static output, but this project runs locally only.
- **Shape of the app:** It behaves like an *app* that contains content (state on every page: bookmarks, progress, quiz state), not a content site with some widgets. A React SPA keeps a single mental model.
  - SvelteKit gives smaller bundles but a smaller ecosystem for drag-and-drop (e.g. dnd-kit) and charts.
  - Astro 6 + React islands is the runner-up. It suits a site that is mostly lessons, but cross-island state (theme, SRS, notes) adds friction.
- **Build location:** Build on the dev machine (or in CI) and copy `dist/` plus the server bundle to the Pi with rsync. Vite/Rolldown builds and `npm install` of native modules are slow on Pi 4 cores and put extra writes on flash storage. Keep the Pi for runtime only. If you do build on the Pi, use the arm64 prebuilt binaries for better-sqlite3.
- **Serving assets:**
  - Let Caddy serve hashed static assets directly, with `encode zstd gzip`, `Cache-Control: immutable` on `/assets/*`, and no-cache on `index.html` and `sw.js`.
  - Proxy only `/api/*` to Fastify. Precompressed (`.br`/`.gz`) files from the build reduce CPU use on the Pi.
- **Suggested libraries** (versions not verified this session): TanStack Router/Query, dnd-kit for drag-and-drop questions, Recharts or uPlot/visx for dashboards, Zod for validation.

### Gaps
- I did not verify current SvelteKit 2/Svelte 5 versions or bundle-size comparisons.
- The exact latest Tailwind 4.x patch is confirmed only by an aggregator. Run `npm view tailwindcss version` to check.

## Q3. Content pipeline: MDX vs Markdown + remark/rehype; diagrams; animation libraries

### Takeaway
Use MDX (via `@mdx-js/rollup` in Vite) for lessons that embed custom React components. Add a small custom remark plugin that wraps glossary acronyms in a `<Term>` tooltip component. Build diagrams as hand-made or React SVG components, and use Mermaid only for simple flowcharts, rendered at build time. For animations, GSAP is now free including all bonus plugins (Webflow licence). Motion (formerly Framer Motion) is the more React-native choice for UI transitions.

### Cited Findings
- **GSAP licensing:**
  - Webflow made GSAP 100% free for everyone, including the former Club plugins (SplitText, MorphSVG and others). Commercial use is covered under the standard "No Charge" licence — [Webflow blog](https://webflow.com/blog/gsap-becomes-free); [Webflow updates](https://webflow.com/updates/gsap-becomes-free).
  - The `gsap` npm package now includes all bonus plugins, and `gsap-trial` is deprecated — [gsap-trial README](https://cdn.jsdelivr.net/npm/gsap-trial@3.13.0/README.md); [GSAP README 3.15.0](https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md).
  - The licence is **not OSI open source**. It is granted by Webflow for "Permitted Uses", excludes "Competitive Products" (visual builders similar to Webflow), and Webflow "may terminate this GSAP License … in its discretion" — [GSAP standard license](https://gsap.com/community/standard-license/); [Wind River licence copy](https://open.windriver.com/info/uni-license-list/licenses/gsap-standard-no-charge-2025.html).
  - A Pinegrow forum post disputes this, but it predates or conflicts with Webflow's own terms — [Pinegrow forum](https://forum.pinegrow.com/t/gsap-has-been-acquired-by-webflow/9906).
  - The latest version seen is GSAP 3.15.0 — [jsdelivr](https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md).

### Inferences
- **GSAP licence fit:** The terms allow a personal CCNA study tool, since it is not a competing visual builder. Still, the termination clause makes GSAP a less safe *long-term* dependency than an MIT library.
- **Motion:** Use Motion (MIT, from my training knowledge; not re-verified here) for component and page transitions and layout animations.
- **GSAP vs CSS/SVG:** Reserve GSAP for timeline-heavy packet-flow animations, such as an ARP/STP/OSPF walkthrough with scrubbing. Many packet animations also work with SVG plus CSS `offset-path` or the Web Animations API, with no library.
- **MDX vs plain Markdown:** MDX lets lessons include `<SubnetCalculator/>`, `<PacketAnimation/>`, `<Quiz id=.../>` inline. Plain Markdown with remark/rehype can do acronym auto-linking but cannot embed interactive components without custom directive syntax (`remark-directive`), which ends up re-creating MDX.
- **Acronym auto-linking:** Write a remark plugin that walks `text` nodes, matches glossary keys (word boundaries, longest match first, first occurrence per section), and replaces them with an `mdxJsxTextElement` named `Term`. It should skip code, inline code, headings and links. Keep the glossary in one JSON/TS file shared with the flashcard generator.
- **Diagrams:** Topology diagrams for CCNA (routers, switches, VLANs) look and animate better as hand-made SVG or React SVG components, which can be themed with `currentColor` and CSS variables for dark/light mode. Mermaid is heavy at runtime (on the order of hundreds of KB), so if you use it, pre-render to SVG at build time (e.g. `rehype-mermaid`). *Bundle size and plugin not verified this session.*
- **Printable cheat sheets:** Use MDX pages with `@media print` CSS (A4, `break-inside: avoid`) and the browser's "Save as PDF". No server-side PDF engine is needed on the Pi.

### Gaps
- I did not fetch Motion's current version or licence, Mermaid's bundle size, or the `rehype-mermaid` / `@mdx-js/rollup` current versions. Verify these on npm.

## Q4. Deployment on the Pi: Docker vs systemd; Raspberry Pi OS; Caddy LAN HTTPS; backups; PWA

### Takeaway
Run Raspberry Pi OS Lite 64-bit (Trixie, Debian 13) from a USB SSD. Use a plain **systemd** service for the Node app plus Caddy from apt with `tls internal` (install Caddy's root CA on each phone and desktop). Back up SQLite with the `.backup` / `VACUUM INTO` API on a systemd timer to a second disk or NAS. Use vite-plugin-pwa for installability. HTTPS is required for service workers.

### Cited Findings
- **Raspberry Pi OS:**
  - Raspberry Pi OS "Trixie" (Debian 13 base) was released in October 2025, with 64-bit images for newer boards. The Raspberry Pi team recommends a fresh install over an in-place upgrade from Bookworm — [raspberrypi.com: Trixie](https://www.raspberrypi.com/news/trixie-the-new-version-of-raspberry-pi-os/); [heise](https://heise.de/-10724314).
  - Debian 13 ships Linux 6.12 — [CNX Software](https://www.cnx-software.com/2025/08/10/debian-13-trixie-released-with-linux-6-12-official-64-bit-risc-v-support/).
  - Trixie moves system time to 64-bit (Y2038 fix) — [opensourcefeed](https://www.opensourcefeed.org/raspberry-pi-os-trixie-release).
- **HTTPS and PWA:**
  - Service workers do not run without TLS, which also disables add-to-home-screen and push — [DEV: PWAs on your intranet](https://dev.to/justinribeiro/running-progressive-web-apps-on-your-intranet-with-tls-from-lets-encrypt-f3f).
  - Caddy can issue certs for LAN names and IPs from its own local CA (`tls internal`) — [Caddy automatic HTTPS docs](https://caddyserver.com/docs/automatic-https).
  - The root CA lives under `.../caddy/pki/authorities/local/root.crt`, which must be copied to each client device and trusted there — [Caddy community: install root CA on other machines](https://caddy.community/t/how-to-install-caddys-root-ca-on-other-machines-on-the-local-network/19090); [southstack homelab guide](https://southstack.pages.dev/blog/caddy-internal-tls).
  - Inside Docker, Caddy cannot install its root CA into the host trust store, so you must export it by hand — [Caddy community](https://caddy.community/t/how-to-make-local-network-browsers-accept-my-test-site/33257).
  - Alternative: a real domain with a Let's Encrypt DNS-01 certificate gives publicly trusted certs on the LAN with no CA install — [DEV: PWAs on your intranet](https://dev.to/justinribeiro/running-progressive-web-apps-on-your-intranet-with-tls-from-lets-encrypt-f3f).
  - Only install the root CA on devices you own — [hometechops](https://hometechops.com/self-hosting/home-service-browser-tls-warning).

### Inferences
- **systemd vs Docker:** For one Node process plus Caddy, systemd is simpler and uses less RAM and storage than Docker.
  - systemd gives restarts, journald logs and hardening options (`DynamicUser`, `ProtectSystem=strict`, `ReadWritePaths=/var/lib/ccna`).
  - Docker (official arm64 `node:24-bookworm-slim` or `node:26` images) is worth it only if you want reproducible, image-based upgrades. It adds overlayfs writes and the root-CA export caveat above.
- **Node install:** Install Node from NodeSource or official arm64 tarballs, or use `fnm`/`mise`. Pin it to an LTS line: Node 24 (Krypton, LTS until about Apr 2028) for the most battle-tested choice, or Node 26 (latest LTS). Debian Trixie's own nodejs package is older. *Not verified this session.*
- **Hostname:** Use mDNS (`ccna.local` via avahi, preinstalled on Raspberry Pi OS) or a router DNS entry, with a DHCP reservation for the Pi.
- **iOS certificates:** Installing a root CA on iOS takes two steps: install the profile, then enable full trust under Settings > General > About > Certificate Trust Settings. *From general knowledge; not confirmed by a source this session.*
- **Backups:**
  - Run a nightly `sqlite3 app.db ".backup /mnt/backup/app-$(date +%F).db"`, or `VACUUM INTO` from the app (better-sqlite3 has `db.backup()`). Use a systemd timer, keep about 14 copies, and rsync them to a NAS or second disk. Never copy the `.db` file alone while the app is running in WAL mode, because the -wal file holds the latest commits.
  - Also add an in-app JSON "export progress" button.
  - Optionally use Litestream for continuous replication to a local MinIO or another path. This is overkill for one user.
- **PWA:** Use vite-plugin-pwa (Workbox) for the manifest, icons and precached app shell. Make the API network-first, and optionally queue offline answer submissions in IndexedDB and sync them later.

### Gaps
- I did not verify current vite-plugin-pwa and Caddy (2.10.x?) versions.
- I did not confirm Node.js official Docker arm64 tags for v26 or exact LTS end dates (the Node page did not list EOL dates).
- I did not confirm whether Raspberry Pi OS has a newer point release than the October 2025 Trixie image.

## Q5. Glassmorphism performance on low-end mobile and accessibility contrast

### Takeaway
`backdrop-filter: blur()` is GPU-expensive, especially over content that scrolls or moves, and on low-end Android and Firefox. Use glass sparingly: for the header, nav and modals, not on every card. Keep the blur radius small (about 8–16 px). Provide solid fallbacks under `prefers-reduced-transparency` and `@supports`. Put text on a surface opaque enough to meet WCAG contrast.

### Cited Findings
- **Scrolling cost:** A long-open Firefox bug reports low performance when `backdrop-filter: blur()` sits over changing content such as scrolling. Disabling the filter on m.youtube.com immediately relieved the lag — [Mozilla Bug 1732817](https://bugzilla.mozilla.org/show_bug.cgi?id=1732817). WebKit has a related performance report — [WebKit Bug 252948](https://bugs.webkit.org/show_bug.cgi?id=252948).
- **Blur radius:** Larger radii cost more GPU time. A common frosted-glass range is 8–16 px, and one guide suggests staying under 20 px — [OpenReplay blog](https://blog.openreplay.com/creating-blurred-backgrounds-css-backdrop-filter/); [digitalthriveai](https://www.digitalthriveai.com/en-ca/resources/web-development/blurry-background-effect/). These are heuristics, not benchmarks.
- **iOS case:** An iPhone X showed severe jank with a very large blur, caused by excessive CPU use and implicit compositing layers. Reducing the effect fixed it — [besthub.dev JD case](https://besthub.dev/articles/why-one-css-property-slowed-down-ios-and-how-a-single-line-fixed-it-20c33877cc48).
- **Mitigations:** Use low-opacity solid background fallbacks or static pre-blurred images, and reduce or disable blur on small or touch screens with media queries — [OpenReplay](https://blog.openreplay.com/creating-blurred-backgrounds-css-backdrop-filter/); [vpon.me](https://vpon.me/articles/css-combo-for-a11y-performance-and-browser-support).

### Inferences
- **Where to use glass:** Limit it to 1–3 fixed elements (top bar, bottom nav on mobile, modal or sheet). Cards in long scroll lists should use a translucent solid, e.g. `bg-white/70 dark:bg-slate-900/70`, with a subtle border and shadow but no blur. Animate only `transform` and `opacity`.
- **Fallbacks:** Use `@supports not (backdrop-filter: blur(1px))` and `@media (prefers-reduced-transparency: reduce)` to fall back to opaque surfaces. Use `@media (prefers-reduced-motion: reduce)` to disable GSAP/Motion animations.
- **Contrast:**
  - WCAG 2.2 AA requires 4.5:1 for normal text, 3:1 for large text (SC 1.4.3), and 3:1 for UI components and focus indicators (SC 1.4.11). *Standard thresholds from general knowledge; the W3C page was not fetched this session.*
  - Over glass, measure contrast against the *worst-case* background behind the panel. In practice that means a surface at least about 70–85% opaque under body text. Keep long-form lesson text on near-opaque panels.
  - Tailwind v4's CSS-variable theme (`@theme`) plus a `data-theme` attribute toggling light and dark makes it easy to keep tokens contrast-checked.

### Gaps
- I could not fetch MDN `backdrop-filter` (Baseline status, notes) or the W3C WCAG 2.2 pages because those domains were blocked.
- I found no measured FPS benchmark of backdrop-filter on specific low-end Android devices. Testing on real hardware is recommended.

## Q6. Current stable versions and final recommended stack (Nov 2026)

### Takeaway
**Recommended stack:**
- **OS and storage:** Raspberry Pi OS Lite 64-bit (Trixie), booted from a USB SSD, with log2ram.
- **Backend:** Node.js 24 LTS (or 26 LTS) and Fastify 5, with better-sqlite3 + Drizzle ORM on SQLite in WAL mode.
- **Frontend:** Vite 8 + React 19.3 + TypeScript, Tailwind CSS 4, MDX with a custom remark glossary plugin, Motion for UI transitions (GSAP optional), and vite-plugin-pwa.
- **Serving and operations:** Caddy with `tls internal` serves static assets and reverse-proxies the API. The app runs under systemd, and a systemd timer runs SQLite `.backup`. Build on the dev machine and rsync to the Pi.

### Cited Findings
- Node.js: v26 is the latest LTS (26.13.1). v24 (24.22.3) and v22 (22.23.5) are also LTS. v20 is EOL — [nodejs.org](https://nodejs.org/en/about/previous-releases)
- Vite: 8.x (8.0 in Mar 2026; 8.3.4 on Oct 8, 2026) — [vite.dev](https://vite.dev/blog/announcing-vite8); [releasebot](https://releasebot.io/updates/vite/vite)
- React: 19.3 (Sep 9, 2026). 19.3.1 is reported but unconfirmed — [react.dev](https://react.dev/blog/2026/09/09/react-19-3)
- Tailwind CSS: 4.x (4.3.1 per aggregator, Jun 2026) — [releases.sh](https://releases.sh/tailwind-css/tailwind-css.md)
- Astro: 6 (requires Node 22 or newer) — [astro.build](https://astro.build/blog/astro-6); [InfoQ](https://www.infoq.com/news/2026/02/astro-v6-beta-cloudflare)
- Fastify 5.12.x and Hono 4.13.x (Sep 2026 benchmarks) — [techplained](https://www.techplained.com/hono-vs-express-vs-fastify); [fastify.dev](https://www.fastify.dev/benchmarks/)
- GSAP 3.15 (free, Webflow licence) — [jsdelivr](https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md); [Webflow](https://webflow.com/blog/gsap-becomes-free)
- better-sqlite3 12.x. `node:sqlite` is RC — [newreleases](https://newreleases.io/project/npm/better-sqlite3/release/12.0.0); [Node docs](https://nodejs.org/download/release/v25.8.0/docs/api/sqlite.html)

### Inferences
- **Node 24 vs 26:** Node 24 has been in production for over a year, with LTS until about April 2028, so it is the conservative pick. Node 26 became LTS in October 2026 and gives the longest support. Either is fine. Make sure better-sqlite3 has prebuilt linux-arm64 binaries for the chosen ABI.
- **Why this stack:**
  - **One language everywhere:** Question types, the subnet generator and SRS logic are shared between client and server.
  - **No database daemon:** The SQLite database is a single file that is easy to back up.
  - **Light runtime footprint:** About 100 MB RSS (Node + Fastify) plus Caddy, comfortable even on a 2 GB Pi 4.
  - **Static frontend served by Caddy:** This keeps CPU use low.
  - **Low build-time risk on the Pi:** No builds happen there.
- **Data model sketch:**
  - Core tables: `questions` (id, type, topic, payload JSON, explanation), `cards` (FSRS state per question or flashcard per user), `reviews` (log), `attempts`, `notes`, `bookmarks`, `users`.
  - Question bank content lives in version-controlled JSON/MDX in the repo and is seeded into SQLite on deploy.
  - Subnetting drills are generated on the client from a seeded PRNG, with only results stored.
- **Alternatives and when to choose them:**
  - **Go (+ SQLite via modernc/sqlite or mattn) with the same Vite frontend:** if minimal RAM and a single static binary matter more than shared TS code.
  - **Astro 6 + React islands:** if the app becomes mostly read-only lessons.
  - **Hono instead of Fastify:** if you prefer Web-standard Request/Response and a smaller footprint.

### Gaps
- Exact latest patch versions for Tailwind, React (19.3.x), TypeScript, Motion, Drizzle, vite-plugin-pwa, Caddy and ts-fsrs were not all verified. Check with `npm view <pkg> version` at project start.
- Node 24 and 26 LTS end-of-life dates were not shown on the fetched Node page.
