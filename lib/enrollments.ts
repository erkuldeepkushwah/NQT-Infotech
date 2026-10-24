"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase";

export type Enrollment = {
  id: string;
  courseTitle?: string;
  amount?: number;
  utr?: string;
  approvedAt?: number;
};

/**
 * The courses a student owns. Written when an admin approves their payment, so
 * "My courses" only ever lists purchased courses.
 */
export function useMyEnrollments(uid: string) {
  const [rows, setRows] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid) {
      setRows([]);
      setLoading(false);
      return;
    }
    if (!rtdb) {
      setLoading(false);
      setError("Realtime Database is not set up for this project yet.");
      return;
    }

    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      setLoading(false);
      setError("No answer from the Realtime Database. Check that it exists and its rules are published.");
    }, 10000);

    const unsubscribe = onValue(
      ref(rtdb, "enrollments/" + uid),
      (snapshot) => {
        settled = true;
        clearTimeout(timer);
        const value = snapshot.val() as Record<string, Record<string, unknown>> | null;
        setRows(
          value
            ? Object.entries(value).map(([id, v]) => ({ id, ...v }) as unknown as Enrollment)
            : []
        );
        setError("");
        setLoading(false);
      },
      () => {
        settled = true;
        clearTimeout(timer);
        setError("The Realtime Database refused to read your enrollments.");
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [uid]);

  return { rows, loading, error };
}

/** The set of course slugs this student already owns. */
export function enrolledSlugs(rows: Enrollment[]): Set<string> {
  return new Set(rows.map((r) => r.id));
}
