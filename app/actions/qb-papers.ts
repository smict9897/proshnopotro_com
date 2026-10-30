"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const PREFIX = "qbpaper:";

async function isStaff() {
  const s = await auth();
  const role = s?.user?.role;
  return role === "ADMIN" || role === "TEACHER";
}

const Save = z.object({
  name: z.string().trim().min(1).max(120),
  ids: z.array(z.string()).min(1).max(300),
  settings: z.unknown(),
});

export type SavedPaper = {
  key: string; name: string; count: number; createdAt: string;
  ids: string[]; settings: unknown;
};

export async function savePaper(raw: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await isStaff())) return { ok: false, error: "অ্যাডমিন বা শিক্ষক হিসেবে লগইন করুন।" };
  const p = Save.safeParse(raw);
  if (!p.success) return { ok: false, error: "নাম দিন এবং কমপক্ষে একটি প্রশ্ন রাখুন।" };
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  try {
    await db.setting.create({
      data: {
        key: PREFIX + id,
        value: JSON.stringify({
          name: p.data.name,
          ids: p.data.ids,
          settings: p.data.settings ?? null,
          createdAt: new Date().toISOString(),
        }),
      },
    });
  } catch (e) {
    console.error("savePaper failed:", e);
    return { ok: false, error: "সেভ হয়নি। আবার চেষ্টা করুন।" };
  }
  revalidatePath("/question-builder/saved");
  return { ok: true };
}

export async function listPapers(): Promise<SavedPaper[]> {
  if (!(await isStaff())) return [];
  const rows = await db.setting.findMany({ where: { key: { startsWith: PREFIX } } }).catch(() => []);
  const out: SavedPaper[] = [];
  for (const r of rows) {
    try {
      const o = JSON.parse(r.value) as { name?: string; ids?: string[]; settings?: unknown; createdAt?: string };
      if (!o.name || !Array.isArray(o.ids)) continue;
      out.push({
        key: r.key, name: o.name, count: o.ids.length,
        createdAt: o.createdAt ?? "", ids: o.ids, settings: o.settings ?? null,
      });
    } catch {}
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deletePaper(key: string): Promise<void> {
  if (!(await isStaff())) return;
  if (!key.startsWith(PREFIX)) return;
  try {
    await db.setting.delete({ where: { key } });
  } catch (e) {
    console.error("deletePaper failed:", e);
  }
  revalidatePath("/question-builder/saved");
}
