import { addTestimonial } from "@/app/actions/manage";
const f = "rounded-md border border-slate-300 p-2";
export default function Page() {
  return (<main className="mx-auto max-w-xl px-4 py-10"><h1 className="mb-1 text-2xl font-bold">Add testimonial</h1>
    <p className="mb-4 text-sm text-slate-600">Add only feedback a student actually gave you, with their permission.</p>
    <form action={addTestimonial} className="grid gap-3"><input name="name" required className={f} placeholder="Student name" />
      <input name="role" className={f} placeholder="Class or result (optional)" />
      <textarea name="quote" required minLength={10} rows={4} className={f} placeholder="Their words" />
      <button className="rounded-md bg-royal px-4 py-2 text-white">Add testimonial</button></form></main>);
}
