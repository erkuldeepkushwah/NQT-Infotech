"use client";

import { onValue, push, ref, serverTimestamp as rtdbTimestamp, set } from "firebase/database";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, rtdb } from "@/lib/firebase";

export type EnquiryInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

export type EnquiryBackend = "rtdb" | "firestore";

/**
 * The Realtime Database queues writes while it is offline and never rejects, so
 * a bad or missing database would leave the form stuck on "Submitting...".
 * Race it against a timeout instead.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * True only if the Realtime Database client actually reaches the server. A
 * database that was never created sits "offline" forever, and writes to it are
 * queued silently - so check before relying on it.
 */
function rtdbConnected(ms: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (!rtdb) {
      resolve(false);
      return;
    }
    const connectedRef = ref(rtdb, ".info/connected");
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let unsubscribe: () => void = () => {};
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      unsubscribe();
      resolve(value);
    };
    timer = setTimeout(() => finish(false), ms);
    unsubscribe = onValue(
      connectedRef,
      (snapshot) => {
        if (snapshot.val() === true) finish(true);
      },
      () => finish(false)
    );
  });
}

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
