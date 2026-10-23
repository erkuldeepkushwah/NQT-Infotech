"use client";

import { useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { submitEnquiry } from "@/lib/enquiries";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!isFirebaseConfigured) {
      setStatus("error");
      setNotice("The enquiry form is not connected yet. Please email us directly.");
      return;
    }

    setStatus("sending");
    setNotice("");

    try {
      // Saved to the Realtime Database, with Firestore as a safety net.
      await submitEnquiry({
        name: String(data.get("fullname") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        company: String(data.get("company") || "").trim(),
        message: String(data.get("message") || "").trim(),
      });
      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setNotice(
        "Sorry, your message could not be sent. Please email us at brivora@gmail.com instead."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => {
        // Clear the last confirmation as soon as the form is touched again.
        if (status !== "sending") {
          setStatus("idle");
          setNotice("");
        }
      }}
      className="space-y-5"
    >
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

      {status === "sent" ? (
        <p role="status" className="text-sm font-medium text-green-700">
          Message submitted. Our team will get back to you within one working day.
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
