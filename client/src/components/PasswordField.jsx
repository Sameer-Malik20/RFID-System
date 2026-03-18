import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({ label, className = "space-y-2", inputClassName = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className={className}>
      {label ? <span className="text-sm font-semibold text-[var(--color-ink-700)]">{label}</span> : null}
      <div className="relative">
        <input {...props} type={visible ? "text" : "password"} className={`field pr-12 ${inputClassName}`.trim()} />
        <button
          type="button"
          className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-[0.9rem] text-[var(--color-ink-400)] transition hover:bg-[var(--color-shell-50)] hover:text-[var(--color-brand-700)] focus:outline-none focus:ring-2 focus:ring-[rgba(12,111,168,0.12)]"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}
