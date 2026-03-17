import { formatDateTime } from "../lib/formatters";
import { StatusBadge } from "./StatusBadge";

export function Timeline({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-[1.7rem] border border-dashed border-[var(--color-brand-200)] bg-[var(--color-brand-50)]/70 px-5 py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-600)]">No timeline entries</p>
        <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">Movement history will appear here once assets start changing custody or location.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <div key={item.id} className="grid grid-cols-[32px_1fr] gap-4 sm:gap-5">
          <div className="relative flex justify-center">
            <span className="relative z-10 mt-1 size-3 rounded-full bg-[var(--color-brand-500)] shadow-[0_0_0_7px_rgba(12,111,168,0.10)]" />
            {index !== items.length - 1 ? (
              <span className="absolute left-1/2 top-5 bottom-[-20px] w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(12,111,168,0.35),rgba(12,111,168,0.02))]" />
            ) : null}
          </div>
          <div className="rounded-[1.65rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(247,250,255,0.96),rgba(255,255,255,0.92))] p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-6 text-[var(--color-ink-950)]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">{item.description}</p>
              </div>
              {item.status ? <StatusBadge value={item.status} /> : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-ink-400)]">
              <span>{formatDateTime(item.timestamp)}</span>
              {item.meta ? <span className="rounded-full border border-[var(--color-line)] bg-white px-2.5 py-1 text-[10px] tracking-[0.18em] text-[var(--color-ink-500)]">{item.meta}</span> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
