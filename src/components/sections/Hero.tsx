import { ArrowRight, Sparkles } from "lucide-react";
import hair from "@/assets/hero-hair.jpg";
import nails from "@/assets/hero-nails.jpg";
import makeup from "@/assets/hero-makeup.jpg";
import barber from "@/assets/hero-barber.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-warm)" }}
        aria-hidden
      />
      <div className="container-page grid items-center gap-12 py-16 md:grid-cols-12 md:py-24 lg:py-28">
        <div className="md:col-span-7">
          <span className="eyebrow">
            <Sparkles className="h-3 w-3" /> For beauty professionals
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Get Discovered.
            <br />
            Get Booked.
            <br />
            <span className="italic text-mocha">Grow your business.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Join Katalok — the new platform helping hairstylists, nail techs, makeup
            artists & barbers showcase their work, attract serious clients, and receive
            structured bookings.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#waitlist" className="btn-primary">
              Join the Waitlist <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#offer" className="btn-ghost">See how it works</a>
          </div>
          <div className="mt-10 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {[hair, makeup, barber].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-background object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            Early access — limited spots in Cameroon
          </div>
        </div>

        {/* Pinterest-style collage */}
        <div className="md:col-span-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <ImgTile src={hair} label="Hair" tall />
              <ImgTile src={nails} label="Nails" />
            </div>
            <div className="space-y-3 pt-8 sm:space-y-4 sm:pt-10">
              <ImgTile src={makeup} label="Makeup" />
              <ImgTile src={barber} label="Barber" tall />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImgTile({ src, label, tall = false }: { src: string; label: string; tall?: boolean }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] ${
        tall ? "aspect-[3/4]" : "aspect-square"
      }`}
    >
      <img
        src={src}
        alt={label}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="eager"
      />
      <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cocoa">
        {label}
      </span>
    </div>
  );
}
