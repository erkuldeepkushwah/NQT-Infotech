"use client";

import Link from "next/link";
import { useState } from "react";
import { createUserAsAdmin, isFirebaseConfigured } from "@/lib/firebase";
import { saveUserProfile } from "@/lib/profiles";

export default function AddUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [created, setCreated] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setNotice("");
    setCreated("");

    if (!isFirebaseConfigured) {
      setNotice("Firebase is not configured, so accounts cannot be created.");
      return;
    }
    if (password.length < 6) {
      setNotice("Use a password with at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      const uid = await createUserAsAdmin(email.trim(), password, name.trim());

      // The sign-in account exists now; store the profile next to it. A failed
      // profile write must not hide the fact that the account was created.
      try {
        await saveUserProfile(uid, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        });
      } catch {
        setNotice(
          "The account was created, but its profile could not be saved. Check that the database exists and its rules are published."
        );
      }

      setCreated(email.trim());
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error) {
      const code = (error as { code?: string }).code || "";
      setNotice(
        code === "auth/email-already-in-use"
          ? "An account with that email address already exists."
          : code === "auth/weak-password"
            ? "That password is too weak. Use at least 6 characters."
            : code === "auth/invalid-email"
              ? "That email address does not look right."
              : "Could not create the account. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Add user</h1>
      <p className="mt-1 text-sm text-slate-600">
        Create a student account. They can sign in straight away with the email and
        password you set here.
      </p>

      {created ? (
        <div className="mt-6 max-w-2xl rounded-lg border border-brand-100 bg-brand-50 px-5 py-4">
          <p className="text-sm font-semibold text-navy-800">Account created</p>
          <p className="mt-1 text-sm text-slate-600">
            <strong>{created}</strong> can now sign in with the password you set.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/users" className="btn-primary px-5 py-2.5">
              View all users
            </Link>
            <button type="button" onClick={() => setCreated("")} className="btn-ghost px-5 py-2.5">
              Add another
            </button>
          </div>
        </div>
      ) : null}

      <form onSubmit={submit} className="mt-6 max-w-2xl">
        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="grid gap-5 px-5 py-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="u-name" className="field-label block">
                Full name
              </label>
              <input
                id="u-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="u-email" className="field-label block">
                Email address
              </label>
              <input
                id="u-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                autoComplete="off"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                This is what they sign in with — Firebase accounts are identified by email.
              </p>
            </div>

            <div>
              <label htmlFor="u-phone" className="field-label block">
                Phone number
              </label>
              <input
                id="u-phone"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="u-pass" className="field-label block">
                Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="u-pass"
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="rounded-md border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-700 hover:border-slate-400"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                At least 6 characters. Share it with the student — they can change it later
                from their settings.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-5 py-4">
            <button type="submit" disabled={busy} className="btn-primary px-5 py-2.5 disabled:opacity-60">
              {busy ? "Creating..." : "Create user"}
            </button>
            <Link href="/admin/users" className="btn-ghost px-5 py-2.5">
              Cancel
            </Link>
            {notice ? <span className="text-sm text-red-600">{notice}</span> : null}
          </div>
        </section>
      </form>
    </>
  );
}
