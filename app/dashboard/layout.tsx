import type { Metadata } from "next";
import StudentShell from "@/components/StudentShell";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your NQT Infotech learning dashboard.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
