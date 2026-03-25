import * as React from "react";
import { cn } from "./Button";
import { Eye, EyeOff } from "lucide-react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full group/input">
        <input
          type={inputType}
          className={cn(
            "flex h-11 w-full rounded-xl border border-border/40 bg-background/50 px-4 py-2 text-sm placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] backdrop-blur-sm",
            isPassword && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-secondary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
