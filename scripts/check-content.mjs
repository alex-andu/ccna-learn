// Verificare statică a conținutului: termeni de glosar, întrebări, quiz-uri inline, fotografii.
// Rulare: node scripts/check-content.mjs  (din rădăcina repo-ului)
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'web');
const src = path.join(root, 'src');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(src).filter((f) => /\.(tsx?|ts)$/.test(f));
const read = (f) => fs.readFileSync(f, 'utf8');
const errors = [];

// glosar
const glossFiles = [path.join(src, 'data/glossary.ts'), ...walk(path.join(src, 'data/terms'))];
const gloss = new Map();
for (const f of glossFiles) for (const m of read(f).matchAll(/\bid: '([^']+)',\s*abbr:/g)) {
  if (gloss.has(m[1])) errors.push(`glosar: id duplicat '${m[1]}' în ${path.relative(src, f)} (există deja în ${gloss.get(m[1])}) — prima definiție câștigă`);
  else gloss.set(m[1], path.relative(src, f));
}
// referințe la glosar
for (const f of files) {
  const s = read(f);
  for (const m of s.matchAll(/<(?:G|Term) id="([^"]+)"/g)) if (!gloss.has(m[1])) errors.push(`termen lipsă '${m[1]}' în ${path.relative(src, f)}`);
  for (const m of s.matchAll(/\[\[([a-z0-9][a-z0-9-]*)(?:\|[^\]]*)?\]\]/g)) if (!['id', 'termen'].includes(m[1]) && !gloss.has(m[1])) errors.push(`termen lipsă [[${m[1]}]] în ${path.relative(src, f)}`);
}
// întrebări
const qids = new Map();
for (const f of walk(path.join(src, 'data/questions')).filter((f) => !f.endsWith('index.ts'))) {
  for (const m of read(f).matchAll(/\bid: '([0-9]+\.[0-9]+-[0-9]+)'/g)) {
    if (qids.has(m[1])) errors.push(`întrebare cu id duplicat '${m[1]}'`);
    qids.set(m[1], path.relative(src, f));
  }
}
for (const f of files) for (const m of read(f).matchAll(/<InlineQuiz ids=\{\[([^\]]*)\]\}/g)) {
  for (const id of m[1].split(',').map((x) => x.trim().replace(/['"]/g, '')).filter(Boolean)) if (!qids.has(id)) errors.push(`InlineQuiz: întrebarea '${id}' nu există (${path.relative(src, f)})`);
}
// fotografii
const wiki = path.join(root, 'public/img/wiki');
const attr = Object.assign({}, ...fs.readdirSync(wiki).filter((f) => /^attribution.*\.json$/.test(f)).map((f) => JSON.parse(fs.readFileSync(path.join(wiki, f), 'utf8'))));
for (const f of files) for (const m of read(f).matchAll(/<Photo file="([^"]+)"/g)) {
  if (!fs.existsSync(path.join(wiki, m[1]))) errors.push(`foto lipsă ${m[1]} (${path.relative(src, f)})`);
  if (!attr[m[1]]) errors.push(`foto fără atribuire ${m[1]} (${path.relative(src, f)})`);
}
// statistici
const perTopic = {};
for (const [id] of qids) { const t = id.split('-')[0]; perTopic[t] = (perTopic[t] ?? 0) + 1; }
console.log(`glosar: ${gloss.size} termeni · întrebări: ${qids.size}`, perTopic);
if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); process.exit(1); }
console.log('✓ conținut OK');
