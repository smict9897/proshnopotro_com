const CHARS = "[\\p{L}\\p{M}\\p{N}_-]";
const ONE = new RegExp(`^${CHARS}{1,40}$`, "u");
const IN_TEXT = new RegExp(`(?:^|[\\s(])#(${CHARS}{1,40})`, "gu");

export function normalizeTag(raw: string): string | null {
  const t = raw.replace(/^#+/, "").trim().toLowerCase();
  return ONE.test(t) ? t : null;
}

// Tags typed in the tag box (with or without #), plus any #hashtags written inside the post text.
export function parseTags(input: string, text = ""): string[] {
  const out: string[] = [];
  const add = (r: string) => { const t = normalizeTag(r); if (t && !out.includes(t)) out.push(t); };
  input.split(/[\s,،]+/).forEach(add);
  for (const m of text.matchAll(IN_TEXT)) add(m[1]);
  return out.slice(0, 15);
}
