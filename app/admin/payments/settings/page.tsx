"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import { db } from "@/lib/firebase";
import {
  DEFAULT_PAYMENT_SETTINGS,
  upiLink,
  type PaymentSettings,
} from "@/lib/payment";

const FIELDS: { key: keyof PaymentSettings; label: string; hint?: string; wide?: boolean }[] = [
  { key: "upiId", label: "UPI ID", hint: "The address students pay to" },
  { key: "payeeName", label: "Payee name", hint: "Shown in the UPI app" },
  {
    key: "qrUri",
    label: "QR / UPI link — optional",
    hint: "Leave blank to build the link from the UPI ID and the course fee",
    wide: true,
  },
  { key: "accountName", label: "Account holder name" },
  { key: "bankName", label: "Bank name" },
  { key: "accountNumber", label: "Account number" },
  { key: "ifsc", label: "IFSC code" },
  { key: "supportPhone", label: "Support phone" },
  { key: "supportEmail", label: "Support email" },
];

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoaded(true);
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "payment"));
        if (snap.exists()) {
          setSettings({
            ...DEFAULT_PAYMENT_SETTINGS,
            ...((snap.data() as Partial<PaymentSettings>) || {}),
          });
        }
      } catch {
        /* keep the defaults if it cannot be read */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  function set<K extends keyof PaymentSettings>(key: K, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!db) {
      setNotice("Firebase is not configured.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await setDoc(doc(db, "settings", "payment"), settings, { merge: true });
      setNotice("Payment settings saved.");
    } catch {
      setNotice("Could not save. Check that you are signed in as an admin.");
    } finally {
      setBusy(false);
    }
  }

  // preview of what the student scans, for a sample ₹1,000 fee
  const preview = upiLink(settings, 1000, "Course fee");

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Payment settings</h1>
      <p className="mt-1 text-sm text-slate-600">
        These details are shown to students on the checkout page, and the QR is what
        they scan to pay.
      </p>

      <form onSubmit={save} className="mt-6 grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="grid gap-5 px-5 py-6 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                <label htmlFor={"p-" + f.key} className="field-label block">
                  {f.label}
                </label>
                <input
                  id={"p-" + f.key}
                  value={settings[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="field"
                  placeholder={f.hint}
                />
                {f.hint && f.wide ? (
                  <p className="mt-1.5 text-xs text-slate-500">{f.hint}</p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-5 py-4">
            <button type="submit" disabled={busy || !loaded} className="btn-primary px-5 py-2.5 disabled:opacity-60">
              {busy ? "Saving..." : "Save payment settings"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSettings(DEFAULT_PAYMENT_SETTINGS);
                setNotice("Defaults restored — press Save to keep them.");
              }}
              className="btn-ghost px-5 py-2.5"
            >
              Reset to defaults
            </button>
            {notice ? <span className="text-sm text-slate-600">{notice}</span> : null}
          </div>
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-navy-800">QR preview</h2>
          <p className="mt-1 text-xs text-slate-500">
            What the student sees for a ₹1,000 fee.
          </p>
          <div className="mt-4 rounded-md border border-slate-200 p-3">
            <QRCodeSVG value={preview} className="h-auto w-full" />
          </div>
          <p className="mt-3 break-all text-[11px] leading-relaxed text-slate-500">{preview}</p>
        </aside>
      </form>
    </>
  );
}
