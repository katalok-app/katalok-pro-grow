import { Instagram, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Logo className="h-14 w-auto" />
          <p className="mt-4 max-w-xs font-display text-base italic text-muted-foreground">
            “Book fine. Show up. Be served.”
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A beauty booking platform that makes reliability the standard and dignity the floor —
            starting in Cameroon.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-cocoa">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Launching soon — Douala &amp; Yaoundé
          </span>
        </div>

        <div className="text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Contact</p>
          <a href="mailto:katalok.app@gmail.com" className="mt-3 inline-flex items-center gap-2 text-foreground hover:text-primary">
            <Mail className="h-4 w-4" />
            <span>katalok.app@gmail.com</span>
          </a>
        </div>

        <div className="text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Follow</p>
          <div className="mt-3 flex items-center gap-3">
            <a aria-label="Instagram" href="#" className="rounded-full border border-border p-2 text-foreground transition-colors hover:bg-secondary">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Katalok. All rights reserved.</p>
          <p>Built for beauty professionals across Africa.</p>
        </div>
      </div>
    </footer>
  );
}
