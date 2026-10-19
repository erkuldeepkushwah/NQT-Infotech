"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Small read-only helper for the admin screens. Ordering is done in the page
// so no composite indexes are needed in Firestore.
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
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, name), limit(take)));
        if (cancelled) return;
        setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
      } catch (err) {
        if (cancelled) return;
        setError(
          "Could not load data. Check that Firestore is created and the rules allow admin access."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [name, take]);

  return { rows, loading, error };
}
