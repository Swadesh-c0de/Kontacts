"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AuthGuard } from "@/components/AuthGuard";
import { AnimatePresence, motion } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, ScaleIn, FadeIn } from "@/components/motion";
import {
  Plus, Search, Mail, Phone, Loader2,
  User, X, Pencil, Trash2, LayoutGrid, List,
} from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const fetchContacts = useCallback(async () => {
    try {
      const { data } = await api.get("/contacts");
      setContacts(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else setError("Could not load contacts.");
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await api.post("/contacts", form);
      setContacts([data, ...contacts]);
      setAddOpen(false); setForm({ name: "", email: "", phone: "" });
    } catch { setError("Failed to add contact."); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!activeContact) return; setSaving(true);
    try {
      const { data } = await api.put(`/contacts/${activeContact._id}`, form);
      setContacts(contacts.map((c) => (c._id === data._id ? data : c)));
      setEditOpen(false); setActiveContact(null);
    } catch { setError("Failed to update contact."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!activeContact) return; setSaving(true);
    try {
      await api.delete(`/contacts/${activeContact._id}`);
      setContacts(contacts.filter((c) => c._id !== activeContact._id));
      setDeleteOpen(false); setActiveContact(null);
    } catch { setError("Failed to delete contact."); }
    finally { setSaving(false); }
  };

  const openEdit = (c: Contact) => { setActiveContact(c); setForm({ name: c.name, email: c.email, phone: c.phone }); setEditOpen(true); };
  const openDelete = (c: Contact) => { setActiveContact(c); setDeleteOpen(true); };

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FadeIn>
          <div className="flex items-center mb-6">
            <span className="text-4xl font-black tracking-tighter">Log</span>
            <span className="text-5xl font-cursive font-medium -ml-0.5 text-primary">Book</span>
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-foreground/20"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: [0.23, 1, 0.32, 1],
                }}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen pt-28 pb-24 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="mb-8 text-center flex flex-col items-center animate-float-up" style={{ animationDelay: '0s' }}>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-2">
              Manage Your<br />
              <span className="font-cursive font-normal text-primary">Connections</span>
            </h1>
            <p className="text-muted-foreground/80 max-w-xs leading-relaxed text-xs sm:text-sm">
              Your professional network, beautifully organized.
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 mb-8 animate-float-up" style={{ animationDelay: '0.1s' }}>

            <div className="relative flex-1 max-w-sm group mx-auto sm:mx-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors duration-200" />
              <input
                className="w-full h-10 glass border-border/40 rounded-xl pl-9 pr-8 text-sm placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground/20 focus:bg-secondary/50 transition-all duration-300"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground transition-all duration-300 active:scale-90">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center rounded-xl border border-border/40 glass p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-90 ${view === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-90 ${view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="hidden sm:flex items-center h-10 px-3 rounded-xl border border-border/40 glass text-xs tabular-nums text-muted-foreground transition-colors duration-300">
                <span className="font-bold text-foreground mr-1">{search ? filtered.length : contacts.length}</span>
                <span className="opacity-60">{search ? "found" : "total"}</span>
              </div>

              <Button onClick={() => { setForm({ name: "", email: "", phone: "" }); setAddOpen(true); }} size="default" className="h-10 rounded-xl px-4">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">New</span>
              </Button>
            </div>
          </div>

          {error && (
            <FadeUp className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
              <span className="font-medium">{error}</span>
              <button onClick={() => setError(null)} className="ml-4 text-xs font-semibold hover:underline shrink-0">Dismiss</button>
            </FadeUp>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            >
              {filtered.length === 0 ? (
                <FadeUp className="flex flex-col items-center justify-center py-28 text-center">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-base mb-1">No contacts found</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {contacts.length === 0 ? "Add your first contact to get started." : "Try a different search term."}
                  </p>
                </FadeUp>
              ) : view === "grid" ? (
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {filtered.map((c, idx) => (
                    <StaggerItem key={c._id}>
                      <div className="group relative rounded-[1.5rem] border border-border/40 glass p-4 sm:p-5 transition-all duration-500 hover:bg-secondary/10 hover:border-border/60 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col overflow-hidden will-change-transform h-full animate-float-up" style={{ animationDelay: `${0.2 + idx * 0.05}s` }}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-10 w-10 rounded-full bg-secondary text-foreground flex items-center justify-center text-sm font-bold tracking-tight ring-1 ring-inset ring-border/80 group-hover:bg-foreground group-hover:text-background transition-all duration-500 shadow-sm">
                            {c.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="flex items-center gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 lg:-translate-y-1 lg:group-hover:translate-y-0 relative z-10 bg-background/50 sm:bg-transparent p-1 sm:p-0 rounded-full">
                            <button
                              onClick={() => openEdit(c)}
                              className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full text-muted-foreground hover:text-foreground bg-secondary hover:bg-foreground/10 transition-colors shadow-sm sm:shadow-none"
                              aria-label="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDelete(c)}
                              className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full text-muted-foreground hover:text-foreground bg-secondary hover:bg-foreground/10 transition-colors shadow-sm sm:shadow-none"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-bold text-lg tracking-tight truncate group-hover:text-primary transition-colors duration-300" title={c.name}>
                            {c.name}
                          </h3>
                        </div>

                        <div className="mt-auto space-y-3 pt-4 border-t border-border/40">
                          <div className="flex items-center gap-3 text-muted-foreground text-[14px] font-medium group-hover:text-foreground/80 transition-colors duration-300">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary/80 text-muted-foreground group-hover:bg-foreground/10 group-hover:text-foreground transition-all duration-300">
                              <Mail className="h-4 w-4" />
                            </div>
                            <span className="truncate" title={c.email}>{c.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground text-[14px] font-medium group-hover:text-foreground/80 transition-colors duration-300">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary/80 text-muted-foreground group-hover:bg-foreground/10 group-hover:text-foreground transition-all duration-300">
                              <Phone className="h-4 w-4" />
                            </div>
                            <span className="truncate" title={c.phone}>{c.phone}</span>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <StaggerContainer className="flex flex-col gap-3">
                  {filtered.map((c) => (
                    <StaggerItem key={c._id}>
                      <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-2 sm:pr-4 rounded-[1.5rem] sm:rounded-full border border-border/40 bg-background hover:bg-secondary/10 hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-300 will-change-transform">
                        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                          <div className="h-14 w-14 sm:h-12 sm:w-12 shrink-0 rounded-full bg-secondary text-foreground flex items-center justify-center text-lg sm:text-base font-bold tracking-tight ring-1 ring-inset ring-border/80 group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                            {c.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0 flex-1">
                            <p className="font-bold text-[16px] sm:text-[15px] truncate sm:min-w-[160px] lg:min-w-[200px] mt-0.5 sm:mt-0">{c.name}</p>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8 min-w-0 flex-1 text-[13px] text-muted-foreground font-medium mt-1 sm:mt-0">
                              <span className="flex items-center gap-2 truncate group-hover:text-foreground/80 transition-colors duration-300">
                                <Mail className="h-3.5 w-3.5 opacity-40 shrink-0 hidden sm:block" />
                                {c.email}
                              </span>
                              <span className="flex items-center gap-2 truncate group-hover:text-foreground/80 transition-colors duration-300">
                                <Phone className="h-3.5 w-3.5 opacity-40 shrink-0 hidden sm:block" />
                                {c.phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-4 sm:mt-0 border-t border-border/40 sm:border-0 pt-3 sm:pt-0 shrink-0">
                          <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => openEdit(c)}
                              className="flex items-center justify-center gap-1.5 px-4 sm:px-0 py-2 sm:py-0 sm:h-9 sm:w-9 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground bg-secondary/60 sm:bg-transparent hover:bg-secondary transition-all"
                            >
                              <Pencil className="h-3.5 w-3.5" /> <span className="sm:hidden">Edit</span>
                            </button>
                            <button
                              onClick={() => openDelete(c)}
                              className="flex items-center justify-center gap-1.5 px-4 sm:px-0 py-2 sm:py-0 sm:h-9 sm:w-9 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground bg-secondary/60 sm:bg-transparent hover:bg-secondary transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> <span className="sm:hidden">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modals — all use AnimatePresence + ScaleIn for spring physics */}

        <AnimatePresence>
          {addOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="fixed inset-0 bg-background/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setAddOpen(false)}
              />
              <ScaleIn className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold tracking-tight">New Contact</h2>
                    <button onClick={() => setAddOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="h-4 w-4" /></button>
                  </div>
                  <form onSubmit={handleAdd} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" required autoFocus />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</label>
                      <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" required />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </form>
                </div>
              </ScaleIn>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editOpen && activeContact && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="fixed inset-0 bg-background/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setEditOpen(false)}
              />
              <ScaleIn className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold tracking-tight">Edit Contact</h2>
                    <button onClick={() => setEditOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="h-4 w-4" /></button>
                  </div>
                  <form onSubmit={handleEdit} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</label>
                      <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </form>
                </div>
              </ScaleIn>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteOpen && activeContact && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="fixed inset-0 bg-background/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDeleteOpen(false)}
              />
              <ScaleIn className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-card shadow-xl text-center">
                <div className="p-6">
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                    <Trash2 className="h-5 w-5 text-foreground/70" />
                  </div>
                  <h2 className="font-bold text-lg mb-1">Delete contact?</h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    <strong className="text-foreground">{activeContact.name}</strong> will be permanently removed.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button variant="outline" onClick={handleDelete} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                    </Button>
                  </div>
                </div>
              </ScaleIn>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}
