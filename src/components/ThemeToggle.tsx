"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = isDark ? "light" : "dark";

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(newTheme);
      return;
    }

    const buttonElement = e.currentTarget;
    const rect = buttonElement.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    buttonElement.animate(
      [
        { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(128,128,128,0)" },
        { transform: "scale(1.4)", boxShadow: "0 0 20px 10px rgba(128,128,128,0.2)" },
        { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(128,128,128,0)" }
      ],
      { duration: 400, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      const shockwave = buttonElement.querySelector("#theme-shockwave") as HTMLElement;
      if (shockwave) {
        shockwave.animate(
          [
            { transform: "scale(0)", opacity: 1, borderWidth: "4px" },
            { transform: `scale(${(endRadius * 2) / 40})`, opacity: 0, borderWidth: "1px" }
          ],
          {
            duration: 900,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          }
        );
      }

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 900,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className={`group relative h-10 w-10 flex items-center justify-center transition-all duration-300 active:scale-95 z-[9999] rounded-full`}
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5 flex items-center justify-center pointer-events-none z-10">
        <Sun
          className={`absolute h-full w-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100 text-current"
            }`}
        />
        <Moon
          className={`absolute h-full w-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDark
            ? "rotate-0 scale-100 opacity-100 text-current"
            : "-rotate-90 scale-0 opacity-0"
            }`}
        />
      </div>

      <div
        id="theme-shockwave"
        className="absolute pointer-events-none rounded-full border border-foreground/10 opacity-0 scale-0 z-0"
        style={{ width: '40px', height: '40px' }}
      />
    </button>
  );
}
