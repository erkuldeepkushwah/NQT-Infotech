"use client";

import { push, ref, serverTimestamp as rtdbTimestamp, set } from "firebase/database";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, rtdb } from "@/lib/firebase";
import { rtdbConnected, withTimeout } from "@/lib/writes";

export type EnquiryInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

export type EnquiryBackend = "rtdb" | "firestore";

/**
 * Saves a contact enquiry. Prefers the Realtime Database; if that is not
 * reachable it falls back to Firestore so a lead is never lost. Returns
 * whichever store accepted it.
 */
export async function submitEnquiry(data: EnquiryInput): Promise<EnquiryBackend> {
  let rtdbError: unknown = null;

  if (rtdb && (await rtdbConnected(3500))) {
    try {
      await withTimeout(
        set(push(ref(rtdb, "enquiries")), { ...data, createdAt: rtdbTimestamp() }),
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
        addDoc(collection(db, "enquiries"), { ...data, createdAt: serverTimestamp() }),
        12000
      );
      return "firestore";
    } catch (error) {
      throw rtdbError ?? error;
    }
  }

  throw rtdbError ?? new Error("no backend configured");
}
