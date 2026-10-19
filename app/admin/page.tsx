"use client";

import Link from "next/link";
import { Panel, StatCard, TableShell, EmptyRow, StatusPill } from "@/components/admin/ui";
import { useCollection } from "@/lib/useCollection";
import { courses as siteCourses } from "@/lib/site";
import {
  formatDate,
  type AdminCourse,
  type AdminEnquiry,
  type AdminPayment,
  type AdminUser,
} from "@/lib/admin";

export default function AdminDashboardPage() {
  const users = useCollection<AdminUser>("users", 100);
  const enquiries = useCollection<AdminEnquiry>("enquiries", 100);
  const payments = useCollection<AdminPayment>("payments", 100);
  const firestoreCourses = useCollection<AdminCourse>("courses", 100);

  const activeUsers = users.rows.filter(
    (u) => (u.status || "active").toLowerCase() === "active"
  ).length;
  const disabledUsers = users.rows.filter(
    (u) => (u.status || "").toLowerCase() === "disabled"
  ).length;
  const pendingPayments = payments.rows.filter(
    (p) => (p.status || "pending").toLowerCase() === "pending"
  ).length;

  const courseRows: AdminCourse[] =
    firestoreCourses.rows.length > 0
      ? firestoreCourses.rows
      : siteCourses.map((c, i) => ({
          id: "site-" + i,
          title: c.title,
          category: c.category,
          level: c.level,
          duration: c.duration,
          fee: Number(String(c.price).replace(/[^0-9]/g, "")) || 0,
          oldFee: Number(String(c.oldPrice).replace(/[^0-9]/g, "")) || 0,
          status: "Active",
        }));

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Welcome back, Admin</h1>
      <p className="mt-1 text-sm text-slate-600">
        Everything happening on the NQT Infotech site, in one place.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={users.loading ? "-" : users.rows.length} tone="brand" />
        <StatCard label="Active users" value={users.loading ? "-" : activeUsers} tone="green" />
        <StatCard label="Disabled users" value={users.loading ? "-" : disabledUsers} tone="red" />
        <StatCard
          label="Contact queries"
          value={enquiries.loading ? "-" : enquiries.rows.length}
          tone="brand"
        />
      </div>

      <Panel
        title="Recent users"
        action={
          <Link href="/admin/users" className="text-sm font-semibold text-brand-600 hover:underline">
            View all
          </Link>
        }
      >
        <TableShell headers={["User", "Email", "Role", "Status", "Created", ""]}>
          {users.loading ? (
            <EmptyRow colSpan={6} text="Loading users..." />
          ) : users.error ? (
            <EmptyRow colSpan={6} text={users.error} />
          ) : users.rows.length === 0 ? (
            <EmptyRow colSpan={6} text="No registered users yet." />
          ) : (
            users.rows.slice(0, 5).map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">
                  {u.name || (u.email || "").split("@")[0]}
                </td>
                <td className="px-5 py-3 text-slate-600">{u.email || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{u.role || "User"}</td>
                <td className="px-5 py-3">
                  <StatusPill status={u.status || "Active"} />
                </td>
                <td className="px-5 py-3 text-slate-600">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-3" />
              </tr>
            ))
          )}
        </TableShell>
      </Panel>

      <Panel
        title="Courses"
        action={
          <Link href="/admin/courses" className="text-sm font-semibold text-brand-600 hover:underline">
            Manage courses
          </Link>
        }
      >
        <TableShell headers={["Course", "Category", "Fee", "Duration", "Status"]}>
          {courseRows.slice(0, 6).map((c) => (
            <tr key={c.id} className="border-b border-slate-50 last:border-0">
              <td className="px-5 py-3">
                <span className="font-medium text-navy-800">{c.title}</span>
                <span className="block text-xs text-slate-500">{c.level}</span>
              </td>
              <td className="px-5 py-3 text-slate-600">{c.category}</td>
              <td className="px-5 py-3 font-medium text-navy-800">
                {c.fee ? "₹" + c.fee.toLocaleString("en-IN") : "-"}
              </td>
              <td className="px-5 py-3 text-slate-600">{c.duration}</td>
              <td className="px-5 py-3">
                <StatusPill status={c.status || "Active"} />
              </td>
            </tr>
          ))}
        </TableShell>
        {firestoreCourses.rows.length === 0 ? (
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Showing the courses from the website. Import them into Firestore from the
            Courses page to edit them here.
          </p>
        ) : null}
      </Panel>

      <Panel
        title="Payment requests"
        action={
          <Link href="/admin/payments" className="text-sm font-semibold text-brand-600 hover:underline">
            View all
          </Link>
        }
      >
        <TableShell headers={["Student", "Course", "Amount", "Method", "Status"]}>
          {payments.loading ? (
            <EmptyRow colSpan={5} text="Loading payments..." />
          ) : payments.rows.length === 0 ? (
            <EmptyRow colSpan={5} text="No payment requests yet." />
          ) : (
            payments.rows.slice(0, 5).map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{p.studentName || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{p.courseTitle || "-"}</td>
                <td className="px-5 py-3 text-slate-600">
                  {p.amount ? "₹" + p.amount.toLocaleString("en-IN") : "-"}
                </td>
                <td className="px-5 py-3 text-slate-600">{p.method || "-"}</td>
                <td className="px-5 py-3">
                  <StatusPill status={p.status || "Pending"} />
                </td>
              </tr>
            ))
          )}
        </TableShell>
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          {pendingPayments} pending request{pendingPayments === 1 ? "" : "s"}.
        </p>
      </Panel>

      <Panel
        title="Contact queries"
        action={
          <Link href="/admin/queries" className="text-sm font-semibold text-brand-600 hover:underline">
            View all
          </Link>
        }
      >
        <TableShell headers={["Name", "Email", "Message", "Received"]}>
          {enquiries.loading ? (
            <EmptyRow colSpan={4} text="Loading queries..." />
          ) : enquiries.error ? (
            <EmptyRow colSpan={4} text={enquiries.error} />
          ) : enquiries.rows.length === 0 ? (
            <EmptyRow colSpan={4} text="No enquiries yet. They will appear here as soon as someone uses the contact form." />
          ) : (
            enquiries.rows.slice(0, 5).map((q) => (
              <tr key={q.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-navy-800">{q.name || "-"}</td>
                <td className="px-5 py-3 text-slate-600">{q.email || "-"}</td>
                <td className="max-w-md px-5 py-3 text-slate-600">
                  <span className="line-clamp-2">{q.message || "-"}</span>
                </td>
                <td className="px-5 py-3 text-slate-600">{formatDate(q.createdAt)}</td>
              </tr>
            ))
          )}
        </TableShell>
      </Panel>
    </>
  );
}
