"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Everything the checkout needs to show a payment method. The admin edits this
// on Payments -> Settings; the checkout reads it live.
export type PaymentSettings = {
  upiId: string;
  payeeName: string;
  /** Optional: paste the exact QR / UPI link to use instead of building one. */
  qrUri: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  supportPhone: string;
  supportEmail: string;
};

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  upiId: "brivora@yesbank",
  payeeName: "Brivora",
  qrUri: "",
  accountName: "Brivora Technologies",
  accountNumber: "1234567890123",
  ifsc: "YESB0000123",
  bankName: "Yes Bank",
  supportPhone: "+91-78986-92133",
  supportEmail: "brivora@gmail.com",
};

/** The string encoded into the QR: an admin-supplied link, or a standard UPI one. */
export function upiLink(settings: PaymentSettings, amount: number, note: string): string {
  const custom = (settings.qrUri || "").trim();
  if (custom) return custom;
  const params = new URLSearchParams({
    pa: settings.upiId,
    pn: settings.payeeName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return "upi://pay?" + params.toString();
}

export function usePaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!rtdb) {
      setReady(true);
      return;
    }
    // A database that is not answering must not hold the page up - fall back to
    // the defaults after a few seconds.
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        setReady(true);
      }
    }, 8000);

    const unsubscribe = onValue(
      ref(rtdb, "settings/payment"),
      (snapshot) => {
        settled = true;
        clearTimeout(timer);
        setSettings({
          ...DEFAULT_PAYMENT_SETTINGS,
          ...((snapshot.val() as Partial<PaymentSettings>) || {}),
        });
        setReady(true);
      },
      () => {
        settled = true;
        clearTimeout(timer);
        setReady(true);
      }
    );

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return { settings, ready };
}
