"use client";

import { useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
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
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // The form is rendered straight away so it is present in the static HTML.
  // If a session is found we swap in the signed-in view.
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
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
    } catch (err) {
      setError(
        ERROR_MESSAGES[codeOf(err)] ||
          "Could not sign you in. Please check your details and try again."
      );
    } finally {
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
        setName(fullName);
      }
      try {
        await sendEmailVerification(credential.user);
      } catch {
        // not fatal - the account exists and they are signed in
      }
      if (db) {
        try {
          // Profile document the admin area reads. Firestore rules only allow a
          // user to create their own document, with role 'user'.
          await setDoc(doc(db, "users", credential.user.uid), {
            name: fullName,
            email,
            role: "user",
            status: "active",
            createdAt: serverTimestamp(),
          });
        } catch {
          // not fatal - the account still works
        }
      }
      form.reset();
    } catch (err) {
      setError(
        ERROR_MESSAGES[codeOf(err)] ||
          "Could not create your account. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (!auth) return;
    await signOut(auth);
    setName("");
    setMode("login");
  }

  async function resendVerification() {
    if (!auth || !auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      setNotice("Verification email sent.");
    } catch {
      setNotice("Could not send the email. Please try again later.");
    }
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
        <p className="mt-2 text-sm text-slate-600">
          {user.displayName || name || user.email}
        </p>

        {!user.emailVerified && !isAdminEmail(user.email) ? (
          <div className="mt-5 rounded-md bg-white/70 px-4 py-3 text-left text-xs text-slate-600">
            <p>Please verify your email address - we sent a link to {user.email}.</p>
            <button
              type="button"
              onClick={resendVerification}
              className="mt-2 font-semibold text-brand-600 hover:underline"
            >
              Resend verification email
            </button>
            {notice ? <p className="mt-2 text-brand-700">{notice}</p> : null}
          </div>
        ) : null}

        <button type="button" onClick={handleSignOut} className="btn-ghost mt-6">
          Sign out
        </button>
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
