export function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-brand-600)]">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1 className="font-display text-3xl text-[var(--color-ink-950)] sm:text-4xl">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--color-ink-500)] sm:text-base">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
