import ContentHeader from "@/features/admin/common/Contentheader";
import ContentSidebar from "@/features/admin/common/Contentsidebar";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      {/* 사이드바 */}
      <ContentSidebar />
      {/* 오른쪽 */}
      <div className="flex flex-1 flex-col">
        {/* 헤더 */}
        <ContentHeader />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}