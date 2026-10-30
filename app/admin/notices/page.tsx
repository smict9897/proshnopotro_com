import { db } from "@/lib/db";
import { addNotice } from "@/app/actions/content";
import { deleteNotice, setNotice } from "@/app/actions/admin";
export const dynamic = "force-dynamic";

export default async function Page() {
  const notices = await db.notice.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  const shown = notices.find((n) => n.active)?.id;
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Notices</h1>
        <p className="mb-4 text-sm text-slate-500">The newest active notice appears in the bar at the top of the site.</p>
        <form action={addNotice} className="grid gap-3">
          <textarea name="text" required minLength={3} maxLength={300} className="rounded-xl border border-slate-300 p-2" placeholder="Notice text" />
          <button className="rounded-xl bg-royal px-4 py-2.5 font-semibold text-white">Publish notice</button>
        </form>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {notices.length === 0 && <p className="text-slate-600">No notices yet.</p>}
        <ul className="grid gap-2">
          {notices.map((n) => (
            <li key={n.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 p-3">
              <p className="min-w-0 flex-1 text-sm">{n.id === shown && <span className="mr-2 rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">SHOWING</span>}{n.text}</p>
              <form action={setNotice.bind(null, n.id, !n.active)}><button className="rounded-lg border border-slate-300 px-3 py-1 text-sm">{n.active ? "Turn off" : "Turn on"}</button></form>
              <form action={deleteNotice.bind(null, n.id)}><button className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700">Delete</button></form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
