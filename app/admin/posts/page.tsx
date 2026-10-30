import Link from "next/link";
import { db } from "@/lib/db";
import { deletePost } from "@/app/actions/posts";
export const dynamic = "force-dynamic";

export default async function Posts() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } });
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Posts ({posts.length})</h1>
        <Link href="/admin/blog" className="rounded-xl bg-royal px-4 py-2 text-sm font-semibold text-white">New post</Link>
      </div>
      {posts.length === 0 && <p className="mt-4 text-slate-600">No posts yet.</p>}
      <ul className="mt-4 grid gap-2">
        {posts.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {!p.published && <span className="mr-2 rounded bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">DRAFT</span>}{p.title}
              </p>
              <p className="text-xs text-slate-500">
                {p.category?.name ?? "No category"} · {p.createdAt.toLocaleDateString("en-GB")}
                {!p.metaDescription && " · missing meta description"}
                {p.coverUrl && !p.coverAlt && " · missing cover alt"}
              </p>
              {p.tags.length > 0 && <p className="truncate text-xs text-royal">{p.tags.map((t) => `#${t}`).join(" ")}</p>}
            </div>
            {p.published && <Link href={`/blog/${p.slug ?? p.id}`} className="text-sm text-royal">View</Link>}
            <Link href={`/admin/blog/${p.id}`} className="rounded-lg bg-royal px-3 py-1 text-sm text-white">Edit</Link>
            <form action={deletePost.bind(null, p.id)}><button className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700">Delete</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
