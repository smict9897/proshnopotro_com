"use client";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { removeSaved } from "@/lib/saved";
import { useSaved } from "@/lib/use-saved";

export default function SavedList() {
  const items = useSaved();
  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
        <Bookmark className="mx-auto" />
        <p className="mt-2">এখনো কিছু সংরক্ষণ করা হয়নি। যেকোনো বই বা পোস্টের বুকমার্ক বোতাম চাপলে এখানে জমা হবে।</p>
      </div>
    );
  }
  return (
    <ul className="mt-6 grid gap-3">
      {items.map((s) => (
        <li key={`${s.type}-${s.id}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <Link href={s.href} className="min-w-0 flex-1">
            <span className="text-xs text-royal">{s.type === "post" ? "ব্লগ" : "বই / ম্যাটেরিয়াল"}</span>
            <span className="block font-semibold">{s.title}</span>
          </Link>
          <button onClick={() => removeSaved(s)} aria-label="Remove" className="rounded-lg border border-red-300 p-2 text-red-700"><Trash2 size={16} /></button>
        </li>
      ))}
    </ul>
  );
}
