import { addJob } from "@/app/actions/content";
const f = "rounded-md border border-slate-300 p-2";
export default function Page() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold">Publish job circular</h1>
      <form action={addJob} className="grid gap-3">
        <input name="title" required className={f} placeholder="Title" />
        <input name="org" required className={f} placeholder="Organization" />
        <select name="type" className={f}><option>Govt</option><option>NTRCA</option><option>Primary</option><option>Bank</option><option>Private</option></select>
        <input name="deadline" type="date" className={f} />
        <input name="url" type="url" className={f} placeholder="Circular link (optional)" />
        <button className="rounded-md bg-royal px-4 py-2 text-white">Publish circular</button>
      </form>
    </main>
  );
}
