"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = useMemo(() => {
    const items = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      
      if (currentPage > 3) {
        items.push("ellipsis-1");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!items.includes(i)) items.push(i);
      }

      if (currentPage < totalPages - 2) {
        items.push("ellipsis-2");
      }

      items.push(totalPages);
    }
    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 animate-float-up" style={{ animationDelay: '0.2s' }}>
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 hidden sm:block">
        Showing <span className="text-foreground">Page {currentPage}</span> of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="group relative h-10 px-4 rounded-xl border border-border/40 bg-secondary/30 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground disabled:opacity-20 disabled:pointer-events-none active:scale-95 transition-all hover:border-border/60 hover:text-foreground overflow-hidden"
          aria-label="Previous Page"
        >
          <div className="relative z-10 flex items-center gap-2">
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden xs:inline">Prev</span>
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </button>
        <div className="flex items-center gap-1.5 p-1 rounded-[1.25rem] border border-border/20 bg-secondary/10 backdrop-blur-sm">
          {pages.map((page, idx) => {
            if (typeof page === "string") {
              return (
                <div key={page} className="w-8 h-10 flex items-center justify-center text-muted-foreground/30">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }

            const isActive = currentPage === page;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative h-10 w-10 rounded-xl text-xs font-bold transition-all duration-500 overflow-hidden ${isActive ? "text-background" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
              >
                <span className="relative z-10">{page}</span>
                {isActive && (
                  <motion.div
                    layoutId="activePage"
                    className="absolute inset-0 bg-foreground"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="group relative h-10 px-4 rounded-xl border border-border/40 bg-secondary/30 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground disabled:opacity-20 disabled:pointer-events-none active:scale-95 transition-all hover:border-border/60 hover:text-foreground overflow-hidden"
          aria-label="Next Page"
        >
          <div className="relative z-10 flex items-center gap-2">
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </button>
      </div>

      <div className="sm:hidden text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
