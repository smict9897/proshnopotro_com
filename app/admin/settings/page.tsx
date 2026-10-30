import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSite } from "@/lib/site";
import { saveSettings } from "@/app/actions/admin";
export const dynamic = "force-dynamic";
const f = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2";

export default async function Page() {
  if ((await auth())?.user?.role !== "ADMIN") redirect("/admin");
  const s = await getSite();
  return (
    <form action={saveSettings} className="grid gap-5">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Site settings</h1>
        <p className="mb-4 text-sm text-slate-500">Leave a link empty to hide that icon from the website footer.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {s.social.map((x) => (
            <label key={x.name} className="text-sm font-medium">{x.name}
              <input name={`social.${x.name}`} defaultValue={x.url} type="url" placeholder="https://" className={`${f} mt-1 font-normal`} />
            </label>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Contact</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">Email<input name="contact.email" defaultValue={s.contact.email} className={`${f} mt-1 font-normal`} /></label>
          <label className="text-sm font-medium">Phone<input name="contact.phone" defaultValue={s.contact.phone} className={`${f} mt-1 font-normal`} /></label>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Homepage and footer text</h2>
        <div className="grid gap-3">
          <label className="text-sm font-medium">Badge above the heading<input name="hero.badge" defaultValue={s.heroBadge} maxLength={60} className={`${f} mt-1 font-normal`} /></label>
          <label className="text-sm font-medium">Main heading<input name="hero.title" defaultValue={s.heroTitle} maxLength={160} className={`${f} mt-1 font-normal`} /></label>
          <label className="text-sm font-medium">Sub heading<textarea name="hero.subtitle" defaultValue={s.heroSubtitle} maxLength={300} rows={2} className={`${f} mt-1 font-normal`} /></label>
          <label className="text-sm font-medium">Footer text<textarea name="footer.text" defaultValue={s.footerText} maxLength={400} rows={3} className={`${f} mt-1 font-normal`} /></label>
          <label className="text-sm font-medium">Default Google description (up to 160 characters)<textarea name="meta.description" defaultValue={s.metaDescription} maxLength={170} rows={2} className={`${f} mt-1 font-normal`} /></label>
        </div>
      </div>
      <button className="rounded-xl bg-royal px-4 py-3 font-semibold text-white">Save settings</button>
    </form>
  );
}
