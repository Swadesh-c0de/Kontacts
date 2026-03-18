"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    try { await api.get("/users/logout"); } catch { /* ignore */ }
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) return null;

  const navLinks = isAuthenticated
    ? [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Profile", href: "/profile", icon: User },
    ]
    : [
      { name: "Log In", href: "/login", icon: User },
    ];

  return (
    <>
      <div className={`fixed top-0 inset-x-0 h-0.5 bg-foreground z-[100] transition-transform duration-1000 origin-left ${navigating ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`} />

      <motion.header
        className="vt-navbar fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        initial={{ opacity: 0, y: -16 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -100,
        }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.nav
          className={`relative flex items-center justify-between pointer-events-auto overflow-hidden will-change-[width,height,transform] rounded-2xl sm:rounded-[2.5rem] glass transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${scrolled
            ? "w-[calc(100%-2rem)] max-w-2xl h-11 sm:h-12 px-4 shadow-lg ring-1 ring-foreground/5 bg-background/80"
            : "w-full max-w-4xl h-16 sm:h-18 px-6 sm:px-8 shadow-none"
            }`}
        >
          {scrolled && (
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent pointer-events-none animate-pulse" />
          )}

          <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105 active:scale-95" onClick={() => setNavigating(true)}>
            <div className="relative flex flex-row items-center">
              <span className={`font-black tracking-tighter leading-none transition-all duration-500 ${scrolled ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>Link</span>
              <span className={`font-cursive font-medium -ml-0.5 text-primary leading-none transition-all duration-500 ${scrolled ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>Book</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setNavigating(true)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] ${isActive
                    ? "bg-foreground text-background shadow-md shadow-foreground/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}

            <div className="mx-2 h-6 w-px bg-border/60 transition-colors duration-500" />

            <div className="hover:bg-secondary/80 rounded-xl transition-all duration-300 text-muted-foreground hover:text-foreground p-1 active:scale-95 cursor-pointer">
              <ThemeToggle />
            </div>

            {isAuthenticated && (
              <button
                onClick={() => { setNavigating(true); handleLogout(); }}
                className="ml-1.5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-background hover:bg-foreground transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] border border-transparent hover:border-foreground"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center group active:scale-95 transition-transform duration-200">
            <ThemeToggle />
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile Bottom Nav */}
      <motion.div
        className="vt-bottom-nav md:hidden fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
      >
        <div className={`flex items-center justify-around w-full max-w-sm p-1.5 transition-all duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] pointer-events-auto rounded-[2rem] will-change-transform bg-background/80 backdrop-blur-md border border-border/40 shadow-md ${scrolled ? "ring-1 ring-foreground/5 scale-[0.98]" : "scale-100"}`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setNavigating(true)}
                className={`group flex flex-col items-center justify-center flex-1 py-2 rounded-[1.5rem] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90 ${isActive
                  ? "bg-foreground text-background shadow-md shadow-foreground/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5`} />
                <span className="text-[10px] sm:text-xs font-bold tracking-tight mt-0.5 transition-opacity duration-300">{link.name}</span>
              </Link>
            );
          })}

          {isAuthenticated && (
            <button
              onClick={() => { setNavigating(true); handleLogout(); }}
              className="group flex flex-col items-center justify-center flex-1 py-2 rounded-[1.5rem] text-muted-foreground hover:text-background hover:bg-foreground active:scale-90 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              <span className="text-[10px] sm:text-xs font-bold tracking-tight mt-0.5">Sign Out</span>
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
