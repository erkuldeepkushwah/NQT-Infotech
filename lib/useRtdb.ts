"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { databaseUrl, rtdb } from "@/lib/firebase";

export type RtdbRow = { id: string };

/**
 * Live list from a Realtime Database path. Each child key becomes the row id,
 * and the list updates automatically as data changes.
 */
export function useRtdbList<T extends RtdbRow = RtdbRow>(path: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rtdb) {
      setLoading(false);
      setError(
        "Realtime Database is not set up yet. Create it in the Firebase console, then set NEXT_PUBLIC_FIREBASE_DATABASE_URL."
      );
      return;
    }
    const unsubscribe = onValue(
      ref(rtdb, path),
      (snapshot) => {
        const value = snapshot.val() as Record<string, Record<string, unknown>> | null;
        setRows(
          value
            ? Object.entries(value).map(([id, v]) => ({ id, ...v }) as unknown as T)
            : []
        );
        setError("");
        setLoading(false);
      },
      () => {
        setError(
          "Could not reach the Realtime Database at " +
            (databaseUrl || "(no url)") +
            ". Check that it exists in the Firebase console and that its rules allow reading " +
            path +
            "."
        );
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [path]);

  return { rows, loading, error };
}
