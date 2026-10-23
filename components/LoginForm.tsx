"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { saveUserProfile } from "@/lib/profiles";
import { isAdminEmail } from "@/lib/admin";

type Mode = "login" | "signup";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address does not look right.",
  "auth/email-already-in-use":
    "An account with that email already exists. Try logging in instead.",
  "auth/weak-password": "Please choose a password with at least 8 characters.",
  "auth/operation-not-allowed":
    "Email and password sign-in is not enabled for this project yet.",
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
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Anyone who already has a session goes straight to their dashboard - there is
  // no "signed in" screen to click through. Sign out from the dashboard sidebar.
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (user: User | null) => {
      if (!user) return;
      setSignedIn(true);
      router.replace(isAdminEmail(user.email) ? "/admin" : "/dashboard");
    });
  }, [router]);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
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
      // onAuthStateChanged above takes over and redirects.
    } catch (err) {
      setError(
        ERROR_MESSAGES[codeOf(err)] ||
          "Could not sign you in. Please check your details and try again."
      );
      setBusy(false);
    }
  }

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) {
      setError("Sign-up is not connected yet. Please contact us for access.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    if (password.length < 8) {
      setError("Please choose a password with at least 8 characters.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName) {
        await updateProfile(credential.user, { displayName: fullName });
      }
      try {
        await sendEmailVerification(credential.user);
      } catch {
        // not fatal - the account exists and they are signed in
      }
      try {
        // Profile the admin area reads. Timed out internally, so a database that
        // is not set up cannot leave sign-up hanging.
        await saveUserProfile(credential.user.uid, { name: fullName, email });
      } catch {
        // not fatal - the account still works
      }
      form.reset();
      // onAuthStateChanged above takes over and redirects.
    } catch (err) {
      setError(
        ERROR_MESSAGES[codeOf(err)] ||
          "Could not create your account. Please try again."
      );
      setBusy(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Sign-in is not configured yet. Please contact us to get access.
      </div>
    );
  }

  if (signedIn) {
    return (
      <div className="py-6 text-center text-sm text-slate-600">
        Taking you to your dashboard...
      </div>
    );
  }

  const isLogin = mode === "login";

  return (
    <>
      <h2 className="text-xl font-semibold text-navy-800">
        {isLogin ? "Login to your account" : "Create your account"}
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        {isLogin
          ? "Enter your details below to sign in."
          : "Sign up with your name, email and a password."}
      </p>

      <form onSubmit={isLogin ? handleLogin : handleSignup} className="mt-7 space-y-5">
        {!isLogin ? (
          <div>
            <label htmlFor="name" className="field-label">Name</label>
            <input id="name" name="name" autoComplete="name" required className="field" />
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="field-label">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field"
          />
        </div>

        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={isLogin ? undefined : 8}
            required
            className="field"
          />
        </div>

        {isLogin ? (
          <label className="flex items-center gap-3 text-sm text-slate-600">
            <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300" />
            <span>Remember me on this device</span>
          </label>
        ) : (
          <p className="text-xs text-slate-500">Use at least 8 characters.</p>
        )}

        {error ? (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy
            ? isLogin
              ? "Signing in..."
              : "Creating account..."
            : isLogin
              ? "Log in"
              : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="font-semibold text-brand-600 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-semibold text-brand-600 hover:underline"
            >
              Log in
            </button>
          </>
        )}
      </p>
    </>
  );
}
