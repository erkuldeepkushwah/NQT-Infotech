"use client";

import { ref, set as rtdbSet } from "firebase/database";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, rtdb } from "@/lib/firebase";
import { rtdbConnected, withTimeout } from "@/lib/writes";

export type UserProfile = {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
};

/**
 * Stores a student profile. The Realtime Database is preferred; Firestore is the
 * fallback. Both are raced against a timeout so a missing database can never
 * leave a button stuck on "Creating...".
 */
export async function saveUserProfile(
  uid: string,
  profile: UserProfile
): Promise<"rtdb" | "firestore"> {
  const record = {
    ...profile,
    role: profile.role || "user",
    status: profile.status || "active",
  };
  let rtdbError: unknown = null;

  if (rtdb && (await rtdbConnected(3500))) {
    try {
      await withTimeout(
        rtdbSet(ref(rtdb, "users/" + uid), { ...record, createdAt: Date.now() }),
        7000
      );
      return "rtdb";
    } catch (error) {
      rtdbError = error;
    }
  }

  if (db) {
    try {
      await withTimeout(
        setDoc(doc(db, "users", uid), { ...record, createdAt: serverTimestamp() }),
        12000
      );
      return "firestore";
    } catch (error) {
      throw rtdbError ?? error;
    }
  }

  throw rtdbError ?? new Error("no backend configured");
}
