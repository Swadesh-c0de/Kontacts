"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/Button";
import { AuthGuard } from "@/components/AuthGuard";
import { FadeUp, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import {
  LogOut, Mail, ShieldCheck, Loader2, User,
  Calendar, Hash, Fingerprint,
} from "lucide-react";

interface UserProfile {
  username: string;
  email: string;
  id: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/users/profile");
      setUser(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleLogout = async () => {
    try { await api.get("/users/logout"); } catch { /* ignore */ }
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FadeIn>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </FadeIn>
      </div>
    );
  }

  const initial = user?.username?.charAt(0)?.toUpperCase() || "U";
  const profileDetails = [
    { label: "Username", value: user?.username || "—", icon: User },
    { label: "Email Address", value: user?.email || "—", icon: Mail },
    { label: "User ID", value: user?.id || "—", icon: Hash, mono: true },
    { label: "Account Status", value: "Verified & Secured", icon: ShieldCheck },
    { label: "Security", value: "JWT-authenticated session", icon: Fingerprint },
    { label: "Member Since", value: "2026", icon: Calendar },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <FadeUp className="mb-8 text-center flex flex-col items-center">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1] mb-2">
              Your <span className="font-cursive font-normal text-primary drop-shadow-sm">Profile</span>
            </h1>
            <p className="text-muted-foreground/80 max-w-xs leading-relaxed text-sm font-medium">
              Account details and session management.
            </p>
          </FadeUp>

          {/* Identity Card */}
          <FadeUp delay={0.06} className="rounded-2xl border border-border/40 bg-secondary/5 p-6 sm:p-8 mb-4 text-center sm:text-left group transition-all duration-300 hover:bg-secondary/10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 shadow-md ring-2 ring-background">
                <span className="text-3xl sm:text-4xl font-bold tracking-tighter">{initial}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 truncate">{user?.username || "—"}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2.5 text-muted-foreground">
                  <div className="h-8 w-8 rounded-xl bg-background flex items-center justify-center border border-border/40">
                    <Mail className="h-4 w-4 opacity-70" />
                  </div>
                  <span className="text-sm sm:text-base font-medium truncate">{user?.email || "—"}</span>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Details — staggered rows */}
          <FadeUp delay={0.12} className="rounded-[2.5rem] border border-border/40 bg-background overflow-hidden mb-6 shadow-sm">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/20">
              {profileDetails.map((item, idx) => (
                <StaggerItem key={item.label}>
                  <div className={`flex items-center gap-5 px-6 py-5 hover:bg-secondary/5 transition-colors duration-200 ${idx >= 4 ? "" : "md:border-b md:border-border/20"}`}>
                    <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-secondary/20 shrink-0 border border-border/10 text-muted-foreground group-hover:text-foreground transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em] mb-1 opacity-60">{item.label}</p>
                      <p className={`text-[15px] truncate ${item.mono ? "font-mono text-xs opacity-80" : "font-bold tracking-tight text-foreground/90"}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeUp>

          {/* Sign Out */}
          <FadeUp delay={0.18} className="rounded-3xl border border-border/40 bg-secondary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border-dashed">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-base tracking-tight mb-1">Sign out</h3>
              <p className="text-sm text-muted-foreground opacity-80">Securely end your session on this device.</p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLogout}
              className="rounded-2xl px-6 h-12 border-border/40 hover:bg-foreground hover:text-background transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </FadeUp>

        </div>
      </div>
    </AuthGuard>
  );
}
