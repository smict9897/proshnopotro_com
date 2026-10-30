"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Row = { name: string; got: string; full: string; fourth: boolean };

const point = (p: number) => (p >= 80 ? 5 : p >= 70 ? 4 : p >= 60 ? 3.5 : p >= 50 ? 3 : p >= 40 ? 2 : p >= 33 ? 1 : 0);
const grade = (g: number) => (g >= 5 ? "A+" : g >= 4 ? "A" : g >= 3.5 ? "A-" : g >= 3 ? "B" : g >= 2 ? "C" : g >= 1 ? "D" : "F");
const mk = (name: string, fourth = false): Row => ({ name, got: "", full: "100", fourth });
const f = "w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm";

export default function GpaCalculator() {
  const [rows, setRows] = useState<Row[]>([1, 2, 3, 4, 5, 6].map((n) => mk(`বিষয় ${n}`)).concat(mk("৪র্থ বিষয়", true)));
  const set = (i: number, p: Partial<Row>) => setRows(rows.map((r, k) => (k === i ? { ...r, ...p } : r)));

  const filled = rows.filter((r) => r.got.trim() !== "");
  const bad = filled.some((r) => !(Number(r.full) > 0) || Number(r.got) < 0 || Number(r.got) > Number(r.full));
  const comp = filled.filter((r) => !r.fourth);
  const fourth = filled.find((r) => r.fourth);
  const pts = (r: Row) => point((Number(r.got) / Number(r.full)) * 100);

  let out: { gpa: number; failed: boolean } | null = null;
  if (!bad && comp.length > 0) {
    const failed = comp.some((r) => pts(r) === 0);
    const extra = fourth ? Math.max(0, pts(fourth) - 2) : 0;
    const sum = comp.reduce((s, r) => s + pts(r), 0) + extra;
    out = { failed, gpa: failed ? 0 : Math.min(5, sum / comp.length) };
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="hidden grid-cols-[1fr_90px_90px_70px_40px] gap-2 px-1 text-xs text-slate-500 sm:grid"><span>বিষয়</span><span>প্রাপ্ত নম্বর</span><span>পূর্ণমান</span><span>৪র্থ বিষয়</span><span /></div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-2 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-[1fr_90px_90px_70px_40px] sm:border-0 sm:p-0">
            <input value={r.name} onChange={(e) => set(i, { name: e.target.value })} aria-label="বিষয়" className={`${f} col-span-2 sm:col-span-1`} />
            <input value={r.got} onChange={(e) => set(i, { got: e.target.value })} inputMode="decimal" placeholder="নম্বর" aria-label="প্রাপ্ত নম্বর" className={f} />
            <input value={r.full} onChange={(e) => set(i, { full: e.target.value })} inputMode="decimal" aria-label="পূর্ণমান" className={f} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.fourth} onChange={(e) => set(i, { fourth: e.target.checked })} />৪র্থ</label>
            <button onClick={() => setRows(rows.filter((_, k) => k !== i))} aria-label="Remove row" className="justify-self-end rounded-lg border border-red-300 p-2 text-red-700"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={() => setRows([...rows, mk(`বিষয় ${rows.length + 1}`)])} className="inline-flex items-center gap-2 justify-self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium"><Plus size={16} />বিষয় যোগ করুন</button>
      </div>
      {bad && <p role="alert" className="text-sm text-red-600">কোনো বিষয়ে নম্বর পূর্ণমানের চেয়ে বেশি বা ভুল। ঠিক করুন।</p>}
      {out ? (
        <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5">
          {out.failed ? (
            <p className="font-bold text-red-600">কোনো আবশ্যিক বিষয়ে ফেল থাকায় GPA 0.00 (অকৃতকার্য)।</p>
          ) : (
            <p className="text-3xl font-bold">GPA {out.gpa.toFixed(2)} <span className="text-lg text-royal">({grade(out.gpa)})</span></p>
          )}
          <p className="mt-2 text-sm text-slate-600">৪র্থ বিষয়ের ২ এর বেশি গ্রেড পয়েন্ট যোগ হয়েছে। এটা আনুমানিক হিসাব। চূড়ান্ত ফল নিজের বোর্ডের নিয়ম অনুযায়ী মিলিয়ে নিন।</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">নম্বর বসালেই GPA দেখা যাবে।</p>
      )}
    </div>
  );
}
