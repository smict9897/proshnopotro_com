import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// সার্ভার অ্যাকশন: ফর্ম সাবমিট হলে ডাটাবেজে সেভ করবে এবং ছবি আপলোড হ্যান্ডেল করবে
async function createPost(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string || title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  const metaDescription = formData.get("metaDescription") as string;
  const body = formData.get("body") as string;
  const published = formData.get("published") === "on";
  
  const imageFile = formData.get("coverImage") as File;
  let coverUrl = "";

  // যদি মোবাইল বা ডিভাইস থেকে ছবি সিলেক্ট করা হয়
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    try {
      await writeFile(path.join(uploadDir, filename), buffer);
      coverUrl = `/uploads/${filename}`;
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  }

  // ডাটাবেজে পোস্ট ক্রিয়েট করা
  try {
    await db.post.create({
      data: {
        title,
        slug,
        metaDescription,
        body,
        coverUrl,
        published,
      },
    });
  } catch (error) {
    console.error("Failed to create post:", error);
  }

  redirect("/blog");
}

export default function CreatePostPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600">
          <ArrowLeft size={16} /> ব্লগে ফিরে যান
        </Link>
        <h1 className="text-xl font-bold text-slate-900">নতুন পোস্ট তৈরি করুন</h1>
      </div>

      <form action={createPost} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">পোস্টের শিরোনাম (Title) *</label>
          <input 
            type="text" 
            name="title" 
            required 
            placeholder="যেমন: NTRCA প্রিলিমিনারি প্রস্তুতি গাইড ২০২৬"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">স্লাগ (URL Slug - ঐচ্ছিক)</label>
          <input 
            type="text" 
            name="slug" 
            placeholder="ntrca-preliminary-preparation"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          <p className="text-xs text-slate-500 mt-1">খালি রাখলে শিরোনাম থেকে স্বয়ংক্রিয়ভাবে তৈরি হবে।</p>
        </div>

        {/* Cover Image Upload (Mobile friendly) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">কভার ইমেজ (গ্যালারি বা ক্যামেরা থেকে)</label>
          <input 
            type="file" 
            name="coverImage" 
            accept="image/*" 
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer border border-slate-300 rounded-xl"
          />
        </div>

        {/* Meta Description / Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (Meta Description)</label>
          <textarea 
            name="metaDescription" 
            rows={2}
            placeholder="পোস্টের সংক্ষিপ্ত বিবরণ যা গুগলে বা ব্লগের কার্ডে দেখাবে..."
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Main Body */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">মূল লেখা (Body / Content) *</label>
          <textarea 
            name="body" 
            rows={8} 
            required
            placeholder="আপনার বিস্তারিত আর্টিকেল বা নোট এখানে লিখুন..."
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Published Toggle */}
        <div className="flex items-center gap-3 pt-2">
          <input 
            type="checkbox" 
            name="published" 
            id="published" 
            defaultChecked 
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="published" className="text-sm font-medium text-slate-700 select-none">
            সরাসরি পাবলিশ করুন (Publish immediately)
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200">
          <button 
            type="submit" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-md"
          >
            <PlusCircle size={18} />
            <span>পোস্ট সেভ ও পাবলিশ করুন</span>
          </button>
        </div>

      </form>
    </main>
  );
}
