import { cn } from "@/lib/utils";

const logo = "/assets/logo.jpg";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("logo-wordmark h-9 w-[11.5rem]", className)}>
      <img
        src={logo}
        alt="Katalok"
        className="logo-wordmark__image"
        width={1280}
        height={1280}
      />
    </span>
  );
}
