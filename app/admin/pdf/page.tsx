import { addResource } from "@/app/actions/resources";
const f = "rounded-md border border-slate-300 p-2";
export default function Page() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold">Add material</h1>
      <form action={addResource} className="grid gap-3">
        <input name="title" required className={f} placeholder="Title" />
        <select name="category" className={f}><option>Academic</option><option>Admission</option><option>NTRCA</option><option>Library</option><option>Video</option></select>
        <input name="price" type="number" min={0} defaultValue={0} className={f} aria-label="Price in BDT (0 is free)" />
        <input name="file" type="file" accept="application/pdf" className={f} />
        <input name="link" type="url" className={f} placeholder="Or a link (YouTube link for videos, or a PDF over 4 MB)" />
        <button className="rounded-md bg-royal px-4 py-2 text-white">Save material</button>
      </form>
    </main>
  );
}
