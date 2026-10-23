"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    if (!db) {
      setReady(true);
      return;
    }
    return onSnapshot(
      doc(db, "settings", "payment"),
      (snap) => {
        setSettings({
          ...DEFAULT_PAYMENT_SETTINGS,
          ...((snap.data() as Partial<PaymentSettings>) || {}),
        });
        setReady(true);
      },
      () => setReady(true)
    );
  }, []);

  return { settings, ready };
}
