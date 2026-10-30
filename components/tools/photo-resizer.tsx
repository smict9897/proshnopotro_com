"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type Out = { url: string; kb: number; w: number; h: number; over: boolean };
const presets = [["ছবি", 300, 300, 100], ["স্বাক্ষর", 300, 80, 60]] as const;
const f = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("ছবিটি পড়া যায়নি।")); };
    img.src = url;
  });
}
const toBlob = (c: HTMLCanvasElement, q: number) => new Promise<Blob | null>((res) => c.toBlob(res, "image/jpeg", q));
const clamp = (n: number) => Math.min(2000, Math.max(20, Math.round(n) || 0));

export default function PhotoResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [w, setW] = useState("300");
  const [h, setH] = useState("300");
  const [maxKb, setMaxKb] = useState("100");
  const [mode, setMode] = useState<"crop" | "fit">("crop");
  const [out, setOut] = useState<Out | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (out) URL.revokeObjectURL(out.url); }, [out]);

  async function run() {
    if (!file) return;
    setBusy(true); setErr("");
    try {
      if (file.size > 15_000_000) throw new Error("ছবি ১৫ MB এর বেশি। ছোট ছবি বাছুন।");
      const img = await loadImage(file);
      const W = clamp(Number(w)), H = clamp(Number(h)), limit = Math.max(5, Number(maxKb) || 100) * 1000;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("আপনার ব্রাউজারে এটা চলবে না।");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
      const s = mode === "crop" ? Math.max(W / img.width, H / img.height) : Math.min(W / img.width, H / img.height);
      const dw = img.width * s, dh = img.height * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      let q = 0.95, blob = await toBlob(c, q);
      while (blob && blob.size > limit && q > 0.1) { q -= 0.05; blob = await toBlob(c, q); }
      if (!blob) throw new Error("ছবি তৈরি করা যায়নি।");
      setOut({ url: URL.createObjectURL(blob), kb: Math.round(blob.size / 100) / 10, w: W, h: H, over: blob.size > limit });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "কিছু একটা ভুল হয়েছে।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="grid content-start gap-3">
        <p className="text-sm text-slate-600">ছবি আপনার ডিভাইসেই বদলায়, কোথাও আপলোড হয় না। মাপ আর সাইজ আপনার সার্কুলারের নির্দেশনা দেখে মিলিয়ে নিন।</p>
        <div className="flex gap-2">
          {presets.map(([l, pw, ph, kb]) => (
            <button key={l} type="button" onClick={() => { setW(String(pw)); setH(String(ph)); setMaxKb(String(kb)); }} className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm hover:border-royal">{l} ({pw}×{ph}, {kb}KB)</button>
          ))}
        </div>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setOut(null); setErr(""); }} className={f} aria-label="Image" />
        <div className="grid grid-cols-3 gap-2">
          <label className="text-xs">প্রস্থ (px)<input value={w} onChange={(e) => setW(e.target.value)} inputMode="numeric" className={`${f} mt-1`} /></label>
          <label className="text-xs">উচ্চতা (px)<input value={h} onChange={(e) => setH(e.target.value)} inputMode="numeric" className={`${f} mt-1`} /></label>
          <label className="text-xs">সর্বোচ্চ KB<input value={maxKb} onChange={(e) => setMaxKb(e.target.value)} inputMode="numeric" className={`${f} mt-1`} /></label>
        </div>
        <div className="grid gap-1 text-sm">
          <label className="flex items-center gap-2"><input type="radio" checked={mode === "crop"} onChange={() => setMode("crop")} />মাঝখান থেকে কেটে মাপে আনুন</label>
          <label className="flex items-center gap-2"><input type="radio" checked={mode === "fit"} onChange={() => setMode("fit")} />পুরো ছবি রেখে সাদা জায়গা যোগ করুন</label>
        </div>
        <button onClick={run} disabled={!file || busy} className="rounded-xl bg-royal px-4 py-3 font-semibold text-white disabled:opacity-60">{busy ? "হচ্ছে…" : "মাপ ঠিক করুন"}</button>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      </div>
      <div>
        {out && (
          <div role="status" className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={out.url} alt="ফলাফল" width={out.w} height={out.h} className="mx-auto max-h-72 w-auto max-w-full rounded border border-slate-200" />
            <p className="text-sm">মাপ {out.w}×{out.h} px, সাইজ {out.kb} KB</p>
            {out.over && <p className="text-sm text-red-600">সর্বোচ্চ সাইজে নামানো যায়নি। মাপ কমিয়ে আবার চেষ্টা করুন।</p>}
            <a href={out.url} download="resized.jpg" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white"><Download size={18} />ডাউনলোড করুন</a>
          </div>
        )}
      </div>
    </div>
  );
}
