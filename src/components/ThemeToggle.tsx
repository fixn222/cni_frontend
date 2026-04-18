// Responsive refresh: the theme toggle now initializes safely and uses a calmer animated control.
import { useEffect, useState } from "react";

export default function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(saved === "dark" || (!saved && prefersDark));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark, mounted]);

  return (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 ${className ?? ""}`}
      aria-label="Toggle theme"
    >
      <span className="transition-transform duration-300">
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
