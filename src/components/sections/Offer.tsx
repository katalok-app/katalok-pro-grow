import { Heart, Scissors, ShieldCheck, Sparkles } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    label: "Value 01",
    title: "Dignity First",
    body: "No woman negotiates for what she booked. No professional chases a client who confirmed. Mutual respect is structural, not a slogan.",
  },
  {
    icon: Scissors,
    label: "Value 02",
    title: "Skill is the Currency",
    body: "Reach is not earned through followers or virality. On Katalok, the work speaks — and the bookings follow.",
  },
  {
    icon: Heart,
    label: "Value 03",
    title: "Reliability as a Love Language",
    body: "Confirmations are real. Deposits protect both sides. Time is treated as valuable before tools are picked up.",
  },
  {
    icon: Sparkles,
    label: "Value 04",
    title: "Aspirational for Everyone",
    body: "Beauty is identity, not vanity. Katalok celebrates the ritual without the shame of desire — for every woman, every budget.",
  },
];

export function Offer() {
  return (
    <section id="offer" className="relative">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow">Brand Values</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Four values. One <em>promise.</em>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every feature in the platform exists to make these values real in practice —
            not just in marketing.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {values.map(({ icon: Icon, label, title, body }) => (
            <div key={title} className="card-soft p-7">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.28em] text-cedar">{label}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="mt-5 font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
