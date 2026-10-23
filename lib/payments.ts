"use client";

import { push, ref, serverTimestamp as rtdbTimestamp, set } from "firebase/database";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, rtdb } from "@/lib/firebase";
import { rtdbConnected, withTimeout } from "@/lib/writes";

export type PaymentInput = {
  uid: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  method: string;
  utr: string;
};

export type PaymentBackend = "rtdb" | "firestore";

/**
 * Saves a payment request. Prefers the Realtime Database and falls back to
 * Firestore, so the student is never left staring at a stuck button.
 */
export async function submitPayment(data: PaymentInput): Promise<PaymentBackend> {
  const record = { ...data, status: "Pending" };
  let rtdbError: unknown = null;

  if (rtdb && (await rtdbConnected(3500))) {
    try {
      await withTimeout(
        set(push(ref(rtdb, "payments")), { ...record, date: rtdbTimestamp() }),
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
        addDoc(collection(db, "payments"), { ...record, date: serverTimestamp() }),
        12000
      );
      return "firestore";
    } catch (error) {
      throw rtdbError ?? error;
    }
  }

  throw rtdbError ?? new Error("no backend configured");
}
