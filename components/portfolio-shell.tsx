"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const THEMES: Record<Theme, Record<string, string>> = {
  dark: {
    "--bg": "#0b0d14",
    "--card": "rgba(255,255,255,0.05)",
    "--border": "rgba(255,255,255,0.12)",
    "--text": "#ffffff",
    "--muted": "#9a9a9a",
  },
  light: {
    "--bg": "#f5f6fb",
    "--card": "#ffffff",
    "--border": "rgba(0,0,0,0.1)",
    "--text": "#16181d",
    "--muted": "#5f6470",
  },
};

const links = [
  ["Home", "#hero"],
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
];

export default function PortfolioShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hire-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("hire-theme", next);
    } catch {}
  };

  return (
    <div
      style={THEMES[theme] as React.CSSProperties}
      className="min-h-screen scroll-smooth bg-[var(--bg)] text-[var(--text)]"
    >
      <header className="border-b border-[var(--border)] bg-[var(--bg)]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#hero" className="font-semibold">
            <span className="text-[#e64157]">&lt;</span> Saiful Islam{" "}
            <span className="text-[#415de6]">/&gt;</span>
          </a>
          <div className="flex items-center gap-4">
            <ul className="hidden gap-5 text-sm md:flex">
              {links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-[var(--muted)] transition hover:text-[var(--text)]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={toggle}
              aria-label="Switch theme"
              className="rounded-full border border-[var(--border)] px-3 py-1 text-sm"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>
      </header>

      {children}

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-24 left-4 z-40 rounded-lg bg-gradient-to-r from-[#e64157] to-[#415de6] px-3 py-2 text-white shadow-lg"
        >
          ↑
        </button>
      )}
    </div>
  );
}
