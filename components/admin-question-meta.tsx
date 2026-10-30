"use client";
import { useMemo, useState } from "react";
import curriculum from "../nctb-curriculum.json";

const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "SSC", "HSC", "Admission", "Job"];
const OTHER = "__other__";
const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-700";

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

function getCurriculumChapters(cat: string, subject: string): string[] {
  const key = CLASS_MAP[cat];
  if (!key) return [];
  const cls = curriculum.classes.find((c) => c.class === key);
  if (!cls) return [];
  const sub = cls.subjects.find((s) => s.name === subject);
  return sub ? sub.chapters : [];
}

export default function AdminQuestionMeta() {
  const [category, setCategory] = useState("SSC");
  const [subjSel, setSubjSel] = useState("");
  const [subjOther, setSubjOther] = useState("");
  const [topSel, setTopSel] = useState("");
  const [topOther, setTopOther] = useState("");

  const subjects = useMemo(() => getCurriculumSubjects(category), [category]);
  const subjIsOther = subjSel === OTHER || subjects.length === 0;
  const subject = subjIsOther ? subjOther.trim() : subjSel;

  const chapters = useMemo(() => getCurriculumChapters(category, subjSel), [category, subjSel]);
  const topIsOther = topSel === OTHER || (subject !== "" && chapters.length === 0);
  const topic = topIsOther ? topOther.trim() : topSel;

  return (
    <div className="grid grid-cols-2 gap-2">
      <select
        name="category"
        className={input}
        required
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setSubjSel("");
          setSubjOther("");
          setTopSel("");
          setTopOther("");
        }}
      >
        {CLASSES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Subject */}
      {subjects.length > 0 ? (
        <select
          className={input}
          value={subjSel}
          onChange={(e) => {
            setSubjSel(e.target.value);
            setSubjOther("");
            setTopSel("");
            setTopOther("");
          }}
        >
          <option value="">বিষয় বাছুন</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value={OTHER}>অন্য (নিজে লিখুন)</option>
        </select>
      ) : (
        <input
          name="subject"
          placeholder="বিষয় (যেমন: গণিত)"
          className={input}
          required
          value={subjOther}
          onChange={(e) => setSubjOther(e.target.value)}
        />
      )}

      {subjIsOther && subjects.length > 0 && (
        <input
          className={input + " col-span-2"}
          placeholder="বিষয়ের নাম লিখুন"
          value={subjOther}
          onChange={(e) => setSubjOther(e.target.value)}
          required
        />
      )}

      {/* Chapter */}
      {chapters.length > 0 ? (
        <select
          className={input}
          value={topSel}
          onChange={(e) => {
            setTopSel(e.target.value);
            setTopOther("");
          }}
        >
          <option value="">অধ্যায় বাছুন</option>
          {chapters.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value={OTHER}>অন্য (নিজে লিখুন)</option>
        </select>
      ) : (
        <input
          name="topic"
          placeholder="অধ্যায়"
          className={input}
          value={topOther}
          onChange={(e) => setTopOther(e.target.value)}
        />
      )}

      {topIsOther && chapters.length > 0 && (
        <input
          className={input}
          placeholder="অধ্যায়ের নাম লিখুন"
          value={topOther}
          onChange={(e) => setTopOther(e.target.value)}
        />
      )}

      <input name="source" placeholder="বোর্ড-সাল (যেমন: ঢাকা বোর্ড ২০২৬)" className={input} />
      <select name="difficulty" className={input} defaultValue="MEDIUM">
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <select name="lang" className={input}>
        <option value="Bangla">Bangla</option>
        <option value="English">English</option>
      </select>

      {/* final values for the form */}
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="topic" value={topic} />
    </div>
  );
      }
