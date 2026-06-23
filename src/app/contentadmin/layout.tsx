import AdminAuthGuard from "@/features/admin/auth/AdminAuthGuard";
import ContentHeader from "@/features/admin/common/ContentHeader";
import ContentSidebar from "@/features/admin/common/ContentSidebar";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-[#F8F8F8]">
        <ContentSidebar />
        <div className="flex flex-1 flex-col">
          <ContentHeader />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
