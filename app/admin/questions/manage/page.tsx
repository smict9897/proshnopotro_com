import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { buildWhere } from "./where";
import { approveMany, deleteMany, deleteOne, toggleOne } from "./actions";

export const dynamic = "force-dynamic";

const PER_PAGE = 30;
const BASE = "/admin/questions/manage";
const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-700";

type SP = {
  category?: string; subject?: string; topic?: string; status?: string; q?: string;
  page?: string; ok?: string; err?: string;
};
type Stat = { category: string; subject: string; topic: string; total: number; pending: number };

const uniq = (a: string[]) => Array.from(new Set(a.filter(Boolean))).sort((x, y) => x.localeCompare(y));
function qs(o: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function ManageQuestions({ searchParams }: { searchParams: Promise<SP> }) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN") redirect("/");

  const sp = await searchParams;
  const f = {
    category: sp.category?.trim() || undefined,
    subject: sp.subject?.trim() || undefined,
    topic: sp.topic?.trim() || undefined,
    status: sp.status?.trim() || undefined,
    q: sp.q?.trim() || undefined,
  };
  const page = Math.max(1, Number(sp.page) || 1);
  const where = buildWhere(f);
  const hasFilter = !!(f.category || f.subject || f.topic || f.status || f.q);

  const [grp, total, pendingInFilter, rows] = await Promise.all([
    db.question.groupBy({ by: ["category", "subject", "topic", "approved"], _count: { _all: true } }),
    db.question.count({ where }),
    db.question.count({ where: { AND: [where, { approved: false }] } }),
    db.question.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const map = new Map<string, Stat>();
  for (const g of grp) {
    const category = g.category ?? "";
    const subject = g.subject ?? "";
    const topic = g.topic ?? "";
    const key = `${category}\u0000${subject}\u0000${topic}`;
    const s = map.get(key) ?? { category, subject, topic, total: 0, pending: 0 };
    s.total += g._count._all;
    if (!g.approved) s.pending += g._count._all;
    map.set(key, s);
  }
  const stats = Array.from(map.values()).sort(
    (a, b) => a.category.localeCompare(b.category) || a.subject.localeCompare(b.subject) || a.topic.localeCompare(b.topic),
  );
  const totalAll = stats.reduce((n, s) => n + s.total, 0);
  const pendingAll = stats.reduce((n, s) => n + s.pending, 0);

  const categories = uniq(stats.map((s) => s.category));
  const subjects = uniq(stats.filter((s) => !f.category || s.category === f.category).map((s) => s.subject));
  const topics = uniq(
    stats.filter((s) => (!f.category || s.category === f.category) && (!f.subject || s.subject === f.subject)).map((s) => s.topic),
  );

  const back = `${BASE}${qs({ ...f, page: page > 1 ? String(page) : undefined })}`;
  const hidden = (
    <>
      <input type="hidden" name="category" value={f.category ?? ""} />
      <input type="hidden" name="subject" value={f.subject ?? ""} />
      <input type="hidden" name="topic" value={f.topic ?? ""} />
      <input type="hidden" name="status" value={f.status ?? ""} />
      <input type="hidden" name="q" value={f.q ?? ""} />
    </>
  );

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Link href="/admin/questions" className="text-sm text-blue-600">‹ প্রশ্ন ব্যাংক</Link>
        <h1 className="mt-1 text-2xl font-bold">প্রশ্ন ম্যানেজ করুন</h1>
      </div>

      {sp.err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{sp.err}</p>}
      {sp.ok && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{sp.ok}</p>}

      <section className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-2xl font-bold">{totalAll}</p>
          <p className="text-xs text-slate-500">মোট প্রশ্ন</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-2xl font-bold text-green-600">{totalAll - pendingAll}</p>
          <p className="text-xs text-slate-500">অনুমোদিত</p>
        </div>
        <Link href={`${BASE}?status=pending`} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-2xl font-bold text-amber-600">{pendingAll}</p>
          <p className="text-xs text-slate-500">অপেক্ষমাণ</p>
        </Link>
      </section>

      <details className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <summary className="cursor-pointer font-semibold">ক্লাস › বিষয় › অধ্যায় অনুযায়ী সংখ্যা ({stats.length} টি অধ্যায়)</summary>
        <ul className="mt-3 divide-y divide-slate-200 text-sm dark:divide-slate-700">
          {stats.map((s) => (
            <li key={`${s.category}|${s.subject}|${s.topic}`}>
              <Link
                href={`${BASE}${qs({ category: s.category, subject: s.subject, topic: s.topic })}`}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span>{s.category} › {s.subject} › {s.topic || "—"}</span>
                <span className="shrink-0 text-xs text-slate-500">
                  {s.total} টি{s.pending > 0 && <b className="ml-1 text-amber-600">({s.pending} অপেক্ষমাণ)</b>}
                </span>
              </Link>
            </li>
          ))}
          {stats.length === 0 && <li className="py-2 text-slate-500">এখনো কোনো প্রশ্ন নেই।</li>}
        </ul>
      </details>

      <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <h2 className="mb-3 font-semibold">খুঁজুন ও ফিল্টার করুন</h2>
        <form action={BASE} method="get" className="grid gap-2 sm:grid-cols-2">
          <select name="category" defaultValue={f.category ?? ""} className={input}>
            <option value="">সব ক্লাস</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="subject" defaultValue={f.subject ?? ""} className={input}>
            <option value="">সব বিষয়</option>
            {subjects.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="topic" defaultValue={f.topic ?? ""} className={input}>
            <option value="">সব অধ্যায়</option>
            {topics.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="status" defaultValue={f.status ?? ""} className={input}>
            <option value="">সব অবস্থা</option>
            <option value="approved">অনুমোদিত</option>
            <option value="pending">অপেক্ষমাণ</option>
          </select>
          <input name="q" defaultValue={f.q ?? ""} placeholder="প্রশ্নের লেখায় খুঁজুন" className={`${input} sm:col-span-2`} />
          <div className="flex gap-2 sm:col-span-2">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">ফিল্টার করুন</button>
            {hasFilter && <Link href={BASE} className="rounded-lg border px-4 py-2 text-sm">ফিল্টার মুছুন</Link>}
          </div>
        </form>
        <p className="mt-2 text-xs text-slate-500">ক্লাস বাছার পর "ফিল্টার করুন" চাপলে বিষয়ের তালিকা সেই ক্লাসের হয়ে যাবে, বিষয় বাছার পর অধ্যায়ের তালিকাও।</p>
      </section>

      {hasFilter && total > 0 && (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-slate-900">
          <p className="font-semibold">এই ফিল্টারে {total} টি প্রশ্ন আছে ({pendingInFilter} টি অপেক্ষমাণ)</p>
          <div className="mt-3 flex flex-wrap items-start gap-3">
            {pendingInFilter > 0 && (
              <form action={approveMany.bind(null, back)}>
                {hidden}
                <button className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white">
                  অপেক্ষমাণ {pendingInFilter} টি সব অনুমোদন দিন
                </button>
              </form>
            )}
            {role === "ADMIN" && (
              <form action={deleteMany.bind(null, back)} className="flex flex-wrap items-center gap-2">
                {hidden}
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" name="confirm" value="yes" required /> আমি নিশ্চিত
                </label>
                <button className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                  এই {total} টি সব মুছুন
                </button>
              </form>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-600">মোছা প্রশ্ন আর ফেরানো যায় না। সংরক্ষিত প্রশ্নপত্রে ওই প্রশ্ন থাকলে সেখান থেকেও বাদ পড়বে।</p>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-semibold">প্রশ্ন ({total})</h2>
        <ul className="space-y-3">
          {rows.map((q) => {
            const o = (q.options ?? {}) as Record<string, string>;
            return (
              <li key={q.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                <p className="font-medium">{q.text}</p>
                {["A", "B", "C", "D"].some((k) => o[k]) && (
                  <p className="mt-1 grid gap-0.5 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                    {["A", "B", "C", "D"].map((k) => (
                      <span key={k} className={k === q.correct ? "font-bold text-green-700" : ""}>{k}. {o[k]}</span>
                    ))}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {q.category} · {q.subject} · {q.topic} · {q.source} · {q.approved ? "অনুমোদিত" : "অপেক্ষমাণ"}
                </p>
                <div className="mt-2 flex gap-2">
                  <form action={toggleOne.bind(null, q.id, back)}>
                    <button className="rounded border px-2 py-1 text-xs">{q.approved ? "অনুমোদন তুলুন" : "অনুমোদন দিন"}</button>
                  </form>
                  <form action={deleteOne.bind(null, q.id, back)}>
                    <button className="rounded border border-red-300 px-2 py-1 text-xs text-red-600">মুছুন</button>
                  </form>
                </div>
              </li>
            );
          })}
          {rows.length === 0 && <li className="rounded-xl border p-4 text-sm text-slate-500">কোনো প্রশ্ন পাওয়া যায়নি।</li>}
        </ul>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          {page > 1 && <Link href={`${BASE}${qs({ ...f, page: String(page - 1) })}`}>‹ Prev</Link>}
          <span>{page} / {pages}</span>
          {page < pages && <Link href={`${BASE}${qs({ ...f, page: String(page + 1) })}`}>Next ›</Link>}
        </div>
      </section>
    </main>
  );
}
