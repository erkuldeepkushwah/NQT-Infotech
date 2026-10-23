"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { databaseUrl, rtdb } from "@/lib/firebase";

export type RtdbRow = { id: string };

// How long to wait before deciding the database is not answering.
const TIMEOUT_MS = 10000;

/**
 * Live list from a Realtime Database path. Each child key becomes the row id,
 * and the list updates automatically as data changes.
 *
 * A Realtime Database that was never created never answers at all, so this
 * gives up after a few seconds and reports why rather than loading forever.
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

    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      setLoading(false);
      setError(
        "No answer from the Realtime Database at " +
          (databaseUrl || "(no url)") +
          ". Create the database in the Firebase console (Realtime Database → Create Database) and publish database.rules.json."
      );
    }, TIMEOUT_MS);

    const unsubscribe = onValue(
      ref(rtdb, path),
      (snapshot) => {
        settled = true;
        clearTimeout(timer);
        const value = snapshot.val() as Record<string, Record<string, unknown>> | null;
        setRows(
          value ? Object.entries(value).map(([id, v]) => ({ id, ...v }) as unknown as T) : []
        );
        setError("");
        setLoading(false);
      },
      () => {
        settled = true;
        clearTimeout(timer);
        setError(
          "The Realtime Database refused to read " +
            path +
            ". Check that database.rules.json is published in the Firebase console."
        );
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [path]);

  return { rows, loading, error };
}
