"use client";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useSaved } from "@/lib/use-saved";

export default function SavedLink() {
  const n = useSaved().length;
  return (
    <Link href="/saved" aria-label={`Saved items: ${n}`} className="relative hidden shrink-0 rounded-full border border-slate-300 bg-white p-2 text-navy-900 hover:bg-slate-50 sm:block">
      <Bookmark size={20} />
      {n > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">{n > 99 ? "99+" : n}</span>}
    </Link>
  );
}
