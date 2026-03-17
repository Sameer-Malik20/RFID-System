import { startTransition, useDeferredValue, useState } from "react";
import { ArrowDownUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "../lib/formatters";

function getSearchValue(row, field) {
  if (typeof field === "function") {
    return String(field(row) ?? "");
  }

  return String(row[field] ?? "");
}

export function DataTable({
  title,
  description,
  rows,
  columns,
  searchableFields = [],
  filters,
  actions,
  emptyMessage = "No records matched the current filters.",
  pageSize = 6,
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(columns[0]?.key ?? "");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredRows = rows.filter((row) => {
    if (!deferredQuery) {
      return true;
    }

    return searchableFields.some((field) => getSearchValue(row, field).toLowerCase().includes(deferredQuery));
  });

  const activeColumn = columns.find((column) => column.key === sortKey);
  const sortedRows = [...filteredRows].sort((left, right) => {
    const leftValue = activeColumn?.sortValue ? activeColumn.sortValue(left) : left[sortKey];
    const rightValue = activeColumn?.sortValue ? activeColumn.sortValue(right) : right[sortKey];

    if (leftValue === rightValue) {
      return 0;
    }

    if (leftValue > rightValue) {
      return sortDirection === "asc" ? 1 : -1;
    }

    return sortDirection === "asc" ? -1 : 1;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageRows = sortedRows.slice(startIndex, startIndex + pageSize);

  function handleSort(key) {
    startTransition(() => {
      if (sortKey === key) {
        setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }

      setPage(1);
    });
  }

  function handleQueryChange(nextValue) {
    startTransition(() => {
      setQuery(nextValue);
      setPage(1);
    });
  }

  return (
    <div className="panel">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-1">
          <h2 className="font-display text-2xl text-[var(--color-ink-950)]">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-ink-500)]">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative w-full xl:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-400)]" />
          <input
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Search records"
            className="field pl-11"
          />
        </label>
        {filters ? <div className="flex flex-wrap items-center gap-3">{filters}</div> : null}
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-[var(--color-line)]">
        <div className="overflow-x-auto soft-scroll">
          <table className="min-w-full divide-y divide-[var(--color-line)]">
            <thead className="bg-[var(--color-shell-50)]/80">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn(
                      "px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-ink-400)]",
                      column.headerClassName,
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="inline-flex items-center gap-2 transition hover:text-[var(--color-ink-700)]"
                    >
                      {column.label}
                      <ArrowDownUp className="size-3.5" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)] bg-white/90">
              {pageRows.length > 0 ? (
                pageRows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-[var(--color-brand-50)]/70">
                    {columns.map((column) => (
                      <td key={column.key} className={cn("px-5 py-4 align-top text-sm text-[var(--color-ink-600)]", column.cellClassName)}>
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-[var(--color-ink-400)]">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-ink-500)]">
          Showing <span className="font-semibold text-[var(--color-ink-950)]">{pageRows.length}</span> of{" "}
          <span className="font-semibold text-[var(--color-ink-950)]">{sortedRows.length}</span> records
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="icon-button"
            disabled={safePage === 1}
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
            Page {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="icon-button"
            disabled={safePage === totalPages}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
