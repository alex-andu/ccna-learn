// Atribuirile foto: attribution.json (1.11) + attribution.<topic>.json pentru fiecare topic nou.
export type Attr = { title: string; author: string; license: string; licenseUrl: string; source: string };
const files = import.meta.glob('../../public/img/wiki/attribution*.json', { eager: true, import: 'default' }) as Record<string, Record<string, Attr>>;
export const ATTRIBUTION: Record<string, Attr> = Object.assign({}, ...Object.keys(files).sort().map((k) => files[k]));
