type Props = { kw: string; title: string; slug: string; metaTitle: string; metaDescription: string; text: string; headings: string[]; words: number };

export default function SeoPanel({ kw, title, slug, metaTitle, metaDescription, text, headings, words }: Props) {
  const k = kw.trim().toLowerCase();
  const has = (s: string) => !!k && s.toLowerCase().includes(k);
  const first100 = text.split(" ").slice(0, 100).join(" ");
  const tl = (metaTitle || title).length;
  const dl = metaDescription.length;
  const slugOk = /^[a-z0-9 -]+$/i.test(k) ? slug.includes(k.replace(/\s+/g, "-")) : slug.length > 0;
  const used = k ? text.toLowerCase().split(k).length - 1 : 0;
  const checks: [boolean, string][] = [
    [!!k, "ফোকাস কীওয়ার্ড দেওয়া হয়েছে"],
    [has(metaTitle || title), "কীওয়ার্ড শিরোনামে আছে"],
    [has(metaDescription), "কীওয়ার্ড মেটা বিবরণে আছে"],
    [!!k && slugOk, "কীওয়ার্ড URL এ আছে"],
    [has(first100), "প্রথম ১০০ শব্দের মধ্যে কীওয়ার্ড আছে"],
    [headings.some(has), "কোনো হেডিংয়ে কীওয়ার্ড আছে"],
    [tl >= 30 && tl <= 60, `মেটা টাইটেল ৩০ থেকে ৬০ অক্ষর (এখন ${tl})`],
    [dl >= 120 && dl <= 160, `মেটা বিবরণ ১২০ থেকে ১৬০ অক্ষর (এখন ${dl})`],
    [words >= 300, `কমপক্ষে ৩০০ শব্দ (এখন ${words})`],
  ];
  const score = checks.filter(([ok]) => ok).length;
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3" aria-live="polite">
      <p className="text-sm font-semibold">SEO পরীক্ষা: {score}/{checks.length}</p>
      <ul className="mt-2 grid gap-1 text-sm">
        {checks.map(([ok, label]) => (
          <li key={label} className={ok ? "text-green-700" : "text-slate-600"}>{ok ? "✓" : "○"} {label}</li>
        ))}
      </ul>
      {k && <p className="mt-2 text-xs text-slate-500">কীওয়ার্ড লেখায় {used} বার এসেছে। জোর করে বারবার বসাবেন না, স্বাভাবিক ভাবে লিখুন।</p>}
      <p className="mt-2 text-xs text-slate-500">এটা সাহায্যকারী নির্দেশিকা মাত্র। এগুলো মিললেই গুগলে র‍্যাংক নিশ্চিত হয় না।</p>
    </div>
  );
}
