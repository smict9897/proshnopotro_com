"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { submitAttempt, type Result } from "@/app/actions/tests";
type Q = { id: string; text: string; options: Record<string, string> };
export default function TestRunner({ testId, minutes, qs }: { testId: string; minutes: number; qs: Q[] }) {
  const [a, setA] = useState<Record<string, string>>({});
  const [left, setLeft] = useState(minutes * 60);
  const [res, setRes] = useState<Result | null>(null);
  const [pending, start] = useTransition();
  const ans = useRef(a); ans.current = a;
  const sent = useRef(false);
  function submit() { if (sent.current) return; sent.current = true; start(async () => { const r = await submitAttempt(testId, ans.current); if (!r.ok) sent.current = false; setRes(r); }); }
  useEffect(() => { if (res?.ok) return; const t = setInterval(() => setLeft((l) => l - 1), 1000); return () => clearInterval(t); }, [res]);
  useEffect(() => { if (left <= 0) submit(); }, [left]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = res?.ok ? res : null;
  return (
    <div>
      <div className="sticky top-14 z-10 mb-4 flex items-center justify-between rounded-md bg-navy-900 px-4 py-2 text-white">
        <span>{done ? `Score ${done.score} / ${done.total}` : `Time left ${Math.floor(Math.max(left, 0) / 60)}:${String(Math.max(left, 0) % 60).padStart(2, "0")}`}</span>
        {!done && <button onClick={submit} disabled={pending} className="rounded bg-hire px-3 py-1 text-sm font-semibold disabled:opacity-60">Submit test</button>}
      </div>
      {res && !res.ok && <p role="alert" className="mb-3 text-red-600">{res.error}</p>}
      <ol className="grid gap-4">{qs.map((q, i) => (
        <li key={q.id} className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <p className="font-medium">{i + 1}. {q.text}</p>
          <div className="mt-2 grid gap-1.5">{Object.entries(q.options).map(([k, v]) => {
            const c = done?.review[q.id]?.correct;
            const cls = done ? (k === c ? "border-green-600 bg-green-50" : a[q.id] === k ? "border-red-500 bg-red-50" : "border-slate-200") : a[q.id] === k ? "border-royal bg-blue-50" : "border-slate-200";
            return <button key={k} disabled={!!done} onClick={() => setA({ ...a, [q.id]: k })} className={`rounded-md border px-3 py-1.5 text-left ${cls}`}>{k}. {v}</button>;
          })}</div>
          {done && <p className="mt-2 rounded-md bg-slate-50 p-2">{done.review[q.id]?.explanation}</p>}
        </li>))}
      </ol>
    </div>
  );
}
