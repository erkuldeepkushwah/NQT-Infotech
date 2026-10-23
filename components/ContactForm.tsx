"use client";

import { useState } from "react";
import { push, ref, serverTimestamp as rtdbTimestamp, set } from "firebase/database";
import { isFirebaseConfigured, rtdb } from "@/lib/firebase";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!isFirebaseConfigured || !rtdb) {
      setStatus("error");
      setNotice("The enquiry form is not connected yet. Please email us directly.");
      return;
    }

    setStatus("sending");
    setNotice("");

    try {
      // Enquiries live in the Realtime Database, where the admin panel reads them.
      await set(push(ref(rtdb, "enquiries")), {
        name: String(data.get("fullname") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        company: String(data.get("company") || "").trim(),
        message: String(data.get("message") || "").trim(),
        createdAt: rtdbTimestamp(),
      });
      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setNotice(
        "Sorry, your message could not be sent. Please try again, or email us directly."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-navy-800">Message submitted</h3>
        <p className="mt-2 text-sm text-slate-600">
          Thank you! Your enquiry has been received. Our team will get back to you
          within one working day.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-5">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="fullname" className="field-label">Full name</label>
        <input id="fullname" name="fullname" required className="field" />
      </div>
      <div>
        <label htmlFor="email" className="field-label">Email address</label>
        <input id="email" name="email" type="email" required className="field" />
      </div>
      <div>
        <label htmlFor="phone" className="field-label">Phone number</label>
        <input id="phone" name="phone" className="field" />
      </div>
      <div>
        <label htmlFor="company" className="field-label">Company / business name</label>
        <input id="company" name="company" className="field" />
      </div>
      <div>
        <label htmlFor="message" className="field-label">Your message</label>
        <textarea id="message" name="message" rows={5} required className="field" />
      </div>
      <label className="flex items-start gap-3 text-sm text-slate-900">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-slate-300" />
        <span>I agree to the privacy policy and terms of service.</span>
      </label>

      {status === "error" && notice ? (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {notice}
        </p>
      ) : null}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-70">
        {status === "sending" ? (
          <>
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            Submitting...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
