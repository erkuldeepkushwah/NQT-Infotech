"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Panel } from "@/components/admin/ui";
import { auth } from "@/lib/firebase";

export default function StudentProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const rows: [string, string][] = [
    ["Name", user?.displayName || "-"],
    ["Email", user?.email || "-"],
    ["Account type", "Student"],
    ["Email verified", user?.emailVerified ? "Yes" : "Not yet"],
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Profile</h1>
      <p className="mt-1 text-sm text-slate-600">Your learning account.</p>

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
          Your password is managed by Firebase Authentication and is never stored on
          this site.
        </p>
      </Panel>
    </>
  );
}
