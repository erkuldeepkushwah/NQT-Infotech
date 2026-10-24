"use client";

import Link from "next/link";
import { useState } from "react";
import { ref, remove as rtdbRemove } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Panel, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { useRtdbList } from "@/lib/useRtdb";
import { formatDate, type AdminUser, type DateLike } from "@/lib/admin";

export default function AdminUsersPage() {
  // Profiles go to the Realtime Database, with Firestore as a fallback.
  const live = useRtdbList<AdminUser>("users");
  const backup = useCollection<AdminUser>("users", 200);

  const loading = live.loading && backup.loading;
  const error = live.error && backup.error ? live.error : "";

  const seen = new Set<string>();
  const all: AdminUser[] = [];
  for (const list of [live.rows, backup.rows]) {
    for (const u of list) {
      const key = u.email || u.id;
      if (seen.has(key)) continue;
      seen.add(key);
      all.push(u);
    }
  }

  const rows = all.filter((u) => !removed.includes(u.id));

  async function removeUser(u: AdminUser) {
    if (!rtdb) {
      setNotice("Realtime Database is not configured, so users cannot be removed.");
      return;
    }
    const ok = window.confirm(
      "Delete " +
        (u.name || u.email || "this user") +
        " from the database? Their profile and purchased courses are removed. The sign-in account itself has to be deleted in the Firebase console."
    );
    if (!ok) return;

    setBusyId(u.id);
    setNotice("");
    try {
      await rtdbRemove(ref(rtdb, "users/" + u.id));
      try {
        await rtdbRemove(ref(rtdb, "enrollments/" + u.id));
      } catch {
        // nothing enrolled - fine
      }
      setRemoved((r) => [...r, u.id]);
      setNotice("User removed from the database.");
    } catch {
      setNotice("Could not remove this user. Check that database.rules.json is published.");
    } finally {
      setBusyId(null);
    }
  }
  const [query, setQuery] = useState("");
  const [removed, setRemoved] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const stamp = (value: DateLike) =>
    typeof value === "number" ? value : (value?.toDate?.()?.getTime() ?? 0);

  const sorted = [...rows].sort((a, b) => stamp(b.createdAt) - stamp(a.createdAt));

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

      {live.error && !live.loading ? (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Realtime Database: {live.error}
        </p>
      ) : null}

      {notice ? (
        <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</p>
      ) : null}

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
        <TableShell headers={["User", "Email", "Phone", "Role", "Status", "Joined", ""]}>
          {loading ? (
            <EmptyRow colSpan={7} text="Loading users..." />
          ) : error ? (
            <EmptyRow colSpan={7} text={error} />
          ) : shown.length === 0 ? (
            <EmptyRow
              colSpan={7}
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
                <td className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => removeUser(u)}
                    disabled={busyId === u.id}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {busyId === u.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
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
