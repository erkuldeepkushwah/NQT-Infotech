import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import { site } from "@/lib/site";

export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const wordColour = variant === "light" ? "#ffffff" : "#011B40";

  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={site.name + " home"}>
      <LogoMark size={32} />
      <span className="text-[22px] font-extrabold tracking-tight" style={{ color: wordColour }}>
        Brivora
      </span>
    </Link>
  );
}
