"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { buildWhere, type Filter } from "./where";

const BASE = "/admin/questions/manage";

async function roleOf() {
  return (await auth())?.user?.role ?? null;
}
const isStaff = (r: string | null) => r === "ADMIN";

function go(back: string, key: "ok" | "err", msg: string): never {
  const safe = back.startsWith(BASE) ? back : BASE;
  const u = new URL(safe, "https://x.local");
  u.searchParams.delete("ok");
  u.searchParams.delete("err");
  u.searchParams.set(key, msg);
  redirect(u.pathname + u.search);
}

function filterOf(fd: FormData): Filter {
  const g = (k: string) => String(fd.get(k) ?? "").trim() || undefined;
  return { category: g("category"), subject: g("subject"), topic: g("topic"), status: g("status"), q: g("q") };
}

export async function toggleOne(id: string, back: string): Promise<void> {
  if (!isStaff(await roleOf())) go(back, "err", "অনুমতি নেই।");
  try {
    const q = await db.question.findUnique({ where: { id }, select: { approved: true } });
    if (!q) throw new Error("not found");
    await db.question.update({ where: { id }, data: { approved: !q.approved } });
  } catch {
    go(back, "err", "বদলানো যায়নি। আবার চেষ্টা করুন।");
  }
  revalidatePath(BASE);
  go(back, "ok", "বদলানো হয়েছে।");
}

export async function deleteOne(id: string, back: string): Promise<void> {
  if (!isStaff(await roleOf())) go(back, "err", "অনুমতি নেই।");
  try {
    await db.question.delete({ where: { id } });
  } catch {
    go(back, "err", "মোছা যায়নি। আবার চেষ্টা করুন।");
  }
  revalidatePath(BASE);
  go(back, "ok", "প্রশ্নটি মোছা হয়েছে।");
}

export async function approveMany(back: string, fd: FormData): Promise<void> {
  if (!isStaff(await roleOf())) go(back, "err", "অনুমতি নেই।");
  let n = 0;
  try {
    const r = await db.question.updateMany({
      where: { AND: [buildWhere(filterOf(fd)), { approved: false }] },
      data: { approved: true },
    });
    n = r.count;
  } catch {
    go(back, "err", "অনুমোদন দেওয়া যায়নি।");
  }
  revalidatePath(BASE);
  go(back, "ok", `${n} টি প্রশ্ন অনুমোদিত হয়েছে।`);
}

export async function deleteMany(back: string, fd: FormData): Promise<void> {
  if ((await roleOf()) !== "ADMIN") go(back, "err", "একসাথে মুছতে শুধু অ্যাডমিন পারবেন।");
  if (String(fd.get("confirm") ?? "") !== "yes") go(back, "err", "মোছার আগে নিশ্চিত করার টিক দিন।");
  const f = filterOf(fd);
  if (!f.category && !f.subject && !f.topic && !f.status && !f.q)
    go(back, "err", "ফিল্টার ছাড়া সব প্রশ্ন মোছা যাবে না। আগে ফিল্টার দিন।");
  let n = 0;
  try {
    const r = await db.question.deleteMany({ where: buildWhere(f) });
    n = r.count;
  } catch {
    go(back, "err", "মোছা যায়নি।");
  }
  revalidatePath(BASE);
  go(back, "ok", `${n} টি প্রশ্ন মোছা হয়েছে।`);
}

