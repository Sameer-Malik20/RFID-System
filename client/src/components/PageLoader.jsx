export function PageLoader({ title = "Loading workspace...", detail = "Pulling enterprise modules, permissions, and live registers into view." }) {
  return (
    <div className="panel page-enter">
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[var(--color-brand-100)]">
        <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--color-brand-600)]" />
      </div>
      <h2 className="mt-4 font-display text-3xl text-[var(--color-ink-950)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">{detail}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/85" />
        ))}
      </div>
    </div>
  );
}
