import type { Metadata } from "next";
import { Suspense } from "react";
import ReportManageClient from "@/features/csadmin/report/components/ReportManageClient";

export const metadata: Metadata = {
  title: "신고 내역 관리 | 알고가 CS 관리자",
  description: "신고 내역을 페이지별로 조회하고 처리하는 CS 관리자 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

type ReportsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const parsedPage = Number(params?.page);
  const initialPage =
    Number.isFinite(parsedPage) && parsedPage >= 1
      ? Math.floor(parsedPage)
      : 1;

  return (
    <Suspense
      fallback={
        <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
          신고 내역을 불러오는 중입니다...
        </section>
      }
    >
      <ReportManageClient initialPage={initialPage} />
    </Suspense>
  );
}
