export type SavedItem = { id: string; type: "post" | "resource"; title: string; href: string };

const KEY = "saved";
const EVT = "saved-change";

function valid(x: unknown): x is SavedItem {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  return typeof s.id === "string" && (s.type === "post" || s.type === "resource") && typeof s.title === "string" && typeof s.href === "string" && s.href.startsWith("/");
}

export function parseSaved(raw: string): SavedItem[] {
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v) ? v.filter(valid) : [];
  } catch {
    return [];
  }
}

export function subscribeSaved(cb: () => void): () => void {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
}

export function getSavedRaw(): string {
  try { return localStorage.getItem(KEY) ?? "[]"; } catch { return "[]"; }
}
export const getServerSaved = () => "[]";

function write(items: SavedItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, 200))); } catch {}
  window.dispatchEvent(new Event(EVT));
}

export function toggleSaved(item: SavedItem) {
  const cur = parseSaved(getSavedRaw());
  const has = cur.some((s) => s.id === item.id && s.type === item.type);
  write(has ? cur.filter((s) => !(s.id === item.id && s.type === item.type)) : [item, ...cur]);
}

export function removeSaved(item: SavedItem) {
  write(parseSaved(getSavedRaw()).filter((s) => !(s.id === item.id && s.type === item.type)));
}
