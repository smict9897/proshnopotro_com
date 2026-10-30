"use client";
import { useActionState } from "react";
import { uploadMedia, type MediaState } from "@/app/actions/posts";
const f = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2";
const init: MediaState = { msg: "" };

export default function MediaUpload() {
  const [s, action, pending] = useActionState(uploadMedia, init);
  return (
    <form action={action} className="grid gap-3">
      <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required className={f} />
      <input name="alt" required maxLength={200} className={f} placeholder="Alt text: describe the image (required)" />
      <button disabled={pending} className="rounded-xl bg-royal px-4 py-2.5 font-semibold text-white disabled:opacity-60">{pending ? "Uploading…" : "Upload image"}</button>
      {s.msg && <p role="status" className="text-sm">{s.msg}</p>}
      {s.snippet && <textarea readOnly rows={3} value={s.snippet} onFocus={(e) => e.currentTarget.select()} className={`${f} font-mono text-sm`} />}
    </form>
  );
}
