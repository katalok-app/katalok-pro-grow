import { Sparkles, Award, Crown, Gem } from "lucide-react";

const levels = [
  { icon: Sparkles, name: "Starter", desc: "Your first profile. Build the basics." },
  { icon: Award, name: "Growing Pro", desc: "Consistent activity unlocks more visibility." },
  { icon: Crown, name: "Top Pro", desc: "High reliability — featured across categories." },
  { icon: Gem, name: "Elite Pro", desc: "Lower commissions, premium placement, verified badge." },
];

export function Levels() {
  return (
    <section id="levels" className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="eyebrow">Professional levels</span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
          Grow your <span className="italic text-mocha">visibility</span> on Katalok
        </h2>
        <p className="mt-4 text-muted-foreground">
          Higher activity and reliability improve visibility and reduce your commissions.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map(({ icon: Icon, name, desc }, i) => (
          <div key={name} className="card-soft relative overflow-hidden p-6">
            <div className="absolute right-4 top-4 text-xs font-medium text-muted-foreground">
              0{i + 1}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cocoa text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg">{name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mocha to-accent"
                style={{ width: `${(i + 1) * 25}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
