import { cn, getBadgeClass } from "../lib/formatters";

export function StatusBadge({ value, className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        getBadgeClass(value),
        className,
      )}
    >
      {value}
    </span>
  );
}
