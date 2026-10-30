import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Database, FileUp, FilePlus2, FolderOpen, SlidersHorizontal, 
  BookOpen, PackageCheck, Sparkles, Layers 
} from "lucide-react";
import { auth } from "@/auth";
import AdminNav from "@/components/admin-nav";

const QB_LINKS = [
  { href: "/admin/questions", label: "প্রশ্ন ব্যাংক", sub: "প্রশ্ন যোগ ও ইমপোর্ট", Icon: Database },
  { href: "/admin/questions/manage", label: "প্রশ্ন ম্যানেজ", sub: "গণনা, ফিল্টার, অনুমোদন, মোছা", Icon: SlidersHorizontal },
  { href: "/admin/questions/extract", label: "PDF/ছবি থেকে প্রশ্ন", sub: "AI দিয়ে প্রশ্ন তোলা", Icon: FileUp },
  { href: "/question-builder", label: "প্রশ্নপত্র তৈরি", sub: "প্রশ্ন বেছে প্রশ্নপত্র বানান", Icon: FilePlus2 },
  { href: "/question-builder/saved", label: "সংরক্ষিত প্রশ্নপত্র", sub: "আগে সেভ করা প্রশ্নপত্র", Icon: FolderOpen },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = (await auth())?.user;
  
  if (u?.role !== "ADMIN") redirect(u?.role === "TEACHER" ? "/question-builder" : "/login");

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-orange-50/50 min-h-screen">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-4 lg:flex-row">
        <AdminNav name={u?.name ?? "Admin"} role={u?.role} />
        
        <div className="min-w-0 flex-1">

          {/* 🛍️ ১. বইঘর ক্যাটালগ, অফার ও অর্ডার কন্ট্রোল (৩টি কুইক কার্ড) */}
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            
            {/* 📚 ১. বইঘর ম্যানেজার বাটন (নতুন বই যোগ করার জন্য) */}
            <Link
              href="/admin/books"
              className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 shadow-sm transition hover:bg-blue-100/70 dark:border-blue-800 dark:bg-blue-950/40 group"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm group-hover:scale-105 transition-transform">
                <BookOpen size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">বইঘর ম্যানেজার</span>
                  <span className="rounded-md bg-blue-600 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase">বই</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                  নতুন বই ও ডেমো পাতা যোগ
                </span>
              </div>
            </Link>

            {/* 🎁 ২. অফার ও পপ-আপ বাটন */}
            <Link
              href="/admin/promo"
              className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-sm transition hover:bg-emerald-100/70 dark:border-emerald-800 dark:bg-emerald-950/40 group"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">হোমপেজ পপ-আপ</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                  বইয়ের অফার ব্যানার
                </span>
              </div>
            </Link>

            {/* 📦 ৩. অর্ডার ও TrxID বাটন */}
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3.5 shadow-sm transition hover:bg-indigo-100/60 dark:border-indigo-800 dark:bg-indigo-950/40 group"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm group-hover:scale-105 transition-transform">
                <PackageCheck size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">অর্ডার ও TrxID</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                  পেমেন্ট ও TrxID চেক
                </span>
              </div>
            </Link>

          </div>

          {/* ২. প্রশ্ন ব্যাংক ও প্রশ্নপত্র সেকশন */}
          <details className="group mb-4 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold">
              <span className="flex items-center gap-2">
                <Database size={18} className="text-blue-600" />
                প্রশ্ন ব্যাংক ও প্রশ্নপত্র
              </span>
              <span className="text-xs font-normal text-slate-500 group-open:hidden">খুলুন ›</span>
              <span className="hidden text-xs font-normal text-slate-500 group-open:inline">বন্ধ করুন ˅</span>
            </summary>
            <div className="grid gap-2 border-t border-slate-200 p-3 dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-3">
              {QB_LINKS.map(({ href, label, sub, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Icon size={16} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block text-xs text-slate-500">{sub}</span>
                  </span>
                </Link>
              ))}
            </div>
          </details>

          {children}
        </div>
      </div>
    </div>
  );
}
