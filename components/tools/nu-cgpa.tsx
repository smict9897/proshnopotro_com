"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Row = { name: string; credit: string; gp: string };
const grades = [["A+ (80-100)", 4], ["A (75-79)", 3.75], ["A- (70-74)", 3.5], ["B+ (65-69)", 3.25], ["B (60-64)", 3], ["B- (55-59)", 2.75], ["C+ (50-54)", 2.5], ["C (45-49)", 2.25], ["D (40-44)", 2], ["F (0-39)", 0]] as const;
const letter = (g: number) => (g >= 4 ? "A+" : g >= 3.75 ? "A" : g >= 3.5 ? "A-" : g >= 3.25 ? "B+" : g >= 3 ? "B" : g >= 2.75 ? "B-" : g >= 2.5 ? "C+" : g >= 2.25 ? "C" : g >= 2 ? "D" : "F");
const mk = (n: number): Row => ({ name: `কোর্স ${n}`, credit: "3", gp: "" });
const f = "w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm";

export default function NuCgpa() {
  const [rows, setRows] = useState<Row[]>([1, 2, 3, 4, 5].map(mk));
  const set = (i: number, p: Partial<Row>) => setRows(rows.map((r, k) => (k === i ? { ...r, ...p } : r)));
  const used = rows.filter((r) => r.gp !== "" && Number(r.credit) > 0);
  const credits = used.reduce((s, r) => s + Number(r.credit), 0);
  const cgpa = credits > 0 ? used.reduce((s, r) => s + Number(r.credit) * Number(r.gp), 0) / credits : null;
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_70px] items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-[1fr_80px_170px_40px] sm:border-0 sm:p-0">
            <input value={r.name} onChange={(e) => set(i, { name: e.target.value })} aria-label="কোর্স" className={f} />
            <input value={r.credit} onChange={(e) => set(i, { credit: e.target.value })} inputMode="decimal" aria-label="ক্রেডিট" className={f} />
            <select value={r.gp} onChange={(e) => set(i, { gp: e.target.value })} aria-label="গ্রেড" className={`${f} col-span-2 sm:col-span-1`}>
              <option value="">গ্রেড বাছুন</option>
              {grades.map(([l, p]) => <option key={l} value={p}>{l}, {p.toFixed(2)}</option>)}
            </select>
            <button onClick={() => setRows(rows.filter((_, k) => k !== i))} aria-label="Remove row" className="justify-self-end rounded-lg border border-red-300 p-2 text-red-700"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={() => setRows([...rows, mk(rows.length + 1)])} className="inline-flex items-center gap-2 justify-self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium"><Plus size={16} />কোর্স যোগ করুন</button>
      </div>
      {cgpa !== null ? (
        <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-3xl font-bold">CGPA {cgpa.toFixed(2)} <span className="text-lg text-royal">({letter(cgpa)})</span></p>
          <p className="mt-2 text-sm text-slate-600">মোট ক্রেডিট: {credits}। এটা আনুমানিক হিসাব। বিশ্ববিদ্যালয়ের চূড়ান্ত ফল ও নিয়ম নিজে মিলিয়ে নিন।</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">গ্রেড বাছলেই CGPA দেখা যাবে।</p>
      )}
    </div>
  );
}
