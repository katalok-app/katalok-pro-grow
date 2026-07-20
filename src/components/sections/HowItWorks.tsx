const steps = [
  { n: "01", title: "Create your profile", body: "Business name, town, contact, bio — set up in under 2 minutes." },
  { n: "02", title: "Upload your best work", body: "Add photos of braids, nails, makeup, cuts, lashes — organized by service." },
  { n: "03", title: "Get discovered", body: "Clients explore your work, save inspiration, and contact you on WhatsApp or by phone." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-card/50 border-y border-border">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Three steps to your <span className="italic text-mocha">online Katalok</span>
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-2xl border border-border bg-background p-7">
              <span className="font-display text-5xl text-accent/70">{s.n}</span>
              <h3 className="mt-3 text-xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
