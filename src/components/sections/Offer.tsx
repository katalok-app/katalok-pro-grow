import { Compass, Image as ImageIcon, CalendarCheck, ShieldCheck, TrendingUp } from "lucide-react";

const benefits = [
  { icon: Compass, title: "Get discovered", body: "New clients find you by category, city, and style — not just followers." },
  { icon: ImageIcon, title: "Showcase your work", body: "A clean, premium portfolio that puts your craft front and center." },
  { icon: CalendarCheck, title: "Structured bookings", body: "Real appointments with service, price, and time — no DM chaos." },
  { icon: ShieldCheck, title: "Fewer no-shows", body: "Deposit-based appointments protect your time and income." },
  { icon: TrendingUp, title: "Grow your reputation", body: "Build a verified track record that compounds with every booking." },
];

export function Offer() {
  return (
    <section id="offer" className="relative">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow">What Katalok offers</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Built to help you <span className="italic text-mocha">grow</span>
          </h2>
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
