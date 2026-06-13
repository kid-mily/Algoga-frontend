import type { ReactNode } from "react";
import ContentHeader from "@/features/common/Contentheader";
import CsSidebar from "@/features/common/CsSidebar";

export default function CsAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <CsSidebar />

      <div className="flex flex-1 flex-col">
        <ContentHeader />

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
