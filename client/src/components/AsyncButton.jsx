import { LoaderCircle } from "lucide-react";
import { cn } from "../lib/formatters";

export function AsyncButton({ loading, children, className, variant, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(variant === "secondary" ? "secondary-button" : "primary-button", "gap-2 disabled:cursor-not-allowed disabled:opacity-70", className)}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
