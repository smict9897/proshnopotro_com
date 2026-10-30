"use client";
import { useEffect } from "react";

// .no-copy এর ভেতরে কপি, কাট, রাইট-ক্লিক, ড্র্যাগ ও সিলেক্ট আটকায়
export default function CopyGuard() {
  useEffect(() => {
    const block = (e: Event) => {
      const el = e.target instanceof Element ? e.target : (e.target as Node | null)?.parentElement;
      if (el?.closest(".no-copy")) e.preventDefault();
    };
    const events = ["copy", "cut", "contextmenu", "dragstart", "selectstart"];
    events.forEach((ev) => document.addEventListener(ev, block));
    return () => events.forEach((ev) => document.removeEventListener(ev, block));
  }, []);
  return null;
}
