"use client";
import { useState } from "react";
import { Printer } from "lucide-react";

const fields = [
  ["university", "বিশ্ববিদ্যালয় / প্রতিষ্ঠানের নাম"], ["dept", "বিভাগ"], ["title", "অ্যাসাইনমেন্টের শিরোনাম"], ["course", "কোর্সের নাম"], ["code", "কোর্স কোড"],
  ["teacher", "শিক্ষকের নাম ও পদবি"], ["student", "শিক্ষার্থীর নাম"], ["id", "আইডি / রোল"], ["session", "সেমিস্টার / সেশন"], ["date", "জমা দেওয়ার তারিখ"],
] as const;
type K = (typeof fields)[number][0];
const f = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

export default function CoverPage() {
  const [v, setV] = useState<Record<K, string>>({ university: "", dept: "", title: "", course: "", code: "", teacher: "", student: "", id: "", session: "", date: "" });
  const row = (label: string, val: string) => (
    <p className="mt-2"><span className="font-semibold">{label}: </span>{val || <span className="text-slate-400">…………</span>}</p>
  );
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
        {fields.map(([k, l]) => (
          <label key={k} className="text-sm font-medium">{l}
            <input value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} className={`${f} mt-1 font-normal`} />
          </label>
        ))}
        <button type="button" onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-royal px-4 py-3 font-semibold text-white"><Printer size={18} />প্রিন্ট বা PDF করুন</button>
        <p className="text-xs text-slate-500">প্রিন্টের জানালায় "Save as PDF" বেছে নিলে PDF হবে।</p>
      </form>
      <div id="print-area" className="mx-auto aspect-[210/297] w-full max-w-md rounded-sm border-4 border-double border-slate-700 bg-white p-8 text-center text-black shadow">
        <p className="text-xl font-bold">{v.university || "বিশ্ববিদ্যালয় / প্রতিষ্ঠানের নাম"}</p>
        {v.dept && <p className="mt-1">{v.dept}</p>}
        <p className="mt-10 text-sm uppercase tracking-widest">অ্যাসাইনমেন্ট</p>
        <p className="mt-2 text-2xl font-bold">{v.title || "অ্যাসাইনমেন্টের শিরোনাম"}</p>
        <div className="mt-10 text-left text-sm">
          {row("কোর্সের নাম", v.course)}{row("কোর্স কোড", v.code)}{row("সেমিস্টার / সেশন", v.session)}
          <hr className="my-5 border-slate-400" />
          <p className="font-bold">জমা দিয়েছেন</p>{row("নাম", v.student)}{row("আইডি / রোল", v.id)}
          <p className="mt-5 font-bold">জমা নিয়েছেন</p>{row("শিক্ষক", v.teacher)}
          {row("জমা দেওয়ার তারিখ", v.date)}
        </div>
      </div>
    </div>
  );
}
