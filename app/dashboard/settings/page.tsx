"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { push, ref, set as rtdbSet } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";
import { saveUserProfile } from "@/lib/profiles";

const NOTIFICATIONS = [
  { key: "courseUpdates", label: "Course updates", hint: "New modules, schedule changes" },
  { key: "lessons", label: "Lessons & assignments", hint: "When new work is published" },
  { key: "offers", label: "Offers & announcements", hint: "Discounts and new batches" },
  { key: "weekly", label: "Weekly progress summary", hint: "A short email every Monday" },
] as const;

type Toggles = Record<(typeof NOTIFICATIONS)[number]["key"], boolean>;

const DEFAULT_TOGGLES: Toggles = {
  courseUpdates: true,
  lessons: true,
  offers: false,
  weekly: true,
};

function initials(name: string): string {
  return (
    name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0))
      .slice(0, 2)
      .join("") || "S"
  ).toUpperCase();
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={
        "relative inline-flex h-6 w-11 flex-none items-center rounded-full transition " +
        (checked ? "bg-brand-600" : "bg-slate-300")
      }
    >
      <span
        className={
          "inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition " +
          (checked ? "translate-x-[22px]" : "translate-x-[3px]")
        }
        style={{ height: 18, width: 18 }}
      />
    </button>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-semibold text-navy-800">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </header>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export default function StudentSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [toggles, setToggles] = useState<Toggles>(DEFAULT_TOGGLES);
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [prefMsg, setPrefMsg] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setName(u?.displayName || "");
    });
  }, []);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setProfileMsg("");
    if (!auth?.currentUser) return;
    setBusy(true);
    try {
      if (name.trim()) await updateProfile(auth.currentUser, { displayName: name.trim() });
      if (user) {
        await saveUserProfile(user.uid, {
          name: name.trim(),
          email: user.email || "",
          phone: phone.trim(),
        });
      }
      setProfileMsg("Saved.");
    } catch {
      setProfileMsg("Could not save. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordMsg("");
    if (!auth?.currentUser) return;
    if (password.length < 8) {
      setPasswordMsg("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setPasswordMsg("The two passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await updatePassword(auth.currentUser, password);
      setPassword("");
      setConfirm("");
      setPasswordMsg("Password updated.");
    } catch {
      setPasswordMsg("Could not update. Sign out and back in, then try again.");
    } finally {
      setBusy(false);
    }
  }

  async function savePreferences() {
    setPrefMsg("");
    if (!rtdb || !user) return;
    setBusy(true);
    try {
      await rtdbSet(ref(rtdb, "users/" + user.uid + "/preferences"), {
        notifications: toggles,
        language,
        timezone,
      });
      setPrefMsg("Preferences saved.");
    } catch {
      setPrefMsg("Could not save. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function requestDeletion() {
    setDeleteMsg("");
    setBusy(true);
    try {
      if (rtdb && user) {
        await rtdbSet(push(ref(rtdb, "enquiries")), {
          name: user.displayName || "Student",
          email: user.email || "",
          phone: "",
          company: "",
          message: "Account deletion request from the student dashboard settings page.",
          createdAt: Date.now(),
        });
      }
      setDeleteMsg("Request sent. Our team will confirm by email.");
    } catch {
      setDeleteMsg("Could not send the request. Please email brivora@gmail.com.");
    } finally {
      setBusy(false);
    }
  }

  const displayName = user?.displayName || user?.email || "Student";

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Settings</h1>
      <p className="mt-1 text-sm text-slate-600">
        Manage your profile, password, notifications and preferences.
      </p>

      <div className="mt-6 grid max-w-3xl gap-6">
        {/* Profile */}
        <Card title="Profile" description="This is how you appear in the dashboard.">
          <form onSubmit={saveProfile}>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-brand-600 text-base font-bold text-white">
                {initials(displayName)}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-800">{displayName}</p>
                <p className="text-xs text-slate-500">Student</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="set-name" className="field-label block">
                  Full name
                </label>
                <input
                  id="set-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="set-phone" className="field-label block">
                  Phone number
                </label>
                <input
                  id="set-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field"
                  inputMode="tel"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="set-email" className="field-label block">
                Email address
              </label>
              <input
                id="set-email"
                value={user?.email || ""}
                readOnly
                className="field bg-slate-50 text-slate-500"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Your sign-in email cannot be changed here.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button type="submit" disabled={busy} className="btn-primary px-5 py-2.5 disabled:opacity-60">
                Save changes
              </button>
              {profileMsg ? <span className="text-sm text-slate-600">{profileMsg}</span> : null}
            </div>
          </form>
        </Card>

        {/* Password */}
        <Card title="Password" description="Use at least 8 characters.">
          <form onSubmit={savePassword}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="set-pass" className="field-label block">
                  New password
                </label>
                <input
                  id="set-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="set-pass2" className="field-label block">
                  Confirm new password
                </label>
                <input
                  id="set-pass2"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="field"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button type="submit" disabled={busy} className="btn-ghost px-5 py-2.5 disabled:opacity-60">
                Update password
              </button>
              {passwordMsg ? <span className="text-sm text-slate-600">{passwordMsg}</span> : null}
            </div>
          </form>
        </Card>

        {/* Notifications */}
        <Card title="Notifications" description="Choose what we email you about.">
          <ul className="divide-y divide-slate-100">
            {NOTIFICATIONS.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-navy-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.hint}</p>
                </div>
                <Switch
                  label={item.label}
                  checked={toggles[item.key]}
                  onChange={(value) => setToggles((t) => ({ ...t, [item.key]: value }))}
                />
              </li>
            ))}
          </ul>
        </Card>

        {/* Preferences */}
        <Card title="Preferences" description="Language and timezone for your dashboard.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="set-lang" className="field-label block">
                Language
              </label>
              <select
                id="set-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="field"
              >
                <option>English</option>
                <option>हिन्दी (Hindi)</option>
              </select>
            </div>
            <div>
              <label htmlFor="set-tz" className="field-label block">
                Timezone
              </label>
              <select
                id="set-tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="field"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="button" onClick={savePreferences} disabled={busy} className="btn-primary px-5 py-2.5 disabled:opacity-60">
              Save preferences
            </button>
            {prefMsg ? <span className="text-sm text-slate-600">{prefMsg}</span> : null}
          </div>
        </Card>

        {/* Account */}
        <Card title="Account" description="Signing out or leaving Brivora.">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-navy-800">Sign out</p>
              <p className="text-xs text-slate-500">Ends the session on this device.</p>
            </div>
            <button
              type="button"
              onClick={() => auth && signOut(auth)}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              Sign out
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <div>
              <p className="text-sm font-medium text-navy-800">Delete account</p>
              <p className="text-xs text-slate-500">
                We will email you to confirm before anything is removed.
              </p>
            </div>
            <button
              type="button"
              onClick={requestDeletion}
              disabled={busy}
              className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              Request deletion
            </button>
          </div>
          {deleteMsg ? <p className="mt-3 text-sm text-slate-600">{deleteMsg}</p> : null}
        </Card>
      </div>
    </>
  );
}
