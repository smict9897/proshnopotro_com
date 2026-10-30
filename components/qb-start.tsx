"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import curriculum from "../nctb-curriculum.json";

type Pair = { category: string; subject: string };
const LOW = ["1", "2", "3", "4", "5", "6", "7", "8"];
const CHIPS = ["SSC", "HSC", "Admission", "Job"];

const CLASS_MAP: Record<string, string> = {
  "6": "Class 6",
  "7": "Class 7",
  "8": "Class 8",
  "SSC": "Class 9-10",
  "HSC": "Class 11-12",
};

function getCurriculumSubjects(cat: string): string[] {
  const key = CLASS_MAP[cat];
  if (!key) return [];
  const cls = curriculum.classes.find((c) => c.class === key);
  return cls ? cls.subjects.map((s) => s.name) : [];
}

export default function QbStart({ pairs }: { pairs: Pair[] }) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");

  const curriculumSubjects = useMemo(() => getCurriculumSubjects(category), [category]);
  const dbSubjects = useMemo(
    () => Array.from(new Set(pairs.filter((p) => !category || p.category === category).map((p) => p.subject))),
    [pairs, category]
  );
  const subjects = useMemo(
    () => Array.from(new Set([...curriculumSubjects, ...dbSubjects])),
    [curriculumSubjects, dbSubjects]
  );

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold ${
      active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-700"
    }`;

  function go() {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (subject) p.set("subject", subject);
    router.push(`/question-builder/create?${p.toString()}`);
  }

  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Class 1-8"
          className={chip(LOW.includes(category)) + " pr-8"}
          value={LOW.includes(category) ? category : ""}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubject("");
          }}
        >
          <option value="">All Class (1–8th)</option>
          {LOW.map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>
        {CHIPS.map((c) => (
  <button
    key={c}
    type="button"
    className={chip(category === c)}
    onClick={() => {
      setCategory(category === c ? "" : c);
      setSubject("");
    }}
  >
    {c === "SSC" ? "SSC (নবম-দশম)" : c === "HSC" ? "HSC (একাদশ-দ্বাদশ)" : c}
  </button>
))}
      </div>

      <select
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      >
        <option value="">— Select Subject —</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={!subject}
        onClick={go}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        প্রশ্ন তৈরী করুন <ArrowRight size={18} />
      </button>
      {!pairs.length && !curriculumSubjects.length && (
        <p className="text-center text-xs text-slate-500">
          এখনও কোনো প্রশ্ন নেই। আগে /admin/questions থেকে প্রশ্ন যোগ করুন।
        </p>
      )}
    </div>
  );
}
