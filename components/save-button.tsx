"use client";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleSaved, type SavedItem } from "@/lib/saved";
import { useSaved } from "@/lib/use-saved";

export default function SaveButton({ item, label = false }: { item: SavedItem; label?: boolean }) {
  const saved = useSaved().some((s) => s.id === item.id && s.type === item.type);
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <button type="button" onClick={() => toggleSaved(item)} aria-pressed={saved} aria-label={saved ? "সংরক্ষণ বাতিল করুন" : "সংরক্ষণ করুন"}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${saved ? "border-royal bg-blue-50 text-royal" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>
      <Icon size={18} />{label && (saved ? "সংরক্ষিত" : "সংরক্ষণ করুন")}
    </button>
  );
}
