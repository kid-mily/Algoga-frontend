import type { ReactNode } from "react";
import AdminAuthGuard from "@/features/admin/auth/components/AdminAuthGuard";
import StatisticAdminSidebar from "@/features/admin/common/StatisticAdminSidebar";
import ContentHeader from "@/features/admin/common/ContentHeader";


export default function StatisticAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <StatisticAdminSidebar />
        <div className="flex flex-1 flex-col">
          <ContentHeader />
          <main className="flex-1 bg-[#F8FAFC] p-8">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
