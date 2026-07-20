export function Vision() {
  return (
    <section className="container-page py-20 md:py-28">
      <div
        className="relative overflow-hidden rounded-3xl border border-border p-10 md:p-16"
        style={{ background: "var(--gradient-cocoa)" }}
      >
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" aria-hidden />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary-foreground/80">
            Don't just save your work
          </span>
          <h2 className="mt-5 font-display text-3xl text-primary-foreground sm:text-4xl md:text-5xl">
            Your gallery was never meant to{" "}
            <span className="italic text-accent">stay hidden</span>.
          </h2>
          <p className="mt-5 max-w-xl text-primary-foreground/80">
            Katalok is where African beauty professionals build their digital identity —
            starting with Cameroon, designed for everyone. Give your work the audience it
            deserves.
          </p>
          <a href="#waitlist-pro" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium text-cocoa transition-transform hover:scale-[1.02]">
            Create Your Free Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
