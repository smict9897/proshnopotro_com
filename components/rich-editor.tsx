"use client";
import { useEffect, useRef, useState } from "react";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Eraser, Highlighter, Image as ImageIcon, Italic, Link2, List, ListOrdered,
  Minus, Redo2, Strikethrough, Subscript, Superscript, Type, Underline, Undo2, Unlink,
} from "lucide-react";
import { uploadInline } from "@/app/actions/posts";

// মোবাইলের বড় ছবি আপলোডের আগে ফোনেই ছোট করে (সর্বোচ্চ 1600px, WebP)
async function compressImage(file: File, maxSide = 1600, quality = 0.82): Promise<File> {
  try {
    if (!file.type.startsWith("image/")) return file;
    if (file.size <= 600_000 && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) return file;
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

function Btn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick}
      className="rounded-md p-2 text-slate-700 hover:bg-slate-200">
      {children}
    </button>
  );
}
const sep = <span className="mx-1 hidden h-6 w-px bg-slate-300 sm:block" aria-hidden="true" />;
const sel = "rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm";

export default function RichEditor({ name, initialHtml, onChange }: { name: string; initialHtml: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const saved = useRef<Range | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(initialHtml);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { if (ref.current) ref.current.innerHTML = initialHtml; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sync = () => { const h = ref.current?.innerHTML ?? ""; setHtml(h); onChange(h); };
  const remember = () => {
    const s = window.getSelection();
    if (s && s.rangeCount && ref.current?.contains(s.anchorNode)) saved.current = s.getRangeAt(0).cloneRange();
  };
  useEffect(() => {
    document.addEventListener("selectionchange", remember);
    return () => document.removeEventListener("selectionchange", remember);
  }, []);
  const run = (cmd: string, val?: string) => {
    ref.current?.focus();
    const s = window.getSelection();
    if (s && saved.current) { s.removeAllRanges(); s.addRange(saved.current); }
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(cmd, false, val);
    remember();
    sync();
  };

  function link() {
    const url = (window.prompt("লিংক দিন (https:// দিয়ে শুরু)") ?? "").trim();
    if (!url) return;
    if (!/^(https:\/\/|mailto:)/i.test(url)) { setErr("লিংক https:// বা mailto: দিয়ে শুরু হতে হবে।"); return; }
    setErr(""); run("createLink", url);
  }
  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const alt = (window.prompt("ছবির বর্ণনা লিখুন (alt text, গুগলের জন্য দরকারি)") ?? "").trim();
    if (!alt) { setErr("ছবির বর্ণনা ছাড়া ছবি যোগ হবে না।"); return; }
    setBusy(true); setErr("");
    const small = await compressImage(file);
    if (small.size > 3_000_000) { setBusy(false); setErr("ছবিটি এখনও ৩ MB-এর বেশি, ছোট ছবি বাছুন।"); return; }
    const fd = new FormData();
    fd.set("image", small); fd.set("alt", alt);
    const r = await uploadInline(fd);
    setBusy(false);
    if (!r.url) { setErr(r.error ?? "ছবি আপলোড হয়নি।"); return; }
    run("insertHTML", `<img src="${r.url}" alt="${alt.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")}">`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-slate-300 bg-slate-50 p-2" role="toolbar" aria-label="Text formatting">
        <select aria-label="শৈলী" value="" onChange={(e) => e.target.value && run("formatBlock", `<${e.target.value}>`)} className={sel}>
          <option value="">শৈলী</option><option value="p">সাধারণ লেখা</option><option value="h2">শিরোনাম ২ (বড়)</option>
          <option value="h3">শিরোনাম ৩</option><option value="h4">শিরোনাম ৪</option><option value="blockquote">উদ্ধৃতি</option>
        </select>
        <select aria-label="লেখার মাপ" value="" onChange={(e) => e.target.value && run("fontSize", e.target.value)} className={sel}>
          <option value="">মাপ</option><option value="2">ছোট</option><option value="3">সাধারণ</option><option value="5">বড়</option><option value="6">আরও বড়</option>
        </select>
        {sep}
        <Btn label="মোটা (Ctrl+B)" onClick={() => run("bold")}><Bold size={18} /></Btn>
        <Btn label="বাঁকা (Ctrl+I)" onClick={() => run("italic")}><Italic size={18} /></Btn>
        <Btn label="নিচে দাগ (Ctrl+U)" onClick={() => run("underline")}><Underline size={18} /></Btn>
        <Btn label="মাঝে কাটা দাগ" onClick={() => run("strikeThrough")}><Strikethrough size={18} /></Btn>
        <Btn label="নিচের ছোট লেখা" onClick={() => run("subscript")}><Subscript size={18} /></Btn>
        <Btn label="উপরের ছোট লেখা" onClick={() => run("superscript")}><Superscript size={18} /></Btn>
        {sep}
        <label title="লেখার রঙ" className="flex cursor-pointer items-center gap-1 rounded-md p-1.5 hover:bg-slate-200">
          <Type size={18} /><input type="color" defaultValue="#dc2626" aria-label="লেখার রঙ" onChange={(e) => run("foreColor", e.target.value)} className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0" />
        </label>
        <label title="হাইলাইট রঙ" className="flex cursor-pointer items-center gap-1 rounded-md p-1.5 hover:bg-slate-200">
          <Highlighter size={18} /><input type="color" defaultValue="#fde047" aria-label="হাইলাইট রঙ" onChange={(e) => run("hiliteColor", e.target.value)} className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0" />
        </label>
        <Btn label="ফরম্যাট মুছুন" onClick={() => run("removeFormat")}><Eraser size={18} /></Btn>
        {sep}
        <Btn label="বামে" onClick={() => run("justifyLeft")}><AlignLeft size={18} /></Btn>
        <Btn label="মাঝে" onClick={() => run("justifyCenter")}><AlignCenter size={18} /></Btn>
        <Btn label="ডানে" onClick={() => run("justifyRight")}><AlignRight size={18} /></Btn>
        <Btn label="দুই পাশ সমান" onClick={() => run("justifyFull")}><AlignJustify size={18} /></Btn>
        {sep}
        <Btn label="বুলেট তালিকা" onClick={() => run("insertUnorderedList")}><List size={18} /></Btn>
        <Btn label="নম্বর তালিকা" onClick={() => run("insertOrderedList")}><ListOrdered size={18} /></Btn>
        {sep}
        <Btn label="লিংক" onClick={link}><Link2 size={18} /></Btn>
        <Btn label="লিংক সরান" onClick={() => run("unlink")}><Unlink size={18} /></Btn>
        <Btn label="ছবি যোগ করুন" onClick={() => { remember(); fileRef.current?.click(); }}><ImageIcon size={18} /></Btn>
        <Btn label="আড়াআড়ি দাগ" onClick={() => run("insertHorizontalRule")}><Minus size={18} /></Btn>
        {sep}
        <Btn label="আগের অবস্থায়" onClick={() => run("undo")}><Undo2 size={18} /></Btn>
        <Btn label="আবার করুন" onClick={() => run("redo")}><Redo2 size={18} /></Btn>
        <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} className="hidden" aria-hidden="true" tabIndex={-1} />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="পোস্টের লেখা"
        data-placeholder="এখানে পোস্ট লিখুন…"
        onInput={sync}
        onBlur={() => { remember(); sync(); }}
        onPaste={(e) => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); sync(); }}
        className="post-html rich-editor min-h-[320px] rounded-b-xl border border-slate-300 bg-white p-4 outline-none focus:border-royal"
      />
      <input type="hidden" name={name} value={html} />
      {busy && <p className="mt-1 text-sm text-slate-500">ছবি ছোট করে আপলোড হচ্ছে…</p>}
      {err && <p role="alert" className="mt-1 text-sm text-red-600">{err}</p>}
      <p className="mt-1 text-xs text-slate-500">লেখা পেস্ট করলে ফরম্যাট ছাড়া সাধারণ লেখা আসে। #হ্যাশট্যাগ লিখলে নিজে থেকে ট্যাগ হবে।</p>
    </div>
  );
}
