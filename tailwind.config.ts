import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { navy: { 900: "#0f172a", 800: "#1e293b" }, royal: "#2563eb", hire: "#f97316", paper: "#f8fafc" },
    fontFamily: { sans: ["var(--font-bn)", "system-ui", "sans-serif"] },
  } },
} satisfies Config;
