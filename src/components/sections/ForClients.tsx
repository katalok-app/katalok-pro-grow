import { ShieldCheck, MapPin, Sparkles, ArrowRight } from "lucide-react";

export function ForClients() {
  return (
    <section className="container-page py-16 md:py-20">
      <div className="rounded-3xl border border-border bg-secondary/40 p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <span className="eyebrow">For clients</span>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl">
              Discover beauty pros <span className="italic text-mocha">near you</span>.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Browse real portfolios, save inspiration, and reach out directly on WhatsApp or by phone.
            </p>
            <a href="#waitlist-client" className="btn-primary mt-6 !px-5 !py-2.5 text-xs">
              Join as a client <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <ul className="grid gap-4 md:col-span-7 sm:grid-cols-3">
            <Benefit
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Real portfolios"
              body="See a pro's actual work before you reach out."
            />
            <Benefit
              icon={<MapPin className="h-4 w-4" />}
              title="Pros in your area"
              body="Filter by town and quarter."
            />
            <Benefit
              icon={<Sparkles className="h-4 w-4" />}
              title="Save inspiration"
              body="Bookmark looks and share with your pro."
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

function Benefit({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <li className="rounded-2xl border border-border bg-background p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </li>
  );
}
