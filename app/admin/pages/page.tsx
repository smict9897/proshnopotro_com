import Link from "next/link";
import { db } from "@/lib/db";
import { deletePage, savePage } from "@/app/actions/admin";
export const dynamic = "force-dynamic";
const f = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2";

export default async function Page() {
  const pages = await db.page.findMany({ orderBy: { title: "asc" } });
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Pages</h1>
        <p className="mb-4 text-sm text-slate-500">Make pages like About us or Contact. They open at /p/your-slug and are listed in the footer.</p>
        <form action={savePage.bind(null, null)} className="grid gap-3">
          <input name="title" required placeholder="Title, e.g. আমাদের সম্পর্কে" className={f} />
          <input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="URL slug, e.g. about" className={f} />
          <textarea name="body" required minLength={10} rows={8} placeholder="Text. Blank line between paragraphs. ## Heading" className={f} />
          <button className="rounded-xl bg-royal px-4 py-2.5 font-semibold text-white">Create page</button>
        </form>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {pages.length === 0 && <p className="text-slate-600">No pages yet.</p>}
        <ul className="grid gap-2">
          {pages.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 p-3">
              <span className="min-w-0 flex-1 truncate">{p.title} <span className="text-xs text-slate-500">/p/{p.slug}</span></span>
              <Link href={`/p/${p.slug}`} className="text-sm text-royal">View</Link>
              <Link href={`/admin/pages/${p.id}`} className="rounded-lg bg-royal px-3 py-1 text-sm text-white">Edit</Link>
              <form action={deletePage.bind(null, p.id)}><button className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700">Delete</button></form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
