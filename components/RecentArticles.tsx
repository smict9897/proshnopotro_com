"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug?: string | null;
  coverUrl?: string | null;
  coverAlt?: string | null;
  createdAt: Date;
  body: string;
};

const fmt = (d: Date) => new Date(d).toLocaleDateString("en-GB", { dateStyle: "medium" });

export default function RecentArticles({ posts }: { posts: Post[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 2; // প্রতি পেজে উপর-নিচে ২টি কার্ড দেখাবে
  const totalPages = Math.ceil(posts.length / perPage);

  if (!posts || posts.length === 0) return null;

  const currentPosts = posts.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="mt-7 text-left">
      {/* হেডার */}
      <div className="flex items-center justify-between pb-2 mb-2 px-1">
        <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          সাম্প্রতিক আর্টিকেল ও গাইডলাইন
        </span>
        <Link href="/blog" className="text-xs font-bold text-royal hover:underline flex items-center gap-0.5">
          সবগুলো <ArrowRight size={13} />
        </Link>
      </div>

      {/* মোবাইলে উপর-নিচে ২টি সম্পূর্ণ ফুল কার্ড (grid-cols-1) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {currentPosts.map((p) => {
          let imgSrc = "/placeholder.jpg";
          if (p.coverUrl) {
            imgSrc = (p.coverUrl.startsWith("/") || p.coverUrl.startsWith("http")) 
              ? p.coverUrl 
              : `/${p.coverUrl}`;
          }

          return (
            <Link 
              key={p.id} 
              href={`/blog/${p.slug ?? p.id}`} 
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-royal hover:shadow-md flex flex-col"
            >
              {/* ফুল উইডথ থাম্বনেইল */}
              <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                <Image 
                  src={imgSrc} 
                  alt={p.coverAlt ?? p.title} 
                  fill 
                  sizes="(max-width: 640px) 100vw, 50vw" 
                  className="object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <span className="absolute left-2.5 top-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white tracking-wide">
                  BLOG
                </span>
              </div>
              
              {/* টাইটেল ও মেটা ডেটা */}
              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <h3 className="font-bold text-sm sm:text-base text-slate-800 leading-snug line-clamp-2 group-hover:text-royal transition-colors">
                  {p.title}
                </h3>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={13} />
                    {fmt(p.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {Math.max(1, Math.ceil(p.body.length / 900))} min read
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* কার্ড দুটির ঠিক নিচে পেজিনেশন বাটন */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition shadow-sm"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`h-8 min-w-[32px] px-2 rounded-xl text-xs font-bold transition shadow-sm ${
                currentPage === num
                  ? "bg-royal text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition shadow-sm"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
