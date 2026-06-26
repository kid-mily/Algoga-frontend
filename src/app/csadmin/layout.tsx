import type { ReactNode } from "react";
import AdminAuthGuard from "@/features/admin/auth/AdminAuthGuard";
import CsSidebar from "@/features/admin/common/CsSidebar";
import ContentHeader from "@/features/admin/common/ContentHeader";

export default function CsAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-[#F8F8F8]">
        <CsSidebar />
        <div className="flex flex-1 flex-col">
          <ContentHeader />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
