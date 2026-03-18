import { generateBarcodeBars } from "../lib/formatters";

export function BarcodeCard({ value, label }) {
  const bars = generateBarcodeBars(value);

  return (
    <div className="panel-alt">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-ink-400)]">{label}</p>
          <p className="mt-2 font-display text-xl text-[var(--color-ink-950)]">{value}</p>
        </div>
        <div className="rounded-[1.5rem] border border-dashed border-[var(--color-brand-200)] bg-white px-4 py-5">
          <div className="flex items-end justify-center gap-[2px]">
            {bars.map((bar) => (
              <span
                key={bar.id}
                className={bar.dark ? "bg-[var(--color-ink-950)]" : "bg-[var(--color-brand-100)]"}
                style={{ width: `${bar.width}px`, height: `${bar.height}px` }}
              />
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-xs tracking-[0.35em] text-[var(--color-ink-400)]">{value}</p>
        </div>
      </div>
    </div>
  );
}
