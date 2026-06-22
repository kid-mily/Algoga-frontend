import type { ReactNode } from "react";
import ContentHeader from "@/features/admin/common/Contentheader";
import SuperAdminSidebar from "@/features/admin/common/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <SuperAdminSidebar />

      <div className="flex flex-1 flex-col">
        <ContentHeader />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
