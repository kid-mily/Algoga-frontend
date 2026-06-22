import type { ReactNode } from "react";
import ContentHeader from "@/features/admin/common/Contentheader";
import StatisticAdminSidebar from "@/features/admin/common/StatisticAdminSidebar";

export default function StatisticAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <StatisticAdminSidebar />

      <div className="flex flex-1 flex-col">
        <ContentHeader />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
