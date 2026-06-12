import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Offer } from "@/components/sections/Offer";
import { Categories } from "@/components/sections/Categories";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Levels } from "@/components/sections/Levels";
import { Waitlist } from "@/components/sections/Waitlist";
import { ForClients } from "@/components/sections/ForClients";
import { Vision } from "@/components/sections/Vision";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Katalok — Get Discovered. Get Booked. Grow Your Beauty Business." },
      {
        name: "description",
        content:
          "Katalok helps African beauty pros get discovered and booked — and helps clients find trusted hairstylists, nail techs, makeup artists & barbers nearby. Join the waitlist.",
      },
      { property: "og:title", content: "Katalok — for pros and clients" },
      {
        property: "og:description",
        content:
          "The discovery & booking platform for African beauty pros and the clients who book them. Starting in Cameroon.",
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
        <Categories />
        <HowItWorks />
        <Levels />
        <ForClients />
        <Waitlist />
        <Vision />
      </main>
      <SiteFooter />
    </div>
  );
}
