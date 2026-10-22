"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { courses } from "@/lib/site";
import { img } from "@/lib/images";

const UPI_ID = "brivora@yesbank";
const SUPPORT_PHONE = "+91-78986-92133";
const SUPPORT_EMAIL = "brivora@gmail.com";
const WINDOW_SECONDS = 5 * 60;

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toAmount(value: string): number {
  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
}

function rupees(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}

function Lock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

function Tick() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M4 12.5 9.5 18 20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Checkout() {
  const params = useSearchParams();
  const wanted = params.get("course");

  const course = useMemo(() => {
    if (wanted) {
      const hit = courses.find((c) => slugify(c.title) === wanted);
      if (hit) return hit;
    }
    return courses[0];
  }, [wanted]);

  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<"upi" | "netbanking">("upi");
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(WINDOW_SECONDS);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const price = toAmount(course.price);
  const oldPrice = toAmount(course.oldPrice);
  const discount = Math.max(oldPrice - price, 0);
  const clock = String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const clean = utr.replace(/\s/g, "");
    if (!/^[0-9]{6}$|^[0-9]{12}$/.test(clean)) {
      setStatus("error");
      setMessage("Enter the 6 or 12 digit UTR / reference number from your UPI app.");
      return;
    }
    if (!user) {
      setStatus("error");
      setMessage("Please sign in again before paying.");
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      if (db) {
        await addDoc(collection(db, "payments"), {
          // firestore.rules requires the writer's uid on every payment.
          uid: user?.uid || "",
          studentName: user?.displayName || user?.email || "",
          studentEmail: user?.email || "",
          courseTitle: course.title,
          amount: price,
          method: tab === "upi" ? "UPI" : "Net Banking",
          utr: clean,
          status: "Pending",
          date: serverTimestamp(),
        });
      }
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage("Could not save the payment. Please try again or email " + SUPPORT_EMAIL + ".");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
          <Tick />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy-800">Payment submitted</h1>
        <p className="mt-3 text-sm text-slate-600">
          We have received your reference <strong>{utr.replace(/\s/g, "")}</strong> for{" "}
          <strong>{course.title}</strong> ({rupees(price)}). Our team verifies UPI payments
          manually and you will get access shortly.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/courses" className="btn-primary px-6 py-2.5">
            My courses
          </Link>
          <Link href="/dashboard/browse" className="btn-ghost px-6 py-2.5">
            Browse more
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* The payment UI keeps one fixed desktop layout at every screen size. */}
      <div className="min-w-[960px]">
      {/* Stepper + timer */}
      <div className="flex items-center justify-between gap-4">
        <ol className="flex items-center gap-x-3 text-sm">
          <li className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
              <Tick />
            </span>
            Select Program
          </li>
          <li className="text-slate-300">—</li>
          <li className="font-semibold text-brand-600">2. Complete Enrollment</li>
          <li className="text-slate-300">—</li>
          <li className="text-slate-400">3. Instant Access</li>
        </ol>
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900">
            ⏱ TIME {clock}
          </span>
          <Link
            href="/dashboard/browse"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-900 hover:border-slate-400"
          >
            ✕ Close
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_400px] gap-6">
        {/* Payment panel */}
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-7">
          <h1 className="text-xl font-bold text-navy-800">Complete your Payment</h1>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTab("upi")}
              className={
                "rounded-lg border px-4 py-3 text-left transition " +
                (tab === "upi" ? "border-brand-500 bg-brand-50/60" : "border-slate-200 hover:border-slate-300")
              }
            >
              <span className="block text-sm font-semibold text-navy-800">UPI / QR</span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                Popular
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTab("netbanking")}
              className={
                "rounded-lg border px-4 py-3 text-left transition " +
                (tab === "netbanking" ? "border-brand-500 bg-brand-50/60" : "border-slate-200 hover:border-slate-300")
              }
            >
              <span className="block text-sm font-semibold text-navy-800">Net Banking</span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                All banks
              </span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-[200px_1fr] gap-6">
            <div className="rounded-lg border border-slate-200 p-3">
              <img
                src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/qr/" + slugify(course.title) + ".png"}
                alt={"UPI QR code for " + course.title}
                width={360}
                height={360}
                className="h-auto w-full"
              />
            </div>
            <div>
              <p className="text-base font-semibold text-navy-800">Scan with any UPI App</p>
              <p className="mt-1 text-sm text-slate-900">GPay · PhonePe · Paytm · CRED</p>

              <div className="mt-5 flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2.5">
                <span className="text-xs text-slate-900">UPI ID</span>
                <span className="flex-1 text-sm font-semibold text-slate-900">{UPI_ID}</span>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-900 hover:border-slate-400"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <p className="mt-5 text-xs text-slate-500">
                {tab === "upi"
                  ? "Pay the exact amount, then paste the UTR / reference number below."
                  : "Transfer to the same UPI ID from your bank's net-banking app, then paste the reference number below."}
              </p>
            </div>
          </div>

          {/* Fixed-width so the field never stretches or squeezes with the panel. */}
          <div className="mt-6 w-[440px]">
            <label htmlFor="utr" className="field-label block">
              UTR / Transaction Reference Number (Last 6 digits)
            </label>
            <input
              id="utr"
              name="utr"
              inputMode="numeric"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="field"
              aria-describedby="utr-help"
            />
            <p id="utr-help" className="mt-1.5 text-xs text-slate-500">
              Enter the 6 or 12 digit UTR / Ref Number from your payment app.
            </p>
          </div>

          {status === "error" && message ? (
            <p role="alert" className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          ) : null}

          <div className="mt-5 flex justify-center">
            <button type="submit" disabled={status === "saving"} className="btn-primary w-[440px] py-3 disabled:opacity-60">
              <Lock />
              {status === "saving" ? "Submitting..." : "Pay " + rupees(price) + " Securely →"}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] font-medium text-slate-900">
            <span className="rounded-md border border-slate-200 px-3 py-2 text-center">◷ 7-Day Guarantee</span>
            <span className="rounded-md border border-slate-200 px-3 py-2 text-center">✓ Admin Verified</span>
            <span className="rounded-md border border-slate-200 px-3 py-2 text-center">⚡ Instant Access</span>
          </div>
        </form>

        {/* Order summary */}
        <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <img
            src={img(course.image, 800, 300)}
            alt={course.title}
            className="h-[150px] w-full object-cover"
          />
          <div className="p-6">
            <h2 className="text-lg font-bold text-navy-800">{course.title}</h2>
            <p className="mt-1 text-xs text-slate-900">
              {course.category} • {course.duration}
            </p>

            <dl className="mt-6 space-y-3 border-t border-dashed border-slate-200 pt-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-900">Course Fee</dt>
                <dd className="text-slate-900 line-through">{rupees(oldPrice)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-900">Discount</dt>
                <dd className="font-medium text-slate-900">- {rupees(discount)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Total amount to pay
                </dt>
                <dd className="text-2xl font-extrabold text-slate-900">{rupees(price)}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-slate-200 pt-5 text-sm">
              <p className="font-semibold text-slate-900">Need assistance?</p>
              <p className="mt-2 text-slate-900">
                Call:{" "}
                <a href={"tel:" + SUPPORT_PHONE} className="font-semibold text-slate-900 hover:underline">
                  {SUPPORT_PHONE}
                </a>
              </p>
              <p className="text-slate-900">
                <a href={"mailto:" + SUPPORT_EMAIL} className="hover:underline">
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading checkout...</p>}>
      <Checkout />
    </Suspense>
  );
}
