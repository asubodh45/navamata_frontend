import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field } from "@/components/auth/Field";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/signin/explorer")({
  head: () => ({
    meta: [
      { title: "Create your account — Navamata" },
      {
        name: "description",
        content: "A free account to explore the practice library.",
      },
    ],
  }),
  component: ExplorerRegisterPage,
});

function ExplorerRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    const next: Record<string, string> = {};
    if (!name) next.name = "Please enter your name";
    if (!email.includes("@")) next.email = "A valid email is required";
    if (password.length < 8) next.password = "Use at least 8 characters";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate({ to: "/mat/explore" });
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 422 &&
        err.body &&
        typeof err.body === "object"
      ) {
        const apiErrors = (err.body as { errors?: Record<string, string[]> }).errors ?? {};
        setErrors(
          Object.fromEntries(
            Object.entries(apiErrors).map(([field, messages]) => [field, messages[0]]),
          ),
        );
      } else {
        setErrors({ email: err instanceof ApiError ? err.message : "Something went wrong." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Create your account"
      title={
        <>
          Begin a practice
          <br />
          <em className="not-italic text-charcoal">worth returning to.</em>
        </>
      }
      description="A free Explorer account opens the free preview library. Buying the Navamata mat unlocks the full practice library as a Practitioner."
      aside={{
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80",
        quote: "I stopped collecting practices. I started keeping one.",
        caption: "Eloise R. — Explorer since MMXXIV",
      }}
      footer={
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-warm-gray">
          <span>Already with us?</span>
          <Link to="/signin" className="text-ink hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        <Field
          label="Full name"
          name="name"
          placeholder="Anaïs Laurent"
          error={errors.name}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@navamata.co"
          error={errors.email}
          required
        />
        <Field
          label="Passphrase"
          name="password"
          type="password"
          placeholder="A long, quiet phrase"
          hint="Minimum 8 characters."
          error={errors.password}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center bg-ink text-xs uppercase tracking-[0.22em] text-soft-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create free account"}
        </button>

        <p className="text-xs leading-relaxed text-warm-gray">
          By continuing you agree to our{" "}
          <Link to="/" className="text-ink hover:underline">
            terms
          </Link>{" "}
          and{" "}
          <Link to="/" className="text-ink hover:underline">
            privacy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
