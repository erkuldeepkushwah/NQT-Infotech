import Link from "next/link";

export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const textColor = variant === "light" ? "text-white" : "text-navy-800";
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="M40 24c0 8.84-7.16 16-16 16S8 32.84 8 24 15.16 8 24 8c4 0 7.65 1.47 10.44 3.88"
          stroke="#0B4FE0"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M24 15c4.97 0 9 4.03 9 9s-4.03 9-9 9"
          stroke="#5C82FF"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <span className={"text-lg font-extrabold tracking-tight " + textColor}>
        NQT<span className="font-medium text-brand-600"> Infotech</span>
      </span>
    </Link>
  );
}
