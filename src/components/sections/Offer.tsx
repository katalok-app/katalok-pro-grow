import { Image as ImageIcon, Compass, LayoutGrid, ShieldCheck, TrendingUp, Share2 } from "lucide-react";

const benefits = [
  { icon: ImageIcon, title: "Showcase your best work", body: "A beautiful, organized portfolio that puts your craft front and center." },
  { icon: LayoutGrid, title: "Organize by service", body: "Braids, nails, makeup, cuts — every look sorted so clients can browse." },
  { icon: Compass, title: "Be discovered locally", body: "New clients find you by category, town, and quarter — not by algorithm." },
  { icon: ShieldCheck, title: "Build trust with visuals", body: "Real photos, real prices, real contact info — everything in one place." },
  { icon: TrendingUp, title: "Grow your reputation", body: "Turn your gallery into a professional brand that keeps working for you." },
  { icon: Share2, title: "One profile, everywhere", body: "Share a single link instead of hundreds of photos across chats." },
];

export function Offer() {
  return (
    <section id="offer" className="relative">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow">What every pro gets</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Everything clients need, in <span className="italic text-mocha">one place</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A beautiful profile, organized galleries, categorized services, prices, location,
            contact info, and business hours — all beautifully presented.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className={`card-soft group p-6 ${i === 0 ? "lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-card to-secondary" : ""}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
