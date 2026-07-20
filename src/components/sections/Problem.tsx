import { Smartphone, Instagram, MessageCircle, Search, Sparkles } from "lucide-react";

const items = [
  { icon: Smartphone, title: "Hidden in your camera roll", body: "Hundreds of beautiful photos nobody outside your phone will ever see." },
  { icon: Instagram, title: "Posts that disappear", body: "Great work vanishes down the feed within hours of posting." },
  { icon: MessageCircle, title: "Lost in WhatsApp threads", body: "Your best photos buried in endless chat conversations." },
  { icon: Search, title: "Clients can't find inspiration", body: "No single place to browse your work, services, and prices." },
  { icon: Sparkles, title: "No home for your brand", body: "Nowhere to send a new client that shows who you really are." },
];

export function Problem() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="eyebrow">The reality today</span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
          Your best work deserves better than a
          <span className="italic text-mocha"> camera roll</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Your phone gallery stores your work. Katalok helps the world discover it.
        </p>
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
