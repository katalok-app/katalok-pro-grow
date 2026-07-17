const logo = "/assets/katalok-logo.png";
const fallbackLogo = "/assets/katalok-logo.svg";

export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Katalok"
      className={className}
      width={1033}
      height={942}
      onError={(event) => {
        event.currentTarget.src = fallbackLogo;
      }}
    />
  );
}
