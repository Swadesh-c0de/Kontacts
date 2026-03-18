import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-foreground text-background shadow-md hover:bg-foreground/90 hover:shadow-lg hover:-translate-y-0.5":
              variant === "default",
            "border border-border/40 bg-background hover:bg-secondary hover:text-foreground hover:border-border/60 hover:shadow-sm":
              variant === "outline",
            "hover:bg-secondary hover:text-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80":
              variant === "secondary",
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90":
              variant === "destructive",
          },
          {
            "h-11 px-5 py-2.5": size === "default",
            "h-9 rounded-lg px-3.5 text-xs": size === "sm",
            "h-12 rounded-2xl px-8 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      >
        {/* Shine effect for default variant */}
        {variant === "default" && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        )}
        {props.children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, cn };
