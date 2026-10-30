import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, Briefcase, Calculator, ClipboardList, Code2, Crop, 
  FileText, GraduationCap, Info, Library, ListChecks, Mail, 
  Newspaper, PenSquare, Phone, PlayCircle, ShieldAlert, ShieldCheck, 
  Sparkles, UserCheck,Building2, type LucideIcon 
} from "lucide-react";

import { db } from "@/lib/db";
import { getSite } from "@/lib/site";

type Item = [label: string, href: string, icon: LucideIcon, color: string];

const tint: Record<string, string> = {
  YouTube: "bg-red-600", Facebook: "bg-blue-600", Instagram: "bg-pink-600", 
  LinkedIn: "bg-blue-700", GitHub: "bg-slate-700", Telegram: "bg-sky-500", WhatsApp: "bg-emerald-600",
};

const groups: { title: string; items: Item[] }[] = [
  { 
    title: "শিক্ষার্থী সেবা ও টুলস", 
    items: [
      ["AI কুইজ প্র্যাকটিস", "/quiz", Sparkles, "bg-amber-500/10 text-amber-400"],
      ["মডেল টেস্ট ও লিডারবোর্ড", "/tests", ListChecks, "bg-blue-500/10 text-blue-400"],
      ["জিপিএ ক্যালকুলেটর", "/tools/gpa", Calculator, "bg-emerald-500/10 text-emerald-400"],
      ["NU CGPA ও রেজাল্ট প্ল্যানার", "/tools/nu-cgpa", GraduationCap, "bg-indigo-500/10 text-indigo-300"],
      ["কভার পেজ মেকার", "/tools/cover-page", ClipboardList, "bg-violet-500/10 text-violet-400"],
      ["ছবি ও স্বাক্ষর রিসাইজার", "/tools/photo-resizer", Crop, "bg-sky-500/10 text-sky-400"],
    ] 
  },
  { 
    title: "জনপ্রিয় বিভাগসমূহ", 
    items: [
      ["একাডেমিক নোট (৬-১২)", "/academic", BookOpen, "bg-sky-500/10 text-sky-400"],
      ["বিশ্ববিদ্যালয় ভর্তি", "/admission", GraduationCap, "bg-amber-500/10 text-amber-400"],
      ["শিক্ষক নিবন্ধন (NTRCA)", "/ntrca", PenSquare, "bg-rose-500/10 text-rose-400"],
      ["ই-বুক লাইব্রেরি", "/library", Library, "bg-emerald-500/10 text-emerald-400"],
      ["জব সার্কুলার", "/jobs", Briefcase, "bg-emerald-500/10 text-emerald-300"],
      ["ভিডিও লেসন", "/videos", PlayCircle, "bg-red-500/10 text-red-400"],
      ["ব্লগ", "/blog", Newspaper, "bg-violet-500/10 text-violet-400"],
    ] 
  },
  { 
    title: "নীতিমালা ও সহায়তা", 
    items: [
      ["about-us", "/about-us", Info, "bg-indigo-500/10 text-indigo-400"],
      ["Contact Us", "/contact-us", Mail, "bg-emerald-500/10 text-emerald-400"],
      ["Privacy Policy", "/privacy", ShieldCheck, "bg-sky-500/10 text-sky-400"],
      ["Terms Conditions", "/terms", FileText, "bg-slate-500/10 text-slate-300"],
      ["Disclaimer", "/disclaimer", ShieldAlert, "bg-amber-500/10 text-amber-400"],
      ["DMCA Policy", "/dmca", UserCheck, "bg-rose-500/10 text-rose-400"],
      ["Hire Me (Developer)", "/hire", Code2, "bg-orange-500/10 text-orange-400"],
       ["S.N.P High School & College", "/s-n-p", Building2, "bg-blue-500/10 text-blue-400"],
    ] 
  },
];

export default async function SiteFooter() {
  const [site, pages] = await Promise.all([
    getSite(),
    db.page.findMany({ select: { slug: true, title: true }, orderBy: { title: "asc" } }).catch(() => [])
  ]);

  const { contact, footerText } = site;
  const links = site.social ? site.social.filter((s) => s.url) : [];

  return (
    <footer className="mt-20 bg-navy-900 pb-24 text-sm text-slate-300 md:pb-0 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Top Info Section */}
        <div className="mb-10 pb-8 border-b border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <Link href="/" aria-label="SaifulSir.com home" className="inline-block rounded-xl bg-white px-3 py-2">
              <Image src="/logo.png" alt="SaifulSir.com" width={689} height={245} className="h-10 w-auto" />
            </Link>
            <p className="mt-3 text-slate-400 leading-relaxed text-sm">{footerText}</p>
          </div>

          {links.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {links.map(({ name, icon: Icon, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:scale-105 ${tint[name] ?? "bg-slate-700"}`}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Card Grid Sections */}
        <div className="grid gap-10 lg:grid-cols-3">
          {groups.map((g, gi) => (
            <div key={g.title}>
              <div className="mb-4">
                <h2 className="text-base font-bold text-white tracking-wide">{g.title}</h2>
                <span className="mt-1 block h-1 w-10 rounded-full bg-royal" />
              </div>

              {/* Cards in Mobile 2-column or 1-column layout */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {g.items.map(([label, href, Icon, colorStyle]) => (
                  <Link 
                    key={href} 
                    href={href} 
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10 hover:border-white/20"
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorStyle}`}>
                      <Icon size={18} />
                    </span>
                    <span className="text-xs font-medium text-slate-200 truncate">{label}</span>
                  </Link>
                ))}

                {gi === 2 && Array.isArray(pages) && pages.map((pg) => (
                  <Link 
                    key={pg.slug} 
                    href={`/p/${pg.slug}`} 
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10 hover:border-white/20"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-500/10 text-slate-300">
                      <FileText size={18} />
                    </span>
                    <span className="text-xs font-medium text-slate-200 truncate">{pg.title}</span>
                  </Link>
                ))}

                {gi === 2 && contact?.phone && (
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="col-span-2 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10 hover:border-white/20"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Phone size={18} />
                    </span>
                    <span className="text-xs font-medium text-slate-200 truncate">{contact.phone}</span>
                  </a>
                )}

                {gi === 2 && contact?.email && (
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="col-span-2 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10 hover:border-white/20"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                      <Mail size={18} />
                    </span>
                    <span className="text-xs font-medium text-slate-200 truncate">{contact.email}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} SaifulSir.com
      </div>
    </footer>
  );
}
