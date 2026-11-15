import { useState, type ReactNode } from 'react';

const PROMPT = /^((?:[\w\-.]+(?:\([\w\-./ ]+\))?[#>])|C:\\[^>]*>|\$|PS [^>]*>|\(Cisco Controller\)(?: \w+)? >)\s?/;

function hl(line: string, kind: 'config' | 'session') {
  if (/^\s*!/.test(line)) return <span className="tok-cmt">{line}</span>;
  const m = line.match(PROMPT);
  if (m) return <><span className="tok-prompt">{m[0]}</span>{cmd(line.slice(m[0].length))}</>;
  if (kind === 'session') return <span className="tok-out">{line}</span>;
  return cmd(line);
}
function cmd(s: string) {
  const lead = s.match(/^\s*/)?.[0] ?? '';
  const rest = s.slice(lead.length);
  const [first, ...others] = rest.split(' ');
  return <>{lead}<span className="tok-kw">{first}</span>{others.length ? ' ' : ''}{others.map((w, i) =>
    <span key={i} className={/^(\d[\d./:]*|".*"|[A-Z][\w-]*!?\d*)$/.test(w) ? 'tok-val' : undefined}>{w}{i < others.length - 1 ? ' ' : ''}</span>)}</>;
}

/** Bloc de cod CLI cu highlight, buton de copiere și (opțional) explicație pe fiecare comandă. */
export function CodeBlock({ title, code, kind = 'config', explain }: {
  title?: string; code: string; kind?: 'config' | 'session'; explain?: [string, ReactNode][];
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, '').split('\n');
  const copy = () => {
    const text = lines.filter((l) => kind === 'config' || PROMPT.test(l)).map((l) => l.replace(PROMPT, '')).join('\n');
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }).catch(() => {});
  };
  return (
    <div className="code">
      <div className="code-h"><span className="dots"><i /><i /><i /></span><span>{title ?? (kind === 'config' ? 'configurare' : 'sesiune')}</span>
        <button className="copy" type="button" onClick={copy}>{copied ? 'copiat ✓' : 'copiază'}</button></div>
      <pre><code>{lines.map((l, i) => <div key={i}>{hl(l, kind) }{l === '' ? '\u00a0' : null}</div>)}</code></pre>
      {explain && <ul className="code-explain">{explain.map(([c, e], i) => <li key={i}><code>{c}</code><span>{e}</span></li>)}</ul>}
    </div>
  );
}
