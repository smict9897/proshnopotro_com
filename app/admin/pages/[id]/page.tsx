import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { savePage } from "@/app/actions/admin";
export const dynamic = "force-dynamic";
const f = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await db.page.findUnique({ where: { id: (await params).id } });
  if (!p) notFound();
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <Link href="/admin/pages" className="text-sm text-royal">← Back to pages</Link>
      <h1 className="mb-4 mt-2 text-2xl font-bold">Edit page</h1>
      <form action={savePage.bind(null, p.id)} className="grid gap-3">
        <input name="title" required defaultValue={p.title} className={f} />
        <input name="slug" required defaultValue={p.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={f} />
        <textarea name="body" required minLength={10} rows={14} defaultValue={p.body} className={f} />
        <button className="rounded-xl bg-royal px-4 py-2.5 font-semibold text-white">Save changes</button>
      </form>
    </div>
  );
}
