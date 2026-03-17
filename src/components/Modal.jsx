import { X } from "lucide-react";

export function Modal({ open, title, description, onClose, children, width = "max-w-2xl" }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,20,40,0.32)] p-4 backdrop-blur-sm">
      <div className={`w-full ${width} panel page-enter max-h-[92vh] overflow-y-auto`}>
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-line)] pb-5">
          <div className="space-y-1">
            <h2 className="font-display text-2xl text-[var(--color-ink-950)]">{title}</h2>
            {description ? <p className="text-sm leading-6 text-[var(--color-ink-500)]">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-2xl border border-[var(--color-line)] bg-white text-[var(--color-ink-500)] transition hover:-translate-y-0.5 hover:border-[var(--color-brand-200)] hover:text-[var(--color-brand-700)]"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}
