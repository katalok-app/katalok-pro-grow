import logo from "@/assets/katalok-logo.png.asset.json";

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Katalok"
      className={className}
      width={120}
      height={120}
    />
  );
}
