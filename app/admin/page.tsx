"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Panel, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { useRtdbList } from "@/lib/useRtdb";
import { auth } from "@/lib/firebase";
import { img } from "@/lib/images";
import { courses as siteCourses } from "@/lib/site";
import {
  formatDate,
  type AdminCourse,
  type AdminEnquiry,
  type AdminPayment,
  type AdminUser,
} from "@/lib/admin";

function toNumber(value: string): number {
  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
}

function initials(name: string): string {
  return name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type CourseRow = {
  id: string;
  title: string;
  category?: string;
  level?: string;
  duration?: string;
  fee?: number;
  oldFee?: number;
  status?: string;
  image?: string;
};

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [paymentTab, setPaymentTab] = useState<"pending" | "all">("pending");
  const [queryTab, setQueryTab] = useState<"all" | "unread">("all");

  const users = useRtdbList<AdminUser>("users");
  const enquiries = useRtdbList<AdminEnquiry>("enquiries");
  const payments = useCollection<AdminPayment>("payments", 100);
  const liveCourses = useRtdbList<AdminCourse>("courses");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const name = user?.displayName || (user?.email || "").split("@")[0] || "Admin";

  const activeUsers = users.rows.filter((u) => (u.status || "active").toLowerCase() === "active").length;
  const disabledUsers = users.rows.filter((u) => (u.status || "").toLowerCase() === "disabled").length;

  const pendingPayments = payments.rows.filter(
    (p) => (p.status || "pending").toLowerCase() === "pending"
  );
  const shownPayments = paymentTab === "pending" ? pendingPayments : payments.rows;

  const courseRows: CourseRow[] =
    liveCourses.rows.length > 0
      ? liveCourses.rows.map((c) => ({
          id: c.id,
          title: c.title || "Untitled",
          category: c.category,
          level: c.level,
          duration: c.duration,
          fee: c.fee,
          oldFee: c.oldFee,
          status: c.status || "Active",
          image: c.image,
        }))
      : siteCourses.map((c) => ({
          id: "site-" + c.title,
          title: c.title,
          category: c.category,
          level: c.level,
          duration: c.duration,
          fee: toNumber(c.price),
          oldFee: toNumber(c.oldPrice),
          status: "Active",
          image: c.image,
        }));

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Welcome back, {name}</h1>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={users.loading ? "-" : users.rows.length} tone="brand" icon="users" />
        <StatCard label="Active users" value={users.loading ? "-" : activeUsers} tone="green" icon="check" />
        <StatCard label="Disabled users" value={users.loading ? "-" : disabledUsers} tone="red" icon="ban" />
        <StatCard label="New registrations" value={users.loading ? "-" : users.rows.length} tone="brand" icon="spark" />
      </div>

      {/* System band */}
      <div className="mt-6 grid overflow-hidden rounded-lg bg-navy-800 sm:grid-cols-3">
        <Band
          label="Contact enquiries"
          value={enquiries.loading ? "-" : String(enquiries.rows.length)}
          chip="All time"
          chipTone="green"
        />
        <Band
          label="Courses published"
          value={String(courseRows.length)}
          chip="Live"
          chipTone="green"
        />
        <Band
          label="Payments awaiting review"
          value={payments.loading ? "-" : String(pendingPayments.length)}
          chip={pendingPayments.length > 0 ? "Action needed" : "All clear"}
          chipTone={pendingPayments.length > 0 ? "amber" : "green"}
        />
      </div>

      {/* Recent users */}
      <Panel
        title="Recent Users"
        action={<Link href="/admin/users" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>}
      >
        <TableShell headers={["User", "Email", "Role", "Status", "Created Date", "Actions"]}>
          {users.loading ? (
            <EmptyRow colSpan={6} text="Loading users..." />
          ) : users.error ? (
            <EmptyRow colSpan={6} text={users.error} />
          ) : users.rows.length === 0 ? (
            <EmptyRow colSpan={6} text="No registered users yet." />
          ) : (
            users.rows.slice(0, 5).map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
                      {initials(u.name || u.email || "U")}
                    </span>
                    <span className="font-medium text-navy-800">
                      {u.name || (u.email || "").split("@")[0]}
                    </span>
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-600">{u.email || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{u.role || "User"}</td>
                <td className="px-5 py-3"><StatusPill status={u.status || "Active"} /></td>
                <td className="px-5 py-3 text-slate-600">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-3">
                  <button type="button" className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700">
                    Action
                  </button>
                </td>
              </tr>
            ))
          )}
        </TableShell>
      </Panel>

      {/* Courses */}
      <Panel
        title="Courses"
        action={
          <Link href="/admin/courses/new" className="btn-primary px-4 py-2 text-sm">
            Add Course
          </Link>
        }
      >
        <TableShell headers={["Image", "Course", "Category", "Fee", "Duration", "Status", "Actions"]}>
          {courseRows.slice(0, 6).map((c) => (
            <tr key={c.id} className="border-b border-slate-50 last:border-0">
              <td className="px-5 py-3">
                <img
                  src={img(c.image || "course-analytics", 80, 80)}
                  alt=""
                  className="h-12 w-16 rounded object-cover"
                />
              </td>
              <td className="px-5 py-3">
                <span className="font-medium text-navy-800">{c.title}</span>
                <span className="block text-xs text-slate-500">{c.level}</span>
              </td>
              <td className="px-5 py-3 text-slate-600">{c.category}</td>
              <td className="px-5 py-3">
                <span className="font-semibold text-navy-800">
                  {c.fee ? "₹" + c.fee.toLocaleString("en-IN") : "-"}
                </span>
                {c.oldFee ? (
                  <span className="ml-2 text-xs text-slate-400 line-through">
                    ₹{c.oldFee.toLocaleString("en-IN")}
                  </span>
                ) : null}
              </td>
              <td className="px-5 py-3 text-slate-600">{c.duration}</td>
              <td className="px-5 py-3"><StatusPill status={c.status || "Active"} /></td>
              <td className="px-5 py-3">
                <span className="flex gap-2">
                  <Link href="/admin/courses" className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700">
                    Edit
                  </Link>
                  <Link href="/admin/courses" className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:border-red-300 hover:bg-red-50">
                    Delete
                  </Link>
                </span>
              </td>
            </tr>
          ))}
        </TableShell>
        {liveCourses.rows.length === 0 ? (
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Showing the courses from the website. Import them from the Courses page to manage them here.
          </p>
        ) : null}
      </Panel>

      {/* Payment requests */}
      <Panel
        title="Payment Requests"
        action={
          <span className="flex gap-2">
            <TabButton active={paymentTab === "pending"} onClick={() => setPaymentTab("pending")}>
              Pending ({pendingPayments.length})
            </TabButton>
            <TabButton active={paymentTab === "all"} onClick={() => setPaymentTab("all")}>
              All ({payments.rows.length})
            </TabButton>
          </span>
        }
      >
        <TableShell headers={["Student", "Course", "Amount", "Method", "UTR", "Date", "Status", "Actions"]}>
          {payments.loading ? (
            <EmptyRow colSpan={8} text="Loading payments..." />
          ) : shownPayments.length === 0 ? (
            <EmptyRow
              colSpan={8}
              text={paymentTab === "pending" ? "No pending payment requests." : "No payment requests yet."}
            />
          ) : (
            shownPayments.slice(0, 5).map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{p.studentName || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{p.courseTitle || "-"}</td>
                <td className="px-5 py-3 text-slate-600">
                  {p.amount ? "₹" + p.amount.toLocaleString("en-IN") : "-"}
                </td>
                <td className="px-5 py-3 text-slate-600">{p.method || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{p.utr || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{formatDate(p.date)}</td>
                <td className="px-5 py-3"><StatusPill status={p.status || "Pending"} /></td>
                <td className="px-5 py-3 text-slate-400">-</td>
              </tr>
            ))
          )}
        </TableShell>
      </Panel>

      {/* Contact queries */}
      <Panel
        title="Contact Queries"
        action={
          <span className="flex gap-2">
            <TabButton active={queryTab === "all"} onClick={() => setQueryTab("all")}>
              All ({enquiries.rows.length})
            </TabButton>
            <TabButton active={queryTab === "unread"} onClick={() => setQueryTab("unread")}>
              Unread ({enquiries.rows.length})
            </TabButton>
          </span>
        }
      >
        <TableShell headers={["Name", "Email", "Message", "Received", ""]}>
          {enquiries.loading ? (
            <EmptyRow colSpan={5} text="Loading queries..." />
          ) : enquiries.error ? (
            <EmptyRow colSpan={5} text={enquiries.error} />
          ) : enquiries.rows.length === 0 ? (
            <EmptyRow
              colSpan={5}
              text="No enquiries yet. They appear here as soon as someone submits the contact form."
            />
          ) : (
            enquiries.rows.slice(0, 5).map((q) => (
              <tr key={q.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{q.name || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{q.email || "-"}</td>
                <td className="max-w-md px-5 py-3 text-slate-600">
                  <span className="line-clamp-2">{q.message || "-"}</span>
                </td>
                <td className="px-5 py-3 text-slate-600">{formatDate(q.createdAt)}</td>
                <td className="px-5 py-3">
                  <Link href="/admin/queries" className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700">
                    Read
                  </Link>
                </td>
              </tr>
            ))
          )}
        </TableShell>
      </Panel>
    </>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  tone: "brand" | "green" | "red";
  icon: string;
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };
  const paths: Record<string, string> = {
    users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6",
    check: "M20 6L9 17l-5-5",
    ban: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8",
    spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18",
  };
  return (
    <div className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-3 text-3xl font-bold text-navy-800">{value}</p>
      </div>
      <span className={"flex h-9 w-9 flex-none items-center justify-center rounded-md " + tones[tone]}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={paths[icon]} />
        </svg>
      </span>
    </div>
  );
}

function Band({
  label,
  value,
  chip,
  chipTone,
}: {
  label: string;
  value: string;
  chip: string;
  chipTone: "green" | "amber";
}) {
  const chipClass = chipTone === "green" ? "bg-green-500 text-white" : "bg-amber-400 text-navy-900";
  return (
    <div className="border-b border-white/10 px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <span className={"mt-2 inline-block rounded px-2 py-0.5 text-[11px] font-semibold " + chipClass}>
        {chip}
      </span>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-md px-4 py-2 text-sm font-semibold transition " +
        (active
          ? "bg-brand-600 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700")
      }
    >
      {children}
    </button>
  );
}
