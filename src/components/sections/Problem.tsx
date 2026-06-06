import { MessageSquareOff, CalendarX, EyeOff, Hash, Clock } from "lucide-react";

const items = [
  { icon: MessageSquareOff, title: "“Aunty, I'm coming.”", body: "The text that never turns into an arrival — and the income that vanishes with it." },
  { icon: CalendarX, title: "Bookings on blind trust", body: "No deposit, no confirmation, no protection. One no-show wipes a whole day." },
  { icon: EyeOff, title: "Talent in a WhatsApp status", body: "A skill that deserves a city, reaching only forty contacts at a time." },
  { icon: Hash, title: "Visibility ruled by algorithms", body: "Followers and virality decide who gets booked, not the quality of the work." },
  { icon: Clock, title: "Clients who arrive anxious", body: "No clear price. No clear time. Every booking starts with a negotiation." },
];

export function Problem() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="eyebrow">The reality today</span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
          Built from a real <em>wound.</em>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Too many talented professionals lose income every week — and too many women
          chase confirmations they were promised. Katalok was built to end that.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="card-soft p-6 transition-transform hover:-translate-y-0.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-cedar">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
