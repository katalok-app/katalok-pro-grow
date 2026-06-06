const steps = [
  { n: "01", title: "Book fine.", body: "Browse real portfolios. See prices before you leave home. Pick the slot you want." },
  { n: "02", title: "Show up.", body: "50% paid via MoMo at booking. The remaining 50% on the day. Confirmed means confirmed." },
  { n: "03", title: "Be served.", body: "Walk in expected, walk out with exactly what you booked — protected by the deposit, on both sides." },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative overflow-hidden border-y border-border/40"
      style={{ background: "var(--gradient-cocoa)" }}
    >
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>
            The Deposit System
          </span>
          <h2 className="mt-4 font-display text-3xl text-primary-foreground sm:text-4xl md:text-5xl">
            The mechanism that makes the promise{" "}
            <em className="italic" style={{ color: "var(--sand)" }}>real.</em>
          </h2>
          <p className="mt-4 max-w-xl text-primary-foreground/70">
            Before Katalok, both sides operated on blind trust. The deposit replaces that with a
            structured, fair commitment — from both sides, at the same time.
          </p>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-7 backdrop-blur"
            >
              <span
                className="font-display text-5xl font-semibold"
                style={{ color: "var(--gold)", opacity: 0.85 }}
              >
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-2xl text-primary-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/65">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
