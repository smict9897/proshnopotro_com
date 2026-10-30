import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 select-none py-1 ${className}`}>
      {/* 🚀 বড় ও প্রিমিয়াম ভেক্টর আইকন */}
      <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="logoPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="logoCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>

          {/* ব্যাকগ্রাউন্ড স্কয়ার */}
          <rect width="48" height="48" rx="14" fill="url(#logoPrimaryGrad)" />

          {/* গ্র্যাজুয়েশন ক্যাপের উপরের অংশ */}
          <path
            d="M24 10L39 17.5L24 25L9 17.5L24 10Z"
            fill="white"
            fillOpacity="0.95"
          />

          {/* 'S' আকৃতির কার্ভ */}
          <path
            d="M14 22V29.5C14 33.5 18.5 36.5 24 36.5C29.5 36.5 34 33.5 34 29.5V22L24 27L14 22Z"
            fill="url(#logoCyanGrad)"
          />

          {/* গোল্ডেন ক্যাপ ট্যাসেল */}
          <circle cx="37.5" cy="22" r="2.2" fill="#FBBF24" />
          <path d="M37.5 22V26.5" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* ✍️ বড় ব্র্যান্ড নাম ও স্লোগান */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          {/* ডার্ক মোডে লেখা ১০০% সাদা থাকার জন্য style ও [.dark_&] যুক্ত */}
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:!text-white [.dark_&]:!text-white">
            Saiful<span className="text-blue-600 dark:!text-blue-400 [.dark_&]:!text-blue-400">Sir</span>
          </span>
          <span className="rounded-md bg-blue-100 dark:bg-blue-900/60 [.dark_&]:bg-blue-900/60 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black text-blue-700 dark:!text-blue-300 [.dark_&]:!text-blue-300 border border-blue-200 dark:border-blue-700">
            .COM
          </span>
        </div>
        
        {/* ফাঁকা জায়গা ভরিয়ে তোলার বড় স্লোগান */}
        <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:!text-slate-300 [.dark_&]:!text-slate-300 tracking-wide mt-1">
          শিক্ষার সবকিছু একসাথে
        </span>
      </div>
    </div>
  );
}
