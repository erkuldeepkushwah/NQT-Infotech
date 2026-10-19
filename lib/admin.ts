// Admin access.
//
// Who counts as an admin is decided by their email address, and enforced in
// Firestore Security Rules (see firestore.rules) - NOT by this file. This list
// is only used to decide what the UI shows; the database will refuse an
// admin's queries for anyone whose email is not on the list below.
//
// Add or remove admins in BOTH places.

export const ADMIN_EMAILS = ["brivora@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

export type AdminUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: { toDate?: () => Date } | null;
};

export type AdminEnquiry = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  createdAt?: { toDate?: () => Date } | null;
};

export type AdminCourse = {
  id: string;
  title?: string;
  category?: string;
  level?: string;
  fee?: number;
  oldFee?: number;
  duration?: string;
  status?: string;
  image?: string;
};

export type AdminPayment = {
  id: string;
  studentName?: string;
  courseTitle?: string;
  amount?: number;
  method?: string;
  utr?: string;
  status?: string;
  date?: { toDate?: () => Date } | null;
};

export function formatDate(value: AdminUser["createdAt"]): string {
  if (!value) return "-";
  const d = typeof value.toDate === "function" ? value.toDate() : null;
  if (!d) return "-";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
