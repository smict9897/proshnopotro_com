import { db } from "@/lib/db";

export async function popularTags(limit = 12): Promise<[string, number][]> {
  const rows = await db.post.findMany({ where: { published: true }, select: { tags: true }, orderBy: { createdAt: "desc" }, take: 500 }).catch(() => []);
  const count = new Map<string, number>();
  for (const r of rows) for (const t of r.tags) count.set(t, (count.get(t) ?? 0) + 1);
  return Array.from(count.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit);
}
