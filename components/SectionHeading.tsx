export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <span className={"eyebrow " + (light ? "text-brand-300" : "")}>{eyebrow}</span>
      ) : null}
      <h2
        className={
          "mt-3 text-3xl font-bold tracking-tight sm:text-4xl " +
          (light ? "text-white" : "text-navy-800")
        }
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={"mt-4 " + (light ? "text-brand-100" : "text-slate-600")}>{subtitle}</p>
      ) : null}
    </div>
  );
}
