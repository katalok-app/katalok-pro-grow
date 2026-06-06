export function Vision() {
  return (
    <section className="container-page py-20 md:py-28">
      <div
        className="relative overflow-hidden rounded-3xl border border-border p-10 md:p-16"
        style={{ background: "var(--gradient-cocoa)" }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "color-mix(in oklab, var(--gold) 35%, transparent)" }}
          aria-hidden
        />
        <div className="relative max-w-3xl">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em]"
            style={{ color: "var(--gold)" }}
          >
            The Promise
          </span>
          <h2 className="mt-5 font-display text-3xl text-primary-foreground sm:text-4xl md:text-5xl">
            Where skill is the only currency. Where she knows her price{" "}
            <em className="italic" style={{ color: "var(--gold)" }}>before she leaves the house.</em>
          </h2>
          <p className="mt-5 max-w-xl font-display text-lg italic text-primary-foreground/75 md:text-xl">
            “Book fine. Show up. Be served.” is not a tagline — it is a guarantee.
          </p>
          <a
            href="#waitlist"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium text-cocoa transition-transform hover:scale-[1.02]"
          >
            Reserve my spot
          </a>
        </div>
      </div>

      <div
        className="mt-14 overflow-hidden border-y py-4"
        style={{ borderColor: "color-mix(in oklab, var(--cedar) 25%, transparent)" }}
      >
        <div className="flex whitespace-nowrap" style={{ animation: "marquee 35s linear infinite" }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-10 pr-10 text-[11px] uppercase tracking-[0.32em] text-muted-foreground"
            >
              <span>Dignity First</span><span style={{ color: "var(--gold)" }}>·</span>
              <span>Skill is the Currency</span><span style={{ color: "var(--gold)" }}>·</span>
              <span>Reliability as a Love Language</span><span style={{ color: "var(--gold)" }}>·</span>
              <span>Aspirational for Everyone</span><span style={{ color: "var(--gold)" }}>·</span>
              <span>She's got you</span><span style={{ color: "var(--gold)" }}>·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
