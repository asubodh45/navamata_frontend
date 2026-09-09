import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/signin/practitioner")({
  head: () => ({
    meta: [
      { title: "Become a Practitioner — Navamata" },
      {
        name: "description",
        content: "Practitioner access comes from buying the Navamata mat.",
      },
    ],
  }),
  component: PractitionerInfoPage,
});

/**
 * There is no separate "practitioner application" in the Navamata model —
 * buying the mat *is* what makes an account a Practitioner. This page used
 * to be a mocked teacher-application form; it's now a short explainer that
 * routes people to the one real path: /mat/buy.
 */
function PractitionerInfoPage() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthShell
      eyebrow="Become a Practitioner"
      title={
        <>
          The mat
          <br />
          <em className="not-italic text-charcoal">is the membership.</em>
        </>
      }
      description="There's no application. Buying your Navamata mat is what makes your account a Practitioner — it unlocks the full practice library and the right to buy paid premium sessions."
      aside={{
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80",
        quote: "One object. One practice. Nothing else to join.",
        caption: "Navamata",
      }}
      footer={
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-warm-gray">
          <span>Not ready yet?</span>
          <Link to="/mat/explore" className="text-ink hover:underline">
            Browse free previews
          </Link>
        </div>
      }
    >
      <div className="space-y-10">
        <ol className="space-y-6 border-y hairline py-8 text-sm text-charcoal">
          <li>
            <span className="eyebrow mr-3">01</span>Create a free Explorer account (or sign in).
          </li>
          <li>
            <span className="eyebrow mr-3">02</span>Choose your mat and complete delivery + payment.
          </li>
          <li>
            <span className="eyebrow mr-3">03</span>Your account becomes Practitioner the moment
            payment succeeds.
          </li>
        </ol>

        <Link
          to={isAuthenticated ? "/mat/buy" : "/signin/explorer"}
          className="inline-flex h-12 w-full items-center justify-center bg-ink text-xs uppercase tracking-[0.22em] text-soft-white transition-opacity hover:opacity-90"
        >
          {isAuthenticated ? "Go to the buy flow" : "Create a free account to begin"}
        </Link>
      </div>
    </AuthShell>
  );
}
