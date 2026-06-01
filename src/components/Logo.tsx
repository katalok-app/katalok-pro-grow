import logo from "@/assets/katalok-logo-transparent.png.asset.json";

export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Katalok"
      className={className}
      width={1033}
      height={942}
    />
  );
}
