export const ipToInt = (ip: string) => {
  const p = ip.trim().split('.');
  if (p.length !== 4 || p.some((x) => !/^\d{1,3}$/.test(x) || +x > 255)) return null;
  return p.reduce((a, x) => (a << 8) + +x, 0) >>> 0;
};
export const intToIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
export const maskOf = (prefix: number) => (prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0);
export const toBin = (n: number) => [24, 16, 8, 0].map((s) => ((n >>> s) & 255).toString(2).padStart(8, '0')).join('.');

export function calc(ip: string, prefix: number) {
  const a = ipToInt(ip); if (a == null || prefix < 0 || prefix > 32) return null;
  const mask = maskOf(prefix); const net = (a & mask) >>> 0; const bc = (net | (~mask >>> 0)) >>> 0;
  const size = 2 ** (32 - prefix);
  const hosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : size - 2;
  const first = prefix >= 31 ? net : net + 1; const last = prefix >= 31 ? bc : bc - 1;
  const o1 = a >>> 24;
  const cls = o1 < 128 ? 'A' : o1 < 192 ? 'B' : o1 < 224 ? 'C' : o1 < 240 ? 'D (multicast)' : 'E (rezervat)';
  const priv = (o1 === 10) || (o1 === 172 && ((a >>> 16) & 255) >= 16 && ((a >>> 16) & 255) <= 31) || (o1 === 192 && ((a >>> 16) & 255) === 168);
  // octetul „interesant” și block size
  const bits = prefix % 8;
  const interestingOctet = bits ? Math.floor(prefix / 8) + 1 : null; // 1-based
  const block = bits ? 2 ** (8 - bits) : null;
  return { ip: intToIp(a), prefix, mask: intToIp(mask), wildcard: intToIp(~mask >>> 0), network: intToIp(net), broadcast: intToIp(bc),
    first: intToIp(first), last: intToIp(last), hosts, size, cls, priv, ipBin: toBin(a), maskBin: toBin(mask), netBin: toBin(net), interestingOctet, block };
}

/** Exerciții generate: prefix între /17 și /30, IP aleatoriu privat. */
export function randomTask() {
  const base = [[10, Math.floor(Math.random() * 256)], [172, 16 + Math.floor(Math.random() * 16)], [192, 168]][Math.floor(Math.random() * 3)];
  const ip = `${base[0]}.${base[1]}.${Math.floor(Math.random() * 256)}.${1 + Math.floor(Math.random() * 254)}`;
  const prefix = 17 + Math.floor(Math.random() * 14);
  return { ip, prefix };
}

// ---------- IPv6 ----------
export function expand6(addr: string): string | null {
  let s = addr.trim().toLowerCase().split('/')[0];
  if (!/^[0-9a-f:]+$/.test(s) || (s.match(/::/g)?.length ?? 0) > 1) return null;
  const [l, r] = s.includes('::') ? s.split('::') : [s, null];
  const L = l ? l.split(':') : []; const R = r != null && r !== '' ? r.split(':') : [];
  const fill = r != null ? 8 - L.length - R.length : 0;
  if (fill < 0) return null;
  const parts = [...L, ...Array(fill).fill('0'), ...R];
  if (parts.length !== 8 || parts.some((p) => p.length === 0 || p.length > 4)) return null;
  return parts.map((p) => p.padStart(4, '0')).join(':');
}
export function compress6(full: string) {
  const parts = full.split(':').map((p) => p.replace(/^0+(?=.)/, ''));
  let best = -1, bestLen = 0;
  for (let i = 0; i < 8;) { if (parts[i] === '0') { let j = i; while (j < 8 && parts[j] === '0') j++; if (j - i > bestLen && j - i > 1) { best = i; bestLen = j - i; } i = j; } else i++; }
  if (best < 0) return parts.join(':');
  const left = parts.slice(0, best).join(':'); const right = parts.slice(best + bestLen).join(':');
  return `${left}::${right}`;
}
export function type6(full: string) {
  const h = parseInt(full.slice(0, 4), 16);
  if (full === '0000:0000:0000:0000:0000:0000:0000:0001') return 'Loopback (::1)';
  if (full === '0000:0000:0000:0000:0000:0000:0000:0000') return 'Unspecified (::)';
  if ((h & 0xffc0) === 0xfe80) return 'Link-local unicast (fe80::/10)';
  if ((h & 0xfe00) === 0xfc00) return 'Unique local unicast (fc00::/7)';
  if ((h & 0xff00) === 0xff00) return 'Multicast (ff00::/8)';
  if ((h & 0xe000) === 0x2000) return 'Global unicast (2000::/3)';
  return 'Altul / rezervat';
}
export function prefix6(full: string, prefix: number) {
  const bits = full.replace(/:/g, '').split('').map((c) => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
  const masked = bits.slice(0, prefix).padEnd(128, '0');
  const hex = masked.match(/.{4}/g)!.map((b) => parseInt(b, 2).toString(16)).join('');
  return hex.match(/.{4}/g)!.join(':');
}
