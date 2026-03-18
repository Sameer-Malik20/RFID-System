import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { AsyncButton } from "../components/AsyncButton";
import { PasswordField } from "../components/PasswordField";

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(12,111,168,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(7,24,49,0.12),transparent_24%),var(--color-shell-25)] px-5 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-brand-200)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--color-brand-700)]">
            <ShieldCheck className="size-4" />
            Enterprise RFID Command
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--color-brand-600)]">Executive Layer</p>
            <h1 className="mt-4 font-display text-5xl leading-tight text-[var(--color-ink-950)]">Secure access to the full RFID asset control stack.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-ink-500)]">
              Sign in with department credentials to see only the modules, users, requests, logs, and assets relevant to your operational scope.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Role-aware views by department and responsibility",
              "Password change supported for every user",
              "Super admin controls user creation and approvals",
            ].map((item) => (
              <div key={item} className="panel-alt text-sm leading-6 text-[var(--color-ink-500)]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="inline-flex size-14 items-center justify-center rounded-[1.4rem] bg-[var(--color-shell-950)] text-white">
            <LockKeyhole className="size-6" />
          </div>
          <h2 className="mt-5 font-display text-3xl text-[var(--color-ink-950)]">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">Use your issued enterprise credentials to access the RFID command workspace.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-ink-700)]">Email</span>
              <input className="field" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
            </label>
            <PasswordField label="Password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
            <AsyncButton type="submit" loading={loading} className="w-full mt-4">
              Continue to workspace
            </AsyncButton>
          </form>
        </div>
      </div>
    </div>
  );
}
