"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/Button";
import { AuthGuard } from "@/components/AuthGuard";
import { FadeUp, FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/motion";
import { Input } from "@/components/Input";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Mail, ShieldCheck, Loader2, User, Calendar, Hash, Fingerprint, X, Key, Pencil, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";

interface UserProfile {
  username: string;
  email: string;
  id: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Status states
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [editForm, setEditForm] = useState({ username: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/users/profile");
      setUser(data);
    } catch (err: any) {
      // AuthGuard handles initial check
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleLogout = async () => {
    try { await api.get("/users/logout"); } catch { /* ignore */ }
    localStorage.removeItem("token");
    router.push("/login");
  };

  const openEdit = () => {
    setEditForm({ username: user?.username || "", email: user?.email || "" });
    setEditOpen(true);
    setError(null);
    setSuccess(null);
    setFormError(null);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(null); setSuccess(null); setFormError(null);
    try {
      const { data } = await api.put("/users/profile", editForm);
      setUser({ ...user, username: data.username, email: data.email } as UserProfile);
      setSuccess("Profile updated successfully!");
      setEditOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally { setSaving(false); }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(null); setSuccess(null); setFormError(null);
    try {
      await api.put("/users/change-password", passwordForm);
      setSuccess("Password changed successfully!");
      setPasswordOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || "Failed to change password.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true); setError(null); setSuccess(null); setFormError(null);
    try {
      await api.delete("/users/profile");
      localStorage.removeItem("token");
      router.push("/login");
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || "Failed to delete account.");
      setSaving(false);
    }
  };

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
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <FadeIn>
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </FadeIn>
        </div>
      ) : (
        <div className="min-h-screen pt-28 pb-24 relative z-10">
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

            {/* Alerts */}
            <AnimatePresence>
              {success && (
                <FadeUp className="mb-6 rounded-xl bg-secondary/40 border border-border/40 px-4 py-3 text-sm text-muted-foreground flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 opacity-60" />
                    <span className="font-medium">{success}</span>
                  </div>
                  <button onClick={() => setSuccess(null)} className="ml-4 text-xs font-semibold hover:underline shrink-0 opacity-60 hover:opacity-100">Dismiss</button>
                </FadeUp>
              )}
              {error && (
                <FadeUp className="mb-6 rounded-xl bg-secondary/80 border border-border/60 px-4 py-3 text-sm text-foreground flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{error}</span>
                  </div>
                  <button onClick={() => setError(null)} className="ml-4 text-xs font-semibold hover:underline shrink-0 opacity-60 hover:opacity-100">Dismiss</button>
                </FadeUp>
              )}
            </AnimatePresence>

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

            {/* Main Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FadeUp delay={0.15} className="h-full">
                <button
                  onClick={openEdit}
                  className="w-full h-full flex flex-col items-center justify-center p-6 rounded-3xl border border-border/40 bg-background/50 hover:bg-secondary/20 hover:border-border/60 transition-all duration-300 shadow-sm hover:shadow-md group active:scale-95"
                >
                  <div className="h-10 w-10 rounded-full bg-secondary/80 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Pencil className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm">Edit Profile</span>
                </button>
              </FadeUp>
              <FadeUp delay={0.18} className="h-full">
                <button
                  onClick={() => { setPasswordOpen(true); setError(null); setSuccess(null); setFormError(null); }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 rounded-3xl border border-border/40 bg-background/50 hover:bg-secondary/20 hover:border-border/60 transition-all duration-300 shadow-sm hover:shadow-md group active:scale-95"
                >
                  <div className="h-10 w-10 rounded-full bg-secondary/80 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Key className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm">Change Password</span>
                </button>
              </FadeUp>
            </div>

            {/* Secondary / Destructive Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <FadeUp delay={0.21} className="h-full">
                <button
                  onClick={() => { setDeleteOpen(true); setError(null); setSuccess(null); setFormError(null); }}
                  className="w-full flex items-center justify-between p-5 rounded-[2rem] border border-destructive/10 bg-destructive/[0.02] hover:bg-destructive/[0.05] hover:border-destructive/20 transition-all duration-300 shadow-sm group active:scale-[0.98] text-destructive/80 hover:text-destructive"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-destructive/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Trash2 className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Delete Account</p>
                      <p className="text-[10px] opacity-60 font-medium uppercase tracking-wider mt-0.5">Permanent action</p>
                    </div>
                  </div>
                </button>
              </FadeUp>
              <FadeUp delay={0.24} className="h-full">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-5 rounded-[2rem] border border-border/40 bg-secondary/10 hover:bg-secondary/20 hover:border-border/60 transition-all duration-300 shadow-sm group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-foreground">Sign Out</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">End session</p>
                    </div>
                  </div>
                </button>
              </FadeUp>
            </div>

          </div>

          {/* Modals */}
          <AnimatePresence>
            {editOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setEditOpen(false)}
                />
                <ScaleIn className="relative w-full max-w-md rounded-[2rem] border border-border/60 bg-background shadow-2xl">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold tracking-tight">Edit Profile</h2>
                      <button type="button" onClick={() => setEditOpen(false)} className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors bg-secondary/50"><X className="h-4 w-4" /></button>
                    </div>
                    <form onSubmit={handleEdit} className="space-y-4">
                      {formError && (
                        <FadeIn className="rounded-lg border border-border/60 bg-secondary/80 px-4 py-3 text-sm text-foreground font-bold flex items-center gap-2.5 shadow-sm">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          {formError}
                        </FadeIn>
                      )}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Username</label>
                        <Input className="rounded-xl h-12 px-4" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} required autoFocus />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Email</label>
                        <Input className="rounded-xl h-12 px-4" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" className="rounded-xl h-11" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button type="submit" className="rounded-xl h-11 px-6" disabled={saving}>
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </ScaleIn>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {passwordOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setPasswordOpen(false)}
                />
                <ScaleIn className="relative w-full max-w-md rounded-[2rem] border border-border/60 bg-background shadow-2xl">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold tracking-tight">Change Password</h2>
                      <button type="button" onClick={() => setPasswordOpen(false)} className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors bg-secondary/50"><X className="h-4 w-4" /></button>
                    </div>
                    <form onSubmit={handlePassword} className="space-y-4">
                      {formError && (
                        <FadeIn className="rounded-lg border border-border/60 bg-secondary/80 px-4 py-3 text-sm text-foreground font-bold flex items-center gap-2.5 shadow-sm">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          {formError}
                        </FadeIn>
                      )}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Current Password</label>
                        <Input className="rounded-xl h-12 px-4" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required autoFocus />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">New Password</label>
                        <Input className="rounded-xl h-12 px-4" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" className="rounded-xl h-11" onClick={() => setPasswordOpen(false)}>Cancel</Button>
                        <Button type="submit" className="rounded-xl h-11 px-6" disabled={saving}>
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </ScaleIn>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {deleteOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setDeleteOpen(false)}
                />
                <ScaleIn className="relative w-full max-w-sm rounded-[2rem] border border-border/60 bg-background shadow-2xl text-center">
                  <div className="p-6 sm:p-8">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
                      <Trash2 className="h-6 w-6 text-destructive" />
                    </div>
                    <h2 className="font-bold text-xl mb-2">Delete Account?</h2>
                    <p className="text-sm text-muted-foreground mb-8">
                      This action is <strong className="text-foreground">permanent</strong>. All your contacts and profile data will be permanently removed.
                    </p>
                    {formError && (
                      <FadeIn className="mb-6 rounded-lg border border-border/60 bg-secondary/80 px-4 py-3 text-sm text-foreground font-bold text-left flex items-center gap-2.5 shadow-sm">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        {formError}
                      </FadeIn>
                    )}
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Button variant="outline" className="rounded-xl h-11 w-full" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                      <Button variant="outline" className="rounded-xl h-11 w-full border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleDelete} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Delete Forever"}
                      </Button>
                    </div>
                  </div>
                </ScaleIn>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AuthGuard>
);
}
