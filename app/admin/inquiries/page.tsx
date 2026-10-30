import { db } from "@/lib/db";
import { deleteInquiry } from "@/app/actions/admin";
export const dynamic = "force-dynamic";

export default async function Page() {
  const list = await db.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Hire Me inquiries ({list.length})</h1>
      {list.length === 0 && <p className="text-slate-600">No inquiries yet.</p>}
      <ul className="grid gap-3">
        {list.map((i) => (
          <li key={i.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-semibold">{i.name} · <a className="text-royal" href={`mailto:${i.email}`}>{i.email}</a></p>
              <form action={deleteInquiry.bind(null, i.id)}><button className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700">Delete</button></form>
            </div>
            <p className="text-xs text-slate-500">{i.createdAt.toLocaleString("en-GB")}{i.budget && ` · Budget: ${i.budget}`}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{i.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
