"use client";

import { Panel, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { formatDate, type AdminUser } from "@/lib/admin";

export default function AdminUsersPage() {
  const { rows, loading, error } = useCollection<AdminUser>("users", 200);

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Users</h1>
      <p className="mt-1 text-sm text-slate-600">
        Accounts created through the sign-up form on the website.
      </p>

      <Panel title={"Manage users (" + rows.length + ")"}>
        <TableShell headers={["User", "Email", "Role", "Status", "Created"]}>
          {loading ? (
            <EmptyRow colSpan={5} text="Loading users..." />
          ) : error ? (
            <EmptyRow colSpan={5} text={error} />
          ) : rows.length === 0 ? (
            <EmptyRow
              colSpan={5}
              text="No registered users yet. New sign-ups will appear here."
            />
          ) : (
            rows.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">
                  {u.name || (u.email || "").split("@")[0]}
                </td>
                <td className="px-5 py-3 text-slate-600">{u.email || "-"}</td>
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
          Account passwords are managed by Firebase Authentication and are never visible
          here. Use the Firebase console to reset a password or disable an account.
        </p>
      </Panel>
    </>
  );
}
