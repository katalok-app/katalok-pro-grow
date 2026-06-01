import { Sparkles, Award, Crown } from "lucide-react";

const levels = [
  {
    icon: Sparkles,
    name: "Starter Pro",
    commission: "10%",
    desc: "Build your first profile and start receiving bookings on Katalok.",
  },
  {
    icon: Award,
    name: "Rising Pro",
    commission: "7%",
    desc: "Consistent activity and great reviews unlock lower commission and more visibility.",
  },
  {
    icon: Crown,
    name: "Elite Pro",
    commission: "5%",
    desc: "Top reliability and reputation — featured placement, verified badge, lowest commission.",
  },
];

export function Levels() {
  return (
    <section id="levels" className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="eyebrow">Professional levels</span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
          Grow your <span className="italic text-mocha">visibility</span>, lower your commission
        </h2>
        <p className="mt-4 text-muted-foreground">
          The more reliable and active you are, the less Katalok charges per booking — and the more clients see you first.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {levels.map(({ icon: Icon, name, commission, desc }, i) => (
          <div key={name} className="card-soft relative overflow-hidden p-6">
            <div className="absolute right-4 top-4 text-xs font-medium text-muted-foreground">
              0{i + 1}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cocoa text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg">{name}</h3>
            <p className="mt-1 text-sm font-medium text-mocha">{commission} commission per booking</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mocha to-accent"
                style={{ width: `${[40, 70, 100][i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
