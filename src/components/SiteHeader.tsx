import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-10 w-auto md:h-12" />
          <span className="hidden font-display text-sm italic text-muted-foreground sm:inline">
            Book fine. Show up. Be served.
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#offer" className="hover:text-foreground">Values</a>
          <a href="#categories" className="hover:text-foreground">Categories</a>
          <a href="#how" className="hover:text-foreground">Deposit</a>
          <a href="#levels" className="hover:text-foreground">Levels</a>
        </nav>
        <a href="#waitlist" className="btn-primary !px-5 !py-2.5 text-xs">
          Reserve my spot
        </a>
      </div>
    </header>
  );
}
