import { cache } from "react";
import { db } from "@/lib/db";
import { contact as defContact, social as defSocial } from "@/lib/social";

export const defaults = {
  heroBadge: "শিক্ষার সবকিছু একসাথে",
  heroTitle: "আপনার প্রয়োজনীয় শিক্ষামূলক বই সহজেই খুঁজে নিন",
  heroSubtitle: "গাইড বই, লেকচার শিট এবং প্রশ্ন সমাধান, সব শ্রেণীর জন্য এক জায়গায়।",
  footerText: "শিক্ষার সবকিছু একসাথে। নোট, প্রশ্নব্যাংক, মডেল টেস্ট আর AI কুইজ বিনামূল্যে পেতে আমাদের সাথেই থাকুন।",
  metaDescription: "Academic notes, admission, NTRCA, jobs and AI practice quizzes.",
};

// Settings saved in the admin panel win. Until the first save, the values in lib/social.ts are used.
export const getSite = cache(async () => {
  const rows = await db.setting.findMany().catch(() => []);
  const m = new Map(rows.map((r) => [r.key, r.value]));
  const s = (k: string, d: string) => (m.has(k) ? (m.get(k) as string) : d);
  const text = (k: string, d: string) => (m.get(k)?.trim() ? (m.get(k) as string).trim() : d);
  return {
    social: defSocial.map((x) => ({ ...x, url: s(`social.${x.name}`, x.url) })),
    contact: { email: s("contact.email", defContact.email), phone: s("contact.phone", defContact.phone) },
    heroBadge: text("hero.badge", defaults.heroBadge),
    heroTitle: text("hero.title", defaults.heroTitle),
    heroSubtitle: text("hero.subtitle", defaults.heroSubtitle),
    footerText: text("footer.text", defaults.footerText),
    metaDescription: text("meta.description", defaults.metaDescription),
  };
});
