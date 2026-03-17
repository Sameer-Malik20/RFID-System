import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/formatters";

const toneClasses = {
  brand: "from-[var(--color-brand-700)]/12 via-white to-white",
  green: "from-emerald-500/12 via-white to-white",
  amber: "from-amber-500/12 via-white to-white",
  red: "from-rose-500/12 via-white to-white",
  blue: "from-sky-500/12 via-white to-white",
};

export function StatCard({ icon: Icon, label, value, detail, trend, tone = "brand" }) {
  return (
    <div className={cn("panel metric-shine relative overflow-hidden bg-gradient-to-br", toneClasses[tone])}>
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-[var(--color-brand-700)] shadow-[0_18px_40px_-26px_rgba(15,23,42,0.7)]">
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-ink-400)]">{label}</p>
            <div className="mt-2 flex items-end gap-3">
              <p className="font-display text-3xl text-[var(--color-ink-950)]">{value}</p>
              {trend ? (
                <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-50)] px-2 py-1 text-xs font-semibold text-[var(--color-brand-700)]">
                  <ArrowUpRight className="size-3.5" />
                  {trend}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <p className="max-w-32 text-right text-sm leading-6 text-[var(--color-ink-500)]">{detail}</p>
      </div>
    </div>
  );
}
