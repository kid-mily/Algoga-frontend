import ContentHeader from "@/features/common/Contentheader";
import FinanceSidebar from "@/features/common/MoneySidebar";

export default function MoneyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <FinanceSidebar />

      <div className="flex flex-1 flex-col">
        <ContentHeader />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}