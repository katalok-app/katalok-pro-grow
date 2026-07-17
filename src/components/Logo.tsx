const logo = "/assets/katalok-logo.svg";

export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Katalok"
      className={className}
      width={360}
      height={120}
    />
  );
}
