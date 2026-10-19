"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address does not look right.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

function codeOf(err: unknown): string {
  if (typeof err === "object" && err !== null && "code" in err) {
    return String((err as { code?: unknown }).code ?? "");
  }
  return "";
}

export default function LoginForm() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) {
      setError("Sign-in is not connected yet. Please contact us for access.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const remember = data.get("remember") === "on";

    setBusy(true);
    setError("");
    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, email, password);
      form.reset();
    } catch (err) {
      setError(
        ERROR_MESSAGES[codeOf(err)] ||
          "Could not sign you in. Please check your details and try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (!auth) return;
    await signOut(auth);
  }

  if (!ready) {
    return <p className="text-sm text-slate-500">Checking your session...</p>;
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Sign-in is not configured yet. Please contact us to get access.
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-navy-800">You are signed in</h3>
        <p className="mt-2 text-sm text-slate-600">{user.email}</p>
        <button type="button" onClick={handleSignOut} className="btn-ghost mt-6">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="field-label">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="field" />
        </div>
        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="field"
          />
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300" />
          <span>Remember me on this device</span>
        </label>

        {error ? (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
          Contact us to get access
        </Link>
      </p>
    </>
  );
}
