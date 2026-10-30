"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProfile } from "@/app/dashboard/actions";
import { GEO, DIVISIONS } from "@/lib/bd-geo";

type Defaults = {
  institution: string; division: string; district: string;
  upazila: string; phone: string; address: string;
};

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100 disabled:text-slate-400";
const lbl = "mb-1 block text-sm font-semibold";

export default function TeacherOnboarding({ defaults, canSkip }: { defaults: Defaults; canSkip: boolean }) {
  const [error, action, pending] = useActionState(saveProfile, "");
  const [division, setDivision] = useState(defaults.division);
  const [district, setDistrict] = useState(defaults.district);
  const districts = GEO[division] ?? [];

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-center text-xl font-bold text-emerald-700">
        এক ধাপ বাকি, প্রতিষ্ঠান রেজিস্ট্রেশন করুন
      </h1>
      <p className="mt-1 text-center text-sm text-slate-600">
        প্রশ্নপত্রে প্রতিষ্ঠানের নাম দেখাতে তথ্য দিন, পরেও পূরণ করা যাবে
      </p>

      <form action={action} className="mt-6 grid gap-4">
        <div>
          <label className={lbl}>প্রতিষ্ঠানের নাম *</label>
          <input name="institution" defaultValue={defaults.institution} placeholder="প্রতিষ্ঠানের নাম" className={field} required />
        </div>
        <div>
          <label className={lbl}>বিভাগ *</label>
          <select
            name="division"
            value={division}
            onChange={(e) => { setDivision(e.target.value); setDistrict(""); }}
            className={field}
            required
          >
            <option value="">বিভাগ</option>
            {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>জেলা *</label>
          <select
            name="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!division}
            className={field}
            required
          >
            <option value="">জেলা</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>উপজেলা *</label>
          <input name="upazila" defaultValue={defaults.upazila} placeholder="উপজেলার নাম" className={field} required />
        </div>
        <div>
          <label className={lbl}>ফোন নম্বর</label>
          <input name="phone" type="tel" inputMode="tel" defaultValue={defaults.phone} placeholder="01XXXXXXXXX" className={field} />
        </div>
        <div>
          <label className={lbl}>নির্দিষ্ট ঠিকানা (যদি থাকে)</label>
          <textarea name="address" rows={3} defaultValue={defaults.address} placeholder="এখানে জেলা বা উপজেলা লিখবেন না।" className={field} />
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button disabled={pending} className="rounded-2xl bg-emerald-600 px-4 py-3.5 font-semibold text-white disabled:opacity-60">
          {pending ? "অপেক্ষা করুন…" : "রেজিস্টার্ড করুন"}
        </button>
        {canSkip ? (
          <Link href="/dashboard?skip=1" className="text-center text-sm text-slate-500">পরে করব (Skip)</Link>
        ) : (
          <Link href="/dashboard" className="text-center text-sm text-slate-500">বাতিল</Link>
        )}
      </form>
    </div>
  );
}
