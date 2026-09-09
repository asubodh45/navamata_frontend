import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field } from "@/components/auth/Field";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/signin/")({
  head: () => ({
    meta: [
      { title: "Sign in — Navamata" },
      { name: "description", content: "Return to your Navamata practice." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate({
        to: user.role === "admin" || user.role === "mat_dashboard" ? "/admin" : "/mat/explore",
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      title={
        <>
          Return to <em className="not-italic text-charcoal">your practice.</em>
        </>
      }
      description="Sign in with your Navamata account."
      aside={{
        image:
          "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1400&q=80",
        quote: "The mat is the most honest mirror I keep in the house.",
        caption: "From the Journal — Vol. I",
      }}
      footer={
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-warm-gray">
          <span>New to Navamata?</span>
          <Link to="/signin/explorer" className="text-ink hover:underline">
            Create a free account
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@navamata.co"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label="Passphrase"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center bg-ink text-xs uppercase tracking-[0.22em] text-soft-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Enter the studio"}
        </button>
      </form>
    </AuthShell>
  );
}
