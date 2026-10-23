"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// How long to wait before deciding Firestore is not answering.
const TIMEOUT_MS = 12000;

// Small read-only helper for the admin screens. Ordering is done in the page
// so no composite indexes are needed in Firestore.
//
// A Firestore database that was never created never answers, so this gives up
// after a few seconds and says so rather than loading forever.
export function useCollection<T>(name: string, take = 100) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError("Firebase is not configured.");
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      cancelled = true;
      setLoading(false);
      setError(
        "No answer from Firestore for “" +
          name +
          "”. Create the database in the Firebase console (Firestore Database → Create Database) and publish firestore.rules."
      );
    }, TIMEOUT_MS);

    (async () => {
      try {
        const snap = await getDocs(query(collection(db, name), limit(take)));
        if (cancelled) return;
        cancelled = true;
        clearTimeout(timer);
        setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
        setError("");
      } catch (err) {
        if (cancelled) return;
        cancelled = true;
        clearTimeout(timer);
        setError(
          "Could not read “" +
            name +
            "” from Firestore. Check that the database exists and firestore.rules is published."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [name, take]);

  return { rows, loading, error };
}
