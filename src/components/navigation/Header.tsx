import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const leftNav = [
  { to: "/my-studio", label: "My Studio" },
  { to: "/go-live", label: "Go Live" },
];

export function Header() {
  const { isAuthenticated, user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-background/85 backdrop-blur-xl">
      <div className="container-page grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-6">
        {/* Left — primary destinations */}
        <nav className="hidden items-center gap-10 md:flex">
          {leftNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:text-ink"
              activeProps={{ className: "text-ink" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="justify-self-start md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Center — logo */}
        <Link
          to="/"
          className="justify-self-center font-display text-3xl font-semibold tracking-[-0.02em] text-ink"
        >
          navamata
        </Link>

        {/* Right — auth */}
        <div className="hidden items-center justify-end gap-6 md:flex">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 text-sm text-charcoal hover:text-ink"
              >
                <span className="font-display text-base">{user?.name}</span>
                <span className="text-[0.65rem] uppercase tracking-[0.22em] text-warm-gray">
                  · {role}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-4 w-64 border hairline bg-soft-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="border-b hairline px-5 py-4">
                    <div className="eyebrow mb-2">Account</div>
                    <div className="text-sm text-charcoal">{user?.email}</div>
                    {role === "explorer" && (
                      <Link
                        to="/mat/buy"
                        onClick={() => setMenuOpen(false)}
                        className="mt-3 inline-block text-xs uppercase tracking-[0.22em] text-ink hover:underline"
                      >
                        Become a Practitioner →
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-5 py-3.5 text-left text-xs uppercase tracking-[0.22em] text-charcoal hover:text-ink"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:text-ink"
              >
                Sign in
              </Link>
              <Link
                to="/signin/explorer"
                className="inline-flex h-10 items-center border border-ink px-5 text-xs font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-soft-white"
              >
                Join
              </Link>
            </>
          )}
        </div>

        {/* Spacer on mobile right */}
        <div className="md:hidden" />
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t hairline bg-soft-white md:hidden">
          <nav className="container-page flex flex-col py-6">
            {leftNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="border-b hairline py-4 text-sm uppercase tracking-[0.22em] text-charcoal"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/mat/explore"
              onClick={() => setMobileOpen(false)}
              className="border-b hairline py-4 text-sm uppercase tracking-[0.22em] text-charcoal"
            >
              The Mat — Explore
            </Link>
            <Link
              to="/mat/buy"
              onClick={() => setMobileOpen(false)}
              className="border-b hairline py-4 text-sm uppercase tracking-[0.22em] text-charcoal"
            >
              The Mat — Acquire
            </Link>
            <Link
              to="/mat/practice"
              onClick={() => setMobileOpen(false)}
              className="border-b hairline py-4 text-sm uppercase tracking-[0.22em] text-charcoal"
            >
              The Mat — Practice
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="mt-4 inline-flex h-10 items-center justify-center border border-ink text-xs uppercase tracking-[0.22em]"
              >
                Sign out
              </button>
            ) : (
              <div className="mt-4 flex gap-3">
                <Link
                  to="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 flex-1 items-center justify-center border border-ink text-xs uppercase tracking-[0.22em]"
                >
                  Sign in
                </Link>
                <Link
                  to="/signin/explorer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 flex-1 items-center justify-center bg-ink text-xs uppercase tracking-[0.22em] text-soft-white"
                >
                  Join
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
