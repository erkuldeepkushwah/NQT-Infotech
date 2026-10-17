"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-navy-800">Thank you!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Your enquiry has been noted. Our team will get back to you within one
          working day.
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn-ghost mt-5">
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
      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-slate-300" />
        <span>I agree to the privacy policy and terms of service.</span>
      </label>
      <button type="submit" className="btn-primary w-full">
        Send message
      </button>
    </form>
  );
}
