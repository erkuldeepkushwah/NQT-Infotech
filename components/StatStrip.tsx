export default function StatStrip({
  items,
  variant = "light",
}: {
  items: { value: string; label: string }[];
  variant?: "light" | "dark";
}) {
  const cols = items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2";
  return (
    <div className={"grid gap-6 " + cols}>
      {items.map((item) => (
        <div
          key={item.label}
          className={
            "rounded-xl border p-6 " +
            (variant === "dark"
              ? "border-white/10 bg-white/5"
              : "border-slate-100 bg-white shadow-card")
          }
        >
          <div className={"text-3xl font-extrabold " + (variant === "dark" ? "text-white" : "text-brand-600")}>
            {item.value}
          </div>
          <div className={"mt-2 text-sm " + (variant === "dark" ? "text-brand-100" : "text-slate-600")}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
