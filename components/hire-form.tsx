"use client";
import { useActionState } from "react";
import { sendInquiry } from "@/app/actions/content";
const f = "w-full rounded-md border border-slate-300 bg-white px-3 py-2";
export default function HireForm() {
  const [msg, action, pending] = useActionState(sendInquiry, "");
  return (
    <form action={action} className="grid gap-3">
      <input name="name" required className={f} placeholder="Your name" />
      <input name="email" type="email" required className={f} placeholder="Email" />
      <input name="budget" className={f} placeholder="Budget (optional)" />
      <textarea name="message" required minLength={10} rows={5} className={f} placeholder="What do you want built?" />
      {msg && <p role="status" className="text-sm">{msg}</p>}
      <button disabled={pending} className="rounded-md bg-hire px-4 py-2.5 font-semibold text-white disabled:opacity-60">{pending ? "Sending…" : "Send project request"}</button>
    </form>
  );
}
