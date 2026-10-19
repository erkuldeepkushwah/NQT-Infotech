import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  tone = "brand",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "brand" | "green" | "red" | "slate";
}) {
  const tones: Record<string, string> = {
    brand: "text-brand-600 bg-brand-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    slate: "text-slate-600 bg-slate-100",
  };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <span className={"h-2.5 w-2.5 rounded-full " + tones[tone].split(" ")[1]} />
      </div>
      <div className="mt-3 text-3xl font-bold text-navy-800">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-navy-800">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TableShell({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-slate-500">
        {text}
      </td>
    </tr>
  );
}

export function StatusPill({ status }: { status?: string }) {
  const value = (status || "active").toLowerCase();
  const map: Record<string, string> = {
    active: "bg-green-50 text-green-700",
    inactive: "bg-slate-100 text-slate-600",
    disabled: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };
  return (
    <span className={"rounded-full px-2.5 py-1 text-xs font-medium " + (map[value] || map.inactive)}>
      {status || "Active"}
    </span>
  );
}
