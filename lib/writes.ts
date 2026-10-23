"use client";

import { onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase";

/**
 * Firebase queues writes while a backend is unreachable and never rejects, so
 * a missing database leaves a button stuck on "Submitting..." forever. Race
 * every write against a timeout instead.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
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
export function rtdbConnected(ms: number): Promise<boolean> {
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
