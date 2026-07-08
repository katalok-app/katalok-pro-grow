import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ApiError, login } from "@/lib/katalok-api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Katalok" },
      { name: "description", content: "Sign in to your Katalok account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | Error | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const { user } = await login(phone.trim(), password);
      navigate({ to: user.role === "PROFESSIONAL" ? "/onboarding" : "/" });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign in failed"));
    } finally {
      setLoading(false);
    }
  }

  const details = error instanceof ApiError ? error.details : [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <span className="eyebrow">Welcome back</span>
            <h1 className="mt-3 text-3xl sm:text-4xl">
              Sign in to <span className="italic text-mocha">Katalok</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Use your WhatsApp number and password.
            </p>
          </div>

          <form onSubmit={onSubmit} className="card-soft mt-8 grid gap-4 p-6 sm:p-8">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">WhatsApp number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6 ..."
                required
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <p className="font-medium">{error.message}</p>
                {details.length > 0 && (
                  <ul className="mt-1 list-disc pl-5">
                    {details.map((d, i) => (
                      <li key={i}>{d.field ? `${d.field}: ${d.message}` : d.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              No account yet?{" "}
              <Link to="/" hash="waitlist" className="font-medium text-primary hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
