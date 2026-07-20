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
      { title: "Katalok — Your Beauty Portfolio. Beautifully Organized." },
      {
        name: "description",
        content:
          "Stop letting your best work sit unseen in your phone gallery. Create a beautiful online Katalok where clients can explore your work, get inspired, and contact you directly.",
      },
      { property: "og:title", content: "Katalok — Your Beauty Portfolio. Beautifully Organized." },
      {
        property: "og:description",
        content:
          "Don't just save your work. Showcase it. Build your digital beauty catalog and get discovered by nearby clients.",
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
