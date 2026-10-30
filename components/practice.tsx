"use client";
import { useState } from "react";
export type Q = { id: string; text: string; options: Record<string, string>; correct: string; explanation: string };
export default function Practice({ qs }: { qs: Q[] }) {
  const [a, setA] = useState<Record<string, string>>({});
  const score = qs.filter((q) => a[q.id] === q.correct).length;
  return (
    <div>
      <ol className="grid gap-5">{qs.map((q, i) => (
        <li key={q.id} className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <p className="font-medium">{i + 1}. {q.text}</p>
          <div className="mt-2 grid gap-1.5">{Object.entries(q.options).map(([k, v]) => (
            <button key={k} disabled={!!a[q.id]} onClick={() => setA({ ...a, [q.id]: k })}
              className={`rounded-md border px-3 py-1.5 text-left ${a[q.id] && k === q.correct ? "border-green-600 bg-green-50" : a[q.id] === k ? "border-red-500 bg-red-50" : "border-slate-200"}`}>{k}. {v}</button>))}
          </div>
          {a[q.id] && <p className="mt-2 rounded-md bg-slate-50 p-2">{q.explanation}</p>}
        </li>))}
      </ol>
      {Object.keys(a).length === qs.length && qs.length > 0 && <p role="status" className="mt-4 text-lg font-bold">Score: {score} / {qs.length}</p>}
    </div>
  );
}
