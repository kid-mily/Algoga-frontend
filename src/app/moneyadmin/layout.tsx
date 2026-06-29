import AdminAuthGuard from "@/features/admin/auth/components/AdminAuthGuard";
import ContentHeader from "@/features/admin/common/ContentHeader";
import MoneySidebar from "@/features/admin/common/MoneySidebar";

export default function MoneyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-[#F8F8F8]">
        <MoneySidebar />
        <div className="flex flex-1 flex-col">
          <ContentHeader />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
