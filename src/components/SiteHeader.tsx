import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-9 w-9 object-contain" />
          <span className="font-display text-lg tracking-tight text-foreground">katalok</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#offer" className="hover:text-foreground">Why Katalok</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#levels" className="hover:text-foreground">Levels</a>
        </nav>
        <a href="#waitlist" className="btn-primary !px-5 !py-2.5 text-xs">
          Join Waitlist
        </a>
      </div>
    </header>
  );
}
