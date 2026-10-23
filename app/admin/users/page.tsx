"use client";

import Link from "next/link";
import { useState } from "react";
import { Panel, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { formatDate, type AdminUser } from "@/lib/admin";

export default function AdminUsersPage() {
  const { rows, loading, error } = useCollection<AdminUser>("users", 200);
  const [query, setQuery] = useState("");

  const sorted = [...rows].sort((a, b) => {
    const at = a.createdAt?.toDate?.()?.getTime() ?? 0;
    const bt = b.createdAt?.toDate?.()?.getTime() ?? 0;
    return bt - at;
  });

  const term = query.trim().toLowerCase();
  const shown = term
    ? sorted.filter((u) =>
        [u.name, u.email, u.phone, u.role, u.status]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term))
      )
    : sorted;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Users</h1>
          <p className="mt-1 text-sm text-slate-600">
            Every account registered on the website.
          </p>
        </div>
        <Link href="/admin/users/new" className="btn-primary px-5 py-2.5">
          + Add user
        </Link>
      </div>

      <Panel
        title={"All registered users (" + rows.length + ")"}
        action={
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone…"
            aria-label="Search users"
            className="w-56 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        }
      >
        <TableShell headers={["User", "Email", "Phone", "Role", "Status", "Joined"]}>
          {loading ? (
            <EmptyRow colSpan={6} text="Loading users..." />
          ) : error ? (
            <EmptyRow colSpan={6} text={error} />
          ) : shown.length === 0 ? (
            <EmptyRow
              colSpan={6}
              text={
                rows.length === 0
                  ? "No registered users yet. New sign-ups appear here, or use “Add user”."
                  : "No users match that search."
              }
            />
          ) : (
            shown.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                      {(u.name || u.email || "U")
                        .split(/[\s@.]+/)
                        .filter(Boolean)
                        .map((p) => p.charAt(0))
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "U"}
                    </span>
                    <span className="font-medium text-navy-800">
                      {u.name || (u.email || "").split("@")[0] || "-"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{u.email || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{u.phone || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{u.role || "User"}</td>
                <td className="px-5 py-3">
                  <StatusPill status={u.status || "Active"} />
                </td>
                <td className="px-5 py-3 text-slate-600">{formatDate(u.createdAt)}</td>
              </tr>
            ))
          )}
        </TableShell>
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Passwords are held by Firebase Authentication and are never visible here. Students
          can change their own password from Settings.
        </p>
      </Panel>
    </>
  );
}
