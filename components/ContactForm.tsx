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
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-brand-900">Thank you!</h3>
        <p className="mt-2 text-sm text-brand-800">
          Your enquiry has been noted. Our team will get back to you within one
          working day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="btn-ghost mt-5"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="text-sm font-medium text-slate-700">
          Service required
        </label>
        <select
          id="service"
          name="service"
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        >
          <option>Web Development</option>
          <option>Mobile App Development</option>
          <option>Cloud &amp; DevOps</option>
          <option>Custom Software</option>
          <option>UI/UX Design</option>
          <option>IT Support &amp; Maintenance</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-slate-700">
          Project details
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          placeholder="Tell us about your project..."
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send enquiry
      </button>
    </form>
  );
}
