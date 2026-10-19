"use client";

import { useEffect, useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendEmailVerification,
  sendSignInLinkToEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  updateProfile,
  type ActionCodeSettings,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

type Mode = "login" | "signup" | "link";

const EMAIL_FOR_SIGN_IN = "nqtEmailForSignIn";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address does not look right.",
  "auth/email-already-in-use":
    "An account with that email already exists. Try logging in instead.",
  "auth/weak-password": "Please choose a password with at least 8 characters.",
  "auth/operation-not-allowed":
    "Email sign-in is not enabled for this project yet.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/unauthorized-continue-uri":
    "This site is not allowed to send sign-in links yet. Add it under Authentication -> Settings -> Authorized domains in Firebase.",
  "auth/expired-action-code":
    "That sign-in link has expired. Please request a new one.",
  "auth/invalid-action-code":
    "That sign-in link has already been used or is invalid. Please request a new one.",
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

  // If the page was opened from a sign-in link, finish the sign-in.
  useEffect(() => {
    if (!auth || typeof window === "undefined") return;
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    let email = window.localStorage.getItem(EMAIL_FOR_SIGN_IN) || "";
    if (!email) {
      email = window.prompt("Confirm the email address you used to sign in") || "";
    }
    if (!email) return;

    setBusy(true);
    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        window.localStorage.removeItem(EMAIL_FOR_SIGN_IN);
        window.history.replaceState({}, "", window.location.pathname);
      })
      .catch((err) => {
        setMode("link");
        setError(
          ERROR_MESSAGES[codeOf(err)] ||
            "That sign-in link is not valid any more. Please request a new one."
        );
      })
      .finally(() => setBusy(false));
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

  async function handleSendLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth || typeof window === "undefined") {
      setError("Sign-in is not connected yet. Please contact us for access.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const actionCodeSettings: ActionCodeSettings = {
        url: window.location.origin + window.location.pathname,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem(EMAIL_FOR_SIGN_IN, email);
      setNotice(
        "We have emailed you a sign-in link. Open it on this device to finish signing in."
      );
    } catch (err) {
      setError(
        ERROR_MESSAGES[codeOf(err)] ||
          "Could not send the sign-in link. Please try again."
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

        {!user.emailVerified ? (
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

  const heading =
    mode === "login"
      ? "Login to your account"
      : mode === "signup"
        ? "Create your account"
        : "Sign in with an email link";

  const subheading =
    mode === "login"
      ? "Enter your details below to sign in."
      : mode === "signup"
        ? "Sign up with your name, email and a password."
        : "We will email you a one-time sign-in link. A new link is sent every time.";

  return (
    <>
      <h2 className="text-xl font-semibold text-navy-800">{heading}</h2>
      <p className="mt-2 text-sm text-slate-600">{subheading}</p>

      {mode === "link" ? (
        <form onSubmit={handleSendLink} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="field-label">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="field" />
          </div>

          {error ? (
            <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
              {notice}
            </p>
          ) : null}

          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Sending..." : "Send sign-in link"}
          </button>
        </form>
      ) : (
        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="mt-7 space-y-5">
          {mode === "signup" ? (
            <div>
              <label htmlFor="name" className="field-label">Name</label>
              <input id="name" name="name" autoComplete="name" required className="field" />
            </div>
          ) : null}

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
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "signup" ? 8 : undefined}
              required
              className="field"
            />
          </div>

          {mode === "login" ? (
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
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Log in"
                : "Sign up"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3 text-center text-sm text-slate-600">
        {mode === "login" ? (
          <>
            <p>
              <button
                type="button"
                onClick={() => switchMode("link")}
                className="font-semibold text-brand-600 hover:underline"
              >
                Sign in with an email link instead
              </button>
            </p>
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-brand-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </>
        ) : mode === "signup" ? (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-semibold text-brand-600 hover:underline"
            >
              Log in
            </button>
          </p>
        ) : (
          <p>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-semibold text-brand-600 hover:underline"
            >
              Back to password login
            </button>
          </p>
        )}
      </div>
    </>
  );
}
