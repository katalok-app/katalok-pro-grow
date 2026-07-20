import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-8 w-[10.25rem] md:h-9 md:w-[11.5rem]" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#offer" className="hover:text-foreground">Why Katalok</a>
          <a href="#categories" className="hover:text-foreground">Categories</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#levels" className="hover:text-foreground">Levels</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline-flex">
            Sign in
          </Link>
          <a href="#waitlist-client" className="btn-ghost hidden !px-4 !py-2.5 text-xs sm:inline-flex">
            Find a Pro
          </a>
          <a href="#waitlist-pro" className="btn-primary !px-5 !py-2.5 text-xs">
            Join as Pro
          </a>
        </div>
      </div>
    </header>
  );
}
