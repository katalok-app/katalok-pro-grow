import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Offer } from "@/components/sections/Offer";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Levels } from "@/components/sections/Levels";
import { Waitlist } from "@/components/sections/Waitlist";
import { Vision } from "@/components/sections/Vision";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Katalok — Get Discovered. Get Booked. Grow Your Beauty Business." },
      {
        name: "description",
        content:
          "Katalok helps African beauty professionals — hairstylists, nail techs, makeup artists & barbers — showcase their work and receive structured bookings. Join the waitlist.",
      },
      { property: "og:title", content: "Katalok — for beauty professionals" },
      {
        property: "og:description",
        content:
          "The discovery & booking platform built for African beauty professionals. Starting in Cameroon.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Offer />
        <HowItWorks />
        <Levels />
        <Waitlist />
        <Vision />
      </main>
      <SiteFooter />
    </div>
  );
}
