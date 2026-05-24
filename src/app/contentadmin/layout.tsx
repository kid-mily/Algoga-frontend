import ContentSidebar from "@/features/common/ContentSidebar"
import ContentHeader from "@/features/common/ContentHeader"

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

        {/* 페이지 영역 */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}