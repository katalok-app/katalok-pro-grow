import { Sparkles, Award, Crown, Check } from "lucide-react";

const plans = [
  {
    icon: Sparkles,
    name: "Free",
    tagline: "Start showcasing your work",
    features: [
      "Basic professional profile",
      "Limited portfolio uploads",
      "One service category",
      "Contact via WhatsApp & phone",
    ],
  },
  {
    icon: Award,
    name: "Basic",
    tagline: "More visibility, more reach",
    features: [
      "Everything in Free",
      "More portfolio uploads",
      "Multiple service categories",
      "Better search ranking",
    ],
    featured: true,
  },
  {
    icon: Crown,
    name: "Pro",
    tagline: "Grow your beauty business",
    features: [
      "Unlimited portfolio",
      "Priority discovery",
      "Advanced analytics",
      "Featured placement",
      "Professional badge",
    ],
  },
];

export function Levels() {
  return (
    <section id="levels" className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="eyebrow">Plans built for growth</span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
          Pay for <span className="italic text-mocha">visibility</span>, not just uploads
        </h2>
        <p className="mt-4 text-muted-foreground">
          Every plan gives you a beautiful catalog. Upgrade when you're ready to be
          discovered by more clients and grow your brand.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {plans.map(({ icon: Icon, name, tagline, features, featured }) => (
          <div
            key={name}
            className={`card-soft relative overflow-hidden p-6 ${
              featured ? "border-mocha/60 shadow-md" : ""
            }`}
          >
            {featured && (
              <span className="absolute right-4 top-4 rounded-full bg-mocha px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                Popular
              </span>
            )}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cocoa text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl">{name}</h3>
            <p className="mt-1 text-sm text-mocha">{tagline}</p>
            <ul className="mt-4 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-mocha" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
