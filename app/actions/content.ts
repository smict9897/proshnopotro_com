"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function staff() {
  const r = (await auth())?.user?.role;
  if (r !== "ADMIN" && r !== "TEACHER") throw new Error("Not allowed");
}
export async function addNotice(fd: FormData): Promise<void> {
  await staff();
  const text = z.string().min(3).parse(fd.get("text"));
  await db.notice.updateMany({ data: { active: false } });
  await db.notice.create({ data: { text } });
  revalidatePath("/", "layout");
}
export async function addJob(fd: FormData): Promise<void> {
  await staff();
  const d = z.object({ title: z.string().min(3), type: z.string(), org: z.string().min(2), url: z.string().url().or(z.literal("")), deadline: z.string() }).parse(Object.fromEntries(fd));
  await db.job.create({ data: { title: d.title, type: d.type, org: d.org, url: d.url || null, deadline: d.deadline ? new Date(d.deadline) : null } });
  revalidatePath("/jobs");
}
export async function sendInquiry(_: string, fd: FormData): Promise<string> {
  const p = z.object({ name: z.string().min(2), email: z.string().email(), budget: z.string().optional(), message: z.string().min(10) }).safeParse(Object.fromEntries(fd));
  if (!p.success) return "Enter your name, a valid email and a message of at least 10 characters.";
  await db.inquiry.create({ data: p.data });
  return "Request sent. You will get a reply by email.";
}
