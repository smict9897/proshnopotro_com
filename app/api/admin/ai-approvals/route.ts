import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// 🎯 ১. ড্রাফট প্রশ্নগুলো ফেচ করা (যেগুলো এখনো অ্যাপ্রুভ হয়নি)
export async function GET() {
  try {
    const questions = await db.question.findMany({
      where: { source: "AI_GENERATOR" }, // সব এআই প্রশ্ন দেখাবে
      orderBy: { createdAt: "desc" },
      take: 50 // সর্বশেষ ৫০টি
    });
    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🎯 ২. অ্যাপ্রুভ / আনঅ্যাপ্রুভ / এডিট করা
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // সবগুলো অ্যাপ্রুভ করা
    if (body.action === "approveAll") {
      await db.question.updateMany({
        where: { approved: false, source: "AI_GENERATOR" },
        data: { approved: true }
      });
      return NextResponse.json({ success: true, message: "সব প্রশ্ন অ্যাপ্রুভ হয়েছে!" });
    }

    // নির্দিষ্ট কোনো প্রশ্ন অ্যাপ্রুভ করা
    if (body.action === "approve" && body.id) {
      await db.question.update({
        where: { id: body.id },
        data: { approved: true }
      });
      return NextResponse.json({ success: true, message: "প্রশ্নটি অ্যাপ্রুভ হয়েছে!" });
    }

    // এডিট এবং সেভ করা
    if (body.action === "update" && body.id) {
      await db.question.update({
        where: { id: body.id },
        data: { text: body.text, options: body.options, correct: body.correct, explanation: body.explanation }
      });
      return NextResponse.json({ success: true, message: "প্রশ্নটি আপডেট হয়েছে!" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
