import * as React from "react";
import { cn } from "./Button";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border/40 bg-background/50 px-4 py-2 text-sm placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] backdrop-blur-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
