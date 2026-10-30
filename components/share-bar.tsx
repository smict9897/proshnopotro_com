"use client";
import { useState } from "react";
import { Check, Link2, MessageCircle, Send, Share2 } from "lucide-react";

export default function ShareBar({ url, title, tags }: { url: string; title: string; tags: string[] }) {
  const [copied, setCopied] = useState(false);
  const hashtags = tags.slice(0, 5).map((t) => `#${t}`).join(" ");
  const text = [title, hashtags].filter(Boolean).join("\n");
  const b = "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}${tags[0] ? `&hashtag=${encodeURIComponent(`#${tags[0]}`)}` : ""}`;
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm text-slate-500"><Share2 size={16} />শেয়ার করুন</span>
      <a href={fb} target="_blank" rel="noopener noreferrer" className={b}>Facebook</a>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`} target="_blank" rel="noopener noreferrer" className={b}><MessageCircle size={16} />WhatsApp</a>
      <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className={b}><Send size={16} />Telegram</a>
      <button type="button" onClick={copy} className={b}>{copied ? <Check size={16} /> : <Link2 size={16} />}{copied ? "কপি হয়েছে" : "লিংক কপি"}</button>
    </div>
  );
}
