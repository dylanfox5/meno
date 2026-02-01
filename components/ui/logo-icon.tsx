import Image from "next/image";

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className = "" }: LogoIconProps) {
  return (
    <Image
      src="/logo/meno-icon.png"
      alt="Meno logo"
      width={500}
      height={500}
      className={`w-auto ${className}`}
      priority
    />
  );
}
