import { db } from "@/lib/db";
import { addCategory, deleteCategory } from "@/app/actions/posts";
import { renameCategory } from "@/app/actions/admin";
export const dynamic = "force-dynamic";
const f = "rounded-xl border border-slate-300 bg-white px-3 py-2";

export default async function Page() {
  const cats = await db.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } });
  const names = new Map(cats.map((c) => [c.id, c.name]));
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">Categories</h1>
        <form action={addCategory} className="grid gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="Name, e.g. ৮ম শ্রেণি" className={f} />
          <input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="URL slug, e.g. class-8" className={f} />
          <select name="parentId" className={`${f} sm:col-span-2`}>
            <option value="">No parent (top level)</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="rounded-xl bg-royal px-4 py-2.5 font-semibold text-white sm:col-span-2">Add category</button>
        </form>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {cats.length === 0 && <p className="text-slate-600">No categories yet.</p>}
        <ul className="grid gap-2">
          {cats.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 p-3">
              <form action={renameCategory.bind(null, c.id)} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <input name="name" defaultValue={c.name} aria-label="Name" className={`${f} min-w-0 flex-1 py-1`} />
                <button className="rounded-lg bg-royal px-3 py-1 text-sm text-white">Rename</button>
              </form>
              <span className="text-xs text-slate-500">{c.parentId ? `in ${names.get(c.parentId)} · ` : ""}/{c.slug} · {c._count.posts} posts</span>
              <form action={deleteCategory.bind(null, c.id)}><button className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700">Delete</button></form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
