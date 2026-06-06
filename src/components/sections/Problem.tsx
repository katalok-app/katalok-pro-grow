import { EyeOff, CalendarX, Clock, Hash, MessageSquareOff } from "lucide-react";

const items = [
  { icon: EyeOff, title: "Limited visibility", body: "Talent buried under followers and algorithms." },
  { icon: CalendarX, title: "Messy booking", body: "DMs, voice notes, and back-and-forth confirmations." },
  { icon: Clock, title: "No-shows & time wasters", body: "Empty slots that should have been paid appointments." },
  { icon: Hash, title: "Stuck on social media", body: "Reach depends on virality, not skill." },
  { icon: MessageSquareOff, title: "Unstructured chats", body: "Clients ghost, change minds, forget details." },
];

export function Problem() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="eyebrow">The reality today</span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
          Why beauty professionals need
          <span className="italic text-mocha"> more than Instagram</span>
        </h2>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="card-soft p-6 transition-transform hover:-translate-y-0.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-mocha">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
