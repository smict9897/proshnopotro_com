import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import QbExtract from "@/components/qb-extract";

export const dynamic = "force-dynamic";
export const metadata = { title: "PDF/ছবি থেকে প্রশ্ন" };

export default async function ExtractPage() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "TEACHER") redirect("/");

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <Link href="/admin/questions" className="text-sm text-blue-600">‹ প্রশ্ন ব্যাংক</Link>
      <h1 className="mt-2 mb-4 text-2xl font-bold">PDF বা ছবি থেকে প্রশ্ন তুলুন</h1>
      <QbExtract />
    </main>
  );
}
