"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Panel } from "@/components/admin/ui";
import { auth } from "@/lib/firebase";

export default function AdminProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const rows: [string, string][] = [
    ["Name", user?.displayName || "-"],
    ["Email", user?.email || "-"],
    ["Email verified", user?.emailVerified ? "Yes" : "Not required for admin"],
    ["Role", "Administrator"],
    ["User ID", user?.uid || "-"],
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Profile</h1>
      <p className="mt-1 text-sm text-slate-600">Your administrator account.</p>

      <Panel title="Account">
        <dl className="divide-y divide-slate-50">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-wrap gap-2 px-5 py-3 text-sm">
              <dt className="w-40 text-slate-500">{label}</dt>
              <dd className="font-medium text-navy-800">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Your password is managed by Firebase Authentication. Change it from the
          &ldquo;forgot password&rdquo; link on the login page, or from the Firebase console.
          Passwords are never stored in this site.
        </p>
      </Panel>

      <Panel title="Who can access the admin area">
        <div className="px-5 py-4 text-sm text-slate-600">
          <p>
            Admin access is decided by email address, and it is enforced in Firestore
            Security Rules - not by this page. The current list lives in{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">lib/admin.ts</code> and{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">firestore.rules</code>.
          </p>
          <p className="mt-3">
            Add an admin by putting their email in both files and re-deploying. To remove
            access, take it out of both.
          </p>
        </div>
      </Panel>
    </>
  );
}
